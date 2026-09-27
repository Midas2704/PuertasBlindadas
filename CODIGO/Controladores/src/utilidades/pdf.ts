const textoPdf = (valor: unknown) => String(valor ?? '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^\x20-\x7E]/g, '?')
  .replace(/([\\()])/g, '\\$1');

/** Renderer PDF liviano compartido por los documentos financieros del sistema. */
export function crearPdf(lineas: string[]) {
  const porPagina = 29;
  const paginas = Array.from({ length: Math.max(1, Math.ceil(lineas.length / porPagina)) }, (_, indice) =>
    lineas.slice(indice * porPagina, (indice + 1) * porPagina));
  const objetos: string[] = ['', '<< /Type /Catalog /Pages 2 0 R >>', ''];
  const paginasIds: number[] = [];

  for (const [indice, contenido] of paginas.entries()) {
    const paginaId = objetos.length;
    const streamId = paginaId + 1;
    paginasIds.push(paginaId);
    const instrucciones = [
      'q', '0.996 0.561 0.004 rg', '50 807 495 3 re', 'f', 'Q',
      'BT', '/F1 18 Tf', '0 0 0 rg', '50 780 Td', `(${textoPdf(contenido[0] || '')}) Tj`,
      '/F1 10 Tf', '0.404 0.404 0.404 rg',
      ...contenido.slice(1).flatMap((linea) => ['0 -23 Td', `(${textoPdf(linea)}) Tj`]),
      ...(paginas.length > 1 ? ['0 -23 Td', `(Pagina ${indice + 1} de ${paginas.length}) Tj`] : []),
      'ET',
    ].join('\n');
    objetos.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 FONT_ID 0 R >> >> /Contents ${streamId} 0 R >>`);
    objetos.push(`<< /Length ${Buffer.byteLength(instrucciones, 'latin1')} >>\nstream\n${instrucciones}\nendstream`);
  }
  const fuenteId = objetos.length;
  objetos.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
  objetos[2] = `<< /Type /Pages /Kids [${paginasIds.map((id) => `${id} 0 R`).join(' ')}] /Count ${paginasIds.length} >>`;
  for (const paginaId of paginasIds) objetos[paginaId] = objetos[paginaId].replace('FONT_ID', String(fuenteId));

  let salida = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
  const posiciones = [0];
  for (let indice = 1; indice < objetos.length; indice++) {
    posiciones[indice] = Buffer.byteLength(salida, 'latin1');
    salida += `${indice} 0 obj\n${objetos[indice]}\nendobj\n`;
  }
  const inicioXref = Buffer.byteLength(salida, 'latin1');
  salida += `xref\n0 ${objetos.length}\n0000000000 65535 f \n${posiciones.slice(1).map((posicion) => `${String(posicion).padStart(10, '0')} 00000 n `).join('\n')}\ntrailer\n<< /Size ${objetos.length} /Root 1 0 R >>\nstartxref\n${inicioXref}\n%%EOF\n`;
  return Buffer.from(salida, 'latin1');
}

export const archivoPdf = (nombre: string, lineas: string[]) => ({
  nombre,
  mime: 'application/pdf',
  contenido: `data:application/pdf;base64,${crearPdf(lineas).toString('base64')}`,
});
