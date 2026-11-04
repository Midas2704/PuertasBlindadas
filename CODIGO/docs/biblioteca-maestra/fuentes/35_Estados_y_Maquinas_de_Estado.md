# Catalogo de estados y transiciones

**Proyecto:** Puertas Blindadas
**Documento:** 35
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

## Enums Prisma detectados
## Estados literales detectados
| Estado | Referencias | Regla de seguridad |
| --- | --- | --- |
| ACEPTADA | Controladores/prisma/migrations/067_alternativas_b2c/migration.sql; Controladores/pruebas/c4-3-documental-real.test.cjs; Controladores/pruebas/cotizaciones-c3-3-pg18.test.cjs; Controladores/pruebas/cotizaciones-migraciones-065-067.test.cjs | Solo transiciones validadas por el controlador; conservar historia |
| ACEPTADO_POR_TRANSPORTE | Controladores/pruebas/m6-cu191-cu195.test.cjs; Controladores/src/controladores/M6Controller.ts; Controladores/src/servicios/AuditoriaDocumental.ts | Solo transiciones validadas por el controlador; conservar historia |
| ACEPTAR_ALTERNATIVA_B2C | Controladores/src/controladores/M2Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| ACTIVA | Controladores/prisma/migrations/054_mantenedor_productos_comerciales/migration.sql; Controladores/prisma/migrations/060_catalogo_tareas_plantillas_fabricacion/migration.sql; Controladores/prisma/migrations/065_catalogos_comerciales_cotizacion/migration.sql; Controladores/prisma/migrations/066_versionado_documental_cotizacion/migration.sql | Solo transiciones validadas por el controlador; conservar historia |
| ACTIVO | Controladores/prisma/migrations/035_m6_honorarios_historial_reversiones/migration.sql; Controladores/prisma/migrations/055_nucleo_documental_portable/migration.sql; Controladores/prisma/migrations/065_catalogos_comerciales_cotizacion/migration.sql; Controladores/prisma/migrations/066_versionado_documental_cotizacion/migration.sql | Solo transiciones validadas por el controlador; conservar historia |
| ALTERNATIVA_B2C_ACEPTADA | Controladores/pruebas/c3-5-obra-proyecto-http.test.cjs; Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| ALTERNATIVA_B2C_RECHAZADA | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| ALTERNATIVA_B2C_SELECCIONADA | Controladores/pruebas/c3-5-obra-proyecto-http.test.cjs; Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| ANTIVIRUS_PENDIENTE_4_4 | Controladores/pruebas/nucleo-documental-portable.test.cjs | Solo transiciones validadas por el controlador; conservar historia |
| ANULADO | Controladores/prisma/migrations/033_m6_ajustes_pagos_remuneraciones/migration.sql; Controladores/prisma/migrations/034_m6_compatibilidad_anulacion_pago/migration.sql; Controladores/prisma/migrations/035_m6_honorarios_historial_reversiones/migration.sql; Controladores/pruebas/m6-cu183-cu186.test.cjs | Solo transiciones validadas por el controlador; conservar historia |
| APROBADA | Controladores/prisma/migrations/042_m8_solicitudes_crediticias/migration.sql; Controladores/prisma/migrations/043_m8_credito_core/migration.sql; Controladores/prisma/migrations/063_aprobacion_rectificacion_liberacion_ot/migration.sql; Controladores/pruebas/csv-exportaciones-documentales.test.cjs | Solo transiciones validadas por el controlador; conservar historia |
| APROBADO_C2_6 | Controladores/pruebas/catalogo-documental-c2.test.cjs; Controladores/pruebas/documentos-producto-backend.test.cjs; Controladores/pruebas/seguridad-comercial-c2-5.test.cjs; Controladores/src/comercial/MatrizAuditoriaComercial.ts | Solo transiciones validadas por el controlador; conservar historia |
| APROBADO_EXISTENTE | Controladores/pruebas/seguridad-comercial-c2-5.test.cjs; Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/documental/seguridad/MatrizCapacidadesDocumentales.ts | Solo transiciones validadas por el controlador; conservar historia |
| ARCHIVADA | Controladores/prisma/migrations/065_catalogos_comerciales_cotizacion/migration.sql; Controladores/prisma/migrations/066_versionado_documental_cotizacion/migration.sql | Solo transiciones validadas por el controlador; conservar historia |
| ARCHIVADO | Controladores/prisma/migrations/055_nucleo_documental_portable/migration.sql; Controladores/pruebas/mantenedores-documental-ui.test.cjs; Controladores/pruebas/nucleo-documental-portable.test.cjs; Controladores/src/documental/estados.ts | Solo transiciones validadas por el controlador; conservar historia |
| ARCHIVAR | Controladores/src/documental/seguridad/AutorizacionDocumental.ts | Solo transiciones validadas por el controlador; conservar historia |
| ARCHIVAR_DOCUMENTO | Controladores/src/documental/seguridad/AutorizacionDocumental.ts; Controladores/src/documental/seguridad/MatrizCapacidadesDocumentales.ts | Solo transiciones validadas por el controlador; conservar historia |
| ARCHIVO_NO_SOPORTADO | Controladores/pruebas/seguridad-integridad-documental.test.cjs; Controladores/src/documental/operaciones/CoordinadorCargaDocumental.ts; Controladores/src/documental/seguridad/AntivirusAdapter.ts | Solo transiciones validadas por el controlador; conservar historia |
| ASOCIACION_PRODUCTO_PENDIENTE | Controladores/pruebas/portabilidad-segura-r2-s3.test.cjs; Controladores/src/documental/productos/CoordinadorDocumentosProducto.ts | Solo transiciones validadas por el controlador; conservar historia |
| BOLETA_HONORARIOS_CONFIRMADA | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| BORRADOR | Controladores/prisma/migrations/042_m8_solicitudes_crediticias/migration.sql; Controladores/prisma/migrations/054_mantenedor_productos_comerciales/migration.sql; Controladores/prisma/migrations/060_catalogo_tareas_plantillas_fabricacion/migration.sql; Controladores/prisma/migrations/065_catalogos_comerciales_cotizacion/migration.sql | Solo transiciones validadas por el controlador; conservar historia |
| BORRADOR_ACTUALIZADO | Controladores/src/controladores/M6Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| BORRADOR_CARTA_COMERCIAL_B2C | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts | Solo transiciones validadas por el controlador; conservar historia |
| BORRADOR_FICHA_COMERCIAL | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts | Solo transiciones validadas por el controlador; conservar historia |
| BORRADOR_NO_EMITIDO | Controladores/pruebas/c4-documentos-pg18.test.cjs; Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts; Vistas/src/views/Mantenedores/DocumentosComerciales.test.tsx | Solo transiciones validadas por el controlador; conservar historia |
| BORRADOR_PLANTILLA_DOCUMENTAL | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts | Solo transiciones validadas por el controlador; conservar historia |
| BORRADOR_PLANTILLA_FABRICACION_GUARDADO | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| BORRADOR_PRODUCTO_COMERCIAL_MODIFICADO | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| CAMBIO_CONFIRMADO | Controladores/pruebas/m9-autorizacion-e2e.test.cjs | Solo transiciones validadas por el controlador; conservar historia |
| CARGA_CONFIRMADA | Controladores/pruebas/nucleo-documental-portable.test.cjs; Controladores/pruebas/seguridad-integridad-documental.test.cjs; Controladores/src/documental/repositorios/RepositorioDocumentalPrisma.ts; Controladores/src/documental/seguridad/AuditoriaDocumental.ts | Solo transiciones validadas por el controlador; conservar historia |
| CARTA_B2C_CREADA | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| CARTA_B2C_PUBLICADA | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts; Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| CERRADA | Controladores/prisma/migrations/033_m6_ajustes_pagos_remuneraciones/migration.sql; Controladores/prisma/migrations/064_gestion_dinamica_produccion_ot/migration.sql; Controladores/pruebas/m6-cu183-cu186.test.cjs; Controladores/pruebas/m6-dashboard-terreno.test.cjs | Solo transiciones validadas por el controlador; conservar historia |
| CLAMAV_NO_DISPONIBLE | Controladores/src/documental/seguridad/AntivirusAdapter.ts | Solo transiciones validadas por el controlador; conservar historia |
| CLAMAV_VALIDADO | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | Solo transiciones validadas por el controlador; conservar historia |
| CLIENTE_CREADO | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| CLIENTE_DESACTIVADO | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| COMPONENTE_PENDIENTE | Controladores/src/controladores/M6Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| CONDICION_COMERCIAL_CREADA | Controladores/src/comercial/MatrizAuditoriaComercial.ts; Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| CONDICION_COMERCIAL_DESACTIVADA | Controladores/src/comercial/MatrizAuditoriaComercial.ts; Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| CONDICION_COMERCIAL_PUBLICADA | Controladores/src/comercial/MatrizAuditoriaComercial.ts; Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| CONFIGURACION_INVALIDA | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts; Controladores/src/documental/seguridad/AntivirusAdapter.ts | Solo transiciones validadas por el controlador; conservar historia |
| CONFIGURACION_PENDIENTE | Controladores/pruebas/m7-cu215-cu219.test.cjs; Controladores/pruebas/m7-cu220-cu224.test.cjs; Controladores/pruebas/m7-cu242-cu253.test.cjs; Controladores/pruebas/m7-cu246.test.cjs | Solo transiciones validadas por el controlador; conservar historia |
| CONFIGURACION_STORAGE_INVALIDA | Controladores/src/documental/adaptadores/configuracionStorage.ts | Solo transiciones validadas por el controlador; conservar historia |
| CONFIRMADA | Controladores/prisma/migrations/035_m6_honorarios_historial_reversiones/migration.sql; Controladores/prisma/migrations/036_m6_repagos_reversiones/migration.sql; Controladores/pruebas/m6-cu187-cu190.test.cjs; Controladores/pruebas/m6-cu196-cu197.test.cjs | Solo transiciones validadas por el controlador; conservar historia |
| CONFIRMADO | Controladores/prisma/migrations/033_m6_ajustes_pagos_remuneraciones/migration.sql; Controladores/prisma/migrations/034_m6_compatibilidad_anulacion_pago/migration.sql; Controladores/prisma/migrations/035_m6_honorarios_historial_reversiones/migration.sql; Controladores/prisma/migrations/036_m6_repagos_reversiones/migration.sql | Solo transiciones validadas por el controlador; conservar historia |
| CONFIRMAR_CARGA | Controladores/src/controladores/C_Finanzas.ts; Controladores/src/documental/productos/CoordinadorDocumentosProducto.ts; Controladores/src/documental/productos/ServicioDocumentosProducto.ts; Controladores/src/documental/seguridad/AutorizacionDocumental.ts | Solo transiciones validadas por el controlador; conservar historia |
| CONTENEDOR_INVALIDO | Controladores/src/documental/validaciones.ts | Solo transiciones validadas por el controlador; conservar historia |
| COTIZACION_APROBADA | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| COTIZACION_B2B_APROBADA_OT_GENERADAS | Controladores/pruebas/c3-5-obra-proyecto-http.test.cjs; Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| COTIZACION_B2C_APROBADA_OT_GENERADAS | Controladores/pruebas/c3-5-obra-proyecto-http.test.cjs; Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| COTIZACION_BORRADOR_CREADA | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| COTIZACION_BORRADOR_MODIFICADA | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| COTIZACION_EMITIDA | Controladores/pruebas/c3-5-obra-proyecto-http.test.cjs; Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| COTIZACION_PDF_CONFIRMADO | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | Solo transiciones validadas por el controlador; conservar historia |
| CREACION_RECTIFICACION | Controladores/src/m6/dashboardTerreno.ts | Solo transiciones validadas por el controlador; conservar historia |
| CREDITO_REACTIVADO | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| DESACTIVACION | Controladores/pruebas/m2-productos-comerciales.test.cjs; Controladores/src/controladores/M2Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| DESACTIVAR_CONDICION | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/comercial/ServicioEscrituraComercial.ts; Controladores/src/controladores/C_Finanzas.ts | Solo transiciones validadas por el controlador; conservar historia |
| DESACTIVAR_OPCIONAL | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/comercial/ServicioEscrituraComercial.ts; Controladores/src/controladores/C_Finanzas.ts | Solo transiciones validadas por el controlador; conservar historia |
| DESACTIVAR_PRECIO | Controladores/pruebas/comercial-c2-7-integracion-pg18.test.cjs; Controladores/pruebas/seguridad-comercial-c2-5.test.cjs; Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/comercial/ServicioEscrituraComercial.ts | Solo transiciones validadas por el controlador; conservar historia |
| DESACTIVAR_SERVICIO | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/comercial/ServicioEscrituraComercial.ts; Controladores/src/controladores/C_Finanzas.ts | Solo transiciones validadas por el controlador; conservar historia |
| DESACTIVAR_TARIFA | Controladores/pruebas/comercial-c2-7-integracion-pg18.test.cjs; Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/comercial/ServicioEscrituraComercial.ts; Controladores/src/controladores/C_Finanzas.ts | Solo transiciones validadas por el controlador; conservar historia |
| DISPONIBLE | Controladores/prisma/migrations/055_nucleo_documental_portable/migration.sql; Controladores/prisma/migrations/065_catalogos_comerciales_cotizacion/migration.sql; Controladores/prisma/migrations/066_versionado_documental_cotizacion/migration.sql; Controladores/pruebas/c4-3-documental-real.test.cjs | Solo transiciones validadas por el controlador; conservar historia |
| DOCUMENTO_CARGA_CONFIRMADA | Controladores/src/documental/productos/IntegracionM9DocumentosProducto.ts | Solo transiciones validadas por el controlador; conservar historia |
| DOCUMENTO_CREADO | Controladores/pruebas/nucleo-documental-portable.test.cjs; Controladores/src/documental/repositorios/RepositorioDocumentalPrisma.ts | Solo transiciones validadas por el controlador; conservar historia |
| DOCUMENTO_CUARENTENA | Controladores/src/documental/productos/IntegracionM9DocumentosProducto.ts | Solo transiciones validadas por el controlador; conservar historia |
| DOCUMENTO_DISPONIBLE | Controladores/src/documental/productos/IntegracionM9DocumentosProducto.ts | Solo transiciones validadas por el controlador; conservar historia |
| DOCUMENTO_INTEGRIDAD_FALLIDA | Controladores/src/documental/productos/IntegracionM9DocumentosProducto.ts | Solo transiciones validadas por el controlador; conservar historia |
| DOCUMENTO_NO_DISPONIBLE | Controladores/src/documental/productos/contratosApi.ts; Controladores/src/documental/repositorios/RepositorioDocumentalPrisma.ts | Solo transiciones validadas por el controlador; conservar historia |
| DOCUMENTO_RECHAZADO | Controladores/src/documental/productos/IntegracionM9DocumentosProducto.ts | Solo transiciones validadas por el controlador; conservar historia |
| DOCUMENTO_REEMPLAZADO | Controladores/src/documental/productos/IntegracionM9DocumentosProducto.ts | Solo transiciones validadas por el controlador; conservar historia |
| DURACION_PRODUCCION | Controladores/src/m6/dashboardTerreno.ts | Solo transiciones validadas por el controlador; conservar historia |
| EJECUCION_PRODUCCION | Controladores/src/controladores/M6Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| EMITIR_EVENTO_M9 | Controladores/pruebas/m9-autorizacion-e2e.test.cjs; Controladores/pruebas/m9-confiabilidad-observabilidad.test.cjs; Controladores/pruebas/m9-consulta-exportacion.test.cjs; Controladores/pruebas/m9-ingesta-integridad.test.cjs | Solo transiciones validadas por el controlador; conservar historia |
| EN_PRODUCCION | Controladores/src/controladores/M6Controller.ts; Controladores/src/m6/dashboardTerreno.ts; Vistas/src/views/GestionOrdenesTrabajo/GestionOrdenesTrabajo.tsx; Vistas/src/views/Terreno/InicioTerreno.test.ts | Solo transiciones validadas por el controlador; conservar historia |
| ERROR | Controladores/prisma/migrations/055_nucleo_documental_portable/migration.sql; Controladores/prisma/migrations/056_cierre_seguridad_documental/migration.sql; Controladores/prisma/migrations/066_versionado_documental_cotizacion/migration.sql; Controladores/pruebas/mantenedores-documental-ui.test.cjs | Solo transiciones validadas por el controlador; conservar historia |
| ERROR_CALCULO | Controladores/src/controladores/M7Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| ERROR_ESCANEO | Controladores/pruebas/seguridad-integridad-documental.test.cjs; Controladores/src/documental/operaciones/CoordinadorCargaDocumental.ts; Controladores/src/documental/seguridad/AntivirusAdapter.ts | Solo transiciones validadas por el controlador; conservar historia |
| ERROR_INTERNO | Controladores/src/app.ts | Solo transiciones validadas por el controlador; conservar historia |
| ERROR_MANEJADOR | Controladores/src/documental/operaciones/ProcesadorOutboxDocumental.ts | Solo transiciones validadas por el controlador; conservar historia |
| ERROR_OWNER | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| ESPERA_VALIDACION | Controladores/src/m6/dashboardTerreno.ts | Solo transiciones validadas por el controlador; conservar historia |
| ETAPA_PENDIENTE | Controladores/src/controladores/M2Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| ETAPA_PRODUCCION_INCORPORADA | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| EVENTO_M9_NO_APROBADO | Controladores/pruebas/documentos-producto-backend.test.cjs; Controladores/src/documental/productos/IntegracionM9DocumentosProducto.ts | Solo transiciones validadas por el controlador; conservar historia |
| EXPIRACION_INVALIDA | Controladores/src/documental/adaptadores/S3CompatibleStorageAdapter.ts; Controladores/src/documental/repositorios/RepositorioDocumentalPrisma.ts | Solo transiciones validadas por el controlador; conservar historia |
| EXPORTACION_DASHBOARD_CONFIRMADA | Controladores/pruebas/csv-exportaciones-documentales.test.cjs; Controladores/pruebas/m9-pdf-informe.test.cjs; Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| FALLIDO | Controladores/prisma/migrations/044_m9_auditoria_core/migration.sql; Controladores/prisma/migrations/046_m9_retry_politicas/migration.sql; Controladores/pruebas/m6-cu191-cu195.test.cjs; Controladores/pruebas/m9-ingesta-integridad.test.cjs | Solo transiciones validadas por el controlador; conservar historia |
| FAMILIA_COMERCIAL_CREADA | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| FAMILIA_COMERCIAL_DESACTIVADA | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| FAMILIA_COMERCIAL_REACTIVADA | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| FUENTE_NO_DISPONIBLE | Controladores/pruebas/m7-cu215-cu219.test.cjs; Controladores/pruebas/m7-cu222-cu237.test.cjs; Controladores/pruebas/m7-cu242-cu253.test.cjs; Controladores/pruebas/m7-cu252.test.cjs | Solo transiciones validadas por el controlador; conservar historia |
| GASTO_CAJA_APROBADO | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| GENERADO_NO_CONFIRMADO | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | Solo transiciones validadas por el controlador; conservar historia |
| GESTIONAR_CUARENTENA | Controladores/src/documental/seguridad/AutorizacionDocumental.ts; Controladores/src/documental/seguridad/MatrizCapacidadesDocumentales.ts | Solo transiciones validadas por el controlador; conservar historia |
| HABILITADA_CON_CONFIRMACION_BACKEND | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | Solo transiciones validadas por el controlador; conservar historia |
| HASH_INVALIDO | Controladores/pruebas/nucleo-documental-portable.test.cjs; Controladores/src/documental/validaciones.ts | Solo transiciones validadas por el controlador; conservar historia |
| HECHO_TERRENO_PENDIENTE | Controladores/src/controladores/M6Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| HISTORICA_REEMPLAZADA | Controladores/pruebas/m6-cu191-cu195.test.cjs; Controladores/src/controladores/M6Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| INACTIVA | Controladores/prisma/migrations/054_mantenedor_productos_comerciales/migration.sql; Controladores/prisma/migrations/060_catalogo_tareas_plantillas_fabricacion/migration.sql; Controladores/prisma/migrations/065_catalogos_comerciales_cotizacion/migration.sql; Controladores/prisma/migrations/066_versionado_documental_cotizacion/migration.sql | Solo transiciones validadas por el controlador; conservar historia |
| INACTIVO | Controladores/prisma/migrations/035_m6_honorarios_historial_reversiones/migration.sql; Controladores/prisma/migrations/054_mantenedor_productos_comerciales/migration.sql; Controladores/prisma/migrations/055_nucleo_documental_portable/migration.sql; Controladores/prisma/migrations/060_catalogo_tareas_plantillas_fabricacion/migration.sql | Solo transiciones validadas por el controlador; conservar historia |
| INCIDENCIA_APROBADA | Controladores/pruebas/m6-incidencias-revision.test.cjs; Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| INCIDENCIA_CREADA | Controladores/pruebas/m6-incidencias-revision.test.cjs; Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| INCIDENCIA_RECHAZADA | Controladores/pruebas/m6-incidencias-revision.test.cjs; Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| INFRAESTRUCTURA_DOCUMENTAL_NO_DISPONIBLE | Controladores/pruebas/catalogo-documental-c2.test.cjs; Controladores/src/documental/productos/ServicioDocumentosProducto.ts | Solo transiciones validadas por el controlador; conservar historia |
| INTEGRACION_NO_ACTIVA | Controladores/src/documental/productos/contratosApi.ts | Solo transiciones validadas por el controlador; conservar historia |
| INTEGRIDAD_RECHAZADA | Controladores/src/documental/operaciones/CoordinadorCargaDocumental.ts | Solo transiciones validadas por el controlador; conservar historia |
| INTENCION_LEGACY_NO_CONFIRMABLE | Controladores/src/documental/operaciones/CoordinadorCargaDocumental.ts; Controladores/src/documental/repositorios/RepositorioDocumentalPrisma.ts | Solo transiciones validadas por el controlador; conservar historia |
| INTENCION_NO_CONFIRMABLE | Controladores/src/documental/operaciones/CoordinadorCargaDocumental.ts | Solo transiciones validadas por el controlador; conservar historia |
| LECTURA_FALLIDA | Controladores/pruebas/seguridad-integridad-documental.test.cjs | Solo transiciones validadas por el controlador; conservar historia |
| LIBERADA_A_PRODUCCION | Controladores/src/controladores/M6Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| M4_INACTIVIDAD_MINUTOS | Controladores/src/utilidades/seguridad.ts | Solo transiciones validadas por el controlador; conservar historia |
| M9_CONFIG_INVALIDA | Controladores/src/controladores/M9Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| M9_DATABASE_CONFIG_INVALIDA | Controladores/src/m9/seguridadEntorno.ts | Solo transiciones validadas por el controlador; conservar historia |
| M9_ERROR | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| M9_EVENTO_INVALIDO | Controladores/pruebas/m9-ingesta-integridad.test.cjs; Controladores/src/controladores/M9Controller.ts; Controladores/src/m9/seguridad.ts | Solo transiciones validadas por el controlador; conservar historia |
| M9_EXPORTACION_FALLIDA | Controladores/src/controladores/M9Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| M9_FILTRO_INVALIDO | Controladores/pruebas/m9-autorizacion-e2e.test.cjs; Controladores/pruebas/m9-confiabilidad-observabilidad.test.cjs; Controladores/src/controladores/M9Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| M9_FORMATO_INVALIDO | Controladores/src/controladores/M9Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| M9_INTEGRIDAD_INVALIDA | Controladores/pruebas/m9-ingesta-integridad.test.cjs; Controladores/src/controladores/M9Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| M9_OWNER_INVALIDO | Controladores/src/m9/contratosPostM9.ts | Solo transiciones validadas por el controlador; conservar historia |
| M9_PAYLOAD_PENDIENTE_INVALIDO | Controladores/src/controladores/M9Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| M9_REFERENCIA_INVALIDA | Controladores/pruebas/m9-ingesta-integridad.test.cjs; Controladores/src/controladores/M9Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| M9_RESULTADO_INVALIDO | Controladores/pruebas/m9-ingesta-integridad.test.cjs; Controladores/src/m9/seguridad.ts | Solo transiciones validadas por el controlador; conservar historia |
| M9_RETRY_FALLIDO | Controladores/src/controladores/M9Controller.ts; Controladores/src/m9/RepositorioRetryM9.ts; Controladores/src/m9/puertos.ts | Solo transiciones validadas por el controlador; conservar historia |
| M9_SECUENCIA_INVALIDA | Controladores/src/controladores/M9Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| M9_TIMESTAMP_INVALIDO | Controladores/pruebas/m9-ingesta-integridad.test.cjs; Controladores/src/m9/seguridad.ts | Solo transiciones validadas por el controlador; conservar historia |
| M9_TIMEZONE_INVALIDA | Controladores/src/m9/seguridad.ts | Solo transiciones validadas por el controlador; conservar historia |
| M9_VERSION_INVALIDA | Controladores/pruebas/m9-ingesta-integridad.test.cjs; Controladores/pruebas/m9-productores-failclosed.test.cjs; Controladores/src/controladores/M9Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| METADATO_INVALIDO | Controladores/src/documental/validaciones.ts | Solo transiciones validadas por el controlador; conservar historia |
| MIME_INVALIDO | Controladores/src/documental/validaciones.ts | Solo transiciones validadas por el controlador; conservar historia |
| MODALIDAD_FIXTURE_CONFIRMADA | Controladores/pruebas/m6-cu196-cu197.test.cjs | Solo transiciones validadas por el controlador; conservar historia |
| MODALIDAD_FIXTURE_PENDIENTE | Controladores/pruebas/m6-cu196-cu197.test.cjs | Solo transiciones validadas por el controlador; conservar historia |
| MODALIDAD_NO_APROBADA | Controladores/pruebas/m6-cu198.test.cjs | Solo transiciones validadas por el controlador; conservar historia |
| MODIFICACION_BORRADOR | Controladores/pruebas/m2-productos-comerciales.test.cjs; Controladores/src/controladores/M2Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| ND_ANULADA_M5 | Controladores/prisma/migrations/014_m5_ajustes_saldos_favor/migration.sql; Controladores/src/controladores/M5Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| NOMBRE_ARCHIVO_INVALIDO | Controladores/src/documental/validaciones.ts | Solo transiciones validadas por el controlador; conservar historia |
| NO_DISPONIBLE | Controladores/prisma/migrations/065_catalogos_comerciales_cotizacion/migration.sql; Controladores/pruebas/catalogo-comercial-c1.test.cjs; Controladores/pruebas/comercial-c2-7-integracion-pg18.test.cjs; Controladores/pruebas/seguridad-comercial-c2-5.test.cjs | Solo transiciones validadas por el controlador; conservar historia |
| OPCIONAL_COMERCIAL_CREADO | Controladores/src/comercial/MatrizAuditoriaComercial.ts; Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| OPCIONAL_COMERCIAL_DESACTIVADO | Controladores/src/comercial/MatrizAuditoriaComercial.ts; Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| ORDEN_INVALIDO | Controladores/src/documental/repositorios/RepositorioDocumentalPrisma.ts | Solo transiciones validadas por el controlador; conservar historia |
| ORDEN_TRABAJO_LIBERADA_PRODUCCION | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| OT_CREADA | Controladores/src/controladores/M6Controller.ts; Vistas/src/views/GestionOrdenesTrabajo/DetalleOrdenTrabajo.test.tsx | Solo transiciones validadas por el controlador; conservar historia |
| PAGADA | Controladores/pruebas/m6-cu198.test.cjs; Controladores/src/controladores/M6Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| PAGO_ANULADO | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| PAGO_CONFIRMADO | Controladores/src/controladores/M6Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| PAGO_PROVEEDOR_CONFIRMADO | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| PAGO_REMUNERACION_CONFIRMADO | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| PARCIALMENTE_DISPONIBLE | Controladores/pruebas/m7-cobertura-ebitda.test.cjs; Controladores/pruebas/m7-cu216-cu221.test.cjs; Controladores/pruebas/m7-cu222-cu237.test.cjs; Controladores/pruebas/m7-cu242-cu253.test.cjs | Solo transiciones validadas por el controlador; conservar historia |
| PDF_CONTENIDO_ACTIVO | Controladores/pruebas/seguridad-integridad-documental.test.cjs; Controladores/src/documental/seguridad/IntegridadContenido.ts | Solo transiciones validadas por el controlador; conservar historia |
| PENDIENTE | Controladores/prisma/migrations/033_m6_ajustes_pagos_remuneraciones/migration.sql; Controladores/prisma/migrations/042_m8_solicitudes_crediticias/migration.sql; Controladores/prisma/migrations/046_m9_retry_politicas/migration.sql; Controladores/prisma/migrations/055_nucleo_documental_portable/migration.sql | Solo transiciones validadas por el controlador; conservar historia |
| PENDIENTE_4_4 | Controladores/pruebas/nucleo-documental-portable.test.cjs | Solo transiciones validadas por el controlador; conservar historia |
| PENDIENTE_APROBACION | Controladores/pruebas/catalogo-documental-c2.test.cjs; Controladores/pruebas/documentos-producto-backend.test.cjs; Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/documental/productos/IntegracionM9DocumentosProducto.ts | Solo transiciones validadas por el controlador; conservar historia |
| PENDIENTE_APROBACION_TECNICA | Controladores/prisma/migrations/062_gestion_rectificacion_ot/migration.sql; Controladores/prisma/migrations/064_gestion_dinamica_produccion_ot/migration.sql; Controladores/pruebas/m6-gestion-rectificacion-ot.test.cjs; Controladores/src/controladores/M6Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| PENDIENTE_CONFIGURACION | Controladores/pruebas/m7-cu220-cu224.test.cjs; Controladores/src/controladores/M7Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| PENDIENTE_CONFIRMACION | Controladores/prisma/migrations/035_m6_honorarios_historial_reversiones/migration.sql; Controladores/pruebas/m6-cu187-cu190.test.cjs; Controladores/pruebas/m6-cu196-cu197.test.cjs; Controladores/pruebas/m6-cu198.test.cjs | Solo transiciones validadas por el controlador; conservar historia |
| PENDIENTE_DOCUMENTO | Controladores/prisma/migrations/066_versionado_documental_cotizacion/migration.sql; Controladores/pruebas/sql/cotizaciones-065-067-validacion.sql; Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | Solo transiciones validadas por el controlador; conservar historia |
| PENDIENTE_ENVEJECIDO | Controladores/pruebas/m9-confiabilidad-observabilidad.test.cjs; Controladores/src/controladores/M9Controller.ts; Controladores/src/m9/puertos.ts | Solo transiciones validadas por el controlador; conservar historia |
| PENDIENTE_PAGO | Controladores/src/controladores/M6Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| PENDIENTE_RECTIFICACION | Controladores/prisma/migrations/061_ot_por_unidad_cotizada/migration.sql; Controladores/prisma/migrations/062_gestion_rectificacion_ot/migration.sql; Controladores/prisma/migrations/064_gestion_dinamica_produccion_ot/migration.sql; Controladores/pruebas/m2-aprobacion-ot-unidad.test.cjs | Solo transiciones validadas por el controlador; conservar historia |
| PENDIENTE_REVISION | Controladores/src/controladores/M7Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| PENDIENTE_TRIBUTARIA | Controladores/pruebas/m6-cu196-cu197.test.cjs; Controladores/src/controladores/M6Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| PENDIENTE_VALIDACION | Controladores/prisma/migrations/064_gestion_dinamica_produccion_ot/migration.sql; Controladores/pruebas/m6-dashboard-terreno.test.cjs; Controladores/pruebas/m6-ficha-operativa-ot.test.cjs; Controladores/pruebas/m6-gestion-rectificacion-ot.test.cjs | Solo transiciones validadas por el controlador; conservar historia |
| PENDIENTE_VALORIZACION | Controladores/prisma/migrations/033_m6_ajustes_pagos_remuneraciones/migration.sql; Controladores/pruebas/m6-cu183-cu186.test.cjs; Controladores/src/controladores/M6Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| PERIODO_CERRADO_REAPERTURA_PENDIENTE_DE_DEFINICION | Controladores/pruebas/m6-cu178-cu182.test.cjs; Controladores/src/controladores/M6Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| PERIODO_REMUNERACION_CERRADO | Controladores/pruebas/m6-cu178-cu182.test.cjs; Controladores/src/controladores/M6Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| PERMISOS_RETIRADOS | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| PERMISO_COMERCIAL_PENDIENTE | Controladores/pruebas/catalogo-comercial-c1.test.cjs; Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/comercial/ServicioCatalogoComercial.ts | Solo transiciones validadas por el controlador; conservar historia |
| PERMISO_PENDIENTE | Controladores/src/documental/productos/contratosApi.ts | Solo transiciones validadas por el controlador; conservar historia |
| PLANIFICACION_APROBADA | Controladores/pruebas/m6-ficha-operativa-ot.test.cjs; Vistas/src/views/GestionOrdenesTrabajo/DetalleOrdenTrabajo.test.tsx | Solo transiciones validadas por el controlador; conservar historia |
| PLANTILLA_DOCUMENTAL_CREADA | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| PLANTILLA_DOCUMENTAL_PUBLICADA | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| PLANTILLA_FABRICACION_PUBLICADA | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| PLAN_APROBADO | Controladores/prisma/migrations/064_gestion_dinamica_produccion_ot/migration.sql | Solo transiciones validadas por el controlador; conservar historia |
| POR_CONFIRMAR | Controladores/src/controladores/M7Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| PRECIO_COMERCIAL_CREADO | Controladores/pruebas/comercial-c2-7-integracion-pg18.test.cjs; Controladores/src/comercial/MatrizAuditoriaComercial.ts; Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| PRECIO_COMERCIAL_DESACTIVADO | Controladores/src/comercial/MatrizAuditoriaComercial.ts; Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| PRINCIPAL_INVALIDA | Controladores/src/documental/repositorios/RepositorioDocumentalPrisma.ts | Solo transiciones validadas por el controlador; conservar historia |
| PRODUCCION | Controladores/prisma/migrations/052_incidencias_terreno_revision/migration.sql; Controladores/pruebas/m6-incidencias-revision.test.cjs | Solo transiciones validadas por el controlador; conservar historia |
| PRODUCTO_COMERCIAL_CREADO | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| PRODUCTO_COMERCIAL_DESACTIVADO | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| PRODUCTO_COMERCIAL_REACTIVADO | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| PRODUCTO_INVALIDO | Controladores/src/documental/productos/ServicioDocumentosProducto.ts | Solo transiciones validadas por el controlador; conservar historia |
| PRODUCTO_NO_DISPONIBLE | Controladores/pruebas/catalogo-documental-c2.test.cjs; Controladores/pruebas/documentos-producto-backend.test.cjs; Controladores/src/documental/productos/ServicioDocumentosProducto.ts | Solo transiciones validadas por el controlador; conservar historia |
| PROMOCION_CONDICIONAL_NO_VALIDADA | Controladores/pruebas/seguridad-integridad-documental.test.cjs; Controladores/src/documental/operaciones/CoordinadorCargaDocumental.ts | Solo transiciones validadas por el controlador; conservar historia |
| PROVEEDOR_CREADO | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| PROYECCION_FINANCIERA_CREADA | Controladores/pruebas/m7-presupuesto-resultados.test.cjs; Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| PROYECCION_FINANCIERA_DESACTIVADA | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| PUBLICACION | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts | Solo transiciones validadas por el controlador; conservar historia |
| PUBLICACION_VERSION | Controladores/src/controladores/M2Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| PUBLICADA | Controladores/prisma/migrations/065_catalogos_comerciales_cotizacion/migration.sql; Controladores/prisma/migrations/066_versionado_documental_cotizacion/migration.sql; Controladores/pruebas/c4-3-documental-real.test.cjs; Controladores/pruebas/comercial-c2-7-integracion-pg18.test.cjs | Solo transiciones validadas por el controlador; conservar historia |
| PUBLICADO | Controladores/prisma/migrations/060_catalogo_tareas_plantillas_fabricacion/migration.sql; Controladores/src/controladores/M2Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| PUBLICAR_CARTA_B2C | Controladores/pruebas/c4-documentos-comerciales.test.cjs; Controladores/src/comercial/SeguridadCapacidadesComerciales.ts | Solo transiciones validadas por el controlador; conservar historia |
| PUBLICAR_CONDICION | Controladores/pruebas/comercial-c2-7-integracion-pg18.test.cjs; Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/comercial/ServicioEscrituraComercial.ts; Controladores/src/controladores/C_Finanzas.ts | Solo transiciones validadas por el controlador; conservar historia |
| PUBLICAR_PLANTILLA_DOCUMENTAL | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts | Solo transiciones validadas por el controlador; conservar historia |
| PUBLICAR_PRODUCTOS | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts | Solo transiciones validadas por el controlador; conservar historia |
| REACTIVACION | Controladores/pruebas/m2-productos-comerciales.test.cjs; Controladores/src/controladores/M2Controller.ts; Controladores/src/controladores/M8Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| RECHAZADA | Controladores/prisma/migrations/042_m8_solicitudes_crediticias/migration.sql; Controladores/prisma/migrations/043_m8_credito_core/migration.sql; Controladores/prisma/migrations/067_alternativas_b2c/migration.sql; Controladores/pruebas/c4-3-documental-real.test.cjs | Solo transiciones validadas por el controlador; conservar historia |
| RECHAZADO | Controladores/prisma/migrations/044_m9_auditoria_core/migration.sql; Controladores/pruebas/csv-exportaciones-documentales.test.cjs; Controladores/pruebas/m9-autorizacion-e2e.test.cjs; Controladores/pruebas/m9-consulta-exportacion.test.cjs | Solo transiciones validadas por el controlador; conservar historia |
| RECHAZAR | Controladores/pruebas/m9-consulta-exportacion.test.cjs | Solo transiciones validadas por el controlador; conservar historia |
| RECHAZO | Controladores/src/controladores/M6Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| RECTIFICACION | Controladores/prisma/migrations/066_versionado_documental_cotizacion/migration.sql; Controladores/src/controladores/M6Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| RECTIFICACION_APROBADA | Controladores/prisma/migrations/062_gestion_rectificacion_ot/migration.sql; Controladores/prisma/migrations/064_gestion_dinamica_produccion_ot/migration.sql; Controladores/pruebas/m6-dashboard-terreno.test.cjs; Controladores/pruebas/m6-gestion-rectificacion-ot.test.cjs | Solo transiciones validadas por el controlador; conservar historia |
| RECTIFICACION_ASIGNADA | Controladores/prisma/migrations/062_gestion_rectificacion_ot/migration.sql; Controladores/prisma/migrations/064_gestion_dinamica_produccion_ot/migration.sql; Controladores/src/controladores/M6Controller.ts; Controladores/src/m6/dashboardTerreno.ts | Solo transiciones validadas por el controlador; conservar historia |
| RECTIFICACION_DEVUELTA | Controladores/prisma/migrations/062_gestion_rectificacion_ot/migration.sql; Controladores/prisma/migrations/064_gestion_dinamica_produccion_ot/migration.sql; Controladores/pruebas/m6-gestion-rectificacion-ot.test.cjs; Controladores/src/controladores/M6Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| RECTIFICACION_ENVIADA | Controladores/src/m6/dashboardTerreno.ts | Solo transiciones validadas por el controlador; conservar historia |
| RECTIFICACION_EN_PROCESO | Controladores/prisma/migrations/062_gestion_rectificacion_ot/migration.sql; Controladores/prisma/migrations/064_gestion_dinamica_produccion_ot/migration.sql; Controladores/src/controladores/M6Controller.ts; Controladores/src/m6/dashboardTerreno.ts | Solo transiciones validadas por el controlador; conservar historia |
| RECTIFICACION_OT_APROBADA | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| RECTIFICACION_OT_DEVUELTA | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| RECTIFICACION_OT_ENVIADA_APROBACION | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| RECTIFICACION_OT_MODIFICADA | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| RECTIFICADA | Controladores/prisma/migrations/061_ot_por_unidad_cotizada/migration.sql; Controladores/prisma/migrations/062_gestion_rectificacion_ot/migration.sql; Controladores/prisma/migrations/064_gestion_dinamica_produccion_ot/migration.sql | Solo transiciones validadas por el controlador; conservar historia |
| RECTIFICADOR_ASIGNADO | Controladores/src/controladores/M6Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| RECTIFICADOR_OT_ASIGNADO | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| REEMPLAZADA | Controladores/prisma/migrations/066_versionado_documental_cotizacion/migration.sql | Solo transiciones validadas por el controlador; conservar historia |
| REEMPLAZADO | Controladores/prisma/migrations/055_nucleo_documental_portable/migration.sql; Controladores/pruebas/documentos-producto-backend.test.cjs; Controladores/pruebas/mantenedores-documental-ui.test.cjs; Controladores/src/documental/estados.ts | Solo transiciones validadas por el controlador; conservar historia |
| REEMPLAZAR | Controladores/src/controladores/C_Finanzas.ts; Controladores/src/documental/productos/ServicioDocumentosProducto.ts; Controladores/src/documental/seguridad/AutorizacionDocumental.ts; Controladores/src/documental/seguridad/MatrizCapacidadesDocumentales.ts | Solo transiciones validadas por el controlador; conservar historia |
| REEMPLAZO | Controladores/src/documental/seguridad/AuditoriaDocumental.ts | Solo transiciones validadas por el controlador; conservar historia |
| REMUNERACION_CERRADA_ANTICIPO | Controladores/src/controladores/M6Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| REMUNERACION_CERRADA_NO_PAGADA | Controladores/src/controladores/M6Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| REMUNERACION_NO_CREADA | Controladores/src/controladores/M6Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| RESULTADO_VALIDADO | Controladores/pruebas/m6-ficha-operativa-ot.test.cjs; Controladores/src/controladores/M6Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| RETIRADA | Controladores/prisma/migrations/066_versionado_documental_cotizacion/migration.sql; Controladores/prisma/migrations/067_alternativas_b2c/migration.sql; Controladores/pruebas/cotizaciones-c3-1-pg18.test.cjs; Controladores/src/controladores/M2Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| RUT_INVALIDO | Controladores/pruebas/m1-clientes-autonomos.test.cjs; Controladores/pruebas/m4.test.cjs; Controladores/pruebas/m6-prevision-rut.test.cjs; Controladores/src/utilidades/rut.ts | Solo transiciones validadas por el controlador; conservar historia |
| SALDO_INICIAL_BANCARIO_CREADO | Controladores/pruebas/m7-saldos-bancarios.test.cjs; Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| SALDO_INICIAL_PENDIENTE | Controladores/src/controladores/M7Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| SERVICIO_COMERCIAL_CREADO | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| SERVICIO_COMERCIAL_DESACTIVADO | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| SESION_ACTIVA_REQUIERE_CONFIRMACION | Controladores/pruebas/m4.test.cjs; Controladores/src/controladores/M4Controller.ts; Vistas/src/views/Seguridad/Acceso.tsx | Solo transiciones validadas por el controlador; conservar historia |
| SESION_CERRADA | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| SOLICITUD_CREDITO_CREADA | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| SOLICITUD_INVALIDA | Controladores/src/utilidades/ErrorAplicacion.ts | Solo transiciones validadas por el controlador; conservar historia |
| TAMANO_INVALIDO | Controladores/src/documental/validaciones.ts | Solo transiciones validadas por el controlador; conservar historia |
| TAREA_CERRADA | Controladores/src/controladores/M6Controller.ts | Solo transiciones validadas por el controlador; conservar historia |
| TAREA_FABRICACION_CREADA | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| TAREA_FABRICACION_DESACTIVADA | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| TAREA_FABRICACION_REACTIVADA | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| TAREA_PRODUCCION | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| TAREA_PRODUCCION_CERRADA | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| TAREA_PRODUCCION_INCORPORADA | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| TAREA_PRODUCCION_INICIADA | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| TAREA_PRODUCCION_MODIFICADA | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| TARIFA_COMERCIAL_CREADA | Controladores/src/comercial/MatrizAuditoriaComercial.ts; Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| TARIFA_COMERCIAL_DESACTIVADA | Controladores/src/comercial/MatrizAuditoriaComercial.ts; Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| TEMPORAL_M5_DB_PATCH_PENDIENTE_INTEGRACION_OCI | Controladores/prisma/migrations/016_m5_reasignaciones_envios/migration.sql | Solo transiciones validadas por el controlador; conservar historia |
| TOKEN_CONCURRENCIA_NO_DISPONIBLE | Controladores/src/documental/operaciones/CoordinadorCargaDocumental.ts | Solo transiciones validadas por el controlador; conservar historia |
| TRANSICION_INVALIDA | Controladores/pruebas/nucleo-documental-portable.test.cjs; Controladores/src/documental/estados.ts | Solo transiciones validadas por el controlador; conservar historia |
| UNIDAD_CREADA | Controladores/pruebas/m6-ficha-operativa-ot.test.cjs | Solo transiciones validadas por el controlador; conservar historia |
| VALIDACION_INCOMPLETA | Controladores/pruebas/nucleo-documental-portable.test.cjs; Controladores/src/documental/repositorios/RepositorioDocumentalPrisma.ts | Solo transiciones validadas por el controlador; conservar historia |
| VALIDACION_NO_RECUPERABLE | Controladores/src/documental/operaciones/CoordinadorCargaDocumental.ts | Solo transiciones validadas por el controlador; conservar historia |
| VALIDACION_RECHAZADA | Controladores/src/documental/seguridad/AuditoriaDocumental.ts | Solo transiciones validadas por el controlador; conservar historia |
| VALIDACION_SEGURA | Controladores/pruebas/nucleo-documental-portable.test.cjs | Solo transiciones validadas por el controlador; conservar historia |
| VALIDACION_SOLICITADA | Controladores/pruebas/nucleo-documental-portable.test.cjs | Solo transiciones validadas por el controlador; conservar historia |
| VALIDACION_SQL_065_067_OK | Controladores/pruebas/sql/cotizaciones-065-067-validacion.sql | Solo transiciones validadas por el controlador; conservar historia |
| VALIDANDO | Controladores/prisma/migrations/055_nucleo_documental_portable/migration.sql; Controladores/pruebas/mantenedores-documental-ui.test.cjs; Controladores/pruebas/nucleo-documental-portable.test.cjs; Controladores/pruebas/seguridad-integridad-documental.test.cjs | Solo transiciones validadas por el controlador; conservar historia |
| VALIDAR | Controladores/pruebas/seguridad-integridad-documental.test.cjs | Solo transiciones validadas por el controlador; conservar historia |
| VALIDO | Controladores/pruebas/demo-completo.focal.cjs; Controladores/pruebas/m7-cierre-hallazgos.test.cjs; Controladores/pruebas/m7-cobertura-ebitda.test.cjs; Controladores/pruebas/m7-cu215-cu219.test.cjs | Solo transiciones validadas por el controlador; conservar historia |
| VENTA_ANULADA | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
| VERSION_PRODUCTO_COMERCIAL_PUBLICADA | Controladores/src/m9/contratoProductor.ts | Solo transiciones validadas por el controlador; conservar historia |
## Maquinas principales
Cotizacion: borrador -> emitida solo con documento confirmado. Alternativa: propuesta/seleccionada -> aceptada o rechazada/retirada segun invariantes. OT: pendiente de rectificacion -> rectificada -> aprobada tecnicamente -> liberada -> ejecucion/cierre. Documento: pendiente/validando -> disponible, cuarentena o error; una version confirmada no cambia bytes.

## Fuentes de verdad consultadas
- `Controladores/prisma/schema.prisma`
- `Controladores/pruebas`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/rutas/finanzas.ts`
- `Vistas/src`
- `Vistas/src/App.tsx`
