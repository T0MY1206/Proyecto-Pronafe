FROM php:8.3-fpm

# Instalar dependencias del sistema y herramientas de diagnóstico
RUN apt-get update && apt-get install -y \
    git unzip curl nodejs npm procps nano \
    && docker-php-ext-install pdo pdo_mysql

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

EXPOSE 8000 5173

CMD php artisan serve --host=0.0.0.0 --port=8000 
