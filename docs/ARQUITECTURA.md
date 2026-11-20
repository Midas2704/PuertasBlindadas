# Arquitectura recuperada

El sistema ejecuta tres servicios Docker:

- `frontend`: React/Vite compilado y servido por Nginx.
- `backend`: Node.js 25, TypeScript compilado, Prisma 7.8 y API HTTP.
- `postgres`: PostgreSQL 18.

La base contiene los esquemas `comun`, `finanzas`, `inventario`, `terreno` y una tabla técnica en `public`.

En producción, los PDF comerciales activos se conservan en PostgreSQL mediante `finanzas.documento_pdf_postgres`; el contenedor backend no tenía volúmenes de archivos montados y no se detectaron variables S3/R2/AWS activas. El núcleo documental mantiene metadatos en `documento_logico` y `version_documento`.

El entorno local utiliza `DOCUMENTAL_POSTGRES_PDF_MODE=true` y una red Docker interna. No configura proveedores externos.
