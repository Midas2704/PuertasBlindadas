import type { Sesion } from './Sesion';

export const permisosTerreno = [
  'CU199', 'CU200', 'CU201', 'CU202', 'CU203', 'CU204', 'CU205', 'CU206',
  'CU207', 'CU208', 'CU209', 'CU210', 'CU211', 'CU212', 'CU213',
] as const;

const permisosExclusivosTerreno = new Set<string>(permisosTerreno);

export const puedeAccederTerreno = (sesion: Sesion | null) =>
  Boolean(sesion?.permisos.some((permiso) => permisosExclusivosTerreno.has(permiso)));

export const puedeAccederFinanzas = (sesion: Sesion | null) =>
  Boolean(sesion?.permisos.some((permiso) => !permisosExclusivosTerreno.has(permiso)));
