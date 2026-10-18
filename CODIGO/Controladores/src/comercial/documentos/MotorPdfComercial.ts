import { createHash } from 'node:crypto';

export type SegmentoDocumentoComercial = 'B2B' | 'B2C' | 'CARTA_B2C';

export interface LineaDocumentoComercial {
  codigo?: string | null;
  nombre: string;
  descripcion?: string | null;
  cantidad: number;
  unidad?: string | null;
  dimensiones?: string | null;
  precioUnitario?: number | null;
  subtotal?: number | null;
  caracteristicas?: string[];
  opcionales?: string[];
}
export interface AlternativaDocumentoComercial {
  identificador: string;
  etiqueta: string;
  producto: string;
  descripcion?: string | null;
  caracteristicas?: string[];
  opcionales?: string[];
  moneda: string;
  neto: number;
  impuesto: number;
  total: number;
  fotografiaDisponible: boolean;
}

export interface SnapshotDocumentoComercial {
  tipo: SegmentoDocumentoComercial;
  titulo: string;
  numero?: string | null;
  version?: number | null;
  fecha: string;
  vigencia?: string | null;
  borrador: boolean;
  camposPendientes?: string[];
  cliente?: { nombre: string; rut?: string | null; correo?: string | null; telefono?: string | null } | null;
  contactos?: Array<{ nombre: string; cargo?: string | null; correo?: string | null; telefono?: string | null; principal?: boolean }>;
  proyecto?: { nombre?: string | null; referencia?: string | null; ubicacion?: string | null; alcance?: string | null } | null;
  introduccion?: string | null;
  moneda: string;
  productos: LineaDocumentoComercial[];
  servicios?: LineaDocumentoComercial[];
  alternativas?: AlternativaDocumentoComercial[];
  neto?: number | null;
  impuesto?: number | null;
  total?: number | null;
  condiciones?: string[];
  observaciones?: string[];
  plantilla?: { id?: string | null; version?: number | null; nombre: string; publicada: boolean } | null;
}

type Pagina = string[];

const limpiar = (valor: unknown) => String(valor ?? '')
  .replace(/[\u2013\u2014]/g, '-')
  .replace(/[\u2018\u2019]/g, "'")
  .replace(/[\u201c\u201d]/g, '"')
  .replace(/[^\x20-\x7E\xA0-\xFF]/g, '?')
  .replace(/([\\()])/g, '\\$1');

