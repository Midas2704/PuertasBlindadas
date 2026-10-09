CREATE TABLE "finanzas"."proyeccion_financiera_m7" (
  "id_proyeccion_financiera_m7" SERIAL NOT NULL,
  "tipo" VARCHAR(30) NOT NULL,
  "anio" INTEGER NOT NULL,
  "mes" INTEGER NOT NULL,
  "id_moneda" INTEGER NOT NULL,
  "categoria" VARCHAR(50) NOT NULL,
  "monto_proyectado" DECIMAL(14,2) NOT NULL,
  "observacion" TEXT,
  "estado" VARCHAR(20) NOT NULL DEFAULT 'activo',
  "creado_por" BIGINT NOT NULL,
  "fecha_creacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "actualizado_por" BIGINT,
  "fecha_actualizacion" TIMESTAMPTZ(6),
  CONSTRAINT "proyeccion_financiera_m7_pkey" PRIMARY KEY ("id_proyeccion_financiera_m7"),
  CONSTRAINT "ck_proyeccion_m7_tipo" CHECK ("tipo" IN ('FLUJO_CAJA', 'ESTADO_RESULTADOS')),
  CONSTRAINT "ck_proyeccion_m7_mes" CHECK ("mes" BETWEEN 1 AND 12),
  CONSTRAINT "ck_proyeccion_m7_anio" CHECK ("anio" BETWEEN 2000 AND 2200),
  CONSTRAINT "ck_proyeccion_m7_monto" CHECK ("monto_proyectado" >= 0),
  CONSTRAINT "ck_proyeccion_m7_estado" CHECK ("estado" IN ('activo', 'inactivo')),
  CONSTRAINT "fk_proyeccion_m7_moneda" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "proyeccion_financiera_m7_creado_por_fkey" FOREIGN KEY ("creado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION,
  CONSTRAINT "proyeccion_financiera_m7_actualizado_por_fkey" FOREIGN KEY ("actualizado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION
);

CREATE INDEX "idx_proyeccion_m7_periodo" ON "finanzas"."proyeccion_financiera_m7"("tipo", "anio", "mes", "estado");
CREATE INDEX "idx_proyeccion_m7_moneda_categoria" ON "finanzas"."proyeccion_financiera_m7"("id_moneda", "categoria");
CREATE UNIQUE INDEX "uq_proyeccion_m7_activa" ON "finanzas"."proyeccion_financiera_m7"("tipo", "anio", "mes", "id_moneda", "categoria") WHERE "estado" = 'activo';
