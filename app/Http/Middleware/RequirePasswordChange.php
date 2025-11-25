<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequirePasswordChange
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check() && auth()->user()->rol_id === 3) { // Instituto
            $user = auth()->user();
            
            // Verificar si es la primera vez que ingresa (contraseña genérica)
            if ($user->cue_instituto && !$user->password_cambiada) {
                // Redirigir a cambio de contraseña si no está ya en esa ruta
                if (!$request->routeIs('instituto.cambiar-password*') && !$request->routeIs('logout')) {
                    return redirect()->route('instituto.cambiar-password')
                        ->with('warning', 'Debe cambiar su contraseña antes de continuar.');
                }
            }
        }

        return $next($request);
    }
}
