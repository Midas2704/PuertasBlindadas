const test=require('node:test');
const assert=require('node:assert/strict');
const {randomUUID}=require('node:crypto');

const habilitada=process.env.C35_HTTP_AISLADO==='1';
const {prisma}=habilitada?require('../dist/db'):{prisma:null};
const {C_Finanzas}=habilitada?require('../dist/controladores/C_Finanzas'):{C_Finanzas:null};
const {crearAplicacion}=habilitada?require('../dist/app'):{crearAplicacion:null};

test('C3.5 persiste y consulta vía HTTP la auditoría M9 de una Obra registrada desde Cotización',{skip:!habilitada,timeout:30000},async()=>{
  const actor={id:910001n,sesion:'c35-http',permisos:['CU19','CU20','CU355'],configuracion:'particular',administrador:false,cambiarClave:false,nombre:'Midas sintético C3.5',acceso:'total'};
  const autorizacion={autorizar:async()=>actor};
  const app=crearAplicacion(new C_Finanzas(autorizacion));
  const servidor=await new Promise((resolve,reject)=>{const s=app.listen(0,'127.0.0.1',()=>resolve(s));s.on('error',reject)});
  try{
    const puerto=servidor.address().port;const base=`http://127.0.0.1:${puerto}/api/finanzas`;
    const idSolicitud=`c35-http-${randomUUID()}`;
    const respuesta=await fetch(`${base}/billing/quotes/obras`,{method:'POST',headers:{'content-type':'application/json','x-request-id':idSolicitud,origin:'http://127.0.0.1:5174'},body:JSON.stringify({nombre:'Obra HTTP C3.5',direccion:`Calle HTTP ${randomUUID().slice(0,6)}`,region:'Metropolitana',ciudad:'Santiago',comuna:'Santiago'})});
    assert.equal(respuesta.status,200);const obra=await respuesta.json();assert.ok(obra.id);
    const identidad=`M2:registrarObraDesdeCotizacion:${idSolicitud}`;
    const persistido=await prisma.evento_auditoria_m9.findUnique({where:{identidad_logica:identidad}});
    assert.ok(persistido);assert.equal(persistido.ejecutor_referencia,actor.id.toString());assert.equal(persistido.operacion,'OBRA_REGISTRADA_DESDE_COTIZACION');assert.equal(persistido.entidad_tipo,'OBRA');assert.equal(persistido.resultado,'EXITOSO');
    const consulta=await fetch(`${base}/auditoria?operacion=OBRA_REGISTRADA_DESDE_COTIZACION`,{headers:{'x-request-id':`c35-consulta-${randomUUID()}`}});
    assert.equal(consulta.status,200);const pagina=await consulta.json();assert.match(JSON.stringify(pagina),/OBRA_REGISTRADA_DESDE_COTIZACION/);
    const operaciones=['COTIZACION_EMITIDA','ALTERNATIVA_B2C_SELECCIONADA','ALTERNATIVA_B2C_ACEPTADA','COTIZACION_B2C_APROBADA_OT_GENERADAS','COTIZACION_B2B_APROBADA_OT_GENERADAS'];
    for(const operacion of operaciones){
      const evento=await prisma.evento_auditoria_m9.findFirst({where:{operacion,resultado:'EXITOSO'},orderBy:{id_evento_m9:'desc'}});
      assert.ok(evento,`falta evento persistido ${operacion}`);assert.equal(evento.ejecutor_referencia,actor.id.toString());assert.ok(evento.identidad_logica);assert.ok(evento.fecha_ocurrencia);
      const respuestaAuditoria=await fetch(`${base}/auditoria?operacion=${encodeURIComponent(operacion)}`,{headers:{'x-request-id':`c35-consulta-${randomUUID()}`}});
      assert.equal(respuestaAuditoria.status,200);assert.match(JSON.stringify(await respuestaAuditoria.json()),new RegExp(operacion));
    }
  }finally{await new Promise(resolve=>servidor.close(resolve));await prisma.$disconnect()}
});
