<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Formulario Rechazado</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #dc3545;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .content {
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        .rejection-reason {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .button {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Formulario Rechazado</h1>
        <h2>Año {{ $formulario->anio }}</h2>
    </div>

    <div class="content">
        <h3>Estimado/a {{ $nombreInstituto }},</h3>
        
        <p>Le informamos que su formulario de actualización de datos para el año <strong>{{ $formulario->anio }}</strong> ha sido <strong>rechazado</strong> y requiere modificaciones.</p>
        
        <div class="rejection-reason">
            <h4>Motivo del rechazo:</h4>
            <p>{{ $formulario->motivo_rechazo }}</p>
        </div>

        <p>Para corregir los datos y volver a enviar el formulario, haga clic en el siguiente enlace:</p>
        
        <div style="text-align: center;">
            <a href="{{ route('login') }}" class="button">Acceder al Sistema</a>
        </div>

        <p>Una vez que ingrese al sistema, podrá:</p>
        <ul>
            <li>Revisar los comentarios del supervisor</li>
            <li>Modificar los datos según las indicaciones</li>
            <li>Guardar los cambios como borrador</li>
            <li>Volver a enviar el formulario para revisión</li>
        </ul>

        <p><strong>Fecha de rechazo:</strong> {{ $formulario->fecha_rechazo->format('d/m/Y H:i') }}</p>
        <p><strong>Supervisor:</strong> {{ $formulario->supervisor->name ?? 'No especificado' }}</p>

        <p>Si tiene alguna consulta sobre los comentarios, no dude en contactarnos.</p>
    </div>

    <div class="footer">
        <p>Este es un mensaje automático del Sistema de Actualización de Datos.</p>
        <p>Por favor, no responda a este email.</p>
    </div>
</body>
</html>
