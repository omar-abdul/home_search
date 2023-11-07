#!/bin/sh

set -e


psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL

 CREATE DATABASE home_search;
EOSQL

echo "db created"

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname home_search  <<-EOSQL
        CREATE EXTENSION IF NOT EXISTS postgis;
	    CREATE EXTENSION IF NOT EXISTS postgis_topology;
	    CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
	    CREATE EXTENSION IF NOT EXISTS postgis_tiger_geocoder;
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
EOSQL