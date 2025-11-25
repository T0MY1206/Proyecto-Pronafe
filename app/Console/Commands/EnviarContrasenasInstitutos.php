<?php

namespace App\Console\Commands;

use App\Mail\NotificacionInicioActualizacion;
use App\Models\Actualizacion;
use App\Models\Instituto;
use App\Models\User;
use App\Models\EmailLog;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class EnviarContrasenasInstitutos extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'institutos:enviar-contrasenas {--periodo= : ID del período de actualización}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Enviar contraseñas genéricas por email a todos los institutos';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('📧 Enviando contraseñas genéricas a institutos...');

        // Obtener institutos con usuarios asociados
        $institutos = Instituto::where('activo', true)
            ->whereHas('user')
            ->with('user')
            ->get();

        if ($institutos->isEmpty()) {
            $this->error('❌ No se encontraron institutos con usuarios asociados.');
            $this->info('💡 Ejecuta primero: php artisan institutos:crear-usuarios');
            return;
        }

        $this->info("📊 Encontrados {$institutos->count()} institutos con usuarios.");

        // Obtener período actual o el especificado
        $periodoId = $this->option('periodo');
        if ($periodoId) {
            $periodo = \App\Models\Actualizacion::find($periodoId);
            if (!$periodo) {
                $this->error("❌ No se encontró el período con ID: {$periodoId}");
                return;
            }
        } else {
            $periodo = \App\Models\Actualizacion::where('activo', true)->first();
            if (!$periodo) {
                $this->error('❌ No hay período de actualización activo.');
                $this->info('💡 Crea un período activo primero o especifica uno con --periodo=ID');
                return;
            }
        }

        $this->info("📅 Usando período: {$periodo->anio}");

        if (!$this->confirm('¿Desea enviar las contraseñas por email?')) {
            $this->info('❌ Operación cancelada.');
            return;
        }

        $this->info("📧 Enviando emails con credenciales por lotes...");
        
        $totalInstitutos = $institutos->count();
        $loteSize = 20; // Máximo 20 emails por lote
        $delaySegundos = 30; // 30 segundos entre lotes
        
        $this->info("📊 Total institutos: {$totalInstitutos}");
        $this->info("📦 Lotes de {$loteSize} emails con {$delaySegundos}s de delay");
        
        // Dividir en lotes de 20
        $lotes = $institutos->chunk($loteSize);
        $loteNumero = 1;
        $enviados = 0;
        $errores = 0;

        foreach ($lotes as $lote) {
            $this->info("📦 Procesando lote {$loteNumero}/{$lotes->count()} ({$lote->count()} emails)");
            
            foreach ($lote as $instituto) {
                // Generar contraseña genérica (3 primeras letras + 3 números)
                $primerasLetras = strtoupper(substr($instituto->nombre, 0, 3));
                $numeros = str_pad(rand(0, 999), 3, '0', STR_PAD_LEFT);
                $passwordGenerica = $primerasLetras . $numeros;

                // Crear o actualizar usuario del instituto
                $user = User::updateOrCreate(
                    ['email' => $instituto->email],
                    [
                        'name' => $instituto->nombre,
                        'password' => \Illuminate\Support\Facades\Hash::make($passwordGenerica),
                        'rol_id' => 3, // Instituto
                        'cue_instituto' => $instituto->cue
                    ]
                );

                // Enviar email inmediatamente
                try {
                    Mail::to($instituto->email, $instituto->nombre)
                        ->send(new NotificacionInicioActualizacion(
                            $instituto->nombre,
                            $instituto->email,
                            $passwordGenerica,
                            $periodo
                        ));
                    
                    // Log exitoso en base de datos
                    EmailLog::logEnviado(
                        EmailLog::TIPO_CREDENCIALES,
                        $instituto->email,
                        $instituto->nombre,
                        $instituto->cue,
                        $periodo->anio,
                        $loteNumero
                    );
                    
                    $this->line("✅ Email enviado a {$instituto->nombre} ({$instituto->email})");
                    $enviados++;
                    
                } catch (\Exception $e) {
                    // Log de error en base de datos
                    EmailLog::logError(
                        EmailLog::TIPO_CREDENCIALES,
                        $instituto->email,
                        $instituto->nombre,
                        $e->getMessage(),
                        $instituto->cue,
                        $periodo->anio,
                        $loteNumero
                    );
                    
                    $this->error("❌ Error enviando email a {$instituto->nombre}: " . $e->getMessage());
                    $errores++;
                }
            }

            // Delay entre lotes (excepto el último)
            if ($loteNumero < $lotes->count()) {
                $this->info("⏳ Esperando {$delaySegundos} segundos antes del siguiente lote...");
                sleep($delaySegundos);
            }
            
            $loteNumero++;
        }
        
        $this->newLine();
        $this->info("📈 Resumen del envío:");
        $this->info("   ✅ Emails enviados: {$enviados}");
        if ($errores > 0) {
            $this->error("   ❌ Errores: {$errores}");
        }

        $this->info("📧 Los institutos recibirán un email con sus credenciales de acceso.");
        $this->warn("⚠️  Los emails se procesarán automáticamente en los próximos minutos.");
    }
}