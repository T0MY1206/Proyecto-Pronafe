import { User } from "@/types";
import { useForm } from "@inertiajs/react";
import Form from "../form/Form";
import FormInput from "../form/FormInput";
import { useState, useEffect } from "react";

interface Props {
    putRoute: string,
    user: User
}

export default function ({ putRoute, user }: Props) {
    const [editing, setEditing] = useState(false); // Estado para hacer seguimiento de la edición de los datos

    const { data, setData, reset, put, processing, errors } = useForm({
        id: user.id,
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
    });

    function onChange({ target }: { target: HTMLInputElement }) {
        setData(target.id as keyof typeof data, target.value);
    }

    useEffect(() => { //Efecto que depende de Data así se actualiza cada vez que el usuario interactua con el formulario
        if (data.name != user.name || data.password != "" || data.password_confirmation != "") { //Si los datos post-cambio son distintos de los originales
            setEditing(true)
        }
        else {
            setEditing(false)
        }
    }, [data, user])

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        put(route(putRoute));
    }

    return <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="intro-y col-span-12">
            <Form onReset={() => reset()} onSubmit={onSubmit} procesing={processing} showButtons={editing}>
                <div className="sm:grid grid-cols-2 gap-2">
                    <FormInput name="name" placeholder="Nombre" type="text"
                        onChange={onChange} value={data.name} errors={errors} />

                    <FormInput name="email" placeholder="Email" type="email"
                        onChange={onChange} value={data.email} errors={errors} disabled />
                </div>

                <div className="sm:grid grid-cols-2 gap-2 mt-3 mb-4">
                    <FormInput name="password" placeholder="Contraseña" type="password"
                        onChange={onChange} value={data.password} errors={errors} />

                    <FormInput name="password_confirmation" placeholder="Confirmar contraseña" type="password"
                        onChange={onChange} value={data.password_confirmation} errors={errors} />
                </div>
            </Form>
        </div>
    </div>
}
