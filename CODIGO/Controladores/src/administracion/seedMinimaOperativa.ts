import { Prisma, type PrismaClient } from '@prisma/client';
import { ServicioCatalogoComercial } from '../comercial/ServicioCatalogoComercial';

export const CODIGO_MANIFIESTO_DEMO = 'DEMO_UI_MANIFIESTO_V2';
export const PREFIJO_SEED_MINIMA = 'DEMO-CAT-';
export const BASE_OPERATIVA_AUTORIZADA = 'pblindadas_finanzas';

const VIGENCIA_DESDE = new Date('2026-01-01T00:00:00.000Z');
const NOVIEMBRE_2026_DESDE = new Date('2026-11-01T00:00:00.000Z');
const NOVIEMBRE_2026_HASTA = new Date('2026-11-30T00:00:00.000Z');
const RESPALDO_ESPERADO = /^pblindadas_antes_demo36_\d{8}_\d{6}$/;

const FUENTE_SII_IMPUESTO_2026 = 'SII — Impuesto Único de Segunda Categoría 2026';
const REFERENCIA_SII_IMPUESTO_2026 = 'https://www.sii.cl/valores_y_fechas/impuesto_2da_categoria/impuesto2026.htm';
const FUENTE_SII_UF_2026 = 'SII — Valores UF 2026';
const REFERENCIA_SII_UF_2026 = 'https://www.sii.cl/valores_y_fechas/uf/uf2026.htm';
const FUENTE_SII_HONORARIOS_2026 = 'SII — Retención boletas de honorarios 2026';
const REFERENCIA_SII_HONORARIOS_2026 = 'https://www.sii.cl/destacados/boletas_honorarios/index.html';

export type ModoSeedMinima = 'audit' | 'dry-run' | 'apply' | 'verify';

export interface ProductoMinimo {
  codigo: string;
  nombre: string;
  itemExistente: string;
  familia: 'DEMO-CAT-PUERTAS-BLINDADAS' | 'DEMO-CAT-PUERTAS-COMERCIALES';
  descripcionB2b: string;
  descripcionB2c: string;
  precioB2b: string;
  precioB2c: string;
}

export const CATALOGO_MINIMO = Object.freeze({
  familias: [
    { codigo: 'DEMO-CAT-PUERTAS-BLINDADAS', nombre: 'Puertas blindadas demostrativas' },
    { codigo: 'DEMO-CAT-PUERTAS-COMERCIALES', nombre: 'Puertas comerciales demostrativas' },
  ],
  productos: [
    { codigo: 'DEMO-CAT-PB-ESTANDAR', nombre: 'Puerta blindada estándar — demostración', itemExistente: 'DEMO-UI | Puerta blindada residencial estándar', familia: 'DEMO-CAT-PUERTAS-BLINDADAS', descripcionB2b: 'Modelo referencial para cotizaciones empresariales de demostración.', descripcionB2c: 'Modelo referencial para cotizaciones particulares de demostración.', precioB2b: '950000', precioB2c: '1090000' },
    { codigo: 'DEMO-CAT-PB-REFORZADA', nombre: 'Puerta blindada reforzada — demostración', itemExistente: 'DEMO-UI Puerta de seguridad', familia: 'DEMO-CAT-PUERTAS-BLINDADAS', descripcionB2b: 'Configuración reforzada referencial; no constituye especificación técnica oficial.', descripcionB2c: 'Configuración reforzada referencial; requiere validación comercial.', precioB2b: '1320000', precioB2c: '1490000' },
    { codigo: 'DEMO-CAT-PB-PREMIUM', nombre: 'Puerta blindada premium — demostración', itemExistente: 'DEMO-UI | Puerta blindada residencial premium', familia: 'DEMO-CAT-PUERTAS-BLINDADAS', descripcionB2b: 'Alternativa premium referencial para demostrar comparación comercial.', descripcionB2c: 'Alternativa premium referencial para demostrar comparación de modelos.', precioB2b: '1780000', precioB2c: '1990000' },
    { codigo: 'DEMO-CAT-PB-PROYECTO', nombre: 'Puerta de seguridad para proyecto — demostración', itemExistente: 'DEMO-UI | Puerta de seguridad comercial', familia: 'DEMO-CAT-PUERTAS-COMERCIALES', descripcionB2b: 'Modelo referencial para partidas B2B; dimensiones y prestaciones deben confirmarse.', descripcionB2c: 'Modelo referencial disponible para evaluación comercial.', precioB2b: '2100000', precioB2c: '2350000' },
    { codigo: 'DEMO-CAT-PC-REFORZADA', nombre: 'Puerta cortafuego reforzada — demostración', itemExistente: 'DEMO-UI | Puerta cortafuego reforzada', familia: 'DEMO-CAT-PUERTAS-COMERCIALES', descripcionB2b: 'Modelo demostrativo; toda certificación y resistencia al fuego debe acreditarse antes de cotizar.', descripcionB2c: 'Modelo demostrativo sujeto a evaluación técnica y documental.', precioB2b: '2250000', precioB2c: '2490000' },
  ] satisfies ProductoMinimo[],
  opcionales: [
    { codigo: 'DEMO-CAT-CERRADURA', nombre: 'Cerradura adicional — demostración', precioB2b: '165000', precioB2c: '189000' },
    { codigo: 'DEMO-CAT-TERMINACION', nombre: 'Terminación especial — demostración', precioB2b: '120000', precioB2c: '145000' },
    { codigo: 'DEMO-CAT-ACCESORIO', nombre: 'Accesorio de seguridad — demostración', precioB2b: '85000', precioB2c: '99000' },
    { codigo: 'DEMO-CAT-MARCO', nombre: 'Refuerzo de marco metálico — demostración', precioB2b: '140000', precioB2c: '165000' },
    { codigo: 'DEMO-CAT-CILINDRO', nombre: 'Cilindro de alta seguridad — demostración', precioB2b: '95000', precioB2c: '115000' },
    { codigo: 'DEMO-CAT-PINTURA', nombre: 'Terminación y pintura — demostración', precioB2b: '110000', precioB2c: '135000' },
  ],
  servicios: [
    { codigo: 'DEMO-CAT-DESPACHO', nombre: 'Despacho referencial — demostración', unidad: 'VIAJE', precioB2b: '95000', precioB2c: '109000' },
    { codigo: 'DEMO-CAT-TRANSPORTE', nombre: 'Transporte especial — demostración', unidad: 'VIAJE', precioB2b: '165000', precioB2c: '189000' },
    { codigo: 'DEMO-CAT-INSTALACION-ESTANDAR', nombre: 'Instalación estándar — demostración', unidad: 'UNIDAD', precioB2b: '180000', precioB2c: '210000' },
    { codigo: 'DEMO-CAT-INSTALACION-ESPECIAL', nombre: 'Instalación especial — demostración', unidad: 'UNIDAD', precioB2b: '290000', precioB2c: '335000' },
    { codigo: 'DEMO-CAT-RETIRO', nombre: 'Retiro de puerta existente — demostración', unidad: 'UNIDAD', precioB2b: '75000', precioB2c: '89000' },
    { codigo: 'DEMO-CAT-MANTENCION', nombre: 'Mantención preventiva — demostración', unidad: 'SERVICIO', precioB2b: '105000', precioB2c: '125000' },
  ],
  condiciones: [
    { codigo: 'DEMO-CAT-COND-B2B', nombre: 'Condiciones B2B demostrativas', segmento: 'B2B' },
    { codigo: 'DEMO-CAT-COND-B2C', nombre: 'Condiciones B2C demostrativas', segmento: 'B2C' },
  ],
  categoriasPago: ['Anticipo', 'Abono parcial', 'Pago final'],
  cuotas: [1, 3, 6, 12],
  monedas: [
    { codigo: 'CLP', nombre: 'Peso chileno', simbolo: '$' },
    { codigo: 'USD', nombre: 'Dólar estadounidense', simbolo: 'US$' },
  ],
  mediosPago: [
    { nombre: 'Transferencia', codigo: 'TRANSFERENCIA', requiereRespaldo: true },
    { nombre: 'Efectivo', codigo: 'EFECTIVO', requiereRespaldo: false },
    { nombre: 'Débito', codigo: 'TARJETA_DEBITO', requiereRespaldo: true },
    { nombre: 'Crédito', codigo: 'TARJETA_CREDITO', requiereRespaldo: true },
    { nombre: 'Cheque', codigo: 'CHEQUE', requiereRespaldo: true },
  ],
  remuneraciones: {
    ufNoviembre2026: '41439.89',
    retencionHonorarios2026: '0.1525',
    tramosNoviembre2026: [
      { orden: 1, desde: '0', hasta: '977940.00', factor: '0', rebaja: '0' },
      { orden: 2, desde: '977940.01', hasta: '2173200.00', factor: '0.04', rebaja: '39117.60' },
      { orden: 3, desde: '2173200.01', hasta: '3622000.00', factor: '0.08', rebaja: '126045.60' },
      { orden: 4, desde: '3622000.01', hasta: '5070800.00', factor: '0.135', rebaja: '325255.60' },
      { orden: 5, desde: '5070800.01', hasta: '6519600.00', factor: '0.23', rebaja: '806981.60' },
      { orden: 6, desde: '6519600.01', hasta: '8692800.00', factor: '0.304', rebaja: '1289432.00' },
      { orden: 7, desde: '8692800.01', hasta: '22456400.00', factor: '0.35', rebaja: '1689300.80' },
      { orden: 8, desde: '22456400.01', hasta: null, factor: '0.40', rebaja: '2812120.80' },
    ],
  },
  inventario: {
    unidades: ['Unidad', 'Metro', 'Kilogramo'],
    categoriasGenerales: ['DEMO-CAT Materiales de fabricación', 'DEMO-CAT Herrajes y accesorios'],
    categoriasFuncionales: ['DEMO-CAT Estructura', 'DEMO-CAT Seguridad', 'DEMO-CAT Terminación'],
  },
});

