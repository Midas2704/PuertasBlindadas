import { Download, Eye, FileCheck2, History, LoaderCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { solicitarFinanzas } from '../../api/finanzas';
import { usarSesion } from '../../seguridad/Sesion';
import ModalFormulario from '../ModalFormulario';

type ArchivoHistorico = {
  numeroVersion: number;
  estado: string;
  nombre: string;
  mime: string;
  tamanoBytes: string | number;
  sha256: string | null;
  creadoEn: string;
  validadoEn: string | null;
};

type VersionHistorica = {
  idVersion: string | number;
  numeroVersion: number;
  fechaEmision: string;
  estadoDocumental: string;
  documento: { estado: string; archivo: ArchivoHistorico | null } | null;
};

type PdfHistorico = {
  nombre: string;
  mime: string;
  contenido: string;
  sha256: string;
  tamanoBytes: number;
  numeroVersion: number;
  fecha: string;
};

type Props = {
  cotizacionId: number;
  estadoCotizacion?: string;
  compacto?: boolean;
};

const respuestaJson = async <T,>(ruta: string): Promise<T> => {
  const respuesta = await solicitarFinanzas(ruta);
  const datos = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) throw new Error(datos.error || 'No fue posible recuperar el documento histórico');
  return datos as T;
};

const formatoBytes = (valor: string | number) => {
  const bytes = Number(valor);
  if (!Number.isFinite(bytes)) return 'Tamaño no disponible';
  return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KiB` : `${(bytes / (1024 * 1024)).toFixed(1)} MiB`;
};

export default function DocumentosHistoricosCotizacion({ cotizacionId, estadoCotizacion, compacto = false }: Props) {
  const { sesion } = usarSesion();
  const autorizado = Boolean(sesion?.permisos.includes('CU376'));
  const [versiones, setVersiones] = useState<VersionHistorica[]>([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(autorizado && Boolean(cotizacionId));
  const [modalAbierto, setModalAbierto] = useState(false);
  const [pdf, setPdf] = useState<PdfHistorico | null>(null);
  const [cargandoPdf, setCargandoPdf] = useState<string | number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!autorizado || !cotizacionId) return;
    let activo = true;
    respuestaJson<VersionHistorica[]>(`/billing/quotes/${cotizacionId}/documentos`)
      .then(datos => { if (activo) setVersiones(Array.isArray(datos) ? datos : []); })
      .catch(() => { if (activo) setVersiones([]); })
      .finally(() => { if (activo) setCargandoHistorial(false); });
    return () => { activo = false; };
  }, [autorizado, cotizacionId]);

  const disponibles = useMemo(
    () => versiones.filter(version => version.estadoDocumental === 'DISPONIBLE' && version.documento?.archivo?.estado === 'DISPONIBLE'),
    [versiones],
  );

  const abrir = async (version: VersionHistorica) => {
    setCargandoPdf(version.idVersion);
    setError('');
    try {
      const recuperado = await respuestaJson<PdfHistorico>(`/billing/quotes/${cotizacionId}/documentos/${version.idVersion}/descarga`);
      setPdf(recuperado);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error de recuperación documental');
    } finally {
      setCargandoPdf(null);
    }
  };

  if (!autorizado) return null;
  if (cargandoHistorial) return compacto ? <LoaderCircle aria-label="Consultando documento" className="h-4 w-4 animate-spin text-[#676767]" /> : null;
  if (!versiones.length) {
    return ['emitida', 'aprobada'].includes(String(estadoCotizacion || '').toLowerCase())
      ? <span className="text-xs font-semibold text-amber-700">Documento pendiente de confirmación</span>
      : null;
  }

  return <>
    <button
      type="button"
      onClick={() => { setModalAbierto(true); setError(''); }}
      disabled={!disponibles.length}
      className={compacto
        ? 'inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-bold text-black hover:border-[#FE8F01] disabled:cursor-not-allowed disabled:opacity-50'
        : 'inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-bold text-black hover:border-[#FE8F01] disabled:cursor-not-allowed disabled:opacity-50'}
      title={disponibles.length ? 'Consultar PDF emitido e historial documental' : 'El documento todavía no está confirmado'}
    >
      <FileCheck2 className="h-4 w-4" />
      {compacto ? 'PDF' : 'PDF emitido'}
    </button>
    {modalAbierto && <ModalFormulario
      titulo={`Documentos de COT-${cotizacionId}`}
      subtitulo="Historial inmutable. Cada apertura recupera el archivo original y valida su SHA-256 en el backend."
      tamano="grande"
      cerrar={() => { setModalAbierto(false); setPdf(null); setError(''); }}
      pie={<div className="flex flex-wrap justify-end gap-2">
        {pdf && <a href={pdf.contenido} download={pdf.nombre} className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 font-bold text-white"><Download className="h-4 w-4" />Descargar original</a>}
        <button type="button" onClick={() => { setModalAbierto(false); setPdf(null); }} className="rounded-lg border px-4 py-2 font-bold">Cerrar</button>
      </div>}
    >
      {error && <div role="alert" className="mb-4 rounded-lg bg-red-50 p-3 font-semibold text-red-700">{error}</div>}
      <div className="grid min-h-[28rem] gap-4 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <aside className="rounded-xl border bg-gray-50 p-3">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-black"><History className="h-4 w-4" />Historial documental</h3>
          <div className="space-y-2">
            {versiones.map(version => {
              const disponible = version.estadoDocumental === 'DISPONIBLE' && version.documento?.archivo?.estado === 'DISPONIBLE';
              return <div key={String(version.idVersion)} className="rounded-lg border bg-white p-3 text-xs">
                <div className="flex items-center justify-between gap-2"><strong>Versión {version.numeroVersion}</strong><span className={disponible ? 'font-bold text-green-700' : 'font-bold text-amber-700'}>{disponible ? 'Disponible' : version.estadoDocumental.replaceAll('_', ' ')}</span></div>
                <p className="mt-1 text-[#676767]">{new Date(version.fechaEmision).toLocaleString('es-CL')}</p>
                {version.documento?.archivo && <p className="mt-1 text-[#676767]">{formatoBytes(version.documento.archivo.tamanoBytes)}</p>}
                {disponible && <button type="button" onClick={() => void abrir(version)} disabled={cargandoPdf !== null} className="mt-2 inline-flex w-full items-center justify-center gap-1 rounded-md border px-2 py-1.5 font-bold hover:border-[#FE8F01] disabled:opacity-50">{cargandoPdf === version.idVersion ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Eye className="h-3.5 w-3.5" />}Ver PDF</button>}
              </div>;
            })}
          </div>
        </aside>
        <section className="min-w-0">
          {pdf ? <>
            <iframe title={`PDF emitido COT-${cotizacionId} versión ${pdf.numeroVersion}`} src={pdf.contenido} className="h-[60vh] min-h-[28rem] w-full rounded-xl border bg-gray-100" />
            <div className="mt-2 rounded-lg bg-gray-50 p-2 text-xs text-[#676767]"><p>Emitido: {new Date(pdf.fecha).toLocaleString('es-CL')} · {formatoBytes(pdf.tamanoBytes)}</p><p className="mt-1 break-all">SHA-256: {pdf.sha256}</p></div>
          </> : <div className="flex h-full min-h-[28rem] items-center justify-center rounded-xl border border-dashed bg-gray-50 p-6 text-center text-sm text-[#676767]">Selecciona una versión confirmada para recuperar el PDF original.</div>}
        </section>
      </div>
    </ModalFormulario>}
  </>;
}
