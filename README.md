# 📧 Sistema de Envío de Emails - Documentación Completa

## 📋 Tabla de Contenidos
- [Configuración](#configuración)
- [Comandos de Email](#comandos-de-email)
- [Vistas de Email](#vistas-de-email)
- [Control de Envío](#control-de-envío)
- [Logs y Monitoreo](#logs-y-monitoreo)
- [Archivos de Prueba](#archivos-de-prueba)

---

## ⚙️ Configuración

### Variables de Entorno (.env)

```env
# Configuración de Email
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=tu_cuenta@gmail.com
MAIL_PASSWORD=tu_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=instituto93@gmail.com
MAIL_FROM_NAME="Prueba INET"

# Control de Notificaciones Automáticas
ENABLE_EMAIL_NOTIFICATIONS=true
```

## 🚀 Comportamiento del envío y comandos de Email

### Envío por lotes (throttling)
- Tamaño de lote: 20 emails por lote
- Pausa entre lotes: 30 segundos
- Dónde se implementa:
  - `app/Http/Controllers/Admin/ActualizacionesController::enviarNotificacionesInstitutos()`
  - `app/Console/Commands/EnviarContrasenasInstitutos`
- Motivo: evitar límites/antispam del proveedor SMTP
- Actualmente es un valor fijo en código; si deseas, podemos parametrizarlo por `.env`.

### 1. Crear Usuarios para Institutos
```bash
php artisan institutos:crear-usuarios
```

**Descripción**: Crea usuarios para todos los institutos que no tengan usuario asociado.

**Parámetros**:
- `--force`: Forzar creación incluso si ya existen usuarios

**Funcionalidad**:
- Busca institutos activos sin usuario asociado
- Genera contraseñas genéricas (3 letras + 3 números)
- Crea usuarios con rol de instituto (rol_id = 3)
- Asocia el usuario con el CUE del instituto

**Ejemplo de salida**:
```
🔍 Buscando institutos sin usuario asociado...
📊 Encontrados 5 institutos sin usuario.
✅ Usuario creado para Instituto Tomás Tutor
   📧 Email: tomas2000tutor@gmail.com
   🔑 Contraseña: INS123
```

### 2. Enviar Contraseñas por Email
```bash
php artisan institutos:enviar-contrasenas
```

**Descripción**: Envía contraseñas genéricas por email a todos los institutos con usuarios asociados.

**Parámetros**:
- `--periodo=ID`: Especificar período de actualización por ID

**Funcionalidad**:
- Busca institutos activos con usuarios asociados
- Genera nuevas contraseñas genéricas
- Envía emails por lotes de 20 con pausa de 30 segundos entre cada lote (throttling)
- Registra logs de éxito y error en base de datos
- Usa el período activo o el especificado

**Ejemplo de uso**:
```bash
# Usar período activo
php artisan institutos:enviar-contrasenas

# Usar período específico
php artisan institutos:enviar-contrasenas --periodo=1
```

**Ejemplo de salida**:
```
📧 Enviando contraseñas genéricas a institutos...
📊 Encontrados 10 institutos con usuarios.
📅 Usando período: 2025
📧 Enviando emails con credenciales por lotes...
📊 Total institutos: 10
📦 Lotes de 20 emails con 30s de pausa entre lotes
✅ Email enviado a Instituto Tomás Tutor (tomas2000tutor@gmail.com)
⏳ Esperando 30 segundos antes del siguiente lote...
📈 Resumen del envío:
   ✅ Emails enviados: 10
```

---

## 📧 Vistas de Email

### Ubicación de Archivos
```
resources/views/emails/
├── notificacion-inicio-periodo.blade.php
└── notificacion-inicio-actualizacion.blade.php
```

### 1. Notificación de Inicio de Período
**Archivo**: `notificacion-inicio-periodo.blade.php`
**Uso**: Se envía cuando se crea un nuevo período de actualización
**Contenido**:
- Saludo personalizado al instituto
- Información del período (año)
- Fechas importantes (matriculados, egresados, tope)
- Instrucciones para acceder al sistema

### 2. Notificación de Inicio de Actualización
**Archivo**: `notificacion-inicio-actualizacion.blade.php`
**Uso**: Se envía con las credenciales de acceso
**Contenido**:
- Credenciales de acceso (email y contraseña temporal)
- Enlace directo al sistema
- Instrucciones detalladas de uso
- Fechas importantes del período

---

## 🎛️ Control de Envío

### Variable de Control
```env
ENABLE_EMAIL_NOTIFICATIONS=true
```

**Valores**:
- `true`: Los emails se envían automáticamente (producción)
- `false`: Los emails NO se envían (desarrollo)

### Comportamiento por Entorno

#### Desarrollo (ENABLE_EMAIL_NOTIFICATIONS=false)
- ✅ Se crean las actualizaciones normalmente
- ❌ NO se envían emails automáticamente
- 📝 Mensaje: "Actualización guardada correctamente (emails deshabilitados)"

#### Producción (ENABLE_EMAIL_NOTIFICATIONS=true)
- ✅ Se crean las actualizaciones normalmente
- ✅ Se envían emails automáticamente
- 📝 Mensaje: "Actualización guardada correctamente y emails enviados"

### Lugares donde se aplica el control:
1. **ActualizacionesController**: Al crear nueva actualización
2. **PeriodoActualizacionController**: Al crear nuevo período

---

## 📊 Logs y Monitoreo

### Tabla de Logs
**Tabla**: `email_logs`
**Modelo**: `App\Models\EmailLog`

### Campos principales:
- `to_email`: Email destinatario
- `to_name`: Nombre del destinatario
- `mail_class`: Clase del email enviado
- `status`: Estado del envío (sent, failed, pending)
- `sent_at`: Fecha de envío exitoso
- `failed_at`: Fecha de error
- `error_message`: Mensaje de error si falla
- `metadata`: Datos adicionales en JSON

### Tipos de Email:
- `inicio_periodo`: Notificación de inicio de período
- `credenciales`: Envío de credenciales

### Estados:
- `sent`: Email enviado exitosamente
- `failed`: Error en el envío
- `pending`: Pendiente de envío

### Consultas útiles:
```php
// Estadísticas por período
EmailLog::estadisticasPorPeriodo(2025);

// Emails con errores
EmailLog::emailsConErrores(2025);

// Todos los logs
EmailLog::obtenerLogsCompletos();
```

---

## 🧪 Archivos de Prueba

### Archivo de Emails de Prueba
**Archivo**: `emails_prueba.txt`
**Ubicación**: Raíz del proyecto
**Contenido**: Lista de emails de prueba para testing

**Formato**:
```
test1@example.com
test2@example.com
test3@example.com
admin@correo.com
supervisor@correo.com
instituto@correo.com
```

### Uso para Testing
1. Reemplaza emails en `emails_prueba.txt` con direcciones de prueba
2. Usa estos emails para comandos de prueba
3. Nunca uses este archivo en producción

---

## 🔧 Comandos de Mantenimiento

### Limpiar caché de configuración
```bash
php artisan config:clear
php artisan cache:clear
```

### Verificar configuración de email
```bash
php artisan tinker
>>> config('mail.from.address')
>>> config('mail.default')
```

### Ver logs de email
```bash
tail -f storage/logs/laravel.log
```

---

## ⚠️ Consideraciones Importantes

### Límites de Gmail SMTP
- Máximo 500 emails por día
- Máximo 100 emails por hora
- Delay recomendado entre lotes: 30 segundos

### Seguridad
- Usar App Passwords de Gmail, no contraseñas normales
- Nunca commitear credenciales en el código
- Usar variables de entorno para todas las configuraciones

### Monitoreo
- Revisar logs regularmente
- Verificar tabla `email_logs` para estadísticas
- Configurar alertas para errores masivos

---

## 🆘 Solución de Problemas

### Error: "Column not found: login_user_name"
**Solución**: Ejecutar migraciones
```bash
php artisan migrate
```

### Error: "Table 'email_logs' doesn't exist"
**Solución**: Ejecutar migración de email_logs
```bash
php artisan migrate
```

### Emails no se envían
**Verificar**:
1. Configuración SMTP en `.env`
2. Variable `ENABLE_EMAIL_NOTIFICATIONS`
3. Logs en `storage/logs/laravel.log`

### Gmail rechaza emails
**Solución**:
1. Verificar App Password
2. Reducir frecuencia de envío
3. Usar delay entre lotes