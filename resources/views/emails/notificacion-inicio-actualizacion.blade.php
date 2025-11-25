<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Inicio de Período de Actualización</title>
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
            background-color: #f8f9fa;
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
        .credentials {
            background-color: #e9ecef;
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
        <h1>Sistema de Actualización de Datos</h1>
        <h2>Período {{ $periodo->anio }}</h2>
    </div>

    <div class="content">
        <h3>Estimado/a {{ $nombreInstituto }},</h3>
        
        <p>Le informamos que ha comenzado el período de actualización de datos para el año <strong>{{ $periodo->anio }}</strong>.</p>
        
        <p><strong>Fechas importantes:</strong></p>
        <ul>
            <li><strong>Inicio:</strong> {{ $periodo->fecha_matriculados->format('d/m/Y') }}</li>
            <li><strong>Fecha tope:</strong> {{ $periodo->fecha_tope->format('d/m/Y') }}</li>
            @endif
        </ul>

        <div class="credentials">
            <h4>Credenciales de acceso:</h4>
            <p><strong>Email:</strong> {{ $emailInstituto }}</p>
            <p><strong>Contraseña temporal:</strong> {{ $passwordGenerica }}</p>
            <p><em>Importante: Deberá cambiar esta contraseña en su primer acceso al sistema.</em></p>
        </div>

        <p>Para acceder al sistema y completar la actualización de datos, haga clic en el siguiente enlace:</p>
        
        <div style="text-align: center;">
            <a href="{{ route('login') }}" class="button">Acceder al Sistema</a>
        </div>

        <p>Una vez que ingrese al sistema, podrá:</p>
        <ul>
            <li>Cambiar su contraseña temporal</li>
            <li>Visualizar el dashboard con información de años anteriores</li>
            <li>Completar el formulario de datos del año actual</li>
            <li>Importar datos del año anterior si lo desea</li>
            <li>Guardar como borrador o enviar para revisión</li>
        </ul>

        <p>Si tiene alguna consulta, no dude en contactarnos.</p>
    </div>

    <div class="footer">
        <p>Este es un mensaje automático del Sistema de Actualización de Datos.</p>
        <p>Por favor, no responda a este email.</p>
    </div>
</body>
</html>
