-- Bloque 4.2: núcleo documental portable. No almacena binarios ni activa proveedores externos.

CREATE TABLE "finanzas"."documento_logico" (
  "id_documento_logico" BIGSERIAL PRIMARY KEY,
  "titulo" VARCHAR(200) NOT NULL,
  "clasificacion" VARCHAR(60) NOT NULL,
  "estado" VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
  "es_historico" BOOLEAN NOT NULL DEFAULT FALSE,
  "numero_version_actual" INTEGER,
  "id_configuracion_conservacion" INTEGER,
  "creado_por" BIGINT NOT NULL,
  "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "desactivado_en" TIMESTAMPTZ(6),
  "motivo_desactivacion" TEXT,
  "revision" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "chk_documento_logico_estado" CHECK ("estado" IN ('ACTIVO','INACTIVO','ARCHIVADO')),
  CONSTRAINT "chk_documento_logico_revision" CHECK ("revision" > 0),
  CONSTRAINT "chk_documento_logico_version_actual" CHECK ("numero_version_actual" IS NULL OR "numero_version_actual" > 0),
  CONSTRAINT "chk_documento_logico_desactivacion" CHECK (("estado" = 'ACTIVO' AND "desactivado_en" IS NULL) OR "estado" <> 'ACTIVO'),
  CONSTRAINT "fk_documento_logico_conservacion" FOREIGN KEY ("id_configuracion_conservacion") REFERENCES "finanzas"."configuracion_conservacion_documental"("id_configuracion_conservacion") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_documento_logico_creador" FOREIGN KEY ("creado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION
);

CREATE INDEX "idx_documento_logico_clasificacion_estado" ON "finanzas"."documento_logico" ("clasificacion", "estado", "creado_en");
CREATE INDEX "idx_documento_logico_conservacion" ON "finanzas"."documento_logico" ("id_configuracion_conservacion");

CREATE TABLE "finanzas"."version_documento" (
  "id_version_documento" BIGSERIAL PRIMARY KEY,
  "id_documento_logico" BIGINT NOT NULL,
  "numero_version" INTEGER NOT NULL,
  "proveedor_logico" VARCHAR(20) NOT NULL,
  "contenedor_logico" VARCHAR(80) NOT NULL,
  "clave_objeto" VARCHAR(700) NOT NULL,
  "version_proveedor" VARCHAR(300),
  "nombre_original" VARCHAR(255) NOT NULL,
  "nombre_seguro" VARCHAR(255) NOT NULL,
  "mime_declarado" VARCHAR(150) NOT NULL,
  "mime_detectado" VARCHAR(150),
  "tamano_bytes" BIGINT NOT NULL,
  "sha256" CHAR(64),
  "estado" VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
  "creado_por" BIGINT NOT NULL,
  "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "validado_en" TIMESTAMPTZ(6),
  "id_version_reemplazada" BIGINT UNIQUE,
  "resultado_validaciones" JSONB,
  "revision" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "uq_version_documento_numero" UNIQUE ("id_documento_logico", "numero_version"),
  CONSTRAINT "uq_version_documento_objeto" UNIQUE ("proveedor_logico", "contenedor_logico", "clave_objeto"),
  CONSTRAINT "chk_version_documento_numero" CHECK ("numero_version" > 0),
  CONSTRAINT "chk_version_documento_proveedor" CHECK ("proveedor_logico" IN ('R2','S3')),
  CONSTRAINT "chk_version_documento_contenedor" CHECK ("contenedor_logico" ~ '^[a-z0-9][a-z0-9._-]{2,62}$'),
  CONSTRAINT "chk_version_documento_clave_opaca" CHECK ("clave_objeto" ~ '^(objects|quarantine)/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'),
  CONSTRAINT "chk_version_documento_tamano" CHECK ("tamano_bytes" > 0),
  CONSTRAINT "chk_version_documento_sha256" CHECK ("sha256" IS NULL OR "sha256" ~ '^[0-9a-f]{64}$'),
  CONSTRAINT "chk_version_documento_estado" CHECK ("estado" IN ('PENDIENTE','SUBIENDO','VALIDANDO','DISPONIBLE','ERROR','CUARENTENA','REEMPLAZADO','ARCHIVADO')),
  CONSTRAINT "chk_version_documento_disponible" CHECK ("estado" <> 'DISPONIBLE' OR ("sha256" IS NOT NULL AND "mime_detectado" IS NOT NULL AND "validado_en" IS NOT NULL)),
  CONSTRAINT "chk_version_documento_revision" CHECK ("revision" > 0),
  CONSTRAINT "chk_version_documento_no_autorreemplazo" CHECK ("id_version_reemplazada" IS NULL OR "id_version_reemplazada" <> "id_version_documento"),
  CONSTRAINT "fk_version_documento_logico" FOREIGN KEY ("id_documento_logico") REFERENCES "finanzas"."documento_logico"("id_documento_logico") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_version_documento_creador" FOREIGN KEY ("creado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_version_documento_reemplazada" FOREIGN KEY ("id_version_reemplazada") REFERENCES "finanzas"."version_documento"("id_version_documento") ON DELETE RESTRICT ON UPDATE NO ACTION
);

