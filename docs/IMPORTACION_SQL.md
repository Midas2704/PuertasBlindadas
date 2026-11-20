# Importación mediante DDL y DML

Los archivos SQL permiten reconstruir la base académica de demostración en PostgreSQL 18 sin ejecutar migraciones Prisma.

La base de destino debe existir y estar vacía. Los archivos no incluyen `DROP`, `CASCADE`, `TRUNCATE` ni comandos para eliminar bases o esquemas.

```powershell
$env:PGPASSWORD = 'CLAVE_LOCAL'
psql -h 127.0.0.1 -p 5432 -U USUARIO_LOCAL -d BASE_LOCAL -v ON_ERROR_STOP=1 -f database/sql/01_estructura_ddl.sql
psql -h 127.0.0.1 -p 5432 -U USUARIO_LOCAL -d BASE_LOCAL -v ON_ERROR_STOP=1 -f database/sql/02_datos_dml.sql
Remove-Item Env:PGPASSWORD
```

El DDL crea los cinco esquemas, tablas, secuencias, vistas, funciones, índices, triggers y restricciones. Las claves foráneas son diferibles para permitir la carga transaccional de las relaciones circulares y utilizan comportamiento restrictivo en vez de cascadas.

El DML utiliza una sola transacción. Si una inserción o relación falla, PostgreSQL revierte toda la carga.

Después de importar:

```sql
SELECT count(*)
FROM pg_tables
WHERE schemaname IN ('comun','finanzas','inventario','terreno','public');
```

El resultado esperado es `294`.
