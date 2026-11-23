const VERSION='puertas-blindadas-v1';
const APP_SHELL=['/','/index.html','/manifest.webmanifest','/favicon.svg'];

self.addEventListener('install',evento=>evento.waitUntil(caches.open(VERSION).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',evento=>evento.waitUntil(caches.keys().then(claves=>Promise.all(claves.filter(clave=>clave!==VERSION).map(clave=>caches.delete(clave)))).then(()=>self.clients.claim())));

self.addEventListener('fetch',evento=>{
  const solicitud=evento.request;
  if(solicitud.method!=='GET')return;
  const url=new URL(solicitud.url);
  if(url.origin!==self.location.origin)return;
  if(url.pathname.startsWith('/api/finanzas/')){
    evento.respondWith(fetch(solicitud).then(respuesta=>{if(respuesta.ok)caches.open(VERSION).then(cache=>cache.put(solicitud,respuesta.clone()));return respuesta;}).catch(async()=>await caches.match(solicitud)??new Response(JSON.stringify({error:'Sin conexión y sin una copia local disponible'}),{status:503,headers:{'Content-Type':'application/json'}})));
    return;
  }
  if(solicitud.mode==='navigate'){
    evento.respondWith(fetch(solicitud).then(respuesta=>{if(respuesta.ok)caches.open(VERSION).then(cache=>cache.put('/index.html',respuesta.clone()));return respuesta;}).catch(()=>caches.match('/index.html')));
    return;
  }
  evento.respondWith(caches.match(solicitud).then(copia=>copia??fetch(solicitud).then(respuesta=>{if(respuesta.ok)caches.open(VERSION).then(cache=>cache.put(solicitud,respuesta.clone()));return respuesta;})));
});
