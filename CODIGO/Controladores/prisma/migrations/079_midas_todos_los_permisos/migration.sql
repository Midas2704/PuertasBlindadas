-- La cuenta raíz Midas conserva todo CU registrado, aunque su operación todavía
-- no esté implementada. La asignación no elude validaciones de integridad ni
-- convierte una capacidad pendiente en una operación backend disponible.

DO $$
DECLARE incompatible RECORD;
BEGIN
  SELECT p."codigo_m4" INTO incompatible
  FROM "comun"."permiso" p
  WHERE p."codigo_m4"='CU377'
    AND (p."permiso_modulo" IS DISTINCT FROM 'DOCUMENTAL'
      OR p."permiso_accion" IS DISTINCT FROM 'administrar conservación documental'
      OR p."requiere_administrador" IS DISTINCT FROM TRUE
      OR p."activo_m4" IS DISTINCT FROM FALSE);
  IF FOUND THEN
    RAISE EXCEPTION 'CU377 ya existe con una definición incompatible';
  END IF;
END $$;

INSERT INTO "comun"."permiso" (
  "permiso_modulo", "permiso_accion", "permiso_descripcion",
  "permiso_nombre_del_permiso", "codigo_m4", "activo_m4", "requiere_administrador"
)
VALUES (
  'DOCUMENTAL', 'administrar conservación documental',
  'Administrar políticas documentales de conservación cuando exista contrato operativo',
  'Administrar conservación documental', 'CU377', FALSE, TRUE
)
ON CONFLICT ("codigo_m4") DO NOTHING;

INSERT INTO "comun"."usuario_permiso_particular" ("id_usuario", "id_permiso")
SELECT u."usuario_id_usuario", p."permiso_id_permiso"
FROM "comun"."usuario" u
CROSS JOIN "comun"."permiso" p
WHERE u."administrador_original"=TRUE
  AND p."codigo_m4" IS NOT NULL
ON CONFLICT ("id_usuario", "id_permiso") DO NOTHING;

UPDATE "comun"."usuario"
SET "configuracion_particular"=TRUE,
    "version_seguridad"="version_seguridad"+1,
    "usuario_fecha_de_ultima_edicion"=CURRENT_TIMESTAMP
WHERE "administrador_original"=TRUE
  AND "configuracion_particular"=FALSE;
