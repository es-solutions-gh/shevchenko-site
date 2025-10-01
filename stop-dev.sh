#!/usr/bin/env bash
# stop-dev.sh — корректно завершает процессы, запущенные start-dev.sh
LOGDIR="$(cd "$(dirname "$0")" && pwd)/.dev-logs"
PIDFILE="$LOGDIR/dev-pids"

if [ ! -f "$PIDFILE" ]; then
  echo "PID file not found: $PIDFILE"
  exit 0
fi

while read -r pid; do
  if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
    echo "Killing $pid"
    kill "$pid" || true
  fi
done < "$PIDFILE"

rm -f "$PIDFILE"
echo "Stopped."
