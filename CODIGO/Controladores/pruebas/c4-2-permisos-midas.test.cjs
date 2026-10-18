const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const {sincronizarPermisosMidas}=require('../dist/administracion/sincronizarPermisosMidas.js');

test('070 registra CU378-CU381 y no registra CU377 ni asigna usuarios',()=>{
  const sql=fs.readFileSync('prisma/migrations/070_permisos_documentales_c4_2/migration.sql','utf8');
  for(const cu of ['CU378','CU379','CU380','CU381']) assert.match(sql,new RegExp(cu));
  assert.match(sql,/CU377 continúa deliberadamente fuera/);
  assert.doesNotMatch(sql,/INSERT INTO\s+"terreno"\."usuario_permiso_particular"/i);
});

test('sincronización Midas asigna sólo faltantes y la segunda ejecución es idempotente',async()=>{
  const permisos=[378,379,380,381].map(n=>({permiso_id_permiso:BigInt(n),codigo_m4:`CU${n}`,activo_m4:true}));
  const asignados=new Set(['378']); const auditoria=[];
  const tx={
    usuario:{findUnique:async({where})=>where.acceso_m4==='20776101-k'?{usuario_id_usuario:1n,administrador_original:true}:null,update:async()=>{}},
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
