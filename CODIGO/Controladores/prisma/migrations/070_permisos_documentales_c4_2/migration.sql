-- C4.2: capacidades documentales comerciales aprobadas. No asigna usuarios ni perfiles.
DO $$
DECLARE incompatible RECORD;
BEGIN
  SELECT p."codigo_m4" INTO incompatible
  FROM "terreno"."permiso" p
  JOIN (VALUES
    ('CU378','editar plantillas documentales','Crear y editar borradores de plantillas documentales','Editar plantillas documentales'),
    ('CU379','publicar plantillas documentales','Publicar versiones inmutables de plantillas documentales','Publicar plantillas documentales'),
    ('CU380','editar carta comercial B2C','Crear y editar borradores de carta comercial general B2C','Editar carta comercial B2C'),
    ('CU381','publicar carta comercial B2C','Publicar versiones inmutables de carta comercial general B2C','Publicar carta comercial B2C')
  ) AS esperado(codigo,accion,descripcion,nombre) ON esperado.codigo=p."codigo_m4"
  WHERE p."permiso_modulo" IS DISTINCT FROM 'M2'
     OR p."permiso_accion" IS DISTINCT FROM esperado.accion
     OR p."permiso_descripcion" IS DISTINCT FROM esperado.descripcion
     OR p."permiso_nombre_del_permiso" IS DISTINCT FROM esperado.nombre
     OR p."requiere_administrador" IS DISTINCT FROM FALSE
  LIMIT 1;
  IF FOUND THEN RAISE EXCEPTION 'Permiso M4 % ya existe con definición incompatible', incompatible."codigo_m4"; END IF;
END $$;

INSERT INTO "terreno"."permiso" (
  "permiso_modulo", "permiso_accion", "permiso_descripcion",
  "permiso_nombre_del_permiso", "codigo_m4", "activo_m4", "requiere_administrador"
)
SELECT 'M2', accion, descripcion, nombre, codigo, TRUE, FALSE
FROM (VALUES
  ('CU378','editar plantillas documentales','Crear y editar borradores de plantillas documentales','Editar plantillas documentales'),
  ('CU379','publicar plantillas documentales','Publicar versiones inmutables de plantillas documentales','Publicar plantillas documentales'),
  ('CU380','editar carta comercial B2C','Crear y editar borradores de carta comercial general B2C','Editar carta comercial B2C'),
  ('CU381','publicar carta comercial B2C','Publicar versiones inmutables de carta comercial general B2C','Publicar carta comercial B2C')
) AS nuevos(codigo,accion,descripcion,nombre)
ON CONFLICT ("codigo_m4") DO NOTHING;

INSERT INTO "terreno"."permiso_dependencia" ("id_permiso", "id_requerido")
SELECT dependiente."permiso_id_permiso", requerido."permiso_id_permiso"
FROM (VALUES ('CU378','CU360'),('CU379','CU378'),('CU380','CU360'),('CU381','CU380')) AS relacion(codigo,requerido)
JOIN "terreno"."permiso" dependiente ON dependiente."codigo_m4"=relacion.codigo
JOIN "terreno"."permiso" requerido ON requerido."codigo_m4"=relacion.requerido
ON CONFLICT ("id_permiso", "id_requerido") DO NOTHING;

-- CU377 continúa deliberadamente fuera del catálogo aprobado.
-- La sincronización de la cuenta Midas es un procedimiento administrativo separado.
