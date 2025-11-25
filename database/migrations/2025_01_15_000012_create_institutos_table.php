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
        Schema::create('institutos', function (Blueprint $table) {
            $table->string('cue', 9)->primary();
            $table->string('cue_editable', 9)->nullable()->index();
            $table->foreignId('tipo_instituto_id')->index();
            $table->string('nombre');
            $table->string('ambito_gestion', 1);
            $table->foreignId('localidad_id')->index();
            $table->foreignId('departamento_id')->index();
            $table->text('direccion')->nullable();
            $table->string('codigo_postal', 4)->nullable();
            $table->string('telefono', 15)->nullable();
            $table->string('email', 255)->nullable();
            $table->integer('anio_ingreso')->nullable();
            $table->integer('anio_egreso')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();

            $table->foreign('tipo_instituto_id')
                ->references('id')
                ->on('tipo_institutos')
                ->onDelete('cascade');

            $table->foreign('localidad_id')
                ->references('id')
                ->on('localidades')
                ->onDelete('cascade');

            $table->foreign('departamento_id')
                ->references('id')
                ->on('departamentos')
                ->onDelete('cascade');
        });

        DB::statement('UPDATE institutos SET cue_editable = cue');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('institutos', function (Blueprint $table) {
            $table->dropForeign(['tipo_instituto_id']);
            $table->dropForeign(['localidad_id']);
            $table->dropForeign(['departamento_id']);
        });

        Schema::dropIfExists('institutos');
    }
};
