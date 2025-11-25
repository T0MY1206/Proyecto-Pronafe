<?php

namespace App\Http\Controllers\Instituto;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class CambiarPasswordController extends Controller
{
    public function show()
    {
        return Inertia::render('Instituto/CambiarPassword/Index');
    }

    public function update(Request $request)
    {
        $request->validate([
            'password_actual' => 'required|current_password',
            'password' => 'required|string|min:8|confirmed',
        ], [
            'password_actual.required' => 'La contraseña actual es obligatoria.',
            'password_actual.current_password' => 'La contraseña actual es incorrecta.',
            'password.required' => 'La nueva contraseña es obligatoria.',
            'password.min' => 'La nueva contraseña debe tener al menos 8 caracteres.',
            'password.confirmed' => 'Las contraseñas no coinciden.',
        ]);

        $user = Auth::user();
        
        // Actualizar contraseña y marcar como cambiada
        $user->update([
            'password' => Hash::make($request->password),
            'password_cambiada' => true
        ]);

        return redirect()->route('instituto.dashboard')
            ->with('success', 'Contraseña actualizada correctamente.');
    }
}
