#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import hashlib
import fastapi
from .util import CookieManager
from .deps import Credentials, auth_system


auth = fastapi.APIRouter(prefix="/auth")


@auth.post("/login")
async def login(
        cookies: CookieManager = CookieManager.dependency,
        username: str = fastapi.Body(),
        password: str = fastapi.Body()
):
    phash = hashlib.sha256(password.encode()).hexdigest()
    auth_system(Credentials(username=username, phash=phash))
    cookies["auth"] = [
        username,
        phash,
    ]


@auth.post("/logout")
async def logout(
        cookies: CookieManager = CookieManager.dependency,
):
    del cookies["auth"]
