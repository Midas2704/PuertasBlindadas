import { AlertTriangle, Boxes, ClipboardList, Home, House, Menu, PackageSearch, Warehouse, X } from 'lucide-react';
import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { operar, usarSesion } from '../../seguridad/Sesion';

const opciones=[
  {ruta:'/inventario',etiqueta:'Resumen',icono:Home,permisos:['CU15']},
  {ruta:'/inventario/materiales',etiqueta:'Materiales',icono:PackageSearch,permisos:['CU14']},
  {ruta:'/inventario/bodegas',etiqueta:'Bodegas',icono:Warehouse,permisos:['CU15']},
  {ruta:'/inventario/movimientos',etiqueta:'Movimientos',icono:ClipboardList,permisos:['CU15']},
  {ruta:'/inventario/reservas',etiqueta:'Reservas',icono:Boxes,permisos:['CU15']},
  {ruta:'/inventario/alertas',etiqueta:'Alertas',icono:AlertTriangle,permisos:['CU15']},
];
const activa=(actual:string,ruta:string)=>ruta==='/inventario'?actual===ruta:actual===ruta||actual.startsWith(`${ruta}/`);

export default function InventarioWrapper(){
  const {sesion,actualizar}=usarSesion();const ubicacion=useLocation();const [abierto,setAbierto]=useState(false);
  const visibles=opciones.filter(opcion=>opcion.permisos.some(p=>sesion?.permisos.includes(p)));
  const navegacion=<>{visibles.map(opcion=>{const Icono=opcion.icono;const seleccionada=activa(ubicacion.pathname,opcion.ruta);return <Link key={opcion.ruta} to={opcion.ruta} onClick={()=>setAbierto(false)} aria-current={seleccionada?'page':undefined} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-bold ${seleccionada?'bg-[#FE8F01] text-black':'text-gray-200 hover:bg-gray-800 hover:text-white'}`}><Icono className="h-5 w-5"/>{opcion.etiqueta}</Link>})}<Link to="/" onClick={()=>setAbierto(false)} className="mt-4 flex items-center gap-3 border-t border-gray-800 px-3 pt-5 text-sm font-bold text-gray-200 hover:text-white"><House className="h-5 w-5 text-[#FE8F01]"/>Volver al portal</Link></>;
  return <div className="flex min-h-screen bg-slate-50 lg:h-screen lg:overflow-hidden"><header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 lg:hidden"><strong>Inventario · Puertas Blindadas</strong><button type="button" aria-label="Abrir menú de Inventario" onClick={()=>setAbierto(true)} className="rounded-lg border p-2"><Menu className="h-5 w-5"/></button></header>{abierto&&<button type="button" aria-label="Cerrar menú de Inventario" className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={()=>setAbierto(false)}/>}<aside className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#111111] p-5 transition-transform lg:static lg:translate-x-0 ${abierto?'translate-x-0':'-translate-x-full'}`}><div className="mb-6 flex items-center justify-between border-b border-gray-800 pb-5"><div><p className="font-black text-white">PUERTAS BLINDADAS</p><p className="text-sm font-bold text-[#FE8F01]">Inventario</p></div><button type="button" aria-label="Cerrar menú de Inventario" onClick={()=>setAbierto(false)} className="text-white lg:hidden"><X/></button></div><nav aria-label="Navegación de Inventario" className="flex-1 space-y-1 overflow-y-auto">{navegacion}</nav><div className="border-t border-gray-800 pt-4 text-sm"><p className="mb-2 break-words text-white">{sesion?.nombre}</p><button type="button" onClick={async()=>{await operar('/seguridad/salir',{});await actualizar();}} className="font-bold text-[#FE8F01]">Cerrar sesión</button></div></aside><main className="min-w-0 flex-1 overflow-x-hidden pt-16 lg:overflow-y-auto lg:pt-0"><Outlet/></main></div>;
}
