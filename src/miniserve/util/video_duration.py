#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

warning: this is probably partially incomplete or incorrect
important: no guaranty that this shit works.

links:
- https://web.archive.org/web/20180219054429/http://l.web.umkc.edu/lizhu/teaching/2016sp.video-communication/ref/mp4.pdf
"""
import os
import struct
import typing as t
from dataclasses import dataclass


class UnknownVideoFormat(Exception):
    pass


HEADER_SIZE = 8


@dataclass
class Box:
    name: str
    size: int


@dataclass
class Moov:
    mvhd: t.Optional['Mvhd']
    traks: t.List['Trak']

    @classmethod
    def parse(cls, file: t.IO, box: Box):
        endpos = file.tell() + box.size - HEADER_SIZE
        mvhd: t.Optional['Mvhd'] = None
        traks: t.List['Trak'] = []
        while file.tell() < endpos:
            head = file.read(HEADER_SIZE)
            if not head:
                break
            size, = struct.unpack(">I", head[0:4])
            name, = struct.unpack("4s", head[4:8])
            if name == b'mvhd':
                mvhd = Mvhd.parse(file, Box(name=name, size=size))
            elif name == b'trak':
                traks.append(Trak.parse(file, Box(name=name, size=size)))
            else:
                file.seek(file.tell() + size - HEADER_SIZE)
        return cls(mvhd=mvhd, traks=traks)


@dataclass
class Mvhd:
    creation_time: int
    modification_time: int
    timescale: int
    duration: int
    rate: int
    volume: int

    @classmethod
    def parse(cls, file: t.IO, box: Box):
        chunk = file.read(box.size - HEADER_SIZE)
        version, = struct.unpack("b", chunk[0:1])
        fmt = ">4xLLILIH" if version else ">4xIIIIH2xH"
        return cls(
            *struct.unpack(fmt, chunk[:struct.calcsize(fmt)])
        )


@dataclass
class Trak:
    tkhd: t.Optional['Trhd']

    @classmethod
    def parse(cls, file: t.IO, box: Box):
        endpos = file.tell() + box.size - HEADER_SIZE
        tkhd: t.Optional['Trhd'] = None
        while file.tell() < endpos:
            head = file.read(HEADER_SIZE)
            if not head:
                break
            size, = struct.unpack(">I", head[0:4])
            name, = struct.unpack("4s", head[4:8])
            if name == b'tkhd':
                tkhd = Trhd.parse(file, Box(name=name, size=size))
            else:
                file.seek(file.tell() + size - HEADER_SIZE)
        return cls(tkhd=tkhd)


@dataclass
class Trhd:
    creation_time: int
    modification_time: int
    track_ID: int
    duration: int
    layer: int
    alternate_group: int
    volume: int
    width: int
    height: int

    @classmethod
    def parse(cls, file: t.IO, box: Box):
        chunk = file.read(box.size - HEADER_SIZE)
        version, = struct.unpack("b", chunk[0:1])
        fmt = ">4xLLI4xL8xHHH2x36xH2xH2x" if version else ">4xIII4xI8xHHH2x36xH2xH2x"
        return cls(
            *struct.unpack(fmt, chunk[:struct.calcsize(fmt)]),
        )


@dataclass
class VideoMeta:
    duration: t.Optional[float]
    size: t.Optional[t.Tuple[int, int]]


def get_video_meta(filename: str) -> VideoMeta:
    try:
        with open(filename, 'rb') as file:
            file.seek(0, os.SEEK_END)
            endpos = file.tell()
            file.seek(0)
            moov: t.Optional[Moov] = None
            while file.tell() < endpos:
                head = file.read(HEADER_SIZE)
                if not head:
                    break
                size, = struct.unpack(">I", head[0:4])
                name, = struct.unpack("4s", head[4:8])
                if not size:
                    break
                if name == b'moov':
                    moov = Moov.parse(file, Box(name=name, size=size))
                else:
                    file.seek(file.tell() + size - HEADER_SIZE)
        if moov is None:
            raise UnknownVideoFormat("no movie-header found")
        return VideoMeta(
            duration=moov.mvhd.duration / moov.mvhd.timescale,
            size=(moov.traks[0].tkhd.width, moov.traks[0].tkhd.height) if len(moov.traks) else None,
        )
    except struct.error:
        raise UnknownVideoFormat("bad file structure")
    except Exception as exc:
        raise UnknownVideoFormat(f"{exc.__class__.__name__}: {exc}")
