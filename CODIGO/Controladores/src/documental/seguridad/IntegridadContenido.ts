import { createHash } from 'node:crypto';
import type { Readable } from 'node:stream';

export const MIME_DOCUMENTALES_SOPORTADOS = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'] as const;
export type MimeDocumentalSoportado = typeof MIME_DOCUMENTALES_SOPORTADOS[number];

export interface PoliticaTecnicaContenido {
  minimoBytes: bigint;
  maximoBytes: bigint;
  mimesPermitidos: readonly MimeDocumentalSoportado[];
}

export interface ResultadoIntegridadContenido {
  valido: boolean;
  tamanoBytes: bigint;
  sha256: string;
  mimeDetectado: MimeDocumentalSoportado | null;
  mimeDeclaradoCoincide: boolean;
  codigos: readonly string[];
}

const empiezaCon = (valor: Buffer, firma: readonly number[]) => firma.every((byte, indice) => valor[indice] === byte);

function detectarMime(prefijo: Buffer, sufijo: Buffer, tamano: bigint): MimeDocumentalSoportado | null {
  if (empiezaCon(prefijo, [0xff, 0xd8, 0xff]) && sufijo.length >= 2 && sufijo[sufijo.length - 2] === 0xff && sufijo[sufijo.length - 1] === 0xd9) return 'image/jpeg';
  if (empiezaCon(prefijo, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]) && sufijo.includes(Buffer.from('IEND'))) return 'image/png';
  if (prefijo.subarray(0, 4).toString('ascii') === 'RIFF' && prefijo.subarray(8, 12).toString('ascii') === 'WEBP') {
    const declarado = prefijo.length >= 8 ? BigInt(prefijo.readUInt32LE(4)) + 8n : -1n;
    if (declarado === tamano) return 'image/webp';
  }
  if (prefijo.subarray(0, 5).toString('ascii') === '%PDF-' && sufijo.includes(Buffer.from('%%EOF'))) return 'application/pdf';
  return null;
}

/** Lee el contenido por streaming. Sólo conserva prefijo/sufijo acotados; nunca el archivo completo. */
export async function validarIntegridadContenido(entrada: {
  contenido: Readable;
  mimeDeclarado: string;
  tamanoEsperado: bigint;
  sha256Esperado?: string;
  politica: PoliticaTecnicaContenido;
}): Promise<ResultadoIntegridadContenido> {
  const hash = createHash('sha256');
  let tamano = 0n;
  let prefijo = Buffer.alloc(0);
  let sufijo = Buffer.alloc(0);
  let inspeccionTexto = '';
  const codigos: string[] = [];

  for await (const fragmento of entrada.contenido) {
    const bloque = Buffer.isBuffer(fragmento) ? fragmento : Buffer.from(fragmento);
    tamano += BigInt(bloque.length);
    if (tamano > entrada.politica.maximoBytes) {
      entrada.contenido.destroy();
      codigos.push('TAMANO_SUPERA_LIMITE');
      break;
    }
    hash.update(bloque);
    if (prefijo.length < 64) prefijo = Buffer.concat([prefijo, bloque]).subarray(0, 64);
    sufijo = Buffer.concat([sufijo, bloque]).subarray(-2048);
    const texto = (inspeccionTexto + bloque.toString('latin1')).toLowerCase();
    inspeccionTexto = texto.slice(-256);
    if (texto.includes('/javascript') || texto.includes('/launch') || texto.includes('/embeddedfile') || texto.includes('/openaction')) {
      if (!codigos.includes('PDF_CONTENIDO_ACTIVO')) codigos.push('PDF_CONTENIDO_ACTIVO');
    }
  }

  const sha256 = hash.digest('hex');
  const mimeDetectado = detectarMime(prefijo, sufijo, tamano);
  if (tamano < entrada.politica.minimoBytes) codigos.push('TAMANO_INFERIOR_MINIMO');
  if (tamano !== entrada.tamanoEsperado) codigos.push('TAMANO_NO_COINCIDE');
  if (entrada.sha256Esperado && sha256 !== entrada.sha256Esperado.toLowerCase()) codigos.push('SHA256_NO_COINCIDE');
  if (!mimeDetectado) codigos.push('MIME_NO_SOPORTADO');
  if (mimeDetectado && !entrada.politica.mimesPermitidos.includes(mimeDetectado)) codigos.push('MIME_NO_PERMITIDO');
  const mimeDeclaradoCoincide = mimeDetectado === entrada.mimeDeclarado.toLowerCase();
  if (!mimeDeclaradoCoincide) codigos.push('MIME_DECLARADO_NO_COINCIDE');

  return { valido: codigos.length === 0, tamanoBytes: tamano, sha256, mimeDetectado, mimeDeclaradoCoincide, codigos };
}
