export const codigosExcluidosSemillaM4 = new Set(['CU377']);

type ConfiguracionCatalogoM4 = {
  iniciales: readonly string[];
  dependencias: Readonly<Record<string, readonly string[]>>;
  perfiles: readonly (readonly string[])[];
};

/**
 * Construye el catálogo que debe existir antes de persistir dependencias y
 * perfiles. Una entrada de dependencias sin aristas (por ejemplo CU377) no
 * obliga a crear el permiso.
 */
export function construirCatalogoSemillaM4({ iniciales, dependencias, perfiles }: ConfiguracionCatalogoM4) {
  const codigos = new Set(iniciales.filter(codigo => !codigosExcluidosSemillaM4.has(codigo)));

  for (const [codigo, requeridos] of Object.entries(dependencias)) {
    if (requeridos.length === 0) continue;
    if (codigosExcluidosSemillaM4.has(codigo)) {
      throw new Error(`M4_SEED_PERMISO_EXCLUIDO_EN_DEPENDENCIA: ${codigo}`);
    }
    codigos.add(codigo);
    for (const requerido of requeridos) {
      if (codigosExcluidosSemillaM4.has(requerido)) {
        throw new Error(`M4_SEED_PERMISO_EXCLUIDO_REQUERIDO: ${codigo} -> ${requerido}`);
      }
      codigos.add(requerido);
    }
  }

  for (const perfil of perfiles) {
    for (const codigo of perfil) {
      if (codigosExcluidosSemillaM4.has(codigo)) {
        throw new Error(`M4_SEED_PERMISO_EXCLUIDO_EN_PERFIL: ${codigo}`);
      }
      codigos.add(codigo);
    }
  }

  return [...codigos];
}

export function exigirIdPermisoSemillaM4(permisos: ReadonlyMap<string, bigint>, codigo: string, contexto: string) {
  const id = permisos.get(codigo);
  if (id === undefined) throw new Error(`M4_SEED_PERMISO_NO_CREADO: ${codigo} (${contexto})`);
  return id;
}
