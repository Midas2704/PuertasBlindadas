import { Prisma, PrismaClient } from '@prisma/client';
import { Readable } from 'node:stream';
import { createHash } from 'node:crypto';
import { prisma } from '../../db';
import { ErrorAplicacion } from '../../utilidades/ErrorAplicacion';
import { cargarConfiguracionStorage } from '../../documental/adaptadores/configuracionStorage';
import { crearStorageAdapterDesdeEntorno } from '../../documental/adaptadores/crearStorageAdapter';
import { crearAntivirusAdapterDesdeEntorno } from '../../documental/seguridad/configuracionSeguridadDocumental';
import { escanearConIntegridad, exigirResultadoLimpio, type AntivirusAdapter } from '../../documental/seguridad/AntivirusAdapter';
import type { StorageAdapter } from '../../documental/StorageAdapter';
import { crearPdfComercial, type LineaDocumentoComercial, type SnapshotDocumentoComercial } from './MotorPdfComercial';

type Json = Record<string, unknown>;
const objeto = (valor: unknown): Json => valor && typeof valor === 'object' && !Array.isArray(valor) ? valor as Json : {};
const cadena = (valor: unknown) => typeof valor === 'string' ? valor.trim() : '';
const numero = (valor: unknown) => valor instanceof Prisma.Decimal ? valor.toNumber() : Number(valor ?? 0);
const listaTexto = (valor: unknown) => Array.isArray(valor) ? valor.map(cadena).filter(Boolean) : [];
const fecha = (valor: Date | null | undefined) => valor ? valor.toISOString().slice(0, 10) : null;
const archivo = (nombre: string, snapshot: SnapshotDocumentoComercial) => {
  const resultado = crearPdfComercial(snapshot);
  return {
    nombre,
    mime: 'application/pdf',
    contenido: `data:application/pdf;base64,${resultado.pdf.toString('base64')}`,
    sha256: resultado.sha256,
    tamanoBytes: resultado.pdf.length,
    paginas: resultado.paginas,
    estado: snapshot.borrador ? 'BORRADOR_NO_EMITIDO' : 'GENERADO_NO_CONFIRMADO',
    snapshot,
  };
};

const textoCondiciones = (contenido: unknown) => {
  const datos = objeto(contenido);
  const candidatos = [datos.texto, datos.forma_pago, datos.plazo_fabricacion, datos.plazo_instalacion, datos.garantia, datos.despacho_entrega, datos.observaciones];
  return candidatos.flatMap(valor => Array.isArray(valor) ? listaTexto(valor) : cadena(valor) ? [cadena(valor)] : []);
};

type ActorComercial = { id: bigint; permisos?: readonly string[] };
type DependenciasDocumentales = {
  cliente?: PrismaClient;
  storage?: StorageAdapter;
  antivirus?: AntivirusAdapter;
  entorno?: NodeJS.ProcessEnv;
  ahora?: () => Date;
};

const json = (valor: unknown): Prisma.InputJsonValue => valor as Prisma.InputJsonValue;
const requerido = (valor: unknown, nombre: string, maximo = 200) => {
  const resultado = cadena(valor);
  if (!resultado || resultado.length > maximo) throw new ErrorAplicacion(400, `${nombre} es obligatorio y admite hasta ${maximo} caracteres`);
  return resultado;
};
const claveIdempotencia = (valor: unknown) => {
  const resultado = requerido(valor, 'Clave de idempotencia', 160);
  if (!/^[A-Za-z0-9._:-]{8,160}$/.test(resultado)) throw new ErrorAplicacion(400, 'Clave de idempotencia inválida');
  return resultado;
};
const claveObjetoIdempotente = (valor: string) => {
  const hash = createHash('sha256').update(valor).digest('hex');
  const uuid = `${hash.slice(0, 8)}-${hash.slice(8, 12)}-4${hash.slice(13, 16)}-8${hash.slice(17, 20)}-${hash.slice(20, 32)}`;
  return `objects/${uuid}`;
};
const exigirRevision = (valor: unknown) => {
  const resultado = Number(valor);
  if (!Number.isInteger(resultado) || resultado < 1) throw new ErrorAplicacion(400, 'La revisión optimista es obligatoria');
  return resultado;
};
const contenidoSeguro = (valor: unknown) => {
  const resultado = objeto(valor);
  const serializado = JSON.stringify(resultado);
  if (serializado.length > 100_000) throw new ErrorAplicacion(413, 'El contenido documental excede el límite permitido');
  if (/<\/?(?:script|iframe|object|embed|style)\b|on\w+\s*=|javascript:/i.test(serializado)) {
    throw new ErrorAplicacion(400, 'El contenido documental contiene código no autorizado');
  }
  return resultado;
};
const leerCompleto = async (stream: Readable, maximo = 25 * 1024 * 1024) => {
  const partes: Buffer[] = []; let total = 0;
  for await (const parte of stream) {
    const bloque = Buffer.isBuffer(parte) ? parte : Buffer.from(parte);
    total += bloque.length;
    if (total > maximo) throw new ErrorAplicacion(413, 'El documento excede el límite de recuperación');
    partes.push(bloque);
  }
  return Buffer.concat(partes);
};

export class ServicioDocumentosComerciales {
  private readonly cliente: PrismaClient;
  private readonly entorno: NodeJS.ProcessEnv;
  private readonly ahora: () => Date;
  constructor(private readonly dependencias: DependenciasDocumentales = {}) {
    this.cliente = dependencias.cliente ?? prisma;
    this.entorno = dependencias.entorno ?? process.env;
    this.ahora = dependencias.ahora ?? (() => new Date());
  }

