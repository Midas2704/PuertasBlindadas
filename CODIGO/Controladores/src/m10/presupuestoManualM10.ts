import { Prisma } from '@prisma/client';
import { prisma } from '../db';
import { ErrorAplicacion } from '../utilidades/ErrorAplicacion';

export const CATEGORIAS_RESULTADOS_M10 = ['VENTAS_NETAS','COSTOS_DIRECTOS','GASTOS_OPERACIONALES'] as const;
export const CATEGORIAS_FLUJO_M10 = ['INGRESOS_OPERACIONALES','OTROS_INGRESOS','PROVEEDORES','REMUNERACIONES','IMPUESTOS','OTROS_EGRESOS'] as const;
type TipoPartida = 'RESULTADOS' | 'FLUJO_CAJA';
type PartidaEntrada = { mes:number; tipo:TipoPartida; categoria:string; monto:Prisma.Decimal };

const entero = (valor:unknown, nombre:string) => {
  const numero = Number(valor); if (!Number.isSafeInteger(numero)) throw new ErrorAplicacion(400, `${nombre} invalido`); return numero;
};

export function validarPresupuestoManualM10(entrada:Record<string,unknown>) {
  const anio=entero(entrada.anio,'Ano'); if(anio<2000||anio>2200) throw new ErrorAplicacion(400,'Ano fuera de rango');
  const ambito=String(entrada.ambito||'GENERAL').trim().toUpperCase(); if(!/^[A-Z0-9_]{1,40}$/.test(ambito)) throw new ErrorAplicacion(400,'Ambito invalido');
  const moneda=String(entrada.moneda||'CLP').trim().toUpperCase(); if(!/^[A-Z]{3,10}$/.test(moneda)) throw new ErrorAplicacion(400,'Moneda invalida');
  if(moneda!=='CLP') throw new ErrorAplicacion(400,'El presupuesto M10 se mantiene en CLP hasta contar con un contrato FX presupuestario validado');
  const revisionEsperada=entrada.revisionEsperada===undefined?null:entero(entrada.revisionEsperada,'Revision esperada');
  const motivo=String(entrada.motivo||'').trim(); if(motivo.length>1000) throw new ErrorAplicacion(400,'El motivo supera 1000 caracteres');
  if(!Array.isArray(entrada.meses)||entrada.meses.length!==12) throw new ErrorAplicacion(400,'El presupuesto debe contener exactamente los 12 meses');
  const vistos=new Set<number>(); const partidas:PartidaEntrada[]=[];
  for(const valor of entrada.meses) {
    if(!valor||typeof valor!=='object'||Array.isArray(valor)) throw new ErrorAplicacion(400,'Mes presupuestario invalido');
    const fila=valor as Record<string,unknown>; const mes=entero(fila.mes,'Mes'); if(mes<1||mes>12||vistos.has(mes)) throw new ErrorAplicacion(400,'Los meses deben ser unicos entre 1 y 12'); vistos.add(mes);
    for(const [tipo,categorias] of [['RESULTADOS',CATEGORIAS_RESULTADOS_M10],['FLUJO_CAJA',CATEGORIAS_FLUJO_M10]] as const) {
      const fuente=fila[tipo==='RESULTADOS'?'resultados':'flujoCaja']; if(!fuente||typeof fuente!=='object'||Array.isArray(fuente)) throw new ErrorAplicacion(400,`Faltan partidas de ${tipo} para el mes ${mes}`);
      for(const categoria of categorias) {
        const crudo=(fuente as Record<string,unknown>)[categoria]; let monto:Prisma.Decimal;
        try{monto=new Prisma.Decimal(String(crudo));}catch{throw new ErrorAplicacion(400,`Monto invalido en ${categoria}, mes ${mes}`);}
        if(!monto.isFinite()||monto.lt(0)) throw new ErrorAplicacion(400,`Monto no negativo obligatorio en ${categoria}, mes ${mes}`);
        partidas.push({mes,tipo,categoria,monto:monto.toDecimalPlaces(2)});
      }
    }
  }
  return {anio,ambito,moneda,revisionEsperada,motivo:motivo||null,partidas};
}

