# C2.6 — Activación controlada M4

## Operativo en código

- CU368–CU376 quedan registrados por la migración `068_permisos_comerciales_documentales_c2_6`.
- La migración valida definiciones preexistentes incompatibles y no asigna permisos a perfiles ni usuarios.
- CU377 no se registra y continúa cerrado.
- Precios, opcionales, tarifas y condiciones usan autorización backend, transacción serializable, revisión optimista, clave de idempotencia persistida y eventos M9.
- Los precios y tarifas se versionan creando nuevas filas; los montos históricos no se sobrescriben.
- La resolución de instalación conserva precedencia comuna → región y nunca representa ausencia como precio cero.

## Documental: implementado pero bloqueado por infraestructura

Los CU documentales están aprobados, pero la fachada local no configura una política COMERCIAL, storage S3-compatible privado ni antivirus real. Por ello carga, reemplazo, vista previa y descarga siguen respondiendo como capacidades no disponibles y la interfaz no muestra botones activos. No se usó R2, AWS, Clouding ni un antivirus simulado.

Una activación local posterior deberá inyectar el adaptador existente, una política exclusiva de pruebas y ClamAV real. Sólo una versión con storage confirmado, SHA-256 y MIME válidos, y resultado antivirus `LIMPIO` puede pasar a `DISPONIBLE`.

Formatos ya detectables por el núcleo: JPEG, PNG, WebP y PDF. Los límites de tamaño, expiración, concurrencia y enlaces firmados requieren aprobación empresarial antes de producción.

## Pendiente

- Aplicar y probar la migración 068 sólo en PostgreSQL 18 aislado.
- Asignar CU exclusivamente mediante una decisión administrativa posterior.
- Configurar storage y antivirus locales para probar el flujo binario real.
- Habilitar formularios de galería/carga únicamente después de esa prueba.
- Definir la política empresarial COMERCIAL de producción.
