import { CloudOff, RefreshCw, UploadCloud } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { EVENTO_COLA, obtenerEstadoCola, sincronizarSolicitudes } from './colaSinConexion';

export default function EstadoSinConexion(){
  const [enLinea,setEnLinea]=useState(()=>navigator.onLine);
  const [estado,setEstado]=useState({pendientes:0,errores:0});
  const [sincronizando,setSincronizando]=useState(false);
  const actualizar=useCallback(()=>{setEnLinea(navigator.onLine);void obtenerEstadoCola().then(setEstado).catch(()=>undefined);},[]);
  useEffect(()=>{const inicial=window.setTimeout(actualizar,0);window.addEventListener('online',actualizar);window.addEventListener('offline',actualizar);window.addEventListener(EVENTO_COLA,actualizar);return()=>{window.clearTimeout(inicial);window.removeEventListener('online',actualizar);window.removeEventListener('offline',actualizar);window.removeEventListener(EVENTO_COLA,actualizar);};},[actualizar]);
  const sincronizar=async()=>{setSincronizando(true);try{await sincronizarSolicitudes();}finally{setSincronizando(false);actualizar();}};
  if(enLinea&&estado.pendientes===0&&estado.errores===0)return null;
  return <aside role="status" aria-live="polite" className={`fixed bottom-4 left-4 z-[80] max-w-[calc(100vw-2rem)] rounded-xl border px-4 py-3 text-sm shadow-2xl ${enLinea?'border-orange-300 bg-orange-50 text-orange-950':'border-gray-700 bg-gray-950 text-white'}`}>
    <div className="flex items-center gap-3">{enLinea?<UploadCloud className="h-5 w-5 shrink-0"/>:<CloudOff className="h-5 w-5 shrink-0"/>}<div><strong>{enLinea?'Información pendiente':'Trabajando sin Internet'}</strong><p className="text-xs opacity-80">{estado.pendientes} pendiente(s){estado.errores?` · ${estado.errores} requieren revisión`:''}</p></div>{enLinea&&estado.pendientes>0&&<button type="button" disabled={sincronizando} onClick={()=>void sincronizar()} className="ml-2 rounded-lg border border-current p-2 disabled:opacity-50" aria-label="Sincronizar ahora"><RefreshCw className={`h-4 w-4 ${sincronizando?'animate-spin':''}`}/></button>}</div>
  </aside>;
}
