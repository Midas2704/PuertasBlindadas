import { Eye, ImageOff, ShieldCheck } from 'lucide-react';
import type { ProductoCatalogoComercial } from './tipos';

const precio = (producto:ProductoCatalogoComercial) => producto.precio.resultado === 'VIGENTE' && producto.precio.monto !== null
  ? `${producto.precio.moneda} ${producto.precio.monto.toLocaleString('es-CL')}` : 'Sin precio comercial vigente';

export default function TarjetaProductoComercial({producto,verFicha,seleccionar,seleccionable=false}:{producto:ProductoCatalogoComercial;verFicha:(producto:ProductoCatalogoComercial)=>void;seleccionar?:(producto:ProductoCatalogoComercial)=>void;seleccionable?:boolean}){
  const acento=producto.segmento==='B2B'?'border-[#FE8F01]':'border-[#676767]';
  return <article className={`flex h-full flex-col overflow-hidden rounded-xl border-t-4 bg-white shadow-sm ${acento}`}>
    <div className="flex aspect-[16/9] items-center justify-center bg-gray-100 p-5 text-center text-[#676767]"><div><ImageOff className="mx-auto h-8 w-8"/><p className="mt-2 text-xs font-bold">{producto.documentos.fotografiaPrincipalDisponible?'Fotografía registrada; vista previa protegida':'Fotografía no disponible'}</p></div></div>
    <div className="flex flex-1 flex-col p-4"><p className="text-xs font-black uppercase tracking-wide text-[#676767]">{producto.familia.nombre} · {producto.codigo}</p><h3 className="mt-1 text-lg font-black text-black">{producto.nombre}</h3><p className="mt-2 line-clamp-3 text-sm leading-5 text-gray-600">{producto.descripcion||'Sin descripción comercial publicada para este segmento.'}</p><div className="mt-3 flex items-center gap-2 text-xs font-bold text-[#676767]"><ShieldCheck className="h-4 w-4"/>Versión {producto.numeroVersion}</div><p className={`mt-3 text-sm font-black ${producto.precio.resultado==='VIGENTE'?'text-black':'text-amber-700'}`}>{precio(producto)}</p>
      <div className="mt-auto flex flex-wrap gap-2 pt-4"><button type="button" onClick={()=>verFicha(producto)} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-bold text-black hover:border-[#FE8F01]"><Eye className="h-4 w-4"/>Ver ficha comercial</button>{seleccionable&&seleccionar&&<button type="button" onClick={()=>seleccionar(producto)} className="rounded-lg bg-[#FE8F01] px-3 py-2 text-xs font-black text-black hover:bg-orange-400">Seleccionar</button>}</div>
    </div>
  </article>;
}
