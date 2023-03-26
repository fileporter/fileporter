#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
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
