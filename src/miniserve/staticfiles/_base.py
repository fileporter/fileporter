#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import inspect
import os
import pathlib
import os.path as p
import typing as t
from abc import abstractmethod
from email.utils import parsedate

import anyio.to_thread
from fastapi import status
from starlette.exceptions import HTTPException
from starlette.responses import Response, RedirectResponse
from starlette.datastructures import URL, Headers
from starlette.types import Scope, Receive, Send

from ._util import NotModifiedResponse, LookupResult


INDEX_FILES = ["index.html", "index.htm"]


class StaticFilesBase:
    __IMPLEMENTATIONS = []

    @staticmethod
    @abstractmethod
    def can_handle(path: str | pathlib.Path) -> bool:
        ...

    def __init_subclass__(cls):
        StaticFilesBase.__IMPLEMENTATIONS.append(cls)

    def __new__(cls, directory, *args, **kwargs):
        if cls is not StaticFilesBase:
            return super().__new__(cls)

        for implementation in StaticFilesBase.__IMPLEMENTATIONS:
            if implementation.can_handle(directory):
                return super().__new__(implementation)
        raise NotImplementedError(f"not supported staticfiles resource ({directory})")

    def __init__(
            self,
            directory: str | pathlib.Path,
            *,
            html: bool = False,
            cacheability: t.Literal["public", "private", "no-cache", "no-store"] = "public",
            max_age: int = 60 * 10,  # 10 minutes
            # allow_export: bool = False,  # ?export => .zip or so
            check_exists: bool = True,
    ) -> None:
        self.directory = pathlib.Path(directory).resolve(strict=check_exists)
        self.html = html
        self.cacheability = cacheability
        self.max_age = max_age
        self.verify_directory()

    @abstractmethod
    def verify_directory(self) -> None:
        ...

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        """
        The ASGI entry point.
        """
        assert scope["type"] == "http"

        path = self.get_path_from_scope(scope)
        response = await self.get_response(path, scope)
        await response(scope, receive, send)

    @staticmethod
    def get_path_from_scope(scope: Scope) -> str:
        return p.normpath(p.join(*scope["path"].split("/")))

    async def get_response(self, path: str, scope: Scope) -> Response:
        if scope["method"] not in ("GET", "HEAD"):
            raise HTTPException(status_code=status.HTTP_405_METHOD_NOT_ALLOWED)

        try:
            lookup = await anyio.to_thread.run_sync(
                self.lookup, path,
            )
        except PermissionError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

        # stat.S_ISREG(mode): Return non-zero if the mode is from a regular file.
        if lookup and lookup.is_file:
            return self.file_response(
                path=lookup.filepath,
                scope=scope,
            )

        # stat.S_ISDIR(mode): Return non-zero if the mode is from a directory.
        elif lookup and lookup.is_directory and self.html:
            for index_filename in INDEX_FILES:
                index_path = p.join(path, index_filename)
                lookup = await anyio.to_thread.run_sync(
                    self.lookup, index_path,
                )
                if lookup and lookup.is_file:
                    if not scope["path"].endswith("/"):
                        # Directory URLs should redirect to always end in "/".
                        url = URL(scope=scope)
                        url = url.replace(path=url.path + "/")
                        return RedirectResponse(url=url)
                    return self.file_response(
                        path=lookup.filepath,
                        scope=scope
                    )

        if self.html:
            # Check for '404.html' if we're in HTML mode.
            lookup = await anyio.to_thread.run_sync(
                self.lookup, "404.html"
            )
            if lookup and lookup.is_file:
                return self.file_response(
                    lookup.filepath,
                    scope=scope,
                    status_code=status.HTTP_404_NOT_FOUND,
                    allow_not_modified_response=False,
                )
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    @abstractmethod
    def lookup(self, path: str) -> LookupResult:
        ...

    def file_response(
            self,
            path: str,
            scope: Scope,
            status_code: int = 200,
            allow_not_modified_response: bool = True
    ) -> Response:
        method = scope["method"]
        request_headers = Headers(scope=scope)

        response_or_iter = self.get_file_response(
            path=path, status_code=status_code, method=method,
        )
        response: Response = next(response_or_iter) if inspect.isgenerator(response_or_iter) else response_or_iter
        if allow_not_modified_response \
            and self.is_not_modified(response_headers=response.headers,
                                     request_headers=request_headers):
            return NotModifiedResponse(response.headers)
        return response

    @abstractmethod
    def get_file_response(
            self,
            path: str,
            status_code: int,
            method: str,
    ) -> Response | t.Iterator[Response]:
        ...

    @staticmethod
    def is_not_modified(
            response_headers: Headers, request_headers: Headers
    ) -> bool:
        try:
            if_none_match = request_headers["if-none-match"]
            etag = response_headers["etag"]
            if if_none_match == etag:
                return True
        except KeyError:
            pass

        try:
            if_modified_since = parsedate(request_headers["if-modified-since"])
            last_modified = parsedate(response_headers["last-modified"])
            if (
                    if_modified_since is not None
                    and last_modified is not None
                    and if_modified_since >= last_modified
            ):
                return True
        except KeyError:
            pass

        return False
