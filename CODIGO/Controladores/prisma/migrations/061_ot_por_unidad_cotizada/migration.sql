CREATE TABLE "finanzas"."unidad_fisica_orden_trabajo" (
  "id_unidad_fisica_ot" BIGSERIAL PRIMARY KEY,
  "id_cotizacion" INTEGER NOT NULL,
  "id_detalle_cotizacion" INTEGER NOT NULL,
  "id_extension_producto_comercial" INTEGER NOT NULL,
  "id_familia_producto_comercial" INTEGER NOT NULL,
  "numero_unidad" INTEGER NOT NULL,
  "id_version_plantilla" INTEGER NOT NULL,
  "id_orden_trabajo" BIGINT NOT NULL UNIQUE,
  "estado" VARCHAR(40) NOT NULL DEFAULT 'PENDIENTE_RECTIFICACION',
  "planificacion_inicial" JSONB NOT NULL,
  "planificacion_actual" JSONB NOT NULL,
  "revision" INTEGER NOT NULL DEFAULT 1,
  "creado_por" BIGINT NOT NULL,
  "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "unidad_fisica_ot_numero_ck" CHECK ("numero_unidad" > 0),
  CONSTRAINT "unidad_fisica_ot_estado_ck" CHECK ("estado" IN ('PENDIENTE_RECTIFICACION','RECTIFICADA','LIBERADA','CANCELADA')),
  CONSTRAINT "unidad_fisica_ot_detalle_unidad_uq" UNIQUE ("id_detalle_cotizacion", "numero_unidad"),
  CONSTRAINT "unidad_fisica_ot_cotizacion_fk" FOREIGN KEY ("id_cotizacion") REFERENCES "finanzas"."cotizacion"("id_cotizacion") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "unidad_fisica_ot_detalle_fk" FOREIGN KEY ("id_detalle_cotizacion") REFERENCES "finanzas"."detalle_cotizacion"("id_detalle_cotizacion") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "unidad_fisica_ot_producto_fk" FOREIGN KEY ("id_extension_producto_comercial") REFERENCES "finanzas"."extension_producto_comercial"("id_extension_producto_comercial") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "unidad_fisica_ot_familia_fk" FOREIGN KEY ("id_familia_producto_comercial") REFERENCES "finanzas"."familia_producto_comercial"("id_familia_producto_comercial") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "unidad_fisica_ot_version_fk" FOREIGN KEY ("id_version_plantilla") REFERENCES "finanzas"."version_plantilla_fabricacion"("id_version_plantilla") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "unidad_fisica_ot_orden_fk" FOREIGN KEY ("id_orden_trabajo") REFERENCES "inventario"."orden_trabajo"("orden_trabajo_id_orden") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "unidad_fisica_ot_creador_fk" FOREIGN KEY ("creado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION
);
CREATE INDEX "unidad_fisica_ot_cotizacion_estado_idx" ON "finanzas"."unidad_fisica_orden_trabajo" ("id_cotizacion", "estado");
CREATE INDEX "unidad_fisica_ot_producto_familia_idx" ON "finanzas"."unidad_fisica_orden_trabajo" ("id_extension_producto_comercial", "id_familia_producto_comercial");

CREATE TABLE "finanzas"."historial_unidad_fisica_ot" (
  "id_historial_unidad_fisica_ot" BIGSERIAL PRIMARY KEY,
  "id_unidad_fisica_ot" BIGINT NOT NULL,
  "evento" VARCHAR(50) NOT NULL,
  "valor_anterior" JSONB,
  "valor_nuevo" JSONB,
  "motivo" TEXT,
  "usuario_id_usuario" BIGINT NOT NULL,
  "fecha_evento" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "historial_unidad_fisica_ot_unidad_fk" FOREIGN KEY ("id_unidad_fisica_ot") REFERENCES "finanzas"."unidad_fisica_orden_trabajo"("id_unidad_fisica_ot") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "historial_unidad_fisica_ot_usuario_fk" FOREIGN KEY ("usuario_id_usuario") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION
);
CREATE INDEX "historial_unidad_fisica_ot_fecha_idx" ON "finanzas"."historial_unidad_fisica_ot" ("id_unidad_fisica_ot", "fecha_evento");

CREATE FUNCTION "finanzas"."impedir_cambio_historial_unidad_fisica_ot"() RETURNS trigger
LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'El historial de planificación de OT es inmutable' USING ERRCODE = '23514'; END; $$;
CREATE TRIGGER "trg_historial_unidad_fisica_ot_inmutable"
BEFORE UPDATE OR DELETE ON "finanzas"."historial_unidad_fisica_ot"
FOR EACH ROW EXECUTE FUNCTION "finanzas"."impedir_cambio_historial_unidad_fisica_ot"();