CREATE INDEX "idx_version_documento_historial" ON "finanzas"."version_documento" ("id_documento_logico", "estado", "creado_en");
CREATE INDEX "idx_version_documento_sha256" ON "finanzas"."version_documento" ("sha256");

CREATE TABLE "finanzas"."variante_documento" (
  "id_variante_documento" BIGSERIAL PRIMARY KEY,
  "id_version_original" BIGINT NOT NULL,
  "id_version_derivada" BIGINT NOT NULL UNIQUE,
  "tipo_variante" VARCHAR(30) NOT NULL,
  "parametros_tecnicos" JSONB,
  "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "uq_variante_documento_tipo" UNIQUE ("id_version_original", "tipo_variante"),
  CONSTRAINT "chk_variante_documento_tipo" CHECK ("tipo_variante" IN ('MINIATURA','VISTA_PREVIA','PDF_OPTIMIZADA')),
  CONSTRAINT "chk_variante_documento_distinta" CHECK ("id_version_original" <> "id_version_derivada"),
  CONSTRAINT "fk_variante_documento_original" FOREIGN KEY ("id_version_original") REFERENCES "finanzas"."version_documento"("id_version_documento") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_variante_documento_derivada" FOREIGN KEY ("id_version_derivada") REFERENCES "finanzas"."version_documento"("id_version_documento") ON DELETE RESTRICT ON UPDATE NO ACTION
);

CREATE TABLE "finanzas"."intencion_carga_documental" (
  "id_intencion_carga" BIGSERIAL PRIMARY KEY,
  "id_publico" UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  "usuario_solicitante" BIGINT NOT NULL,
  "clasificacion" VARCHAR(60) NOT NULL,
  "nombre_declarado" VARCHAR(255) NOT NULL,
  "mime_declarado" VARCHAR(150) NOT NULL,
  "tamano_esperado" BIGINT NOT NULL,
  "clave_temporal" VARCHAR(700) NOT NULL UNIQUE,
  "clave_idempotencia" VARCHAR(160) NOT NULL,
  "estado" VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
  "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expira_en" TIMESTAMPTZ(6) NOT NULL,
  "confirmado_en" TIMESTAMPTZ(6),
  "identificador_multipart" VARCHAR(500),
  "cantidad_reintentos" INTEGER NOT NULL DEFAULT 0,
  "codigo_error" VARCHAR(100),
  "revision" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "uq_intencion_documental_idempotencia" UNIQUE ("usuario_solicitante", "clave_idempotencia"),
  CONSTRAINT "chk_intencion_documental_tamano" CHECK ("tamano_esperado" > 0),
  CONSTRAINT "chk_intencion_documental_clave_opaca" CHECK ("clave_temporal" ~ '^tmp/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'),
  CONSTRAINT "chk_intencion_documental_estado" CHECK ("estado" IN ('PENDIENTE','SUBIENDO','VALIDANDO','DISPONIBLE','ERROR','CUARENTENA','EXPIRADA','CANCELADA')),
  CONSTRAINT "chk_intencion_documental_fechas" CHECK ("expira_en" > "creado_en" AND ("confirmado_en" IS NULL OR "confirmado_en" >= "creado_en")),
  CONSTRAINT "chk_intencion_documental_reintentos" CHECK ("cantidad_reintentos" >= 0),
  CONSTRAINT "chk_intencion_documental_revision" CHECK ("revision" > 0),
  CONSTRAINT "fk_intencion_documental_solicitante" FOREIGN KEY ("usuario_solicitante") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION
);

