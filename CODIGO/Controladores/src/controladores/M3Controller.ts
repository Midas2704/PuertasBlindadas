import { Prisma } from '@prisma/client';
import { prepararPago } from '../utilidades/pago';
import { identificador, texto } from '../validaciones/solicitudes';
import { prisma } from '../db';
import { ErrorAplicacion } from '../utilidades/ErrorAplicacion';
import { calcularNota, incluirNota, incluirPago, efectoPago } from '../utilidades/finanzas';

/** M3 CU42–CU58. Consultas preparadas; escrituras de pagos se implementarán por etapa. */
export class M3Controller {
  async registrarPago(entrada:Record<string,unknown>,responsable:string) {
    return prisma.$transaction(async tx=>{
      const idNota=identificador(entrada.idNota);
      const nota=await tx.nota_venta.findUnique({where:{id_nota_venta:idNota},include:{...incluirNota,ficha_cliente:{include:{cliente_financiero:true}}}});
      if(!nota || nota.ficha_cliente.cliente_financiero.estado_financiero!=='activo')throw new ErrorAplicacion(409,'Selecciona una NV de un cliente activo');
      const documento=await tx.documento_tributario.findUnique({where:{id_documento_tributario:identificador(entrada.idDocumento)}});
      if(!documento || documento.id_ficha_cliente!==nota.id_ficha_cliente)throw new ErrorAplicacion(400,'El documento tributario debe existir y pertenecer al mismo cliente');
      const catalogo={medios:await tx.medio_pago.findMany({where:{estado_medio_pago:'activo'}}),categorias:await tx.categoria_pago.findMany({where:{activo:true}}),cuotas:await tx.config_cuotas_tarjeta.findMany({where:{activo:true}})};
      const pago=await tx.pago_cliente.create({data:prepararPago(nota,entrada,catalogo,documento.id_documento_tributario,responsable)});
      await tx.documento_tributario_nota_venta.upsert({where:{id_documento_tributario_id_nota_venta:{id_documento_tributario:documento.id_documento_tributario,id_nota_venta:idNota}},update:{},create:{id_documento_tributario:documento.id_documento_tributario,id_nota_venta:idNota}});
      const calculo=await this.recalcularSaldo(tx,idNota);
      return {mensaje:'Pago registrado',idPago:pago.id_pago_cliente,...calculo};
    },{isolationLevel:Prisma.TransactionIsolationLevel.Serializable});
  }
  async recalcularSaldo(tx:Prisma.TransactionClient,idNota:number) {
    const nota=await tx.nota_venta.findUniqueOrThrow({where:{id_nota_venta:idNota},include:incluirNota});
    const calculo=calcularNota(nota);
    // CU50 sólo cambia el estado financiero; el estado comercial permanece intacto.
    await tx.nota_venta.update({where:{id_nota_venta:idNota},data:{estado_pago:calculo.estadoPago}});
    return calculo;
  }
  async procesarExcedente(tx:Prisma.TransactionClient,idNota:number,idReversion:number,entrada:Record<string,unknown>) {
    const calculo=await this.recalcularSaldo(tx,idNota);
    const registrados=await tx.saldo_favor_cliente.aggregate({where:{id_nota_venta:idNota},_sum:{monto_original:true}});
    const disponible=Prisma.Decimal.max(0,new Prisma.Decimal(calculo.excedente).minus(registrados._sum.monto_original || 0));
    if(disponible.gt(0)) {
      const destino=texto(entrada.destino);
      if(!['devolucion','saldo_favor'].includes(destino))throw new ErrorAplicacion(409,'Existe excedente; elige devolución o saldo a favor antes de confirmar');
      await tx.reversion_nota_venta.update({where:{id_reversion_nota_venta:idReversion},data:{destino_excedente:destino}});
      if(destino==='saldo_favor') {
        const nota=await tx.nota_venta.findUniqueOrThrow({where:{id_nota_venta:idNota},include:{ficha_cliente:true}});
        await tx.saldo_favor_cliente.create({data:{id_cliente_financiero:nota.ficha_cliente.id_cliente_financiero,id_nota_venta:idNota,id_reversion_nota_venta:idReversion,monto_original:disponible,monto_disponible:disponible}});
      }
      return {...calculo,excedenteGestionado:disponible.toNumber(),destino,mensaje:destino==='devolucion'?'Reversión registrada; devolución financiera pendiente de ejecutar':'Reversión registrada; saldo a favor disponible'};
    }
    return {...calculo,mensaje:'Reversión registrada sin nuevo excedente'};
  }
  async consultarPago(idPago: number) {
    const pago = await prisma.pago_cliente.findUnique({ where: { id_pago_cliente: idPago }, include: {
      ...incluirPago, asignacion_pago_cliente: true,
    } });
    if (!pago) throw new ErrorAplicacion(404, 'Pago no encontrado');
    return { ...pago, montoEfectivo: efectoPago(pago).toNumber() };
  }
  async consultarSaldo(idNota: number) {
    const nota = await prisma.nota_venta.findUnique({ where: { id_nota_venta: idNota }, include: incluirNota });
    if (!nota) throw new ErrorAplicacion(404, 'Nota de Venta no encontrada');
    return { idNota, moneda: nota.moneda.codigo_moneda, ...calcularNota(nota) };
  }
  async consultarCatalogos(idFicha?:number) {
    const [medios, categorias, cuotas] = await Promise.all([
      prisma.medio_pago.findMany({ where: { estado_medio_pago: 'activo' } }),
      prisma.categoria_pago.findMany({ where: { activo: true } }),
      prisma.config_cuotas_tarjeta.findMany({ where: { activo: true }, orderBy: { cantidad: 'asc' } }),
    ]);
    const documentos=idFicha?await prisma.documento_tributario.findMany({where:{id_ficha_cliente:idFicha},select:{id_documento_tributario:true,folio_documento:true,tipo_documento:{select:{nombre_tipo_documento:true}}}}):[];
    return { medios, categorias, cuotas, documentos };
  }
}
