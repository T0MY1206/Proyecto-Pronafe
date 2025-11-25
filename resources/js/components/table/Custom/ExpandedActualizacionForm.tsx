import React, { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import Modal from '@/components/modals/Modal'; 

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

interface ExpandedData {
    data: {  //  anide un data dentro de otro porque desde el conbtroller viene en el paquete de data los demas datos
        instituto: InstituteData;
        autoridades_instituto: AuthorityData[];
        autoridades_carrera: AuthorityData[];
        observaciones: string;
        anio: number;
        filtros: {
            cue: string;
            anio: number;
        };
        id: number; 
        estado_id;
    }
}

interface ExpandedRowFormProps {
    isOpen?: boolean;
    onClose?: () => void;
    data: ExpandedData;
    showActions?: boolean;
    onAceptar?: (data: ExpandedData) => Promise<void>;
    onRechazar?: (data: ExpandedData) => Promise<void>;
    hideButtons?: boolean;
}

const ExpandedRowForm: React.FC<ExpandedRowFormProps> = ({
    isOpen = false,
    onClose,
    data,
    showActions = false,
    onRechazar,
}) => {
    console.log(data)
    if (!data || !data.data || !data.data.instituto) {
        return <div>Cargando...</div>;
    }

    const { props: { errors } } = usePage(); // Para manejar errores de Inertia/Laravel
    
    // Estados internos para la secuencia de 3 modales
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [isRejectionFormOpen, setIsRejectionFormOpen] = useState(false);
    const [actionToConfirm, setActionToConfirm] = useState(null); // 'Aceptar' o 'Rechazar'
    const [rejectionReason, setRejectionReason] = useState('');
    const [hideButtons, setHideButtons] = useState<boolean>(false);


    useEffect(() => {
        setHideButtons(data.data.estado_id !== 2)
    }, [data])

    // Función para iniciar la confirmación
    const handleActionClick = (action) => {
        setActionToConfirm(action);
        setIsConfirmOpen(true); // Abre Modal 2
    };
    const datoId = data.data.id;
    const executePatch = (targetEstadoId: number, reason: string | null = null) => {
        router.patch(route('supervisor.datos.update', { dato: datoId, estado: targetEstadoId }), {
            motivo_rechazo: reason,
        }, {
            onSuccess: () => {
                if (onClose) onClose(); // Cierra el modal principal al tener éxito
            }, 
            onError: (err) => {
                console.error("Error en la actualización:", err);
            }
        });
    };

    // Lógica de Confirmación (Modal 2)
    const handleFinalConfirmation = (confirmed) => {
        setIsConfirmOpen(false); // Cierra Modal 2

        if (!confirmed) {
            return;
        }
        
        if (actionToConfirm === 'Rechazar') {
            // Si confirma rechazo pasa al Modal 3
            setIsRejectionFormOpen(true);
        } else {
            // Si confirma aceptar, ejecuta inmediatamente
            setHideButtons(true);
            executePatch(3); // 3 es el ID para Aceptado
        }
    };
    
    // Envío del Formulario de Rechazo (Modal 3)
    const handleSendRejection = () => {
        if (!rejectionReason.trim()) {
            alert('Por favor, ingrese un motivo de rechazo.');
            return;
        }

        setHideButtons(true);
        setIsRejectionFormOpen(false); // Cierra Modal 3
        executePatch(4, rejectionReason); // 4 es el ID para Rechazado
    };


    return (
        <>
            {/* Contenido del Modal */}
            <Modal  title={data.data.instituto.nombre} onClose={onClose} >
                <div className="flex flex-col space-y-6">
                    {/*INFORMACIÓN DEL INSTITUTO */}
                    <div className="space-y-4 ">
                        <p className="text-gray-700 ">CUE: {data.data.instituto.cue} - Año: {data.data.anio}</p>
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                            Información de Contacto del Instituto
                        </h3>
                        <div className="space-y-4">

                            {/*Teléfono */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Teléfono: </label>
                                <input
                                    type="text"
                                    value={data.data.instituto?.telefono || 'No disponible'}
                                    readOnly
                                    className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded cursor-default w-full"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Email: </label>
                                <input
                                    type="email"
                                    value={data.data.instituto?.email || 'No disponible'}
                                    readOnly
                                    className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded cursor-default w-full"
                                />
                            </div>
                        </div>
                    </div>
                    {/* AUTORIDADES INSTITUCIONALES  */}
                    {data.data.autoridades_instituto.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                                Autoridad Institucional
                            </h3>
                            {data.data.autoridades_instituto.map((auth, index) => (
                                <div key={index} className="space-y-4 pt-3 border-t first:border-t-0">
                                    {/* Nombre */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">Nombre: </label>
                                        <input
                                            type="text"
                                            value={auth.nombre_apellido || 'No disponible'}
                                            readOnly
                                            className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded cursor-default w-full"
                                        />
                                    </div>
                                    {/* Cargo */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">Cargo: </label>
                                        <input
                                            type="text"
                                            value={auth.cargo_descripcion || 'No disponible'}
                                            readOnly
                                            className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded cursor-default w-full"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {/* AUTORIDADES DE CARRERA */}
                    {data.data.autoridades_carrera.length > 0 && (
                        <div className="space-y-4 ">
                            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
                                Autoridad de la carrera
                            </h3>

                            {data.data.autoridades_carrera.map((auth, index) => (
                                <div key={index} className="space-y-4 pt-3 border-t first:border-t-0">

                                    {/* Nombre */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">Nombre: </label>
                                        <input
                                            type="text"
                                            value={auth.nombre_apellido || 'No disponible'}
                                            readOnly
                                            className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded cursor-default w-full"
                                        />
                                    </div>

                                    {/* Cargo */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">Cargo: </label>
                                        <input
                                            type="text"
                                            value={auth.cargo_descripcion || 'No disponible'}
                                            readOnly
                                            className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded cursor-default w-full"
                                        />
                                    </div>

                                    {/* Teléfono */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">Teléfono: </label>
                                        <input
                                            type="text"
                                            value={auth.telefono || 'No disponible'}
                                            readOnly
                                            className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded cursor-default w-full"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600">Email: </label>
                                        <input
                                            type="email"
                                            value={auth.email || 'No disponible'}
                                            readOnly
                                            className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded cursor-default w-full"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {/*  OBSERVACIONES*/}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Comentarios</h3>
                        <textarea
                            value={data.data.observaciones}
                            readOnly
                            rows={4}
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 text-gray-800 resize-none text-sm cursor-default"
                        />
                    </div>
                    {/* BOTONES ACEPTAR/RECHAZAR (Footer) */}
                    {showActions && (
                        <div className="flex border-t border-gray-200 pt-4 justify-end gap-4">
                            {
                                !hideButtons &&
                                <>
                                    <button
                                        onClick={() => handleActionClick('Aprobar')}
                                        className="px-8 py-2 rounded-md text-lg transition-colors bg-green-700! text-white! hover:bg-green-800! cursor-pointer! opacity-90"
                                    >
                                        Aprobar
                                    </button>
                                    <button
                                        onClick={() => handleActionClick('Rechazar')} 
                                        className="px-8 py-2 rounded-md text-lg transition-colors bg-red-600! text-white! hover:bg-red-700! cursor-pointer"
                                    >
                                        Rechazar
                                    </button>
                                </>
                            }
                        </div>
                    )}
                </div>
            </Modal>

            {/* MODAL 2: Confirmación */}
            {isConfirmOpen && (
                <Modal title="Confirmar Operación" onClose={() => setIsConfirmOpen(false)}>
                    <p>¿Está seguro de realizar la operación de {actionToConfirm}?</p>
                    <div className="mt-4 flex gap-2">
                        <button onClick={() => handleFinalConfirmation(true)} className="px-3 py-1 bg-blue-500! text-white! rounded">Sí</button>
                        <button onClick={() => handleFinalConfirmation(false)} className="px-3 py-1 bg-gray-300! rounded">No</button>
                    </div>
                </Modal>
            )}
            
            {/* MODAL 3: Justificación de Rechazo */}
            {isRejectionFormOpen && (
                <Modal title="Justificación de Rechazo" onClose={() => setIsRejectionFormOpen(false)}>
                    <p className="mb-2">Escriba el motivo de rechazo que se enviará por correo electrónico:</p>
                    
                    {errors.motivo_rechazo && <p className="text-red-500! text-sm mb-2">{errors.motivo_rechazo}</p>}

                    <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="w-full p-2 border rounded-lg h-32 mb-4 font-mono"
                        placeholder="Motivo de rechazo..."
                    />
                    <button 
                        onClick={handleSendRejection} 
                        className="w-full bg-red-500! hover:bg-red-700! text-white font-bold py-2 px-4 rounded"
                    >
                        Enviar Rechazo y Notificar
                    </button>
                </Modal>
            )}
        </>
    );
};

export default ExpandedRowForm;
