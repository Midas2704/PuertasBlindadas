import { randomUUID } from 'node:crypto';
import { ErrorAplicacion } from '../utilidades/ErrorAplicacion';
import type { M9Controller } from '../controladores/M9Controller';
import type { ActorAutenticado } from '../controladores/M4Controller';
import type { EventoEntradaM9, JsonM9, ResultadoM9 } from './tipos';

export const VERSION_CONTRATO_M9 = '1.0';
export const VERSIONES_COMPATIBLES_M9 = [VERSION_CONTRATO_M9] as const;
export const PRODUCTORES_AUTORIZADOS_M9 = ['M1','M2','M3','M4','M5','M6','M7','M8','M9'] as const;

export type ProductorM9 = typeof PRODUCTORES_AUTORIZADOS_M9[number];
export type AcuseM9 =
  | { estado: 'ACK'; identidadLogica: string; eventoId: number }
  | { estado: 'PENDIENTE'; identidadLogica: string }
  | { estado: 'NACK'; identidadLogica: string; codigo: string };

export type EspecificacionAuditableM9 = {
  modulo: Exclude<ProductorM9, 'M9'>;
  operacion: string;
  entidad: string;
  critico: boolean;
  consultaSensible?: boolean;
  motivoRequerido?: boolean;
};

// Catálogo deliberadamente corto: sólo confirmaciones ya existentes y semánticamente inequívocas.
export const CATALOGO_PRODUCTORES_M9: Record<string, EspecificacionAuditableM9> = {
  crearCliente: { modulo:'M1', operacion:'CLIENTE_CREADO', entidad:'CLIENTE', critico:false },
  actualizarCliente: { modulo:'M1', operacion:'CLIENTE_ACTUALIZADO', entidad:'CLIENTE', critico:false },
  desactivarCliente: { modulo:'M1', operacion:'CLIENTE_DESACTIVADO', entidad:'CLIENTE', critico:false },
  guardarCotizacion: { modulo:'M2', operacion:'COTIZACION_BORRADOR_CREADA', entidad:'COTIZACION', critico:false },
  editarCotizacion: { modulo:'M2', operacion:'COTIZACION_BORRADOR_MODIFICADA', entidad:'COTIZACION', critico:false },
  registrarObraDesdeCotizacion: { modulo:'M2', operacion:'OBRA_REGISTRADA_DESDE_COTIZACION', entidad:'OBRA', critico:false },
  vincularObraCotizacion: { modulo:'M2', operacion:'OBRA_VINCULADA_A_COTIZACION', entidad:'COTIZACION', critico:false },
  emitirCotizacion: { modulo:'M2', operacion:'COTIZACION_EMITIDA', entidad:'COTIZACION', critico:false },
  previsualizarCotizacionPdf: { modulo:'M2', operacion:'COTIZACION_PDF_PREVISUALIZADA', entidad:'COTIZACION', critico:false },
  previsualizarCartaComercialB2C: { modulo:'M2', operacion:'CARTA_B2C_PREVISUALIZADA', entidad:'CARTA_COMERCIAL_B2C', critico:false },
  crearPlantillaDocumentalComercial: { modulo:'M2', operacion:'PLANTILLA_DOCUMENTAL_CREADA', entidad:'PLANTILLA_DOCUMENTAL', critico:false },
  editarPlantillaDocumentalComercial: { modulo:'M2', operacion:'PLANTILLA_DOCUMENTAL_VERSIONADA', entidad:'PLANTILLA_DOCUMENTAL', critico:false, motivoRequerido:true },
  publicarPlantillaDocumentalComercial: { modulo:'M2', operacion:'PLANTILLA_DOCUMENTAL_PUBLICADA', entidad:'PLANTILLA_DOCUMENTAL', critico:true, motivoRequerido:true },
  crearCartaComercialB2C: { modulo:'M2', operacion:'CARTA_B2C_CREADA', entidad:'CARTA_COMERCIAL_B2C', critico:false },
  editarCartaComercialB2C: { modulo:'M2', operacion:'CARTA_B2C_MODIFICADA', entidad:'CARTA_COMERCIAL_B2C', critico:false },
  publicarCartaComercialB2C: { modulo:'M2', operacion:'CARTA_B2C_PUBLICADA', entidad:'CARTA_COMERCIAL_B2C', critico:true, motivoRequerido:true },
  descargarPdfHistoricoCotizacion: { modulo:'M2', operacion:'COTIZACION_PDF_DESCARGADO', entidad:'COTIZACION', critico:false, consultaSensible:true },
  descargarCartaComercialB2C: { modulo:'M2', operacion:'CARTA_B2C_PDF_DESCARGADO', entidad:'CARTA_COMERCIAL_B2C', critico:false, consultaSensible:true },
  seleccionarAlternativaB2C: { modulo:'M2', operacion:'ALTERNATIVA_B2C_SELECCIONADA', entidad:'ALTERNATIVA_B2C', critico:false, motivoRequerido:true },
  aceptarAlternativaB2C: { modulo:'M2', operacion:'ALTERNATIVA_B2C_ACEPTADA', entidad:'ALTERNATIVA_B2C', critico:true, motivoRequerido:true },
  rechazarAlternativaB2C: { modulo:'M2', operacion:'ALTERNATIVA_B2C_RECHAZADA', entidad:'ALTERNATIVA_B2C', critico:false, motivoRequerido:true },
  aprobarCotizacion: { modulo:'M2', operacion:'COTIZACION_APROBADA', entidad:'COTIZACION', critico:false },
  crearFamiliaProductoComercial: { modulo:'M2', operacion:'FAMILIA_COMERCIAL_CREADA', entidad:'FAMILIA_PRODUCTO_COMERCIAL', critico:false },
  aprobarCotizacionB2B: { modulo:'M2', operacion:'COTIZACION_B2B_APROBADA_OT_GENERADAS', entidad:'COTIZACION', critico:true },
  consolidarB2C: { modulo:'M2', operacion:'COTIZACION_B2C_APROBADA_OT_GENERADAS', entidad:'COTIZACION', critico:true },
  crearTareaFabricacion: { modulo:'M2', operacion:'TAREA_FABRICACION_CREADA', entidad:'TAREA_FABRICACION', critico:false },
  actualizarTareaFabricacion: { modulo:'M2', operacion:'TAREA_FABRICACION_ACTUALIZADA', entidad:'TAREA_FABRICACION', critico:false },
  desactivarTareaFabricacion: { modulo:'M2', operacion:'TAREA_FABRICACION_DESACTIVADA', entidad:'TAREA_FABRICACION', critico:false },
  reactivarTareaFabricacion: { modulo:'M2', operacion:'TAREA_FABRICACION_REACTIVADA', entidad:'TAREA_FABRICACION', critico:false },
  guardarBorradorPlantillaFabricacion: { modulo:'M2', operacion:'BORRADOR_PLANTILLA_FABRICACION_GUARDADO', entidad:'PLANTILLA_FABRICACION', critico:false },
  publicarPlantillaFabricacionFamilia: { modulo:'M2', operacion:'PLANTILLA_FABRICACION_PUBLICADA', entidad:'PLANTILLA_FABRICACION', critico:false, motivoRequerido:true },
  actualizarFamiliaProductoComercial: { modulo:'M2', operacion:'FAMILIA_COMERCIAL_MODIFICADA', entidad:'FAMILIA_PRODUCTO_COMERCIAL', critico:false },
  desactivarFamiliaProductoComercial: { modulo:'M2', operacion:'FAMILIA_COMERCIAL_DESACTIVADA', entidad:'FAMILIA_PRODUCTO_COMERCIAL', critico:false, motivoRequerido:true },
  reactivarFamiliaProductoComercial: { modulo:'M2', operacion:'FAMILIA_COMERCIAL_REACTIVADA', entidad:'FAMILIA_PRODUCTO_COMERCIAL', critico:false, motivoRequerido:true },
  crearProductoComercial: { modulo:'M2', operacion:'PRODUCTO_COMERCIAL_CREADO', entidad:'PRODUCTO_COMERCIAL', critico:false },
  actualizarProductoComercial: { modulo:'M2', operacion:'BORRADOR_PRODUCTO_COMERCIAL_MODIFICADO', entidad:'PRODUCTO_COMERCIAL', critico:false },
  desactivarProductoComercial: { modulo:'M2', operacion:'PRODUCTO_COMERCIAL_DESACTIVADO', entidad:'PRODUCTO_COMERCIAL', critico:false, motivoRequerido:true },
  reactivarProductoComercial: { modulo:'M2', operacion:'PRODUCTO_COMERCIAL_REACTIVADO', entidad:'PRODUCTO_COMERCIAL', critico:false, motivoRequerido:true },
  publicarVersionProductoComercial: { modulo:'M2', operacion:'VERSION_PRODUCTO_COMERCIAL_PUBLICADA', entidad:'PRODUCTO_COMERCIAL', critico:false, motivoRequerido:true },
  vincularProductoComercial: { modulo:'M2', operacion:'VINCULACION_PRODUCTO_COMERCIAL_MODIFICADA', entidad:'PRODUCTO_COMERCIAL', critico:false, motivoRequerido:true },
  crearPrecioComercial: { modulo:'M2', operacion:'PRECIO_COMERCIAL_CREADO', entidad:'PRECIO_COMERCIAL', critico:false, motivoRequerido:true },
  versionarPrecioComercial: { modulo:'M2', operacion:'PRECIO_COMERCIAL_VERSIONADO', entidad:'PRECIO_COMERCIAL', critico:false, motivoRequerido:true },
  desactivarPrecioComercial: { modulo:'M2', operacion:'PRECIO_COMERCIAL_DESACTIVADO', entidad:'PRECIO_COMERCIAL', critico:false, motivoRequerido:true },
  crearServicioComercial: { modulo:'M2', operacion:'SERVICIO_COMERCIAL_CREADO', entidad:'SERVICIO_COMERCIAL', critico:false, motivoRequerido:true },
  versionarPrecioServicioComercial: { modulo:'M2', operacion:'PRECIO_SERVICIO_VERSIONADO', entidad:'SERVICIO_COMERCIAL', critico:false, motivoRequerido:true },
  desactivarServicioComercial: { modulo:'M2', operacion:'SERVICIO_COMERCIAL_DESACTIVADO', entidad:'SERVICIO_COMERCIAL', critico:false, motivoRequerido:true },
  crearOpcionalComercial: { modulo:'M2', operacion:'OPCIONAL_COMERCIAL_CREADO', entidad:'OPCIONAL_COMERCIAL', critico:false, motivoRequerido:true },
  actualizarOpcionalComercial: { modulo:'M2', operacion:'OPCIONAL_COMERCIAL_MODIFICADO', entidad:'OPCIONAL_COMERCIAL', critico:false, motivoRequerido:true },
  configurarCompatibilidadOpcional: { modulo:'M2', operacion:'COMPATIBILIDAD_OPCIONAL_MODIFICADA', entidad:'OPCIONAL_COMERCIAL', critico:false, motivoRequerido:true },
  versionarPrecioOpcional: { modulo:'M2', operacion:'PRECIO_OPCIONAL_VERSIONADO', entidad:'OPCIONAL_COMERCIAL', critico:false, motivoRequerido:true },
  desactivarOpcionalComercial: { modulo:'M2', operacion:'OPCIONAL_COMERCIAL_DESACTIVADO', entidad:'OPCIONAL_COMERCIAL', critico:false, motivoRequerido:true },
  crearTarifaInstalacionComercial: { modulo:'M2', operacion:'TARIFA_COMERCIAL_CREADA', entidad:'TARIFA_INSTALACION_COMERCIAL', critico:false, motivoRequerido:true },
  versionarTarifaInstalacionComercial: { modulo:'M2', operacion:'TARIFA_COMERCIAL_VERSIONADA', entidad:'TARIFA_INSTALACION_COMERCIAL', critico:false, motivoRequerido:true },
  registrarExclusionComunal: { modulo:'M2', operacion:'EXCLUSION_COMUNAL_REGISTRADA', entidad:'TARIFA_INSTALACION_COMERCIAL', critico:false, motivoRequerido:true },
  desactivarTarifaInstalacionComercial: { modulo:'M2', operacion:'TARIFA_COMERCIAL_DESACTIVADA', entidad:'TARIFA_INSTALACION_COMERCIAL', critico:false, motivoRequerido:true },
  crearCondicionComercial: { modulo:'M2', operacion:'CONDICION_COMERCIAL_CREADA', entidad:'CONDICION_COMERCIAL', critico:false, motivoRequerido:true },
  versionarCondicionComercial: { modulo:'M2', operacion:'CONDICION_COMERCIAL_VERSIONADA', entidad:'CONDICION_COMERCIAL', critico:false, motivoRequerido:true },
  publicarCondicionComercial: { modulo:'M2', operacion:'CONDICION_COMERCIAL_PUBLICADA', entidad:'CONDICION_COMERCIAL', critico:false, motivoRequerido:true },
  desactivarCondicionComercial: { modulo:'M2', operacion:'CONDICION_COMERCIAL_DESACTIVADA', entidad:'CONDICION_COMERCIAL', critico:false, motivoRequerido:true },
  anularVenta: { modulo:'M2', operacion:'VENTA_ANULADA', entidad:'NOTA_VENTA', critico:false, motivoRequerido:true },
  revertirVenta: { modulo:'M2', operacion:'VENTA_REVERTIDA', entidad:'NOTA_VENTA', critico:false, motivoRequerido:true },
  registrarPago: { modulo:'M3', operacion:'PAGO_REGISTRADO', entidad:'PAGO_CLIENTE', critico:false },
  anularPago: { modulo:'M3', operacion:'PAGO_ANULADO', entidad:'PAGO_CLIENTE', critico:false, motivoRequerido:true },
  conciliarPago: { modulo:'M3', operacion:'PAGO_CONCILIADO', entidad:'PAGO_CLIENTE', critico:false },
  registrarUsuario: { modulo:'M4', operacion:'CUENTA_CREADA', entidad:'USUARIO', critico:false },
  asignarPermisos: { modulo:'M4', operacion:'PERMISOS_ASIGNADOS', entidad:'USUARIO', critico:false },
  retirarPermisos: { modulo:'M4', operacion:'PERMISOS_RETIRADOS', entidad:'USUARIO', critico:false },
  cerrarSesionAdministrativa: { modulo:'M4', operacion:'SESION_CERRADA', entidad:'SESION', critico:false },
  crearProveedor: { modulo:'M5', operacion:'PROVEEDOR_CREADO', entidad:'PROVEEDOR', critico:false },
  confirmarOperacionPago: { modulo:'M5', operacion:'PAGO_PROVEEDOR_CONFIRMADO', entidad:'PAGO_PROVEEDOR', critico:false },
  aprobarGastoCajaChica: { modulo:'M5', operacion:'GASTO_CAJA_APROBADO', entidad:'GASTO_CAJA_CHICA', critico:false },
  confirmarPagoFinal: { modulo:'M6', operacion:'PAGO_REMUNERACION_CONFIRMADO', entidad:'PAGO_REMUNERACION', critico:false },
  actualizarPagoAnticipo: { modulo:'M6', operacion:'PAGO_PREPARADO_MODIFICADO', entidad:'PAGO_REMUNERACION', critico:false },
  actualizarPagoFinal: { modulo:'M6', operacion:'PAGO_PREPARADO_MODIFICADO', entidad:'PAGO_REMUNERACION', critico:false },
  actualizarPagoHonorarios: { modulo:'M6', operacion:'PAGO_PREPARADO_MODIFICADO', entidad:'PAGO_REMUNERACION', critico:false },
  confirmarBoletaHonorarios: { modulo:'M6', operacion:'BOLETA_HONORARIOS_CONFIRMADA', entidad:'BOLETA_HONORARIOS', critico:false },
  registrarResultadoVisita: { modulo:'M6', operacion:'RESULTADO_TERRENO_REGISTRADO', entidad:'VISITA_TERRENO', critico:false },
  asignarRectificadorOrdenTrabajo: { modulo:'M6', operacion:'RECTIFICADOR_OT_ASIGNADO', entidad:'ORDEN_TRABAJO', critico:false, motivoRequerido:true },
  guardarRectificacionOrdenTrabajo: { modulo:'M6', operacion:'RECTIFICACION_OT_MODIFICADA', entidad:'ORDEN_TRABAJO', critico:false, motivoRequerido:true },
  enviarRectificacionAprobacion: { modulo:'M6', operacion:'RECTIFICACION_OT_ENVIADA_APROBACION', entidad:'ORDEN_TRABAJO', critico:true, motivoRequerido:true },
  aprobarRectificacionOrdenTrabajo: { modulo:'M6', operacion:'RECTIFICACION_OT_APROBADA', entidad:'ORDEN_TRABAJO', critico:true, motivoRequerido:false },
  devolverRectificacionOrdenTrabajo: { modulo:'M6', operacion:'RECTIFICACION_OT_DEVUELTA', entidad:'ORDEN_TRABAJO', critico:true, motivoRequerido:true },
  liberarOrdenTrabajoRectificada: { modulo:'M6', operacion:'ORDEN_TRABAJO_LIBERADA_PRODUCCION', entidad:'ORDEN_TRABAJO', critico:true, motivoRequerido:false },
  asignarTareaProduccion: { modulo:'M6', operacion:'RESPONSABLE_TAREA_REASIGNADO', entidad:'TAREA_PRODUCCION', critico:false, motivoRequerido:true },
  modificarTareaProduccion: { modulo:'M6', operacion:'TAREA_PRODUCCION_MODIFICADA', entidad:'TAREA_PRODUCCION', critico:false, motivoRequerido:true },
  agregarEtapaProduccion: { modulo:'M6', operacion:'ETAPA_PRODUCCION_INCORPORADA', entidad:'ORDEN_TRABAJO', critico:false, motivoRequerido:true },
  agregarTareaProduccion: { modulo:'M6', operacion:'TAREA_PRODUCCION_INCORPORADA', entidad:'ORDEN_TRABAJO', critico:false, motivoRequerido:true },
  iniciarTareaProduccion: { modulo:'M6', operacion:'TAREA_PRODUCCION_INICIADA', entidad:'TAREA_PRODUCCION', critico:false, motivoRequerido:false },
  cerrarTareaProduccion: { modulo:'M6', operacion:'TAREA_PRODUCCION_CERRADA', entidad:'TAREA_PRODUCCION', critico:true, motivoRequerido:true },
  solicitarCorreccionTecnicaProduccion: { modulo:'M6', operacion:'CORRECCION_TECNICA_SOLICITADA', entidad:'ORDEN_TRABAJO', critico:true, motivoRequerido:true },
  finalizarOrdenTrabajoProduccion: { modulo:'M6', operacion:'ORDEN_TRABAJO_FINALIZADA', entidad:'ORDEN_TRABAJO', critico:true, motivoRequerido:false },
  registrarIncidenciaRetrabajo: { modulo:'M6', operacion:'INCIDENCIA_CREADA', entidad:'INCIDENCIA_TERRENO', critico:false },
  actualizarIncidenciaOperativa: { modulo:'M6', operacion:'INCIDENCIA_MODIFICADA', entidad:'INCIDENCIA_TERRENO', critico:false },
  adjuntarEvidenciaIncidencia: { modulo:'M6', operacion:'INCIDENCIA_MODIFICADA', entidad:'INCIDENCIA_TERRENO', critico:false },
  aprobarIncidenciaOperativa: { modulo:'M6', operacion:'INCIDENCIA_APROBADA', entidad:'INCIDENCIA_TERRENO', critico:false },
  rechazarIncidenciaOperativa: { modulo:'M6', operacion:'INCIDENCIA_RECHAZADA', entidad:'INCIDENCIA_TERRENO', critico:false },
  descargarPdfDashboardM7: { modulo:'M7', operacion:'EXPORTACION_DASHBOARD_CONFIRMADA', entidad:'DASHBOARD', critico:false, consultaSensible:true },
  descargarExcelDashboardM7: { modulo:'M7', operacion:'EXPORTACION_DASHBOARD_EXCEL', entidad:'DASHBOARD', critico:false, consultaSensible:true },
  crearProyeccionM7: { modulo:'M7', operacion:'PROYECCION_FINANCIERA_CREADA', entidad:'PROYECCION_FINANCIERA', critico:false },
  actualizarProyeccionM7: { modulo:'M7', operacion:'PROYECCION_FINANCIERA_ACTUALIZADA', entidad:'PROYECCION_FINANCIERA', critico:false },
  desactivarProyeccionM7: { modulo:'M7', operacion:'PROYECCION_FINANCIERA_DESACTIVADA', entidad:'PROYECCION_FINANCIERA', critico:false },
  crearCuentaBancariaM7: { modulo:'M7', operacion:'CUENTA_BANCARIA_CREADA', entidad:'CUENTA_BANCARIA', critico:false },
  actualizarCuentaBancariaM7: { modulo:'M7', operacion:'CUENTA_BANCARIA_ACTUALIZADA', entidad:'CUENTA_BANCARIA', critico:false },
  crearSaldoInicialBancarioM7: { modulo:'M7', operacion:'SALDO_INICIAL_BANCARIO_CREADO', entidad:'SALDO_INICIAL_BANCARIO', critico:false },
  actualizarSaldoInicialBancarioM7: { modulo:'M7', operacion:'SALDO_INICIAL_BANCARIO_ACTUALIZADO', entidad:'SALDO_INICIAL_BANCARIO', critico:false },
  crearSolicitudInicialM8: { modulo:'M8', operacion:'SOLICITUD_CREDITO_CREADA', entidad:'SOLICITUD_CREDITO', critico:false },
  resolverSolicitudInicialM8: { modulo:'M8', operacion:'SOLICITUD_CREDITO_RESUELTA', entidad:'SOLICITUD_CREDITO', critico:false, motivoRequerido:true },
  suspenderCreditoM8: { modulo:'M8', operacion:'CREDITO_SUSPENDIDO', entidad:'CLIENTE_CREDITO', critico:false, motivoRequerido:true },
  reactivarCreditoM8: { modulo:'M8', operacion:'CREDITO_REACTIVADO', entidad:'CLIENTE_CREDITO', critico:false },
  modificarCupoCreditoM8: { modulo:'M8', operacion:'CUPO_CREDITO_MODIFICADO', entidad:'CLIENTE_CREDITO', critico:false },
};

