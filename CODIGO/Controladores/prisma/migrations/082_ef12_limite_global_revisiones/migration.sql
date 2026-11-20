-- EF-12. Un límite reemplazado el mismo día se conserva como versión histórica.
-- Las consultas vigentes deben excluir sustituido_en IS NOT NULL.
ALTER TABLE "finanzas"."limite_global_credito_m8"
  ADD COLUMN "sustituido_en" TIMESTAMP(6);
