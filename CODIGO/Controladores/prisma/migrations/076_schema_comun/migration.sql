-- Reubica identidades transversales sin copiar filas ni recrear claves.
-- ALTER TABLE ... SET SCHEMA conserva OID, datos, índices, constraints, FKs y secuencias owned.

BEGIN;

CREATE SCHEMA IF NOT EXISTS "comun";
COMMENT ON SCHEMA "comun" IS 'Identidad, seguridad, organización y contexto operacional compartido por Finanzas, Inventario y Terreno.';

CREATE TEMP TABLE estado_migracion_076 (
  nombre text PRIMARY KEY,
  oid_original oid NOT NULL,
  filas_originales bigint NOT NULL,
  constraints_originales integer NOT NULL,
  fk_entrantes_originales integer NOT NULL,
  indices_originales integer NOT NULL,
  triggers_originales integer NOT NULL
) ON COMMIT DROP;

DO $preflight$
DECLARE
  nombre_tabla text;
  cantidad bigint;
  tablas constant text[] := ARRAY[
    'usuario','usuario_contrasena','perfil','permiso','perfil_permiso',
    'usuario_permiso_particular','permiso_dependencia','estado_seguridad_usuario',
    'sesion_usuario','token_recuperacion','area_trabajo','obra','proyecto','proyecto_obra'
  ];
BEGIN
  FOREACH nombre_tabla IN ARRAY tablas LOOP
    IF to_regclass(format('comun.%I', nombre_tabla)) IS NOT NULL THEN
      RAISE EXCEPTION '076: comun.% ya existe; se detiene para evitar sobrescritura', nombre_tabla;
    END IF;
    IF to_regclass(format('terreno.%I', nombre_tabla)) IS NULL THEN
      RAISE EXCEPTION '076: falta terreno.%; no es seguro continuar', nombre_tabla;
    END IF;
    EXECUTE format('SELECT count(*) FROM terreno.%I', nombre_tabla) INTO cantidad;
    INSERT INTO estado_migracion_076(
      nombre, oid_original, filas_originales, constraints_originales,
      fk_entrantes_originales, indices_originales, triggers_originales
    )
    SELECT
      nombre_tabla,
      tabla.oid,
      cantidad,
      (SELECT count(*) FROM pg_constraint WHERE conrelid = tabla.oid),
      (SELECT count(*) FROM pg_constraint WHERE contype = 'f' AND confrelid = tabla.oid),
      (SELECT count(*) FROM pg_index WHERE indrelid = tabla.oid),
      (SELECT count(*) FROM pg_trigger WHERE tgrelid = tabla.oid AND NOT tgisinternal)
    FROM pg_class tabla
    WHERE tabla.oid = to_regclass(format('terreno.%I', nombre_tabla));
  END LOOP;
END
$preflight$;

-- Catálogos de organización y contexto operacional.
ALTER TABLE "terreno"."area_trabajo" SET SCHEMA "comun";
ALTER TABLE "terreno"."obra" SET SCHEMA "comun";
ALTER TABLE "terreno"."proyecto" SET SCHEMA "comun";
ALTER TABLE "terreno"."proyecto_obra" SET SCHEMA "comun";

-- Identidad, autorización y seguridad M4.
ALTER TABLE "terreno"."perfil" SET SCHEMA "comun";
ALTER TABLE "terreno"."permiso" SET SCHEMA "comun";
ALTER TABLE "terreno"."usuario" SET SCHEMA "comun";
ALTER TABLE "terreno"."perfil_permiso" SET SCHEMA "comun";
ALTER TABLE "terreno"."usuario_contrasena" SET SCHEMA "comun";
ALTER TABLE "terreno"."usuario_permiso_particular" SET SCHEMA "comun";
ALTER TABLE "terreno"."permiso_dependencia" SET SCHEMA "comun";
ALTER TABLE "terreno"."estado_seguridad_usuario" SET SCHEMA "comun";
ALTER TABLE "terreno"."sesion_usuario" SET SCHEMA "comun";
ALTER TABLE "terreno"."token_recuperacion" SET SCHEMA "comun";

-- Replica los privilegios de uso del schema de origen. Los ACL de tablas se conservan
-- porque son atributos de los mismos objetos físicos que acaban de cambiar de namespace.
DO $privilegios$
DECLARE
  permiso record;
  destinatario text;
