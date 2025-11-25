<?php

use App\Http\Controllers\Supervisor\DashboardController;
use App\Http\Controllers\Supervisor\ProfileController;
use App\Http\Controllers\Supervisor\ActualizacionesController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'rol:supervisor'])->prefix('supervisor')->as('supervisor.')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Perfil
    Route::get('profile', [ProfileController::class, 'show'])->name('profile');
    Route::get('profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('profile/update', [ProfileController::class, 'update'])->name('profile.update');

    // Actualizaciones
    Route::resource('actualizaciones', ActualizacionesController::class);
 
    Route::patch('datos/{dato}/{estado}', [ActualizacionesController::class, 'updateEstado'])->name('datos.update');
});
