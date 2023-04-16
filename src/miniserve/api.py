#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import os
import mimetypes
import typing as t
import fastapi
from pydantic import BaseModel
try:
    import magic
except (ModuleNotFoundError, ImportError):
    magic = None
from config import config
from util.image_size import get_image_size, UnknownImageFormat


api = fastapi.APIRouter(prefix="/api")


class ImageSize(BaseModel):
    width: int
    height: int


class BasicMetaModel(BaseModel):
    type: t.Literal["file", "directory"]
    basename: str
    filename: str
    path: str
    parent: str
    mime: t.Optional[str]
    size: t.Optional[ImageSize]
    extension: t.Optional[str]


class ResponseModel(BasicMetaModel):
    contents: t.Optional[t.List[BasicMetaModel]]


@api.head("/")
async def check_access():
    r"""
    this endpoint is used to verify if one has access (/is logged in)
    """
    return {}


@api.get("/{fp:path}", response_model=ResponseModel)
async def get_meta(fp: str = fastapi.Path()):
    r"""
    return the meta information about the given path
    """
    fp = os.path.join(config.root, fp.removeprefix("/"))
    response = meta(fp)
    if os.path.isdir(fp):
        response['contents'] = [meta(os.path.join(fp, _)) for _ in os.listdir(fp)
                                if config.dotall or not _.startswith(".")]
    return response


def meta(fp: str) -> dict:
    basename = os.path.basename(fp)
    path = os.path.relpath(fp, config.root)
    parent, filename = os.path.split(path)
    if os.path.isfile(fp):
        mime = mimetypes.guess_type(fp)[0]
        if mime is None:
            mime = magic.from_file(fp, mime=True)
        extension = os.path.splitext(fp)[1] or None
        data = dict(
            type="file",
            basename=basename,
            filename=filename,
            path=path,
            parent=parent,
            mime=mime,
            extension=extension,
        )
        if mime and mime.startswith("image/"):
            try:
                width, height = get_image_size(fp)
            except UnknownImageFormat:
                pass
            else:
                data['size'] = dict(width=width, height=height)
        return data
    elif os.path.isdir(fp):
        return dict(
            type="directory",
            basename=basename,
            filename=filename,
            path=path,
            parent=parent,
        )
    else:
        raise fastapi.HTTPException(fastapi.status.HTTP_404_NOT_FOUND)
