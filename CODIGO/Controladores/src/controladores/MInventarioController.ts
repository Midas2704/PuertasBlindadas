import { prisma } from '../db';
import { ErrorAplicacion } from '../utilidades/ErrorAplicacion';
import { Prisma, type PrismaClient } from '@prisma/client';
import { filtroReservaInventarioActiva } from '../inventario/contratosInventario';

type Consulta = Record<string, unknown>;

const entero = (valor: unknown, defecto: number, minimo: number, maximo: number) => {
  const numero = Number(valor);
  return Number.isInteger(numero) ? Math.min(maximo, Math.max(minimo, numero)) : defecto;
};

const texto = (valor: unknown) => typeof valor === 'string' ? valor.trim() : '';
const decimal = (valor: { toString(): string } | null | undefined) => new Prisma.Decimal(valor?.toString() || 0);
const decimalTexto = (valor: { toString(): string } | null | undefined) => decimal(valor).toFixed(4).replace(/\.?0+$/, '');
const id = (valor: bigint | null | undefined) => valor === null || valor === undefined ? null : valor.toString();

type ExistenciaUnidad = {
  unidadId: string | null;
  unidad: string | null;
  materialSinUnidad: string | null;
  materiales: Set<string>;
  fisico: Prisma.Decimal;
  reservado: Prisma.Decimal;
};

const agruparExistencias = (filas: Array<{
  material_sku: string;
  inventario_bodega_cantidad_fisica: { toString(): string } | null;
  inventario_bodega_cantidad_reservada: { toString(): string } | null;
  material: {
    material_unidad_medida_id_medida: bigint | null;
    material_unidad_medida: { material_unidad_medida_nombre: string | null } | null;
  };
}>) => {
  const grupos = new Map<string, ExistenciaUnidad>();
  for (const fila of filas) {
    const unidadId = id(fila.material.material_unidad_medida_id_medida);
    // Sin unidad acreditada no se suman materiales distintos bajo una unidad ficticia.
    const clave = unidadId === null ? `SIN_UNIDAD:${fila.material_sku}` : `UNIDAD:${unidadId}`;
    const grupo = grupos.get(clave) ?? {
      unidadId,
      unidad: fila.material.material_unidad_medida?.material_unidad_medida_nombre ?? null,
      materialSinUnidad: unidadId === null ? fila.material_sku : null,
      materiales: new Set<string>(),
      fisico: new Prisma.Decimal(0),
      reservado: new Prisma.Decimal(0),
    };
    grupo.materiales.add(fila.material_sku);
    grupo.fisico = grupo.fisico.plus(decimal(fila.inventario_bodega_cantidad_fisica));
    grupo.reservado = grupo.reservado.plus(decimal(fila.inventario_bodega_cantidad_reservada));
    grupos.set(clave, grupo);
  }
  return [...grupos.values()].map(grupo => ({
    unidadId: grupo.unidadId,
    unidad: grupo.unidad,
    materialSinUnidad: grupo.materialSinUnidad,
    materiales: grupo.materiales.size,
    stockFisico: decimalTexto(grupo.fisico),
    stockReservado: decimalTexto(grupo.reservado),
    stockDisponible: decimalTexto(grupo.fisico.minus(grupo.reservado)),
  }));
};

/** Consultas del módulo Inventario. Las escrituras permanecen cerradas hasta contar con CU aprobados. */
export class MInventarioController {
  constructor(private readonly db: PrismaClient = prisma) {}

  async consultarResumen() {
    const [materiales, bodegas, existencias, movimientos, reservasActivas, alertasActivas] = await Promise.all([
      this.db.material.count(),
      this.db.bodega.count(),
      this.db.inventario_bodega.findMany({ select: {
        material_sku: true,
        inventario_bodega_cantidad_fisica: true,
        inventario_bodega_cantidad_reservada: true,
        material: { select: { material_unidad_medida_id_medida: true, material_unidad_medida: { select: { material_unidad_medida_nombre: true } } } },
      } }),
      this.db.movimiento_inventario.count(),
      this.db.reserva_inventario.count({ where: filtroReservaInventarioActiva() }),
      this.db.alerta_inventario.count({ where: { historial_alerta_id_historial: null } }),
    ]);
    return { materiales, bodegas, movimientos, reservasActivas, alertasActivas, existenciasPorUnidad: agruparExistencias(existencias) };
  }

