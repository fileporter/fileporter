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
from util.redos import is_redos


api = fastapi.APIRouter(prefix="/api")


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
async def get_meta(fp: str = fastapi.Path()):
    r"""
    return the meta information about the given path
    """
    fp = p.join(config.root, fp.removeprefix("/"))
    if p.commonpath([config.root, fp]) != str(config.root):
        raise fastapi.HTTPException(fastapi.status.HTTP_403_FORBIDDEN)
    response = get_fp_meta(fp)
    if p.isdir(fp):
        response['contents'] = [get_fp_meta(p.join(fp, _)) for _ in os.listdir(fp)
                                if config.dotall or not _.startswith(".")]
    return response


@api.get(
    "/search/{source:path}",
    response_model=t.List[t.Union[FileResponse, DirectoryResponse]],
    response_model_exclude_none=True,
)
async def search(
        source: str = fastapi.Path(description="source directory from which should be searched from"),
        query: str = fastapi.Query(min_length=1, description="the actual query-string"),
        mode: t.Literal["regex", "fnmatch"] = fastapi.Query("fnmatch", description="how to handle 'query'"),
        sensitive: bool = fastapi.Query(False, description="case-sensitive search"),
        files: bool = fastapi.Query(True, description="whether or not to include files in the search"),
        directories: bool = fastapi.Query(True, description="whether or not to include directories in the search"),
):
    r"""
    more on [fnmatch](https://docs.python.org/3/library/fnmatch.html)

    more on [regex](https://docs.python.org/3/library/re.html)
    """
    # regex denial of service (eg: `(a+)+b`)
    if mode == "regex" and is_redos(query):
        raise fastapi.HTTPException(fastapi.status.HTTP_422_UNPROCESSABLE_ENTITY, "")
    if not files and not directories:
        return []
    source = os.path.join(config.root, source.removeprefix("/"))
    results = []
    pattern = query if mode == "regex" else fnmatch.translate(query)
    try:
        regex = re.compile(pattern, 0 if sensitive else re.IGNORECASE)
    except (TypeError, ValueError):
        raise fastapi.HTTPException(fastapi.status.HTTP_400_BAD_REQUEST)
    for dirpath, dirnames, filenames in os.walk(source, followlinks=False):
        if not config.dotall:  # yes. this works
            for dname in (_ for _ in dirnames if _.startswith(".")):
                dirnames.remove(dname)
        if files:
            results.extend(
                p.join(dirpath, fname) for fname in filenames
                if (config.dotall or not fname.startswith("."))
                and regex.search(fname) is not None
            )
        if directories:
            results.extend(
                p.join(dirpath, dname) for dname in dirnames
                if (config.dotall or not dname.startswith("."))
                and regex.search(dname) is not None
            )
    return [get_fp_meta(_, shallow=True) for _ in results]
