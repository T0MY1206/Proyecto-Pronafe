<?php

namespace Tests\Support;

use App\Constants\Rol;
use App\Models\Actualizacion;
use App\Models\Dato;
use App\Models\Instituto;
use App\Models\Provincia;
use App\Models\TipoInstituto;
use App\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * Usuarios y datos mínimos para pruebas Feature/Unit (RefreshDatabase).
 */
final class UserTestHelpers
{
    public static function adminUser(): User
    {
        return User::factory()->create(['rol_id' => Rol::ADMINISTRADOR]);
    }

    public static function supervisorUser(): User
    {
        return User::factory()->create(['rol_id' => Rol::SUPERVISOR_PROVINCIAL]);
    }

    /**
     * Usuario instituto con CUE e instituto existente (requisito del middleware CheckRol).
     *
     * @return array{user: User, instituto: Instituto, provincia: Provincia}
     */
    public static function institutoUserWithInstituto(?string $cue = null): array
    {
        $cue = $cue ?? '900000001';

        $provincia = Provincia::query()->create(['descripcion' => 'Provincia test']);

        $deptoId = DB::table('departamentos')->insertGetId([
            'descripcion' => 'Depto test',
            'provincia_id' => $provincia->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $localidadId = DB::table('localidades')->insertGetId([
            'descripcion' => 'Localidad test',
            'provincia_id' => $provincia->id,
            'departamento_id' => $deptoId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $tipo = TipoInstituto::query()->create([
            'descripcion' => 'Tipo test',
            'activo' => true,
        ]);

        $instituto = Instituto::query()->create([
            'cue' => $cue,
            'cue_editable' => $cue,
            'tipo_instituto_id' => $tipo->id,
            'nombre' => 'Instituto test',
            'ambito_gestion' => 'E',
            'localidad_id' => $localidadId,
            'departamento_id' => $deptoId,
        ]);

        $user = User::factory()->create([
            'rol_id' => Rol::INSTITUTO,
            'cue_instituto' => $cue,
        ]);

        return ['user' => $user, 'instituto' => $instituto, 'provincia' => $provincia];
    }

    /**
     * Actualización de año y dato asociado (para flujos supervisor/API).
     *
     * @return array{dato: Dato, institutoUser: User, supervisor: User, admin: User}
     */
    public static function createDatoForSupervisorFlow(int $anio = 2025): array
    {
        $admin = self::adminUser();
        $supervisor = self::supervisorUser();
        ['user' => $institutoUser, 'instituto' => $instituto] = self::institutoUserWithInstituto();

        Actualizacion::query()->create([
            'anio' => $anio,
            'fecha_matriculados' => now()->toDateString(),
            'fecha_1_egresados' => now()->toDateString(),
            'fecha_2_egresados' => now()->toDateString(),
            'fecha_tope' => now()->addMonth()->toDateString(),
            'user_id' => $admin->id,
        ]);

        $dato = Dato::query()->create([
            'anio' => $anio,
            'cue' => $instituto->cue,
            'estado_id' => 2,
            'user_id' => $institutoUser->id,
            'observaciones' => 'Test',
        ]);

        return [
            'dato' => $dato,
            'institutoUser' => $institutoUser,
            'supervisor' => $supervisor,
            'admin' => $admin,
        ];
    }
}
