#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import socket
import qrcode
from config import config


class BGColors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


def get_info():
    if config.host == "127.0.0.1":
        ip = "localhost"
    else:
        # `socket.gethostbyname(socket.gethostname())` doesn't work always
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as client:
            client.connect(("8.8.8.8", 80))
            ip = client.getsockname()[0]

    return f"http://{ip}:{config.port}"


def print_qrcode():
    qr = qrcode.QRCode()
    info = get_info()
    qr.add_data(info)
    qr.print_ascii()
    print(f"{BGColors.OKGREEN}    {info}{BGColors.ENDC}")