type Cliente = PrismaClient | Prisma.TransactionClient;

interface ConteosProtegidos {
  cotizaciones: number;
  notasVenta: number;
  pagos: number;
  usuarios: number;
  permisos: number;
}

interface AccionPlan {
  modulo: string;
  entidad: string;
  clave: string;
  accion: 'CREAR' | 'CONSERVAR' | 'PENDIENTE_CONFIGURACION';
  motivo?: string;
}

interface ContadorCambios {
  creados: number;
  porEntidad: Record<string, number>;
}

function sumar(contador: ContadorCambios, entidad: string) {
  contador.creados += 1;
  contador.porEntidad[entidad] = (contador.porEntidad[entidad] ?? 0) + 1;
}

const descripcionDemo = 'Dato referencial ficticio creado por la seed mínima operativa. No corresponde a una condición o tarifa oficial de Puertas Blindadas.';

export function validarDefinicionCatalogoMinimo() {
  const codigos = [
    ...CATALOGO_MINIMO.familias.map(x => x.codigo),
    ...CATALOGO_MINIMO.productos.map(x => x.codigo),
    ...CATALOGO_MINIMO.opcionales.map(x => x.codigo),
    ...CATALOGO_MINIMO.servicios.map(x => x.codigo),
    ...CATALOGO_MINIMO.condiciones.map(x => x.codigo),
  ];
  if (new Set(codigos).size !== codigos.length) throw new Error('La seed mínima contiene códigos duplicados');
  if (codigos.some(codigo => !codigo.startsWith(PREFIJO_SEED_MINIMA))) throw new Error('Todo registro comercial debe usar el prefijo DEMO-CAT-');
  if (CATALOGO_MINIMO.productos.some(producto => new Prisma.Decimal(producto.precioB2b).lte(0) || new Prisma.Decimal(producto.precioB2c).lte(0))) throw new Error('Los precios demostrativos deben ser positivos');
  if (CATALOGO_MINIMO.remuneraciones.tramosNoviembre2026.length !== 8) throw new Error('La tabla tributaria de noviembre de 2026 debe contener ocho tramos');
  if (!new Prisma.Decimal(CATALOGO_MINIMO.remuneraciones.retencionHonorarios2026).equals('0.1525')) throw new Error('La retención de honorarios 2026 debe conservar la tasa oficial de 15,25%');
  return true;
}

export function prioridadesDesdeAuditoria(catalogos: Record<string, { total_registros?: number }>) {
  const total = (nombre: string) => Number(catalogos[nombre]?.total_registros ?? 0);
  return [
    { modulo: 'M2', catalogo: 'Productos, familias, versiones y precios', estado: total('finanzas.extension_producto_comercial') > 0 && total('finanzas.precio_producto_comercial') > 0 ? 'CONSERVAR' : 'COMPLETAR', prioridad: 'ALTA' },
    { modulo: 'M2', catalogo: 'Opcionales y compatibilidades', estado: total('finanzas.opcional_comercial') > 0 && total('finanzas.compatibilidad_opcional_producto') > 0 ? 'CONSERVAR' : 'COMPLETAR', prioridad: 'ALTA' },
    { modulo: 'M2', catalogo: 'Servicios comerciales', estado: total('finanzas.servicio_comercial') > 0 && total('finanzas.precio_servicio_comercial') > 0 ? 'CONSERVAR' : 'COMPLETAR', prioridad: 'ALTA' },
    { modulo: 'M2', catalogo: 'Condiciones y cobertura', estado: total('finanzas.condicion_comercial') > 0 && total('finanzas.tarifa_instalacion_comercial') > 0 ? 'CONSERVAR' : 'COMPLETAR', prioridad: 'ALTA' },
    { modulo: 'M3', catalogo: 'Categorías de pago y cuotas', estado: total('finanzas.categoria_pago') >= 3 ? 'CONSERVAR' : 'COMPLETAR', prioridad: 'MEDIA' },
    { modulo: 'M5', catalogo: 'Proveedores', estado: total('finanzas.proveedor') > 0 ? 'CONSERVAR' : 'REVISAR_MANUAL', prioridad: 'BAJA' },
    { modulo: 'M6', catalogo: 'Honorarios', estado: total('finanzas.prestador_honorarios') > 0 && total('finanzas.boleta_honorarios') > 0 ? 'CONSERVAR' : 'REVISAR_MANUAL', prioridad: 'BAJA' },
    { modulo: 'M6', catalogo: 'Remuneraciones y parámetros legales', estado: total('finanzas.esquema_remuneracional') > 0 && total('finanzas.parametro_remuneracional') > 0 && total('finanzas.tramo_impuesto_renta') >= 8 ? 'VERIFICAR_VIGENCIA' : 'COMPLETAR_CON_FUENTE_OFICIAL', prioridad: 'ALTA' },
    { modulo: 'Inventario', catalogo: 'Materiales y bodegas', estado: total('inventario.material') > 0 && total('inventario.bodega') > 0 ? 'CONSERVAR' : 'REVISAR_MANUAL', prioridad: 'BAJA' },
    { modulo: 'Inventario', catalogo: 'Unidades y categorías', estado: total('inventario.material_unidad_medida') > 0 && total('inventario.material_categoria_general') > 0 ? 'CONSERVAR' : 'COMPLETAR', prioridad: 'MEDIA' },
  ] as const;
}

