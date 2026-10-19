export interface PermisoM4Visible {
  codigo:string;
  area:string;
  accion:string;
  descripcion:string;
  activo:boolean;
  requiereAdministrador:boolean;
}

export interface DependenciaM4 {permiso:string;requiere:string}

const sinAcentos=(valor:string)=>valor.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();

export const filtrarPermisosM4=(permisos:PermisoM4Visible[],busqueda:string)=>{
  const criterio=sinAcentos(busqueda.trim());
  if(!criterio)return permisos;
  return permisos.filter(p=>sinAcentos(`${p.accion} ${p.descripcion} ${p.area}`).includes(criterio));
};

export const agregarConDependencias=(seleccion:string[],codigo:string,dependencias:DependenciaM4[])=>{
  const resultado=new Set(seleccion);const agregados:string[]=[];
  const visitar=(actual:string)=>{if(resultado.has(actual))return;for(const d of dependencias.filter(x=>x.permiso===actual))visitar(d.requiere);resultado.add(actual);agregados.push(actual)};
  visitar(codigo);return{seleccion:[...resultado],agregados};
};

export const quitarConValidacion=(seleccion:string[],codigo:string,dependencias:DependenciaM4[])=>{
  const bloqueadoPor=seleccion.filter(actual=>dependencias.some(d=>d.permiso===actual&&d.requiere===codigo));
  return bloqueadoPor.length?{seleccion,bloqueadoPor}:{seleccion:seleccion.filter(v=>v!==codigo),bloqueadoPor:[]};
};

export const seleccionarGrupo=(seleccion:string[],codigos:string[],dependencias:DependenciaM4[])=>codigos.reduce((actual,codigo)=>agregarConDependencias(actual,codigo,dependencias).seleccion,seleccion);

export const quitarGrupo=(seleccion:string[],codigos:string[],dependencias:DependenciaM4[])=>{
  const resultado=new Set(seleccion.filter(c=>!codigos.includes(c)));
  let cambio=true;
  while(cambio){cambio=false;for(const codigo of [...resultado])if(dependencias.some(d=>d.permiso===codigo&&!resultado.has(d.requiere))){resultado.delete(codigo);cambio=true}}
  return [...resultado];
};

export const resumirCambios=(inicial:string[],final:string[])=>({agregados:final.filter(c=>!inicial.includes(c)),retirados:inicial.filter(c=>!final.includes(c))});
