import { SupervisorLayout } from '@/layouts/SupervisorLayout';
import AppLayoutTitle from '@/components/layouts/AppLayoutTitle';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

interface Formulario {
    id: number;
    cue: string;
    anio: number;
    estado: {
        id: number;
        descripcion: string;
    };
    instituto: {
        nombre: string;
        cue: string;
        telefono: string;
        email: string;
        localidad: {
            descripcion: string;
            provincia: {
                descripcion: string;
            };
        };
    };
    // Datos académicos
    cantidad_docentes_carrera: number;
    cantidad_docentes_practica: number;
    cantidad_anio_1: number;
    cantidad_anio_2: number;
    cantidad_anio_3: number;
    cantidad_egresados: number;
    observaciones: string;
    created_at: string;
    updated_at: string;
}

interface ShowProps {
    formulario: Formulario;
}

export default function Show({ formulario }: ShowProps) {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [actionType, setActionType] = useState<'aprobar' | 'rechazar' | null>(null);
    const [comentario, setComentario] = useState('');

    const handleAprobar = () => {
        setActionType('aprobar');
        setShowConfirmModal(true);
    };

    const handleRechazar = () => {
        setActionType('rechazar');
        setShowConfirmModal(true);
    };

    const confirmAction = () => {
        if (!actionType) return;

        const url = actionType === 'aprobar' 
            ? route('supervisor.formularios.aprobar', formulario.id)
            : route('supervisor.formularios.rechazar', formulario.id);

        // Crear formulario para enviar
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = url;
        form.style.display = 'none';

        // Agregar token CSRF
        const csrfToken = (window as any).Laravel?.csrfToken || 
                         document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        
        if (csrfToken) {
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = '_token';
            csrfInput.value = csrfToken;
            form.appendChild(csrfInput);
        }

        // Si es rechazo, agregar comentario
        if (actionType === 'rechazar' && comentario) {
            const comentarioInput = document.createElement('input');
            comentarioInput.type = 'hidden';
            comentarioInput.name = 'comentario';
            comentarioInput.value = comentario;
            form.appendChild(comentarioInput);
        }

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    };

    return (
        <SupervisorLayout>
            <Head>
                <title>Formulario - {formulario.instituto?.nombre || 'Instituto'}</title>
            </Head>
            
            <div className="grid grid-cols-12 gap-6 mt-2">
                <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
                    <AppLayoutTitle title={`Formulario - ${formulario.instituto?.nombre || 'Instituto'}`} />
                    <div className="ml-auto">
                        <Link
                            href={route('supervisor.formularios.index')}
                            className="btn btn-secondary"
                        >
                            ← Volver a Formularios
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="intro-y col-span-12">
                    <div className="intro-y box p-5">
                        {/* Información del Instituto */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-4">Información del Instituto</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="form-label">Nombre</label>
                                    <input
                                        type="text"
                                        value={formulario.instituto?.nombre || 'No disponible'}
                                        readOnly
                                        className="form-control"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">CUE</label>
                                    <input
                                        type="text"
                                        value={formulario.cue}
                                        readOnly
                                        className="form-control"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Teléfono</label>
                                    <input
                                        type="text"
                                        value={formulario.instituto?.telefono || 'No disponible'}
                                        readOnly
                                        className="form-control"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        value={formulario.instituto?.email || 'No disponible'}
                                        readOnly
                                        className="form-control"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Provincia</label>
                                    <input
                                        type="text"
                                        value={formulario.instituto?.localidad?.provincia?.descripcion || 'No disponible'}
                                        readOnly
                                        className="form-control"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Localidad</label>
                                    <input
                                        type="text"
                                        value={formulario.instituto?.localidad?.descripcion || 'No disponible'}
                                        readOnly
                                        className="form-control"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Datos Académicos */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-4">Datos Académicos - Año {formulario.anio}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <label className="form-label">Docentes de Carrera</label>
                                    <input
                                        type="number"
                                        value={formulario.cantidad_docentes_carrera}
                                        readOnly
                                        className="form-control"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Docentes de Práctica</label>
                                    <input
                                        type="number"
                                        value={formulario.cantidad_docentes_practica}
                                        readOnly
                                        className="form-control"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">1er Año</label>
                                    <input
                                        type="number"
                                        value={formulario.cantidad_anio_1}
                                        readOnly
                                        className="form-control"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">2do Año</label>
                                    <input
                                        type="number"
                                        value={formulario.cantidad_anio_2}
                                        readOnly
                                        className="form-control"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">3er Año</label>
                                    <input
                                        type="number"
                                        value={formulario.cantidad_anio_3}
                                        readOnly
                                        className="form-control"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Egresados</label>
                                    <input
                                        type="number"
                                        value={formulario.cantidad_egresados}
                                        readOnly
                                        className="form-control"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Observaciones */}
                        <div className="mb-6">
                            <label className="form-label">Observaciones</label>
                            <textarea
                                value={formulario.observaciones || 'Sin observaciones'}
                                readOnly
                                rows={4}
                                className="form-control"
                            />
                        </div>

                        {/* Estado y Fechas */}
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-4">Estado y Fechas</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="form-label">Estado Actual</label>
                                    <input
                                        type="text"
                                        value={formulario.estado?.descripcion || 'No disponible'}
                                        readOnly
                                        className="form-control"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Fecha de Creación</label>
                                    <input
                                        type="text"
                                        value={new Date(formulario.created_at).toLocaleDateString()}
                                        readOnly
                                        className="form-control"
                                    />
                                </div>
                                <div>
                                    <label className="form-label">Última Actualización</label>
                                    <input
                                        type="text"
                                        value={new Date(formulario.updated_at).toLocaleDateString()}
                                        readOnly
                                        className="form-control"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Acciones */}
                        {formulario.estado?.id === 2 && ( // Solo si está enviado
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button
                                    onClick={handleRechazar}
                                    className="btn btn-danger"
                                >
                                    Rechazar Formulario
                                </button>
                                <button
                                    onClick={handleAprobar}
                                    className="btn btn-success"
                                >
                                    Aprobar Formulario
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de confirmación */}
            {showConfirmModal && actionType && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">
                            {actionType === 'aprobar' ? 'Aprobar Formulario' : 'Rechazar Formulario'}
                        </h3>
                        <p className="mb-4">
                            ¿Está seguro que desea {actionType === 'aprobar' ? 'aprobar' : 'rechazar'} el formulario de {formulario.instituto?.nombre || 'este instituto'}?
                        </p>
                        
                        {actionType === 'rechazar' && (
                            <div className="mb-4">
                                <label className="form-label">Motivo del rechazo (requerido)</label>
                                <textarea
                                    value={comentario}
                                    onChange={(e) => setComentario(e.target.value)}
                                    rows={3}
                                    className="form-control"
                                    placeholder="Ingrese el motivo del rechazo..."
                                />
                            </div>
                        )}
                        
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="btn btn-secondary"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmAction}
                                disabled={actionType === 'rechazar' && !comentario.trim()}
                                className={`btn ${actionType === 'aprobar' ? 'btn-success' : 'btn-danger'}`}
                            >
                                {actionType === 'aprobar' ? 'Aprobar' : 'Rechazar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </SupervisorLayout>
    );
}
