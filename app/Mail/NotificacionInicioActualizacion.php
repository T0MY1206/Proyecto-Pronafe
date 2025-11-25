<?php

namespace App\Mail;

use App\Models\Actualizacion;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NotificacionInicioActualizacion extends Mailable
{
    use Queueable, SerializesModels;

    public string $nombreInstituto;
    public string $emailInstituto;
    public string $passwordGenerica;
    public Actualizacion $periodo;

    /**
     * Create a new message instance.
     */
    public function __construct(string $nombreInstituto, string $emailInstituto, string $passwordGenerica, Actualizacion $periodo)
    {
        $this->nombreInstituto = $nombreInstituto;
        $this->emailInstituto = $emailInstituto;
        $this->passwordGenerica = $passwordGenerica;
        $this->periodo = $periodo;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Inicio de Período de Actualización - ' . $this->periodo->anio,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.notificacion-inicio-actualizacion',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
