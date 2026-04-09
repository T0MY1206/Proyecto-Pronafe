import { AdminLayout } from '@/layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import { ExcelExportComponent } from '@/components/excel';

interface PeriodoActual {
    id: number;
    anio: number;
    fecha_tope: string;
}

interface Provincia {
    id: number;
    descripcion: string;
}

interface ExportConfig {
    class: string;
    name: string;
    description: string;
    required_params: string[];
    optional_params: string[];
}

interface Props {
    periodoActual?: PeriodoActual;
    provincias: Provincia[];
    aniosDisponibles: number[];
    exportConfigs: Record<string, ExportConfig>;
}

export default function ExportSection({ periodoActual, provincias, aniosDisponibles, exportConfigs }: Props) {

    return (
        <AdminLayout>
            <Head>
                <title>Exportar Datos</title>
            </Head>
            

            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="intro-y col-span-12">
                    {exportConfigs.formularios && (
                        <ExcelExportComponent
                            exportType="formularios"
                            exportConfig={exportConfigs.formularios}
                            periodoActual={periodoActual}
                            provincias={provincias}
                            aniosDisponibles={aniosDisponibles}
                            exportUrl={route('admin.exportar.formularios')}
                            title="Exportar Formularios Recibidos"
                        />
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
