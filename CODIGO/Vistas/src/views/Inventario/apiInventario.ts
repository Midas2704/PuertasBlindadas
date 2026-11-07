import { solicitarFinanzas } from '../../api/finanzas';

export async function consultarInventario<T>(ruta:string):Promise<T>{
  const respuesta=await solicitarFinanzas(`/inventario${ruta}`);
  const datos=await respuesta.json();
  if(!respuesta.ok)throw new Error(datos.error||'No fue posible consultar Inventario');
  return datos as T;
}

export async function operarInventario<T>(ruta:string,cuerpo:unknown):Promise<T>{
  const respuesta=await solicitarFinanzas(`/inventario${ruta}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(cuerpo)});
  const datos=await respuesta.json().catch(()=>({}));
  if(!respuesta.ok){
    const error=Object.assign(new Error(datos.error||'No fue posible completar la operación'),{codigo:datos.codigo,estado:respuesta.status});
    throw error;
  }
  return datos as T;
}
