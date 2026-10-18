-- C3.5: integración aditiva Obra–Proyecto–Cotización.
-- Los vínculos son opcionales para no clasificar históricos por similitud textual.

ALTER TABLE "finanzas"."cotizacion"
  ADD COLUMN "id_obra_contexto" BIGINT;

ALTER TABLE "terreno"."obra"
  ADD COLUMN "obra_edificio" VARCHAR(150),
  ADD COLUMN "obra_unidad" VARCHAR(100),
  ADD COLUMN "clave_ubicacion_normalizada" VARCHAR(700),
  ADD COLUMN "revision_comercial" INTEGER NOT NULL DEFAULT 1;

ALTER TABLE "terreno"."proyecto"
  ADD COLUMN "id_cotizacion_origen" INTEGER;

CREATE TABLE "terreno"."proyecto_obra" (
  "id_proyecto_obra" BIGSERIAL PRIMARY KEY,
  "id_proyecto" BIGINT NOT NULL,
  "id_obra" BIGINT NOT NULL,
  "es_principal" BOOLEAN NOT NULL DEFAULT FALSE,
  "origen" VARCHAR(30) NOT NULL DEFAULT 'COTIZACION',
  "creado_en" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "uq_proyecto_obra" UNIQUE ("id_proyecto", "id_obra"),
  CONSTRAINT "ck_proyecto_obra_origen" CHECK ("origen" IN ('COTIZACION', 'TERRENO', 'ADMINISTRACION')),
  CONSTRAINT "fk_proyecto_obra_proyecto" FOREIGN KEY ("id_proyecto") REFERENCES "terreno"."proyecto"("proyecto_proyecto_id") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_proyecto_obra_obra" FOREIGN KEY ("id_obra") REFERENCES "terreno"."obra"("obra_obra_id") ON DELETE RESTRICT ON UPDATE NO ACTION
);

CREATE UNIQUE INDEX "uq_obra_clave_ubicacion"
  ON "terreno"."obra" ("clave_ubicacion_normalizada")
  WHERE "clave_ubicacion_normalizada" IS NOT NULL;

CREATE UNIQUE INDEX "uq_proyecto_cotizacion_origen"
  ON "terreno"."proyecto" ("id_cotizacion_origen")
  WHERE "id_cotizacion_origen" IS NOT NULL;

CREATE UNIQUE INDEX "uq_proyecto_obra_principal"
  ON "terreno"."proyecto_obra" ("id_proyecto")
  WHERE "es_principal" = TRUE;

CREATE INDEX "idx_cotizacion_obra_contexto" ON "finanzas"."cotizacion" ("id_obra_contexto");
CREATE INDEX "idx_proyecto_cliente_fecha" ON "terreno"."proyecto" ("rut_cliente", "proyecto_fecha_ingreso");
CREATE INDEX "idx_proyecto_obra_obra" ON "terreno"."proyecto_obra" ("id_obra", "id_proyecto");

ALTER TABLE "finanzas"."cotizacion"
  ADD CONSTRAINT "fk_cotizacion_obra_contexto"
  FOREIGN KEY ("id_obra_contexto") REFERENCES "terreno"."obra"("obra_obra_id") ON DELETE RESTRICT ON UPDATE NO ACTION;

ALTER TABLE "terreno"."proyecto"
  ADD CONSTRAINT "fk_proyecto_cotizacion_origen"
  FOREIGN KEY ("id_cotizacion_origen") REFERENCES "finanzas"."cotizacion"("id_cotizacion") ON DELETE RESTRICT ON UPDATE NO ACTION;

COMMENT ON COLUMN "terreno"."obra"."clave_ubicacion_normalizada" IS
  'Clave técnica para impedir duplicados exactos en nuevas Obras; no se rellena ni fusiona automáticamente para históricos.';
COMMENT ON TABLE "terreno"."proyecto_obra" IS
  'Vínculo explícito Proyecto–Obra; admite futuras cardinalidades múltiples sin duplicar ninguna entidad propietaria.';
