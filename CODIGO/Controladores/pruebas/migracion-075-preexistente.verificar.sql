\set ON_ERROR_STOP on

CREATE OR REPLACE FUNCTION pg_temp.afirmar_075(condicion BOOLEAN, mensaje TEXT)
RETURNS VOID LANGUAGE plpgsql AS $$
BEGIN
  IF condicion IS DISTINCT FROM TRUE THEN
    RAISE EXCEPTION 'VALIDACION_075: %', mensaje;
  END IF;
END;
$$;

SELECT pg_temp.afirmar_075(
  (SELECT COUNT(*) = 2 FROM terreno.permiso WHERE codigo_m4 IN ('CU20', 'CU36')),
  'CU20 y CU36 deben continuar sin duplicados'
);

SELECT pg_temp.afirmar_075(
  NOT EXISTS (
    SELECT 1
    FROM public.validacion_m4_preexistente anterior
    JOIN terreno.permiso actual ON actual.codigo_m4 = anterior.codigo_m4
    WHERE actual.permiso_id_permiso IS DISTINCT FROM anterior.permiso_id_permiso
      OR actual.permiso_modulo IS DISTINCT FROM anterior.permiso_modulo
      OR actual.permiso_accion IS DISTINCT FROM anterior.permiso_accion
      OR actual.permiso_nombre_del_permiso IS DISTINCT FROM anterior.permiso_nombre_del_permiso
      OR actual.permiso_descripcion IS DISTINCT FROM anterior.permiso_descripcion
      OR actual.activo_m4 IS DISTINCT FROM anterior.activo_m4
      OR actual.requiere_administrador IS DISTINCT FROM anterior.requiere_administrador
  ),
  '075 no debe cambiar IDs ni definiciones compatibles preexistentes'
);

SELECT pg_temp.afirmar_075(
  NOT EXISTS (
    SELECT 1
    FROM public.validacion_m4_preexistente anterior
    JOIN terreno.permiso permiso ON permiso.codigo_m4 = anterior.codigo_m4
    WHERE anterior.asignaciones_perfil IS DISTINCT FROM (
      SELECT COUNT(*) FROM terreno.perfil_permiso pp WHERE pp.permiso_id_permiso = permiso.permiso_id_permiso
    )
      OR anterior.asignaciones_particulares IS DISTINCT FROM (
        SELECT COUNT(*) FROM terreno.usuario_permiso_particular up WHERE up.id_permiso = permiso.permiso_id_permiso
      )
  ),
  '075 debe preservar asignaciones existentes de perfiles y usuarios'
);

SELECT pg_temp.afirmar_075(
  (SELECT COUNT(*) FROM terreno.perfil) = (SELECT MAX(perfiles_totales) FROM public.validacion_m4_preexistente)
  AND (SELECT COUNT(*) FROM terreno.usuario) = (SELECT MAX(usuarios_totales) FROM public.validacion_m4_preexistente),
  '075 no debe crear perfiles ni usuarios'
);

SELECT pg_temp.afirmar_075(
  (SELECT COUNT(*) = 3
   FROM terreno.permiso_dependencia d
   JOIN terreno.permiso p ON p.permiso_id_permiso = d.id_permiso
   JOIN terreno.permiso r ON r.permiso_id_permiso = d.id_requerido
   WHERE (p.codigo_m4, r.codigo_m4) IN (('CU458','CU36'),('CU459','CU20'),('CU461','CU459'))),
  'deben existir las tres dependencias M11 reconciliadas'
);

SELECT pg_temp.afirmar_075(
  NOT EXISTS (SELECT 1 FROM terreno.permiso WHERE codigo_m4 = 'CU377'),
  'CU377 debe permanecer ausente'
);

SELECT pg_temp.afirmar_075(
  EXISTS (
    SELECT 1 FROM public._prisma_migrations
    WHERE migration_name = '075_reconciliacion_catalogo_m4'
      AND finished_at IS NOT NULL AND rolled_back_at IS NULL
  ),
  'Prisma debe registrar 075 como aplicada correctamente'
);

\echo 'Escenario compatible preexistente de migración 075 validado'
