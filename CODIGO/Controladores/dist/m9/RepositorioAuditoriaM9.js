"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepositorioAuditoriaM9Memoria = exports.RepositorioAuditoriaM9Prisma = void 0;
const client_1 = require("@prisma/client");
const db_1 = require("../db");
const fechasFiltroChile_1 = require("./fechasFiltroChile");
const json = (valor) => valor;
const entradaJson = (valor) => valor === null ? client_1.Prisma.JsonNull : valor;
const mapear = (fila) => ({
    id: fila.id_evento_m9,
    identidadLogica: fila.identidad_logica,
    versionContrato: fila.version_contrato,
    fechaOcurrencia: fila.fecha_ocurrencia,
    zonaHoraria: fila.zona_horaria,
    fechaPersistencia: fila.fecha_persistencia,
    ejecutorTipo: fila.ejecutor_tipo,
    ejecutorReferencia: fila.ejecutor_referencia,
    productor: fila.productor,
    modulo: fila.modulo_origen,
    operacion: fila.operacion,
    resultado: fila.resultado,
    entidadTipo: fila.entidad_tipo,
    entidadReferencia: fila.entidad_referencia,
    secuencia: fila.secuencia,
    anterior: json(fila.valores_anteriores),
    nuevo: json(fila.valores_nuevos),
    motivo: fila.motivo,
    causa: fila.causa,
    eventoOrigenId: fila.id_evento_origen,
    eventoCorrectivoId: fila.id_evento_correctivo,
    contextoTerminal: fila.contexto_terminal,
    eventoPrivacidad: fila.evento_privacidad,
    metadatos: json(fila.metadatos_tecnicos),
    hashContenido: fila.hash_contenido,
    hashIntegridad: fila.hash_integridad,
});
const datos = (evento) => ({
    identidad_logica: evento.identidadLogica,
    version_contrato: evento.versionContrato,
    fecha_ocurrencia: evento.fechaOcurrencia,
    zona_horaria: evento.zonaHoraria,
    fecha_persistencia: evento.fechaPersistencia,
    ejecutor_tipo: evento.ejecutorTipo,
    ejecutor_referencia: evento.ejecutorReferencia,
    productor: evento.productor,
    modulo_origen: evento.modulo,
    operacion: evento.operacion,
    resultado: evento.resultado,
    entidad_tipo: evento.entidadTipo,
    entidad_referencia: evento.entidadReferencia,
    secuencia: evento.secuencia,
    valores_anteriores: entradaJson(evento.anterior),
    valores_nuevos: entradaJson(evento.nuevo),
    motivo: evento.motivo,
    causa: evento.causa,
    contexto_terminal: evento.contextoTerminal,
    evento_privacidad: evento.eventoPrivacidad,
    metadatos_tecnicos: entradaJson(evento.metadatos),
    hash_contenido: evento.hashContenido,
    hash_integridad: evento.hashIntegridad,
    ...(evento.eventoOrigenId ? { evento_origen: { connect: { id_evento_m9: evento.eventoOrigenId } } } : {}),
    ...(evento.eventoCorrectivoId ? { evento_correctivo: { connect: { id_evento_m9: evento.eventoCorrectivoId } } } : {}),
});
class RepositorioAuditoriaM9Prisma {
    constructor(cliente = db_1.prisma) {
        this.cliente = cliente;
    }
    async crear(evento) { return mapear(await this.cliente.evento_auditoria_m9.create({ data: datos(evento) })); }
    async porIdentidad(identidad) { const fila = await this.cliente.evento_auditoria_m9.findUnique({ where: { identidad_logica: identidad } }); return fila ? mapear(fila) : null; }
    async porId(id) { const fila = await this.cliente.evento_auditoria_m9.findUnique({ where: { id_evento_m9: id } }); return fila ? mapear(fila) : null; }
    async ultimaSecuencia(productor, entidadTipo, entidadReferencia) {
        const fila = await this.cliente.evento_auditoria_m9.findFirst({ where: { productor, entidad_tipo: entidadTipo, entidad_referencia: entidadReferencia, secuencia: { not: null } }, orderBy: { secuencia: 'desc' } });
        return fila?.secuencia ?? null;
    }
    async listar(filtros, modulos, productores) {
        const pagina = Math.max(1, filtros.pagina ?? 1), tamano = Math.max(1, filtros.tamano ?? 50);
        const rangoChile = (0, fechasFiltroChile_1.limitesFiltroChile)(filtros);
        const where = {
            ...(modulos ? { modulo_origen: { in: modulos } } : {}),
            ...(productores ? { productor: { in: productores } } : {}),
            ...(filtros.modulo ? { modulo_origen: filtros.modulo } : {}),
            ...(filtros.productor ? { productor: filtros.productor } : {}),
            ...(filtros.operacion ? { operacion: filtros.operacion } : {}),
            ...(filtros.resultado ? { resultado: filtros.resultado } : {}),
            ...(filtros.ejecutor ? { ejecutor_referencia: filtros.ejecutor } : {}),
            ...(filtros.entidadTipo ? { entidad_tipo: filtros.entidadTipo } : {}),
            ...(filtros.entidadReferencia ? { entidad_referencia: filtros.entidadReferencia } : {}),
            ...(filtros.identidadLogica ? { identidad_logica: filtros.identidadLogica } : {}),
            ...(filtros.desde || filtros.hasta ? { fecha_ocurrencia: rangoChile } : {}),
            ...(filtros.buscar ? { OR: [{ identidad_logica: { contains: filtros.buscar, mode: 'insensitive' } }, { entidad_referencia: { contains: filtros.buscar, mode: 'insensitive' } }] } : {}),
        };
        const [total, filas] = await Promise.all([
            this.cliente.evento_auditoria_m9.count({ where }),
            this.cliente.evento_auditoria_m9.findMany({ where, orderBy: [{ fecha_ocurrencia: filtros.orden ?? 'desc' }, { id_evento_m9: filtros.orden ?? 'desc' }], skip: (pagina - 1) * tamano, take: tamano }),
        ]);
        return { total, eventos: filas.map(mapear) };
    }
    async listarTodo(filtros, modulos, productores) {
        const pagina = await this.listar({ ...filtros, pagina: 1, tamano: Math.max(1, await this.cliente.evento_auditoria_m9.count()) }, modulos, productores);
        if (pagina.eventos.length === pagina.total)
            return pagina.eventos;
        const lotes = [...pagina.eventos];
        for (let numero = 2; lotes.length < pagina.total; numero++)
            lotes.push(...(await this.listar({ ...filtros, pagina: numero, tamano: 200 }, modulos, productores)).eventos);
        return lotes;
    }
    async relacionados(id, tipo) {
        const filas = await this.cliente.evento_auditoria_m9.findMany({ where: tipo === 'origen' ? { id_evento_origen: id } : { id_evento_correctivo: id }, orderBy: [{ fecha_ocurrencia: 'asc' }, { id_evento_m9: 'asc' }] });
        return filas.map(mapear);
    }
    async resumen(modulos, productores) {
        const where = { ...(modulos ? { modulo_origen: { in: modulos } } : {}), ...(productores ? { productor: { in: productores } } : {}) };
        const [total, resultados, modulosAgrupados] = await Promise.all([
            this.cliente.evento_auditoria_m9.count({ where }),
            this.cliente.evento_auditoria_m9.groupBy({ by: ['resultado'], where, _count: { _all: true } }),
            this.cliente.evento_auditoria_m9.groupBy({ by: ['modulo_origen'], where, _count: { _all: true } }),
        ]);
        return { total, porResultado: Object.fromEntries(resultados.map(item => [item.resultado, item._count._all])), porModulo: Object.fromEntries(modulosAgrupados.map(item => [item.modulo_origen, item._count._all])) };
    }
    cantidad() { return this.cliente.evento_auditoria_m9.count(); }
}
exports.RepositorioAuditoriaM9Prisma = RepositorioAuditoriaM9Prisma;
class RepositorioAuditoriaM9Memoria {
    constructor() {
        this.eventos = [];
        this.fallarPersistencia = false;
    }
    async crear(evento) {
        if (this.fallarPersistencia)
            throw new Error('persistencia no disponible');
        const creado = { ...evento, id: this.eventos.length + 1 };
        this.eventos.push(creado);
        return { ...creado };
    }
    async porIdentidad(identidad) { return this.eventos.find(evento => evento.identidadLogica === identidad) ?? null; }
    async porId(id) { return this.eventos.find(evento => evento.id === id) ?? null; }
    async ultimaSecuencia(productor, entidadTipo, entidadReferencia) { return this.eventos.filter(e => e.productor === productor && e.entidadTipo === entidadTipo && e.entidadReferencia === entidadReferencia && e.secuencia !== null).reduce((maximo, e) => maximo === null || e.secuencia > maximo ? e.secuencia : maximo, null); }
    async listar(f, modulos, productores) {
        const rangoChile = (0, fechasFiltroChile_1.limitesFiltroChile)(f);
        let eventos = this.eventos.filter(e => (!rangoChile.gte || e.fechaOcurrencia >= rangoChile.gte) && (!rangoChile.lt || e.fechaOcurrencia < rangoChile.lt) && (!rangoChile.lte || e.fechaOcurrencia <= rangoChile.lte) && (!modulos || modulos.includes(e.modulo)) && (!productores || productores.includes(e.productor)) && (!f.modulo || e.modulo === f.modulo) && (!f.productor || e.productor === f.productor) && (!f.operacion || e.operacion === f.operacion) && (!f.resultado || e.resultado === f.resultado) && (!f.ejecutor || e.ejecutorReferencia === f.ejecutor) && (!f.entidadTipo || e.entidadTipo === f.entidadTipo) && (!f.entidadReferencia || e.entidadReferencia === f.entidadReferencia) && (!f.identidadLogica || e.identidadLogica === f.identidadLogica) && (!f.buscar || e.identidadLogica.includes(f.buscar) || e.entidadReferencia?.includes(f.buscar)));
        eventos = eventos.sort((a, b) => (a.fechaOcurrencia.getTime() - b.fechaOcurrencia.getTime()) * (f.orden === 'asc' ? 1 : -1));
        const total = eventos.length, pagina = f.pagina ?? 1, tamano = f.tamano ?? 50;
        return { total, eventos: eventos.slice((pagina - 1) * tamano, pagina * tamano).map(e => ({ ...e })) };
    }
    async listarTodo(f, modulos, productores) { const total = await this.listar({ ...f, pagina: 1, tamano: Number.MAX_SAFE_INTEGER }, modulos, productores); return total.eventos; }
    async relacionados(id, tipo) { return this.eventos.filter(e => tipo === 'origen' ? e.eventoOrigenId === id : e.eventoCorrectivoId === id).sort((a, b) => a.fechaOcurrencia.getTime() - b.fechaOcurrencia.getTime()); }
    async resumen(modulos, productores) {
        const eventos = this.eventos.filter(e => (!modulos || modulos.includes(e.modulo)) && (!productores || productores.includes(e.productor)));
        const contar = (valores) => valores.reduce((r, v) => (r[v] = (r[v] ?? 0) + 1, r), {});
        return { total: eventos.length, porResultado: contar(eventos.map(e => e.resultado)), porModulo: contar(eventos.map(e => e.modulo)) };
    }
    async cantidad() { return this.eventos.length; }
}
exports.RepositorioAuditoriaM9Memoria = RepositorioAuditoriaM9Memoria;
//# sourceMappingURL=RepositorioAuditoriaM9.js.map