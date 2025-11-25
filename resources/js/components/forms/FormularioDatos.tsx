import React from 'react';
import Form from '@/components/form/Form';
import FormInput from '@/components/form/FormInput';
import FormSelect from '@/components/form/FormSelect/FormSelect';

interface Cargo {
  id: number;
  descripcion: string;
}

interface FormularioDatosProps {
  instituto?: {
    cue: string;
    nombre: string;
    direccion?: string;
    localidad?: string;
    codigo_postal?: string;
    telefono?: string;
    email?: string;
    tipo_instituto?: {
      id: number;
      descripcion: string;
    };
  };
  autoridadInstitucional?: {
    nombre_apellido?: string;
    cargo_id?: number;
    telefono?: string;
    email?: string;
  };
  autoridadCarrera?: {
    nombre_apellido?: string;
    cargo_id?: number;
    telefono?: string;
    email?: string;
  };
  datos?: {
    cantidad_docentes_carrera?: number;
    cantidad_docentes_practica?: number;
    cantidad_anio_1?: number;
    cantidad_anio_2?: number;
    cantidad_anio_3?: number;
    cantidad_egresados?: number;
    monto_anual?: number;
    monto_mensual?: number;
    cantidad_cuota?: number;
    monto_extracurricular?: number;
    observaciones?: string;
  };
  anio?: number;
  cargosInstitucionales?: Cargo[];
  cargosCarrera?: Cargo[];
  onSubmit?: (data: any) => void;
  onChange?: (field: string, value: any) => void;
  processing?: boolean;
  errors?: any;
  readonly?: boolean;
}

