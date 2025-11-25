import AppLayoutTitle from "@/components/layouts/AppLayoutTitle";
import Table from "@/components/table/Table";
import { AdminLayout } from "@/layouts/AdminLayout";
import { User } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import Search from "@/components/table/Search";
import { useState } from "react";

export default function({users, options}: {users: any[], options: any}) {
    const [searchTerm, setSearchTerm] = useState('');

    // Esta función se llama cuando el usuario busca
    const handleSearchChange = (term: string) => {
        setSearchTerm(term);
        // Si usas Inertia y quieres que el backend filtre:
        router.get(route('admin.users.index'), { search: term }, { preserveState: true, replace: true });
    };

    const table = [
        { value: 'id',  label: 'ID' },
        { value: 'name',  label: 'Nombre' },
        { value: 'email',  label: 'Email' },
        { value: 'rol.descripcion',  label: 'Rol' },
    ];

    const actions = [
        {
            label: 'Editar',
            icon: 'check-square',
            iconClass: 'w-4 h-4 mr-1',
            action: (value: User) => { router.visit(route('admin.users.edit', value.id)) }
        }
    ];

    return <AdminLayout>
        <Head>
            <title>Usuarios</title>
        </Head>

        <AppLayoutTitle title="Lista de Usuarios" />

        <Table head={table} rows={users} actions={actions} paginate={true} options={options}>
            <Link href={route('admin.users.create')} className="btn btn-primary shadow-md mr-2">Agregar nuevo</Link>
            <Search initialSearchTerm={searchTerm} onSearch={handleSearchChange} />
        </Table>
    </AdminLayout>;
}
