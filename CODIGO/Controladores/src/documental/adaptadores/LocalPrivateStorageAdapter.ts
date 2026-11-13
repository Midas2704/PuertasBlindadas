import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { lstat, mkdir, open, unlink } from 'node:fs/promises';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import type {
  CapacidadesStorage, CargaIniciadaStorage, IntegridadStorage,
  ReferenciaObjetoStorage, StorageAdapter,
} from '../StorageAdapter';
import { validarClaveObjeto, validarContenedor, validarMime, validarSha256, validarTamano } from '../validaciones';
import { ErrorStorage } from './S3CompatibleStorageAdapter';

export interface ConfiguracionStorageLocalPrivado {
  directorioRaiz: string;
  contenedor: string;
}

const bandera = (valor: string | undefined) => /^(1|true|si)$/i.test(valor?.trim() || '');

export const modoServidorPersonalHabilitado = (entorno: NodeJS.ProcessEnv = process.env) =>
  bandera(entorno.DOCUMENTAL_PERSONAL_MODE);

export const cargarConfiguracionStorageLocalPrivado = (
  entorno: NodeJS.ProcessEnv = process.env,
): ConfiguracionStorageLocalPrivado => {
  const directorioRaiz = entorno.DOCUMENTAL_LOCAL_STORAGE_DIR?.trim() || '/app/data/documentos';
  if (!isAbsolute(directorioRaiz)) throw new Error('DOCUMENTAL_LOCAL_STORAGE_DIR debe ser una ruta absoluta');
  if (resolve(directorioRaiz) === resolve('/')) throw new Error('DOCUMENTAL_LOCAL_STORAGE_DIR no puede apuntar a la raíz del sistema');
  const contenedor = validarContenedor(entorno.DOCUMENTAL_LOCAL_CONTAINER?.trim() || 'documentos-locales');
  return { directorioRaiz: resolve(directorioRaiz), contenedor };
};

/**
 * Almacenamiento privado para una instalación personal de un solo servidor.
 * No publica rutas HTTP: todos los accesos pasan por el backend y conservan SHA-256.
 */
export class LocalPrivateStorageAdapter implements StorageAdapter {
  readonly proveedor = 'LOCAL_PRIVADO';
  readonly capacidades: Readonly<CapacidadesStorage> = Object.freeze({
    cargaDirecta: true,
    cargaFirmadaPut: false,
    formularioFirmadoPost: false,
    multipart: false,
    versionadoProveedor: false,
    retencionProveedor: false,
    legalHold: false,
    cifradoClaveAdministrada: false,
    copiaCondicionalDestino: false,
    escrituraCondicionalDestino: true,
    lecturaCondicionalOrigen: false,
    multipartCondicionalDestino: false,
  });

  constructor(private readonly configuracion: ConfiguracionStorageLocalPrivado) {}

  private ruta(referencia: ReferenciaObjetoStorage) {
    const contenedor = validarContenedor(referencia.contenedor);
    if (contenedor !== this.configuracion.contenedor) {
      throw new ErrorStorage('NO_AUTORIZADO', this.proveedor, false, 'El contenedor local no está autorizado');
    }
    const clave = validarClaveObjeto(referencia.clave);
    const ruta = resolve(join(this.configuracion.directorioRaiz, contenedor, ...clave.split('/')));
    const base = resolve(join(this.configuracion.directorioRaiz, contenedor));
    if (!ruta.startsWith(`${base}\\`) && !ruta.startsWith(`${base}/`)) {
      throw new ErrorStorage('NO_AUTORIZADO', this.proveedor, false, 'La ruta local quedó fuera del contenedor privado');
    }
    return ruta;
  }

  async iniciarCarga(entrada: {
    referencia: ReferenciaObjetoStorage; mime: string; tamanoEsperado: bigint; claveIdempotencia: string;
  }): Promise<CargaIniciadaStorage> {
    this.ruta(entrada.referencia);
    validarMime(entrada.mime);
    validarTamano(entrada.tamanoEsperado);
    return { referencia: entrada.referencia, idempotente: true };
  }

