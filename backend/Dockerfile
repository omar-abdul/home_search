FROM postgres:16-bullseye

LABEL maintainer="PostGIS Project - https://postgis.net"

ENV POSTGIS_MAJOR 3
ENV POSTGIS_VERSION 3.2.1+dfsg-1.pgdg110+1


RUN apt update \
      && apt install -y postgis postgresql-${PG_MAJOR}-postgis-${POSTGIS_MAJOR} \
      postgresql-${PG_MAJOR}-postgis-${POSTGIS_MAJOR}-scripts


RUN mkdir -p /docker-entrypoint-initdb.d
COPY ./initdb-postgis.sh /docker-entrypoint-initdb.d/init-postgis.sh
