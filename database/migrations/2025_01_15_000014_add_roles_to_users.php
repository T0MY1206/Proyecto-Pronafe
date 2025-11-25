<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function(Blueprint $table) {
            $table->foreignId('rol_id')->index();
            $table->string('cue_instituto', 9)->nullable()->index();
            $table->string('password_generica')->nullable();
            $table->boolean('password_cambiada')->default(false);
            $table->timestamp('password_generica_enviada')->nullable();
            $table->foreign('rol_id')->references('id')->on('roles');
            $table->foreign('cue_instituto')->references('cue')->on('institutos')->onDelete('set null');
        });

        // Insertar usuarios iniciales
        DB::table('users')->insert([
            [
                'name' => 'Admin',
                'email' => 'admin@correo.com',
                'email_verified_at' => now(),
                'password' => Hash::make('admin123'),
                'rol_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Supervisor',
                'email' => 'supervisor@correo.com',
                'email_verified_at' => now(),
                'password' => Hash::make('supervisor123'),
                'rol_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Instituto',
                'email' => 'instituto@correo.com',
                'email_verified_at' => now(),
                'password' => Hash::make('instituto123'),
                'rol_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function(Blueprint $table) {
            $table->dropForeign(['rol_id']);
            $table->dropForeign(['cue_instituto']);
            $table->dropColumn(['rol_id', 'cue_instituto', 'password_generica', 'password_cambiada', 'password_generica_enviada']);
        });
    }
};
