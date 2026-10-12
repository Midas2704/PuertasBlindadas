import type { ProveedorDocumental } from '../tipos';

export interface ConfiguracionStorage {
  proveedor: ProveedorDocumental;
  bucket: string;
  region: string;
  endpoint?: string;
  forcePathStyle: boolean;
  credenciales?: { accessKeyId: string; secretAccessKey: string };
  expiracionFirmaSegundos: number;
  timeoutMs: number;
  maxIntentos: number;
  s3VersionadoHabilitado: boolean;
  s3ObjectLockHabilitado: boolean;
  s3KmsHabilitado: boolean;
}

export class ErrorConfiguracionStorage extends Error {
  readonly codigo = 'CONFIGURACION_STORAGE_INVALIDA';
  constructor(mensaje: string) {
    super(mensaje);
    this.name = 'ErrorConfiguracionStorage';
  }
}

const BUCKET = /^(?!\d{1,3}(?:\.\d{1,3}){3}$)(?!.*\.\.)(?!.*[.-]$)[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/;
const REGION = /^(auto|[a-z]{2}(?:-gov)?-[a-z]+-\d)$/;
const HOST_R2 = /^[a-f0-9]{32}\.r2\.cloudflarestorage\.com$/;

const requerido = (entorno: NodeJS.ProcessEnv, nombre: string) => {
  const valor = entorno[nombre]?.trim();
  if (!valor) throw new ErrorConfiguracionStorage(`Falta la variable obligatoria ${nombre}`);
  return valor;
};

const entero = (entorno: NodeJS.ProcessEnv, nombre: string, defecto: number, minimo: number, maximo: number) => {
  const texto = entorno[nombre]?.trim();
  if (!texto) return defecto;
  const valor = Number(texto);
  if (!Number.isInteger(valor) || valor < minimo || valor > maximo) {
    throw new ErrorConfiguracionStorage(`${nombre} debe ser un entero entre ${minimo} y ${maximo}`);
  }
  return valor;
};

const bandera = (valor: string | undefined) => /^(1|true|si)$/i.test(valor?.trim() || '');

const validarEndpoint = (proveedor: ProveedorDocumental, valor: string | undefined, permitirLocal: boolean) => {
  if (!valor?.trim()) {
    if (proveedor === 'R2') throw new ErrorConfiguracionStorage('STORAGE_ENDPOINT es obligatorio para R2');
    return undefined;
  }
  let url: URL;
  try { url = new URL(valor.trim()); } catch { throw new ErrorConfiguracionStorage('STORAGE_ENDPOINT no es una URL válida'); }
  if (url.username || url.password || url.search || url.hash || (url.pathname && url.pathname !== '/')) {
    throw new ErrorConfiguracionStorage('STORAGE_ENDPOINT no puede contener credenciales, parámetros ni rutas');
  }
  const local = ['localhost', '127.0.0.1', '::1'].includes(url.hostname);
  if (local) {
    if (!permitirLocal || url.protocol !== 'http:') throw new ErrorConfiguracionStorage('El endpoint local HTTP requiere STORAGE_ALLOW_LOCAL_ENDPOINT=true');
  } else if (url.protocol !== 'https:') {
    throw new ErrorConfiguracionStorage('STORAGE_ENDPOINT debe utilizar HTTPS');
  }
  if (proveedor === 'R2' && !local && !HOST_R2.test(url.hostname)) {
    throw new ErrorConfiguracionStorage('El endpoint R2 no pertenece al dominio oficial permitido');
  }
  if (proveedor === 'S3' && !local && !(/\.amazonaws\.com(?:\.cn)?$/.test(url.hostname))) {
    throw new ErrorConfiguracionStorage('El endpoint S3 no pertenece a un dominio oficial permitido');
  }
  return url.origin;
};

export const cargarConfiguracionStorage = (entorno: NodeJS.ProcessEnv = process.env): ConfiguracionStorage => {
  const proveedorTexto = requerido(entorno, 'STORAGE_PROVIDER').toUpperCase();
  if (proveedorTexto !== 'R2' && proveedorTexto !== 'S3') throw new ErrorConfiguracionStorage('STORAGE_PROVIDER debe ser R2 o S3');
  const proveedor = proveedorTexto as ProveedorDocumental;
  const bucket = requerido(entorno, 'STORAGE_BUCKET').toLowerCase();
  if (!BUCKET.test(bucket)) throw new ErrorConfiguracionStorage('STORAGE_BUCKET no cumple el formato portable S3');
  const region = (entorno.STORAGE_REGION?.trim() || (proveedor === 'R2' ? 'auto' : '')).toLowerCase();
  if (!region || !REGION.test(region) || (proveedor === 'R2' && region !== 'auto') || (proveedor === 'S3' && region === 'auto')) {
    throw new ErrorConfiguracionStorage('STORAGE_REGION no es válida para el proveedor seleccionado');
  }
  const endpoint = validarEndpoint(proveedor, entorno.STORAGE_ENDPOINT, bandera(entorno.STORAGE_ALLOW_LOCAL_ENDPOINT));
  const accessKeyId = entorno.STORAGE_ACCESS_KEY_ID?.trim();
  const secretAccessKey = entorno.STORAGE_SECRET_ACCESS_KEY?.trim();
  if (proveedor === 'R2' && (!accessKeyId || !secretAccessKey)) {
    throw new ErrorConfiguracionStorage('R2 requiere STORAGE_ACCESS_KEY_ID y STORAGE_SECRET_ACCESS_KEY en variables privadas');
  }
  if ((accessKeyId && !secretAccessKey) || (!accessKeyId && secretAccessKey)) {
    throw new ErrorConfiguracionStorage('Las credenciales estáticas deben configurarse como un par completo');
  }
  return {
    proveedor,
    bucket,
    region,
    endpoint,
    forcePathStyle: bandera(entorno.STORAGE_FORCE_PATH_STYLE) || endpoint?.startsWith('http://') === true,
    credenciales: accessKeyId && secretAccessKey ? { accessKeyId, secretAccessKey } : undefined,
    expiracionFirmaSegundos: entero(entorno, 'STORAGE_SIGNED_URL_TTL_SECONDS', 300, 30, 900),
    timeoutMs: entero(entorno, 'STORAGE_TIMEOUT_MS', 30000, 1000, 120000),
    maxIntentos: entero(entorno, 'STORAGE_MAX_ATTEMPTS', 3, 1, 5),
    s3VersionadoHabilitado: proveedor === 'S3' && bandera(entorno.STORAGE_S3_VERSIONING_ENABLED),
    s3ObjectLockHabilitado: proveedor === 'S3' && bandera(entorno.STORAGE_S3_OBJECT_LOCK_ENABLED),
    s3KmsHabilitado: proveedor === 'S3' && bandera(entorno.STORAGE_S3_KMS_ENABLED),
  };
};
