import { type PrismaClient } from '@prisma/client';
type Consulta = Record<string, unknown>;
/** Consultas del módulo Inventario. Las escrituras permanecen cerradas hasta contar con CU aprobados. */
export declare class MInventarioController {
    private readonly db;
    constructor(db?: PrismaClient);
    consultarResumen(): Promise<{
        materiales: number;
        bodegas: number;
        movimientos: number;
        reservasActivas: number;
        alertasActivas: number;
        existenciasPorUnidad: {
            unidadId: string | null;
            unidad: string | null;
            materialSinUnidad: string | null;
            materiales: number;
            stockFisico: string;
            stockReservado: string;
            stockDisponible: string;
        }[];
    }>;
    listarMateriales(consulta?: Consulta): Promise<{
        pagina: number;
        tamano: number;
        total: number;
        items: {
            sku: string;
            nombre: string | null;
            descripcion: string | null;
            estado: string | null;
            critico: boolean;
            stockMinimo: string;
            stockMaximo: string;
            unidad: string | null;
            categoria: string | null;
            stockFisico: string;
            stockReservado: string;
            stockDisponible: string;
        }[];
    }>;
    obtenerMaterial(sku: string): Promise<{
        sku: string;
        nombre: string | null;
        descripcion: string | null;
        presentacion: string | null;
        estado: string | null;
        critico: boolean;
        stockCritico: string;
        stockMinimo: string;
        stockMaximo: string;
        unidad: string | null;
        categoria: string | null;
        categoriaFuncional: string | null;
        stockFisico: string;
        stockReservado: string;
        stockDisponible: string;
        codigosBarras: string[];
        existencias: {
            bodegaId: string | null;
            bodega: string | null;
            loteId: string | null;
            lote: string | null;
            fisico: string;
            reservado: string;
            disponible: string;
        }[];
    }>;
    listarBodegas(): Promise<{
        id: string | null;
        nombre: string | null;
        direccion: string | null;
        estado: string | null;
        anaqueles: number;
        materiales: number;
        existenciasPorUnidad: {
            unidadId: string | null;
            unidad: string | null;
            materialSinUnidad: string | null;
            materiales: number;
            stockFisico: string;
            stockReservado: string;
            stockDisponible: string;
        }[];
    }[]>;
    catalogosOperacion(): Promise<{
        materiales: {
            sku: string;
            nombre: string | null;
            unidad: string | null;
        }[];
        bodegas: {
            id: string | null;
            nombre: string | null;
            direccion: string | null;
        }[];
        lotes: {
            id: string | null;
            numero: string | null;
            vence: string | null;
            ubicaciones: {
                sku: string;
                bodegaId: string | null;
            }[];
        }[];
        tiposMovimiento: {
            id: string | null;
            nombre: string | null;
        }[];
        motivosMovimiento: {
            id: string | null;
            nombre: string | null;
        }[];
    }>;
    listarMovimientos(consulta?: Consulta): Promise<{
        pagina: number;
        tamano: number;
        total: number;
        items: {
            id: string | null;
            fecha: string | null;
            cantidad: string;
            estado: string | null;
            sku: string | null;
            material: string | null;
            bodega: string | null;
            tipo: string | null;
            motivo: string | null;
            motivoCatalogo: string | null;
        }[];
    }>;
    listarReservas(consulta?: Consulta): Promise<{
        pagina: number;
        tamano: number;
        total: number;
        items: {
            id: string | null;
            fecha: string | null;
            liberadaEn: string | null;
            cantidad: string;
            estado: string | null;
            sku: string | null;
            material: string | null;
            proyectoId: string | null;
            ordenTrabajoId: string | null;
            bodegaId: string | null;
            loteId: string | null;
            ubicacionAcreditada: boolean;
        }[];
    }>;
    listarAlertas(consulta?: Consulta): Promise<{
        pagina: number;
        tamano: number;
        total: number;
        items: {
            id: string | null;
            fecha: string | null;
            agotamientoEstimado: string | null;
            mensaje: string | null;
            estado: string | null;
            resuelta: boolean;
            resueltaEn: string | null;
            sku: string | null;
            material: string | null;
            tipo: string | null;
            prioridad: string | null;
        }[];
    }>;
}
export {};
//# sourceMappingURL=MInventarioController.d.ts.map
