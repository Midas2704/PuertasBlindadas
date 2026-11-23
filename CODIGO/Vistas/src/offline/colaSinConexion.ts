const BASE='puertas-blindadas-sin-conexion';
const VERSION=1;
const ALMACEN='solicitudes';
export const EVENTO_COLA='puertas-blindadas:cola-actualizada';

export type SolicitudPendiente={
  id:string;
  url:string;
  metodo:string;
  cabeceras:Array<[string,string]>;
  cuerpo:Blob|null;
  creadaEn:string;
  estado:'pendiente'|'error';
  error?:string;
};

let basePromesa:Promise<IDBDatabase>|null=null;
let instalada=false;
let sincronizando:Promise<void>|null=null;
let fetchNativo:typeof window.fetch|null=null;

const abrirBase=()=>{
  if(basePromesa)return basePromesa;
  basePromesa=new Promise((resolver,rechazar)=>{
    const solicitud=indexedDB.open(BASE,VERSION);
    solicitud.onupgradeneeded=()=>{if(!solicitud.result.objectStoreNames.contains(ALMACEN))solicitud.result.createObjectStore(ALMACEN,{keyPath:'id'});};
    solicitud.onsuccess=()=>resolver(solicitud.result);
    solicitud.onerror=()=>rechazar(solicitud.error??new Error('No fue posible abrir el almacenamiento local'));
  });
  return basePromesa;
};

const completar=<T>(solicitud:IDBRequest<T>)=>new Promise<T>((resolver,rechazar)=>{
  solicitud.onsuccess=()=>resolver(solicitud.result);
  solicitud.onerror=()=>rechazar(solicitud.error??new Error('No fue posible completar la operación local'));
});

const guardar=async(item:SolicitudPendiente)=>completar((await abrirBase()).transaction(ALMACEN,'readwrite').objectStore(ALMACEN).put(item));
const eliminar=async(id:string)=>completar((await abrirBase()).transaction(ALMACEN,'readwrite').objectStore(ALMACEN).delete(id));
export const listarSolicitudesPendientes=async()=>completar((await abrirBase()).transaction(ALMACEN,'readonly').objectStore(ALMACEN).getAll()) as Promise<SolicitudPendiente[]>;

const anunciar=()=>window.dispatchEvent(new Event(EVENTO_COLA));
const metodoDe=(solicitud:Request)=>solicitud.method.toUpperCase();
const esEscritura=(metodo:string)=>['POST','PUT','PATCH','DELETE'].includes(metodo);
const esFinanzas=(url:string)=>{const destino=new URL(url,window.location.origin);return destino.origin===window.location.origin&&destino.pathname.startsWith('/api/finanzas/')&&!destino.pathname.startsWith('/api/finanzas/seguridad/');};
const respuestaEnCola=(id:string)=>new Response(JSON.stringify({pendienteSincronizacion:true,idCola:id,mensaje:'Guardado en este teléfono. Se enviará cuando vuelva la conexión.'}),{status:202,headers:{'Content-Type':'application/json','X-Offline-Queued':'true'}});

const encolar=async(solicitud:Request)=>{
  const id=crypto.randomUUID();
  const item:SolicitudPendiente={id,url:solicitud.url,metodo:metodoDe(solicitud),cabeceras:[...solicitud.headers.entries()],cuerpo:['GET','HEAD'].includes(metodoDe(solicitud))?null:await solicitud.clone().blob(),creadaEn:new Date().toISOString(),estado:'pendiente'};
  await guardar(item);anunciar();return respuestaEnCola(id);
};

export const obtenerEstadoCola=async()=>{
  const items=await listarSolicitudesPendientes();
  return {pendientes:items.filter(x=>x.estado==='pendiente').length,errores:items.filter(x=>x.estado==='error').length};
};

export const sincronizarSolicitudes=async()=>{
  if(sincronizando)return sincronizando;
  sincronizando=(async()=>{
    if(!navigator.onLine||!fetchNativo)return;
    const items=(await listarSolicitudesPendientes()).filter(x=>x.estado==='pendiente').sort((a,b)=>a.creadaEn.localeCompare(b.creadaEn));
    for(const item of items){
      try{
        const respuesta=await fetchNativo(item.url,{method:item.metodo,headers:new Headers(item.cabeceras),body:item.cuerpo,credentials:'same-origin'});
        if(respuesta.ok){await eliminar(item.id);anunciar();continue;}
        if(respuesta.status===401||respuesta.status>=500)break;
        await guardar({...item,estado:'error',error:`El servidor rechazó la operación (${respuesta.status}).`});anunciar();
      }catch{break;}
    }
  })().finally(()=>{sincronizando=null;});
  return sincronizando;
};

export const instalarColaSinConexion=()=>{
  if(instalada||typeof window==='undefined'||typeof indexedDB==='undefined')return;
  instalada=true;fetchNativo=window.fetch.bind(window);
  window.fetch=(async(input:RequestInfo|URL,init?:RequestInit)=>{
    const solicitud=new Request(input,init);
    if(!esEscritura(metodoDe(solicitud))||!esFinanzas(solicitud.url))return fetchNativo!(solicitud);
    if(!navigator.onLine)return encolar(solicitud);
    try{return await fetchNativo!(solicitud);}catch(error){
      try{return await encolar(solicitud);}catch{throw error;}
    }
  }) as typeof window.fetch;
  window.addEventListener('online',()=>{anunciar();void sincronizarSolicitudes();});
  window.addEventListener('offline',anunciar);
  window.setTimeout(()=>void sincronizarSolicitudes(),1000);
};
