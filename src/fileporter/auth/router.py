#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import hashlib
import fastapi

from .util import CookieManager
from .deps import Credentials, auth_system


auth = fastapi.APIRouter(prefix="/auth")


@auth.post("/login", response_model=dict)
async def login(
        cookies: CookieManager = CookieManager.dependency,
        username: str = fastapi.Body(),
        password: str = fastapi.Body()
):
    r"""
    verifies the login credentials and sets corresponding cookies
    """
    phash = hashlib.sha256(password.encode()).hexdigest()
    auth_system(Credentials(username=username, phash=phash))
    cookies["auth"] = [
        username,
        phash,
    ]
    return {}


@auth.post("/logout", response_model=dict)
async def logout(
        cookies: CookieManager = CookieManager.dependency,
):
    r"""
    logs the current user out
    """
    del cookies["auth"]
    return {}
