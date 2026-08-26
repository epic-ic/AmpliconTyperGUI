#!/bin/bash
set -ex

BUILD_PATH="build/python"

echo "Building environment.."
micromamba create -f environment.yml
micromamba activate amplicontyper-installer

echo "Building binary..."
pyinstaller "pyinstaller/amplicontyper_installer.spec" --distpath "$BUILD_PATH/dist" --buildpath "$BUILD_PATH/build"

echo "Successfully built to: $BUILD_PATH"