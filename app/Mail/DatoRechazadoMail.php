<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Dato;
use App\Models\User;

class DatoRechazadoMail extends Mailable
{
    use Queueable, SerializesModels;
    public $dato;
    public $motivoRechazo;
    public $supervisor;

    /**
     * Crea una nueva instancia del mensaje.
     *
     * @param \App\Models\Dato $dato
     * @param string $motivoRechazo
     * @param \App\Models\User $supervisor
     */
    public function __construct(Dato $dato, string $motivoRechazo, User $supervisor)
    {
        $this->dato = $dato;
        $this->motivoRechazo = $motivoRechazo;
        $this->supervisor = $supervisor;
    }
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Notificación de Rechazo - Actualización de Datos',
        );
    }
    public function content(): Content
    {
        return new Content(
            view: 'emails.datosRechazo', // Esto hace referencia a la plantilla Blade
            with: [
                'dato' => $this->dato,
                'motivo' => $this->motivoRechazo,
                'supervisorNombre' => $this->supervisor->nombre ?? 'Supervisor',
            ],
        );
    }

    /**
     * Obtiene los adjuntos para el mensaje.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
