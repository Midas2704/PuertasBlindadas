# Núcleo documental portable — Bloque 4.2

## Estado y alcance

**Implementado:** modelos de metadatos, migración incremental, máquina de estados, validaciones, repositorio Prisma, asociación documental con productos, outbox técnico y contratos TypeScript.

**Preparado:** inyección futura de un adaptador de almacenamiento, autorización con un actor M4, publicación posterior de eventos funcionales hacia M9 y procesamiento asíncrono del outbox.

**Pendiente:** R2/S3, transferencia de bytes, URLs firmadas, multipart real, antivirus, miniaturas, endpoints, interfaz, permisos nuevos, migración histórica, retención WORM y borrado físico.

No existe en este bloque ningún cliente de almacenamiento ni comportamiento exitoso simulado.

## 1. Estructura

```text
src/documental/
├── ServicioDocumental.ts
├── StorageAdapter.ts
├── estados.ts
├── tipos.ts
├── validaciones.ts
└── repositorios/
    └── RepositorioDocumentalPrisma.ts
```

Los controladores M1–M9 continúan siendo propietarios de las reglas comerciales. `ServicioDocumental` es una fachada técnica de metadatos y no fue incorporada a rutas HTTP.

## 2. Modelos Prisma

- `documento_logico`: identidad conceptual, clasificación, estado, condición histórica, revisión optimista y referencia opcional a la configuración de conservación existente.
- `version_documento`: metadatos de cada objeto, número correlativo, hash, tamaño, MIME y reemplazo. No contiene bytes ni URLs.
- `variante_documento`: relación entre original y derivado.
- `intencion_carga_documental`: operación idempotente pendiente, con UUID público y clave temporal opaca.
- `producto_comercial_documento`: FK real a `extension_producto_comercial` y a `documento_logico`.
- `evento_operacional_documental`: outbox técnico durable.

`configuracion_conservacion_documental` fue reutilizada. Sus criterios siguen siendo descriptivos; el núcleo sólo acepta una referencia cuando la fila está `configurada` y vigente. No ejecuta retención.

## 3. Relaciones

```text
configuracion_conservacion_documental 0..1 ── * documento_logico
usuario 1 ── * documento_logico
documento_logico 1 ── * version_documento
version_documento 0..1 ── 0..1 version_documento reemplazada
version_documento 1 ── * variante_documento * ── 1 version_documento derivada
extension_producto_comercial 1 ── * producto_comercial_documento * ── 1 documento_logico
documento_logico/version_documento 0..1 ── * evento_operacional_documental
```

No se añadió ninguna asociación genérica `tipo_entidad/id_entidad`.

## 4. Estados y transiciones

Documento lógico:

- `ACTIVO → INACTIVO | ARCHIVADO`
- `INACTIVO → ACTIVO | ARCHIVADO`
- `ARCHIVADO` es final.

Versión:

- `PENDIENTE → SUBIENDO | ERROR`
- `SUBIENDO → VALIDANDO | ERROR`
- `VALIDANDO → DISPONIBLE | ERROR | CUARENTENA`
- `ERROR → PENDIENTE`
- `CUARENTENA → VALIDANDO | ARCHIVADO`
- `DISPONIBLE → REEMPLAZADO | ARCHIVADO`
- `REEMPLAZADO → ARCHIVADO`

Intención:

- `PENDIENTE → SUBIENDO | ERROR | CANCELADA | EXPIRADA`
- `SUBIENDO → VALIDANDO | ERROR | CANCELADA | EXPIRADA`
- `VALIDANDO → DISPONIBLE | ERROR | CUARENTENA`
- `ERROR → PENDIENTE`
- `CUARENTENA → VALIDANDO`

La lógica TypeScript y triggers SQL rechazan transiciones arbitrarias. `DISPONIBLE` no vuelve a `PENDIENTE`.

## 5. Contratos TypeScript

`StorageAdapter` declara capacidades en forma explícita. Operaciones no universales como stream, firma, multipart, copia, listado incompleto o eliminación permitida son opcionales. El consumidor debe comprobar `capacidades` y la presencia del método.

