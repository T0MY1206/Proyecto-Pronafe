<?php

namespace App\Http\Middleware;

use App\Constants\Rol;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Illuminate\Support\Facades\Auth;
use Closure;

class CheckRol {
    public function handle(Request $request, Closure $next, $rol): Response|RedirectResponse|JsonResponse|BinaryFileResponse
    {
        // Verificar si el usuario está autenticado
        if (!$request->user()) {
            return redirect('login');
        }

        $user = $request->user();
        $rol_id = $user->rol_id;

        // Validación especial para usuarios instituto: deben tener instituto asignado
        if ($rol === 'instituto' && $rol_id === Rol::INSTITUTO) {
            if (!$user->cue_instituto) {
                // Usuario instituto sin CUE asignado - forzar logout
                Auth::guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                return redirect('login')->with('error', 'Usuario sin instituto asignado. Por favor, contacte al administrador.');
            }

            // Verificar que el instituto existe
            $instituto = \App\Models\Instituto::where('cue', $user->cue_instituto)->first();
            if (!$instituto) {
                // Usuario instituto con CUE inválido - forzar logout
                Auth::guard('web')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                return redirect('login')->with('error', 'Instituto no encontrado. Por favor, contacte al administrador.');
            }
        }

        // Verificar si el usuario tiene el rol correcto
        $tieneAcceso = false;
        switch ($rol) {
            case 'admin':
                $tieneAcceso = ($rol_id === Rol::ADMINISTRADOR);
                break;
            case 'supervisor':
                $tieneAcceso = ($rol_id === Rol::SUPERVISOR_PROVINCIAL);
                break;
            case 'instituto':
                $tieneAcceso = ($rol_id === Rol::INSTITUTO);
                break;
        }

        // Si no tiene acceso, redirigir al dashboard correspondiente a su rol
        if (!$tieneAcceso) {
            switch ($rol_id) {
                case Rol::ADMINISTRADOR:
                    return redirect()->route('admin.dashboard');
                case Rol::SUPERVISOR_PROVINCIAL:
                    return redirect()->route('supervisor.dashboard');
                case Rol::INSTITUTO:
                    return redirect()->route('instituto.dashboard');
                default:
                    return redirect('login');
            }
        }

        return $next($request);
    }
}
