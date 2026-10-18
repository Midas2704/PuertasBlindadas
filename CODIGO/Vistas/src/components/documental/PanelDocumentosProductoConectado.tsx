import { useEffect, useState } from 'react';
import { solicitarFinanzas } from '../../api/finanzas';
import PanelDocumentosProducto from './PanelDocumentosProducto';
import { capacidadesDocumentalesDeshabilitadas, type CapacidadesDocumentalesProducto, type DocumentoComercialProducto, type EstadoIntegracionDocumental, type ModoFichaDocumental } from './tipos';

type Respuesta = { estadoIntegracion:'VACIO'|'LISTO'; documentos:DocumentoComercialProducto[]; capacidades:CapacidadesDocumentalesProducto };

export default function PanelDocumentosProductoConectado({modo,productoId}:{modo:ModoFichaDocumental;productoId?:number|null}){
  const [estado,setEstado]=useState<EstadoIntegracionDocumental>(productoId?'CARGANDO':'NO_HABILITADA');
  const [documentos,setDocumentos]=useState<DocumentoComercialProducto[]>([]);
  const [capacidades,setCapacidades]=useState<CapacidadesDocumentalesProducto>(capacidadesDocumentalesDeshabilitadas);
  const [error,setError]=useState<string|null>(null);
  useEffect(()=>{
    if(!productoId){return;}
    const controlador=new AbortController();
    const temporizador=window.setTimeout(()=>{
      setEstado('CARGANDO');setError(null);
      solicitarFinanzas(`/mantenedores/productos/${productoId}/documentos`,{signal:controlador.signal}).then(async respuesta=>{const datos=await respuesta.json();if(!respuesta.ok){const fallo=new Error(datos.error||'No fue posible consultar la documentación');Object.assign(fallo,{estado:respuesta.status});throw fallo;}const salida=datos as Respuesta;setDocumentos(salida.documentos);setCapacidades(salida.capacidades);setEstado(salida.estadoIntegracion);}).catch(fallo=>{if(fallo.name==='AbortError')return;setDocumentos([]);setCapacidades(capacidadesDocumentalesDeshabilitadas);setError(fallo.message);setEstado(fallo.estado===401||fallo.estado===403?'DENEGADO':'ERROR');});
    },0);
    return()=>{window.clearTimeout(temporizador);controlador.abort();};
  },[productoId]);
  return <PanelDocumentosProducto modo={modo} productoId={productoId} estado={estado} documentos={documentos} capacidades={capacidades} error={error}/>;
}
