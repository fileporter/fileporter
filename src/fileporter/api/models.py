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
    extension: t.Optional[str] = None
    mime: t.Optional[str] = None
    dimensions: t.Optional[ImageSize] = None
    duration: t.Optional[float] = None
    has_audio: t.Optional[bool] = None
    has_video: t.Optional[bool] = None


class DirectoryRootTypeResponse(DirectoryResponse):
    contents: t.Optional[t.List[t.Union[DirectoryResponse, FileResponse]]]
