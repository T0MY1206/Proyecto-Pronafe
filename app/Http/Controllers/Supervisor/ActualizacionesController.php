<?php

namespace App\Http\Controllers\Supervisor;

use App\Constants\Estados;
use App\Http\Controllers\Controller;
use App\Services\SupervisorDatoEstadoService;
use App\Models\Actualizacion;
use App\Models\Provincia;
use App\Models\Dato;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ActualizacionesController extends Controller
{
    public function __construct(private readonly SupervisorDatoEstadoService $supervisorDatoEstadoService)
    {
    }

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
        $newEstadoId = (int) $estado;
        $success = $this->supervisorDatoEstadoService->updateEstado($request, (int) $datoId, $newEstadoId);

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
}