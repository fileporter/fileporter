#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import fastapi
from .util import CookieManager


auth = fastapi.APIRouter(prefix="/auth")


@auth.post("/login")
async def login(
        cookies: CookieManager = CookieManager.dependency,
        username: str = fastapi.Body(),
        password: str = fastapi.Body()
):
    cookies["auth"] = f"{username}:{password}"


@auth.post("/logout")
async def logout(
        cookies: CookieManager = CookieManager.dependency,
):
    del cookies["auth"]
