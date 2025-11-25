<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Departamento extends Model {
    protected $table = 'departamentos';

    protected $fillable = [
        'descripcion',
    ];

    public function localidades() : HasMany {
        return $this->hasMany(Localidad::class, 'departamento_id');
    }

    public function provincia() : BelongsTo {
        return $this->belongsTo(Provincia::class, 'provincia_id');
    }

    public function institutos(): HasMany
    {
        return $this->hasMany(Instituto::class);
    }

    public static function getDepartamentos() {
        return self::all();
    }
}
