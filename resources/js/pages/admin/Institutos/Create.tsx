import Form from "@/components/form/Form";
import FormInput from "@/components/form/FormInput";
import FormSelect from "@/components/form/FormSelect/FormSelect";
import AppLayoutTitle from "@/components/layouts/AppLayoutTitle";
import { AdminLayout } from "@/layouts/AdminLayout";
import { ItemParametrico, Provincia, TipoInstituto } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import axios from "axios";

import { useState, useEffect } from "react";

interface Props {
    tiposDeInstitucion: TipoInstituto[],
    provincias: Provincia[]
}

export default function Create({ tiposDeInstitucion = [], provincias = [] }: Props) {
    const [departamentos, setDepartamentos] = useState([])
    const [localidades, setLocalidades] = useState([])

    const { data, setData, reset, post, processing, errors } = useForm({
        CUE: '',
        nombre: '',
        ambito_gestion: '',
        tipo_instituto: '',
        provincia: '',
        departamento: '',
        localidad: '',
        domicilio: '',
        codigo_postal: '',
        telefono: '',
        email: ''
    });

    //Cada vez que el usuario seleccione provincia o departamento se encarga de actualizar la lista correspondiente
    useEffect(() => {
        async function fetchDepartamentos() {
            if (data.provincia) {
                setLocalidades([])
                const response = await axios.get(route('api.provincia.departamentos', { id: data.provincia }), { withCredentials: true });
                setDepartamentos(response.data)
            } else {
                setDepartamentos([])
                setLocalidades([])
            }
        }
        fetchDepartamentos();
    }, [data.provincia])

    useEffect(() => {
        async function fetchLocalidades() {
            if (data.departamento) {
                const response = await axios.get(route('api.departamento.localidades', { id: data.departamento }));
                setLocalidades(response.data)
            } else {
                setDepartamentos([])
                setLocalidades([])
            }
        }
        fetchLocalidades();
    }, [data.departamento])

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        post(route('admin.institutos.store'));
       
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

    return <AdminLayout>
        <Head>
            <title>Agregar Institutos</title>
        </Head>

        <AppLayoutTitle title="Agregar Instituto" />

        <div className="grid grid-cols-12 gap-6 mt-5">
            <div className="intro-y col-span-12">
                <Form onReset={() => reset()} onSubmit={onSubmit} procesing={processing} backHref={route('admin.institutos.index')}>
                    <div className="sm:grid grid-cols-1 gap-2">

                        <FormInput name="CUE" placeholder="CUE" type="number"
                            onChange={onChange} value={data.CUE} errors={errors} />
                    </div>

                    <div className="sm:grid grid-cols-1 gap-2 mt-3">
                        <FormInput name="nombre" placeholder="Nombre Institución" type="text-area"
                            onChange={onChange} value={data.nombre} errors={errors} />
                    </div>

                    <div className="sm:grid grid-cols-2 gap-2 mt-3">
                        <FormSelect name="tipo_instituto" placeholder="Seleccione un Tipo de Institución" label="Tipo de Institución"
                            onChange={onChange} value={data.tipo_instituto} multiple={false} canDeselect={false} errors={errors} items={arrayToSelectItems(tiposDeInstitucion)} />

                        <FormSelect name="ambito_gestion" placeholder="Seleccione un Ambito de Gestión" label="Ambito de Gestión"
                            onChange={onChange} value={data.ambito_gestion} multiple={false} canDeselect={false} errors={errors}
                            items={[{ label: "Estatal", value: "E" }, { label: "Privado", value: "P" }]} />
                    </div>

                    <div className="sm:grid grid-cols-2 gap-2 mt-3">
                        <FormSelect name="provincia" placeholder="Seleccione una Provincia" label="Provincia"
                            onChange={onChange} value={data.provincia} multiple={false} canDeselect={false} errors={errors} items={arrayToSelectItems(provincias)} />

                        <FormSelect name="departamento" placeholder="Seleccione un Departamento" label="Departamento" disabled={!data.provincia}
                            onChange={onChange} value={data.departamento} multiple={false} canDeselect={false} errors={errors} items={arrayToSelectItems(departamentos)} />
                    </div>

                    <div className="sm:grid grid-cols-3 gap-2 mt-3">
                        <FormSelect name="localidad" placeholder="Seleccione una Localidad" label="Localidad" disabled={!data.departamento}
                            onChange={onChange} value={data.localidad} multiple={false} canDeselect={false} errors={errors} items={arrayToSelectItems(localidades)} />

                        <FormInput name="codigo_postal" placeholder="Código Postal" type="number"
                            onChange={onChange} value={data.codigo_postal} errors={errors} />

                        <FormInput name="domicilio" placeholder="Domicilio" type="text"
                            onChange={onChange} value={data.domicilio} errors={errors} />
                    </div>

                    <div className="sm:grid grid-cols-2 gap-2 mt-3">
                        <FormInput name="telefono" placeholder="Teléfono" type="text"
                            onChange={onChange} value={data.telefono} errors={errors} />

                        <FormInput name="email" placeholder="Mail" type="email"
                            onChange={onChange} value={data.email} errors={errors} />
                    </div>
                </Form>
            </div>
        </div>
    </AdminLayout>;
}
