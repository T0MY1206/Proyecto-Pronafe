import PublicLayout from '@/layouts/PublicLayout';
import { Link } from '@inertiajs/react';

export default function Welcome() {
    return <PublicLayout>
        <div className="intro-x text-4xl font-semibold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">Bienvenidos</div>
        <div className="intro-x mt-5 text-lg text-slate-600 lg:text-2xl">Por favor, inicie sesión antes de continuar</div>

        <Link
            href={route('login')}
            className="intro-x btn btn-primary mt-10 px-6 py-3 text-base shadow-md"
        >
            Iniciar sesión
        </Link>
    </PublicLayout>;
}
