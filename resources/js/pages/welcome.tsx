import PublicLayout from '@/layouts/PublicLayout';
import { Link } from '@inertiajs/react';

export default function Welcome() {
    return <PublicLayout>
        <div className="intro-x text-8xl font-medium">Bienvenidos</div>
        <div className="intro-x text-xl lg:text-3xl font-medium mt-5">Por favor, inicie sesión antes de continuar</div>

        <Link href={route('login')} className="intro-x btn py-3 px-4 text-white border-white dark:border-dark-5 dark:text-gray-300 mt-10">Login</Link>
    </PublicLayout>;
}
