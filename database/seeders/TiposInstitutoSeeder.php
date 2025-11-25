<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TiposInstitutoSeeder extends Seeder
{
    public function run()
    {
        // Verificar si ya existen registros antes de insertar
        if (DB::table('tipo_institutos')->count() > 0) {
            echo "Los tipos de instituto ya existen en la base de datos.\n";
            return;
        }

        DB::table('tipo_institutos')->insert([
           
            ['id' => 1, 'descripcion' => 'Institución de ETP', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'descripcion' => 'Otro Nivel y/o Modalidad', 'created_at' => now(), 'updated_at' => now()],
        ]);

        echo "Tipos de instituto creados correctamente.\n";
    }
}
