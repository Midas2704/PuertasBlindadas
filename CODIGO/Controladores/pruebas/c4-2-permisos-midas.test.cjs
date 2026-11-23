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
  const asignados=new Set(['378']); const cuenta={usuario_id_usuario:1n,administrador_original:true,configuracion_particular:false,version_seguridad:7};
  const auditoria=auditoriaOficial();
  const tx={
    usuario:{findUnique:async({where})=>where.acceso_m4==='20776101-k'?cuenta:null,update:async()=>{throw new Error('Sincronizar permisos no debe alterar la cuenta ni invalidar sesiones')}},
    permiso:{findMany:async()=>permisos},
    usuario_permiso_particular:{
      findMany:async()=>permisos.filter(p=>asignados.has(p.permiso_id_permiso.toString())).map(permiso=>({id_permiso:permiso.permiso_id_permiso,permiso})),
      createMany:async({data})=>{data.forEach(x=>asignados.add(x.id_permiso.toString()));return{count:data.length}},
    },
  };
  const primera=await sincronizarPermisosMidas(tx,99n,auditoria.productor); assert.deepEqual(primera.asignados,['CU377','CU379','CU380','CU381','CU466']); assert.equal(await auditoria.repositorio.cantidad(),1);
  const segunda=await sincronizarPermisosMidas(tx,99n,auditoria.productor); assert.deepEqual(segunda.asignados,[]); assert.equal(await auditoria.repositorio.cantidad(),1);
  assert.ok(asignados.has('377'));assert.ok(asignados.has('466'));
  assert.equal(cuenta.configuracion_particular,false);assert.equal(cuenta.version_seguridad,7);
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
  const cuenta={usuario_id_usuario:1n,administrador_original:true,usuario_es_administrador:true,configuracion_particular:false};
  const tx={
    usuario:{
      findUnique:async()=>cuenta,
      update:async()=>{throw new Error('La sincronización no debe modificar version_seguridad ni configuración')},
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
  assert.equal(await auditoria.repositorio.cantidad(),1);
  assert.equal(cuenta.configuracion_particular,false);
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
  const identidadPermanente={administrador_original:false,usuario_es_administrador:false,acceso_m4:'20.776.101-k',perfil:{codigo_m4:'secretaria'}};
  assert.equal(esAdministradorRaiz(identidadPermanente),true);
  assert.equal(esAdministradorEfectivo(identidadPermanente),true);
  assert.equal(configuracionEfectiva(identidadPermanente),'gerencia');
  assert.equal(esAdministradorEfectivo({...cuenta,administrador_original:false}),false);
  assert.equal(configuracionEfectiva({...cuenta,administrador_original:false}),'secretaria');
});

test('084 restaura MIDAS sin cambiar contraseña ni invalidar sesiones',()=>{
  const sql=fs.readFileSync('prisma/migrations/084_midas_acceso_total_permanente/migration.sql','utf8');
  assert.match(sql,/20776101-k/);
  assert.match(sql,/"administrador_original"=TRUE/);
  assert.match(sql,/"usuario_es_administrador"=TRUE/);
  assert.match(sql,/"usuario_estado_cuenta"='activo'/);
  assert.match(sql,/CROSS JOIN|FROM "comun"\."permiso" permiso/);
  assert.doesNotMatch(sql,/usuario_contrasena|sesion_usuario|version_seguridad/i);
  assert.doesNotMatch(sql,/DELETE\s+FROM|TRUNCATE|DROP\s+/i);
});

test('el backend sincroniza MIDAS después de cargar el catálogo y antes de escuchar',()=>{
  const servidor=fs.readFileSync('src/servidor.ts','utf8');
  const sincronizador=fs.readFileSync('src/administracion/sincronizarPermisosMidas.ts','utf8');
  assert.ok(servidor.indexOf('sincronizarPermisosMidas')<servidor.indexOf('crearAplicacion().listen'));
  assert.match(servidor,/MIDAS sincronizado/);
  assert.doesNotMatch(sincronizador,/version_seguridad\s*:/);
  assert.doesNotMatch(sincronizador,/configuracion_particular\s*:/);
});

test('cada inicio de sesión MIDAS reconcilia el catálogo antes de crear la sesión',()=>{
  const controlador=fs.readFileSync('src/controladores/M4Controller.ts','utf8');
  const sincronizacion=controlador.indexOf('await this.garantizarCatalogoMidas(tx,cuentaSesion.usuario_id_usuario)');
  const sesion=controlador.indexOf('await tx.sesion_usuario.create',sincronizacion);
  assert.ok(sincronizacion>=0 && sesion>sincronizacion);
  assert.match(controlador,/garantizarCatalogoMidas[\s\S]*createMany[\s\S]*skipDuplicates:true/);
});

test('MIDAS consulta todo el catálogo y no sólo permisos activos',()=>{
  const controlador=fs.readFileSync('src/controladores/M4Controller.ts','utf8');
  const funcion=controlador.slice(controlador.indexOf('const permisosActivosAdministradorRaiz'),controlador.indexOf('/** El perfil propone'));
  assert.match(funcion,/codigo_m4:\{not:null\}/);
  assert.doesNotMatch(funcion,/activo_m4:true/);
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

test('080 reconcilia CU18 activo sin habilitar capacidades reservadas',()=>{
  const sql=fs.readFileSync('prisma/migrations/080_reconciliacion_cu18_emision_cotizacion/migration.sql','utf8');
  const altaCu19=sql.indexOf("'Crear y guardar cotización', 'CU19'");
  const altaCu18=sql.indexOf("'Emitir cotizaciones', 'CU18'");
  assert.match(sql,/['"]CU18['"]/);
  assert.match(sql,/['"]CU19['"]/);
  assert.ok(altaCu19>=0 && altaCu19<altaCu18,'CU19 debe reconciliarse antes de crear la dependencia de CU18');
  assert.match(sql,/"activo_m4"=TRUE/);
  assert.match(sql,/"perfil_permiso"/);
  assert.match(sql,/\('gerencia','secretaria'\)/);
  assert.doesNotMatch(sql,/perfiles\s*<>\s*2/i);
  assert.match(sql,/perfil compatible existente/);
  assert.match(sql,/"administrador_original"=TRUE/);
  assert.match(sql,/CU377 y CU466-CU472 permanecen/);
  assert.doesNotMatch(sql,/UPDATE\s+"comun"\."permiso"[\s\S]*CU466/i);
});