BEGIN
  FOR permiso IN
    SELECT acl.grantee, acl.privilege_type, acl.is_grantable
    FROM pg_namespace n
    CROSS JOIN LATERAL aclexplode(COALESCE(n.nspacl, acldefault('n', n.nspowner))) acl
    WHERE n.nspname = 'terreno'
      AND acl.privilege_type IN ('USAGE', 'CREATE')
  LOOP
    destinatario := CASE
      WHEN permiso.grantee = 0 THEN 'PUBLIC'
      ELSE format('%I', pg_get_userbyid(permiso.grantee))
    END;
    EXECUTE format(
      'GRANT %s ON SCHEMA "comun" TO %s%s',
      permiso.privilege_type,
      destinatario,
      CASE WHEN permiso.is_grantable THEN ' WITH GRANT OPTION' ELSE '' END
    );
  END LOOP;
END
$privilegios$;

DO $postflight$
DECLARE
  nombre_tabla text;
  estado record;
  cantidad bigint;
  tablas constant text[] := ARRAY[
    'usuario','usuario_contrasena','perfil','permiso','perfil_permiso',
    'usuario_permiso_particular','permiso_dependencia','estado_seguridad_usuario',
    'sesion_usuario','token_recuperacion','area_trabajo','obra','proyecto','proyecto_obra'
  ];
BEGIN
  FOREACH nombre_tabla IN ARRAY tablas LOOP
    IF to_regclass(format('comun.%I', nombre_tabla)) IS NULL
       OR to_regclass(format('terreno.%I', nombre_tabla)) IS NOT NULL THEN
      RAISE EXCEPTION '076: la reubicación de % no quedó íntegra', nombre_tabla;
    END IF;
    SELECT * INTO estado FROM estado_migracion_076 WHERE estado_migracion_076.nombre = nombre_tabla;
    IF to_regclass(format('comun.%I', nombre_tabla))::oid <> estado.oid_original THEN
      RAISE EXCEPTION '076: % fue recreada en lugar de conservar su identidad física', nombre_tabla;
    END IF;
    EXECUTE format('SELECT count(*) FROM comun.%I', nombre_tabla) INTO cantidad;
    IF cantidad <> estado.filas_originales THEN
      RAISE EXCEPTION '076: cambió la cantidad de filas de % (% -> %)', nombre_tabla, estado.filas_originales, cantidad;
    END IF;
    IF (SELECT count(*) FROM pg_constraint WHERE conrelid = estado.oid_original) <> estado.constraints_originales
       OR (SELECT count(*) FROM pg_constraint WHERE contype = 'f' AND confrelid = estado.oid_original) <> estado.fk_entrantes_originales
       OR (SELECT count(*) FROM pg_index WHERE indrelid = estado.oid_original) <> estado.indices_originales
       OR (SELECT count(*) FROM pg_trigger WHERE tgrelid = estado.oid_original AND NOT tgisinternal) <> estado.triggers_originales THEN
      RAISE EXCEPTION '076: cambiaron constraints, FKs entrantes, índices o triggers de %', nombre_tabla;
    END IF;
  END LOOP;

  IF EXISTS (
    SELECT 1
    FROM pg_constraint c
    JOIN pg_class tabla ON tabla.oid = c.conrelid
    JOIN pg_namespace esquema ON esquema.oid = tabla.relnamespace
    WHERE (esquema.nspname = 'comun'
           OR c.confrelid IN (
             SELECT clase.oid
             FROM pg_class clase
             JOIN pg_namespace ns ON ns.oid = clase.relnamespace
             WHERE ns.nspname = 'comun' AND clase.relkind IN ('r','p')
           ))
      AND c.contype IN ('f','p','u','c')
      AND NOT c.convalidated
  ) THEN
    RAISE EXCEPTION '076: existe una restricción no validada en las entidades trasladadas';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM pg_depend dependencia
    JOIN pg_class secuencia ON secuencia.oid = dependencia.objid AND secuencia.relkind = 'S'
    JOIN pg_namespace esquema_secuencia ON esquema_secuencia.oid = secuencia.relnamespace
    WHERE dependencia.deptype IN ('a', 'i')
      AND dependencia.refobjid IN (SELECT oid_original FROM estado_migracion_076)
      AND esquema_secuencia.nspname <> 'comun'
  ) THEN
    RAISE EXCEPTION '076: una secuencia owned no acompañó a su tabla al schema comun';
  END IF;
END
$postflight$;

COMMENT ON COLUMN "finanzas"."evento_auditoria"."id_usuario" IS
  'FK física hacia comun.usuario(usuario_id_usuario); identidad transversal compartida por los módulos.';
COMMENT ON COLUMN "finanzas"."proyecto_financiero"."id_proyecto_terreno" IS
  'FK física hacia comun.proyecto(proyecto_proyecto_id); se conserva el nombre de columna por compatibilidad.';

COMMIT;
