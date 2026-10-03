import { prisma } from '../db';
import { fechaNegocio } from '../utilidades/finanzas';
import { M7Controller } from '../controladores/M7Controller';
import { M8Controller } from '../controladores/M8Controller';
import { AdaptadorCreditoM8ParaM7 } from '../servicios/AdaptadorCreditoM8ParaM7';
import { M9Controller } from '../controladores/M9Controller';

const PREFIJO = 'DEMO-UI';
const hoy = new Date(`${fechaNegocio()}T00:00:00Z`);
const fecha = (dias = 0) => { const valor = new Date(hoy); valor.setUTCDate(valor.getUTCDate() + dias); return valor; };
const inicioMes = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), 1));
const finMes = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth() + 1, 0));
const rutDemo = (indice: number) => {
  const numero = 97910000 + indice; let suma = 0, factor = 2;
  for (const digito of String(numero).split('').reverse()) { suma += Number(digito) * factor; factor = factor === 7 ? 2 : factor + 1; }
  const dv = 11 - suma % 11;
  return `${numero}-${dv === 11 ? '0' : dv === 10 ? 'K' : dv}`;
};

async function sembrarFinanzas() {
  await prisma.$transaction(async tx => {
    const [clp, empresa, persona, transferencia, categoria, tipoFactura, item] = await Promise.all([
      tx.moneda.upsert({ where: { codigo_moneda: 'CLP' }, update: {}, create: { codigo_moneda: 'CLP', nombre_moneda: 'Peso chileno' } }),
      tx.tipo_cliente_financiero.upsert({ where: { nombre_tipo_cliente_financiero: 'B2B' }, update: {}, create: { nombre_tipo_cliente_financiero: 'B2B' } }),
      tx.tipo_cliente_financiero.upsert({ where: { nombre_tipo_cliente_financiero: 'B2C' }, update: {}, create: { nombre_tipo_cliente_financiero: 'B2C' } }),
      tx.medio_pago.upsert({ where: { nombre_medio_pago: 'Transferencia' }, update: {}, create: { nombre_medio_pago: 'Transferencia' } }),
      tx.categoria_pago.upsert({ where: { nombre: 'Abono parcial' }, update: {}, create: { nombre: 'Abono parcial' } }),
      tx.tipo_documento.upsert({ where: { nombre_tipo_documento: 'Factura Electrónica' }, update: {}, create: { nombre_tipo_documento: 'Factura Electrónica', aplica_venta: true } }),
      tx.item_comercial.findFirst({ where: { nombre_item: `${PREFIJO} Puerta de seguridad` } }).then(valor => valor ?? tx.item_comercial.create({ data: { nombre_item: `${PREFIJO} Puerta de seguridad`, descripcion_item: 'Producto ficticio para QA visual', estado_item: 'activo' } })),
    ]);
    const nombres = ['Constructora Horizonte', 'Taller Cordillera', 'Arquitectura Sur', 'Servicios Andinos', 'Proyecto Los Robles', 'Casa Mirador', 'Residencia Arrayán', 'Familia del Valle', 'Vivienda Parque Norte', 'Casa Costanera'];
    for (let indice = 0; indice < nombres.length; indice++) {
      const b2b = indice < 5, rut = rutDemo(indice + 1), marcador = `${PREFIJO}-CLIENTE-${indice + 1}`;
      await tx.cliente.upsert({ where: { cliente_cliente_rut: rut }, update: { cliente_correo: `demo-ui-cliente${indice + 1}@example.invalid` }, create: { cliente_cliente_rut: rut, cliente_razon_social: `Demo UI — ${nombres[indice]}`, cliente_correo: `demo-ui-cliente${indice + 1}@example.invalid`, cliente_telefono: `+56 9 0000 ${String(indice + 1).padStart(4, '0')}`, cliente_es_cliente_b2b: b2b, cliente_es_cliente_b2c: !b2b } });
      const cliente = await tx.cliente_financiero.upsert({ where: { referencia_demostracion: marcador }, update: { rut_cliente: rut, correo_financiero: `demo-ui-cliente${indice + 1}@example.invalid` }, create: { referencia_demostracion: marcador, rut_cliente: rut, id_tipo_cliente_financiero: b2b ? empresa.id_tipo_cliente_financiero : persona.id_tipo_cliente_financiero, nombre_razon_social_referencia: `Demo UI — ${nombres[indice]}`, telefono_financiero: `+56 9 0000 ${String(indice + 1).padStart(4, '0')}`, correo_financiero: `demo-ui-cliente${indice + 1}@example.invalid`, estado_financiero: indice === 9 ? 'inactivo' : 'activo', nivel_formalizacion: indice === 8 ? 'provisional' : 'formal' } });
      const ficha = await tx.ficha_cliente.upsert({ where: { id_cliente_financiero: cliente.id_cliente_financiero }, update: {}, create: { id_cliente_financiero: cliente.id_cliente_financiero, estado_ficha: indice === 9 ? 'inactiva' : 'activa', observacion_financiera_general: `${PREFIJO}: escenario ficticio de QA` } });
      if (indice >= 5) continue;
      const monto = [350000, 780000, 1250000, 2400000, 4800000][indice];
      const estadoCotizacion = indice % 2 ? 'emitida' : 'borrador';
      const cotizacion = await tx.cotizacion.upsert({ where: { referencia_demostracion: `${PREFIJO}-COT-${indice + 1}` }, update: { fecha_emision: fecha(-indice * 4), fecha_vigencia: fecha(indice === 3 ? -2 : 20), estado_cotizacion: estadoCotizacion }, create: { referencia_demostracion: `${PREFIJO}-COT-${indice + 1}`, id_ficha_cliente: ficha.id_ficha_cliente, id_moneda: clp.id_moneda, fecha_emision: fecha(-indice * 4), fecha_vigencia: fecha(indice === 3 ? -2 : 20), estado_cotizacion: estadoCotizacion, subtotal_costos_estimados: monto * .62, margen_esperado: 38, precio_sugerido: monto, monto_neto: monto, monto_impuesto: monto * .19, monto_total_estimado: monto * 1.19, detalle_cotizacion: { create: [{ id_item_comercial: item.id_item_comercial, cantidad_item: indice + 1, subtotal_item_estimado: monto, descripcion_item_cotizado: `Puerta QA ${indice + 1}` }] } } });
      let proyecto = await tx.proyecto.findFirst({ where: { proyecto_codigo_proyecto: `${PREFIJO}-PROY-${indice + 1}` } });
      if (!proyecto) proyecto = await tx.proyecto.create({ data: { proyecto_codigo_proyecto: `${PREFIJO}-PROY-${indice + 1}`, proyecto_nombre_referencia: `Demo UI — ${nombres[indice]}`, proyecto_fecha_ingreso: fecha(-30 + indice), proyecto_fecha_instalacion: fecha(indice - 2), proyecto_estado_operacional: indice < 3 ? 'activo' : 'terminado', proyecto_estado_produccion: indice < 2 ? 'en_progreso' : 'completada', rut_cliente: rut } });
      const nota = await tx.nota_venta.upsert({ where: { numero_nota_venta: `${PREFIJO}-NV-${indice + 1}` }, update: { fecha_emision: inicioMes, fecha_vencimiento: fecha(indice - 3) }, create: { numero_nota_venta: `${PREFIJO}-NV-${indice + 1}`, id_ficha_cliente: ficha.id_ficha_cliente, id_cotizacion: cotizacion.id_cotizacion, id_moneda: clp.id_moneda, id_proyecto_contexto: proyecto.proyecto_proyecto_id, fecha_emision: inicioMes, fecha_vencimiento: fecha(indice - 3), monto_neto: monto, monto_impuesto: monto * .19, monto_total: monto * 1.19, estado_nota_venta: indice === 4 ? 'anulada' : 'confirmada', estado_pago: ['pendiente', 'parcial', 'pagada', 'parcial', 'pendiente'][indice] } });
      const documento = await tx.documento_tributario.upsert({ where: { id_tipo_documento_folio_documento: { id_tipo_documento: tipoFactura.id_tipo_documento, folio_documento: `${PREFIJO}-FAC-${indice + 1}` } }, update: {}, create: { id_ficha_cliente: ficha.id_ficha_cliente, id_nota_venta: nota.id_nota_venta, id_moneda: clp.id_moneda, id_tipo_documento: tipoFactura.id_tipo_documento, folio_documento: `${PREFIJO}-FAC-${indice + 1}`, fecha_emision: fecha(-18 + indice), fecha_vencimiento: fecha(indice - 3), monto_neto: monto, monto_impuesto: monto * .19, monto_total: monto * 1.19 } });
      await tx.documento_tributario_nota_venta.upsert({ where: { id_documento_tributario_id_nota_venta: { id_documento_tributario: documento.id_documento_tributario, id_nota_venta: nota.id_nota_venta } }, update: {}, create: { id_documento_tributario: documento.id_documento_tributario, id_nota_venta: nota.id_nota_venta } });
      const pagado = indice === 0 ? 100000 : indice === 2 ? Number(nota.monto_total) : Math.round(Number(nota.monto_total) * .4);
      if (pagado > 0) {
        await tx.pago_cliente.upsert({ where: { referencia_demostracion: `${PREFIJO}-PAGO-${indice + 1}` }, update: { fecha_pago: fecha(indice === 2 ? 1 : -2) }, create: { referencia_demostracion: `${PREFIJO}-PAGO-${indice + 1}`, id_ficha_cliente: ficha.id_ficha_cliente, id_moneda: clp.id_moneda, id_medio_pago: transferencia.id_medio_pago, id_categoria_pago: categoria.id_categoria_pago, fecha_pago: fecha(indice === 2 ? 1 : -2), monto_pago: pagado, comprobante_pago: `${PREFIJO}://comprobante/${indice + 1}`, asignacion_pago_cliente: { create: { id_nota_venta: nota.id_nota_venta, monto_asignado: pagado } } } });
      }
      const codigoProyectoFinanciero = `${PREFIJO}-PF-${indice + 1}`;
      const proyectoFinanciero = await tx.proyecto_financiero.upsert({ where: { codigo_proyecto_financiero: codigoProyectoFinanciero }, update: { id_nota_venta: nota.id_nota_venta, id_proyecto_terreno: proyecto.proyecto_proyecto_id }, create: { id_ficha_cliente: ficha.id_ficha_cliente, id_nota_venta: nota.id_nota_venta, id_proyecto_terreno: proyecto.proyecto_proyecto_id, id_moneda: clp.id_moneda, codigo_proyecto_financiero: codigoProyectoFinanciero, fecha_inicio_financiera: inicioMes, estado_financiero_proyecto: 'activo', monto_venta_estimado: monto, monto_costo_estimado: monto * .62, observacion_financiera: `${PREFIJO} proyecto financiero ficticio` } });
      if (!await tx.costo_proyecto.findFirst({ where: { id_proyecto_financiero: proyectoFinanciero.id_proyecto_financiero, descripcion_costo: `${PREFIJO} Costo ${indice + 1}` } })) await tx.costo_proyecto.create({ data: { id_proyecto_financiero: proyectoFinanciero.id_proyecto_financiero, id_moneda: clp.id_moneda, descripcion_costo: `${PREFIJO} Costo ${indice + 1}`, categoria_costo: 'Materiales DEMO-UI', monto_costo: monto * .55, fecha_costo: inicioMes, origen_costo: 'DEMO_UI', estado_costo: 'registrado' } });
      if (!await tx.movimiento_financiero.findFirst({ where: { observacion: `${PREFIJO} Movimiento ${indice + 1}` } })) await tx.movimiento_financiero.create({ data: { id_moneda: clp.id_moneda, fecha_movimiento: fecha(-Math.min(indice, 1)), tipo_movimiento_financiero: indice % 2 ? 'PAGO_CLIENTE' : 'PAGO_PROVEEDOR', naturaleza_movimiento: indice % 2 ? 'ingreso' : 'egreso', motivo_movimiento: `${PREFIJO} flujo ficticio`, monto_movimiento: 90000 * (indice + 1), estado_movimiento: 'registrado', observacion: `${PREFIJO} Movimiento ${indice + 1}` } });
    }
    for (let indice = 1; indice <= 5; indice++) {
      const sku = `DEMOUI-MAT-${String(indice).padStart(2, '0')}`;
      await tx.material.upsert({ where: { material_sku: sku }, update: {}, create: { material_sku: sku, material_nombre_material: `${PREFIJO} Material ${indice}` } });
      if (!await tx.historial_precio_material.findFirst({ where: { material_sku: sku, fecha_vigencia_inicio: inicioMes } })) await tx.historial_precio_material.create({ data: { material_sku: sku, id_moneda: clp.id_moneda, precio_unitario: 15000 * indice, fecha_vigencia_inicio: inicioMes, estado_precio: 'vigente' } });
    }
  }, { timeout: 120000 });
}

