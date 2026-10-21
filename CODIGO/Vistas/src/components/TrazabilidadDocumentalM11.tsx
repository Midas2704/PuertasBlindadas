import { useState } from 'react';
import { solicitarFinanzas } from '../api/finanzas';

type Estado = 'CONFIRMADO' | 'PARCIAL' | 'DISCREPANCIA' | 'DATOS_INSUFICIENTES' | 'INFORMACION_INSUFICIENTE' | string;
type GuiaCadena = { id:number; folio:string; salidaFisica:string };
type DteCadena = { id:number; tipo:string; folio:string; moneda:string; monto:number|string };
type HallazgoCadena = { id_hallazgo_discrepancia_m11:string|number; tipo_discrepancia:string; estado:string };
type RespuestaCadena = { estado:Estado; etapaA:{estado:Estado}; etapaB:{estado:Estado}; cadena:{ordenCompra:{folio:string};notaVenta?:{numero:string}|null;guias:GuiaCadena[];documentosTributarios:DteCadena[];advertenciaFisica:string};fuenteFisica?:{detalle:string};hallazgos:HallazgoCadena[] };
const estilo: Record<string, string> = {
  CONFIRMADO: 'bg-green-100 text-green-800', PARCIAL: 'bg-amber-100 text-amber-800',
  DISCREPANCIA: 'bg-red-100 text-red-800', DATOS_INSUFICIENTES: 'bg-gray-200 text-gray-800', INFORMACION_INSUFICIENTE: 'bg-gray-200 text-gray-800',
};
const EstadoM11 = ({ valor }: { valor: Estado }) => <span className={`rounded px-2 py-1 text-xs font-bold ${estilo[valor] || 'bg-gray-100 text-gray-700'}`}>{valor.replaceAll('_', ' ')}</span>;

export default function TrazabilidadDocumentalM11({ idCotizacion }: { idCotizacion: number }) {
  const [datos, setDatos] = useState<RespuestaCadena|null>(null); const [error, setError] = useState(''); const [cargando, setCargando] = useState(false);
  const consultar = async () => {
    setCargando(true); setError('');
    try { const respuesta = await solicitarFinanzas(`/billing/quotes/${idCotizacion}/document-reconciliation`); const cuerpo = await respuesta.json() as RespuestaCadena & {error?:string}; if (!respuesta.ok) throw new Error(cuerpo.error || 'No fue posible consultar la cadena documental'); setDatos(cuerpo); }
    catch (e) { setError(e instanceof Error ? e.message : 'No fue posible consultar la cadena documental'); } finally { setCargando(false); }
  };
  return <section className="rounded-lg border border-gray-200 p-4">
    <div className="flex flex-wrap items-center justify-between gap-2"><div><h4 className="font-semibold text-gray-900">Cadena documental M11</h4><p className="text-xs text-gray-500">Orden de Compra → Guías → documentos tributarios, sin inferir despacho físico.</p></div><button type="button" onClick={()=>void consultar()} disabled={cargando} className="rounded bg-[#676767] px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">{cargando?'Consultando…':'Consultar cadena y conciliación'}</button></div>
    {error&&<p role="alert" className="mt-3 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
    {datos&&<div className="mt-4 space-y-3 text-sm">
      <div className="flex flex-wrap gap-2"><EstadoM11 valor={datos.estado}/><EstadoM11 valor={datos.etapaA.estado}/><EstadoM11 valor={datos.etapaB.estado}/></div>
      <p><strong>OC:</strong> {datos.cadena.ordenCompra.folio} · <strong>NV:</strong> {datos.cadena.notaVenta?.numero||'No registrada'}</p>
      <div className="grid gap-3 md:grid-cols-2"><div><strong>Guías</strong>{datos.cadena.guias.length?datos.cadena.guias.map(g=><p key={g.id}>{g.folio} · salida física {g.salidaFisica.replaceAll('_',' ').toLowerCase()}</p>):<p className="text-gray-500">Sin guía vinculada</p>}</div><div><strong>DTE</strong>{datos.cadena.documentosTributarios.length?datos.cadena.documentosTributarios.map(d=><p key={d.id}>{d.tipo} {d.folio} · {d.moneda} {Number(d.monto).toLocaleString('es-CL')}</p>):<p className="text-gray-500">Sin documento tributario vinculado</p>}</div></div>
      <p className="rounded bg-amber-50 p-3 text-amber-900">{datos.fuenteFisica?.detalle||datos.cadena.advertenciaFisica}</p>
      {datos.hallazgos?.length>0&&<div><strong>Hallazgos acreditados</strong><ul className="mt-1 list-disc pl-5">{datos.hallazgos.map(h=><li key={h.id_hallazgo_discrepancia_m11}>{h.tipo_discrepancia} · {h.estado}</li>)}</ul></div>}
    </div>}
  </section>;
}
