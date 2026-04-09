import { BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { TopBar } from './components/TopBar';
import AppMenuNotifications from '@/components/layouts/AppMenuNotifications';
import AppMenuUser from '@/components/layouts/AppMenuUser';
import AppMenuUserItem from '@/components/layouts/AppMenuUserItem';
import AppMobileMenu from "./components/AppMobileMenu";
import AppMenuAdministrador from "./components/AppMenuAdministrador";

interface AdminLayoutProps {
    children: React.ReactNode;
    breadcrumb?: BreadcrumbItem[];
}

interface Toast {
    type: 'success' | 'warning' | 'error' | 'info';
    text: string;
}

export function AdminLayout({ children, breadcrumb }: AdminLayoutProps) {
    const { props } = usePage();

    const [showMenuUsers, setShowMenuUsers] = useState(false);
    const [showMenuNotifications, setShowMenuNotifications] = useState(false);
    const [showMenuInstituto, setShowMenuInstituto] = useState(false);

    useEffect(() => {
        document.body.classList.add('main');
        document.body.classList.remove('login');

        return () => {
            document.body.classList.remove('main');
        };
    }, []);

    useEffect(() => {
        if (props.toast) {
            const { type, text } = props.toast as Toast;

            switch (type) {
                case 'success':
                    toast.success(text);
                    break;
                case 'warning':
                    toast.warning(text);
                    break;
                case 'error':
                    toast.error(text);
                    break;
                case 'info':
                    toast.info(text);
                    break;
                default:
                    toast(text);
                    break;
            }
        }
    }, [props.toast]);

    function openMenues(menu: 'notifications' | 'users' | 'instituto') {
        switch (menu) {
            case 'notifications':
                setShowMenuNotifications(!showMenuNotifications);
                break;
            case 'users':
                setShowMenuUsers(!showMenuUsers);
                break;
            case 'instituto':
                setShowMenuInstituto(!showMenuInstituto);
                break;
        }
    }

    return <>
            <AppMobileMenu></AppMobileMenu>

        <AppMenuAdministrador />
        <div className="content flex w-full max-w-full flex-col px-0 md:pl-60">
            <div className="shrink-0 px-4 md:px-6 lg:px-8">
                <TopBar
                    breadcrumb={breadcrumb}
                    onMenuOpen={openMenues}
                    userMenuOpen={showMenuUsers}
                    userMenu={
                        <AppMenuUser show={showMenuUsers} setShow={setShowMenuUsers}>
                            <AppMenuUserItem title="Perfil" icon="user" url="admin.profile.edit" />
                        </AppMenuUser>
                    }
                />
            </div>
            <div className="w-full min-w-0 px-4 md:px-6 lg:px-8">{children}</div>
        </div>

            <ToastContainer></ToastContainer>

        <AppMenuNotifications show={showMenuNotifications} setShow={setShowMenuNotifications}></AppMenuNotifications>
    </>;
}
