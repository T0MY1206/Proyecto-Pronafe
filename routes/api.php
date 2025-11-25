<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UbicacionController;
use App\Http\Controllers\Api\ActualizacionesApiController;

Route::middleware(['web'])->as('api.')->group(function () {
    Route::get('/provincias/{id}/departamentos', [UbicacionController::class, 'departamentos'])->name(name: 'provincia.departamentos');
    Route::get('/departamentos/{id}/localidades', [UbicacionController::class, 'localidades'])->name(name: 'departamento.localidades');

    Route::get('/actualizaciones/reporteAdmin', [ActualizacionesApiController::class, 'reporteAdmin'])->name(name: 'actualizaciones.reporteAdmin');
    Route::get('/actualizaciones/reporteSupervisor', [ActualizacionesApiController::class, 'reporteSupervisor'])->name(name: 'actualizaciones.reporteSupervisor');
    Route::get('/actualizaciones/{anio}', [ActualizacionesApiController::class, 'checkAnio'])->name(name: 'actualizaciones.checkAnio');
    Route::get('/actualizaciones/{anio}/{cue}', [ActualizacionesApiController::class, 'showExpandedRow'])->name(name: 'actualizaciones.showExpandedRow');
    
    // Ruta para obtener token CSRF
    Route::get('/csrf-token', function () {
        return response()->json([
            'csrf_token' => csrf_token()
        ]);
    })->name('csrf-token');
});
