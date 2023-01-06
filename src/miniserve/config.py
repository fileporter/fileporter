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
    worker: int
    root: str
    dotall: bool

    def __repr__(self):
        return f"<args {self.__dict__}>"


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
parser.add_argument('-w', '--worker', type=int,
                    help="number of workers to use", default=os.cpu_count())
parser.add_argument('--dotall', action="store_true",
                    help="serve also dot-files", default=False)
parser.add_argument('root', type=str, nargs='?', default=".",
                    help="directory to serve")


args = parser.parse_args(namespace=NameSpace())
