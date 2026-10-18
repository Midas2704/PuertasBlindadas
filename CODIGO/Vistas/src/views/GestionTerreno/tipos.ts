export type UsuarioTerreno={id:string;acceso:string|null;nombre:string};
export type ObraTerreno={id:string;nombre:string|null;referencia:string|null;direccion:string|null;comuna:string|null;region:string|null;cliente:{rut:string;nombre:string|null}|null;especificacion:{id:string;modelo:string|null;zona:string|null;observaciones:string|null}|null};
export type VisitaTerreno={
  id:string;
  tipoServicio:string|null;
  fecha:string|null;
  bloqueHorario:string|null;
  prioridad:string|null;
  estado:string|null;
  observaciones:string|null;
  responsable:UsuarioTerreno|null;
  obra:ObraTerreno|null;
  resultadoRegistrado?:{id:string;resultado:string|null;observaciones:string|null}|null;
  ordenesRelacionadas?:Array<{id:string;estado:string|null}>;
};

export type InstalacionTerreno={
  id:string;idVisita:string;idOrdenTrabajo:string;
  puerta:{idUnidad:string;numeroUnidad:number;producto:string;codigo:string;familia:string}|null;
  cliente:{rut:string;nombre:string|null}|null;obra:ObraTerreno|null;visita:VisitaTerreno;
  fabricacion:{estado:string|null;finalizada:boolean};
  preparacion:{checklist:{id:string;item:string|null;marcado:boolean|null;noMarcado:boolean|null;detalleMarcado:string|null;detalleNoMarcado:string|null}|null;direccionDisponible:boolean;responsableAsignado:boolean;visitaProgramada:boolean};
  tareas:Array<{id:string;titulo:string|null;estado:string|null}>;
  incidencias:Array<{id:string;descripcion:string;estado:string;estadoRevision:string;categoria:string|null;areaSenalada:string|null;evidencias:number}>;
  resultado:{id:string;resultado:string|null;observaciones:string|null;clasificacion:string}|null;
  clasificacion:'PENDIENTE'|'RESULTADO_REGISTRADO'|'INSTALACION_COMPLETADA'|'PARCIALMENTE_REALIZADA'|'VISITA_NO_EJECUTADA'|'REPROGRAMACION_NECESARIA';
  entrega:{estado:'NO_REGISTRADA';detalle:string};
};

export const fechaVisita=(valor:string|null)=>valor?.slice(0,10)||null;
export const horaVisita=(valor:string|null)=>valor?.match(/T(\d{2}:\d{2})/)?.[1]||valor?.slice(0,5)||null;
export const etiquetaEstado=(valor:string|null)=>(valor||'Sin estado').replaceAll('_',' ').toLocaleLowerCase('es-CL');
