#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

SDK_DIR="$HOME/Library/Application Support/Garmin/ConnectIQ/Sdks/connectiq-sdk-mac-8.4.1-2026-02-03-e9f77eeaa"
DEVICES_DIR="$HOME/Library/Application Support/Garmin/ConnectIQ/Devices"
MONKEYC="$SDK_DIR/bin/monkeyc"
DEVICE="fr245m"
KEY="$SCRIPT_DIR/developer_key.der"
OUTPUT_DIR="$SCRIPT_DIR/bin"
OUTPUT="$OUTPUT_DIR/WorkoutAI.prg"

# Generate developer key if missing
if [ ! -f "$KEY" ]; then
    echo "Generating developer key..."
    openssl genrsa -out /tmp/developer_key.pem 4096
    openssl pkcs8 -topk8 -inform PEM -outform DER -in /tmp/developer_key.pem -out "$KEY" -nocrypt
    rm /tmp/developer_key.pem
    echo "Developer key created at $KEY"
fi

mkdir -p "$OUTPUT_DIR"

echo "Building WorkoutAI for $DEVICE..."
java -Xms1g -Dfile.encoding=UTF-8 -Dapple.awt.UIElement=true \
    -jar "$SDK_DIR/bin/monkeybrains.jar" \
    -o "$OUTPUT" \
    -f monkey.jungle \
    -y "$KEY" \
    -d "$DEVICE" \
    -w

echo "Build complete: $OUTPUT"
