<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Localidad extends Model
{
    public $timestamps = false;
    protected $table = 'localidades';
    protected $fillable = [
        'descripcion',
        'provincia_id',
        'departamento_id',
    ];
    public function provincia(): BelongsTo
    {
        return $this->belongsTo(Provincia::class);
    }

    public function departamento(): BelongsTo
    {
        return $this->belongsTo(Departamento::class);
    }

    public function institutos(): HasMany
    {
        return $this->hasMany(Instituto::class);
    }

    public static function getLocalidades(){
        return self::all();
    }
}
