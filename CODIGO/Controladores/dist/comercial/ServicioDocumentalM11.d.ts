import { Prisma } from '@prisma/client';
type Entrada = Record<string, unknown>;
export type LineaCantidadM11 = {
    idLinea: string;
    cantidad: number;
    moneda?: string | null;
    monto?: number | null;
    compartido?: boolean;
};
type LineaCantidad = LineaCantidadM11;
export type FuenteSalidaAcreditadaM11 = {
    acreditada: true;
    owner: string;
    referencia: string;
    lineas: LineaCantidad[];
} | null;
type DteAcreditableM11 = {
    id_documento_tributario: number;
    id_tipo_documento: number;
    id_documento_referencia: number | null;
    tipo_documento: {
        aplica_venta: boolean;
        estado_tipo_documento: string;
    };
};
export declare function validarCorrectorDteAcreditadoM11(original: DteAcreditableM11, corrector: DteAcreditableM11, ancestrosOriginal: number[]): void;
export declare function conciliarDosEtapasM11(ordenadas: LineaCantidad[], salida: FuenteSalidaAcreditadaM11, facturadas: LineaCantidad[] | null): {
    estado: "DATOS_INSUFICIENTES";
    etapaA: {
        estado: "DATOS_INSUFICIENTES";
        motivo: string;
        diferencias: never[];
        fuente?: undefined;
    };
    etapaB: {
        estado: "DATOS_INSUFICIENTES";
        motivo: string;
        diferencias: never[];
        documentosCompartidosSinDistribucion?: undefined;
    };
    hallazgos: never[];
} | {
    estado: "DISCREPANCIA" | "DATOS_INSUFICIENTES";
    etapaA: {
        estado: "DISCREPANCIA" | "CONFIRMADO";
        fuente: {
            owner: string;
            referencia: string;
        };
        diferencias: Record<string, unknown>[];
        motivo?: undefined;
    };
    etapaB: {
        estado: "DATOS_INSUFICIENTES";
        motivo: string;
        diferencias: never[];
        documentosCompartidosSinDistribucion?: undefined;
    };
    hallazgos: Record<string, unknown>[];
} | {
    estado: "DISCREPANCIA" | "CONFIRMADO" | "PARCIAL";
    etapaA: {
        estado: "DISCREPANCIA" | "CONFIRMADO";
        fuente: {
            owner: string;
            referencia: string;
        };
        diferencias: Record<string, unknown>[];
        motivo?: undefined;
    };
    etapaB: {
        estado: "DISCREPANCIA" | "DATOS_INSUFICIENTES" | "CONFIRMADO";
        documentosCompartidosSinDistribucion: string[];
        diferencias: Record<string, unknown>[];
        motivo?: undefined;
    };
    hallazgos: Record<string, unknown>[];
};
export declare class ServicioDocumentalM11 {
    consultarCadena(idCotizacion: number): Promise<{
        idCotizacion: number;
        ordenCompra: {
            id: number;
            folio: string;
            respaldo: string;
            estado: string;
            relacion: string;
            lineas: {
                id_moneda: number | null;
                referencia_comercial: string | null;
                id_detalle_cotizacion: number | null;
                precio_unitario: Prisma.Decimal | null;
                creado_en: Date;
                cantidad: Prisma.Decimal | null;
                subtotal: Prisma.Decimal | null;
                id_orden_compra_b2b: number;
                estado_cotejo: string;
                resultado_cotejo: Prisma.JsonValue | null;
                id_linea_orden_compra_b2b: bigint;
                numero_linea: number;
                concepto: string | null;
                especificaciones: Prisma.JsonValue | null;
            }[];
        };
        notaVenta: {
            id: number;
            numero: string;
            relacion: string;
        } | null;
        guias: {
            id: number;
            folio: string;
            fecha: Date;
            estado: string;
            relacion: string;
            salidaFisica: string;
        }[];
        documentosTributarios: {
            id: number;
            folio: string;
            tipo: string;
            moneda: string;
            monto: Prisma.Decimal;
            respaldo: string | null;
            estado: string;
            relacion: string;
        }[];
        relacionesDirectasGuiaDte: Array<{
            idGuia: number;
            idDocumentoTributario: number;
            evidencia: string;
        }>;
        eslabones: {
            guiaDespacho: string;
            facturacion: string;
            guiaDteDirecto: string;
            salidaFisica: string;
        };
        advertenciaRelacionDocumental: string;
        advertenciaFisica: string;
    }>;
    consultarConciliacion(idCotizacion: number): Promise<{
        cadena: {
            idCotizacion: number;
            ordenCompra: {
                id: number;
                folio: string;
                respaldo: string;
                estado: string;
                relacion: string;
                lineas: {
                    id_moneda: number | null;
                    referencia_comercial: string | null;
                    id_detalle_cotizacion: number | null;
                    precio_unitario: Prisma.Decimal | null;
                    creado_en: Date;
                    cantidad: Prisma.Decimal | null;
                    subtotal: Prisma.Decimal | null;
                    id_orden_compra_b2b: number;
                    estado_cotejo: string;
                    resultado_cotejo: Prisma.JsonValue | null;
                    id_linea_orden_compra_b2b: bigint;
                    numero_linea: number;
                    concepto: string | null;
                    especificaciones: Prisma.JsonValue | null;
                }[];
            };
            notaVenta: {
                id: number;
                numero: string;
                relacion: string;
            } | null;
            guias: {
                id: number;
                folio: string;
                fecha: Date;
                estado: string;
                relacion: string;
                salidaFisica: string;
            }[];
            documentosTributarios: {
                id: number;
                folio: string;
                tipo: string;
                moneda: string;
                monto: Prisma.Decimal;
                respaldo: string | null;
                estado: string;
                relacion: string;
            }[];
            relacionesDirectasGuiaDte: Array<{
                idGuia: number;
                idDocumentoTributario: number;
                evidencia: string;
            }>;
            eslabones: {
                guiaDespacho: string;
                facturacion: string;
                guiaDteDirecto: string;
                salidaFisica: string;
            };
            advertenciaRelacionDocumental: string;
            advertenciaFisica: string;
        };
        hallazgos: ({
            resoluciones: {
                resultado: string;
                motivo: string;
                respaldo: string;
                creado_en: Date;
                decision: string;
                clave_idempotencia: string;
                actor_id: bigint;
                id_resolucion_hallazgo_m11: bigint;
                id_hallazgo: bigint;
            }[];
        } & {
            estado: string;
            evidencia: Prisma.JsonValue;
            revision: number;
            actualizado_en: Date;
            creado_en: Date;
            clave_idempotencia: string;
            id_orden_compra_b2b: number;
            id_linea_orden_compra_b2b: bigint | null;
            id_hallazgo_discrepancia_m11: bigint;
            etapa: string;
            tipo_discrepancia: string;
            referencias_origen: Prisma.JsonValue;
            contexto: Prisma.JsonValue;
            detectado_por: bigint | null;
        })[];
        fuenteFisica: {
            estado: string;
            contrato: string;
            detalle: string;
        };
        estado: "DATOS_INSUFICIENTES";
        etapaA: {
            estado: "DATOS_INSUFICIENTES";
            motivo: string;
            diferencias: never[];
            fuente?: undefined;
        };
        etapaB: {
            estado: "DATOS_INSUFICIENTES";
            motivo: string;
            diferencias: never[];
            documentosCompartidosSinDistribucion?: undefined;
        };
    } | {
        cadena: {
            idCotizacion: number;
            ordenCompra: {
                id: number;
                folio: string;
                respaldo: string;
                estado: string;
                relacion: string;
                lineas: {
                    id_moneda: number | null;
                    referencia_comercial: string | null;
                    id_detalle_cotizacion: number | null;
                    precio_unitario: Prisma.Decimal | null;
                    creado_en: Date;
                    cantidad: Prisma.Decimal | null;
                    subtotal: Prisma.Decimal | null;
                    id_orden_compra_b2b: number;
                    estado_cotejo: string;
                    resultado_cotejo: Prisma.JsonValue | null;
                    id_linea_orden_compra_b2b: bigint;
                    numero_linea: number;
                    concepto: string | null;
                    especificaciones: Prisma.JsonValue | null;
                }[];
            };
            notaVenta: {
                id: number;
                numero: string;
                relacion: string;
            } | null;
            guias: {
                id: number;
                folio: string;
                fecha: Date;
                estado: string;
                relacion: string;
                salidaFisica: string;
            }[];
            documentosTributarios: {
                id: number;
                folio: string;
                tipo: string;
                moneda: string;
                monto: Prisma.Decimal;
                respaldo: string | null;
                estado: string;
                relacion: string;
            }[];
            relacionesDirectasGuiaDte: Array<{
                idGuia: number;
                idDocumentoTributario: number;
                evidencia: string;
            }>;
            eslabones: {
                guiaDespacho: string;
                facturacion: string;
                guiaDteDirecto: string;
                salidaFisica: string;
            };
            advertenciaRelacionDocumental: string;
            advertenciaFisica: string;
        };
        hallazgos: ({
            resoluciones: {
                resultado: string;
                motivo: string;
                respaldo: string;
                creado_en: Date;
                decision: string;
                clave_idempotencia: string;
                actor_id: bigint;
                id_resolucion_hallazgo_m11: bigint;
                id_hallazgo: bigint;
            }[];
        } & {
            estado: string;
            evidencia: Prisma.JsonValue;
            revision: number;
            actualizado_en: Date;
            creado_en: Date;
            clave_idempotencia: string;
            id_orden_compra_b2b: number;
            id_linea_orden_compra_b2b: bigint | null;
            id_hallazgo_discrepancia_m11: bigint;
            etapa: string;
            tipo_discrepancia: string;
            referencias_origen: Prisma.JsonValue;
            contexto: Prisma.JsonValue;
            detectado_por: bigint | null;
        })[];
        fuenteFisica: {
            estado: string;
            contrato: string;
            detalle: string;
        };
        estado: "DISCREPANCIA" | "DATOS_INSUFICIENTES";
        etapaA: {
            estado: "DISCREPANCIA" | "CONFIRMADO";
            fuente: {
                owner: string;
                referencia: string;
            };
            diferencias: Record<string, unknown>[];
            motivo?: undefined;
        };
        etapaB: {
            estado: "DATOS_INSUFICIENTES";
            motivo: string;
            diferencias: never[];
            documentosCompartidosSinDistribucion?: undefined;
        };
    } | {
        cadena: {
            idCotizacion: number;
            ordenCompra: {
                id: number;
                folio: string;
                respaldo: string;
                estado: string;
                relacion: string;
                lineas: {
                    id_moneda: number | null;
                    referencia_comercial: string | null;
                    id_detalle_cotizacion: number | null;
                    precio_unitario: Prisma.Decimal | null;
                    creado_en: Date;
                    cantidad: Prisma.Decimal | null;
                    subtotal: Prisma.Decimal | null;
                    id_orden_compra_b2b: number;
                    estado_cotejo: string;
                    resultado_cotejo: Prisma.JsonValue | null;
                    id_linea_orden_compra_b2b: bigint;
                    numero_linea: number;
                    concepto: string | null;
                    especificaciones: Prisma.JsonValue | null;
                }[];
            };
            notaVenta: {
                id: number;
                numero: string;
                relacion: string;
            } | null;
            guias: {
                id: number;
                folio: string;
                fecha: Date;
                estado: string;
                relacion: string;
                salidaFisica: string;
            }[];
            documentosTributarios: {
                id: number;
                folio: string;
                tipo: string;
                moneda: string;
                monto: Prisma.Decimal;
                respaldo: string | null;
                estado: string;
                relacion: string;
            }[];
            relacionesDirectasGuiaDte: Array<{
                idGuia: number;
                idDocumentoTributario: number;
                evidencia: string;
            }>;
            eslabones: {
                guiaDespacho: string;
                facturacion: string;
                guiaDteDirecto: string;
                salidaFisica: string;
            };
            advertenciaRelacionDocumental: string;
            advertenciaFisica: string;
        };
        hallazgos: ({
            resoluciones: {
                resultado: string;
                motivo: string;
                respaldo: string;
                creado_en: Date;
                decision: string;
                clave_idempotencia: string;
                actor_id: bigint;
                id_resolucion_hallazgo_m11: bigint;
                id_hallazgo: bigint;
            }[];
        } & {
            estado: string;
            evidencia: Prisma.JsonValue;
            revision: number;
            actualizado_en: Date;
            creado_en: Date;
            clave_idempotencia: string;
            id_orden_compra_b2b: number;
            id_linea_orden_compra_b2b: bigint | null;
            id_hallazgo_discrepancia_m11: bigint;
            etapa: string;
            tipo_discrepancia: string;
            referencias_origen: Prisma.JsonValue;
            contexto: Prisma.JsonValue;
            detectado_por: bigint | null;
        })[];
        fuenteFisica: {
            estado: string;
            contrato: string;
            detalle: string;
        };
        estado: "DISCREPANCIA" | "CONFIRMADO" | "PARCIAL";
        etapaA: {
            estado: "DISCREPANCIA" | "CONFIRMADO";
            fuente: {
                owner: string;
                referencia: string;
            };
            diferencias: Record<string, unknown>[];
            motivo?: undefined;
        };
        etapaB: {
            estado: "DISCREPANCIA" | "DATOS_INSUFICIENTES" | "CONFIRMADO";
            documentosCompartidosSinDistribucion: string[];
            diferencias: Record<string, unknown>[];
            motivo?: undefined;
        };
    }>;
    /** Sólo persiste discrepancias provenientes de una fuente física acreditada; la insuficiencia nunca se convierte en hallazgo. */
    registrarHallazgosAcreditados(idOrdenCompra: number, resultado: ReturnType<typeof conciliarDosEtapasM11>, actorId?: bigint): Promise<{
        estado: string;
        evidencia: Prisma.JsonValue;
        revision: number;
        actualizado_en: Date;
        creado_en: Date;
        clave_idempotencia: string;
        id_orden_compra_b2b: number;
        id_linea_orden_compra_b2b: bigint | null;
        id_hallazgo_discrepancia_m11: bigint;
        etapa: string;
        tipo_discrepancia: string;
        referencias_origen: Prisma.JsonValue;
        contexto: Prisma.JsonValue;
        detectado_por: bigint | null;
    }[]>;
    gestionarCorreccion(entrada: Entrada, actorId: bigint): Promise<{
        tipo_documento: string;
        motivo: string;
        respaldo: string;
        creado_en: Date;
        clave_idempotencia: string;
        actor_id: bigint;
        id_correccion_documental_m11: bigint;
        id_orden_compra_original: number | null;
        id_guia_original: number | null;
        id_guia_correctora: number | null;
        id_documento_original: number | null;
        id_documento_corrector: number | null;
        actuacion: string;
        snapshot_anterior: Prisma.JsonValue;
        snapshot_resultado: Prisma.JsonValue;
    }>;
    consultarHistorial(tipoDocumento: string, idDocumento: number): Promise<{
        tipo: string;
        original: {
            lineas: {
                id_moneda: number | null;
                referencia_comercial: string | null;
                id_detalle_cotizacion: number | null;
                precio_unitario: Prisma.Decimal | null;
                creado_en: Date;
                cantidad: Prisma.Decimal | null;
                subtotal: Prisma.Decimal | null;
                id_orden_compra_b2b: number;
                estado_cotejo: string;
                resultado_cotejo: Prisma.JsonValue | null;
                id_linea_orden_compra_b2b: bigint;
                numero_linea: number;
                concepto: string | null;
                especificaciones: Prisma.JsonValue | null;
            }[];
        } & {
            revision: number;
            id_cotizacion: number;
            folio: string;
            respaldo: string;
            fecha: Date;
            id_orden_compra_b2b: number;
            id_version_oferta_aceptada: number | null;
            estado_cotejo: string;
            resultado_cotejo: Prisma.JsonValue | null;
        };
        correcciones: {
            tipo_documento: string;
            motivo: string;
            respaldo: string;
            creado_en: Date;
            clave_idempotencia: string;
            actor_id: bigint;
            id_correccion_documental_m11: bigint;
            id_orden_compra_original: number | null;
            id_guia_original: number | null;
            id_guia_correctora: number | null;
            id_documento_original: number | null;
            id_documento_corrector: number | null;
            actuacion: string;
            snapshot_anterior: Prisma.JsonValue;
            snapshot_resultado: Prisma.JsonValue;
        }[];
        cadena?: undefined;
    } | {
        tipo: string;
        original: {
            estado: string;
            id_nota_venta: number;
            fecha_emision: Date;
            folio: string;
            antecedentes: Prisma.JsonValue | null;
            id_guia_despacho: number;
        };
        correcciones: {
            tipo_documento: string;
            motivo: string;
            respaldo: string;
            creado_en: Date;
            clave_idempotencia: string;
            actor_id: bigint;
            id_correccion_documental_m11: bigint;
            id_orden_compra_original: number | null;
            id_guia_original: number | null;
            id_guia_correctora: number | null;
            id_documento_original: number | null;
            id_documento_corrector: number | null;
            actuacion: string;
            snapshot_anterior: Prisma.JsonValue;
            snapshot_resultado: Prisma.JsonValue;
        }[];
        cadena?: undefined;
    } | {
        tipo: string;
        original: {
            observacion: string | null;
            id_nota_venta: number | null;
            id_documento_tributario: number;
            id_moneda: number;
            monto_neto: Prisma.Decimal;
            monto_impuesto: Prisma.Decimal;
            id_ficha_cliente: number;
            fecha_emision: Date;
            fecha_vencimiento: Date | null;
            id_tipo_documento: number;
            monto_total: Prisma.Decimal;
            estado_documento: string;
            respaldo_documento: string | null;
            id_documento_referencia: number | null;
            folio_documento: string;
            fecha_anulacion: Date | null;
        };
        cadena: {
            observacion: string | null;
            id_nota_venta: number | null;
            id_documento_tributario: number;
            id_moneda: number;
            monto_neto: Prisma.Decimal;
            monto_impuesto: Prisma.Decimal;
            id_ficha_cliente: number;
            fecha_emision: Date;
            fecha_vencimiento: Date | null;
            id_tipo_documento: number;
            monto_total: Prisma.Decimal;
            estado_documento: string;
            respaldo_documento: string | null;
            id_documento_referencia: number | null;
            folio_documento: string;
            fecha_anulacion: Date | null;
        }[];
        correcciones: {
            tipo_documento: string;
            motivo: string;
            respaldo: string;
            creado_en: Date;
            clave_idempotencia: string;
            actor_id: bigint;
            id_correccion_documental_m11: bigint;
            id_orden_compra_original: number | null;
            id_guia_original: number | null;
            id_guia_correctora: number | null;
            id_documento_original: number | null;
            id_documento_corrector: number | null;
            actuacion: string;
            snapshot_anterior: Prisma.JsonValue;
            snapshot_resultado: Prisma.JsonValue;
        }[];
    }>;
    resolverHallazgo(idHallazgo: bigint, entrada: Entrada, actorId: bigint): Promise<{
        resultado: string;
        motivo: string;
        respaldo: string;
        creado_en: Date;
        decision: string;
        clave_idempotencia: string;
        actor_id: bigint;
        id_resolucion_hallazgo_m11: bigint;
        id_hallazgo: bigint;
    }>;
}
export {};
//# sourceMappingURL=ServicioDocumentalM11.d.ts.map