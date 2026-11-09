\set ON_ERROR_STOP on

CREATE TABLE public.ci_estado_previo_079 (
  clave text PRIMARY KEY,
  valor text NOT NULL
);

INSERT INTO comun.usuario (
  usuario_username, usuario_nombre_completo_primer_nombre_usuario,
  usuario_estado_cuenta, acceso_m4, administrador_original,
  usuario_es_administrador, configuracion_particular, version_seguridad
) VALUES
  ('ci-midas-079', 'Midas sintético 079', 'activo', 'Midas', TRUE, TRUE, FALSE, 7),
  ('ci-ordinario-079', 'Usuario ordinario 079', 'activo', 'ci-ordinario-079', FALSE, FALSE, FALSE, 3),
  ('ci-personalizado-079', 'Usuario personalizado 079', 'activo', 'ci-personalizado-079', FALSE, FALSE, TRUE, 5);

INSERT INTO comun.usuario_contrasena (usuario_id_usuario, usuario_contrasena, activa)
SELECT usuario_id_usuario, 'hash-sintetico-' || acceso_m4, TRUE
FROM comun.usuario
WHERE acceso_m4 IN ('Midas','ci-ordinario-079','ci-personalizado-079');

INSERT INTO comun.usuario_permiso_particular (id_usuario,id_permiso)
SELECT u.usuario_id_usuario,p.permiso_id_permiso
FROM comun.usuario u
JOIN comun.permiso p ON p.codigo_m4='CU14'
WHERE u.acceso_m4='ci-personalizado-079';

INSERT INTO comun.sesion_usuario (id_usuario,secreto_hash,vence,version_seguridad)
SELECT usuario_id_usuario, 'sesion-ci-' || acceso_m4, CURRENT_TIMESTAMP + INTERVAL '1 hour', version_seguridad
FROM comun.usuario
WHERE acceso_m4 IN ('Midas','ci-ordinario-079','ci-personalizado-079');

INSERT INTO public.ci_estado_previo_079(clave,valor)
SELECT 'usuarios',count(*)::text FROM comun.usuario
UNION ALL SELECT 'credenciales',count(*)::text FROM comun.usuario_contrasena
UNION ALL SELECT 'asignaciones_ordinario',count(*)::text FROM comun.usuario_permiso_particular upp JOIN comun.usuario u ON u.usuario_id_usuario=upp.id_usuario WHERE u.acceso_m4='ci-ordinario-079'
UNION ALL SELECT 'asignaciones_personalizado',count(*)::text FROM comun.usuario_permiso_particular upp JOIN comun.usuario u ON u.usuario_id_usuario=upp.id_usuario WHERE u.acceso_m4='ci-personalizado-079'
UNION ALL SELECT 'hashes',string_agg(usuario_contrasena,',' ORDER BY usuario_contrasena) FROM comun.usuario_contrasena WHERE usuario_id_usuario IN (SELECT usuario_id_usuario FROM comun.usuario WHERE acceso_m4 IN ('Midas','ci-ordinario-079','ci-personalizado-079'));
