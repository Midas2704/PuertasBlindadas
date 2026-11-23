-- Configuración aditiva para Banco Central y correo de recuperación.
-- No modifica ni elimina registros operativos existentes.
CREATE TABLE "comun"."configuracion_integracion_externa" (
  "clave" VARCHAR(40) PRIMARY KEY,
  "configuracion" JSONB NOT NULL,
  "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actualizado_por" BIGINT
);

CREATE INDEX "idx_integracion_externa_actualizada"
  ON "comun"."configuracion_integracion_externa" ("actualizado_en" DESC);
