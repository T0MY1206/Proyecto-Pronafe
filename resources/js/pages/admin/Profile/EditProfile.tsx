import AppLayoutTitle from "@/components/layouts/AppLayoutTitle";
import ProfileForm from "@/components/partials/ProfileForm";
import { AdminLayout } from "@/layouts/AdminLayout";
import { User } from "@/types";
import { Head } from "@inertiajs/react";

export default function Edit({user}: {user: User}) {

    const putRoute = 'admin.profile.update';

     return <AdminLayout>
        <Head>
            <title>Editar Perfil</title>
        </Head>

        <AppLayoutTitle title={`Tu perfil`} />

        <ProfileForm
            user = {user}
            putRoute={putRoute}
        ></ProfileForm>
    </AdminLayout>;
}