const variacion = (actual:number, base:number) => base === 0 ? null : Number((((actual - base) / Math.abs(base)) * 100).toFixed(2));

export function compararVersionesPresupuestoM10(versionA:any, versionB:any) {
  const detallesA = new Map<string,number>((versionA.detalles || []).map((item:any):[string,number] => [`${item.mes}:${item.tipo}:${item.categoria}`, Number(item.monto)]));
  const detallesB = new Map<string,number>((versionB.detalles || []).map((item:any):[string,number] => [`${item.mes}:${item.tipo}:${item.categoria}`, Number(item.monto)]));
  const claves = [...new Set([...detallesA.keys(), ...detallesB.keys()])].sort();
  return claves.map(clave => {
    const [mes,tipo,categoria] = String(clave).split(':');
    const base = detallesA.get(clave) ?? 0; const actual = detallesB.get(clave) ?? 0;
    return { mes:Number(mes), tipo, categoria, versionA:base, versionB:actual, diferencia:Number((actual-base).toFixed(2)), variacionPorcentual:variacion(actual,base) };
  });
}

const presentar = (presupuesto:any) => ({
  id:String(presupuesto.id_presupuesto_manual_m10), anio:presupuesto.anio, ambito:presupuesto.ambito,
  moneda:presupuesto.moneda.codigo_moneda, estado:presupuesto.estado, revision:presupuesto.revision,
  versiones:(presupuesto.versiones||[]).map((version:any)=>({
    id:String(version.id_version_presupuesto_m10), numero:version.numero_version, tipo:version.tipo_version,
    revisionBase:version.revision_base, motivo:version.motivo, creadoEn:version.fecha_creacion,
    meses:Array.from({length:12},(_,indice)=>{
      const mes=indice+1; const detalles=(version.detalles||[]).filter((item:any)=>item.mes===mes);
      const bloque=(tipo:string)=>Object.fromEntries(detalles.filter((item:any)=>item.tipo===tipo).map((item:any)=>[item.categoria,Number(item.monto)]));
      return {mes,resultados:bloque('RESULTADOS'),flujoCaja:bloque('FLUJO_CAJA')};
    }),
  })),
});

export class PresupuestoManualM10 {
  async consultar(consulta:Record<string,unknown>) {
    const anio=consulta.anio===undefined?undefined:entero(consulta.anio,'Ano');
    const id=consulta.id===undefined?undefined:BigInt(String(consulta.id));
    const filas=await prisma.presupuesto_manual_m10.findMany({where:{...(id?{id_presupuesto_manual_m10:id}:{}),...(anio?{anio}:{}),estado:'activo'},include:{moneda:true,versiones:{include:{detalles:true},orderBy:{numero_version:'asc'}}},orderBy:[{anio:'desc'},{id_presupuesto_manual_m10:'asc'}]});
    return {estado:filas.length?'VALIDO':'SIN_RESULTADOS',presupuestos:filas.map(presentar),conceptos:{real:'Consultado dinamicamente desde sus fuentes owner',proyeccion:'Proyeccion automatica independiente',presupuesto:'Version manual inmutable'}};
  }

