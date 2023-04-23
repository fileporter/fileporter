#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""
see the documentation for more information.
docs: https://fileporter.github.io/docs/
"""
import argparse
from util.argstuff import ranged, existing_path
from __version__ import __version__


parser = argparse.ArgumentParser(
    prog="fileporter",
    description=__doc__,
    add_help=True,
    allow_abbrev=False,
)

parser.add_argument('-v', '--version', action="version", version=__version__)
parser.add_argument('--config', type=existing_path,
                    help="configuration file to use")
parser.add_argument('--local', action="store_const", const="127.0.0.1", dest="host",
                    help=argparse.SUPPRESS)
parser.add_argument('--global', action="store_const", const="0.0.0.0", dest="host",
                    help=argparse.SUPPRESS)
parser.add_argument('-p', '--port', type=int,
                    help="port to serve on")
parser.add_argument('--user', '--username', dest="username",
                    help=argparse.SUPPRESS)
parser.add_argument('--pw', '--password', dest="password",
                    help="requires user-login")
parser.add_argument('-w', '--worker', type=ranged(1, 8),
                    help=argparse.SUPPRESS)
parser.add_argument('--root-path',
                    help=argparse.SUPPRESS)
parser.add_argument('--uds',
                    help=argparse.SUPPRESS)
parser.add_argument('--logs', action=argparse.BooleanOptionalAction,
                    help=argparse.SUPPRESS)
parser.add_argument('--dotall', action=argparse.BooleanOptionalAction,
                    help="serve also dot-files")
parser.add_argument('--dependencies', action=argparse.BooleanOptionalAction,
                    help=argparse.SUPPRESS)
parser.add_argument('--cache', action=argparse.BooleanOptionalAction,
                    help=argparse.SUPPRESS)
parser.add_argument('--web-ui', type=existing_path,
                    help=argparse.SUPPRESS)
parser.add_argument('--development', '--dev', action=argparse.BooleanOptionalAction,
                    help=argparse.SUPPRESS)
parser.add_argument('root', type=existing_path, nargs='?',
                    help="directory to serve")

args = parser.parse_args()