type SolicitudProductorM9 = {
  parametros?: Record<string, unknown>;
  cuerpo?: Record<string, unknown>;
  idSolicitud?: string;
  ocurridoEn?: string;
};

type ReceptorM9 = Pick<M9Controller, 'recibir'>;

const textoId = (valor: unknown) => typeof valor === 'bigint' ? valor.toString() : ['string','number'].includes(typeof valor) ? String(valor) : null;
const referencia = (solicitud: SolicitudProductorM9, resultado: unknown) => {
  for (const valor of Object.values(solicitud.parametros ?? {})) { const id = textoId(valor); if (id) return id; }
  if (resultado && typeof resultado === 'object') {
    for (const [clave, valor] of Object.entries(resultado as Record<string, unknown>)) {
      if (/^(id|id[A-Z_]|.*_id$)/.test(clave)) { const id = textoId(valor); if (id) return id; }
    }
  }
  return null;
};

const motivo = (cuerpo?: Record<string, unknown>) => {
  for (const clave of ['motivo','justificacion','causa','observacion']) {
    const valor = cuerpo?.[clave];
    if (typeof valor === 'string' && valor.trim()) return valor.trim().slice(0, 4000);
  }
  return undefined;
};

const resultadoEvento = (error: unknown): ResultadoM9 => error instanceof ErrorAplicacion && error.estado >= 400 && error.estado < 500 ? 'RECHAZADO' : 'FALLIDO';