  private storage() { return this.dependencias.storage ?? crearStorageAdapterDesdeEntorno(this.entorno); }
  private antivirus() { return this.dependencias.antivirus ?? crearAntivirusAdapterDesdeEntorno(this.entorno); }
  private configuracionStorage() { return cargarConfiguracionStorage(this.entorno); }
  async estadoInfraestructura() {
    let almacenamientoPrivado = 'NO_CONFIGURADO';
    if (this.entorno.STORAGE_PROVIDER || this.entorno.STORAGE_BUCKET) {
      try { cargarConfiguracionStorage(this.entorno); almacenamientoPrivado = 'CONFIGURADO'; }
      catch { almacenamientoPrivado = 'CONFIGURACION_INVALIDA'; }
    }
    let antivirus = 'NO_CONFIGURADO';
    try {
      const adaptador = this.antivirus();
      const disponibilidad = adaptador.comprobarDisponibilidad
        ? await adaptador.comprobarDisponibilidad()
        : { disponible: false, codigo: 'DIAGNOSTICO_NO_SOPORTADO' };
      antivirus = disponibilidad.disponible ? 'CLAMAV_VALIDADO' : disponibilidad.codigo ?? 'NO_DISPONIBLE';
    } catch { antivirus = 'CONFIGURACION_INVALIDA'; }
    const storageValidado = almacenamientoPrivado === 'CONFIGURADO';
    const antivirusValidado = antivirus === 'CLAMAV_VALIDADO';
    return {
      motorPdf: 'DISPONIBLE',
      almacenamientoPrivado,
      antivirus,
      emisionDefinitiva: storageValidado && antivirusValidado ? 'HABILITADA_CON_CONFIRMACION_BACKEND' : 'BLOQUEADA',
      motivo: storageValidado && antivirusValidado ? 'Cada publicación valida antivirus, almacenamiento, recuperación y SHA-256 antes de confirmar.' : 'La emisión exige storage privado configurado y antivirus disponible.',
    };
  }

  async listarPlantillas() {
    const plantillas = await this.cliente.plantilla_documental_comercial.findMany({
      orderBy: [{ segmento: 'asc' }, { codigo: 'asc' }],
      include: { versiones: { orderBy: { numero_version: 'desc' }, include: { condicion: true } } },
    });
    return {
      capacidadEdicion: 'CU378',
      capacidadPublicacion: 'CU379',
      plantillas: plantillas.map(plantilla => ({
        id: plantilla.id_plantilla_documental.toString(), codigo: plantilla.codigo, nombre: plantilla.nombre,
        tipo: plantilla.tipo_documento, segmento: plantilla.segmento, estado: plantilla.estado, revision: plantilla.revision,
        versiones: plantilla.versiones.map(version => ({
          id: version.id_plantilla_documental_version.toString(), numero: version.numero_version, estado: version.estado,
          esquema: version.esquema_contenido, condicionVersionId: version.id_condicion_comercial_version?.toString() ?? null,
          motivo: version.motivo, publicadoEn: version.publicado_en?.toISOString() ?? null,
        })),
      })),
    };
  }

  async listarCartasB2C() {
    const cartas = await this.cliente.carta_comercial_b2c.findMany({
      orderBy: { actualizado_en: 'desc' },
      include: { versiones: { orderBy: { numero_version: 'desc' }, include: { plantilla: true, productos: true, fotografias: true } } },
    });
    return {
      capacidadEdicion: 'CU380',
      capacidadPublicacion: 'CU381',
      cartas: cartas.map(carta => ({
        id: carta.id_carta_comercial_b2c.toString(), codigo: carta.codigo, titulo: carta.titulo,
        contenidoBorrador: carta.contenido_borrador, estado: carta.estado, revision: carta.revision,
        actualizadoEn: carta.actualizado_en.toISOString(),
        versiones: carta.versiones.map(version => ({
          id: version.id_carta_comercial_b2c_version.toString(), numero: version.numero_version,
          estadoDocumental: version.estado_documental, documentoId: version.id_documento_logico?.toString() ?? null,
          creadoEn: version.creado_en.toISOString(), confirmadoEn: version.confirmado_en?.toISOString() ?? null,
          productos: version.productos.length, fotografias: version.fotografias.length,
          plantillaVersion: version.plantilla.numero_version,
        })),
      })),
    };
  }

  async previsualizarCotizacion(idCotizacion: number) {
    const snapshot = await this.snapshotCotizacion(idCotizacion, true);
    return archivo(`cotizacion-${idCotizacion}-borrador.pdf`, snapshot);
  }

  async previsualizarCartaB2C(idCarta: bigint) {
    const carta = await this.cliente.carta_comercial_b2c.findUnique({ where: { id_carta_comercial_b2c: idCarta } });
    if (!carta) throw new ErrorAplicacion(404, 'Carta comercial B2C no encontrada');
    const contenido = objeto(carta.contenido_borrador);
    const modelos = Array.isArray(contenido.modelos) ? contenido.modelos.map(objeto) : [];
    const snapshot: SnapshotDocumentoComercial = {
      tipo: 'CARTA_B2C', titulo: carta.titulo, numero: carta.codigo, fecha: fecha(carta.actualizado_en)!, borrador: true,
      camposPendientes: modelos.length ? [] : ['modelos autorizados'], moneda: cadena(contenido.moneda) || 'CLP', cliente: null,
      introduccion: cadena(contenido.presentacion) || 'Presentación comercial pendiente de completar en el mantenedor autorizado.',
      productos: modelos.map((modelo): LineaDocumentoComercial => ({
        codigo: cadena(modelo.codigo) || null, nombre: cadena(modelo.nombre) || 'Modelo sin nombre',
        descripcion: cadena(modelo.descripcion) || null, cantidad: 1,
        precioUnitario: Number.isFinite(Number(modelo.precio)) ? Number(modelo.precio) : null,
        subtotal: Number.isFinite(Number(modelo.precio)) ? Number(modelo.precio) : null,
        caracteristicas: listaTexto(modelo.caracteristicas), opcionales: listaTexto(modelo.opcionales),
      })),
      condiciones: listaTexto(contenido.condiciones), observaciones: [],
      plantilla: { nombre: 'Borrador de carta general B2C', publicada: false },
    };
    return archivo(`carta-b2c-${carta.codigo}-borrador.pdf`, snapshot);
  }

