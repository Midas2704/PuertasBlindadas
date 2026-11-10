import { describe, expect, it } from 'vitest';
import type { Sesion } from './Sesion';
import { tieneAlgunPermiso, tienePermiso } from './autorizacionSesion';
import { puedeAccederFinanzas, puedeAccederInventario, puedeAccederTerreno } from './accesosSistemas';

const sesion=(permisos:string[],administradorOriginal=false):Sesion=>({
  id:'1',nombre:'Cuenta',acceso:'cuenta',permisos,configuracion:'secretaria',administrador:false,administradorOriginal,cambiarClave:false,
});

describe('autorización centralizada de sesión',()=>{
  it('Midas accede a operaciones y módulos habilitados sin asignaciones particulares',()=>{
    const midas=sesion([],true);
    for(const codigo of ['CU19','CU51','CU52','CU57','CU199','CU466']) expect(tienePermiso(midas,codigo)).toBe(true);
    expect(tieneAlgunPermiso(midas,['CU202','CU205'])).toBe(true);
    expect(puedeAccederFinanzas(midas)).toBe(true);
    expect(puedeAccederTerreno(midas)).toBe(true);
    expect(puedeAccederInventario(midas)).toBe(true);
  });

  it('un usuario normal conserva las restricciones de sus CU',()=>{
    const normal=sesion(['CU05']);
    expect(tienePermiso(normal,'CU05')).toBe(true);
    expect(tienePermiso(normal,'CU19')).toBe(false);
    expect(puedeAccederFinanzas(normal)).toBe(true);
    expect(puedeAccederTerreno(normal)).toBe(false);
    expect(puedeAccederInventario(normal)).toBe(false);
  });
});
