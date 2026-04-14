import { Head, Link, usePage } from '@inertiajs/react';
import { useFormEvent } from '@/hooks/useFormEvent';
import FormInput from '@/components/form/FormInput';
import AppIcon from '../../components/Icons/AppIcon';
import SesionLayout from '@/layouts/SesionLayout';

interface LoginProps {
    status: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { flash } = usePage().props;
    const { data, onChangeData, processing, errors, post, validateData } = useFormEvent({
        login_user_name: { value: '', validations: 'required|minLength:3' },
        password: { value: '', validations: 'required|minLength:3' },
        remember: { value: false },
    });

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateData()) {
            post(route('login'));
        }
    };

    return (
        <SesionLayout>
            <Head title="Iniciar Sesión" />

            {status && <div className="mb-4 text-sm font-medium text-emerald-700">{status}</div>}

            {flash?.error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                    <p className="font-medium">{flash.error}</p>
                </div>
            )}

            <form onSubmit={onSubmit} action="#" id="login-form" className="space-y-6">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight text-slate-900">Iniciar sesión</h2>
                    <p className="mt-1 text-sm text-slate-500">Ingresá con tu usuario y contraseña asignados.</p>
                </div>

                <div className="space-y-4">
                    <FormInput
                        name="login_user_name"
                        placeholder="Usuario"
                        type="text"
                        variant="session"
                        onChange={onChangeData}
                        value={data.login_user_name}
                        errors={errors}
                    />
                    <FormInput
                        name="password"
                        placeholder="Contraseña"
                        type="password"
                        variant="session"
                        onChange={onChangeData}
                        value={data.password}
                        errors={errors}
                    />
                </div>

                <div className="flex flex-col gap-4 text-sm sm:flex-row sm:items-center sm:justify-between">
                    <label className="flex cursor-pointer items-center gap-2.5 text-slate-700">
                        <input
                            type="checkbox"
                            name="remember"
                            id="remember"
                            checked={Boolean(data.remember)}
                            onChange={(e) =>
                                onChangeData({
                                    target: { id: 'remember', value: e.target.checked },
                                })
                            }
                            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                        />
                        <span>Recordarme</span>
                    </label>
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-brand-600 hover:text-brand-700 hover:underline sm:text-right"
                        >
                            ¿Olvidó su contraseña?
                        </Link>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="btn btn-primary flex w-full items-center justify-center gap-2 py-3 text-base"
                >
                    {processing && <AppIcon name="tail-spin" size={38} className="h-5 w-5" />}
                    Iniciar sesión
                </button>
            </form>
        </SesionLayout>
    );
}
