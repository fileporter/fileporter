#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import os
from config import config


if __name__ == '__main__':
    print(config)

    if not config.uds:
        from util import qr_code_printer
        qr_code_printer.print_qrcode()

    import uvicorn
    uvicorn.run("main:app", host=config.host, port=config.port, app_dir=os.path.dirname(__file__),
                root_path=config.root_path, uds=config.uds, reload=config.development,
                proxy_headers=True, forwarded_allow_ips="*" if config.uds else None,
                workers=None if config.development else config.worker,
                **({} if config.logs else {'log_config': None}))  # preserve default value
