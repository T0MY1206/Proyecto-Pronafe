import { SupervisorLayout } from '@/layouts/SupervisorLayout';
import AppLayoutTitle from '@/components/layouts/AppLayoutTitle';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
}

interface EditProps {
    user: User;
}

export default function Edit({ user }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        current_password: '',
        password: '',
        password_confirmation: ''
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put(route('supervisor.profile.update'));
    };

    return (
        <SupervisorLayout>
            <Head>
                <title>Editar Perfil</title>
            </Head>
            
            <div className="grid grid-cols-12 gap-6 mt-2">
                <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
                    <AppLayoutTitle title="Editar Perfil" />
                    <div className="ml-auto">
                        <Link
                            href={route('supervisor.profile')}
                            className="btn btn-secondary"
                        >
                            ← Volver al Perfil
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="intro-y col-span-12">
                    <div className="intro-y box p-5">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="form-label">Nombre</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="form-control"
                                        required
                                    />
                                    {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                                </div>
                                <div>
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="form-control"
                                        required
                                    />
                                    {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
                                </div>
                                <div>
                                    <label className="form-label">Contraseña Actual</label>
                                    <input
                                        type="password"
                                        value={data.current_password}
                                        onChange={(e) => setData('current_password', e.target.value)}
                                        className="form-control"
                                    />
                                    {errors.current_password && <div className="text-red-500 text-sm mt-1">{errors.current_password}</div>}
                                </div>
                                <div>
                                    <label className="form-label">Nueva Contraseña</label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="form-control"
                                    />
                                    {errors.password && <div className="text-red-500 text-sm mt-1">{errors.password}</div>}
                                </div>
                                <div>
                                    <label className="form-label">Confirmar Nueva Contraseña</label>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="form-control"
                                    />
                                    {errors.password_confirmation && <div className="text-red-500 text-sm mt-1">{errors.password_confirmation}</div>}
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                                <Link
                                    href={route('supervisor.profile')}
                                    className="btn btn-secondary"
                                >
                                    Cancelar
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="btn btn-primary"
                                >
                                    {processing ? 'Guardando...' : 'Guardar Cambios'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </SupervisorLayout>
    );
}
