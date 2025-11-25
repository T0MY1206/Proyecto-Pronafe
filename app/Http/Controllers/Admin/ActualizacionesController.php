<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Api\ActualizacionesApiController;
use App\Http\Controllers\Controller;
use App\Models\Actualizacion;
use App\Models\Instituto;
use App\Models\EmailLog;
use App\Mail\NotificacionInicioPeriodo;
use App\Models\Provincia;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class ActualizacionesController extends Controller
{

    public function index(Request $request){
    // Años disponibles para dropdown
    $allYears = Actualizacion::select('anio')
        ->distinct()
         ->orderBy('anio', 'desc')
        ->get()
        ->map(fn($item) => [
            'label' => (string) $item->anio,
            'value' => (string) $item->anio,
        ])
        ->toArray();

    // Provincias disponibles para dropdown
    $allProvinces = Provincia::select('id', 'descripcion')
        ->orderBy('descripcion')
        ->get()
        ->map(fn($item) => [
            'label' => $item->descripcion,
            'value' => (string) $item->id,
        ])
        ->toArray();

    $initialData = ActualizacionesApiController::reporteAdmin($request);

    // Recibir búsqueda desde la barra de búsqueda
    $search = $request->query('search');
    $dataTable = $initialData['dataTable'];

    return Inertia::render('admin/Actualizaciones/Index', [
        'allYears' => $allYears,
        'allProvinces' => $allProvinces,
        'initialData' => $initialData,
        'filters' => [
            'ambito_gestion' => $request->query('ambito_gestion', ''),
            'provincia_id' => $request->query('provincia_id', ''),
            'anio' => $request->query('anio', Actualizacion::max('anio'))
        ],
        'options' => [
            'search' => $search,
            'per_page' => $dataTable->perPage(),
            'path' => $dataTable->path(),
        ]]);
    }

    public function create()
    {
        // Trae todas las actualizaciones para el dropdown de años
        $actualizaciones = Actualizacion::orderBy('anio', 'desc')
            ->get([
                'anio',
                'fecha_matriculados',
                'fecha_1_egresados',
                'fecha_2_egresados',
                'fecha_tope'
            ]);

        return inertia('admin/Actualizaciones/Create', [
            'actualizaciones' => $actualizaciones,
        ]);
    }

    public function store(Request $request)
    {
        $anio = $request->input('anio');
        $hoy = date('Y-m-d');

        $data = $request->validate([
            'anio' => 'required|digits:4|integer',
            'fecha_matriculados' => [
                'required',
                'date',
                function ($attribute, $value, $fail) use ($anio, $hoy) {
                    if (date('Y', strtotime($value)) != $anio) {
                        $fail('La fecha de matriculados debe ser del año vigente seleccionado.');
                    }
                    if ($value >= $hoy) {
                        $fail('La fecha de matriculados debe ser menor que la fecha actual.');
                    }
                },
            ],
            'fecha_1_egresados' => [
                'required',
                'date',
                function ($attribute, $value, $fail) use ($anio) {
                    if (date('Y', strtotime($value)) >= $anio) {
                        $fail('La fecha 1 de egresados debe ser menor al año vigente.');
                    }
                },
            ],
            'fecha_2_egresados' => [
                'required',
                'date',
                'after:fecha_1_egresados',
                function ($attribute, $value, $fail) use ($anio) {
                    if (date('Y', strtotime($value)) != $anio) {
                        $fail('La fecha 2 de egresados debe ser del año vigente seleccionado.');
                    }
                },
            ],
            'fecha_tope' => [
                'required',
                'date',
                function ($attribute, $value, $fail) use ($anio, $hoy) {
                    if (date('Y', strtotime($value)) != $anio) {
                        $fail('La fecha tope debe ser del año vigente seleccionado.');
                    }
                    if ($value <= $hoy) {
                        $fail('La fecha tope debe ser mayor que la fecha actual.');
                    }
                },
            ],
        ], [
            'fecha_2_egresados.after' => 'La fecha 2 de egresados debe ser posterior a la fecha 1 de egresados.',
        ]);

        // Si existe, actualiza solo si es el año vigente
        $actualizacion = Actualizacion::where('anio', $data['anio'])->first();

        if ($actualizacion) {
            if ((int)$data['anio'] === (int)date('Y')) {
                $actualizacion->update([
                    'fecha_matriculados' => $data['fecha_matriculados'],
                    'fecha_1_egresados' => $data['fecha_1_egresados'],
                    'fecha_2_egresados' => $data['fecha_2_egresados'],
                    'fecha_tope' => $data['fecha_tope'],
                    'user_id' => auth()->id(),
                ]);
                $request->session()->flash('toast', ['type' => 'success', 'text' => "Actualización actualizada correctamente"]);
            } else {
                $request->session()->flash('toast', ['type' => 'error', 'text' => "Solo puedes actualizar el año actual"]);
            }
        } else {
            // Desactivar todas las actualizaciones activas
            Actualizacion::where('activo', true)->update(['activo' => false]);

            // Crear la nueva actualización como activa
            $nuevaActualizacion = Actualizacion::create([
                'anio' => $data['anio'],
                'fecha_matriculados' => $data['fecha_matriculados'],
                'fecha_1_egresados' => $data['fecha_1_egresados'],
                'fecha_2_egresados' => $data['fecha_2_egresados'],
                'fecha_tope' => $data['fecha_tope'],
                'user_id' => auth()->id(),
                'activo' => true,
            ]);

            // Enviar emails a todos los institutos activos (solo si está habilitado)
            if (env('ENABLE_EMAIL_NOTIFICATIONS', true)) {
                $this->enviarNotificacionesInstitutos($nuevaActualizacion);
                $request->session()->flash('toast', ['type' => 'success', 'text' => "Actualización guardada correctamente y emails enviados"]);
            } else {
                $request->session()->flash('toast', ['type' => 'success', 'text' => "Actualización guardada correctamente (emails deshabilitados)"]);
            }
        }

        return redirect()->route('admin.actualizaciones.create');
    }

    /**
     * Enviar notificaciones de inicio de período a todos los institutos activos
     * Envía por lotes de 20 emails con delay automático para evitar spam
     */
    private function enviarNotificacionesInstitutos(Actualizacion $periodo)
    {
        // Determinar fuente de emails según configuración
        $emailSource = env('EMAIL_SOURCE', 'database');
        
        if ($emailSource === 'file' || $emailSource === 'test') {
            // Leer emails del archivo de prueba
            $institutos = $this->obtenerInstitutosDesdeArchivo();
        } else {
            // Obtener emails de la base de datos (comportamiento por defecto)
            $institutos = Instituto::where('activo', true)->get();
        }
        
        $totalInstitutos = $institutos->count();
        $loteSize = 20; // Máximo 20 emails por lote
        $delaySegundos = 30; // 30 segundos entre lotes
        
        Log::info('Iniciando envío masivo de notificaciones', [
            'periodo' => $periodo->anio,
            'total_institutos' => $totalInstitutos,
            'lote_size' => $loteSize,
            'delay_segundos' => $delaySegundos
        ]);

        // Dividir en lotes de 20
        $lotes = $institutos->chunk($loteSize);
        $loteNumero = 1;
        $emailsEnviados = 0;
        $errores = 0;

        foreach ($lotes as $lote) {
            Log::info("Procesando lote {$loteNumero}", [
                'lote' => $loteNumero,
                'total_lotes' => $lotes->count(),
                'emails_en_lote' => $lote->count()
            ]);

            foreach ($lote as $instituto) {
                try {
                    // Enviar email inmediatamente
                    Mail::to($instituto->email, $instituto->nombre)
                        ->send(new NotificacionInicioPeriodo(
                            $instituto->nombre,
                            $instituto->email,
                            $periodo
                        ));
                    
                    $emailsEnviados++;
                    
                    // Log exitoso en base de datos
                    EmailLog::logEnviado(
                        EmailLog::TIPO_INICIO_PERIODO,
                        $instituto->email,
                        $instituto->nombre,
                        $instituto->cue,
                        $periodo->anio,
                        $loteNumero
                    );
                    
                    Log::info('Email enviado', [
                        'lote' => $loteNumero,
                        'to' => $instituto->email,
                        'instituto' => $instituto->nombre
                    ]);
                    
                } catch (\Exception $e) {
                    $errores++;
                    
                    // Log de error en base de datos
                    EmailLog::logError(
                        EmailLog::TIPO_INICIO_PERIODO,
                        $instituto->email,
                        $instituto->nombre,
                        $e->getMessage(),
                        $instituto->cue,
                        $periodo->anio,
                        $loteNumero
                    );
                    
                    Log::error('Error enviando email', [
                        'lote' => $loteNumero,
                        'to' => $instituto->email,
                        'error' => $e->getMessage()
                    ]);
                }
            }

            // Delay entre lotes (excepto el último)
            if ($loteNumero < $lotes->count()) {
                Log::info("Esperando {$delaySegundos} segundos antes del siguiente lote...");
                sleep($delaySegundos);
            }
            
            $loteNumero++;
        }
        
        Log::info('Envío masivo completado', [
            'periodo' => $periodo->anio,
            'total_institutos' => $totalInstitutos,
            'emails_enviados' => $emailsEnviados,
            'errores' => $errores,
            'total_lotes' => $lotes->count(),
            'email_source' => $emailSource
        ]);
    }

    /**
     * Obtener lista de institutos desde el archivo emails_prueba.txt
     * Cada línea del archivo debe contener un email
     */
    private function obtenerInstitutosDesdeArchivo()
    {
        $archivoPath = base_path('emails_prueba.txt');
        $institutos = collect([]);
        
        if (!file_exists($archivoPath)) {
            Log::warning('Archivo emails_prueba.txt no encontrado, usando base de datos');
            return Instituto::where('activo', true)->get();
        }
        
        $emails = file($archivoPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        
        foreach ($emails as $index => $email) {
            $email = trim($email);
            if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
                // Crear objeto similar a Instituto para mantener compatibilidad
                $instituto = (object) [
                    'email' => $email,
                    'nombre' => 'Instituto de Prueba ' . ($index + 1),
                    'cue' => 'TEST-' . ($index + 1),
                    'activo' => true
                ];
                $institutos->push($instituto);
            }
        }
        
        Log::info('Emails cargados desde archivo de prueba', [
            'total_emails' => $institutos->count(),
            'archivo' => $archivoPath
        ]);
        
        return $institutos;
    }

}

