<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LocalidadesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Primero obtenemos los IDs de provincias y departamentos
        $provincias = DB::table('provincias')->pluck('id', 'descripcion');
        $departamentos = [];

        // Obtenemos todos los departamentos con su provincia
        $deptos = DB::table('departamentos')
            ->join('provincias', 'departamentos.provincia_id', '=', 'provincias.id')
            ->select('departamentos.id', 'departamentos.descripcion', 'provincias.descripcion as provincia')
            ->get();

        foreach ($deptos as $depto) {
            $key = $depto->provincia . '|' . $depto->descripcion;
            $departamentos[$key] = $depto->id;
        }

        $localidades = [];

        // Función auxiliar para agregar localidades
        $agregarLocalidad = function ($provincia, $depto, $nombre) use (&$localidades, $provincias, $departamentos) {
            $key = $provincia . '|' . $depto;
            if (isset($departamentos[$key])) {
                $localidades[] = [
                    'descripcion' => $nombre,
                    'provincia_id' => $provincias[$provincia],
                    'departamento_id' => $departamentos[$key],
                    'created_at' => now(),
                    'updated_at' => now()
                ];
            } else {
                echo "No se encontró el departamento: $depto en la provincia: $provincia\n";
            }
        };

        // Buenos Aires
        $agregarLocalidad('Buenos Aires', 'Loberia', 'Loberia');
        $agregarLocalidad('Buenos Aires', 'Hurlingham', 'Hurlingham');
        $agregarLocalidad('Buenos Aires', 'General Pueyrredon', 'Mar del Plata');
        $agregarLocalidad('Buenos Aires', 'General Pinto', 'General Pinto');
        $agregarLocalidad('Buenos Aires', 'Punta Indio', 'Veronica');
        $agregarLocalidad('Buenos Aires', 'Bragado', 'Bragado');
        $agregarLocalidad('Buenos Aires', 'San Nicolas', 'San Nicolás de los Arroyos');
        $agregarLocalidad('Buenos Aires', 'Carlos Casares', 'Carlos Casares');
        $agregarLocalidad('Buenos Aires', 'Lomas de Zamora', 'Lomas de Zamora');
        $agregarLocalidad('Buenos Aires', 'General Viamonte', 'Los Toldos');
        $agregarLocalidad('Buenos Aires', 'General Rodriguez', 'General Rodriguez');
        $agregarLocalidad('Buenos Aires', 'Gral. Juan Madariaga', 'Gral Madariaga');
        $agregarLocalidad('Buenos Aires', 'San Vicente', 'Alejandro Korn');
        $agregarLocalidad('Buenos Aires', 'General Las Heras', 'Gral. Las Heras');
        $agregarLocalidad('Buenos Aires', 'San Pedro', 'San Pedro');
        $agregarLocalidad('Buenos Aires', 'Chascomús', 'Chascomús');
        $agregarLocalidad('Buenos Aires', 'Coronel Suarez', 'Coronel Suárez');
        $agregarLocalidad('Buenos Aires', 'Zárate', 'Zárate');
        $agregarLocalidad('Buenos Aires', 'Morón', 'Morón');
        $agregarLocalidad('Buenos Aires', 'La Plata', 'La Plata');
        $agregarLocalidad('Buenos Aires', 'San Fernando', 'San Fernando');
        $agregarLocalidad('Buenos Aires', 'Adolfo Gonzales Chaves', 'Adolfo G. Chaves');
        $agregarLocalidad('Buenos Aires', 'Puan', 'Darregueira');
        $agregarLocalidad('Buenos Aires', 'Carlos Tejedor', 'Carlos Tejedor');
        $agregarLocalidad('Buenos Aires', 'Coronel Pringles', 'Coronel Pringles');
        $agregarLocalidad('Buenos Aires', 'Tapalqué', 'Tapalqué');
        $agregarLocalidad('Buenos Aires', 'La Costa', 'Mar de Ajó');
        $agregarLocalidad('Buenos Aires', 'Salto', 'Salto');
        $agregarLocalidad('Buenos Aires', 'Dolores', 'Dolores');
        $agregarLocalidad('Buenos Aires', 'Brandsen', 'Brandsen');
        $agregarLocalidad('Buenos Aires', 'Capitán Sarmiento', 'Capitán Sarmiento');
        $agregarLocalidad('Buenos Aires', 'Mar Chiquita', 'Coronel Vidal');
        $agregarLocalidad('Buenos Aires', 'Chacabuco', 'Chacabuco');
        $agregarLocalidad('Buenos Aires', 'La Matanza', 'Gregorio De La Ferrere');
        $agregarLocalidad('Buenos Aires', 'Almirante Brown', 'Resplandor');
        $agregarLocalidad('Buenos Aires', 'Almirante Brown', 'Glew');
        $agregarLocalidad('Buenos Aires', 'Rauch', 'Rauch');
        $agregarLocalidad('Buenos Aires', 'Tres de Febrero', 'Santos Lugares');
        $agregarLocalidad('Buenos Aires', 'Luján', 'Lujan');
        $agregarLocalidad('Buenos Aires', 'Gral. Lamadrid', 'General La Madrid');
        $agregarLocalidad('Buenos Aires', 'San Miguel', 'San Miguel');
        $agregarLocalidad('Buenos Aires', 'Ayacucho', 'Ayacucho');
        $agregarLocalidad('Buenos Aires', 'Colón', 'Colón');
        $agregarLocalidad('Buenos Aires', 'Coronel Dorrego', 'Coronel Dorrego');
        $agregarLocalidad('Buenos Aires', 'Trenque Lauquen', 'Trenque Lauquen');
        $agregarLocalidad('Buenos Aires', 'Pilar', 'Pilar');
        $agregarLocalidad('Buenos Aires', 'Guamini', 'Guamini');
        $agregarLocalidad('Buenos Aires', 'Rojas', 'Rojas');
        $agregarLocalidad('Buenos Aires', 'Lanús', 'Lanús Este');
        $agregarLocalidad('Buenos Aires', 'Tornquist', 'Tornquist');
        $agregarLocalidad('Buenos Aires', 'San Cayetano', 'San Cayetano');
        $agregarLocalidad('Buenos Aires', 'San Isidro', 'San Isidro');
        $agregarLocalidad('Buenos Aires', 'Moreno', 'Moreno');
        $agregarLocalidad('Buenos Aires', 'Baradero', 'Baradero');
        $agregarLocalidad('Buenos Aires', 'Vicente López', 'Florida');
        $agregarLocalidad('Buenos Aires', 'Salliquelo', 'Salliqueló');
        $agregarLocalidad('Buenos Aires', 'Las Flores', 'Las Flores');
        $agregarLocalidad('Buenos Aires', 'Almirante Brown', 'Adrogué');
        $agregarLocalidad('Buenos Aires', 'Tandil', 'Tandil');
        $agregarLocalidad('Buenos Aires', 'General Alvarado', 'Miramar');
        $agregarLocalidad('Buenos Aires', 'Bahía Blanca', 'Bahía Blanca');
        $agregarLocalidad('Buenos Aires', 'La Matanza', 'Isidro Casanova');
        $agregarLocalidad('Buenos Aires', 'La Matanza', 'González Catán');
        $agregarLocalidad('Buenos Aires', 'Lanús', 'Lanus Oeste');
        // $agregarLocalidad('Buenos Aires', 'General San Martín', 'San Martín');  // Comentado hasta confirmar el departamento correcto
        $agregarLocalidad('Buenos Aires', 'Tres de Febrero', 'Loma Hermosa');
        $agregarLocalidad('Buenos Aires', 'Campana', 'Campana');
        $agregarLocalidad('Buenos Aires', 'Villa Gesell', 'Villa Gesell');
        $agregarLocalidad('Buenos Aires', 'Florentino Ameghino', 'Ameghino');
        $agregarLocalidad('Buenos Aires', 'Leandro N. Alem', 'Vedia');
        $agregarLocalidad('Buenos Aires', 'Lezama', 'Lezama');
        $agregarLocalidad('Buenos Aires', 'Presidente Péron', 'Guernica');
        $agregarLocalidad('Buenos Aires', 'Roque Pérez', 'Roque Perez');
        $agregarLocalidad('Buenos Aires', 'Ramallo', 'Villa Ramallo');
        $agregarLocalidad('Buenos Aires', 'Tres Lomas', 'Tres Lomas');
        $agregarLocalidad('Buenos Aires', 'La Paz', 'Recreación');
        $agregarLocalidad('Buenos Aires', 'La Paz', 'Recreo');
        $agregarLocalidad('Buenos Aires', 'Punta Indio', 'Veronica');
        $agregarLocalidad('Buenos Aires', 'Bragado', 'Bragado');
        $agregarLocalidad('Buenos Aires', 'San Nicolas', 'San Nicolás de los Arroyos');
        $agregarLocalidad('Buenos Aires', 'Carlos Casares', 'Carlos Casares');
        $agregarLocalidad('Buenos Aires', 'Lomas de Zamora', 'Lomas de Zamora');
        $agregarLocalidad('Buenos Aires', 'General Viamonte', 'Los Toldos');
        $agregarLocalidad('Buenos Aires', 'General Rodriguez', 'General Rodriguez');
        $agregarLocalidad('Buenos Aires', 'Gral. Juan Madariaga', 'Gral Madariaga');
        $agregarLocalidad('Buenos Aires', 'San Vicente', 'Alejandro Korn');
        $agregarLocalidad('Buenos Aires', 'General Las Heras', 'Gral. Las Heras');
        $agregarLocalidad('Buenos Aires', 'San Pedro', 'San Pedro');
        $agregarLocalidad('Buenos Aires', 'Chascomús', 'Chascomús');
        $agregarLocalidad('Buenos Aires', 'Coronel Suarez', 'Coronel Suárez');
        $agregarLocalidad('Buenos Aires', 'Zárate', 'Zárate');
        $agregarLocalidad('Buenos Aires', 'Morón', 'Morón');
        $agregarLocalidad('Buenos Aires', 'La Plata', 'La Plata');
        $agregarLocalidad('Buenos Aires', 'Capitán Sarmiento', 'Capitán Sarmiento');
        $agregarLocalidad('Buenos Aires', 'Avellaneda', 'Avellaneda');
        $agregarLocalidad('Buenos Aires', 'San Nicolás de los Arroyos', 'San Nicolás de los Arroyos');
        $agregarLocalidad('Buenos Aires', 'Gral. Juan Madariaga', 'Gral. Madariaga');
        $agregarLocalidad('Buenos Aires', 'San Nicolás de los Arroyos', 'San Nicolás de los Arroyos');
        $agregarLocalidad('Buenos Aires', 'General Alvarado', 'Miramar');

        // CABA
        $agregarLocalidad('CABA', 'CABA', 'CABA');

        // Catamarca
        $agregarLocalidad('Catamarca', 'La Paz', 'Recreo');
        $agregarLocalidad('Catamarca', 'Andalgalá', 'Andalgala');
        $agregarLocalidad('Catamarca', 'Belén', 'Belén');
        $agregarLocalidad('Catamarca', 'Capayán', 'Chumbicha');
        $agregarLocalidad('Catamarca', 'Capayán', 'Huillapima');
        $agregarLocalidad('Catamarca', 'Capayán', 'Miraflores');
        $agregarLocalidad('Catamarca', 'Pomán', 'Saujil');
        $agregarLocalidad('Catamarca', 'Valle Viejo', 'San Isidro');

        // Córdoba
        $agregarLocalidad('Córdoba', 'Colón', 'Juárez Celman');
        $agregarLocalidad('Córdoba', 'San Justo', 'MONTE BUEY');
        $agregarLocalidad('Córdoba', 'San Justo', 'Las Varillas');
        $agregarLocalidad('Córdoba', 'Río Primero', 'Villa Santa Rosa');
        $agregarLocalidad('Córdoba', 'Río II', 'Pozo del Molle');
        $agregarLocalidad('Córdoba', 'Juárez Celman', 'Ucacha');
        $agregarLocalidad('Córdoba', 'San Justo', 'San Francisco');
        $agregarLocalidad('Córdoba', 'Colón', 'Jesús María');
        $agregarLocalidad('Córdoba', 'Tercero Arriba', 'Oliva');
        $agregarLocalidad('Córdoba', 'Cruz del Eje', 'Cruz del eje');
        $agregarLocalidad('Córdoba', 'Marcos Juarez', 'Bell Ville');
        $agregarLocalidad('Córdoba', 'Sobremonte', 'San Francisco del Chañar');
        $agregarLocalidad('Córdoba', 'General San Martín', 'Villa Maria');
        $agregarLocalidad('Córdoba', 'Punilla', 'Villa Carlos Paz');
        $agregarLocalidad('Córdoba', 'Unión', 'Bell Ville');
        $agregarLocalidad('Córdoba', 'Rio Primero', 'Rio Primero');
        $agregarLocalidad('Córdoba', 'Río II', 'Villa del Rosario');
        $agregarLocalidad('Córdoba', 'Juárez Celman', 'La Carlota');
        $agregarLocalidad('Córdoba', 'Cruz del Eje', 'Cruz del Eje');
        $agregarLocalidad('Córdoba', 'Capital', 'Córdoba');
        $agregarLocalidad('Córdoba', 'San Javier', 'Villa Dolores');
        $agregarLocalidad('Córdoba', 'Rio Cuarto', 'Rio Cuarto');
        $agregarLocalidad('Córdoba', 'Rio Segundo', 'Villa del Rosario');
        $agregarLocalidad('Córdoba', 'Colón', 'Jesús María');
        $agregarLocalidad('Córdoba', 'Tercero Arriba', 'Villa María');
        $agregarLocalidad('Córdoba', 'Marcos Juarez', 'Marcos Juárez');
        $agregarLocalidad('Córdoba', 'Ischilín', 'Deán Funes');
        $agregarLocalidad('Córdoba', 'Calamuchita', 'Villa General Belgrano');
        $agregarLocalidad('Córdoba', 'Sobremonte', 'San Francisco del Chañar');
        $agregarLocalidad('Córdoba', 'San Justo', 'Brinkmann');
        $agregarLocalidad('Córdoba', 'Punilla', 'Cosquin');
        $agregarLocalidad('Córdoba', 'San Justo', 'Brinkmann');
        $agregarLocalidad('Córdoba', 'Punilla', 'Villa Carlos Paz');

        // Corrientes
        $agregarLocalidad('Corrientes', 'Capital', 'Corrientes');
        $agregarLocalidad('Corrientes', 'Curuzú Cuatiá', 'Curuzú Cuatiá');
        $agregarLocalidad('Corrientes', 'Santo Tomé', 'Santo Tomé');
        $agregarLocalidad('Corrientes', 'Esquina', 'Esquina');
        $agregarLocalidad('Corrientes', 'Mercedes', 'Mercedes');
        $agregarLocalidad('Corrientes', 'Paso de los Libres', 'Paso de los Libres');
        $agregarLocalidad('Corrientes', 'Empedrado', 'Empedrado');
        $agregarLocalidad('Corrientes', 'San Roque', 'San Roque');
        $agregarLocalidad('Corrientes', 'Saladas', 'Saladas');
        $agregarLocalidad('Corrientes', 'General Paz', 'Nuestra Señora del Rosario de Caá Catí');
        $agregarLocalidad('Corrientes', 'Lavalle', 'Santa Lucía');
        $agregarLocalidad('Corrientes', 'Itatí', 'Itatí');
        $agregarLocalidad('Corrientes', 'Ensaladas', 'Ensaladas');

        // Chaco
        $agregarLocalidad('Chaco', 'San Fernando', 'Resistencia');
        $agregarLocalidad('Chaco', 'Comandante Fernández', 'Presidencia Roque Sáenz Peña');
        $agregarLocalidad('Chaco', 'Libertador General de San Martín', 'Pampa del Indio');
        $agregarLocalidad('Chaco', 'Mayor Jorge Luis Fontana', 'Villa Ángela');
        $agregarLocalidad('Chaco', 'Gral. Güemes', 'Juan José Castelli');
        $agregarLocalidad('Chaco', 'Gral. Güemes', 'Misión Nueva Pompeya');
        $agregarLocalidad('Chaco', 'Libertad', 'Puerto Tirol');
        $agregarLocalidad('Chaco', 'Chacabuco', 'Charata');
        $agregarLocalidad('Chaco', 'Bermejo', 'Puerto Bermejo');
        $agregarLocalidad('Chaco', 'Bermejo', 'La Leonesa');
        $agregarLocalidad('Chaco', 'Sargento Cabral', 'Colonia Elisa');


        // Chubut
        $agregarLocalidad('Chubut', 'Rawson', 'Trelew');
        $agregarLocalidad('Chubut', 'Escalante', 'Comodoro Rivadavia');
        $agregarLocalidad('Chubut', 'Biedma', 'Puerto Madryn');
        $agregarLocalidad('Chubut', 'Cushamen', 'El Maitén');
        $agregarLocalidad('Chubut', 'Futaleufú', 'Esquel');
        $agregarLocalidad('Chubut', 'Gaiman', 'Gaiman');
        $agregarLocalidad('Chubut', 'Gastre', 'Gastre');
        $agregarLocalidad('Chubut', 'Languiñeo', 'Tecka');
        $agregarLocalidad('Chubut', 'Mártires', 'Las Plumas');
        $agregarLocalidad('Chubut', 'Paso de Indios', 'Paso de Indios');
        $agregarLocalidad('Chubut', 'Río Senguerr', 'Alto Río Senguerr');
        $agregarLocalidad('Chubut', 'Sarmiento', 'Sarmiento');
        $agregarLocalidad('Chubut', 'Tehuelches', 'José de San Martín');
        $agregarLocalidad('Chubut', 'Telsen', 'Telsen');

        // Entre Ríos
        $agregarLocalidad('Entre Ríos', 'Paraná', 'Paraná');
        $agregarLocalidad('Entre Ríos', 'Islas del Ibicuy', 'Villa Paranacito');
        $agregarLocalidad('Entre Ríos', 'Feliciano', 'San José de Feliciano');
        $agregarLocalidad('Entre Ríos', 'Tala', 'Rosario del Tala');
        $agregarLocalidad('Entre Ríos', 'Gualeguaychú', 'Gualeguaychú');
        $agregarLocalidad('Entre Ríos', 'Diamante', 'Diamante');
        $agregarLocalidad('Entre Ríos', 'Federal', 'Federal');
        $agregarLocalidad('Entre Ríos', 'La Paz', 'La Paz');
        $agregarLocalidad('Entre Ríos', 'Nogoyá', 'Nogoyá');
        $agregarLocalidad('Entre Ríos', 'Paraná', 'Hasenkamp');
        $agregarLocalidad('Entre Ríos', 'Paraná', 'Viale');
        $agregarLocalidad('Entre Ríos', 'Concordia', 'Concordia');
        $agregarLocalidad('Entre Ríos', 'Gualeguay', 'Gualeguay');
        $agregarLocalidad('Entre Ríos', 'Victoria', 'Victoria');
        $agregarLocalidad('Entre Ríos', 'Villaguay', 'Villaguay');
        $agregarLocalidad('Entre Ríos', 'Federación', 'Chajarí');

        // Jujuy - Solo departamentos existentes
        $agregarLocalidad('Jujuy', 'Ledesma', 'Libertador General San Martin');
        $agregarLocalidad('Jujuy', 'Cochinoca', 'Abra Pampa');
        $agregarLocalidad('Jujuy', 'Dr. Manuel Belgrano', 'San Salvador de Jujuy');
        $agregarLocalidad('Jujuy', 'San Pedro', 'San Pedro de Jujuy');
        $agregarLocalidad('Jujuy', 'Yavi', 'La Quiaca');

        // Mendoza
        $agregarLocalidad('Mendoza', 'San Carlos', 'La Consulta');
        $agregarLocalidad('Mendoza', 'Guaymallén', 'Rodeo de la Cruz');
        $agregarLocalidad('Mendoza', 'Capital', 'Mendoza');
        $agregarLocalidad('Mendoza', 'San Rafael', 'San Rafael');
        $agregarLocalidad('Mendoza', 'Tunuyán', 'Tunuyán');
        $agregarLocalidad('Mendoza', 'Rivadavia', 'Rivadavia');
        $agregarLocalidad('Mendoza', 'Luján de Cuyo', 'Luján de Cuyo');
        $agregarLocalidad('Mendoza', 'Santa Rosa', 'Santa Rosa');
        $agregarLocalidad('Mendoza', 'General Alvear', 'General Alvear');
        $agregarLocalidad('Mendoza', 'San Martin', 'San Martín');
        $agregarLocalidad('Mendoza', 'Lavalle', 'Villa Tulumaya');
        $agregarLocalidad('Mendoza', 'Tupungato', 'Tupungato');
        $agregarLocalidad('Mendoza', 'Malargüe', 'Malargüe');
        $agregarLocalidad('Mendoza', 'Maipú', 'Maipú');
        $agregarLocalidad('Mendoza', 'Las Heras', 'La Cieneguita');
        $agregarLocalidad('Mendoza', 'Las Heras', 'Las Heras');
        $agregarLocalidad('Mendoza', 'Godoy Cruz', 'Godoy Cruz');
        $agregarLocalidad('Mendoza', 'Luján de Cuyo', 'Chacras de Coria');
        $agregarLocalidad('Mendoza', 'Santa Rosa', 'Las Catitas');
        $agregarLocalidad('Mendoza', 'San Rafael', 'Ciudad');
        $agregarLocalidad('Mendoza', 'General Alvear', 'Ciudad');
        $agregarLocalidad('Mendoza', 'San Martín', 'Colonia Junín');
        $agregarLocalidad('Mendoza', 'Luján de Cuyo', 'Chacras de Coria');
        $agregarLocalidad('Mendoza', 'Santa Rosa', 'Las Catitas');
        $agregarLocalidad('Mendoza', 'San Rafael', 'Ciudad');
        $agregarLocalidad('Mendoza', 'General Alvear', 'Ciudad');
        $agregarLocalidad('Mendoza', 'San Martín', 'Colonia Junín');


        // Misiones
        $agregarLocalidad('Misiones', 'Leandro N. Alem', 'Leandro N. Alem');
        $agregarLocalidad('Misiones', 'Capital', 'Posadas');
        $agregarLocalidad('Misiones', 'Eldorado', 'Eldorado');
        $agregarLocalidad('Misiones', 'Iguazú', 'Puerto Iguazú');
        $agregarLocalidad('Misiones', 'Oberá', 'Oberá');
        $agregarLocalidad('Misiones', 'San Ignacio', 'San Ignacio');
        $agregarLocalidad('Misiones', '25 de Mayo', 'Alba Posse');
        $agregarLocalidad('Misiones', 'Cainguás', 'Aristóbulo del Valle');
        $agregarLocalidad('Misiones', 'Libertador General San Martín', 'General José de San Martín');
        $agregarLocalidad('Misiones', 'Libertador General San Martín', 'Puerto Rico');
        $agregarLocalidad('Misiones', 'San Pedro', 'San Pedro');
        $agregarLocalidad('Misiones', 'Montecarlo', 'Montecarlo');
        $agregarLocalidad('Misiones', 'San Javier', 'San Javier');
        $agregarLocalidad('Misiones', 'Guaraní', 'El Soberbio');
        $agregarLocalidad('Misiones', 'San Martín', 'San Martín');
        $agregarLocalidad('Misiones', 'Candelaria', 'Santa Ana');
        $agregarLocalidad('Misiones', 'Concepción', 'Concepción de la Sierra');
        $agregarLocalidad('Misiones', 'Apóstoles', 'Apóstoles');

        // Neuquén
        $agregarLocalidad('Neuquén', 'Confluencia', 'Plaza Huincul');
        $agregarLocalidad('Neuquén', 'Confluencia', 'Zapala');
        $agregarLocalidad('Neuquén', 'Confluencia', 'Neuquén');
        $agregarLocalidad('Neuquén', 'Zapala', 'Zapala');
        $agregarLocalidad('Neuquén', 'Los Lagos', 'Villa La Angostura');
        $agregarLocalidad('Neuquén', 'Picún Leufú', 'Picún Leufú');
        $agregarLocalidad('Neuquén', 'Lácar', 'San Martín de los Andes');
        $agregarLocalidad('Neuquén', 'Huiliches', 'Junín de los Andes');
        $agregarLocalidad('Neuquén', 'Aluminé', 'Aluminé');
        $agregarLocalidad('Neuquén', 'Añelo', 'Añelo');
        $agregarLocalidad('Neuquén', 'Catán Lil', 'Las Coloradas');
        $agregarLocalidad('Neuquén', 'Chos Malal', 'Chos Malal');
        $agregarLocalidad('Neuquén', 'Collón Curá', 'Piedra del Águila');
        $agregarLocalidad('Neuquén', 'Loncopué', 'Loncopué');
        $agregarLocalidad('Neuquén', 'Minas', 'Andacollo');
        $agregarLocalidad('Neuquén', 'Ñorquín', 'El Huecú');
        $agregarLocalidad('Neuquén', 'Pehuenches', 'Buta Ranquil');
        $agregarLocalidad('Neuquén', 'Picunches', 'Las Lajas');

        // Río Negro
        $agregarLocalidad('Rio Negro', 'General Roca', 'General Roca');
        $agregarLocalidad('Rio Negro', 'Bariloche', 'Bariloche');
        $agregarLocalidad('Rio Negro', 'San Antonio', 'San Antonio Oeste');
        $agregarLocalidad('Rio Negro', 'Avellaneda', 'Choele Choel');
        $agregarLocalidad('Rio Negro', 'El Cuy', 'El Cuy');
        $agregarLocalidad('Rio Negro', '25 de Mayo', 'Maquinchao');
        $agregarLocalidad('Rio Negro', 'Pichi Mahuida', 'Río Colorado');
        $agregarLocalidad('Rio Negro', 'Valcheta', 'Valcheta');
        $agregarLocalidad('Rio Negro', 'Ñorquincó', 'Ñorquincó');
        $agregarLocalidad('Rio Negro', 'Pilcaniyeu', 'Pilcaniyeu');
        $agregarLocalidad('Rio Negro', '9 de Julio', 'Sierra Colorada');
        $agregarLocalidad('Rio Negro', 'Adolfo Alsina', 'Viedma');
        $agregarLocalidad('Rio Negro', 'General Roca', 'Villa Regina');
        $agregarLocalidad('Rio Negro', 'General Roca', 'Villa Regina');

        // Salta - Solo departamentos existentes
        $agregarLocalidad('Salta', 'General José de San Martín', 'Tartagal');
        $agregarLocalidad('Salta', 'General José de San Martín', 'Embarcación');
        $agregarLocalidad('Salta', 'General José de San Martín', 'Tartagal');
        $agregarLocalidad('Salta', 'Capital', 'Salta');
        $agregarLocalidad('Salta', 'Rosario de Lerma', 'Rosario de Lerma');
        $agregarLocalidad('Salta', 'Orán', 'San Ramón de la Nueva Orán');
        $agregarLocalidad('Salta', 'General Güemes', 'General Güemes');
        $agregarLocalidad('Salta', 'Anta', 'Joaquín V. González');
        $agregarLocalidad('Salta', 'Chicoana', 'El Carril');
        $agregarLocalidad('Salta', 'Chicoana', 'Chicoana');
        $agregarLocalidad('Salta', 'Rosario de la Frontera', 'Rosario de la Frontera');
        $agregarLocalidad('Salta', 'Cachi', 'Cachi');

        // Santa Fe
        $agregarLocalidad('Santa Fe', 'San Justo', 'Gobernador Crespo');
        $agregarLocalidad('Santa Fe', 'Iriondo', 'Oliveros');
        $agregarLocalidad('Santa Fe', 'Rosario', 'Rosario');
        $agregarLocalidad('Santa Fe', 'La Capital', 'Santa Fe');
        $agregarLocalidad('Santa Fe', 'General López', 'Venado Tuerto');
        $agregarLocalidad('Santa Fe', 'Las Colonias', 'Esperanza');
        $agregarLocalidad('Santa Fe', 'San Lorenzo', 'San Lorenzo');
        $agregarLocalidad('Santa Fe', 'San Cristóbal', 'San Cristóbal');
        $agregarLocalidad('Santa Fe', 'Vera', 'Vera');
        $agregarLocalidad('Santa Fe', 'General Obligado', 'Reconquista');
        $agregarLocalidad('Santa Fe', 'Castellanos', 'Rafaela');
        $agregarLocalidad('Santa Fe', 'San Martín', 'Sastre');
        $agregarLocalidad('Santa Fe', 'Nueve de Julio', 'Tostado');
        $agregarLocalidad('Santa Fe', 'San Jerónimo', 'Coronda');
        $agregarLocalidad('Santa Fe', 'Caseros', 'Casilda');
        $agregarLocalidad('Santa Fe', 'Belgrano', 'Las Rosas');

        // Santiago del Estero
        $agregarLocalidad('Santiago del Estero', 'Robles', 'Ingeniero Forres');
        $agregarLocalidad('Santiago del Estero', 'Juan Felipe Ibarra', 'Suncho Corral');
        $agregarLocalidad('Santiago del Estero', 'Loreto', 'Loreto');
        $agregarLocalidad('Santiago del Estero', 'General Taboada', 'Añatuya');
        $agregarLocalidad('Santiago del Estero', 'Capital', 'Santiago del Estero');
        $agregarLocalidad('Santiago del Estero', 'Banda', 'La Banda');
        $agregarLocalidad('Santiago del Estero', 'Figueroa', 'Laprida');
        $agregarLocalidad('Santiago del Estero', 'Choya', 'Frías');
        $agregarLocalidad('Santiago del Estero', 'Añatuya', 'Añatuya');
        $agregarLocalidad('Santiago del Estero', 'General Taboada', 'Añatuya');
        $agregarLocalidad('Santiago del Estero', 'Sarmiento', 'Suncho Corral');
        $agregarLocalidad('Santiago del Estero', 'San Martín', 'Brea Pozo');
        $agregarLocalidad('Santiago del Estero', 'Salavina', 'Villa Salavina');
        $agregarLocalidad('Santiago del Estero', 'Avellaneda', 'Herrera');
        $agregarLocalidad('Santiago del Estero', 'Guasayán', 'San Pedro de Guasayán');
        $agregarLocalidad('Santiago del Estero', 'Copo', 'Monte Quemado');
        $agregarLocalidad('Santiago del Estero', 'Pellegrini', 'Nueva Esperanza');
        $agregarLocalidad('Santiago del Estero', 'Jiménez', 'Pozo Hondo');
        $agregarLocalidad('Santiago del Estero', 'Atamisqui', 'Villa Atamisqui');
        $agregarLocalidad('Santiago del Estero', 'Aguirre', 'Villa General Mitre');
        $agregarLocalidad('Santiago del Estero', 'Rivadavia', 'Selva');
        $agregarLocalidad('Santiago del Estero', 'Mitre', 'Villa Unión');
        $agregarLocalidad('Santiago del Estero', 'Quebrachos', 'Sumampa');
        $agregarLocalidad('Santiago del Estero', 'Juan F. Ibarra', 'Santo Domingo');
        $agregarLocalidad('Santiago del Estero', 'Ojo de Agua', 'Villa Ojo de Agua');
        $agregarLocalidad('Santiago del Estero', 'Santiago del Estero', 'Juan Francisco Borges');

        // Tierra del Fuego
        $agregarLocalidad('Tierra del Fuego', 'Río Grande', 'Río Grande');
        $agregarLocalidad('Tierra del Fuego', 'Ushuaia', 'Ushuaia');

        // Tucumán
        $agregarLocalidad('Tucumán', 'Capital', 'San Miguel de Tucumán');
        $agregarLocalidad('Tucumán', 'Burruyacú', 'La Ramada');
        $agregarLocalidad('Tucumán', 'Cruz Alta', 'Delfin Gallo');
        $agregarLocalidad('Tucumán', 'Tafí del Valle', 'Amaicha del Valle');
        $agregarLocalidad('Tucumán', 'Leales', 'Santa Rosa de Leales');
        $agregarLocalidad('Tucumán', 'Chicligasta', 'CONCEPCION');
        $agregarLocalidad('Tucumán', 'Monteros', 'Monteros');
        $agregarLocalidad('Tucumán', 'Tafí Viejo', 'Tafí Viejo');
        $agregarLocalidad('Tucumán', 'Cruz Alta', 'Banda del Río Salí');
        $agregarLocalidad('Tucumán', 'Burruyacú', 'Burruyacú');
        $agregarLocalidad('Tucumán', 'Trancas', 'Trancas');
        $agregarLocalidad('Tucumán', 'Yerba Buena', 'Yerba Buena');
        $agregarLocalidad('Tucumán', 'Leales', 'Bella Vista');
        $agregarLocalidad('Tucumán', 'Lules', 'Lules');
        $agregarLocalidad('Tucumán', 'Famaillá', 'Famaillá');
        $agregarLocalidad('Tucumán', 'Río Chico', 'Aguilares');
        $agregarLocalidad('Tucumán', 'Simoca', 'Simoca');
        $agregarLocalidad('Tucumán', 'Tafí del Valle', 'Tafí del Valle');
        $agregarLocalidad('Tucumán', 'Graneros', 'Graneros');
        $agregarLocalidad('Tucumán', 'La Cocha', 'La Cocha');
        $agregarLocalidad('Tucumán', 'Juan B. Alberdi', 'Juan B. Alberdi');
        $agregarLocalidad('Tucumán', 'Cruz Alta', 'Los Ralos');
        $agregarLocalidad('Tucumán', 'Trancas', 'Villa de Trancas');

        // Insertar todas las localidades en lotes para evitar problemas de memoria
        $chunks = array_chunk($localidades, 50);

        foreach ($chunks as $chunk) {
            DB::table('localidades')->insert($chunk);
        }
    }
}
