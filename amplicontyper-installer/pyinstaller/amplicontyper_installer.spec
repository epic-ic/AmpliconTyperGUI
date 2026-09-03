# -*- mode: python ; coding: utf-8 -*-
import os
import subprocess

# We should be running in a micromamba environment where we can find amplicontyper's classify script - this is a bash
# entrypoint for a python module, and it will be local to it, and to other required files
classify_bash = subprocess.run(
    ['micromamba', 'run', 'which', 'classify'],
    capture_output=True,
    text=True
)

env_bin = os.path.dirname(classify_bash.stdout.strip())
def bin_file(file_name):
  return os.path.join(env_bin, file_name)

a = Analysis(
    [bin_file("classify.py")],
    pathex=[env_bin],
    binaries=[(bin_file("minimap2"), ".")],
    datas=[(bin_file("html_head.txt"), ".")],
    hiddenimports=[
      "amplicontyper"
    ],
    hookspath=[],
    runtime_hooks=[],
    excludedimports=[],
    noarchive=False,
)

pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='amplicontyper_classify',
    console=True # this is a console app
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='amplicontyper'
)