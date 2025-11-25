<?php

namespace App\Console\Commands;

use App\Models\Instituto;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CrearUsuariosInstitutos extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'institutos:crear-usuarios {--force : Forzar creación incluso si ya existen usuarios}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Crear usuarios para todos los institutos que no tengan usuario asociado';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔍 Buscando institutos sin usuario asociado...');

        $query = Instituto::where('activo', true)
            ->whereDoesntHave('user');

        $institutosSinUsuario = $query->get();

        if ($institutosSinUsuario->isEmpty()) {
            $this->info('✅ Todos los institutos ya tienen usuario asociado.');
            return;
        }

        $this->info("📊 Encontrados {$institutosSinUsuario->count()} institutos sin usuario.");

        if (!$this->option('force')) {
            if (!$this->confirm('¿Desea crear usuarios para estos institutos?')) {
                $this->info('❌ Operación cancelada.');
                return;
            }
        }

        $bar = $this->output->createProgressBar($institutosSinUsuario->count());
        $bar->start();

        $creados = 0;
        $errores = 0;

        foreach ($institutosSinUsuario as $instituto) {
            try {
                // Generar contraseña genérica (3 letras + 3 números)
                $nombreLimpio = Str::slug($instituto->nombre, '');
                $primeras3Letras = Str::substr($nombreLimpio, 0, 3);
                $numerosAleatorios = str_pad(rand(0, 999), 3, '0', STR_PAD_LEFT);
                $passwordGenerica = strtoupper($primeras3Letras) . $numerosAleatorios;

                // Crear usuario
                $usuario = User::create([
                    'name' => $instituto->nombre,
                    'email' => $instituto->email,
                    'password' => Hash::make($passwordGenerica),
                    'rol_id' => 3, // Rol de instituto
                    'cue_instituto' => $instituto->cue,
                    'password_cambiada' => false,
                ]);

                $this->line("\n✅ Usuario creado para {$instituto->nombre}");
                $this->line("   📧 Email: {$instituto->email}");
                $this->line("   🔑 Contraseña: {$passwordGenerica}");

                $creados++;

            } catch (\Exception $e) {
                $this->error("\n❌ Error creando usuario para {$instituto->nombre}: " . $e->getMessage());
                $errores++;
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);

        // Resumen
        $this->info("📈 Resumen de la operación:");
        $this->info("   ✅ Usuarios creados: {$creados}");
        if ($errores > 0) {
            $this->error("   ❌ Errores: {$errores}");
        }

        if ($creados > 0) {
            $this->warn("⚠️  IMPORTANTE: Los institutos deben cambiar su contraseña en el primer acceso.");
            $this->info("📧 Las contraseñas genéricas se pueden enviar por email usando el comando de notificaciones.");
        }
    }
}