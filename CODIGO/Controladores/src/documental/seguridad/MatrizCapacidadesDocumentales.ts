import type { AccionDocumental } from './AutorizacionDocumental';

export type EstadoAprobacionCapacidad = 'APROBADO_EXISTENTE' | 'APROBADO_C2_6' | 'PENDIENTE_APROBACION';

export interface DefinicionCapacidadDocumental {
  accion: AccionDocumental;
  moduloPropietario: 'M2' | 'M4' | 'M9' | 'DOCUMENTAL';
  cuExistente: string | null;
  cuPropuesto: string | null;
  necesitaCuNuevo: boolean;
  perfilPropuesto: 'POR_DEFINIR_POR_EMPRESA';
  restriccionEntidad: string;
  restriccionClasificacion: string;
  requiereAuditoria: boolean;
  tipoAcceso: 'CONSULTA' | 'ESCRITURA';
  riesgo: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO';
  estadoAprobacion: EstadoAprobacionCapacidad;
  bloqueosAdicionales: readonly ('POLITICA_COMERCIAL' | 'STORAGE' | 'ANTIVIRUS' | 'CATALOGO_M9')[];
}

/** Matriz informativa. No concede permisos ni modifica perfiles M4. */
export const MATRIZ_CAPACIDADES_DOCUMENTALES: readonly DefinicionCapacidadDocumental[] = [
  { accion:'CONSULTAR_METADATA', moduloPropietario:'M2', cuExistente:'CU360', cuPropuesto:null, necesitaCuNuevo:false, perfilPropuesto:'POR_DEFINIR_POR_EMPRESA', restriccionEntidad:'PRODUCTO_COMERCIAL', restriccionClasificacion:'COMERCIAL', tipoAcceso:'CONSULTA', requiereAuditoria:false, riesgo:'BAJO', estadoAprobacion:'APROBADO_EXISTENTE', bloqueosAdicionales:[] },
  { accion:'CONSULTAR_VERSIONES', moduloPropietario:'M2', cuExistente:'CU367', cuPropuesto:null, necesitaCuNuevo:false, perfilPropuesto:'POR_DEFINIR_POR_EMPRESA', restriccionEntidad:'PRODUCTO_COMERCIAL_ASOCIADO', restriccionClasificacion:'COMERCIAL', tipoAcceso:'CONSULTA', requiereAuditoria:false, riesgo:'MEDIO', estadoAprobacion:'APROBADO_EXISTENTE', bloqueosAdicionales:[] },
  { accion:'ASOCIAR_PRODUCTO', moduloPropietario:'M2', cuExistente:'CU374', cuPropuesto:null, necesitaCuNuevo:false, perfilPropuesto:'POR_DEFINIR_POR_EMPRESA', restriccionEntidad:'PRODUCTO_COMERCIAL', restriccionClasificacion:'COMERCIAL', tipoAcceso:'ESCRITURA', requiereAuditoria:true, riesgo:'MEDIO', estadoAprobacion:'APROBADO_C2_6', bloqueosAdicionales:['CATALOGO_M9'] },
  { accion:'SOLICITAR_VISTA_PREVIA', moduloPropietario:'M2', cuExistente:'CU375', cuPropuesto:null, necesitaCuNuevo:false, perfilPropuesto:'POR_DEFINIR_POR_EMPRESA', restriccionEntidad:'PRODUCTO_COMERCIAL_ASOCIADO', restriccionClasificacion:'COMERCIAL', tipoAcceso:'CONSULTA', requiereAuditoria:true, riesgo:'MEDIO', estadoAprobacion:'APROBADO_C2_6', bloqueosAdicionales:['POLITICA_COMERCIAL','STORAGE'] },
  { accion:'DESCARGAR', moduloPropietario:'M2', cuExistente:'CU376', cuPropuesto:null, necesitaCuNuevo:false, perfilPropuesto:'POR_DEFINIR_POR_EMPRESA', restriccionEntidad:'PRODUCTO_COMERCIAL_ASOCIADO', restriccionClasificacion:'COMERCIAL', tipoAcceso:'CONSULTA', requiereAuditoria:true, riesgo:'ALTO', estadoAprobacion:'APROBADO_C2_6', bloqueosAdicionales:['POLITICA_COMERCIAL','STORAGE','ANTIVIRUS','CATALOGO_M9'] },
  ...(['CREAR_INTENCION','CONFIRMAR_CARGA','REEMPLAZAR','DEFINIR_IMAGEN_PRINCIPAL','ORDENAR_GALERIA','DEFINIR_USO_B2B_B2C','ARCHIVAR_DOCUMENTO','GESTIONAR_CUARENTENA','ADMINISTRAR_CONSERVACION'] as const).map((accion): DefinicionCapacidadDocumental => ({
    accion,
    moduloPropietario: accion === 'ADMINISTRAR_CONSERVACION' ? 'DOCUMENTAL' : 'M2',
    cuExistente: accion === 'ADMINISTRAR_CONSERVACION' ? null : ['DEFINIR_IMAGEN_PRINCIPAL','ORDENAR_GALERIA','DEFINIR_USO_B2B_B2C'].includes(accion) ? 'CU374' : 'CU373',
    cuPropuesto: accion === 'ADMINISTRAR_CONSERVACION' ? 'CU377' : null,
    necesitaCuNuevo: accion === 'ADMINISTRAR_CONSERVACION',
    perfilPropuesto: 'POR_DEFINIR_POR_EMPRESA',
    restriccionEntidad: accion === 'ADMINISTRAR_CONSERVACION' ? 'POLITICA_DOCUMENTAL' : 'PRODUCTO_COMERCIAL_ASOCIADO',
    restriccionClasificacion: 'POR_DEFINIR',
    tipoAcceso: 'ESCRITURA',
    requiereAuditoria: true,
    riesgo: ['REEMPLAZAR','ARCHIVAR_DOCUMENTO','GESTIONAR_CUARENTENA','ADMINISTRAR_CONSERVACION'].includes(accion) ? 'ALTO' : 'MEDIO',
    estadoAprobacion: accion === 'ADMINISTRAR_CONSERVACION' ? 'PENDIENTE_APROBACION' : 'APROBADO_C2_6',
    bloqueosAdicionales: accion === 'ADMINISTRAR_CONSERVACION' ? ['POLITICA_COMERCIAL'] : ['POLITICA_COMERCIAL','STORAGE','ANTIVIRUS','CATALOGO_M9'],
  })),
];