async function sembrarProveedoresEInventario() {
  await prisma.$transaction(async tx => {
    const actor = await tx.usuario.findFirstOrThrow({ where: { administrador_original: true } });
    const clp = await tx.moneda.findUniqueOrThrow({ where: { codigo_moneda: 'CLP' } });
    const pais = await tx.pais.upsert({ where: { nombre_pais: `${PREFIJO} País` }, update: {}, create: { nombre_pais: `${PREFIJO} País`, codigo_iso_pais: 'DUI' } });
    const tipoId = await tx.tipo_identificador.upsert({ where: { nombre_tipo_identificador: `${PREFIJO} Identificador` }, update: {}, create: { nombre_tipo_identificador: `${PREFIJO} Identificador`, descripcion_tipo_identificador: 'Identificador ficticio para QA visual' } });
    const tipoDocumento = await tx.tipo_documento.upsert({ where: { nombre_tipo_documento: `${PREFIJO} Documento proveedor` }, update: {}, create: { nombre_tipo_documento: `${PREFIJO} Documento proveedor`, aplica_compra: true } });
    const medio = await tx.medio_pago.upsert({ where: { nombre_medio_pago: `${PREFIJO} Transferencia` }, update: {}, create: { nombre_medio_pago: `${PREFIJO} Transferencia`, codigo_medio_pago: 'DEMO_UI_TRANSFERENCIA', requiere_respaldo: false } });
    let bodega = await tx.bodega.findFirst({ where: { bodega_nombre_bodega: `${PREFIJO} Bodega central` } });
    if (!bodega) bodega = await tx.bodega.create({ data: { bodega_nombre_bodega: `${PREFIJO} Bodega central`, bodega_direccion: 'Dirección ficticia DEMO-UI', bodega_estado: 'activa' } });
    let tipoMovimiento = await tx.movimiento_inventario_tipo_movimiento.findFirst({ where: { movimiento_inventario_tipo_movimiento_nombre: `${PREFIJO} Entrada` } });
    if (!tipoMovimiento) tipoMovimiento = await tx.movimiento_inventario_tipo_movimiento.create({ data: { movimiento_inventario_tipo_movimiento_nombre: `${PREFIJO} Entrada` } });
    for (let indice = 1; indice <= 5; indice++) await tx.categoria_egreso_m5.upsert({ where: { nombre: `${PREFIJO} Categoría ${indice}` }, update: {}, create: { nombre: `${PREFIJO} Categoría ${indice}`, nombre_normalizado: `${PREFIJO.toLowerCase()} categoria ${indice}`, creado_por: actor.usuario_id_usuario } });
    for (let indice = 1; indice <= 5; indice++) {
      const identificador = `${PREFIJO}-PROV-${indice}`;
      let proveedor = await tx.proveedor.findFirst({ where: { id_pais: pais.id_pais, id_tipo_identificador: tipoId.id_tipo_identificador, identificador_tributario: identificador } });
      if (!proveedor) proveedor = await tx.proveedor.create({ data: { id_pais: pais.id_pais, id_tipo_identificador: tipoId.id_tipo_identificador, id_moneda_preferente: clp.id_moneda, identificador_tributario: identificador, nombre_razon_social: `${PREFIJO} Proveedor ${indice}`, tipo_proveedor_m5: indice % 2 ? 'Insumos/Materiales' : 'Ambos', condicion_pago_dias_m5: 30, condicion_pago_tipo_m5: 'DIAS_CORRIDOS', contacto_proveedor: `${PREFIJO} Contacto ${indice}`, correo_proveedor: `demo-ui-proveedor${indice}@example.invalid`, estado_proveedor: indice === 5 ? 'inactivo' : 'activo' } });
      let ocs = await tx.orden_compra_servicio_m5.findFirst({ where: { referencia: `${PREFIJO}-OCS-${indice}` } });
      if (!ocs) ocs = await tx.orden_compra_servicio_m5.create({ data: { id_proveedor: proveedor.id_proveedor, monto_autorizado: 180000 * indice, monto_autorizado_original: 180000 * indice, estado_ocs: indice < 4 ? 'abierta' : 'cerrada', referencia: `${PREFIJO}-OCS-${indice}`, periodo: `${hoy.getUTCFullYear()}-${String(hoy.getUTCMonth() + 1).padStart(2, '0')}`, descripcion: `${PREFIJO} compra ficticia ${indice}`, creado_por: actor.usuario_id_usuario, id_moneda: clp.id_moneda, fecha_esperada_recepcion: fecha(indice * 3) } });
      let documento = await tx.documento_proveedor_m5.findFirst({ where: { folio_normalizado: `${PREFIJO}-DOC-${indice}` } });
      if (!documento) documento = await tx.documento_proveedor_m5.create({ data: { id_proveedor: proveedor.id_proveedor, clase: 'definitivo', id_tipo_documento: tipoDocumento.id_tipo_documento, folio: `${PREFIJO}-DOC-${indice}`, folio_normalizado: `${PREFIJO}-DOC-${indice}`, fecha_emision: fecha(-20 + indice), id_moneda: clp.id_moneda, monto_total: 150000 * indice, estado: 'confirmado', respaldo: `${PREFIJO}://proveedor/${indice}`, descripcion: `${PREFIJO} documento ficticio ${indice}`, fecha_vencimiento: fecha(indice - 3), creado_por: actor.usuario_id_usuario, confirmado_por: actor.usuario_id_usuario, fecha_confirmacion: new Date() } });
      let obligacion = await tx.obligacion_proveedor_m5.findUnique({ where: { id_documento_m5: documento.id_documento_m5 } });
      if (!obligacion) obligacion = await tx.obligacion_proveedor_m5.create({ data: { id_documento_m5: documento.id_documento_m5, id_proveedor: proveedor.id_proveedor, monto_original: documento.monto_total, id_moneda: clp.id_moneda, saldo_inicial: documento.monto_total, saldo_actual: indice === 3 ? 0 : 75000 * indice, fecha_emision: documento.fecha_emision, fecha_vencimiento: documento.fecha_vencimiento!, estado_pago: indice === 3 ? 'Pagada' : indice % 2 ? 'Pendiente' : 'Parcial', generado_por: actor.usuario_id_usuario } });
      let operacion = await tx.operacion_pago_proveedor_m5.findFirst({ where: { id_proveedor: proveedor.id_proveedor, creado_por: actor.usuario_id_usuario } });
      if (!operacion) operacion = await tx.operacion_pago_proveedor_m5.create({ data: { id_proveedor: proveedor.id_proveedor, estado: indice % 2 ? 'borrador' : 'confirmada', fecha_efectiva_pago: fecha(-indice), creado_por: actor.usuario_id_usuario, confirmado_por: indice % 2 ? null : actor.usuario_id_usuario, fecha_confirmacion: indice % 2 ? null : new Date(), total_confirmado: indice % 2 ? null : 75000 * indice } });
      if (!await tx.movimiento_pago_proveedor_m5.findFirst({ where: { id_operacion_pago_m5: operacion.id_operacion_pago_m5, id_obligacion_m5: obligacion.id_obligacion_m5 } })) await tx.movimiento_pago_proveedor_m5.create({ data: { id_operacion_pago_m5: operacion.id_operacion_pago_m5, id_obligacion_m5: obligacion.id_obligacion_m5, id_medio_pago: medio.id_medio_pago, id_moneda: clp.id_moneda, monto_aplicado: 75000 * indice, equivalente_clp: 75000 * indice, estado: operacion.estado === 'confirmada' ? 'Vigente' : 'borrador' } });
      let envio = await tx.envio_importacion_m5.findUnique({ where: { referencia_normalizada: `${PREFIJO}-ENVIO-${indice}` } });
      if (!envio) envio = await tx.envio_importacion_m5.create({ data: { referencia: `${PREFIJO}-ENVIO-${indice}`, referencia_normalizada: `${PREFIJO}-ENVIO-${indice}`, fecha: fecha(-indice), descripcion: `${PREFIJO} importación ficticia ${indice}`, estado: indice < 4 ? 'abierto' : 'cerrado_financieramente', creado_por: actor.usuario_id_usuario } });
      await tx.envio_orden_compra_m5.upsert({ where: { id_envio_importacion_m5_id_ocs_m5: { id_envio_importacion_m5: envio.id_envio_importacion_m5, id_ocs_m5: ocs.id_orden_compra_servicio_m5 } }, update: {}, create: { id_envio_importacion_m5: envio.id_envio_importacion_m5, tipo_orden: 'OCS', id_ocs_m5: ocs.id_orden_compra_servicio_m5, asociado_por: actor.usuario_id_usuario } });
      const sku = `DEMOUI-MAT-${String(indice).padStart(2, '0')}`;
      await tx.material.update({ where: { material_sku: sku }, data: { material_descripcion: `${PREFIJO} inventario ficticio`, material_material_critico: indice <= 2, material_stock_critico: 3, material_stock_minimo: 6, material_sotck_maximo: 40, material_es_rotativo: indice % 2 === 0, material_estado: 'activo' } });
      await tx.material_proveedor.upsert({ where: { material_sku_proveedor_id_proveedor: { material_sku: sku, proveedor_id_proveedor: proveedor.id_proveedor } }, update: {}, create: { material_sku: sku, proveedor_id_proveedor: proveedor.id_proveedor, material_proveedor_tiempo_reposicion: 7 + indice, material_proveedor_precio_referencial: 15000 * indice, material_proveedor_proveedor_principal: true } });
      await tx.detalle_material_orden_compra_m5.upsert({ where: { id_ocs_m5_material_sku: { id_ocs_m5: ocs.id_orden_compra_servicio_m5, material_sku: sku } }, update: {}, create: { id_ocs_m5: ocs.id_orden_compra_servicio_m5, material_sku: sku, cantidad_pedida: 10 + indice, cantidad_recibida: indice < 4 ? indice : 10 + indice, fecha_esperada: fecha(indice * 3) } });
      let factura = await tx.factura_compra.findFirst({ where: { factura_compra_numero_factura: `${PREFIJO}-FC-${indice}` } });
      if (!factura) factura = await tx.factura_compra.create({ data: { factura_compra_numero_factura: `${PREFIJO}-FC-${indice}`, factura_compra_monto_neto: 150000 * indice, factura_compra_tipo_compra: `${PREFIJO} Materiales`, factura_compra_fecha_emision: fecha(-15 + indice), proveedor_id_proveedor: proveedor.id_proveedor } });
      let lote = await tx.lote.findFirst({ where: { lote_numero_lote: `${PREFIJO}-LOTE-${indice}` } });
      if (!lote) lote = await tx.lote.create({ data: { lote_numero_lote: `${PREFIJO}-LOTE-${indice}`, lote_fecha_ingreso: fecha(-70 - indice), lote_fecha_recepcion: indice < 4 ? fecha(-20 + indice) : null, lote_estado: indice < 4 ? 'recibido' : 'pendiente', proveedor_id_proveedor: proveedor.id_proveedor, factura_compra_id_factura: factura.factura_compra_id_factura } });
      await tx.inventario_bodega.upsert({ where: { material_sku_lote_id_lote_bodega_id_bodega: { material_sku: sku, lote_id_lote: lote.lote_id_lote, bodega_id_bodega: bodega.bodega_id_bodega } }, update: { inventario_bodega_cantidad_fisica: [2, 5, 12, 25, 0][indice - 1] }, create: { material_sku: sku, lote_id_lote: lote.lote_id_lote, bodega_id_bodega: bodega.bodega_id_bodega, inventario_bodega_cantidad_fisica: [2, 5, 12, 25, 0][indice - 1], inventario_bodega_cantidad_reservada: indice === 4 ? 4 : 0 } });
      if (!await tx.movimiento_inventario.findFirst({ where: { material_sku: sku, lote_id_lote: lote.lote_id_lote, movimiento_inventario_tipo_movimiento_id_tipo_movimiento: tipoMovimiento.movimiento_inventario_tipo_movimiento_id_tipo_movimiento } })) await tx.movimiento_inventario.create({ data: { movimiento_inventario_fecha_hora: fecha(-70 - indice), movimiento_inventario_cantidad: 10 + indice, movimiento_inventario_estado: 'confirmado', material_sku: sku, bodega_id_bodega: bodega.bodega_id_bodega, lote_id_lote: lote.lote_id_lote, factura_compra_id_factura_compra: factura.factura_compra_id_factura, usuario_id_usuario: actor.usuario_id_usuario, movimiento_inventario_tipo_movimiento_id_tipo_movimiento: tipoMovimiento.movimiento_inventario_tipo_movimiento_id_tipo_movimiento } });
    }
    await tx.fondo_caja_chica_m5.upsert({ where: { anio_mes: { anio: hoy.getUTCFullYear(), mes: hoy.getUTCMonth() + 1 } }, update: {}, create: { anio: hoy.getUTCFullYear(), mes: hoy.getUTCMonth() + 1, monto: 600000, actualizado_por: actor.usuario_id_usuario } });
    for (let indice = 1; indice <= 5; indice++) if (!await tx.gasto_caja_chica_m5.findFirst({ where: { descripcion: `${PREFIJO} Caja chica ${indice}` } })) await tx.gasto_caja_chica_m5.create({ data: { anio: hoy.getUTCFullYear(), mes: hoy.getUTCMonth() + 1, monto: 9000 * indice, descripcion: `${PREFIJO} Caja chica ${indice}`, fecha_gasto: fecha(-indice), comercio_emisor: `${PREFIJO} Comercio ${indice}`, estado: indice < 4 ? 'aprobado' : 'pendiente', registrado_por: actor.usuario_id_usuario, resuelto_por: indice < 4 ? actor.usuario_id_usuario : null, fecha_resolucion: indice < 4 ? new Date() : null } });
  }, { timeout: 120000 });
}

