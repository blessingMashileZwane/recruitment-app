FROM postgres:latest

ENV POSTGRES_DB=recruitment_db
ENV POSTGRES_USER=user
ENV POSTGRES_PASSWORD=password

COPY ./migrations /docker-entrypoint-initdb.d/migrations
COPY ./seed /docker-entrypoint-initdb.d/seed

EXPOSE 5432