import { SupervisorLayout } from '@/layouts/SupervisorLayout';
import AppLayoutTitle from "@/components/layouts/AppLayoutTitle";
import Search from "@/components/table/Search";
import Table from "@/components/table/Table";
import Tab from "@/components/Filters/Tab";
import { usePage, Head, router } from '@inertiajs/react';
import { useState, useEffect, useCallback, useRef } from 'react';
import Target from "@/components/cards/Traget";
import AppIcon from "@/components/Icons/AppIcon";
import CakeGraphics, { ChartDataItem } from "@/components/charts/CakeChart";
import ExpandedActualizacionForm from "@/components/table/Custom/ExpandedActualizacionForm";
import axios from 'axios';
interface Anio {
    value: string;
    label: string;
}
interface InitialData {
    yearSelectedData: {
        anio: string;
        fecha_matriculados: string;
        fecha_1_egresados: string;
        fecha_2_egresados: string;
    };
    dataTable: { data: any[]; };
    Sumas: {
        totalRecordsCount: number;
        sumDocentesCarrera: number;
        sumDocentesPractica: number;
        sum1Año: number;
        sum2Año: number;
        sum3Año: number;
        sumEgresados: number;
    }
    percentageByState: { [key: number]: number; };
    totalRecordsCount: number;
}

interface UpdatesPagePropsDirecSuper {
    user: string,
    allYears: Anio[];
    nombreProvincia: string;
    initialData: InitialData;
    options: { data: any[]; };
    
}