  async crearObjetoExclusivo(entrada: {
    referencia: ReferenciaObjetoStorage; contenido: import('node:stream').Readable; mime: string;
    tamanoEsperado: bigint; claveIdempotencia: string; sha256?: string;
  }): Promise<IntegridadStorage> {
    const ruta = this.ruta(entrada.referencia);
    const mime = validarMime(entrada.mime);
    const esperado = validarTamano(entrada.tamanoEsperado);
    const shaEsperado = validarSha256(entrada.sha256, true)!;
    await mkdir(dirname(ruta), { recursive: true, mode: 0o700 });
    let manejador;
    try {
      manejador = await open(ruta, 'wx', 0o600);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'EEXIST') {
        throw new ErrorStorage('OBJETO_EXISTENTE', this.proveedor, false, 'El objeto local ya existe');
      }
      throw new ErrorStorage('DESCONOCIDO', this.proveedor, false, 'No fue posible crear el objeto local');
    }
    const hash = createHash('sha256');
    let total = 0n;
    try {
      for await (const fragmento of entrada.contenido) {
        const bloque = Buffer.isBuffer(fragmento) ? fragmento : Buffer.from(fragmento);
        total += BigInt(bloque.length);
        if (total > esperado) throw new ErrorStorage('INTEGRIDAD', this.proveedor, false, 'El contenido excede el tamaño esperado');
        hash.update(bloque);
        let desplazamiento = 0;
        while (desplazamiento < bloque.length) {
          const { bytesWritten } = await manejador.write(bloque, desplazamiento);
          if (bytesWritten < 1) throw new ErrorStorage('INTEGRIDAD', this.proveedor, false, 'La escritura local quedó incompleta');
          desplazamiento += bytesWritten;
        }
      }
      const sha256 = hash.digest('hex');
      if (total !== esperado || sha256 !== shaEsperado) {
        throw new ErrorStorage('INTEGRIDAD', this.proveedor, false, 'El contenido local no coincide con su tamaño o SHA-256');
      }
      await manejador.sync();
      await manejador.chmod(0o600);
      return { tamanoBytes: total, sha256Verificado: sha256, mime };
    } catch (error) {
      await manejador.close().catch(() => undefined);
      await unlink(ruta).catch(() => undefined);
      throw error;
    } finally {
      await manejador.close().catch(() => undefined);
    }
  }

  async consultarObjeto(referencia: ReferenciaObjetoStorage): Promise<IntegridadStorage> {
    const ruta = this.ruta(referencia);
    try {
      const datos = await lstat(ruta);
      if (!datos.isFile() || datos.isSymbolicLink()) throw new Error('NO_ES_ARCHIVO_REGULAR');
      const hash = createHash('sha256');
      for await (const fragmento of createReadStream(ruta)) hash.update(fragmento as Buffer);
      return { tamanoBytes: BigInt(datos.size), sha256Verificado: hash.digest('hex'), mime: 'application/pdf' };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') throw new ErrorStorage('NO_ENCONTRADO', this.proveedor, false, 'Objeto local no encontrado', 404);
      throw new ErrorStorage('INTEGRIDAD', this.proveedor, false, 'El objeto local no es un archivo regular válido');
    }
  }

  async abrirLectura(referencia: ReferenciaObjetoStorage) {
    const ruta = this.ruta(referencia);
    try {
      const datos = await lstat(ruta);
      if (!datos.isFile() || datos.isSymbolicLink()) throw new Error('NO_ES_ARCHIVO_REGULAR');
      return createReadStream(ruta);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') throw new ErrorStorage('NO_ENCONTRADO', this.proveedor, false, 'Objeto local no encontrado', 404);
      throw new ErrorStorage('INTEGRIDAD', this.proveedor, false, 'El objeto local no es un archivo regular válido');
    }
  }

  async eliminarVersionPermitida(referencia: ReferenciaObjetoStorage) {
    const ruta = this.ruta(referencia);
    await unlink(ruta).catch(error => {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    });
  }
}
