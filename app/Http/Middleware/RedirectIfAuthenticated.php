<?php

namespace App\Http\Middleware;

use App\Constants\Rol;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$guards): Response
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                // Si el usuario ya está autenticado, redirigir al dashboard correspondiente
                $rol_id = Auth::guard($guard)->user()->rol_id;
                
                switch ($rol_id) {
                    case Rol::ADMINISTRADOR:
                        return redirect()->route('admin.dashboard');
                    case Rol::SUPERVISOR_PROVINCIAL:
                        return redirect()->route('supervisor.dashboard');
                    case Rol::INSTITUTO:
                        return redirect()->route('instituto.dashboard');
                    default:
                        return redirect()->route('home');
                }
            }
        }

        return $next($request);
    }
}
