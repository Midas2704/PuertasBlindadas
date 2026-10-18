ALTER TABLE "finanzas"."cotizacion_version"
  ADD COLUMN "numero_version_comercial" INTEGER,
  ADD COLUMN "tipo_version" VARCHAR(30),
  ADD COLUMN "snapshot_comercial" JSONB,
  ADD COLUMN "id_documento_logico" BIGINT,
  ADD COLUMN "estado_documental" VARCHAR(30),
  ADD COLUMN "usuario_id_usuario" BIGINT,
  ADD COLUMN "clave_idempotencia" VARCHAR(160),
  ADD CONSTRAINT "fk_cotizacion_version_documento" FOREIGN KEY ("id_documento_logico") REFERENCES "finanzas"."documento_logico"("id_documento_logico") ON DELETE RESTRICT ON UPDATE NO ACTION,
  ADD CONSTRAINT "fk_cotizacion_version_actor" FOREIGN KEY ("usuario_id_usuario") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION,
  ADD CONSTRAINT "ck_cotizacion_version_numero_comercial" CHECK ("numero_version_comercial" IS NULL OR "numero_version_comercial" > 0),
  ADD CONSTRAINT "ck_cotizacion_version_tipo" CHECK ("tipo_version" IS NULL OR "tipo_version" IN ('BORRADOR','EMISION','RECTIFICACION')),
  ADD CONSTRAINT "ck_cotizacion_version_estado_documental" CHECK ("estado_documental" IS NULL OR "estado_documental" IN ('PENDIENTE_DOCUMENTO','DISPONIBLE','ERROR','REEMPLAZADA')),
  ADD CONSTRAINT "ck_cotizacion_version_contrato_comercial" CHECK (
    ("numero_version_comercial" IS NULL AND "tipo_version" IS NULL AND "snapshot_comercial" IS NULL AND "estado_documental" IS NULL AND "usuario_id_usuario" IS NULL AND "clave_idempotencia" IS NULL)
    OR
    ("numero_version_comercial" IS NOT NULL AND "tipo_version" IS NOT NULL AND "snapshot_comercial" IS NOT NULL AND "estado_documental" IS NOT NULL AND "usuario_id_usuario" IS NOT NULL AND "clave_idempotencia" IS NOT NULL)
  );

CREATE UNIQUE INDEX "uq_cotizacion_version_comercial" ON "finanzas"."cotizacion_version" ("id_cotizacion","numero_version_comercial") WHERE "numero_version_comercial" IS NOT NULL;
CREATE UNIQUE INDEX "uq_cotizacion_version_documento" ON "finanzas"."cotizacion_version" ("id_documento_logico") WHERE "id_documento_logico" IS NOT NULL;
CREATE UNIQUE INDEX "uq_cotizacion_version_idempotencia" ON "finanzas"."cotizacion_version" ("clave_idempotencia") WHERE "clave_idempotencia" IS NOT NULL;
CREATE INDEX "idx_cotizacion_version_fecha" ON "finanzas"."cotizacion_version" ("id_cotizacion","fecha");
CREATE INDEX "idx_cotizacion_version_estado_documental" ON "finanzas"."cotizacion_version" ("estado_documental");

