FROM postgres:latest

ENV POSTGRES_DB=recruitment_db
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=blessing

# Create the recruitment schema during initialization
RUN echo "CREATE SCHEMA IF NOT EXISTS recruitment;" > /docker-entrypoint-initdb.d/00-create-schema.sql

# Copy migration files
COPY ./migrations/001_init_db.sql /docker-entrypoint-initdb.d/01-init.sql
COPY ./migrations/002_add_history_tables.sql /docker-entrypoint-initdb.d/02-history-tables.sql
COPY ./seed/seed.sql /docker-entrypoint-initdb.d/03-seed.sql
COPY ./seed/002_seed_history_tables.sql /docker-entrypoint-initdb.d/04-seed-history.sql

EXPOSE 5432