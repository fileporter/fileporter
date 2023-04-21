#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import os
import typing as t
import fastapi
from config import config
from .models import DirectoryRootTypeResponse, FileResponse
from .util import get_fp_meta


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
    fp = os.path.join(config.root, fp.removeprefix("/"))
    response = get_fp_meta(fp)
    if os.path.isdir(fp):
        response['contents'] = [get_fp_meta(os.path.join(fp, _)) for _ in os.listdir(fp)
                                if config.dotall or not _.startswith(".")]
    return response
