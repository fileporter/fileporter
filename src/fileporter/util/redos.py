#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""
Regex Denial of Service
"""
from sre_constants import error as SreError
from regexploit.ast.sre import SreOpParser
from regexploit.redos import find_redos


def is_redos(pattern: str):
    try:
        parsed = SreOpParser().parse_sre(pattern)
    except SreError:
        return False
    return any(redo.starriness > 2 for redo in find_redos(parsed))
