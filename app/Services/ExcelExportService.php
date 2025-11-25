<?php

namespace App\Services;

use App\Exports\FormulariosExport;
use App\Exports\ResumenExport;
use App\Models\Actualizacion;
use App\Models\Provincia;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;

class ExcelExportService
{
    /**
     * Configuración de exportaciones disponibles
     */
    private array $exportConfigs = [
        'formularios' => [
            'class' => FormulariosExport::class,
            'name' => 'Formularios_Recibidos',
            'description' => 'Formularios recibidos con datos institucionales, alumnos/docentes y comentarios',
            'required_params' => ['anio'],
            'optional_params' => ['provincia_id']
        ],
        'resumen' => [
            'class' => ResumenExport::class,
            'name' => 'Resumen_Ejecutivo',
            'description' => 'Resumen ejecutivo con datos consolidados de institutos por provincia',
            'required_params' => ['anio'],
            'optional_params' => ['provincia_id']
        ]
    ];

    /**
     * Obtiene la configuración de una exportación específica
     */
    public function getExportConfig(string $exportType): ?array
    {
        return $this->exportConfigs[$exportType] ?? null;
    }

    /**
     * Obtiene todas las configuraciones de exportación disponibles
     */
    public function getAllExportConfigs(): array
    {
        return $this->exportConfigs;
    }

    /**
     * Valida los parámetros de una exportación
     */
    public function validateExportParams(string $exportType, array $params): array
    {
        $config = $this->getExportConfig($exportType);
        
        if (!$config) {
            return ['valid' => false, 'errors' => ['Tipo de exportación no válido']];
        }

        $errors = [];

        // Validar parámetros requeridos
        foreach ($config['required_params'] as $param) {
            if (!isset($params[$param]) || empty($params[$param])) {
                $errors[] = "El parámetro '{$param}' es requerido";
            }
        }

        // Validar año si está presente
        if (isset($params['anio'])) {
            $anio = (int) $params['anio'];
            if ($anio < 2020 || $anio > (now()->year + 1)) {
                $errors[] = 'El año debe estar entre 2020 y ' . (now()->year + 1);
            }
        }

        // Validar provincia si está presente
        if (isset($params['provincia_id']) && !empty($params['provincia_id'])) {
            if (!Provincia::find($params['provincia_id'])) {
                $errors[] = 'La provincia seleccionada no es válida';
            }
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }

    /**
     * Genera el nombre del archivo para la exportación
     */
    public function generateFileName(string $exportType, array $params): string
    {
        $config = $this->getExportConfig($exportType);
        $baseName = $config['name'] ?? 'export';

        $fileName = $baseName;

        // Agregar año si está presente
        if (isset($params['anio'])) {
            $fileName .= "_{$params['anio']}";
        }

        // Agregar provincia si está presente
        if (isset($params['provincia_id']) && !empty($params['provincia_id'])) {
            $provincia = Provincia::find($params['provincia_id']);
            if ($provincia) {
                $fileName .= '_' . $provincia->descripcion;
            }
        }

        // Agregar timestamp
        $fileName .= '_' . now()->format('Y-m-d_H-i-s') . '.xlsx';

        return $fileName;
    }

    /**
     * Ejecuta una exportación
     */
    public function executeExport(string $exportType, array $params)
    {
        $config = $this->getExportConfig($exportType);
        
        if (!$config) {
            throw new \InvalidArgumentException('Tipo de exportación no válido');
        }

        // Validar parámetros
        $validation = $this->validateExportParams($exportType, $params);
        if (!$validation['valid']) {
            throw new \InvalidArgumentException('Parámetros inválidos: ' . implode(', ', $validation['errors']));
        }

        // Crear instancia de la clase de exportación
        $exportClass = $config['class'];
        $exportInstance = new $exportClass($params['anio'] ?? null, $params['provincia_id'] ?? null);

        // Generar nombre del archivo
        $fileName = $this->generateFileName($exportType, $params);

        // Retornar la descarga
        return Excel::download($exportInstance, $fileName);
    }

    /**
     * Obtiene datos para la interfaz de exportación
     */
    public function getExportInterfaceData(): array
    {
        return [
            'periodoActual' => Actualizacion::where('activo', true)->first(),
            'provincias' => Provincia::all(),
            'aniosDisponibles' => $this->getAniosDisponibles(),
            'exportConfigs' => $this->getAllExportConfigs()
        ];
    }

    /**
     * Obtiene los años disponibles para exportación
     */
    public function getAniosDisponibles(): array
    {
        return Actualizacion::select('anio')
            ->orderBy('anio', 'desc')
            ->pluck('anio')
            ->toArray();
    }

    /**
     * Procesa una petición de exportación desde el frontend
     */
    public function handleExportRequest(Request $request, string $exportType)
    {
        $params = $request->only(['anio', 'provincia_id']);
        
        return $this->executeExport($exportType, $params);
    }
}
