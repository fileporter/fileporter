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
    realpath: str
    parent: str


class DirectoryResponse(BaseResponse):
    type: t.Literal["directory"]


class FileResponse(BaseResponse):
    type: t.Literal["file"]
    size: int
    extension: t.Optional[str]
    mime: t.Optional[str]
    dimensions: t.Optional[ImageSize]
    duration: t.Optional[float]
    has_audio: t.Optional[bool]
    has_video: t.Optional[bool]


class DirectoryRootTypeResponse(DirectoryResponse):
    contents: t.Optional[t.List[t.Union[DirectoryResponse, FileResponse]]]
