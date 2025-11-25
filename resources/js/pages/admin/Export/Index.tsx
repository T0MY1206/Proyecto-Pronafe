import { AdminLayout } from "@/layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";

interface PeriodoActual {
    id: number;
    anio: number;
    fecha_tope: string;
}

interface Provincia {
    id: number;
    descripcion: string;
}

interface Props {
    periodoActual?: PeriodoActual;
    provincias: Provincia[];
}

export default function ExportIndex({ periodoActual, provincias }: Props) {
    const [isExporting, setIsExporting] = useState(false);
    
    const { data, setData, post, processing, errors } = useForm({
        anio: periodoActual?.anio || new Date().getFullYear(),
        provincia_id: ''
    });

    console.log('ExportIndex props:', { periodoActual, provincias });

    const handleExport = (type: 'formularios' | 'resumen') => {
        setIsExporting(true);
        
        // Crear un formulario temporal para la descarga
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = route(`admin.exportar.${type}`);
        form.style.display = 'none';
        
        // Agregar token CSRF
        const csrfToken = (window as any).Laravel?.csrfToken || 
                         document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        
        if (!csrfToken) {
            console.error('No se pudo obtener el token CSRF');
            alert('Error: No se pudo obtener el token de seguridad. Por favor, recarga la página.');
            setIsExporting(false);
            return;
        }
        
        const csrfInput = document.createElement('input');
        csrfInput.type = 'hidden';
        csrfInput.name = '_token';
        csrfInput.value = csrfToken;
        form.appendChild(csrfInput);
        
        // Agregar datos del formulario
        const anioInput = document.createElement('input');
        anioInput.type = 'hidden';
        anioInput.name = 'anio';
        anioInput.value = data.anio.toString();
        form.appendChild(anioInput);
        
        if (data.provincia_id) {
            const provinciaInput = document.createElement('input');
            provinciaInput.type = 'hidden';
            provinciaInput.name = 'provincia_id';
            provinciaInput.value = data.provincia_id;
            form.appendChild(provinciaInput);
        }
        
        // Agregar al DOM, enviar y remover
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
        
        // Simular finalización después de un tiempo
        setTimeout(() => setIsExporting(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Exportar Datos</h1>
                
                <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold mb-4">Exportar Formularios Completos</h2>
                            
                            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <h3 className="font-medium text-blue-800 mb-2">📋 Información sobre la exportación:</h3>
                                <div className="text-sm text-blue-700">
                                    <p><strong>Formularios Completos:</strong> Lista detallada de cada instituto con todos sus datos individuales organizados en tres hojas: Institucionales, Alumnos y Docentes, y Comentarios</p>
                                </div>
                            </div>
                    
                    <div className="space-y-4">
                        <button
                            onClick={() => handleExport('formularios')}
                            disabled={isExporting}
                            className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            📋 Exportar Formularios Recibidos
                        </button>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t">
                        <a
                            href={route('admin.dashboard')}
                            className="inline-flex items-center text-gray-600 hover:text-gray-900"
                        >
                            ← Volver al Dashboard
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}