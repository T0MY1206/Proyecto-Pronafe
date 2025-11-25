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
        Schema::create('tipo_institutos', function (Blueprint $table) {
            $table->id();
            $table->string('descripcion');
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });

        // Insertar tipos de instituto iniciales
        DB::table('tipo_institutos')->insert([
            ['descripcion' => 'Estatal', 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['descripcion' => 'Institución de ETP', 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
            ['descripcion' => 'Otro Nivel y/o Modalidad', 'activo' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tipo_institutos');
    }
};