async function sembrarPersonasYOperacion() {
  await prisma.$transaction(async tx => {
    const actor = await tx.usuario.findFirstOrThrow({ where: { administrador_original: true } });
    const vinculo = await tx.tipo_vinculo_laboral.upsert({ where: { nombre_tipo_vinculo_laboral: `${PREFIJO} Contrato indefinido` }, update: {}, create: { nombre_tipo_vinculo_laboral: `${PREFIJO} Contrato indefinido`, descripcion_tipo_vinculo_laboral: 'Configuración ficticia de demostración' } });
    const esquemas = [];
    for (let indice = 1; indice <= 5; indice++) {
      esquemas.push(await tx.esquema_remuneracional.upsert({ where: { codigo: `${PREFIJO}-ESQUEMA-${indice}` }, update: {}, create: { codigo: `${PREFIJO}-ESQUEMA-${indice}`, nombre: `${PREFIJO} Esquema ${indice}`, descripcion: 'Esquema ficticio para QA visual', vigencia_desde: inicioMes } }));
      await tx.concepto_remuneracion.upsert({ where: { codigo_m6: `${PREFIJO}-HABER-${indice}` }, update: {}, create: { codigo_m6: `${PREFIJO}-HABER-${indice}`, nombre_concepto: `${PREFIJO} Haber ${indice}`, descripcion_concepto: 'Haber ficticio para QA visual', naturaleza_concepto: 'haber', estado_concepto: 'activo' } });
    }
    const periodo = await tx.periodo_remuneracion.upsert({ where: { anio_mes: { anio: hoy.getUTCFullYear(), mes: hoy.getUTCMonth() + 1 } }, update: {}, create: { anio: hoy.getUTCFullYear(), mes: hoy.getUTCMonth() + 1, fecha_inicio: inicioMes, fecha_fin: finMes } });
    const medio = await tx.medio_pago.upsert({ where: { nombre_medio_pago: `${PREFIJO} Transferencia` }, update: {}, create: { nombre_medio_pago: `${PREFIJO} Transferencia`, codigo_medio_pago: 'DEMO_UI_TRANSFERENCIA', requiere_respaldo: false } });
    for (let indice = 1; indice <= 5; indice++) {
      const rut = rutDemo(30 + indice);
      const empleado = await tx.empleado.upsert({ where: { rut_empleado: rut }, update: { correo_particular: `demo-ui-empleado${indice}@example.invalid` }, create: { rut_empleado: rut, nombres: `Empleado Demo ${indice}`, apellido_paterno: 'Visual', apellido_materno: 'QA', fecha_ingreso: fecha(-400 + indice * 30), sueldo_base: 700000 + indice * 175000, fecha_aplicacion_sueldo_base: inicioMes, estado_laboral: indice === 5 ? 'inactivo' : 'activo', correo_particular: `demo-ui-empleado${indice}@example.invalid`, telefono_particular: `+56 9 1000 ${String(indice).padStart(4, '0')}`, id_tipo_vinculo_laboral: vinculo.id_tipo_vinculo_laboral } });
      const relacionDemo = await tx.relacion_laboral_empleado.findFirst({ where: { id_empleado: empleado.id_empleado, estado: 'vigente' } });
      if (!relacionDemo) await tx.relacion_laboral_empleado.create({ data: { id_empleado: empleado.id_empleado, fecha_inicio: fecha(-400 + indice * 30), fecha_termino: finMes, estado: 'vigente', jornada: 'Completa', id_tipo_vinculo_laboral: vinculo.id_tipo_vinculo_laboral } });
      else await tx.relacion_laboral_empleado.update({ where: { id_relacion_laboral_empleado: relacionDemo.id_relacion_laboral_empleado }, data: { fecha_termino: finMes } });
      const esquema = esquemas[indice - 1];
      if (!await tx.asignacion_esquema_remuneracional.findFirst({ where: { id_empleado: empleado.id_empleado, id_esquema: esquema.id_esquema_remuneracional, activa: true } })) await tx.asignacion_esquema_remuneracional.create({ data: { id_empleado: empleado.id_empleado, id_esquema: esquema.id_esquema_remuneracional, vigencia_desde: inicioMes } });
      let remuneracion = await tx.remuneracion.findFirst({ where: { id_periodo_remuneracion: periodo.id_periodo_remuneracion, id_empleado: empleado.id_empleado, reemplaza_a_id: null } });
      const haberes = 700000 + indice * 175000, deducciones = 95000 + indice * 12000;
      if (!remuneracion) remuneracion = await tx.remuneracion.create({ data: { id_periodo_remuneracion: periodo.id_periodo_remuneracion, id_empleado: empleado.id_empleado, estado: 'cerrada', creado_por: actor.usuario_id_usuario, calculado_por: actor.usuario_id_usuario, calculado_en: new Date(), cerrado_por: actor.usuario_id_usuario, cerrado_en: new Date(), total_haberes: haberes, total_deducciones: deducciones, total_aportes_empleador: haberes * .04, base_imponible: haberes, base_tributable: haberes - deducciones, liquido_preliminar: haberes - deducciones } });
      else if (remuneracion.estado !== 'cerrada') remuneracion = await tx.remuneracion.update({ where: { id_remuneracion: remuneracion.id_remuneracion }, data: { estado: 'cerrada', cerrado_por: actor.usuario_id_usuario, cerrado_en: new Date() } });
      for (const componente of [{ clave: 'SUELDO', tipo: 'SUELDO_BASE', monto: haberes }, { clave: 'DEDUCCION', tipo: 'DEDUCCION_AUTOMATICA', monto: deducciones }]) if (!await tx.componente_remuneracion.findFirst({ where: { id_remuneracion: remuneracion.id_remuneracion, clave_negocio: `${PREFIJO}:${componente.clave}:${indice}` } })) await tx.componente_remuneracion.create({ data: { id_remuneracion: remuneracion.id_remuneracion, tipo: componente.tipo, descripcion: `${PREFIJO} ${componente.clave.toLowerCase()}`, monto: componente.monto, fuente_tipo: 'AUTOMATICA', clave_negocio: `${PREFIJO}:${componente.clave}:${indice}`, estado_revision: 'aprobado', creado_por: actor.usuario_id_usuario, revisado_por: actor.usuario_id_usuario, fecha_revision: new Date() } });
      await tx.pago_remuneracion.upsert({ where: { clave_idempotencia: `${PREFIJO}:PAGO-REM:${indice}` }, update: {}, create: { origen_tipo: 'REMUNERACION', origen_id: remuneracion.id_remuneracion, monto: haberes - deducciones, id_medio_pago: medio.id_medio_pago, respaldo: `${PREFIJO}://remuneracion/${indice}`, referencia: `${PREFIJO} pago remuneración ${indice}`, estado: indice < 4 ? 'CONFIRMADO' : 'PREPARADO', clave_idempotencia: `${PREFIJO}:PAGO-REM:${indice}`, creado_por: actor.usuario_id_usuario, confirmado_por: indice < 4 ? actor.usuario_id_usuario : null, confirmado_en: indice < 4 ? new Date() : null } });
    }
    for (let indice = 1; indice <= 5; indice++) {
      const identificador = `${PREFIJO}-HON-${indice}`;
      const prestador = await tx.prestador_honorarios.upsert({ where: { identificador }, update: {}, create: { identificador, nombre_razon_social: `${PREFIJO} Prestador ${indice}`, contacto: `demo-ui-honorarios${indice}@example.invalid`, estado: indice === 5 ? 'INACTIVO' : 'ACTIVO' } });
      if (!await tx.boleta_honorarios.findFirst({ where: { id_prestador: prestador.id_prestador_honorarios, folio: `${PREFIJO}-BH-${indice}` } })) await tx.boleta_honorarios.create({ data: { id_prestador: prestador.id_prestador_honorarios, folio: `${PREFIJO}-BH-${indice}`, fecha_emision: fecha(-indice), bruto: 120000 * indice, modalidad_tributaria: indice % 2 ? 'CON_RETENCION_RECEPTOR' : 'SIN_RETENCION_PPM_EMISOR', estado_documental: 'PENDIENTE_CONFIRMACION', respaldo: `${PREFIJO}://honorarios/${indice}`, referencia: `${PREFIJO} boleta ficticia ${indice}` } });
    }
    for (const parametro of [
      { codigo: 'M7_MARGEN_CRITICO', nombre: `${PREFIJO} Margen crítico`, valor: 15, unidad: 'PORCENTAJE' },
      { codigo: 'M7_LIQUIDEZ_UMBRAL_PREVENTIVO', nombre: `${PREFIJO} Liquidez preventiva`, valor: 2500000, unidad: 'MONTO' },
      { codigo: 'M7_LIQUIDEZ_UMBRAL_CRITICO', nombre: `${PREFIJO} Liquidez crítica`, valor: 1000000, unidad: 'MONTO' },
      { codigo: 'M7_DIAS_STOCK_INMOVIL', nombre: `${PREFIJO} Stock inmóvil`, valor: 60, unidad: 'DIAS' },
    ]) await tx.parametro_remuneracional.upsert({ where: { codigo_vigencia_desde: { codigo: parametro.codigo, vigencia_desde: inicioMes } }, update: {}, create: { ...parametro, tipo: 'DASHBOARD', descripcion: 'Configuración ficticia para QA visual', fuente: 'DEMO', referencia: PREFIJO, vigencia_desde: inicioMes, estado: 'activo' } });
    for (let indice = 1; indice <= 5; indice++) {
      const rut = rutDemo(indice), cliente = await tx.cliente.findUniqueOrThrow({ where: { cliente_cliente_rut: rut } });
      let especificacion = await tx.especificaciones_puerta.findFirst({ where: { especificacion_puerta_observaciones: `${PREFIJO}-ESP-${indice}` } });
      if (!especificacion) especificacion = await tx.especificaciones_puerta.create({ data: { especificacion_puerta_modelo_puerta: `Modelo Demo ${indice}`, especificacion_puerta_zona: ['Norte','Centro','Sur','Oriente','Poniente'][indice - 1], especificacion_puerta_sentido_apertura: indice % 2 ? 'Interior' : 'Exterior', especificacion_puerta_observaciones: `${PREFIJO}-ESP-${indice}` } });
      let medida = await tx.medidas_puerta.findFirst({ where: { id_especificacion_puerta: especificacion.especificacion_puerta_especificacion_puerta_id } });
      if (!medida) medida = await tx.medidas_puerta.create({ data: { id_especificacion_puerta: especificacion.especificacion_puerta_especificacion_puerta_id, medidas_puerta_medidas_marco_ancho: 900 + indice * 10, medidas_puerta_medidas_marco_alto: 2050 + indice * 10, medidas_puerta_medidas_marco_espesor: 50 } });
      if (!especificacion.id_medidas) await tx.especificaciones_puerta.update({ where: { especificacion_puerta_especificacion_puerta_id: especificacion.especificacion_puerta_especificacion_puerta_id }, data: { id_medidas: medida.medidas_puerta_medidas_id } });
      let obra = await tx.obra.findFirst({ where: { obra_referencia: `${PREFIJO}-OBRA-${indice}` } });
      if (!obra) obra = await tx.obra.create({ data: { obra_nombre_obra: `${PREFIJO} Obra ${indice}`, obra_direccion_obra: `Avenida Demo ${100 + indice}`, obra_comuna: ['Santiago','Providencia','Ñuñoa','Maipú','Las Condes'][indice - 1], obra_ciudad: 'Santiago', obra_region: 'Metropolitana', obra_tipo_obra: 'Instalación', obra_fecha_de_creacion: fecha(-30), obra_fecha_de_ultima_edicion: fecha(-indice), obra_estado: indice < 4 ? 'activa' : 'cerrada', obra_cantidad_puerta: indice, obra_referencia: `${PREFIJO}-OBRA-${indice}`, rut_cliente: cliente.cliente_cliente_rut, id_especificacion_puerta: especificacion.especificacion_puerta_especificacion_puerta_id } });
      let servicio = await tx.servicio_terreno.findFirst({ where: { id_obra: obra.obra_obra_id, servicio_terreno_observaciones: { contains: PREFIJO } } });
      const estadoServicio = ['pendiente','en_progreso','pendiente','cerrada','cerrada'][indice - 1];
      if (!servicio) servicio = await tx.servicio_terreno.create({ data: { servicio_terreno_tipo_servicio: 'Instalación', servicio_terreno_fecha_real: indice >= 4 ? inicioMes : null, servicio_terreno_prioridad: indice === 1 ? 'alta' : 'normal', servicio_terreno_estado: estadoServicio, servicio_terreno_observaciones: `${PREFIJO} visita ${indice}`, id_obra: obra.obra_obra_id } });
      else servicio = await tx.servicio_terreno.update({ where: { servicio_terreno_servicio_terreno_id: servicio.servicio_terreno_servicio_terreno_id }, data: { servicio_terreno_estado: estadoServicio, servicio_terreno_fecha_real: indice >= 4 ? inicioMes : null } });
      let tarea = await tx.tarea.findFirst({ where: { tarea_titulo: `${PREFIJO} Tarea ${indice}`, id_servicio_terreno: servicio.servicio_terreno_servicio_terreno_id } });
      if (!tarea) tarea = await tx.tarea.create({ data: { tarea_titulo: `${PREFIJO} Tarea ${indice}`, tarea_descripcion: 'Actividad ficticia para QA visual', tarea_fecha_de_creacion: fecha(-10), tarea_fecha_de_inicio: fecha(-5), tarea_fecha_de_termino: indice >= 4 ? fecha(-indice) : null, tarea_horario_limite: fecha(indice - 3), tarea_urgencia: indice === 1 ? 'alta' : 'normal', tarea_estado_de_tarea: indice >= 4 ? 'completada' : 'pendiente', id_servicio_terreno: servicio.servicio_terreno_servicio_terreno_id, id_especificacion_puerta: especificacion.especificacion_puerta_especificacion_puerta_id } });
      let ot = await tx.orden_trabajo.findFirst({ where: { especificaciones_puerta_id_especificacion_puerta: especificacion.especificacion_puerta_especificacion_puerta_id } });
      if (!ot) ot = await tx.orden_trabajo.create({ data: { orden_trabajo_fecha_hora: fecha(-8 + indice), orden_trabajo_estado: ['pendiente','en_progreso','en_progreso','completada','cancelada'][indice - 1], especificaciones_puerta_id_especificacion_puerta: especificacion.especificacion_puerta_especificacion_puerta_id } });
      await tx.material_orden_trabajo.upsert({ where: { material_sku_orden_trabajo_id_orden: { material_sku: `DEMOUI-MAT-${String(indice).padStart(2, '0')}`, orden_trabajo_id_orden: ot.orden_trabajo_id_orden } }, update: {}, create: { material_sku: `DEMOUI-MAT-${String(indice).padStart(2, '0')}`, orden_trabajo_id_orden: ot.orden_trabajo_id_orden, material_orden_trabajo_consumo_estimado: 3 + indice, material_orden_trabajo_consumo_real: indice >= 4 ? 2 + indice : null } });
      await tx.tarea.update({ where: { tarea_tarea_id: tarea.tarea_tarea_id }, data: { id_orden_trabajo: ot.orden_trabajo_id_orden } });
      await tx.tarea_usuario.upsert({ where: { tarea_usuario_tarea_id_tarea_usuario_usuario_id: { tarea_usuario_tarea_id: tarea.tarea_tarea_id, tarea_usuario_usuario_id: actor.usuario_id_usuario } }, update: {}, create: { tarea_usuario_tarea_id: tarea.tarea_tarea_id, tarea_usuario_usuario_id: actor.usuario_id_usuario } });
      let ejecucion = await tx.ejecucion_tarea.findFirst({ where: { id_tarea: tarea.tarea_tarea_id, id_usuario_ejecutor: actor.usuario_id_usuario } });
      if (!ejecucion) ejecucion = await tx.ejecucion_tarea.create({ data: { id_tarea: tarea.tarea_tarea_id, id_usuario_ejecutor: actor.usuario_id_usuario, fecha_ejecucion: fecha(-indice), estado_ejecucion: indice < 4 ? 'en_ejecucion' : 'terminada', estado_validacion_productiva: indice % 2 ? 'pendiente' : 'validada', cantidad: indice, unidad: 'UNIDAD' } });
      if (!await tx.incidencia_retrabajo_tarea.findFirst({ where: { id_ejecucion_tarea: ejecucion.id_ejecucion_tarea, descripcion: `${PREFIJO} incidencia ${indice}` } })) await tx.incidencia_retrabajo_tarea.create({ data: { id_ejecucion_tarea: ejecucion.id_ejecucion_tarea, descripcion: `${PREFIJO} incidencia ${indice}`, causa_referencia: `${PREFIJO}-CAUSA-${indice}`, estado: indice < 4 ? 'pendiente' : 'cerrada', responsabilidad: 'Proceso DEMO-UI' } });
    }
  }, { timeout: 120000 });
}

