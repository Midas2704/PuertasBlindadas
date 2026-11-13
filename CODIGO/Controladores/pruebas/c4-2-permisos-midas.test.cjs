const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {sincronizarPermisosMidas}=require('../dist/administracion/sincronizarPermisosMidas.js');
const {configuracionEfectiva,esAdministradorEfectivo,esAdministradorRaiz,permisosEfectivos,requiereSincronizacionMidas}=require('../dist/controladores/M4Controller.js');
const {permiteOperacion}=require('../dist/validaciones/permisos.js');
const {M9Controller}=require('../dist/controladores/M9Controller.js');
const {ProductorAuditoriaM9}=require('../dist/m9/contratoProductor.js');
const {RepositorioAuditoriaM9Memoria}=require('../dist/m9/RepositorioAuditoriaM9.js');
const {RelojFijoM9}=require('../dist/m9/puertos.js');

const auditoriaOficial=()=>{const repositorio=new RepositorioAuditoriaM9Memoria();const receptor=new M9Controller({repositorio,reloj:new RelojFijoM9(new Date('2032-06-01T12:00:00Z'))});return{repositorio,receptor,productor:new ProductorAuditoriaM9(receptor)}};

test('070 registra CU378-CU381 y no registra CU377 ni asigna usuarios',()=>{
  const sql=fs.readFileSync('prisma/migrations/070_permisos_documentales_c4_2/migration.sql','utf8');
  for(const cu of ['CU378','CU379','CU380','CU381']) assert.match(sql,new RegExp(cu));
  assert.match(sql,/CU377 continúa deliberadamente fuera/);
  assert.doesNotMatch(sql,/INSERT INTO\s+"terreno"\."usuario_permiso_particular"/i);
});

test('sincronización Midas asigna todo CU registrado y la segunda ejecución es idempotente',async()=>{
  const permisos=[
    {permiso_id_permiso:377n,codigo_m4:'CU377',activo_m4:false},
    ...[378,379,380,381].map(n=>({permiso_id_permiso:BigInt(n),codigo_m4:`CU${n}`,activo_m4:true})),
    {permiso_id_permiso:466n,codigo_m4:'CU466',activo_m4:false},
  ];
  const asignados=new Set(['378']); const cuenta={usuario_id_usuario:1n,administrador_original:true,configuracion_particular:false};
  const auditoria=auditoriaOficial();
  const tx={
    usuario:{findUnique:async({where})=>where.acceso_m4==='20776101-k'?cuenta:null,update:async({data})=>{cuenta.configuracion_particular=data.configuracion_particular}},
    permiso:{findMany:async()=>permisos},
    usuario_permiso_particular:{
      findMany:async()=>permisos.filter(p=>asignados.has(p.permiso_id_permiso.toString())).map(permiso=>({id_permiso:permiso.permiso_id_permiso,permiso})),
      createMany:async({data})=>{data.forEach(x=>asignados.add(x.id_permiso.toString()));return{count:data.length}},
    },
  };
  const primera=await sincronizarPermisosMidas(tx,99n,auditoria.productor); assert.deepEqual(primera.asignados,['CU377','CU379','CU380','CU381','CU466']); assert.equal(await auditoria.repositorio.cantidad(),1);
  const segunda=await sincronizarPermisosMidas(tx,99n,auditoria.productor); assert.deepEqual(segunda.asignados,[]); assert.equal(await auditoria.repositorio.cantidad(),1);
  assert.ok(asignados.has('377'));assert.ok(asignados.has('466'));
  const evento=(await auditoria.repositorio.listarTodo({}))[0];assert.equal(evento.operacion,'SINCRONIZAR_PERMISOS_MIDAS');assert.notEqual(evento.hashContenido,evento.hashIntegridad);assert.doesNotThrow(()=>auditoria.receptor.verificarIntegridad(evento));
});

