type LineaVentaDirecta = {
  tipo?: unknown;
  descripcion?: unknown;
  cantidad?: unknown;
  valor?: unknown;
};

const entidades: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
};

const puntoCodigoSeguro = (valor: number) => Number.isInteger(valor) && valor >= 0 && valor <= 0x10ffff
  ? String.fromCodePoint(valor)
  : '\ufffd';

const decodificarEntidades = (texto: string) => texto.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (entidad, codigo: string) => {
  const normalizado = codigo.toLowerCase();
  if (normalizado.startsWith('#x')) return puntoCodigoSeguro(Number.parseInt(normalizado.slice(2), 16));
  if (normalizado.startsWith('#')) return puntoCodigoSeguro(Number.parseInt(normalizado.slice(1), 10));
  return entidades[normalizado] ?? entidad;
});

const limpiarMarcado = (valor: string) => decodificarEntidades(valor
  .replace(/<\s*(?:script|style)\b[^>]*>[\s\S]*?<\s*\/\s*(?:script|style)\s*>/gi, '')
  .replace(/<\s*br\s*\/?>/gi, '\n')
  .replace(/<\s*\/\s*(?:p|div|li|tr|h[1-6])\s*>/gi, '\n')
  .replace(/<[^>]*>/g, ''));

const texto = (valor: unknown) => typeof valor === 'string' || typeof valor === 'number' ? String(valor).trim() : '';

const presentarVentaDirecta = (valor: Record<string, unknown>) => {
  if (!Array.isArray(valor.detalleComercial)) return null;
  const lineas = (valor.detalleComercial as LineaVentaDirecta[]).flatMap((linea, indice) => {
    const descripcion = texto(linea.descripcion);
    if (!descripcion) return [];
    const cantidad = texto(linea.cantidad);
    const monto = texto(linea.valor);
    const detalleMonto = [cantidad && `${cantidad} unidad(es)`, monto && `$${Number(monto).toLocaleString('es-CL')}`].filter(Boolean).join(' · ');
    return [`${indice + 1}. ${texto(linea.tipo) || 'Ítem'}: ${descripcion}${detalleMonto ? ` — ${detalleMonto}` : ''}`];
  });
  const base = texto(valor.montoBaseCalculado);
  return ['Venta directa', ...lineas, ...(base ? [`Monto base: $${Number(base).toLocaleString('es-CL')}`] : [])].join('\n');
};

export const presentarObservacion = (valor: unknown) => {
  if (valor === null || valor === undefined) return '';
  let contenido = String(valor);
  try {
    const estructurado = JSON.parse(contenido);
    if (estructurado && typeof estructurado === 'object' && !Array.isArray(estructurado)) {
      contenido = presentarVentaDirecta(estructurado as Record<string, unknown>) ?? Object.entries(estructurado as Record<string, unknown>)
        .map(([clave, dato]) => `${clave.replaceAll('_', ' ')}: ${texto(dato) || '—'}`)
        .join('\n');
    }
  } catch {
    // Las observaciones históricas de texto plano no necesitan interpretación.
  }
  return limpiarMarcado(contenido)
    .replace(/\r\n?/g, '\n')
    .split('\n')
    .map(linea => linea.replace(/[ \t]+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};
