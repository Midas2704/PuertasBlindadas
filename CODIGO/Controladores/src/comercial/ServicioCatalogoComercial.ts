import { prisma } from '../db';
import { ErrorAplicacion } from '../utilidades/ErrorAplicacion';
import { fechaComercial, normalizarUbicacion, resolverCoberturaDesdeTarifas, type SegmentoComercial, type TarifaResoluble } from './contratosCatalogoComercial';

type Consulta = Record<string, unknown>;

const segmento = (valor: unknown): SegmentoComercial | undefined => {
  if (valor === undefined || valor === null || valor === '' || valor === 'TODOS') return undefined;
  const normalizado = String(valor).toUpperCase();
  if (normalizado !== 'B2B' && normalizado !== 'B2C') throw new ErrorAplicacion(400, 'Segmento comercial inválido');
  return normalizado;
};
const enteroOpcional = (valor: unknown, campo: string) => {
  if (valor === undefined || valor === null || valor === '') return undefined;
  const numero = Number(valor);
  if (!Number.isInteger(numero) || numero <= 0) throw new ErrorAplicacion(400, `${campo} inválido`);
  return numero;
};
const fechaIso = (valor: Date | null) => valor?.toISOString().slice(0, 10) ?? null;
const monto = (valor: unknown) => valor === null || valor === undefined ? null : Number(valor);
const nombreActor = (actor: { usuario_username: string | null; usuario_nombre_completo_primer_nombre_usuario: string | null; usuario_nombre_completo_primer_apellido_usuario: string | null } | null) => {
  if (!actor) return null;
  return [actor.usuario_nombre_completo_primer_nombre_usuario, actor.usuario_nombre_completo_primer_apellido_usuario].filter(Boolean).join(' ') || actor.usuario_username;
};

