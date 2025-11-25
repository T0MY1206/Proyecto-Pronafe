<?php

namespace App\Http\Controllers\Supervisor;

use App\Constants\Estados;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Supervisor;
use App\Models\Actualizacion;
use App\Models\Provincia;
use App\Models\Dato;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use App\Mail\DatoRechazadoMail;

class ActualizacionesController extends Controller
{
    public function index (Request $request)
    {   
        $todosLosAnios= Actualizacion::TodosLosAnios();
        $user = $request->user();
        $perPage = $request->input('limit',10); // Número de registros por página, por defecto 10
        $selectedYear = $request->input('anio', $todosLosAnios[0]); // Año seleccionado, por defecto el ultimo de la DB

        $filters = [
            'ambito_gestion'    => $request->input('ambito_gestion'),
            'search'            => $request->input('search'),
            'anio'              => $selectedYear,
            'limit'             => $request->input('limit'),
            'estado'            => $request->input('estado',1), //1 = Pendientes de revisión (O sea, enviados por los institutos)
                                                                              //3 = Aprobados o rechazados
            'page'              => $request->input('page')
        ];
        $provinciaId = User::where('id', $user->id)->value('provincia_id');
        $provinciaNombre = Provincia::where('id', $provinciaId)->value('descripcion');
        $datos = Dato::getDatosByProvinciaId($provinciaId, $filters);
        $tabla3 = Dato::getDatosByProvinciaIdForGraphics($provinciaId, $filters);
        $tabla = clone $datos;
        $institutosFiltrados =(clone $datos)->paginate($perPage);
        $sumas = Dato::getSumsForTable($tabla);
        $percentageByState= Dato::getPercentagesByState($tabla3);
        ##Lo que hace dependiendo la selecciond el usuario
        $yearSelectedData = Actualizacion::where('anio', $selectedYear)
            ->select('anio', 'fecha_matriculados', 'fecha_1_egresados', 'fecha_2_egresados')
            ->first(); // Obtiene los datos del año seleccionado de la tabla 'actualizaciones'
        
        if ($yearSelectedData) {
            $actualizacionFormatted = $yearSelectedData->toArray();
            $actualizacionFormatted['fecha_matriculados'] = Carbon::parse($yearSelectedData->fecha_matriculados)->format('d/m/Y');
            $actualizacionFormatted['fecha_1_egresados'] = Carbon::parse($yearSelectedData->fecha_1_egresados)->format('d/m/Y');
            $actualizacionFormatted['fecha_2_egresados'] = Carbon::parse($yearSelectedData->fecha_2_egresados)->format('d/m/Y');
            $actualizacionFormatted['fecha_tope'] = Carbon::parse($yearSelectedData->fecha_tope)->format('d/m/Y');
        } else {
            $actualizacionFormatted = null;
        }
        $totalRecordsCount =($tabla3->get())->count();

        $options = $request->only('ambito_gestion', 'search', 'anio', 'limit','estado', 'page');
            
        return Inertia::render('supervisor/Actualizaciones/Index', [
            'user' => $user,
            'allYears' => $todosLosAnios, //para el dropdown de años
            'nombreProvincia' => $provinciaNombre,
            'initialData' => [
                'yearSelectedData' => $actualizacionFormatted, //fechas de matriculados y 1, 2 y 3 egresados
                'dataTable' => $institutosFiltrados,
                'Sumas' => $sumas,
                'percentageByState' => $percentageByState,
                'totalRecordsCount'=>$totalRecordsCount,
            ], 
            'options' => $options
        ]);
    } 

