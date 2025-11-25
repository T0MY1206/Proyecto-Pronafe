<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Provincia extends Model
{
    protected $table = 'provincias';
    protected $fillable = [
        'descripcion',
    ];
    public function departamentos(): HasMany
    {
        return $this->hasMany(Departamento::class);
    }

    public function localidades(): HasMany
    {
        return $this->hasMany(Localidad::class);
    }

    public function institutos(): HasMany
    {
        return $this->hasMany(Instituto::class);
    }

    public static function getProvincias(){
        return self::all();
    }
}
