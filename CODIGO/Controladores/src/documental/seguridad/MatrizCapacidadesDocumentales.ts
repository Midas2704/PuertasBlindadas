import type { AccionDocumental } from './AutorizacionDocumental';

export type EstadoAprobacionCapacidad = 'APROBADO_EXISTENTE' | 'PENDIENTE_APROBACION';

export interface DefinicionCapacidadDocumental {
  accion: AccionDocumental;
  moduloPropietario: 'M2' | 'M4' | 'M9' | 'DOCUMENTAL';
  cuExistente: string | null;
  necesitaCuNuevo: boolean;
  perfilPropuesto: 'POR_DEFINIR_POR_EMPRESA';
  restriccionEntidad: string;
  restriccionClasificacion: string;
  requiereAuditoria: boolean;
  riesgo: 'BAJO' | 'MEDIO' | 'ALTO' | 'CRITICO';
  estadoAprobacion: EstadoAprobacionCapacidad;
}

/** Matriz informativa. No concede permisos ni modifica perfiles M4. */
export const MATRIZ_CAPACIDADES_DOCUMENTALES: readonly DefinicionCapacidadDocumental[] = [
  { accion:'CONSULTAR_METADATA', moduloPropietario:'M2', cuExistente:'CU360', necesitaCuNuevo:false, perfilPropuesto:'POR_DEFINIR_POR_EMPRESA', restriccionEntidad:'PRODUCTO_COMERCIAL', restriccionClasificacion:'COMERCIAL', requiereAuditoria:false, riesgo:'BAJO', estadoAprobacion:'APROBADO_EXISTENTE' },
  { accion:'CONSULTAR_VERSIONES', moduloPropietario:'M2', cuExistente:'CU367', necesitaCuNuevo:false, perfilPropuesto:'POR_DEFINIR_POR_EMPRESA', restriccionEntidad:'PRODUCTO_COMERCIAL_ASOCIADO', restriccionClasificacion:'COMERCIAL', requiereAuditoria:false, riesgo:'MEDIO', estadoAprobacion:'APROBADO_EXISTENTE' },
  { accion:'ASOCIAR_PRODUCTO', moduloPropietario:'M2', cuExistente:'CU366', necesitaCuNuevo:false, perfilPropuesto:'POR_DEFINIR_POR_EMPRESA', restriccionEntidad:'PRODUCTO_COMERCIAL', restriccionClasificacion:'COMERCIAL', requiereAuditoria:true, riesgo:'MEDIO', estadoAprobacion:'APROBADO_EXISTENTE' },
  ...(['CREAR_INTENCION','CONFIRMAR_CARGA','DESCARGAR','REEMPLAZAR','DEFINIR_IMAGEN_PRINCIPAL','ORDENAR_GALERIA','DEFINIR_USO_B2B_B2C','ARCHIVAR_DOCUMENTO','GESTIONAR_CUARENTENA','ADMINISTRAR_CONSERVACION'] as const).map((accion): DefinicionCapacidadDocumental => ({
    accion,
    moduloPropietario: accion === 'ADMINISTRAR_CONSERVACION' ? 'DOCUMENTAL' : 'M2',
    cuExistente: null,
    necesitaCuNuevo: true,
    perfilPropuesto: 'POR_DEFINIR_POR_EMPRESA',
    restriccionEntidad: accion === 'ADMINISTRAR_CONSERVACION' ? 'POLITICA_DOCUMENTAL' : 'PRODUCTO_COMERCIAL_ASOCIADO',
    restriccionClasificacion: 'POR_DEFINIR',
    requiereAuditoria: true,
    riesgo: ['DESCARGAR','REEMPLAZAR','ARCHIVAR_DOCUMENTO','GESTIONAR_CUARENTENA','ADMINISTRAR_CONSERVACION'].includes(accion) ? 'ALTO' : 'MEDIO',
    estadoAprobacion: 'PENDIENTE_APROBACION',
  })),
];
