import AppLayoutTitle from '@/components/layouts/AppLayoutTitle';
import ConfirmModal from '@/components/modals/ConfirmModal';
import InstitutoDetailsModal from '@/components/modals/InstitutoDetailsModal';
import Table from '@/components/table/Table';
import { AdminLayout } from '@/layouts/AdminLayout';
import { number } from '@/lib/validationFunctions';
import { Instituto, Provincia, TipoInstituto } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useCallback } from 'react';

interface IndexProps {
    institutos: { data: Instituto[];[key: string]: any };
    provincias: Provincia[];
    tiposInstituto: TipoInstituto[];
    filters: { [key: string]: any };
    options: { [key: string]: any };
    totales: {
        global: {
            estatales: number;
            privados: number;
            total: number;
        };
        filtrados: {
            estatales: number;
            privados: number;
            total: number;
        };
    };
}
export default function Index({ institutos, tiposInstituto, provincias, filters, options, totales }: IndexProps) {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [institutoToDeactivate, setInstitutoToDeactivate] = useState<Instituto | null>(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedInstituto, setSelectedInstituto] = useState<Instituto | null>(null);
    const [currentPerPage, setCurrentPerPage] = useState(null);

    const ambito_gestion = filters?.ambito_gestion
    const provincia_id = filters?.provincia_id
    const tipo_instituto_id = filters?.tipo_instituto_id;

    const deactivateInstituto = (instituto: Instituto) => {
        setInstitutoToDeactivate(instituto);
        setShowConfirmModal(true);
    };

    const confirmDeactivateInstituto = () => {
        router.delete(route('admin.institutos.destroy', {
            instituto: institutoToDeactivate?.cue
        }));
    }

    const handleAmbitoGestion = (valor: string) => {
        handleFilterChange({ ambito_gestion: valor })
    };

    const handleProvincia = (valor: string) => {
        handleFilterChange({ provincia_id: valor })
    };

    const handleTipoInstituto = (valor: string) => {
        handleFilterChange({ tipo_instituto_id: valor })
    };

    const handleFilterChange = (newFilter) => {
        router.get(route('admin.institutos.index'), {
            ...filters,
            ...newFilter
        })
    }

    // funciones para manejar la paginación exclusivamente
    const handlePageChange = useCallback((page: number) => {
        router.get(route('admin.institutos.index'), {
            ...filters,
            page,
            limit: currentPerPage,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    }, [filters, currentPerPage]);

    const handlePerPageChange = useCallback((newPerPage: number) => {
        router.get(route('admin.institutos.index'), {
            ...filters,
            page: 1, // Reset to first page
            limit: newPerPage,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    }, [filters]);

    const tableHead = [
        { value: 'cue_editable', label: 'CUE' },
        { value: 'nombre', label: 'Nombre' },
        { value: 'tipo_instituto_descripcion', label: 'T.Instituto' },
        { value: 'localidad_descripcion', label: 'Localidad' },
        { value: 'email', label: 'Email' },
    ];

    const actions = [
        {
            label: 'Ver Detalles',
            icon: 'eye',
            iconClass: 'w-4 h-4 mr-1',
            action: (value: Instituto) => {
                setSelectedInstituto(value);
                setShowDetailsModal(true);
            },
        },
        {
            label: 'Desactivar',
            icon: 'x-circle',
            iconClass: 'w-4 h-4 mr-1 text-danger',
            condition: (value: Instituto) => value.activo,
            action: (value: Instituto) => {
                deactivateInstituto(value);
            },
        },
    ];

    const clearFilters = () => {
        router.get(route('admin.institutos.index'), {
            page: 1
        }, {
            preserveScroll: true,
            preserveState: true
        })
    };

    return (
        <AdminLayout>
            <Head title="Institutos" />
            <AppLayoutTitle title="Institutos" />

            <div className="grid grid-cols-12 gap-6 mt-2">
                <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
                    <div className="flex gap-2 mr-4">
                        <button
                            type="button"
                            className={`btn btn-primary shadow-md mr-2 focus:outline-none focus:ring-0 ${!ambito_gestion ? 'bg-gray-700 border-gray-600' : 'border-transparent'}`}
                            onClick={() => { handleAmbitoGestion('') }}
                        >
                            TODOS {totales.filtrados.total}
                        </button>

                        <button
                            type="button"
                            className={`btn btn-primary shadow-md mr-2 focus:outline-none focus:ring-0 ${ambito_gestion === 'E' ? 'bg-gray-700 border-gray-600' : 'border-transparent'}`}
                            onClick={() => { handleAmbitoGestion('E') }}
                        >
                            ESTATALES {totales.filtrados.estatales}
                        </button>

                        <button
                            type="button"
                            className={`btn btn-primary shadow-md mr-2 focus:outline-none focus:ring-0 ${ambito_gestion === 'P' ? 'bg-gray-700 border-gray-600' : 'border-transparent'}`}
                            onClick={() => { handleAmbitoGestion('P') }}
                        >
                            PRIVADOS {totales.filtrados.privados}
                        </button>
                    </div>

                    <div className="flex gap-4 ml-auto">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Provincia</label>
                            <select className="form-control w-full" value={provincia_id} onChange={(e) => handleProvincia(e.target.value)}>
                                <option value="">Todas las provincias</option>
                                {provincias?.map((provincia) => (
                                    <option key={provincia.id} value={provincia.id}>
                                        {provincia.descripcion}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-gray-700">Tipo de Instituto</label>
                            <select className="form-control w-full" value={tipo_instituto_id} onChange={(e) => handleTipoInstituto(e.target.value)}>
                                <option value="">Todos los tipos</option>
                                {tiposInstituto?.map((tipo) => (
                                    <option key={tipo.id} value={tipo.id}>
                                        {tipo.descripcion}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button type="button" onClick={clearFilters} className="btn btn-outline-secondary shadow-md mr-2">
                                Limpiar Filtros
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Table
                head={tableHead}
                rows={institutos.data}
                actions={actions}
                options={{
                    ...filters,
                    ...options,
                    path: institutos.path,
                    per_page: institutos.per_page,
                }}
                paginator={institutos}
                paginate={true}
                onPageChange={handlePageChange}
                onPerPageChange={handlePerPageChange}
            />

            <InstitutoDetailsModal
                isOpen={showDetailsModal}
                onClose={() => setShowDetailsModal(false)}
                instituto={selectedInstituto}
            />

            <ConfirmModal 
            isOpen={showConfirmModal} 
            onClose={() => {
                setInstitutoToDeactivate(null)
                setShowConfirmModal(false)
            }}
            onConfirm={() => {confirmDeactivateInstituto()}}
            title={'Confirmar Desactivación'}
            message={'¿Está seguro que desea eliminar el instituto "' + institutoToDeactivate?.nombre + '"?'}
            />

        </AdminLayout>
    );
}
