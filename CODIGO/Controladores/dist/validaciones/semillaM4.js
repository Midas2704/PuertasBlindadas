"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.codigosExcluidosSemillaM4 = void 0;
exports.construirCatalogoSemillaM4 = construirCatalogoSemillaM4;
exports.exigirIdPermisoSemillaM4 = exigirIdPermisoSemillaM4;
exports.codigosExcluidosSemillaM4 = new Set(['CU377']);
/**
 * Construye el catálogo que debe existir antes de persistir dependencias y
 * perfiles. Una entrada de dependencias sin aristas (por ejemplo CU377) no
 * obliga a crear el permiso.
 */
function construirCatalogoSemillaM4({ iniciales, dependencias, perfiles }) {
    const codigos = new Set(iniciales.filter(codigo => !exports.codigosExcluidosSemillaM4.has(codigo)));
    for (const [codigo, requeridos] of Object.entries(dependencias)) {
        if (requeridos.length === 0)
            continue;
        if (exports.codigosExcluidosSemillaM4.has(codigo)) {
            throw new Error(`M4_SEED_PERMISO_EXCLUIDO_EN_DEPENDENCIA: ${codigo}`);
        }
        codigos.add(codigo);
        for (const requerido of requeridos) {
            if (exports.codigosExcluidosSemillaM4.has(requerido)) {
                throw new Error(`M4_SEED_PERMISO_EXCLUIDO_REQUERIDO: ${codigo} -> ${requerido}`);
            }
            codigos.add(requerido);
        }
    }
    for (const perfil of perfiles) {
        for (const codigo of perfil) {
            if (exports.codigosExcluidosSemillaM4.has(codigo)) {
                throw new Error(`M4_SEED_PERMISO_EXCLUIDO_EN_PERFIL: ${codigo}`);
            }
            codigos.add(codigo);
        }
    }
    return [...codigos];
}
function exigirIdPermisoSemillaM4(permisos, codigo, contexto) {
    const id = permisos.get(codigo);
    if (id === undefined)
        throw new Error(`M4_SEED_PERMISO_NO_CREADO: ${codigo} (${contexto})`);
    return id;
}
//# sourceMappingURL=semillaM4.js.map