export default function Updates({ user, allYears, nombreProvincia, initialData, options }: UpdatesPagePropsDirecSuper) {
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [estado, setEstado] = useState<number | string>(1);
    const [currentSelectedYear, setCurrentSelectedYear] = useState(allYears[0].value);
    const [currentGestionType, setCurrentGestionType] = useState(' ');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentperPage, setCurrentPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    
    const { yearSelectedData, dataTable, Sumas, percentageByState, totalRecordsCount } = initialData;

    initialData.dataTable.data = initialData.dataTable.data.map((item) => ({
        ...item,
        cue: item.cue_editable,
        //Si el estado es "Enviado", lo cambio a pendiente. Esto es porque si el instituto "Envió" el formulario, 
        //Para el supervisor eso significa que está pendiente de aprobación o rechazo
        estado_descripcion: item.estado_descripcion === "Enviado" ? "Pendiente" : item.estado_descripcion
        }
    ))

    //Handler de filtros y búsqueda
    const handleFilterChange =  useCallback((
    newYear : string | null = null,
    newGestion: string | null = null,
    term: string = searchTerm,
    newEstado: number | string
    ) => {
        const year = newYear !== null ? newYear : currentSelectedYear;
        const gestion = newGestion !== null ? newGestion : currentGestionType;
        const search = term !== null ? term : searchTerm;
        const NewEstado = newEstado !== null ? newEstado : estado;

    setEstado(NewEstado);
    setCurrentSelectedYear(year);
    setCurrentGestionType(gestion);
    setSearchTerm(search);

        let estadoParaBackend = NewEstado;
        if (NewEstado === 'procesados') {
            estadoParaBackend = -1;
        }

        router.get(route('supervisor.actualizaciones.index'), {
            ambito_gestion: gestion,
            search: search,
            anio: year,
            limit: currentperPage,
            estado: estadoParaBackend,
            page: currentPage
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    }, [currentGestionType, searchTerm, currentSelectedYear, currentPage, currentperPage, estado]);
    
    useEffect(() => {
        handleFilterChange(currentSelectedYear, currentGestionType, searchTerm, estado);
    }, [currentSelectedYear, currentGestionType, searchTerm, handleFilterChange, currentPage, currentperPage]);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handlePerPageChange = useCallback((newPerPage: number) => {
        setCurrentPerPage(newPerPage);
        setCurrentPage(1);
    }, []);

    const [expandedData, setExpandedData] = useState<any>(null);

    const fetchExpandedData = async (row: any) => {
        try {
            const response = await axios.get(route('api.actualizaciones.showExpandedRow', { cue: row.cue, anio: row.anio }));
            setExpandedData(response.data);
        } catch (error: any) {
            console.error('Full error details:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
        }
    };

    const [showReports, setShowReports] = useState(false);
    const ToggleReports = () => setShowReports(prev => !prev);

    const chartDataForCakeGraphics: ChartDataItem[] = Object.entries(percentageByState ?? {}).map(([estadoId, percentage]) => {
        let label = `Estado ${estadoId}`;
        let color = '#000000ff';
        const percentageNumber = percentage as number;
        switch (parseInt(estadoId)) {
            case 1: label = 'Pendiente'; color = '#dbdf14ff'; break;
            case 2: label = 'Enviado'; color = '#058dfcff'; break;
            case 3: label = 'Aprobado'; color = '#15c023ff'; break;
            case 4: label = 'Rechazado'; color = '#b63030ff'; break;
            default: label = `Estado Desconocido ${estadoId}`; color = '#9966FF';
        }
        return { label, percentage: percentageNumber, color };
    });

    const tableHead = [
        { value: `cue`, label: 'CUE' },
        { value: `anio`, label: 'Año' },
        { value: `cantidad_docentes_carrera`, label: 'Cant Docentes Carrera' },
        { value: `cantidad_docentes_practica`, label: 'Cant Docentes Practica' },
        { value: `cantidad_anio_1`, label: '1er Año' },
        { value: `cantidad_anio_2`, label: '2do Año' },
        { value: `cantidad_anio_3`, label: '3er Año' },
        { value: `cantidad_egresados`, label: 'Egresados' },
        { value: `estado_descripcion`, label: 'Estado' }
    ];

    const actions = [
        {
            label: 'Ver detalles',
            icon: 'eye',
            iconClass: 'w-4 h-4 mr-1',
            action: (value: any) => {
                fetchExpandedData(value);
                setShowDetailsModal(true);
            },
        }
    ];
    
    return (
        <SupervisorLayout>
            <Head>
                <title>Actualizacion</title>
            </Head>
            <div className="rounded-lg m-2">
                <div className="flex items-end gap-4 w-full text-base">
                    <AppLayoutTitle title="Actualización de datos" />
                    <select
                        id="anioSelect"
                        name="anioSelect"
                        value={currentSelectedYear}
                        onChange={e => handleFilterChange(e.target.value, null, '', estado)}
                        className="block w-auto min-w-[100px] px-3 py-2 border border-gray-300 rounded-lg shadow-lg bg-white focus:outline-none focus:ring-blue-950/93 focus:border-blue-950/93 sm:text-lg cursor-pointer"
                    >
                        {allYears.map(yearItem => (
                            <option key={yearItem.value} value={yearItem.value}>
                                {yearItem.label}
                            </option>
                        ))}
                    </select>
                    <h1 className='text-lg font-bold'>{nombreProvincia}</h1>
                </div>
            </div>
            {/* FILTROS */}
            <div className="m-4 flex items-center gap-4 flex-wrap">
                <div className="text-base font-bold text-gray-600">Filtrar por gestión:</div>
                <a
                    href="#"
                    className={`btn btn-primary rounded px-4 py-2 ${currentGestionType === ' ' ? 'bg-gray-700' : ''}`}
                    onClick={() => handleFilterChange(null, ' ', '', estado)}
                    role="tab"
                    aria-selected={currentGestionType === ' '}
                > TODOS </a>
                <a
                    href="#"
                    className={`btn btn-primary rounded px-4 py-2 ${currentGestionType === 'E' ? 'bg-gray-700' : ''}`}
                    onClick={() => handleFilterChange(null, 'E', '', estado)}
                    role="tab"
                    aria-selected={currentGestionType === 'E'}
                > ESTATALES </a>
                <a
                    href="#"
                    className={`btn btn-primary rounded px-4 py-2 ${currentGestionType === 'P' ? 'bg-gray-700' : ''}`}
                    onClick={() => handleFilterChange(null, 'P', '', estado)}
                    role="tab"
                    aria-selected={currentGestionType === 'P'}> 
                    PRIVADOS
                </a>
                <a
                    href="javascript:;"
                    onClick={ToggleReports}
                    className={`transition-all duration-200 w-10 h-10 rounded-lg px-1 py-1 flex items-center justify-center ${showReports ? 'bg-blue-950/93 text-white ring-2 ring-blue-400 scale-105' : 'bg-white text-gray-900 hover:bg-blue-950/93 hover:text-white hover:scale-105 hover:ring-2 hover:ring-blue-400'} `}
                    title={showReports ? "Ocultar reportes" : "Mostrar reportes"} >
                    <AppIcon name="clipboard" className="w-8 h-8" />
                </a>
            </div>

            {/* FILTRO POR ESTADO */}
            <div className="m-4">
                <Tab
                    title="Filtrar por estado"
                    onFiltroSeleccionado={(valorDelTab) => handleFilterChange( null, null, '', valorDelTab)}
                    filtroActual={estado}>
                </Tab>
            </div>
            {showReports && (
                <div className='flex justify-center gap-5 items-stretch'>
                    <div className="bg-transparent p-3 flex flex-col h-full w-auto">
                        <div className="m-3 w-full flex-1 flex flex-col h-full">
                            <CakeGraphics
                                title="Estado de formularios"
                                chartData={chartDataForCakeGraphics}
                                totalValue={totalRecordsCount}
                            />
                        </div>
                    </div>
                    <div className="col-md-6 bg-transparent d-flex p-3">
                        <h1 className='text-lg font-bold  text-2xl'>Reporte {yearSelectedData.anio} </h1>
                        <h2 className='font-bold mt-4 text-lg'>Total docentes carrera</h2>
                        <div className="col-span-12 gap gap-cols-12 gap-6 mt-4 flex">
                            <Target title="Docentes Carrera" totalValue={Sumas.sumDocentesCarrera} />
                            <Target title="Docentes Carrera Practicas" totalValue={Sumas.sumDocentesPractica} />
                        </div>
                        <h2 className='font-bold mt-4 text-lg'>Alumnos matriculados al {yearSelectedData.fecha_matriculados}</h2>
                        <div className="col-span-12 gap gap-cols-12 gap-6 mt-4 flex">
                            <Target title="1º" totalValue={Sumas.sum1Año} />
                            <Target title="2º" totalValue={Sumas.sum2Año} />
                            <Target title="3º" totalValue={Sumas.sum3Año} />
                        </div>
                        <h2 className='font-bold mt-4 text-lg'>Egresados entre el {yearSelectedData.fecha_1_egresados} y el {yearSelectedData.fecha_2_egresados}</h2>
                        <div className="col-span-12 gap gap-cols-12 gap-6 mt-4 flex">
                            <Target title="Total de egresados" totalValue={Sumas.sumEgresados} />
                        </div>
                    </div>
                </div>
            )}
            
            {/* TABLA Y SEARCH */}
            <div className='justify-between items-center p-6 bg-transparent '>
                
                <Table
                    paginator={dataTable}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                    head={tableHead}
                    rows={dataTable}
                    paginate={true}
                    expandable={false}
                    actions={actions}
                >
                    <Search initialSearchTerm={searchTerm} onSearch={(term) => handleFilterChange(null, null, term, estado)} />
                </Table>
            </div>
            {/* MODAL DE DETALLES EXPANDIDO */}
            {showDetailsModal && (
                <ExpandedActualizacionForm
                    isOpen={showDetailsModal}
                    onClose={() => setShowDetailsModal(false)}
                    data={expandedData}
                    showActions={true}
                    loading={false}
                />
            )}
            <div id="modal-root"></div>
        </SupervisorLayout >
    );
}