test('regresión: Midas Gerencia conserva todos los CU activos aprobados y mantiene inactivos en reserva',async()=>{
  const codigos=[
    ...Array.from({length:72},(_,indice)=>`CU${String(indice+1).padStart(2,'0')}`),
    'CU74','CU355','CU359','CU360','CU377','CU378','CU379','CU380','CU381',
    'CU466','CU467','CU468','CU469','CU470','CU471','CU472',
  ];
  const catalogo=codigos.map((codigo,indice)=>({
    permiso_id_permiso:BigInt(indice+1),codigo_m4:codigo,activo_m4:true,
    requiere_administrador:['CU65','CU66','CU74','CU377'].includes(codigo),
    ...(Number(codigo.slice(2))>=466?{activo_m4:false}:{}),
  }));
  const asignados=new Set(catalogo.slice(0,76).map(p=>p.permiso_id_permiso.toString()));
  const originales=new Set(asignados);
  const auditoria=auditoriaOficial();
  let actualizaciones=0;
  const cuenta={usuario_id_usuario:1n,administrador_original:true,usuario_es_administrador:true,configuracion_particular:false};
  const tx={
    usuario:{
      findUnique:async()=>cuenta,
      update:async({data})=>{actualizaciones++;cuenta.configuracion_particular=data.configuracion_particular},
    },
    permiso:{findMany:async()=>catalogo},
    usuario_permiso_particular:{
      findMany:async()=>catalogo.filter(p=>asignados.has(p.permiso_id_permiso.toString())).map(permiso=>({id_permiso:permiso.permiso_id_permiso,permiso})),
      createMany:async({data})=>{data.forEach(x=>asignados.add(x.id_permiso.toString()));return{count:data.length}},
      deleteMany:async()=>{throw new Error('La sincronización no debe borrar los 76 permisos existentes')},
    },
  };

  const primera=await sincronizarPermisosMidas(tx,99n,auditoria.productor);
  const segunda=await sincronizarPermisosMidas(tx,99n,auditoria.productor);
  const particulares=catalogo.map(permiso=>({permiso}));
  const activos=codigos.filter(codigo=>codigo!=='CU377'&&!['CU466','CU467','CU468','CU469','CU470','CU471','CU472'].includes(codigo));
  const efectivos=permisosEfectivos({...cuenta,perfil:{codigo_m4:'gerencia',perfil_permiso:[]},particulares},activos);

  assert.equal(originales.size,76);
  for(const id of originales) assert.ok(asignados.has(id));
  assert.deepEqual(primera.asignados,['CU377','CU378','CU379','CU380','CU381','CU466','CU467','CU468','CU469','CU470','CU471','CU472']);
  assert.deepEqual(segunda.asignados,[]);
  assert.equal(actualizaciones,1);
  assert.equal(await auditoria.repositorio.cantidad(),1);
  assert.equal(cuenta.configuracion_particular,true);
  assert.deepEqual(new Set(efectivos),new Set(activos));
  for(const codigo of ['CU65','CU66','CU74','CU378','CU379','CU380','CU381']) assert.ok(efectivos.includes(codigo),codigo);
  for(const codigo of ['CU377','CU466','CU467','CU468','CU469','CU470','CU471','CU472']) assert.ok(!efectivos.includes(codigo),codigo);
});

test('la autorización raíz no depende de sincronizar asignaciones particulares',()=>{
  const cuenta={administrador_original:true,usuario_es_administrador:true,configuracion_particular:true,perfil:{codigo_m4:'gerencia',perfil_permiso:[]},particulares:[]};
  assert.equal(esAdministradorRaiz(cuenta),true);
  assert.equal(requiereSincronizacionMidas(cuenta,'miSesion'),false);
  assert.equal(requiereSincronizacionMidas(cuenta,'guardarCotizacion'),false);
  assert.equal(requiereSincronizacionMidas({...cuenta,administrador_original:false},'guardarCotizacion'),false);
  const efectivos=permisosEfectivos(cuenta,['CU14','CU18','CU19','CU51','CU52','CU57','CU199','CU466','CU377']);
  for(const codigo of ['CU14','CU18','CU19','CU51','CU52','CU57','CU199','CU466']) assert.ok(efectivos.includes(codigo),codigo);
  assert.equal(efectivos.includes('CU377'),false);
  for(const operacion of ['guardarCotizacion','emitirCotizacion','estadoDocumentalComercial','anularPago','revertirPago','generarComprobante','listarVisitasTerreno','listarMaterialesInventario']) assert.equal(permiteOperacion(operacion,efectivos),true,operacion);
  assert.equal(permiteOperacion('operacionInexistente',efectivos),false);
  assert.equal(esAdministradorRaiz({administrador_original:false,usuario_es_administrador:true}),false);
});