CREATE INDEX "idx_intencion_documental_estado_expira" ON "finanzas"."intencion_carga_documental" ("estado", "expira_en");

CREATE TABLE "finanzas"."producto_comercial_documento" (
  "id_producto_comercial_documento" BIGSERIAL PRIMARY KEY,
  "id_extension_producto_comercial" INTEGER NOT NULL,
  "id_documento_logico" BIGINT NOT NULL,
  "tipo_documento" VARCHAR(40) NOT NULL,
  "orden_presentacion" INTEGER NOT NULL DEFAULT 0,
  "es_imagen_principal" BOOLEAN NOT NULL DEFAULT FALSE,
  "habilitado_b2b" BOOLEAN NOT NULL DEFAULT FALSE,
  "habilitado_b2c" BOOLEAN NOT NULL DEFAULT FALSE,
  "estado" VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
  "asociado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "usuario_responsable" BIGINT NOT NULL,
  "revision" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "uq_producto_documento_asociacion" UNIQUE ("id_extension_producto_comercial", "id_documento_logico", "tipo_documento"),
  CONSTRAINT "chk_producto_documento_tipo" CHECK ("tipo_documento" IN ('FOTOGRAFIA_COMERCIAL','DIAGRAMA_TECNICO','FICHA_TECNICA','CATALOGO','OTRO_AUTORIZADO')),
  CONSTRAINT "chk_producto_documento_estado" CHECK ("estado" IN ('ACTIVO','INACTIVO')),
  CONSTRAINT "chk_producto_documento_orden" CHECK ("orden_presentacion" >= 0),
  CONSTRAINT "chk_producto_documento_revision" CHECK ("revision" > 0),
  CONSTRAINT "chk_producto_documento_principal" CHECK (NOT "es_imagen_principal" OR ("tipo_documento" = 'FOTOGRAFIA_COMERCIAL' AND "estado" = 'ACTIVO')),
  CONSTRAINT "fk_producto_documento_producto" FOREIGN KEY ("id_extension_producto_comercial") REFERENCES "finanzas"."extension_producto_comercial"("id_extension_producto_comercial") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_producto_documento_documento" FOREIGN KEY ("id_documento_logico") REFERENCES "finanzas"."documento_logico"("id_documento_logico") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_producto_documento_responsable" FOREIGN KEY ("usuario_responsable") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION
);

CREATE UNIQUE INDEX "uq_producto_documento_principal_activa" ON "finanzas"."producto_comercial_documento" ("id_extension_producto_comercial") WHERE "es_imagen_principal" AND "estado" = 'ACTIVO';
CREATE INDEX "idx_producto_documento_presentacion" ON "finanzas"."producto_comercial_documento" ("id_extension_producto_comercial", "estado", "orden_presentacion");
CREATE INDEX "idx_producto_documento_documento" ON "finanzas"."producto_comercial_documento" ("id_documento_logico");

