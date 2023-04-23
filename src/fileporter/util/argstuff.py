#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
from pathlib import Path
import argparse


def ranged(mini, maxi, cls=int):
    def range_checker(arg):
        try:
            f = cls(arg)
        except ValueError:
            raise argparse.ArgumentTypeError("bad value")
        if f < mini or f > maxi:
            raise argparse.ArgumentTypeError(f"must be in range [{mini}..{maxi}]")
        return f

    return range_checker


def existing_path(path: str):
    return Path(path).expanduser().resolve(strict=True)
