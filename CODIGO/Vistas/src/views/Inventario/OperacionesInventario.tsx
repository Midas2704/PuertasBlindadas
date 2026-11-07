import { AlertTriangle, ArrowDownToLine, ArrowUpFromLine, Boxes, RefreshCw, SlidersHorizontal, Unlock } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ModalFormulario from '../../components/ModalFormulario';
import { usarSesion } from '../../seguridad/Sesion';
import { consultarInventario, operarInventario } from './apiInventario';
import { formatoCantidad } from './formatoCantidad';

type CodigoOperacion='CU466'|'CU467'|'CU468'|'CU469'|'CU470';
type TipoOperacion='entrada'|'salida'|'reserva'|'liberacion'|'ajuste';
type Catalogos={
  materiales:Array<{sku:string;nombre:string|null;unidad:string|null}>;
  bodegas:Array<{id:string;nombre:string|null;direccion:string|null}>;
  lotes:Array<{id:string;numero:string|null;vence:string|null;ubicaciones:Array<{sku:string;bodegaId:string}>}>;
  tiposMovimiento:Array<{id:string;nombre:string|null}>;
  motivosMovimiento:Array<{id:string;nombre:string|null}>;
};
type DetalleMaterial={sku:string;nombre:string|null;existencias:Array<{bodegaId:string;bodega:string|null;loteId:string;lote:string|null;fisico:string;reservado:string;disponible:string}>};
type Reserva={id:string;sku:string;material:string|null;cantidad:string;estado:string|null;bodegaId:string|null;loteId:string|null;proyectoId:string|null;ordenTrabajoId:string|null;ubicacionAcreditada:boolean};
type Resultado={operacionId:string;movimientoId?:string;reservaId?:string;fisico:string;reservado:string;disponible:string;repetida:boolean};
type Formulario={sku:string;bodegaId:string;loteId:string;cantidad:string;tipoMovimientoId:string;motivoMovimientoId:string;motivo:string;proyectoId:string;ordenTrabajoId:string};

const operaciones:Array<{tipo:TipoOperacion;permiso:CodigoOperacion;titulo:string;descripcion:string;icono:typeof ArrowDownToLine}>=[
  {tipo:'entrada',permiso:'CU466',titulo:'Registrar entrada',descripcion:'Incorpora material físicamente a una ubicación.',icono:ArrowDownToLine},
  {tipo:'salida',permiso:'CU467',titulo:'Registrar salida',descripcion:'Retira stock disponible sin consumir reservas.',icono:ArrowUpFromLine},
  {tipo:'reserva',permiso:'CU468',titulo:'Crear reserva',descripcion:'Compromete disponibilidad sin producir salida física.',icono:Boxes},
  {tipo:'liberacion',permiso:'CU469',titulo:'Liberar reserva',descripcion:'Devuelve una reserva activa a disponibilidad.',icono:Unlock},
  {tipo:'ajuste',permiso:'CU470',titulo:'Ajustar existencia',descripcion:'Corrige el stock físico con trazabilidad obligatoria.',icono:SlidersHorizontal},
];
const nuevoFormulario=():Formulario=>({sku:'',bodegaId:'',loteId:'',cantidad:'',tipoMovimientoId:'',motivoMovimientoId:'',motivo:'',proyectoId:'',ordenTrabajoId:''});
const nuevaClave=()=>globalThis.crypto?.randomUUID?.()??`inventario-${Date.now()}-${Math.random().toString(16).slice(2)}`;
const normalizar=(v:string|null)=>v?.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()??'';