export class ProductorAuditoriaM9 {
  constructor(private readonly receptor: ReceptorM9, private readonly timeoutMs = 3000) {}

  private entrada(operacionOwner: string, actor: ActorAutenticado, solicitud: SolicitudProductorM9, resultado: ResultadoM9, salida?: unknown, error?: unknown): EventoEntradaM9 | null {
    const especificacion = CATALOGO_PRODUCTORES_M9[operacionOwner];
    if (!especificacion) return null;
    const id = referencia(solicitud, salida);
    const identidad = solicitud.idSolicitud?.trim() || randomUUID();
    const razon = motivo(solicitud.cuerpo);
    const delta = salida && typeof salida === 'object' ? (salida as { __auditoriaM9?: { anterior?: JsonM9; nuevo?: JsonM9 } }).__auditoriaM9 : undefined;
    return {
      identidadLogica: `${especificacion.modulo}:${operacionOwner}:${identidad}`,
      versionContrato: VERSION_CONTRATO_M9,
      ocurridoEn: solicitud.ocurridoEn ?? new Date().toISOString(), zonaHoraria:'UTC',
      ejecutor:{ tipo:'HUMANO', referencia:actor.id.toString() },
      productor:especificacion.modulo, modulo:especificacion.modulo,
      operacion:especificacion.operacion, resultado,
      ...(id ? { referencia:{ tipo:especificacion.entidad, id } } : {}),
      ...(razon ? { motivo:razon } : {}),
      ...(delta?.anterior ? { anterior:delta.anterior } : {}),
      ...(delta?.nuevo ? { nuevo:delta.nuevo } : {}),
      motivoRequerido:especificacion.motivoRequerido,
      causa:error instanceof ErrorAplicacion ? error.codigo : error ? 'ERROR_OWNER' : undefined,
      critico:especificacion.critico, capacidad:'EMITIR_EVENTO_M9',
      metadatos:{ sourceVersion:VERSION_CONTRATO_M9 },
    };
  }

