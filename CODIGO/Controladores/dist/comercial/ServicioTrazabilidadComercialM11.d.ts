import { Prisma } from '@prisma/client';
export type EstadoCotejoM11 = 'COINCIDE' | 'DISCREPANCIA' | 'INFORMACION_INSUFICIENTE';
type DetalleAcreditable = {
    id_detalle_cotizacion: number;
    id_cotizacion: number;
};
export type LineaOrdenCompraM11 = {
    numeroLinea: number;
    idDetalleCotizacion: number | null;
    referenciaComercial: string | null;
    concepto: string | null;
    especificaciones: Prisma.InputJsonValue | null;
    cantidad: Prisma.Decimal | null;
    idMoneda: number | null;
    precioUnitario: Prisma.Decimal | null;
    subtotal: Prisma.Decimal | null;
    estadoCotejo: EstadoCotejoM11;
    resultadoCotejo: Prisma.InputJsonValue;
    correspondenciaTecnicaAcreditada: boolean;
    cantidadAcreditada: number | null;
};
type UnidadTecnicaM11 = {
    detalle: number;
    idUnidad: string | number | bigint;
    idOrdenTrabajo: string | number | bigint;
};
export declare function validarCondicionesEconomicasOfertaM11(snapshotOferta: unknown, actual: {
    moneda: string;
    neto: unknown;
    impuesto: unknown;
    total: unknown;
}): {
    estado: EstadoCotejoM11;
    faltantes: string[];
    discrepancias: {
        campo: string;
        actual: unknown;
        oferta: unknown;
    }[];
};
export declare function exigirCotejoAcreditadoM11(cotejo: {
    estado: EstadoCotejoM11;
    resumen: unknown;
}, economia: ReturnType<typeof validarCondicionesEconomicasOfertaM11>): void;
/** Compara identidades estables y exige cobertura uno a uno de toda la oferta aceptada. */
export declare function prepararTrazabilidadOrdenCompraM11(entrada: unknown, idCotizacion: number, detalles: DetalleAcreditable[], snapshotOferta: unknown, monedaOfertaId: number): {
    estado: "INFORMACION_INSUFICIENTE";
    lineas: LineaOrdenCompraM11[];
    resumen: {
        motivo: string;
        faltantesOferta: string[];
        lineasAdicionales: number[];
        totalLineas?: undefined;
        totalLineasOferta?: undefined;
        coinciden?: undefined;
        discrepancias?: undefined;
        insuficientes?: undefined;
        identidadesDuplicadasOferta?: undefined;
        ofertaSinIdentidad?: undefined;
    };
} | {
    estado: EstadoCotejoM11;
    lineas: LineaOrdenCompraM11[];
    resumen: {
        totalLineas: number;
        totalLineasOferta: number;
        coinciden: number;
        discrepancias: number;
        insuficientes: number;
        faltantesOferta: string[];
        lineasAdicionales: number[];
        identidadesDuplicadasOferta: string[];
        ofertaSinIdentidad: number;
        motivo?: undefined;
    };
};
export declare function prepararCorrespondenciasTecnicasM11(lineas: LineaOrdenCompraM11[], unidades: UnidadTecnicaM11[]): {
    numeroLinea: number;
    idDetalleCotizacion: number;
    idUnidad: string | number | bigint;
    idOrdenTrabajo: string | number | bigint;
}[];
export {};
//# sourceMappingURL=ServicioTrazabilidadComercialM11.d.ts.map