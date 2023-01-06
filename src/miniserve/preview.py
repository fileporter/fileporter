#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import os
import tempfile
import fastapi
from preview_generator.manager import PreviewManager
from preview_generator.exception import UnsupportedMimeType
from config import args


preview = fastapi.APIRouter(prefix="/preview")


@preview.get("/{fp:path}")
async def root(fp: str, tasks: fastapi.BackgroundTasks):
    fp = os.path.join(args.root, fp)
    if not os.path.isfile(fp):
        raise fastapi.HTTPException(fastapi.status.HTTP_404_NOT_FOUND)

    file_ext = ""

    manager = PreviewManager(tempfile.gettempdir())
    try:
        if not manager.has_jpeg_preview(fp, file_ext=file_ext):
            raise fastapi.HTTPException(fastapi.status.HTTP_424_FAILED_DEPENDENCY)
    except UnsupportedMimeType:
        raise fastapi.HTTPException(fastapi.status.HTTP_424_FAILED_DEPENDENCY)

    fp = manager.get_jpeg_preview(fp, file_ext=file_ext)
    tasks.add_task(os.remove, fp)
    return fastapi.responses.FileResponse(fp)
