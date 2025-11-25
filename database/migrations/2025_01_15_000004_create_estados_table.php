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
        Schema::create('estados', function (Blueprint $table) {
            $table->id();
            $table->string('descripcion');
            $table->timestamps();
        });

        // Insertar estados iniciales
        DB::table('estados')->insert([
            ['descripcion' => 'Pendiente', 'created_at' => now(), 'updated_at' => now()],
            ['descripcion' => 'Enviado', 'created_at' => now(), 'updated_at' => now()],
            ['descripcion' => 'Aprobado', 'created_at' => now(), 'updated_at' => now()],
            ['descripcion' => 'Rechazado', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('estados');
    }
};