CREATE TABLE "finanzas"."evento_operacional_documental" (
  "id_evento_operacional" BIGSERIAL PRIMARY KEY,
  "tipo_evento" VARCHAR(80) NOT NULL,
  "id_documento_logico" BIGINT,
  "id_version_documento" BIGINT,
  "estado" VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
  "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "procesado_en" TIMESTAMPTZ(6),
  "cantidad_intentos" INTEGER NOT NULL DEFAULT 0,
  "proximo_intento_en" TIMESTAMPTZ(6),
  "codigo_error" VARCHAR(100),
  "clave_idempotencia" VARCHAR(180) NOT NULL UNIQUE,
  "payload_tecnico" JSONB,
  CONSTRAINT "chk_evento_documental_estado" CHECK ("estado" IN ('PENDIENTE','PROCESANDO','PROCESADO','ERROR','DESCARTADO')),
  CONSTRAINT "chk_evento_documental_intentos" CHECK ("cantidad_intentos" >= 0),
  CONSTRAINT "fk_evento_documental_documento" FOREIGN KEY ("id_documento_logico") REFERENCES "finanzas"."documento_logico"("id_documento_logico") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_evento_documental_version" FOREIGN KEY ("id_version_documento") REFERENCES "finanzas"."version_documento"("id_version_documento") ON DELETE RESTRICT ON UPDATE NO ACTION
);

CREATE INDEX "idx_evento_documental_pendiente" ON "finanzas"."evento_operacional_documental" ("estado", "proximo_intento_en", "creado_en");
CREATE INDEX "idx_evento_documental_documento" ON "finanzas"."evento_operacional_documental" ("id_documento_logico", "creado_en");

CREATE OR REPLACE FUNCTION "finanzas"."validar_transicion_documento_logico"() RETURNS trigger AS $$
BEGIN
  IF NEW."estado" IS DISTINCT FROM OLD."estado" AND NOT (
    (OLD."estado" = 'ACTIVO' AND NEW."estado" IN ('INACTIVO','ARCHIVADO')) OR
    (OLD."estado" = 'INACTIVO' AND NEW."estado" IN ('ACTIVO','ARCHIVADO'))
  ) THEN
    RAISE EXCEPTION 'Transición documental lógica no permitida: % -> %', OLD."estado", NEW."estado";
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "trg_documento_logico_transicion"
BEFORE UPDATE OF "estado" ON "finanzas"."documento_logico"
FOR EACH ROW EXECUTE FUNCTION "finanzas"."validar_transicion_documento_logico"();

CREATE OR REPLACE FUNCTION "finanzas"."validar_version_documento"() RETURNS trigger AS $$
DECLARE reemplazada RECORD;
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF NEW."estado" IS DISTINCT FROM OLD."estado" AND NOT (
      (OLD."estado" = 'PENDIENTE' AND NEW."estado" IN ('SUBIENDO','ERROR')) OR
      (OLD."estado" = 'SUBIENDO' AND NEW."estado" IN ('VALIDANDO','ERROR')) OR
      (OLD."estado" = 'VALIDANDO' AND NEW."estado" IN ('DISPONIBLE','ERROR','CUARENTENA')) OR
      (OLD."estado" = 'ERROR' AND NEW."estado" = 'PENDIENTE') OR
      (OLD."estado" = 'CUARENTENA' AND NEW."estado" IN ('VALIDANDO','ARCHIVADO')) OR
      (OLD."estado" = 'DISPONIBLE' AND NEW."estado" IN ('REEMPLAZADO','ARCHIVADO')) OR
      (OLD."estado" = 'REEMPLAZADO' AND NEW."estado" = 'ARCHIVADO')
    ) THEN
      RAISE EXCEPTION 'Transición de versión documental no permitida: % -> %', OLD."estado", NEW."estado";
    END IF;
    IF OLD."estado" IN ('DISPONIBLE','REEMPLAZADO','ARCHIVADO') AND (
      NEW."id_documento_logico" IS DISTINCT FROM OLD."id_documento_logico" OR
      NEW."numero_version" IS DISTINCT FROM OLD."numero_version" OR
      NEW."proveedor_logico" IS DISTINCT FROM OLD."proveedor_logico" OR
      NEW."contenedor_logico" IS DISTINCT FROM OLD."contenedor_logico" OR
      NEW."clave_objeto" IS DISTINCT FROM OLD."clave_objeto" OR
      NEW."version_proveedor" IS DISTINCT FROM OLD."version_proveedor" OR
      NEW."nombre_original" IS DISTINCT FROM OLD."nombre_original" OR
      NEW."nombre_seguro" IS DISTINCT FROM OLD."nombre_seguro" OR
      NEW."mime_declarado" IS DISTINCT FROM OLD."mime_declarado" OR
      NEW."mime_detectado" IS DISTINCT FROM OLD."mime_detectado" OR
      NEW."tamano_bytes" IS DISTINCT FROM OLD."tamano_bytes" OR
      NEW."sha256" IS DISTINCT FROM OLD."sha256" OR
      NEW."creado_por" IS DISTINCT FROM OLD."creado_por"
    ) THEN
      RAISE EXCEPTION 'Los metadatos de contenido de una versión confirmada son inmutables';
    END IF;
  END IF;
  IF NEW."id_version_reemplazada" IS NOT NULL THEN
    SELECT "id_documento_logico", "estado" INTO reemplazada FROM "finanzas"."version_documento" WHERE "id_version_documento" = NEW."id_version_reemplazada";
    IF NOT FOUND OR reemplazada."id_documento_logico" <> NEW."id_documento_logico" THEN
      RAISE EXCEPTION 'La versión reemplazada debe pertenecer al mismo documento lógico';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "trg_version_documento_reglas"
