#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import os
import fastapi.staticfiles
import fastapi.middleware.cors
import fastapi.middleware.gzip
from config import args, __version__
from api import api as api_router
from preview import preview as preview_router

print(args)


app = fastapi.FastAPI(
    title="miniserve",
    version=__version__,
    docs_url=None,
    # redoc_url=None,
)
app.add_middleware(
    fastapi.middleware.gzip.GZipMiddleware,
)
app.add_middleware(
    fastapi.middleware.cors.CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)
app.include_router(api_router)
app.include_router(preview_router)
app.mount(
    "/files",
    fastapi.staticfiles.StaticFiles(
        directory=args.root,
    )
)
app.mount(
    "/",
    fastapi.staticfiles.StaticFiles(
        directory=os.path.join(os.path.dirname(__file__), "web-ui"),
        html=True,
    )
)


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host=args.host, port=args.port, app_dir=os.path.dirname(__file__))
