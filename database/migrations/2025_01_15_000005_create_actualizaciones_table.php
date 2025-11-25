<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('actualizaciones', function (Blueprint $table) {
            $table->integer('anio')->primary();
            $table->date('fecha_matriculados');
            $table->date('fecha_1_egresados');
            $table->date('fecha_2_egresados');
            $table->date('fecha_tope');
            $table->foreignId('user_id')->index();
            $table->boolean('activo')->default(true);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('actualizaciones');
    }
};
