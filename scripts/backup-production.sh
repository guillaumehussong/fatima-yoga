#!/bin/bash

set -e

cd "$(dirname "$0")/.."

ENV='.env.production'
FILE_NAME="$(date +"%Y%m%d%H%M%S").sql"
DIRECTORY='backups'

mkdir -p "$DIRECTORY"

export $(cat $ENV | xargs)

# Extract the host and port from DATABASE_HOST
IFS=':' read -r HOST PORT <<< "$DATABASE_HOST"

# Check if the password is empty and adjust the mysqldump command accordingly
if [ -z "$DATABASE_PASSWORD" ]; then
  echo "Running mysqldump without password"
  mysqldump -u"$DATABASE_USER" -h"$HOST" -P"$PORT" "$DATABASE_NAME" > "$DIRECTORY/$FILE_NAME"
else
  echo "Running mysqldump with password"
  mysqldump -u"$DATABASE_USER" -h"$HOST" -P"$PORT" "$DATABASE_NAME" > "$DIRECTORY/$FILE_NAME"
fi

echo "Wrote a backup in file $FILE_NAME"