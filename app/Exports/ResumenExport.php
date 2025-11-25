<?php

namespace App\Exports;

use App\Models\Dato;
use App\Models\Provincia;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class ResumenExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnWidths, WithEvents
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
            'Nombre del Instituto',
            'Provincia',
            'Total Alumnos',
            'Total Docentes',
            'Monto Anual',
            'Estado'
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
            $dato->instituto->localidad->provincia->descripcion ?? '',
            $totalAlumnos,
            $dato->cantidad_docentes_practica ?? 0,
            $dato->monto_anual ?? 0,
            'Aprobado'
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 12,  // CUE
            'B' => 50,  // Nombre del Instituto
            'C' => 20,  // Provincia
            'D' => 15,  // Total Alumnos
            'E' => 15,  // Total Docentes
            'F' => 20,  // Monto Anual
            'G' => 15,  // Estado
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => [
                    'bold' => true,
                    'size' => 11,
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => [
                        'rgb' => 'D9E1F2',
                    ],
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color' => ['rgb' => '000000'],
                    ],
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
                
                // Aplicar bordes a todas las celdas con datos
                $event->sheet->getStyle('A1:' . $lastColumn . $lastRow)
                    ->getBorders()
                    ->getAllBorders()
                    ->setBorderStyle(Border::BORDER_THIN);

                // Centrar CUE
                $event->sheet->getStyle('A:A')
                    ->getAlignment()
                    ->setHorizontal(Alignment::HORIZONTAL_CENTER);

                // Centrar columnas numéricas
                $event->sheet->getStyle('D:G')
                    ->getAlignment()
                    ->setHorizontal(Alignment::HORIZONTAL_CENTER);

                // Formato de moneda para monto anual
                $event->sheet->getStyle('F:F')
                    ->getNumberFormat()
                    ->setFormatCode('"$"#,##0.00');

                // Formato de número para cantidades
                $event->sheet->getStyle('D:E')
                    ->getNumberFormat()
                    ->setFormatCode('#,##0');

                // Ajustar altura de filas
                $event->sheet->getDefaultRowDimension()->setRowHeight(20);
            },
        ];
    }
}