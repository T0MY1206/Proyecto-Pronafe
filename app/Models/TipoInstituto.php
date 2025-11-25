<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TipoInstituto extends Model
{
    protected $table = 'tipo_institutos';

    protected $fillable = [
        'descripcion',
        'activo'
    ];
    public function institutos(): HasMany
    {
        return $this->hasMany(Instituto::class);
    }

    public static function getAll(){
        return self::all();
    }
}
