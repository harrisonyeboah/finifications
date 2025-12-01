#!/bin/sh
# wait-for-it.sh - wait until a host:port is available
# Usage: ./wait-for-it.sh host:port [timeout] -- command

HOST=$(echo $1 | cut -d: -f1)
PORT=$(echo $1 | cut -d: -f2)
TIMEOUT=${2:-30} # default timeout 30s
shift 2

counter=0
while ! nc -z $HOST $PORT; do
  counter=$((counter+1))
  if [ $counter -gt $TIMEOUT ]; then
    echo "Timeout waiting for $HOST:$PORT"
    exit 1
  fi
  echo "Waiting for $HOST:$PORT..."
  sleep 2
done

exec "$@"
