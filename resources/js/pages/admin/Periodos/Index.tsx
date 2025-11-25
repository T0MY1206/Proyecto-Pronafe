import { AdminLayout } from "@/layouts/AdminLayout";
import { Head, Link } from "@inertiajs/react";

interface Periodo {
    anio: number;
    fecha_matriculados: string;
    fecha_1_egresados: string;
    fecha_2_egresados: string;
    fecha_tope: string;
    activo: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    periodos: Periodo[];
}

export default function PeriodosIndex({ periodos }: Props) {
    return (
        <AdminLayout>
            <Head title="Gestión de Períodos" />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900">Gestión de Períodos</h1>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Administra los períodos de actualización de datos
                                    </p>
                                </div>
                                <Link
                                    href={route('admin.periodos.create')}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    + Nuevo Período
                                </Link>
                            </div>

                            {/* Lista de períodos */}
                            <div className="space-y-4">
                                {periodos.length === 0 ? (
                                    <div className="text-center py-12">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay períodos</h3>
                                        <p className="mt-1 text-sm text-gray-500">Comienza creando un nuevo período de actualización.</p>
                                    </div>
                                ) : (
                                    periodos.map((periodo) => (
                                        <div
                                            key={periodo.anio}
                                            className={`border rounded-lg p-4 ${
                                                periodo.activo 
                                                    ? 'border-green-200 bg-green-50' 
                                                    : 'border-gray-200 bg-white'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex-shrink-0">
                                                        {periodo.activo ? (
                                                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                                        ) : (
                                                            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="text-lg font-medium text-gray-900">
                                                            Período {periodo.anio}
                                                            {(periodo.activo === 1) && 
                                                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                    Activo
                                                                </span>
                                                            }
                                                        </h3>
                                                        <div className="mt-1 text-sm text-gray-500">
                                                            <p>Matriculados: {new Date(periodo.fecha_matriculados).toLocaleDateString('es-ES')}</p>
                                                            <p>Egresados Desde: {new Date(periodo.fecha_1_egresados).toLocaleDateString('es-ES')}</p>
                                                            <p>Egresados Hasta: {new Date(periodo.fecha_2_egresados).toLocaleDateString('es-ES')}</p>
                                                            <p>Tope de Entrega: {new Date(periodo.fecha_tope).toLocaleDateString('es-ES')}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex space-x-2">
                                                    {!periodo.activo && (
                                                        <Link
                                                            href={route('admin.periodos.activar', periodo.anio)}
                                                            method="post"
                                                            className="text-green-600 hover:text-green-900 text-sm font-medium mr-2"
                                                        >
                                                            Activar
                                                        </Link>
                                                    )}
                                                    <Link
                                                        href={route('admin.periodos.edit', periodo.anio)}
                                                        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                                                    >
                                                        Editar
                                                    </Link>
                                                    <Link
                                                        href={route('admin.periodos.destroy', periodo.anio)}
                                                        method="delete"
                                                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                                                        confirm="¿Estás seguro de que quieres eliminar este período?"
                                                    >
                                                        Eliminar
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
