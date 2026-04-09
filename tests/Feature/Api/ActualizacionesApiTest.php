<?php

use App\Models\Actualizacion;
use Tests\Support\UserTestHelpers;

test('checkAnio devuelve exists según existencia de actualización', function () {
    $this->getJson(route('api.actualizaciones.checkAnio', ['anio' => 2099]))
        ->assertOk()
        ->assertJson(['exists' => false]);

    $admin = UserTestHelpers::adminUser();
    Actualizacion::query()->create([
        'anio' => 2099,
        'fecha_matriculados' => now()->toDateString(),
        'fecha_1_egresados' => now()->toDateString(),
        'fecha_2_egresados' => now()->toDateString(),
        'fecha_tope' => now()->addMonth()->toDateString(),
        'user_id' => $admin->id,
    ]);

    $this->getJson(route('api.actualizaciones.checkAnio', ['anio' => 2099]))
        ->assertOk()
        ->assertJson(['exists' => true]);
});

test('showExpandedRow devuelve 404 si el instituto no existe', function () {
    $this->getJson(route('api.actualizaciones.showExpandedRow', ['anio' => 2025, 'cue' => '000000000']))
        ->assertNotFound()
        ->assertJsonFragment(['success' => false]);
});
