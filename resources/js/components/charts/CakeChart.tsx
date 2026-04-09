import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export interface ChartDataItem {
    label: string;
    percentage: number;
    value?: number;
    color: string;
}

export interface CakeChartProps {
    title: string;
    totalValue: number;
    chartData: ChartDataItem[];
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

                const labels = chartData.map((item) => item.label);
                const dataValues = chartData.map((item) => item.percentage);
                const backgroundColors = chartData.map((item) => item.color);

                chartInstance.current = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels,
                        datasets: [
                            {
                                data: dataValues,
                                hoverOffset: 4,
                                borderWidth: 2,
                                backgroundColor: backgroundColors,
                                borderColor: '#f8fafc',
                                hoverBorderColor: '#f8fafc',
                            },
                        ],
                    },
                    options: {
                        cutout: '78%',
                        plugins: {
                            legend: {
                                display: false,
                            },
                            tooltip: {
                                callbacks: {
                                    label(context) {
                                        let label = context.label || '';
                                        if (label) {
                                            label += ': ';
                                        }
                                        if (context.parsed !== null) {
                                            label += context.parsed + '%';
                                        }
                                        return label;
                                    },
                                },
                            },
                        },
                        events: [],
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
    }, [chartData]);

    return (
        <div className="flex h-full min-h-[380px] flex-col justify-center rounded-2xl border border-slate-400/45 bg-slate-200/95 p-6 shadow-md shadow-slate-600/10">
            <h2 className="text-center text-lg font-semibold tracking-tight text-slate-800 sm:text-xl">
                {title}
            </h2>
            <div className="mt-4 flex flex-1 flex-col">
                <div className="relative mx-auto h-[165px] w-[165px] shrink-0">
                    <canvas ref={canvasRef} id="report-donut-chart-3" className="mt-2" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-xl font-semibold text-slate-900 2xl:text-2xl">
                            {totalValue.toLocaleString()}
                        </div>
                        <div className="mt-0.5 text-xs font-medium text-slate-500 sm:text-sm">
                            Total registros
                        </div>
                    </div>
                </div>
                <div className="mx-auto mt-6 w-full max-w-xs space-y-3">
                    {chartData.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 text-sm">
                            <span
                                className="h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="min-w-0 flex-1 truncate font-medium text-slate-700">
                                {item.label}
                            </span>
                            <span className="shrink-0 font-semibold tabular-nums text-slate-900">
                                {item.percentage}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
