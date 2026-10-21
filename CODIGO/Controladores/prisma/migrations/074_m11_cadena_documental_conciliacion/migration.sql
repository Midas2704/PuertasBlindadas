-- M11 Fase 2: cadena documental, correcciones, hallazgos y resolución humana.
-- Aditiva. No altera originales ni crea hechos físicos, DTE, CxC o movimientos.

CREATE TABLE "finanzas"."correccion_documental_m11" (
  "id_correccion_documental_m11" BIGSERIAL PRIMARY KEY,
  "tipo_documento" VARCHAR(20) NOT NULL,
  "id_orden_compra_original" INTEGER,
  "id_guia_original" INTEGER,
  "id_guia_correctora" INTEGER,
  "id_documento_original" INTEGER,
  "id_documento_corrector" INTEGER,
  "actuacion" VARCHAR(80) NOT NULL,
  "motivo" TEXT NOT NULL,
  "respaldo" TEXT NOT NULL,
  "snapshot_anterior" JSONB NOT NULL,
  "snapshot_resultado" JSONB NOT NULL,
  "actor_id" BIGINT NOT NULL,
  "clave_idempotencia" VARCHAR(120) NOT NULL UNIQUE,
  "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_correccion_m11_oc" FOREIGN KEY ("id_orden_compra_original") REFERENCES "finanzas"."orden_compra_b2b"("id_orden_compra_b2b") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_correccion_m11_guia" FOREIGN KEY ("id_guia_original") REFERENCES "finanzas"."guia_despacho"("id_guia_despacho") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_correccion_m11_guia_correctora" FOREIGN KEY ("id_guia_correctora") REFERENCES "finanzas"."guia_despacho"("id_guia_despacho") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_correccion_m11_documento_original" FOREIGN KEY ("id_documento_original") REFERENCES "finanzas"."documento_tributario"("id_documento_tributario") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_correccion_m11_documento_corrector" FOREIGN KEY ("id_documento_corrector") REFERENCES "finanzas"."documento_tributario"("id_documento_tributario") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_correccion_m11_actor" FOREIGN KEY ("actor_id") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "ck_correccion_m11_tipo" CHECK ("tipo_documento" IN ('OC','GDE','DTE')),
  CONSTRAINT "ck_correccion_m11_original" CHECK (("tipo_documento"='OC' AND "id_orden_compra_original" IS NOT NULL AND "id_guia_original" IS NULL AND "id_guia_correctora" IS NULL AND "id_documento_original" IS NULL AND "id_documento_corrector" IS NULL) OR ("tipo_documento"='GDE' AND "id_orden_compra_original" IS NULL AND "id_guia_original" IS NOT NULL AND "id_guia_correctora" IS NOT NULL AND "id_documento_original" IS NULL AND "id_documento_corrector" IS NULL) OR ("tipo_documento"='DTE' AND "id_orden_compra_original" IS NULL AND "id_guia_original" IS NULL AND "id_guia_correctora" IS NULL AND "id_documento_original" IS NOT NULL AND "id_documento_corrector" IS NOT NULL)),
  CONSTRAINT "ck_correccion_m11_documentos_distintos" CHECK ("id_documento_original" IS NULL OR "id_documento_original" <> "id_documento_corrector")
);
CREATE INDEX "idx_correccion_m11_guia" ON "finanzas"."correccion_documental_m11" ("tipo_documento","id_guia_original","creado_en");
CREATE INDEX "idx_correccion_m11_oc" ON "finanzas"."correccion_documental_m11" ("tipo_documento","id_orden_compra_original","creado_en");
CREATE INDEX "idx_correccion_m11_documento" ON "finanzas"."correccion_documental_m11" ("tipo_documento","id_documento_original","creado_en");

