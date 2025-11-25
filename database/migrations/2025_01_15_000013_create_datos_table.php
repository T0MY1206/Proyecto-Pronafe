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
        Schema::create('datos', function (Blueprint $table) {
            $table->id();
            $table->integer('anio')->index();
            $table->string('cue', 9)->index();
            $table->integer('cantidad_docentes_carrera')->nullable();
            $table->integer('cantidad_docentes_practica')->nullable();
            $table->integer('cantidad_anio_1')->nullable();
            $table->integer('cantidad_anio_2')->nullable();
            $table->integer('cantidad_anio_3')->nullable();
            $table->integer('cantidad_egresados')->nullable();
            $table->decimal('monto_anual', 18, 2)->nullable();
            $table->decimal('monto_mensual', 18, 2)->nullable();
            $table->decimal('monto_extracurricular', 18, 2)->nullable();
            $table->integer('cantidad_cuota')->nullable();
            $table->text('observaciones')->nullable();
            $table->foreignId('estado_id')->index();
            $table->text('motivo_rechazo')->nullable();
            $table->foreignId('user_id')->index();
            $table->foreignId('supervisor_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('fecha_envio')->nullable();
            $table->timestamp('fecha_aprobacion')->nullable();
            $table->timestamp('fecha_rechazo')->nullable();
            $table->timestamps();

            $table->foreign('cue')->references('cue')->on('institutos')->onDelete('cascade');
            $table->foreign('anio')->references('anio')->on('actualizaciones')->onDelete('cascade');
            $table->foreign('estado_id')->references('id')->on('estados')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('datos');
    }
};