  async guardar(entrada:Record<string,unknown>,actorId:bigint,id?:bigint) {
    const datos=validarPresupuestoManualM10(entrada); const moneda=await prisma.moneda.findUnique({where:{codigo_moneda:datos.moneda}});
    if(!moneda||moneda.estado_moneda!=='activo') throw new ErrorAplicacion(400,'Moneda no disponible');
    try{return await prisma.$transaction(async tx=>{
      const existente=id?await tx.presupuesto_manual_m10.findUnique({where:{id_presupuesto_manual_m10:id},include:{moneda:true,versiones:{include:{detalles:true},orderBy:{numero_version:'asc'}}}}):null;
      if(id&&!existente) throw new ErrorAplicacion(404,'Presupuesto no encontrado');
      if(existente&&(existente.anio!==datos.anio||existente.ambito!==datos.ambito||existente.id_moneda!==moneda.id_moneda)) throw new ErrorAplicacion(409,'La identidad anual y monetaria del presupuesto no puede cambiarse');
      if(existente&&datos.revisionEsperada!==existente.revision) throw new ErrorAplicacion(409,'El presupuesto cambio concurrentemente; vuelve a cargarlo');
      if(existente&&!datos.motivo) throw new ErrorAplicacion(400,'El motivo es obligatorio para crear una revision');
      if(!existente){const duplicado=await tx.presupuesto_manual_m10.findUnique({where:{anio_ambito_id_moneda:{anio:datos.anio,ambito:datos.ambito,id_moneda:moneda.id_moneda}}});if(duplicado)throw new ErrorAplicacion(409,'Ya existe un presupuesto para ese ano, ambito y moneda');}
      const presupuesto=existente||await tx.presupuesto_manual_m10.create({data:{anio:datos.anio,ambito:datos.ambito,id_moneda:moneda.id_moneda,creado_por:actorId}});
      const numero=existente?existente.revision+1:1;
      const version=await tx.version_presupuesto_m10.create({data:{id_presupuesto_manual_m10:presupuesto.id_presupuesto_manual_m10,numero_version:numero,tipo_version:numero===1?'ORIGINAL':'REVISION',revision_base:existente?.revision||0,motivo:datos.motivo,creado_por:actorId,detalles:{create:datos.partidas.map(item=>({mes:item.mes,tipo:item.tipo,categoria:item.categoria,monto:item.monto}))}},include:{detalles:true}});
      const actualizado=existente?await tx.presupuesto_manual_m10.update({where:{id_presupuesto_manual_m10:presupuesto.id_presupuesto_manual_m10,revision:existente.revision},data:{revision:{increment:1},fecha_actualizacion:new Date()},include:{moneda:true,versiones:{include:{detalles:true},orderBy:{numero_version:'asc'}}}}):await tx.presupuesto_manual_m10.findUniqueOrThrow({where:{id_presupuesto_manual_m10:presupuesto.id_presupuesto_manual_m10},include:{moneda:true,versiones:{include:{detalles:true},orderBy:{numero_version:'asc'}}}});
      const salida=presentar(actualizado); Object.defineProperty(salida,'__auditoriaM9',{enumerable:false,value:{anterior:existente?{id:String(existente.id_presupuesto_manual_m10),revision:existente.revision}:undefined,nuevo:{id:salida.id,anio:salida.anio,ambito:salida.ambito,moneda:salida.moneda,revision:salida.revision,version:String(version.id_version_presupuesto_m10)}}}); return salida;
    },{isolationLevel:Prisma.TransactionIsolationLevel.Serializable});}
    catch(error){if(error instanceof ErrorAplicacion)throw error;if(error instanceof Prisma.PrismaClientKnownRequestError&&['P2002','P2025','P2034'].includes(error.code))throw new ErrorAplicacion(409,'El presupuesto fue modificado concurrentemente');throw error;}
  }


  async compararVersiones(id:bigint, consulta:Record<string,unknown>) {
    const numeroA=entero(consulta.versionA,'Version A'); const numeroB=entero(consulta.versionB,'Version B');
    const presupuesto=await prisma.presupuesto_manual_m10.findUnique({where:{id_presupuesto_manual_m10:id},include:{versiones:{include:{detalles:true}}}});
    if(!presupuesto) throw new ErrorAplicacion(404,'Presupuesto no encontrado');
    const versionA=presupuesto.versiones.find(version=>version.numero_version===numeroA); const versionB=presupuesto.versiones.find(version=>version.numero_version===numeroB);
    if(!versionA||!versionB) throw new ErrorAplicacion(404,'Version presupuestaria no encontrada');
    return {presupuestoId:String(id),versionA:numeroA,versionB:numeroB,diferencias:compararVersionesPresupuestoM10(versionA,versionB)};
  }
}
