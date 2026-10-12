# Adaptador de almacenamiento portable R2 / Amazon S3 — Bloque 4.3

## Estado

**IMPLEMENTADO:** adaptador técnico S3-compatible con AWS SDK v3, configuración validada, streams, HEAD/GET/PUT, firmas PUT/GET, copia y multipart. Pruebas usan un cliente SDK inyectado y no realizan conexiones externas.

**PREPARADO:** inyección en `ServicioDocumental`, version IDs del proveedor, checksums informados por partes y capacidades declarativas de buckets S3.

**PENDIENTE 4.4:** endpoints protegidos por M4, coordinación transaccional con intenciones/versiones, SHA-256 calculado por el sistema, MIME detectado, antivirus, cuarentena operativa, auditoría M9 y autorización de recuperación.

## Arquitectura

```text
Controlador propietario (pendiente 4.4)
              |
      ServicioDocumental
       /              \
Repositorio Prisma   StorageAdapter
                          |
              S3CompatibleStorageAdapter
                    /             \
             Cloudflare R2      Amazon S3
```

`S3CompatibleStorageAdapter` contiene la implementación común. Las diferencias se expresan en configuración y `CapacidadesStorage`; no existen clientes separados con lógica duplicada. Construir el adaptador no ejecuta red.

## Dependencias

- `@aws-sdk/client-s3`
- `@aws-sdk/s3-request-presigner`

No se agregó una librería específica de Cloudflare ni un cliente productivo ficticio.

## Configuración

| Variable | R2 | S3 |
|---|---|---|
| `STORAGE_PROVIDER` | `R2` | `S3` |
| `STORAGE_BUCKET` | Obligatoria | Obligatoria |
| `STORAGE_REGION` | `auto` | Región AWS, por ejemplo `sa-east-1` |
| `STORAGE_ENDPOINT` | Endpoint oficial de cuenta R2 | Se omite; sólo se acepta endpoint oficial AWS o emulador local explícito |
| `STORAGE_ACCESS_KEY_ID` | Obligatoria, privada | Opcional; omitir con IAM |
| `STORAGE_SECRET_ACCESS_KEY` | Obligatoria, privada | Opcional; omitir con IAM |
| `STORAGE_SIGNED_URL_TTL_SECONDS` | 30–900, defecto 300 | Igual |
| `STORAGE_TIMEOUT_MS` | 1000–120000, defecto 30000 | Igual |
| `STORAGE_MAX_ATTEMPTS` | 1–5, defecto 3 | Igual |

Ejemplo R2 sin credenciales reales:

```dotenv
STORAGE_PROVIDER=R2
STORAGE_BUCKET=puertas-blindadas-pruebas
STORAGE_REGION=auto
STORAGE_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
STORAGE_ACCESS_KEY_ID=
STORAGE_SECRET_ACCESS_KEY=
```

Ejemplo S3 con cadena de credenciales/IAM:

```dotenv
STORAGE_PROVIDER=S3
STORAGE_BUCKET=puertas-blindadas-produccion
STORAGE_REGION=sa-east-1
STORAGE_ENDPOINT=
STORAGE_ACCESS_KEY_ID=
STORAGE_SECRET_ACCESS_KEY=
```

Las capacidades S3 de versionado, Object Lock y KMS se declaran `true` sólo si el bucket real fue configurado y las variables `STORAGE_S3_*_ENABLED` lo confirman. En R2 permanecen `false`. Esto no activa dichas funciones.

`STORAGE_ALLOW_LOCAL_ENDPOINT=true` sólo admite HTTP en `localhost`, `127.0.0.1` o `::1` para un emulador aislado. Los endpoints externos requieren HTTPS y dominios oficiales del proveedor, evitando que entradas de usuario controlen destinos de red.

## Autenticación

R2 exige el par Access Key ID/Secret Access Key inyectado desde variables privadas. S3 omite `credentials` cuando no hay claves estáticas y deja que AWS SDK use su cadena estándar, incluidos roles IAM y credenciales temporales. Las configuraciones no se mezclan y ningún secreto se imprime o persiste.

