#!/usr/bin/env bash
# start-dev.sh — запускает статичный сервер и cloudflared туннель, открывает ссылку в браузере
# usage: ./start-dev.sh [PORT]
# default PORT=8000

set -euo pipefail

PORT="${1:-8000}"
PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
LOGDIR="$PROJECT_DIR/.dev-logs"
PIDFILE="$LOGDIR/dev-pids"
SERVER_STDOUT="$LOGDIR/server.out"
CF_STDOUT="$LOGDIR/cloudflared.out"

mkdir -p "$LOGDIR"

# kill previous processes from this script (if any)
if [ -f "$PIDFILE" ]; then
  while read -r pid; do
    if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
      echo "Killing old pid $pid"
      kill "$pid" || true
    fi
  done < "$PIDFILE" || true
  rm -f "$PIDFILE"
fi

# start python static server in background
echo "Starting local HTTP server on port $PORT..."
# Prefer python3, fallback to python
if command -v python3 >/dev/null 2>&1; then
  (cd "$PROJECT_DIR" && python3 -m http.server "$PORT") >"$SERVER_STDOUT" 2>&1 &
else
  (cd "$PROJECT_DIR" && python -m SimpleHTTPServer "$PORT") >"$SERVER_STDOUT" 2>&1 &
fi
SERVER_PID=$!
echo "$SERVER_PID" >> "$PIDFILE"
sleep 0.8

# start cloudflared in background
echo "Starting cloudflared tunnel -> http://localhost:$PORT ..."
cloudflared tunnel --url "http://localhost:$PORT" >"$CF_STDOUT" 2>&1 &
CF_PID=$!
echo "$CF_PID" >> "$PIDFILE"

# helper: wait for cloudflared to publish URL (timeout 20s)
echo -n "Waiting for cloudflared to provide public URL"
END=$((SECONDS + 20))
PUBLIC_URL=""
while [ $SECONDS -lt $END ]; do
  if grep -Eo "https://[a-z0-9-]+\.trycloudflare\.com" "$CF_STDOUT" >/dev/null 2>&1; then
    PUBLIC_URL=$(grep -Eo "https://[a-z0-9-]+\.trycloudflare\.com" "$CF_STDOUT" | tail -n1)
    break
  fi
  echo -n "."
  sleep 0.6
done
echo

if [ -z "$PUBLIC_URL" ]; then
  echo "Не удалось получить публичную ссылку автоматически. Смотрите лог: $CF_STDOUT"
  echo "Cloudflared лог (последние строки):"
  tail -n 30 "$CF_STDOUT" || true
  echo "Server stdout: $SERVER_STDOUT"
  exit 1
fi

echo "Tunnel ready: $PUBLIC_URL"
# open in default browser (macOS / Linux)
if [[ "$OSTYPE" == "darwin"* ]]; then
  open "$PUBLIC_URL"
else
  xdg-open "$PUBLIC_URL" >/dev/null 2>&1 || true
fi

echo "PIDs saved to $PIDFILE"
echo "Server log: $SERVER_STDOUT"
echo "Cloudflared log: $CF_STDOUT"
echo
echo "To stop: ./stop-dev.sh  (or kill PIDs listed in $PIDFILE)"
