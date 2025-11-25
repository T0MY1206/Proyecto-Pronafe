<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Provincia;
use App\Models\Departamento;

class UbicacionController extends Controller
{
    //Departamentos por provincia
    public function departamentos($provinciaId)
    {
        $provincia = Provincia::with('departamentos')->findOrFail($provinciaId);
        return response()->json($provincia->departamentos);
    }

    //Localidades por departamento
        // Obtener localidades por departamento
    public function localidades($departamentoId)
    {
        $departamento = Departamento::with('localidades')->findOrFail($departamentoId);
        return response()->json($departamento->localidades);
    }
}
