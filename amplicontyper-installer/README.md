# AmpliconTyperGUI: amplicontyper-installer

This directory contains the PyInstaller spec for building AmpliconTyper's classify functionality into a portable executable.

## Prerequisites
- Python 3.11
- [Micromamba](https://mamba.readthedocs.io/en/latest/installation/micromamba-installation.html)

## Build
To build the installer, run `./pyinstaller/build_installer.sh` from this folder.
This creates and activates a micromambe environment from `environment.yml` then builds the installer specified by
`./pyinstaller/amplicontyper_installer.spec`. The installer is built to the local `./dist` folder.

We build a "one directory" executable rather than "one file" because AmpliconTyper runs minimap2 externally and searches
for it using `which`. It's simpler to ensure minimap2's location can be added to the path when it is locally extracted
before running, rather than the one file approach, which extracts all files to a random tmp folder at run time. This
approach should also be fast since no unpacking is required.

## Test
To test the built executable, run `./test/test_amplicontyper_executable.sh`. This adds the required minimap2 folder
to PATH, and runs the excutable on data in the repo's top level `test_data` folder. It then checks that an output
report was generated.

There is a known issue where AmpliconTyper attempts to check its own version using conda, but we're running outside
a conda context, so this fails and logs an error. However this check does not affect the running of the classifier.
We'll find another way to do version checking later.