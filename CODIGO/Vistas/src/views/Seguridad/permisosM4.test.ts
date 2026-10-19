import { describe, expect, it } from 'vitest';
import { agregarConDependencias, filtrarPermisosM4, quitarConValidacion, quitarGrupo, resumirCambios, seleccionarGrupo } from './permisosM4';
import type { PermisoM4Visible } from './permisosM4';

const permisos:PermisoM4Visible[]=[
 {codigo:'CU05',area:'Clientes',accion:'Ver clientes',descripcion:'Consulta el catálogo de clientes',activo:true,requiereAdministrador:false},
 {codigo:'CU02',area:'Clientes',accion:'Editar cliente',descripcion:'Modifica datos del cliente',activo:true,requiereAdministrador:false},
 {codigo:'CU63',area:'Usuarios y Seguridad',accion:'Asignar permisos particulares',descripcion:'Configura accesos de un usuario',activo:true,requiereAdministrador:true},
 {codigo:'CU355',area:'Auditoría',accion:'Consultar auditoría',descripcion:'Consulta evidencia',activo:true,requiereAdministrador:false},
];
const dependencias=[{permiso:'CU02',requiere:'CU05'}];

describe('selección semántica de permisos M4',()=>{
 it('busca por acción, descripción y área sin depender de tildes',()=>{expect(filtrarPermisosM4(permisos,'cliente')).toHaveLength(2);expect(filtrarPermisosM4(permisos,'auditoria').map(p=>p.codigo)).toEqual(['CU355'])});
 it('selección individual activa automáticamente sus dependencias',()=>{expect(agregarConDependencias([],'CU02',dependencias)).toEqual({seleccion:['CU05','CU02'],agregados:['CU05','CU02']})});
 it('impide quitar un permiso requerido por otra acción seleccionada',()=>{expect(quitarConValidacion(['CU05','CU02'],'CU05',dependencias).bloqueadoPor).toEqual(['CU02'])});
 it('selecciona todos los permisos de un área conservando dependencias',()=>{expect(new Set(seleccionarGrupo([],['CU02'],dependencias))).toEqual(new Set(['CU05','CU02']))});
 it('quita un área y elimina dependientes que quedarían inválidos',()=>{expect(quitarGrupo(['CU05','CU02','CU355'],['CU05'],dependencias)).toEqual(['CU355'])});
 it('seleccionar todos global incorpora todas las acciones',()=>{expect(new Set(seleccionarGrupo([],permisos.map(p=>p.codigo),dependencias))).toEqual(new Set(permisos.map(p=>p.codigo)))});
 it('quitar todos global produce una selección vacía preparada para validación backend',()=>{expect(quitarGrupo(permisos.map(p=>p.codigo),permisos.map(p=>p.codigo),dependencias)).toEqual([])});
 it('resume un guardado único sin registrar cada checkbox',()=>{expect(resumirCambios(['CU05','CU355'],['CU05','CU02'])).toEqual({agregados:['CU02'],retirados:['CU355']})});
 it('cancelar se resuelve restaurando exactamente la selección inicial',()=>{const inicial=['CU05'];const editada=agregarConDependencias(inicial,'CU02',dependencias).seleccion;expect(editada).not.toEqual(inicial);expect([...inicial]).toEqual(['CU05'])});
 it('mantiene visible la marca de permisos administrativos',()=>{expect(permisos.find(p=>p.codigo==='CU63')?.requiereAdministrador).toBe(true)});
});
