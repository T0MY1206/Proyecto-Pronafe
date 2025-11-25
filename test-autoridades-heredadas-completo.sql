-- ===================================================================
-- SCRIPT COMPLETO PARA PROBAR AUTORIDADES HEREDADAS
-- ===================================================================

-- PASO 1: Verifica la configuración actual
-- ===================================================================

SELECT 'INFORMACIÓN ACTUAL:' as ''; 
SELECT CONCAT('Año actual: ', YEAR(NOW())) as '';
SELECT CONCAT('Año anterior: ', YEAR(NOW()) - 1) as '';

-- Verifica qué institutos tienes
SELECT 'INSTITUTOS DISPONIBLES:' as '';
SELECT cue, nombre FROM institutos WHERE activo = 1 LIMIT 5;

-- Verifica qué actualizaciones tienes
SELECT 'ACTUALIZACIONES EXISTENTES:' as '';
SELECT * FROM actualizaciones ORDER BY anio DESC;

-- ===================================================================
-- PASO 2: Crea una actualización para el año actual (si no existe)
-- ===================================================================

-- VERIFICA PRIMERO si ya existe una actualización para el año actual
SELECT '¿Existe actualización para el año actual?' as '',
       EXISTS(SELECT 1 FROM actualizaciones WHERE anio = YEAR(NOW())) as respuesta;

-- Si no existe, inserta una (descomenta las siguientes líneas)
/*
INSERT INTO actualizaciones (anio, fecha_matriculados, fecha_1_egresados, fecha_2_egresados, fecha_tope, user_id, activo, created_at, updated_at)
VALUES 
(YEAR(NOW()), '2025-03-31', '2025-12-01', '2025-12-31', '2025-12-31', 1, 1, NOW(), NOW());
*/

-- ===================================================================
-- PASO 3: Verifica cargos disponibles
-- ===================================================================

SELECT 'CARGOS DISPONIBLES:' as '';
SELECT id, descripcion, instituto_carrera FROM cargos WHERE activo = 1;

-- ===================================================================
-- PASO 4: Verifica el CUE de tu instituto y su user_id
-- ===================================================================

-- CUE del instituto de prueba
SET @cue_instituto = '20017500';

SELECT 'INFORMACIÓN DEL INSTITUTO:' as '';
SELECT i.cue, i.nombre, i.user_id, u.email as email_usuario
FROM institutos i
LEFT JOIN users u ON i.user_id = u.id
WHERE i.cue = @cue_instituto;

-- ===================================================================
-- PASO 5: IMPORTANTE - Elimina autoridades del año actual si existen
-- ===================================================================

-- Esto es CRÍTICO: si ya existen autoridades del año actual, 
-- la funcionalidad de herencia NO funcionará

SELECT 'VERIFICANDO AUTORIDADES EXISTENTES:' as '';
SELECT cue, anio, COUNT(*) as cantidad 
FROM autoridades 
WHERE cue = @cue_instituto 
GROUP BY cue, anio;

-- Si existen autoridades del año actual, elimínalas primero:
DELETE FROM autoridades 
WHERE cue = @cue_instituto 
AND anio = YEAR(NOW());

SELECT 'Autoridades del año actual eliminadas (si existían)' as '';

-- ===================================================================
-- PASO 6: Inserta autoridades del año anterior
-- ===================================================================

-- Obtiene el ID del cargo institucional (Ajusta según tu BD)
SET @cargo_institucional = (
    SELECT id FROM cargos 
    WHERE instituto_carrera = 'I' AND activo = 1 
    LIMIT 1
);

-- Obtiene el ID del cargo carrera (Ajusta según tu BD)
SET @cargo_carrera = (
    SELECT id FROM cargos 
    WHERE instituto_carrera = 'C' AND activo = 1 
    LIMIT 1
);

-- Obtiene el user_id del instituto
SET @user_id = (SELECT user_id FROM institutos WHERE cue = @cue_instituto LIMIT 1);

SELECT CONCAT('Cargo Institucional ID: ', COALESCE(@cargo_institucional, 'NO ENCONTRADO')) as '';
SELECT CONCAT('Cargo Carrera ID: ', COALESCE(@cargo_carrera, 'NO ENCONTRADO')) as '';
SELECT CONCAT('User ID: ', COALESCE(@user_id, 'NO ENCONTRADO')) as '';

-- INSERTA las autoridades del año anterior
INSERT INTO autoridades (anio, cue, nombre_apellido, cargo_id, telefono, email, user_id, activo, created_at, updated_at)
VALUES
-- Autoridad Institucional (año anterior - 2024)
(YEAR(NOW()) - 1, @cue_instituto, 'Test Autoridad Institucional', @cargo_institucional, '11-1234-5678', 'institucional.test@instituto.edu.ar', @user_id, 1, NOW(), NOW()),
-- Autoridad Carrera (año anterior - 2024)
(YEAR(NOW()) - 1, @cue_instituto, 'Test Autoridad Carrera', @cargo_carrera, '11-2345-6789', 'carrera.test@instituto.edu.ar', @user_id, 1, NOW(), NOW());

SELECT '✅ Autoridades del año anterior insertadas correctamente' as '';

-- ===================================================================
-- PASO 7: Verifica el resultado final
-- ===================================================================

SELECT 'AUTORIDADES FINALES:' as '';
SELECT cue, anio, nombre_apellido, cargo_id, activo 
FROM autoridades 
WHERE cue = @cue_instituto 
ORDER BY anio DESC;

-- ===================================================================
-- PASO 8: Listo para probar
-- ===================================================================

SELECT '🎉 DATOS DE PRUEBA CREADOS' as '';
SELECT 'Ahora puedes:' as '';
SELECT CONCAT('1. Iniciar sesión como usuario del instituto CUE: ', @cue_instituto) as '';
SELECT '2. Ir a "Actualización de datos"' as '';
SELECT '3. Ver el banner amarillo con las autoridades heredadas' as '';

