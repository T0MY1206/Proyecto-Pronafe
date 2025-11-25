import { AdminLayout } from '@/layouts/AdminLayout';
import AppLayoutTitle from "@/components/layouts/AppLayoutTitle";
import { usePage, Head } from '@inertiajs/react';
import Target from "@/components/cards/Traget";
import CakeGraphics, { ChartDataItem } from "@/components/charts/CakeChart";

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
    // Agregar las nuevas propiedades
    countPendientes: number;
    countEnviados: number;
    countAprobados: number;
    countRechazados: number;
    totalGeneral: number;
}
export default function DashboardIndex() {
    // Datos de Inertia
    const props = usePage().props;
    const initialData = props.initialData as DashboardData;
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
    percentageByState,
    // Agregar las nuevas propiedades
    countPendientes,
    countAprobados,
    totalGeneral
} = initialData;

    // Datos del gráfico torta -- ESTADO 1 == APROBADO
    const chartDataForCakeGraphics: ChartDataItem[] = Object.entries(percentageByState ?? {}).map(
        ([estado, percentage]) => {
            let label = `Estado ${estado}`;
            let color = "#000000ff";
            switch (parseInt(estado)) {
                default: label = "Pendiente"; color = "#dbdf14ff"; break;
                case 1: label = "Recibido"; color = "#058dfcff"; break;
            }
            return { label, percentage: percentage as number, color };
        }
    );

    return (
        <AdminLayout>
            <Head>
                <title>Reporte Académico</title>
            </Head>
            
            {/* TÍTULO DEL DASHBOARD */}
           <div className="rounded-lg m-2">
    <div className="flex items-end gap-6 w-full">
        <h1 className="text-3xl font-bold text-gray-900">
            Reporte Académico- Año {yearSelectedData?.anio || 'N/A'}
        </h1>
    </div>
</div>

            {/* REPORTES Y GRÁFICOS - SIEMPRE VISIBLES */}
            <div className="m-4">
                <p className="text-xl text-gray-600 mb-4">
                    Vista general del último año disponible.
                </p>
            </div>

            <div className="flex justify-center gap-5 items-stretch">
                <div className="bg-transparent p-3 flex flex-col h-full w-auto">
                    <CakeGraphics
                        title="Estado de formularios"
                        chartData={chartDataForCakeGraphics}
                        totalValue={totalRecordsCount}
                    />
                </div>

                <div className="col-md-6 bg-transparent d-flex p-3">
                  {/*   <h1 className="font-bold text-2xl">
                        Resumen {yearSelectedData?.anio || 'N/A'}
                    </h1> */}
                    
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
                <h3 className="font-bold text-blue-800 text-xl">📊 IMPORTANTE</h3>
                <p className="text-blue-700 mt-3 text-xl">
                Este es un resumen académico del año {yearSelectedData?.anio || 'N/A'}. Para filtros avanzados y otros años,
                visita la sección Actualizaciones en el menú lateral. Allí podrá ver la tabla detallada de
                cada instituto.
                </p>
                
                <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded">
                        <p className="text-sm text-gray-600">En este dashboard:</p>
                      <p className="text-lg font-bold text-blue-800">
                        Pendientes: {countPendientes} | Enviados: {countAprobados}
                    </p>
                </div>
          {/*      <div className="bg-white p-3 rounded">
                    <p className="text-sm text-gray-600">Ya procesados:</p>
                    <p className="text-lg font-bold">
                        <span className="text-green-700">Aprobados: {countAprobados}</span> | <span className="text-red-600">Rechazados: {countRechazados}</span>
                    </p>
                </div> */}
                </div>
                
              <p className="text-blue-600 mt-3 text-lg font-bold">
                    Total general de institutos: <strong>{totalGeneral}</strong>
               </p>
            </div>
        </AdminLayout>
    );
}
