#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$SCRIPT_DIR/../.."

# Load environment variables from .env file
set -a
source "$PROJECT_ROOT/.env"
set +a

echo "Creating database and schema..."

# Terminate existing connections and recreate database
psql -U $DB_USER -h $DB_HOST -p $DB_PORT postgres << EOF
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = '$DB_NAME'
AND pid <> pg_backend_pid();
DROP DATABASE IF EXISTS $DB_NAME;
CREATE DATABASE $DB_NAME;
\c $DB_NAME
CREATE SCHEMA IF NOT EXISTS recruitment;
ALTER DATABASE $DB_NAME SET search_path TO recruitment, public;
EOF

echo "Database and schema created successfully!"

# Now run the TypeScript initialization script
echo "Running database initialization..."
npm run migrate:up

echo "Setup complete!"
