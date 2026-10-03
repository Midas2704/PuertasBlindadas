import type { ComponentType, ReactNode } from 'react';
import {
  BanknoteArrowDown, BanknoteArrowUp, BellRing, ChartNoAxesCombined, CircleAlert,
  FileClock, Gauge, Scale, Wallet,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { EncabezadoM7, PdfDashboard, Periodo, estadoHumano, formatearDato, usarConsultaM7 } from './componentes';
import type { RespuestaM7 } from './componentes';
import {
  EstadoSinDatos, GraficoArea, GraficoBarras, GraficoDonut, GraficoLinea,
  GraficoProgreso, TarjetaIndicador,
} from './graficos';
import type { DatoGrafico, SerieGrafico } from './graficos';

type TipoGrafico = 'linea' | 'area' | 'barras' | 'barras-horizontal' | 'donut' | 'progreso';
type Configuracion = {
  titulo: string;
  ruta: string;
  icono: ComponentType<{ className?: string }>;
  tipo: TipoGrafico;
  etiquetaPrincipal: string;
  camposPrincipales?: string[];
  camposSecundarios?: string[];
  colecciones?: string[];
  series?: string[];
  amplia?: boolean;
};

const configuraciones: Record<string, Configuracion> = {
  centroAtencion: { titulo: 'Centro de Atención', ruta: '/dashboard-m7/centro-atencion', icono: BellRing, tipo: 'donut', etiquetaPrincipal: 'Excepciones', camposPrincipales: ['cantidad', 'total'], colecciones: ['excepciones', 'cobertura'], series: ['cantidad'] },
  cotizacionesPendientes: { titulo: 'Cotizaciones pendientes', ruta: '/dashboard-m7/cotizaciones-pendientes', icono: FileClock, tipo: 'barras-horizontal', etiquetaPrincipal: 'Monto potencial', camposPrincipales: ['montoPotencial', 'monto', 'cantidad'], colecciones: ['cotizaciones'], series: ['montoPotencial'] },
  ventas: { titulo: 'Ventas', ruta: '/dashboard-m7/ventas', icono: ChartNoAxesCombined, tipo: 'linea', etiquetaPrincipal: 'Ventas netas', camposPrincipales: ['totalClp', 'montoNeto', 'monto', 'cantidad'], camposSecundarios: ['cantidad', 'ticketMedio', 'tasaPorcentual'], colecciones: ['evolucion', 'clientes'], series: ['montoNeto', 'monto'], amplia: true },
  cuentasCobrar: { titulo: 'Cuentas por cobrar', ruta: '/dashboard-m7/cuentas-cobrar', icono: BanknoteArrowUp, tipo: 'barras-horizontal', etiquetaPrincipal: 'Saldo pendiente', camposPrincipales: ['saldo', 'monto', 'cantidad'], camposSecundarios: ['cantidad', 'diasAtraso'], colecciones: ['cartera', 'aging'], series: ['saldo', 'monto', 'cantidad'], amplia: true },
  cuentasPagar: { titulo: 'Cuentas por pagar', ruta: '/dashboard-m7/cuentas-pagar', icono: BanknoteArrowDown, tipo: 'barras-horizontal', etiquetaPrincipal: 'Saldo por pagar', camposPrincipales: ['saldo', 'monto', 'cantidad'], colecciones: ['proveedores', 'obligaciones', 'estados'], series: ['saldo', 'monto', 'cantidad'] },
  liquidez: { titulo: 'Liquidez y flujo', ruta: '/dashboard-m7/liquidez', icono: Wallet, tipo: 'linea', etiquetaPrincipal: 'Liquidez disponible', camposPrincipales: ['liquidez', 'saldoFinal', 'saldo', 'monto'], camposSecundarios: ['ingresos', 'egresos'], colecciones: ['serie', 'eventos', 'movimientos'], series: ['liquidez', 'saldo', 'liquidezProyectada', 'ingresos', 'egresos', 'entradas', 'salidas'], amplia: true },
  riesgoDeficit: { titulo: 'Riesgo de déficit', ruta: '/dashboard-m7/riesgo-deficit', icono: CircleAlert, tipo: 'area', etiquetaPrincipal: 'Mínimo proyectado', camposPrincipales: ['minimoProyectado', 'saldoMinimo', 'liquidezProyectada', 'monto'], colecciones: ['eventos', 'cruces', 'umbrales'], series: ['liquidezProyectada', 'saldoProyectado', 'saldo', 'monto'], amplia: true },
  margenProyectos: { titulo: 'Margen por proyecto', ruta: '/dashboard-m7/margen-proyectos', icono: Gauge, tipo: 'barras', etiquetaPrincipal: 'Margen directo', camposPrincipales: ['margenDirecto', 'margen', 'resultado'], colecciones: ['proyectos'], series: ['ingresos', 'costosDirectos', 'margenDirecto', 'margen'] },
  exposicionProyectos: { titulo: 'Exposición de Proyectos', ruta: '/dashboard-m7/proyectos/exposicion', icono: Gauge, tipo: 'barras', etiquetaPrincipal: 'Exposición', camposPrincipales: ['exposicion', 'monto', 'saldo'], colecciones: ['proyectos'], series: ['cobrado', 'porCobrar', 'porPagar', 'exposicion'], amplia: true },
  resumenResultados: { titulo: 'Resumen de resultados', ruta: '/dashboard-m7/resumenes', icono: ChartNoAxesCombined, tipo: 'barras', etiquetaPrincipal: 'Resultado gerencial', camposPrincipales: ['resultadoGerencial', 'monto'], colecciones: ['resultadoGerencial'], series: ['ingresos', 'costosDirectos', 'resultadoGerencial'] },
  situacionFinanciera: { titulo: 'Situación financiera', ruta: '/dashboard-m7/resumenes', icono: Scale, tipo: 'barras', etiquetaPrincipal: 'Posición financiera', camposPrincipales: ['posicion', 'saldo', 'monto'], series: ['cuentasPorCobrar', 'cuentasPorPagar', 'liquidez'] },
  costoRemuneraciones: { titulo: 'Costo de remuneraciones', ruta: '/dashboard-m7/operacion', icono: Scale, tipo: 'barras', etiquetaPrincipal: 'Costo agregado', camposPrincipales: ['costoTotal', 'totalClp', 'monto'], colecciones: ['evolucion', 'periodos'], series: ['costo', 'monto', 'total'] },
  ordenesTrabajo: { titulo: 'Órdenes de Trabajo', ruta: '/dashboard-m7/operacion', icono: Gauge, tipo: 'donut', etiquetaPrincipal: 'Órdenes', camposPrincipales: ['cantidad', 'total'], colecciones: ['estados', 'ordenes'], series: ['cantidad'] },
  cargaOperacional: { titulo: 'Carga operacional', ruta: '/dashboard-m7/operacion', icono: Gauge, tipo: 'barras', etiquetaPrincipal: 'Tareas abiertas', camposPrincipales: ['abiertas', 'cantidad', 'total'], colecciones: ['carga', 'tareas', 'asignaciones'], series: ['abiertas', 'atrasadas', 'proximas', 'cantidad'] },
  instalaciones: { titulo: 'Instalaciones', ruta: '/dashboard-m7/operacion', icono: ChartNoAxesCombined, tipo: 'barras', etiquetaPrincipal: 'Instalaciones', camposPrincipales: ['cantidad', 'total'], colecciones: ['evolucion', 'geografia', 'instalaciones'], series: ['cantidad'] },
  atrasosInstalaciones: { titulo: 'Atrasos de instalaciones', ruta: '/dashboard-m7/operacion', icono: FileClock, tipo: 'barras-horizontal', etiquetaPrincipal: 'Casos atrasados', camposPrincipales: ['cantidad', 'diasAtraso'], colecciones: ['atrasos'], series: ['diasAtraso'] },
  incidenciasRetrabajos: { titulo: 'Incidencias y retrabajos', ruta: '/dashboard-m7/operacion', icono: CircleAlert, tipo: 'donut', etiquetaPrincipal: 'Incidencias', camposPrincipales: ['cantidad', 'total'], colecciones: ['incidencias', 'estados'], series: ['cantidad'] },
  exposicionCredito: { titulo: 'Exposición crediticia', ruta: '/dashboard-m7/control', icono: Gauge, tipo: 'progreso', etiquetaPrincipal: 'Exposición utilizada', camposPrincipales: ['exposicionUtilizada', 'utilizado'], camposSecundarios: ['limiteGlobal', 'capacidadDisponible', 'cupoTotalAgregado', 'totalSolicitudes', 'totalCompromisos'], colecciones: ['clientes', 'clientesSobreLimite'], series: ['exposicion', 'concentracion'], amplia: true },
  alertasCredito: { titulo: 'Alertas de crédito', ruta: '/dashboard-m7/control', icono: CircleAlert, tipo: 'donut', etiquetaPrincipal: 'Alertas activas', camposPrincipales: ['cantidad', 'total'], colecciones: ['alertas', 'restricciones'], series: ['cantidad'] },
  resumenIva: { titulo: 'IVA estimado', ruta: '/dashboard-m7/control', icono: Scale, tipo: 'barras', etiquetaPrincipal: 'IVA neto', camposPrincipales: ['ivaNeto', 'monto', 'total'], colecciones: ['porMoneda', 'resumen'], series: ['debito', 'credito', 'ivaNeto', 'monto'] },
  costosFabricacion: { titulo: 'Costos de fabricación', ruta: '/dashboard-m7/control', icono: Scale, tipo: 'barras', etiquetaPrincipal: 'Costo atribuible', camposPrincipales: ['costoFabricacion', 'monto'], colecciones: ['proyectos'], series: ['materiales', 'remuneracionesExtra', 'costoInstalacion', 'costoFabricacion'], amplia: true },
  bloqueosEconomicos: { titulo: 'Bloqueos económicos', ruta: '/dashboard-m7/control', icono: CircleAlert, tipo: 'donut', etiquetaPrincipal: 'Bloqueos', camposPrincipales: ['cantidad', 'total'], colecciones: ['bloqueos', 'estados'], series: ['cantidad'] },
  margenInstalaciones: { titulo: 'Margen de instalaciones', ruta: '/dashboard-m7/control', icono: Gauge, tipo: 'barras', etiquetaPrincipal: 'Margen agregado', camposPrincipales: ['margenAgregado', 'margen', 'cantidad'], colecciones: ['geografia', 'instalaciones'], series: ['precio', 'costo', 'margen'] },
  inventarioValorizado: { titulo: 'Inventario valorizado', ruta: '/dashboard-m7/control', icono: Scale, tipo: 'barras-horizontal', etiquetaPrincipal: 'Valor total', camposPrincipales: ['valorTotal', 'valor'], colecciones: ['inventario'], series: ['valor', 'stock'], amplia: true },
  materialesProyectoOt: { titulo: 'Materiales por Proyecto y OT', ruta: '/dashboard-m7/control', icono: Gauge, tipo: 'barras', etiquetaPrincipal: 'Materiales vinculados', camposPrincipales: ['cantidad', 'total'], colecciones: ['materialesBodegaAsignados', 'materialesCompradosEspecificamente'], series: ['cantidadEstimada', 'cantidadReal', 'cantidadPedida', 'cantidadRecibida'] },
  riesgoStock: { titulo: 'Riesgo de stock', ruta: '/dashboard-m7/control', icono: CircleAlert, tipo: 'barras', etiquetaPrincipal: 'Materiales en riesgo', camposPrincipales: ['cantidad', 'faltante'], colecciones: ['riesgos', 'materiales'], series: ['stock', 'entradasEsperadas', 'demandaConocida', 'faltante'], amplia: true },
  rotacionInventario: { titulo: 'Rotación de inventario', ruta: '/dashboard-m7/control', icono: ChartNoAxesCombined, tipo: 'barras-horizontal', etiquetaPrincipal: 'Stock inmóvil', camposPrincipales: ['cantidad', 'diasSinMovimiento'], colecciones: ['stockInmovil', 'rotacion'], series: ['stock', 'diasSinMovimiento', 'cantidadSalida'] },
  comprasRecepciones: { titulo: 'Compras y recepciones', ruta: '/dashboard-m7/control', icono: FileClock, tipo: 'barras', etiquetaPrincipal: 'Pendiente de recibir', camposPrincipales: ['cantidadPendiente', 'cantidad'], colecciones: ['ordenesPendientes'], series: ['cantidadPedida', 'cantidadRecibida', 'cantidadPendiente'] },
};

const compactas = ['ventas', 'liquidez', 'cuentasCobrar', 'cuentasPagar', 'riesgoDeficit', 'margenProyectos', 'exposicionCredito', 'cargaOperacional', 'inventarioValorizado', 'centroAtencion'];
const secciones = [
  { titulo: 'Pulso financiero', claves: ['ventas', 'cotizacionesPendientes', 'cuentasCobrar', 'cuentasPagar', 'liquidez', 'riesgoDeficit', 'resumenResultados', 'situacionFinanciera'] },
  { titulo: 'Proyectos y operación', claves: ['margenProyectos', 'exposicionProyectos', 'costoRemuneraciones', 'ordenesTrabajo', 'cargaOperacional', 'instalaciones', 'atrasosInstalaciones', 'incidenciasRetrabajos'] },
  { titulo: 'Crédito, costos e inventario', claves: ['exposicionCredito', 'alertasCredito', 'resumenIva', 'costosFabricacion', 'bloqueosEconomicos', 'margenInstalaciones', 'inventarioValorizado', 'materialesProyectoOt', 'riesgoStock', 'rotacionInventario', 'comprasRecepciones'] },
  { titulo: 'Atención y contexto', claves: ['centroAtencion'] },
];

const esObjeto = (valor: unknown): valor is Record<string, unknown> => Boolean(valor) && typeof valor === 'object' && !Array.isArray(valor);
const desenvolver = (valor: unknown): unknown => esObjeto(valor) && 'valor' in valor ? desenvolver(valor.valor) : valor;
const numero = (valor: unknown) => typeof valor === 'number' && Number.isFinite(valor) ? valor : null;
const etiquetaHumana = (clave: string) => clave.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ').replace(/^./, letra => letra.toUpperCase());
const esTecnica = (clave: string) => /^(id|acciones|destino|parametro|estado|version|codigo|sku|fechaHora)/i.test(clave);

function buscarPorClave(origen: unknown, claves: string[], profundidad = 0): { clave: string; valor: unknown } | null {
  if (profundidad > 5 || !esObjeto(origen)) return null;
  for (const clave of claves) if (clave in origen) return { clave, valor: desenvolver(origen[clave]) };
  for (const valor of Object.values(origen)) {
    const hallado = buscarPorClave(desenvolver(valor), claves, profundidad + 1);
    if (hallado) return hallado;
  }
  return null;
}

function buscarNumero(origen: unknown, claves: string[]) {
  const hallado = buscarPorClave(origen, claves);
  if (!hallado) return null;
  const directo = numero(hallado.valor);
  if (directo !== null) return { clave: hallado.clave, valor: directo };
  if (esObjeto(hallado.valor)) {
    for (const [clave, valor] of Object.entries(hallado.valor)) {
      const candidato = numero(valor);
      if (candidato !== null && !esTecnica(clave)) return { clave, valor: candidato };
    }
  }
  return null;
}

function buscarColeccion(origen: unknown, claves: string[]) {
  const hallado = buscarPorClave(origen, claves);
  if (hallado && Array.isArray(hallado.valor) && hallado.valor.length) return hallado.valor.filter(esObjeto);
  return [];
}

function nombreFila(fila: Record<string, unknown>, indice: number) {
  const claves = ['fecha', 'dia', 'mes', 'nombre', 'cliente', 'proveedor', 'codigo', 'familia', 'estado', 'condicion', 'material', 'categoria', 'comuna', 'moneda', 'tarea'];
  const clave = claves.find(item => typeof fila[item] === 'string' && String(fila[item]).trim());
  return clave ? String(fila[clave]) : `Registro ${indice + 1}`;
}

function prepararGrafico(bloque: RespuestaM7, config: Configuracion) {
  const filas = buscarColeccion(bloque, config.colecciones || []);
  const datos: DatoGrafico[] = filas.slice(0, 12).map((fila, indice) => {
    const salida: DatoGrafico = { etiqueta: nombreFila(fila, indice) };
    for (const [clave, valor] of Object.entries(fila)) {
      if (numero(valor) !== null && !esTecnica(clave)) salida[clave] = valor as number;
    }
    return salida;
  });
  const candidatas = config.series || [];
  const presentes = candidatas.filter(clave => datos.some(fila => numero(fila[clave]) !== null));
  if (!presentes.length && datos.length) {
    const detectadas = Object.keys(datos[0]).filter(clave => clave !== 'etiqueta' && datos.some(fila => numero(fila[clave]) !== null));
    presentes.push(...detectadas.slice(0, 4));
  }
  const series: SerieGrafico[] = presentes.slice(0, 4).map(clave => ({ clave, nombre: etiquetaHumana(clave) }));
  return { datos, series };
}

function estadoBloque(bloque: RespuestaM7) {
  if (typeof bloque.estado === 'string') return bloque.estado;
  const indicador = Object.values(bloque).find(valor => esObjeto(valor) && typeof valor.estado === 'string') as Record<string, unknown> | undefined;
  return typeof indicador?.estado === 'string' ? indicador.estado : undefined;
}

function resumenTarjeta(bloque: RespuestaM7, config: Configuracion) {
  const principal = buscarNumero(bloque, config.camposPrincipales || []);
  const secundarios = (config.camposSecundarios || []).flatMap(clave => {
    const dato = buscarNumero(bloque, [clave]);
    return dato ? [{ etiqueta: etiquetaHumana(clave), valor: formatearDato(dato.valor, clave) }] : [];
  });
  const variacion = buscarNumero(bloque, ['variacionPorcentual', 'variacionMargenPorcentual']);
  const coleccion = buscarColeccion(bloque, config.colecciones || []);
  return {
    principal: principal ? formatearDato(principal.valor, principal.clave) : coleccion.length ? `${coleccion.length} registros` : estadoHumano(estadoBloque(bloque)),
    secundarios,
    variacion: variacion ? `${variacion.valor >= 0 ? '+' : ''}${formatearDato(variacion.valor, 'porcentaje')}` : null,
  };
}

function graficoBloque(bloque: RespuestaM7, config: Configuracion): ReactNode {
  if (['FUENTE_NO_DISPONIBLE', 'DATOS_INSUFICIENTES', 'CONFIGURACION_PENDIENTE'].includes(estadoBloque(bloque) || '')) {
    return <EstadoSinDatos texto={estadoHumano(estadoBloque(bloque))} />;
  }
  if (config.tipo === 'progreso') {
    const utilizado = buscarNumero(bloque, ['exposicionUtilizada', 'utilizado']);
    const disponible = buscarNumero(bloque, ['capacidadDisponible', 'disponible']);
    return utilizado && disponible ? <GraficoProgreso utilizado={utilizado.valor} disponible={disponible.valor} /> : <EstadoSinDatos texto="La capacidad no está disponible para este período." />;
  }
  const { datos, series } = prepararGrafico(bloque, config);
  if (config.tipo === 'donut') {
    const piezas = datos.flatMap((fila, indice) => {
      const serie = series[0];
      const valor = serie ? numero(fila[serie.clave]) : null;
      return valor === null ? [] : [{ nombre: String(fila.etiqueta || `Grupo ${indice + 1}`), valor }];
    });
    return <GraficoDonut datos={piezas} centro={piezas.length ? String(piezas.reduce((suma, pieza) => suma + pieza.valor, 0)) : undefined} />;
  }
  if (config.tipo === 'linea') return <GraficoLinea datos={datos} series={series} />;
  if (config.tipo === 'area') return <GraficoArea datos={datos} series={series} />;
  return <GraficoBarras datos={datos} series={series} horizontal={config.tipo === 'barras-horizontal'} apiladas={series.length > 1 && ['Costos de fabricación', 'Riesgo de stock'].includes(config.titulo)} />;
}

function graficoComplementario(claveBloque: string, bloque: RespuestaM7): ReactNode | undefined {
  if (claveBloque === 'ventas') {
    const total = buscarNumero(bloque, ['totalCotizaciones']);
    const convertidas = buscarNumero(bloque, ['convertidas']);
    if (!total || !convertidas || total.valor <= 0) return undefined;
    return <div><p className="mb-2 text-xs font-semibold text-gray-500">Conversión de cotizaciones</p><GraficoDonut datos={[
      { nombre: 'Convertidas', valor: convertidas.valor },
      { nombre: 'No convertidas', valor: Math.max(0, total.valor - convertidas.valor) },
    ]} centro={formatearDato(convertidas.valor / total.valor * 100, 'porcentaje')} /></div>;
  }
  if (claveBloque === 'exposicionCredito') {
    const clientes = buscarColeccion(bloque, ['clientes']);
    const datos = clientes.slice(0, 8).map((cliente, indice) => ({
      etiqueta: nombreFila(cliente, indice),
      exposicion: numero(cliente.exposicion),
    }));
    return datos.some(fila => fila.exposicion !== null) ? <div><p className="mb-2 text-xs font-semibold text-gray-500">Concentración por cliente</p><GraficoBarras datos={datos} series={[{ clave: 'exposicion', nombre: 'Exposición' }]} horizontal /></div> : undefined;
  }
  return undefined;
}

function TarjetaDashboard({ claveBloque, bloque, anio, mes }: { claveBloque: string; bloque: RespuestaM7; anio: number; mes: number }) {
  const config = configuraciones[claveBloque];
  const Icono = config.icono;
  const resumen = resumenTarjeta(bloque, config);
  return <TarjetaIndicador
    titulo={config.titulo}
    icono={<Icono className="h-5 w-5" />}
    estado={estadoBloque(bloque)}
    principal={resumen.principal}
    etiquetaPrincipal={config.etiquetaPrincipal}
    variacion={resumen.variacion}
    secundarios={resumen.secundarios}
    grafico={graficoBloque(bloque, config)}
    graficoSecundario={graficoComplementario(claveBloque, bloque)}
    ruta={`${config.ruta}?anio=${anio}&mes=${mes}`}
    amplia={config.amplia}
  />;
}

export default function PanelGeneralM7({ compacto = false }: { compacto?: boolean }) {
  const consulta = usarConsultaM7('/dashboard-m7', true);
  const bloques = (consulta.datos?.bloques || {}) as Record<string, RespuestaM7>;
  const clavesVisibles = compacto ? compactas.filter(clave => bloques[clave]) : Object.keys(bloques).filter(clave => configuraciones[clave]);

  return <div className="min-h-full bg-gray-50">
    <EncabezadoM7 titulo={compacto ? 'Dashboard Financiero' : 'Resumen financiero'} descripcion="Visión ejecutiva de liquidez, cartera, ventas, operación, crédito y riesgos" />
    <Periodo anio={consulta.anio} mes={consulta.mes} cambiar={consulta.cambiar} cargando={consulta.cargando} recargar={consulta.recargar} />
    <PdfDashboard origen="panel" anio={consulta.anio} mes={consulta.mes} />
    {consulta.error && <div className="border-y border-red-200 bg-red-50 px-5 py-4 text-red-800">{consulta.error}</div>}
    <main className="mx-auto max-w-[1500px] px-5 py-6 sm:px-8">
      {compacto ? <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase text-[#b85e00]">Período seleccionado</p><h2 className="mt-1 text-xl font-bold text-gray-950">Indicadores prioritarios</h2></div><Link to={`/dashboard-m7?anio=${consulta.anio}&mes=${consulta.mes}`} className="text-sm font-bold text-[#b85e00] hover:text-black">Ver dashboard completo</Link></div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{clavesVisibles.map(clave => <TarjetaDashboard key={clave} claveBloque={clave} bloque={bloques[clave]} anio={consulta.anio} mes={consulta.mes} />)}</div>
      </section> : secciones.map(seccion => {
        const claves = seccion.claves.filter(clave => bloques[clave]);
        return claves.length ? <section key={seccion.titulo} className="mb-9"><div className="mb-4"><p className="text-xs font-bold uppercase text-[#b85e00]">Dashboard M7</p><h2 className="mt-1 text-xl font-bold text-gray-950">{seccion.titulo}</h2></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{claves.map(clave => <TarjetaDashboard key={clave} claveBloque={clave} bloque={bloques[clave]} anio={consulta.anio} mes={consulta.mes} />)}</div></section> : null;
      })}
      {!consulta.cargando && !clavesVisibles.length && !consulta.error && <EstadoSinDatos texto="No hay bloques habilitados para esta cuenta." />}
    </main>
  </div>;
}
