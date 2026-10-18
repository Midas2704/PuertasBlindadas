-- Preparación aditiva. Esta migración no asigna precios ni condiciones comerciales.
-- btree_gist permite impedir vigencias superpuestas de forma segura bajo concurrencia.
CREATE EXTENSION IF NOT EXISTS btree_gist WITH SCHEMA public;

ALTER TABLE "finanzas"."cotizacion"
  ADD COLUMN "segmento_comercial" VARCHAR(3),
  ADD COLUMN "nombre_proyecto" VARCHAR(200),
  ADD COLUMN "referencia_comercial" VARCHAR(200),
  ADD COLUMN "alcance_comercial" VARCHAR(30),
  ADD COLUMN "requiere_instalacion" VARCHAR(20),
  ADD COLUMN "direccion_instalacion" VARCHAR(500),
  ADD COLUMN "region_instalacion" VARCHAR(120),
  ADD COLUMN "ciudad_instalacion" VARCHAR(120),
  ADD COLUMN "comuna_instalacion" VARCHAR(120),
  ADD COLUMN "estado_cobertura_instalacion" VARCHAR(30),
  ADD COLUMN "id_tarifa_instalacion_comercial" BIGINT,
  ADD COLUMN "precio_instalacion_aplicado" DECIMAL(14,2),
  ADD COLUMN "id_condicion_comercial_version" BIGINT,
  ADD COLUMN "responsable_comercial" BIGINT,
  ADD COLUMN "revision" INTEGER NOT NULL DEFAULT 1;

ALTER TABLE "finanzas"."detalle_cotizacion"
  ADD COLUMN "id_extension_producto_comercial" INTEGER,
  ADD COLUMN "id_producto_comercial_version" INTEGER,
  ADD COLUMN "id_precio_producto_comercial" BIGINT,
  ADD COLUMN "tipo_linea_comercial" VARCHAR(30),
  ADD COLUMN "precio_lista_aplicado" DECIMAL(14,2),
  ADD COLUMN "precio_unitario_autorizado" DECIMAL(14,2),
  ADD COLUMN "descuento_elegible" BOOLEAN,
  ADD COLUMN "es_precio_excepcional" BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN "motivo_precio_excepcional" TEXT,
  ADD COLUMN "precio_excepcional_autorizado_por" BIGINT,
  ADD COLUMN "snapshot_comercial" JSONB,
  ADD COLUMN "revision" INTEGER NOT NULL DEFAULT 1;

