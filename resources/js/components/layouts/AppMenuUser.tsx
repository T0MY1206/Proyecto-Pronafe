import { hasParentClass } from '@/lib/functions';
import { router, usePage } from '@inertiajs/react';
import { ReactNode, useEffect } from 'react';
import { AuthProp } from '@/types';
import AppIcon from '../Icons/AppIcon';

interface AppMenuUserProps {
    show: boolean;
    setShow: (show: boolean) => void;
    children?: ReactNode;
}

/**
 * Menú de usuario: debe renderizarse dentro del `relative` del TopBar
 * para quedar anclado al botón (no usar position fixed global).
 */
export default function AppMenuUser({ show, setShow, children }: AppMenuUserProps) {
    const user = (usePage() as AuthProp).props.auth.user;

    useEffect(() => {
        if (!show) return;

        const onDocClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (hasParentClass(['menu-user', 'btn-user'], target)) {
                return;
            }
            setShow(false);
        };

        document.addEventListener('click', onDocClick);
        return () => document.removeEventListener('click', onDocClick);
    }, [show, setShow]);

    function onLogoutClick(event: React.MouseEvent) {
        event.preventDefault();
        router.post(route('logout'));
    }

    return (
        <div
            className={`dropdown-menu menu-user dropdown-menu--anchored w-56 min-w-[14rem] ${show ? 'show' : ''}`}
            role="menu"
            aria-hidden={!show}
        >
            <div className="dropdown-menu__content box text-slate-900">
                <div className="border-b border-slate-300/80 p-4">
                    <div className="font-semibold text-slate-900">{user?.name}</div>
                    <div className="mt-0.5 text-xs text-slate-600">{user?.rol?.descripcion}</div>
                </div>
                <div className="p-2">{children}</div>
                <div className="border-t border-slate-300/80 p-2">
                    <a
                        href="#"
                        onClick={onLogoutClick}
                        className="flex items-center rounded-lg p-2 text-slate-800 transition-colors duration-200 ease-out hover:bg-slate-300/60"
                    >
                        <AppIcon name="toggle-right" className="mr-2 h-4 w-4" />
                        Cerrar sesión
                    </a>
                </div>
            </div>
        </div>
    );
}
