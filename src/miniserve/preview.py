#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import os
import io
import tempfile
import mimetypes
import logging
import fastapi
from preview_generator.manager import PreviewManager
from preview_generator.utils import LOGGER_NAME as PREVIEW_LOGGER_NAME
from preview_generator.exception import UnsupportedMimeType
from wand.exceptions import MissingDelegateError
from PIL import Image, UnidentifiedImageError
from config import args


if not args.dependencies:
    logging.getLogger(PREVIEW_LOGGER_NAME).setLevel(logging.CRITICAL)

preview = fastapi.APIRouter()
manager = PreviewManager(tempfile.gettempdir())


@preview.get("/preview/{fp:path}")
async def get_preview(request: fastapi.Request,
                      tasks: fastapi.BackgroundTasks,
                      fp: str = fastapi.Path(),
                      directory: bool = fastapi.Query(False)):
    fp = os.path.join(args.root, fp.removeprefix("/"))
    if not os.path.exists(fp):
        raise fastapi.HTTPException(fastapi.status.HTTP_404_NOT_FOUND)

    if os.path.isdir(fp):
        if not directory:
            raise fastapi.HTTPException(fastapi.status.HTTP_422_UNPROCESSABLE_ENTITY)
        else:
            files = os.listdir(fp)
            if not files:
                raise fastapi.HTTPException(fastapi.status.HTTP_404_NOT_FOUND)
            return fastapi.responses.RedirectResponse(
                url=request.url_for("get_preview", fp=os.path.join(fp, files[0])),
                status_code=fastapi.status.HTTP_302_FOUND,
            )

    try:
        if not manager.has_jpeg_preview(fp):
            raise fastapi.HTTPException(fastapi.status.HTTP_424_FAILED_DEPENDENCY)
    except UnsupportedMimeType:
        raise fastapi.HTTPException(fastapi.status.HTTP_424_FAILED_DEPENDENCY)

    try:
        fp = manager.get_jpeg_preview(fp)
    except MissingDelegateError:
        raise fastapi.HTTPException(fastapi.status.HTTP_424_FAILED_DEPENDENCY)

    tasks.add_task(os.remove, fp)
    return fastapi.responses.FileResponse(fp)


lowRes = fastapi.APIRouter()


@lowRes.get("/low-resolution/{fp:path}")
async def low_resolution(fp: str = fastapi.Path()):
    raw_fp = fp.removeprefix("/")
    fp = os.path.join(args.root, raw_fp)
    if not os.path.isfile(fp):
        raise fastapi.HTTPException(fastapi.status.HTTP_404_NOT_FOUND)

    try:
        image = Image.open(fp)
    except UnidentifiedImageError:
        raise fastapi.HTTPException(fastapi.status.HTTP_415_UNSUPPORTED_MEDIA_TYPE)

    if getattr(image, 'is_animated', False):
        return fastapi.responses.RedirectResponse(f"/files/{raw_fp}")

    optimized = io.BytesIO()
    image = image.convert('RGB')
    image.save(optimized, format='JPEG')
    # image.save(optimized, format='JPEG', optimize=90)
    optimized.seek(0)

    return fastapi.Response(optimized.read(), media_type=mimetypes.guess_type(fp)[0])
