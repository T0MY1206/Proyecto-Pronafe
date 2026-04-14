<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\InstitutosController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\UsersController;
use App\Http\Controllers\Admin\ActualizacionesController;
use App\Http\Controllers\Admin\ExportController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'rol:admin'])->prefix('admin')->as('admin.')->group(function () {
    //Route::get('dashboard', [DashboardController::class, 'index'])->name(name: 'dashboard');
    // Dashboard fijo al último año disponible:
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    // Gestión de usuarios
    Route::resource('users', UsersController::class);

    // Perfil del admin
    Route::get('profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('profile/update', [ProfileController::class, 'update'])->name('profile.update');
    // Institutos
    Route::resource('institutos', InstitutosController::class);
    Route::put('institutos/{instituto}', [InstitutosController::class, 'updateInstituto'])->name('institutos.updateInstituto');
    // Actualizaciones
    Route::resource('actualizaciones', ActualizacionesController::class);
    Route::get('/actualizaciones/filters', [ActualizacionesController::class, 'filters'])->name('actualizaciones.filters');

    // Rutas para exportación (solo administradores)
    Route::get('exportar', [ExportController::class, 'index'])->name('exportar.index');
    Route::post('exportar/formularios', [ExportController::class, 'exportarFormularios'])->name('exportar.formularios');
});
