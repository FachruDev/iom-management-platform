FROM php:8.3-cli AS build

WORKDIR /var/www/html

ENV BUN_INSTALL=/root/.bun
ENV PATH="${BUN_INSTALL}/bin:${PATH}"

RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates curl git unzip libicu-dev libzip-dev default-mysql-client \
    && docker-php-ext-install intl pdo_mysql zip \
    && curl -fsSL https://bun.sh/install | bash \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY . .

RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader \
    && php artisan route:clear \
    && bun install --frozen-lockfile \
    && bun run build \
    && rm -rf node_modules

FROM php:8.3-cli

WORKDIR /var/www/html

RUN apt-get update \
    && apt-get install -y --no-install-recommends libicu-dev libzip-dev default-mysql-client \
    && docker-php-ext-install intl pdo_mysql zip \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY --from=build /var/www/html /var/www/html
COPY docker/entrypoint.sh /usr/local/bin/iom-entrypoint

RUN chmod +x /usr/local/bin/iom-entrypoint \
    && mkdir -p storage/app/private storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache

EXPOSE 8082

ENTRYPOINT ["iom-entrypoint"]
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8082"]
