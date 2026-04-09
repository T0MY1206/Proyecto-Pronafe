<?php

namespace App\Services;

use App\Constants\Estados;
use App\Mail\DatoRechazadoMail;
use App\Models\Dato;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SupervisorDatoEstadoService
{
    public function updateEstado(Request $request, int $datoId, int $estado): bool
    {
        $motivoRechazo = (string) $request->input('motivo_rechazo', ' ');

        if ($estado === Estados::RECHAZADO) {
            $request->validate(['motivo_rechazo' => 'required|string|max:1000']);
            $this->notifyRechazo($request, $datoId, $motivoRechazo);
        }

        $supervisorId = (int) $request->user()->id;

        return (bool) Dato::changeEstado($datoId, $estado, $motivoRechazo, $supervisorId);
    }

    private function notifyRechazo(Request $request, int $datoId, string $motivoRechazo): void
    {
        $dato = Dato::findOrFail($datoId);
        $email = $this->resolveEmail($request, $datoId);

        if (!$email) {
            Log::warning('No se pudo obtener email para envío de rechazo', ['dato_id' => $datoId]);
            return;
        }

        try {
            Mail::to($email)->send(new DatoRechazadoMail($dato, $motivoRechazo, $request->user()));
            Log::info('Email de rechazo enviado', ['dato_id' => $datoId, 'email' => $email]);
        } catch (\Throwable $exception) {
            Log::error("Error al enviar email de rechazo para Dato #{$datoId}: {$exception->getMessage()}");
        }
    }

    private function resolveEmail(Request $request, int $datoId): ?string
    {
        $requestEmail = $request->input('email');
        if ($requestEmail && filter_var($requestEmail, FILTER_VALIDATE_EMAIL)) {
            return $requestEmail;
        }

        $emailSource = config('app.email_source', 'database');

        if (in_array($emailSource, ['file', 'test'], true)) {
            return $this->getEmailFromFile();
        }

        return Dato::getEmailForData($datoId);
    }

    private function getEmailFromFile(): ?string
    {
        $filePath = base_path('emails_prueba.txt');
        if (!is_file($filePath)) {
            return null;
        }

        $emails = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($emails as $email) {
            $cleanEmail = trim($email);
            if (filter_var($cleanEmail, FILTER_VALIDATE_EMAIL)) {
                return $cleanEmail;
            }
        }

        return null;
    }
}
