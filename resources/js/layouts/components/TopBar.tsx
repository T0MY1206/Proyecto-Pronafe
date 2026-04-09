import AppIcon from '@/components/Icons/AppIcon';
import { Breadcrumb } from './Breadcrumb';
import { BreadcrumbItem } from '@/types';
import { ReactNode } from 'react';

interface TopBarProps {
    breadcrumb?: BreadcrumbItem[];
    onMenuOpen: (type: 'notifications' | 'users') => void;
    userMenuOpen?: boolean;
    /** Panel de usuario (AppMenuUser); debe vivir aquí para anclar el dropdown al botón. */
    userMenu?: ReactNode;
}

export function TopBar({ breadcrumb, onMenuOpen, userMenuOpen = false, userMenu }: TopBarProps) {
    const getUserRole = () => {
        const currentUrl = window.location.pathname;
        if (currentUrl.startsWith('/instituto')) return 'instituto';
        if (currentUrl.startsWith('/admin')) return 'admin';
        if (currentUrl.startsWith('/supervisor')) return 'supervisor';
        return 'default';
    };

    const getColorClasses = () => {
        switch (getUserRole()) {
            case 'instituto':
                return {
                    ring: 'ring-emerald-200/80 hover:ring-emerald-300',
                    icon: 'text-emerald-700',
                    bg: 'bg-emerald-50/90 hover:bg-emerald-100/90',
                };
            case 'admin':
                return {
                    ring: 'ring-brand-600/20 hover:ring-brand-600/35',
                    icon: 'text-brand-700',
                    bg: 'bg-brand-50/90 hover:bg-brand-100/90',
                };
            case 'supervisor':
                return {
                    ring: 'ring-violet-200/90 hover:ring-violet-300',
                    icon: 'text-violet-800',
                    bg: 'bg-violet-50/90 hover:bg-violet-100/90',
                };
            default:
                return {
                    ring: 'ring-slate-200 hover:ring-slate-300',
                    icon: 'text-slate-700',
                    bg: 'bg-slate-100 hover:bg-slate-200/90',
                };
        }
    };

    const colors = getColorClasses();

    return (
        <header className="top-bar">
            <div className="flex min-w-0 flex-1 items-center gap-3">
                <Breadcrumb breadcrumb={breadcrumb} className="hidden min-w-0 sm:flex" />
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <button
                    type="button"
                    className="notification sm:hidden rounded-lg p-1.5 text-slate-500 transition-colors duration-200 hover:bg-slate-300/50 hover:text-slate-800"
                    aria-label="Buscar"
                >
                    <AppIcon name="search" className="notification__icon" />
                </button>

                <div className="relative z-30">
                    <div className="btn-user dropdown">
                        <button
                            type="button"
                            onClick={() => onMenuOpen('users')}
                            className={`dropdown-toggle flex cursor-pointer items-center gap-2 rounded-xl border border-slate-400/50 px-3 py-2 shadow-sm ring-2 ring-transparent transition-all duration-200 ease-out ${colors.bg} ${colors.ring}`}
                            aria-expanded={userMenuOpen}
                            aria-haspopup="menu"
                            title="Menú de usuario"
                        >
                            <svg
                                className={`h-5 w-5 ${colors.icon}`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <svg
                                className={`h-4 w-4 ${colors.icon} opacity-80`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                    {userMenu}
                </div>
            </div>
        </header>
    );
}
