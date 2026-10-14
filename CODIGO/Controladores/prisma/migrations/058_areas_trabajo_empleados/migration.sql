-- Reutiliza terreno.area_trabajo como catálogo operativo único, sin alterar sus columnas.
CREATE UNIQUE INDEX "uq_area_trabajo_nombre_normalizado"
  ON "terreno"."area_trabajo" (LOWER(BTRIM("area_trabajo_nombre_area")))
  WHERE "area_trabajo_nombre_area" IS NOT NULL AND BTRIM("area_trabajo_nombre_area") <> '';

INSERT INTO "terreno"."area_trabajo" ("area_trabajo_clasificacion", "area_trabajo_activo", "area_trabajo_nombre_area")
SELECT inicial.descripcion, TRUE, inicial.nombre
FROM (VALUES
  ('Soldadura', 'Procesos de soldadura y armado metálico'),
  ('Carpintería', 'Procesos de carpintería y terminaciones asociadas'),
  ('Pintura', 'Procesos de preparación y pintura'),
  ('Terreno', 'Despacho, instalación y actividades en terreno')
) AS inicial(nombre, descripcion)
WHERE NOT EXISTS (
  SELECT 1 FROM "terreno"."area_trabajo" existente
  WHERE LOWER(BTRIM(existente."area_trabajo_nombre_area")) = LOWER(BTRIM(inicial.nombre))
);

CREATE TABLE "finanzas"."asignacion_area_empleado" (
  "id_asignacion_area_empleado" SERIAL PRIMARY KEY,
  "id_empleado" INTEGER NOT NULL,
  "id_area_trabajo" BIGINT NOT NULL,
  "vigencia_desde" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "vigencia_hasta" TIMESTAMPTZ(6),
  "motivo" TEXT NOT NULL,
  "asignado_por" BIGINT NOT NULL,
  "finalizado_por" BIGINT,
  CONSTRAINT "chk_asignacion_area_motivo" CHECK (BTRIM("motivo") <> ''),
  CONSTRAINT "chk_asignacion_area_vigencia" CHECK ("vigencia_hasta" IS NULL OR "vigencia_hasta" >= "vigencia_desde"),
  CONSTRAINT "fk_asignacion_area_empleado" FOREIGN KEY ("id_empleado") REFERENCES "finanzas"."empleado"("id_empleado") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_asignacion_area_catalogo" FOREIGN KEY ("id_area_trabajo") REFERENCES "terreno"."area_trabajo"("area_trabajo_id_area") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_asignacion_area_asignador" FOREIGN KEY ("asignado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_asignacion_area_finalizador" FOREIGN KEY ("finalizado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION
);

CREATE UNIQUE INDEX "uq_asignacion_area_empleado_vigente" ON "finanzas"."asignacion_area_empleado" ("id_empleado") WHERE "vigencia_hasta" IS NULL;
CREATE INDEX "idx_asignacion_area_empleado_historial" ON "finanzas"."asignacion_area_empleado" ("id_empleado", "vigencia_desde" DESC);
CREATE INDEX "idx_asignacion_area_disponibilidad" ON "finanzas"."asignacion_area_empleado" ("id_area_trabajo", "vigencia_hasta");
