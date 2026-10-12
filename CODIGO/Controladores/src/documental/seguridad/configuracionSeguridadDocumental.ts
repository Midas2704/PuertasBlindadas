import type { PoliticaTecnicaContenido, MimeDocumentalSoportado } from './IntegridadContenido';
import { MIME_DOCUMENTALES_SOPORTADOS } from './IntegridadContenido';
import type { ConfiguracionClamAv } from './AntivirusAdapter';

export interface ConfiguracionSeguridadDocumental {
  politicasPorClasificacion: Readonly<Record<string, PoliticaTecnicaContenido>>;
  clamav: ConfiguracionClamAv | null;
}

const ENTERO = /^\d+$/;

export function cargarConfiguracionSeguridadDocumental(entorno: NodeJS.ProcessEnv = process.env): ConfiguracionSeguridadDocumental {
  let crudo: unknown = {};
  if (entorno.DOCUMENTAL_POLITICAS_TECNICAS_JSON?.trim()) {
    try { crudo = JSON.parse(entorno.DOCUMENTAL_POLITICAS_TECNICAS_JSON); } catch { throw new Error('DOCUMENTAL_POLITICAS_TECNICAS_JSON no contiene JSON válido'); }
  }
  if (!crudo || typeof crudo !== 'object' || Array.isArray(crudo)) throw new Error('Las políticas técnicas deben ser un objeto por clasificación');
  const politicas: Record<string, PoliticaTecnicaContenido> = {};
  for (const [clasificacion, valor] of Object.entries(crudo as Record<string, unknown>)) {
    if (!valor || typeof valor !== 'object' || Array.isArray(valor)) throw new Error(`Política inválida para ${clasificacion}`);
    const dato = valor as Record<string, unknown>;
    const minimo = String(dato.minimoBytes ?? ''); const maximo = String(dato.maximoBytes ?? '');
    if (!ENTERO.test(minimo) || !ENTERO.test(maximo) || BigInt(minimo) < 1n || BigInt(maximo) < BigInt(minimo)) throw new Error(`Límites inválidos para ${clasificacion}`);
    if (!Array.isArray(dato.mimesPermitidos) || dato.mimesPermitidos.some(mime => !MIME_DOCUMENTALES_SOPORTADOS.includes(mime as MimeDocumentalSoportado))) throw new Error(`MIME permitidos inválidos para ${clasificacion}`);
    politicas[clasificacion.toUpperCase()] = { minimoBytes: BigInt(minimo), maximoBytes: BigInt(maximo), mimesPermitidos: dato.mimesPermitidos as MimeDocumentalSoportado[] };
  }
  const host = entorno.DOCUMENTAL_CLAMAV_HOST?.trim();
  if (!host) return { politicasPorClasificacion: politicas, clamav: null };
  const puerto = Number(entorno.DOCUMENTAL_CLAMAV_PORT ?? '3310');
  const timeoutMs = Number(entorno.DOCUMENTAL_CLAMAV_TIMEOUT_MS ?? '30000');
  const maximoBytes = entorno.DOCUMENTAL_CLAMAV_MAX_BYTES ?? '';
  if (!Number.isInteger(puerto) || puerto < 1 || puerto > 65535 || !Number.isInteger(timeoutMs) || timeoutMs < 1000 || !ENTERO.test(maximoBytes) || BigInt(maximoBytes) < 1n) throw new Error('Configuración ClamAV inválida');
  return { politicasPorClasificacion: politicas, clamav: { host, puerto, timeoutMs, maximoBytes: BigInt(maximoBytes) } };
}
