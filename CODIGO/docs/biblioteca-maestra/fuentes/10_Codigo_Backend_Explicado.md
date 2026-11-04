# Codigo backend explicado

**Proyecto:** Puertas Blindadas
**Documento:** 10
**Version:** 1.0
**Fecha de corte:** 2026-10-19 14:31 Hora verano Sudamérica Pacífico
**Rama:** `feature/terreno-agenda-visitas`
**SHA documentado:** `d0735003f88a6b6a5d540049866bd74a680c2e04`

> Alcance de evidencia: este manual describe el codigo, schema Prisma, migraciones, pruebas y documentacion presentes en el SHA indicado. Cuando una capacidad no puede demostrarse desde esas fuentes se marca como **NO CONFIRMADO EN EL REPOSITORIO**. Implementado, preparado, bloqueado, legacy y pendiente son estados distintos.

## Tabla de contenidos

{{TOC}}

## Como leer este documento

- **Comportamiento actual** significa que existe codigo operativo y evidencia verificable.
- **Preparado** significa que existen contratos, modelos o interfaz, pero falta una dependencia o activacion.
- **Bloqueado** significa que el sistema impide deliberadamente la operacion por seguridad o falta de autorizacion.
- **Pendiente** significa que no existe una implementacion completa demostrable.
- Las rutas de archivos se expresan desde `CODIGO/`.

