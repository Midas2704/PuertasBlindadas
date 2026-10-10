CREATE TABLE "finanzas"."cuenta_bancaria_m7" (
    "id_cuenta_bancaria_m7" SERIAL NOT NULL,
    "banco" VARCHAR(100) NOT NULL,
    "alias_cuenta" VARCHAR(100) NOT NULL,
    "identificador_bancario" VARCHAR(120) NOT NULL,
    "id_moneda" INTEGER NOT NULL,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'activa',
    "creado_por" BIGINT NOT NULL,
    "fecha_creacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_por" BIGINT,
    "fecha_actualizacion" TIMESTAMPTZ(6),
    CONSTRAINT "cuenta_bancaria_m7_pkey" PRIMARY KEY ("id_cuenta_bancaria_m7"),
    CONSTRAINT "chk_cuenta_bancaria_m7_estado" CHECK ("estado" IN ('activa', 'inactiva')),
    CONSTRAINT "chk_cuenta_bancaria_m7_textos" CHECK (length(btrim("banco")) > 0 AND length(btrim("alias_cuenta")) > 0 AND length(btrim("identificador_bancario")) > 0)
);

CREATE UNIQUE INDEX "uq_cuenta_bancaria_m7_identidad" ON "finanzas"."cuenta_bancaria_m7"("banco", "identificador_bancario", "id_moneda");
CREATE INDEX "idx_cuenta_bancaria_m7_estado_moneda" ON "finanzas"."cuenta_bancaria_m7"("estado", "id_moneda");

CREATE TABLE "finanzas"."saldo_inicial_bancario_m7" (
    "id_saldo_inicial_bancario_m7" SERIAL NOT NULL,
    "id_cuenta_bancaria_m7" INTEGER NOT NULL,
    "fecha_corte" DATE NOT NULL,
    "saldo_inicial" DECIMAL(14,2) NOT NULL,
    "observacion" TEXT NOT NULL,
    "estado" VARCHAR(20) NOT NULL DEFAULT 'activo',
    "creado_por" BIGINT NOT NULL,
    "fecha_creacion" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizado_por" BIGINT,
    "fecha_actualizacion" TIMESTAMPTZ(6),
    CONSTRAINT "saldo_inicial_bancario_m7_pkey" PRIMARY KEY ("id_saldo_inicial_bancario_m7"),
    CONSTRAINT "chk_saldo_inicial_bancario_m7_estado" CHECK ("estado" IN ('activo', 'inactivo')),
    CONSTRAINT "chk_saldo_inicial_bancario_m7_observacion" CHECK (length(btrim("observacion")) > 0)
);

CREATE UNIQUE INDEX "uq_saldo_inicial_bancario_m7_cuenta_corte" ON "finanzas"."saldo_inicial_bancario_m7"("id_cuenta_bancaria_m7", "fecha_corte");
CREATE INDEX "idx_saldo_inicial_bancario_m7_corte_estado" ON "finanzas"."saldo_inicial_bancario_m7"("fecha_corte", "estado");

ALTER TABLE "finanzas"."movimiento_bancario" ADD COLUMN "id_cuenta_bancaria_m7" INTEGER;
ALTER TABLE "finanzas"."movimiento_bancario" ADD COLUMN "naturaleza_bancaria" VARCHAR(10);
ALTER TABLE "finanzas"."movimiento_bancario" ADD CONSTRAINT "chk_movimiento_bancario_naturaleza_m7" CHECK ("naturaleza_bancaria" IS NULL OR "naturaleza_bancaria" IN ('ingreso', 'egreso'));
CREATE INDEX "idx_movimiento_bancario_cuenta_fecha_m7" ON "finanzas"."movimiento_bancario"("id_cuenta_bancaria_m7", "fecha_movimiento_bancario");

ALTER TABLE "finanzas"."cuenta_bancaria_m7" ADD CONSTRAINT "fk_cuenta_bancaria_m7_moneda" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "finanzas"."cuenta_bancaria_m7" ADD CONSTRAINT "cuenta_bancaria_m7_creado_por_fkey" FOREIGN KEY ("creado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "finanzas"."cuenta_bancaria_m7" ADD CONSTRAINT "cuenta_bancaria_m7_actualizado_por_fkey" FOREIGN KEY ("actualizado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "finanzas"."saldo_inicial_bancario_m7" ADD CONSTRAINT "fk_saldo_inicial_bancario_m7_cuenta" FOREIGN KEY ("id_cuenta_bancaria_m7") REFERENCES "finanzas"."cuenta_bancaria_m7"("id_cuenta_bancaria_m7") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "finanzas"."saldo_inicial_bancario_m7" ADD CONSTRAINT "saldo_inicial_bancario_m7_creado_por_fkey" FOREIGN KEY ("creado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "finanzas"."saldo_inicial_bancario_m7" ADD CONSTRAINT "saldo_inicial_bancario_m7_actualizado_por_fkey" FOREIGN KEY ("actualizado_por") REFERENCES "terreno"."usuario"("usuario_id_usuario") ON DELETE RESTRICT ON UPDATE NO ACTION;
ALTER TABLE "finanzas"."movimiento_bancario" ADD CONSTRAINT "fk_movimiento_bancario_cuenta_m7" FOREIGN KEY ("id_cuenta_bancaria_m7") REFERENCES "finanzas"."cuenta_bancaria_m7"("id_cuenta_bancaria_m7") ON DELETE RESTRICT ON UPDATE NO ACTION;
