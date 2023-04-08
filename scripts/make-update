#!/usr/bin/env bash
set -e

cd "$(dirname "$0")/.."

echo "Update source-code"

git pull --no-commit

echo "Update dependencies"

.venv/bin/pip3 --quiet install -U pip
.venv/bin/pip3 --quiet install -r requirements.txt

echo "Update successful"