  async listarMateriales(consulta: Consulta = {}) {
    const pagina = entero(consulta.pagina, 1, 1, 100000);
    const tamano = entero(consulta.tamano, 25, 1, 100);
    const busqueda = texto(consulta.busqueda);
    const estado = texto(consulta.estado);
    const where = {
      ...(estado ? { material_estado: estado } : {}),
      ...(busqueda ? { OR: [
        { material_sku: { contains: busqueda, mode: 'insensitive' as const } },
        { material_nombre_material: { contains: busqueda, mode: 'insensitive' as const } },
        { material_descripcion: { contains: busqueda, mode: 'insensitive' as const } },
      ] } : {}),
    };
    const [total, filas] = await Promise.all([
      this.db.material.count({ where }),
      this.db.material.findMany({
        where, skip: (pagina - 1) * tamano, take: tamano,
        orderBy: [{ material_nombre_material: 'asc' }, { material_sku: 'asc' }],
        include: { material_categoria_general: true, material_unidad_medida: true, inventario_bodega: { select: { inventario_bodega_cantidad_fisica: true, inventario_bodega_cantidad_reservada: true } } },
      }),
    ]);
    return { pagina, tamano, total, items: filas.map(fila => {
      const stock = fila.inventario_bodega.reduce((a, existencia) => ({ fisico: a.fisico.plus(decimal(existencia.inventario_bodega_cantidad_fisica)), reservado: a.reservado.plus(decimal(existencia.inventario_bodega_cantidad_reservada)) }), { fisico: new Prisma.Decimal(0), reservado: new Prisma.Decimal(0) });
      return { sku: fila.material_sku, nombre: fila.material_nombre_material, descripcion: fila.material_descripcion, estado: fila.material_estado, critico: fila.material_material_critico === true, stockMinimo: decimalTexto(fila.material_stock_minimo), stockMaximo: decimalTexto(fila.material_sotck_maximo), unidad: fila.material_unidad_medida?.material_unidad_medida_nombre ?? null, categoria: fila.material_categoria_general?.material_categoria_general_nombre ?? null, stockFisico: decimalTexto(stock.fisico), stockReservado: decimalTexto(stock.reservado), stockDisponible: decimalTexto(stock.fisico.minus(stock.reservado)) };
    }) };
  }

  async obtenerMaterial(sku: string) {
    const fila = await this.db.material.findUnique({
      where: { material_sku: sku },
      include: {
        material_categoria_general: true, material_categoria_funcional: true, material_unidad_medida: true,
        inventario_bodega: { include: { bodega: true, lote: true } }, material_codigo_barras: true,
      },
    });
    if (!fila) throw new ErrorAplicacion(404, 'Material no encontrado');
    return {
      sku: fila.material_sku, nombre: fila.material_nombre_material, descripcion: fila.material_descripcion, presentacion: fila.material_presentacion,
      estado: fila.material_estado, critico: fila.material_material_critico === true, stockCritico: decimalTexto(fila.material_stock_critico), stockMinimo: decimalTexto(fila.material_stock_minimo), stockMaximo: decimalTexto(fila.material_sotck_maximo),
      unidad: fila.material_unidad_medida?.material_unidad_medida_nombre ?? null, categoria: fila.material_categoria_general?.material_categoria_general_nombre ?? null, categoriaFuncional: fila.material_categoria_funcional?.material_categoria_funcional_nombre ?? null,
      codigosBarras: fila.material_codigo_barras.map(codigo => codigo.material_codigo_barras),
      existencias: fila.inventario_bodega.map(existencia => ({ bodegaId: id(existencia.bodega_id_bodega), bodega: existencia.bodega.bodega_nombre_bodega, loteId: id(existencia.lote_id_lote), lote: existencia.lote.lote_numero_lote, fisico: decimalTexto(existencia.inventario_bodega_cantidad_fisica), reservado: decimalTexto(existencia.inventario_bodega_cantidad_reservada), disponible: decimalTexto(decimal(existencia.inventario_bodega_cantidad_fisica).minus(decimal(existencia.inventario_bodega_cantidad_reservada))) })),
    };
  }

  async listarBodegas() {
    const filas = await this.db.bodega.findMany({ orderBy: { bodega_nombre_bodega: 'asc' }, include: { inventario_bodega: { select: { inventario_bodega_cantidad_fisica: true, inventario_bodega_cantidad_reservada: true, material_sku: true, material: { select: { material_unidad_medida_id_medida: true, material_unidad_medida: { select: { material_unidad_medida_nombre: true } } } } } }, _count: { select: { anaquel: true } } } });
    return filas.map(fila => ({ id: id(fila.bodega_id_bodega), nombre: fila.bodega_nombre_bodega, direccion: fila.bodega_direccion, estado: fila.bodega_estado, anaqueles: fila._count.anaquel, materiales: new Set(fila.inventario_bodega.map(e => e.material_sku)).size, existenciasPorUnidad: agruparExistencias(fila.inventario_bodega) }));
  }

