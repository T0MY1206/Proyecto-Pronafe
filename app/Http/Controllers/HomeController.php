<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Constants\Rol;

class HomeController extends Controller
{
    public function __invoke(Request $request)
    {
        $user = Auth::user();

        if ($user) {
            switch ($user->rol_id) {
                case Rol::ADMINISTRADOR:
                    return redirect()->route('admin.dashboard');
                case Rol::SUPERVISOR_PROVINCIAL:
                    return redirect()->route('supervisor.dashboard');
                case Rol::INSTITUTO:
                    return redirect()->route('instituto.dashboard');
            }
        }

        return Inertia::render('welcome');
    }
}