## Operaciones implementadas

- Preparación de PUT simple e inicio multipart.
- PUT desde `Readable`, con conteo de bytes y tamaño esperado.
- HEAD con tamaño, MIME, ETag, versión y metadatos informados por el proveedor.
- GET como `Readable`, sin Base64 ni archivo temporal permanente.
- Firma PUT y GET con expiración acotada.
- Copia entre claves validadas del bucket configurado.
- Subida y firma de partes multipart.
- Confirmación, aborto y listado paginado de cargas multipart incompletas.

No se implementa borrado físico. Las claves aceptadas son exclusivamente `tmp/<uuid>`, `quarantine/<uuid>` y `objects/<uuid>`; el contenedor debe coincidir exactamente con el bucket confiable del servidor.

## Streams, originales e integridad

El cuerpo se transmite por stream y un `Transform` cuenta bytes sin acumular el archivo completo. No hay compresión, redimensionamiento, conversión ni modificación del original.

ETag, metadata, MIME y version ID se identifican como valores **informados por el proveedor**. El MIME de entrada es **declarado**. `sha256Verificado` nunca se completa en 4.3: ni HEAD ni ETag prueban SHA-256. El argumento SHA esperado se valida sintácticamente, pero la comprobación real corresponde a 4.4.

## Multipart e idempotencia

Un PUT sobre una clave opaca estable es repetible. Crear una sesión multipart no es idempotente en la API S3-compatible, por lo que devuelve `idempotente: false`; el llamador debe persistir inmediatamente el `UploadId` en la intención del Bloque 4.2 antes de reintentar. Reenviar la misma parte con igual `UploadId`, número y clave reemplaza esa parte de forma segura. La confirmación ordena las partes y rechaza números duplicados.

ETag no se interpreta como SHA-256. Un checksum de parte sólo se trata como metadato técnico del proveedor.

## Errores normalizados

Los fallos se convierten en `ErrorStorage` con códigos `NO_AUTORIZADO`, `NO_ENCONTRADO`, `CONFLICTO`, `INTEGRIDAD`, `NO_SOPORTADO`, `LIMITE`, `TEMPORAL` o `DESCONOCIDO`. Sólo los errores temporales se marcan reintentables. El mensaje normalizado no copia respuestas, credenciales, headers ni URLs del proveedor.

Los reintentos del AWS SDK se limitan mediante `STORAGE_MAX_ATTEMPTS`; adicionalmente cada operación usa cancelación por tiempo máximo. No existen bucles infinitos.

## URLs firmadas

Se soportan PUT, GET y partes multipart. El TTL máximo se valida antes de firmar. Las URLs se devuelven sólo en memoria desde el adaptador; no se guardan en PostgreSQL, outbox, M9 o logs. No existen endpoints HTTP que las entreguen a usuarios.

No se declara formulario POST firmado porque no forma parte del contrato común implementado para R2/S3.

## Pruebas

Las pruebas contractuales inyectan dobles del cliente y firmador oficiales, consumen streams reales de Node y verifican comandos SDK, errores, timeouts, límites, multipart y seguridad. Son pruebas unitarias/contractuales simuladas; no prueban conectividad, permisos ni comportamiento de un bucket real.

Pruebas reales de R2 y S3: **PENDIENTES DE AUTORIZACIÓN**.

## Limitaciones y siguiente bloque

- Un PUT aceptado no cambia automáticamente una intención o versión a `DISPONIBLE`.
- No hay SHA-256 confiable, MIME detectado, antivirus o promoción desde cuarentena.
- No hay control M4 ni emisión de auditoría M9 para operaciones de usuario.
- No se habilita retención, WORM, legal hold ni eliminación.
- No se crean recursos, buckets, CORS, dominios o políticas.

El Bloque 4.4 deberá coordinar el adaptador con el repositorio, validar contenido, aplicar autorización y emitir auditoría sin convertir R2/S3 en la fuente de verdad de estados empresariales.
