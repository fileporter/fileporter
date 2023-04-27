#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import asyncio
import json
import time
import uuid
import socket
import hashlib
import typing as t
from collections import defaultdict
import urllib.parse as urlparse

import fastapi

from config import config


def get_network_ip():
    # socket.gethostbyname(socket.gethostname()) is bad (returns sometimes 127.0.1.1 or so)
    # `socket.gethostbyname(socket.gethostname())` doesn't work always
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as client:
        client.settimeout(0)
        client.connect(("8.8.8.8", 80))
        return client.getsockname()[0]


def get_allowed_origins():
    ips = ["localhost", "0.0.0.0", get_network_ip(), socket.getfqdn()]
    for ip in ips:
        yield f"http://{ip}"
        yield f"https://{ip}"
        yield f"http://{ip}:{config.port}"
        yield f"https://{ip}:{config.port}"
        if config.development:
            yield f"http://{ip}:3000"
            yield f"https://{ip}:3000"


# important: sync with scripts/make-password-encryption
def password_hash(password: str | bytes):
    if isinstance(password, str):
        password = password.encode()
    return hashlib.pbkdf2_hmac(
        hash_name="sha256",
        password=password,
        salt=str(uuid.getnode()).encode(),  # device dependent salt (same device == same salt)
        iterations=50_000,
    ).hex()


@fastapi.Depends
async def get_cookies(request: fastapi.Request, response: fastapi.Response) -> 'CookieManager':
    return CookieManager(request=request, response=response)


class CookieManager:
    r"""
    note: special cookies-keys in the format 'ms-{key}-{quote(root-path)}' to prevent mixing cookies when multiple
        instances are running simultaneously on the same machine with different root-paths
    """
    dependency = get_cookies

    class _DataType(t.TypedDict):
        path: str
        value: t.Any

    def __init__(self, request: fastapi.Request, response: fastapi.Response):
        self.request = request
        self.response = response

    @staticmethod
    def _formatKey(key: str) -> str:
        return f"ms-{key}-{urlparse.quote(config.root_path, safe='')}"

    def __contains__(self, key):
        return self._formatKey(key) in self.request.cookies

    def __setitem__(self, key: str, value: t.Any):
        data: CookieManager._DataType = dict(path=config.root_path, value=value)
        dumped = json.dumps(data)
        self.response.set_cookie(self._formatKey(key), dumped,
                                 max_age=2592000,  # dunno, one month or so
                                 path=config.root_path, httponly=True, samesite="strict")

    def __getitem__(self, key: str):
        dumped = self.request.cookies.get(self._formatKey(key))
        if dumped is None:  # over get to print the right key in es exception
            raise KeyError(key)
        data: CookieManager._DataType = json.loads(dumped)
        if data["path"] != config.root_path:
            raise KeyError(key)
        return data["value"]

    def __delitem__(self, key: str):
        key = self._formatKey(key)
        if key in self.request.cookies:
            self.response.delete_cookie(key, path=config.root_path, httponly=True, samesite="strict")


def rate_limited(times: int) -> fastapi.Depends:
    requests = defaultdict(list)

    async def cleanup(client: str):
        await asyncio.sleep(60)
        requests[client].pop(0)

    @fastapi.Depends
    def dependency(request: fastapi.Request, tasks: fastapi.BackgroundTasks):
        client = getattr(request.client, 'host', "localhost")  # request.client could be none
        if len(requests[client]) >= times:
            raise fastapi.HTTPException(fastapi.status.HTTP_429_TOO_MANY_REQUESTS)
        requests[client].append(time.time())
        tasks.add_task(cleanup, client)

    return dependency
