#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import os.path as p
import mimetypes

mimetypes.init([
    p.join(p.dirname(__file__), "additional.mime.types")
])
