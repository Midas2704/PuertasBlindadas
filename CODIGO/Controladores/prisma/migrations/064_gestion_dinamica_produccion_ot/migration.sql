-- Bloque 6: estado operativo e historial aditivos sobre las tareas ejecutables existentes.
ALTER TABLE "finanzas"."unidad_fisica_orden_trabajo"
  DROP CONSTRAINT "unidad_fisica_ot_estado_ck",
  ADD CONSTRAINT "unidad_fisica_ot_estado_ck" CHECK ("estado" IN ('PENDIENTE_RECTIFICACION','RECTIFICACION_ASIGNADA','RECTIFICACION_EN_PROCESO','PENDIENTE_APROBACION_TECNICA','RECTIFICACION_DEVUELTA','RECTIFICACION_APROBADA','RECTIFICADA','LIBERADA','FINALIZADA','CANCELADA'));

ALTER TABLE "finanzas"."tarea_ejecutable_unidad_ot"
  ADD COLUMN "origen" VARCHAR(30) NOT NULL DEFAULT 'PLAN_APROBADO',
  ADD COLUMN "id_etapa_adicional_ot" BIGINT,
  ADD COLUMN "clave_idempotencia" VARCHAR(120),
  ADD COLUMN "id_tarea_origen_correctiva" BIGINT;

CREATE UNIQUE INDEX "tarea_ejecutable_unidad_ot_clave_idempotencia_key"
  ON "finanzas"."tarea_ejecutable_unidad_ot"("clave_idempotencia");

