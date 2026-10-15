import { ArrowRight, Boxes, Calculator, Factory, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { operar, usarSesion } from '../../seguridad/Sesion';
import { puedeAccederFinanzas, puedeAccederTerreno } from '../../seguridad/accesosSistemas';

type TarjetaProps = {
  titulo: string;
  descripcion: string;
  destino?: string;
  icono: typeof Calculator;
  disponible: boolean;
  boton: string;
};

function ContenidoTarjeta({ titulo, descripcion, icono: Icono, disponible, boton }: TarjetaProps) {
  return <>
    <div className="h-1 w-14 rounded-full bg-[#FE8F01]" />
    <div className="mt-7 flex items-start justify-between gap-4">
      <div><p className="text-xs font-black uppercase tracking-[0.22em] text-[#676767]">Sistema</p><h2 className="mt-2 text-2xl font-black tracking-tight text-black">{titulo}</h2></div>
      <span className={`inline-flex shrink-0 rounded-xl border p-3 ${disponible ? 'border-orange-200 bg-orange-50 text-orange-700' : 'border-gray-200 bg-gray-100 text-gray-400'}`}><Icono className="h-7 w-7" /></span>
    </div>
    <p className="mt-5 min-h-20 text-sm leading-6 text-[#676767]">{descripcion}</p>
    <span className={`mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-black transition ${disponible ? 'bg-black text-white group-hover:bg-[#FE8F01] group-hover:text-black' : 'cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-500'}`}>{boton}{disponible&&<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1"/>}</span>
  </>;
}

function TarjetaSistema(props: TarjetaProps) {
  const clases = 'group flex min-h-80 flex-col rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-[0_14px_45px_rgba(0,0,0,0.06)] sm:p-7';
  if (!props.disponible || !props.destino) return <article aria-disabled="true" className={`${clases} opacity-80`}><ContenidoTarjeta {...props}/></article>;
  return <Link to={props.destino} className={`${clases} transition duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-[0_20px_55px_rgba(0,0,0,0.12)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300`}><ContenidoTarjeta {...props}/></Link>;
}

function PuertaIndustrial() {
  return <div aria-hidden="true" className="relative mx-auto h-[310px] w-[220px] sm:h-[360px] sm:w-[255px]">
    <div className="absolute -inset-5 border border-white/10" />
    <div className="absolute -inset-x-9 inset-y-8 border-y border-white/10" />
    <div className="absolute inset-0 border border-white/30 bg-gradient-to-br from-[#393939] via-[#151515] to-black shadow-[0_35px_80px_rgba(0,0,0,0.7)]">
      <div className="absolute inset-3 border border-white/10" />
      <div className="absolute inset-y-0 left-0 w-1.5 bg-[#FE8F01]" />
      <div className="absolute inset-x-7 top-9 h-px bg-white/10" />
      <div className="absolute inset-x-7 bottom-9 h-px bg-white/10" />
      <div className="absolute right-7 top-1/2 h-1.5 w-12 -translate-y-1/2 bg-[#FE8F01] shadow-[0_0_18px_rgba(254,143,1,0.45)]" />
      <div className="absolute right-7 top-[calc(50%+12px)] h-2 w-2 rounded-full border border-white/50" />
      {[18,50,82].map(posicion=><span key={posicion} className="absolute right-3 h-1.5 w-1.5 rounded-full bg-white/35" style={{top:`${posicion}%`}}/>)}
    </div>
    <div className="absolute -bottom-6 left-1/2 h-8 w-[145%] -translate-x-1/2 rounded-[50%] bg-black/50 blur-xl" />
  </div>;
}

export default function PortalPrincipal() {
  const { sesion, cargando, actualizar } = usarSesion();
  const finanzas = puedeAccederFinanzas(sesion);
  const terreno = puedeAccederTerreno(sesion);
  return <div className="min-h-screen bg-[#f4f4f3] text-black">
    <header className="relative z-20 border-b border-white/10 bg-[#0b0b0b] text-white"><div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex min-w-0 items-center gap-3.5"><span className="rounded-lg border border-[#FE8F01]/60 bg-[#FE8F01]/10 p-2.5 text-[#FE8F01]"><ShieldCheck className="h-6 w-6" /></span><div className="min-w-0"><p className="truncate text-sm font-black tracking-[0.12em] sm:text-base">PUERTAS BLINDADAS</p><p className="mt-0.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">Plataforma empresarial</p></div></div>
      {!cargando && (sesion ? <div className="flex items-center gap-3"><p className="hidden max-w-48 truncate text-sm text-gray-300 sm:block">{sesion.nombre}</p><button type="button" onClick={async()=>{await operar('/seguridad/salir',{});await actualizar();}} className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-3.5 py-2.5 text-sm font-bold transition hover:border-[#FE8F01] hover:text-[#FE8F01] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FE8F01]"><LogOut className="h-4 w-4"/><span className="hidden sm:inline">Cerrar sesión</span><span className="sm:hidden">Salir</span></button></div> : <Link to="/login" className="inline-flex items-center gap-2 rounded-lg bg-[#FE8F01] px-4 py-2.5 text-sm font-black text-black transition hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-300"><LogIn className="h-4 w-4"/>Iniciar sesión</Link>)}
    </div></header>

    <main>
      <section className="relative isolate overflow-hidden bg-[#111111] text-white">
        <div className="absolute inset-0 opacity-25" style={{backgroundImage:'linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)',backgroundSize:'48px 48px'}} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_42%,rgba(254,143,1,0.15),transparent_32%),linear-gradient(90deg,#111_0%,rgba(17,17,17,.94)_48%,rgba(17,17,17,.6)_100%)]" />
        <div className="relative mx-auto grid min-h-[500px] max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.15fr_.85fr] lg:px-8">
          <div className="max-w-3xl"><div className="flex items-center gap-3"><span className="h-px w-10 bg-[#FE8F01]"/><p className="text-xs font-black uppercase tracking-[0.24em] text-[#FE8F01]">Plataforma operativa interna</p></div><h1 className="mt-6 text-4xl font-black leading-[0.95] tracking-[-0.04em] sm:text-6xl lg:text-7xl">PUERTAS<br/><span className="text-[#FE8F01]">BLINDADAS</span></h1><p className="mt-6 text-xl font-semibold text-white sm:text-2xl">Sistema de Gestión Empresarial</p><p className="mt-4 max-w-xl text-base leading-7 text-gray-400 sm:text-lg">Seguridad, gestión y control en un solo lugar.</p>{sesion&&<div className="mt-8 inline-flex items-center gap-3 border-l-2 border-[#FE8F01] bg-white/5 px-4 py-3 text-sm text-gray-300"><span className="h-2 w-2 rounded-full bg-[#FE8F01]"/><span>Sesión activa</span></div>}</div>
          <div className="hidden justify-center lg:flex"><PuertaIndustrial/></div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-black uppercase tracking-[0.2em] text-orange-700">Sistemas corporativos</p><h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Selecciona tu espacio de trabajo</h2></div><p className="max-w-md text-sm leading-6 text-[#676767]">Accede a las herramientas habilitadas para tu perfil dentro de una plataforma segura y centralizada.</p></div>
        {cargando ? <div className="rounded-2xl border border-gray-200 bg-white p-8 text-[#676767] shadow-sm">Cargando accesos disponibles…</div> : <div className="grid gap-5 md:grid-cols-3">
          {(!sesion || finanzas) && <TarjetaSistema titulo="FINANZAS" descripcion="Gestión financiera, comercial, remuneraciones y control gerencial." destino={sesion?'/finanzas':'/login'} icono={Calculator} disponible boton="Ingresar a Finanzas"/>}
          {(!sesion || terreno) && <TarjetaSistema titulo="TERRENO" descripcion="Órdenes de trabajo, visitas, producción y gestión operativa." destino={sesion?'/terreno':'/login'} icono={Factory} disponible boton="Ingresar a Terreno"/>}
          <TarjetaSistema titulo="INVENTARIO" descripcion="Control de existencias, materiales y recursos de la empresa." icono={Boxes} disponible={false} boton="PRÓXIMAMENTE"/>
        </div>}
        {sesion&&!finanzas&&!terreno&&<p className="mt-6 border-l-4 border-[#FE8F01] bg-white p-4 text-sm shadow-sm">Tu cuenta no tiene sistemas habilitados. Solicita acceso a un administrador.</p>}
      </section>
    </main>
    <footer className="border-t border-gray-200 bg-white"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 px-4 py-6 text-xs text-[#676767] sm:flex-row sm:px-6 lg:px-8"><p>© 2026 Puertas Blindadas</p><p>Plataforma de gestión empresarial</p></div></footer>
  </div>;
}