BEFORE INSERT OR UPDATE ON "finanzas"."version_documento"
FOR EACH ROW EXECUTE FUNCTION "finanzas"."validar_version_documento"();

CREATE OR REPLACE FUNCTION "finanzas"."validar_transicion_intencion_documental"() RETURNS trigger AS $$
BEGIN
  IF NEW."estado" IS DISTINCT FROM OLD."estado" AND NOT (
    (OLD."estado" = 'PENDIENTE' AND NEW."estado" IN ('SUBIENDO','ERROR','CANCELADA','EXPIRADA')) OR
    (OLD."estado" = 'SUBIENDO' AND NEW."estado" IN ('VALIDANDO','ERROR','CANCELADA','EXPIRADA')) OR
    (OLD."estado" = 'VALIDANDO' AND NEW."estado" IN ('DISPONIBLE','ERROR','CUARENTENA')) OR
    (OLD."estado" = 'ERROR' AND NEW."estado" = 'PENDIENTE') OR
    (OLD."estado" = 'CUARENTENA' AND NEW."estado" = 'VALIDANDO')
  ) THEN
    RAISE EXCEPTION 'Transición de intención documental no permitida: % -> %', OLD."estado", NEW."estado";
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "trg_intencion_documental_transicion"
BEFORE UPDATE OF "estado" ON "finanzas"."intencion_carga_documental"
FOR EACH ROW EXECUTE FUNCTION "finanzas"."validar_transicion_intencion_documental"();

CREATE OR REPLACE FUNCTION "finanzas"."validar_variante_documental_sin_ciclos"() RETURNS trigger AS $$
BEGIN
  IF EXISTS (
    WITH RECURSIVE descendientes AS (
      SELECT "id_version_derivada" FROM "finanzas"."variante_documento" WHERE "id_version_original" = NEW."id_version_derivada"
      UNION
      SELECT v."id_version_derivada" FROM "finanzas"."variante_documento" v JOIN descendientes d ON v."id_version_original" = d."id_version_derivada"
    )
    SELECT 1 FROM descendientes WHERE "id_version_derivada" = NEW."id_version_original"
  ) THEN
    RAISE EXCEPTION 'La relación de variantes produciría un ciclo';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "trg_variante_documental_sin_ciclos"
BEFORE INSERT OR UPDATE ON "finanzas"."variante_documento"
FOR EACH ROW EXECUTE FUNCTION "finanzas"."validar_variante_documental_sin_ciclos"();
