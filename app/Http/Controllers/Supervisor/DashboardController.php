<?php

namespace App\Http\Controllers\Supervisor;

use App\Http\Controllers\Api\ActualizacionesApiController;
use App\Http\Controllers\Controller;
use App\Models\Provincia;
use Inertia\Inertia;

class DashboardController extends Controller {
    public function index() {
        $user = auth()->user();

        $request = request()->create('', 'POST', [
                'provincia_id' => $user->provincia_id
        ]);

        $initialData = ActualizacionesApiController::reporteSupervisor($request);

        $provincia = Provincia::find($user->provincia_id);

        return Inertia::render('supervisor/Dashboard/Index', [
            'initialData' => $initialData,
            'provincia' => $provincia
        ]);
    }
}
