#!/usr/bin/env bash
set -euo pipefail

PORTS=(3000 5173)

for port in "${PORTS[@]}"; do
  pids=$(lsof -ti tcp:"$port" 2>/dev/null || true)
  if [[ -n "$pids" ]]; then
    echo "Killing processes on port $port: $pids"
    echo "$pids" | xargs kill -9
  else
    echo "Nothing running on port $port"
  fi
done