async function nombreBase(cliente: Cliente) {
  const filas = await cliente.$queryRaw<Array<{ nombre: string }>>(Prisma.sql`SELECT current_database() AS nombre`);
  return filas[0]?.nombre ?? '';
}

async function conteosProtegidos(cliente: Cliente): Promise<ConteosProtegidos> {
  const [cotizaciones, notasVenta, pagos, usuarios, permisos] = await Promise.all([
    cliente.cotizacion.count(), cliente.nota_venta.count(), cliente.pago_cliente.count(), cliente.usuario.count(), cliente.permiso.count(),
  ]);
  return { cotizaciones, notasVenta, pagos, usuarios, permisos };
}

async function estadoMigraciones(cliente: Cliente) {
  const ubicaciones = await cliente.$queryRaw<Array<{ esquema: string }>>(Prisma.sql`
    SELECT n.nspname AS esquema
    FROM pg_catalog.pg_class c
    JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relname = '_prisma_migrations'
      AND c.relkind IN ('r', 'p')
    ORDER BY CASE n.nspname WHEN 'public' THEN 0 WHEN 'comun' THEN 1 WHEN 'finanzas' THEN 2 ELSE 3 END
  `);
  const esquema = ubicaciones[0]?.esquema;
  if (!esquema || !/^[a-z_][a-z0-9_]*$/i.test(esquema)) {
    throw new Error('No fue posible localizar de forma segura la tabla _prisma_migrations');
  }
  const tablaMigraciones = `"${esquema}"."_prisma_migrations"`;
  const filas = await cliente.$queryRawUnsafe<Array<{ aplicadas: bigint; fallidas: bigint; ultima: string | null }>>(`
    SELECT
      count(*) FILTER (WHERE finished_at IS NOT NULL AND rolled_back_at IS NULL) AS aplicadas,
      count(*) FILTER (WHERE finished_at IS NULL AND rolled_back_at IS NULL) AS fallidas,
      max(migration_name) FILTER (WHERE finished_at IS NOT NULL AND rolled_back_at IS NULL) AS ultima
    FROM ${tablaMigraciones}
  `);
  const fila = filas[0];
  return { esquema, aplicadas: Number(fila?.aplicadas ?? 0), fallidas: Number(fila?.fallidas ?? 0), ultima: fila?.ultima ?? null };
}

async function exigirDestinoSeguro(cliente: Cliente, entorno: NodeJS.ProcessEnv) {
  const base = await nombreBase(cliente);
  const baseEsperada = entorno.SEED_MINIMA_OPERATIVA_BASE || BASE_OPERATIVA_AUTORIZADA;
  if (base !== baseEsperada) throw new Error(`Base no autorizada: se esperaba ${baseEsperada} y la conexión apunta a ${base}`);
  if (entorno.SEED_MINIMA_OPERATIVA_AUTORIZADA !== 'SI') throw new Error('Falta SEED_MINIMA_OPERATIVA_AUTORIZADA=SI');
  if (entorno.NODE_ENV === 'production' && entorno.SEED_MINIMA_OPERATIVA_PRODUCCION !== 'SI') throw new Error('En producción se requiere SEED_MINIMA_OPERATIVA_PRODUCCION=SI');

  const respaldo = entorno.SEED_MINIMA_OPERATIVA_RESPALDO_VERIFICADO || '';
  if (!RESPALDO_ESPERADO.test(respaldo)) throw new Error('Declara un respaldo verificable con SEED_MINIMA_OPERATIVA_RESPALDO_VERIFICADO=pblindadas_antes_demo36_YYYYMMDD_HHMMSS');
  const respaldos = await cliente.$queryRaw<Array<{ existe: boolean }>>(Prisma.sql`SELECT EXISTS(SELECT 1 FROM pg_database WHERE datname=${respaldo}) AS existe`);
  if (!respaldos[0]?.existe) throw new Error(`El respaldo declarado ${respaldo} no existe en PostgreSQL`);

  const manifiesto = await cliente.parametro_remuneracional.findFirst({ where: { codigo: CODIGO_MANIFIESTO_DEMO } });
  if (!manifiesto) throw new Error('No existe DEMO_UI_MANIFIESTO_V2; no se acredita la base histórica autorizada');
  let firma: { version?: number; meses?: number };
  try { firma = JSON.parse(manifiesto.descripcion || '{}') as { version?: number; meses?: number }; }
  catch { throw new Error('El manifiesto DEMO_UI_MANIFIESTO_V2 no contiene una firma JSON válida'); }
  if (firma.version !== 2 || Number(firma.meses) < 36) throw new Error('El manifiesto no acredita el escenario histórico de 36 meses versión 2');
  const raices = await cliente.usuario.count({ where: { administrador_original: true } });
  if (raices !== 1) throw new Error(`Se esperaba exactamente una cuenta raíz Midas; se encontraron ${raices}`);
  const migraciones = await estadoMigraciones(cliente);
  if (migraciones.fallidas !== 0 || migraciones.aplicadas < 82) throw new Error(`Migraciones inconsistentes: ${migraciones.aplicadas} aplicadas y ${migraciones.fallidas} fallidas`);
  return { base, respaldo, manifiesto: { id: manifiesto.id_parametro_remuneracional, version: firma.version, meses: firma.meses }, migraciones };
}

async function existePrecioProducto(cliente: Cliente, producto: number, segmento: string, moneda: number) {
  return Boolean(await cliente.precio_producto_comercial.findFirst({ where: { id_extension_producto_comercial: producto, segmento_comercial: segmento, id_moneda: moneda, vigencia_desde: VIGENCIA_DESDE } }));
}

async function asegurarParametroLegal(
  tx: Prisma.TransactionClient,
  contador: ContadorCambios,
  definicion: { codigo: string; tipo: string; nombre: string; descripcion: string; valor: string; unidad: string; desde: Date; hasta: Date; fuente: string; referencia: string },
) {
  const coincidentes = await tx.parametro_remuneracional.findMany({
    where: { codigo: definicion.codigo, estado: 'activo', vigencia_desde: { lte: definicion.hasta }, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: definicion.desde } }] },
  });
  if (coincidentes.length > 1) throw new Error(`Existen vigencias superpuestas para ${definicion.codigo}`);
  if (coincidentes.length === 1) {
    const actual = coincidentes[0];
    if (actual.valor === null || !actual.valor.equals(definicion.valor) || actual.unidad !== definicion.unidad) {
      throw new Error(`${definicion.codigo} ya existe con un valor o unidad diferente; requiere revisión humana`);
    }
    return actual;
  }
  const creado = await tx.parametro_remuneracional.create({ data: {
    codigo: definicion.codigo, tipo: definicion.tipo, nombre: definicion.nombre, descripcion: definicion.descripcion,
    valor: new Prisma.Decimal(definicion.valor), unidad: definicion.unidad, vigencia_desde: definicion.desde,
    vigencia_hasta: definicion.hasta, fuente: definicion.fuente, referencia: definicion.referencia, estado: 'activo',
  } });
  sumar(contador, 'parametro_remuneracional');
  return creado;
}

