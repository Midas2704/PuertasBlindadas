import { randomUUID } from 'node:crypto';
import { ErrorDocumental } from './tipos';

const PATRON_UUID = '[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}';
const CLAVE_TEMPORAL = new RegExp(`^tmp/${PATRON_UUID}$`);
const CLAVE_OBJETO = new RegExp(`^(objects|quarantine)/${PATRON_UUID}$`);
const MIME = /^[a-z0-9][a-z0-9!#$&^_.+-]*\/[a-z0-9][a-z0-9!#$&^_.+-]*$/i;
const SHA256 = /^[0-9a-f]{64}$/;
const CONTENEDOR = /^[a-z0-9][a-z0-9._-]{2,62}$/;
const CONTROL_O_RUTA = /[\u0000-\u001f\u007f/\\]/;

export const textoRequerido = (valor: unknown, campo: string, maximo: number) => {
  const texto = String(valor ?? '').trim();
  if (!texto || texto.length > maximo) throw new ErrorDocumental('METADATO_INVALIDO', `${campo} es obligatorio y admite hasta ${maximo} caracteres`);
  return texto;
};

export const validarNombreArchivo = (valor: unknown, campo = 'Nombre de archivo') => {
  const nombre = textoRequerido(valor, campo, 255);
  if (CONTROL_O_RUTA.test(nombre) || nombre === '.' || nombre === '..') throw new ErrorDocumental('NOMBRE_ARCHIVO_INVALIDO', `${campo} no puede contener rutas ni caracteres de control`);
  return nombre;
};

export const validarMime = (valor: unknown) => {
  const mime = textoRequerido(valor, 'MIME', 150).toLowerCase();
  if (!MIME.test(mime)) throw new ErrorDocumental('MIME_INVALIDO', 'El tipo MIME declarado no es válido');
  return mime;
};

export const validarTamano = (valor: bigint | number) => {
  const tamano = typeof valor === 'bigint' ? valor : BigInt(valor);
  if (tamano <= 0n) throw new ErrorDocumental('TAMANO_INVALIDO', 'El tamaño debe ser mayor que cero');
  return tamano;
};

export const validarSha256 = (valor: string | null | undefined, obligatorio = false) => {
  if (!valor && !obligatorio) return null;
  const hash = String(valor || '').toLowerCase();
  if (!SHA256.test(hash)) throw new ErrorDocumental('HASH_INVALIDO', 'SHA-256 debe contener exactamente 64 caracteres hexadecimales');
  return hash;
};

export const validarClaveTemporal = (valor: unknown) => {
  const clave = textoRequerido(valor, 'Clave temporal', 700).toLowerCase();
  if (!CLAVE_TEMPORAL.test(clave)) throw new ErrorDocumental('CLAVE_NO_OPACA', 'La clave temporal debe usar exclusivamente tmp/<uuid>');
  return clave;
};

export const validarClaveObjeto = (valor: unknown) => {
  const clave = textoRequerido(valor, 'Clave de objeto', 700).toLowerCase();
  if (!CLAVE_OBJETO.test(clave)) throw new ErrorDocumental('CLAVE_NO_OPACA', 'La clave de objeto debe usar exclusivamente objects/<uuid> o quarantine/<uuid>');
  return clave;
};

export const validarContenedor = (valor: unknown) => {
  const contenedor = textoRequerido(valor, 'Contenedor lógico', 80).toLowerCase();
  if (!CONTENEDOR.test(contenedor)) throw new ErrorDocumental('CONTENEDOR_INVALIDO', 'El contenedor lógico no cumple el formato portable');
  return contenedor;
};

export const nuevaClaveTemporal = () => `tmp/${randomUUID()}`;
export const nuevaClaveObjeto = (cuarentena = false) => `${cuarentena ? 'quarantine' : 'objects'}/${randomUUID()}`;
