#!/usr/bin/env bash
set -e

TARGET=${1:=miniserve}

git clone https://github.com/PlayerG9/miniserve.git "${TARGET}"

cd "${TARGET}"

./scripts/make-install.sh
