-- C3.3: persistencia aditiva de contactos B2B, servicios comerciales y selección B2C.
-- No clasifica ni modifica registros históricos.

CREATE TABLE "finanzas"."contacto_cotizacion_b2b" (
  "id_contacto_cotizacion_b2b" BIGSERIAL PRIMARY KEY,
  "id_cotizacion" INTEGER NOT NULL,
  "nombre" VARCHAR(120) NOT NULL,
  "apellido" VARCHAR(120),
  "cargo" VARCHAR(120),
  "empresa_relacionada" VARCHAR(200),
  "correo" VARCHAR(254),
  "telefono" VARCHAR(40),
  "tipo_contacto" VARCHAR(30) NOT NULL DEFAULT 'COMERCIAL',
  "es_principal" BOOLEAN NOT NULL DEFAULT FALSE,
  "observaciones" TEXT,
  "estado" VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
  "revision" INTEGER NOT NULL DEFAULT 1,
  "creado_por" BIGINT NOT NULL,
  "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_contacto_cotizacion_b2b_cotizacion" FOREIGN KEY ("id_cotizacion") REFERENCES "finanzas"."cotizacion"("id_cotizacion") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_contacto_cotizacion_b2b_actor" FOREIGN KEY ("creado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "ck_contacto_cotizacion_b2b_estado" CHECK ("estado" IN ('ACTIVO','INACTIVO')),
  CONSTRAINT "ck_contacto_cotizacion_b2b_tipo" CHECK ("tipo_contacto" IN ('COMERCIAL','TECNICO','OBRA','FACTURACION','OTRO')),
  CONSTRAINT "ck_contacto_cotizacion_b2b_nombre" CHECK (btrim("nombre") <> ''),
  CONSTRAINT "ck_contacto_cotizacion_b2b_revision" CHECK ("revision" > 0)
);
CREATE INDEX "idx_contacto_cotizacion_b2b_estado" ON "finanzas"."contacto_cotizacion_b2b" ("id_cotizacion","estado");
CREATE UNIQUE INDEX "uq_contacto_cotizacion_b2b_principal" ON "finanzas"."contacto_cotizacion_b2b" ("id_cotizacion") WHERE "es_principal" AND "estado"='ACTIVO';

