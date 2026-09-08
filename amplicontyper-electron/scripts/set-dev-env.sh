#!/bin/bash
set -ex

# Set the environment variables the electron app needs to find and run the AmpliconTyper executable

ROOT=$(cd "$(dirname "$0")/../.." && pwd)
DIST=$ROOT/amplicontyper-installer/dist

export AMPLICON_TYPER_EXE_PATH=$DIST/amplicontyper_classify
export AMPLICON_TYPER_INTERNAL_BIN_PATH=$DIST/amplicontyper/_internal

exec "$@"