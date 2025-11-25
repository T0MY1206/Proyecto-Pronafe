import { useState } from 'react';
import AppIcon from '@/components/Icons/AppIcon';

interface InstituteData {
    cue: string;
    nombre: string;
    telefono: string;
    email: string;
}

interface AuthorityData {
    nombre_apellido: string;
    telefono: string;
    email: string;
    cargo_descripcion: string;
    tipo_autoridad: string;
}

interface ExpandedData {
    data: {  //  anide un data dentro de otro porque desde el conbtroller viene en el paquete de data los demas datos
        instituto: InstituteData;
        autoridades_instituto: AuthorityData[];
        autoridades_carrera: AuthorityData[];
        observaciones: string;
        anio: number;
        filtros: {
            cue: string;
            anio: number;
        };
    }
}

interface ExpandedRowFormProps {
    data: ExpandedData;
    showActions?: boolean;
    onAceptar?: (data: ExpandedData) => Promise<void>;
    onRechazar?: (data: ExpandedData) => Promise<void>;
    loading?: boolean;
}

const ExpandedRowForm: React.FC<ExpandedRowFormProps> = ({
    data,
    showActions = false,
    onRechazar,
}) => {
    const [loadingRechazar, setLoadingRechazar] = useState(false);

    if (!data || !data.data || !data.data.instituto) {
        return <div>Cargando...</div>;
    }

    const handleClick = async (
        callback: ((data: ExpandedData) => Promise<void>) | undefined,
        setLoading: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
        if (!callback) return;

        setLoading(true);
        try {
            await callback(data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-amber-100/80 rounded-lg shadow-md p-3">
            {/* Header */}
            <div className="border-b border-gray-200 pb-4 cursor-default">
                <h2 className="text-2xl font-bold text-gray-800">
                    {data.data.instituto.nombre}
                </h2>
                <p className="text-gray-700 ">CUE: {data.data.instituto.cue} - Año: {data.data.anio}</p>
            </div>

            {/* Información del Instituto */}
            <div className="mb-3">
                <h3 className="text-base font-semibold text-gray-800 mb-2 cursor-default">Información del Instituto</h3>
                <div className="flex flex-row items-end gap-x-4">
                    {/* Teléfono */}
                    <div className="flex px-3 ">
                        <label className="text-base font-medium text-gray-800 m-2">Teléfono: </label>
                        <input
                            type="text"
                            value={data.data.instituto?.telefono || 'No disponible'}
                            readOnly
                            className="border border-gray-300 rounded px-3 py-1 bg-gray-50 text-gray-800 text-sm w-64 cursor-default"
                        />
                    </div>

                    {/* Email */}
                    <div className="flex px-3">
                        <label className="text-base font-medium text-gray-800 m-2 cursor-default">Email: </label>
                        <input
                            type="email"
                            value={data.data.instituto?.email || 'No disponible'}
                            readOnly
                            className="border border-gray-300 rounded px-3 py-1 bg-gray-50 text-gray-800 text-sm w-64 cursor-default"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4 items-between mb-3 cursor-default">
                {/* Autoridades del Instituto */}
                {data.data.autoridades_instituto.length > 0 && (
                    <div className="flex flex-col">
                        <h3 className="text-base font-semibold text-gray-800 mb-2 cursor-default">Autoridad institucional</h3>
                        <div className="flex flex-row flex-wrap gap-4">
                            {data.data.autoridades_instituto.map((auth, index) => (
                                <div key={index} className="flex flex-col">
                                    <div className="flex flex-row gap-x-4 items-end">
                                        {/* Nombre */}
                                        <div className="flex px-3">
                                            <label className="text-base font-medium text-gray-800 m-2 cursor-default">Nombre: </label>
                                            <input
                                                type="text"
                                                value={auth.nombre_apellido || 'No disponible'}
                                                readOnly
                                                className="border border-gray-300 rounded px-2 py-1 bg-gray-50 text-gray-800 resize-none text-sm w-64 cursor-default"
                                            />
                                        </div>

                                        {/* Cargo */}
                                        <div className="flex px-3">
                                            <label className="text-base font-medium text-gray-800 m-2 cursor-default">Cargo: </label>
                                            <input
                                                type="text"
                                                value={auth.cargo_descripcion || 'No disponible'}
                                                readOnly
                                                className="border border-gray-300 rounded px-2 py-1 bg-gray-50 text-gray-800 resize-none text-sm w-64 cursor-default"
                                            />
                                        </div>

                                        {/* Teléfono */}
                                        <div className="flex px-3">
                                            <label className="text-base font-medium text-gray-800 m-2">Teléfono: </label>
                                            <input
                                                type="text"
                                                value={auth.telefono || 'No disponible'}
                                                readOnly
                                                className="border border-gray-300 rounded px-2 py-1 bg-gray-50 text-gray-800 resize-none text-sm w-64 cursor-default"
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="flex px-3">
                                            <label className="text-base font-medium text-gray-800 m-2">Email: </label>
                                            <input
                                                type="email"
                                                value={auth.email || 'No disponible'}
                                                readOnly
                                                className="border border-gray-300 rounded px-2 py-1 bg-gray-50 text-gray-800 resize-none text-sm  w-64 cursor-default"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Autoridades de Carrera */}
                {data.data.autoridades_carrera.length > 0 && (
                    <div className="flex flex-col">
                        <h3 className="text-base font-semibold text-gray-800 mb-2">Autoridad de la carrera</h3>
                        <div className="flex flex-row flex-wrap gap-4">
                            {data.data.autoridades_carrera.map((auth, index) => (
                                <div key={index} className="flex flex-col">
                                    <div className="flex flex-row gap-x-4 items-end">
                                        <div className="flex px-3">
                                            <label className="text-base font-medium text-gray-800 m-2">Nombre: </label>
                                            <input
                                                type="text"
                                                value={auth.nombre_apellido || 'No disponible'}
                                                readOnly
                                                className="border border-gray-300 rounded px-2 py-1 bg-gray-50 text-gray-800 resize-none text-sm w-64 cursor-default"
                                            />
                                        </div>

                                        <div className="flex px-3">
                                            <label className="text-base font-medium text-gray-800 m-2">Cargo: </label>
                                            <input
                                                type="text"
                                                value={auth.cargo_descripcion || 'No disponible'}
                                                readOnly
                                                className="border border-gray-300 rounded px-2 py-1 bg-gray-50 text-gray-800 resize-none text-sm  w-64 cursor-default"
                                            />
                                        </div>

                                        <div className="flex    px-3">
                                            <label className="text-base font-medium text-gray-800 m-2">Teléfono: </label>
                                            <input
                                                type="text"
                                                value={auth.telefono || 'No disponible'}
                                                readOnly
                                                className="border border-gray-300 rounded px-2 py-1 bg-gray-50 text-gray-800 resize-none text-sm w-64 cursor-default"
                                            />
                                        </div>

                                        <div className="flex    px-3">
                                            <label className="text-base font-medium text-gray-800 m-2">Email: </label>
                                            <input
                                                type="email"
                                                value={auth.email || 'No disponible'}
                                                readOnly
                                                className="border border-gray-300 rounded px-3 py-2 bg-gray-50 text-gray-800 resize-none text-sm w-64 cursor-default"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Observaciones */}
            <div className="mb-3 cursor-default">
                <h3 className="text-base font-semibold text-gray-800 mb-2">Comentarios</h3>
                <textarea
                    value={data.data.observaciones}
                    readOnly
                    rows={2}
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-50 text-gray-800 resize-none text-sm cursor-default"
                />
            </div>

            {/* Botones Aceptar/Rechazar */}
            {showActions && (
                <div className="flex border-t border-gray-200 justify-end gap-4">
                    {/* Botón ACEPTAR */}
                    <button
                        disabled={true} //siempre desabilitado, por el momento, despues trabajar con loadingAceptar y con el evento onAceptar como lo hice abajo
                        className="btn btn-primary shadow-md mr-2 disabled:opacity-50 focus:outline-none focus:ring-0"
                    >
                        <AppIcon name="check" className="w-4 h-4 mr-1" />
                        APRUEBA
                    </button>

                    {/* Botón RECHAZA */}
                    <button
                        onClick={() => handleClick(onRechazar as (data: any) => Promise<void>, setLoadingRechazar)}
                        disabled={loadingRechazar}
                        className={`btn btn-outline-secondary shadow-md mr-2 focus:outline-none focus:ring-0 ${loadingRechazar ? 'disabled:opacity-50' : ''}`}
                    >
                        {loadingRechazar && <AppIcon name="tail-spin" className="w-4 h-4 mr-1" />}
                        {!loadingRechazar && <AppIcon name="x" className="w-4 h-4 mr-1" />}
                        RECHAZA
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExpandedRowForm;
