import React from 'react';
import { BanknoteArrowDown, BanknoteArrowUp, BellRing, ChartNoAxesCombined, FileClock, Gauge, Scale, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EncabezadoM7, PdfDashboard, Periodo, usarConsultaM7 } from './componentes';
import type { RespuestaM7 } from './componentes';

const destinos: Record<string, { titulo: string; ruta: string; icono: React.ComponentType<{ className?: string }> }> = {
  centroAtencion: { titulo: 'Centro de Atención', ruta: '/dashboard-m7/centro-atencion', icono: BellRing }, cotizacionesPendientes: { titulo: 'Cotizaciones pendientes', ruta: '/dashboard-m7/cotizaciones-pendientes', icono: FileClock },
  ventas: { titulo: 'Ventas', ruta: '/dashboard-m7/ventas', icono: ChartNoAxesCombined }, cuentasCobrar: { titulo: 'Cuentas por cobrar', ruta: '/dashboard-m7/cuentas-cobrar', icono: BanknoteArrowUp }, cuentasPagar: { titulo: 'Cuentas por pagar', ruta: '/dashboard-m7/cuentas-pagar', icono: BanknoteArrowDown }, liquidez: { titulo: 'Liquidez y flujo', ruta: '/dashboard-m7/liquidez', icono: Wallet },
  margenProyectos: { titulo: 'Margen por proyecto', ruta: '/dashboard-m7/margen-proyectos', icono: Gauge }, resumenResultados: { titulo: 'Resumen de resultados', ruta: '/dashboard-m7/resumenes', icono: ChartNoAxesCombined }, situacionFinanciera: { titulo: 'Situación financiera', ruta: '/dashboard-m7/resumenes', icono: Scale },
};
const estadoBloque = (bloque: RespuestaM7) => String(bloque.estado || 'DATOS_INSUFICIENTES').replaceAll('_', ' ');

export default function PanelGeneralM7() {
  const consulta = usarConsultaM7('/dashboard-m7', true); const bloques = (consulta.datos?.bloques || {}) as Record<string, RespuestaM7>;
  return <div className="min-h-full bg-gray-100"><EncabezadoM7 titulo="Panel General" descripcion="Indicadores financieros consolidados por período" /><Periodo anio={consulta.anio} mes={consulta.mes} cambiar={consulta.cambiar} cargando={consulta.cargando} recargar={consulta.recargar} />
    <PdfDashboard origen="panel" anio={consulta.anio} mes={consulta.mes}/>
    {consulta.error && <div className="border-y border-red-200 bg-red-50 px-5 py-4 text-red-800">{consulta.error}</div>}
    <main className="mx-auto grid max-w-7xl gap-4 px-5 py-6 md:grid-cols-2 sm:px-8">{Object.entries(bloques).map(([clave, bloque]) => { const destino = destinos[clave]; if (!destino) return null; const Icono = destino.icono; const resumen = Object.entries(bloque).find(([, valor]) => valor && typeof valor === 'object' && 'estado' in (valor as object))?.[1] as { valor?: unknown; detalle?: string } | undefined; return <Link key={clave} to={`${destino.ruta}?anio=${consulta.anio}&mes=${consulta.mes}`} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition hover:border-gray-400 hover:shadow-md"><div className="flex items-center justify-between"><Icono className="h-6 w-6 text-gray-700" /><span className="text-xs font-semibold uppercase text-gray-500">{estadoBloque(bloque)}</span></div><h2 className="mt-5 text-lg font-bold text-gray-950">{destino.titulo}</h2><p className="mt-1 text-sm text-gray-500">{resumen?.detalle || 'Abrir análisis del período'}</p></Link>; })}{!consulta.cargando && !Object.keys(bloques).length && !consulta.error && <p className="col-span-full py-10 text-center text-sm text-gray-500">No hay bloques habilitados para esta cuenta.</p>}</main>
  </div>;
}