CREATE TABLE "finanzas"."hallazgo_discrepancia_m11" (
  "id_hallazgo_discrepancia_m11" BIGSERIAL PRIMARY KEY,
  "id_orden_compra_b2b" INTEGER NOT NULL,
  "id_linea_orden_compra_b2b" BIGINT,
  "etapa" VARCHAR(20) NOT NULL,
  "tipo_discrepancia" VARCHAR(80) NOT NULL,
  "referencias_origen" JSONB NOT NULL,
  "evidencia" JSONB NOT NULL,
  "contexto" JSONB NOT NULL,
  "estado" VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
  "clave_idempotencia" VARCHAR(160) NOT NULL UNIQUE,
  "detectado_por" BIGINT,
  "revision" INTEGER NOT NULL DEFAULT 1,
  "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_hallazgo_m11_oc" FOREIGN KEY ("id_orden_compra_b2b") REFERENCES "finanzas"."orden_compra_b2b"("id_orden_compra_b2b") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_hallazgo_m11_linea_oc" FOREIGN KEY ("id_linea_orden_compra_b2b") REFERENCES "finanzas"."linea_orden_compra_b2b"("id_linea_orden_compra_b2b") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_hallazgo_m11_actor" FOREIGN KEY ("detectado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "ck_hallazgo_m11_etapa" CHECK ("etapa" IN ('ORDEN_VS_SALIDA','SALIDA_VS_FACTURACION')),
  CONSTRAINT "ck_hallazgo_m11_estado" CHECK ("estado" IN ('PENDIENTE','RESUELTO')),
  CONSTRAINT "ck_hallazgo_m11_revision" CHECK ("revision" > 0)
);
CREATE INDEX "idx_hallazgo_m11_oc_estado" ON "finanzas"."hallazgo_discrepancia_m11" ("id_orden_compra_b2b","estado");

CREATE TABLE "finanzas"."resolucion_hallazgo_m11" (
  "id_resolucion_hallazgo_m11" BIGSERIAL PRIMARY KEY,
  "id_hallazgo" BIGINT NOT NULL,
  "decision" VARCHAR(120) NOT NULL,
  "motivo" TEXT NOT NULL,
  "respaldo" TEXT NOT NULL,
  "resultado" TEXT NOT NULL,
  "actor_id" BIGINT NOT NULL,
  "clave_idempotencia" VARCHAR(120) NOT NULL UNIQUE,
  "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_resolucion_m11_hallazgo" FOREIGN KEY ("id_hallazgo") REFERENCES "finanzas"."hallazgo_discrepancia_m11"("id_hallazgo_discrepancia_m11") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_resolucion_m11_actor" FOREIGN KEY ("actor_id") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION
);
CREATE INDEX "idx_resolucion_m11_hallazgo" ON "finanzas"."resolucion_hallazgo_m11" ("id_hallazgo","creado_en");

DO $$
DECLARE incompatible RECORD;
BEGIN
  SELECT p."codigo_m4" INTO incompatible
  FROM "terreno"."permiso" p
  JOIN (VALUES
    ('CU458','gestionar correcciones documentales','Gestionar correcciones documentales procedentes conservando originales','Gestionar correcciones documentales'),
    ('CU459','conciliar cadena documental','Consultar conciliación entre OC, salida física acreditada y facturación','Conciliar operación documental'),
    ('CU461','resolver discrepancias documentales','Registrar resolución humana de hallazgos documentales acreditados','Resolver discrepancias documentales')
  ) AS esperado(codigo,accion,descripcion,nombre) ON esperado.codigo=p."codigo_m4"
  WHERE p."permiso_modulo" IS DISTINCT FROM 'M11' OR p."permiso_accion" IS DISTINCT FROM esperado.accion OR p."permiso_descripcion" IS DISTINCT FROM esperado.descripcion OR p."permiso_nombre_del_permiso" IS DISTINCT FROM esperado.nombre OR p."requiere_administrador" IS DISTINCT FROM FALSE
  LIMIT 1;
  IF FOUND THEN RAISE EXCEPTION 'Permiso M4 % ya existe con definición incompatible', incompatible."codigo_m4"; END IF;
END $$;

INSERT INTO "terreno"."permiso" ("permiso_modulo","permiso_accion","permiso_descripcion","permiso_nombre_del_permiso","codigo_m4","activo_m4","requiere_administrador")
SELECT 'M11',accion,descripcion,nombre,codigo,TRUE,FALSE FROM (VALUES
  ('CU458','gestionar correcciones documentales','Gestionar correcciones documentales procedentes conservando originales','Gestionar correcciones documentales'),
  ('CU459','conciliar cadena documental','Consultar conciliación entre OC, salida física acreditada y facturación','Conciliar operación documental'),
  ('CU461','resolver discrepancias documentales','Registrar resolución humana de hallazgos documentales acreditados','Resolver discrepancias documentales')
) AS nuevos(codigo,accion,descripcion,nombre)
ON CONFLICT ("codigo_m4") DO NOTHING;

INSERT INTO "terreno"."permiso_dependencia" ("id_permiso","id_requerido")
SELECT dependiente."permiso_id_permiso", requerido."permiso_id_permiso"
FROM (VALUES ('CU458','CU36'),('CU459','CU20'),('CU461','CU459')) AS relacion(codigo,requerido)
JOIN "terreno"."permiso" dependiente ON dependiente."codigo_m4"=relacion.codigo
JOIN "terreno"."permiso" requerido ON requerido."codigo_m4"=relacion.requerido
ON CONFLICT ("id_permiso","id_requerido") DO NOTHING;

-- CU377 permanece deliberadamente excluido.
