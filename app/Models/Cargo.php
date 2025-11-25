<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cargo extends Model
{
    protected $table = 'cargos';

    protected $fillable = [
        'descripcion',
        'instituto_carrera',
        'activo',
    ];

    public function autoridades(): HasMany
    {
        return $this->hasMany(Autoridad::class);
    }
}
