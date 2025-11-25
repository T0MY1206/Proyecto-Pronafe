import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';


export interface ChartDataItem {
    label: string; // Ej: 'Estado 1 (Pendiente)', 'Estado 2 (Enviado)'
    percentage: number; // Ej: 25.50
    value?: number; // El valor crudo si lo necesitas (ej: el conteo de registros para ese estado)
    color: string; // Color personalizado para el segmento del gráfico (opcional)
}

export interface CakeChartProps {
    title: string;
    totalValue: number; // El valor central que se muestra (ej: total de registros)
    chartData: ChartDataItem[]; // Array de datos para el gráfico de torta
}

export default function CakeChart({
    title,
    totalValue,
    chartData,
}: CakeChartProps) {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstance = useRef<Chart | null>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');

            if (ctx) {
                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }

                const labels = chartData.map(item => item.label);
                const dataValues = chartData.map(item => item.percentage);
                const backgroundColors = chartData.map(item => item.color);

                chartInstance.current = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: labels,
                        datasets: [{
                            data: dataValues,
                            hoverOffset: 4,
                            borderWidth: 0,
                            backgroundColor: backgroundColors,
                            borderColor: backgroundColors.map(color => color), // Asegura que el borde sea del mismo color
                            hoverBorderColor: backgroundColors.map(color => color), // Color del borde al pasar el mouse
                        }],
                    },
                    options: {
                        cutout: '80%',
                        plugins: {
                            legend: {
                                display: false,
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        let label = context.label || '';
                                        if (label) {
                                            label += ': ';
                                        }
                                        if (context.parsed !== null) {
                                            label += context.parsed + '%';
                                        }
                                        return label;
                                    }
                                }
                            }
                        },
                        events: [], // Deshabilita eventos del gráfico para que el div central sea clickeable
                    },
                });
            }
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
                chartInstance.current = null;
            }
        };
    }, [chartData]); // El gráfico se actualiza cuando chartData cambia

    return (
        <div className=" bg-blue-950/93 rounded-lg col-span-12 sm:col-span-6 md:col-span-4 border-theme-11 border-t sm:border-t-0 border-l md:border-l-0 border-dashed -ml-4 md:ml-0 p-6 h-full flex flex-col justify-center">
            <h2 className="text-white text-center text-xl font-bold ">{title}</h2>
            <div className="tab-content mt-2 h-[415px]">
                <div className="tab-pane active" id="active-users" role="tabpanel" aria-labelledby="active-users-tab">
                    <div className="relative w-[165px] h-[165px] mx-auto">
                        <canvas className="mt-8 " id="report-donut-chart-3" ref={canvasRef}></canvas>
                        <div className="flex flex-col justify-center items-center absolute w-full h-full top-0 left-0">
                            <div className="text-white text-xl 2xl:text-2xl font-medium">{totalValue.toLocaleString()}</div>
                            <div className="text-gray-500 dark:text-gray-600 mt-0.5">Total Registros</div>
                        </div>
                    </div>
                    <div className="mx-auto w-10/12 2xl:w-2/3 mt-8 ">
                        {/* Lista de ítems del gráfico dinámicos */}
                        {chartData.map((item, index) => (
                            <div key={index} className="flex items-center mt-4 h-[30px]">
                                <div className="w-2 h-2 rounded-full mr-3" style={{backgroundColor: item.color}}></div>
                                <span className="text-white truncate font-bold">{item.label}</span>
                                <div className="h-px flex-1 border border-r border-dashed border-gray-300 mx-3 xl:hidden"></div>
                                <span className="text-white font-medium xl:ml-auto font-bold">{item.percentage}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