CREATE TABLE "finanzas"."precio_producto_comercial" (
  "id_precio_producto_comercial" BIGSERIAL PRIMARY KEY,
  "id_extension_producto_comercial" INTEGER NOT NULL,
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
  CONSTRAINT "fk_precio_producto_comercial_producto" FOREIGN KEY ("id_extension_producto_comercial") REFERENCES "finanzas"."extension_producto_comercial"("id_extension_producto_comercial") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_precio_producto_comercial_moneda" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_precio_producto_comercial_creador" FOREIGN KEY ("creado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "ck_precio_producto_segmento" CHECK ("segmento_comercial" IN ('B2B','B2C')),
  CONSTRAINT "ck_precio_producto_monto" CHECK ("monto" > 0),
  CONSTRAINT "ck_precio_producto_estado" CHECK ("estado" IN ('ACTIVO','INACTIVO')),
  CONSTRAINT "ck_precio_producto_vigencia" CHECK ("vigencia_hasta" IS NULL OR "vigencia_hasta" >= "vigencia_desde"),
  CONSTRAINT "ck_precio_producto_revision" CHECK ("revision" > 0),
  CONSTRAINT "uq_precio_producto_inicio" UNIQUE ("id_extension_producto_comercial","segmento_comercial","id_moneda","vigencia_desde")
);

ALTER TABLE "finanzas"."precio_producto_comercial"
  ADD CONSTRAINT "ex_precio_producto_vigencia"
  EXCLUDE USING gist (
    "id_extension_producto_comercial" WITH =,
    "segmento_comercial" WITH =,
    "id_moneda" WITH =,
    daterange("vigencia_desde", COALESCE("vigencia_hasta", 'infinity'::date), '[]') WITH &&
  ) WHERE ("estado" = 'ACTIVO');

CREATE INDEX "idx_precio_producto_vigencia" ON "finanzas"."precio_producto_comercial" ("id_extension_producto_comercial","segmento_comercial","estado","vigencia_desde","vigencia_hasta");

CREATE TABLE "finanzas"."opcional_comercial" (
  "id_opcional_comercial" BIGSERIAL PRIMARY KEY,
  "codigo" VARCHAR(60) NOT NULL UNIQUE,
  "nombre" VARCHAR(200) NOT NULL,
  "descripcion_b2b" TEXT,
  "descripcion_b2c" TEXT,
  "estado" VARCHAR(20) NOT NULL DEFAULT 'ACTIVO',
  "revision" INTEGER NOT NULL DEFAULT 1,
  "creado_por" BIGINT NOT NULL,
  "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_opcional_comercial_creador" FOREIGN KEY ("creado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "ck_opcional_comercial_estado" CHECK ("estado" IN ('ACTIVO','INACTIVO')),
  CONSTRAINT "ck_opcional_comercial_revision" CHECK ("revision" > 0)
);
CREATE INDEX "idx_opcional_comercial_estado" ON "finanzas"."opcional_comercial" ("estado","nombre");

CREATE TABLE "finanzas"."compatibilidad_opcional_producto" (
  "id_compatibilidad_opcional" BIGSERIAL PRIMARY KEY,
  "id_extension_producto_comercial" INTEGER NOT NULL,
  "id_opcional_comercial" BIGINT NOT NULL,
  "habilitado_b2b" BOOLEAN NOT NULL DEFAULT FALSE,
  "habilitado_b2c" BOOLEAN NOT NULL DEFAULT FALSE,
  "condiciones_compatibilidad" TEXT,
  "estado" VARCHAR(20) NOT NULL DEFAULT 'ACTIVA',
  "revision" INTEGER NOT NULL DEFAULT 1,
  CONSTRAINT "fk_compatibilidad_opcional_producto" FOREIGN KEY ("id_extension_producto_comercial") REFERENCES "finanzas"."extension_producto_comercial"("id_extension_producto_comercial") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_compatibilidad_opcional_catalogo" FOREIGN KEY ("id_opcional_comercial") REFERENCES "finanzas"."opcional_comercial"("id_opcional_comercial") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "uq_compatibilidad_opcional_producto" UNIQUE ("id_extension_producto_comercial","id_opcional_comercial"),
  CONSTRAINT "ck_compatibilidad_opcional_estado" CHECK ("estado" IN ('ACTIVA','INACTIVA')),
  CONSTRAINT "ck_compatibilidad_opcional_revision" CHECK ("revision" > 0)
);
CREATE INDEX "idx_compatibilidad_opcional_estado" ON "finanzas"."compatibilidad_opcional_producto" ("id_extension_producto_comercial","estado");

CREATE TABLE "finanzas"."precio_opcional_comercial" (
  "id_precio_opcional_comercial" BIGSERIAL PRIMARY KEY,
  "id_opcional_comercial" BIGINT NOT NULL,
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
  CONSTRAINT "fk_precio_opcional_catalogo" FOREIGN KEY ("id_opcional_comercial") REFERENCES "finanzas"."opcional_comercial"("id_opcional_comercial") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_precio_opcional_moneda" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_precio_opcional_creador" FOREIGN KEY ("creado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "ck_precio_opcional_segmento" CHECK ("segmento_comercial" IN ('B2B','B2C')),
  CONSTRAINT "ck_precio_opcional_monto" CHECK ("monto" > 0),
  CONSTRAINT "ck_precio_opcional_estado" CHECK ("estado" IN ('ACTIVO','INACTIVO')),
  CONSTRAINT "ck_precio_opcional_vigencia" CHECK ("vigencia_hasta" IS NULL OR "vigencia_hasta" >= "vigencia_desde"),
  CONSTRAINT "ck_precio_opcional_revision" CHECK ("revision" > 0),
  CONSTRAINT "uq_precio_opcional_inicio" UNIQUE ("id_opcional_comercial","segmento_comercial","id_moneda","vigencia_desde")
);

ALTER TABLE "finanzas"."precio_opcional_comercial"
  ADD CONSTRAINT "ex_precio_opcional_vigencia"
  EXCLUDE USING gist (
    "id_opcional_comercial" WITH =,
    "segmento_comercial" WITH =,
    "id_moneda" WITH =,
    daterange("vigencia_desde", COALESCE("vigencia_hasta", 'infinity'::date), '[]') WITH &&
  ) WHERE ("estado" = 'ACTIVO');

CREATE INDEX "idx_precio_opcional_vigencia" ON "finanzas"."precio_opcional_comercial" ("id_opcional_comercial","segmento_comercial","estado","vigencia_desde","vigencia_hasta");

CREATE TABLE "finanzas"."tarifa_instalacion_comercial" (
  "id_tarifa_instalacion_comercial" BIGSERIAL PRIMARY KEY,
  "alcance_geografico" VARCHAR(20) NOT NULL,
  "region" VARCHAR(120) NOT NULL,
  "region_normalizada" VARCHAR(120) NOT NULL,
  "ciudad" VARCHAR(120),
  "comuna" VARCHAR(120),
  "comuna_normalizada" VARCHAR(120),
  "estado_cobertura" VARCHAR(30) NOT NULL,
  "id_moneda" INTEGER,
  "precio_comercial" DECIMAL(14,2),
  "vigencia_desde" DATE NOT NULL,
  "vigencia_hasta" DATE,
  "condiciones" TEXT,
  "observaciones" TEXT,
  "estado" VARCHAR(20) NOT NULL DEFAULT 'ACTIVA',
  "revision" INTEGER NOT NULL DEFAULT 1,
  "creado_por" BIGINT NOT NULL,
  "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_tarifa_instalacion_moneda" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_tarifa_instalacion_creador" FOREIGN KEY ("creado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "ck_tarifa_instalacion_alcance" CHECK ("alcance_geografico" IN ('COMUNA','REGION')),
  CONSTRAINT "ck_tarifa_instalacion_geografia" CHECK (("alcance_geografico" = 'COMUNA' AND "comuna" IS NOT NULL AND "comuna_normalizada" IS NOT NULL) OR ("alcance_geografico" = 'REGION' AND "comuna" IS NULL AND "comuna_normalizada" IS NULL)),
  CONSTRAINT "ck_tarifa_instalacion_cobertura" CHECK ("estado_cobertura" IN ('DISPONIBLE','NO_DISPONIBLE','REQUIERE_EVALUACION')),
  CONSTRAINT "ck_tarifa_instalacion_precio" CHECK (("estado_cobertura" = 'DISPONIBLE' AND "precio_comercial" IS NOT NULL AND "precio_comercial" > 0 AND "id_moneda" IS NOT NULL) OR ("estado_cobertura" <> 'DISPONIBLE' AND "precio_comercial" IS NULL AND "id_moneda" IS NULL)),
  CONSTRAINT "ck_tarifa_instalacion_estado" CHECK ("estado" IN ('ACTIVA','INACTIVA')),
  CONSTRAINT "ck_tarifa_instalacion_vigencia" CHECK ("vigencia_hasta" IS NULL OR "vigencia_hasta" >= "vigencia_desde"),
  CONSTRAINT "ck_tarifa_instalacion_revision" CHECK ("revision" > 0),
  CONSTRAINT "uq_tarifa_instalacion_inicio" UNIQUE ("alcance_geografico","region_normalizada","comuna_normalizada","vigencia_desde")
);

ALTER TABLE "finanzas"."tarifa_instalacion_comercial"
  ADD CONSTRAINT "ex_tarifa_instalacion_vigencia"
  EXCLUDE USING gist (
    "alcance_geografico" WITH =,
    "region_normalizada" WITH =,
    (COALESCE("comuna_normalizada", '')) WITH =,
    daterange("vigencia_desde", COALESCE("vigencia_hasta", 'infinity'::date), '[]') WITH &&
  ) WHERE ("estado" = 'ACTIVA');

CREATE INDEX "idx_tarifa_instalacion_busqueda" ON "finanzas"."tarifa_instalacion_comercial" ("region_normalizada","comuna_normalizada","estado","vigencia_desde","vigencia_hasta");

CREATE TABLE "finanzas"."condicion_comercial" (
  "id_condicion_comercial" BIGSERIAL PRIMARY KEY,
  "codigo" VARCHAR(60) NOT NULL UNIQUE,
  "nombre" VARCHAR(200) NOT NULL,
  "segmento" VARCHAR(20) NOT NULL,
  "estado" VARCHAR(20) NOT NULL DEFAULT 'ACTIVA',
  "revision" INTEGER NOT NULL DEFAULT 1,
  "creado_por" BIGINT NOT NULL,
  "creado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actualizado_en" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "fk_condicion_comercial_creador" FOREIGN KEY ("creado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "ck_condicion_comercial_segmento" CHECK ("segmento" IN ('B2B','B2C','CARTA_B2C')),
  CONSTRAINT "ck_condicion_comercial_estado" CHECK ("estado" IN ('ACTIVA','INACTIVA')),
  CONSTRAINT "ck_condicion_comercial_revision" CHECK ("revision" > 0)
);
CREATE INDEX "idx_condicion_comercial_segmento" ON "finanzas"."condicion_comercial" ("segmento","estado");

CREATE TABLE "finanzas"."condicion_comercial_version" (
  "id_condicion_comercial_version" BIGSERIAL PRIMARY KEY,
  "id_condicion_comercial" BIGINT NOT NULL,
  "numero_version" INTEGER NOT NULL,
  "contenido" JSONB NOT NULL,
  "vigencia_desde" DATE NOT NULL,
  "vigencia_hasta" DATE,
  "estado" VARCHAR(20) NOT NULL DEFAULT 'BORRADOR',
  "motivo" TEXT NOT NULL,
  "publicado_por" BIGINT,
  "publicado_en" TIMESTAMPTZ(6),
  CONSTRAINT "fk_condicion_version_raiz" FOREIGN KEY ("id_condicion_comercial") REFERENCES "finanzas"."condicion_comercial"("id_condicion_comercial") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_condicion_version_publicador" FOREIGN KEY ("publicado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "uq_condicion_comercial_version" UNIQUE ("id_condicion_comercial","numero_version"),
  CONSTRAINT "ck_condicion_version_numero" CHECK ("numero_version" > 0),
  CONSTRAINT "ck_condicion_version_estado" CHECK ("estado" IN ('BORRADOR','PUBLICADA','ARCHIVADA')),
  CONSTRAINT "ck_condicion_version_publicacion" CHECK (("estado" = 'BORRADOR' AND "publicado_por" IS NULL AND "publicado_en" IS NULL) OR ("estado" <> 'BORRADOR' AND "publicado_por" IS NOT NULL AND "publicado_en" IS NOT NULL)),
  CONSTRAINT "ck_condicion_version_vigencia" CHECK ("vigencia_hasta" IS NULL OR "vigencia_hasta" >= "vigencia_desde")
);

ALTER TABLE "finanzas"."condicion_comercial_version"
  ADD CONSTRAINT "ex_condicion_version_vigencia"
  EXCLUDE USING gist (
    "id_condicion_comercial" WITH =,
    daterange("vigencia_desde", COALESCE("vigencia_hasta", 'infinity'::date), '[]') WITH &&
  ) WHERE ("estado" = 'PUBLICADA');

CREATE INDEX "idx_condicion_version_vigencia" ON "finanzas"."condicion_comercial_version" ("id_condicion_comercial","estado","vigencia_desde","vigencia_hasta");

ALTER TABLE "finanzas"."cotizacion"
  ADD CONSTRAINT "fk_cotizacion_tarifa_instalacion_comercial" FOREIGN KEY ("id_tarifa_instalacion_comercial") REFERENCES "finanzas"."tarifa_instalacion_comercial"("id_tarifa_instalacion_comercial") ON DELETE RESTRICT ON UPDATE NO ACTION,
  ADD CONSTRAINT "fk_cotizacion_condicion_comercial" FOREIGN KEY ("id_condicion_comercial_version") REFERENCES "finanzas"."condicion_comercial_version"("id_condicion_comercial_version") ON DELETE RESTRICT ON UPDATE NO ACTION,
  ADD CONSTRAINT "fk_cotizacion_responsable_comercial" FOREIGN KEY ("responsable_comercial") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION,
  ADD CONSTRAINT "ck_cotizacion_segmento_comercial" CHECK ("segmento_comercial" IS NULL OR "segmento_comercial" IN ('B2B','B2C')),
  ADD CONSTRAINT "ck_cotizacion_alcance_comercial" CHECK ("alcance_comercial" IS NULL OR "alcance_comercial" IN ('SOLO_SUMINISTRO','SOLO_INSTALACION','SUMINISTRO_INSTALACION')),
  ADD CONSTRAINT "ck_cotizacion_requiere_instalacion" CHECK ("requiere_instalacion" IS NULL OR "requiere_instalacion" IN ('SI','NO','POR_DEFINIR')),
  ADD CONSTRAINT "ck_cotizacion_estado_cobertura" CHECK ("estado_cobertura_instalacion" IS NULL OR "estado_cobertura_instalacion" IN ('DISPONIBLE','NO_DISPONIBLE','REQUIERE_EVALUACION','NO_APLICA')),
  ADD CONSTRAINT "ck_cotizacion_precio_instalacion" CHECK ("precio_instalacion_aplicado" IS NULL OR "precio_instalacion_aplicado" > 0),
  ADD CONSTRAINT "ck_cotizacion_revision" CHECK ("revision" > 0);

ALTER TABLE "finanzas"."detalle_cotizacion"
  ADD CONSTRAINT "fk_detalle_cotizacion_producto_comercial" FOREIGN KEY ("id_extension_producto_comercial") REFERENCES "finanzas"."extension_producto_comercial"("id_extension_producto_comercial") ON DELETE RESTRICT ON UPDATE NO ACTION,
  ADD CONSTRAINT "fk_detalle_cotizacion_producto_version" FOREIGN KEY ("id_producto_comercial_version") REFERENCES "finanzas"."producto_comercial_version"("id_producto_comercial_version") ON DELETE RESTRICT ON UPDATE NO ACTION,
  ADD CONSTRAINT "fk_detalle_cotizacion_precio_comercial" FOREIGN KEY ("id_precio_producto_comercial") REFERENCES "finanzas"."precio_producto_comercial"("id_precio_producto_comercial") ON DELETE RESTRICT ON UPDATE NO ACTION,
  ADD CONSTRAINT "fk_detalle_cotizacion_autorizador_precio" FOREIGN KEY ("precio_excepcional_autorizado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION,
  ADD CONSTRAINT "ck_detalle_cotizacion_tipo_linea" CHECK ("tipo_linea_comercial" IS NULL OR "tipo_linea_comercial" IN ('PRODUCTO','INSTALACION','FLETE','CARGA_DESCARGA','SERVICIO_ADICIONAL')),
  ADD CONSTRAINT "ck_detalle_cotizacion_precios" CHECK (("precio_lista_aplicado" IS NULL OR "precio_lista_aplicado" > 0) AND ("precio_unitario_autorizado" IS NULL OR "precio_unitario_autorizado" > 0)),
  ADD CONSTRAINT "ck_detalle_cotizacion_excepcion" CHECK (("es_precio_excepcional" = FALSE AND "motivo_precio_excepcional" IS NULL AND "precio_excepcional_autorizado_por" IS NULL) OR ("es_precio_excepcional" = TRUE AND "precio_unitario_autorizado" IS NOT NULL AND "motivo_precio_excepcional" IS NOT NULL AND "precio_excepcional_autorizado_por" IS NOT NULL)),
  ADD CONSTRAINT "ck_detalle_cotizacion_producto_version" CHECK (("id_extension_producto_comercial" IS NULL AND "id_producto_comercial_version" IS NULL) OR ("id_extension_producto_comercial" IS NOT NULL AND "id_producto_comercial_version" IS NOT NULL)),
  ADD CONSTRAINT "ck_detalle_cotizacion_revision" CHECK ("revision" > 0);

CREATE INDEX "idx_cotizacion_segmento_estado" ON "finanzas"."cotizacion" ("segmento_comercial","estado_cotizacion");
CREATE INDEX "idx_cotizacion_tarifa_instalacion" ON "finanzas"."cotizacion" ("id_tarifa_instalacion_comercial");
CREATE INDEX "idx_cotizacion_condicion_comercial" ON "finanzas"."cotizacion" ("id_condicion_comercial_version");
CREATE INDEX "idx_detalle_cotizacion_producto_version" ON "finanzas"."detalle_cotizacion" ("id_extension_producto_comercial","id_producto_comercial_version");
CREATE INDEX "idx_detalle_cotizacion_precio_comercial" ON "finanzas"."detalle_cotizacion" ("id_precio_producto_comercial");

-- Backfill deliberadamente conservador: sólo nombres exactos B2B/B2C del catálogo asociado.
UPDATE "finanzas"."cotizacion" AS c
SET "segmento_comercial" = UPPER(t."nombre_tipo_cliente_financiero")
FROM "finanzas"."ficha_cliente" AS f
JOIN "finanzas"."cliente_financiero" AS cf ON cf."id_cliente_financiero" = f."id_cliente_financiero"
JOIN "finanzas"."tipo_cliente_financiero" AS t ON t."id_tipo_cliente_financiero" = cf."id_tipo_cliente_financiero"
WHERE c."id_ficha_cliente" = f."id_ficha_cliente"
  AND UPPER(t."nombre_tipo_cliente_financiero") IN ('B2B','B2C');

CREATE VIEW "finanzas"."cotizacion_segmento_pendiente_revision" AS
SELECT c."id_cotizacion", c."id_ficha_cliente", t."nombre_tipo_cliente_financiero" AS "tipo_cliente_actual"
FROM "finanzas"."cotizacion" AS c
JOIN "finanzas"."ficha_cliente" AS f ON f."id_ficha_cliente" = c."id_ficha_cliente"
JOIN "finanzas"."cliente_financiero" AS cf ON cf."id_cliente_financiero" = f."id_cliente_financiero"
JOIN "finanzas"."tipo_cliente_financiero" AS t ON t."id_tipo_cliente_financiero" = cf."id_tipo_cliente_financiero"
WHERE c."segmento_comercial" IS NULL;
