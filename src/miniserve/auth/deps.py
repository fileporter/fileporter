#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import hmac
import hashlib
import typing as t
import fastapi.security
from config import config
from .util import CookieManager


security = fastapi.security.HTTPBasic()


USERNAME = config.username.lower()


async def get_credentials(cookies: CookieManager = CookieManager.dependency) -> t.Tuple[str, str]:
    try:
        auth: str = cookies["auth"]
    except KeyError:
        raise fastapi.HTTPException(fastapi.status.HTTP_401_UNAUTHORIZED, detail="missing credentials")
    username, sep, password = auth.partition(":")
    if sep is None:
        raise fastapi.HTTPException(fastapi.status.HTTP_401_UNAUTHORIZED)
    return username, password


if config.password is True:  # only --auth (use system password)
    # use system password
    import spwd
    import crypt

    try:
        spwd.getspnam(USERNAME)
    except PermissionError:
        raise PermissionError("unable to verify system password. please provide one with '--auth password'")

    def auth_system(credentials: fastapi.security.HTTPBasicCredentials = fastapi.Depends(security)):
        username = credentials.username.lower()
        password = credentials.password
        if username != USERNAME:
            raise fastapi.HTTPException(fastapi.status.HTTP_401_UNAUTHORIZED)

        try:
            enc_pwd = spwd.getspnam(username).sp_pwdp
        except KeyError:
            raise fastapi.HTTPException(fastapi.status.HTTP_401_UNAUTHORIZED)
        if not hmac.compare_digest(crypt.crypt(password, enc_pwd), enc_pwd):
            raise fastapi.HTTPException(fastapi.status.HTTP_401_UNAUTHORIZED)
elif isinstance(config.password, str):  # --auth [password]
    if config.password.startswith("hash:"):
        PASSWORD = config.password.removeprefix("hash:")
    else:
        PASSWORD = hashlib.sha256(config.password.encode()).hexdigest()

    def auth_system(credentials: fastapi.security.HTTPBasicCredentials = fastapi.Depends(security)):
        username = credentials.username.lower()
        if username != USERNAME:
            raise fastapi.HTTPException(fastapi.status.HTTP_401_UNAUTHORIZED)

        password = hashlib.sha256(credentials.password.encode()).hexdigest()
        if not hmac.compare_digest(password, PASSWORD):
            raise fastapi.HTTPException(fastapi.status.HTTP_401_UNAUTHORIZED)
else:  # no --auth used
    def auth_system():
        pass
