export type EstadoDemostracion = 'PENDIENTE' | 'EN_EJECUCION' | 'CORRECTO' | 'RECHAZADO' | 'ERROR' | 'ROLLBACK';
export type CapaDemostracion = 'INTERACCION' | 'VISTA_REACT' | 'CLIENTE_API' | 'RUTA_BACKEND' | 'SEGURIDAD_M4' | 'CONTROLADOR' | 'REGLAS_NEGOCIO' | 'PRISMA' | 'POSTGRESQL' | 'AUDITORIA_M9' | 'RESPUESTA' | 'ACTUALIZACION_VISTA';
export interface EventoDemostracion {
  id:string; secuencia:number; solicitudId:string; ocurridoEn:string; capa:CapaDemostracion; estado:EstadoDemostracion;
  modulo:string; operacion:string; titulo:string; detalle?:string; duracionMs?:number; metodo?:string; ruta?:string;
  vista?:string; controlador?:string; permiso?:string; codigo?:string; resultado?:string;
}

export const CAPAS: Array<{id:CapaDemostracion; etiqueta:string}> = [
  {id:'INTERACCION',etiqueta:'Interacción'}, {id:'VISTA_REACT',etiqueta:'Vista React'}, {id:'CLIENTE_API',etiqueta:'Cliente API'},
  {id:'RUTA_BACKEND',etiqueta:'Ruta backend'}, {id:'SEGURIDAD_M4',etiqueta:'Seguridad M4'}, {id:'CONTROLADOR',etiqueta:'Controlador'},
  {id:'REGLAS_NEGOCIO',etiqueta:'Reglas de negocio'}, {id:'PRISMA',etiqueta:'Prisma'}, {id:'POSTGRESQL',etiqueta:'PostgreSQL'},
  {id:'AUDITORIA_M9',etiqueta:'Auditoría M9'}, {id:'RESPUESTA',etiqueta:'Respuesta'}, {id:'ACTUALIZACION_VISTA',etiqueta:'Actualización vista'},
];

export const claseEstado = (estado: EstadoDemostracion) => ({
  PENDIENTE:'border-gray-300 bg-gray-100 text-[#676767]', EN_EJECUCION:'border-[#FE8F01] bg-orange-100 text-orange-950 shadow-[0_0_0_3px_rgba(254,143,1,.18)]',
  CORRECTO:'border-emerald-500 bg-emerald-50 text-emerald-900', RECHAZADO:'border-red-500 bg-red-50 text-red-900',
  ERROR:'border-red-600 bg-red-100 text-red-950', ROLLBACK:'border-red-700 bg-red-50 text-red-950',
}[estado]);
