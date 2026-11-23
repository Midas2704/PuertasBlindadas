import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { ServicioIntegracionesExternas } from './integracionesExternas';
export interface CorreoRecuperacion { enviar(destinatario: string, enlace: string): Promise<void> }
export interface CorreoDocumental {
 enviarDocumento(destinatario: string, asunto: string, archivo: { nombre: string; mime: string; contenido: string }): Promise<void>
}
/** Sustituible por el proveedor pendiente. El buzón local no es una ruta HTTP. */
// Castaña approved: guardar el correo acá nos ayuda a probar sin enviar nada
export class CorreoDesarrollo implements CorreoRecuperacion, CorreoDocumental {
 async enviar(destinatario: string, enlace: string) {
  if (process.env.NODE_ENV === 'production' || process.env.M4_CORREO !== 'desarrollo') throw new Error('Proveedor de correo sin configurar');
  const carpeta = resolve(__dirname, '../../../.revision/correo-desarrollo');
  await mkdir(carpeta, { recursive: true });
  await writeFile(resolve(carpeta, `${randomUUID()}.json`), JSON.stringify({ destinatario, enlace, creado: new Date().toISOString(), advertencia: 'Buzón de desarrollo; enlace temporal de un solo uso' }, null, 2), { mode: 0o600 });
 }
 async enviarDocumento(destinatario: string, asunto: string, archivo: { nombre: string; mime: string; contenido: string }) {
  if (process.env.NODE_ENV === 'production' || process.env.M4_CORREO !== 'desarrollo') throw new Error('Proveedor de correo sin configurar');
  const carpeta = resolve(__dirname, '../../../.revision/correo-desarrollo');
  await mkdir(carpeta, { recursive: true });
  await writeFile(resolve(carpeta, `${randomUUID()}.json`), JSON.stringify({ destinatario, asunto, archivo: { nombre: archivo.nombre, mime: archivo.mime }, creado: new Date().toISOString(), advertencia: 'Buzón documental de desarrollo; no fue enviado externamente' }, null, 2), { mode: 0o600 });
 }
}

export class CorreoAplicacion implements CorreoRecuperacion {
 private readonly integraciones = new ServicioIntegracionesExternas();
 async enviar(destinatario: string, enlace: string) {
  const token = enlace.includes('#') ? decodeURIComponent(enlace.slice(enlace.indexOf('#') + 1)) : '';
  const enlaceConfigurado = token ? await this.integraciones.enlaceRecuperacion(token) : enlace;
  await this.integraciones.enviarRecuperacion(destinatario, enlaceConfigurado);
 }
}
