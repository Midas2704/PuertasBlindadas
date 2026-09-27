import { Prisma } from '@prisma/client';

export type OrigenPagoRemuneracion =
  | { clase: 'remuneracion'; id: number }
  | { clase: 'anticipo'; id: number }
  | { clase: 'regularizacion'; id: number };

type ClientePago = Pick<Prisma.TransactionClient, 'pago_remuneracion'>;

const tiposFisicos = {
  remuneracion: 'REMUNERACION',
  anticipo: 'ANTICIPO',
  regularizacion: 'REGULARIZACION',
} as const;

export class RepositorioPagoRemuneracionPrisma {
  remuneracion(id: number): OrigenPagoRemuneracion { return { clase: 'remuneracion', id }; }
  anticipo(id: number): OrigenPagoRemuneracion { return { clase: 'anticipo', id }; }
  regularizacion(id: number): OrigenPagoRemuneracion { return { clase: 'regularizacion', id }; }

  desdePersistencia(tipo: string, id: number): OrigenPagoRemuneracion {
    if (tipo === tiposFisicos.remuneracion) return this.remuneracion(id);
    if (tipo === tiposFisicos.anticipo) return this.anticipo(id);
    if (tipo === tiposFisicos.regularizacion) return this.regularizacion(id);
    throw new Error(`Tipo físico de origen de pago no soportado: ${tipo}`);
  }

  origenDesdePago(pago: { origen_tipo: string; origen_id: number }) {
    return this.desdePersistencia(pago.origen_tipo, pago.origen_id);
  }

  tipoPublico(origen: OrigenPagoRemuneracion) { return tiposFisicos[origen.clase]; }

  private criterio(origen: OrigenPagoRemuneracion) {
    return { origen_tipo: tiposFisicos[origen.clase], origen_id: origen.id };
  }

  async tienePagoEfectivo(cliente: ClientePago, origen: OrigenPagoRemuneracion) {
    return (await cliente.pago_remuneracion.count({ where: { ...this.criterio(origen), estado: 'CONFIRMADO' } })) > 0;
  }

  async buscarPagoEfectivo(cliente: ClientePago, origen: OrigenPagoRemuneracion) {
    return cliente.pago_remuneracion.findFirst({ where: { ...this.criterio(origen), estado: 'CONFIRMADO' } });
  }

  async pagosEfectivosAnticipos(cliente: ClientePago, ids: number[]) {
    if (!ids.length) return [];
    const filas = await cliente.pago_remuneracion.findMany({ where: { origen_tipo: tiposFisicos.anticipo, origen_id: { in: ids }, estado: 'CONFIRMADO' } });
    return filas.map((fila) => ({ idAnticipo: fila.origen_id, idPago: fila.id_pago_remuneracion }));
  }

  async buscarPorClave(cliente: ClientePago, clave: string) {
    return cliente.pago_remuneracion.findUnique({ where: { clave_idempotencia: clave } });
  }

  async crearPreparado(cliente: ClientePago, origen: OrigenPagoRemuneracion, data: {
    monto: Prisma.Decimal; idMedioPago: number; respaldo: string | null; referencia: string | null;
    claveIdempotencia: string; creadoPor: bigint;
  }) {
    return cliente.pago_remuneracion.create({ data: {
      ...this.criterio(origen), monto: data.monto, id_medio_pago: data.idMedioPago,
      respaldo: data.respaldo, referencia: data.referencia,
      clave_idempotencia: data.claveIdempotencia, creado_por: data.creadoPor,
    } });
  }

  async obtener(cliente: ClientePago, id: number, incluirMedio = false) {
    return cliente.pago_remuneracion.findUnique({
      where: { id_pago_remuneracion: id },
      ...(incluirMedio ? { include: { medio_pago: true } } : {}),
    });
  }

  async actualizarPreparado(cliente: ClientePago, id: number, data: {
    monto: Prisma.Decimal; idMedioPago: number; respaldo: string | null; referencia: string | null;
  }) {
    return cliente.pago_remuneracion.update({ where: { id_pago_remuneracion: id }, data: {
      monto: data.monto, id_medio_pago: data.idMedioPago, respaldo: data.respaldo, referencia: data.referencia,
    } });
  }

  async confirmarPreparado(cliente: ClientePago, id: number, idUsuario: bigint) {
    return cliente.pago_remuneracion.updateMany({
      where: { id_pago_remuneracion: id, estado: 'PREPARADO' },
      data: { estado: 'CONFIRMADO', confirmado_por: idUsuario, confirmado_en: new Date() },
    });
  }

  async listar(cliente: ClientePago) {
    return cliente.pago_remuneracion.findMany({ include: { medio_pago: true }, orderBy: { creado_en: 'desc' }, take: 100 });
  }
}
