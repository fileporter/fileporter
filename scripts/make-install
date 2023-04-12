#!/usr/bin/env bash
set -e

cd "$(dirname "$0")/.."

if [ -d ".venv" ]; then
  echo "virtual-environment already exists. miniserve should already be installed."
  exit 1
fi

if (python3 -c "import virtualenv" > /dev/null 2>&1); then
  python3 -m virtualenv .venv
elif (python3 -c "import venv" > /dev/null 2>&1); then
  python3 -m venv .venv
else
  echo "No tool found to create a virtual-environment. Please install virtualenv or venv."
  exit 1
fi

.venv/bin/pip3 --quiet install -U pip
.venv/bin/pip3 --quiet install -r requirements.txt

echo "Installation successful"
