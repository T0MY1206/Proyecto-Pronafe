import ApplicationLogo from "@/components/ApplicationLogo";
import AppMenuItem from "@/components/layouts/AppMenuItem";
import { checkCurrent } from "@/lib/functions";

export default function () {
    return <nav className="side-nav">
             <div className="flex justify-center items-center pt-6 pb-2">
                   <ApplicationLogo height={30} width={30} />
               </div>
        <div className="side-nav__devider my-6"></div>
        <ul>
            <AppMenuItem title="INICIO" icon="home" url="instituto.dashboard" ></AppMenuItem>
            <li className="side-nav__devider my-6"></li>
            <AppMenuItem title="Cargar Formulario" icon="file-text" url="instituto.actualizacion" active={checkCurrent(['instituto.actualizacion'])}></AppMenuItem>
        </ul>
    </nav>
}
