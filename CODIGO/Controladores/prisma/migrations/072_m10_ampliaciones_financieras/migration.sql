-- M10: capacidades financieras y presupuesto manual anual versionado.
-- Aditiva: no modifica proyecciones M7 ni datos historicos.

CREATE TABLE "finanzas"."presupuesto_manual_m10" (
  "id_presupuesto_manual_m10" BIGSERIAL PRIMARY KEY,
  "anio" INTEGER NOT NULL,
  "ambito" VARCHAR(40) NOT NULL DEFAULT 'GENERAL',
  "id_moneda" INTEGER NOT NULL,
  "estado" VARCHAR(20) NOT NULL DEFAULT 'activo',
  "revision" INTEGER NOT NULL DEFAULT 1,
  "creado_por" BIGINT NOT NULL,
  "fecha_creacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "fecha_actualizacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ck_presupuesto_m10_anio" CHECK ("anio" BETWEEN 2000 AND 2200),
  CONSTRAINT "ck_presupuesto_m10_estado" CHECK ("estado" IN ('activo','inactivo')),
  CONSTRAINT "ck_presupuesto_m10_revision" CHECK ("revision" >= 1),
  CONSTRAINT "uq_presupuesto_m10_identidad" UNIQUE ("anio","ambito","id_moneda"),
  CONSTRAINT "fk_presupuesto_m10_moneda" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_presupuesto_m10_creador" FOREIGN KEY ("creado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION
);

