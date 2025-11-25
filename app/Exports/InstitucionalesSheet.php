<?php

namespace App\Exports;

use App\Models\Dato;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class InstitucionalesSheet implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnWidths, WithEvents, WithTitle
{
    protected $anio;
    protected $provinciaId;

    public function __construct($anio = null, $provinciaId = null)
    {
        $this->anio = $anio;
        $this->provinciaId = $provinciaId;
    }

    public function collection()
    {
        $query = Dato::with([
            'instituto.localidad.provincia', 
            'instituto.localidad.departamento', 
            'instituto.tipoInstituto',
            'instituto.autoridades.cargo'
        ])
            ->where('estado_id', 3); // Solo formularios aprobados

        if ($this->anio) {
            $query->where('anio', $this->anio);
        }

        if ($this->provinciaId) {
            $query->whereHas('instituto.localidad', function($q) {
                $q->where('provincia_id', $this->provinciaId);
            });
        }

        return $query->orderBy('cue')->get();
    }

    public function headings(): array
    {
        return [
            'CUE',
            'Nombre de la Institución',
            'PROVINCIA',
            'DEPARTAMENTO',
            'LOCALIDAD',
            'CP',
            'Ambito de Gestión',
            'Tipo de Institución',
            'DIRECCION',
            'TELEFONO',
            'MAIL',
            'Autoridad Institucional',
            'Cargo',
            'TELÉFONO1',
            'MAIL1',
            'Autoridad de Carrera',
            'Cargo',
            'TELÉFONO2',
            'MAIL2',
            'Año de ingreso'
        ];
    }

    public function map($dato): array
    {
        $instituto = $dato->instituto;
        $autoridades = $instituto->autoridades ?? collect();
        
        // Buscar autoridad institucional (cargo_id = 1)
        $autoridadInstitucional = $autoridades->where('cargo_id', 1)->first();
        
        // Buscar autoridad de carrera (cargo_id = 2)
        $autoridadCarrera = $autoridades->where('cargo_id', 2)->first();

        return [
            $dato->cue,
            $instituto->nombre ?? '',
            $instituto->localidad->provincia->descripcion ?? '',
            $instituto->localidad->departamento->descripcion ?? '',
            $instituto->localidad->descripcion ?? '',
            $instituto->codigo_postal ?? '',
            $this->getAmbitoGestionDescripcion($instituto->ambito_gestion ?? ''),
            $instituto->tipoInstituto->descripcion ?? '',
            $instituto->direccion ?? '',
            $instituto->telefono ?? '',
            $instituto->email ?? '',
            $autoridadInstitucional->nombre_apellido ?? '',
            $autoridadInstitucional->cargo->descripcion ?? '',
            $autoridadInstitucional->telefono ?? '',
            $autoridadInstitucional->email ?? '',
            $autoridadCarrera->nombre_apellido ?? '',
            $autoridadCarrera->cargo->descripcion ?? '',
            $autoridadCarrera->telefono ?? '',
            $autoridadCarrera->email ?? '',
            $dato->anio
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 12,  // CUE
            'B' => 50,  // Nombre de la Institución
            'C' => 15,  // PROVINCIA
            'D' => 20,  // DEPARTAMENTO
            'E' => 20,  // LOCALIDAD
            'F' => 8,   // CP
            'G' => 15,  // Ambito de Gestión
            'H' => 25,  // Tipo de Institución
            'I' => 30,  // DIRECCION
            'J' => 15,  // TELEFONO
            'K' => 25,  // MAIL
            'L' => 25,  // Autoridad Institucional
            'M' => 20,  // Cargo
            'N' => 15,  // TELÉFONO1
            'O' => 25,  // MAIL1
            'P' => 25,  // Autoridad de Carrera
            'Q' => 20,  // Cargo
            'R' => 15,  // TELÉFONO2
            'S' => 25,  // MAIL2
            'T' => 12,  // Año de ingreso
        ];
    }

    /**
     * Configuración de estilos para el Excel
     */
    public function styles(Worksheet $sheet)
    {
        return [
            // Estilo base para los títulos (fila 1)
            1 => [
                'font' => [
                    'bold' => true,
                    'size' => 14,
                ],
                'alignment' => [
                    'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT,
                    'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                ],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => [
                        'rgb' => 'D8D8D8', // Gris
                    ],
                ],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                        'color' => ['rgb' => '000000'],
                    ],
                ],
            ],
            // Estilo para las filas de datos (sin bordes)
            'A2:T1000' => [
                'font' => [
                    'size' => 12,
                ],
                'alignment' => [
                    'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT,
                    'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                ],
            ],
            // Títulos específicos en rojo: Provincia (C1), Departamento (D1), Tipo de Institución (H1), Año de ingreso (T1)
            'C1' => [
                'font' => [
                    'bold' => true,
                    'size' => 14,
                    'color' => ['rgb' => 'FF0000'], // Rojo
                ],
            ],
            'D1' => [
                'font' => [
                    'bold' => true,
                    'size' => 14,
                    'color' => ['rgb' => 'FF0000'], // Rojo
                ],
            ],
            'H1' => [
                'font' => [
                    'bold' => true,
                    'size' => 14,
                    'color' => ['rgb' => 'FF0000'], // Rojo
                ],
            ],
            'T1' => [
                'font' => [
                    'bold' => true,
                    'size' => 14,
                    'color' => ['rgb' => 'FF0000'], // Rojo
                ],
            ],
        ];
    }


    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $lastRow = $event->sheet->getHighestRow();
                $lastColumn = $event->sheet->getHighestColumn();
                
                // Todas las columnas alineadas a la izquierda (ya configurado en styles)

                // Ajustar altura de filas
                $event->sheet->getDefaultRowDimension()->setRowHeight(20);
                
                // Hacer que la fila de encabezados tenga el doble de altura
                $event->sheet->getRowDimension(1)->setRowHeight(40);
                
                // Autoajustar columnas al contenido
                foreach (range('A', $lastColumn) as $column) {
                    $event->sheet->getColumnDimension($column)->setAutoSize(true);
                }
                
                // Agregar filtros a la primera fila
                $event->sheet->setAutoFilter('A1:' . $lastColumn . '1');
            },
        ];
    }

    public function title(): string
    {
        return 'Institucionales';
    }

    /**
     * Convierte el código de ámbito de gestión a descripción legible
     */
    private function getAmbitoGestionDescripcion($ambitoGestion): string
    {
        return match($ambitoGestion) {
            'E' => 'Estatal',
            default => 'Privado'
        };
    }
}
