import { useState } from 'react';
import type { ExcelExportComponentProps } from '@/types';

export default function ExcelExportComponent({
    exportType,
    exportConfig,
    periodoActual,
    provincias,
    aniosDisponibles = [],
    exportUrl,
    title,
    className = '',
    showDescription = true,
    customFilters,
    onExportStart,
    onExportComplete,
    onExportError
}: ExcelExportComponentProps) {
    const [isExporting, setIsExporting] = useState(false);
    const [selectedAnio, setSelectedAnio] = useState(periodoActual?.anio || new Date().getFullYear());
    const [selectedProvincia, setSelectedProvincia] = useState('');
    const [csrfError, setCsrfError] = useState<string | null>(null);
    
    // Función helper para obtener el token CSRF
    const getCSRFToken = async (): Promise<string | null> => {
        // Estrategia 1: Token desde window.Laravel
        let csrfToken = (window as any).Laravel?.csrfToken;
        if (csrfToken) return csrfToken;

        // Estrategia 2: Token desde meta tag
        const metaTag = document.querySelector('meta[name="csrf-token"]');
        csrfToken = metaTag?.getAttribute('content');
        if (csrfToken) return csrfToken;

        // Estrategia 3: Token desde cookies
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'XSRF-TOKEN') {
                csrfToken = decodeURIComponent(value);
                if (csrfToken) return csrfToken;
            }
        }

        // Estrategia 4: Obtener token via API
        try {
            const response = await fetch('/api/csrf-token', {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.csrf_token) return data.csrf_token;
            }
        } catch (error) {
            console.warn('No se pudo obtener token CSRF via API:', error);
        }

        // Estrategia 5: Obtener token desde página actual
        try {
            const currentUrl = window.location.pathname;
            const response = await fetch(currentUrl, {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                }
            });
            
            if (response.ok) {
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const metaTag = doc.querySelector('meta[name="csrf-token"]');
                csrfToken = metaTag?.getAttribute('content');
                if (csrfToken) return csrfToken;
            }
        } catch (error) {
            console.warn('No se pudo obtener token CSRF desde página actual:', error);
        }

        return null;
    };
    
    // Función para refrescar el token CSRF
    const refreshCSRFToken = async () => {
        try {
            setCsrfError(null);
            const token = await getCSRFToken();
            if (token) {
                // Actualizar el token en el DOM
                const metaTag = document.querySelector('meta[name="csrf-token"]');
                if (metaTag) {
                    metaTag.setAttribute('content', token);
                }
                // También actualizar en window.Laravel si existe
                if ((window as any).Laravel) {
                    (window as any).Laravel.csrfToken = token;
                }
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error al refrescar token CSRF:', error);
            return false;
        }
    };
    
    const handleExport = async () => {
        // Validar parámetros requeridos
        const missingParams = exportConfig.required_params.filter(param => {
            if (param === 'anio') return !selectedAnio;
            if (param === 'provincia_id') return !selectedProvincia;
            return false;
        });

        if (missingParams.length > 0) {
            const errorMessage = `Faltan parámetros requeridos: ${missingParams.join(', ')}`;
            onExportError?.(errorMessage);
            alert(errorMessage);
            return;
        }

        setIsExporting(true);
        onExportStart?.();
        
        try {
            // Obtener el token CSRF con múltiples estrategias
            const csrfToken = await getCSRFToken();
            
            if (!csrfToken) {
                const errorMsg = 'No se pudo obtener el token CSRF. Por favor, recarga la página e intenta nuevamente.';
                setCsrfError(errorMsg);
                throw new Error(errorMsg);
            }
            
            // Limpiar error anterior si se obtuvo el token
            setCsrfError(null);
            
            // Crear un formulario temporal para la descarga
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = exportUrl;
            form.style.display = 'none';
        
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = '_token';
            csrfInput.value = csrfToken;
            form.appendChild(csrfInput);
            
            // Agregar datos del formulario
            const anioInput = document.createElement('input');
            anioInput.type = 'hidden';
            anioInput.name = 'anio';
            anioInput.value = selectedAnio.toString();
            form.appendChild(anioInput);
            
            if (selectedProvincia) {
                const provinciaInput = document.createElement('input');
                provinciaInput.type = 'hidden';
                provinciaInput.name = 'provincia_id';
                provinciaInput.value = selectedProvincia;
                form.appendChild(provinciaInput);
            }
            
            // Agregar al DOM, enviar y remover
            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
            
            // Simular finalización después de un tiempo
            setTimeout(() => {
                setIsExporting(false);
                onExportComplete?.();
            }, 2000);
            
        } catch (error) {
            console.error('Error al exportar:', error);
            const errorMessage = error instanceof Error 
                ? error.message 
                : 'Error al exportar el archivo. Por favor, recarga la página e intenta nuevamente.';
            onExportError?.(errorMessage);
            alert(errorMessage);
            setIsExporting(false);
        }
    };

    const renderDefaultFilters = (): React.ReactNode[] => {
        const filters: React.ReactNode[] = [];
        
        // Filtro de año si es requerido
        if (exportConfig.required_params.includes('anio') || exportConfig.optional_params.includes('anio')) {
            filters.push(
                <div key="anio">
                    <label className="form-label">Año</label>
                    <select
                        value={selectedAnio}
                        onChange={(e) => setSelectedAnio(parseInt(e.target.value))}
                        className="form-select"
                        required={exportConfig.required_params.includes('anio')}
                    >
                        {aniosDisponibles.length > 0 ? (
                            aniosDisponibles.map((anio) => (
                                <option key={anio} value={anio}>
                                    {anio}
                                </option>
                            ))
                        ) : (
                            // Fallback si no hay años disponibles
                            Array.from({ length: 5 }, (_, i) => {
                                const year = new Date().getFullYear() - 2 + i;
                                return (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                );
                            })
                        )}
                    </select>
                </div>
            );
        }

        // Filtro de provincia si está disponible
        if (exportConfig.optional_params.includes('provincia_id') && provincias.length > 0) {
            filters.push(
                <div key="provincia">
                    <label className="form-label">Provincia (Opcional)</label>
                    <select
                        value={selectedProvincia}
                        onChange={(e) => setSelectedProvincia(e.target.value)}
                        className="form-select"
                    >
                        <option value="">Todas las provincias</option>
                        {provincias.map((provincia) => (
                            <option key={provincia.id} value={provincia.id}>
                                {provincia.descripcion}
                            </option>
                        ))}
                    </select>
                </div>
            );
        }

        return filters;
    };

    const getExportIcon = () => {
        switch (exportType) {
            case 'formularios':
                return '📋';
            case 'resumen':
                return '📊';
            case 'reporte':
                return '📈';
            default:
                return '📄';
        }
    };

    const getExportButtonText = () => {
        const icon = getExportIcon();
        const baseText = exportConfig.name.replace(/_/g, ' ');
        
        if (isExporting) {
            return (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Exportando...
                </>
            );
        }

        return (
            <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {icon} Exportar {baseText}
            </>
        );
    };

    return (
        <div className={`intro-y box p-5 ${className}`}>
            {title && (
                <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                </div>
            )}

            {showDescription && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">📋 Información sobre la exportación:</h4>
                    <div className="text-sm text-blue-700">
                        <p><strong>{exportConfig.name.replace(/_/g, ' ')}:</strong> {exportConfig.description}</p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {customFilters ? customFilters : renderDefaultFilters()}
            </div>

            {/* Mensaje de error CSRF */}
            {csrfError && (
                <div className="alert alert-warning mb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <strong>⚠️ Error de Token CSRF</strong>
                            <p className="mt-1 text-sm">{csrfError}</p>
                        </div>
                        <button
                            onClick={refreshCSRFToken}
                            className="btn btn-sm btn-outline-warning ml-4"
                        >
                            🔄 Refrescar Token
                        </button>
                    </div>
                </div>
            )}

            <div className="flex justify-center">
                <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className={`btn btn-primary btn-lg px-8 py-3 text-lg ${isExporting ? 'opacity-75 cursor-not-allowed' : ''}`}
                    aria-label={isExporting ? 'Exportando archivo...' : `Exportar ${exportConfig.name.replace(/_/g, ' ')}`}
                >
                    {getExportButtonText()}
                </button>
            </div>
        </div>
    );
}
