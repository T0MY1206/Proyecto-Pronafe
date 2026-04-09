# PRONAFE - Sistema de Gestión de Actualizaciones Institucionales

Aplicación web para administrar la carga, revisión y seguimiento de datos de institutos de enfermería, con flujos diferenciados por rol:

- `Administrador`: gestiona períodos, institutos, usuarios y exportaciones.
- `Supervisor`: revisa formularios y aprueba/rechaza envíos.
- `Instituto`: carga y actualiza información institucional.

## Tecnologías utilizadas

### Backend
- PHP `8.2+`
- Laravel `12`
- Inertia Laravel
- Sanctum
- Maatwebsite Excel
- **MySQL** (o MariaDB) para la aplicación en desarrollo y producción (configuración en `.env`).

### Frontend
- React `19` + TypeScript
- Inertia React
- Vite `6`
- Tailwind CSS `4`
- Radix UI (componentes base)

### Pruebas automatizadas
- **Backend:** [Pest](https://pestphp.com/) 3 sobre PHPUnit; migraciones ejecutadas contra **SQLite en memoria** solo durante `php artisan test` (definido en `phpunit.xml`), sin sustituir MySQL en runtime.
- **Frontend:** [Vitest](https://vitest.dev/), [React Testing Library](https://testing-library.com/react), [jsdom](https://github.com/jsdom/jsdom), `@testing-library/user-event`.

### Herramientas de calidad
- ESLint
- Prettier
- TypeScript (`tsc --noEmit`)

## Arquitectura y principios

El proyecto mantiene una base Laravel MVC con separación por contexto de rol y mejoras aplicadas hacia una arquitectura más limpia:

- separación por módulos de negocio (`Admin`, `Supervisor`, `Instituto`),
- extracción de lógica de negocio a servicios (`app/Services`),
- reducción de lógica transversal en controladores,
- configuración desacoplada desde `config/*` en lugar de uso directo de `env()` en runtime.

Principios aplicados:
- `SRP`: responsabilidades más acotadas entre controlador y servicio.
- `DIP`: controladores dependen de servicios para operaciones de dominio.
- `DRY`: consolidación de lógica repetida de flujo de estados/notificaciones.

## Requisitos de entorno

- PHP `8.2` o superior
- Composer `2.x`
- Node.js `20+`
- npm `10+`
- Base de datos compatible con Laravel (MySQL/MariaDB recomendado)

## Instalación rápida

```bash
git clone <url-del-repo>
cd Proyecto-Pronafe

composer install
npm install

cp .env.example .env
php artisan key:generate

php artisan migrate:fresh --seed
```

## Levantar el proyecto

### Desarrollo (backend + cola + Vite)
```bash
composer run dev
```

### Solo frontend
```bash
npm run dev
```

### Solo backend
```bash
php artisan serve
```

## Estrategia de pruebas

- **Backend:** pruebas de características (HTTP, middleware por rol, rutas API) y pruebas de servicios en `app/Services` con base de datos aislada por test.
- **Frontend:** pruebas unitarias de utilidades (`resources/js/lib`) y de componentes con props claras; las pantallas Inertia completas no están cubiertas por defecto (evitan mocks pesados de `usePage`).
- Requisitos: `composer install` y `npm install`; variables opcionales en `.env.testing` si en el futuro se parametriza otro entorno de test.

## Scripts útiles

### Calidad y build
```bash
npm run lint
npm run types
npm run build
composer test
```

### Pruebas (backend)
```bash
composer test
php artisan test
php artisan test --filter=NombreDelTest
```

### Pruebas (frontend)
```bash
npm run test
npm run test:watch
npm run test:coverage
```

La cobertura de código PHP opcional (`--coverage`) requiere la extensión PCOV o Xdebug en el entorno local.

### Base de datos
```bash
php artisan migrate
php artisan migrate:fresh --seed
php artisan db:seed
```

### Cache y configuración
```bash
php artisan optimize:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
```

### Comandos funcionales del dominio
```bash
php artisan institutos:crear-usuarios
php artisan institutos:enviar-contrasenas
```

## Flujo funcional resumido

1. Administración define período de actualización.
2. Institutos cargan formularios y datos.
3. Supervisores revisan estados y procesan aprobación/rechazo.
4. Administración explota información y exporta reportes.

## Notas operativas

- El login utiliza `login_user_name` como identificador principal.
- Existen tests del starter kit de Laravel marcados como `skip` por no aplicar al flujo real del producto.
- La capa visual está estandarizada sobre Tailwind v4 y en migración progresiva de estilos legacy.

## Troubleshooting

### Error de assets de Vite
```bash
npm install
npm run build
php artisan optimize:clear
```

### Problemas de migraciones o seeders
```bash
php artisan migrate:fresh --seed
```

### Fallos de autenticación en testing
- Verificar que los tests usen `login_user_name` en lugar de `email`.