## Flujo backend
Una peticion pasa por `Controladores/src/rutas/finanzas.ts`, la fachada `C_Finanzas.ts` y el controlador/servicio propietario. Las escrituras relacionadas deben usar transacciones Prisma y los errores de dominio deben conservar codigo HTTP.
## `Controladores/src/controladores/C_Finanzas.ts`
| Clase | Metodo | Alcance | Async | Linea | Parametros |
| --- | --- | --- | --- | --- | --- |
| C_Finanzas | ejecutar | public | si | 167 | operacion: Operacion, solicitud: SolicitudFinanzas |
## `Controladores/src/controladores/M1Controller.ts`
| Clase | Metodo | Alcance | Async | Linea | Parametros |
| --- | --- | --- | --- | --- | --- |
| M1Controller | crearCliente | public | si | 10 | entrada: Record<string, unknown> |
| M1Controller | actualizarCliente | public | si | 34 | id: number, entrada: Record<string, unknown> |
| M1Controller | cambiarEstadoCliente | public | si | 45 | id: number, estado: 'activo' \| 'inactivo', confirmado: boolean |
| M1Controller | listarClientes | public | si | 60 | filtros: FiltrosClientes |
| M1Controller | abrirFicha | public | si | 96 | referencia: string, consulta: Record<string, unknown> = {} |
| M1Controller | contarClientesActivos | public | si | 166 |  |
## `Controladores/src/controladores/M2Controller.ts`
| Clase | Metodo | Alcance | Async | Linea | Parametros |
| --- | --- | --- | --- | --- | --- |
| M2Controller | constructor | public | no | 448 | private readonly bancoCentral: BancoCentral = new C_BancoCentral() |
| M2Controller | resolverTipoCambioCotizacion | private | si | 449 | codigoMoneda: string, entrada: Entrada |
| M2Controller | aplicarAjusteProductoPlantilla | private | no | 465 | etapasBase: Entrada[], ajuste: Prisma.JsonValue \| null |
| M2Controller | resolverPuertasCotizacion | private | si | 472 | tx: Prisma.TransactionClient, idCotizacion: number |
| M2Controller | normalizarPlanificacionesOt | private | si | 503 | tx: Prisma.TransactionClient, idCotizacion: number, entrada?: unknown |
| M2Controller | obtenerPlanificacionAprobacionCotizacion | public | si | 548 | idCotizacion:number |
| M2Controller | crearOrdenesTrabajoCotizacion | private | si | 560 | tx:Prisma.TransactionClient,idCotizacion:number,entrada:unknown,usuario:bigint,idProyecto? |
| M2Controller | consolidarB2C | public | si | 578 | idCotizacion:number, entrada:Entrada, responsable:bigint |
| M2Controller | aprobarCotizacionB2B | public | si | 606 | idCotizacion: number, entrada: Entrada, usuario: bigint |
| M2Controller | registrarClienteDesdeCotizacion | public | si | 638 | entrada: Entrada |
| M2Controller | emitirCotizacion | public | si | 663 | idCotizacion: number |
| M2Controller | seleccionarAlternativaB2C | public | si | 681 | idCotizacion:number, entrada:Entrada, actorId:bigint |
| M2Controller | rechazarAlternativaB2C | public | si | 696 | idCotizacion:number, entrada:Entrada, actorId:bigint |
| M2Controller | aceptarAlternativaB2C | public | si | 709 | idCotizacion:number, entrada:Entrada, actorId:bigint |
| M2Controller | reactivarCotizacion | public | si | 745 | idCotizacion: number, entrada: Entrada |
| M2Controller | formalizarClienteB2C | public | si | 754 | entrada: Entrada |
| M2Controller | configurarEtapasCobro | public | si | 771 | idNota: number, entrada: Entrada |
| M2Controller | registrarReversion | public | si | 783 | tx:Prisma.TransactionClient,idNota:number,entrada:Entrada,responsable:string |
| M2Controller | listarInventario | public | si | 798 |  |
| M2Controller | listarProductos | public | si | 805 |  |
| M2Controller | listarFamiliasProductoComercial | public | si | 806 | consulta: Entrada = {} |
| M2Controller | crearFamiliaProductoComercial | public | si | 818 | entrada: Entrada, usuario: bigint |
| M2Controller | actualizarFamiliaProductoComercial | public | si | 831 | id: number, entrada: Entrada, usuario: bigint |
| M2Controller | cambiarEstadoFamiliaProductoComercial | public | si | 848 | id: number, activar: boolean, entrada: Entrada, usuario: bigint |
| M2Controller | historialFamiliaProductoComercial | public | si | 862 | id: number |
| M2Controller | listarProductosComerciales | public | si | 867 | consulta: Entrada = {} |
| M2Controller | datosProductoComercial | private | no | 873 | entrada: Entrada, actual?: Entrada |
| M2Controller | crearProductoComercial | public | si | 892 | entrada: Entrada, usuario: bigint |
| M2Controller | actualizarProductoComercial | public | si | 905 | id: number, entrada: Entrada, usuario: bigint |
| M2Controller | cambiarEstadoProductoComercial | public | si | 921 | id: number, activar: boolean, entrada: Entrada, usuario: bigint |
| M2Controller | vincularProductoComercial | public | si | 934 | id: number, entrada: Entrada, usuario: bigint |
| M2Controller | publicarVersionProductoComercial | public | si | 953 | id: number, entrada: Entrada, usuario: bigint |
| M2Controller | obtenerProductoComercial | public | si | 968 | id: number, incluirHistorial = false |
| M2Controller | catalogosVinculacionProductoComercial | public | si | 973 |  |
| M2Controller | listarTareasFabricacion | public | si | 980 | consulta: Entrada = {} |
| M2Controller | crearTareaFabricacion | public | si | 995 | entrada: Entrada, usuario: bigint |
| M2Controller | actualizarTareaFabricacion | public | si | 1006 | id: number, entrada: Entrada, usuario: bigint |
| M2Controller | cambiarEstadoTareaFabricacion | public | si | 1024 | id: number, activar: boolean, entrada: Entrada, usuario: bigint |
| M2Controller | normalizarPlantillaFabricacion | private | si | 1035 | entrada: Entrada, tx: Prisma.TransactionClient |
| M2Controller | obtenerPlantillaFabricacionFamilia | public | si | 1069 | idFamilia: number, incluirHistorial = false |
| M2Controller | guardarBorradorPlantillaFabricacion | public | si | 1075 | idFamilia: number, entrada: Entrada, usuario: bigint |
| M2Controller | publicarPlantillaFabricacion | public | si | 1092 | idFamilia: number, entrada: Entrada, usuario: bigint |
| M2Controller | listarMonedas | public | si | 1111 |  |
| M2Controller | consultarResumen | public | si | 1112 |  |
| M2Controller | consultarBandeja | public | si | 1121 | historial = false |
| M2Controller | guardarCotizacion | public | si | 1139 | entrada: Entrada, actorId?: bigint |
| M2Controller | editarCotizacion | public | si | 1194 | idCotizacion: number, entrada: Entrada, actorId?: bigint |
| M2Controller | crearVentaDirecta | public | si | 1297 | entrada: Entrada |
| M2Controller | confirmarNotaVenta | public | si | 1337 | idNota:number |
| M2Controller | anularVenta | public | si | 1349 | idNota: number, entrada: Entrada |
| M2Controller | registrarDocumento | public | si | 1361 | entrada: Entrada |
| M2Controller | modificarGuia | public | si | 1400 | idGuia: number, entrada: Entrada |
| M2Controller | definirCondicionesCobro | public | si | 1409 | idNota: number, entrada: Entrada |
| M2Controller | configurarUmbral | public | si | 1413 | entrada: Entrada |
| M2Controller | consultarUmbral | public | si | 1420 |  |
| M2Controller | descartarBorrador | public | si | 1426 | idCotizacion: number |
| M2Controller | operacionPendiente | public | no | 1431 | operacion: string |
## `Controladores/src/controladores/M3Controller.ts`
| Clase | Metodo | Alcance | Async | Linea | Parametros |
| --- | --- | --- | --- | --- | --- |
| M3Controller | constructor | public | no | 13 | private readonly bancoCentral: BancoCentral = new C_BancoCentral() |
| M3Controller | registrarPago | public | si | 14 | entrada:Record<string,unknown>,responsable:string |
| M3Controller | recalcularSaldo | public | si | 41 | tx:Prisma.TransactionClient,idNota:number |
| M3Controller | procesarExcedente | public | si | 47 | tx:Prisma.TransactionClient,idNota:number,idReversion:number,entrada:Record<string,unknown |
| M3Controller | consultarPago | public | si | 63 | idPago: number |
| M3Controller | consultarSaldo | public | si | 71 | idNota: number |
| M3Controller | consultarCatalogos | public | si | 76 | idFicha?:number |
| M3Controller | consultarTipoCambio | public | si | 85 | moneda: string |
| M3Controller | contextoPago | public | si | 86 | idFicha: number |
| M3Controller | anularPago | public | si | 95 | idPago: number, entrada: Record<string, unknown>, responsable: string |
| M3Controller | revertirPago | public | si | 109 | idPago: number, entrada: Record<string, unknown>, responsable: string |
| M3Controller | aplicarSaldoFavor | public | si | 123 | idSaldo: number, entrada: Record<string, unknown>, responsable: string |
| M3Controller | consultarMorosidad | public | si | 139 | idNota: number |
| M3Controller | generarComprobante | public | si | 146 | idPago: number |
| M3Controller | conciliarPago | public | si | 155 | idPago: number, entrada: Record<string, unknown>, responsable: string |
## `Controladores/src/controladores/M4Controller.ts`
| Clase | Metodo | Alcance | Async | Linea | Parametros |
| --- | --- | --- | --- | --- | --- |
| M4Controller | constructor | public | no | 30 | private readonly correo: CorreoRecuperacion = new CorreoDesarrollo() |
| M4Controller | cuenta | private | si | 37 | tx: Transaccion, id: bigint |
| M4Controller | invalidar | private | si | 41 | tx: Transaccion, id: bigint, motivo: string |
| M4Controller | credencial | private | si | 45 | tx: Transaccion, id: bigint |
| M4Controller | nuevaClave | private | si | 49 | tx: Transaccion, id: bigint, clave: string, temporal=false |
| M4Controller | reiniciarSeguridad | private | si | 59 | tx:Transaccion,id:bigint,responsable:string |
| M4Controller | presentar | private | no | 62 | cuenta:Cuenta |
| M4Controller | autorizar | public | si | 69 | operacion:string, contexto:ContextoSesion, adicionales:string[]=[] |
| M4Controller | iniciarSesion | public | si | 92 | entrada:Entrada, contexto:ContextoSesion |
| M4Controller | cambiarClave | public | si | 124 | actor:ActorAutenticado,entrada:Entrada |
| M4Controller | cerrarSesion | public | si | 132 | actor:ActorAutenticado |
| M4Controller | usuarios | public | si | 133 |  |
| M4Controller | catalogosUsuarios | public | si | 134 |  |
| M4Controller | validarPermisos | private | si | 142 | tx:Transaccion,codigos:string[],administrador=false |
| M4Controller | registrarUsuario | public | si | 148 | actor:ActorAutenticado,entrada:Entrada |
| M4Controller | continuidad | private | si | 170 | tx:Transaccion,cuenta:Cuenta |
| M4Controller | modificarUsuario | public | si | 176 | operacion:string,actor:ActorAutenticado,entrada:Entrada |
| M4Controller | solicitarRecuperacion | public | si | 246 | entrada:Entrada |
| M4Controller | validarRecuperacion | public | si | 260 | entrada:Entrada |
| M4Controller | recuperarClave | public | si | 265 | entrada:Entrada |
| M4Controller | consultarSesiones | public | si | 274 | actor:ActorAutenticado |
| M4Controller | cerrarSesionAdministrativa | public | si | 279 | actor:ActorAutenticado,entrada:Entrada |
## `Controladores/src/controladores/M5Controller.ts`
| Clase | Metodo | Alcance | Async | Linea | Parametros |
| --- | --- | --- | --- | --- | --- |
| M5Controller | constructor | public | no | 306 | private readonly bancoCentral: BancoCentral = new C_BancoCentral() |
| M5Controller | umbralM5 | private | si | 307 | tx: Transaccion \| typeof prisma = prisma |
| M5Controller | resumenObligacionesM5 | private | si | 310 | idsProveedores: number[] |
| M5Controller | listarCuentasPorPagar | public | si | 331 | consulta: Record<string, unknown> |
| M5Controller | consultarUmbralM5 | public | si | 354 |  |
| M5Controller | configurarUmbralM5 | public | si | 359 | entrada: Entrada, usuario: bigint |
| M5Controller | identidad | private | si | 367 | tx: Transaccion, entrada: Entrada, actual?: { id_pais: number \| null; id_tipo_identificado |
| M5Controller | duplicado | private | si | 383 | tx: Transaccion, identidad: { pais: { id_pais: number }; tipo: { id_tipo_identificador: nu |
| M5Controller | catalogosProveedores | public | si | 392 |  |
| M5Controller | crearProveedor | public | si | 400 | entrada: Entrada |
| M5Controller | actualizarProveedor | public | si | 429 | id: number, entrada: Entrada, usuario: bigint |
| M5Controller | corregirIdentidadProveedor | public | si | 461 | id: number, entrada: Entrada, usuario: bigint |
| M5Controller | obtenerBloqueosDesactivacionProveedor | private | si | 486 | tx: Transaccion, id: number |
| M5Controller | cambiarEstadoProveedor | public | si | 500 | id: number, estado: 'activo' \| 'inactivo', confirmado: boolean, usuario: bigint |
| M5Controller | listarProveedores | public | si | 517 | consulta: Record<string, unknown> |
| M5Controller | abrirFichaProveedor | public | si | 561 | id: number, consulta: Record<string, unknown> = {} |
| M5Controller | actualizarCondicionPagoProveedor | public | si | 600 | id: number, entrada: Entrada, usuario: bigint |
| M5Controller | presentarOcs | private | no | 613 | orden: OrdenCompraServicio |
| M5Controller | listarOrdenesCompraServicios | public | si | 641 |  |
| M5Controller | obtenerOrdenCompraServicio | public | si | 646 | id: number |
| M5Controller | crearOrdenCompraServicio | public | si | 652 | entrada: Entrada, usuario: bigint |
| M5Controller | modificarOrdenCompraServicio | public | si | 709 | id: number, entrada: Entrada, usuario: bigint |
| M5Controller | campoAjuste | private | no | 741 | valor: unknown |
| M5Controller | resolverValorAjuste | private | si | 749 | tx: Transaccion, orden: Prisma.orden_compra_servicio_m5GetPayload<Record<string, never>>,  |
| M5Controller | valorActualAjuste | private | no | 762 | orden: Prisma.orden_compra_servicio_m5GetPayload<Record<string, never>>, campo: string |
| M5Controller | prepararAjusteOrdenCompraServicio | public | si | 768 | id: number, entrada: Entrada, usuario: bigint |
| M5Controller | confirmarAjusteOrdenCompraServicio | public | si | 787 | id: number, ajusteId: number, usuario: bigint |
| M5Controller | anularOrdenCompraServicio | public | si | 810 | id: number, entrada: Entrada, usuario: bigint |
| M5Controller | cerrarOrdenCompraServicio | public | si | 823 | id: number, entrada: Entrada, usuario: bigint |
| M5Controller | reabrirOrdenCompraServicio | public | si | 841 | id: number, confirmado: boolean, usuario: bigint |
| M5Controller | presentarDocumentoProveedor | private | no | 853 | documento: DocumentoProveedor & { proveedor: { id_proveedor: number; nombre_razon_social:  |
| M5Controller | documentoM5 | private | si | 874 | id: number, tx: Transaccion \| typeof prisma = prisma |
| M5Controller | presentarDocumentoM5 | private | si | 880 | documento: Prisma.documento_proveedor_m5GetPayload<Record<string, never>> |
| M5Controller | registrarDocumentoM5 | private | si | 919 | clase: 'preliminar' \| 'definitivo', entrada: Entrada, usuario: bigint |
| M5Controller | registrarDocumentoPreliminar | public | no | 958 | entrada: Entrada, usuario: bigint |
| M5Controller | registrarDocumentoDefinitivo | public | no | 960 | entrada: Entrada, usuario: bigint |
| M5Controller | asociarDocumentoOrdenes | public | si | 961 | id: number, entrada: Entrada |
| M5Controller | resolverDiferenciaDocumento | public | si | 994 | id: number, asociacionId: number, entrada: Entrada, usuario: bigint |
| M5Controller | resolverExcedenteDocumento | public | si | 1009 | id: number, asociacionId: number, entrada: Entrada, usuario: bigint, perfil: string |
| M5Controller | determinarVencimientoDocumento | public | si | 1037 | id: number, entrada: Entrada |
| M5Controller | clasificarDocumento | public | si | 1060 | id: number, entrada: Entrada |
| M5Controller | prepararImputacionDocumento | public | si | 1077 | id: number, entrada: Entrada, usuario: bigint |
| M5Controller | confirmarImputacionDocumento | public | si | 1101 | id: number, propuestaId: number, usuario: bigint |
| M5Controller | registrarTipoCambioManual | public | si | 1107 | id: number, entrada: Entrada, usuario: bigint |
| M5Controller | generarObligacionDocumento | public | si | 1117 | id: number, usuario: bigint |
| M5Controller | operacionPagoM5 | private | si | 1149 | id: number, tx: Transaccion \| typeof prisma = prisma |
| M5Controller | efectosMovimientosPago | private | si | 1155 | tx: Transaccion \| typeof prisma, ids: number[] |
| M5Controller | recalcularObligacionM5 | private | si | 1164 | tx: Transaccion, idObligacion: number |
| M5Controller | nombreUsuario | private | no | 1184 | usuario: { usuario_id_usuario: bigint; usuario_nombre_completo_primer_nombre_usuario: stri |
| M5Controller | presentarOperacionPago | private | si | 1189 | id: number, tx: Transaccion \| typeof prisma = prisma |
| M5Controller | buscarProveedoresParaPago | public | si | 1245 | consulta: Record<string, unknown> |
| M5Controller | catalogosPagosProveedores | public | si | 1256 |  |
| M5Controller | crearOperacionPago | public | si | 1261 | entrada: Entrada, usuario: bigint |
| M5Controller | listarBorradoresPago | public | si | 1270 |  |
| M5Controller | obtenerOperacionPago | public | si | 1275 | id: number |
| M5Controller | listarPagosConfirmados | public | si | 1277 |  |
| M5Controller | consultarDetallePagoProveedor | public | si | 1282 | id: number |
| M5Controller | datosMovimientoPago | private | si | 1288 | idOperacion: number, entrada: Entrada, excluir?: number |
| M5Controller | agregarMovimientoPago | public | si | 1312 | idOperacion: number, entrada: Entrada |
| M5Controller | actualizarMovimientoPago | public | si | 1318 | idOperacion: number, idMovimiento: number, entrada: Entrada |
| M5Controller | adjuntarRespaldoPago | public | si | 1326 | idOperacion: number, entrada: Entrada, usuario: bigint |
| M5Controller | crearRespaldoPostPago | private | si | 1343 | tx: Transaccion, entrada: Entrada, usuario: bigint |
| M5Controller | reemplazarRespaldoPago | public | si | 1349 | idOperacion: number, idRespaldo: number, entrada: Entrada, usuario: bigint |
| M5Controller | movimientoPostPago | private | si | 1366 | tx: Transaccion, idOperacion: number, idMovimiento: number |
| M5Controller | efectoMovimientoPostPago | private | si | 1374 | tx: Transaccion, movimiento: { id_movimiento_pago_m5: number; monto_aplicado: Prisma.Decim |
| M5Controller | registrarTipoCambioManualPago | public | si | 1382 | idOperacion: number, idMovimiento: number, entrada: Entrada, usuario: bigint, perfil: stri |
| M5Controller | validarOperacionPago | private | si | 1394 | tx: Transaccion, idOperacion: number |
| M5Controller | prepararOperacionPago | public | si | 1414 | id: number, usuario: bigint |
| M5Controller | guardarBorradorPago | public | si | 1419 | id: number, entrada: Entrada |
| M5Controller | retomarOperacionPago | public | si | 1436 | id: number |
| M5Controller | descartarOperacionPago | public | si | 1438 | id: number, usuario: bigint |
| M5Controller | confirmarOperacionPago | public | si | 1443 | id: number, usuario: bigint |
| M5Controller | anularMovimientoPago | public | si | 1455 | idOperacion: number, idMovimiento: number, entrada: Entrada, usuario: bigint |
| M5Controller | anularOperacionPago | public | si | 1469 | idOperacion: number, entrada: Entrada, usuario: bigint |
| M5Controller | revertirMovimientoPago | public | si | 1486 | idOperacion: number, idMovimiento: number, entrada: Entrada, usuario: bigint |
| M5Controller | conciliarMovimientoPago | public | si | 1500 | idOperacion: number, idMovimiento: number, entrada: Entrada, usuario: bigint |
| M5Controller | registrarEfectosOcsNotaDebito | private | si | 1512 | tx: Transaccion, ajuste: { id_ajuste_obligacion_m5: number; id_documento_ajuste_m5: number |
| M5Controller | registrarAjusteObligacion | private | si | 1521 | tipoAjuste: 'NC' \| 'ND', entrada: Entrada, usuario: bigint |
| M5Controller | registrarNotaCredito | public | no | 1567 | entrada: Entrada, usuario: bigint |
| M5Controller | registrarNotaDebito | public | no | 1569 | entrada: Entrada, usuario: bigint |
| M5Controller | obtenerAjusteObligacion | public | si | 1570 | id: number |
| M5Controller | anularAjusteObligacion | public | si | 1577 | id: number, entrada: Entrada, usuario: bigint |
| M5Controller | consultarSaldosFavorProveedor | public | si | 1602 | idProveedor: number |
| M5Controller | proponerCompensacion | public | si | 1614 | idProveedor: number, entrada: Entrada |
| M5Controller | presentarCompensacion | private | si | 1628 | id: number |
| M5Controller | listarCompensaciones | public | si | 1636 | idProveedor: number |
| M5Controller | confirmarCompensacion | public | si | 1638 | idProveedor: number, entrada: Entrada, usuario: bigint |
| M5Controller | revertirCompensacion | public | si | 1663 | id: number, entrada: Entrada, usuario: bigint |
| M5Controller | listarCategoriasEgreso | public | si | 1681 |  |
| M5Controller | crearCategoriaEgreso | public | si | 1686 | entrada: Entrada, usuario: bigint |
| M5Controller | actualizarCategoriaEgreso | public | si | 1691 | id: number, entrada: Entrada, usuario: bigint |
| M5Controller | consultarUmbralReclasificacion | public | si | 1695 |  |
| M5Controller | configurarUmbralReclasificacion | public | si | 1697 | entrada: Entrada, usuario: bigint |
| M5Controller | disponibilidadClasificacion | private | si | 1698 | tx: Transaccion, idClasificacion: number |
| M5Controller | solicitarReclasificacion | public | si | 1700 | idDocumento: number, entrada: Entrada, usuario: bigint |
| M5Controller | resolverReclasificacion | public | si | 1706 | id: number, aprobar: boolean, entrada: Entrada, usuario: bigint, perfil: string) { const m |
| M5Controller | listarReclasificaciones | public | si | 1708 |  |
| M5Controller | corregirOrdenTrabajoImputacion | public | si | 1710 | idDetalle: number, entrada: Entrada, usuario: bigint |
| M5Controller | validarDestinoReasignacion | private | si | 1728 | tx: Transaccion, item: { destino: string; idProyecto: bigint \| null; idOt: bigint \| null } |
| M5Controller | disponibilidadImputacion | private | si | 1747 | tx: Transaccion, idDetalle: number |
| M5Controller | solicitarReasignacionCosto | public | si | 1757 | idDetalle: number, entrada: Entrada, usuario: bigint |
| M5Controller | resolverReasignacionCosto | public | si | 1781 | id: number, aprobar: boolean, entrada: Entrada, usuario: bigint |
| M5Controller | listarReasignacionesCosto | public | si | 1803 |  |
| M5Controller | registrarComisionBancaria | public | si | 1809 | idOperacion: number, entrada: Entrada, usuario: bigint |
| M5Controller | presentarEnvio | private | si | 1832 | id: number |
| M5Controller | listarEnviosImportaciones | public | si | 1841 |  |
| M5Controller | obtenerEnvioImportacion | public | no | 1843 | id: number |
| M5Controller | crearEnvioImportacion | public | si | 1844 | entrada: Entrada, usuario: bigint |
| M5Controller | asociarOrdenEnvio | public | si | 1850 | idEnvio: number, entrada: Entrada, usuario: bigint |
| M5Controller | registrarCostoEnvio | public | si | 1858 | idEnvio: number, entrada: Entrada, usuario: bigint |
| M5Controller | actualizarCostoEnvio | public | si | 1869 | idEnvio: number, idCosto: number, entrada: Entrada, usuario: bigint |
| M5Controller | cambiarEstadoEnvio | private | si | 1892 | idEnvio: number, estadoAnterior: string, estadoNuevo: string, evento: string, usuario: big |
| M5Controller | pasarEnvioRevision | public | no | 1906 | idEnvio: number, usuario: bigint |
| M5Controller | cerrarFinancieramenteEnvio | public | si | 1908 | idEnvio: number, usuario: bigint |
| M5Controller | reabrirEnvio | public | si | 1926 | idEnvio: number, entrada: Entrada, usuario: bigint |
| M5Controller | presentarCajaChica | private | si | 1928 | periodoEntrada: unknown |
| M5Controller | consultarCajaChica | public | no | 1941 | consulta: Entrada |
| M5Controller | obtenerGastoCajaChica | public | si | 1943 | id: number |
| M5Controller | configurarFondoCajaChica | public | si | 1944 | periodoEntrada: unknown, entrada: Entrada, usuario: bigint |
| M5Controller | registrarGastoCajaChica | public | si | 1949 | entrada: Entrada, usuario: bigint |
| M5Controller | adjuntarRespaldoCajaChica | public | si | 1954 | id: number, entrada: Entrada, usuario: bigint |
| M5Controller | aprobarGastoCajaChica | public | si | 1959 | id: number, usuario: bigint, perfil: string |
| M5Controller | rechazarGastoCajaChica | public | si | 1963 | id: number, entrada: Entrada, usuario: bigint |
| M5Controller | catalogosDocumentosProveedor | public | si | 1968 |  |
| M5Controller | listarDocumentosProveedor | public | si | 1975 | consulta: Record<string, unknown> |
| M5Controller | obtenerDocumentoProveedor | public | si | 1992 | referencia: number \| string |
## `Controladores/src/controladores/M6Controller.ts`
| Clase | Metodo | Alcance | Async | Linea | Parametros |
| --- | --- | --- | --- | --- | --- |
| M6Controller | crearEmpleado | public | si | 129 | entrada: Record<string, unknown> |
| M6Controller | listarEmpleados | public | si | 157 | consulta: Record<string, unknown> |
| M6Controller | obtenerEmpleado | public | si | 217 | id: number |
| M6Controller | listarAreasTrabajo | public | si | 247 | incluirInactivas = true |
| M6Controller | crearAreaTrabajo | public | si | 262 | entrada: Record<string, unknown> |
| M6Controller | actualizarAreaTrabajo | public | si | 281 | id: bigint, entrada: Record<string, unknown> |
| M6Controller | cambiarEstadoAreaTrabajo | public | si | 302 | id: bigint, activa: boolean |
| M6Controller | listarEmpleadosArea | public | si | 308 | idArea: bigint |
| M6Controller | obtenerHistorialAreaEmpleado | public | si | 319 | idEmpleado: number |
| M6Controller | asignarAreaEmpleado | public | si | 328 | idEmpleado: number, entrada: Record<string, unknown>, actorId: bigint |
| M6Controller | obtenerHistorialRemuneracional | public | si | 356 | idEmpleado: number, consulta: Record<string, unknown> = {} |
| M6Controller | catalogosLaborales | public | si | 447 |  |
| M6Controller | actualizarDatosBaseEmpleado | public | si | 456 | id: number, entrada: Record<string, unknown> |
| M6Controller | listarRelacionesLaborales | public | si | 502 | idEmpleado: number |
| M6Controller | validarPeriodosCerradosParaIntervalos | private | si | 514 | tx: Prisma.TransactionClient, intervalos: Array<{ inicio: Date; termino: Date \| null }> |
| M6Controller | crearRelacionLaboral | public | si | 530 | idEmpleado: number, entrada: Record<string, unknown> |
| M6Controller | actualizarRelacionLaboral | public | si | 557 | idEmpleado: number, idRelacion: number, entrada: Record<string, unknown> |
| M6Controller | catalogosRemuneracionales | public | si | 592 |  |
| M6Controller | obtenerPerfilRemuneracional | public | si | 605 | idEmpleado: number |
| M6Controller | actualizarPerfilRemuneracional | public | si | 653 | idEmpleado: number, entrada: Record<string, unknown> |
| M6Controller | intervalo | private | no | 724 | entrada: Record<string, unknown> |
| M6Controller | conflictoConcurrente | private | no | 731 | error: unknown, mensaje: string |
| M6Controller | catalogosAsignacionEsquemas | public | si | 737 |  |
| M6Controller | listarAsignacionesEsquemaEmpleado | public | si | 745 | idEmpleado: number |
| M6Controller | asignarEsquemaEmpleado | public | si | 753 | idEmpleado: number, entrada: Record<string, unknown> |
| M6Controller | finalizarAsignacionEsquemaEmpleado | public | si | 774 | idEmpleado: number, idAsignacion: number, entrada: Record<string, unknown> |
| M6Controller | catalogoHaberes | public | si | 789 |  |
| M6Controller | listarAsignacionesHaberEmpleado | public | si | 794 | idEmpleado: number |
| M6Controller | asignarHaberEmpleado | public | si | 800 | idEmpleado: number, entrada: Record<string, unknown> |
| M6Controller | finalizarAsignacionHaberEmpleado | public | si | 818 | idEmpleado: number, idAsignacion: number, entrada: Record<string, unknown> |
| M6Controller | configuracionDocumental | private | si | 833 | tx: Prisma.TransactionClient \| typeof prisma, idEmpleado: number |
| M6Controller | obtenerConfiguracionDocumental | public | si | 840 | idEmpleado: number |
| M6Controller | actualizarConfiguracionDocumental | public | si | 842 | idEmpleado: number, entrada: Record<string, unknown> |
| M6Controller | listarEsquemas | public | si | 855 |  |
| M6Controller | catalogoCargosEsquemas | public | si | 860 |  |
| M6Controller | crearEsquema | public | si | 865 | entrada: Record<string, unknown> |
| M6Controller | actualizarEsquema | public | si | 872 | idEsquema: number, entrada: Record<string, unknown> |
| M6Controller | asignarEsquemaCargo | public | si | 888 | idEsquema: number, entrada: Record<string, unknown> |
| M6Controller | listarTarifasEsquema | public | si | 903 | idEsquema: number, fecha?: unknown |
| M6Controller | crearTarifaEsquema | public | si | 911 | idEsquema: number, entrada: Record<string, unknown> |
| M6Controller | revisarTarifaEsquema | public | si | 928 | idEsquema: number, idTarifa: number |
| M6Controller | listarHaberes | public | si | 938 |  |
| M6Controller | crearHaber | public | si | 943 | entrada: Record<string, unknown> |
| M6Controller | actualizarHaber | public | si | 955 | idConcepto: number, entrada: Record<string, unknown> |
| M6Controller | crearConfiguracionHaber | public | si | 965 | idConcepto: number, entrada: Record<string, unknown> |
| M6Controller | resolverConfiguracionHaber | public | si | 975 | idConcepto: number, fecha: unknown |
| M6Controller | listarParametrosRemuneracionales | public | si | 990 | tipo?: unknown |
| M6Controller | crearParametroTipado | private | si | 998 | entrada: Record<string, unknown>, tipos: string[] |
| M6Controller | crearParametroRemuneracional | public | si | 1023 | entrada: Record<string, unknown> |
| M6Controller | actualizarParametroRemuneracional | public | si | 1027 | id: number, entrada: Record<string, unknown> |
| M6Controller | resolverParametroRemuneracional | public | si | 1048 | codigoEntrada: unknown, fecha: unknown |
| M6Controller | listarTramosImpuestoRenta | public | si | 1056 | fecha?: unknown |
| M6Controller | crearTramoImpuestoRenta | public | si | 1063 | entrada: Record<string, unknown> |
| M6Controller | listarConceptosDeduccionAporte | public | si | 1083 |  |
| M6Controller | crearConceptoDeduccionAporte | public | si | 1088 | entrada: Record<string, unknown> |
| M6Controller | actualizarConceptoDeduccionAporte | public | si | 1104 | id: number, entrada: Record<string, unknown> |
| M6Controller | listarConfiguracionProrrateo | public | si | 1115 | fecha?: unknown |
| M6Controller | crearConfiguracionProrrateo | public | si | 1121 | entrada: Record<string, unknown> |
| M6Controller | listarPoliticasConservacion | public | si | 1125 | fecha?: unknown |
| M6Controller | crearPoliticaConservacion | public | si | 1131 | entrada: Record<string, unknown> |
| M6Controller | listarMediosPagoM6 | public | si | 1145 | soloActivos = false |
| M6Controller | crearMedioPagoM6 | public | si | 1150 | entrada: Record<string, unknown> |
| M6Controller | actualizarMedioPagoM6 | public | si | 1159 | id: number, entrada: Record<string, unknown> |
| M6Controller | presentarHecho | private | no | 1178 | ejecucion: any |
| M6Controller | listarHechosRemunerables | public | si | 1203 |  |
| M6Controller | obtenerHechoRemunerable | public | si | 1208 | idEjecucion: bigint |
| M6Controller | revisarHechoRemunerable | public | si | 1214 | idEjecucion: bigint |
| M6Controller | listarRetrabajosPendientes | public | si | 1253 |  |
| M6Controller | resolverRetrabajo | public | si | 1258 | idIncidencia: bigint, entrada: Record<string, unknown>, idUsuarioResolutor: bigint |
| M6Controller | presentarComponente | private | no | 1284 | item: any |
| M6Controller | presentarRemuneracion | private | no | 1297 | item: any, estadoPago = { fuenteDisponible: true, tienePago: false } |
| M6Controller | periodoEntrada | private | no | 1318 | anioEntrada: unknown, mesEntrada: unknown |
| M6Controller | poblacionExigible | private | si | 1324 | tx: Prisma.TransactionClient, fechaInicio: Date, fechaFin: Date |
| M6Controller | bloqueosRemuneracion | private | si | 1337 | tx: Prisma.TransactionClient, remuneracion: any |
| M6Controller | consultarPeriodoRemuneracion | public | si | 1356 | anioEntrada: unknown, mesEntrada: unknown |
| M6Controller | obtenerRemuneracion | public | si | 1372 | idRemuneracion: number |
| M6Controller | obtenerOCrearContextoRemuneracion | public | si | 1380 | entrada: Record<string, unknown>, idUsuario: bigint |
| M6Controller | remuneracionAbierta | private | si | 1399 | tx: Prisma.TransactionClient, idRemuneracion: number |
| M6Controller | mismoAutomatico | private | no | 1407 | actual: any, candidato: any |
| M6Controller | sincronizarAutomaticos | private | si | 1418 | tx: Prisma.TransactionClient, idRemuneracion: number, candidatos: Prisma.componente_remune |
| M6Controller | calcularEnTransaccion | private | si | 1480 | tx: Prisma.TransactionClient, idRemuneracion: number, idUsuario: bigint |
| M6Controller | calcularRemuneracion | public | si | 1564 | entrada: Record<string, unknown>, idUsuario: bigint |
| M6Controller | cerrarRemuneracion | public | si | 1574 | idRemuneracion: number, idUsuario: bigint |
| M6Controller | obtenerLiquidacionRemuneracion | public | si | 1587 | idRemuneracion: number |
| M6Controller | cerrarPeriodoRemuneracion | public | si | 1594 | anioEntrada: unknown, mesEntrada: unknown, idUsuario: bigint |
| M6Controller | estadoPagoRemuneracion | private | si | 1611 | tx: Prisma.TransactionClient, _idRemuneracion: number |
| M6Controller | solicitarReaperturaRemuneracion | public | si | 1615 | idRemuneracion: number, entrada: Record<string, unknown>, idUsuario: bigint |
| M6Controller | aprobarReaperturaRemuneracion | public | si | 1630 | idRemuneracion: number, idUsuario: bigint |
| M6Controller | proponerComponenteExcepcional | public | si | 1648 | idRemuneracion: number, entrada: Record<string, unknown>, idUsuario: bigint |
| M6Controller | resolverComponente | private | si | 1663 | idComponente: number, tipos: string[], entrada: Record<string, unknown>, idUsuario: bigint |
| M6Controller | resolverComponenteExcepcional | public | si | 1688 | idComponente: number, entrada: Record<string, unknown>, idUsuario: bigint |
| M6Controller | proponerVariableRemuneracion | public | si | 1692 | idRemuneracion: number, entrada: Record<string, unknown>, idUsuario: bigint |
| M6Controller | resolverVariableRemuneracion | public | si | 1709 | idComponente: number, entrada: Record<string, unknown>, idUsuario: bigint |
| M6Controller | registrarValorExterno | public | si | 1713 | idRemuneracion: number, entrada: Record<string, unknown>, idUsuario: bigint |
| M6Controller | proponerAjusteManual | public | si | 1728 | idRemuneracion: number, entrada: Record<string, unknown>, idUsuario: bigint |
| M6Controller | resolverValorOAjuste | public | si | 1743 | idComponente: number, entrada: Record<string, unknown>, idUsuario: bigint |
| M6Controller | obtenerContextoProrrateo | public | si | 1749 | idRemuneracion: number |
| M6Controller | proponerProrrateoIndividual | public | si | 1757 | idRemuneracion: number, entrada: Record<string, unknown>, idUsuario: bigint |
| M6Controller | resolverProrrateoIndividual | public | si | 1770 | idComponente: number, entrada: Record<string, unknown>, idUsuario: bigint |
| M6Controller | claveIdempotencia | private | no | 1774 | valor: unknown |
| M6Controller | crearAjustePosterior | public | si | 1780 | idRemuneracion: number, entrada: Record<string, unknown>, idUsuario: bigint |
| M6Controller | obtenerAjustePosterior | public | si | 1813 | idAjuste: number |
| M6Controller | postergarAjustePosterior | public | si | 1819 | idAjuste: number, entrada: Record<string, unknown>, idUsuario: bigint |
| M6Controller | crearRegularizacionExtraordinaria | public | si | 1832 | idAjuste: number, idUsuario: bigint |
| M6Controller | obtenerRegularizacion | public | si | 1847 | idRegularizacion: number |
| M6Controller | actualizarRegularizacion | public | si | 1854 | idRegularizacion: number, entrada: Record<string, unknown>, idUsuario: bigint |
| M6Controller | cerrarRegularizacion | public | si | 1867 | idRegularizacion: number, idUsuario: bigint |
| M6Controller | registrarAnticipo | public | si | 1873 | entrada: Record<string, unknown>, idUsuario: bigint |
| M6Controller | obtenerAnticipo | public | si | 1897 | idAnticipo: number |
| M6Controller | montoPagableOriginal | private | si | 1904 | tx: Prisma.TransactionClient, origen: OrigenPagoRemuneracion |
| M6Controller | presentarPago | private | no | 1935 | item: any |
| M6Controller | prepararPagoRemuneracion | private | si | 1943 | origen: OrigenPagoRemuneracion, entrada: Record<string, unknown>, idUsuario: bigint |
| M6Controller | obtenerPagoRemuneracion | public | si | 1960 | idPago: number |
| M6Controller | resumenOrigenPago | private | si | 1971 | origen: OrigenPagoRemuneracion |
| M6Controller | actualizarPagoRemuneracion | public | si | 1979 | idPago: number, entrada: Record<string, unknown>, idUsuario?: bigint |
| M6Controller | confirmarPagoRemuneracion | public | si | 1997 | idPago: number, idUsuario: bigint |
| M6Controller | listarPagosRemuneracion | public | si | 2018 |  |
| M6Controller | prepararPagoAnticipo | public | si | 2023 | idAnticipo: number, entrada: Record<string, unknown>, idUsuario: bigint |
| M6Controller | prepararPagoFinal | public | si | 2027 | entrada: Record<string, unknown>, idUsuario: bigint |
| M6Controller | exigirTipoPago | private | si | 2035 | idPago: number, permitidos: string[] |
| M6Controller | actualizarPagoAnticipo | public | si | 2042 | idPago: number, entrada: Record<string, unknown>, idUsuario?: bigint |
| M6Controller | confirmarPagoAnticipo | public | si | 2044 | idPago: number, idUsuario: bigint |
| M6Controller | actualizarPagoFinal | public | si | 2045 | idPago: number, entrada: Record<string, unknown>, idUsuario?: bigint |
| M6Controller | confirmarPagoFinal | public | si | 2046 | idPago: number, idUsuario: bigint |
| M6Controller | listarPrestadoresHonorarios | public | si | 2047 |  |
| M6Controller | crearPrestadorHonorarios | public | si | 2052 | entrada: Record<string, unknown> |
| M6Controller | presentarBoletaHonorarios | private | si | 2068 | item: any |
| M6Controller | listarBoletasHonorarios | public | si | 2093 | consulta: Record<string, unknown> |
| M6Controller | obtenerBoletaHonorarios | public | si | 2115 | id: number |
| M6Controller | datosBoletaPendiente | private | si | 2121 | entrada: Record<string, unknown> |
| M6Controller | crearBoletaHonorarios | public | si | 2135 | entrada: Record<string, unknown> |
| M6Controller | actualizarBoletaHonorarios | public | si | 2143 | id: number, entrada: Record<string, unknown> |
| M6Controller | previsualizarConfirmacionBoletaHonorarios | public | si | 2186 | id: number |
| M6Controller | confirmarBoletaHonorarios | public | si | 2194 | id: number |
| M6Controller | consultarRetencionesHonorariosMensuales | public | si | 2211 | anioEntrada: unknown, mesEntrada: unknown |
| M6Controller | listarBoletasHonorariosConfirmadas | public | si | 2221 |  |
| M6Controller | prepararPagoHonorarios | public | si | 2226 | idBoleta: number, entrada: Record<string, unknown>, idUsuario: bigint |
| M6Controller | actualizarPagoHonorarios | public | si | 2228 | idPago: number, entrada: Record<string, unknown>, idUsuario?: bigint |
| M6Controller | confirmarPagoHonorarios | public | si | 2229 | idPago: number, idUsuario: bigint |
| M6Controller | anularPagoRemuneracion | public | si | 2230 | idPago: number, entrada: Record<string, unknown>, idUsuario: bigint |
| M6Controller | registrarReversionPagoRemuneracion | public | si | 2235 | idPago: number, entrada: Record<string, unknown>, idUsuario: bigint |
| M6Controller | exigirAlcanceDocumento | private | no | 2240 | actor: ActorDocumentoM6, idEmpleado: number |
| M6Controller | archivoLiquidacion | private | no | 2247 | item: any |
| M6Controller | cargarLiquidacion | private | si | 2251 | tx: Prisma.TransactionClient, idRemuneracion: number |
| M6Controller | cargarComprobanteAnticipo | private | si | 2259 | tx: Prisma.TransactionClient, idAnticipo: number |
| M6Controller | archivoComprobanteAnticipo | private | no | 2267 | item: any, pagos: any[] |
| M6Controller | listarDocumentosRemuneracion | public | si | 2271 | consulta: Record<string, unknown>, actor: ActorDocumentoM6 |
| M6Controller | descargarDocumentoRemuneracion | public | si | 2292 | tipoEntrada: unknown, id: number, actor: ActorDocumentoM6 |
| M6Controller | reenviarDocumentoRemuneracion | public | si | 2305 | tipoEntrada: unknown, idEntrada: number, actor: ActorDocumentoM6 |
| M6Controller | registrarEntregaDocumento | public | si | 2342 | entrada: Record<string, unknown>, actor: ActorDocumentoM6 |
| M6Controller | consultarEntregaDocumento | public | si | 2356 | tipoEntrada: unknown, id: number, actor: ActorDocumentoM6 |
| M6Controller | exportarCalculoPreliminar | public | si | 2365 | idRemuneracion: number, actor: ActorDocumentoM6 |
| M6Controller | exportarRemuneracionesOficiales | public | si | 2378 | consulta: Record<string, unknown>, actor: ActorDocumentoM6 |
| M6Controller | presentarUsuarioTerreno | private | no | 2399 | usuario: any |
| M6Controller | presentarObraTerreno | private | no | 2405 | obra: any |
| M6Controller | presentarVisitaTerreno | private | no | 2416 | visita: any |
| M6Controller | presentarDetalleVisitaTerreno | private | no | 2426 | visita: any |
| M6Controller | crearVisitaTerreno | public | si | 2450 | entrada: Record<string, unknown> |
| M6Controller | listarObrasTerreno | public | si | 2470 |  |
| M6Controller | listarVisitasTerreno | public | si | 2475 |  |
| M6Controller | obtenerVisitaTerreno | public | si | 2480 | id: number |
| M6Controller | listarInstalacionesTerreno | public | si | 2498 |  |
| M6Controller | listarUsuariosTerreno | public | si | 2547 |  |
| M6Controller | asignarResponsableVisita | public | si | 2552 | id: number, entrada: Record<string, unknown> |
| M6Controller | listarMisTareasTerreno | public | si | 2564 | idUsuario: bigint |
| M6Controller | medidasObligatoriasOt | private | no | 2611 | contenido: Prisma.JsonValue |
| M6Controller | resolverLevantamientoTerreno | private | si | 2619 | id: number, actor: ActorTerrenoM6, cliente: Prisma.TransactionClient \| typeof prisma = pri |
| M6Controller | presentarLevantamientoTerreno | private | no | 2639 | contexto: Awaited<ReturnType<M6Controller['resolverLevantamientoTerreno']>> |
| M6Controller | obtenerLevantamientoTerreno | public | si | 2686 | id: number, actor: ActorTerrenoM6 |
| M6Controller | guardarLevantamientoTerreno | public | si | 2690 | id: number, entrada: Record<string, unknown>, actor: ActorTerrenoM6 |
| M6Controller | corregirLevantamientoTerreno | public | si | 2723 | id: number, entrada: Record<string, unknown>, actor: ActorTerrenoM6, estadosOrdenTrabajoPe |
| M6Controller | generarOrdenTrabajoLevantamiento | public | si | 2776 | id: number, actor: ActorTerrenoM6 |
| M6Controller | estadoVisibleOrden | private | no | 2808 | unidad: { estado:string; orden_trabajo:{ orden_trabajo_estado:string\|null }; rectificacion |
| M6Controller | puedeGestionarTodasLasRectificaciones | private | no | 2815 | actor:ActorTerrenoM6 |
| M6Controller | verificarAccesoRectificacion | private | no | 2819 | unidad:{rectificacion:{id_empleado_rectificador:number\|null}\|null},actor:ActorTerrenoM6 |
| M6Controller | presentarGestionOrdenTrabajo | private | no | 2851 | unidad:any |
| M6Controller | listarOrdenesTrabajoRectificacion | public | si | 2905 | consulta:Record<string,unknown>,actor:ActorTerrenoM6 |
| M6Controller | obtenerOrdenTrabajoRectificacion | public | si | 2920 | idOrden:number,actor:ActorTerrenoM6 |
| M6Controller | asignarRectificadorOrdenTrabajo | public | si | 2931 | idOrden:number,entrada:Record<string,unknown>,actor:ActorTerrenoM6 |
| M6Controller | normalizarPlanificacionRectificacion | private | si | 2945 | tx:Prisma.TransactionClient,valor:unknown |
| M6Controller | guardarRectificacionOrdenTrabajo | public | si | 2956 | idOrden:number,entrada:Record<string,unknown>,actor:ActorTerrenoM6 |
| M6Controller | enviarRectificacionAprobacion | public | si | 2972 | idOrden:number,entrada:Record<string,unknown>,actor:ActorTerrenoM6 |
| M6Controller | verificarSeparacionAprobacion | private | si | 2982 | tx:Prisma.TransactionClient,rectificacion:{id_empleado_rectificador:number\|null;actualizad |
| M6Controller | aprobarRectificacionOrdenTrabajo | public | si | 2990 | idOrden:number,entrada:Record<string,unknown>,actor:ActorTerrenoM6 |
| M6Controller | devolverRectificacionOrdenTrabajo | public | si | 3001 | idOrden:number,entrada:Record<string,unknown>,actor:ActorTerrenoM6 |
| M6Controller | liberarOrdenTrabajoRectificada | public | si | 3009 | idOrden:number,entrada:Record<string,unknown>,actor:ActorTerrenoM6 |
| M6Controller | ajustarOrdenTrabajoTerreno | public | si | 3031 | id: number, entrada: Record<string, unknown>, actor: ActorTerrenoM6 |
| M6Controller | liberarOrdenTrabajoTerreno | public | si | 3035 | id: number, idOrden: number, actor: ActorTerrenoM6 |
| M6Controller | generarTareasProduccion | public | si | 3059 | id: number, idOrden: number, entrada: Record<string, unknown>, actor: ActorTerrenoM6 |
| M6Controller | obtenerTareaProduccion | private | si | 3104 | id: number, cliente: Prisma.TransactionClient \| typeof prisma = prisma |
| M6Controller | presentarTareaProduccion | private | si | 3116 | tarea: any, cliente: Prisma.TransactionClient \| typeof prisma = prisma |
| M6Controller | listarTareasProduccion | public | si | 3130 | idOrden: number |
| M6Controller | asignarTareaProduccion | public | si | 3135 | id: number, entrada: Record<string, unknown>, actor:ActorTerrenoM6 |
| M6Controller | modificarTareaProduccion | public | si | 3154 | id:number,entrada:Record<string,unknown>,actor:ActorTerrenoM6 |
| M6Controller | presentarEjecucion | private | no | 3161 | ejecucion: any |
| M6Controller | iniciarTareaProduccion | public | si | 3173 | id:number,entrada:Record<string,unknown>,actor:ActorTerrenoM6){return prisma.$transaction( |
| M6Controller | registrarEjecucionTarea | public | si | 3175 | id: number, entrada: Record<string, unknown>, actor: ActorTerrenoM6 |
| M6Controller | listarEjecucionesPendientes | public | si | 3193 |  |
| M6Controller | validarEjecucionProductiva | public | si | 3198 | id: number, entrada: Record<string, unknown>,actor:ActorTerrenoM6 |
| M6Controller | agregarEtapaProduccion | public | si | 3210 | idOrden:number,entrada:Record<string,unknown>,actor:ActorTerrenoM6 |
| M6Controller | agregarTareaProduccion | public | si | 3215 | idOrden:number,entrada:Record<string,unknown>,actor:ActorTerrenoM6 |
| M6Controller | cerrarTareaProduccion | public | si | 3222 | id:number,entrada:Record<string,unknown>,actor:ActorTerrenoM6 |
| M6Controller | solicitarCorreccionTecnicaProduccion | public | si | 3224 | idOrden:number,entrada:Record<string,unknown>,actor:ActorTerrenoM6 |
| M6Controller | finalizarOrdenTrabajoProduccion | public | si | 3226 | idOrden:number,entrada:Record<string,unknown>,actor:ActorTerrenoM6 |
| M6Controller | obtenerPreparacionSalida | public | si | 3228 | id: number |
| M6Controller | actualizarChecklistSalida | public | si | 3253 | id: number, entrada: Record<string, unknown> |
| M6Controller | registrarResultadoVisita | public | si | 3267 | id: number, entrada: Record<string, unknown> |
| M6Controller | catalogosIncidenciaOperativa | public | si | 3301 | consulta: Record<string, unknown> = {} |
| M6Controller | registrarIncidenciaRetrabajo | public | si | 3342 | idEjecucion: number, entrada: Record<string, unknown>, actor: ActorIncidenciaM6 |
| M6Controller | listarIncidenciasOperativas | public | si | 3373 | consulta:Record<string,unknown>={} |
| M6Controller | obtenerEvidenciaIncidencia | public | si | 3427 | idIncidencia: number, idEvidencia: number |
| M6Controller | adjuntarEvidenciaIncidencia | public | si | 3434 | id: number, entrada: Record<string, unknown>, actor: ActorIncidenciaM6 |
| M6Controller | actualizarIncidenciaOperativa | public | si | 3447 | id: number, entrada: Record<string, unknown> |
| M6Controller | resolverIncidenciaOperativa | public | si | 3472 | id: number, decision: 'aprobada' \| 'rechazada', entrada: Record<string, unknown>, actor: A |
| M6Controller | catalogoDeduccionesEmpleado | public | si | 3484 |  |
| M6Controller | listarDeduccionesEmpleado | public | si | 3488 | idEmpleado: number |
| M6Controller | asignarDeduccionEmpleado | public | si | 3493 | idEmpleado: number, entrada: Record<string, unknown> |
| M6Controller | finalizarDeduccionEmpleado | public | si | 3507 | idEmpleado: number, idAsignacion: number, entrada: Record<string, unknown> |
| M6Controller | consultarDashboardTerreno | public | si | 3522 | consulta: Record<string, unknown>, actor: ActorTerrenoM6 |
| M6Controller | exportarReporteTerreno | public | si | 3598 | consulta: Record<string, unknown>, actor: ActorTerrenoM6 |
## `Controladores/src/controladores/M7Controller.ts`
| Clase | Metodo | Alcance | Async | Linea | Parametros |
| --- | --- | --- | --- | --- | --- |
| M7Controller | consultarExposicion | public | no | 402 | consulta: Consulta |
| M7Controller | consultarBloqueos | public | no | 407 | consulta: Consulta |
| M7Controller | constructor | public | no | 410 | private creditoM8?: ProveedorCreditoM8, private readonly bloqueosOwner?: ProveedorBloqueos |
| M7Controller | conectarCreditoM8 | public | no | 411 | proveedor: ProveedorCreditoM8 |
| M7Controller | consultarPanelGeneral | public | si | 412 | consulta: Consulta, permisos: string[] |
| M7Controller | consultarHistoricoPanelGeneral | public | si | 464 | consulta: Consulta, permisos: string[] |
| M7Controller | consultarCentroAtencion | public | si | 598 | consulta: Consulta, permisos: string[] |
| M7Controller | consultarCotizacionesPendientes | public | si | 658 | consulta: Consulta, permisos: string[] = [] |
| M7Controller | consultarAnalisisVentasCompleto | private | si | 686 | consulta: Consulta |
| M7Controller | consultarCuentasCobrarCompleto | private | si | 797 | consulta: Consulta |
| M7Controller | consultarCuentasPagarCompleto | private | si | 851 | consulta: Consulta |
| M7Controller | presentarProyeccionM7 | private | no | 884 | fila: { id_proyeccion_financiera_m7: number; tipo: string; anio: number; mes: number; cate |
| M7Controller | consultarProyeccionesM7 | public | si | 888 | consulta: Consulta |
| M7Controller | guardarProyeccionM7 | public | si | 917 | entrada: Record<string, unknown>, actorId: bigint, id?: number |
| M7Controller | desactivarProyeccionM7 | public | si | 944 | id: number, actorId: bigint |
| M7Controller | presentarCuentaBancariaM7 | private | no | 950 | fila: { id_cuenta_bancaria_m7: number; banco: string; alias_cuenta: string; identificador_ |
| M7Controller | presentarSaldoInicialBancarioM7 | private | no | 954 | fila: { id_saldo_inicial_bancario_m7: number; id_cuenta_bancaria_m7: number; fecha_corte:  |
| M7Controller | guardarCuentaBancariaM7 | public | si | 958 | entrada: Record<string, unknown>, actorId: bigint, id?: number |
| M7Controller | guardarSaldoInicialBancarioM7 | public | si | 978 | entrada: Record<string, unknown>, actorId: bigint, id?: number |
| M7Controller | consultarDisponibilidadesBancariasM7 | public | si | 998 | consulta: Consulta = {} |
| M7Controller | consultarLiquidezCompleto | private | si | 1026 | consulta: Consulta |
| M7Controller | resolverUmbralMargen | private | si | 1096 | fecha: Date |
| M7Controller | consultarConfiguracionUmbralMargen | public | si | 1109 |  |
| M7Controller | configurarUmbralMargen | public | si | 1116 | entrada: Record<string, unknown> |
| M7Controller | consultarMargenProyectosCompleto | private | si | 1147 | consulta: Consulta |
| M7Controller | consultarAnalisisVentas | public | si | 1214 | consulta: Consulta, permisos?: string[] |
| M7Controller | consultarContextoCliente | public | si | 1264 | idCliente: number, consulta: Consulta, permisos: string[] |
| M7Controller | consultarCuentasCobrar | public | si | 1310 | consulta: Consulta, permisos?: string[] |
| M7Controller | consultarCuentasPagar | public | si | 1329 | consulta: Consulta, permisos?: string[] |
| M7Controller | consultarLiquidez | public | si | 1346 | consulta: Consulta, permisos?: string[] |
| M7Controller | consultarRiesgoDeficit | public | si | 1364 | consulta: Consulta, permisos: string[] |
| M7Controller | consultarMargenProyectos | public | si | 1394 | consulta: Consulta, permisos?: string[] |
| M7Controller | consultarExposicionProyectos | public | si | 1408 | consulta: Consulta, permisos: string[] |
| M7Controller | consultarContextoProyecto | public | si | 1434 | idProyecto: number, consulta: Consulta, permisos: string[] |
| M7Controller | consultarCostoRemuneraciones | public | si | 1461 | consulta: Consulta |
| M7Controller | consultarOrdenesTrabajo | public | si | 1490 | consulta: Consulta |
| M7Controller | consultarProduccionModelosCompleto | private | si | 1504 | consulta: Consulta, permisos: string[] |
| M7Controller | consultarProduccionModelos | public | si | 1572 | consulta: Consulta, permisos: string[] |
| M7Controller | consultarCargaOperacional | public | si | 1582 | consulta: Consulta |
| M7Controller | consultarInstalaciones | public | si | 1599 | consulta: Consulta |
| M7Controller | consultarAtrasosInstalaciones | public | si | 1615 | consulta: Consulta |
| M7Controller | consultarIncidenciasRetrabajos | public | si | 1663 | consulta: Consulta, permisos: string[] = [] |
| M7Controller | registrarAjusteLiquidez | public | si | 1687 | entrada: Record<string, unknown>, actor: { id: bigint; administrador: boolean } |
| M7Controller | consultarCatalogosAjusteLiquidez | public | si | 1707 |  |
| M7Controller | consultarParametrosDeltaM7 | public | si | 1712 |  |
| M7Controller | consultarParametrosPorFamiliaM7 | public | si | 1717 | familia: 'UMBRAL_LIQUIDEZ' \| 'COSTO_INSTALACION' \| 'DIAS_STOCK_INMOVIL' |
| M7Controller | configurarUmbralLiquidezM7 | public | no | 1724 | entrada: Record<string, unknown> |
| M7Controller | configurarCostoInstalacionM7 | public | no | 1726 | entrada: Record<string, unknown> |
| M7Controller | configurarDiasStockInmovilM7 | public | no | 1727 | entrada: Record<string, unknown> |
| M7Controller | configurarParametroDeltaM7 | public | si | 1728 | entrada: Record<string, unknown> |
| M7Controller | consultarExposicionCreditoM7 | public | si | 1749 | consulta: Consulta |
| M7Controller | consultarAlertasCreditoM7 | public | si | 1756 | consulta: Consulta |
| M7Controller | consultarBloqueosEconomicosM7 | public | si | 1762 | consulta: Consulta |
| M7Controller | consultarResumenIva | public | si | 1768 | consulta: Consulta |
| M7Controller | costosInstalacionVigentes | private | si | 1782 | fecha: Date |
| M7Controller | consultarCostosFabricacion | public | si | 1787 | consulta: Consulta |
| M7Controller | consultarMargenInstalaciones | public | si | 1811 | consulta: Consulta |
| M7Controller | consultarInventarioValorizado | public | si | 1833 | consulta: Consulta |
| M7Controller | consultarMaterialesProyectoOt | public | si | 1851 | consulta: Consulta |
| M7Controller | consultarRiesgoStock | public | si | 1862 | consulta: Consulta |
| M7Controller | consultarRotacionInventario | public | si | 1883 | consulta: Consulta |
| M7Controller | consultarComprasRecepciones | public | si | 1899 | consulta: Consulta, permisos: string[] = [] |
| M7Controller | consultarResumenResultados | public | si | 1908 | consulta: Consulta |
| M7Controller | consultarSituacionFinanciera | public | si | 2005 | consulta: Consulta |
| M7Controller | descargarExcelVentas | public | si | 2020 | entrada: Record<string, unknown>, permisos: string[] |
| M7Controller | descargarPdfContextual | public | si | 2170 | entrada: Record<string, unknown>, permisos: string[] |
## `Controladores/src/controladores/M8Controller.ts`
| Clase | Metodo | Alcance | Async | Linea | Parametros |
| --- | --- | --- | --- | --- | --- |
| M8Controller | presentar | private | no | 21 | s:Solicitud |
| M8Controller | listarSolicitudes | public | si | 22 | q:Consulta,a:ActorCredito){autorizar(a,'CU259');const e=texto(q.estado,20).toUpperCase(),t |
| M8Controller | obtenerSolicitud | public | si | 23 | id:number,a:ActorCredito |
| M8Controller | crearSolicitud | public | si | 24 | tipo:'INICIAL'\|'EXCEPCION',e:Entrada,a:ActorCredito){autorizar(a,tipo==='INICIAL'?'CU260': |
| M8Controller | enviarSolicitud | public | si | 25 | id:number,a:ActorCredito |
| M8Controller | cancelarSolicitud | public | si | 26 | id:number,e:Entrada,a:ActorCredito |
| M8Controller | resolverSolicitud | public | si | 27 | id:number,e:Entrada,a:ActorCredito){const s=await prisma.solicitud_crediticia_m8.findUniqu |
| M8Controller | modificarCupo | public | si | 28 | id:number,e:Entrada,a:ActorCredito |
| M8Controller | suspension | private | si | 29 | id:number,susp:boolean,e:Entrada,a:ActorCredito |
| M8Controller | suspenderCredito | public | no | 30 | id:number,e:Entrada,a:ActorCredito){return this.suspension(id,true,e,a)} reactivarCredito( |
| M8Controller | configurarLimiteGlobal | public | si | 31 | e:Entrada,a:ActorCredito){autorizar(a,'CU268');const valor=monto(e.montoLimite,'Límite glo |
| M8Controller | consultarExposicion | public | si | 32 | _q:Consulta={}){const[l,u,ag]=await Promise.all([limiteCreditoVigente(prisma),exposicionCr |
| M8Controller | situacionCliente | public | si | 34 | id:number,a:ActorCredito,perm='CU270'){autorizar(a,perm);const f=await fichaB2B(prisma,id) |
| M8Controller | historialCliente | public | si | 35 | id:number,a:ActorCredito |
| M8Controller | composicionCliente | public | si | 36 | id:number,a:ActorCredito |
| M8Controller | calcularDistribucion | private | si | 37 | ){const cs=await prisma.condicion_crediticia_m8.findMany({where:{credito_habilitado:true}, |
| M8Controller | consultarResumenDashboardM7 | public | si | 38 | _q:Consulta={} |
| M8Controller | distribucion | public | si | 39 | a:ActorCredito |
| M8Controller | validarFormalizacion | public | si | 40 | e:Entrada,a:ActorCredito){autorizar(a,'CU269');return prisma.$transaction(tx=>validarCredi |
| M8Controller | exportar | public | si | 41 | origen:string,q:Consulta,a:ActorCredito |
## `Controladores/src/controladores/M9Controller.ts`
| Clase | Metodo | Alcance | Async | Linea | Parametros |
| --- | --- | --- | --- | --- | --- |
| M9Controller | constructor | public | no | 40 | dependencias: DependenciasM9 = {} |
| M9Controller | diagnosticar | private | no | 52 | codigo: string, entrada?: Partial<EventoEntradaM9> |
| M9Controller | normalizar | private | si | 56 | entrada: EventoEntradaM9, omitirOrden = false |
| M9Controller | recibir | public | si | 95 | entrada: EventoEntradaM9 |
| M9Controller | verificarIntegridad | private | no | 138 | evento: EventoPersistidoM9 |
| M9Controller | estadoIntegridad | private | no | 143 | evento: EventoPersistidoM9 |
| M9Controller | verificarScope | private | no | 148 | scope: ScopeM9, filtros?: FiltrosM9 |
| M9Controller | presentar | private | no | 154 | evento: EventoPersistidoM9, scope: ScopeM9, integridad: EstadoIntegridadM9 = 'VERIFICADA' |
| M9Controller | proyectarForense | private | si | 173 | evento:EventoPersistidoM9 |
| M9Controller | normalizarFiltros | private | no | 179 | filtros: FiltrosM9 |
| M9Controller | resolverConsulta | private | si | 186 | filtros: FiltrosM9, scope: ScopeM9 |
| M9Controller | terminal | private | si | 195 | operacion: string, scope: ScopeM9, resultado: 'EXITOSO' \| 'RECHAZADO' \| 'FALLIDO', metadat |
| M9Controller | consultar | public | si | 199 | filtros: FiltrosM9, scope: ScopeM9 |
| M9Controller | detalle | public | si | 208 | id: number, scope: ScopeM9 |
| M9Controller | exportar | public | si | 226 | formato: 'CSV' \| 'PDF', filtros: FiltrosM9, scope: ScopeM9 |
| M9Controller | resumenAnalitico | public | si | 250 | scope: ScopeM9 |
| M9Controller | diagnosticarPendientes | public | si | 256 | maximoEdadMs: number |
| M9Controller | reintentarPendientes | public | si | 264 | limite=50,proximoIntentoEn?:Date |
| M9Controller | tratarPorPolitica | public | si | 279 | eventoId:number,categoriaCodigo:string,fecha=this.reloj.ahora() |
| M9Controller | estadoObservabilidad | public | si | 286 | maximoEdadMs: number |
## `Controladores/src/documental/ServicioDocumental.ts`
| Clase | Metodo | Alcance | Async | Linea | Parametros |
| --- | --- | --- | --- | --- | --- |
| ServicioDocumental | capacidadesStorage | public | no | 20 |  |
| ServicioDocumental | crearDocumento | public | no | 21 | entrada: CrearDocumentoEntrada, actor: ActorDocumental |
| ServicioDocumental | consultarDocumento | public | no | 23 | id: bigint |
| ServicioDocumental | cambiarEstadoDocumento | public | no | 24 | id: bigint, revision: number, estado: EstadoDocumento, motivo?: string |
| ServicioDocumental | crearIntencion | public | no | 25 | entrada: CrearIntencionEntrada, actor: ActorDocumental |
| ServicioDocumental | consultarIntencion | public | no | 26 | idPublico: string |
| ServicioDocumental | cambiarEstadoIntencion | public | no | 27 | idPublico: string, revision: number, estado: EstadoIntencion, opciones?: { codigoError?: s |
| ServicioDocumental | registrarVersion | public | no | 28 | entrada: RegistrarVersionEntrada, actor: ActorDocumental |
| ServicioDocumental | cambiarEstadoVersion | public | no | 29 | id: bigint, revision: number, estado: EstadoVersion |
| ServicioDocumental | registrarVariante | public | no | 30 | idOriginal: bigint, idDerivada: bigint, tipo: TipoVariante, parametros?: Record<string, un |
| ServicioDocumental | asociarProducto | public | no | 31 | entrada: AsociarProductoEntrada, actor: ActorDocumental |
| ServicioDocumental | listarAsociacionesProducto | public | no | 32 | idProducto: number |
| ServicioDocumental | registrarEvento | public | no | 33 | entrada: RegistrarEventoDocumentalEntrada |
| ServicioDocumental | cambiarEstadoEvento | public | no | 34 | id: bigint, estado: EstadoOutbox, codigoError?: string \| null, leaseToken?: string |
## `Controladores/src/documental/StorageAdapter.ts`
| Clase | Metodo | Alcance | Async | Linea | Parametros |
| --- | --- | --- | --- | --- | --- |
| StorageAdapter | iniciarCarga | public | no | 68 | entrada: { referencia: ReferenciaObjetoStorage; mime: string; tamanoEsperado: bigint; clav |
| StorageAdapter | consultarObjeto | public | no | 72 | referencia: ReferenciaObjetoStorage |
## `Controladores/src/documental/adaptadores/S3CompatibleStorageAdapter.ts`
| Clase | Metodo | Alcance | Async | Linea | Parametros |
| --- | --- | --- | --- | --- | --- |
| ErrorStorage | constructor | public | no | 71 | private readonly esperado: bigint, private readonly proveedor: string |
| ErrorStorage | constructor | public | no | 92 | private readonly configuracion: ConfiguracionStorage, dependencias: DependenciasS3Compatib |
| ErrorStorage | referencia | private | no | 128 | referencia: ReferenciaObjetoStorage |
| ErrorStorage | expiracion | private | no | 136 | expiraEn: Date |
| ErrorStorage | tamanoNumerico | private | no | 145 | tamano: bigint |
| ErrorStorage | integridad | private | no | 163 | resultado: { ContentLength?: number; ETag?: string; ContentType?: string; VersionId?: stri |
| ErrorStorage | protegerLectura | private | no | 175 | stream: Readable |
| ErrorStorage | iniciarCarga | public | si | 186 | entrada: { referencia: ReferenciaObjetoStorage; mime: string; tamanoEsperado: bigint; clav |
| ErrorStorage | subirStream | public | si | 197 | entrada: { referencia: ReferenciaObjetoStorage; contenido: Readable; mime: string; tamanoE |
| ErrorStorage | crearObjetoExclusivo | public | si | 210 | entrada: { referencia: ReferenciaObjetoStorage; contenido: Readable; mime: string; tamanoE |
| ErrorStorage | firmarCarga | public | si | 237 | entrada: { referencia: ReferenciaObjetoStorage; mime: string; tamanoEsperado: bigint; expi |
| ErrorStorage | consultarObjeto | public | si | 248 | referencia: ReferenciaObjetoStorage |
| ErrorStorage | abrirLectura | public | si | 253 | referencia: ReferenciaObjetoStorage |
| ErrorStorage | abrirLecturaCondicionada | public | si | 262 | entrada: { referencia: ReferenciaObjetoStorage; etag: string } |
| ErrorStorage | firmarDescarga | public | si | 272 | entrada: { referencia: ReferenciaObjetoStorage; expiraEn: Date; nombreDescarga: string; mi |
| ErrorStorage | copiarObjeto | public | si | 283 | entrada: { origen: ReferenciaObjetoStorage; destino: ReferenciaObjetoStorage; claveIdempot |
| ErrorStorage | subirParteStream | public | si | 296 | entrada: { referencia: ReferenciaObjetoStorage; identificadorMultipart: string; numero: nu |
| ErrorStorage | firmarParteMultipart | public | si | 309 | entrada: { referencia: ReferenciaObjetoStorage; identificadorMultipart: string; numero: nu |
| ErrorStorage | confirmarMultipart | public | si | 321 | entrada: { referencia: ReferenciaObjetoStorage; identificadorMultipart: string; partes: re |
| ErrorStorage | abortarMultipart | public | si | 338 | entrada: { referencia: ReferenciaObjetoStorage; identificadorMultipart: string } |
| ErrorStorage | listarCargasIncompletas | public | si | 344 | entrada: { contenedor: string; prefijo?: string } |
## `Controladores/src/documental/adaptadores/configuracionStorage.ts`
| Clase | Metodo | Alcance | Async | Linea | Parametros |
| --- | --- | --- | --- | --- | --- |
| ErrorConfiguracionStorage | constructor | public | no | 20 | mensaje: string |
## `Controladores/src/documental/operaciones/CoordinadorCargaDocumental.ts`
| Clase | Metodo | Alcance | Async | Linea | Parametros |
| --- | --- | --- | --- | --- | --- |
| CoordinadorCargaDocumental | consultarIntencion | public | no | 22 | idPublico: string |
| CoordinadorCargaDocumental | consultarVersionPorObjeto | public | no | 24 | proveedor: string, contenedor: string, clave: string |
| CoordinadorCargaDocumental | registrarVersionYFinalizarIntencion | public | no | 25 | entrada: { idIntencionPublico: string; revisionIntencion: number; version: RegistrarVersio |
| CoordinadorCargaDocumental | confirmar | public | si | 56 | entrada: { idIntencion: string; idDocumento: bigint; actor: ActorBackendDocumental; sha256 |
## `Controladores/src/documental/operaciones/ProcesadorOutboxDocumental.ts`
| Clase | Metodo | Alcance | Async | Linea | Parametros |
| --- | --- | --- | --- | --- | --- |
| ProcesadorOutboxDocumental | reclamarSiguienteEvento | public | no | 13 | fecha: Date, leaseHasta: Date |
| ProcesadorOutboxDocumental | constructor | public | no | 26 | private readonly repositorio: RepositorioOutboxDocumental, private readonly manejadores: R |
| ProcesadorOutboxDocumental | procesarUno | public | si | 27 | fecha = new Date() |
## `Controladores/src/documental/operaciones/ReconciliadorDocumental.ts`
| Clase | Metodo | Alcance | Async | Linea | Parametros |
| --- | --- | --- | --- | --- | --- |
| ReconciliadorDocumental | constructor | public | no | 11 | private readonly storage: StorageAdapter |
| ReconciliadorDocumental | diagnosticar | public | si | 12 | entrada: { versiones: readonly VersionParaReconciliar[]; intenciones: readonly IntencionPa |
## `Controladores/src/documental/operaciones/ServicioRecuperacionDocumental.ts`
| Clase | Metodo | Alcance | Async | Linea | Parametros |
| --- | --- | --- | --- | --- | --- |
| ServicioRecuperacionDocumental | firmar | public | si | 25 | entrada: { idVersion: bigint; actor: ActorBackendDocumental; vigenciaSegundos?: number } |
## `Controladores/src/documental/productos/CoordinadorDocumentosProducto.ts`
| Clase | Metodo | Alcance | Async | Linea | Parametros |
| --- | --- | --- | --- | --- | --- |
| CoordinadorDocumentosProducto | asociarProducto | public | no | 6 | entrada: AsociarProductoEntrada, actor: { id: bigint } |
## `Controladores/src/documental/productos/IntegracionM9DocumentosProducto.ts`
| Clase | Metodo | Alcance | Async | Linea | Parametros |
| --- | --- | --- | --- | --- | --- |
| PuenteM9DocumentosProducto | publicar | public | no | 48 | evento: EventoM9DocumentalPreparado |
| PuenteM9DocumentosProducto | constructor | public | no | 55 | private readonly publicador: PublicadorM9DocumentalAprobado, private readonly eventosAprob |
| PuenteM9DocumentosProducto | publicar | public | si | 56 | evento: EventoM9DocumentalPreparado |
## `Controladores/src/documental/productos/ServicioDocumentosProducto.ts`
| Clase | Metodo | Alcance | Async | Linea | Parametros |
| --- | --- | --- | --- | --- | --- |
| ServicioDocumentosProducto | consultarCapacidades | public | si | 37 | idProducto: number, actor: ActorBackendDocumental |
| ServicioDocumentosProducto | exigirOperacionBinaria | public | si | 60 | idProducto:number, accion:Extract<AccionDocumental,'CREAR_INTENCION'\|'CONFIRMAR_CARGA'\|'RE |
| ServicioDocumentosProducto | listar | public | si | 66 | idProducto: number, actor: ActorBackendDocumental |
| ServicioDocumentosProducto | listarParaSegmento | public | si | 84 | idProducto: number, segmento: 'B2B' \| 'B2C', actor: ActorBackendDocumental |
| ServicioDocumentosProducto | consultarVersiones | public | si | 93 | idProducto: number, idDocumento: bigint, actor: ActorBackendDocumental |
| ServicioDocumentosProducto | mapear | private | no | 103 | asociacion: AsociacionDocumental, idProducto: number, mostrarResponsable: boolean |
## `Controladores/src/documental/repositorios/RepositorioDocumentalPrisma.ts`
| Clase | Metodo | Alcance | Async | Linea | Parametros |
| --- | --- | --- | --- | --- | --- |
| RepositorioDocumentalPrisma | constructor | public | no | 29 | private readonly cliente: PrismaClient = prisma |
| RepositorioDocumentalPrisma | politicaValida | private | si | 41 | tx: ClienteTx, id: number \| null \| undefined |
| RepositorioDocumentalPrisma | crearDocumento | public | si | 51 | entrada: CrearDocumentoEntrada, actor: ActorDocumental |
| RepositorioDocumentalPrisma | consultarDocumento | public | si | 69 | id: bigint |
| RepositorioDocumentalPrisma | cambiarEstadoDocumento | public | si | 78 | id: bigint, revision: number, siguiente: EstadoDocumento, motivo?: string |
| RepositorioDocumentalPrisma | intencionCoincide | private | no | 93 | actual: { id_documento_logico: bigint \| null; clasificacion: string; nombre_declarado: str |
| RepositorioDocumentalPrisma | crearIntencion | public | si | 97 | entrada: CrearIntencionEntrada, actor: ActorDocumental |
| RepositorioDocumentalPrisma | consultarIntencion | public | si | 128 | idPublico: string |
| RepositorioDocumentalPrisma | cambiarEstadoIntencion | public | si | 134 | idPublico: string, revision: number, siguiente: EstadoIntencion, opciones: { codigoError?: |
| RepositorioDocumentalPrisma | registrarVersion | public | si | 149 | entrada: RegistrarVersionEntrada, actor: ActorDocumental |
| RepositorioDocumentalPrisma | consultarVersionPorObjeto | public | si | 184 | proveedor: string, contenedor: string, clave: string |
| RepositorioDocumentalPrisma | cambiarEstadoVersion | public | si | 251 | id: bigint, revision: number, siguiente: EstadoVersion |
| RepositorioDocumentalPrisma | registrarVariante | public | si | 262 | idOriginal: bigint, idDerivada: bigint, tipo: TipoVariante, parametros?: Record<string, un |
| RepositorioDocumentalPrisma | asociarProducto | public | si | 272 | entrada: AsociarProductoEntrada, actor: ActorDocumental |
| RepositorioDocumentalPrisma | listarAsociacionesProducto | public | si | 317 | idProducto: number |
| RepositorioDocumentalPrisma | consultarDocumentosProducto | public | si | 323 | idProducto: number, incluirHistorial: boolean, limiteVersiones = 50 |
| RepositorioDocumentalPrisma | registrarEvento | public | si | 361 | entrada: RegistrarEventoDocumentalEntrada |
| RepositorioDocumentalPrisma | cambiarEstadoEvento | public | si | 375 | id: bigint, siguiente: EstadoOutbox, codigoError?: string \| null, leaseToken?: string |
| RepositorioDocumentalPrisma | reclamarSiguienteEvento | public | si | 397 | fecha: Date, leaseHasta: Date |
| RepositorioDocumentalPrisma | reprogramarEventosFallidos | public | si | 418 | fecha: Date, limite = 100 |
## `Controladores/src/documental/seguridad/AntivirusAdapter.ts`
| Clase | Metodo | Alcance | Async | Linea | Parametros |
| --- | --- | --- | --- | --- | --- |
| AntivirusNoDisponible | escanear | public | no | 12 | contenido: Readable |
| AntivirusNoDisponible | escanear | public | si | 18 |  |
| AntivirusNoDisponible | comprobarDisponibilidad | public | si | 21 |  |
| AntivirusNoDisponible | comprobarDisponibilidad | public | si | 40 |  |
| AntivirusNoDisponible | escanear | public | si | 70 | contenido: Readable |
## `Controladores/src/documental/seguridad/AuditoriaDocumental.ts`
| Clase | Metodo | Alcance | Async | Linea | Parametros |
| --- | --- | --- | --- | --- | --- |
| AuditoriaDocumental | publicar | public | no | 18 | evento: EventoAuditoriaDocumental |
## `Controladores/src/documental/seguridad/AutorizacionDocumental.ts`
| Clase | Metodo | Alcance | Async | Linea | Parametros |
| --- | --- | --- | --- | --- | --- |
| AutorizadorDocumental | constructor | public | no | 37 | private readonly verificarAlcance: VerificadorAlcanceDocumental |
| AutorizadorDocumental | puede | public | si | 38 | actor: ActorBackendDocumental, accion: AccionDocumental, contexto: ContextoAutorizacionDoc |
| AutorizadorDocumental | exigir | public | si | 48 | actor: ActorBackendDocumental, accion: AccionDocumental, contexto: ContextoAutorizacionDoc |
## `Controladores/src/documental/tipos.ts`
| Clase | Metodo | Alcance | Async | Linea | Parametros |
| --- | --- | --- | --- | --- | --- |
| ErrorDocumental | constructor | public | no | 79 | public readonly codigo: string, mensaje: string, public readonly estadoHttp = 400 |
## `Controladores/src/servicios/AdaptadorCreditoM8ParaM7.ts`
| Clase | Metodo | Alcance | Async | Linea | Parametros |
| --- | --- | --- | --- | --- | --- |
| AdaptadorCreditoM8ParaM7 | constructor | public | no | 8 | private readonly credito: M8Controller |
| AdaptadorCreditoM8ParaM7 | consultarExposicion | public | no | 9 | consulta: Consulta |
| AdaptadorCreditoM8ParaM7 | consultarAlertas | public | no | 13 | consulta: Consulta |
## `Controladores/src/servicios/AuditoriaDocumental.ts`
| Clase | Metodo | Alcance | Async | Linea | Parametros |
| --- | --- | --- | --- | --- | --- |
| AuditoriaDocumentalLegacyPrisma | registrar | public | no | 42 | contexto: object, evento: EventoDocumento |
| AuditoriaDocumentalLegacyPrisma | ultimaCondicionEntrega | public | no | 43 | contexto: object, tipoDocumento: string, idDocumento: number |
| AuditoriaDocumentalLegacyPrisma | registrar | public | si | 58 | contexto: object, evento: EventoDocumento |
| AuditoriaDocumentalLegacyPrisma | ultimaCondicionEntrega | public | si | 74 | contexto: object, tipoDocumento: string, idDocumento: number |
| AuditoriaDocumentalLegacyPrisma | listarEventosHistorial | public | si | 98 | contexto: object, idsRemuneraciones: number[], idsPeriodos: number[] |
## `Controladores/src/servicios/FuentePagoRemuneracion.ts`
| Clase | Metodo | Alcance | Async | Linea | Parametros |
| --- | --- | --- | --- | --- | --- |
| FuentePagoRemuneracionNoImplementada | consultarEstado | public | no | 10 | tx: Prisma.TransactionClient, idRemuneracion: number |
| FuentePagoRemuneracionNoImplementada | consultarEstado | public | si | 14 | _tx: Prisma.TransactionClient, _idRemuneracion: number |
| FuentePagoRemuneracionNoImplementada | constructor | public | no | 20 | private readonly repositorio = new RepositorioPagoRemuneracionPrisma() |
| FuentePagoRemuneracionNoImplementada | consultarEstado | public | si | 21 | tx: Prisma.TransactionClient, idRemuneracion: number |
## `Controladores/src/servicios/RepositorioPagoRemuneracion.ts`
| Clase | Metodo | Alcance | Async | Linea | Parametros |
| --- | --- | --- | --- | --- | --- |
| RepositorioPagoRemuneracionPrisma | remuneracion | public | no | 19 | id: number |
| RepositorioPagoRemuneracionPrisma | anticipo | public | no | 20 | id: number |
| RepositorioPagoRemuneracionPrisma | regularizacion | public | no | 21 | id: number |
| RepositorioPagoRemuneracionPrisma | boletaHonorarios | public | no | 22 | id: number |
| RepositorioPagoRemuneracionPrisma | desdePersistencia | public | no | 23 | tipo: string, id: number |
| RepositorioPagoRemuneracionPrisma | origenDesdePago | public | no | 31 | pago: { origen_tipo: string; origen_id: number } |
| RepositorioPagoRemuneracionPrisma | tipoPublico | public | no | 35 | origen: OrigenPagoRemuneracion |
| RepositorioPagoRemuneracionPrisma | criterio | private | no | 37 | origen: OrigenPagoRemuneracion |
| RepositorioPagoRemuneracionPrisma | bloquearOrigen | public | si | 41 | cliente: ClientePago, origen: OrigenPagoRemuneracion |
| RepositorioPagoRemuneracionPrisma | bloquearRemuneracion | public | si | 46 | cliente: ClientePago, id: number |
| RepositorioPagoRemuneracionPrisma | pagosConfirmadosAnticipo | public | si | 50 | cliente: ClientePago, idAnticipo: number |
| RepositorioPagoRemuneracionPrisma | idsAnticiposConPagoConfirmado | public | si | 58 | cliente: ClientePago |
| RepositorioPagoRemuneracionPrisma | tienePagoEfectivo | public | si | 66 | cliente: ClientePago, origen: OrigenPagoRemuneracion |
| RepositorioPagoRemuneracionPrisma | buscarPagoEfectivo | public | si | 70 | cliente: ClientePago, origen: OrigenPagoRemuneracion |
| RepositorioPagoRemuneracionPrisma | pagosEfectivosAnticipos | public | si | 75 | cliente: ClientePago, ids: number[] |
| RepositorioPagoRemuneracionPrisma | montoPagadoEfectivo | public | si | 87 | cliente: ClientePago, origen: OrigenPagoRemuneracion |
| RepositorioPagoRemuneracionPrisma | estadoEconomicoOrigen | public | si | 92 | cliente: ClientePago, origen: OrigenPagoRemuneracion, montoOriginal?: Prisma.Decimal |
| RepositorioPagoRemuneracionPrisma | buscarPorClave | public | si | 98 | cliente: ClientePago, clave: string |
| RepositorioPagoRemuneracionPrisma | obtener | public | si | 113 | cliente: ClientePago, id: number, _incluirMedio = false |
| RepositorioPagoRemuneracionPrisma | confirmarPreparado | public | si | 128 | cliente: ClientePago, id: number, idUsuario: bigint |
| RepositorioPagoRemuneracionPrisma | listar | public | si | 135 | cliente: ClientePago |
| RepositorioPagoRemuneracionPrisma | listarPorOrigenes | public | si | 139 | cliente: ClientePago, origenes: OrigenPagoRemuneracion[] |
| RepositorioPagoRemuneracionPrisma | anularConfirmado | public | si | 148 | cliente: ClientePago, id: number, motivo: string, idUsuario: bigint |
| RepositorioPagoRemuneracionPrisma | registrarReversion | public | si | 152 | cliente: ClientePago, idPago: number, monto: Prisma.Decimal, motivo: string, idUsuario: bi |
## `Vistas/src/components/documental/contratoDocumental.ts`
| Clase | Metodo | Alcance | Async | Linea | Parametros |
| --- | --- | --- | --- | --- | --- |
| contratoDocumental | listarProducto | public | no | 21 | productoId: number |

## Fuentes de verdad consultadas
- `Controladores/prisma/schema.prisma`
- `Controladores/pruebas`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/rutas/finanzas.ts`
- `Vistas/src`
- `Vistas/src/App.tsx`
