import { ReactNode, useEffect } from 'react';

interface ModalProps {
    children: ReactNode;
    title: string;
    onClose: () => void;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

const Modal = ({ children, title, onClose, maxWidth = '2xl' }: ModalProps) => {
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
        '3xl': 'sm:max-w-3xl',
    }[maxWidth];

    return (
        // Overlay (Fondo oscuro y semi-transparente)
        <div
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-16 sm:items-center sm:pt-20"
            aria-labelledby="modal-title"
            role="dialog"
            aria-modal="true"
        >
            {/* Contenedor del Modal */}
            <div
                className={`relative bg-white rounded-xl shadow-2xl transition-all transform w-full mx-4 my-4 ${maxWidthClass} overflow-y-auto max-h-[80vh]`}
                onClick={(e) => e.stopPropagation()} // Evita que el clic dentro cierre el modal
            >
                {/* Cabecera del Modal */}
                <div className="flex justify-between items-center p-5 border-b border-gray-200">
                    <h3 className="text-xl font-semibold text-gray-800" id="modal-title">
                        {title}
                    </h3>
                    <button
                        type="button"
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                        onClick={onClose}
                        aria-label="Cerrar modal"
                    >
                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Cuerpo del Modal (Contenido pasado por children) */}
                <div className="p-6 text-gray-700">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
