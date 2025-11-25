<?php

namespace App\Http\Controllers\Auth;

use App\Constants\Rol;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();
        $user = $request->user();
        $rol_id = $user->rol_id;

        // Validar que usuarios instituto tengan instituto asignado antes de redirigir
        if ($rol_id === Rol::INSTITUTO) {
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

        switch ($rol_id) {
            case Rol::ADMINISTRADOR:
                return redirect()->intended(route('admin.dashboard', absolute: false));
            case Rol::SUPERVISOR_PROVINCIAL:
                return redirect()->intended(route('supervisor.dashboard', absolute: false));
            case Rol::INSTITUTO:
                return redirect()->intended(route('instituto.dashboard', absolute: false));
        }

        return redirect()->intended(route('home', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
