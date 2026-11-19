import { FuentePagoRemuneracion } from '../servicios/FuentePagoRemuneracion';
import { RepositorioPagoRemuneracionPrisma } from '../servicios/RepositorioPagoRemuneracion';
import { CorreoDocumental } from '../utilidades/correo';
import { AuditoriaDocumental, CondicionDocumento } from '../servicios/AuditoriaDocumental';
interface ActorDocumentoM6 {
    id: bigint;
    alcanceEmpleadoId?: number | null;
}
interface ActorTerrenoM6 {
    id: bigint;
    administrador: boolean;
    administradorOriginal?: boolean;
    permisos?: string[];
    alcanceEmpleadoId?: number | null;
}
interface ActorIncidenciaM6 {
    id: bigint;
    permisos: string[];
}
export declare function validarRevisionIncidenciaM6(entrada: {
    estadoRevision: string;
    idCreador: bigint | null;
    idRevisor: bigint;
    idCategoria: number | null;
    cantidadEvidencias: number;
    decision: 'aprobada' | 'rechazada';
}): void;
export declare function validarTransicionResolucionIncidenciaM6(entrada: {
    accion: 'corregir' | 'cerrar';
    estado: string;
    estadoRevision: string;
    confirmado?: boolean;
}): void;
export declare function clasificarResultadoInstalacion(estadoVisita: string | null, resultado: string | null): "PENDIENTE" | "REPROGRAMACION_NECESARIA" | "PARCIALMENTE_REALIZADA" | "VISITA_NO_EJECUTADA" | "INSTALACION_COMPLETADA" | "RESULTADO_REGISTRADO";
export declare class M6Controller {
    private readonly repositorioPago;
    private readonly correoDocumental;
    private readonly auditoriaDocumental;
    private readonly fuentePagoRemuneracion;
    constructor(fuentePagoRemuneracion?: FuentePagoRemuneracion, repositorioPago?: RepositorioPagoRemuneracionPrisma, correoDocumental?: CorreoDocumental, auditoriaDocumental?: AuditoriaDocumental);
    crearEmpleado(entrada: Record<string, unknown>): Promise<{
        id: number;
        rut: string;
        nombres: string;
        apellidoPaterno: string;
        apellidoMaterno: string | null;
        nombreCompleto: string;
        fechaNacimiento: Date | null;
        estado: string;
        cargoActual: string | null;
        areaActual: {
            id: string;
            nombre: string | null;
        } | null;
    }>;
    listarEmpleados(consulta: Record<string, unknown>): Promise<{
        id: number;
        rut: string;
        nombreCompleto: string;
        estado: string;
        cargoActual: string | null;
        areaActual: {
            id: string;
            nombre: string | null;
        } | null;
    }[]>;
    obtenerEmpleado(id: number): Promise<{
        id: number;
        rut: string;
        nombres: string;
        apellidoPaterno: string;
        apellidoMaterno: string | null;
        nombreCompleto: string;
        fechaNacimiento: Date | null;
        estado: string;
        cargoActual: string | null;
        areaActual: {
            id: string;
            nombre: string | null;
        } | null;
    }>;
    listarAreasTrabajo(incluirInactivas?: boolean): Promise<{
        id: string;
        nombre: string;
        descripcion: string;
        activa: boolean;
        empleadosActivos: number;
    }[]>;
    crearAreaTrabajo(entrada: Record<string, unknown>): Promise<{
        id: string;
        nombre: string;
        descripcion: string;
        activa: boolean;
        empleadosActivos: number;
    }[]>;
    actualizarAreaTrabajo(id: bigint, entrada: Record<string, unknown>): Promise<{
        id: string;
        nombre: string;
        descripcion: string;
        activa: boolean;
        empleadosActivos: number;
    }[]>;
    cambiarEstadoAreaTrabajo(id: bigint, activa: boolean): Promise<{
        id: string;
        nombre: string;
        descripcion: string;
        activa: boolean;
        empleadosActivos: number;
    }[]>;
    listarEmpleadosArea(idArea: bigint): Promise<{
        id: number;
        rut: string;
        nombreCompleto: string;
        cargoActual: string | null;
    }[]>;
    obtenerHistorialAreaEmpleado(idEmpleado: number): Promise<{
        id: number;
        area: {
            id: string;
            nombre: string | null;
        };
        vigenciaDesde: Date;
        vigenciaHasta: Date | null;
        motivo: string;
        asignadoPor: string | null;
        finalizadoPor: string | null;
    }[]>;
    asignarAreaEmpleado(idEmpleado: number, entrada: Record<string, unknown>, actorId: bigint): Promise<{
        id: number;
        area: {
            id: string;
            nombre: string | null;
        };
        vigenciaDesde: Date;
        vigenciaHasta: Date | null;
        motivo: string;
        asignadoPor: string | null;
        finalizadoPor: string | null;
    }[]>;
    obtenerHistorialRemuneracional(idEmpleado: number, consulta?: Record<string, unknown>): Promise<{
        empleado: {
            id: number;
            rut: string;
            nombreCompleto: string;
        };
        filtros: {
            anio: number | null;
            desde: Date | null;
            hasta: Date | null;
            tipoEvento: string;
        };
        periodos: any[];
    }>;
    catalogosLaborales(): Promise<{
        tiposVinculo: {
            id: number;
            nombre: string;
        }[];
    }>;
    actualizarDatosBaseEmpleado(id: number, entrada: Record<string, unknown>): Promise<{
        id: number;
        rut: string;
        nombres: string;
        apellidoPaterno: string;
        apellidoMaterno: string | null;
        nombreCompleto: string;
        fechaNacimiento: Date | null;
        estado: string;
        cargoActual: string | null;
        areaActual: {
            id: string;
            nombre: string | null;
        } | null;
    }>;
    private presentarRelacion;
    listarRelacionesLaborales(idEmpleado: number): Promise<{
        id: number;
        fechaInicio: Date;
        fechaTermino: Date | null;
        estado: string;
        idTipoVinculo: number | null;
        tipoVinculo: string | null;
        jornada: string | null;
    }[]>;
    private validarPeriodosCerradosParaIntervalos;
    crearRelacionLaboral(idEmpleado: number, entrada: Record<string, unknown>): Promise<{
        id: number;
        fechaInicio: Date;
        fechaTermino: Date | null;
        estado: string;
        idTipoVinculo: number | null;
        tipoVinculo: string | null;
        jornada: string | null;
    }[]>;
    actualizarRelacionLaboral(idEmpleado: number, idRelacion: number, entrada: Record<string, unknown>): Promise<{
        id: number;
        fechaInicio: Date;
        fechaTermino: Date | null;
        estado: string;
        idTipoVinculo: number | null;
        tipoVinculo: string | null;
        jornada: string | null;
    }[]>;
    catalogosRemuneracionales(): Promise<{
        cargos: {
            id: number;
            nombre: string;
        }[];
        afps: {
            id: number;
            nombre: string;
        }[];
        institucionesSalud: {
            id: number;
            nombre: string;
            tipo: string | null;
        }[];
    }>;
    obtenerPerfilRemuneracional(idEmpleado: number): Promise<{
        idEmpleado: number;
        idCargo: number | null;
        cargo: string | null;
        sueldoBaseActual: number | null;
        fechaAplicacionSueldoBase: Date | null;
        idAfp: number | null;
        afp: string | null;
        idInstitucionSalud: number | null;
        institucionSalud: string | null;
        tipoInstitucionSalud: string | null;
        seguroCesantia: boolean;
        fundamentoExclusionCesantia: string | null;
        cotizacionSalud: {
            valor: number;
            unidad: string;
            vigenciaDesde: Date;
            vigenciaHasta: Date | null;
        } | null;
        correoParticular: string | null;
        telefonoParticular: string | null;
        direccionParticular: string | null;
        tipoCorreo: string | null;
        consentimientoElectronico: boolean | null;
        canalDocumental: string | null;
    }>;
    actualizarPerfilRemuneracional(idEmpleado: number, entrada: Record<string, unknown>): Promise<{
        idEmpleado: number;
        idCargo: number | null;
        cargo: string | null;
        sueldoBaseActual: number | null;
        fechaAplicacionSueldoBase: Date | null;
        idAfp: number | null;
        afp: string | null;
        idInstitucionSalud: number | null;
        institucionSalud: string | null;
        tipoInstitucionSalud: string | null;
        seguroCesantia: boolean;
        fundamentoExclusionCesantia: string | null;
        cotizacionSalud: {
            valor: number;
            unidad: string;
            vigenciaDesde: Date;
            vigenciaHasta: Date | null;
        } | null;
        correoParticular: string | null;
        telefonoParticular: string | null;
        direccionParticular: string | null;
        tipoCorreo: string | null;
        consentimientoElectronico: boolean | null;
        canalDocumental: string | null;
    }>;
    private intervalo;
    private conflictoConcurrente;
    catalogosAsignacionEsquemas(): Promise<{
        id: number;
        codigo: string;
        nombre: string;
        vigenciaDesde: Date;
        vigenciaHasta: Date | null;
    }[]>;
    listarAsignacionesEsquemaEmpleado(idEmpleado: number): Promise<{
        id: number;
        idEsquema: number;
        esquema: string;
        origen: string;
        vigenciaDesde: Date;
        vigenciaHasta: Date | null;
        activa: boolean;
    }[]>;
    asignarEsquemaEmpleado(idEmpleado: number, entrada: Record<string, unknown>): Promise<{
        id: number;
        idEsquema: number;
        esquema: string;
        origen: string;
        vigenciaDesde: Date;
        vigenciaHasta: Date | null;
        activa: boolean;
    }[]>;
    finalizarAsignacionEsquemaEmpleado(idEmpleado: number, idAsignacion: number, entrada: Record<string, unknown>): Promise<{
        id: number;
        idEsquema: number;
        esquema: string;
        origen: string;
        vigenciaDesde: Date;
        vigenciaHasta: Date | null;
        activa: boolean;
    }[]>;
    catalogoHaberes(): Promise<{
        id: number;
        codigo: string | null;
        nombre: string;
    }[]>;
    listarAsignacionesHaberEmpleado(idEmpleado: number): Promise<{
        id: number;
        idConcepto: number;
        concepto: string;
        vigenciaDesde: Date;
        vigenciaHasta: Date | null;
        valorAplicable: number | null;
        activa: boolean;
    }[]>;
    asignarHaberEmpleado(idEmpleado: number, entrada: Record<string, unknown>): Promise<{
        id: number;
        idConcepto: number;
        concepto: string;
        vigenciaDesde: Date;
        vigenciaHasta: Date | null;
        valorAplicable: number | null;
        activa: boolean;
    }[]>;
    finalizarAsignacionHaberEmpleado(idEmpleado: number, idAsignacion: number, entrada: Record<string, unknown>): Promise<{
        id: number;
        idConcepto: number;
        concepto: string;
        vigenciaDesde: Date;
        vigenciaHasta: Date | null;
        valorAplicable: number | null;
        activa: boolean;
    }[]>;
    private configuracionDocumental;
    obtenerConfiguracionDocumental(idEmpleado: number): Promise<{
        consentimientoElectronico: any;
        canalDocumental: any;
        correoParticular: any;
        correoCorporativo: any;
        canalesDisponibles: string[];
    }>;
    actualizarConfiguracionDocumental(idEmpleado: number, entrada: Record<string, unknown>): Promise<{
        consentimientoElectronico: any;
        canalDocumental: any;
        correoParticular: any;
        correoCorporativo: any;
        canalesDisponibles: string[];
    }>;
    listarEsquemas(): Promise<{
        id: number;
        codigo: string;
        nombre: string;
        descripcion: string | null;
        estado: string;
        vigenciaDesde: Date;
        vigenciaHasta: Date | null;
        cargos: {
            idAsignacion: number;
            idCargo: number | null;
            cargo: string | undefined;
            vigenciaDesde: Date;
            vigenciaHasta: Date | null;
            activa: boolean;
        }[];
    }[]>;
    catalogoCargosEsquemas(): Promise<{
        id: number;
        nombre: string;
    }[]>;
    crearEsquema(entrada: Record<string, unknown>): Promise<{
        id: number;
        codigo: string;
        nombre: string;
        descripcion: string | null;
        estado: string;
        vigenciaDesde: Date;
        vigenciaHasta: Date | null;
        cargos: {
            idAsignacion: number;
            idCargo: number | null;
            cargo: string | undefined;
            vigenciaDesde: Date;
            vigenciaHasta: Date | null;
            activa: boolean;
        }[];
    }[]>;
    actualizarEsquema(idEsquema: number, entrada: Record<string, unknown>): Promise<{
        id: number;
        codigo: string;
        nombre: string;
        descripcion: string | null;
        estado: string;
        vigenciaDesde: Date;
        vigenciaHasta: Date | null;
        cargos: {
            idAsignacion: number;
            idCargo: number | null;
            cargo: string | undefined;
            vigenciaDesde: Date;
            vigenciaHasta: Date | null;
            activa: boolean;
        }[];
    }[]>;
    asignarEsquemaCargo(idEsquema: number, entrada: Record<string, unknown>): Promise<{
        id: number;
        codigo: string;
        nombre: string;
        descripcion: string | null;
        estado: string;
        vigenciaDesde: Date;
        vigenciaHasta: Date | null;
        cargos: {
            idAsignacion: number;
            idCargo: number | null;
            cargo: string | undefined;
            vigenciaDesde: Date;
            vigenciaHasta: Date | null;
            activa: boolean;
        }[];
    }[]>;
    listarTarifasEsquema(idEsquema: number, fecha?: unknown): Promise<{
        id: number;
        modalidad: string;
        valor: number | null;
        reglaTipo: string | null;
        referencia: string | null;
        unidad: string | null;
        tipoAplicacion: string | null;
        vigenciaDesde: Date;
        vigenciaHasta: Date | null;
        esExcepcion: boolean;
        estadoRevision: string;
        causaBloqueo: string | null;
    }[]>;
    crearTarifaEsquema(idEsquema: number, entrada: Record<string, unknown>): Promise<{
        id: number;
        modalidad: string;
        valor: number | null;
        reglaTipo: string | null;
        referencia: string | null;
        unidad: string | null;
        tipoAplicacion: string | null;
        vigenciaDesde: Date;
        vigenciaHasta: Date | null;
        esExcepcion: boolean;
        estadoRevision: string;
        causaBloqueo: string | null;
    }[]>;
    revisarTarifaEsquema(idEsquema: number, idTarifa: number): Promise<{
        id: number;
        modalidad: string;
        valor: number | null;
        reglaTipo: string | null;
        referencia: string | null;
        unidad: string | null;
        tipoAplicacion: string | null;
        vigenciaDesde: Date;
        vigenciaHasta: Date | null;
        esExcepcion: boolean;
        estadoRevision: string;
        causaBloqueo: string | null;
    }[]>;
    listarHaberes(): Promise<{
        id: number;
        codigo: string | null;
        nombre: string;
        descripcion: string | null;
        estado: string;
        configuraciones: {
            id: number;
            modalidad: string;
            valor: number | null;
            reglaTipo: string | null;
            vigenciaDesde: Date;
            vigenciaHasta: Date | null;
            esExcepcion: boolean;
            activa: boolean;
        }[];
    }[]>;
    crearHaber(entrada: Record<string, unknown>): Promise<{
        id: number;
        codigo: string | null;
        nombre: string;
        descripcion: string | null;
        estado: string;
        configuraciones: {
            id: number;
            modalidad: string;
            valor: number | null;
            reglaTipo: string | null;
            vigenciaDesde: Date;
            vigenciaHasta: Date | null;
            esExcepcion: boolean;
            activa: boolean;
        }[];
    }[]>;
    actualizarHaber(idConcepto: number, entrada: Record<string, unknown>): Promise<{
        id: number;
        codigo: string | null;
        nombre: string;
        descripcion: string | null;
        estado: string;
        configuraciones: {
            id: number;
            modalidad: string;
            valor: number | null;
            reglaTipo: string | null;
            vigenciaDesde: Date;
            vigenciaHasta: Date | null;
            esExcepcion: boolean;
            activa: boolean;
        }[];
    }[]>;
    crearConfiguracionHaber(idConcepto: number, entrada: Record<string, unknown>): Promise<{
        id: number;
        codigo: string | null;
        nombre: string;
        descripcion: string | null;
        estado: string;
        configuraciones: {
            id: number;
            modalidad: string;
            valor: number | null;
            reglaTipo: string | null;
            vigenciaDesde: Date;
            vigenciaHasta: Date | null;
            esExcepcion: boolean;
            activa: boolean;
        }[];
    }[]>;
    resolverConfiguracionHaber(idConcepto: number, fecha: unknown): Promise<{
        id: number;
        modalidad: string;
        valor: number | null;
        reglaTipo: string | null;
        vigenciaDesde: Date;
        vigenciaHasta: Date | null;
        esExcepcion: boolean;
    }>;
    private presentarParametro;
    listarParametrosRemuneracionales(tipo?: unknown): Promise<{
        id: number;
        codigo: string;
        tipo: string;
        nombre: string;
        descripcion: string | null;
        valor: number | null;
        unidad: string | null;
        vigenciaDesde: Date;
        vigenciaHasta: Date | null;
        fuente: string | null;
        referencia: string | null;
        estado: string;
    }[]>;
    private crearParametroTipado;
    crearParametroRemuneracional(entrada: Record<string, unknown>): Promise<{
        id: number;
        codigo: string;
        tipo: string;
        nombre: string;
        descripcion: string | null;
        valor: number | null;
        unidad: string | null;
        vigenciaDesde: Date;
        vigenciaHasta: Date | null;
        fuente: string | null;
        referencia: string | null;
        estado: string;
    }[]>;
    actualizarParametroRemuneracional(id: number, entrada: Record<string, unknown>): Promise<{
        id: number;
        codigo: string;
        tipo: string;
        nombre: string;
        descripcion: string | null;
        valor: number | null;
        unidad: string | null;
        vigenciaDesde: Date;
        vigenciaHasta: Date | null;
        fuente: string | null;
        referencia: string | null;
        estado: string;
    }[]>;
    resolverParametroRemuneracional(codigoEntrada: unknown, fecha: unknown): Promise<{
        id: number;
        codigo: string;
        tipo: string;
        nombre: string;
        descripcion: string | null;
        valor: number | null;
        unidad: string | null;
        vigenciaDesde: Date;
        vigenciaHasta: Date | null;
        fuente: string | null;
        referencia: string | null;
        estado: string;
    }>;
    listarTramosImpuestoRenta(fecha?: unknown): Promise<{
        id: number;
        vigenciaDesde: Date;
        vigenciaHasta: Date | null;
        orden: number;
        limiteDesde: number;
        limiteHasta: number | null;
        factor: number;
        rebaja: number;
        unidad: string;
        fuente: string | null;
        referencia: string | null;
        estado: string;
    }[]>;
    crearTramoImpuestoRenta(entrada: Record<string, unknown>): Promise<{
        id: number;
        vigenciaDesde: Date;
        vigenciaHasta: Date | null;
        orden: number;
        limiteDesde: number;
        limiteHasta: number | null;
        factor: number;
        rebaja: number;
        unidad: string;
        fuente: string | null;
        referencia: string | null;
        estado: string;
    }[]>;
    listarConceptosDeduccionAporte(): Promise<{
        id: number;
        codigo: string | null;
        nombre: string;
        descripcion: string | null;
        naturaleza: string;
        estado: string;
        configuraciones: {
            id: number;
            modalidad: string;
            valor: number | null;
            reglaTipo: string | null;
            vigenciaDesde: Date;
            vigenciaHasta: Date | null;
            activa: boolean;
        }[];
    }[]>;
    crearConceptoDeduccionAporte(entrada: Record<string, unknown>): Promise<{
        id: number;
        codigo: string | null;
        nombre: string;
        descripcion: string | null;
        naturaleza: string;
        estado: string;
        configuraciones: {
            id: number;
            modalidad: string;
            valor: number | null;
            reglaTipo: string | null;
            vigenciaDesde: Date;
            vigenciaHasta: Date | null;
            activa: boolean;
        }[];
    }[]>;
    actualizarConceptoDeduccionAporte(id: number, entrada: Record<string, unknown>): Promise<{
        id: number;
        codigo: string | null;
        nombre: string;
        descripcion: string | null;
        naturaleza: string;
        estado: string;
        configuraciones: {
            id: number;
            modalidad: string;
            valor: number | null;
            reglaTipo: string | null;
            vigenciaDesde: Date;
            vigenciaHasta: Date | null;
            activa: boolean;
        }[];
    }[]>;
    listarConfiguracionProrrateo(fecha?: unknown): Promise<{
        id: number;
        codigo: string;
        tipo: string;
        nombre: string;
        descripcion: string | null;
        valor: number | null;
        unidad: string | null;
        vigenciaDesde: Date;
        vigenciaHasta: Date | null;
        fuente: string | null;
        referencia: string | null;
        estado: string;
    }[]>;
    crearConfiguracionProrrateo(entrada: Record<string, unknown>): Promise<{
        id: number;
        codigo: string;
        tipo: string;
        nombre: string;
        descripcion: string | null;
        valor: number | null;
        unidad: string | null;
        vigenciaDesde: Date;
        vigenciaHasta: Date | null;
        fuente: string | null;
        referencia: string | null;
        estado: string;
    }[]>;
    listarPoliticasConservacion(fecha?: unknown): Promise<{
        id: number;
        estado: string;
        criterioDescriptivo: string | null;
        fuente: string | null;
        referencia: string | null;
        vigenciaDesde: Date;
        vigenciaHasta: Date | null;
        ejecutaTratamiento: boolean;
    }[]>;
    crearPoliticaConservacion(entrada: Record<string, unknown>): Promise<{
        id: number;
        estado: string;
        criterioDescriptivo: string | null;
        fuente: string | null;
        referencia: string | null;
        vigenciaDesde: Date;
        vigenciaHasta: Date | null;
        ejecutaTratamiento: boolean;
    }[]>;
    listarMediosPagoM6(soloActivos?: boolean): Promise<{
        id: number;
        codigo: string | null;
        nombre: string;
        descripcion: string | null;
        estado: string;
        requiereRespaldo: boolean | null;
    }[]>;
    crearMedioPagoM6(entrada: Record<string, unknown>): Promise<{
        id: number;
        codigo: string | null;
        nombre: string;
        descripcion: string | null;
        estado: string;
        requiereRespaldo: boolean | null;
    }[]>;
    actualizarMedioPagoM6(id: number, entrada: Record<string, unknown>): Promise<{
        id: number;
        codigo: string | null;
        nombre: string;
        descripcion: string | null;
        estado: string;
        requiereRespaldo: boolean | null;
    }[]>;
    private incluirHecho;
    private presentarHecho;
    listarHechosRemunerables(): Promise<{
        idEjecucion: any;
        idTarea: any;
        tarea: any;
        fecha: any;
        estadoOperacional: any;
        validacionProductiva: any;
        cantidad: number | null;
        unidad: any;
        ejecutor: {
            id: any;
            nombre: any;
        };
        empleado: {
            id: any;
            rut: any;
            nombre: string;
        } | null;
        mapeoAmbiguo: any;
        retrabajos: any;
        tratamiento: {
            id: any;
            estadoRemunerabilidad: any;
            estadoValorizacion: any;
            motivo: any;
            esquema: {
                id: any;
                codigo: any;
                nombre: any;
            } | null;
            tarifa: {
                id: any;
                modalidad: any;
                valor: number | null;
                unidad: any;
                tipoAplicacion: any;
            } | null;
            valorPropuesto: number | null;
        } | null;
    }[]>;
    obtenerHechoRemunerable(idEjecucion: bigint): Promise<{
        idEjecucion: any;
        idTarea: any;
        tarea: any;
        fecha: any;
        estadoOperacional: any;
        validacionProductiva: any;
        cantidad: number | null;
        unidad: any;
        ejecutor: {
            id: any;
            nombre: any;
        };
        empleado: {
            id: any;
            rut: any;
            nombre: string;
        } | null;
        mapeoAmbiguo: any;
        retrabajos: any;
        tratamiento: {
            id: any;
            estadoRemunerabilidad: any;
            estadoValorizacion: any;
            motivo: any;
            esquema: {
                id: any;
                codigo: any;
                nombre: any;
            } | null;
            tarifa: {
                id: any;
                modalidad: any;
                valor: number | null;
                unidad: any;
                tipoAplicacion: any;
            } | null;
            valorPropuesto: number | null;
        } | null;
    }>;
    revisarHechoRemunerable(idEjecucion: bigint): Promise<{
        idEjecucion: any;
        idTarea: any;
        tarea: any;
        fecha: any;
        estadoOperacional: any;
        validacionProductiva: any;
        cantidad: number | null;
        unidad: any;
        ejecutor: {
            id: any;
            nombre: any;
        };
        empleado: {
            id: any;
            rut: any;
            nombre: string;
        } | null;
        mapeoAmbiguo: any;
        retrabajos: any;
        tratamiento: {
            id: any;
            estadoRemunerabilidad: any;
            estadoValorizacion: any;
            motivo: any;
            esquema: {
                id: any;
                codigo: any;
                nombre: any;
            } | null;
            tarifa: {
                id: any;
                modalidad: any;
                valor: number | null;
                unidad: any;
                tipoAplicacion: any;
            } | null;
            valorPropuesto: number | null;
        } | null;
    }>;
    listarRetrabajosPendientes(): Promise<{
        incidencia: {
            id: string;
            descripcion: string;
            causaReferencia: string | null;
            causaPendiente: boolean;
            responsabilidad: string | null;
            fecha: Date;
        };
        idEjecucion: any;
        idTarea: any;
        tarea: any;
        fecha: any;
        estadoOperacional: any;
        validacionProductiva: any;
        cantidad: number | null;
        unidad: any;
        ejecutor: {
            id: any;
            nombre: any;
        };
        empleado: {
            id: any;
            rut: any;
            nombre: string;
        } | null;
        mapeoAmbiguo: any;
        retrabajos: any;
        tratamiento: {
            id: any;
            estadoRemunerabilidad: any;
            estadoValorizacion: any;
            motivo: any;
            esquema: {
                id: any;
                codigo: any;
                nombre: any;
            } | null;
            tarifa: {
                id: any;
                modalidad: any;
                valor: number | null;
                unidad: any;
                tipoAplicacion: any;
            } | null;
            valorPropuesto: number | null;
        } | null;
    }[]>;
    resolverRetrabajo(idIncidencia: bigint, entrada: Record<string, unknown>, idUsuarioResolutor: bigint): Promise<{
        idEjecucion: any;
        idTarea: any;
        tarea: any;
        fecha: any;
        estadoOperacional: any;
        validacionProductiva: any;
        cantidad: number | null;
        unidad: any;
        ejecutor: {
            id: any;
            nombre: any;
        };
        empleado: {
            id: any;
            rut: any;
            nombre: string;
        } | null;
        mapeoAmbiguo: any;
        retrabajos: any;
        tratamiento: {
            id: any;
            estadoRemunerabilidad: any;
            estadoValorizacion: any;
            motivo: any;
            esquema: {
                id: any;
                codigo: any;
                nombre: any;
            } | null;
            tarifa: {
                id: any;
                modalidad: any;
                valor: number | null;
                unidad: any;
                tipoAplicacion: any;
            } | null;
            valorPropuesto: number | null;
        } | null;
    }>;
    private incluirRemuneracion;
    private presentarComponente;
    private presentarRemuneracion;
    private periodoEntrada;
    private poblacionExigible;
    private bloqueosRemuneracion;
    consultarPeriodoRemuneracion(anioEntrada: unknown, mesEntrada: unknown): Promise<{
        periodo: {
            id: number;
            anio: number;
            mes: number;
            fechaInicio: Date;
            fechaFin: Date;
            cerradoEn: Date | null;
        } | {
            id: null;
            anio: number;
            mes: number;
            fechaInicio: Date;
            fechaFin: Date;
            cerradoEn: null;
        };
        resumen: {
            exigibles: number;
            sinRemuneracion: number;
            abiertas: number;
            cerradas: number;
            conBloqueos: number;
        };
        empleados: {
            bloqueos: {
                codigo: string;
                detalle: string;
            }[];
            advertencias: {
                codigo: string;
                detalle: string;
            }[];
            idEmpleado: any;
            rut: any;
            nombre: string;
            estadoLaboral: any;
            relaciones: {
                id: any;
                fechaInicio: any;
                fechaTermino: any;
                estado: any;
            }[];
            remuneracion: {
                id: any;
                estado: any;
                periodo: {
                    id: any;
                    anio: any;
                    mes: any;
                    fechaInicio: any;
                    fechaFin: any;
                    cerradoEn: any;
                };
                empleado: {
                    id: any;
                    rut: any;
                    nombre: string;
                };
                calculadoEn: any;
                cerradoEn: any;
                reemplazaAId: any;
                reapertura: {
                    solicitadaEn: any;
                    solicitadaPor: any;
                    motivo: any;
                    aprobadaEn: any;
                    aprobadaPor: any;
                };
                totales: {
                    haberes: number | null;
                    deducciones: number | null;
                    descuentosPrevisionales: number | null;
                    impuesto: number | null;
                    otrasDeducciones: number | null;
                    aportesEmpleador: number | null;
                    costoEmpresa: number | null;
                    baseImponible: number | null;
                    baseTributable: number | null;
                    liquidoPreliminar: number | null;
                };
                componentes: any;
                condicionPago: {
                    fuenteDisponible: boolean;
                    tienePago: boolean;
                };
                ajustesPosteriores: any;
            } | null;
        }[];
    }>;
    obtenerRemuneracion(idRemuneracion: number): Promise<{
        id: any;
        estado: any;
        periodo: {
            id: any;
            anio: any;
            mes: any;
            fechaInicio: any;
            fechaFin: any;
            cerradoEn: any;
        };
        empleado: {
            id: any;
            rut: any;
            nombre: string;
        };
        calculadoEn: any;
        cerradoEn: any;
        reemplazaAId: any;
        reapertura: {
            solicitadaEn: any;
            solicitadaPor: any;
            motivo: any;
            aprobadaEn: any;
            aprobadaPor: any;
        };
        totales: {
            haberes: number | null;
            deducciones: number | null;
            descuentosPrevisionales: number | null;
            impuesto: number | null;
            otrasDeducciones: number | null;
            aportesEmpleador: number | null;
            costoEmpresa: number | null;
            baseImponible: number | null;
            baseTributable: number | null;
            liquidoPreliminar: number | null;
        };
        componentes: any;
        condicionPago: {
            fuenteDisponible: boolean;
            tienePago: boolean;
        };
        ajustesPosteriores: any;
    }>;
    obtenerOCrearContextoRemuneracion(entrada: Record<string, unknown>, idUsuario: bigint): Promise<{
        id: any;
        estado: any;
        periodo: {
            id: any;
            anio: any;
            mes: any;
            fechaInicio: any;
            fechaFin: any;
            cerradoEn: any;
        };
        empleado: {
            id: any;
            rut: any;
            nombre: string;
        };
        calculadoEn: any;
        cerradoEn: any;
        reemplazaAId: any;
        reapertura: {
            solicitadaEn: any;
            solicitadaPor: any;
            motivo: any;
            aprobadaEn: any;
            aprobadaPor: any;
        };
        totales: {
            haberes: number | null;
            deducciones: number | null;
            descuentosPrevisionales: number | null;
            impuesto: number | null;
            otrasDeducciones: number | null;
            aportesEmpleador: number | null;
            costoEmpresa: number | null;
            baseImponible: number | null;
            baseTributable: number | null;
            liquidoPreliminar: number | null;
        };
        componentes: any;
        condicionPago: {
            fuenteDisponible: boolean;
            tienePago: boolean;
        };
        ajustesPosteriores: any;
    }>;
    private remuneracionAbierta;
    private mismoAutomatico;
    private sincronizarAutomaticos;
    private calcularEnTransaccion;
    calcularRemuneracion(entrada: Record<string, unknown>, idUsuario: bigint): Promise<{
        bloqueos: {
            codigo: string;
            detalle: string;
        }[];
        advertencias: {
            codigo: string;
            detalle: string;
        }[];
        remuneracion: {
            id: any;
            estado: any;
            periodo: {
                id: any;
                anio: any;
                mes: any;
                fechaInicio: any;
                fechaFin: any;
                cerradoEn: any;
            };
            empleado: {
                id: any;
                rut: any;
                nombre: string;
            };
            calculadoEn: any;
            cerradoEn: any;
            reemplazaAId: any;
            reapertura: {
                solicitadaEn: any;
                solicitadaPor: any;
                motivo: any;
                aprobadaEn: any;
                aprobadaPor: any;
            };
            totales: {
                haberes: number | null;
                deducciones: number | null;
                descuentosPrevisionales: number | null;
                impuesto: number | null;
                otrasDeducciones: number | null;
                aportesEmpleador: number | null;
                costoEmpresa: number | null;
                baseImponible: number | null;
                baseTributable: number | null;
                liquidoPreliminar: number | null;
            };
            componentes: any;
            condicionPago: {
                fuenteDisponible: boolean;
                tienePago: boolean;
            };
            ajustesPosteriores: any;
        };
    }>;
    cerrarRemuneracion(idRemuneracion: number, idUsuario: bigint): Promise<{
        bloqueos: {
            codigo: string;
            detalle: string;
        }[];
        advertencias: {
            codigo: string;
            detalle: string;
        }[];
        remuneracion: {
            id: any;
            estado: any;
            periodo: {
                id: any;
                anio: any;
                mes: any;
                fechaInicio: any;
                fechaFin: any;
                cerradoEn: any;
            };
            empleado: {
                id: any;
                rut: any;
                nombre: string;
            };
            calculadoEn: any;
            cerradoEn: any;
            reemplazaAId: any;
            reapertura: {
                solicitadaEn: any;
                solicitadaPor: any;
                motivo: any;
                aprobadaEn: any;
                aprobadaPor: any;
            };
            totales: {
                haberes: number | null;
                deducciones: number | null;
                descuentosPrevisionales: number | null;
                impuesto: number | null;
                otrasDeducciones: number | null;
                aportesEmpleador: number | null;
                costoEmpresa: number | null;
                baseImponible: number | null;
                baseTributable: number | null;
                liquidoPreliminar: number | null;
            };
            componentes: any;
            condicionPago: {
                fuenteDisponible: boolean;
                tienePago: boolean;
            };
            ajustesPosteriores: any;
        };
        liquidacion: {
            tipo: string;
            documentoGenerado: boolean;
            remuneracion: {
                id: any;
                estado: any;
                periodo: {
                    id: any;
                    anio: any;
                    mes: any;
                    fechaInicio: any;
                    fechaFin: any;
                    cerradoEn: any;
                };
                empleado: {
                    id: any;
                    rut: any;
                    nombre: string;
                };
                calculadoEn: any;
                cerradoEn: any;
                reemplazaAId: any;
                reapertura: {
                    solicitadaEn: any;
                    solicitadaPor: any;
                    motivo: any;
                    aprobadaEn: any;
                    aprobadaPor: any;
                };
                totales: {
                    haberes: number | null;
                    deducciones: number | null;
                    descuentosPrevisionales: number | null;
                    impuesto: number | null;
                    otrasDeducciones: number | null;
                    aportesEmpleador: number | null;
                    costoEmpresa: number | null;
                    baseImponible: number | null;
                    baseTributable: number | null;
                    liquidoPreliminar: number | null;
                };
                componentes: any;
                condicionPago: {
                    fuenteDisponible: boolean;
                    tienePago: boolean;
                };
                ajustesPosteriores: any;
            };
        };
    }>;
    obtenerLiquidacionRemuneracion(idRemuneracion: number): Promise<{
        tipo: string;
        documentoGenerado: boolean;
        remuneracion: {
            id: any;
            estado: any;
            periodo: {
                id: any;
                anio: any;
                mes: any;
                fechaInicio: any;
                fechaFin: any;
                cerradoEn: any;
            };
            empleado: {
                id: any;
                rut: any;
                nombre: string;
            };
            calculadoEn: any;
            cerradoEn: any;
            reemplazaAId: any;
            reapertura: {
                solicitadaEn: any;
                solicitadaPor: any;
                motivo: any;
                aprobadaEn: any;
                aprobadaPor: any;
            };
            totales: {
                haberes: number | null;
                deducciones: number | null;
                descuentosPrevisionales: number | null;
                impuesto: number | null;
                otrasDeducciones: number | null;
                aportesEmpleador: number | null;
                costoEmpresa: number | null;
                baseImponible: number | null;
                baseTributable: number | null;
                liquidoPreliminar: number | null;
            };
            componentes: any;
            condicionPago: {
                fuenteDisponible: boolean;
                tienePago: boolean;
            };
            ajustesPosteriores: any;
        };
    }>;
    cerrarPeriodoRemuneracion(anioEntrada: unknown, mesEntrada: unknown, idUsuario: bigint): Promise<{
        idPeriodo: number;
        periodo: {
            id: number;
            anio: number;
            mes: number;
            fechaInicio: Date;
            fechaFin: Date;
            cerradoEn: Date | null;
        } | {
            id: null;
            anio: number;
            mes: number;
            fechaInicio: Date;
            fechaFin: Date;
            cerradoEn: null;
        };
        resumen: {
            exigibles: number;
            sinRemuneracion: number;
            abiertas: number;
            cerradas: number;
            conBloqueos: number;
        };
        empleados: {
            bloqueos: {
                codigo: string;
                detalle: string;
            }[];
            advertencias: {
                codigo: string;
                detalle: string;
            }[];
            idEmpleado: any;
            rut: any;
            nombre: string;
            estadoLaboral: any;
            relaciones: {
                id: any;
                fechaInicio: any;
                fechaTermino: any;
                estado: any;
            }[];
            remuneracion: {
                id: any;
                estado: any;
                periodo: {
                    id: any;
                    anio: any;
                    mes: any;
                    fechaInicio: any;
                    fechaFin: any;
                    cerradoEn: any;
                };
                empleado: {
                    id: any;
                    rut: any;
                    nombre: string;
                };
                calculadoEn: any;
                cerradoEn: any;
                reemplazaAId: any;
                reapertura: {
                    solicitadaEn: any;
                    solicitadaPor: any;
                    motivo: any;
                    aprobadaEn: any;
                    aprobadaPor: any;
                };
                totales: {
                    haberes: number | null;
                    deducciones: number | null;
                    descuentosPrevisionales: number | null;
                    impuesto: number | null;
                    otrasDeducciones: number | null;
                    aportesEmpleador: number | null;
                    costoEmpresa: number | null;
                    baseImponible: number | null;
                    baseTributable: number | null;
                    liquidoPreliminar: number | null;
                };
                componentes: any;
                condicionPago: {
                    fuenteDisponible: boolean;
                    tienePago: boolean;
                };
                ajustesPosteriores: any;
            } | null;
        }[];
    }>;
    private estadoPagoRemuneracion;
    solicitarReaperturaRemuneracion(idRemuneracion: number, entrada: Record<string, unknown>, idUsuario: bigint): Promise<{
        id: any;
        estado: any;
        periodo: {
            id: any;
            anio: any;
            mes: any;
            fechaInicio: any;
            fechaFin: any;
            cerradoEn: any;
        };
        empleado: {
            id: any;
            rut: any;
            nombre: string;
        };
        calculadoEn: any;
        cerradoEn: any;
        reemplazaAId: any;
        reapertura: {
            solicitadaEn: any;
            solicitadaPor: any;
            motivo: any;
            aprobadaEn: any;
            aprobadaPor: any;
        };
        totales: {
            haberes: number | null;
            deducciones: number | null;
            descuentosPrevisionales: number | null;
            impuesto: number | null;
            otrasDeducciones: number | null;
            aportesEmpleador: number | null;
            costoEmpresa: number | null;
            baseImponible: number | null;
            baseTributable: number | null;
            liquidoPreliminar: number | null;
        };
        componentes: any;
        condicionPago: {
            fuenteDisponible: boolean;
            tienePago: boolean;
        };
        ajustesPosteriores: any;
    }>;
    aprobarReaperturaRemuneracion(idRemuneracion: number, idUsuario: bigint): Promise<{
        id: any;
        estado: any;
        periodo: {
            id: any;
            anio: any;
            mes: any;
            fechaInicio: any;
            fechaFin: any;
            cerradoEn: any;
        };
        empleado: {
            id: any;
            rut: any;
            nombre: string;
        };
        calculadoEn: any;
        cerradoEn: any;
        reemplazaAId: any;
        reapertura: {
            solicitadaEn: any;
            solicitadaPor: any;
            motivo: any;
            aprobadaEn: any;
            aprobadaPor: any;
        };
        totales: {
            haberes: number | null;
            deducciones: number | null;
            descuentosPrevisionales: number | null;
            impuesto: number | null;
            otrasDeducciones: number | null;
            aportesEmpleador: number | null;
            costoEmpresa: number | null;
            baseImponible: number | null;
            baseTributable: number | null;
            liquidoPreliminar: number | null;
        };
        componentes: any;
        condicionPago: {
            fuenteDisponible: boolean;
            tienePago: boolean;
        };
        ajustesPosteriores: any;
    }>;
    proponerComponenteExcepcional(idRemuneracion: number, entrada: Record<string, unknown>, idUsuario: bigint): Promise<{
        id: any;
        estado: any;
        periodo: {
            id: any;
            anio: any;
            mes: any;
            fechaInicio: any;
            fechaFin: any;
            cerradoEn: any;
        };
        empleado: {
            id: any;
            rut: any;
            nombre: string;
        };
        calculadoEn: any;
        cerradoEn: any;
        reemplazaAId: any;
        reapertura: {
            solicitadaEn: any;
            solicitadaPor: any;
            motivo: any;
            aprobadaEn: any;
            aprobadaPor: any;
        };
        totales: {
            haberes: number | null;
            deducciones: number | null;
            descuentosPrevisionales: number | null;
            impuesto: number | null;
            otrasDeducciones: number | null;
            aportesEmpleador: number | null;
            costoEmpresa: number | null;
            baseImponible: number | null;
            baseTributable: number | null;
            liquidoPreliminar: number | null;
        };
        componentes: any;
        condicionPago: {
            fuenteDisponible: boolean;
            tienePago: boolean;
        };
        ajustesPosteriores: any;
    }>;
    private resolverComponente;
    resolverComponenteExcepcional(idComponente: number, entrada: Record<string, unknown>, idUsuario: bigint): Promise<{
        id: any;
        estado: any;
        periodo: {
            id: any;
            anio: any;
            mes: any;
            fechaInicio: any;
            fechaFin: any;
            cerradoEn: any;
        };
        empleado: {
            id: any;
            rut: any;
            nombre: string;
        };
        calculadoEn: any;
        cerradoEn: any;
        reemplazaAId: any;
        reapertura: {
            solicitadaEn: any;
            solicitadaPor: any;
            motivo: any;
            aprobadaEn: any;
            aprobadaPor: any;
        };
        totales: {
            haberes: number | null;
            deducciones: number | null;
            descuentosPrevisionales: number | null;
            impuesto: number | null;
            otrasDeducciones: number | null;
            aportesEmpleador: number | null;
            costoEmpresa: number | null;
            baseImponible: number | null;
            baseTributable: number | null;
            liquidoPreliminar: number | null;
        };
        componentes: any;
        condicionPago: {
            fuenteDisponible: boolean;
            tienePago: boolean;
        };
        ajustesPosteriores: any;
    }>;
    proponerVariableRemuneracion(idRemuneracion: number, entrada: Record<string, unknown>, idUsuario: bigint): Promise<{
        id: any;
        estado: any;
        periodo: {
            id: any;
            anio: any;
            mes: any;
            fechaInicio: any;
            fechaFin: any;
            cerradoEn: any;
        };
        empleado: {
            id: any;
            rut: any;
            nombre: string;
        };
        calculadoEn: any;
        cerradoEn: any;
        reemplazaAId: any;
        reapertura: {
            solicitadaEn: any;
            solicitadaPor: any;
            motivo: any;
            aprobadaEn: any;
            aprobadaPor: any;
        };
        totales: {
            haberes: number | null;
            deducciones: number | null;
            descuentosPrevisionales: number | null;
            impuesto: number | null;
            otrasDeducciones: number | null;
            aportesEmpleador: number | null;
            costoEmpresa: number | null;
            baseImponible: number | null;
            baseTributable: number | null;
            liquidoPreliminar: number | null;
        };
        componentes: any;
        condicionPago: {
            fuenteDisponible: boolean;
            tienePago: boolean;
        };
        ajustesPosteriores: any;
    }>;
    resolverVariableRemuneracion(idComponente: number, entrada: Record<string, unknown>, idUsuario: bigint): Promise<{
        id: any;
        estado: any;
        periodo: {
            id: any;
            anio: any;
            mes: any;
            fechaInicio: any;
            fechaFin: any;
            cerradoEn: any;
        };
        empleado: {
            id: any;
            rut: any;
            nombre: string;
        };
        calculadoEn: any;
        cerradoEn: any;
        reemplazaAId: any;
        reapertura: {
            solicitadaEn: any;
            solicitadaPor: any;
            motivo: any;
            aprobadaEn: any;
            aprobadaPor: any;
        };
        totales: {
            haberes: number | null;
            deducciones: number | null;
            descuentosPrevisionales: number | null;
            impuesto: number | null;
            otrasDeducciones: number | null;
            aportesEmpleador: number | null;
            costoEmpresa: number | null;
            baseImponible: number | null;
            baseTributable: number | null;
            liquidoPreliminar: number | null;
        };
        componentes: any;
        condicionPago: {
            fuenteDisponible: boolean;
            tienePago: boolean;
        };
        ajustesPosteriores: any;
    }>;
    registrarValorExterno(idRemuneracion: number, entrada: Record<string, unknown>, idUsuario: bigint): Promise<{
        id: any;
        estado: any;
        periodo: {
            id: any;
            anio: any;
            mes: any;
            fechaInicio: any;
            fechaFin: any;
            cerradoEn: any;
        };
        empleado: {
            id: any;
            rut: any;
            nombre: string;
        };
        calculadoEn: any;
        cerradoEn: any;
        reemplazaAId: any;
        reapertura: {
            solicitadaEn: any;
            solicitadaPor: any;
            motivo: any;
            aprobadaEn: any;
            aprobadaPor: any;
        };
        totales: {
            haberes: number | null;
            deducciones: number | null;
            descuentosPrevisionales: number | null;
            impuesto: number | null;
            otrasDeducciones: number | null;
            aportesEmpleador: number | null;
            costoEmpresa: number | null;
            baseImponible: number | null;
            baseTributable: number | null;
            liquidoPreliminar: number | null;
        };
        componentes: any;
        condicionPago: {
            fuenteDisponible: boolean;
            tienePago: boolean;
        };
        ajustesPosteriores: any;
    }>;
    proponerAjusteManual(idRemuneracion: number, entrada: Record<string, unknown>, idUsuario: bigint): Promise<{
        id: any;
        estado: any;
        periodo: {
            id: any;
            anio: any;
            mes: any;
            fechaInicio: any;
            fechaFin: any;
            cerradoEn: any;
        };
        empleado: {
            id: any;
            rut: any;
            nombre: string;
        };
        calculadoEn: any;
        cerradoEn: any;
        reemplazaAId: any;
        reapertura: {
            solicitadaEn: any;
            solicitadaPor: any;
            motivo: any;
            aprobadaEn: any;
            aprobadaPor: any;
        };
        totales: {
            haberes: number | null;
            deducciones: number | null;
            descuentosPrevisionales: number | null;
            impuesto: number | null;
            otrasDeducciones: number | null;
            aportesEmpleador: number | null;
            costoEmpresa: number | null;
            baseImponible: number | null;
            baseTributable: number | null;
            liquidoPreliminar: number | null;
        };
        componentes: any;
        condicionPago: {
            fuenteDisponible: boolean;
            tienePago: boolean;
        };
        ajustesPosteriores: any;
    }>;
    resolverValorOAjuste(idComponente: number, entrada: Record<string, unknown>, idUsuario: bigint): Promise<{
        id: any;
        estado: any;
        periodo: {
            id: any;
            anio: any;
            mes: any;
            fechaInicio: any;
            fechaFin: any;
            cerradoEn: any;
        };
        empleado: {
            id: any;
            rut: any;
            nombre: string;
        };
        calculadoEn: any;
        cerradoEn: any;
        reemplazaAId: any;
        reapertura: {
            solicitadaEn: any;
            solicitadaPor: any;
            motivo: any;
            aprobadaEn: any;
            aprobadaPor: any;
        };
        totales: {
            haberes: number | null;
            deducciones: number | null;
            descuentosPrevisionales: number | null;
            impuesto: number | null;
            otrasDeducciones: number | null;
            aportesEmpleador: number | null;
            costoEmpresa: number | null;
            baseImponible: number | null;
            baseTributable: number | null;
            liquidoPreliminar: number | null;
        };
        componentes: any;
        condicionPago: {
            fuenteDisponible: boolean;
            tienePago: boolean;
        };
        ajustesPosteriores: any;
    }>;
    obtenerContextoProrrateo(idRemuneracion: number): Promise<{
        remuneracion: {
            id: any;
            estado: any;
            periodo: {
                id: any;
                anio: any;
                mes: any;
                fechaInicio: any;
                fechaFin: any;
                cerradoEn: any;
            };
            empleado: {
                id: any;
                rut: any;
                nombre: string;
            };
            calculadoEn: any;
            cerradoEn: any;
            reemplazaAId: any;
            reapertura: {
                solicitadaEn: any;
                solicitadaPor: any;
                motivo: any;
                aprobadaEn: any;
                aprobadaPor: any;
            };
            totales: {
                haberes: number | null;
                deducciones: number | null;
                descuentosPrevisionales: number | null;
                impuesto: number | null;
                otrasDeducciones: number | null;
                aportesEmpleador: number | null;
                costoEmpresa: number | null;
                baseImponible: number | null;
                baseTributable: number | null;
                liquidoPreliminar: number | null;
            };
            componentes: any;
            condicionPago: {
                fuenteDisponible: boolean;
                tienePago: boolean;
            };
            ajustesPosteriores: any;
        };
        configuracion: {
            id: number;
            codigo: string;
            tipo: string;
            nombre: string;
            descripcion: string | null;
            valor: number | null;
            unidad: string | null;
            vigenciaDesde: Date;
            vigenciaHasta: Date | null;
            fuente: string | null;
            referencia: string | null;
            estado: string;
        } | null;
        estadoPropuesta: string;
        montoCalculado: null;
        relacionesLaborales: {
            id: number;
            fechaInicio: Date;
            fechaTermino: Date | null;
            estado: string;
        }[];
    }>;
    proponerProrrateoIndividual(idRemuneracion: number, entrada: Record<string, unknown>, idUsuario: bigint): Promise<{
        remuneracion: {
            id: any;
            estado: any;
            periodo: {
                id: any;
                anio: any;
                mes: any;
                fechaInicio: any;
                fechaFin: any;
                cerradoEn: any;
            };
            empleado: {
                id: any;
                rut: any;
                nombre: string;
            };
            calculadoEn: any;
            cerradoEn: any;
            reemplazaAId: any;
            reapertura: {
                solicitadaEn: any;
                solicitadaPor: any;
                motivo: any;
                aprobadaEn: any;
                aprobadaPor: any;
            };
            totales: {
                haberes: number | null;
                deducciones: number | null;
                descuentosPrevisionales: number | null;
                impuesto: number | null;
                otrasDeducciones: number | null;
                aportesEmpleador: number | null;
                costoEmpresa: number | null;
                baseImponible: number | null;
                baseTributable: number | null;
                liquidoPreliminar: number | null;
            };
            componentes: any;
            condicionPago: {
                fuenteDisponible: boolean;
                tienePago: boolean;
            };
            ajustesPosteriores: any;
        };
        configuracion: {
            id: number;
            codigo: string;
            tipo: string;
            nombre: string;
            descripcion: string | null;
            valor: number | null;
            unidad: string | null;
            vigenciaDesde: Date;
            vigenciaHasta: Date | null;
            fuente: string | null;
            referencia: string | null;
            estado: string;
        } | null;
        estadoPropuesta: string;
        montoCalculado: null;
        relacionesLaborales: {
            id: number;
            fechaInicio: Date;
            fechaTermino: Date | null;
            estado: string;
        }[];
    }>;
    resolverProrrateoIndividual(idComponente: number, entrada: Record<string, unknown>, idUsuario: bigint): Promise<{
        id: any;
        estado: any;
        periodo: {
            id: any;
            anio: any;
            mes: any;
            fechaInicio: any;
            fechaFin: any;
            cerradoEn: any;
        };
        empleado: {
            id: any;
            rut: any;
            nombre: string;
        };
        calculadoEn: any;
        cerradoEn: any;
        reemplazaAId: any;
        reapertura: {
            solicitadaEn: any;
            solicitadaPor: any;
            motivo: any;
            aprobadaEn: any;
            aprobadaPor: any;
        };
        totales: {
            haberes: number | null;
            deducciones: number | null;
            descuentosPrevisionales: number | null;
            impuesto: number | null;
            otrasDeducciones: number | null;
            aportesEmpleador: number | null;
            costoEmpresa: number | null;
            baseImponible: number | null;
            baseTributable: number | null;
            liquidoPreliminar: number | null;
        };
        componentes: any;
        condicionPago: {
            fuenteDisponible: boolean;
            tienePago: boolean;
        };
        ajustesPosteriores: any;
    }>;
    private claveIdempotencia;
    crearAjustePosterior(idRemuneracion: number, entrada: Record<string, unknown>, idUsuario: bigint): Promise<{
        id: number;
        idRemuneracion: number;
        idEmpleado: number;
        idPeriodoOrigen: number;
        fechaHallazgo: Date;
        monto: number;
        direccion: string;
        motivo: string;
        tratamiento: string;
        idPeriodoAplicable: number | null;
        estado: string;
        motivoTratamiento: string | null;
        requiereResolucionHumana: boolean;
        postergadoEn: Date | null;
        regularizacion: {
            id: number;
            monto: number;
            motivo: string;
            estado: string;
            cerradoEn: Date | null;
        } | null;
    }>;
    obtenerAjustePosterior(idAjuste: number): Promise<{
        id: number;
        idRemuneracion: number;
        idEmpleado: number;
        idPeriodoOrigen: number;
        fechaHallazgo: Date;
        monto: number;
        direccion: string;
        motivo: string;
        tratamiento: string;
        idPeriodoAplicable: number | null;
        estado: string;
        motivoTratamiento: string | null;
        requiereResolucionHumana: boolean;
        postergadoEn: Date | null;
        regularizacion: {
            id: number;
            monto: number;
            motivo: string;
            estado: string;
            cerradoEn: Date | null;
        } | null;
    }>;
    postergarAjustePosterior(idAjuste: number, entrada: Record<string, unknown>, idUsuario: bigint): Promise<{
        id: number;
        idRemuneracion: number;
        idEmpleado: number;
        idPeriodoOrigen: number;
        fechaHallazgo: Date;
        monto: number;
        direccion: string;
        motivo: string;
        tratamiento: string;
        idPeriodoAplicable: number | null;
        estado: string;
        motivoTratamiento: string | null;
        requiereResolucionHumana: boolean;
        postergadoEn: Date | null;
        regularizacion: {
            id: number;
            monto: number;
            motivo: string;
            estado: string;
            cerradoEn: Date | null;
        } | null;
    }>;
    crearRegularizacionExtraordinaria(idAjuste: number, idUsuario: bigint): Promise<{
        id: number;
        idAjustePosterior: number;
        idRemuneracion: number;
        idEmpleado: number;
        idPeriodoOrigen: number;
        monto: number;
        motivo: string;
        estado: string;
        cerradoEn: Date | null;
        pagada: boolean;
    }>;
    obtenerRegularizacion(idRegularizacion: number): Promise<{
        id: number;
        idAjustePosterior: number;
        idRemuneracion: number;
        idEmpleado: number;
        idPeriodoOrigen: number;
        monto: number;
        motivo: string;
        estado: string;
        cerradoEn: Date | null;
        pagada: boolean;
    }>;
    actualizarRegularizacion(idRegularizacion: number, entrada: Record<string, unknown>, idUsuario: bigint): Promise<{
        id: number;
        idAjustePosterior: number;
        idRemuneracion: number;
        idEmpleado: number;
        idPeriodoOrigen: number;
        monto: number;
        motivo: string;
        estado: string;
        cerradoEn: Date | null;
        pagada: boolean;
    }>;
    cerrarRegularizacion(idRegularizacion: number, idUsuario: bigint): Promise<{
        id: number;
        idAjustePosterior: number;
        idRemuneracion: number;
        idEmpleado: number;
        idPeriodoOrigen: number;
        monto: number;
        motivo: string;
        estado: string;
        cerradoEn: Date | null;
        pagada: boolean;
    }>;
    registrarAnticipo(entrada: Record<string, unknown>, idUsuario: bigint): Promise<{
        id: number;
        empleado: {
            id: number;
            nombre: string;
        };
        periodo: {
            id: number;
            anio: number;
            mes: number;
        };
        modalidad: string;
        valorIngresado: number;
        codigoBasePorcentaje: string | null;
        montoFinal: number | null;
        estadoValorizacion: string;
        pagado: boolean;
    }>;
    obtenerAnticipo(idAnticipo: number): Promise<{
        id: number;
        empleado: {
            id: number;
            nombre: string;
        };
        periodo: {
            id: number;
            anio: number;
            mes: number;
        };
        modalidad: string;
        valorIngresado: number;
        codigoBasePorcentaje: string | null;
        montoFinal: number | null;
        estadoValorizacion: string;
        pagado: boolean;
    }>;
    private montoPagableOriginal;
    private presentarPago;
    private prepararPagoRemuneracion;
    obtenerPagoRemuneracion(idPago: number): Promise<{
        origen: {
            tipo: string;
            id: number;
            descripcion: string;
        } | null;
        actores: {
            creador: string | null;
            confirmador: string | null;
            anulador: string | null;
        };
        reversiones: any;
        id: any;
        origenTipo: "REMUNERACION" | "ANTICIPO" | "REGULARIZACION" | "BOLETA_HONORARIOS";
        origenId: number;
        monto: number;
        medio: {
            id: any;
            codigo: any;
            nombre: any;
        } | null;
        respaldo: any;
        referencia: any;
        estado: any;
        creadoPor: any;
        creadoEn: any;
        confirmadoPor: any;
        confirmadoEn: any;
        motivoAnulacion: any;
        anuladoPor: any;
        anuladoEn: any;
        totalRevertido: number;
        montoEfectivo: number;
    }>;
    private resumenOrigenPago;
    actualizarPagoRemuneracion(idPago: number, entrada: Record<string, unknown>, idUsuario?: bigint): Promise<{
        origen: {
            tipo: string;
            id: number;
            descripcion: string;
        } | null;
        actores: {
            creador: string | null;
            confirmador: string | null;
            anulador: string | null;
        };
        reversiones: any;
        id: any;
        origenTipo: "REMUNERACION" | "ANTICIPO" | "REGULARIZACION" | "BOLETA_HONORARIOS";
        origenId: number;
        monto: number;
        medio: {
            id: any;
            codigo: any;
            nombre: any;
        } | null;
        respaldo: any;
        referencia: any;
        estado: any;
        creadoPor: any;
        creadoEn: any;
        confirmadoPor: any;
        confirmadoEn: any;
        motivoAnulacion: any;
        anuladoPor: any;
        anuladoEn: any;
        totalRevertido: number;
        montoEfectivo: number;
    }>;
    confirmarPagoRemuneracion(idPago: number, idUsuario: bigint): Promise<{
        origen: {
            tipo: string;
            id: number;
            descripcion: string;
        } | null;
        actores: {
            creador: string | null;
            confirmador: string | null;
            anulador: string | null;
        };
        reversiones: any;
        id: any;
        origenTipo: "REMUNERACION" | "ANTICIPO" | "REGULARIZACION" | "BOLETA_HONORARIOS";
        origenId: number;
        monto: number;
        medio: {
            id: any;
            codigo: any;
            nombre: any;
        } | null;
        respaldo: any;
        referencia: any;
        estado: any;
        creadoPor: any;
        creadoEn: any;
        confirmadoPor: any;
        confirmadoEn: any;
        motivoAnulacion: any;
        anuladoPor: any;
        anuladoEn: any;
        totalRevertido: number;
        montoEfectivo: number;
    }>;
    listarPagosRemuneracion(): Promise<{
        id: any;
        origenTipo: "REMUNERACION" | "ANTICIPO" | "REGULARIZACION" | "BOLETA_HONORARIOS";
        origenId: number;
        monto: number;
        medio: {
            id: any;
            codigo: any;
            nombre: any;
        } | null;
        respaldo: any;
        referencia: any;
        estado: any;
        creadoPor: any;
        creadoEn: any;
        confirmadoPor: any;
        confirmadoEn: any;
        motivoAnulacion: any;
        anuladoPor: any;
        anuladoEn: any;
        reversiones: any;
        totalRevertido: number;
        montoEfectivo: number;
    }[]>;
    prepararPagoAnticipo(idAnticipo: number, entrada: Record<string, unknown>, idUsuario: bigint): Promise<{
        origen: {
            tipo: string;
            id: number;
            descripcion: string;
        } | null;
        actores: {
            creador: string | null;
            confirmador: string | null;
            anulador: string | null;
        };
        reversiones: any;
        id: any;
        origenTipo: "REMUNERACION" | "ANTICIPO" | "REGULARIZACION" | "BOLETA_HONORARIOS";
        origenId: number;
        monto: number;
        medio: {
            id: any;
            codigo: any;
            nombre: any;
        } | null;
        respaldo: any;
        referencia: any;
        estado: any;
        creadoPor: any;
        creadoEn: any;
        confirmadoPor: any;
        confirmadoEn: any;
        motivoAnulacion: any;
        anuladoPor: any;
        anuladoEn: any;
        totalRevertido: number;
        montoEfectivo: number;
    }>;
    prepararPagoFinal(entrada: Record<string, unknown>, idUsuario: bigint): Promise<{
        origen: {
            tipo: string;
            id: number;
            descripcion: string;
        } | null;
        actores: {
            creador: string | null;
            confirmador: string | null;
            anulador: string | null;
        };
        reversiones: any;
        id: any;
        origenTipo: "REMUNERACION" | "ANTICIPO" | "REGULARIZACION" | "BOLETA_HONORARIOS";
        origenId: number;
        monto: number;
        medio: {
            id: any;
            codigo: any;
            nombre: any;
        } | null;
        respaldo: any;
        referencia: any;
        estado: any;
        creadoPor: any;
        creadoEn: any;
        confirmadoPor: any;
        confirmadoEn: any;
        motivoAnulacion: any;
        anuladoPor: any;
        anuladoEn: any;
        totalRevertido: number;
        montoEfectivo: number;
    }>;
    private exigirTipoPago;
    actualizarPagoAnticipo(idPago: number, entrada: Record<string, unknown>, idUsuario?: bigint): Promise<{
        origen: {
            tipo: string;
            id: number;
            descripcion: string;
        } | null;
        actores: {
            creador: string | null;
            confirmador: string | null;
            anulador: string | null;
        };
        reversiones: any;
        id: any;
        origenTipo: "REMUNERACION" | "ANTICIPO" | "REGULARIZACION" | "BOLETA_HONORARIOS";
        origenId: number;
        monto: number;
        medio: {
            id: any;
            codigo: any;
            nombre: any;
        } | null;
        respaldo: any;
        referencia: any;
        estado: any;
        creadoPor: any;
        creadoEn: any;
        confirmadoPor: any;
        confirmadoEn: any;
        motivoAnulacion: any;
        anuladoPor: any;
        anuladoEn: any;
        totalRevertido: number;
        montoEfectivo: number;
    }>;
    confirmarPagoAnticipo(idPago: number, idUsuario: bigint): Promise<{
        origen: {
            tipo: string;
            id: number;
            descripcion: string;
        } | null;
        actores: {
            creador: string | null;
            confirmador: string | null;
            anulador: string | null;
        };
        reversiones: any;
        id: any;
        origenTipo: "REMUNERACION" | "ANTICIPO" | "REGULARIZACION" | "BOLETA_HONORARIOS";
        origenId: number;
        monto: number;
        medio: {
            id: any;
            codigo: any;
            nombre: any;
        } | null;
        respaldo: any;
        referencia: any;
        estado: any;
        creadoPor: any;
        creadoEn: any;
        confirmadoPor: any;
        confirmadoEn: any;
        motivoAnulacion: any;
        anuladoPor: any;
        anuladoEn: any;
        totalRevertido: number;
        montoEfectivo: number;
    }>;
    actualizarPagoFinal(idPago: number, entrada: Record<string, unknown>, idUsuario?: bigint): Promise<{
        origen: {
            tipo: string;
            id: number;
            descripcion: string;
        } | null;
        actores: {
            creador: string | null;
            confirmador: string | null;
            anulador: string | null;
        };
        reversiones: any;
        id: any;
        origenTipo: "REMUNERACION" | "ANTICIPO" | "REGULARIZACION" | "BOLETA_HONORARIOS";
        origenId: number;
        monto: number;
        medio: {
            id: any;
            codigo: any;
            nombre: any;
        } | null;
        respaldo: any;
        referencia: any;
        estado: any;
        creadoPor: any;
        creadoEn: any;
        confirmadoPor: any;
        confirmadoEn: any;
        motivoAnulacion: any;
        anuladoPor: any;
        anuladoEn: any;
        totalRevertido: number;
        montoEfectivo: number;
    }>;
    confirmarPagoFinal(idPago: number, idUsuario: bigint): Promise<{
        origen: {
            tipo: string;
            id: number;
            descripcion: string;
        } | null;
        actores: {
            creador: string | null;
            confirmador: string | null;
            anulador: string | null;
        };
        reversiones: any;
        id: any;
        origenTipo: "REMUNERACION" | "ANTICIPO" | "REGULARIZACION" | "BOLETA_HONORARIOS";
        origenId: number;
        monto: number;
        medio: {
            id: any;
            codigo: any;
            nombre: any;
        } | null;
        respaldo: any;
        referencia: any;
        estado: any;
        creadoPor: any;
        creadoEn: any;
        confirmadoPor: any;
        confirmadoEn: any;
        motivoAnulacion: any;
        anuladoPor: any;
        anuladoEn: any;
        totalRevertido: number;
        montoEfectivo: number;
    }>;
    listarPrestadoresHonorarios(): Promise<{
        id: number;
        identificador: string;
        nombre: string;
        contacto: string | null;
        estado: string;
    }[]>;
    crearPrestadorHonorarios(entrada: Record<string, unknown>): Promise<{
        id: number;
        identificador: string;
        nombre: string;
        contacto: string | null;
        estado: string;
    }>;
    private presentarBoletaHonorarios;
    listarBoletasHonorarios(consulta: Record<string, unknown>): Promise<{
        id: any;
        prestador: {
            id: any;
            identificador: any;
            nombre: any;
            contacto: any;
            estado: any;
        };
        folio: any;
        fechaEmision: any;
        bruto: number;
        modalidadTributaria: any;
        tasaAplicada: number | null;
        retencion: number | null;
        liquido: number | null;
        estadoDocumental: any;
        respaldo: any;
        referencia: any;
        economia: {
            montoOriginal: number | null;
            montoEfectivo: number;
            saldoPendiente: number | null;
            condicion: string;
        };
    }[]>;
    obtenerBoletaHonorarios(id: number): Promise<{
        id: any;
        prestador: {
            id: any;
            identificador: any;
            nombre: any;
            contacto: any;
            estado: any;
        };
        folio: any;
        fechaEmision: any;
        bruto: number;
        modalidadTributaria: any;
        tasaAplicada: number | null;
        retencion: number | null;
        liquido: number | null;
        estadoDocumental: any;
        respaldo: any;
        referencia: any;
        economia: {
            montoOriginal: number | null;
            montoEfectivo: number;
            saldoPendiente: number | null;
            condicion: string;
        };
    }>;
    private datosBoletaPendiente;
    crearBoletaHonorarios(entrada: Record<string, unknown>): Promise<{
        id: any;
        prestador: {
            id: any;
            identificador: any;
            nombre: any;
            contacto: any;
            estado: any;
        };
        folio: any;
        fechaEmision: any;
        bruto: number;
        modalidadTributaria: any;
        tasaAplicada: number | null;
        retencion: number | null;
        liquido: number | null;
        estadoDocumental: any;
        respaldo: any;
        referencia: any;
        economia: {
            montoOriginal: number | null;
            montoEfectivo: number;
            saldoPendiente: number | null;
            condicion: string;
        };
    }>;
    actualizarBoletaHonorarios(id: number, entrada: Record<string, unknown>): Promise<{
        id: any;
        prestador: {
            id: any;
            identificador: any;
            nombre: any;
            contacto: any;
            estado: any;
        };
        folio: any;
        fechaEmision: any;
        bruto: number;
        modalidadTributaria: any;
        tasaAplicada: number | null;
        retencion: number | null;
        liquido: number | null;
        estadoDocumental: any;
        respaldo: any;
        referencia: any;
        economia: {
            montoOriginal: number | null;
            montoEfectivo: number;
            saldoPendiente: number | null;
            condicion: string;
        };
    }>;
    private calcularTributacionBoletaHonorarios;
    previsualizarConfirmacionBoletaHonorarios(id: number): Promise<{
        id: number;
        modalidadTributaria: string;
        bruto: number;
        tasaAplicada: number;
        retencion: number;
        liquido: number;
    }>;
    confirmarBoletaHonorarios(id: number): Promise<{
        id: any;
        prestador: {
            id: any;
            identificador: any;
            nombre: any;
            contacto: any;
            estado: any;
        };
        folio: any;
        fechaEmision: any;
        bruto: number;
        modalidadTributaria: any;
        tasaAplicada: number | null;
        retencion: number | null;
        liquido: number | null;
        estadoDocumental: any;
        respaldo: any;
        referencia: any;
        economia: {
            montoOriginal: number | null;
            montoEfectivo: number;
            saldoPendiente: number | null;
            condicion: string;
        };
    }>;
    consultarRetencionesHonorariosMensuales(anioEntrada: unknown, mesEntrada: unknown): Promise<{
        anio: number;
        mes: number;
        totalRetenciones: number;
        cantidadBoletas: number;
    }>;
    listarBoletasHonorariosConfirmadas(): Promise<{
        id: number;
        folio: string;
        fechaEmision: Date;
        prestador: {
            id: number;
            identificador: string;
            nombre: string;
        };
        bruto: number;
        retencion: number;
        liquido: number;
        estadoDocumental: string;
        montoEfectivo: number;
        saldoPendiente: number;
        pendiente: boolean;
    }[]>;
    prepararPagoHonorarios(idBoleta: number, entrada: Record<string, unknown>, idUsuario: bigint): Promise<{
        origen: {
            tipo: string;
            id: number;
            descripcion: string;
        } | null;
        actores: {
            creador: string | null;
            confirmador: string | null;
            anulador: string | null;
        };
        reversiones: any;
        id: any;
        origenTipo: "REMUNERACION" | "ANTICIPO" | "REGULARIZACION" | "BOLETA_HONORARIOS";
        origenId: number;
        monto: number;
        medio: {
            id: any;
            codigo: any;
            nombre: any;
        } | null;
        respaldo: any;
        referencia: any;
        estado: any;
        creadoPor: any;
        creadoEn: any;
        confirmadoPor: any;
        confirmadoEn: any;
        motivoAnulacion: any;
        anuladoPor: any;
        anuladoEn: any;
        totalRevertido: number;
        montoEfectivo: number;
    }>;
    actualizarPagoHonorarios(idPago: number, entrada: Record<string, unknown>, idUsuario?: bigint): Promise<{
        origen: {
            tipo: string;
            id: number;
            descripcion: string;
        } | null;
        actores: {
            creador: string | null;
            confirmador: string | null;
            anulador: string | null;
        };
        reversiones: any;
        id: any;
        origenTipo: "REMUNERACION" | "ANTICIPO" | "REGULARIZACION" | "BOLETA_HONORARIOS";
        origenId: number;
        monto: number;
        medio: {
            id: any;
            codigo: any;
            nombre: any;
        } | null;
        respaldo: any;
        referencia: any;
        estado: any;
        creadoPor: any;
        creadoEn: any;
        confirmadoPor: any;
        confirmadoEn: any;
        motivoAnulacion: any;
        anuladoPor: any;
        anuladoEn: any;
        totalRevertido: number;
        montoEfectivo: number;
    }>;
    confirmarPagoHonorarios(idPago: number, idUsuario: bigint): Promise<{
        origen: {
            tipo: string;
            id: number;
            descripcion: string;
        } | null;
        actores: {
            creador: string | null;
            confirmador: string | null;
            anulador: string | null;
        };
        reversiones: any;
        id: any;
        origenTipo: "REMUNERACION" | "ANTICIPO" | "REGULARIZACION" | "BOLETA_HONORARIOS";
        origenId: number;
        monto: number;
        medio: {
            id: any;
            codigo: any;
            nombre: any;
        } | null;
        respaldo: any;
        referencia: any;
        estado: any;
        creadoPor: any;
        creadoEn: any;
        confirmadoPor: any;
        confirmadoEn: any;
        motivoAnulacion: any;
        anuladoPor: any;
        anuladoEn: any;
        totalRevertido: number;
        montoEfectivo: number;
    }>;
    anularPagoRemuneracion(idPago: number, entrada: Record<string, unknown>, idUsuario: bigint): Promise<{
        origen: {
            tipo: string;
            id: number;
            descripcion: string;
        } | null;
        actores: {
            creador: string | null;
            confirmador: string | null;
            anulador: string | null;
        };
        reversiones: any;
        id: any;
        origenTipo: "REMUNERACION" | "ANTICIPO" | "REGULARIZACION" | "BOLETA_HONORARIOS";
        origenId: number;
        monto: number;
        medio: {
            id: any;
            codigo: any;
            nombre: any;
        } | null;
        respaldo: any;
        referencia: any;
        estado: any;
        creadoPor: any;
        creadoEn: any;
        confirmadoPor: any;
        confirmadoEn: any;
        motivoAnulacion: any;
        anuladoPor: any;
        anuladoEn: any;
        totalRevertido: number;
        montoEfectivo: number;
    }>;
    registrarReversionPagoRemuneracion(idPago: number, entrada: Record<string, unknown>, idUsuario: bigint): Promise<{
        origen: {
            tipo: string;
            id: number;
            descripcion: string;
        } | null;
        actores: {
            creador: string | null;
            confirmador: string | null;
            anulador: string | null;
        };
        reversiones: any;
        id: any;
        origenTipo: "REMUNERACION" | "ANTICIPO" | "REGULARIZACION" | "BOLETA_HONORARIOS";
        origenId: number;
        monto: number;
        medio: {
            id: any;
            codigo: any;
            nombre: any;
        } | null;
        respaldo: any;
        referencia: any;
        estado: any;
        creadoPor: any;
        creadoEn: any;
        confirmadoPor: any;
        confirmadoEn: any;
        motivoAnulacion: any;
        anuladoPor: any;
        anuladoEn: any;
        totalRevertido: number;
        montoEfectivo: number;
    }>;
    private exigirAlcanceDocumento;
    private archivoLiquidacion;
    private cargarLiquidacion;
    private cargarComprobanteAnticipo;
    private archivoComprobanteAnticipo;
    listarDocumentosRemuneracion(consulta: Record<string, unknown>, actor: ActorDocumentoM6): Promise<{
        tipo: string;
        id: number;
        idEmpleado: number;
        empleado: string;
        periodo: {
            anio: number;
            mes: number;
        };
        oficial: boolean;
        vigente: boolean;
        condicion: string;
    }[]>;
    descargarDocumentoRemuneracion(tipoEntrada: unknown, id: number, actor: ActorDocumentoM6): Promise<{
        nombre: string;
        mime: string;
        contenido: string;
    }>;
    reenviarDocumentoRemuneracion(tipoEntrada: unknown, idEntrada: number, actor: ActorDocumentoM6): Promise<{
        enviado: boolean;
        entregado: boolean;
        idDocumento: number;
        referenciaEvento: number;
    }>;
    registrarEntregaDocumento(entrada: Record<string, unknown>, actor: ActorDocumentoM6): Promise<{
        referenciaEvento: number;
        resultado: CondicionDocumento;
    }>;
    consultarEntregaDocumento(tipoEntrada: unknown, id: number, actor: ActorDocumentoM6): Promise<{
        enviado: boolean;
        entregado: boolean;
        condicion: null;
    } | {
        enviado: boolean;
        entregado: boolean;
        condicion: import("../servicios/AuditoriaDocumental").CondicionDocumentalRegistrada;
    }>;
    exportarCalculoPreliminar(idRemuneracion: number, actor: ActorDocumentoM6): Promise<{
        nombre: string;
        mime: string;
        contenido: string;
    }>;
    exportarRemuneracionesOficiales(consulta: Record<string, unknown>, actor: ActorDocumentoM6): Promise<{
        nombre: string;
        mime: string;
        contenido: string;
    }>;
    private readonly incluirVisitaTerreno;
    private presentarUsuarioTerreno;
    private presentarObraTerreno;
    private presentarVisitaTerreno;
    private presentarDetalleVisitaTerreno;
    crearVisitaTerreno(entrada: Record<string, unknown>): Promise<{
        id: any;
        tipoServicio: any;
        fecha: any;
        bloqueHorario: any;
        prioridad: any;
        estado: any;
        observaciones: any;
        responsable: {
            id: any;
            acceso: any;
            nombre: any;
        } | null;
        obra: {
            id: any;
            nombre: any;
            referencia: any;
            direccion: any;
            comuna: any;
            region: any;
            estado: any;
            cliente: {
                rut: any;
                nombre: any;
            } | null;
            especificacion: {
                id: any;
                modelo: any;
                zona: any;
                observaciones: any;
            } | null;
        } | null;
    }>;
    listarObrasTerreno(): Promise<({
        id: any;
        nombre: any;
        referencia: any;
        direccion: any;
        comuna: any;
        region: any;
        estado: any;
        cliente: {
            rut: any;
            nombre: any;
        } | null;
        especificacion: {
            id: any;
            modelo: any;
            zona: any;
            observaciones: any;
        } | null;
    } | null)[]>;
    listarVisitasTerreno(): Promise<{
        id: any;
        tipoServicio: any;
        fecha: any;
        bloqueHorario: any;
        prioridad: any;
        estado: any;
        observaciones: any;
        responsable: {
            id: any;
            acceso: any;
            nombre: any;
        } | null;
        obra: {
            id: any;
            nombre: any;
            referencia: any;
            direccion: any;
            comuna: any;
            region: any;
            estado: any;
            cliente: {
                rut: any;
                nombre: any;
            } | null;
            especificacion: {
                id: any;
                modelo: any;
                zona: any;
                observaciones: any;
            } | null;
        } | null;
    }[]>;
    obtenerVisitaTerreno(id: number): Promise<{
        resultadoRegistrado: {
            id: any;
            resultado: any;
            observaciones: any;
        } | null;
        ordenesRelacionadas: {
            id: string;
            estado: string | null;
        }[];
        id: any;
        tipoServicio: any;
        fecha: any;
        bloqueHorario: any;
        prioridad: any;
        estado: any;
        observaciones: any;
        responsable: {
            id: any;
            acceso: any;
            nombre: any;
        } | null;
        obra: {
            id: any;
            nombre: any;
            referencia: any;
            direccion: any;
            comuna: any;
            region: any;
            estado: any;
            cliente: {
                rut: any;
                nombre: any;
            } | null;
            especificacion: {
                id: any;
                modelo: any;
                zona: any;
                observaciones: any;
            } | null;
        } | null;
    }>;
    listarInstalacionesTerreno(): Promise<any[]>;
    listarUsuariosTerreno(): Promise<({
        id: any;
        acceso: any;
        nombre: any;
    } | null)[]>;
    asignarResponsableVisita(id: number, entrada: Record<string, unknown>): Promise<{
        resultadoRegistrado: {
            id: any;
            resultado: any;
            observaciones: any;
        } | null;
        ordenesRelacionadas: {
            id: string;
            estado: string | null;
        }[];
        id: any;
        tipoServicio: any;
        fecha: any;
        bloqueHorario: any;
        prioridad: any;
        estado: any;
        observaciones: any;
        responsable: {
            id: any;
            acceso: any;
            nombre: any;
        } | null;
        obra: {
            id: any;
            nombre: any;
            referencia: any;
            direccion: any;
            comuna: any;
            region: any;
            estado: any;
            cliente: {
                rut: any;
                nombre: any;
            } | null;
            especificacion: {
                id: any;
                modelo: any;
                zona: any;
                observaciones: any;
            } | null;
        } | null;
    }>;
    listarMisTareasTerreno(idUsuario: bigint): Promise<{
        id: string;
        titulo: string | null;
        descripcion: string | null;
        estado: string | null;
        urgencia: string | null;
        fecha: Date | null;
        bloqueHorario: Date | null;
        visita: {
            id: any;
            tipoServicio: any;
            fecha: any;
            bloqueHorario: any;
            prioridad: any;
            estado: any;
            observaciones: any;
            responsable: {
                id: any;
                acceso: any;
                nombre: any;
            } | null;
            obra: {
                id: any;
                nombre: any;
                referencia: any;
                direccion: any;
                comuna: any;
                region: any;
                estado: any;
                cliente: {
                    rut: any;
                    nombre: any;
                } | null;
                especificacion: {
                    id: any;
                    modelo: any;
                    zona: any;
                    observaciones: any;
                } | null;
            } | null;
        } | null;
        especificacion: {
            id: string;
            modelo: string | null;
            zona: string | null;
        } | null;
    }[]>;
    private readonly incluirLevantamientoTerreno;
    private readonly camposTextoLevantamiento;
    private readonly camposMedidasLevantamiento;
    private medidasObligatoriasOt;
    private resolverLevantamientoTerreno;
    private presentarLevantamientoTerreno;
    obtenerLevantamientoTerreno(id: number, actor: ActorTerrenoM6): Promise<{
        tarea: {
            id: any;
            titulo: any;
            estado: any;
            fechaActualizacion: any;
        };
        visita: {
            id: any;
            tipoServicio: any;
        };
        obra: {
            id: any;
            nombre: any;
            referencia: any;
            direccion: any;
            comuna: any;
            region: any;
            estado: any;
            cliente: {
                rut: any;
                nombre: any;
            } | null;
            especificacion: {
                id: any;
                modelo: any;
                zona: any;
                observaciones: any;
            } | null;
        } | null;
        especificacion: {
            id: any;
            modeloPuerta: any;
            zona: any;
            sentidoApertura: any;
            materialidadVano: any;
            materialidadMarcoActual: any;
            solucionMarco: any;
            hojaPasiva: any;
            hojaActiva: any;
            disenoPuerta: any;
            observacionesDiseno: any;
            cubrejuntas: any;
            bisagras: any;
            observaciones: any;
        };
        medidas: {
            id: any;
            marcoAncho: any;
            marcoAlto: any;
            marcoEspesor: any;
            vanoVerticalAncho: any;
            vanoVerticalAlto: any;
            vanoVerticalEspesor: any;
            vanoHorizontalAncho: any;
            vanoHorizontalAlto: any;
            vanoHorizontalEspesor: any;
            alojamientoVerticalAlto: any;
            alojamientoVerticalAncho: any;
            alojamientoVerticalEspesor: any;
            alojamientoHorizontalAlto: any;
            alojamientoHorizontalAncho: any;
            alojamientoHorizontalEspesor: any;
            alojamientoVertical: any;
            medidaMarcoAncho: any;
            medidaMarcoAlto: any;
            medidaMarcoEspesor: any;
        } | null;
        historial: any;
        ordenTrabajo: {
            id: any;
            estado: any;
            fecha: any;
            idEspecificacion: any;
            proyecto: any;
            area: any;
            usuario: any;
            tareasProduccion: any;
        } | null;
    }>;
    guardarLevantamientoTerreno(id: number, entrada: Record<string, unknown>, actor: ActorTerrenoM6): Promise<{
        tarea: {
            id: any;
            titulo: any;
            estado: any;
            fechaActualizacion: any;
        };
        visita: {
            id: any;
            tipoServicio: any;
        };
        obra: {
            id: any;
            nombre: any;
            referencia: any;
            direccion: any;
            comuna: any;
            region: any;
            estado: any;
            cliente: {
                rut: any;
                nombre: any;
            } | null;
            especificacion: {
                id: any;
                modelo: any;
                zona: any;
                observaciones: any;
            } | null;
        } | null;
        especificacion: {
            id: any;
            modeloPuerta: any;
            zona: any;
            sentidoApertura: any;
            materialidadVano: any;
            materialidadMarcoActual: any;
            solucionMarco: any;
            hojaPasiva: any;
            hojaActiva: any;
            disenoPuerta: any;
            observacionesDiseno: any;
            cubrejuntas: any;
            bisagras: any;
            observaciones: any;
        };
        medidas: {
            id: any;
            marcoAncho: any;
            marcoAlto: any;
            marcoEspesor: any;
            vanoVerticalAncho: any;
            vanoVerticalAlto: any;
            vanoVerticalEspesor: any;
            vanoHorizontalAncho: any;
            vanoHorizontalAlto: any;
            vanoHorizontalEspesor: any;
            alojamientoVerticalAlto: any;
            alojamientoVerticalAncho: any;
            alojamientoVerticalEspesor: any;
            alojamientoHorizontalAlto: any;
            alojamientoHorizontalAncho: any;
            alojamientoHorizontalEspesor: any;
            alojamientoVertical: any;
            medidaMarcoAncho: any;
            medidaMarcoAlto: any;
            medidaMarcoEspesor: any;
        } | null;
        historial: any;
        ordenTrabajo: {
            id: any;
            estado: any;
            fecha: any;
            idEspecificacion: any;
            proyecto: any;
            area: any;
            usuario: any;
            tareasProduccion: any;
        } | null;
    }>;
    corregirLevantamientoTerreno(id: number, entrada: Record<string, unknown>, actor: ActorTerrenoM6, estadosOrdenTrabajoPermitidos?: string[]): Promise<{
        tarea: {
            id: any;
            titulo: any;
            estado: any;
            fechaActualizacion: any;
        };
        visita: {
            id: any;
            tipoServicio: any;
        };
        obra: {
            id: any;
            nombre: any;
            referencia: any;
            direccion: any;
            comuna: any;
            region: any;
            estado: any;
            cliente: {
                rut: any;
                nombre: any;
            } | null;
            especificacion: {
                id: any;
                modelo: any;
                zona: any;
                observaciones: any;
            } | null;
        } | null;
        especificacion: {
            id: any;
            modeloPuerta: any;
            zona: any;
            sentidoApertura: any;
            materialidadVano: any;
            materialidadMarcoActual: any;
            solucionMarco: any;
            hojaPasiva: any;
            hojaActiva: any;
            disenoPuerta: any;
            observacionesDiseno: any;
            cubrejuntas: any;
            bisagras: any;
            observaciones: any;
        };
        medidas: {
            id: any;
            marcoAncho: any;
            marcoAlto: any;
            marcoEspesor: any;
            vanoVerticalAncho: any;
            vanoVerticalAlto: any;
            vanoVerticalEspesor: any;
            vanoHorizontalAncho: any;
            vanoHorizontalAlto: any;
            vanoHorizontalEspesor: any;
            alojamientoVerticalAlto: any;
            alojamientoVerticalAncho: any;
            alojamientoVerticalEspesor: any;
            alojamientoHorizontalAlto: any;
            alojamientoHorizontalAncho: any;
            alojamientoHorizontalEspesor: any;
            alojamientoVertical: any;
            medidaMarcoAncho: any;
            medidaMarcoAlto: any;
            medidaMarcoEspesor: any;
        } | null;
        historial: any;
        ordenTrabajo: {
            id: any;
            estado: any;
            fecha: any;
            idEspecificacion: any;
            proyecto: any;
            area: any;
            usuario: any;
            tareasProduccion: any;
        } | null;
    }>;
    generarOrdenTrabajoLevantamiento(id: number, actor: ActorTerrenoM6): Promise<{
        tarea: {
            id: any;
            titulo: any;
            estado: any;
            fechaActualizacion: any;
        };
        visita: {
            id: any;
            tipoServicio: any;
        };
        obra: {
            id: any;
            nombre: any;
            referencia: any;
            direccion: any;
            comuna: any;
            region: any;
            estado: any;
            cliente: {
                rut: any;
                nombre: any;
            } | null;
            especificacion: {
                id: any;
                modelo: any;
                zona: any;
                observaciones: any;
            } | null;
        } | null;
        especificacion: {
            id: any;
            modeloPuerta: any;
            zona: any;
            sentidoApertura: any;
            materialidadVano: any;
            materialidadMarcoActual: any;
            solucionMarco: any;
            hojaPasiva: any;
            hojaActiva: any;
            disenoPuerta: any;
            observacionesDiseno: any;
            cubrejuntas: any;
            bisagras: any;
            observaciones: any;
        };
        medidas: {
            id: any;
            marcoAncho: any;
            marcoAlto: any;
            marcoEspesor: any;
            vanoVerticalAncho: any;
            vanoVerticalAlto: any;
            vanoVerticalEspesor: any;
            vanoHorizontalAncho: any;
            vanoHorizontalAlto: any;
            vanoHorizontalEspesor: any;
            alojamientoVerticalAlto: any;
            alojamientoVerticalAncho: any;
            alojamientoVerticalEspesor: any;
            alojamientoHorizontalAlto: any;
            alojamientoHorizontalAncho: any;
            alojamientoHorizontalEspesor: any;
            alojamientoVertical: any;
            medidaMarcoAncho: any;
            medidaMarcoAlto: any;
            medidaMarcoEspesor: any;
        } | null;
        historial: any;
        ordenTrabajo: {
            id: any;
            estado: any;
            fecha: any;
            idEspecificacion: any;
            proyecto: any;
            area: any;
            usuario: any;
            tareasProduccion: any;
        } | null;
    }>;
    private readonly estadosEditablesRectificacion;
    private estadoVisibleOrden;
    private puedeGestionarTodasLasRectificaciones;
    private verificarAccesoRectificacion;
    private readonly incluirGestionOrdenTrabajo;
    private presentarGestionOrdenTrabajo;
    listarOrdenesTrabajoRectificacion(consulta: Record<string, unknown>, actor: ActorTerrenoM6): Promise<{
        responsablesProduccion: {
            id: any;
            nombre: string;
        }[];
        idOrdenTrabajo: any;
        idUnidad: any;
        estado: string;
        fechaCreacion: any;
        cotizacion: {
            id: any;
            cliente: any;
            fecha: any;
            notaVenta: any;
        };
        producto: {
            id: any;
            nombre: any;
            codigo: any;
            familia: any;
            numeroUnidad: any;
            caracteristicas: any;
        };
        referencia: {
            alto: any;
            ancho: any;
            espesor: any;
            descripcion: any;
        };
        rectificacion: {
            id: any;
            revision: any;
            estado: any;
            fechaAsignacion: any;
            fechaInicio: any;
            fechaRectificacion: any;
            observacionesTecnicas: any;
            caracteristicasParticulares: any;
            necesitaTareasAdicionales: any;
            comentariosFabricacion: any;
            comentariosInstalacion: any;
            registradoPor: string | null;
            empleado: {
                id: any;
                nombre: string;
                rut: any;
            } | null;
        } | null;
        especificacion: {
            id: any;
            modeloPuerta: any;
            zona: any;
            sentidoApertura: any;
            materialidadVano: any;
            materialidadMarcoActual: any;
            solucionMarco: any;
            hojaPasiva: any;
            hojaActiva: any;
            disenoPuerta: any;
            observacionesDiseno: any;
            cubrejuntas: any;
            bisagras: any;
            observaciones: any;
        } | null;
        medidas: {
            [k: string]: any;
        } | null;
        medidasObligatorias: string[];
        planificacion: any;
        planificacionInicial: any;
        empleadosProduccion: any[];
        versiones: any;
        liberacion: {
            id: any;
            fecha: any;
            usuario: string | null;
        } | null;
        historial: any;
        tareasProduccion: any;
        avance: {
            total: any;
            pendientes: any;
            enEjecucion: any;
            cerradas: any;
            porcentaje: number;
            etapas: {
                orden: number;
                nombre: string;
                total: number;
                cerradas: number;
            }[];
        };
        visitasRelacionadas: any[];
        incidencias: any[];
        historialOperacional: any[];
        etapasAdicionales: any;
        historialProduccion: any;
        cierre: {
            fecha: any;
            usuario: string | null;
            observaciones: any;
            resumen: any;
        } | null;
    }[]>;
    obtenerOrdenTrabajoRectificacion(idOrden: number, actor: ActorTerrenoM6): Promise<{
        catalogos: {
            areas: {
                id: string;
                nombre: string;
            }[];
            empleadosTerreno: {
                id: number;
                nombre: string;
                rut: string;
            }[];
            empleadosPorArea: {
                id: number;
                nombre: string;
                idArea: string;
            }[];
            tareas: {
                id: number;
                nombre: string;
                descripcion: string | null;
                idArea: string;
                tiempoEstimadoMin: number | null;
            }[];
        };
        idOrdenTrabajo: any;
        idUnidad: any;
        estado: string;
        fechaCreacion: any;
        cotizacion: {
            id: any;
            cliente: any;
            fecha: any;
            notaVenta: any;
        };
        producto: {
            id: any;
            nombre: any;
            codigo: any;
            familia: any;
            numeroUnidad: any;
            caracteristicas: any;
        };
        referencia: {
            alto: any;
            ancho: any;
            espesor: any;
            descripcion: any;
        };
        rectificacion: {
            id: any;
            revision: any;
            estado: any;
            fechaAsignacion: any;
            fechaInicio: any;
            fechaRectificacion: any;
            observacionesTecnicas: any;
            caracteristicasParticulares: any;
            necesitaTareasAdicionales: any;
            comentariosFabricacion: any;
            comentariosInstalacion: any;
            registradoPor: string | null;
            empleado: {
                id: any;
                nombre: string;
                rut: any;
            } | null;
        } | null;
        especificacion: {
            id: any;
            modeloPuerta: any;
            zona: any;
            sentidoApertura: any;
            materialidadVano: any;
            materialidadMarcoActual: any;
            solucionMarco: any;
            hojaPasiva: any;
            hojaActiva: any;
            disenoPuerta: any;
            observacionesDiseno: any;
            cubrejuntas: any;
            bisagras: any;
            observaciones: any;
        } | null;
        medidas: {
            [k: string]: any;
        } | null;
        medidasObligatorias: string[];
        planificacion: any;
        planificacionInicial: any;
        empleadosProduccion: any[];
        versiones: any;
        liberacion: {
            id: any;
            fecha: any;
            usuario: string | null;
        } | null;
        historial: any;
        tareasProduccion: any;
        avance: {
            total: any;
            pendientes: any;
            enEjecucion: any;
            cerradas: any;
            porcentaje: number;
            etapas: {
                orden: number;
                nombre: string;
                total: number;
                cerradas: number;
            }[];
        };
        visitasRelacionadas: any[];
        incidencias: any[];
        historialOperacional: any[];
        etapasAdicionales: any;
        historialProduccion: any;
        cierre: {
            fecha: any;
            usuario: string | null;
            observaciones: any;
            resumen: any;
        } | null;
    }>;
    asignarRectificadorOrdenTrabajo(idOrden: number, entrada: Record<string, unknown>, actor: ActorTerrenoM6): Promise<{
        mensaje: string;
        idOrdenTrabajo: number;
        idEmpleado: number;
        estado: string;
    }>;
    private normalizarPlanificacionRectificacion;
    guardarRectificacionOrdenTrabajo(idOrden: number, entrada: Record<string, unknown>, actor: ActorTerrenoM6): Promise<{
        mensaje: string;
        idOrdenTrabajo: number;
        estado: string;
        revision: number;
    }>;
    enviarRectificacionAprobacion(idOrden: number, entrada: Record<string, unknown>, actor: ActorTerrenoM6): Promise<{
        mensaje: string;
        idOrdenTrabajo: number;
        estado: string;
        numeroVersion: number;
    }>;
    private verificarSeparacionAprobacion;
    aprobarRectificacionOrdenTrabajo(idOrden: number, entrada: Record<string, unknown>, actor: ActorTerrenoM6): Promise<{
        mensaje: string;
        idOrdenTrabajo: number;
        estado: string;
        numeroVersion: number;
    }>;
    devolverRectificacionOrdenTrabajo(idOrden: number, entrada: Record<string, unknown>, actor: ActorTerrenoM6): Promise<{
        mensaje: string;
        idOrdenTrabajo: number;
        estado: string;
        numeroVersion: number;
    }>;
    liberarOrdenTrabajoRectificada(idOrden: number, entrada: Record<string, unknown>, actor: ActorTerrenoM6): Promise<{
        mensaje: string;
        idOrdenTrabajo: number;
        estado: string;
    }>;
    ajustarOrdenTrabajoTerreno(id: number, entrada: Record<string, unknown>, actor: ActorTerrenoM6): Promise<{
        tarea: {
            id: any;
            titulo: any;
            estado: any;
            fechaActualizacion: any;
        };
        visita: {
            id: any;
            tipoServicio: any;
        };
        obra: {
            id: any;
            nombre: any;
            referencia: any;
            direccion: any;
            comuna: any;
            region: any;
            estado: any;
            cliente: {
                rut: any;
                nombre: any;
            } | null;
            especificacion: {
                id: any;
                modelo: any;
                zona: any;
                observaciones: any;
            } | null;
        } | null;
        especificacion: {
            id: any;
            modeloPuerta: any;
            zona: any;
            sentidoApertura: any;
            materialidadVano: any;
            materialidadMarcoActual: any;
            solucionMarco: any;
            hojaPasiva: any;
            hojaActiva: any;
            disenoPuerta: any;
            observacionesDiseno: any;
            cubrejuntas: any;
            bisagras: any;
            observaciones: any;
        };
        medidas: {
            id: any;
            marcoAncho: any;
            marcoAlto: any;
            marcoEspesor: any;
            vanoVerticalAncho: any;
            vanoVerticalAlto: any;
            vanoVerticalEspesor: any;
            vanoHorizontalAncho: any;
            vanoHorizontalAlto: any;
            vanoHorizontalEspesor: any;
            alojamientoVerticalAlto: any;
            alojamientoVerticalAncho: any;
            alojamientoVerticalEspesor: any;
            alojamientoHorizontalAlto: any;
            alojamientoHorizontalAncho: any;
            alojamientoHorizontalEspesor: any;
            alojamientoVertical: any;
            medidaMarcoAncho: any;
            medidaMarcoAlto: any;
            medidaMarcoEspesor: any;
        } | null;
        historial: any;
        ordenTrabajo: {
            id: any;
            estado: any;
            fecha: any;
            idEspecificacion: any;
            proyecto: any;
            area: any;
            usuario: any;
            tareasProduccion: any;
        } | null;
    }>;
    liberarOrdenTrabajoTerreno(id: number, idOrden: number, actor: ActorTerrenoM6): Promise<{
        tarea: {
            id: any;
            titulo: any;
            estado: any;
            fechaActualizacion: any;
        };
        visita: {
            id: any;
            tipoServicio: any;
        };
        obra: {
            id: any;
            nombre: any;
            referencia: any;
            direccion: any;
            comuna: any;
            region: any;
            estado: any;
            cliente: {
                rut: any;
                nombre: any;
            } | null;
            especificacion: {
                id: any;
                modelo: any;
                zona: any;
                observaciones: any;
            } | null;
        } | null;
        especificacion: {
            id: any;
            modeloPuerta: any;
            zona: any;
            sentidoApertura: any;
            materialidadVano: any;
            materialidadMarcoActual: any;
            solucionMarco: any;
            hojaPasiva: any;
            hojaActiva: any;
            disenoPuerta: any;
            observacionesDiseno: any;
            cubrejuntas: any;
            bisagras: any;
            observaciones: any;
        };
        medidas: {
            id: any;
            marcoAncho: any;
            marcoAlto: any;
            marcoEspesor: any;
            vanoVerticalAncho: any;
            vanoVerticalAlto: any;
            vanoVerticalEspesor: any;
            vanoHorizontalAncho: any;
            vanoHorizontalAlto: any;
            vanoHorizontalEspesor: any;
            alojamientoVerticalAlto: any;
            alojamientoVerticalAncho: any;
            alojamientoVerticalEspesor: any;
            alojamientoHorizontalAlto: any;
            alojamientoHorizontalAncho: any;
            alojamientoHorizontalEspesor: any;
            alojamientoVertical: any;
            medidaMarcoAncho: any;
            medidaMarcoAlto: any;
            medidaMarcoEspesor: any;
        } | null;
        historial: any;
        ordenTrabajo: {
            id: any;
            estado: any;
            fecha: any;
            idEspecificacion: any;
            proyecto: any;
            area: any;
            usuario: any;
            tareasProduccion: any;
        } | null;
    }>;
    generarTareasProduccion(id: number, idOrden: number, entrada: Record<string, unknown>, actor: ActorTerrenoM6): Promise<{
        tarea: {
            id: any;
            titulo: any;
            estado: any;
            fechaActualizacion: any;
        };
        visita: {
            id: any;
            tipoServicio: any;
        };
        obra: {
            id: any;
            nombre: any;
            referencia: any;
            direccion: any;
            comuna: any;
            region: any;
            estado: any;
            cliente: {
                rut: any;
                nombre: any;
            } | null;
            especificacion: {
                id: any;
                modelo: any;
                zona: any;
                observaciones: any;
            } | null;
        } | null;
        especificacion: {
            id: any;
            modeloPuerta: any;
            zona: any;
            sentidoApertura: any;
            materialidadVano: any;
            materialidadMarcoActual: any;
            solucionMarco: any;
            hojaPasiva: any;
            hojaActiva: any;
            disenoPuerta: any;
            observacionesDiseno: any;
            cubrejuntas: any;
            bisagras: any;
            observaciones: any;
        };
        medidas: {
            id: any;
            marcoAncho: any;
            marcoAlto: any;
            marcoEspesor: any;
            vanoVerticalAncho: any;
            vanoVerticalAlto: any;
            vanoVerticalEspesor: any;
            vanoHorizontalAncho: any;
            vanoHorizontalAlto: any;
            vanoHorizontalEspesor: any;
            alojamientoVerticalAlto: any;
            alojamientoVerticalAncho: any;
            alojamientoVerticalEspesor: any;
            alojamientoHorizontalAlto: any;
            alojamientoHorizontalAncho: any;
            alojamientoHorizontalEspesor: any;
            alojamientoVertical: any;
            medidaMarcoAncho: any;
            medidaMarcoAlto: any;
            medidaMarcoEspesor: any;
        } | null;
        historial: any;
        ordenTrabajo: {
            id: any;
            estado: any;
            fecha: any;
            idEspecificacion: any;
            proyecto: any;
            area: any;
            usuario: any;
            tareasProduccion: any;
        } | null;
    }>;
    private obtenerTareaProduccion;
    private presentarTareaProduccion;
    listarTareasProduccion(idOrden: number): Promise<{
        id: any;
        titulo: any;
        descripcion: any;
        instrucciones: any;
        estado: any;
        prioridad: any;
        idOrdenTrabajo: any;
        idEspecificacion: any;
        asignados: any;
        produccion: {
            idEjecutable: any;
            origen: any;
            ordenEtapa: any;
            ordenTarea: any;
            idEtapaPlanificacion: any;
            idEtapaAdicional: any;
            etapaAdicional: any;
            estado: any;
            revision: any;
            prioridad: any;
            tiempoEstimadoMin: any;
            instrucciones: any;
            observaciones: any;
            fechaPlanificada: any;
            area: {
                id: any;
                nombre: any;
            } | null;
            responsable: {
                id: any;
                nombre: string;
                rut: any;
            } | null;
        } | null;
    }[]>;
    asignarTareaProduccion(id: number, entrada: Record<string, unknown>, actor: ActorTerrenoM6): Promise<{
        id: any;
        titulo: any;
        descripcion: any;
        instrucciones: any;
        estado: any;
        prioridad: any;
        idOrdenTrabajo: any;
        idEspecificacion: any;
        asignados: any;
        produccion: {
            idEjecutable: any;
            origen: any;
            ordenEtapa: any;
            ordenTarea: any;
            idEtapaPlanificacion: any;
            idEtapaAdicional: any;
            etapaAdicional: any;
            estado: any;
            revision: any;
            prioridad: any;
            tiempoEstimadoMin: any;
            instrucciones: any;
            observaciones: any;
            fechaPlanificada: any;
            area: {
                id: any;
                nombre: any;
            } | null;
            responsable: {
                id: any;
                nombre: string;
                rut: any;
            } | null;
        } | null;
    }>;
    modificarTareaProduccion(id: number, entrada: Record<string, unknown>, actor: ActorTerrenoM6): Promise<{
        id: any;
        titulo: any;
        descripcion: any;
        instrucciones: any;
        estado: any;
        prioridad: any;
        idOrdenTrabajo: any;
        idEspecificacion: any;
        asignados: any;
        produccion: {
            idEjecutable: any;
            origen: any;
            ordenEtapa: any;
            ordenTarea: any;
            idEtapaPlanificacion: any;
            idEtapaAdicional: any;
            etapaAdicional: any;
            estado: any;
            revision: any;
            prioridad: any;
            tiempoEstimadoMin: any;
            instrucciones: any;
            observaciones: any;
            fechaPlanificada: any;
            area: {
                id: any;
                nombre: any;
            } | null;
            responsable: {
                id: any;
                nombre: string;
                rut: any;
            } | null;
        } | null;
    }>;
    private presentarEjecucion;
    iniciarTareaProduccion(id: number, entrada: Record<string, unknown>, actor: ActorTerrenoM6): Promise<{
        id: any;
        titulo: any;
        descripcion: any;
        instrucciones: any;
        estado: any;
        prioridad: any;
        idOrdenTrabajo: any;
        idEspecificacion: any;
        asignados: any;
        produccion: {
            idEjecutable: any;
            origen: any;
            ordenEtapa: any;
            ordenTarea: any;
            idEtapaPlanificacion: any;
            idEtapaAdicional: any;
            etapaAdicional: any;
            estado: any;
            revision: any;
            prioridad: any;
            tiempoEstimadoMin: any;
            instrucciones: any;
            observaciones: any;
            fechaPlanificada: any;
            area: {
                id: any;
                nombre: any;
            } | null;
            responsable: {
                id: any;
                nombre: string;
                rut: any;
            } | null;
        } | null;
    }>;
    registrarEjecucionTarea(id: number, entrada: Record<string, unknown>, actor: ActorTerrenoM6): Promise<{
        id: any;
        idTarea: any;
        idUsuarioEjecutor: any;
        fecha: any;
        estado: any;
        validacion: any;
        cantidad: any;
        unidad: any;
        tarea: {
            id: any;
            titulo: any;
            idOrdenTrabajo: any;
        } | undefined;
        ejecutor: {
            id: any;
            acceso: any;
            nombre: any;
        } | null;
        empleadoEjecutor: {
            id: any;
            nombre: string;
        } | null;
        registradoPor: string | null;
    }>;
    listarEjecucionesPendientes(): Promise<{
        id: any;
        idTarea: any;
        idUsuarioEjecutor: any;
        fecha: any;
        estado: any;
        validacion: any;
        cantidad: any;
        unidad: any;
        tarea: {
            id: any;
            titulo: any;
            idOrdenTrabajo: any;
        } | undefined;
        ejecutor: {
            id: any;
            acceso: any;
            nombre: any;
        } | null;
        empleadoEjecutor: {
            id: any;
            nombre: string;
        } | null;
        registradoPor: string | null;
    }[]>;
    validarEjecucionProductiva(id: number, entrada: Record<string, unknown>, actor: ActorTerrenoM6): Promise<{
        id: any;
        idTarea: any;
        idUsuarioEjecutor: any;
        fecha: any;
        estado: any;
        validacion: any;
        cantidad: any;
        unidad: any;
        tarea: {
            id: any;
            titulo: any;
            idOrdenTrabajo: any;
        } | undefined;
        ejecutor: {
            id: any;
            acceso: any;
            nombre: any;
        } | null;
        empleadoEjecutor: {
            id: any;
            nombre: string;
        } | null;
        registradoPor: string | null;
    }>;
    agregarEtapaProduccion(idOrden: number, entrada: Record<string, unknown>, actor: ActorTerrenoM6): Promise<{
        mensaje: string;
        idEtapa: string;
    }>;
    agregarTareaProduccion(idOrden: number, entrada: Record<string, unknown>, actor: ActorTerrenoM6): Promise<{
        id: any;
        titulo: any;
        descripcion: any;
        instrucciones: any;
        estado: any;
        prioridad: any;
        idOrdenTrabajo: any;
        idEspecificacion: any;
        asignados: any;
        produccion: {
            idEjecutable: any;
            origen: any;
            ordenEtapa: any;
            ordenTarea: any;
            idEtapaPlanificacion: any;
            idEtapaAdicional: any;
            etapaAdicional: any;
            estado: any;
            revision: any;
            prioridad: any;
            tiempoEstimadoMin: any;
            instrucciones: any;
            observaciones: any;
            fechaPlanificada: any;
            area: {
                id: any;
                nombre: any;
            } | null;
            responsable: {
                id: any;
                nombre: string;
                rut: any;
            } | null;
        } | null;
    }>;
    cerrarTareaProduccion(id: number, entrada: Record<string, unknown>, actor: ActorTerrenoM6): Promise<{
        mensaje: string;
        idTarea: number;
        estado?: undefined;
    } | {
        mensaje: string;
        idTarea: number;
        estado: string;
    }>;
    solicitarCorreccionTecnicaProduccion(idOrden: number, entrada: Record<string, unknown>, actor: ActorTerrenoM6): Promise<{
        mensaje: string;
        idSolicitud: string;
        estado: string;
    }>;
    finalizarOrdenTrabajoProduccion(idOrden: number, entrada: Record<string, unknown>, actor: ActorTerrenoM6): Promise<{
        mensaje: string;
        idOrdenTrabajo: number;
        estado: string;
        resumen: {
            total: number;
            cerradas: number;
            ejecucionesValidadas: number;
        };
    } | {
        mensaje: string;
        idOrdenTrabajo: number;
        estado: string;
    }>;
    obtenerPreparacionSalida(id: number): Promise<{
        visita: {
            id: any;
            tipoServicio: any;
            fecha: any;
            bloqueHorario: any;
            prioridad: any;
            estado: any;
            observaciones: any;
            responsable: {
                id: any;
                acceso: any;
                nombre: any;
            } | null;
            obra: {
                id: any;
                nombre: any;
                referencia: any;
                direccion: any;
                comuna: any;
                region: any;
                estado: any;
                cliente: {
                    rut: any;
                    nombre: any;
                } | null;
                especificacion: {
                    id: any;
                    modelo: any;
                    zona: any;
                    observaciones: any;
                } | null;
            } | null;
        };
        checklist: {
            id: string;
            item: string | null;
            inicio: string | null;
            cierre: string | null;
            marcado: boolean | null;
            detalleMarcado: string | null;
            noMarcado: boolean | null;
            detalleNoMarcado: string | null;
        } | null;
        ordenesTrabajo: {
            id: string;
            estado: string | null;
            reservas: {
                id: string;
                materialSku: string | null;
                cantidad: string | null;
                estado: string | null;
                fechaReserva: Date | null;
                preparaciones: {
                    id: string;
                    observacion: string | null;
                    estados: {
                        nombre: string | null;
                        fecha: Date | null;
                    }[];
                }[];
            }[];
        }[];
    }>;
    actualizarChecklistSalida(id: number, entrada: Record<string, unknown>): Promise<{
        visita: {
            id: any;
            tipoServicio: any;
            fecha: any;
            bloqueHorario: any;
            prioridad: any;
            estado: any;
            observaciones: any;
            responsable: {
                id: any;
                acceso: any;
                nombre: any;
            } | null;
            obra: {
                id: any;
                nombre: any;
                referencia: any;
                direccion: any;
                comuna: any;
                region: any;
                estado: any;
                cliente: {
                    rut: any;
                    nombre: any;
                } | null;
                especificacion: {
                    id: any;
                    modelo: any;
                    zona: any;
                    observaciones: any;
                } | null;
            } | null;
        };
        checklist: {
            id: string;
            item: string | null;
            inicio: string | null;
            cierre: string | null;
            marcado: boolean | null;
            detalleMarcado: string | null;
            noMarcado: boolean | null;
            detalleNoMarcado: string | null;
        } | null;
        ordenesTrabajo: {
            id: string;
            estado: string | null;
            reservas: {
                id: string;
                materialSku: string | null;
                cantidad: string | null;
                estado: string | null;
                fechaReserva: Date | null;
                preparaciones: {
                    id: string;
                    observacion: string | null;
                    estados: {
                        nombre: string | null;
                        fecha: Date | null;
                    }[];
                }[];
            }[];
        }[];
    }>;
    registrarResultadoVisita(id: number, entrada: Record<string, unknown>): Promise<{
        idFormulario: string;
        estadoVisita: string;
    }>;
    catalogosIncidenciaOperativa(consulta?: Record<string, unknown>): Promise<{
        categorias: {
            id: number;
            codigo: string;
            nombre: string;
        }[];
        areas: {
            id: string;
            nombre: string;
        }[];
        clientes: {
            id: string;
            nombre: string;
            etiqueta: string;
        }[];
        ordenes: {
            idOrdenTrabajo: string;
            idEjecucion: string;
            idTarea: string;
            etiqueta: string;
            estadoOrden: string | null;
            estadoEjecucion: string;
            fechaEjecucion: Date;
        }[];
    }>;
    registrarIncidenciaRetrabajo(idEjecucion: number, entrada: Record<string, unknown>, actor: ActorIncidenciaM6): Promise<{
        id: string;
        idEjecucion: string;
        descripcion: string;
        categoria: {
            id: number;
            codigo: string;
            nombre: string;
        };
        area: {
            id: string;
            nombre: string | null;
        } | null;
        causaReferencia: string | null;
        responsabilidad: string | null;
        estado: string;
        estadoRevision: string;
        tieneEvidencia: boolean;
        fecha: Date;
    }>;
    listarIncidenciasOperativas(consulta?: Record<string, unknown>): Promise<{
        items: {
            id: string;
            referencia: string;
            descripcion: string;
            categoria: {
                id: number;
                codigo: string;
                nombre: string;
            } | null;
            area: {
                id: string;
                nombre: string | null;
            } | null;
            causaReferencia: string | null;
            responsabilidad: string | null;
            responsableSeguimiento: null;
            responsableOwner: {
                id: string;
                nombre: string | null;
            };
            participantes: {
                tipo: string;
                id: string;
                nombre: string | null;
            }[];
            estado: string;
            estadoRevision: string;
            fecha: Date;
            creador: {
                id: string | null;
                nombre: string | null;
            };
            revision: {
                idUsuario: string;
                nombre: string | null;
                fecha: Date | null;
                observacion: string | null;
            } | null;
            evidencias: {
                id: string;
                tipo: string | null;
                nombre: string | null;
                fecha: Date | null;
                estado: string | null;
                registrador: null;
            }[];
            trazabilidad: ({
                tipo: string;
                fecha: Date | null;
                usuario: null;
                detalle: string;
            } | {
                tipo: string;
                fecha: Date;
                usuario: string | null;
                detalle: string;
            })[];
            origen: {
                tipo: string;
                id: string;
                descripcion: string | null;
            };
            ejecucion: {
                id: string;
                tarea: {
                    id: string;
                    titulo: string | null;
                    idOrdenTrabajo: string | null;
                    idServicio: string | null;
                    proyecto: {
                        id: string;
                        codigo: string | null;
                        nombre: string | null;
                    } | null;
                } | null;
            };
            cliente: {
                rut: string;
                nombre: string | null;
            } | null;
            puerta: {
                numeroUnidad: number;
                producto: string;
                codigo: string;
                familia: string;
            } | null;
            accionesCorrectivas: {
                disponibles: boolean;
                detalle: string;
            };
        }[];
        paginacion: {
            pagina: number;
            tamano: number;
            total: number;
            totalPaginas: number;
        };
        indicadores: {
            registradas: number;
            pendientesRevision: number;
            aprobadas: number;
            rechazadas: number;
            pendientesResolucion: number;
            resueltas: number;
            categorias: {
                nombre: string;
                cantidad: number;
            }[];
            areas: {
                nombre: string;
                cantidad: number;
            }[];
        };
        fuentes: {
            estadoResolucion: string;
            accionesCorrectivas: string;
            responsableSeguimiento: string;
        };
    }>;
    obtenerEvidenciaIncidencia(idIncidencia: number, idEvidencia: number): Promise<{
        nombre: string;
        tipo: string;
        contenido: string;
    }>;
    adjuntarEvidenciaIncidencia(id: number, entrada: Record<string, unknown>, actor: ActorIncidenciaM6): Promise<{
        id: string;
        idEvidencia: string;
        tieneEvidencia: boolean;
    }>;
    actualizarIncidenciaOperativa(id: number, entrada: Record<string, unknown>): Promise<{
        id: string;
        estado: string;
        categoria: string;
        idArea: string | null;
    } | {
        id: string;
        estado: string;
        causaReferencia: string | null;
        responsabilidad: string | null;
    }>;
    resolverIncidenciaOperativa(id: number, decision: 'aprobada' | 'rechazada', entrada: Record<string, unknown>, actor: ActorIncidenciaM6): Promise<{
        id: string;
        estadoRevision: "aprobada" | "rechazada";
        observacion: string | null;
        idRevisor: string;
    }>;
    catalogoDeduccionesEmpleado(): Promise<{
        id: number;
        codigo: string | null;
        nombre: string;
    }[]>;
    listarDeduccionesEmpleado(idEmpleado: number): Promise<{
        id: number;
        idConcepto: number;
        concepto: string;
        vigenciaDesde: Date;
        vigenciaHasta: Date | null;
        valorAplicable: string | null;
        fundamento: string | null;
        autorizacionReferencia: string | null;
        activa: boolean;
    }[]>;
    asignarDeduccionEmpleado(idEmpleado: number, entrada: Record<string, unknown>): Promise<{
        id: number;
        idConcepto: number;
        concepto: string;
        vigenciaDesde: Date;
        vigenciaHasta: Date | null;
        valorAplicable: string | null;
        fundamento: string | null;
        autorizacionReferencia: string | null;
        activa: boolean;
    }[]>;
    finalizarDeduccionEmpleado(idEmpleado: number, idAsignacion: number, entrada: Record<string, unknown>): Promise<{
        id: number;
        idConcepto: number;
        concepto: string;
        vigenciaDesde: Date;
        vigenciaHasta: Date | null;
        valorAplicable: string | null;
        fundamento: string | null;
        autorizacionReferencia: string | null;
        activa: boolean;
    }[]>;
    consultarDashboardTerreno(consulta: Record<string, unknown>, actor: ActorTerrenoM6): Promise<{
        responsables: {
            id: number;
            nombre: string;
            area: string | null;
            abiertas: number;
            enEjecucion: number;
            cerradas: number;
        }[] | null;
        visitas: {
            total: number;
            hoy: number;
            proximas: number;
            sinProgramar: number;
            pendientes: number;
            finalizadas: number;
            reprogramadas: number;
            proximasActividades: {
                id: any;
                tipo: any;
                fecha: any;
                estado: any;
                obra: any;
            }[];
        } | null;
        instalaciones: {
            total: number;
            programadas: number;
            pendientes: number;
            completadas: number;
            parciales: number;
            noEjecutadas: number;
            reprogramaciones: number;
        } | null;
        incidencias: {
            total: number;
            pendientesRevision: number;
            aprobadas: number;
            rechazadas: number;
            pendientesResolucion: number;
            corregidas: number;
            cerradas: number;
            fallasConfirmadas: number;
            porCategoria: {
                nombre: string;
                cantidad: number;
            }[];
            porArea: {
                nombre: string;
                cantidad: number;
            }[];
            porPeriodo: {
                nombre: string;
                cantidad: number;
            }[];
        } | null;
        ordenes: {
            total: number;
            estados: {
                codigo: string;
                nombre: string;
                cantidad: number;
            }[];
        };
        fabricacion: {
            puertasEnFabricacion: number;
            puertasFinalizadas: number;
            tareasRequeridas: number;
            tareasPendientes: number;
            tareasEnEjecucion: number;
            ejecucionesPendientesValidacion: number;
            tareasValidadas: number;
            tareasCerradas: number;
            correccionesPendientes: number;
            porcentajeAvance: number | null;
        };
        areas: {
            puertas: number;
            id: string;
            nombre: string;
            asignadas: number;
            pendientes: number;
            enEjecucion: number;
            cerradas: number;
        }[];
        tiempos: {
            valorDias: number | null;
            muestras: number;
            codigo: string;
            nombre: string;
        }[];
        filtros: {
            desde: string;
            hasta: string;
            estado: string | null;
            area: string | null;
            responsable: number | null;
            tipoActividad: string | null;
        };
        alcance: {
            ordenes: string;
            fabricacion: string;
            visitas: string;
            instalaciones: string;
            incidencias: string;
        };
        permisos: {
            ordenes: boolean;
            visitas: boolean;
            incidencias: boolean;
            responsables: boolean;
        };
    }>;
    exportarReporteTerreno(consulta: Record<string, unknown>, actor: ActorTerrenoM6): Promise<{
        nombre: string;
        tipo: string;
        mime: string;
        contenido: string;
    }>;
}
export {};
//# sourceMappingURL=M6Controller.d.ts.map