#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import os
import os.path as p
import pathlib
import typing as t

from starlette.responses import Response, FileResponse

from ._base import StaticFilesBase
from ._util import LookupResult


class StaticFiles(StaticFilesBase):
    @staticmethod
    def can_handle(path: str | pathlib.Path) -> bool:
        return pathlib.Path(path).is_dir()

    def verify_directory(self) -> None:
        if not self.directory.is_dir():
            raise NotADirectoryError(self.directory)

    def lookup(self, path: str) -> t.Optional[LookupResult]:
        filepath = self.directory.joinpath(path)
        if p.commonprefix([self.directory, filepath]) != str(self.directory):
            return None
        return LookupResult(
            filepath=filepath,
            is_file=p.isfile(filepath),
            is_directory=p.isdir(filepath),
        )

    def get_file_response(self, path: str, status_code: int, method: str) -> Response:
        return FileResponse(
            path=path,
            status_code=status_code,
            method=method,
        )
