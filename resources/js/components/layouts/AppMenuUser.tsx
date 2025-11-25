import { useContextMenu } from "@/hooks/useContextMenu";
import { router, usePage } from "@inertiajs/react";
import { ReactNode } from "react";
import { AuthProp } from "@/types";
import AppIcon from "../Icons/AppIcon";

interface AppMenuUserProps {
    show: boolean;
    setShow: (show: boolean) => void;
    children?: ReactNode;
}

export default function ({ show, setShow, children }: AppMenuUserProps) {

    const { style } = useContextMenu({
        show,
        setShow,
        menuWidth: 224,
        padding: 58,
        top: 71,
        classes: ['menu-user', 'btn-user']
    });
    const user = (usePage() as AuthProp).props.auth.user;

    function onLogoutClick(event: any) {
        event.preventDefault();

        router.post( route('logout') );
    }

    return <div className={`dropdown-menu w-56 menu-user ${ show === true ? 'show' : '' }`} style={style}>
        <div className="dropdown-menu__content box dark:bg-dark-6">
            <div className="p-4 border-b border-black border-opacity-5 dark:border-dark-3">
                <div className="font-medium">{user?.name}</div>
                <div className="text-xs text-gray-600 mt-0.5 dark:text-gray-600">{ user?.rol?.descripcion}</div>
            </div>
            <div className="p-2">
                {children}
            </div>
            <div className="p-2 border-t border-black border-opacity-5 dark:border-dark-3">
                <a href="#" onClick={onLogoutClick} className="flex items-center block p-2 transition duration-300 ease-in-out hover:bg-gray-200 dark:hover:bg-dark-3 rounded-md"> 
                    <AppIcon name="toggle-right" className="w-4 h-4 mr-2"></AppIcon>
                    Cerrar sesión 
                </a>
            </div>
        </div>
    </div>
}