async function sembrarCredito() {
  await prisma.$transaction(async tx => {
    const actor = await tx.usuario.findFirstOrThrow({ where: { administrador_original: true } });
    const fichas = await tx.ficha_cliente.findMany({ where: { cliente_financiero: { referencia_demostracion: { startsWith: `${PREFIJO}-CLIENTE-` } } }, include: { nota_venta: true, cotizacion: true }, orderBy: { id_ficha_cliente: 'asc' }, take: 5 });
    if (!await tx.limite_global_credito_m8.findFirst({ where: { motivo: { startsWith: PREFIJO } } })) await tx.limite_global_credito_m8.create({ data: { monto_limite: 18000000, vigencia_desde: inicioMes, motivo: `${PREFIJO} límite global ficticio`, id_responsable: actor.usuario_id_usuario } });
    const estados = ['BORRADOR', 'PENDIENTE', 'APROBADA', 'RECHAZADA', 'CANCELADA'];
    for (let indice = 0; indice < fichas.length; indice++) {
      const ficha = fichas[indice], cupo = 1500000 + indice * 900000;
      await tx.condicion_crediticia_m8.upsert({ where: { id_ficha_cliente: ficha.id_ficha_cliente }, update: {}, create: { id_ficha_cliente: ficha.id_ficha_cliente, credito_habilitado: indice !== 3, monto_cupo: cupo, vigencia_desde: inicioMes, vigencia_hasta: fecha(180), suspendido: indice === 4, motivo_suspension: indice === 4 ? `${PREFIJO} revisión ficticia` : null } });
      let solicitud = await tx.solicitud_crediticia_m8.findFirst({ where: { referencia_contexto: `${PREFIJO}-SOL-${indice + 1}` } });
      if (!solicitud) solicitud = await tx.solicitud_crediticia_m8.create({ data: { id_ficha_cliente: ficha.id_ficha_cliente, tipo_solicitud: indice % 2 ? 'EXCEPCION' : 'INICIAL', estado_solicitud: estados[indice], id_usuario_solicitante: actor.usuario_id_usuario, id_cotizacion: ficha.cotizacion[0]?.id_cotizacion, id_nota_venta: ficha.nota_venta[0]?.id_nota_venta, referencia_contexto: `${PREFIJO}-SOL-${indice + 1}`, antecedentes_resumen: 'Antecedentes ficticios para demostración', motivo_solicitud: `${PREFIJO} motivo ${indice + 1}`, condiciones_solicitadas: 'Condiciones ficticias sin valor normativo' } });
      if (['APROBADA','RECHAZADA'].includes(estados[indice]) && !await tx.resolucion_solicitud_crediticia_m8.findUnique({ where: { id_solicitud_crediticia: solicitud.id_solicitud_crediticia } })) await tx.resolucion_solicitud_crediticia_m8.create({ data: { id_solicitud_crediticia: solicitud.id_solicitud_crediticia, decision: estados[indice], motivo: `${PREFIJO} resolución ficticia`, monto_cupo_aprobado: estados[indice] === 'APROBADA' ? cupo : null, vigencia_desde: estados[indice] === 'APROBADA' ? inicioMes : null, vigencia_hasta: estados[indice] === 'APROBADA' ? fecha(180) : null, condiciones_aprobadas: 'Uso demostrativo', id_usuario_responsable: actor.usuario_id_usuario } });
      const nota = ficha.nota_venta[0];
      if (nota && indice < 4) await tx.compromiso_credito_m8.upsert({ where: { id_nota_venta: nota.id_nota_venta }, update: {}, create: { id_ficha_cliente: ficha.id_ficha_cliente, id_nota_venta: nota.id_nota_venta, id_solicitud_excepcion: solicitud.tipo_solicitud === 'EXCEPCION' ? solicitud.id_solicitud_crediticia : null, monto_original: nota.monto_total, monto_pendiente: Number(nota.monto_total) * (indice === 2 ? .35 : .7), condiciones: `${PREFIJO} compromiso ficticio`, estado: 'VIGENTE' } });
    }
  }, { timeout: 60000 });
}

