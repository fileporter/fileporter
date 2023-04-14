#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import socket
import functools
import typing as t
import json

import fastapi

from config import config


def get_network_ip():
    # socket.gethostbyname(socket.gethostname()) is bad (returns sometimes 127.0.1.1 or so)
    # `socket.gethostbyname(socket.gethostname())` doesn't work always
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as client:
        client.settimeout(0)
        client.connect(("8.8.8.8", 80))
        return client.getsockname()[0]


def get_origins():
    ips = ["localhost", "0.0.0.0", get_network_ip(), socket.getfqdn()]
    for ip in ips:
        yield f"http://{ip}"
        yield f"https://{ip}"
        yield f"http://{ip}:{config.port}"
        yield f"https://{ip}:{config.port}"
        if config.development:
            yield f"http://{ip}:3000"
            yield f"https://{ip}:3000"


@fastapi.Depends
async def get_cookies(request: fastapi.Request, response: fastapi.Response) -> 'CookieManager':
    return CookieManager(request=request, response=response)


class CookieManager:
    r"""
    note: special cookies-keys in the format 'ms-{key}-{hash(root)}' to prevent mixing cookies when multiple
        instances are running simultaneously on the same machine with different root-paths
    """
    dependency = get_cookies

    class _DataType(t.TypedDict):
        path: str
        value: t.Any

    def __init__(self, request: fastapi.Request, response: fastapi.Response):
        self.request = request
        self.response = response

    def __setitem__(self, key: str, value: t.Any):
        data: CookieManager._DataType = dict(path=config.root_path, value=value)
        dumped = json.dumps(data)
        self.response.set_cookie(f"ms-{key}-{hash(config.root_path)}", dumped, path=config.root_path, httponly=True, samesite="strict")

    def __getitem__(self, key: str):
        dumped = self.request.cookies.get(f"ms-{key}-{hash(config.root_path)}")
        if dumped is None:  # over get to print the right key in es exception
            raise KeyError(key)
        data: CookieManager._DataType = json.loads(dumped)
        if data["path"] != config.root_path:
            raise KeyError(key)
        return data["value"]

    def __delitem__(self, key: str):
        key = f"ms-{key}-{hash(config.root_path)}"
        if key in self.request.cookies:
            self.response.delete_cookie(key, path=config.root_path, httponly=True, samesite="strict")
