import Form from '@/components/form/Form';
import FormInput from '@/components/form/FormInput';
import FormSelect from '@/components/form/FormSelect/FormSelect';
import AppLayoutTitle from '@/components/layouts/AppLayoutTitle';
import { AdminLayout } from '@/layouts/AdminLayout';
import { Instituto, ItemParametrico, Localidad, Provincia, TipoInstituto } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Props {
    instituto: Instituto;
    tipoInstitutos: TipoInstituto[];
    provincias: Provincia[];
    localidad: Localidad[];
}

export default function Edit({ instituto, tipoInstitutos, provincias, localidad: _localidad }: Props) {
    const [departamentos, setDepartamentos] = useState([]);
    const [localidades, setLocalidades] = useState([]);

    const { data, setData, reset, put, processing, errors } = useForm({
        cue_editable: instituto?.cue_editable ?? '',
        tipo_instituto_id: (instituto?.tipo_instituto?.id ?? instituto?.tipo_instituto_id ?? '')?.toString() ?? '',
        ambito_gestion: instituto?.ambito_gestion ?? '',
        provincia: instituto?.localidad?.provincia?.id?.toString() ?? '',
        departamento: (instituto?.departamento?.id ?? instituto?.departamento_id ?? instituto?.localidad?.departamento?.id)?.toString() ?? '',
        localidad: (instituto?.localidad?.id ?? instituto?.localidad_id)?.toString() ?? '',
        domicilio: instituto?.direccion ?? '',
        codigo_postal: instituto?.codigo_postal ?? '',
        telefono: instituto?.telefono ?? '',
        email: instituto?.email ?? '',
        anio_ingreso: instituto?.anio_ingreso ?? '',
        anio_egreso: instituto?.anio_egreso ?? '',
    });

    useEffect(() => {
        setData((prev) => ({
            ...prev,
            instituto: {
                ...prev,
                cue_editable: instituto?.cue_editable ?? '',
                tipo_instituto_id: (instituto?.tipo_instituto?.id ?? instituto?.tipo_instituto_id ?? '')?.toString() ?? '',
                ambito_gestion:
                    instituto?.ambito_gestion === 'Estatal' ? 'E' : instituto?.ambito_gestion === 'Privado' ? 'P' : (instituto?.ambito_gestion ?? ''),

                provincia: instituto?.localidad?.provincia?.id?.toString() ?? '',

                departamento: (instituto?.departamento?.id ?? instituto?.departamento_id ?? instituto?.localidad?.departamento?.id)?.toString() ?? '',
                localidad: (instituto?.localidad?.id ?? instituto?.localidad_id)?.toString() ?? '',
                domicilio: instituto?.direccion ?? '',
                codigo_postal: instituto?.codigo_postal ?? '',
                telefono: instituto?.telefono ?? '',
                email: instituto?.email ?? '',
                anio_ingreso: instituto?.anio_ingreso ?? '',
                anio_egreso: instituto?.anio_egreso ?? '',
            },
        }));
    }, [instituto, setData]);

    useEffect(() => {
        async function fetchDepartamentos() {
            if (data.provincia) {
                setLocalidades([]);
                const response = await axios.get(route('api.provincia.departamentos', { id: data.provincia }), { withCredentials: true });
                setDepartamentos(response.data);
            } else {
                setLocalidades([]);
            }
        }
        fetchDepartamentos();
    }, [data.provincia]);

    useEffect(() => {
        async function fetchLocalidades() {
            if (data.departamento) {
                const response = await axios.get(route('api.departamento.localidades', { id: data.departamento }));
                setLocalidades(response.data);
            } else {
                setDepartamentos([]);
                setLocalidades([]);
            }
        }
        fetchLocalidades();
    }, [data.departamento]);

    const onChange = (event: any) => {
        const { target } = event;

        setData((prev) => ({
            ...prev,
            [target.id]: target.value,
            ...(target.id === 'provincia' ? { departamento: '', localidad: '' } : {}),
            ...(target.id === 'departamento' ? { localidad: '' } : {}),
        }));
    };

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        put(route('admin.institutos.updateInstituto', { instituto: instituto.cue }));
    }

    function arrayToSelectItems(array: ItemParametrico[]): SelectItem[] {
        return array.map((item: ItemParametrico) => ({
            label: item.descripcion,
            value: item.id.toString(),
        })) as SelectItem[];
    }

    return (
        <AdminLayout>
            <Head>
                <title>Editar Instituto</title>
            </Head>

            <AppLayoutTitle title={`Editar Instituto - ${instituto?.nombre ?? instituto?.cue}`} />

            <div className="mt-5 grid grid-cols-12 gap-6">
                <div className="intro-y col-span-12 bg-yellow-50">
                    <Form onReset={() => reset()} onSubmit={onSubmit} procesing={processing} backHref={route('admin.institutos.index')}>
                        <div className="grid-cols-3 gap-2 sm:grid">
                            <FormInput
                                name="cue_editable"
                                placeholder="CUE"
                                type="text"
                                onChange={onChange}
                                value={data.cue_editable}
                                errors={errors}
                            />
                            <FormSelect
                                key="tipo_instituto_id"
                                name="tipo_instituto_id"
                                placeholder="Tipo de Institución"
                                label="Tipo de Institución"
                                onChange={onChange}
                                value={data.tipo_instituto_id}
                                multiple={false}
                                canDeselect={false}
                                errors={errors}
                                items={arrayToSelectItems(tipoInstitutos)}
                            />

                            <FormSelect
                                key="ambito_gestion"
                                name="ambito_gestion"
                                placeholder="Ámbito de Gestión"
                                label="Ámbito de Gestión"
                                onChange={onChange}
                                value={data.ambito_gestion}
                                multiple={false}
                                canDeselect={false}
                                errors={errors}
                                items={[
                                    { label: 'Estatal', value: 'E' },
                                    { label: 'Privado', value: 'P' },
                                ]}
                            />
                        </div>

                        <div className="mt-3 grid-cols-3 gap-2 sm:grid">
                            <FormSelect
                                key="provincia"
                                name="provincia"
                                placeholder="Provincia"
                                label="Provincia"
                                onChange={onChange}
                                value={data.provincia}
                                multiple={false}
                                canDeselect={false}
                                errors={errors}
                                items={arrayToSelectItems(provincias)}
                            />

                            <FormSelect
                                key="departamento"
                                name="departamento"
                                placeholder="Departamento"
                                label="Departamento"
                                disabled={!data.provincia}
                                onChange={onChange}
                                value={data.departamento}
                                multiple={false}
                                canDeselect={false}
                                errors={errors}
                                items={arrayToSelectItems(departamentos)}
                            />

                            <FormSelect
                                key="localidad"
                                name="localidad"
                                placeholder="Localidad"
                                label="Localidad"
                                disabled={!data.departamento}
                                onChange={onChange}
                                value={data.localidad}
                                multiple={false}
                                canDeselect={false}
                                errors={errors}
                                items={arrayToSelectItems(localidades)}
                            />
                        </div>

                        <div className="mt-3 grid-cols-3 gap-2 sm:grid">
                            <FormInput
                                name="domicilio"
                                placeholder="Dirección"
                                type="text"
                                onChange={onChange}
                                value={data.domicilio}
                                errors={errors}
                            />
                            <FormInput
                                name="codigo_postal"
                                placeholder="Código Postal"
                                type="text"
                                onChange={onChange}
                                value={data.codigo_postal}
                                errors={errors}
                            />

                            <FormInput name="telefono" placeholder="Teléfono" type="text" onChange={onChange} value={data.telefono} errors={errors} />
                        </div>

                        <div className="mt-3 grid-cols-3 gap-2 sm:grid">
                            <FormInput name="email" placeholder="E-mail" type="email" onChange={onChange} value={data.email} errors={errors} />
                            <FormInput
                                name="anio_ingreso"
                                placeholder="Año de ingreso"
                                type="number"
                                onChange={onChange}
                                value={data.anio_ingreso}
                                errors={errors}
                                disabled={true}
                            />
                            <FormInput
                                name="anio_egreso"
                                placeholder="Año de egreso"
                                type="number"
                                onChange={onChange}
                                value={data.anio_egreso}
                                errors={errors}
                            />
                        </div>
                    </Form>
                </div>
            </div>
        </AdminLayout>
    );
}
