<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

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
