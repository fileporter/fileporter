#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import hmac
import socket
import hashlib
import fastapi.security
from config import config


security = fastapi.security.HTTPBasic()


USERNAME = config.username.lower()


if config.password is True:  # only --auth (use system password)
    # use system password
    import spwd
    import crypt

    try:
        spwd.getspnam(USERNAME)
    except PermissionError:
        raise PermissionError("unable to verify system password. please provide one with '--auth password'")

    def auth_dependency(credentials: fastapi.security.HTTPBasicCredentials = fastapi.Depends(security)):
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

    def auth_dependency(credentials: fastapi.security.HTTPBasicCredentials = fastapi.Depends(security)):
        username = credentials.username.lower()
        if username != USERNAME:
            raise fastapi.HTTPException(fastapi.status.HTTP_401_UNAUTHORIZED)

        password = hashlib.sha256(credentials.password.encode()).hexdigest()
        if not hmac.compare_digest(password, PASSWORD):
            raise fastapi.HTTPException(fastapi.status.HTTP_401_UNAUTHORIZED)
else:  # no --auth used
    def auth_dependency():
        pass


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
