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
                            <div className="overflow-x-auto">
                                <table className="table table-report">
                                    <thead>
                                        <tr>
                                            <th>Año</th>
                                            <th>1° Año</th>
                                            <th>2° Año</th>
                                            <th>3° Año</th>
                                            <th>Egresados</th>
                                            <th>Estado</th>
                                            <th>Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {datosHistoricos.map((dato: any) => (
                                            <tr key={dato.id}>
                                                <td className="font-medium">
                                                    {dato.anio}
                                                </td>
                                                <td>{dato.cantidad_anio_1 || 0}</td>
                                                <td>{dato.cantidad_anio_2 || 0}</td>
                                                <td>{dato.cantidad_anio_3 || 0}</td>
                                                <td>{dato.cantidad_egresados || 0}</td>
                                                <td>
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        dato.estado_id === 1 ? 'bg-yellow-100 text-yellow-800' :
                                                        dato.estado_id === 2 ? 'bg-blue-100 text-blue-800' :
                                                        dato.estado_id === 3 ? 'bg-green-100 text-green-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {dato.estado_id === 1 ? 'Guardado como Borrador' :
                                                         dato.estado_id === 2 ? 'Enviado' :
                                                         dato.estado_id === 3 ? 'Aprobado' :
                                                        'Rechazado'
                                                        }
                                                    </span>
                                                </td>
                                                <td className="table-report__action">
                                                    <button
                                                        onClick={() => handleVerDetalles(dato)}
                                                        className="btn btn-sm btn-primary"
                                                    >
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
