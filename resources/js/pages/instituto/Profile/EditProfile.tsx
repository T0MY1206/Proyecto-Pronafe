import AppLayoutTitle from "@/components/layouts/AppLayoutTitle";
import ProfileForm from "@/components/partials/ProfileForm";
import { InstitutoLayout } from "@/layouts/InstitutoLayout";
import { User } from "@/types";
import { Head } from "@inertiajs/react";

export default function Edit({user}: {user: User}) {

    const putRoute = 'instituto.profile.update';

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
