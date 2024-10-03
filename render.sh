#!/usr/bin/env bash
# exit on error
set -o errexit

export VITE_BACKEND_URL=https://blabhere-backend.onrender.com

npm install && npm run build