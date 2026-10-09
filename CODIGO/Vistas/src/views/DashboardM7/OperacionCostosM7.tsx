import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usarSesion } from '../../seguridad/Sesion';
import { ContenidoIndicadores, EncabezadoM7, EstadoDato, Periodo, usarConsultaM7 } from './componentes';

type SeccionProps = { titulo: string; ruta: string };

function Seccion({ titulo, ruta }: SeccionProps) {
  const q = usarConsultaM7(ruta);
  return <section><h2 className="px-5 pt-6 text-xl font-bold text-gray-950 sm:px-8">{titulo}</h2><Periodo anio={q.anio} mes={q.mes} cambiar={q.cambiar} cargando={q.cargando} recargar={q.recargar}/><ContenidoIndicadores {...q}/></section>;
}

function CargaOperacional() {
  const [horizonte, setHorizonte] = useState('');
  const q = usarConsultaM7('/dashboard-m7/operacion/carga', false, { horizonteDias: horizonte || undefined });
  return <section><div className="flex flex-wrap items-end justify-between gap-3 px-5 pt-6 sm:px-8"><h2 className="text-xl font-bold text-gray-950">Carga operacional inmediata</h2><label className="text-xs font-semibold uppercase text-gray-500">Horizonte próximo<input aria-label="Horizonte próximo en días" type="number" min="1" max="90" value={horizonte} onChange={e=>setHorizonte(e.target.value)} placeholder="Sin definir" className="mt-1 block w-36 rounded-md border border-gray-300 px-3 py-2 text-sm font-normal normal-case text-gray-900"/></label></div><Periodo anio={q.anio} mes={q.mes} cambiar={q.cambiar} cargando={q.cargando} recargar={q.recargar}/><ContenidoIndicadores {...q}/></section>;
}

function IncidenciasOperacion() {
  const q = usarConsultaM7('/dashboard-m7/operacion/incidencias'); const datos = q.datos || {};
  const estados = ((datos.estadosRevision as { valor?: Array<{ estado: string; cantidad: number }> })?.valor || []); const categorias = ((datos.categorias as { valor?: Array<{ codigo: string; categoria: string; cantidad: number }>; estado?: string })?.valor || []); const registros = (Array.isArray(datos.registros) ? datos.registros : []) as Array<{ id: string; referencia: string; categoria: { nombre: string } | null; tarea: string; proyecto: { codigo: string | null; nombre: string | null } | null; antiguedadDias: number; estadoRevision: string; destinoOwner: string | null }>;
  const cantidad = (estado: string) => estados.find(fila => fila.estado === estado)?.cantidad || 0;
  return <section className="px-5 pt-6 sm:px-8"><div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="text-xl font-black text-black">Incidencias operacionales</h2><p className="mt-1 text-sm text-gray-500">Categorías y revisión desde Terreno; sólo las aprobadas representan fallas validadas.</p></div><EstadoDato estado={String(datos.estado || '')}/></div><Periodo anio={q.anio} mes={q.mes} cambiar={q.cambiar} cargando={q.cargando} recargar={q.recargar}/>{q.error && <p role="alert" className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-red-800">{q.error}</p>}<div className="mt-4 grid gap-3 sm:grid-cols-3"><div className="border-t-4 border-green-500 bg-white p-4 shadow-sm"><p className="text-xs font-bold uppercase text-gray-500">Aprobadas</p><strong className="mt-2 block text-2xl text-black">{cantidad('aprobada')}</strong></div><div className="border-t-4 border-[#FE8F01] bg-white p-4 shadow-sm"><p className="text-xs font-bold uppercase text-gray-500">Pendientes de revisión</p><strong className="mt-2 block text-2xl text-black">{cantidad('pendiente_revision')}</strong></div><div className="border-t-4 border-red-500 bg-white p-4 shadow-sm"><p className="text-xs font-bold uppercase text-gray-500">Rechazadas</p><strong className="mt-2 block text-2xl text-black">{cantidad('rechazada')}</strong></div></div><div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]"><div className="bg-white p-4 shadow-sm"><h3 className="font-black">Categorías registradas</h3><div className="mt-3 space-y-2">{categorias.map(fila => <div key={fila.codigo} className="flex justify-between border-b border-gray-100 py-2 text-sm"><span>{fila.categoria}</span><strong>{fila.cantidad}</strong></div>)}{!categorias.length && <p className="text-sm text-gray-500">Sin categorías estructuradas para el período.</p>}</div></div><div className="bg-white p-4 shadow-sm"><h3 className="font-black">Detalle reciente</h3><div className="mt-3 space-y-2">{registros.slice(0, 8).map(registro => <div key={registro.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 py-2 text-sm"><div className="min-w-0"><strong className="text-[#b85e00]">{registro.referencia}</strong><p className="truncate text-gray-600">{registro.categoria?.nombre || 'Sin categoría'} · {registro.tarea} · {registro.proyecto?.codigo || registro.proyecto?.nombre || 'Sin proyecto'} · {registro.antiguedadDias} día(s)</p></div>{registro.destinoOwner ? <Link to={registro.destinoOwner} className="shrink-0 rounded border border-gray-300 px-3 py-1.5 text-xs font-bold hover:border-[#FE8F01]">Ver detalle</Link> : <span className="text-xs text-gray-400">Detalle no disponible por permisos</span>}</div>)}{!registros.length && <p className="text-sm text-gray-500">Sin incidencias en el período.</p>}</div></div></div></section>;
}

export default function OperacionCostosM7() {
  const { sesion } = usarSesion(); const tiene = (permiso: string) => Boolean(sesion?.permisos.includes(permiso));
  return <div className="min-h-full bg-gray-100"><EncabezadoM7 titulo="Operación y Costos" descripcion="Lectura agregada de remuneraciones, OT, carga, instalaciones e incidencias sin modificar sus fuentes"/>
    {tiene('CU242')&&<Seccion titulo="Costo agregado de remuneraciones" ruta="/dashboard-m7/operacion/costo-remuneraciones"/>}
    {tiene('CU247')&&<Seccion titulo="Estado de Órdenes de Trabajo" ruta="/dashboard-m7/operacion/ordenes-trabajo"/>}
    {tiene('CU248')&&<CargaOperacional/>}
    {tiene('CU250')&&<Seccion titulo="Instalaciones" ruta="/dashboard-m7/operacion/instalaciones"/>}
    {tiene('CU252')&&<Seccion titulo="Atrasos de instalaciones" ruta="/dashboard-m7/operacion/instalaciones/atrasos"/>}
    {tiene('CU253')&&<IncidenciasOperacion/>}
  </div>;
}
