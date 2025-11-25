<?php

namespace App\Http\Controllers\Api;

use App\Constants\Estado;
use App\Constants\Estados;
use App\Http\Controllers\Controller;
use App\Models\Actualizacion;
use App\Models\Dato;
use App\Models\Instituto;
use App\Models\Provincia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class ActualizacionesApiController extends Controller
{
    public function checkAnio($anio)
    {
        $exists = Actualizacion::where('anio', $anio)->exists();

        return response()->json(['exists' => $exists]);
    }

    public function showExpandedRow(Request $request, $anio, $cue)
    {
        try {
            // Consulta del instituto
            $instituto = DB::table('institutos')
                ->where('cue', $cue)
                ->select('cue', 'cue_editable', 'nombre', 'telefono', 'email')
                ->first();

            if (!$instituto) {
                return response()->json([
                    'success' => false,
                    'error' => 'Instituto no encontrado'
                ], 404);
            }

            // Autoridades de instituto (corregido campo)
            $autoridadesInstituto = DB::table('autoridades AS A')
                ->join('cargos AS C', 'A.cargo_id', '=', 'C.id')
                ->where('A.cue', $cue)
                ->where('A.anio', $anio)
                ->where('C.instituto_carrera', 'I') // Campo corregido
                ->select(
                    'A.nombre_apellido',
                    'A.telefono',
                    'A.email',
                    'C.descripcion AS cargo_descripcion'
                )
                ->get();

            // Autoridades de carrera (corregido campo)
            $autoridadesCarrera = DB::table('autoridades AS A')
                ->join('cargos AS C', 'A.cargo_id', '=', 'C.id')
                ->where('A.cue', $cue)
                ->where('A.anio', $anio)
                ->where('C.instituto_carrera', 'C') // Campo corregido
                ->select(
                    'A.nombre_apellido',
                    'A.telefono',
                    'A.email',
                    'C.descripcion AS cargo_descripcion'
                )
                ->get();

            // Observaciones
            $dato = DB::table('datos')
                ->where('cue', $cue)
                ->where('anio', $anio)
                ->select(['id', 'observaciones', 'estado_id'])
                ->first();

            // Estructura de respuesta corregida
            $data = [
                'id' => $dato->id,
                'estado_id' => $dato->estado_id,
                'instituto' => [
                    'cue' => $instituto->cue_editable,
                    'nombre' => $instituto->nombre,
                    'telefono' => $instituto->telefono,
                    'email' => $instituto->email
                ],
                'autoridades_instituto' => $autoridadesInstituto, // Colección completa
                'autoridades_carrera' => $autoridadesCarrera,    // Colección completa
                'observaciones' => $dato->observaciones ? $dato->observaciones : 'Sin observaciones',
                'anio' => $anio,
                'filtros' => [
                    'cue' => $cue,
                    'anio' => $anio
                ]
            ];

            return response()->json([
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private static function filtrarEstadisticasInstitutos(Request $request){
        // Recibir búsqueda desde la barra de búsqueda
        $search = $request->query('search');
        $perPage = $request->query('per_page', 10);

        // Último año registrado
        $latestYearInDb = Actualizacion::max('anio');
        if(empty($latestYearInDb)){
            $latestYearInDb = now()->year;
        }

        // Array de filtros
        $filters = [
            'ambito_gestion' => $request->get('ambito_gestion'),
            'provincia_id' => $request->get('provincia_id'),
            'anio' => $request->get('anio', $latestYearInDb)
        ];

        // PRIMERO: Filtrar institutos según los criterios
        $institutosQuery = Instituto::query();

        if (!empty($filters['provincia_id'])) {
            $institutosQuery->whereHas('departamento', function($q) use ($filters) {
                $q->where('provincia_id', $filters['provincia_id']);
            });
        }
        
        if (!empty($filters['ambito_gestion'])) {
            $institutosQuery->where('ambito_gestion', $filters['ambito_gestion']);
        }

        if (!empty($filters['anio'])){
            $institutosQuery->whereYear('created_at', '<=', $filters['anio']);
        }

        
        if(!empty($search)){
            $institutosQuery->where('cue', 'like', "%{$search}%");
        }

        $institutosQuery->where('activo', true);

        // Obtener los IDs de institutos filtrados
        $institutosFiltradosIds = $institutosQuery->pluck('cue');

        // SEGUNDO: Query de datos basada en los institutos filtrados
        $query = Dato::with(['instituto' => function($q) {
            $q->select('cue', 'cue_editable', 'nombre'); 
        }])->whereIn('cue', $institutosFiltradosIds);


        if(!empty($filters['anio'])){
            $query->where('anio', $filters['anio']);
        }

        // Total de institutos filtrados (esto es el 100%)
        $totalRecordsCount = $institutosFiltradosIds->count();

        // Total de datos aprobados para los institutos que se filtraron
        // Esto se usa despues para calcular los porcentajes, se calcula acá para permanecer los filtros de institutos
        $approvedRecordsCount = $query->where('estado_id', Estados::APROBADO)->count();

        // Totales (solo sobre el query filtrado)
        $sumDocentesCarrera = $query->sum('cantidad_docentes_carrera');
        $sumDocentesPractica = $query->sum('cantidad_docentes_practica');
        $sum1Año = $query->sum('cantidad_anio_1');
        $sum2Año = $query->sum('cantidad_anio_2');
        $sum3Año = $query->sum('cantidad_anio_3');
        $sumEgresados = $query->sum('cantidad_egresados');

        // Obtener datos paginados
        $dataTable = $query->paginate($perPage);

        $dataTable->getCollection()->transform(function($item) {
            $item->cue_editable = $item->instituto->cue_editable ?? null;
            return $item;
        });

        return[
            'dataTable' => $dataTable,
            'totalRecordsCount' => $totalRecordsCount,
            'approvedRecordsCount' => $approvedRecordsCount,
            'sumDocentesCarrera' => $sumDocentesCarrera,
            'sumDocentesPractica' => $sumDocentesPractica,
            'sum1Año' => $sum1Año,
            'sum2Año' => $sum2Año,
            'sum3Año' => $sum3Año,
            'sumEgresados' => $sumEgresados,
            'institutosFiltradosIds' => $institutosFiltradosIds,
            'anio' => $filters['anio']
        ];
    }

    private static function getYearSelectedData($anio){
                // Datos del año seleccionado
        $yearSelectedData = Actualizacion::where('anio', $anio)
            ->select('anio', 'fecha_matriculados', 'fecha_1_egresados', 'fecha_2_egresados', 'fecha_tope')
            ->first();

        if (!$yearSelectedData) {
            $yearSelectedData = [
                'anio' => (string) $anio,
                'fecha_matriculados' => null,
                'fecha_1_egresados' => null,
                'fecha_2_egresados' => null,
                'fecha_tope' => null,
            ];
        } else {
            // Convertir a array para poder modificar los valores
            $yearSelectedData = $yearSelectedData->toArray();
            
            // Sobrescribir las fechas con formato
            if (!empty($yearSelectedData['fecha_matriculados'])) {
                $yearSelectedData['fecha_matriculados'] = Carbon::parse($yearSelectedData['fecha_matriculados'])
                    ->locale('es')
                    ->isoFormat('DD [de] MMMM [de] YYYY');
            }
            
            if (!empty($yearSelectedData['fecha_1_egresados'])) {
                $yearSelectedData['fecha_1_egresados'] = Carbon::parse($yearSelectedData['fecha_1_egresados'])
                    ->locale('es')
                    ->isoFormat('DD [de] MMMM [de] YYYY');
            }
            
            if (!empty($yearSelectedData['fecha_2_egresados'])) {
                $yearSelectedData['fecha_2_egresados'] = Carbon::parse($yearSelectedData['fecha_2_egresados'])
                    ->locale('es')
                    ->isoFormat('DD [de] MMMM [de] YYYY');
            }
            
            if (!empty($yearSelectedData['fecha_tope'])) {
                $yearSelectedData['fecha_tope'] = Carbon::parse($yearSelectedData['fecha_tope'])
                    ->locale('es')
                    ->isoFormat('DD [de] MMMM [de] YYYY');
            }
        }

        return $yearSelectedData;
    }

    private static function calcularPorcentajesSupervisor($institutosFiltradosIds, $anio, $totalRegistros){
        // Porcentaje por estado (basado en el total de institutos filtrados)
        $percentageByState = [];

        // Contar institutos con datos en estados 2, 3, 4
        $institutosConDatosEstados234 = Dato::whereIn('cue', $institutosFiltradosIds)
            ->where('anio', $anio)
            ->whereIn('estado_id', [2, 3, 4])
            ->distinct('cue')
            ->count('cue');

        // Estado 1 = Total de institutos filtrados - Institutos con estados 2,3,4
        $countEstado1 = $totalRegistros - $institutosConDatosEstados234;

        // Estados 2, 3, 4 - contar desde la base de datos
        foreach ([2, 3, 4] as $estadoId) {
            $estadoCount = Dato::whereIn('cue', $institutosFiltradosIds)
                ->where('anio', $anio)
                ->where('estado_id', $estadoId)
                ->distinct('cue')
                ->count('cue');
            
            $percentageByState[$estadoId] = $totalRegistros > 0
                ? round(($estadoCount / $totalRegistros) * 100, 2)
                : 0;
        }

        // Estado 1 (calculado por diferencia)
        $percentageByState[1] = $totalRegistros > 0
            ? round(($countEstado1 / $totalRegistros) * 100, 2)
            : 0;

        return $percentageByState;
    }

    private static function calcularPorcentajesAdmin($totalInstitutos, $approvedRecordsCount, $anio){
        // Institutos pendientes = Total - Aprobados (o sea, todos los que no están aprobados se muestran como pendientes porque así lo pide el PRONAFE)
        $countPendientes = $totalInstitutos - $approvedRecordsCount;

        // Calcular porcentajes para el gráfico
        $percentageByState = [];
        if ($totalInstitutos > 0) {
            $percentageByState[1] = round(($approvedRecordsCount / $totalInstitutos) * 100, 2); // Aprobados
            $percentageByState[2] = round(($countPendientes / $totalInstitutos) * 100, 2); // Pendientes
        } else {
            $percentageByState[1] = 0;
            $percentageByState[2] = 0;
        }

        return [
            'percentageByState' => $percentageByState,
            'countPendientes' => $countPendientes,
            'countAprobados' => $approvedRecordsCount
        ];
    }

    public static function reporteSupervisor(Request $request)
    {
        $filteredData = Self::filtrarEstadisticasInstitutos($request);
        $percentageByState = Self::calcularPorcentajesSupervisor(
            $filteredData['institutosFiltradosIds'], 
            $filteredData['anio'], 
            $filteredData['totalRecordsCount']);
        $yearSelectedData = Self::getYearSelectedData($filteredData['anio']);

        return
        [
            'dataTable' => $filteredData['dataTable'],
            'totalRecordsCount' => $filteredData['totalRecordsCount'],
            'sumDocentesCarrera' => $filteredData['sumDocentesCarrera'],
            'sumDocentesPractica' => $filteredData['sumDocentesPractica'],
            'sum1Año' => $filteredData['sum1Año'],
            'sum2Año' => $filteredData['sum2Año'],
            'sum3Año' => $filteredData['sum3Año'],
            'sumEgresados' => $filteredData['sumEgresados'],
            'percentageByState' => $percentageByState,
            'yearSelectedData' => $yearSelectedData
        ];
    }

    public static function reporteAdmin(Request $request)
    {
        $filteredData = Self::filtrarEstadisticasInstitutos($request);
        $porcentajesAdmin = Self::calcularPorcentajesAdmin(
            $filteredData['totalRecordsCount'], $filteredData['approvedRecordsCount'], $filteredData['anio']);
        $yearSelectedData = Self::getYearSelectedData($filteredData['anio']);

        return [
            'yearSelectedData' => $yearSelectedData,
            'dataTable' => $filteredData['dataTable'],
            'totalRecordsCount' => $filteredData['totalRecordsCount'],
            'sumDocentesCarrera' => $filteredData['sumDocentesCarrera'],
            'sumDocentesPractica' => $filteredData['sumDocentesPractica'],
            'sum1Año' => $filteredData['sum1Año'],
            'sum2Año' => $filteredData['sum2Año'],
            'sum3Año' => $filteredData['sum3Año'],
            'sumEgresados' => $filteredData['sumEgresados'],
            'percentageByState' => $porcentajesAdmin['percentageByState'],
            'countPendientes' => $porcentajesAdmin['countPendientes'],
            'countAprobados' => $porcentajesAdmin['countAprobados']
        ];
    }
}
