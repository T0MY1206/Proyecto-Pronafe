<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ExcelExportService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExportController extends Controller
{
    protected ExcelExportService $excelExportService;

    public function __construct(ExcelExportService $excelExportService)
    {
        $this->excelExportService = $excelExportService;
    }

    public function index()
    {
        $data = $this->excelExportService->getExportInterfaceData();
        
        return Inertia::render('admin/Export/ExportSection', $data);
    }

    public function exportarFormularios(Request $request)
    {
        return $this->excelExportService->handleExportRequest($request, 'formularios');
    }

    /**
     * Método genérico para exportaciones futuras
     */
    public function exportar(Request $request, string $exportType)
    {
        return $this->excelExportService->handleExportRequest($request, $exportType);
    }
}