CREATE TABLE "finanzas"."servicio_comercial" (
  "id_servicio_comercial" BIGSERIAL PRIMARY KEY,
  "codigo" VARCHAR(50) NOT NULL UNIQUE,
  "nombre" VARCHAR(160) NOT NULL,
  "descripcion" TEXT,
  "unidad_cobro" VARCHAR(40) NOT NULL,
  "habilitado_b2b" BOOLEAN NOT NULL DEFAULT TRUE,
  "habilitado_b2c" BOOLEAN NOT NULL DEFAULT FALSE,
  "estado" VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
  "revision" INTEGER NOT NULL DEFAULT 1,
  "creado_por" BIGINT NOT NULL,
  "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_servicio_comercial_actor" FOREIGN KEY ("creado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "ck_servicio_comercial_codigo" CHECK ("codigo" ~ '^[A-Z0-9][A-Z0-9._-]{1,49}$'),
  CONSTRAINT "ck_servicio_comercial_nombre" CHECK (btrim("nombre") <> ''),
  CONSTRAINT "ck_servicio_comercial_unidad" CHECK ("unidad_cobro" IN ('UNIDAD','VIAJE','TRAMO','HORA','JORNADA','GLOBAL')),
  CONSTRAINT "ck_servicio_comercial_estado" CHECK ("estado" IN ('ACTIVO','INACTIVO')),
  CONSTRAINT "ck_servicio_comercial_revision" CHECK ("revision" > 0)
);
CREATE INDEX "idx_servicio_comercial_b2b" ON "finanzas"."servicio_comercial" ("estado","habilitado_b2b");

CREATE TABLE "finanzas"."precio_servicio_comercial" (
  "id_precio_servicio_comercial" BIGSERIAL PRIMARY KEY,
  "id_servicio_comercial" BIGINT NOT NULL,
  "segmento_comercial" VARCHAR(3) NOT NULL,
  "id_moneda" INTEGER NOT NULL,
  "monto" DECIMAL(14,2) NOT NULL,
  "vigencia_desde" DATE NOT NULL,
  "vigencia_hasta" DATE,
  "estado" VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
  "motivo" TEXT,
  "revision" INTEGER NOT NULL DEFAULT 1,
  "creado_por" BIGINT NOT NULL,
  "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_precio_servicio_comercial_servicio" FOREIGN KEY ("id_servicio_comercial") REFERENCES "finanzas"."servicio_comercial"("id_servicio_comercial") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_precio_servicio_comercial_moneda" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_precio_servicio_comercial_actor" FOREIGN KEY ("creado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "uq_precio_servicio_inicio" UNIQUE ("id_servicio_comercial","segmento_comercial","id_moneda","vigencia_desde"),
  CONSTRAINT "ck_precio_servicio_segmento" CHECK ("segmento_comercial" IN ('B2B','B2C')),
  CONSTRAINT "ck_precio_servicio_monto" CHECK ("monto" > 0),
  CONSTRAINT "ck_precio_servicio_vigencia" CHECK ("vigencia_hasta" IS NULL OR "vigencia_hasta" >= "vigencia_desde"),
  CONSTRAINT "ck_precio_servicio_estado" CHECK ("estado" IN ('ACTIVO','INACTIVO')),
  CONSTRAINT "ck_precio_servicio_revision" CHECK ("revision" > 0)
);
ALTER TABLE "finanzas"."precio_servicio_comercial" ADD CONSTRAINT "ex_precio_servicio_vigencia"
  EXCLUDE USING gist ("id_servicio_comercial" WITH =, "segmento_comercial" WITH =, "id_moneda" WITH =, daterange("vigencia_desde", COALESCE("vigencia_hasta" + 1, 'infinity'::date), '[)') WITH &&)
  WHERE ("estado"='ACTIVO');
CREATE INDEX "idx_precio_servicio_vigencia" ON "finanzas"."precio_servicio_comercial" ("id_servicio_comercial","segmento_comercial","estado","vigencia_desde","vigencia_hasta");

CREATE TABLE "finanzas"."detalle_servicio_cotizacion" (
  "id_detalle_servicio_cotizacion" BIGSERIAL PRIMARY KEY,
  "id_cotizacion" INTEGER NOT NULL,
  "id_servicio_comercial" BIGINT NOT NULL,
  "id_precio_servicio_comercial" BIGINT NOT NULL,
  "tipo_linea_comercial" VARCHAR(30) NOT NULL,
  "descripcion_cotizada" TEXT NOT NULL,
  "cantidad" DECIMAL(12,2) NOT NULL,
  "unidad_cobro_cotizada" VARCHAR(40) NOT NULL,
  "precio_unitario_autorizado" DECIMAL(14,2) NOT NULL,
  "descuento_elegible" BOOLEAN NOT NULL DEFAULT TRUE,
  "subtotal" DECIMAL(14,2) NOT NULL,
  "snapshot_comercial" JSONB NOT NULL,
  "revision" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "fk_detalle_servicio_cotizacion" FOREIGN KEY ("id_cotizacion") REFERENCES "finanzas"."cotizacion"("id_cotizacion") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_detalle_servicio_catalogo" FOREIGN KEY ("id_servicio_comercial") REFERENCES "finanzas"."servicio_comercial"("id_servicio_comercial") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_detalle_servicio_precio" FOREIGN KEY ("id_precio_servicio_comercial") REFERENCES "finanzas"."precio_servicio_comercial"("id_precio_servicio_comercial") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "ck_detalle_servicio_tipo" CHECK ("tipo_linea_comercial" IN ('FLETE','DESPACHO','TRANSPORTE','CARGA_DESCARGA','SERVICIO_ADICIONAL')),
  CONSTRAINT "ck_detalle_servicio_importes" CHECK ("cantidad" > 0 AND "precio_unitario_autorizado" > 0 AND "subtotal" = ROUND("cantidad" * "precio_unitario_autorizado",2)),
  CONSTRAINT "ck_detalle_servicio_revision" CHECK ("revision" > 0)
);
CREATE INDEX "idx_detalle_servicio_cotizacion" ON "finanzas"."detalle_servicio_cotizacion" ("id_cotizacion");
CREATE INDEX "idx_detalle_servicio_catalogo_precio" ON "finanzas"."detalle_servicio_cotizacion" ("id_servicio_comercial","id_precio_servicio_comercial");

ALTER TABLE "finanzas"."grupo_alternativas_b2c"
  ADD COLUMN "id_alternativa_seleccionada" BIGINT,
  ADD COLUMN "seleccionada_en" TIMESTAMPTZ(6),
  ADD COLUMN "seleccionada_por" BIGINT,
  ADD CONSTRAINT "uq_grupo_alternativa_seleccionada" UNIQUE ("id_alternativa_seleccionada"),
  ADD CONSTRAINT "fk_grupo_alternativa_seleccionada" FOREIGN KEY ("id_alternativa_seleccionada") REFERENCES "finanzas"."alternativa_b2c"("id_alternativa_b2c") ON DELETE RESTRICT ON UPDATE NO ACTION,
  ADD CONSTRAINT "fk_grupo_alternativa_selector" FOREIGN KEY ("seleccionada_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION,
  ADD CONSTRAINT "ck_grupo_alternativa_seleccion" CHECK (("id_alternativa_seleccionada" IS NULL AND "seleccionada_en" IS NULL AND "seleccionada_por" IS NULL) OR ("id_alternativa_seleccionada" IS NOT NULL AND "seleccionada_en" IS NOT NULL AND "seleccionada_por" IS NOT NULL));

CREATE OR REPLACE FUNCTION "finanzas"."validar_contacto_cotizacion_b2b"() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM "finanzas"."cotizacion" c WHERE c."id_cotizacion"=NEW."id_cotizacion" AND c."segmento_comercial"='B2B') THEN
    RAISE EXCEPTION 'Los contactos propios sólo se admiten en cotizaciones B2B';
  END IF;
  IF NEW."correo" IS NULL AND NEW."telefono" IS NULL THEN RAISE EXCEPTION 'El contacto debe incluir correo o teléfono'; END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER "tr_contacto_cotizacion_b2b" BEFORE INSERT OR UPDATE ON "finanzas"."contacto_cotizacion_b2b" FOR EACH ROW EXECUTE FUNCTION "finanzas"."validar_contacto_cotizacion_b2b"();

CREATE OR REPLACE FUNCTION "finanzas"."validar_detalle_servicio_c3_3"() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM "finanzas"."precio_servicio_comercial" p JOIN "finanzas"."servicio_comercial" s ON s."id_servicio_comercial"=p."id_servicio_comercial"
    WHERE p."id_precio_servicio_comercial"=NEW."id_precio_servicio_comercial" AND p."id_servicio_comercial"=NEW."id_servicio_comercial" AND p."monto"=NEW."precio_unitario_autorizado" AND p."estado"='ACTIVO' AND s."estado"='ACTIVO'
  ) THEN RAISE EXCEPTION 'El precio de servicio no coincide con una versión activa'; END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER "tr_detalle_servicio_c3_3" BEFORE INSERT OR UPDATE ON "finanzas"."detalle_servicio_cotizacion" FOR EACH ROW EXECUTE FUNCTION "finanzas"."validar_detalle_servicio_c3_3"();

CREATE OR REPLACE FUNCTION "finanzas"."validar_seleccion_alternativa_b2c"() RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW."id_alternativa_seleccionada" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM "finanzas"."alternativa_b2c" a WHERE a."id_alternativa_b2c"=NEW."id_alternativa_seleccionada" AND a."id_grupo_alternativas_b2c"=NEW."id_grupo_alternativas_b2c" AND a."estado"='PROPUESTA') THEN
    RAISE EXCEPTION 'La alternativa seleccionada debe pertenecer al grupo y permanecer propuesta';
  END IF;
  RETURN NEW;
