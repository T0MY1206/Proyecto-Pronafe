<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailLog extends Model
{
    protected $table = 'email_logs';
    
    protected $fillable = [
        'email_queue_id',
        'to_email',
        'to_name',
        'mail_class',
        'mail_data',
        'priority',
        'status',
        'response_message',
        'error_message',
        'attempt_number',
        'sent_at',
        'failed_at',
        'metadata',
    ];

    protected $attributes = [
        'attempt_number' => 1,
    ];

    protected $casts = [
        'mail_data' => 'array',
        'metadata' => 'array',
        'sent_at' => 'datetime',
        'failed_at' => 'datetime',
    ];

    // Constantes para tipos de email
    const TIPO_INICIO_PERIODO = 'inicio_periodo';
    const TIPO_CREDENCIALES = 'credenciales';

    // Constantes para estados
    const ESTADO_ENVIADO = 'sent';
    const ESTADO_ERROR = 'failed';
    const ESTADO_PENDIENTE = 'pending';

    /**
     * Crear log de email enviado exitosamente
     */
    public static function logEnviado(string $tipo, string $email, string $nombre, ?string $cue = null, ?int $periodoAnio = null, ?int $loteNumero = null): self
    {
        return self::create([
            'to_email' => $email,
            'to_name' => $nombre,
            'mail_class' => $tipo === self::TIPO_INICIO_PERIODO 
                ? 'App\Mail\NotificacionInicioPeriodo' 
                : 'App\Mail\NotificacionInicioActualizacion',
            'mail_data' => [
                'nombre' => $nombre,
                'email' => $email,
                'cue' => $cue,
                'periodo_anio' => $periodoAnio,
                'lote_numero' => $loteNumero,
            ],
            'priority' => 1,
            'status' => self::ESTADO_ENVIADO,
            'attempt_number' => 1,
            'sent_at' => now(),
            'metadata' => [
                'tipo' => $tipo,
                'cue_instituto' => $cue,
                'periodo_anio' => $periodoAnio,
                'lote_numero' => $loteNumero,
            ],
        ]);
    }

    /**
     * Crear log de email con error
     */
    public static function logError(string $tipo, string $email, string $nombre, string $mensajeError, ?string $cue = null, ?int $periodoAnio = null, ?int $loteNumero = null): self
    {
        return self::create([
            'to_email' => $email,
            'to_name' => $nombre,
            'mail_class' => $tipo === self::TIPO_INICIO_PERIODO 
                ? 'App\Mail\NotificacionInicioPeriodo' 
                : 'App\Mail\NotificacionInicioActualizacion',
            'mail_data' => [
                'nombre' => $nombre,
                'email' => $email,
                'cue' => $cue,
                'periodo_anio' => $periodoAnio,
                'lote_numero' => $loteNumero,
            ],
            'priority' => 1,
            'status' => self::ESTADO_ERROR,
            'error_message' => $mensajeError,
            'attempt_number' => 1,
            'failed_at' => now(),
            'metadata' => [
                'tipo' => $tipo,
                'cue_instituto' => $cue,
                'periodo_anio' => $periodoAnio,
                'lote_numero' => $loteNumero,
            ],
        ]);
    }

    /**
     * Obtener estadísticas de emails por período
     */
    public static function estadisticasPorPeriodo(int $periodoAnio): array
    {
        $logs = self::whereJsonContains('metadata->periodo_anio', $periodoAnio)->get();
        
        return [
            'total' => $logs->count(),
            'enviados' => $logs->where('status', self::ESTADO_ENVIADO)->count(),
            'errores' => $logs->where('status', self::ESTADO_ERROR)->count(),
            'inicio_periodo' => $logs->where('metadata.tipo', self::TIPO_INICIO_PERIODO)->count(),
            'credenciales' => $logs->where('metadata.tipo', self::TIPO_CREDENCIALES)->count(),
        ];
    }

    /**
     * Obtener emails con errores para un período
     */
    public static function emailsConErrores(int $periodoAnio): \Illuminate\Database\Eloquent\Collection
    {
        return self::whereJsonContains('metadata->periodo_anio', $periodoAnio)
            ->where('status', self::ESTADO_ERROR)
            ->orderBy('created_at', 'desc')
            ->get();
    }

    /**
     * Obtener todos los logs de emails
     */
    public static function obtenerLogsCompletos(): \Illuminate\Database\Eloquent\Collection
    {
        return self::orderBy('created_at', 'desc')->get();
    }
}