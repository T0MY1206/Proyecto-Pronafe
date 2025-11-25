<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Rol;
use App\Models\Instituto;
use App\Models\Dato;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'login_user_name',
        'password',
        'rol_id',
        'provincia_id',
        'password_generica',
        'password_cambiada',
        'password_generica_enviada',
        'cue_instituto'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'password_cambiada' => 'boolean',
            'password_generica_enviada' => 'datetime',
        ];
    }

    public function rol()
    {
        return $this->belongsTo(Rol::class, 'rol_id');
    }

    public function actualizacions()
    {
        return $this->hasMany(Actualizacion::class, 'user_id', 'id');
    }

    public function data()
    {
        return $this->hasMany(Dato::class, 'user_id', 'id');
    }

    public function autoridades()
    {
        return $this->hasMany(Autoridad::class, 'user_id', 'id');
    }

    public function institutos()
    {
        return $this->hasMany(Instituto::class, 'user_id', 'id');
    }

    public function instituto()
    {
        return $this->hasOne(Instituto::class, 'user_id', 'id');
    }

    public function datos()
    {
        return $this->hasMany(Dato::class, 'user_id', 'id');
    }

    public function datosSupervisados()
    {
        return $this->hasMany(Dato::class, 'supervisor_id', 'id');
    }

    public static function getUsers($options, $rolId) {
        $query = self::query()
                ->with(['rol'])
                ->where('rol_id', '=', $rolId);

        if(isset($options['search'])) {
            $query->where(function($q) use ($options) {
                $q->where('name', 'like', '%' . $options['search'] . '%')
                    ->orWhere('email', 'like', '%' . $options['search'] . '%');
            });
        }

        if (!empty($options['order'])) {
            $query->orderBy($options['order'], $options['direction'] ?? 'asc');
        }

        return $query;
    }

    public static function getAllUsers($options)
    {
        $query = self::query()
            ->with(['rol']);

        if (isset($options['search'])) {
            $query->where(function ($q) use ($options) {
                $q->where('name', 'like', '%' . $options['search'] . '%')
                    ->orWhere('email', 'like', '%' . $options['search'] . '%');
            });
        }

        if (!empty($options['order'])) {
            $query->orderBy($options['order'], $options['direction'] ?? 'asc');
        } else {
            // Ordenar por rol y luego por nombre por defecto
            $query->orderBy('rol_id', 'asc')->orderBy('name', 'asc');
        }

        return $query;
    }

    public static function getUser($id)
    {
        return self::query()
            ->with(['rol'])
            ->where('id', '=', $id)
            ->firstOrFail();
    }
}
