#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""
serve a directory in your local network for view over the browser
"""
import os
import getpass
import functools
import typing as t
from pathlib import Path
import pydantic
from .commandconfig import config as command_args
from .fileconfig import parser as file_config


class Configuration(pydantic.BaseModel):
    host: str = "0.0.0.0"
    port: t.Optional[int] = 8000
    root: t.Optional[pydantic.DirectoryPath] = "."
    username: t.Optional[str] = getpass.getuser()
    password: t.Optional[bool | str]
    worker: t.Optional[int] = min(8, os.cpu_count())
    root_path: t.Optional[pydantic.constr(regex=r"^/(.+/)*$")] = "/"
    uds: t.Optional[str]
    logs: t.Optional[bool]
    dotall: t.Optional[bool] = False
    dependencies: t.Optional[bool] = False
    cache: t.Optional[bool] = True
    web_ui: t.Optional[pydantic.DirectoryPath]
    development: t.Optional[bool] = False
    config: t.Optional[pydantic.FilePath]

    def __str__(self):
        return f"<args {self.__dict__}>"

    class Config:
        extra = pydantic.Extra.forbid  # error on wrong keys


VARIABLES = dict(
    APP=str(Path(__file__).parent.parent.resolve()),
    HOME=str(Path.home().resolve()),
)
try:
    config = Configuration(**{
        **functools.reduce(
            lambda a, b: a | b,
            [{key: value for key, value in file_config.items(section, vars=VARIABLES)} for section in file_config.sections()]
            + [{}]  # to prevent "TypeError: reduce() of empty iterable with no initial value"
        ),
        **{key: value for key, value in vars(command_args).items() if value}
    })
except pydantic.ValidationError as _:
    print(_)
    exit(1)
