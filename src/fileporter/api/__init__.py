#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import os
import os.path as p
import re
import fnmatch
import typing as t
import fastapi
from config import config
from .models import DirectoryRootTypeResponse, DirectoryResponse, FileResponse
from .util import get_fp_meta


api = fastapi.APIRouter(prefix="/api")
ROOT = p.abspath(str(config.root))


@api.head("/")
async def check_access():
    r"""
    this endpoint is used to verify if one has access (/is logged in)
    """
    pass  # HEAD has no response-body


@api.get(
    "/meta/{fp:path}",
    response_model=t.Union[FileResponse, DirectoryRootTypeResponse],
    response_model_exclude_none=True,
)
def get_meta(fp: str = fastapi.Path()):
    r"""
    return the meta information about the given path
    """
    fp = p.join(ROOT, fp.removeprefix("/"))
    if p.commonpath([ROOT, fp]) != ROOT:
        raise fastapi.HTTPException(fastapi.status.HTTP_403_FORBIDDEN, detail="Outside root-directory")
    response = get_fp_meta(fp)
    if p.isdir(fp):
        response['contents'] = [get_fp_meta(p.join(fp, name)) for name in os.listdir(fp)
                                if config.dotall or not name.startswith(".")]
    return response


@api.get(
    "/search/{source:path}",
    response_model=t.List[t.Union[FileResponse, DirectoryResponse]],
    response_model_exclude_none=True,
)
def search(
        source: str = fastapi.Path(description="source directory from which should be searched from"),
        query: str = fastapi.Query(min_length=1, description="the actual query-string"),
        sensitive: bool = fastapi.Query(False, description="case-sensitive search"),
        files: bool = fastapi.Query(True, description="whether or not to include files in the search"),
        directories: bool = fastapi.Query(True, description="whether or not to include directories in the search"),
        limit: int = fastapi.Query(100, gt=0, le=500, description="Soft limit of how many results to return"),
):
    r"""
    more on [fnmatch](https://docs.python.org/3/library/fnmatch.html)

    more on [regex](https://docs.python.org/3/library/re.html)
    """
    if not files and not directories:
        return []
    source = os.path.join(config.root, source.removeprefix("/"))
    results = []
    try:
        pattern = fnmatch.translate(query).removesuffix(r"\Z")
        regex = re.compile(pattern, 0 if sensitive else re.IGNORECASE)
    except (TypeError, ValueError):
        raise fastapi.HTTPException(fastapi.status.HTTP_400_BAD_REQUEST)
    for dirpath, dirnames, filenames in os.walk(source, followlinks=False):
        if not config.dotall:  # yes. this works
            for dname in (_ for _ in dirnames if _.startswith(".")):
                dirnames.remove(dname)
        if files:
            results.extend(
                p.join(dirpath, fname)
                for fname in filenames
                if (config.dotall or not fname.startswith(".")) and regex.search(fname) is not None
            )
        if directories:
            results.extend(
                p.join(dirpath, dname) for dname in dirnames
                if (config.dotall or not dname.startswith(".")) and regex.search(dname) is not None
            )
        if len(results) >= limit:
            break
    return [get_fp_meta(_, shallow=True) for _ in results]
