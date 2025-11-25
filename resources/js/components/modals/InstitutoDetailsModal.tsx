import { Instituto } from '@/types';
import { useEffect } from 'react';
import { router } from '@inertiajs/react';
import FormularioDatos from '@/components/forms/FormularioDatos';

interface InstitutoDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    instituto: Instituto | null;
}

export default function InstitutoDetailsModal({ isOpen, onClose, instituto }: InstitutoDetailsModalProps) {
    if (!instituto) return null;

    const handleEdit = () => {
        router.get(route('admin.institutos.edit', {
            instituto: instituto.cue
        }))
    }

    useEffect(() => {
        if (isOpen) {
            // Ocultar la navegación cuando el modal está abierto
            const topBar = document.querySelector('.top-bar');
            const sideNav = document.querySelector('.side-nav');

            if (topBar) {
                (topBar as HTMLElement).style.display = 'none';
            }
            if (sideNav) {
                (sideNav as HTMLElement).style.display = 'none';
            }
        } else {
            // Mostrar la navegación cuando el modal se cierra
            const topBar = document.querySelector('.top-bar');
            const sideNav = document.querySelector('.side-nav');

            if (topBar) {
                (topBar as HTMLElement).style.display = '';
            }
            if (sideNav) {
                (sideNav as HTMLElement).style.display = '';
            }
        }

        // Cleanup function para restaurar la navegación si el componente se desmonta
        return () => {
            const topBar = document.querySelector('.top-bar');
            const sideNav = document.querySelector('.side-nav');

            if (topBar) {
                (topBar as HTMLElement).style.display = '';
            }
            if (sideNav) {
                (sideNav as HTMLElement).style.display = '';
            }
        };
    }, [isOpen]);

    if (!isOpen) return null;


    const getAmbitoGestionText = (ambito: string | null) => {
        switch (ambito) {
            case 'E':
                return 'Estatal';
            case 'P':
                return 'Privado';
            default:
                return 'No especificado';
        }
    };

    // Preparar datos para el formulario
    const formularioData = {
        instituto: {
            cue: instituto.cue,
            nombre: instituto.nombre,
            direccion: instituto.direccion,
            localidad: instituto.localidad?.descripcion,
            codigo_postal: instituto.codigo_postal,
            telefono: instituto.telefono,
            email: instituto.email,
            tipo_instituto: instituto.tipo_instituto
        },
        autoridadInstitucional: {},
        autoridadCarrera: {},
        datos: {},
        anio: new Date().getFullYear(),
        cargosInstitucionales: [],
        cargosCarrera: []
    };

    return (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
            <div className="h-full max-h-none w-full max-w-none overflow-y-auto mx-3 rounded-none bg-white shadow-xl">
                <div className="flex items-center justify-between border-b p-6">
                    <h2 className="text-2xl font-bold text-gray-900">Detalles del Instituto</h2>
                    <button onClick={onClose} className="text-gray-400 transition-colors hover:text-gray-600">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="p-6">
                    <div className="grid gap-6 md:grid-cols-4">
                        {/* Información Básica */}
                        <div className="space-y-4">
                            <h3 className="border-b pb-2 text-lg font-semibold text-gray-800">Información Básica</h3>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">CUE</label>
                                    <p className="mt-1 rounded bg-gray-50 p-2 text-sm text-gray-900">{instituto.cue_editable}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Nombre</label>
                                    <p className="mt-1 rounded bg-gray-50 p-2 text-sm text-gray-900">{instituto.nombre}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Tipo de Instituto</label>
                                    <p className="mt-1 rounded bg-gray-50 p-2 text-sm text-gray-900">
                                        {instituto.tipo_instituto?.descripcion || 'No especificado'}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Ámbito de Gestión</label>
                                    <p className="mt-1 rounded bg-gray-50 p-2 text-sm text-gray-900">
                                        {getAmbitoGestionText(instituto.ambito_gestion?.toString() || null)}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Estado</label>
                                    <p className="mt-1 rounded bg-gray-50 p-2 text-sm text-gray-900">
                                        <span
                                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                                instituto.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {instituto.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Información de Ubicación */}
                        <div className="space-y-4">
                            <h3 className="border-b pb-2 text-lg font-semibold text-gray-800">Ubicación</h3>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Provincia</label>
                                    <p className="mt-1 rounded bg-gray-50 p-2 text-sm text-gray-900">
                                        {instituto.localidad?.provincia?.descripcion || 'No especificado'}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Departamento</label>
                                    <p className="mt-1 rounded bg-gray-50 p-2 text-sm text-gray-900">
                                        {instituto.departamento?.descripcion || 'No especificado'}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Localidad</label>
                                    <p className="mt-1 rounded bg-gray-50 p-2 text-sm text-gray-900">
                                        {instituto.localidad?.descripcion || 'No especificado'}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Dirección</label>
                                    <p className="mt-1 rounded bg-gray-50 p-2 text-sm text-gray-900">{instituto.direccion || 'No especificado'}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Código Postal</label>
                                    <p className="mt-1 rounded bg-gray-50 p-2 text-sm text-gray-900">
                                        {instituto.codigo_postal || 'No especificado'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Información de Contacto */}
                        <div className="space-y-4">
                            <h3 className="border-b pb-2 text-lg font-semibold text-gray-800">Contacto</h3>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Teléfono</label>
                                    <p className="mt-1 rounded bg-gray-50 p-2 text-sm text-gray-900">{instituto.telefono || 'No especificado'}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Email</label>
                                    <p className="mt-1 rounded bg-gray-50 p-2 text-sm text-gray-900">{instituto.email || 'No especificado'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Información Académica */}
                        <div className="space-y-4">
                            <h3 className="border-b pb-2 text-lg font-semibold text-gray-800">Información Académica</h3>

                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Año de Ingreso</label>
                                    <p className="mt-1 rounded bg-gray-50 p-2 text-sm text-gray-900">{instituto.anio_ingreso || 'No especificado'}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-600">Año de Egreso</label>
                                    <p className="mt-1 rounded bg-gray-50 p-2 text-sm text-gray-900">{instituto.anio_egreso || 'No especificado'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Fechas de Registro */}
                    <div className="mt-6 border-t pt-6">
                        <h3 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-800">Fechas de Registro</h3>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-600">Fecha de Creación</label>
                                <p className="mt-1 rounded bg-gray-50 p-2 text-sm text-gray-900">
                                    {instituto.created_at ? new Date(instituto.created_at).toLocaleDateString('es-ES') : 'No especificado'}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600">Última Actualización</label>
                                <p className="mt-1 rounded bg-gray-50 p-2 text-sm text-gray-900">
                                    {instituto.updated_at ? new Date(instituto.updated_at).toLocaleDateString('es-ES') : 'No especificado'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex items-center justify-end gap-3 border-t bg-gray-50 p-6">
                    <button
                        onClick={onClose}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                    >
                        Cerrar
                    </button>
                    <button
                        onClick={handleEdit}
                        className="btn-primary rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                    >
                        <svg className="mr-2 inline h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                        </svg>
                        Editar Instituto
                    </button>
                </div>
            </div>
        </div>
    );
}
