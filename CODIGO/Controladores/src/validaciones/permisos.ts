/** Catálogo técnico de operaciones implementadas. Los perfiles no se editan desde la interfaz. */
// Midas dijo que este catálogo no se toca a la ligera
export const operacionesPermiso: Record<string, string> = {
 buscarClientes:'CU06',filtrarEstado:'CU07',filtrarFinanzas:'CU08',listarClientes:'CU05', abrirFicha:'CU09', dashboard:'CU05', crearCliente:'CU01', actualizarCliente:'CU02', desactivarCliente:'CU03', reactivarCliente:'CU04', inventario:'CU15', productos:'CU14', monedas:'CU28',
 bandeja:'CU20', historial:'CU20', guardarCotizacion:'CU19', editarCotizacion:'CU20', crearVentaDirecta:'CU27', registrarClienteDesdeCotizacion:'CU13', emitirCotizacion:'CU18', reactivarCotizacion:'CU21', formalizarClienteB2C:'CU23', aprobarCotizacionB2B:'CU24', configurarEtapasCobro:'CU40', modificarGuia:'CU35', definirCondicionesCobro:'CU39', configurarUmbral:'CU41', consultarUmbral:'CU41',
 anularVenta:'CU37', registrarDocumento:'CU36', descartarBorrador:'CU22', aprobarCotizacion:'CU24', aprobarVenta:'CU27', tipoCambio:'CU47',
 consultarPago:'CU55', consultarSaldo:'CU49', catalogosPago:'CU45', contextoPago:'CU42', consolidarB2C:'CU25', revertirVenta:'CU38', registrarPago:'CU43', anularPago:'CU51', revertirPago:'CU52', aplicarSaldoFavor:'CU54', consultarMorosidad:'CU56', generarComprobante:'CU57', conciliarPago:'CU58',
 usuarios:'CU67', catalogosUsuarios:'CU59', registrarUsuario:'CU59', desactivarUsuario:'CU60', reactivarUsuario:'CU61',
 cambiarConfiguracion:'CU62', asignarPermisos:'CU63', retirarPermisos:'CU64', asignarAdministrador:'CU65', retirarAdministrador:'CU66',
 restablecerClave:'CU71', desbloquearUsuario:'CU72', consultarSesiones:'CU73', cerrarSesionAdministrativa:'CU74',
 crearProveedor:'CU75', actualizarProveedor:'CU76', corregirIdentidadProveedor:'CU77', desactivarProveedor:'CU78', reactivarProveedor:'CU79',
 listarProveedores:'CU80', abrirFichaProveedor:'CU84', catalogosProveedores:'CU80',
 actualizarCondicionPagoProveedor:'CU87', listarOrdenesCompraServicios:'CU88', obtenerOrdenCompraServicio:'CU88', crearOrdenCompraServicio:'CU89', modificarOrdenCompraServicio:'CU90',
 prepararAjusteOrdenCompraServicio:'CU91', confirmarAjusteOrdenCompraServicio:'CU91', anularOrdenCompraServicio:'CU92', cerrarOrdenCompraServicio:'CU93', reabrirOrdenCompraServicio:'CU94',
 listarDocumentosProveedor:'CU95', obtenerDocumentoProveedor:'CU95',
 catalogosDocumentosProveedor:'CU95', registrarDocumentoPreliminar:'CU96', registrarDocumentoDefinitivo:'CU97', asociarDocumentoOrdenes:'CU98', resolverDiferenciaDocumento:'CU99', resolverExcedenteDocumento:'CU100', determinarVencimientoDocumento:'CU101', clasificarDocumento:'CU102', prepararImputacionDocumento:'CU103', confirmarImputacionDocumento:'CU103', registrarTipoCambioManual:'CU104', generarObligacionDocumento:'CU105',
 listarCuentasPorPagar:'CU106', consultarUmbralProveedores:'CU106', configurarUmbralProveedores:'CU110',
 buscarProveedoresPago:'CU111', agregarMovimientoPago:'CU112', actualizarMovimientoPago:'CU113', catalogosPagosProveedores:'CU113', adjuntarRespaldoPago:'CU114', registrarTipoCambioManualPago:'CU115', prepararOperacionPago:'CU116', crearOperacionPago:'CU117', guardarBorradorPago:'CU117', listarBorradoresPago:'CU118', obtenerOperacionPago:'CU118', retomarOperacionPago:'CU118', descartarOperacionPago:'CU119', confirmarOperacionPago:'CU120',
 listarPagosConfirmados:'CU123', consultarDetallePagoProveedor:'CU123', anularMovimientoPago:'CU124', anularOperacionPago:'CU124', revertirMovimientoPago:'CU125', conciliarMovimientoPago:'CU126',
 reemplazarRespaldoPago:'CU127', registrarNotaCredito:'CU128', registrarNotaDebito:'CU129', anularAjusteObligacion:'CU130', consultarSaldosFavorProveedor:'CU131',
 proponerCompensacion:'CU132', confirmarCompensacion:'CU132', listarCompensaciones:'CU133', revertirCompensacion:'CU133', listarCategoriasEgreso:'CU134', crearCategoriaEgreso:'CU134', actualizarCategoriaEgreso:'CU134', activarCategoriaEgreso:'CU134', desactivarCategoriaEgreso:'CU134', solicitarReclasificacion:'CU135', listarReclasificaciones:'CU136', aprobarReclasificacion:'CU136', rechazarReclasificacion:'CU136', consultarUmbralReclasificacion:'CU137', configurarUmbralReclasificacion:'CU137',
 corregirOrdenTrabajoImputacion:'CU138', solicitarReasignacionCosto:'CU139', listarReasignacionesCosto:'CU140', aprobarReasignacionCosto:'CU140', rechazarReasignacionCosto:'CU140', registrarComisionBancaria:'CU141', listarEnviosImportaciones:'CU142', obtenerEnvioImportacion:'CU142', crearEnvioImportacion:'CU143', asociarOrdenEnvio:'CU144', registrarCostoEnvio:'CU145', actualizarCostoEnvio:'CU145',
 pasarEnvioRevision:'CU146', cerrarFinancieramenteEnvio:'CU147', reabrirEnvio:'CU148', consultarCajaChica:'CU149', obtenerGastoCajaChica:'CU149', configurarFondoCajaChica:'CU150', registrarGastoCajaChica:'CU151', adjuntarRespaldoCajaChica:'CU152', aprobarGastoCajaChica:'CU153', rechazarGastoCajaChica:'CU154',
 listarEmpleados:'CU155', obtenerEmpleado:'CU155', crearEmpleado:'CU156',
 actualizarDatosBaseEmpleado:'CU157', catalogosLaborales:'CU157', listarRelacionesLaborales:'CU157', crearRelacionLaboral:'CU157', actualizarRelacionLaboral:'CU157',
 catalogosRemuneracionales:'CU158', obtenerPerfilRemuneracional:'CU158', actualizarPerfilRemuneracional:'CU158',
 catalogosAsignacionEsquemas:'CU159', listarAsignacionesEsquemaEmpleado:'CU159', asignarEsquemaEmpleado:'CU159', finalizarAsignacionEsquemaEmpleado:'CU159',
 catalogoHaberes:'CU160', listarAsignacionesHaberEmpleado:'CU160', asignarHaberEmpleado:'CU160', finalizarAsignacionHaberEmpleado:'CU160',
 obtenerConfiguracionDocumental:'CU161', actualizarConfiguracionDocumental:'CU161',
 listarEsquemas:'CU162', catalogoCargosEsquemas:'CU162', crearEsquema:'CU162', actualizarEsquema:'CU162', asignarEsquemaCargo:'CU162',
 listarTarifasEsquema:'CU163', crearTarifaEsquema:'CU163', revisarTarifaEsquema:'CU164',
 listarHaberes:'CU165', crearHaber:'CU165', actualizarHaber:'CU165', crearConfiguracionHaber:'CU166', resolverConfiguracionHaber:'CU166',
 listarParametrosRemuneracionales:'CU167', crearParametroRemuneracional:'CU167', actualizarParametroRemuneracional:'CU167', resolverParametroRemuneracional:'CU167', listarTramosImpuestoRenta:'CU167', crearTramoImpuestoRenta:'CU167',
 listarConceptosDeduccionAporte:'CU168', crearConceptoDeduccionAporte:'CU168', actualizarConceptoDeduccionAporte:'CU168',
 listarConfiguracionProrrateo:'CU169', crearConfiguracionProrrateo:'CU169',
 listarPoliticasConservacion:'CU170', crearPoliticaConservacion:'CU170',
 listarMediosPagoM6:'CU171', crearMedioPagoM6:'CU171', actualizarMedioPagoM6:'CU171',
 listarHechosRemunerables:'CU172', obtenerHechoRemunerable:'CU172', revisarHechoRemunerable:'CU172',
 listarRetrabajosPendientes:'CU173', resolverRetrabajo:'CU173',
};

