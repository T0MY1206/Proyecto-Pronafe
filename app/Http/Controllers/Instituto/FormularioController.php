<?php

namespace App\Http\Controllers\Instituto;

use App\Http\Controllers\Controller;
use App\Models\Dato;
use App\Models\Actualizacion;
use App\Models\Estado;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FormularioController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $instituto = $user->instituto;
        
        if (!$instituto) {
            return redirect()->route('instituto.dashboard')
                ->with('error', 'No se encontró información del instituto.');
        }

        $periodoActual = Actualizacion::where('activo', true)->first();
        
        if (!$periodoActual) {
            return redirect()->route('instituto.dashboard')
                ->with('error', 'No hay período de actualización activo.');
        }

        // Buscar datos del año actual
        $datosActuales = Dato::where('cue', $instituto->cue)
            ->where('anio', $periodoActual->anio)
            ->first();

        // Si no existen datos, crear un borrador
        if (!$datosActuales) {
            $datosActuales = Dato::create([
                'anio' => $periodoActual->anio,
                'cue' => $instituto->cue,
                'estado_id' => 1, // Pendiente
                'user_id' => $user->id
            ]);
        }

        // Obtener datos de años anteriores para importar
        $datosAnteriores = Dato::where('cue', $instituto->cue)
            ->where('anio', '<', $periodoActual->anio)
            ->orderBy('anio', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('Instituto/Formulario/Index', [
            'datosActuales' => $datosActuales,
            'datosAnteriores' => $datosAnteriores,
            'periodoActual' => $periodoActual,
            'estados' => Estado::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'cantidad_docentes_carrera' => 'nullable|integer|min:0',
            'cantidad_docentes_practica' => 'nullable|integer|min:0',
            'cantidad_anio_1' => 'nullable|integer|min:0',
            'cantidad_anio_2' => 'nullable|integer|min:0',
            'cantidad_anio_3' => 'nullable|integer|min:0',
            'cantidad_egresados' => 'nullable|integer|min:0',
            'monto_anual' => 'nullable|numeric|min:0',
            'monto_mensual' => 'nullable|numeric|min:0',
            'monto_extracurricular' => 'nullable|numeric|min:0',
            'cantidad_cuota' => 'nullable|integer|min:0',
            'observaciones' => 'nullable|string|max:1000'
        ]);

        $user = Auth::user();
        $instituto = $user->instituto;
        $periodoActual = Actualizacion::where('activo', true)->first();

        $datos = Dato::where('cue', $instituto->cue)
            ->where('anio', $periodoActual->anio)
            ->first();

        if (!$datos) {
            return redirect()->back()->with('error', 'No se encontraron datos para actualizar.');
        }

        // Solo permitir editar si está en estado pendiente o rechazado
        if (!in_array($datos->estado_id, [1, 4])) { // 1=Pendiente, 4=Rechazado
            return redirect()->back()->with('error', 'No se puede editar en el estado actual.');
        }

        $datos->update($request->all());

        return redirect()->back()->with('success', 'Datos guardados correctamente.');
    }

    public function enviar(Request $request)
    {
        $user = Auth::user();
        $instituto = $user->instituto;
        $periodoActual = Actualizacion::where('activo', true)->first();

        $datos = Dato::where('cue', $instituto->cue)
            ->where('anio', $periodoActual->anio)
            ->first();

        if (!$datos) {
            return redirect()->back()->with('error', 'No se encontraron datos para enviar.');
        }

        // Solo permitir enviar si está en estado pendiente o rechazado
        if (!in_array($datos->estado_id, [1, 4])) { // 1=Pendiente, 4=Rechazado
            return redirect()->back()->with('error', 'No se puede enviar en el estado actual.');
        }

        $datos->update([
            'estado_id' => 2, // Enviado
            'fecha_envio' => now()
        ]);

        return redirect()->back()->with('success', 'Formulario enviado para revisión.');
    }

    public function importarAnioAnterior(Request $request)
    {
        $request->validate([
            'anio' => 'required|integer'
        ]);

        $user = Auth::user();
        $instituto = $user->instituto;
        $periodoActual = Actualizacion::where('activo', true)->first();

        // Buscar datos del año anterior
        $datosAnteriores = Dato::where('cue', $instituto->cue)
            ->where('anio', $request->anio)
            ->first();

        if (!$datosAnteriores) {
            return redirect()->back()->with('error', 'No se encontraron datos del año seleccionado.');
        }

        // Buscar o crear datos actuales
        $datosActuales = Dato::where('cue', $instituto->cue)
            ->where('anio', $periodoActual->anio)
            ->first();

        if (!$datosActuales) {
            $datosActuales = Dato::create([
                'anio' => $periodoActual->anio,
                'cue' => $instituto->cue,
                'estado_id' => 1, // Pendiente
                'user_id' => $user->id
            ]);
        }

        // Importar datos (excluyendo campos de control)
        $datosActuales->update([
            'cantidad_docentes_carrera' => $datosAnteriores->cantidad_docentes_carrera,
            'cantidad_docentes_practica' => $datosAnteriores->cantidad_docentes_practica,
            'cantidad_anio_1' => $datosAnteriores->cantidad_anio_1,
            'cantidad_anio_2' => $datosAnteriores->cantidad_anio_2,
            'cantidad_anio_3' => $datosAnteriores->cantidad_anio_3,
            'cantidad_egresados' => $datosAnteriores->cantidad_egresados,
            'monto_anual' => $datosAnteriores->monto_anual,
            'monto_mensual' => $datosAnteriores->monto_mensual,
            'monto_extracurricular' => $datosAnteriores->monto_extracurricular,
            'cantidad_cuota' => $datosAnteriores->cantidad_cuota,
            'observaciones' => $datosAnteriores->observaciones
        ]);

        return redirect()->back()->with('success', 'Datos importados correctamente del año ' . $request->anio);
    }
}
