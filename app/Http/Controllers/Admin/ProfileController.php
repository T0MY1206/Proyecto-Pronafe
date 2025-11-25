<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller {
    public function edit() {
        $user = auth()->user();

        return inertia('admin/Profile/EditProfile', compact('user'));
    }

    public function update(Request $request) {
         $data = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email',
            'current_password' => 'nullable|string|current_password',
            'password' => 'nullable|string|min:8|confirmed|different:current_password',
        ]);

        $user = User::findOrFail(auth()->user()->id);

        $password = $user->password;

        $user->fill( $data );

        if($request->filled('password')) {
            $user->password = Hash::make($data['password']);
        } else {
            $user->password = $password;
        }

        if($user->save()) {
            return redirect()->route('admin.profile.edit')
                ->with('toast', ['type' => 'success', 'text' => "Perfil actualizado correctamente"]);
        } else {
            return redirect()->route('admin.profile.edit')
                ->with('toast', ['type' => 'error', 'text' => "Error al actualizar el perfil"]);
        }
    }
}
