import AppLayoutTitle from '@/components/layouts/AppLayoutTitle';
import ConfirmModal from '@/components/modals/ConfirmModal';
import InstitutoDetailsModal from '@/components/modals/InstitutoDetailsModal';
import Table from '@/components/table/Table';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Instituto, Provincia, TipoInstituto } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState, useCallback, useMemo } from 'react';
import FormSelect from '@/components/form/FormSelect/FormSelect';

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
    const [currentPerPage, setCurrentPerPage] = useState<number | null>(institutos.per_page ?? null);

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
        setCurrentPerPage(newPerPage);
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

    const provinciaItems = useMemo(
        () => [
            { value: '' as const, label: 'Todas las provincias' },
            ...(provincias?.map((p) => ({ value: String(p.id), label: p.descripcion ?? '' })) ?? []),
        ],
        [provincias],
    );

    const tipoInstitutoItems = useMemo(
        () => [
            { value: '' as const, label: 'Todos los tipos' },
            ...(tiposInstituto?.map((t) => ({ value: String(t.id), label: t.descripcion ?? '' })) ?? []),
        ],
        [tiposInstituto],
    );

    return (
        <AdminLayout>
            <Head title="Institutos" />
            <AppLayoutTitle title="Institutos" />

            <div className="mt-4 w-full">
                <div className="intro-y flex w-full flex-col gap-4 xl:flex-row xl:flex-wrap xl:items-end">
                    <div className="flex flex-wrap gap-2">
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

                    <div className="grid w-full gap-4 sm:grid-cols-2 xl:ml-auto xl:w-auto xl:max-w-4xl xl:grid-cols-[1fr_1fr_auto] xl:items-end">
                        <div className="min-w-0 sm:min-w-[12rem]">
                            <FormSelect
                                name="provincia_id"
                                label="Provincia"
                                items={provinciaItems}
                                value={
                                    provincia_id != null && String(provincia_id) !== ''
                                        ? String(provincia_id)
                                        : ''
                                }
                                multiple={false}
                                canDeselect={false}
                                onChange={(e) => handleProvincia(String(e.target.value ?? ''))}
                                errors={undefined}
                            />
                        </div>

                        <div className="min-w-0 sm:min-w-[12rem]">
                            <FormSelect
                                name="tipo_instituto_id"
                                label="Tipo de instituto"
                                items={tipoInstitutoItems}
                                value={
                                    tipo_instituto_id != null && String(tipo_instituto_id) !== ''
                                        ? String(tipo_instituto_id)
                                        : ''
                                }
                                multiple={false}
                                canDeselect={false}
                                onChange={(e) => handleTipoInstituto(String(e.target.value ?? ''))}
                                errors={undefined}
                            />
                        </div>

                        <div className="flex items-end pb-0.5">
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
