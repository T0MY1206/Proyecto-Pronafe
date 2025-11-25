import ExcelExportComponent from './ExcelExportComponent';
import type { ExcelExportExamplesProps } from '@/types';

/**
 * Componente de ejemplo que muestra cómo usar ExcelExportComponent
 * en diferentes contextos del sistema
 */
export default function ExcelExportExamples({ periodoActual, provincias, aniosDisponibles = [], exportConfigs }: ExcelExportExamplesProps) {
    return (
        <div className="space-y-6">
            {/* Ejemplo 1: Exportación básica */}
            <ExcelExportComponent
                exportType="formularios"
                exportConfig={exportConfigs.formularios}
                periodoActual={periodoActual}
                provincias={provincias}
                aniosDisponibles={aniosDisponibles}
                exportUrl={route('admin.exportar.formularios')}
                title="Exportación Básica"
            />

            {/* Ejemplo 2: Exportación sin descripción */}
            <ExcelExportComponent
                exportType="formularios"
                exportConfig={exportConfigs.formularios}
                periodoActual={periodoActual}
                provincias={provincias}
                aniosDisponibles={aniosDisponibles}
                exportUrl={route('admin.exportar.formularios')}
                title="Exportación Sin Descripción"
                showDescription={false}
            />

            {/* Ejemplo 3: Exportación con filtros personalizados */}
            <ExcelExportComponent
                exportType="formularios"
                exportConfig={exportConfigs.formularios}
                periodoActual={periodoActual}
                provincias={provincias}
                aniosDisponibles={aniosDisponibles}
                exportUrl={route('admin.exportar.formularios')}
                title="Exportación Con Filtros Personalizados"
                customFilters={
                    <>
                        <div>
                            <label className="form-label">Año Personalizado</label>
                            <input 
                                type="number" 
                                className="form-control" 
                                placeholder="Ingrese el año"
                                min="2020"
                                max={new Date().getFullYear() + 1}
                            />
                        </div>
                        <div>
                            <label className="form-label">Filtro Adicional</label>
                            <select className="form-select">
                                <option value="">Seleccione una opción</option>
                                <option value="1">Opción 1</option>
                                <option value="2">Opción 2</option>
                            </select>
                        </div>
                    </>
                }
            />

            {/* Ejemplo 4: Exportación compacta */}
            <ExcelExportComponent
                exportType="formularios"
                exportConfig={exportConfigs.formularios}
                periodoActual={periodoActual}
                provincias={provincias}
                aniosDisponibles={aniosDisponibles}
                exportUrl={route('admin.exportar.formularios')}
                className="border-2 border-dashed border-gray-300"
                showDescription={false}
                onExportStart={() => console.log('Iniciando exportación...')}
                onExportComplete={() => console.log('Exportación completada!')}
                onExportError={(error) => console.error('Error en exportación:', error)}
            />
        </div>
    );
}
