#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import io
import os
import os.path as p
import tempfile
import zlib
import logging
import fastapi
import anyio
from preview_generator.manager import PreviewManager
from preview_generator.utils import LOGGER_NAME as PREVIEW_LOGGER_NAME
from preview_generator.exception import UnsupportedMimeType
from wand.exceptions import MissingDelegateError
from PIL import Image, UnidentifiedImageError
from config import config


if not config.dependencies:
    logging.getLogger(PREVIEW_LOGGER_NAME).setLevel(logging.CRITICAL)


# DELETION of the Previews is done at the end of the execution
CACHE = tempfile.TemporaryDirectory()

preview = fastapi.APIRouter()
manager = PreviewManager(CACHE.name)


@preview.get(
    "/preview/{fp:path}",
    responses={
        200: {
            'content': {"image/jpeg": {}},
        },
    },
    response_class=fastapi.responses.FileResponse,
)
async def get_preview(request: fastapi.Request,
                      tasks: fastapi.BackgroundTasks,
                      fp: str = fastapi.Path(),
                      directories: bool = fastapi.Query(False)):
    fp = p.join(config.root, fp.removeprefix("/"))
    if not p.exists(fp):
        raise fastapi.HTTPException(fastapi.status.HTTP_404_NOT_FOUND)

    if p.isdir(fp):
        if not directories:
            raise fastapi.HTTPException(fastapi.status.HTTP_422_UNPROCESSABLE_ENTITY)
        else:
            files = [name for name in os.listdir(fp) if p.isfile(p.join(fp, name))]
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
        preview_fp = await anyio.to_thread.run_sync(manager.get_jpeg_preview, fp)
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
async def low_resolution(fp: str = fastapi.Path()):
    raw_fp = fp.removeprefix("/")
    fp = p.join(config.root, raw_fp)
    if not p.isfile(fp):
        raise fastapi.HTTPException(fastapi.status.HTTP_404_NOT_FOUND)

    path, filename = p.split(fp)
    cache_name = p.join(CACHE.name, f"{zlib.adler32(path.encode())}-{filename}")

    if config.cache and p.isfile(cache_name):
        return fastapi.responses.FileResponse(cache_name, filename=filename)

    try:
        image = await anyio.to_thread.run_sync(Image.open, fp)
    except UnidentifiedImageError:
        raise fastapi.HTTPException(fastapi.status.HTTP_415_UNSUPPORTED_MEDIA_TYPE)

    if getattr(image, 'is_animated', False):
        return fastapi.responses.RedirectResponse(f"/files/{raw_fp}")

    # note: not threaded. should be fast enough!?
    optimized = io.BytesIO()
    image.thumbnail((2000, 2000))  # limit size
    image = image.convert('RGB')  # needed to save as jpg
    image.save(optimized, format='JPEG')
    # image.save(optimized, format='JPEG', optimize=90)
    optimized.seek(0)  # seek to start for read

    content = optimized.read()

    # note: maybe move to background-task
    if config.cache:
        async with await anyio.open_file(cache_name, "wb") as file:
            await file.write(content)

    # faster than to send now a FileResponse
    return fastapi.Response(content, media_type="image/jpeg")
