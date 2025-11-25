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
        Schema::create('autoridades', function (Blueprint $table) {
            $table->id();
            $table->integer('anio')->index();
            $table->string('cue', 9)->index();
            $table->string('nombre_apellido', 255);
            $table->foreignId('cargo_id')->index();
            $table->string('telefono', 15)->nullable();
            $table->string('email', 255)->nullable();
            $table->boolean('activo')->default(true);
            $table->foreignId('user_id')->index(); // Usuario que cre├│ o modific├│ el registro
            $table->unique(['cue', 'anio', 'cargo_id']);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('cargo_id')->references('id')->on('cargos')->onDelete('cascade');
            $table->foreign('cue')->references('cue')->on('institutos')->onDelete('cascade');
            $table->foreign('anio')->references('anio')->on('actualizaciones')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('autoridades', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['cargo_id']);
            $table->dropForeign(['cue']);
            $table->dropForeign(['anio']);
        });

        Schema::dropIfExists('autoridades');
    }
};