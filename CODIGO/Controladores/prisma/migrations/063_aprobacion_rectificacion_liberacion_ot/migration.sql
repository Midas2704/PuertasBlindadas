CREATE TABLE "finanzas"."decision_rectificacion_orden_trabajo" (
  "id_decision_rectificacion" BIGSERIAL PRIMARY KEY,
  "id_rectificacion_ot" BIGINT NOT NULL,
  "id_version_rectificacion" BIGINT NOT NULL UNIQUE,
  "decision" VARCHAR(20) NOT NULL,
  "motivo" TEXT,
  "observaciones_tecnicas" TEXT,
  "decidido_por" BIGINT NOT NULL,
  "decidido_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "decision_rectificacion_tipo_ck" CHECK ("decision" IN ('APROBADA','DEVUELTA')),
  CONSTRAINT "decision_rectificacion_rectificacion_fk" FOREIGN KEY ("id_rectificacion_ot") REFERENCES "finanzas"."rectificacion_orden_trabajo"("id_rectificacion_ot") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "decision_rectificacion_version_fk" FOREIGN KEY ("id_version_rectificacion") REFERENCES "finanzas"."version_rectificacion_orden_trabajo"("id_version_rectificacion") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "decision_rectificacion_actor_fk" FOREIGN KEY ("decidido_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION
);
CREATE INDEX "decision_rectificacion_fecha_idx" ON "finanzas"."decision_rectificacion_orden_trabajo" ("id_rectificacion_ot", "decidido_en");

CREATE TABLE "finanzas"."liberacion_orden_trabajo" (
  "id_liberacion_ot" BIGSERIAL PRIMARY KEY,
  "id_unidad_fisica_ot" BIGINT NOT NULL UNIQUE,
  "id_version_rectificacion" BIGINT NOT NULL UNIQUE,
  "liberado_por" BIGINT NOT NULL,
  "liberado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "liberacion_ot_unidad_fk" FOREIGN KEY ("id_unidad_fisica_ot") REFERENCES "finanzas"."unidad_fisica_orden_trabajo"("id_unidad_fisica_ot") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "liberacion_ot_version_fk" FOREIGN KEY ("id_version_rectificacion") REFERENCES "finanzas"."version_rectificacion_orden_trabajo"("id_version_rectificacion") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "liberacion_ot_actor_fk" FOREIGN KEY ("liberado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION
);

CREATE TABLE "finanzas"."tarea_ejecutable_unidad_ot" (
  "id_tarea_ejecutable_ot" BIGSERIAL PRIMARY KEY,
  "id_unidad_fisica_ot" BIGINT NOT NULL,
  "id_version_rectificacion" BIGINT NOT NULL,
  "id_tarea" BIGINT NOT NULL UNIQUE,
  "id_etapa_planificacion" VARCHAR(120) NOT NULL,
  "id_tarea_planificacion" VARCHAR(120) NOT NULL,
  "orden_etapa" INTEGER NOT NULL,
  "orden_tarea" INTEGER NOT NULL,
  "id_empleado_planificado" INTEGER,
  "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "tarea_ejecutable_orden_ck" CHECK ("orden_etapa" > 0 AND "orden_tarea" > 0),
  CONSTRAINT "tarea_ejecutable_plan_uq" UNIQUE ("id_unidad_fisica_ot", "id_version_rectificacion", "id_tarea_planificacion"),
  CONSTRAINT "tarea_ejecutable_unidad_fk" FOREIGN KEY ("id_unidad_fisica_ot") REFERENCES "finanzas"."unidad_fisica_orden_trabajo"("id_unidad_fisica_ot") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "tarea_ejecutable_version_fk" FOREIGN KEY ("id_version_rectificacion") REFERENCES "finanzas"."version_rectificacion_orden_trabajo"("id_version_rectificacion") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "tarea_ejecutable_tarea_fk" FOREIGN KEY ("id_tarea") REFERENCES "terreno"."tarea"("tarea_tarea_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "tarea_ejecutable_empleado_fk" FOREIGN KEY ("id_empleado_planificado") REFERENCES "finanzas"."empleado"("id_empleado") ON DELETE RESTRICT ON UPDATE NO ACTION
);
CREATE INDEX "tarea_ejecutable_secuencia_idx" ON "finanzas"."tarea_ejecutable_unidad_ot" ("id_unidad_fisica_ot", "orden_etapa", "orden_tarea");

CREATE FUNCTION "finanzas"."impedir_cambio_decision_rectificacion_ot"() RETURNS trigger
LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'La decisión técnica es inmutable' USING ERRCODE = '23514'; END; $$;
CREATE TRIGGER "trg_decision_rectificacion_ot_inmutable" BEFORE UPDATE OR DELETE ON "finanzas"."decision_rectificacion_orden_trabajo" FOR EACH ROW EXECUTE FUNCTION "finanzas"."impedir_cambio_decision_rectificacion_ot"();

CREATE FUNCTION "finanzas"."impedir_cambio_liberacion_ot"() RETURNS trigger
LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'La liberación de la OT es inmutable' USING ERRCODE = '23514'; END; $$;
CREATE TRIGGER "trg_liberacion_ot_inmutable" BEFORE UPDATE OR DELETE ON "finanzas"."liberacion_orden_trabajo" FOR EACH ROW EXECUTE FUNCTION "finanzas"."impedir_cambio_liberacion_ot"();

CREATE FUNCTION "finanzas"."impedir_cambio_origen_tarea_ejecutable_ot"() RETURNS trigger
LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'El origen planificado de la tarea ejecutable es inmutable' USING ERRCODE = '23514'; END; $$;
CREATE TRIGGER "trg_origen_tarea_ejecutable_ot_inmutable" BEFORE UPDATE OR DELETE ON "finanzas"."tarea_ejecutable_unidad_ot" FOR EACH ROW EXECUTE FUNCTION "finanzas"."impedir_cambio_origen_tarea_ejecutable_ot"();