async function asegurarNormativaNoviembre2026(tx: Prisma.TransactionClient, contador: ContadorCambios) {
  await asegurarParametroLegal(tx, contador, {
    codigo: 'UF_CLP', tipo: 'LEGAL', nombre: 'Valor UF para remuneraciones — noviembre 2026',
    descripcion: 'Valor de la UF al último día del período mensual de remuneración.', valor: CATALOGO_MINIMO.remuneraciones.ufNoviembre2026,
    unidad: 'CLP_POR_UF', desde: NOVIEMBRE_2026_DESDE, hasta: NOVIEMBRE_2026_HASTA, fuente: FUENTE_SII_UF_2026, referencia: REFERENCIA_SII_UF_2026,
  });
  await asegurarParametroLegal(tx, contador, {
    codigo: 'BH_TASA_RETENCION_PPM', tipo: 'TRIBUTARIO', nombre: 'Retención y PPM boletas de honorarios 2026',
    descripcion: 'Tasa oficial aplicable desde el 1 de enero de 2026.', valor: CATALOGO_MINIMO.remuneraciones.retencionHonorarios2026,
    unidad: 'FACTOR_DECIMAL', desde: new Date('2026-01-01T00:00:00.000Z'), hasta: new Date('2026-12-31T00:00:00.000Z'),
    fuente: FUENTE_SII_HONORARIOS_2026, referencia: REFERENCIA_SII_HONORARIOS_2026,
  });

  const existentes = await tx.tramo_impuesto_renta.findMany({ where: {
    estado: 'activo', vigencia_desde: { lte: NOVIEMBRE_2026_HASTA }, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: NOVIEMBRE_2026_DESDE } }],
  }, orderBy: { orden: 'asc' } });
  if (existentes.length && existentes.length !== CATALOGO_MINIMO.remuneraciones.tramosNoviembre2026.length) {
    throw new Error('La tabla tributaria vigente para noviembre de 2026 existe parcialmente o se superpone con otra vigencia');
  }
  if (existentes.length) {
    for (const esperado of CATALOGO_MINIMO.remuneraciones.tramosNoviembre2026) {
      const actual = existentes.find(item => item.orden === esperado.orden);
      if (!actual || actual.unidad !== 'CLP' || !actual.limite_desde.equals(esperado.desde)
        || (esperado.hasta === null ? actual.limite_hasta !== null : !actual.limite_hasta?.equals(esperado.hasta))
        || !actual.factor.equals(esperado.factor) || !actual.rebaja.equals(esperado.rebaja)) {
        throw new Error(`El tramo tributario ${esperado.orden} de noviembre de 2026 difiere de la tabla oficial`);
      }
    }
    return;
  }
  for (const tramo of CATALOGO_MINIMO.remuneraciones.tramosNoviembre2026) {
    await tx.tramo_impuesto_renta.create({ data: {
      vigencia_desde: NOVIEMBRE_2026_DESDE, vigencia_hasta: NOVIEMBRE_2026_HASTA, orden: tramo.orden,
      limite_desde: new Prisma.Decimal(tramo.desde), limite_hasta: tramo.hasta === null ? null : new Prisma.Decimal(tramo.hasta),
      factor: new Prisma.Decimal(tramo.factor), rebaja: new Prisma.Decimal(tramo.rebaja), unidad: 'CLP',
      fuente: FUENTE_SII_IMPUESTO_2026, referencia: REFERENCIA_SII_IMPUESTO_2026, estado: 'activo',
    } });
    sumar(contador, 'tramo_impuesto_renta');
  }
}

async function construirPlan(cliente: Cliente): Promise<AccionPlan[]> {
  validarDefinicionCatalogoMinimo();
  const acciones: AccionPlan[] = [];
  for (const familia of CATALOGO_MINIMO.familias) acciones.push({ modulo: 'M2', entidad: 'familia_producto_comercial', clave: familia.codigo, accion: await cliente.familia_producto_comercial.count({ where: { codigo: familia.codigo } }) ? 'CONSERVAR' : 'CREAR' });
  for (const producto of CATALOGO_MINIMO.productos) acciones.push({ modulo: 'M2', entidad: 'extension_producto_comercial', clave: producto.codigo, accion: await cliente.extension_producto_comercial.count({ where: { codigo_comercial: producto.codigo } }) ? 'CONSERVAR' : 'CREAR' });
  for (const opcional of CATALOGO_MINIMO.opcionales) acciones.push({ modulo: 'M2', entidad: 'opcional_comercial', clave: opcional.codigo, accion: await cliente.opcional_comercial.count({ where: { codigo: opcional.codigo } }) ? 'CONSERVAR' : 'CREAR' });
  for (const servicio of CATALOGO_MINIMO.servicios) acciones.push({ modulo: 'M2', entidad: 'servicio_comercial', clave: servicio.codigo, accion: await cliente.servicio_comercial.count({ where: { codigo: servicio.codigo } }) ? 'CONSERVAR' : 'CREAR' });
  for (const condicion of CATALOGO_MINIMO.condiciones) acciones.push({ modulo: 'M2', entidad: 'condicion_comercial', clave: condicion.codigo, accion: await cliente.condicion_comercial.count({ where: { codigo: condicion.codigo } }) ? 'CONSERVAR' : 'CREAR' });
  for (const nombre of CATALOGO_MINIMO.categoriasPago) acciones.push({ modulo: 'M3', entidad: 'categoria_pago', clave: nombre, accion: await cliente.categoria_pago.count({ where: { nombre } }) ? 'CONSERVAR' : 'CREAR' });
  for (const cantidad of CATALOGO_MINIMO.cuotas) acciones.push({ modulo: 'M3', entidad: 'config_cuotas_tarjeta', clave: String(cantidad), accion: await cliente.config_cuotas_tarjeta.count({ where: { cantidad } }) ? 'CONSERVAR' : 'CREAR' });
  for (const moneda of CATALOGO_MINIMO.monedas) acciones.push({ modulo: 'Finanzas', entidad: 'moneda', clave: moneda.codigo, accion: await cliente.moneda.count({ where: { codigo_moneda: moneda.codigo } }) ? 'CONSERVAR' : 'CREAR' });
  for (const medio of CATALOGO_MINIMO.mediosPago) acciones.push({ modulo: 'M3/M5/M6', entidad: 'medio_pago', clave: medio.codigo, accion: await cliente.medio_pago.count({ where: { nombre_medio_pago: medio.nombre } }) ? 'CONSERVAR' : 'CREAR' });
  for (const nombre of CATALOGO_MINIMO.inventario.unidades) acciones.push({ modulo: 'Inventario', entidad: 'material_unidad_medida', clave: nombre, accion: await cliente.material_unidad_medida.count({ where: { material_unidad_medida_nombre: nombre } }) ? 'CONSERVAR' : 'CREAR' });
  for (const nombre of CATALOGO_MINIMO.inventario.categoriasGenerales) acciones.push({ modulo: 'Inventario', entidad: 'material_categoria_general', clave: nombre, accion: await cliente.material_categoria_general.count({ where: { material_categoria_general_nombre: nombre } }) ? 'CONSERVAR' : 'CREAR' });
  for (const nombre of CATALOGO_MINIMO.inventario.categoriasFuncionales) acciones.push({ modulo: 'Inventario', entidad: 'material_categoria_funcional', clave: nombre, accion: await cliente.material_categoria_funcional.count({ where: { material_categoria_funcional_nombre: nombre } }) ? 'CONSERVAR' : 'CREAR' });
  acciones.push({ modulo: 'M6', entidad: 'parametros_legales', clave: 'NOVIEMBRE_2026', accion: await cliente.tramo_impuesto_renta.count({ where: { vigencia_desde: NOVIEMBRE_2026_DESDE } }) === 8 ? 'CONSERVAR' : 'CREAR', motivo: 'Valores oficiales SII: UF mensual, retención de honorarios y tabla de impuesto único.' });
  acciones.push({ modulo: 'M2', entidad: 'tarifa_instalacion_comercial', clave: 'COBERTURA_EMPRESARIAL', accion: 'PENDIENTE_CONFIGURACION', motivo: 'No se inventa disponibilidad ni precio oficial de instalación; se crea sólo una referencia REQUIERE_EVALUACION.' });
  return acciones;
}

