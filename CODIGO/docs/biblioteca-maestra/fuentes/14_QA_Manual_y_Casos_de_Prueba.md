# Guia de QA manual y casos de prueba

**Proyecto:** Puertas Blindadas
**Documento:** 14
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

## QA-001 - Login valido e invalido
**Precondiciones:** Cuenta sintetica.
**Datos:** exclusivamente sinteticos.
**Pasos:** Ingresar credenciales validas y luego invalidas.
**Resultado esperado:** Sesion solo para el caso valido.
**Verificar en BD:** sesion_usuario.
**Verificar en M9:** inicio/fallo segun politica.
**Si falla:** capturar solicitud/respuesta, hora y actor; no limpiar globalmente la base ni repetir escrituras sin revisar idempotencia.
## QA-002 - Cotizacion B2B
**Precondiciones:** Cliente B2B y catalogos vigentes.
**Datos:** exclusivamente sinteticos.
**Pasos:** Crear borrador, agregar productos/servicios, preview, emitir.
**Resultado esperado:** PDF confirmado sin costos internos.
**Verificar en BD:** cotizacion/documento.
**Verificar en M9:** emision.
**Si falla:** capturar solicitud/respuesta, hora y actor; no limpiar globalmente la base ni repetir escrituras sin revisar idempotencia.
## QA-003 - Alternativas B2C
**Precondiciones:** Tres alternativas.
**Datos:** exclusivamente sinteticos.
**Pasos:** Emitir y aceptar una.
**Resultado esperado:** Solo aceptada llega a NV/OT.
**Verificar en BD:** alternativas/detalles.
**Verificar en M9:** seleccion/aceptacion.
**Si falla:** capturar solicitud/respuesta, hora y actor; no limpiar globalmente la base ni repetir escrituras sin revisar idempotencia.
## QA-004 - Diez puertas
**Precondiciones:** Linea cantidad 10.
**Datos:** exclusivamente sinteticos.
**Pasos:** Aprobar y formalizar.
**Resultado esperado:** 10 unidades y 10 OT.
**Verificar en BD:** unidad_fisica/orden_trabajo.
**Verificar en M9:** creacion OT.
**Si falla:** capturar solicitud/respuesta, hora y actor; no limpiar globalmente la base ni repetir escrituras sin revisar idempotencia.
## QA-005 - Rectificacion
**Precondiciones:** OT pendiente.
**Datos:** exclusivamente sinteticos.
**Pasos:** Asignar, medir, enviar, aprobar.
**Resultado esperado:** Version inmutable y liberacion controlada.
**Verificar en BD:** rectificacion/version.
**Verificar en M9:** eventos tecnicos.
**Si falla:** capturar solicitud/respuesta, hora y actor; no limpiar globalmente la base ni repetir escrituras sin revisar idempotencia.
## QA-006 - Permiso insuficiente
**Precondiciones:** Usuario sin CU/alcance.
**Datos:** exclusivamente sinteticos.
**Pasos:** Abrir bandeja protegida.
**Resultado esperado:** 403 explicito, no lista vacia.
**Verificar en BD:** sin escritura.
**Verificar en M9:** acceso denegado si aplica.
**Si falla:** capturar solicitud/respuesta, hora y actor; no limpiar globalmente la base ni repetir escrituras sin revisar idempotencia.
## QA-007 - Idempotencia
**Precondiciones:** Clave repetida.
**Datos:** exclusivamente sinteticos.
**Pasos:** Repetir operacion.
**Resultado esperado:** Un solo efecto.
**Verificar en BD:** unicos/solicitudes.
**Verificar en M9:** un evento de exito.
**Si falla:** capturar solicitud/respuesta, hora y actor; no limpiar globalmente la base ni repetir escrituras sin revisar idempotencia.
## QA-008 - Documento historico
**Precondiciones:** PDF emitido.
**Datos:** exclusivamente sinteticos.
**Pasos:** Cambiar catalogo y volver a descargar.
**Resultado esperado:** Mismos bytes y SHA.
**Verificar en BD:** version_documento.
**Verificar en M9:** descarga.
**Si falla:** capturar solicitud/respuesta, hora y actor; no limpiar globalmente la base ni repetir escrituras sin revisar idempotencia.
## QA-009 - Antivirus caido
**Precondiciones:** Servicio detenido.
**Datos:** exclusivamente sinteticos.
**Pasos:** Intentar confirmar documento.
**Resultado esperado:** Fail-closed.
**Verificar en BD:** estado no disponible.
**Verificar en M9:** fallo.
**Si falla:** capturar solicitud/respuesta, hora y actor; no limpiar globalmente la base ni repetir escrituras sin revisar idempotencia.
## QA-010 - Integridad M9
**Precondiciones:** Evento valido e invalido.
**Datos:** exclusivamente sinteticos.
**Pasos:** Consultar bandeja/exportar.
**Resultado esperado:** Valido visible; invalido comprometido.
**Verificar en BD:** evento_auditoria_m9.
**Verificar en M9:** no reescribir.
**Si falla:** capturar solicitud/respuesta, hora y actor; no limpiar globalmente la base ni repetir escrituras sin revisar idempotencia.
## Cobertura manual por endpoint
Cada fila exige probar happy path, payload invalido, actor sin permiso, entidad inexistente y reintento cuando la operacion escribe. Para escrituras, verificar BD y M9; para lecturas, verificar alcance y ausencia de filtracion.
| Caso | Metodo | Path | Permiso visible | Resultado minimo | Fuente |
| --- | --- | --- | --- | --- | --- |
| QA-API-001 | GET | /salud | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:27 |
| QA-API-002 | GET | /auditoria/exportar/:formato | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:28 |
| QA-API-003 | GET | /auditoria/resumen | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:29 |
| QA-API-004 | GET | /auditoria/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:30 |
| QA-API-005 | GET | /auditoria | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:31 |
| QA-API-006 | GET | /mantenedores/productos/catalogos-vinculacion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:32 |
| QA-API-007 | GET | /mantenedores/productos/:id/documentos/capacidades | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:33 |
| QA-API-008 | GET | /mantenedores/productos/:id/documentos/:documentoId/versiones | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:34 |
| QA-API-009 | GET | /mantenedores/productos/:id/documentos | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:35 |
| QA-API-010 | POST | /mantenedores/productos/:id/documentos/intenciones | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:36 |
| QA-API-011 | POST | /mantenedores/productos/:id/documentos/intenciones/:intencionId/confirmar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:37 |
| QA-API-012 | POST | /mantenedores/productos/:id/documentos/:documentoId/reemplazar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:38 |
| QA-API-013 | POST | /mantenedores/productos/:id/documentos/:documentoId/vista-previa | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:39 |
| QA-API-014 | POST | /mantenedores/productos/:id/documentos/:documentoId/descargar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:40 |
| QA-API-015 | GET | /catalogo-comercial/productos/:id/ficha | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:41 |
| QA-API-016 | GET | /catalogo-comercial/productos | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:42 |
| QA-API-017 | GET | /mantenedores/comercial/precios | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:43 |
| QA-API-018 | GET | /mantenedores/documentos-comerciales/estado | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:44 |
| QA-API-019 | GET | /mantenedores/documentos-comerciales/plantillas | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:45 |
| QA-API-020 | POST | /mantenedores/documentos-comerciales/plantillas | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:46 |
| QA-API-021 | PUT | /mantenedores/documentos-comerciales/plantillas/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:47 |
| QA-API-022 | POST | /mantenedores/documentos-comerciales/plantillas/:id/publicar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:48 |
| QA-API-023 | GET | /mantenedores/documentos-comerciales/cartas-b2c | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:49 |
| QA-API-024 | POST | /mantenedores/documentos-comerciales/cartas-b2c | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:50 |
| QA-API-025 | PUT | /mantenedores/documentos-comerciales/cartas-b2c/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:51 |
| QA-API-026 | POST | /mantenedores/documentos-comerciales/cartas-b2c/:id/publicar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:52 |
| QA-API-027 | POST | /mantenedores/documentos-comerciales/cartas-b2c/:id/vista-previa | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:53 |
| QA-API-028 | GET | /mantenedores/documentos-comerciales/cartas-b2c/:id/versiones/:versionId/descarga | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:54 |
| QA-API-029 | GET | /mantenedores/comercial/servicios | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:55 |
| QA-API-030 | POST | /mantenedores/comercial/servicios | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:56 |
| QA-API-031 | POST | /mantenedores/comercial/servicios/:id/precios | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:57 |
| QA-API-032 | POST | /mantenedores/comercial/servicios/:id/desactivar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:58 |
| QA-API-033 | POST | /mantenedores/comercial/precios | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:59 |
| QA-API-034 | POST | /mantenedores/comercial/precios/:id/versiones | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:60 |
| QA-API-035 | POST | /mantenedores/comercial/precios/:id/desactivar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:61 |
| QA-API-036 | GET | /mantenedores/comercial/opcionales | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:62 |
| QA-API-037 | POST | /mantenedores/comercial/opcionales | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:63 |
| QA-API-038 | PUT | /mantenedores/comercial/opcionales/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:64 |
| QA-API-039 | PUT | /mantenedores/comercial/opcionales/:id/compatibilidad | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:65 |
| QA-API-040 | POST | /mantenedores/comercial/opcionales/:id/precios | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:66 |
| QA-API-041 | POST | /mantenedores/comercial/opcionales/:id/desactivar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:67 |
| QA-API-042 | GET | /mantenedores/comercial/tarifas-instalacion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:68 |
| QA-API-043 | POST | /mantenedores/comercial/tarifas-instalacion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:69 |
| QA-API-044 | POST | /mantenedores/comercial/tarifas-instalacion/:id/versiones | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:70 |
| QA-API-045 | POST | /mantenedores/comercial/tarifas-instalacion/exclusiones | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:71 |
| QA-API-046 | POST | /mantenedores/comercial/tarifas-instalacion/:id/desactivar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:72 |
| QA-API-047 | GET | /mantenedores/comercial/condiciones | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:73 |
| QA-API-048 | POST | /mantenedores/comercial/condiciones | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:74 |
| QA-API-049 | POST | /mantenedores/comercial/condiciones/:id/versiones | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:75 |
| QA-API-050 | POST | /mantenedores/comercial/condiciones/:id/versiones/:versionId/publicar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:76 |
| QA-API-051 | POST | /mantenedores/comercial/condiciones/:id/desactivar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:77 |
| QA-API-052 | GET | /catalogo-comercial/instalacion/cobertura | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:78 |
| QA-API-053 | GET | /mantenedores/productos/:id/resumen-comercial | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:79 |
| QA-API-054 | GET | /mantenedores/productos | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:80 |
| QA-API-055 | POST | /mantenedores/productos | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:81 |
| QA-API-056 | GET | /mantenedores/productos/:id/historial | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:82 |
| QA-API-057 | GET | /mantenedores/productos/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:83 |
| QA-API-058 | PUT | /mantenedores/productos/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:84 |
| QA-API-059 | POST | /mantenedores/productos/:id/desactivar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:85 |
| QA-API-060 | POST | /mantenedores/productos/:id/reactivar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:86 |
| QA-API-061 | PUT | /mantenedores/productos/:id/vinculaciones | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:87 |
| QA-API-062 | POST | /mantenedores/productos/:id/versiones | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:88 |
| QA-API-063 | GET | /mantenedores/familias-producto | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:89 |
| QA-API-064 | POST | /mantenedores/familias-producto | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:90 |
| QA-API-065 | GET | /mantenedores/familias-producto/:id/historial | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:91 |
| QA-API-066 | PUT | /mantenedores/familias-producto/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:92 |
| QA-API-067 | POST | /mantenedores/familias-producto/:id/desactivar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:93 |
| QA-API-068 | POST | /mantenedores/familias-producto/:id/reactivar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:94 |
| QA-API-069 | GET | /mantenedores/tareas-fabricacion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:95 |
| QA-API-070 | POST | /mantenedores/tareas-fabricacion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:96 |
| QA-API-071 | PUT | /mantenedores/tareas-fabricacion/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:97 |
| QA-API-072 | POST | /mantenedores/tareas-fabricacion/:id/desactivar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:98 |
| QA-API-073 | POST | /mantenedores/tareas-fabricacion/:id/reactivar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:99 |
| QA-API-074 | GET | /mantenedores/familias-producto/:id/plantilla-fabricacion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:100 |
| QA-API-075 | GET | /mantenedores/familias-producto/:id/plantilla-fabricacion/historial | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:101 |
| QA-API-076 | PUT | /mantenedores/familias-producto/:id/plantilla-fabricacion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:102 |
| QA-API-077 | POST | /mantenedores/familias-producto/:id/plantilla-fabricacion/publicar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:103 |
| QA-API-078 | GET | /credito/solicitudes | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:104 |
| QA-API-079 | GET | /credito/solicitudes/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:105 |
| QA-API-080 | POST | /credito/solicitudes/inicial | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:106 |
| QA-API-081 | POST | /credito/solicitudes/excepcion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:107 |
| QA-API-082 | POST | /credito/solicitudes/:id/enviar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:108 |
| QA-API-083 | POST | /credito/solicitudes/:id/cancelar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:109 |
| QA-API-084 | POST | /credito/solicitudes/:id/resolver-inicial | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:110 |
| QA-API-085 | POST | /credito/solicitudes/:id/resolver-excepcion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:111 |
| QA-API-086 | PUT | /credito/clientes/:id/cupo | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:112 |
| QA-API-087 | POST | /credito/clientes/:id/suspender | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:113 |
| QA-API-088 | POST | /credito/clientes/:id/reactivar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:114 |
| QA-API-089 | GET | /credito/clientes/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:115 |
| QA-API-090 | GET | /credito/clientes/:id/historial | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:116 |
| QA-API-091 | GET | /credito/clientes/:id/compromisos | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:117 |
| QA-API-092 | PUT | /credito/configuracion/limite-global | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:118 |
| QA-API-093 | GET | /credito/exposicion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:119 |
| QA-API-094 | GET | /credito/distribucion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:120 |
| QA-API-095 | POST | /credito/validar-formalizacion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:121 |
| QA-API-096 | GET | /credito/exportar/:origen | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:122 |
| QA-API-097 | GET | /dashboard-m7 | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:123 |
| QA-API-098 | GET | /dashboard-m7/historico | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:124 |
| QA-API-099 | GET | /dashboard-m7/centro-atencion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:125 |
| QA-API-100 | GET | /dashboard-m7/cotizaciones-pendientes | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:126 |
| QA-API-101 | GET | /dashboard-m7/clientes/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:127 |
| QA-API-102 | GET | /dashboard-m7/ventas | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:128 |
| QA-API-103 | GET | /dashboard-m7/cuentas-cobrar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:129 |
| QA-API-104 | GET | /dashboard-m7/cuentas-pagar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:130 |
| QA-API-105 | GET | /dashboard-m7/liquidez | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:131 |
| QA-API-106 | POST | /dashboard-m7/liquidez/cuentas-bancarias | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:132 |
| QA-API-107 | PUT | /dashboard-m7/liquidez/cuentas-bancarias/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:133 |
| QA-API-108 | POST | /dashboard-m7/liquidez/saldos-iniciales | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:134 |
| QA-API-109 | PUT | /dashboard-m7/liquidez/saldos-iniciales/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:135 |
| QA-API-110 | POST | /dashboard-m7/proyecciones | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:136 |
| QA-API-111 | PUT | /dashboard-m7/proyecciones/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:137 |
| QA-API-112 | DELETE | /dashboard-m7/proyecciones/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:138 |
| QA-API-113 | GET | /dashboard-m7/riesgo-deficit | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:139 |
| QA-API-114 | POST | /dashboard-m7/liquidez/ajustes | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:140 |
| QA-API-115 | GET | /dashboard-m7/liquidez/ajustes/catalogos | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:141 |
| QA-API-116 | GET | /dashboard-m7/configuracion/umbrales-liquidez | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:142 |
| QA-API-117 | POST | /dashboard-m7/configuracion/umbrales-liquidez | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:143 |
| QA-API-118 | GET | /dashboard-m7/proyectos/exposicion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:144 |
| QA-API-119 | GET | /dashboard-m7/proyectos/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:145 |
| QA-API-120 | GET | /dashboard-m7/margen-proyectos | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:146 |
| QA-API-121 | GET | /dashboard-m7/resumen-resultados | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:147 |
| QA-API-122 | GET | /dashboard-m7/situacion-financiera | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:148 |
| QA-API-123 | GET | /dashboard-m7/operacion/costo-remuneraciones | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:149 |
| QA-API-124 | GET | /dashboard-m7/operacion/ordenes-trabajo | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:150 |
| QA-API-125 | GET | /dashboard-m7/operacion/produccion-modelos | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:151 |
| QA-API-126 | GET | /dashboard-m7/operacion/carga | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:152 |
| QA-API-127 | GET | /dashboard-m7/operacion/instalaciones | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:153 |
| QA-API-128 | GET | /dashboard-m7/operacion/instalaciones/atrasos | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:154 |
| QA-API-129 | GET | /dashboard-m7/operacion/incidencias | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:155 |
| QA-API-130 | GET | /dashboard-m7/credito/exposicion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:156 |
| QA-API-131 | GET | /dashboard-m7/credito/alertas | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:157 |
| QA-API-132 | GET | /dashboard-m7/tributario/iva | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:158 |
| QA-API-133 | GET | /dashboard-m7/costos/fabricacion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:159 |
| QA-API-134 | GET | /dashboard-m7/operacion/bloqueos | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:160 |
| QA-API-135 | GET | /dashboard-m7/operacion/instalaciones/margen | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:161 |
| QA-API-136 | GET | /dashboard-m7/inventario/valorizado | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:162 |
| QA-API-137 | GET | /dashboard-m7/inventario/materiales-proyecto | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:163 |
| QA-API-138 | GET | /dashboard-m7/inventario/riesgo-stock | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:164 |
| QA-API-139 | GET | /dashboard-m7/inventario/rotacion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:165 |
| QA-API-140 | GET | /dashboard-m7/compras/recepciones | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:166 |
| QA-API-141 | GET | /dashboard-m7/configuracion/costos-instalacion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:167 |
| QA-API-142 | POST | /dashboard-m7/configuracion/costos-instalacion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:168 |
| QA-API-143 | GET | /dashboard-m7/configuracion/stock-inmovil | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:169 |
| QA-API-144 | POST | /dashboard-m7/configuracion/stock-inmovil | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:170 |
| QA-API-145 | POST | /dashboard-m7/pdf | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:171 |
| QA-API-146 | POST | /dashboard-m7/excel | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:172 |
| QA-API-147 | GET | /dashboard-m7/configuracion/margen-critico | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:173 |
| QA-API-148 | POST | /dashboard-m7/configuracion/margen-critico | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:174 |
| QA-API-149 | GET | /terreno/visitas | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:175 |
| QA-API-150 | GET | /terreno/instalaciones | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:176 |
| QA-API-151 | POST | /terreno/visitas | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:177 |
| QA-API-152 | GET | /terreno/obras | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:178 |
| QA-API-153 | GET | /terreno/usuarios | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:179 |
| QA-API-154 | GET | /terreno/mis-tareas | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:180 |
| QA-API-155 | GET | /terreno/tareas/:id/levantamiento | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:181 |
| QA-API-156 | PUT | /terreno/tareas/:id/levantamiento | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:182 |
| QA-API-157 | POST | /terreno/tareas/:id/levantamiento/correcciones | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:183 |
| QA-API-158 | POST | /terreno/tareas/:id/orden-trabajo | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:184 |
| QA-API-159 | GET | /terreno/ordenes-trabajo | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:185 |
| QA-API-160 | GET | /terreno/ordenes-trabajo/:ordenId | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:186 |
| QA-API-161 | PATCH | /terreno/ordenes-trabajo/:ordenId/rectificador | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:187 |
| QA-API-162 | PUT | /terreno/ordenes-trabajo/:ordenId/rectificacion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:188 |
| QA-API-163 | POST | /terreno/ordenes-trabajo/:ordenId/rectificacion/enviar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:189 |
| QA-API-164 | POST | /terreno/ordenes-trabajo/:ordenId/rectificacion/aprobar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:190 |
| QA-API-165 | POST | /terreno/ordenes-trabajo/:ordenId/rectificacion/devolver | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:191 |
| QA-API-166 | POST | /terreno/ordenes-trabajo/:ordenId/liberar-produccion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:192 |
| QA-API-167 | POST | /terreno/tareas/:id/orden-trabajo/ajustes | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:193 |
| QA-API-168 | POST | /terreno/tareas/:id/orden-trabajo/:ordenId/liberar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:194 |
| QA-API-169 | POST | /terreno/tareas/:id/orden-trabajo/:ordenId/tareas-produccion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:195 |
| QA-API-170 | GET | /terreno/ordenes-trabajo/:ordenId/tareas-produccion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:196 |
| QA-API-171 | PUT | /terreno/tareas-produccion/:id/asignaciones | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:197 |
| QA-API-172 | PATCH | /terreno/tareas-produccion/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:198 |
| QA-API-173 | POST | /terreno/ordenes-trabajo/:ordenId/etapas-produccion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:199 |
| QA-API-174 | POST | /terreno/ordenes-trabajo/:ordenId/tareas-produccion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:200 |
| QA-API-175 | POST | /terreno/tareas-produccion/:id/inicio | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:201 |
| QA-API-176 | POST | /terreno/tareas-produccion/:id/ejecuciones | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:202 |
| QA-API-177 | GET | /terreno/ejecuciones/pendientes | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:203 |
| QA-API-178 | PATCH | /terreno/ejecuciones/:id/validacion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:204 |
| QA-API-179 | POST | /terreno/tareas-produccion/:id/cierre | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:205 |
| QA-API-180 | POST | /terreno/ordenes-trabajo/:ordenId/correcciones-tecnicas | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:206 |
| QA-API-181 | POST | /terreno/ordenes-trabajo/:ordenId/finalizar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:207 |
| QA-API-182 | GET | /terreno/visitas/:id/preparacion-salida | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:208 |
| QA-API-183 | PATCH | /terreno/visitas/:id/preparacion-salida/checklist | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:209 |
| QA-API-184 | POST | /terreno/visitas/:id/resultado | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:210 |
| QA-API-185 | POST | /terreno/ejecuciones/:id/incidencias | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:211 |
| QA-API-186 | GET | /terreno/incidencias | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:212 |
| QA-API-187 | GET | /terreno/dashboard-operacional | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:213 |
| QA-API-188 | GET | /terreno/reportes/exportar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:214 |
| QA-API-189 | GET | /terreno/incidencias-catalogos | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:215 |
| QA-API-190 | GET | /terreno/incidencias/:id/evidencias/:evidenciaId | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:216 |
| QA-API-191 | POST | /terreno/incidencias/:id/evidencias | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:217 |
| QA-API-192 | PATCH | /terreno/incidencias/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:218 |
| QA-API-193 | POST | /terreno/incidencias/:id/aprobar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:219 |
| QA-API-194 | POST | /terreno/incidencias/:id/rechazar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:220 |
| QA-API-195 | PATCH | /terreno/visitas/:id/responsable | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:221 |
| QA-API-196 | GET | /terreno/visitas/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:222 |
| QA-API-197 | GET | /empleados | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:229 |
| QA-API-198 | POST | /empleados | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:230 |
| QA-API-199 | GET | /areas-trabajo | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:231 |
| QA-API-200 | POST | /areas-trabajo | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:232 |
| QA-API-201 | PATCH | /areas-trabajo/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:233 |
| QA-API-202 | POST | /areas-trabajo/:id/activar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:234 |
| QA-API-203 | POST | /areas-trabajo/:id/desactivar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:235 |
| QA-API-204 | GET | /areas-trabajo/:id/empleados | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:236 |
| QA-API-205 | GET | /empleados/catalogos/laborales | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:237 |
| QA-API-206 | GET | /empleados/catalogos/remuneracionales | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:238 |
| QA-API-207 | GET | /empleados/catalogos/deducciones | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:239 |
| QA-API-208 | GET | /empleados/:id/deducciones | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:240 |
| QA-API-209 | POST | /empleados/:id/deducciones | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:241 |
| QA-API-210 | PATCH | /empleados/:id/deducciones/:asignacionId/finalizar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:242 |
| QA-API-211 | GET | /empleados/catalogos/esquemas | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:243 |
| QA-API-212 | GET | /empleados/catalogos/haberes | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:244 |
| QA-API-213 | PATCH | /empleados/:id/datos-base | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:245 |
| QA-API-214 | GET | /empleados/:id/area-historial | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:246 |
| QA-API-215 | POST | /empleados/:id/area | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:247 |
| QA-API-216 | GET | /empleados/:id/relaciones-laborales | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:248 |
| QA-API-217 | POST | /empleados/:id/relaciones-laborales | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:249 |
| QA-API-218 | PATCH | /empleados/:id/relaciones-laborales/:relacionId | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:250 |
| QA-API-219 | GET | /empleados/:id/perfil-remuneracional | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:251 |
| QA-API-220 | GET | /empleados/:id/historial-remuneracional | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:252 |
| QA-API-221 | PATCH | /empleados/:id/perfil-remuneracional | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:253 |
| QA-API-222 | GET | /empleados/:id/esquemas | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:254 |
| QA-API-223 | POST | /empleados/:id/esquemas | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:255 |
| QA-API-224 | PATCH | /empleados/:id/esquemas/:asignacionId/finalizar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:256 |
| QA-API-225 | GET | /empleados/:id/haberes | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:257 |
| QA-API-226 | POST | /empleados/:id/haberes | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:258 |
| QA-API-227 | PATCH | /empleados/:id/haberes/:asignacionId/finalizar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:259 |
| QA-API-228 | GET | /empleados/:id/configuracion-documental | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:260 |
| QA-API-229 | PATCH | /empleados/:id/configuracion-documental | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:261 |
| QA-API-230 | GET | /empleados/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:262 |
| QA-API-231 | GET | /esquemas-remuneracionales | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:263 |
| QA-API-232 | POST | /esquemas-remuneracionales | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:264 |
| QA-API-233 | GET | /esquemas-remuneracionales/catalogos/cargos | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:265 |
| QA-API-234 | PATCH | /esquemas-remuneracionales/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:266 |
| QA-API-235 | POST | /esquemas-remuneracionales/:id/cargos | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:267 |
| QA-API-236 | GET | /esquemas-remuneracionales/:id/tarifas | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:268 |
| QA-API-237 | POST | /esquemas-remuneracionales/:id/tarifas | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:269 |
| QA-API-238 | POST | /esquemas-remuneracionales/:id/tarifas/:tarifaId/revisar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:270 |
| QA-API-239 | GET | /haberes | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:271 |
| QA-API-240 | POST | /haberes | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:272 |
| QA-API-241 | PATCH | /haberes/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:273 |
| QA-API-242 | POST | /haberes/:id/configuraciones | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:274 |
| QA-API-243 | GET | /haberes/:id/configuracion-efectiva | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:275 |
| QA-API-244 | GET | /parametros-remuneracionales/efectivo | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:276 |
| QA-API-245 | GET | /parametros-remuneracionales | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:277 |
| QA-API-246 | POST | /parametros-remuneracionales | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:278 |
| QA-API-247 | PATCH | /parametros-remuneracionales/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:279 |
| QA-API-248 | GET | /tramos-impuesto-renta | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:280 |
| QA-API-249 | POST | /tramos-impuesto-renta | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:281 |
| QA-API-250 | GET | /conceptos-deduccion-aporte | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:282 |
| QA-API-251 | POST | /conceptos-deduccion-aporte | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:283 |
| QA-API-252 | PATCH | /conceptos-deduccion-aporte/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:284 |
| QA-API-253 | GET | /configuracion-prorrateo | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:285 |
| QA-API-254 | POST | /configuracion-prorrateo | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:286 |
| QA-API-255 | GET | /politica-conservacion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:287 |
| QA-API-256 | POST | /politica-conservacion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:288 |
| QA-API-257 | GET | /medios-pago-remuneraciones | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:289 |
| QA-API-258 | POST | /medios-pago-remuneraciones | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:290 |
| QA-API-259 | PATCH | /medios-pago-remuneraciones/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:291 |
| QA-API-260 | GET | /hechos-remunerables | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:292 |
| QA-API-261 | GET | /hechos-remunerables/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:293 |
| QA-API-262 | POST | /hechos-remunerables/:id/tratamiento | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:294 |
| QA-API-263 | GET | /retrabajos-pendientes | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:295 |
| QA-API-264 | POST | /retrabajos/:id/resolucion-remuneracional | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:296 |
| QA-API-265 | POST | /remuneraciones/contexto | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:297 |
| QA-API-266 | GET | /remuneraciones/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:298 |
| QA-API-267 | POST | /remuneraciones/:id/componentes-excepcionales | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:299 |
| QA-API-268 | POST | /componentes-remuneracion/:id/resolver-excepcional | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:300 |
| QA-API-269 | POST | /remuneraciones/:id/variables | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:301 |
| QA-API-270 | POST | /componentes-remuneracion/:id/resolver-variable | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:302 |
| QA-API-271 | POST | /remuneraciones/:id/valores-externos | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:303 |
| QA-API-272 | POST | /remuneraciones/:id/ajustes | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:304 |
| QA-API-273 | POST | /componentes-remuneracion/:id/resolver-valor | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:305 |
| QA-API-274 | GET | /remuneraciones/:id/prorrateo | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:306 |
| QA-API-275 | POST | /remuneraciones/:id/prorrateo | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:307 |
| QA-API-276 | POST | /componentes-remuneracion/:id/resolver-prorrateo | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:308 |
| QA-API-277 | GET | /periodos-remuneracion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:309 |
| QA-API-278 | POST | /remuneraciones/calcular | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:310 |
| QA-API-279 | POST | /remuneraciones/:id/cerrar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:311 |
| QA-API-280 | GET | /remuneraciones/:id/liquidacion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:312 |
| QA-API-281 | POST | /periodos-remuneracion/cerrar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:313 |
| QA-API-282 | POST | /remuneraciones/:id/reapertura | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:314 |
| QA-API-283 | POST | /remuneraciones/:id/reapertura/aprobar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:315 |
| QA-API-284 | POST | /remuneraciones/:id/ajustes-posteriores | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:316 |
| QA-API-285 | GET | /ajustes-posteriores/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:317 |
| QA-API-286 | POST | /ajustes-posteriores/:id/postergar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:318 |
| QA-API-287 | POST | /ajustes-posteriores/:id/regularizacion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:319 |
| QA-API-288 | GET | /regularizaciones-remuneracion/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:320 |
| QA-API-289 | PATCH | /regularizaciones-remuneracion/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:321 |
| QA-API-290 | POST | /regularizaciones-remuneracion/:id/cerrar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:322 |
| QA-API-291 | POST | /anticipos-remuneracion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:323 |
| QA-API-292 | GET | /anticipos-remuneracion/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:324 |
| QA-API-293 | POST | /anticipos-remuneracion/:id/pagos | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:325 |
| QA-API-294 | PATCH | /pagos-remuneracion/anticipos/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:326 |
| QA-API-295 | POST | /pagos-remuneracion/anticipos/:id/confirmar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:327 |
| QA-API-296 | GET | /pagos-remuneracion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:328 |
| QA-API-297 | GET | /pagos-remuneracion/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:329 |
| QA-API-298 | POST | /pagos-remuneracion/finales | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:330 |
| QA-API-299 | PATCH | /pagos-remuneracion/finales/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:331 |
| QA-API-300 | POST | /pagos-remuneracion/finales/:id/confirmar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:332 |
| QA-API-301 | GET | /boletas-honorarios/confirmadas | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:333 |
| QA-API-302 | GET | /boletas-honorarios/prestadores | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:334 |
| QA-API-303 | POST | /boletas-honorarios/prestadores | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:335 |
| QA-API-304 | GET | /boletas-honorarios/retenciones-mensuales | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:336 |
| QA-API-305 | GET | /boletas-honorarios | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:337 |
| QA-API-306 | POST | /boletas-honorarios | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:338 |
| QA-API-307 | GET | /boletas-honorarios/:id/calculo-confirmacion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:339 |
| QA-API-308 | POST | /boletas-honorarios/:id/confirmar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:340 |
| QA-API-309 | GET | /boletas-honorarios/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:341 |
| QA-API-310 | PATCH | /boletas-honorarios/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:342 |
| QA-API-311 | POST | /boletas-honorarios/:id/pagos | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:343 |
| QA-API-312 | PATCH | /pagos-remuneracion/honorarios/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:344 |
| QA-API-313 | POST | /pagos-remuneracion/honorarios/:id/confirmar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:345 |
| QA-API-314 | GET | /pagos-remuneracion/:id/detalle | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:346 |
| QA-API-315 | POST | /pagos-remuneracion/:id/anular | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:347 |
| QA-API-316 | POST | /pagos-remuneracion/:id/reversiones | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:348 |
| QA-API-317 | GET | /documentos-remuneracion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:349 |
| QA-API-318 | POST | /documentos-remuneracion/entregas | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:350 |
| QA-API-319 | GET | /documentos-remuneracion/:tipo/:id/entrega | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:351 |
| QA-API-320 | GET | /documentos-remuneracion/:tipo/:id/descarga | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:352 |
| QA-API-321 | POST | /documentos-remuneracion/:tipo/:id/reenviar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:353 |
| QA-API-322 | GET | /remuneraciones/:id/exportacion-preliminar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:354 |
| QA-API-323 | GET | /periodos-remuneracion/exportacion-oficial | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:355 |
| QA-API-324 | GET | /proveedores/catalogos | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:356 |
| QA-API-325 | GET | /proveedores | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:357 |
| QA-API-326 | POST | /proveedores | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:358 |
| QA-API-327 | PUT | /proveedores/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:359 |
| QA-API-328 | POST | /proveedores/:id/corregir-identidad | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:360 |
| QA-API-329 | POST | /proveedores/:id/desactivar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:361 |
| QA-API-330 | POST | /proveedores/:id/reactivar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:362 |
| QA-API-331 | PUT | /proveedores/:id/condicion-pago | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:363 |
| QA-API-332 | GET | /proveedores/:id/saldos-favor | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:364 |
| QA-API-333 | POST | /proveedores/:id/compensaciones/propuesta | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:365 |
| QA-API-334 | POST | /proveedores/:id/compensaciones | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:366 |
| QA-API-335 | GET | /proveedores/:id/compensaciones | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:367 |
| QA-API-336 | GET | /proveedores/:id/ficha | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:368 |
| QA-API-337 | GET | /ordenes-compra-servicios | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:369 |
| QA-API-338 | GET | /ordenes-compra-servicios/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:370 |
| QA-API-339 | POST | /ordenes-compra-servicios | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:371 |
| QA-API-340 | PUT | /ordenes-compra-servicios/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:372 |
| QA-API-341 | POST | /ordenes-compra-servicios/:id/ajustes | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:373 |
| QA-API-342 | POST | /ordenes-compra-servicios/:id/ajustes/:ajusteId/confirmar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:374 |
| QA-API-343 | POST | /ordenes-compra-servicios/:id/anular | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:375 |
| QA-API-344 | POST | /ordenes-compra-servicios/:id/cerrar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:376 |
| QA-API-345 | POST | /ordenes-compra-servicios/:id/reabrir | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:377 |
| QA-API-346 | GET | /documentos-proveedor | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:378 |
| QA-API-347 | GET | /documentos-proveedor-catalogos | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:379 |
| QA-API-348 | POST | /documentos-proveedor/preliminares | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:380 |
| QA-API-349 | POST | /documentos-proveedor/definitivos | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:381 |
| QA-API-350 | POST | /documentos-proveedor/notas-credito | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:382 |
| QA-API-351 | POST | /documentos-proveedor/notas-debito | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:383 |
| QA-API-352 | POST | /documentos-proveedor/ajustes/:id/anular | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:384 |
| QA-API-353 | POST | /documentos-proveedor/:id/reclasificaciones | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:385 |
| QA-API-354 | GET | /documentos-proveedor/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:386 |
| QA-API-355 | POST | /documentos-proveedor/:id/asociaciones | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:387 |
| QA-API-356 | PUT | /documentos-proveedor/:id/diferencias/:asociacionId | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:388 |
| QA-API-357 | POST | /documentos-proveedor/:id/diferencias/:asociacionId/aprobar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:389 |
| QA-API-358 | PUT | /documentos-proveedor/:id/vencimiento | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:390 |
| QA-API-359 | PUT | /documentos-proveedor/:id/clasificacion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:391 |
| QA-API-360 | POST | /documentos-proveedor/:id/imputacion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:392 |
| QA-API-361 | POST | /documentos-proveedor/:id/imputacion/:propuestaId/confirmar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:393 |
| QA-API-362 | POST | /documentos-proveedor/:id/tipo-cambio-manual | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:394 |
| QA-API-363 | POST | /documentos-proveedor/:id/generar-obligacion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:395 |
| QA-API-364 | GET | /cuentas-por-pagar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:396 |
| QA-API-365 | GET | /configuracion/umbral-por-vencer-proveedores | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:397 |
| QA-API-366 | PUT | /configuracion/umbral-por-vencer-proveedores | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:398 |
| QA-API-367 | GET | /pagos-proveedores/proveedores | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:399 |
| QA-API-368 | GET | /pagos-proveedores/catalogos | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:400 |
| QA-API-369 | GET | /pagos-proveedores/borradores | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:401 |
| QA-API-370 | GET | /pagos-proveedores/confirmados | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:402 |
| QA-API-371 | POST | /pagos-proveedores | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:403 |
| QA-API-372 | GET | /pagos-proveedores/:id/detalle | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:404 |
| QA-API-373 | POST | /pagos-proveedores/:id/anular | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:405 |
| QA-API-374 | POST | /pagos-proveedores/:id/movimientos/:movimientoId/anular | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:406 |
| QA-API-375 | POST | /pagos-proveedores/:id/movimientos/:movimientoId/reversas | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:407 |
| QA-API-376 | POST | /pagos-proveedores/:id/movimientos/:movimientoId/conciliar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:408 |
| QA-API-377 | GET | /pagos-proveedores/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:409 |
| QA-API-378 | POST | /pagos-proveedores/:id/movimientos | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:410 |
| QA-API-379 | PUT | /pagos-proveedores/:id/movimientos/:movimientoId | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:411 |
| QA-API-380 | POST | /pagos-proveedores/:id/respaldos | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:412 |
| QA-API-381 | POST | /pagos-proveedores/:id/respaldos/:respaldoId/reemplazar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:413 |
| QA-API-382 | POST | /compensaciones/:id/reversas | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:414 |
| QA-API-383 | GET | /categorias-egreso | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:415 |
| QA-API-384 | POST | /categorias-egreso | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:416 |
| QA-API-385 | PUT | /categorias-egreso/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:417 |
| QA-API-386 | POST | /categorias-egreso/:id/activar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:418 |
| QA-API-387 | POST | /categorias-egreso/:id/desactivar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:419 |
| QA-API-388 | POST | /reclasificaciones/:id/aprobar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:420 |
| QA-API-389 | POST | /reclasificaciones/:id/rechazar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:421 |
| QA-API-390 | GET | /reclasificaciones | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:422 |
| QA-API-391 | GET | /configuracion/umbral-reclasificacion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:423 |
| QA-API-392 | PUT | /configuracion/umbral-reclasificacion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:424 |
| QA-API-393 | PUT | /imputaciones/:id/orden-trabajo | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:425 |
| QA-API-394 | POST | /imputaciones/:id/reasignaciones | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:426 |
| QA-API-395 | GET | /reasignaciones-costo | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:427 |
| QA-API-396 | POST | /reasignaciones-costo/:id/aprobar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:428 |
| QA-API-397 | POST | /reasignaciones-costo/:id/rechazar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:429 |
| QA-API-398 | POST | /pagos-proveedores/:id/comisiones | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:430 |
| QA-API-399 | GET | /envios-importaciones | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:431 |
| QA-API-400 | POST | /envios-importaciones | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:432 |
| QA-API-401 | GET | /envios-importaciones/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:433 |
| QA-API-402 | POST | /envios-importaciones/:id/ordenes-compra | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:434 |
| QA-API-403 | POST | /envios-importaciones/:id/costos | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:435 |
| QA-API-404 | PUT | /envios-importaciones/:id/costos/:costoId | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:436 |
| QA-API-405 | POST | /envios-importaciones/:id/pasar-revision | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:437 |
| QA-API-406 | POST | /envios-importaciones/:id/cerrar-financieramente | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:438 |
| QA-API-407 | POST | /envios-importaciones/:id/reabrir | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:439 |
| QA-API-408 | GET | /caja-chica | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:440 |
| QA-API-409 | GET | /caja-chica/:gastoId | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:441 |
| QA-API-410 | PUT | /caja-chica/fondo/:periodo | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:442 |
| QA-API-411 | POST | /caja-chica/gastos | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:443 |
| QA-API-412 | POST | /caja-chica/gastos/:gastoId/respaldo | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:444 |
| QA-API-413 | POST | /caja-chica/gastos/:gastoId/aprobar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:445 |
| QA-API-414 | POST | /caja-chica/gastos/:gastoId/rechazar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:446 |
| QA-API-415 | POST | /pagos-proveedores/:id/movimientos/:movimientoId/tipo-cambio-manual | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:447 |
| QA-API-416 | POST | /pagos-proveedores/:id/preparar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:448 |
| QA-API-417 | POST | /pagos-proveedores/:id/guardar-borrador | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:449 |
| QA-API-418 | POST | /pagos-proveedores/:id/retomar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:450 |
| QA-API-419 | POST | /pagos-proveedores/:id/descartar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:451 |
| QA-API-420 | POST | /pagos-proveedores/:id/confirmar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:452 |
| QA-API-421 | GET | /dashboard/stats | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:453 |
| QA-API-422 | GET | /billing/inventory | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:454 |
| QA-API-423 | GET | /billing/products | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:455 |
| QA-API-424 | GET | /monedas | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:456 |
| QA-API-425 | GET | /billing/pending-approvals | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:457 |
| QA-API-426 | GET | /billing/history | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:458 |
| QA-API-427 | POST | /billing/quotes | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:459 |
| QA-API-428 | PUT | /billing/quotes/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:460 |
| QA-API-429 | POST | /billing/quotes/cliente | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:461 |
| QA-API-430 | GET | /billing/quotes/obras/buscar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:462 |
| QA-API-431 | POST | /billing/quotes/obras | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:463 |
| QA-API-432 | PUT | /billing/quotes/:id/obra | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:464 |
| QA-API-433 | POST | /billing/quotes/:id/emitir | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:465 |
| QA-API-434 | POST | /billing/quotes/:id/preview-pdf | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:466 |
| QA-API-435 | GET | /billing/quotes/:id/documentos | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:467 |
| QA-API-436 | GET | /billing/quotes/:id/documentos/:versionId/descarga | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:468 |
| QA-API-437 | POST | /billing/quotes/:id/alternativas/seleccionar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:469 |
| QA-API-438 | POST | /billing/quotes/:id/alternativas/aceptar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:470 |
| QA-API-439 | POST | /billing/quotes/:id/alternativas/rechazar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:471 |
| QA-API-440 | POST | /billing/quotes/:id/reactivar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:472 |
| QA-API-441 | POST | /billing/quotes/:id/approve | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:473 |
| QA-API-442 | POST | /billing/quotes/:id/accept-b2b | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:474 |
| QA-API-443 | GET | /billing/quotes/:id/work-order-planning | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:475 |
| QA-API-444 | POST | /billing/quotes/:id/reject | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:476 |
| QA-API-445 | POST | /billing/nota-venta | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:477 |
| QA-API-446 | POST | /billing/nota-venta/:id/approve | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:478 |
| QA-API-447 | POST | /billing/documents | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:480 |
| QA-API-448 | PUT | /billing/guides/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:481 |
| QA-API-449 | PUT | /billing/nota-venta/:id/condiciones-cobro | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:482 |
| QA-API-450 | POST | /billing/configuracion/umbral | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:483 |
| QA-API-451 | GET | /billing/configuracion/umbral | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:484 |
| QA-API-452 | GET | /billing/exchange-rate/:currency | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:485 |
| QA-API-453 | GET | /pagos/catalogos | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:486 |
| QA-API-454 | GET | /pagos/contexto/:idFicha | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:487 |
| QA-API-455 | GET | /pagos/:id | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:488 |
| QA-API-456 | POST | /pagos/:id/anular | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:489 |
| QA-API-457 | POST | /pagos/:id/revertir | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:490 |
| QA-API-458 | POST | /pagos/:id/conciliar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:491 |
| QA-API-459 | GET | /pagos/:id/morosidad | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:492 |
| QA-API-460 | GET | /pagos/:id/comprobante | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:493 |
| QA-API-461 | POST | /saldos-favor/:id/aplicar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:494 |
| QA-API-462 | GET | /notas-venta/:id/saldo | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:495 |
| QA-API-463 | POST | /seguridad/login | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:496 |
| QA-API-464 | POST | /seguridad/recuperacion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:497 |
| QA-API-465 | POST | /seguridad/recuperacion/validar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:498 |
| QA-API-466 | POST | /seguridad/recuperacion/confirmar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:499 |
| QA-API-467 | GET | /seguridad/sesion | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:500 |
| QA-API-468 | POST | /seguridad/salir | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:501 |
| QA-API-469 | POST | /seguridad/clave | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:502 |
| QA-API-470 | GET | /usuarios | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:503 |
| QA-API-471 | GET | /usuarios/catalogos | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:504 |
| QA-API-472 | POST | /usuarios | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:505 |
| QA-API-473 | GET | /sesiones | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:508 |
| QA-API-474 | POST | /sesiones/cerrar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:509 |
| QA-API-475 | POST | /cotizaciones/:id/consolidar-b2c | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:510 |
| QA-API-476 | POST | /notas-venta/:id/etapas-cobro | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:511 |
| QA-API-477 | POST | /clientes/formalizar | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:512 |
| QA-API-478 | POST | /notas-venta/:id/revertir | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:513 |
| QA-API-479 | POST | /pagos | Revisar backend | Respuesta autorizada y error explicito sin permiso | Controladores/src/rutas/finanzas.ts:514 |
## Plantilla de concurrencia
Abrir dos sesiones sobre la misma revision, guardar desde la primera y luego desde la segunda. La segunda debe recibir conflicto; nunca debe pisar silenciosamente.
## Plantilla de doble click
Enviar dos solicitudes iguales con la misma identidad/idempotencia. Debe existir un solo efecto persistente y un solo evento de exito.

## Fuentes de verdad consultadas
- `Controladores/prisma/schema.prisma`
- `Controladores/pruebas`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/rutas/finanzas.ts`
- `Vistas/src`
- `Vistas/src/App.tsx`
