#!/bin/bash

DB_NAME=the_green_meal
DIRNAME="$(cd "$(dirname "$0")";pwd -P)"

for f in $DIRNAME/../migrations/*.sql
do
  if [[ "$f" != *".down.sql" ]]; then
    echo "Running $(basename "$f")"
    psql $DB_NAME < $f &>/dev/null
  fi
done

