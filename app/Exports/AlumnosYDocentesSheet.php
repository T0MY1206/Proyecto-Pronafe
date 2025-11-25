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

class AlumnosYDocentesSheet implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnWidths, WithEvents, WithTitle
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
        $query = Dato::with(['instituto.localidad.provincia'])
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
            'Nombre',
            'Primero',
            'Segundo',
            'Tercero',
            'Egresados',
            'Total',
            'PPs',
            'Matricula',
            'Cuota',
            'Cant.',
            '2 Ingresos'
        ];
    }

    public function map($dato): array
    {
        $totalAlumnos = ($dato->cantidad_anio_1 ?? 0) + 
                       ($dato->cantidad_anio_2 ?? 0) + 
                       ($dato->cantidad_anio_3 ?? 0);

        return [
            $dato->cue,
            $dato->instituto->nombre ?? '',
            $dato->cantidad_anio_1 ?? 0,
            $dato->cantidad_anio_2 ?? 0,
            $dato->cantidad_anio_3 ?? 0,
            $dato->cantidad_egresados ?? 0,
            $totalAlumnos,
            $dato->cantidad_docentes_practica ?? 0, // PPs = Docentes de Práctica
            $dato->monto_anual ?? 0,
            $dato->monto_mensual ?? 0,
            $dato->cantidad_cuota ?? 0,
            $dato->monto_extracurricular ?? 0
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 12,  // CUE
            'B' => 50,  // Nombre
            'C' => 12,  // Primero
            'D' => 12,  // Segundo
            'E' => 12,  // Tercero
            'F' => 12,  // Egresados
            'G' => 12,  // Total
            'H' => 12,  // PPs
            'I' => 15,  // Matricula
            'J' => 15,  // Cuota
            'K' => 12,  // Cant.
            'L' => 15,  // 2 Ingresos
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Estilo para los títulos (fila 1)
            1 => [
                'font' => [
                    'bold' => true,
                    'size' => 14,
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_LEFT,
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => [
                        'rgb' => 'D8D8D8', // Gris
                    ],
                ],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color' => ['rgb' => '000000'],
                    ],
                ],
            ],
            // Estilo para las filas de datos (sin bordes)
            'A2:L1000' => [
                'font' => [
                    'size' => 12,
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_LEFT,
                    'vertical' => Alignment::VERTICAL_CENTER,
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
                
                // Ajustar altura de filas
                $event->sheet->getDefaultRowDimension()->setRowHeight(20);
                
                // Hacer que la fila de encabezados tenga el doble de altura
                $event->sheet->getRowDimension(1)->setRowHeight(40);
                
                // Autoajustar columnas al contenido
                foreach (range('A', $lastColumn) as $column) {
                    $event->sheet->getColumnDimension($column)->setAutoSize(true);
                }
                
                // Sin filtros para la hoja de Alumnos y Docentes

                // Formato de moneda para montos
                $event->sheet->getStyle('I:L')
                    ->getNumberFormat()
                    ->setFormatCode('"$"#,##0.00');

                // Formato de número para cantidades
                $event->sheet->getStyle('C:H')
                    ->getNumberFormat()
                    ->setFormatCode('#,##0');
            },
        ];
    }

    public function title(): string
    {
        return 'AlumnosYDocentes';
    }
}
