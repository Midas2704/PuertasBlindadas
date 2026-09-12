const { test } = require('node:test');
const assert = require('node:assert/strict');
const { randomUUID } = require('node:crypto');
require('ts-node/register');
const { prisma } = require('../dist/db');
const { M2Controller } = require('../dist/controladores/M2Controller');
const { M3Controller } = require('../dist/controladores/M3Controller');
const { M4Controller } = require('../dist/controladores/M4Controller');
const { C_BancoCentral } = require('../dist/utilidades/C_BancoCentral');
const { fechaNegocio } = require('../dist/utilidades/finanzas');
const { hashClave, futuro, huella, politica } = require('../dist/utilidades/seguridad');
const { sembrarM4 } = require('../prisma/seed-m4.ts');

test('RF vigente: perfiles M4, seed y política de acceso', async t => {
  await sembrarM4();
  const raiz = await prisma.usuario.findUniqueOrThrow({where:{acceso_m4:'20776101-k'}});
  const credencial = await prisma.usuario_contrasena.findFirstOrThrow({where:{usuario_id_usuario:raiz.usuario_id_usuario,activa:true},orderBy:{creada:'desc'}});
  await sembrarM4();
  const credencialPosterior = await prisma.usuario_contrasena.findFirstOrThrow({where:{usuario_id_usuario:raiz.usuario_id_usuario,activa:true},orderBy:{creada:'desc'}});
  assert.equal(credencialPosterior.usuario_contrasena,credencial.usuario_contrasena);

  const ids=[]; const empleados=[]; const modulo=new M4Controller();
  const cargo=await prisma.cargo.findUniqueOrThrow({where:{nombre_cargo:'Demostración M4'}});
  const vinculo=await prisma.tipo_vinculo_laboral.findUniqueOrThrow({where:{nombre_tipo_vinculo_laboral:'Demostración M4'}});
  const clave='Acceso-prueba-RF!2026'; const hash=await hashClave(clave);
  async function crear(perfil) {
    const acceso=`rf-${perfil}-${randomUUID().slice(0,8)}`; const rut=`8${String(Date.now()+ids.length).slice(-7)}-${ids.length}`;
    await prisma.empleado.create({data:{rut_empleado:rut,nombres:'Prueba RF',apellido_paterno:perfil,id_cargo:cargo.id_cargo,id_tipo_vinculo_laboral:vinculo.id_tipo_vinculo_laboral,fecha_ingreso:new Date(),sueldo_base:0}}); empleados.push(rut);
    const base=await prisma.perfil.findUniqueOrThrow({where:{codigo_m4:perfil}});
    const cuenta=await prisma.usuario.create({data:{acceso_m4:acceso,empleado_m4:rut,empleado_rut_empleado:rut,usuario_estado_cuenta:'activo',usuario_correo:`${acceso}@example.invalid`,perfil_id_perfil:base.perfil_id_perfil,seguridad:{create:{}},usuario_contrasena:{create:{usuario_contrasena:hash,activa:true,vence:futuro(60)}}}}); ids.push(cuenta.usuario_id_usuario); return cuenta;
  }

  try {
    const secretaria=await crear('secretaria'); const contador=await crear('contador');
    const tokenSecretaria=(await modulo.iniciarSesion({acceso:secretaria.acceso_m4,clave},{})).token;
    const tokenContador=(await modulo.iniciarSesion({acceso:contador.acceso_m4,clave},{})).token;

    await t.test('Contador autoriza CU51/CU52/CU54 y Secretaría queda rechazada',async()=>{
      for(const operacion of ['anularPago','revertirPago','aplicarSaldoFavor']) {
        assert.ok((await modulo.autorizar(operacion,{secretoSesion:tokenContador})).permisos.includes({anularPago:'CU51',revertirPago:'CU52',aplicarSaldoFavor:'CU54'}[operacion]));
        await assert.rejects(modulo.autorizar(operacion,{secretoSesion:tokenSecretaria}),/permiso/);
      }
    });

    await t.test('sesión respeta inactividad y duración máxima configuradas',async()=>{
      const sesion=await prisma.sesion_usuario.findUniqueOrThrow({where:{secreto_hash:huella(tokenContador)}});
      assert.ok(sesion.vence.getTime()-sesion.inicio.getTime()<=politica.inactividadMinutos*60000+1000);
      await prisma.sesion_usuario.update({where:{id:sesion.id},data:{inicio:new Date(Date.now()-(politica.sesionMinutos+1)*60000),vence:futuro(5)}});
      await assert.rejects(modulo.autorizar('anularPago',{secretoSesion:tokenContador}),/sesión finalizó/);
    });

    await t.test('tercer intento bloquea temporalmente durante diez minutos',async()=>{
      for(let intento=0;intento<politica.intentos;intento++) await assert.rejects(modulo.iniciarSesion({acceso:secretaria.acceso_m4,clave:'incorrecta'},{}),/Credenciales incorrectas/);
      const estado=await prisma.estado_seguridad_usuario.findUniqueOrThrow({where:{id_usuario:secretaria.usuario_id_usuario}});
      const minutos=(estado.bloqueo_hasta.getTime()-Date.now())/60000;
      assert.equal(politica.intentos,3); assert.equal(politica.bloqueoMinutos,10); assert.ok(minutos>9.5&&minutos<=10.1);
      await assert.rejects(modulo.iniciarSesion({acceso:secretaria.acceso_m4,clave},{}),/bloqueada/);
    });
  } finally {
    await prisma.$transaction(async tx=>{await tx.sesion_usuario.deleteMany({where:{id_usuario:{in:ids}}});await tx.token_recuperacion.deleteMany({where:{id_usuario:{in:ids}}});await tx.usuario_permiso_particular.deleteMany({where:{id_usuario:{in:ids}}});await tx.estado_seguridad_usuario.deleteMany({where:{id_usuario:{in:ids}}});await tx.usuario_contrasena.deleteMany({where:{usuario_id_usuario:{in:ids}}});await tx.usuario.deleteMany({where:{usuario_id_usuario:{in:ids}}});await tx.empleado.deleteMany({where:{rut_empleado:{in:empleados}}});});
  }
});

