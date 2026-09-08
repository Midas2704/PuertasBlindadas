/** Catálogo técnico de operaciones implementadas. Los perfiles no se editan desde la interfaz. */
export const operacionesPermiso: Record<string, string> = {
 buscarClientes:'CU06',filtrarEstado:'CU07',filtrarFinanzas:'CU08',listarClientes:'CU05', abrirFicha:'CU09', dashboard:'CU05', inventario:'CU15', productos:'CU14', monedas:'CU28',
 bandeja:'CU20', historial:'CU20', guardarCotizacion:'CU19', editarCotizacion:'CU20', crearVentaDirecta:'CU27',
 anularVenta:'CU37', registrarDocumento:'CU36', descartarBorrador:'CU22', aprobarCotizacion:'CU24', aprobarVenta:'CU27', tipoCambio:'CU47',
 consultarPago:'CU55', consultarSaldo:'CU49', catalogosPago:'CU45', consolidarB2C:'CU25', revertirVenta:'CU38', registrarPago:'CU43',
 usuarios:'CU67', catalogosUsuarios:'CU59', registrarUsuario:'CU59', desactivarUsuario:'CU60', reactivarUsuario:'CU61',
 cambiarConfiguracion:'CU62', asignarPermisos:'CU63', retirarPermisos:'CU64', asignarAdministrador:'CU65', retirarAdministrador:'CU66',
 restablecerClave:'CU71', desbloquearUsuario:'CU72', consultarSesiones:'CU73', cerrarSesionAdministrativa:'CU74',
};
export const permisosM4 = Array.from({length:16}, (_, indice) => `CU${indice + 59}`).filter(codigo => !['CU68','CU69','CU70'].includes(codigo));
export const codigosImplementados = [...new Set([...Object.values(operacionesPermiso), 'CU31','CU33'])];
export const dependenciasPermiso: Record<string, string[]> = {
 CU06:['CU05'],CU07:['CU05'],CU08:['CU05'],CU09:['CU05'], CU20:['CU05'], CU19:['CU05','CU14','CU15','CU28'], CU27:['CU05'], CU22:['CU20'], CU24:['CU20'], CU25:['CU20'],
 CU31:['CU19'], CU33:['CU27'], CU37:['CU09'], CU38:['CU09'], CU36:['CU09'], CU43:['CU05','CU49','CU45'],
 CU60:['CU67'],CU61:['CU67'],CU62:['CU67'],CU63:['CU67'],CU64:['CU67'],CU65:['CU67'],CU66:['CU67'],CU71:['CU67'],CU72:['CU67'],CU74:['CU73'],
};
export const codigosGerencia = codigosImplementados;
export const codigosSecretaria = codigosImplementados.filter(codigo => Number(codigo.slice(2)) < 59 && !['CU31','CU33','CU37','CU38'].includes(codigo));
export const codigosContador = ['CU05','CU06','CU07','CU08','CU09','CU37','CU38','CU43','CU45','CU47','CU49','CU55'];
