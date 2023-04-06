#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import io
import os
import typing as t
import mimetypes
import urllib.parse as urlparse
from email.utils import formatdate
from dataclasses import dataclass
import anyio
import hashlib
from starlette.background import BackgroundTask
from starlette.responses import Response
from starlette.datastructures import Headers
from starlette.types import Scope, Receive, Send


@dataclass(eq=False, order=False, frozen=True, kw_only=True)
class LookupResult:
    filepath: str
    is_file: bool
    is_directory: bool


class NotModifiedResponse(Response):
    NOT_MODIFIED_HEADERS = (
        "cache-control",
        "content-location",
        "date",
        "etag",
        "expires",
        "vary",
    )

    def __init__(self, headers: Headers):
        super().__init__(
            status_code=304,
            headers={
                name: value
                for name, value in headers.items()
                if name in self.NOT_MODIFIED_HEADERS
            },
        )


# modified version of starlette.responses.FileResponse
class FileLikeResponse(Response):
    chunk_size = 64 * 1024

    # noinspection PyMissingConstructor
    def __init__(
            self,
            stream: t.IO,
            status_code: int = 200,
            headers: t.Optional[t.Mapping[str, str]] = None,
            media_type: t.Optional[str] = None,
            background: t.Optional[BackgroundTask] = None,
            filename: t.Optional[str] = None,
            last_modified: t.Optional[float] = None,
            file_size: t.Optional[int] = None,
            method: t.Optional[str] = None,
            content_disposition_type: str = "attachment",
    ) -> None:
        self.stream = stream
        self.status_code = status_code
        self.filename = filename or stream.name
        self.send_header_only = method is not None and method.upper() == "HEAD"
        if media_type is None:
            media_type = mimetypes.guess_type(self.filename)[0] or "text/plain"
        self.media_type = media_type
        self.background = background
        self.init_headers(headers)
        if self.filename is not None:
            content_disposition_filename = urlparse.quote(self.filename)
            if content_disposition_filename != self.filename:
                content_disposition = "{}; filename*=utf-8''{}".format(
                    content_disposition_type, content_disposition_filename
                )
            else:
                content_disposition = '{}; filename="{}"'.format(
                    content_disposition_type, self.filename
                )
            self.headers.setdefault("content-disposition", content_disposition)
        self.set_stat_headers(
            last_modified=last_modified,
            file_size=file_size,
        )

    def set_stat_headers(self, last_modified: float, file_size: int) -> None:
        last_modified_fmt = formatdate(last_modified, usegmt=True)
        self.headers.setdefault("last-modified", last_modified_fmt)

        if file_size:
            content_length = file_size
        elif self.stream.seekable():
            offset = self.stream.tell()
            self.stream.seek(os.SEEK_END)
            content_length = self.stream.tell()
            self.stream.seek(offset)
        else:
            return

        self.headers.setdefault("content-length", str(content_length))

        etag_base = str(last_modified) + "-" + str(content_length)
        etag = hashlib.md5(etag_base.encode()).hexdigest()
        self.headers.setdefault("etag", etag)

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        await send(
            {
                "type": "http.response.start",
                "status": self.status_code,
                "headers": self.raw_headers,
            }
        )
        if self.send_header_only:
            await send({"type": "http.response.body", "body": b"", "more_body": False})
        else:
            async with await anyio.wrap_file(self.stream) as file:
                more_body = True
                while more_body:
                    chunk = await file.read(self.chunk_size)
                    more_body = len(chunk) == self.chunk_size
                    await send(
                        {
                            "type": "http.response.body",
                            "body": chunk,
                            "more_body": more_body,
                        }
                    )
        if self.background is not None:
            await self.background()
