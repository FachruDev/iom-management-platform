#!/bin/sh
set -e

php artisan optimize:clear --no-interaction
php artisan migrate --force --no-interaction

if [ "${RUN_DB_SEED:-false}" = "true" ]; then
    php artisan db:seed --force --no-interaction
fi

php artisan optimize --no-interaction

exec "$@"
