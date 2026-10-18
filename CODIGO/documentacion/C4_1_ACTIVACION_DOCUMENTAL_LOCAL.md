# C4.1 - Activacion documental local controlada

## Alcance y estado

Este documento describe exclusivamente la validacion local y descartable de C4.1. No define una politica empresarial ni habilita produccion.

- Motor PDF: implementado y probado en C4.
- ClamAV: integrado mediante `clamd`/`INSTREAM`, con activacion explicita y comportamiento fail-closed.
- Storage S3 compatible: pendiente de infraestructura. El endpoint oficial de descarga comunitaria de MinIO respondio `410 Gone`; no se utilizaron mirrors.
- Emision y publicaciones definitivas: bloqueadas mientras no exista storage privado validado y permisos M4 aprobados.
- CU377: permanece cerrado.

## Infraestructura de prueba

La prueba se ejecuta en `tmp/c4.1-infra`, ruta ignorada por Git:

- ClamAV portable oficial, sin instalador, servicio de Windows ni cambios de PATH.
- `clamd` limitado a `127.0.0.1:3310`.
- Firmas descargadas mediante `freshclam` desde `database.clamav.net` y verificadas por el motor.
- PostgreSQL 18 aislado limitado a `127.0.0.1:55441`, migrado hasta 069 y con datos sinteticos.
- No se utilizan Clouding, R2, AWS, RRFF, Inventario ni bases habituales.

Variables necesarias para una prueba local de ClamAV (sin secretos):

```text
DOCUMENTAL_ANTIVIRUS_ENABLED=true
DOCUMENTAL_CLAMAV_HOST=127.0.0.1
DOCUMENTAL_CLAMAV_PORT=3310
DOCUMENTAL_CLAMAV_TIMEOUT_MS=30000
DOCUMENTAL_CLAMAV_MAX_BYTES=20971520
```

## Politica COMERCIAL provisional de prueba

Esta politica es restrictiva y local; sus valores no son oficiales ni deben copiarse a produccion sin aprobacion empresarial:

- Clasificacion: `COMERCIAL`.
- MIME permitidos: `application/pdf`, `image/jpeg`, `image/png`.
- Tamano minimo: 32 bytes.
- Tamano maximo: 20 MiB.
- Timeout: 30 segundos.
- Concurrencia maxima: 2.
- Cantidad maxima por operacion: 5.
- Expiracion de intencion: 900 segundos.
- Expiracion de URL firmada: 120 segundos.
- SHA-256 obligatorio.
- Antivirus obligatorio; solamente `LIMPIO` permite disponibilidad.

Los estados `INFECTADO`, `ERROR_ESCANEO`, `NO_DISPONIBLE` y `ARCHIVO_NO_SOPORTADO` permanecen cerrados y no autorizan descarga ni confirmacion.

## Permisos M4 propuestos

Los siguientes codigos se reservan solo como propuesta. No estan registrados, migrados, asignados ni concedidos:

| Codigo | Nombre propuesto | Modulo | Alcance | Auditoria |
| --- | --- | --- | --- | --- |
| CU378 | Editar plantillas documentales comerciales | M2 | Crear y editar borradores, secciones y textos autorizados | Obligatoria |
| CU379 | Publicar plantillas documentales comerciales | M2 | Publicar versiones inmutables de plantillas B2B, B2C y carta general | Obligatoria |
| CU380 | Editar carta comercial general B2C | M2 | Crear y modificar el borrador, modelos, orden y contenido autorizado | Obligatoria |
| CU381 | Publicar carta comercial general B2C | M2 | Publicar snapshot, PDF y version documental confirmada | Obligatoria |

Los perfiles destinatarios quedan `POR_DEFINIR_POR_EMPRESA`. Ser administrador no reemplaza el CU explicito. Edicion y publicacion permanecen separadas y fail-closed.

## Flujo documental preparado

1. Validar actor, revision, estado comercial y datos persistidos.
2. Construir el snapshot inmutable y generar el PDF.
3. Calcular SHA-256 sobre los bytes generados.
4. Analizar exactamente esos bytes con ClamAV.
5. Almacenar mediante `StorageAdapter` en un destino privado y exclusivo.
6. Releer y verificar tamano, token de concurrencia y SHA-256.
7. Registrar `documento_logico` y `version_documento`.
8. Confirmar la version documental y recien entonces cambiar la cotizacion a `emitida`.
9. Registrar M9 sin duplicar exitos por reintentos.

Sin storage real confirmado, el flujo se detiene antes de los pasos 5-9. No se crean metadatos ficticios ni documentos disponibles.

## Activacion productiva posterior

Requiere una decision separada sobre proveedor S3, bucket privado, IAM, region, cifrado, versionado, retencion, antivirus operado, limites oficiales, monitoreo y recuperacion. Las credenciales deben inyectarse fuera del repositorio. C4.1 no modifica ninguna infraestructura productiva.
