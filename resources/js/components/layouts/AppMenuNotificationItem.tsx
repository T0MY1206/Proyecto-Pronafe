interface AppMenuNotificationItemProps {
    userRole?: string;
}

export default function ({ userRole = 'default' }: AppMenuNotificationItemProps) {
    // Definir colores según el rol del usuario
    const getColorClasses = () => {
        switch (userRole.toLowerCase()) {
            case 'instituto':
                return {
                    background: 'bg-green-100',
                    icon: 'text-green-600'
                };
            case 'admin':
                return {
                    background: 'bg-blue-100',
                    icon: 'text-blue-600'
                };
            case 'supervisor':
                return {
                    background: 'bg-purple-100',
                    icon: 'text-purple-600'
                };
            default:
                return {
                    background: 'bg-gray-100',
                    icon: 'text-gray-600'
                };
        }
    };

    const colors = getColorClasses();

    return <div className="cursor-pointer relative flex items-center ">
        <div className={`w-12 h-12 flex-none flex items-center justify-center mr-1 ${colors.background} rounded-full`}>
            <svg className={`w-6 h-6 ${colors.icon}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <div className="w-3 h-3 bg-theme-20 absolute right-0 bottom-0 rounded-full border-2 border-white"></div>
        </div>
        <div className="ml-2 overflow-hidden">
            <div className="flex items-center">
                <a href="#" className="font-medium truncate mr-5">Bienvenido</a>
                <div className="text-xs text-gray-500 ml-auto whitespace-nowrap">01:10 PM</div>
            </div>
            <div className="w-full truncate text-gray-600 mt-0.5">Ver Notificaciones</div>
        </div>
    </div>;
}
