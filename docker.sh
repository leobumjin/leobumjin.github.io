#!/usr/bin/env bash
set -euo pipefail

# Run this Jekyll site inside Docker and expose it on localhost:4000.
# Usage:
#   bash docker.sh
#   PORT=8080 bash docker.sh

PORT="${PORT:-4000}"
IMAGE="${IMAGE:-jekyll/jekyll:4}"

docker run --rm -it \
  -v "$PWD:/srv/jekyll" \
  -w /srv/jekyll \
  -p "${PORT}:4000" \
  -e BUNDLE_PATH=/srv/jekyll/vendor/bundle \
  -e BUNDLE_APP_CONFIG=/srv/jekyll/.bundle \
  --user "$(id -u):$(id -g)" \
  "${IMAGE}" \
  bash -lc "bundle install && bash serve.sh --host 0.0.0.0 --port 4000"
