#!/bin/bash
set -ex

# This script assumes the installer has already run and built the executable
# This works from command line (at repo root), running AT from conda env:
# classify -b ./test_data/bams -m ./test_data/models/typhi_v8.pkl -o test_output/test_report.html
# Test this we can do the same thing with built exe!

# This should work from repo root:
# ./amplicontyper-installer/build/python/dist/amplicontyper_classify -b ./test_data/bams -m ./test_data/models/typhi_v8.pkl -o test_output/test_report.html