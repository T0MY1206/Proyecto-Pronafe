<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Actualizacion extends Model
{
    protected $table = 'actualizaciones';

    protected $fillable = [
        'anio',
        'fecha_matriculados',
        'fecha_1_egresados',
        'fecha_2_egresados',
        'fecha_tope',
        'user_id',
        'activo'
    ];


    protected $attributes = [
        'activo' => true,
    ];

    protected $primaryKey = 'anio';
    public $incrementing = false;
    protected $keyType = 'int';
    protected function casts(): array
    {
        return [
            'fecha_matriculados' => 'date',
            'fecha_1_egresados' => 'date',
            'fecha_2_egresados' => 'date',
            'fecha_tope' => 'date'
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function autoridades(): HasMany
    {
        return $this->hasMany(Autoridad::class, 'anio', 'anio');
    }

    public function datos()
    {
        return $this->hasMany(Dato::class, 'anio');
    }

    public static function getActualizacionesFiltered($filters = [], $order = 'anio', $direction = 'asc')
    {
        $query = self::query()
            ->select(
                'actualizaciones.anio',
                'actualizaciones.fecha_matriculados',
                'actualizaciones.fecha_1_egresados',
                'actualizaciones.fecha_2_egresados',
                'actualizaciones.fecha_tope',
                'actualizaciones.user_id',
                'actualizaciones.activo',
                'actualizaciones.created_at',
                'actualizaciones.updated_at'
            )
            ->with('user');

        // 🛑 FILTROS: Solo aplicamos los que existen en esta tabla (anio, search)
        if (!empty($filters['anio'])) {
            $query->where('actualizaciones.anio', $filters['anio']);
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('actualizaciones.anio', 'like', "%{$search}%")
                ->orWhere('actualizaciones.fecha_matriculados', 'like', "%{$search}%")
                ->orWhere('actualizaciones.fecha_tope', 'like', "%{$search}%");
            });
        }

        // 🔹 Lista blanca de columnas ordenables (con prefijos)
        $allowedOrders = [
            'anio'                => 'actualizaciones.anio',
            'fecha_matriculados'  => 'actualizaciones.fecha_matriculados',
            // ... (resto de campos con prefijo 'actualizaciones.')
        ];

        // 🟢 APLICAR ORDEN: Fuerza la ordenación numérica para 'anio'.
        if (isset($allowedOrders[$order])) {
            if ($order === 'anio') {
                // ✅ Usamos orderByRaw con prefijo para garantizar orden numérico
                $query->orderByRaw("CAST(actualizaciones.anio AS UNSIGNED) {$direction}");
            } else {
                $query->orderBy($allowedOrders[$order], $direction);
            }
        } else {
            $query->orderBy('actualizaciones.anio', 'asc');
        }

        return $query;
    }

    public static function delAnioActual()
    {
        $anioActual = now()->year;

        return self::where('anio', $anioActual)->first();
    }

    
    public static function TodosLosAnios()
    {
        return self::select('anio')
            ->distinct()
            ->orderBy('anio', 'desc')
            ->get()
            ->map(function ($item) {
                return ['value' => (string)$item->anio, 'label' => (string)$item->anio];
            })
            ->toArray(); 
    }
    
    public static function fechasAnioSeleccionado($anio)
    {
        return self::query()
            ->select(
                'anio',
                'fecha_matriculados',
                'fecha_1_egresados',
                'fecha_2_egresados',
            )
            ->where('anio', $anio)
            ->first(); 
    }
}
