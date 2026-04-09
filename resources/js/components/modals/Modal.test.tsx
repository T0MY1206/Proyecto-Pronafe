import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import Modal from './Modal';

describe('Modal', () => {
    it('muestra el título y el contenido', () => {
        render(
            <Modal title="Título de prueba" onClose={() => {}}>
                <p>Contenido hijo</p>
            </Modal>,
        );
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Título de prueba')).toBeInTheDocument();
        expect(screen.getByText('Contenido hijo')).toBeInTheDocument();
    });

    it('invoca onClose al pulsar el botón cerrar', async () => {
        const onClose = vi.fn();
        const user = userEvent.setup();
        render(
            <Modal title="X" onClose={onClose}>
                <span>body</span>
            </Modal>,
        );
        await user.click(screen.getByRole('button', { name: /cerrar modal/i }));
        expect(onClose).toHaveBeenCalledTimes(1);
    });
});
