import { AdminLayout } from '@/layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Periodo {
    id: number;
    anio: number;
    fecha_matriculados: string;
    fecha_1_egresados: string;
    fecha_2_egresados: string;
    fecha_tope: string;
    activo: boolean;
    created_at: string;
    updated_at: string;
}

interface EditProps {
    periodo: Periodo;
}

export default function Edit({ periodo }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        anio: periodo.anio,
        fecha_matriculados: periodo.fecha_matriculados,
        fecha_1_egresados: periodo.fecha_1_egresados,
        fecha_2_egresados: periodo.fecha_2_egresados,
        fecha_tope: periodo.fecha_tope
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('admin.periodos.update', periodo.id));
    };

    return (
        <AdminLayout>
            <Head title="Editar Período de Actualización" />
            
            <div className="intro-y flex items-center mt-8">
                <h2 className="text-lg font-medium mr-auto">Editar Período de Actualización</h2>
            </div>

            <div className="intro-y box mt-5">
                <div className="p-5">
                    <form onSubmit={submit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="anio" className="form-label">Año</label>
                                <input
                                    id="anio"
                                    type="number"
                                    className="form-control"
                                    value={data.anio}
                                    onChange={(e) => setData('anio', parseInt(e.target.value))}
                                    required
                                />
                                {errors.anio && <div className="text-theme-6 mt-2">{errors.anio}</div>}
                            </div>

                            <div>
                                <label htmlFor="fecha_matriculados" className="form-label">Fecha Matriculados</label>
                                <input
                                    id="fecha_matriculados"
                                    type="date"
                                    className="form-control"
                                    value={data.fecha_matriculados}
                                    onChange={(e) => setData('fecha_matriculados', e.target.value)}
                                    required
                                />
                                {errors.fecha_matriculados && <div className="text-theme-6 mt-2">{errors.fecha_matriculados}</div>}
                            </div>

                            <div>
                                <label htmlFor="fecha_1_egresados" className="form-label">Fecha 1° Egresados</label>
                                <input
                                    id="fecha_1_egresados"
                                    type="date"
                                    className="form-control"
                                    value={data.fecha_1_egresados}
                                    onChange={(e) => setData('fecha_1_egresados', e.target.value)}
                                    required
                                />
                                {errors.fecha_1_egresados && <div className="text-theme-6 mt-2">{errors.fecha_1_egresados}</div>}
                            </div>

                            <div>
                                <label htmlFor="fecha_2_egresados" className="form-label">Fecha 2° Egresados</label>
                                <input
                                    id="fecha_2_egresados"
                                    type="date"
                                    className="form-control"
                                    value={data.fecha_2_egresados}
                                    onChange={(e) => setData('fecha_2_egresados', e.target.value)}
                                    required
                                />
                                {errors.fecha_2_egresados && <div className="text-theme-6 mt-2">{errors.fecha_2_egresados}</div>}
                            </div>

                            <div>
                                <label htmlFor="fecha_tope" className="form-label">Fecha Tope</label>
                                <input
                                    id="fecha_tope"
                                    type="date"
                                    className="form-control"
                                    value={data.fecha_tope}
                                    onChange={(e) => setData('fecha_tope', e.target.value)}
                                    required
                                />
                                {errors.fecha_tope && <div className="text-theme-6 mt-2">{errors.fecha_tope}</div>}
                            </div>
                        </div>

                        <div className="text-right mt-5">
                            <button
                                type="button"
                                className="btn btn-outline-secondary w-24 mr-1"
                                onClick={() => window.history.back()}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary w-24"
                                disabled={processing}
                            >
                                {processing ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
