import { type SegmentoComercial } from './contratosCatalogoComercial';
type Consulta = Record<string, unknown>;
export declare class ServicioCatalogoComercial {
    listarProductosCotizacion(consulta: Consulta): Promise<{
        idProductoComercial: number;
        idItemComercial: number;
        codigo: string;
        nombre: string;
        familia: {
            id: number;
            codigo: string;
            nombre: string;
        };
        subfamilia: string | null;
        tipo: string | null;
        idProductoComercialVersion: number;
        numeroVersion: number;
        descripcion: string | null;
        caracteristicas: import("@prisma/client/runtime/client").JsonValue;
        caracteristicasTecnicas: import("@prisma/client/runtime/client").JsonValue;
        garantia: string | null;
        condicionesParticulares: string | null;
        estado: string;
        segmento: SegmentoComercial;
        precio: {
            resultado: "VIGENTE";
            id: string;
            monto: number;
            moneda: string;
            vigenciaDesde: string | null;
            vigenciaHasta: string | null;
            version: number;
        } | {
            resultado: "SIN_PRECIO";
            id: null;
            monto: null;
            moneda: null;
            vigenciaDesde: null;
            vigenciaHasta: null;
            version: null;
        };
        opcionales: {
            id: string;
            idCompatibilidad: string;
            codigo: string;
            nombre: string;
            descripcion: string | null;
            condiciones: string | null;
            precio: {
                resultado: "VIGENTE";
                id: string;
                monto: number;
                moneda: string;
                version: number;
            } | {
                resultado: "SIN_PRECIO";
                id: null;
                monto: null;
                moneda: null;
                version: null;
            };
        }[];
        documentos: {
            fotografias: number;
            fotografiaPrincipalDisponible: boolean;
            documentosComerciales: number;
        };
        costosInternosExpuestos: boolean;
    }[]>;
    obtenerProductoCotizacion(idProducto: number, consulta: Consulta): Promise<{
        idProductoComercial: number;
        idItemComercial: number;
        codigo: string;
        nombre: string;
        familia: {
            id: number;
            codigo: string;
            nombre: string;
        };
        subfamilia: string | null;
        tipo: string | null;
        idProductoComercialVersion: number;
        numeroVersion: number;
        descripcion: string | null;
        caracteristicas: import("@prisma/client/runtime/client").JsonValue;
        caracteristicasTecnicas: import("@prisma/client/runtime/client").JsonValue;
        garantia: string | null;
        condicionesParticulares: string | null;
        estado: string;
        segmento: SegmentoComercial;
        precio: {
            resultado: "VIGENTE";
            id: string;
            monto: number;
            moneda: string;
            vigenciaDesde: string | null;
            vigenciaHasta: string | null;
            version: number;
        } | {
            resultado: "SIN_PRECIO";
            id: null;
            monto: null;
            moneda: null;
            vigenciaDesde: null;
            vigenciaHasta: null;
            version: null;
        };
        opcionales: {
            id: string;
            idCompatibilidad: string;
            codigo: string;
            nombre: string;
            descripcion: string | null;
            condiciones: string | null;
            precio: {
                resultado: "VIGENTE";
                id: string;
                monto: number;
                moneda: string;
                version: number;
            } | {
                resultado: "SIN_PRECIO";
                id: null;
                monto: null;
                moneda: null;
                version: null;
            };
        }[];
        documentos: {
            fotografias: number;
            fotografiaPrincipalDisponible: boolean;
            documentosComerciales: number;
        };
        costosInternosExpuestos: boolean;
    }>;
    listarPrecios(consulta: Consulta): Promise<{
        id: string;
        productoId: number;
        producto: string;
        codigoProducto: string;
        familia: string;
        segmento: string;
        monedaId: number;
        moneda: string;
        monto: number;
        vigenciaDesde: string | null;
        vigenciaHasta: string | null;
        estado: string;
        version: number;
        motivo: string | null;
        responsable: string | null;
        creadoEn: string;
        naturaleza: "PRECIO_LISTA";
    }[]>;
    listarServicios(consulta: Consulta): Promise<{
        id: string;
        codigo: string;
        nombre: string;
        descripcion: string | null;
        unidad: string;
        segmento: SegmentoComercial;
        habilitadoB2b: boolean;
        habilitadoB2c: boolean;
        estado: string;
        version: number;
        precio: {
            resultado: "VIGENTE";
            id: string;
            monto: number;
            moneda: string;
            version: number;
            vigenciaDesde: string | null;
            vigenciaHasta: string | null;
        } | {
            resultado: "SIN_PRECIO";
            id: null;
            monto: null;
            moneda: null;
            version: null;
            vigenciaDesde: null;
            vigenciaHasta: null;
        };
        precios: {
            id: string;
            segmento: string;
            monedaId: number;
            moneda: string;
            monto: number;
            vigenciaDesde: string | null;
            vigenciaHasta: string | null;
            estado: string;
            version: number;
            motivo: string | null;
            responsable: string | null;
        }[] | undefined;
    }[]>;
    listarOpcionales(consulta: Consulta): Promise<{
        id: string;
        codigo: string;
        nombre: string;
        descripcionB2b: string | null;
        descripcionB2c: string | null;
        estado: string;
        version: number;
        responsable: string | null;
        creadoEn: string;
        compatibilidades: {
            productoId: number;
            producto: string;
            familia: string;
            b2b: boolean;
            b2c: boolean;
            estado: string;
            condiciones: string | null;
        }[];
        precios: {
            id: string;
            segmento: string;
            moneda: string;
            monto: number;
            vigenciaDesde: string | null;
            vigenciaHasta: string | null;
            estado: string;
            version: number;
            motivo: string | null;
            responsable: string | null;
            creadoEn: string;
        }[];
    }[]>;
    listarTarifas(consulta: Consulta): Promise<{
        id: string;
        alcance: string;
        region: string;
        ciudad: string | null;
        comuna: string | null;
        cobertura: string;
        precio: number | null;
        monedaId: number | null;
        moneda: string | null;
        vigenciaDesde: string | null;
        vigenciaHasta: string | null;
        condiciones: string | null;
        observaciones: string | null;
        estado: string;
        version: number;
        naturaleza: "PRECIO_COMERCIAL_INSTALACION";
        responsable: string | null;
        creadoEn: string;
    }[]>;
    resolverCobertura(consulta: Consulta): Promise<import("./contratosCatalogoComercial").ResolucionCobertura>;
    listarCondiciones(consulta: Consulta): Promise<{
        id: string;
        codigo: string;
        nombre: string;
        segmento: string;
        estado: string;
        revision: number;
        responsable: string | null;
        creadoEn: string;
        versiones: {
            id: string;
            numero: number;
            contenido: import("@prisma/client/runtime/client").JsonValue;
            vigenciaDesde: string | null;
            vigenciaHasta: string | null;
            estado: string;
            motivo: string;
            vigente: boolean;
            publicadoPor: string | null;
            publicadoEn: string | null;
        }[];
    }[]>;
    resumenProducto(idProducto: number, consulta: Consulta): Promise<{
        producto: {
            id: number;
            codigo: string;
            nombre: string;
            familiaId: number;
            familia: string;
            version: number | null;
            descripcionB2b: string | null;
            descripcionB2c: string | null;
            caracteristicas: import("@prisma/client/runtime/client").JsonValue;
            garantia: string | null;
            estado: string;
        };
        segmento: string;
        precio: {
            resultado: string;
            detalle: {
                id: string;
                productoId: number;
                producto: string;
                codigoProducto: string;
                familia: string;
                segmento: string;
                monedaId: number;
                moneda: string;
                monto: number;
                vigenciaDesde: string | null;
                vigenciaHasta: string | null;
                estado: string;
                version: number;
                motivo: string | null;
                responsable: string | null;
                creadoEn: string;
                naturaleza: "PRECIO_LISTA";
            };
        } | {
            resultado: string;
            detalle: null;
        };
        precios: {
            id: string;
            productoId: number;
            producto: string;
            codigoProducto: string;
            familia: string;
            segmento: string;
            monedaId: number;
            moneda: string;
            monto: number;
            vigenciaDesde: string | null;
            vigenciaHasta: string | null;
            estado: string;
            version: number;
            motivo: string | null;
            responsable: string | null;
            creadoEn: string;
            naturaleza: "PRECIO_LISTA";
        }[];
        opcionales: {
            id: string;
            codigo: string;
            nombre: string;
            descripcionB2b: string | null;
            descripcionB2c: string | null;
            estado: string;
            version: number;
            responsable: string | null;
            creadoEn: string;
            compatibilidades: {
                productoId: number;
                producto: string;
                familia: string;
                b2b: boolean;
                b2c: boolean;
                estado: string;
                condiciones: string | null;
            }[];
            precios: {
                id: string;
                segmento: string;
                moneda: string;
                monto: number;
                vigenciaDesde: string | null;
                vigenciaHasta: string | null;
                estado: string;
                version: number;
                motivo: string | null;
                responsable: string | null;
                creadoEn: string;
            }[];
        }[];
        condiciones: {
            id: string;
            codigo: string;
            nombre: string;
            segmento: string;
            estado: string;
            revision: number;
            responsable: string | null;
            creadoEn: string;
            versiones: {
                id: string;
                numero: number;
                contenido: import("@prisma/client/runtime/client").JsonValue;
                vigenciaDesde: string | null;
                vigenciaHasta: string | null;
                estado: string;
                motivo: string;
                vigente: boolean;
                publicadoPor: string | null;
                publicadoEn: string | null;
            }[];
        }[];
        costosInternosExpuestos: boolean;
    }>;
    /** Escrituras cerradas hasta que M4 autorice capacidades comerciales específicas. */
    escrituraNoAutorizada(): never;
}
export {};
//# sourceMappingURL=ServicioCatalogoComercial.d.ts.map