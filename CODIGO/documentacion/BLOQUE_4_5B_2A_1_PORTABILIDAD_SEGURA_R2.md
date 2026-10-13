# Bloque 4.5B.2A.1 — Portabilidad segura R2/S3

Fecha de revisión: 2026-10-12. Rama: `dashboard-ventas-familia-y-navegacion`. SHA inicial: `ad9ecaf09de4b5b6cbd42511e5d30176ce9fa2a4`.

## 1. Arquitectura existente

El flujo interno conserva la separación React → M2 → autorización M4 → coordinador documental → `StorageAdapter` → validación/antivirus → repositorio Prisma → outbox. No se añadieron rutas HTTP ni procesos al importar.

## 2. Problema identificado

La promoción dependía de `CopyObject`. S3 disponía de una condición de destino; R2 sólo documenta para copia una extensión beta cuyas condiciones de origen y destino no son atómicas entre sí. Además, la primera copia `quarantine/<uuid>` no estaba protegida contra reemplazo concurrente.

## 3. Investigación AWS

- **CONFIRMADO EN DOCUMENTACIÓN:** `If-None-Match: *` en `PutObject` crea sólo cuando la clave no existe; una carrera devuelve 412 y ciertos conflictos concurrentes 409. [AWS Conditional writes](https://docs.aws.amazon.com/AmazonS3/latest/userguide/conditional-writes.html) y [PutObject API](https://docs.aws.amazon.com/AmazonS3/latest/API/API_PutObject.html).
- **CONFIRMADO EN DOCUMENTACIÓN:** la condición también existe al completar multipart, pero las políticas de bucket y `CopyObject` tienen diferencias que deben validarse. [Enforcement with bucket policies](https://docs.aws.amazon.com/AmazonS3/latest/userguide/conditional-writes-enforce.html) y [Multipart upload](https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpuoverview.html).
- **IMPLEMENTADO EN SDK:** AWS SDK v3 recibe `IfNoneMatch: '*'` en `PutObjectCommand` y `IfMatch` en `GetObjectCommand`.
- **PENDIENTE DE PRUEBA REAL:** comportamiento, políticas, IAM, latencia, fallos y reintentos contra un bucket S3 autorizado.

## 4. Investigación Cloudflare R2

- **CONFIRMADO EN DOCUMENTACIÓN:** R2 admite operaciones condicionales `If-None-Match` en `PutObject` y `If-Match` en `GetObject`. [R2 S3 API compatibility](https://developers.cloudflare.com/r2/api/s3/api/).
- **CONFIRMADO EN DOCUMENTACIÓN:** un PUT simple admite objetos de hasta 5 GiB; multipart llega a 5 TiB con restricciones de partes. [Upload objects](https://developers.cloudflare.com/r2/objects/upload-objects/).
- **CONFIRMADO EN DOCUMENTACIÓN:** 412 representa precondición incumplida; errores de cuerpo incompleto o integridad se tratan separadamente. [R2 error codes](https://developers.cloudflare.com/r2/api/error-codes/).
- **LIMITACIÓN:** `cf-copy-destination-if-none-match` es una extensión beta y Cloudflare advierte que condiciones de origen/destino de copia no son atómicas entre sí. [R2 S3 extensions](https://developers.cloudflare.com/r2/api/s3/extensions/).
- **PENDIENTE DE PRUEBA REAL:** R2 real, credenciales, endpoint, carreras, límites, cancelación, recuperación y consistencia.

## 5. Alternativa seleccionada y justificación

**IMPLEMENTADO:** lectura condicionada del origen + `PutObject If-None-Match: *` para crear una copia estable + validación completa + antivirus + nueva lectura condicionada + segundo PUT exclusivo al destino + relectura SHA-256 + confirmación PostgreSQL. No se usa `HEAD + PUT normal`, no se confía en ETag como hash y no se sobrescribe una clave.

Esta ruta usa semántica documentada en ambos proveedores y evita depender de la extensión beta de copia R2. `CopyObject` continúa en el contrato para usos capaces, sin falsear su capacidad en R2.

## 6. Nuevos contratos y capacidades

| Contrato | R2 técnico | S3 técnico | Estado real |
|---|---:|---:|---|
| `copiaCondicionalDestino` | No | Sí | R2 bloqueado para copia beta |
| `escrituraCondicionalDestino` | Sí | Sí | Implementado y probado con mock |
| `lecturaCondicionalOrigen` | Sí | Sí | Implementado y probado con mock |
| `multipartCondicionalDestino` | No | No | No implementado; tamaños fuera de PUT se bloquean |
| `crearObjetoExclusivo` | Sí | Sí | `PutObject` + `If-None-Match: *` |
| `abrirLecturaCondicionada` | Sí | Sí | `GetObject` + `If-Match` |

`OBJETO_EXISTENTE` (412) es definitivo y no reintentable; `CONFLICTO_TRANSITORIO` (409) es reintentable; timeout/503 son temporales; cuerpo incompleto es integridad; autorización y capacidad no soportada permanecen separadas.

## 7. Copia de trabajo estable

`quarantine/<uuid>` se crea exclusivamente. La clave reserva el UUID público de la intención y lleva el metadato técnico `idempotencia-documental=trabajo:<uuid>`. Una carrera tiene un ganador; el resto sólo puede recuperar la copia si la propiedad técnica coincide. El temporal se lee con el ETag observado mediante GET condicionado. El temporal original nunca se modifica.

## 8. Promoción definitiva

`objects/<uuid>` se crea mediante otro PUT exclusivo, leyendo la copia estable con condición `If-Match`. Si ya existe, no se escribe: se exige la misma clave de operación, se relee por completo y se compara SHA-256 y tamaño. Una igualdad de hash aislada no reasigna objetos entre intenciones.

## 9. SHA-256, MIME, antivirus y cuarentena

El ETag sólo controla concurrencia. SHA-256 se calcula sobre la copia estable y sobre el destino conservado. MIME se detecta por bytes contra allowlist y límites; React no es autoridad. Sólo integridad válida y antivirus `LIMPIO` producen `DISPONIBLE`. Infección, indisponibilidad, error o formato rechazado permanecen en cuarentena y no habilitan recuperación. **CLAMAV REAL: PENDIENTE DE PRUEBA REAL.**

## 10. Streaming, límites y reintentos

La implementación usa `Readable`/`Transform`, `Content-Length`, timeout y señal de cancelación. No usa Base64, `Buffer.concat` ni archivos temporales en producción. Cada reintento pide un stream nuevo. R2 documenta 5 GiB y S3 5 GB para PUT simple; la ruta portable aplica el menor límite, 5.000.000.000 bytes. No es un límite empresarial. Multipart condicional no se declara disponible hasta validar ambos proveedores.

## 11. PostgreSQL, idempotencia y recuperación

No se afirma atomicidad distribuida. Las claves por intención, revisión optimista, restricciones únicas, transacciones serializables y consulta de versión permiten converger tras una caída posterior al storage. Una versión no se duplica; una intención no cambia de documento. Objetos sin versión quedan detectables por reconciliación, nunca se borran automáticamente.

## 12. Asociación comercial

La confirmación precede a la asociación y sólo acepta clasificación `COMERCIAL`. Si la asociación falla, el original confirmado no se elimina. Se intenta registrar `ASOCIACION_PRODUCTO_PENDIENTE` con clave idempotente y datos técnicos mínimos. Un reintento vuelve a confirmar idempotentemente y la asociación Prisma devuelve la asociación única ya existente si una carrera la creó. Si PostgreSQL completo está caído, el registro del evento puede fallar; la versión determinista conserva el punto de reconciliación.

## 13. Matriz M4 propuesta

Esta matriz es informativa: no crea CU, perfiles ni asignaciones.

| Operación | Propietario | CU actual / nuevo | Perfil | Clasificación/entidad | Acceso | Riesgo | Auditoría | Aprobación |
|---|---|---|---|---|---|---|---|---|
| CONSULTAR_METADATA | M2 | CU360 | Empresa por definir | COMERCIAL/producto | Consulta | Bajo | Evaluar | Existente |
| CONSULTAR_VERSIONES | M2 | CU367 | Empresa por definir | COMERCIAL/asociación | Consulta | Medio | Evaluar | Existente |
| ASOCIAR_PRODUCTO | M2 | CU366 | Empresa por definir | COMERCIAL/producto | Escritura | Medio | Sí | Existente |
| CREAR_INTENCION | M2 | Nuevo requerido | Empresa por definir | Por aprobar | Escritura | Medio | Sí | Pendiente |
| CONFIRMAR_CARGA | M2 | Nuevo requerido | Empresa por definir | Por aprobar | Escritura | Alto | Sí | Pendiente |
| DESCARGAR | M2 | Nuevo requerido | Empresa por definir | Asociación | Consulta sensible | Alto | Sí | Pendiente |
| REEMPLAZAR | M2 | Nuevo requerido | Empresa por definir | Asociación | Escritura | Alto | Sí | Pendiente |
| DEFINIR_IMAGEN_PRINCIPAL | M2 | Nuevo requerido | Empresa por definir | COMERCIAL/producto | Escritura | Medio | Sí | Pendiente |
| ORDENAR_GALERIA | M2 | Nuevo requerido | Empresa por definir | COMERCIAL/producto | Escritura | Medio | Sí | Pendiente |
| DEFINIR_USO_B2B_B2C | M2 | Nuevo requerido | Empresa por definir | COMERCIAL/producto | Escritura | Medio | Sí | Pendiente |
| ARCHIVAR_DOCUMENTO | M2 | Nuevo requerido | Empresa por definir | Asociación | Escritura | Alto | Sí | Pendiente |
| GESTIONAR_CUARENTENA | M2 | Nuevo requerido | Empresa por definir | Cuarentena | Escritura | Alto | Sí | Pendiente |
| ADMINISTRAR_CONSERVACION | Documental | Nuevo requerido | Empresa por definir | Política | Escritura | Crítico | Sí | Pendiente |

## 14. Matriz M9 propuesta

Productor propuesto M2; actor, entidad, documento, versión y resultado cuando correspondan; sin binarios, URL, secreto ni token. Ningún tipo está aprobado ni publicado.

| Evento | Operación/resultado | Criticidad | Idempotencia | Riesgo/justificación | Estado |
|---|---|---|---|---|---|
| DOCUMENTO_CONSULTADO | Consulta | Baja | Evaluar | Volumen; trazabilidad acotada | Pendiente |
| DOCUMENTO_CARGA_INICIADA | Crear intención | Media | Sí | Inicio de mutación | Pendiente |
| DOCUMENTO_CARGA_CONFIRMADA | Confirmar | Media | Sí | Cadena de custodia | Pendiente |
| DOCUMENTO_RECHAZADO | Rechazo | Alta | Sí | Resultado de seguridad | Pendiente |
| DOCUMENTO_CUARENTENA | Cuarentena | Alta | Sí | Contenido no recuperable | Pendiente |
| DOCUMENTO_DISPONIBLE | Publicación | Media | Sí | Habilita uso | Pendiente |
| DOCUMENTO_DESCARGADO | Recuperación | Media | Sí | Acceso a contenido | Pendiente |
| DOCUMENTO_REEMPLAZADO | Reemplazo | Media | Sí | Conserva historia | Pendiente |
| DOCUMENTO_ASOCIADO_PRODUCTO | Asociación | Media | Sí | Mutación comercial | Pendiente |
| DOCUMENTO_IMAGEN_PRINCIPAL_CAMBIADA | Principal | Media | Sí | Visibilidad comercial | Pendiente |
| DOCUMENTO_USO_COMERCIAL_MODIFICADO | B2B/B2C | Media | Sí | Alcance de publicación | Pendiente |
| DOCUMENTO_INTEGRIDAD_FALLIDA | Integridad | Alta | Sí | Incidente técnico | Pendiente |

## 15. Outbox

El outbox existente conserva reclamación con lease, token, expiración, reintento, recuperación y descarte. El nuevo evento de asociación es técnico, no duplica M9. Un futuro publicador debe usar la clave idempotente como identidad funcional y marcar el evento sólo después de aceptación M9. No se activaron workers.

## 16. Cobertura de los 35 casos obligatorios

**PROBADO CON MOCK:** creación, preexistencia, carrera simultánea, contenido distinto, reintento igual, 412, 409, 503, timeout, stream interrumpido/incompleto, hash/tamaño incorrecto, cambios de temporal/trabajo, final preexistente, caída post-escritura, fallo PostgreSQL, confirmación concurrente, documento ajeno, asociación fallida/recuperada, antivirus indisponible/infectado/limpio, cuarentena, relectura, original preservado, ausencia de sobreescritura/duplicación, R2/S3 simulados y capacidad ausente. La cobertura se distribuye entre `portabilidad-segura-r2-s3`, `seguridad-integridad-documental`, `adaptador-storage-r2-s3`, `nucleo-documental-portable` y `documentos-producto-backend`.

**PROBADO CON MOCK, NO CON PROVEEDOR:** archivo pequeño, 1 MiB, 4 MiB simulado, fragmentos, backpressure del pipeline, cancelación, timeout, lectura/escritura incompleta, doble lectura, reintento y ausencia de acumulación en el adaptador. El mock conserva bytes para simular el proveedor; esa memoria no pertenece al código productivo.

**PROBADO EN EMULADOR:** no se utilizó emulador; ninguno reproduce por sí solo la semántica contractual de R2.

## 17. Checklist formal de activación

| Nº | Requisito | Responsable propuesto | Evidencia necesaria | Estado actual | Riesgo | Condición de aprobación |
|---:|---|---|---|---|---|---|
| 1 | M4 | Seguridad/empresa | CU, perfiles y alcance aprobados | Pendiente | Alto | Acta y tests de autorización |
| 2 | M9 | Auditoría/empresa | Catálogo y productor aprobados | Pendiente | Alto | Eventos aceptados formalmente |
| 3 | ClamAV | Infraestructura | Prueba real fail-closed | Pendiente | Crítico | Limpio/infectado/error/timeout verificados |
| 4 | R2 | Infraestructura | Bucket aislado autorizado | Pendiente | Alto | Matriz real aprobada |
| 5 | S3 | AWS/seguridad | Bucket, IAM y región aprobados | Pendiente | Alto | Prueba real y revisión IAM |
| 6 | Escritura condicional | Backend/QA | Carreras reales R2 y S3 | Mock aprobado | Crítico | Sin sobrescrituras reales |
| 7 | Concurrencia | QA | Dos instancias y fallos inducidos | Mock aprobado | Alto | Un ganador y convergencia |
| 8 | SHA-256 | Seguridad | Relectura real completa | Aislado aprobado | Alto | Hash idéntico extremo a extremo |
| 9 | MIME | Empresa/seguridad | Allowlist oficial | Técnica preparada | Alto | Política firmada |
| 10 | Políticas técnicas | Empresa | Tamaños/tiempos/cantidad | Pendiente | Alto | Valores oficiales |
| 11 | Permisos por producto | M2/M4 | IDOR y alcance | Parcial | Alto | Casos horizontales aprobados |
| 12 | Antivirus | Seguridad | Motor productivo monitoreado | Pendiente | Crítico | SLA y fail-closed |
| 13 | Cuarentena | Seguridad | Acceso y operación aprobados | Cerrada | Alto | CU y procedimiento |
| 14 | PostgreSQL | DBA | Transacciones y carga | Local aislado | Alto | Pruebas autorizadas |
| 15 | Migraciones 055–057 | DBA | Backup y migrate status | No desplegadas | Alto | Ventana autorizada |
| 16 | Respaldos | DBA/infra | Restore probado | Pendiente | Crítico | Evidencia de restauración |
| 17 | Reconciliación | Backend/operaciones | Huérfanos y pendientes | Preparada | Alto | Job y runbook aprobados |
| 18 | Auditoría | M9 | Idempotencia y no duplicación | Propuesta | Alto | Integración aprobada |
| 19 | Pruebas integrales | QA | E2E cerrado | Pendiente | Alto | Informe aprobado |
| 20 | Credenciales | Seguridad | Secret manager/IAM | Sin configurar | Crítico | Rotación y mínimo privilegio |
| 21 | Recuperación | Operaciones | Fallos storage/DB/AV | Aislado parcial | Alto | Simulacro aprobado |
| 22 | Despliegue | Responsable empresarial | Autorización expresa | Bloqueado | Crítico | Orden de despliegue escrita |

## 18. Vulnerabilidades y dependencias

No se añadieron dependencias ni se ejecutó `npm audit fix`. El diagnóstico final conserva exactamente el baseline: backend 15 (9 altas, 6 moderadas) y frontend 15 (11 altas, 4 moderadas), ambos sin críticas. Los hallazgos incluyen cadenas de tooling y dependencias transitivas; no se aplicaron cambios mayores o degradaciones automáticas.

## 19. Resultados de verificación

- Focales documentales: **184/184** (126 aisladas/mocks + 58 con PostgreSQL local).
- Suite backend completa: **1475/1475**.
- Suite frontend: **8/8**.
- Backend build, frontend build, Prisma validate y Prisma generate: aprobados.
- Migraciones: **58 encontradas y base local al día**; no se creó ni aplicó una migración nueva.
- `git diff --check`: aprobado; sólo avisos de normalización LF/CRLF.
- Lint focal: TypeScript/build sin errores en los archivos cambiados. El backend no posee script/configuración ESLint.
- Lint global frontend: diagnóstico heredado de **105 errores y 11 warnings** en archivos no modificados por este bloque.
- Revisión de secretos, endpoints, permisos y conexiones externas: sin hallazgos nuevos; las coincidencias de rutas son endpoints históricos ajenos al servicio portable.
- Warnings no bloqueantes: deprecación heredada de `pg` al ejecutar la suite y advertencia Vite por chunk mayor a 500 kB.

## 20. Modelos y migraciones

No se modificó Prisma ni las migraciones 055, 056 o 057. Se reutilizan `documento_logico`, `version_documento`, `intencion_carga_documental`, `producto_comercial_documento` y `evento_operacional_documental`. Terreno, Inventario y documentos históricos permanecen intactos.

## 21. Riesgos y bloqueos pendientes

- R2 y S3 reales no probados; el mock sólo acredita nuestra reacción a la semántica simulada.
- ClamAV real, M4, M9, políticas empresariales, reconciliador operativo y despliegue siguen bloqueados.
- Multipart exclusivo no implementado: más de 5 GiB no es admisible con este flujo.
- Una caída total de PostgreSQL puede impedir registrar el evento de asociación pendiente; la versión/clave determinista permite reconciliar después.
- Las políticas de bucket S3 pueden afectar `CopyObject`; el flujo seleccionado usa PUT, pero debe validarse con la política real.

## 22. Estado de infraestructura y próximo bloque

Clouding, RRFF, PostgreSQL remoto, R2, AWS, IAM, DNS, nginx, certificados y contenedores siguen intactos. No hubo conexión, migración ni despliegue. El próximo bloque recomendado es 4.5B.2B **sólo después** de aprobar este cierre y autorizar expresamente las pruebas reales; no se inició en este trabajo.
