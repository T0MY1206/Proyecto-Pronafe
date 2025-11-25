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

class ComentariosSheet implements FromCollection, WithHeadings, WithMapping, WithStyles, WithColumnWidths, WithEvents, WithTitle
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
        $query = Dato::with(['instituto'])
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
            'Comentarios'
        ];
    }

    public function map($dato): array
    {
        return [
            $dato->cue,
            $dato->instituto->nombre ?? '',
            $dato->observaciones ?? ''
        ];
    }

    public function columnWidths(): array
    {
        return [
            'A' => 12,  // CUE
            'B' => 50,  // Nombre
            'C' => 80,  // Comentarios
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
            'A2:C1000' => [
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
                
                // Agregar filtros a la primera fila
                $event->sheet->setAutoFilter('A1:' . $lastColumn . '1');
                
                // Permitir wrap text para comentarios
                $event->sheet->getStyle('C:C')
                    ->getAlignment()
                    ->setWrapText(true);
            },
        ];
    }

    public function title(): string
    {
        return 'Comentarios';
    }
}
