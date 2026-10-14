import { useEffect, useState } from 'react';
import { ArrowLeft, BriefcaseBusiness, Pencil, Plus, Power, Users, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { solicitarFinanzas } from '../../api/finanzas';
import { usarSesion } from '../../seguridad/Sesion';

type Area = { id: string; nombre: string; descripcion: string; activa: boolean; empleadosActivos: number };
type Empleado = { id: number; rut: string; nombreCompleto: string; cargoActual: string | null };

async function json(ruta: string, opciones?: RequestInit) {
  const respuesta = await solicitarFinanzas(ruta, opciones);
  const resultado = await respuesta.json();
  if (!respuesta.ok) throw new Error(resultado.error || 'No fue posible completar la operación');
  return resultado;
}

export default function AreasTrabajo() {
  const navegar = useNavigate();
  const { sesion } = usarSesion();
  const puedeEditar = Boolean(sesion?.permisos.includes('CU157'));
  const [areas, setAreas] = useState<Area[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [seleccionada, setSeleccionada] = useState<Area | null>(null);
  const [edicion, setEdicion] = useState<Area | null>(null);
  const [formulario, setFormulario] = useState({ nombre: '', descripcion: '' });
  const [modal, setModal] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(true);

  const cargar = () => {
    setCargando(true);
    json('/areas-trabajo').then(setAreas).catch((causa) => setError(causa.message)).finally(() => setCargando(false));
  };
  useEffect(() => {
    let activa = true;
    json('/areas-trabajo').then(resultado => { if (activa) setAreas(resultado); }).catch(causa => { if (activa) setError(causa.message); }).finally(() => { if (activa) setCargando(false); });
    return () => { activa = false; };
  }, []);

  const abrir = (area?: Area) => {
    setEdicion(area || null);
    setFormulario({ nombre: area?.nombre || '', descripcion: area?.descripcion || '' });
    setModal(true);
  };
  const guardar = async () => {
    setError('');
    try {
      await json(edicion ? `/areas-trabajo/${edicion.id}` : '/areas-trabajo', { method: edicion ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formulario) });
      setModal(false); cargar();
    } catch (causa) { setError((causa as Error).message); }
  };
  const estado = async (area: Area) => {
    setError('');
    try { await json(`/areas-trabajo/${area.id}/${area.activa ? 'desactivar' : 'activar'}`, { method: 'POST' }); cargar(); }
    catch (causa) { setError((causa as Error).message); }
  };
  const verEmpleados = async (area: Area) => {
    setSeleccionada(area); setError('');
    try { setEmpleados(await json(`/areas-trabajo/${area.id}/empleados`)); }
    catch (causa) { setError((causa as Error).message); }
  };

  return <div className="min-h-full bg-gray-100 px-4 py-6 sm:px-6 lg:px-8"><div className="mx-auto max-w-6xl">
    <header className="border-t-4 border-[#FE8F01] bg-white p-5 shadow-sm sm:p-7">
      <button onClick={() => navegar('/mantenedores')} className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-[#676767] hover:text-black"><ArrowLeft className="h-4 w-4" />Volver a mantenedores</button>
      <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-black uppercase tracking-wide text-[#676767]">Operación y producción</p><h1 className="mt-1 text-2xl font-black text-black sm:text-3xl">Áreas de trabajo</h1><p className="mt-2 text-sm text-gray-600">Catálogo compartido por producción, órdenes e incidencias.</p></div>
      {puedeEditar && <button onClick={() => abrir()} className="inline-flex items-center gap-2 rounded-md bg-[#FE8F01] px-4 py-2.5 font-bold text-black hover:bg-orange-400"><Plus className="h-4 w-4" />Nueva área</button>}</div>
    </header>
    {error && <div className="mt-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
    <section className="mt-6 overflow-hidden border border-gray-200 bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="bg-gray-50 text-[#676767]"><tr><th className="px-4 py-3">Área</th><th className="px-4 py-3">Descripción</th><th className="px-4 py-3">Empleados activos</th><th className="px-4 py-3">Estado</th><th className="px-4 py-3 text-right">Acciones</th></tr></thead><tbody>
      {areas.map(area => <tr key={area.id} className="border-t border-gray-100"><td className="px-4 py-3 font-bold text-black">{area.nombre}</td><td className="px-4 py-3 text-gray-600">{area.descripcion || 'Sin descripción'}</td><td className="px-4 py-3">{area.empleadosActivos}</td><td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${area.activa ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'}`}>{area.activa ? 'Activa' : 'Inactiva'}</span></td><td className="px-4 py-3"><div className="flex justify-end gap-1"><button title="Ver empleados" onClick={() => void verEmpleados(area)} className="rounded p-2 hover:bg-gray-100"><Users className="h-4 w-4" /></button>{puedeEditar && <><button title="Editar" onClick={() => abrir(area)} className="rounded p-2 hover:bg-gray-100"><Pencil className="h-4 w-4" /></button><button title={area.activa ? 'Desactivar' : 'Activar'} onClick={() => void estado(area)} className="rounded p-2 hover:bg-gray-100"><Power className="h-4 w-4" /></button></>}</div></td></tr>)}
    </tbody></table></div>{cargando && <div className="py-12 text-center text-gray-500">Cargando áreas...</div>}{!cargando && !areas.length && <div className="py-12 text-center text-gray-500"><BriefcaseBusiness className="mx-auto mb-2 h-8 w-8" />No hay áreas configuradas.</div>}</section>
    {seleccionada && <section className="mt-6 border border-gray-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><h2 className="text-lg font-black">Empleados activos · {seleccionada.nombre}</h2><button title="Cerrar" onClick={() => setSeleccionada(null)}><X className="h-5 w-5" /></button></div><div className="mt-4 grid gap-3 sm:grid-cols-2">{empleados.map(empleado => <button key={empleado.id} onClick={() => navegar(`/empleados/${empleado.id}`)} className="border border-gray-200 p-3 text-left hover:border-[#FE8F01]"><span className="block font-bold">{empleado.nombreCompleto}</span><span className="text-xs text-gray-500">{empleado.rut} · {empleado.cargoActual || 'Sin cargo'}</span></button>)}</div>{!empleados.length && <p className="mt-4 text-sm text-gray-500">No hay empleados activos asignados.</p>}</section>}
  </div>
  {modal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="w-full max-w-lg bg-white shadow-xl"><div className="flex items-center justify-between border-b p-5"><h2 className="text-lg font-black">{edicion ? 'Editar área' : 'Nueva área'}</h2><button title="Cerrar" onClick={() => setModal(false)}><X className="h-5 w-5" /></button></div><div className="space-y-4 p-5"><label className="block text-sm font-bold">Nombre<input value={formulario.nombre} onChange={e => setFormulario({ ...formulario, nombre: e.target.value })} maxLength={150} className="mt-1 w-full rounded-md border p-2.5" /></label><label className="block text-sm font-bold">Descripción<textarea value={formulario.descripcion} onChange={e => setFormulario({ ...formulario, descripcion: e.target.value })} maxLength={150} rows={3} className="mt-1 w-full rounded-md border p-2.5" /></label></div><div className="flex justify-end gap-3 border-t p-5"><button onClick={() => setModal(false)} className="rounded-md border px-4 py-2">Cancelar</button><button disabled={!formulario.nombre.trim()} onClick={() => void guardar()} className="rounded-md bg-[#FE8F01] px-4 py-2 font-bold text-black disabled:opacity-50">Guardar</button></div></div></div>}
  </div>;
}
