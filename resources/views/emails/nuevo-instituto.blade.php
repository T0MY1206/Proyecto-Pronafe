<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
</head>
<body>
    <p>Sr/a. <strong>{{ $nombre }}</strong></p>
    <p>Usuario: <strong>{{ $email }}</strong></p>
    <p>Contraseña: <strong>{{ $password }}</strong></p>
    <p>{{ config('app.name') }} le informa que ha registrado un nuevo usuario. Por favor, haga click en el siguiente enlace para ingresar a su cuenta:</p>
    <div class="center">
        <a href="{{ url('/login?validate=true') }}" class="btn btn-primary">
            Ingresar a mi cuenta
        </a>
    </div>
</body>
</html>