export class ServicioCatalogoComercial {
  async listarProductosCotizacion(consulta: Consulta) {
    const seg = segmento(consulta.segmento);
    if (!seg) throw new ErrorAplicacion(400, 'El segmento B2B o B2C es obligatorio');
    const fecha = fechaComercial(consulta.fecha);
    const idProducto = enteroOpcional(consulta.producto, 'Producto');
    const monedaSolicitada = String(consulta.moneda ?? '').trim().toUpperCase();
    const productos = await prisma.extension_producto_comercial.findMany({
      where: {
        estado: 'VINCULADO', id_item_comercial: { not: null }, numero_version_vigente: { not: null },
        familia: { estado: 'ACTIVA' }, item_comercial: { estado_item: 'activo' },
        ...(idProducto ? { id_extension_producto_comercial: idProducto } : {}),
      },
      include: {
        familia: true, item_comercial: true,
        versiones: { where: { vigencia_desde: { lte: fecha } }, orderBy: { numero_version: 'desc' } },
        precios_comerciales: { where: { segmento_comercial: seg, estado: 'ACTIVO', vigencia_desde: { lte: fecha }, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: fecha } }], ...(monedaSolicitada ? { moneda: { codigo_moneda: monedaSolicitada } } : {}) }, include: { moneda: true }, orderBy: { vigencia_desde: 'desc' } },
        compatibilidades_opcionales: { where: { estado: 'ACTIVA', ...(seg === 'B2B' ? { habilitado_b2b: true } : { habilitado_b2c: true }) }, include: { opcional: { include: { precios: { where: { segmento_comercial: seg, estado: 'ACTIVO', vigencia_desde: { lte: fecha }, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: fecha } }] }, include: { moneda: true }, orderBy: { vigencia_desde: 'desc' } } } } } },
        documentos: { where: { estado: 'ACTIVO', ...(seg === 'B2B' ? { habilitado_b2b: true } : { habilitado_b2c: true }), documento: { clasificacion: 'COMERCIAL', estado: 'ACTIVO' } }, select: { tipo_documento: true, es_imagen_principal: true, documento: { select: { numero_version_actual: true } } } },
      }, orderBy: [{ familia: { nombre: 'asc' } }, { nombre_comercial: 'asc' }],
    });
    return productos.flatMap(producto => {
      const version = producto.versiones.find(item => item.numero_version === producto.numero_version_vigente);
      if (!version || !producto.item_comercial) return [];
      const precios = producto.precios_comerciales;
      const precio = precios.length === 1 ? { resultado: 'VIGENTE' as const, id: precios[0].id_precio_producto_comercial.toString(), monto: Number(precios[0].monto), moneda: precios[0].moneda.codigo_moneda, vigenciaDesde: fechaIso(precios[0].vigencia_desde), vigenciaHasta: fechaIso(precios[0].vigencia_hasta), version: precios[0].revision } : { resultado: 'SIN_PRECIO' as const, id: null, monto: null, moneda: null, vigenciaDesde: null, vigenciaHasta: null, version: null };
      const fotografias = producto.documentos.filter(item => item.tipo_documento === 'FOTOGRAFIA_COMERCIAL');
      return [{
        idProductoComercial: producto.id_extension_producto_comercial,
        idItemComercial: producto.id_item_comercial!, codigo: version.codigo_comercial,
        nombre: version.nombre_comercial, familia: { id: version.id_familia_producto_comercial, codigo: version.codigo_familia, nombre: version.nombre_familia },
        subfamilia: version.subfamilia, tipo: version.tipo_producto, idProductoComercialVersion: version.id_producto_comercial_version, numeroVersion: version.numero_version,
        descripcion: seg === 'B2B' ? version.descripcion_b2b : version.descripcion_b2c,
        caracteristicas: version.caracteristicas_destacadas, caracteristicasTecnicas: version.caracteristicas_tecnicas,
        garantia: version.garantia_referencial, condicionesParticulares: version.condiciones_particulares,
        estado: producto.estado, segmento: seg, precio,
        opcionales: producto.compatibilidades_opcionales.filter(item => item.opcional.estado === 'ACTIVO').map(item => ({
          id: item.opcional.id_opcional_comercial.toString(), idCompatibilidad: item.id_compatibilidad_opcional.toString(), codigo: item.opcional.codigo, nombre: item.opcional.nombre,
          descripcion: seg === 'B2B' ? item.opcional.descripcion_b2b : item.opcional.descripcion_b2c,
          condiciones: item.condiciones_compatibilidad,
          precio: item.opcional.precios.length === 1 ? { resultado: 'VIGENTE' as const, id: item.opcional.precios[0].id_precio_opcional_comercial.toString(), monto: Number(item.opcional.precios[0].monto), moneda: item.opcional.precios[0].moneda.codigo_moneda, version: item.opcional.precios[0].revision } : { resultado: 'SIN_PRECIO' as const, id: null, monto: null, moneda: null, version: null },
        })),
        documentos: { fotografias: fotografias.length, fotografiaPrincipalDisponible: fotografias.some(item => item.es_imagen_principal && item.documento.numero_version_actual !== null), documentosComerciales: producto.documentos.length - fotografias.length },
        costosInternosExpuestos: false,
      }];
    });
  }

  async obtenerProductoCotizacion(idProducto: number, consulta: Consulta) {
    const productos = await this.listarProductosCotizacion({ ...consulta, producto: idProducto });
    if (!productos.length) throw new ErrorAplicacion(404, 'El producto no está publicado o no posee una equivalencia operativa activa');
    return productos[0];
  }

  async listarPrecios(consulta: Consulta) {
    const seg = segmento(consulta.segmento);
    const producto = enteroOpcional(consulta.producto, 'Producto');
    return prisma.precio_producto_comercial.findMany({
      where: { ...(seg ? { segmento_comercial: seg } : {}), ...(producto ? { id_extension_producto_comercial: producto } : {}) },
      include: { producto: { include: { familia: true } }, moneda: true, creador: true },
      orderBy: [{ vigencia_desde: 'desc' }, { creado_en: 'desc' }],
    }).then(filas => filas.map(item => ({
      id: item.id_precio_producto_comercial.toString(), productoId: item.id_extension_producto_comercial,
      producto: item.producto.nombre_comercial, codigoProducto: item.producto.codigo_comercial,
      familia: item.producto.familia.nombre, segmento: item.segmento_comercial,
      monedaId: item.id_moneda, moneda: item.moneda.codigo_moneda, monto: Number(item.monto), vigenciaDesde: fechaIso(item.vigencia_desde),
      vigenciaHasta: fechaIso(item.vigencia_hasta), estado: item.estado, version: item.revision, motivo: item.motivo,
      responsable: nombreActor(item.creador), creadoEn: item.creado_en.toISOString(),
      naturaleza: 'PRECIO_LISTA' as const,
    })));
  }

  async listarServicios(consulta: Consulta) {
    const seg=segmento(consulta.segmento) ?? 'B2B'; const fecha=fechaComercial(consulta.fecha); const monedaSolicitada=String(consulta.moneda??'').trim().toUpperCase(); const historial=consulta.historial==='true';
    const filas=await prisma.servicio_comercial.findMany({where:historial?{}:{estado:'ACTIVO',...(seg==='B2B'?{habilitado_b2b:true}:{habilitado_b2c:true})},include:{precios:{where:historial?{...(consulta.segmento?{segmento_comercial:seg}:{})}:{segmento_comercial:seg,estado:'ACTIVO',vigencia_desde:{lte:fecha},OR:[{vigencia_hasta:null},{vigencia_hasta:{gte:fecha}}],...(monedaSolicitada?{moneda:{codigo_moneda:monedaSolicitada}}:{})},include:{moneda:true,actor:true},orderBy:{vigencia_desde:'desc'}}},orderBy:{nombre:'asc'}});
    return filas.map(item=>{const vigente=item.precios.find(p=>p.segmento_comercial===seg&&p.estado==='ACTIVO'&&p.vigencia_desde<=fecha&&(p.vigencia_hasta===null||p.vigencia_hasta>=fecha)&&(!monedaSolicitada||p.moneda.codigo_moneda===monedaSolicitada));return {id:item.id_servicio_comercial.toString(),codigo:item.codigo,nombre:item.nombre,descripcion:item.descripcion,unidad:item.unidad_cobro,segmento:seg,habilitadoB2b:item.habilitado_b2b,habilitadoB2c:item.habilitado_b2c,estado:item.estado,version:item.revision,precio:vigente?{resultado:'VIGENTE' as const,id:vigente.id_precio_servicio_comercial.toString(),monto:Number(vigente.monto),moneda:vigente.moneda.codigo_moneda,version:vigente.revision,vigenciaDesde:fechaIso(vigente.vigencia_desde),vigenciaHasta:fechaIso(vigente.vigencia_hasta)}:{resultado:'SIN_PRECIO' as const,id:null,monto:null,moneda:null,version:null,vigenciaDesde:null,vigenciaHasta:null},precios:historial?item.precios.map(p=>({id:p.id_precio_servicio_comercial.toString(),segmento:p.segmento_comercial,monedaId:p.id_moneda,moneda:p.moneda.codigo_moneda,monto:Number(p.monto),vigenciaDesde:fechaIso(p.vigencia_desde),vigenciaHasta:fechaIso(p.vigencia_hasta),estado:p.estado,version:p.revision,motivo:p.motivo,responsable:nombreActor(p.actor)})):undefined};});
  }

  async listarOpcionales(consulta: Consulta) {
    const seg = segmento(consulta.segmento);
    const producto = enteroOpcional(consulta.producto, 'Producto');
    const fecha = fechaComercial(consulta.fecha);
    const filas = await prisma.opcional_comercial.findMany({
      where: { ...(producto ? { compatibilidades: { some: { id_extension_producto_comercial: producto, estado: 'ACTIVA', ...(seg === 'B2B' ? { habilitado_b2b: true } : seg === 'B2C' ? { habilitado_b2c: true } : {}) } } } : {}) },
      include: {
        compatibilidades: { include: { producto: { include: { familia: true } } } },
        precios: { where: { ...(seg ? { segmento_comercial: seg } : {}) }, include: { moneda: true, creador: true }, orderBy: { vigencia_desde: 'desc' } },
        creador: true,
      }, orderBy: { nombre: 'asc' },
    });
    return filas.map(item => ({ id: item.id_opcional_comercial.toString(), codigo: item.codigo, nombre: item.nombre,
      descripcionB2b: item.descripcion_b2b, descripcionB2c: item.descripcion_b2c, estado: item.estado, version: item.revision,
      responsable: nombreActor(item.creador), creadoEn: item.creado_en.toISOString(),
      compatibilidades: item.compatibilidades.map(c => ({ productoId: c.id_extension_producto_comercial, producto: c.producto.nombre_comercial, familia: c.producto.familia.nombre, b2b: c.habilitado_b2b, b2c: c.habilitado_b2c, estado: c.estado, condiciones: c.condiciones_compatibilidad })),
      precios: item.precios.map(p => ({ id: p.id_precio_opcional_comercial.toString(), segmento: p.segmento_comercial, moneda: p.moneda.codigo_moneda, monto: Number(p.monto), vigenciaDesde: fechaIso(p.vigencia_desde), vigenciaHasta: fechaIso(p.vigencia_hasta), estado: p.estado, version: p.revision, motivo: p.motivo, responsable: nombreActor(p.creador), creadoEn: p.creado_en.toISOString() })),
    }));
  }

  async listarTarifas(consulta: Consulta) {
    const fecha = consulta.vigentes === 'true' ? fechaComercial(consulta.fecha) : null;
    const filas = await prisma.tarifa_instalacion_comercial.findMany({
      where: fecha ? { estado: 'ACTIVA', vigencia_desde: { lte: fecha }, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: fecha } }] } : {},
      include: { moneda: true, creador: true }, orderBy: [{ region_normalizada: 'asc' }, { comuna_normalizada: 'asc' }, { vigencia_desde: 'desc' }],
    });
    return filas.map(item => ({ id: item.id_tarifa_instalacion_comercial.toString(), alcance: item.alcance_geografico,
      region: item.region, ciudad: item.ciudad, comuna: item.comuna, cobertura: item.estado_cobertura,
      precio: monto(item.precio_comercial), monedaId: item.id_moneda, moneda: item.moneda?.codigo_moneda ?? null,
      vigenciaDesde: fechaIso(item.vigencia_desde), vigenciaHasta: fechaIso(item.vigencia_hasta), condiciones: item.condiciones,
      observaciones: item.observaciones, estado: item.estado, version: item.revision, naturaleza: 'PRECIO_COMERCIAL_INSTALACION' as const,
      responsable: nombreActor(item.creador), creadoEn: item.creado_en.toISOString(),
    }));
  }

  async resolverCobertura(consulta: Consulta) {
    const region = String(consulta.region ?? '').trim();
    if (!region) throw new ErrorAplicacion(400, 'La región es obligatoria');
    const comuna = String(consulta.comuna ?? '').trim() || null;
    const fecha = fechaComercial(consulta.fecha);
    const filas = await prisma.tarifa_instalacion_comercial.findMany({ where: {
      region_normalizada: normalizarUbicacion(region), estado: 'ACTIVA', vigencia_desde: { lte: fecha },
      OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: fecha } }],
    }, include: { moneda: true }, orderBy: { vigencia_desde: 'desc' } });
    const candidatas: TarifaResoluble[] = filas.map(item => ({ id: item.id_tarifa_instalacion_comercial.toString(), alcance: item.alcance_geografico,
      regionNormalizada: item.region_normalizada, comunaNormalizada: item.comuna_normalizada, estadoCobertura: item.estado_cobertura,
      precio: monto(item.precio_comercial), moneda: item.moneda?.codigo_moneda ?? null, vigenciaDesde: fechaIso(item.vigencia_desde)!,
      vigenciaHasta: fechaIso(item.vigencia_hasta), condiciones: item.condiciones }));
    return resolverCoberturaDesdeTarifas(candidatas, region, comuna);
  }

  async listarCondiciones(consulta: Consulta) {
    const seg = segmento(consulta.segmento);
    const fecha = fechaComercial(consulta.fecha);
    const filas = await prisma.condicion_comercial.findMany({ where: { ...(seg ? { segmento: seg } : {}) }, include: {
      creador: true, versiones: { include: { publicador: true }, orderBy: { numero_version: 'desc' } },
    }, orderBy: { nombre: 'asc' } });
    return filas.map(item => ({ id: item.id_condicion_comercial.toString(), codigo: item.codigo, nombre: item.nombre,
      segmento: item.segmento, estado: item.estado, revision: item.revision,
      responsable: nombreActor(item.creador), creadoEn: item.creado_en.toISOString(),
      versiones: item.versiones.map(v => ({ id: v.id_condicion_comercial_version.toString(), numero: v.numero_version,
        contenido: v.contenido, vigenciaDesde: fechaIso(v.vigencia_desde), vigenciaHasta: fechaIso(v.vigencia_hasta), estado: v.estado,
        motivo: v.motivo, vigente: v.estado === 'PUBLICADA' && v.vigencia_desde <= fecha && (v.vigencia_hasta === null || v.vigencia_hasta >= fecha), publicadoPor: nombreActor(v.publicador), publicadoEn: v.publicado_en?.toISOString() ?? null })),
    }));
  }

  async resumenProducto(idProducto: number, consulta: Consulta) {
    const seg = segmento(consulta.segmento);
    const [producto, precios, opcionales, condiciones] = await Promise.all([
      prisma.extension_producto_comercial.findUnique({ where: { id_extension_producto_comercial: idProducto }, include: { familia: true } }),
      this.listarPrecios({ ...consulta, producto: idProducto }), this.listarOpcionales({ ...consulta, producto: idProducto }), this.listarCondiciones(consulta),
    ]);
    if (!producto) throw new ErrorAplicacion(404, 'Producto comercial no encontrado');
    const fecha = fechaComercial(consulta.fecha);
    const preciosVigentes = precios.filter(p => p.estado === 'ACTIVO' && new Date(`${p.vigenciaDesde}T12:00:00Z`) <= fecha && (!p.vigenciaHasta || new Date(`${p.vigenciaHasta}T12:00:00Z`) >= fecha));
    return { producto: { id: producto.id_extension_producto_comercial, codigo: producto.codigo_comercial, nombre: producto.nombre_comercial,
      familiaId: producto.id_familia_producto_comercial, familia: producto.familia.nombre, version: producto.numero_version_vigente,
      descripcionB2b: producto.descripcion_b2b, descripcionB2c: producto.descripcion_b2c, caracteristicas: producto.caracteristicas_destacadas,
      garantia: producto.garantia_referencial, estado: producto.estado }, segmento: seg ?? 'TODOS',
      precio: preciosVigentes.length === 1 ? { resultado: 'VIGENTE', detalle: preciosVigentes[0] } : { resultado: 'SIN_PRECIO', detalle: null },
      precios, opcionales, condiciones, costosInternosExpuestos: false };
  }

  /** Escrituras cerradas hasta que M4 autorice capacidades comerciales específicas. */
  escrituraNoAutorizada(): never {
    throw new ErrorAplicacion(403, 'La mantención comercial requiere un permiso M4 específico pendiente de autorización', 'PERMISO_COMERCIAL_PENDIENTE');
  }
}
