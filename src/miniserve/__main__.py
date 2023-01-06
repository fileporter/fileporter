#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import os
from config import args

if __name__ == '__main__':
    import uvicorn
    uvicorn.run("main:app", host=args.host, port=args.port, app_dir=os.path.dirname(__file__), workers=args.worker)
