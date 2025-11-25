import { InstitutoLayout } from "@/layouts/InstitutoLayout";
import { User } from "@/types";
import { Head } from "@inertiajs/react";
import ProfileForm from "@/components/partials/ProfileForm";
import AppLayoutTitle from "@/components/layouts/AppLayoutTitle";

export default function Edit({user}: {user: User}) {

    const putRoute = 'supervisor.profile.update';

     return <InstitutoLayout>
        <Head>
            <title>Editar Perfil</title>
        </Head>

        <AppLayoutTitle title={`Tu perfil`} />

        <ProfileForm
            user = {user}
            putRoute={putRoute}
        ></ProfileForm>
    </InstitutoLayout>;
}
