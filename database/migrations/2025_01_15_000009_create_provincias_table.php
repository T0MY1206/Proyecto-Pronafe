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
        Schema::create('provincias', function (Blueprint $table) {
            $table->id();
            $table->string('descripcion');
            $table->timestamps();
        });

        // Agregar foreign key a users ahora que existe la tabla provincias
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('provincia_id')->nullable()->index();
            $table->foreign('provincia_id')
                ->references('id')
                ->on('provincias')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Primero eliminar la clave foránea y la columna de users
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['provincia_id']);
            $table->dropColumn('provincia_id');
        });
        
        // Luego eliminar la tabla provincias
        Schema::dropIfExists('provincias');
    }
};
