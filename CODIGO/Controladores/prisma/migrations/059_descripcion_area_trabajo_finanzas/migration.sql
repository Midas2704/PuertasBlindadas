-- La descripción administrativa es propiedad de Finanzas y no redefine
-- el significado histórico de terreno.area_trabajo_clasificacion.
CREATE TABLE "finanzas"."configuracion_area_trabajo" (
  "id_area_trabajo" BIGINT PRIMARY KEY,
  "descripcion" TEXT,
  "revision" INTEGER NOT NULL DEFAULT 1,
  "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_configuracion_area_catalogo" FOREIGN KEY ("id_area_trabajo") REFERENCES "terreno"."area_trabajo"("area_trabajo_id_area") ON DELETE RESTRICT ON UPDATE NO ACTION
);

INSERT INTO "finanzas"."configuracion_area_trabajo" ("id_area_trabajo", "descripcion")
SELECT area."area_trabajo_id_area", inicial.descripcion
FROM (VALUES
  ('Soldadura', 'Procesos de soldadura y armado metálico'),
  ('Carpintería', 'Procesos de carpintería y terminaciones asociadas'),
  ('Pintura', 'Procesos de preparación y pintura'),
  ('Terreno', 'Despacho, instalación y actividades en terreno')
) AS inicial(nombre, descripcion)
JOIN "terreno"."area_trabajo" area ON LOWER(BTRIM(area."area_trabajo_nombre_area")) = LOWER(BTRIM(inicial.nombre))
ON CONFLICT ("id_area_trabajo") DO NOTHING;
