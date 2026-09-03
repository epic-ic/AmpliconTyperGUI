#!/bin/bash
set -ex

# This script assumes the installer has already run and built the executable.

DATA_DIR="./../test_data"
OUTPUT_DIR="./../test_output"
OUTPUT_FILE="$OUTPUT_DIR/test_report.html"

# create test_output if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Delete output file if it exists
if [ -f "$OUTPUT_FILE" ]; then
  rm "$OUTPUT_FILE"
fi

# We need to add the internal bin of the built app in PATH so that AmpliconTyper can find minimap2
PATH="$PATH:$(pwd)/dist/amplicontyper/_internal" ./dist/amplicontyper_classify -b "$DATA_DIR/bams" -m "$DATA_DIR/models/typhi_v8.pkl" -o $OUTPUT_FILE

# Check output file has been written
if [ ! -f "$OUTPUT_FILE" ]; then
  echo "Error: Expected output report $OUTPUT_FILE was not written" >&2
  exit 1
fi
