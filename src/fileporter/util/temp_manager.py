#!/usr/bin/python3
# -*- coding=utf-8 -*-
r"""

"""
import atexit
import os
import os.path as p
import tempfile
import shutil
import threading
import time


class TempManager:
    INTERVAL = 60*5  # 5min

    def __init__(self, name: str):
        self.path = p.join(tempfile.gettempdir(), name)
        # os.makedirs(self.path, exist_ok=True)  # rw-rw----
        os.makedirs(self.path, mode=0o660, exist_ok=True)  # rw-rw----
        self._thread = threading.Thread(target=self._reducer, name="temp-manager")
        self._thread.start()
        atexit.register(self.cleanup)

    def _reducer(self):
        while p.isdir(self.path):
            threshold = time.time() - self.INTERVAL
            for fname in os.listdir(self.path):
                fpath = p.join(self.path, fname)
                try:
                    atime = p.getatime(fpath)
                    if atime < threshold:
                        os.remove(fpath)
                except (OSError, PermissionError, FileNotFoundError):
                    continue
            time.sleep(self.INTERVAL)

    def __enter__(self):
        return self.path

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.cleanup()

    @classmethod
    def _cleanup(cls, name):
        shutil.rmtree(name, ignore_errors=True)

    def cleanup(self):
        if p.isdir(self.path):
            self._cleanup(self.path)
