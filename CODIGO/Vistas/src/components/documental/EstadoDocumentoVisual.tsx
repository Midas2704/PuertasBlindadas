import { Archive, CheckCircle2, CircleAlert, Clock3, LoaderCircle, LockKeyhole, RefreshCw } from 'lucide-react';
import type { EstadoDocumentoComercial } from './tipos';

const presentacion: Record<EstadoDocumentoComercial, { etiqueta: string; clase: string; Icono: typeof Clock3 }> = {
  PENDIENTE: { etiqueta: 'Pendiente', clase: 'border-gray-300 bg-gray-50 text-[#676767]', Icono: Clock3 },
  SUBIENDO: { etiqueta: 'En incorporación', clase: 'border-orange-200 bg-orange-50 text-[#8a4700]', Icono: LoaderCircle },
  VALIDANDO: { etiqueta: 'En validación', clase: 'border-orange-200 bg-orange-50 text-[#8a4700]', Icono: RefreshCw },
  DISPONIBLE: { etiqueta: 'Disponible', clase: 'border-emerald-200 bg-emerald-50 text-emerald-800', Icono: CheckCircle2 },
  ERROR: { etiqueta: 'Con error', clase: 'border-red-200 bg-red-50 text-red-800', Icono: CircleAlert },
  CUARENTENA: { etiqueta: 'Contenido restringido', clase: 'border-red-300 bg-red-50 text-red-900', Icono: LockKeyhole },
  REEMPLAZADO: { etiqueta: 'Reemplazado', clase: 'border-gray-300 bg-gray-100 text-[#676767]', Icono: RefreshCw },
  ARCHIVADO: { etiqueta: 'Archivado', clase: 'border-gray-300 bg-gray-100 text-[#676767]', Icono: Archive },
};

export default function EstadoDocumentoVisual({ estado, compacto = false }: { estado: EstadoDocumentoComercial; compacto?: boolean }) {
  const actual = presentacion[estado];
  return <span className={`inline-flex items-center gap-1.5 rounded-full border font-bold ${compacto ? 'px-2 py-1 text-[10px]' : 'px-2.5 py-1 text-xs'} ${actual.clase}`}><actual.Icono aria-hidden="true" className={`${compacto ? 'h-3 w-3' : 'h-3.5 w-3.5'} ${estado === 'SUBIENDO' || estado === 'VALIDANDO' ? 'animate-spin' : ''}`} />{actual.etiqueta}</span>;
}
