import Form from "@/components/form/Form";
import FormInput from "@/components/form/FormInput";
import AppLayoutTitle from "@/components/layouts/AppLayoutTitle";
import { AdminLayout } from "@/layouts/AdminLayout";
import { Provincia } from "@/types";
import { Head, useForm } from "@inertiajs/react";

interface Role {
    id: number;
    descripcion: string;
}

interface Props {
    roles: Role[];
    provincias: Provincia[]
}

export default function Create({ roles: _roles, provincias }: Props) {
    const { data, setData, reset, post, processing, errors } = useForm({
        name: '',
        email: '',
        login_user_name: '',
        password: '',
        password_confirmation: '',
        rol_id: '',
        provincia_id: ''
    });

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        post(route('admin.users.store'));
    }

    function onChange({ target }: { target: any }) {
        setData(target.id as keyof typeof data, target.value);
    }

    return <AdminLayout>
        <Head>
            <title>Agregar Usuarios</title>
        </Head>

        <AppLayoutTitle title="Agregar Usuario" />

        <div className="grid grid-cols-12 gap-6 mt-5">
            <div className="intro-y col-span-12">
                <Form onReset={() => reset()} onSubmit={onSubmit} procesing={processing}>
                    <div className="sm:grid grid-cols-2 gap-2">
                        <FormInput name="name" placeholder="Nombre" type="text"
                            onChange={onChange} value={data.name} errors={errors} />

                        <FormInput name="email" placeholder="Email" type="email"
                            onChange={onChange} value={data.email} errors={errors} />
                    </div>

                    <div className="sm:grid grid-cols-2 gap-2 mt-3">
                        <FormInput name="login_user_name" placeholder="Nombre de LogIn" type="text"
                            onChange={onChange} value={data.login_user_name} errors={errors} />
                    </div>

                    <div className="sm:grid grid-cols-2 gap-2 mt-3">
                        <FormInput name="password" placeholder="Contraseña" type="password"
                            onChange={onChange} value={data.password} errors={errors} />

                        <FormInput name="password_confirmation" placeholder="Confirmar contraseña" type="password"
                            onChange={onChange} value={data.password_confirmation} errors={errors} />
                    </div>

                    <div className="sm:grid grid-cols-2 gap-2 mt-3">
                        <div>
                            <select
                                id="rol_id"
                                name="rol_id"
                                value={data.rol_id}
                                onChange={onChange}
                                className="form-select"
                            >
                                <option value="">Seleccione un rol</option>
                                <option value="1">Administrador</option>
                                <option value="2">Supervisor Provincial</option>

                            </select>
                            {errors.rol_id && <div className="text-red-500 text-xs">{errors.rol_id}</div>}
                        </div>
                        {
                            data.rol_id == "2" &&
                            <div>
                                <select
                                    id="provincia_id"
                                    name="provincia_id"
                                    value={data.provincia_id}
                                    onChange={onChange}
                                    className="form-select"
                                >
                                    <option value="">Seleccione una Provincia</option>
                                    {provincias.map((p) =>
                                        <option key={'p-' + p.id} value={p.id}>{p.descripcion}</option>
                                    )}
                                </select>
                                {errors.rol_id && <div className="text-red-500 text-xs">{errors.rol_id}</div>}
                            </div>
                        }
                    </div>
                </Form>
            </div>
        </div>
    </AdminLayout>;
}
