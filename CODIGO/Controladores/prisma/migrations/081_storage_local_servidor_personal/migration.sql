-- Permite persistir documentos generados internamente en el volumen privado del
-- servidor personal. R2 y S3 siguen admitidos para el modo endurecido.
ALTER TABLE "finanzas"."version_documento"
  DROP CONSTRAINT IF EXISTS "chk_version_documento_proveedor";

ALTER TABLE "finanzas"."version_documento"
  ADD CONSTRAINT "chk_version_documento_proveedor"
  CHECK ("proveedor_logico" IN ('R2', 'S3', 'LOCAL_PRIVADO'))
  NOT VALID;

ALTER TABLE "finanzas"."version_documento"
  VALIDATE CONSTRAINT "chk_version_documento_proveedor";
