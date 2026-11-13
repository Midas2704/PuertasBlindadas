-- CU18 es la capacidad aprobada para emitir cotizaciones mediante el flujo
-- documental seguro. Reconciliación aditiva e idempotente del catálogo M4.
DO $$
DECLARE incompatible RECORD;
BEGIN
  SELECT p."codigo_m4" INTO incompatible
  FROM "comun"."permiso" p
  WHERE p."codigo_m4"='CU18'
    AND p."permiso_modulo" IS NOT NULL
    AND p."permiso_modulo" IS DISTINCT FROM 'M2';
  IF FOUND THEN
    RAISE EXCEPTION 'CU18 ya existe asociado a un módulo incompatible';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM "comun"."permiso"
    WHERE "codigo_m4"='CU19' AND "activo_m4"=TRUE
  ) THEN
    RAISE EXCEPTION 'CU19 activo es requisito para registrar CU18';
  END IF;
END $$;

INSERT INTO "comun"."permiso" (
  "permiso_modulo", "permiso_accion", "permiso_descripcion",
  "permiso_nombre_del_permiso", "codigo_m4", "activo_m4", "requiere_administrador"
)
VALUES (
  'M2', 'emitir cotizaciones',
  'Emitir una cotización con versión documental confirmada, almacenamiento privado y antivirus validado',
  'Emitir cotizaciones', 'CU18', TRUE, FALSE
)
ON CONFLICT ("codigo_m4") DO UPDATE SET
  "permiso_modulo"=EXCLUDED."permiso_modulo",
  "permiso_accion"=EXCLUDED."permiso_accion",
  "permiso_descripcion"=EXCLUDED."permiso_descripcion",
  "permiso_nombre_del_permiso"=EXCLUDED."permiso_nombre_del_permiso",
  "activo_m4"=TRUE,
  "requiere_administrador"=FALSE;

INSERT INTO "comun"."permiso_dependencia" ("id_permiso", "id_requerido")
SELECT dependiente."permiso_id_permiso", requerido."permiso_id_permiso"
FROM "comun"."permiso" dependiente
JOIN "comun"."permiso" requerido ON requerido."codigo_m4"='CU19'
WHERE dependiente."codigo_m4"='CU18'
ON CONFLICT ("id_permiso", "id_requerido") DO NOTHING;

INSERT INTO "comun"."perfil_permiso" (
  "perfil_id_perfil", "permiso_id_permiso", "perfil_permiso_activo"
)
SELECT perfil."perfil_id_perfil", permiso."permiso_id_permiso", TRUE
FROM "comun"."perfil" perfil
JOIN "comun"."permiso" permiso ON permiso."codigo_m4"='CU18'
WHERE perfil."codigo_m4" IN ('gerencia','secretaria')
  AND perfil."activo_m4"=TRUE
ON CONFLICT ("perfil_id_perfil", "permiso_id_permiso") DO UPDATE SET
  "perfil_permiso_activo"=TRUE;

INSERT INTO "comun"."usuario_permiso_particular" ("id_usuario", "id_permiso")
SELECT usuario."usuario_id_usuario", permiso."permiso_id_permiso"
FROM "comun"."usuario" usuario
JOIN "comun"."permiso" permiso ON permiso."codigo_m4"='CU18'
WHERE usuario."administrador_original"=TRUE
ON CONFLICT ("id_usuario", "id_permiso") DO NOTHING;

DO $$
DECLARE perfiles INTEGER;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM "comun"."permiso" p
    WHERE p."codigo_m4"='CU18'
      AND p."permiso_modulo"='M2'
      AND p."activo_m4"=TRUE
      AND p."requiere_administrador"=FALSE
  ) THEN
    RAISE EXCEPTION 'No fue posible acreditar CU18 activo y compatible';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM "comun"."permiso_dependencia" d
    JOIN "comun"."permiso" p ON p."permiso_id_permiso"=d."id_permiso"
    JOIN "comun"."permiso" r ON r."permiso_id_permiso"=d."id_requerido"
    WHERE p."codigo_m4"='CU18' AND r."codigo_m4"='CU19'
  ) THEN
    RAISE EXCEPTION 'No fue posible acreditar la dependencia CU18 -> CU19';
  END IF;

  SELECT COUNT(*) INTO perfiles
  FROM "comun"."perfil_permiso" pp
  JOIN "comun"."perfil" perfil ON perfil."perfil_id_perfil"=pp."perfil_id_perfil"
  JOIN "comun"."permiso" permiso ON permiso."permiso_id_permiso"=pp."permiso_id_permiso"
  WHERE perfil."codigo_m4" IN ('gerencia','secretaria')
    AND permiso."codigo_m4"='CU18'
    AND pp."perfil_permiso_activo"=TRUE;
  IF perfiles <> 2 THEN
    RAISE EXCEPTION 'CU18 debe quedar activo para Gerencia y Secretaría';
  END IF;
END $$;

-- CU377 y CU466-CU472 permanecen fuera de esta reconciliación.
