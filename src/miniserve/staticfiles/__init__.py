#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
from ._base import StaticFilesBase as StaticFiles
# loading to register them as subclasses
from .dir import StaticFiles as DirectoryStaticFiles
from .zip import StaticFiles as ZipFileStaticFiles
from .tar import StaticFiles as TarFileStaticFiles
