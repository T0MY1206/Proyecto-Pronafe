import { Head } from "@inertiajs/react";
import { InstitutoLayout } from "@/layouts/InstitutoLayout";
import { useState } from 'react';
import InstitutoDetailsCUE from "@/components/modals/InstitutoDetailsCUE";

export default function DashboardIndex(props: any) {
    const { dashboardData } = props;
    const { instituto, periodoActual, datosHistoricos } = dashboardData || {};
    
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedInstituto, setSelectedInstituto] = useState<any>(null);
    const [selectedDato, setSelectedDato] = useState<any>(null);
    
    // Debug para verificar los datos
    console.log('Dashboard data:', { instituto, periodoActual, datosHistoricos });
    console.log('Datos con estado_id:', datosHistoricos?.map(d => ({ anio: d.anio, estado_id: d.estado_id })));
    console.log('Autoridades del instituto:', instituto?.autoridades);
    
    // Función para obtener la autoridad principal (Director, Rector, etc.)
    const getAutoridadPrincipal = () => {
        if (!instituto?.autoridades || instituto.autoridades.length === 0) {
            return null;
        }
        
        // Buscar por orden de prioridad: Director, Rector, Coordinador, etc.
        const prioridades = ['director', 'rector', 'coordinador', 'responsable'];
        
        for (const prioridad of prioridades) {
            const autoridad = instituto.autoridades.find((auth: any) => 
                auth.cargo?.descripcion?.toLowerCase().includes(prioridad)
            );
            if (autoridad) return autoridad;
        }
        
        // Si no encuentra ninguna con prioridad, devolver la primera
        return instituto.autoridades[0];
    };
    
    const autoridadPrincipal = getAutoridadPrincipal();
    
    const handleVerDetalles = (dato: any) => {
        setSelectedInstituto(instituto);
        setSelectedDato(dato);
        setShowDetailsModal(true);
    };
    
    return (
        <InstitutoLayout>
            <Head>
                <title>Detalles de Instituto</title>
            </Head>
            
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">{instituto?.nombre || 'Instituto'}</h1>
                    <p className="text-lg text-gray-600 mt-2">CUE: {instituto?.cue_editable || 'N/A'}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Autoridad a Cargo</h3>
                        {autoridadPrincipal ? (
                            <>
                                <p className="text-xl text-blue-600 font-bold">{autoridadPrincipal.nombre_apellido}</p>
                                <p className="text-sm text-gray-500">{autoridadPrincipal.cargo?.descripcion || 'Cargo no especificado'}</p>
                            </>
                        ) : (
                            <>
                                <p className="text-xl text-blue-600 font-bold">No asignada</p>
                                <p className="text-sm text-gray-500">Sin autoridad registrada</p>
                            </>
                        )}
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Período Actual</h3>
                        <p className="text-xl text-green-600 font-bold">{periodoActual?.anio || 'N/A'}</p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Datos Históricos</h3>
                        <p className="text-xl text-purple-600 font-bold">{datosHistoricos?.length || 0} años</p>
                    </div>
                </div>

                {datosHistoricos && datosHistoricos.length > 0 && (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800">Historial de Datos</h2>
                        </div>
                        <div className="p-6">
                            {/* Tabla simple sin componente Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Año</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">1° Año</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">2° Año</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">3° Año</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Egresados</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {datosHistoricos.map((dato: any) => (
                                            <tr key={dato.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {dato.anio}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {dato.cantidad_anio_1 || 0}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {dato.cantidad_anio_2 || 0}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {dato.cantidad_anio_3 || 0}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {dato.cantidad_egresados || 0}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        dato.estado_id === 1 ? 'bg-yellow-100 text-yellow-800' : //Pendiente (Borrador)
                                                        dato.estado_id === 2 ? 'bg-blue-100 text-blue-800' : // Enviado                                                        
                                                        dato.estado_id === 3 ? 'bg-green-100 text-green-800' : // Aprobado
                                                        'bg-red-100 text-red-800' // Rechazado
                                                    }`}>
                                                        {dato.estado_id === 1 ? 'Guardado como Borrador' :
                                                         dato.estado_id === 2 ? 'Enviado' :
                                                         dato.estado_id === 3 ? 'Aprobado' :
                                                        'Rechazado' // Si no es 1 2 o 3 , tiene que ser 4 (Rechazado)
                                                        }
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() => handleVerDetalles(dato)}
                                                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                    >
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                        </svg>
                                                        Ver Detalles
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal de Detalle del Instituto */}
            <InstitutoDetailsCUE
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                instituto={selectedInstituto}
                datoEspecifico={selectedDato}
            />
        </InstitutoLayout>
    );
}
