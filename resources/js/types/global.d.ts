import type { route as routeFn } from 'ziggy-js';

declare global {
    const route: typeof routeFn;
}

// Define la estructura de tus mensajes flash
interface FlashMessages {
    success?: string;
    error?: string;
}

// Define la estructura de los mensajes toast
interface ToastMessage {
    type: 'success' | 'warning' | 'error' | 'info';
    text: string;
}

// Extiende la interfaz PageProps de Inertia para incluir tus props compartidas
declare module '@inertiajs/core' {
    interface PageProps {
        flash: FlashMessages; // mensajes flash
        auth: AuthProps;      // props de autenticación
        toast?: ToastMessage; // mensajes toast
    }
}