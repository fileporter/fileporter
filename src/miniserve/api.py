#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import os
import mimetypes
import typing as t
import fastapi
from pydantic import BaseModel
import pymediainfo as pmi
try:
    import magic
except (ModuleNotFoundError, ImportError):
    magic = None
from config import config


api = fastapi.APIRouter(prefix="/api")


class ImageSize(BaseModel):
    width: int
    height: int


class BasicMetaModel(BaseModel):
    type: t.Literal["file", "directory"]
    basename: str
    path: str
    parent: str
    extension: t.Optional[str]
    mime: t.Optional[str]
    size: t.Optional[ImageSize]
    duration: t.Optional[float]
    has_audio: t.Optional[bool]
    has_video: t.Optional[bool]


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
    path = os.path.relpath(fp, config.root)
    parent, basename = os.path.split(path)
    if os.path.isfile(fp):
        mime = mimetypes.guess_type(fp)[0]
        if mime is None:
            mime = magic.from_file(fp, mime=True)
        extension = os.path.splitext(fp)[1] or None
        data = dict(
            type="file",
            basename=basename,
            path=path,
            parent=parent,
            mime=mime,
            extension=extension,
            **get_media_info(fp)
        )
        return data
    elif os.path.isdir(fp):
        return dict(
            type="directory",
            basename=basename,
            path=path,
            parent=parent,
        )
    else:
        raise fastapi.HTTPException(fastapi.status.HTTP_404_NOT_FOUND)


def get_media_info(fp: str):
    media_info = pmi.MediaInfo.parse(fp, parse_speed=0.25)

    if media_info.image_tracks:
        size = dict(width=media_info.image_tracks[0].width, height=media_info.image_tracks[0].height)
    elif media_info.video_tracks:
        size = dict(width=media_info.video_tracks[0].width, height=media_info.video_tracks[0].height)
    else:
        size = None
    if size is not None and size["width"] is None or size["height"] is None:
        size = None

    if media_info.video_tracks:
        duration = media_info.video_tracks[0].duration
    elif media_info.audio_tracks:
        duration = media_info.audio_tracks[0].duration
    else:
        duration = None

    return dict(
        size=size,
        duration=float(duration) / 1000 if duration else None,  # msecs to secs
        has_video=len(media_info.video_tracks) > 0,
        has_audio=len(media_info.audio_tracks) > 0,
    )
