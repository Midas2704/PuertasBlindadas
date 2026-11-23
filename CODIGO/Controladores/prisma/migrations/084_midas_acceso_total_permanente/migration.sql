-- MIDAS es la cuenta raíz permanente del sistema. Esta reconciliación es
-- aditiva: no cambia credenciales, sesiones, datos operativos ni históricos.
DO $$
DECLARE
  id_midas BIGINT;
  id_gerencia BIGINT;
BEGIN
  SELECT "usuario_id_usuario" INTO id_midas
  FROM "comun"."usuario"
  WHERE lower(replace(coalesce("acceso_m4", ''), '.', '')) = '20776101-k'
  ORDER BY "usuario_id_usuario"
  LIMIT 1;

  IF id_midas IS NULL THEN
    RAISE EXCEPTION 'No existe la cuenta raíz MIDAS con acceso 20776101-k';
  END IF;

  INSERT INTO "comun"."perfil" (
    "codigo_m4", "perfil_nombre_perfil", "activo_m4", "admite_particulares"
  )
  VALUES ('gerencia', 'Gerencia', TRUE, FALSE)
  ON CONFLICT ("codigo_m4") DO UPDATE SET "activo_m4"=TRUE
  RETURNING "perfil_id_perfil" INTO id_gerencia;

  UPDATE "comun"."usuario"
  SET "administrador_original"=TRUE,
      "usuario_es_administrador"=TRUE,
      "usuario_es_gerencia"=TRUE,
      "gerencia"='Gerencia',
      "usuario_estado_cuenta"='activo',
      "configuracion_particular"=FALSE,
      "perfil_id_perfil"=id_gerencia,
      "usuario_fecha_de_ultima_edicion"=CURRENT_TIMESTAMP
  WHERE "usuario_id_usuario"=id_midas;

  UPDATE "comun"."estado_seguridad_usuario"
  SET "intentos"=0,
      "bloqueos"=0,
      "bloqueo_hasta"=NULL,
      "bloqueo_persistente"=FALSE,
      "actualizado"=CURRENT_TIMESTAMP,
      "responsable"='Reconciliación permanente de cuenta raíz MIDAS'
  WHERE "id_usuario"=id_midas;

  INSERT INTO "comun"."usuario_permiso_particular" ("id_usuario", "id_permiso")
  SELECT id_midas, permiso."permiso_id_permiso"
  FROM "comun"."permiso" permiso
  WHERE permiso."codigo_m4" IS NOT NULL
  ON CONFLICT ("id_usuario", "id_permiso") DO NOTHING;

  IF NOT EXISTS (
    SELECT 1
    FROM "comun"."usuario" usuario
    JOIN "comun"."perfil" perfil
      ON perfil."perfil_id_perfil"=usuario."perfil_id_perfil"
    WHERE usuario."usuario_id_usuario"=id_midas
      AND usuario."administrador_original"=TRUE
      AND usuario."usuario_es_administrador"=TRUE
      AND usuario."usuario_estado_cuenta"='activo'
      AND perfil."codigo_m4"='gerencia'
      AND perfil."activo_m4"=TRUE
  ) THEN
    RAISE EXCEPTION 'No fue posible acreditar el acceso total permanente de MIDAS';
  END IF;
END $$;
