<?php

use App\Http\Controllers\Instituto\DashboardController;
use App\Http\Controllers\Instituto\ActualizacionController;
use App\Http\Controllers\Instituto\DatosController;
use App\Http\Controllers\Instituto\ProfileController;
use App\Http\Controllers\Instituto\FormularioController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'rol:instituto'])->prefix('instituto')->as('instituto.')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name(name: 'dashboard');
    
    Route::get('actualizacion', [ActualizacionController::class, 'index'])->name(name: 'actualizacion');
    Route::post('actualizacion', [ActualizacionController::class, 'update'])->name('actualizacion.update');

    Route::post('datos/send', [DatosController::class, 'send'])->name('datos.send');

    Route::get('profile', [ProfileController::class, 'edit'])->name('profile');
    Route::put('profile/update', [ProfileController::class, 'update'])->name(name: 'profile.update');
    
    // Rutas para formularios
    Route::get('formulario', [FormularioController::class, 'index'])->name('formulario.index');
    Route::post('formulario', [FormularioController::class, 'store'])->name('formulario.store');
    Route::post('formulario/enviar', [FormularioController::class, 'enviar'])->name('formulario.enviar');
    Route::post('formulario/importar', [FormularioController::class, 'importarAnioAnterior'])->name('formulario.importar');
});