export default function OperacionesInventario(){
  const {sesion}=usarSesion();
  const permitidas=operaciones.filter(o=>sesion?.permisos.includes(o.permiso));
  const [tipo,setTipo]=useState<TipoOperacion>(permitidas[0]?.tipo??'entrada');
  const [catalogos,setCatalogos]=useState<Catalogos|null>(null);const [detalle,setDetalle]=useState<DetalleMaterial|null>(null);
  const [reservas,setReservas]=useState<Reserva[]>([]);const [formulario,setFormulario]=useState<Formulario>(nuevoFormulario);
  const [busquedaMaterial,setBusquedaMaterial]=useState('');
  const [clave,setClave]=useState(nuevaClave);const [confirmando,setConfirmando]=useState(false);const [ocupado,setOcupado]=useState(false);
  const [cargandoCatalogos,setCargandoCatalogos]=useState(true);const [error,setError]=useState('');const [resultado,setResultado]=useState<Resultado|null>(null);
  const puede=(codigo:CodigoOperacion)=>sesion?.permisos.includes(codigo)===true;
  const puedeLiberar=puede('CU469');
  const cargar=useCallback(async()=>{
    setError('');
    try{
      const [c,r]=await Promise.all([consultarInventario<Catalogos>('/catalogos-operacion'),puedeLiberar?consultarInventario<{items:Reserva[]}>('/reservas?tamano=100'):Promise.resolve({items:[]})]);
      setCatalogos(c);setReservas(r.items.filter(x=>normalizar(x.estado)==='activa'&&x.ubicacionAcreditada));
    }catch(e){setError(e instanceof Error?e.message:'No fue posible cargar los catálogos');}finally{setCargandoCatalogos(false);}
  },[puedeLiberar]);
  // La carga inicial sincroniza catálogos remotos con el estado de la pantalla.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(()=>{void cargar();},[cargar]);
  // El detalle depende de una selección explícita y se descarta al cambiarla.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(()=>{if(!formulario.sku){setDetalle(null);return;}void consultarInventario<DetalleMaterial>(`/materiales/${encodeURIComponent(formulario.sku)}`).then(setDetalle).catch(e=>setError(e instanceof Error?e.message:'No fue posible consultar la existencia'));},[formulario.sku]);
  const existencia=detalle?.existencias.find(e=>e.bodegaId===formulario.bodegaId&&e.loteId===formulario.loteId)??null;
  const materiales=useMemo(()=>catalogos?.materiales.filter(m=>`${m.sku} ${m.nombre??''}`.toLowerCase().includes(busquedaMaterial.trim().toLowerCase()))??[],[busquedaMaterial,catalogos]);
  const lotes=useMemo(()=>catalogos?.lotes.filter(l=>tipo==='entrada'||l.ubicaciones.some(u=>u.sku===formulario.sku&&u.bodegaId===formulario.bodegaId))??[],[catalogos,formulario.bodegaId,formulario.sku,tipo]);
  const tipos=useMemo(()=>catalogos?.tiposMovimiento.filter(t=>normalizar(t.nombre).includes(tipo==='ajuste'?'ajuste':tipo))??[],[catalogos,tipo]);
  const actualizar=(campo:keyof Formulario,valor:string)=>{setFormulario(f=>({...f,[campo]:valor,...(campo==='sku'?{bodegaId:'',loteId:''}:campo==='bodegaId'?{loteId:''}:{})}));setResultado(null);setError('');};
  const cambiarTipo=(nuevo:TipoOperacion)=>{setTipo(nuevo);setFormulario(nuevoFormulario());setBusquedaMaterial('');setDetalle(null);setResultado(null);setError('');setClave(nuevaClave());};
  const validar=()=>{
    if(!formulario.sku||!formulario.bodegaId||!formulario.loteId)return 'Selecciona material, bodega y lote.';
    if(!formulario.cantidad||Number(formulario.cantidad)<=0)return tipo==='ajuste'?'La nueva cantidad debe ser mayor que cero.':'La cantidad debe ser mayor que cero.';
    if(tipo!=='reserva'&&(!formulario.tipoMovimientoId||!formulario.motivoMovimientoId))return 'Selecciona el tipo y el motivo de movimiento.';
    if(!formulario.motivo.trim())return 'Explica el motivo de la operación.';
    return '';
  };
  const confirmar=()=>{const mensaje=validar();if(mensaje){setError(mensaje);return;}setConfirmando(true);};
  const ejecutar=async()=>{
    setOcupado(true);setError('');
    try{
      const base={claveIdempotencia:clave,sku:formulario.sku,bodegaId:formulario.bodegaId,loteId:formulario.loteId,motivo:formulario.motivo};
      const especifico=tipo==='reserva'?{cantidad:formulario.cantidad,...(formulario.proyectoId?{proyectoId:formulario.proyectoId}:{}),...(formulario.ordenTrabajoId?{ordenTrabajoId:formulario.ordenTrabajoId}:{})}:tipo==='ajuste'?{cantidadNueva:formulario.cantidad,tipoMovimientoId:formulario.tipoMovimientoId,motivoMovimientoId:formulario.motivoMovimientoId}:{cantidad:formulario.cantidad,tipoMovimientoId:formulario.tipoMovimientoId,motivoMovimientoId:formulario.motivoMovimientoId};
      const ruta=tipo==='entrada'?'/entradas':tipo==='salida'?'/salidas':tipo==='reserva'?'/reservas':'/ajustes';
      const r=await operarInventario<Resultado>(ruta,{...base,...especifico});setResultado(r);setConfirmando(false);setClave(nuevaClave());await cargar();
      if(formulario.sku)setDetalle(await consultarInventario<DetalleMaterial>(`/materiales/${encodeURIComponent(formulario.sku)}`));
    }catch(e){setError(e instanceof Error?e.message:'No fue posible confirmar la operación');setConfirmando(false);}finally{setOcupado(false);}
  };
  const liberar=async(reserva:Reserva)=>{
    const claveLiberacion=nuevaClave();setOcupado(true);setError('');
    try{const r=await operarInventario<Resultado>(`/reservas/${reserva.id}/liberar`,{claveIdempotencia:claveLiberacion,sku:reserva.sku,bodegaId:reserva.bodegaId,loteId:reserva.loteId,motivo:'Liberación autorizada desde bandeja operacional'});setResultado(r);await cargar();}
    catch(e){setError(e instanceof Error?e.message:'No fue posible liberar la reserva');}finally{setOcupado(false);}
  };
  if(permitidas.length===0)return <main className="p-6"><div className="mx-auto max-w-4xl rounded-xl border bg-white p-6"><h1 className="text-2xl font-black">Operaciones de Inventario</h1><p className="mt-3 text-sm text-[#676767]">Las capacidades CU466–CU470 están preparadas, pero permanecen inactivas hasta su aprobación formal en M4.</p></div></main>;
  const actual=operaciones.find(o=>o.tipo===tipo)!;
  return <main className="p-4 sm:p-6 lg:p-8"><div className="mx-auto max-w-6xl space-y-5"><header className="border-t-4 border-[#FE8F01] bg-white p-5 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-black uppercase tracking-[.2em] text-[#676767]">Operación segura e idempotente</p><h1 className="mt-2 text-3xl font-black">Operaciones de Inventario</h1></div><button type="button" onClick={()=>void cargar()} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold"><RefreshCw className="h-4 w-4"/>Actualizar catálogos</button></div></header>
  <nav className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5" aria-label="Operaciones disponibles">{permitidas.map(o=>{const Icono=o.icono;return <button key={o.tipo} type="button" onClick={()=>cambiarTipo(o.tipo)} className={`rounded-xl border p-4 text-left ${tipo===o.tipo?'border-[#FE8F01] bg-orange-50':'bg-white'}`}><Icono className="h-5 w-5"/><strong className="mt-2 block text-sm">{o.titulo}</strong></button>})}</nav>
  {cargandoCatalogos&&<p role="status" className="border-l-4 border-[#676767] bg-gray-50 p-4 text-sm">Cargando catálogos operacionales…</p>}{error&&<p role="alert" className="border-l-4 border-red-500 bg-red-50 p-4 text-sm text-red-900">{error}</p>}{resultado&&<div role="status" className="border-l-4 border-emerald-600 bg-emerald-50 p-4 text-sm"><b>{resultado.repetida?'Operación ya procesada':'Operación confirmada'}.</b> Físico: {formatoCantidad(resultado.fisico)} · Reservado: {formatoCantidad(resultado.reservado)} · Disponible: {formatoCantidad(resultado.disponible)}</div>}
  {tipo==='liberacion'?<section className="rounded-xl border bg-white p-5"><h2 className="text-xl font-black">Reservas activas acreditadas</h2>{reservas.length===0?<p className="mt-4 text-sm text-gray-500">No hay reservas con bodega y lote disponibles para liberar.</p>:<div className="mt-4 grid gap-3">{reservas.map(r=><article key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"><div><b>{r.material||r.sku}</b><p className="text-sm text-gray-600">{formatoCantidad(r.cantidad)} · Bodega {r.bodegaId} · Lote {r.loteId}{r.proyectoId?` · Proyecto ${r.proyectoId}`:''}{r.ordenTrabajoId?` · OT ${r.ordenTrabajoId}`:''}</p></div><button disabled={ocupado} onClick={()=>void liberar(r)} className="rounded-lg bg-[#FE8F01] px-4 py-2 text-sm font-black disabled:opacity-50">Liberar reserva</button></article>)}</div>}</section>:<section className="rounded-xl border bg-white p-5"><h2 className="text-xl font-black">{actual.titulo}</h2><p className="mt-1 text-sm text-gray-600">{actual.descripcion}</p><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><Campo etiqueta="Buscar material" valor={busquedaMaterial} cambiar={setBusquedaMaterial}/><Campo etiqueta="Material" tipo="select" valor={formulario.sku} cambiar={v=>actualizar('sku',v)} opciones={materiales.map(m=>({valor:m.sku,texto:`${m.sku} · ${m.nombre??'Sin nombre'}`}))}/><Campo etiqueta="Bodega" tipo="select" valor={formulario.bodegaId} cambiar={v=>actualizar('bodegaId',v)} opciones={catalogos?.bodegas.map(b=>({valor:b.id,texto:b.nombre??`Bodega ${b.id}`}))??[]}/><Campo etiqueta="Lote" tipo="select" valor={formulario.loteId} cambiar={v=>actualizar('loteId',v)} opciones={lotes.map(l=>({valor:l.id,texto:`${l.numero??`Lote ${l.id}`}${l.vence?` · vence ${l.vence}`:''}`}))}/><Campo etiqueta={tipo==='ajuste'?'Nueva cantidad':'Cantidad'} valor={formulario.cantidad} cambiar={v=>actualizar('cantidad',v)} input="number"/>{tipo!=='reserva'&&<><Campo etiqueta="Tipo de movimiento" tipo="select" valor={formulario.tipoMovimientoId} cambiar={v=>actualizar('tipoMovimientoId',v)} opciones={tipos.map(t=>({valor:t.id,texto:t.nombre??`Tipo ${t.id}`}))}/><Campo etiqueta="Motivo catalogado" tipo="select" valor={formulario.motivoMovimientoId} cambiar={v=>actualizar('motivoMovimientoId',v)} opciones={catalogos?.motivosMovimiento.map(m=>({valor:m.id,texto:m.nombre??`Motivo ${m.id}`}))??[]}/></>}{tipo==='reserva'&&<><Campo etiqueta="Proyecto (opcional)" valor={formulario.proyectoId} cambiar={v=>actualizar('proyectoId',v)}/><Campo etiqueta="OT (opcional)" valor={formulario.ordenTrabajoId} cambiar={v=>actualizar('ordenTrabajoId',v)}/></>}<label className="text-sm font-bold sm:col-span-2 lg:col-span-3">Justificación<textarea rows={3} value={formulario.motivo} onChange={e=>actualizar('motivo',e.target.value)} maxLength={4000} className="mt-1 w-full rounded-lg border p-2"/></label></div>{existencia&&<div className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-gray-50 p-4 text-sm"><p>Físico<br/><b>{formatoCantidad(existencia.fisico)}</b></p><p>Reservado<br/><b>{formatoCantidad(existencia.reservado)}</b></p><p>Disponible<br/><b>{formatoCantidad(existencia.disponible)}</b></p>{tipo==='ajuste'&&formulario.cantidad&&<p className="col-span-3 border-t pt-2">Diferencia propuesta: <b>{formatoCantidad(String(Number(formulario.cantidad)-Number(existencia.fisico)))}</b></p>}</div>}{tipo==='ajuste'&&Number(formulario.cantidad)<Number(existencia?.fisico??0)&&<p className="mt-3 flex gap-2 rounded-lg bg-amber-50 p-3 text-sm"><AlertTriangle className="h-5 w-5 shrink-0"/>El ajuste reduce la existencia. El backend rechazará cualquier valor inferior al stock reservado.</p>}<div className="mt-5 flex justify-end"><button type="button" disabled={ocupado||!catalogos} onClick={confirmar} className="rounded-lg bg-[#FE8F01] px-5 py-2.5 font-black disabled:opacity-50">Revisar y confirmar</button></div></section>}
  {confirmando&&<ModalFormulario titulo={`Confirmar: ${actual.titulo}`} subtitulo="La operación se registrará con idempotencia y auditoría M9." cerrar={()=>setConfirmando(false)} cierreBloqueado={ocupado} pie={<div className="flex justify-end gap-2"><button disabled={ocupado} onClick={()=>setConfirmando(false)} className="rounded-lg border px-4 py-2 font-bold">Cancelar</button><button disabled={ocupado} onClick={()=>void ejecutar()} className="rounded-lg bg-[#FE8F01] px-4 py-2 font-black disabled:opacity-50">{ocupado?'Confirmando…':'Confirmar operación'}</button></div>}><dl className="grid gap-3 text-sm sm:grid-cols-2"><Resumen titulo="Material" valor={formulario.sku}/><Resumen titulo="Ubicación" valor={`Bodega ${formulario.bodegaId} · Lote ${formulario.loteId}`}/><Resumen titulo={tipo==='ajuste'?'Nueva cantidad':'Cantidad'} valor={formulario.cantidad}/><Resumen titulo="Motivo" valor={formulario.motivo}/></dl></ModalFormulario>}</div></main>;
}

function Campo({etiqueta,valor,cambiar,tipo,input,opciones=[]}:{etiqueta:string;valor:string;cambiar:(v:string)=>void;tipo?:'select';input?:string;opciones?:Array<{valor:string;texto:string}>}){return <label className="text-sm font-bold">{etiqueta}{tipo==='select'?<select value={valor} onChange={e=>cambiar(e.target.value)} className="mt-1 w-full rounded-lg border p-2"><option value="">Seleccionar…</option>{opciones.map(o=><option key={o.valor} value={o.valor}>{o.texto}</option>)}</select>:<input type={input??'text'} min={input==='number'?'0.0001':undefined} step={input==='number'?'0.0001':undefined} value={valor} onChange={e=>cambiar(e.target.value)} className="mt-1 w-full rounded-lg border p-2"/>}</label>}
function Resumen({titulo,valor}:{titulo:string;valor:string}){return <div><dt className="text-gray-500">{titulo}</dt><dd className="font-bold">{valor||'—'}</dd></div>}