  async crearPlantilla(entrada: Json, actor: ActorComercial) {
    const codigo = requerido(entrada.codigo, 'Código', 60).toUpperCase();
    const nombre = requerido(entrada.nombre, 'Nombre');
    const segmento = requerido(entrada.segmento, 'Segmento', 20).toUpperCase();
    const tipo = segmento === 'CARTA_B2C' ? 'CARTA_GENERAL' : 'COTIZACION';
    if (!['B2B', 'B2C', 'CARTA_B2C'].includes(segmento)) throw new ErrorAplicacion(400, 'Segmento documental inválido');
    const esquema = contenidoSeguro(entrada.esquema);
    const motivo = requerido(entrada.motivo, 'Motivo', 2000);
    return this.cliente.$transaction(async tx => tx.plantilla_documental_comercial.create({
      data: { codigo, nombre, segmento, tipo_documento: tipo, creado_por: actor.id,
        versiones: { create: { numero_version: 1, esquema_contenido: json(esquema), motivo,
          id_condicion_comercial_version: entrada.idCondicionVersion ? BigInt(String(entrada.idCondicionVersion)) : null } } },
      include: { versiones: true },
    }), { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }

  async editarPlantilla(id: bigint, entrada: Json, actor: ActorComercial) {
    const revision = exigirRevision(entrada.revision);
    const esquema = contenidoSeguro(entrada.esquema);
    const motivo = requerido(entrada.motivo, 'Motivo', 2000);
    return this.cliente.$transaction(async tx => {
      const plantilla = await tx.plantilla_documental_comercial.findUnique({ where: { id_plantilla_documental: id }, include: { versiones: { orderBy: { numero_version: 'desc' }, take: 1 } } });
      if (!plantilla) throw new ErrorAplicacion(404, 'Plantilla documental no encontrada');
      if (plantilla.revision !== revision) throw new ErrorAplicacion(409, 'La plantilla fue modificada por otra sesión', 'REVISION_DESACTUALIZADA');
      const ultima = plantilla.versiones[0];
      if (ultima?.estado === 'BORRADOR') {
        await tx.plantilla_documental_version.update({ where: { id_plantilla_documental_version: ultima.id_plantilla_documental_version }, data: {
          esquema_contenido: json(esquema), motivo,
          id_condicion_comercial_version: entrada.idCondicionVersion ? BigInt(String(entrada.idCondicionVersion)) : null,
        } });
      } else {
        await tx.plantilla_documental_version.create({ data: { id_plantilla_documental: id,
          numero_version: (ultima?.numero_version ?? 0) + 1, esquema_contenido: json(esquema), motivo,
          id_condicion_comercial_version: entrada.idCondicionVersion ? BigInt(String(entrada.idCondicionVersion)) : null } });
      }
      const cambio = await tx.plantilla_documental_comercial.updateMany({ where: { id_plantilla_documental: id, revision }, data: {
        nombre: entrada.nombre ? requerido(entrada.nombre, 'Nombre') : plantilla.nombre, revision: { increment: 1 }, actualizado_en: this.ahora(),
      } });
      if (cambio.count !== 1) throw new ErrorAplicacion(409, 'La plantilla fue modificada por otra sesión', 'REVISION_DESACTUALIZADA');
      return tx.plantilla_documental_comercial.findUniqueOrThrow({ where: { id_plantilla_documental: id }, include: { versiones: { orderBy: { numero_version: 'desc' } } } });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }

  async publicarPlantilla(id: bigint, entrada: Json, actor: ActorComercial) {
    const revision = exigirRevision(entrada.revision);
    return this.cliente.$transaction(async tx => {
      const plantilla = await tx.plantilla_documental_comercial.findUnique({ where: { id_plantilla_documental: id }, include: { versiones: { orderBy: { numero_version: 'desc' }, take: 1 } } });
      if (!plantilla) throw new ErrorAplicacion(404, 'Plantilla documental no encontrada');
      const version = plantilla.versiones[0];
      if (!version) throw new ErrorAplicacion(409, 'La plantilla no posee contenido publicable');
      if (version.estado === 'PUBLICADA') return version;
      if (plantilla.revision !== revision || version.estado !== 'BORRADOR') throw new ErrorAplicacion(409, 'La plantilla cambió o no está en borrador', 'REVISION_DESACTUALIZADA');
      const esquema = objeto(version.esquema_contenido);
      if (!cadena(esquema.titulo) || !Array.isArray(esquema.secciones) || !esquema.secciones.length) throw new ErrorAplicacion(409, 'La plantilla requiere título y secciones antes de publicarse');
      await tx.plantilla_documental_version.update({ where: { id_plantilla_documental_version: version.id_plantilla_documental_version }, data: { estado: 'PUBLICADA', publicado_por: actor.id, publicado_en: this.ahora() } });
      await tx.plantilla_documental_comercial.update({ where: { id_plantilla_documental: id }, data: { revision: { increment: 1 }, actualizado_en: this.ahora() } });
      return tx.plantilla_documental_version.findUniqueOrThrow({ where: { id_plantilla_documental_version: version.id_plantilla_documental_version } });
    }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
  }

  async crearCartaB2C(entrada: Json, actor: ActorComercial) {
    return this.cliente.carta_comercial_b2c.create({ data: {
      codigo: requerido(entrada.codigo, 'Código', 60).toUpperCase(), titulo: requerido(entrada.titulo, 'Título'),
      contenido_borrador: json(contenidoSeguro(entrada.contenido)), creado_por: actor.id,
    } });
  }

  async editarCartaB2C(id: bigint, entrada: Json, _actor: ActorComercial) {
    const revision = exigirRevision(entrada.revision);
    const actual = await this.cliente.carta_comercial_b2c.findUnique({ where: { id_carta_comercial_b2c: id } });
    if (!actual) throw new ErrorAplicacion(404, 'Carta comercial B2C no encontrada');
    const cambio = await this.cliente.carta_comercial_b2c.updateMany({ where: { id_carta_comercial_b2c: id, revision }, data: {
      titulo: entrada.titulo ? requerido(entrada.titulo, 'Título') : actual.titulo,
      contenido_borrador: json(contenidoSeguro(entrada.contenido)), estado: 'BORRADOR', revision: { increment: 1 }, actualizado_en: this.ahora(),
    } });
    if (cambio.count !== 1) throw new ErrorAplicacion(409, 'La carta fue modificada por otra sesión', 'REVISION_DESACTUALIZADA');
    return this.cliente.carta_comercial_b2c.findUniqueOrThrow({ where: { id_carta_comercial_b2c: id } });
  }

  private async almacenarPdf(pdf: Buffer, clave: string, idempotencia: string) {
    if (pdf.length > 20 * 1024 * 1024 || pdf.subarray(0, 5).toString('ascii') !== '%PDF-') throw new ErrorAplicacion(400, 'El archivo generado no es un PDF válido');
    const esperado = createHash('sha256').update(pdf).digest('hex');
    const escaneo = await escanearConIntegridad(this.antivirus(), Readable.from(pdf));
    exigirResultadoLimpio(escaneo.resultado);
    if (!escaneo.completo || escaneo.sha256 !== esperado || escaneo.tamanoBytes !== BigInt(pdf.length)) throw new ErrorAplicacion(409, 'La integridad previa al almacenamiento no coincide');
    const storage = this.storage(); const configuracion = this.configuracionStorage();
    if (!storage.crearObjetoExclusivo || !storage.abrirLectura) throw new ErrorAplicacion(503, 'El storage no soporta escritura exclusiva y recuperación');
    const referencia = { contenedor: configuracion.bucket, clave };
    try {
      await storage.crearObjetoExclusivo({ referencia, contenido: Readable.from(pdf), mime: 'application/pdf', tamanoEsperado: BigInt(pdf.length), claveIdempotencia: idempotencia, sha256: esperado });
    } catch (error) {
      const codigo = objeto(error).codigo;
      if (!['OBJETO_EXISTENTE', 'CONFLICTO'].includes(String(codigo))) throw error;
    }
    const metadata = await storage.consultarObjeto(referencia);
    const recuperado = await leerCompleto(await storage.abrirLectura(referencia));
    const hashRecuperado = createHash('sha256').update(recuperado).digest('hex');
    if (recuperado.length !== pdf.length || hashRecuperado !== esperado || metadata.tamanoBytes !== BigInt(pdf.length)) throw new ErrorAplicacion(409, 'El PDF almacenado no supera la verificación de integridad');
    return { referencia, sha256: esperado, tamano: BigInt(pdf.length), proveedor: storage.proveedor, versionProveedor: metadata.versionProveedor ?? null };
  }

  private async limpiarObjetoNoConfirmado(referencia: { contenedor: string; clave: string; versionProveedor?: string }) {
    try {
      const storage = this.storage();
      if (storage.eliminarVersionPermitida) await storage.eliminarVersionPermitida(referencia);
    } catch {
      // La reconciliación documental identificará cualquier objeto temporal que no pudo compensarse.
    }
  }

  async publicarCartaB2C(idCarta: bigint, entrada: Json, actor: ActorComercial) {
    const revision = exigirRevision(entrada.revision);
    const idempotencia = claveIdempotencia(entrada.claveIdempotencia);
    const existente = await this.cliente.carta_comercial_b2c_version.findUnique({ where: { clave_idempotencia: idempotencia }, include: { documento: { include: { versiones: true } } } });
    if (existente) {
      if (existente.id_carta_comercial_b2c !== idCarta) throw new ErrorAplicacion(409, 'La clave de idempotencia pertenece a otra publicación');
      return existente;
    }
    const carta = await this.cliente.carta_comercial_b2c.findUnique({ where: { id_carta_comercial_b2c: idCarta } });
    if (!carta) throw new ErrorAplicacion(404, 'Carta comercial B2C no encontrada');
    if (carta.revision !== revision) throw new ErrorAplicacion(409, 'La carta fue modificada por otra sesión', 'REVISION_DESACTUALIZADA');
    const contenido = objeto(carta.contenido_borrador);
    const modelosEntrada = Array.isArray(contenido.modelos) ? contenido.modelos.map(objeto) : [];
    if (!modelosEntrada.length) throw new ErrorAplicacion(409, 'La carta requiere al menos un modelo comercial');
    const idPlantilla = BigInt(String(entrada.idPlantillaVersion || '0'));
    const plantilla = await this.cliente.plantilla_documental_version.findFirst({ where: { id_plantilla_documental_version: idPlantilla, estado: 'PUBLICADA', plantilla: { segmento: 'CARTA_B2C', estado: 'ACTIVA' } }, include: { plantilla: true, condicion: true } });
    if (!plantilla) throw new ErrorAplicacion(409, 'La carta requiere una plantilla CARTA_B2C publicada');
    if (!plantilla.condicion || plantilla.condicion.estado !== 'PUBLICADA') throw new ErrorAplicacion(409, 'La carta requiere condiciones comerciales publicadas');
    const idsVersion = modelosEntrada.map(modelo => Number(modelo.idProductoVersion));
    const idsPrecio = modelosEntrada.map(modelo => BigInt(String(modelo.idPrecio || '0')));
    if (idsVersion.some(id => !Number.isInteger(id) || id < 1) || idsPrecio.some(id => id < 1n)) throw new ErrorAplicacion(400, 'Cada modelo debe indicar producto y precio versionados');
    const [productos, precios] = await Promise.all([
      this.cliente.producto_comercial_version.findMany({ where: { id_producto_comercial_version: { in: idsVersion }, producto: { estado: 'VINCULADO' } } }),
      this.cliente.precio_producto_comercial.findMany({ where: { id_precio_producto_comercial: { in: idsPrecio }, segmento_comercial: 'B2C', estado: 'ACTIVO', vigencia_desde: { lte: this.ahora() }, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: this.ahora() } }] }, include: { moneda: true } }),
    ]);
    if (productos.length !== idsVersion.length || precios.length !== idsPrecio.length) throw new ErrorAplicacion(409, 'Uno o más modelos o precios B2C no están vigentes');
    const porProducto = new Map(productos.map(p => [p.id_producto_comercial_version, p]));
    const porPrecio = new Map(precios.map(p => [p.id_precio_producto_comercial.toString(), p]));
    const lineas = modelosEntrada.map((modelo, indice) => {
      const producto = porProducto.get(Number(modelo.idProductoVersion))!;
      const precio = porPrecio.get(String(modelo.idPrecio))!;
      if (precio.id_extension_producto_comercial !== producto.id_extension_producto_comercial) throw new ErrorAplicacion(409, 'El precio no corresponde al producto seleccionado');
      return { producto, precio, orden: indice, snapshot: { codigo: producto.codigo_comercial, nombre: producto.nombre_comercial,
        descripcion: producto.descripcion_b2c, caracteristicas: listaTexto(producto.caracteristicas_destacadas),
        precio: numero(precio.monto), moneda: precio.moneda.codigo_moneda, instalacionIncluida: false } };
    });
    const monedas = new Set(lineas.map(x => x.precio.moneda.codigo_moneda));
    if (monedas.size !== 1) throw new ErrorAplicacion(409, 'La carta debe publicar modelos en una sola moneda');
    const snapshot: SnapshotDocumentoComercial = {
      tipo: 'CARTA_B2C', titulo: carta.titulo, numero: carta.codigo, fecha: fecha(this.ahora())!, borrador: false,
      moneda: [...monedas][0]!, cliente: null, introduccion: requerido(contenido.presentacion, 'Presentación', 5000),
      productos: lineas.map(x => ({ codigo: x.producto.codigo_comercial, nombre: x.producto.nombre_comercial,
        descripcion: x.producto.descripcion_b2c, cantidad: 1, precioUnitario: numero(x.precio.monto), subtotal: numero(x.precio.monto),
        caracteristicas: listaTexto(x.producto.caracteristicas_destacadas), opcionales: [] })),
      condiciones: listaTexto(contenido.condiciones), observaciones: ['Los precios base no incluyen instalación. La instalación depende de región, comuna y cobertura autorizada.'],
      plantilla: { id: plantilla.id_plantilla_documental_version.toString(), version: plantilla.numero_version, nombre: plantilla.plantilla.nombre, publicada: true },
    };
    const generado = crearPdfComercial(snapshot);
    const clave = claveObjetoIdempotente(`carta:${idCarta}:${idempotencia}`);
    const guardado = await this.almacenarPdf(generado.pdf, clave, idempotencia);
    try {
      return await this.cliente.$transaction(async tx => {
        const repetida = await tx.carta_comercial_b2c_version.findUnique({ where: { clave_idempotencia: idempotencia } });
        if (repetida) return repetida;
        const bloqueada = await tx.carta_comercial_b2c.updateMany({ where: { id_carta_comercial_b2c: idCarta, revision }, data: { estado: 'PUBLICADA', revision: { increment: 1 }, actualizado_en: this.ahora() } });
        if (bloqueada.count !== 1) throw new ErrorAplicacion(409, 'La carta fue modificada durante la publicación', 'REVISION_DESACTUALIZADA');
        const ultimo = await tx.carta_comercial_b2c_version.aggregate({ where: { id_carta_comercial_b2c: idCarta }, _max: { numero_version: true } });
        const documento = await tx.documento_logico.create({ data: { titulo: `${carta.titulo} v${(ultimo._max.numero_version ?? 0) + 1}`, clasificacion: 'COMERCIAL', es_historico: true, numero_version_actual: 1, creado_por: actor.id } });
        const versionDocumento = await tx.version_documento.create({ data: { id_documento_logico: documento.id_documento_logico, numero_version: 1,
          proveedor_logico: guardado.proveedor, contenedor_logico: guardado.referencia.contenedor, clave_objeto: guardado.referencia.clave,
          version_proveedor: guardado.versionProveedor, nombre_original: `${carta.codigo}.pdf`, nombre_seguro: `${carta.codigo}.pdf`,
          mime_declarado: 'application/pdf', mime_detectado: 'application/pdf', tamano_bytes: guardado.tamano, sha256: guardado.sha256,
          estado: 'DISPONIBLE', creado_por: actor.id, validado_en: this.ahora(), resultado_validaciones: json({ antivirus: 'LIMPIO', integridad: 'SHA256_VERIFICADO', origen: 'GENERADO_INTERNO' }) } });
        const versionCartaPendiente = await tx.carta_comercial_b2c_version.create({ data: { id_carta_comercial_b2c: idCarta,
          numero_version: (ultimo._max.numero_version ?? 0) + 1, id_plantilla_documental_version: plantilla.id_plantilla_documental_version,
          id_condicion_comercial_version: plantilla.id_condicion_comercial_version, snapshot_publicacion: json(snapshot),
          id_documento_logico: documento.id_documento_logico, estado_documental: 'PENDIENTE_DOCUMENTO', clave_idempotencia: idempotencia,
          motivo: requerido(entrada.motivo, 'Motivo', 2000), publicado_por: actor.id,
          productos: { create: lineas.map(x => ({ id_producto_comercial_version: x.producto.id_producto_comercial_version,
            id_precio_producto_comercial: x.precio.id_precio_producto_comercial, orden_presentacion: x.orden, snapshot_producto: json(x.snapshot) })) } } });
        const versionCarta = await tx.carta_comercial_b2c_version.update({
          where: { id_carta_comercial_b2c_version: versionCartaPendiente.id_carta_comercial_b2c_version },
          data: { estado_documental: 'DISPONIBLE', confirmado_en: this.ahora() },
        });
        await tx.evento_operacional_documental.create({ data: { tipo_evento: 'CARTA_B2C_PUBLICADA', id_documento_logico: documento.id_documento_logico,
          id_version_documento: versionDocumento.id_version_documento, clave_idempotencia: `carta:${versionCarta.id_carta_comercial_b2c_version}:publicada`,
          payload_tecnico: json({ idCarta: idCarta.toString(), sha256: guardado.sha256 }) } });
        return versionCarta;
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, timeout: 30000 });
    } catch (error) {
      const recuperada = await this.cliente.carta_comercial_b2c_version.findUnique({ where: { clave_idempotencia: idempotencia } });
      if (recuperada) return recuperada;
      await this.limpiarObjetoNoConfirmado({ ...guardado.referencia, versionProveedor: guardado.versionProveedor ?? undefined });
      throw error;
    }
  }

  async emitirCotizacion(idCotizacion: number, entrada: Json, actor: ActorComercial) {
    const idempotencia = claveIdempotencia(entrada.claveIdempotencia);
    const revision = exigirRevision(entrada.revision);
    const existente = await this.cliente.cotizacion_version.findUnique({ where: { clave_idempotencia: idempotencia } });
    if (existente) {
      if (existente.id_cotizacion !== idCotizacion) throw new ErrorAplicacion(409, 'La clave de idempotencia pertenece a otra cotización');
      return existente;
    }
    const snapshot = await this.snapshotCotizacion(idCotizacion, false);
    if (snapshot.camposPendientes?.length) throw new ErrorAplicacion(409, `La cotización no puede emitirse: falta ${snapshot.camposPendientes.join(', ')}`);
    if (!snapshot.plantilla?.publicada) throw new ErrorAplicacion(409, 'La emisión requiere una plantilla documental publicada');
    const cotizacion = await this.cliente.cotizacion.findUnique({ where: { id_cotizacion: idCotizacion }, include:{nota_venta:true,orden_compra_b2b:true} });
    const ofertaSucesivaB2B=cotizacion?.segmento_comercial==='B2B'&&cotizacion.estado_cotizacion==='emitida'&&!cotizacion.nota_venta&&!cotizacion.orden_compra_b2b;
    if (!cotizacion || (cotizacion.estado_cotizacion !== 'borrador' && !ofertaSucesivaB2B)) throw new ErrorAplicacion(409, 'Sólo se puede emitir un borrador o una nueva oferta B2B aún no aceptada');
    if (cotizacion.revision !== revision) throw new ErrorAplicacion(409, 'La cotización fue modificada por otra sesión', 'REVISION_DESACTUALIZADA');
    const generado = crearPdfComercial({ ...snapshot, borrador: false });
    const clave = claveObjetoIdempotente(`cotizacion:${idCotizacion}:${idempotencia}`);
    const guardado = await this.almacenarPdf(generado.pdf, clave, idempotencia);
    try {
      return await this.cliente.$transaction(async tx => {
        const repetida = await tx.cotizacion_version.findUnique({ where: { clave_idempotencia: idempotencia } });
        if (repetida) return repetida;
        const actual = await tx.cotizacion.findUnique({ where: { id_cotizacion: idCotizacion } });
        const estadoAdmitido=actual?.estado_cotizacion==='borrador'||(ofertaSucesivaB2B&&actual?.estado_cotizacion==='emitida');
        if (!actual || !estadoAdmitido || actual.revision !== revision) throw new ErrorAplicacion(409, 'La cotización cambió durante la emisión', 'REVISION_DESACTUALIZADA');
        const ultimo = await tx.cotizacion_version.aggregate({ where: { id_cotizacion: idCotizacion }, _max: { numero_version_comercial: true } });
        const numeroVersion = (ultimo._max.numero_version_comercial ?? 0) + 1;
        const documento = await tx.documento_logico.create({ data: { titulo: `Cotización ${idCotizacion} v${numeroVersion}`, clasificacion: 'COMERCIAL', es_historico: true, numero_version_actual: 1, creado_por: actor.id } });
        const versionDocumento = await tx.version_documento.create({ data: { id_documento_logico: documento.id_documento_logico, numero_version: 1,
          proveedor_logico: guardado.proveedor, contenedor_logico: guardado.referencia.contenedor, clave_objeto: guardado.referencia.clave,
          version_proveedor: guardado.versionProveedor, nombre_original: `cotizacion-${idCotizacion}.pdf`, nombre_seguro: `cotizacion-${idCotizacion}.pdf`,
          mime_declarado: 'application/pdf', mime_detectado: 'application/pdf', tamano_bytes: guardado.tamano, sha256: guardado.sha256,
          estado: 'DISPONIBLE', creado_por: actor.id, validado_en: this.ahora(), resultado_validaciones: json({ antivirus: 'LIMPIO', integridad: 'SHA256_VERIFICADO', origen: 'GENERADO_INTERNO' }) } });
        const version = await tx.cotizacion_version.create({ data: { id_cotizacion: idCotizacion, antecedentes: json(snapshot), motivo: requerido(entrada.motivo, 'Motivo', 2000),
          numero_version_comercial: numeroVersion, tipo_version: 'EMISION', snapshot_comercial: json(snapshot), id_documento_logico: documento.id_documento_logico,
          estado_documental: 'DISPONIBLE', usuario_id_usuario: actor.id, clave_idempotencia: idempotencia } });
        const cambio = await tx.cotizacion.updateMany({ where: { id_cotizacion: idCotizacion, revision, estado_cotizacion:cotizacion.estado_cotizacion }, data: { estado_cotizacion: 'emitida', revision: { increment: 1 } } });
        if (cambio.count !== 1) throw new ErrorAplicacion(409, 'La cotización cambió durante la emisión', 'REVISION_DESACTUALIZADA');
        await tx.evento_operacional_documental.create({ data: { tipo_evento: 'COTIZACION_PDF_CONFIRMADO', id_documento_logico: documento.id_documento_logico,
          id_version_documento: versionDocumento.id_version_documento, clave_idempotencia: `cotizacion:${version.id_cotizacion_version}:emitida`,
          payload_tecnico: json({ idCotizacion, sha256: guardado.sha256, numeroVersion }) } });
        return version;
      }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable, timeout: 30000 });
    } catch (error) {
      const recuperada = await this.cliente.cotizacion_version.findUnique({ where: { clave_idempotencia: idempotencia } });
      if (recuperada) return recuperada;
      await this.limpiarObjetoNoConfirmado({ ...guardado.referencia, versionProveedor: guardado.versionProveedor ?? undefined });
      throw error;
    }
  }

  async prepararEmisionCotizacion(idCotizacion: number) {
    const snapshot = await this.snapshotCotizacion(idCotizacion, false);
    if (snapshot.camposPendientes?.length) throw new ErrorAplicacion(409, `La cotización no puede emitirse: falta ${snapshot.camposPendientes.join(', ')}`);
    throw new ErrorAplicacion(409, 'La emisión definitiva requiere revisión, motivo y clave de idempotencia', 'DATOS_EMISION_REQUERIDOS');
  }

  async historialCotizacion(idCotizacion: number) {
    const versiones = await this.cliente.cotizacion_version.findMany({
      where: { id_cotizacion: idCotizacion },
      orderBy: { numero_version_comercial: 'desc' },
      select: {
        id_cotizacion_version: true,
        numero_version_comercial: true,
        fecha: true,
        estado_documental: true,
        documento: {
          select: {
            estado: true,
            versiones: {
              orderBy: { numero_version: 'desc' },
              take: 1,
              select: {
                numero_version: true,
                estado: true,
                nombre_seguro: true,
                mime_detectado: true,
                tamano_bytes: true,
                sha256: true,
                creado_en: true,
                validado_en: true,
              },
            },
          },
        },
      },
    });
    return versiones.map(version => {
      const archivo = version.documento?.versiones[0];
      return {
        idVersion: version.id_cotizacion_version,
        numeroVersion: version.numero_version_comercial,
        fechaEmision: version.fecha,
        estadoDocumental: version.estado_documental,
        documento: version.documento ? {
          estado: version.documento.estado,
          archivo: archivo ? {
            numeroVersion: archivo.numero_version,
            estado: archivo.estado,
            nombre: archivo.nombre_seguro,
            mime: archivo.mime_detectado,
            tamanoBytes: archivo.tamano_bytes,
            sha256: archivo.sha256,
            creadoEn: archivo.creado_en,
            validadoEn: archivo.validado_en,
          } : null,
        } : null,
      };
    });
  }

  async recuperarDocumentoCarta(idCarta: bigint, idVersion: bigint) {
    const publicacion = await this.cliente.carta_comercial_b2c_version.findFirst({ where: { id_carta_comercial_b2c_version: idVersion, id_carta_comercial_b2c: idCarta, estado_documental: 'DISPONIBLE' },
      include: { documento: { include: { versiones: { where: { estado: 'DISPONIBLE' }, orderBy: { numero_version: 'desc' }, take: 1 } } } } });
    const version = publicacion?.documento?.versiones[0];
    if (!publicacion || !version || !version.sha256) throw new ErrorAplicacion(404, 'Publicación histórica confirmada no encontrada');
    const storage = this.storage(); if (!storage.abrirLectura) throw new ErrorAplicacion(503, 'El storage no permite recuperar documentos');
    const contenido = await leerCompleto(await storage.abrirLectura({ contenedor: version.contenedor_logico, clave: version.clave_objeto, versionProveedor: version.version_proveedor ?? undefined }));
    const sha256 = createHash('sha256').update(contenido).digest('hex');
    if (sha256 !== version.sha256 || BigInt(contenido.length) !== version.tamano_bytes) throw new ErrorAplicacion(409, 'La carta histórica no supera la verificación SHA-256');
    return { nombre: version.nombre_seguro, mime: version.mime_detectado, contenido: `data:application/pdf;base64,${contenido.toString('base64')}`,
      sha256, tamanoBytes: contenido.length, numeroVersion: publicacion.numero_version, fecha: publicacion.creado_en.toISOString() };
  }

  async recuperarDocumentoCotizacion(idCotizacion: number, idVersion: number) {
    const comercial = await this.cliente.cotizacion_version.findFirst({ where: { id_cotizacion_version: idVersion, id_cotizacion: idCotizacion, estado_documental: 'DISPONIBLE' },
      include: { documento: { include: { versiones: { where: { estado: 'DISPONIBLE' }, orderBy: { numero_version: 'desc' }, take: 1 } } } } });
    const version = comercial?.documento?.versiones[0];
    if (!comercial || !version || !version.sha256) throw new ErrorAplicacion(404, 'Documento histórico confirmado no encontrado');
    const storage = this.storage();
    if (!storage.abrirLectura) throw new ErrorAplicacion(503, 'El storage no permite recuperar documentos');
    const contenido = await leerCompleto(await storage.abrirLectura({ contenedor: version.contenedor_logico, clave: version.clave_objeto, versionProveedor: version.version_proveedor ?? undefined }));
    const sha256 = createHash('sha256').update(contenido).digest('hex');
    if (sha256 !== version.sha256 || BigInt(contenido.length) !== version.tamano_bytes) throw new ErrorAplicacion(409, 'El PDF histórico no supera la verificación SHA-256');
    return { nombre: version.nombre_seguro, mime: version.mime_detectado, contenido: `data:application/pdf;base64,${contenido.toString('base64')}`,
      sha256, tamanoBytes: contenido.length, numeroVersion: comercial.numero_version_comercial, fecha: comercial.fecha.toISOString() };
  }

  private async snapshotCotizacion(idCotizacion: number, borrador: boolean): Promise<SnapshotDocumentoComercial> {
    const cotizacion = await this.cliente.cotizacion.findUnique({
      where: { id_cotizacion: idCotizacion },
      include: {
        moneda: true,
        ficha_cliente: { include: { cliente_financiero: true } },
        contactos_b2b: { where: { estado: 'ACTIVO' }, orderBy: [{ es_principal: 'desc' }, { creado_en: 'asc' }] },
        detalle_cotizacion: { include: { item_comercial: true, producto_version: true } },
        detalles_servicio: { include: { servicio: true } },
        condicion_comercial: { include: { condicion: true } },
        grupos_alternativas_b2c: { include: { alternativas: { include: { producto_version: true, moneda: true, opcionales: true } } } },
      },
    });
    if (!cotizacion) throw new ErrorAplicacion(404, 'Cotización no encontrada');
    if (!['B2B', 'B2C'].includes(cotizacion.segmento_comercial || '')) throw new ErrorAplicacion(409, 'La cotización no posee un segmento documental válido');
    const segmento = cotizacion.segmento_comercial as 'B2B' | 'B2C';
    const plantilla = await this.cliente.plantilla_documental_version.findFirst({
      where: { estado: 'PUBLICADA', plantilla: { segmento, tipo_documento: 'COTIZACION', estado: 'ACTIVA' } },
      orderBy: { numero_version: 'desc' }, include: { plantilla: true },
    });
    const pendientes: string[] = [];
    if (!cotizacion.fecha_vigencia) pendientes.push('vigencia');
    if (!cotizacion.detalle_cotizacion.length) pendientes.push('productos');
    if (segmento === 'B2B' && cotizacion.contactos_b2b.filter(contacto => contacto.es_principal).length !== 1) pendientes.push('contacto principal B2B');
    if (!cotizacion.id_condicion_comercial_version || cotizacion.condicion_comercial?.estado !== 'PUBLICADA' || cotizacion.condicion_comercial.condicion.segmento !== segmento) pendientes.push('condiciones comerciales publicadas para el segmento');
    if (!borrador && !plantilla) pendientes.push('plantilla publicada');
    const cliente = cotizacion.ficha_cliente.cliente_financiero;
    const productos = cotizacion.detalle_cotizacion.map((detalle): LineaDocumentoComercial => {
      const snap = objeto(detalle.snapshot_comercial);
      const nombre = cadena(snap.nombre) || detalle.producto_version?.nombre_comercial || detalle.item_comercial.nombre_item;
      const unitario = detalle.precio_unitario_autorizado ? numero(detalle.precio_unitario_autorizado) : null;
      return {
        idDetalleCotizacion: detalle.id_detalle_cotizacion,
        idProductoComercial: detalle.id_extension_producto_comercial,
        idVersionProducto: detalle.id_producto_comercial_version,
        codigo: cadena(snap.codigo) || detalle.producto_version?.codigo_comercial || null,
        nombre, descripcion: detalle.descripcion_item_cotizado || detalle.producto_version?.descripcion_general || null,
        cantidad: numero(detalle.cantidad_item), unidad: 'unidad(es)',
        dimensiones: [detalle.medida_ancho_referencial ? `${numero(detalle.medida_ancho_referencial)} mm ancho` : '', detalle.medida_alto_referencial ? `${numero(detalle.medida_alto_referencial)} mm alto` : '', detalle.medida_espesor_referencial ? `${numero(detalle.medida_espesor_referencial)} mm espesor` : ''].filter(Boolean).join(' · ') || null,
        precioUnitario: unitario, subtotal: numero(detalle.subtotal_item_estimado),
        caracteristicas: detalle.producto_version ? listaTexto(detalle.producto_version.caracteristicas_destacadas) : listaTexto(snap.caracteristicas),
        opcionales: listaTexto(snap.opcionales),
      };
    });
    const servicios = cotizacion.detalles_servicio.map((detalle): LineaDocumentoComercial => ({
      codigo: detalle.servicio.codigo, nombre: detalle.servicio.nombre, descripcion: detalle.descripcion_cotizada,
      cantidad: numero(detalle.cantidad), unidad: detalle.unidad_cobro_cotizada,
      precioUnitario: numero(detalle.precio_unitario_autorizado), subtotal: numero(detalle.subtotal),
    }));
    if (cotizacion.requiere_instalacion === 'SI') servicios.unshift({
      codigo: 'INSTALACION', nombre: 'Instalación', cantidad: 1, unidad: 'servicio',
      descripcion: [cotizacion.region_instalacion, cotizacion.comuna_instalacion, cotizacion.estado_cobertura_instalacion].filter(Boolean).join(' · '),
      precioUnitario: cotizacion.precio_instalacion_aplicado ? numero(cotizacion.precio_instalacion_aplicado) : null,
      subtotal: cotizacion.precio_instalacion_aplicado ? numero(cotizacion.precio_instalacion_aplicado) : null,
    });
    const alternativas = cotizacion.grupos_alternativas_b2c.flatMap(grupo => grupo.alternativas).map((alternativa, indice) => {
      const configuracion = objeto(alternativa.configuracion_snapshot);
      return {
        identificador: alternativa.id_alternativa_b2c.toString(), etiqueta: `ALTERNATIVA ${String.fromCharCode(65 + indice)}`,
        producto: alternativa.producto_version.nombre_comercial, descripcion: alternativa.producto_version.descripcion_b2c,
        caracteristicas: listaTexto(alternativa.producto_version.caracteristicas_destacadas),
        opcionales: alternativa.opcionales.map(opcional => cadena(objeto(opcional.snapshot_opcional).nombre)).filter(Boolean),
        moneda: alternativa.moneda.codigo_moneda, neto: numero(alternativa.monto_neto), impuesto: numero(alternativa.monto_impuesto), total: numero(alternativa.monto_total),
        fotografiaDisponible: configuracion.fotografiaAutorizada === true,
      };
    });
    const ubicacion = [cotizacion.direccion_instalacion, cotizacion.comuna_instalacion, cotizacion.region_instalacion].filter(Boolean).join(' · ');
    return {
      tipo: segmento, titulo: segmento === 'B2B' ? 'Presupuesto comercial' : 'Cotización personalizada',
      numero: cotizacion.estado_cotizacion === 'borrador' ? null : String(cotizacion.id_cotizacion), version: null,
      fecha: fecha(cotizacion.fecha_emision)!, vigencia: fecha(cotizacion.fecha_vigencia), borrador,
      camposPendientes: pendientes, moneda: cotizacion.moneda.codigo_moneda,
      cliente: { nombre: cliente.nombre_razon_social_referencia, rut: cliente.rut_cliente, correo: cliente.correo_financiero, telefono: cliente.telefono_financiero },
      contactos: cotizacion.contactos_b2b.map(contacto => ({ nombre: `${contacto.nombre} ${contacto.apellido || ''}`.trim(), cargo: contacto.cargo, correo: contacto.correo, telefono: contacto.telefono, principal: contacto.es_principal })),
      proyecto: { nombre: cotizacion.nombre_proyecto, referencia: cotizacion.referencia_comercial, ubicacion, alcance: cotizacion.alcance_comercial },
      introduccion: segmento === 'B2B' ? 'De acuerdo con lo solicitado, presentamos la siguiente propuesta comercial.' : 'Presentamos las alternativas y condiciones comerciales preparadas para esta cotización.',
      productos, servicios, alternativas,
      neto: cotizacion.monto_neto ? numero(cotizacion.monto_neto) : null,
      impuesto: cotizacion.monto_impuesto ? numero(cotizacion.monto_impuesto) : null,
      total: cotizacion.monto_total_estimado ? numero(cotizacion.monto_total_estimado) : null,
      condiciones: cotizacion.condicion_comercial ? textoCondiciones(cotizacion.condicion_comercial.contenido) : [],
      observaciones: cotizacion.observacion ? [cotizacion.observacion] : [],
      plantilla: plantilla ? { id: plantilla.id_plantilla_documental_version.toString(), version: plantilla.numero_version, nombre: plantilla.plantilla.nombre, publicada: true } : { nombre: 'Diseño seguro de borrador C4', publicada: false },
    };
  }
}