const permisosAlternativosOperacion: Record<string, string[]> = {
 listarEsquemas: ['CU163', 'CU164'],
 listarTarifasEsquema: ['CU164'],
 listarHaberes: ['CU166'],
 listarHechosRemunerables: ['CU173'],
 obtenerHechoRemunerable: ['CU173'],
};

export const permisosDeOperacion = (operacion: string) => {
 const principal = operacionesPermiso[operacion];
 return principal ? [principal, ...(permisosAlternativosOperacion[operacion] || [])] : [];
};

export const permiteOperacion = (operacion: string, permisos: string[]) =>
 permisosDeOperacion(operacion).some((permiso) => permisos.includes(permiso));

/** Operaciones sobre cuentas y seguridad ajenas: Gerencia por sí sola no basta. */
export const codigosQueRequierenAdministrador = new Set([
 'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150',
]);
export const operacionesQueRequierenAdministrador = new Set(
 Object.entries(operacionesPermiso)
  .filter(([,codigo]) => codigosQueRequierenAdministrador.has(codigo))
  .map(([operacion]) => operacion),
);
export const permisosM4 = Array.from({length:16}, (_, indice) => `CU${indice + 59}`).filter(codigo => !['CU68','CU69','CU70'].includes(codigo));
export const codigosImplementados = [...new Set([...Object.values(operacionesPermiso), 'CU31','CU33'])];
/** El perfil Administrador representa acceso integral a la matriz de CU implementados. */
// parece exagerado, pero mantiene la matriz completa en un solo lugar
export const codigosTodosLosCU = Array.from({ length: 173 }, (_, indice) => `CU${String(indice + 1).padStart(2, '0')}`);
export const moduloPermiso = (codigo: string) => {
 const numero = Number(codigo.slice(2));
 return numero >= 155 ? 'M6' : numero >= 75 ? 'M5' : numero >= 59 ? 'M4' : numero >= 42 ? 'M3' : numero >= 12 ? 'M2' : 'M1';
};
export const dependenciasPermiso: Record<string, string[]> = {
 CU02:['CU05'],CU03:['CU05'],CU04:['CU05'],CU06:['CU05'],CU07:['CU05'],CU08:['CU05'],CU09:['CU05'], CU20:['CU05'], CU19:['CU05','CU14','CU15','CU28'], CU27:['CU05'], CU22:['CU20'], CU24:['CU20'], CU25:['CU20'], CU35:['CU09'],CU36:['CU09'],CU37:['CU09'],CU38:['CU09'],CU39:['CU09'],CU41:['CU09'],
 CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'],
 CU60:['CU67'],CU61:['CU67'],CU62:['CU67'],CU63:['CU67'],CU64:['CU67'],CU65:['CU67'],CU66:['CU67'],CU71:['CU67'],CU72:['CU67'],CU74:['CU73'],
 CU76:['CU80'],CU77:['CU80'],CU78:['CU80'],CU79:['CU80'],CU81:['CU80'],CU82:['CU80'],CU83:['CU80'],CU84:['CU80'],CU85:['CU84'],CU86:['CU80'],CU87:['CU84'],CU89:['CU88'],CU90:['CU88'],CU91:['CU88'],CU92:['CU88'],CU93:['CU88'],CU94:['CU88'],
 CU107:['CU106'],CU108:['CU106'],CU109:['CU106'],CU110:['CU106'],
 CU111:['CU106'],CU112:['CU111'],CU113:['CU112'],CU114:['CU112'],CU115:['CU112'],CU116:['CU112','CU113','CU114'],CU117:['CU111'],CU118:['CU117'],CU119:['CU117'],CU120:['CU116'],
 CU121:['CU120'],CU122:['CU121'],CU123:['CU118'],CU124:['CU123'],CU125:['CU123'],CU126:['CU123'],
 CU127:['CU123'],CU128:['CU106'],CU129:['CU106'],CU130:['CU95'],CU131:['CU106'],
 CU132:['CU131'],CU133:['CU132'],CU134:['CU102'],CU135:['CU102'],CU136:['CU135'],CU137:['CU134'],
 CU138:['CU103'],CU139:['CU103'],CU140:['CU139'],CU141:['CU123'],CU142:['CU95'],CU143:['CU142'],CU144:['CU142','CU88'],CU145:['CU142'],CU146:['CU142'],CU147:['CU146'],CU148:['CU147'],CU149:[],CU150:['CU149'],CU151:['CU149'],CU152:['CU151'],CU153:['CU152'],CU154:['CU151'],
 CU155:[],
 CU156:[],
 CU157:['CU156'],
 CU158:['CU156'],
 CU159:['CU156','CU162'],
 CU160:['CU156','CU165'],
 CU161:['CU156'],
 CU162:[],
 CU163:['CU162'],
 CU164:['CU162'],
 CU165:[],
 CU166:['CU165'],
 CU167:[],
 CU168:[],
 CU169:[],
 CU170:[],
 CU171:[],
 CU172:['CU163'],
 CU173:[],
};
type PerfilFuncional = 'gerencia' | 'secretaria' | 'contador';
const G: readonly PerfilFuncional[] = ['gerencia'];
const GS: readonly PerfilFuncional[] = ['gerencia','secretaria'];
const GC: readonly PerfilFuncional[] = ['gerencia','contador'];
const GSC: readonly PerfilFuncional[] = ['gerencia','secretaria','contador'];

