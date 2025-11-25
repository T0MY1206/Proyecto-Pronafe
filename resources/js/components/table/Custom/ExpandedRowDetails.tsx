import React from "react";

type Institute = {
    nombre: string;
    telefono: string;
    email: string;
};

type Authority = {
    nombre_apellido: string;
    telefono: string;
    email: string;
    cargo_descripcion: string;
};

type ExpandedRowProps = {
    typeInstituteDescripcion: string;
    institute: Institute;
    authorities: Authority[];
};

const ExpandedRowDetail: React.FC<{ data: ExpandedRowProps }> = ({ data }) => {
    if (!data) return null;

    return (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm">
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
                {data.typeInstituteDescripcion}
            </h4>
            <div className="mb-2">
                <span className="font-bold text-gray-700">Instituto: </span>
                <span>{data.institute.nombre}</span>
            </div>
            <div className="mb-2">
                <span className="font-bold text-gray-700">Teléfono: </span>
                <span>{data.institute.telefono}</span>
            </div>
            <div className="mb-4">
                <span className="font-bold text-gray-700">Email: </span>
                <span>{data.institute.email}</span>
            </div>
            <div>
                <span className="font-bold text-gray-700">Autoridades:</span>
                <ul className="mt-1 list-disc pl-5">
                    {(!data.authorities || data.authorities.length === 0) && (
                        <li className="text-gray-500">No hay autoridades para este año.</li>
                    )}
                    {data.authorities?.map((auth, idx) => (
                        <li key={idx} className="mb-1">
                            <span className="font-semibold">{auth.cargo_descripcion}:</span>{" "}
                            <span>{auth.nombre_apellido}</span>
                            {auth.telefono && <> - <span className="text-gray-600">{auth.telefono}</span></>}
                            {auth.email && <> - <span className="text-gray-600">{auth.email}</span></>}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ExpandedRowDetail;