async function sembrarAuditoria() {
  const controlador = new M9Controller();
  for (let modulo = 1; modulo <= 8; modulo++) for (let indice = 1; indice <= 5; indice++) await controlador.recibir({ identidadLogica: `${PREFIJO}:M${modulo}:${indice}`, versionContrato: '1.0', ocurridoEn: fecha(-indice).toISOString(), zonaHoraria: 'UTC', ejecutor: { tipo: indice % 2 ? 'SISTEMA' : 'HUMANO', referencia: `${PREFIJO}-ACTOR` }, productor: `M${modulo}`, modulo: `M${modulo}`, operacion: `${PREFIJO}_ESCENARIO_${indice}`, resultado: indice === 4 ? 'RECHAZADO' : indice === 5 ? 'FALLIDO' : 'EXITOSO', referencia: { tipo: 'ESCENARIO_DEMO', id: `${PREFIJO}-M${modulo}-${indice}` }, anterior: { estado: indice === 1 ? 'nuevo' : 'pendiente' }, nuevo: { estado: indice >= 4 ? 'observado' : 'procesado', monto: indice * 100000 }, motivo: `${PREFIJO} evidencia ficticia`, capacidad: 'EMITIR_EVENTO_M9', critico: true });
}

async function limpiarDemo() {
  const eventosM9Preservados = await prisma.evento_auditoria_m9.count({ where: { identidad_logica: { startsWith: `${PREFIJO}:` } } });
  await prisma.$transaction(async tx => {
    const fichas = await tx.ficha_cliente.findMany({ where: { cliente_financiero: { referencia_demostracion: { startsWith: `${PREFIJO}-CLIENTE-` } } }, select: { id_ficha_cliente: true, id_cliente_financiero: true } });
    const idsFicha = fichas.map(valor => valor.id_ficha_cliente);
    const idsClienteFinanciero = fichas.map(valor => valor.id_cliente_financiero);
    const solicitudes = await tx.solicitud_crediticia_m8.findMany({ where: { referencia_contexto: { startsWith: `${PREFIJO}-SOL-` } }, select: { id_solicitud_crediticia: true } });
    const idsSolicitud = solicitudes.map(valor => valor.id_solicitud_crediticia);
    const especificaciones = await tx.especificaciones_puerta.findMany({ where: { especificacion_puerta_observaciones: { startsWith: `${PREFIJO}-ESP-` } }, select: { especificacion_puerta_especificacion_puerta_id: true } });
    const idsEspecificacion = especificaciones.map(valor => valor.especificacion_puerta_especificacion_puerta_id);
    const empleados = await tx.empleado.findMany({ where: { OR: [{ correo_particular: { startsWith: 'demo-ui-empleado', endsWith: '@example.invalid' } }, { nombres: { startsWith: 'Empleado Demo ' }, apellido_paterno: 'Visual', apellido_materno: 'QA' }] }, select: { id_empleado: true } });
    const idsEmpleado = empleados.map(valor => valor.id_empleado);
    const remuneraciones = await tx.remuneracion.findMany({ where: { componentes: { some: { clave_negocio: { startsWith: `${PREFIJO}:` } } } }, select: { id_remuneracion: true } });
    const idsRemuneracion = remuneraciones.map(valor => valor.id_remuneracion);
    const notas = await tx.nota_venta.findMany({ where: { numero_nota_venta: { startsWith: `${PREFIJO}-NV-` } }, select: { id_nota_venta: true } });
    const idsNota = notas.map(valor => valor.id_nota_venta);
    const documentos = await tx.documento_tributario.findMany({ where: { folio_documento: { startsWith: `${PREFIJO}-FAC-` } }, select: { id_documento_tributario: true } });
    const idsDocumento = documentos.map(valor => valor.id_documento_tributario);
    const pagos = await tx.pago_cliente.findMany({ where: { referencia_demostracion: { startsWith: `${PREFIJO}-PAGO-` } }, select: { id_pago_cliente: true } });
    const idsPago = pagos.map(valor => valor.id_pago_cliente);
    const proveedores = await tx.proveedor.findMany({ where: { identificador_tributario: { startsWith: `${PREFIJO}-PROV-` } }, select: { id_proveedor: true } });
    const idsProveedor = proveedores.map(valor => valor.id_proveedor);
    const ocs = await tx.orden_compra_servicio_m5.findMany({ where: { referencia: { startsWith: `${PREFIJO}-OCS-` } }, select: { id_orden_compra_servicio_m5: true } });
    const idsOcs = ocs.map(valor => valor.id_orden_compra_servicio_m5);
    const docsProveedor = await tx.documento_proveedor_m5.findMany({ where: { folio_normalizado: { startsWith: `${PREFIJO}-DOC-` } }, select: { id_documento_m5: true } });
    const idsDocsProveedor = docsProveedor.map(valor => valor.id_documento_m5);
    const obligaciones = await tx.obligacion_proveedor_m5.findMany({ where: { id_documento_m5: { in: idsDocsProveedor } }, select: { id_obligacion_m5: true } });
    const idsObligacion = obligaciones.map(valor => valor.id_obligacion_m5);
    const operacionesProveedor = await tx.operacion_pago_proveedor_m5.findMany({ where: { id_proveedor: { in: idsProveedor } }, select: { id_operacion_pago_m5: true } });
    const idsOperacionProveedor = operacionesProveedor.map(valor => valor.id_operacion_pago_m5);
    const envios = await tx.envio_importacion_m5.findMany({ where: { referencia_normalizada: { startsWith: `${PREFIJO}-ENVIO-` } }, select: { id_envio_importacion_m5: true } });
    const idsEnvio = envios.map(valor => valor.id_envio_importacion_m5);
    const prestadores = await tx.prestador_honorarios.findMany({ where: { identificador: { startsWith: `${PREFIJO}-HON-` } }, select: { id_prestador_honorarios: true } });
    const idsPrestador = prestadores.map(valor => valor.id_prestador_honorarios);
    const tareas = await tx.tarea.findMany({ where: { tarea_titulo: { startsWith: `${PREFIJO} Tarea ` } }, select: { tarea_tarea_id: true } });
    const idsTarea = tareas.map(valor => valor.tarea_tarea_id);
    const ejecuciones = await tx.ejecucion_tarea.findMany({ where: { id_tarea: { in: idsTarea } }, select: { id_ejecucion_tarea: true } });
    const idsEjecucion = ejecuciones.map(valor => valor.id_ejecucion_tarea);
    const lotes = await tx.lote.findMany({ where: { lote_numero_lote: { startsWith: `${PREFIJO}-LOTE-` } }, select: { lote_id_lote: true, factura_compra_id_factura: true } });
    const idsLote = lotes.map(valor => valor.lote_id_lote);
    const idsFacturaCompra = lotes.flatMap(valor => valor.factura_compra_id_factura ? [valor.factura_compra_id_factura] : []);

    await tx.resolucion_solicitud_crediticia_m8.deleteMany({ where: { id_solicitud_crediticia: { in: idsSolicitud } } });
    await tx.compromiso_credito_m8.deleteMany({ where: { condiciones: { startsWith: PREFIJO } } });
    await tx.solicitud_crediticia_m8.deleteMany({ where: { id_solicitud_crediticia: { in: idsSolicitud } } });
    await tx.condicion_crediticia_m8.deleteMany({ where: { id_ficha_cliente: { in: idsFicha } } });
    await tx.limite_global_credito_m8.deleteMany({ where: { motivo: { startsWith: PREFIJO } } });
    await tx.parametro_remuneracional.deleteMany({ where: { referencia: PREFIJO } });
    await tx.incidencia_retrabajo_tarea.deleteMany({ where: { id_ejecucion_tarea: { in: idsEjecucion } } });
    await tx.tratamiento_remuneracional_ejecucion.deleteMany({ where: { id_ejecucion_tarea: { in: idsEjecucion } } });
    await tx.ejecucion_tarea.deleteMany({ where: { id_ejecucion_tarea: { in: idsEjecucion } } });
    await tx.tarea_usuario.deleteMany({ where: { tarea_usuario_tarea_id: { in: idsTarea } } });
    await tx.tarea.deleteMany({ where: { tarea_tarea_id: { in: idsTarea } } });
    await tx.material_orden_trabajo.deleteMany({ where: { material_sku: { startsWith: 'DEMOUI-MAT-' } } });
    await tx.orden_trabajo.deleteMany({ where: { especificaciones_puerta_id_especificacion_puerta: { in: idsEspecificacion } } });
    await tx.servicio_terreno.deleteMany({ where: { servicio_terreno_observaciones: { startsWith: PREFIJO } } });
    await tx.obra.deleteMany({ where: { obra_referencia: { startsWith: `${PREFIJO}-OBRA-` } } });
    await tx.medidas_puerta.deleteMany({ where: { id_especificacion_puerta: { in: idsEspecificacion } } });
    await tx.especificaciones_puerta.deleteMany({ where: { especificacion_puerta_especificacion_puerta_id: { in: idsEspecificacion } } });
    await tx.pago_remuneracion.deleteMany({ where: { clave_idempotencia: { startsWith: `${PREFIJO}:PAGO-REM:` } } });
    await tx.boleta_honorarios.deleteMany({ where: { id_prestador: { in: idsPrestador } } });
    await tx.prestador_honorarios.deleteMany({ where: { id_prestador_honorarios: { in: idsPrestador } } });
    await tx.componente_remuneracion.deleteMany({ where: { id_remuneracion: { in: idsRemuneracion } } });
    await tx.remuneracion.deleteMany({ where: { id_remuneracion: { in: idsRemuneracion } } });
    await tx.asignacion_esquema_remuneracional.deleteMany({ where: { OR: [{ id_empleado: { in: idsEmpleado } }, { esquema: { codigo: { startsWith: `${PREFIJO}-ESQUEMA` } } }] } });
    await tx.relacion_laboral_empleado.deleteMany({ where: { id_empleado: { in: idsEmpleado } } });
    await tx.empleado.deleteMany({ where: { id_empleado: { in: idsEmpleado } } });
    await tx.esquema_remuneracional.deleteMany({ where: { codigo: { startsWith: `${PREFIJO}-ESQUEMA` } } });
    await tx.concepto_remuneracion.deleteMany({ where: { codigo_m6: { startsWith: `${PREFIJO}-HABER-` } } });
    await tx.tipo_vinculo_laboral.deleteMany({ where: { nombre_tipo_vinculo_laboral: `${PREFIJO} Contrato indefinido` } });
    await tx.asignacion_pago_cliente.deleteMany({ where: { id_pago_cliente: { in: idsPago } } });
    await tx.pago_cliente.deleteMany({ where: { id_pago_cliente: { in: idsPago } } });
    await tx.documento_tributario_nota_venta.deleteMany({ where: { OR: [{ id_documento_tributario: { in: idsDocumento } }, { id_nota_venta: { in: idsNota } }] } });
    await tx.documento_tributario.deleteMany({ where: { id_documento_tributario: { in: idsDocumento } } });
    await tx.costo_proyecto.deleteMany({ where: { proyecto_financiero: { codigo_proyecto_financiero: { startsWith: `${PREFIJO}-PF-` } } } });
    await tx.proyecto_financiero.deleteMany({ where: { codigo_proyecto_financiero: { startsWith: `${PREFIJO}-PF-` } } });
    await tx.movimiento_financiero.deleteMany({ where: { observacion: { startsWith: `${PREFIJO} Movimiento ` } } });
    await tx.nota_venta.deleteMany({ where: { id_nota_venta: { in: idsNota } } });
    await tx.detalle_cotizacion.deleteMany({ where: { cotizacion: { referencia_demostracion: { startsWith: `${PREFIJO}-COT-` } } } });
    await tx.cotizacion.deleteMany({ where: { referencia_demostracion: { startsWith: `${PREFIJO}-COT-` } } });
    await tx.movimiento_inventario.deleteMany({ where: { lote_id_lote: { in: idsLote } } });
    await tx.inventario_bodega.deleteMany({ where: { lote_id_lote: { in: idsLote } } });
    await tx.lote_fecha_pedido.deleteMany({ where: { lote_id_lote: { in: idsLote } } });
    await tx.lote.deleteMany({ where: { lote_id_lote: { in: idsLote } } });
    await tx.factura_compra.deleteMany({ where: { factura_compra_id_factura: { in: idsFacturaCompra } } });
    await tx.material_proveedor.deleteMany({ where: { material_sku: { startsWith: 'DEMOUI-MAT-' }, proveedor_id_proveedor: { in: idsProveedor } } });
    await tx.detalle_material_orden_compra_m5.deleteMany({ where: { id_ocs_m5: { in: idsOcs } } });
    await tx.envio_orden_compra_m5.deleteMany({ where: { id_envio_importacion_m5: { in: idsEnvio } } });
    await tx.costo_envio_importacion_m5.deleteMany({ where: { id_envio_importacion_m5: { in: idsEnvio } } });
    await tx.historial_envio_importacion_m5.deleteMany({ where: { id_envio_importacion_m5: { in: idsEnvio } } });
    await tx.envio_importacion_m5.deleteMany({ where: { id_envio_importacion_m5: { in: idsEnvio } } });
    await tx.movimiento_pago_proveedor_m5.deleteMany({ where: { id_operacion_pago_m5: { in: idsOperacionProveedor } } });
    await tx.operacion_pago_proveedor_m5.deleteMany({ where: { id_operacion_pago_m5: { in: idsOperacionProveedor } } });
    await tx.obligacion_proveedor_m5.deleteMany({ where: { id_obligacion_m5: { in: idsObligacion } } });
    await tx.documento_proveedor_m5.deleteMany({ where: { id_documento_m5: { in: idsDocsProveedor } } });
    await tx.orden_compra_servicio_m5.deleteMany({ where: { id_orden_compra_servicio_m5: { in: idsOcs } } });
    await tx.historial_proveedor_m5.deleteMany({ where: { id_proveedor: { in: idsProveedor } } });
    await tx.gasto_caja_chica_m5.deleteMany({ where: { descripcion: { startsWith: `${PREFIJO} Caja chica ` } } });
    await tx.categoria_egreso_m5.deleteMany({ where: { nombre: { startsWith: `${PREFIJO} Categoría ` } } });
    await tx.proyecto.deleteMany({ where: { proyecto_codigo_proyecto: { startsWith: `${PREFIJO}-PROY-` } } });
    await tx.ficha_cliente.deleteMany({ where: { id_cliente_financiero: { in: idsClienteFinanciero } } });
    await tx.cliente_financiero.deleteMany({ where: { referencia_demostracion: { startsWith: `${PREFIJO}-CLIENTE-` } } });
    await tx.historial_precio_material.deleteMany({ where: { material_sku: { startsWith: 'DEMOUI-MAT-' } } });
    await tx.material.deleteMany({ where: { material_sku: { startsWith: 'DEMOUI-MAT-' } } });
    await tx.proveedor.deleteMany({ where: { id_proveedor: { in: idsProveedor } } });
    await tx.factura_compra.deleteMany({ where: { factura_compra_numero_factura: { startsWith: `${PREFIJO}-FC-` } } });
    await tx.bodega.deleteMany({ where: { bodega_nombre_bodega: `${PREFIJO} Bodega central` } });
    await tx.movimiento_inventario_tipo_movimiento.deleteMany({ where: { movimiento_inventario_tipo_movimiento_nombre: `${PREFIJO} Entrada` } });
    await tx.tipo_identificador.deleteMany({ where: { nombre_tipo_identificador: `${PREFIJO} Identificador` } });
    await tx.pais.deleteMany({ where: { nombre_pais: `${PREFIJO} País` } });
    await tx.tipo_documento.deleteMany({ where: { nombre_tipo_documento: `${PREFIJO} Documento proveedor` } });
    await tx.medio_pago.deleteMany({ where: { nombre_medio_pago: `${PREFIJO} Transferencia` } });
    await tx.cliente.deleteMany({ where: { cliente_correo: { startsWith: 'demo-ui-cliente', endsWith: '@example.invalid' } } });
    await tx.item_comercial.deleteMany({ where: { nombre_item: `${PREFIJO} Puerta de seguridad` } });
  }, { timeout: 120000 });
  console.log(JSON.stringify({ estado: 'OK', mensaje: 'Se retiraron sólo registros operativos DEMO-UI; la evidencia M9 no se elimina porque es inmutable.', eventosM9DemoPreservados: eventosM9Preservados }, null, 2));
}

