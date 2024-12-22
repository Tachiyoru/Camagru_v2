FROM mysql:5.7.35

USER root

RUN chmod 755 /var/lib/mysql

COPY ./init-db.sql /docker-entrypoint-initdb.d