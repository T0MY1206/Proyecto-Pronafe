import React from 'react';

export default function Tab({ title, onFiltroSeleccionado, filtroActual }) {
    const handleTabChange = (valor) => {
        onFiltroSeleccionado(valor);
    };

    return (
        <div className="flex items-center gap-4 flex-wrap">
            <div className="text-base font-bold text-gray-600">{title}:</div>
             <a
                href="#"
                className={`btn btn-primary rounded px-4 py-2 ${filtroActual === 1 ? 'bg-gray-700' : ''}`}
                onClick={() => handleTabChange(1)}
                role="tab"
                aria-selected={filtroActual === 1}
            >
                RECIBIDOS
            </a>
            <a
                href="#"
                className={`btn btn-primary rounded px-4 py-2 ${filtroActual === 3 ? 'bg-gray-700' : ''}`}
                onClick={() => handleTabChange(3)}
                role="tab"
                aria-selected={filtroActual === 3}
            >
                PROCESADOS
            </a>
           
        </div>
    );
}