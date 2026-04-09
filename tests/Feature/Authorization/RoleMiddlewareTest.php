<?php

use Tests\Support\UserTestHelpers;

describe('rutas admin', function () {
    test('invitado es redirigido al login al acceder al dashboard admin', function () {
        $this->get(route('admin.dashboard'))
            ->assertRedirect(route('login'));
    });

    test('supervisor no puede acceder al dashboard admin y es redirigido a su dashboard', function () {
        $user = UserTestHelpers::supervisorUser();

        $this->actingAs($user)
            ->get(route('admin.dashboard'))
            ->assertRedirect(route('supervisor.dashboard'));
    });

    test('administrador puede acceder al dashboard admin', function () {
        $user = UserTestHelpers::adminUser();

        $this->actingAs($user)
            ->get(route('admin.dashboard'))
            ->assertOk();
    });
});

describe('rutas supervisor', function () {
    test('invitado es redirigido al login', function () {
        $this->get(route('supervisor.dashboard'))
            ->assertRedirect(route('login'));
    });

    test('administrador no accede al área supervisor y es redirigido', function () {
        $user = UserTestHelpers::adminUser();

        $this->actingAs($user)
            ->get(route('supervisor.dashboard'))
            ->assertRedirect(route('admin.dashboard'));
    });

    test('supervisor puede acceder a su dashboard', function () {
        $user = UserTestHelpers::supervisorUser();

        $this->actingAs($user)
            ->get(route('supervisor.dashboard'))
            ->assertOk();
    });
});

describe('rutas instituto', function () {
    test('invitado es redirigido al login', function () {
        $this->get(route('instituto.dashboard'))
            ->assertRedirect(route('login'));
    });

    test('usuario instituto con CUE válido accede al perfil (área protegida instituto)', function () {
        ['user' => $user] = UserTestHelpers::institutoUserWithInstituto();

        $this->actingAs($user)
            ->get(route('instituto.profile'))
            ->assertOk();
    });

    test('administrador no accede al área instituto', function () {
        $user = UserTestHelpers::adminUser();

        $this->actingAs($user)
            ->get(route('instituto.dashboard'))
            ->assertRedirect(route('admin.dashboard'));
    });
});
