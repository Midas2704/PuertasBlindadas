import type { DocumentoComercialProducto } from './tipos';

export default function ResumenUsoComercial({ documento }: { documento: Pick<DocumentoComercialProducto, 'habilitadoB2b' | 'habilitadoB2c'> }) {
  const usos = [documento.habilitadoB2b ? 'B2B' : null, documento.habilitadoB2c ? 'B2C' : null].filter(Boolean);
  return <div className="flex flex-wrap gap-1.5" aria-label={usos.length ? `Uso comercial ${usos.join(' y ')}` : 'Sin uso comercial definido'}>
    {usos.map(uso => <span key={uso} className="rounded-full border border-gray-300 bg-white px-2 py-0.5 text-[10px] font-black tracking-wide text-[#676767]">{uso}</span>)}
    {!usos.length && <span className="text-xs text-[#676767]">Sin uso comercial definido</span>}
  </div>;
}
