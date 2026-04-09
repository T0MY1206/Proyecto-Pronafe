import { useContextMenu } from "@/hooks/useContextMenu";
import AppMenuNotificationItem from "./AppMenuNotificationItem";

interface AppMenuNotificationsProps { 
    show: boolean, 
    setShow: (show: boolean) => void }

export default function ({ show, setShow }: AppMenuNotificationsProps) {
    // Detectar el rol del usuario basándose en la URL o props
    const getUserRole = () => {
        const currentUrl = window.location.pathname;
        if (currentUrl.includes('/instituto')) return 'instituto';
        if (currentUrl.includes('/admin')) return 'admin';
        if (currentUrl.includes('/supervisor')) return 'supervisor';
        return 'default';
    };
    const { style } = useContextMenu({
        show,
        setShow,
        menuWidth: 350,
        padding: 110,
        top: 64,
        classes: ['menu-notification', 'btn-notification']
    });
    
    return <div className={`notification-content menu-notification pt-2 dropdown-menu ${ show === true ? 'show' : '' }`} style={style}>
        <div className="notification-content__box dropdown-menu__content box dark:bg-dark-6">
            <div className="notification-content__title">Notificaciones</div>
           
            <AppMenuNotificationItem userRole={getUserRole()}></AppMenuNotificationItem>
        </div>
    </div>;
}
