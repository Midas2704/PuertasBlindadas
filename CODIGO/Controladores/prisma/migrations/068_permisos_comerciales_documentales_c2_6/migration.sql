-- C2.6: registra capacidades M4. No asigna permisos a perfiles ni usuarios.
DO $$
DECLARE incompatible RECORD;
BEGIN
  SELECT p."codigo_m4" INTO incompatible
  FROM "terreno"."permiso" p
  JOIN (VALUES
    ('CU368','gestionar precios comerciales','Gestionar precios comerciales versionados','Gestionar precios comerciales'),
    ('CU369','gestionar opcionales comerciales','Gestionar opcionales, compatibilidades y precios','Gestionar opcionales comerciales'),
    ('CU370','gestionar tarifas comerciales','Gestionar tarifas y cobertura comercial de instalación','Gestionar tarifas comerciales'),
    ('CU371','editar condiciones comerciales','Crear y versionar condiciones comerciales','Editar condiciones comerciales'),
    ('CU372','publicar condiciones comerciales','Publicar condiciones comerciales versionadas','Publicar condiciones comerciales'),
    ('CU373','cargar documentos comerciales','Cargar y reemplazar versiones de documentos comerciales','Cargar documentos comerciales'),
    ('CU374','gestionar galería comercial','Gestionar fotografías, galería y asociaciones de productos','Gestionar galería comercial'),
    ('CU375','previsualizar documentos comerciales','Solicitar vista previa de documentos autorizados','Previsualizar documentos comerciales'),
    ('CU376','descargar documentos comerciales','Descargar documentos comerciales autorizados','Descargar documentos comerciales')
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
  ('CU368','gestionar precios comerciales','Gestionar precios comerciales versionados','Gestionar precios comerciales'),
  ('CU369','gestionar opcionales comerciales','Gestionar opcionales, compatibilidades y precios','Gestionar opcionales comerciales'),
  ('CU370','gestionar tarifas comerciales','Gestionar tarifas y cobertura comercial de instalación','Gestionar tarifas comerciales'),
  ('CU371','editar condiciones comerciales','Crear y versionar condiciones comerciales','Editar condiciones comerciales'),
  ('CU372','publicar condiciones comerciales','Publicar condiciones comerciales versionadas','Publicar condiciones comerciales'),
  ('CU373','cargar documentos comerciales','Cargar y reemplazar versiones de documentos comerciales','Cargar documentos comerciales'),
  ('CU374','gestionar galería comercial','Gestionar fotografías, galería y asociaciones de productos','Gestionar galería comercial'),
  ('CU375','previsualizar documentos comerciales','Solicitar vista previa de documentos autorizados','Previsualizar documentos comerciales'),
  ('CU376','descargar documentos comerciales','Descargar documentos comerciales autorizados','Descargar documentos comerciales')
) AS nuevos(codigo,accion,descripcion,nombre)
ON CONFLICT ("codigo_m4") DO NOTHING;

INSERT INTO "terreno"."permiso_dependencia" ("id_permiso", "id_requerido")
SELECT dependiente."permiso_id_permiso", consulta."permiso_id_permiso"
FROM "terreno"."permiso" dependiente
JOIN "terreno"."permiso" consulta ON consulta."codigo_m4"='CU360'
WHERE dependiente."codigo_m4" BETWEEN 'CU368' AND 'CU376'
ON CONFLICT ("id_permiso", "id_requerido") DO NOTHING;

-- CU372 exige además capacidad de edición/versionado de condiciones.
INSERT INTO "terreno"."permiso_dependencia" ("id_permiso", "id_requerido")
SELECT publicar."permiso_id_permiso", editar."permiso_id_permiso"
FROM "terreno"."permiso" publicar
JOIN "terreno"."permiso" editar ON editar."codigo_m4"='CU371'
WHERE publicar."codigo_m4"='CU372'
ON CONFLICT ("id_permiso", "id_requerido") DO NOTHING;

-- Deliberadamente no se escriben perfil_permiso ni usuario_permiso_particular.

CREATE TABLE "finanzas"."idempotencia_operacion_comercial" (
  "clave" VARCHAR(160) NOT NULL,
  "operacion" VARCHAR(80) NOT NULL,
  "actor_id" BIGINT NOT NULL,
  "respuesta" JSONB,
  "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completado_en" TIMESTAMPTZ,
  CONSTRAINT "pk_idempotencia_operacion_comercial" PRIMARY KEY ("clave"),
  CONSTRAINT "fk_idempotencia_operacion_actor" FOREIGN KEY ("actor_id") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT
);
CREATE INDEX "idx_idempotencia_operacion_actor" ON "finanzas"."idempotencia_operacion_comercial" ("actor_id", "creado_en");
