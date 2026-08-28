#!/bin/bash
set -ex
echo "Building environment.."
# Allow micromamba to run as binary in this shell
eval "$(micromamba shell hook --shell bash)"
micromamba create -f environment.yml -y
micromamba activate amplicontyper-installer

echo "Building binary..."
pyinstaller "pyinstaller/amplicontyper_installer.spec"

echo "Successfully built to: /dist"