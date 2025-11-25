import Form from "@/components/form/Form";
import FormInput from "@/components/form/FormInput";
import AppLayoutTitle from "@/components/layouts/AppLayoutTitle";
import { AdminLayout } from "@/layouts/AdminLayout";
import { User } from "@/types";
import { Head, useForm } from "@inertiajs/react";
import { Provincia } from "@/types";

interface Role {
    id: number;
    descripcion: string;
}

interface Props {
    user: User;
    provincias: Provincia[]
    roles: Role[];
}

export default function Edit({ user, provincias, roles }: Props) {
    const { data, setData, reset, put, processing, errors } = useForm({
        id: user.id,
        name: user.name,
        login_user_name: user.login_user_name,
        email: user.email,
        password: '',
        password_confirmation: '',
        rol_id: '',
        provincia_id: '',
    });

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        put(route('admin.users.update', user.id));
    }

    function onChange({ target }: { target: any }) {
        setData(target.id as keyof typeof data, target.value);
    }

    return <AdminLayout>
        <Head>
            <title>Editar Usuario</title>
        </Head>

        <AppLayoutTitle title={`Editar Usuario ${user.name}`} />

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

                        {user.name === "Supervisor" && (
                        <div className="flex flex-col w-full">
                          <label htmlFor="provincia_id" className="block text-sm font-medium text-gray-700 mb-1">
                            Provincia
                          </label>
                          <select
                            id="provincia_id"
                            name="provincia_id"
                            value={data.provincia_id}
                            onChange={onChange}
                            className="form-select"
                          >
                            <option value="">Seleccione una Provincia</option>
                            {provincias.map((p) => (
                              <option key={'p-' + p.id} value={p.id}>{p.descripcion}</option>
                            ))}
                          </select>
                          {errors.provincia_id && <div className="text-red-500 text-xs">{errors.provincia_id}</div>}
                        </div>
                     )}                      
                    </div>

                    <div className="sm:grid grid-cols-2 gap-2 mt-3">
                        <FormInput name="password" placeholder="Contraseña" type="password"
                            onChange={onChange} value={data.password} errors={errors} />

                        <FormInput name="password_confirmation" placeholder="Confirmar contraseña" type="password"
                            onChange={onChange} value={data.password_confirmation} errors={errors} />
                    </div>
                </Form>
            </div>
        </div>
    </AdminLayout>;
}
