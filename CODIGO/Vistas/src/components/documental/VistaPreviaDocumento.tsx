import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';
import ModalFormulario from '../ModalFormulario';
import EstadoDocumentoVisual from './EstadoDocumentoVisual';
import ResumenUsoComercial from './ResumenUsoComercial';
import type { DocumentoComercialProducto } from './tipos';

export default function VistaPreviaDocumento({ documento, fotografias, cerrar, navegar }: { documento: DocumentoComercialProducto; fotografias: readonly DocumentoComercialProducto[]; cerrar: () => void; navegar: (id: string) => void }) {
  const indice = fotografias.findIndex(actual => actual.idDocumento === documento.idDocumento);
  const url = documento.estado === 'DISPONIBLE' ? documento.vistaPrevia?.urlTemporal : undefined;
  const anterior = indice > 0 ? fotografias[indice - 1] : undefined;
  const siguiente = indice >= 0 && indice < fotografias.length - 1 ? fotografias[indice + 1] : undefined;
  return <ModalFormulario titulo="Vista previa documental" subtitulo={`${documento.titulo} · versión ${documento.versionActual}`} tamano="grande" cerrar={cerrar} pie={<div className="flex flex-wrap items-center justify-between gap-3"><div className="flex gap-2"><button type="button" disabled={!anterior} onClick={() => anterior && navegar(anterior.idDocumento)} className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-bold disabled:opacity-40"><ChevronLeft aria-hidden="true" className="h-4 w-4" />Anterior</button><button type="button" disabled={!siguiente} onClick={() => siguiente && navegar(siguiente.idDocumento)} className="inline-flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-bold disabled:opacity-40">Siguiente<ChevronRight aria-hidden="true" className="h-4 w-4" /></button></div><button type="button" onClick={cerrar} className="rounded-lg bg-[#FE8F01] px-4 py-2 text-sm font-black text-black">Cerrar</button></div>}>
    <div className="space-y-4"><div className="flex min-h-64 items-center justify-center overflow-hidden rounded-xl bg-gray-100 sm:min-h-96">{url && documento.mimeDetectado?.startsWith('image/') ? <img src={url} alt={documento.titulo} className="max-h-[65vh] w-full object-contain" /> : url && documento.mimeDetectado === 'application/pdf' ? <iframe src={url} title={`Vista previa de ${documento.titulo}`} className="h-[65vh] w-full border-0" /> : <div className="p-8 text-center text-[#676767]"><ImageOff aria-hidden="true" className="mx-auto h-10 w-10" /><p className="mt-3 text-sm font-bold">Vista previa no disponible</p></div>}</div><div className="flex flex-wrap items-center justify-between gap-3"><EstadoDocumentoVisual estado={documento.estado} /><ResumenUsoComercial documento={documento} /></div></div>
  </ModalFormulario>;
}
