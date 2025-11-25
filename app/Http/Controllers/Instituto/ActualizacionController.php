<?php

namespace App\Http\Controllers\Instituto;

use App\Constants\Estado;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\TipoInstituto;
use App\Models\Localidad;
use App\Models\Actualizacion;
use App\Models\Autoridad;
use App\Models\Cargo;
use App\Models\Dato;
use Inertia\Inertia;
use Carbon\Carbon;

class ActualizacionController extends Controller
{
    public function index()
    {
        $localidades = Localidad::getLocalidades();
        $tiposDeInstitucion = TipoInstituto::getAll();
        $user = Auth::user();
        $instituto = $user->institutos->first();

        $actualizacion = Actualizacion::query()
        ->where('anio', Actualizacion::max('anio'))
        ->first(); //Traigo la actualización del último año
        $estadoActualizacion = $instituto->traerEstadoDatos(Actualizacion::max('anio'));

        if ($actualizacion) {
            $actualizacionFormatted = $actualizacion->toArray();

            // Convertir fechas a formato legible, por ejemplo: 'd/m/Y'
            $actualizacionFormatted['fecha_matriculados'] = Carbon::parse($actualizacion->fecha_matriculados)->format('d/m/Y');
            $actualizacionFormatted['fecha_1_egresados'] = Carbon::parse($actualizacion->fecha_1_egresados)->format('d/m/Y');
            $actualizacionFormatted['fecha_2_egresados'] = Carbon::parse($actualizacion->fecha_2_egresados)->format('d/m/Y');
            $actualizacionFormatted['fecha_tope'] = Carbon::parse($actualizacion->fecha_tope)->format('d/m/Y');
        } else {
            $actualizacionFormatted = null;
            return inertia('instituto/Actualizacion/Index'); 
            //Si no se encontró ninguna actualización, lo envío a la página sin info para que el frontend lo notifique
        }

        //Se tratan de buscar datos cargados para este instituto y año
        $datos = Dato::where('cue', $instituto->cue)->where('anio', $actualizacion->anio)->first();
        //Se inicializan autoridades vacias para evitar una variable indefinida en caso de no tener datos
        $autoridades = collect();
        $autoridadesHeredadas = false;

        // Buscar autoridades del año actual
        $autoridades = Autoridad::with('cargo')
            ->where('cue', $instituto->cue)
            ->where('anio', $actualizacion->anio)
            ->get();

        // Si no hay autoridades para el año actual, buscar del año anterior
        if ($autoridades->isEmpty()) {
            $anioAnterior = $actualizacion->anio - 1;
            $autoridades = Autoridad::with('cargo')
                ->where('cue', $instituto->cue)
                ->where('anio', $anioAnterior)
                ->get();
            
            // Si encontramos autoridades del año anterior, marcarlas como heredadas
            if ($autoridades->isNotEmpty()) {
                $autoridadesHeredadas = true;
            }
        }

        return inertia('instituto/Actualizacion/Index', [
            'localidades' => $localidades,
            'tiposDeInstitucion' => $tiposDeInstitucion,
            'instituto' => $instituto,
            'actualizacion' => $actualizacionFormatted,
            'estadoActualizacion' => $estadoActualizacion,
            'datos' => $datos,
            'autoridades' => $autoridades,
            'autoridadesHeredadas' => $autoridadesHeredadas
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();
        $instituto = $user->institutos->first();

        $rules = [
            'anio' => 'required|integer',

            'nombre' => 'required|string|max:255',
            'ambito_gestion' => 'required|string|in:E,P',
            'tipo_instituto' => 'required|exists:tipo_institutos,id',
            'localidad' => 'required|exists:localidades,id',
            'domicilio' => 'required|string|max:100',
            'codigo_postal' => 'required|digits:4',
            'telefono' => 'required|string|max:20',
            'email' => 'required|email|max:255',

            'autoridad_institucional_nombre_apellido' => 'required|string|max:255',
            'autoridad_institucional_cargo' => 'required|string|max:100',
            'autoridad_institucional_telefono' => 'required|string|max:20',
            'autoridad_institucional_email' => 'required|email|max:255',

            'autoridad_carrera_nombre_apellido' => 'required|string|max:255',
            'autoridad_carrera_cargo' => 'required|string|max:100',
            'autoridad_carrera_telefono' => 'required|string|max:20',
            'autoridad_carrera_email' => 'required|email|max:255',

            'cantidad_docentes_carrera' => 'integer|min:0',
            'cantidad_docentes_practica' => 'integer|min:0',
            'cantidad_anio_1' => 'required|integer|min:0',
            'cantidad_anio_2' => 'required|integer|min:0',
            'cantidad_anio_3' => 'required|integer|min:0',
            'cantidad_egresados' => 'required|integer|min:0',

            'observaciones' => 'nullable|string|max:1000',
        ];

        if ($request->input('ambito_gestion') === 'P') {
            $rules = array_merge($rules, [
                'monto_anual' => 'required|numeric|min:0',
                'monto_mensual' => 'required|numeric|min:0',
                'cantidad_cuota' => 'required|numeric|min:0',
                'monto_extracurricular' => 'required|numeric|min:0',
            ]);
        }

        $data = $request->validate($rules);

        try {
            // 1. Actualizar datos del instituto
            $instituto->update([
                'nombre' => $data['nombre'],
                'ambito_gestion' => $data['ambito_gestion'],
                'tipo_instituto_id' => $data['tipo_instituto'],
                'localidad_id' => $data['localidad'],
                'direccion' => $data['domicilio'],
                'codigo_postal' => $data['codigo_postal'],
                'telefono' => $data['telefono'],
                'email' => $data['email'],
            ]);

            // 2. Buscar autoridad institucional existente para cue + año + tipo
            $autoridadInstitucional = Autoridad::where('cue', $instituto->cue)
                ->where('anio', $data['anio'])
                ->whereHas('cargo', function ($q) {
                    $q->where('instituto_carrera', 'I');
                })
                ->first();

            // 2.1 Si existe, actualizamos el cargo asociado y la autoridad
            if ($autoridadInstitucional) {
                $cargo = $autoridadInstitucional->cargo;

                $cargo->update(['descripcion' => $data['autoridad_institucional_cargo']]);

                $autoridadInstitucional->update([
                    'nombre_apellido' => $data['autoridad_institucional_nombre_apellido'],
                    'telefono' => $data['autoridad_institucional_telefono'],
                    'email' => $data['autoridad_institucional_email'],
                    'user_id' => $user->id,
                    'activo' => true,
                ]);
            } else {
                // 2.3 Si no existe, creo el cargo y la autoridad
                $cargoAutoridadInstitucional = Cargo::firstOrCreate(
                    [
                        'descripcion' => $data['autoridad_institucional_cargo'],
                        'instituto_carrera' => 'I'
                    ]
                );

                Autoridad::create([
                    'cue' => $instituto->cue,
                    'anio' => $data['anio'],
                    'nombre_apellido' => $data['autoridad_institucional_nombre_apellido'],
                    'telefono' => $data['autoridad_institucional_telefono'],
                    'email' => $data['autoridad_institucional_email'],
                    'user_id' => $user->id,
                    'activo' => true,
                    'cargo_id' => $cargoAutoridadInstitucional->id,
                ]);
            }

            // 3. Buscar autoridad de carrera existente para cue + año + tipo
            $autoridadCarrera = Autoridad::where('cue', $instituto->cue)
                ->where('anio', $data['anio'])
                ->whereHas('cargo', function ($q) {
                    $q->where('instituto_carrera', 'C');
                })
                ->first();

            // 2.1 Si existe, actualizamos el cargo asociado y la autoridad
            if ($autoridadCarrera) {
                $cargo = $autoridadCarrera->cargo;

                $cargo->update(['descripcion' => $data['autoridad_carrera_cargo']]);

                $autoridadCarrera->update([
                    'nombre_apellido' => $data['autoridad_carrera_nombre_apellido'],
                    'telefono' => $data['autoridad_carrera_telefono'],
                    'email' => $data['autoridad_carrera_email'],
                    'user_id' => $user->id,
                    'activo' => true,
                ]);
            } else {
                // 2.3 Si no existe, creo el cargo y la autoridad
                $cargoAutoridadCarrera = Cargo::firstOrCreate(
                    [
                        'descripcion' => $data['autoridad_carrera_cargo'],
                        'instituto_carrera' => 'C'
                    ]
                );

                Autoridad::create([
                    'cue' => $instituto->cue,
                    'anio' => $data['anio'],
                    'nombre_apellido' => $data['autoridad_carrera_nombre_apellido'],
                    'telefono' => $data['autoridad_carrera_telefono'],
                    'email' => $data['autoridad_carrera_email'],
                    'user_id' => $user->id,
                    'activo' => true,
                    'cargo_id' => $cargoAutoridadCarrera->id,
                ]);
            }

            // 4. Crear registro en tabla datos
            Dato::updateOrCreate(
                [
                    'cue' => $instituto->cue,
                    'anio' => $data['anio']
                ],
                [
                    'cantidad_docentes_carrera' => $data['cantidad_docentes_carrera'] ?? 0,
                    'cantidad_docentes_practica' => $data['cantidad_docentes_practica'] ?? 0,
                    'cantidad_anio_1' => $data['cantidad_anio_1'] ?? 0,
                    'cantidad_anio_2' => $data['cantidad_anio_2'] ?? 0,
                    'cantidad_anio_3' => $data['cantidad_anio_3'] ?? 0,
                    'cantidad_egresados' => $data['cantidad_egresados'] ?? 0,
                    'monto_anual' => $data['monto_anual'] ?? null,
                    'monto_mensual' => $data['monto_mensual'] ?? null,
                    'monto_extracurricular' => $data['monto_extracurricular'] ?? null,
                    'cantidad_cuota' => $data['cantidad_cuota'] ?? null,
                    'observaciones' => $data['observaciones'] ?? null,
                    'estado_id' => Estado::PENDIENTE,
                    'user_id' => $user->id,
                ]
            );
        } catch (\Throwable $th) {
            $request->session()->flash('toast', ['type' => 'error', 'text' => "Error al guardar los datos"]);
            throw $th;
        }

        $request->session()->flash('toast', ['type' => 'success', 'text' => "Datos guardados correctamente, presione el botón de enviar para confirmar el envío del formulario"]);

        // Acá redirijo a la misma pagina para que salga el mensaje de que la actualización ya fue cargada
        return Inertia::location(route('instituto.actualizacion'));
    }
}
