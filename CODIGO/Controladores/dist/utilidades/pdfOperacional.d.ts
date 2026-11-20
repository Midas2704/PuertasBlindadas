/** Valida y conserva el PDF completo; nunca transforma un respaldo en una mera referencia textual. */
export declare function pdfOperacional(valor: unknown, etiqueta?: string): string;
export declare function esPdfOperacional(valor: unknown): valor is string;
/** Compatibilidad para operaciones históricas que admitían una referencia textual. */
export declare function respaldoOperacional(valor: unknown, etiqueta?: string): string;
//# sourceMappingURL=pdfOperacional.d.ts.map