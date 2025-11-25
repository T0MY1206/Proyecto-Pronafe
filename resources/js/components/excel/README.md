# Componentes de Excel

## Cómo Usar ExcelExportComponent

### Importación
```tsx
import { ExcelExportComponent } from '@/components/excel';
```

### Uso Básico
```tsx
<ExcelExportComponent
    exportType="formularios"
    exportConfig={exportConfigs.formularios}
    periodoActual={periodoActual}
    provincias={provincias}
    exportUrl={route('admin.exportar.formularios')}
    title="Exportar Formularios"
/>
```

### Props Requeridas
- `exportType`: Tipo de exportación (ej: "formularios", "resumen")
- `exportConfig`: Configuración de la exportación desde el backend
- `provincias`: Array de provincias disponibles
- `exportUrl`: URL de la ruta de exportación

### Props Opcionales
- `periodoActual`: Período actual del sistema
- `aniosDisponibles`: Array de años disponibles para exportación (se obtiene automáticamente de las actualizaciones)
- `title`: Título del componente
- `className`: Clases CSS adicionales
- `showDescription`: Mostrar descripción (default: true)
- `customFilters`: Filtros personalizados en lugar de los automáticos

### Callbacks de Eventos
```tsx
<ExcelExportComponent
    onExportStart={() => console.log('Iniciando...')}
    onExportComplete={() => console.log('Completado!')}
    onExportError={(error) => console.error('Error:', error)}
    // ... otros props
/>
```

### Filtros Personalizados
```tsx
<ExcelExportComponent
    customFilters={
        <>
            <div>
                <label className="form-label">Filtro Personalizado</label>
                <input type="text" className="form-control" />
            </div>
        </>
    }
    // ... otros props
/>
```

### Personalización de Estilos
```tsx
<ExcelExportComponent
    className="border-l-4 border-blue-500"
    showDescription={false}
    // ... otros props
/>
```

## Cómo Usar ExcelExportGrid

### Importación
```tsx
import { ExcelExportGrid } from '@/components/excel';
```

### Uso
```tsx
<ExcelExportGrid
    exportConfigs={exportConfigs}
    columns={2}
    showTitles={true}
    periodoActual={periodoActual}
    provincias={provincias}
/>
```

### Props
- `exportConfigs`: Todas las configuraciones de exportación
- `periodoActual`: Período actual del sistema
- `provincias`: Array de provincias disponibles
- `aniosDisponibles`: Array de años disponibles para exportación
- `columns`: Número de columnas (1-4, default: 2)
- `showTitles`: Mostrar títulos (default: true)
- `className`: Clases CSS adicionales

## Configuración en el Backend

Cada exportación debe estar configurada en `ExcelExportService`:

```php
'formularios' => [
    'class' => FormulariosExport::class,
    'name' => 'Formularios_Aprobados',
    'description' => 'Formularios completos con datos institucionales...',
    'required_params' => ['anio'],
    'optional_params' => ['provincia_id']
]
```

## Parámetros Soportados

- **Requeridos**: `anio` (año de la exportación)
- **Opcionales**: `provincia_id` (filtrar por provincia)
