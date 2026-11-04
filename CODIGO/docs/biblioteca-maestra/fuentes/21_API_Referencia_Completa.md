# Catalogo de API

**Proyecto:** Puertas Blindadas
**Documento:** 21
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

## Convenciones
Todos los paths listados son los declarados en rutas. El prefijo efectivo depende del montaje de Express. Permiso vacio significa que el CU no fue detectable en la ventana estatica; no significa endpoint publico.
## Inventario
| Metodo | Path | CU detectado | Handler | Archivo:linea |
| --- | --- | --- | --- | --- |
| GET | /salud | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:27 |
| GET | /auditoria/exportar/:formato | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:28 |
| GET | /auditoria/resumen | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:29 |
| GET | /auditoria/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:30 |
| GET | /auditoria | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:31 |
| GET | /mantenedores/productos/catalogos-vinculacion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:32 |
| GET | /mantenedores/productos/:id/documentos/capacidades | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:33 |
| GET | /mantenedores/productos/:id/documentos/:documentoId/versiones | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:34 |
| GET | /mantenedores/productos/:id/documentos | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:35 |
| POST | /mantenedores/productos/:id/documentos/intenciones | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:36 |
| POST | /mantenedores/productos/:id/documentos/intenciones/:intencionId/confirmar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:37 |
| POST | /mantenedores/productos/:id/documentos/:documentoId/reemplazar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:38 |
| POST | /mantenedores/productos/:id/documentos/:documentoId/vista-previa | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:39 |
| POST | /mantenedores/productos/:id/documentos/:documentoId/descargar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:40 |
| GET | /catalogo-comercial/productos/:id/ficha | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:41 |
| GET | /catalogo-comercial/productos | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:42 |
| GET | /mantenedores/comercial/precios | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:43 |
| GET | /mantenedores/documentos-comerciales/estado | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:44 |
| GET | /mantenedores/documentos-comerciales/plantillas | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:45 |
| POST | /mantenedores/documentos-comerciales/plantillas | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:46 |
| PUT | /mantenedores/documentos-comerciales/plantillas/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:47 |
| POST | /mantenedores/documentos-comerciales/plantillas/:id/publicar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:48 |
| GET | /mantenedores/documentos-comerciales/cartas-b2c | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:49 |
| POST | /mantenedores/documentos-comerciales/cartas-b2c | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:50 |
| PUT | /mantenedores/documentos-comerciales/cartas-b2c/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:51 |
| POST | /mantenedores/documentos-comerciales/cartas-b2c/:id/publicar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:52 |
| POST | /mantenedores/documentos-comerciales/cartas-b2c/:id/vista-previa | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:53 |
| GET | /mantenedores/documentos-comerciales/cartas-b2c/:id/versiones/:versionId/descarga | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:54 |
| GET | /mantenedores/comercial/servicios | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:55 |
| POST | /mantenedores/comercial/servicios | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:56 |
| POST | /mantenedores/comercial/servicios/:id/precios | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:57 |
| POST | /mantenedores/comercial/servicios/:id/desactivar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:58 |
| POST | /mantenedores/comercial/precios | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:59 |
| POST | /mantenedores/comercial/precios/:id/versiones | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:60 |
| POST | /mantenedores/comercial/precios/:id/desactivar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:61 |
| GET | /mantenedores/comercial/opcionales | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:62 |
| POST | /mantenedores/comercial/opcionales | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:63 |
| PUT | /mantenedores/comercial/opcionales/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:64 |
| PUT | /mantenedores/comercial/opcionales/:id/compatibilidad | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:65 |
| POST | /mantenedores/comercial/opcionales/:id/precios | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:66 |
| POST | /mantenedores/comercial/opcionales/:id/desactivar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:67 |
| GET | /mantenedores/comercial/tarifas-instalacion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:68 |
| POST | /mantenedores/comercial/tarifas-instalacion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:69 |
| POST | /mantenedores/comercial/tarifas-instalacion/:id/versiones | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:70 |
| POST | /mantenedores/comercial/tarifas-instalacion/exclusiones | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:71 |
| POST | /mantenedores/comercial/tarifas-instalacion/:id/desactivar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:72 |
| GET | /mantenedores/comercial/condiciones | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:73 |
| POST | /mantenedores/comercial/condiciones | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:74 |
| POST | /mantenedores/comercial/condiciones/:id/versiones | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:75 |
| POST | /mantenedores/comercial/condiciones/:id/versiones/:versionId/publicar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:76 |
| POST | /mantenedores/comercial/condiciones/:id/desactivar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:77 |
| GET | /catalogo-comercial/instalacion/cobertura | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:78 |
| GET | /mantenedores/productos/:id/resumen-comercial | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:79 |
| GET | /mantenedores/productos | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:80 |
| POST | /mantenedores/productos | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:81 |
| GET | /mantenedores/productos/:id/historial | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:82 |
| GET | /mantenedores/productos/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:83 |
| PUT | /mantenedores/productos/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:84 |
| POST | /mantenedores/productos/:id/desactivar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:85 |
| POST | /mantenedores/productos/:id/reactivar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:86 |
| PUT | /mantenedores/productos/:id/vinculaciones | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:87 |
| POST | /mantenedores/productos/:id/versiones | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:88 |
| GET | /mantenedores/familias-producto | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:89 |
| POST | /mantenedores/familias-producto | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:90 |
| GET | /mantenedores/familias-producto/:id/historial | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:91 |
| PUT | /mantenedores/familias-producto/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:92 |
| POST | /mantenedores/familias-producto/:id/desactivar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:93 |
| POST | /mantenedores/familias-producto/:id/reactivar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:94 |
| GET | /mantenedores/tareas-fabricacion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:95 |
| POST | /mantenedores/tareas-fabricacion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:96 |
| PUT | /mantenedores/tareas-fabricacion/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:97 |
| POST | /mantenedores/tareas-fabricacion/:id/desactivar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:98 |
| POST | /mantenedores/tareas-fabricacion/:id/reactivar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:99 |
| GET | /mantenedores/familias-producto/:id/plantilla-fabricacion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:100 |
| GET | /mantenedores/familias-producto/:id/plantilla-fabricacion/historial | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:101 |
| PUT | /mantenedores/familias-producto/:id/plantilla-fabricacion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:102 |
| POST | /mantenedores/familias-producto/:id/plantilla-fabricacion/publicar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:103 |
| GET | /credito/solicitudes | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:104 |
| GET | /credito/solicitudes/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:105 |
| POST | /credito/solicitudes/inicial | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:106 |
| POST | /credito/solicitudes/excepcion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:107 |
| POST | /credito/solicitudes/:id/enviar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:108 |
| POST | /credito/solicitudes/:id/cancelar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:109 |
| POST | /credito/solicitudes/:id/resolver-inicial | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:110 |
| POST | /credito/solicitudes/:id/resolver-excepcion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:111 |
| PUT | /credito/clientes/:id/cupo | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:112 |
| POST | /credito/clientes/:id/suspender | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:113 |
| POST | /credito/clientes/:id/reactivar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:114 |
| GET | /credito/clientes/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:115 |
| GET | /credito/clientes/:id/historial | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:116 |
| GET | /credito/clientes/:id/compromisos | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:117 |
| PUT | /credito/configuracion/limite-global | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:118 |
| GET | /credito/exposicion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:119 |
| GET | /credito/distribucion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:120 |
| POST | /credito/validar-formalizacion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:121 |
| GET | /credito/exportar/:origen | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:122 |
| GET | /dashboard-m7 | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:123 |
| GET | /dashboard-m7/historico | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:124 |
| GET | /dashboard-m7/centro-atencion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:125 |
| GET | /dashboard-m7/cotizaciones-pendientes | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:126 |
| GET | /dashboard-m7/clientes/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:127 |
| GET | /dashboard-m7/ventas | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:128 |
| GET | /dashboard-m7/cuentas-cobrar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:129 |
| GET | /dashboard-m7/cuentas-pagar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:130 |
| GET | /dashboard-m7/liquidez | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:131 |
| POST | /dashboard-m7/liquidez/cuentas-bancarias | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:132 |
| PUT | /dashboard-m7/liquidez/cuentas-bancarias/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:133 |
| POST | /dashboard-m7/liquidez/saldos-iniciales | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:134 |
| PUT | /dashboard-m7/liquidez/saldos-iniciales/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:135 |
| POST | /dashboard-m7/proyecciones | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:136 |
| PUT | /dashboard-m7/proyecciones/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:137 |
| DELETE | /dashboard-m7/proyecciones/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:138 |
| GET | /dashboard-m7/riesgo-deficit | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:139 |
| POST | /dashboard-m7/liquidez/ajustes | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:140 |
| GET | /dashboard-m7/liquidez/ajustes/catalogos | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:141 |
| GET | /dashboard-m7/configuracion/umbrales-liquidez | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:142 |
| POST | /dashboard-m7/configuracion/umbrales-liquidez | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:143 |
| GET | /dashboard-m7/proyectos/exposicion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:144 |
| GET | /dashboard-m7/proyectos/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:145 |
| GET | /dashboard-m7/margen-proyectos | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:146 |
| GET | /dashboard-m7/resumen-resultados | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:147 |
| GET | /dashboard-m7/situacion-financiera | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:148 |
| GET | /dashboard-m7/operacion/costo-remuneraciones | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:149 |
| GET | /dashboard-m7/operacion/ordenes-trabajo | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:150 |
| GET | /dashboard-m7/operacion/produccion-modelos | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:151 |
| GET | /dashboard-m7/operacion/carga | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:152 |
| GET | /dashboard-m7/operacion/instalaciones | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:153 |
| GET | /dashboard-m7/operacion/instalaciones/atrasos | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:154 |
| GET | /dashboard-m7/operacion/incidencias | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:155 |
| GET | /dashboard-m7/credito/exposicion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:156 |
| GET | /dashboard-m7/credito/alertas | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:157 |
| GET | /dashboard-m7/tributario/iva | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:158 |
| GET | /dashboard-m7/costos/fabricacion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:159 |
| GET | /dashboard-m7/operacion/bloqueos | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:160 |
| GET | /dashboard-m7/operacion/instalaciones/margen | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:161 |
| GET | /dashboard-m7/inventario/valorizado | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:162 |
| GET | /dashboard-m7/inventario/materiales-proyecto | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:163 |
| GET | /dashboard-m7/inventario/riesgo-stock | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:164 |
| GET | /dashboard-m7/inventario/rotacion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:165 |
| GET | /dashboard-m7/compras/recepciones | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:166 |
| GET | /dashboard-m7/configuracion/costos-instalacion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:167 |
| POST | /dashboard-m7/configuracion/costos-instalacion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:168 |
| GET | /dashboard-m7/configuracion/stock-inmovil | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:169 |
| POST | /dashboard-m7/configuracion/stock-inmovil | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:170 |
| POST | /dashboard-m7/pdf | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:171 |
| POST | /dashboard-m7/excel | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:172 |
| GET | /dashboard-m7/configuracion/margen-critico | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:173 |
| POST | /dashboard-m7/configuracion/margen-critico | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:174 |
| GET | /terreno/visitas | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:175 |
| GET | /terreno/instalaciones | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:176 |
| POST | /terreno/visitas | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:177 |
| GET | /terreno/obras | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:178 |
| GET | /terreno/usuarios | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:179 |
| GET | /terreno/mis-tareas | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:180 |
| GET | /terreno/tareas/:id/levantamiento | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:181 |
| PUT | /terreno/tareas/:id/levantamiento | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:182 |
| POST | /terreno/tareas/:id/levantamiento/correcciones | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:183 |
| POST | /terreno/tareas/:id/orden-trabajo | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:184 |
| GET | /terreno/ordenes-trabajo | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:185 |
| GET | /terreno/ordenes-trabajo/:ordenId | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:186 |
| PATCH | /terreno/ordenes-trabajo/:ordenId/rectificador | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:187 |
| PUT | /terreno/ordenes-trabajo/:ordenId/rectificacion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:188 |
| POST | /terreno/ordenes-trabajo/:ordenId/rectificacion/enviar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:189 |
| POST | /terreno/ordenes-trabajo/:ordenId/rectificacion/aprobar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:190 |
| POST | /terreno/ordenes-trabajo/:ordenId/rectificacion/devolver | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:191 |
| POST | /terreno/ordenes-trabajo/:ordenId/liberar-produccion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:192 |
| POST | /terreno/tareas/:id/orden-trabajo/ajustes | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:193 |
| POST | /terreno/tareas/:id/orden-trabajo/:ordenId/liberar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:194 |
| POST | /terreno/tareas/:id/orden-trabajo/:ordenId/tareas-produccion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:195 |
| GET | /terreno/ordenes-trabajo/:ordenId/tareas-produccion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:196 |
| PUT | /terreno/tareas-produccion/:id/asignaciones | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:197 |
| PATCH | /terreno/tareas-produccion/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:198 |
| POST | /terreno/ordenes-trabajo/:ordenId/etapas-produccion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:199 |
| POST | /terreno/ordenes-trabajo/:ordenId/tareas-produccion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:200 |
| POST | /terreno/tareas-produccion/:id/inicio | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:201 |
| POST | /terreno/tareas-produccion/:id/ejecuciones | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:202 |
| GET | /terreno/ejecuciones/pendientes | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:203 |
| PATCH | /terreno/ejecuciones/:id/validacion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:204 |
| POST | /terreno/tareas-produccion/:id/cierre | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:205 |
| POST | /terreno/ordenes-trabajo/:ordenId/correcciones-tecnicas | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:206 |
| POST | /terreno/ordenes-trabajo/:ordenId/finalizar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:207 |
| GET | /terreno/visitas/:id/preparacion-salida | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:208 |
| PATCH | /terreno/visitas/:id/preparacion-salida/checklist | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:209 |
| POST | /terreno/visitas/:id/resultado | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:210 |
| POST | /terreno/ejecuciones/:id/incidencias | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:211 |
| GET | /terreno/incidencias | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:212 |
| GET | /terreno/dashboard-operacional | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:213 |
| GET | /terreno/reportes/exportar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:214 |
| GET | /terreno/incidencias-catalogos | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:215 |
| GET | /terreno/incidencias/:id/evidencias/:evidenciaId | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:216 |
| POST | /terreno/incidencias/:id/evidencias | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:217 |
| PATCH | /terreno/incidencias/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:218 |
| POST | /terreno/incidencias/:id/aprobar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:219 |
| POST | /terreno/incidencias/:id/rechazar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:220 |
| PATCH | /terreno/visitas/:id/responsable | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:221 |
| GET | /terreno/visitas/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:222 |
| GET | /empleados | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:229 |
| POST | /empleados | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:230 |
| GET | /areas-trabajo | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:231 |
| POST | /areas-trabajo | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:232 |
| PATCH | /areas-trabajo/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:233 |
| POST | /areas-trabajo/:id/activar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:234 |
| POST | /areas-trabajo/:id/desactivar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:235 |
| GET | /areas-trabajo/:id/empleados | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:236 |
| GET | /empleados/catalogos/laborales | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:237 |
| GET | /empleados/catalogos/remuneracionales | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:238 |
| GET | /empleados/catalogos/deducciones | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:239 |
| GET | /empleados/:id/deducciones | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:240 |
| POST | /empleados/:id/deducciones | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:241 |
| PATCH | /empleados/:id/deducciones/:asignacionId/finalizar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:242 |
| GET | /empleados/catalogos/esquemas | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:243 |
| GET | /empleados/catalogos/haberes | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:244 |
| PATCH | /empleados/:id/datos-base | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:245 |
| GET | /empleados/:id/area-historial | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:246 |
| POST | /empleados/:id/area | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:247 |
| GET | /empleados/:id/relaciones-laborales | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:248 |
| POST | /empleados/:id/relaciones-laborales | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:249 |
| PATCH | /empleados/:id/relaciones-laborales/:relacionId | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:250 |
| GET | /empleados/:id/perfil-remuneracional | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:251 |
| GET | /empleados/:id/historial-remuneracional | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:252 |
| PATCH | /empleados/:id/perfil-remuneracional | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:253 |
| GET | /empleados/:id/esquemas | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:254 |
| POST | /empleados/:id/esquemas | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:255 |
| PATCH | /empleados/:id/esquemas/:asignacionId/finalizar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:256 |
| GET | /empleados/:id/haberes | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:257 |
| POST | /empleados/:id/haberes | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:258 |
| PATCH | /empleados/:id/haberes/:asignacionId/finalizar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:259 |
| GET | /empleados/:id/configuracion-documental | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:260 |
| PATCH | /empleados/:id/configuracion-documental | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:261 |
| GET | /empleados/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:262 |
| GET | /esquemas-remuneracionales | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:263 |
| POST | /esquemas-remuneracionales | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:264 |
| GET | /esquemas-remuneracionales/catalogos/cargos | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:265 |
| PATCH | /esquemas-remuneracionales/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:266 |
| POST | /esquemas-remuneracionales/:id/cargos | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:267 |
| GET | /esquemas-remuneracionales/:id/tarifas | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:268 |
| POST | /esquemas-remuneracionales/:id/tarifas | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:269 |
| POST | /esquemas-remuneracionales/:id/tarifas/:tarifaId/revisar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:270 |
| GET | /haberes | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:271 |
| POST | /haberes | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:272 |
| PATCH | /haberes/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:273 |
| POST | /haberes/:id/configuraciones | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:274 |
| GET | /haberes/:id/configuracion-efectiva | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:275 |
| GET | /parametros-remuneracionales/efectivo | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:276 |
| GET | /parametros-remuneracionales | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:277 |
| POST | /parametros-remuneracionales | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:278 |
| PATCH | /parametros-remuneracionales/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:279 |
| GET | /tramos-impuesto-renta | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:280 |
| POST | /tramos-impuesto-renta | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:281 |
| GET | /conceptos-deduccion-aporte | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:282 |
| POST | /conceptos-deduccion-aporte | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:283 |
| PATCH | /conceptos-deduccion-aporte/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:284 |
| GET | /configuracion-prorrateo | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:285 |
| POST | /configuracion-prorrateo | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:286 |
| GET | /politica-conservacion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:287 |
| POST | /politica-conservacion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:288 |
| GET | /medios-pago-remuneraciones | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:289 |
| POST | /medios-pago-remuneraciones | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:290 |
| PATCH | /medios-pago-remuneraciones/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:291 |
| GET | /hechos-remunerables | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:292 |
| GET | /hechos-remunerables/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:293 |
| POST | /hechos-remunerables/:id/tratamiento | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:294 |
| GET | /retrabajos-pendientes | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:295 |
| POST | /retrabajos/:id/resolucion-remuneracional | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:296 |
| POST | /remuneraciones/contexto | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:297 |
| GET | /remuneraciones/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:298 |
| POST | /remuneraciones/:id/componentes-excepcionales | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:299 |
| POST | /componentes-remuneracion/:id/resolver-excepcional | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:300 |
| POST | /remuneraciones/:id/variables | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:301 |
| POST | /componentes-remuneracion/:id/resolver-variable | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:302 |
| POST | /remuneraciones/:id/valores-externos | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:303 |
| POST | /remuneraciones/:id/ajustes | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:304 |
| POST | /componentes-remuneracion/:id/resolver-valor | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:305 |
| GET | /remuneraciones/:id/prorrateo | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:306 |
| POST | /remuneraciones/:id/prorrateo | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:307 |
| POST | /componentes-remuneracion/:id/resolver-prorrateo | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:308 |
| GET | /periodos-remuneracion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:309 |
| POST | /remuneraciones/calcular | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:310 |
| POST | /remuneraciones/:id/cerrar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:311 |
| GET | /remuneraciones/:id/liquidacion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:312 |
| POST | /periodos-remuneracion/cerrar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:313 |
| POST | /remuneraciones/:id/reapertura | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:314 |
| POST | /remuneraciones/:id/reapertura/aprobar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:315 |
| POST | /remuneraciones/:id/ajustes-posteriores | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:316 |
| GET | /ajustes-posteriores/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:317 |
| POST | /ajustes-posteriores/:id/postergar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:318 |
| POST | /ajustes-posteriores/:id/regularizacion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:319 |
| GET | /regularizaciones-remuneracion/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:320 |
| PATCH | /regularizaciones-remuneracion/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:321 |
| POST | /regularizaciones-remuneracion/:id/cerrar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:322 |
| POST | /anticipos-remuneracion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:323 |
| GET | /anticipos-remuneracion/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:324 |
| POST | /anticipos-remuneracion/:id/pagos | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:325 |
| PATCH | /pagos-remuneracion/anticipos/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:326 |
| POST | /pagos-remuneracion/anticipos/:id/confirmar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:327 |
| GET | /pagos-remuneracion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:328 |
| GET | /pagos-remuneracion/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:329 |
| POST | /pagos-remuneracion/finales | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:330 |
| PATCH | /pagos-remuneracion/finales/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:331 |
| POST | /pagos-remuneracion/finales/:id/confirmar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:332 |
| GET | /boletas-honorarios/confirmadas | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:333 |
| GET | /boletas-honorarios/prestadores | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:334 |
| POST | /boletas-honorarios/prestadores | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:335 |
| GET | /boletas-honorarios/retenciones-mensuales | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:336 |
| GET | /boletas-honorarios | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:337 |
| POST | /boletas-honorarios | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:338 |
| GET | /boletas-honorarios/:id/calculo-confirmacion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:339 |
| POST | /boletas-honorarios/:id/confirmar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:340 |
| GET | /boletas-honorarios/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:341 |
| PATCH | /boletas-honorarios/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:342 |
| POST | /boletas-honorarios/:id/pagos | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:343 |
| PATCH | /pagos-remuneracion/honorarios/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:344 |
| POST | /pagos-remuneracion/honorarios/:id/confirmar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:345 |
| GET | /pagos-remuneracion/:id/detalle | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:346 |
| POST | /pagos-remuneracion/:id/anular | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:347 |
| POST | /pagos-remuneracion/:id/reversiones | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:348 |
| GET | /documentos-remuneracion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:349 |
| POST | /documentos-remuneracion/entregas | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:350 |
| GET | /documentos-remuneracion/:tipo/:id/entrega | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:351 |
| GET | /documentos-remuneracion/:tipo/:id/descarga | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:352 |
| POST | /documentos-remuneracion/:tipo/:id/reenviar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:353 |
| GET | /remuneraciones/:id/exportacion-preliminar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:354 |
| GET | /periodos-remuneracion/exportacion-oficial | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:355 |
| GET | /proveedores/catalogos | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:356 |
| GET | /proveedores | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:357 |
| POST | /proveedores | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:358 |
| PUT | /proveedores/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:359 |
| POST | /proveedores/:id/corregir-identidad | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:360 |
| POST | /proveedores/:id/desactivar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:361 |
| POST | /proveedores/:id/reactivar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:362 |
| PUT | /proveedores/:id/condicion-pago | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:363 |
| GET | /proveedores/:id/saldos-favor | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:364 |
| POST | /proveedores/:id/compensaciones/propuesta | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:365 |
| POST | /proveedores/:id/compensaciones | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:366 |
| GET | /proveedores/:id/compensaciones | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:367 |
| GET | /proveedores/:id/ficha | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:368 |
| GET | /ordenes-compra-servicios | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:369 |
| GET | /ordenes-compra-servicios/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:370 |
| POST | /ordenes-compra-servicios | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:371 |
| PUT | /ordenes-compra-servicios/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:372 |
| POST | /ordenes-compra-servicios/:id/ajustes | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:373 |
| POST | /ordenes-compra-servicios/:id/ajustes/:ajusteId/confirmar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:374 |
| POST | /ordenes-compra-servicios/:id/anular | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:375 |
| POST | /ordenes-compra-servicios/:id/cerrar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:376 |
| POST | /ordenes-compra-servicios/:id/reabrir | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:377 |
| GET | /documentos-proveedor | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:378 |
| GET | /documentos-proveedor-catalogos | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:379 |
| POST | /documentos-proveedor/preliminares | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:380 |
| POST | /documentos-proveedor/definitivos | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:381 |
| POST | /documentos-proveedor/notas-credito | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:382 |
| POST | /documentos-proveedor/notas-debito | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:383 |
| POST | /documentos-proveedor/ajustes/:id/anular | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:384 |
| POST | /documentos-proveedor/:id/reclasificaciones | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:385 |
| GET | /documentos-proveedor/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:386 |
| POST | /documentos-proveedor/:id/asociaciones | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:387 |
| PUT | /documentos-proveedor/:id/diferencias/:asociacionId | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:388 |
| POST | /documentos-proveedor/:id/diferencias/:asociacionId/aprobar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:389 |
| PUT | /documentos-proveedor/:id/vencimiento | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:390 |
| PUT | /documentos-proveedor/:id/clasificacion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:391 |
| POST | /documentos-proveedor/:id/imputacion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:392 |
| POST | /documentos-proveedor/:id/imputacion/:propuestaId/confirmar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:393 |
| POST | /documentos-proveedor/:id/tipo-cambio-manual | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:394 |
| POST | /documentos-proveedor/:id/generar-obligacion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:395 |
| GET | /cuentas-por-pagar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:396 |
| GET | /configuracion/umbral-por-vencer-proveedores | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:397 |
| PUT | /configuracion/umbral-por-vencer-proveedores | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:398 |
| GET | /pagos-proveedores/proveedores | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:399 |
| GET | /pagos-proveedores/catalogos | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:400 |
| GET | /pagos-proveedores/borradores | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:401 |
| GET | /pagos-proveedores/confirmados | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:402 |
| POST | /pagos-proveedores | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:403 |
| GET | /pagos-proveedores/:id/detalle | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:404 |
| POST | /pagos-proveedores/:id/anular | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:405 |
| POST | /pagos-proveedores/:id/movimientos/:movimientoId/anular | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:406 |
| POST | /pagos-proveedores/:id/movimientos/:movimientoId/reversas | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:407 |
| POST | /pagos-proveedores/:id/movimientos/:movimientoId/conciliar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:408 |
| GET | /pagos-proveedores/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:409 |
| POST | /pagos-proveedores/:id/movimientos | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:410 |
| PUT | /pagos-proveedores/:id/movimientos/:movimientoId | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:411 |
| POST | /pagos-proveedores/:id/respaldos | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:412 |
| POST | /pagos-proveedores/:id/respaldos/:respaldoId/reemplazar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:413 |
| POST | /compensaciones/:id/reversas | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:414 |
| GET | /categorias-egreso | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:415 |
| POST | /categorias-egreso | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:416 |
| PUT | /categorias-egreso/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:417 |
| POST | /categorias-egreso/:id/activar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:418 |
| POST | /categorias-egreso/:id/desactivar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:419 |
| POST | /reclasificaciones/:id/aprobar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:420 |
| POST | /reclasificaciones/:id/rechazar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:421 |
| GET | /reclasificaciones | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:422 |
| GET | /configuracion/umbral-reclasificacion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:423 |
| PUT | /configuracion/umbral-reclasificacion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:424 |
| PUT | /imputaciones/:id/orden-trabajo | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:425 |
| POST | /imputaciones/:id/reasignaciones | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:426 |
| GET | /reasignaciones-costo | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:427 |
| POST | /reasignaciones-costo/:id/aprobar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:428 |
| POST | /reasignaciones-costo/:id/rechazar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:429 |
| POST | /pagos-proveedores/:id/comisiones | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:430 |
| GET | /envios-importaciones | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:431 |
| POST | /envios-importaciones | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:432 |
| GET | /envios-importaciones/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:433 |
| POST | /envios-importaciones/:id/ordenes-compra | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:434 |
| POST | /envios-importaciones/:id/costos | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:435 |
| PUT | /envios-importaciones/:id/costos/:costoId | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:436 |
| POST | /envios-importaciones/:id/pasar-revision | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:437 |
| POST | /envios-importaciones/:id/cerrar-financieramente | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:438 |
| POST | /envios-importaciones/:id/reabrir | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:439 |
| GET | /caja-chica | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:440 |
| GET | /caja-chica/:gastoId | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:441 |
| PUT | /caja-chica/fondo/:periodo | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:442 |
| POST | /caja-chica/gastos | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:443 |
| POST | /caja-chica/gastos/:gastoId/respaldo | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:444 |
| POST | /caja-chica/gastos/:gastoId/aprobar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:445 |
| POST | /caja-chica/gastos/:gastoId/rechazar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:446 |
| POST | /pagos-proveedores/:id/movimientos/:movimientoId/tipo-cambio-manual | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:447 |
| POST | /pagos-proveedores/:id/preparar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:448 |
| POST | /pagos-proveedores/:id/guardar-borrador | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:449 |
| POST | /pagos-proveedores/:id/retomar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:450 |
| POST | /pagos-proveedores/:id/descartar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:451 |
| POST | /pagos-proveedores/:id/confirmar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:452 |
| GET | /dashboard/stats | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:453 |
| GET | /billing/inventory | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:454 |
| GET | /billing/products | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:455 |
| GET | /monedas | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:456 |
| GET | /billing/pending-approvals | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:457 |
| GET | /billing/history | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:458 |
| POST | /billing/quotes | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:459 |
| PUT | /billing/quotes/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:460 |
| POST | /billing/quotes/cliente | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:461 |
| GET | /billing/quotes/obras/buscar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:462 |
| POST | /billing/quotes/obras | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:463 |
| PUT | /billing/quotes/:id/obra | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:464 |
| POST | /billing/quotes/:id/emitir | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:465 |
| POST | /billing/quotes/:id/preview-pdf | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:466 |
| GET | /billing/quotes/:id/documentos | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:467 |
| GET | /billing/quotes/:id/documentos/:versionId/descarga | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:468 |
| POST | /billing/quotes/:id/alternativas/seleccionar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:469 |
| POST | /billing/quotes/:id/alternativas/aceptar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:470 |
| POST | /billing/quotes/:id/alternativas/rechazar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:471 |
| POST | /billing/quotes/:id/reactivar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:472 |
| POST | /billing/quotes/:id/approve | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:473 |
| POST | /billing/quotes/:id/accept-b2b | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:474 |
| GET | /billing/quotes/:id/work-order-planning | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:475 |
| POST | /billing/quotes/:id/reject | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:476 |
| POST | /billing/nota-venta | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:477 |
| POST | /billing/nota-venta/:id/approve | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:478 |
| POST | /billing/documents | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:480 |
| PUT | /billing/guides/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:481 |
| PUT | /billing/nota-venta/:id/condiciones-cobro | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:482 |
| POST | /billing/configuracion/umbral | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:483 |
| GET | /billing/configuracion/umbral | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:484 |
| GET | /billing/exchange-rate/:currency | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:485 |
| GET | /pagos/catalogos | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:486 |
| GET | /pagos/contexto/:idFicha | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:487 |
| GET | /pagos/:id | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:488 |
| POST | /pagos/:id/anular | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:489 |
| POST | /pagos/:id/revertir | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:490 |
| POST | /pagos/:id/conciliar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:491 |
| GET | /pagos/:id/morosidad | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:492 |
| GET | /pagos/:id/comprobante | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:493 |
| POST | /saldos-favor/:id/aplicar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:494 |
| GET | /notas-venta/:id/saldo | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:495 |
| POST | /seguridad/login | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:496 |
| POST | /seguridad/recuperacion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:497 |
| POST | /seguridad/recuperacion/validar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:498 |
| POST | /seguridad/recuperacion/confirmar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:499 |
| GET | /seguridad/sesion | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:500 |
| POST | /seguridad/salir | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:501 |
| POST | /seguridad/clave | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:502 |
| GET | /usuarios | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:503 |
| GET | /usuarios/catalogos | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:504 |
| POST | /usuarios | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:505 |
| GET | /sesiones | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:508 |
| POST | /sesiones/cerrar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:509 |
| POST | /cotizaciones/:id/consolidar-b2c | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:510 |
| POST | /notas-venta/:id/etapas-cobro | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:511 |
| POST | /clientes/formalizar | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:512 |
| POST | /notas-venta/:id/revertir | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:513 |
| POST | /pagos | Revisar autorizacion | inline/no detectado | Controladores/src/rutas/finanzas.ts:514 |
## GET `/salud`
**Ruta:** `Controladores/src/rutas/finanzas.ts:27`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/auditoria/exportar/:formato`
**Ruta:** `Controladores/src/rutas/finanzas.ts:28`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/auditoria/resumen`
**Ruta:** `Controladores/src/rutas/finanzas.ts:29`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/auditoria/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:30`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/auditoria`
**Ruta:** `Controladores/src/rutas/finanzas.ts:31`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/mantenedores/productos/catalogos-vinculacion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:32`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/mantenedores/productos/:id/documentos/capacidades`
**Ruta:** `Controladores/src/rutas/finanzas.ts:33`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/mantenedores/productos/:id/documentos/:documentoId/versiones`
**Ruta:** `Controladores/src/rutas/finanzas.ts:34`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/mantenedores/productos/:id/documentos`
**Ruta:** `Controladores/src/rutas/finanzas.ts:35`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/productos/:id/documentos/intenciones`
**Ruta:** `Controladores/src/rutas/finanzas.ts:36`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/productos/:id/documentos/intenciones/:intencionId/confirmar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:37`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/productos/:id/documentos/:documentoId/reemplazar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:38`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/productos/:id/documentos/:documentoId/vista-previa`
**Ruta:** `Controladores/src/rutas/finanzas.ts:39`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/productos/:id/documentos/:documentoId/descargar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:40`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/catalogo-comercial/productos/:id/ficha`
**Ruta:** `Controladores/src/rutas/finanzas.ts:41`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/catalogo-comercial/productos`
**Ruta:** `Controladores/src/rutas/finanzas.ts:42`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/mantenedores/comercial/precios`
**Ruta:** `Controladores/src/rutas/finanzas.ts:43`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/mantenedores/documentos-comerciales/estado`
**Ruta:** `Controladores/src/rutas/finanzas.ts:44`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/mantenedores/documentos-comerciales/plantillas`
**Ruta:** `Controladores/src/rutas/finanzas.ts:45`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/documentos-comerciales/plantillas`
**Ruta:** `Controladores/src/rutas/finanzas.ts:46`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PUT `/mantenedores/documentos-comerciales/plantillas/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:47`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/documentos-comerciales/plantillas/:id/publicar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:48`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/mantenedores/documentos-comerciales/cartas-b2c`
**Ruta:** `Controladores/src/rutas/finanzas.ts:49`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/documentos-comerciales/cartas-b2c`
**Ruta:** `Controladores/src/rutas/finanzas.ts:50`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PUT `/mantenedores/documentos-comerciales/cartas-b2c/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:51`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/documentos-comerciales/cartas-b2c/:id/publicar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:52`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/documentos-comerciales/cartas-b2c/:id/vista-previa`
**Ruta:** `Controladores/src/rutas/finanzas.ts:53`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/mantenedores/documentos-comerciales/cartas-b2c/:id/versiones/:versionId/descarga`
**Ruta:** `Controladores/src/rutas/finanzas.ts:54`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/mantenedores/comercial/servicios`
**Ruta:** `Controladores/src/rutas/finanzas.ts:55`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/comercial/servicios`
**Ruta:** `Controladores/src/rutas/finanzas.ts:56`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/comercial/servicios/:id/precios`
**Ruta:** `Controladores/src/rutas/finanzas.ts:57`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/comercial/servicios/:id/desactivar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:58`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/comercial/precios`
**Ruta:** `Controladores/src/rutas/finanzas.ts:59`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/comercial/precios/:id/versiones`
**Ruta:** `Controladores/src/rutas/finanzas.ts:60`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/comercial/precios/:id/desactivar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:61`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/mantenedores/comercial/opcionales`
**Ruta:** `Controladores/src/rutas/finanzas.ts:62`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/comercial/opcionales`
**Ruta:** `Controladores/src/rutas/finanzas.ts:63`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PUT `/mantenedores/comercial/opcionales/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:64`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PUT `/mantenedores/comercial/opcionales/:id/compatibilidad`
**Ruta:** `Controladores/src/rutas/finanzas.ts:65`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/comercial/opcionales/:id/precios`
**Ruta:** `Controladores/src/rutas/finanzas.ts:66`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/comercial/opcionales/:id/desactivar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:67`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/mantenedores/comercial/tarifas-instalacion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:68`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/comercial/tarifas-instalacion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:69`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/comercial/tarifas-instalacion/:id/versiones`
**Ruta:** `Controladores/src/rutas/finanzas.ts:70`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/comercial/tarifas-instalacion/exclusiones`
**Ruta:** `Controladores/src/rutas/finanzas.ts:71`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/comercial/tarifas-instalacion/:id/desactivar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:72`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/mantenedores/comercial/condiciones`
**Ruta:** `Controladores/src/rutas/finanzas.ts:73`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/comercial/condiciones`
**Ruta:** `Controladores/src/rutas/finanzas.ts:74`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/comercial/condiciones/:id/versiones`
**Ruta:** `Controladores/src/rutas/finanzas.ts:75`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/comercial/condiciones/:id/versiones/:versionId/publicar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:76`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/comercial/condiciones/:id/desactivar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:77`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/catalogo-comercial/instalacion/cobertura`
**Ruta:** `Controladores/src/rutas/finanzas.ts:78`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/mantenedores/productos/:id/resumen-comercial`
**Ruta:** `Controladores/src/rutas/finanzas.ts:79`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/mantenedores/productos`
**Ruta:** `Controladores/src/rutas/finanzas.ts:80`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/productos`
**Ruta:** `Controladores/src/rutas/finanzas.ts:81`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/mantenedores/productos/:id/historial`
**Ruta:** `Controladores/src/rutas/finanzas.ts:82`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/mantenedores/productos/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:83`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PUT `/mantenedores/productos/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:84`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/productos/:id/desactivar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:85`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/productos/:id/reactivar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:86`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PUT `/mantenedores/productos/:id/vinculaciones`
**Ruta:** `Controladores/src/rutas/finanzas.ts:87`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/productos/:id/versiones`
**Ruta:** `Controladores/src/rutas/finanzas.ts:88`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/mantenedores/familias-producto`
**Ruta:** `Controladores/src/rutas/finanzas.ts:89`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/familias-producto`
**Ruta:** `Controladores/src/rutas/finanzas.ts:90`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/mantenedores/familias-producto/:id/historial`
**Ruta:** `Controladores/src/rutas/finanzas.ts:91`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PUT `/mantenedores/familias-producto/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:92`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/familias-producto/:id/desactivar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:93`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/familias-producto/:id/reactivar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:94`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/mantenedores/tareas-fabricacion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:95`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/tareas-fabricacion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:96`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PUT `/mantenedores/tareas-fabricacion/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:97`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/tareas-fabricacion/:id/desactivar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:98`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/tareas-fabricacion/:id/reactivar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:99`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/mantenedores/familias-producto/:id/plantilla-fabricacion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:100`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/mantenedores/familias-producto/:id/plantilla-fabricacion/historial`
**Ruta:** `Controladores/src/rutas/finanzas.ts:101`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PUT `/mantenedores/familias-producto/:id/plantilla-fabricacion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:102`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/mantenedores/familias-producto/:id/plantilla-fabricacion/publicar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:103`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/credito/solicitudes`
**Ruta:** `Controladores/src/rutas/finanzas.ts:104`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/credito/solicitudes/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:105`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/credito/solicitudes/inicial`
**Ruta:** `Controladores/src/rutas/finanzas.ts:106`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/credito/solicitudes/excepcion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:107`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/credito/solicitudes/:id/enviar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:108`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/credito/solicitudes/:id/cancelar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:109`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/credito/solicitudes/:id/resolver-inicial`
**Ruta:** `Controladores/src/rutas/finanzas.ts:110`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/credito/solicitudes/:id/resolver-excepcion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:111`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PUT `/credito/clientes/:id/cupo`
**Ruta:** `Controladores/src/rutas/finanzas.ts:112`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/credito/clientes/:id/suspender`
**Ruta:** `Controladores/src/rutas/finanzas.ts:113`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/credito/clientes/:id/reactivar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:114`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/credito/clientes/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:115`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/credito/clientes/:id/historial`
**Ruta:** `Controladores/src/rutas/finanzas.ts:116`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/credito/clientes/:id/compromisos`
**Ruta:** `Controladores/src/rutas/finanzas.ts:117`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PUT `/credito/configuracion/limite-global`
**Ruta:** `Controladores/src/rutas/finanzas.ts:118`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/credito/exposicion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:119`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/credito/distribucion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:120`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/credito/validar-formalizacion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:121`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/credito/exportar/:origen`
**Ruta:** `Controladores/src/rutas/finanzas.ts:122`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7`
**Ruta:** `Controladores/src/rutas/finanzas.ts:123`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/historico`
**Ruta:** `Controladores/src/rutas/finanzas.ts:124`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/centro-atencion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:125`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/cotizaciones-pendientes`
**Ruta:** `Controladores/src/rutas/finanzas.ts:126`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/clientes/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:127`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/ventas`
**Ruta:** `Controladores/src/rutas/finanzas.ts:128`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/cuentas-cobrar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:129`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/cuentas-pagar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:130`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/liquidez`
**Ruta:** `Controladores/src/rutas/finanzas.ts:131`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/dashboard-m7/liquidez/cuentas-bancarias`
**Ruta:** `Controladores/src/rutas/finanzas.ts:132`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PUT `/dashboard-m7/liquidez/cuentas-bancarias/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:133`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/dashboard-m7/liquidez/saldos-iniciales`
**Ruta:** `Controladores/src/rutas/finanzas.ts:134`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PUT `/dashboard-m7/liquidez/saldos-iniciales/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:135`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/dashboard-m7/proyecciones`
**Ruta:** `Controladores/src/rutas/finanzas.ts:136`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PUT `/dashboard-m7/proyecciones/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:137`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## DELETE `/dashboard-m7/proyecciones/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:138`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/riesgo-deficit`
**Ruta:** `Controladores/src/rutas/finanzas.ts:139`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/dashboard-m7/liquidez/ajustes`
**Ruta:** `Controladores/src/rutas/finanzas.ts:140`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/liquidez/ajustes/catalogos`
**Ruta:** `Controladores/src/rutas/finanzas.ts:141`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/configuracion/umbrales-liquidez`
**Ruta:** `Controladores/src/rutas/finanzas.ts:142`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/dashboard-m7/configuracion/umbrales-liquidez`
**Ruta:** `Controladores/src/rutas/finanzas.ts:143`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/proyectos/exposicion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:144`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/proyectos/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:145`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/margen-proyectos`
**Ruta:** `Controladores/src/rutas/finanzas.ts:146`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/resumen-resultados`
**Ruta:** `Controladores/src/rutas/finanzas.ts:147`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/situacion-financiera`
**Ruta:** `Controladores/src/rutas/finanzas.ts:148`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/operacion/costo-remuneraciones`
**Ruta:** `Controladores/src/rutas/finanzas.ts:149`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/operacion/ordenes-trabajo`
**Ruta:** `Controladores/src/rutas/finanzas.ts:150`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/operacion/produccion-modelos`
**Ruta:** `Controladores/src/rutas/finanzas.ts:151`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/operacion/carga`
**Ruta:** `Controladores/src/rutas/finanzas.ts:152`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/operacion/instalaciones`
**Ruta:** `Controladores/src/rutas/finanzas.ts:153`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/operacion/instalaciones/atrasos`
**Ruta:** `Controladores/src/rutas/finanzas.ts:154`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/operacion/incidencias`
**Ruta:** `Controladores/src/rutas/finanzas.ts:155`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/credito/exposicion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:156`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/credito/alertas`
**Ruta:** `Controladores/src/rutas/finanzas.ts:157`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/tributario/iva`
**Ruta:** `Controladores/src/rutas/finanzas.ts:158`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/costos/fabricacion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:159`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/operacion/bloqueos`
**Ruta:** `Controladores/src/rutas/finanzas.ts:160`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/operacion/instalaciones/margen`
**Ruta:** `Controladores/src/rutas/finanzas.ts:161`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/inventario/valorizado`
**Ruta:** `Controladores/src/rutas/finanzas.ts:162`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/inventario/materiales-proyecto`
**Ruta:** `Controladores/src/rutas/finanzas.ts:163`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/inventario/riesgo-stock`
**Ruta:** `Controladores/src/rutas/finanzas.ts:164`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/inventario/rotacion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:165`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/compras/recepciones`
**Ruta:** `Controladores/src/rutas/finanzas.ts:166`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/configuracion/costos-instalacion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:167`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/dashboard-m7/configuracion/costos-instalacion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:168`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/configuracion/stock-inmovil`
**Ruta:** `Controladores/src/rutas/finanzas.ts:169`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/dashboard-m7/configuracion/stock-inmovil`
**Ruta:** `Controladores/src/rutas/finanzas.ts:170`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/dashboard-m7/pdf`
**Ruta:** `Controladores/src/rutas/finanzas.ts:171`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/dashboard-m7/excel`
**Ruta:** `Controladores/src/rutas/finanzas.ts:172`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard-m7/configuracion/margen-critico`
**Ruta:** `Controladores/src/rutas/finanzas.ts:173`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/dashboard-m7/configuracion/margen-critico`
**Ruta:** `Controladores/src/rutas/finanzas.ts:174`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/terreno/visitas`
**Ruta:** `Controladores/src/rutas/finanzas.ts:175`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/terreno/instalaciones`
**Ruta:** `Controladores/src/rutas/finanzas.ts:176`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/terreno/visitas`
**Ruta:** `Controladores/src/rutas/finanzas.ts:177`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/terreno/obras`
**Ruta:** `Controladores/src/rutas/finanzas.ts:178`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/terreno/usuarios`
**Ruta:** `Controladores/src/rutas/finanzas.ts:179`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/terreno/mis-tareas`
**Ruta:** `Controladores/src/rutas/finanzas.ts:180`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/terreno/tareas/:id/levantamiento`
**Ruta:** `Controladores/src/rutas/finanzas.ts:181`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PUT `/terreno/tareas/:id/levantamiento`
**Ruta:** `Controladores/src/rutas/finanzas.ts:182`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/terreno/tareas/:id/levantamiento/correcciones`
**Ruta:** `Controladores/src/rutas/finanzas.ts:183`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/terreno/tareas/:id/orden-trabajo`
**Ruta:** `Controladores/src/rutas/finanzas.ts:184`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/terreno/ordenes-trabajo`
**Ruta:** `Controladores/src/rutas/finanzas.ts:185`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/terreno/ordenes-trabajo/:ordenId`
**Ruta:** `Controladores/src/rutas/finanzas.ts:186`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PATCH `/terreno/ordenes-trabajo/:ordenId/rectificador`
**Ruta:** `Controladores/src/rutas/finanzas.ts:187`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PUT `/terreno/ordenes-trabajo/:ordenId/rectificacion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:188`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/terreno/ordenes-trabajo/:ordenId/rectificacion/enviar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:189`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/terreno/ordenes-trabajo/:ordenId/rectificacion/aprobar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:190`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/terreno/ordenes-trabajo/:ordenId/rectificacion/devolver`
**Ruta:** `Controladores/src/rutas/finanzas.ts:191`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/terreno/ordenes-trabajo/:ordenId/liberar-produccion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:192`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/terreno/tareas/:id/orden-trabajo/ajustes`
**Ruta:** `Controladores/src/rutas/finanzas.ts:193`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/terreno/tareas/:id/orden-trabajo/:ordenId/liberar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:194`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/terreno/tareas/:id/orden-trabajo/:ordenId/tareas-produccion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:195`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/terreno/ordenes-trabajo/:ordenId/tareas-produccion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:196`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PUT `/terreno/tareas-produccion/:id/asignaciones`
**Ruta:** `Controladores/src/rutas/finanzas.ts:197`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PATCH `/terreno/tareas-produccion/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:198`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/terreno/ordenes-trabajo/:ordenId/etapas-produccion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:199`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/terreno/ordenes-trabajo/:ordenId/tareas-produccion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:200`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/terreno/tareas-produccion/:id/inicio`
**Ruta:** `Controladores/src/rutas/finanzas.ts:201`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/terreno/tareas-produccion/:id/ejecuciones`
**Ruta:** `Controladores/src/rutas/finanzas.ts:202`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/terreno/ejecuciones/pendientes`
**Ruta:** `Controladores/src/rutas/finanzas.ts:203`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PATCH `/terreno/ejecuciones/:id/validacion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:204`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/terreno/tareas-produccion/:id/cierre`
**Ruta:** `Controladores/src/rutas/finanzas.ts:205`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/terreno/ordenes-trabajo/:ordenId/correcciones-tecnicas`
**Ruta:** `Controladores/src/rutas/finanzas.ts:206`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/terreno/ordenes-trabajo/:ordenId/finalizar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:207`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/terreno/visitas/:id/preparacion-salida`
**Ruta:** `Controladores/src/rutas/finanzas.ts:208`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PATCH `/terreno/visitas/:id/preparacion-salida/checklist`
**Ruta:** `Controladores/src/rutas/finanzas.ts:209`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/terreno/visitas/:id/resultado`
**Ruta:** `Controladores/src/rutas/finanzas.ts:210`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/terreno/ejecuciones/:id/incidencias`
**Ruta:** `Controladores/src/rutas/finanzas.ts:211`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/terreno/incidencias`
**Ruta:** `Controladores/src/rutas/finanzas.ts:212`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/terreno/dashboard-operacional`
**Ruta:** `Controladores/src/rutas/finanzas.ts:213`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/terreno/reportes/exportar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:214`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/terreno/incidencias-catalogos`
**Ruta:** `Controladores/src/rutas/finanzas.ts:215`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/terreno/incidencias/:id/evidencias/:evidenciaId`
**Ruta:** `Controladores/src/rutas/finanzas.ts:216`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/terreno/incidencias/:id/evidencias`
**Ruta:** `Controladores/src/rutas/finanzas.ts:217`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PATCH `/terreno/incidencias/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:218`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/terreno/incidencias/:id/aprobar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:219`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/terreno/incidencias/:id/rechazar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:220`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PATCH `/terreno/visitas/:id/responsable`
**Ruta:** `Controladores/src/rutas/finanzas.ts:221`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/terreno/visitas/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:222`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/empleados`
**Ruta:** `Controladores/src/rutas/finanzas.ts:229`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/empleados`
**Ruta:** `Controladores/src/rutas/finanzas.ts:230`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/areas-trabajo`
**Ruta:** `Controladores/src/rutas/finanzas.ts:231`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/areas-trabajo`
**Ruta:** `Controladores/src/rutas/finanzas.ts:232`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PATCH `/areas-trabajo/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:233`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/areas-trabajo/:id/activar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:234`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/areas-trabajo/:id/desactivar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:235`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/areas-trabajo/:id/empleados`
**Ruta:** `Controladores/src/rutas/finanzas.ts:236`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/empleados/catalogos/laborales`
**Ruta:** `Controladores/src/rutas/finanzas.ts:237`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/empleados/catalogos/remuneracionales`
**Ruta:** `Controladores/src/rutas/finanzas.ts:238`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/empleados/catalogos/deducciones`
**Ruta:** `Controladores/src/rutas/finanzas.ts:239`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/empleados/:id/deducciones`
**Ruta:** `Controladores/src/rutas/finanzas.ts:240`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/empleados/:id/deducciones`
**Ruta:** `Controladores/src/rutas/finanzas.ts:241`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PATCH `/empleados/:id/deducciones/:asignacionId/finalizar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:242`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/empleados/catalogos/esquemas`
**Ruta:** `Controladores/src/rutas/finanzas.ts:243`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/empleados/catalogos/haberes`
**Ruta:** `Controladores/src/rutas/finanzas.ts:244`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PATCH `/empleados/:id/datos-base`
**Ruta:** `Controladores/src/rutas/finanzas.ts:245`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/empleados/:id/area-historial`
**Ruta:** `Controladores/src/rutas/finanzas.ts:246`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/empleados/:id/area`
**Ruta:** `Controladores/src/rutas/finanzas.ts:247`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/empleados/:id/relaciones-laborales`
**Ruta:** `Controladores/src/rutas/finanzas.ts:248`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/empleados/:id/relaciones-laborales`
**Ruta:** `Controladores/src/rutas/finanzas.ts:249`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PATCH `/empleados/:id/relaciones-laborales/:relacionId`
**Ruta:** `Controladores/src/rutas/finanzas.ts:250`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/empleados/:id/perfil-remuneracional`
**Ruta:** `Controladores/src/rutas/finanzas.ts:251`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/empleados/:id/historial-remuneracional`
**Ruta:** `Controladores/src/rutas/finanzas.ts:252`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PATCH `/empleados/:id/perfil-remuneracional`
**Ruta:** `Controladores/src/rutas/finanzas.ts:253`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/empleados/:id/esquemas`
**Ruta:** `Controladores/src/rutas/finanzas.ts:254`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/empleados/:id/esquemas`
**Ruta:** `Controladores/src/rutas/finanzas.ts:255`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PATCH `/empleados/:id/esquemas/:asignacionId/finalizar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:256`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/empleados/:id/haberes`
**Ruta:** `Controladores/src/rutas/finanzas.ts:257`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/empleados/:id/haberes`
**Ruta:** `Controladores/src/rutas/finanzas.ts:258`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PATCH `/empleados/:id/haberes/:asignacionId/finalizar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:259`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/empleados/:id/configuracion-documental`
**Ruta:** `Controladores/src/rutas/finanzas.ts:260`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PATCH `/empleados/:id/configuracion-documental`
**Ruta:** `Controladores/src/rutas/finanzas.ts:261`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/empleados/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:262`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/esquemas-remuneracionales`
**Ruta:** `Controladores/src/rutas/finanzas.ts:263`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/esquemas-remuneracionales`
**Ruta:** `Controladores/src/rutas/finanzas.ts:264`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/esquemas-remuneracionales/catalogos/cargos`
**Ruta:** `Controladores/src/rutas/finanzas.ts:265`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PATCH `/esquemas-remuneracionales/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:266`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/esquemas-remuneracionales/:id/cargos`
**Ruta:** `Controladores/src/rutas/finanzas.ts:267`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/esquemas-remuneracionales/:id/tarifas`
**Ruta:** `Controladores/src/rutas/finanzas.ts:268`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/esquemas-remuneracionales/:id/tarifas`
**Ruta:** `Controladores/src/rutas/finanzas.ts:269`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/esquemas-remuneracionales/:id/tarifas/:tarifaId/revisar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:270`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/haberes`
**Ruta:** `Controladores/src/rutas/finanzas.ts:271`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/haberes`
**Ruta:** `Controladores/src/rutas/finanzas.ts:272`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PATCH `/haberes/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:273`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/haberes/:id/configuraciones`
**Ruta:** `Controladores/src/rutas/finanzas.ts:274`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/haberes/:id/configuracion-efectiva`
**Ruta:** `Controladores/src/rutas/finanzas.ts:275`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/parametros-remuneracionales/efectivo`
**Ruta:** `Controladores/src/rutas/finanzas.ts:276`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/parametros-remuneracionales`
**Ruta:** `Controladores/src/rutas/finanzas.ts:277`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/parametros-remuneracionales`
**Ruta:** `Controladores/src/rutas/finanzas.ts:278`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PATCH `/parametros-remuneracionales/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:279`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/tramos-impuesto-renta`
**Ruta:** `Controladores/src/rutas/finanzas.ts:280`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/tramos-impuesto-renta`
**Ruta:** `Controladores/src/rutas/finanzas.ts:281`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/conceptos-deduccion-aporte`
**Ruta:** `Controladores/src/rutas/finanzas.ts:282`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/conceptos-deduccion-aporte`
**Ruta:** `Controladores/src/rutas/finanzas.ts:283`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PATCH `/conceptos-deduccion-aporte/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:284`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/configuracion-prorrateo`
**Ruta:** `Controladores/src/rutas/finanzas.ts:285`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/configuracion-prorrateo`
**Ruta:** `Controladores/src/rutas/finanzas.ts:286`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/politica-conservacion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:287`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/politica-conservacion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:288`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/medios-pago-remuneraciones`
**Ruta:** `Controladores/src/rutas/finanzas.ts:289`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/medios-pago-remuneraciones`
**Ruta:** `Controladores/src/rutas/finanzas.ts:290`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PATCH `/medios-pago-remuneraciones/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:291`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/hechos-remunerables`
**Ruta:** `Controladores/src/rutas/finanzas.ts:292`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/hechos-remunerables/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:293`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/hechos-remunerables/:id/tratamiento`
**Ruta:** `Controladores/src/rutas/finanzas.ts:294`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/retrabajos-pendientes`
**Ruta:** `Controladores/src/rutas/finanzas.ts:295`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/retrabajos/:id/resolucion-remuneracional`
**Ruta:** `Controladores/src/rutas/finanzas.ts:296`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/remuneraciones/contexto`
**Ruta:** `Controladores/src/rutas/finanzas.ts:297`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/remuneraciones/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:298`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/remuneraciones/:id/componentes-excepcionales`
**Ruta:** `Controladores/src/rutas/finanzas.ts:299`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/componentes-remuneracion/:id/resolver-excepcional`
**Ruta:** `Controladores/src/rutas/finanzas.ts:300`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/remuneraciones/:id/variables`
**Ruta:** `Controladores/src/rutas/finanzas.ts:301`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/componentes-remuneracion/:id/resolver-variable`
**Ruta:** `Controladores/src/rutas/finanzas.ts:302`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/remuneraciones/:id/valores-externos`
**Ruta:** `Controladores/src/rutas/finanzas.ts:303`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/remuneraciones/:id/ajustes`
**Ruta:** `Controladores/src/rutas/finanzas.ts:304`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/componentes-remuneracion/:id/resolver-valor`
**Ruta:** `Controladores/src/rutas/finanzas.ts:305`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/remuneraciones/:id/prorrateo`
**Ruta:** `Controladores/src/rutas/finanzas.ts:306`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/remuneraciones/:id/prorrateo`
**Ruta:** `Controladores/src/rutas/finanzas.ts:307`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/componentes-remuneracion/:id/resolver-prorrateo`
**Ruta:** `Controladores/src/rutas/finanzas.ts:308`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/periodos-remuneracion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:309`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/remuneraciones/calcular`
**Ruta:** `Controladores/src/rutas/finanzas.ts:310`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/remuneraciones/:id/cerrar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:311`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/remuneraciones/:id/liquidacion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:312`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/periodos-remuneracion/cerrar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:313`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/remuneraciones/:id/reapertura`
**Ruta:** `Controladores/src/rutas/finanzas.ts:314`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/remuneraciones/:id/reapertura/aprobar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:315`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/remuneraciones/:id/ajustes-posteriores`
**Ruta:** `Controladores/src/rutas/finanzas.ts:316`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/ajustes-posteriores/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:317`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/ajustes-posteriores/:id/postergar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:318`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/ajustes-posteriores/:id/regularizacion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:319`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/regularizaciones-remuneracion/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:320`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PATCH `/regularizaciones-remuneracion/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:321`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/regularizaciones-remuneracion/:id/cerrar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:322`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/anticipos-remuneracion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:323`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/anticipos-remuneracion/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:324`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/anticipos-remuneracion/:id/pagos`
**Ruta:** `Controladores/src/rutas/finanzas.ts:325`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PATCH `/pagos-remuneracion/anticipos/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:326`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/pagos-remuneracion/anticipos/:id/confirmar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:327`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/pagos-remuneracion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:328`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/pagos-remuneracion/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:329`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/pagos-remuneracion/finales`
**Ruta:** `Controladores/src/rutas/finanzas.ts:330`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PATCH `/pagos-remuneracion/finales/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:331`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/pagos-remuneracion/finales/:id/confirmar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:332`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/boletas-honorarios/confirmadas`
**Ruta:** `Controladores/src/rutas/finanzas.ts:333`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/boletas-honorarios/prestadores`
**Ruta:** `Controladores/src/rutas/finanzas.ts:334`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/boletas-honorarios/prestadores`
**Ruta:** `Controladores/src/rutas/finanzas.ts:335`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/boletas-honorarios/retenciones-mensuales`
**Ruta:** `Controladores/src/rutas/finanzas.ts:336`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/boletas-honorarios`
**Ruta:** `Controladores/src/rutas/finanzas.ts:337`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/boletas-honorarios`
**Ruta:** `Controladores/src/rutas/finanzas.ts:338`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/boletas-honorarios/:id/calculo-confirmacion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:339`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/boletas-honorarios/:id/confirmar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:340`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/boletas-honorarios/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:341`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PATCH `/boletas-honorarios/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:342`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/boletas-honorarios/:id/pagos`
**Ruta:** `Controladores/src/rutas/finanzas.ts:343`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PATCH `/pagos-remuneracion/honorarios/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:344`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/pagos-remuneracion/honorarios/:id/confirmar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:345`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/pagos-remuneracion/:id/detalle`
**Ruta:** `Controladores/src/rutas/finanzas.ts:346`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/pagos-remuneracion/:id/anular`
**Ruta:** `Controladores/src/rutas/finanzas.ts:347`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/pagos-remuneracion/:id/reversiones`
**Ruta:** `Controladores/src/rutas/finanzas.ts:348`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/documentos-remuneracion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:349`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/documentos-remuneracion/entregas`
**Ruta:** `Controladores/src/rutas/finanzas.ts:350`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/documentos-remuneracion/:tipo/:id/entrega`
**Ruta:** `Controladores/src/rutas/finanzas.ts:351`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/documentos-remuneracion/:tipo/:id/descarga`
**Ruta:** `Controladores/src/rutas/finanzas.ts:352`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/documentos-remuneracion/:tipo/:id/reenviar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:353`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/remuneraciones/:id/exportacion-preliminar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:354`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/periodos-remuneracion/exportacion-oficial`
**Ruta:** `Controladores/src/rutas/finanzas.ts:355`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/proveedores/catalogos`
**Ruta:** `Controladores/src/rutas/finanzas.ts:356`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/proveedores`
**Ruta:** `Controladores/src/rutas/finanzas.ts:357`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/proveedores`
**Ruta:** `Controladores/src/rutas/finanzas.ts:358`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PUT `/proveedores/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:359`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/proveedores/:id/corregir-identidad`
**Ruta:** `Controladores/src/rutas/finanzas.ts:360`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/proveedores/:id/desactivar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:361`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/proveedores/:id/reactivar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:362`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PUT `/proveedores/:id/condicion-pago`
**Ruta:** `Controladores/src/rutas/finanzas.ts:363`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/proveedores/:id/saldos-favor`
**Ruta:** `Controladores/src/rutas/finanzas.ts:364`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/proveedores/:id/compensaciones/propuesta`
**Ruta:** `Controladores/src/rutas/finanzas.ts:365`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/proveedores/:id/compensaciones`
**Ruta:** `Controladores/src/rutas/finanzas.ts:366`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/proveedores/:id/compensaciones`
**Ruta:** `Controladores/src/rutas/finanzas.ts:367`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/proveedores/:id/ficha`
**Ruta:** `Controladores/src/rutas/finanzas.ts:368`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/ordenes-compra-servicios`
**Ruta:** `Controladores/src/rutas/finanzas.ts:369`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/ordenes-compra-servicios/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:370`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/ordenes-compra-servicios`
**Ruta:** `Controladores/src/rutas/finanzas.ts:371`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PUT `/ordenes-compra-servicios/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:372`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/ordenes-compra-servicios/:id/ajustes`
**Ruta:** `Controladores/src/rutas/finanzas.ts:373`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/ordenes-compra-servicios/:id/ajustes/:ajusteId/confirmar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:374`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/ordenes-compra-servicios/:id/anular`
**Ruta:** `Controladores/src/rutas/finanzas.ts:375`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/ordenes-compra-servicios/:id/cerrar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:376`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/ordenes-compra-servicios/:id/reabrir`
**Ruta:** `Controladores/src/rutas/finanzas.ts:377`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/documentos-proveedor`
**Ruta:** `Controladores/src/rutas/finanzas.ts:378`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/documentos-proveedor-catalogos`
**Ruta:** `Controladores/src/rutas/finanzas.ts:379`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/documentos-proveedor/preliminares`
**Ruta:** `Controladores/src/rutas/finanzas.ts:380`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/documentos-proveedor/definitivos`
**Ruta:** `Controladores/src/rutas/finanzas.ts:381`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/documentos-proveedor/notas-credito`
**Ruta:** `Controladores/src/rutas/finanzas.ts:382`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/documentos-proveedor/notas-debito`
**Ruta:** `Controladores/src/rutas/finanzas.ts:383`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/documentos-proveedor/ajustes/:id/anular`
**Ruta:** `Controladores/src/rutas/finanzas.ts:384`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/documentos-proveedor/:id/reclasificaciones`
**Ruta:** `Controladores/src/rutas/finanzas.ts:385`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/documentos-proveedor/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:386`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/documentos-proveedor/:id/asociaciones`
**Ruta:** `Controladores/src/rutas/finanzas.ts:387`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PUT `/documentos-proveedor/:id/diferencias/:asociacionId`
**Ruta:** `Controladores/src/rutas/finanzas.ts:388`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/documentos-proveedor/:id/diferencias/:asociacionId/aprobar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:389`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PUT `/documentos-proveedor/:id/vencimiento`
**Ruta:** `Controladores/src/rutas/finanzas.ts:390`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PUT `/documentos-proveedor/:id/clasificacion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:391`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/documentos-proveedor/:id/imputacion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:392`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/documentos-proveedor/:id/imputacion/:propuestaId/confirmar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:393`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/documentos-proveedor/:id/tipo-cambio-manual`
**Ruta:** `Controladores/src/rutas/finanzas.ts:394`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/documentos-proveedor/:id/generar-obligacion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:395`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/cuentas-por-pagar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:396`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/configuracion/umbral-por-vencer-proveedores`
**Ruta:** `Controladores/src/rutas/finanzas.ts:397`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PUT `/configuracion/umbral-por-vencer-proveedores`
**Ruta:** `Controladores/src/rutas/finanzas.ts:398`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/pagos-proveedores/proveedores`
**Ruta:** `Controladores/src/rutas/finanzas.ts:399`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/pagos-proveedores/catalogos`
**Ruta:** `Controladores/src/rutas/finanzas.ts:400`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/pagos-proveedores/borradores`
**Ruta:** `Controladores/src/rutas/finanzas.ts:401`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/pagos-proveedores/confirmados`
**Ruta:** `Controladores/src/rutas/finanzas.ts:402`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/pagos-proveedores`
**Ruta:** `Controladores/src/rutas/finanzas.ts:403`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/pagos-proveedores/:id/detalle`
**Ruta:** `Controladores/src/rutas/finanzas.ts:404`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/pagos-proveedores/:id/anular`
**Ruta:** `Controladores/src/rutas/finanzas.ts:405`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/pagos-proveedores/:id/movimientos/:movimientoId/anular`
**Ruta:** `Controladores/src/rutas/finanzas.ts:406`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/pagos-proveedores/:id/movimientos/:movimientoId/reversas`
**Ruta:** `Controladores/src/rutas/finanzas.ts:407`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/pagos-proveedores/:id/movimientos/:movimientoId/conciliar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:408`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/pagos-proveedores/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:409`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/pagos-proveedores/:id/movimientos`
**Ruta:** `Controladores/src/rutas/finanzas.ts:410`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PUT `/pagos-proveedores/:id/movimientos/:movimientoId`
**Ruta:** `Controladores/src/rutas/finanzas.ts:411`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/pagos-proveedores/:id/respaldos`
**Ruta:** `Controladores/src/rutas/finanzas.ts:412`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/pagos-proveedores/:id/respaldos/:respaldoId/reemplazar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:413`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/compensaciones/:id/reversas`
**Ruta:** `Controladores/src/rutas/finanzas.ts:414`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/categorias-egreso`
**Ruta:** `Controladores/src/rutas/finanzas.ts:415`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/categorias-egreso`
**Ruta:** `Controladores/src/rutas/finanzas.ts:416`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PUT `/categorias-egreso/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:417`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/categorias-egreso/:id/activar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:418`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/categorias-egreso/:id/desactivar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:419`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/reclasificaciones/:id/aprobar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:420`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/reclasificaciones/:id/rechazar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:421`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/reclasificaciones`
**Ruta:** `Controladores/src/rutas/finanzas.ts:422`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/configuracion/umbral-reclasificacion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:423`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PUT `/configuracion/umbral-reclasificacion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:424`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PUT `/imputaciones/:id/orden-trabajo`
**Ruta:** `Controladores/src/rutas/finanzas.ts:425`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/imputaciones/:id/reasignaciones`
**Ruta:** `Controladores/src/rutas/finanzas.ts:426`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/reasignaciones-costo`
**Ruta:** `Controladores/src/rutas/finanzas.ts:427`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/reasignaciones-costo/:id/aprobar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:428`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/reasignaciones-costo/:id/rechazar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:429`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/pagos-proveedores/:id/comisiones`
**Ruta:** `Controladores/src/rutas/finanzas.ts:430`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/envios-importaciones`
**Ruta:** `Controladores/src/rutas/finanzas.ts:431`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/envios-importaciones`
**Ruta:** `Controladores/src/rutas/finanzas.ts:432`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/envios-importaciones/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:433`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/envios-importaciones/:id/ordenes-compra`
**Ruta:** `Controladores/src/rutas/finanzas.ts:434`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/envios-importaciones/:id/costos`
**Ruta:** `Controladores/src/rutas/finanzas.ts:435`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PUT `/envios-importaciones/:id/costos/:costoId`
**Ruta:** `Controladores/src/rutas/finanzas.ts:436`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/envios-importaciones/:id/pasar-revision`
**Ruta:** `Controladores/src/rutas/finanzas.ts:437`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/envios-importaciones/:id/cerrar-financieramente`
**Ruta:** `Controladores/src/rutas/finanzas.ts:438`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/envios-importaciones/:id/reabrir`
**Ruta:** `Controladores/src/rutas/finanzas.ts:439`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/caja-chica`
**Ruta:** `Controladores/src/rutas/finanzas.ts:440`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/caja-chica/:gastoId`
**Ruta:** `Controladores/src/rutas/finanzas.ts:441`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PUT `/caja-chica/fondo/:periodo`
**Ruta:** `Controladores/src/rutas/finanzas.ts:442`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/caja-chica/gastos`
**Ruta:** `Controladores/src/rutas/finanzas.ts:443`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/caja-chica/gastos/:gastoId/respaldo`
**Ruta:** `Controladores/src/rutas/finanzas.ts:444`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/caja-chica/gastos/:gastoId/aprobar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:445`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/caja-chica/gastos/:gastoId/rechazar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:446`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/pagos-proveedores/:id/movimientos/:movimientoId/tipo-cambio-manual`
**Ruta:** `Controladores/src/rutas/finanzas.ts:447`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/pagos-proveedores/:id/preparar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:448`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/pagos-proveedores/:id/guardar-borrador`
**Ruta:** `Controladores/src/rutas/finanzas.ts:449`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/pagos-proveedores/:id/retomar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:450`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/pagos-proveedores/:id/descartar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:451`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/pagos-proveedores/:id/confirmar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:452`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/dashboard/stats`
**Ruta:** `Controladores/src/rutas/finanzas.ts:453`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/billing/inventory`
**Ruta:** `Controladores/src/rutas/finanzas.ts:454`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/billing/products`
**Ruta:** `Controladores/src/rutas/finanzas.ts:455`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/monedas`
**Ruta:** `Controladores/src/rutas/finanzas.ts:456`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/billing/pending-approvals`
**Ruta:** `Controladores/src/rutas/finanzas.ts:457`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/billing/history`
**Ruta:** `Controladores/src/rutas/finanzas.ts:458`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/billing/quotes`
**Ruta:** `Controladores/src/rutas/finanzas.ts:459`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PUT `/billing/quotes/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:460`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/billing/quotes/cliente`
**Ruta:** `Controladores/src/rutas/finanzas.ts:461`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/billing/quotes/obras/buscar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:462`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/billing/quotes/obras`
**Ruta:** `Controladores/src/rutas/finanzas.ts:463`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PUT `/billing/quotes/:id/obra`
**Ruta:** `Controladores/src/rutas/finanzas.ts:464`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/billing/quotes/:id/emitir`
**Ruta:** `Controladores/src/rutas/finanzas.ts:465`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/billing/quotes/:id/preview-pdf`
**Ruta:** `Controladores/src/rutas/finanzas.ts:466`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/billing/quotes/:id/documentos`
**Ruta:** `Controladores/src/rutas/finanzas.ts:467`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/billing/quotes/:id/documentos/:versionId/descarga`
**Ruta:** `Controladores/src/rutas/finanzas.ts:468`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/billing/quotes/:id/alternativas/seleccionar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:469`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/billing/quotes/:id/alternativas/aceptar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:470`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/billing/quotes/:id/alternativas/rechazar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:471`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/billing/quotes/:id/reactivar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:472`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/billing/quotes/:id/approve`
**Ruta:** `Controladores/src/rutas/finanzas.ts:473`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/billing/quotes/:id/accept-b2b`
**Ruta:** `Controladores/src/rutas/finanzas.ts:474`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/billing/quotes/:id/work-order-planning`
**Ruta:** `Controladores/src/rutas/finanzas.ts:475`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/billing/quotes/:id/reject`
**Ruta:** `Controladores/src/rutas/finanzas.ts:476`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/billing/nota-venta`
**Ruta:** `Controladores/src/rutas/finanzas.ts:477`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/billing/nota-venta/:id/approve`
**Ruta:** `Controladores/src/rutas/finanzas.ts:478`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/billing/documents`
**Ruta:** `Controladores/src/rutas/finanzas.ts:480`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PUT `/billing/guides/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:481`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## PUT `/billing/nota-venta/:id/condiciones-cobro`
**Ruta:** `Controladores/src/rutas/finanzas.ts:482`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/billing/configuracion/umbral`
**Ruta:** `Controladores/src/rutas/finanzas.ts:483`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/billing/configuracion/umbral`
**Ruta:** `Controladores/src/rutas/finanzas.ts:484`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/billing/exchange-rate/:currency`
**Ruta:** `Controladores/src/rutas/finanzas.ts:485`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/pagos/catalogos`
**Ruta:** `Controladores/src/rutas/finanzas.ts:486`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/pagos/contexto/:idFicha`
**Ruta:** `Controladores/src/rutas/finanzas.ts:487`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/pagos/:id`
**Ruta:** `Controladores/src/rutas/finanzas.ts:488`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/pagos/:id/anular`
**Ruta:** `Controladores/src/rutas/finanzas.ts:489`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/pagos/:id/revertir`
**Ruta:** `Controladores/src/rutas/finanzas.ts:490`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/pagos/:id/conciliar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:491`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/pagos/:id/morosidad`
**Ruta:** `Controladores/src/rutas/finanzas.ts:492`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/pagos/:id/comprobante`
**Ruta:** `Controladores/src/rutas/finanzas.ts:493`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/saldos-favor/:id/aplicar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:494`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/notas-venta/:id/saldo`
**Ruta:** `Controladores/src/rutas/finanzas.ts:495`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/seguridad/login`
**Ruta:** `Controladores/src/rutas/finanzas.ts:496`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/seguridad/recuperacion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:497`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/seguridad/recuperacion/validar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:498`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/seguridad/recuperacion/confirmar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:499`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/seguridad/sesion`
**Ruta:** `Controladores/src/rutas/finanzas.ts:500`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/seguridad/salir`
**Ruta:** `Controladores/src/rutas/finanzas.ts:501`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/seguridad/clave`
**Ruta:** `Controladores/src/rutas/finanzas.ts:502`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/usuarios`
**Ruta:** `Controladores/src/rutas/finanzas.ts:503`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/usuarios/catalogos`
**Ruta:** `Controladores/src/rutas/finanzas.ts:504`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/usuarios`
**Ruta:** `Controladores/src/rutas/finanzas.ts:505`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## GET `/sesiones`
**Ruta:** `Controladores/src/rutas/finanzas.ts:508`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/sesiones/cerrar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:509`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/cotizaciones/:id/consolidar-b2c`
**Ruta:** `Controladores/src/rutas/finanzas.ts:510`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/notas-venta/:id/etapas-cobro`
**Ruta:** `Controladores/src/rutas/finanzas.ts:511`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/clientes/formalizar`
**Ruta:** `Controladores/src/rutas/finanzas.ts:512`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/notas-venta/:id/revertir`
**Ruta:** `Controladores/src/rutas/finanzas.ts:513`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.
## POST `/pagos`
**Ruta:** `Controladores/src/rutas/finanzas.ts:514`.
**Permiso detectado:** NO CONFIRMADO por patron; revisar middleware/fachada.
**Controlador/fachada:** NO CONFIRMADO por patron.
**Body/query/response:** consultar tipos y llamada exacta en la linea indicada; no inferir campos que no aparezcan en el codigo.
**Errores:** autenticacion, autorizacion, validacion, conflicto, inexistencia y fallos internos segun ErrorAplicacion.
**Auditoria:** verificar productor M9 del caso de uso; ausencia en esta ficha automatica no confirma ausencia funcional.

## Fuentes de verdad consultadas
- `Controladores/prisma/schema.prisma`
- `Controladores/pruebas`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/rutas/finanzas.ts`
- `Vistas/src`
- `Vistas/src/App.tsx`
