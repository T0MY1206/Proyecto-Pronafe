
//  Interfaz para los ítems del dropdown de Años
export interface YearDropdownItem {
    label: string; // Ej: '2023', '2024'
    value: string; // Ej: '2023', '2024' (el año como string)
}

// Interfaz para los ítems del dropdown de Provincias
export interface ProvinceDropdownItem {
    label: string; // Ej: 'Buenos Aires', 'Córdoba' (la descripción de la provincia)
    value: string; // Ej: '1', '2' (el ID de la provincia como string)
}

export interface SelectedUpdateData {
    anio: string; // El año de la actualización
    fecha_matriculados: string | null; // Puede ser null si no hay datos
    fecha_1_egresados: string | null;
    fecha_2_egresados: string | null;
}

// Interfaz para los porcentajes por estado (percentageByState)
export interface PercentageByState {
    [key: number]: number; // Un objeto donde las claves son los IDs de estado (números) y los valores son los porcentajes (números)
}

export interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface StateData {
    id: number;
    descripcion: string; // Columna 'descripcion' de la tabla 'states'
}

export interface DataTable {
    id: number;
    cue: string;
    anio: string;
    cantidad_docentes_carrera: number;
    cantidad_docentes_practica: number;
    cantidad_anio_1: number;
    cantidad_anio_2: number;
    cantidad_anio_3: number;
    cantidad_egresados: number;
    estado_id: number; // La FK sigue presente
    state: StateData; // La relación State cargada
}

export interface InitialData {
    yearSelectedData: SelectedUpdateData;
    dataTable: Paginated<DataTable>; // ← Cambiar de TableFiltred a dataTable
    totalRecordsCount: number;
    sumDocentesCarrera: number;
    sumDocentesPractica: number;
    sum1Año: number;
    sum2Año: number;
    sum3Año: number;
    sumEgresados: number;
    percentageByState: PercentageByState;
    selectedYear: string;
    gestionType: string;
    selectedProvinceId: string | null;
    search: string;
}

export interface UpdatesPageProps  {
    allYears: YearDropdownItem[];
    allProvinces: ProvinceDropdownItem[];
    initialDataTable: InitialData;
}











export interface InstituteData {
    cue: string; // PK de Institute y FK en Data
    ambito_gestion: number; // Columna 'ambito_gestion' de la tabla 'institutes'
    departamento_id: number; // FK necesaria para la relación con Departament
    departament: DepartamentData; // La relación anidada cargada
    // Si hubieras cargado 'locality', iría aquí: locality?: LocalityData;
}

export interface DataRecord {
    id: number;
    cue: string;
    anio: string;
    cantidad_docentes_carrera: number;
    cantidad_docentes_practica: number;
    cantidad_anio_1: number;
    cantidad_anio_2: number;
    cantidad_anio_3: number;
    cantidad_egresados: number;
    percentageByState: PercentageByState; 
    estado_id: number; // La FK sigue presente
    institute: InstituteData; // La relación Institute cargada con sus anidados
    state: StateData; // La relación State cargada
}
// 7. Interfaz principal para todas las props que la página 'Updates' recibirá de Inertia
export interface UpdatesPageProps2 {
    allYears:YearDropdownItem[];
    yearSelectedData: SelectedUpdateData;
    TableFiltred: Paginated<DataRecord>; // El array de registros de datos filtrados y con relaciones
    allProvinces: ProvinceDropdownItem[];
    selectedYear: string;
    gestionType: string;
    selectedProvinceId: string | null; // Puede ser null
    totalRecordsCount: number;
    sumDocentesCarrera: number;
    sumDocentesPractica: number;
    sum1Año: number;
    sum2Año: number;
    sum3Año: number;
    sumEgresados: number;
    percentageByState: PercentageByState; // El objeto con los porcentajes por estado
    search: string; // El término de búsqueda actual
}

export interface ProvinceData {
    id: number;
    descripcion: string; // Columna 'descripcion' de la tabla 'provinces'
}

export interface DepartamentData {
    id: number;
    descripcion: string; // Columna 'descripcion' de la tabla 'departaments'
    province_id: number; // FK necesaria para la relación con Province
    province: ProvinceData; // La relación anidada cargada
}

