-*- mode: python ; coding: utf-8 -*-
block_cipher = None

a = Analysis(
    ['entrypoint.py'],
    pathex=[],
    binaries=[],
    datas=[],
    hiddenimports=[], # TODO: check that we don't need to include anplicontyper here
    hookspath=[],
    runtime_hooks=[],
    excludedimports=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zst, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='amplicontyper_installer',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True, # use UPX for compression, if available
    upx_exclude=[],
    runtime_tmpdir=None, # use default tmpdir for extracted files
    console=True, # this is a console app
)