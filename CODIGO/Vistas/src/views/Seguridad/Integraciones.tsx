import { useEffect, useState } from 'react';
import { Landmark, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { solicitarFinanzas } from '../../api/finanzas';
import { operar } from '../../seguridad/Sesion';

type Estado = {
  bancoCentral: {tokenConfigurado:boolean;endpoint:string;serie:string;actualizadoEn:string|null};
  correo: {configurado:boolean;host:string;port:number;secure:boolean;user:string;from:string;baseUrl:string;passwordConfigurada:boolean;actualizadoEn:string|null};
};

const campo='mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200';
const boton='rounded-lg bg-[#FE8F01] px-4 py-2.5 font-bold text-black disabled:opacity-50';

export default function Integraciones() {
  const [estado,setEstado]=useState<Estado|null>(null);
  const [banco,setBanco]=useState({token:''});
  const [correo,setCorreo]=useState({host:'',port:'587',secure:false,user:'',password:'',from:'',baseUrl:'https://puertasblindadas.midas2704.com'});
  const [mensaje,setMensaje]=useState<{texto:string;error:boolean}|null>(null);
  const [ocupado,setOcupado]=useState('');

  const cargar=async()=>{const respuesta=await solicitarFinanzas('/administracion/integraciones');const datos=await respuesta.json();if(!respuesta.ok)throw new Error(datos.error);setEstado(datos);setCorreo({host:datos.correo.host||'',port:String(datos.correo.port||587),secure:Boolean(datos.correo.secure),user:datos.correo.user||'',password:'',from:datos.correo.from||'',baseUrl:datos.correo.baseUrl||'https://puertasblindadas.midas2704.com'});};
  useEffect(()=>{void cargar().catch(error=>setMensaje({texto:error.message,error:true}))},[]);
  const ejecutar=async(nombre:string,accion:()=>Promise<unknown>)=>{setOcupado(nombre);setMensaje(null);try{const resultado=await accion() as {mensaje?:string};await cargar();setMensaje({texto:resultado.mensaje||'Configuración guardada correctamente',error:false})}catch(error){setMensaje({texto:(error as Error).message,error:true})}finally{setOcupado('')}};

  return <div className="mx-auto max-w-5xl p-4 sm:p-8">
    <header className="mb-6"><p className="text-sm font-bold uppercase tracking-wide text-orange-700">Administración</p><h1 className="mt-1 text-3xl font-black">Conexiones externas</h1><p className="mt-2 text-gray-600">Ingresa los datos de las cuentas creadas para el programa. Las contraseñas y tokens guardados no se vuelven a mostrar.</p></header>
    {mensaje&&<div role="status" className={`mb-5 flex gap-3 rounded-lg border p-4 ${mensaje.error?'border-red-200 bg-red-50 text-red-800':'border-green-200 bg-green-50 text-green-800'}`}>{mensaje.error?<AlertCircle/>:<CheckCircle2/>}<span>{mensaje.texto}</span></div>}
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3"><div className="flex gap-3"><span className="rounded-lg bg-orange-50 p-2 text-orange-700"><Landmark/></span><div><h2 className="text-xl font-bold">Banco Central</h2><p className="text-sm text-gray-500">Dólar observado oficial</p></div></div><Estado configurado={Boolean(estado?.bancoCentral.tokenConfigurado)}/></div>
        <p className="mt-4 text-sm leading-6 text-gray-600">Crea una cuenta gratuita en la Base de Datos Estadísticos, habilita la API y copia el token desde “Mi Cuenta”.</p>
        <a className="mt-2 inline-block text-sm font-bold text-orange-700 underline" href="https://si3.bcentral.cl/estadisticas/Principal1/Web_Services/acceso_api.html" target="_blank" rel="noreferrer">Abrir instrucciones del Banco Central</a>
        <form className="mt-5 space-y-4" onSubmit={e=>{e.preventDefault();void ejecutar('banco-guardar',()=>operar('/administracion/integraciones/banco-central',banco))}}>
          <label className="block text-sm font-medium">Token API<input className={campo} type="password" autoComplete="new-password" value={banco.token} onChange={e=>setBanco({token:e.target.value})} placeholder={estado?.bancoCentral.tokenConfigurado?'Token guardado; escribe sólo para reemplazarlo':'Pega aquí el token de la cuenta BDE'}/></label>
          <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600"><strong>Serie utilizada:</strong> {estado?.bancoCentral.serie||'F073.TCO.PRE.Z.D'} · dólar observado diario.</div>
          <div className="flex flex-wrap gap-2"><button className={boton} disabled={Boolean(ocupado)}>{ocupado==='banco-guardar'?'Guardando…':'Guardar token'}</button><button type="button" className="rounded-lg border px-4 py-2.5 font-semibold" disabled={Boolean(ocupado)||!estado?.bancoCentral.tokenConfigurado} onClick={()=>void ejecutar('banco-probar',()=>operar('/administracion/integraciones/banco-central/probar',{}))}>{ocupado==='banco-probar'?'Probando…':'Probar conexión'}</button></div>
        </form>
      </section>

      <section className="rounded-xl border bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3"><div className="flex gap-3"><span className="rounded-lg bg-orange-50 p-2 text-orange-700"><Mail/></span><div><h2 className="text-xl font-bold">Correo del programa</h2><p className="text-sm text-gray-500">Recuperación de contraseñas</p></div></div><Estado configurado={Boolean(estado?.correo.configurado)}/></div>
        <p className="mt-4 text-sm leading-6 text-gray-600">Usa la cuenta de correo creada para Puertas Blindadas. Estos datos permiten enviar el enlace “Olvidé mi contraseña”.</p>
        <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={e=>{e.preventDefault();void ejecutar('correo-guardar',()=>operar('/administracion/integraciones/correo',{...correo,port:Number(correo.port)}))}}>
          <label className="block text-sm font-medium sm:col-span-2">Servidor de correo (SMTP)<input className={campo} value={correo.host} onChange={e=>setCorreo({...correo,host:e.target.value})} placeholder="smtp.gmail.com" required/></label>
          <label className="block text-sm font-medium">Puerto<input className={campo} type="number" min="1" max="65535" value={correo.port} onChange={e=>setCorreo({...correo,port:e.target.value})} required/></label>
          <label className="flex items-end gap-2 pb-2 text-sm font-medium"><input type="checkbox" checked={correo.secure} onChange={e=>setCorreo({...correo,secure:e.target.checked})}/> Conexión SSL directa (normalmente puerto 465)</label>
          <label className="block text-sm font-medium sm:col-span-2">Usuario o correo de acceso<input className={campo} type="email" value={correo.user} onChange={e=>setCorreo({...correo,user:e.target.value})} placeholder="sistema@empresa.cl" required/></label>
          <label className="block text-sm font-medium sm:col-span-2">Contraseña de la cuenta<input className={campo} type="password" autoComplete="new-password" value={correo.password} onChange={e=>setCorreo({...correo,password:e.target.value})} placeholder={estado?.correo.passwordConfigurada?'Contraseña guardada; escribe sólo para reemplazarla':'Contraseña o clave de aplicación'}/></label>
          <label className="block text-sm font-medium sm:col-span-2">Remitente<input className={campo} value={correo.from} onChange={e=>setCorreo({...correo,from:e.target.value})} placeholder="Puertas Blindadas <sistema@empresa.cl>" required/></label>
          <label className="block text-sm font-medium sm:col-span-2">Dirección pública del sistema<input className={campo} type="url" value={correo.baseUrl} onChange={e=>setCorreo({...correo,baseUrl:e.target.value})} required/></label>
          <div className="flex flex-wrap gap-2 sm:col-span-2"><button className={boton} disabled={Boolean(ocupado)}>{ocupado==='correo-guardar'?'Guardando…':'Guardar correo'}</button><button type="button" className="rounded-lg border px-4 py-2.5 font-semibold" disabled={Boolean(ocupado)||!estado?.correo.configurado} onClick={()=>void ejecutar('correo-probar',()=>operar('/administracion/integraciones/correo/probar',{}))}>{ocupado==='correo-probar'?'Probando…':'Probar conexión'}</button></div>
        </form>
      </section>
    </div>
  </div>;
}

function Estado({configurado}:{configurado:boolean}) { return <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${configurado?'bg-green-100 text-green-800':'bg-amber-100 text-amber-900'}`}>{configurado?'Configurado':'Falta configurar'}</span> }
