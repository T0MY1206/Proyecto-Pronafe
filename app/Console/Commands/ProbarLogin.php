<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Constants\Rol;

class ProbarLogin extends Command
{
    protected $signature = 'probar:login {email} {password}';
    protected $description = 'Probar login de usuario';

    public function handle()
    {
        $email = $this->argument('email');
        $password = $this->argument('password');
        
        $this->info("Probando login para: {$email}");
        
        // Buscar usuario
        $user = User::where('email', $email)->first();
        
        if (!$user) {
            $this->error('Usuario no encontrado');
            return 1;
        }
        
        $this->info("Usuario encontrado: {$user->name} (Rol ID: {$user->rol_id})");
        
        // Verificar contraseña
        if (password_verify($password, $user->password)) {
            $this->info('Contraseña correcta');
            
            // Simular login
            Auth::login($user);
            
            $this->info('Login exitoso');
            
            // Verificar redirección según rol
            switch ($user->rol_id) {
                case Rol::ADMINISTRADOR:
                    $this->info('Redirigiría a: admin.dashboard');
                    break;
                case Rol::SUPERVISOR_PROVINCIAL:
                    $this->info('Redirigiría a: supervisor.dashboard');
                    break;
                case Rol::INSTITUTO:
                    $this->info('Redirigiría a: instituto.dashboard');
                    break;
                default:
                    $this->error('Rol no válido');
                    return 1;
            }
            
        } else {
            $this->error('Contraseña incorrecta');
            return 1;
        }
        
        return 0;
    }
}
