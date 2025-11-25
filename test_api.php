<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

// Simular una request a la API
$request = Illuminate\Http\Request::create(
    '/api/actualizaciones/filters?year=2024&gestion_type=todos&limit=10&page=1', 
    'GET'
);

$response = $kernel->handle($request);

echo $response->getContent();

$kernel->terminate($request, $response);