import { SupervisorLayout } from "@/layouts/SupervisorLayout";
import { usePage, Head } from '@inertiajs/react';
import Target from "@/components/cards/Traget";
import CakeGraphics, { ChartDataItem } from "@/components/charts/CakeChart";
import { Provincia } from "@/types";

interface DashboardData {
    yearSelectedData: any;
    dataTable: any;
    totalRecordsCount: number;
    sumDocentesCarrera: number;
    sumDocentesPractica: number;
    sum1Año: number;
    sum2Año: number;
    sum3Año: number;
    sumEgresados: number;
    percentageByState: Record<string, number>;
}

export default function DashboardIndex() {
    // Datos de Inertia
    const props = usePage().props;
    const initialData = props.initialData as DashboardData;
    const provincia = props.provincia as Provincia;

    // Datos a mostrar
    const {
        yearSelectedData,
        totalRecordsCount,
        sumDocentesCarrera,
        sumDocentesPractica,
        sum1Año,
        sum2Año,
        sum3Año,
        sumEgresados,
        percentageByState
    } = initialData;
    
    // Datos del gráfico torta
    const chartDataForCakeGraphics: ChartDataItem[] = Object.entries(percentageByState ?? {}).map(
        ([estadoId, percentage]) => {
            let label = `Estado ${estadoId}`;
            let color = "#000000ff";
            switch (parseInt(estadoId)) {
                case 1: label = "Sin Enviar"; color = "#dbdf14ff"; break;
                case 2: label = "Pendiente de Revisión"; color = "#058dfcff"; break;
                case 3: label = "Aprobado"; color = "#15c023ff"; break;
                case 4: label = "Rechazado"; color = "#b63030ff"; break;
                default: label = `Estado Desconocido ${estadoId}`; color = "#9966FF";
            }
            return { label, percentage: percentage as number, color };
        }
    );

    return (
        <SupervisorLayout>
            <Head>
                <title>Reporte Académico - Supervisor</title>
            </Head>

            {/* TÍTULO DEL DASHBOARD */}
            <div className="rounded-lg m-2">
                <div className="flex items-end gap-6 w-full">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Reporte Académico {provincia.descripcion}
                    </h1>
                </div>
            </div>

            {/* REPORTES Y GRÁFICOS - SIEMPRE VISIBLES */}
            <div className="m-4">
                <p className="text-xl text-gray-600 mb-4">
                    Vista general de institutos de {provincia.descripcion} del último año disponible ({yearSelectedData?.anio || 'N/A'}).
                </p>
            </div>

            <div className="flex justify-center gap-5 items-stretch">
                <div className="bg-transparent p-3 flex flex-col h-full w-auto">
                    <CakeGraphics
                        title={`Estado de formularios - ${provincia.descripcion}`}
                        chartData={chartDataForCakeGraphics}
                        totalValue={totalRecordsCount}
                    />
                </div>

                <div className="col-md-6 bg-transparent d-flex p-3">
                    <h2 className="font-bold mt-4 text-xl">Total docentes carrera</h2>
                    <div className="flex gap-6 mt-4">
                        <Target title="Docentes Carrera" totalValue={sumDocentesCarrera} />
                        <Target title="Docentes Carrera Prácticas" totalValue={sumDocentesPractica} />
                    </div>
                    <h2 className="font-bold mt-4 text-xl">
                        Alumnos matriculados al {yearSelectedData?.fecha_matriculados || 'N/A'}
                    </h2>
                    <div className="flex gap-6 mt-4">
                        <Target title="1º" totalValue={sum1Año} />
                        <Target title="2º" totalValue={sum2Año} />
                        <Target title="3º" totalValue={sum3Año} />
                    </div>
                    <h2 className="font-bold mt-4 text-xl">
                        Egresados entre el {yearSelectedData?.fecha_1_egresados || 'N/A'} y el {yearSelectedData?.fecha_2_egresados || 'N/A'}
                    </h2>
                    <div className="flex gap-6 mt-4">
                        <Target title="Total de egresados" totalValue={sumEgresados} />
                    </div>
                </div>
            </div>

            {/* MENSAJE SOBRE LA TABLA */}
            <div className="m-6 p-6 bg-blue-100 border border-blue-300 rounded">
                <h3 className="font-bold text-blue-800 text-xl">📊 Información Provincial</h3>
                <p className="text-blue-700 mt-3 text-xl">
                    Este es el resumen académico de los institutos de <strong>{provincia.descripcion}</strong> del año {yearSelectedData?.anio || 'N/A'}.
                    Como supervisor provincial, usted tiene acceso únicamente a los datos de su provincia.
                </p>
                <p className="text-blue-600 mt-3 text-lg">
                    Total de institutos de {provincia.descripcion}: <strong>{totalRecordsCount}</strong>
                </p>
            </div>
        </SupervisorLayout>
    );
}
