# Base de datos: diccionario y relaciones

**Proyecto:** Puertas Blindadas
**Documento:** 11
**Version:** 1.0
**Fecha de corte:** 2026-10-19 14:31 Hora verano Sudamérica Pacífico
**Rama:** `feature/terreno-agenda-visitas`
**SHA documentado:** `d0735003f88a6b6a5d540049866bd74a680c2e04`

> Alcance de evidencia: este manual describe el codigo, schema Prisma, migraciones, pruebas y documentacion presentes en el SHA indicado. Cuando una capacidad no puede demostrarse desde esas fuentes se marca como **NO CONFIRMADO EN EL REPOSITORIO**. Implementado, preparado, bloqueado, legacy y pendiente son estados distintos.

## Tabla de contenidos

{{TOC}}

## Como leer este documento

- **Comportamiento actual** significa que existe codigo operativo y evidencia verificable.
- **Preparado** significa que existen contratos, modelos o interfaz, pero falta una dependencia o activacion.
- **Bloqueado** significa que el sistema impide deliberadamente la operacion por seguridad o falta de autorizacion.
- **Pendiente** significa que no existe una implementacion completa demostrable.
- Las rutas de archivos se expresan desde `CODIGO/`.

## Convenciones
Prisma expresa modelos, campos, relaciones e indices. Las migraciones son la fuente de SQL historico; el schema representa el estado esperado actual. Nullable significa compatibilidad o ausencia valida, no permiso para inventar datos.
## Resumen por schema
| Schema | Modelos |
| --- | --- |
| finanzas | 203 |
| inventario | 38 |
| terreno | 42 |
## `finanzas.afp` (`afp`)
Definido en `Controladores/prisma/schema.prisma:13`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_afp | Int | @id @default(autoincrement()) |
| nombre_afp | String | @unique @db.VarChar(100) |
| estado_afp | String | @default("activo") @db.VarChar(20) |
| empleado | empleado[] |  |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.alerta_financiera` (`alerta_financiera`)
Definido en `Controladores/prisma/schema.prisma:23`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_alerta_financiera | Int | @id @default(autoincrement()) |
| tipo_alerta | String | @db.VarChar(80) |
| fecha_generacion | DateTime | @default(now()) @db.Timestamp(6) |
| descripcion_alerta | String |  |
| nivel_alerta | String | @default("media") @db.VarChar(30) |
| estado_alerta | String | @default("abierta") @db.VarChar(30) |
| fecha_cierre | DateTime? | @db.Timestamp(6) |
| observacion | String? |  |
| origen_alerta_financiera | origen_alerta_financiera[] |  |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.asignacion_pago_cliente` (`asignacion_pago_cliente`)
Definido en `Controladores/prisma/schema.prisma:38`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_asignacion_pago_cliente | Int | @id @default(autoincrement()) |
| id_pago_cliente | Int | @unique |
| id_nota_venta | Int |  |
| id_documento_tributario | Int? |  |
| id_hito_cobro | Int? |  |
| monto_asignado | Decimal | @db.Decimal(14, 2) |
| fecha_asignacion | DateTime | @default(now()) @db.Timestamp(6) |
| observacion | String? |  |
| documento_tributario | documento_tributario? | @relation(fields: [id_documento_tributario], references: [id_documento_tributario], onDelete: Restrict, onUpdate: NoAction, map: "fk_asignacion_pago_cliente_documento") |
| hito_cobro | hito_cobro? | @relation(fields: [id_hito_cobro], references: [id_hito_cobro], onDelete: Restrict, onUpdate: NoAction, map: "fk_asignacion_pago_cliente_hito") |
| nota_venta | nota_venta | @relation(fields: [id_nota_venta], references: [id_nota_venta], onDelete: Restrict, onUpdate: NoAction, map: "fk_asignacion_pago_cliente_nota") |
| pago_cliente | pago_cliente | @relation(fields: [id_pago_cliente], references: [id_pago_cliente], onUpdate: NoAction, map: "fk_asignacion_pago_cliente_pago") |
### Indices y restricciones declarativas
- `@@index([id_pago_cliente], map: "idx_asignacion_pago_cliente_pago")`
- `@@schema("finanzas")`
## `finanzas.asignacion_pago_proveedor` (`asignacion_pago_proveedor`)
Definido en `Controladores/prisma/schema.prisma:57`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_asignacion_pago_proveedor | Int | @id @default(autoincrement()) |
| id_pago_proveedor | Int |  |
| id_documento_compra_proveedor | Int |  |
| monto_asignado | Decimal | @db.Decimal(14, 2) |
| fecha_asignacion | DateTime | @default(now()) @db.Timestamp(6) |
| observacion | String? |  |
| documento_compra_proveedor | documento_compra_proveedor | @relation(fields: [id_documento_compra_proveedor], references: [id_documento_compra_proveedor], onUpdate: NoAction, map: "fk_asignacion_pago_proveedor_documento") |
| pago_proveedor | pago_proveedor | @relation(fields: [id_pago_proveedor], references: [id_pago_proveedor], onUpdate: NoAction, map: "fk_asignacion_pago_proveedor_pago") |
### Indices y restricciones declarativas
- `@@index([id_pago_proveedor], map: "idx_asignacion_pago_proveedor_pago")`
- `@@schema("finanzas")`
## `finanzas.cargo` (`cargo`)
Definido en `Controladores/prisma/schema.prisma:72`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_cargo | Int | @id @default(autoincrement()) |
| nombre_cargo | String | @unique @db.VarChar(100) |
| descripcion_cargo | String? |  |
| estado_cargo | String | @default("activo") @db.VarChar(20) |
| empleado | empleado[] |  |
| asignaciones_esquema_remuneracional | asignacion_esquema_remuneracional[] |  |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.cliente_financiero` (`cliente_financiero`)
Definido en `Controladores/prisma/schema.prisma:85`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| referencia_demostracion | String? | @unique @db.VarChar(80) |
| nivel_formalizacion | String | @default("formal") @db.VarChar(20) |
| saldo_favor_cliente | saldo_favor_cliente[] |  |
| id_cliente_financiero | Int | @id @default(autoincrement()) |
| rut_cliente | String? | @unique @db.VarChar(15) |
| id_tipo_cliente_financiero | Int |  |
| nombre_razon_social_referencia | String | @db.VarChar(150) |
| contacto_financiero | String? | @db.VarChar(150) |
| correo_financiero | String? | @db.VarChar(150) |
| telefono_financiero | String? | @db.VarChar(30) |
| estado_financiero | String | @default("activo") @db.VarChar(20) |
| fecha_actualizacion_datos_cliente | DateTime | @default(now()) @db.Timestamp(6) |
| tipo_cliente_financiero | tipo_cliente_financiero | @relation(fields: [id_tipo_cliente_financiero], references: [id_tipo_cliente_financiero], onUpdate: NoAction, map: "fk_cliente_financiero_tipo_cliente") |
| ficha_cliente | ficha_cliente? |  |
### Indices y restricciones declarativas
- `@@index([id_tipo_cliente_financiero], map: "idx_cliente_financiero_tipo")`
- `@@schema("finanzas")`
## `finanzas.concepto_remuneracion` (`concepto_remuneracion`)
Definido en `Controladores/prisma/schema.prisma:108`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_concepto_remuneracion | Int | @id @default(autoincrement()) |
| nombre_concepto | String | @unique @db.VarChar(100) |
| descripcion_concepto | String? |  |
| naturaleza_concepto | String | @db.VarChar(30) |
| estado_concepto | String | @default("activo") @db.VarChar(20) |
| codigo_m6 | String? | @unique @db.VarChar(40) |
| detalle_liquidacion_remuneracion | detalle_liquidacion_remuneracion[] |  |
| asignaciones_empleado_m6 | asignacion_concepto_remuneracion_empleado[] |  |
| configuraciones_m6 | configuracion_concepto_remuneracion[] |  |
| componentes_m6 | componente_remuneracion[] |  |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.conciliacion` (`conciliacion`)
Definido en `Controladores/prisma/schema.prisma:124`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_pago_cliente | Int? |  |
| evidencia | String? |  |
| pago_cliente | pago_cliente? | @relation(fields: [id_pago_cliente], references: [id_pago_cliente], onDelete: Restrict) |
| id_conciliacion | Int | @id @default(autoincrement()) |
| id_movimiento_financiero | Int? |  |
| id_movimiento_bancario | Int? |  |
| fecha_conciliacion | DateTime | @default(now()) @db.Timestamp(6) |
| monto_conciliado | Decimal | @db.Decimal(14, 2) |
| diferencia_conciliacion | Decimal? | @default(0) @db.Decimal(14, 2) |
| estado_conciliacion | String | @default("pendiente") @db.VarChar(30) |
| responsable_conciliacion | String? | @db.VarChar(150) |
| observacion | String? |  |
| movimiento_bancario | movimiento_bancario? | @relation(fields: [id_movimiento_bancario], references: [id_movimiento_bancario], onUpdate: NoAction, map: "fk_conciliacion_movimiento_bancario") |
| movimiento_financiero | movimiento_financiero? | @relation(fields: [id_movimiento_financiero], references: [id_movimiento_financiero], onUpdate: NoAction, map: "fk_conciliacion_movimiento_financiero") |
| detalle_conciliacion | detalle_conciliacion[] |  |
### Indices y restricciones declarativas
- `@@index([id_movimiento_financiero, id_movimiento_bancario], map: "idx_conciliacion_movimientos")`
- `@@schema("finanzas")`
## `finanzas.costo_proyecto` (`costo_proyecto`)
Definido en `Controladores/prisma/schema.prisma:148`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_costo_proyecto | Int | @id @default(autoincrement()) |
| id_proyecto_financiero | Int |  |
| id_moneda | Int |  |
| descripcion_costo | String |  |
| categoria_costo | String? | @db.VarChar(80) |
| monto_costo | Decimal | @db.Decimal(14, 2) |
| fecha_costo | DateTime | @db.Date |
| origen_costo | String? | @db.VarChar(80) |
| estado_costo | String | @default("registrado") @db.VarChar(30) |
| observacion | String? |  |
| moneda | moneda | @relation(fields: [id_moneda], references: [id_moneda], onUpdate: NoAction, map: "fk_costo_proyecto_moneda") |
| proyecto_financiero | proyecto_financiero | @relation(fields: [id_proyecto_financiero], references: [id_proyecto_financiero], onUpdate: NoAction, map: "fk_costo_proyecto_proyecto") |
| detalle_costo_proyecto_documento_proveedor | detalle_costo_proyecto_documento_proveedor[] |  |
### Indices y restricciones declarativas
- `@@index([id_proyecto_financiero], map: "idx_costo_proyecto_proyecto")`
- `@@schema("finanzas")`
## `finanzas.cotizacion` (`cotizacion`)
Definido en `Controladores/prisma/schema.prisma:168`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| referencia_demostracion | String? | @unique @db.VarChar(80) |
| exento_iva | Boolean | @default(false) |
| descuento_tipo | String? | @db.VarChar(20) |
| descuento_valor | Decimal | @default(0) @db.Decimal(14, 2) |
| monto_neto | Decimal? | @db.Decimal(14, 2) |
| monto_impuesto | Decimal? | @db.Decimal(14, 2) |
| cotizacion_version | cotizacion_version[] |  |
| orden_compra_b2b | orden_compra_b2b? |  |
| segmento_comercial | String? | @db.VarChar(3) |
| nombre_proyecto | String? | @db.VarChar(200) |
| referencia_comercial | String? | @db.VarChar(200) |
| alcance_comercial | String? | @db.VarChar(30) |
| requiere_instalacion | String? | @db.VarChar(20) |
| direccion_instalacion | String? | @db.VarChar(500) |
| region_instalacion | String? | @db.VarChar(120) |
| ciudad_instalacion | String? | @db.VarChar(120) |
| comuna_instalacion | String? | @db.VarChar(120) |
| estado_cobertura_instalacion | String? | @db.VarChar(30) |
| id_tarifa_instalacion_comercial | BigInt? |  |
| precio_instalacion_aplicado | Decimal? | @db.Decimal(14, 2) |
| id_condicion_comercial_version | BigInt? |  |
| responsable_comercial | BigInt? |  |
| id_obra_contexto | BigInt? |  |
| revision | Int | @default(1) |
| id_cotizacion | Int | @id @default(autoincrement()) |
| id_ficha_cliente | Int |  |
| id_moneda | Int |  |
| fecha_emision | DateTime | @db.Date |
| fecha_vigencia | DateTime? | @db.Date |
| subtotal_costos_estimados | Decimal | @default(0) @db.Decimal(14, 2) |
| margen_esperado | Decimal? | @db.Decimal(5, 2) |
| precio_sugerido | Decimal? | @db.Decimal(14, 2) |
| monto_total_estimado | Decimal? | @db.Decimal(14, 2) |
| estado_cotizacion | String | @default("emitida") @db.VarChar(30) |
| observacion | String? |  |
| ficha_cliente | ficha_cliente | @relation(fields: [id_ficha_cliente], references: [id_ficha_cliente], onUpdate: NoAction, map: "fk_cotizacion_ficha_cliente") |
| moneda | moneda | @relation(fields: [id_moneda], references: [id_moneda], onUpdate: NoAction, map: "fk_cotizacion_moneda") |
| detalle_cotizacion | detalle_cotizacion[] |  |
| nota_venta | nota_venta? |  |
| solicitudes_crediticias_m8 | solicitud_crediticia_m8[] |  |
| unidades_fisicas_ot | unidad_fisica_orden_trabajo[] |  |
| tarifa_instalacion | tarifa_instalacion_comercial? | @relation(fields: [id_tarifa_instalacion_comercial], references: [id_tarifa_instalacion_comercial], onDelete: Restrict, onUpdate: NoAction, map: "fk_cotizacion_tarifa_instalacion_comercial") |
| condicion_comercial | condicion_comercial_version? | @relation(fields: [id_condicion_comercial_version], references: [id_condicion_comercial_version], onDelete: Restrict, onUpdate: NoAction, map: "fk_cotizacion_condicion_comercial") |
| responsable | usuario? | @relation("cotizacion_responsable_comercial", fields: [responsable_comercial], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction, map: "fk_cotizacion_responsable_comercial") |
| obra_contexto | obra? | @relation("cotizacion_obra_contexto", fields: [id_obra_contexto], references: [obra_obra_id], onDelete: Restrict, onUpdate: NoAction, map: "fk_cotizacion_obra_contexto") |
| proyecto_originado | proyecto? | @relation("proyecto_cotizacion_origen") |
| grupos_alternativas_b2c | grupo_alternativas_b2c[] |  |
| contactos_b2b | contacto_cotizacion_b2b[] |  |
| detalles_servicio | detalle_servicio_cotizacion[] |  |
### Indices y restricciones declarativas
- `@@index([id_ficha_cliente], map: "idx_cotizacion_ficha")`
- `@@index([segmento_comercial, estado_cotizacion], map: "idx_cotizacion_segmento_estado")`
- `@@index([id_tarifa_instalacion_comercial], map: "idx_cotizacion_tarifa_instalacion")`
- `@@index([id_condicion_comercial_version], map: "idx_cotizacion_condicion_comercial")`
- `@@index([id_obra_contexto], map: "idx_cotizacion_obra_contexto")`
- `@@schema("finanzas")`
## `finanzas.credito_proyecto` (`credito_proyecto`)
Definido en `Controladores/prisma/schema.prisma:232`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_credito_proyecto | Int | @id @default(autoincrement()) |
| id_ficha_cliente | Int |  |
| id_proyecto_financiero | Int? |  |
| id_limite_credito_cliente | Int |  |
| id_fondo_global_credito | Int |  |
| id_evaluacion_credito | Int |  |
| monto_credito | Decimal | @db.Decimal(14, 2) |
| fecha_otorgamiento | DateTime | @db.Date |
| fecha_vencimiento | DateTime? | @db.Date |
| estado_credito | String | @default("vigente") @db.VarChar(30) |
| motivo_aprobacion | String? |  |
| observacion | String? |  |
| evaluacion_credito | evaluacion_credito | @relation(fields: [id_evaluacion_credito], references: [id_evaluacion_credito], onUpdate: NoAction, map: "fk_credito_proyecto_evaluacion") |
| ficha_cliente | ficha_cliente | @relation(fields: [id_ficha_cliente], references: [id_ficha_cliente], onUpdate: NoAction, map: "fk_credito_proyecto_ficha_cliente") |
| fondo_global_credito | fondo_global_credito | @relation(fields: [id_fondo_global_credito], references: [id_fondo_global_credito], onUpdate: NoAction, map: "fk_credito_proyecto_fondo") |
| limite_credito_cliente | limite_credito_cliente | @relation(fields: [id_limite_credito_cliente], references: [id_limite_credito_cliente], onUpdate: NoAction, map: "fk_credito_proyecto_limite") |
| proyecto_financiero | proyecto_financiero? | @relation(fields: [id_proyecto_financiero], references: [id_proyecto_financiero], onDelete: Restrict, onUpdate: NoAction, map: "fk_credito_proyecto_proyecto") |
### Indices y restricciones declarativas
- `@@index([id_ficha_cliente], map: "idx_credito_proyecto_ficha")`
- `@@schema("finanzas")`
## `finanzas.detalle_conciliacion` (`detalle_conciliacion`)
Definido en `Controladores/prisma/schema.prisma:256`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_detalle_conciliacion | Int | @id @default(autoincrement()) |
| id_conciliacion | Int |  |
| descripcion_diferencia | String? |  |
| monto_diferencia | Decimal? | @db.Decimal(14, 2) |
| tipo_diferencia | String? | @db.VarChar(50) |
| estado_revision | String | @default("pendiente") @db.VarChar(30) |
| observacion | String? |  |
| conciliacion | conciliacion | @relation(fields: [id_conciliacion], references: [id_conciliacion], onUpdate: NoAction, map: "fk_detalle_conciliacion_conciliacion") |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.detalle_costo_material_cotizacion` (`detalle_costo_material_cotizacion`)
Definido en `Controladores/prisma/schema.prisma:270`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_detalle_costo_material_cotizacion | Int | @id @default(autoincrement()) |
| id_detalle_cotizacion | Int |  |
| id_historial_precio_material | Int |  |
| cantidad_material_estimada | Decimal | @db.Decimal(14, 4) |
| precio_unitario_usado | Decimal | @db.Decimal(14, 2) |
| subtotal_material_estimado | Decimal | @db.Decimal(14, 2) |
| observacion | String? |  |
| detalle_cotizacion | detalle_cotizacion | @relation(fields: [id_detalle_cotizacion], references: [id_detalle_cotizacion], onUpdate: NoAction, map: "fk_detalle_costo_material_detalle_cotizacion") |
| historial_precio_material | historial_precio_material | @relation(fields: [id_historial_precio_material], references: [id_historial_precio_material], onUpdate: NoAction, map: "fk_detalle_costo_material_historial_precio") |
### Indices y restricciones declarativas
- `@@index([id_detalle_cotizacion], map: "idx_detalle_costo_material_detalle")`
- `@@schema("finanzas")`
## `finanzas.detalle_costo_proyecto_documento_proveedor` (`detalle_costo_proyecto_documento_proveedor`)
Definido en `Controladores/prisma/schema.prisma:286`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_detalle_costo_proyecto_documento_proveedor | Int | @id @default(autoincrement()) |
| id_documento_compra_proveedor | Int |  |
| id_costo_proyecto | Int |  |
| monto_imputado | Decimal | @db.Decimal(14, 2) |
| porcentaje_imputado | Decimal? | @db.Decimal(5, 2) |
| observacion | String? |  |
| costo_proyecto | costo_proyecto | @relation(fields: [id_costo_proyecto], references: [id_costo_proyecto], onUpdate: NoAction, map: "fk_detalle_costo_proyecto_costo") |
| documento_compra_proveedor | documento_compra_proveedor | @relation(fields: [id_documento_compra_proveedor], references: [id_documento_compra_proveedor], onUpdate: NoAction, map: "fk_detalle_costo_proyecto_documento") |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.detalle_cotizacion` (`detalle_cotizacion`)
Definido en `Controladores/prisma/schema.prisma:301`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_detalle_cotizacion | Int | @id @default(autoincrement()) |
| id_cotizacion | Int |  |
| id_item_comercial | Int |  |
| cantidad_item | Decimal | @default(1) @db.Decimal(12, 2) |
| medida_alto_referencial | Decimal? | @db.Decimal(10, 2) |
| medida_ancho_referencial | Decimal? | @db.Decimal(10, 2) |
| medida_espesor_referencial | Decimal? | @db.Decimal(10, 2) |
| descripcion_item_cotizado | String? |  |
| observacion_medidas | String? |  |
| subtotal_item_estimado | Decimal | @default(0) @db.Decimal(14, 2) |
| id_extension_producto_comercial | Int? |  |
| id_producto_comercial_version | Int? |  |
| id_precio_producto_comercial | BigInt? |  |
| id_alternativa_b2c_aceptada | BigInt? | @unique(map: "uq_detalle_cotizacion_alternativa_aceptada") |
| tipo_linea_comercial | String? | @db.VarChar(30) |
| precio_lista_aplicado | Decimal? | @db.Decimal(14, 2) |
| precio_unitario_autorizado | Decimal? | @db.Decimal(14, 2) |
| descuento_elegible | Boolean? |  |
| es_precio_excepcional | Boolean | @default(false) |
| motivo_precio_excepcional | String? |  |
| precio_excepcional_autorizado_por | BigInt? |  |
| snapshot_comercial | Json? |  |
| revision | Int | @default(1) |
| detalle_costo_material_cotizacion | detalle_costo_material_cotizacion[] |  |
| item_comercial | item_comercial | @relation(fields: [id_item_comercial], references: [id_item_comercial], onUpdate: NoAction, map: "fk_det_cot_item_ext") |
| cotizacion | cotizacion | @relation(fields: [id_cotizacion], references: [id_cotizacion], onUpdate: NoAction, map: "fk_detalle_cotizacion_cotizacion") |
| unidades_fisicas_ot | unidad_fisica_orden_trabajo[] |  |
| producto_comercial | extension_producto_comercial? | @relation(fields: [id_extension_producto_comercial], references: [id_extension_producto_comercial], onDelete: Restrict, onUpdate: NoAction, map: "fk_detalle_cotizacion_producto_comercial") |
| producto_version | producto_comercial_version? | @relation(fields: [id_producto_comercial_version], references: [id_producto_comercial_version], onDelete: Restrict, onUpdate: NoAction, map: "fk_detalle_cotizacion_producto_version") |
| precio_comercial | precio_producto_comercial? | @relation(fields: [id_precio_producto_comercial], references: [id_precio_producto_comercial], onDelete: Restrict, onUpdate: NoAction, map: "fk_detalle_cotizacion_precio_comercial") |
| alternativa_aceptada | alternativa_b2c? | @relation(fields: [id_alternativa_b2c_aceptada], references: [id_alternativa_b2c], onDelete: Restrict, onUpdate: NoAction, map: "fk_detalle_cotizacion_alternativa_aceptada") |
| autorizador_precio_excepcional | usuario? | @relation("detalle_cotizacion_precio_excepcional", fields: [precio_excepcional_autorizado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction, map: "fk_detalle_cotizacion_autorizador_precio") |
### Indices y restricciones declarativas
- `@@index([id_cotizacion], map: "idx_detalle_cotizacion_cotizacion")`
- `@@index([id_item_comercial], map: "idx_detalle_cotizacion_item")`
- `@@index([id_extension_producto_comercial, id_producto_comercial_version], map: "idx_detalle_cotizacion_producto_version")`
- `@@index([id_precio_producto_comercial], map: "idx_detalle_cotizacion_precio_comercial")`
- `@@schema("finanzas")`
## `finanzas.detalle_documento_compra_proveedor` (`detalle_documento_compra_proveedor`)
Definido en `Controladores/prisma/schema.prisma:343`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_detalle_documento_compra_proveedor | Int | @id @default(autoincrement()) |
| id_documento_compra_proveedor | Int |  |
| id_historial_precio_material | Int |  |
| cantidad_material | Decimal | @db.Decimal(14, 4) |
| unidad_medida | String? | @db.VarChar(30) |
| precio_unitario_documento | Decimal | @db.Decimal(14, 2) |
| subtotal_linea | Decimal | @db.Decimal(14, 2) |
| observacion | String? |  |
| documento_compra_proveedor | documento_compra_proveedor | @relation(fields: [id_documento_compra_proveedor], references: [id_documento_compra_proveedor], onUpdate: NoAction, map: "fk_detalle_documento_compra_documento") |
| historial_precio_material | historial_precio_material | @relation(fields: [id_historial_precio_material], references: [id_historial_precio_material], onUpdate: NoAction, map: "fk_detalle_documento_compra_historial") |
### Indices y restricciones declarativas
- `@@index([id_documento_compra_proveedor], map: "idx_detalle_doc_compra_documento")`
- `@@schema("finanzas")`
## `finanzas.detalle_evento_auditoria` (`detalle_evento_auditoria`)
Definido en `Controladores/prisma/schema.prisma:359`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_detalle_evento_auditoria | Int | @id @default(autoincrement()) |
| id_evento_auditoria | Int |  |
| atributo_modificado | String | @db.VarChar(100) |
| valor_anterior | String? |  |
| valor_nuevo | String? |  |
| observacion | String? |  |
| evento_auditoria | evento_auditoria | @relation(fields: [id_evento_auditoria], references: [id_evento_auditoria], onUpdate: NoAction, map: "fk_detalle_evento_auditoria_evento") |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.detalle_liquidacion_remuneracion` (`detalle_liquidacion_remuneracion`)
Definido en `Controladores/prisma/schema.prisma:372`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_detalle_liquidacion_remuneracion | Int | @id @default(autoincrement()) |
| id_liquidacion_remuneracion | Int |  |
| id_concepto_remuneracion | Int |  |
| monto_concepto | Decimal | @db.Decimal(14, 2) |
| observacion | String? |  |
| concepto_remuneracion | concepto_remuneracion | @relation(fields: [id_concepto_remuneracion], references: [id_concepto_remuneracion], onUpdate: NoAction, map: "fk_detalle_liquidacion_concepto") |
| liquidacion_remuneracion | liquidacion_remuneracion | @relation(fields: [id_liquidacion_remuneracion], references: [id_liquidacion_remuneracion], onUpdate: NoAction, map: "fk_detalle_liquidacion_liquidacion") |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.documento_compra_proveedor` (`documento_compra_proveedor`)
Definido en `Controladores/prisma/schema.prisma:385`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_documento_compra_proveedor | Int | @id @default(autoincrement()) |
| id_proveedor | Int |  |
| id_tipo_documento | Int |  |
| id_moneda | Int |  |
| numero_documento | String | @db.VarChar(80) |
| fecha_emision | DateTime | @db.Date |
| fecha_vencimiento | DateTime? | @db.Date |
| monto_neto | Decimal | @default(0) @db.Decimal(14, 2) |
| monto_impuesto | Decimal | @default(0) @db.Decimal(14, 2) |
| monto_total | Decimal | @default(0) @db.Decimal(14, 2) |
| tipo_cambio_usado | Decimal? | @db.Decimal(14, 4) |
| fecha_tipo_cambio | DateTime? | @db.Date |
| monto_convertido | Decimal? | @db.Decimal(14, 2) |
| estado_documento | String | @default("registrado") @db.VarChar(30) |
| respaldo_documento | String? |  |
| observacion | String? |  |
| asignacion_pago_proveedor | asignacion_pago_proveedor[] |  |
| detalle_costo_proyecto_documento_proveedor | detalle_costo_proyecto_documento_proveedor[] |  |
| detalle_documento_compra_proveedor | detalle_documento_compra_proveedor[] |  |
| moneda | moneda | @relation(fields: [id_moneda], references: [id_moneda], onUpdate: NoAction, map: "fk_documento_compra_proveedor_moneda") |
| proveedor | proveedor | @relation(fields: [id_proveedor], references: [id_proveedor], onUpdate: NoAction, map: "fk_documento_compra_proveedor_proveedor") |
| tipo_documento | tipo_documento | @relation(fields: [id_tipo_documento], references: [id_tipo_documento], onUpdate: NoAction, map: "fk_documento_compra_proveedor_tipo_documento") |
### Indices y restricciones declarativas
- `@@unique([id_proveedor, numero_documento, id_tipo_documento], map: "uq_documento_compra_proveedor_numero")`
- `@@index([id_proveedor], map: "idx_documento_compra_proveedor_proveedor")`
- `@@schema("finanzas")`
## `finanzas.documento_tributario` (`documento_tributario`)
Definido en `Controladores/prisma/schema.prisma:415`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| documento_tributario_nota_venta | documento_tributario_nota_venta[] |  |
| id_documento_tributario | Int | @id @default(autoincrement()) |
| id_ficha_cliente | Int |  |
| id_nota_venta | Int? |  |
| id_tipo_documento | Int |  |
| id_moneda | Int |  |
| id_documento_referencia | Int? |  |
| folio_documento | String | @db.VarChar(80) |
| fecha_emision | DateTime | @db.Date |
| fecha_vencimiento | DateTime? | @db.Date |
| monto_neto | Decimal | @default(0) @db.Decimal(14, 2) |
| monto_impuesto | Decimal | @default(0) @db.Decimal(14, 2) |
| monto_total | Decimal | @default(0) @db.Decimal(14, 2) |
| estado_documento | String | @default("emitido") @db.VarChar(30) |
| fecha_anulacion | DateTime? | @db.Timestamp(6) |
| respaldo_documento | String? |  |
| observacion | String? |  |
| asignacion_pago_cliente | asignacion_pago_cliente[] |  |
| ficha_cliente | ficha_cliente | @relation(fields: [id_ficha_cliente], references: [id_ficha_cliente], onUpdate: NoAction, map: "fk_documento_tributario_ficha_cliente") |
| moneda | moneda | @relation(fields: [id_moneda], references: [id_moneda], onUpdate: NoAction, map: "fk_documento_tributario_moneda") |
| nota_venta | nota_venta? | @relation(fields: [id_nota_venta], references: [id_nota_venta], onUpdate: NoAction, map: "fk_documento_tributario_nota_venta") |
| documento_tributario | documento_tributario? | @relation("documento_tributarioTodocumento_tributario", fields: [id_documento_referencia], references: [id_documento_tributario], onDelete: Restrict, onUpdate: NoAction, map: "fk_documento_tributario_referencia") |
| other_documento_tributario | documento_tributario[] | @relation("documento_tributarioTodocumento_tributario") |
| tipo_documento | tipo_documento | @relation(fields: [id_tipo_documento], references: [id_tipo_documento], onUpdate: NoAction, map: "fk_documento_tributario_tipo_documento") |
### Indices y restricciones declarativas
- `@@unique([id_tipo_documento, folio_documento], map: "uq_documento_tributario_folio")`
- `@@index([id_ficha_cliente], map: "idx_documento_tributario_ficha")`
- `@@index([id_nota_venta], map: "idx_documento_tributario_nota")`
- `@@schema("finanzas")`
## `finanzas.empleado` (`empleado`)
Definido en `Controladores/prisma/schema.prisma:449`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| cuenta_m4 | usuario? | @relation("empleado_m4") |
| id_empleado | Int | @unique @default(autoincrement()) |
| rut_empleado | String | @id @db.VarChar(15) |
| id_cargo | Int? |  |
| id_tipo_vinculo_laboral | Int? |  |
| id_prevision_salud | Int? |  |
| id_afp | Int? |  |
| nombres | String | @db.VarChar(120) |
| apellido_paterno | String | @db.VarChar(80) |
| apellido_materno | String? | @db.VarChar(80) |
| fecha_nacimiento | DateTime? | @db.Date |
| fecha_ingreso | DateTime? | @db.Date |
| sueldo_base | Decimal? | @db.Decimal(14, 2) |
| fecha_aplicacion_sueldo_base | DateTime? | @db.Date |
| seguro_cesantia | Boolean | @default(true) |
| seguro_cesantia_fundamento_exclusion | String? |  |
| estado_laboral | String | @default("activo") @db.VarChar(30) |
| correo_particular | String? | @db.VarChar(254) |
| telefono_particular | String? | @db.VarChar(30) |
| direccion_particular | String? |  |
| tipo_correo | String? | @db.VarChar(30) |
| consentimiento_electronico | Boolean? |  |
| canal_documental | String? | @db.VarChar(30) |
| afp | afp? | @relation(fields: [id_afp], references: [id_afp], onDelete: Restrict, onUpdate: NoAction, map: "fk_empleado_afp") |
| cargo | cargo? | @relation(fields: [id_cargo], references: [id_cargo], onDelete: Restrict, onUpdate: NoAction, map: "fk_empleado_cargo") |
| prevision_salud | prevision_salud? | @relation(fields: [id_prevision_salud], references: [id_prevision_salud], onDelete: Restrict, onUpdate: NoAction, map: "fk_empleado_prevision_salud") |
| tipo_vinculo_laboral | tipo_vinculo_laboral? | @relation(fields: [id_tipo_vinculo_laboral], references: [id_tipo_vinculo_laboral], onDelete: Restrict, onUpdate: NoAction, map: "fk_empleado_tipo_vinculo") |
| liquidacion_remuneracion | liquidacion_remuneracion[] |  |
| tarea_remunerable | tarea_remunerable[] |  |
| prestamo_herramientas | prestamo_herramientas[] |  |
| usuario | usuario[] |  |
| relaciones_laborales | relacion_laboral_empleado[] |  |
| asignaciones_esquema_remuneracional | asignacion_esquema_remuneracional[] |  |
| asignaciones_concepto_remuneracion | asignacion_concepto_remuneracion_empleado[] |  |
| tratamientos_remuneracionales | tratamiento_remuneracional_ejecucion[] |  |
| remuneraciones_m6 | remuneracion[] |  |
| anticipos_remuneracion_m6 | anticipo_remuneracion[] |  |
| cotizaciones_salud_m6 | cotizacion_salud_empleado[] |  |
| asignaciones_area_trabajo | asignacion_area_empleado[] |  |
| rectificaciones_ot | rectificacion_orden_trabajo[] |  |
| tareas_planificadas_ejecutables | tarea_ejecutable_unidad_ot[] |  |
| tareas_produccion_responsables | estado_tarea_produccion_ot[] |  |
| cambios_produccion_involucrados | historial_cambio_produccion_ot[] |  |
| ejecuciones_productivas_realizadas | atribucion_ejecucion_tarea_ot[] |  |
### Indices y restricciones declarativas
- `@@index([id_cargo], map: "idx_empleado_cargo")`
- `@@schema("finanzas")`
## `finanzas.asignacion_area_empleado` (`asignacion_area_empleado`)
Definido en `Controladores/prisma/schema.prisma:499`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_asignacion_area_empleado | Int | @id @default(autoincrement()) |
| id_empleado | Int |  |
| id_area_trabajo | BigInt |  |
| vigencia_desde | DateTime | @default(now()) @db.Timestamptz(6) |
| vigencia_hasta | DateTime? | @db.Timestamptz(6) |
| motivo | String |  |
| asignado_por | BigInt |  |
| finalizado_por | BigInt? |  |
| empleado | empleado | @relation(fields: [id_empleado], references: [id_empleado], onDelete: Restrict, onUpdate: NoAction) |
| area | area_trabajo | @relation(fields: [id_area_trabajo], references: [area_trabajo_id_area], onDelete: Restrict, onUpdate: NoAction) |
| asignador | usuario | @relation("area_empleado_asignador", fields: [asignado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
| finalizador | usuario? | @relation("area_empleado_finalizador", fields: [finalizado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
### Indices y restricciones declarativas
- `@@index([id_empleado, vigencia_desde])`
- `@@index([id_area_trabajo, vigencia_hasta])`
- `@@schema("finanzas")`
## `finanzas.configuracion_area_trabajo` (`configuracion_area_trabajo`)
Definido en `Controladores/prisma/schema.prisma:518`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_area_trabajo | BigInt | @id |
| descripcion | String? |  |
| revision | Int | @default(1) |
| actualizado_en | DateTime | @default(now()) @updatedAt @db.Timestamptz(6) |
| area | area_trabajo | @relation(fields: [id_area_trabajo], references: [area_trabajo_id_area], onDelete: Restrict, onUpdate: NoAction) |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.evaluacion_credito` (`evaluacion_credito`)
Definido en `Controladores/prisma/schema.prisma:529`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_evaluacion_credito | Int | @id @default(autoincrement()) |
| id_ficha_cliente | Int |  |
| fecha_evaluacion | DateTime | @db.Date |
| resultado_evaluacion | String | @db.VarChar(50) |
| puntaje_riesgo | Decimal? | @db.Decimal(6, 2) |
| comportamiento_pago_evaluado | String? |  |
| fundamento_evaluacion | String? |  |
| estado_evaluacion | String | @default("vigente") @db.VarChar(30) |
| observacion | String? |  |
| credito_proyecto | credito_proyecto[] |  |
| ficha_cliente | ficha_cliente | @relation(fields: [id_ficha_cliente], references: [id_ficha_cliente], onUpdate: NoAction, map: "fk_evaluacion_credito_ficha_cliente") |
| limite_credito_cliente | limite_credito_cliente[] |  |
### Indices y restricciones declarativas
- `@@index([id_ficha_cliente], map: "idx_evaluacion_credito_ficha")`
- `@@schema("finanzas")`
## `finanzas.evento_auditoria` (`evento_auditoria`)
Definido en `Controladores/prisma/schema.prisma:549`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_evento_auditoria | Int | @id @default(autoincrement()) |
| id_usuario | BigInt |  |
| fecha_evento | DateTime | @default(now()) @db.Timestamp(6) |
| tipo_evento | String | @db.VarChar(80) |
| entidad_afectada | String | @db.VarChar(80) |
| id_registro_afectado | Int |  |
| accion_realizada | String | @db.VarChar(100) |
| descripcion_evento | String? |  |
| resultado_evento | String | @default("registrado") @db.VarChar(30) |
| observacion | String? |  |
| detalle_evento_auditoria | detalle_evento_auditoria[] |  |
| usuario | usuario | @relation(fields: [id_usuario], references: [usuario_id_usuario], onUpdate: NoAction, map: "fk_evento_aud_usuario_ext") |
### Indices y restricciones declarativas
- `@@index([entidad_afectada, id_registro_afectado], map: "idx_evento_auditoria_entidad")`
- `@@index([id_usuario], map: "idx_evento_auditoria_usuario")`
- `@@schema("finanzas")`
## `finanzas.ficha_cliente` (`ficha_cliente`)
Definido en `Controladores/prisma/schema.prisma:569`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_ficha_cliente | Int | @id @default(autoincrement()) |
| id_cliente_financiero | Int | @unique |
| fecha_creacion | DateTime | @default(now()) @db.Timestamp(6) |
| estado_ficha | String | @default("activa") @db.VarChar(20) |
| fecha_ultima_revision | DateTime? | @db.Timestamp(6) |
| observacion_financiera_general | String? |  |
| cotizacion | cotizacion[] |  |
| credito_proyecto | credito_proyecto[] |  |
| documento_tributario | documento_tributario[] |  |
| evaluacion_credito | evaluacion_credito[] |  |
| cliente_financiero | cliente_financiero | @relation(fields: [id_cliente_financiero], references: [id_cliente_financiero], onUpdate: NoAction, map: "fk_ficha_cliente_cliente_financiero") |
| limite_credito_cliente | limite_credito_cliente[] |  |
| nota_venta | nota_venta[] |  |
| pago_cliente | pago_cliente[] |  |
| proyecto_financiero | proyecto_financiero[] |  |
| solicitudes_crediticias_m8 | solicitud_crediticia_m8[] |  |
| condicion_crediticia_m8 | condicion_crediticia_m8? |  |
| compromisos_credito_m8 | compromiso_credito_m8[] |  |
| eventos_credito_m8 | evento_credito_m8[] |  |
### Indices y restricciones declarativas
- `@@index([id_cliente_financiero], map: "idx_ficha_cliente_cliente")`
- `@@schema("finanzas")`
## `finanzas.fondo_global_credito` (`fondo_global_credito`)
Definido en `Controladores/prisma/schema.prisma:595`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_fondo_global_credito | Int | @id @default(autoincrement()) |
| fecha_calculo | DateTime | @db.Date |
| monto_disponible | Decimal | @db.Decimal(14, 2) |
| monto_comprometido | Decimal | @default(0) @db.Decimal(14, 2) |
| monto_restante | Decimal | @db.Decimal(14, 2) |
| estado_fondo | String | @default("vigente") @db.VarChar(30) |
| observacion | String? |  |
| credito_proyecto | credito_proyecto[] |  |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.gasto_caja_chica` (`gasto_caja_chica`)
Definido en `Controladores/prisma/schema.prisma:609`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_gasto_caja_chica | Int | @id @default(autoincrement()) |
| fecha_gasto | DateTime | @db.Date |
| monto_gasto | Decimal | @db.Decimal(14, 2) |
| descripcion_gasto | String |  |
| motivo_gasto | String? |  |
| categoria_gasto | String? | @db.VarChar(80) |
| responsable_gasto | String? | @db.VarChar(150) |
| respaldo_gasto | String? |  |
| estado_validacion | String | @default("pendiente") @db.VarChar(30) |
| observacion | String? |  |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.historial_precio_material` (`historial_precio_material`)
Definido en `Controladores/prisma/schema.prisma:626`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_historial_precio_material | Int | @id @default(autoincrement()) |
| material_sku | String | @db.VarChar(50) |
| id_proveedor | Int? |  |
| id_moneda | Int |  |
| precio_unitario | Decimal | @db.Decimal(14, 2) |
| tipo_cambio_usado | Decimal? | @db.Decimal(14, 4) |
| precio_unitario_convertido | Decimal? | @db.Decimal(14, 2) |
| fecha_registro | DateTime | @default(now()) @db.Timestamp(6) |
| fecha_vigencia_inicio | DateTime | @db.Date |
| fecha_vigencia_fin | DateTime? | @db.Date |
| estado_precio | String | @default("vigente") @db.VarChar(20) |
| observacion | String? |  |
| detalle_costo_material_cotizacion | detalle_costo_material_cotizacion[] |  |
| detalle_documento_compra_proveedor | detalle_documento_compra_proveedor[] |  |
| moneda | moneda | @relation(fields: [id_moneda], references: [id_moneda], onUpdate: NoAction, map: "fk_historial_precio_material_moneda") |
| proveedor | proveedor? | @relation(fields: [id_proveedor], references: [id_proveedor], onDelete: Restrict, onUpdate: NoAction, map: "fk_historial_precio_material_proveedor") |
| material | material | @relation(fields: [material_sku], references: [material_sku], onUpdate: NoAction, map: "fk_hpm_material_ext") |
### Indices y restricciones declarativas
- `@@index([id_proveedor], map: "idx_historial_precio_material_proveedor")`
- `@@index([material_sku], map: "idx_historial_precio_material_sku")`
- `@@schema("finanzas")`
## `finanzas.historial_tarifa_tarea` (`historial_tarifa_tarea`)
Definido en `Controladores/prisma/schema.prisma:651`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_historial_tarifa_tarea | Int | @id @default(autoincrement()) |
| id_tarea_catalogada | Int |  |
| valor_unitario_tarea | Decimal | @db.Decimal(14, 2) |
| fecha_vigencia_inicio | DateTime | @db.Date |
| fecha_vigencia_fin | DateTime? | @db.Date |
| estado_tarifa | String | @default("vigente") @db.VarChar(30) |
| observacion | String? |  |
| tarea_catalogada | tarea_catalogada | @relation(fields: [id_tarea_catalogada], references: [id_tarea_catalogada], onUpdate: NoAction, map: "fk_historial_tarifa_tarea_tarea") |
| tarea_remunerable | tarea_remunerable[] |  |
### Indices y restricciones declarativas
- `@@index([id_tarea_catalogada], map: "idx_historial_tarifa_tarea_tarea")`
- `@@schema("finanzas")`
## `finanzas.hito_cobro` (`hito_cobro`)
Definido en `Controladores/prisma/schema.prisma:667`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_hito_cobro | Int | @id @default(autoincrement()) |
| id_nota_venta | Int |  |
| id_proyecto_financiero | Int? |  |
| descripcion_hito | String | @db.VarChar(150) |
| fecha_programada_cobro | DateTime | @db.Date |
| monto_programado | Decimal | @db.Decimal(14, 2) |
| estado_hito | String | @default("pendiente") @db.VarChar(30) |
| fecha_pago_real | DateTime? | @db.Date |
| observacion | String? |  |
| asignacion_pago_cliente | asignacion_pago_cliente[] |  |
| nota_venta | nota_venta | @relation(fields: [id_nota_venta], references: [id_nota_venta], onUpdate: NoAction, map: "fk_hito_cobro_nota_venta") |
| proyecto_financiero | proyecto_financiero? | @relation(fields: [id_proyecto_financiero], references: [id_proyecto_financiero], onDelete: Restrict, onUpdate: NoAction, map: "fk_hito_cobro_proyecto_financiero") |
### Indices y restricciones declarativas
- `@@index([id_nota_venta], map: "idx_hito_cobro_nota")`
- `@@schema("finanzas")`
## `finanzas.limite_credito_cliente` (`limite_credito_cliente`)
Definido en `Controladores/prisma/schema.prisma:686`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_limite_credito_cliente | Int | @id @default(autoincrement()) |
| id_ficha_cliente | Int |  |
| id_evaluacion_credito | Int |  |
| monto_limite | Decimal | @db.Decimal(14, 2) |
| fecha_inicio_vigencia | DateTime | @db.Date |
| fecha_fin_vigencia | DateTime? | @db.Date |
| estado_limite | String | @default("vigente") @db.VarChar(30) |
| motivo_modificacion | String? |  |
| observacion | String? |  |
| credito_proyecto | credito_proyecto[] |  |
| evaluacion_credito | evaluacion_credito | @relation(fields: [id_evaluacion_credito], references: [id_evaluacion_credito], onUpdate: NoAction, map: "fk_limite_credito_cliente_evaluacion") |
| ficha_cliente | ficha_cliente | @relation(fields: [id_ficha_cliente], references: [id_ficha_cliente], onUpdate: NoAction, map: "fk_limite_credito_cliente_ficha") |
### Indices y restricciones declarativas
- `@@index([id_ficha_cliente], map: "idx_limite_credito_ficha")`
- `@@schema("finanzas")`
## `finanzas.liquidacion_remuneracion` (`liquidacion_remuneracion`)
Definido en `Controladores/prisma/schema.prisma:705`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_liquidacion_remuneracion | Int | @id @default(autoincrement()) |
| rut_empleado | String | @db.VarChar(15) |
| periodo_liquidacion | String | @db.VarChar(7) |
| fecha_generacion | DateTime | @db.Date |
| fecha_aprobacion | DateTime? | @db.Date |
| sueldo_base_periodo | Decimal | @db.Decimal(14, 2) |
| total_bonos | Decimal | @default(0) @db.Decimal(14, 2) |
| total_descuentos | Decimal | @default(0) @db.Decimal(14, 2) |
| total_haberes | Decimal | @default(0) @db.Decimal(14, 2) |
| total_liquido | Decimal | @default(0) @db.Decimal(14, 2) |
| estado_liquidacion | String | @default("generada") @db.VarChar(30) |
| respaldo_liquidacion | String? |  |
| observacion | String? |  |
| detalle_liquidacion_remuneracion | detalle_liquidacion_remuneracion[] |  |
| empleado | empleado | @relation(fields: [rut_empleado], references: [rut_empleado], onUpdate: NoAction, map: "fk_liquidacion_remuneracion_empleado") |
| tarea_remunerable | tarea_remunerable[] |  |
### Indices y restricciones declarativas
- `@@unique([rut_empleado, periodo_liquidacion], map: "uq_liquidacion_remuneracion_periodo")`
- `@@index([rut_empleado, periodo_liquidacion], map: "idx_liquidacion_empleado_periodo")`
- `@@schema("finanzas")`
## `finanzas.medio_pago` (`medio_pago`)
Definido en `Controladores/prisma/schema.prisma:729`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_medio_pago | Int | @id @default(autoincrement()) |
| nombre_medio_pago | String | @unique @db.VarChar(80) |
| descripcion_medio_pago | String? |  |
| estado_medio_pago | String | @default("activo") @db.VarChar(20) |
| codigo_medio_pago | String? | @unique @db.VarChar(40) |
| requiere_respaldo | Boolean? |  |
| pago_cliente | pago_cliente[] |  |
| pago_proveedor | pago_proveedor[] |  |
| pago_remuneracion | pago_remuneracion[] |  |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.moneda` (`moneda`)
Definido en `Controladores/prisma/schema.prisma:744`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_moneda | Int | @id @default(autoincrement()) |
| codigo_moneda | String | @unique @db.VarChar(10) |
| nombre_moneda | String | @db.VarChar(80) |
| simbolo_moneda | String? | @db.VarChar(10) |
| estado_moneda | String | @default("activo") @db.VarChar(20) |
| costo_proyecto | costo_proyecto[] |  |
| cotizacion | cotizacion[] |  |
| documento_compra_proveedor | documento_compra_proveedor[] |  |
| documento_tributario | documento_tributario[] |  |
| historial_precio_material | historial_precio_material[] |  |
| movimiento_bancario | movimiento_bancario[] |  |
| cuenta_bancaria_m7 | cuenta_bancaria_m7[] |  |
| movimiento_financiero | movimiento_financiero[] |  |
| nota_venta | nota_venta[] |  |
| pago_cliente | pago_cliente[] |  |
| pago_proveedor | pago_proveedor[] |  |
| proyeccion_financiera_m7 | proyeccion_financiera_m7[] |  |
| proveedor | proveedor[] |  |
| proyecto_financiero | proyecto_financiero[] |  |
| precios_producto_comercial | precio_producto_comercial[] |  |
| precios_opcional_comercial | precio_opcional_comercial[] |  |
| tarifas_instalacion | tarifa_instalacion_comercial[] |  |
| alternativas_b2c | alternativa_b2c[] |  |
| precios_servicio_comercial | precio_servicio_comercial[] |  |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.movimiento_bancario` (`movimiento_bancario`)
Definido en `Controladores/prisma/schema.prisma:774`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_movimiento_bancario | Int | @id @default(autoincrement()) |
| id_moneda | Int |  |
| id_cuenta_bancaria_m7 | Int? |  |
| fecha_movimiento_bancario | DateTime | @db.Timestamp(6) |
| monto_bancario | Decimal | @db.Decimal(14, 2) |
| descripcion_bancaria | String? |  |
| glosa_bancaria | String? |  |
| tipo_movimiento_bancario | String? | @db.VarChar(50) |
| naturaleza_bancaria | String? | @db.VarChar(10) |
| banco | String? | @db.VarChar(100) |
| cuenta_bancaria | String? | @db.VarChar(80) |
| numero_operacion | String? | @db.VarChar(100) |
| estado_conciliacion | String | @default("pendiente") @db.VarChar(30) |
| conciliacion | conciliacion[] |  |
| moneda | moneda | @relation(fields: [id_moneda], references: [id_moneda], onUpdate: NoAction, map: "fk_movimiento_bancario_moneda") |
| cuenta_bancaria_m7 | cuenta_bancaria_m7? | @relation(fields: [id_cuenta_bancaria_m7], references: [id_cuenta_bancaria_m7], onDelete: Restrict, onUpdate: NoAction, map: "fk_movimiento_bancario_cuenta_m7") |
### Indices y restricciones declarativas
- `@@index([fecha_movimiento_bancario], map: "idx_movimiento_bancario_fecha")`
- `@@index([id_cuenta_bancaria_m7, fecha_movimiento_bancario], map: "idx_movimiento_bancario_cuenta_fecha_m7")`
- `@@schema("finanzas")`
## `finanzas.cuenta_bancaria_m7` (`cuenta_bancaria_m7`)
Definido en `Controladores/prisma/schema.prisma:798`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_cuenta_bancaria_m7 | Int | @id @default(autoincrement()) |
| banco | String | @db.VarChar(100) |
| alias_cuenta | String | @db.VarChar(100) |
| identificador_bancario | String | @db.VarChar(120) |
| id_moneda | Int |  |
| estado | String | @default("activa") @db.VarChar(20) |
| creado_por | BigInt |  |
| fecha_creacion | DateTime | @default(now()) @db.Timestamptz(6) |
| actualizado_por | BigInt? |  |
| fecha_actualizacion | DateTime? | @db.Timestamptz(6) |
| moneda | moneda | @relation(fields: [id_moneda], references: [id_moneda], onDelete: Restrict, onUpdate: NoAction, map: "fk_cuenta_bancaria_m7_moneda") |
| creador | usuario | @relation("cuenta_bancaria_m7_creador", fields: [creado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
| actualizador | usuario? | @relation("cuenta_bancaria_m7_actualizador", fields: [actualizado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
| movimientos | movimiento_bancario[] |  |
| saldos_iniciales | saldo_inicial_bancario_m7[] |  |
### Indices y restricciones declarativas
- `@@unique([banco, identificador_bancario, id_moneda], map: "uq_cuenta_bancaria_m7_identidad")`
- `@@index([estado, id_moneda], map: "idx_cuenta_bancaria_m7_estado_moneda")`
- `@@schema("finanzas")`
## `finanzas.saldo_inicial_bancario_m7` (`saldo_inicial_bancario_m7`)
Definido en `Controladores/prisma/schema.prisma:821`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_saldo_inicial_bancario_m7 | Int | @id @default(autoincrement()) |
| id_cuenta_bancaria_m7 | Int |  |
| fecha_corte | DateTime | @db.Date |
| saldo_inicial | Decimal | @db.Decimal(14, 2) |
| observacion | String |  |
| estado | String | @default("activo") @db.VarChar(20) |
| creado_por | BigInt |  |
| fecha_creacion | DateTime | @default(now()) @db.Timestamptz(6) |
| actualizado_por | BigInt? |  |
| fecha_actualizacion | DateTime? | @db.Timestamptz(6) |
| cuenta | cuenta_bancaria_m7 | @relation(fields: [id_cuenta_bancaria_m7], references: [id_cuenta_bancaria_m7], onDelete: Restrict, onUpdate: NoAction, map: "fk_saldo_inicial_bancario_m7_cuenta") |
| creador | usuario | @relation("saldo_inicial_bancario_m7_creador", fields: [creado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
| actualizador | usuario? | @relation("saldo_inicial_bancario_m7_actualizador", fields: [actualizado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
### Indices y restricciones declarativas
- `@@unique([id_cuenta_bancaria_m7, fecha_corte], map: "uq_saldo_inicial_bancario_m7_cuenta_corte")`
- `@@index([fecha_corte, estado], map: "idx_saldo_inicial_bancario_m7_corte_estado")`
- `@@schema("finanzas")`
## `finanzas.movimiento_financiero` (`movimiento_financiero`)
Definido en `Controladores/prisma/schema.prisma:842`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_movimiento_financiero | Int | @id @default(autoincrement()) |
| id_moneda | Int |  |
| fecha_movimiento | DateTime | @default(now()) @db.Timestamp(6) |
| tipo_movimiento_financiero | String | @db.VarChar(50) |
| naturaleza_movimiento | String | @db.VarChar(30) |
| motivo_movimiento | String? |  |
| monto_movimiento | Decimal | @db.Decimal(14, 2) |
| estado_movimiento | String | @default("registrado") @db.VarChar(30) |
| observacion | String? |  |
| conciliacion | conciliacion[] |  |
| moneda | moneda | @relation(fields: [id_moneda], references: [id_moneda], onUpdate: NoAction, map: "fk_movimiento_financiero_moneda") |
| origen_movimiento_financiero | origen_movimiento_financiero[] |  |
### Indices y restricciones declarativas
- `@@index([fecha_movimiento], map: "idx_movimiento_financiero_fecha")`
- `@@schema("finanzas")`
## `finanzas.proyeccion_financiera_m7` (`proyeccion_financiera_m7`)
Definido en `Controladores/prisma/schema.prisma:861`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_proyeccion_financiera_m7 | Int | @id @default(autoincrement()) |
| tipo | String | @db.VarChar(30) |
| anio | Int |  |
| mes | Int |  |
| id_moneda | Int |  |
| categoria | String | @db.VarChar(50) |
| monto_proyectado | Decimal | @db.Decimal(14, 2) |
| observacion | String? |  |
| estado | String | @default("activo") @db.VarChar(20) |
| creado_por | BigInt |  |
| fecha_creacion | DateTime | @default(now()) @db.Timestamptz(6) |
| actualizado_por | BigInt? |  |
| fecha_actualizacion | DateTime? | @db.Timestamptz(6) |
| moneda | moneda | @relation(fields: [id_moneda], references: [id_moneda], onDelete: Restrict, onUpdate: NoAction, map: "fk_proyeccion_m7_moneda") |
| creador | usuario | @relation("proyeccion_m7_creador", fields: [creado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
| actualizador | usuario? | @relation("proyeccion_m7_actualizador", fields: [actualizado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
### Indices y restricciones declarativas
- `@@index([tipo, anio, mes, estado], map: "idx_proyeccion_m7_periodo")`
- `@@index([id_moneda, categoria], map: "idx_proyeccion_m7_moneda_categoria")`
- `@@schema("finanzas")`
## `finanzas.nota_venta` (`nota_venta`)
Definido en `Controladores/prisma/schema.prisma:885`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| exento_iva | Boolean | @default(false) |
| id_proyecto_contexto | BigInt? |  |
| proyecto_contexto | proyecto? | @relation(fields: [id_proyecto_contexto], references: [proyecto_proyecto_id], onDelete: Restrict) |
| guia_despacho | guia_despacho[] |  |
| condicion_cobro_nv | condicion_cobro_nv[] |  |
| reversion_nota_venta | reversion_nota_venta[] |  |
| documento_tributario_nota_venta | documento_tributario_nota_venta[] |  |
| saldo_favor_cliente | saldo_favor_cliente[] |  |
| aplicacion_saldo_favor | aplicacion_saldo_favor[] |  |
| id_nota_venta | Int | @id @default(autoincrement()) |
| id_ficha_cliente | Int |  |
| id_cotizacion | Int? | @unique |
| id_moneda | Int |  |
| numero_nota_venta | String | @unique @db.VarChar(50) |
| fecha_emision | DateTime | @db.Date |
| monto_neto | Decimal | @default(0) @db.Decimal(14, 2) |
| monto_impuesto | Decimal | @default(0) @db.Decimal(14, 2) |
| monto_total | Decimal | @default(0) @db.Decimal(14, 2) |
| tipo_cambio_usado | Decimal? | @db.Decimal(14, 4) |
| monto_convertido | Decimal? | @db.Decimal(14, 2) |
| estado_nota_venta | String | @default("emitida") @db.VarChar(30) |
| estado_pago | String | @default("pendiente") @db.VarChar(30) |
| descuento_aplicado | Decimal? | @default(0) @db.Decimal(14, 2) |
| motivo_descuento | String? |  |
| fecha_anulacion | DateTime? | @db.Timestamp(6) |
| motivo_anulacion | String? |  |
| observacion | String? |  |
| fecha_vencimiento | DateTime? | @db.Date |
| asignacion_pago_cliente | asignacion_pago_cliente[] |  |
| documento_tributario | documento_tributario[] |  |
| hito_cobro | hito_cobro[] |  |
| cotizacion | cotizacion? | @relation(fields: [id_cotizacion], references: [id_cotizacion], onDelete: Restrict, onUpdate: NoAction, map: "fk_nota_venta_cotizacion") |
| ficha_cliente | ficha_cliente | @relation(fields: [id_ficha_cliente], references: [id_ficha_cliente], onUpdate: NoAction, map: "fk_nota_venta_ficha_cliente") |
| moneda | moneda | @relation(fields: [id_moneda], references: [id_moneda], onUpdate: NoAction, map: "fk_nota_venta_moneda") |
| proyecto_financiero | proyecto_financiero[] |  |
| solicitudes_crediticias_m8 | solicitud_crediticia_m8[] |  |
| compromiso_credito_m8 | compromiso_credito_m8? |  |
### Indices y restricciones declarativas
- `@@index([id_ficha_cliente], map: "idx_nota_venta_ficha")`
- `@@schema("finanzas")`
## `finanzas.origen_alerta_financiera` (`origen_alerta_financiera`)
Definido en `Controladores/prisma/schema.prisma:931`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_origen_alerta_financiera | Int | @id @default(autoincrement()) |
| id_alerta_financiera | Int |  |
| entidad_origen | String | @db.VarChar(80) |
| id_registro_origen | Int |  |
| descripcion_origen | String? |  |
| alerta_financiera | alerta_financiera | @relation(fields: [id_alerta_financiera], references: [id_alerta_financiera], onUpdate: NoAction, map: "fk_origen_alerta_financiera_alerta") |
### Indices y restricciones declarativas
- `@@index([id_alerta_financiera], map: "idx_origen_alerta_alerta")`
- `@@schema("finanzas")`
## `finanzas.origen_movimiento_financiero` (`origen_movimiento_financiero`)
Definido en `Controladores/prisma/schema.prisma:944`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_origen_movimiento_financiero | Int | @id @default(autoincrement()) |
| id_movimiento_financiero | Int |  |
| entidad_origen | String | @db.VarChar(80) |
| id_registro_origen | Int |  |
| descripcion_origen | String? |  |
| movimiento_financiero | movimiento_financiero | @relation(fields: [id_movimiento_financiero], references: [id_movimiento_financiero], onUpdate: NoAction, map: "fk_origen_movimiento_financiero_movimiento") |
### Indices y restricciones declarativas
- `@@index([id_movimiento_financiero], map: "idx_origen_movimiento_financiero_movimiento")`
- `@@schema("finanzas")`
## `finanzas.pago_cliente` (`pago_cliente`)
Definido en `Controladores/prisma/schema.prisma:957`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| referencia_demostracion | String? | @unique @db.VarChar(80) |
| id_categoria_pago | Int? |  |
| cantidad_cuotas | Int? |  |
| antecedentes_medio | Json? |  |
| fecha_registro | DateTime | @default(now()) |
| estado_conciliacion | String | @default("pendiente") @db.VarChar(20) |
| categoria_pago | categoria_pago? | @relation(fields: [id_categoria_pago], references: [id_categoria_pago], onDelete: Restrict) |
| anulacion_pago | anulacion_pago? |  |
| reversion_pago | reversion_pago[] |  |
| conciliacion | conciliacion[] |  |
| id_pago_cliente | Int | @id @default(autoincrement()) |
| id_ficha_cliente | Int |  |
| id_moneda | Int |  |
| id_medio_pago | Int |  |
| fecha_pago | DateTime | @db.Date |
| monto_pago | Decimal | @db.Decimal(14, 2) |
| tipo_cambio_usado | Decimal? | @db.Decimal(14, 4) |
| monto_convertido | Decimal? | @db.Decimal(14, 2) |
| naturaleza_pago | String | @default("ingreso_cliente") @db.VarChar(30) |
| estado_verificacion | String | @default("pendiente") @db.VarChar(30) |
| comprobante_pago | String? |  |
| observacion | String? |  |
| asignacion_pago_cliente | asignacion_pago_cliente? |  |
| ficha_cliente | ficha_cliente | @relation(fields: [id_ficha_cliente], references: [id_ficha_cliente], onUpdate: NoAction, map: "fk_pago_cliente_ficha_cliente") |
| medio_pago | medio_pago | @relation(fields: [id_medio_pago], references: [id_medio_pago], onUpdate: NoAction, map: "fk_pago_cliente_medio_pago") |
| moneda | moneda | @relation(fields: [id_moneda], references: [id_moneda], onUpdate: NoAction, map: "fk_pago_cliente_moneda") |
| reducciones_credito_m8 | reduccion_compromiso_credito_m8[] |  |
### Indices y restricciones declarativas
- `@@index([id_ficha_cliente], map: "idx_pago_cliente_ficha")`
- `@@schema("finanzas")`
## `finanzas.pago_proveedor` (`pago_proveedor`)
Definido en `Controladores/prisma/schema.prisma:992`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_pago_proveedor | Int | @id @default(autoincrement()) |
| id_proveedor | Int |  |
| id_moneda | Int |  |
| id_medio_pago | Int |  |
| fecha_pago | DateTime | @db.Date |
| monto_pago | Decimal | @db.Decimal(14, 2) |
| tipo_cambio_usado | Decimal? | @db.Decimal(14, 4) |
| monto_convertido | Decimal? | @db.Decimal(14, 2) |
| estado_pago | String | @default("registrado") @db.VarChar(30) |
| comprobante_pago | String? |  |
| observacion | String? |  |
| asignacion_pago_proveedor | asignacion_pago_proveedor[] |  |
| medio_pago | medio_pago | @relation(fields: [id_medio_pago], references: [id_medio_pago], onUpdate: NoAction, map: "fk_pago_proveedor_medio_pago") |
| moneda | moneda | @relation(fields: [id_moneda], references: [id_moneda], onUpdate: NoAction, map: "fk_pago_proveedor_moneda") |
| proveedor | proveedor | @relation(fields: [id_proveedor], references: [id_proveedor], onUpdate: NoAction, map: "fk_pago_proveedor_proveedor") |
### Indices y restricciones declarativas
- `@@index([id_proveedor], map: "idx_pago_proveedor_proveedor")`
- `@@schema("finanzas")`
## `finanzas.pais` (`pais`)
Definido en `Controladores/prisma/schema.prisma:1014`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_pais | Int | @id @default(autoincrement()) |
| nombre_pais | String | @unique @db.VarChar(100) |
| codigo_iso_pais | String? | @db.VarChar(10) |
| estado_pais | String | @default("activo") @db.VarChar(20) |
| proveedor | proveedor[] |  |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.prevision_salud` (`prevision_salud`)
Definido en `Controladores/prisma/schema.prisma:1025`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_prevision_salud | Int | @id @default(autoincrement()) |
| nombre_prevision_salud | String | @unique @db.VarChar(100) |
| tipo_prevision_salud | String? | @db.VarChar(50) |
| estado_prevision_salud | String | @default("activo") @db.VarChar(20) |
| empleado | empleado[] |  |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.cotizacion_salud_empleado` (`cotizacion_salud_empleado`)
Definido en `Controladores/prisma/schema.prisma:1035`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_cotizacion_salud | Int | @id @default(autoincrement()) |
| id_empleado | Int |  |
| valor | Decimal | @db.Decimal(14, 6) |
| unidad | String | @db.VarChar(20) |
| vigencia_desde | DateTime | @db.Date |
| vigencia_hasta | DateTime? | @db.Date |
| activa | Boolean | @default(true) |
| empleado | empleado | @relation(fields: [id_empleado], references: [id_empleado], onDelete: Restrict, onUpdate: NoAction) |
### Indices y restricciones declarativas
- `@@unique([id_empleado, vigencia_desde], map: "uq_cotizacion_salud_empleado_vigencia")`
- `@@index([id_empleado, vigencia_desde, vigencia_hasta], map: "idx_cotizacion_salud_empleado_resolucion")`
- `@@schema("finanzas")`
## `finanzas.proveedor` (`proveedor`)
Definido en `Controladores/prisma/schema.prisma:1051`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_proveedor | Int | @id @default(autoincrement()) |
| id_tipo_identificador | Int |  |
| id_pais | Int? |  |
| id_moneda_preferente | Int? |  |
| identificador_tributario | String | @db.VarChar(50) |
| nombre_razon_social | String | @db.VarChar(150) |
| tipo_proveedor_m5 | String | @default("Ambos") @db.VarChar(30) |
| condicion_pago_dias_m5 | Int? |  |
| condicion_pago_tipo_m5 | String? | @db.VarChar(20) |
| nacionalidad_origen | String? | @db.VarChar(80) |
| contacto_proveedor | String? | @db.VarChar(150) |
| correo_proveedor | String? | @db.VarChar(150) |
| telefono_proveedor | String? | @db.VarChar(30) |
| direccion_proveedor | String? |  |
| estado_proveedor | String | @default("activo") @db.VarChar(30) |
| fecha_registro | DateTime | @default(dbgenerated("CURRENT_DATE")) @db.Date |
| documento_compra_proveedor | documento_compra_proveedor[] |  |
| historial_precio_material | historial_precio_material[] |  |
| pago_proveedor | pago_proveedor[] |  |
| moneda | moneda? | @relation(fields: [id_moneda_preferente], references: [id_moneda], onDelete: Restrict, onUpdate: NoAction, map: "fk_proveedor_moneda_preferente") |
| pais | pais? | @relation(fields: [id_pais], references: [id_pais], onDelete: Restrict, onUpdate: NoAction, map: "fk_proveedor_pais") |
| tipo_identificador | tipo_identificador | @relation(fields: [id_tipo_identificador], references: [id_tipo_identificador], onUpdate: NoAction, map: "fk_proveedor_tipo_identificador") |
| alerta_faltante_pedido | alerta_faltante_pedido[] |  |
| alerta_inventario | alerta_inventario[] |  |
| factura_compra | factura_compra[] |  |
| lote | lote[] |  |
| material_proveedor | material_proveedor[] |  |
| proveedor_contacto_correo | proveedor_contacto_correo[] |  |
| proveedor_contacto_telefono | proveedor_contacto_telefono[] |  |
| historial_proveedor_m5 | historial_proveedor_m5[] |  |
| orden_compra_servicio_m5 | orden_compra_servicio_m5[] |  |
### Indices y restricciones declarativas
- `@@unique([id_pais, id_tipo_identificador, identificador_tributario], map: "uq_proveedor_identidad_m5")`
- `@@index([id_pais, id_tipo_identificador, identificador_tributario], map: "idx_proveedor_identidad_m5")`
- `@@schema("finanzas")`
## `finanzas.historial_proveedor_m5` (`historial_proveedor_m5`)
Definido en `Controladores/prisma/schema.prisma:1090`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_historial_proveedor_m5 | Int | @id @default(autoincrement()) |
| id_proveedor | Int |  |
| campo | String | @db.VarChar(80) |
| valor_anterior | String? |  |
| valor_nuevo | String? |  |
| motivo | String? |  |
| usuario_id_usuario | BigInt |  |
| fecha_hora | DateTime | @default(now()) @db.Timestamptz(6) |
| proveedor | proveedor | @relation(fields: [id_proveedor], references: [id_proveedor], onDelete: Restrict, onUpdate: NoAction, map: "fk_historial_proveedor_m5_proveedor") |
| usuario | usuario | @relation(fields: [usuario_id_usuario], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction, map: "fk_historial_proveedor_m5_usuario") |
### Indices y restricciones declarativas
- `@@index([id_proveedor, fecha_hora], map: "idx_historial_proveedor_m5_proveedor_fecha")`
- `@@schema("finanzas")`
## `finanzas.orden_compra_servicio_m5` (`orden_compra_servicio_m5`)
Definido en `Controladores/prisma/schema.prisma:1107`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_orden_compra_servicio_m5 | Int | @id @default(autoincrement()) |
| id_proveedor | Int |  |
| monto_autorizado | Decimal | @db.Decimal(14, 2) |
| monto_autorizado_original | Decimal | @db.Decimal(14, 2) |
| estado_ocs | String | @default("abierta") @db.VarChar(20) |
| referencia | String? | @db.VarChar(150) |
| periodo | String? | @db.VarChar(50) |
| descripcion | String? |  |
| fecha_creacion | DateTime | @default(now()) @db.Timestamptz(6) |
| fecha_actualizacion | DateTime | @default(now()) @db.Timestamptz(6) |
| creado_por | BigInt |  |
| id_moneda | Int? |  |
| id_ficha_cliente_contexto | Int? |  |
| id_cotizacion_contexto | Int? |  |
| id_proyecto_financiero_contexto | Int? |  |
| id_orden_trabajo_contexto | BigInt? |  |
| fecha_esperada_recepcion | DateTime? | @db.Date |
| proveedor | proveedor | @relation(fields: [id_proveedor], references: [id_proveedor], onDelete: Restrict, onUpdate: NoAction, map: "fk_ocs_m5_proveedor") |
| usuario_creador | usuario | @relation("ocs_m5_creador", fields: [creado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction, map: "fk_ocs_m5_creador") |
| historial | historial_orden_compra_servicio_m5[] |  |
| ajustes | ajuste_orden_compra_servicio_m5[] |  |
| efectos_financieros | efecto_financiero_ocs_m5[] |  |
| detalles_material | detalle_material_orden_compra_m5[] |  |
### Indices y restricciones declarativas
- `@@index([id_proveedor, fecha_creacion], map: "idx_ocs_m5_proveedor_fecha")`
- `@@index([estado_ocs, fecha_creacion], map: "idx_ocs_m5_estado_fecha")`
- `@@schema("finanzas")`
## `finanzas.documento_proveedor_m5` (`documento_proveedor_m5`)
Definido en `Controladores/prisma/schema.prisma:1138`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_documento_m5 | Int | @id @default(autoincrement()) |
| id_proveedor | Int |  |
| clase | String | @db.VarChar(20) |
| id_tipo_documento | Int |  |
| folio | String | @db.VarChar(80) |
| folio_normalizado | String | @db.VarChar(80) |
| fecha_emision | DateTime | @db.Date |
| id_moneda | Int |  |
| monto_total | Decimal | @db.Decimal(14, 2) |
| estado | String | @default("borrador") @db.VarChar(20) |
| respaldo | String? |  |
| descripcion | String? |  |
| excepcion_sin_oc_tipo | String? | @db.VarChar(40) |
| excepcion_sin_oc_descripcion | String? |  |
| fecha_vencimiento | DateTime? | @db.Date |
| condicion_pago_dias_snapshot | Int? |  |
| condicion_pago_tipo_snapshot | String? | @db.VarChar(20) |
| vencimiento_justificacion | String? |  |
| carga_historica | Boolean | @default(false) |
| tipo_cambio | Decimal? | @db.Decimal(14, 4) |
| tipo_cambio_origen | String? | @db.VarChar(40) |
| tipo_cambio_justificacion | String? |  |
| tipo_cambio_usuario | BigInt? |  |
| tipo_cambio_fecha | DateTime? | @db.Timestamptz(6) |
| creado_por | BigInt |  |
| fecha_creacion | DateTime | @default(now()) @db.Timestamptz(6) |
| confirmado_por | BigInt? |  |
| fecha_confirmacion | DateTime? | @db.Timestamptz(6) |
### Indices y restricciones declarativas
- `@@index([id_proveedor, fecha_creacion], map: "idx_documento_m5_proveedor_fecha")`
- `@@index([estado, fecha_creacion], map: "idx_documento_m5_estado_fecha")`
- `@@schema("finanzas")`
## `finanzas.asociacion_documento_oc_m5` (`asociacion_documento_oc_m5`)
Definido en `Controladores/prisma/schema.prisma:1174`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_asociacion_m5 | Int | @id @default(autoincrement()) |
| id_documento_m5 | Int |  |
| tipo_orden | String | @db.VarChar(10) |
| id_ocs_m5 | Int? |  |
| id_orden_externa | String? | @db.VarChar(100) |
| monto_asignado | Decimal | @db.Decimal(14, 2) |
| estado_diferencia | String | @default("sin_evaluar") @db.VarChar(30) |
| es_documento_final | Boolean | @default(false) |
| justificacion | String? |  |
| monto_disponible_snapshot | Decimal? | @db.Decimal(14, 2) |
| monto_excedente | Decimal | @default(0) @db.Decimal(14, 2) |
| estado_excedente | String | @default("no_aplica") @db.VarChar(20) |
| excedente_solicitado_por | BigInt? |  |
| excedente_fecha_solicitud | DateTime? | @db.Timestamptz(6) |
| excedente_aprobado_por | BigInt? |  |
| excedente_fecha_resolucion | DateTime? | @db.Timestamptz(6) |
### Indices y restricciones declarativas
- `@@unique([id_documento_m5, id_ocs_m5], map: "uq_asociacion_documento_m5_ocs")`
- `@@index([id_documento_m5], map: "idx_asociacion_documento_m5")`
- `@@schema("finanzas")`
## `finanzas.categoria_egreso_m5` (`categoria_egreso_m5`)
Definido en `Controladores/prisma/schema.prisma:1198`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_categoria_egreso_m5 | Int | @id @default(autoincrement()) |
| nombre | String | @unique @db.VarChar(100) |
| activo | Boolean | @default(true) |
| nombre_normalizado | String | @unique(map: "uq_categoria_egreso_m5_nombre_normalizado") @db.VarChar(100) |
| creado_por | BigInt? |  |
| fecha_creacion | DateTime | @default(now()) @db.Timestamptz(6) |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.clasificacion_asociacion_m5` (`clasificacion_asociacion_m5`)
Definido en `Controladores/prisma/schema.prisma:1209`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_clasificacion_m5 | Int | @id @default(autoincrement()) |
| id_asociacion_m5 | Int |  |
| id_categoria_egreso_m5 | Int |  |
| monto | Decimal | @db.Decimal(14, 2) |
| nombre_categoria_snapshot | String? | @db.VarChar(100) |
### Indices y restricciones declarativas
- `@@unique([id_asociacion_m5, id_categoria_egreso_m5], map: "uq_clasificacion_m5_asociacion_categoria")`
- `@@index([id_asociacion_m5], map: "idx_clasificacion_m5_asociacion")`
- `@@schema("finanzas")`
## `finanzas.propuesta_imputacion_m5` (`propuesta_imputacion_m5`)
Definido en `Controladores/prisma/schema.prisma:1221`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_propuesta_imputacion_m5 | Int | @id @default(autoincrement()) |
| id_documento_m5 | Int |  |
| estado | String | @default("pendiente") @db.VarChar(20) |
| preparado_por | BigInt |  |
| fecha_preparacion | DateTime | @default(now()) @db.Timestamptz(6) |
| confirmado_por | BigInt? |  |
| fecha_confirmacion | DateTime? | @db.Timestamptz(6) |
### Indices y restricciones declarativas
- `@@index([id_documento_m5, estado], map: "idx_imputacion_m5_documento_estado")`
- `@@schema("finanzas")`
## `finanzas.detalle_imputacion_m5` (`detalle_imputacion_m5`)
Definido en `Controladores/prisma/schema.prisma:1234`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_detalle_imputacion_m5 | Int | @id @default(autoincrement()) |
| id_propuesta_imputacion_m5 | Int |  |
| id_clasificacion_m5 | Int |  |
| destino | String | @db.VarChar(20) |
| id_proyecto | BigInt? |  |
| id_orden_trabajo | BigInt? |  |
| monto | Decimal | @db.Decimal(14, 2) |
### Indices y restricciones declarativas
- `@@index([id_propuesta_imputacion_m5], map: "idx_detalle_imputacion_m5_propuesta")`
- `@@schema("finanzas")`
## `finanzas.obligacion_proveedor_m5` (`obligacion_proveedor_m5`)
Definido en `Controladores/prisma/schema.prisma:1248`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_obligacion_m5 | Int | @id @default(autoincrement()) |
| id_documento_m5 | Int | @unique |
| id_proveedor | Int |  |
| monto_original | Decimal | @db.Decimal(14, 2) |
| id_moneda | Int |  |
| saldo_inicial | Decimal | @db.Decimal(14, 2) |
| saldo_actual | Decimal | @db.Decimal(14, 2) |
| fecha_emision | DateTime | @db.Date |
| fecha_vencimiento | DateTime | @db.Date |
| estado_pago | String | @default("Pendiente") @db.VarChar(20) |
| condicion_temporal | String? | @db.VarChar(20) |
| condicion_pago_dias_snapshot | Int? |  |
| condicion_pago_tipo_snapshot | String? | @db.VarChar(20) |
| tipo_cambio | Decimal? | @db.Decimal(14, 4) |
| tipo_cambio_origen | String? | @db.VarChar(40) |
| fecha_generacion | DateTime | @default(now()) @db.Timestamptz(6) |
| generado_por | BigInt |  |
### Indices y restricciones declarativas
- `@@index([id_proveedor, fecha_vencimiento], map: "idx_obligacion_m5_proveedor_vencimiento")`
- `@@schema("finanzas")`
## `finanzas.operacion_pago_proveedor_m5` (`operacion_pago_proveedor_m5`)
Definido en `Controladores/prisma/schema.prisma:1272`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_operacion_pago_m5 | Int | @id @default(autoincrement()) |
| id_proveedor | Int |  |
| estado | String | @default("borrador") @db.VarChar(20) |
| fecha_efectiva_pago | DateTime? | @db.Date |
| creado_por | BigInt |  |
| fecha_creacion | DateTime | @default(now()) @db.Timestamptz(6) |
| preparado_por | BigInt? |  |
| fecha_preparacion | DateTime? | @db.Timestamptz(6) |
| confirmado_por | BigInt? |  |
| fecha_confirmacion | DateTime? | @db.Timestamptz(6) |
| descartado_por | BigInt? |  |
| fecha_descarte | DateTime? | @db.Timestamptz(6) |
| total_confirmado | Decimal? | @db.Decimal(14, 2) |
### Indices y restricciones declarativas
- `@@index([id_proveedor, estado, fecha_creacion], map: "idx_operacion_pago_m5_proveedor_estado")`
- `@@schema("finanzas")`
## `finanzas.movimiento_pago_proveedor_m5` (`movimiento_pago_proveedor_m5`)
Definido en `Controladores/prisma/schema.prisma:1292`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_movimiento_pago_m5 | Int | @id @default(autoincrement()) |
| id_operacion_pago_m5 | Int |  |
| id_obligacion_m5 | Int |  |
| id_medio_pago | Int |  |
| id_moneda | Int |  |
| monto_aplicado | Decimal | @db.Decimal(14, 2) |
| tasa_referencia | Decimal? | @db.Decimal(14, 4) |
| fuente_tasa | String? | @db.VarChar(80) |
| fecha_tasa | DateTime? | @db.Date |
| tasa_manual | Boolean | @default(false) |
| tasa_manual_justificacion | String? |  |
| tasa_manual_usuario | BigInt? |  |
| tasa_manual_fecha | DateTime? | @db.Timestamptz(6) |
| tasa_bancaria_efectiva | Decimal? | @db.Decimal(14, 4) |
| equivalente_clp | Decimal? | @db.Decimal(14, 2) |
| estado | String | @default("borrador") @db.VarChar(20) |
| fecha_creacion | DateTime | @default(now()) @db.Timestamptz(6) |
### Indices y restricciones declarativas
- `@@index([id_operacion_pago_m5, id_movimiento_pago_m5], map: "idx_movimiento_pago_m5_operacion")`
- `@@index([id_obligacion_m5], map: "idx_movimiento_pago_m5_obligacion")`
- `@@schema("finanzas")`
## `finanzas.respaldo_pago_proveedor_m5` (`respaldo_pago_proveedor_m5`)
Definido en `Controladores/prisma/schema.prisma:1317`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_respaldo_pago_m5 | Int | @id @default(autoincrement()) |
| nombre_archivo | String | @db.VarChar(255) |
| contenido | String |  |
| creado_por | BigInt |  |
| fecha_creacion | DateTime | @default(now()) @db.Timestamptz(6) |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.asociacion_respaldo_pago_m5` (`asociacion_respaldo_pago_m5`)
Definido en `Controladores/prisma/schema.prisma:1327`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_asociacion_respaldo_m5 | Int | @id @default(autoincrement()) |
| id_respaldo_pago_m5 | Int |  |
| id_operacion_pago_m5 | Int? |  |
| id_movimiento_pago_m5 | Int? |  |
### Indices y restricciones declarativas
- `@@index([id_respaldo_pago_m5], map: "idx_asociacion_respaldo_m5_respaldo")`
- `@@schema("finanzas")`
## `finanzas.anulacion_movimiento_pago_m5` (`anulacion_movimiento_pago_m5`)
Definido en `Controladores/prisma/schema.prisma:1338`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_anulacion_movimiento_m5 | Int | @id @default(autoincrement()) |
| id_movimiento_pago_m5 | Int | @unique |
| monto_anulado | Decimal | @db.Decimal(14, 2) |
| motivo | String |  |
| id_respaldo_pago_m5 | Int |  |
| usuario_id_usuario | BigInt |  |
| fecha_hora | DateTime | @default(now()) @db.Timestamptz(6) |
| grupo_operacion | String? | @db.VarChar(36) |
### Indices y restricciones declarativas
- `@@index([grupo_operacion], map: "idx_anulacion_pago_m5_grupo")`
- `@@schema("finanzas")`
## `finanzas.reversion_movimiento_pago_m5` (`reversion_movimiento_pago_m5`)
Definido en `Controladores/prisma/schema.prisma:1353`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_reversion_movimiento_m5 | Int | @id @default(autoincrement()) |
| id_movimiento_pago_m5 | Int |  |
| monto_revertido | Decimal | @db.Decimal(14, 2) |
| motivo | String |  |
| id_respaldo_pago_m5 | Int |  |
| usuario_id_usuario | BigInt |  |
| fecha_hora | DateTime | @default(now()) @db.Timestamptz(6) |
### Indices y restricciones declarativas
- `@@index([id_movimiento_pago_m5, fecha_hora], map: "idx_reversion_pago_m5_movimiento")`
- `@@schema("finanzas")`
## `finanzas.conciliacion_movimiento_pago_m5` (`conciliacion_movimiento_pago_m5`)
Definido en `Controladores/prisma/schema.prisma:1367`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_conciliacion_movimiento_m5 | Int | @id @default(autoincrement()) |
| id_movimiento_pago_m5 | Int |  |
| resultado | String | @db.VarChar(20) |
| observacion | String? |  |
| usuario_id_usuario | BigInt |  |
| fecha_hora | DateTime | @default(now()) @db.Timestamptz(6) |
### Indices y restricciones declarativas
- `@@index([id_movimiento_pago_m5, fecha_hora, id_conciliacion_movimiento_m5], map: "idx_conciliacion_pago_m5_movimiento")`
- `@@schema("finanzas")`
## `finanzas.ajuste_obligacion_proveedor_m5` (`ajuste_obligacion_proveedor_m5`)
Definido en `Controladores/prisma/schema.prisma:1380`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_ajuste_obligacion_m5 | Int | @id @default(autoincrement()) |
| id_documento_ajuste_m5 | Int | @unique |
| id_obligacion_m5 | Int |  |
| id_proveedor | Int |  |
| id_tipo_documento | Int |  |
| folio_normalizado | String | @db.VarChar(80) |
| id_moneda | Int |  |
| tipo_ajuste | String | @db.VarChar(2) |
| monto | Decimal | @db.Decimal(14, 2) |
| monto_aplicado_obligacion | Decimal | @default(0) @db.Decimal(14, 2) |
| monto_saldo_favor | Decimal | @default(0) @db.Decimal(14, 2) |
| estado | String | @db.VarChar(30) |
| creado_por | BigInt |  |
| fecha_creacion | DateTime | @default(now()) @db.Timestamptz(6) |
| anulado_por | BigInt? |  |
| fecha_anulacion | DateTime? | @db.Timestamptz(6) |
| motivo_anulacion | String? |  |
| id_respaldo_anulacion | Int? |  |
### Indices y restricciones declarativas
- `@@unique([id_proveedor, id_tipo_documento, folio_normalizado], map: "uq_ajuste_documental_m5_identidad")`
- `@@index([id_obligacion_m5, estado], map: "idx_ajuste_obligacion_m5_obligacion")`
- `@@schema("finanzas")`
## `finanzas.saldo_favor_proveedor_m5` (`saldo_favor_proveedor_m5`)
Definido en `Controladores/prisma/schema.prisma:1406`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_saldo_favor_m5 | Int | @id @default(autoincrement()) |
| id_proveedor | Int |  |
| id_ajuste_origen_m5 | Int | @unique |
| id_moneda | Int |  |
| monto_generado | Decimal | @db.Decimal(14, 2) |
| monto_disponible | Decimal | @db.Decimal(14, 2) |
| estado | String | @default("disponible") @db.VarChar(20) |
| fecha_creacion | DateTime | @default(now()) @db.Timestamptz(6) |
### Indices y restricciones declarativas
- `@@index([id_proveedor, id_moneda, estado], map: "idx_saldo_favor_m5_proveedor_moneda")`
- `@@schema("finanzas")`
## `finanzas.historial_respaldo_pago_m5` (`historial_respaldo_pago_m5`)
Definido en `Controladores/prisma/schema.prisma:1421`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_historial_respaldo_m5 | Int | @id @default(autoincrement()) |
| id_operacion_pago_m5 | Int |  |
| id_movimiento_pago_m5 | Int? |  |
| id_respaldo_anterior | Int |  |
| id_respaldo_nuevo | Int |  |
| motivo | String |  |
| usuario_id_usuario | BigInt |  |
| fecha_hora | DateTime | @default(now()) @db.Timestamptz(6) |
### Indices y restricciones declarativas
- `@@index([id_operacion_pago_m5, fecha_hora], map: "idx_historial_respaldo_m5_operacion")`
- `@@schema("finanzas")`
## `finanzas.compensacion_saldo_favor_m5` (`compensacion_saldo_favor_m5`)
Definido en `Controladores/prisma/schema.prisma:1435`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_compensacion_m5 | Int | @id @default(autoincrement()) |
| id_saldo_favor_m5 | Int |  |
| id_proveedor | Int |  |
| id_moneda | Int |  |
| monto_total | Decimal | @db.Decimal(14, 2) |
| estado | String | @default("confirmada") @db.VarChar(20) |
| creado_por | BigInt |  |
| fecha_creacion | DateTime | @default(now()) @db.Timestamptz(6) |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.detalle_compensacion_saldo_favor_m5` (`detalle_compensacion_saldo_favor_m5`)
Definido en `Controladores/prisma/schema.prisma:1448`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_detalle_compensacion_m5 | Int | @id @default(autoincrement()) |
| id_compensacion_m5 | Int |  |
| id_obligacion_m5 | Int |  |
| monto_aplicado | Decimal | @db.Decimal(14, 2) |
### Indices y restricciones declarativas
- `@@unique([id_compensacion_m5, id_obligacion_m5])`
- `@@index([id_obligacion_m5], map: "idx_detalle_compensacion_obligacion")`
- `@@schema("finanzas")`
## `finanzas.reversion_compensacion_m5` (`reversion_compensacion_m5`)
Definido en `Controladores/prisma/schema.prisma:1459`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_reversion_compensacion_m5 | Int | @id @default(autoincrement()) |
| id_detalle_compensacion_m5 | Int |  |
| monto_revertido | Decimal | @db.Decimal(14, 2) |
| motivo | String |  |
| id_respaldo_pago_m5 | Int |  |
| usuario_id_usuario | BigInt |  |
| fecha_hora | DateTime | @default(now()) @db.Timestamptz(6) |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.historial_categoria_egreso_m5` (`historial_categoria_egreso_m5`)
Definido en `Controladores/prisma/schema.prisma:1471`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_historial_categoria_m5 | Int | @id @default(autoincrement()) |
| id_categoria_egreso_m5 | Int |  |
| nombre_anterior | String? | @db.VarChar(100) |
| nombre_nuevo | String? | @db.VarChar(100) |
| activo_anterior | Boolean? |  |
| activo_nuevo | Boolean? |  |
| motivo | String? |  |
| usuario_id_usuario | BigInt |  |
| fecha_hora | DateTime | @default(now()) @db.Timestamptz(6) |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.config_umbral_reclasificacion_m5` (`config_umbral_reclasificacion_m5`)
Definido en `Controladores/prisma/schema.prisma:1485`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_configuracion | Int | @id |
| monto_clp | Decimal | @db.Decimal(14, 2) |
| actualizado_por | BigInt? |  |
| fecha_actualizacion | DateTime | @default(now()) @db.Timestamptz(6) |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.historial_umbral_reclasificacion_m5` (`historial_umbral_reclasificacion_m5`)
Definido en `Controladores/prisma/schema.prisma:1494`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_historial_umbral_m5 | Int | @id @default(autoincrement()) |
| monto_anterior_clp | Decimal | @db.Decimal(14, 2) |
| monto_nuevo_clp | Decimal | @db.Decimal(14, 2) |
| usuario_id_usuario | BigInt |  |
| fecha_hora | DateTime | @default(now()) @db.Timestamptz(6) |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.reclasificacion_egreso_m5` (`reclasificacion_egreso_m5`)
Definido en `Controladores/prisma/schema.prisma:1504`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_reclasificacion_m5 | Int | @id @default(autoincrement()) |
| id_documento_m5 | Int |  |
| monto_total | Decimal | @db.Decimal(14, 2) |
| monto_referencia_clp | Decimal | @db.Decimal(14, 2) |
| umbral_snapshot_clp | Decimal | @db.Decimal(14, 2) |
| motivo | String |  |
| estado | String | @db.VarChar(20) |
| solicitado_por | BigInt |  |
| fecha_solicitud | DateTime | @default(now()) @db.Timestamptz(6) |
| resuelto_por | BigInt? |  |
| fecha_resolucion | DateTime? | @db.Timestamptz(6) |
| motivo_rechazo | String? |  |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.detalle_reclasificacion_egreso_m5` (`detalle_reclasificacion_egreso_m5`)
Definido en `Controladores/prisma/schema.prisma:1521`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_detalle_reclasificacion_m5 | Int | @id @default(autoincrement()) |
| id_reclasificacion_m5 | Int |  |
| id_clasificacion_origen_m5 | Int |  |
| id_asociacion_m5 | Int |  |
| id_categoria_origen_m5 | Int |  |
| id_categoria_destino_m5 | Int |  |
| monto | Decimal | @db.Decimal(14, 2) |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.historial_ot_imputacion_m5` (`historial_ot_imputacion_m5`)
Definido en `Controladores/prisma/schema.prisma:1534`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_historial_ot_m5 | Int | @id @default(autoincrement()) |
| id_detalle_imputacion_m5 | Int |  |
| id_proyecto | BigInt |  |
| id_ot_anterior | BigInt? |  |
| id_ot_nueva | BigInt |  |
| monto_contexto | Decimal | @db.Decimal(14, 2) |
| motivo | String |  |
| usuario_id_usuario | BigInt |  |
| fecha_hora | DateTime | @default(now()) @db.Timestamptz(6) |
### Indices y restricciones declarativas
- `@@index([id_detalle_imputacion_m5, fecha_hora], map: "idx_historial_ot_imputacion_m5_detalle")`
- `@@schema("finanzas")`
## `finanzas.solicitud_reasignacion_costo_m5` (`solicitud_reasignacion_costo_m5`)
Definido en `Controladores/prisma/schema.prisma:1550`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_solicitud_reasignacion_m5 | Int | @id @default(autoincrement()) |
| id_detalle_origen_m5 | Int |  |
| monto_total | Decimal | @db.Decimal(14, 2) |
| motivo | String |  |
| estado | String | @default("pendiente") @db.VarChar(20) |
| excepcional_proyecto_cerrado | Boolean | @default(false) |
| justificacion_excepcion | String? |  |
| solicitado_por | BigInt |  |
| fecha_solicitud | DateTime | @default(now()) @db.Timestamptz(6) |
| resuelto_por | BigInt? |  |
| fecha_resolucion | DateTime? | @db.Timestamptz(6) |
| motivo_rechazo | String? |  |
### Indices y restricciones declarativas
- `@@index([id_detalle_origen_m5, estado], map: "idx_reasignacion_costo_m5_origen_estado")`
- `@@schema("finanzas")`
## `finanzas.detalle_reasignacion_costo_m5` (`detalle_reasignacion_costo_m5`)
Definido en `Controladores/prisma/schema.prisma:1568`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_detalle_reasignacion_m5 | Int | @id @default(autoincrement()) |
| id_solicitud_reasignacion_m5 | Int |  |
| destino | String | @db.VarChar(20) |
| id_proyecto | BigInt? |  |
| id_orden_trabajo | BigInt? |  |
| monto | Decimal | @db.Decimal(14, 2) |
### Indices y restricciones declarativas
- `@@index([id_solicitud_reasignacion_m5], map: "idx_detalle_reasignacion_m5_solicitud")`
- `@@schema("finanzas")`
## `finanzas.comision_bancaria_m5` (`comision_bancaria_m5`)
Definido en `Controladores/prisma/schema.prisma:1581`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_comision_bancaria_m5 | Int | @id @default(autoincrement()) |
| id_operacion_pago_m5 | Int |  |
| id_movimiento_pago_m5 | Int? |  |
| id_moneda | Int |  |
| monto | Decimal | @db.Decimal(14, 2) |
| equivalente_clp | Decimal? | @db.Decimal(14, 2) |
| fecha_comision | DateTime | @db.Date |
| descripcion | String |  |
| id_respaldo_pago_m5 | Int |  |
| registrado_por | BigInt |  |
| fecha_registro | DateTime | @default(now()) @db.Timestamptz(6) |
### Indices y restricciones declarativas
- `@@index([id_operacion_pago_m5, fecha_registro], map: "idx_comision_bancaria_m5_operacion")`
- `@@schema("finanzas")`
## `finanzas.envio_importacion_m5` (`envio_importacion_m5`)
Definido en `Controladores/prisma/schema.prisma:1599`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_envio_importacion_m5 | Int | @id @default(autoincrement()) |
| referencia | String | @db.VarChar(120) |
| referencia_normalizada | String | @unique(map: "uq_envio_importacion_m5_referencia") @db.VarChar(120) |
| fecha | DateTime | @db.Date |
| descripcion | String? |  |
| estado | String | @default("abierto") @db.VarChar(30) |
| creado_por | BigInt |  |
| fecha_creacion | DateTime | @default(now()) @db.Timestamptz(6) |
### Indices y restricciones declarativas
- `@@index([estado, fecha], map: "idx_envio_importacion_m5_estado_fecha")`
- `@@schema("finanzas")`
## `finanzas.envio_orden_compra_m5` (`envio_orden_compra_m5`)
Definido en `Controladores/prisma/schema.prisma:1613`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_envio_orden_m5 | Int | @id @default(autoincrement()) |
| id_envio_importacion_m5 | Int |  |
| tipo_orden | String | @db.VarChar(10) |
| id_ocs_m5 | Int? |  |
| id_orden_externa | String? | @db.VarChar(100) |
| asociado_por | BigInt |  |
| fecha_asociacion | DateTime | @default(now()) @db.Timestamptz(6) |
### Indices y restricciones declarativas
- `@@unique([id_envio_importacion_m5, id_ocs_m5], map: "uq_envio_orden_m5_ocs")`
- `@@unique([id_envio_importacion_m5, tipo_orden, id_orden_externa], map: "uq_envio_orden_m5_externa")`
- `@@index([id_envio_importacion_m5], map: "idx_envio_orden_m5_envio")`
- `@@schema("finanzas")`
## `finanzas.costo_envio_importacion_m5` (`costo_envio_importacion_m5`)
Definido en `Controladores/prisma/schema.prisma:1628`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_costo_envio_m5 | Int | @id @default(autoincrement()) |
| id_envio_importacion_m5 | Int |  |
| tipo_costo | String | @db.VarChar(40) |
| fuente | String | @db.VarChar(20) |
| id_obligacion_m5 | Int? | @unique(map: "uq_costo_envio_m5_obligacion") |
| id_comision_bancaria_m5 | Int? | @unique(map: "uq_costo_envio_m5_comision") |
| id_moneda | Int |  |
| monto | Decimal | @db.Decimal(14, 2) |
| equivalente_clp | Decimal? | @db.Decimal(14, 2) |
| descripcion | String? |  |
| id_respaldo_pago_m5 | Int? |  |
| registrado_por | BigInt |  |
| fecha_registro | DateTime | @default(now()) @db.Timestamptz(6) |
### Indices y restricciones declarativas
- `@@index([id_envio_importacion_m5, id_moneda], map: "idx_costo_envio_m5_envio_moneda")`
- `@@schema("finanzas")`
## `finanzas.historial_envio_importacion_m5` (`historial_envio_importacion_m5`)
Definido en `Controladores/prisma/schema.prisma:1647`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_historial_envio_m5 | Int | @id @default(autoincrement()) |
| id_envio_importacion_m5 | Int |  |
| evento | String | @db.VarChar(40) |
| detalle | String |  |
| usuario_id_usuario | BigInt |  |
| fecha_hora | DateTime | @default(now()) @db.Timestamptz(6) |
### Indices y restricciones declarativas
- `@@index([id_envio_importacion_m5, fecha_hora], map: "idx_historial_envio_m5_envio")`
- `@@schema("finanzas")`
## `finanzas.fondo_caja_chica_m5` (`fondo_caja_chica_m5`)
Definido en `Controladores/prisma/schema.prisma:1660`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_fondo_caja_chica_m5 | Int | @id @default(autoincrement()) |
| anio | Int |  |
| mes | Int |  |
| monto | Decimal | @db.Decimal(14, 2) |
| actualizado_por | BigInt |  |
| fecha_actualizacion | DateTime | @default(now()) @db.Timestamptz(6) |
### Indices y restricciones declarativas
- `@@unique([anio, mes], map: "uq_fondo_caja_chica_m5_periodo")`
- `@@schema("finanzas")`
## `finanzas.historial_fondo_caja_chica_m5` (`historial_fondo_caja_chica_m5`)
Definido en `Controladores/prisma/schema.prisma:1672`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_historial_fondo_m5 | Int | @id @default(autoincrement()) |
| id_fondo_caja_chica_m5 | Int |  |
| monto_anterior | Decimal | @db.Decimal(14, 2) |
| monto_nuevo | Decimal | @db.Decimal(14, 2) |
| usuario_id_usuario | BigInt |  |
| fecha_hora | DateTime | @default(now()) @db.Timestamptz(6) |
### Indices y restricciones declarativas
- `@@index([id_fondo_caja_chica_m5, fecha_hora], map: "idx_historial_fondo_caja_m5")`
- `@@schema("finanzas")`
## `finanzas.gasto_caja_chica_m5` (`gasto_caja_chica_m5`)
Definido en `Controladores/prisma/schema.prisma:1685`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_gasto_caja_chica_m5 | Int | @id @default(autoincrement()) |
| anio | Int |  |
| mes | Int |  |
| monto | Decimal | @db.Decimal(14, 2) |
| descripcion | String |  |
| fecha_gasto | DateTime | @db.Date |
| comercio_emisor | String? | @db.VarChar(200) |
| estado | String | @default("pendiente") @db.VarChar(20) |
| registrado_por | BigInt |  |
| fecha_registro | DateTime | @default(now()) @db.Timestamptz(6) |
| resuelto_por | BigInt? |  |
| fecha_resolucion | DateTime? | @db.Timestamptz(6) |
| condicion_aprobacion | String? | @db.VarChar(20) |
| motivo_rechazo | String? |  |
### Indices y restricciones declarativas
- `@@index([anio, mes, estado], map: "idx_gasto_caja_chica_m5_periodo_estado")`
- `@@schema("finanzas")`
## `finanzas.respaldo_gasto_caja_chica_m5` (`respaldo_gasto_caja_chica_m5`)
Definido en `Controladores/prisma/schema.prisma:1705`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_respaldo_gasto_m5 | Int | @id @default(autoincrement()) |
| id_gasto_caja_chica_m5 | Int |  |
| nombre_archivo | String | @db.VarChar(255) |
| contenido | String |  |
| tipo_respaldo | String? | @db.VarChar(40) |
| comercio_emisor | String? | @db.VarChar(200) |
| adjuntado_por | BigInt |  |
| fecha_hora | DateTime | @default(now()) @db.Timestamptz(6) |
### Indices y restricciones declarativas
- `@@index([id_gasto_caja_chica_m5, fecha_hora], map: "idx_respaldo_gasto_caja_m5")`
- `@@schema("finanzas")`
## `finanzas.historial_gasto_caja_chica_m5` (`historial_gasto_caja_chica_m5`)
Definido en `Controladores/prisma/schema.prisma:1719`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_historial_gasto_m5 | Int | @id @default(autoincrement()) |
| id_gasto_caja_chica_m5 | Int |  |
| evento | String | @db.VarChar(30) |
| detalle | String |  |
| usuario_id_usuario | BigInt |  |
| fecha_hora | DateTime | @default(now()) @db.Timestamptz(6) |
### Indices y restricciones declarativas
- `@@index([id_gasto_caja_chica_m5, fecha_hora], map: "idx_historial_gasto_caja_m5")`
- `@@schema("finanzas")`
## `finanzas.feriado_chile_m5` (`feriado_chile_m5`)
Definido en `Controladores/prisma/schema.prisma:1732`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| fecha | DateTime | @id @db.Date |
| descripcion | String | @db.VarChar(150) |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.config_umbral_por_vencer_m5` (`config_umbral_por_vencer_m5`)
Definido en `Controladores/prisma/schema.prisma:1740`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_config_umbral_m5 | Int | @id @default(autoincrement()) |
| dias_habiles | Int |  |
| usuario_id_usuario | BigInt |  |
| fecha_hora | DateTime | @default(now()) @db.Timestamptz(6) |
### Indices y restricciones declarativas
- `@@index([fecha_hora, id_config_umbral_m5], map: "idx_config_umbral_m5_vigente")`
- `@@schema("finanzas")`
## `finanzas.historial_orden_compra_servicio_m5` (`historial_orden_compra_servicio_m5`)
Definido en `Controladores/prisma/schema.prisma:1751`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_historial_ocs_m5 | Int | @id @default(autoincrement()) |
| id_ocs_m5 | Int |  |
| campo | String | @db.VarChar(80) |
| valor_anterior | String? |  |
| valor_nuevo | String? |  |
| motivo | String? |  |
| usuario_id_usuario | BigInt |  |
| fecha_hora | DateTime | @default(now()) @db.Timestamptz(6) |
| orden_compra | orden_compra_servicio_m5 | @relation(fields: [id_ocs_m5], references: [id_orden_compra_servicio_m5], onDelete: Restrict, onUpdate: NoAction, map: "fk_historial_ocs_m5_ocs") |
| usuario | usuario | @relation(fields: [usuario_id_usuario], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction, map: "fk_historial_ocs_m5_usuario") |
### Indices y restricciones declarativas
- `@@index([id_ocs_m5, fecha_hora], map: "idx_historial_ocs_m5_ocs_fecha")`
- `@@schema("finanzas")`
## `finanzas.ajuste_orden_compra_servicio_m5` (`ajuste_orden_compra_servicio_m5`)
Definido en `Controladores/prisma/schema.prisma:1768`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_ajuste_ocs_m5 | Int | @id @default(autoincrement()) |
| id_ocs_m5 | Int |  |
| campo | String | @db.VarChar(80) |
| valor_anterior | String? |  |
| valor_propuesto | String? |  |
| motivo | String |  |
| solicitado_por | BigInt |  |
| fecha_solicitud | DateTime | @default(now()) @db.Timestamptz(6) |
| estado | String | @default("pendiente") @db.VarChar(20) |
| confirmado_por | BigInt? |  |
| fecha_confirmacion | DateTime? | @db.Timestamptz(6) |
| orden_compra | orden_compra_servicio_m5 | @relation(fields: [id_ocs_m5], references: [id_orden_compra_servicio_m5], onDelete: Restrict, onUpdate: NoAction, map: "fk_ajuste_ocs_m5_ocs") |
| usuario_solicitante | usuario | @relation("ajuste_ocs_solicitante", fields: [solicitado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction, map: "fk_ajuste_ocs_m5_solicitante") |
| usuario_confirmante | usuario? | @relation("ajuste_ocs_confirmante", fields: [confirmado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction, map: "fk_ajuste_ocs_m5_confirmante") |
### Indices y restricciones declarativas
- `@@index([id_ocs_m5, estado], map: "idx_ajuste_ocs_m5_ocs_estado")`
- `@@schema("finanzas")`
## `finanzas.efecto_financiero_ocs_m5` (`efecto_financiero_ocs_m5`)
Definido en `Controladores/prisma/schema.prisma:1789`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_efecto_financiero_ocs_m5 | Int | @id @default(autoincrement()) |
| id_ocs_m5 | Int |  |
| tipo_efecto | String | @db.VarChar(40) |
| referencia | String? | @db.VarChar(150) |
| monto_documentado | Decimal | @default(0) @db.Decimal(14, 2) |
| fecha_registro | DateTime | @default(now()) @db.Timestamptz(6) |
| orden_compra | orden_compra_servicio_m5 | @relation(fields: [id_ocs_m5], references: [id_orden_compra_servicio_m5], onDelete: Restrict, onUpdate: NoAction, map: "fk_efecto_ocs_m5_ocs") |
### Indices y restricciones declarativas
- `@@index([id_ocs_m5], map: "idx_efecto_ocs_m5_ocs")`
- `@@schema("finanzas")`
## `finanzas.proyecto_financiero` (`proyecto_financiero`)
Definido en `Controladores/prisma/schema.prisma:1804`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_proyecto_financiero | Int | @id @default(autoincrement()) |
| id_ficha_cliente | Int |  |
| id_nota_venta | Int? |  |
| id_proyecto_terreno | BigInt? |  |
| id_moneda | Int |  |
| codigo_proyecto_financiero | String | @unique @db.VarChar(80) |
| fecha_inicio_financiera | DateTime? | @db.Date |
| fecha_cierre_financiera | DateTime? | @db.Date |
| estado_financiero_proyecto | String | @default("activo") @db.VarChar(30) |
| monto_venta_estimado | Decimal? | @db.Decimal(14, 2) |
| monto_costo_estimado | Decimal? | @db.Decimal(14, 2) |
| monto_costo_real | Decimal? | @db.Decimal(14, 2) |
| margen_estimado | Decimal? | @db.Decimal(14, 2) |
| margen_real | Decimal? | @db.Decimal(14, 2) |
| observacion_financiera | String? |  |
| costo_proyecto | costo_proyecto[] |  |
| credito_proyecto | credito_proyecto[] |  |
| hito_cobro | hito_cobro[] |  |
| proyecto | proyecto? | @relation(fields: [id_proyecto_terreno], references: [proyecto_proyecto_id], onDelete: Restrict, onUpdate: NoAction, map: "fk_proy_fin_terreno_ext") |
| ficha_cliente | ficha_cliente | @relation(fields: [id_ficha_cliente], references: [id_ficha_cliente], onUpdate: NoAction, map: "fk_proyecto_financiero_ficha_cliente") |
| moneda | moneda | @relation(fields: [id_moneda], references: [id_moneda], onUpdate: NoAction, map: "fk_proyecto_financiero_moneda") |
| nota_venta | nota_venta? | @relation(fields: [id_nota_venta], references: [id_nota_venta], onDelete: Restrict, onUpdate: NoAction, map: "fk_proyecto_financiero_nota_venta") |
| tarea_remunerable | tarea_remunerable[] |  |
### Indices y restricciones declarativas
- `@@index([id_ficha_cliente], map: "idx_proyecto_financiero_ficha")`
- `@@index([id_proyecto_terreno], map: "idx_proyecto_financiero_terreno")`
- `@@schema("finanzas")`
## `finanzas.tarea_catalogada` (`tarea_catalogada`)
Definido en `Controladores/prisma/schema.prisma:1835`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_tarea_catalogada | Int | @id @default(autoincrement()) |
| nombre_tarea | String | @unique @db.VarChar(120) |
| descripcion_tarea | String? |  |
| estado_tarea | String | @default("activa") @db.VarChar(30) |
| historial_tarifa_tarea | historial_tarifa_tarea[] |  |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.tarea_remunerable` (`tarea_remunerable`)
Definido en `Controladores/prisma/schema.prisma:1847`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_tarea_remunerable | Int | @id @default(autoincrement()) |
| rut_empleado | String | @db.VarChar(15) |
| id_historial_tarifa_tarea | Int |  |
| id_proyecto_financiero | Int? |  |
| id_liquidacion_remuneracion | Int? |  |
| id_orden_trabajo | BigInt? |  |
| fecha_tarea | DateTime | @db.Date |
| cantidad_realizada | Decimal | @db.Decimal(12, 2) |
| estado_validacion | String | @default("pendiente") @db.VarChar(30) |
| monto_calculado | Decimal | @default(0) @db.Decimal(14, 2) |
| referencia_unidad_terminada | String? | @db.VarChar(100) |
| observacion | String? |  |
| orden_trabajo | orden_trabajo? | @relation(fields: [id_orden_trabajo], references: [orden_trabajo_id_orden], onDelete: Restrict, onUpdate: NoAction, map: "fk_tarea_rem_orden_ext") |
| empleado | empleado | @relation(fields: [rut_empleado], references: [rut_empleado], onUpdate: NoAction, map: "fk_tarea_remunerable_empleado") |
| liquidacion_remuneracion | liquidacion_remuneracion? | @relation(fields: [id_liquidacion_remuneracion], references: [id_liquidacion_remuneracion], onDelete: Restrict, onUpdate: NoAction, map: "fk_tarea_remunerable_liquidacion") |
| proyecto_financiero | proyecto_financiero? | @relation(fields: [id_proyecto_financiero], references: [id_proyecto_financiero], onDelete: Restrict, onUpdate: NoAction, map: "fk_tarea_remunerable_proyecto") |
| historial_tarifa_tarea | historial_tarifa_tarea | @relation(fields: [id_historial_tarifa_tarea], references: [id_historial_tarifa_tarea], onUpdate: NoAction, map: "fk_tarea_remunerable_tarifa") |
### Indices y restricciones declarativas
- `@@index([rut_empleado], map: "idx_tarea_remunerable_empleado")`
- `@@index([id_orden_trabajo], map: "idx_tarea_remunerable_orden")`
- `@@schema("finanzas")`
## `finanzas.tipo_cliente_financiero` (`tipo_cliente_financiero`)
Definido en `Controladores/prisma/schema.prisma:1872`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_tipo_cliente_financiero | Int | @id @default(autoincrement()) |
| nombre_tipo_cliente_financiero | String | @unique @db.VarChar(80) |
| descripcion_tipo_cliente_financiero | String? |  |
| estado_tipo_cliente_financiero | String | @default("activo") @db.VarChar(20) |
| cliente_financiero | cliente_financiero[] |  |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.tipo_documento` (`tipo_documento`)
Definido en `Controladores/prisma/schema.prisma:1883`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_tipo_documento | Int | @id @default(autoincrement()) |
| nombre_tipo_documento | String | @unique @db.VarChar(80) |
| descripcion_tipo_documento | String? |  |
| aplica_venta | Boolean | @default(false) |
| aplica_compra | Boolean | @default(false) |
| requiere_vencimiento | Boolean | @default(false) |
| afecta_impuesto | Boolean | @default(true) |
| estado_tipo_documento | String | @default("activo") @db.VarChar(20) |
| documento_compra_proveedor | documento_compra_proveedor[] |  |
| documento_tributario | documento_tributario[] |  |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.tipo_identificador` (`tipo_identificador`)
Definido en `Controladores/prisma/schema.prisma:1899`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_tipo_identificador | Int | @id @default(autoincrement()) |
| nombre_tipo_identificador | String | @unique @db.VarChar(80) |
| descripcion_tipo_identificador | String? |  |
| estado_tipo_identificador | String | @default("activo") @db.VarChar(20) |
| proveedor | proveedor[] |  |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.tipo_vinculo_laboral` (`tipo_vinculo_laboral`)
Definido en `Controladores/prisma/schema.prisma:1910`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_tipo_vinculo_laboral | Int | @id @default(autoincrement()) |
| nombre_tipo_vinculo_laboral | String | @unique @db.VarChar(80) |
| descripcion_tipo_vinculo_laboral | String? |  |
| estado_tipo_vinculo_laboral | String | @default("activo") @db.VarChar(20) |
| empleado | empleado[] |  |
| relaciones_laborales | relacion_laboral_empleado[] |  |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.relacion_laboral_empleado` (`relacion_laboral_empleado`)
Definido en `Controladores/prisma/schema.prisma:1921`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_relacion_laboral_empleado | Int | @id @default(autoincrement()) |
| id_empleado | Int |  |
| fecha_inicio | DateTime | @db.Date |
| fecha_termino | DateTime? | @db.Date |
| estado | String | @default("vigente") @db.VarChar(20) |
| id_tipo_vinculo_laboral | Int? |  |
| jornada | String? | @db.VarChar(80) |
| empleado | empleado | @relation(fields: [id_empleado], references: [id_empleado], onDelete: Restrict, onUpdate: NoAction, map: "fk_relacion_laboral_empleado") |
| tipo_vinculo_laboral | tipo_vinculo_laboral? | @relation(fields: [id_tipo_vinculo_laboral], references: [id_tipo_vinculo_laboral], onDelete: Restrict, onUpdate: NoAction, map: "fk_relacion_laboral_tipo_vinculo") |
### Indices y restricciones declarativas
- `@@index([id_empleado, fecha_inicio], map: "idx_relacion_laboral_empleado_fecha")`
- `@@schema("finanzas")`
## `finanzas.esquema_remuneracional` (`esquema_remuneracional`)
Definido en `Controladores/prisma/schema.prisma:1936`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_esquema_remuneracional | Int | @id @default(autoincrement()) |
| codigo | String | @unique @db.VarChar(40) |
| nombre | String | @unique @db.VarChar(120) |
| descripcion | String? |  |
| estado | String | @default("activo") @db.VarChar(20) |
| vigencia_desde | DateTime | @db.Date |
| vigencia_hasta | DateTime? | @db.Date |
| asignaciones | asignacion_esquema_remuneracional[] |  |
| tarifas | tarifa_esquema_remuneracional[] |  |
| tratamientos_remuneracionales | tratamiento_remuneracional_ejecucion[] |  |
### Indices y restricciones declarativas
- `@@index([estado, vigencia_desde], map: "idx_esquema_remuneracional_estado_vigencia")`
- `@@schema("finanzas")`
## `finanzas.asignacion_esquema_remuneracional` (`asignacion_esquema_remuneracional`)
Definido en `Controladores/prisma/schema.prisma:1952`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_asignacion_esquema | Int | @id @default(autoincrement()) |
| id_esquema | Int |  |
| id_empleado | Int? |  |
| id_cargo | Int? |  |
| vigencia_desde | DateTime | @db.Date |
| vigencia_hasta | DateTime? | @db.Date |
| activa | Boolean | @default(true) |
| esquema | esquema_remuneracional | @relation(fields: [id_esquema], references: [id_esquema_remuneracional], onDelete: Restrict, onUpdate: NoAction) |
| empleado | empleado? | @relation(fields: [id_empleado], references: [id_empleado], onDelete: Restrict, onUpdate: NoAction) |
| cargo | cargo? | @relation(fields: [id_cargo], references: [id_cargo], onDelete: Restrict, onUpdate: NoAction) |
### Indices y restricciones declarativas
- `@@index([id_empleado, vigencia_desde], map: "idx_asignacion_esquema_empleado")`
- `@@index([id_cargo, vigencia_desde], map: "idx_asignacion_esquema_cargo")`
- `@@schema("finanzas")`
## `finanzas.asignacion_concepto_remuneracion_empleado` (`asignacion_concepto_remuneracion_empleado`)
Definido en `Controladores/prisma/schema.prisma:1969`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_asignacion_concepto | Int | @id @default(autoincrement()) |
| id_empleado | Int |  |
| id_concepto | Int |  |
| vigencia_desde | DateTime | @db.Date |
| vigencia_hasta | DateTime? | @db.Date |
| valor_aplicable | Decimal? | @db.Decimal(14, 4) |
| activa | Boolean | @default(true) |
| fundamento | String? |  |
| autorizacion_referencia | String? | @db.VarChar(200) |
| empleado | empleado | @relation(fields: [id_empleado], references: [id_empleado], onDelete: Restrict, onUpdate: NoAction) |
| concepto | concepto_remuneracion | @relation(fields: [id_concepto], references: [id_concepto_remuneracion], onDelete: Restrict, onUpdate: NoAction) |
### Indices y restricciones declarativas
- `@@index([id_empleado, vigencia_desde], map: "idx_asignacion_concepto_empleado")`
- `@@index([id_concepto, vigencia_desde], map: "idx_asignacion_concepto_concepto")`
- `@@schema("finanzas")`
## `finanzas.tarifa_esquema_remuneracional` (`tarifa_esquema_remuneracional`)
Definido en `Controladores/prisma/schema.prisma:1987`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_tarifa_esquema | Int | @id @default(autoincrement()) |
| id_esquema | Int |  |
| modalidad | String | @db.VarChar(20) |
| valor | Decimal? | @db.Decimal(14, 4) |
| regla_tipo | String? | @db.VarChar(40) |
| referencia | String? | @db.VarChar(120) |
| unidad | String? | @db.VarChar(30) |
| tipo_aplicacion | String? | @db.VarChar(20) |
| vigencia_desde | DateTime | @db.Date |
| vigencia_hasta | DateTime? | @db.Date |
| es_excepcion | Boolean | @default(false) |
| estado_revision | String | @default("pendiente") @db.VarChar(20) |
| causa_bloqueo | String? |  |
| esquema | esquema_remuneracional | @relation(fields: [id_esquema], references: [id_esquema_remuneracional], onDelete: Restrict, onUpdate: NoAction) |
| tratamientos_remuneracionales | tratamiento_remuneracional_ejecucion[] |  |
### Indices y restricciones declarativas
- `@@index([id_esquema, vigencia_desde], map: "idx_tarifa_esquema_vigencia")`
- `@@schema("finanzas")`
## `finanzas.detalle_material_orden_compra_m5` (`detalle_material_orden_compra_m5`)
Definido en `Controladores/prisma/schema.prisma:2009`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_detalle_material_oc_m5 | Int | @id @default(autoincrement()) |
| id_ocs_m5 | Int |  |
| material_sku | String | @db.VarChar(16) |
| cantidad_pedida | Decimal | @db.Decimal(12, 4) |
| cantidad_recibida | Decimal | @default(0) @db.Decimal(12, 4) |
| fecha_esperada | DateTime? | @db.Date |
| orden_compra | orden_compra_servicio_m5 | @relation(fields: [id_ocs_m5], references: [id_orden_compra_servicio_m5], onDelete: Restrict, onUpdate: NoAction) |
| material | material | @relation(fields: [material_sku], references: [material_sku], onDelete: Restrict, onUpdate: NoAction) |
### Indices y restricciones declarativas
- `@@unique([id_ocs_m5, material_sku], map: "uq_detalle_material_oc_m5")`
- `@@index([material_sku, fecha_esperada], map: "idx_detalle_material_oc_m5_material_fecha")`
- `@@schema("finanzas")`
## `finanzas.tratamiento_remuneracional_ejecucion` (`tratamiento_remuneracional_ejecucion`)
Definido en `Controladores/prisma/schema.prisma:2024`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_tratamiento_remuneracional | Int | @id @default(autoincrement()) |
| id_ejecucion_tarea | BigInt | @unique |
| id_empleado | Int? |  |
| estado_remunerabilidad | String | @default("pendiente") @db.VarChar(30) |
| estado_valorizacion | String | @default("pendiente") @db.VarChar(30) |
| motivo | String? |  |
| id_esquema | Int? |  |
| id_tarifa | Int? |  |
| valor_propuesto | Decimal? | @db.Decimal(14, 4) |
| creado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| actualizado_en | DateTime | @updatedAt @db.Timestamptz(6) |
| ejecucion | ejecucion_tarea | @relation(fields: [id_ejecucion_tarea], references: [id_ejecucion_tarea], onDelete: Restrict, onUpdate: NoAction) |
| empleado | empleado? | @relation(fields: [id_empleado], references: [id_empleado], onDelete: Restrict, onUpdate: NoAction) |
| esquema | esquema_remuneracional? | @relation(fields: [id_esquema], references: [id_esquema_remuneracional], onDelete: Restrict, onUpdate: NoAction) |
| tarifa | tarifa_esquema_remuneracional? | @relation(fields: [id_tarifa], references: [id_tarifa_esquema], onDelete: Restrict, onUpdate: NoAction) |
| decisiones_retrabajo | decision_remuneracional_retrabajo[] |  |
### Indices y restricciones declarativas
- `@@index([estado_remunerabilidad, estado_valorizacion], map: "idx_tratamiento_remuneracional_estado")`
- `@@index([id_empleado], map: "idx_tratamiento_remuneracional_empleado")`
- `@@schema("finanzas")`
## `finanzas.decision_remuneracional_retrabajo` (`decision_remuneracional_retrabajo`)
Definido en `Controladores/prisma/schema.prisma:2047`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_decision_retrabajo | Int | @id @default(autoincrement()) |
| id_incidencia_retrabajo | BigInt | @unique |
| id_tratamiento_remuneracional | Int |  |
| decision | String | @db.VarChar(30) |
| motivo | String |  |
| id_usuario_resolutor | BigInt |  |
| fecha_resolucion | DateTime | @default(now()) @db.Timestamptz(6) |
| incidencia | incidencia_retrabajo_tarea | @relation(fields: [id_incidencia_retrabajo], references: [id_incidencia_retrabajo], onDelete: Restrict, onUpdate: NoAction) |
| tratamiento | tratamiento_remuneracional_ejecucion | @relation(fields: [id_tratamiento_remuneracional], references: [id_tratamiento_remuneracional], onDelete: Restrict, onUpdate: NoAction) |
| resolutor | usuario | @relation("decision_retrabajo_resolutor", fields: [id_usuario_resolutor], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
### Indices y restricciones declarativas
- `@@index([id_tratamiento_remuneracional], map: "idx_decision_retrabajo_tratamiento")`
- `@@schema("finanzas")`
## `finanzas.periodo_remuneracion` (`periodo_remuneracion`)
Definido en `Controladores/prisma/schema.prisma:2063`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_periodo_remuneracion | Int | @id @default(autoincrement()) |
| anio | Int |  |
| mes | Int |  |
| fecha_inicio | DateTime | @db.Date |
| fecha_fin | DateTime | @db.Date |
| creado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| cerrado_en | DateTime? | @db.Timestamptz(6) |
| cerrado_por | BigInt? |  |
| remuneraciones | remuneracion[] |  |
| anticipos | anticipo_remuneracion[] |  |
| cerrador | usuario? | @relation("periodo_remuneracion_cerrador", fields: [cerrado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
### Indices y restricciones declarativas
- `@@unique([anio, mes], map: "uq_periodo_remuneracion_anio_mes")`
- `@@schema("finanzas")`
## `finanzas.remuneracion` (`remuneracion`)
Definido en `Controladores/prisma/schema.prisma:2080`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_remuneracion | Int | @id @default(autoincrement()) |
| id_periodo_remuneracion | Int |  |
| id_empleado | Int |  |
| reemplaza_a_id | Int? |  |
| estado | String | @default("abierta") @db.VarChar(20) |
| creado_por | BigInt |  |
| creado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| calculado_en | DateTime? | @db.Timestamptz(6) |
| calculado_por | BigInt? |  |
| total_haberes | Decimal? | @db.Decimal(14, 4) |
| total_deducciones | Decimal? | @db.Decimal(14, 4) |
| total_aportes_empleador | Decimal? | @db.Decimal(14, 4) |
| total_descuentos_previsionales | Decimal? | @db.Decimal(14, 4) |
| total_impuesto | Decimal? | @db.Decimal(14, 4) |
| total_otras_deducciones | Decimal? | @db.Decimal(14, 4) |
| costo_empresa | Decimal? | @db.Decimal(14, 4) |
| snapshot_previsional | Json? |  |
| base_imponible | Decimal? | @db.Decimal(14, 4) |
| base_tributable | Decimal? | @db.Decimal(14, 4) |
| liquido_preliminar | Decimal? | @db.Decimal(14, 4) |
| cerrado_en | DateTime? | @db.Timestamptz(6) |
| cerrado_por | BigInt? |  |
| reapertura_solicitada_en | DateTime? | @db.Timestamptz(6) |
| reapertura_solicitada_por | BigInt? |  |
| reapertura_motivo | String? |  |
| reapertura_aprobada_en | DateTime? | @db.Timestamptz(6) |
| reapertura_aprobada_por | BigInt? |  |
| periodo | periodo_remuneracion | @relation(fields: [id_periodo_remuneracion], references: [id_periodo_remuneracion], onDelete: Restrict, onUpdate: NoAction) |
| empleado | empleado | @relation(fields: [id_empleado], references: [id_empleado], onDelete: Restrict, onUpdate: NoAction) |
| creador | usuario | @relation("remuneracion_creador", fields: [creado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
| calculador | usuario? | @relation("remuneracion_calculador", fields: [calculado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
| cerrador | usuario? | @relation("remuneracion_cerrador", fields: [cerrado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
| solicitante_reapertura | usuario? | @relation("remuneracion_reapertura_solicitante", fields: [reapertura_solicitada_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
| aprobador_reapertura | usuario? | @relation("remuneracion_reapertura_aprobador", fields: [reapertura_aprobada_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
| reemplaza_a | remuneracion? | @relation("reemplazo_remuneracion", fields: [reemplaza_a_id, id_periodo_remuneracion, id_empleado], references: [id_remuneracion, id_periodo_remuneracion, id_empleado], onDelete: Restrict, onUpdate: NoAction) |
| reemplazada_por | remuneracion? | @relation("reemplazo_remuneracion") |
| componentes | componente_remuneracion[] |  |
| ajustes_posteriores | ajuste_posterior_remuneracion[] |  |
### Indices y restricciones declarativas
- `@@unique([id_remuneracion, id_periodo_remuneracion, id_empleado], map: "uq_remuneracion_identidad_contexto")`
- `@@unique([reemplaza_a_id, id_periodo_remuneracion, id_empleado], map: "uq_remuneracion_reemplazo_contexto")`
- `@@index([id_periodo_remuneracion, id_empleado], map: "idx_remuneracion_periodo_empleado")`
- `@@index([id_empleado, estado], map: "idx_remuneracion_empleado_estado")`
- `@@schema("finanzas")`
## `finanzas.ajuste_posterior_remuneracion` (`ajuste_posterior_remuneracion`)
Definido en `Controladores/prisma/schema.prisma:2127`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_ajuste_posterior | Int | @id @default(autoincrement()) |
| id_remuneracion | Int |  |
| id_empleado | Int |  |
| id_periodo_origen | Int |  |
| fecha_hallazgo | DateTime | @db.Date |
| monto | Decimal | @db.Decimal(14, 4) |
| direccion | String | @db.VarChar(20) |
| motivo | String |  |
| tratamiento | String | @default("PENDIENTE") @db.VarChar(30) |
| id_periodo_aplicable | Int? |  |
| estado | String | @default("CONFIRMADO") @db.VarChar(20) |
| clave_idempotencia | String | @unique @db.VarChar(100) |
| motivo_tratamiento | String? |  |
| requiere_resolucion_humana | Boolean | @default(false) |
| creado_por | BigInt |  |
| creado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| postergado_por | BigInt? |  |
| postergado_en | DateTime? | @db.Timestamptz(6) |
| remuneracion | remuneracion | @relation(fields: [id_remuneracion], references: [id_remuneracion], onDelete: Restrict, onUpdate: NoAction) |
| regularizacion | regularizacion_extraordinaria? |  |
### Indices y restricciones declarativas
- `@@index([id_remuneracion, estado], map: "idx_ajuste_posterior_remuneracion")`
- `@@index([id_empleado, id_periodo_origen], map: "idx_ajuste_posterior_empleado_periodo")`
- `@@schema("finanzas")`
## `finanzas.regularizacion_extraordinaria` (`regularizacion_extraordinaria`)
Definido en `Controladores/prisma/schema.prisma:2154`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_regularizacion | Int | @id @default(autoincrement()) |
| id_ajuste_posterior | Int | @unique |
| monto | Decimal | @db.Decimal(14, 4) |
| motivo | String |  |
| estado | String | @default("ABIERTA") @db.VarChar(20) |
| creado_por | BigInt |  |
| creado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| actualizado_por | BigInt? |  |
| actualizado_en | DateTime? | @db.Timestamptz(6) |
| cerrado_por | BigInt? |  |
| cerrado_en | DateTime? | @db.Timestamptz(6) |
| ajuste | ajuste_posterior_remuneracion | @relation(fields: [id_ajuste_posterior], references: [id_ajuste_posterior], onDelete: Restrict, onUpdate: NoAction) |
### Indices y restricciones declarativas
- `@@index([estado], map: "idx_regularizacion_extraordinaria_estado")`
- `@@schema("finanzas")`
## `finanzas.anticipo_remuneracion` (`anticipo_remuneracion`)
Definido en `Controladores/prisma/schema.prisma:2172`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_anticipo | Int | @id @default(autoincrement()) |
| id_empleado | Int |  |
| id_periodo_remuneracion | Int |  |
| modalidad | String | @db.VarChar(20) |
| valor_ingresado | Decimal | @db.Decimal(14, 4) |
| codigo_base_porcentaje | String? | @db.VarChar(50) |
| monto_final | Decimal? | @db.Decimal(14, 4) |
| estado_valorizacion | String | @db.VarChar(30) |
| clave_idempotencia | String | @unique @db.VarChar(100) |
| creado_por | BigInt |  |
| creado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| empleado | empleado | @relation(fields: [id_empleado], references: [id_empleado], onDelete: Restrict, onUpdate: NoAction) |
| periodo | periodo_remuneracion | @relation(fields: [id_periodo_remuneracion], references: [id_periodo_remuneracion], onDelete: Restrict, onUpdate: NoAction) |
### Indices y restricciones declarativas
- `@@index([id_empleado, id_periodo_remuneracion], map: "idx_anticipo_empleado_periodo")`
- `@@schema("finanzas")`
## `finanzas.pago_remuneracion` (`pago_remuneracion`)
Definido en `Controladores/prisma/schema.prisma:2192`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_pago_remuneracion | Int | @id @default(autoincrement()) |
| origen_tipo | String | @db.VarChar(30) |
| origen_id | Int |  |
| monto | Decimal | @db.Decimal(14, 4) |
| id_medio_pago | Int |  |
| respaldo | String? |  |
| referencia | String? | @db.VarChar(200) |
| estado | String | @default("PREPARADO") @db.VarChar(20) |
| clave_idempotencia | String | @unique @db.VarChar(100) |
| creado_por | BigInt |  |
| creado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| confirmado_por | BigInt? |  |
| confirmado_en | DateTime? | @db.Timestamptz(6) |
| motivo_anulacion | String? |  |
| anulado_por | BigInt? |  |
| anulado_en | DateTime? | @db.Timestamptz(6) |
| medio_pago | medio_pago | @relation(fields: [id_medio_pago], references: [id_medio_pago], onDelete: Restrict, onUpdate: NoAction) |
| reversiones | reversion_pago_remuneracion[] |  |
### Indices y restricciones declarativas
- `@@index([origen_tipo, origen_id, estado], map: "idx_pago_remuneracion_origen")`
- `@@schema("finanzas")`
## `finanzas.prestador_honorarios` (`prestador_honorarios`)
Definido en `Controladores/prisma/schema.prisma:2216`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_prestador_honorarios | Int | @id @default(autoincrement()) |
| identificador | String | @unique @db.VarChar(30) |
| nombre_razon_social | String | @db.VarChar(160) |
| contacto | String? |  |
| estado | String | @default("ACTIVO") @db.VarChar(20) |
| boletas | boleta_honorarios[] |  |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.boleta_honorarios` (`boleta_honorarios`)
Definido en `Controladores/prisma/schema.prisma:2227`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_boleta_honorarios | Int | @id @default(autoincrement()) |
| id_prestador | Int |  |
| folio | String | @db.VarChar(80) |
| fecha_emision | DateTime | @db.Date |
| bruto | Decimal | @db.Decimal(14, 4) |
| modalidad_tributaria | String | @db.VarChar(40) |
| tasa_aplicada | Decimal? | @db.Decimal(10, 6) |
| retencion | Decimal? | @db.Decimal(14, 4) |
| liquido | Decimal? | @db.Decimal(14, 4) |
| estado_documental | String | @default("PENDIENTE_CONFIRMACION") @db.VarChar(30) |
| respaldo | String? |  |
| referencia | String? | @db.VarChar(200) |
| prestador | prestador_honorarios | @relation(fields: [id_prestador], references: [id_prestador_honorarios], onDelete: Restrict, onUpdate: NoAction) |
### Indices y restricciones declarativas
- `@@unique([id_prestador, folio], map: "uq_boleta_honorarios_prestador_folio")`
- `@@index([estado_documental, fecha_emision], map: "idx_boleta_honorarios_estado_fecha")`
- `@@schema("finanzas")`
## `finanzas.reversion_pago_remuneracion` (`reversion_pago_remuneracion`)
Definido en `Controladores/prisma/schema.prisma:2247`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_reversion_pago_remuneracion | Int | @id @default(autoincrement()) |
| id_pago_remuneracion | Int |  |
| monto | Decimal | @db.Decimal(14, 4) |
| motivo | String |  |
| registrado_por | BigInt |  |
| registrado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| pago | pago_remuneracion | @relation(fields: [id_pago_remuneracion], references: [id_pago_remuneracion], onDelete: Restrict, onUpdate: NoAction) |
### Indices y restricciones declarativas
- `@@index([id_pago_remuneracion, registrado_en], map: "idx_reversion_pago_remuneracion_pago")`
- `@@schema("finanzas")`
## `finanzas.componente_remuneracion` (`componente_remuneracion`)
Definido en `Controladores/prisma/schema.prisma:2260`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_componente_remuneracion | Int | @id @default(autoincrement()) |
| id_remuneracion | Int |  |
| id_concepto | Int? |  |
| tipo | String | @db.VarChar(40) |
| modalidad | String | @default("MONTO") @db.VarChar(30) |
| descripcion | String |  |
| monto | Decimal? | @db.Decimal(14, 4) |
| direccion | String? | @db.VarChar(20) |
| fuente_tipo | String | @db.VarChar(30) |
| clave_negocio | String? | @db.VarChar(120) |
| referencia_origen | String? | @db.VarChar(200) |
| version_origen | String? | @db.VarChar(100) |
| fecha_origen | DateTime? | @db.Date |
| estado_revision | String | @default("propuesto") @db.VarChar(30) |
| motivo | String? |  |
| id_componente_origen | Int? |  |
| tipo_relacion | String? | @db.VarChar(30) |
| creado_por | BigInt |  |
| revisado_por | BigInt? |  |
| fecha_revision | DateTime? | @db.Timestamptz(6) |
| creado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| remuneracion | remuneracion | @relation(fields: [id_remuneracion], references: [id_remuneracion], onDelete: Restrict, onUpdate: NoAction) |
| concepto | concepto_remuneracion? | @relation(fields: [id_concepto], references: [id_concepto_remuneracion], onDelete: Restrict, onUpdate: NoAction) |
| creador | usuario | @relation("componente_remuneracion_creador", fields: [creado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
| revisor | usuario? | @relation("componente_remuneracion_revisor", fields: [revisado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
| componente_origen | componente_remuneracion? | @relation("componente_remuneracion_origen", fields: [id_componente_origen], references: [id_componente_remuneracion], onDelete: Restrict, onUpdate: NoAction) |
| componentes_derivados | componente_remuneracion[] | @relation("componente_remuneracion_origen") |
### Indices y restricciones declarativas
- `@@index([id_remuneracion, tipo, estado_revision], map: "idx_componente_remuneracion_contexto")`
- `@@index([clave_negocio], map: "idx_componente_remuneracion_clave")`
- `@@schema("finanzas")`
## `finanzas.configuracion_concepto_remuneracion` (`configuracion_concepto_remuneracion`)
Definido en `Controladores/prisma/schema.prisma:2294`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_configuracion_concepto | Int | @id @default(autoincrement()) |
| id_concepto | Int |  |
| modalidad | String | @db.VarChar(20) |
| valor | Decimal? | @db.Decimal(14, 4) |
| regla_tipo | String? | @db.VarChar(40) |
| vigencia_desde | DateTime | @db.Date |
| vigencia_hasta | DateTime? | @db.Date |
| es_excepcion | Boolean | @default(false) |
| activa | Boolean | @default(true) |
| concepto | concepto_remuneracion | @relation(fields: [id_concepto], references: [id_concepto_remuneracion], onDelete: Restrict, onUpdate: NoAction) |
### Indices y restricciones declarativas
- `@@index([id_concepto, vigencia_desde], map: "idx_configuracion_concepto_vigencia")`
- `@@schema("finanzas")`
## `finanzas.parametro_remuneracional` (`parametro_remuneracional`)
Definido en `Controladores/prisma/schema.prisma:2310`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_parametro_remuneracional | Int | @id @default(autoincrement()) |
| codigo | String | @db.VarChar(50) |
| tipo | String | @db.VarChar(30) |
| nombre | String | @db.VarChar(120) |
| descripcion | String? |  |
| valor | Decimal? | @db.Decimal(18, 6) |
| unidad | String? | @db.VarChar(30) |
| vigencia_desde | DateTime | @db.Date |
| vigencia_hasta | DateTime? | @db.Date |
| fuente | String? | @db.VarChar(200) |
| referencia | String? | @db.VarChar(300) |
| estado | String | @default("pendiente") @db.VarChar(20) |
### Indices y restricciones declarativas
- `@@unique([codigo, vigencia_desde], map: "uq_parametro_remuneracional_codigo_vigencia")`
- `@@index([codigo, vigencia_desde], map: "idx_parametro_remuneracional_resolucion")`
- `@@schema("finanzas")`
## `finanzas.tramo_impuesto_renta` (`tramo_impuesto_renta`)
Definido en `Controladores/prisma/schema.prisma:2329`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_tramo_impuesto_renta | Int | @id @default(autoincrement()) |
| vigencia_desde | DateTime | @db.Date |
| vigencia_hasta | DateTime? | @db.Date |
| orden | Int |  |
| limite_desde | Decimal | @db.Decimal(18, 6) |
| limite_hasta | Decimal? | @db.Decimal(18, 6) |
| factor | Decimal | @db.Decimal(18, 8) |
| rebaja | Decimal | @db.Decimal(18, 6) |
| unidad | String | @db.VarChar(30) |
| fuente | String? | @db.VarChar(200) |
| referencia | String? | @db.VarChar(300) |
| estado | String | @default("activo") @db.VarChar(20) |
### Indices y restricciones declarativas
- `@@unique([vigencia_desde, orden], map: "uq_tramo_impuesto_vigencia_orden")`
- `@@index([vigencia_desde, vigencia_hasta], map: "idx_tramo_impuesto_vigencia")`
- `@@schema("finanzas")`
## `finanzas.configuracion_conservacion_documental` (`configuracion_conservacion_documental`)
Definido en `Controladores/prisma/schema.prisma:2348`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_configuracion_conservacion | Int | @id @default(autoincrement()) |
| estado | String | @default("pendiente") @db.VarChar(20) |
| criterio_descriptivo | String? |  |
| fuente | String? | @db.VarChar(200) |
| referencia | String? | @db.VarChar(300) |
| vigencia_desde | DateTime | @db.Date |
| vigencia_hasta | DateTime? | @db.Date |
| documentos_logicos | documento_logico[] |  |
### Indices y restricciones declarativas
- `@@unique([vigencia_desde], map: "uq_conservacion_documental_vigencia")`
- `@@index([vigencia_desde, vigencia_hasta], map: "idx_conservacion_documental_vigencia")`
- `@@schema("finanzas")`
## `inventario.alerta_faltante_pedido` (`alerta_faltante_pedido`)
Definido en `Controladores/prisma/schema.prisma:2363`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| alerta_faltante_pedido_id_alerta_faltante | BigInt | @id(map: "pk_alerta_faltante_pedido") @default(autoincrement()) |
| alerta_faltante_pedido_fecha_generacion | DateTime? | @db.Timestamptz(6) |
| alerta_faltante_pedido_cantidad_disponible | Decimal? | @db.Decimal(12, 4) |
| alerta_faltante_pedido_cantidad_requerida | Decimal? | @db.Decimal(12, 4) |
| alerta_faltante_pedido_horas_anticipacion | Int? |  |
| alerta_faltante_pedido_estado | String? | @db.VarChar(50) |
| material_sku | String? | @db.VarChar(16) |
| proveedor_id_proveedor | Int? |  |
| usuario_id_usuario | BigInt? |  |
| proyecto_id_proyecto | BigInt? |  |
| material | material? | @relation(fields: [material_sku], references: [material_sku], onDelete: NoAction, onUpdate: NoAction, map: "fk_alerta_faltante_pedido_material_sku") |
| proveedor | proveedor? | @relation(fields: [proveedor_id_proveedor], references: [id_proveedor], onDelete: NoAction, onUpdate: NoAction, map: "fk_alerta_faltante_pedido_proveedor_id_proveedor") |
| proyecto | proyecto? | @relation(fields: [proyecto_id_proyecto], references: [proyecto_proyecto_id], onDelete: NoAction, onUpdate: NoAction, map: "fk_alerta_faltante_pedido_proyecto_id_proyecto") |
| usuario | usuario? | @relation(fields: [usuario_id_usuario], references: [usuario_id_usuario], onDelete: NoAction, onUpdate: NoAction, map: "fk_alerta_faltante_pedido_usuario_id_usuario") |
### Indices y restricciones declarativas
- `@@schema("inventario")`
## `inventario.alerta_inventario` (`alerta_inventario`)
Definido en `Controladores/prisma/schema.prisma:2382`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| alerta_inventario_id_alerta | BigInt | @id(map: "pk_alerta_inventario") @default(autoincrement()) |
| alerta_inventario_mensaje | String? |  |
| alerta_inventario_fecha_generacion | DateTime? | @db.Timestamptz(6) |
| alerta_inventario_fecha_est_agotamiento | DateTime? | @db.Date |
| alerta_inventario_estado | String? | @db.VarChar(50) |
| material_sku | String? | @db.VarChar(16) |
| proveedor_id_proveedor | Int? |  |
| alerta_inventario_tipo_alerta_id_tipo_alerta | BigInt? |  |
| historial_alerta_id_historial | BigInt? |  |
| alerta_inventario_tipo_alerta | alerta_inventario_tipo_alerta? | @relation(fields: [alerta_inventario_tipo_alerta_id_tipo_alerta], references: [alerta_inventario_tipo_alerta_id_tipo_alerta], onDelete: NoAction, onUpdate: NoAction, map: "fk_alerta_inventario_alerta_inventario_tipo_alerta__2344ac23") |
| historial_alerta | historial_alerta? | @relation(fields: [historial_alerta_id_historial], references: [historial_alerta_id_historial], onDelete: NoAction, onUpdate: NoAction, map: "fk_alerta_inventario_historial_alerta_id_historial") |
| material | material? | @relation(fields: [material_sku], references: [material_sku], onDelete: NoAction, onUpdate: NoAction, map: "fk_alerta_inventario_material_sku") |
| proveedor | proveedor? | @relation(fields: [proveedor_id_proveedor], references: [id_proveedor], onDelete: NoAction, onUpdate: NoAction, map: "fk_alerta_inventario_proveedor_id_proveedor") |
| notificacion | notificacion[] |  |
### Indices y restricciones declarativas
- `@@schema("inventario")`
## `inventario.alerta_inventario_nivel_prioridad` (`alerta_inventario_nivel_prioridad`)
Definido en `Controladores/prisma/schema.prisma:2401`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| alerta_inventario_nivel_prioridad_id_nivel_prioridad | BigInt | @id(map: "pk_alerta_inventario_nivel_prioridad") @default(autoincrement()) |
| alerta_inventario_prioridad_nombre | String? | @db.VarChar(100) |
| alerta_inventario_tipo_alerta | alerta_inventario_tipo_alerta[] |  |
### Indices y restricciones declarativas
- `@@schema("inventario")`
## `inventario.alerta_inventario_tipo_alerta` (`alerta_inventario_tipo_alerta`)
Definido en `Controladores/prisma/schema.prisma:2409`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| alerta_inventario_tipo_alerta_id_tipo_alerta | BigInt | @id(map: "pk_alerta_inventario_tipo_alerta") @default(autoincrement()) |
| alerta_inventario_tipo_alerta_nombre | String? | @db.VarChar(150) |
| alerta_inventario_nivel_prioridad_id | BigInt? |  |
| alerta_inventario | alerta_inventario[] |  |
| alerta_inventario_nivel_prioridad | alerta_inventario_nivel_prioridad? | @relation(fields: [alerta_inventario_nivel_prioridad_id], references: [alerta_inventario_nivel_prioridad_id_nivel_prioridad], onDelete: NoAction, onUpdate: NoAction, map: "fk_alerta_inventario_tipo_alerta_alerta_inventario__b68d21a3") |
### Indices y restricciones declarativas
- `@@schema("inventario")`
## `inventario.anaquel` (`anaquel`)
Definido en `Controladores/prisma/schema.prisma:2419`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| anaquel_id_anaquel | BigInt | @id(map: "pk_anaquel") @default(autoincrement()) |
| anaquel_descripcion | String? |  |
| bodega_id_bodega | BigInt? |  |
| bodega | bodega? | @relation(fields: [bodega_id_bodega], references: [bodega_id_bodega], onDelete: NoAction, onUpdate: NoAction, map: "fk_anaquel_bodega_id_bodega") |
### Indices y restricciones declarativas
- `@@schema("inventario")`
## `inventario.bodega` (`bodega`)
Definido en `Controladores/prisma/schema.prisma:2428`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| bodega_id_bodega | BigInt | @id(map: "pk_bodega") @default(autoincrement()) |
| bodega_nombre_bodega | String? | @db.VarChar(150) |
| bodega_direccion | String? |  |
| bodega_estado | String? | @db.VarChar(50) |
| anaquel | anaquel[] |  |
| inventario_bodega | inventario_bodega[] |  |
| movimiento_inventario | movimiento_inventario[] |  |
### Indices y restricciones declarativas
- `@@schema("inventario")`
## `inventario.factura_compra` (`factura_compra`)
Definido en `Controladores/prisma/schema.prisma:2440`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| factura_compra_id_factura | BigInt | @id(map: "pk_factura_compra") @default(autoincrement()) |
| factura_compra_numero_factura | String? | @db.VarChar(80) |
| factura_compra_monto_neto | Decimal? | @db.Decimal(14, 2) |
| factura_compra_tipo_compra | String? | @db.VarChar(100) |
| factura_compra_fecha_emision | DateTime? | @db.Date |
| proveedor_id_proveedor | Int? |  |
| factura_compra_tipo_cambio_id_tipo_cambio | BigInt? |  |
| factura_compra_tipo_cambio | factura_compra_tipo_cambio? | @relation(fields: [factura_compra_tipo_cambio_id_tipo_cambio], references: [factura_compra_tipo_cambio_id_tipo_cambio], onDelete: NoAction, onUpdate: NoAction, map: "fk_factura_compra_factura_compra_tipo_cambio_id_tipo_cambio") |
| proveedor | proveedor? | @relation(fields: [proveedor_id_proveedor], references: [id_proveedor], onDelete: NoAction, onUpdate: NoAction, map: "fk_factura_compra_proveedor_id_proveedor") |
| lote | lote[] |  |
| movimiento_inventario | movimiento_inventario[] |  |
### Indices y restricciones declarativas
- `@@schema("inventario")`
## `inventario.factura_compra_tipo_cambio` (`factura_compra_tipo_cambio`)
Definido en `Controladores/prisma/schema.prisma:2456`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| factura_compra_tipo_cambio_id_tipo_cambio | BigInt | @id(map: "pk_factura_compra_tipo_cambio") @default(autoincrement()) |
| factura_compra_tipo_cambio_moneda | String? | @db.VarChar(10) |
| factura_compra_tipo_cambio_valor | Decimal? | @db.Decimal(14, 4) |
| factura_compra | factura_compra[] |  |
### Indices y restricciones declarativas
- `@@schema("inventario")`
## `inventario.historial_alerta` (`historial_alerta`)
Definido en `Controladores/prisma/schema.prisma:2465`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| historial_alerta_id_historial | BigInt | @id(map: "pk_historial_alerta") @default(autoincrement()) |
| historial_alerta_fecha_hora_resolucion | DateTime? | @db.Timestamptz(6) |
| alerta_inventario | alerta_inventario[] |  |
### Indices y restricciones declarativas
- `@@schema("inventario")`
## `inventario.insumo_estandar_proceso` (`insumo_estandar_proceso`)
Definido en `Controladores/prisma/schema.prisma:2473`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| insumo_estandar_proceso_id_insumo_estandar | BigInt | @id(map: "pk_insumo_estandar_proceso") @default(autoincrement()) |
| insumo_estandar_proceso_cantidad_estandar | Decimal? | @db.Decimal(12, 4) |
| insumo_estandar_proceso_observacion | String? |  |
| insumo_estandar_proceso_activo | Boolean? |  |
| material_sku | String? | @db.VarChar(16) |
| area_trabajo_id_area | BigInt? |  |
| area_trabajo | area_trabajo? | @relation(fields: [area_trabajo_id_area], references: [area_trabajo_id_area], onDelete: NoAction, onUpdate: NoAction, map: "fk_insumo_estandar_proceso_area_trabajo_id_area") |
| material | material? | @relation(fields: [material_sku], references: [material_sku], onDelete: NoAction, onUpdate: NoAction, map: "fk_insumo_estandar_proceso_material_sku") |
### Indices y restricciones declarativas
- `@@schema("inventario")`
## `inventario.inventario_bodega` (`inventario_bodega`)
Definido en `Controladores/prisma/schema.prisma:2486`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| material_sku | String | @db.VarChar(16) |
| lote_id_lote | BigInt |  |
| bodega_id_bodega | BigInt |  |
| inventario_bodega_cantidad_fisica | Decimal? | @db.Decimal(12, 4) |
| inventario_bodega_cantidad_reservada | Decimal? | @db.Decimal(12, 4) |
| bodega | bodega | @relation(fields: [bodega_id_bodega], references: [bodega_id_bodega], onDelete: NoAction, onUpdate: NoAction, map: "fk_inventario_bodega_bodega_id_bodega") |
| lote | lote | @relation(fields: [lote_id_lote], references: [lote_id_lote], onDelete: NoAction, onUpdate: NoAction, map: "fk_inventario_bodega_lote_id_lote") |
| material | material | @relation(fields: [material_sku], references: [material_sku], onDelete: NoAction, onUpdate: NoAction, map: "fk_inventario_bodega_material_sku") |
### Indices y restricciones declarativas
- `@@id([material_sku, lote_id_lote, bodega_id_bodega], map: "pk_inventario_bodega")`
- `@@schema("inventario")`
## `inventario.lote` (`lote`)
Definido en `Controladores/prisma/schema.prisma:2500`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| lote_id_lote | BigInt | @id(map: "pk_lote") @default(autoincrement()) |
| lote_numero_lote | String? | @db.VarChar(80) |
| lote_fecha_ingreso | DateTime? | @db.Date |
| lote_fecha_vencimiento | DateTime? | @db.Date |
| lote_fecha_recepcion | DateTime? | @db.Date |
| lote_estado | String? | @db.VarChar(50) |
| proveedor_id_proveedor | Int? |  |
| factura_compra_id_factura | BigInt? |  |
| proyecto_id_proyecto | BigInt? |  |
| inventario_bodega | inventario_bodega[] |  |
| factura_compra | factura_compra? | @relation(fields: [factura_compra_id_factura], references: [factura_compra_id_factura], onDelete: NoAction, onUpdate: NoAction, map: "fk_lote_factura_compra_id_factura") |
| proveedor | proveedor? | @relation(fields: [proveedor_id_proveedor], references: [id_proveedor], onDelete: NoAction, onUpdate: NoAction, map: "fk_lote_proveedor_id_proveedor") |
| proyecto | proyecto? | @relation(fields: [proyecto_id_proyecto], references: [proyecto_proyecto_id], onDelete: NoAction, onUpdate: NoAction, map: "fk_lote_proyecto_id_proyecto") |
| lote_fecha_pedido | lote_fecha_pedido[] |  |
| movimiento_inventario | movimiento_inventario[] |  |
### Indices y restricciones declarativas
- `@@schema("inventario")`
## `inventario.lote_fecha_pedido` (`lote_fecha_pedido`)
Definido en `Controladores/prisma/schema.prisma:2520`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| lote_fecha_pedido_id | BigInt | @id(map: "pk_lote_fecha_pedido") @default(autoincrement()) |
| lote_fecha_pedido_fecha_pedido | DateTime? | @db.Date |
| lote_fecha_pedido_precio_unitario | Decimal? | @db.Decimal(14, 2) |
| lote_id_lote | BigInt? |  |
| lote | lote? | @relation(fields: [lote_id_lote], references: [lote_id_lote], onDelete: NoAction, onUpdate: NoAction, map: "fk_lote_fecha_pedido_lote_id_lote") |
### Indices y restricciones declarativas
- `@@schema("inventario")`
## `inventario.material` (`material`)
Definido en `Controladores/prisma/schema.prisma:2530`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| material_sku | String | @id(map: "pk_material") @db.VarChar(16) |
| material_nombre_material | String? | @db.VarChar(200) |
| material_descripcion | String? |  |
| material_material_critico | Boolean? |  |
| material_presentacion | String? | @db.VarChar(150) |
| material_stock_critico | Decimal? | @db.Decimal(12, 4) |
| material_sotck_maximo | Decimal? | @db.Decimal(12, 4) |
| material_stock_minimo | Decimal? | @db.Decimal(12, 4) |
| material_es_rotativo | Boolean? |  |
| material_estado | String? | @db.VarChar(50) |
| es_material_pintura_custom | Boolean? |  |
| material_pintura_custom | String? | @db.VarChar(100) |
| es_material_pintura_no_custom | Boolean? |  |
| material_pintura_no_custom | String? | @db.VarChar(100) |
| material_categoria_general_id_categoria_general | BigInt? |  |
| material_categoria_funcional_id_categoria_funcional | BigInt? |  |
| material_clasificacion_nivel_especifico | BigInt? |  |
| material_unidad_medida_id_medida | BigInt? |  |
| historial_precio_material | historial_precio_material[] |  |
| alerta_faltante_pedido | alerta_faltante_pedido[] |  |
| alerta_inventario | alerta_inventario[] |  |
| insumo_estandar_proceso | insumo_estandar_proceso[] |  |
| inventario_bodega | inventario_bodega[] |  |
| material_categoria_funcional | material_categoria_funcional? | @relation(fields: [material_categoria_funcional_id_categoria_funcional], references: [material_categoria_funcional_id_categoria_funcional], onDelete: NoAction, onUpdate: NoAction, map: "fk_material_material_categoria_funcional_id_categor_7cec335a") |
| material_categoria_general | material_categoria_general? | @relation(fields: [material_categoria_general_id_categoria_general], references: [material_categoria_general_id_categoria_general], onDelete: NoAction, onUpdate: NoAction, map: "fk_material_material_categoria_general_id_categoria_general") |
| material_clasificacion_nivel_especifico_material_material_clasificacion_nivel_especificoTomaterial_clasificacion_nivel_especifico | material_clasificacion_nivel_especifico? | @relation("material_material_clasificacion_nivel_especificoTomaterial_clasificacion_nivel_especifico", fields: [material_clasificacion_nivel_especifico], references: [material_clasificacion_nivel_especifico_id], onDelete: NoAction, onUpdate: NoAction, map: "fk_material_material_clasificacion_nivel_especifico") |
| material_unidad_medida | material_unidad_medida? | @relation(fields: [material_unidad_medida_id_medida], references: [material_unidad_medida_id_unidad_medida], onDelete: NoAction, onUpdate: NoAction, map: "fk_material_material_unidad_medida_id_medida") |
| material_codigo_barras | material_codigo_barras[] |  |
| material_orden_trabajo | material_orden_trabajo[] |  |
| detalle_material_orden_compra_m5 | detalle_material_orden_compra_m5[] |  |
| material_producto_terminado | material_producto_terminado[] |  |
| material_proveedor | material_proveedor[] |  |
| movimiento_inventario | movimiento_inventario[] |  |
| reserva_inventario | reserva_inventario[] |  |
| detalles_herraje | detalles_herraje[] |  |
| prestamo_herramientas | prestamo_herramientas[] |  |
### Indices y restricciones declarativas
- `@@schema("inventario")`
## `inventario.material_categoria_funcional` (`material_categoria_funcional`)
Definido en `Controladores/prisma/schema.prisma:2571`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| material_categoria_funcional_id_categoria_funcional | BigInt | @id(map: "pk_material_categoria_funcional") @default(autoincrement()) |
| material_categoria_funcional_nombre | String? | @db.VarChar(150) |
| material | material[] |  |
### Indices y restricciones declarativas
- `@@schema("inventario")`
## `inventario.material_categoria_general` (`material_categoria_general`)
Definido en `Controladores/prisma/schema.prisma:2579`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| material_categoria_general_id_categoria_general | BigInt | @id(map: "pk_material_categoria_general") @default(autoincrement()) |
| material_categoria_general_nombre | String? | @db.VarChar(150) |
| material | material[] |  |
### Indices y restricciones declarativas
- `@@schema("inventario")`
## `inventario.material_clasificacion_categoria` (`material_clasificacion_categoria`)
Definido en `Controladores/prisma/schema.prisma:2587`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| material_clasificacion_categoria_id | BigInt | @id(map: "pk_material_clasificacion_categoria") @default(autoincrement()) |
| material_clasificacion_categoria_nombre_categoria | String? | @db.VarChar(150) |
| material_clasificacion_subcategoria | material_clasificacion_subcategoria[] |  |
### Indices y restricciones declarativas
- `@@schema("inventario")`
## `inventario.material_clasificacion_nivel_especifico` (`material_clasificacion_nivel_especifico`)
Definido en `Controladores/prisma/schema.prisma:2595`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| material_clasificacion_nivel_especifico_id | BigInt | @id(map: "pk_material_clasificacion_nivel_especifico") @default(autoincrement()) |
| material_clasificacion_nivel_especifico_nombre_nivel_especifico | String? | @db.VarChar(150) |
| material_clasificacion_subcategoria_id | BigInt? |  |
| material_material_material_clasificacion_nivel_especificoTomaterial_clasificacion_nivel_especifico | material[] | @relation("material_material_clasificacion_nivel_especificoTomaterial_clasificacion_nivel_especifico") |
| material_clasificacion_subcategoria | material_clasificacion_subcategoria? | @relation(fields: [material_clasificacion_subcategoria_id], references: [material_clasificacion_subcategoria_id], onDelete: NoAction, onUpdate: NoAction, map: "fk_material_clasificacion_nivel_especifico_material_295c8a27") |
### Indices y restricciones declarativas
- `@@schema("inventario")`
## `inventario.material_clasificacion_subcategoria` (`material_clasificacion_subcategoria`)
Definido en `Controladores/prisma/schema.prisma:2605`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| material_clasificacion_subcategoria_id | BigInt | @id(map: "pk_material_clasificacion_subcategoria") @default(autoincrement()) |
| material_clasificacion_subcategoria_nombre_subcategoria | String? | @db.VarChar(150) |
| material_clasificacion_subcategoria_es_color_custom | Boolean? |  |
| material_clasificacion_categoria_id | BigInt? |  |
| material_clasificacion_nivel_especifico | material_clasificacion_nivel_especifico[] |  |
| material_clasificacion_categoria | material_clasificacion_categoria? | @relation(fields: [material_clasificacion_categoria_id], references: [material_clasificacion_categoria_id], onDelete: NoAction, onUpdate: NoAction, map: "fk_material_clasificacion_subcategoria_material_cla_e8cfce14") |
### Indices y restricciones declarativas
- `@@schema("inventario")`
## `inventario.material_codigo_barras` (`material_codigo_barras`)
Definido en `Controladores/prisma/schema.prisma:2616`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| material_sku | String | @db.VarChar(16) |
| material_codigo_barras | String | @db.VarChar(100) |
| material | material | @relation(fields: [material_sku], references: [material_sku], onDelete: NoAction, onUpdate: NoAction, map: "fk_material_codigo_barras_material_sku") |
### Indices y restricciones declarativas
- `@@id([material_sku, material_codigo_barras], map: "pk_material_codigo_barras")`
- `@@schema("inventario")`
## `inventario.material_orden_trabajo` (`material_orden_trabajo`)
Definido en `Controladores/prisma/schema.prisma:2625`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| material_sku | String | @db.VarChar(16) |
| orden_trabajo_id_orden | BigInt |  |
| material_orden_trabajo_consumo_estimado | Decimal? | @db.Decimal(12, 4) |
| material_orden_trabajo_consumo_real | Decimal? | @db.Decimal(12, 4) |
| material | material | @relation(fields: [material_sku], references: [material_sku], onDelete: NoAction, onUpdate: NoAction, map: "fk_material_orden_trabajo_material_sku") |
| orden_trabajo | orden_trabajo | @relation(fields: [orden_trabajo_id_orden], references: [orden_trabajo_id_orden], onDelete: NoAction, onUpdate: NoAction, map: "fk_material_orden_trabajo_orden_trabajo_id_orden") |
### Indices y restricciones declarativas
- `@@id([material_sku, orden_trabajo_id_orden], map: "pk_material_orden_trabajo")`
- `@@schema("inventario")`
## `inventario.material_producto_terminado` (`material_producto_terminado`)
Definido en `Controladores/prisma/schema.prisma:2637`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| material_sku | String | @db.VarChar(16) |
| producto_terminado_id_producto | BigInt |  |
| material_producto_terminado_cantidad_estimada | Decimal? | @db.Decimal(12, 4) |
| material_producto_terminado_merma_estimada | Decimal? | @db.Decimal(12, 4) |
| material | material | @relation(fields: [material_sku], references: [material_sku], onDelete: NoAction, onUpdate: NoAction, map: "fk_material_producto_terminado_material_sku") |
| producto_terminado | producto_terminado | @relation(fields: [producto_terminado_id_producto], references: [producto_terminado_id_producto], onDelete: NoAction, onUpdate: NoAction, map: "fk_material_producto_terminado_producto_terminado_i_5cce9a2a") |
### Indices y restricciones declarativas
- `@@id([material_sku, producto_terminado_id_producto], map: "pk_material_producto_terminado")`
- `@@schema("inventario")`
## `inventario.material_proveedor` (`material_proveedor`)
Definido en `Controladores/prisma/schema.prisma:2649`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| material_sku | String | @db.VarChar(16) |
| proveedor_id_proveedor | Int |  |
| material_proveedor_tiempo_reposicion | Int? |  |
| material_proveedor_precio_referencial | Decimal? | @db.Decimal(14, 2) |
| material_proveedor_proveedor_principal | Boolean? |  |
| material | material | @relation(fields: [material_sku], references: [material_sku], onDelete: NoAction, onUpdate: NoAction, map: "fk_material_proveedor_material_sku") |
| proveedor | proveedor | @relation(fields: [proveedor_id_proveedor], references: [id_proveedor], onDelete: NoAction, onUpdate: NoAction, map: "fk_material_proveedor_proveedor_id_proveedor") |
### Indices y restricciones declarativas
- `@@id([material_sku, proveedor_id_proveedor], map: "pk_material_proveedor")`
- `@@schema("inventario")`
## `inventario.material_unidad_medida` (`material_unidad_medida`)
Definido en `Controladores/prisma/schema.prisma:2662`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| material_unidad_medida_id_unidad_medida | BigInt | @id(map: "pk_material_unidad_medida") @default(autoincrement()) |
| material_unidad_medida_nombre | String? | @db.VarChar(100) |
| material | material[] |  |
### Indices y restricciones declarativas
- `@@schema("inventario")`
## `inventario.movimiento_inventario` (`movimiento_inventario`)
Definido en `Controladores/prisma/schema.prisma:2670`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| movimiento_inventario_id_movimiento | BigInt | @id(map: "pk_movimiento_inventario") @default(autoincrement()) |
| movimiento_inventario_fecha_hora | DateTime? | @db.Timestamptz(6) |
| movimiento_inventario_cantidad | Decimal? | @db.Decimal(12, 4) |
| movimiento_inventario_estado | String? | @db.VarChar(50) |
| material_sku | String? | @db.VarChar(16) |
| bodega_id_bodega | BigInt? |  |
| lote_id_lote | BigInt? |  |
| proyecto_id_proyecto | BigInt? |  |
| factura_compra_id_factura_compra | BigInt? |  |
| usuario_id_usuario | BigInt? |  |
| movimiento_inventario_tipo_movimiento_id_tipo_movimiento | BigInt? |  |
| movimiento_inventario_motivo_movimiento_id_motivo_movimiento | BigInt? |  |
| bodega | bodega? | @relation(fields: [bodega_id_bodega], references: [bodega_id_bodega], onDelete: NoAction, onUpdate: NoAction, map: "fk_movimiento_inventario_bodega_id_bodega") |
| factura_compra | factura_compra? | @relation(fields: [factura_compra_id_factura_compra], references: [factura_compra_id_factura], onDelete: NoAction, onUpdate: NoAction, map: "fk_movimiento_inventario_factura_compra_id_factura_compra") |
| lote | lote? | @relation(fields: [lote_id_lote], references: [lote_id_lote], onDelete: NoAction, onUpdate: NoAction, map: "fk_movimiento_inventario_lote_id_lote") |
| material | material? | @relation(fields: [material_sku], references: [material_sku], onDelete: NoAction, onUpdate: NoAction, map: "fk_movimiento_inventario_material_sku") |
| movimiento_inventario_motivo_movimiento | movimiento_inventario_motivo_movimiento? | @relation(fields: [movimiento_inventario_motivo_movimiento_id_motivo_movimiento], references: [movimiento_inventario_motivo_movimiento_id_motivo_movimiento], onDelete: NoAction, onUpdate: NoAction, map: "fk_movimiento_inventario_movimiento_inventario_moti_5114c33e") |
| movimiento_inventario_tipo_movimiento | movimiento_inventario_tipo_movimiento? | @relation(fields: [movimiento_inventario_tipo_movimiento_id_tipo_movimiento], references: [movimiento_inventario_tipo_movimiento_id_tipo_movimiento], onDelete: NoAction, onUpdate: NoAction, map: "fk_movimiento_inventario_movimiento_inventario_tipo_491f04a7") |
| proyecto | proyecto? | @relation(fields: [proyecto_id_proyecto], references: [proyecto_proyecto_id], onDelete: NoAction, onUpdate: NoAction, map: "fk_movimiento_inventario_proyecto_id_proyecto") |
| usuario | usuario? | @relation(fields: [usuario_id_usuario], references: [usuario_id_usuario], onDelete: NoAction, onUpdate: NoAction, map: "fk_movimiento_inventario_usuario_id_usuario") |
| reporte_movimiento_inventario | reporte_movimiento_inventario[] |  |
### Indices y restricciones declarativas
- `@@schema("inventario")`
## `inventario.movimiento_inventario_clasificacion_salida` (`movimiento_inventario_clasificacion_salida`)
Definido en `Controladores/prisma/schema.prisma:2696`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_clasificacion_salida | BigInt | @id(map: "pk_movimiento_inventario_clasificacion_salida") @default(autoincrement()) |
| movimiento_inventario_clasificacion_salida_nombre | String? | @db.VarChar(150) |
| movimiento_inventario_motivo_movimiento | movimiento_inventario_motivo_movimiento[] |  |
### Indices y restricciones declarativas
- `@@schema("inventario")`
## `inventario.movimiento_inventario_motivo_movimiento` (`movimiento_inventario_motivo_movimiento`)
Definido en `Controladores/prisma/schema.prisma:2704`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| movimiento_inventario_motivo_movimiento_id_motivo_movimiento | BigInt | @id(map: "pk_movimiento_inventario_motivo_movimiento") @default(autoincrement()) |
| movimiento_inventario_motivo_movimiento_nombre | String? | @db.VarChar(150) |
| id_clasificacion_salida | BigInt? |  |
| movimiento_inventario | movimiento_inventario[] |  |
| movimiento_inventario_clasificacion_salida | movimiento_inventario_clasificacion_salida? | @relation(fields: [id_clasificacion_salida], references: [id_clasificacion_salida], onDelete: NoAction, onUpdate: NoAction, map: "fk_movimiento_inventario_motivo_movimiento_movimien_cf1b5d9c") |
### Indices y restricciones declarativas
- `@@schema("inventario")`
## `inventario.movimiento_inventario_tipo_movimiento` (`movimiento_inventario_tipo_movimiento`)
Definido en `Controladores/prisma/schema.prisma:2714`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| movimiento_inventario_tipo_movimiento_id_tipo_movimiento | BigInt | @id(map: "pk_movimiento_inventario_tipo_movimiento") @default(autoincrement()) |
| movimiento_inventario_tipo_movimiento_nombre | String? | @db.VarChar(150) |
| movimiento_inventario | movimiento_inventario[] |  |
### Indices y restricciones declarativas
- `@@schema("inventario")`
## `inventario.notificacion` (`notificacion`)
Definido en `Controladores/prisma/schema.prisma:2722`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| notificacion_id_notificacion | BigInt | @id(map: "pk_notificacion") @default(autoincrement()) |
| notificacion_tipo_notificacion | String? | @db.VarChar(150) |
| notificacion_mensaje | String? |  |
| notificacion_fecha_generacion | DateTime? | @db.Timestamptz(6) |
| notificacion_estado_lectura | String? | @db.VarChar(50) |
| notificacion_origen | String? | @db.VarChar(150) |
| alerta_inventario_id_alerta | BigInt? |  |
| usuario_id_usuario | BigInt? |  |
| alerta_inventario | alerta_inventario? | @relation(fields: [alerta_inventario_id_alerta], references: [alerta_inventario_id_alerta], onDelete: NoAction, onUpdate: NoAction, map: "fk_notificacion_alerta_inventario_id_alerta") |
| usuario | usuario? | @relation(fields: [usuario_id_usuario], references: [usuario_id_usuario], onDelete: NoAction, onUpdate: NoAction, map: "fk_notificacion_usuario_id_usuario") |
### Indices y restricciones declarativas
- `@@schema("inventario")`
## `inventario.orden_trabajo` (`orden_trabajo`)
Definido en `Controladores/prisma/schema.prisma:2737`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| orden_trabajo_id_orden | BigInt | @id(map: "pk_orden_trabajo") @default(autoincrement()) |
| orden_trabajo_fecha_hora | DateTime? | @db.Timestamptz(6) |
| orden_trabajo_estado | String? | @db.VarChar(50) |
| especificaciones_puerta_id_especificacion_puerta | BigInt? |  |
| proyecto_id_proyecto | BigInt? |  |
| area_trabajo_id_area | BigInt? |  |
| usuario_id_usuario | BigInt? |  |
| tarea_remunerable | tarea_remunerable[] |  |
| tareas_produccion | tarea[] |  |
| material_orden_trabajo | material_orden_trabajo[] |  |
| area_trabajo | area_trabajo? | @relation(fields: [area_trabajo_id_area], references: [area_trabajo_id_area], onDelete: NoAction, onUpdate: NoAction, map: "fk_orden_trabajo_area_trabajo_id_area") |
| especificaciones_puerta | especificaciones_puerta? | @relation(fields: [especificaciones_puerta_id_especificacion_puerta], references: [especificacion_puerta_especificacion_puerta_id], onDelete: NoAction, onUpdate: NoAction, map: "fk_orden_trabajo_especificaciones_puerta_id_especif_6a769728") |
| proyecto | proyecto? | @relation(fields: [proyecto_id_proyecto], references: [proyecto_proyecto_id], onDelete: NoAction, onUpdate: NoAction, map: "fk_orden_trabajo_proyecto_id_proyecto") |
| usuario | usuario? | @relation(fields: [usuario_id_usuario], references: [usuario_id_usuario], onDelete: NoAction, onUpdate: NoAction, map: "fk_orden_trabajo_usuario_id_usuario") |
| reserva_inventario | reserva_inventario[] |  |
| unidad_fisica_comercial | unidad_fisica_orden_trabajo? |  |
### Indices y restricciones declarativas
- `@@schema("inventario")`
## `inventario.preparacion_pedido` (`preparacion_pedido`)
Definido en `Controladores/prisma/schema.prisma:2758`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| preparacion_pedido_id_preparacion | BigInt | @id(map: "pk_preparacion_pedido") @default(autoincrement()) |
| preparacion_pedido_observacion | String? |  |
| reserva_inventario_id_reserva | BigInt? |  |
| usuario_id_usuario | BigInt? |  |
| reserva_inventario | reserva_inventario? | @relation(fields: [reserva_inventario_id_reserva], references: [reserva_inventario_id_reserva], onDelete: NoAction, onUpdate: NoAction, map: "fk_preparacion_pedido_reserva_inventario_id_reserva") |
| usuario | usuario? | @relation(fields: [usuario_id_usuario], references: [usuario_id_usuario], onDelete: NoAction, onUpdate: NoAction, map: "fk_preparacion_pedido_usuario_id_usuario") |
| preparacion_pedido_estado | preparacion_pedido_estado[] |  |
### Indices y restricciones declarativas
- `@@schema("inventario")`
## `inventario.preparacion_pedido_estado` (`preparacion_pedido_estado`)
Definido en `Controladores/prisma/schema.prisma:2770`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| preparacion_pedido_estado_id_estado_preparacion | BigInt | @id(map: "pk_preparacion_pedido_estado") @default(autoincrement()) |
| pedido_preparacion_estado_nombre_estado | String? | @db.VarChar(100) |
| pedido_preparacion_estado_timestamp_accion | DateTime? | @db.Timestamptz(6) |
| preparacion_pedido_id_preparacion | BigInt? |  |
| preparacion_pedido | preparacion_pedido? | @relation(fields: [preparacion_pedido_id_preparacion], references: [preparacion_pedido_id_preparacion], onDelete: NoAction, onUpdate: NoAction, map: "fk_preparacion_pedido_estado_preparacion_pedido_id__ee3b6a24") |
### Indices y restricciones declarativas
- `@@schema("inventario")`
## `inventario.producto_terminado` (`producto_terminado`)
Definido en `Controladores/prisma/schema.prisma:2780`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| producto_terminado_id_producto | BigInt | @id(map: "pk_producto_terminado") @default(autoincrement()) |
| producto_terminado_tipo_producto | String? | @db.VarChar(150) |
| producto_terminado_nombre_producto | String? | @db.VarChar(200) |
| producto_terminado_codigo_producto | String? | @db.VarChar(80) |
| producto_terminado_requerimientos_certificacion | String? |  |
| producto_terminado_requerimientos_medidas | String? |  |
| producto_terminado_requerimientos_produccion | String? |  |
| producto_terminado_requerimientos_instalacion | String? |  |
| producto_terminado_activo | Boolean? |  |
| material_producto_terminado | material_producto_terminado[] |  |
| extensiones_comerciales | extension_producto_comercial[] |  |
### Indices y restricciones declarativas
- `@@schema("inventario")`
## `inventario.proveedor_contacto_correo` (`proveedor_contacto_correo`)
Definido en `Controladores/prisma/schema.prisma:2796`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| proveedor_id_proveedor | Int |  |
| proveedor_contacto_correo | String | @db.VarChar(254) |
| proveedor | proveedor | @relation(fields: [proveedor_id_proveedor], references: [id_proveedor], onDelete: NoAction, onUpdate: NoAction, map: "fk_proveedor_contacto_correo_proveedor_id_proveedor") |
### Indices y restricciones declarativas
- `@@id([proveedor_id_proveedor, proveedor_contacto_correo], map: "pk_proveedor_contacto_correo")`
- `@@schema("inventario")`
## `inventario.proveedor_contacto_telefono` (`proveedor_contacto_telefono`)
Definido en `Controladores/prisma/schema.prisma:2805`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| proveedor_id_proveedor | Int |  |
| proveedor_contacto_telefono | String | @db.VarChar(30) |
| proveedor | proveedor | @relation(fields: [proveedor_id_proveedor], references: [id_proveedor], onDelete: NoAction, onUpdate: NoAction, map: "fk_proveedor_contacto_telefono_proveedor_id_proveedor") |
### Indices y restricciones declarativas
- `@@id([proveedor_id_proveedor, proveedor_contacto_telefono], map: "pk_proveedor_contacto_telefono")`
- `@@schema("inventario")`
## `inventario.reporte` (`reporte`)
Definido en `Controladores/prisma/schema.prisma:2814`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| reporte_id_reporte | BigInt | @id(map: "pk_reporte") @default(autoincrement()) |
| reporte_periodo_fin | DateTime? | @db.Date |
| reporte_fecha_generacion | DateTime? | @db.Timestamptz(6) |
| reporte_formato_exportacion | String? | @db.VarChar(50) |
| reporte_estado | String? | @db.VarChar(50) |
| reporte_tipo_reporte | String? | @db.VarChar(50) |
| reporte_periodo_inicio | DateTime? | @db.Date |
| usuario_id_usuario | BigInt? |  |
| usuario | usuario? | @relation(fields: [usuario_id_usuario], references: [usuario_id_usuario], onDelete: NoAction, onUpdate: NoAction, map: "fk_reporte_usuario_id_usuario") |
| reporte_movimiento_inventario | reporte_movimiento_inventario[] |  |
### Indices y restricciones declarativas
- `@@schema("inventario")`
## `inventario.reporte_movimiento_inventario` (`reporte_movimiento_inventario`)
Definido en `Controladores/prisma/schema.prisma:2829`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| movimiento_inventario_id_movimiento | BigInt |  |
| reporte_id_reporte | BigInt |  |
| movimiento_inventario | movimiento_inventario | @relation(fields: [movimiento_inventario_id_movimiento], references: [movimiento_inventario_id_movimiento], onDelete: NoAction, onUpdate: NoAction, map: "fk_reporte_movimiento_inventario_movimiento_inventa_c5801b43") |
| reporte | reporte | @relation(fields: [reporte_id_reporte], references: [reporte_id_reporte], onDelete: NoAction, onUpdate: NoAction, map: "fk_reporte_movimiento_inventario_reporte_id_reporte") |
### Indices y restricciones declarativas
- `@@id([movimiento_inventario_id_movimiento, reporte_id_reporte], map: "pk_reporte_movimiento_inventario")`
- `@@schema("inventario")`
## `inventario.reserva_inventario` (`reserva_inventario`)
Definido en `Controladores/prisma/schema.prisma:2839`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| reserva_inventario_id_reserva | BigInt | @id(map: "pk_reserva_inventario") @default(autoincrement()) |
| reserva_inventario_cantidad_reservada | Decimal? | @db.Decimal(12, 4) |
| reserva_inventario_fecha_reserva | DateTime? | @db.Timestamptz(6) |
| reserva_inventario_fecha_liberacion | DateTime? | @db.Timestamptz(6) |
| reserva_inventario_estado_reserva | String? | @db.VarChar(50) |
| material_sku | String? | @db.VarChar(16) |
| proyecto_id_proyecto | BigInt? |  |
| orden_trabajo_id_orden | BigInt? |  |
| preparacion_pedido | preparacion_pedido[] |  |
| material | material? | @relation(fields: [material_sku], references: [material_sku], onDelete: NoAction, onUpdate: NoAction, map: "fk_reserva_inventario_material_sku") |
| orden_trabajo | orden_trabajo? | @relation(fields: [orden_trabajo_id_orden], references: [orden_trabajo_id_orden], onDelete: NoAction, onUpdate: NoAction, map: "fk_reserva_inventario_orden_trabajo_id_orden") |
| proyecto | proyecto? | @relation(fields: [proyecto_id_proyecto], references: [proyecto_proyecto_id], onDelete: NoAction, onUpdate: NoAction, map: "fk_reserva_inventario_proyecto_id_proyecto") |
### Indices y restricciones declarativas
- `@@schema("inventario")`
## `terreno.adicionales_pagados` (`adicionales_pagados`)
Definido en `Controladores/prisma/schema.prisma:2856`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| adicionales_pagados_id_adicionales | BigInt | @id(map: "pk_adicionales_pagados") @default(autoincrement()) |
| adicionales_pagados_retiro_escombros | Boolean? |  |
| adicionales_pagados_retiro_puerta_actual | Boolean? |  |
| adicionales_pagados_alarma | Boolean? |  |
| adicionales_pagados_subida_escalera | String? |  |
| adicionales_pagados_endolados | Boolean? |  |
| adicionales_pagados_pilastras_alto | Decimal? | @db.Decimal(12, 4) |
| adicionales_pagados_pilastras_ancho | Decimal? | @db.Decimal(12, 4) |
| adicionales_pagados_pilastras_espesor | Decimal? | @db.Decimal(12, 4) |
| adicionales_pagados_observaciones | String? |  |
| id_especificaciones_puerta | BigInt? |  |
| especificaciones_puerta | especificaciones_puerta? | @relation(fields: [id_especificaciones_puerta], references: [especificacion_puerta_especificacion_puerta_id], onDelete: NoAction, onUpdate: NoAction, map: "fk_adicionales_pagados_id_especificaciones_puerta") |
### Indices y restricciones declarativas
- `@@schema("terreno")`
## `terreno.area_trabajo` (`area_trabajo`)
Definido en `Controladores/prisma/schema.prisma:2873`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| area_trabajo_id_area | BigInt | @id(map: "pk_area_trabajo") @default(autoincrement()) |
| area_trabajo_clasificacion | String? | @db.VarChar(150) |
| area_trabajo_activo | Boolean? |  |
| area_trabajo_nombre_area | String? | @db.VarChar(150) |
| insumo_estandar_proceso | insumo_estandar_proceso[] |  |
| orden_trabajo | orden_trabajo[] |  |
| incidencias | incidencia_retrabajo_tarea[] |  |
| asignaciones_empleados | asignacion_area_empleado[] |  |
| configuracion | configuracion_area_trabajo? |  |
| tareas_fabricacion | catalogo_tarea_fabricacion[] |  |
| estados_tareas_produccion | estado_tarea_produccion_ot[] |  |
| etapas_adicionales_ot | etapa_adicional_orden_trabajo[] |  |
### Indices y restricciones declarativas
- `@@schema("terreno")`
## `terreno.checklist_de_materiales` (`checklist_de_materiales`)
Definido en `Controladores/prisma/schema.prisma:2890`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| checklist_de_materiales_checklist_de_materials_id | BigInt | @id(map: "pk_checklist_de_materiales") @default(autoincrement()) |
| checklist_de_materiales_tipo_inicio_tarea | String? |  |
| checklist_de_materiales_tipo_cierre_tarea | String? |  |
| checklist_de_materiales_item | String? |  |
| checklist_de_materiales_es_marcado | Boolean? |  |
| checklist_de_materiales_marcado | String? |  |
| checklist_de_materiales_es_no_marcado | Boolean? |  |
| checklist_de_materiales_no_marcado | String? |  |
| servicio_terreno | servicio_terreno[] |  |
### Indices y restricciones declarativas
- `@@schema("terreno")`
## `terreno.cliente` (`cliente`)
Definido en `Controladores/prisma/schema.prisma:2904`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| cliente_cliente_rut | String | @id(map: "pk_cliente") @db.VarChar(12) |
| cliente_razon_social | String? |  |
| cliente_contacto_principal | String? |  |
| cliente_correo | String? |  |
| cliente_telefono | String? |  |
| cliente_es_cliente_b2c | Boolean? |  |
| cliente_cliente_b2c_rut | String? | @db.VarChar(12) |
| cliente_cliente_b2c_correo | String? |  |
| cliente_cliente_b2c_primer_nombre | String? |  |
| cliente_cliente_b2c_segundo_nombre | String? |  |
| cliente_cliente_b2c_primer_apellido | String? |  |
| cliente_cliente_b2c_segundo_apellido | String? |  |
| cliente_cliente_b2c_telefono_contacto | String? |  |
| cliente_cliente_b2c_fecha_registro | DateTime? | @db.Date |
| cliente_cliente_b2c_telefono_contacto_adicional | String? |  |
| cliente_cliente_b2c_fecha_ultima_edicion | DateTime? | @db.Date |
| cliente_es_cliente_b2b | Boolean? |  |
| cliente_cliente_b2b_fecha_ultima_edicion | DateTime? | @db.Date |
| cliente_cliente_b2b_correo_institucional | String? |  |
| cliente_cliente_b2b_fecha_registro | DateTime? | @db.Date |
| cliente_cliente_b2b_telefono_corporativo | String? |  |
| cliente_cliente_b2b_razon_social | String? |  |
| cliente_cliente_b2b_rut_empresa | String? | @db.VarChar(12) |
| cliente_cliente_b2b_telefono_corp_adicional | String? |  |
| cliente_cliente_b2b_representante_legal_primer_nombre | String? |  |
| cliente_cliente_b2b_representante_legal_segundo_nombre | String? |  |
| cliente_cliente_b2b_representante_legal_primer_apellido | String? |  |
| cliente_cliente_b2b_representante_legal_segundo_apellido | String? |  |
| obra | obra[] |  |
| proyecto | proyecto[] |  |
### Indices y restricciones declarativas
- `@@schema("terreno")`
## `terreno.detalles_herraje` (`detalles_herraje`)
Definido en `Controladores/prisma/schema.prisma:2939`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| detalles_herraje_detalle_herraje_id | BigInt | @id(map: "pk_detalles_herraje") @default(autoincrement()) |
| detalles_herraje_ubicacion | String? |  |
| detalles_herraje_color | String? |  |
| detalles_herraje_cantidad | Int? |  |
| detalles_herraje_observacion | String? |  |
| material_sku | String? | @db.VarChar(16) |
| id_especificacion_puerta | BigInt? |  |
| especificaciones_puerta | especificaciones_puerta? | @relation(fields: [id_especificacion_puerta], references: [especificacion_puerta_especificacion_puerta_id], onDelete: NoAction, onUpdate: NoAction, map: "fk_detalles_herraje_id_especificacion_puerta") |
| material | material? | @relation(fields: [material_sku], references: [material_sku], onDelete: NoAction, onUpdate: NoAction, map: "fk_detalles_herraje_material_sku") |
### Indices y restricciones declarativas
- `@@schema("terreno")`
## `terreno.especificacion_metalmecanica` (`especificacion_metalmecanica`)
Definido en `Controladores/prisma/schema.prisma:2953`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| especificacion_metalmecanica_id_metalmecanica | BigInt | @id(map: "pk_especificacion_metalmecanica") @default(autoincrement()) |
| especificacion_metalmecanica_bastidor | String? |  |
| especificacion_metalmecanica_cerradura | String? |  |
| especificacion_metalmecanica_manillon | String? |  |
| especificacion_metalmecanica_pernos_fijos | String? |  |
| especificacion_metalmecanica_manilla | String? |  |
| especificacion_metalmecanica_herraje | String? |  |
| especificacion_metalmecanica_cerrojo | String? |  |
| especificacion_metalmecanica_ojo | String? |  |
| especificacion_metalmecanica_otros | String? |  |
| id_especificacion_puerta | BigInt? |  |
| especificaciones_puerta | especificaciones_puerta? | @relation(fields: [id_especificacion_puerta], references: [especificacion_puerta_especificacion_puerta_id], onDelete: NoAction, onUpdate: NoAction, map: "fk_especificacion_metalmecanica_id_especificacion_puerta") |
### Indices y restricciones declarativas
- `@@schema("terreno")`
## `terreno.especificacion_proyecto_terreno` (`especificacion_proyecto_terreno`)
Definido en `Controladores/prisma/schema.prisma:2970`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_especificacion_proyecto_terreno | BigInt | @id(map: "pk_especificacion_proyecto_terreno") @default(autoincrement()) |
| especificacion_proyecto_terreno_estado_operacional | String? |  |
| especificacion_proyecto_terreno_estado_produccion | String? |  |
| especificacion_proyecto_terreno_estado_instalacion | String? |  |
| especificacion_proyecto_terreno_fecha_inicio | DateTime? | @db.Date |
| especificacion_proyecto_terreno_fecha_cierre_operativo | DateTime? | @db.Date |
| especificacion_proyecto_terreno_observacion_estado | String? |  |
| especificacion_proyecto_terreno_conformidad_cliente | String? |  |
| id_especificacion_puerta | BigInt? |  |
| especificaciones_puerta | especificaciones_puerta? | @relation(fields: [id_especificacion_puerta], references: [especificacion_puerta_especificacion_puerta_id], onDelete: NoAction, onUpdate: NoAction, map: "fk_especificacion_proyecto_terreno_id_especificacion_puerta") |
### Indices y restricciones declarativas
- `@@schema("terreno")`
## `terreno.especificacion_servicio_terreno` (`especificacion_servicio_terreno`)
Definido en `Controladores/prisma/schema.prisma:2985`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| especificacion_servicio_terreno_servicio_terreno_id | BigInt |  |
| especificacion_servicio_terreno_especificacion_puerta_id | BigInt |  |
| servicio_terreno | servicio_terreno | @relation(fields: [especificacion_servicio_terreno_servicio_terreno_id], references: [servicio_terreno_servicio_terreno_id], onDelete: NoAction, onUpdate: NoAction, map: "fk_especificacion_servicio_terreno_especificacion_s_79bfd2c7") |
| especificaciones_puerta | especificaciones_puerta | @relation(fields: [especificacion_servicio_terreno_especificacion_puerta_id], references: [especificacion_puerta_especificacion_puerta_id], onDelete: NoAction, onUpdate: NoAction, map: "fk_especificacion_servicio_terreno_especificacion_s_ca0b84a5") |
### Indices y restricciones declarativas
- `@@id([especificacion_servicio_terreno_servicio_terreno_id, especificacion_servicio_terreno_especificacion_puerta_id], map: "pk_especificacion_servicio_terreno")`
- `@@schema("terreno")`
## `terreno.especificacion_terminaciones` (`especificacion_terminaciones`)
Definido en `Controladores/prisma/schema.prisma:2995`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| especificacion_terminaciones_id_terminacion | BigInt | @id(map: "pk_especificacion_terminaciones") @default(autoincrement()) |
| especificacion_terminaciones_herrajes | String? |  |
| especificacion_terminaciones_pletina | Decimal? | @db.Decimal(12, 4) |
| especificacion_terminaciones_funda | Decimal? | @db.Decimal(12, 4) |
| especificacion_terminaciones_medida_final | Decimal? | @db.Decimal(12, 4) |
| especificacion_terminaciones_manilla | Decimal? | @db.Decimal(12, 4) |
| especificacion_terminaciones_marco_metalico | Decimal? | @db.Decimal(12, 4) |
| especificacion_terminaciones_bisagras | Decimal? | @db.Decimal(12, 4) |
| especificacion_terminaciones_molduras | String? |  |
| especificacion_terminaciones_rebaje | String? |  |
| especificacion_terminaciones_canterias | String? |  |
| especificacion_terminaciones_pura | String? |  |
| especificacion_terminaciones_enchape | String? |  |
| id_especificacion_puerta | BigInt? |  |
| especificaciones_puerta | especificaciones_puerta? | @relation(fields: [id_especificacion_puerta], references: [especificacion_puerta_especificacion_puerta_id], onDelete: NoAction, onUpdate: NoAction, map: "fk_especificacion_terminaciones_id_especificacion_puerta") |
### Indices y restricciones declarativas
- `@@schema("terreno")`
## `terreno.especificaciones_puerta` (`especificaciones_puerta`)
Definido en `Controladores/prisma/schema.prisma:3015`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| especificacion_puerta_especificacion_puerta_id | BigInt | @id(map: "pk_especificaciones_puerta") @default(autoincrement()) |
| especificacion_puerta_modelo_puerta | String? |  |
| especificacion_puerta_zona | String? |  |
| especificacion_puerta_sentido_apertura | String? |  |
| especificacion_puerta_materialidad_vano | String? |  |
| especificacion_puerta_materialidad_marco_actual | String? |  |
| especificacion_puerta_solucion_marco | String? |  |
| especificacion_puerta_hoja_pasiva | String? |  |
| especificacion_puerta_hoja_activa | String? |  |
| especificacion_puerta_diseno_puerta | String? |  |
| especificacion_puerta_observaciones_de_diseno | String? |  |
| especificacion_puerta_cubrejuntas | Boolean? |  |
| especificacion_puerta_bisagras | String? |  |
| especificacion_puerta_observaciones | String? |  |
| id_medidas | BigInt? |  |
| orden_trabajo | orden_trabajo[] |  |
| adicionales_pagados | adicionales_pagados[] |  |
| detalles_herraje | detalles_herraje[] |  |
| especificacion_metalmecanica | especificacion_metalmecanica[] |  |
| especificacion_proyecto_terreno | especificacion_proyecto_terreno[] |  |
| especificacion_servicio_terreno | especificacion_servicio_terreno[] |  |
| especificacion_terminaciones | especificacion_terminaciones[] |  |
| historial_cambio_orden_trabajo | historial_cambio_orden_trabajo[] |  |
| medidas_puerta | medidas_puerta[] |  |
| obra | obra[] |  |
| tarea | tarea[] |  |
| rectificaciones_ot | rectificacion_orden_trabajo[] |  |
### Indices y restricciones declarativas
- `@@schema("terreno")`
## `terreno.evidencia_terreno` (`evidencia_terreno`)
Definido en `Controladores/prisma/schema.prisma:3047`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| evidencia_terreno_evidencia_terreno_id | BigInt | @id(map: "pk_evidencia_terreno") @default(autoincrement()) |
| evidencia_terreno_tipo_evidencia | String? |  |
| evidencia_terreno_fecha_captura | DateTime? | @db.Date |
| evidencia_terreno_imagen_o_vector | Bytes? |  |
| evidencia_terreno_metadata_dispositivo | String? |  |
| evidencia_terreno_estado_temporal | String? |  |
| evidencia_terreno_estado_evidencia | String? |  |
| evidencia_terreno_observacion | String? |  |
| id_formulario_de_cierre | BigInt? |  |
| id_servicio_terreno | BigInt? |  |
| id_incidencia_retrabajo | BigInt? |  |
| formulario_de_cierre | formulario_de_cierre? | @relation(fields: [id_formulario_de_cierre], references: [formulario_de_cierre_formulario_de_cierre_id], onDelete: NoAction, onUpdate: NoAction, map: "fk_evidencia_terreno_id_formulario_de_cierre") |
| servicio_terreno | servicio_terreno? | @relation(fields: [id_servicio_terreno], references: [servicio_terreno_servicio_terreno_id], onDelete: NoAction, onUpdate: NoAction, map: "fk_evidencia_terreno_id_servicio_terreno") |
| incidencia_retrabajo | incidencia_retrabajo_tarea? | @relation(fields: [id_incidencia_retrabajo], references: [id_incidencia_retrabajo], onDelete: Restrict, onUpdate: NoAction, map: "fk_evidencia_terreno_incidencia") |
### Indices y restricciones declarativas
- `@@index([id_incidencia_retrabajo], map: "idx_evidencia_terreno_incidencia")`
- `@@schema("terreno")`
## `terreno.formulario_de_cierre` (`formulario_de_cierre`)
Definido en `Controladores/prisma/schema.prisma:3067`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| formulario_de_cierre_formulario_de_cierre_id | BigInt | @id(map: "pk_formulario_de_cierre") @default(autoincrement()) |
| formulario_de_cierre_detalle_de_observaciones | String? |  |
| formulario_de_cierre_sentido_de_apertura_correcto | Boolean? |  |
| formulario_de_cierre_pilastras_incluidas_y_ajustadas | Boolean? |  |
| formulario_de_cierre_resultado_finalizado | String? |  |
| formulario_de_cierre_cilindro_correcto | Boolean? |  |
| formulario_de_cierre_ausencia_de_rayones_o_danos | Boolean? |  |
| id_tarea | BigInt? |  |
| evidencia_terreno | evidencia_terreno[] |  |
| tarea | tarea? | @relation(fields: [id_tarea], references: [tarea_tarea_id], onDelete: NoAction, onUpdate: NoAction, map: "fk_formulario_de_cierre_id_tarea") |
### Indices y restricciones declarativas
- `@@schema("terreno")`
## `terreno.historial_cambio_orden_trabajo` (`historial_cambio_orden_trabajo`)
Definido en `Controladores/prisma/schema.prisma:3082`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| historial_cambio_orden_trabajo_id_cambio | BigInt | @id(map: "pk_historial_cambio_orden_trabajo") @default(autoincrement()) |
| historial_cambio_orden_trabajo_version_nueva | String? |  |
| historial_cambio_orden_trabajo_version_antigua | String? |  |
| historial_cambio_orden_trabajo_fecha_hora | DateTime? | @db.Timestamptz(6) |
| historial_cambio_orden_trabajo_descripcion | String? |  |
| id_especificaciones_puerta | BigInt? |  |
| especificaciones_puerta | especificaciones_puerta? | @relation(fields: [id_especificaciones_puerta], references: [especificacion_puerta_especificacion_puerta_id], onDelete: NoAction, onUpdate: NoAction, map: "fk_historial_cambio_orden_trabajo_id_especificaciones_puerta") |
| medidas_puerta | medidas_puerta[] |  |
### Indices y restricciones declarativas
- `@@schema("terreno")`
## `terreno.hoja_doble` (`hoja_doble`)
Definido en `Controladores/prisma/schema.prisma:3095`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| hoja_doble_especificacion_puerta_id | BigInt | @id(map: "pk_hoja_doble") |
| hoja_doble_actividad_derecha | String? |  |
| hoja_doble_medidas_derecha_vertical_alto | Decimal? | @db.Decimal(12, 4) |
| hoja_doble_medidas_derecha_vertical_ancho | Decimal? | @db.Decimal(12, 4) |
| hoja_doble_medidas_derecha_vertical_espesor | Decimal? | @db.Decimal(12, 4) |
| hoja_doble_medidas_derecha_horizontal_alto | Decimal? | @db.Decimal(12, 4) |
| hoja_doble_medidas_derecha_horizontal_ancho | Decimal? | @db.Decimal(12, 4) |
| hoja_doble_medidas_derecha_horizontal_espesor | Decimal? | @db.Decimal(12, 4) |
| hoja_doble_actividad_izquierda | String? |  |
| hoja_doble_medidas_izquierda_vertical_alto | Decimal? | @db.Decimal(12, 4) |
| hoja_doble_medidas_izquierda_vertical_ancho | Decimal? | @db.Decimal(12, 4) |
| hoja_doble_medidas_izquierda_vertical_espesor | Decimal? | @db.Decimal(12, 4) |
| hoja_doble_medidas_izquierda_horizontal_alto | Decimal? | @db.Decimal(12, 4) |
| hoja_doble_medidas_izquierda_horizontal_ancho | Decimal? | @db.Decimal(12, 4) |
| hoja_doble_medidas_izquierda_horizontal_espesor | Decimal? | @db.Decimal(12, 4) |
### Indices y restricciones declarativas
- `@@schema("terreno")`
## `terreno.hoja_simple` (`hoja_simple`)
Definido en `Controladores/prisma/schema.prisma:3115`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| hoja_simple_especificacion_puerta_id | BigInt | @id(map: "pk_hoja_simple") |
| hoja_simple_medidas_vertical_alto | Decimal? | @db.Decimal(12, 4) |
| hoja_simple_medidas_vertical_ancho | Decimal? | @db.Decimal(12, 4) |
| hoja_simple_medidas_vertical_espesor | Decimal? | @db.Decimal(12, 4) |
| hoja_simple_medidas_horizontal_alto | Decimal? | @db.Decimal(12, 4) |
| hoja_simple_medidas_horizontal_ancho | Decimal? | @db.Decimal(12, 4) |
| hoja_simple_medidas_horizontal_espesor | Decimal? | @db.Decimal(12, 4) |
### Indices y restricciones declarativas
- `@@schema("terreno")`
## `terreno.item_comercial` (`item_comercial`)
Definido en `Controladores/prisma/schema.prisma:3128`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_item_comercial | Int | @id(map: "pk_terreno_item_comercial") @default(autoincrement()) |
| nombre_item | String | @db.VarChar(150) |
| descripcion_item | String? |  |
| tipo_item | String? | @db.VarChar(50) |
| estado_item | String | @default("activo") @db.VarChar(30) |
| detalle_cotizacion | detalle_cotizacion[] |  |
| extensiones_comerciales | extension_producto_comercial[] |  |
### Indices y restricciones declarativas
- `@@schema("terreno")`
## `terreno.medidas_puerta` (`medidas_puerta`)
Definido en `Controladores/prisma/schema.prisma:3140`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| medidas_puerta_medidas_id | BigInt | @id(map: "pk_medidas_puerta") @default(autoincrement()) |
| medidas_puerta_medidas_marco_ancho | Decimal? | @db.Decimal(12, 4) |
| medidas_puerta_medidas_marco_alto | Decimal? | @db.Decimal(12, 4) |
| medidas_puerta_medidas_marco_espesor | Decimal? | @db.Decimal(12, 4) |
| medidas_puerta_medidas_vano_vertical_ancho | Decimal? | @db.Decimal(12, 4) |
| medidas_puerta_medidas_vano_vertical_alto | Decimal? | @db.Decimal(12, 4) |
| medidas_puerta_medidas_vano_vertical_espesor | Decimal? | @db.Decimal(12, 4) |
| medidas_puerta_medidas_vano_horizontal_ancho | Decimal? | @db.Decimal(12, 4) |
| medidas_puerta_medidas_vano_horizontal_alto | Decimal? | @db.Decimal(12, 4) |
| medidas_puerta_medidas_vano_horizontal_espesor | Decimal? | @db.Decimal(12, 4) |
| medidas_puerta_medidas_alojamiento_vertical_alto | Decimal? | @db.Decimal(12, 4) |
| medidas_puerta_medidas_alojamiento_vertical_ancho | Decimal? | @db.Decimal(12, 4) |
| medidas_puerta_medidas_alojamiento_vertical_espesor | Decimal? | @db.Decimal(12, 4) |
| medidas_puerta_medidas_alojamiento_horizontal_alto | Decimal? | @db.Decimal(12, 4) |
| medidas_puerta_medidas_alojamiento_horizontal_ancho | Decimal? | @db.Decimal(12, 4) |
| medidas_puerta_medidas_alojamiento_horizontal_espesor | Decimal? | @db.Decimal(12, 4) |
| medidas_puerta_alojamiento_vertical | Decimal? | @db.Decimal(12, 4) |
| medidas_puerta_medidas_de_marco_ancho | Decimal? | @db.Decimal(12, 4) |
| medidas_puerta_medidas_de_marco_alto | Decimal? | @db.Decimal(12, 4) |
| medidas_puerta_medidas_de_marco_espesor | Decimal? | @db.Decimal(12, 4) |
| id_especificacion_puerta | BigInt? |  |
| id_cambio | BigInt? |  |
| historial_cambio_orden_trabajo | historial_cambio_orden_trabajo? | @relation(fields: [id_cambio], references: [historial_cambio_orden_trabajo_id_cambio], onDelete: NoAction, onUpdate: NoAction, map: "fk_medidas_puerta_id_cambio") |
| especificaciones_puerta | especificaciones_puerta? | @relation(fields: [id_especificacion_puerta], references: [especificacion_puerta_especificacion_puerta_id], onDelete: NoAction, onUpdate: NoAction, map: "fk_medidas_puerta_id_especificacion_puerta") |
### Indices y restricciones declarativas
- `@@schema("terreno")`
## `terreno.notificacion_tecnico` (`notificacion_tecnico`)
Definido en `Controladores/prisma/schema.prisma:3169`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| notificacion_tecnico_id_notificacion_tecnico | BigInt | @id(map: "pk_notificacion_tecnico") @default(autoincrement()) |
| notificacion_tecnico_fecha_emision | DateTime? | @db.Timestamptz(6) |
| notificacion_tecnico_mensaje | String? |  |
| usuario_id_usuario | BigInt? |  |
| servicio_terreno_id_servicio_terreno | BigInt? |  |
| servicio_terreno | servicio_terreno? | @relation(fields: [servicio_terreno_id_servicio_terreno], references: [servicio_terreno_servicio_terreno_id], onDelete: NoAction, onUpdate: NoAction, map: "fk_notificacion_tecnico_servicio_terreno_id_servicio_terreno") |
| usuario | usuario? | @relation(fields: [usuario_id_usuario], references: [usuario_id_usuario], onDelete: NoAction, onUpdate: NoAction, map: "fk_notificacion_tecnico_usuario_id_usuario") |
### Indices y restricciones declarativas
- `@@schema("terreno")`
## `terreno.notificacion_terreno` (`notificacion_terreno`)
Definido en `Controladores/prisma/schema.prisma:3181`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| notificacion_terreno_id_notificacion_terreno | BigInt | @id(map: "pk_notificacion_terreno") @default(autoincrement()) |
| notificacion_terreno_mensaje | String? |  |
| usuario_id_usuario | BigInt? |  |
| tarea_id_tarea | BigInt? |  |
| tarea | tarea? | @relation(fields: [tarea_id_tarea], references: [tarea_tarea_id], onDelete: NoAction, onUpdate: NoAction, map: "fk_notificacion_terreno_tarea_id_tarea") |
| usuario | usuario? | @relation(fields: [usuario_id_usuario], references: [usuario_id_usuario], onDelete: NoAction, onUpdate: NoAction, map: "fk_notificacion_terreno_usuario_id_usuario") |
### Indices y restricciones declarativas
- `@@schema("terreno")`
## `terreno.obra` (`obra`)
Definido en `Controladores/prisma/schema.prisma:3192`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| obra_obra_id | BigInt | @id(map: "pk_obra") @default(autoincrement()) |
| obra_nombre_obra | String? |  |
| obra_direccion_obra | String? |  |
| obra_comuna | String? |  |
| obra_ciudad | String? |  |
| obra_region | String? |  |
| obra_tipo_obra | String? |  |
| obra_fecha_de_creacion | DateTime? | @db.Date |
| obra_fecha_de_ultima_edicion | DateTime? | @db.Date |
| obra_estado | String? |  |
| obra_cantidad_puerta | Int? |  |
| obra_referencia | String? |  |
| obra_observaciones | String? |  |
| obra_edificio | String? | @db.VarChar(150) |
| obra_unidad | String? | @db.VarChar(100) |
| clave_ubicacion_normalizada | String? | @unique(map: "uq_obra_clave_ubicacion") @db.VarChar(700) |
| revision_comercial | Int | @default(1) |
| rut_cliente | String? | @db.VarChar(12) |
| id_especificacion_puerta | BigInt? |  |
| especificaciones_puerta | especificaciones_puerta? | @relation(fields: [id_especificacion_puerta], references: [especificacion_puerta_especificacion_puerta_id], onDelete: NoAction, onUpdate: NoAction, map: "fk_obra_id_especificacion_puerta") |
| cliente | cliente? | @relation(fields: [rut_cliente], references: [cliente_cliente_rut], onDelete: NoAction, onUpdate: NoAction, map: "fk_obra_rut_cliente") |
| servicios_terreno | servicio_terreno[] |  |
| cotizaciones_contexto | cotizacion[] | @relation("cotizacion_obra_contexto") |
| proyectos_vinculados | proyecto_obra[] |  |
### Indices y restricciones declarativas
- `@@schema("terreno")`
## `terreno.perfil` (`perfil`)
Definido en `Controladores/prisma/schema.prisma:3221`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| codigo_m4 | String? | @unique |
| activo_m4 | Boolean | @default(false) |
| admite_particulares | Boolean | @default(false) |
| perfil_id_perfil | BigInt | @id(map: "pk_perfil") @default(autoincrement()) |
| perfil_nombre_perfil | String? | @db.VarChar(150) |
| perfil_descripcion | String? |  |
| perfil_permiso | perfil_permiso[] |  |
| usuario | usuario[] |  |
### Indices y restricciones declarativas
- `@@schema("terreno")`
## `terreno.perfil_permiso` (`perfil_permiso`)
Definido en `Controladores/prisma/schema.prisma:3234`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| perfil_id_perfil | BigInt |  |
| permiso_id_permiso | BigInt |  |
| perfil_permiso_activo | Boolean? |  |
| perfil | perfil | @relation(fields: [perfil_id_perfil], references: [perfil_id_perfil], onDelete: NoAction, onUpdate: NoAction, map: "fk_perfil_permiso_perfil_id_perfil") |
| permiso | permiso | @relation(fields: [permiso_id_permiso], references: [permiso_id_permiso], onDelete: NoAction, onUpdate: NoAction, map: "fk_perfil_permiso_permiso_id_permiso") |
### Indices y restricciones declarativas
- `@@id([perfil_id_perfil, permiso_id_permiso], map: "pk_perfil_permiso")`
- `@@schema("terreno")`
## `terreno.permiso` (`permiso`)
Definido en `Controladores/prisma/schema.prisma:3245`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| codigo_m4 | String? | @unique |
| activo_m4 | Boolean | @default(false) |
| requiere_administrador | Boolean | @default(false) |
| particulares | usuario_permiso_particular[] |  |
| dependencias | permiso_dependencia[] | @relation("permiso_dependiente") |
| requerido_por | permiso_dependencia[] | @relation("permiso_requerido") |
| permiso_id_permiso | BigInt | @id(map: "pk_permiso") @default(autoincrement()) |
| permiso_modulo | String? | @db.VarChar(150) |
| permiso_accion | String? | @db.VarChar(150) |
| permiso_descripcion | String? |  |
| permiso_nombre_del_permiso | String? | @db.VarChar(150) |
| perfil_permiso | perfil_permiso[] |  |
### Indices y restricciones declarativas
- `@@schema("terreno")`
## `terreno.prestamo_herramientas` (`prestamo_herramientas`)
Definido en `Controladores/prisma/schema.prisma:3262`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| prestamo_herramienta_prestamo_herramienta_id | BigInt | @id(map: "pk_prestamo_herramientas") @default(autoincrement()) |
| prestamo_herramienta_fecha_entrega | DateTime? | @db.Timestamptz(6) |
| prestamo_herramienta_fecha_devolucion | DateTime? | @db.Timestamptz(6) |
| prestamo_herramienta_cantidad | Int? |  |
| prestamo_herramienta_estado_prestamo | String? |  |
| prestamo_herramienta_observacion | String? |  |
| rut_empleado | String? | @db.VarChar(12) |
| sku_material | String? | @db.VarChar(16) |
| empleado | empleado? | @relation(fields: [rut_empleado], references: [rut_empleado], onDelete: NoAction, onUpdate: NoAction, map: "fk_prestamo_herramientas_rut_empleado") |
| material | material? | @relation(fields: [sku_material], references: [material_sku], onDelete: NoAction, onUpdate: NoAction, map: "fk_prestamo_herramientas_sku_material") |
### Indices y restricciones declarativas
- `@@schema("terreno")`
## `terreno.proyecto` (`proyecto`)
Definido en `Controladores/prisma/schema.prisma:3277`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| notas_venta_contexto | nota_venta[] |  |
| proyecto_proyecto_id | BigInt | @id(map: "pk_proyecto") @default(autoincrement()) |
| proyecto_codigo_proyecto | String? |  |
| proyecto_nombre_referencia | String? |  |
| proyecto_fecha_instalacion | DateTime? | @db.Date |
| proyecto_fecha_ingreso | DateTime? | @db.Date |
| proyecto_estado_operacional | String? |  |
| proyecto_estado_produccion | String? |  |
| rut_cliente | String? | @db.VarChar(12) |
| id_cotizacion_origen | Int? | @unique(map: "uq_proyecto_cotizacion_origen") |
| proyecto_financiero | proyecto_financiero[] |  |
| alerta_faltante_pedido | alerta_faltante_pedido[] |  |
| lote | lote[] |  |
| movimiento_inventario | movimiento_inventario[] |  |
| orden_trabajo | orden_trabajo[] |  |
| reserva_inventario | reserva_inventario[] |  |
| cliente | cliente? | @relation(fields: [rut_cliente], references: [cliente_cliente_rut], onDelete: NoAction, onUpdate: NoAction, map: "fk_proyecto_rut_cliente") |
| cotizacion_origen | cotizacion? | @relation("proyecto_cotizacion_origen", fields: [id_cotizacion_origen], references: [id_cotizacion], onDelete: Restrict, onUpdate: NoAction, map: "fk_proyecto_cotizacion_origen") |
| obras | proyecto_obra[] |  |
### Indices y restricciones declarativas
- `@@index([rut_cliente, proyecto_fecha_ingreso], map: "idx_proyecto_cliente_fecha")`
- `@@schema("terreno")`
## `terreno.proyecto_obra` (`proyecto_obra`)
Definido en `Controladores/prisma/schema.prisma:3305`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_proyecto_obra | BigInt | @id @default(autoincrement()) |
| id_proyecto | BigInt |  |
| id_obra | BigInt |  |
| es_principal | Boolean | @default(false) |
| origen | String | @default("COTIZACION") @db.VarChar(30) |
| creado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| proyecto | proyecto | @relation(fields: [id_proyecto], references: [proyecto_proyecto_id], onDelete: Restrict, onUpdate: NoAction, map: "fk_proyecto_obra_proyecto") |
| obra | obra | @relation(fields: [id_obra], references: [obra_obra_id], onDelete: Restrict, onUpdate: NoAction, map: "fk_proyecto_obra_obra") |
### Indices y restricciones declarativas
- `@@unique([id_proyecto, id_obra], map: "uq_proyecto_obra")`
- `@@index([id_obra, id_proyecto], map: "idx_proyecto_obra_obra")`
- `@@schema("terreno")`
## `terreno.receptor` (`receptor`)
Definido en `Controladores/prisma/schema.prisma:3320`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| receptor_receptor_id | BigInt | @id(map: "pk_receptor") @default(autoincrement()) |
| receptor_primer_nombre_receptor | String? |  |
| receptor_segundo_nombre_receptor | String? |  |
| receptor_primer_apellido_receptor | String? |  |
| receptor_segundo_apellido_receptor | String? |  |
| receptor_rut_receptor | String? |  |
| id_tarea | BigInt? |  |
| tarea | tarea? | @relation(fields: [id_tarea], references: [tarea_tarea_id], onDelete: NoAction, onUpdate: NoAction, map: "fk_receptor_id_tarea") |
### Indices y restricciones declarativas
- `@@schema("terreno")`
## `terreno.servicio_terreno` (`servicio_terreno`)
Definido en `Controladores/prisma/schema.prisma:3333`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| servicio_terreno_servicio_terreno_id | BigInt | @id(map: "pk_servicio_terreno") @default(autoincrement()) |
| servicio_terreno_tipo_servicio | String? | @db.VarChar(50) |
| servicio_terreno_fecha_real | DateTime? | @db.Date |
| servicio_terreno_bloque_horario | DateTime? | @db.Time(6) |
| servicio_terreno_prioridad | String? |  |
| servicio_terreno_fecha_programada | DateTime? | @db.Time(6) |
| servicio_terreno_estado | String? |  |
| servicio_terreno_observaciones | String? |  |
| id_usuario | BigInt? |  |
| id_obra | BigInt? |  |
| id_checklist_de_materials | BigInt? |  |
| especificacion_servicio_terreno | especificacion_servicio_terreno[] |  |
| evidencia_terreno | evidencia_terreno[] |  |
| notificacion_tecnico | notificacion_tecnico[] |  |
| checklist_de_materiales | checklist_de_materiales? | @relation(fields: [id_checklist_de_materials], references: [checklist_de_materiales_checklist_de_materials_id], onDelete: NoAction, onUpdate: NoAction, map: "fk_servicio_terreno_id_checklist_de_materials") |
| usuario | usuario? | @relation(fields: [id_usuario], references: [usuario_id_usuario], onDelete: NoAction, onUpdate: NoAction, map: "fk_servicio_terreno_id_usuario") |
| obra | obra? | @relation(fields: [id_obra], references: [obra_obra_id], onDelete: NoAction, onUpdate: NoAction, map: "fk_servicio_terreno_id_obra") |
| servicio_tterreno_herramientas_materiales | servicio_tterreno_herramientas_materiales[] |  |
| tarea | tarea[] |  |
### Indices y restricciones declarativas
- `@@schema("terreno")`
## `terreno.servicio_tterreno_herramientas_materiales` (`servicio_tterreno_herramientas_materiales`)
Definido en `Controladores/prisma/schema.prisma:3357`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_servicio_terreno_herr_material | BigInt |  |
| servicio_terreno_herramientas_materiales_servicio_terreno_id | BigInt |  |
| servicio_terreno | servicio_terreno | @relation(fields: [servicio_terreno_herramientas_materiales_servicio_terreno_id], references: [servicio_terreno_servicio_terreno_id], onDelete: NoAction, onUpdate: NoAction, map: "fk_servicio_tterreno_herramientas_materiales_servic_58285965") |
### Indices y restricciones declarativas
- `@@id([id_servicio_terreno_herr_material, servicio_terreno_herramientas_materiales_servicio_terreno_id], map: "pk_servicio_tterreno_herramientas_materiales")`
- `@@schema("terreno")`
## `terreno.tarea` (`tarea`)
Definido en `Controladores/prisma/schema.prisma:3366`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| tarea_tarea_id | BigInt | @id(map: "pk_tarea") @default(autoincrement()) |
| tarea_descripcion | String? |  |
| tarea_fecha_de_visita | DateTime? | @db.Date |
| tarea_fecha_de_termino | DateTime? | @db.Date |
| tarea_bloque_horario | DateTime? | @db.Timestamptz(6) |
| tarea_fecha_de_creacion | DateTime? | @db.Date |
| tarea_fecha_de_ultima_actualizacion | DateTime? | @db.Date |
| tarea_fecha_de_inicio | DateTime? | @db.Date |
| tarea_fecha_de_inicio_en_terreno | DateTime? | @db.Date |
| tarea_titulo | String? |  |
| tarea_horario_limite | DateTime? | @db.Timestamptz(6) |
| tarea_instrucciones_de_oficina | String? |  |
| tarea_urgencia | String? |  |
| tarea_estado_de_tarea | String? |  |
| id_usuario | BigInt? |  |
| id_servicio_terreno | BigInt? |  |
| id_especificacion_puerta | BigInt? |  |
| id_orden_trabajo | BigInt? |  |
| formulario_de_cierre | formulario_de_cierre[] |  |
| notificacion_terreno | notificacion_terreno[] |  |
| receptor | receptor[] |  |
| especificaciones_puerta | especificaciones_puerta? | @relation(fields: [id_especificacion_puerta], references: [especificacion_puerta_especificacion_puerta_id], onDelete: NoAction, onUpdate: NoAction, map: "fk_tarea_id_especificacion_puerta") |
| servicio_terreno | servicio_terreno? | @relation(fields: [id_servicio_terreno], references: [servicio_terreno_servicio_terreno_id], onDelete: NoAction, onUpdate: NoAction, map: "fk_tarea_id_servicio_terreno") |
| usuario | usuario? | @relation(fields: [id_usuario], references: [usuario_id_usuario], onDelete: NoAction, onUpdate: NoAction, map: "fk_tarea_id_usuario") |
| orden_trabajo | orden_trabajo? | @relation(fields: [id_orden_trabajo], references: [orden_trabajo_id_orden], onDelete: Restrict, onUpdate: NoAction, map: "fk_tarea_orden_trabajo") |
| tarea_tipo | tarea_tipo[] |  |
| ejecuciones | ejecucion_tarea[] |  |
| origen_planificacion_ot | tarea_ejecutable_unidad_ot? |  |
### Indices y restricciones declarativas
- `@@index([id_orden_trabajo], map: "idx_tarea_orden_trabajo")`
- `@@schema("terreno")`
## `terreno.tarea_tipo` (`tarea_tipo`)
Definido en `Controladores/prisma/schema.prisma:3400`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| tarea_tipo_tarea_tipo_id | BigInt | @id(map: "pk_tarea_tipo") @default(autoincrement()) |
| tarea_tipo_tiempo_estimado_tarea | DateTime? | @db.Time(6) |
| tarea_tipo_remuneracion_tarea | Int? |  |
| id_tarea | BigInt? |  |
| tarea | tarea? | @relation(fields: [id_tarea], references: [tarea_tarea_id], onDelete: NoAction, onUpdate: NoAction, map: "fk_tarea_tipo_id_tarea") |
### Indices y restricciones declarativas
- `@@schema("terreno")`
## `terreno.tarea_usuario` (`tarea_usuario`)
Definido en `Controladores/prisma/schema.prisma:3410`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| tarea_usuario_tarea_id | BigInt |  |
| tarea_usuario_usuario_id | BigInt |  |
### Indices y restricciones declarativas
- `@@id([tarea_usuario_tarea_id, tarea_usuario_usuario_id], map: "pk_tarea_usuario")`
- `@@schema("terreno")`
## `terreno.ejecucion_tarea` (`ejecucion_tarea`)
Definido en `Controladores/prisma/schema.prisma:3418`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_ejecucion_tarea | BigInt | @id @default(autoincrement()) |
| id_tarea | BigInt |  |
| id_usuario_ejecutor | BigInt |  |
| fecha_ejecucion | DateTime | @db.Timestamptz(6) |
| estado_ejecucion | String | @default("pendiente") @db.VarChar(20) |
| estado_validacion_productiva | String | @default("pendiente") @db.VarChar(20) |
| cantidad | Decimal? | @db.Decimal(14, 4) |
| unidad | String? | @db.VarChar(30) |
| tarea | tarea | @relation(fields: [id_tarea], references: [tarea_tarea_id], onDelete: Restrict, onUpdate: NoAction) |
| ejecutor | usuario | @relation("ejecucion_tarea_ejecutor", fields: [id_usuario_ejecutor], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
| incidencias | incidencia_retrabajo_tarea[] |  |
| tratamiento_remuneracional | tratamiento_remuneracional_ejecucion? |  |
| atribucion_productiva | atribucion_ejecucion_tarea_ot? |  |
### Indices y restricciones declarativas
- `@@index([estado_ejecucion, estado_validacion_productiva, fecha_ejecucion], map: "idx_ejecucion_tarea_revision_m6")`
- `@@index([id_usuario_ejecutor, fecha_ejecucion], map: "idx_ejecucion_tarea_ejecutor")`
- `@@schema("terreno")`
## `terreno.incidencia_retrabajo_tarea` (`incidencia_retrabajo_tarea`)
Definido en `Controladores/prisma/schema.prisma:3438`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_incidencia_retrabajo | BigInt | @id @default(autoincrement()) |
| id_ejecucion_tarea | BigInt |  |
| descripcion | String |  |
| causa_referencia | String? |  |
| estado | String | @default("pendiente") @db.VarChar(20) |
| responsabilidad | String? | @db.VarChar(120) |
| fecha_registro | DateTime | @default(now()) @db.Timestamptz(6) |
| id_categoria_incidencia | Int? |  |
| id_area_responsable | BigInt? |  |
| id_usuario_creador | BigInt? |  |
| estado_revision | String | @default("pendiente_revision") @db.VarChar(30) |
| id_usuario_revisor | BigInt? |  |
| fecha_revision | DateTime? | @db.Timestamptz(6) |
| observacion_revision | String? |  |
| ejecucion | ejecucion_tarea | @relation(fields: [id_ejecucion_tarea], references: [id_ejecucion_tarea], onDelete: Restrict, onUpdate: NoAction) |
| categoria | categoria_incidencia_terreno? | @relation(fields: [id_categoria_incidencia], references: [id_categoria_incidencia], onDelete: Restrict, onUpdate: NoAction) |
| area_responsable | area_trabajo? | @relation(fields: [id_area_responsable], references: [area_trabajo_id_area], onDelete: Restrict, onUpdate: NoAction) |
| creador | usuario? | @relation("incidencia_creador", fields: [id_usuario_creador], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
| revisor | usuario? | @relation("incidencia_revisor", fields: [id_usuario_revisor], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
| evidencias | evidencia_terreno[] |  |
| decision_remuneracional | decision_remuneracional_retrabajo? |  |
### Indices y restricciones declarativas
- `@@index([estado, fecha_registro], map: "idx_incidencia_retrabajo_pendiente")`
- `@@index([id_ejecucion_tarea], map: "idx_incidencia_retrabajo_ejecucion")`
- `@@index([id_categoria_incidencia, estado_revision], map: "idx_incidencia_categoria_revision")`
- `@@index([id_area_responsable], map: "idx_incidencia_area")`
- `@@schema("terreno")`
## `terreno.categoria_incidencia_terreno` (`categoria_incidencia_terreno`)
Definido en `Controladores/prisma/schema.prisma:3468`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_categoria_incidencia | Int | @id @default(autoincrement()) |
| codigo | String | @unique @db.VarChar(30) |
| nombre | String | @db.VarChar(100) |
| activa | Boolean | @default(true) |
| incidencias | incidencia_retrabajo_tarea[] |  |
### Indices y restricciones declarativas
- `@@schema("terreno")`
## `terreno.usuario` (`usuario`)
Definido en `Controladores/prisma/schema.prisma:3478`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| acceso_m4 | String? | @unique |
| empleado_m4 | String? | @unique @db.VarChar(15) |
| configuracion_particular | Boolean | @default(false) |
| administrador_original | Boolean | @default(false) |
| version_seguridad | Int | @default(0) |
| empleado_seguridad | empleado? | @relation("empleado_m4", fields: [empleado_m4], references: [rut_empleado]) |
| particulares | usuario_permiso_particular[] |  |
| proyecciones_m7_creadas | proyeccion_financiera_m7[] | @relation("proyeccion_m7_creador") |
| cuentas_bancarias_m7_creadas | cuenta_bancaria_m7[] | @relation("cuenta_bancaria_m7_creador") |
| cuentas_bancarias_m7_actualizadas | cuenta_bancaria_m7[] | @relation("cuenta_bancaria_m7_actualizador") |
| saldos_bancarios_m7_creados | saldo_inicial_bancario_m7[] | @relation("saldo_inicial_bancario_m7_creador") |
| saldos_bancarios_m7_actualizados | saldo_inicial_bancario_m7[] | @relation("saldo_inicial_bancario_m7_actualizador") |
| proyecciones_m7_actualizadas | proyeccion_financiera_m7[] | @relation("proyeccion_m7_actualizador") |
| familias_comerciales_creadas | familia_producto_comercial[] | @relation("familia_producto_creador") |
| familias_comerciales_actualizadas | familia_producto_comercial[] | @relation("familia_producto_actualizador") |
| historial_familias_comerciales | historial_familia_producto_comercial[] |  |
| productos_comerciales_creados | extension_producto_comercial[] | @relation("producto_comercial_creador") |
| productos_comerciales_actualizados | extension_producto_comercial[] | @relation("producto_comercial_actualizador") |
| historial_productos_comerciales | historial_producto_comercial[] |  |
| versiones_productos_comerciales | producto_comercial_version[] |  |
| tareas_fabricacion_creadas | catalogo_tarea_fabricacion[] | @relation("tarea_fabricacion_creador") |
| tareas_fabricacion_actualizadas | catalogo_tarea_fabricacion[] | @relation("tarea_fabricacion_actualizador") |
| plantillas_fabricacion_creadas | plantilla_fabricacion_familia[] | @relation("plantilla_fabricacion_creador") |
| plantillas_fabricacion_actualizadas | plantilla_fabricacion_familia[] | @relation("plantilla_fabricacion_actualizador") |
| versiones_plantilla_fabricacion_publicadas | version_plantilla_fabricacion[] | @relation("version_plantilla_publicador") |
| ajustes_plantilla_producto_creados | ajuste_producto_plantilla_fabricacion[] | @relation("ajuste_plantilla_creador") |
| ajustes_plantilla_producto_actualizados | ajuste_producto_plantilla_fabricacion[] | @relation("ajuste_plantilla_actualizador") |
| unidades_fisicas_ot_creadas | unidad_fisica_orden_trabajo[] | @relation("unidad_fisica_ot_creador") |
| historial_unidades_fisicas_ot | historial_unidad_fisica_ot[] |  |
| rectificaciones_ot_asignadas | rectificacion_orden_trabajo[] | @relation("rectificacion_ot_asignador") |
| rectificaciones_ot_actualizadas | rectificacion_orden_trabajo[] | @relation("rectificacion_ot_actualizador") |
| versiones_rectificacion_enviadas | version_rectificacion_orden_trabajo[] | @relation("rectificacion_version_enviador") |
| historial_rectificaciones_ot | historial_rectificacion_orden_trabajo[] | @relation("rectificacion_historial_actor") |
| decisiones_rectificacion_ot | decision_rectificacion_orden_trabajo[] | @relation("decision_rectificacion_actor") |
| liberaciones_ot | liberacion_orden_trabajo[] | @relation("liberacion_ot_actor") |
| estados_tareas_produccion_actualizados | estado_tarea_produccion_ot[] | @relation("estado_tarea_produccion_actualizador") |
| cambios_produccion_ot | historial_cambio_produccion_ot[] | @relation("historial_produccion_actor") |
| etapas_adicionales_ot_creadas | etapa_adicional_orden_trabajo[] | @relation("etapa_adicional_ot_creador") |
| ejecuciones_productivas_registradas | atribucion_ejecucion_tarea_ot[] | @relation("atribucion_ejecucion_registrador") |
| solicitudes_correccion_tecnica_ot | solicitud_correccion_tecnica_ot[] | @relation("solicitud_correccion_actor") |
| aplicaciones_revision_tecnica_ot | aplicacion_revision_tecnica_ot[] | @relation("aplicacion_revision_actor") |
| cierres_ot | cierre_orden_trabajo_produccion[] | @relation("cierre_ot_actor") |
| documentos_logicos_creados | documento_logico[] | @relation("documento_logico_creador") |
| versiones_documentales_creadas | version_documento[] | @relation("version_documento_creador") |
| intenciones_documentales | intencion_carga_documental[] | @relation("intencion_documental_solicitante") |
| asociaciones_documentales_producto | producto_comercial_documento[] | @relation("producto_documento_responsable") |
| cotizaciones_responsable_comercial | cotizacion[] | @relation("cotizacion_responsable_comercial") |
| detalles_precio_excepcional_autorizados | detalle_cotizacion[] | @relation("detalle_cotizacion_precio_excepcional") |
| precios_producto_creados | precio_producto_comercial[] | @relation("precio_producto_creador") |
| opcionales_comerciales_creados | opcional_comercial[] | @relation("opcional_comercial_creador") |
| precios_opcional_creados | precio_opcional_comercial[] | @relation("precio_opcional_creador") |
| tarifas_instalacion_creadas | tarifa_instalacion_comercial[] | @relation("tarifa_instalacion_creador") |
| condiciones_comerciales_creadas | condicion_comercial[] | @relation("condicion_comercial_creador") |
| operaciones_comerciales_idempotentes | idempotencia_operacion_comercial[] |  |
| condiciones_comerciales_publicadas | condicion_comercial_version[] | @relation("condicion_comercial_publicador") |
| plantillas_documentales_creadas | plantilla_documental_comercial[] | @relation("plantilla_documental_creador") |
| plantillas_documentales_publicadas | plantilla_documental_version[] | @relation("plantilla_documental_publicador") |
| cartas_b2c_creadas | carta_comercial_b2c[] | @relation("carta_b2c_creador") |
| cartas_b2c_publicadas | carta_comercial_b2c_version[] | @relation("carta_b2c_publicador") |
| versiones_cotizacion_comercial | cotizacion_version[] | @relation("cotizacion_version_actor") |
| alternativas_b2c_decididas | alternativa_b2c[] | @relation("alternativa_b2c_decisor") |
| historial_alternativas_b2c | historial_decision_alternativa_b2c[] | @relation("historial_alternativa_actor") |
| contactos_cotizacion_b2b_creados | contacto_cotizacion_b2b[] | @relation("contacto_cotizacion_b2b_actor") |
| servicios_comerciales_creados | servicio_comercial[] | @relation("servicio_comercial_actor") |
| precios_servicio_comercial_creados | precio_servicio_comercial[] | @relation("precio_servicio_comercial_actor") |
| selecciones_alternativas_b2c | grupo_alternativas_b2c[] | @relation("grupo_alternativa_selector") |
| historial_selecciones_alternativas_b2c | historial_seleccion_alternativa_b2c[] | @relation("historial_seleccion_alternativa_actor") |
| asignaciones_area_empleado_creadas | asignacion_area_empleado[] | @relation("area_empleado_asignador") |
| asignaciones_area_empleado_finalizadas | asignacion_area_empleado[] | @relation("area_empleado_finalizador") |
| seguridad | estado_seguridad_usuario? |  |
| sesiones | sesion_usuario[] |  |
| recuperaciones | token_recuperacion[] |  |
| usuario_id_usuario | BigInt | @id(map: "pk_usuario") @default(autoincrement()) |
| usuario_fecha_de_ultima_edicion | DateTime? | @db.Timestamptz(6) |
| usuario_rut_usuario | String? | @db.VarChar(12) |
| usuario_fecha_de_creacion | DateTime? | @db.Timestamptz(6) |
| usuario_correo | String? | @db.VarChar(254) |
| usuario_username | String? | @db.VarChar(100) |
| usuario_estado_cuenta | String? | @db.VarChar(50) |
| usuario_fecha_ultima_conexion | DateTime? | @db.Timestamptz(6) |
| usuario_nombre_completo_primer_nombre_usuario | String? | @db.VarChar(100) |
| usuario_nombre_completo_segundo_nombre_usuario | String? | @db.VarChar(100) |
| usuario_nombre_completo_primer_apellido_usuario | String? | @db.VarChar(100) |
| usuario_nombre_completo_segundo_apellido_usuario | String? | @db.VarChar(100) |
| usuario_es_gerencia | Boolean? |  |
| gerencia | String? |  |
| usuario_es_tecnico | Boolean? |  |
| tecnico | String? |  |
| usuario_es_jop | Boolean? |  |
| jop | String? |  |
| usuario_es_administrador | Boolean? |  |
| administrador | String? |  |
| usuario_es_secretaria | Boolean? |  |
| secretaria | String? |  |
| perfil_id_perfil | BigInt? |  |
| empleado_rut_empleado | String? | @db.VarChar(12) |
| evento_auditoria | evento_auditoria[] |  |
| alerta_faltante_pedido | alerta_faltante_pedido[] |  |
| movimiento_inventario | movimiento_inventario[] |  |
| notificacion | notificacion[] |  |
| orden_trabajo | orden_trabajo[] |  |
| preparacion_pedido | preparacion_pedido[] |  |
| reporte | reporte[] |  |
| notificacion_tecnico | notificacion_tecnico[] |  |
| notificacion_terreno | notificacion_terreno[] |  |
| servicio_terreno | servicio_terreno[] |  |
| tarea | tarea[] |  |
| ejecuciones_tarea | ejecucion_tarea[] | @relation("ejecucion_tarea_ejecutor") |
| decisiones_retrabajo_resueltas | decision_remuneracional_retrabajo[] | @relation("decision_retrabajo_resolutor") |
| incidencias_terreno_creadas | incidencia_retrabajo_tarea[] | @relation("incidencia_creador") |
| incidencias_terreno_revisadas | incidencia_retrabajo_tarea[] | @relation("incidencia_revisor") |
| remuneraciones_creadas | remuneracion[] | @relation("remuneracion_creador") |
| periodos_remuneracion_cerrados | periodo_remuneracion[] | @relation("periodo_remuneracion_cerrador") |
| remuneraciones_calculadas | remuneracion[] | @relation("remuneracion_calculador") |
| remuneraciones_cerradas | remuneracion[] | @relation("remuneracion_cerrador") |
| reaperturas_remuneracion_solicitadas | remuneracion[] | @relation("remuneracion_reapertura_solicitante") |
| reaperturas_remuneracion_aprobadas | remuneracion[] | @relation("remuneracion_reapertura_aprobador") |
| componentes_remuneracion_creados | componente_remuneracion[] | @relation("componente_remuneracion_creador") |
| componentes_remuneracion_revisados | componente_remuneracion[] | @relation("componente_remuneracion_revisor") |
| empleado | empleado? | @relation(fields: [empleado_rut_empleado], references: [rut_empleado], onDelete: NoAction, onUpdate: NoAction, map: "fk_usuario_empleado_rut_empleado") |
| perfil | perfil? | @relation(fields: [perfil_id_perfil], references: [perfil_id_perfil], onDelete: NoAction, onUpdate: NoAction, map: "fk_usuario_perfil_id_perfil") |
| usuario_contrasena | usuario_contrasena[] |  |
| historial_proveedor_m5 | historial_proveedor_m5[] |  |
| orden_compra_servicio_m5 | orden_compra_servicio_m5[] | @relation("ocs_m5_creador") |
| solicitudes_crediticias_m8 | solicitud_crediticia_m8[] | @relation("solicitud_crediticia_m8_solicitante") |
| resoluciones_crediticias_m8 | resolucion_solicitud_crediticia_m8[] | @relation("resolucion_crediticia_m8_responsable") |
| eventos_credito_m8 | evento_credito_m8[] | @relation("evento_credito_m8_responsable") |
| historial_orden_compra_servicio_m5 | historial_orden_compra_servicio_m5[] |  |
| ajustes_ocs_solicitados | ajuste_orden_compra_servicio_m5[] | @relation("ajuste_ocs_solicitante") |
| ajustes_ocs_confirmados | ajuste_orden_compra_servicio_m5[] | @relation("ajuste_ocs_confirmante") |
### Indices y restricciones declarativas
- `@@schema("terreno")`
## `finanzas.solicitud_crediticia_m8` (`solicitud_crediticia_m8`)
Definido en `Controladores/prisma/schema.prisma:3614`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_solicitud_crediticia | Int | @id @default(autoincrement()) |
| id_ficha_cliente | Int |  |
| tipo_solicitud | String | @db.VarChar(20) |
| estado_solicitud | String | @default("BORRADOR") @db.VarChar(20) |
| id_usuario_solicitante | BigInt? |  |
| id_cotizacion | Int? |  |
| id_nota_venta | Int? |  |
| referencia_contexto | String? | @db.VarChar(120) |
| antecedentes_resumen | String? |  |
| motivo_solicitud | String? |  |
| condiciones_solicitadas | String? |  |
| fecha_creacion | DateTime | @default(now()) @db.Timestamp(6) |
| fecha_actualizacion | DateTime | @updatedAt @db.Timestamp(6) |
| ficha_cliente | ficha_cliente | @relation(fields: [id_ficha_cliente], references: [id_ficha_cliente], onDelete: Restrict, onUpdate: NoAction, map: "fk_solicitud_crediticia_m8_ficha") |
| solicitante | usuario? | @relation("solicitud_crediticia_m8_solicitante", fields: [id_usuario_solicitante], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction, map: "fk_solicitud_crediticia_m8_solicitante") |
| cotizacion | cotizacion? | @relation(fields: [id_cotizacion], references: [id_cotizacion], onDelete: Restrict, onUpdate: NoAction, map: "fk_solicitud_crediticia_m8_cotizacion") |
| nota_venta | nota_venta? | @relation(fields: [id_nota_venta], references: [id_nota_venta], onDelete: Restrict, onUpdate: NoAction, map: "fk_solicitud_crediticia_m8_nota_venta") |
| resolucion | resolucion_solicitud_crediticia_m8? |  |
| compromisos_autorizados | compromiso_credito_m8[] |  |
### Indices y restricciones declarativas
- `@@index([estado_solicitud, tipo_solicitud, fecha_creacion], map: "idx_solicitud_crediticia_m8_bandeja")`
- `@@index([id_ficha_cliente], map: "idx_solicitud_crediticia_m8_cliente")`
- `@@index([id_usuario_solicitante], map: "idx_solicitud_crediticia_m8_solicitante")`
- `@@schema("finanzas")`
## `finanzas.condicion_crediticia_m8` (`condicion_crediticia_m8`)
Definido en `Controladores/prisma/schema.prisma:3642`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_condicion_crediticia | Int | @id @default(autoincrement()) |
| id_ficha_cliente | Int | @unique |
| credito_habilitado | Boolean | @default(false) |
| monto_cupo | Decimal? | @db.Decimal(14, 2) |
| vigencia_desde | DateTime? | @db.Date |
| vigencia_hasta | DateTime? | @db.Date |
| suspendido | Boolean | @default(false) |
| motivo_suspension | String? |  |
| fecha_suspension | DateTime? | @db.Timestamp(6) |
| fecha_reactivacion | DateTime? | @db.Timestamp(6) |
| actualizado_en | DateTime | @default(now()) @updatedAt @db.Timestamp(6) |
| ficha_cliente | ficha_cliente | @relation(fields: [id_ficha_cliente], references: [id_ficha_cliente], onDelete: Restrict, onUpdate: NoAction, map: "fk_condicion_crediticia_m8_ficha") |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.limite_global_credito_m8` (`limite_global_credito_m8`)
Definido en `Controladores/prisma/schema.prisma:3659`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_limite_global | Int | @id @default(autoincrement()) |
| monto_limite | Decimal | @db.Decimal(14, 2) |
| vigencia_desde | DateTime | @db.Date |
| vigencia_hasta | DateTime? | @db.Date |
| motivo | String |  |
| id_responsable | BigInt |  |
| creado_en | DateTime | @default(now()) @db.Timestamp(6) |
### Indices y restricciones declarativas
- `@@index([vigencia_desde, vigencia_hasta], map: "idx_limite_global_credito_m8_vigencia")`
- `@@schema("finanzas")`
## `finanzas.resolucion_solicitud_crediticia_m8` (`resolucion_solicitud_crediticia_m8`)
Definido en `Controladores/prisma/schema.prisma:3672`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_resolucion | Int | @id @default(autoincrement()) |
| id_solicitud_crediticia | Int | @unique |
| decision | String | @db.VarChar(20) |
| motivo | String |  |
| monto_cupo_aprobado | Decimal? | @db.Decimal(14, 2) |
| vigencia_desde | DateTime? | @db.Date |
| vigencia_hasta | DateTime? | @db.Date |
| condiciones_aprobadas | String? |  |
| id_usuario_responsable | BigInt |  |
| fecha_resolucion | DateTime | @default(now()) @db.Timestamp(6) |
| solicitud | solicitud_crediticia_m8 | @relation(fields: [id_solicitud_crediticia], references: [id_solicitud_crediticia], onDelete: Restrict, onUpdate: NoAction, map: "fk_resolucion_crediticia_m8_solicitud") |
| responsable | usuario | @relation("resolucion_crediticia_m8_responsable", fields: [id_usuario_responsable], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction, map: "fk_resolucion_crediticia_m8_responsable") |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.compromiso_credito_m8` (`compromiso_credito_m8`)
Definido en `Controladores/prisma/schema.prisma:3689`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_compromiso | Int | @id @default(autoincrement()) |
| id_ficha_cliente | Int |  |
| id_nota_venta | Int | @unique |
| id_solicitud_excepcion | Int? |  |
| monto_original | Decimal | @db.Decimal(14, 2) |
| monto_pendiente | Decimal | @db.Decimal(14, 2) |
| condiciones | String? |  |
| estado | String | @default("VIGENTE") @db.VarChar(20) |
| fecha_formalizacion | DateTime | @default(now()) @db.Timestamp(6) |
| fecha_liberacion | DateTime? | @db.Timestamp(6) |
| ficha_cliente | ficha_cliente | @relation(fields: [id_ficha_cliente], references: [id_ficha_cliente], onDelete: Restrict, onUpdate: NoAction, map: "fk_compromiso_credito_m8_ficha") |
| nota_venta | nota_venta | @relation(fields: [id_nota_venta], references: [id_nota_venta], onDelete: Restrict, onUpdate: NoAction, map: "fk_compromiso_credito_m8_nota") |
| solicitud_excepcion | solicitud_crediticia_m8? | @relation(fields: [id_solicitud_excepcion], references: [id_solicitud_crediticia], onDelete: Restrict, onUpdate: NoAction, map: "fk_compromiso_credito_m8_excepcion") |
| reducciones | reduccion_compromiso_credito_m8[] |  |
### Indices y restricciones declarativas
- `@@index([id_ficha_cliente, estado], map: "idx_compromiso_credito_m8_cliente_estado")`
- `@@schema("finanzas")`
## `finanzas.reduccion_compromiso_credito_m8` (`reduccion_compromiso_credito_m8`)
Definido en `Controladores/prisma/schema.prisma:3709`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_reduccion | Int | @id @default(autoincrement()) |
| id_compromiso | Int |  |
| id_pago_cliente | Int | @unique |
| monto_reduccion | Decimal | @db.Decimal(14, 2) |
| fecha_reduccion | DateTime | @default(now()) @db.Timestamp(6) |
| compromiso | compromiso_credito_m8 | @relation(fields: [id_compromiso], references: [id_compromiso], onDelete: Restrict, onUpdate: NoAction, map: "fk_reduccion_credito_m8_compromiso") |
| pago_cliente | pago_cliente | @relation(fields: [id_pago_cliente], references: [id_pago_cliente], onDelete: Restrict, onUpdate: NoAction, map: "fk_reduccion_credito_m8_pago") |
### Indices y restricciones declarativas
- `@@index([id_compromiso], map: "idx_reduccion_credito_m8_compromiso")`
- `@@schema("finanzas")`
## `finanzas.evento_credito_m8` (`evento_credito_m8`)
Definido en `Controladores/prisma/schema.prisma:3723`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_evento | Int | @id @default(autoincrement()) |
| id_ficha_cliente | Int |  |
| tipo_evento | String | @db.VarChar(40) |
| motivo | String? |  |
| valor_anterior | String? |  |
| valor_nuevo | String? |  |
| id_referencia | Int? |  |
| id_usuario | BigInt |  |
| fecha_evento | DateTime | @default(now()) @db.Timestamp(6) |
| ficha_cliente | ficha_cliente | @relation(fields: [id_ficha_cliente], references: [id_ficha_cliente], onDelete: Restrict, onUpdate: NoAction, map: "fk_evento_credito_m8_ficha") |
| responsable | usuario | @relation("evento_credito_m8_responsable", fields: [id_usuario], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction, map: "fk_evento_credito_m8_responsable") |
### Indices y restricciones declarativas
- `@@index([id_ficha_cliente, fecha_evento], map: "idx_evento_credito_m8_cliente_fecha")`
- `@@schema("finanzas")`
## `terreno.usuario_contrasena` (`usuario_contrasena`)
Definido en `Controladores/prisma/schema.prisma:3741`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| activa | Boolean | @default(false) |
| temporal | Boolean | @default(false) |
| creada | DateTime | @default(now()) @db.Timestamptz(6) |
| vence | DateTime? | @db.Timestamptz(6) |
| invalidada | DateTime? | @db.Timestamptz(6) |
| usuario_id_usuario | BigInt |  |
| usuario_contrasena | String |  |
| usuario | usuario | @relation(fields: [usuario_id_usuario], references: [usuario_id_usuario], onDelete: NoAction, onUpdate: NoAction, map: "fk_usuario_contrasena_usuario_id_usuario") |
### Indices y restricciones declarativas
- `@@id([usuario_id_usuario, usuario_contrasena], map: "pk_usuario_contrasena")`
- `@@schema("terreno")`
## `finanzas.familia_producto_comercial` (`familia_producto_comercial`)
Definido en `Controladores/prisma/schema.prisma:3800`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_familia_producto_comercial | Int | @id @default(autoincrement()) |
| codigo | String | @unique @db.VarChar(40) |
| nombre | String | @db.VarChar(150) |
| descripcion | String? |  |
| estado | String | @default("ACTIVA") @db.VarChar(20) |
| revision | Int | @default(1) |
| creado_en | DateTime | @default(now()) @db.Timestamp(6) |
| actualizado_en | DateTime | @default(now()) @db.Timestamp(6) |
| creado_por | BigInt |  |
| actualizado_por | BigInt |  |
| creador | usuario | @relation("familia_producto_creador", fields: [creado_por], references: [usuario_id_usuario], onDelete: Restrict) |
| actualizador | usuario | @relation("familia_producto_actualizador", fields: [actualizado_por], references: [usuario_id_usuario], onDelete: Restrict) |
| productos | extension_producto_comercial[] |  |
| versiones | producto_comercial_version[] |  |
| historial | historial_familia_producto_comercial[] |  |
| plantilla_fabricacion | plantilla_fabricacion_familia? |  |
| unidades_fisicas_ot | unidad_fisica_orden_trabajo[] |  |
### Indices y restricciones declarativas
- `@@index([estado, nombre])`
- `@@schema("finanzas")`
## `finanzas.historial_familia_producto_comercial` (`historial_familia_producto_comercial`)
Definido en `Controladores/prisma/schema.prisma:3823`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_historial_familia_producto_comercial | Int | @id @default(autoincrement()) |
| id_familia_producto_comercial | Int |  |
| evento | String | @db.VarChar(40) |
| valor_anterior | Json? |  |
| valor_nuevo | Json? |  |
| motivo | String? |  |
| usuario_id_usuario | BigInt |  |
| fecha_evento | DateTime | @default(now()) @db.Timestamp(6) |
| familia | familia_producto_comercial | @relation(fields: [id_familia_producto_comercial], references: [id_familia_producto_comercial], onDelete: Restrict) |
| usuario | usuario | @relation(fields: [usuario_id_usuario], references: [usuario_id_usuario], onDelete: Restrict) |
### Indices y restricciones declarativas
- `@@index([id_familia_producto_comercial, fecha_evento])`
- `@@schema("finanzas")`
## `finanzas.extension_producto_comercial` (`extension_producto_comercial`)
Definido en `Controladores/prisma/schema.prisma:3839`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_extension_producto_comercial | Int | @id @default(autoincrement()) |
| codigo_comercial | String | @unique @db.VarChar(60) |
| nombre_comercial | String | @db.VarChar(200) |
| id_familia_producto_comercial | Int |  |
| subfamilia | String? | @db.VarChar(120) |
| tipo_producto | String? | @db.VarChar(100) |
| descripcion_general | String? |  |
| descripcion_b2b | String? |  |
| descripcion_b2c | String? |  |
| observaciones | String? |  |
| garantia_referencial | String? |  |
| condiciones_particulares | String? |  |
| caracteristicas_destacadas | Json | @default("[]") |
| caracteristicas_tecnicas | Json | @default("{}") |
| estado | String | @default("BORRADOR") @db.VarChar(20) |
| id_item_comercial | Int? | @unique |
| producto_terminado_id_producto | BigInt? | @unique |
| numero_version_vigente | Int? |  |
| revision | Int | @default(1) |
| creado_en | DateTime | @default(now()) @db.Timestamp(6) |
| actualizado_en | DateTime | @default(now()) @db.Timestamp(6) |
| creado_por | BigInt |  |
| actualizado_por | BigInt |  |
| familia | familia_producto_comercial | @relation(fields: [id_familia_producto_comercial], references: [id_familia_producto_comercial], onDelete: Restrict) |
| item_comercial | item_comercial? | @relation(fields: [id_item_comercial], references: [id_item_comercial], onDelete: Restrict) |
| producto_terminado | producto_terminado? | @relation(fields: [producto_terminado_id_producto], references: [producto_terminado_id_producto], onDelete: Restrict) |
| creador | usuario | @relation("producto_comercial_creador", fields: [creado_por], references: [usuario_id_usuario], onDelete: Restrict) |
| actualizador | usuario | @relation("producto_comercial_actualizador", fields: [actualizado_por], references: [usuario_id_usuario], onDelete: Restrict) |
| versiones | producto_comercial_version[] |  |
| historial | historial_producto_comercial[] |  |
| documentos | producto_comercial_documento[] |  |
| ajuste_plantilla_fabricacion | ajuste_producto_plantilla_fabricacion? |  |
| unidades_fisicas_ot | unidad_fisica_orden_trabajo[] |  |
| precios_comerciales | precio_producto_comercial[] |  |
| compatibilidades_opcionales | compatibilidad_opcional_producto[] |  |
| detalles_cotizacion | detalle_cotizacion[] |  |
| alternativas_b2c | alternativa_b2c[] |  |
### Indices y restricciones declarativas
- `@@index([id_familia_producto_comercial, estado])`
- `@@index([nombre_comercial])`
- `@@schema("finanzas")`
## `finanzas.catalogo_tarea_fabricacion` (`catalogo_tarea_fabricacion`)
Definido en `Controladores/prisma/schema.prisma:3884`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_tarea_fabricacion | Int | @id @default(autoincrement()) |
| nombre | String | @db.VarChar(150) |
| descripcion | String? |  |
| id_area_trabajo | BigInt |  |
| tiempo_estimado_min | Int? |  |
| estado | String | @default("ACTIVA") @db.VarChar(20) |
| revision | Int | @default(1) |
| creado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| actualizado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| creado_por | BigInt |  |
| actualizado_por | BigInt |  |
| area | area_trabajo | @relation(fields: [id_area_trabajo], references: [area_trabajo_id_area], onDelete: Restrict, onUpdate: NoAction) |
| creador | usuario | @relation("tarea_fabricacion_creador", fields: [creado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
| actualizador | usuario | @relation("tarea_fabricacion_actualizador", fields: [actualizado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
### Indices y restricciones declarativas
- `@@index([id_area_trabajo, estado])`
- `@@index([estado, nombre])`
- `@@schema("finanzas")`
## `finanzas.plantilla_fabricacion_familia` (`plantilla_fabricacion_familia`)
Definido en `Controladores/prisma/schema.prisma:3906`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_plantilla_fabricacion | Int | @id @default(autoincrement()) |
| id_familia_producto_comercial | Int | @unique |
| borrador | Json | @default("{\"etapas\":[]}") |
| numero_version_vigente | Int? |  |
| revision | Int | @default(1) |
| creado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| actualizado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| creado_por | BigInt |  |
| actualizado_por | BigInt |  |
| familia | familia_producto_comercial | @relation(fields: [id_familia_producto_comercial], references: [id_familia_producto_comercial], onDelete: Restrict, onUpdate: NoAction) |
| creador | usuario | @relation("plantilla_fabricacion_creador", fields: [creado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
| actualizador | usuario | @relation("plantilla_fabricacion_actualizador", fields: [actualizado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
| versiones | version_plantilla_fabricacion[] |  |
| ajustes_producto | ajuste_producto_plantilla_fabricacion[] |  |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.version_plantilla_fabricacion` (`version_plantilla_fabricacion`)
Definido en `Controladores/prisma/schema.prisma:3926`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_version_plantilla | Int | @id @default(autoincrement()) |
| id_plantilla_fabricacion | Int |  |
| numero_version | Int |  |
| contenido | Json |  |
| motivo | String |  |
| publicado_por | BigInt |  |
| publicado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| plantilla | plantilla_fabricacion_familia | @relation(fields: [id_plantilla_fabricacion], references: [id_plantilla_fabricacion], onDelete: Restrict, onUpdate: NoAction) |
| publicador | usuario | @relation("version_plantilla_publicador", fields: [publicado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
| ajustes_producto | ajuste_producto_plantilla_fabricacion[] |  |
| unidades_fisicas_ot | unidad_fisica_orden_trabajo[] |  |
### Indices y restricciones declarativas
- `@@unique([id_plantilla_fabricacion, numero_version])`
- `@@index([id_plantilla_fabricacion, publicado_en])`
- `@@schema("finanzas")`
## `finanzas.ajuste_producto_plantilla_fabricacion` (`ajuste_producto_plantilla_fabricacion`)
Definido en `Controladores/prisma/schema.prisma:3945`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_ajuste_plantilla | Int | @id @default(autoincrement()) |
| id_extension_producto_comercial | Int | @unique |
| id_plantilla_fabricacion | Int |  |
| id_version_plantilla_base | Int |  |
| cambios | Json | @default("{\"operaciones\":[]}") |
| estado | String | @default("BORRADOR") @db.VarChar(20) |
| revision | Int | @default(1) |
| creado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| actualizado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| creado_por | BigInt |  |
| actualizado_por | BigInt |  |
| producto | extension_producto_comercial | @relation(fields: [id_extension_producto_comercial], references: [id_extension_producto_comercial], onDelete: Restrict, onUpdate: NoAction) |
| plantilla | plantilla_fabricacion_familia | @relation(fields: [id_plantilla_fabricacion], references: [id_plantilla_fabricacion], onDelete: Restrict, onUpdate: NoAction) |
| version_base | version_plantilla_fabricacion | @relation(fields: [id_version_plantilla_base], references: [id_version_plantilla], onDelete: Restrict, onUpdate: NoAction) |
| creador | usuario | @relation("ajuste_plantilla_creador", fields: [creado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
| actualizador | usuario | @relation("ajuste_plantilla_actualizador", fields: [actualizado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
### Indices y restricciones declarativas
- `@@index([id_plantilla_fabricacion, estado])`
- `@@schema("finanzas")`
## `finanzas.unidad_fisica_orden_trabajo` (`unidad_fisica_orden_trabajo`)
Definido en `Controladores/prisma/schema.prisma:3968`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_unidad_fisica_ot | BigInt | @id @default(autoincrement()) |
| id_cotizacion | Int |  |
| id_detalle_cotizacion | Int |  |
| id_extension_producto_comercial | Int |  |
| id_familia_producto_comercial | Int |  |
| numero_unidad | Int |  |
| id_version_plantilla | Int |  |
| id_orden_trabajo | BigInt | @unique |
| estado | String | @default("PENDIENTE_RECTIFICACION") @db.VarChar(40) |
| planificacion_inicial | Json |  |
| planificacion_actual | Json |  |
| revision | Int | @default(1) |
| creado_por | BigInt |  |
| creado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| actualizado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| cotizacion | cotizacion | @relation(fields: [id_cotizacion], references: [id_cotizacion], onDelete: Restrict, onUpdate: NoAction) |
| detalle | detalle_cotizacion | @relation(fields: [id_detalle_cotizacion], references: [id_detalle_cotizacion], onDelete: Restrict, onUpdate: NoAction) |
| producto | extension_producto_comercial | @relation(fields: [id_extension_producto_comercial], references: [id_extension_producto_comercial], onDelete: Restrict, onUpdate: NoAction) |
| familia | familia_producto_comercial | @relation(fields: [id_familia_producto_comercial], references: [id_familia_producto_comercial], onDelete: Restrict, onUpdate: NoAction) |
| version_plantilla | version_plantilla_fabricacion | @relation(fields: [id_version_plantilla], references: [id_version_plantilla], onDelete: Restrict, onUpdate: NoAction) |
| orden_trabajo | orden_trabajo | @relation(fields: [id_orden_trabajo], references: [orden_trabajo_id_orden], onDelete: Restrict, onUpdate: NoAction) |
| creador | usuario | @relation("unidad_fisica_ot_creador", fields: [creado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
| historial | historial_unidad_fisica_ot[] |  |
| rectificacion | rectificacion_orden_trabajo? |  |
| liberacion | liberacion_orden_trabajo? |  |
| tareas_ejecutables | tarea_ejecutable_unidad_ot[] |  |
| historial_produccion | historial_cambio_produccion_ot[] |  |
| etapas_adicionales | etapa_adicional_orden_trabajo[] |  |
| solicitudes_correccion_tecnica | solicitud_correccion_tecnica_ot[] |  |
| aplicaciones_revision_tecnica | aplicacion_revision_tecnica_ot[] |  |
| cierre_produccion | cierre_orden_trabajo_produccion? |  |
### Indices y restricciones declarativas
- `@@unique([id_detalle_cotizacion, numero_unidad])`
- `@@index([id_cotizacion, estado])`
- `@@index([id_extension_producto_comercial, id_familia_producto_comercial])`
- `@@schema("finanzas")`
## `finanzas.historial_unidad_fisica_ot` (`historial_unidad_fisica_ot`)
Definido en `Controladores/prisma/schema.prisma:4008`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_historial_unidad_fisica_ot | BigInt | @id @default(autoincrement()) |
| id_unidad_fisica_ot | BigInt |  |
| evento | String | @db.VarChar(50) |
| valor_anterior | Json? |  |
| valor_nuevo | Json? |  |
| motivo | String? |  |
| usuario_id_usuario | BigInt |  |
| fecha_evento | DateTime | @default(now()) @db.Timestamptz(6) |
| unidad | unidad_fisica_orden_trabajo | @relation(fields: [id_unidad_fisica_ot], references: [id_unidad_fisica_ot], onDelete: Restrict, onUpdate: NoAction) |
| usuario | usuario | @relation(fields: [usuario_id_usuario], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
### Indices y restricciones declarativas
- `@@index([id_unidad_fisica_ot, fecha_evento])`
- `@@schema("finanzas")`
## `finanzas.rectificacion_orden_trabajo` (`rectificacion_orden_trabajo`)
Definido en `Controladores/prisma/schema.prisma:4025`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_rectificacion_ot | BigInt | @id @default(autoincrement()) |
| id_unidad_fisica_ot | BigInt | @unique |
| id_empleado_rectificador | Int? |  |
| id_especificacion_puerta | BigInt? | @unique |
| estado | String | @default("PENDIENTE_RECTIFICACION") @db.VarChar(50) |
| fecha_asignacion | DateTime? | @db.Timestamptz(6) |
| fecha_inicio | DateTime? | @db.Timestamptz(6) |
| fecha_rectificacion | DateTime? | @db.Date |
| observaciones_tecnicas | String? |  |
| caracteristicas_particulares | Json | @default("{}") |
| necesita_tareas_adicionales | Boolean | @default(false) |
| comentarios_fabricacion | String? |  |
| comentarios_instalacion | String? |  |
| revision | Int | @default(1) |
| asignado_por | BigInt? |  |
| actualizado_por | BigInt |  |
| creado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| actualizado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| unidad | unidad_fisica_orden_trabajo | @relation(fields: [id_unidad_fisica_ot], references: [id_unidad_fisica_ot], onDelete: Restrict, onUpdate: NoAction) |
| empleado_rectificador | empleado? | @relation(fields: [id_empleado_rectificador], references: [id_empleado], onDelete: Restrict, onUpdate: NoAction) |
| especificacion | especificaciones_puerta? | @relation(fields: [id_especificacion_puerta], references: [especificacion_puerta_especificacion_puerta_id], onDelete: Restrict, onUpdate: NoAction) |
| asignador | usuario? | @relation("rectificacion_ot_asignador", fields: [asignado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
| actualizador | usuario | @relation("rectificacion_ot_actualizador", fields: [actualizado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
| versiones | version_rectificacion_orden_trabajo[] |  |
| historial | historial_rectificacion_orden_trabajo[] |  |
| decisiones | decision_rectificacion_orden_trabajo[] |  |
### Indices y restricciones declarativas
- `@@index([estado, id_empleado_rectificador])`
- `@@schema("finanzas")`
## `finanzas.version_rectificacion_orden_trabajo` (`version_rectificacion_orden_trabajo`)
Definido en `Controladores/prisma/schema.prisma:4058`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_version_rectificacion | BigInt | @id @default(autoincrement()) |
| id_rectificacion_ot | BigInt |  |
| numero_version | Int |  |
| datos_rectificacion | Json |  |
| planificacion | Json |  |
| enviado_por | BigInt |  |
| enviado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| rectificacion | rectificacion_orden_trabajo | @relation(fields: [id_rectificacion_ot], references: [id_rectificacion_ot], onDelete: Restrict, onUpdate: NoAction) |
| enviador | usuario | @relation("rectificacion_version_enviador", fields: [enviado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
| decision | decision_rectificacion_orden_trabajo? |  |
| liberacion | liberacion_orden_trabajo? |  |
| tareas_ejecutables | tarea_ejecutable_unidad_ot[] |  |
| cambios_produccion | historial_cambio_produccion_ot[] |  |
| solicitudes_correccion | solicitud_correccion_tecnica_ot[] | @relation("solicitud_correccion_version_base") |
| aplicaciones_produccion | aplicacion_revision_tecnica_ot[] |  |
| cierres_produccion | cierre_orden_trabajo_produccion[] |  |
### Indices y restricciones declarativas
- `@@unique([id_rectificacion_ot, numero_version])`
- `@@schema("finanzas")`
## `finanzas.historial_rectificacion_orden_trabajo` (`historial_rectificacion_orden_trabajo`)
Definido en `Controladores/prisma/schema.prisma:4081`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_historial_rectificacion | BigInt | @id @default(autoincrement()) |
| id_rectificacion_ot | BigInt |  |
| entidad | String | @db.VarChar(50) |
| tipo_modificacion | String | @db.VarChar(60) |
| valor_anterior | Json? |  |
| valor_nuevo | Json? |  |
| motivo | String? |  |
| usuario_id_usuario | BigInt |  |
| fecha_evento | DateTime | @default(now()) @db.Timestamptz(6) |
| rectificacion | rectificacion_orden_trabajo | @relation(fields: [id_rectificacion_ot], references: [id_rectificacion_ot], onDelete: Restrict, onUpdate: NoAction) |
| usuario | usuario | @relation("rectificacion_historial_actor", fields: [usuario_id_usuario], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
### Indices y restricciones declarativas
- `@@index([id_rectificacion_ot, fecha_evento])`
- `@@schema("finanzas")`
## `finanzas.decision_rectificacion_orden_trabajo` (`decision_rectificacion_orden_trabajo`)
Definido en `Controladores/prisma/schema.prisma:4099`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_decision_rectificacion | BigInt | @id @default(autoincrement()) |
| id_rectificacion_ot | BigInt |  |
| id_version_rectificacion | BigInt | @unique |
| decision | String | @db.VarChar(20) |
| motivo | String? |  |
| observaciones_tecnicas | String? |  |
| decidido_por | BigInt |  |
| decidido_en | DateTime | @default(now()) @db.Timestamptz(6) |
| rectificacion | rectificacion_orden_trabajo | @relation(fields: [id_rectificacion_ot], references: [id_rectificacion_ot], onDelete: Restrict, onUpdate: NoAction) |
| version | version_rectificacion_orden_trabajo | @relation(fields: [id_version_rectificacion], references: [id_version_rectificacion], onDelete: Restrict, onUpdate: NoAction) |
| actor | usuario | @relation("decision_rectificacion_actor", fields: [decidido_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
### Indices y restricciones declarativas
- `@@index([id_rectificacion_ot, decidido_en])`
- `@@schema("finanzas")`
## `finanzas.liberacion_orden_trabajo` (`liberacion_orden_trabajo`)
Definido en `Controladores/prisma/schema.prisma:4117`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_liberacion_ot | BigInt | @id @default(autoincrement()) |
| id_unidad_fisica_ot | BigInt | @unique |
| id_version_rectificacion | BigInt | @unique |
| liberado_por | BigInt |  |
| liberado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| unidad | unidad_fisica_orden_trabajo | @relation(fields: [id_unidad_fisica_ot], references: [id_unidad_fisica_ot], onDelete: Restrict, onUpdate: NoAction) |
| version | version_rectificacion_orden_trabajo | @relation(fields: [id_version_rectificacion], references: [id_version_rectificacion], onDelete: Restrict, onUpdate: NoAction) |
| actor | usuario | @relation("liberacion_ot_actor", fields: [liberado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.tarea_ejecutable_unidad_ot` (`tarea_ejecutable_unidad_ot`)
Definido en `Controladores/prisma/schema.prisma:4131`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_tarea_ejecutable_ot | BigInt | @id @default(autoincrement()) |
| id_unidad_fisica_ot | BigInt |  |
| id_version_rectificacion | BigInt |  |
| id_tarea | BigInt | @unique |
| id_etapa_planificacion | String | @db.VarChar(120) |
| id_tarea_planificacion | String | @db.VarChar(120) |
| orden_etapa | Int |  |
| orden_tarea | Int |  |
| id_empleado_planificado | Int? |  |
| origen | String | @default("PLAN_APROBADO") @db.VarChar(30) |
| id_etapa_adicional_ot | BigInt? |  |
| clave_idempotencia | String? | @unique @db.VarChar(120) |
| id_tarea_origen_correctiva | BigInt? |  |
| creado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| unidad | unidad_fisica_orden_trabajo | @relation(fields: [id_unidad_fisica_ot], references: [id_unidad_fisica_ot], onDelete: Restrict, onUpdate: NoAction) |
| version | version_rectificacion_orden_trabajo | @relation(fields: [id_version_rectificacion], references: [id_version_rectificacion], onDelete: Restrict, onUpdate: NoAction) |
| tarea | tarea | @relation(fields: [id_tarea], references: [tarea_tarea_id], onDelete: Restrict, onUpdate: NoAction) |
| empleado_planificado | empleado? | @relation(fields: [id_empleado_planificado], references: [id_empleado], onDelete: Restrict, onUpdate: NoAction) |
| etapa_adicional | etapa_adicional_orden_trabajo? | @relation(fields: [id_etapa_adicional_ot], references: [id_etapa_adicional_ot], onDelete: Restrict, onUpdate: NoAction) |
| tarea_origen_correctiva | tarea_ejecutable_unidad_ot? | @relation("tarea_correctiva_origen", fields: [id_tarea_origen_correctiva], references: [id_tarea_ejecutable_ot], onDelete: Restrict, onUpdate: NoAction) |
| tareas_correctivas | tarea_ejecutable_unidad_ot[] | @relation("tarea_correctiva_origen") |
| estado_operacional | estado_tarea_produccion_ot? |  |
| historial_produccion | historial_cambio_produccion_ot[] |  |
### Indices y restricciones declarativas
- `@@unique([id_unidad_fisica_ot, id_version_rectificacion, id_tarea_planificacion])`
- `@@index([id_unidad_fisica_ot, orden_etapa, orden_tarea])`
- `@@schema("finanzas")`
## `finanzas.estado_tarea_produccion_ot` (`estado_tarea_produccion_ot`)
Definido en `Controladores/prisma/schema.prisma:4162`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_estado_tarea_produccion | BigInt | @id @default(autoincrement()) |
| id_tarea_ejecutable_ot | BigInt | @unique |
| id_area_trabajo | BigInt |  |
| id_empleado_responsable | Int? |  |
| estado | String | @default("PENDIENTE") @db.VarChar(30) |
| prioridad | String? | @db.VarChar(30) |
| tiempo_estimado_min | Int? |  |
| instrucciones | String? |  |
| observaciones | String? |  |
| fecha_planificada | DateTime? | @db.Date |
| revision | Int | @default(1) |
| actualizado_por | BigInt |  |
| actualizado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| tarea_ejecutable | tarea_ejecutable_unidad_ot | @relation(fields: [id_tarea_ejecutable_ot], references: [id_tarea_ejecutable_ot], onDelete: Restrict, onUpdate: NoAction) |
| area | area_trabajo | @relation(fields: [id_area_trabajo], references: [area_trabajo_id_area], onDelete: Restrict, onUpdate: NoAction) |
| empleado_responsable | empleado? | @relation(fields: [id_empleado_responsable], references: [id_empleado], onDelete: Restrict, onUpdate: NoAction) |
| actualizador | usuario | @relation("estado_tarea_produccion_actualizador", fields: [actualizado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
### Indices y restricciones declarativas
- `@@index([id_area_trabajo, estado])`
- `@@index([id_empleado_responsable, estado])`
- `@@schema("finanzas")`
## `finanzas.historial_cambio_produccion_ot` (`historial_cambio_produccion_ot`)
Definido en `Controladores/prisma/schema.prisma:4187`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_historial_cambio | BigInt | @id @default(autoincrement()) |
| id_unidad_fisica_ot | BigInt |  |
| id_tarea_ejecutable_ot | BigInt? |  |
| id_version_rectificacion | BigInt? |  |
| entidad | String | @db.VarChar(40) |
| evento | String | @db.VarChar(60) |
| valor_anterior | Json? |  |
| valor_nuevo | Json? |  |
| motivo | String |  |
| id_empleado_involucrado | Int? |  |
| usuario_id_usuario | BigInt |  |
| fecha_evento | DateTime | @default(now()) @db.Timestamptz(6) |
| unidad | unidad_fisica_orden_trabajo | @relation(fields: [id_unidad_fisica_ot], references: [id_unidad_fisica_ot], onDelete: Restrict, onUpdate: NoAction) |
| tarea_ejecutable | tarea_ejecutable_unidad_ot? | @relation(fields: [id_tarea_ejecutable_ot], references: [id_tarea_ejecutable_ot], onDelete: Restrict, onUpdate: NoAction) |
| version | version_rectificacion_orden_trabajo? | @relation(fields: [id_version_rectificacion], references: [id_version_rectificacion], onDelete: Restrict, onUpdate: NoAction) |
| empleado_involucrado | empleado? | @relation(fields: [id_empleado_involucrado], references: [id_empleado], onDelete: Restrict, onUpdate: NoAction) |
| actor | usuario | @relation("historial_produccion_actor", fields: [usuario_id_usuario], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
### Indices y restricciones declarativas
- `@@index([id_unidad_fisica_ot, fecha_evento])`
- `@@index([id_tarea_ejecutable_ot, fecha_evento])`
- `@@schema("finanzas")`
## `finanzas.etapa_adicional_orden_trabajo` (`etapa_adicional_orden_trabajo`)
Definido en `Controladores/prisma/schema.prisma:4211`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_etapa_adicional_ot | BigInt | @id @default(autoincrement()) |
| id_unidad_fisica_ot | BigInt |  |
| id_area_trabajo | BigInt |  |
| nombre | String | @db.VarChar(150) |
| descripcion | String? |  |
| orden | Int |  |
| motivo | String |  |
| clave_idempotencia | String | @unique @db.VarChar(120) |
| creado_por | BigInt |  |
| creado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| unidad | unidad_fisica_orden_trabajo | @relation(fields: [id_unidad_fisica_ot], references: [id_unidad_fisica_ot], onDelete: Restrict, onUpdate: NoAction) |
| area | area_trabajo | @relation(fields: [id_area_trabajo], references: [area_trabajo_id_area], onDelete: Restrict, onUpdate: NoAction) |
| creador | usuario | @relation("etapa_adicional_ot_creador", fields: [creado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
| tareas | tarea_ejecutable_unidad_ot[] |  |
### Indices y restricciones declarativas
- `@@unique([id_unidad_fisica_ot, orden])`
- `@@schema("finanzas")`
## `finanzas.atribucion_ejecucion_tarea_ot` (`atribucion_ejecucion_tarea_ot`)
Definido en `Controladores/prisma/schema.prisma:4232`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_atribucion_ejecucion | BigInt | @id @default(autoincrement()) |
| id_ejecucion_tarea | BigInt | @unique |
| id_empleado_ejecutor | Int |  |
| registrado_por | BigInt |  |
| registrado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| ejecucion | ejecucion_tarea | @relation(fields: [id_ejecucion_tarea], references: [id_ejecucion_tarea], onDelete: Restrict, onUpdate: NoAction) |
| empleado_ejecutor | empleado | @relation(fields: [id_empleado_ejecutor], references: [id_empleado], onDelete: Restrict, onUpdate: NoAction) |
| registrador | usuario | @relation("atribucion_ejecucion_registrador", fields: [registrado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
### Indices y restricciones declarativas
- `@@index([id_empleado_ejecutor, registrado_en])`
- `@@schema("finanzas")`
## `finanzas.solicitud_correccion_tecnica_ot` (`solicitud_correccion_tecnica_ot`)
Definido en `Controladores/prisma/schema.prisma:4246`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_solicitud_correccion | BigInt | @id @default(autoincrement()) |
| id_unidad_fisica_ot | BigInt |  |
| id_version_base | BigInt |  |
| medida_original | Json |  |
| medida_propuesta | Json |  |
| motivo | String |  |
| solicitado_por | BigInt |  |
| solicitado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| unidad | unidad_fisica_orden_trabajo | @relation(fields: [id_unidad_fisica_ot], references: [id_unidad_fisica_ot], onDelete: Restrict, onUpdate: NoAction) |
| version_base | version_rectificacion_orden_trabajo | @relation("solicitud_correccion_version_base", fields: [id_version_base], references: [id_version_rectificacion], onDelete: Restrict, onUpdate: NoAction) |
| solicitante | usuario | @relation("solicitud_correccion_actor", fields: [solicitado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
### Indices y restricciones declarativas
- `@@index([id_unidad_fisica_ot, solicitado_en])`
- `@@schema("finanzas")`
## `finanzas.aplicacion_revision_tecnica_ot` (`aplicacion_revision_tecnica_ot`)
Definido en `Controladores/prisma/schema.prisma:4263`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_aplicacion_revision | BigInt | @id @default(autoincrement()) |
| id_unidad_fisica_ot | BigInt |  |
| id_version_rectificacion | BigInt | @unique |
| aplicado_por | BigInt |  |
| aplicado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| unidad | unidad_fisica_orden_trabajo | @relation(fields: [id_unidad_fisica_ot], references: [id_unidad_fisica_ot], onDelete: Restrict, onUpdate: NoAction) |
| version | version_rectificacion_orden_trabajo | @relation(fields: [id_version_rectificacion], references: [id_version_rectificacion], onDelete: Restrict, onUpdate: NoAction) |
| actor | usuario | @relation("aplicacion_revision_actor", fields: [aplicado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
### Indices y restricciones declarativas
- `@@unique([id_unidad_fisica_ot, id_version_rectificacion])`
- `@@schema("finanzas")`
## `finanzas.cierre_orden_trabajo_produccion` (`cierre_orden_trabajo_produccion`)
Definido en `Controladores/prisma/schema.prisma:4277`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_cierre_ot | BigInt | @id @default(autoincrement()) |
| id_unidad_fisica_ot | BigInt | @unique |
| id_version_rectificacion | BigInt |  |
| resumen_tareas | Json |  |
| observaciones | String? |  |
| estado_anterior | String | @db.VarChar(40) |
| estado_final | String | @db.VarChar(40) |
| finalizado_por | BigInt |  |
| finalizado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| unidad | unidad_fisica_orden_trabajo | @relation(fields: [id_unidad_fisica_ot], references: [id_unidad_fisica_ot], onDelete: Restrict, onUpdate: NoAction) |
| version | version_rectificacion_orden_trabajo | @relation(fields: [id_version_rectificacion], references: [id_version_rectificacion], onDelete: Restrict, onUpdate: NoAction) |
| actor | usuario | @relation("cierre_ot_actor", fields: [finalizado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction) |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.producto_comercial_version` (`producto_comercial_version`)
Definido en `Controladores/prisma/schema.prisma:4294`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_producto_comercial_version | Int | @id @default(autoincrement()) |
| id_extension_producto_comercial | Int |  |
| numero_version | Int |  |
| codigo_comercial | String | @db.VarChar(60) |
| nombre_comercial | String | @db.VarChar(200) |
| id_familia_producto_comercial | Int |  |
| codigo_familia | String | @db.VarChar(40) |
| nombre_familia | String | @db.VarChar(150) |
| subfamilia | String? | @db.VarChar(120) |
| tipo_producto | String? | @db.VarChar(100) |
| descripcion_general | String? |  |
| descripcion_b2b | String? |  |
| descripcion_b2c | String? |  |
| observaciones | String? |  |
| garantia_referencial | String? |  |
| condiciones_particulares | String? |  |
| caracteristicas_destacadas | Json |  |
| caracteristicas_tecnicas | Json |  |
| id_item_comercial | Int? |  |
| producto_terminado_id_producto | BigInt? |  |
| vigencia_desde | DateTime | @db.Date |
| motivo | String |  |
| usuario_id_usuario | BigInt |  |
| creado_en | DateTime | @default(now()) @db.Timestamp(6) |
| producto | extension_producto_comercial | @relation(fields: [id_extension_producto_comercial], references: [id_extension_producto_comercial], onDelete: Restrict) |
| familia | familia_producto_comercial | @relation(fields: [id_familia_producto_comercial], references: [id_familia_producto_comercial], onDelete: Restrict) |
| usuario | usuario | @relation(fields: [usuario_id_usuario], references: [usuario_id_usuario], onDelete: Restrict) |
| detalles_cotizacion | detalle_cotizacion[] |  |
| alternativas_b2c | alternativa_b2c[] |  |
| productos_carta_b2c | carta_comercial_b2c_version_producto[] |  |
### Indices y restricciones declarativas
- `@@unique([id_extension_producto_comercial, numero_version])`
- `@@index([id_extension_producto_comercial, creado_en])`
- `@@schema("finanzas")`
## `finanzas.historial_producto_comercial` (`historial_producto_comercial`)
Definido en `Controladores/prisma/schema.prisma:4331`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_historial_producto_comercial | Int | @id @default(autoincrement()) |
| id_extension_producto_comercial | Int |  |
| evento | String | @db.VarChar(50) |
| valor_anterior | Json? |  |
| valor_nuevo | Json? |  |
| motivo | String? |  |
| usuario_id_usuario | BigInt |  |
| fecha_evento | DateTime | @default(now()) @db.Timestamp(6) |
| producto | extension_producto_comercial | @relation(fields: [id_extension_producto_comercial], references: [id_extension_producto_comercial], onDelete: Restrict) |
| usuario | usuario | @relation(fields: [usuario_id_usuario], references: [usuario_id_usuario], onDelete: Restrict) |
### Indices y restricciones declarativas
- `@@index([id_extension_producto_comercial, fecha_evento])`
- `@@schema("finanzas")`
## `finanzas.documento_logico` (`documento_logico`)
Definido en `Controladores/prisma/schema.prisma:4348`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_documento_logico | BigInt | @id @default(autoincrement()) |
| titulo | String | @db.VarChar(200) |
| clasificacion | String | @db.VarChar(60) |
| estado | String | @default("ACTIVO") @db.VarChar(20) |
| es_historico | Boolean | @default(false) |
| numero_version_actual | Int? |  |
| id_configuracion_conservacion | Int? |  |
| creado_por | BigInt |  |
| creado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| actualizado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| desactivado_en | DateTime? | @db.Timestamptz(6) |
| motivo_desactivacion | String? |  |
| revision | Int | @default(1) |
| configuracion_conservacion | configuracion_conservacion_documental? | @relation(fields: [id_configuracion_conservacion], references: [id_configuracion_conservacion], onDelete: Restrict, onUpdate: NoAction, map: "fk_documento_logico_conservacion") |
| creador | usuario | @relation("documento_logico_creador", fields: [creado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction, map: "fk_documento_logico_creador") |
| versiones | version_documento[] |  |
| intenciones_carga | intencion_carga_documental[] |  |
| asociaciones_producto | producto_comercial_documento[] |  |
| eventos_operacionales | evento_operacional_documental[] |  |
| versiones_cotizacion | cotizacion_version[] |  |
| versiones_carta_b2c | carta_comercial_b2c_version[] |  |
### Indices y restricciones declarativas
- `@@index([clasificacion, estado, creado_en], map: "idx_documento_logico_clasificacion_estado")`
- `@@index([id_configuracion_conservacion], map: "idx_documento_logico_conservacion")`
- `@@schema("finanzas")`
## `finanzas.version_documento` (`version_documento`)
Definido en `Controladores/prisma/schema.prisma:4377`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_version_documento | BigInt | @id @default(autoincrement()) |
| id_documento_logico | BigInt |  |
| numero_version | Int |  |
| proveedor_logico | String | @db.VarChar(20) |
| contenedor_logico | String | @db.VarChar(80) |
| clave_objeto | String | @db.VarChar(700) |
| version_proveedor | String? | @db.VarChar(300) |
| nombre_original | String | @db.VarChar(255) |
| nombre_seguro | String | @db.VarChar(255) |
| mime_declarado | String | @db.VarChar(150) |
| mime_detectado | String? | @db.VarChar(150) |
| tamano_bytes | BigInt |  |
| sha256 | String? | @db.Char(64) |
| estado | String | @default("PENDIENTE") @db.VarChar(20) |
| creado_por | BigInt |  |
| creado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| validado_en | DateTime? | @db.Timestamptz(6) |
| id_version_reemplazada | BigInt? | @unique |
| resultado_validaciones | Json? |  |
| revision | Int | @default(1) |
| documento | documento_logico | @relation(fields: [id_documento_logico], references: [id_documento_logico], onDelete: Restrict, onUpdate: NoAction, map: "fk_version_documento_logico") |
| creador | usuario | @relation("version_documento_creador", fields: [creado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction, map: "fk_version_documento_creador") |
| version_reemplazada | version_documento? | @relation("version_documento_reemplazo", fields: [id_version_reemplazada], references: [id_version_documento], onDelete: Restrict, onUpdate: NoAction, map: "fk_version_documento_reemplazada") |
| reemplazo | version_documento? | @relation("version_documento_reemplazo") |
| variantes_origen | variante_documento[] | @relation("variante_documento_original") |
| variante_derivada | variante_documento? | @relation("variante_documento_derivada") |
| eventos_operacionales | evento_operacional_documental[] |  |
| fotografias_carta_b2c | carta_comercial_b2c_version_fotografia[] |  |
### Indices y restricciones declarativas
- `@@unique([id_documento_logico, numero_version], map: "uq_version_documento_numero")`
- `@@unique([proveedor_logico, contenedor_logico, clave_objeto], map: "uq_version_documento_objeto")`
- `@@index([id_documento_logico, estado, creado_en], map: "idx_version_documento_historial")`
- `@@index([sha256], map: "idx_version_documento_sha256")`
- `@@schema("finanzas")`
## `finanzas.variante_documento` (`variante_documento`)
Definido en `Controladores/prisma/schema.prisma:4414`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_variante_documento | BigInt | @id @default(autoincrement()) |
| id_version_original | BigInt |  |
| id_version_derivada | BigInt | @unique |
| tipo_variante | String | @db.VarChar(30) |
| parametros_tecnicos | Json? |  |
| creado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| version_original | version_documento | @relation("variante_documento_original", fields: [id_version_original], references: [id_version_documento], onDelete: Restrict, onUpdate: NoAction, map: "fk_variante_documento_original") |
| version_derivada | version_documento | @relation("variante_documento_derivada", fields: [id_version_derivada], references: [id_version_documento], onDelete: Restrict, onUpdate: NoAction, map: "fk_variante_documento_derivada") |
### Indices y restricciones declarativas
- `@@unique([id_version_original, tipo_variante], map: "uq_variante_documento_tipo")`
- `@@schema("finanzas")`
## `finanzas.intencion_carga_documental` (`intencion_carga_documental`)
Definido en `Controladores/prisma/schema.prisma:4428`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_intencion_carga | BigInt | @id @default(autoincrement()) |
| id_publico | String | @unique @default(dbgenerated("gen_random_uuid()")) @db.Uuid |
| id_documento_logico | BigInt? |  |
| usuario_solicitante | BigInt |  |
| clasificacion | String | @db.VarChar(60) |
| nombre_declarado | String | @db.VarChar(255) |
| mime_declarado | String | @db.VarChar(150) |
| tamano_esperado | BigInt |  |
| clave_temporal | String | @unique @db.VarChar(700) |
| clave_idempotencia | String | @db.VarChar(160) |
| estado | String | @default("PENDIENTE") @db.VarChar(20) |
| creado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| expira_en | DateTime | @db.Timestamptz(6) |
| confirmado_en | DateTime? | @db.Timestamptz(6) |
| identificador_multipart | String? | @db.VarChar(500) |
| cantidad_reintentos | Int | @default(0) |
| codigo_error | String? | @db.VarChar(100) |
| revision | Int | @default(1) |
| solicitante | usuario | @relation("intencion_documental_solicitante", fields: [usuario_solicitante], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction, map: "fk_intencion_documental_solicitante") |
| documento | documento_logico? | @relation(fields: [id_documento_logico], references: [id_documento_logico], onDelete: Restrict, onUpdate: NoAction, map: "fk_intencion_documental_documento") |
### Indices y restricciones declarativas
- `@@unique([usuario_solicitante, clave_idempotencia], map: "uq_intencion_documental_idempotencia")`
- `@@index([estado, expira_en], map: "idx_intencion_documental_estado_expira")`
- `@@index([id_documento_logico, estado], map: "idx_intencion_documental_documento_estado")`
- `@@schema("finanzas")`
## `finanzas.producto_comercial_documento` (`producto_comercial_documento`)
Definido en `Controladores/prisma/schema.prisma:4456`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_producto_comercial_documento | BigInt | @id @default(autoincrement()) |
| id_extension_producto_comercial | Int |  |
| id_documento_logico | BigInt |  |
| tipo_documento | String | @db.VarChar(40) |
| orden_presentacion | Int | @default(0) |
| es_imagen_principal | Boolean | @default(false) |
| habilitado_b2b | Boolean | @default(false) |
| habilitado_b2c | Boolean | @default(false) |
| estado | String | @default("ACTIVO") @db.VarChar(20) |
| asociado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| usuario_responsable | BigInt |  |
| revision | Int | @default(1) |
| producto | extension_producto_comercial | @relation(fields: [id_extension_producto_comercial], references: [id_extension_producto_comercial], onDelete: Restrict, onUpdate: NoAction, map: "fk_producto_documento_producto") |
| documento | documento_logico | @relation(fields: [id_documento_logico], references: [id_documento_logico], onDelete: Restrict, onUpdate: NoAction, map: "fk_producto_documento_documento") |
| responsable | usuario | @relation("producto_documento_responsable", fields: [usuario_responsable], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction, map: "fk_producto_documento_responsable") |
| fotografias_carta_b2c | carta_comercial_b2c_version_fotografia[] |  |
### Indices y restricciones declarativas
- `@@unique([id_extension_producto_comercial, id_documento_logico, tipo_documento], map: "uq_producto_documento_asociacion")`
- `@@index([id_extension_producto_comercial, estado, orden_presentacion], map: "idx_producto_documento_presentacion")`
- `@@index([id_documento_logico], map: "idx_producto_documento_documento")`
- `@@schema("finanzas")`
## `finanzas.evento_operacional_documental` (`evento_operacional_documental`)
Definido en `Controladores/prisma/schema.prisma:4481`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_evento_operacional | BigInt | @id @default(autoincrement()) |
| tipo_evento | String | @db.VarChar(80) |
| id_documento_logico | BigInt? |  |
| id_version_documento | BigInt? |  |
| estado | String | @default("PENDIENTE") @db.VarChar(20) |
| creado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| procesado_en | DateTime? | @db.Timestamptz(6) |
| cantidad_intentos | Int | @default(0) |
| proximo_intento_en | DateTime? | @db.Timestamptz(6) |
| lease_token | String? | @db.Uuid |
| lease_hasta | DateTime? | @db.Timestamptz(6) |
| codigo_error | String? | @db.VarChar(100) |
| clave_idempotencia | String | @unique @db.VarChar(180) |
| payload_tecnico | Json? |  |
| documento | documento_logico? | @relation(fields: [id_documento_logico], references: [id_documento_logico], onDelete: Restrict, onUpdate: NoAction, map: "fk_evento_documental_documento") |
| version | version_documento? | @relation(fields: [id_version_documento], references: [id_version_documento], onDelete: Restrict, onUpdate: NoAction, map: "fk_evento_documental_version") |
### Indices y restricciones declarativas
- `@@index([estado, proximo_intento_en, creado_en], map: "idx_evento_documental_pendiente")`
- `@@index([estado, lease_hasta], map: "idx_evento_documental_lease")`
- `@@index([id_documento_logico, creado_en], map: "idx_evento_documental_documento")`
- `@@schema("finanzas")`
## `finanzas.cotizacion_version` (`cotizacion_version`)
Definido en `Controladores/prisma/schema.prisma:4506`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_cotizacion_version | Int | @id @default(autoincrement()) |
| id_cotizacion | Int |  |
| fecha | DateTime | @default(now()) |
| antecedentes | Json |  |
| motivo | String |  |
| numero_version_comercial | Int? |  |
| tipo_version | String? | @db.VarChar(30) |
| snapshot_comercial | Json? |  |
| id_documento_logico | BigInt? | @unique(map: "uq_cotizacion_version_documento") |
| estado_documental | String? | @db.VarChar(30) |
| usuario_id_usuario | BigInt? |  |
| clave_idempotencia | String? | @unique(map: "uq_cotizacion_version_idempotencia") @db.VarChar(160) |
| cotizacion | cotizacion | @relation(fields: [id_cotizacion], references: [id_cotizacion], onDelete: Restrict) |
| documento | documento_logico? | @relation(fields: [id_documento_logico], references: [id_documento_logico], onDelete: Restrict, onUpdate: NoAction, map: "fk_cotizacion_version_documento") |
| actor | usuario? | @relation("cotizacion_version_actor", fields: [usuario_id_usuario], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction, map: "fk_cotizacion_version_actor") |
### Indices y restricciones declarativas
- `@@unique([id_cotizacion, numero_version_comercial], map: "uq_cotizacion_version_comercial")`
- `@@index([id_cotizacion, fecha], map: "idx_cotizacion_version_fecha")`
- `@@index([estado_documental], map: "idx_cotizacion_version_estado_documental")`
- `@@schema("finanzas")`
## `finanzas.precio_producto_comercial` (`precio_producto_comercial`)
Definido en `Controladores/prisma/schema.prisma:4530`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_precio_producto_comercial | BigInt | @id @default(autoincrement()) |
| id_extension_producto_comercial | Int |  |
| segmento_comercial | String | @db.VarChar(3) |
| id_moneda | Int |  |
| monto | Decimal | @db.Decimal(14, 2) |
| vigencia_desde | DateTime | @db.Date |
| vigencia_hasta | DateTime? | @db.Date |
| estado | String | @default("ACTIVO") @db.VarChar(20) |
| motivo | String? |  |
| revision | Int | @default(1) |
| creado_por | BigInt |  |
| creado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| actualizado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| producto | extension_producto_comercial | @relation(fields: [id_extension_producto_comercial], references: [id_extension_producto_comercial], onDelete: Restrict, onUpdate: NoAction, map: "fk_precio_producto_comercial_producto") |
| moneda | moneda | @relation(fields: [id_moneda], references: [id_moneda], onDelete: Restrict, onUpdate: NoAction, map: "fk_precio_producto_comercial_moneda") |
| creador | usuario | @relation("precio_producto_creador", fields: [creado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction, map: "fk_precio_producto_comercial_creador") |
| detalles_cotizacion | detalle_cotizacion[] |  |
| alternativas_b2c | alternativa_b2c[] |  |
| publicaciones_carta | carta_comercial_b2c_version_producto[] |  |
### Indices y restricciones declarativas
- `@@unique([id_extension_producto_comercial, segmento_comercial, id_moneda, vigencia_desde], map: "uq_precio_producto_inicio")`
- `@@index([id_extension_producto_comercial, segmento_comercial, estado, vigencia_desde, vigencia_hasta], map: "idx_precio_producto_vigencia")`
- `@@schema("finanzas")`
## `finanzas.opcional_comercial` (`opcional_comercial`)
Definido en `Controladores/prisma/schema.prisma:4556`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_opcional_comercial | BigInt | @id @default(autoincrement()) |
| codigo | String | @unique @db.VarChar(60) |
| nombre | String | @db.VarChar(200) |
| descripcion_b2b | String? |  |
| descripcion_b2c | String? |  |
| estado | String | @default("ACTIVO") @db.VarChar(20) |
| revision | Int | @default(1) |
| creado_por | BigInt |  |
| creado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| actualizado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| creador | usuario | @relation("opcional_comercial_creador", fields: [creado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction, map: "fk_opcional_comercial_creador") |
| compatibilidades | compatibilidad_opcional_producto[] |  |
| precios | precio_opcional_comercial[] |  |
### Indices y restricciones declarativas
- `@@index([estado, nombre], map: "idx_opcional_comercial_estado")`
- `@@schema("finanzas")`
## `finanzas.compatibilidad_opcional_producto` (`compatibilidad_opcional_producto`)
Definido en `Controladores/prisma/schema.prisma:4575`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_compatibilidad_opcional | BigInt | @id @default(autoincrement()) |
| id_extension_producto_comercial | Int |  |
| id_opcional_comercial | BigInt |  |
| habilitado_b2b | Boolean | @default(false) |
| habilitado_b2c | Boolean | @default(false) |
| condiciones_compatibilidad | String? |  |
| estado | String | @default("ACTIVA") @db.VarChar(20) |
| revision | Int | @default(1) |
| producto | extension_producto_comercial | @relation(fields: [id_extension_producto_comercial], references: [id_extension_producto_comercial], onDelete: Restrict, onUpdate: NoAction, map: "fk_compatibilidad_opcional_producto") |
| opcional | opcional_comercial | @relation(fields: [id_opcional_comercial], references: [id_opcional_comercial], onDelete: Restrict, onUpdate: NoAction, map: "fk_compatibilidad_opcional_catalogo") |
| alternativas | alternativa_b2c_opcional[] |  |
### Indices y restricciones declarativas
- `@@unique([id_extension_producto_comercial, id_opcional_comercial], map: "uq_compatibilidad_opcional_producto")`
- `@@index([id_extension_producto_comercial, estado], map: "idx_compatibilidad_opcional_estado")`
- `@@schema("finanzas")`
## `finanzas.precio_opcional_comercial` (`precio_opcional_comercial`)
Definido en `Controladores/prisma/schema.prisma:4593`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_precio_opcional_comercial | BigInt | @id @default(autoincrement()) |
| id_opcional_comercial | BigInt |  |
| segmento_comercial | String | @db.VarChar(3) |
| id_moneda | Int |  |
| monto | Decimal | @db.Decimal(14, 2) |
| vigencia_desde | DateTime | @db.Date |
| vigencia_hasta | DateTime? | @db.Date |
| estado | String | @default("ACTIVO") @db.VarChar(20) |
| motivo | String? |  |
| revision | Int | @default(1) |
| creado_por | BigInt |  |
| creado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| actualizado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| opcional | opcional_comercial | @relation(fields: [id_opcional_comercial], references: [id_opcional_comercial], onDelete: Restrict, onUpdate: NoAction, map: "fk_precio_opcional_catalogo") |
| moneda | moneda | @relation(fields: [id_moneda], references: [id_moneda], onDelete: Restrict, onUpdate: NoAction, map: "fk_precio_opcional_moneda") |
| creador | usuario | @relation("precio_opcional_creador", fields: [creado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction, map: "fk_precio_opcional_creador") |
| alternativas | alternativa_b2c_opcional[] |  |
### Indices y restricciones declarativas
- `@@unique([id_opcional_comercial, segmento_comercial, id_moneda, vigencia_desde], map: "uq_precio_opcional_inicio")`
- `@@index([id_opcional_comercial, segmento_comercial, estado, vigencia_desde, vigencia_hasta], map: "idx_precio_opcional_vigencia")`
- `@@schema("finanzas")`
## `finanzas.tarifa_instalacion_comercial` (`tarifa_instalacion_comercial`)
Definido en `Controladores/prisma/schema.prisma:4618`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_tarifa_instalacion_comercial | BigInt | @id @default(autoincrement()) |
| alcance_geografico | String | @db.VarChar(20) |
| region | String | @db.VarChar(120) |
| region_normalizada | String | @db.VarChar(120) |
| ciudad | String? | @db.VarChar(120) |
| comuna | String? | @db.VarChar(120) |
| comuna_normalizada | String? | @db.VarChar(120) |
| estado_cobertura | String | @db.VarChar(30) |
| id_moneda | Int? |  |
| precio_comercial | Decimal? | @db.Decimal(14, 2) |
| vigencia_desde | DateTime | @db.Date |
| vigencia_hasta | DateTime? | @db.Date |
| condiciones | String? |  |
| observaciones | String? |  |
| estado | String | @default("ACTIVA") @db.VarChar(20) |
| revision | Int | @default(1) |
| creado_por | BigInt |  |
| creado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| actualizado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| moneda | moneda? | @relation(fields: [id_moneda], references: [id_moneda], onDelete: Restrict, onUpdate: NoAction, map: "fk_tarifa_instalacion_moneda") |
| creador | usuario | @relation("tarifa_instalacion_creador", fields: [creado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction, map: "fk_tarifa_instalacion_creador") |
| cotizaciones | cotizacion[] |  |
| alternativas | alternativa_b2c[] |  |
### Indices y restricciones declarativas
- `@@unique([alcance_geografico, region_normalizada, comuna_normalizada, vigencia_desde], map: "uq_tarifa_instalacion_inicio")`
- `@@index([region_normalizada, comuna_normalizada, estado, vigencia_desde, vigencia_hasta], map: "idx_tarifa_instalacion_busqueda")`
- `@@schema("finanzas")`
## `finanzas.condicion_comercial` (`condicion_comercial`)
Definido en `Controladores/prisma/schema.prisma:4648`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_condicion_comercial | BigInt | @id @default(autoincrement()) |
| codigo | String | @unique @db.VarChar(60) |
| nombre | String | @db.VarChar(200) |
| segmento | String | @db.VarChar(20) |
| estado | String | @default("ACTIVA") @db.VarChar(20) |
| revision | Int | @default(1) |
| creado_por | BigInt |  |
| creado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| actualizado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| creador | usuario | @relation("condicion_comercial_creador", fields: [creado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction, map: "fk_condicion_comercial_creador") |
| versiones | condicion_comercial_version[] |  |
### Indices y restricciones declarativas
- `@@index([segmento, estado], map: "idx_condicion_comercial_segmento")`
- `@@schema("finanzas")`
## `finanzas.condicion_comercial_version` (`condicion_comercial_version`)
Definido en `Controladores/prisma/schema.prisma:4665`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_condicion_comercial_version | BigInt | @id @default(autoincrement()) |
| id_condicion_comercial | BigInt |  |
| numero_version | Int |  |
| contenido | Json |  |
| vigencia_desde | DateTime | @db.Date |
| vigencia_hasta | DateTime? | @db.Date |
| estado | String | @default("BORRADOR") @db.VarChar(20) |
| motivo | String |  |
| publicado_por | BigInt? |  |
| publicado_en | DateTime? | @db.Timestamptz(6) |
| condicion | condicion_comercial | @relation(fields: [id_condicion_comercial], references: [id_condicion_comercial], onDelete: Restrict, onUpdate: NoAction, map: "fk_condicion_version_raiz") |
| publicador | usuario? | @relation("condicion_comercial_publicador", fields: [publicado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction, map: "fk_condicion_version_publicador") |
| cotizaciones | cotizacion[] |  |
| alternativas | alternativa_b2c[] |  |
| versiones_plantilla | plantilla_documental_version[] |  |
| versiones_carta | carta_comercial_b2c_version[] |  |
### Indices y restricciones declarativas
- `@@unique([id_condicion_comercial, numero_version], map: "uq_condicion_comercial_version")`
- `@@index([id_condicion_comercial, estado, vigencia_desde, vigencia_hasta], map: "idx_condicion_version_vigencia")`
- `@@schema("finanzas")`
## `finanzas.idempotencia_operacion_comercial` (`idempotencia_operacion_comercial`)
Definido en `Controladores/prisma/schema.prisma:4688`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| clave | String | @id @db.VarChar(160) |
| operacion | String | @db.VarChar(80) |
| actor_id | BigInt |  |
| respuesta | Json? |  |
| creado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| completado_en | DateTime? | @db.Timestamptz(6) |
| actor | usuario | @relation(fields: [actor_id], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction, map: "fk_idempotencia_operacion_actor") |
### Indices y restricciones declarativas
- `@@index([actor_id, creado_en], map: "idx_idempotencia_operacion_actor")`
- `@@schema("finanzas")`
## `finanzas.plantilla_documental_comercial` (`plantilla_documental_comercial`)
Definido en `Controladores/prisma/schema.prisma:4701`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_plantilla_documental | BigInt | @id @default(autoincrement()) |
| codigo | String | @unique @db.VarChar(60) |
| nombre | String | @db.VarChar(200) |
| tipo_documento | String | @db.VarChar(30) |
| segmento | String | @db.VarChar(20) |
| estado | String | @default("ACTIVA") @db.VarChar(20) |
| revision | Int | @default(1) |
| creado_por | BigInt |  |
| creado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| actualizado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| creador | usuario | @relation("plantilla_documental_creador", fields: [creado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction, map: "fk_plantilla_documental_creador") |
| versiones | plantilla_documental_version[] |  |
### Indices y restricciones declarativas
- `@@index([tipo_documento, segmento, estado], map: "idx_plantilla_documental_tipo")`
- `@@schema("finanzas")`
## `finanzas.plantilla_documental_version` (`plantilla_documental_version`)
Definido en `Controladores/prisma/schema.prisma:4719`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_plantilla_documental_version | BigInt | @id @default(autoincrement()) |
| id_plantilla_documental | BigInt |  |
| numero_version | Int |  |
| esquema_contenido | Json |  |
| id_condicion_comercial_version | BigInt? |  |
| estado | String | @default("BORRADOR") @db.VarChar(20) |
| motivo | String |  |
| publicado_por | BigInt? |  |
| publicado_en | DateTime? | @db.Timestamptz(6) |
| plantilla | plantilla_documental_comercial | @relation(fields: [id_plantilla_documental], references: [id_plantilla_documental], onDelete: Restrict, onUpdate: NoAction, map: "fk_plantilla_documental_version_raiz") |
| condicion | condicion_comercial_version? | @relation(fields: [id_condicion_comercial_version], references: [id_condicion_comercial_version], onDelete: Restrict, onUpdate: NoAction, map: "fk_plantilla_documental_condicion") |
| publicador | usuario? | @relation("plantilla_documental_publicador", fields: [publicado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction, map: "fk_plantilla_documental_publicador") |
| cartas_b2c | carta_comercial_b2c_version[] |  |
### Indices y restricciones declarativas
- `@@unique([id_plantilla_documental, numero_version], map: "uq_plantilla_documental_version")`
- `@@index([id_plantilla_documental, estado], map: "idx_plantilla_documental_version_estado")`
- `@@schema("finanzas")`
## `finanzas.carta_comercial_b2c` (`carta_comercial_b2c`)
Definido en `Controladores/prisma/schema.prisma:4739`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_carta_comercial_b2c | BigInt | @id @default(autoincrement()) |
| codigo | String | @unique @db.VarChar(60) |
| titulo | String | @db.VarChar(200) |
| contenido_borrador | Json |  |
| estado | String | @default("BORRADOR") @db.VarChar(20) |
| revision | Int | @default(1) |
| creado_por | BigInt |  |
| creado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| actualizado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| creador | usuario | @relation("carta_b2c_creador", fields: [creado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction, map: "fk_carta_b2c_creador") |
| versiones | carta_comercial_b2c_version[] |  |
### Indices y restricciones declarativas
- `@@index([estado, actualizado_en], map: "idx_carta_b2c_estado")`
- `@@schema("finanzas")`
## `finanzas.carta_comercial_b2c_version` (`carta_comercial_b2c_version`)
Definido en `Controladores/prisma/schema.prisma:4756`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_carta_comercial_b2c_version | BigInt | @id @default(autoincrement()) |
| id_carta_comercial_b2c | BigInt |  |
| numero_version | Int |  |
| id_plantilla_documental_version | BigInt |  |
| id_condicion_comercial_version | BigInt? |  |
| snapshot_publicacion | Json |  |
| id_documento_logico | BigInt? | @unique(map: "uq_carta_b2c_version_documento") |
| estado_documental | String | @default("PENDIENTE_DOCUMENTO") @db.VarChar(30) |
| clave_idempotencia | String | @unique @db.VarChar(160) |
| motivo | String |  |
| publicado_por | BigInt |  |
| creado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| confirmado_en | DateTime? | @db.Timestamptz(6) |
| carta | carta_comercial_b2c | @relation(fields: [id_carta_comercial_b2c], references: [id_carta_comercial_b2c], onDelete: Restrict, onUpdate: NoAction, map: "fk_carta_b2c_version_raiz") |
| plantilla | plantilla_documental_version | @relation(fields: [id_plantilla_documental_version], references: [id_plantilla_documental_version], onDelete: Restrict, onUpdate: NoAction, map: "fk_carta_b2c_version_plantilla") |
| condicion | condicion_comercial_version? | @relation(fields: [id_condicion_comercial_version], references: [id_condicion_comercial_version], onDelete: Restrict, onUpdate: NoAction, map: "fk_carta_b2c_version_condicion") |
| documento | documento_logico? | @relation(fields: [id_documento_logico], references: [id_documento_logico], onDelete: Restrict, onUpdate: NoAction, map: "fk_carta_b2c_version_documento") |
| publicador | usuario | @relation("carta_b2c_publicador", fields: [publicado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction, map: "fk_carta_b2c_version_publicador") |
| productos | carta_comercial_b2c_version_producto[] |  |
| fotografias | carta_comercial_b2c_version_fotografia[] |  |
### Indices y restricciones declarativas
- `@@unique([id_carta_comercial_b2c, numero_version], map: "uq_carta_b2c_version")`
- `@@index([id_carta_comercial_b2c, estado_documental], map: "idx_carta_b2c_version_estado")`
- `@@schema("finanzas")`
## `finanzas.carta_comercial_b2c_version_producto` (`carta_comercial_b2c_version_producto`)
Definido en `Controladores/prisma/schema.prisma:4783`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_carta_version_producto | BigInt | @id @default(autoincrement()) |
| id_carta_comercial_b2c_version | BigInt |  |
| id_producto_comercial_version | Int |  |
| id_precio_producto_comercial | BigInt |  |
| orden_presentacion | Int |  |
| snapshot_producto | Json |  |
| carta_version | carta_comercial_b2c_version | @relation(fields: [id_carta_comercial_b2c_version], references: [id_carta_comercial_b2c_version], onDelete: Restrict, onUpdate: NoAction, map: "fk_carta_b2c_producto_version_carta") |
| producto_version | producto_comercial_version | @relation(fields: [id_producto_comercial_version], references: [id_producto_comercial_version], onDelete: Restrict, onUpdate: NoAction, map: "fk_carta_b2c_producto_version_producto") |
| precio | precio_producto_comercial | @relation(fields: [id_precio_producto_comercial], references: [id_precio_producto_comercial], onDelete: Restrict, onUpdate: NoAction, map: "fk_carta_b2c_producto_version_precio") |
### Indices y restricciones declarativas
- `@@unique([id_carta_comercial_b2c_version, id_producto_comercial_version], map: "uq_carta_b2c_version_producto")`
- `@@unique([id_carta_comercial_b2c_version, orden_presentacion], map: "uq_carta_b2c_version_orden")`
- `@@schema("finanzas")`
## `finanzas.carta_comercial_b2c_version_fotografia` (`carta_comercial_b2c_version_fotografia`)
Definido en `Controladores/prisma/schema.prisma:4799`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_carta_version_fotografia | BigInt | @id @default(autoincrement()) |
| id_carta_comercial_b2c_version | BigInt |  |
| id_producto_comercial_documento | BigInt |  |
| id_version_documento | BigInt |  |
| orden_presentacion | Int |  |
| carta_version | carta_comercial_b2c_version | @relation(fields: [id_carta_comercial_b2c_version], references: [id_carta_comercial_b2c_version], onDelete: Restrict, onUpdate: NoAction, map: "fk_carta_b2c_fotografia_version_carta") |
| asociacion_producto | producto_comercial_documento | @relation(fields: [id_producto_comercial_documento], references: [id_producto_comercial_documento], onDelete: Restrict, onUpdate: NoAction, map: "fk_carta_b2c_fotografia_asociacion") |
| version_documento | version_documento | @relation(fields: [id_version_documento], references: [id_version_documento], onDelete: Restrict, onUpdate: NoAction, map: "fk_carta_b2c_fotografia_documento") |
### Indices y restricciones declarativas
- `@@unique([id_carta_comercial_b2c_version, id_producto_comercial_documento, id_version_documento], map: "uq_carta_b2c_version_fotografia")`
- `@@index([id_carta_comercial_b2c_version, orden_presentacion], map: "idx_carta_b2c_fotografia_orden")`
- `@@schema("finanzas")`
## `finanzas.contacto_cotizacion_b2b` (`contacto_cotizacion_b2b`)
Definido en `Controladores/prisma/schema.prisma:4815`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_contacto_cotizacion_b2b | BigInt | @id @default(autoincrement()) |
| id_cotizacion | Int |  |
| nombre | String | @db.VarChar(120) |
| apellido | String? | @db.VarChar(120) |
| cargo | String? | @db.VarChar(120) |
| empresa_relacionada | String? | @db.VarChar(200) |
| correo | String? | @db.VarChar(254) |
| telefono | String? | @db.VarChar(40) |
| tipo_contacto | String | @default("COMERCIAL") @db.VarChar(30) |
| es_principal | Boolean | @default(false) |
| observaciones | String? |  |
| estado | String | @default("ACTIVO") @db.VarChar(20) |
| revision | Int | @default(1) |
| creado_por | BigInt |  |
| creado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| actualizado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| cotizacion | cotizacion | @relation(fields: [id_cotizacion], references: [id_cotizacion], onDelete: Restrict, onUpdate: NoAction, map: "fk_contacto_cotizacion_b2b_cotizacion") |
| actor | usuario | @relation("contacto_cotizacion_b2b_actor", fields: [creado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction, map: "fk_contacto_cotizacion_b2b_actor") |
### Indices y restricciones declarativas
- `@@index([id_cotizacion, estado], map: "idx_contacto_cotizacion_b2b_estado")`
- `@@schema("finanzas")`
## `finanzas.servicio_comercial` (`servicio_comercial`)
Definido en `Controladores/prisma/schema.prisma:4840`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_servicio_comercial | BigInt | @id @default(autoincrement()) |
| codigo | String | @unique @db.VarChar(50) |
| nombre | String | @db.VarChar(160) |
| descripcion | String? |  |
| unidad_cobro | String | @db.VarChar(40) |
| habilitado_b2b | Boolean | @default(true) |
| habilitado_b2c | Boolean | @default(false) |
| estado | String | @default("ACTIVO") @db.VarChar(20) |
| revision | Int | @default(1) |
| creado_por | BigInt |  |
| creado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| actualizado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| actor | usuario | @relation("servicio_comercial_actor", fields: [creado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction, map: "fk_servicio_comercial_actor") |
| precios | precio_servicio_comercial[] |  |
| detalles | detalle_servicio_cotizacion[] |  |
### Indices y restricciones declarativas
- `@@index([estado, habilitado_b2b], map: "idx_servicio_comercial_b2b")`
- `@@schema("finanzas")`
## `finanzas.precio_servicio_comercial` (`precio_servicio_comercial`)
Definido en `Controladores/prisma/schema.prisma:4862`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_precio_servicio_comercial | BigInt | @id @default(autoincrement()) |
| id_servicio_comercial | BigInt |  |
| segmento_comercial | String | @db.VarChar(3) |
| id_moneda | Int |  |
| monto | Decimal | @db.Decimal(14, 2) |
| vigencia_desde | DateTime | @db.Date |
| vigencia_hasta | DateTime? | @db.Date |
| estado | String | @default("ACTIVO") @db.VarChar(20) |
| motivo | String? |  |
| revision | Int | @default(1) |
| creado_por | BigInt |  |
| creado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| actualizado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| servicio | servicio_comercial | @relation(fields: [id_servicio_comercial], references: [id_servicio_comercial], onDelete: Restrict, onUpdate: NoAction, map: "fk_precio_servicio_comercial_servicio") |
| moneda | moneda | @relation(fields: [id_moneda], references: [id_moneda], onDelete: Restrict, onUpdate: NoAction, map: "fk_precio_servicio_comercial_moneda") |
| actor | usuario | @relation("precio_servicio_comercial_actor", fields: [creado_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction, map: "fk_precio_servicio_comercial_actor") |
| detalles | detalle_servicio_cotizacion[] |  |
### Indices y restricciones declarativas
- `@@unique([id_servicio_comercial, segmento_comercial, id_moneda, vigencia_desde], map: "uq_precio_servicio_inicio")`
- `@@index([id_servicio_comercial, segmento_comercial, estado, vigencia_desde, vigencia_hasta], map: "idx_precio_servicio_vigencia")`
- `@@schema("finanzas")`
## `finanzas.detalle_servicio_cotizacion` (`detalle_servicio_cotizacion`)
Definido en `Controladores/prisma/schema.prisma:4887`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_detalle_servicio_cotizacion | BigInt | @id @default(autoincrement()) |
| id_cotizacion | Int |  |
| id_servicio_comercial | BigInt |  |
| id_precio_servicio_comercial | BigInt |  |
| tipo_linea_comercial | String | @db.VarChar(30) |
| descripcion_cotizada | String |  |
| cantidad | Decimal | @db.Decimal(12, 2) |
| unidad_cobro_cotizada | String | @db.VarChar(40) |
| precio_unitario_autorizado | Decimal | @db.Decimal(14, 2) |
| descuento_elegible | Boolean | @default(true) |
| subtotal | Decimal | @db.Decimal(14, 2) |
| snapshot_comercial | Json |  |
| revision | Int | @default(1) |
| cotizacion | cotizacion | @relation(fields: [id_cotizacion], references: [id_cotizacion], onDelete: Restrict, onUpdate: NoAction, map: "fk_detalle_servicio_cotizacion") |
| servicio | servicio_comercial | @relation(fields: [id_servicio_comercial], references: [id_servicio_comercial], onDelete: Restrict, onUpdate: NoAction, map: "fk_detalle_servicio_catalogo") |
| precio | precio_servicio_comercial | @relation(fields: [id_precio_servicio_comercial], references: [id_precio_servicio_comercial], onDelete: Restrict, onUpdate: NoAction, map: "fk_detalle_servicio_precio") |
### Indices y restricciones declarativas
- `@@index([id_cotizacion], map: "idx_detalle_servicio_cotizacion")`
- `@@index([id_servicio_comercial, id_precio_servicio_comercial], map: "idx_detalle_servicio_catalogo_precio")`
- `@@schema("finanzas")`
## `finanzas.grupo_alternativas_b2c` (`grupo_alternativas_b2c`)
Definido en `Controladores/prisma/schema.prisma:4911`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_grupo_alternativas_b2c | BigInt | @id @default(autoincrement()) |
| id_cotizacion | Int |  |
| numero_grupo | Int |  |
| titulo | String? | @db.VarChar(200) |
| estado | String | @default("ABIERTO") @db.VarChar(20) |
| revision | Int | @default(1) |
| creado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| actualizado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| id_alternativa_seleccionada | BigInt? | @unique(map: "uq_grupo_alternativa_seleccionada") |
| seleccionada_en | DateTime? | @db.Timestamptz(6) |
| seleccionada_por | BigInt? |  |
| cotizacion | cotizacion | @relation(fields: [id_cotizacion], references: [id_cotizacion], onDelete: Restrict, onUpdate: NoAction, map: "fk_grupo_alternativas_b2c_cotizacion") |
| alternativas | alternativa_b2c[] |  |
| alternativa_seleccionada | alternativa_b2c? | @relation("grupo_alternativa_seleccionada", fields: [id_alternativa_seleccionada], references: [id_alternativa_b2c], onDelete: Restrict, onUpdate: NoAction, map: "fk_grupo_alternativa_seleccionada") |
| selector | usuario? | @relation("grupo_alternativa_selector", fields: [seleccionada_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction, map: "fk_grupo_alternativa_selector") |
| historial_seleccion | historial_seleccion_alternativa_b2c[] |  |
### Indices y restricciones declarativas
- `@@unique([id_cotizacion, numero_grupo], map: "uq_grupo_alternativas_b2c_numero")`
- `@@index([id_cotizacion, estado], map: "idx_grupo_alternativas_b2c_estado")`
- `@@schema("finanzas")`
## `finanzas.historial_seleccion_alternativa_b2c` (`historial_seleccion_alternativa_b2c`)
Definido en `Controladores/prisma/schema.prisma:4934`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_historial_seleccion | BigInt | @id @default(autoincrement()) |
| id_grupo_alternativas_b2c | BigInt |  |
| id_alternativa_anterior | BigInt? |  |
| id_alternativa_nueva | BigInt? |  |
| motivo | String |  |
| actor_id | BigInt |  |
| revision_grupo | Int |  |
| fecha | DateTime | @default(now()) @db.Timestamptz(6) |
| grupo | grupo_alternativas_b2c | @relation(fields: [id_grupo_alternativas_b2c], references: [id_grupo_alternativas_b2c], onDelete: Restrict, onUpdate: NoAction, map: "fk_historial_seleccion_grupo") |
| actor | usuario | @relation("historial_seleccion_alternativa_actor", fields: [actor_id], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction, map: "fk_historial_seleccion_actor") |
### Indices y restricciones declarativas
- `@@index([id_grupo_alternativas_b2c, fecha], map: "idx_historial_seleccion_fecha")`
- `@@schema("finanzas")`
## `finanzas.alternativa_b2c` (`alternativa_b2c`)
Definido en `Controladores/prisma/schema.prisma:4950`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_alternativa_b2c | BigInt | @id @default(autoincrement()) |
| id_grupo_alternativas_b2c | BigInt |  |
| numero_alternativa | Int |  |
| id_extension_producto_comercial | Int |  |
| id_producto_comercial_version | Int |  |
| id_precio_producto_comercial | BigInt |  |
| id_moneda | Int |  |
| id_condicion_comercial_version | BigInt? |  |
| id_tarifa_instalacion_comercial | BigInt? |  |
| cantidad | Int | @default(1) |
| configuracion_snapshot | Json |  |
| precio_unitario | Decimal | @db.Decimal(14, 2) |
| precio_instalacion | Decimal? | @db.Decimal(14, 2) |
| monto_neto | Decimal | @db.Decimal(14, 2) |
| monto_impuesto | Decimal | @db.Decimal(14, 2) |
| monto_total | Decimal | @db.Decimal(14, 2) |
| estado | String | @default("PROPUESTA") @db.VarChar(20) |
| decidida_en | DateTime? | @db.Timestamptz(6) |
| decidida_por | BigInt? |  |
| motivo_decision | String? |  |
| revision | Int | @default(1) |
| creado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| grupo | grupo_alternativas_b2c | @relation(fields: [id_grupo_alternativas_b2c], references: [id_grupo_alternativas_b2c], onDelete: Restrict, onUpdate: NoAction, map: "fk_alternativa_b2c_grupo") |
| seleccionada_en_grupo | grupo_alternativas_b2c? | @relation("grupo_alternativa_seleccionada") |
| producto | extension_producto_comercial | @relation(fields: [id_extension_producto_comercial], references: [id_extension_producto_comercial], onDelete: Restrict, onUpdate: NoAction, map: "fk_alternativa_b2c_producto") |
| producto_version | producto_comercial_version | @relation(fields: [id_producto_comercial_version], references: [id_producto_comercial_version], onDelete: Restrict, onUpdate: NoAction, map: "fk_alternativa_b2c_producto_version") |
| precio | precio_producto_comercial | @relation(fields: [id_precio_producto_comercial], references: [id_precio_producto_comercial], onDelete: Restrict, onUpdate: NoAction, map: "fk_alternativa_b2c_precio") |
| moneda | moneda | @relation(fields: [id_moneda], references: [id_moneda], onDelete: Restrict, onUpdate: NoAction, map: "fk_alternativa_b2c_moneda") |
| condicion | condicion_comercial_version? | @relation(fields: [id_condicion_comercial_version], references: [id_condicion_comercial_version], onDelete: Restrict, onUpdate: NoAction, map: "fk_alternativa_b2c_condicion") |
| tarifa_instalacion | tarifa_instalacion_comercial? | @relation(fields: [id_tarifa_instalacion_comercial], references: [id_tarifa_instalacion_comercial], onDelete: Restrict, onUpdate: NoAction, map: "fk_alternativa_b2c_tarifa_instalacion") |
| decisor | usuario? | @relation("alternativa_b2c_decisor", fields: [decidida_por], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction, map: "fk_alternativa_b2c_decisor") |
| opcionales | alternativa_b2c_opcional[] |  |
| historial | historial_decision_alternativa_b2c[] |  |
| detalle_contratado | detalle_cotizacion? |  |
### Indices y restricciones declarativas
- `@@unique([id_grupo_alternativas_b2c, numero_alternativa], map: "uq_alternativa_b2c_numero")`
- `@@index([id_grupo_alternativas_b2c, estado], map: "idx_alternativa_b2c_estado")`
- `@@index([id_extension_producto_comercial, id_producto_comercial_version], map: "idx_alternativa_b2c_producto_version")`
- `@@schema("finanzas")`
## `finanzas.alternativa_b2c_opcional` (`alternativa_b2c_opcional`)
Definido en `Controladores/prisma/schema.prisma:4992`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_alternativa_b2c_opcional | BigInt | @id @default(autoincrement()) |
| id_alternativa_b2c | BigInt |  |
| id_compatibilidad_opcional | BigInt |  |
| id_precio_opcional_comercial | BigInt |  |
| cantidad | Int | @default(1) |
| precio_unitario | Decimal | @db.Decimal(14, 2) |
| snapshot_opcional | Json |  |
| alternativa | alternativa_b2c | @relation(fields: [id_alternativa_b2c], references: [id_alternativa_b2c], onDelete: Restrict, onUpdate: NoAction, map: "fk_alternativa_b2c_opcional_alternativa") |
| compatibilidad | compatibilidad_opcional_producto | @relation(fields: [id_compatibilidad_opcional], references: [id_compatibilidad_opcional], onDelete: Restrict, onUpdate: NoAction, map: "fk_alternativa_b2c_opcional_compatibilidad") |
| precio | precio_opcional_comercial | @relation(fields: [id_precio_opcional_comercial], references: [id_precio_opcional_comercial], onDelete: Restrict, onUpdate: NoAction, map: "fk_alternativa_b2c_opcional_precio") |
### Indices y restricciones declarativas
- `@@unique([id_alternativa_b2c, id_compatibilidad_opcional], map: "uq_alternativa_b2c_opcional")`
- `@@schema("finanzas")`
## `finanzas.historial_decision_alternativa_b2c` (`historial_decision_alternativa_b2c`)
Definido en `Controladores/prisma/schema.prisma:5008`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_historial_decision | BigInt | @id @default(autoincrement()) |
| id_alternativa_b2c | BigInt |  |
| estado_anterior | String? | @db.VarChar(20) |
| estado_nuevo | String | @db.VarChar(20) |
| motivo | String |  |
| actor_id | BigInt |  |
| fecha | DateTime | @default(now()) @db.Timestamptz(6) |
| alternativa | alternativa_b2c | @relation(fields: [id_alternativa_b2c], references: [id_alternativa_b2c], onDelete: Restrict, onUpdate: NoAction, map: "fk_historial_alternativa_b2c_alternativa") |
| actor | usuario | @relation("historial_alternativa_actor", fields: [actor_id], references: [usuario_id_usuario], onDelete: Restrict, onUpdate: NoAction, map: "fk_historial_alternativa_b2c_actor") |
### Indices y restricciones declarativas
- `@@index([id_alternativa_b2c, fecha], map: "idx_historial_alternativa_b2c_fecha")`
- `@@schema("finanzas")`
## `finanzas.orden_compra_b2b` (`orden_compra_b2b`)
Definido en `Controladores/prisma/schema.prisma:5024`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_orden_compra_b2b | Int | @id @default(autoincrement()) |
| id_cotizacion | Int | @unique |
| folio | String |  |
| respaldo | String |  |
| fecha | DateTime | @db.Date |
| cotizacion | cotizacion | @relation(fields: [id_cotizacion], references: [id_cotizacion], onDelete: Restrict) |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.guia_despacho` (`guia_despacho`)
Definido en `Controladores/prisma/schema.prisma:5036`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_guia_despacho | Int | @id @default(autoincrement()) |
| id_nota_venta | Int |  |
| folio | String | @unique |
| fecha_emision | DateTime | @db.Date |
| estado | String | @default("emitida") |
| antecedentes | Json? |  |
| nota_venta | nota_venta | @relation(fields: [id_nota_venta], references: [id_nota_venta], onDelete: Restrict) |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.condicion_cobro_nv` (`condicion_cobro_nv`)
Definido en `Controladores/prisma/schema.prisma:5049`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_condicion_cobro_nv | Int | @id @default(autoincrement()) |
| id_nota_venta | Int |  |
| descripcion | String |  |
| monto_referencia | Decimal? | @db.Decimal(14, 2) |
| porcentaje_referencia | Decimal? | @db.Decimal(5, 2) |
| evento_referencia | String? |  |
| nota_venta | nota_venta | @relation(fields: [id_nota_venta], references: [id_nota_venta], onDelete: Restrict) |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.documento_tributario_nota_venta` (`documento_tributario_nota_venta`)
Definido en `Controladores/prisma/schema.prisma:5062`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_documento_tributario | Int |  |
| id_nota_venta | Int |  |
| documento_tributario | documento_tributario | @relation(fields: [id_documento_tributario], references: [id_documento_tributario], onDelete: Restrict) |
| nota_venta | nota_venta | @relation(fields: [id_nota_venta], references: [id_nota_venta], onDelete: Restrict) |
### Indices y restricciones declarativas
- `@@id([id_documento_tributario, id_nota_venta])`
- `@@schema("finanzas")`
## `finanzas.reversion_nota_venta` (`reversion_nota_venta`)
Definido en `Controladores/prisma/schema.prisma:5073`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| destino_excedente | String? | @db.VarChar(30) |
| id_reversion_nota_venta | Int | @id @default(autoincrement()) |
| id_nota_venta | Int |  |
| monto | Decimal | @db.Decimal(14, 2) |
| fecha | DateTime | @default(now()) |
| motivo | String |  |
| responsable | String |  |
| folio_nota_credito | String | @unique |
| respaldo_pdf | String |  |
| nota_venta | nota_venta | @relation(fields: [id_nota_venta], references: [id_nota_venta], onDelete: Restrict) |
| saldo_favor_cliente | saldo_favor_cliente[] |  |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.anulacion_pago` (`anulacion_pago`)
Definido en `Controladores/prisma/schema.prisma:5090`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_anulacion_pago | Int | @id @default(autoincrement()) |
| id_pago_cliente | Int | @unique |
| fecha | DateTime | @default(now()) |
| motivo | String |  |
| responsable | String |  |
| respaldo | String |  |
| pago_cliente | pago_cliente | @relation(fields: [id_pago_cliente], references: [id_pago_cliente], onDelete: Restrict) |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.reversion_pago` (`reversion_pago`)
Definido en `Controladores/prisma/schema.prisma:5103`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_reversion_pago | Int | @id @default(autoincrement()) |
| id_pago_cliente | Int |  |
| monto | Decimal | @db.Decimal(14, 2) |
| fecha | DateTime | @default(now()) |
| motivo | String |  |
| responsable | String |  |
| respaldo | String |  |
| pago_cliente | pago_cliente | @relation(fields: [id_pago_cliente], references: [id_pago_cliente], onDelete: Restrict) |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.saldo_favor_cliente` (`saldo_favor_cliente`)
Definido en `Controladores/prisma/schema.prisma:5117`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_saldo_favor_cliente | Int | @id @default(autoincrement()) |
| id_cliente_financiero | Int |  |
| id_nota_venta | Int |  |
| id_reversion_nota_venta | Int |  |
| monto_original | Decimal | @db.Decimal(14, 2) |
| monto_disponible | Decimal | @db.Decimal(14, 2) |
| fecha | DateTime | @default(now()) |
| cliente_financiero | cliente_financiero | @relation(fields: [id_cliente_financiero], references: [id_cliente_financiero], onDelete: Restrict) |
| nota_venta | nota_venta | @relation(fields: [id_nota_venta], references: [id_nota_venta], onDelete: Restrict) |
| reversion_nota_venta | reversion_nota_venta | @relation(fields: [id_reversion_nota_venta], references: [id_reversion_nota_venta], onDelete: Restrict) |
| aplicacion_saldo_favor | aplicacion_saldo_favor[] |  |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.aplicacion_saldo_favor` (`aplicacion_saldo_favor`)
Definido en `Controladores/prisma/schema.prisma:5134`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_aplicacion_saldo_favor | Int | @id @default(autoincrement()) |
| id_saldo_favor_cliente | Int |  |
| id_nota_venta | Int |  |
| monto | Decimal | @db.Decimal(14, 2) |
| fecha | DateTime | @default(now()) |
| responsable | String |  |
| saldo_favor_cliente | saldo_favor_cliente | @relation(fields: [id_saldo_favor_cliente], references: [id_saldo_favor_cliente], onDelete: Restrict) |
| nota_venta | nota_venta | @relation(fields: [id_nota_venta], references: [id_nota_venta], onDelete: Restrict) |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.categoria_pago` (`categoria_pago`)
Definido en `Controladores/prisma/schema.prisma:5148`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_categoria_pago | Int | @id @default(autoincrement()) |
| nombre | String | @unique |
| activo | Boolean | @default(true) |
| pago_cliente | pago_cliente[] |  |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.config_cuotas_tarjeta` (`config_cuotas_tarjeta`)
Definido en `Controladores/prisma/schema.prisma:5158`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| cantidad | Int | @id |
| activo | Boolean | @default(true) |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.config_umbral_por_vencer` (`config_umbral_por_vencer`)
Definido en `Controladores/prisma/schema.prisma:5166`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_configuracion | Int | @id @default(autoincrement()) |
| dias_habiles | Int |  |
| fecha | DateTime | @default(now()) |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `terreno.usuario_permiso_particular` (`usuario_permiso_particular`)
Definido en `Controladores/prisma/schema.prisma:5175`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_usuario | BigInt |  |
| id_permiso | BigInt |  |
| usuario | usuario | @relation(fields: [id_usuario], references: [usuario_id_usuario]) |
| permiso | permiso | @relation(fields: [id_permiso], references: [permiso_id_permiso]) |
### Indices y restricciones declarativas
- `@@id([id_usuario, id_permiso])`
- `@@schema("terreno")`
## `terreno.permiso_dependencia` (`permiso_dependencia`)
Definido en `Controladores/prisma/schema.prisma:5185`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_permiso | BigInt |  |
| id_requerido | BigInt |  |
| permiso | permiso | @relation("permiso_dependiente", fields: [id_permiso], references: [permiso_id_permiso]) |
| requerido | permiso | @relation("permiso_requerido", fields: [id_requerido], references: [permiso_id_permiso]) |
### Indices y restricciones declarativas
- `@@id([id_permiso, id_requerido])`
- `@@schema("terreno")`
## `terreno.estado_seguridad_usuario` (`estado_seguridad_usuario`)
Definido en `Controladores/prisma/schema.prisma:5196`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_usuario | BigInt | @id |
| intentos | Int | @default(0) |
| bloqueos | Int | @default(0) |
| bloqueo_hasta | DateTime? | @db.Timestamptz(6) |
| bloqueo_persistente | Boolean | @default(false) |
| actualizado | DateTime | @default(now()) @db.Timestamptz(6) |
| responsable | String? |  |
| usuario | usuario | @relation(fields: [id_usuario], references: [usuario_id_usuario]) |
### Indices y restricciones declarativas
- `@@schema("terreno")`
## `terreno.sesion_usuario` (`sesion_usuario`)
Definido en `Controladores/prisma/schema.prisma:5210`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id | String | @id @default(uuid()) |
| id_usuario | BigInt |  |
| secreto_hash | String | @unique |
| inicio | DateTime | @default(now()) @db.Timestamptz(6) |
| vence | DateTime | @db.Timestamptz(6) |
| invalidada | DateTime? | @db.Timestamptz(6) |
| motivo | String? |  |
| direccion | String? |  |
| agente | String? |  |
| version_seguridad | Int |  |
| usuario | usuario | @relation(fields: [id_usuario], references: [usuario_id_usuario]) |
### Indices y restricciones declarativas
- `@@index([id_usuario])`
- `@@schema("terreno")`
## `terreno.token_recuperacion` (`token_recuperacion`)
Definido en `Controladores/prisma/schema.prisma:5228`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id | String | @id @default(uuid()) |
| id_usuario | BigInt |  |
| secreto_hash | String | @unique |
| creado | DateTime | @default(now()) @db.Timestamptz(6) |
| vence | DateTime | @db.Timestamptz(6) |
| utilizado | DateTime? | @db.Timestamptz(6) |
| usuario | usuario | @relation(fields: [id_usuario], references: [usuario_id_usuario]) |
### Indices y restricciones declarativas
- `@@index([id_usuario])`
- `@@schema("terreno")`
## `finanzas.evento_auditoria_m9` (`evento_auditoria_m9`)
Definido en `Controladores/prisma/schema.prisma:5242`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_evento_m9 | Int | @id @default(autoincrement()) |
| identidad_logica | String | @unique @db.VarChar(160) |
| version_contrato | String | @db.VarChar(20) |
| fecha_ocurrencia | DateTime | @db.Timestamptz(6) |
| zona_horaria | String | @db.VarChar(80) |
| fecha_persistencia | DateTime | @db.Timestamptz(6) |
| ejecutor_tipo | String | @db.VarChar(10) |
| ejecutor_referencia | String? | @db.VarChar(120) |
| productor | String | @db.VarChar(80) |
| modulo_origen | String | @db.VarChar(40) |
| operacion | String | @db.VarChar(100) |
| resultado | String | @db.VarChar(10) |
| entidad_tipo | String? | @db.VarChar(80) |
| entidad_referencia | String? | @db.VarChar(160) |
| secuencia | Int? |  |
| valores_anteriores | Json? |  |
| valores_nuevos | Json? |  |
| motivo | String? |  |
| causa | String? |  |
| id_evento_origen | Int? |  |
| id_evento_correctivo | Int? |  |
| contexto_terminal | Boolean | @default(false) |
| evento_privacidad | Boolean | @default(false) |
| metadatos_tecnicos | Json? |  |
| hash_contenido | String | @db.Char(64) |
| hash_integridad | String | @db.Char(64) |
| evento_origen | evento_auditoria_m9? | @relation("m9_origen_derivado", fields: [id_evento_origen], references: [id_evento_m9], onDelete: Restrict) |
| derivados | evento_auditoria_m9[] | @relation("m9_origen_derivado") |
| evento_correctivo | evento_auditoria_m9? | @relation("m9_original_correctivo", fields: [id_evento_correctivo], references: [id_evento_m9], onDelete: Restrict) |
| correcciones | evento_auditoria_m9[] | @relation("m9_original_correctivo") |
### Indices y restricciones declarativas
- `@@index([fecha_ocurrencia, id_evento_m9])`
- `@@index([modulo_origen, operacion, resultado])`
- `@@index([entidad_tipo, entidad_referencia])`
- `@@index([productor, secuencia])`
- `@@schema("finanzas")`
## `finanzas.pendiente_evento_m9` (`pendiente_evento_m9`)
Definido en `Controladores/prisma/schema.prisma:5282`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_pendiente_m9 | Int | @id @default(autoincrement()) |
| identidad_logica | String | @unique @db.VarChar(160) |
| productor | String | @db.VarChar(80) |
| modulo_origen | String | @db.VarChar(40) |
| operacion | String | @db.VarChar(100) |
| fecha_ocurrencia | DateTime | @db.Timestamptz(6) |
| creado_en | DateTime | @default(now()) @db.Timestamptz(6) |
| proximo_intento_en | DateTime | @default(now()) @db.Timestamptz(6) |
| resuelto_en | DateTime? | @db.Timestamptz(6) |
| estado | String | @default("PENDIENTE") @db.VarChar(20) |
| cantidad_intentos | Int | @default(0) |
| ultimo_error_codigo | String? | @db.VarChar(100) |
| ultimo_error_en | DateTime? | @db.Timestamptz(6) |
| payload_evento | Json |  |
### Indices y restricciones declarativas
- `@@index([estado, proximo_intento_en])`
- `@@index([productor, estado])`
- `@@schema("finanzas")`
## `finanzas.intento_retry_m9` (`intento_retry_m9`)
Definido en `Controladores/prisma/schema.prisma:5304`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_intento_m9 | Int | @id @default(autoincrement()) |
| id_pendiente_m9 | Int |  |
| numero_intento | Int |  |
| estado | String | @db.VarChar(20) |
| error_codigo | String? | @db.VarChar(100) |
| iniciado_en | DateTime | @db.Timestamptz(6) |
| finalizado_en | DateTime | @db.Timestamptz(6) |
### Indices y restricciones declarativas
- `@@unique([id_pendiente_m9, numero_intento])`
- `@@index([estado, finalizado_en])`
- `@@schema("finanzas")`
## `finanzas.configuracion_alerta_m9` (`configuracion_alerta_m9`)
Definido en `Controladores/prisma/schema.prisma:5319`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_configuracion_alerta | Int | @id @default(autoincrement()) |
| codigo | String | @unique @db.VarChar(100) |
| metrica | String | @db.VarChar(80) |
| operador | String | @db.VarChar(4) |
| umbral | Decimal | @db.Decimal(24, 6) |
| activa | Boolean | @default(true) |
| vigencia_desde | DateTime | @db.Timestamptz(6) |
| vigencia_hasta | DateTime? | @db.Timestamptz(6) |
### Indices y restricciones declarativas
- `@@index([metrica, activa, vigencia_desde])`
- `@@schema("finanzas")`
## `finanzas.categoria_retencion_m9` (`categoria_retencion_m9`)
Definido en `Controladores/prisma/schema.prisma:5333`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_categoria_retencion | Int | @id @default(autoincrement()) |
| codigo | String | @unique @db.VarChar(100) |
| descripcion | String? | @db.VarChar(300) |
| ownership | String | @db.VarChar(40) |
| creada_en | DateTime | @default(now()) @db.Timestamptz(6) |
### Indices y restricciones declarativas
- `@@schema("finanzas")`
## `finanzas.politica_tratamiento_m9` (`politica_tratamiento_m9`)
Definido en `Controladores/prisma/schema.prisma:5344`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_politica_m9 | Int | @id @default(autoincrement()) |
| id_categoria_retencion | Int |  |
| version | Int |  |
| accion | String | @db.VarChar(20) |
| modulo_objetivo | String? | @db.VarChar(40) |
| entidad_objetivo | String? | @db.VarChar(80) |
| estrategia_ref | String? | @db.VarChar(100) |
| permite_correlacion | Boolean | @default(false) |
| preservar_minimo | Boolean | @default(false) |
| finalidad_ref | String? | @db.VarChar(200) |
| base_ref | String? | @db.VarChar(200) |
| politica_owner_ref | String? | @db.VarChar(200) |
| vigencia_desde | DateTime | @db.Timestamptz(6) |
| vigencia_hasta | DateTime? | @db.Timestamptz(6) |
| creada_en | DateTime | @default(now()) @db.Timestamptz(6) |
### Indices y restricciones declarativas
- `@@unique([id_categoria_retencion, version])`
- `@@index([id_categoria_retencion, vigencia_desde, vigencia_hasta])`
- `@@schema("finanzas")`
## `finanzas.tratamiento_privacidad_m9` (`tratamiento_privacidad_m9`)
Definido en `Controladores/prisma/schema.prisma:5367`.
| Campo | Tipo Prisma | Atributos |
| --- | --- | --- |
| id_tratamiento_m9 | Int | @id @default(autoincrement()) |
| id_evento_m9 | Int |  |
| id_politica_m9 | Int |  |
| accion | String | @db.VarChar(20) |
| estado | String | @db.VarChar(30) |
| correlacion_anonima | String? | @db.VarChar(160) |
| aplicado_en | DateTime | @db.Timestamptz(6) |
| evidencia_terminal_id | Int? |  |
### Indices y restricciones declarativas
- `@@unique([id_evento_m9, id_politica_m9])`
- `@@index([id_evento_m9, aplicado_en])`
- `@@schema("finanzas")`
## Diferencias esenciales
**Producto maestro:** definicion reutilizable del catalogo. **Linea comercial:** agrupacion cotizada. **Unidad fisica:** puerta individual contratada. **OT:** orden operacional asociada a esa unidad.
**Obra:** lugar fisico. **Proyecto:** pedido o trabajo especifico. Una obra puede tener varios proyectos sin duplicarse.

## Fuentes de verdad consultadas
- `Controladores/prisma/schema.prisma`
- `Controladores/pruebas`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/rutas/finanzas.ts`
- `Vistas/src`
- `Vistas/src/App.tsx`
