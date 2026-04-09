<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Primero creamos las provincias
        $this->call([
            ProvinciasTableSeeder::class,
        ]);

        // Luego los departamentos (dependen de las provincias)
        $this->call([
            DepartamentosTableSeeder::class,
        ]);

        // Luego las localidades (dependen de provincias y departamentos)
        $this->call([
            LocalidadesTableSeeder::class,
        ]);
        
        // Luego cargamos los datos de los institutos
       
        
        // Luego los usuarios (dependen de los roles que ya deben existir)
        $this->call([
            UsersTableSeeder::class,
        ]);
        
        // Se cargan los tipos de instituto para poder cargar los institutos correctamente
        $this->call([
            TiposInstitutoSeeder::class,
        ]);

        // Finalmente los institutos (dependen de localidades, departamentos, usuarios y tipos de instituto)
        $this->call([
            InstitutosTableSeeder::class,
        ]);

        // Dataset histórico usa anio=2024 en tabla datos; garantizar período para FK.
        DB::table('actualizaciones')->updateOrInsert(
            ['anio' => 2024],
            [
                'fecha_matriculados' => '2024-03-01',
                'fecha_1_egresados' => '2024-06-30',
                'fecha_2_egresados' => '2024-12-31',
                'fecha_tope' => '2024-12-31',
                'user_id' => 1,
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        $this->call([
            DatosTableSeeder::class,
        ]);
        
        // Cargar datos económicos
        $this->call([
            DatosEconomicosTableSeeder::class,
        ]);
        
        // Usuario de prueba (comentado por ahora)
        /*
        User::factory()->create([
            'name' => 'Administrador',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
        ]);
        */
    }
}