  async listarMovimientos(consulta: Consulta = {}) {
    const pagina = entero(consulta.pagina, 1, 1, 100000), tamano = entero(consulta.tamano, 25, 1, 100);
    const [total, filas] = await Promise.all([this.db.movimiento_inventario.count(), this.db.movimiento_inventario.findMany({ skip: (pagina - 1) * tamano, take: tamano, orderBy: { movimiento_inventario_fecha_hora: 'desc' }, include: { material: true, bodega: true, movimiento_inventario_tipo_movimiento: true, movimiento_inventario_motivo_movimiento: true } })]);
    return { pagina, tamano, total, items: filas.map(f => ({ id: id(f.movimiento_inventario_id_movimiento), fecha: f.movimiento_inventario_fecha_hora?.toISOString() ?? null, cantidad: decimalTexto(f.movimiento_inventario_cantidad), estado: f.movimiento_inventario_estado, sku: f.material_sku, material: f.material?.material_nombre_material ?? null, bodega: f.bodega?.bodega_nombre_bodega ?? null, tipo: f.movimiento_inventario_tipo_movimiento?.movimiento_inventario_tipo_movimiento_nombre ?? null, motivo: f.movimiento_inventario_motivo_movimiento?.movimiento_inventario_motivo_movimiento_nombre ?? null })) };
  }

  async listarReservas(consulta: Consulta = {}) {
    const pagina = entero(consulta.pagina, 1, 1, 100000), tamano = entero(consulta.tamano, 25, 1, 100);
    const [total, filas] = await Promise.all([this.db.reserva_inventario.count(), this.db.reserva_inventario.findMany({ skip: (pagina - 1) * tamano, take: tamano, orderBy: { reserva_inventario_fecha_reserva: 'desc' }, include: { material: true, proyecto: true, orden_trabajo: true } })]);
    return { pagina, tamano, total, items: filas.map(f => ({ id: id(f.reserva_inventario_id_reserva), fecha: f.reserva_inventario_fecha_reserva?.toISOString() ?? null, liberadaEn: f.reserva_inventario_fecha_liberacion?.toISOString() ?? null, cantidad: decimalTexto(f.reserva_inventario_cantidad_reservada), estado: f.reserva_inventario_estado_reserva, sku: f.material_sku, material: f.material?.material_nombre_material ?? null, proyectoId: id(f.proyecto_id_proyecto), ordenTrabajoId: id(f.orden_trabajo_id_orden), bodegaId:id(f.bodega_id_bodega), loteId:id(f.lote_id_lote), ubicacionAcreditada:f.bodega_id_bodega!==null&&f.lote_id_lote!==null })) };
  }

  async listarAlertas(consulta: Consulta = {}) {
    const pagina = entero(consulta.pagina, 1, 1, 100000), tamano = entero(consulta.tamano, 25, 1, 100);
    const [total, filas] = await Promise.all([this.db.alerta_inventario.count(), this.db.alerta_inventario.findMany({ skip: (pagina - 1) * tamano, take: tamano, orderBy: { alerta_inventario_fecha_generacion: 'desc' }, include: { material: true, alerta_inventario_tipo_alerta: { include: { alerta_inventario_nivel_prioridad: true } }, historial_alerta: true } })]);
    return { pagina, tamano, total, items: filas.map(f => ({ id: id(f.alerta_inventario_id_alerta), fecha: f.alerta_inventario_fecha_generacion?.toISOString() ?? null, agotamientoEstimado: f.alerta_inventario_fecha_est_agotamiento?.toISOString() ?? null, mensaje: f.alerta_inventario_mensaje, estado: f.alerta_inventario_estado, resuelta: f.historial_alerta_id_historial !== null, resueltaEn: f.historial_alerta?.historial_alerta_fecha_hora_resolucion?.toISOString() ?? null, sku: f.material_sku, material: f.material?.material_nombre_material ?? null, tipo: f.alerta_inventario_tipo_alerta?.alerta_inventario_tipo_alerta_nombre ?? null, prioridad: f.alerta_inventario_tipo_alerta?.alerta_inventario_nivel_prioridad?.alerta_inventario_prioridad_nombre ?? null })) };
  }
}
