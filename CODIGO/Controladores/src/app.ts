import express, { ErrorRequestHandler } from 'express';
import cors from 'cors';
import { C_Finanzas } from './controladores/C_Finanzas';
import { crearRutasFinanzas } from './rutas/finanzas';
import { ErrorAplicacion } from './utilidades/ErrorAplicacion';
import { contextoDemostracion, crearRutasDemostracion } from './demostracion/ServicioDemostracion';

export function crearAplicacion(fachada = new C_Finanzas()) {
  const aplicacion = express();
  aplicacion.disable('x-powered-by');
  aplicacion.set('json replacer', (_clave: string, valor: unknown) => typeof valor === 'bigint' ? valor.toString() : valor);
  aplicacion.use(cors({ origin: /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/ }));
  // Un archivo de 5 MB crece cerca de un 33 % al viajar codificado en base64.
  aplicacion.use(express.json({ limit: '8mb' }));
  aplicacion.use(contextoDemostracion.middleware());
  // Cookies HttpOnly/SameSite y origen estricto para operaciones de escritura.
  // importante: acá termina la magia y empieza el contrato HTTP
  aplicacion.use((solicitud,respuesta,siguiente)=>{
    const origen=solicitud.get('origin');
    const permitidos=(process.env.M4_ORIGENES || 'http://127.0.0.1:5174,http://localhost:5174').split(',');
    if(!['GET','HEAD','OPTIONS'].includes(solicitud.method) && origen && !permitidos.includes(origen)) { respuesta.status(403).json({error:'Origen no permitido'}); return; }
    if(!['GET','HEAD','OPTIONS'].includes(solicitud.method) && solicitud.get('sec-fetch-site')==='cross-site') { respuesta.status(403).json({error:'Solicitud externa no permitida'}); return; }
    siguiente();
  });
  aplicacion.use('/api/finanzas' , crearRutasFinanzas(fachada));
  aplicacion.use('/api/demostracion', crearRutasDemostracion());
  aplicacion.use((_solicitud, respuesta) => { respuesta.status(404).json({ error: 'Ruta no encontrada' }); });
  const manejarError: ErrorRequestHandler = (error, _solicitud, respuesta, _siguiente) => {
    if (error instanceof ErrorAplicacion) { respuesta.status(error.estado).json({ error: error.message, codigo: error.codigo }); return; }
    if (error?.type === 'entity.parse.failed') { respuesta.status(400).json({ error: 'JSON inválido' }); return; }
    if (error?.type === 'entity.too.large') { respuesta.status(413).json({ error: 'El archivo supera el tamaño permitido' }); return; }
    if (error?.code === 'P2002') { respuesta.status(409).json({ error: 'El registro ya existe', codigo: 'REGISTRO_DUPLICADO' }); return; }
    console.error('Error interno de Finanzas:', error instanceof Error ? `${error.name}: ${error.message}` : error);
    respuesta.status(500).json({ error: 'No fue posible completar la operación', codigo: 'ERROR_INTERNO' });
  };
  aplicacion.use(manejarError);
  return aplicacion;
}
