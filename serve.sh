#!/usr/bin/env bash
set -euo pipefail

# Local dev helper for this Jekyll site.
# It prefers `rbenv` if available, but still works (with clearer errors)
# when Ruby/Bundler are installed system-wide instead.

if command -v rbenv >/dev/null 2>&1; then
  # Ensure rbenv shims are on PATH for the current shell.
  eval "$(rbenv init - bash)"
fi

if ! command -v ruby >/dev/null 2>&1; then
  echo "ERROR: 'ruby' not found on PATH." >&2
  echo "Install Ruby first (or use rbenv), then install Bundler and rerun." >&2
  exit 127
fi

if ! command -v bundle >/dev/null 2>&1; then
  echo "ERROR: 'bundle' (Bundler) not found on PATH." >&2
  echo "After installing Ruby, try: gem install bundler" >&2
  exit 127
fi

bundle exec jekyll serve --lsi "$@"
