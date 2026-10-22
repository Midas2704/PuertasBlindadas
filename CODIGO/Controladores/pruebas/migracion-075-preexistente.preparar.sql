\set ON_ERROR_STOP on

BEGIN;

INSERT INTO terreno.permiso (
  codigo_m4, activo_m4, permiso_modulo, permiso_accion,
  permiso_nombre_del_permiso, permiso_descripcion, requiere_administrador
)
VALUES
  ('CU20', TRUE, 'M2', 'CONSULTAR_COTIZACION_PREEXISTENTE', 'Nombre CU20 preexistente', 'Descripción CU20 preexistente', FALSE),
  ('CU36', TRUE, 'M2', 'REGISTRAR_DOCUMENTO_PREEXISTENTE', 'Nombre CU36 preexistente', 'Descripción CU36 preexistente', FALSE);

INSERT INTO terreno.perfil (
  perfil_nombre_perfil, perfil_descripcion, codigo_m4, activo_m4, admite_particulares
)
VALUES (
  'Perfil CI M4 preexistente', 'Fixture sintético exclusivo del workflow aislado',
  'CI_M4_PREEXISTENTE', TRUE, TRUE
);

INSERT INTO terreno.usuario (acceso_m4, usuario_estado_cuenta)
VALUES ('ci_m4_preexistente', 'activo');

INSERT INTO terreno.perfil_permiso (perfil_id_perfil, permiso_id_permiso, perfil_permiso_activo)
SELECT perfil.perfil_id_perfil, permiso.permiso_id_permiso, TRUE
FROM terreno.perfil perfil
JOIN terreno.permiso permiso ON permiso.codigo_m4 = 'CU20'
WHERE perfil.codigo_m4 = 'CI_M4_PREEXISTENTE';

INSERT INTO terreno.usuario_permiso_particular (id_usuario, id_permiso)
SELECT usuario.usuario_id_usuario, permiso.permiso_id_permiso
FROM terreno.usuario usuario
JOIN terreno.permiso permiso ON permiso.codigo_m4 = 'CU36'
WHERE usuario.acceso_m4 = 'ci_m4_preexistente';

CREATE TABLE public.validacion_m4_preexistente AS
SELECT
  permiso.codigo_m4,
  permiso.permiso_id_permiso,
  permiso.permiso_modulo,
  permiso.permiso_accion,
  permiso.permiso_nombre_del_permiso,
  permiso.permiso_descripcion,
  permiso.activo_m4,
  permiso.requiere_administrador,
  (SELECT COUNT(*) FROM terreno.perfil_permiso pp WHERE pp.permiso_id_permiso = permiso.permiso_id_permiso) AS asignaciones_perfil,
  (SELECT COUNT(*) FROM terreno.usuario_permiso_particular up WHERE up.id_permiso = permiso.permiso_id_permiso) AS asignaciones_particulares,
  (SELECT COUNT(*) FROM terreno.perfil) AS perfiles_totales,
  (SELECT COUNT(*) FROM terreno.usuario) AS usuarios_totales
FROM terreno.permiso permiso
WHERE permiso.codigo_m4 IN ('CU20', 'CU36');

COMMIT;

\echo 'Fixture compatible CU20/CU36 preparado antes de aplicar 075'
