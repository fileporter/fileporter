#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import hmac
import hashlib
import typing as t
from collections import namedtuple
import fastapi
from config import config
from .util import CookieManager, password_hash


USERNAME = config.username.lower()


Credentials = namedtuple("Credentials", ["username", "phash"])


async def get_credentials(cookies: CookieManager = CookieManager.dependency) -> Credentials:
    try:
        username, phash = cookies["auth"]
    except (KeyError, ValueError):
        raise fastapi.HTTPException(fastapi.status.HTTP_401_UNAUTHORIZED)
    return Credentials(username=username, phash=phash)


if isinstance(config.password, str):  # --auth [password]
    if config.password.startswith("hash:"):
        PHASH = config.password.removeprefix("hash:")
    else:
        PHASH = password_hash(password=config.password)

    def auth_system(credentials: Credentials = fastapi.Depends(get_credentials)):
        if credentials.username != USERNAME:
            raise fastapi.HTTPException(fastapi.status.HTTP_401_UNAUTHORIZED)

        if not hmac.compare_digest(credentials.phash, PHASH):
            raise fastapi.HTTPException(fastapi.status.HTTP_401_UNAUTHORIZED)
else:  # no --auth used
    def auth_system(_=None):
        pass
