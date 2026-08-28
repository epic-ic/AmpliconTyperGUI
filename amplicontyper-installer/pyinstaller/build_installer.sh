#!/bin/bash
set -ex
echo "Building environment.."
# Allow micromamba to run as binary in this shell
eval "$(micromamba shell hook --shell bash)"
micromamba create -f environment.yml -y
micromamba activate amplicontyper-installer

echo "Building executable..."
pyinstaller "pyinstaller/amplicontyper_installer.spec" -y

echo "Successfully built executable to /dist"