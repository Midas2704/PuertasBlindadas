import { Prisma } from '@prisma/client';
type Entrada = Record<string, unknown>;
type Consulta = Record<string, unknown>;
export type ActorCredito = {
    id: bigint;
    permisos: string[];
    configuracion?: string;
    administrador?: boolean;
};
export declare const validarMontoLimiteGlobalM8: (valor: unknown) => Prisma.Decimal;
export declare class M8Controller {
    private presentar;
    listarSolicitudes(q: Consulta, a: ActorCredito): Promise<{
        total: number;
        solicitudes: {
            id: number;
            tipo: string;
            estado: string;
            fechaCreacion: string;
            fechaActualizacion: string;
            motivo: string | null;
            condicionesSolicitadas: string | null;
            antecedentes: string | null;
            solicitante: {
                id: string;
                nombre: string;
            } | null;
            cliente: {
                idFicha: number;
                idCliente: number;
                nombre: string;
                rut: string | null;
                clasificacion: string;
                estadoContexto: string;
                destino: string;
            };
            contextoComercial: {
                estado: string;
                cotizacion: {
                    id: number;
                    estado: string;
                    monto: number | null;
                    moneda: string;
                    destino: string;
                } | null;
                notaVenta: {
                    id: number;
                    numero: string;
                    estado: string;
                    monto: number;
                    moneda: string;
                    destino: string;
                } | null;
                referencia: string | null;
            };
            resolucion: {
                decision: string;
                motivo: string;
                condiciones: string | null;
                fecha: string;
            } | null;
        }[];
        filtros: {
            estado: string | null;
            tipo: string | null;
        };
    }>;
    listarClientesB2B(q: Consulta, a: ActorCredito): Promise<{
        idCliente: number;
        idFichaCliente: number;
        razonSocial: string;
        rut: string | null;
    }[]>;
    obtenerSolicitud(id: number, a: ActorCredito): Promise<{
        id: number;
        tipo: string;
        estado: string;
        fechaCreacion: string;
        fechaActualizacion: string;
        motivo: string | null;
        condicionesSolicitadas: string | null;
        antecedentes: string | null;
        solicitante: {
            id: string;
            nombre: string;
        } | null;
        cliente: {
            idFicha: number;
            idCliente: number;
            nombre: string;
            rut: string | null;
            clasificacion: string;
            estadoContexto: string;
            destino: string;
        };
        contextoComercial: {
            estado: string;
            cotizacion: {
                id: number;
                estado: string;
                monto: number | null;
                moneda: string;
                destino: string;
            } | null;
            notaVenta: {
                id: number;
                numero: string;
                estado: string;
                monto: number;
                moneda: string;
                destino: string;
            } | null;
            referencia: string | null;
        };
        resolucion: {
            decision: string;
            motivo: string;
            condiciones: string | null;
            fecha: string;
        } | null;
    }>;
    crearSolicitud(tipo: 'INICIAL' | 'EXCEPCION', e: Entrada, a: ActorCredito): Promise<{
        id: number;
        tipo: string;
        estado: string;
        fechaCreacion: string;
        fechaActualizacion: string;
        motivo: string | null;
        condicionesSolicitadas: string | null;
        antecedentes: string | null;
        solicitante: {
            id: string;
            nombre: string;
        } | null;
        cliente: {
            idFicha: number;
            idCliente: number;
            nombre: string;
            rut: string | null;
            clasificacion: string;
            estadoContexto: string;
            destino: string;
        };
        contextoComercial: {
            estado: string;
            cotizacion: {
                id: number;
                estado: string;
                monto: number | null;
                moneda: string;
                destino: string;
            } | null;
            notaVenta: {
                id: number;
                numero: string;
                estado: string;
                monto: number;
                moneda: string;
                destino: string;
            } | null;
            referencia: string | null;
        };
        resolucion: {
            decision: string;
            motivo: string;
            condiciones: string | null;
            fecha: string;
        } | null;
    }>;
    enviarSolicitud(id: number, a: ActorCredito): Promise<{
        id_nota_venta: number | null;
        id_cotizacion: number | null;
        id_ficha_cliente: number;
        fecha_creacion: Date;
        fecha_actualizacion: Date;
        id_solicitud_crediticia: number;
        tipo_solicitud: string;
        estado_solicitud: string;
        id_usuario_solicitante: bigint | null;
        referencia_contexto: string | null;
        antecedentes_resumen: string | null;
        motivo_solicitud: string | null;
        condiciones_solicitadas: string | null;
    }>;
    cancelarSolicitud(id: number, e: Entrada, a: ActorCredito): Promise<{
        id_nota_venta: number | null;
        id_cotizacion: number | null;
        id_ficha_cliente: number;
        fecha_creacion: Date;
        fecha_actualizacion: Date;
        id_solicitud_crediticia: number;
        tipo_solicitud: string;
        estado_solicitud: string;
        id_usuario_solicitante: bigint | null;
        referencia_contexto: string | null;
        antecedentes_resumen: string | null;
        motivo_solicitud: string | null;
        condiciones_solicitadas: string | null;
    }>;
    resolverSolicitud(id: number, e: Entrada, a: ActorCredito): Promise<{
        id: number;
        decision: string;
        ventaM2Modificada: boolean;
    }>;
    modificarCupo(id: number, e: Entrada, a: ActorCredito): Promise<{
        idFicha: number;
        cupo: number;
        utilizado: number;
        sobreCupo: boolean;
    }>;
    private suspension;
    suspenderCredito(id: number, e: Entrada, a: ActorCredito): Promise<{
        idFicha: number;
        suspendido: boolean;
        motivo: string;
    }>;
    reactivarCredito(id: number, e: Entrada, a: ActorCredito): Promise<{
        idFicha: number;
        suspendido: boolean;
        motivo: string;
    }>;
    configurarLimiteGlobal(e: Entrada, a: ActorCredito): Promise<{
        vigencia_desde: Date;
        vigencia_hasta: Date | null;
        motivo: string;
        monto_limite: Prisma.Decimal;
        creado_en: Date;
        id_limite_global: number;
        id_responsable: bigint;
        sustituido_en: Date | null;
    }>;
    consultarExposicion(_q?: Consulta): Promise<{
        estado: string;
        limiteGlobal: number | null;
        exposicionUtilizada: number;
        capacidadDisponible: number | null;
        cupoTotalAgregado: number;
        cupoUtilizadoAgregado: number;
        cupoDisponibleAgregado: number;
        avisoCapacidadProxima: string;
    }>;
    consultarAlertas(_q?: Consulta): Promise<{
        alertas: Record<string, unknown>[];
        criterio: string;
    }>;
    situacionCliente(id: number, a: ActorCredito, perm?: string): Promise<{
        cliente: {
            idFicha: number;
            nombre: any;
            rut: any;
        };
        habilitado: boolean;
        cupo: number | null;
        utilizado: number;
        disponible: number | null;
        vigencia: {
            desde: string | null;
            hasta: string | null;
        };
        suspension: {
            suspendido: boolean;
            motivo: string | null;
        };
        sobreCupo: boolean;
        morosidad: {
            estado: string;
            cantidad: number;
            decisionAutomatica: boolean;
        };
        costoReal: {
            estado: string;
            valor: null;
            contrato: string;
        };
    }>;
    historialCliente(id: number, a: ActorCredito): Promise<{
        eventos: {
            tipo: string;
            motivo: string | null;
            anterior: string | null;
            nuevo: string | null;
            fecha: string;
            responsable: string | null;
        }[];
        solicitudes: {
            id: number;
            tipo: string;
            estado: string;
            decision: string | null;
        }[];
    }>;
    composicionCliente(id: number, a: ActorCredito): Promise<{
        compromisos: {
            id: number;
            operacion: {
                idNota: number;
                numero: string;
            };
            montoOriginal: number;
            montoPendiente: number;
            estado: string;
            condiciones: string | null;
            excepcion: {
                id: number;
                condiciones: string | null | undefined;
            } | null;
            reducciones: {
                idPago: number;
                monto: number;
                fecha: string;
            }[];
        }[];
        totalPendiente: number;
    }>;
    private calcularDistribucion;
    consultarResumenDashboardM7(_q?: Consulta): Promise<{
        totalSolicitudes: number;
        totalCompromisos: number;
        clientesSobreLimite: Record<string, unknown>[];
        clientesSuspendidos: Record<string, unknown>[];
        alertas: Record<string, unknown>[];
        concentracion: {
            exposicionTotal: number;
            clientes: Record<string, unknown>[];
        };
        estado: string;
        limiteGlobal: number | null;
        exposicionUtilizada: number;
        capacidadDisponible: number | null;
        cupoTotalAgregado: number;
        cupoUtilizadoAgregado: number;
        cupoDisponibleAgregado: number;
        avisoCapacidadProxima: string;
    }>;
    distribucion(a: ActorCredito): Promise<{
        exposicionTotal: number;
        clientes: Record<string, unknown>[];
    }>;
    validarFormalizacion(e: Entrada, a: ActorCredito): Promise<{
        resultado: "REQUIERE_SOLICITUD_INICIAL";
        motivos: string[];
        idSolicitudExcepcion?: undefined;
    } | {
        resultado: "AUTORIZADO";
        motivos: never[];
        idSolicitudExcepcion: null;
    } | {
        resultado: "RESTRINGIDO";
        motivos: string[];
        idSolicitudExcepcion?: undefined;
    } | {
        resultado: "AUTORIZADO";
        motivos: string[];
        idSolicitudExcepcion: number;
    } | {
        resultado: "REQUIERE_EXCEPCION";
        motivos: string[];
        idSolicitudExcepcion?: undefined;
    }>;
    exportar(origen: string, q: Consulta, a: ActorCredito): Promise<{
        total: number;
        nombre: string;
        tipo: string;
        mime: string;
        contenido: string;
    }>;
}
export {};
//# sourceMappingURL=M8Controller.d.ts.map