# Sistema documental y PDF

**Proyecto:** Puertas Blindadas
**Documento:** 19
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

## Nucleo documental

`documento_logico` representa el concepto; `version_documento` representa bytes inmutables y metadatos. StorageAdapter abstrae R2/S3-compatible. AntivirusAdapter analiza contenido. SHA-256 verifica integridad.

## Preview vs emitido

Preview usa el motor real, pero se marca BORRADOR y no confirma una operacion comercial. Emitido conserva snapshot, plantilla, archivo, hash y referencia historica. Un PDF emitido no se regenera con catalogos actuales.

## Plantillas y carta B2C

Las plantillas tienen borradores y versiones publicadas inmutables. La carta general B2C no requiere cliente ni crea cotizacion/NV/OT. Publicar requiere datos completos, permiso, PDF y storage confirmado.

## Seguridad

MIME, tamano, hash, claves opacas, antivirus, bucket privado y autorizacion se validan. Error, timeout o servicio no disponible cierran el flujo. Una URL firmada no se persiste como identidad del documento.

## Recuperacion

Se lee el objeto privado asociado a la version y se compara SHA-256. CU376 y alcance protegen descarga. El archivo historico es exactamente el confirmado.

## Metodos relacionados
| Clase | Metodo | Archivo | Linea |
| --- | --- | --- | --- |
| M2Controller | aplicarAjusteProductoPlantilla | Controladores/src/controladores/M2Controller.ts | 465 |
| M2Controller | normalizarPlantillaFabricacion | Controladores/src/controladores/M2Controller.ts | 1035 |
| M2Controller | obtenerPlantillaFabricacionFamilia | Controladores/src/controladores/M2Controller.ts | 1069 |
| M2Controller | guardarBorradorPlantillaFabricacion | Controladores/src/controladores/M2Controller.ts | 1075 |
| M2Controller | publicarPlantillaFabricacion | Controladores/src/controladores/M2Controller.ts | 1092 |
| M2Controller | registrarDocumento | Controladores/src/controladores/M2Controller.ts | 1361 |
| M2Controller | descartarBorrador | Controladores/src/controladores/M2Controller.ts | 1426 |
| M5Controller | presentarDocumentoProveedor | Controladores/src/controladores/M5Controller.ts | 853 |
| M5Controller | documentoM5 | Controladores/src/controladores/M5Controller.ts | 874 |
| M5Controller | presentarDocumentoM5 | Controladores/src/controladores/M5Controller.ts | 880 |
| M5Controller | registrarDocumentoM5 | Controladores/src/controladores/M5Controller.ts | 919 |
| M5Controller | registrarDocumentoPreliminar | Controladores/src/controladores/M5Controller.ts | 958 |
| M5Controller | registrarDocumentoDefinitivo | Controladores/src/controladores/M5Controller.ts | 960 |
| M5Controller | asociarDocumentoOrdenes | Controladores/src/controladores/M5Controller.ts | 961 |
| M5Controller | resolverDiferenciaDocumento | Controladores/src/controladores/M5Controller.ts | 994 |
| M5Controller | resolverExcedenteDocumento | Controladores/src/controladores/M5Controller.ts | 1009 |
| M5Controller | determinarVencimientoDocumento | Controladores/src/controladores/M5Controller.ts | 1037 |
| M5Controller | clasificarDocumento | Controladores/src/controladores/M5Controller.ts | 1060 |
| M5Controller | prepararImputacionDocumento | Controladores/src/controladores/M5Controller.ts | 1077 |
| M5Controller | confirmarImputacionDocumento | Controladores/src/controladores/M5Controller.ts | 1101 |
| M5Controller | generarObligacionDocumento | Controladores/src/controladores/M5Controller.ts | 1117 |
| M5Controller | descartarOperacionPago | Controladores/src/controladores/M5Controller.ts | 1438 |
| M5Controller | catalogosDocumentosProveedor | Controladores/src/controladores/M5Controller.ts | 1968 |
| M5Controller | listarDocumentosProveedor | Controladores/src/controladores/M5Controller.ts | 1975 |
| M5Controller | obtenerDocumentoProveedor | Controladores/src/controladores/M5Controller.ts | 1992 |
| M6Controller | configuracionDocumental | Controladores/src/controladores/M6Controller.ts | 833 |
| M6Controller | obtenerConfiguracionDocumental | Controladores/src/controladores/M6Controller.ts | 840 |
| M6Controller | actualizarConfiguracionDocumental | Controladores/src/controladores/M6Controller.ts | 842 |
| M6Controller | exigirAlcanceDocumento | Controladores/src/controladores/M6Controller.ts | 2240 |
| M6Controller | listarDocumentosRemuneracion | Controladores/src/controladores/M6Controller.ts | 2271 |
| M6Controller | descargarDocumentoRemuneracion | Controladores/src/controladores/M6Controller.ts | 2292 |
| M6Controller | reenviarDocumentoRemuneracion | Controladores/src/controladores/M6Controller.ts | 2305 |
| M6Controller | registrarEntregaDocumento | Controladores/src/controladores/M6Controller.ts | 2342 |
| M6Controller | consultarEntregaDocumento | Controladores/src/controladores/M6Controller.ts | 2356 |
| M6Controller | modificarTareaProduccion | Controladores/src/controladores/M6Controller.ts | 3154 |
| M7Controller | descargarPdfContextual | Controladores/src/controladores/M7Controller.ts | 2170 |
| ErrorConfiguracionStorage | constructor | Controladores/src/documental/adaptadores/configuracionStorage.ts | 20 |
| ErrorStorage | constructor | Controladores/src/documental/adaptadores/S3CompatibleStorageAdapter.ts | 71 |
| ErrorStorage | constructor | Controladores/src/documental/adaptadores/S3CompatibleStorageAdapter.ts | 92 |
| ErrorStorage | referencia | Controladores/src/documental/adaptadores/S3CompatibleStorageAdapter.ts | 128 |
| ErrorStorage | expiracion | Controladores/src/documental/adaptadores/S3CompatibleStorageAdapter.ts | 136 |
| ErrorStorage | tamanoNumerico | Controladores/src/documental/adaptadores/S3CompatibleStorageAdapter.ts | 145 |
| ErrorStorage | integridad | Controladores/src/documental/adaptadores/S3CompatibleStorageAdapter.ts | 163 |
| ErrorStorage | protegerLectura | Controladores/src/documental/adaptadores/S3CompatibleStorageAdapter.ts | 175 |
| ErrorStorage | iniciarCarga | Controladores/src/documental/adaptadores/S3CompatibleStorageAdapter.ts | 186 |
| ErrorStorage | subirStream | Controladores/src/documental/adaptadores/S3CompatibleStorageAdapter.ts | 197 |
| ErrorStorage | crearObjetoExclusivo | Controladores/src/documental/adaptadores/S3CompatibleStorageAdapter.ts | 210 |
| ErrorStorage | firmarCarga | Controladores/src/documental/adaptadores/S3CompatibleStorageAdapter.ts | 237 |
| ErrorStorage | consultarObjeto | Controladores/src/documental/adaptadores/S3CompatibleStorageAdapter.ts | 248 |
| ErrorStorage | abrirLectura | Controladores/src/documental/adaptadores/S3CompatibleStorageAdapter.ts | 253 |
| ErrorStorage | abrirLecturaCondicionada | Controladores/src/documental/adaptadores/S3CompatibleStorageAdapter.ts | 262 |
| ErrorStorage | firmarDescarga | Controladores/src/documental/adaptadores/S3CompatibleStorageAdapter.ts | 272 |
| ErrorStorage | copiarObjeto | Controladores/src/documental/adaptadores/S3CompatibleStorageAdapter.ts | 283 |
| ErrorStorage | subirParteStream | Controladores/src/documental/adaptadores/S3CompatibleStorageAdapter.ts | 296 |
| ErrorStorage | firmarParteMultipart | Controladores/src/documental/adaptadores/S3CompatibleStorageAdapter.ts | 309 |
| ErrorStorage | confirmarMultipart | Controladores/src/documental/adaptadores/S3CompatibleStorageAdapter.ts | 321 |
| ErrorStorage | abortarMultipart | Controladores/src/documental/adaptadores/S3CompatibleStorageAdapter.ts | 338 |
| ErrorStorage | listarCargasIncompletas | Controladores/src/documental/adaptadores/S3CompatibleStorageAdapter.ts | 344 |
| CoordinadorCargaDocumental | consultarIntencion | Controladores/src/documental/operaciones/CoordinadorCargaDocumental.ts | 22 |
| CoordinadorCargaDocumental | consultarVersionPorObjeto | Controladores/src/documental/operaciones/CoordinadorCargaDocumental.ts | 24 |
| CoordinadorCargaDocumental | registrarVersionYFinalizarIntencion | Controladores/src/documental/operaciones/CoordinadorCargaDocumental.ts | 25 |
| CoordinadorCargaDocumental | confirmar | Controladores/src/documental/operaciones/CoordinadorCargaDocumental.ts | 56 |
| ProcesadorOutboxDocumental | reclamarSiguienteEvento | Controladores/src/documental/operaciones/ProcesadorOutboxDocumental.ts | 13 |
| ProcesadorOutboxDocumental | constructor | Controladores/src/documental/operaciones/ProcesadorOutboxDocumental.ts | 26 |
| ProcesadorOutboxDocumental | procesarUno | Controladores/src/documental/operaciones/ProcesadorOutboxDocumental.ts | 27 |
| ReconciliadorDocumental | constructor | Controladores/src/documental/operaciones/ReconciliadorDocumental.ts | 11 |
| ReconciliadorDocumental | diagnosticar | Controladores/src/documental/operaciones/ReconciliadorDocumental.ts | 12 |
| ServicioRecuperacionDocumental | firmar | Controladores/src/documental/operaciones/ServicioRecuperacionDocumental.ts | 25 |
| CoordinadorDocumentosProducto | asociarProducto | Controladores/src/documental/productos/CoordinadorDocumentosProducto.ts | 6 |
| PuenteM9DocumentosProducto | publicar | Controladores/src/documental/productos/IntegracionM9DocumentosProducto.ts | 48 |
| PuenteM9DocumentosProducto | constructor | Controladores/src/documental/productos/IntegracionM9DocumentosProducto.ts | 55 |
| PuenteM9DocumentosProducto | publicar | Controladores/src/documental/productos/IntegracionM9DocumentosProducto.ts | 56 |
| ServicioDocumentosProducto | consultarCapacidades | Controladores/src/documental/productos/ServicioDocumentosProducto.ts | 37 |
| ServicioDocumentosProducto | exigirOperacionBinaria | Controladores/src/documental/productos/ServicioDocumentosProducto.ts | 60 |
| ServicioDocumentosProducto | listar | Controladores/src/documental/productos/ServicioDocumentosProducto.ts | 66 |
| ServicioDocumentosProducto | listarParaSegmento | Controladores/src/documental/productos/ServicioDocumentosProducto.ts | 84 |
| ServicioDocumentosProducto | consultarVersiones | Controladores/src/documental/productos/ServicioDocumentosProducto.ts | 93 |
| ServicioDocumentosProducto | mapear | Controladores/src/documental/productos/ServicioDocumentosProducto.ts | 103 |
| RepositorioDocumentalPrisma | constructor | Controladores/src/documental/repositorios/RepositorioDocumentalPrisma.ts | 29 |
| RepositorioDocumentalPrisma | politicaValida | Controladores/src/documental/repositorios/RepositorioDocumentalPrisma.ts | 41 |
| RepositorioDocumentalPrisma | crearDocumento | Controladores/src/documental/repositorios/RepositorioDocumentalPrisma.ts | 51 |
| RepositorioDocumentalPrisma | consultarDocumento | Controladores/src/documental/repositorios/RepositorioDocumentalPrisma.ts | 69 |
| RepositorioDocumentalPrisma | cambiarEstadoDocumento | Controladores/src/documental/repositorios/RepositorioDocumentalPrisma.ts | 78 |
| RepositorioDocumentalPrisma | intencionCoincide | Controladores/src/documental/repositorios/RepositorioDocumentalPrisma.ts | 93 |
| RepositorioDocumentalPrisma | crearIntencion | Controladores/src/documental/repositorios/RepositorioDocumentalPrisma.ts | 97 |
| RepositorioDocumentalPrisma | consultarIntencion | Controladores/src/documental/repositorios/RepositorioDocumentalPrisma.ts | 128 |
| RepositorioDocumentalPrisma | cambiarEstadoIntencion | Controladores/src/documental/repositorios/RepositorioDocumentalPrisma.ts | 134 |
| RepositorioDocumentalPrisma | registrarVersion | Controladores/src/documental/repositorios/RepositorioDocumentalPrisma.ts | 149 |
| RepositorioDocumentalPrisma | consultarVersionPorObjeto | Controladores/src/documental/repositorios/RepositorioDocumentalPrisma.ts | 184 |
| RepositorioDocumentalPrisma | cambiarEstadoVersion | Controladores/src/documental/repositorios/RepositorioDocumentalPrisma.ts | 251 |
| RepositorioDocumentalPrisma | registrarVariante | Controladores/src/documental/repositorios/RepositorioDocumentalPrisma.ts | 262 |
| RepositorioDocumentalPrisma | asociarProducto | Controladores/src/documental/repositorios/RepositorioDocumentalPrisma.ts | 272 |
| RepositorioDocumentalPrisma | listarAsociacionesProducto | Controladores/src/documental/repositorios/RepositorioDocumentalPrisma.ts | 317 |
| RepositorioDocumentalPrisma | consultarDocumentosProducto | Controladores/src/documental/repositorios/RepositorioDocumentalPrisma.ts | 323 |
| RepositorioDocumentalPrisma | registrarEvento | Controladores/src/documental/repositorios/RepositorioDocumentalPrisma.ts | 361 |
| RepositorioDocumentalPrisma | cambiarEstadoEvento | Controladores/src/documental/repositorios/RepositorioDocumentalPrisma.ts | 375 |
| RepositorioDocumentalPrisma | reclamarSiguienteEvento | Controladores/src/documental/repositorios/RepositorioDocumentalPrisma.ts | 397 |
| RepositorioDocumentalPrisma | reprogramarEventosFallidos | Controladores/src/documental/repositorios/RepositorioDocumentalPrisma.ts | 418 |
| AntivirusNoDisponible | escanear | Controladores/src/documental/seguridad/AntivirusAdapter.ts | 12 |
| AntivirusNoDisponible | escanear | Controladores/src/documental/seguridad/AntivirusAdapter.ts | 18 |
| AntivirusNoDisponible | comprobarDisponibilidad | Controladores/src/documental/seguridad/AntivirusAdapter.ts | 21 |
| AntivirusNoDisponible | comprobarDisponibilidad | Controladores/src/documental/seguridad/AntivirusAdapter.ts | 40 |
| AntivirusNoDisponible | escanear | Controladores/src/documental/seguridad/AntivirusAdapter.ts | 70 |
| AuditoriaDocumental | publicar | Controladores/src/documental/seguridad/AuditoriaDocumental.ts | 18 |
| AutorizadorDocumental | constructor | Controladores/src/documental/seguridad/AutorizacionDocumental.ts | 37 |
| AutorizadorDocumental | puede | Controladores/src/documental/seguridad/AutorizacionDocumental.ts | 38 |
| AutorizadorDocumental | exigir | Controladores/src/documental/seguridad/AutorizacionDocumental.ts | 48 |
| ServicioDocumental | capacidadesStorage | Controladores/src/documental/ServicioDocumental.ts | 20 |
| ServicioDocumental | crearDocumento | Controladores/src/documental/ServicioDocumental.ts | 21 |
| ServicioDocumental | consultarDocumento | Controladores/src/documental/ServicioDocumental.ts | 23 |
| ServicioDocumental | cambiarEstadoDocumento | Controladores/src/documental/ServicioDocumental.ts | 24 |
| ServicioDocumental | crearIntencion | Controladores/src/documental/ServicioDocumental.ts | 25 |
| ServicioDocumental | consultarIntencion | Controladores/src/documental/ServicioDocumental.ts | 26 |
| ServicioDocumental | cambiarEstadoIntencion | Controladores/src/documental/ServicioDocumental.ts | 27 |
| ServicioDocumental | registrarVersion | Controladores/src/documental/ServicioDocumental.ts | 28 |
| ServicioDocumental | cambiarEstadoVersion | Controladores/src/documental/ServicioDocumental.ts | 29 |
| ServicioDocumental | registrarVariante | Controladores/src/documental/ServicioDocumental.ts | 30 |
| ServicioDocumental | asociarProducto | Controladores/src/documental/ServicioDocumental.ts | 31 |
| ServicioDocumental | listarAsociacionesProducto | Controladores/src/documental/ServicioDocumental.ts | 32 |
| ServicioDocumental | registrarEvento | Controladores/src/documental/ServicioDocumental.ts | 33 |
| ServicioDocumental | cambiarEstadoEvento | Controladores/src/documental/ServicioDocumental.ts | 34 |
| StorageAdapter | iniciarCarga | Controladores/src/documental/StorageAdapter.ts | 68 |
| StorageAdapter | consultarObjeto | Controladores/src/documental/StorageAdapter.ts | 72 |
| ErrorDocumental | constructor | Controladores/src/documental/tipos.ts | 79 |
| AuditoriaDocumentalLegacyPrisma | registrar | Controladores/src/servicios/AuditoriaDocumental.ts | 42 |
| AuditoriaDocumentalLegacyPrisma | ultimaCondicionEntrega | Controladores/src/servicios/AuditoriaDocumental.ts | 43 |
| AuditoriaDocumentalLegacyPrisma | registrar | Controladores/src/servicios/AuditoriaDocumental.ts | 58 |
| AuditoriaDocumentalLegacyPrisma | ultimaCondicionEntrega | Controladores/src/servicios/AuditoriaDocumental.ts | 74 |
| AuditoriaDocumentalLegacyPrisma | listarEventosHistorial | Controladores/src/servicios/AuditoriaDocumental.ts | 98 |
| contratoDocumental | listarProducto | Vistas/src/components/documental/contratoDocumental.ts | 21 |
## Modelos relacionados
| Modelo | Schema | Tabla | Campos |
| --- | --- | --- | --- |
| detalle_costo_proyecto_documento_proveedor | finanzas | detalle_costo_proyecto_documento_proveedor | 8 |
| detalle_documento_compra_proveedor | finanzas | detalle_documento_compra_proveedor | 10 |
| documento_compra_proveedor | finanzas | documento_compra_proveedor | 22 |
| documento_tributario | finanzas | documento_tributario | 24 |
| documento_proveedor_m5 | finanzas | documento_proveedor_m5 | 28 |
| asociacion_documento_oc_m5 | finanzas | asociacion_documento_oc_m5 | 16 |
| tipo_documento | finanzas | tipo_documento | 10 |
| configuracion_conservacion_documental | finanzas | configuracion_conservacion_documental | 8 |
| plantilla_fabricacion_familia | finanzas | plantilla_fabricacion_familia | 14 |
| version_plantilla_fabricacion | finanzas | version_plantilla_fabricacion | 11 |
| ajuste_producto_plantilla_fabricacion | finanzas | ajuste_producto_plantilla_fabricacion | 16 |
| documento_logico | finanzas | documento_logico | 21 |
| version_documento | finanzas | version_documento | 28 |
| variante_documento | finanzas | variante_documento | 8 |
| intencion_carga_documental | finanzas | intencion_carga_documental | 20 |
| producto_comercial_documento | finanzas | producto_comercial_documento | 16 |
| evento_operacional_documental | finanzas | evento_operacional_documental | 16 |
| plantilla_documental_comercial | finanzas | plantilla_documental_comercial | 12 |
| plantilla_documental_version | finanzas | plantilla_documental_version | 13 |
| carta_comercial_b2c | finanzas | carta_comercial_b2c | 11 |
| carta_comercial_b2c_version | finanzas | carta_comercial_b2c_version | 20 |
| carta_comercial_b2c_version_producto | finanzas | carta_comercial_b2c_version_producto | 9 |
| carta_comercial_b2c_version_fotografia | finanzas | carta_comercial_b2c_version_fotografia | 8 |
| documento_tributario_nota_venta | finanzas | documento_tributario_nota_venta | 4 |
## Suites relacionadas
| Suite | Casos |
| --- | --- |
| Controladores/pruebas/adaptador-storage-r2-s3.test.cjs | 56 |
| Controladores/pruebas/c4-1-antivirus-real.test.cjs | 1 |
| Controladores/pruebas/c4-3-documental-real.test.cjs | 2 |
| Controladores/pruebas/c4-documentos-comerciales.test.cjs | 5 |
| Controladores/pruebas/c4-documentos-pg18.test.cjs | 2 |
| Controladores/pruebas/catalogo-documental-c2.test.cjs | 11 |
| Controladores/pruebas/csv-exportaciones-documentales.test.cjs | 5 |
| Controladores/pruebas/documentos-producto-backend.test.cjs | 34 |
| Controladores/pruebas/m2-tareas-plantillas-fabricacion.test.cjs | 14 |
| Controladores/pruebas/m3-pdf-comprobante.test.cjs | 4 |
| Controladores/pruebas/m6-pdf-documental.test.cjs | 9 |
| Controladores/pruebas/m7-pdf-gerencial.test.cjs | 9 |
| Controladores/pruebas/m9-pdf-informe.test.cjs | 7 |
| Controladores/pruebas/mantenedores-documental-ui.test.cjs | 44 |
| Controladores/pruebas/nucleo-documental-portable.test.cjs | 24 |
| Controladores/pruebas/seguridad-integridad-documental.test.cjs | 49 |
| Vistas/src/components/documental/DocumentosHistoricosCotizacion.test.tsx | 4 |
| Vistas/src/components/documental/PanelDocumentosProducto.test.tsx | 11 |
| Vistas/src/components/documental/PanelDocumentosProductoConectado.test.tsx | 3 |
| Vistas/src/views/Mantenedores/DocumentosComerciales.test.tsx | 3 |

## Fuentes de verdad consultadas
- `Controladores/prisma/schema.prisma`
- `Controladores/pruebas`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/rutas/finanzas.ts`
- `Vistas/src`
- `Vistas/src/App.tsx`
