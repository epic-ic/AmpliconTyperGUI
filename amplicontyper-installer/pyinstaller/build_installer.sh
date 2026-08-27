#!/bin/bash
set -ex

BUILD_PATH="build/python"

echo "Building environment.."
# Allow micromamba to run as binary in this shell
eval "$(micromamba shell hook --shell bash)"
micromamba create -f environment.yml -y
micromamba activate amplicontyper-installer

echo "Building binary..."
pyinstaller "pyinstaller/amplicontyper_installer.spec" --distpath "$BUILD_PATH/dist" --workpath "$BUILD_PATH/build"

echo "Successfully built to: $BUILD_PATH"