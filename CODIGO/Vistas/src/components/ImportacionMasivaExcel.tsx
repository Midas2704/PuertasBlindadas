import { useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, Download, FileSpreadsheet, Upload, X } from 'lucide-react';
import { solicitarFinanzas } from '../api/finanzas';

type TipoImportacion = 'clientes' | 'empleados' | 'proveedores' | 'areas-trabajo' | 'tareas-fabricacion' | 'categorias-egreso';

interface ResultadoImportacion {
  tipo:string;
  titulo:string;
  totalFilas:number;
  valido:boolean;
  importadas:number;
  filasMuestra:Array<Record<string,unknown>>;
  errores:Array<{fila:number;errores:string[]}>;
}

interface Propiedades {
  tipo: TipoImportacion;
  titulo: string;
  onCompletado?: () => void | Promise<void>;
  className?: string;
}

const leerBase64 = (archivo: File) => new Promise<string>((resolver,rechazar) => {
  const lector = new FileReader();
  lector.onerror = () => rechazar(new Error('No fue posible leer el archivo'));
  lector.onload = () => resolver(String(lector.result || '').split(',')[1] || '');
  lector.readAsDataURL(archivo);
});

const descargarBase64 = (contenido:string, nombre:string, mimeType:string) => {
  const binario = window.atob(contenido);
  const bytes = new Uint8Array(binario.length);
  for (let indice=0; indice<binario.length; indice++) bytes[indice] = binario.charCodeAt(indice);
  const url = URL.createObjectURL(new Blob([bytes],{type:mimeType}));
  const enlace = document.createElement('a');
  enlace.href=url; enlace.download=nombre; enlace.click();
  window.setTimeout(()=>URL.revokeObjectURL(url),1000);
};

async function json(ruta:string, opciones?:RequestInit) {
  const respuesta = await solicitarFinanzas(ruta,opciones);
  const resultado = await respuesta.json();
  if (!respuesta.ok) throw new Error(resultado.error || 'No fue posible completar la importación');
  return resultado;
}