export default function FormularioDatos({
  instituto = { cue: '', nombre: '' },
  autoridadInstitucional = {},
  autoridadCarrera = {},
  datos = {},
  anio = new Date().getFullYear(),
  cargosInstitucionales = [],
  cargosCarrera = [],
  onSubmit,
  onChange,
  processing = false,
  errors = {},
  readonly = false
}: FormularioDatosProps) {
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (readonly) return; // No permitir cambios en modo readonly
    
    const { target } = e;
    const field = target.id;
    let value: any = target.value;
    
    // Convertir números
    if (target.type === 'number') {
      value = parseFloat(value) || 0;
    }
    
    if (onChange) {
      onChange(field, value);
    }
  };

  const handleSelectChange = (e: any) => {
    if (readonly) return; // No permitir cambios en modo readonly
    
    const { target } = e;
    const field = target.id;
    const value = target.value ? parseInt(target.value) : null;
    
    if (onChange) {
      onChange(field, value);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (readonly) return; // No permitir envío en modo readonly
    
    if (onSubmit) {
      onSubmit({
        instituto,
        autoridadInstitucional,
        autoridadCarrera,
        datos,
        anio
      });
    }
  };

  // Convertir cargos a formato SelectItem
  const cargosInstitucionalesItems = cargosInstitucionales.map(cargo => ({
    value: cargo.id.toString(),
    label: cargo.descripcion
  }));

  const cargosCarreraItems = cargosCarrera.map(cargo => ({
    value: cargo.id.toString(),
    label: cargo.descripcion
  }));

  return (
    <div className="grid grid-cols-12 gap-4 mt-3">
      <div className="intro-y col-span-12">
        <div className="intro-y box p-4">
          <div className="border border-slate-200/60 dark:border-darkmode-400 rounded-md p-4">
            
            <Form onReset={() => {}} onSubmit={handleSubmit} procesing={processing} showButtons={!readonly} disabled={readonly}>
              {/* Información del Instituto */}
              <div className="mb-4">
                {/* CUE - 1 fila ocupa todo el ancho */}
                <div className="mb-2">
                  <FormInput 
                    name="instituto.cue" 
                    placeholder="CUE:" 
                    type="text"
                    onChange={handleInputChange} 
                    value={instituto.cue || ''} 
                    errors={errors}
                  />
                </div>

                {/* Institución - 1 fila ocupa todo el ancho */}
                <div className="mb-2">
                  <FormInput 
                    name="instituto.nombre" 
                    placeholder="Institución:" 
                    type="text"
                    onChange={handleInputChange} 
                    value={instituto.nombre || ''} 
                    errors={errors}
                  />
                </div>

                {/* Domicilio - 1 fila ocupa todo el ancho */}
                <div className="mb-2">
                  <FormInput 
                    name="instituto.direccion" 
                    placeholder="Domicilio:" 
                    type="text"
                    onChange={handleInputChange} 
                    value={instituto.direccion || ''} 
                    errors={errors}
                  />
                </div>

                {/* Localidad y Código postal - 1 fila 2 columnas 50% cada una */}
                <div className="mb-2">
                  <div className="sm:grid grid-cols-2 gap-4">
                    <div>
                      <FormInput 
                        name="instituto.localidad" 
                        placeholder="Localidad:" 
                        type="text"
                        onChange={handleInputChange} 
                        value={instituto.localidad || ''} 
                        errors={errors}
                      />
                    </div>
                    <div>
                      <FormInput 
                        name="instituto.codigo_postal" 
                        placeholder="Código postal:" 
                        type="text"
                        onChange={handleInputChange} 
                        value={instituto.codigo_postal || ''} 
                        errors={errors}
                      />
                    </div>
                  </div>
                </div>

                {/* Teléfono - 1 fila ocupa todo el ancho */}
                <div className="mb-2">
                  <FormInput 
                    name="instituto.telefono" 
                    placeholder="Teléfono:" 
                    type="text"
                    onChange={handleInputChange} 
                    value={instituto.telefono || ''} 
                    errors={errors} 
                  />
                </div>

                {/* Email - 1 fila ocupa todo el ancho */}
                <div className="mb-2">
                  <FormInput 
                    name="instituto.email" 
                    placeholder="e-mail:" 
                    type="email"
                    onChange={handleInputChange} 
                    value={instituto.email || ''} 
                    errors={errors} 
                  />
                </div>
              </div>

              {/* Autoridad Institucional */}
              <div className="mb-4">
                {/* Autoridad institucional - 1 fila ocupa todo el ancho */}
                <div className="mb-2">
                  <div className="text-sm font-medium text-slate-700 mb-2">Autoridad institucional:</div>
                </div>

                {/* Cargo - 1 fila ocupa todo el ancho */}
                <div className="mb-2">
                  <FormSelect
                    name="autoridadInstitucional.cargo_id"
                    label="Cargo:"
                    items={cargosInstitucionalesItems}
                    value={autoridadInstitucional.cargo_id?.toString() || null}
                    multiple={false}
                    canDeselect={true}
                    placeholder="Seleccionar cargo..."
                    onChange={handleSelectChange}
                    errors={errors}
                  />
                </div>

                {/* Teléfono celular - 1 fila ocupa todo el ancho */}
                <div className="mb-2">
                  <FormInput 
                    name="autoridadInstitucional.telefono" 
                    placeholder="Teléfono celular:" 
                    type="text"
                    onChange={handleInputChange} 
                    value={autoridadInstitucional.telefono || ''} 
                    errors={errors} 
                  />
                </div>

                {/* Email - 1 fila ocupa todo el ancho */}
                <div className="mb-2">
                  <FormInput 
                    name="autoridadInstitucional.email" 
                    placeholder="e-mail:" 
                    type="email"
                    onChange={handleInputChange} 
                    value={autoridadInstitucional.email || ''} 
                    errors={errors} 
                  />
                </div>
              </div>

              {/* Autoridad de la Carrera */}
              <div className="mb-4">
                {/* Autoridad de la carrera - 1 fila ocupa todo el ancho */}
                <div className="mb-2">
                  <div className="text-sm font-medium text-slate-700 mb-2">Autoridad de la carrera:</div>
                </div>

                {/* Cargo - 1 fila ocupa todo el ancho */}
                <div className="mb-2">
                  <FormSelect
                    name="autoridadCarrera.cargo_id"
                    label="Cargo:"
                    items={cargosCarreraItems}
                    value={autoridadCarrera.cargo_id?.toString() || null}
                    multiple={false}
                    canDeselect={true}
                    placeholder="Seleccionar cargo..."
                    onChange={handleSelectChange}
                    errors={errors}
                  />
                </div>

                {/* Teléfono celular - 1 fila ocupa todo el ancho */}
                <div className="mb-2">
                  <FormInput 
                    name="autoridadCarrera.telefono" 
                    placeholder="Teléfono celular:" 
                    type="text"
                    onChange={handleInputChange} 
                    value={autoridadCarrera.telefono || ''} 
                    errors={errors} 
                  />
                </div>

                {/* Email - 1 fila ocupa todo el ancho */}
                <div className="mb-2">
                  <FormInput 
                    name="autoridadCarrera.email" 
                    placeholder="e-mail:" 
                    type="email"
                    onChange={handleInputChange} 
                    value={autoridadCarrera.email || ''} 
                    errors={errors} 
                  />
                </div>
              </div>

              {/* Datos Académicos */}
              <div className="mb-4">
                {/* Total de docentes comparte fila con número de docentes */}
                <div className="sm:grid grid-cols-2 gap-4 mb-2">
                  <div>
                    <FormInput 
                      name="datos.cantidad_docentes_carrera" 
                      placeholder="Total de docentes de la Carrera:" 
                      type="number"
                      onChange={handleInputChange} 
                      value={datos.cantidad_docentes_carrera || ''} 
                      errors={errors} 
                    />
                  </div>
                  <div>
                    <FormInput 
                      name="datos.cantidad_docentes_practica" 
                      placeholder="Número de docentes de:" 
                      type="number"
                      onChange={handleInputChange} 
                      value={datos.cantidad_docentes_practica || ''} 
                      errors={errors} 
                    />
                  </div>
                </div>

                {/* Alumnos matriculados al 30 de abril del (año) - 1 fila 1 label centrado */}
                <div className="mb-4">
                  <div className="text-sm font-medium text-slate-700 text-center mb-3">
                    Alumnos matriculados al 30 de abril de {anio}
                  </div>
                </div>

                {/* Primer año comparte fila con segundo año y tercer año */}
                <div className="sm:grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <FormInput 
                      name="datos.cantidad_anio_1" 
                      placeholder="Primer año:" 
                      type="number"
                      onChange={handleInputChange} 
                      value={datos.cantidad_anio_1 || ''} 
                      errors={errors} 
                    />
                  </div>
                  <div>
                    <FormInput 
                      name="datos.cantidad_anio_2" 
                      placeholder="Segundo año:" 
                      type="number"
                      onChange={handleInputChange} 
                      value={datos.cantidad_anio_2 || ''} 
                      errors={errors} 
                    />
                  </div>
                  <div>
                    <FormInput 
                      name="datos.cantidad_anio_3" 
                      placeholder="Tercer año:" 
                      type="number"
                      onChange={handleInputChange} 
                      value={datos.cantidad_anio_3 || ''} 
                      errors={errors} 
                    />
                  </div>
                </div>

                {/* Egresados entre el 1 de mayo de (año anterior) al 30 de abril del (año actual) - 1 fila 1 label y 1 input */}
                <div className="mb-2">
                  <FormInput 
                    name="datos.cantidad_egresados" 
                    placeholder={`Egresados entre el 1 de mayo de ${anio - 1} y el 30 de abril de ${anio}:`} 
                    type="number"
                    onChange={handleInputChange} 
                    value={datos.cantidad_egresados || ''} 
                    errors={errors} 
                  />
                </div>
              </div>

              {/* Sección de Montos - Solo para institutos no estatales */}
              {instituto.tipo_instituto?.descripcion !== 'Estatal' && (
                <div className="mb-4">
                  {/* Líneas rojas de separación */}
                  <div className="border-t-2 border-red-500 mb-2"></div>
                  
                  {/* Datos de carácter de declaración jurada - 1 fila 1 label centrado */}
                  <div className="mb-2">
                    <div className="text-red-600 text-sm font-medium text-center">
                      Estos datos revisten el caracter de Declaración Jurada
                    </div>
                  </div>
                  
                  {/* Monto de la matrícula anual comparte columna con monto de la cuota mensual */}
                  <div className="sm:grid grid-cols-2 gap-4 mb-2">
                    <div>
                      <FormInput 
                        name="datos.monto_anual" 
                        placeholder="Monto de la matrícula anual:" 
                        type="number"
                        onChange={handleInputChange} 
                        value={datos.monto_anual || ''} 
                        errors={errors}
                      />
                    </div>
                    <div>
                      <FormInput 
                        name="datos.monto_mensual" 
                        placeholder="Monto de la cuota mensual:" 
                        type="number"
                        onChange={handleInputChange} 
                        value={datos.monto_mensual || ''} 
                        errors={errors}
                      />
                    </div>
                  </div>

                  {/* Cantidad de cuotas en el año comparte fila con monto de la cuota mensual por actividades extracurriculares */}
                  <div className="sm:grid grid-cols-2 gap-4 mb-2">
                    <div>
                      <FormInput 
                        name="datos.cantidad_cuota" 
                        placeholder="Cantidad de cuotas en el año:" 
                        type="number"
                        onChange={handleInputChange} 
                        value={datos.cantidad_cuota || ''} 
                        errors={errors}
                      />
                    </div>
                    <div>
                      <FormInput 
                        name="datos.monto_extracurricular" 
                        placeholder="Monto de la cuota mensual por actividades extracurriculares:" 
                        type="number"
                        onChange={handleInputChange} 
                        value={datos.monto_extracurricular || ''} 
                        errors={errors}
                      />
                    </div>
                  </div>
                  
                  {/* Línea roja de separación inferior */}
                  <div className="border-t-2 border-red-500 mt-2"></div>
                </div>
              )}

              {/* Comentarios */}
              <div className="mb-4">
                <FormInput 
                  name="datos.observaciones" 
                  placeholder="Comentarios:" 
                  type="text"
                  onChange={handleInputChange} 
                  value={datos.observaciones || ''} 
                  errors={errors} 
                />
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
