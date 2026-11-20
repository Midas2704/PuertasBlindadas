import { Prisma } from '@prisma/client';
import { BancoCentral } from '../utilidades/C_BancoCentral';
type Entrada = Record<string, unknown>;
type Transaccion = Prisma.TransactionClient;
export type SituacionProveedor = 'Vencida' | 'Por vencer' | 'Por pagar' | 'Sin deuda';
export type TipoComputoPago = 'DIAS_CORRIDOS' | 'DIAS_HABILES';
export declare function calcularCostoFinancieroEnvio(costos: Array<{
    moneda: string;
    monto: number;
    equivalenteClp: number | null;
}>): {
    totalesPorMoneda: {
        moneda: string;
        monto: number;
    }[];
    totalClp: number | null;
    conversionPendiente: boolean;
};
export declare function calcularFondoCajaChica(fondo: Prisma.Decimal | number, gastos: Array<{
    monto: Prisma.Decimal | number;
    estado: string;
}>): {
    fondo: number;
    reservado: number;
    aprobado: number;
    disponibleProyectado: number;
};
export declare function sumarDiasHabilesChile(fecha: string, dias: number, feriados?: Set<string>): string;
declare const incluirDocumentos: {
    moneda: true;
    tipo_documento: true;
    asignacion_pago_proveedor: {
        include: {
            pago_proveedor: true;
        };
    };
};
type DocumentoProveedor = Prisma.documento_compra_proveedorGetPayload<{
    include: typeof incluirDocumentos;
}>;
export interface ResumenFinancieroProveedor {
    saldoPendienteTotal: number;
    situacionFinanciera: SituacionProveedor;
    saldosPorMoneda: Array<{
        moneda: string;
        saldoPendiente: number;
    }>;
    obligaciones: Array<{
        id: number;
        numero: string;
        tipo: string;
        moneda: string;
        fechaEmision: Date;
        fechaVencimiento: Date | null;
        estadoPago: 'Pendiente' | 'Parcial' | 'Pagada';
        condicionTemporal: 'Por pagar' | 'Por vencer' | 'Vencida' | null;
        montoTotal: number;
        saldoPendiente: number;
    }>;
}
/** Única fuente para la etiqueta y el filtro financiero de CU80/CU83. */
export declare function calcularResumenFinancieroProveedor(documentos: DocumentoProveedor[], hoy?: string, umbral?: number): ResumenFinancieroProveedor;
/** Calendario laboral chileno mínimo y determinista para vencimientos prospectivos de M5. */
export declare function esDiaHabilChile(fecha: Date): boolean;
export declare function calcularEstadoPagoObligacion(saldoInicial: Prisma.Decimal | number, saldoActual: Prisma.Decimal | number): "Pendiente" | "Parcial" | "Pagada";
export declare function calcularCondicionTemporalObligacion(obligacion: {
    saldo_actual: Prisma.Decimal | number;
    fecha_vencimiento: Date;
}, umbral: number, hoy?: string): "Vencida" | "Por vencer" | "Por pagar" | null;
export interface EfectoPagoObligacion {
    montoOriginal: Prisma.Decimal | number;
    montoAnulado?: Prisma.Decimal | number;
    montoRevertido?: Prisma.Decimal | number;
}
export interface EfectoAjusteObligacion {
    tipo: 'NC' | 'ND';
    monto: Prisma.Decimal | number;
}
export interface EfectoCompensacionObligacion {
    montoAplicado: Prisma.Decimal | number;
    montoRevertido?: Prisma.Decimal | number;
}
export declare function calcularEfectoNetoMovimiento(efecto: EfectoPagoObligacion): Prisma.Decimal;
/** Única fórmula de CU121: saldo inicial menos efectos netos confirmados. */
export declare function calcularSaldoObligacion(montoInicial: Prisma.Decimal | number, efectos: EfectoPagoObligacion[], ajustes?: EfectoAjusteObligacion[], compensaciones?: EfectoCompensacionObligacion[]): Prisma.Decimal;
export declare function derivarEstadoMovimientoPago(efecto: EfectoPagoObligacion): "Anulado" | "Revertido totalmente" | "Revertido parcialmente" | "Vigente";
export declare function derivarEstadoOperacionPago(estados: string[]): "Anulada" | "Revertida totalmente" | "Afectada parcialmente" | "Confirmada";
export declare function calcularFechaVencimientoProveedor(fechaBase: Date, dias: number, tipoComputo: TipoComputoPago): Date;
export declare function calcularResumenOcs(montoAutorizado: Prisma.Decimal | number, efectos?: Array<{
    monto_documentado: Prisma.Decimal | number;
}>): {
    montoAutorizado: number;
    montoDocumentado: number;
    saldoDisponible: number;
};
export declare function ocsTieneEfectosFinancieros(tx: Transaccion, idOcs: number): Promise<boolean>;
export declare function evaluarCierreOcs(montoAutorizado: Prisma.Decimal | number, montoDocumentado: Prisma.Decimal | number, declaracionFinal?: boolean, justificacion?: string): {
    puedeCerrar: boolean;
    automatico: boolean;
    tipo: "monto_exacto";
} | {
    puedeCerrar: boolean;
    automatico: boolean;
    tipo: "requiere_declaracion_final";
} | {
    puedeCerrar: boolean;
    automatico: boolean;
    tipo: "requiere_justificacion";
} | {
    puedeCerrar: boolean;
    automatico: boolean;
    tipo: "final_bajo_autorizado";
} | {
    puedeCerrar: boolean;
    automatico: boolean;
    tipo: "excedente_pendiente_aprobacion";
};
export declare class M5Controller {
    private readonly bancoCentral;
    constructor(bancoCentral?: BancoCentral);
    private umbralM5;
    private resumenObligacionesM5;
    listarCuentasPorPagar(consulta: Record<string, unknown>): Promise<{
        id: number;
        proveedor: {
            id: number;
            razonSocial: string;
            identificadorFiscal: string;
        };
        documento: {
            id: number;
            folio: string;
            tipo: string;
        };
        moneda: string;
        montoOriginal: number;
        saldoActual: number;
        fechaEmision: Date;
        fechaVencimiento: Date;
        condicionTemporal: "Vencida" | "Por vencer" | "Por pagar" | null;
        estadoPago: "Pendiente" | "Parcial" | "Pagada";
        tipoCambio: number | null;
        requiereAtencion: boolean;
    }[]>;
    consultarUmbralM5(): Promise<{
        diasHabiles: number;
        fechaHora: Date | null;
        usuario: string | null;
    }>;
    configurarUmbralM5(entrada: Entrada, usuario: bigint): Promise<{
        valorAnterior: number;
        valorNuevo: number;
        usuario: string;
        fechaHora: Date;
    }>;
    private identidad;
    private duplicado;
    catalogosProveedores(): Promise<{
        paises: {
            id_pais: number;
            nombre_pais: string;
            codigo_iso_pais: string | null;
            estado_pais: string;
        }[];
        tiposIdentificador: {
            id_tipo_identificador: number;
            nombre_tipo_identificador: string;
            descripcion_tipo_identificador: string | null;
            estado_tipo_identificador: string;
        }[];
        tiposProveedor: readonly ["Insumos/Materiales", "Servicios", "Ambos"];
    }>;
    crearProveedor(entrada: Entrada): Promise<{
        mensaje: string;
        proveedor: {
            pais: {
                id_pais: number;
                nombre_pais: string;
                codigo_iso_pais: string | null;
                estado_pais: string;
            } | null;
            tipo_identificador: {
                id_tipo_identificador: number;
                nombre_tipo_identificador: string;
                descripcion_tipo_identificador: string | null;
                estado_tipo_identificador: string;
            };
        } & {
            id_proveedor: number;
            fecha_registro: Date;
            id_pais: number | null;
            id_tipo_identificador: number;
            id_moneda_preferente: number | null;
            identificador_tributario: string;
            nombre_razon_social: string;
            tipo_proveedor_m5: string;
            condicion_pago_dias_m5: number | null;
            condicion_pago_tipo_m5: string | null;
            nacionalidad_origen: string | null;
            contacto_proveedor: string | null;
            correo_proveedor: string | null;
            telefono_proveedor: string | null;
            direccion_proveedor: string | null;
            estado_proveedor: string;
        };
    }>;
    actualizarProveedor(id: number, entrada: Entrada, usuario: bigint): Promise<{
        mensaje: string;
        proveedor: {
            pais: {
                id_pais: number;
                nombre_pais: string;
                codigo_iso_pais: string | null;
                estado_pais: string;
            } | null;
            tipo_identificador: {
                id_tipo_identificador: number;
                nombre_tipo_identificador: string;
                descripcion_tipo_identificador: string | null;
                estado_tipo_identificador: string;
            };
        } & {
            id_proveedor: number;
            fecha_registro: Date;
            id_pais: number | null;
            id_tipo_identificador: number;
            id_moneda_preferente: number | null;
            identificador_tributario: string;
            nombre_razon_social: string;
            tipo_proveedor_m5: string;
            condicion_pago_dias_m5: number | null;
            condicion_pago_tipo_m5: string | null;
            nacionalidad_origen: string | null;
            contacto_proveedor: string | null;
            correo_proveedor: string | null;
            telefono_proveedor: string | null;
            direccion_proveedor: string | null;
            estado_proveedor: string;
        };
    }>;
    corregirIdentidadProveedor(id: number, entrada: Entrada, usuario: bigint): Promise<{
        mensaje: string;
        proveedor: {
            pais: {
                id_pais: number;
                nombre_pais: string;
                codigo_iso_pais: string | null;
                estado_pais: string;
            } | null;
            tipo_identificador: {
                id_tipo_identificador: number;
                nombre_tipo_identificador: string;
                descripcion_tipo_identificador: string | null;
                estado_tipo_identificador: string;
            };
        } & {
            id_proveedor: number;
            fecha_registro: Date;
            id_pais: number | null;
            id_tipo_identificador: number;
            id_moneda_preferente: number | null;
            identificador_tributario: string;
            nombre_razon_social: string;
            tipo_proveedor_m5: string;
            condicion_pago_dias_m5: number | null;
            condicion_pago_tipo_m5: string | null;
            nacionalidad_origen: string | null;
            contacto_proveedor: string | null;
            correo_proveedor: string | null;
            telefono_proveedor: string | null;
            direccion_proveedor: string | null;
            estado_proveedor: string;
        };
    }>;
    private obtenerBloqueosDesactivacionProveedor;
    cambiarEstadoProveedor(id: number, estado: 'activo' | 'inactivo', confirmado: boolean, usuario: bigint): Promise<{
        mensaje: string;
        idProveedor: number;
        estado: "activo" | "inactivo";
    }>;
    listarProveedores(consulta: Record<string, unknown>): Promise<{
        obligaciones: undefined;
        saldoPendienteTotal: number;
        situacionFinanciera: SituacionProveedor;
        saldosPorMoneda: Array<{
            moneda: string;
            saldoPendiente: number;
        }>;
        idProveedor: number;
        identificadorFiscal: string;
        razonSocial: string;
        pais: string;
        tipoIdentificador: string;
        tipoProveedor: string;
        estado: string;
    }[]>;
    abrirFichaProveedor(id: number, consulta?: Record<string, unknown>): Promise<{
        identidad: {
            idProveedor: number;
            pais: string;
            idPais: number | null;
            tipoIdentificador: string;
            idTipoIdentificador: number;
            identificadorFiscal: string;
            razonSocial: string;
            tipoProveedor: string;
        };
        contacto: {
            nombre: string | null;
            correo: string | null;
            telefono: string | null;
            direccion: string | null;
            correosAdicionales: string[];
            telefonosAdicionales: string[];
        };
        estado: string;
        condicionPago: {
            dias: number;
            tipoComputo: string;
            ultimaActualizacion: Date | null;
        } | null;
        resumenFinanciero: ResumenFinancieroProveedor;
        historial: {
            id: number;
            campo: string;
            valorAnterior: string | null;
            valorNuevo: string | null;
            motivo: string | null;
            fechaHora: Date;
            usuario: string;
        }[];
        antecedentes: {
            documentos: {
                id: number;
                numero: string;
                tipo: string;
                moneda: string;
                fechaEmision: Date;
                fechaVencimiento: Date | null;
                estadoPago: "Pendiente" | "Parcial" | "Pagada";
                condicionTemporal: "Por pagar" | "Por vencer" | "Vencida" | null;
                montoTotal: number;
                saldoPendiente: number;
            }[];
            pagos: {
                id: number;
                fecha: Date;
                monto: number;
                moneda: string;
                estado: string;
            }[];
        };
    }>;
    actualizarCondicionPagoProveedor(id: number, entrada: Entrada, usuario: bigint): Promise<{
        mensaje: string;
        condicionPago: {
            ultimaActualizacion: Date;
            dias: number;
            tipoComputo: TipoComputoPago;
        };
    }>;
    private presentarOcs;
    listarOrdenesCompraServicios(): Promise<{
        tieneEfectosFinancieros: boolean;
        montoAutorizadoOriginal: number;
        idMoneda: number | null;
        moneda: {
            id: number;
            codigo: string;
            nombre: string;
            simbolo: string | null;
        } | null;
        contexto: {
            idFichaCliente: number | null;
            idCotizacion: number | null;
            idProyectoFinanciero: number | null;
            idOrdenTrabajo: string | null;
        };
        fechaEsperadaRecepcion: Date | null;
        materiales: {
            sku: string;
            nombre: string | null;
            cantidadPedida: number;
            cantidadRecibida: number;
            cantidadPendiente: number;
            fechaEsperada: Date | null;
        }[];
        referencia: string | null;
        periodo: string | null;
        descripcion: string | null;
        fechaCreacion: Date;
        fechaActualizacion: Date;
        creadoPor: {
            id: string;
            nombre: string;
        };
        historial: {
            id: number;
            campo: string;
            valorAnterior: string | null;
            valorNuevo: string | null;
            motivo: string | null;
            fechaHora: Date;
            usuario: string;
        }[];
        ajustes: {
            id: number;
            campo: string;
            valorAnterior: string | null;
            valorPropuesto: string | null;
            motivo: string;
            estado: string;
            fechaSolicitud: Date;
            solicitadoPor: string;
            fechaConfirmacion: Date | null;
            confirmadoPor: string | null | undefined;
        }[];
        montoAutorizado: number;
        montoDocumentado: number;
        saldoDisponible: number;
        id: number;
        proveedor: {
            id: number;
            razonSocial: string;
            estado: string;
        };
        estado: string;
    }[]>;
    listarClientesB2BContextoOcs(consulta: Entrada): Promise<{
        idCliente: number;
        idFichaCliente: number;
        razonSocial: string;
        rut: string | null;
    }[]>;
    obtenerOrdenCompraServicio(id: number): Promise<{
        tieneEfectosFinancieros: boolean;
        montoAutorizadoOriginal: number;
        idMoneda: number | null;
        moneda: {
            id: number;
            codigo: string;
            nombre: string;
            simbolo: string | null;
        } | null;
        contexto: {
            idFichaCliente: number | null;
            idCotizacion: number | null;
            idProyectoFinanciero: number | null;
            idOrdenTrabajo: string | null;
        };
        fechaEsperadaRecepcion: Date | null;
        materiales: {
            sku: string;
            nombre: string | null;
            cantidadPedida: number;
            cantidadRecibida: number;
            cantidadPendiente: number;
            fechaEsperada: Date | null;
        }[];
        referencia: string | null;
        periodo: string | null;
        descripcion: string | null;
        fechaCreacion: Date;
        fechaActualizacion: Date;
        creadoPor: {
            id: string;
            nombre: string;
        };
        historial: {
            id: number;
            campo: string;
            valorAnterior: string | null;
            valorNuevo: string | null;
            motivo: string | null;
            fechaHora: Date;
            usuario: string;
        }[];
        ajustes: {
            id: number;
            campo: string;
            valorAnterior: string | null;
            valorPropuesto: string | null;
            motivo: string;
            estado: string;
            fechaSolicitud: Date;
            solicitadoPor: string;
            fechaConfirmacion: Date | null;
            confirmadoPor: string | null | undefined;
        }[];
        montoAutorizado: number;
        montoDocumentado: number;
        saldoDisponible: number;
        id: number;
        proveedor: {
            id: number;
            razonSocial: string;
            estado: string;
        };
        estado: string;
    }>;
    crearOrdenCompraServicio(entrada: Entrada, usuario: bigint): Promise<{
        tieneEfectosFinancieros: boolean;
        montoAutorizadoOriginal: number;
        idMoneda: number | null;
        moneda: {
            id: number;
            codigo: string;
            nombre: string;
            simbolo: string | null;
        } | null;
        contexto: {
            idFichaCliente: number | null;
            idCotizacion: number | null;
            idProyectoFinanciero: number | null;
            idOrdenTrabajo: string | null;
        };
        fechaEsperadaRecepcion: Date | null;
        materiales: {
            sku: string;
            nombre: string | null;
            cantidadPedida: number;
            cantidadRecibida: number;
            cantidadPendiente: number;
            fechaEsperada: Date | null;
        }[];
        referencia: string | null;
        periodo: string | null;
        descripcion: string | null;
        fechaCreacion: Date;
        fechaActualizacion: Date;
        creadoPor: {
            id: string;
            nombre: string;
        };
        historial: {
            id: number;
            campo: string;
            valorAnterior: string | null;
            valorNuevo: string | null;
            motivo: string | null;
            fechaHora: Date;
            usuario: string;
        }[];
        ajustes: {
            id: number;
            campo: string;
            valorAnterior: string | null;
            valorPropuesto: string | null;
            motivo: string;
            estado: string;
            fechaSolicitud: Date;
            solicitadoPor: string;
            fechaConfirmacion: Date | null;
            confirmadoPor: string | null | undefined;
        }[];
        montoAutorizado: number;
        montoDocumentado: number;
        saldoDisponible: number;
        id: number;
        proveedor: {
            id: number;
            razonSocial: string;
            estado: string;
        };
        estado: string;
    }>;
    modificarOrdenCompraServicio(id: number, entrada: Entrada, usuario: bigint): Promise<{
        tieneEfectosFinancieros: boolean;
        montoAutorizadoOriginal: number;
        idMoneda: number | null;
        moneda: {
            id: number;
            codigo: string;
            nombre: string;
            simbolo: string | null;
        } | null;
        contexto: {
            idFichaCliente: number | null;
            idCotizacion: number | null;
            idProyectoFinanciero: number | null;
            idOrdenTrabajo: string | null;
        };
        fechaEsperadaRecepcion: Date | null;
        materiales: {
            sku: string;
            nombre: string | null;
            cantidadPedida: number;
            cantidadRecibida: number;
            cantidadPendiente: number;
            fechaEsperada: Date | null;
        }[];
        referencia: string | null;
        periodo: string | null;
        descripcion: string | null;
        fechaCreacion: Date;
        fechaActualizacion: Date;
        creadoPor: {
            id: string;
            nombre: string;
        };
        historial: {
            id: number;
            campo: string;
            valorAnterior: string | null;
            valorNuevo: string | null;
            motivo: string | null;
            fechaHora: Date;
            usuario: string;
        }[];
        ajustes: {
            id: number;
            campo: string;
            valorAnterior: string | null;
            valorPropuesto: string | null;
            motivo: string;
            estado: string;
            fechaSolicitud: Date;
            solicitadoPor: string;
            fechaConfirmacion: Date | null;
            confirmadoPor: string | null | undefined;
        }[];
        montoAutorizado: number;
        montoDocumentado: number;
        saldoDisponible: number;
        id: number;
        proveedor: {
            id: number;
            razonSocial: string;
            estado: string;
        };
        estado: string;
    }>;
    private campoAjuste;
    private resolverValorAjuste;
    private valorActualAjuste;
    prepararAjusteOrdenCompraServicio(id: number, entrada: Entrada, usuario: bigint): Promise<{
        id: number;
        idOcs: number;
        campo: string;
        valorAnterior: string | null;
        valorPropuesto: string | null;
        motivo: string;
        estado: string;
        solicitadoPor: string;
        fechaSolicitud: Date;
    }>;
    confirmarAjusteOrdenCompraServicio(id: number, ajusteId: number, usuario: bigint): Promise<{
        mensaje: string;
        id: number;
        idOcs: number;
        estado: string;
        confirmadoPor: string;
        fechaConfirmacion: Date | null;
    }>;
    anularOrdenCompraServicio(id: number, entrada: Entrada, usuario: bigint): Promise<{
        mensaje: string;
        id: number;
        estado: string;
    }>;
    cerrarOrdenCompraServicio(id: number, entrada: Entrada, usuario: bigint): Promise<{
        mensaje: string;
        id: number;
        estado: string;
        tipoCierre: "monto_exacto" | "requiere_declaracion_final" | "requiere_justificacion" | "final_bajo_autorizado" | "excedente_pendiente_aprobacion";
        montoAutorizado: number;
        montoDocumentado: number;
    }>;
    reabrirOrdenCompraServicio(id: number, confirmado: boolean, usuario: bigint): Promise<{
        mensaje: string;
        id: number;
        estado: string;
    }>;
    private presentarDocumentoProveedor;
    private documentoM5;
    private presentarDocumentoM5;
    private registrarDocumentoM5;
    registrarDocumentoPreliminar(entrada: Entrada, usuario: bigint): Promise<{
        id: string;
        idM5: number;
        fuente: string;
        clase: string;
        proveedor: {
            id: number;
            razonSocial: string;
        };
        tipoDocumento: string;
        numero: string;
        fechaEmision: Date;
        fechaVencimiento: Date | null;
        moneda: string;
        montoTotal: number;
        estadoDocumental: string;
        saldoPendiente: number;
        clasificacionM5: string;
        asociacionOrdenCompra: string;
        descripcion: string | null;
        asociaciones: {
            id: number;
            tipoOrden: string;
            idOcs: number | null;
            montoAsignado: number;
            estadoDiferencia: string;
            estadoExcedente: string;
            montoExcedente: number;
            esFinal: boolean;
        }[];
        clasificaciones: {
            id: number;
            idAsociacion: number;
            idCategoria: number;
            categoria: string;
            monto: number;
        }[];
        reclasificaciones: {
            id: number;
            estado: string;
            montoTotal: number;
            umbralSnapshotClp: number;
            motivo: string;
            fecha: Date;
            detalles: {
                idClasificacion: number;
                idCategoriaOrigen: number;
                idCategoriaDestino: number;
                monto: number;
            }[];
        }[];
        propuestaImputacion: {
            id: number;
            estado: string;
            preparadoPor: string;
        } | null;
        imputaciones: {
            id: number;
            idClasificacion: number;
            destino: string;
            idProyecto: string | null;
            idOrdenTrabajo: string | null;
            montoOriginal: number;
            montoVigente: number;
            historialOt: {
                anterior: string | null;
                nueva: string;
                motivo: string;
                fecha: Date;
            }[];
            reasignaciones: {
                id: number;
                estado: string;
                monto: number;
                motivo: string;
                excepcional: boolean;
                detalles: {
                    destino: string;
                    idProyecto: string | null;
                    idOrdenTrabajo: string | null;
                    monto: number;
                }[];
            }[];
        }[];
        progreso: {
            asociaciones: boolean;
            vencimiento: boolean;
            clasificacion: boolean;
            imputacion: string;
            moneda: boolean;
            listoObligacion: boolean;
        };
        obligacion: {
            fecha_generacion: Date;
            id_moneda: number;
            fecha_emision: Date;
            fecha_vencimiento: Date;
            id_proveedor: number;
            saldo_inicial: Prisma.Decimal;
            estado_pago: string;
            id_documento_m5: number;
            condicion_pago_dias_snapshot: number | null;
            condicion_pago_tipo_snapshot: string | null;
            tipo_cambio: Prisma.Decimal | null;
            tipo_cambio_origen: string | null;
            id_obligacion_m5: number;
            monto_original: Prisma.Decimal;
            saldo_actual: Prisma.Decimal;
            condicion_temporal: string | null;
            generado_por: bigint;
        } | null;
        ajuste: {
            id: number;
            tipo: string;
            estado: string;
            idObligacion: number;
            monto: number;
            montoAplicado: number;
            montoSaldoFavor: number;
            fecha: Date;
            motivoAnulacion: string | null;
        } | null;
    }>;
    registrarDocumentoDefinitivo(entrada: Entrada, usuario: bigint): Promise<{
        id: string;
        idM5: number;
        fuente: string;
        clase: string;
        proveedor: {
            id: number;
            razonSocial: string;
        };
        tipoDocumento: string;
        numero: string;
        fechaEmision: Date;
        fechaVencimiento: Date | null;
        moneda: string;
        montoTotal: number;
        estadoDocumental: string;
        saldoPendiente: number;
        clasificacionM5: string;
        asociacionOrdenCompra: string;
        descripcion: string | null;
        asociaciones: {
            id: number;
            tipoOrden: string;
            idOcs: number | null;
            montoAsignado: number;
            estadoDiferencia: string;
            estadoExcedente: string;
            montoExcedente: number;
            esFinal: boolean;
        }[];
        clasificaciones: {
            id: number;
            idAsociacion: number;
            idCategoria: number;
            categoria: string;
            monto: number;
        }[];
        reclasificaciones: {
            id: number;
            estado: string;
            montoTotal: number;
            umbralSnapshotClp: number;
            motivo: string;
            fecha: Date;
            detalles: {
                idClasificacion: number;
                idCategoriaOrigen: number;
                idCategoriaDestino: number;
                monto: number;
            }[];
        }[];
        propuestaImputacion: {
            id: number;
            estado: string;
            preparadoPor: string;
        } | null;
        imputaciones: {
            id: number;
            idClasificacion: number;
            destino: string;
            idProyecto: string | null;
            idOrdenTrabajo: string | null;
            montoOriginal: number;
            montoVigente: number;
            historialOt: {
                anterior: string | null;
                nueva: string;
                motivo: string;
                fecha: Date;
            }[];
            reasignaciones: {
                id: number;
                estado: string;
                monto: number;
                motivo: string;
                excepcional: boolean;
                detalles: {
                    destino: string;
                    idProyecto: string | null;
                    idOrdenTrabajo: string | null;
                    monto: number;
                }[];
            }[];
        }[];
        progreso: {
            asociaciones: boolean;
            vencimiento: boolean;
            clasificacion: boolean;
            imputacion: string;
            moneda: boolean;
            listoObligacion: boolean;
        };
        obligacion: {
            fecha_generacion: Date;
            id_moneda: number;
            fecha_emision: Date;
            fecha_vencimiento: Date;
            id_proveedor: number;
            saldo_inicial: Prisma.Decimal;
            estado_pago: string;
            id_documento_m5: number;
            condicion_pago_dias_snapshot: number | null;
            condicion_pago_tipo_snapshot: string | null;
            tipo_cambio: Prisma.Decimal | null;
            tipo_cambio_origen: string | null;
            id_obligacion_m5: number;
            monto_original: Prisma.Decimal;
            saldo_actual: Prisma.Decimal;
            condicion_temporal: string | null;
            generado_por: bigint;
        } | null;
        ajuste: {
            id: number;
            tipo: string;
            estado: string;
            idObligacion: number;
            monto: number;
            montoAplicado: number;
            montoSaldoFavor: number;
            fecha: Date;
            motivoAnulacion: string | null;
        } | null;
    }>;
    asociarDocumentoOrdenes(id: number, entrada: Entrada): Promise<{
        mensaje: string;
        cantidad: number;
    }>;
    resolverDiferenciaDocumento(id: number, asociacionId: number, entrada: Entrada, usuario: bigint): Promise<{
        monto_asignado: Prisma.Decimal;
        id_documento_m5: number;
        id_asociacion_m5: number;
        tipo_orden: string;
        id_ocs_m5: number | null;
        id_orden_externa: string | null;
        estado_diferencia: string;
        es_documento_final: boolean;
        justificacion: string | null;
        monto_disponible_snapshot: Prisma.Decimal | null;
        monto_excedente: Prisma.Decimal;
        estado_excedente: string;
        excedente_solicitado_por: bigint | null;
        excedente_fecha_solicitud: Date | null;
        excedente_aprobado_por: bigint | null;
        excedente_fecha_resolucion: Date | null;
    }>;
    resolverExcedenteDocumento(id: number, asociacionId: number, entrada: Entrada, usuario: bigint, perfil: string): Promise<{
        monto_asignado: Prisma.Decimal;
        id_documento_m5: number;
        id_asociacion_m5: number;
        tipo_orden: string;
        id_ocs_m5: number | null;
        id_orden_externa: string | null;
        estado_diferencia: string;
        es_documento_final: boolean;
        justificacion: string | null;
        monto_disponible_snapshot: Prisma.Decimal | null;
        monto_excedente: Prisma.Decimal;
        estado_excedente: string;
        excedente_solicitado_por: bigint | null;
        excedente_fecha_solicitud: Date | null;
        excedente_aprobado_por: bigint | null;
        excedente_fecha_resolucion: Date | null;
    }>;
    determinarVencimientoDocumento(id: number, entrada: Entrada): Promise<{
        fechaPropuesta: string;
        fechaVencimiento: string;
        condicionSnapshot: {
            dias: number;
            tipo: string;
        };
    }>;
    clasificarDocumento(id: number, entrada: Entrada): Promise<{
        mensaje: string;
        cantidad: number;
    }>;
    prepararImputacionDocumento(id: number, entrada: Entrada, usuario: bigint): Promise<{
        id: number;
        estado: string;
    }>;
    confirmarImputacionDocumento(id: number, propuestaId: number, usuario: bigint): Promise<{
        estado: string;
        id_documento_m5: number;
        confirmado_por: bigint | null;
        fecha_confirmacion: Date | null;
        id_propuesta_imputacion_m5: number;
        preparado_por: bigint;
        fecha_preparacion: Date;
    }>;
    registrarTipoCambioManual(id: number, entrada: Entrada, usuario: bigint): Promise<{
        estado: string;
        id_moneda: number;
        fecha_emision: Date;
        fecha_vencimiento: Date | null;
        id_proveedor: number;
        id_tipo_documento: number;
        monto_total: Prisma.Decimal;
        descripcion: string | null;
        fecha_creacion: Date;
        creado_por: bigint;
        id_documento_m5: number;
        clase: string;
        folio: string;
        folio_normalizado: string;
        respaldo: string | null;
        excepcion_sin_oc_tipo: string | null;
        excepcion_sin_oc_descripcion: string | null;
        condicion_pago_dias_snapshot: number | null;
        condicion_pago_tipo_snapshot: string | null;
        vencimiento_justificacion: string | null;
        carga_historica: boolean;
        tipo_cambio: Prisma.Decimal | null;
        tipo_cambio_origen: string | null;
        tipo_cambio_justificacion: string | null;
        tipo_cambio_usuario: bigint | null;
        tipo_cambio_fecha: Date | null;
        confirmado_por: bigint | null;
        fecha_confirmacion: Date | null;
    }>;
    generarObligacionDocumento(id: number, usuario: bigint): Promise<{
        id: number;
        idDocumento: number;
        montoOriginal: number;
        saldoInicial: number;
        saldoActual: number;
        estadoPago: string;
        condicionTemporal: string | null;
        yaExistia: boolean;
    }>;
    private operacionPagoM5;
    private efectosMovimientosPago;
    private recalcularObligacionM5;
    private nombreUsuario;
    private presentarOperacionPago;
    buscarProveedoresParaPago(consulta: Record<string, unknown>): Promise<{
        id: number;
        razonSocial: string;
        identificadorFiscal: string;
        obligaciones: {
            id: number;
            moneda: string | undefined;
            saldoActual: number;
            montoOriginal: number;
            fechaVencimiento: Date;
        }[];
    }[]>;
    catalogosPagosProveedores(): Promise<{
        medios: {
            id: number;
            nombre: string;
        }[];
        monedas: {
            id: number;
            codigo: string;
            simbolo: string | null;
        }[];
    }>;
    crearOperacionPago(entrada: Entrada, usuario: bigint): Promise<{
        id: number;
        estado: string;
        estadoAgregado: string;
        fechaEfectivaPago: Date | null;
        proveedor: {
            id: any;
            razonSocial: any;
            identificadorFiscal: any;
            estado: any;
        };
        total: number;
        totalConfirmado: number | null;
        tieneRespaldo: any;
        respaldos: any;
        historialRespaldos: any;
        movimientos: {
            id: number;
            idObligacion: number;
            idMedioPago: number;
            medioPago: any;
            moneda: any;
            montoAplicado: number;
            saldoActual: number;
            conflictoSaldo: boolean;
            tasaReferencia: number | null;
            fuenteTasa: string | null;
            tasaBancariaEfectiva: number | null;
            equivalenteClp: number | null;
            tasaManual: boolean;
            estado: string;
            tieneRespaldo: any;
            montoAnulado: number;
            montoRevertido: number;
            montoNetoVigente: number;
            conciliacion: {
                estado: any;
                observacion: any;
                usuario: any;
                fecha: any;
            };
            respaldos: any;
            anulacion: {
                monto: number;
                motivo: any;
                usuario: any;
                fecha: any;
                respaldo: string | undefined;
            } | null;
            reversas: any;
        }[];
        comisiones: {
            id: number;
            idMovimiento: number | null;
            monto: number;
            moneda: any;
            equivalenteClp: number | null;
            fecha: Date;
            descripcion: string;
            respaldo: string | undefined;
        }[];
        creadoPor: string;
        fechaCreacion: Date;
        preparadoPor: string | null;
        fechaPreparacion: Date | null;
        confirmadoPor: string | null;
        fechaConfirmacion: Date | null;
    }>;
    listarBorradoresPago(): Promise<{
        id: number;
        estado: string;
        estadoAgregado: string;
        fechaEfectivaPago: Date | null;
        proveedor: {
            id: any;
            razonSocial: any;
            identificadorFiscal: any;
            estado: any;
        };
        total: number;
        totalConfirmado: number | null;
        tieneRespaldo: any;
        respaldos: any;
        historialRespaldos: any;
        movimientos: {
            id: number;
            idObligacion: number;
            idMedioPago: number;
            medioPago: any;
            moneda: any;
            montoAplicado: number;
            saldoActual: number;
            conflictoSaldo: boolean;
            tasaReferencia: number | null;
            fuenteTasa: string | null;
            tasaBancariaEfectiva: number | null;
            equivalenteClp: number | null;
            tasaManual: boolean;
            estado: string;
            tieneRespaldo: any;
            montoAnulado: number;
            montoRevertido: number;
            montoNetoVigente: number;
            conciliacion: {
                estado: any;
                observacion: any;
                usuario: any;
                fecha: any;
            };
            respaldos: any;
            anulacion: {
                monto: number;
                motivo: any;
                usuario: any;
                fecha: any;
                respaldo: string | undefined;
            } | null;
            reversas: any;
        }[];
        comisiones: {
            id: number;
            idMovimiento: number | null;
            monto: number;
            moneda: any;
            equivalenteClp: number | null;
            fecha: Date;
            descripcion: string;
            respaldo: string | undefined;
        }[];
        creadoPor: string;
        fechaCreacion: Date;
        preparadoPor: string | null;
        fechaPreparacion: Date | null;
        confirmadoPor: string | null;
        fechaConfirmacion: Date | null;
    }[]>;
    obtenerOperacionPago(id: number): Promise<{
        id: number;
        estado: string;
        estadoAgregado: string;
        fechaEfectivaPago: Date | null;
        proveedor: {
            id: any;
            razonSocial: any;
            identificadorFiscal: any;
            estado: any;
        };
        total: number;
        totalConfirmado: number | null;
        tieneRespaldo: any;
        respaldos: any;
        historialRespaldos: any;
        movimientos: {
            id: number;
            idObligacion: number;
            idMedioPago: number;
            medioPago: any;
            moneda: any;
            montoAplicado: number;
            saldoActual: number;
            conflictoSaldo: boolean;
            tasaReferencia: number | null;
            fuenteTasa: string | null;
            tasaBancariaEfectiva: number | null;
            equivalenteClp: number | null;
            tasaManual: boolean;
            estado: string;
            tieneRespaldo: any;
            montoAnulado: number;
            montoRevertido: number;
            montoNetoVigente: number;
            conciliacion: {
                estado: any;
                observacion: any;
                usuario: any;
                fecha: any;
            };
            respaldos: any;
            anulacion: {
                monto: number;
                motivo: any;
                usuario: any;
                fecha: any;
                respaldo: string | undefined;
            } | null;
            reversas: any;
        }[];
        comisiones: {
            id: number;
            idMovimiento: number | null;
            monto: number;
            moneda: any;
            equivalenteClp: number | null;
            fecha: Date;
            descripcion: string;
            respaldo: string | undefined;
        }[];
        creadoPor: string;
        fechaCreacion: Date;
        preparadoPor: string | null;
        fechaPreparacion: Date | null;
        confirmadoPor: string | null;
        fechaConfirmacion: Date | null;
    }>;
    listarPagosConfirmados(): Promise<{
        id: number;
        estado: string;
        estadoAgregado: string;
        fechaEfectivaPago: Date | null;
        proveedor: {
            id: any;
            razonSocial: any;
            identificadorFiscal: any;
            estado: any;
        };
        total: number;
        totalConfirmado: number | null;
        tieneRespaldo: any;
        respaldos: any;
        historialRespaldos: any;
        movimientos: {
            id: number;
            idObligacion: number;
            idMedioPago: number;
            medioPago: any;
            moneda: any;
            montoAplicado: number;
            saldoActual: number;
            conflictoSaldo: boolean;
            tasaReferencia: number | null;
            fuenteTasa: string | null;
            tasaBancariaEfectiva: number | null;
            equivalenteClp: number | null;
            tasaManual: boolean;
            estado: string;
            tieneRespaldo: any;
            montoAnulado: number;
            montoRevertido: number;
            montoNetoVigente: number;
            conciliacion: {
                estado: any;
                observacion: any;
                usuario: any;
                fecha: any;
            };
            respaldos: any;
            anulacion: {
                monto: number;
                motivo: any;
                usuario: any;
                fecha: any;
                respaldo: string | undefined;
            } | null;
            reversas: any;
        }[];
        comisiones: {
            id: number;
            idMovimiento: number | null;
            monto: number;
            moneda: any;
            equivalenteClp: number | null;
            fecha: Date;
            descripcion: string;
            respaldo: string | undefined;
        }[];
        creadoPor: string;
        fechaCreacion: Date;
        preparadoPor: string | null;
        fechaPreparacion: Date | null;
        confirmadoPor: string | null;
        fechaConfirmacion: Date | null;
    }[]>;
    consultarDetallePagoProveedor(id: number): Promise<{
        id: number;
        estado: string;
        estadoAgregado: string;
        fechaEfectivaPago: Date | null;
        proveedor: {
            id: any;
            razonSocial: any;
            identificadorFiscal: any;
            estado: any;
        };
        total: number;
        totalConfirmado: number | null;
        tieneRespaldo: any;
        respaldos: any;
        historialRespaldos: any;
        movimientos: {
            id: number;
            idObligacion: number;
            idMedioPago: number;
            medioPago: any;
            moneda: any;
            montoAplicado: number;
            saldoActual: number;
            conflictoSaldo: boolean;
            tasaReferencia: number | null;
            fuenteTasa: string | null;
            tasaBancariaEfectiva: number | null;
            equivalenteClp: number | null;
            tasaManual: boolean;
            estado: string;
            tieneRespaldo: any;
            montoAnulado: number;
            montoRevertido: number;
            montoNetoVigente: number;
            conciliacion: {
                estado: any;
                observacion: any;
                usuario: any;
                fecha: any;
            };
            respaldos: any;
            anulacion: {
                monto: number;
                motivo: any;
                usuario: any;
                fecha: any;
                respaldo: string | undefined;
            } | null;
            reversas: any;
        }[];
        comisiones: {
            id: number;
            idMovimiento: number | null;
            monto: number;
            moneda: any;
            equivalenteClp: number | null;
            fecha: Date;
            descripcion: string;
            respaldo: string | undefined;
        }[];
        creadoPor: string;
        fechaCreacion: Date;
        preparadoPor: string | null;
        fechaPreparacion: Date | null;
        confirmadoPor: string | null;
        fechaConfirmacion: Date | null;
    }>;
    private datosMovimientoPago;
    agregarMovimientoPago(idOperacion: number, entrada: Entrada): Promise<{
        id: number;
        estado: string;
        estadoAgregado: string;
        fechaEfectivaPago: Date | null;
        proveedor: {
            id: any;
            razonSocial: any;
            identificadorFiscal: any;
            estado: any;
        };
        total: number;
        totalConfirmado: number | null;
        tieneRespaldo: any;
        respaldos: any;
        historialRespaldos: any;
        movimientos: {
            id: number;
            idObligacion: number;
            idMedioPago: number;
            medioPago: any;
            moneda: any;
            montoAplicado: number;
            saldoActual: number;
            conflictoSaldo: boolean;
            tasaReferencia: number | null;
            fuenteTasa: string | null;
            tasaBancariaEfectiva: number | null;
            equivalenteClp: number | null;
            tasaManual: boolean;
            estado: string;
            tieneRespaldo: any;
            montoAnulado: number;
            montoRevertido: number;
            montoNetoVigente: number;
            conciliacion: {
                estado: any;
                observacion: any;
                usuario: any;
                fecha: any;
            };
            respaldos: any;
            anulacion: {
                monto: number;
                motivo: any;
                usuario: any;
                fecha: any;
                respaldo: string | undefined;
            } | null;
            reversas: any;
        }[];
        comisiones: {
            id: number;
            idMovimiento: number | null;
            monto: number;
            moneda: any;
            equivalenteClp: number | null;
            fecha: Date;
            descripcion: string;
            respaldo: string | undefined;
        }[];
        creadoPor: string;
        fechaCreacion: Date;
        preparadoPor: string | null;
        fechaPreparacion: Date | null;
        confirmadoPor: string | null;
        fechaConfirmacion: Date | null;
    }>;
    actualizarMovimientoPago(idOperacion: number, idMovimiento: number, entrada: Entrada): Promise<{
        id: number;
        estado: string;
        estadoAgregado: string;
        fechaEfectivaPago: Date | null;
        proveedor: {
            id: any;
            razonSocial: any;
            identificadorFiscal: any;
            estado: any;
        };
        total: number;
        totalConfirmado: number | null;
        tieneRespaldo: any;
        respaldos: any;
        historialRespaldos: any;
        movimientos: {
            id: number;
            idObligacion: number;
            idMedioPago: number;
            medioPago: any;
            moneda: any;
            montoAplicado: number;
            saldoActual: number;
            conflictoSaldo: boolean;
            tasaReferencia: number | null;
            fuenteTasa: string | null;
            tasaBancariaEfectiva: number | null;
            equivalenteClp: number | null;
            tasaManual: boolean;
            estado: string;
            tieneRespaldo: any;
            montoAnulado: number;
            montoRevertido: number;
            montoNetoVigente: number;
            conciliacion: {
                estado: any;
                observacion: any;
                usuario: any;
                fecha: any;
            };
            respaldos: any;
            anulacion: {
                monto: number;
                motivo: any;
                usuario: any;
                fecha: any;
                respaldo: string | undefined;
            } | null;
            reversas: any;
        }[];
        comisiones: {
            id: number;
            idMovimiento: number | null;
            monto: number;
            moneda: any;
            equivalenteClp: number | null;
            fecha: Date;
            descripcion: string;
            respaldo: string | undefined;
        }[];
        creadoPor: string;
        fechaCreacion: Date;
        preparadoPor: string | null;
        fechaPreparacion: Date | null;
        confirmadoPor: string | null;
        fechaConfirmacion: Date | null;
    }>;
    adjuntarRespaldoPago(idOperacion: number, entrada: Entrada, usuario: bigint): Promise<{
        id: number;
        estado: string;
        estadoAgregado: string;
        fechaEfectivaPago: Date | null;
        proveedor: {
            id: any;
            razonSocial: any;
            identificadorFiscal: any;
            estado: any;
        };
        total: number;
        totalConfirmado: number | null;
        tieneRespaldo: any;
        respaldos: any;
        historialRespaldos: any;
        movimientos: {
            id: number;
            idObligacion: number;
            idMedioPago: number;
            medioPago: any;
            moneda: any;
            montoAplicado: number;
            saldoActual: number;
            conflictoSaldo: boolean;
            tasaReferencia: number | null;
            fuenteTasa: string | null;
            tasaBancariaEfectiva: number | null;
            equivalenteClp: number | null;
            tasaManual: boolean;
            estado: string;
            tieneRespaldo: any;
            montoAnulado: number;
            montoRevertido: number;
            montoNetoVigente: number;
            conciliacion: {
                estado: any;
                observacion: any;
                usuario: any;
                fecha: any;
            };
            respaldos: any;
            anulacion: {
                monto: number;
                motivo: any;
                usuario: any;
                fecha: any;
                respaldo: string | undefined;
            } | null;
            reversas: any;
        }[];
        comisiones: {
            id: number;
            idMovimiento: number | null;
            monto: number;
            moneda: any;
            equivalenteClp: number | null;
            fecha: Date;
            descripcion: string;
            respaldo: string | undefined;
        }[];
        creadoPor: string;
        fechaCreacion: Date;
        preparadoPor: string | null;
        fechaPreparacion: Date | null;
        confirmadoPor: string | null;
        fechaConfirmacion: Date | null;
    }>;
    private crearRespaldoPostPago;
    reemplazarRespaldoPago(idOperacion: number, idRespaldo: number, entrada: Entrada, usuario: bigint): Promise<{
        id: number;
        estado: string;
        estadoAgregado: string;
        fechaEfectivaPago: Date | null;
        proveedor: {
            id: any;
            razonSocial: any;
            identificadorFiscal: any;
            estado: any;
        };
        total: number;
        totalConfirmado: number | null;
        tieneRespaldo: any;
        respaldos: any;
        historialRespaldos: any;
        movimientos: {
            id: number;
            idObligacion: number;
            idMedioPago: number;
            medioPago: any;
            moneda: any;
            montoAplicado: number;
            saldoActual: number;
            conflictoSaldo: boolean;
            tasaReferencia: number | null;
            fuenteTasa: string | null;
            tasaBancariaEfectiva: number | null;
            equivalenteClp: number | null;
            tasaManual: boolean;
            estado: string;
            tieneRespaldo: any;
            montoAnulado: number;
            montoRevertido: number;
            montoNetoVigente: number;
            conciliacion: {
                estado: any;
                observacion: any;
                usuario: any;
                fecha: any;
            };
            respaldos: any;
            anulacion: {
                monto: number;
                motivo: any;
                usuario: any;
                fecha: any;
                respaldo: string | undefined;
            } | null;
            reversas: any;
        }[];
        comisiones: {
            id: number;
            idMovimiento: number | null;
            monto: number;
            moneda: any;
            equivalenteClp: number | null;
            fecha: Date;
            descripcion: string;
            respaldo: string | undefined;
        }[];
        creadoPor: string;
        fechaCreacion: Date;
        preparadoPor: string | null;
        fechaPreparacion: Date | null;
        confirmadoPor: string | null;
        fechaConfirmacion: Date | null;
    }>;
    private movimientoPostPago;
    private efectoMovimientoPostPago;
    registrarTipoCambioManualPago(idOperacion: number, idMovimiento: number, entrada: Entrada, usuario: bigint, perfil: string): Promise<{
        id: number;
        estado: string;
        estadoAgregado: string;
        fechaEfectivaPago: Date | null;
        proveedor: {
            id: any;
            razonSocial: any;
            identificadorFiscal: any;
            estado: any;
        };
        total: number;
        totalConfirmado: number | null;
        tieneRespaldo: any;
        respaldos: any;
        historialRespaldos: any;
        movimientos: {
            id: number;
            idObligacion: number;
            idMedioPago: number;
            medioPago: any;
            moneda: any;
            montoAplicado: number;
            saldoActual: number;
            conflictoSaldo: boolean;
            tasaReferencia: number | null;
            fuenteTasa: string | null;
            tasaBancariaEfectiva: number | null;
            equivalenteClp: number | null;
            tasaManual: boolean;
            estado: string;
            tieneRespaldo: any;
            montoAnulado: number;
            montoRevertido: number;
            montoNetoVigente: number;
            conciliacion: {
                estado: any;
                observacion: any;
                usuario: any;
                fecha: any;
            };
            respaldos: any;
            anulacion: {
                monto: number;
                motivo: any;
                usuario: any;
                fecha: any;
                respaldo: string | undefined;
            } | null;
            reversas: any;
        }[];
        comisiones: {
            id: number;
            idMovimiento: number | null;
            monto: number;
            moneda: any;
            equivalenteClp: number | null;
            fecha: Date;
            descripcion: string;
            respaldo: string | undefined;
        }[];
        creadoPor: string;
        fechaCreacion: Date;
        preparadoPor: string | null;
        fechaPreparacion: Date | null;
        confirmadoPor: string | null;
        fechaConfirmacion: Date | null;
    }>;
    private validarOperacionPago;
    prepararOperacionPago(id: number, usuario: bigint): Promise<{
        id: number;
        estado: string;
        estadoAgregado: string;
        fechaEfectivaPago: Date | null;
        proveedor: {
            id: any;
            razonSocial: any;
            identificadorFiscal: any;
            estado: any;
        };
        total: number;
        totalConfirmado: number | null;
        tieneRespaldo: any;
        respaldos: any;
        historialRespaldos: any;
        movimientos: {
            id: number;
            idObligacion: number;
            idMedioPago: number;
            medioPago: any;
            moneda: any;
            montoAplicado: number;
            saldoActual: number;
            conflictoSaldo: boolean;
            tasaReferencia: number | null;
            fuenteTasa: string | null;
            tasaBancariaEfectiva: number | null;
            equivalenteClp: number | null;
            tasaManual: boolean;
            estado: string;
            tieneRespaldo: any;
            montoAnulado: number;
            montoRevertido: number;
            montoNetoVigente: number;
            conciliacion: {
                estado: any;
                observacion: any;
                usuario: any;
                fecha: any;
            };
            respaldos: any;
            anulacion: {
                monto: number;
                motivo: any;
                usuario: any;
                fecha: any;
                respaldo: string | undefined;
            } | null;
            reversas: any;
        }[];
        comisiones: {
            id: number;
            idMovimiento: number | null;
            monto: number;
            moneda: any;
            equivalenteClp: number | null;
            fecha: Date;
            descripcion: string;
            respaldo: string | undefined;
        }[];
        creadoPor: string;
        fechaCreacion: Date;
        preparadoPor: string | null;
        fechaPreparacion: Date | null;
        confirmadoPor: string | null;
        fechaConfirmacion: Date | null;
    }>;
    guardarBorradorPago(id: number, entrada: Entrada): Promise<{
        id: number;
        estado: string;
        estadoAgregado: string;
        fechaEfectivaPago: Date | null;
        proveedor: {
            id: any;
            razonSocial: any;
            identificadorFiscal: any;
            estado: any;
        };
        total: number;
        totalConfirmado: number | null;
        tieneRespaldo: any;
        respaldos: any;
        historialRespaldos: any;
        movimientos: {
            id: number;
            idObligacion: number;
            idMedioPago: number;
            medioPago: any;
            moneda: any;
            montoAplicado: number;
            saldoActual: number;
            conflictoSaldo: boolean;
            tasaReferencia: number | null;
            fuenteTasa: string | null;
            tasaBancariaEfectiva: number | null;
            equivalenteClp: number | null;
            tasaManual: boolean;
            estado: string;
            tieneRespaldo: any;
            montoAnulado: number;
            montoRevertido: number;
            montoNetoVigente: number;
            conciliacion: {
                estado: any;
                observacion: any;
                usuario: any;
                fecha: any;
            };
            respaldos: any;
            anulacion: {
                monto: number;
                motivo: any;
                usuario: any;
                fecha: any;
                respaldo: string | undefined;
            } | null;
            reversas: any;
        }[];
        comisiones: {
            id: number;
            idMovimiento: number | null;
            monto: number;
            moneda: any;
            equivalenteClp: number | null;
            fecha: Date;
            descripcion: string;
            respaldo: string | undefined;
        }[];
        creadoPor: string;
        fechaCreacion: Date;
        preparadoPor: string | null;
        fechaPreparacion: Date | null;
        confirmadoPor: string | null;
        fechaConfirmacion: Date | null;
    }>;
    retomarOperacionPago(id: number): Promise<{
        id: number;
        estado: string;
        estadoAgregado: string;
        fechaEfectivaPago: Date | null;
        proveedor: {
            id: any;
            razonSocial: any;
            identificadorFiscal: any;
            estado: any;
        };
        total: number;
        totalConfirmado: number | null;
        tieneRespaldo: any;
        respaldos: any;
        historialRespaldos: any;
        movimientos: {
            id: number;
            idObligacion: number;
            idMedioPago: number;
            medioPago: any;
            moneda: any;
            montoAplicado: number;
            saldoActual: number;
            conflictoSaldo: boolean;
            tasaReferencia: number | null;
            fuenteTasa: string | null;
            tasaBancariaEfectiva: number | null;
            equivalenteClp: number | null;
            tasaManual: boolean;
            estado: string;
            tieneRespaldo: any;
            montoAnulado: number;
            montoRevertido: number;
            montoNetoVigente: number;
            conciliacion: {
                estado: any;
                observacion: any;
                usuario: any;
                fecha: any;
            };
            respaldos: any;
            anulacion: {
                monto: number;
                motivo: any;
                usuario: any;
                fecha: any;
                respaldo: string | undefined;
            } | null;
            reversas: any;
        }[];
        comisiones: {
            id: number;
            idMovimiento: number | null;
            monto: number;
            moneda: any;
            equivalenteClp: number | null;
            fecha: Date;
            descripcion: string;
            respaldo: string | undefined;
        }[];
        creadoPor: string;
        fechaCreacion: Date;
        preparadoPor: string | null;
        fechaPreparacion: Date | null;
        confirmadoPor: string | null;
        fechaConfirmacion: Date | null;
    }>;
    descartarOperacionPago(id: number, usuario: bigint): Promise<{
        id: number;
        estado: string;
        estadoAgregado: string;
        fechaEfectivaPago: Date | null;
        proveedor: {
            id: any;
            razonSocial: any;
            identificadorFiscal: any;
            estado: any;
        };
        total: number;
        totalConfirmado: number | null;
        tieneRespaldo: any;
        respaldos: any;
        historialRespaldos: any;
        movimientos: {
            id: number;
            idObligacion: number;
            idMedioPago: number;
            medioPago: any;
            moneda: any;
            montoAplicado: number;
            saldoActual: number;
            conflictoSaldo: boolean;
            tasaReferencia: number | null;
            fuenteTasa: string | null;
            tasaBancariaEfectiva: number | null;
            equivalenteClp: number | null;
            tasaManual: boolean;
            estado: string;
            tieneRespaldo: any;
            montoAnulado: number;
            montoRevertido: number;
            montoNetoVigente: number;
            conciliacion: {
                estado: any;
                observacion: any;
                usuario: any;
                fecha: any;
            };
            respaldos: any;
            anulacion: {
                monto: number;
                motivo: any;
                usuario: any;
                fecha: any;
                respaldo: string | undefined;
            } | null;
            reversas: any;
        }[];
        comisiones: {
            id: number;
            idMovimiento: number | null;
            monto: number;
            moneda: any;
            equivalenteClp: number | null;
            fecha: Date;
            descripcion: string;
            respaldo: string | undefined;
        }[];
        creadoPor: string;
        fechaCreacion: Date;
        preparadoPor: string | null;
        fechaPreparacion: Date | null;
        confirmadoPor: string | null;
        fechaConfirmacion: Date | null;
    }>;
    confirmarOperacionPago(id: number, usuario: bigint): Promise<{
        id: number;
        estado: string;
        estadoAgregado: string;
        fechaEfectivaPago: Date | null;
        proveedor: {
            id: any;
            razonSocial: any;
            identificadorFiscal: any;
            estado: any;
        };
        total: number;
        totalConfirmado: number | null;
        tieneRespaldo: any;
        respaldos: any;
        historialRespaldos: any;
        movimientos: {
            id: number;
            idObligacion: number;
            idMedioPago: number;
            medioPago: any;
            moneda: any;
            montoAplicado: number;
            saldoActual: number;
            conflictoSaldo: boolean;
            tasaReferencia: number | null;
            fuenteTasa: string | null;
            tasaBancariaEfectiva: number | null;
            equivalenteClp: number | null;
            tasaManual: boolean;
            estado: string;
            tieneRespaldo: any;
            montoAnulado: number;
            montoRevertido: number;
            montoNetoVigente: number;
            conciliacion: {
                estado: any;
                observacion: any;
                usuario: any;
                fecha: any;
            };
            respaldos: any;
            anulacion: {
                monto: number;
                motivo: any;
                usuario: any;
                fecha: any;
                respaldo: string | undefined;
            } | null;
            reversas: any;
        }[];
        comisiones: {
            id: number;
            idMovimiento: number | null;
            monto: number;
            moneda: any;
            equivalenteClp: number | null;
            fecha: Date;
            descripcion: string;
            respaldo: string | undefined;
        }[];
        creadoPor: string;
        fechaCreacion: Date;
        preparadoPor: string | null;
        fechaPreparacion: Date | null;
        confirmadoPor: string | null;
        fechaConfirmacion: Date | null;
    }>;
    anularMovimientoPago(idOperacion: number, idMovimiento: number, entrada: Entrada, usuario: bigint): Promise<{
        id: number;
        estado: string;
        estadoAgregado: string;
        fechaEfectivaPago: Date | null;
        proveedor: {
            id: any;
            razonSocial: any;
            identificadorFiscal: any;
            estado: any;
        };
        total: number;
        totalConfirmado: number | null;
        tieneRespaldo: any;
        respaldos: any;
        historialRespaldos: any;
        movimientos: {
            id: number;
            idObligacion: number;
            idMedioPago: number;
            medioPago: any;
            moneda: any;
            montoAplicado: number;
            saldoActual: number;
            conflictoSaldo: boolean;
            tasaReferencia: number | null;
            fuenteTasa: string | null;
            tasaBancariaEfectiva: number | null;
            equivalenteClp: number | null;
            tasaManual: boolean;
            estado: string;
            tieneRespaldo: any;
            montoAnulado: number;
            montoRevertido: number;
            montoNetoVigente: number;
            conciliacion: {
                estado: any;
                observacion: any;
                usuario: any;
                fecha: any;
            };
            respaldos: any;
            anulacion: {
                monto: number;
                motivo: any;
                usuario: any;
                fecha: any;
                respaldo: string | undefined;
            } | null;
            reversas: any;
        }[];
        comisiones: {
            id: number;
            idMovimiento: number | null;
            monto: number;
            moneda: any;
            equivalenteClp: number | null;
            fecha: Date;
            descripcion: string;
            respaldo: string | undefined;
        }[];
        creadoPor: string;
        fechaCreacion: Date;
        preparadoPor: string | null;
        fechaPreparacion: Date | null;
        confirmadoPor: string | null;
        fechaConfirmacion: Date | null;
    }>;
    anularOperacionPago(idOperacion: number, entrada: Entrada, usuario: bigint): Promise<{
        id: number;
        estado: string;
        estadoAgregado: string;
        fechaEfectivaPago: Date | null;
        proveedor: {
            id: any;
            razonSocial: any;
            identificadorFiscal: any;
            estado: any;
        };
        total: number;
        totalConfirmado: number | null;
        tieneRespaldo: any;
        respaldos: any;
        historialRespaldos: any;
        movimientos: {
            id: number;
            idObligacion: number;
            idMedioPago: number;
            medioPago: any;
            moneda: any;
            montoAplicado: number;
            saldoActual: number;
            conflictoSaldo: boolean;
            tasaReferencia: number | null;
            fuenteTasa: string | null;
            tasaBancariaEfectiva: number | null;
            equivalenteClp: number | null;
            tasaManual: boolean;
            estado: string;
            tieneRespaldo: any;
            montoAnulado: number;
            montoRevertido: number;
            montoNetoVigente: number;
            conciliacion: {
                estado: any;
                observacion: any;
                usuario: any;
                fecha: any;
            };
            respaldos: any;
            anulacion: {
                monto: number;
                motivo: any;
                usuario: any;
                fecha: any;
                respaldo: string | undefined;
            } | null;
            reversas: any;
        }[];
        comisiones: {
            id: number;
            idMovimiento: number | null;
            monto: number;
            moneda: any;
            equivalenteClp: number | null;
            fecha: Date;
            descripcion: string;
            respaldo: string | undefined;
        }[];
        creadoPor: string;
        fechaCreacion: Date;
        preparadoPor: string | null;
        fechaPreparacion: Date | null;
        confirmadoPor: string | null;
        fechaConfirmacion: Date | null;
    }>;
    revertirMovimientoPago(idOperacion: number, idMovimiento: number, entrada: Entrada, usuario: bigint): Promise<{
        id: number;
        estado: string;
        estadoAgregado: string;
        fechaEfectivaPago: Date | null;
        proveedor: {
            id: any;
            razonSocial: any;
            identificadorFiscal: any;
            estado: any;
        };
        total: number;
        totalConfirmado: number | null;
        tieneRespaldo: any;
        respaldos: any;
        historialRespaldos: any;
        movimientos: {
            id: number;
            idObligacion: number;
            idMedioPago: number;
            medioPago: any;
            moneda: any;
            montoAplicado: number;
            saldoActual: number;
            conflictoSaldo: boolean;
            tasaReferencia: number | null;
            fuenteTasa: string | null;
            tasaBancariaEfectiva: number | null;
            equivalenteClp: number | null;
            tasaManual: boolean;
            estado: string;
            tieneRespaldo: any;
            montoAnulado: number;
            montoRevertido: number;
            montoNetoVigente: number;
            conciliacion: {
                estado: any;
                observacion: any;
                usuario: any;
                fecha: any;
            };
            respaldos: any;
            anulacion: {
                monto: number;
                motivo: any;
                usuario: any;
                fecha: any;
                respaldo: string | undefined;
            } | null;
            reversas: any;
        }[];
        comisiones: {
            id: number;
            idMovimiento: number | null;
            monto: number;
            moneda: any;
            equivalenteClp: number | null;
            fecha: Date;
            descripcion: string;
            respaldo: string | undefined;
        }[];
        creadoPor: string;
        fechaCreacion: Date;
        preparadoPor: string | null;
        fechaPreparacion: Date | null;
        confirmadoPor: string | null;
        fechaConfirmacion: Date | null;
    }>;
    conciliarMovimientoPago(idOperacion: number, idMovimiento: number, entrada: Entrada, usuario: bigint): Promise<{
        id: number;
        estado: string;
        estadoAgregado: string;
        fechaEfectivaPago: Date | null;
        proveedor: {
            id: any;
            razonSocial: any;
            identificadorFiscal: any;
            estado: any;
        };
        total: number;
        totalConfirmado: number | null;
        tieneRespaldo: any;
        respaldos: any;
        historialRespaldos: any;
        movimientos: {
            id: number;
            idObligacion: number;
            idMedioPago: number;
            medioPago: any;
            moneda: any;
            montoAplicado: number;
            saldoActual: number;
            conflictoSaldo: boolean;
            tasaReferencia: number | null;
            fuenteTasa: string | null;
            tasaBancariaEfectiva: number | null;
            equivalenteClp: number | null;
            tasaManual: boolean;
            estado: string;
            tieneRespaldo: any;
            montoAnulado: number;
            montoRevertido: number;
            montoNetoVigente: number;
            conciliacion: {
                estado: any;
                observacion: any;
                usuario: any;
                fecha: any;
            };
            respaldos: any;
            anulacion: {
                monto: number;
                motivo: any;
                usuario: any;
                fecha: any;
                respaldo: string | undefined;
            } | null;
            reversas: any;
        }[];
        comisiones: {
            id: number;
            idMovimiento: number | null;
            monto: number;
            moneda: any;
            equivalenteClp: number | null;
            fecha: Date;
            descripcion: string;
            respaldo: string | undefined;
        }[];
        creadoPor: string;
        fechaCreacion: Date;
        preparadoPor: string | null;
        fechaPreparacion: Date | null;
        confirmadoPor: string | null;
        fechaConfirmacion: Date | null;
    }>;
    private registrarEfectosOcsNotaDebito;
    private registrarAjusteObligacion;
    registrarNotaCredito(entrada: Entrada, usuario: bigint): Promise<{
        id: number;
        tipo: string;
        estado: string;
        idObligacion: number;
        idProveedor: number;
        folio: string;
        moneda: string;
        monto: number;
        montoAplicado: number;
        montoSaldoFavor: number;
        fecha: Date;
        saldoFavor: {
            id: number;
            generado: number;
            disponible: number;
            estado: string;
        } | null;
    }>;
    registrarNotaDebito(entrada: Entrada, usuario: bigint): Promise<{
        id: number;
        tipo: string;
        estado: string;
        idObligacion: number;
        idProveedor: number;
        folio: string;
        moneda: string;
        monto: number;
        montoAplicado: number;
        montoSaldoFavor: number;
        fecha: Date;
        saldoFavor: {
            id: number;
            generado: number;
            disponible: number;
            estado: string;
        } | null;
    }>;
    obtenerAjusteObligacion(id: number): Promise<{
        id: number;
        tipo: string;
        estado: string;
        idObligacion: number;
        idProveedor: number;
        folio: string;
        moneda: string;
        monto: number;
        montoAplicado: number;
        montoSaldoFavor: number;
        fecha: Date;
        saldoFavor: {
            id: number;
            generado: number;
            disponible: number;
            estado: string;
        } | null;
    }>;
    anularAjusteObligacion(id: number, entrada: Entrada, usuario: bigint): Promise<{
        id: number;
        tipo: string;
        estado: string;
        idObligacion: number;
        idProveedor: number;
        folio: string;
        moneda: string;
        monto: number;
        montoAplicado: number;
        montoSaldoFavor: number;
        fecha: Date;
        saldoFavor: {
            id: number;
            generado: number;
            disponible: number;
            estado: string;
        } | null;
    }>;
    consultarSaldosFavorProveedor(idProveedor: number): Promise<{
        proveedor: {
            id: number;
            razonSocial: string;
            estado: string;
        };
        totalesPorMoneda: {
            moneda: string;
            montoDisponible: number;
        }[];
        saldos: {
            id: number;
            moneda: string;
            origen: string;
            idNotaCredito: number;
            folio: string;
            montoOriginalCredito: number;
            montoGenerado: number;
            montoUtilizadoNeto: number;
            montoDisponible: number;
            fecha: Date;
            estado: string;
        }[];
    }>;
    proponerCompensacion(idProveedor: number, entrada: Entrada): Promise<{
        idSaldoFavor: number;
        montoDisponible: number;
        distribuciones: {
            idObligacion: number;
            monto: number;
            saldoObligacion: number;
            condicionTemporal: string | null;
            fechaVencimiento: Date;
        }[];
        reglaMoneda: string;
    }>;
    private presentarCompensacion;
    listarCompensaciones(idProveedor: number): Promise<{
        id: number;
        estado: string;
        idSaldoFavor: number;
        idProveedor: number;
        total: number;
        fecha: Date;
        distribuciones: {
            id: number;
            idObligacion: number;
            monto: number;
            montoRevertido: number;
            reversas: {
                id: number;
                monto: number;
                motivo: string;
                fecha: Date;
            }[];
        }[];
    }[]>;
    confirmarCompensacion(idProveedor: number, entrada: Entrada, usuario: bigint): Promise<{
        id: number;
        estado: string;
        idSaldoFavor: number;
        idProveedor: number;
        total: number;
        fecha: Date;
        distribuciones: {
            id: number;
            idObligacion: number;
            monto: number;
            montoRevertido: number;
            reversas: {
                id: number;
                monto: number;
                motivo: string;
                fecha: Date;
            }[];
        }[];
    }>;
    revertirCompensacion(id: number, entrada: Entrada, usuario: bigint): Promise<{
        id: number;
        estado: string;
        idSaldoFavor: number;
        idProveedor: number;
        total: number;
        fecha: Date;
        distribuciones: {
            id: number;
            idObligacion: number;
            monto: number;
            montoRevertido: number;
            reversas: {
                id: number;
                monto: number;
                motivo: string;
                fecha: Date;
            }[];
        }[];
    }>;
    listarCategoriasEgreso(): Promise<{
        id: number;
        nombre: string;
        activo: boolean;
        fechaCreacion: Date;
        historial: {
            motivo: string | null;
            usuario_id_usuario: bigint;
            fecha_hora: Date;
            id_categoria_egreso_m5: number;
            id_historial_categoria_m5: number;
            nombre_anterior: string | null;
            nombre_nuevo: string | null;
            activo_anterior: boolean | null;
            activo_nuevo: boolean | null;
        }[];
    }[]>;
    crearCategoriaEgreso(entrada: Entrada, usuario: bigint): Promise<{
        fecha_creacion: Date;
        creado_por: bigint | null;
        id_categoria_egreso_m5: number;
        nombre: string;
        activo: boolean;
        nombre_normalizado: string;
    }>;
    actualizarCategoriaEgreso(id: number, entrada: Entrada, usuario: bigint): Promise<{
        fecha_creacion: Date;
        creado_por: bigint | null;
        id_categoria_egreso_m5: number;
        nombre: string;
        activo: boolean;
        nombre_normalizado: string;
    }>;
    consultarUmbralReclasificacion(): Promise<{
        montoClp: number;
        fecha: Date;
        historial: {
            anterior: number;
            nuevo: number;
            usuario: string;
            fecha: Date;
        }[];
    }>;
    configurarUmbralReclasificacion(entrada: Entrada, usuario: bigint): Promise<{
        montoClp: number;
        fecha: Date;
        historial: {
            anterior: number;
            nuevo: number;
            usuario: string;
            fecha: Date;
        }[];
    }>;
    private disponibilidadClasificacion;
    solicitarReclasificacion(idDocumento: number, entrada: Entrada, usuario: bigint): Promise<{
        id: number;
        estado: string;
        montoTotal: number;
        montoReferenciaClp: number;
        umbralSnapshotClp: number;
    }>;
    resolverReclasificacion(id: number, aprobar: boolean, entrada: Entrada, usuario: bigint, perfil: string): Promise<{
        id: number;
        estado: string;
    }>;
    listarReclasificaciones(): Promise<{
        id: number;
        idDocumento: number;
        estado: string;
        montoTotal: number;
        montoReferenciaClp: number;
        umbralSnapshotClp: number;
        motivo: string;
        solicitadoPor: string;
        fecha: Date;
        detalles: {
            idClasificacion: number;
            idCategoriaDestino: number;
            monto: number;
        }[];
    }[]>;
    corregirOrdenTrabajoImputacion(idDetalle: number, entrada: Entrada, usuario: bigint): Promise<{
        idDetalle: number;
        idProyecto: string;
        idOtAnterior: string | null;
        idOtNueva: string;
        monto: number;
        motivo: string;
    }>;
    private validarDestinoReasignacion;
    private disponibilidadImputacion;
    solicitarReasignacionCosto(idDetalle: number, entrada: Entrada, usuario: bigint): Promise<{
        id: number;
        idDetalleOrigen: number;
        montoTotal: number;
        motivo: string;
        estado: string;
        excepcional: boolean;
        justificacionExcepcion: string | null;
        solicitadoPor: string;
        fechaSolicitud: Date;
        resueltoPor: string | null;
        fechaResolucion: Date | null;
        motivoRechazo: string | null;
        distribuciones: {
            destino: string;
            idProyecto: string | null;
            idOrdenTrabajo: string | null;
            monto: number;
        }[];
    }>;
    resolverReasignacionCosto(id: number, aprobar: boolean, entrada: Entrada, usuario: bigint): Promise<{
        id: number;
        idDetalleOrigen: number;
        montoTotal: number;
        motivo: string;
        estado: string;
        excepcional: boolean;
        justificacionExcepcion: string | null;
        solicitadoPor: string;
        fechaSolicitud: Date;
        resueltoPor: string | null;
        fechaResolucion: Date | null;
        motivoRechazo: string | null;
        distribuciones: {
            destino: string;
            idProyecto: string | null;
            idOrdenTrabajo: string | null;
            monto: number;
        }[];
    }>;
    listarReasignacionesCosto(): Promise<{
        id: number;
        idDetalleOrigen: number;
        montoTotal: number;
        motivo: string;
        estado: string;
        excepcional: boolean;
        justificacionExcepcion: string | null;
        solicitadoPor: string;
        fechaSolicitud: Date;
        resueltoPor: string | null;
        fechaResolucion: Date | null;
        motivoRechazo: string | null;
        distribuciones: {
            destino: string;
            idProyecto: string | null;
            idOrdenTrabajo: string | null;
            monto: number;
        }[];
    }[]>;
    registrarComisionBancaria(idOperacion: number, entrada: Entrada, usuario: bigint): Promise<{
        id: number;
        idOperacion: number;
        idMovimiento: number | null;
        monto: number;
        moneda: string;
        equivalenteClp: number | null;
        fecha: Date;
        descripcion: string;
        efectoDeudaProveedor: number;
    }>;
    private presentarEnvio;
    listarEnviosImportaciones(): Promise<{
        id: number;
        referencia: string;
        fecha: Date;
        descripcion: string | null;
        estado: string;
        fechaCreacion: Date;
        ordenes: {
            id: number;
            tipo: string;
            idOcs: number | null;
            idExterno: string | null;
            fecha: Date;
        }[];
        costos: {
            id: number;
            tipo: string;
            fuente: string;
            idObligacion: number | null;
            idComision: number | null;
            monto: number;
            moneda: string;
            equivalenteClp: number | null;
            descripcion: string | null;
            fecha: Date;
        }[];
        costoFinanciero: {
            totalesPorMoneda: {
                moneda: string;
                monto: number;
            }[];
            totalClp: number | null;
            conversionPendiente: boolean;
        };
        historial: {
            id: number;
            evento: string;
            detalle: string;
            usuario: string;
            fecha: Date;
        }[];
    }[]>;
    obtenerEnvioImportacion(id: number): Promise<{
        id: number;
        referencia: string;
        fecha: Date;
        descripcion: string | null;
        estado: string;
        fechaCreacion: Date;
        ordenes: {
            id: number;
            tipo: string;
            idOcs: number | null;
            idExterno: string | null;
            fecha: Date;
        }[];
        costos: {
            id: number;
            tipo: string;
            fuente: string;
            idObligacion: number | null;
            idComision: number | null;
            monto: number;
            moneda: string;
            equivalenteClp: number | null;
            descripcion: string | null;
            fecha: Date;
        }[];
        costoFinanciero: {
            totalesPorMoneda: {
                moneda: string;
                monto: number;
            }[];
            totalClp: number | null;
            conversionPendiente: boolean;
        };
        historial: {
            id: number;
            evento: string;
            detalle: string;
            usuario: string;
            fecha: Date;
        }[];
    }>;
    crearEnvioImportacion(entrada: Entrada, usuario: bigint): Promise<{
        id: number;
        referencia: string;
        fecha: Date;
        descripcion: string | null;
        estado: string;
        fechaCreacion: Date;
        ordenes: {
            id: number;
            tipo: string;
            idOcs: number | null;
            idExterno: string | null;
            fecha: Date;
        }[];
        costos: {
            id: number;
            tipo: string;
            fuente: string;
            idObligacion: number | null;
            idComision: number | null;
            monto: number;
            moneda: string;
            equivalenteClp: number | null;
            descripcion: string | null;
            fecha: Date;
        }[];
        costoFinanciero: {
            totalesPorMoneda: {
                moneda: string;
                monto: number;
            }[];
            totalClp: number | null;
            conversionPendiente: boolean;
        };
        historial: {
            id: number;
            evento: string;
            detalle: string;
            usuario: string;
            fecha: Date;
        }[];
    }>;
    asociarOrdenEnvio(idEnvio: number, entrada: Entrada, usuario: bigint): Promise<{
        id: number;
        referencia: string;
        fecha: Date;
        descripcion: string | null;
        estado: string;
        fechaCreacion: Date;
        ordenes: {
            id: number;
            tipo: string;
            idOcs: number | null;
            idExterno: string | null;
            fecha: Date;
        }[];
        costos: {
            id: number;
            tipo: string;
            fuente: string;
            idObligacion: number | null;
            idComision: number | null;
            monto: number;
            moneda: string;
            equivalenteClp: number | null;
            descripcion: string | null;
            fecha: Date;
        }[];
        costoFinanciero: {
            totalesPorMoneda: {
                moneda: string;
                monto: number;
            }[];
            totalClp: number | null;
            conversionPendiente: boolean;
        };
        historial: {
            id: number;
            evento: string;
            detalle: string;
            usuario: string;
            fecha: Date;
        }[];
    }>;
    registrarCostoEnvio(idEnvio: number, entrada: Entrada, usuario: bigint): Promise<{
        id: number;
        tipo: string;
        fuente: string;
        idObligacion: number | null;
        idComision: number | null;
        monto: number;
        moneda: string;
        equivalenteClp: number | null;
        descripcion: string | null;
        fecha: Date;
    }>;
    actualizarCostoEnvio(idEnvio: number, idCosto: number, entrada: Entrada, usuario: bigint): Promise<{
        id: number;
        referencia: string;
        fecha: Date;
        descripcion: string | null;
        estado: string;
        fechaCreacion: Date;
        ordenes: {
            id: number;
            tipo: string;
            idOcs: number | null;
            idExterno: string | null;
            fecha: Date;
        }[];
        costos: {
            id: number;
            tipo: string;
            fuente: string;
            idObligacion: number | null;
            idComision: number | null;
            monto: number;
            moneda: string;
            equivalenteClp: number | null;
            descripcion: string | null;
            fecha: Date;
        }[];
        costoFinanciero: {
            totalesPorMoneda: {
                moneda: string;
                monto: number;
            }[];
            totalClp: number | null;
            conversionPendiente: boolean;
        };
        historial: {
            id: number;
            evento: string;
            detalle: string;
            usuario: string;
            fecha: Date;
        }[];
    }>;
    private cambiarEstadoEnvio;
    pasarEnvioRevision(idEnvio: number, usuario: bigint): Promise<{
        id: number;
        referencia: string;
        fecha: Date;
        descripcion: string | null;
        estado: string;
        fechaCreacion: Date;
        ordenes: {
            id: number;
            tipo: string;
            idOcs: number | null;
            idExterno: string | null;
            fecha: Date;
        }[];
        costos: {
            id: number;
            tipo: string;
            fuente: string;
            idObligacion: number | null;
            idComision: number | null;
            monto: number;
            moneda: string;
            equivalenteClp: number | null;
            descripcion: string | null;
            fecha: Date;
        }[];
        costoFinanciero: {
            totalesPorMoneda: {
                moneda: string;
                monto: number;
            }[];
            totalClp: number | null;
            conversionPendiente: boolean;
        };
        historial: {
            id: number;
            evento: string;
            detalle: string;
            usuario: string;
            fecha: Date;
        }[];
    }>;
    cerrarFinancieramenteEnvio(idEnvio: number, usuario: bigint): Promise<{
        id: number;
        referencia: string;
        fecha: Date;
        descripcion: string | null;
        estado: string;
        fechaCreacion: Date;
        ordenes: {
            id: number;
            tipo: string;
            idOcs: number | null;
            idExterno: string | null;
            fecha: Date;
        }[];
        costos: {
            id: number;
            tipo: string;
            fuente: string;
            idObligacion: number | null;
            idComision: number | null;
            monto: number;
            moneda: string;
            equivalenteClp: number | null;
            descripcion: string | null;
            fecha: Date;
        }[];
        costoFinanciero: {
            totalesPorMoneda: {
                moneda: string;
                monto: number;
            }[];
            totalClp: number | null;
            conversionPendiente: boolean;
        };
        historial: {
            id: number;
            evento: string;
            detalle: string;
            usuario: string;
            fecha: Date;
        }[];
    }>;
    reabrirEnvio(idEnvio: number, entrada: Entrada, usuario: bigint): Promise<{
        id: number;
        referencia: string;
        fecha: Date;
        descripcion: string | null;
        estado: string;
        fechaCreacion: Date;
        ordenes: {
            id: number;
            tipo: string;
            idOcs: number | null;
            idExterno: string | null;
            fecha: Date;
        }[];
        costos: {
            id: number;
            tipo: string;
            fuente: string;
            idObligacion: number | null;
            idComision: number | null;
            monto: number;
            moneda: string;
            equivalenteClp: number | null;
            descripcion: string | null;
            fecha: Date;
        }[];
        costoFinanciero: {
            totalesPorMoneda: {
                moneda: string;
                monto: number;
            }[];
            totalClp: number | null;
            conversionPendiente: boolean;
        };
        historial: {
            id: number;
            evento: string;
            detalle: string;
            usuario: string;
            fecha: Date;
        }[];
    }>;
    private presentarCajaChica;
    consultarCajaChica(consulta: Entrada): Promise<{
        fondoConfigurado: boolean;
        historialFondo: {
            id: number;
            anterior: number;
            nuevo: number;
            usuario: string;
            fecha: Date;
        }[];
        gastos: {
            id: number;
            monto: number;
            descripcion: string;
            fechaGasto: Date;
            fechaRegistro: Date;
            periodo: string;
            comercioEmisor: string | null;
            estado: string;
            registradoPor: string;
            resueltoPor: string | null;
            fechaResolucion: Date | null;
            condicionAprobacion: string | null;
            motivoRechazo: string | null;
            respaldos: {
                id: number;
                nombreArchivo: string;
                tipo: string | null;
                comercioEmisor: string | null;
                actor: string;
                fecha: Date;
            }[];
            historial: {
                id: number;
                evento: string;
                detalle: string;
                usuario: string;
                fecha: Date;
            }[];
        }[];
        fondo: number;
        reservado: number;
        aprobado: number;
        disponibleProyectado: number;
        periodo: string;
    }>;
    obtenerGastoCajaChica(id: number): Promise<{
        id: number;
        monto: number;
        descripcion: string;
        fechaGasto: Date;
        fechaRegistro: Date;
        periodo: string;
        comercioEmisor: string | null;
        estado: string;
        registradoPor: string;
        resueltoPor: string | null;
        fechaResolucion: Date | null;
        condicionAprobacion: string | null;
        motivoRechazo: string | null;
        respaldos: {
            id: number;
            nombreArchivo: string;
            tipo: string | null;
            comercioEmisor: string | null;
            actor: string;
            fecha: Date;
        }[];
        historial: {
            id: number;
            evento: string;
            detalle: string;
            usuario: string;
            fecha: Date;
        }[];
    }>;
    configurarFondoCajaChica(periodoEntrada: unknown, entrada: Entrada, usuario: bigint): Promise<{
        fondoConfigurado: boolean;
        historialFondo: {
            id: number;
            anterior: number;
            nuevo: number;
            usuario: string;
            fecha: Date;
        }[];
        gastos: {
            id: number;
            monto: number;
            descripcion: string;
            fechaGasto: Date;
            fechaRegistro: Date;
            periodo: string;
            comercioEmisor: string | null;
            estado: string;
            registradoPor: string;
            resueltoPor: string | null;
            fechaResolucion: Date | null;
            condicionAprobacion: string | null;
            motivoRechazo: string | null;
            respaldos: {
                id: number;
                nombreArchivo: string;
                tipo: string | null;
                comercioEmisor: string | null;
                actor: string;
                fecha: Date;
            }[];
            historial: {
                id: number;
                evento: string;
                detalle: string;
                usuario: string;
                fecha: Date;
            }[];
        }[];
        fondo: number;
        reservado: number;
        aprobado: number;
        disponibleProyectado: number;
        periodo: string;
    }>;
    registrarGastoCajaChica(entrada: Entrada, usuario: bigint): Promise<{
        id: number;
        monto: number;
        descripcion: string;
        fechaGasto: Date;
        fechaRegistro: Date;
        periodo: string;
        comercioEmisor: string | null;
        estado: string;
        registradoPor: string;
        resueltoPor: string | null;
        fechaResolucion: Date | null;
        condicionAprobacion: string | null;
        motivoRechazo: string | null;
        respaldos: {
            id: number;
            nombreArchivo: string;
            tipo: string | null;
            comercioEmisor: string | null;
            actor: string;
            fecha: Date;
        }[];
        historial: {
            id: number;
            evento: string;
            detalle: string;
            usuario: string;
            fecha: Date;
        }[];
    }>;
    adjuntarRespaldoCajaChica(id: number, entrada: Entrada, usuario: bigint): Promise<{
        id: number;
        monto: number;
        descripcion: string;
        fechaGasto: Date;
        fechaRegistro: Date;
        periodo: string;
        comercioEmisor: string | null;
        estado: string;
        registradoPor: string;
        resueltoPor: string | null;
        fechaResolucion: Date | null;
        condicionAprobacion: string | null;
        motivoRechazo: string | null;
        respaldos: {
            id: number;
            nombreArchivo: string;
            tipo: string | null;
            comercioEmisor: string | null;
            actor: string;
            fecha: Date;
        }[];
        historial: {
            id: number;
            evento: string;
            detalle: string;
            usuario: string;
            fecha: Date;
        }[];
    }>;
    aprobarGastoCajaChica(id: number, usuario: bigint, perfil: string): Promise<{
        fondoConfigurado: boolean;
        historialFondo: {
            id: number;
            anterior: number;
            nuevo: number;
            usuario: string;
            fecha: Date;
        }[];
        gastos: {
            id: number;
            monto: number;
            descripcion: string;
            fechaGasto: Date;
            fechaRegistro: Date;
            periodo: string;
            comercioEmisor: string | null;
            estado: string;
            registradoPor: string;
            resueltoPor: string | null;
            fechaResolucion: Date | null;
            condicionAprobacion: string | null;
            motivoRechazo: string | null;
            respaldos: {
                id: number;
                nombreArchivo: string;
                tipo: string | null;
                comercioEmisor: string | null;
                actor: string;
                fecha: Date;
            }[];
            historial: {
                id: number;
                evento: string;
                detalle: string;
                usuario: string;
                fecha: Date;
            }[];
        }[];
        fondo: number;
        reservado: number;
        aprobado: number;
        disponibleProyectado: number;
        periodo: string;
    }>;
    rechazarGastoCajaChica(id: number, entrada: Entrada, usuario: bigint): Promise<{
        fondoConfigurado: boolean;
        historialFondo: {
            id: number;
            anterior: number;
            nuevo: number;
            usuario: string;
            fecha: Date;
        }[];
        gastos: {
            id: number;
            monto: number;
            descripcion: string;
            fechaGasto: Date;
            fechaRegistro: Date;
            periodo: string;
            comercioEmisor: string | null;
            estado: string;
            registradoPor: string;
            resueltoPor: string | null;
            fechaResolucion: Date | null;
            condicionAprobacion: string | null;
            motivoRechazo: string | null;
            respaldos: {
                id: number;
                nombreArchivo: string;
                tipo: string | null;
                comercioEmisor: string | null;
                actor: string;
                fecha: Date;
            }[];
            historial: {
                id: number;
                evento: string;
                detalle: string;
                usuario: string;
                fecha: Date;
            }[];
        }[];
        fondo: number;
        reservado: number;
        aprobado: number;
        disponibleProyectado: number;
        periodo: string;
    }>;
    catalogosDocumentosProveedor(): Promise<{
        proveedores: {
            id: number;
            nombre: string;
        }[];
        tipos: {
            id: number;
            nombre: string;
        }[];
        monedas: {
            id: number;
            codigo: string;
        }[];
        categorias: {
            fecha_creacion: Date;
            creado_por: bigint | null;
            id_categoria_egreso_m5: number;
            nombre: string;
            activo: boolean;
            nombre_normalizado: string;
        }[];
        ordenes: {
            id: number;
            idProveedor: number;
            idMoneda: number | null;
            moneda: string;
            monto: number;
            saldoDisponible: number;
            referencia: string | null;
        }[];
        proyectos: {
            id: string;
            nombre: string;
        }[];
        ordenesTrabajo: {
            id: string;
            idProyecto: string | null;
        }[];
    }>;
    listarDocumentosProveedor(consulta: Record<string, unknown>): Promise<({
        id: string;
        fuente: string;
        proveedor: {
            id: number;
            razonSocial: string;
        };
        tipoDocumento: string;
        numero: string;
        fechaEmision: Date;
        fechaVencimiento: Date | null;
        moneda: string;
        montoTotal: number;
        estadoDocumental: string;
        saldoPendiente: number;
        estadoPagoCalculado: "Pendiente" | "Parcial" | "Pagada";
        clasificacionM5: string;
        asociacionOrdenCompra: string;
        observacion: string | null;
    } | {
        id: string;
        idM5: number;
        fuente: string;
        clase: string;
        proveedor: {
            id: number;
            razonSocial: string;
        };
        tipoDocumento: string;
        numero: string;
        fechaEmision: Date;
        fechaVencimiento: Date | null;
        moneda: string;
        montoTotal: number;
        estadoDocumental: string;
        saldoPendiente: number;
        clasificacionM5: string;
        asociacionOrdenCompra: string;
        descripcion: string | null;
        asociaciones: {
            id: number;
            tipoOrden: string;
            idOcs: number | null;
            montoAsignado: number;
            estadoDiferencia: string;
            estadoExcedente: string;
            montoExcedente: number;
            esFinal: boolean;
        }[];
        clasificaciones: {
            id: number;
            idAsociacion: number;
            idCategoria: number;
            categoria: string;
            monto: number;
        }[];
        reclasificaciones: {
            id: number;
            estado: string;
            montoTotal: number;
            umbralSnapshotClp: number;
            motivo: string;
            fecha: Date;
            detalles: {
                idClasificacion: number;
                idCategoriaOrigen: number;
                idCategoriaDestino: number;
                monto: number;
            }[];
        }[];
        propuestaImputacion: {
            id: number;
            estado: string;
            preparadoPor: string;
        } | null;
        imputaciones: {
            id: number;
            idClasificacion: number;
            destino: string;
            idProyecto: string | null;
            idOrdenTrabajo: string | null;
            montoOriginal: number;
            montoVigente: number;
            historialOt: {
                anterior: string | null;
                nueva: string;
                motivo: string;
                fecha: Date;
            }[];
            reasignaciones: {
                id: number;
                estado: string;
                monto: number;
                motivo: string;
                excepcional: boolean;
                detalles: {
                    destino: string;
                    idProyecto: string | null;
                    idOrdenTrabajo: string | null;
                    monto: number;
                }[];
            }[];
        }[];
        progreso: {
            asociaciones: boolean;
            vencimiento: boolean;
            clasificacion: boolean;
            imputacion: string;
            moneda: boolean;
            listoObligacion: boolean;
        };
        obligacion: {
            fecha_generacion: Date;
            id_moneda: number;
            fecha_emision: Date;
            fecha_vencimiento: Date;
            id_proveedor: number;
            saldo_inicial: Prisma.Decimal;
            estado_pago: string;
            id_documento_m5: number;
            condicion_pago_dias_snapshot: number | null;
            condicion_pago_tipo_snapshot: string | null;
            tipo_cambio: Prisma.Decimal | null;
            tipo_cambio_origen: string | null;
            id_obligacion_m5: number;
            monto_original: Prisma.Decimal;
            saldo_actual: Prisma.Decimal;
            condicion_temporal: string | null;
            generado_por: bigint;
        } | null;
        ajuste: {
            id: number;
            tipo: string;
            estado: string;
            idObligacion: number;
            monto: number;
            montoAplicado: number;
            montoSaldoFavor: number;
            fecha: Date;
            motivoAnulacion: string | null;
        } | null;
    })[]>;
    obtenerDocumentoProveedor(referencia: number | string): Promise<{
        id: string;
        fuente: string;
        proveedor: {
            id: number;
            razonSocial: string;
        };
        tipoDocumento: string;
        numero: string;
        fechaEmision: Date;
        fechaVencimiento: Date | null;
        moneda: string;
        montoTotal: number;
        estadoDocumental: string;
        saldoPendiente: number;
        estadoPagoCalculado: "Pendiente" | "Parcial" | "Pagada";
        clasificacionM5: string;
        asociacionOrdenCompra: string;
        observacion: string | null;
    } | {
        id: string;
        idM5: number;
        fuente: string;
        clase: string;
        proveedor: {
            id: number;
            razonSocial: string;
        };
        tipoDocumento: string;
        numero: string;
        fechaEmision: Date;
        fechaVencimiento: Date | null;
        moneda: string;
        montoTotal: number;
        estadoDocumental: string;
        saldoPendiente: number;
        clasificacionM5: string;
        asociacionOrdenCompra: string;
        descripcion: string | null;
        asociaciones: {
            id: number;
            tipoOrden: string;
            idOcs: number | null;
            montoAsignado: number;
            estadoDiferencia: string;
            estadoExcedente: string;
            montoExcedente: number;
            esFinal: boolean;
        }[];
        clasificaciones: {
            id: number;
            idAsociacion: number;
            idCategoria: number;
            categoria: string;
            monto: number;
        }[];
        reclasificaciones: {
            id: number;
            estado: string;
            montoTotal: number;
            umbralSnapshotClp: number;
            motivo: string;
            fecha: Date;
            detalles: {
                idClasificacion: number;
                idCategoriaOrigen: number;
                idCategoriaDestino: number;
                monto: number;
            }[];
        }[];
        propuestaImputacion: {
            id: number;
            estado: string;
            preparadoPor: string;
        } | null;
        imputaciones: {
            id: number;
            idClasificacion: number;
            destino: string;
            idProyecto: string | null;
            idOrdenTrabajo: string | null;
            montoOriginal: number;
            montoVigente: number;
            historialOt: {
                anterior: string | null;
                nueva: string;
                motivo: string;
                fecha: Date;
            }[];
            reasignaciones: {
                id: number;
                estado: string;
                monto: number;
                motivo: string;
                excepcional: boolean;
                detalles: {
                    destino: string;
                    idProyecto: string | null;
                    idOrdenTrabajo: string | null;
                    monto: number;
                }[];
            }[];
        }[];
        progreso: {
            asociaciones: boolean;
            vencimiento: boolean;
            clasificacion: boolean;
            imputacion: string;
            moneda: boolean;
            listoObligacion: boolean;
        };
        obligacion: {
            fecha_generacion: Date;
            id_moneda: number;
            fecha_emision: Date;
            fecha_vencimiento: Date;
            id_proveedor: number;
            saldo_inicial: Prisma.Decimal;
            estado_pago: string;
            id_documento_m5: number;
            condicion_pago_dias_snapshot: number | null;
            condicion_pago_tipo_snapshot: string | null;
            tipo_cambio: Prisma.Decimal | null;
            tipo_cambio_origen: string | null;
            id_obligacion_m5: number;
            monto_original: Prisma.Decimal;
            saldo_actual: Prisma.Decimal;
            condicion_temporal: string | null;
            generado_por: bigint;
        } | null;
        ajuste: {
            id: number;
            tipo: string;
            estado: string;
            idObligacion: number;
            monto: number;
            montoAplicado: number;
            montoSaldoFavor: number;
            fecha: Date;
            motivoAnulacion: string | null;
        } | null;
    }>;
}
export {};
//# sourceMappingURL=M5Controller.d.ts.map