async function aplicarCatalogos(tx: Prisma.TransactionClient, actor: bigint): Promise<ContadorCambios> {
  const contador: ContadorCambios = { creados: 0, porEntidad: {} };
  for (const definicion of CATALOGO_MINIMO.monedas) {
    const existente = await tx.moneda.findUnique({ where: { codigo_moneda: definicion.codigo } });
    if (!existente) {
      await tx.moneda.create({ data: { codigo_moneda: definicion.codigo, nombre_moneda: definicion.nombre, simbolo_moneda: definicion.simbolo, estado_moneda: 'activo' } });
      sumar(contador, 'moneda');
    } else if (existente.estado_moneda !== 'activo') throw new Error(`La moneda ${definicion.codigo} existe pero está inactiva; no se reactivará automáticamente`);
  }
  const moneda = await tx.moneda.findUniqueOrThrow({ where: { codigo_moneda: 'CLP' } });

  for (const definicion of CATALOGO_MINIMO.mediosPago) {
    const existente = await tx.medio_pago.findUnique({ where: { nombre_medio_pago: definicion.nombre } });
    if (!existente) {
      await tx.medio_pago.create({ data: { nombre_medio_pago: definicion.nombre, codigo_medio_pago: definicion.codigo, requiere_respaldo: definicion.requiereRespaldo, descripcion_medio_pago: 'Configuración mínima transversal para M3, M5 y M6.' } });
      sumar(contador, 'medio_pago');
      continue;
    }
    if (existente.estado_medio_pago !== 'activo') throw new Error(`El medio de pago ${definicion.nombre} existe pero está inactivo; requiere revisión humana`);
    if (existente.codigo_medio_pago && existente.codigo_medio_pago !== definicion.codigo) throw new Error(`El medio ${definicion.nombre} usa el código ${existente.codigo_medio_pago}; no será reemplazado automáticamente`);
    const completarCodigo = existente.codigo_medio_pago === null;
    const completarRespaldo = existente.requiere_respaldo === null;
    if (completarCodigo || completarRespaldo) {
      await tx.medio_pago.update({ where: { id_medio_pago: existente.id_medio_pago }, data: {
        codigo_medio_pago: completarCodigo ? definicion.codigo : undefined,
        requiere_respaldo: completarRespaldo ? definicion.requiereRespaldo : undefined,
      } });
      sumar(contador, 'medio_pago_configurado');
    }
  }

  await asegurarNormativaNoviembre2026(tx, contador);

  const familias = new Map<string, number>();
  for (const definicion of CATALOGO_MINIMO.familias) {
    let fila = await tx.familia_producto_comercial.findUnique({ where: { codigo: definicion.codigo } });
    if (!fila) { fila = await tx.familia_producto_comercial.create({ data: { codigo: definicion.codigo, nombre: definicion.nombre, descripcion: descripcionDemo, creado_por: actor, actualizado_por: actor } }); sumar(contador, 'familia_producto_comercial'); }
    familias.set(definicion.codigo, fila.id_familia_producto_comercial);
  }

  const productos = new Map<string, number>();
  for (const definicion of CATALOGO_MINIMO.productos) {
    let item = await tx.item_comercial.findFirst({ where: { nombre_item: definicion.itemExistente, estado_item: 'activo' } });
    if (!item) { item = await tx.item_comercial.create({ data: { nombre_item: `${definicion.codigo} | ${definicion.nombre}`, descripcion_item: descripcionDemo, tipo_item: 'PUERTA', estado_item: 'activo' } }); sumar(contador, 'item_comercial'); }
    let producto = await tx.extension_producto_comercial.findUnique({ where: { codigo_comercial: definicion.codigo } });
    if (!producto) {
      producto = await tx.extension_producto_comercial.create({ data: {
        codigo_comercial: definicion.codigo, nombre_comercial: definicion.nombre, id_familia_producto_comercial: familias.get(definicion.familia)!,
        tipo_producto: 'PUERTA', descripcion_general: descripcionDemo, descripcion_b2b: definicion.descripcionB2b, descripcion_b2c: definicion.descripcionB2c,
        garantia_referencial: 'Pendiente de definición comercial; no se publica una garantía ficticia.', condiciones_particulares: descripcionDemo,
        caracteristicas_destacadas: ['Producto demostrativo', 'Configuración referencial'], caracteristicas_tecnicas: { estado: 'PENDIENTE_VALIDACION_TECNICA' },
        estado: 'VINCULADO', id_item_comercial: item.id_item_comercial, numero_version_vigente: 1, creado_por: actor, actualizado_por: actor,
      } }); sumar(contador, 'extension_producto_comercial');
    }
    productos.set(definicion.codigo, producto.id_extension_producto_comercial);
    if (!await tx.producto_comercial_version.findUnique({ where: { id_extension_producto_comercial_numero_version: { id_extension_producto_comercial: producto.id_extension_producto_comercial, numero_version: 1 } } })) {
      const familia = CATALOGO_MINIMO.familias.find(x => x.codigo === definicion.familia)!;
      await tx.producto_comercial_version.create({ data: {
        id_extension_producto_comercial: producto.id_extension_producto_comercial, numero_version: 1, codigo_comercial: definicion.codigo,
        nombre_comercial: definicion.nombre, id_familia_producto_comercial: familias.get(definicion.familia)!, codigo_familia: familia.codigo,
        nombre_familia: familia.nombre, tipo_producto: 'PUERTA', descripcion_general: descripcionDemo, descripcion_b2b: definicion.descripcionB2b,
        descripcion_b2c: definicion.descripcionB2c, garantia_referencial: 'Pendiente de definición comercial', condiciones_particulares: descripcionDemo,
        caracteristicas_destacadas: ['Producto demostrativo', 'Configuración referencial'], caracteristicas_tecnicas: { estado: 'PENDIENTE_VALIDACION_TECNICA' },
        id_item_comercial: item.id_item_comercial, vigencia_desde: VIGENCIA_DESDE, motivo: 'Seed mínima operativa demostrativa', usuario_id_usuario: actor,
      } }); sumar(contador, 'producto_comercial_version');
    }
    for (const [segmento, monto] of [['B2B', definicion.precioB2b], ['B2C', definicion.precioB2c]] as const) if (!await existePrecioProducto(tx, producto.id_extension_producto_comercial, segmento, moneda.id_moneda)) {
      await tx.precio_producto_comercial.create({ data: { id_extension_producto_comercial: producto.id_extension_producto_comercial, segmento_comercial: segmento, id_moneda: moneda.id_moneda, monto: new Prisma.Decimal(monto), vigencia_desde: VIGENCIA_DESDE, motivo: 'Precio referencial ficticio DEMO-CAT; requiere autorización antes de uso comercial real', creado_por: actor } }); sumar(contador, 'precio_producto_comercial');
    }
  }

  const opcionales = new Map<string, bigint>();
  for (const definicion of CATALOGO_MINIMO.opcionales) {
    let fila = await tx.opcional_comercial.findUnique({ where: { codigo: definicion.codigo } });
    if (!fila) { fila = await tx.opcional_comercial.create({ data: { codigo: definicion.codigo, nombre: definicion.nombre, descripcion_b2b: descripcionDemo, descripcion_b2c: descripcionDemo, creado_por: actor } }); sumar(contador, 'opcional_comercial'); }
    opcionales.set(definicion.codigo, fila.id_opcional_comercial);
    for (const [segmento, monto] of [['B2B', definicion.precioB2b], ['B2C', definicion.precioB2c]] as const) if (!await tx.precio_opcional_comercial.findFirst({ where: { id_opcional_comercial: fila.id_opcional_comercial, segmento_comercial: segmento, id_moneda: moneda.id_moneda, vigencia_desde: VIGENCIA_DESDE } })) {
      await tx.precio_opcional_comercial.create({ data: { id_opcional_comercial: fila.id_opcional_comercial, segmento_comercial: segmento, id_moneda: moneda.id_moneda, monto: new Prisma.Decimal(monto), vigencia_desde: VIGENCIA_DESDE, motivo: 'Precio referencial ficticio DEMO-CAT', creado_por: actor } }); sumar(contador, 'precio_opcional_comercial');
    }
  }
  for (const idProducto of productos.values()) for (const idOpcional of opcionales.values()) if (!await tx.compatibilidad_opcional_producto.findUnique({ where: { id_extension_producto_comercial_id_opcional_comercial: { id_extension_producto_comercial: idProducto, id_opcional_comercial: idOpcional } } })) {
    await tx.compatibilidad_opcional_producto.create({ data: { id_extension_producto_comercial: idProducto, id_opcional_comercial: idOpcional, habilitado_b2b: true, habilitado_b2c: true, condiciones_compatibilidad: 'Compatibilidad demostrativa; validar técnicamente antes de fabricación.' } }); sumar(contador, 'compatibilidad_opcional_producto');
  }

  for (const definicion of CATALOGO_MINIMO.servicios) {
    let fila = await tx.servicio_comercial.findUnique({ where: { codigo: definicion.codigo } });
    if (!fila) { fila = await tx.servicio_comercial.create({ data: { codigo: definicion.codigo, nombre: definicion.nombre, descripcion: descripcionDemo, unidad_cobro: definicion.unidad, habilitado_b2b: true, habilitado_b2c: true, creado_por: actor } }); sumar(contador, 'servicio_comercial'); }
    for (const [segmento, monto] of [['B2B', definicion.precioB2b], ['B2C', definicion.precioB2c]] as const) if (!await tx.precio_servicio_comercial.findFirst({ where: { id_servicio_comercial: fila.id_servicio_comercial, segmento_comercial: segmento, id_moneda: moneda.id_moneda, vigencia_desde: VIGENCIA_DESDE } })) {
      await tx.precio_servicio_comercial.create({ data: { id_servicio_comercial: fila.id_servicio_comercial, segmento_comercial: segmento, id_moneda: moneda.id_moneda, monto: new Prisma.Decimal(monto), vigencia_desde: VIGENCIA_DESDE, motivo: 'Precio referencial ficticio DEMO-CAT', creado_por: actor } }); sumar(contador, 'precio_servicio_comercial');
    }
  }

  for (const definicion of CATALOGO_MINIMO.condiciones) {
    let condicion = await tx.condicion_comercial.findUnique({ where: { codigo: definicion.codigo } });
    if (!condicion) { condicion = await tx.condicion_comercial.create({ data: { codigo: definicion.codigo, nombre: definicion.nombre, segmento: definicion.segmento, creado_por: actor } }); sumar(contador, 'condicion_comercial'); }
    if (!await tx.condicion_comercial_version.findUnique({ where: { id_condicion_comercial_numero_version: { id_condicion_comercial: condicion.id_condicion_comercial, numero_version: 1 } } })) {
      await tx.condicion_comercial_version.create({ data: { id_condicion_comercial: condicion.id_condicion_comercial, numero_version: 1, contenido: { titulo: definicion.nombre, advertencia: descripcionDemo, condiciones: ['Vigencia, fabricación, pago, entrega y garantías deben ser confirmados por un usuario autorizado antes de uso real.'] }, vigencia_desde: VIGENCIA_DESDE, estado: 'PUBLICADA', motivo: 'Publicación demostrativa explícita para validar el flujo mínimo', publicado_por: actor, publicado_en: new Date() } }); sumar(contador, 'condicion_comercial_version');
    }
  }

  if (!await tx.tarifa_instalacion_comercial.findFirst({ where: { alcance_geografico: 'REGION', region_normalizada: 'region metropolitana de santiago', comuna_normalizada: null, vigencia_desde: VIGENCIA_DESDE } })) {
    await tx.tarifa_instalacion_comercial.create({ data: { alcance_geografico: 'REGION', region: 'Región Metropolitana de Santiago', region_normalizada: 'region metropolitana de santiago', estado_cobertura: 'REQUIERE_EVALUACION', vigencia_desde: VIGENCIA_DESDE, condiciones: 'La instalación no tiene precio automático. Requiere evaluación y autorización comercial.', observaciones: descripcionDemo, creado_por: actor } }); sumar(contador, 'tarifa_instalacion_comercial');
  }

  for (const nombre of CATALOGO_MINIMO.categoriasPago) if (!await tx.categoria_pago.findUnique({ where: { nombre } })) { await tx.categoria_pago.create({ data: { nombre } }); sumar(contador, 'categoria_pago'); }
  for (const cantidad of CATALOGO_MINIMO.cuotas) if (!await tx.config_cuotas_tarjeta.findUnique({ where: { cantidad } })) { await tx.config_cuotas_tarjeta.create({ data: { cantidad } }); sumar(contador, 'config_cuotas_tarjeta'); }
  for (const nombre of CATALOGO_MINIMO.inventario.unidades) if (!await tx.material_unidad_medida.findFirst({ where: { material_unidad_medida_nombre: nombre } })) { await tx.material_unidad_medida.create({ data: { material_unidad_medida_nombre: nombre } }); sumar(contador, 'material_unidad_medida'); }
  for (const nombre of CATALOGO_MINIMO.inventario.categoriasGenerales) if (!await tx.material_categoria_general.findFirst({ where: { material_categoria_general_nombre: nombre } })) { await tx.material_categoria_general.create({ data: { material_categoria_general_nombre: nombre } }); sumar(contador, 'material_categoria_general'); }
  for (const nombre of CATALOGO_MINIMO.inventario.categoriasFuncionales) if (!await tx.material_categoria_funcional.findFirst({ where: { material_categoria_funcional_nombre: nombre } })) { await tx.material_categoria_funcional.create({ data: { material_categoria_funcional_nombre: nombre } }); sumar(contador, 'material_categoria_funcional'); }

  const unidadDefault = await tx.material_unidad_medida.findFirstOrThrow({ where: { material_unidad_medida_nombre: 'Unidad' } });
  const categoriaGeneralDefault = await tx.material_categoria_general.findFirstOrThrow({ where: { material_categoria_general_nombre: 'DEMO-CAT Materiales de fabricación' } });
  const categoriaFuncionalDefault = await tx.material_categoria_funcional.findFirstOrThrow({ where: { material_categoria_funcional_nombre: 'DEMO-CAT Estructura' } });
  const materialesDemo = await tx.material.findMany({ where: { material_sku: { startsWith: 'DEMOUI-MAT-' } }, select: {
    material_sku: true, material_unidad_medida_id_medida: true,
    material_categoria_general_id_categoria_general: true, material_categoria_funcional_id_categoria_funcional: true,
  } });
  for (const material of materialesDemo) {
    const data: Prisma.materialUpdateInput = {};
    if (material.material_unidad_medida_id_medida === null) data.material_unidad_medida = { connect: { material_unidad_medida_id_unidad_medida: unidadDefault.material_unidad_medida_id_unidad_medida } };
    if (material.material_categoria_general_id_categoria_general === null) data.material_categoria_general = { connect: { material_categoria_general_id_categoria_general: categoriaGeneralDefault.material_categoria_general_id_categoria_general } };
    if (material.material_categoria_funcional_id_categoria_funcional === null) data.material_categoria_funcional = { connect: { material_categoria_funcional_id_categoria_funcional: categoriaFuncionalDefault.material_categoria_funcional_id_categoria_funcional } };
    if (Object.keys(data).length) { await tx.material.update({ where: { material_sku: material.material_sku }, data }); sumar(contador, 'material_demo_configurado'); }
  }

  const esquemasDemo = await tx.esquema_remuneracional.findMany({ where: { codigo: { startsWith: 'DEMO-UI-ESQUEMA-' }, estado: 'activo' }, orderBy: { codigo: 'asc' } });
  for (const [indice, esquema] of esquemasDemo.entries()) {
    const tarifaActual = await tx.tarifa_esquema_remuneracional.findFirst({ where: {
      id_esquema: esquema.id_esquema_remuneracional, estado_revision: 'activa', vigencia_desde: { lte: new Date('2026-11-14T00:00:00.000Z') },
      OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: new Date('2026-11-14T00:00:00.000Z') } }],
    } });
    if (!tarifaActual) {
      await tx.tarifa_esquema_remuneracional.create({ data: {
        id_esquema: esquema.id_esquema_remuneracional, modalidad: 'FIJO', valor: new Prisma.Decimal(25000 + indice * 5000),
        referencia: 'DEMO-CAT tarifa ficticia para validar valorización; no es una tarifa empresarial oficial.',
        tipo_aplicacion: 'global', vigencia_desde: new Date('2026-11-14T00:00:00.000Z'), vigencia_hasta: new Date('2026-12-31T00:00:00.000Z'),
        es_excepcion: false, estado_revision: 'activa',
      } });
      sumar(contador, 'tarifa_esquema_remuneracional_demo');
    }
  }

  const conceptosDemo = await tx.concepto_remuneracion.findMany({ where: { codigo_m6: { startsWith: 'DEMO-UI-HABER-' }, estado_concepto: 'activo' }, orderBy: { codigo_m6: 'asc' } });
  for (const [indice, concepto] of conceptosDemo.entries()) {
    const configuracionActual = await tx.configuracion_concepto_remuneracion.findFirst({ where: {
      id_concepto: concepto.id_concepto_remuneracion, activa: true, vigencia_desde: { lte: new Date('2026-11-14T00:00:00.000Z') },
      OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: new Date('2026-11-14T00:00:00.000Z') } }],
    } });
    if (!configuracionActual) {
      await tx.configuracion_concepto_remuneracion.create({ data: {
        id_concepto: concepto.id_concepto_remuneracion, modalidad: 'FIJO', valor: new Prisma.Decimal(10000 + indice * 5000),
        regla_tipo: 'DEMO-CAT-VALOR-REFERENCIAL', vigencia_desde: new Date('2026-11-14T00:00:00.000Z'), vigencia_hasta: new Date('2026-12-31T00:00:00.000Z'),
        es_excepcion: false, activa: true,
      } });
      sumar(contador, 'configuracion_concepto_remuneracion_demo');
    }
  }
  return contador;
}

