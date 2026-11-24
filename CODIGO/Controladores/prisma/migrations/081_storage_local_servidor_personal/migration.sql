-- Permite persistir documentos generados internamente en el volumen privado del
-- servidor personal. R2, S3 y el proveedor PostgreSQL académico previamente
-- habilitado siguen admitidos para conservar documentos históricos.
ALTER TABLE "finanzas"."version_documento"
  DROP CONSTRAINT IF EXISTS "chk_version_documento_proveedor";

ALTER TABLE "finanzas"."version_documento"
  ADD CONSTRAINT "chk_version_documento_proveedor"
  CHECK ("proveedor_logico" IN ('R2', 'S3', 'LOCAL_PRIVADO', 'POSTGRES'))
  NOT VALID;

ALTER TABLE "finanzas"."version_documento"
  VALIDATE CONSTRAINT "chk_version_documento_proveedor";
