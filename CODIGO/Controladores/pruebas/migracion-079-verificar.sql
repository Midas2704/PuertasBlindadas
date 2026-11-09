\set ON_ERROR_STOP on

DO $$
DECLARE total_permisos integer;
BEGIN
  SELECT count(*) INTO total_permisos FROM comun.permiso WHERE codigo_m4 IS NOT NULL;

  ASSERT (SELECT count(*) FROM comun.usuario) = (SELECT valor::integer FROM public.ci_estado_previo_079 WHERE clave='usuarios'),
    '079 no debe eliminar usuarios';
  ASSERT (SELECT count(*) FROM comun.usuario_contrasena) = (SELECT valor::integer FROM public.ci_estado_previo_079 WHERE clave='credenciales'),
    '079 no debe eliminar credenciales';
  ASSERT (SELECT string_agg(usuario_contrasena,',' ORDER BY usuario_contrasena) FROM comun.usuario_contrasena WHERE usuario_id_usuario IN (SELECT usuario_id_usuario FROM comun.usuario WHERE acceso_m4 IN ('Midas','ci-ordinario-079','ci-personalizado-079'))) = (SELECT valor FROM public.ci_estado_previo_079 WHERE clave='hashes'),
    '079 no debe modificar contraseñas';
  ASSERT (SELECT count(*) FROM comun.usuario_permiso_particular upp JOIN comun.usuario u ON u.usuario_id_usuario=upp.id_usuario WHERE u.acceso_m4='Midas') = total_permisos,
    'Midas debe conservar una asignación idempotente para cada CU registrado';
  ASSERT (SELECT count(*) FROM comun.usuario_permiso_particular upp JOIN comun.usuario u ON u.usuario_id_usuario=upp.id_usuario WHERE u.acceso_m4='ci-ordinario-079') = (SELECT valor::integer FROM public.ci_estado_previo_079 WHERE clave='asignaciones_ordinario'),
    '079 no debe conceder permisos a usuarios ordinarios';
  ASSERT (SELECT count(*) FROM comun.usuario_permiso_particular upp JOIN comun.usuario u ON u.usuario_id_usuario=upp.id_usuario WHERE u.acceso_m4='ci-personalizado-079') = (SELECT valor::integer FROM public.ci_estado_previo_079 WHERE clave='asignaciones_personalizado'),
    '079 no debe alterar permisos personalizados de otros usuarios';
  ASSERT (SELECT configuracion_particular AND version_seguridad=8 FROM comun.usuario WHERE acceso_m4='Midas'),
    '079 debe activar configuración particular e invalidar sesiones anteriores de Midas una sola vez';
  ASSERT (SELECT version_seguridad=3 FROM comun.usuario WHERE acceso_m4='ci-ordinario-079'),
    '079 no debe cambiar la seguridad de usuarios ordinarios';
  ASSERT (SELECT version_seguridad=5 FROM comun.usuario WHERE acceso_m4='ci-personalizado-079'),
    '079 no debe cambiar la seguridad de usuarios personalizados';
  ASSERT (SELECT count(*)=1 FROM comun.sesion_usuario s JOIN comun.usuario u ON u.usuario_id_usuario=s.id_usuario WHERE u.acceso_m4='Midas' AND s.version_seguridad<>u.version_seguridad),
    'la sesión previa de Midas debe quedar invalidada por versión';
  ASSERT (SELECT activo_m4=FALSE AND requiere_administrador=TRUE FROM comun.permiso WHERE codigo_m4='CU377'),
    'CU377 debe permanecer inactivo y administrativo';
  ASSERT NOT EXISTS (SELECT 1 FROM comun.permiso p JOIN comun.usuario_permiso_particular upp ON upp.id_permiso=p.permiso_id_permiso JOIN comun.usuario u ON u.usuario_id_usuario=upp.id_usuario WHERE u.acceso_m4='Midas' AND p.codigo_m4='CU377' AND p.activo_m4),
    'CU377 no puede convertirse en permiso efectivo';
  ASSERT (SELECT count(*)=7 AND bool_and(NOT activo_m4) FROM comun.permiso WHERE codigo_m4 IN ('CU466','CU467','CU468','CU469','CU470','CU471','CU472')),
    'CU466-CU472 deben continuar inactivos';
END $$;

DROP TABLE public.ci_estado_previo_079;
