#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import typing as t
import pydantic as p


class ImageSize(p.BaseModel):
    width: int
    height: int


class BaseResponse(p.BaseModel):
    basename: str
    path: str
    parent: str


class DirectoryResponse(BaseResponse):
    type: t.Literal["directory"]


class FileResponse(BaseResponse):
    type: t.Literal["file"]
    extension: t.Optional[str]
    mime: t.Optional[str]
    size: t.Optional[ImageSize]
    duration: t.Optional[float]
    has_audio: bool
    has_video: bool


class DirectoryRootTypeResponse(DirectoryResponse):
    contents: t.Optional[t.List[t.Union[DirectoryResponse, FileResponse]]]
