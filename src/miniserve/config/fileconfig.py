#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import os.path as p
from pathlib import Path
import configparser
from .commandconfig import args


def find_config_file():
    if args.config:
        return args.config
    for fp in [
        '/etc/miniserve/config.ini',
        p.expanduser('~/.config/miniserve/config.ini'),
    ]:
        if p.isfile(fp):
            return fp
    return None


parser = configparser.ConfigParser(
    allow_no_value=False,
    delimiters=("=", ":"),
    comment_prefixes=("#", ";"),
    inline_comment_prefixes="#",
    strict=True,
    empty_lines_in_values=False,
    interpolation=configparser.ExtendedInterpolation(),
)
parser.optionxform = lambda option: option.lower().replace('-', '_')  # 'Hello-World' => 'hello_world'
# default values for interpolation
parser.read_dict({
    "DEFAULT": {
        "APP": Path(__file__).parent.parent.resolve(),
        "HOME": Path.home().resolve(),
    }
})
config_file = find_config_file()
if config_file:
    if not parser.read(config_file):
        raise configparser.ParsingError(config_file)
