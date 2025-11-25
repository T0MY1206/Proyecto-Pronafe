export interface AuthProp {
    props: {
        auth: Auth;
    };
}

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    href: string;
    label: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    login_user_name: string;
    avatar?: string;
    email_verified_at: string | null;
    rol_id: number;
    rol: Rol;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface ItemParametrico{
  id: number,
  descripcion?: string | null
}

export interface Provincia extends ItemParametrico{
  created_at?: string;
  updated_at?: string;
}

export interface Departamento extends ItemParametrico{
  provincia_id: number;
  provincia?: Provincia,
  created_at?: string;
  updated_at?: string;
}

export interface Localidad extends ItemParametrico {
  provincia_id: number;
  provincia?: Provincia;
  departamento_id: number;
  departamento?: Departamento;
  created_at?: string;
  updated_at?: string;
}

export interface TipoInstituto extends ItemParametrico{
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Instituto {
  cue: string;
  cue_editable?: string | null;
  tipo_instituto_id: number;
  tipo_instituto?: TipoInstituto;
  nombre: string;
  ambito_gestion?: string | null;
  localidad_id: number;
  localidad: Localidad;
  departamento_id?: number | null;
  departamento: Departamento;
  direccion?: string | null;
  codigo_postal?: string | null;
  telefono?: string | null;
  email?: string | null;
  anio_ingreso?: number | null;
  anio_egreso?: number | null;
  activo: boolean;
  user_id?: number | null;
  user?: User;
  autoridades?: Autoridad[];
  created_at?: string;
  updated_at?: string;
}

export interface Estado extends ItemParametrico {
  created_at?: string;
  updated_at?: string;
}

export interface Dato {
    id: number;
    anio: number;
    actualizacion?: Actualizacion;
    cue: string;
    instituto?: Instituto;
    cantidad_docentes_carrera?: number | null;
    cantidad_docentes_practica?: number | null;
    cantidad_anio_1?: number | null;
    cantidad_anio_2?: number | null;
    cantidad_anio_3?: number | null;
    cantidad_egresados?: number | null;
    monto_anual?: number | null;
    monto_mensual?: number | null;
    monto_extracurricular?: number | null;
    cantidad_cuota?: number | null;
    observaciones?: string | null;
    estado_id?: number | null;
    estado?: Estado;
    motivo_rechazo?: string | null;
    user_id?: number | null;
    user?: User;
    created_at?: string;
    updated_at?: string;
}

export interface Actualizacion {
    anio: number;
    fecha_matriculados?: string | null;
    fecha_1_egresados?: string | null;
    fecha_2_egresados?: string | null;
    fecha_tope?: string | null;
    user_id?: number | null;
    user?: User;
    activo: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface Cargo extends ItemParametrico {
  instituto_carrera?: string | null;
  activo: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Autoridad {
    id: number;
    anio: number;
    actualizacion?: Actualizacion;
    cue: string;
    instituto?: Instituto;
    nombre_apellido: string;
    cargo_id: number;
    cargo?: Cargo;
    telefono?: string | null;
    email?: string | null;
    user_id?: number | null;
    user?: User;
    activo: boolean;
    created_at?: string;
    updated_at?: string;
}

export interface Rol {
    id: number;
    nombre: string;
    descripcion?: string | null;
    created_at?: string;
    updated_at?: string;
}



export interface añoActual {
  anio: number;
  fecha_matriculados?: string | null;
  fecha_1_egresados?: string | null;
  fecha_2_egresados?: string | null;
}

export interface DatoAñoActual {
  anio: number;
  actualizacion?: Actualizacion;
  cue: string;
  cantidad_docentes_carrera?: number | null;
  cantidad_docentes_practica?: number | null;
  cantidad_anio_1?: number | null;
  cantidad_anio_2?: number | null;
  cantidad_anio_3?: number | null;
  cantidad_egresados?: number | null;
  estado_id?: number | null;
  estado?: Estado;
}

export interface instituto {
  cue: string;
  ambito_gestion?: string | null;
  localidad_id?: number | null;
  localidad?: Localidad;
  departamento_id?: number | null;
  departamento: Departamento;
}

// ===== TIPOS PARA COMPONENTES DE EXCEL =====

export interface ExportConfig {
    class: string;
    name: string;
    description: string;
    required_params: string[];
    optional_params: string[];
}

export interface PeriodoActual {
    id: number;
    anio: number;
    fecha_tope: string;
}

export interface ExcelExportComponentProps {
    exportType: string;
    exportConfig: ExportConfig;
    periodoActual?: PeriodoActual;
    provincias: Provincia[];
    aniosDisponibles?: number[];
    exportUrl: string;
    title?: string;
    className?: string;
    showDescription?: boolean;
    customFilters?: React.ReactNode;
    onExportStart?: () => void;
    onExportComplete?: () => void;
    onExportError?: (error: string) => void;
}

export interface ExcelExportGridProps {
    periodoActual?: PeriodoActual;
    provincias: Provincia[];
    aniosDisponibles?: number[];
    exportConfigs: Record<string, ExportConfig>;
    columns?: 1 | 2 | 3 | 4;
    showTitles?: boolean;
    className?: string;
}

export interface ExcelExportExamplesProps {
    periodoActual?: PeriodoActual;
    provincias: Provincia[];
    aniosDisponibles?: number[];
    exportConfigs: Record<string, ExportConfig>;
}

// Tipos para callbacks de eventos
export type ExportStartCallback = () => void;
export type ExportCompleteCallback = () => void;
export type ExportErrorCallback = (error: string) => void;

// Tipos para validación de parámetros
export type ExportParameter = 'anio' | 'provincia_id' | string;
export type ExportParameterValidation = {
    valid: boolean;
    errors: string[];
};

// Tipos para configuración de exportación
export type ExportType = 'formularios' | 'resumen' | 'reporte' | string;
export type ExportColumns = 1 | 2 | 3 | 4;



export interface añoActual {
  anio: number;
  fecha_matriculados?: string | null;
  fecha_1_egresados?: string | null;
  fecha_2_egresados?: string | null;
}

export interface DatoAñoActual {
  anio: number;
  actualizacion?: Actualizacion;
  cue: string;
  cantidad_docentes_carrera?: number | null;
  cantidad_docentes_practica?: number | null;
  cantidad_anio_1?: number | null;
  cantidad_anio_2?: number | null;
  cantidad_anio_3?: number | null;
  cantidad_egresados?: number | null;
  estado_id?: number | null;
  estado?: Estado;
}

export interface instituto {
  cue: string;
  ambito_gestion?: string | null;
  localidad_id?: number | null;
  localidad?: Localidad;
  departamento_id?: number | null;
  departamento: Departamento;
}

// ===== TIPOS PARA COMPONENTES DE EXCEL =====

export interface ExportConfig {
    class: string;
    name: string;
    description: string;
    required_params: string[];
    optional_params: string[];
}

export interface PeriodoActual {
    id: number;
    anio: number;
    fecha_tope: string;
}

export interface ExcelExportComponentProps {
    exportType: string;
    exportConfig: ExportConfig;
    periodoActual?: PeriodoActual;
    provincias: Provincia[];
    aniosDisponibles?: number[];
    exportUrl: string;
    title?: string;
    className?: string;
    showDescription?: boolean;
    customFilters?: React.ReactNode;
    onExportStart?: () => void;
    onExportComplete?: () => void;
    onExportError?: (error: string) => void;
}

export interface ExcelExportGridProps {
    periodoActual?: PeriodoActual;
    provincias: Provincia[];
    aniosDisponibles?: number[];
    exportConfigs: Record<string, ExportConfig>;
    columns?: 1 | 2 | 3 | 4;
    showTitles?: boolean;
    className?: string;
}

export interface ExcelExportExamplesProps {
    periodoActual?: PeriodoActual;
    provincias: Provincia[];
    aniosDisponibles?: number[];
    exportConfigs: Record<string, ExportConfig>;
}

// Tipos para callbacks de eventos
export type ExportStartCallback = () => void;
export type ExportCompleteCallback = () => void;
export type ExportErrorCallback = (error: string) => void;

// Tipos para validación de parámetros
export type ExportParameter = 'anio' | 'provincia_id' | string;
export type ExportParameterValidation = {
    valid: boolean;
    errors: string[];
};

// Tipos para configuración de exportación
export type ExportType = 'formularios' | 'resumen' | 'reporte' | string;
export type ExportColumns = 1 | 2 | 3 | 4;