const partir = (valor: unknown, maximo = 88) => {
  const palabras = String(valor ?? '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean);
  if (!palabras.length) return ['-'];
  const lineas: string[] = [];
  let actual = '';
  for (const palabra of palabras) {
    const candidato = `${actual} ${palabra}`.trim();
    if (candidato.length <= maximo) actual = candidato;
    else { if (actual) lineas.push(actual); actual = palabra; }
  }
  if (actual) lineas.push(actual);
  return lineas;
};

const moneda = (valor: number | null | undefined, codigo: string) => {
  if (valor === null || valor === undefined || !Number.isFinite(valor)) return 'No disponible';
  const decimales = codigo === 'CLP' ? 0 : 2;
  return `${codigo} ${valor.toLocaleString('es-CL', { minimumFractionDigits: decimales, maximumFractionDigits: decimales })}`;
};

const texto = (x: number, y: number, valor: unknown, tamano = 9, negrita = false, color = '0 0 0') =>
  `BT /${negrita ? 'F2' : 'F1'} ${tamano} Tf ${color} rg ${x} ${y} Td (${limpiar(valor)}) Tj ET`;

const rectangulo = (x: number, y: number, ancho: number, alto: number, relleno: string, borde?: string) =>
  `${relleno} rg${borde ? ` ${borde} RG 0.6 w` : ''} ${x} ${y} ${ancho} ${alto} re ${borde ? 'B' : 'f'}`;

const ensamblar = (paginas: Pagina[]) => {
  const objetos: string[] = ['', '<< /Type /Catalog /Pages 2 0 R >>', ''];
  const ids: number[] = [];
  for (const instrucciones of paginas) {
    const id = objetos.length, streamId = id + 1;
    ids.push(id);
    const stream = instrucciones.join('\n');
    objetos.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 REGULAR 0 R /F2 BOLD 0 R >> >> /Contents ${streamId} 0 R >>`);
    objetos.push(`<< /Length ${Buffer.byteLength(stream, 'latin1')} >>\nstream\n${stream}\nendstream`);
  }
  const regular = objetos.length; objetos.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>');
  const bold = objetos.length; objetos.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>');
  objetos[2] = `<< /Type /Pages /Kids [${ids.map(id => `${id} 0 R`).join(' ')}] /Count ${ids.length} >>`;
  ids.forEach(id => { objetos[id] = objetos[id].replace('REGULAR', String(regular)).replace('BOLD', String(bold)); });
  let salida = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';
  const posiciones = [0];
  for (let i = 1; i < objetos.length; i += 1) { posiciones[i] = Buffer.byteLength(salida, 'latin1'); salida += `${i} 0 obj\n${objetos[i]}\nendobj\n`; }
  const xref = Buffer.byteLength(salida, 'latin1');
  salida += `xref\n0 ${objetos.length}\n0000000000 65535 f \n${posiciones.slice(1).map(pos => `${String(pos).padStart(10, '0')} 00000 n `).join('\n')}\ntrailer\n<< /Size ${objetos.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`;
  return Buffer.from(salida, 'latin1');
};

/** Renderer único de cotizaciones y carta general. Recibe importes ya resueltos por M2. */
export function crearPdfComercial(snapshot: SnapshotDocumentoComercial) {
  const paginas: Pagina[] = [];
  let pagina: Pagina = [], y = 0;
  const acento = snapshot.tipo === 'B2B' ? '0.996 0.561 0.004' : '0.404 0.404 0.404';
  const nuevaPagina = () => {
    pagina = [];
    paginas.push(pagina);
    pagina.push(rectangulo(0, 760, 612, 32, acento));
    pagina.push(texto(40, 772, 'PUERTAS BLINDADAS', 10, true, '1 1 1'));
    pagina.push(texto(430, 772, snapshot.tipo === 'B2B' ? 'COTIZACION B2B' : snapshot.tipo === 'B2C' ? 'COTIZACION B2C' : 'CARTA B2C', 8, true, '1 1 1'));
    y = 730;
  };
  const asegurar = (alto = 22) => { if (y - alto < 54) nuevaPagina(); };
  const linea = (valor: unknown, opciones: { negrita?: boolean; tamano?: number; sangria?: number; color?: string; maximo?: number } = {}) => {
    const tamano = opciones.tamano ?? 9;
    for (const fragmento of partir(valor, opciones.maximo ?? 94)) {
      asegurar(tamano + 7);
      pagina.push(texto(40 + (opciones.sangria ?? 0), y, fragmento, tamano, opciones.negrita, opciones.color));
      y -= tamano + 7;
    }
  };
  const titulo = (valor: string) => { asegurar(34); y -= 4; linea(valor, { negrita: true, tamano: 12, color: acento }); y -= 4; };
  const par = (etiqueta: string, valor: unknown) => linea(`${etiqueta}: ${String(valor ?? '').trim() || 'No informado'}`);
  const tabla = (tituloTabla: string, filas: LineaDocumentoComercial[]) => {
    if (!filas.length) return;
    titulo(tituloTabla);
    for (const fila of filas) {
      const altoFila = partir(`${fila.codigo ? `${fila.codigo} · ` : ''}${fila.nombre}`, 76).length * 16
        + (fila.descripcion ? partir(fila.descripcion, 96).length * 15 : 0)
        + 15
        + (fila.dimensiones ? partir(`Dimensiones: ${fila.dimensiones}`, 94).length * 15 : 0)
        + (fila.caracteristicas?.length ? partir(`Características: ${fila.caracteristicas.join(' · ')}`, 94).length * 15 : 0)
        + (fila.opcionales?.length ? partir(`Opcionales: ${fila.opcionales.join(' · ')}`, 94).length * 15 : 0)
        + 8;
      asegurar(altoFila);
      linea(`${fila.codigo ? `${fila.codigo} · ` : ''}${fila.nombre}`, { negrita: true, maximo: 76 });
      if (fila.descripcion) linea(fila.descripcion, { sangria: 10, tamano: 8, color: '0.25 0.25 0.25', maximo: 96 });
      const cantidad = `${fila.cantidad.toLocaleString('es-CL')} ${fila.unidad || 'unidad(es)'}`;
      const valores = fila.precioUnitario === null || fila.precioUnitario === undefined
        ? `${cantidad} · Precio no disponible`
        : `${cantidad} · Unitario ${moneda(fila.precioUnitario, snapshot.moneda)} · Subtotal ${moneda(fila.subtotal, snapshot.moneda)}`;
      linea(valores, { sangria: 10, tamano: 8 });
      if (fila.dimensiones) linea(`Dimensiones: ${fila.dimensiones}`, { sangria: 10, tamano: 8 });
      if (fila.caracteristicas?.length) linea(`Características: ${fila.caracteristicas.join(' · ')}`, { sangria: 10, tamano: 8 });
      if (fila.opcionales?.length) linea(`Opcionales: ${fila.opcionales.join(' · ')}`, { sangria: 10, tamano: 8 });
      y -= 4;
    }
  };

  nuevaPagina();
  linea(snapshot.titulo, { negrita: true, tamano: 20, maximo: 54 });
  if (snapshot.borrador) {
    pagina.push(rectangulo(40, y - 10, 532, 26, '0.96 0.96 0.96', acento));
    pagina.push(texto(52, y, 'BORRADOR - NO EMITIDO', 11, true, acento));
    y -= 40;
  }
  par('Número', snapshot.numero || (snapshot.borrador ? 'Se asignará al emitir' : 'No informado'));
  par('Versión', snapshot.version ?? (snapshot.borrador ? 'Borrador' : 'No informada'));
  par('Fecha', snapshot.fecha);
  if (snapshot.vigencia) par('Vigencia', snapshot.vigencia);
  if (snapshot.camposPendientes?.length) linea(`Pendiente: ${snapshot.camposPendientes.join(', ')}`, { color: acento, negrita: true });

  if (snapshot.cliente) {
    titulo(snapshot.tipo === 'B2B' ? 'Cliente empresa' : 'Cliente');
    par('Nombre', snapshot.cliente.nombre);
    if (snapshot.cliente.rut) par('RUT', snapshot.cliente.rut);
    if (snapshot.cliente.correo) par('Correo', snapshot.cliente.correo);
    if (snapshot.cliente.telefono) par('Teléfono', snapshot.cliente.telefono);
  }
  if (snapshot.contactos?.length) {
    titulo('Contactos');
    snapshot.contactos.forEach(contacto => linea(`${contacto.principal ? 'Principal · ' : ''}${contacto.nombre}${contacto.cargo ? ` · ${contacto.cargo}` : ''}${contacto.correo ? ` · ${contacto.correo}` : ''}${contacto.telefono ? ` · ${contacto.telefono}` : ''}`));
  }
  if (snapshot.proyecto) {
    titulo('Proyecto');
    if (snapshot.proyecto.nombre) par('Nombre', snapshot.proyecto.nombre);
    if (snapshot.proyecto.referencia) par('Referencia', snapshot.proyecto.referencia);
    if (snapshot.proyecto.ubicacion) par('Ubicación', snapshot.proyecto.ubicacion);
    if (snapshot.proyecto.alcance) par('Alcance', snapshot.proyecto.alcance);
  }
  if (snapshot.introduccion) { titulo('Presentación'); linea(snapshot.introduccion); }
  tabla(snapshot.tipo === 'CARTA_B2C' ? 'Modelos publicados' : 'Productos cotizados', snapshot.productos);
  tabla('Servicios cotizados', snapshot.servicios ?? []);

  if (snapshot.alternativas?.length) {
    titulo('Alternativas comerciales');
    linea('Las alternativas se presentan por separado y no se suman entre sí. La emisión no constituye aceptación.', { tamano: 8, color: '0.25 0.25 0.25' });
    snapshot.alternativas.forEach(alternativa => {
      const altoAlternativa = 22 + 15 + (alternativa.descripcion ? partir(alternativa.descripcion, 94).length * 15 : 0) + 15
        + (alternativa.caracteristicas?.length ? partir(`Características: ${alternativa.caracteristicas.join(' · ')}`, 94).length * 15 : 0)
        + (alternativa.opcionales?.length ? partir(`Opcionales: ${alternativa.opcionales.join(' · ')}`, 94).length * 15 : 0) + 24;
      asegurar(altoAlternativa);
      linea(`${alternativa.etiqueta} · ${alternativa.producto}`, { negrita: true, tamano: 11 });
      linea(`Identificador: ${alternativa.identificador}`, { sangria: 10, tamano: 8 });
      if (alternativa.descripcion) linea(alternativa.descripcion, { sangria: 10, tamano: 8 });
      linea(alternativa.fotografiaDisponible ? 'Fotografía comercial autorizada incluida en la versión documental.' : 'Fotografía no disponible.', { sangria: 10, tamano: 8 });
      if (alternativa.caracteristicas?.length) linea(`Características: ${alternativa.caracteristicas.join(' · ')}`, { sangria: 10, tamano: 8 });
      if (alternativa.opcionales?.length) linea(`Opcionales: ${alternativa.opcionales.join(' · ')}`, { sangria: 10, tamano: 8 });
      linea(`Neto ${moneda(alternativa.neto, alternativa.moneda)} · IVA ${moneda(alternativa.impuesto, alternativa.moneda)} · Total ${moneda(alternativa.total, alternativa.moneda)}`, { sangria: 10, negrita: true, tamano: 9 });
      y -= 6;
    });
  }

  if (snapshot.tipo !== 'CARTA_B2C' && snapshot.total !== null && snapshot.total !== undefined) {
    titulo('Resumen comercial');
    par('Neto', moneda(snapshot.neto, snapshot.moneda));
    par('IVA', moneda(snapshot.impuesto, snapshot.moneda));
    par('Total', moneda(snapshot.total, snapshot.moneda));
  }
  if (snapshot.condiciones?.length) { titulo('Condiciones comerciales'); snapshot.condiciones.forEach(valor => linea(valor, { sangria: 8 })); }
  if (snapshot.tipo === 'CARTA_B2C') linea('Los precios base no incluyen instalación. Precio y disponibilidad de instalación dependen de región, comuna y cobertura autorizada.', { negrita: true, color: acento });
  if (snapshot.observaciones?.length) { titulo('Observaciones'); snapshot.observaciones.forEach(valor => linea(valor, { sangria: 8 })); }
  if (snapshot.plantilla) linea(`Plantilla: ${snapshot.plantilla.nombre}${snapshot.plantilla.version ? ` · versión ${snapshot.plantilla.version}` : ''}${snapshot.plantilla.publicada ? '' : ' · no publicada'}`, { tamano: 7, color: '0.4 0.4 0.4' });

  const totalPaginas = paginas.length;
  paginas.forEach((contenido, indice) => {
    contenido.push('0.82 0.82 0.82 RG 0.5 w 40 38 m 572 38 l S');
    contenido.push(texto(40, 22, snapshot.borrador ? 'Documento de trabajo sin validez de emisión' : 'Documento comercial versionado', 7, false, '0.4 0.4 0.4'));
    contenido.push(texto(516, 22, `Página ${indice + 1} de ${totalPaginas}`, 7, true, '0.4 0.4 0.4'));
  });
  const pdf = ensamblar(paginas);
  return { pdf, sha256: createHash('sha256').update(pdf).digest('hex'), paginas: totalPaginas };
}
