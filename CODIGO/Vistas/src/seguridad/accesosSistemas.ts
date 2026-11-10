import type { Sesion } from './Sesion';
import { tieneAlgunPermiso } from './autorizacionSesion';

export const permisosTerreno = [
  'CU199', 'CU200', 'CU201', 'CU202', 'CU203', 'CU204', 'CU205', 'CU206',
  'CU207', 'CU208', 'CU209', 'CU210', 'CU211', 'CU212', 'CU213',
] as const;

const permisosExclusivosTerreno = new Set<string>(permisosTerreno);
export const permisosInventario = ['CU14','CU15','CU466','CU467','CU468','CU469','CU470','CU471','CU472'] as const;
const permisosExclusivosInventario = new Set<string>(permisosInventario);

export const puedeAccederTerreno = (sesion: Sesion | null) =>
  Boolean(sesion?.administradorOriginal || sesion?.permisos.some((permiso) => permisosExclusivosTerreno.has(permiso)));

export const puedeAccederFinanzas = (sesion: Sesion | null) =>
  Boolean(sesion?.administradorOriginal || sesion?.permisos.some((permiso) => !permisosExclusivosTerreno.has(permiso) && !permisosExclusivosInventario.has(permiso)));

export const puedeAccederInventario = (sesion: Sesion | null) =>
  Boolean(sesion?.administradorOriginal || tieneAlgunPermiso(sesion,permisosInventario));
