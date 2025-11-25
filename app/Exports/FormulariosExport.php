<?php

namespace App\Exports;

use App\Models\Dato;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class FormulariosExport implements WithMultipleSheets
{
    protected $anio;
    protected $provinciaId;

    public function __construct($anio = null, $provinciaId = null)
    {
        $this->anio = $anio;
        $this->provinciaId = $provinciaId;
    }

    public function sheets(): array
    {
        return [
            'Institucionales' => new InstitucionalesSheet($this->anio, $this->provinciaId),
            'AlumnosYDocentes' => new AlumnosYDocentesSheet($this->anio, $this->provinciaId),
            'Comentarios' => new ComentariosSheet($this->anio, $this->provinciaId),
        ];
    }
}