export async function auditarSeedMinima(cliente: PrismaClient) {
  const [base, migraciones, protegidos, plan, manifiesto, raiz, productosUtilizablesB2b, productosUtilizablesB2c, honorarios, remuneraciones, proveedores, materiales] = await Promise.all([
    nombreBase(cliente), estadoMigraciones(cliente), conteosProtegidos(cliente), construirPlan(cliente),
    cliente.parametro_remuneracional.findFirst({ where: { codigo: CODIGO_MANIFIESTO_DEMO }, select: { id_parametro_remuneracional: true, descripcion: true, estado: true } }),
    cliente.usuario.count({ where: { administrador_original: true } }),
    new ServicioCatalogoComercial().listarProductosCotizacion({ segmento: 'B2B', moneda: 'CLP' }),
    new ServicioCatalogoComercial().listarProductosCotizacion({ segmento: 'B2C', moneda: 'CLP' }),
    cliente.prestador_honorarios.count(), cliente.esquema_remuneracional.count(), cliente.proveedor.count(), cliente.material.count(),
  ]);
  return {
    modo: 'AUDITORIA_SIN_ESCRITURAS', base, migraciones, protegidos, manifiesto: manifiesto ? { presente: true, id: manifiesto.id_parametro_remuneracional, estado: manifiesto.estado, firmaValida: (() => { try { const f = JSON.parse(manifiesto.descripcion || '{}'); return f.version === 2 && Number(f.meses) >= 36; } catch { return false; } })() } : { presente: false }, cuentaRaiz: { cantidad: raiz },
    catalogosActuales: { productosB2bUtilizables: productosUtilizablesB2b.length, productosB2cUtilizables: productosUtilizablesB2c.length, prestadoresHonorarios: honorarios, esquemasRemuneracionales: remuneraciones, proveedores, materiales },
    plan, resumen: { crear: plan.filter(x => x.accion === 'CREAR').length, conservar: plan.filter(x => x.accion === 'CONSERVAR').length, pendientes: plan.filter(x => x.accion === 'PENDIENTE_CONFIGURACION').length },
  };
}

