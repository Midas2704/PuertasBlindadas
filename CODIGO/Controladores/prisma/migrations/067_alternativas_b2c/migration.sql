CREATE TABLE "finanzas"."grupo_alternativas_b2c" (
  "id_grupo_alternativas_b2c" BIGSERIAL PRIMARY KEY,
  "id_cotizacion" INTEGER NOT NULL,
  "numero_grupo" INTEGER NOT NULL,
  "titulo" VARCHAR(200),
  "estado" VARCHAR(20) NOT NULL DEFAULT 'ABIERTO',
  "revision" INTEGER NOT NULL DEFAULT 1,
  "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_grupo_alternativas_b2c_cotizacion" FOREIGN KEY ("id_cotizacion") REFERENCES "finanzas"."cotizacion"("id_cotizacion") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "uq_grupo_alternativas_b2c_numero" UNIQUE ("id_cotizacion","numero_grupo"),
  CONSTRAINT "ck_grupo_alternativas_b2c_numero" CHECK ("numero_grupo" > 0),
  CONSTRAINT "ck_grupo_alternativas_b2c_estado" CHECK ("estado" IN ('ABIERTO','DECIDIDO','CANCELADO')),
  CONSTRAINT "ck_grupo_alternativas_b2c_revision" CHECK ("revision" > 0)
);
CREATE INDEX "idx_grupo_alternativas_b2c_estado" ON "finanzas"."grupo_alternativas_b2c" ("id_cotizacion","estado");

CREATE TABLE "finanzas"."alternativa_b2c" (
  "id_alternativa_b2c" BIGSERIAL PRIMARY KEY,
  "id_grupo_alternativas_b2c" BIGINT NOT NULL,
  "numero_alternativa" INTEGER NOT NULL,
  "id_extension_producto_comercial" INTEGER NOT NULL,
  "id_producto_comercial_version" INTEGER NOT NULL,
  "id_precio_producto_comercial" BIGINT NOT NULL,
  "id_moneda" INTEGER NOT NULL,
  "id_condicion_comercial_version" BIGINT,
  "id_tarifa_instalacion_comercial" BIGINT,
  "cantidad" INTEGER NOT NULL DEFAULT 1,
  "configuracion_snapshot" JSONB NOT NULL,
  "precio_unitario" DECIMAL(14,2) NOT NULL,
  "precio_instalacion" DECIMAL(14,2),
  "monto_neto" DECIMAL(14,2) NOT NULL,
  "monto_impuesto" DECIMAL(14,2) NOT NULL,
  "monto_total" DECIMAL(14,2) NOT NULL,
  "estado" VARCHAR(20) NOT NULL DEFAULT 'PROPUESTA',
  "decidida_en" TIMESTAMPTZ(6),
  "decidida_por" BIGINT,
  "motivo_decision" TEXT,
  "revision" INTEGER NOT NULL DEFAULT 1,
  "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_alternativa_b2c_grupo" FOREIGN KEY ("id_grupo_alternativas_b2c") REFERENCES "finanzas"."grupo_alternativas_b2c"("id_grupo_alternativas_b2c") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_alternativa_b2c_producto" FOREIGN KEY ("id_extension_producto_comercial") REFERENCES "finanzas"."extension_producto_comercial"("id_extension_producto_comercial") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_alternativa_b2c_producto_version" FOREIGN KEY ("id_producto_comercial_version") REFERENCES "finanzas"."producto_comercial_version"("id_producto_comercial_version") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_alternativa_b2c_precio" FOREIGN KEY ("id_precio_producto_comercial") REFERENCES "finanzas"."precio_producto_comercial"("id_precio_producto_comercial") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_alternativa_b2c_moneda" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_alternativa_b2c_condicion" FOREIGN KEY ("id_condicion_comercial_version") REFERENCES "finanzas"."condicion_comercial_version"("id_condicion_comercial_version") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_alternativa_b2c_tarifa_instalacion" FOREIGN KEY ("id_tarifa_instalacion_comercial") REFERENCES "finanzas"."tarifa_instalacion_comercial"("id_tarifa_instalacion_comercial") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_alternativa_b2c_decisor" FOREIGN KEY ("decidida_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "uq_alternativa_b2c_numero" UNIQUE ("id_grupo_alternativas_b2c","numero_alternativa"),
  CONSTRAINT "ck_alternativa_b2c_numero" CHECK ("numero_alternativa" > 0),
  CONSTRAINT "ck_alternativa_b2c_cantidad" CHECK ("cantidad" > 0),
  CONSTRAINT "ck_alternativa_b2c_precios" CHECK ("precio_unitario" > 0 AND ("precio_instalacion" IS NULL OR "precio_instalacion" > 0) AND "monto_neto" > 0 AND "monto_impuesto" >= 0 AND "monto_total" = "monto_neto" + "monto_impuesto"),
  CONSTRAINT "ck_alternativa_b2c_estado" CHECK ("estado" IN ('PROPUESTA','ACEPTADA','RECHAZADA','RETIRADA')),
  CONSTRAINT "ck_alternativa_b2c_decision" CHECK (("estado" = 'PROPUESTA' AND "decidida_en" IS NULL AND "decidida_por" IS NULL AND "motivo_decision" IS NULL) OR ("estado" <> 'PROPUESTA' AND "decidida_en" IS NOT NULL AND "decidida_por" IS NOT NULL AND "motivo_decision" IS NOT NULL)),
  CONSTRAINT "ck_alternativa_b2c_revision" CHECK ("revision" > 0)
);
CREATE UNIQUE INDEX "uq_alternativa_b2c_aceptada_grupo" ON "finanzas"."alternativa_b2c" ("id_grupo_alternativas_b2c") WHERE "estado" = 'ACEPTADA';
CREATE INDEX "idx_alternativa_b2c_estado" ON "finanzas"."alternativa_b2c" ("id_grupo_alternativas_b2c","estado");
CREATE INDEX "idx_alternativa_b2c_producto_version" ON "finanzas"."alternativa_b2c" ("id_extension_producto_comercial","id_producto_comercial_version");

