const test=require('node:test');
const assert=require('node:assert/strict');
const {MATRIZ_CAPACIDADES_COMERCIALES,AutorizadorCapacidadComercial,ServicioEscrituraComercialPreparada,validarSolicitudEscrituraComercial}=require('../dist/comercial/SeguridadCapacidadesComerciales');
const {MATRIZ_AUDITORIA_COMERCIAL}=require('../dist/comercial/MatrizAuditoriaComercial');
const {MATRIZ_CAPACIDADES_DOCUMENTALES}=require('../dist/documental/seguridad/MatrizCapacidadesDocumentales');
const {AutorizadorDocumental}=require('../dist/documental/seguridad/AutorizacionDocumental');
const {codigosImplementados,codigosAdministrador,operacionesPermiso}=require('../dist/validaciones/permisos');

const actor={id:7n,sesion:'sesion-local-c25',permisos:['CU360','CU367'],administrador:false};
const base={claveIdempotencia:'c25:operacion:0001',motivo:'Prueba focal controlada',revision:1};

test('C2.5 — matriz M4 y preparación comercial fail-closed',async t=>{
  await t.test('reutiliza sólo CU cuyo alcance comercial existente coincide',()=>{
    const existentes=Object.fromEntries(MATRIZ_CAPACIDADES_COMERCIALES.filter(x=>x.estadoAutorizacion==='APROBADO_EXISTENTE').map(x=>[x.operacion,x.cuExistente]));
    assert.deepEqual(existentes,{CONSULTAR_PRODUCTOS:'CU360',CREAR_PRODUCTOS:'CU361',EDITAR_PRODUCTOS:'CU362',PUBLICAR_PRODUCTOS:'CU365',CONSULTAR_VERSIONES:'CU367'});
  });
  await t.test('C2.6 registra CU368-CU372 sin asignarlos al administrador',()=>{
    const aprobados=[...new Set(MATRIZ_CAPACIDADES_COMERCIALES.filter(x=>x.estadoAutorizacion==='APROBADO_C2_6').map(x=>x.cuExistente))];
    assert.deepEqual(aprobados,['CU368','CU369','CU370','CU371','CU372']);
    for(const cu of aprobados){assert.equal(codigosImplementados.includes(cu),true);assert.equal(codigosAdministrador.includes(cu),false);}
  });
  await t.test('administrador sin concesión explícita no habilita una escritura',async()=>{
    await assert.rejects(new AutorizadorCapacidadComercial().exigir({...actor,administrador:true,permisos:[]},'CREAR_PRECIO'),error=>error.codigo==='ACCESO_COMERCIAL_DENEGADO');
    await assert.doesNotReject(new AutorizadorCapacidadComercial().exigir({...actor,administrador:false,permisos:['CU368']},'CREAR_PRECIO'));
  });
  await t.test('valida precio positivo, segmento, moneda y vigencia',()=>{
    const valido=validarSolicitudEscrituraComercial('CREAR_PRECIO',{...base,monto:100000,segmento:'B2B',idMoneda:1,vigenciaDesde:'2026-10-15',vigenciaHasta:null});
    assert.equal(valido.operacion,'CREAR_PRECIO');
    assert.throws(()=>validarSolicitudEscrituraComercial('CREAR_PRECIO',{...base,monto:0,segmento:'B2B',idMoneda:1,vigenciaDesde:'2026-10-15'}),/Monto inválido/);
    assert.throws(()=>validarSolicitudEscrituraComercial('CREAR_PRECIO',{...base,monto:1,segmento:'B2C',idMoneda:1,vigenciaDesde:'2026-11-01',vigenciaHasta:'2026-10-01'}),/vigencia hasta/);
  });
  await t.test('cobertura disponible exige precio y una exclusión comunal lo prohíbe',()=>{
    assert.doesNotThrow(()=>validarSolicitudEscrituraComercial('CREAR_TARIFA',{...base,alcance:'REGION',region:'Valparaíso',cobertura:'DISPONIBLE',precio:120000,idMoneda:1,vigenciaDesde:'2026-10-15'}));
    assert.doesNotThrow(()=>validarSolicitudEscrituraComercial('REGISTRAR_EXCLUSION_COMUNAL',{...base,alcance:'COMUNA',region:'Valparaíso',comuna:'Juan Fernández',cobertura:'NO_DISPONIBLE',precio:null,idMoneda:null,vigenciaDesde:'2026-10-15'}));
    assert.throws(()=>validarSolicitudEscrituraComercial('REGISTRAR_EXCLUSION_COMUNAL',{...base,alcance:'COMUNA',region:'Valparaíso',comuna:'Juan Fernández',cobertura:'NO_DISPONIBLE',precio:0,idMoneda:1,vigenciaDesde:'2026-10-15'}),/no debe informar precio/);
  });
  await t.test('revisión e idempotencia son obligatorias y acotadas',()=>{
    assert.throws(()=>validarSolicitudEscrituraComercial('DESACTIVAR_PRECIO',{...base,revision:0}),/Revisión inválido/);
    assert.throws(()=>validarSolicitudEscrituraComercial('DESACTIVAR_PRECIO',{...base,claveIdempotencia:'cliente@correo.cl'}),/idempotencia inválida/);
  });
  await t.test('el repositorio recibe escrituras sólo con el CU explícito',async()=>{
    let llamadas=0;const servicio=new ServicioEscrituraComercialPreparada(new AutorizadorCapacidadComercial(),{ejecutar:async()=>{llamadas++;return{};}});
    await servicio.ejecutar('DESACTIVAR_PRECIO',base,{...actor,permisos:['CU368'],administrador:false});assert.equal(llamadas,1);
  });
  await t.test('auditoría comercial queda aprobada con actor e idempotencia',()=>{
    assert.ok(MATRIZ_AUDITORIA_COMERCIAL.length>=8);assert.ok(MATRIZ_AUDITORIA_COMERCIAL.every(x=>x.estadoAprobacion==='APROBADO_C2_6'&&x.requiereActor&&x.requiereIdempotencia));
  });
  await t.test('CU366 no se reinterpreta como asociación documental',async()=>{
    const asociar=MATRIZ_CAPACIDADES_DOCUMENTALES.find(x=>x.accion==='ASOCIAR_PRODUCTO');assert.equal(asociar.cuExistente,'CU374');assert.equal(asociar.cuPropuesto,null);
    const autorizador=new AutorizadorDocumental(async()=>true);await assert.rejects(autorizador.exigir({...actor,permisos:['CU366']},'ASOCIAR_PRODUCTO',{idProducto:1}),error=>error.codigo==='ACCESO_DOCUMENTAL_DENEGADO');
  });
  await t.test('incorpora CU373-CU376 y mantiene CU377 cerrado',()=>{
    for(const cu of ['CU373','CU374','CU375','CU376']){assert.equal(codigosAdministrador.includes(cu),false);assert.equal(codigosImplementados.includes(cu),true);}
    assert.equal(codigosImplementados.includes('CU377'),false);
    const autorizador=new AutorizadorDocumental(async()=>true);return assert.rejects(autorizador.exigir({...actor,permisos:['CU377']},'ADMINISTRAR_CONSERVACION',{}),error=>error.codigo==='PERMISO_DOCUMENTAL_NO_DEFINIDO');
  });
});
