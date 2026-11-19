"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MotorPoliticasM9 = exports.RepositorioPoliticasPrismaM9 = exports.RepositorioPoliticasMemoriaM9 = void 0;
const db_1 = require("../db");
class RepositorioPoliticasMemoriaM9 {
    constructor(categorias = [], politicas = []) {
        this.categorias = categorias;
        this.politicas = politicas;
        this.tratamientos = [];
    }
    async categoria(codigo) { return this.categorias.find(c => c.codigo === codigo) ?? null; }
    async politicaAplicable(categoriaId, fecha) { return this.politicas.filter(p => p.categoriaId === categoriaId && p.desde <= fecha && (!p.hasta || p.hasta >= fecha)); }
    async guardarTratamiento(item) { if (!this.tratamientos.some(t => t.eventoId === item.eventoId && t.politicaId === item.politicaId))
        this.tratamientos.push({ ...item }); }
    async tratamientoVigente(eventoId) { const tratamiento = this.tratamientos.filter(t => t.eventoId === eventoId).sort((a, b) => b.aplicadoEn.getTime() - a.aplicadoEn.getTime())[0]; if (!tratamiento)
        return null; const politica = this.politicas.find(p => p.id === tratamiento.politicaId); return politica ? { tratamiento: { ...tratamiento }, politica: { ...politica } } : null; }
}
exports.RepositorioPoliticasMemoriaM9 = RepositorioPoliticasMemoriaM9;
const mapPolitica = (p) => ({ id: p.id_politica_m9, categoriaId: p.id_categoria_retencion, version: p.version, accion: p.accion, modulo: p.modulo_objetivo, entidad: p.entidad_objetivo, estrategiaRef: p.estrategia_ref, permiteCorrelacion: p.permite_correlacion, preservarMinimo: p.preservar_minimo, finalidadRef: p.finalidad_ref, baseRef: p.base_ref, politicaOwnerRef: p.politica_owner_ref, desde: p.vigencia_desde, hasta: p.vigencia_hasta });
class RepositorioPoliticasPrismaM9 {
    async categoria(codigo) { const c = await db_1.prisma.categoria_retencion_m9.findUnique({ where: { codigo } }); return c ? { id: c.id_categoria_retencion, codigo: c.codigo, ownership: c.ownership, descripcion: c.descripcion } : null; }
    async politicaAplicable(categoriaId, fecha) { return (await db_1.prisma.politica_tratamiento_m9.findMany({ where: { id_categoria_retencion: categoriaId, vigencia_desde: { lte: fecha }, OR: [{ vigencia_hasta: null }, { vigencia_hasta: { gte: fecha } }] }, orderBy: { version: 'desc' } })).map(mapPolitica); }
    async guardarTratamiento(item) { await db_1.prisma.tratamiento_privacidad_m9.upsert({ where: { id_evento_m9_id_politica_m9: { id_evento_m9: item.eventoId, id_politica_m9: item.politicaId } }, update: {}, create: { id_evento_m9: item.eventoId, id_politica_m9: item.politicaId, accion: item.accion, estado: item.estado, correlacion_anonima: item.correlacionAnonima, aplicado_en: item.aplicadoEn } }); }
    async tratamientoVigente(eventoId) { const t = await db_1.prisma.tratamiento_privacidad_m9.findFirst({ where: { id_evento_m9: eventoId }, orderBy: { aplicado_en: 'desc' } }); if (!t)
        return null; const p = await db_1.prisma.politica_tratamiento_m9.findUnique({ where: { id_politica_m9: t.id_politica_m9 } }); return p ? { tratamiento: { eventoId: t.id_evento_m9, politicaId: t.id_politica_m9, accion: t.accion, estado: t.estado, correlacionAnonima: t.correlacion_anonima, aplicadoEn: t.aplicado_en }, politica: mapPolitica(p) } : null; }
}
exports.RepositorioPoliticasPrismaM9 = RepositorioPoliticasPrismaM9;
const minimo = (evento, correlacion) => ({ ...evento, ejecutorReferencia: null, entidadReferencia: correlacion, anterior: null, nuevo: null, motivo: null, causa: null, metadatos: null, eventoPrivacidad: true });
class MotorPoliticasM9 {
    constructor(repositorio) {
        this.repositorio = repositorio;
        this.estrategias = new Map();
    }
    registrarEstrategia(estrategia) { this.estrategias.set(estrategia.nombre, estrategia); }
    async tratar(evento, categoriaCodigo, fecha) {
        const categoria = await this.repositorio.categoria(categoriaCodigo);
        if (!categoria)
            return { estado: 'SIN_POLITICA', politica: null };
        if (categoria.ownership !== 'M9')
            return { estado: 'DEPENDENCIA_OWNER', politica: null };
        const candidatas = (await this.repositorio.politicaAplicable(categoria.id, fecha)).filter(p => (!p.modulo || p.modulo === evento.modulo) && (!p.entidad || p.entidad === evento.entidadTipo));
        if (candidatas.length !== 1)
            return { estado: candidatas.length ? 'POLITICA_AMBIGUA' : 'SIN_POLITICA', politica: null };
        const politica = candidatas[0];
        let estado = 'APLICADO', correlacion = null;
        if (politica.accion === 'BLOCK')
            estado = 'BLOQUEADO';
        if (politica.accion === 'ANONYMIZE') {
            const estrategia = politica.estrategiaRef ? this.estrategias.get(politica.estrategiaRef) : undefined;
            if (!estrategia)
                estado = 'DEPENDENCIA_OWNER';
            else
                correlacion = estrategia.aplicar(evento, politica.permiteCorrelacion).correlacionAnonima ?? null;
        }
        await this.repositorio.guardarTratamiento({ eventoId: evento.id, politicaId: politica.id, accion: politica.accion, estado, correlacionAnonima: politica.permiteCorrelacion ? correlacion : null, aplicadoEn: fecha });
        return { estado, politica };
    }
    async ocultarVinculo(id) { if (!id)
        return false; const vinculo = await this.repositorio.tratamientoVigente(id); return Boolean(vinculo && vinculo.tratamiento.estado === 'APLICADO' && ['ANONYMIZE', 'PURGE'].includes(vinculo.politica.accion)); }
    async limpiarRelaciones(evento) { const [origen, correctivo] = await Promise.all([this.ocultarVinculo(evento.eventoOrigenId), this.ocultarVinculo(evento.eventoCorrectivoId)]); return origen || correctivo ? { ...evento, eventoOrigenId: origen ? null : evento.eventoOrigenId, eventoCorrectivoId: correctivo ? null : evento.eventoCorrectivoId } : evento; }
    async proyectar(evento) {
        const vigente = await this.repositorio.tratamientoVigente(evento.id);
        if (!vigente || vigente.tratamiento.estado !== 'APLICADO' || vigente.politica.accion === 'NONE' || vigente.politica.accion === 'BLOCK')
            return this.limpiarRelaciones(evento);
        if (vigente.politica.accion === 'PURGE')
            return vigente.politica.preservarMinimo ? minimo(evento, null) : null;
        const estrategia = vigente.politica.estrategiaRef ? this.estrategias.get(vigente.politica.estrategiaRef) : undefined;
        if (!estrategia)
            return this.limpiarRelaciones(minimo(evento, vigente.tratamiento.correlacionAnonima));
        return this.limpiarRelaciones(estrategia.aplicar(evento, vigente.politica.permiteCorrelacion).evento);
    }
}
exports.MotorPoliticasM9 = MotorPoliticasM9;
//# sourceMappingURL=politicas.js.map