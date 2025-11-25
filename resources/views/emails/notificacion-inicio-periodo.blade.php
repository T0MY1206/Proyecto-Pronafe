<!DOCTYPE html>
<html>
<head>
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
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .content {
            padding: 20px 0;
        }
        .dates {
            background-color: #e9ecef;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .dates ul {
            margin: 0;
            padding-left: 20px;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #dee2e6;
            font-size: 14px;
            color: #6c757d;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Inicio de Período de Actualización</h1>
    </div>
    
    <div class="content">
        <p>Hola <strong>{{ $nombreInstituto }}</strong>,</p>
        
        <p>Se ha iniciado un nuevo período de actualización de datos para el año <strong>{{ $periodo->anio }}</strong>.</p>
        
        <p>Por favor, ingresa al sistema para completar la información requerida.</p>
        
        <div class="dates">
            <h3>📅 Fechas Importantes:</h3>
            <ul>
                <li><strong>Fecha de Matriculados:</strong> {{ date('d/m/Y', strtotime($periodo->fecha_matriculados)) }}</li>
                <li><strong>Fecha 1 Egresados:</strong> {{ date('d/m/Y', strtotime($periodo->fecha_1_egresados)) }}</li>
                <li><strong>Fecha 2 Egresados:</strong> {{ date('d/m/Y', strtotime($periodo->fecha_2_egresados)) }}</li>
                <li><strong>Fecha Tope:</strong> {{ date('d/m/Y', strtotime($periodo->fecha_tope)) }}</li>
            </ul>
        </div>
        
        <p>Es importante que completes la información dentro de los plazos establecidos.</p>
    </div>
    
    <div class="footer">
        <p>Saludos cordiales,</p>
        <p><strong>El equipo de gestión</strong></p>
        <p><em>Este es un mensaje automático, por favor no responder.</em></p>
    </div>
</body>
</html>
