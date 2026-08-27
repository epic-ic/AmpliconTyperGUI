# -*- mode: python ; coding: utf-8 -*-
import os
import subprocess

block_cipher = None

# We should be running in a micromamba environment where we can find amplicontyper's classify script - this is a bash
# entrypoint for a python module
classify_bash = subprocess.run(
    ['micromamba', 'run', 'which', 'classify'],
    capture_output=True,
    text=True
)
env_bin = os.path.dirname(classify_bash.stdout.strip())

a = Analysis(
    [os.path.join(env_bin, "classify.py")],
    pathex=[],
    binaries=[],
    datas=[(os.path.join(env_bin, "html_head.txt"), ".")],
    hiddenimports=["amplicontyper"],
    hookspath=[],
    runtime_hooks=[],
    excludedimports=[],
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='amplicontyper_classify', # We currently only support the classify method
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True, # use UPX for compression, if available
    upx_exclude=[],
    runtime_tmpdir=None, # use default tmpdir for extracted files
    console=True, # this is a console app
)