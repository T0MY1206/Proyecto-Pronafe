<?php

use App\Models\Provincia;
use Illuminate\Support\Facades\DB;

test('departamentos por provincia devuelve json', function () {
    $provincia = Provincia::query()->create(['descripcion' => 'Prov API test']);

    DB::table('departamentos')->insert([
        'descripcion' => 'Depto API',
        'provincia_id' => $provincia->id,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $response = $this->getJson(route('api.provincia.departamentos', ['id' => $provincia->id]));

    $response->assertOk();
    expect($response->json())->toBeArray();
    expect($response->json())->not->toBeEmpty();
});
