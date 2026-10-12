#!/usr/bin/env bash
set -e   # Exit immediately if any command fails

docker compose up -d

echo "🟡 Waiting for database to be ready..."

# Poll until pg_isready succeeds inside the container (example for Postgres)
until docker compose exec -T db pg_isready -U testuser > /dev/null 2>&1; do
  sleep 1
done

echo "🟢 Database is ready!"

# Run tests
vitest run --config vitest.config.ts

# Clean up
docker compose down
