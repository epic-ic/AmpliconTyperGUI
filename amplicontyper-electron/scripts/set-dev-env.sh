#!/bin/bash
set -ex

# Set the environment variables the electron app needs to find and run the AmpliconTyper executable

ROOT=$(cd "$(dirname "$0")/../.." && pwd)
export AMPLICON_TYPER_DEV_RESOURCES_PATH=$ROOT/amplicontyper-installer/dist

exec "$@"