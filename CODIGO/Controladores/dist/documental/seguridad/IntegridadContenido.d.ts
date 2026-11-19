import type { Readable } from 'node:stream';
export declare const MIME_DOCUMENTALES_SOPORTADOS: readonly ["image/jpeg", "image/png", "image/webp", "application/pdf"];
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
/** Lee el contenido por streaming. Sólo conserva prefijo/sufijo acotados; nunca el archivo completo. */
export declare function validarIntegridadContenido(entrada: {
    contenido: Readable;
    mimeDeclarado: string;
    tamanoEsperado: bigint;
    sha256Esperado?: string;
    politica: PoliticaTecnicaContenido;
}): Promise<ResultadoIntegridadContenido>;
//# sourceMappingURL=IntegridadContenido.d.ts.map