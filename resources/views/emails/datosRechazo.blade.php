<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <div style="max-width: 600px; margin: 0 auto;">
        <h1>Notificación de Rechazo de Actualización de Datos</h1>
        <p>Estimado/a responsable,</p>
        <p>Le informamos que la actualización del registro (CUE: <strong>{{ $dato->cue }}</strong>) ha sido <strong>rechazada</strong> por el supervisor.</p>
        <hr>
        <h2>Detalles del Rechazo</h2>
        <p>Fecha y hora:<strong>{{ now()->format('d/m/Y H:i:s') }}</strong> </p>
        <hr>
        <p>Motivo:<strong>{{ $motivo }}</strong></p> 
        <hr>
        <h2>Próximos Pasos</h2>
        <p>Por favor, revise la información proporcionada en el motivo, realice las correcciones necesarias en el sistema y vuelva a enviar la actualización.</p>
        <p>Si tiene alguna duda, por favor contacte a su supervisor: <strong>{{ $supervisorNombre }}</strong>.</p>
        <p style="margin-top: 20px;">
            Gracias,<br>
            El Equipo de Supervisión
        </p>
        <hr>
        <p style="font-size: 10px; color: #666666;">
            Este email es una notificación automática. Por favor, no responda a este mensaje.
        </p>
    </div>
</body>
</html>