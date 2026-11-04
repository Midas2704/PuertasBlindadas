# Migración 076 — schema `comun`

Traslada 14 tablas compartidas desde `terreno` mediante `ALTER TABLE ... SET SCHEMA`.
No copia filas, no renumera claves y no recrea relaciones. PostgreSQL conserva el OID
de cada tabla, por lo que las claves foráneas entrantes y salientes continúan apuntando
al mismo objeto físico.

La aplicación de esta migración debe coordinarse con el backend generado desde el
`schema.prisma` que ya incluye `comun`. Una versión anterior de la aplicación seguirá
buscando las tablas en `terreno` y no debe permanecer activa durante el cambio.

Reversión controlada, sólo antes de que existan migraciones posteriores dependientes:

```sql
BEGIN;
ALTER TABLE comun.token_recuperacion SET SCHEMA terreno;
ALTER TABLE comun.sesion_usuario SET SCHEMA terreno;
ALTER TABLE comun.estado_seguridad_usuario SET SCHEMA terreno;
ALTER TABLE comun.permiso_dependencia SET SCHEMA terreno;
ALTER TABLE comun.usuario_permiso_particular SET SCHEMA terreno;
ALTER TABLE comun.usuario_contrasena SET SCHEMA terreno;
ALTER TABLE comun.perfil_permiso SET SCHEMA terreno;
ALTER TABLE comun.usuario SET SCHEMA terreno;
ALTER TABLE comun.permiso SET SCHEMA terreno;
ALTER TABLE comun.perfil SET SCHEMA terreno;
ALTER TABLE comun.proyecto_obra SET SCHEMA terreno;
ALTER TABLE comun.proyecto SET SCHEMA terreno;
ALTER TABLE comun.obra SET SCHEMA terreno;
ALTER TABLE comun.area_trabajo SET SCHEMA terreno;
COMMENT ON COLUMN finanzas.evento_auditoria.id_usuario IS
  'FK física hacia terreno.usuario(usuario_id_usuario). Uso acotado para auditoría mientras no exista schema transversal de seguridad.';
COMMENT ON COLUMN finanzas.proyecto_financiero.id_proyecto_terreno IS
  'FK física hacia terreno.proyecto(proyecto_proyecto_id). Finanzas registra el seguimiento financiero del proyecto.';
COMMIT;
```

La reversión no elimina el schema `comun`; su eliminación sólo corresponde cuando se
confirme que está vacío y no existen objetos posteriores que lo utilicen.
