-- Bloque 4.4.1: toda intención creada desde esta versión debe pertenecer a un documento.
-- NOT VALID conserva eventuales filas históricas previas sin debilitar las escrituras nuevas.

ALTER TABLE "finanzas"."intencion_carga_documental"
  ADD CONSTRAINT "chk_intencion_documental_documento_obligatorio"
  CHECK ("id_documento_logico" IS NOT NULL) NOT VALID;