CREATE TABLE "finanzas"."estado_tarea_produccion_ot" (
  "id_estado_tarea_produccion" BIGSERIAL PRIMARY KEY,
  "id_tarea_ejecutable_ot" BIGINT NOT NULL UNIQUE,
  "id_area_trabajo" BIGINT NOT NULL,
  "id_empleado_responsable" INTEGER,
  "estado" VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE',
  "prioridad" VARCHAR(30),
  "tiempo_estimado_min" INTEGER,
  "instrucciones" TEXT,
  "observaciones" TEXT,
  "fecha_planificada" DATE,
  "revision" INTEGER NOT NULL DEFAULT 1,
  "actualizado_por" BIGINT NOT NULL,
  "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ck_estado_tarea_produccion" CHECK ("estado" IN ('PENDIENTE','ASIGNADA','EN_EJECUCION','PENDIENTE_VALIDACION','CERRADA')),
  CONSTRAINT "ck_estado_tarea_tiempo" CHECK ("tiempo_estimado_min" IS NULL OR "tiempo_estimado_min" > 0),
  CONSTRAINT "fk_estado_tarea_ejecutable" FOREIGN KEY ("id_tarea_ejecutable_ot") REFERENCES "finanzas"."tarea_ejecutable_unidad_ot"("id_tarea_ejecutable_ot") ON DELETE RESTRICT,
  CONSTRAINT "fk_estado_tarea_area" FOREIGN KEY ("id_area_trabajo") REFERENCES "terreno"."area_trabajo"("area_trabajo_id_area") ON DELETE RESTRICT,
  CONSTRAINT "fk_estado_tarea_empleado" FOREIGN KEY ("id_empleado_responsable") REFERENCES "finanzas"."empleado"("id_empleado") ON DELETE RESTRICT,
  CONSTRAINT "fk_estado_tarea_actualizador" FOREIGN KEY ("actualizado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT
);
CREATE INDEX "idx_estado_tarea_area_estado" ON "finanzas"."estado_tarea_produccion_ot"("id_area_trabajo", "estado");
CREATE INDEX "idx_estado_tarea_empleado_estado" ON "finanzas"."estado_tarea_produccion_ot"("id_empleado_responsable", "estado");

CREATE TABLE "finanzas"."historial_cambio_produccion_ot" (
  "id_historial_cambio" BIGSERIAL PRIMARY KEY,
  "id_unidad_fisica_ot" BIGINT NOT NULL,
  "id_tarea_ejecutable_ot" BIGINT,
  "id_version_rectificacion" BIGINT,
  "entidad" VARCHAR(40) NOT NULL,
  "evento" VARCHAR(60) NOT NULL,
  "valor_anterior" JSONB,
  "valor_nuevo" JSONB,
  "motivo" TEXT NOT NULL,
  "id_empleado_involucrado" INTEGER,
  "usuario_id_usuario" BIGINT NOT NULL,
  "fecha_evento" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_historial_produccion_unidad" FOREIGN KEY ("id_unidad_fisica_ot") REFERENCES "finanzas"."unidad_fisica_orden_trabajo"("id_unidad_fisica_ot") ON DELETE RESTRICT,
  CONSTRAINT "fk_historial_produccion_tarea" FOREIGN KEY ("id_tarea_ejecutable_ot") REFERENCES "finanzas"."tarea_ejecutable_unidad_ot"("id_tarea_ejecutable_ot") ON DELETE RESTRICT,
  CONSTRAINT "fk_historial_produccion_version" FOREIGN KEY ("id_version_rectificacion") REFERENCES "finanzas"."version_rectificacion_orden_trabajo"("id_version_rectificacion") ON DELETE RESTRICT,
  CONSTRAINT "fk_historial_produccion_empleado" FOREIGN KEY ("id_empleado_involucrado") REFERENCES "finanzas"."empleado"("id_empleado") ON DELETE RESTRICT,
  CONSTRAINT "fk_historial_produccion_actor" FOREIGN KEY ("usuario_id_usuario") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT
);
CREATE INDEX "idx_historial_produccion_unidad_fecha" ON "finanzas"."historial_cambio_produccion_ot"("id_unidad_fisica_ot", "fecha_evento");
CREATE INDEX "idx_historial_produccion_tarea_fecha" ON "finanzas"."historial_cambio_produccion_ot"("id_tarea_ejecutable_ot", "fecha_evento");

CREATE TABLE "finanzas"."etapa_adicional_orden_trabajo" (
  "id_etapa_adicional_ot" BIGSERIAL PRIMARY KEY,
  "id_unidad_fisica_ot" BIGINT NOT NULL,
  "id_area_trabajo" BIGINT NOT NULL,
  "nombre" VARCHAR(150) NOT NULL,
  "descripcion" TEXT,
  "orden" INTEGER NOT NULL,
  "motivo" TEXT NOT NULL,
  "clave_idempotencia" VARCHAR(120) NOT NULL UNIQUE,
  "creado_por" BIGINT NOT NULL,
  "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "uq_etapa_adicional_orden" UNIQUE ("id_unidad_fisica_ot", "orden"),
  CONSTRAINT "ck_etapa_adicional_orden" CHECK ("orden" > 0),
  CONSTRAINT "fk_etapa_adicional_unidad" FOREIGN KEY ("id_unidad_fisica_ot") REFERENCES "finanzas"."unidad_fisica_orden_trabajo"("id_unidad_fisica_ot") ON DELETE RESTRICT,
  CONSTRAINT "fk_etapa_adicional_area" FOREIGN KEY ("id_area_trabajo") REFERENCES "terreno"."area_trabajo"("area_trabajo_id_area") ON DELETE RESTRICT,
  CONSTRAINT "fk_etapa_adicional_creador" FOREIGN KEY ("creado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT
);

ALTER TABLE "finanzas"."tarea_ejecutable_unidad_ot"
  ADD CONSTRAINT "fk_tarea_ejecutable_etapa_adicional" FOREIGN KEY ("id_etapa_adicional_ot") REFERENCES "finanzas"."etapa_adicional_orden_trabajo"("id_etapa_adicional_ot") ON DELETE RESTRICT,
  ADD CONSTRAINT "fk_tarea_ejecutable_origen_correctiva" FOREIGN KEY ("id_tarea_origen_correctiva") REFERENCES "finanzas"."tarea_ejecutable_unidad_ot"("id_tarea_ejecutable_ot") ON DELETE RESTRICT,
  ADD CONSTRAINT "ck_tarea_ejecutable_origen" CHECK ("origen" IN ('PLAN_APROBADO','TAREA_ADICIONAL','ETAPA_ADICIONAL','CORRECTIVA'));

CREATE TABLE "finanzas"."atribucion_ejecucion_tarea_ot" (
  "id_atribucion_ejecucion" BIGSERIAL PRIMARY KEY,
  "id_ejecucion_tarea" BIGINT NOT NULL UNIQUE,
  "id_empleado_ejecutor" INTEGER NOT NULL,
  "registrado_por" BIGINT NOT NULL,
  "registrado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_atribucion_ejecucion" FOREIGN KEY ("id_ejecucion_tarea") REFERENCES "terreno"."ejecucion_tarea"("id_ejecucion_tarea") ON DELETE RESTRICT,
  CONSTRAINT "fk_atribucion_empleado" FOREIGN KEY ("id_empleado_ejecutor") REFERENCES "finanzas"."empleado"("id_empleado") ON DELETE RESTRICT,
  CONSTRAINT "fk_atribucion_registrador" FOREIGN KEY ("registrado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT
);
CREATE INDEX "idx_atribucion_empleado_fecha" ON "finanzas"."atribucion_ejecucion_tarea_ot"("id_empleado_ejecutor", "registrado_en");

CREATE TABLE "finanzas"."solicitud_correccion_tecnica_ot" (
  "id_solicitud_correccion" BIGSERIAL PRIMARY KEY,
  "id_unidad_fisica_ot" BIGINT NOT NULL,
  "id_version_base" BIGINT NOT NULL,
  "medida_original" JSONB NOT NULL,
  "medida_propuesta" JSONB NOT NULL,
  "motivo" TEXT NOT NULL,
  "solicitado_por" BIGINT NOT NULL,
  "solicitado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_solicitud_correccion_unidad" FOREIGN KEY ("id_unidad_fisica_ot") REFERENCES "finanzas"."unidad_fisica_orden_trabajo"("id_unidad_fisica_ot") ON DELETE RESTRICT,
  CONSTRAINT "fk_solicitud_correccion_version" FOREIGN KEY ("id_version_base") REFERENCES "finanzas"."version_rectificacion_orden_trabajo"("id_version_rectificacion") ON DELETE RESTRICT,
  CONSTRAINT "fk_solicitud_correccion_actor" FOREIGN KEY ("solicitado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT
);
CREATE INDEX "idx_solicitud_correccion_unidad_fecha" ON "finanzas"."solicitud_correccion_tecnica_ot"("id_unidad_fisica_ot", "solicitado_en");

CREATE TABLE "finanzas"."aplicacion_revision_tecnica_ot" (
  "id_aplicacion_revision" BIGSERIAL PRIMARY KEY,
  "id_unidad_fisica_ot" BIGINT NOT NULL,
  "id_version_rectificacion" BIGINT NOT NULL UNIQUE,
  "aplicado_por" BIGINT NOT NULL,
  "aplicado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "uq_aplicacion_revision_unidad_version" UNIQUE ("id_unidad_fisica_ot", "id_version_rectificacion"),
  CONSTRAINT "fk_aplicacion_revision_unidad" FOREIGN KEY ("id_unidad_fisica_ot") REFERENCES "finanzas"."unidad_fisica_orden_trabajo"("id_unidad_fisica_ot") ON DELETE RESTRICT,
  CONSTRAINT "fk_aplicacion_revision_version" FOREIGN KEY ("id_version_rectificacion") REFERENCES "finanzas"."version_rectificacion_orden_trabajo"("id_version_rectificacion") ON DELETE RESTRICT,
  CONSTRAINT "fk_aplicacion_revision_actor" FOREIGN KEY ("aplicado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT
);

CREATE TABLE "finanzas"."cierre_orden_trabajo_produccion" (
  "id_cierre_ot" BIGSERIAL PRIMARY KEY,
  "id_unidad_fisica_ot" BIGINT NOT NULL UNIQUE,
  "id_version_rectificacion" BIGINT NOT NULL,
  "resumen_tareas" JSONB NOT NULL,
  "observaciones" TEXT,
  "estado_anterior" VARCHAR(40) NOT NULL,
  "estado_final" VARCHAR(40) NOT NULL,
  "finalizado_por" BIGINT NOT NULL,
  "finalizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_cierre_ot_unidad" FOREIGN KEY ("id_unidad_fisica_ot") REFERENCES "finanzas"."unidad_fisica_orden_trabajo"("id_unidad_fisica_ot") ON DELETE RESTRICT,
  CONSTRAINT "fk_cierre_ot_version" FOREIGN KEY ("id_version_rectificacion") REFERENCES "finanzas"."version_rectificacion_orden_trabajo"("id_version_rectificacion") ON DELETE RESTRICT,
  CONSTRAINT "fk_cierre_ot_actor" FOREIGN KEY ("finalizado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT
);

-- Las tareas ya liberadas reciben estado vigente sin alterar su origen ni sus ejecuciones.
INSERT INTO "finanzas"."estado_tarea_produccion_ot" (
  "id_tarea_ejecutable_ot", "id_area_trabajo", "id_empleado_responsable", "estado",
  "tiempo_estimado_min", "instrucciones", "actualizado_por"
)
SELECT te."id_tarea_ejecutable_ot", (etapa->>'idAreaTrabajo')::BIGINT, te."id_empleado_planificado",
       CASE WHEN te."id_empleado_planificado" IS NULL THEN 'PENDIENTE' ELSE 'ASIGNADA' END,
       NULLIF(tarea_plan->>'tiempoEstimadoMin','')::INTEGER, tarea_plan->>'instrucciones', u."creado_por"
FROM "finanzas"."tarea_ejecutable_unidad_ot" te
JOIN "finanzas"."version_rectificacion_orden_trabajo" v ON v."id_version_rectificacion" = te."id_version_rectificacion"
JOIN "finanzas"."unidad_fisica_orden_trabajo" u ON u."id_unidad_fisica_ot" = te."id_unidad_fisica_ot"
CROSS JOIN LATERAL jsonb_array_elements(v."planificacion"->'etapas') etapa
CROSS JOIN LATERAL jsonb_array_elements(etapa->'tareas') tarea_plan
WHERE etapa->>'id' = te."id_etapa_planificacion" AND tarea_plan->>'id' = te."id_tarea_planificacion"
ON CONFLICT ("id_tarea_ejecutable_ot") DO NOTHING;

CREATE FUNCTION "finanzas"."impedir_cambio_historial_produccion_ot"() RETURNS trigger
LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'El historial productivo es inmutable' USING ERRCODE = '23514'; END; $$;
CREATE TRIGGER "trg_historial_produccion_ot_inmutable" BEFORE UPDATE OR DELETE ON "finanzas"."historial_cambio_produccion_ot" FOR EACH ROW EXECUTE FUNCTION "finanzas"."impedir_cambio_historial_produccion_ot"();

CREATE FUNCTION "finanzas"."impedir_cambio_cierre_produccion_ot"() RETURNS trigger
LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'El cierre productivo es inmutable' USING ERRCODE = '23514'; END; $$;
CREATE TRIGGER "trg_cierre_produccion_ot_inmutable" BEFORE UPDATE OR DELETE ON "finanzas"."cierre_orden_trabajo_produccion" FOR EACH ROW EXECUTE FUNCTION "finanzas"."impedir_cambio_cierre_produccion_ot"();

CREATE FUNCTION "finanzas"."impedir_cambio_aplicacion_revision_ot"() RETURNS trigger
LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'La aplicación de una revisión técnica es inmutable' USING ERRCODE = '23514'; END; $$;
CREATE TRIGGER "trg_aplicacion_revision_ot_inmutable" BEFORE UPDATE OR DELETE ON "finanzas"."aplicacion_revision_tecnica_ot" FOR EACH ROW EXECUTE FUNCTION "finanzas"."impedir_cambio_aplicacion_revision_ot"();
