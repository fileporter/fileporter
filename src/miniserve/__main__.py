#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import os
from config import args


if __name__ == '__main__':
    print(args)

    if not args.uds:
        from util import qr_code_printer
        qr_code_printer.print_qrcode()

    import uvicorn
    uvicorn.run("main:app", host=args.host, port=args.port, app_dir=os.path.dirname(__file__),
                workers=args.worker, root_path=args.root_path, uds=args.uds,
                **({} if args.logs else {'log_config': None}))  # preserve default value
