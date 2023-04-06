#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import os
import pathlib
import typing as t
import zipfile
import datetime

from starlette.responses import Response

from ._base import StaticFilesBase
from ._util import LookupResult, FileLikeResponse


class StaticFiles(StaticFilesBase):
    @staticmethod
    def can_handle(path: str | pathlib.Path) -> bool:
        return zipfile.is_zipfile(pathlib.Path(path))

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.archive = zipfile.ZipFile(self.directory)

    def verify_directory(self) -> None:
        if not zipfile.is_zipfile(self.directory):
            raise zipfile.BadZipFile(str(self.directory))

    def lookup(self, path: str) -> [str, t.Optional[os.stat_result]]:
        try:
            info = self.archive.getinfo(path)
        except KeyError:
            return None
        return LookupResult(
            filepath=path,
            is_file=not info.is_dir(),
            is_directory=info.is_dir(),
        )

    def get_file_response(self, path: str, status_code: int, method: str):
        info = self.archive.getinfo(path)
        with self.archive.open(path) as file:
            yield FileLikeResponse(
                stream=file,
                status_code=status_code,
                filename=info.filename,
                last_modified=datetime.datetime(*info.date_time).timestamp(),
                file_size=info.file_size,
                method=method,
            )
