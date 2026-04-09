import { useEffect } from 'react';

interface InstituteData {
    cue: string;
    nombre: string;
    telefono: string;
    email: string;
}

interface AuthorityData {
    nombre_apellido: string;
    telefono: string;
    email: string;
    cargo_descripcion: string;
    tipo_autoridad: string;
}

interface ActualizacionData {
    instituto: InstituteData;
    autoridades_instituto: AuthorityData[];
    autoridades_carrera: AuthorityData[];
    observaciones: string;
    anio: number;
    filtros: {
        cue: string;
        anio: number;
    };
}

interface ActualizacionDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: ActualizacionData | null;
}

export default function ActualizacionDetailsModal({ isOpen, onClose, data }: ActualizacionDetailsModalProps) {
    useEffect(() => {
        if (!data) return;
        if (isOpen) {
            // Ocultar la navegación cuando el modal está abierto
            const topBar = document.querySelector('.top-bar');
            const sideNav = document.querySelector('.side-nav');
            
            if (topBar) {
                (topBar as HTMLElement).style.display = 'none';
            }
            if (sideNav) {
                (sideNav as HTMLElement).style.display = 'none';
            }
        } else {
            // Mostrar la navegación cuando el modal se cierra
            const topBar = document.querySelector('.top-bar');
            const sideNav = document.querySelector('.side-nav');
            
            if (topBar) {
                (topBar as HTMLElement).style.display = '';
            }
            if (sideNav) {
                (sideNav as HTMLElement).style.display = '';
            }
        }

        // Cleanup function para restaurar la navegación si el componente se desmonta
        return () => {
            const topBar = document.querySelector('.top-bar');
            const sideNav = document.querySelector('.side-nav');
            
            if (topBar) {
                (topBar as HTMLElement).style.display = '';
            }
            if (sideNav) {
                (sideNav as HTMLElement).style.display = '';
            }
        };
    }, [isOpen, data]);

    if (!data) return null;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Detalles de Actualización - {data.instituto.nombre}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                       <div className="p-6">
                           {/* Header */}
                           <div className="border-b border-gray-200 pb-4 mb-6">
                               <p className="text-gray-700">CUE: {data.instituto.cue} - Año: {data.anio}</p>
                           </div>

                    {/* Información del Instituto */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Información del Instituto</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Teléfono */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                <input
                                    type="text"
                                    value={data.instituto?.telefono || 'No disponible'}
                                    readOnly
                                    className="border border-gray-300 rounded px-3 py-2 bg-gray-50 text-gray-800 text-sm"
                                />
                            </div>

                            {/* Email */}
                            <div className="flex flex-col">
                                <label className="text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={data.instituto?.email || 'No disponible'}
                                    readOnly
                                    className="border border-gray-300 rounded px-3 py-2 bg-gray-50 text-gray-800 text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Autoridades del Instituto */}
                        {data.autoridades_instituto.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Autoridad Institucional</h3>
                                <div className="space-y-4">
                                    {data.autoridades_instituto.map((auth, index) => (
                                        <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                {/* Nombre */}
                                                <div className="flex flex-col">
                                                    <label className="text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                                    <input
                                                        type="text"
                                                        value={auth.nombre_apellido || 'No disponible'}
                                                        readOnly
                                                        className="border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 text-sm"
                                                    />
                                                </div>

                                                {/* Cargo */}
                                                <div className="flex flex-col">
                                                    <label className="text-sm font-medium text-gray-700 mb-1">Cargo</label>
                                                    <input
                                                        type="text"
                                                        value={auth.cargo_descripcion || 'No disponible'}
                                                        readOnly
                                                        className="border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 text-sm"
                                                    />
                                                </div>

                                                {/* Teléfono */}
                                                <div className="flex flex-col">
                                                    <label className="text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                                    <input
                                                        type="text"
                                                        value={auth.telefono || 'No disponible'}
                                                        readOnly
                                                        className="border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 text-sm"
                                                    />
                                                </div>

                                                {/* Email */}
                                                <div className="flex flex-col">
                                                    <label className="text-sm font-medium text-gray-700 mb-1">Email</label>
                                                    <input
                                                        type="email"
                                                        value={auth.email || 'No disponible'}
                                                        readOnly
                                                        className="border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Autoridades de Carrera */}
                        {data.autoridades_carrera.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Autoridad de la Carrera</h3>
                                <div className="space-y-4">
                                    {data.autoridades_carrera.map((auth, index) => (
                                        <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                {/* Nombre */}
                                                <div className="flex flex-col">
                                                    <label className="text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                                    <input
                                                        type="text"
                                                        value={auth.nombre_apellido || 'No disponible'}
                                                        readOnly
                                                        className="border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 text-sm"
                                                    />
                                                </div>

                                                {/* Cargo */}
                                                <div className="flex flex-col">
                                                    <label className="text-sm font-medium text-gray-700 mb-1">Cargo</label>
                                                    <input
                                                        type="text"
                                                        value={auth.cargo_descripcion || 'No disponible'}
                                                        readOnly
                                                        className="border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 text-sm"
                                                    />
                                                </div>

                                                {/* Teléfono */}
                                                <div className="flex flex-col">
                                                    <label className="text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                                    <input
                                                        type="text"
                                                        value={auth.telefono || 'No disponible'}
                                                        readOnly
                                                        className="border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 text-sm"
                                                    />
                                                </div>

                                                {/* Email */}
                                                <div className="flex flex-col">
                                                    <label className="text-sm font-medium text-gray-700 mb-1">Email</label>
                                                    <input
                                                        type="email"
                                                        value={auth.email || 'No disponible'}
                                                        readOnly
                                                        className="border border-gray-300 rounded px-3 py-2 bg-white text-gray-800 text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Observaciones */}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Comentarios</h3>
                        <textarea
                            value={data.observaciones || 'Sin comentarios'}
                            readOnly
                            rows={4}
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 text-gray-800 resize-none text-sm"
                        />
                    </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}
