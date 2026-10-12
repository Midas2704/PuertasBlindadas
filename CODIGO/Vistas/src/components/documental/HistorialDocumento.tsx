import { History, ShieldAlert } from 'lucide-react';
import EstadoDocumentoVisual from './EstadoDocumentoVisual';
import type { DocumentoComercialProducto } from './tipos';

export default function HistorialDocumento({ documento, autorizado }: { documento: DocumentoComercialProducto | null; autorizado: boolean }) {
  return <section aria-labelledby="titulo-historial-documental"><h3 id="titulo-historial-documental" className="flex items-center gap-2 text-base font-black text-black"><History aria-hidden="true" className="h-5 w-5 text-[#FE8F01]" />Historial documental</h3>
    {!autorizado ? <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-[#676767]"><ShieldAlert aria-hidden="true" className="mb-2 h-5 w-5" />El historial requiere una capacidad documental aprobada.</div> : documento ? <div className="mt-3 space-y-2">{[...documento.versiones].sort((a, b) => b.numero - a.numero).map(version => <article key={version.idVersion} className={`flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3 ${version.vigente ? 'border-[#FE8F01] bg-orange-50/40' : 'border-gray-200 bg-white'}`}><div><p className="text-sm font-black text-black">Versión {version.numero}{version.vigente ? ' · vigente' : ' · histórica'}</p><p className="mt-1 text-xs text-[#676767]">{new Date(version.fechaCreacion).toLocaleString('es-CL')}{version.responsableVisible ? ` · ${version.responsableVisible}` : ''}</p></div><EstadoDocumentoVisual estado={version.estado} compacto /></article>)}</div> : <p className="mt-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5 text-sm text-[#676767]">Selecciona “Historial” en un documento autorizado para consultar sus versiones.</p>}
  </section>;
}
