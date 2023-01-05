#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import os
import typing as t
import fastapi
from pydantic import BaseModel
from config import args

api = fastapi.APIRouter(prefix="/.miniserve-api")


class BasicMetaModel(BaseModel):
    type: t.Literal["file", "directory"]
    basename: str
    path: str


class ResponseModel(BasicMetaModel):
    contents: t.Optional[t.List[BasicMetaModel]]


@api.get("/{fp:path}", response_model=ResponseModel)
async def get_meta(fp: str):
    fp = os.path.join(args.root, fp)
    print(fp)
    response = meta(fp)
    if os.path.isdir(fp):
        response['contents'] = [meta(os.path.join(fp, _)) for _ in os.listdir(fp)
                                if args.dotall or not _.startswith(".")]
    return response


def meta(fp: str) -> dict:
    if os.path.isfile(fp):
        return dict(
            type="file",
            basename=os.path.basename(fp),
            path=fp,
        )
    elif os.path.isdir(fp):
        return dict(
            type="directory",
            basename=os.path.basename(fp),
            path=fp,
        )
    else:
        raise fastapi.HTTPException(fastapi.status.HTTP_404_NOT_FOUND)
