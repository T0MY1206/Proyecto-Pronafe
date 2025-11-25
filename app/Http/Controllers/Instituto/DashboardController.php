<?php

namespace App\Http\Controllers\Instituto;

use App\Http\Controllers\Controller;
use App\Models\Dato;
use App\Models\Actualizacion;
use App\Models\Instituto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Obtener el CUE del usuario autenticado
        $user = Auth::user();
        $instituto = $user->instituto;

        if (!$instituto) {
            Log::error('Usuario no tiene instituto asignado', ['user_id' => $user?->id]);
            // Forzar logout para limpiar la sesión
            Auth::guard('web')->logout();
            request()->session()->invalidate();
            request()->session()->regenerateToken();
            return redirect('login')->with('error', 'Usuario sin instituto asignado. Por favor, contacte al administrador.');
        }

        $instituto = \App\Models\Instituto::with([
            'localidad.provincia', 
            'departamento',
            'autoridades.cargo'
        ])->where('cue', $user->cue_instituto)->first();
        
        if (!$instituto) {
            Log::error('No se encontró instituto con CUE', ['cue' => $user->cue_instituto]);
            // Forzar logout para limpiar la sesión
            Auth::guard('web')->logout();
            request()->session()->invalidate();
            request()->session()->regenerateToken();
            return redirect('login')->with('error', 'Instituto no encontrado. Por favor, contacte al administrador.');
        }

        Log::info('Dashboard access TEST', [
            'instituto' => $instituto->toArray(),
            'autoridades_count' => $instituto->autoridades ? $instituto->autoridades->count() : 0
        ]);

        $periodoActual = Actualizacion::where('activo', true)->first();
        
        // Obtener datos de los últimos 10 años
        $datosHistoricos = Dato::where('cue', $instituto->cue)
            ->with('estado')
            ->orderBy('anio', 'desc')
            ->limit(10)
            ->get();

        // Obtener datos del año actual
        $datosActuales = null;
        if ($periodoActual) {
            $datosActuales = Dato::where('cue', $instituto->cue)
                ->where('anio', $periodoActual->anio)
                ->first();
        }

        // Debug log
        Log::info('Rendering dashboard', [
            'instituto_nombre' => $instituto->nombre,
            'datos_count' => $datosHistoricos->count(),
            'periodo_actual' => $periodoActual ? $periodoActual->anio : null
        ]);

        // Usar el mismo patrón del admin: un solo objeto con arrays simples
        $dashboardData = [
            'instituto' => [
                'cue' => $instituto->cue,
                'cue_editable' => $instituto->cue_editable,
                'nombre' => $instituto->nombre,
                'direccion' => $instituto->direccion,
                'codigo_postal' => $instituto->codigo_postal,
                'telefono' => $instituto->telefono,
                'email' => $instituto->email,
                'ambito_gestion' => $instituto->ambito_gestion,
                'anio_ingreso' => $instituto->anio_ingreso,
                'anio_egreso' => $instituto->anio_egreso,
                'activo' => $instituto->activo,
                'created_at' => $instituto->created_at,
                'updated_at' => $instituto->updated_at,
                'localidad' => $instituto->localidad ? [
                    'id' => $instituto->localidad->id,
                    'descripcion' => $instituto->localidad->descripcion,
                    'provincia' => $instituto->localidad->provincia ? [
                        'id' => $instituto->localidad->provincia->id,
                        'descripcion' => $instituto->localidad->provincia->descripcion
                    ] : null
                ] : null,
                'departamento' => $instituto->departamento ? [
                    'id' => $instituto->departamento->id,
                    'descripcion' => $instituto->departamento->descripcion
                ] : null,
                'tipo_instituto' => $instituto->tipo_instituto ? [
                    'id' => $instituto->tipo_instituto->id,
                    'descripcion' => $instituto->tipo_instituto->descripcion
                ] : null,
                'autoridades' => $instituto->autoridades->map(function($autoridad) {
                    return [
                        'id' => $autoridad->id,
                        'nombre_apellido' => $autoridad->nombre_apellido,
                        'telefono' => $autoridad->telefono,
                        'email' => $autoridad->email,
                        'cargo' => $autoridad->cargo ? [
                            'id' => $autoridad->cargo->id,
                            'descripcion' => $autoridad->cargo->descripcion
                        ] : null
                    ];
                })->toArray(),
                'id' => $instituto->id
            ],
            'periodoActual' => $periodoActual ? [
                'anio' => $periodoActual->anio,
                'id' => $periodoActual->id
            ] : null,
            'datosActuales' => $datosActuales ? [
                'cantidad_anio_1' => $datosActuales->cantidad_anio_1,
                'cantidad_anio_2' => $datosActuales->cantidad_anio_2,
                'cantidad_anio_3' => $datosActuales->cantidad_anio_3,
                'cantidad_egresados' => $datosActuales->cantidad_egresados,
                'cantidad_docentes_carrera' => $datosActuales->cantidad_docentes_carrera,
                'cantidad_docentes_practica' => $datosActuales->cantidad_docentes_practica
            ] : null,
            'datosHistoricos' => $datosHistoricos->map(function($dato) {
                return [
                    'id' => $dato->id,
                    'anio' => $dato->anio,
                    'cantidad_anio_1' => $dato->cantidad_anio_1,
                    'cantidad_anio_2' => $dato->cantidad_anio_2,
                    'cantidad_anio_3' => $dato->cantidad_anio_3,
                    'cantidad_egresados' => $dato->cantidad_egresados,
                    'cantidad_docentes_carrera' => $dato->cantidad_docentes_carrera,
                    'cantidad_docentes_practica' => $dato->cantidad_docentes_practica,
                    'estado_id' => $dato->estado_id
                ];
            })->toArray()
        ];

        return Inertia::render('instituto/Dashboard/Index', [
            'dashboardData' => $dashboardData
        ]);
    }

    private function prepararDatosGraficoAlumnos($datosHistoricos)
    {
        $labels = [];
        $datosAnio1 = [];
        $datosAnio2 = [];
        $datosAnio3 = [];

        foreach ($datosHistoricos as $dato) {
            $labels[] = $dato->anio;
            $datosAnio1[] = $dato->cantidad_anio_1 ?? 0;
            $datosAnio2[] = $dato->cantidad_anio_2 ?? 0;
            $datosAnio3[] = $dato->cantidad_anio_3 ?? 0;
        }

        return [
            'labels' => array_reverse($labels),
            'datasets' => [
                [
                    'label' => 'Primer Año',
                    'data' => array_reverse($datosAnio1),
                    'borderColor' => 'rgb(75, 192, 192)',
                    'backgroundColor' => 'rgba(75, 192, 192, 0.2)',
                ],
                [
                    'label' => 'Segundo Año',
                    'data' => array_reverse($datosAnio2),
                    'borderColor' => 'rgb(54, 162, 235)',
                    'backgroundColor' => 'rgba(54, 162, 235, 0.2)',
                ],
                [
                    'label' => 'Tercer Año',
                    'data' => array_reverse($datosAnio3),
                    'borderColor' => 'rgb(255, 99, 132)',
                    'backgroundColor' => 'rgba(255, 99, 132, 0.2)',
                ],
            ]
        ];
    }

    private function prepararDatosGraficoEgresados($datosHistoricos)
    {
        $labels = [];
        $datos = [];

        foreach ($datosHistoricos as $dato) {
            $labels[] = $dato->anio;
            $datos[] = $dato->cantidad_egresados ?? 0;
        }

        return [
            'labels' => array_reverse($labels),
            'datasets' => [
                [
                    'label' => 'Egresados',
                    'data' => array_reverse($datos),
                    'borderColor' => 'rgb(153, 102, 255)',
                    'backgroundColor' => 'rgba(153, 102, 255, 0.2)',
                ]
            ]
        ];
    }

    private function prepararDatosGraficoDocentes($datosHistoricos)
    {
        $labels = [];
        $datosCarrera = [];
        $datosPractica = [];

        foreach ($datosHistoricos as $dato) {
            $labels[] = $dato->anio;
            $datosCarrera[] = $dato->cantidad_docentes_carrera ?? 0;
            $datosPractica[] = $dato->cantidad_docentes_practica ?? 0;
        }

        return [
            'labels' => array_reverse($labels),
            'datasets' => [
                [
                    'label' => 'Docentes de Carrera',
                    'data' => array_reverse($datosCarrera),
                    'borderColor' => 'rgb(255, 159, 64)',
                    'backgroundColor' => 'rgba(255, 159, 64, 0.2)',
                ],
                [
                    'label' => 'Docentes de Práctica',
                    'data' => array_reverse($datosPractica),
                    'borderColor' => 'rgb(255, 205, 86)',
                    'backgroundColor' => 'rgba(255, 205, 86, 0.2)',
                ]
            ]
        ];
    }
}
