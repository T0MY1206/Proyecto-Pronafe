import React from 'react';

interface UserInfoProps {
    name: string;
    rol?: string;
    email: string;
}

export default function UserInfo({ name, rol, email }: UserInfoProps) {
    return (
        <div className="ml-5">
            <div className="w-24 sm:w-40 truncate sm:whitespace-normal font-medium text-lg">{name}</div>
            <div className="text-gray-600">{rol ? rol : 'Rol no especificado'}</div>
            <div className="truncate sm:whitespace-normal flex items-center mt-2">
                <i data-feather="mail" className="w-4 h-4 mr-2"></i> {email}
            </div>
        </div>
    );
} 