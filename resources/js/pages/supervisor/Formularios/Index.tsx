import { SupervisorLayout } from '@/layouts/SupervisorLayout';
import AppLayoutTitle from '@/components/layouts/AppLayoutTitle';
import Table from '@/components/table/Table';
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
    };
    created_at: string;
    updated_at: string;
}

interface Estado {
    id: number;
    descripcion: string;
}

interface IndexProps {
    formularios: {
        data: Formulario[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    estados: Estado[];
    filters: {
        estado?: string;
        search?: string;
    };
}

export default function Index({ formularios, estados, filters }: IndexProps) {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [selectedFormulario, setSelectedFormulario] = useState<Formulario | null>(null);
    const [actionType, setActionType] = useState<'aprobar' | 'rechazar' | null>(null);

    const handleAprobar = (formulario: Formulario) => {
        setSelectedFormulario(formulario);
        setActionType('aprobar');
        setShowConfirmModal(true);
    };

    const handleRechazar = (formulario: Formulario) => {
        setSelectedFormulario(formulario);
        setActionType('rechazar');
        setShowConfirmModal(true);
    };

    const confirmAction = () => {
        if (!selectedFormulario || !actionType) return;

        const url = actionType === 'aprobar' 
            ? route('supervisor.formularios.aprobar', selectedFormulario.id)
            : route('supervisor.formularios.rechazar', selectedFormulario.id);

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
        if (actionType === 'rechazar') {
            const comentario = prompt('Ingrese el motivo del rechazo:');
            if (!comentario) return;

            const comentarioInput = document.createElement('input');
            comentarioInput.type = 'hidden';
            comentarioInput.name = 'comentario';
            comentarioInput.value = comentario;
            form.appendChild(comentarioInput);
        }

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);

        setShowConfirmModal(false);
        setSelectedFormulario(null);
        setActionType(null);
    };

    const tableHead = [
        { value: 'cue', label: 'CUE' },
        { value: 'instituto.nombre', label: 'Instituto' },
        { value: 'anio', label: 'Año' },
        { value: 'estado.descripcion', label: 'Estado' },
        { value: 'created_at', label: 'Fecha Creación' },
        { value: 'updated_at', label: 'Última Actualización' }
    ];

    const actions = [
        {
            label: 'Ver Detalles',
            icon: 'eye',
            iconClass: 'w-4 h-4 mr-1',
            action: (formulario: Formulario) => {
                window.location.href = route('supervisor.formularios.show', formulario.id);
            },
        },
        {
            label: 'Aprobar',
            icon: 'check',
            iconClass: 'w-4 h-4 mr-1',
            action: handleAprobar,
            condition: (formulario: Formulario) => formulario.estado?.id === 2, // Solo si está enviado
        },
        {
            label: 'Rechazar',
            icon: 'x',
            iconClass: 'w-4 h-4 mr-1',
            action: handleRechazar,
            condition: (formulario: Formulario) => formulario.estado?.id === 2, // Solo si está enviado
        }
    ];

    return (
        <SupervisorLayout>
            <Head>
                <title>Formularios</title>
            </Head>
            
            <div className="grid grid-cols-12 gap-6 mt-2">
                <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
                    <AppLayoutTitle title="Formularios" />
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="intro-y col-span-12">
                    <div className="intro-y box p-5">
                        <Table
                            paginator={formularios}
                            head={tableHead}
                            rows={formularios.data}
                            actions={actions}
                            options={{
                                path: route('supervisor.formularios.index'),
                                per_page: formularios.per_page
                            }}
                        >
                            <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                <select
                                    name="estado"
                                    defaultValue={filters.estado || ''}
                                    className="form-select"
                                    onChange={(e) => {
                                        const form = e.target.closest('form') || document.createElement('form');
                                        form.method = 'GET';
                                        form.action = route('supervisor.formularios.index');
                                        
                                        const estadoInput = form.querySelector('input[name="estado"]') as HTMLInputElement;
                                        if (estadoInput) {
                                            estadoInput.value = e.target.value;
                                        } else {
                                            const input = document.createElement('input');
                                            input.type = 'hidden';
                                            input.name = 'estado';
                                            input.value = e.target.value;
                                            form.appendChild(input);
                                        }
                                        
                                        form.submit();
                                    }}
                                >
                                    <option value="">Todos los estados</option>
                                    {estados.map((estado) => (
                                        <option key={estado.id} value={estado.id}>
                                            {estado.descripcion}
                                        </option>
                                    ))}
                                </select>
                                
                                <input
                                    type="text"
                                    name="search"
                                    defaultValue={filters.search || ''}
                                    placeholder="Buscar por nombre o CUE..."
                                    className="form-control"
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            const form = e.target.closest('form') || document.createElement('form');
                                            form.method = 'GET';
                                            form.action = route('supervisor.formularios.index');
                                            
                                            const searchInput = form.querySelector('input[name="search"]') as HTMLInputElement;
                                            if (searchInput) {
                                                searchInput.value = e.target.value;
                                            } else {
                                                const input = document.createElement('input');
                                                input.type = 'hidden';
                                                input.name = 'search';
                                                input.value = e.target.value;
                                                form.appendChild(input);
                                            }
                                            
                                            form.submit();
                                        }
                                    }}
                                />
                            </div>
                        </Table>
                    </div>
                </div>
            </div>

            {/* Modal de confirmación */}
            {showConfirmModal && selectedFormulario && actionType && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">
                            {actionType === 'aprobar' ? 'Aprobar Formulario' : 'Rechazar Formulario'}
                        </h3>
                        <p className="mb-4">
                            ¿Está seguro que desea {actionType === 'aprobar' ? 'aprobar' : 'rechazar'} el formulario de {selectedFormulario.instituto?.nombre || 'este instituto'}?
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirmModal(false)}
                                className="btn btn-secondary"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmAction}
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
