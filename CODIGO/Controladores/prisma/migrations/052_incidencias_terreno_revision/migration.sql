CREATE TABLE "terreno"."categoria_incidencia_terreno" (
  "id_categoria_incidencia" SERIAL NOT NULL,
  "codigo" VARCHAR(30) NOT NULL,
  "nombre" VARCHAR(100) NOT NULL,
  "activa" BOOLEAN NOT NULL DEFAULT true,
  CONSTRAINT "categoria_incidencia_terreno_pkey" PRIMARY KEY ("id_categoria_incidencia"),
  CONSTRAINT "categoria_incidencia_terreno_codigo_key" UNIQUE ("codigo")
);

INSERT INTO "terreno"."categoria_incidencia_terreno" ("codigo", "nombre") VALUES
  ('ATRASO', 'Atraso'),
  ('POSTVENTA', 'Postventa'),
  ('PRODUCCION', 'Producción'),
  ('INSTALACION', 'Instalación'),
  ('MEDICION', 'Medición'),
  ('LOGISTICA', 'Logística'),
  ('OTRO', 'Otro');

ALTER TABLE "terreno"."incidencia_retrabajo_tarea"
  ADD COLUMN "id_categoria_incidencia" INTEGER,
  ADD COLUMN "id_area_responsable" BIGINT,
  ADD COLUMN "id_usuario_creador" BIGINT,
  ADD COLUMN "estado_revision" VARCHAR(30) NOT NULL DEFAULT 'pendiente_revision',
  ADD COLUMN "id_usuario_revisor" BIGINT,
  ADD COLUMN "fecha_revision" TIMESTAMPTZ(6),
  ADD COLUMN "observacion_revision" TEXT,
  ADD CONSTRAINT "ck_incidencia_estado_revision" CHECK ("estado_revision" IN ('pendiente_revision', 'aprobada', 'rechazada')),
  ADD CONSTRAINT "fk_incidencia_categoria" FOREIGN KEY ("id_categoria_incidencia") REFERENCES "terreno"."categoria_incidencia_terreno"("id_categoria_incidencia") ON DELETE RESTRICT ON UPDATE NO ACTION,
  ADD CONSTRAINT "fk_incidencia_area" FOREIGN KEY ("id_area_responsable") REFERENCES "terreno"."area_trabajo"("area_trabajo_id_area") ON DELETE RESTRICT ON UPDATE NO ACTION,
  ADD CONSTRAINT "fk_incidencia_creador" FOREIGN KEY ("id_usuario_creador") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION,
  ADD CONSTRAINT "fk_incidencia_revisor" FOREIGN KEY ("id_usuario_revisor") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION;

CREATE INDEX "idx_incidencia_categoria_revision" ON "terreno"."incidencia_retrabajo_tarea"("id_categoria_incidencia", "estado_revision");
CREATE INDEX "idx_incidencia_area" ON "terreno"."incidencia_retrabajo_tarea"("id_area_responsable");

ALTER TABLE "terreno"."evidencia_terreno"
  ADD COLUMN "id_incidencia_retrabajo" BIGINT,
  ADD CONSTRAINT "fk_evidencia_terreno_incidencia" FOREIGN KEY ("id_incidencia_retrabajo") REFERENCES "terreno"."incidencia_retrabajo_tarea"("id_incidencia_retrabajo") ON DELETE RESTRICT ON UPDATE NO ACTION;

CREATE INDEX "idx_evidencia_terreno_incidencia" ON "terreno"."evidencia_terreno"("id_incidencia_retrabajo");