El contrato diferencia referencia lógica, integridad, URL temporal y errores normalizados. Un ETag es informativo y nunca sustituye SHA-256.

No existe implementación R2 o S3 en 4.2 y no se instaló AWS SDK.

## 6. Repositorio

`RepositorioDocumentalPrisma` implementa:

- creación y consulta de documentos;
- creación idempotente y transición de intenciones;
- versión correlativa bajo bloqueo del documento;
- transición optimista por `revision`;
- variante y asociación con producto;
- consulta de asociaciones;
- alta idempotente y transición del outbox.

Operaciones compuestas usan transacciones `Serializable`. Los conflictos serializables se reintentan de forma acotada.

## 7. Idempotencia

Una intención es única por `(usuario_solicitante, clave_idempotencia)`. Repetir exactamente la misma solicitud devuelve la fila existente. Reutilizar la clave con otros metadatos produce conflicto.

El outbox tiene `clave_idempotencia` única y devuelve el evento existente ante repetición. No escribe directamente en M9.

## 8. Integridad histórica

Una versión disponible requiere SHA-256, MIME detectado y fecha de validación. Un trigger impide cambiar los metadatos que identifican los bytes de versiones disponibles, reemplazadas o archivadas.

Los originales no se sobrescriben. Un reemplazo apunta a una versión anterior del mismo documento. Las variantes tienen objetos independientes y un trigger impide ciclos.

No se implementó borrado físico ni expiración de originales.

## 9. Outbox

El outbox prepara tareas de confirmación, validación, antivirus, variantes, reconciliación y publicación posterior hacia M9. Sus estados son `PENDIENTE`, `PROCESANDO`, `PROCESADO`, `ERROR` y `DESCARTADO`.

No hay worker en 4.2. M9 conserva la responsabilidad sobre auditoría funcional; el outbox no es un segundo sistema de auditoría.

## 10. Portabilidad

PostgreSQL conserva proveedor lógico, contenedor y clave opaca. No guarda dominio, IP, ruta Clouding, URL pública ni credenciales. Los módulos no conocen R2 ni S3.

R2 y S3 se implementarán como adaptadores distintos en 4.3. El versionamiento de aplicación funciona aunque el proveedor no implemente versionado S3.

## 11. Configuración futura

4.3 deberá inyectar configuración segura por ambiente: proveedor, contenedor, región y endpoint. En AWS se priorizará IAM role. Ninguna credencial se incorporará al código o PostgreSQL.

## 12. Limitaciones actuales

- No se transfieren ni recuperan bytes.
- Una intención no implica que exista un objeto.
- `DISPONIBLE` sólo puede utilizarse por código interno con metadatos completos; no hay endpoint que lo exponga.
- No hay análisis real de MIME, antivirus o imágenes.
- No hay limpieza automática de temporales o huérfanos.
- No se migraron base64, BYTEA ni documentos generados existentes.

## 13. Riesgos pendientes

Faltan decisiones de retención, WORM, legal hold, autoridad de borrado, región AWS, SSE-KMS, RPO/RTO, antivirus y límites por clase documental. No se asignaron valores por defecto que pudieran interpretarse como decisiones empresariales.

## 14. Pruebas

Las pruebas focales combinan:

- pruebas unitarias de estados y validadores;
- pruebas reales contra PostgreSQL local para FK, unique constraints, triggers, concurrencia, idempotencia y transacciones;
- comprobaciones negativas de que no existen rutas, permisos o secretos nuevos.

Las pruebas con base de datos crean datos identificables de prueba y los eliminan al finalizar.

## 15. Activación posterior

4.3 implementará el adaptador S3-compatible y las pruebas contractuales R2/S3 sin exponer todavía archivos inseguros. 4.4 incorporará autorización M4, MIME real, SHA-256 calculado por proceso confiable, antivirus, cuarentena, outbox worker, reconciliación y productores M9. Sólo después deberán crearse endpoints e interfaz de productos.
