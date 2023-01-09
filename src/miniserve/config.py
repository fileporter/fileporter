#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
__version_info__ = (0, 1, 0)
__version__ = ".".join(str(_) for _ in __version_info__)

import os
import argparse


class NameSpace:
    host: str
    port: int
    auth: str
    worker: int
    root: str
    dotall: bool

    def __repr__(self):
        return f"<args {self.__dict__}>"


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


parser = argparse.ArgumentParser(
    description=__doc__,
    formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    add_help=True)

parser.add_argument('-v', '--version', action="version", version=__version__)
parser.add_argument('--local', action="store_const", const="127.0.0.1", dest="host", default="0.0.0.0",
                    help="serve only locally")
# parser.add_argument('--global', action="store_const", const="0.0.0.0", dest="host",
#                     help="serve in the local network")
parser.add_argument('-p', '--port', type=int,
                    help="port to serve on", default=8000)
parser.add_argument('--auth', nargs='?', const=..., default=None,
                    help="requires user-login")
parser.add_argument('-w', '--worker', type=ranged(1, 8),
                    help="number of workers to use", default=os.cpu_count())
parser.add_argument('--dotall', action="store_true",
                    help="serve also dot-files", default=False)
parser.add_argument('root', type=os.path.expanduser, nargs='?', default=".",
                    help="directory to serve")


args = parser.parse_args(namespace=NameSpace())
