#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import os
import argparse
from util.argstuff import ranged
from __version__ import __version__


parser = argparse.ArgumentParser(
    description=__doc__,
    add_help=True,
)

parser.add_argument('-v', '--version', action="version", version=__version__)
parser.add_argument('--config', help="configuration file to use")
parser.add_argument('--local', action="store_const", const="127.0.0.1", dest="host",
                    help="serve only locally")
# parser.add_argument('--global', action="store_const", const="0.0.0.0", dest="host",
#                     help="serve in the local network")
parser.add_argument('-p', '--port', type=int,
                    help="port to serve on")
parser.add_argument('--user', dest="username",
                    help="specify username for login")
parser.add_argument('--auth', nargs='?', const=...,
                    help="requires user-login")
parser.add_argument('-w', '--worker', type=ranged(1, 8),
                    help="number of workers to use")
parser.add_argument('--dotall', action="store_true",
                    help="serve also dot-files")
parser.add_argument('--no-cache', dest="cache", action="store_false",
                    help="disable cache for previews and low-resolution images")
parser.add_argument('root', type=os.path.expanduser, nargs='?',
                    help="directory to serve")

args = parser.parse_args()