test('CU36/CU51/CU57: documentos, anulaciones y comprobante PDF', async t => {
  const m2=new M2Controller(); const m3=new M3Controller();
  const cliente=await prisma.cliente_financiero.findFirstOrThrow({where:{estado_financiero:'activo'},include:{ficha_cliente:true}});
  const moneda=await prisma.moneda.findUniqueOrThrow({where:{codigo_moneda:'CLP'}});
  const tipo=await prisma.tipo_documento.findUniqueOrThrow({where:{nombre_tipo_documento:'Factura Electrónica'}});
  const medio=await prisma.medio_pago.findFirstOrThrow({where:{estado_medio_pago:'activo'}});
  const notas=[]; const pagos=[]; const documentos=[];
  const crearNota=async monto=>{const nota=await prisma.nota_venta.create({data:{id_ficha_cliente:cliente.ficha_cliente.id_ficha_cliente,id_moneda:moneda.id_moneda,numero_nota_venta:`RF-${randomUUID()}`,fecha_emision:new Date(),monto_neto:monto,monto_total:monto,exento_iva:true,estado_nota_venta:'emitida',estado_pago:'pendiente'}});notas.push(nota.id_nota_venta);return nota;};
  try {
    const primera=await crearNota(100); const segunda=await crearNota(200);
    await t.test('CU36 conserva antecedentes externos y relaciona más de una NV',async()=>{
      const resultado=await m2.registrarDocumento({tipo_documento:'Factura Electrónica',folio:`EXT-${randomUUID()}`,fecha_emision:'2026-09-01',monto_neto:80,monto_impuesto:15.2,monto_total:95.2,respaldo:'Archivo externo verificado',observacion:'Antecedentes propios',ids_notas_venta:[primera.id_nota_venta,segunda.id_nota_venta]});
      documentos.push(resultado.documento.id_documento_tributario);
      assert.equal(resultado.documento.monto_neto.toNumber(),80); assert.equal(resultado.documento.monto_total.toNumber(),95.2);
      assert.equal(await prisma.documento_tributario_nota_venta.count({where:{id_documento_tributario:resultado.documento.id_documento_tributario}}),2);
    });

    const documento=await prisma.documento_tributario.create({data:{id_ficha_cliente:cliente.ficha_cliente.id_ficha_cliente,id_tipo_documento:tipo.id_tipo_documento,id_moneda:moneda.id_moneda,folio_documento:`PAGO-${randomUUID()}`,fecha_emision:new Date(),monto_neto:100,monto_total:100}}); documentos.push(documento.id_documento_tributario);
    const crearPago=async()=>{const pago=await prisma.pago_cliente.create({data:{id_ficha_cliente:cliente.ficha_cliente.id_ficha_cliente,id_moneda:moneda.id_moneda,id_medio_pago:medio.id_medio_pago,fecha_pago:new Date(),monto_pago:40,comprobante_pago:'Prueba',observacion:'Registrado por test',asignacion_pago_cliente:{create:{id_nota_venta:primera.id_nota_venta,id_documento_tributario:documento.id_documento_tributario,monto_asignado:40}}}});pagos.push(pago.id_pago_cliente);return pago;};
    const conReversion=await crearPago(); await prisma.reversion_pago.create({data:{id_pago_cliente:conReversion.id_pago_cliente,monto:10,motivo:'Prueba previa',respaldo:'Prueba',responsable:'test'}});
    await t.test('CU51 rechaza pago con reversión previa',async()=>{await assert.rejects(m3.anularPago(conReversion.id_pago_cliente,{motivo:'Anular',respaldo:'Respaldo'},'test'),/reversión previa/);});
    const anulable=await crearPago();
    await t.test('CU51 conserva el pago, retira su efecto y recalcula la NV',async()=>{const resultado=await m3.anularPago(anulable.id_pago_cliente,{motivo:'Error de registro',respaldo:'Respaldo'},'test');assert.equal(resultado.saldoPendiente,70);assert.ok(await prisma.pago_cliente.findUnique({where:{id_pago_cliente:anulable.id_pago_cliente}}));assert.ok(await prisma.anulacion_pago.findUnique({where:{id_pago_cliente:anulable.id_pago_cliente}}));});

    await t.test('CU57 produce un PDF con catálogo, página y referencias válidas',async()=>{
      const resultado=await m3.generarComprobante(anulable.id_pago_cliente); const pdf=Buffer.from(resultado.contenido.split(',')[1],'base64'); const texto=pdf.toString('latin1');
      assert.equal(pdf.subarray(0,8).toString('ascii'),'%PDF-1.4'); assert.match(texto,/\/Type \/Catalog/); assert.match(texto,/\/Type \/Page/); assert.match(texto,/xref\n0 6/);
      const inicio=Number(texto.match(/startxref\n(\d+)/)[1]); assert.equal(texto.slice(inicio,inicio+4),'xref'); assert.ok(texto.endsWith('%%EOF\n'));
    });
  } finally {
    await prisma.$transaction(async tx=>{await tx.anulacion_pago.deleteMany({where:{id_pago_cliente:{in:pagos}}});await tx.reversion_pago.deleteMany({where:{id_pago_cliente:{in:pagos}}});await tx.asignacion_pago_cliente.deleteMany({where:{id_pago_cliente:{in:pagos}}});await tx.pago_cliente.deleteMany({where:{id_pago_cliente:{in:pagos}}});await tx.documento_tributario_nota_venta.deleteMany({where:{id_documento_tributario:{in:documentos}}});await tx.documento_tributario.deleteMany({where:{id_documento_tributario:{in:documentos}}});await tx.nota_venta.deleteMany({where:{id_nota_venta:{in:notas}}});});
  }
});

test('fecha por defecto de Banco Central usa la fecha de negocio',async()=>{
  let consultada=''; const banco=new C_BancoCentral(async url=>{consultada=url;return{ok:true,status:200,text:async()=>'{"valor":900}'}} ,'https://example.invalid/tipo-cambio');
  await banco.obtenerTipoCambio('USD'); assert.equal(new URL(consultada).searchParams.get('fecha'),fechaNegocio());
});