END; $$;
CREATE TRIGGER "tr_grupo_seleccion_alternativa_b2c" BEFORE INSERT OR UPDATE OF "id_alternativa_seleccionada" ON "finanzas"."grupo_alternativas_b2c" FOR EACH ROW EXECUTE FUNCTION "finanzas"."validar_seleccion_alternativa_b2c"();

CREATE TABLE "finanzas"."historial_seleccion_alternativa_b2c" (
  "id_historial_seleccion" BIGSERIAL PRIMARY KEY,
  "id_grupo_alternativas_b2c" BIGINT NOT NULL,
  "id_alternativa_anterior" BIGINT,
  "id_alternativa_nueva" BIGINT,
  "motivo" TEXT NOT NULL,
  "actor_id" BIGINT NOT NULL,
  "revision_grupo" INTEGER NOT NULL,
  "fecha" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_historial_seleccion_grupo" FOREIGN KEY ("id_grupo_alternativas_b2c") REFERENCES "finanzas"."grupo_alternativas_b2c"("id_grupo_alternativas_b2c") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_historial_seleccion_anterior" FOREIGN KEY ("id_alternativa_anterior") REFERENCES "finanzas"."alternativa_b2c"("id_alternativa_b2c") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_historial_seleccion_nueva" FOREIGN KEY ("id_alternativa_nueva") REFERENCES "finanzas"."alternativa_b2c"("id_alternativa_b2c") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_historial_seleccion_actor" FOREIGN KEY ("actor_id") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "ck_historial_seleccion_revision" CHECK ("revision_grupo" > 0),
  CONSTRAINT "ck_historial_seleccion_cambio" CHECK ("id_alternativa_anterior" IS DISTINCT FROM "id_alternativa_nueva")
);
CREATE INDEX "idx_historial_seleccion_fecha" ON "finanzas"."historial_seleccion_alternativa_b2c" ("id_grupo_alternativas_b2c","fecha");
CREATE TRIGGER "tr_historial_seleccion_inmutable" BEFORE UPDATE OR DELETE ON "finanzas"."historial_seleccion_alternativa_b2c" FOR EACH ROW EXECUTE FUNCTION "finanzas"."bloquear_historial_alternativa_b2c"();
