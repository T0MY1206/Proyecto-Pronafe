import ApplicationLogo from "@/components/ApplicationLogo";
import AppMenuItem from "@/components/layouts/AppMenuItem";
import { checkCurrent } from "@/lib/functions";

export default function () {
    return (
        <nav className="side-nav">
            <div className="flex justify-center items-center pt-6 pb-2">
                <ApplicationLogo height={30} width={30} />
            </div>
            <div className="side-nav__devider my-6"></div>
            <ul>
                {/* Sección principal */}
                <AppMenuItem title="SUPERVISOR" icon="home" url="supervisor.dashboard" />

                <AppMenuItem title="Perfil" icon="user" url="supervisor.profile.edit" active={checkCurrent(["supervisor.profile"])} />

                <li className="side-nav__devider my-6"></li>

                {/* Nueva sección de actualizaciones */}
                <AppMenuItem
                    title="Actualizaciones"
                    icon="file-text"
                    url="supervisor.actualizaciones.index"
                    active={checkCurrent(["supervisor.actualizaciones"])}
                />
            </ul>
        </nav>
    );
}
