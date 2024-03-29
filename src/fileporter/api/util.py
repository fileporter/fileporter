#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import os.path as p
import logging
import mimetypes
try:
    import pymediainfo as pmi
    if not pmi.MediaInfo.can_parse():
        raise ImportError("libmediainfo.so.0 not found. please run 'sudo apt install -y libmediainfo-dev'")
except (ModuleNotFoundError, ImportError, OSError) as exc:
    logging.error("pymediainfo could not be imported", exc_info=exc)
    pmi = None
try:  # system-installed package for support
    import magic
except (ModuleNotFoundError, ImportError, OSError) as exc:
    logging.error("magic could not be imported", exc_info=exc)
    magic = None
from fastapi import HTTPException, status
from config import config
from . import models as m
from .get_image_size import get_image_size, UnknownImageFormat


def get_fp_meta(fp: str, shallow: bool = False) -> dict:
    path = p.relpath(fp, config.root)
    realpath = p.relpath(p.realpath(fp, strict=False), config.root)
    parent, basename = p.split(path)
    if p.isfile(fp):
        mime = mimetypes.guess_type(fp)[0]
        if magic and not mime:
            mime = magic.from_file(fp, mime=True)
        extension = p.splitext(fp)[1] or None
        return m.FileResponse(
            type="file",
            basename=basename,
            path=path,
            realpath=realpath,
            parent=parent,
            size=p.getsize(fp),
            mime=mime,
            extension=extension,
            **(get_media_info(fp) if pmi and not shallow else {})
        ).dict()
    elif p.isdir(fp):
        return m.DirectoryResponse(
            type="directory",
            basename=basename,
            path=path,
            realpath=realpath,
            parent=parent,
        ).dict()
    else:
        raise HTTPException(status.HTTP_404_NOT_FOUND)


def get_media_info(fp: str):
    mime = mimetypes.guess_type(fp)[0]
    # get_image_size is waaaaay faster than pmi
    if mime and mime.startswith("image/"):
        try:
            width, height = get_image_size(fp)
        except UnknownImageFormat:
            pass
        else:
            return dict(
                dimensions=dict(width=width, height=height),
                duration=None,
                has_video=False,
                has_audio=False,
            )

    if not mime or mime.startswith("text/"):
        return dict(
            dimensions=None,
            duration=None,
            has_video=False,
            has_audio=False,
        )

    media_info = pmi.MediaInfo.parse(fp, parse_speed=0.25)

    if media_info.image_tracks:
        dimensions = dict(width=media_info.image_tracks[0].width, height=media_info.image_tracks[0].height)
    elif media_info.video_tracks:
        dimensions = dict(width=media_info.video_tracks[0].width, height=media_info.video_tracks[0].height)
    else:
        dimensions = None
    if dimensions is not None and (dimensions["width"] is None or dimensions["height"] is None):
        dimensions = None

    if media_info.video_tracks:
        duration = media_info.video_tracks[0].duration
    elif media_info.audio_tracks:
        duration = media_info.audio_tracks[0].duration
    else:
        duration = None

    return dict(
        dimensions=dimensions,
        duration=float(duration) / 1000 if duration else None,  # msecs to secs
        has_video=len(media_info.video_tracks) > 0,
        has_audio=len(media_info.audio_tracks) > 0,
    )
