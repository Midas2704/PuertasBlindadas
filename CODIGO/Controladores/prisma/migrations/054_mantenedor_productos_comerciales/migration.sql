CREATE TABLE "finanzas"."familia_producto_comercial" (
  "id_familia_producto_comercial" SERIAL PRIMARY KEY,
  "codigo" VARCHAR(40) NOT NULL UNIQUE,
  "nombre" VARCHAR(150) NOT NULL,
  "descripcion" TEXT,
  "estado" VARCHAR(20) NOT NULL DEFAULT 'ACTIVA',
  "revision" INTEGER NOT NULL DEFAULT 1,
  "creado_en" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actualizado_en" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "creado_por" BIGINT NOT NULL,
  "actualizado_por" BIGINT NOT NULL,
  CONSTRAINT "chk_familia_producto_comercial_estado" CHECK ("estado" IN ('ACTIVA', 'INACTIVA')),
  CONSTRAINT "chk_familia_producto_comercial_codigo" CHECK ("codigo" = UPPER("codigo") AND "codigo" ~ '^[A-Z0-9][A-Z0-9._-]{1,39}$'),
  CONSTRAINT "fk_familia_producto_comercial_creador" FOREIGN KEY ("creado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT,
  CONSTRAINT "fk_familia_producto_comercial_actualizador" FOREIGN KEY ("actualizado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT
);
CREATE INDEX "familia_producto_comercial_estado_nombre_idx" ON "finanzas"."familia_producto_comercial" ("estado", "nombre");

CREATE TABLE "finanzas"."historial_familia_producto_comercial" (
  "id_historial_familia_producto_comercial" SERIAL PRIMARY KEY,
  "id_familia_producto_comercial" INTEGER NOT NULL,
  "evento" VARCHAR(40) NOT NULL,
  "valor_anterior" JSONB,
  "valor_nuevo" JSONB,
  "motivo" TEXT,
  "usuario_id_usuario" BIGINT NOT NULL,
  "fecha_evento" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_historial_familia_producto" FOREIGN KEY ("id_familia_producto_comercial") REFERENCES "finanzas"."familia_producto_comercial"("id_familia_producto_comercial") ON DELETE RESTRICT,
  CONSTRAINT "fk_historial_familia_usuario" FOREIGN KEY ("usuario_id_usuario") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT
);
CREATE INDEX "historial_familia_producto_fecha_idx" ON "finanzas"."historial_familia_producto_comercial" ("id_familia_producto_comercial", "fecha_evento");

CREATE TABLE "finanzas"."extension_producto_comercial" (
  "id_extension_producto_comercial" SERIAL PRIMARY KEY,
  "codigo_comercial" VARCHAR(60) NOT NULL UNIQUE,
  "nombre_comercial" VARCHAR(200) NOT NULL,
  "id_familia_producto_comercial" INTEGER NOT NULL,
  "subfamilia" VARCHAR(120),
  "tipo_producto" VARCHAR(100),
  "descripcion_general" TEXT,
  "descripcion_b2b" TEXT,
  "descripcion_b2c" TEXT,
  "observaciones" TEXT,
  "garantia_referencial" TEXT,
  "condiciones_particulares" TEXT,
  "caracteristicas_destacadas" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "caracteristicas_tecnicas" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "estado" VARCHAR(20) NOT NULL DEFAULT 'BORRADOR',
  "id_item_comercial" INTEGER UNIQUE,
  "producto_terminado_id_producto" BIGINT UNIQUE,
  "numero_version_vigente" INTEGER,
  "revision" INTEGER NOT NULL DEFAULT 1,
  "creado_en" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actualizado_en" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "creado_por" BIGINT NOT NULL,
  "actualizado_por" BIGINT NOT NULL,
  CONSTRAINT "chk_extension_producto_comercial_estado" CHECK ("estado" IN ('BORRADOR', 'VINCULADO', 'INACTIVO')),
  CONSTRAINT "chk_extension_producto_comercial_codigo" CHECK ("codigo_comercial" = UPPER("codigo_comercial") AND "codigo_comercial" ~ '^[A-Z0-9][A-Z0-9._-]{1,59}$'),
  CONSTRAINT "fk_extension_producto_familia" FOREIGN KEY ("id_familia_producto_comercial") REFERENCES "finanzas"."familia_producto_comercial"("id_familia_producto_comercial") ON DELETE RESTRICT,
  CONSTRAINT "fk_extension_producto_item" FOREIGN KEY ("id_item_comercial") REFERENCES "terreno"."item_comercial"("id_item_comercial") ON DELETE RESTRICT,
  CONSTRAINT "fk_extension_producto_terminado" FOREIGN KEY ("producto_terminado_id_producto") REFERENCES "inventario"."producto_terminado"("producto_terminado_id_producto") ON DELETE RESTRICT,
  CONSTRAINT "fk_extension_producto_creador" FOREIGN KEY ("creado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT,
  CONSTRAINT "fk_extension_producto_actualizador" FOREIGN KEY ("actualizado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT
);
CREATE INDEX "extension_producto_familia_estado_idx" ON "finanzas"."extension_producto_comercial" ("id_familia_producto_comercial", "estado");
CREATE INDEX "extension_producto_nombre_idx" ON "finanzas"."extension_producto_comercial" ("nombre_comercial");

CREATE TABLE "finanzas"."producto_comercial_version" (
  "id_producto_comercial_version" SERIAL PRIMARY KEY,
  "id_extension_producto_comercial" INTEGER NOT NULL,
  "numero_version" INTEGER NOT NULL,
  "codigo_comercial" VARCHAR(60) NOT NULL,
  "nombre_comercial" VARCHAR(200) NOT NULL,
  "id_familia_producto_comercial" INTEGER NOT NULL,
  "codigo_familia" VARCHAR(40) NOT NULL,
  "nombre_familia" VARCHAR(150) NOT NULL,
  "subfamilia" VARCHAR(120),
  "tipo_producto" VARCHAR(100),
  "descripcion_general" TEXT,
  "descripcion_b2b" TEXT,
  "descripcion_b2c" TEXT,
  "observaciones" TEXT,
  "garantia_referencial" TEXT,
  "condiciones_particulares" TEXT,
  "caracteristicas_destacadas" JSONB NOT NULL,
  "caracteristicas_tecnicas" JSONB NOT NULL,
  "id_item_comercial" INTEGER,
  "producto_terminado_id_producto" BIGINT,
  "vigencia_desde" DATE NOT NULL,
  "motivo" TEXT NOT NULL,
  "usuario_id_usuario" BIGINT NOT NULL,
  "creado_en" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "uq_producto_comercial_version_numero" UNIQUE ("id_extension_producto_comercial", "numero_version"),
  CONSTRAINT "fk_producto_comercial_version_producto" FOREIGN KEY ("id_extension_producto_comercial") REFERENCES "finanzas"."extension_producto_comercial"("id_extension_producto_comercial") ON DELETE RESTRICT,
  CONSTRAINT "fk_producto_comercial_version_familia" FOREIGN KEY ("id_familia_producto_comercial") REFERENCES "finanzas"."familia_producto_comercial"("id_familia_producto_comercial") ON DELETE RESTRICT,
  CONSTRAINT "fk_producto_comercial_version_usuario" FOREIGN KEY ("usuario_id_usuario") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT
);
CREATE INDEX "producto_comercial_version_fecha_idx" ON "finanzas"."producto_comercial_version" ("id_extension_producto_comercial", "creado_en");

CREATE TABLE "finanzas"."historial_producto_comercial" (
  "id_historial_producto_comercial" SERIAL PRIMARY KEY,
  "id_extension_producto_comercial" INTEGER NOT NULL,
  "evento" VARCHAR(50) NOT NULL,
  "valor_anterior" JSONB,
  "valor_nuevo" JSONB,
  "motivo" TEXT,
  "usuario_id_usuario" BIGINT NOT NULL,
  "fecha_evento" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_historial_producto_comercial" FOREIGN KEY ("id_extension_producto_comercial") REFERENCES "finanzas"."extension_producto_comercial"("id_extension_producto_comercial") ON DELETE RESTRICT,
  CONSTRAINT "fk_historial_producto_usuario" FOREIGN KEY ("usuario_id_usuario") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT
);
CREATE INDEX "historial_producto_comercial_fecha_idx" ON "finanzas"."historial_producto_comercial" ("id_extension_producto_comercial", "fecha_evento");

CREATE FUNCTION "finanzas"."impedir_cambio_producto_comercial_version"() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'Las versiones comerciales publicadas son inmutables' USING ERRCODE = '23514';
END;
$$;
CREATE TRIGGER "trg_producto_comercial_version_inmutable"
BEFORE UPDATE OR DELETE ON "finanzas"."producto_comercial_version"
FOR EACH ROW EXECUTE FUNCTION "finanzas"."impedir_cambio_producto_comercial_version"();

INSERT INTO "terreno"."permiso" (
  "permiso_modulo", "permiso_accion", "permiso_descripcion",
  "permiso_nombre_del_permiso", "codigo_m4", "activo_m4", "requiere_administrador"
)
SELECT 'M2', accion, descripcion, nombre, codigo, TRUE, FALSE
FROM (VALUES
  ('CU360', 'consultar catálogo comercial', 'Consultar familias y fichas comerciales de productos', 'Consultar productos comerciales'),
  ('CU361', 'crear catálogo comercial', 'Crear familias y fichas comerciales de productos', 'Crear productos comerciales'),
  ('CU362', 'modificar catálogo comercial', 'Modificar familias y borradores comerciales', 'Modificar productos comerciales'),
  ('CU363', 'desactivar catálogo comercial', 'Desactivar familias y fichas comerciales', 'Desactivar productos comerciales'),
  ('CU364', 'reactivar catálogo comercial', 'Reactivar familias y fichas comerciales', 'Reactivar productos comerciales'),
  ('CU365', 'publicar versión comercial', 'Publicar versiones inmutables de fichas comerciales', 'Publicar productos comerciales'),
  ('CU366', 'administrar vínculos comerciales', 'Vincular fichas comerciales con Terreno e Inventario', 'Vincular productos comerciales'),
  ('CU367', 'consultar historial comercial', 'Consultar versiones e historial del catálogo comercial', 'Consultar historial comercial')
) AS nuevos(codigo, accion, descripcion, nombre)
ON CONFLICT ("codigo_m4") DO UPDATE SET
  "permiso_modulo" = EXCLUDED."permiso_modulo",
  "permiso_accion" = EXCLUDED."permiso_accion",
  "permiso_descripcion" = EXCLUDED."permiso_descripcion",
  "permiso_nombre_del_permiso" = EXCLUDED."permiso_nombre_del_permiso",
  "activo_m4" = TRUE,
  "requiere_administrador" = FALSE;

INSERT INTO "terreno"."permiso_dependencia" ("id_permiso", "id_requerido")
SELECT dependiente."permiso_id_permiso", consulta."permiso_id_permiso"
FROM "terreno"."permiso" dependiente
JOIN "terreno"."permiso" consulta ON consulta."codigo_m4" = 'CU360'
WHERE dependiente."codigo_m4" IN ('CU361','CU362','CU363','CU364','CU365','CU366','CU367')
ON CONFLICT ("id_permiso", "id_requerido") DO NOTHING;
