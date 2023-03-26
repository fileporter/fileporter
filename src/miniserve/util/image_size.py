#!/usr/bin/env python
# -*- coding: utf-8 -*-
# -------------------------------------------------------------------------------
# Name:        get_image_size
# Purpose:     extract image dimensions given a file path using just
#              core modules
#
# Author:      Paulo Scardine (based on code from Emmanuel VAÏSSE)
#
# Created:     26/09/2013
# Copyright:   (c) Paulo Scardine 2013
# Licence:     MIT
# -------------------------------------------------------------------------------
# https://stackoverflow.com/questions/15800704/get-image-size-without-loading-image-into-memory
# https://raw.githubusercontent.com/scardine/image_size/master/get_image_size.py
import os
import typing as t
import io
import struct


class UnknownImageFormat(Exception):
    pass


def get_image_size(file: t.Union[str, io.BytesIO]) -> t.Tuple[int, int]:
    """
    Return (width, height) for a given img file content - no external
    dependencies except the os and struct modules from core
    """
    # size = os.path.getsize(file_path)
    #
    # with open(file_path) as file:
    #     height = -1
    #     width = -1
    #     data = file.read(25)

    data: bytes
    size: int

    if isinstance(file, str):
        file = open(file, 'rb')

    try:
        data = file.read(25)

        file.seek(0, os.SEEK_END)
        size = file.tell()

        if (size >= 10) and data[:6] in (b'GIF87a', b'GIF89a'):
            # GIFs
            w, h = struct.unpack("<HH", data[6:10])
            width = int(w)
            height = int(h)
        elif ((size >= 24) and data.startswith(b'\211PNG\r\n\032\n')
              and (data[12:16] == b'IHDR')):
            # PNGs
            w, h = struct.unpack(">LL", data[16:24])
            width = int(w)
            height = int(h)
        elif (size >= 16) and data.startswith(b'\211PNG\r\n\032\n'):
            # older PNGs?
            w, h = struct.unpack(">LL", data[8:16])
            width = int(w)
            height = int(h)
        elif (size >= 2) and data.startswith(b'\377\330'):
            # JPEG
            msg = " raised while trying to decode as JPEG."
            file.seek(0)
            file.read(2)
            b = file.read(1)
            try:
                w, h = -1, -1
                while b and ord(b) != 0xDA:
                    while ord(b) != 0xFF:
                        b = file.read(1)
                    while ord(b) == 0xFF:
                        b = file.read(1)
                    if 0xC0 <= ord(b) <= 0xC3:
                        file.read(3)
                        h, w = struct.unpack(">HH", file.read(4))
                        break
                    else:
                        file.read(int(struct.unpack(">H", file.read(2))[0]) - 2)
                    b = file.read(1)
                width = int(w)
                height = int(h)
            except struct.error:
                raise UnknownImageFormat("StructError" + msg)
            except ValueError:
                raise UnknownImageFormat("ValueError" + msg)
            except Exception as e:
                raise UnknownImageFormat(e.__class__.__name__ + msg)
        else:
            raise UnknownImageFormat(
                "Sorry, don't know how to get information from this file."
            )
    finally:
        file.close()

    return width, height
