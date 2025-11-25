import { Head, Link, usePage } from '@inertiajs/react';
import { useFormEvent } from '@/hooks/useFormEvent.js';
import FormInput from '@/components/form/FormInput.jsx';
import FormRadio from '@/components/form/FormRadio.jsx';
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

    const onSubmit = (e: any) => {
        e.preventDefault();

        if (validateData()) {
            post(route('login'));
        }
    };

    return (
        <SesionLayout>
            <Head title="Iniciar Sesión" />

            <div className="dark:bg-dark-1 mx-auto my-auto w-full rounded-md bg-white px-5 py-8 shadow-md sm:w-3/4 sm:px-8 lg:w-2/4 xl:ml-20 xl:w-auto xl:bg-transparent xl:p-0 xl:shadow-none">
                {status && <div className="mb-4 text-sm font-medium text-green-600">{status}</div>}
                
                {flash?.error && (
                    <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-800 border border-red-200">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="font-medium">{flash.error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={onSubmit} action="#" id="login-form">
                    <h2 className="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">
                        Iniciar Sesión
                    </h2>

                    <div className="intro-x mt-8">
                        <FormInput name="login_user_name" placeholder="Nombre de LogIn" type="text" variant="session"
                            onChange={onChangeData}
                            value={data.login_user_name}
                            errors={errors}>
                        </FormInput>
                        <FormInput name="password" placeholder="Password" type="password" variant="session"
                            className="mt-4"
                            onChange={onChangeData}
                            value={data.password}
                            errors={errors}>
                        </FormInput>
                    </div>
                    <div className="intro-x flex text-gray-700 dark:text-gray-600 text-xs sm:text-sm mt-4">
                        <div className="flex items-center mr-auto">
                            <FormRadio name="remember" checked={data.remember} onChange={onChangeData}
                                className="form-inline"
                                label="Remember me" variant="session" />
                        </div>
                        {canResetPassword && (
                            <div className="intro-x text-center xl:text-left">
                                <Link href={route('password.request')}>¿Olvidó su contraseña?</Link>
                            </div>
                        )}
                    </div>
                    <div className="intro-x mt-5 xl:mt-8 text-center xl:text-left">
                        <button type="submit" disabled={processing}
                            className="btn btn-primary py-3 px-4 w-full xl:mr-3 align-top">
                            {processing && <AppIcon name="tail-spin" size={38} className="w-5 h-5 mr-2"></AppIcon>}
                            Iniciar Sesión
                        </button>
                    </div>
                </form>
            </div>
        </SesionLayout>
    );
}
