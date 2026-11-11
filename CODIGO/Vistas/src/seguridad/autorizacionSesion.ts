export interface SesionAutorizable {
  permisos:string[];
  administradorOriginal:boolean;
}

const permisoBloqueado=(codigo:string)=>codigo==='CU377';

export const tienePermiso=(sesion:SesionAutorizable|null|undefined,codigo:string)=>
  Boolean(sesion&&!permisoBloqueado(codigo)&&(sesion.administradorOriginal||sesion.permisos.includes(codigo)));

export const tieneAlgunPermiso=(sesion:SesionAutorizable|null|undefined,codigos:readonly string[])=>
  Boolean(sesion&&codigos.some(codigo=>!permisoBloqueado(codigo)&&(sesion.administradorOriginal||sesion.permisos.includes(codigo))));
