# Bloque 4.4 — Seguridad, integridad, cuarentena y auditoría documental

## Estado del bloque

**Implementado localmente**: validación por streaming, SHA-256 real, detección MIME por firma, allowlist, contrato e integración clamd, fail-closed, cuarentena, promoción verificada, finalización transaccional en PostgreSQL, descarga segura interna, outbox explícito y reconciliación no destructiva.

**Preparado**: puntos de integración con M4 y M9, procesamiento asíncrono y operación con R2/S3 mediante el adaptador portable del Bloque 4.3.

**Pendiente de autorización/infraestructura**: CU documentales nuevas, productor/operaciones M9, clamd operativo, parámetros técnicos empresariales, endpoints HTTP, interfaz React y conexiones reales R2/S3. Nada de ello se activa en este bloque.

## Flujo y límites de confianza

```text
actor autenticado M4
  -> intención persistida
  -> objeto temporal tmp/<uuid>
  -> lectura streaming: tamaño + SHA-256 + MIME real + allowlist
  -> segunda lectura streaming: antivirus
     -> LIMPIO: copia a objects/<uuid> + relectura/hash + versión DISPONIBLE
     -> cualquier otro resultado: copia a quarantine/<uuid> + versión CUARENTENA
  -> transacción DB: versión + documento actual + intención + outbox
```

Las claves finales son opacas y deterministas. No incluyen RUT, nombres, direcciones, correos, teléfonos ni datos bancarios. El ETag se conserva sólo como metadato del proveedor: nunca reemplaza al SHA-256.

## Integridad y MIME

`IntegridadContenido.ts` procesa un `Readable` sin cargar el archivo completo. Calcula SHA-256 sobre los bytes, cuenta el tamaño, limita consumo y conserva sólo ventanas pequeñas de prefijo/sufijo. Detecta JPEG, PNG, WebP y PDF mediante firmas binarias y estructura mínima. HTML, JavaScript, SVG, ejecutables, archivos comprimidos y formatos desconocidos quedan fuera de la allowlist.

Para PDF se rechazan marcadores activos conservadores (`/JavaScript`, `/Launch`, `/EmbeddedFile`, `/OpenAction`). Esto es defensa adicional, no un parser PDF ni sustituto del antivirus.

Las políticas se inyectan por clasificación mediante `DOCUMENTAL_POLITICAS_TECNICAS_JSON`. El repositorio no incluye tamaños oficiales. Si falta política, la confirmación falla cerrada.

## Antivirus

`AntivirusAdapter` normaliza: `LIMPIO`, `INFECTADO`, `ERROR_ESCANEO`, `NO_DISPONIBLE` y `ARCHIVO_NO_SOPORTADO`.

`ClamAvDaemonAdapter` implementa el protocolo clamd `INSTREAM` con chunks acotados, timeout y límite de bytes. No establece conexiones al importar el módulo. `AntivirusNoDisponible` es el fallback explícito y jamás devuelve `LIMPIO`.

No se probó un motor real porque no hay infraestructura local autorizada. Las pruebas usan dobles aislados; por eso la activación productiva permanece bloqueada hasta ejecutar casos LIMPIO/INFECTADO/error contra un clamd controlado.

## Cuarentena, promoción e idempotencia

El coordinador sólo expone componentes internos, no rutas públicas. Antes de confirmar verifica actor propietario, expiración, capacidades del storage y metadatos HEAD. El objeto temporal se lee para integridad y nuevamente para antivirus. El destino es `objects/<uuid>` o `quarantine/<uuid>`.

Después de copiar, vuelve a leer el destino y compara tamaño y SHA-256 con el original. La clave final única en PostgreSQL y la consulta previa por proveedor/contenedor/clave hacen que el reintento sea idempotente. Si el storage confirma una copia pero falla PostgreSQL, el objeto queda detectable como pendiente de reconciliación; no se borra automáticamente.

`registrarVersionYFinalizarIntencion` bloquea intención y documento, asigna la versión correlativa y persiste versión, puntero actual, estado de intención y outbox dentro de una transacción serializable.

## Autorización M4

El actor procede del backend e incluye id, sesión y permisos; no se acepta un usuario creador aportado por React. Sólo se reutilizan CU existentes:

- CU360: consultar metadatos.
- CU367: consultar historial.
- CU366: asociar producto.

Crear intención, confirmar, descargar, reemplazar, archivar, administrar cuarentena y conservación no tienen CU aprobada. El autorizador las rechaza incluso para administrador con `PERMISO_DOCUMENTAL_NO_DEFINIDO`. No se modificó el catálogo M4 ni se concedieron permisos.

## Descarga segura

`ServicioRecuperacionDocumental` exige autorización inyectada, versión `DISPONIBLE`, SHA-256, MIME detectado y antivirus `LIMPIO`. Limita la vigencia de la firma y devuelve las cabeceras obligatorias `Cache-Control: private, no-store` y `X-Content-Type-Options: nosniff`. No existe endpoint HTTP en este bloque.