export async function aplicarSeedMinima(cliente: PrismaClient, entorno: NodeJS.ProcessEnv = process.env) {
  validarDefinicionCatalogoMinimo();
  const seguridad = await exigirDestinoSeguro(cliente, entorno);
  const antes = await conteosProtegidos(cliente);
  const resultado = await cliente.$transaction(async tx => {
    await tx.$queryRaw<Array<{ adquirido: boolean }>>(Prisma.sql`
      SELECT true AS adquirido
      FROM (SELECT pg_advisory_xact_lock(2704, 20261115) AS bloqueo) AS candado
    `);
    const actor = await tx.usuario.findFirstOrThrow({ where: { administrador_original: true }, select: { usuario_id_usuario: true } });
    const cambios = await aplicarCatalogos(tx, actor.usuario_id_usuario);
    const durante = await conteosProtegidos(tx);
    if (JSON.stringify(antes) !== JSON.stringify(durante)) throw new Error('La seed intentó alterar conteos históricos o de seguridad protegidos');
    return cambios;
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, timeout: 120000, maxWait: 10000 });
  const despues = await conteosProtegidos(cliente);
  if (JSON.stringify(antes) !== JSON.stringify(despues)) throw new Error('Los conteos protegidos cambiaron después de la seed');
  return { modo: 'APLICACION_PROTEGIDA', seguridad, antes, despues, ...resultado };
}

