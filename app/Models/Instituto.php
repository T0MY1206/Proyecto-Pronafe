<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class Instituto extends Model
{
    protected $table = 'institutos';
    protected $primaryKey = 'cue';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'cue',
        'cue_editable',
        'tipo_instituto_id',
        'nombre',
        'ambito_gestion',
        'localidad_id',
        'departamento_id',
        'direccion',
        'codigo_postal',
        'telefono',
        'email',
        'anio_ingreso',
        'anio_egreso',
        'activo',
        'user_id'
    ];
    public function tipoInstituto(): BelongsTo
    {
        return $this->belongsTo(TipoInstituto::class, 'tipo_instituto_id');
    }

    public function localidad(): BelongsTo
    {
        return $this->belongsTo(Localidad::class);
    }

    public function departamento(): BelongsTo
    {
        return $this->belongsTo(Departamento::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'cue', 'cue_instituto');
    }

    public function autoridades(): HasMany
    {
        return $this->hasMany(Autoridad::class, 'cue', 'cue');
    }

    public function datos(): HasMany
    {
        return $this->hasMany(Dato::class, 'cue', 'cue');
    }

    public function datosPorAnio($anio)
    {
        return $this->datos()->where('anio', $anio)->first();
    }

    public function traerEstadoDatos($anio): ?int{
        $datos = $this->datos()->where('anio', $anio)->first();

        if ($datos){
            return $datos->estado_id;
        }
        else{
            return null;
        }
    }

    public static function getInstitutosWithDescripcion($filters = [], $order = 'cue', $direction = 'asc')
    {
        $query = self::with(['tipoInstituto', 'localidad', 'departamento', 'localidad.provincia'])
            ->select(
                'institutos.cue',
                'institutos.cue_editable',
                'institutos.tipo_instituto_id',
                'institutos.nombre',
                'institutos.ambito_gestion',
                'institutos.localidad_id',
                'institutos.departamento_id',
                'institutos.direccion',
                'institutos.codigo_postal',
                'institutos.telefono',
                'institutos.email',
                'institutos.anio_ingreso',
                'institutos.anio_egreso',
                'institutos.activo',
                'institutos.created_at',
                'institutos.updated_at',
                'tipo_institutos.descripcion as tipo_instituto_descripcion',
                'localidades.descripcion as localidad_descripcion',
                'departamentos.descripcion as departamento_descripcion'
            )
            ->join('tipo_institutos', 'institutos.tipo_instituto_id', '=', 'tipo_institutos.id')
            ->join('localidades', 'institutos.localidad_id', '=', 'localidades.id')
            ->join('departamentos', 'institutos.departamento_id', '=', 'departamentos.id')
            ->where('institutos.activo', 1);

        // Filtros dinámicos
        if (!empty($filters['tipo_instituto_id'])) {
            $query->where('institutos.tipo_instituto_id', $filters['tipo_instituto_id']);
        }
        if (!empty($filters['ambito_gestion'])) {
            $query->where('institutos.ambito_gestion', $filters['ambito_gestion']);
        }
        if (!empty($filters['provincia_id'])) {
            $query->where('localidades.provincia_id', $filters['provincia_id']);
        }
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function($q) use ($search) {
                $q->where('institutos.nombre', 'like', "%$search%")
                  ->orWhere('institutos.cue_editable', 'like', "%$search%");
            });
        }
        
        // Lista blanca de columnas ordenables
        $allowedOrders = [
            'cue_editable' => 'institutos.cue_editable',
            'nombre' => 'institutos.nombre',
            'tipo_instituto_descripcion' => 'tipo_institutos.descripcion',
            'localidad_descripcion' => 'localidades.descripcion',
            'departamento_descripcion' => 'departamentos.descripcion',
            'direccion' => 'institutos.direccion',
            'telefono' => 'institutos.telefono',
            'email' => 'institutos.email',
            'ambito_gestion' => 'institutos.ambito_gestion'
        ];

        if (isset($allowedOrders[$order])) {
            $query->orderBy($allowedOrders[$order], $direction);
        } else {
            $query->orderBy('institutos.cue', 'asc');
        }
        
        return $query;
    }
}
