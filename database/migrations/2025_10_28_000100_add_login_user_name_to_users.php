<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Solo crear la columna si no existe
        if (!Schema::hasColumn('users', 'login_user_name')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('login_user_name')->nullable()->after('email');
            });
        }

        // Backfill: si existe email, usar la parte previa a '@' como login; si no, usar el id
        $users = DB::table('users')->select('id', 'email')->get();
        foreach ($users as $user) {
            $base = $user->email ? explode('@', $user->email)[0] : 'user_'.$user->id;
            $candidate = $base;
            $suffix = 1;
            while (DB::table('users')->where('login_user_name', $candidate)->exists()) {
                $candidate = $base.'_'.$suffix++;
            }
            DB::table('users')->where('id', $user->id)->update(['login_user_name' => $candidate]);
        }

        // Ahora hacer la columna única después del backfill
        Schema::table('users', function (Blueprint $table) {
            $table->string('login_user_name')->unique()->change();
        });

        // Insertar datos básicos necesarios si no existen
        if (DB::table('provincias')->count() == 0) {
            DB::table('provincias')->insert([
                'id' => 1,
                'descripcion' => 'Provincia General',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        
        if (DB::table('departamentos')->count() == 0) {
            DB::table('departamentos')->insert([
                'id' => 1,
                'descripcion' => 'Departamento General',
                'provincia_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
        
        if (DB::table('localidades')->count() == 0) {
            DB::table('localidades')->insert([
                'id' => 1,
                'descripcion' => 'Localidad General',
                'provincia_id' => 1,
                'departamento_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Insertar instituto con email tomas2000tutor@gmail.com
        DB::table('institutos')->insert([
            'cue' => '12345678',
            'tipo_instituto_id' => 1, // Estatal
            'nombre' => 'Instituto Tomás Tutor',
            'ambito_gestion' => 'P', // Público
            'localidad_id' => 1,
            'departamento_id' => 1,
            'direccion' => 'Dirección del Instituto',
            'codigo_postal' => '1234',
            'telefono' => '1234567890',
            'email' => 'tomas2000tutor@gmail.com',
            'anio_ingreso' => 2025,
            'anio_egreso' => null,
            'activo' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Eliminar el instituto insertado
        DB::table('institutos')->where('email', 'tomas2000tutor@gmail.com')->delete();
        
        // Eliminar datos básicos insertados
        DB::table('localidades')->where('id', 1)->delete();
        DB::table('departamentos')->where('id', 1)->delete();
        DB::table('provincias')->where('id', 1)->delete();
        
        // Eliminar la columna login_user_name
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['login_user_name']);
            $table->dropColumn('login_user_name');
        });
    }
};