CREATE TABLE "finanzas"."alternativa_b2c_opcional" (
  "id_alternativa_b2c_opcional" BIGSERIAL PRIMARY KEY,
  "id_alternativa_b2c" BIGINT NOT NULL,
  "id_compatibilidad_opcional" BIGINT NOT NULL,
  "id_precio_opcional_comercial" BIGINT NOT NULL,
  "cantidad" INTEGER NOT NULL DEFAULT 1,
  "precio_unitario" DECIMAL(14,2) NOT NULL,
  "snapshot_opcional" JSONB NOT NULL,
  CONSTRAINT "fk_alternativa_b2c_opcional_alternativa" FOREIGN KEY ("id_alternativa_b2c") REFERENCES "finanzas"."alternativa_b2c"("id_alternativa_b2c") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_alternativa_b2c_opcional_compatibilidad" FOREIGN KEY ("id_compatibilidad_opcional") REFERENCES "finanzas"."compatibilidad_opcional_producto"("id_compatibilidad_opcional") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_alternativa_b2c_opcional_precio" FOREIGN KEY ("id_precio_opcional_comercial") REFERENCES "finanzas"."precio_opcional_comercial"("id_precio_opcional_comercial") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "uq_alternativa_b2c_opcional" UNIQUE ("id_alternativa_b2c","id_compatibilidad_opcional"),
  CONSTRAINT "ck_alternativa_b2c_opcional_cantidad" CHECK ("cantidad" > 0),
  CONSTRAINT "ck_alternativa_b2c_opcional_precio" CHECK ("precio_unitario" > 0)
);

