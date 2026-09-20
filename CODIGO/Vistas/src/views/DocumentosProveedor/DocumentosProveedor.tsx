import { useEffect, useMemo, useState } from 'react';
import { Eye, FileSearch, Search, X } from 'lucide-react';
import { solicitarFinanzas } from '../../api/finanzas';

interface DocumentoProveedor {
  id: number;
  fuente: string;
  proveedor: { id: number; razonSocial: string };
  tipoDocumento: string;
  numero: string;
  fechaEmision: string;
  fechaVencimiento: string | null;
  moneda: string;
  montoTotal: number;
  estadoDocumental: string;
  saldoPendiente: number;
  estadoPagoCalculado: string;
  clasificacionM5: string;
  asociacionOrdenCompra: string;
  observacion: string | null;
}

async function respuestaJson(ruta: string) {
  const respuesta = await solicitarFinanzas(ruta);
  const resultado = await respuesta.json();
  if (!respuesta.ok) throw new Error(resultado.error || 'No fue posible consultar los documentos');
  return resultado;
}

export default function DocumentosProveedor() {
  const [documentos, setDocumentos] = useState<DocumentoProveedor[]>([]);
  const [proveedor, setProveedor] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState('');
  const [detalle, setDetalle] = useState<DocumentoProveedor | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cancelacion = new AbortController();
    const espera = window.setTimeout(() => {
      const parametros = new URLSearchParams();
      if (proveedor) parametros.set('proveedor', proveedor);
      if (busqueda.trim()) parametros.set('busqueda', busqueda.trim());
      if (estado) parametros.set('estado', estado);
      respuestaJson(`/documentos-proveedor?${parametros}`).then(setDocumentos).catch(causa => { if (!cancelacion.signal.aborted) setError(causa.message); }).finally(() => { if (!cancelacion.signal.aborted) setCargando(false); });
    }, 250);
    return () => { window.clearTimeout(espera); cancelacion.abort(); };
  }, [proveedor, busqueda, estado]);

  const proveedores = useMemo(() => [...new Map(documentos.map(item => [item.proveedor.id, item.proveedor])).values()].sort((a, b) => a.razonSocial.localeCompare(b.razonSocial, 'es-CL')), [documentos]);
  const estados = useMemo(() => [...new Set(documentos.map(item => item.estadoDocumental))].sort(), [documentos]);

  const abrirDetalle = async (id: number) => {
    setError('');
    try { setDetalle(await respuestaJson(`/documentos-proveedor/${id}`)); }
    catch (causa) { setError((causa as Error).message); }
  };

  return <div className="min-h-full bg-slate-50 p-5 lg:p-8"><div className="mx-auto max-w-7xl">
    <header className="mb-6"><p className="text-sm font-semibold text-primary-600">Proveedores y egresos</p><h1 className="text-2xl font-bold text-gray-900">Documentos de proveedor</h1></header>
    {error && <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
    <section className="mb-5 grid gap-3 border-y bg-white px-4 py-4 md:grid-cols-[1fr_220px_190px]">
      <label className="relative"><span className="sr-only">Buscar número o folio</span><Search className="absolute left-3 top-3 h-4 w-4 text-gray-400"/><input value={busqueda} onChange={evento => setBusqueda(evento.target.value)} placeholder="Buscar número o folio" className="w-full rounded-md border py-2.5 pl-10 pr-3"/></label>
      <select aria-label="Filtrar por proveedor" value={proveedor} onChange={evento => setProveedor(evento.target.value)} className="rounded-md border px-3 py-2.5"><option value="">Todos los proveedores</option>{proveedores.map(item => <option key={item.id} value={item.id}>{item.razonSocial}</option>)}</select>
      <select aria-label="Filtrar por estado documental" value={estado} onChange={evento => setEstado(evento.target.value)} className="rounded-md border px-3 py-2.5"><option value="">Todos los estados</option>{estados.map(item => <option key={item} value={item}>{item}</option>)}</select>
    </section>
    <div className="overflow-hidden rounded-md border bg-white"><div className="overflow-x-auto"><table className="w-full min-w-[1000px] text-left text-sm"><thead className="border-b bg-gray-50 text-gray-600"><tr><th className="px-4 py-3">Documento</th><th className="px-4 py-3">Proveedor</th><th className="px-4 py-3">Emisión</th><th className="px-4 py-3">Vencimiento</th><th className="px-4 py-3">Estado</th><th className="px-4 py-3 text-right">Monto total</th><th className="px-4 py-3 text-right">Saldo</th><th className="px-4 py-3">Asociación</th><th className="px-4 py-3"></th></tr></thead><tbody>{documentos.map(documento => <tr key={documento.id} className="border-b last:border-0 hover:bg-gray-50"><td className="px-4 py-3"><p className="font-semibold">{documento.numero}</p><p className="text-xs text-gray-500">{documento.tipoDocumento}</p></td><td className="px-4 py-3">{documento.proveedor.razonSocial}</td><td className="px-4 py-3">{new Date(documento.fechaEmision).toLocaleDateString('es-CL', { timeZone: 'UTC' })}</td><td className="px-4 py-3">{documento.fechaVencimiento ? new Date(documento.fechaVencimiento).toLocaleDateString('es-CL', { timeZone: 'UTC' }) : 'No disponible'}</td><td className="px-4 py-3 capitalize">{documento.estadoDocumental}</td><td className="px-4 py-3 text-right font-semibold">{documento.moneda} {documento.montoTotal.toLocaleString('es-CL')}</td><td className="px-4 py-3 text-right">{documento.moneda} {documento.saldoPendiente.toLocaleString('es-CL')}</td><td className="px-4 py-3 text-gray-600">{documento.asociacionOrdenCompra}</td><td className="px-4 py-3"><button title="Ver documento" onClick={() => void abrirDetalle(documento.id)} className="rounded p-2 text-primary-700 hover:bg-primary-50"><Eye className="h-4 w-4"/></button></td></tr>)}</tbody></table></div>{cargando && <p className="p-10 text-center text-gray-500">Cargando documentos...</p>}{!cargando && !documentos.length && <p className="p-10 text-center text-gray-500"><FileSearch className="mx-auto mb-3 h-8 w-8"/>No hay documentos para los criterios seleccionados.</p>}</div>
  </div>
  {detalle && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"><div className="w-full max-w-2xl rounded-md bg-white shadow-xl"><div className="flex items-center justify-between border-b px-5 py-4"><div><h2 className="text-lg font-bold">{detalle.tipoDocumento} {detalle.numero}</h2><p className="text-sm text-gray-500">Fuente Legacy: {detalle.fuente}</p></div><button title="Cerrar" onClick={() => setDetalle(null)} className="rounded p-2 hover:bg-gray-100"><X className="h-5 w-5"/></button></div><dl className="grid gap-4 p-5 text-sm md:grid-cols-2"><div><dt className="text-gray-500">Proveedor</dt><dd className="font-semibold">{detalle.proveedor.razonSocial}</dd></div><div><dt className="text-gray-500">Estado documental</dt><dd className="font-semibold capitalize">{detalle.estadoDocumental}</dd></div><div><dt className="text-gray-500">Clasificación M5</dt><dd>{detalle.clasificacionM5}</dd></div><div><dt className="text-gray-500">Asociación OC</dt><dd>{detalle.asociacionOrdenCompra}</dd></div><div><dt className="text-gray-500">Monto total</dt><dd className="font-semibold">{detalle.moneda} {detalle.montoTotal.toLocaleString('es-CL')}</dd></div><div><dt className="text-gray-500">Saldo pendiente calculado</dt><dd className="font-semibold">{detalle.moneda} {detalle.saldoPendiente.toLocaleString('es-CL')}</dd></div><div className="md:col-span-2"><dt className="text-gray-500">Observación</dt><dd>{detalle.observacion || 'Sin información registrada'}</dd></div></dl></div></div>}
  </div>;
}
