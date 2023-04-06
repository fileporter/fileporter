#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import os
import pathlib
import typing as t
import tarfile
import datetime

from starlette.responses import Response

from ._base import StaticFilesBase
from ._util import LookupResult, FileLikeResponse


class BadTarFile(tarfile.TarError):
    pass


class StaticFiles(StaticFilesBase):
    @staticmethod
    def can_handle(path: str | pathlib.Path) -> bool:
        return tarfile.is_tarfile(pathlib.Path(path))

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.archive = tarfile.TarFile.open(self.directory)

    def verify_directory(self) -> None:
        if not tarfile.is_tarfile(self.directory):
            raise BadTarFile(str(self.directory))

    def lookup(self, path: str) -> [str, t.Optional[os.stat_result]]:
        try:
            info = self.archive.gettarinfo(path)
        except KeyError:
            return None
        return LookupResult(
            filepath=path,
            is_file=not info.isfile(),
            is_directory=info.isdir(),
        )

    def get_file_response(self, path: str, status_code: int, method: str):
        info = self.archive.gettarinfo(path)
        with self.archive.extractfile(path) as file:
            yield FileLikeResponse(
                stream=file,
                status_code=status_code,
                filename=info.name,
                last_modified=info.mtime,
                file_size=info.size,
                method=method,
            )