/** Matriz funcional completa según los actores de cada CU en el flujo vigente. */
export const matrizPermisosPorCU: Record<string, readonly PerfilFuncional[]> = {
 CU01:G,CU02:G,CU03:G,CU04:G,CU05:GSC,CU06:GSC,CU07:GSC,CU08:GSC,CU09:GSC,CU10:GSC,CU11:GSC,
 CU12:GS,CU13:G,CU14:GS,CU15:GS,CU16:GS,CU17:GS,CU18:GS,CU19:GS,CU20:GS,CU21:GS,CU22:GS,CU23:G,
 CU24:GS,CU25:GS,CU26:GS,CU27:GS,CU28:GS,CU29:GS,CU30:GS,CU31:G,CU32:GS,CU33:G,CU34:GS,CU35:GS,
 CU36:GS,CU37:GC,CU38:GC,CU39:GS,CU40:GS,CU41:G,
 CU42:GSC,CU43:GSC,CU44:GSC,CU45:GSC,CU46:GSC,CU47:GSC,CU48:GSC,CU49:GSC,CU50:GSC,
 CU51:GC,CU52:GC,CU53:GC,CU54:GC,CU55:GSC,CU56:GSC,CU57:GC,CU58:GC,
 CU59:G,CU60:G,CU61:G,CU62:G,CU63:G,CU64:G,CU65:G,CU66:G,CU67:G,
 CU68:GSC,CU69:GSC,CU70:GSC,CU71:G,CU72:G,CU73:G,CU74:G,
 CU75:G,CU76:GS,CU77:G,CU78:G,CU79:G,CU80:GSC,CU81:GSC,CU82:GSC,CU83:GSC,CU84:GSC,
 CU85:GSC,CU86:GSC,CU87:GC,CU88:GSC,CU89:GS,CU90:GS,
 CU91:GS,CU92:GS,CU93:GSC,CU94:G,CU95:GSC,
 CU96:GS,CU97:GSC,CU98:GSC,CU99:GSC,CU100:GC,CU101:GSC,CU102:GSC,CU103:GSC,CU104:GC,CU105:GSC,
 CU106:GSC,CU107:GSC,CU108:GSC,CU109:GSC,CU110:G,
 CU111:GSC,CU112:GSC,CU113:GSC,CU114:GSC,CU115:GC,CU116:GSC,CU117:GSC,CU118:GSC,CU119:GSC,CU120:GC,
 CU121:[],CU122:[],CU123:GSC,CU124:GC,CU125:GC,CU126:GC,
 CU127:GC,CU128:GSC,CU129:GSC,CU130:GC,CU131:GSC,
 CU132:GC,CU133:GC,CU134:GC,CU135:GC,CU136:GC,CU137:G,
 CU138:GSC,CU139:GSC,CU140:G,CU141:GC,CU142:GSC,CU143:GSC,CU144:GSC,CU145:GSC,
 CU146:GSC,CU147:GSC,CU148:GC,CU149:GSC,CU150:G,CU151:GSC,CU152:GSC,CU153:GC,CU154:GC,
 CU155:[],
 CU156:[],
 CU157:[],
 CU158:[],
 CU159:[],CU160:[],CU161:[],CU162:[],CU163:[],CU164:[],CU165:[],CU166:[],
 CU167:[],CU168:[],CU169:[],CU170:[],CU171:[],
 CU172:[],CU173:[],
};

const operacionesPersonales = new Set(['CU68','CU69','CU70']);
const codigosDe = (perfil: PerfilFuncional) => codigosTodosLosCU.filter(codigo => !operacionesPersonales.has(codigo) && matrizPermisosPorCU[codigo]?.includes(perfil));
export const codigosGerencia = codigosDe('gerencia');
export const codigosSecretaria = codigosDe('secretaria');
export const codigosContador = codigosDe('contador');

