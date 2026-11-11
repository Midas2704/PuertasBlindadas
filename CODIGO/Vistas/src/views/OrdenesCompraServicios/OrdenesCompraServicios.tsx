import { confirmarAccion } from '../../components/DialogosSistema';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Ban, CheckCircle2, Edit3, Eye, FilePlus2, RefreshCcw, ReceiptText, SlidersHorizontal, X } from 'lucide-react';
import { solicitarFinanzas } from '../../api/finanzas';
import { usarSesion } from '../../seguridad/Sesion';
import { tienePermiso } from '../../seguridad/autorizacionSesion';

interface Proveedor { idProveedor: number; razonSocial: string }
interface Moneda { id_moneda: number; codigo_moneda: string; nombre_moneda: string; simbolo_moneda: string | null; estado_moneda?: string }
interface ClienteB2BOcs { idCliente: number; idFichaCliente: number; razonSocial: string; rut: string | null }
interface Ocs {
  id: number;
  proveedor: { id: number; razonSocial: string; estado: string };
  estado: string;
  montoAutorizado: number;
  montoAutorizadoOriginal: number;
  montoDocumentado: number;
  saldoDisponible: number;
  tieneEfectosFinancieros: boolean;
  idMoneda: number | null;
  moneda: { id: number; codigo: string; nombre: string; simbolo: string | null } | null;
  referencia: string | null;
  periodo: string | null;
  descripcion: string | null;
  fechaCreacion: string;
  fechaActualizacion: string;
  contexto?: { idFichaCliente: number | null; idCotizacion: number | null; idProyectoFinanciero: number | null; idOrdenTrabajo: string | null };
  fechaEsperadaRecepcion?: string | null;
  materiales?: Array<{ sku: string; nombre: string; cantidadPedida: number; cantidadRecibida: number; cantidadPendiente: number; fechaEsperada: string | null }>;
  creadoPor: { id: string; nombre: string };
  historial: Array<{ id: number; campo: string; valorAnterior: string | null; valorNuevo: string | null; motivo: string | null; fechaHora: string; usuario: string }>;
  ajustes: Array<{ id: number; campo: string; valorAnterior: string | null; valorPropuesto: string | null; motivo: string; estado: string; fechaSolicitud: string; solicitadoPor: string; fechaConfirmacion: string | null; confirmadoPor: string | null }>;
}

type Modo = 'crear' | 'editar' | 'ajustar' | 'anular' | 'cerrar';
const formularioVacio = { idProveedor: '', idMoneda: '', montoAutorizado: '', referencia: '', periodo: '', descripcion: '', idFichaCliente: '', idCotizacion: '', idProyectoFinanciero: '', idOrdenTrabajo: '', fechaEsperadaRecepcion: '', materialesTexto: '', campo: 'monto_autorizado', valorPropuesto: '', motivo: '', declaracionFinal: false, justificacion: '' };

const presentarMonto = (monto: number, moneda: Ocs['moneda']) => moneda
  ? new Intl.NumberFormat('es-CL', { style: 'currency', currency: moneda.codigo, maximumFractionDigits: moneda.codigo === 'CLP' ? 0 : 2 }).format(monto)
  : `Moneda no informada · ${monto.toLocaleString('es-CL')}`;

async function respuestaJson(ruta: string, opciones?: RequestInit) {
  const respuesta = await solicitarFinanzas(ruta, opciones);
  const resultado = await respuesta.json();
  if (!respuesta.ok) throw new Error(resultado.error || 'No fue posible completar la operación');
  return resultado;
}

