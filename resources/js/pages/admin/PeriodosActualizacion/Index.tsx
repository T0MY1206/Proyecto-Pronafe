import { AdminLayout } from '@/layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

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

interface IndexProps {
    periodos: Periodo[];
}

export default function Index({ periodos }: IndexProps) {
    return (
        <AdminLayout>
            <Head title="Períodos de Actualización" />
            
            <div className="intro-y flex items-center mt-8">
                <h2 className="text-lg font-medium mr-auto">Períodos de Actualización</h2>
                <Link
                    href={route('admin.periodos.create')}
                    className="btn btn-primary shadow-md mr-2"
                >
                    <i className="w-4 h-4 mr-2" data-feather="plus"></i>
                    Nuevo Período
                </Link>
            </div>

            <div className="intro-y box mt-5">
                <div className="p-5">
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className="border-b-2 dark:border-dark-5 whitespace-nowrap">Año</th>
                                    <th className="border-b-2 dark:border-dark-5 whitespace-nowrap">Fecha Matriculados</th>
                                    <th className="border-b-2 dark:border-dark-5 whitespace-nowrap">Fecha 1° Egresados</th>
                                    <th className="border-b-2 dark:border-dark-5 whitespace-nowrap">Fecha 2° Egresados</th>
                                    <th className="border-b-2 dark:border-dark-5 whitespace-nowrap">Fecha Tope</th>
                                    <th className="border-b-2 dark:border-dark-5 whitespace-nowrap">Estado</th>
                                    <th className="border-b-2 dark:border-dark-5 whitespace-nowrap">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {periodos.map((periodo) => (
                                    <tr key={periodo.id}>
                                        <td className="border-b dark:border-dark-5">
                                            <div className="font-medium whitespace-nowrap">{periodo.anio}</div>
                                        </td>
                                        <td className="border-b dark:border-dark-5">
                                            <div className="text-gray-600 whitespace-nowrap">
                                                {new Date(periodo.fecha_matriculados).toLocaleDateString('es-ES')}
                                            </div>
                                        </td>
                                        <td className="border-b dark:border-dark-5">
                                            <div className="text-gray-600 whitespace-nowrap">
                                                {new Date(periodo.fecha_1_egresados).toLocaleDateString('es-ES')}
                                            </div>
                                        </td>
                                        <td className="border-b dark:border-dark-5">
                                            <div className="text-gray-600 whitespace-nowrap">
                                                {new Date(periodo.fecha_2_egresados).toLocaleDateString('es-ES')}
                                            </div>
                                        </td>
                                        <td className="border-b dark:border-dark-5">
                                            <div className="text-gray-600 whitespace-nowrap">
                                                {new Date(periodo.fecha_tope).toLocaleDateString('es-ES')}
                                            </div>
                                        </td>
                                        <td className="border-b dark:border-dark-5">
                                            <div className={`flex items-center ${periodo.activo ? 'text-theme-9' : 'text-theme-6'}`}>
                                                <i className="w-4 h-4 mr-2" data-feather={periodo.activo ? 'check-circle' : 'x-circle'}></i>
                                                {periodo.activo ? 'Activo' : 'Inactivo'}
                                            </div>
                                        </td>
                                        <td className="border-b dark:border-dark-5">
                                            <div className="flex items-center">
                                                <Link
                                                    href={route('admin.periodos.edit', periodo.id)}
                                                    className="flex items-center text-theme-1 mr-3"
                                                >
                                                    <i className="w-4 h-4 mr-1" data-feather="edit-2"></i>
                                                    Editar
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
