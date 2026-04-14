import AppLayoutTitle from "@/components/layouts/AppLayoutTitle";
import { InstitutoLayout } from "@/layouts/InstitutoLayout";
import Form from "@/components/form/Form";
import FormInput from "@/components/form/FormInput";
import FormSelect from "@/components/form/FormSelect/FormSelect";
import { Actualizacion, Instituto, ItemParametrico, Localidad, TipoInstituto, Dato, Autoridad } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import AppIcon from "@/components/Icons/AppIcon";
import { useState } from "react";

import { router } from "@inertiajs/react";

interface Props {
    tiposDeInstitucion: TipoInstituto[],
    localidades: Localidad[],
    instituto: Instituto,
    actualizacion: Actualizacion,
    estadoActualizacion: number | null,
    datos: Dato | null,
    autoridades: Autoridad[] | null,
    autoridadesHeredadas?: boolean
}

export default function DashboardIndex({ tiposDeInstitucion: _tiposDeInstitucion = [], localidades = [], instituto,
    actualizacion, estadoActualizacion, datos, autoridades, autoridadesHeredadas = false }: Props) {

    // Estado para controlar el bloqueo/desbloqueo de autoridades heredadas
    const [isAuthoritiesLocked, setIsAuthoritiesLocked] = useState(autoridadesHeredadas);

    const autoridadInstituto = autoridades?.find(autoridad => autoridad.cargo?.instituto_carrera === 'I');
    const autoridadCarrera = autoridades?.find(autoridad => autoridad.cargo?.instituto_carrera === 'C');

    const defaultData = {
        anio: actualizacion?.anio || '',

        CUE: instituto?.cue || '',
        nombre: instituto?.nombre || '',
        ambito_gestion: instituto?.ambito_gestion || '',
        tipo_instituto: instituto?.tipo_instituto_id?.toString() || '',
        localidad: instituto?.localidad_id?.toString() || '',
        domicilio: instituto?.direccion || '',
        codigo_postal: instituto?.codigo_postal || '',
        telefono: instituto?.telefono || '',
        email: instituto?.email || '',

        autoridad_institucional_nombre_apellido: autoridadInstituto?.nombre_apellido || '',
        autoridad_institucional_cargo: autoridadInstituto?.cargo?.descripcion || '',
        autoridad_institucional_telefono: autoridadInstituto?.telefono || '',
        autoridad_institucional_email: autoridadInstituto?.email || '',

        autoridad_carrera_nombre_apellido: autoridadCarrera?.nombre_apellido || '',
        autoridad_carrera_cargo: autoridadCarrera?.cargo?.descripcion || '',
        autoridad_carrera_telefono: autoridadCarrera?.telefono || '',
        autoridad_carrera_email: autoridadCarrera?.email || '',

        monto_anual: datos?.monto_anual || '',
        monto_mensual: datos?.monto_mensual || '',
        cantidad_cuota: datos?.cantidad_cuota || '',
        monto_extracurricular: datos?.monto_extracurricular || '',

        cantidad_docentes_carrera: datos?.cantidad_docentes_carrera || '',
        cantidad_docentes_practica: datos?.cantidad_docentes_practica || '',

        cantidad_anio_1: datos?.cantidad_anio_1 || '',
        cantidad_anio_2: datos?.cantidad_anio_2 || '',
        cantidad_anio_3: datos?.cantidad_anio_3 || '',
        cantidad_egresados: datos?.cantidad_egresados || '',
        observaciones: datos?.observaciones || ''
    }

    const { data, setData, reset, post, processing, errors } = useForm(defaultData);

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        post(route('instituto.actualizacion.update'));
    }

    function onChange(event) {
        const { target } = event;

        setData(target.id as keyof typeof data, target.value);
    }

    function arrayToSelectItems(array: ItemParametrico[]): SelectItem[] {
        return array.map((item: ItemParametrico) => ({
            label: item.descripcion,
            value: item.id.toString(),
        })) as SelectItem[];
    }

    function handleEnviar() {
        router.post(route('instituto.datos.send'), { 
            id: datos?.id,
            localidad_id: data?.localidad
        })
    }

    function isFormModified(): boolean { //Verifico si el formulario fue modificado, asi el usuario no puede enviar un formulario sin antes guardarlo (Solución de vago basicamente)
        return JSON.stringify(data) !== JSON.stringify(defaultData);
    }

    if (!actualizacion)
        return <InstitutoLayout>
            <Head>
                <title>Actualización de Datos</title>
            </Head>
            <AppLayoutTitle title="La actualización de datos del año actual aún no está lista, por favor aguarde a ser notificado." />
        </InstitutoLayout>

    return <InstitutoLayout>
        <Head>
            <title>Actualización de Datos</title>
        </Head>

        <AppLayoutTitle title={`Actualización de datos ${actualizacion.anio}`} />
        {
            estadoActualizacion === 4 &&
            <p className="text-red-500">
                Su carga de datos fue rechazada luego de su revisión, por favor compruebe los datos cargados.
            </p>
        }
        {
            estadoActualizacion === 1 &&
            <p>Los datos se encuentran almacenados para su visualización, si desea enviarlos presione el botón de "enviar"</p>
        }
        {
            (estadoActualizacion === null || estadoActualizacion === 1 || estadoActualizacion === 4) ? //Si no hay actualización cargada, esta pendiente o está rechazada
                <div className="grid grid-cols-12 gap-6 mt-5"> {/* Se muestra el formulario */}
                    <div className="intro-y col-span-12">
                        <Form onReset={() => reset()} onSubmit={onSubmit} procesing={processing}>
                            <div className="sm:grid grid-cols-1 gap-2">
                                <h3 className="text-lg font-bold">Información del Instituto</h3>
                                <FormInput name="CUE" placeholder="CUE" type="number"
                                    onChange={onChange} value={data.CUE} errors={errors}
                                    disabled={true} />
                            </div>

                            <div className="sm:grid grid-cols-1 gap-2 mt-3">
                                <FormInput name="nombre" placeholder="Nombre Institución" type="text-area"
                                    onChange={onChange} value={data.nombre} errors={errors} />
                            </div>

                            <div className="sm:grid grid-cols-1 gap-2 mt-3">
                                <FormInput name="domicilio" placeholder="Domicilio" type="text"
                                    onChange={onChange} value={data.domicilio} errors={errors} />
                            </div>

                            <div className="sm:grid grid-cols-2 gap-2 mt-3">
                                <FormSelect name="localidad" placeholder="Seleccione una Localidad" label="Localidad"
                                    onChange={onChange} value={data.localidad} multiple={false} canDeselect={false} errors={errors} items={arrayToSelectItems(localidades)} />

                                <FormInput name="codigo_postal" placeholder="Código Postal" type="number"
                                    onChange={onChange} value={data.codigo_postal} errors={errors} />
                            </div>

                            <div className="sm:grid grid-cols-2 gap-2 mt-3">
                                <FormInput name="telefono" placeholder="Teléfono" type="text"
                                    onChange={onChange} value={data.telefono} errors={errors} />
                            </div>

                            <div className="mt-3">
                                <h3 className="text-lg font-bold">Autoridad Institucional</h3>
                                
                                {/* Banner para autoridades cargadas del año anterior */}
                                {autoridadesHeredadas && isAuthoritiesLocked && (
                                    <div className="mt-3 mb-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-semibold text-yellow-800 mb-1">
                                                    ⚠️ Autoridades Cargadas del Año Anterior
                                                </p>
                                                <p className="text-sm text-yellow-700">
                                                    Los datos de las autoridades han sido cargados del año anterior. Si necesita hacer cambios, presione el botón "Editar Autoridades".
                                                </p>
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => setIsAuthoritiesLocked(false)}
                                                className="btn btn-primary ml-4"
                                            >
                                                Editar Autoridades
                                            </button>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="sm:grid grid-cols-2 gap-2 mt-3">
                                    <FormInput name="autoridad_institucional_nombre_apellido" placeholder="Nombre y Apellido" type="text"
                                        onChange={onChange} value={data.autoridad_institucional_nombre_apellido} errors={errors} disabled={isAuthoritiesLocked && autoridadesHeredadas} />
                                    <FormInput name="autoridad_institucional_cargo" placeholder="Cargo" type="text"
                                        onChange={onChange} value={data.autoridad_institucional_cargo} errors={errors} disabled={isAuthoritiesLocked && autoridadesHeredadas} />
                                </div>
                                <div className="sm:grid grid-cols-2 gap-2 mt-3">
                                    <FormInput name="autoridad_institucional_telefono" placeholder="Teléfono celular" type="text"
                                        onChange={onChange} value={data.autoridad_institucional_telefono} errors={errors} disabled={isAuthoritiesLocked && autoridadesHeredadas} />
                                    <FormInput name="autoridad_institucional_email" placeholder="E-mail" type="text"
                                        onChange={onChange} value={data.autoridad_institucional_email} errors={errors} disabled={isAuthoritiesLocked && autoridadesHeredadas} />
                                </div>
                            </div>

                            <div className="mt-3">
                                <h3 className="text-lg font-bold">Autoridad Carrera</h3>
                                <div className="sm:grid grid-cols-2 gap-2 mt-3">
                                    <FormInput name="autoridad_carrera_nombre_apellido" placeholder="Nombre y Apellido" type="text"
                                        onChange={onChange} value={data.autoridad_carrera_nombre_apellido} errors={errors} disabled={isAuthoritiesLocked && autoridadesHeredadas} />
                                    <FormInput name="autoridad_carrera_cargo" placeholder="Cargo" type="text"
                                        onChange={onChange} value={data.autoridad_carrera_cargo} errors={errors} disabled={isAuthoritiesLocked && autoridadesHeredadas} />
                                </div>
                                <div className="sm:grid grid-cols-2 gap-2 mt-3">
                                    <FormInput name="autoridad_carrera_telefono" placeholder="Teléfono celular" type="text"
                                        onChange={onChange} value={data.autoridad_carrera_telefono} errors={errors} disabled={isAuthoritiesLocked && autoridadesHeredadas} />
                                    <FormInput name="autoridad_carrera_email" placeholder="E-mail" type="text"
                                        onChange={onChange} value={data.autoridad_carrera_email} errors={errors} disabled={isAuthoritiesLocked && autoridadesHeredadas} />
                                </div>
                            </div>

                            {
                                data.ambito_gestion === "P" &&
                                <div className="mt-3 rounded-xl border border-red-500 p-3">
                                    <h3 className="text-lg font-bold">Información de Matrícula</h3>
                                    <div className="sm:grid grid-cols-2 gap-2">
                                        <FormInput name="monto_anual" placeholder="Monto de la matrícula anual" type="text"
                                            onChange={onChange} value={data.monto_anual} errors={errors} />
                                        <p className="text-red-500">Estos datos revisten el carácter de Declaración Jurada</p>
                                    </div>
                                    <div className="sm:grid grid-cols-2 gap-2 mt-3">
                                        <FormInput name="monto_mensual" value={data.monto_mensual} type="text" placeholder="Cuota Mensual"
                                            onChange={onChange} errors={errors} />
                                        <FormInput name="cantidad_cuota" value={data.cantidad_cuota} type="text"
                                            placeholder="Cantidad de cuotas en el año" onChange={onChange} errors={errors} />
                                    </div>
                                    <div className="sm:grid grid-cols-1 mt-3">
                                        <FormInput name="monto_extracurricular" value={data.monto_extracurricular} type="text"
                                            placeholder="Monto de la cuota mensual por actividades extracurriculares:" onChange={onChange} errors={errors} />
                                    </div>
                                </div>
                            }

                            <div className="mt-3">
                                <h3 className="text-lg font-bold">Docentes de la Carrera</h3>
                                <div className="sm:grid grid-cols-2 gap-5 mt-3">
                                    <FormInput name="cantidad_docentes_carrera" value={data.cantidad_docentes_carrera} type="text"
                                        label="Total de docentes de la Carrera" placeholder="0"
                                        onChange={onChange} errors={errors} />
                                    <FormInput name="cantidad_docentes_practica" value={data.cantidad_docentes_practica} type="text"
                                        label="Número de docentes de Prácticas" placeholder="0"
                                        onChange={onChange} errors={errors} />
                                </div>
                            </div>

                            <div className="mt-3">
                                <h3 className="text-lg font-bold">Alumnos matriculados al {actualizacion.fecha_matriculados}</h3>
                                <div className="sm:grid grid-cols-3 gap-5 mt-3">
                                    <FormInput name="cantidad_anio_1" value={data.cantidad_anio_1} type="text"
                                        label="Matriculados primer año:" placeholder="0"
                                        onChange={onChange} errors={errors} />
                                    <FormInput name="cantidad_anio_2" value={data.cantidad_anio_2} type="text"
                                        label="Matriculados segundo año:" placeholder="0"
                                        onChange={onChange} errors={errors} />
                                    <FormInput name="cantidad_anio_3" value={data.cantidad_anio_3} type="text"
                                        label="Marticulados tercer año:" placeholder="0"
                                        onChange={onChange} errors={errors} />
                                </div>
                            </div>

                            <div className="mt-3">
                                <FormInput name="cantidad_egresados" value={data.cantidad_egresados} type="text"
                                    label={`Egresados entre el ${actualizacion.fecha_1_egresados} y el ${actualizacion.fecha_2_egresados}`}
                                    placeholder="Cantidad de Egresados" onChange={onChange} errors={errors} />
                            </div>

                            <div className="mt-3">
                                <FormInput name="observaciones" value={data.observaciones} type="text"
                                    placeholder="Observaciones" label="Observaciones (Opcional)" onChange={onChange} errors={errors} />
                            </div>
                            <div className="mt-3 text-right">
                                {
                                    //Solo se puede enviar si:
                                    (datos //Hay datos
                                        &&
                                        !isFormModified()) ? // El formulario no fue modificado (o sea, no hay datos sin guardar)
                                        <button type="button" className="btn btn-primary p-3 w-25" onClick={handleEnviar}>
                                            <AppIcon name="send" className="w-5 h-5 mr-2"></AppIcon>
                                            Enviar
                                        </button>
                                        : //Si no hay datos o el formulario fue modificado
                                        <p className="text-md text-red-500">Cambios sin guardar - Guarde el formulario antes de poder enviarlo.</p>
                                }

                            </div>
                        </Form>
                    </div>
                </div>
                : //Si no está nulo, pendiente o rechazado
                (
                    estadoActualizacion === 2 ? //Si está enviado
                        <h2>¡Su formulario ya fue enviado, gracias! Recibirá una respuesta una vez sea finalizada la revisión.</h2>
                        : // Si no está nulo, pendiente, enviado o rechazado significa que está aprobado
                        <h2>¡Ya cargó los datos correctamente! El próximo año será notificado nuevamente para realizar otra carga, gracias.</h2>
                )
        }
    </InstitutoLayout>;
}
