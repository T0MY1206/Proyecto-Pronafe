<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Estado extends Model
{
    protected $table = 'estados';

    protected $fillable = [
        'descripcion',
    ];
    public function datos(): HasMany
    {
        return $this->hasMany(Dato::class);
    }
}
