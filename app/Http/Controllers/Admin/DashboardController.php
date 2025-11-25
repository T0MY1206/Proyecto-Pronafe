<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Api\ActualizacionesApiController;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class DashboardController extends Controller {
    public function index() {
        $emptyRequest = request()->create('', 'GET'); //Se envía una request vacia ya que el dashboard no usa ningun filtro

        $initialData = ActualizacionesApiController::reporteAdmin($emptyRequest);

        return Inertia::render('admin/Dashboard/Index', [
            'initialData' => $initialData
        ]);
    }
}
