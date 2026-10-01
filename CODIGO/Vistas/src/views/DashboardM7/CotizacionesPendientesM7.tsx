import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usarSesion } from '../../seguridad/Sesion';
import { EncabezadoM7, Periodo, usarConsultaM7 } from './componentes';

type Cotizacion={idCotizacion:number;idCliente:number;cliente:string;moneda:string;montoPotencial:number|null;fechaEmision:string;fechaVigencia:string|null;destinoCotizacion:string;destinoCliente:string};
const monto=(valor:number|null,moneda:string)=>valor===null?'No disponible':new Intl.NumberFormat('es-CL',{style:'currency',currency:moneda,maximumFractionDigits:2}).format(valor);

export default function CotizacionesPendientesM7(){
 const q=usarConsultaM7('/dashboard-m7/cotizaciones-pendientes');const {sesion}=usarSesion();const filas=(q.datos?.cotizaciones||[]) as Cotizacion[];
 return <div className="min-h-full bg-gray-100"><EncabezadoM7 titulo="Cotizaciones pendientes de Venta" descripcion="Negocio vigente aún no formalizado; los montos son potenciales" regreso={q.global}/><Periodo anio={q.anio} mes={q.mes} cambiar={q.cambiar} cargando={q.cargando} recargar={q.recargar}/>
 {q.error?<p role="alert" className="border-y border-red-200 bg-red-50 px-5 py-4 text-red-800">{q.error}</p>:<main className="mx-auto max-w-7xl bg-white px-5 py-6 sm:px-8"><div className="mb-5"><p className="text-sm font-semibold uppercase text-gray-500">Monto potencial</p><p className="mt-1 text-sm text-gray-600">No representa Venta, ingreso, cobro, caja futura, forecast ni probabilidad de cierre.</p></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b text-xs uppercase text-gray-500"><tr><th className="py-2">Cotización</th><th>Cliente</th><th>Emisión</th><th>Vigencia</th><th>Monto potencial</th><th>Origen</th></tr></thead><tbody>{filas.map(fila=><tr key={fila.idCotizacion} className="border-b border-gray-100"><td className="py-3 font-semibold">#{fila.idCotizacion}</td><td>{fila.cliente}</td><td>{fila.fechaEmision}</td><td>{fila.fechaVigencia||'No disponible'}</td><td>{monto(fila.montoPotencial,fila.moneda)}</td><td><div className="flex flex-wrap gap-3"><Link to={fila.destinoCotizacion} className="inline-flex items-center gap-1 font-semibold text-primary-700">Cotización<ExternalLink className="h-3.5 w-3.5"/></Link><Link to={fila.destinoCliente} className="font-semibold text-primary-700">Ficha Cliente</Link>{sesion?.permisos.includes('CU221')&&<Link to={`/dashboard-m7/clientes/${fila.idCliente}?anio=${q.anio}&mes=${q.mes}`} className="font-semibold text-primary-700">Contexto M7</Link>}</div></td></tr>)}</tbody></table>{!q.cargando&&!filas.length&&<p className="py-10 text-center text-gray-500">No existen cotizaciones vigentes pendientes en el período.</p>}</div></main>}
 </div>;
}
