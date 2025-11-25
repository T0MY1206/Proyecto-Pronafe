<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProvinciasTableSeeder extends Seeder
{
    /**
     * Obtiene el ID de una provincia por su nombre
     */
    public static function getProvinciaId($nombre)
    {
        return DB::table('provincias')
            ->where('descripcion', $nombre)
            ->value('id');
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Verificar si ya existen provincias
        if (DB::table('provincias')->count() === 0) {
            $provincias = [
                ['descripcion' => 'Buenos Aires'],
                ['descripcion' => 'CABA'],
                ['descripcion' => 'Catamarca'],
                ['descripcion' => 'Chaco'],
                ['descripcion' => 'Chubut'],
                ['descripcion' => 'Córdoba'],
                ['descripcion' => 'Corrientes'],
                ['descripcion' => 'Entre Ríos'],
                ['descripcion' => 'Formosa'],
                ['descripcion' => 'Jujuy'],
                ['descripcion' => 'La Pampa'],
                ['descripcion' => 'La Rioja'],
                ['descripcion' => 'Mendoza'],
                ['descripcion' => 'Misiones'],
                ['descripcion' => 'Neuquén'],
                ['descripcion' => 'Rio Negro'],
                ['descripcion' => 'Salta'],
                ['descripcion' => 'San Juan'],
                ['descripcion' => 'San Luis'],
                ['descripcion' => 'Santa Cruz'],
                ['descripcion' => 'Santa Fe'],
                ['descripcion' => 'Santiago del Estero'],
                ['descripcion' => 'Tierra del Fuego'],
                ['descripcion' => 'Tucumán']
            ];

            DB::table('provincias')->insert($provincias);
        }
    }
}
