-- Reconciliación aditiva del catálogo M4 requerida por M11.
-- Fuentes autoritativas: seed-m4.ts, permisos.ts y catalogoPermisosFuncional.ts.
-- No asigna permisos a perfiles o usuarios y no registra CU377.

DO $$
DECLARE
  incompatible RECORD;
BEGIN
  SELECT p."codigo_m4" INTO incompatible
  FROM "terreno"."permiso" p
  WHERE p."codigo_m4" IN ('CU20', 'CU36')
    AND (
      p."permiso_modulo" IS DISTINCT FROM 'M2'
      OR p."activo_m4" IS DISTINCT FROM TRUE
      OR p."requiere_administrador" IS DISTINCT FROM FALSE
    )
  ORDER BY p."codigo_m4"
  LIMIT 1;

  IF FOUND THEN
    RAISE EXCEPTION
      'M4_INTEGRIDAD_INCOMPATIBLE: % existe con módulo, estado o requisito administrativo no acreditado',
      incompatible."codigo_m4";
  END IF;
END $$;

INSERT INTO "terreno"."permiso" (
  "codigo_m4",
  "activo_m4",
  "permiso_modulo",
  "permiso_nombre_del_permiso",
  "permiso_descripcion",
  "requiere_administrador"
)
SELECT codigo, TRUE, 'M2', codigo, 'Operación ' || codigo, FALSE
FROM (VALUES ('CU20'), ('CU36')) AS requerido(codigo)
WHERE NOT EXISTS (
  SELECT 1 FROM "terreno"."permiso" existente
  WHERE existente."codigo_m4" = requerido.codigo
);

DO $$
DECLARE
  validos INTEGER;
BEGIN
  SELECT COUNT(*) INTO validos
  FROM "terreno"."permiso" p
  WHERE p."codigo_m4" IN ('CU20', 'CU36')
    AND p."permiso_modulo" = 'M2'
    AND p."activo_m4" = TRUE
    AND p."requiere_administrador" = FALSE;

  IF validos <> 2 THEN
    RAISE EXCEPTION
      'M4_INTEGRIDAD_INCOMPLETA: CU20 y CU36 deben existir una sola vez con definición compatible';
  END IF;
END $$;

INSERT INTO "terreno"."permiso_dependencia" ("id_permiso", "id_requerido")
SELECT dependiente."permiso_id_permiso", requerido."permiso_id_permiso"
FROM (VALUES
  ('CU458', 'CU36'),
  ('CU459', 'CU20'),
  ('CU461', 'CU459')
) AS relacion(codigo, requerido)
JOIN "terreno"."permiso" dependiente ON dependiente."codigo_m4" = relacion.codigo
JOIN "terreno"."permiso" requerido ON requerido."codigo_m4" = relacion.requerido
WHERE NOT EXISTS (
  SELECT 1
  FROM "terreno"."permiso_dependencia" existente
  WHERE existente."id_permiso" = dependiente."permiso_id_permiso"
    AND existente."id_requerido" = requerido."permiso_id_permiso"
);

DO $$
DECLARE
  dependencias INTEGER;
BEGIN
  SELECT COUNT(*) INTO dependencias
  FROM "terreno"."permiso_dependencia" d
  JOIN "terreno"."permiso" p ON p."permiso_id_permiso" = d."id_permiso"
  JOIN "terreno"."permiso" r ON r."permiso_id_permiso" = d."id_requerido"
  WHERE (p."codigo_m4", r."codigo_m4") IN (
    ('CU458', 'CU36'),
    ('CU459', 'CU20'),
    ('CU461', 'CU459')
  );

  IF dependencias <> 3 THEN
    RAISE EXCEPTION
      'M4_INTEGRIDAD_INCOMPLETA: no fue posible acreditar las tres dependencias M11';
  END IF;
END $$;