test('Midas conserva semántica de Administrador y Gerencia aunque esos campos estén desalineados',()=>{
  const cuenta={administrador_original:true,usuario_es_administrador:false,perfil:{codigo_m4:'secretaria'}};
  assert.equal(esAdministradorEfectivo(cuenta),true);
  assert.equal(configuracionEfectiva(cuenta),'gerencia');
  assert.equal(esAdministradorEfectivo({...cuenta,administrador_original:false}),false);
  assert.equal(configuracionEfectiva({...cuenta,administrador_original:false}),'secretaria');
});

test('PostgreSQL aislado sincroniza todos los CU registrados a Midas sintético',{
  skip:process.env.C42_PG18_AISLADO!=='1',timeout:30000,
},async()=>{
  const {prisma}=require('../dist/db');
  const id=910001n;
  await prisma.usuario.update({where:{usuario_id_usuario:id},data:{acceso_m4:'20776101-k',administrador_original:true,configuracion_particular:false}});
  await prisma.usuario_permiso_particular.deleteMany({where:{id_usuario:id}});
  const otrosAntes=await prisma.usuario_permiso_particular.count({where:{id_usuario:{not:id}}});
  const primera=await prisma.$transaction(tx=>sincronizarPermisosMidas(tx,id));
  const segunda=await prisma.$transaction(tx=>sincronizarPermisosMidas(tx,id));
  const catalogo=await prisma.permiso.findMany({where:{codigo_m4:{not:null}},select:{codigo_m4:true}});
  const asignaciones=await prisma.usuario_permiso_particular.findMany({where:{id_usuario:id},include:{permiso:true}});
  const codigos=new Set(asignaciones.map(x=>x.permiso.codigo_m4));
  assert.equal(primera.asignados.length,catalogo.length);
  assert.deepEqual(segunda.asignados,[]);
  for(const permiso of catalogo) assert.ok(codigos.has(permiso.codigo_m4),permiso.codigo_m4);
  for(const codigo of ['CU377','CU378','CU379','CU380','CU381','CU466','CU467','CU468','CU469','CU470','CU471','CU472']) assert.ok(codigos.has(codigo));
  assert.equal(await prisma.usuario_permiso_particular.count({where:{id_usuario:{not:id}}}),otrosAntes);
  assert.equal(await prisma.evento_auditoria_m9.count({where:{modulo_origen:'M4',operacion:'SINCRONIZAR_PERMISOS_MIDAS',entidad_referencia:id.toString()}}),1);
  await prisma.$disconnect();
});

test('079 registra CU377 pendiente y asigna todo el catálogo a la cuenta raíz',()=>{
  const sql=fs.readFileSync('prisma/migrations/079_midas_todos_los_permisos/migration.sql','utf8');
  assert.match(sql,/CU377/);assert.match(sql,/activo_m4"?,\s*"requiere_administrador/s);
  assert.match(sql,/"activo_m4" IS DISTINCT FROM FALSE/);
  assert.match(sql,/CROSS JOIN "comun"\."permiso"/);
  assert.match(sql,/"administrador_original"=TRUE/);
  assert.match(sql,/ON CONFLICT \("id_usuario", "id_permiso"\) DO NOTHING/);
});
