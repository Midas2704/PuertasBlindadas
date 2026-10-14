CREATE TABLE "finanzas"."catalogo_tarea_fabricacion" (
  "id_tarea_fabricacion" SERIAL PRIMARY KEY,
  "nombre" VARCHAR(150) NOT NULL,
  "descripcion" TEXT,
  "id_area_trabajo" BIGINT NOT NULL,
  "tiempo_estimado_min" INTEGER,
  "estado" VARCHAR(20) NOT NULL DEFAULT 'ACTIVA',
  "revision" INTEGER NOT NULL DEFAULT 1,
  "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "creado_por" BIGINT NOT NULL,
  "actualizado_por" BIGINT NOT NULL,
  CONSTRAINT "catalogo_tarea_fabricacion_tiempo_ck" CHECK ("tiempo_estimado_min" IS NULL OR "tiempo_estimado_min" > 0),
  CONSTRAINT "catalogo_tarea_fabricacion_estado_ck" CHECK ("estado" IN ('ACTIVA', 'INACTIVA')),
  CONSTRAINT "catalogo_tarea_fabricacion_area_fk" FOREIGN KEY ("id_area_trabajo") REFERENCES "terreno"."area_trabajo"("area_trabajo_id_area") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "catalogo_tarea_fabricacion_creador_fk" FOREIGN KEY ("creado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "catalogo_tarea_fabricacion_actualizador_fk" FOREIGN KEY ("actualizado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION
);

CREATE UNIQUE INDEX "catalogo_tarea_fabricacion_nombre_area_uq"
  ON "finanzas"."catalogo_tarea_fabricacion" ("id_area_trabajo", LOWER(BTRIM("nombre")));
CREATE INDEX "catalogo_tarea_fabricacion_area_estado_idx" ON "finanzas"."catalogo_tarea_fabricacion" ("id_area_trabajo", "estado");
CREATE INDEX "catalogo_tarea_fabricacion_estado_nombre_idx" ON "finanzas"."catalogo_tarea_fabricacion" ("estado", "nombre");

CREATE TABLE "finanzas"."plantilla_fabricacion_familia" (
  "id_plantilla_fabricacion" SERIAL PRIMARY KEY,
  "id_familia_producto_comercial" INTEGER NOT NULL UNIQUE,
  "borrador" JSONB NOT NULL DEFAULT '{"etapas":[]}'::jsonb,
  "numero_version_vigente" INTEGER,
  "revision" INTEGER NOT NULL DEFAULT 1,
  "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "creado_por" BIGINT NOT NULL,
  "actualizado_por" BIGINT NOT NULL,
  CONSTRAINT "plantilla_fabricacion_familia_fk" FOREIGN KEY ("id_familia_producto_comercial") REFERENCES "finanzas"."familia_producto_comercial"("id_familia_producto_comercial") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "plantilla_fabricacion_creador_fk" FOREIGN KEY ("creado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "plantilla_fabricacion_actualizador_fk" FOREIGN KEY ("actualizado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION
);

CREATE TABLE "finanzas"."version_plantilla_fabricacion" (
  "id_version_plantilla" SERIAL PRIMARY KEY,
  "id_plantilla_fabricacion" INTEGER NOT NULL,
  "numero_version" INTEGER NOT NULL,
  "contenido" JSONB NOT NULL,
  "motivo" TEXT NOT NULL,
  "publicado_por" BIGINT NOT NULL,
  "publicado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "version_plantilla_numero_uq" UNIQUE ("id_plantilla_fabricacion", "numero_version"),
  CONSTRAINT "version_plantilla_plantilla_fk" FOREIGN KEY ("id_plantilla_fabricacion") REFERENCES "finanzas"."plantilla_fabricacion_familia"("id_plantilla_fabricacion") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "version_plantilla_publicador_fk" FOREIGN KEY ("publicado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION
);
CREATE INDEX "version_plantilla_historial_idx" ON "finanzas"."version_plantilla_fabricacion" ("id_plantilla_fabricacion", "publicado_en");

CREATE TABLE "finanzas"."ajuste_producto_plantilla_fabricacion" (
  "id_ajuste_plantilla" SERIAL PRIMARY KEY,
  "id_extension_producto_comercial" INTEGER NOT NULL UNIQUE,
  "id_plantilla_fabricacion" INTEGER NOT NULL,
  "id_version_plantilla_base" INTEGER NOT NULL,
  "cambios" JSONB NOT NULL DEFAULT '{"operaciones":[]}'::jsonb,
  "estado" VARCHAR(20) NOT NULL DEFAULT 'BORRADOR',
  "revision" INTEGER NOT NULL DEFAULT 1,
  "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "creado_por" BIGINT NOT NULL,
  "actualizado_por" BIGINT NOT NULL,
  CONSTRAINT "ajuste_plantilla_estado_ck" CHECK ("estado" IN ('BORRADOR', 'PUBLICADO', 'INACTIVO')),
  CONSTRAINT "ajuste_plantilla_producto_fk" FOREIGN KEY ("id_extension_producto_comercial") REFERENCES "finanzas"."extension_producto_comercial"("id_extension_producto_comercial") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "ajuste_plantilla_raiz_fk" FOREIGN KEY ("id_plantilla_fabricacion") REFERENCES "finanzas"."plantilla_fabricacion_familia"("id_plantilla_fabricacion") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "ajuste_plantilla_version_fk" FOREIGN KEY ("id_version_plantilla_base") REFERENCES "finanzas"."version_plantilla_fabricacion"("id_version_plantilla") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "ajuste_plantilla_creador_fk" FOREIGN KEY ("creado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "ajuste_plantilla_actualizador_fk" FOREIGN KEY ("actualizado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION
);
CREATE INDEX "ajuste_plantilla_raiz_estado_idx" ON "finanzas"."ajuste_producto_plantilla_fabricacion" ("id_plantilla_fabricacion", "estado");

CREATE FUNCTION "finanzas"."impedir_cambio_version_plantilla_fabricacion"() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'Las versiones publicadas de plantillas de fabricación son inmutables' USING ERRCODE = '23514';
END;
$$;

CREATE TRIGGER "trg_version_plantilla_fabricacion_inmutable"
BEFORE UPDATE OR DELETE ON "finanzas"."version_plantilla_fabricacion"
FOR EACH ROW EXECUTE FUNCTION "finanzas"."impedir_cambio_version_plantilla_fabricacion"();
