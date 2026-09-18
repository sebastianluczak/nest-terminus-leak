#!/bin/bash

ROUTE="http://localhost:8080/health"

while true; do
  curl -sS $ROUTE | jq -r '.status' | grep -q "ok"
  if [ $? -ne 0 ]; then
    echo "Health check failed"
    exit 1
  fi
  echo "Health check passed at $(date)"
  read -t 0.2 # Sleep for 0.2 seconds before the next check
done