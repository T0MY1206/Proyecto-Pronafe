import AppIcon from "@/components/Icons/AppIcon";
import { useState } from "react";
import { Breadcrumb } from "./Breadcrumb";
import { BreadcrumbItem } from "@/types";

interface TopBarProps {
    breadcrumb?: BreadcrumbItem[];
    onMenuOpen: (type: 'notifications' | 'users') => void;
}

export function TopBar({breadcrumb, onMenuOpen}: TopBarProps) {
    // Detectar el rol del usuario basándose en la URL
    const getUserRole = () => {
        const currentUrl = window.location.pathname;
        if (currentUrl.startsWith('/instituto')) return 'instituto';
        if (currentUrl.startsWith('/admin')) return 'admin';
        if (currentUrl.startsWith('/supervisor')) return 'supervisor';
        return 'default';
    };

    // Definir colores según el rol del usuario
    const getColorClasses = () => {
        switch (getUserRole()) {
            case 'instituto':
                return {
                    background: 'bg-green-100 hover:bg-green-200',
                    icon: 'text-green-600'
                };
            case 'admin':
                return {
                    background: 'bg-blue-100 hover:bg-blue-200',
                    icon: 'text-blue-600'
                };
            case 'supervisor':
                return {
                    background: 'bg-purple-100 hover:bg-purple-200',
                    icon: 'text-purple-600'
                };
            default:
                return {
                    background: 'bg-gray-100 hover:bg-gray-200',
                    icon: 'text-gray-600'
                };
        }
    };

    const colors = getColorClasses();

    return (
        <div className="top-bar -mx-4 px-4 md:mx-0 md:px-0">
            <Breadcrumb breadcrumb={breadcrumb} className="hidden sm:flex">

            </Breadcrumb>

            <div className="intro-x relative mr-3 sm:mr-6">
                <a className="notification sm:hidden" href="">
                    <AppIcon name="search" className="notification__icon dark:text-gray-300"></AppIcon>
                </a>
            </div>
            <div onClick={() => onMenuOpen('users')} className="intro-x btn-user dropdown">
                <div className={`dropdown-toggle flex items-center cursor-pointer ${colors.background} rounded-full px-3 py-2 transition-colors duration-200`} role="button" aria-expanded="false" title="Perfil de usuario">
                    <svg className={`w-5 h-5 ${colors.icon} mr-2`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <svg className={`w-4 h-4 ${colors.icon} opacity-75`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
