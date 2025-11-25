<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Autoridad extends Model
{
    protected $table = 'autoridades';

    protected $fillable = [
        'anio',
        'cue',
        'nombre_apellido',
        'cargo_id',
        'telefono',
        'email',
        'user_id',
        'activo',
    ];

    public function instituto(): BelongsTo
    {
        return $this->belongsTo(Instituto::class, 'cue', 'cue');
    }

    public function cargo(): BelongsTo
    {
        return $this->belongsTo(Cargo::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function actualizacion(): BelongsTo
    {
        return $this->belongsTo(Actualizacion::class, 'anio', 'anio');
    }
}
