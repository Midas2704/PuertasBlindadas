import { Prisma } from '@prisma/client';
import { prisma } from '../db';
import { ErrorAplicacion } from '../utilidades/ErrorAplicacion';
import { normalizarUbicacion } from './contratosCatalogoComercial';
import { AutorizadorCapacidadComercial, validarSolicitudEscrituraComercial, type ActorComercialM4, type OperacionSeguraComercial } from './SeguridadCapacidadesComerciales';

type Entrada = Record<string, unknown>;
const id = (v:unknown,n:string) => { const x=Number(v); if(!Number.isInteger(x)||x<1)throw new ErrorAplicacion(400,`${n} inválido`); return x; };
const str = (v:unknown,n:string,max=1000) => { const x=String(v??'').trim(); if(!x||x.length>max)throw new ErrorAplicacion(400,`${n} inválido`); return x; };
const opt = (v:unknown,max=4000) => { const x=String(v??'').trim(); return x ? x.slice(0,max) : null; };
const date = (v:unknown) => new Date(`${String(v)}T12:00:00.000Z`);
const jsonSeguro = (v:unknown): Prisma.InputJsonValue => JSON.parse(JSON.stringify(v)) as Prisma.InputJsonValue;

/** Escrituras C2.7: transaccionales, idempotentes y con filas históricas conservadas. */
export class ServicioEscrituraComercial {
  private readonly autorizador = new AutorizadorCapacidadComercial();

  async ejecutar(operacion:OperacionSeguraComercial, entradaDesconocida:unknown, actor:ActorComercialM4) {
    await this.autorizador.exigir(actor,operacion);
    const validada=validarSolicitudEscrituraComercial(operacion,entradaDesconocida);
    const entrada=entradaDesconocida as Entrada;
    return prisma.$transaction(async tx => {
      const creada=await tx.idempotencia_operacion_comercial.createMany({data:{clave:validada.claveIdempotencia,operacion,actor_id:actor.id},skipDuplicates:true});
      if(!creada.count){
        const previa=await tx.idempotencia_operacion_comercial.findUnique({where:{clave:validada.claveIdempotencia}});
        if(!previa || previa.operacion!==operacion || previa.actor_id!==actor.id) throw new ErrorAplicacion(409,'La clave de idempotencia pertenece a otra operación','IDEMPOTENCIA_CONFLICTO');
        if(previa.respuesta!==null) return previa.respuesta;
        throw new ErrorAplicacion(409,'La operación idempotente se encuentra en proceso','IDEMPOTENCIA_EN_PROCESO');
      }
      const salida=await this.mutar(tx,operacion,entrada,actor.id);
      await tx.idempotencia_operacion_comercial.update({where:{clave:validada.claveIdempotencia},data:{respuesta:jsonSeguro(salida),completado_en:new Date()}});
      return salida;
    },{isolationLevel:Prisma.TransactionIsolationLevel.Serializable});
  }

