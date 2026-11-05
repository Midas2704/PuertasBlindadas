import { createHash } from 'node:crypto';
import { Prisma, type PrismaClient } from '@prisma/client';
import { prisma } from '../db';
import type { ActorAutenticado } from '../controladores/M4Controller';
import { M9Controller } from '../controladores/M9Controller';
import { ProductorAuditoriaM9 } from '../m9/contratoProductor';
import { RepositorioAuditoriaM9Prisma } from '../m9/RepositorioAuditoriaM9';
import { ErrorAplicacion } from '../utilidades/ErrorAplicacion';
import { esReservaInventarioActiva } from './contratosInventario';

type TipoOperacion = 'ENTRADA'|'SALIDA'|'RESERVA'|'LIBERACION'|'AJUSTE';
type EntradaBase = { claveIdempotencia:string; sku:string; bodegaId:string|number|bigint; loteId:string|number|bigint; motivo:string };
export type EntradaLiberacionInventario = EntradaBase;
export type EntradaMovimientoInventario = EntradaBase & { cantidad:string|number; tipoMovimientoId:string|number|bigint; motivoMovimientoId:string|number|bigint; proyectoId?:string|number|bigint; facturaCompraId?:string|number|bigint };
export type EntradaReservaInventario = EntradaBase & { cantidad:string|number; proyectoId?:string|number|bigint; ordenTrabajoId?:string|number|bigint };
export type EntradaAjusteInventario = EntradaBase & { cantidadNueva:string|number; tipoMovimientoId:string|number|bigint; motivoMovimientoId:string|number|bigint };