export async function verificarSeedMinima(cliente: PrismaClient) {
  const catalogo = new ServicioCatalogoComercial();
  const [b2b, b2c, serviciosB2b, serviciosB2c, categorias, cuotas, monedas, medios, uf, honorarios, tramos, materialesSinClasificar, esquemasSinTarifa, conceptosSinConfiguracion] = await Promise.all([
    catalogo.listarProductosCotizacion({ segmento: 'B2B', moneda: 'CLP' }), catalogo.listarProductosCotizacion({ segmento: 'B2C', moneda: 'CLP' }),
    catalogo.listarServicios({ segmento: 'B2B', moneda: 'CLP' }), catalogo.listarServicios({ segmento: 'B2C', moneda: 'CLP' }),
    cliente.categoria_pago.findMany({ where: { nombre: { in: [...CATALOGO_MINIMO.categoriasPago] }, activo: true } }),
    cliente.config_cuotas_tarjeta.findMany({ where: { cantidad: { in: [...CATALOGO_MINIMO.cuotas] }, activo: true } }),
    cliente.moneda.findMany({ where: { codigo_moneda: { in: CATALOGO_MINIMO.monedas.map(item => item.codigo) }, estado_moneda: 'activo' } }),
    cliente.medio_pago.findMany({ where: { nombre_medio_pago: { in: CATALOGO_MINIMO.mediosPago.map(item => item.nombre) }, estado_medio_pago: 'activo', codigo_medio_pago: { not: null }, requiere_respaldo: { not: null } } }),
    cliente.parametro_remuneracional.findMany({ where: { codigo: 'UF_CLP', estado: 'activo', vigencia_desde: { lte: NOVIEMBRE_2026_DESDE }, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: NOVIEMBRE_2026_HASTA } }] } }),
    cliente.parametro_remuneracional.findMany({ where: { codigo: 'BH_TASA_RETENCION_PPM', estado: 'activo', vigencia_desde: { lte: NOVIEMBRE_2026_DESDE }, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: NOVIEMBRE_2026_HASTA } }] } }),
    cliente.tramo_impuesto_renta.findMany({ where: { estado: 'activo', vigencia_desde: { lte: NOVIEMBRE_2026_DESDE }, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: NOVIEMBRE_2026_HASTA } }] } }),
    cliente.material.count({ where: { material_sku: { startsWith: 'DEMOUI-MAT-' }, OR: [{ material_unidad_medida_id_medida: null }, { material_categoria_general_id_categoria_general: null }, { material_categoria_funcional_id_categoria_funcional: null }] } }),
    cliente.esquema_remuneracional.count({ where: { codigo: { startsWith: 'DEMO-UI-ESQUEMA-' }, estado: 'activo', tarifas: { none: { estado_revision: 'activa', vigencia_desde: { lte: new Date('2026-11-14T00:00:00.000Z') }, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: new Date('2026-11-14T00:00:00.000Z') } }] } } } }),
    cliente.concepto_remuneracion.count({ where: { codigo_m6: { startsWith: 'DEMO-UI-HABER-' }, estado_concepto: 'activo', configuraciones_m6: { none: { activa: true, vigencia_desde: { lte: new Date('2026-11-14T00:00:00.000Z') }, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: new Date('2026-11-14T00:00:00.000Z') } }] } } } }),
  ]);
  const fallos: string[] = [];
  if (b2b.filter(x => x.codigo.startsWith(PREFIJO_SEED_MINIMA)).length !== CATALOGO_MINIMO.productos.length) fallos.push('Productos B2B incompletos en el endpoint real');
  if (b2c.filter(x => x.codigo.startsWith(PREFIJO_SEED_MINIMA)).length !== CATALOGO_MINIMO.productos.length) fallos.push('Productos B2C incompletos en el endpoint real');
  if (b2b.some(x => x.codigo.startsWith(PREFIJO_SEED_MINIMA) && x.precio.resultado !== 'VIGENTE')) fallos.push('Existe un producto B2B sin precio vigente');
  if (b2c.some(x => x.codigo.startsWith(PREFIJO_SEED_MINIMA) && x.precio.resultado !== 'VIGENTE')) fallos.push('Existe un producto B2C sin precio vigente');
  if (serviciosB2b.filter(x => x.codigo.startsWith(PREFIJO_SEED_MINIMA) && x.precio.resultado === 'VIGENTE').length !== CATALOGO_MINIMO.servicios.length) fallos.push('Servicios B2B incompletos');
  if (serviciosB2c.filter(x => x.codigo.startsWith(PREFIJO_SEED_MINIMA) && x.precio.resultado === 'VIGENTE').length !== CATALOGO_MINIMO.servicios.length) fallos.push('Servicios B2C incompletos');
  if (categorias.length !== CATALOGO_MINIMO.categoriasPago.length) fallos.push('Categorías de pago incompletas');
  if (cuotas.length !== CATALOGO_MINIMO.cuotas.length) fallos.push('Cuotas de tarjeta incompletas');
  if (monedas.length !== CATALOGO_MINIMO.monedas.length) fallos.push('Monedas operativas incompletas');
  if (medios.length !== CATALOGO_MINIMO.mediosPago.length) fallos.push('Medios de pago transversales incompletos para M3/M5/M6');
  if (uf.length !== 1 || uf[0].valor === null || !uf[0].valor.equals(CATALOGO_MINIMO.remuneraciones.ufNoviembre2026) || uf[0].unidad !== 'CLP_POR_UF') fallos.push('UF de noviembre 2026 ausente, duplicada o inválida');
  if (honorarios.length !== 1 || honorarios[0].valor === null || !honorarios[0].valor.equals(CATALOGO_MINIMO.remuneraciones.retencionHonorarios2026) || honorarios[0].unidad !== 'FACTOR_DECIMAL') fallos.push('Retención de honorarios 2026 ausente, duplicada o inválida');
  if (tramos.length !== 8) fallos.push('Tabla tributaria de noviembre 2026 incompleta o superpuesta');
  if (materialesSinClasificar !== 0) fallos.push('Existen materiales DEMO-UI sin unidad o clasificación mínima');
  if (esquemasSinTarifa !== 0) fallos.push('Existen esquemas DEMO-UI sin tarifa activa actual');
  if (conceptosSinConfiguracion !== 0) fallos.push('Existen conceptos DEMO-UI sin configuración activa actual');
  if (fallos.length) throw new Error(`Verificación de seed mínima fallida:\n- ${fallos.join('\n- ')}`);
  return { estado: 'OK', productosB2b: b2b.length, productosB2c: b2c.length, serviciosB2b: serviciosB2b.length, serviciosB2c: serviciosB2c.length, categoriasPago: categorias.length, cuotas: cuotas.length, monedas: monedas.length, mediosPago: medios.length, tramosNoviembre2026: tramos.length, materialesDemoSinClasificar: materialesSinClasificar, esquemasDemoSinTarifa: esquemasSinTarifa, conceptosDemoSinConfiguracion: conceptosSinConfiguracion };
}

export async function ejecutarSeedMinima(cliente: PrismaClient, modo: ModoSeedMinima, entorno: NodeJS.ProcessEnv = process.env) {
  if (modo === 'audit') return auditarSeedMinima(cliente);
  if (modo === 'dry-run') return { ...(await auditarSeedMinima(cliente)), modo: 'VISTA_PREVIA_SIN_ESCRITURAS' };
  if (modo === 'apply') return aplicarSeedMinima(cliente, entorno);
  if (modo === 'verify') return verificarSeedMinima(cliente);
  throw new Error(`Modo no soportado: ${modo}`);
}