  private async mutar(tx:Prisma.TransactionClient, op:OperacionSeguraComercial, e:Entrada, actor:bigint):Promise<Record<string,unknown>> {
    if(op==='CREAR_SERVICIO'){
      const segmento=String(e.segmento),moneda=id(e.idMoneda,'Moneda');
      const servicio=await tx.servicio_comercial.create({data:{codigo:str(e.codigo,'Código',50).toUpperCase(),nombre:str(e.nombre,'Nombre',160),descripcion:opt(e.descripcion),unidad_cobro:str(e.unidadCobro,'Unidad de cobro',40).toUpperCase(),habilitado_b2b:e.habilitadoB2b===true,habilitado_b2c:e.habilitadoB2c===true,creado_por:actor}});
      const precio=await tx.precio_servicio_comercial.create({data:{id_servicio_comercial:servicio.id_servicio_comercial,segmento_comercial:segmento,id_moneda:moneda,monto:new Prisma.Decimal(Number(e.monto)),vigencia_desde:date(e.vigenciaDesde),vigencia_hasta:e.vigenciaHasta?date(e.vigenciaHasta):null,motivo:str(e.motivo,'Motivo'),creado_por:actor}});
      return {id:servicio.id_servicio_comercial.toString(),version:servicio.revision,idPrecio:precio.id_precio_servicio_comercial.toString(),__auditoriaM9:{nuevo:{id:servicio.id_servicio_comercial.toString(),codigo:servicio.codigo,idPrecio:precio.id_precio_servicio_comercial.toString()}}};
    }
    if(op==='VERSIONAR_PRECIO_SERVICIO'){
      const servicio=BigInt(id(e.idServicio,'Servicio')),segmento=String(e.segmento),moneda=id(e.idMoneda,'Moneda');
      const catalogo=await tx.servicio_comercial.findUnique({where:{id_servicio_comercial:servicio}});if(!catalogo||catalogo.estado!=='ACTIVO')throw new ErrorAplicacion(409,'El servicio no está activo');
      const anterior=await tx.precio_servicio_comercial.findFirst({where:{id_servicio_comercial:servicio,segmento_comercial:segmento,id_moneda:moneda,estado:'ACTIVO'},orderBy:{revision:'desc'}});
      if(anterior){const retirada=await tx.precio_servicio_comercial.updateMany({where:{id_precio_servicio_comercial:anterior.id_precio_servicio_comercial,revision:anterior.revision,estado:'ACTIVO'},data:{estado:'INACTIVO',revision:{increment:1},actualizado_en:new Date()}});if(!retirada.count)throw new ErrorAplicacion(409,'El precio fue modificado por otro usuario','REVISION_DESACTUALIZADA');}
      const fila=await tx.precio_servicio_comercial.create({data:{id_servicio_comercial:servicio,segmento_comercial:segmento,id_moneda:moneda,monto:new Prisma.Decimal(Number(e.monto)),vigencia_desde:date(e.vigenciaDesde),vigencia_hasta:e.vigenciaHasta?date(e.vigenciaHasta):null,motivo:str(e.motivo,'Motivo'),revision:(anterior?.revision??0)+1,creado_por:actor}});
      return {id:fila.id_precio_servicio_comercial.toString(),version:fila.revision,__auditoriaM9:{anterior:anterior?{id:anterior.id_precio_servicio_comercial.toString(),revision:anterior.revision}:undefined,nuevo:{id:fila.id_precio_servicio_comercial.toString(),revision:fila.revision}}};
    }
    if(op==='DESACTIVAR_SERVICIO') return this.desactivar(tx.servicio_comercial,'id_servicio_comercial',e,actor);
    if(op==='CREAR_PRECIO' || op==='VERSIONAR_PRECIO'){
      const producto=id(e.idProducto,'Producto'), moneda=id(e.idMoneda,'Moneda');
      const anterior=op==='VERSIONAR_PRECIO'?await tx.precio_producto_comercial.findUnique({where:{id_precio_producto_comercial:BigInt(id(e.idAnterior,'Precio anterior'))}}):null;
      if(anterior && (anterior.id_extension_producto_comercial!==producto || anterior.segmento_comercial!==e.segmento || anterior.id_moneda!==moneda)) throw new ErrorAplicacion(409,'La nueva versión no corresponde al mismo producto, segmento y moneda');
      if(anterior){
        const retirada=await tx.precio_producto_comercial.updateMany({where:{id_precio_producto_comercial:anterior.id_precio_producto_comercial,revision:anterior.revision,estado:'ACTIVO'},data:{estado:'INACTIVO',revision:{increment:1},actualizado_en:new Date()}});
        if(!retirada.count)throw new ErrorAplicacion(409,'El precio fue modificado por otro usuario','REVISION_DESACTUALIZADA');
      }
      const fila=await tx.precio_producto_comercial.create({data:{id_extension_producto_comercial:producto,segmento_comercial:String(e.segmento),id_moneda:moneda,monto:new Prisma.Decimal(Number(e.monto)),vigencia_desde:date(e.vigenciaDesde),vigencia_hasta:e.vigenciaHasta?date(e.vigenciaHasta):null,motivo:str(e.motivo,'Motivo'),revision:(anterior?.revision??0)+1,creado_por:actor}});
      return {id:fila.id_precio_producto_comercial.toString(),version:fila.revision,__auditoriaM9:{anterior:anterior?{id:anterior.id_precio_producto_comercial.toString(),revision:anterior.revision}:undefined,nuevo:{id:fila.id_precio_producto_comercial.toString(),revision:fila.revision}}};
    }
    if(op==='DESACTIVAR_PRECIO') return this.desactivar(tx.precio_producto_comercial,'id_precio_producto_comercial',e,actor);
    if(op==='CREAR_OPCIONAL'){
      const fila=await tx.opcional_comercial.create({data:{codigo:str(e.codigo,'Código',60).toUpperCase(),nombre:str(e.nombre,'Nombre',200),descripcion_b2b:opt(e.descripcionB2b),descripcion_b2c:opt(e.descripcionB2c),creado_por:actor}});
      return {id:fila.id_opcional_comercial.toString(),version:fila.revision,__auditoriaM9:{nuevo:{id:fila.id_opcional_comercial.toString(),revision:fila.revision}}};
    }
    if(op==='EDITAR_OPCIONAL'){
      const identificador=BigInt(id(e.id,'Opcional')), revision=id(e.revision,'Revisión');
      const actual=await tx.opcional_comercial.findUnique({where:{id_opcional_comercial:identificador}}); if(!actual)throw new ErrorAplicacion(404,'Opcional no encontrado');
      const cambio=await tx.opcional_comercial.updateMany({where:{id_opcional_comercial:identificador,revision,estado:'ACTIVO'},data:{nombre:str(e.nombre,'Nombre',200),descripcion_b2b:opt(e.descripcionB2b),descripcion_b2c:opt(e.descripcionB2c),revision:{increment:1},actualizado_en:new Date()}});
      if(!cambio.count)throw new ErrorAplicacion(409,'El opcional fue modificado por otro usuario','REVISION_DESACTUALIZADA');
      return {id:identificador.toString(),version:revision+1,__auditoriaM9:{anterior:{revision},nuevo:{revision:revision+1}}};
    }
    if(op==='MODIFICAR_COMPATIBILIDAD'){
      const opcional=BigInt(id(e.idOpcional,'Opcional')), producto=id(e.idProducto,'Producto');
      const fila=await tx.compatibilidad_opcional_producto.upsert({where:{id_extension_producto_comercial_id_opcional_comercial:{id_extension_producto_comercial:producto,id_opcional_comercial:opcional}},create:{id_extension_producto_comercial:producto,id_opcional_comercial:opcional,habilitado_b2b:e.habilitadoB2b===true,habilitado_b2c:e.habilitadoB2c===true,condiciones_compatibilidad:opt(e.condiciones),estado:'ACTIVA'},update:{habilitado_b2b:e.habilitadoB2b===true,habilitado_b2c:e.habilitadoB2c===true,condiciones_compatibilidad:opt(e.condiciones),estado:'ACTIVA',revision:{increment:1}}});
      return {id:fila.id_compatibilidad_opcional.toString(),version:fila.revision,__auditoriaM9:{nuevo:{producto,opcional:opcional.toString(),revision:fila.revision}}};
    }
    if(op==='VERSIONAR_PRECIO_OPCIONAL'){
      const opcional=BigInt(id(e.idOpcional,'Opcional'));
      const moneda=id(e.idMoneda,'Moneda'), segmento=String(e.segmento);
      const anterior=await tx.precio_opcional_comercial.findFirst({where:{id_opcional_comercial:opcional,segmento_comercial:segmento,id_moneda:moneda,estado:'ACTIVO'},orderBy:{revision:'desc'}});
      if(anterior)await tx.precio_opcional_comercial.update({where:{id_precio_opcional_comercial:anterior.id_precio_opcional_comercial},data:{estado:'INACTIVO',revision:{increment:1},actualizado_en:new Date()}});
      const fila=await tx.precio_opcional_comercial.create({data:{id_opcional_comercial:opcional,segmento_comercial:segmento,id_moneda:moneda,monto:new Prisma.Decimal(Number(e.monto)),vigencia_desde:date(e.vigenciaDesde),vigencia_hasta:e.vigenciaHasta?date(e.vigenciaHasta):null,motivo:str(e.motivo,'Motivo'),revision:(anterior?.revision??0)+1,creado_por:actor}});
      return {id:fila.id_precio_opcional_comercial.toString(),version:fila.revision,__auditoriaM9:{nuevo:{id:fila.id_precio_opcional_comercial.toString(),revision:fila.revision}}};
    }
    if(op==='DESACTIVAR_OPCIONAL') return this.desactivar(tx.opcional_comercial,'id_opcional_comercial',e,actor);
    if(['CREAR_TARIFA','VERSIONAR_TARIFA','REGISTRAR_EXCLUSION_COMUNAL'].includes(op)){
      const cobertura=op==='REGISTRAR_EXCLUSION_COMUNAL'?'NO_DISPONIBLE':String(e.cobertura), alcance=String(e.alcance);
      const anterior=op==='VERSIONAR_TARIFA'?await tx.tarifa_instalacion_comercial.findUnique({where:{id_tarifa_instalacion_comercial:BigInt(id(e.idAnterior,'Tarifa anterior'))}}):null;
      const region=str(e.region,'Región',120), comuna=alcance==='COMUNA'?str(e.comuna,'Comuna',120):null;
      if(anterior && (anterior.alcance_geografico!==alcance || anterior.region_normalizada!==normalizarUbicacion(region) || anterior.comuna_normalizada!==(comuna?normalizarUbicacion(comuna):null))) throw new ErrorAplicacion(409,'La nueva versión debe conservar su alcance geográfico');
      if(anterior){
        const retirada=await tx.tarifa_instalacion_comercial.updateMany({where:{id_tarifa_instalacion_comercial:anterior.id_tarifa_instalacion_comercial,revision:anterior.revision,estado:'ACTIVA'},data:{estado:'INACTIVA',revision:{increment:1},actualizado_en:new Date()}});
        if(!retirada.count)throw new ErrorAplicacion(409,'La tarifa fue modificada por otro usuario','REVISION_DESACTUALIZADA');
      }
      const fila=await tx.tarifa_instalacion_comercial.create({data:{alcance_geografico:alcance,region,region_normalizada:normalizarUbicacion(region),ciudad:opt(e.ciudad,120),comuna,comuna_normalizada:comuna?normalizarUbicacion(comuna):null,estado_cobertura:cobertura,id_moneda:cobertura==='DISPONIBLE'?id(e.idMoneda,'Moneda'):null,precio_comercial:cobertura==='DISPONIBLE'?new Prisma.Decimal(Number(e.precio)):null,vigencia_desde:date(e.vigenciaDesde),vigencia_hasta:e.vigenciaHasta?date(e.vigenciaHasta):null,condiciones:opt(e.condiciones),observaciones:opt(e.observaciones),revision:(anterior?.revision??0)+1,creado_por:actor}});
      return {id:fila.id_tarifa_instalacion_comercial.toString(),version:fila.revision,__auditoriaM9:{nuevo:{id:fila.id_tarifa_instalacion_comercial.toString(),cobertura,revision:fila.revision}}};
    }
    if(op==='DESACTIVAR_TARIFA') return this.desactivar(tx.tarifa_instalacion_comercial,'id_tarifa_instalacion_comercial',e,actor);
    if(op==='CREAR_CONDICION'){
      const fila=await tx.condicion_comercial.create({data:{codigo:str(e.codigo,'Código',60).toUpperCase(),nombre:str(e.nombre,'Nombre',200),segmento:String(e.segmento),creado_por:actor}});
      return {id:fila.id_condicion_comercial.toString(),version:fila.revision,__auditoriaM9:{nuevo:{id:fila.id_condicion_comercial.toString(),revision:fila.revision}}};
    }
    if(op==='VERSIONAR_CONDICION'){
      const condicion=BigInt(id(e.idCondicion,'Condición'));
      const ultima=await tx.condicion_comercial_version.aggregate({where:{id_condicion_comercial:condicion},_max:{numero_version:true}});
      const fila=await tx.condicion_comercial_version.create({data:{id_condicion_comercial:condicion,numero_version:(ultima._max.numero_version??0)+1,contenido:jsonSeguro(e.contenido),vigencia_desde:date(e.vigenciaDesde),vigencia_hasta:e.vigenciaHasta?date(e.vigenciaHasta):null,motivo:str(e.motivo,'Motivo')}});
      return {id:fila.id_condicion_comercial_version.toString(),version:fila.numero_version,__auditoriaM9:{nuevo:{id:fila.id_condicion_comercial_version.toString(),version:fila.numero_version,estado:'BORRADOR'}}};
    }
    if(op==='PUBLICAR_CONDICION'){
      const identificador=BigInt(id(e.idVersion,'Versión'));
      const actual=await tx.condicion_comercial_version.findUnique({where:{id_condicion_comercial_version:identificador}}); if(!actual)throw new ErrorAplicacion(404,'Versión no encontrada');
      if(actual.estado!=='BORRADOR')throw new ErrorAplicacion(409,'Sólo se puede publicar un borrador');
      const fila=await tx.condicion_comercial_version.update({where:{id_condicion_comercial_version:identificador},data:{estado:'PUBLICADA',publicado_por:actor,publicado_en:new Date()}});
      return {id:fila.id_condicion_comercial_version.toString(),version:fila.numero_version,__auditoriaM9:{anterior:{estado:'BORRADOR'},nuevo:{estado:'PUBLICADA',version:fila.numero_version}}};
    }
    if(op==='DESACTIVAR_CONDICION') return this.desactivar(tx.condicion_comercial,'id_condicion_comercial',e,actor);
    throw new ErrorAplicacion(400,'Operación comercial no soportada');
  }

  private async desactivar(modelo:any,campo:string,e:Entrada,_actor:bigint) {
    const identificador=BigInt(id(e.id,'Identificador')), revision=id(e.revision,'Revisión');
    const estado=campo.includes('tarifa')||campo.includes('condicion')?'INACTIVA':'INACTIVO';
    const cambio=await modelo.updateMany({where:{[campo]:identificador,revision},data:{estado,revision:{increment:1},actualizado_en:new Date()}});
    if(!cambio.count)throw new ErrorAplicacion(409,'El registro no existe o fue modificado por otro usuario','REVISION_DESACTUALIZADA');
    return {id:identificador.toString(),version:revision+1,__auditoriaM9:{anterior:{revision},nuevo:{revision:revision+1,estado}}};
  }
}
