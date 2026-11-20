\set ON_ERROR_STOP on

DO $guard$
BEGIN
  IF current_database() <> 'pblindadas_demo_build' THEN
    RAISE EXCEPTION 'Este saneamiento sólo puede ejecutarse en pblindadas_demo_build; base actual: %', current_database();
  END IF;
END
$guard$;

BEGIN;

-- La copia pública no conserva sesiones, recuperación ni hashes de claves previos.
DELETE FROM comun.sesion_usuario;
DELETE FROM comun.token_recuperacion;

WITH ordenadas AS (
  SELECT ctid,
         usuario_id_usuario,
         row_number() OVER (
           PARTITION BY usuario_id_usuario
           ORDER BY activa DESC, creada DESC, ctid DESC
         ) AS posicion
  FROM comun.usuario_contrasena
)
UPDATE comun.usuario_contrasena AS c
SET usuario_contrasena = format(
      'redactado$distribucion$%s$%s',
      o.usuario_id_usuario,
      o.posicion
    ),
    activa = false,
    invalidada = COALESCE(c.invalidada, now()),
    temporal = false,
    vence = NULL
FROM ordenadas AS o
WHERE c.ctid = o.ctid;

-- Activa sólo la fila más reciente de cada usuario que ya tenía credenciales.
WITH vigentes AS (
  SELECT DISTINCT ON (usuario_id_usuario) ctid
  FROM comun.usuario_contrasena
  ORDER BY usuario_id_usuario, creada DESC, ctid DESC
)
UPDATE comun.usuario_contrasena AS c
SET usuario_contrasena = :'demo_password_hash',
    activa = true,
    invalidada = NULL,
    temporal = false,
    vence = TIMESTAMPTZ '2036-12-31 23:59:59+00'
FROM vigentes AS v
WHERE c.ctid = v.ctid;

UPDATE comun.estado_seguridad_usuario
SET intentos = 0,
    bloqueos = 0,
    bloqueo_hasta = NULL,
    bloqueo_persistente = false,
    actualizado = now(),
    responsable = 'distribucion-demo-publica';

UPDATE comun.usuario
SET version_seguridad = version_seguridad + 1;

COMMIT;

SELECT (
  (SELECT count(*) FROM comun.sesion_usuario) = 0
  AND (SELECT count(*) FROM comun.token_recuperacion) = 0
  AND NOT EXISTS (
    SELECT 1
    FROM comun.usuario_contrasena
    WHERE activa
    GROUP BY usuario_id_usuario
    HAVING count(*) <> 1
  )
  AND NOT EXISTS (
    SELECT 1
    FROM comun.usuario_contrasena
    WHERE activa AND usuario_contrasena <> :'demo_password_hash'
  )
  AND NOT EXISTS (
    SELECT 1
    FROM comun.usuario_contrasena
    WHERE NOT activa
      AND usuario_contrasena !~ '^redactado\$distribucion\$[0-9]+\$[0-9]+$'
  )
) AS saneamiento_ok
\gset

\if :saneamiento_ok
\echo 'Autenticación de distribución saneada correctamente.'
\else
\echo 'ERROR: falló la validación del saneamiento de autenticación.'
\quit 3
\endif
