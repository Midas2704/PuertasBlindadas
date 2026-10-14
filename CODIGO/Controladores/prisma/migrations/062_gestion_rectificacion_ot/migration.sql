ALTER TABLE "finanzas"."unidad_fisica_orden_trabajo"
  DROP CONSTRAINT "unidad_fisica_ot_estado_ck",
  ADD CONSTRAINT "unidad_fisica_ot_estado_ck" CHECK ("estado" IN ('PENDIENTE_RECTIFICACION','RECTIFICACION_ASIGNADA','RECTIFICACION_EN_PROCESO','PENDIENTE_APROBACION_TECNICA','RECTIFICACION_DEVUELTA','RECTIFICACION_APROBADA','RECTIFICADA','LIBERADA','CANCELADA'));

CREATE TABLE "finanzas"."rectificacion_orden_trabajo" (
  "id_rectificacion_ot" BIGSERIAL PRIMARY KEY,
  "id_unidad_fisica_ot" BIGINT NOT NULL UNIQUE,
  "id_empleado_rectificador" INTEGER,
  "id_especificacion_puerta" BIGINT UNIQUE,
  "estado" VARCHAR(50) NOT NULL DEFAULT 'PENDIENTE_RECTIFICACION',
  "fecha_asignacion" TIMESTAMPTZ(6),
  "fecha_inicio" TIMESTAMPTZ(6),
  "fecha_rectificacion" DATE,
  "observaciones_tecnicas" TEXT,
  "caracteristicas_particulares" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "necesita_tareas_adicionales" BOOLEAN NOT NULL DEFAULT FALSE,
  "comentarios_fabricacion" TEXT,
  "comentarios_instalacion" TEXT,
  "revision" INTEGER NOT NULL DEFAULT 1,
  "asignado_por" BIGINT,
  "actualizado_por" BIGINT NOT NULL,
  "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "rectificacion_ot_estado_ck" CHECK ("estado" IN ('PENDIENTE_RECTIFICACION','RECTIFICACION_ASIGNADA','RECTIFICACION_EN_PROCESO','PENDIENTE_APROBACION_TECNICA','RECTIFICACION_DEVUELTA','RECTIFICACION_APROBADA')),
  CONSTRAINT "rectificacion_ot_unidad_fk" FOREIGN KEY ("id_unidad_fisica_ot") REFERENCES "finanzas"."unidad_fisica_orden_trabajo"("id_unidad_fisica_ot") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "rectificacion_ot_empleado_fk" FOREIGN KEY ("id_empleado_rectificador") REFERENCES "finanzas"."empleado"("id_empleado") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "rectificacion_ot_especificacion_fk" FOREIGN KEY ("id_especificacion_puerta") REFERENCES "terreno"."especificaciones_puerta"("especificacion_puerta_especificacion_puerta_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "rectificacion_ot_asignador_fk" FOREIGN KEY ("asignado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "rectificacion_ot_actualizador_fk" FOREIGN KEY ("actualizado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION
);
CREATE INDEX "rectificacion_ot_estado_empleado_idx" ON "finanzas"."rectificacion_orden_trabajo" ("estado", "id_empleado_rectificador");

CREATE TABLE "finanzas"."version_rectificacion_orden_trabajo" (
  "id_version_rectificacion" BIGSERIAL PRIMARY KEY,
  "id_rectificacion_ot" BIGINT NOT NULL,
  "numero_version" INTEGER NOT NULL,
  "datos_rectificacion" JSONB NOT NULL,
  "planificacion" JSONB NOT NULL,
  "enviado_por" BIGINT NOT NULL,
  "enviado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "version_rectificacion_numero_uq" UNIQUE ("id_rectificacion_ot", "numero_version"),
  CONSTRAINT "version_rectificacion_rectificacion_fk" FOREIGN KEY ("id_rectificacion_ot") REFERENCES "finanzas"."rectificacion_orden_trabajo"("id_rectificacion_ot") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "version_rectificacion_enviador_fk" FOREIGN KEY ("enviado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION
);

CREATE TABLE "finanzas"."historial_rectificacion_orden_trabajo" (
  "id_historial_rectificacion" BIGSERIAL PRIMARY KEY,
  "id_rectificacion_ot" BIGINT NOT NULL,
  "entidad" VARCHAR(50) NOT NULL,
  "tipo_modificacion" VARCHAR(60) NOT NULL,
  "valor_anterior" JSONB,
  "valor_nuevo" JSONB,
  "motivo" TEXT,
  "usuario_id_usuario" BIGINT NOT NULL,
  "fecha_evento" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "historial_rectificacion_rectificacion_fk" FOREIGN KEY ("id_rectificacion_ot") REFERENCES "finanzas"."rectificacion_orden_trabajo"("id_rectificacion_ot") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "historial_rectificacion_usuario_fk" FOREIGN KEY ("usuario_id_usuario") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION
);
CREATE INDEX "historial_rectificacion_fecha_idx" ON "finanzas"."historial_rectificacion_orden_trabajo" ("id_rectificacion_ot", "fecha_evento");

CREATE FUNCTION "finanzas"."impedir_cambio_version_rectificacion_ot"() RETURNS trigger
LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'La versión enviada de rectificación es inmutable' USING ERRCODE = '23514'; END; $$;
CREATE TRIGGER "trg_version_rectificacion_ot_inmutable"
BEFORE UPDATE OR DELETE ON "finanzas"."version_rectificacion_orden_trabajo"
FOR EACH ROW EXECUTE FUNCTION "finanzas"."impedir_cambio_version_rectificacion_ot"();

CREATE FUNCTION "finanzas"."impedir_cambio_historial_rectificacion_ot"() RETURNS trigger
LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'El historial de rectificación es inmutable' USING ERRCODE = '23514'; END; $$;
CREATE TRIGGER "trg_historial_rectificacion_ot_inmutable"
BEFORE UPDATE OR DELETE ON "finanzas"."historial_rectificacion_orden_trabajo"
FOR EACH ROW EXECUTE FUNCTION "finanzas"."impedir_cambio_historial_rectificacion_ot"();
