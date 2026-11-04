import { solicitarFinanzas } from '../../api/finanzas';

export async function consultarInventario<T>(ruta:string):Promise<T>{
  const respuesta=await solicitarFinanzas(`/inventario${ruta}`);
  const datos=await respuesta.json();
  if(!respuesta.ok)throw new Error(datos.error||'No fue posible consultar Inventario');
  return datos as T;
}
