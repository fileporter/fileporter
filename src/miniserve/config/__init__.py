#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""
serve a directory in your local network for view over the browser
"""
import os
import getpass
import functools
import typing as t
import pydantic
from .commandconfig import args as command_args
from .fileconfig import parser as file_config


class NameSpace(pydantic.BaseModel):
    host: str = "0.0.0.0"
    port: t.Optional[int] = 8000
    root: t.Optional[str] = "."
    username: t.Optional[str] = getpass.getuser()
    password: t.Optional[str | t.Literal[Ellipsis]]
    worker: t.Optional[int] = min(8, os.cpu_count())
    root_path: t.Optional[str] = "/"
    uds: t.Optional[str]
    logs: t.Optional[str]
    dotall: t.Optional[bool] = False
    dependencies: t.Optional[bool] = False
    cache: t.Optional[bool] = True

    def __str__(self):
        return f"<args {self.__dict__}>"

    class Config:
        extra = pydantic.Extra.forbid  # error on wrong keys


args = NameSpace(**{
    **functools.reduce(lambda a, b: a | b, (
        {key: value for key, value in file_config.items(section)} for section in file_config)
                       ),
    **{key: value for key, value in vars(command_args).items() if value}
})