## M9 y outbox

`AuditoriaDocumentalPort` define eventos mínimos sin binarios, Base64, credenciales, tokens ni URLs firmadas. No se agregó un productor a M9 ni operaciones a su catálogo: hacerlo requiere autorización. Por tanto no hay publicación real a M9 y no se creó un segundo sistema de auditoría empresarial.

El outbox documental sigue siendo técnico. `ProcesadorOutboxDocumental.procesarUno()` debe invocarse expresamente; no arranca timers al importar. Reclama eventos con `FOR UPDATE SKIP LOCKED`, usa lease, cuenta intentos, conserva errores normalizados y descarta tras el límite configurado. Los fallos pueden reprogramarse explícitamente.

## Reconciliación

El reconciliador informa objetos faltantes, tamaños divergentes, intenciones expiradas, eventos atascados y multipart incompletos. Nunca elimina ni mueve contenido. El contrato actual no lista objetos finales completos, por lo que reporta como limitación los huérfanos arbitrarios de storage; no simula cobertura que no existe.

## Portabilidad y configuración

La seguridad consume el contrato `StorageAdapter`, no SDKs directamente. Funciona con el adaptador S3-compatible preparado para R2 y S3. Proveedor, buckets, endpoints, credenciales, políticas técnicas y clamd se inyectan por configuración. No hay credenciales versionadas ni dependencias de Clouding, Docker Compose o IPs.

## Pruebas

La suite focal verifica formatos permitidos, contenido disfrazado, discrepancias MIME, tamaño, hash, PDF activo, fail-closed antivirus, permisos/alcance, minimización de auditoría, promoción, cuarentena para los cuatro resultados no limpios, reintento idempotente, actor ajeno, descarga, outbox y reconciliación. Son pruebas aisladas; no contactan R2, S3, Clouding ni un antivirus externo.

La transacción y constraints continúan cubiertos por la suite documental de PostgreSQL creada en 4.2. El Bloque 4.4 agrega el método transaccional sobre los mismos modelos, sin migración nueva.

## Dependencias y riesgos

No se agregó ninguna dependencia en 4.4. ClamAV usa `node:net`. El `npm audit` ejecutado el 12-10-2026 informa 18 paquetes: 1 crítico, 9 altos, 7 moderados y 1 bajo.

Clasificación:

- **Runtime Express**: `proxy-addr` crítico, `qs` moderado y `body-parser` bajo llegan por `express@5.2.1`. El proyecto no configura `trust proxy` ni usa `req.ip/req.ips`, lo que reduce la exposición concreta de `proxy-addr`; además el límite JSON es un literal válido (`6mb`). Aun así, debe programarse validación de compatibilidad y actualización acotada a Express 5.3.x antes del próximo despliegue público.
- **Tooling Prisma**: `@prisma/config`, `@prisma/dev`, `@hono/node-server`, `hono`, `deepmerge-ts`, `fast-uri`, `mysql2` y `valibot` son transitivas de `prisma@7.8.0`/su tooling. El backend usa PostgreSQL y el flujo documental no expone Hono, MySQL ni `serveStatic`. El arreglo propuesto por npm implica un cambio mayor/incoherente hacia Prisma 6.19.3; no se aplicó automáticamente.
- **Desarrollo**: `nodemon`, `chokidar`, `braces` y una rama de `brace-expansion` se usan en vigilancia/globs de desarrollo. No participan del procesamiento documental en producción.
- **Exportación**: `uuid@8.3.2` llega por `exceljs@4.4.0`; la API vulnerable requiere variantes UUID con buffer aportado, no usadas por este bloque. La corrección propuesta degrada ExcelJS a 3.4.0 y necesita regresión específica.
- **Globs/archivado**: otras versiones de `brace-expansion` llegan por ExcelJS/nodemon. No reciben patrones del flujo documental.

No hay alertas atribuibles a los paquetes AWS SDK incorporados en 4.3 ni a código agregado en 4.4. No se hizo actualización masiva por el riesgo de regresión. La alerta runtime de Express queda como requisito previo a un despliegue público, aunque no bloquea estas pruebas aisladas ni un flujo documental que aún carece de endpoints.

Riesgos pendientes:

1. aprobar CU documentales y sus alcances en M4;
2. aprobar productor y operaciones documentales en M9;
3. ejecutar pruebas contra clamd aislado, incluida una muestra EICAR controlada;
4. aprobar límites técnicos por clasificación;
5. habilitar inventario completo de objetos para detectar huérfanos arbitrarios;
6. acordar política operativa de recuperación/limpieza, sin borrado automático;
7. ejecutar pruebas reales R2 en un bloque posterior autorizado.

## Compatibilidad histórica

No se modifican Base64 M3/M5, BYTEA M6, PDFs, documentos tributarios, cotizaciones, Inventario, Terreno, reglas financieras, vistas, Docker ni migraciones previas. No se migran archivos existentes y no se implementa borrado físico.
