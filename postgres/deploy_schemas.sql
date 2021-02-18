-- Deploy fresh database tables

-- run comand in files
\i '/docker-entrypoint-initdb.d/tables/01_users_table.sql'
\i '/docker-entrypoint-initdb.d/tables/02_logins_table.sql'
\i '/docker-entrypoint-initdb.d/seed/seed.sql'