async function conteos() {
  const idsProveedorDemo = (await prisma.proveedor.findMany({ where: { identificador_tributario: { startsWith: `${PREFIJO}-PROV-` } }, select: { id_proveedor: true } })).map(valor => valor.id_proveedor);
  const idsDocumentoProveedorDemo = (await prisma.documento_proveedor_m5.findMany({ where: { folio_normalizado: { startsWith: `${PREFIJO}-DOC-` } }, select: { id_documento_m5: true } })).map(valor => valor.id_documento_m5);
  const [usuarios, clientes, cotizaciones, notas, pagos, movimientosFinancieros, proveedores, ocs, documentosProveedor, obligaciones, pagosProveedor, categoriasEgreso, envios, cajaChica, empleados, esquemas, haberes, remuneraciones, documentosRemuneracion, pagosRemuneracion, honorarios, parametros, proyectos, proyectosFinancieros, visitas, tareas, ejecuciones, incidencias, ots, stock, movimientosInventario, compras, solicitudes, compromisos, eventos] = await Promise.all([
    prisma.usuario.count(),
    prisma.cliente_financiero.count({ where: { referencia_demostracion: { startsWith: `${PREFIJO}-CLIENTE-` } } }),
    prisma.cotizacion.count({ where: { referencia_demostracion: { startsWith: `${PREFIJO}-COT-` } } }),
    prisma.nota_venta.count({ where: { numero_nota_venta: { startsWith: `${PREFIJO}-NV-` } } }),
    prisma.pago_cliente.count({ where: { referencia_demostracion: { startsWith: `${PREFIJO}-PAGO-` } } }),
    prisma.movimiento_financiero.count({ where: { observacion: { startsWith: `${PREFIJO} Movimiento ` } } }),
    prisma.proveedor.count({ where: { identificador_tributario: { startsWith: `${PREFIJO}-PROV-` } } }),
    prisma.orden_compra_servicio_m5.count({ where: { referencia: { startsWith: `${PREFIJO}-OCS-` } } }),
    prisma.documento_proveedor_m5.count({ where: { folio_normalizado: { startsWith: `${PREFIJO}-DOC-` } } }),
    prisma.obligacion_proveedor_m5.count({ where: { id_documento_m5: { in: idsDocumentoProveedorDemo } } }),
    prisma.operacion_pago_proveedor_m5.count({ where: { id_proveedor: { in: idsProveedorDemo } } }),
    prisma.categoria_egreso_m5.count({ where: { nombre: { startsWith: `${PREFIJO} Categoría ` } } }),
    prisma.envio_importacion_m5.count({ where: { referencia_normalizada: { startsWith: `${PREFIJO}-ENVIO-` } } }),
    prisma.gasto_caja_chica_m5.count({ where: { descripcion: { startsWith: `${PREFIJO} Caja chica ` } } }),
    prisma.empleado.count({ where: { correo_particular: { startsWith: 'demo-ui-empleado', endsWith: '@example.invalid' } } }),
    prisma.esquema_remuneracional.count({ where: { codigo: { startsWith: `${PREFIJO}-ESQUEMA-` } } }),
    prisma.concepto_remuneracion.count({ where: { codigo_m6: { startsWith: `${PREFIJO}-HABER-` } } }),
    prisma.remuneracion.count({ where: { componentes: { some: { clave_negocio: { startsWith: `${PREFIJO}:` } } } } }),
    prisma.remuneracion.count({ where: { estado: { in: ['cerrada', 'reemplazada'] }, componentes: { some: { clave_negocio: { startsWith: `${PREFIJO}:` } } } } }),
    prisma.pago_remuneracion.count({ where: { clave_idempotencia: { startsWith: `${PREFIJO}:PAGO-REM:` } } }),
    prisma.boleta_honorarios.count({ where: { referencia: { startsWith: `${PREFIJO} boleta` } } }),
    prisma.parametro_remuneracional.count({ where: { referencia: PREFIJO } }),
    prisma.proyecto.count({ where: { proyecto_codigo_proyecto: { startsWith: `${PREFIJO}-PROY-` } } }),
    prisma.proyecto_financiero.count({ where: { codigo_proyecto_financiero: { startsWith: `${PREFIJO}-PF-` } } }),
    prisma.servicio_terreno.count({ where: { servicio_terreno_observaciones: { startsWith: `${PREFIJO} visita ` } } }),
    prisma.tarea.count({ where: { tarea_titulo: { startsWith: `${PREFIJO} Tarea ` } } }),
    prisma.ejecucion_tarea.count({ where: { tarea: { tarea_titulo: { startsWith: `${PREFIJO} Tarea ` } } } }),
    prisma.incidencia_retrabajo_tarea.count({ where: { descripcion: { startsWith: `${PREFIJO} incidencia ` } } }),
    prisma.orden_trabajo.count({ where: { especificaciones_puerta: { especificacion_puerta_observaciones: { startsWith: `${PREFIJO}-ESP-` } } } }),
    prisma.inventario_bodega.count({ where: { material_sku: { startsWith: 'DEMOUI-MAT-' }, lote: { lote_numero_lote: { startsWith: `${PREFIJO}-LOTE-` } } } }),
    prisma.movimiento_inventario.count({ where: { lote: { lote_numero_lote: { startsWith: `${PREFIJO}-LOTE-` } } } }),
    prisma.detalle_material_orden_compra_m5.count({ where: { orden_compra: { referencia: { startsWith: `${PREFIJO}-OCS-` } } } }),
    prisma.solicitud_crediticia_m8.count({ where: { referencia_contexto: { startsWith: `${PREFIJO}-SOL-` } } }),
    prisma.compromiso_credito_m8.count({ where: { condiciones: { startsWith: PREFIJO } } }),
    prisma.evento_auditoria_m9.count({ where: { identidad_logica: { startsWith: `${PREFIJO}:` } } }),
  ]);
  const limite = await prisma.limite_global_credito_m8.findFirst({ where: { motivo: { startsWith: PREFIJO } } });
  const exposicion = await prisma.compromiso_credito_m8.aggregate({ where: { condiciones: { startsWith: PREFIJO }, estado: 'VIGENTE' }, _sum: { monto_pendiente: true } });
  return { usuarios, clientes, cotizaciones, notas, pagos, movimientosFinancieros, proveedores, ocs, documentosProveedor, obligaciones, pagosProveedor, categoriasEgreso, envios, cajaChica, empleados, esquemas, haberes, remuneraciones, documentosRemuneracion, pagosRemuneracion, honorarios, parametros, proyectos, proyectosFinancieros, visitas, tareas, ejecuciones, incidencias, ots, stock, movimientosInventario, compras, solicitudes, compromisos, eventos, limiteGlobal: Number(limite?.monto_limite || 0), exposicion: Number(exposicion._sum.monto_pendiente || 0) };
}

