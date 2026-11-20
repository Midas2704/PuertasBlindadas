"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clasificarMedioPago = clasificarMedioPago;
exports.sugerirCategoriaPago = sugerirCategoriaPago;
exports.prepararPago = prepararPago;
const client_1 = require("@prisma/client");
const finanzas_1 = require("./finanzas");
const ErrorAplicacion_1 = require("./ErrorAplicacion");
const solicitudes_1 = require("../validaciones/solicitudes");
const pdfOperacional_1 = require("./pdfOperacional");
// Los módulos traen los datos desde Prisma; acá sólo preparamos el pago.
function clasificarMedioPago(nombre) {
    const normalizado = nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
    return { credito: normalizado === 'credito' || normalizado === 'tarjeta de credito', cheque: normalizado === 'cheque', efectivo: normalizado === 'efectivo' };
}
const decimalPago = (valor) => {
    try {
        if (valor === null || valor === undefined || valor === '' || typeof valor === 'boolean')
            throw new Error();
        const monto = new client_1.Prisma.Decimal(valor);
        if (!monto.isFinite())
            throw new Error();
        return monto;
    }
    catch {
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Monto inválido');
    }
};
function sugerirCategoriaPago(nota, montoEntrada) {
    const { saldoPendiente, pagosEfectivos } = (0, finanzas_1.montosNota)(nota);
    const monto = decimalPago(montoEntrada);
    if (saldoPendiente.lte(0))
        throw new ErrorAplicacion_1.ErrorAplicacion(409, 'La Nota de Venta no está habilitada para recibir pagos');
    if (monto.lte(0) || monto.gt(saldoPendiente))
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'El pago debe ser positivo y no superar el saldo disponible');
    if (monto.eq(saldoPendiente))
        return 'Pago final';
    return pagosEfectivos.gt(0) ? 'Abono parcial' : 'Anticipo';
}
const normalizarCategoria = (valor) => valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
function prepararPago(nota, entrada, catalogo, idDocumento, responsable) {
    if (['anulada', 'cerrada', 'revertida_total', 'revertida', 'provisional'].includes(nota.estado_nota_venta.toLowerCase()))
        throw new ErrorAplicacion_1.ErrorAplicacion(409, 'La Nota de Venta no está habilitada para recibir pagos');
    const monto = decimalPago(entrada.monto);
    const categoriaSugerida = sugerirCategoriaPago(nota, monto);
    if (!entrada.idMedio)
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Selecciona un medio de pago');
    const medio = catalogo.medios.find(m => m.id_medio_pago === (0, solicitudes_1.identificador)(entrada.idMedio));
    if (!medio)
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Selecciona un medio activo');
    const categoria = entrada.idCategoria
        ? catalogo.categorias.find(c => c.id_categoria_pago === (0, solicitudes_1.identificador)(entrada.idCategoria))
        : catalogo.categorias.find(c => normalizarCategoria(c.nombre) === normalizarCategoria(categoriaSugerida));
    if (!categoria)
        throw new ErrorAplicacion_1.ErrorAplicacion(409, entrada.idCategoria ? 'Selecciona una categoría activa' : `No existe una categoría activa para «${categoriaSugerida}»`);
    const tipoMedio = clasificarMedioPago(medio.nombre_medio_pago);
    if (tipoMedio.credito && !entrada.cuotas)
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'El crédito requiere cuotas');
    const cuotasEntrada = tipoMedio.credito ? Number(entrada.cuotas) : null;
    const cuotas = cuotasEntrada !== null && Number.isInteger(cuotasEntrada) && cuotasEntrada > 0 ? cuotasEntrada : null;
    if (tipoMedio.credito && cuotas === null)
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Ingresa un número de cuotas válido');
    const respaldo = (0, pdfOperacional_1.respaldoOperacional)(entrada.respaldo, 'Respaldo del pago');
    const antecedentes = (0, solicitudes_1.texto)(entrada.antecedentesMedio, 500);
    if (!tipoMedio.efectivo && !antecedentes)
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Falta el antecedente del medio de pago');
    const fechaCobro = (0, solicitudes_1.texto)(entrada.fechaCobro, 20);
    if (tipoMedio.cheque && (!/^\d{4}-\d{2}-\d{2}$/.test(fechaCobro) || fechaCobro <= (0, finanzas_1.fechaNegocio)()))
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'La fecha de cobro del cheque debe ser futura');
    const usd = nota.moneda.codigo_moneda === 'USD';
    const factor = usd ? new client_1.Prisma.Decimal((0, solicitudes_1.numeroNoNegativo)(entrada.tipoCambio, 'Tipo de cambio confirmado')) : null;
    if (factor?.lte(0))
        throw new ErrorAplicacion_1.ErrorAplicacion(400, 'Tipo de cambio inválido');
    return { id_ficha_cliente: nota.id_ficha_cliente, id_moneda: nota.id_moneda, id_medio_pago: medio.id_medio_pago, id_categoria_pago: categoria.id_categoria_pago, cantidad_cuotas: cuotas,
        fecha_pago: new Date(`${(0, finanzas_1.fechaNegocio)()}T00:00:00Z`), monto_pago: monto, comprobante_pago: respaldo,
        tipo_cambio_usado: factor, monto_convertido: factor ? monto.mul(factor).toDecimalPlaces(2) : null,
        observacion: `Registrado por ${responsable}${usd ? ' · Tipo de cambio confirmado manualmente' : ''}`,
        antecedentes_medio: tipoMedio.efectivo ? undefined : tipoMedio.cheque ? { referencia: antecedentes, fechaCobro } : entrada.antecedentesMedio && typeof entrada.antecedentesMedio === 'object' ? entrada.antecedentesMedio : antecedentes || undefined,
        asignacion_pago_cliente: { create: { id_nota_venta: nota.id_nota_venta, id_documento_tributario: idDocumento, monto_asignado: monto } }, };
}
//# sourceMappingURL=pago.js.map