import React from 'react';
import Form from '@/components/form/Form';
import FormInput from '@/components/form/FormInput';

interface PerfilInstitutoFormProps {
    data: any;
    errors: any;
    processing: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onReset: () => void;
}

export default function PerfilInstitutoForm({ data, errors, processing, onChange, onSubmit, onReset }: PerfilInstitutoFormProps) {
    return (
        <Form onReset={onReset} onSubmit={onSubmit} procesing={processing}>
            <div className="grid-cols-2 gap-2 sm:grid">
                <FormInput
                    name="name"
                    key="name"
                    placeholder="Nombre"
                    type="text"
                    onChange={onChange}
                    value={data.name}
                    errors={errors}
                />
                <FormInput
                    name="email"
                    key="email"
                    placeholder="Email"
                    type="email"
                    value={data.email}
                    errors={errors}
                    disabled
                    onChange={() => {}}
                />
            </div>
            <div className="mt-3 grid-cols-2 gap-2 sm:grid">
                <FormInput
                    name="password"
                    key="password"
                    placeholder="Nueva contraseña (opcional)"
                    type="password"
                    onChange={onChange}
                    value={data.password}
                    errors={errors}
                />
                <FormInput
                    name="password_confirmation"
                    key="password_confirmation"
                    placeholder="Confirmar contraseña"
                    type="password"
                    onChange={onChange}
                    value={data.password_confirmation}
                    errors={errors}
                />
            </div>
        </Form>
    );
}
