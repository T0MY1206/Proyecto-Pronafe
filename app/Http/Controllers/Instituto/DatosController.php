<?php

namespace App\Http\Controllers\Instituto;

use App\Http\Controllers\Controller;
use App\Models\Dato;
use App\Constants\Estado;
use App\Constants\Rol;

use App\Models\Localidad;
use App\Models\Provincia;
use App\Models\User;
use Illuminate\Http\Request;

class DatosController extends Controller
{

    public function send(Request $request)
    {
        try {
            $provincia = Localidad::find($request->localidad_id)->provincia;

            // Se busca un usuario supervisor que tenga asignada la provincia de la localidad correspondiente
            $supervisorProvincia = User::query()
                ->where('provincia_id', $provincia->id)
                ->where('rol_id', Rol::SUPERVISOR_PROVINCIAL)
                ->first();

            // Si no existe un supervisor, se autoaprueba automáticamente
            if(empty($supervisorProvincia)){
                $updateData = [
                    'estado_id' => Estado::APROBADO,
                    'fecha_envio' => now(),
                    'fecha_aprobacion' => now()
                ];
            } else {
                $updateData = [
                    'estado_id' => Estado::ENVIADO,
                    'fecha_envio' => now()
                ];
            }

            $dato = Dato::where('id', $request->id)
                ->update($updateData);
        } catch (\Throwable $th) {
            $request->session()->flash('toast', ['type' => 'error', 'text' => "Error al enviar el formulario"]);
            throw $th;
        }

        if (!$dato){
            $request->session()->flash('toast', ['type' => 'error', 'text' => "Error al enviar el formulario"]);
            return;
        }

        $request->session()->flash('toast', ['type' => 'success', 'text' => "Formulario enviado correctamente"]);


        return redirect()->route('instituto.actualizacion');
    }
}