async function verificar() {
  const resumen = await conteos();
  const minimos: Record<string, number> = { usuarios: 5, clientes: 10, cotizaciones: 5, notas: 5, pagos: 5, movimientosFinancieros: 5, proveedores: 5, ocs: 5, documentosProveedor: 5, obligaciones: 5, pagosProveedor: 5, categoriasEgreso: 5, envios: 5, cajaChica: 5, empleados: 5, esquemas: 5, haberes: 5, remuneraciones: 5, documentosRemuneracion: 5, pagosRemuneracion: 5, honorarios: 5, parametros: 4, proyectos: 5, proyectosFinancieros: 5, visitas: 5, tareas: 5, ejecuciones: 5, incidencias: 5, ots: 5, stock: 5, movimientosInventario: 5, compras: 5, solicitudes: 5, compromisos: 4, eventos: 40 };
  const fallos = Object.entries(minimos).filter(([clave, minimo]) => Number(resumen[clave as keyof typeof resumen]) < minimo).map(([clave, minimo]) => `${clave}: mínimo ${minimo}, actual ${resumen[clave as keyof typeof resumen]}`);
  if (resumen.limiteGlobal <= 0) fallos.push('límite global M8 no configurado');
  if (resumen.exposicion <= 0) fallos.push('exposición M8 no positiva');
  const panel = await new M7Controller(new AdaptadorCreditoM8ParaM7(new M8Controller())).consultarPanelGeneral({}, Array.from({ length: 44 }, (_, indice) => `CU${215 + indice}`));
  if (!panel.bloques || Object.keys(panel.bloques).length < 5) fallos.push('Dashboard M7 sin bloques suficientes');
  const bloques = panel.bloques as Record<string, { estado?: string }>;
  if (bloques.exposicionCredito?.estado !== 'VALIDO') fallos.push('Dashboard M7 sin productor M8 disponible');
  for (const clave of ['ventas', 'cuentasCobrar', 'cuentasPagar', 'liquidez', 'margenProyectos', 'costoRemuneraciones', 'cargaOperacional', 'instalaciones', 'inventarioValorizado']) if (!bloques[clave] || ['SIN_RESULTADOS', 'DATOS_INSUFICIENTES', 'FUENTE_NO_DISPONIBLE'].includes(String(bloques[clave].estado))) fallos.push(`Dashboard M7 sin datos demostrables en ${clave}`);
  const serializado = JSON.stringify(panel);
  if (!serializado.includes('DEMOUI-MAT-') || !serializado.includes(PREFIJO)) fallos.push('Dashboard M7 sin datos reales DEMO-UI de inventario/operación');
  if (fallos.length) throw new Error(`Dataset DEMO incompleto:\n- ${fallos.join('\n- ')}`);
  console.log(JSON.stringify({ estado: 'OK', ...resumen, bloquesM7: Object.keys(panel.bloques), creditoM7: bloques.exposicionCredito, dependenciasExternas: [] }, null, 2));
}

async function ejecutar() {
  const modo = process.argv[2] || 'seed';
  if (modo === 'seed') { await sembrarFinanzas(); await sembrarProveedoresEInventario(); await sembrarPersonasYOperacion(); await sembrarCredito(); await sembrarAuditoria(); await verificar(); return; }
  if (modo === 'status') { console.log(JSON.stringify(await conteos(), null, 2)); return; }
  if (modo === 'verify') { await verificar(); return; }
  if (modo === 'clean') { await limpiarDemo(); return; }
  throw new Error(`Modo no soportado: ${modo}`);
}

ejecutar().catch(error => { console.error(error instanceof Error ? error.message : error); process.exitCode = 1; }).finally(() => prisma.$disconnect());
