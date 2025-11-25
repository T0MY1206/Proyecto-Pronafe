import ApplicationLogo from '@/components/ApplicationLogo';
import AppMenuItem from '@/components/layouts/AppMenuItem';
import { checkCurrent } from '@/lib/functions';

export default function () {
    const adminRoutes = ['admin.users.index', 'admin.institutos.create', 'admin.actualizaciones.create', 'admin.exportar.index', 'admin.users.create'];

    return <nav className="side-nav">
        <div className="flex justify-center items-center pt-6 pb-2">
            <ApplicationLogo height={30} width={30} />
        </div>

        <div className="side-nav__devider my-6"></div>
        <ul>
            <AppMenuItem title="Inicio" icon="home" url="admin.dashboard" ></AppMenuItem>
            <li className="side-nav__devider my-6"></li>
            <AppMenuItem title="Listado de Institutos" icon="file-text" url="admin.institutos.index" active={checkCurrent(['admin.institutos.index'])} />
            <AppMenuItem title="Actualizaciones" icon="file-text" url="admin.actualizaciones.index" active={checkCurrent(['admin.actualizaciones.index'])} />
            <li className="side-nav__devider my-6"></li>

            <AppMenuItem title="Administración" icon="box" active={checkCurrent(adminRoutes)}>
                <li className="side-nav__devider my-6"></li>
                <AppMenuItem title="Usuarios" icon="users" url="admin.users.index" active={checkCurrent(['admin.users.index']) || checkCurrent(['admin.users.create'])} />
                <AppMenuItem title="Crear Instituto" icon="plus-square" url="admin.institutos.create" active={checkCurrent(['admin.institutos.create'])} />
                <AppMenuItem title="Crear Actualización" icon="plus-square" url="admin.actualizaciones.create" active={checkCurrent(['admin.actualizaciones.create'])} />
                <AppMenuItem title="Exportar Datos" icon="download" url="admin.exportar.index" active={checkCurrent(['admin.exportar.index'])} />
            </AppMenuItem>
            <li className="side-nav__devider my-6"></li>
        </ul>
    </nav>
}
