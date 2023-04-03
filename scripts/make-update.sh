#!/usr/bin/env bash
set -e

cd "$(dirname "$0")/.."

git pull

.venv/bin/pip3 install -r requirements.txt
