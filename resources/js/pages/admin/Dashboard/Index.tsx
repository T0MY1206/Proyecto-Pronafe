import { AdminLayout } from '@/layouts/AdminLayout';
import { usePage, Head } from '@inertiajs/react';
import Target from '@/components/cards/Traget';
import CakeGraphics, { ChartDataItem } from '@/components/charts/CakeChart';

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
    countPendientes: number;
    countEnviados: number;
    countAprobados: number;
    countRechazados: number;
    totalGeneral: number;
}

export default function DashboardIndex() {
    const props = usePage().props;
    const initialData = props.initialData as DashboardData;

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
        countPendientes,
        countAprobados,
        totalGeneral,
    } = initialData;

    const chartDataForCakeGraphics: ChartDataItem[] = Object.entries(percentageByState ?? {}).map(
        ([estado, percentage]) => {
            let label = `Estado ${estado}`;
            let color = '#64748b';
            switch (parseInt(estado)) {
                default:
                    label = 'Pendiente';
                    color = '#ca8a04';
                    break;
                case 1:
                    label = 'Recibido';
                    color = '#1e5bb8';
                    break;
            }
            return { label, percentage: percentage as number, color };
        },
    );

    return (
        <AdminLayout>
            <Head>
                <title>Reporte Académico</title>
            </Head>

            <div className="w-full max-w-[100rem] space-y-6 sm:space-y-8">
                <header className="rounded-2xl border border-slate-400/45 bg-slate-300/40 px-4 py-5 shadow-md shadow-slate-600/10 backdrop-blur-sm sm:px-8 sm:py-6">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        Reporte académico — año {yearSelectedData?.anio || 'N/A'}
                    </h1>
                    <p className="mt-2 max-w-2xl text-base text-slate-600">
                        Vista general del último año disponible.
                    </p>
                </header>

                <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
                    <div className="lg:col-span-5 xl:col-span-4">
                        <CakeGraphics
                            title="Estado de formularios"
                            chartData={chartDataForCakeGraphics}
                            totalValue={totalRecordsCount}
                        />
                    </div>

                    <div className="space-y-8 lg:col-span-7 xl:col-span-8">
                        <section className="space-y-3">
                            <h2 className="text-lg font-semibold text-slate-800">Total docentes carrera</h2>
                            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                                <Target title="Docentes carrera" totalValue={sumDocentesCarrera} />
                                <Target title="Docentes carrera prácticas" totalValue={sumDocentesPractica} />
                            </div>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-lg font-semibold text-slate-800">
                                Alumnos matriculados al {yearSelectedData?.fecha_matriculados || 'N/A'}
                            </h2>
                            <div className="grid gap-3 sm:grid-cols-3">
                                <Target title="1.º" totalValue={sum1Año} />
                                <Target title="2.º" totalValue={sum2Año} />
                                <Target title="3.º" totalValue={sum3Año} />
                            </div>
                        </section>

                        <section className="space-y-3">
                            <h2 className="text-lg font-semibold text-slate-800">
                                Egresados entre el {yearSelectedData?.fecha_1_egresados || 'N/A'} y el{' '}
                                {yearSelectedData?.fecha_2_egresados || 'N/A'}
                            </h2>
                            <div className="w-full max-w-full sm:max-w-md lg:max-w-lg">
                                <Target title="Total de egresados" totalValue={sumEgresados} />
                            </div>
                        </section>
                    </div>
                </div>

                <aside className="rounded-2xl border border-brand-200/60 bg-brand-50/80 px-5 py-6 shadow-sm sm:px-8">
                    <h3 className="text-lg font-semibold text-brand-900">Importante</h3>
                    <p className="mt-3 text-base leading-relaxed text-brand-900/85">
                        Este es un resumen académico del año {yearSelectedData?.anio || 'N/A'}. Para filtros
                        avanzados y otros años, visitá la sección <strong>Actualizaciones</strong> en el menú
                        lateral. Allí podés ver la tabla detallada de cada instituto.
                    </p>
                    <div className="mt-5 rounded-xl border border-slate-400/35 bg-slate-300/45 p-4 shadow-sm">
                        <p className="text-sm text-slate-700">En este panel</p>
                        <p className="mt-1 text-base font-semibold text-slate-900">
                            Pendientes: {countPendientes} · Enviados: {countAprobados}
                        </p>
                    </div>
                    <p className="mt-4 text-base font-semibold text-brand-700">
                        Total general de institutos: {totalGeneral}
                    </p>
                </aside>
            </div>
        </AdminLayout>
    );
}
