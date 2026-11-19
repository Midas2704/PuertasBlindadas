import { Prisma } from '@prisma/client';
type Entrada = Record<string, any>;
type ActorContextualM12 = {
    permisos?: readonly string[];
};
export type EstadoReferenciaM12 = 'REFERENCIA_CONFIRMADA' | 'REFERENCIA_NO_ENCONTRADA' | 'FUENTE_NO_DISPONIBLE' | 'IDENTIDAD_AMBIGUA';
export type ResultadoCoherenciaM12 = {
    estado: EstadoReferenciaM12;
    compatible: boolean;
    motivo: string;
    requiereRevisionHumana: boolean;
};
export declare const resolverEstadoReferenciaM12: (cantidad: number, coincidenciasExactas?: number) => EstadoReferenciaM12;
export declare const exigirConfirmacionHumanaObraDistintaM12: (cantidadCandidatas: number, declaracion: unknown) => void;
export declare const filtroCotizacionesContextualesM12: (entrada: {
    idObra?: bigint | null;
    idProyecto?: bigint | null;
    idCotizacion?: number | null;
}) => Prisma.cotizacionWhereInput;
export declare const estadoIdentidadContextualM12: (entrada: {
    obraEncontrada: boolean;
    proyectosEncontrados: number;
    clientesEncontrados?: number;
    vinculoAmbiguo?: boolean;
}) => EstadoReferenciaM12;
type ContactoContextualM12 = {
    id_contacto_cotizacion_b2b: bigint;
    nombre: string;
    apellido: string | null;
    cargo: string | null;
    correo: string | null;
    telefono: string | null;
    tipo_contacto: string;
    es_principal: boolean;
    estado: string;
};
export declare const presentarContactosContextualesM12: (contactos: ContactoContextualM12[]) => {
    id: string;
    nombre: string;
    apellido: string | null;
    cargo: string | null;
    correo: string | null;
    telefono: string | null;
    funcion: string;
    principal: boolean;
    estado: string;
    vigencia: null;
    vigenciaEstado: "NO_ACREDITADA";
    procedencia: string;
}[];
export declare const fuenteAutorizadaM12: (origen: "M2" | "TERRENO" | "INVENTARIO" | "M3" | "M7", permisos: readonly string[]) => boolean;
export declare const alcanceIdentidadM12: (consulta: Entrada, actor?: ActorContextualM12) => {
    puedeVerProyectos: boolean;
    puedeVerClientes: boolean;
    puedeConsultarM2: boolean;
};
type ClienteContextualM12 = {
    id_cliente_financiero: number;
    rut_cliente: string | null;
    nombre_razon_social_referencia: string;
    estado_financiero: string;
};
export declare const presentarClientesContextualesM12: (clientes: ClienteContextualM12[], autorizado: boolean) => {
    cliente: null;
    clientes: never[];
    acceso: "ACCESO_RESTRINGIDO";
} | {
    cliente: {
        id: number;
        rut: string | null;
        nombre: string;
        estado: string;
        procedencia: string;
    } | null;
    clientes: {
        id: number;
        rut: string | null;
        nombre: string;
        estado: string;
        procedencia: string;
    }[];
    acceso: "AUTORIZADO";
};
export declare const presentarServicioTerrenoContextualM12: (servicio: {
    servicio_terreno_servicio_terreno_id: bigint;
    servicio_terreno_tipo_servicio: string | null;
    servicio_terreno_fecha_real: Date | null;
    servicio_terreno_estado: string | null;
}, idObra: bigint) => {
    referencia: string;
    proyecto: null;
    obra: string;
    fecha: Date | null;
    estado: string | null;
    tipo: string | null;
    atribucion: "CONTEXTO_OBRA";
    noAtribuibleProyecto: boolean;
};
/** CUT463: valida referencias ya acreditadas; nunca crea, fusiona ni reasigna entidades. */
export declare const validarCoherenciaContextualM12: (entrada: {
    fuenteDisponible?: boolean;
    requiereObra?: boolean;
    idObra?: string | null;
    idObraProyecto?: string | null;
    idProyecto?: string | null;
    idProyectoOrdenTrabajo?: string | null;
    idCotizacion?: string | null;
    idCotizacionOrigenProyecto?: string | null;
    proyectoEncontrado?: boolean;
}) => ResultadoCoherenciaM12;
export declare const normalizarParteUbicacion: (valor: unknown) => string;
export declare const claveUbicacionObra: (entrada: Entrada) => string;
export declare class ServicioObraProyectoComercial {
    buscar(consulta: Entrada): Promise<{
        obras: {
            id: any;
            nombre: any;
            referencia: any;
            direccion: any;
            region: any;
            ciudad: any;
            comuna: any;
            edificio: any;
            unidad: any;
            estado: any;
            revision: any;
            coincidencia: string;
        }[];
        requiereSeleccionExplicita: boolean;
        estadoReferencia: EstadoReferenciaM12;
        procedencia: string;
    }>;
    /** CUT462: lectura diferenciada de Cliente, Proyecto y Obra, sin efectos secundarios. */
    resolverIdentidades(consulta: Entrada, actor?: ActorContextualM12): Promise<{
        estado: "REFERENCIA_NO_ENCONTRADA";
        procedencia: string;
        cliente: null;
        obra: null;
        proyectos: never[];
        alcanceConsulta?: undefined;
        acceso?: undefined;
        clientes?: undefined;
    } | {
        estado: "IDENTIDAD_AMBIGUA";
        procedencia: string;
        cliente: null;
        obra: null;
        proyectos: never[];
        alcanceConsulta?: undefined;
        acceso?: undefined;
        clientes?: undefined;
    } | {
        estado: EstadoReferenciaM12;
        alcanceConsulta: string;
        acceso: {
            clientes: "ACCESO_RESTRINGIDO" | "AUTORIZADO";
            proyectos: string;
        };
        procedencia: string;
        cliente: {
            id: number;
            rut: string | null;
            nombre: string;
            estado: string;
            procedencia: string;
        } | null;
        clientes: never[] | {
            id: number;
            rut: string | null;
            nombre: string;
            estado: string;
            procedencia: string;
        }[];
        obra: {
            id: any;
            nombre: any;
            referencia: any;
            direccion: any;
            region: any;
            ciudad: any;
            comuna: any;
            edificio: any;
            unidad: any;
            estado: any;
            revision: any;
            coincidencia: string;
        } | null;
        proyectos: {
            id: string;
            codigo: string | null;
            nombre: string | null;
            estadoOperacional: string | null;
            estadoProduccion: string | null;
            idCotizacionOrigen: number | null;
            obras: {
                id: string;
                principal: boolean;
                origen: string;
            }[];
            procedencia: string;
        }[];
    } | {
        estado: "FUENTE_NO_DISPONIBLE";
        procedencia: string;
        cliente: null;
        obra: null;
        proyectos: never[];
        alcanceConsulta?: undefined;
        acceso?: undefined;
        clientes?: undefined;
    }>;
    /** CUT464: compone referencias mínimas desde cada owner; no replica sus históricos. */
    consultarAntecedentes(consulta: Entrada, actor?: ActorContextualM12): Promise<{
        identidad: {
            estado: "REFERENCIA_NO_ENCONTRADA";
            procedencia: string;
            cliente: null;
            obra: null;
            proyectos: never[];
            alcanceConsulta?: undefined;
            acceso?: undefined;
            clientes?: undefined;
        } | {
            estado: EstadoReferenciaM12;
            alcanceConsulta: string;
            acceso: {
                clientes: "ACCESO_RESTRINGIDO" | "AUTORIZADO";
                proyectos: string;
            };
            procedencia: string;
            cliente: {
                id: number;
                rut: string | null;
                nombre: string;
                estado: string;
                procedencia: string;
            } | null;
            clientes: never[] | {
                id: number;
                rut: string | null;
                nombre: string;
                estado: string;
                procedencia: string;
            }[];
            obra: {
                id: any;
                nombre: any;
                referencia: any;
                direccion: any;
                region: any;
                ciudad: any;
                comuna: any;
                edificio: any;
                unidad: any;
                estado: any;
                revision: any;
                coincidencia: string;
            } | null;
            proyectos: {
                id: string;
                codigo: string | null;
                nombre: string | null;
                estadoOperacional: string | null;
                estadoProduccion: string | null;
                idCotizacionOrigen: number | null;
                obras: {
                    id: string;
                    principal: boolean;
                    origen: string;
                }[];
                procedencia: string;
            }[];
        } | {
            estado: "FUENTE_NO_DISPONIBLE";
            procedencia: string;
            cliente: null;
            obra: null;
            proyectos: never[];
            alcanceConsulta?: undefined;
            acceso?: undefined;
            clientes?: undefined;
        };
        fuentes: never[];
        proyectos?: undefined;
        contextoObra?: undefined;
    } | {
        identidad: {
            estado: "IDENTIDAD_AMBIGUA";
            procedencia: string;
            cliente: null;
            obra: null;
            proyectos: never[];
            alcanceConsulta?: undefined;
            acceso?: undefined;
            clientes?: undefined;
        } | {
            estado: EstadoReferenciaM12;
            alcanceConsulta: string;
            acceso: {
                clientes: "ACCESO_RESTRINGIDO" | "AUTORIZADO";
                proyectos: string;
            };
            procedencia: string;
            cliente: {
                id: number;
                rut: string | null;
                nombre: string;
                estado: string;
                procedencia: string;
            } | null;
            clientes: never[] | {
                id: number;
                rut: string | null;
                nombre: string;
                estado: string;
                procedencia: string;
            }[];
            obra: {
                id: any;
                nombre: any;
                referencia: any;
                direccion: any;
                region: any;
                ciudad: any;
                comuna: any;
                edificio: any;
                unidad: any;
                estado: any;
                revision: any;
                coincidencia: string;
            } | null;
            proyectos: {
                id: string;
                codigo: string | null;
                nombre: string | null;
                estadoOperacional: string | null;
                estadoProduccion: string | null;
                idCotizacionOrigen: number | null;
                obras: {
                    id: string;
                    principal: boolean;
                    origen: string;
                }[];
                procedencia: string;
            }[];
        };
        fuentes: {
            origen: string;
            disponibilidad: string;
            alcanceAutorizado: boolean;
            antecedentes: unknown[];
        }[];
        proyectos: {
            proyecto: {
                id: string;
                codigo: string | null;
                nombre: string | null;
                estadoOperacional: string | null;
                estadoProduccion: string | null;
                idCotizacionOrigen: number | null;
                obras: {
                    id: string;
                    principal: boolean;
                    origen: string;
                }[];
                procedencia: string;
            };
            antecedentes: {
                origen: string;
            }[];
        }[];
        contextoObra: {
            origen: string;
        }[];
    }>;
    registrar(entrada: Entrada, actorId: bigint): Promise<{
        id: any;
        nombre: any;
        referencia: any;
        direccion: any;
        region: any;
        ciudad: any;
        comuna: any;
        edificio: any;
        unidad: any;
        estado: any;
        revision: any;
        coincidencia: string;
    } & {
        creadoPor: string;
        __auditoriaM9: {
            nuevo: {
                idObra: string;
                claveUbicacion: string;
            };
        };
    }>;
    vincularCotizacion(idCotizacion: number, entrada: Entrada, actorId: bigint): Promise<{
        idCotizacion: number;
        idObra: string;
        revision: number;
        actor: string;
    } & {
        __auditoriaM9: {
            anterior: {
                idObra: string | null;
            };
            nuevo: {
                idObra: string;
                revision: number;
                motivo: string | null;
            };
        };
    }>;
}
export declare function formalizarProyectoCotizacion(tx: Prisma.TransactionClient, idCotizacion: number): Promise<{
    rut_cliente: string | null;
    proyecto_proyecto_id: bigint;
    proyecto_codigo_proyecto: string | null;
    proyecto_nombre_referencia: string | null;
    proyecto_fecha_instalacion: Date | null;
    proyecto_fecha_ingreso: Date | null;
    proyecto_estado_operacional: string | null;
    proyecto_estado_produccion: string | null;
    id_cotizacion_origen: number | null;
}>;
export {};
//# sourceMappingURL=ServicioObraProyectoComercial.d.ts.map