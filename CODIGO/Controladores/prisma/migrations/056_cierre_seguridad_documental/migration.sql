-- Bloque 4.4.1: vinculación de intención y propiedad del lease del outbox.
-- Las filas históricas permanecen compatibles mediante FK nullable; toda intención nueva la exige la aplicación.

ALTER TABLE "finanzas"."intencion_carga_documental"
  ADD COLUMN "id_documento_logico" BIGINT;

ALTER TABLE "finanzas"."intencion_carga_documental"
  ADD CONSTRAINT "fk_intencion_documental_documento"
  FOREIGN KEY ("id_documento_logico")
  REFERENCES "finanzas"."documento_logico"("id_documento_logico")
  ON DELETE RESTRICT ON UPDATE NO ACTION;

CREATE INDEX "idx_intencion_documental_documento_estado"
  ON "finanzas"."intencion_carga_documental" ("id_documento_logico", "estado");

ALTER TABLE "finanzas"."evento_operacional_documental"
  ADD COLUMN "lease_token" UUID,
  ADD COLUMN "lease_hasta" TIMESTAMPTZ(6);

-- Un procesamiento previo sin dueño verificable vuelve a cola recuperable; no se descarta el evento.
UPDATE "finanzas"."evento_operacional_documental"
SET "estado" = 'ERROR',
    "codigo_error" = COALESCE("codigo_error", 'LEASE_MIGRADO'),
    "proximo_intento_en" = CURRENT_TIMESTAMP
WHERE "estado" = 'PROCESANDO';

ALTER TABLE "finanzas"."evento_operacional_documental"
  ADD CONSTRAINT "chk_evento_documental_lease"
  CHECK (
    ("estado" = 'PROCESANDO' AND "lease_token" IS NOT NULL AND "lease_hasta" IS NOT NULL)
    OR
    ("estado" <> 'PROCESANDO' AND "lease_token" IS NULL AND "lease_hasta" IS NULL)
  );

CREATE UNIQUE INDEX "uq_evento_documental_lease_token"
  ON "finanzas"."evento_operacional_documental" ("lease_token")
  WHERE "lease_token" IS NOT NULL;

CREATE INDEX "idx_evento_documental_lease"
  ON "finanzas"."evento_operacional_documental" ("estado", "lease_hasta");
