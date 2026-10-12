import { MIME_DOCUMENTALES_SOPORTADOS, type MimeDocumentalSoportado, type PoliticaTecnicaContenido } from './IntegridadContenido';

export interface PoliticaActivacionDocumental extends PoliticaTecnicaContenido {
  clasificacion: string;
  timeoutMs: number;
  concurrenciaMaxima: number;
  cantidadMaximaPorOperacion: number;
  expiracionIntencionSegundos: number;
  expiracionUrlFirmadaSegundos: number;
  antivirusObligatorio: true;
}

const enteroPositivo = (valor: unknown, campo: string) => {
  const numero = Number(valor);
  if (!Number.isInteger(numero) || numero < 1) throw new Error(`Política documental incompleta: ${campo}`);
  return numero;
};

/**
 * Configuración fail-closed para una activación futura. No contiene valores empresariales
 * predeterminados: cada clasificación debe ser aprobada y entregada explícitamente.
 */
export function cargarPoliticasActivacionDocumental(entorno: NodeJS.ProcessEnv = process.env): Readonly<Record<string, PoliticaActivacionDocumental>> {
  const texto = entorno.DOCUMENTAL_POLITICAS_ACTIVACION_JSON?.trim();
  if (!texto) throw new Error('Falta DOCUMENTAL_POLITICAS_ACTIVACION_JSON');
  let crudo: unknown;
  try { crudo = JSON.parse(texto); } catch { throw new Error('DOCUMENTAL_POLITICAS_ACTIVACION_JSON no contiene JSON válido'); }
  if (!crudo || typeof crudo !== 'object' || Array.isArray(crudo)) throw new Error('Las políticas de activación deben ser un objeto');
  const salida: Record<string, PoliticaActivacionDocumental> = {};
  for (const [clave, valor] of Object.entries(crudo as Record<string, unknown>)) {
    if (!valor || typeof valor !== 'object' || Array.isArray(valor)) throw new Error(`Política inválida para ${clave}`);
    const dato = valor as Record<string, unknown>;
    const clasificacion = clave.trim().toUpperCase();
    if (!clasificacion) throw new Error('Clasificación documental vacía');
    const minimoBytes = BigInt(enteroPositivo(dato.minimoBytes, `${clasificacion}.minimoBytes`));
    const maximoBytes = BigInt(enteroPositivo(dato.maximoBytes, `${clasificacion}.maximoBytes`));
    if (maximoBytes < minimoBytes) throw new Error(`Límites inválidos para ${clasificacion}`);
    if (!Array.isArray(dato.mimesPermitidos) || dato.mimesPermitidos.length === 0 || dato.mimesPermitidos.some(mime => !MIME_DOCUMENTALES_SOPORTADOS.includes(mime as MimeDocumentalSoportado))) {
      throw new Error(`MIME permitidos inválidos para ${clasificacion}`);
    }
    if (dato.antivirusObligatorio !== true) throw new Error(`Antivirus obligatorio no aprobado para ${clasificacion}`);
    salida[clasificacion] = Object.freeze({
      clasificacion, minimoBytes, maximoBytes,
      mimesPermitidos: Object.freeze([...dato.mimesPermitidos]) as readonly MimeDocumentalSoportado[],
      timeoutMs: enteroPositivo(dato.timeoutMs, `${clasificacion}.timeoutMs`),
      concurrenciaMaxima: enteroPositivo(dato.concurrenciaMaxima, `${clasificacion}.concurrenciaMaxima`),
      cantidadMaximaPorOperacion: enteroPositivo(dato.cantidadMaximaPorOperacion, `${clasificacion}.cantidadMaximaPorOperacion`),
      expiracionIntencionSegundos: enteroPositivo(dato.expiracionIntencionSegundos, `${clasificacion}.expiracionIntencionSegundos`),
      expiracionUrlFirmadaSegundos: enteroPositivo(dato.expiracionUrlFirmadaSegundos, `${clasificacion}.expiracionUrlFirmadaSegundos`),
      antivirusObligatorio: true,
    });
  }
  if (!salida.COMERCIAL) throw new Error('Falta política de activación COMERCIAL');
  return Object.freeze(salida);
}
