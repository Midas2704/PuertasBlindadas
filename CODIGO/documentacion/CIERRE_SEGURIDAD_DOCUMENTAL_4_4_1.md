# Bloque 4.4.1 — Cierre de seguridad documental

## Resultado de la auditoría

Se confirmaron tres brechas reales del Bloque 4.4:

1. la intención identificaba actor y clasificación, pero no persistía el documento lógico de destino;
2. integridad y antivirus leían el temporal antes de copiarlo, por lo que una reutilización del PUT podía cambiar los bytes entre controles;
3. el lease del outbox no identificaba al worker propietario y otro proceso podía intentar confirmar el evento.

También se confirmó una debilidad de defensa en profundidad: la detección MIME comprobaba firmas mínimas, no estructura suficiente. No se encontraron endpoints documentales públicos ni permisos nuevos concedidos.

## Correcciones implementadas

### Intención y documento

La migración `056_cierre_seguridad_documental` agrega `id_documento_logico` nullable para conservar filas históricas, con FK `RESTRICT` e índice por documento/estado. La migración `057_intencion_documental_documento_obligatorio` agrega un `CHECK NOT VALID`: no invalida posibles filas heredadas, pero impide que cualquier escritura nueva omita el documento incluso si no pasa por el repositorio. Todas las intenciones nuevas lo exigen además en el contrato y el repositorio valida:

- documento existente y activo;
- clasificación idéntica;
- actor solicitante;
- idempotencia incluyendo documento;
- confirmación sólo contra el documento persistido.

Una intención histórica sin vínculo queda explícitamente no confirmable. No se infiere ni rellena su destino.

### Bytes escaneados y promovidos

El temporal `tmp/<uuid>` se copia primero a la clave estable `quarantine/<uuid>` usando el ETag únicamente como precondición de concurrencia, nunca como hash. Integridad y antivirus leen esa copia de trabajo.

`escanearConIntegridad` calcula SHA-256 y tamaño sobre el mismo stream consumido por el antivirus. Si el motor no consume todo el stream, el resultado `LIMPIO` se invalida. Antes de promover se comprueba que la copia de trabajo conserva tamaño y token de concurrencia. La promoción a `objects/<uuid>` usa `CopySourceIfMatch` y después relee el destino para comparar SHA-256 con los bytes escaneados.

Un cambio del temporal durante la copia, de la copia de trabajo durante el análisis o del destino final se detecta y falla cerrado. El temporal original no se modifica. Los reintentos recuperan la copia de trabajo y el objeto final ya creado sin requerir una nueva carga.

### Antivirus

El adaptador clamd mantiene `INSTREAM`, chunks con backpressure, timeout y límite. La respuesta del daemon se limita a 4 KiB, la firma se normaliza y los errores de socket no conservan host, URL ni mensajes internos. Timeout, interrupción, respuesta inesperada o stream incompleto nunca producen `LIMPIO`.

Las pruebas usan un socket simulado. Sigue pendiente una ejecución contra clamd local aislado y una muestra EICAR controlada; no se instaló ni conectó un motor real.

### MIME

La validación reforzada exige:

- JPEG: SOI, marcador SOF y EOI final;
- PNG: firma, `IHDR` inicial de longitud 13 e `IEND` final;
- WebP: RIFF con longitud exacta y chunk `VP8`, `VP8L` o `VP8X`;
- PDF: versión admitida, `startxref`, `%%EOF` final y ausencia de acciones activas conocidas.

También rechaza HTML, scripts y PHP embebidos detectables. Esto sigue siendo validación estructural acotada, no decodificación completa de imágenes ni parser PDF exhaustivo. El antivirus continúa siendo obligatorio.

### Descargas

La autorización recibe actor backend y metadatos completos de la versión, incluido documento lógico, para resolver entidad y alcance. Se verifica que el proveedor persistido coincida con el adaptador activo. Sólo se firma una versión `DISPONIBLE`, con SHA-256, MIME y antivirus `LIMPIO`.

`Content-Disposition`, `Content-Type` y `Cache-Control` se incorporan como parámetros firmados de la respuesta del proveedor. `X-Content-Type-Options: nosniff` queda identificado como header que deberá aplicar el futuro endpoint; no se presenta como header aplicado por S3/R2.

