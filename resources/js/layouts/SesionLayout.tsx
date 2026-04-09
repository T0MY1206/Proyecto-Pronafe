import ApplicationLogo from '@/components/ApplicationLogo';
import { ReactNode, useEffect } from 'react';

interface LayoutSesionProps {
    children: ReactNode;
}

export default function SesionLayout({ children }: LayoutSesionProps) {
    useEffect(() => {
        document.body.classList.add('login');
        document.body.classList.remove('main');

        return () => {
            document.body.classList.remove('login');
        };
    }, []);

    return (
        <div className="min-h-screen bg-slate-200/90">
            <div className="mx-auto grid min-h-screen max-w-[1600px] xl:grid-cols-2">
                {/* Panel marca / ilustración */}
                <div className="flex flex-col bg-gradient-to-br from-brand-700 via-brand-700 to-brand-900 px-6 pb-10 pt-8 text-white sm:px-10 xl:min-h-screen xl:justify-between xl:px-12 xl:pb-16 xl:pt-10">
                    <a
                        href={route('home')}
                        className="inline-flex w-fit items-center gap-2 rounded-lg py-1 text-white/90 transition hover:bg-white/10 hover:text-white"
                    >
                        <ApplicationLogo width={32} height={32} />
                        <span className="text-sm font-medium">PRONAFE</span>
                    </a>

                    <div className="mt-8 flex flex-1 flex-col justify-center xl:mt-0">
                        <img
                            src="/assets/images/Enfermeria.png"
                            alt=""
                            className="mx-auto max-h-44 w-auto max-w-full rounded-2xl shadow-xl ring-1 ring-white/20 sm:max-h-52 xl:mx-0 xl:max-h-none xl:w-[min(100%,420px)]"
                        />
                        <h1 className="mt-8 text-center text-2xl font-semibold leading-tight tracking-tight sm:text-3xl xl:text-left xl:text-4xl">
                            Bienvenido al sistema
                            <span className="block text-white/95">PRONAFE</span>
                        </h1>
                        <p className="mx-auto mt-4 max-w-md text-center text-base text-white/80 sm:text-lg xl:mx-0 xl:text-left">
                            Gestión de institutos y actualización de datos de la rama de Enfermería.
                        </p>
                    </div>
                </div>

                {/* Formulario: fondo suave + tarjeta clara */}
                <div className="flex items-stretch justify-center bg-slate-100 px-4 py-8 sm:px-6 sm:py-12 xl:items-center xl:py-16">
                    <div className="w-full max-w-md rounded-2xl border border-slate-200/90 bg-white p-8 shadow-xl shadow-slate-300/40 sm:p-10">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
