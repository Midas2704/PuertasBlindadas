const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {sincronizarPermisosMidas}=require('../dist/administracion/sincronizarPermisosMidas.js');
const {permisosEfectivos}=require('../dist/controladores/M4Controller.js');

test('070 registra CU378-CU381 y no registra CU377 ni asigna usuarios',()=>{
  const sql=fs.readFileSync('prisma/migrations/070_permisos_documentales_c4_2/migration.sql','utf8');
  for(const cu of ['CU378','CU379','CU380','CU381']) assert.match(sql,new RegExp(cu));
  assert.match(sql,/CU377 continúa deliberadamente fuera/);
  assert.doesNotMatch(sql,/INSERT INTO\s+"terreno"\."usuario_permiso_particular"/i);
});

test('sincronización Midas asigna sólo faltantes y la segunda ejecución es idempotente',async()=>{
  const permisos=[378,379,380,381].map(n=>({permiso_id_permiso:BigInt(n),codigo_m4:`CU${n}`,activo_m4:true}));
  const asignados=new Set(['378']); const auditoria=[]; const cuenta={usuario_id_usuario:1n,administrador_original:true,configuracion_particular:false};
  const tx={
    usuario:{findUnique:async({where})=>where.acceso_m4==='20776101-k'?cuenta:null,update:async({data})=>{cuenta.configuracion_particular=data.configuracion_particular}},
    permiso:{findMany:async()=>permisos},
    usuario_permiso_particular:{
      findMany:async()=>permisos.filter(p=>asignados.has(p.permiso_id_permiso.toString())).map(permiso=>({id_permiso:permiso.permiso_id_permiso,permiso})),
      createMany:async({data})=>{data.forEach(x=>asignados.add(x.id_permiso.toString()));return{count:data.length}},
    },
    evento_auditoria_m9:{create:async({data})=>{auditoria.push(data);return data}},
  };
  const primera=await sincronizarPermisosMidas(tx,99n); assert.deepEqual(primera.asignados,['CU379','CU380','CU381']); assert.equal(auditoria.length,1);
  const segunda=await sincronizarPermisosMidas(tx,99n); assert.deepEqual(segunda.asignados,[]); assert.equal(auditoria.length,1);
  assert.ok(!asignados.has('377'));
});

test('regresión: Midas Gerencia conserva todos los CU aprobados con configuración particular',async()=>{
  const codigos=[
    ...Array.from({length:72},(_,indice)=>`CU${String(indice+1).padStart(2,'0')}`),
    'CU74','CU355','CU359','CU360','CU378','CU379','CU380','CU381',
  ];
  const catalogo=codigos.map((codigo,indice)=>({
    permiso_id_permiso:BigInt(indice+1),codigo_m4:codigo,activo_m4:true,
    requiere_administrador:['CU65','CU66','CU74'].includes(codigo),
  }));
  const asignados=new Set(catalogo.slice(0,76).map(p=>p.permiso_id_permiso.toString()));
  const originales=new Set(asignados);
  const auditoria=[];
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
    evento_auditoria_m9:{create:async({data})=>{auditoria.push(data);return data}},
  };

  const primera=await sincronizarPermisosMidas(tx,99n);
  const segunda=await sincronizarPermisosMidas(tx,99n);
  const particulares=[...catalogo.map(permiso=>({permiso})),{permiso:{codigo_m4:'CU377',activo_m4:true,requiere_administrador:true}}];
  const efectivos=permisosEfectivos({...cuenta,perfil:{codigo_m4:'gerencia',perfil_permiso:[]},particulares});

  assert.equal(originales.size,76);
  for(const id of originales) assert.ok(asignados.has(id));
  assert.deepEqual(primera.asignados,['CU378','CU379','CU380','CU381']);
  assert.deepEqual(segunda.asignados,[]);
  assert.equal(actualizaciones,1);
  assert.equal(auditoria.length,1);
  assert.equal(cuenta.configuracion_particular,true);
  assert.deepEqual(new Set(efectivos),new Set(codigos));
  for(const codigo of ['CU65','CU66','CU74','CU378','CU379','CU380','CU381']) assert.ok(efectivos.includes(codigo),codigo);
  assert.ok(!efectivos.includes('CU377'));
});

test('PostgreSQL aislado sincroniza todos los CU aprobados a Midas sintético sin CU377',{
  skip:process.env.C42_PG18_AISLADO!=='1',timeout:30000,
},async()=>{
  const {prisma}=require('../dist/db');
  const id=910001n;
  await prisma.usuario.update({where:{usuario_id_usuario:id},data:{acceso_m4:'20776101-k',administrador_original:true,configuracion_particular:false}});
  await prisma.usuario_permiso_particular.deleteMany({where:{id_usuario:id}});
  const otrosAntes=await prisma.usuario_permiso_particular.count({where:{id_usuario:{not:id}}});
  const primera=await prisma.$transaction(tx=>sincronizarPermisosMidas(tx,id));
  const segunda=await prisma.$transaction(tx=>sincronizarPermisosMidas(tx,id));
  const catalogo=await prisma.permiso.findMany({where:{activo_m4:true,codigo_m4:{not:null,notIn:['CU377']}},select:{codigo_m4:true}});
  const asignaciones=await prisma.usuario_permiso_particular.findMany({where:{id_usuario:id},include:{permiso:true}});
  const codigos=new Set(asignaciones.map(x=>x.permiso.codigo_m4));
  assert.equal(primera.asignados.length,catalogo.length);
  assert.deepEqual(segunda.asignados,[]);
  for(const permiso of catalogo) assert.ok(codigos.has(permiso.codigo_m4),permiso.codigo_m4);
  for(const codigo of ['CU378','CU379','CU380','CU381']) assert.ok(codigos.has(codigo));
  assert.ok(!codigos.has('CU377'));
  assert.equal(await prisma.usuario_permiso_particular.count({where:{id_usuario:{not:id}}}),otrosAntes);
  assert.equal(await prisma.evento_auditoria_m9.count({where:{modulo_origen:'M4',operacion:'SINCRONIZAR_PERMISOS_MIDAS',entidad_referencia:id.toString()}}),1);
  await prisma.$disconnect();
});
