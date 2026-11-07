-- INT-03 interfaz: propuesta revisable de capacidades M4 para Inventario.
-- Se registran INACTIVAS, sin perfiles ni usuarios. Su activación requiere
-- aprobación formal posterior de la responsable del proyecto.
DO $$
DECLARE incompatible RECORD;
BEGIN
  SELECT p."codigo_m4" INTO incompatible
  FROM "comun"."permiso" p
  JOIN (VALUES
    ('CU466','registrar entradas de inventario','Registrar entradas físicas transaccionales e idempotentes','Registrar entradas de Inventario'),
    ('CU467','registrar salidas de inventario','Registrar salidas físicas sin consumir reservas no acreditadas','Registrar salidas de Inventario'),
    ('CU468','crear reservas de inventario','Comprometer stock disponible sin producir salida física','Crear reservas de Inventario'),
    ('CU469','liberar reservas de inventario','Liberar una reserva activa de forma idempotente','Liberar reservas de Inventario'),
    ('CU470','ajustar existencias de inventario','Corregir existencias con motivo y auditoría obligatorios','Ajustar existencias de Inventario'),
    ('CU471','administrar materiales de inventario','Crear y modificar fichas maestras de materiales','Administrar materiales de Inventario'),
    ('CU472','administrar bodegas de inventario','Gestionar bodegas y ubicaciones físicas','Administrar bodegas de Inventario')
  ) esperado(codigo,accion,descripcion,nombre) ON esperado.codigo=p."codigo_m4"
  WHERE p."permiso_modulo" IS DISTINCT FROM 'INVENTARIO'
     OR p."permiso_accion" IS DISTINCT FROM esperado.accion
     OR p."permiso_descripcion" IS DISTINCT FROM esperado.descripcion
     OR p."permiso_nombre_del_permiso" IS DISTINCT FROM esperado.nombre
     OR p."requiere_administrador" IS DISTINCT FROM FALSE
  LIMIT 1;
  IF FOUND THEN RAISE EXCEPTION 'Permiso M4 % ya existe con definición incompatible', incompatible."codigo_m4"; END IF;
END $$;

INSERT INTO "comun"."permiso" (
  "permiso_modulo", "permiso_accion", "permiso_descripcion",
  "permiso_nombre_del_permiso", "codigo_m4", "activo_m4", "requiere_administrador"
)
SELECT 'INVENTARIO', accion, descripcion, nombre, codigo, FALSE, FALSE
FROM (VALUES
  ('CU466','registrar entradas de inventario','Registrar entradas físicas transaccionales e idempotentes','Registrar entradas de Inventario'),
  ('CU467','registrar salidas de inventario','Registrar salidas físicas sin consumir reservas no acreditadas','Registrar salidas de Inventario'),
  ('CU468','crear reservas de inventario','Comprometer stock disponible sin producir salida física','Crear reservas de Inventario'),
  ('CU469','liberar reservas de inventario','Liberar una reserva activa de forma idempotente','Liberar reservas de Inventario'),
  ('CU470','ajustar existencias de inventario','Corregir existencias con motivo y auditoría obligatorios','Ajustar existencias de Inventario'),
  ('CU471','administrar materiales de inventario','Crear y modificar fichas maestras de materiales','Administrar materiales de Inventario'),
  ('CU472','administrar bodegas de inventario','Gestionar bodegas y ubicaciones físicas','Administrar bodegas de Inventario')
) nuevos(codigo,accion,descripcion,nombre)
ON CONFLICT ("codigo_m4") DO NOTHING;

INSERT INTO "comun"."permiso_dependencia" ("id_permiso", "id_requerido")
SELECT dependiente."permiso_id_permiso", requerido."permiso_id_permiso"
FROM (VALUES
  ('CU466','CU15'), ('CU467','CU15'), ('CU468','CU15'),
  ('CU469','CU15'), ('CU470','CU15'), ('CU471','CU14'), ('CU472','CU15')
) relacion(codigo,requerido)
JOIN "comun"."permiso" dependiente ON dependiente."codigo_m4"=relacion.codigo
JOIN "comun"."permiso" requerido ON requerido."codigo_m4"=relacion.requerido
ON CONFLICT ("id_permiso", "id_requerido") DO NOTHING;

-- CU377 permanece excluido. No se asigna ninguna capacidad a usuarios o perfiles.
