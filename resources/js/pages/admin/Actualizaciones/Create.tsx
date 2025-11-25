import Form from "@/components/form/Form";
import FormInput from "@/components/form/FormInput";
import FormSelect from "@/components/form/FormSelect/FormSelect";
import AppIcon from "@/components/Icons/AppIcon";
import AppLayoutTitle from "@/components/layouts/AppLayoutTitle";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";

interface Actualizacion {
    anio: number;
    fecha_matriculados: string;
    fecha_1_egresados: string;
    fecha_2_egresados: string;
    fecha_tope: string;
}

interface Props {
    actualizaciones: Actualizacion[];
}

export default function Create({ actualizaciones = [] }: Props) {
    const currentYear = new Date().getFullYear();
    const years = [...actualizaciones.map(a => a.anio), currentYear]
        .filter((v, i, arr) => arr.indexOf(v) === i)
        .sort((a, b) => b - a);

    const [selectedYear, setSelectedYear] = useState(currentYear);

    const actualizacion = actualizaciones.find(a => a.anio === selectedYear);
    const registroExiste = !!actualizacion;

    // Estado para modo edición de fecha tope
    const [editMode, setEditMode] = useState(false);

    // Función helper fuera del componente o dentro pero simplificada
    const fechaFormateada = (isoDate: any): string => {
        if (!isoDate) return '';
        return isoDate.split('T')[0]; // Método más simple y confiable
    };

    const { data, setData, reset, post, processing, errors } = useForm({
        anio: selectedYear,
        fecha_matriculados: fechaFormateada(actualizacion?.fecha_matriculados),
        fecha_1_egresados: fechaFormateada(actualizacion?.fecha_1_egresados),
        fecha_2_egresados: fechaFormateada(actualizacion?.fecha_2_egresados),
        fecha_tope: fechaFormateada(actualizacion?.fecha_tope),
    });

    useEffect(() => {
        setEditMode(false); // Al cambiar año, salir de modo edición
        setData('anio', selectedYear);
        setData('fecha_matriculados', fechaFormateada(actualizacion?.fecha_matriculados));
        setData('fecha_1_egresados', fechaFormateada(actualizacion?.fecha_2_egresados));
        setData('fecha_2_egresados', fechaFormateada(actualizacion?.fecha_2_egresados));
        setData('fecha_tope', fechaFormateada(actualizacion?.fecha_tope));
    }, [selectedYear]);

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        post(route('admin.actualizaciones.store'), {
            onSuccess: () => {
                setEditMode(false);
            }
        });
    }

    function onChange(event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        const { name, value } = event.target;
        setData(name as keyof typeof data, value);
    }

    // Lógica para el botón y los campos
    const esAnioActual = selectedYear === currentYear;
    const mostrarEditar = registroExiste && esAnioActual && !editMode;
    const mostrarGuardar = (!registroExiste && esAnioActual) || (registroExiste && esAnioActual && editMode);

    return (
        <AdminLayout>
            <Head>
                <title>Actualización de Datos</title>
            </Head>
            <AppLayoutTitle title="Actualización de Datos" />
            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="intro-y col-span-12">
                    <Form onReset={() => reset()} onSubmit={onSubmit} procesing={processing} backHref={route('admin.dashboard')} showButtons={false}>
                        <div className="sm:grid grid-cols-2 gap-2">
                            <FormSelect
                                name="anio"
                                label="Año"
                                items={years.map(y => ({ value: y.toString(), label: y.toString() }))}
                                value={data.anio.toString()}
                                onChange={e => setSelectedYear(Number(e.target.value))}
                                errors={errors}
                                multiple={false}
                                canDeselect={false}
                                placeholder="Seleccione año"
                            />
                            <FormInput
                                name="fecha_matriculados"
                                placeholder="Fecha Matriculados"
                                type="date"
                                onChange={onChange}
                                value={data.fecha_matriculados}
                                errors={errors}
                                disabled={registroExiste || selectedYear !== currentYear}
                            />
                        </div>
                        <div className="sm:grid grid-cols-2 gap-2 mt-3">
                            <FormInput
                                name="fecha_1_egresados"
                                placeholder="Fecha 1 Egresados"
                                type="date"
                                onChange={onChange}
                                value={data.fecha_1_egresados}
                                errors={errors}
                                disabled={registroExiste || selectedYear !== currentYear}
                            />
                            <FormInput
                                name="fecha_2_egresados"
                                placeholder="Fecha 2 Egresados"
                                type="date"
                                onChange={onChange}
                                value={data.fecha_2_egresados}
                                errors={errors}
                                disabled={registroExiste || selectedYear !== currentYear}
                            />
                        </div>
                        <div className="sm:grid grid-cols-2 gap-2 mt-3">
                            <FormInput
                                name="fecha_tope"
                                placeholder="Fecha Tope"
                                type="date"
                                onChange={onChange}
                                value={data.fecha_tope}
                                errors={errors}
                                disabled={
                                    // Si no existe registro y es año actual: activo
                                    (!registroExiste && esAnioActual) ? false :
                                        // Si existe registro y es año actual y está en modo edición: activo
                                        (registroExiste && esAnioActual && editMode) ? false :
                                            // En cualquier otro caso: bloqueado
                                            true
                                }
                            />
                        </div>
                        <div className="mt-6 flex justify-end">
                            {mostrarEditar && (
                                <button
                                    type="button"
                                    className="btn btn-primary p-3 w-25"
                                    onClick={() => setEditMode(true)}
                                >
                                    <AppIcon name="edit" className="w-5 h-5 mr-2" />
                                    Editar
                                </button>
                            )}
                            {mostrarGuardar && (
                                <button
                                    type="submit"
                                    className="btn btn-primary p-3 w-25"
                                    disabled={processing}
                                >
                                    {processing && <AppIcon name="tail-spin" size={38} className="w-5 h-5 mr-2" />}
                                    {!processing && <AppIcon name="save" className="w-5 h-5 mr-2" />}
                                    Guardar
                                </button>
                            )}
                            {/* Registros pasados: botón desactivado */}
                            {!esAnioActual && (
                                <button
                                    type="button"
                                    className="btn btn-primary p-3 w-25"
                                    disabled
                                >
                                    <AppIcon name="edit" className="w-5 h-5 mr-2" />
                                    Editar
                                </button>
                            )}
                        </div>
                    </Form>
                </div>
            </div>
        </AdminLayout>
    );
}