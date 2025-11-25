import { SupervisorLayout } from '@/layouts/SupervisorLayout';
import AppLayoutTitle from '@/components/layouts/AppLayoutTitle';
import { Head, Link } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
}

interface ShowProps {
    user: User;
}

export default function Show({ user }: ShowProps) {
    return (
        <SupervisorLayout>
            <Head>
                <title>Perfil</title>
            </Head>
            
            <div className="grid grid-cols-12 gap-6 mt-2">
                <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
                    <AppLayoutTitle title="Mi Perfil" />
                    <div className="ml-auto">
                        <Link
                            href={route('supervisor.profile.edit')}
                            className="btn btn-primary"
                        >
                            Editar Perfil
                        </Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="intro-y col-span-12">
                    <div className="intro-y box p-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="form-label">Nombre</label>
                                <input
                                    type="text"
                                    value={user.name}
                                    readOnly
                                    className="form-control"
                                />
                            </div>
                            <div>
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    value={user.email}
                                    readOnly
                                    className="form-control"
                                />
                            </div>
                            <div>
                                <label className="form-label">Fecha de Registro</label>
                                <input
                                    type="text"
                                    value={new Date(user.created_at).toLocaleDateString()}
                                    readOnly
                                    className="form-control"
                                />
                            </div>
                            <div>
                                <label className="form-label">Última Actualización</label>
                                <input
                                    type="text"
                                    value={new Date(user.updated_at).toLocaleDateString()}
                                    readOnly
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SupervisorLayout>
    );
}
