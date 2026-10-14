import { Boxes, Calculator, Factory, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { operar, usarSesion } from '../../seguridad/Sesion';
import { puedeAccederFinanzas, puedeAccederTerreno } from '../../seguridad/accesosSistemas';

type TarjetaProps = {
  titulo: string;
  descripcion: string;
  destino: string;
  icono: typeof Calculator;
  disponible: boolean;
  leyenda?: string;
};

function TarjetaSistema({ titulo, descripcion, destino, icono: Icono, disponible, leyenda }: TarjetaProps) {
  const contenido = <>
    <span className={`inline-flex rounded-xl p-3 ${disponible ? 'bg-[#FE8F01] text-black' : 'bg-gray-200 text-gray-500'}`}><Icono className="h-7 w-7" /></span>
    <div className="mt-5"><h2 className="text-xl font-black tracking-wide text-black">{titulo}</h2><p className="mt-2 text-sm leading-6 text-[#676767]">{descripcion}</p></div>
    <span className={`mt-7 inline-flex text-sm font-black ${disponible ? 'text-orange-700' : 'text-gray-500'}`}>{leyenda ?? 'Ingresar al sistema'} →</span>
  </>;
  const clases = 'flex min-h-64 flex-col justify-between rounded-2xl border bg-white p-6 text-left shadow-sm transition sm:p-7';
  return disponible
    ? <Link to={destino} className={`${clases} border-gray-200 hover:-translate-y-1 hover:border-[#FE8F01] hover:shadow-lg`}>{contenido}</Link>
    : <Link to={destino} className={`${clases} border-gray-200`}>{contenido}</Link>;
}

export default function PortalPrincipal() {
  const { sesion, cargando, actualizar } = usarSesion();
  const finanzas = puedeAccederFinanzas(sesion);
  const terreno = puedeAccederTerreno(sesion);
  return <div className="min-h-screen bg-slate-50 text-black">
    <header className="border-b border-gray-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3"><span className="rounded-xl bg-[#FE8F01] p-2.5"><ShieldCheck className="h-6 w-6" /></span><div className="min-w-0"><p className="truncate font-black tracking-wide">PUERTAS BLINDADAS</p><p className="text-xs text-[#676767]">Sistema de Gestión Empresarial</p></div></div>
      {!cargando && (sesion ? <button type="button" onClick={async()=>{await operar('/seguridad/salir',{});await actualizar();}} className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-bold hover:border-[#FE8F01]"><LogOut className="h-4 w-4"/>Cerrar sesión</button> : <Link to="/login" className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-bold text-white hover:bg-gray-800"><LogIn className="h-4 w-4"/>Iniciar sesión</Link>)}
    </div></header>
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="max-w-3xl"><p className="text-sm font-black uppercase tracking-[0.2em] text-orange-700">Portal principal</p><h1 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">PUERTAS BLINDADAS</h1><p className="mt-4 text-lg text-[#676767]">Sistema de Gestión Empresarial</p>{sesion&&<p className="mt-4 text-sm font-semibold">Sesión activa: {sesion.nombre}</p>}</div>
      {cargando ? <p className="mt-12 text-[#676767]">Cargando accesos…</p> : <div className="mt-10 grid gap-5 md:grid-cols-3">
        {(!sesion || finanzas) && <TarjetaSistema titulo="FINANZAS" descripcion="Gestión financiera, comercial, remuneraciones y control gerencial." destino={sesion?'/finanzas':'/login'} icono={Calculator} disponible={!sesion||finanzas} leyenda={sesion?'Ingresar a Finanzas':'Iniciar sesión'}/>}
        {(!sesion || terreno) && <TarjetaSistema titulo="TERRENO" descripcion="Órdenes de trabajo, visitas, tareas, producción e incidencias operacionales." destino={sesion?'/terreno':'/login'} icono={Factory} disponible={!sesion||terreno} leyenda={sesion?'Ingresar a Terreno':'Iniciar sesión'}/>}
        <TarjetaSistema titulo="INVENTARIO" descripcion="Gestión de existencias y materiales de la empresa." destino="/inventario" icono={Boxes} disponible={false} leyenda="Pendiente de configuración"/>
      </div>}
      {sesion&&!finanzas&&!terreno&&<p className="mt-8 rounded-xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-950">Tu cuenta no tiene sistemas habilitados. Solicita acceso a un administrador.</p>}
    </main>
  </div>;
}
