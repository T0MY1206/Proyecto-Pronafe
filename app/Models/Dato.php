<?php

namespace App\Models;

use App\Constants\Estados;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Dato extends Model
{
    protected $table = 'datos';

    protected $primaryKey = 'id';
    public $incrementing = true;

    protected function casts(): array
    {
        return [
            'fecha_envio' => 'datetime',
            'fecha_aprobacion' => 'datetime',
            'fecha_rechazo' => 'datetime',
        ];
    }

    protected $fillable = [
        'anio',
        'cantidad_docentes_carrera',
        'cantidad_docentes_practica',
        'cantidad_anio_1',
        'cantidad_anio_2',
        'cantidad_anio_3',
        'cantidad_egresados',
        'monto_anual',
        'monto_mensual',
        'monto_extracurricular',
        'cantidad_cuota',
        'observaciones',
        'motivo_rechazo',
        'estado_id',
        'cue',
        'user_id',
        'supervisor_id',
        'fecha_envio',
        'fecha_aprobacion',
        'fecha_rechazo'
    ];

    public function instituto(): BelongsTo
    {
        return $this->belongsTo(Instituto::class, 'cue');
    }

    public function actualizacion(): BelongsTo
    {
        return $this->belongsTo(Actualizacion::class, 'anio');
    }

    public function estado(): BelongsTo
    {
        return $this->belongsTo(Estado::class, 'estado_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function supervisor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'supervisor_id');
    }

    public static function getDatosByProvinciaId($provinciaId, $filters = [])
    {
        $query = self::query()
            ->select([
                'datos.id',
                'datos.cue',
                'datos.anio',
                'datos.cantidad_docentes_carrera',
                'datos.cantidad_docentes_practica',
                'datos.cantidad_anio_1',
                'datos.cantidad_anio_2',
                'datos.cantidad_anio_3',
                'datos.cantidad_egresados',
                'datos.estado_id',
                'estados.descripcion as estado_descripcion',
                'institutos.nombre as instituto_nombre',
                'institutos.ambito_gestion',
                'institutos.cue_editable',
                'departamentos.descripcion as departamento_nombre'
            ])
            ->join('institutos', 'datos.cue', '=', 'institutos.cue')
            ->join('departamentos', 'institutos.departamento_id', '=', 'departamentos.id')
            ->leftJoin('estados', 'datos.estado_id', '=', 'estados.id')
            ->where('institutos.activo', 1)
            ->where('departamentos.provincia_id', $provinciaId);

        // Filtros dinámicos
        if (!empty($filters['anio'])) {
            $query->where('datos.anio', $filters['anio']);
        }
        if (!empty($filters['ambito_gestion'])) {
            $query->where('institutos.ambito_gestion', $filters['ambito_gestion']);
        }   
        if (!empty($filters['estado'])) {
            if ($filters['estado'] == 3) { // Si se buscan los datos que ya fueron revisados
                //Where in recibe un array de datos y revisa que el valor de la columna este dentro de ese array
                //En este caso corresponde a si el valor de datos.estado_id es aprobado o rechazado
                    $query->whereIn('datos.estado_id', [Estados::APROBADO, Estados::RECHAZADO]);
            } elseif ($filters['estado'] == 1) {
                //Caso contrario se buscan unicamente los registros que el supervisor deba revisar (Estado enviado por el instituto)
                $query->where('datos.estado_id', Estados::ENVIADO);
            }
        }
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function($q) use ($search) {
                $q->where('institutos.nombre', 'like', "%$search%")
                ->orWhere('institutos.cue', 'like', "%$search%");
            });
        }

        return $query;
    }
    public static function getDatosByProvinciaIdForGraphics($provinciaId, $filters = [])
    {
        $query = self::query()
            ->select([
                'datos.id',
                'datos.cue',
                'datos.anio',
                'datos.cantidad_docentes_carrera',
                'datos.cantidad_docentes_practica',
                'datos.cantidad_anio_1',
                'datos.cantidad_anio_2',
                'datos.cantidad_anio_3',
                'datos.cantidad_egresados',
                'datos.estado_id',
                'estados.descripcion as estado_descripcion',
                'institutos.nombre as instituto_nombre',
                'institutos.ambito_gestion',
                'departamentos.descripcion as departamento_nombre'
            ])
            ->join('institutos', 'datos.cue', '=', 'institutos.cue')
            ->join('departamentos', 'institutos.departamento_id', '=', 'departamentos.id')
            ->leftJoin('estados', 'datos.estado_id', '=', 'estados.id')
            ->where('institutos.activo', 1)
            ->where('departamentos.provincia_id', $provinciaId);

        // Filtros dinámicos
        if (!empty($filters['anio'])) {
            $query->where('datos.anio', $filters['anio']);
        }
        if (!empty($filters['ambito_gestion'])) {
            $query->where('institutos.ambito_gestion', $filters['ambito_gestion']);
        } 
        return $query;
    }

    public static function getSumsForTable($query)
    {
        $query->where('estado_id', 3);
        
        return (object) [
            'totalRecordsCount' => $query->count(),
            //Sumamos las columnas
            'sumDocentesCarrera' => $query->sum('cantidad_docentes_carrera'),
            'sumDocentesPractica' => $query->sum('cantidad_docentes_practica'),
            'sum1Año' => $query->sum('cantidad_anio_1'),
            'sum2Año' => $query->sum('cantidad_anio_2'),
            'sum3Año' => $query->sum('cantidad_anio_3'),
            'sumEgresados' => $query->sum('cantidad_egresados'),
        ];
    }

    public static function getPercentagesByState($query)
    {
        $queryForCount = clone $query;
        $totalRecordsCount = $queryForCount->count();

        // Si no hay registros, retornamos un array vacío o con ceros
        if ($totalRecordsCount === 0) {
            return [1 => 0, 2 => 0, 3 => 0, 4 => 0];
        }

        $estadosParaGrafico = [1, 2, 3, 4];
        $percentageByState = [];
        foreach ($estadosParaGrafico as $estadoId) {
            $countForEstado = (clone $query)->where('estado_id', $estadoId)->count();
            $percentage = ($countForEstado / $totalRecordsCount) * 100;
            $percentageByState[$estadoId] = round($percentage, 2);
        }
        return $percentageByState;
    }

    public static function getEmailForData($datoId)
    {
        return self::query()
        ->where('datos.id', $datoId)
        ->join('institutos', 'datos.cue', '=', 'institutos.cue')
        ->value('institutos.email'); 
        /*return self::query()
            ->select([
                'institutos.email as instituto_email',
            ])
            ->where('datos.id', $datoId)
            ->join('institutos', 'datos.cue', '=', 'institutos.cue')
            ->first();*/
    }

    public static function changeEstado(int $datoId, int $newEstadoId, string $motivoRechazo = null, int $supervisorId = null ): bool
    {
        $dato = self::find($datoId); 
        if (!$dato) {
           // \Log::warning("Dato no encontrado: ID {$datoId}");
            return false;
        }
        $dato->estado_id = $newEstadoId;
        
        // Manejar fechas según el estado
        if ($newEstadoId == 3) { // APROBADO
            $dato->fecha_aprobacion = now();
            $dato->motivo_rechazo = '';
        } elseif ($newEstadoId == 4) { // RECHAZADO
            $dato->fecha_rechazo = now();
            $dato->fecha_aprobacion = null; // Limpiar fecha de aprobación si había sido aprobado antes
            if ($motivoRechazo) {
                $dato->motivo_rechazo = $motivoRechazo;
            }
        } else {
            $dato->motivo_rechazo = ''; 
        }
        
        $success = $dato->save();

        if ($success) {
            $dato->instituto->touch();
        }

        return $success;
    }
}
