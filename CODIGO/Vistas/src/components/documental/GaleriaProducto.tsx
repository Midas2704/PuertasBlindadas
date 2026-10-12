import { Images, LockKeyhole, Move } from 'lucide-react';
import TarjetaImagenProducto from './TarjetaImagenProducto';
import type { DocumentoComercialProducto } from './tipos';

export default function GaleriaProducto({ fotografias, puedePrevisualizar, consultaReal, seleccionar }: { fotografias: readonly DocumentoComercialProducto[]; puedePrevisualizar: boolean; consultaReal: boolean; seleccionar: (id: string) => void }) {
  const ordenadas = [...fotografias].sort((a, b) => a.ordenPresentacion - b.ordenPresentacion);
  return <section aria-labelledby="titulo-galeria-documental" className="space-y-3">
    <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 id="titulo-galeria-documental" className="flex items-center gap-2 text-base font-black text-black"><Images aria-hidden="true" className="h-5 w-5 text-[#FE8F01]" />Galería comercial</h3><p className="mt-1 text-xs leading-5 text-[#676767]">Miniaturas derivadas; la visualización nunca modifica el original.</p></div><span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#676767]"><Move aria-hidden="true" className="h-3.5 w-3.5" />Orden preparado</span></div>
    {ordenadas.length ? <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{ordenadas.map(documento => <TarjetaImagenProducto key={documento.idAsociacion} documento={documento} puedePrevisualizar={puedePrevisualizar} seleccionar={seleccionar} />)}</div> : <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center"><LockKeyhole aria-hidden="true" className="mx-auto h-7 w-7 text-[#676767]" /><p className="mt-3 text-sm font-bold text-black">{consultaReal ? 'Sin fotografías comerciales asociadas' : 'Galería sin datos autorizados'}</p><p className="mt-1 text-xs leading-5 text-[#676767]">{consultaReal ? 'La consulta autorizada confirmó que no hay fotografías disponibles.' : 'No se muestran fotografías hasta recibir metadatos desde una integración habilitada.'}</p></div>}
  </section>;
}
