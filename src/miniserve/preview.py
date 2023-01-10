#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import os
import io
import tempfile
import mimetypes
import fastapi
from preview_generator.manager import PreviewManager
from preview_generator.exception import UnsupportedMimeType
from PIL import Image, UnidentifiedImageError
from config import args


preview = fastapi.APIRouter(prefix="/preview")


@preview.get("/{fp:path}")
async def root(fp: str, tasks: fastapi.BackgroundTasks):
    fp = os.path.join(args.root, fp.removeprefix("/"))
    if not os.path.isfile(fp):
        raise fastapi.HTTPException(fastapi.status.HTTP_404_NOT_FOUND)

    manager = PreviewManager(tempfile.gettempdir())
    try:
        if not manager.has_jpeg_preview(fp):
            raise fastapi.HTTPException(fastapi.status.HTTP_424_FAILED_DEPENDENCY)
    except UnsupportedMimeType:
        raise fastapi.HTTPException(fastapi.status.HTTP_424_FAILED_DEPENDENCY)

    fp = manager.get_jpeg_preview(fp)
    tasks.add_task(os.remove, fp)
    return fastapi.responses.FileResponse(fp)


lowRes = fastapi.APIRouter(prefix="/low-resolution")


@lowRes.get("/{fp:path}")
async def root(fp: str):
    raw_fp = fp.removeprefix("/")
    fp = os.path.join(args.root, raw_fp)
    if not os.path.isfile(fp):
        raise fastapi.HTTPException(fastapi.status.HTTP_404_NOT_FOUND)

    try:
        image = Image.open(fp)
    except UnidentifiedImageError:
        raise fastapi.HTTPException(fastapi.status.HTTP_415_UNSUPPORTED_MEDIA_TYPE)

    if image.is_animated:
        return fastapi.responses.RedirectResponse(f"/files/{raw_fp}")

    optimized = io.BytesIO()
    image = image.convert('RGB')
    image.save(optimized, format='JPEG')
    # image.save(optimized, format='JPEG', optimize=90)
    optimized.seek(0)

    return fastapi.Response(optimized.read(), media_type=mimetypes.guess_type(fp)[0])
