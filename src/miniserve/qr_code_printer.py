#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import time
import socket
from _thread import start_new_thread
import qrcode
from config import args


def get_info():
    if args.host == "127.0.0.1":
        ip = "localhost"
    else:
        # `socket.gethostbyname(socket.gethostname())` doesn't work always
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as client:
            client.connect(("8.8.8.8", 80))
            ip = client.getsockname()[0]

    return f"http://{ip}:{args.port}"


def print_qrcode():
    qr = qrcode.QRCode()
    qr.add_data(get_info())
    qr.print_ascii()
