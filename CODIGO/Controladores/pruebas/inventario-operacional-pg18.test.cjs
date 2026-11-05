const { test, after } = require('node:test');
const assert = require('node:assert/strict');

if (!process.env.INVENTARIO_INT03_PG18) {
  test('INT-03 PostgreSQL 18 aislado', { skip:'Requiere INVENTARIO_INT03_PG18=1 y una base descartable migrada hasta 077' }, () => {});
} else {
  const { prisma } = require('../dist/db');
  const { ServicioOperacionalInventario } = require('../dist/inventario/ServicioOperacionalInventario');
  const prefijo=`INT03-${process.pid}`;
  let ids={};
  const actor={id:0n,sesion:'sintetica',permisos:[],configuracion:'prueba',administrador:false,administradorOriginal:false,cambiarClave:false,nombre:'INT03',acceso:'INT03'};

  async function limpiar(){
    // M9 es evidencia inmutable incluso en pruebas. La base del workflow es
    // descartable, por lo que sus eventos se conservan hasta eliminar el runner.
    await prisma.operacion_inventario.deleteMany({where:{clave_idempotencia:{startsWith:prefijo}}});
    if(ids.sku){
      await prisma.reserva_inventario.deleteMany({where:{material_sku:ids.sku}});
      await prisma.movimiento_inventario.deleteMany({where:{material_sku:ids.sku}});
      await prisma.inventario_bodega.deleteMany({where:{material_sku:ids.sku}});
      await prisma.material.deleteMany({where:{material_sku:ids.sku}});
    }
    if(ids.tipoEntrada) await prisma.movimiento_inventario_tipo_movimiento.deleteMany({where:{movimiento_inventario_tipo_movimiento_id_tipo_movimiento:{in:[ids.tipoEntrada,ids.tipoSalida,ids.tipoAjuste].filter(Boolean)}}});
    if(ids.motivo) await prisma.movimiento_inventario_motivo_movimiento.deleteMany({where:{movimiento_inventario_motivo_movimiento_id_motivo_movimiento:ids.motivo}});
    if(ids.lote) await prisma.lote.deleteMany({where:{lote_id_lote:ids.lote}});
    if(ids.bodega) await prisma.bodega.deleteMany({where:{bodega_id_bodega:ids.bodega}});
    if(ids.actor) await prisma.usuario.deleteMany({where:{usuario_id_usuario:ids.actor}});
  }
  after(async()=>{await limpiar();await prisma.$disconnect();});

  test('INT-03 ejecuta idempotencia, concurrencia, reservas y auditoría real',async()=>{
    const usuario=await prisma.usuario.create({data:{usuario_username:`${prefijo}-actor`,usuario_nombre_completo_primer_nombre_usuario:'Actor sintético INT03',usuario_estado_cuenta:'activo'}});ids.actor=usuario.usuario_id_usuario;actor.id=ids.actor;
    const bodega=await prisma.bodega.create({data:{bodega_nombre_bodega:`${prefijo}-bodega`,bodega_estado:'activa'}});ids.bodega=bodega.bodega_id_bodega;
    const lote=await prisma.lote.create({data:{lote_numero_lote:`${prefijo}-lote`,lote_estado:'activo'}});ids.lote=lote.lote_id_lote;
    ids.sku=`I3${String(process.pid).padStart(6,'0')}`.slice(0,16);
    await prisma.material.create({data:{material_sku:ids.sku,material_nombre_material:'Material sintético INT03',material_estado:'activo'}});
    await prisma.inventario_bodega.create({data:{material_sku:ids.sku,bodega_id_bodega:ids.bodega,lote_id_lote:ids.lote,inventario_bodega_cantidad_fisica:'10',inventario_bodega_cantidad_reservada:'0'}});
    ids.tipoEntrada=(await prisma.movimiento_inventario_tipo_movimiento.create({data:{movimiento_inventario_tipo_movimiento_nombre:`${prefijo} Entrada`}})).movimiento_inventario_tipo_movimiento_id_tipo_movimiento;
    ids.tipoSalida=(await prisma.movimiento_inventario_tipo_movimiento.create({data:{movimiento_inventario_tipo_movimiento_nombre:`${prefijo} Salida`}})).movimiento_inventario_tipo_movimiento_id_tipo_movimiento;
    ids.tipoAjuste=(await prisma.movimiento_inventario_tipo_movimiento.create({data:{movimiento_inventario_tipo_movimiento_nombre:`${prefijo} Ajuste`}})).movimiento_inventario_tipo_movimiento_id_tipo_movimiento;
    ids.motivo=(await prisma.movimiento_inventario_motivo_movimiento.create({data:{movimiento_inventario_motivo_movimiento_nombre:`${prefijo} prueba`}})).movimiento_inventario_motivo_movimiento_id_motivo_movimiento;
    const servicio=new ServicioOperacionalInventario(prisma);
    const base={sku:ids.sku,bodegaId:ids.bodega,loteId:ids.lote,motivo:'Prueba transaccional sintética'};

    const [entradaA,entradaB]=await Promise.all([
      servicio.registrarEntrada({...base,claveIdempotencia:`${prefijo}-entrada`,cantidad:'2.5000',tipoMovimientoId:ids.tipoEntrada,motivoMovimientoId:ids.motivo},actor),
      servicio.registrarEntrada({...base,claveIdempotencia:`${prefijo}-entrada`,cantidad:'2.5000',tipoMovimientoId:ids.tipoEntrada,motivoMovimientoId:ids.motivo},actor),
    ]);
    assert.equal(entradaA.movimientoId,entradaB.movimientoId);
    assert.equal((await prisma.movimiento_inventario.count({where:{material_sku:ids.sku}})),1);

    const resultados=await Promise.allSettled([
      servicio.crearReserva({...base,claveIdempotencia:`${prefijo}-reserva-a`,cantidad:'8'},actor),
      servicio.crearReserva({...base,claveIdempotencia:`${prefijo}-reserva-b`,cantidad:'8'},actor),
    ]);
    assert.equal(resultados.filter(r=>r.status==='fulfilled').length,1);
    assert.equal(resultados.filter(r=>r.status==='rejected').length,1);
    const reserva=resultados.find(r=>r.status==='fulfilled').value;

    await assert.rejects(()=>servicio.registrarSalida({...base,claveIdempotencia:`${prefijo}-salida-bloqueada`,cantidad:'5',tipoMovimientoId:ids.tipoSalida,motivoMovimientoId:ids.motivo},actor),/stock reservado/i);
    const liberada=await servicio.liberarReserva(reserva.reservaId,{...base,claveIdempotencia:`${prefijo}-liberar`},actor);
    assert.equal(liberada.reservado,'0');
    const repetida=await servicio.liberarReserva(reserva.reservaId,{...base,claveIdempotencia:`${prefijo}-liberar`},actor);
    assert.equal(repetida.repetida,true);

    await servicio.registrarSalida({...base,claveIdempotencia:`${prefijo}-salida`,cantidad:'1.25',tipoMovimientoId:ids.tipoSalida,motivoMovimientoId:ids.motivo},actor);
    await servicio.ajustarExistencia({...base,claveIdempotencia:`${prefijo}-ajuste`,cantidadNueva:'9.75',tipoMovimientoId:ids.tipoAjuste,motivoMovimientoId:ids.motivo},actor);
    const existencia=await prisma.inventario_bodega.findUniqueOrThrow({where:{material_sku_lote_id_lote_bodega_id_bodega:{material_sku:ids.sku,lote_id_lote:ids.lote,bodega_id_bodega:ids.bodega}}});
    assert.equal(existencia.inventario_bodega_cantidad_fisica.toString(),'9.75');
    assert.equal(existencia.inventario_bodega_cantidad_reservada.toString(),'0');
    const operaciones=await prisma.operacion_inventario.count({where:{clave_idempotencia:{startsWith:prefijo}}});
    assert.equal(operaciones,5);
    const eventos=await prisma.evento_auditoria_m9.findMany({where:{productor:'INVENTARIO',ejecutor_referencia:ids.actor.toString()}});
    assert.equal(eventos.length,5);
    assert.ok(eventos.every(e=>e.hash_contenido&&e.hash_integridad));
  });
}
