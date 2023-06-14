#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import atexit
import io
import mimetypes
import os
import os.path as p
import shutil
import tempfile
import threading
import time
import zlib
import logging
import fastapi
from preview_generator.manager import PreviewManager
from preview_generator.utils import LOGGER_NAME as PREVIEW_LOGGER_NAME
from preview_generator.exception import UnsupportedMimeType
from wand.exceptions import MissingDelegateError
from PIL import Image, UnidentifiedImageError
# from util.temp_manager import TempManager
from config import config


if not config.dependencies:
    logging.getLogger(PREVIEW_LOGGER_NAME).setLevel(logging.CRITICAL)

# CACHE = TempManager(f"fileporter-{zlib.adler32(config.root_path.encode())}")
CACHE = p.join(tempfile.gettempdir(), f"fileporter-{zlib.adler32(config.root_path.encode())}")
os.makedirs(CACHE, exist_ok=True)
_last_call = 0
_interval = 60*5
_lock = threading.Lock()

preview = fastapi.APIRouter()
manager = PreviewManager(CACHE)


@atexit.register
def cleanup_tempdir():
    if p.isdir(CACHE):
        shutil.rmtree(CACHE)


def checkCache():
    global _last_call
    threshold = time.time() - _interval
    if _last_call < threshold:
        _last_call = time.time()
        with _lock:
            for fname in os.listdir(CACHE):
                fpath = p.join(CACHE, fname)
                try:
                    atime = p.getatime(fpath)  # last access time
                    if atime < threshold:
                        os.remove(fpath)
                except (OSError, PermissionError, FileNotFoundError):
                    continue


@preview.get(
    "/preview/{fp:path}",
    responses={
        200: {
            'content': {"image/jpeg": {}},
        },
    },
    response_class=fastapi.responses.FileResponse,
)
def get_preview(
        request: fastapi.Request,
        tasks: fastapi.BackgroundTasks,
        fp: str = fastapi.Path(),
        directories: bool = fastapi.Query(False)
):
    r"""
    generates a small preview image of the given file
    directories are by default disabled. but can be enabled with the '?directories' flag.
    This returns the preview of one file in the directory
    """
    checkCache()
    fp = p.join(config.root, fp.removeprefix("/"))
    if not p.exists(fp):
        raise fastapi.HTTPException(fastapi.status.HTTP_404_NOT_FOUND)

    if p.isdir(fp):
        if not directories:
            raise fastapi.HTTPException(fastapi.status.HTTP_422_UNPROCESSABLE_ENTITY)
        else:
            files = [name for name in os.listdir(fp)
                     if p.isfile(p.join(fp, name))
                     and (config.dotall or not name.startswith("."))]
            if not files:
                raise fastapi.HTTPException(fastapi.status.HTTP_422_UNPROCESSABLE_ENTITY)
            return fastapi.responses.RedirectResponse(
                url=request.url_for("get_preview", fp=p.relpath(p.join(fp, files[0]), config.root)),
                status_code=fastapi.status.HTTP_302_FOUND,
            )

    try:
        if not manager.has_jpeg_preview(fp):
            raise fastapi.HTTPException(fastapi.status.HTTP_422_UNPROCESSABLE_ENTITY)
    except UnsupportedMimeType:
        raise fastapi.HTTPException(fastapi.status.HTTP_422_UNPROCESSABLE_ENTITY)

    try:
        preview_fp = manager.get_jpeg_preview(fp)
    except MissingDelegateError:
        raise fastapi.HTTPException(fastapi.status.HTTP_422_UNPROCESSABLE_ENTITY)

    if not config.cache:
        tasks.add_task(os.remove, preview_fp)

    return fastapi.responses.FileResponse(preview_fp, filename=p.split(fp)[1])


lowRes = fastapi.APIRouter()


@lowRes.get(
    "/low-resolution/{fp:path}",
    responses={
        200: {
            'content': {"image/jpeg": {}},
        },
    },
    response_class=fastapi.responses.FileResponse,
)
def low_resolution(
        request: fastapi.Request,
        fp: str = fastapi.Path()
):
    r"""
    returns a low-resolution version of the given image. (jpeg format + may be reduced in size [max w/h: 2000])
    if the image is animated then it is redirected to the original version.
    """
    checkCache()
    raw_fp = fp.removeprefix("/")
    fp = p.join(config.root, raw_fp)
    if not p.isfile(fp):
        raise fastapi.HTTPException(fastapi.status.HTTP_404_NOT_FOUND)

    path, filename = p.split(fp)
    cache_name = p.join(CACHE, f"{zlib.adler32(path.encode())}-{filename}")

    if config.cache and p.isfile(cache_name):
        return fastapi.responses.FileResponse(cache_name, filename=filename)

    try:
        image = Image.open(fp)
    except UnidentifiedImageError:
        mime = mimetypes.guess_type(raw_fp)[0]
        if mime and mime.startswith("image/"):  # should be something like svg
            return fastapi.responses.RedirectResponse(
                url=request.url_for("files", path=raw_fp),
                status_code=fastapi.status.HTTP_303_SEE_OTHER,
            )
        raise fastapi.HTTPException(fastapi.status.HTTP_415_UNSUPPORTED_MEDIA_TYPE)

    if getattr(image, 'is_animated', False):
        return fastapi.responses.RedirectResponse(
            url=request.url_for("files", path=raw_fp),
            status_code=fastapi.status.HTTP_303_SEE_OTHER,
        )

    # note: not threaded. should be fast enough!?
    optimized = io.BytesIO()
    optimized.name = filename
    image.thumbnail((2000, 2000))  # limit size (but keep aspect)
    image = image.convert('RGB')  # needed to save as jpg
    image.save(optimized, format='JPEG')
    # image.save(optimized, format='JPEG', optimize=90)
    optimized.seek(0)  # seek to start for read

    content = optimized.read()

    if config.cache:
        with open(cache_name, "wb") as file:
            file.write(content)

    # faster than to send now a FileResponse
    return fastapi.Response(content, media_type="image/jpeg")
