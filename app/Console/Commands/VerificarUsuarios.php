<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class VerificarUsuarios extends Command
{
    protected $signature = 'verificar:usuarios';
    protected $description = 'Verificar usuarios en la base de datos';

    public function handle()
    {
        $usuarios = User::all(['id', 'name', 'email', 'rol_id']);
        
        $this->info('Usuarios en la base de datos:');
        foreach ($usuarios as $usuario) {
            $this->line("ID: {$usuario->id} - Nombre: {$usuario->name} - Email: {$usuario->email} - Rol ID: {$usuario->rol_id}");
        }
        
        return 0;
    }
}