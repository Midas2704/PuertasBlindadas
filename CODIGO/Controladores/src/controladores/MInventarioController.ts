import { prisma } from '../db';
import { ErrorAplicacion } from '../utilidades/ErrorAplicacion';
import type { PrismaClient } from '@prisma/client';

type Consulta = Record<string, unknown>;

const entero = (valor: unknown, defecto: number, minimo: number, maximo: number) => {
  const numero = Number(valor);
  return Number.isInteger(numero) ? Math.min(maximo, Math.max(minimo, numero)) : defecto;
};

const texto = (valor: unknown) => typeof valor === 'string' ? valor.trim() : '';
const numero = (valor: { toString(): string } | null | undefined) => Number(valor?.toString() || 0);
const id = (valor: bigint | null | undefined) => valor === null || valor === undefined ? null : valor.toString();

/** Consultas del módulo Inventario. Las escrituras permanecen cerradas hasta contar con CU aprobados. */
export class MInventarioController {
  constructor(private readonly db: PrismaClient = prisma) {}

  async consultarResumen() {
    const [materiales, bodegas, existencias, movimientos, reservasActivas, alertasActivas] = await Promise.all([
      this.db.material.count(),
      this.db.bodega.count(),
      this.db.inventario_bodega.findMany({ select: { inventario_bodega_cantidad_fisica: true, inventario_bodega_cantidad_reservada: true } }),
      this.db.movimiento_inventario.count(),
      this.db.reserva_inventario.count({ where: { reserva_inventario_fecha_liberacion: null } }),
      this.db.alerta_inventario.count({ where: { historial_alerta_id_historial: null } }),
    ]);
    const totales = existencias.reduce((acumulado, fila) => ({
      fisico: acumulado.fisico + numero(fila.inventario_bodega_cantidad_fisica),
      reservado: acumulado.reservado + numero(fila.inventario_bodega_cantidad_reservada),
    }), { fisico: 0, reservado: 0 });
    return { materiales, bodegas, movimientos, reservasActivas, alertasActivas, stockFisico: totales.fisico, stockReservado: totales.reservado, stockDisponible: totales.fisico - totales.reservado };
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
      const stock = fila.inventario_bodega.reduce((a, existencia) => ({ fisico: a.fisico + numero(existencia.inventario_bodega_cantidad_fisica), reservado: a.reservado + numero(existencia.inventario_bodega_cantidad_reservada) }), { fisico: 0, reservado: 0 });
      return { sku: fila.material_sku, nombre: fila.material_nombre_material, descripcion: fila.material_descripcion, estado: fila.material_estado, critico: fila.material_material_critico === true, stockMinimo: numero(fila.material_stock_minimo), stockMaximo: numero(fila.material_sotck_maximo), unidad: fila.material_unidad_medida?.material_unidad_medida_nombre ?? null, categoria: fila.material_categoria_general?.material_categoria_general_nombre ?? null, stockFisico: stock.fisico, stockReservado: stock.reservado, stockDisponible: stock.fisico - stock.reservado };
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
      estado: fila.material_estado, critico: fila.material_material_critico === true, stockCritico: numero(fila.material_stock_critico), stockMinimo: numero(fila.material_stock_minimo), stockMaximo: numero(fila.material_sotck_maximo),
      unidad: fila.material_unidad_medida?.material_unidad_medida_nombre ?? null, categoria: fila.material_categoria_general?.material_categoria_general_nombre ?? null, categoriaFuncional: fila.material_categoria_funcional?.material_categoria_funcional_nombre ?? null,
      codigosBarras: fila.material_codigo_barras.map(codigo => codigo.material_codigo_barras),
      existencias: fila.inventario_bodega.map(existencia => ({ bodegaId: id(existencia.bodega_id_bodega), bodega: existencia.bodega.bodega_nombre_bodega, loteId: id(existencia.lote_id_lote), lote: existencia.lote.lote_numero_lote, fisico: numero(existencia.inventario_bodega_cantidad_fisica), reservado: numero(existencia.inventario_bodega_cantidad_reservada), disponible: numero(existencia.inventario_bodega_cantidad_fisica) - numero(existencia.inventario_bodega_cantidad_reservada) })),
    };
  }

  async listarBodegas() {
    const filas = await this.db.bodega.findMany({ orderBy: { bodega_nombre_bodega: 'asc' }, include: { inventario_bodega: { select: { inventario_bodega_cantidad_fisica: true, inventario_bodega_cantidad_reservada: true, material_sku: true } }, _count: { select: { anaquel: true } } } });
    return filas.map(fila => { const stock = fila.inventario_bodega.reduce((a, e) => ({ fisico: a.fisico + numero(e.inventario_bodega_cantidad_fisica), reservado: a.reservado + numero(e.inventario_bodega_cantidad_reservada) }), { fisico: 0, reservado: 0 }); return { id: id(fila.bodega_id_bodega), nombre: fila.bodega_nombre_bodega, direccion: fila.bodega_direccion, estado: fila.bodega_estado, anaqueles: fila._count.anaquel, materiales: new Set(fila.inventario_bodega.map(e => e.material_sku)).size, stockFisico: stock.fisico, stockReservado: stock.reservado, stockDisponible: stock.fisico - stock.reservado }; });
  }

  async listarMovimientos(consulta: Consulta = {}) {
    const pagina = entero(consulta.pagina, 1, 1, 100000), tamano = entero(consulta.tamano, 25, 1, 100);
    const [total, filas] = await Promise.all([this.db.movimiento_inventario.count(), this.db.movimiento_inventario.findMany({ skip: (pagina - 1) * tamano, take: tamano, orderBy: { movimiento_inventario_fecha_hora: 'desc' }, include: { material: true, bodega: true, movimiento_inventario_tipo_movimiento: true, movimiento_inventario_motivo_movimiento: true } })]);
    return { pagina, tamano, total, items: filas.map(f => ({ id: id(f.movimiento_inventario_id_movimiento), fecha: f.movimiento_inventario_fecha_hora?.toISOString() ?? null, cantidad: numero(f.movimiento_inventario_cantidad), estado: f.movimiento_inventario_estado, sku: f.material_sku, material: f.material?.material_nombre_material ?? null, bodega: f.bodega?.bodega_nombre_bodega ?? null, tipo: f.movimiento_inventario_tipo_movimiento?.movimiento_inventario_tipo_movimiento_nombre ?? null, motivo: f.movimiento_inventario_motivo_movimiento?.movimiento_inventario_motivo_movimiento_nombre ?? null })) };
  }

  async listarReservas(consulta: Consulta = {}) {
    const pagina = entero(consulta.pagina, 1, 1, 100000), tamano = entero(consulta.tamano, 25, 1, 100);
    const [total, filas] = await Promise.all([this.db.reserva_inventario.count(), this.db.reserva_inventario.findMany({ skip: (pagina - 1) * tamano, take: tamano, orderBy: { reserva_inventario_fecha_reserva: 'desc' }, include: { material: true, proyecto: true, orden_trabajo: true } })]);
    return { pagina, tamano, total, items: filas.map(f => ({ id: id(f.reserva_inventario_id_reserva), fecha: f.reserva_inventario_fecha_reserva?.toISOString() ?? null, liberadaEn: f.reserva_inventario_fecha_liberacion?.toISOString() ?? null, cantidad: numero(f.reserva_inventario_cantidad_reservada), estado: f.reserva_inventario_estado_reserva, sku: f.material_sku, material: f.material?.material_nombre_material ?? null, proyectoId: id(f.proyecto_id_proyecto), ordenTrabajoId: id(f.orden_trabajo_id_orden) })) };
  }

  async listarAlertas(consulta: Consulta = {}) {
    const pagina = entero(consulta.pagina, 1, 1, 100000), tamano = entero(consulta.tamano, 25, 1, 100);
    const [total, filas] = await Promise.all([this.db.alerta_inventario.count(), this.db.alerta_inventario.findMany({ skip: (pagina - 1) * tamano, take: tamano, orderBy: { alerta_inventario_fecha_generacion: 'desc' }, include: { material: true, alerta_inventario_tipo_alerta: { include: { alerta_inventario_nivel_prioridad: true } }, historial_alerta: true } })]);
    return { pagina, tamano, total, items: filas.map(f => ({ id: id(f.alerta_inventario_id_alerta), fecha: f.alerta_inventario_fecha_generacion?.toISOString() ?? null, agotamientoEstimado: f.alerta_inventario_fecha_est_agotamiento?.toISOString() ?? null, mensaje: f.alerta_inventario_mensaje, estado: f.alerta_inventario_estado, resuelta: f.historial_alerta_id_historial !== null, resueltaEn: f.historial_alerta?.historial_alerta_fecha_hora_resolucion?.toISOString() ?? null, sku: f.material_sku, material: f.material?.material_nombre_material ?? null, tipo: f.alerta_inventario_tipo_alerta?.alerta_inventario_tipo_alerta_nombre ?? null, prioridad: f.alerta_inventario_tipo_alerta?.alerta_inventario_nivel_prioridad?.alerta_inventario_prioridad_nombre ?? null })) };
  }
}