  private async enviar(entrada: EventoEntradaM9): Promise<AcuseM9> {
    if (!PRODUCTORES_AUTORIZADOS_M9.includes(entrada.productor as ProductorM9) || entrada.productor === 'M9') return { estado:'NACK', identidadLogica:entrada.identidadLogica, codigo:'M9_PRODUCTOR_NO_AUTORIZADO' };
    try {
      const recepcion = await Promise.race([
        this.receptor.recibir(entrada),
        new Promise<never>((_, rechazar) => setTimeout(() => rechazar(new ErrorAplicacion(504, 'Timeout M9', 'M9_TIMEOUT')), this.timeoutMs)),
      ]);
      if (recepcion.estado === 'PERSISTIDO' && recepcion.evento) return { estado:'ACK', identidadLogica:entrada.identidadLogica, eventoId:recepcion.evento.id };
      return { estado:'PENDIENTE', identidadLogica:entrada.identidadLogica };
    } catch (error) {
      return { estado:'NACK', identidadLogica:entrada.identidadLogica, codigo:error instanceof ErrorAplicacion ? error.codigo : 'M9_ERROR' };
    }
  }

  async ejecutar<T>(operacionOwner: string, actor: ActorAutenticado, solicitud: SolicitudProductorM9, ejecutarOwner: () => Promise<T>): Promise<T> {
    const especificacion = CATALOGO_PRODUCTORES_M9[operacionOwner];
    if (!especificacion) return ejecutarOwner();
    try {
      const salida = await ejecutarOwner();
      const entrada = this.entrada(operacionOwner, actor, solicitud, 'EXITOSO', salida)!;
      const acuse = await this.enviar(entrada);
      if (especificacion.critico && acuse.estado !== 'ACK') throw new ErrorAplicacion(503, 'Auditoría crítica no confirmada', acuse.estado === 'NACK' ? acuse.codigo : 'M9_SIN_ACK');
      return salida;
    } catch (error) {
      const entrada = this.entrada(operacionOwner, actor, solicitud, resultadoEvento(error), undefined, error);
      if (entrada) await this.enviar(entrada);
      throw error;
    }
  }

  // Frontera para owners críticos: confirmar sólo después del ACK durable.
  async ejecutarCritico<TPreparado, TResult>(entrada: EventoEntradaM9, preparar: () => Promise<TPreparado>, confirmar: (preparado: TPreparado) => Promise<TResult>) {
    const preparado = await preparar();
    const acuse = await this.enviar({ ...entrada, critico:true });
    if (acuse.estado !== 'ACK') throw new ErrorAplicacion(503, 'Auditoría crítica no confirmada', acuse.estado === 'NACK' ? acuse.codigo : 'M9_SIN_ACK');
    return confirmar(preparado);
  }
}
