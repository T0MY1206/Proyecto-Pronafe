// Exportar todos los componentes de Excel desde un punto central
export { default as ExcelExportComponent } from './ExcelExportComponent';
export { default as ExcelExportExamples } from './ExcelExportExamples';
export { default as ExcelExportGrid } from './ExcelExportGrid';

// Re-exportar tipos comunes para facilitar el uso
export type {
    ExportConfig,
    PeriodoActual,
    Provincia,
    ExcelExportComponentProps,
    ExcelExportGridProps,
    ExcelExportExamplesProps,
    ExportStartCallback,
    ExportCompleteCallback,
    ExportErrorCallback,
    ExportParameter,
    ExportParameterValidation,
    ExportType,
    ExportColumns
} from '@/types';
