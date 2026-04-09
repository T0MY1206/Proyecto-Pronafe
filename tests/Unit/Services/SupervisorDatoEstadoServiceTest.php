<?php

use App\Constants\Estados;
use App\Services\SupervisorDatoEstadoService;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Tests\Support\UserTestHelpers;

beforeEach(function () {
    Mail::fake();
});

test('aprueba un dato y persiste estado aprobado', function () {
    ['dato' => $dato, 'supervisor' => $supervisor] = UserTestHelpers::createDatoForSupervisorFlow();

    $request = \Illuminate\Http\Request::create('/test', 'PATCH', []);
    $request->setUserResolver(fn () => $supervisor);

    $service = app(SupervisorDatoEstadoService::class);
    $ok = $service->updateEstado($request, $dato->id, Estados::APROBADO);

    expect($ok)->toBeTrue();
    expect($dato->fresh()->estado_id)->toBe(Estados::APROBADO);
});

test('rechazar sin motivo lanza validación', function () {
    ['dato' => $dato, 'supervisor' => $supervisor] = UserTestHelpers::createDatoForSupervisorFlow();

    $request = \Illuminate\Http\Request::create('/test', 'PATCH', []);
    $request->setUserResolver(fn () => $supervisor);

    $service = app(SupervisorDatoEstadoService::class);

    expect(fn () => $service->updateEstado($request, $dato->id, Estados::RECHAZADO))
        ->toThrow(ValidationException::class);
});

test('rechazar con motivo y email en request actualiza estado', function () {
    ['dato' => $dato, 'supervisor' => $supervisor] = UserTestHelpers::createDatoForSupervisorFlow();

    $request = \Illuminate\Http\Request::create('/test', 'PATCH', [
        'motivo_rechazo' => 'Motivo de prueba suficientemente claro',
        'email' => 'notify@example.com',
    ]);
    $request->setUserResolver(fn () => $supervisor);

    $service = app(SupervisorDatoEstadoService::class);
    $ok = $service->updateEstado($request, $dato->id, Estados::RECHAZADO);

    expect($ok)->toBeTrue();
    expect($dato->fresh()->estado_id)->toBe(Estados::RECHAZADO);
    Mail::assertSent(\App\Mail\DatoRechazadoMail::class);
});