### Outbox

La migración agrega `lease_token` y `lease_hasta`. El claim usa `FOR UPDATE SKIP LOCKED`, token UUID y expiración. Sólo el worker con token vigente puede marcar `PROCESADO` o `ERROR`. Un lease vencido puede reclamarse con token nuevo; el anterior queda rechazado. Eventos `PROCESANDO` anteriores a la migración pasan a `ERROR` recuperable, no se descartan.

Los códigos de error se reducen a identificadores seguros; no se persiste `error.message`. No se inicia ningún worker al importar módulos.

## Matriz M4 propuesta — pendiente de aprobación

No se asignan números CU ni perfiles en este bloque.

| Capacidad | Situación actual | Propuesta |
|---|---|---|
| Consultar metadatos | CU360 comercial | Revisar alcance; separar si incluye documentos sensibles |
| Consultar versiones | CU367 historial comercial | Mantener sólo para ficha comercial; crear capacidad específica para otros dominios |
| Asociar producto | CU366 vínculo comercial | Mantener para documentos comerciales |
| Definir imagen principal | Sin capacidad específica | Nueva capacidad documental/comercial |
| Crear intención | Cerrada | Nueva capacidad |
| Confirmar carga | Cerrada | Nueva capacidad separada de creación |
| Descargar | Cerrada | Nueva capacidad con alcance por entidad y clasificación |
| Reemplazar | Cerrada | Nueva capacidad con motivo obligatorio |
| Archivar | Cerrada | Nueva capacidad con motivo obligatorio |
| Administrar cuarentena | Cerrada | Nueva capacidad técnica restringida |
| Gestionar conservación | Cerrada | Nueva capacidad administrativa separada |

Los endpoints continúan deshabilitados hasta que M4 apruebe códigos, perfiles y resolutores de alcance.

## Propuesta M9 — pendiente de aprobación

El catálogo M9 real sólo acepta productores M1–M8 y operaciones explícitas. No se modificó. Deben aprobarse propietario/productor, criticidad e identidad lógica para:

- `DOCUMENTO_CARGA_INICIADA`;
- `DOCUMENTO_VALIDADO`;
- `DOCUMENTO_RECHAZADO`;
- `DOCUMENTO_CUARENTENA`;
- `DOCUMENTO_DISPONIBLE`;
- `DOCUMENTO_VERSION_REEMPLAZADA`;
- `DOCUMENTO_DESCARGADO`;
- `DOCUMENTO_INTEGRIDAD_FALLIDA`;
- `DOCUMENTO_ACCESO_DENEGADO`.

La propuesta mínima usa actor autenticado, documento, versión, entidad relacionada, resultado, fecha e idempotencia. Excluye binarios, Base64, nombres originales, secretos, tokens y URLs firmadas. El outbox técnico no sustituye M9.

## Dependencias

Se actualizó únicamente `express` de 5.2.1 a 5.3.x, dentro de la misma versión mayor. Esto actualiza sus transitivas corregidas `proxy-addr`, `body-parser` y `qs`, eliminando la alerta crítica y las alertas runtime relacionadas. No se degradó Prisma ni ExcelJS y no se ejecutó `npm audit fix --force`.

El audit final informa 15 paquetes afectados: 0 críticos, 9 altos y 6 moderados. Los restantes pertenecen al tooling Prisma 7.8 (`@prisma/dev`, Hono, MySQL2 y utilidades), nodemon/globs y ExcelJS/uuid; el sistema usa PostgreSQL y esas rutas de MySQL/Hono no son el servidor Express de producción, pero la deuda sigue registrada. Las correcciones sugeridas por npm implican cambios amplios o resultados incompatibles (incluido downgrade de Prisma/ExcelJS o nodemon), por lo que no se aplicaron automáticamente. Deben evaluarse como actualización técnica separada y repetirse la suite antes de cualquier despliegue.

## Estado para activación

Implementado y probado en aislado: vínculo persistente, protección de carreras, integridad del stream antivirus, promoción, descarga interna y lease propietario.

Pendiente: clamd real aislado, aprobación M4, aprobación M9, parámetros empresariales y pruebas contra proveedor real autorizado. No se realizó despliegue ni conexión a Clouding, RRFF, R2 o AWS.