CREATE TABLE "finanzas"."version_presupuesto_m10" (
  "id_version_presupuesto_m10" BIGSERIAL PRIMARY KEY,
  "id_presupuesto_manual_m10" BIGINT NOT NULL,
  "numero_version" INTEGER NOT NULL,
  "tipo_version" VARCHAR(20) NOT NULL,
  "revision_base" INTEGER NOT NULL,
  "motivo" VARCHAR(1000),
  "creado_por" BIGINT NOT NULL,
  "fecha_creacion" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ck_version_presupuesto_m10_numero" CHECK ("numero_version" >= 1),
  CONSTRAINT "ck_version_presupuesto_m10_tipo" CHECK ("tipo_version" IN ('ORIGINAL','REVISION')),
  CONSTRAINT "uq_version_presupuesto_m10_numero" UNIQUE ("id_presupuesto_manual_m10","numero_version"),
  CONSTRAINT "fk_version_presupuesto_m10_presupuesto" FOREIGN KEY ("id_presupuesto_manual_m10") REFERENCES "finanzas"."presupuesto_manual_m10"("id_presupuesto_manual_m10") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "fk_version_presupuesto_m10_creador" FOREIGN KEY ("creado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION
);

CREATE TABLE "finanzas"."detalle_presupuesto_m10" (
  "id_detalle_presupuesto_m10" BIGSERIAL PRIMARY KEY,
  "id_version_presupuesto_m10" BIGINT NOT NULL,
  "mes" INTEGER NOT NULL,
  "tipo" VARCHAR(30) NOT NULL,
  "categoria" VARCHAR(50) NOT NULL,
  "monto" DECIMAL(14,2) NOT NULL,
  CONSTRAINT "ck_detalle_presupuesto_m10_mes" CHECK ("mes" BETWEEN 1 AND 12),
  CONSTRAINT "ck_detalle_presupuesto_m10_tipo" CHECK ("tipo" IN ('RESULTADOS','FLUJO_CAJA')),
  CONSTRAINT "ck_detalle_presupuesto_m10_monto" CHECK ("monto" >= 0),
  CONSTRAINT "uq_detalle_presupuesto_m10_partida" UNIQUE ("id_version_presupuesto_m10","mes","tipo","categoria"),
  CONSTRAINT "fk_detalle_presupuesto_m10_version" FOREIGN KEY ("id_version_presupuesto_m10") REFERENCES "finanzas"."version_presupuesto_m10"("id_version_presupuesto_m10") ON DELETE RESTRICT ON UPDATE NO ACTION
);

CREATE INDEX "idx_presupuesto_m10_anio_estado" ON "finanzas"."presupuesto_manual_m10"("anio","estado");
CREATE INDEX "idx_version_presupuesto_m10_historial" ON "finanzas"."version_presupuesto_m10"("id_presupuesto_manual_m10","fecha_creacion");
CREATE INDEX "idx_detalle_presupuesto_m10_mes" ON "finanzas"."detalle_presupuesto_m10"("id_version_presupuesto_m10","mes");

DO $$
DECLARE incompatible RECORD;
BEGIN
  SELECT p."codigo_m4" INTO incompatible
  FROM "terreno"."permiso" p
  JOIN (VALUES
    ('CU446','consultar ventas ampliadas','Consultar ventas netas, MoM, YoY y YTD con cobertura explicita','Consultar ventas y comparaciones ampliadas'),
    ('CU447','exportar Excel financiero','Exportar ventas formalizadas o cotizaciones en Excel seguro','Exportar Excel de ventas y cotizaciones'),
    ('CU449','consultar resultados ampliados','Consultar resultados gerenciales y estado seguro de EBITDA','Consultar resultados gerenciales ampliados'),
    ('CU451','administrar presupuestos manuales','Crear y revisar presupuestos anuales manuales versionados','Administrar presupuestos manuales')
  ) AS esperado(codigo,accion,descripcion,nombre) ON esperado.codigo=p."codigo_m4"
  WHERE p."permiso_modulo" IS DISTINCT FROM 'M7'
     OR p."permiso_accion" IS DISTINCT FROM esperado.accion
     OR p."permiso_descripcion" IS DISTINCT FROM esperado.descripcion
     OR p."permiso_nombre_del_permiso" IS DISTINCT FROM esperado.nombre
     OR p."requiere_administrador" IS DISTINCT FROM FALSE
  LIMIT 1;
  IF FOUND THEN RAISE EXCEPTION 'Permiso M4 % ya existe con definicion incompatible', incompatible."codigo_m4"; END IF;
END $$;

INSERT INTO "terreno"."permiso" ("permiso_modulo","permiso_accion","permiso_descripcion","permiso_nombre_del_permiso","codigo_m4","activo_m4","requiere_administrador")
SELECT 'M7',accion,descripcion,nombre,codigo,TRUE,FALSE FROM (VALUES
  ('CU446','consultar ventas ampliadas','Consultar ventas netas, MoM, YoY y YTD con cobertura explicita','Consultar ventas y comparaciones ampliadas'),
  ('CU447','exportar Excel financiero','Exportar ventas formalizadas o cotizaciones en Excel seguro','Exportar Excel de ventas y cotizaciones'),
  ('CU449','consultar resultados ampliados','Consultar resultados gerenciales y estado seguro de EBITDA','Consultar resultados gerenciales ampliados'),
  ('CU451','administrar presupuestos manuales','Crear y revisar presupuestos anuales manuales versionados','Administrar presupuestos manuales')
) AS nuevos(codigo,accion,descripcion,nombre)
ON CONFLICT ("codigo_m4") DO NOTHING;

INSERT INTO "terreno"."permiso_dependencia" ("id_permiso","id_requerido")
SELECT dependiente."permiso_id_permiso", requerido."permiso_id_permiso"
FROM (VALUES ('CU446','CU215'),('CU446','CU219'),('CU446','CU220'),('CU447','CU446'),('CU449','CU238'),('CU451','CU449')) AS relacion(codigo,requerido)
JOIN "terreno"."permiso" dependiente ON dependiente."codigo_m4"=relacion.codigo
JOIN "terreno"."permiso" requerido ON requerido."codigo_m4"=relacion.requerido
ON CONFLICT ("id_permiso","id_requerido") DO NOTHING;

-- CUT448 y CUT450 son contratos tecnicos, no permisos humanos. CU377 permanece excluido.