export default function ImportacionMasivaExcel({tipo,titulo,onCompletado,className}:Propiedades) {
  const selector = useRef<HTMLInputElement>(null);
  const [abierto,setAbierto] = useState(false);
  const [archivo,setArchivo] = useState<File|null>(null);
  const [contenido,setContenido] = useState('');
  const [resultado,setResultado] = useState<ResultadoImportacion|null>(null);
  const [error,setError] = useState('');
  const [ocupado,setOcupado] = useState(false);
  const [finalizado,setFinalizado] = useState(false);

  const cerrar = () => { if (ocupado) return; setAbierto(false); setArchivo(null); setContenido(''); setResultado(null); setError(''); setFinalizado(false); if (selector.current) selector.current.value=''; };
  const descargar = async () => {
    setOcupado(true); setError('');
    try {
      const plantilla = await json(`/importaciones/${tipo}/plantilla`) as {nombre:string;mimeType:string;contenidoBase64:string};
      descargarBase64(plantilla.contenidoBase64,plantilla.nombre,plantilla.mimeType);
    } catch (causa) { setError((causa as Error).message); }
    finally { setOcupado(false); }
  };
  const seleccionar = async (seleccionado:File|null) => {
    setArchivo(seleccionado); setResultado(null); setError(''); setFinalizado(false);
    if (!seleccionado) { setContenido(''); return; }
    if (!seleccionado.name.toLowerCase().endsWith('.xlsx')) { setError('Selecciona un archivo Excel con extensión .xlsx'); setContenido(''); return; }
    if (seleccionado.size > 5*1024*1024) { setError('El archivo supera el máximo de 5 MB'); setContenido(''); return; }
    try { setContenido(await leerBase64(seleccionado)); }
    catch (causa) { setError((causa as Error).message); }
  };
  const enviar = async (soloValidar:boolean) => {
    if (!contenido) return;
    setOcupado(true); setError('');
    try {
      const respuesta = await json(`/importaciones/${tipo}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({contenidoBase64:contenido,soloValidar})}) as ResultadoImportacion;
      setResultado(respuesta);
      if (!soloValidar) {
        setFinalizado(true);
        if (respuesta.importadas>0 && onCompletado) {
          try { await onCompletado(); }
          catch { setError('La importación terminó, pero no fue posible actualizar la lista. Ciérrala y vuelve a cargar la vista.'); }
        }
      }
    } catch (causa) { setError((causa as Error).message); }
    finally { setOcupado(false); }
  };

  return <>
    <button type="button" onClick={()=>setAbierto(true)} className={className || 'inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 font-semibold text-gray-800 hover:border-[#FE8F01]'}><FileSpreadsheet className="h-4 w-4"/>Importar Excel</button>
    {abierto&&<div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-label={`Importar ${titulo}`}>
      <div className="max-h-[92vh] w-full max-w-4xl overflow-auto rounded-xl bg-white shadow-2xl">
        <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b bg-white p-5"><div><p className="text-xs font-black uppercase tracking-wider text-[#FE8F01]">Carga masiva</p><h2 className="text-xl font-black">Importar {titulo} desde Excel</h2><p className="mt-1 text-sm text-gray-600">Descarga la plantilla, completa una fila por registro y valida antes de importar.</p></div><button title="Cerrar" disabled={ocupado} onClick={cerrar} className="rounded p-2 hover:bg-gray-100 disabled:opacity-40"><X className="h-5 w-5"/></button></header>
        <div className="space-y-5 p-5">
          <section className="rounded-lg border border-orange-200 bg-orange-50 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="font-black">1. Descarga la plantilla oficial</h3><p className="mt-1 text-sm text-gray-700">Las cabeceras rojas con * son obligatorias. Cada cabecera incluye una nota y existe una hoja de instrucciones.</p></div><button disabled={ocupado} onClick={()=>void descargar()} className="inline-flex items-center gap-2 rounded-md bg-black px-4 py-2.5 font-bold text-white disabled:opacity-50"><Download className="h-4 w-4"/>Descargar plantilla</button></div></section>
          <section className="rounded-lg border p-4"><h3 className="font-black">2. Selecciona el archivo completado</h3><input ref={selector} className="hidden" type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={evento=>void seleccionar(evento.target.files?.[0]||null)}/><button disabled={ocupado} onClick={()=>selector.current?.click()} className="mt-3 flex min-h-28 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 hover:border-[#FE8F01]"><Upload className="mb-2 h-7 w-7 text-[#FE8F01]"/><span className="font-bold">{archivo?archivo.name:'Seleccionar archivo .xlsx'}</span><span className="mt-1 text-xs text-gray-500">Máximo 5 MB y 1.000 filas</span></button><div className="mt-3 flex justify-end"><button disabled={!contenido||ocupado} onClick={()=>void enviar(true)} className="rounded-md bg-[#FE8F01] px-4 py-2.5 font-black text-black disabled:opacity-40">{ocupado?'Procesando…':'Validar archivo'}</button></div></section>
          {error&&<div className="flex gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800"><AlertTriangle className="h-5 w-5 shrink-0"/><span>{error}</span></div>}
          {resultado&&<section className="rounded-lg border p-4"><div className="flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2">{resultado.valido?<CheckCircle2 className="h-6 w-6 text-emerald-600"/>:<AlertTriangle className="h-6 w-6 text-red-600"/>}<div><h3 className="font-black">{finalizado?'Resultado de la importación':resultado.valido?'Archivo listo para importar':'Corrige el archivo antes de importar'}</h3><p className="text-sm text-gray-600">{resultado.totalFilas} fila(s) detectada(s){finalizado?` · ${resultado.importadas} importada(s)`:''}.</p></div></div>{!finalizado&&resultado.valido&&<button disabled={ocupado} onClick={()=>void enviar(false)} className="rounded-md bg-emerald-700 px-4 py-2.5 font-black text-white disabled:opacity-50">Confirmar importación</button>}</div>
            {resultado.errores.length>0&&<div className="mt-4 max-h-52 overflow-auto rounded border border-red-200"><table className="w-full text-left text-sm"><thead className="sticky top-0 bg-red-50"><tr><th className="px-3 py-2">Fila</th><th className="px-3 py-2">Problema</th></tr></thead><tbody>{resultado.errores.map(item=><tr key={`${item.fila}-${item.errores.join('-')}`} className="border-t"><td className="px-3 py-2 font-bold">{item.fila}</td><td className="px-3 py-2">{item.errores.join(' · ')}</td></tr>)}</tbody></table></div>}
            {!finalizado&&resultado.filasMuestra.length>0&&<div className="mt-4"><h4 className="mb-2 text-sm font-black">Vista previa de las primeras filas</h4><div className="overflow-x-auto rounded border"><table className="w-full min-w-max text-left text-xs"><thead className="bg-gray-100"><tr>{Object.keys(resultado.filasMuestra[0]).map(clave=><th key={clave} className="px-3 py-2">{clave}</th>)}</tr></thead><tbody>{resultado.filasMuestra.map((fila,indice)=><tr key={indice} className="border-t">{Object.keys(resultado.filasMuestra[0]).map(clave=><td key={clave} className="max-w-56 truncate px-3 py-2">{String(fila[clave]??'')}</td>)}</tr>)}</tbody></table></div></div>}
          </section>}
        </div>
        <footer className="sticky bottom-0 flex justify-end border-t bg-white p-4"><button disabled={ocupado} onClick={cerrar} className="rounded-md border px-4 py-2 font-bold">{finalizado?'Cerrar':'Cancelar'}</button></footer>
      </div>
    </div>}
  </>;
}
