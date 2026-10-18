-- Datos exclusivamente sintéticos para validar 065-067 sobre una base descartable en estado 064.
BEGIN;

INSERT INTO "terreno"."usuario" (
  "usuario_id_usuario", "usuario_username", "usuario_estado_cuenta", "usuario_fecha_de_creacion"
) OVERRIDING SYSTEM VALUE VALUES (910001, 'migracion_065_067', 'activa', CURRENT_TIMESTAMP);

INSERT INTO "finanzas"."moneda" (
  "id_moneda", "codigo_moneda", "nombre_moneda", "simbolo_moneda"
) OVERRIDING SYSTEM VALUE VALUES (910001, 'TST', 'Moneda sintética', '$T');

INSERT INTO "finanzas"."tipo_cliente_financiero" (
  "id_tipo_cliente_financiero", "nombre_tipo_cliente_financiero", "descripcion_tipo_cliente_financiero"
) OVERRIDING SYSTEM VALUE VALUES
  (910001, 'B2B', 'Empresa sintética'),
  (910002, 'B2C', 'Particular sintético'),
  (910003, 'MIXTO', 'Clasificación deliberadamente ambigua');

INSERT INTO "finanzas"."cliente_financiero" (
  "id_cliente_financiero", "rut_cliente", "id_tipo_cliente_financiero", "nombre_razon_social_referencia"
) OVERRIDING SYSTEM VALUE VALUES
  (910001, 'TST-B2B-065', 910001, 'Empresa sintética 065'),
  (910002, 'TST-B2C-065', 910002, 'Particular sintético 065'),
  (910003, 'TST-AMB-065', 910003, 'Cliente ambiguo sintético 065');

INSERT INTO "finanzas"."ficha_cliente" ("id_ficha_cliente", "id_cliente_financiero") OVERRIDING SYSTEM VALUE VALUES
  (910001, 910001), (910002, 910002), (910003, 910003);

INSERT INTO "terreno"."item_comercial" (
  "id_item_comercial", "nombre_item", "descripcion_item", "tipo_item"
) OVERRIDING SYSTEM VALUE VALUES (910001, 'Puerta sintética', 'Sólo para validación aislada', 'producto');

INSERT INTO "finanzas"."familia_producto_comercial" (
  "id_familia_producto_comercial", "codigo", "nombre", "creado_por", "actualizado_por"
) VALUES (910001, 'FAM-TST-065', 'Familia sintética 065', 910001, 910001);

INSERT INTO "finanzas"."extension_producto_comercial" (
  "id_extension_producto_comercial", "codigo_comercial", "nombre_comercial",
  "id_familia_producto_comercial", "descripcion_b2b", "descripcion_b2c", "estado",
  "id_item_comercial", "numero_version_vigente", "creado_por", "actualizado_por"
) VALUES (
  910001, 'PROD-TST-065', 'Producto sintético 065', 910001,
  'Descripción B2B sintética', 'Descripción B2C sintética', 'VINCULADO',
  910001, 1, 910001, 910001
);

INSERT INTO "finanzas"."producto_comercial_version" (
  "id_producto_comercial_version", "id_extension_producto_comercial", "numero_version",
  "codigo_comercial", "nombre_comercial", "id_familia_producto_comercial",
  "codigo_familia", "nombre_familia", "descripcion_b2b", "descripcion_b2c",
  "caracteristicas_destacadas", "caracteristicas_tecnicas", "id_item_comercial",
  "vigencia_desde", "motivo", "usuario_id_usuario"
) VALUES (
  910001, 910001, 1, 'PROD-TST-065', 'Producto sintético 065', 910001,
  'FAM-TST-065', 'Familia sintética 065', 'Descripción B2B sintética', 'Descripción B2C sintética',
  '[]'::jsonb, '{}'::jsonb, 910001, CURRENT_DATE, 'Fixture histórico aislado', 910001
);

INSERT INTO "finanzas"."plantilla_fabricacion_familia" (
  "id_plantilla_fabricacion", "id_familia_producto_comercial", "borrador",
  "numero_version_vigente", "creado_por", "actualizado_por"
) VALUES (910001, 910001, '{"etapas":[]}'::jsonb, 1, 910001, 910001);

INSERT INTO "finanzas"."version_plantilla_fabricacion" (
  "id_version_plantilla", "id_plantilla_fabricacion", "numero_version", "contenido", "motivo", "publicado_por"
) VALUES (910001, 910001, 1, '{"etapas":[]}'::jsonb, 'Fixture histórico aislado', 910001);

INSERT INTO "finanzas"."cotizacion" (
  "id_cotizacion", "id_ficha_cliente", "id_moneda", "fecha_emision", "fecha_vigencia",
  "subtotal_costos_estimados", "margen_esperado", "precio_sugerido", "monto_total_estimado",
  "estado_cotizacion", "monto_impuesto", "monto_neto"
) OVERRIDING SYSTEM VALUE VALUES
  (910001, 910001, 910001, CURRENT_DATE - 30, CURRENT_DATE + 30, 100000, 30, 130000, 154700, 'emitida', 24700, 130000),
  (910002, 910002, 910001, CURRENT_DATE, CURRENT_DATE + 30, 80000, 25, 100000, 119000, 'borrador', 19000, 100000),
  (910003, 910003, 910001, CURRENT_DATE, CURRENT_DATE + 30, 50000, 20, 60000, 71400, 'borrador', 11400, 60000);

INSERT INTO "finanzas"."detalle_cotizacion" (
  "id_detalle_cotizacion", "id_cotizacion", "id_item_comercial", "cantidad_item",
  "descripcion_item_cotizado", "subtotal_item_estimado"
) OVERRIDING SYSTEM VALUE VALUES
  (910001, 910001, 910001, 1, 'Puerta empresa sintética', 130000),
  (910002, 910002, 910001, 1, 'Puerta particular sintética', 100000);

INSERT INTO "finanzas"."cotizacion_version" (
  "id_cotizacion_version", "id_cotizacion", "antecedentes", "motivo"
) VALUES (910001, 910001, '{"origen":"fixture-064"}'::jsonb, 'Historial sintético anterior a 065');

INSERT INTO "finanzas"."nota_venta" (
  "id_nota_venta", "id_ficha_cliente", "id_cotizacion", "id_moneda", "numero_nota_venta",
  "fecha_emision", "monto_neto", "monto_impuesto", "monto_total", "estado_nota_venta"
) OVERRIDING SYSTEM VALUE VALUES (910001, 910001, 910001, 910001, 'NV-TST-065', CURRENT_DATE - 20, 130000, 24700, 154700, 'emitida');

INSERT INTO "inventario"."orden_trabajo" (
  "orden_trabajo_id_orden", "orden_trabajo_fecha_hora", "orden_trabajo_estado", "usuario_id_usuario"
) OVERRIDING SYSTEM VALUE VALUES (910001, CURRENT_TIMESTAMP, 'pendiente', 910001);

INSERT INTO "finanzas"."unidad_fisica_orden_trabajo" (
  "id_unidad_fisica_ot", "id_cotizacion", "id_detalle_cotizacion",
  "id_extension_producto_comercial", "id_familia_producto_comercial", "numero_unidad",
  "id_version_plantilla", "id_orden_trabajo", "planificacion_inicial", "planificacion_actual", "creado_por"
) VALUES (
  910001, 910001, 910001, 910001, 910001, 1, 910001, 910001,
  '{"origen":"fixture-064"}'::jsonb, '{"origen":"fixture-064"}'::jsonb, 910001
);

COMMIT;
