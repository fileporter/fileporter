#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
from pathlib import Path
import fastapi.middleware.cors
import fastapi.middleware.gzip
# import fastapi.staticfiles
# baize is needed for better FileResponses because starlette doesn't support range-headers
from baize.asgi.staticfiles import (
    Files as StaticFiles,
    # Pages as StaticPages  # bad 404 fallback handling
)
from fastapi.staticfiles import StaticFiles as StaticPages
from config import config
from __version__ import __version__
import auth
from api import api as api_router
from preview import (
    preview as preview_router,
    lowRes as lowRes_router
)


app = fastapi.FastAPI(
    debug=config.development,
    title="miniserve",
    description=__doc__,
    version=__version__,
    docs_url=None,
    # redoc_url=None,
    dependencies=[fastapi.Depends(auth.auth_dependency)],
    # root_path=args.root_path,
)
app.add_middleware(
    fastapi.middleware.gzip.GZipMiddleware,
)
app.add_middleware(
    fastapi.middleware.cors.CORSMiddleware,
    allow_origins=list(auth.get_origins()),
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)
app.include_router(api_router)
app.include_router(preview_router)
app.include_router(lowRes_router)
app.mount(
    "/files",
    StaticFiles(
        directory=config.root
    )
)
app.mount(
    "/",
    StaticPages(
        directory=Path(Path(config.web_ui) if config.web_ui else Path(__file__).parent.joinpath("web-ui")).resolve(),
        html=True
    )
)
