export interface SesionAutorizable {
  permisos:string[];
  administradorOriginal:boolean;
}

export const tienePermiso=(sesion:SesionAutorizable|null|undefined,codigo:string)=>
  Boolean(sesion&&(sesion.administradorOriginal||sesion.permisos.includes(codigo)));

export const tieneAlgunPermiso=(sesion:SesionAutorizable|null|undefined,codigos:readonly string[])=>
  Boolean(sesion&&(sesion.administradorOriginal||codigos.some(codigo=>sesion.permisos.includes(codigo))));
