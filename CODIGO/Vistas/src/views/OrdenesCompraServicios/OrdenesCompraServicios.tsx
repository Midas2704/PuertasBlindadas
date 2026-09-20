import { useEffect, useState } from 'react';
import { Edit3, Eye, FilePlus2, ReceiptText, X } from 'lucide-react';
import { solicitarFinanzas } from '../../api/finanzas';
import { usarSesion } from '../../seguridad/Sesion';

interface Proveedor { idProveedor: number; razonSocial: string }
interface Ocs {
  id: number;
  proveedor: { id: number; razonSocial: string; estado: string };
  estado: string;
  montoAutorizado: number;
  montoDocumentado: number;
  saldoDisponible: number;
  referencia: string | null;
  periodo: string | null;
  descripcion: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
  creadoPor: { id: string; nombre: string };
  historial: Array<{ id: number; campo: string; valorAnterior: string | null; valorNuevo: string | null; fechaHora: string; usuario: string }>;
}

const vacio = { idProveedor: '', montoAutorizado: '', referencia: '', periodo: '', descripcion: '' };

async function respuestaJson(ruta: string, opciones?: RequestInit) {
  const respuesta = await solicitarFinanzas(ruta, opciones);
  const resultado = await respuesta.json();
  if (!respuesta.ok) throw new Error(resultado.error || 'No fue posible completar la operación');
  return resultado;
}