CREATE TABLE "finanzas"."historial_decision_alternativa_b2c" (
  "id_historial_decision" BIGSERIAL PRIMARY KEY,
  "id_alternativa_b2c" BIGINT NOT NULL,
  "estado_anterior" VARCHAR(20),
  "estado_nuevo" VARCHAR(20) NOT NULL,
  "motivo" TEXT NOT NULL,
  "actor_id" BIGINT NOT NULL,
  "fecha" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_historial_alternativa_b2c_alternativa" FOREIGN KEY ("id_alternativa_b2c") REFERENCES "finanzas"."alternativa_b2c"("id_alternativa_b2c") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_historial_alternativa_b2c_actor" FOREIGN KEY ("actor_id") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "ck_historial_alternativa_b2c_anterior" CHECK ("estado_anterior" IS NULL OR "estado_anterior" IN ('PROPUESTA','ACEPTADA','RECHAZADA','RETIRADA')),
  CONSTRAINT "ck_historial_alternativa_b2c_nuevo" CHECK ("estado_nuevo" IN ('PROPUESTA','ACEPTADA','RECHAZADA','RETIRADA'))
);
CREATE INDEX "idx_historial_alternativa_b2c_fecha" ON "finanzas"."historial_decision_alternativa_b2c" ("id_alternativa_b2c","fecha");

ALTER TABLE "finanzas"."detalle_cotizacion"
  ADD COLUMN "id_alternativa_b2c_aceptada" BIGINT,
  ADD CONSTRAINT "uq_detalle_cotizacion_alternativa_aceptada" UNIQUE ("id_alternativa_b2c_aceptada"),
  ADD CONSTRAINT "fk_detalle_cotizacion_alternativa_aceptada" FOREIGN KEY ("id_alternativa_b2c_aceptada") REFERENCES "finanzas"."alternativa_b2c"("id_alternativa_b2c") ON DELETE RESTRICT ON UPDATE NO ACTION;

CREATE OR REPLACE FUNCTION "finanzas"."validar_grupo_alternativas_b2c"()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE segmento VARCHAR(3);
BEGIN
  SELECT c."segmento_comercial" INTO segmento
  FROM "finanzas"."cotizacion" c
  WHERE c."id_cotizacion" = NEW."id_cotizacion";
  IF segmento IS DISTINCT FROM 'B2C' THEN
    RAISE EXCEPTION 'Las alternativas sólo pueden asociarse a una cotización B2C explícita';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER "tr_grupo_alternativas_exige_b2c"
BEFORE INSERT OR UPDATE OF "id_cotizacion" ON "finanzas"."grupo_alternativas_b2c"
FOR EACH ROW EXECUTE FUNCTION "finanzas"."validar_grupo_alternativas_b2c"();

CREATE OR REPLACE FUNCTION "finanzas"."validar_alternativa_b2c"()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM "finanzas"."producto_comercial_version" pv
    JOIN "finanzas"."precio_producto_comercial" pp
      ON pp."id_precio_producto_comercial" = NEW."id_precio_producto_comercial"
    WHERE pv."id_producto_comercial_version" = NEW."id_producto_comercial_version"
      AND pv."id_extension_producto_comercial" = NEW."id_extension_producto_comercial"
      AND pp."id_extension_producto_comercial" = NEW."id_extension_producto_comercial"
      AND pp."segmento_comercial" = 'B2C'
      AND pp."id_moneda" = NEW."id_moneda"
      AND pp."monto" = NEW."precio_unitario"
      AND pp."estado" = 'ACTIVO'
  ) THEN
    RAISE EXCEPTION 'Producto, versión, precio y moneda no forman una alternativa B2C coherente';
  END IF;
  IF NEW."id_tarifa_instalacion_comercial" IS NULL AND NEW."precio_instalacion" IS NOT NULL THEN
    RAISE EXCEPTION 'Un precio de instalación requiere una tarifa comercial trazable';
  END IF;
  IF NEW."id_tarifa_instalacion_comercial" IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM "finanzas"."tarifa_instalacion_comercial" ti
    WHERE ti."id_tarifa_instalacion_comercial" = NEW."id_tarifa_instalacion_comercial"
      AND ti."id_moneda" = NEW."id_moneda"
      AND ti."estado" = 'ACTIVA'
      AND (
        (NEW."precio_instalacion" IS NULL AND ti."precio_comercial" IS NULL)
        OR ti."precio_comercial" = NEW."precio_instalacion"
      )
  ) THEN
    RAISE EXCEPTION 'La tarifa de instalación no coincide con la moneda y el precio conservados';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER "tr_alternativa_b2c_integridad"
