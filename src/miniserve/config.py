#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""
serve a directory in your local network for view over the browser
"""
__version_info__ = (0, 1, 0)
__version__ = ".".join(str(_) for _ in __version_info__)

import os
import getpass
import argparse
from util.argstuff import ranged


class NameSpace:
    host: str
    port: int
    root: str
    username: str
    auth: str
    worker: int
    root_path: str
    uds: str
    logs: bool
    dotall: bool
    dependencies: bool
    cache: bool

    def __repr__(self):
        return f"<args {self.__dict__}>"


parser = argparse.ArgumentParser(
    description=__doc__,
    formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    add_help=True,
)

parser.add_argument('-v', '--version', action="version", version=__version__)
parser.add_argument('--local', action="store_const", const="127.0.0.1", dest="host", default="0.0.0.0",
                    help="serve only locally")
# parser.add_argument('--global', action="store_const", const="0.0.0.0", dest="host",
#                     help="serve in the local network")
parser.add_argument('-p', '--port', type=int,
                    help="port to serve on", default=8000)
parser.add_argument('--user', dest="username", default=getpass.getuser(),
                    help="specify username for login")
parser.add_argument('--auth', nargs='?', const=..., default=None,
                    help="requires user-login")
parser.add_argument('-w', '--worker', type=ranged(1, 8),
                    help="number of workers to use", default=min(8, os.cpu_count()))
parser.add_argument('--show-logs', dest="logs", default=False, type=bool,
                    help="whether or not to show logs into output")
parser.add_argument('--dotall', action="store_true", default=False,
                    help="serve also dot-files")
parser.add_argument('--dependencies', action="store_true", default=False,
                    help="show which dependencies are missing for previews")
parser.add_argument('--no-cache', dest="cache", action="store_false", default=True,
                    help="disable cache for previews and low-resolution images")
parser.add_argument('--root-path', default="/",
                    help="root-path for urls (behind a reverse proxy)")
parser.add_argument('--uds', default=None,
                    help="bind to a UNIX domain socket (behind a reverse proxy)")
parser.add_argument('root', type=os.path.expanduser, nargs='?', default=".",
                    help="directory to serve")

args = parser.parse_args(namespace=NameSpace())
