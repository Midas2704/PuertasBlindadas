-- Ejecutar exclusivamente después de aplicar 000-076 en PostgreSQL aislado.
DO $validacion$
DECLARE
  esperadas constant text[] := ARRAY[
    'usuario','usuario_contrasena','perfil','permiso','perfil_permiso',
    'usuario_permiso_particular','permiso_dependencia','estado_seguridad_usuario',
    'sesion_usuario','token_recuperacion','area_trabajo','obra','proyecto','proyecto_obra'
  ];
  nombre text;
  referencias_comun bigint;
BEGIN
  IF NOT has_schema_privilege(current_user, 'comun', 'USAGE') THEN
    RAISE EXCEPTION 'El usuario de aplicación no posee USAGE sobre comun';
  END IF;

  FOREACH nombre IN ARRAY esperadas LOOP
    IF to_regclass(format('comun.%I', nombre)) IS NULL THEN
      RAISE EXCEPTION 'Falta comun.%', nombre;
    END IF;
    IF to_regclass(format('terreno.%I', nombre)) IS NOT NULL THEN
      RAISE EXCEPTION 'Permanece una entidad duplicada en terreno.%', nombre;
    END IF;
  END LOOP;

  IF (SELECT count(*) FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
      WHERE n.nspname='comun' AND c.relkind IN ('r','p') AND c.relname=ANY(esperadas)) <> 14 THEN
    RAISE EXCEPTION 'El schema comun no contiene exactamente las 14 tablas aprobadas';
  END IF;

  SELECT count(*) INTO referencias_comun
  FROM pg_constraint c
  JOIN pg_class destino ON destino.oid=c.confrelid
  JOIN pg_namespace esquema_destino ON esquema_destino.oid=destino.relnamespace
  WHERE c.contype='f' AND esquema_destino.nspname='comun';

  IF referencias_comun < 128 THEN
    RAISE EXCEPTION 'Se esperaban al menos 128 FKs hacia comun y sólo existen %', referencias_comun;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_constraint c
    LEFT JOIN pg_class origen ON origen.oid=c.conrelid
    LEFT JOIN pg_namespace esquema_origen ON esquema_origen.oid=origen.relnamespace
    LEFT JOIN pg_class destino ON destino.oid=c.confrelid
    LEFT JOIN pg_namespace esquema_destino ON esquema_destino.oid=destino.relnamespace
    WHERE c.contype IN ('f','p','u','c') AND NOT c.convalidated
      AND (esquema_origen.nspname='comun' OR esquema_destino.nspname='comun')
  ) THEN
    RAISE EXCEPTION 'Existe una restricción no validada vinculada con comun';
  END IF;

  IF position('comun' in coalesce(pg_get_serial_sequence('comun.usuario','usuario_id_usuario'),''))=0
     OR position('comun' in coalesce(pg_get_serial_sequence('comun.proyecto','proyecto_proyecto_id'),''))=0
     OR position('comun' in coalesce(pg_get_serial_sequence('comun.obra','obra_obra_id'),''))=0 THEN
    RAISE EXCEPTION 'Las secuencias owned no acompañaron a sus tablas';
  END IF;
END
$validacion$;

SELECT
  (SELECT count(*) FROM information_schema.tables WHERE table_schema='comun') AS tablas_comun,
  (SELECT count(*) FROM pg_constraint c JOIN pg_class d ON d.oid=c.confrelid JOIN pg_namespace n ON n.oid=d.relnamespace WHERE c.contype='f' AND n.nspname='comun') AS fk_hacia_comun,
  (SELECT count(*) FROM comun.permiso WHERE activo_m4 AND codigo_m4 IS NOT NULL AND codigo_m4<>'CU377') AS permisos_activos_aprobados,
  (SELECT count(*) FROM comun.usuario) AS usuarios_preservados,
  (SELECT count(*) FROM comun.proyecto) AS proyectos_preservados,
  (SELECT count(*) FROM comun.obra) AS obras_preservadas;
