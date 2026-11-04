# Migraciones explicadas

**Proyecto:** Puertas Blindadas
**Documento:** 12
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

## Principios
Las migraciones son incrementales e inmutables. No se corrige una migracion aplicada editandola; se agrega otra. `migrate reset` y `db push` no son mecanismos de produccion.
## 000_base_existente
**Archivo:** `Controladores/prisma/migrations/000_base_existente/migration.sql`
**Tamano:** 6462 lineas
**SHA-256:** `b95b39e4314d663aef18fe098a3a736f2d70844494199bf1d5de2b1af17cfc46`
### Operaciones detectadas
- CREATE TABLE: finanzas.afp
- CREATE TABLE: finanzas.alerta_financiera
- CREATE TABLE: finanzas.asignacion_pago_cliente
- CREATE TABLE: finanzas.asignacion_pago_proveedor
- CREATE TABLE: finanzas.cargo
- CREATE TABLE: finanzas.cliente_financiero
- CREATE TABLE: finanzas.concepto_remuneracion
- CREATE TABLE: finanzas.conciliacion
- CREATE TABLE: finanzas.costo_proyecto
- CREATE TABLE: finanzas.cotizacion
- CREATE TABLE: finanzas.credito_proyecto
- CREATE TABLE: finanzas.detalle_conciliacion
- CREATE TABLE: finanzas.detalle_costo_material_cotizacion
- CREATE TABLE: finanzas.detalle_costo_proyecto_documento_proveedor
- CREATE TABLE: finanzas.detalle_cotizacion
- CREATE TABLE: finanzas.detalle_documento_compra_proveedor
- CREATE TABLE: finanzas.detalle_evento_auditoria
- CREATE TABLE: finanzas.detalle_liquidacion_remuneracion
- CREATE TABLE: finanzas.documento_compra_proveedor
- CREATE TABLE: finanzas.documento_tributario
- CREATE TABLE: finanzas.empleado
- CREATE TABLE: finanzas.evaluacion_credito
- CREATE TABLE: finanzas.evento_auditoria
- CREATE TABLE: finanzas.ficha_cliente
- CREATE TABLE: finanzas.fondo_global_credito
- CREATE TABLE: finanzas.gasto_caja_chica
- CREATE TABLE: finanzas.historial_precio_material
- CREATE TABLE: finanzas.historial_tarifa_tarea
- CREATE TABLE: finanzas.hito_cobro
- CREATE TABLE: finanzas.limite_credito_cliente
- CREATE TABLE: finanzas.liquidacion_remuneracion
- CREATE TABLE: finanzas.medio_pago
- CREATE TABLE: finanzas.moneda
- CREATE TABLE: finanzas.movimiento_bancario
- CREATE TABLE: finanzas.movimiento_financiero
- CREATE TABLE: finanzas.nota_venta
- CREATE TABLE: finanzas.origen_alerta_financiera
- CREATE TABLE: finanzas.origen_movimiento_financiero
- CREATE TABLE: finanzas.pago_cliente
- CREATE TABLE: finanzas.pago_proveedor
- CREATE TABLE: finanzas.pais
- CREATE TABLE: finanzas.prevision_salud
- CREATE TABLE: finanzas.proveedor
- CREATE TABLE: finanzas.proyecto_financiero
- CREATE TABLE: finanzas.tarea_catalogada
- CREATE TABLE: finanzas.tarea_remunerable
- CREATE TABLE: finanzas.tipo_cliente_financiero
- CREATE TABLE: finanzas.tipo_documento
- CREATE TABLE: finanzas.tipo_identificador
- CREATE TABLE: finanzas.tipo_vinculo_laboral
- CREATE TABLE: inventario.alerta_faltante_pedido
- CREATE TABLE: inventario.alerta_inventario
- CREATE TABLE: inventario.alerta_inventario_nivel_prioridad
- CREATE TABLE: inventario.alerta_inventario_tipo_alerta
- CREATE TABLE: inventario.anaquel
- CREATE TABLE: inventario.bodega
- CREATE TABLE: inventario.factura_compra
- CREATE TABLE: inventario.factura_compra_tipo_cambio
- CREATE TABLE: inventario.historial_alerta
- CREATE TABLE: inventario.insumo_estandar_proceso
- CREATE TABLE: inventario.inventario_bodega
- CREATE TABLE: inventario.lote
- CREATE TABLE: inventario.lote_fecha_pedido
- CREATE TABLE: inventario.material
- CREATE TABLE: inventario.material_categoria_funcional
- CREATE TABLE: inventario.material_categoria_general
- CREATE TABLE: inventario.material_clasificacion_categoria
- CREATE TABLE: inventario.material_clasificacion_nivel_especifico
- CREATE TABLE: inventario.material_clasificacion_subcategoria
- CREATE TABLE: inventario.material_codigo_barras
- CREATE TABLE: inventario.material_orden_trabajo
- CREATE TABLE: inventario.material_producto_terminado
- CREATE TABLE: inventario.material_proveedor
- CREATE TABLE: inventario.material_unidad_medida
- CREATE TABLE: inventario.movimiento_inventario
- CREATE TABLE: inventario.movimiento_inventario_clasificacion_salida
- CREATE TABLE: inventario.movimiento_inventario_motivo_movimiento
- CREATE TABLE: inventario.movimiento_inventario_tipo_movimiento
- CREATE TABLE: inventario.notificacion
- CREATE TABLE: inventario.orden_trabajo
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 001_base_i2
**Archivo:** `Controladores/prisma/migrations/001_base_i2/migration.sql`
**Tamano:** 308 lineas
**SHA-256:** `08775809b5535054fda33f3dcaed3d371afce045cb707dfb3b9858b8dbd3ab6e`
### Operaciones detectadas
- CREATE TABLE: "cotizacion_version"
- CREATE TABLE: "orden_compra_b2b"
- CREATE TABLE: "guia_despacho"
- CREATE TABLE: "condicion_cobro_nv"
- CREATE TABLE: "documento_tributario_nota_venta"
- CREATE TABLE: "reversion_nota_venta"
- CREATE TABLE: "anulacion_pago"
- CREATE TABLE: "reversion_pago"
- CREATE TABLE: "saldo_favor_cliente"
- CREATE TABLE: "aplicacion_saldo_favor"
- CREATE TABLE: "categoria_pago"
- CREATE TABLE: "config_cuotas_tarjeta"
- CREATE TABLE: "config_umbral_por_vencer"
- ALTER TABLE: "cliente_financiero"
- ALTER TABLE: "conciliacion"
- ALTER TABLE: "conciliacion"
- ALTER TABLE: "documento_tributario"
- ALTER TABLE: "asignacion_pago_cliente"
- ALTER TABLE: "cliente_financiero"
- ALTER TABLE: "conciliacion"
- ALTER TABLE: "cotizacion"
- ALTER TABLE: "documento_tributario"
- ALTER TABLE: "nota_venta"
- ALTER TABLE: "pago_cliente"
- ALTER TABLE: "cliente_financiero"
- ALTER TABLE: "conciliacion"
- ALTER TABLE: "conciliacion"
- ALTER TABLE: "conciliacion"
- ALTER TABLE: "documento_tributario"
- ALTER TABLE: "nota_venta"
- ALTER TABLE: "pago_cliente"
- ALTER TABLE: "cotizacion_version"
- ALTER TABLE: "orden_compra_b2b"
- ALTER TABLE: "guia_despacho"
- ALTER TABLE: "condicion_cobro_nv"
- ALTER TABLE: "documento_tributario_nota_venta"
- ALTER TABLE: "documento_tributario_nota_venta"
- ALTER TABLE: "reversion_nota_venta"
- ALTER TABLE: "anulacion_pago"
- ALTER TABLE: "reversion_pago"
- ALTER TABLE: "saldo_favor_cliente"
- ALTER TABLE: "saldo_favor_cliente"
- ALTER TABLE: "saldo_favor_cliente"
- ALTER TABLE: "aplicacion_saldo_favor"
- ALTER TABLE: "aplicacion_saldo_favor"
- ALTER TABLE: cotizacion
- ALTER TABLE: cotizacion
- ALTER TABLE: nota_venta
- ALTER TABLE: nota_venta
- ALTER TABLE: cliente_financiero
- ALTER TABLE: reversion_nota_venta
- ALTER TABLE: reversion_pago
- ALTER TABLE: saldo_favor_cliente
- ALTER TABLE: aplicacion_saldo_favor
- ALTER TABLE: config_cuotas_tarjeta
- ALTER TABLE: pago_cliente
- ALTER TABLE: config_umbral_por_vencer
- CREATE INDEX: "orden_compra_b2b_id_cotizacion_key"
- CREATE INDEX: "guia_despacho_folio_key"
- CREATE INDEX: "reversion_nota_venta_folio_nota_credito_key"
- CREATE INDEX: "anulacion_pago_id_pago_cliente_key"
- CREATE INDEX: "categoria_pago_nombre_key"
- CREATE INDEX: "asignacion_pago_cliente_id_pago_cliente_key"
- CREATE INDEX: "cliente_financiero_referencia_demostracion_key"
- CREATE INDEX: "cotizacion_referencia_demostracion_key"
- CREATE INDEX: "nota_venta_id_cotizacion_key"
- CREATE INDEX: "pago_cliente_referencia_demostracion_key"
- INSERT: documento_tributario_nota_venta
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 002_secuencias_heredadas
**Archivo:** `Controladores/prisma/migrations/002_secuencias_heredadas/migration.sql`
**Tamano:** 18 lineas
**SHA-256:** `3ce5436a4e2b0cc2ebae01723e9104aa019db9208bef14e6bbae845affba9bd8`
### Operaciones detectadas
- No se detectaron operaciones por los patrones basicos; revisar SQL completo.
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 003_seguridad_m4
**Archivo:** `Controladores/prisma/migrations/003_seguridad_m4/migration.sql`
**Tamano:** 144 lineas
**SHA-256:** `04b9cb0324b4443a33a5e0bcf017d4f8fa4032afee5cd6b9d00b432d4796a451`
### Operaciones detectadas
- CREATE TABLE: "terreno"."usuario_permiso_particular"
- CREATE TABLE: "terreno"."permiso_dependencia"
- CREATE TABLE: "terreno"."estado_seguridad_usuario"
- CREATE TABLE: "terreno"."sesion_usuario"
- CREATE TABLE: "terreno"."token_recuperacion"
- ALTER TABLE: "terreno"."perfil"
- ALTER TABLE: "terreno"."permiso"
- ALTER TABLE: "terreno"."usuario"
- ALTER TABLE: "terreno"."usuario_contrasena"
- ALTER TABLE: "terreno"."usuario"
- ALTER TABLE: "terreno"."usuario_permiso_particular"
- ALTER TABLE: "terreno"."usuario_permiso_particular"
- ALTER TABLE: "terreno"."permiso_dependencia"
- ALTER TABLE: "terreno"."permiso_dependencia"
- ALTER TABLE: "terreno"."estado_seguridad_usuario"
- ALTER TABLE: "terreno"."sesion_usuario"
- ALTER TABLE: "terreno"."token_recuperacion"
- ALTER TABLE: terreno.permiso_dependencia
- CREATE INDEX: "sesion_usuario_secreto_hash_key"
- CREATE INDEX: "sesion_usuario_id_usuario_idx"
- CREATE INDEX: "token_recuperacion_secreto_hash_key"
- CREATE INDEX: "token_recuperacion_id_usuario_idx"
- CREATE INDEX: "perfil_codigo_m4_key"
- CREATE INDEX: "permiso_codigo_m4_key"
- CREATE INDEX: "usuario_acceso_m4_key"
- CREATE INDEX: "usuario_empleado_m4_key"
- CREATE INDEX: sesion_unica_vigente
- CREATE INDEX: credencial_unica_vigente
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 004_destino_excedente
**Archivo:** `Controladores/prisma/migrations/004_destino_excedente/migration.sql`
**Tamano:** 2 lineas
**SHA-256:** `5003cc159204992d332b0e9d4b66bc8f43c681a608d60a2ba0727cce0051c10f`
### Operaciones detectadas
- ALTER TABLE: finanzas.reversion_nota_venta
- ALTER TABLE: finanzas.reversion_nota_venta
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 005_sesiones_multiples
**Archivo:** `Controladores/prisma/migrations/005_sesiones_multiples/migration.sql`
**Tamano:** 3 lineas
**SHA-256:** `356a2795512ea6378281818fffe12475d289e36e4dc0a6285132234caddeff84`
### Operaciones detectadas
- No se detectaron operaciones por los patrones basicos; revisar SQL completo.
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 006_cliente_financiero_autonomo
**Archivo:** `Controladores/prisma/migrations/006_cliente_financiero_autonomo/migration.sql`
**Tamano:** 9 lineas
**SHA-256:** `689f4675a467982ef4bb42c7f939bb2e697a497bf6616862d33688524d307410`
### Operaciones detectadas
- ALTER TABLE: finanzas.cliente_financiero
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 007_m5_proveedores
**Archivo:** `Controladores/prisma/migrations/007_m5_proveedores/migration.sql`
**Tamano:** 43 lineas
**SHA-256:** `7a9c2e9625f0477bbf918db21c496445762d6861fd858c84c517a6d56c121f77`
### Operaciones detectadas
- CREATE TABLE: finanzas.historial_proveedor_m5
- ALTER TABLE: finanzas.proveedor
- ALTER TABLE: finanzas.proveedor
- ALTER TABLE: finanzas.proveedor
- ALTER TABLE: finanzas.proveedor
- CREATE INDEX: idx_proveedor_identidad_m5
- CREATE INDEX: idx_historial_proveedor_m5_proveedor_fecha
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 008_m5_ocs_condicion_pago
**Archivo:** `Controladores/prisma/migrations/008_m5_ocs_condicion_pago/migration.sql`
**Tamano:** 66 lineas
**SHA-256:** `318f85ffc250ec99d995c56788ca58034961de5fb436aef04a4387b592f7430f`
### Operaciones detectadas
- CREATE TABLE: finanzas.orden_compra_servicio_m5
- CREATE TABLE: finanzas.historial_orden_compra_servicio_m5
- ALTER TABLE: finanzas.proveedor
- ALTER TABLE: finanzas.proveedor
- CREATE INDEX: idx_ocs_m5_proveedor_fecha
- CREATE INDEX: idx_ocs_m5_estado_fecha
- CREATE INDEX: idx_historial_ocs_m5_ocs_fecha
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 009_m5_ajustes_ciclo_ocs
**Archivo:** `Controladores/prisma/migrations/009_m5_ajustes_ciclo_ocs/migration.sql`
**Tamano:** 62 lineas
**SHA-256:** `6bf7b6393f01dd4b9371e12da8a507c99750bfb3313e267063359cd470f6ff72`
### Operaciones detectadas
- CREATE TABLE: finanzas.ajuste_orden_compra_servicio_m5
- CREATE TABLE: finanzas.efecto_financiero_ocs_m5
- ALTER TABLE: finanzas.orden_compra_servicio_m5
- ALTER TABLE: finanzas.orden_compra_servicio_m5
- ALTER TABLE: finanzas.historial_orden_compra_servicio_m5
- CREATE INDEX: idx_ajuste_ocs_m5_ocs_estado
- CREATE INDEX: idx_efecto_ocs_m5_ocs
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 010_m5_documentos_obligaciones
**Archivo:** `Controladores/prisma/migrations/010_m5_documentos_obligaciones/migration.sql`
**Tamano:** 57 lineas
**SHA-256:** `d42d9716a38950e6879fe476133b9d629d6097c43885a35f46f1d2f4f3112dd5`
### Operaciones detectadas
- CREATE TABLE: finanzas.documento_proveedor_m5
- CREATE TABLE: finanzas.asociacion_documento_oc_m5
- CREATE TABLE: finanzas.categoria_egreso_m5
- CREATE TABLE: finanzas.clasificacion_asociacion_m5
- CREATE TABLE: finanzas.propuesta_imputacion_m5
- CREATE TABLE: finanzas.detalle_imputacion_m5
- CREATE TABLE: finanzas.obligacion_proveedor_m5
- CREATE TABLE: finanzas.feriado_chile_m5
- ALTER TABLE: finanzas.orden_compra_servicio_m5
- ALTER TABLE: finanzas.orden_compra_servicio_m5
- CREATE INDEX: uq_documento_definitivo_m5_identidad
- CREATE INDEX: idx_documento_m5_proveedor_fecha
- CREATE INDEX: idx_documento_m5_estado_fecha
- CREATE INDEX: idx_asociacion_documento_m5
- CREATE INDEX: idx_clasificacion_m5_asociacion
- CREATE INDEX: idx_imputacion_m5_documento_estado
- CREATE INDEX: idx_detalle_imputacion_m5_propuesta
- CREATE INDEX: idx_obligacion_m5_proveedor_vencimiento
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 011_m5_cuentas_por_pagar
**Archivo:** `Controladores/prisma/migrations/011_m5_cuentas_por_pagar/migration.sql`
**Tamano:** 15 lineas
**SHA-256:** `56ddf4b58ce670e0181df5f4633a2b36acc9b4bdd8219fc0d58266e3ef8c0e16`
### Operaciones detectadas
- CREATE TABLE: finanzas.config_umbral_por_vencer_m5
- CREATE INDEX: idx_config_umbral_m5_vigente
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 012_m5_pagos_proveedores
**Archivo:** `Controladores/prisma/migrations/012_m5_pagos_proveedores/migration.sql`
**Tamano:** 66 lineas
**SHA-256:** `a17c0db052ea2373e54cb37f1f32b5f0be351a764279ea2239a6cde0e160ae4e`
### Operaciones detectadas
- CREATE TABLE: finanzas.operacion_pago_proveedor_m5
- CREATE TABLE: finanzas.movimiento_pago_proveedor_m5
- CREATE TABLE: finanzas.respaldo_pago_proveedor_m5
- CREATE TABLE: finanzas.asociacion_respaldo_pago_m5
- CREATE INDEX: idx_operacion_pago_m5_proveedor_estado
- CREATE INDEX: idx_movimiento_pago_m5_operacion
- CREATE INDEX: idx_movimiento_pago_m5_obligacion
- CREATE INDEX: idx_asociacion_respaldo_m5_respaldo
- CREATE INDEX: uq_respaldo_pago_m5_operacion
- CREATE INDEX: uq_respaldo_pago_m5_movimiento
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 013_m5_postpagos_proveedores
**Archivo:** `Controladores/prisma/migrations/013_m5_postpagos_proveedores/migration.sql`
**Tamano:** 46 lineas
**SHA-256:** `2ffb2338b55bbc9545a24cee0b7372bdb34e1f24a0a95e8791e2226e12ed8f2d`
### Operaciones detectadas
- CREATE TABLE: finanzas.anulacion_movimiento_pago_m5
- CREATE TABLE: finanzas.reversion_movimiento_pago_m5
- CREATE TABLE: finanzas.conciliacion_movimiento_pago_m5
- ALTER TABLE: finanzas.obligacion_proveedor_m5
- CREATE INDEX: idx_anulacion_pago_m5_grupo
- CREATE INDEX: idx_reversion_pago_m5_movimiento
- CREATE INDEX: idx_conciliacion_pago_m5_movimiento
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 014_m5_ajustes_saldos_favor
**Archivo:** `Controladores/prisma/migrations/014_m5_ajustes_saldos_favor/migration.sql`
**Tamano:** 64 lineas
**SHA-256:** `406f585d9d15b89b2ff5d7a9b36ce9db6ecce28030ff6db001130fed891f187c`
### Operaciones detectadas
- CREATE TABLE: finanzas.ajuste_obligacion_proveedor_m5
- CREATE TABLE: finanzas.saldo_favor_proveedor_m5
- CREATE TABLE: finanzas.historial_respaldo_pago_m5
- ALTER TABLE: finanzas.documento_proveedor_m5
- ALTER TABLE: finanzas.documento_proveedor_m5
- ALTER TABLE: finanzas.documento_proveedor_m5
- ALTER TABLE: finanzas.documento_proveedor_m5
- ALTER TABLE: finanzas.efecto_financiero_ocs_m5
- ALTER TABLE: finanzas.efecto_financiero_ocs_m5
- CREATE INDEX: idx_ajuste_obligacion_m5_obligacion
- CREATE INDEX: idx_saldo_favor_m5_proveedor_moneda
- CREATE INDEX: idx_historial_respaldo_m5_operacion
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 015_m5_compensaciones_reclasificaciones
**Archivo:** `Controladores/prisma/migrations/015_m5_compensaciones_reclasificaciones/migration.sql`
**Tamano:** 66 lineas
**SHA-256:** `fded35210f45c20699dab8a801d732cec5bdf269a52ac8caa1802ec29b963cb9`
### Operaciones detectadas
- CREATE TABLE: finanzas.compensacion_saldo_favor_m5
- CREATE TABLE: finanzas.detalle_compensacion_saldo_favor_m5
- CREATE TABLE: finanzas.reversion_compensacion_m5
- CREATE TABLE: finanzas.historial_categoria_egreso_m5
- CREATE TABLE: finanzas.config_umbral_reclasificacion_m5
- CREATE TABLE: finanzas.historial_umbral_reclasificacion_m5
- CREATE TABLE: finanzas.reclasificacion_egreso_m5
- CREATE TABLE: finanzas.detalle_reclasificacion_egreso_m5
- ALTER TABLE: finanzas.categoria_egreso_m5
- ALTER TABLE: finanzas.categoria_egreso_m5
- ALTER TABLE: finanzas.categoria_egreso_m5
- ALTER TABLE: finanzas.categoria_egreso_m5
- ALTER TABLE: finanzas.clasificacion_asociacion_m5
- CREATE INDEX: uq_categoria_egreso_m5_nombre_normalizado
- CREATE INDEX: idx_detalle_compensacion_obligacion
- INSERT: finanzas.config_umbral_reclasificacion_m5
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 016_m5_reasignaciones_envios
**Archivo:** `Controladores/prisma/migrations/016_m5_reasignaciones_envios/migration.sql`
**Tamano:** 96 lineas
**SHA-256:** `464118360b19b24fa276ba0802bd9c5e2d4f5d8d13de8603f999463e97f29a3b`
### Operaciones detectadas
- CREATE TABLE: finanzas.historial_ot_imputacion_m5
- CREATE TABLE: finanzas.solicitud_reasignacion_costo_m5
- CREATE TABLE: finanzas.detalle_reasignacion_costo_m5
- CREATE TABLE: finanzas.comision_bancaria_m5
- CREATE TABLE: finanzas.envio_importacion_m5
- CREATE TABLE: finanzas.envio_orden_compra_m5
- CREATE TABLE: finanzas.costo_envio_importacion_m5
- CREATE TABLE: finanzas.historial_envio_importacion_m5
- CREATE INDEX: idx_historial_ot_imputacion_m5_detalle
- CREATE INDEX: idx_reasignacion_costo_m5_origen_estado
- CREATE INDEX: idx_detalle_reasignacion_m5_solicitud
- CREATE INDEX: idx_comision_bancaria_m5_operacion
- CREATE INDEX: idx_envio_importacion_m5_estado_fecha
- CREATE INDEX: idx_envio_orden_m5_envio
- CREATE INDEX: idx_costo_envio_m5_envio_moneda
- CREATE INDEX: idx_historial_envio_m5_envio
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 017_m5_cierre_envios_caja_chica
**Archivo:** `Controladores/prisma/migrations/017_m5_cierre_envios_caja_chica/migration.sql`
**Tamano:** 74 lineas
**SHA-256:** `53d6d937a86c8e79f89c2246473ffcf2af8bdd41763db1cc236b8a6a00284820`
### Operaciones detectadas
- CREATE TABLE: finanzas.fondo_caja_chica_m5
- CREATE TABLE: finanzas.historial_fondo_caja_chica_m5
- CREATE TABLE: finanzas.gasto_caja_chica_m5
- CREATE TABLE: finanzas.respaldo_gasto_caja_chica_m5
- CREATE TABLE: finanzas.historial_gasto_caja_chica_m5
- ALTER TABLE: finanzas.envio_importacion_m5
- ALTER TABLE: finanzas.envio_importacion_m5
- CREATE INDEX: idx_historial_fondo_caja_m5
- CREATE INDEX: idx_gasto_caja_chica_m5_periodo_estado
- CREATE INDEX: idx_respaldo_gasto_caja_m5
- CREATE INDEX: idx_historial_gasto_caja_m5
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 018_m6_catalogo_empleados
**Archivo:** `Controladores/prisma/migrations/018_m6_catalogo_empleados/migration.sql`
**Tamano:** 5 lineas
**SHA-256:** `cd40032e3ebc14a08917bb326ab0e6be4e316d5b70f4841820be42ba901aa07a`
### Operaciones detectadas
- ALTER TABLE: "finanzas"."empleado"
- ALTER TABLE: "finanzas"."empleado"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 019_m6_alta_empleado
**Archivo:** `Controladores/prisma/migrations/019_m6_alta_empleado/migration.sql`
**Tamano:** 5 lineas
**SHA-256:** `15e13bff90c6ed7365a238dc914d00c3194ce93a78c17115e79371c924b2f997`
### Operaciones detectadas
- ALTER TABLE: "finanzas"."empleado"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 020_m6_relaciones_laborales
**Archivo:** `Controladores/prisma/migrations/020_m6_relaciones_laborales/migration.sql`
**Tamano:** 20 lineas
**SHA-256:** `4e11018a5a8680d19189e97caa105798613be5b9a197cb8994895f51924cbcde`
### Operaciones detectadas
- CREATE TABLE: "finanzas"."relacion_laboral_empleado"
- CREATE INDEX: "idx_relacion_laboral_empleado_fecha"
- CREATE INDEX: "uq_relacion_laboral_vigente_empleado"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 021_m6_perfil_remuneracional
**Archivo:** `Controladores/prisma/migrations/021_m6_perfil_remuneracional/migration.sql`
**Tamano:** 8 lineas
**SHA-256:** `4ccdcc2363acf3669998f484d84c646606f4e5f99ac0402bc4338b168f41c825`
### Operaciones detectadas
- ALTER TABLE: "finanzas"."empleado"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 022_m6_asignaciones_esquema
**Archivo:** `Controladores/prisma/migrations/022_m6_asignaciones_esquema/migration.sql`
**Tamano:** 32 lineas
**SHA-256:** `6af1ca88b114b7188da861d7cec90f27279ad4f16da969ff3fc2f64ac7962f77`
### Operaciones detectadas
- CREATE TABLE: "finanzas"."esquema_remuneracional"
- CREATE TABLE: "finanzas"."asignacion_esquema_remuneracional"
- CREATE INDEX: "idx_esquema_remuneracional_estado_vigencia"
- CREATE INDEX: "idx_asignacion_esquema_empleado"
- CREATE INDEX: "idx_asignacion_esquema_cargo"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 023_m6_asignaciones_haberes
**Archivo:** `Controladores/prisma/migrations/023_m6_asignaciones_haberes/migration.sql`
**Tamano:** 20 lineas
**SHA-256:** `d7b50cd7473a7cbb5992e97da71c729c98b1936adf91d44b785f6068b2e3eb72`
### Operaciones detectadas
- CREATE TABLE: "finanzas"."asignacion_concepto_remuneracion_empleado"
- ALTER TABLE: "finanzas"."concepto_remuneracion"
- CREATE INDEX: "idx_asignacion_concepto_empleado"
- CREATE INDEX: "idx_asignacion_concepto_concepto"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 024_m6_tarifas_esquema
**Archivo:** `Controladores/prisma/migrations/024_m6_tarifas_esquema/migration.sql`
**Tamano:** 20 lineas
**SHA-256:** `1013bed7a6da98a15805b45bf085f262688b42ea1c81b50239186844eae6da0f`
### Operaciones detectadas
- CREATE TABLE: "finanzas"."tarifa_esquema_remuneracional"
- CREATE INDEX: "idx_tarifa_esquema_vigencia"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 025_m6_configuracion_haberes
**Archivo:** `Controladores/prisma/migrations/025_m6_configuracion_haberes/migration.sql`
**Tamano:** 17 lineas
**SHA-256:** `025c0be48b0cecf1111c275b40fba7cd39e07c2638415eb1290e5bda21d75ea7`
### Operaciones detectadas
- CREATE TABLE: "finanzas"."configuracion_concepto_remuneracion"
- CREATE INDEX: "idx_configuracion_concepto_vigencia"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 026_m6_tipo_concepto_remuneracional
**Archivo:** `Controladores/prisma/migrations/026_m6_tipo_concepto_remuneracional/migration.sql`
**Tamano:** 6 lineas
**SHA-256:** `46d0014b6226c4c180519eec79e5216d901f9590f8f3b90292f0741ebdc046b3`
### Operaciones detectadas
- ALTER TABLE: "finanzas"."concepto_remuneracion"
- ALTER TABLE: "finanzas"."concepto_remuneracion"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 027_m6_parametros_configuraciones
**Archivo:** `Controladores/prisma/migrations/027_m6_parametros_configuraciones/migration.sql`
**Tamano:** 66 lineas
**SHA-256:** `2d1dbf2709e30d8b5f34888844d59ed8dd358664d13a85814f1d4b661fca1aa1`
### Operaciones detectadas
- CREATE TABLE: "finanzas"."parametro_remuneracional"
- CREATE TABLE: "finanzas"."tramo_impuesto_renta"
- CREATE TABLE: "finanzas"."configuracion_conservacion_documental"
- ALTER TABLE: "finanzas"."medio_pago"
- CREATE INDEX: "idx_parametro_remuneracional_resolucion"
- CREATE INDEX: "idx_tramo_impuesto_vigencia"
- CREATE INDEX: "idx_conservacion_documental_vigencia"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 028_m6_hechos_remunerables_retrabajo
**Archivo:** `Controladores/prisma/migrations/028_m6_hechos_remunerables_retrabajo/migration.sql`
**Tamano:** 91 lineas
**SHA-256:** `ca1344876010da65a01f5892191c81214ff83962aed5caa799735e2fffb73dbe`
### Operaciones detectadas
- CREATE TABLE: terreno.ejecucion_tarea
- CREATE TABLE: terreno.incidencia_retrabajo_tarea
- CREATE TABLE: finanzas.tratamiento_remuneracional_ejecucion
- ALTER TABLE: finanzas.tarifa_esquema_remuneracional
- CREATE INDEX: idx_ejecucion_tarea_revision_m6
- CREATE INDEX: idx_ejecucion_tarea_ejecutor
- CREATE INDEX: idx_incidencia_retrabajo_pendiente
- CREATE INDEX: idx_incidencia_retrabajo_ejecucion
- CREATE INDEX: idx_tratamiento_remuneracional_estado
- CREATE INDEX: idx_tratamiento_remuneracional_empleado
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 029_m6_auditoria_retrabajos_unidades
**Archivo:** `Controladores/prisma/migrations/029_m6_auditoria_retrabajos_unidades/migration.sql`
**Tamano:** 44 lineas
**SHA-256:** `1a7feee63d3f11433becb2d45737173afc728388798f2df1c58a5a37e4d8ce7d`
### Operaciones detectadas
- CREATE TABLE: finanzas.decision_remuneracional_retrabajo
- ALTER TABLE: finanzas.tratamiento_remuneracional_ejecucion
- ALTER TABLE: terreno.incidencia_retrabajo_tarea
- ALTER TABLE: finanzas.tarifa_esquema_remuneracional
- CREATE INDEX: idx_decision_retrabajo_tratamiento
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 030_m6_componentes_individuales
**Archivo:** `Controladores/prisma/migrations/030_m6_componentes_individuales/migration.sql`
**Tamano:** 99 lineas
**SHA-256:** `ce51127f665ef99734fa81bbcfca9dfe4438ac67759067e621424fe5344c6d90`
### Operaciones detectadas
- CREATE TABLE: finanzas.periodo_remuneracion
- CREATE TABLE: finanzas.remuneracion
- CREATE TABLE: finanzas.componente_remuneracion
- CREATE INDEX: idx_remuneracion_empleado_estado
- CREATE INDEX: idx_componente_remuneracion_contexto
- CREATE INDEX: idx_componente_remuneracion_clave
- CREATE INDEX: uq_componente_externo_version
- CREATE INDEX: uq_componente_prorrateo_activo
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 031_m6_reemplazo_remuneraciones
**Archivo:** `Controladores/prisma/migrations/031_m6_reemplazo_remuneraciones/migration.sql`
**Tamano:** 21 lineas
**SHA-256:** `5d439172502ac043e9aedc46d3ff9cb1a40b8fc01c996de132a453bb79c46e38`
### Operaciones detectadas
- ALTER TABLE: finanzas.remuneracion
- CREATE INDEX: uq_remuneracion_actual_periodo_empleado
- CREATE INDEX: idx_remuneracion_periodo_empleado
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 032_m6_ciclo_mensual_remuneraciones
**Archivo:** `Controladores/prisma/migrations/032_m6_ciclo_mensual_remuneraciones/migration.sql`
**Tamano:** 77 lineas
**SHA-256:** `e97597fe19c327fd5bba87e874e432fb64f6f46af7c64b81dc9ce5b8ab0d18db`
### Operaciones detectadas
- ALTER TABLE: finanzas.periodo_remuneracion
- ALTER TABLE: finanzas.remuneracion
- ALTER TABLE: finanzas.componente_remuneracion
- CREATE INDEX: uq_remuneracion_actual_periodo_empleado
- CREATE INDEX: uq_componente_automatico_clave
- CREATE INDEX: idx_periodo_remuneracion_cierre
- CREATE INDEX: idx_remuneracion_reapertura
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 033_m6_ajustes_pagos_remuneraciones
**Archivo:** `Controladores/prisma/migrations/033_m6_ajustes_pagos_remuneraciones/migration.sql`
**Tamano:** 120 lineas
**SHA-256:** `1ed82b92467f8677216c1c4be99b135a0c752859a56650a38a609fe35aeb25cf`
### Operaciones detectadas
- CREATE TABLE: finanzas.ajuste_posterior_remuneracion
- CREATE TABLE: finanzas.regularizacion_extraordinaria
- CREATE TABLE: finanzas.anticipo_remuneracion
- CREATE TABLE: finanzas.pago_remuneracion
- CREATE INDEX: idx_ajuste_posterior_remuneracion
- CREATE INDEX: idx_ajuste_posterior_empleado_periodo
- CREATE INDEX: idx_regularizacion_extraordinaria_estado
- CREATE INDEX: idx_anticipo_empleado_periodo
- CREATE INDEX: idx_pago_remuneracion_origen
- CREATE INDEX: uq_pago_remuneracion_confirmado_origen
- CREATE TRIGGER: tr_validar_origen_pago_remuneracion
- CREATE TRIGGER: tr_proteger_pago_remuneracion_confirmado
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 034_m6_compatibilidad_anulacion_pago
**Archivo:** `Controladores/prisma/migrations/034_m6_compatibilidad_anulacion_pago/migration.sql`
**Tamano:** 80 lineas
**SHA-256:** `300cf45e7a1da9e78bc1be78d1e1257fd80d0f29ae61603c3bb531ff4bd1dab3`
### Operaciones detectadas
- ALTER TABLE: finanzas.pago_remuneracion
- ALTER TABLE: finanzas.pago_remuneracion
- CREATE TRIGGER: tr_proteger_borrado_remuneracion_pagada
- CREATE TRIGGER: tr_proteger_borrado_anticipo_pagado
- CREATE TRIGGER: tr_proteger_borrado_regularizacion_pagada
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 035_m6_honorarios_historial_reversiones
**Archivo:** `Controladores/prisma/migrations/035_m6_honorarios_historial_reversiones/migration.sql`
**Tamano:** 104 lineas
**SHA-256:** `11a313f6f64812c194868a50c965ced4be054d1e301a9d7e21c886097263cd93`
### Operaciones detectadas
- CREATE TABLE: finanzas.prestador_honorarios
- CREATE TABLE: finanzas.boleta_honorarios
- CREATE TABLE: finanzas.reversion_pago_remuneracion
- ALTER TABLE: finanzas.pago_remuneracion
- ALTER TABLE: finanzas.pago_remuneracion
- CREATE INDEX: idx_boleta_honorarios_estado_fecha
- CREATE INDEX: idx_reversion_pago_remuneracion_pago
- CREATE TRIGGER: tr_proteger_borrado_boleta_pagada
- CREATE TRIGGER: tr_validar_reversion_pago_remuneracion
- CREATE TRIGGER: tr_proteger_reversion_pago_remuneracion
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 036_m6_repagos_reversiones
**Archivo:** `Controladores/prisma/migrations/036_m6_repagos_reversiones/migration.sql`
**Tamano:** 105 lineas
**SHA-256:** `c2b06e502d0d75637c5d69f4be459713faa896802a6c163b5a8b1f13b9fb87f8`
### Operaciones detectadas
- CREATE TRIGGER: tr_validar_saldo_pago_remuneracion
- CREATE TRIGGER: tr_proteger_boleta_honorarios_confirmada
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 037_m6_terreno_visitas
**Archivo:** `Controladores/prisma/migrations/037_m6_terreno_visitas/migration.sql`
**Tamano:** 8 lineas
**SHA-256:** `3a57a81373cd42bb08702c05b036a6a81cb96456ac9c7919d587017de325697d`
### Operaciones detectadas
- ALTER TABLE: terreno.servicio_terreno
- ALTER TABLE: terreno.servicio_terreno
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 038_m6_terreno_tarea_orden_trabajo
**Archivo:** `Controladores/prisma/migrations/038_m6_terreno_tarea_orden_trabajo/migration.sql`
**Tamano:** 12 lineas
**SHA-256:** `dc6347d054068d599d6d182059d48fbd2e239cc92a5593f2525342bd7cddb3f1`
### Operaciones detectadas
- ALTER TABLE: terreno.tarea
- ALTER TABLE: terreno.tarea
- CREATE INDEX: idx_tarea_orden_trabajo
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 039_m6_deducciones_recurrentes
**Archivo:** `Controladores/prisma/migrations/039_m6_deducciones_recurrentes/migration.sql`
**Tamano:** 3 lineas
**SHA-256:** `4fdac9a82cf1c62b45102e6255ca8fc0e136ebe5038272772e89756423e9cb24`
### Operaciones detectadas
- ALTER TABLE: finanzas.asignacion_concepto_remuneracion_empleado
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 040_m7_parametros_dashboard
**Archivo:** `Controladores/prisma/migrations/040_m7_parametros_dashboard/migration.sql`
**Tamano:** 6 lineas
**SHA-256:** `62cb311640d685e9181a06f9db1068511b7328a9b81b95b38150b459ee267f58`
### Operaciones detectadas
- ALTER TABLE: "finanzas"."parametro_remuneracional"
- ALTER TABLE: "finanzas"."parametro_remuneracional"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 041_m7_delta_controlado
**Archivo:** `Controladores/prisma/migrations/041_m7_delta_controlado/migration.sql`
**Tamano:** 31 lineas
**SHA-256:** `3693556c962648310aeb82158b0f8f50d2b21d791faafab985070d2718ac2b26`
### Operaciones detectadas
- CREATE TABLE: "finanzas"."detalle_material_orden_compra_m5"
- ALTER TABLE: "finanzas"."orden_compra_servicio_m5"
- ALTER TABLE: "finanzas"."orden_compra_servicio_m5"
- ALTER TABLE: "terreno"."obra"
- CREATE INDEX: "idx_ocs_m5_contexto"
- CREATE INDEX: "idx_detalle_material_oc_m5_material_fecha"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 042_m8_solicitudes_crediticias
**Archivo:** `Controladores/prisma/migrations/042_m8_solicitudes_crediticias/migration.sql`
**Tamano:** 45 lineas
**SHA-256:** `7b5d325464440a5061531b2a2d2be55a7a94da66ba404130b052ec44f78af697`
### Operaciones detectadas
- CREATE TABLE: "finanzas"."solicitud_crediticia_m8"
- CREATE INDEX: "idx_solicitud_crediticia_m8_bandeja"
- CREATE INDEX: "idx_solicitud_crediticia_m8_cliente"
- CREATE INDEX: "idx_solicitud_crediticia_m8_solicitante"
- INSERT: "terreno"."permiso"
- INSERT: "terreno"."perfil_permiso"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 043_m8_credito_core
**Archivo:** `Controladores/prisma/migrations/043_m8_credito_core/migration.sql`
**Tamano:** 116 lineas
**SHA-256:** `b80579323d3953835918ce8c81c37c0a97f7ba20454ff103e2dcfd8cab2b6943`
### Operaciones detectadas
- CREATE TABLE: "finanzas"."condicion_crediticia_m8"
- CREATE TABLE: "finanzas"."limite_global_credito_m8"
- CREATE TABLE: "finanzas"."resolucion_solicitud_crediticia_m8"
- CREATE TABLE: "finanzas"."compromiso_credito_m8"
- CREATE TABLE: "finanzas"."reduccion_compromiso_credito_m8"
- CREATE TABLE: "finanzas"."evento_credito_m8"
- ALTER TABLE: "finanzas"."solicitud_crediticia_m8"
- CREATE INDEX: "idx_limite_global_credito_m8_vigencia"
- CREATE INDEX: "idx_compromiso_credito_m8_cliente_estado"
- CREATE INDEX: "idx_reduccion_credito_m8_compromiso"
- CREATE INDEX: "idx_evento_credito_m8_cliente_fecha"
- INSERT: "terreno"."permiso"
- INSERT: "terreno"."perfil_permiso"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 044_m9_auditoria_core
**Archivo:** `Controladores/prisma/migrations/044_m9_auditoria_core/migration.sql`
**Tamano:** 49 lineas
**SHA-256:** `c427f47c220f743145c10287269b08bbffe146fea8fe1e7be6f639bda73ecce5`
### Operaciones detectadas
- CREATE TABLE: "finanzas"."evento_auditoria_m9"
- CREATE INDEX: "idx_m9_ocurrencia"
- CREATE INDEX: "idx_m9_clasificacion"
- CREATE INDEX: "idx_m9_entidad"
- CREATE INDEX: "idx_m9_productor_secuencia"
- CREATE TRIGGER: "trg_m9_evento_inmutable"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 045_m9_permisos_auditoria
**Archivo:** `Controladores/prisma/migrations/045_m9_permisos_auditoria/migration.sql`
**Tamano:** 29 lineas
**SHA-256:** `d03c3cb61f01dee308cf6dc74d5d0534d05bc5b0872ebc7fd67ef1f4879e66e7`
### Operaciones detectadas
- INSERT: "terreno"."permiso"
- INSERT: "terreno"."perfil_permiso"
- INSERT: "terreno"."permiso_dependencia"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 046_m9_retry_politicas
**Archivo:** `Controladores/prisma/migrations/046_m9_retry_politicas/migration.sql`
**Tamano:** 96 lineas
**SHA-256:** `2b8d0172a5aefd2638a62e97248eabe55c354597957f7f674edf4321f6a46e54`
### Operaciones detectadas
- CREATE TABLE: "finanzas"."pendiente_evento_m9"
- CREATE TABLE: "finanzas"."intento_retry_m9"
- CREATE TABLE: "finanzas"."configuracion_alerta_m9"
- CREATE TABLE: "finanzas"."categoria_retencion_m9"
- CREATE TABLE: "finanzas"."politica_tratamiento_m9"
- CREATE TABLE: "finanzas"."tratamiento_privacidad_m9"
- CREATE INDEX: "idx_m9_pendiente_elegible"
- CREATE INDEX: "idx_m9_pendiente_productor"
- CREATE INDEX: "idx_m9_intento_estado"
- CREATE INDEX: "idx_m9_alerta_vigente"
- CREATE INDEX: "idx_m9_politica_vigente"
- CREATE INDEX: "idx_m9_tratamiento_evento"
- CREATE TRIGGER: "trg_m9_politica_inmutable"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 047_m6_prevision_legal_rut
**Archivo:** `Controladores/prisma/migrations/047_m6_prevision_legal_rut/migration.sql`
**Tamano:** 69 lineas
**SHA-256:** `2d7fc3b136ce38129968a9fce869326b98a27d9afc57314a8bb171761aa57a35`
### Operaciones detectadas
- CREATE TABLE: "finanzas"."cotizacion_salud_empleado"
- ALTER TABLE: "finanzas"."empleado"
- ALTER TABLE: "finanzas"."remuneracion"
- CREATE INDEX: "uq_cotizacion_salud_empleado_vigencia"
- CREATE INDEX: "idx_cotizacion_salud_empleado_resolucion"
- INSERT: "finanzas"."parametro_remuneracional"
- INSERT: "finanzas"."tramo_impuesto_renta"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 048_m6_componentes_previsionales
**Archivo:** `Controladores/prisma/migrations/048_m6_componentes_previsionales/migration.sql`
**Tamano:** 28 lineas
**SHA-256:** `81500ca1968a2aaed2eeb7451116491ba094ff17a6ee224ca610ad79a73c2793`
### Operaciones detectadas
- ALTER TABLE: "finanzas"."componente_remuneracion"
- ALTER TABLE: "finanzas"."componente_remuneracion"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 049_m6_snapshot_previsional_historial
**Archivo:** `Controladores/prisma/migrations/049_m6_snapshot_previsional_historial/migration.sql`
**Tamano:** 2 lineas
**SHA-256:** `c72493ff7c6de4c4d2fbd4e92034be168ad52bc0335a7b5195243db801636433`
### Operaciones detectadas
- ALTER TABLE: "finanzas"."remuneracion"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 050_m6_catalogos_previsionales
**Archivo:** `Controladores/prisma/migrations/050_m6_catalogos_previsionales/migration.sql`
**Tamano:** 32 lineas
**SHA-256:** `88303cc5b7be87f5604d4d6cf254070b65f3353f196326fbc98311ba56c497b6`
### Operaciones detectadas
- INSERT: "finanzas"."afp"
- INSERT: "finanzas"."prevision_salud"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 051_m7_proyeccion_financiera
**Archivo:** `Controladores/prisma/migrations/051_m7_proyeccion_financiera/migration.sql`
**Tamano:** 28 lineas
**SHA-256:** `e61b7a455e5e5091d0406b9e883f4c19531c47f6738891cccf27336f65103c5c`
### Operaciones detectadas
- CREATE TABLE: "finanzas"."proyeccion_financiera_m7"
- CREATE INDEX: "idx_proyeccion_m7_periodo"
- CREATE INDEX: "idx_proyeccion_m7_moneda_categoria"
- CREATE INDEX: "uq_proyeccion_m7_activa"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 052_incidencias_terreno_revision
**Archivo:** `Controladores/prisma/migrations/052_incidencias_terreno_revision/migration.sql`
**Tamano:** 40 lineas
**SHA-256:** `684761b6dbc29a2e561512df8915b11e82b691db87775ae4e02486d16a09a7d3`
### Operaciones detectadas
- CREATE TABLE: "terreno"."categoria_incidencia_terreno"
- ALTER TABLE: "terreno"."incidencia_retrabajo_tarea"
- ALTER TABLE: "terreno"."evidencia_terreno"
- CREATE INDEX: "idx_incidencia_categoria_revision"
- CREATE INDEX: "idx_incidencia_area"
- CREATE INDEX: "idx_evidencia_terreno_incidencia"
- INSERT: "terreno"."categoria_incidencia_terreno"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 053_m7_saldos_bancarios
**Archivo:** `Controladores/prisma/migrations/053_m7_saldos_bancarios/migration.sql`
**Tamano:** 50 lineas
**SHA-256:** `a6d04d5ba48bf3bfca09ef6b1d89163d802cfd1e9223419c663041cdc1ee7d08`
### Operaciones detectadas
- CREATE TABLE: "finanzas"."cuenta_bancaria_m7"
- CREATE TABLE: "finanzas"."saldo_inicial_bancario_m7"
- ALTER TABLE: "finanzas"."movimiento_bancario"
- ALTER TABLE: "finanzas"."movimiento_bancario"
- ALTER TABLE: "finanzas"."movimiento_bancario"
- ALTER TABLE: "finanzas"."cuenta_bancaria_m7"
- ALTER TABLE: "finanzas"."cuenta_bancaria_m7"
- ALTER TABLE: "finanzas"."cuenta_bancaria_m7"
- ALTER TABLE: "finanzas"."saldo_inicial_bancario_m7"
- ALTER TABLE: "finanzas"."saldo_inicial_bancario_m7"
- ALTER TABLE: "finanzas"."saldo_inicial_bancario_m7"
- ALTER TABLE: "finanzas"."movimiento_bancario"
- CREATE INDEX: "uq_cuenta_bancaria_m7_identidad"
- CREATE INDEX: "idx_cuenta_bancaria_m7_estado_moneda"
- CREATE INDEX: "uq_saldo_inicial_bancario_m7_cuenta_corte"
- CREATE INDEX: "idx_saldo_inicial_bancario_m7_corte_estado"
- CREATE INDEX: "idx_movimiento_bancario_cuenta_fecha_m7"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 054_mantenedor_productos_comerciales
**Archivo:** `Controladores/prisma/migrations/054_mantenedor_productos_comerciales/migration.sql`
**Tamano:** 152 lineas
**SHA-256:** `c097c7e23479a4df05a07c86d533641f08b6105099a8bcc9ddc0e9da8bf87d1d`
### Operaciones detectadas
- CREATE TABLE: "finanzas"."familia_producto_comercial"
- CREATE TABLE: "finanzas"."historial_familia_producto_comercial"
- CREATE TABLE: "finanzas"."extension_producto_comercial"
- CREATE TABLE: "finanzas"."producto_comercial_version"
- CREATE TABLE: "finanzas"."historial_producto_comercial"
- CREATE INDEX: "familia_producto_comercial_estado_nombre_idx"
- CREATE INDEX: "historial_familia_producto_fecha_idx"
- CREATE INDEX: "extension_producto_familia_estado_idx"
- CREATE INDEX: "extension_producto_nombre_idx"
- CREATE INDEX: "producto_comercial_version_fecha_idx"
- CREATE INDEX: "historial_producto_comercial_fecha_idx"
- CREATE TRIGGER: "trg_producto_comercial_version_inmutable"
- INSERT: "terreno"."permiso"
- INSERT: "terreno"."permiso_dependencia"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 055_nucleo_documental_portable
**Archivo:** `Controladores/prisma/migrations/055_nucleo_documental_portable/migration.sql`
**Tamano:** 263 lineas
**SHA-256:** `bd712f848a59102bda52c196b74fce6f63839171c85407f5ae68b3957737cd66`
### Operaciones detectadas
- CREATE TABLE: "finanzas"."documento_logico"
- CREATE TABLE: "finanzas"."version_documento"
- CREATE TABLE: "finanzas"."variante_documento"
- CREATE TABLE: "finanzas"."intencion_carga_documental"
- CREATE TABLE: "finanzas"."producto_comercial_documento"
- CREATE TABLE: "finanzas"."evento_operacional_documental"
- CREATE INDEX: "idx_documento_logico_clasificacion_estado"
- CREATE INDEX: "idx_documento_logico_conservacion"
- CREATE INDEX: "idx_version_documento_historial"
- CREATE INDEX: "idx_version_documento_sha256"
- CREATE INDEX: "idx_intencion_documental_estado_expira"
- CREATE INDEX: "uq_producto_documento_principal_activa"
- CREATE INDEX: "idx_producto_documento_presentacion"
- CREATE INDEX: "idx_producto_documento_documento"
- CREATE INDEX: "idx_evento_documental_pendiente"
- CREATE INDEX: "idx_evento_documental_documento"
- CREATE TRIGGER: "trg_documento_logico_transicion"
- CREATE TRIGGER: "trg_version_documento_reglas"
- CREATE TRIGGER: "trg_intencion_documental_transicion"
- CREATE TRIGGER: "trg_variante_documental_sin_ciclos"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 056_cierre_seguridad_documental
**Archivo:** `Controladores/prisma/migrations/056_cierre_seguridad_documental/migration.sql`
**Tamano:** 40 lineas
**SHA-256:** `ee45e9c25ce63bc94b4f078fb4e31fa2cd4b7fc93c1e89a6525d70b8fbef57d9`
### Operaciones detectadas
- ALTER TABLE: "finanzas"."intencion_carga_documental"
- ALTER TABLE: "finanzas"."intencion_carga_documental"
- ALTER TABLE: "finanzas"."evento_operacional_documental"
- ALTER TABLE: "finanzas"."evento_operacional_documental"
- CREATE INDEX: "idx_intencion_documental_documento_estado"
- CREATE INDEX: "uq_evento_documental_lease_token"
- CREATE INDEX: "idx_evento_documental_lease"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 057_intencion_documental_documento_obligatorio
**Archivo:** `Controladores/prisma/migrations/057_intencion_documental_documento_obligatorio/migration.sql`
**Tamano:** 6 lineas
**SHA-256:** `8491757582540d984589f7c608b7ee8127d4616642b99f3bee5773cc385b0d59`
### Operaciones detectadas
- ALTER TABLE: "finanzas"."intencion_carga_documental"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 058_areas_trabajo_empleados
**Archivo:** `Controladores/prisma/migrations/058_areas_trabajo_empleados/migration.sql`
**Tamano:** 38 lineas
**SHA-256:** `42cda834d40dcbb08e780112856fbf00aa0ecfe1d12aa4a8b6c4d1042a53bf5c`
### Operaciones detectadas
- CREATE TABLE: "finanzas"."asignacion_area_empleado"
- CREATE INDEX: "uq_area_trabajo_nombre_normalizado"
- CREATE INDEX: "uq_asignacion_area_empleado_vigente"
- CREATE INDEX: "idx_asignacion_area_empleado_historial"
- CREATE INDEX: "idx_asignacion_area_disponibilidad"
- INSERT: "terreno"."area_trabajo"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 059_descripcion_area_trabajo_finanzas
**Archivo:** `Controladores/prisma/migrations/059_descripcion_area_trabajo_finanzas/migration.sql`
**Tamano:** 20 lineas
**SHA-256:** `37931e8959894392906a7d784c0b11918a0f5d7daf5c0a6e50d935efe0971d3e`
### Operaciones detectadas
- CREATE TABLE: "finanzas"."configuracion_area_trabajo"
- INSERT: "finanzas"."configuracion_area_trabajo"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 060_catalogo_tareas_plantillas_fabricacion
**Archivo:** `Controladores/prisma/migrations/060_catalogo_tareas_plantillas_fabricacion/migration.sql`
**Tamano:** 84 lineas
**SHA-256:** `7045d1552a7c051caf15d89046cd6d6f0953821df6bda1a79bc055d38253a031`
### Operaciones detectadas
- CREATE TABLE: "finanzas"."catalogo_tarea_fabricacion"
- CREATE TABLE: "finanzas"."plantilla_fabricacion_familia"
- CREATE TABLE: "finanzas"."version_plantilla_fabricacion"
- CREATE TABLE: "finanzas"."ajuste_producto_plantilla_fabricacion"
- CREATE INDEX: "catalogo_tarea_fabricacion_nombre_area_uq"
- CREATE INDEX: "catalogo_tarea_fabricacion_area_estado_idx"
- CREATE INDEX: "catalogo_tarea_fabricacion_estado_nombre_idx"
- CREATE INDEX: "version_plantilla_historial_idx"
- CREATE INDEX: "ajuste_plantilla_raiz_estado_idx"
- CREATE TRIGGER: "trg_version_plantilla_fabricacion_inmutable"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 061_ot_por_unidad_cotizada
**Archivo:** `Controladores/prisma/migrations/061_ot_por_unidad_cotizada/migration.sql`
**Tamano:** 49 lineas
**SHA-256:** `e901025f966e9958999b9cb5ff1f35f4a2f80e23583b3ebf133a0145835431ad`
### Operaciones detectadas
- CREATE TABLE: "finanzas"."unidad_fisica_orden_trabajo"
- CREATE TABLE: "finanzas"."historial_unidad_fisica_ot"
- CREATE INDEX: "unidad_fisica_ot_cotizacion_estado_idx"
- CREATE INDEX: "unidad_fisica_ot_producto_familia_idx"
- CREATE INDEX: "historial_unidad_fisica_ot_fecha_idx"
- CREATE TRIGGER: "trg_historial_unidad_fisica_ot_inmutable"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 062_gestion_rectificacion_ot
**Archivo:** `Controladores/prisma/migrations/062_gestion_rectificacion_ot/migration.sql`
**Tamano:** 71 lineas
**SHA-256:** `7a29b2f9414bb633119e0fc1f9977a97ee7e8ed280850ba18109e9d38d072d7f`
### Operaciones detectadas
- CREATE TABLE: "finanzas"."rectificacion_orden_trabajo"
- CREATE TABLE: "finanzas"."version_rectificacion_orden_trabajo"
- CREATE TABLE: "finanzas"."historial_rectificacion_orden_trabajo"
- ALTER TABLE: "finanzas"."unidad_fisica_orden_trabajo"
- CREATE INDEX: "rectificacion_ot_estado_empleado_idx"
- CREATE INDEX: "historial_rectificacion_fecha_idx"
- CREATE TRIGGER: "trg_version_rectificacion_ot_inmutable"
- CREATE TRIGGER: "trg_historial_rectificacion_ot_inmutable"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 063_aprobacion_rectificacion_liberacion_ot
**Archivo:** `Controladores/prisma/migrations/063_aprobacion_rectificacion_liberacion_ot/migration.sql`
**Tamano:** 58 lineas
**SHA-256:** `cf1d3ed7c68dace9ed05929d086efd9c5092564fd7f0ddd722bf7b077f4fa52f`
### Operaciones detectadas
- CREATE TABLE: "finanzas"."decision_rectificacion_orden_trabajo"
- CREATE TABLE: "finanzas"."liberacion_orden_trabajo"
- CREATE TABLE: "finanzas"."tarea_ejecutable_unidad_ot"
- CREATE INDEX: "decision_rectificacion_fecha_idx"
- CREATE INDEX: "tarea_ejecutable_secuencia_idx"
- CREATE TRIGGER: "trg_decision_rectificacion_ot_inmutable"
- CREATE TRIGGER: "trg_liberacion_ot_inmutable"
- CREATE TRIGGER: "trg_origen_tarea_ejecutable_ot_inmutable"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 064_gestion_dinamica_produccion_ot
**Archivo:** `Controladores/prisma/migrations/064_gestion_dinamica_produccion_ot/migration.sql`
**Tamano:** 164 lineas
**SHA-256:** `44fe0ccb11843af54052033c583e983d978eee5b329b37169065cb410a40a3c5`
### Operaciones detectadas
- CREATE TABLE: "finanzas"."estado_tarea_produccion_ot"
- CREATE TABLE: "finanzas"."historial_cambio_produccion_ot"
- CREATE TABLE: "finanzas"."etapa_adicional_orden_trabajo"
- CREATE TABLE: "finanzas"."atribucion_ejecucion_tarea_ot"
- CREATE TABLE: "finanzas"."solicitud_correccion_tecnica_ot"
- CREATE TABLE: "finanzas"."aplicacion_revision_tecnica_ot"
- CREATE TABLE: "finanzas"."cierre_orden_trabajo_produccion"
- ALTER TABLE: "finanzas"."unidad_fisica_orden_trabajo"
- ALTER TABLE: "finanzas"."tarea_ejecutable_unidad_ot"
- ALTER TABLE: "finanzas"."tarea_ejecutable_unidad_ot"
- CREATE INDEX: "tarea_ejecutable_unidad_ot_clave_idempotencia_key"
- CREATE INDEX: "idx_estado_tarea_area_estado"
- CREATE INDEX: "idx_estado_tarea_empleado_estado"
- CREATE INDEX: "idx_historial_produccion_unidad_fecha"
- CREATE INDEX: "idx_historial_produccion_tarea_fecha"
- CREATE INDEX: "idx_atribucion_empleado_fecha"
- CREATE INDEX: "idx_solicitud_correccion_unidad_fecha"
- CREATE TRIGGER: "trg_historial_produccion_ot_inmutable"
- CREATE TRIGGER: "trg_cierre_produccion_ot_inmutable"
- CREATE TRIGGER: "trg_aplicacion_revision_ot_inmutable"
- INSERT: "finanzas"."estado_tarea_produccion_ot"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 065_catalogos_comerciales_cotizacion
**Archivo:** `Controladores/prisma/migrations/065_catalogos_comerciales_cotizacion/migration.sql`
**Tamano:** 274 lineas
**SHA-256:** `61ffe12407a4165b8fc9ca8141c8a530f46e910c8768d1eb9d664cd5a0ad5d30`
### Operaciones detectadas
- CREATE TABLE: "finanzas"."precio_producto_comercial"
- CREATE TABLE: "finanzas"."opcional_comercial"
- CREATE TABLE: "finanzas"."compatibilidad_opcional_producto"
- CREATE TABLE: "finanzas"."precio_opcional_comercial"
- CREATE TABLE: "finanzas"."tarifa_instalacion_comercial"
- CREATE TABLE: "finanzas"."condicion_comercial"
- CREATE TABLE: "finanzas"."condicion_comercial_version"
- ALTER TABLE: "finanzas"."cotizacion"
- ALTER TABLE: "finanzas"."detalle_cotizacion"
- ALTER TABLE: "finanzas"."precio_producto_comercial"
- ALTER TABLE: "finanzas"."precio_opcional_comercial"
- ALTER TABLE: "finanzas"."tarifa_instalacion_comercial"
- ALTER TABLE: "finanzas"."condicion_comercial_version"
- ALTER TABLE: "finanzas"."cotizacion"
- ALTER TABLE: "finanzas"."detalle_cotizacion"
- CREATE INDEX: "idx_precio_producto_vigencia"
- CREATE INDEX: "idx_opcional_comercial_estado"
- CREATE INDEX: "idx_compatibilidad_opcional_estado"
- CREATE INDEX: "idx_precio_opcional_vigencia"
- CREATE INDEX: "idx_tarifa_instalacion_busqueda"
- CREATE INDEX: "idx_condicion_comercial_segmento"
- CREATE INDEX: "idx_condicion_version_vigencia"
- CREATE INDEX: "idx_cotizacion_segmento_estado"
- CREATE INDEX: "idx_cotizacion_tarifa_instalacion"
- CREATE INDEX: "idx_cotizacion_condicion_comercial"
- CREATE INDEX: "idx_detalle_cotizacion_producto_version"
- CREATE INDEX: "idx_detalle_cotizacion_precio_comercial"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 066_versionado_documental_cotizacion
**Archivo:** `Controladores/prisma/migrations/066_versionado_documental_cotizacion/migration.sql`
**Tamano:** 325 lineas
**SHA-256:** `580c79bce9906f78b36b2f4a06652aa8287e6121402c523d97f9fb8e6b5f68a9`
### Operaciones detectadas
- CREATE TABLE: "finanzas"."plantilla_documental_comercial"
- CREATE TABLE: "finanzas"."plantilla_documental_version"
- CREATE TABLE: "finanzas"."carta_comercial_b2c"
- CREATE TABLE: "finanzas"."carta_comercial_b2c_version"
- CREATE TABLE: "finanzas"."carta_comercial_b2c_version_producto"
- CREATE TABLE: "finanzas"."carta_comercial_b2c_version_fotografia"
- ALTER TABLE: "finanzas"."cotizacion_version"
- CREATE INDEX: "uq_cotizacion_version_comercial"
- CREATE INDEX: "uq_cotizacion_version_documento"
- CREATE INDEX: "uq_cotizacion_version_idempotencia"
- CREATE INDEX: "idx_cotizacion_version_fecha"
- CREATE INDEX: "idx_cotizacion_version_estado_documental"
- CREATE INDEX: "idx_plantilla_documental_tipo"
- CREATE INDEX: "idx_plantilla_documental_version_estado"
- CREATE INDEX: "idx_carta_b2c_estado"
- CREATE INDEX: "idx_carta_b2c_version_estado"
- CREATE INDEX: "idx_carta_b2c_fotografia_orden"
- CREATE TRIGGER: "tr_cotizacion_version_documento_disponible"
- CREATE TRIGGER: "tr_carta_b2c_documento_disponible"
- CREATE TRIGGER: "tr_plantilla_documental_version_inmutable"
- CREATE TRIGGER: "tr_condicion_comercial_version_inmutable"
- CREATE TRIGGER: "tr_carta_b2c_version_inmutable"
- CREATE TRIGGER: "tr_cotizacion_version_comercial_inmutable"
- CREATE TRIGGER: "tr_carta_b2c_fotografia_autorizada"
- CREATE TRIGGER: "tr_carta_b2c_producto_coherente"
- CREATE TRIGGER: "tr_carta_b2c_producto_inmutable"
- CREATE TRIGGER: "tr_carta_b2c_fotografia_inmutable"
- CREATE TRIGGER: "tr_cotizacion_exigir_documento_emitido"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 067_alternativas_b2c
**Archivo:** `Controladores/prisma/migrations/067_alternativas_b2c/migration.sql`
**Tamano:** 231 lineas
**SHA-256:** `5711b8478f8e6430f7b171e01e4cabf64f6c33a6da3ee6fd2e151819e0eb03c0`
### Operaciones detectadas
- CREATE TABLE: "finanzas"."grupo_alternativas_b2c"
- CREATE TABLE: "finanzas"."alternativa_b2c"
- CREATE TABLE: "finanzas"."alternativa_b2c_opcional"
- CREATE TABLE: "finanzas"."historial_decision_alternativa_b2c"
- ALTER TABLE: "finanzas"."detalle_cotizacion"
- CREATE INDEX: "idx_grupo_alternativas_b2c_estado"
- CREATE INDEX: "uq_alternativa_b2c_aceptada_grupo"
- CREATE INDEX: "idx_alternativa_b2c_estado"
- CREATE INDEX: "idx_alternativa_b2c_producto_version"
- CREATE INDEX: "idx_historial_alternativa_b2c_fecha"
- CREATE TRIGGER: "tr_grupo_alternativas_exige_b2c"
- CREATE TRIGGER: "tr_alternativa_b2c_integridad"
- CREATE TRIGGER: "tr_alternativa_b2c_opcional_integridad"
- CREATE TRIGGER: "tr_detalle_cotizacion_alternativa_aceptada"
- CREATE TRIGGER: "tr_historial_alternativa_b2c_inmutable"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 068_permisos_comerciales_documentales_c2_6
**Archivo:** `Controladores/prisma/migrations/068_permisos_comerciales_documentales_c2_6/migration.sql`
**Tamano:** 72 lineas
**SHA-256:** `2ae5a72732ea9574b1eb34613d5f16f3ea6e487e29808cbe2aab8b1e28e19494`
### Operaciones detectadas
- CREATE TABLE: "finanzas"."idempotencia_operacion_comercial"
- CREATE INDEX: "idx_idempotencia_operacion_actor"
- INSERT: "terreno"."permiso"
- INSERT: "terreno"."permiso_dependencia"
- INSERT: "terreno"."permiso_dependencia"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 069_contactos_servicios_alternativas_c3_3
**Archivo:** `Controladores/prisma/migrations/069_contactos_servicios_alternativas_c3_3/migration.sql`
**Tamano:** 161 lineas
**SHA-256:** `0d70ce338651afaf33ce9b8a65c9922c1ff3dd5ac7c6552bc163a97163e9ec24`
### Operaciones detectadas
- CREATE TABLE: "finanzas"."contacto_cotizacion_b2b"
- CREATE TABLE: "finanzas"."servicio_comercial"
- CREATE TABLE: "finanzas"."precio_servicio_comercial"
- CREATE TABLE: "finanzas"."detalle_servicio_cotizacion"
- CREATE TABLE: "finanzas"."historial_seleccion_alternativa_b2c"
- ALTER TABLE: "finanzas"."precio_servicio_comercial"
- ALTER TABLE: "finanzas"."grupo_alternativas_b2c"
- CREATE INDEX: "idx_contacto_cotizacion_b2b_estado"
- CREATE INDEX: "uq_contacto_cotizacion_b2b_principal"
- CREATE INDEX: "idx_servicio_comercial_b2b"
- CREATE INDEX: "idx_precio_servicio_vigencia"
- CREATE INDEX: "idx_detalle_servicio_cotizacion"
- CREATE INDEX: "idx_detalle_servicio_catalogo_precio"
- CREATE INDEX: "idx_historial_seleccion_fecha"
- CREATE TRIGGER: "tr_contacto_cotizacion_b2b"
- CREATE TRIGGER: "tr_detalle_servicio_c3_3"
- CREATE TRIGGER: "tr_grupo_seleccion_alternativa_b2c"
- CREATE TRIGGER: "tr_historial_seleccion_inmutable"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 070_permisos_documentales_c4_2
**Archivo:** `Controladores/prisma/migrations/070_permisos_documentales_c4_2/migration.sql`
**Tamano:** 43 lineas
**SHA-256:** `ca42342e520fdcf878ea1b35ed476f5e5264ebf789d73b3799d6bd830f83b139`
### Operaciones detectadas
- INSERT: "terreno"."permiso"
- INSERT: "terreno"."permiso_dependencia"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.
## 071_integracion_obra_proyecto_cotizacion
**Archivo:** `Controladores/prisma/migrations/071_integracion_obra_proyecto_cotizacion/migration.sql`
**Tamano:** 56 lineas
**SHA-256:** `8879d3858795d4a6a28f875d903fccfa3a90fcee05cc93dbdb68e3441f8483c8`
### Operaciones detectadas
- CREATE TABLE: "terreno"."proyecto_obra"
- ALTER TABLE: "finanzas"."cotizacion"
- ALTER TABLE: "terreno"."obra"
- ALTER TABLE: "terreno"."proyecto"
- ALTER TABLE: "finanzas"."cotizacion"
- ALTER TABLE: "terreno"."proyecto"
- CREATE INDEX: "uq_obra_clave_ubicacion"
- CREATE INDEX: "uq_proyecto_cotizacion_origen"
- CREATE INDEX: "uq_proyecto_obra_principal"
- CREATE INDEX: "idx_cotizacion_obra_contexto"
- CREATE INDEX: "idx_proyecto_cliente_fecha"
- CREATE INDEX: "idx_proyecto_obra_obra"
### Compatibilidad y rollback conceptual
Revisar nullable, defaults, FKs, triggers y datos heredados antes de aplicar. El rollback conceptual requiere restaurar respaldo o una migracion compensatoria evaluada; nunca borrar el directorio.

## Fuentes de verdad consultadas
- `Controladores/prisma/schema.prisma`
- `Controladores/pruebas`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/rutas/finanzas.ts`
- `Vistas/src`
- `Vistas/src/App.tsx`