const id = (valor: string|number|bigint, campo:string) => {
  try { const salida=BigInt(valor); if(salida<=0n) throw new Error(); return salida; }
  catch { throw new ErrorAplicacion(400, `${campo} inválido`, 'INVENTARIO_IDENTIFICADOR_INVALIDO'); }
};
const cantidad = (valor: string|number, campo='Cantidad') => {
  try { const salida=new Prisma.Decimal(valor); if(!salida.isPositive()) throw new Error(); return salida; }
  catch { throw new ErrorAplicacion(400, `${campo} debe ser mayor que cero`, 'INVENTARIO_CANTIDAD_INVALIDA'); }
};
const texto = (valor:string, campo:string, maximo:number) => {
  const salida=valor?.trim(); if(!salida || salida.length>maximo) throw new ErrorAplicacion(400, `${campo} inválido`, 'INVENTARIO_DATO_INVALIDO'); return salida;
};
const normalizar = (valor:string|null|undefined) => (valor??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase();
const jsonSeguro = (valor:unknown): Prisma.InputJsonValue => JSON.parse(JSON.stringify(valor)) as Prisma.InputJsonValue;
const hashSolicitud = (tipo:TipoOperacion, datos:Record<string,unknown>) => createHash('sha256').update(JSON.stringify({tipo,...datos}, Object.keys({tipo,...datos}).sort())).digest('hex');
const esConflictoSerializable = (error:unknown) => {
  const detalle=error as {code?:string;message?:string;meta?:{code?:string;message?:string}};
  return ['P2034','P2002','40001'].includes(detalle.code??'')
    || detalle.meta?.code==='40001'
    || /(?:40001|could not serialize access)/i.test(`${detalle.message??''} ${detalle.meta?.message??''}`);
};

type ResultadoOperacion = { operacionId:string; tipo:TipoOperacion; movimientoId?:string; reservaId?:string; sku:string; bodegaId:string; loteId:string; fisico:string; reservado:string; disponible:string; repetida:boolean; __auditoriaM9?:{anterior:Record<string,unknown>;nuevo:Record<string,unknown>} };

/** Único owner de escrituras físicas INT-03. Las rutas públicas permanecen fail-closed hasta aprobar CU específicos. */
export class ServicioOperacionalInventario {
  constructor(private readonly db:PrismaClient=prisma) {}

  private async transaccion<T>(accion:(tx:Prisma.TransactionClient)=>Promise<T>):Promise<T>{
    for(let intento=0;;intento++) try {
      return await this.db.$transaction(accion,{isolationLevel:Prisma.TransactionIsolationLevel.Serializable,timeout:30000});
    } catch(error) { if(esConflictoSerializable(error)&&intento<2) continue; throw error; }
  }

  private async existenciaBloqueada(tx:Prisma.TransactionClient, sku:string, bodegaId:bigint, loteId:bigint, permitirCrear=false){
    const [material,bodega,lote]=await Promise.all([
      tx.material.findUnique({where:{material_sku:sku},select:{material_sku:true,material_estado:true}}),
      tx.bodega.findUnique({where:{bodega_id_bodega:bodegaId},select:{bodega_id_bodega:true,bodega_estado:true}}),
      tx.lote.findUnique({where:{lote_id_lote:loteId},select:{lote_id_lote:true,lote_estado:true}}),
    ]);
    if(!material) throw new ErrorAplicacion(404,'Material no encontrado','INVENTARIO_MATERIAL_NO_ENCONTRADO');
    if(!bodega) throw new ErrorAplicacion(404,'Bodega no encontrada','INVENTARIO_BODEGA_NO_ENCONTRADA');
    if(!lote) throw new ErrorAplicacion(404,'Lote no encontrado','INVENTARIO_LOTE_NO_ENCONTRADO');
    await tx.$queryRaw(Prisma.sql`SELECT 1 FROM "inventario"."inventario_bodega" WHERE "material_sku"=${sku} AND "bodega_id_bodega"=${bodegaId} AND "lote_id_lote"=${loteId} FOR UPDATE`);
    let existencia=await tx.inventario_bodega.findUnique({where:{material_sku_lote_id_lote_bodega_id_bodega:{material_sku:sku,lote_id_lote:loteId,bodega_id_bodega:bodegaId}}});
    if(!existencia&&permitirCrear) existencia=await tx.inventario_bodega.create({data:{material_sku:sku,bodega_id_bodega:bodegaId,lote_id_lote:loteId,inventario_bodega_cantidad_fisica:new Prisma.Decimal(0),inventario_bodega_cantidad_reservada:new Prisma.Decimal(0)}});
    if(!existencia) throw new ErrorAplicacion(404,'No existe stock para la ubicación indicada','INVENTARIO_EXISTENCIA_NO_ENCONTRADA');
    return existencia;
  }

  private async catalogosMovimiento(tx:Prisma.TransactionClient,tipoId:bigint,motivoId:bigint,esperado:'entrada'|'salida'|'ajuste'){
    const [tipo,motivo]=await Promise.all([
      tx.movimiento_inventario_tipo_movimiento.findUnique({where:{movimiento_inventario_tipo_movimiento_id_tipo_movimiento:tipoId}}),
      tx.movimiento_inventario_motivo_movimiento.findUnique({where:{movimiento_inventario_motivo_movimiento_id_motivo_movimiento:motivoId}}),
    ]);
    if(!tipo||!normalizar(tipo.movimiento_inventario_tipo_movimiento_nombre).includes(esperado)) throw new ErrorAplicacion(400,`Tipo de movimiento no acredita ${esperado}`,'INVENTARIO_TIPO_MOVIMIENTO_INVALIDO');
    if(!motivo) throw new ErrorAplicacion(400,'Motivo de movimiento inválido','INVENTARIO_MOTIVO_INVALIDO');
  }

  private async ejecutar(tipo:TipoOperacion,entrada:EntradaBase,actor:ActorAutenticado,accion:(tx:Prisma.TransactionClient,base:{sku:string;bodegaId:bigint;loteId:bigint;clave:string;motivo:string})=>Promise<Omit<ResultadoOperacion,'operacionId'|'tipo'|'repetida'>>,datosHash:Record<string,unknown>){
    const clave=texto(entrada.claveIdempotencia,'Clave de idempotencia',160), sku=texto(entrada.sku,'SKU',16), motivo=texto(entrada.motivo,'Motivo',4000);
    const bodegaId=id(entrada.bodegaId,'Bodega'),loteId=id(entrada.loteId,'Lote');
    const hash=hashSolicitud(tipo,{sku,bodegaId:bodegaId.toString(),loteId:loteId.toString(),...datosHash});
    return this.transaccion(async tx=>{
      const previa=await tx.operacion_inventario.findUnique({where:{clave_idempotencia:clave}});
      if(previa){
        if(previa.hash_solicitud!==hash) throw new ErrorAplicacion(409,'La clave de idempotencia ya fue usada con otros datos','INVENTARIO_IDEMPOTENCIA_CONFLICTO');
        return {...(previa.resultado as unknown as ResultadoOperacion),repetida:true};
      }
      const resultado=await accion(tx,{sku,bodegaId,loteId,clave,motivo});
      const operacion=await tx.operacion_inventario.create({data:{clave_idempotencia:clave,tipo_operacion:tipo,hash_solicitud:hash,actor_id:actor.id,material_sku:sku,bodega_id_bodega:bodegaId,lote_id_lote:loteId,movimiento_inventario_id:resultado.movimientoId?BigInt(resultado.movimientoId):null,reserva_inventario_id:resultado.reservaId?BigInt(resultado.reservaId):null,resultado:jsonSeguro({...resultado,tipo,repetida:false})}});
      const salida:ResultadoOperacion={...resultado,operacionId:operacion.operacion_inventario_id.toString(),tipo,repetida:false};
      await tx.operacion_inventario.update({where:{operacion_inventario_id:operacion.operacion_inventario_id},data:{resultado:jsonSeguro(salida)}});
      const productor=new ProductorAuditoriaM9(new M9Controller({repositorio:new RepositorioAuditoriaM9Prisma(tx)}));
      const nombre={ENTRADA:'registrarEntradaInventario',SALIDA:'registrarSalidaInventario',RESERVA:'crearReservaInventario',LIBERACION:'liberarReservaInventario',AJUSTE:'ajustarExistenciaInventario'}[tipo];
      return productor.ejecutar(nombre,actor,{parametros:{id:salida.movimientoId??salida.reservaId??salida.operacionId},cuerpo:{motivo},idSolicitud:clave,ocurridoEn:new Date().toISOString()},async()=>salida);
    });
  }

  registrarEntrada(entrada:EntradaMovimientoInventario,actor:ActorAutenticado){
    const cant=cantidad(entrada.cantidad),tipoId=id(entrada.tipoMovimientoId,'Tipo de movimiento'),motivoId=id(entrada.motivoMovimientoId,'Motivo de movimiento');
    return this.ejecutar('ENTRADA',entrada,actor,async(tx,b)=>{await this.catalogosMovimiento(tx,tipoId,motivoId,'entrada');const e=await this.existenciaBloqueada(tx,b.sku,b.bodegaId,b.loteId,true);const antes=new Prisma.Decimal(e.inventario_bodega_cantidad_fisica??0),reservado=new Prisma.Decimal(e.inventario_bodega_cantidad_reservada??0),despues=antes.plus(cant);const mov=await tx.movimiento_inventario.create({data:{movimiento_inventario_fecha_hora:new Date(),movimiento_inventario_cantidad:cant,movimiento_inventario_estado:'confirmado',material_sku:b.sku,bodega_id_bodega:b.bodegaId,lote_id_lote:b.loteId,proyecto_id_proyecto:entrada.proyectoId?id(entrada.proyectoId,'Proyecto'):null,factura_compra_id_factura_compra:entrada.facturaCompraId?id(entrada.facturaCompraId,'Factura'):null,usuario_id_usuario:actor.id,movimiento_inventario_tipo_movimiento_id_tipo_movimiento:tipoId,movimiento_inventario_motivo_movimiento_id_motivo_movimiento:motivoId}});await tx.inventario_bodega.update({where:{material_sku_lote_id_lote_bodega_id_bodega:{material_sku:b.sku,lote_id_lote:b.loteId,bodega_id_bodega:b.bodegaId}},data:{inventario_bodega_cantidad_fisica:despues}});return{movimientoId:mov.movimiento_inventario_id_movimiento.toString(),sku:b.sku,bodegaId:b.bodegaId.toString(),loteId:b.loteId.toString(),fisico:despues.toString(),reservado:reservado.toString(),disponible:despues.minus(reservado).toString(),__auditoriaM9:{anterior:{fisico:antes.toString()},nuevo:{fisico:despues.toString()}}};},{cantidad:cant.toString(),tipoId:tipoId.toString(),motivoId:motivoId.toString()});
  }

  registrarSalida(entrada:EntradaMovimientoInventario,actor:ActorAutenticado){
    const cant=cantidad(entrada.cantidad),tipoId=id(entrada.tipoMovimientoId,'Tipo de movimiento'),motivoId=id(entrada.motivoMovimientoId,'Motivo de movimiento');
    return this.ejecutar('SALIDA',entrada,actor,async(tx,b)=>{await this.catalogosMovimiento(tx,tipoId,motivoId,'salida');const e=await this.existenciaBloqueada(tx,b.sku,b.bodegaId,b.loteId);const antes=new Prisma.Decimal(e.inventario_bodega_cantidad_fisica??0),reservado=new Prisma.Decimal(e.inventario_bodega_cantidad_reservada??0),despues=antes.minus(cant);if(despues.isNegative())throw new ErrorAplicacion(409,'Stock físico insuficiente','INVENTARIO_STOCK_INSUFICIENTE');if(despues.lessThan(reservado))throw new ErrorAplicacion(409,'La salida afectaría stock reservado; falta contrato de consumo de reserva','INVENTARIO_STOCK_RESERVADO');const mov=await tx.movimiento_inventario.create({data:{movimiento_inventario_fecha_hora:new Date(),movimiento_inventario_cantidad:cant,movimiento_inventario_estado:'confirmado',material_sku:b.sku,bodega_id_bodega:b.bodegaId,lote_id_lote:b.loteId,proyecto_id_proyecto:entrada.proyectoId?id(entrada.proyectoId,'Proyecto'):null,usuario_id_usuario:actor.id,movimiento_inventario_tipo_movimiento_id_tipo_movimiento:tipoId,movimiento_inventario_motivo_movimiento_id_motivo_movimiento:motivoId}});await tx.inventario_bodega.update({where:{material_sku_lote_id_lote_bodega_id_bodega:{material_sku:b.sku,lote_id_lote:b.loteId,bodega_id_bodega:b.bodegaId}},data:{inventario_bodega_cantidad_fisica:despues}});return{movimientoId:mov.movimiento_inventario_id_movimiento.toString(),sku:b.sku,bodegaId:b.bodegaId.toString(),loteId:b.loteId.toString(),fisico:despues.toString(),reservado:reservado.toString(),disponible:despues.minus(reservado).toString(),__auditoriaM9:{anterior:{fisico:antes.toString()},nuevo:{fisico:despues.toString()}}};},{cantidad:cant.toString(),tipoId:tipoId.toString(),motivoId:motivoId.toString()});
  }

  crearReserva(entrada:EntradaReservaInventario,actor:ActorAutenticado){
    const cant=cantidad(entrada.cantidad);
    return this.ejecutar('RESERVA',entrada,actor,async(tx,b)=>{const e=await this.existenciaBloqueada(tx,b.sku,b.bodegaId,b.loteId);const fisico=new Prisma.Decimal(e.inventario_bodega_cantidad_fisica??0),antes=new Prisma.Decimal(e.inventario_bodega_cantidad_reservada??0),despues=antes.plus(cant);if(despues.greaterThan(fisico))throw new ErrorAplicacion(409,'Stock disponible insuficiente para reservar','INVENTARIO_DISPONIBILIDAD_INSUFICIENTE');const reserva=await tx.reserva_inventario.create({data:{reserva_inventario_cantidad_reservada:cant,reserva_inventario_fecha_reserva:new Date(),reserva_inventario_estado_reserva:'activa',material_sku:b.sku,bodega_id_bodega:b.bodegaId,lote_id_lote:b.loteId,proyecto_id_proyecto:entrada.proyectoId?id(entrada.proyectoId,'Proyecto'):null,orden_trabajo_id_orden:entrada.ordenTrabajoId?id(entrada.ordenTrabajoId,'Orden de trabajo'):null}});await tx.inventario_bodega.update({where:{material_sku_lote_id_lote_bodega_id_bodega:{material_sku:b.sku,lote_id_lote:b.loteId,bodega_id_bodega:b.bodegaId}},data:{inventario_bodega_cantidad_reservada:despues}});return{reservaId:reserva.reserva_inventario_id_reserva.toString(),sku:b.sku,bodegaId:b.bodegaId.toString(),loteId:b.loteId.toString(),fisico:fisico.toString(),reservado:despues.toString(),disponible:fisico.minus(despues).toString(),__auditoriaM9:{anterior:{reservado:antes.toString()},nuevo:{reservado:despues.toString()}}};},{cantidad:cant.toString(),proyectoId:String(entrada.proyectoId??''),ordenTrabajoId:String(entrada.ordenTrabajoId??'')});
  }

  liberarReserva(reservaIdEntrada:string|number|bigint,entrada:EntradaBase,actor:ActorAutenticado){
    const reservaId=id(reservaIdEntrada,'Reserva');
    return this.ejecutar('LIBERACION',entrada,actor,async(tx,b)=>{const reserva=await tx.reserva_inventario.findUnique({where:{reserva_inventario_id_reserva:reservaId}});if(!reserva)throw new ErrorAplicacion(404,'Reserva no encontrada','INVENTARIO_RESERVA_NO_ENCONTRADA');if(reserva.material_sku!==b.sku||reserva.bodega_id_bodega!==b.bodegaId||reserva.lote_id_lote!==b.loteId)throw new ErrorAplicacion(409,'La reserva no pertenece a la ubicación indicada','INVENTARIO_RESERVA_UBICACION_INVALIDA');if(!esReservaInventarioActiva(reserva))throw new ErrorAplicacion(409,'La reserva ya no está activa','INVENTARIO_RESERVA_INACTIVA');const e=await this.existenciaBloqueada(tx,b.sku,b.bodegaId,b.loteId),fisico=new Prisma.Decimal(e.inventario_bodega_cantidad_fisica??0),antes=new Prisma.Decimal(e.inventario_bodega_cantidad_reservada??0),cant=new Prisma.Decimal(reserva.reserva_inventario_cantidad_reservada??0),despues=antes.minus(cant);if(despues.isNegative())throw new ErrorAplicacion(409,'La reserva agregada no concilia con su detalle','INVENTARIO_RESERVA_INCONSISTENTE');await tx.reserva_inventario.update({where:{reserva_inventario_id_reserva:reservaId},data:{reserva_inventario_estado_reserva:'liberada',reserva_inventario_fecha_liberacion:new Date()}});await tx.inventario_bodega.update({where:{material_sku_lote_id_lote_bodega_id_bodega:{material_sku:b.sku,lote_id_lote:b.loteId,bodega_id_bodega:b.bodegaId}},data:{inventario_bodega_cantidad_reservada:despues}});return{reservaId:reservaId.toString(),sku:b.sku,bodegaId:b.bodegaId.toString(),loteId:b.loteId.toString(),fisico:fisico.toString(),reservado:despues.toString(),disponible:fisico.minus(despues).toString(),__auditoriaM9:{anterior:{estado:reserva.reserva_inventario_estado_reserva??'activa',reservado:antes.toString()},nuevo:{estado:'liberada',reservado:despues.toString()}}};},{reservaId:reservaId.toString()});
  }

  ajustarExistencia(entrada:EntradaAjusteInventario,actor:ActorAutenticado){
    const nueva=cantidad(entrada.cantidadNueva,'Cantidad nueva'),tipoId=id(entrada.tipoMovimientoId,'Tipo de movimiento'),motivoId=id(entrada.motivoMovimientoId,'Motivo de movimiento');
    return this.ejecutar('AJUSTE',entrada,actor,async(tx,b)=>{await this.catalogosMovimiento(tx,tipoId,motivoId,'ajuste');const e=await this.existenciaBloqueada(tx,b.sku,b.bodegaId,b.loteId);const antes=new Prisma.Decimal(e.inventario_bodega_cantidad_fisica??0),reservado=new Prisma.Decimal(e.inventario_bodega_cantidad_reservada??0);if(nueva.lessThan(reservado))throw new ErrorAplicacion(409,'El ajuste negativo afectaría stock reservado','INVENTARIO_AJUSTE_AFECTA_RESERVAS');const diferencia=nueva.minus(antes);if(diferencia.isZero())throw new ErrorAplicacion(409,'La existencia ya tiene la cantidad indicada','INVENTARIO_AJUSTE_SIN_CAMBIO');const mov=await tx.movimiento_inventario.create({data:{movimiento_inventario_fecha_hora:new Date(),movimiento_inventario_cantidad:diferencia.abs(),movimiento_inventario_estado:'confirmado',material_sku:b.sku,bodega_id_bodega:b.bodegaId,lote_id_lote:b.loteId,usuario_id_usuario:actor.id,movimiento_inventario_tipo_movimiento_id_tipo_movimiento:tipoId,movimiento_inventario_motivo_movimiento_id_motivo_movimiento:motivoId}});await tx.inventario_bodega.update({where:{material_sku_lote_id_lote_bodega_id_bodega:{material_sku:b.sku,lote_id_lote:b.loteId,bodega_id_bodega:b.bodegaId}},data:{inventario_bodega_cantidad_fisica:nueva}});return{movimientoId:mov.movimiento_inventario_id_movimiento.toString(),sku:b.sku,bodegaId:b.bodegaId.toString(),loteId:b.loteId.toString(),fisico:nueva.toString(),reservado:reservado.toString(),disponible:nueva.minus(reservado).toString(),__auditoriaM9:{anterior:{fisico:antes.toString()},nuevo:{fisico:nueva.toString(),diferencia:diferencia.toString()}}};},{cantidadNueva:nueva.toString(),tipoId:tipoId.toString(),motivoId:motivoId.toString()});
  }
}