export default function OrdenesCompraServicios() {
  const { sesion } = usarSesion();
  const puede = (permiso: string) => !!sesion?.permisos.includes(permiso);
  const puedeCrear = puede('CU89');
  const puedeEditar = puede('CU90');
  const [ordenes, setOrdenes] = useState<Ocs[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [seleccionada, setSeleccionada] = useState<Ocs | null>(null);
  const [modal, setModal] = useState<'crear' | 'editar' | null>(null);
  const [formulario, setFormulario] = useState(vacio);
  const [version, setVersion] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    Promise.all([
      respuestaJson('/ordenes-compra-servicios'),
      puedeCrear || puedeEditar ? respuestaJson('/proveedores?estado=activo') : Promise.resolve([]),
    ]).then(([lista, activos]) => { setOrdenes(lista); setProveedores(activos); }).catch(causa => setError(causa.message)).finally(() => setCargando(false));
  }, [version, puedeCrear, puedeEditar]);

  const abrirDetalle = async (id: number) => {
    setError('');
    try { setSeleccionada(await respuestaJson(`/ordenes-compra-servicios/${id}`)); }
    catch (causa) { setError((causa as Error).message); }
  };

  const abrirCrear = () => { setFormulario(vacio); setModal('crear'); setSeleccionada(null); };
  const abrirEditar = (orden: Ocs) => {
    setFormulario({ idProveedor: String(orden.proveedor.id), montoAutorizado: String(orden.montoAutorizado), referencia: orden.referencia || '', periodo: orden.periodo || '', descripcion: orden.descripcion || '' });
    setSeleccionada(orden); setModal('editar');
  };

  const guardar = async () => {
    if (!modal) return;
    setGuardando(true); setError(''); setMensaje('');
    try {
      const cuerpo = { idProveedor: Number(formulario.idProveedor), montoAutorizado: Number(formulario.montoAutorizado), referencia: formulario.referencia, periodo: formulario.periodo, descripcion: formulario.descripcion };
      if (modal === 'crear') await respuestaJson('/ordenes-compra-servicios', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cuerpo) });
      else await respuestaJson(`/ordenes-compra-servicios/${seleccionada!.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cuerpo) });
      setMensaje(modal === 'crear' ? 'Orden de compra de servicios registrada.' : 'Orden de compra de servicios actualizada.');
      setModal(null); setSeleccionada(null); setCargando(true); setVersion(valor => valor + 1);
    } catch (causa) { setError((causa as Error).message); }
    finally { setGuardando(false); }
  };

  return <div className="min-h-full bg-slate-50 p-5 lg:p-8"><div className="mx-auto max-w-7xl">
    <header className="mb-6 flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm font-semibold text-primary-600">Proveedores y egresos</p><h1 className="text-2xl font-bold text-gray-900">Órdenes de compra de servicios</h1></div>{puedeCrear && <button onClick={abrirCrear} className="flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2.5 font-semibold text-white hover:bg-primary-700"><FilePlus2 className="h-4 w-4"/>Nueva OCS</button>}</header>
    {(error || mensaje) && <div className={`mb-4 rounded-md border px-4 py-3 text-sm ${error ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>{error || mensaje}</div>}
    <div className="overflow-hidden rounded-md border bg-white"><div className="overflow-x-auto"><table className="w-full min-w-[940px] text-left text-sm"><thead className="border-b bg-gray-50 text-gray-600"><tr><th className="px-4 py-3">OCS</th><th className="px-4 py-3">Proveedor</th><th className="px-4 py-3">Estado</th><th className="px-4 py-3">Creación</th><th className="px-4 py-3">Referencia / período</th><th className="px-4 py-3 text-right">Autorizado</th><th className="px-4 py-3 text-right">Documentado</th><th className="px-4 py-3 text-right">Disponible</th><th className="px-4 py-3 text-right">Acciones</th></tr></thead><tbody>{ordenes.map(orden => <tr key={orden.id} className="border-b last:border-0 hover:bg-gray-50"><td className="px-4 py-3 font-semibold">OCS-{orden.id}</td><td className="px-4 py-3">{orden.proveedor.razonSocial}</td><td className="px-4 py-3 capitalize">{orden.estado}</td><td className="px-4 py-3">{new Date(orden.fechaCreacion).toLocaleString('es-CL')}</td><td className="px-4 py-3"><div>{orden.referencia || 'Sin referencia'}</div><div className="text-xs text-gray-500">{orden.periodo || 'Sin período'}</div></td><td className="px-4 py-3 text-right font-semibold">$ {orden.montoAutorizado.toLocaleString('es-CL')}</td><td className="px-4 py-3 text-right">$ {orden.montoDocumentado.toLocaleString('es-CL')}</td><td className="px-4 py-3 text-right font-semibold">$ {orden.saldoDisponible.toLocaleString('es-CL')}</td><td className="px-4 py-3"><div className="flex justify-end gap-1"><button title="Ver detalle" onClick={() => void abrirDetalle(orden.id)} className="rounded p-2 text-gray-600 hover:bg-gray-100"><Eye className="h-4 w-4"/></button>{puede('CU90') && <button title="Editar OCS" onClick={() => abrirEditar(orden)} className="rounded p-2 text-primary-700 hover:bg-primary-50"><Edit3 className="h-4 w-4"/></button>}</div></td></tr>)}</tbody></table></div>{cargando && <p className="p-10 text-center text-gray-500">Cargando órdenes...</p>}{!cargando && !ordenes.length && <p className="p-10 text-center text-gray-500"><ReceiptText className="mx-auto mb-3 h-8 w-8"/>No hay órdenes de compra de servicios registradas.</p>}</div>

    {seleccionada && !modal && <section className="mt-5 rounded-md border bg-white"><div className="flex items-center justify-between border-b px-5 py-4"><div><h2 className="font-bold">Detalle OCS-{seleccionada.id}</h2><p className="text-sm text-gray-500">Creada por {seleccionada.creadoPor.nombre}</p></div><button title="Cerrar detalle" onClick={() => setSeleccionada(null)} className="rounded p-2 hover:bg-gray-100"><X className="h-5 w-5"/></button></div><div className="grid gap-4 p-5 text-sm md:grid-cols-3"><div><span className="text-gray-500">Proveedor</span><p className="font-semibold">{seleccionada.proveedor.razonSocial}</p></div><div><span className="text-gray-500">Descripción</span><p>{seleccionada.descripcion || 'Sin descripción'}</p></div><div><span className="text-gray-500">Última actualización</span><p>{new Date(seleccionada.fechaActualizacion).toLocaleString('es-CL')}</p></div></div><div className="border-t px-5 py-4"><h3 className="mb-3 font-semibold">Historial</h3><div className="divide-y">{seleccionada.historial.map(item => <div key={item.id} className="grid gap-2 py-3 text-sm md:grid-cols-[150px_1fr_180px]"><div><p className="font-medium capitalize">{item.campo.replaceAll('_', ' ')}</p><p className="text-xs text-gray-500">{new Date(item.fechaHora).toLocaleString('es-CL')}</p></div><p><span className="text-gray-500">Antes:</span> {item.valorAnterior || 'Sin valor'}<br/><span className="text-gray-500">Después:</span> {item.valorNuevo || 'Sin valor'}</p><p className="text-gray-500">{item.usuario}</p></div>)}</div></div></section>}
  </div>

  {modal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-md bg-white shadow-xl"><div className="flex items-center justify-between border-b px-5 py-4"><h2 className="text-lg font-bold">{modal === 'crear' ? 'Nueva orden de compra de servicios' : `Editar OCS-${seleccionada?.id}`}</h2><button title="Cerrar" onClick={() => setModal(null)} className="rounded p-2 hover:bg-gray-100"><X className="h-5 w-5"/></button></div><div className="grid gap-4 p-5 md:grid-cols-2"><label className="text-sm font-medium md:col-span-2">Proveedor activo<select value={formulario.idProveedor} onChange={evento => setFormulario({ ...formulario, idProveedor: evento.target.value })} className="mt-1 w-full rounded-md border p-2.5"><option value="">Seleccionar</option>{proveedores.map(proveedor => <option key={proveedor.idProveedor} value={proveedor.idProveedor}>{proveedor.razonSocial}</option>)}</select></label><label className="text-sm font-medium">Monto autorizado<input type="number" min="0.01" step="0.01" value={formulario.montoAutorizado} onChange={evento => setFormulario({ ...formulario, montoAutorizado: evento.target.value })} className="mt-1 w-full rounded-md border p-2.5"/></label><label className="text-sm font-medium">Período de referencia<input value={formulario.periodo} onChange={evento => setFormulario({ ...formulario, periodo: evento.target.value })} className="mt-1 w-full rounded-md border p-2.5"/></label><label className="text-sm font-medium md:col-span-2">Referencia<input value={formulario.referencia} onChange={evento => setFormulario({ ...formulario, referencia: evento.target.value })} className="mt-1 w-full rounded-md border p-2.5"/></label><label className="text-sm font-medium md:col-span-2">Descripción<textarea rows={3} value={formulario.descripcion} onChange={evento => setFormulario({ ...formulario, descripcion: evento.target.value })} className="mt-1 w-full rounded-md border p-2.5"/></label></div><div className="flex justify-end gap-3 border-t px-5 py-4"><button onClick={() => setModal(null)} className="rounded-md border px-4 py-2">Cancelar</button><button disabled={guardando} onClick={() => void guardar()} className="rounded-md bg-primary-600 px-4 py-2 font-semibold text-white disabled:opacity-50">{guardando ? 'Guardando...' : 'Guardar'}</button></div></div></div>}
  </div>;
}
