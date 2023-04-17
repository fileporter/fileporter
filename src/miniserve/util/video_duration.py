#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
from dataclasses import dataclass
import struct


class UnknownVideoFormat(Exception):
    pass


@dataclass
class MovieHeader:
    creation_time: int
    modification_time: int
    timescale: int
    duration: int
    rate: int
    volume: int

    @classmethod
    def parse(cls, chunk: bytes):
        version, = struct.unpack("b", chunk[0:1])
        fmt = ">4xLLILIH" if version else ">4xIIIIH2xH"
        return cls(
            *struct.unpack(fmt, chunk[:struct.calcsize(fmt)])
        )


@dataclass
class TrackHeader:
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
    def parse(cls, chunk: bytes):
        version, = struct.unpack("b", chunk[0:1])
        fmt = ">4xLLI4xL8xHHH2x36xH2xH2x" if version else ">4xIII4xI8xHHH2x36xH2xH2x"
        return cls(
            *struct.unpack(fmt, chunk[:struct.calcsize(fmt)]),
        )


@dataclass
class VideoMeta:
    movie: MovieHeader
    tracks: list[TrackHeader]


def get_video_meta(filename: str):
    r"""
    warning: this is partially incomplete or incorrect
    what's working: movie.duration, movie.timescale, tracks.0.width, tracks.0.height
    important: not guaranty

    links:
    - https://web.archive.org/web/20180219054429/http://l.web.umkc.edu/lizhu/teaching/2016sp.video-communication/ref/mp4.pdf
    """
    try:
        with open(filename, 'rb') as file:
            meta = VideoMeta(movie=None, tracks=[])
            for _ in range(100_000):  # limit it
                head = file.read(8)
                if not head:
                    break
                size, = struct.unpack(">I", head[0:4])
                name, = struct.unpack("4s", head[4:8])
                if not size:
                    break
                if name == b'mvhd':  # movie-header
                    chunk = file.read(size)
                    meta.movie = MovieHeader.parse(chunk)
                elif name == b'tkhd':
                    chunk = file.read(size)
                    meta.tracks.append(TrackHeader.parse(chunk))
                else:
                    file.seek(file.tell() + size)
        if meta.movie is None:
            raise UnknownVideoFormat("no movie-header found")
        return meta
    except struct.error:
        raise UnknownVideoFormat("bad file structure")
    except Exception as exc:
        raise UnknownVideoFormat(f"{exc.__class__.__name__}: {exc}")
