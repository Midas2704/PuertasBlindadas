import { prisma } from '../src/db';
import { hashClave, futuro, politica } from '../src/utilidades/seguridad';
import { codigosImplementados, codigosTodosLosCU, codigosGerencia, codigosSecretaria, codigosContador, dependenciasPermiso } from '../src/validaciones/permisos';
export async function sembrarM4() {
 if(process.env.NODE_ENV==='production') throw new Error('El seed de credenciales ficticias sólo se permite en desarrollo');
 const hash=await hashClave('Midas2704');
 await prisma.$transaction(async tx=>{
  const permisos=new Map<string,bigint>();
  for(const codigo of [...new Set([...codigosImplementados, ...codigosTodosLosCU])]) {
   const permiso=await tx.permiso.upsert({where:{codigo_m4:codigo},update:{},create:{codigo_m4:codigo,activo_m4:true,permiso_modulo:Number(codigo.slice(2))>=59?'M4':Number(codigo.slice(2))>=42?'M3':Number(codigo.slice(2))>=12?'M2':'M1',permiso_nombre_del_permiso:codigo,permiso_descripcion:`Operación ${codigo}`,requiere_administrador:['CU65','CU66','CU74'].includes(codigo)}});
   permisos.set(codigo,permiso.permiso_id_permiso);
  }
  for(const [codigo,necesarios] of Object.entries(dependenciasPermiso)) for(const requerido of necesarios) await tx.permiso_dependencia.upsert({where:{id_permiso_id_requerido:{id_permiso:permisos.get(codigo)!,id_requerido:permisos.get(requerido)!}},update:{},create:{id_permiso:permisos.get(codigo)!,id_requerido:permisos.get(requerido)!}});
  const perfiles=new Map<string,bigint>();
  for(const [codigo,nombre,codigos] of [['gerencia','Gerencia',codigosGerencia],['secretaria','Secretaría',codigosSecretaria],['contador','Contador',codigosContador]] as const) {
   const perfil=await tx.perfil.upsert({where:{codigo_m4:codigo},update:{},create:{codigo_m4:codigo,perfil_nombre_perfil:nombre,activo_m4:true,admite_particulares:codigo!=='gerencia'}});perfiles.set(codigo,perfil.perfil_id_perfil);
   for(const permiso of codigos) await tx.perfil_permiso.upsert({where:{perfil_id_perfil_permiso_id_permiso:{perfil_id_perfil:perfil.perfil_id_perfil,permiso_id_permiso:permisos.get(permiso)!}},update:{},create:{perfil_id_perfil:perfil.perfil_id_perfil,permiso_id_permiso:permisos.get(permiso)!,perfil_permiso_activo:true}});
  }
  const acceso='20776101-k';
  const cuenta=await tx.usuario.upsert({where:{acceso_m4:acceso},update:{usuario_username:'Midas',usuario_nombre_completo_primer_nombre_usuario:'Midas',usuario_rut_usuario:acceso,usuario_estado_cuenta:'activo',usuario_es_gerencia:true,gerencia:'Gerencia',usuario_es_administrador:true,administrador_original:true,configuracion_particular:false,perfil_id_perfil:perfiles.get('gerencia')!},create:{acceso_m4:acceso,usuario_username:'Midas',usuario_nombre_completo_primer_nombre_usuario:'Midas',usuario_rut_usuario:acceso,usuario_correo:'midas@puertasblindadas.local',usuario_estado_cuenta:'activo',usuario_es_gerencia:true,gerencia:'Gerencia',usuario_es_administrador:true,administrador_original:true,perfil_id_perfil:perfiles.get('gerencia')!,usuario_fecha_de_creacion:new Date()}});
  await tx.usuario_contrasena.deleteMany({where:{usuario_id_usuario:cuenta.usuario_id_usuario}});
  await tx.usuario_contrasena.create({data:{usuario_id_usuario:cuenta.usuario_id_usuario,usuario_contrasena:hash,activa:true,temporal:false,vence:futuro(politica.vigenciaDias*1440)}});
  await tx.estado_seguridad_usuario.upsert({where:{id_usuario:cuenta.usuario_id_usuario},update:{intentos:0,bloqueos:0,bloqueo_persistente:false,bloqueo_hasta:null,responsable:'Seed Midas'},create:{id_usuario:cuenta.usuario_id_usuario,responsable:'Seed Midas'}});
  const cliente=await tx.cliente_financiero.findFirst({where:{nombre_razon_social_referencia:'Demostración I2 — Elena Robles'},include:{ficha_cliente:true}});
  const moneda=await tx.moneda.findUnique({where:{codigo_moneda:'CLP'}});
  if(cliente?.ficha_cliente && moneda) await tx.cotizacion.upsert({where:{referencia_demostracion:'I2-COT-B2C-EMITIDA-M4'},update:{},create:{referencia_demostracion:'I2-COT-B2C-EMITIDA-M4',id_ficha_cliente:cliente.ficha_cliente.id_ficha_cliente,id_moneda:moneda.id_moneda,fecha_emision:new Date(),fecha_vigencia:futuro(30*1440),estado_cotizacion:'emitida',monto_neto:100000,monto_impuesto:19000,monto_total_estimado:119000,exento_iva:false}});
 },{timeout:60000});
 console.log('Seed M4 completado, sin restablecer claves, permisos ni sesiones de cuentas existentes.');
}
