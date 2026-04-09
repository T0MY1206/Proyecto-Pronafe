<?php

use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\HomeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Supervisor\ProfileController as SupervisorProfileController;
use App\Http\Controllers\Instituto\ProfileController as InstitutoProfileController;


Route::get('/', HomeController::class)->name('home');

Route::middleware('auth')->get('/dashboard', function (Request $request) {
    return match ((int) $request->user()->rol_id) {
        1 => redirect()->route('admin.dashboard'),
        2 => redirect()->route('supervisor.dashboard'),
        3 => redirect()->route('instituto.dashboard'),
        default => redirect()->route('home'),
    };
})->name('dashboard');

require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
require __DIR__.'/supervisor.php';
require __DIR__.'/instituto.php';
