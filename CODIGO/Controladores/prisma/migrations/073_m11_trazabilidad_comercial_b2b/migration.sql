-- M11 Fase 1: ofertas aceptadas, líneas de OC y correspondencia comercial-técnica.
-- Migración aditiva: los registros históricos permanecen válidos y no se clasifican por inferencia.

ALTER TABLE "finanzas"."orden_compra_b2b"
  ADD COLUMN "id_version_oferta_aceptada" INTEGER,
  ADD COLUMN "estado_cotejo" VARCHAR(30) NOT NULL DEFAULT 'INFORMACION_INSUFICIENTE',
  ADD COLUMN "resultado_cotejo" JSONB,
  ADD COLUMN "revision" INTEGER NOT NULL DEFAULT 1;

ALTER TABLE "finanzas"."orden_compra_b2b"
  ADD CONSTRAINT "fk_orden_compra_oferta_aceptada"
  FOREIGN KEY ("id_version_oferta_aceptada")
  REFERENCES "finanzas"."cotizacion_version"("id_cotizacion_version")
  ON DELETE RESTRICT ON UPDATE NO ACTION,
  ADD CONSTRAINT "ck_orden_compra_estado_cotejo"
  CHECK ("estado_cotejo" IN ('COINCIDE','DISCREPANCIA','INFORMACION_INSUFICIENTE')),
  ADD CONSTRAINT "ck_orden_compra_revision" CHECK ("revision" > 0);

CREATE INDEX "idx_orden_compra_oferta_aceptada"
  ON "finanzas"."orden_compra_b2b" ("id_version_oferta_aceptada");

CREATE TABLE "finanzas"."linea_orden_compra_b2b" (
  "id_linea_orden_compra_b2b" BIGSERIAL PRIMARY KEY,
  "id_orden_compra_b2b" INTEGER NOT NULL,
  "numero_linea" INTEGER NOT NULL,
  "id_detalle_cotizacion" INTEGER,
  "referencia_comercial" VARCHAR(120),
  "concepto" TEXT,
  "especificaciones" JSONB,
  "cantidad" DECIMAL(12,2),
  "id_moneda" INTEGER,
  "precio_unitario" DECIMAL(14,2),
  "subtotal" DECIMAL(14,2),
  "estado_cotejo" VARCHAR(30) NOT NULL DEFAULT 'INFORMACION_INSUFICIENTE',
  "resultado_cotejo" JSONB,
  "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_linea_oc_orden_compra" FOREIGN KEY ("id_orden_compra_b2b") REFERENCES "finanzas"."orden_compra_b2b"("id_orden_compra_b2b") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_linea_oc_detalle_cotizacion" FOREIGN KEY ("id_detalle_cotizacion") REFERENCES "finanzas"."detalle_cotizacion"("id_detalle_cotizacion") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_linea_oc_moneda" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "uq_linea_oc_numero" UNIQUE ("id_orden_compra_b2b", "numero_linea"),
  CONSTRAINT "ck_linea_oc_numero" CHECK ("numero_linea" > 0),
  CONSTRAINT "ck_linea_oc_cantidad" CHECK ("cantidad" IS NULL OR "cantidad" > 0),
  CONSTRAINT "ck_linea_oc_precio" CHECK ("precio_unitario" IS NULL OR "precio_unitario" >= 0),
  CONSTRAINT "ck_linea_oc_subtotal" CHECK ("subtotal" IS NULL OR "subtotal" >= 0),
  CONSTRAINT "ck_linea_oc_estado_cotejo" CHECK ("estado_cotejo" IN ('COINCIDE','DISCREPANCIA','INFORMACION_INSUFICIENTE'))
);

CREATE INDEX "idx_linea_oc_detalle"
  ON "finanzas"."linea_orden_compra_b2b" ("id_detalle_cotizacion");

CREATE TABLE "finanzas"."correspondencia_linea_oc_item_tecnico" (
  "id_linea_orden_compra_b2b" BIGINT NOT NULL,
  "id_unidad_fisica_ot" BIGINT NOT NULL,
  "estado" VARCHAR(30) NOT NULL DEFAULT 'ACREDITADA',
  "evidencia" JSONB NOT NULL,
  "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "pk_correspondencia_linea_oc_item_tecnico" PRIMARY KEY ("id_linea_orden_compra_b2b", "id_unidad_fisica_ot"),
  CONSTRAINT "fk_correspondencia_linea_oc" FOREIGN KEY ("id_linea_orden_compra_b2b") REFERENCES "finanzas"."linea_orden_compra_b2b"("id_linea_orden_compra_b2b") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_correspondencia_item_tecnico" FOREIGN KEY ("id_unidad_fisica_ot") REFERENCES "finanzas"."unidad_fisica_orden_trabajo"("id_unidad_fisica_ot") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "ck_correspondencia_linea_oc_estado" CHECK ("estado" = 'ACREDITADA')
);

CREATE INDEX "idx_correspondencia_linea_oc_unidad"
  ON "finanzas"."correspondencia_linea_oc_item_tecnico" ("id_unidad_fisica_ot");
