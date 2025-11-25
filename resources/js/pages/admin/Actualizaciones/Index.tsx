import { AdminLayout } from '@/layouts/AdminLayout';
import AppLayoutTitle from "@/components/layouts/AppLayoutTitle";
import Search from "@/components/table/Search";
import Table from "@/components/table/Table";
import { usePage, Head, router } from '@inertiajs/react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { UpdatesPageProps, ProvinceDropdownItem } from "@/types/UpdatePageProps";
import Target from "@/components/cards/Traget";
import AppIcon from "@/components/Icons/AppIcon";
import axios from 'axios';
import CakeGraphics, { ChartDataItem } from '@/components/charts/CakeChart';
import ExpandedRowForm from '@/components/table/Custom/ExpandedRowForm';

export default function Updates({initialData, allYears, allProvinces, filters, options}) {

    //Estados para filtros y datos dinámicos
    const [apiData, setApiData] = useState<any>(null);
    const [currentSelectedYear, setCurrentSelectedYear] = useState(allYears?.[0]?.value || '');
    const [currentperPage, setCurrentPerPage] = useState(10); // ← Nuevo estado para items por página
    const [currentPage, setCurrentPage] =useState (1);
    const [searchTerm, setSearchTerm] = useState("");

    const ambito_gestion = filters?.ambito_gestion;
    const provincia_id = filters?.provincia_id;
    const anio = filters?.anio;

    const handleFilterChange = (newFilter) => {
        router.get(route('admin.actualizaciones.index'), {
            ...filters,
            ...newFilter
        })
    }

    //Desestructurar los datos a mostrar
    const {
        yearSelectedData,
        dataTable,
        totalRecordsCount,
        sumDocentesCarrera,
        sumDocentesPractica,
        sum1Año,
        sum2Año,
        sum3Año,
        sumEgresados,
        percentageByState
    } = initialData;

    //DATOS DE INSTITUTO SEGUN FILA EXPANDIBLE
    //Estado para los datos expandidos
    const [expandedData, setExpandedData] = useState<any>(null);

    //Función para fetch de datos expandido
    const fetchExpandedData = async (row: any) => {
        try {
            console.log('Fetching data for:', row.cue, row.anio);

            const response = await axios.get(route('api.actualizaciones.showExpandedRow', { cue: row.cue, anio: row.anio }));

            console.log('API Response:', response.data);
            setExpandedData(response.data);

        } catch (error: any) {
            console.error('Full error details:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);
        }
    };

    // funciones para manejar la paginación exclusivamente
    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handlePerPageChange = useCallback((newPerPage: number) => {
        setCurrentPerPage(newPerPage);
        setCurrentPage(1); // Siempre resetear a la primera página al cambiar la cantidad de elementos por página

    }, []);

    // Botón de reporte
    const [showReports, setShowReports] = useState(false);
    const ToggleReports = () => setShowReports(prev => !prev);

    // Datos del gráfico torta -- ESTADO 1 == APROBADO
    const chartDataForCakeGraphics: ChartDataItem[] = Object.entries(percentageByState ?? {}).map(
        ([estado, percentage]) => {
            let label = `Estado ${estado}`;
            let color = "#000000ff";
            switch (parseInt(estado)) {
                default: label = "Pendiente"; color = "#dbdf14ff"; break;
                case 1: label = "Recibido"; color = "#058dfcff"; break;
            }
            return { label, percentage: percentage as number, color };
        }
    );

    // Provincias con opción 'Todos'
    const provincesWithAllOption: ProvinceDropdownItem[] = [
        { label: 'Todos', value: '' },
        ...allProvinces
    ];

    // Cabecera de la tabla
    const tableHead = [
        { value: `cue_editable`, label: 'CUE' },
        { value: `anio`, label: 'Año' },
        { value: `cantidad_docentes_carrera`, label: 'Cant Docentes Carrera' },
        { value: `cantidad_docentes_practica`, label: 'Cant Docentes Practica' },
        { value: `cantidad_anio_1`, label: '1er Año' },
        { value: `cantidad_anio_2`, label: '2do Año' },
        { value: `cantidad_anio_3`, label: '3er Año' },
        { value: `cantidad_egresados`, label: 'Egresados' }
    ];

    return (
        <AdminLayout>
            <Head>
                <title>Actualizacion</title>
            </Head>
            {/* TITULO Y SELECTOR DE AÑO */}
            <div className="grid grid-cols-12 gap-6 mt-2">
                <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
                    <AppLayoutTitle title="Actualización de datos" />
                    <div className="ml-4">
                        <select
                            id="anioSelect"
                            name="anioSelect"
                            value={anio}
                            onChange={e => handleFilterChange({anio: e.target.value})}
                            className="form-control w-auto min-w-[100px]"
                        >
                            {allYears.map(yearItem => (
                                <option key={yearItem.value} value={yearItem.value}>
                                    {yearItem.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            {/* FILTROS */}
            <div className="grid grid-cols-12 gap-6 mt-2">
                <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
                    <div className="flex gap-2 mr-4">
                        <button
                            type="button"
                            className={`btn btn-primary shadow-md mr-2 focus:outline-none focus:ring-0 ${!ambito_gestion ? 'bg-gray-700 border-gray-600' : 'border-transparent'}`}
                            onClick={() => handleFilterChange({ambito_gestion: ''})}
                        >
                            Todos
                        </button>
                        <button
                            type="button"
                            className={`btn btn-primary shadow-md mr-2 focus:outline-none focus:ring-0 ${ambito_gestion === 'E' ? 'bg-gray-700 border-gray-600' : 'border-transparent'}`}
                            onClick={() => handleFilterChange({ambito_gestion: 'E'})}
                        >
                            Estatal
                        </button>
                        <button
                            type="button"
                            className={`btn btn-primary shadow-md mr-2 focus:outline-none focus:ring-0 ${ambito_gestion === 'P' ? 'bg-gray-700 border-gray-600' : 'border-transparent'}`}
                            onClick={() => handleFilterChange({ambito_gestion: 'P'})}
                        >
                            Privado
                        </button>
                    </div>
                    
                    <div className="flex gap-4 ml-auto">
                        <div>
                            <select
                                id="provinceSelect"
                                name="provinceSelect"
                                onChange={e => handleFilterChange({provincia_id: e.target.value})}
                                className="form-control w-auto min-w-[100px]"
                                value={provincia_id}
                            >
                                {provincesWithAllOption.map(provinceItem => (
                                    <option key={provinceItem.value} value={provinceItem.value}>
                                        {provinceItem.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        <button
                            type="button"
                            onClick={ToggleReports}
                            className={`btn btn-outline-secondary shadow-md mr-2 focus:outline-none focus:ring-0 ${showReports ? 'bg-gray-700 border-gray-600 text-white' : 'border-transparent'}`}
                            title={showReports ? "Ocultar reportes" : "Mostrar reportes"}
                        >
                            <AppIcon name="clipboard" className="w-4 h-4 mr-1" />
                            {showReports ? "Ocultar Reportes" : "Mostrar Reportes"}
                        </button>
                    </div>
                </div>
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
                            <Target title="Docentes Carrera" totalValue={sumDocentesCarrera} />
                            <Target title="Docentes Carrera Practicas" totalValue={sumDocentesPractica} />
                        </div>
                        <h2 className='font-bold mt-4 text-lg'>Alumnos matriculados al {yearSelectedData.fecha_matriculados}</h2>
                        <div className="col-span-12 gap gap-cols-12 gap-6 mt-4 flex">
                            <Target title="1º" totalValue={sum1Año} />
                            <Target title="2º" totalValue={sum2Año} />
                            <Target title="3º" totalValue={sum3Año} />
                        </div>
                        <h2 className='font-bold mt-4 text-lg'>Egresados entre el {yearSelectedData.fecha_1_egresados} y el {yearSelectedData.fecha_2_egresados}</h2>
                        <div className="col-span-12 gap gap-cols-12 gap-6 mt-4 flex">
                            <Target title="Total de egresados" totalValue={sumEgresados} />
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
                    rows={dataTable.data}
                    paginate={true}
                    expandable={true}
                    onRowClick={fetchExpandedData}
                    options={{ 
                        ...options, 
                        path: dataTable.path, 
                        per_page: dataTable.per_page
                    }} 
                    expandedRowComponent= {() => (//componente expandido
                        <ExpandedRowForm
                            data={expandedData} //este tiene los datos del axios que se muestran en el formulario
                            showActions={false} //true en pages de direccion superrior
                            loading={false}
                        />
                    )}
                >
                    {/* <Search initialSearchTerm={searchTerm} onSearch={(term) => handleFilterChange(null, null, null, term)} /> */ }
                </Table>
            </div>
        </AdminLayout >
    );
}
