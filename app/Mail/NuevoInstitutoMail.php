<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NuevoInstitutoMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $nombre;
    public string $email;
    public string $password;

    public function __construct(string $nombre, string $email, string $password)
    {
        $this->nombre = $nombre;
        $this->email = $email;
        $this->password = $password;
    }

    public function build(): static
    {
        return $this->subject('Bienvenido a '.config('app.name'))
            ->view('emails.nuevo-instituto');
    }
}
