#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import os
import fastapi
import fastapi.staticfiles
import fastapi.middleware.cors
import fastapi.middleware.gzip
from config import args, __version__
from api import api as api_router

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
app.mount(
    "/",
    fastapi.staticfiles.StaticFiles(
        directory=os.path.join(os.path.dirname(__file__), "web-ui"),
        html=True,
    )
)


@app.get("/{fp:path}", include_in_schema=False)
async def root(fp: str):
    fp = os.path.join(args.root, fp)
    if not os.path.isfile(fp):
        raise fastapi.HTTPException(fastapi.status.HTTP_404_NOT_FOUND)
    return fastapi.responses.FileResponse(fp)


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host=args.host, port=args.port, app_dir=os.path.dirname(__file__))
