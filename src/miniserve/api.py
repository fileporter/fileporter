#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import os
import mimetypes
import typing as t
import fastapi
from pydantic import BaseModel
from config import args
from image_size import get_image_size, UnknownImageFormat


api = fastapi.APIRouter(prefix="/api")


class BasicMetaModel(BaseModel):
    type: t.Literal["file", "directory"]
    basename: str
    path: str
    directory: str
    mime: t.Optional[str]
    size: t.Optional[t.Tuple[int, int]]


class ResponseModel(BasicMetaModel):
    contents: t.Optional[t.List[BasicMetaModel]]


@api.get("/{fp:path}", response_model=ResponseModel)
async def get_meta(fp: str):
    fp = os.path.join(args.root, fp.removeprefix("/"))
    response = meta(fp)
    if os.path.isdir(fp):
        response['contents'] = [meta(os.path.join(fp, _)) for _ in os.listdir(fp)
                                if args.dotall or not _.startswith(".")]
    return response


def meta(fp: str) -> dict:
    basename = os.path.basename(fp)
    path = os.path.relpath(fp, args.root)
    directory = os.path.split(path)[0]
    if os.path.isfile(fp):
        mime = mimetypes.guess_type(fp)[0]
        data = dict(
            type="file",
            basename=basename,
            path=path,
            directory=directory,
            mime=mime,
        )
        if mime and mime.startswith("image/"):
            try:
                data['size'] = get_image_size(fp)
            except UnknownImageFormat:
                pass
        return data
    elif os.path.isdir(fp):
        return dict(
            type="directory",
            basename=basename,
            path=path,
            directory=directory,
        )
    else:
        raise fastapi.HTTPException(fastapi.status.HTTP_404_NOT_FOUND)
