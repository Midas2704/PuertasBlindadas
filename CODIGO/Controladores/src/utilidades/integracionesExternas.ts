import nodemailer from 'nodemailer';
import { Prisma } from '@prisma/client';
import { prisma } from '../db';
import { ErrorAplicacion } from './ErrorAplicacion';

const CLAVE_BANCO = 'BANCO_CENTRAL';
const CLAVE_CORREO = 'CORREO_RECUPERACION';
export const ENDPOINT_BANCO_CENTRAL = 'https://si3.bcentral.cl/SieteRestWS/SieteRestWS.ashx';
export const SERIE_DOLAR_OBSERVADO = 'F073.TCO.PRE.Z.D';

type Json = Record<string, unknown>;
export type ConfiguracionBancoCentral = { token: string; endpoint: string; serie: string };
export type ConfiguracionCorreo = { host: string; port: number; secure: boolean; user: string; password: string; from: string; baseUrl: string };

const objeto = (valor: Prisma.JsonValue | null | undefined): Json => valor && typeof valor === 'object' && !Array.isArray(valor) ? valor as Json : {};
const cadena = (valor: unknown) => typeof valor === 'string' ? valor.trim() : '';
const booleano = (valor: unknown, defecto = false) => typeof valor === 'boolean' ? valor : valor === 'true' ? true : valor === 'false' ? false : defecto;
const puerto = (valor: unknown) => { const numero = Number(valor); return Number.isInteger(numero) && numero > 0 && numero <= 65535 ? numero : 587; };

async function registro(clave: string) {
  return prisma.configuracion_integracion_externa.findUnique({ where: { clave } });
}

export async function configuracionBancoCentral(): Promise<ConfiguracionBancoCentral> {
  const guardada = objeto((await registro(CLAVE_BANCO))?.configuracion);
  return {
    token: cadena(guardada.token) || cadena(process.env.BANCO_CENTRAL_API_TOKEN),
    endpoint: cadena(guardada.endpoint) || cadena(process.env.BANCO_CENTRAL_API_URL) || ENDPOINT_BANCO_CENTRAL,
    serie: cadena(guardada.serie) || cadena(process.env.BANCO_CENTRAL_SERIE_USD) || SERIE_DOLAR_OBSERVADO,
  };
}

export async function configuracionCorreo(): Promise<ConfiguracionCorreo> {
  const guardada = objeto((await registro(CLAVE_CORREO))?.configuracion);
  const host = cadena(guardada.host) || cadena(process.env.SMTP_HOST);
  const port = puerto(guardada.port ?? process.env.SMTP_PORT);
  return {
    host,
    port,
    secure: booleano(guardada.secure ?? process.env.SMTP_SECURE, port === 465),
    user: cadena(guardada.user) || cadena(process.env.SMTP_USER),
    password: cadena(guardada.password) || cadena(process.env.SMTP_PASSWORD),
    from: cadena(guardada.from) || cadena(process.env.SMTP_FROM) || cadena(guardada.user) || cadena(process.env.SMTP_USER),
    baseUrl: (cadena(guardada.baseUrl) || cadena(process.env.M4_URL_VISTA) || 'http://127.0.0.1:5174').replace(/\/$/, ''),
  };
}

const transporteCorreo = (config: ConfiguracionCorreo) => {
  if (!config.host || !config.user || !config.password || !config.from) throw new ErrorAplicacion(503, 'Completa los datos de la cuenta de correo del programa en Administración');
  return nodemailer.createTransport({ host: config.host, port: config.port, secure: config.secure, auth: { user: config.user, pass: config.password } });
};

export class ServicioIntegracionesExternas {
  async consultar() {
    const [banco, correo, registroBanco, registroCorreo] = await Promise.all([configuracionBancoCentral(), configuracionCorreo(), registro(CLAVE_BANCO), registro(CLAVE_CORREO)]);
    return {
      bancoCentral: { tokenConfigurado: Boolean(banco.token), endpoint: banco.endpoint, serie: banco.serie, actualizadoEn: registroBanco?.actualizado_en || null },
      correo: { configurado: Boolean(correo.host && correo.user && correo.password && correo.from), host: correo.host, port: correo.port, secure: correo.secure, user: correo.user, from: correo.from, baseUrl: correo.baseUrl, passwordConfigurada: Boolean(correo.password), actualizadoEn: registroCorreo?.actualizado_en || null },
    };
  }

  async guardarBancoCentral(entrada: Json, actorId: bigint) {
    const actual = await configuracionBancoCentral();
    const token = cadena(entrada.token) || actual.token;
    if (!token) throw new ErrorAplicacion(400, 'Ingresa el token API de la cuenta BDE del Banco Central');
    const configuracion = { token, endpoint: ENDPOINT_BANCO_CENTRAL, serie: SERIE_DOLAR_OBSERVADO };
    await prisma.configuracion_integracion_externa.upsert({ where: { clave: CLAVE_BANCO }, create: { clave: CLAVE_BANCO, configuracion, actualizado_por: actorId }, update: { configuracion, actualizado_por: actorId, actualizado_en: new Date() } });
    return this.consultar();
  }

  async guardarCorreo(entrada: Json, actorId: bigint) {
    const actual = await configuracionCorreo();
    const configuracion = { host: cadena(entrada.host), port: puerto(entrada.port), secure: booleano(entrada.secure), user: cadena(entrada.user), password: cadena(entrada.password) || actual.password, from: cadena(entrada.from), baseUrl: cadena(entrada.baseUrl).replace(/\/$/, '') };
    if (!configuracion.host || !configuracion.user || !configuracion.password || !configuracion.from || !configuracion.baseUrl) throw new ErrorAplicacion(400, 'Completa servidor, usuario, contraseña, remitente y dirección pública del sistema');
    await prisma.configuracion_integracion_externa.upsert({ where: { clave: CLAVE_CORREO }, create: { clave: CLAVE_CORREO, configuracion, actualizado_por: actorId }, update: { configuracion, actualizado_por: actorId, actualizado_en: new Date() } });
    return this.consultar();
  }

  async probarCorreo() {
    const config = await configuracionCorreo();
    await transporteCorreo(config).verify();
    return { mensaje: 'Conexión con la cuenta de correo verificada correctamente' };
  }

  async enviarRecuperacion(destinatario: string, enlace: string) {
    const config = await configuracionCorreo();
    await transporteCorreo(config).sendMail({ from: config.from, to: destinatario, subject: 'Recuperación de contraseña — Puertas Blindadas', text: `Abre este enlace para crear una nueva contraseña:\n\n${enlace}\n\nSi no solicitaste el cambio, ignora este mensaje.`, html: `<p>Abre el siguiente enlace para crear una nueva contraseña:</p><p><a href="${enlace}">Recuperar contraseña</a></p><p>Si no solicitaste el cambio, ignora este mensaje.</p>` });
  }

  async enlaceRecuperacion(token: string) {
    const config = await configuracionCorreo();
    return `${config.baseUrl}/recuperar#${encodeURIComponent(token)}`;
  }
}
