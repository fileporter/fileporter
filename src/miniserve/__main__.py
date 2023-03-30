#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import os
from config import args


if __name__ == '__main__':
    import uvicorn
    from util import qr_code_printer

    print(args)
    qr_code_printer.print_qrcode()

    uvicorn.run("main:app", host=args.host, port=args.port, app_dir=os.path.dirname(__file__), workers=args.worker,
                log_config=None, log_level=None)
