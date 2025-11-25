import ExcelExportComponent from './ExcelExportComponent';
import type { ExcelExportGridProps, ExportConfig } from '@/types';

/**
 * Componente que muestra múltiples opciones de exportación en un grid
 */
export default function ExcelExportGrid({ 
    periodoActual, 
    provincias, 
    aniosDisponibles = [],
    exportConfigs, 
    columns = 2,
    showTitles = true,
    className = ''
}: ExcelExportGridProps) {
    const gridCols = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    };

    const getExportRoute = (exportType: string) => {
        switch (exportType) {
            case 'formularios':
                return route('admin.exportar.formularios');
            case 'resumen':
                return route('admin.exportar.resumen');
            default:
                return route('admin.exportar', { type: exportType });
        }
    };

    const getExportTitle = (exportType: string, config: ExportConfig) => {
        if (!showTitles) return undefined;
        
        switch (exportType) {
            case 'formularios':
                return 'Formularios Completos';
            case 'resumen':
                return 'Resumen Ejecutivo';
            default:
                return config.name.replace(/_/g, ' ');
        }
    };

    return (
        <div className={`grid ${gridCols[columns]} gap-6 ${className}`}>
            {Object.entries(exportConfigs).map(([exportType, config]) => (
                <ExcelExportComponent
                    key={exportType}
                    exportType={exportType}
                    exportConfig={config}
                    periodoActual={periodoActual}
                    provincias={provincias}
                    aniosDisponibles={aniosDisponibles}
                    exportUrl={getExportRoute(exportType)}
                    title={getExportTitle(exportType, config)}
                />
            ))}
        </div>
    );
}