CREATE TABLE "finanzas"."plantilla_documental_comercial" (
  "id_plantilla_documental" BIGSERIAL PRIMARY KEY,
  "codigo" VARCHAR(60) NOT NULL UNIQUE,
  "nombre" VARCHAR(200) NOT NULL,
  "tipo_documento" VARCHAR(30) NOT NULL,
  "segmento" VARCHAR(20) NOT NULL,
  "estado" VARCHAR(20) NOT NULL DEFAULT 'ACTIVA',
  "revision" INTEGER NOT NULL DEFAULT 1,
  "creado_por" BIGINT NOT NULL,
  "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_plantilla_documental_creador" FOREIGN KEY ("creado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "ck_plantilla_documental_tipo" CHECK ("tipo_documento" IN ('COTIZACION','CARTA_GENERAL')),
  CONSTRAINT "ck_plantilla_documental_segmento" CHECK ("segmento" IN ('B2B','B2C','CARTA_B2C')),
  CONSTRAINT "ck_plantilla_documental_coherencia" CHECK (("tipo_documento" = 'COTIZACION' AND "segmento" IN ('B2B','B2C')) OR ("tipo_documento" = 'CARTA_GENERAL' AND "segmento" = 'CARTA_B2C')),
  CONSTRAINT "ck_plantilla_documental_estado" CHECK ("estado" IN ('ACTIVA','INACTIVA')),
  CONSTRAINT "ck_plantilla_documental_revision" CHECK ("revision" > 0)
);
CREATE INDEX "idx_plantilla_documental_tipo" ON "finanzas"."plantilla_documental_comercial" ("tipo_documento","segmento","estado");

CREATE TABLE "finanzas"."plantilla_documental_version" (
  "id_plantilla_documental_version" BIGSERIAL PRIMARY KEY,
  "id_plantilla_documental" BIGINT NOT NULL,
  "numero_version" INTEGER NOT NULL,
  "esquema_contenido" JSONB NOT NULL,
  "id_condicion_comercial_version" BIGINT,
  "estado" VARCHAR(20) NOT NULL DEFAULT 'BORRADOR',
  "motivo" TEXT NOT NULL,
  "publicado_por" BIGINT,
  "publicado_en" TIMESTAMPTZ(6),
  CONSTRAINT "fk_plantilla_documental_version_raiz" FOREIGN KEY ("id_plantilla_documental") REFERENCES "finanzas"."plantilla_documental_comercial"("id_plantilla_documental") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_plantilla_documental_condicion" FOREIGN KEY ("id_condicion_comercial_version") REFERENCES "finanzas"."condicion_comercial_version"("id_condicion_comercial_version") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_plantilla_documental_publicador" FOREIGN KEY ("publicado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "uq_plantilla_documental_version" UNIQUE ("id_plantilla_documental","numero_version"),
  CONSTRAINT "ck_plantilla_documental_version_numero" CHECK ("numero_version" > 0),
  CONSTRAINT "ck_plantilla_documental_version_estado" CHECK ("estado" IN ('BORRADOR','PUBLICADA','ARCHIVADA')),
  CONSTRAINT "ck_plantilla_documental_version_publicacion" CHECK (("estado" = 'BORRADOR' AND "publicado_por" IS NULL AND "publicado_en" IS NULL) OR ("estado" <> 'BORRADOR' AND "publicado_por" IS NOT NULL AND "publicado_en" IS NOT NULL))
);
CREATE INDEX "idx_plantilla_documental_version_estado" ON "finanzas"."plantilla_documental_version" ("id_plantilla_documental","estado");

CREATE TABLE "finanzas"."carta_comercial_b2c" (
  "id_carta_comercial_b2c" BIGSERIAL PRIMARY KEY,
  "codigo" VARCHAR(60) NOT NULL UNIQUE,
  "titulo" VARCHAR(200) NOT NULL,
  "contenido_borrador" JSONB NOT NULL,
  "estado" VARCHAR(20) NOT NULL DEFAULT 'BORRADOR',
  "revision" INTEGER NOT NULL DEFAULT 1,
  "creado_por" BIGINT NOT NULL,
  "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_carta_b2c_creador" FOREIGN KEY ("creado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "ck_carta_b2c_estado" CHECK ("estado" IN ('BORRADOR','PUBLICADA','INACTIVA')),
  CONSTRAINT "ck_carta_b2c_revision" CHECK ("revision" > 0)
);
CREATE INDEX "idx_carta_b2c_estado" ON "finanzas"."carta_comercial_b2c" ("estado","actualizado_en");

CREATE TABLE "finanzas"."carta_comercial_b2c_version" (
  "id_carta_comercial_b2c_version" BIGSERIAL PRIMARY KEY,
  "id_carta_comercial_b2c" BIGINT NOT NULL,
  "numero_version" INTEGER NOT NULL,
  "id_plantilla_documental_version" BIGINT NOT NULL,
  "id_condicion_comercial_version" BIGINT,
  "snapshot_publicacion" JSONB NOT NULL,
  "id_documento_logico" BIGINT,
  "estado_documental" VARCHAR(30) NOT NULL DEFAULT 'PENDIENTE_DOCUMENTO',
  "clave_idempotencia" VARCHAR(160) NOT NULL UNIQUE,
  "motivo" TEXT NOT NULL,
  "publicado_por" BIGINT NOT NULL,
  "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "confirmado_en" TIMESTAMPTZ(6),
  CONSTRAINT "fk_carta_b2c_version_raiz" FOREIGN KEY ("id_carta_comercial_b2c") REFERENCES "finanzas"."carta_comercial_b2c"("id_carta_comercial_b2c") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_carta_b2c_version_plantilla" FOREIGN KEY ("id_plantilla_documental_version") REFERENCES "finanzas"."plantilla_documental_version"("id_plantilla_documental_version") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_carta_b2c_version_condicion" FOREIGN KEY ("id_condicion_comercial_version") REFERENCES "finanzas"."condicion_comercial_version"("id_condicion_comercial_version") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_carta_b2c_version_documento" FOREIGN KEY ("id_documento_logico") REFERENCES "finanzas"."documento_logico"("id_documento_logico") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_carta_b2c_version_publicador" FOREIGN KEY ("publicado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "uq_carta_b2c_version" UNIQUE ("id_carta_comercial_b2c","numero_version"),
  CONSTRAINT "uq_carta_b2c_version_documento" UNIQUE ("id_documento_logico"),
  CONSTRAINT "ck_carta_b2c_version_numero" CHECK ("numero_version" > 0),
  CONSTRAINT "ck_carta_b2c_version_estado" CHECK ("estado_documental" IN ('PENDIENTE_DOCUMENTO','DISPONIBLE','ERROR','RETIRADA')),
  CONSTRAINT "ck_carta_b2c_version_confirmacion" CHECK (("estado_documental" = 'DISPONIBLE' AND "id_documento_logico" IS NOT NULL AND "confirmado_en" IS NOT NULL) OR "estado_documental" <> 'DISPONIBLE')
);
CREATE INDEX "idx_carta_b2c_version_estado" ON "finanzas"."carta_comercial_b2c_version" ("id_carta_comercial_b2c","estado_documental");

CREATE TABLE "finanzas"."carta_comercial_b2c_version_producto" (
  "id_carta_version_producto" BIGSERIAL PRIMARY KEY,
  "id_carta_comercial_b2c_version" BIGINT NOT NULL,
  "id_producto_comercial_version" INTEGER NOT NULL,
  "id_precio_producto_comercial" BIGINT NOT NULL,
  "orden_presentacion" INTEGER NOT NULL,
  "snapshot_producto" JSONB NOT NULL,
  CONSTRAINT "fk_carta_b2c_producto_version_carta" FOREIGN KEY ("id_carta_comercial_b2c_version") REFERENCES "finanzas"."carta_comercial_b2c_version"("id_carta_comercial_b2c_version") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_carta_b2c_producto_version_producto" FOREIGN KEY ("id_producto_comercial_version") REFERENCES "finanzas"."producto_comercial_version"("id_producto_comercial_version") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_carta_b2c_producto_version_precio" FOREIGN KEY ("id_precio_producto_comercial") REFERENCES "finanzas"."precio_producto_comercial"("id_precio_producto_comercial") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "uq_carta_b2c_version_producto" UNIQUE ("id_carta_comercial_b2c_version","id_producto_comercial_version"),
  CONSTRAINT "uq_carta_b2c_version_orden" UNIQUE ("id_carta_comercial_b2c_version","orden_presentacion"),
  CONSTRAINT "ck_carta_b2c_producto_orden" CHECK ("orden_presentacion" >= 0)
);

CREATE TABLE "finanzas"."carta_comercial_b2c_version_fotografia" (
  "id_carta_version_fotografia" BIGSERIAL PRIMARY KEY,
  "id_carta_comercial_b2c_version" BIGINT NOT NULL,
  "id_producto_comercial_documento" BIGINT NOT NULL,
  "id_version_documento" BIGINT NOT NULL,
  "orden_presentacion" INTEGER NOT NULL,
  CONSTRAINT "fk_carta_b2c_fotografia_version_carta" FOREIGN KEY ("id_carta_comercial_b2c_version") REFERENCES "finanzas"."carta_comercial_b2c_version"("id_carta_comercial_b2c_version") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_carta_b2c_fotografia_asociacion" FOREIGN KEY ("id_producto_comercial_documento") REFERENCES "finanzas"."producto_comercial_documento"("id_producto_comercial_documento") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_carta_b2c_fotografia_documento" FOREIGN KEY ("id_version_documento") REFERENCES "finanzas"."version_documento"("id_version_documento") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "uq_carta_b2c_version_fotografia" UNIQUE ("id_carta_comercial_b2c_version","id_producto_comercial_documento","id_version_documento"),
  CONSTRAINT "ck_carta_b2c_fotografia_orden" CHECK ("orden_presentacion" >= 0)
);
CREATE INDEX "idx_carta_b2c_fotografia_orden" ON "finanzas"."carta_comercial_b2c_version_fotografia" ("id_carta_comercial_b2c_version","orden_presentacion");

CREATE OR REPLACE FUNCTION "finanzas"."validar_documento_disponible"("documento_id" BIGINT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM "finanzas"."documento_logico" d
    JOIN "finanzas"."version_documento" v
      ON v."id_documento_logico" = d."id_documento_logico"
     AND v."numero_version" = d."numero_version_actual"
    WHERE d."id_documento_logico" = "documento_id"
      AND d."estado" = 'ACTIVO'
      AND v."estado" = 'DISPONIBLE'
  );
$$;

CREATE OR REPLACE FUNCTION "finanzas"."validar_publicacion_documental"()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW."estado_documental" = 'DISPONIBLE' AND NOT "finanzas"."validar_documento_disponible"(NEW."id_documento_logico") THEN
    RAISE EXCEPTION 'El documento no tiene una versión confirmada y disponible';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER "tr_cotizacion_version_documento_disponible"
BEFORE INSERT OR UPDATE OF "estado_documental","id_documento_logico"
ON "finanzas"."cotizacion_version"
FOR EACH ROW
WHEN (NEW."estado_documental" = 'DISPONIBLE')
EXECUTE FUNCTION "finanzas"."validar_publicacion_documental"();

CREATE TRIGGER "tr_carta_b2c_documento_disponible"
BEFORE INSERT OR UPDATE OF "estado_documental","id_documento_logico"
ON "finanzas"."carta_comercial_b2c_version"
FOR EACH ROW
WHEN (NEW."estado_documental" = 'DISPONIBLE')
EXECUTE FUNCTION "finanzas"."validar_publicacion_documental"();

CREATE OR REPLACE FUNCTION "finanzas"."bloquear_version_publicada"()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  estado_anterior TEXT := COALESCE(to_jsonb(OLD)->>'estado_documental', to_jsonb(OLD)->>'estado');
BEGIN
  IF (TG_TABLE_NAME IN ('plantilla_documental_version','condicion_comercial_version') AND estado_anterior IN ('PUBLICADA','ARCHIVADA'))
     OR (TG_TABLE_NAME = 'carta_comercial_b2c_version' AND estado_anterior IN ('DISPONIBLE','RETIRADA'))
     OR (TG_TABLE_NAME = 'cotizacion_version' AND estado_anterior IN ('DISPONIBLE','REEMPLAZADA')) THEN
    RAISE EXCEPTION 'La versión publicada es inmutable';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER "tr_plantilla_documental_version_inmutable"
BEFORE UPDATE OR DELETE ON "finanzas"."plantilla_documental_version"
FOR EACH ROW EXECUTE FUNCTION "finanzas"."bloquear_version_publicada"();

CREATE TRIGGER "tr_condicion_comercial_version_inmutable"
BEFORE UPDATE OR DELETE ON "finanzas"."condicion_comercial_version"
FOR EACH ROW EXECUTE FUNCTION "finanzas"."bloquear_version_publicada"();

CREATE TRIGGER "tr_carta_b2c_version_inmutable"
BEFORE UPDATE OR DELETE ON "finanzas"."carta_comercial_b2c_version"
FOR EACH ROW EXECUTE FUNCTION "finanzas"."bloquear_version_publicada"();

CREATE TRIGGER "tr_cotizacion_version_comercial_inmutable"
BEFORE UPDATE OR DELETE ON "finanzas"."cotizacion_version"
FOR EACH ROW
WHEN (OLD."numero_version_comercial" IS NOT NULL)
EXECUTE FUNCTION "finanzas"."bloquear_version_publicada"();

CREATE OR REPLACE FUNCTION "finanzas"."validar_fotografia_carta_b2c"()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM "finanzas"."producto_comercial_documento" pcd
    JOIN "finanzas"."version_documento" vd
      ON vd."id_version_documento" = NEW."id_version_documento"
     AND vd."id_documento_logico" = pcd."id_documento_logico"
    WHERE pcd."id_producto_comercial_documento" = NEW."id_producto_comercial_documento"
      AND pcd."tipo_documento" = 'FOTOGRAFIA_COMERCIAL'
      AND pcd."habilitado_b2c" = TRUE
      AND pcd."estado" = 'ACTIVO'
      AND vd."estado" = 'DISPONIBLE'
  ) THEN
    RAISE EXCEPTION 'La fotografía no está autorizada y disponible para publicación B2C';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER "tr_carta_b2c_fotografia_autorizada"
BEFORE INSERT OR UPDATE OF "id_producto_comercial_documento","id_version_documento"
ON "finanzas"."carta_comercial_b2c_version_fotografia"
FOR EACH ROW EXECUTE FUNCTION "finanzas"."validar_fotografia_carta_b2c"();

CREATE OR REPLACE FUNCTION "finanzas"."validar_producto_carta_b2c"()
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
      AND pp."id_extension_producto_comercial" = pv."id_extension_producto_comercial"
      AND pp."segmento_comercial" = 'B2C'
      AND pp."estado" = 'ACTIVO'
  ) THEN
    RAISE EXCEPTION 'Producto, versión y precio no forman una publicación B2C coherente';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER "tr_carta_b2c_producto_coherente"
BEFORE INSERT OR UPDATE OF "id_producto_comercial_version","id_precio_producto_comercial"
ON "finanzas"."carta_comercial_b2c_version_producto"
FOR EACH ROW EXECUTE FUNCTION "finanzas"."validar_producto_carta_b2c"();

CREATE OR REPLACE FUNCTION "finanzas"."bloquear_detalle_publicacion_carta_b2c"()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  version_id BIGINT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    version_id := NEW."id_carta_comercial_b2c_version";
  ELSE
    version_id := OLD."id_carta_comercial_b2c_version";
  END IF;
  IF EXISTS (
    SELECT 1 FROM "finanzas"."carta_comercial_b2c_version" cv
    WHERE cv."id_carta_comercial_b2c_version" = version_id
      AND cv."estado_documental" IN ('DISPONIBLE','RETIRADA')
  ) THEN
    RAISE EXCEPTION 'El contenido de una carta B2C publicada es inmutable';
  END IF;
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER "tr_carta_b2c_producto_inmutable"
BEFORE INSERT OR UPDATE OR DELETE ON "finanzas"."carta_comercial_b2c_version_producto"
FOR EACH ROW EXECUTE FUNCTION "finanzas"."bloquear_detalle_publicacion_carta_b2c"();

CREATE TRIGGER "tr_carta_b2c_fotografia_inmutable"
BEFORE INSERT OR UPDATE OR DELETE ON "finanzas"."carta_comercial_b2c_version_fotografia"
FOR EACH ROW EXECUTE FUNCTION "finanzas"."bloquear_detalle_publicacion_carta_b2c"();

CREATE OR REPLACE FUNCTION "finanzas"."exigir_documento_cotizacion_emitida"()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW."segmento_comercial" IS NOT NULL
     AND NEW."estado_cotizacion" = 'emitida'
     AND OLD."estado_cotizacion" IS DISTINCT FROM NEW."estado_cotizacion"
     AND NOT EXISTS (
       SELECT 1 FROM "finanzas"."cotizacion_version" cv
       WHERE cv."id_cotizacion" = NEW."id_cotizacion"
         AND cv."tipo_version" IN ('EMISION','RECTIFICACION')
         AND cv."estado_documental" = 'DISPONIBLE'
     ) THEN
    RAISE EXCEPTION 'La cotización no puede emitirse sin PDF documental confirmado';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER "tr_cotizacion_exigir_documento_emitido"
BEFORE UPDATE OF "estado_cotizacion" ON "finanzas"."cotizacion"
FOR EACH ROW EXECUTE FUNCTION "finanzas"."exigir_documento_cotizacion_emitida"();
