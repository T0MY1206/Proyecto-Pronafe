<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cargos', function (Blueprint $table) {
            $table->id();
            $table->string('descripcion');
            $table->string('instituto_carrera', 1);
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });

        // Insertar cargos iniciales
        DB::table('cargos')->insert([
            // Cargos institucionales (I)
            ['descripcion' => 'Rector', 'instituto_carrera' => 'I', 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['descripcion' => 'Vicerrector', 'instituto_carrera' => 'I', 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['descripcion' => 'Secretario Académico', 'instituto_carrera' => 'I', 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['descripcion' => 'Secretario Administrativo', 'instituto_carrera' => 'I', 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['descripcion' => 'Director de Estudios', 'instituto_carrera' => 'I', 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['descripcion' => 'Coordinador General', 'instituto_carrera' => 'I', 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            
            // Cargos de carrera (C)
            ['descripcion' => 'Director de Carrera', 'instituto_carrera' => 'C', 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['descripcion' => 'Coordinador de Carrera', 'instituto_carrera' => 'C', 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['descripcion' => 'Jefe de Departamento', 'instituto_carrera' => 'C', 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['descripcion' => 'Coordinador Académico', 'instituto_carrera' => 'C', 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['descripcion' => 'Responsable de Prácticas', 'instituto_carrera' => 'C', 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['descripcion' => 'Coordinador de Campo', 'instituto_carrera' => 'C', 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cargos');
    }
};
