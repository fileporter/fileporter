#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import os
import logging
import mimetypes
try:
    import pymediainfo as pmi
    if not pmi.MediaInfo.can_parse():
        raise ImportError("libmediainfo.so.0 not found. please run 'sudo apt install -y libmediainfo-dev'")
except (ModuleNotFoundError, ImportError) as exc:
    logging.error("pymediainfo could not be imported", exc_info=exc)
    pmi = None
try:  # system-installed package for support
    import magic
except (ModuleNotFoundError, ImportError) as exc:
    logging.error("magic could not be imported", exc_info=exc)
    magic = None
from fastapi import HTTPException, status
from config import config
from . import models as m


def get_fp_meta(fp: str, shallow: bool = False) -> dict:
    path = os.path.relpath(fp, config.root)
    parent, basename = os.path.split(path)
    if os.path.isfile(fp):
        mime = mimetypes.guess_type(fp)[0]
        if mime is None:
            mime = magic.from_file(fp, mime=True)
        extension = os.path.splitext(fp)[1] or None
        return m.FileResponse(
            type="file",
            basename=basename,
            path=path,
            parent=parent,
            size=os.path.getsize(fp),
            mime=mime,
            extension=extension,
            **(get_media_info(fp) if pmi and not shallow else {})
        ).dict()
    elif os.path.isdir(fp):
        return m.DirectoryResponse(
            type="directory",
            basename=basename,
            path=path,
            parent=parent,
        ).dict()
    else:
        raise HTTPException(status.HTTP_404_NOT_FOUND)


def get_media_info(fp: str):
    media_info = pmi.MediaInfo.parse(fp, parse_speed=0.1)

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