export default function OrdenesCompraServicios() {
  const { id } = useParams();
  const navigate = useNavigate();
  const idRuta = id === undefined ? null : Number(id);
  const idRutaInvalida = idRuta !== null && (!Number.isInteger(idRuta) || idRuta <= 0);
  const { sesion } = usarSesion();
  const puede = (permiso: string) => tienePermiso(sesion, permiso);
  const puedeCrear = puede('CU89');
  const puedeEditar = puede('CU90');
  const puedeAjustar = puede('CU91');
  const puedeAnular = puede('CU92');
  const puedeCerrar = puede('CU93');
  const puedeReabrir = puede('CU94');
  const puedeConfirmarAjuste = puedeAjustar && (sesion?.configuracion === 'gerencia' || sesion?.administrador);
  const [ordenes, setOrdenes] = useState<Ocs[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [monedas, setMonedas] = useState<Moneda[]>([]);
  const [seleccionada, setSeleccionada] = useState<Ocs | null>(null);
  const [modal, setModal] = useState<Modo | null>(null);
  const [formulario, setFormulario] = useState(formularioVacio);
  const [version, setVersion] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [busquedaCliente, setBusquedaCliente] = useState('');
  const [clientesB2B, setClientesB2B] = useState<ClienteB2BOcs[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<ClienteB2BOcs | null>(null);
  const [buscandoClientes, setBuscandoClientes] = useState(false);

  const abrirDetalle = useCallback(async (idOrden: number) => {
    setError('');
    try { setSeleccionada(await respuestaJson(`/ordenes-compra-servicios/${idOrden}`)); }
    catch (causa) { setError((causa as Error).message); }
  }, []);

  useEffect(() => {
    Promise.all([
      respuestaJson('/ordenes-compra-servicios'),
      puedeCrear || puedeEditar || puedeAjustar ? respuestaJson('/proveedores?estado=activo') : Promise.resolve([]),
      puedeCrear || puedeEditar ? respuestaJson('/monedas') : Promise.resolve([]),
    ]).then(([lista, activos, monedasActivas]) => { setOrdenes(lista); setProveedores(activos); setMonedas(monedasActivas); }).catch(causa => setError(causa.message)).finally(() => setCargando(false));
  }, [version, puedeCrear, puedeEditar, puedeAjustar]);

  useEffect(() => {
    if (idRuta === null) return;
    if (idRutaInvalida) return;
    const temporizador = window.setTimeout(() => void abrirDetalle(idRuta), 0);
    return () => window.clearTimeout(temporizador);
  }, [abrirDetalle, idRuta, idRutaInvalida, version]);

  useEffect(() => {
    if (modal !== 'crear') return;
    const controlador = new AbortController();
    const temporizador = window.setTimeout(() => {
      setBuscandoClientes(true);
      const parametros = new URLSearchParams();
      if (busquedaCliente.trim()) parametros.set('busqueda', busquedaCliente.trim());
      respuestaJson(`/ordenes-compra-servicios/clientes-b2b?${parametros}`, { signal: controlador.signal })
        .then(setClientesB2B)
        .catch(causa => { if (!controlador.signal.aborted) setError((causa as Error).message); })
        .finally(() => { if (!controlador.signal.aborted) setBuscandoClientes(false); });
    }, 250);
    return () => { window.clearTimeout(temporizador); controlador.abort(); };
  }, [modal, busquedaCliente]);

  const recargar = () => { setCargando(true); setSeleccionada(null); setVersion(valor => valor + 1); };
  const verDetalle = (idOrden: number) => navigate(`/ordenes-compra-servicios/${idOrden}`);
  const cerrarDetalle = () => { setSeleccionada(null); if (idRuta !== null) navigate('/ordenes-compra-servicios', { replace: true }); };
  const abrirCrear = () => { setFormulario(formularioVacio); setSeleccionada(null); setClienteSeleccionado(null); setBusquedaCliente(''); setClientesB2B([]); setModal('crear'); };
  const abrirAccion = (modo: Modo, orden: Ocs) => {
    setSeleccionada(orden);
    setFormulario({ ...formularioVacio, idProveedor: String(orden.proveedor.id), idMoneda: orden.idMoneda === null ? '' : String(orden.idMoneda), montoAutorizado: String(orden.montoAutorizado), referencia: orden.referencia || '', periodo: orden.periodo || '', descripcion: orden.descripcion || '', valorPropuesto: String(orden.montoAutorizado) });
    setModal(modo);
  };

  const guardar = async () => {
    if (!modal) return;
    setGuardando(true); setError(''); setMensaje('');
    try {
      const id = seleccionada?.id;
      if (modal === 'crear' || modal === 'editar') {
        const materiales = formulario.materialesTexto.split(/\r?\n/).map(linea => linea.trim()).filter(Boolean).map(linea => { const [sku, cantidadPedida, cantidadRecibida, fechaEsperada] = linea.split(',').map(valor => valor.trim()); return { sku, cantidadPedida: Number(cantidadPedida), cantidadRecibida: cantidadRecibida ? Number(cantidadRecibida) : 0, fechaEsperada: fechaEsperada || undefined }; });
        const cuerpo = { idProveedor: Number(formulario.idProveedor), idMoneda: Number(formulario.idMoneda), montoAutorizado: Number(formulario.montoAutorizado), referencia: formulario.referencia, periodo: formulario.periodo || null, descripcion: formulario.descripcion, ...(modal === 'crear' ? { idFichaCliente: formulario.idFichaCliente || undefined, idCotizacion: formulario.idCotizacion || undefined, idProyectoFinanciero: formulario.idProyectoFinanciero || undefined, idOrdenTrabajo: formulario.idOrdenTrabajo || undefined, fechaEsperadaRecepcion: formulario.fechaEsperadaRecepcion || undefined, materiales } : {}) };
        await respuestaJson(modal === 'crear' ? '/ordenes-compra-servicios' : `/ordenes-compra-servicios/${id}`, { method: modal === 'crear' ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cuerpo) });
      }
      if (modal === 'ajustar') await respuestaJson(`/ordenes-compra-servicios/${id}/ajustes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ campo: formulario.campo, valorPropuesto: formulario.valorPropuesto, motivo: formulario.motivo }) });
      if (modal === 'anular') await respuestaJson(`/ordenes-compra-servicios/${id}/anular`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ motivo: formulario.motivo }) });
      if (modal === 'cerrar') await respuestaJson(`/ordenes-compra-servicios/${id}/cerrar`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ declaracionFinal: formulario.declaracionFinal, justificacion: formulario.justificacion }) });
      setMensaje({ crear: 'OCS registrada.', editar: 'OCS actualizada.', ajustar: 'Ajuste solicitado.', anular: 'OCS anulada.', cerrar: 'OCS cerrada.' }[modal]);
      setModal(null); recargar();
    } catch (causa) { setError((causa as Error).message); }
    finally { setGuardando(false); }
  };

  const confirmarAjuste = async (ajusteId: number) => {
    if (!seleccionada || !await confirmarAccion('¿Confirmas aplicar este ajuste?')) return;
    try { await respuestaJson(`/ordenes-compra-servicios/${seleccionada.id}/ajustes/${ajusteId}/confirmar`, { method: 'POST' }); setMensaje('Ajuste confirmado.'); recargar(); }
    catch (causa) { setError((causa as Error).message); }
  };
  const reabrir = async (orden: Ocs) => {
    if (!await confirmarAccion(`¿Confirmas reabrir OCS-${orden.id}?`)) return;
    try { await respuestaJson(`/ordenes-compra-servicios/${orden.id}/reabrir`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ confirmado: true }) }); setMensaje('OCS reabierta.'); recargar(); }
    catch (causa) { setError((causa as Error).message); }
  };

  const errorVisible = idRutaInvalida ? 'Orden de compra inválida.' : error;

  return <div className="min-h-full bg-slate-50 p-5 lg:p-8"><div className="mx-auto max-w-7xl">
    <header className="mb-6 flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm font-semibold text-primary-600">Proveedores y egresos</p><h1 className="text-2xl font-bold text-gray-900">Órdenes de compra de servicios</h1></div>{puedeCrear && <button onClick={abrirCrear} className="flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2.5 font-semibold text-white"><FilePlus2 className="h-4 w-4"/>Nueva OCS</button>}</header>
    {(errorVisible || mensaje) && <div className={`mb-4 rounded-md border px-4 py-3 text-sm ${errorVisible ? 'border-red-200 bg-red-50 text-red-700' : 'border-emerald-200 bg-emerald-50 text-emerald-700'}`}>{errorVisible || mensaje}</div>}
    <div className="overflow-hidden rounded-md border bg-white"><div className="overflow-x-auto"><table className="w-full min-w-[1140px] text-left text-sm"><thead className="border-b bg-gray-50 text-gray-600"><tr><th className="px-4 py-3">OCS</th><th className="px-4 py-3">Proveedor</th><th className="px-4 py-3">Estado</th><th className="px-4 py-3">Período</th><th className="px-4 py-3">Creación</th><th className="px-4 py-3 text-right">Autorizado</th><th className="px-4 py-3 text-right">Documentado</th><th className="px-4 py-3 text-right">Disponible</th><th className="px-4 py-3 text-right">Acciones</th></tr></thead><tbody>{ordenes.map(orden => <tr key={orden.id} className="border-b last:border-0 hover:bg-gray-50"><td className="px-4 py-3 font-semibold">OCS-{orden.id}</td><td className="px-4 py-3">{orden.proveedor.razonSocial}</td><td className="px-4 py-3 capitalize">{orden.estado}</td><td className="px-4 py-3">{orden.periodo || 'No informado'}</td><td className="px-4 py-3">{new Date(orden.fechaCreacion).toLocaleString('es-CL')}</td><td className="px-4 py-3 text-right font-semibold">{presentarMonto(orden.montoAutorizado, orden.moneda)}</td><td className="px-4 py-3 text-right">{presentarMonto(orden.montoDocumentado, orden.moneda)}</td><td className="px-4 py-3 text-right">{presentarMonto(orden.saldoDisponible, orden.moneda)}</td><td className="px-4 py-3"><div className="flex justify-end gap-1"><button title="Ver detalle" onClick={() => verDetalle(orden.id)} className="rounded p-2 hover:bg-gray-100"><Eye className="h-4 w-4"/></button>{orden.estado === 'abierta' && !orden.tieneEfectosFinancieros && puedeEditar && <button title="Editar" onClick={() => abrirAccion('editar', orden)} className="rounded p-2 text-blue-700 hover:bg-blue-50"><Edit3 className="h-4 w-4"/></button>}{orden.estado === 'abierta' && orden.tieneEfectosFinancieros && puedeAjustar && <button title="Solicitar ajuste" onClick={() => abrirAccion('ajustar', orden)} className="rounded p-2 text-amber-700 hover:bg-amber-50"><SlidersHorizontal className="h-4 w-4"/></button>}{orden.estado === 'abierta' && !orden.tieneEfectosFinancieros && puedeAnular && <button title="Anular" onClick={() => abrirAccion('anular', orden)} className="rounded p-2 text-red-700 hover:bg-red-50"><Ban className="h-4 w-4"/></button>}{orden.estado === 'abierta' && puedeCerrar && <button title="Cerrar" onClick={() => abrirAccion('cerrar', orden)} className="rounded p-2 text-emerald-700 hover:bg-emerald-50"><CheckCircle2 className="h-4 w-4"/></button>}{orden.estado === 'cerrada' && puedeReabrir && <button title="Reabrir" onClick={() => void reabrir(orden)} className="rounded p-2 text-primary-700 hover:bg-primary-50"><RefreshCcw className="h-4 w-4"/></button>}</div></td></tr>)}</tbody></table></div>{cargando && <p className="p-10 text-center text-gray-500">Cargando órdenes...</p>}{!cargando && !ordenes.length && <p className="p-10 text-center text-gray-500"><ReceiptText className="mx-auto mb-3 h-8 w-8"/>No hay órdenes registradas.</p>}</div>

    {seleccionada && !modal && <section className="mt-5 rounded-md border bg-white"><div className="flex items-center justify-between border-b px-5 py-4"><div><h2 className="font-bold">Detalle OCS-{seleccionada.id}</h2><p className="text-sm text-gray-500">Monto inicial: {presentarMonto(seleccionada.montoAutorizadoOriginal, seleccionada.moneda)}</p></div><button title="Cerrar detalle" onClick={cerrarDetalle} className="rounded p-2 hover:bg-gray-100"><X className="h-5 w-5"/></button></div><div className="grid gap-4 p-5 text-sm md:grid-cols-3"><div><span className="text-gray-500">Proveedor</span><p className="font-semibold">{seleccionada.proveedor.razonSocial}</p></div><div><span className="text-gray-500">Moneda</span><p className="font-semibold">{seleccionada.moneda ? `${seleccionada.moneda.codigo} · ${seleccionada.moneda.nombre}` : 'No informada (registro histórico)'}</p></div><div><span className="text-gray-500">Período del servicio</span><p>{seleccionada.periodo || 'No informado'}</p></div><div><span className="text-gray-500">Referencia</span><p>{seleccionada.referencia || 'Sin referencia'}</p></div><div className="md:col-span-2"><span className="text-gray-500">Descripción</span><p>{seleccionada.descripcion || 'Sin descripción'}</p></div></div><div className="border-t px-5 py-4"><h3 className="mb-3 font-semibold">Ajustes</h3>{seleccionada.ajustes.map(ajuste => <div key={ajuste.id} className="grid gap-2 border-t py-3 text-sm md:grid-cols-[180px_1fr_180px]"><div><p className="font-medium capitalize">{ajuste.campo.replaceAll('_', ' ')}</p><p className="text-xs text-gray-500">{new Date(ajuste.fechaSolicitud).toLocaleString('es-CL')}</p></div><p>{ajuste.valorAnterior || 'Sin valor'} → {ajuste.valorPropuesto || 'Sin valor'}<br/><span className="text-gray-500">{ajuste.motivo}</span></p><div><span className="capitalize">{ajuste.estado}</span>{ajuste.estado === 'pendiente' && puedeConfirmarAjuste && <button onClick={() => void confirmarAjuste(ajuste.id)} className="mt-2 block rounded-md bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white">Confirmar</button>}</div></div>)}{!seleccionada.ajustes.length && <p className="text-sm text-gray-500">Sin solicitudes de ajuste.</p>}</div><div className="border-t px-5 py-4"><h3 className="mb-3 font-semibold">Historial operativo</h3>{seleccionada.historial.map(item => <div key={item.id} className="grid gap-2 border-t py-3 text-sm md:grid-cols-[170px_1fr_170px]"><div><p className="font-medium capitalize">{item.campo.replaceAll('_', ' ')}</p><p className="text-xs text-gray-500">{new Date(item.fechaHora).toLocaleString('es-CL')}</p></div><p>{item.valorAnterior || 'Sin valor'} → {item.valorNuevo || 'Sin valor'}{item.motivo && <><br/><span className="text-gray-500">{item.motivo}</span></>}</p><p className="text-gray-500">{item.usuario}</p></div>)}</div></section>}
  </div>

  {modal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-md bg-white shadow-xl"><div className="flex items-center justify-between border-b px-5 py-4"><h2 className="text-lg font-bold">{{ crear: 'Nueva OCS', editar: `Editar OCS-${seleccionada?.id}`, ajustar: `Ajustar OCS-${seleccionada?.id}`, anular: `Anular OCS-${seleccionada?.id}`, cerrar: `Cerrar OCS-${seleccionada?.id}` }[modal]}</h2><button title="Cerrar" onClick={() => setModal(null)} className="rounded p-2 hover:bg-gray-100"><X className="h-5 w-5"/></button></div><div className="grid gap-4 p-5 md:grid-cols-2">
    {(modal === 'crear' || modal === 'editar') && <><label className="text-sm font-medium md:col-span-2">Proveedor activo<select aria-label="Proveedor activo" value={formulario.idProveedor} onChange={evento => setFormulario({ ...formulario, idProveedor: evento.target.value })} className="mt-1 w-full rounded-md border p-2.5"><option value="">Seleccionar</option>{proveedores.map(item => <option key={item.idProveedor} value={item.idProveedor}>{item.razonSocial}</option>)}</select></label><label className="text-sm font-medium">Moneda<select aria-label="Moneda de la OCS" value={formulario.idMoneda} onChange={evento => setFormulario({ ...formulario, idMoneda: evento.target.value })} className="mt-1 w-full rounded-md border p-2.5"><option value="">Seleccionar moneda</option>{monedas.filter(item => item.estado_moneda === undefined || item.estado_moneda === 'activo').map(item => <option key={item.id_moneda} value={item.id_moneda}>{item.codigo_moneda} · {item.nombre_moneda}</option>)}</select></label><label className="text-sm font-medium">Monto autorizado<input aria-label="Monto autorizado" type="number" min="0.01" step="0.01" value={formulario.montoAutorizado} onChange={evento => setFormulario({ ...formulario, montoAutorizado: evento.target.value })} className="mt-1 w-full rounded-md border p-2.5"/></label><label className="text-sm font-medium md:col-span-2">Período del servicio<input aria-label="Período del servicio" type="month" value={formulario.periodo} onChange={evento => setFormulario({ ...formulario, periodo: evento.target.value })} className="mt-1 w-full rounded-md border p-2.5"/><span className="mt-1 block text-xs font-normal text-gray-500">Mes en que se presta el servicio; es distinto de la fecha de recepción esperada.</span></label><label className="text-sm font-medium md:col-span-2">Referencia<input value={formulario.referencia} onChange={evento => setFormulario({ ...formulario, referencia: evento.target.value })} className="mt-1 w-full rounded-md border p-2.5"/></label><label className="text-sm font-medium md:col-span-2">Descripción<textarea rows={3} value={formulario.descripcion} onChange={evento => setFormulario({ ...formulario, descripcion: evento.target.value })} className="mt-1 w-full rounded-md border p-2.5"/></label>{modal === 'crear' && <><div className="relative md:col-span-2"><label className="text-sm font-medium" htmlFor="buscar-cliente-b2b-ocs">Cliente B2B de contexto (opcional)</label>{clienteSeleccionado ? <div className="mt-1 flex items-center justify-between gap-3 rounded-md border border-emerald-300 bg-emerald-50 p-3 text-sm"><span><strong>{clienteSeleccionado.razonSocial}</strong> — {clienteSeleccionado.rut || 'RUT no informado'}</span><button type="button" className="rounded-md border bg-white px-3 py-1.5 font-semibold" onClick={()=>{setClienteSeleccionado(null);setFormulario({...formulario,idFichaCliente:''});setBusquedaCliente('')}}>Limpiar</button></div> : <><input id="buscar-cliente-b2b-ocs" role="combobox" aria-expanded={clientesB2B.length>0} aria-controls="resultados-clientes-b2b-ocs" autoComplete="off" value={busquedaCliente} onChange={evento=>setBusquedaCliente(evento.target.value)} placeholder="Buscar por razón social o RUT" className="mt-1 w-full rounded-md border p-2.5"/><div id="resultados-clientes-b2b-ocs" className="mt-1 max-h-48 overflow-y-auto rounded-md border bg-white">{buscandoClientes?<p className="p-3 text-sm text-gray-500">Buscando clientes…</p>:clientesB2B.length?clientesB2B.map(cliente=><button key={cliente.idFichaCliente} type="button" className="block w-full border-b px-3 py-2 text-left text-sm last:border-0 hover:bg-orange-50" onClick={()=>{setClienteSeleccionado(cliente);setFormulario({...formulario,idFichaCliente:String(cliente.idFichaCliente)});setBusquedaCliente('')}}><strong>{cliente.razonSocial}</strong> — {cliente.rut || 'RUT no informado'}</button>):<p className="p-3 text-sm text-gray-500">No hay clientes B2B activos que coincidan.</p>}</div></>}</div><label className="text-sm font-medium">ID Cotización<input type="number" value={formulario.idCotizacion} onChange={evento => setFormulario({ ...formulario, idCotizacion: evento.target.value })} className="mt-1 w-full rounded-md border p-2.5"/></label><label className="text-sm font-medium">ID Proyecto<input type="number" value={formulario.idProyectoFinanciero} onChange={evento => setFormulario({ ...formulario, idProyectoFinanciero: evento.target.value })} className="mt-1 w-full rounded-md border p-2.5"/></label><label className="text-sm font-medium">ID Orden de Trabajo<input type="number" value={formulario.idOrdenTrabajo} onChange={evento => setFormulario({ ...formulario, idOrdenTrabajo: evento.target.value })} className="mt-1 w-full rounded-md border p-2.5"/></label><label className="text-sm font-medium">Recepción esperada<input type="date" value={formulario.fechaEsperadaRecepcion} onChange={evento => setFormulario({ ...formulario, fechaEsperadaRecepcion: evento.target.value })} className="mt-1 w-full rounded-md border p-2.5"/></label><label className="text-sm font-medium md:col-span-2">Materiales<textarea rows={4} value={formulario.materialesTexto} onChange={evento => setFormulario({ ...formulario, materialesTexto: evento.target.value })} placeholder="SKU, cantidad pedida, cantidad recibida, fecha esperada" className="mt-1 w-full rounded-md border p-2.5"/><span className="mt-1 block text-xs font-normal text-gray-500">Una línea por material. Cantidad recibida y fecha son opcionales.</span></label></>}</>}
    {modal === 'ajustar' && <><label className="text-sm font-medium">Campo<select value={formulario.campo} onChange={evento => setFormulario({ ...formulario, campo: evento.target.value })} className="mt-1 w-full rounded-md border p-2.5"><option value="monto_autorizado">Monto autorizado</option><option value="referencia">Referencia</option><option value="periodo">Período</option><option value="descripcion">Descripción</option></select></label><label className="text-sm font-medium">Valor propuesto<input value={formulario.valorPropuesto} onChange={evento => setFormulario({ ...formulario, valorPropuesto: evento.target.value })} className="mt-1 w-full rounded-md border p-2.5"/></label><label className="text-sm font-medium md:col-span-2">Motivo<textarea rows={3} value={formulario.motivo} onChange={evento => setFormulario({ ...formulario, motivo: evento.target.value })} className="mt-1 w-full rounded-md border p-2.5"/></label></>}
    {modal === 'anular' && <label className="text-sm font-medium md:col-span-2">Motivo de anulación<textarea rows={3} value={formulario.motivo} onChange={evento => setFormulario({ ...formulario, motivo: evento.target.value })} className="mt-1 w-full rounded-md border p-2.5"/></label>}
    {modal === 'cerrar' && <><div className="md:col-span-2 rounded-md bg-gray-50 p-4 text-sm"><p>Autorizado: {seleccionada ? presentarMonto(seleccionada.montoAutorizado, seleccionada.moneda) : 'No disponible'}</p><p>Documentado: {seleccionada ? presentarMonto(seleccionada.montoDocumentado, seleccionada.moneda) : 'No disponible'}</p></div><label className="flex items-center gap-2 text-sm font-medium md:col-span-2"><input type="checkbox" checked={formulario.declaracionFinal} onChange={evento => setFormulario({ ...formulario, declaracionFinal: evento.target.checked })}/>Corresponde a la facturación final</label><label className="text-sm font-medium md:col-span-2">Justificación<textarea rows={3} value={formulario.justificacion} onChange={evento => setFormulario({ ...formulario, justificacion: evento.target.value })} className="mt-1 w-full rounded-md border p-2.5"/></label></>}
  </div><div className="flex justify-end gap-3 border-t px-5 py-4"><button onClick={() => setModal(null)} className="rounded-md border px-4 py-2">Cancelar</button><button disabled={guardando || ((modal === 'crear' || modal === 'editar') && (!formulario.idProveedor || !formulario.idMoneda || !(Number(formulario.montoAutorizado) > 0)))} onClick={() => void guardar()} className="rounded-md bg-primary-600 px-4 py-2 font-semibold text-white disabled:opacity-50">{guardando ? 'Guardando...' : 'Confirmar'}</button></div></div></div>}
  </div>;
}