BEFORE INSERT OR UPDATE OF "id_extension_producto_comercial","id_producto_comercial_version","id_precio_producto_comercial","id_moneda","precio_unitario","id_tarifa_instalacion_comercial","precio_instalacion"
ON "finanzas"."alternativa_b2c"
FOR EACH ROW EXECUTE FUNCTION "finanzas"."validar_alternativa_b2c"();

CREATE OR REPLACE FUNCTION "finanzas"."validar_opcional_alternativa_b2c"()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM "finanzas"."alternativa_b2c" a
    JOIN "finanzas"."compatibilidad_opcional_producto" co
      ON co."id_compatibilidad_opcional" = NEW."id_compatibilidad_opcional"
    JOIN "finanzas"."precio_opcional_comercial" po
      ON po."id_precio_opcional_comercial" = NEW."id_precio_opcional_comercial"
    WHERE a."id_alternativa_b2c" = NEW."id_alternativa_b2c"
      AND co."id_extension_producto_comercial" = a."id_extension_producto_comercial"
      AND co."id_opcional_comercial" = po."id_opcional_comercial"
      AND co."habilitado_b2c" = TRUE
      AND co."estado" = 'ACTIVA'
      AND po."segmento_comercial" = 'B2C'
      AND po."id_moneda" = a."id_moneda"
      AND po."monto" = NEW."precio_unitario"
      AND po."estado" = 'ACTIVO'
  ) THEN
    RAISE EXCEPTION 'El opcional no es compatible, no está habilitado para B2C o usa otra moneda';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER "tr_alternativa_b2c_opcional_integridad"
BEFORE INSERT OR UPDATE ON "finanzas"."alternativa_b2c_opcional"
FOR EACH ROW EXECUTE FUNCTION "finanzas"."validar_opcional_alternativa_b2c"();

CREATE OR REPLACE FUNCTION "finanzas"."validar_detalle_desde_alternativa_b2c"()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW."id_alternativa_b2c_aceptada" IS NOT NULL AND NOT EXISTS (
    SELECT 1
    FROM "finanzas"."alternativa_b2c" a
    JOIN "finanzas"."grupo_alternativas_b2c" g ON g."id_grupo_alternativas_b2c" = a."id_grupo_alternativas_b2c"
    WHERE a."id_alternativa_b2c" = NEW."id_alternativa_b2c_aceptada"
      AND a."estado" = 'ACEPTADA'
      AND g."id_cotizacion" = NEW."id_cotizacion"
      AND a."id_extension_producto_comercial" = NEW."id_extension_producto_comercial"
      AND a."id_producto_comercial_version" = NEW."id_producto_comercial_version"
      AND a."id_precio_producto_comercial" = NEW."id_precio_producto_comercial"
  ) THEN
    RAISE EXCEPTION 'Sólo una alternativa aceptada y coherente puede transformarse en detalle contratado';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER "tr_detalle_cotizacion_alternativa_aceptada"
BEFORE INSERT OR UPDATE OF "id_alternativa_b2c_aceptada","id_cotizacion","id_extension_producto_comercial","id_producto_comercial_version","id_precio_producto_comercial"
ON "finanzas"."detalle_cotizacion"
FOR EACH ROW EXECUTE FUNCTION "finanzas"."validar_detalle_desde_alternativa_b2c"();

CREATE OR REPLACE FUNCTION "finanzas"."bloquear_historial_alternativa_b2c"()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'El historial de decisiones B2C es inmutable';
END;
$$;

CREATE TRIGGER "tr_historial_alternativa_b2c_inmutable"
BEFORE UPDATE OR DELETE ON "finanzas"."historial_decision_alternativa_b2c"
FOR EACH ROW EXECUTE FUNCTION "finanzas"."bloquear_historial_alternativa_b2c"();
