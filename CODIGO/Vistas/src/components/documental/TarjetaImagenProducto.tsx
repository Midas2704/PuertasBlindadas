import { Eye, ImageOff, Star } from 'lucide-react';
import EstadoDocumentoVisual from './EstadoDocumentoVisual';
import ResumenUsoComercial from './ResumenUsoComercial';
import type { DocumentoComercialProducto } from './tipos';

export default function TarjetaImagenProducto({ documento, puedePrevisualizar, seleccionar }: { documento: DocumentoComercialProducto; puedePrevisualizar: boolean; seleccionar: (id: string) => void }) {
  const miniatura = documento.estado === 'DISPONIBLE' ? documento.vistaPrevia?.urlTemporal : undefined;
  return <article className={`overflow-hidden rounded-xl border bg-white ${documento.esImagenPrincipal ? 'border-[#FE8F01] shadow-sm' : 'border-gray-200'}`}>
    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
      {miniatura ? <img src={miniatura} alt={documento.titulo} loading="lazy" className="h-full w-full object-contain" /> : <div className="flex h-full flex-col items-center justify-center gap-2 p-5 text-center text-[#676767]"><ImageOff aria-hidden="true" className="h-8 w-8" /><p className="text-xs font-semibold">Miniatura no disponible</p></div>}
      {documento.esImagenPrincipal && <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-[#FE8F01] px-2.5 py-1 text-[10px] font-black text-black shadow"><Star aria-hidden="true" className="h-3 w-3 fill-current" />Principal</span>}
      <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-[10px] font-bold text-white">Orden {documento.ordenPresentacion}</span>
    </div>
    <div className="space-y-3 p-3">
      <div className="min-w-0"><h4 className="truncate text-sm font-black text-black" title={documento.titulo}>{documento.titulo}</h4><p className="mt-0.5 text-xs text-[#676767]">Versión {documento.versionActual}</p></div>
      <div className="flex flex-wrap items-center justify-between gap-2"><EstadoDocumentoVisual estado={documento.estado} compacto /><ResumenUsoComercial documento={documento} /></div>
      <button type="button" disabled={!puedePrevisualizar || !miniatura} onClick={() => seleccionar(documento.idDocumento)} className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-bold text-black transition hover:border-[#FE8F01] disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"><Eye aria-hidden="true" className="h-4 w-4" />Vista ampliada</button>
    </div>
  </article>;
}
