#!/bin/sh
set -e

echo "================================================"
echo "  Ark.Portfolio - Hugging Face Spaces"
echo "================================================"

# Start Express backend in background
echo "[1/2] Starting backend on port 3085..."
cd /app
node dist/index.js &

# Wait for backend to be ready
echo "[...] Waiting for backend initialization..."
sleep 5

# Start Nginx (foreground)
echo "[2/2] Starting Nginx on port 7860..."
nginx -g 'daemon off;'