    public function updateEstado(Request $request, $datoId, $estado)
    {
        $dato = Dato::findOrFail($datoId); 
        $motivoRechazo = $request->input('motivo_rechazo', ' ');

        // Obtener email: primero del parámetro, luego del dato, luego del archivo
        $email = $this->obtenerEmailParaEnvio($request, $datoId);

        if ($estado == Estados::RECHAZADO) {
            $request->validate(['motivo_rechazo' => 'required|string|max:1000']);
            
            if ($email) {
                try {
                    Mail::to($email)->send(new DatoRechazadoMail(
                        $dato, 
                        $motivoRechazo,
                        $request->user()
                    ));

                    Log::info('Email de rechazo enviado', [
                        'dato_id' => $datoId,
                        'email' => $email
                    ]);

                } catch (\Exception $e) {
                    Log::error("Error al enviar email de rechazo para Dato #{$datoId}: " . $e->getMessage());
                }
            } else {
                Log::warning("No se pudo obtener email para envío de rechazo", [
                    'dato_id' => $datoId
                ]);
            }
        }
        
        $idNumerico = (int) $datoId; 
        $newEstadoId = (int) $estado; 
        $supervisorId = $request->user()->id; // ID del supervisor que está aprobando/rechazando
        $success = Dato::changeEstado($idNumerico, $newEstadoId, $motivoRechazo, $supervisorId);

        if ($success) {
            if($newEstadoId == Estados::APROBADO)
                $message = 'Formulario aprobado correctamente.';
            else
                $message = 'Formulario rechazado correctamente.';

            return redirect()->back()->with($request->session()->flash('toast', ['type' => 'success', 'text' => $message]));
        } else {
            return redirect()->back()->with($request->session()->flash('toast', ['type' => 'error', 'text' => "Error al actualizar el estado o dato no encontrado."]));
        }
    }

    /**
     * Obtener email para envío siguiendo este orden de prioridad:
     * 1. Email del parámetro del request (si viene)
     * 2. Según EMAIL_SOURCE del .env:
     *    - Si es 'file' o 'test': usar primer email del archivo emails_prueba.txt
     *    - Si no (o 'database'): usar email del dato desde la base de datos
     * 
     * Esta lógica es consistente con ActualizacionesController de Admin
     * 
     * @param Request $request
     * @param int $datoId
     * @return string|null
     */
    private function obtenerEmailParaEnvio(Request $request, $datoId)
    {
        // 1. Intentar obtener del parámetro del request (prioridad)
        $email = $request->input('email');
        if ($email && filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Log::info('Email obtenido del parámetro del request', ['email' => $email]);
            return $email;
        }

        // 2. Determinar fuente de emails según configuración EMAIL_SOURCE del .env
        // Comportamiento igual al Admin/ActualizacionesController::enviarNotificacionesInstitutos()
        $emailSource = env('EMAIL_SOURCE', 'database');
        
        if ($emailSource === 'file' || $emailSource === 'test') {
            // Usar archivo emails_prueba.txt (modo prueba/testing)
            $email = $this->obtenerEmailDesdeArchivo();
            if ($email) {
                Log::info('Email obtenido del archivo de prueba (EMAIL_SOURCE=' . $emailSource . ')', [
                    'email' => $email,
                    'email_source' => $emailSource
                ]);
                return $email;
            }
        } else {
            // Usar base de datos (comportamiento por defecto)
            $email = Dato::getEmailForData($datoId);
            if ($email) {
                Log::info('Email obtenido de la base de datos (EMAIL_SOURCE=' . $emailSource . ')', [
                    'email' => $email,
                    'dato_id' => $datoId,
                    'email_source' => $emailSource
                ]);
                return $email;
            }
        }

        Log::warning('No se pudo obtener email para envío', [
            'dato_id' => $datoId,
            'email_source' => $emailSource
        ]);

        return null;
    }

    /**
     * Obtener el primer email válido desde el archivo emails_prueba.txt
     */
    private function obtenerEmailDesdeArchivo()
    {
        $archivoPath = base_path('emails_prueba.txt');
        
        if (!file_exists($archivoPath)) {
            Log::warning('Archivo emails_prueba.txt no encontrado');
            return null;
        }
        
        $emails = file($archivoPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        
        foreach ($emails as $email) {
            $email = trim($email);
            if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
                return $email;
            }
        }
        
        Log::warning('No se encontraron emails válidos en el archivo emails_prueba.txt');
        return null;
    }
}