\set ON_ERROR_STOP on

BEGIN;

CREATE OR REPLACE FUNCTION pg_temp.afirmar(condicion boolean, mensaje text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  IF condicion IS DISTINCT FROM TRUE THEN
    RAISE EXCEPTION 'VALIDACION_AISLADA: %', mensaje;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION pg_temp.esperar_error(sentencia text, codigo_esperado text, mensaje text)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  BEGIN
    EXECUTE sentencia;
  EXCEPTION WHEN OTHERS THEN
    IF SQLSTATE = codigo_esperado THEN
      RETURN;
    END IF;
    RAISE EXCEPTION 'VALIDACION_AISLADA: % (SQLSTATE esperado %, recibido %: %)',
      mensaje, codigo_esperado, SQLSTATE, SQLERRM;
  END;
  RAISE EXCEPTION 'VALIDACION_AISLADA: % (la sentencia no fue rechazada)', mensaje;
END;
$$;

-- Existencia de las estructuras creadas por 072, 073 y 074.
SELECT pg_temp.afirmar(to_regclass('finanzas.presupuesto_manual_m10') IS NOT NULL, 'falta presupuesto_manual_m10');
SELECT pg_temp.afirmar(to_regclass('finanzas.version_presupuesto_m10') IS NOT NULL, 'falta version_presupuesto_m10');
SELECT pg_temp.afirmar(to_regclass('finanzas.detalle_presupuesto_m10') IS NOT NULL, 'falta detalle_presupuesto_m10');
SELECT pg_temp.afirmar(to_regclass('finanzas.linea_orden_compra_b2b') IS NOT NULL, 'falta linea_orden_compra_b2b');
SELECT pg_temp.afirmar(to_regclass('finanzas.correspondencia_linea_oc_item_tecnico') IS NOT NULL, 'falta correspondencia_linea_oc_item_tecnico');
SELECT pg_temp.afirmar(to_regclass('finanzas.correccion_documental_m11') IS NOT NULL, 'falta correccion_documental_m11');
SELECT pg_temp.afirmar(to_regclass('finanzas.hallazgo_discrepancia_m11') IS NOT NULL, 'falta hallazgo_discrepancia_m11');
SELECT pg_temp.afirmar(to_regclass('finanzas.resolucion_hallazgo_m11') IS NOT NULL, 'falta resolucion_hallazgo_m11');

-- Restricciones, índices y unicidades relevantes.
DO $$
DECLARE
  nombre text;
BEGIN
  FOREACH nombre IN ARRAY ARRAY[
    'ck_presupuesto_m10_anio',
    'uq_presupuesto_m10_identidad',
    'fk_presupuesto_m10_moneda',
    'fk_presupuesto_m10_creador',
    'uq_version_presupuesto_m10_numero',
    'uq_detalle_presupuesto_m10_partida',
    'fk_orden_compra_oferta_aceptada',
    'ck_orden_compra_estado_cotejo',
    'uq_linea_oc_numero',
    'fk_linea_oc_orden_compra',
    'fk_correspondencia_item_tecnico',
    'ck_correccion_m11_original',
    'ck_correccion_m11_documentos_distintos',
    'fk_hallazgo_m11_linea_oc',
    'fk_resolucion_m11_hallazgo'
  ] LOOP
    PERFORM pg_temp.afirmar(
      EXISTS (SELECT 1 FROM pg_constraint WHERE conname = nombre),
      'falta la restricción ' || nombre
    );
  END LOOP;

  FOREACH nombre IN ARRAY ARRAY[
    'idx_presupuesto_m10_anio_estado',
    'idx_version_presupuesto_m10_historial',
    'idx_detalle_presupuesto_m10_mes',
    'idx_orden_compra_oferta_aceptada',
    'idx_linea_oc_detalle',
    'idx_correspondencia_linea_oc_unidad',
    'idx_correccion_m11_guia',
    'idx_correccion_m11_oc',
    'idx_correccion_m11_documento',
    'idx_hallazgo_m11_oc_estado',
    'idx_resolucion_m11_hallazgo'
  ] LOOP
    PERFORM pg_temp.afirmar(
      to_regclass('finanzas.' || nombre) IS NOT NULL,
      'falta el índice ' || nombre
    );
  END LOOP;
END;
$$;

-- Relaciones entre schemas y tablas propietarias, sin inventar vínculos.
SELECT pg_temp.afirmar(
  EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'fk_presupuesto_m10_creador'
      AND conrelid = 'finanzas.presupuesto_manual_m10'::regclass
      AND confrelid = 'terreno.usuario'::regclass
  ),
  'la FK de creador M10 no conecta finanzas con terreno.usuario'
);
SELECT pg_temp.afirmar(
  EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'fk_correspondencia_item_tecnico'
      AND conrelid = 'finanzas.correspondencia_linea_oc_item_tecnico'::regclass
      AND confrelid = 'finanzas.unidad_fisica_orden_trabajo'::regclass
  ),
  'la correspondencia M11 no referencia la unidad física canónica'
);
SELECT pg_temp.afirmar(
  EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'fk_correccion_m11_actor'
      AND conrelid = 'finanzas.correccion_documental_m11'::regclass
      AND confrelid = 'terreno.usuario'::regclass
  ),
  'la corrección documental M11 no referencia al actor de terreno'
);

-- Columnas aditivas de 073 sobre la OC histórica.
SELECT pg_temp.afirmar(
  (SELECT count(*) = 4 FROM information_schema.columns
   WHERE table_schema = 'finanzas' AND table_name = 'orden_compra_b2b'
     AND column_name IN ('id_version_oferta_aceptada','estado_cotejo','resultado_cotejo','revision')),
  'faltan columnas aditivas de la migración 073'
);

-- Catálogo M4 incorporado por 072 y 074; CU377 debe seguir fuera del catálogo.
SELECT pg_temp.afirmar(
  (SELECT count(*) = 7 FROM terreno.permiso
   WHERE codigo_m4 IN ('CU446','CU447','CU449','CU451','CU458','CU459','CU461')
     AND activo_m4 IS TRUE),
  'faltan capacidades M10/M11 activas'
);
SELECT pg_temp.afirmar(
  NOT EXISTS (SELECT 1 FROM terreno.permiso WHERE codigo_m4 = 'CU377'),
  'CU377 fue incorporado pese a estar expresamente excluido'
);
SELECT pg_temp.afirmar(
  (SELECT count(*) = 3
   FROM terreno.permiso_dependencia d
   JOIN terreno.permiso p ON p.permiso_id_permiso = d.id_permiso
   JOIN terreno.permiso r ON r.permiso_id_permiso = d.id_requerido
   WHERE (p.codigo_m4, r.codigo_m4) IN (('CU458','CU36'),('CU459','CU20'),('CU461','CU459'))),
  'faltan dependencias M4 de la migración 074'
);

-- Datos sintéticos M10: inserción válida, unicidad y CHECK reales.
INSERT INTO terreno.usuario (usuario_username, acceso_m4, usuario_estado_cuenta)
VALUES ('ci_migraciones_072_074', 'ci_migraciones_072_074', 'activo')
RETURNING usuario_id_usuario AS actor_ci \gset

INSERT INTO finanzas.moneda (codigo_moneda, nombre_moneda, simbolo_moneda, estado_moneda)
VALUES ('TST', 'Moneda sintética CI', '$', 'activo')
RETURNING id_moneda AS moneda_ci \gset

INSERT INTO finanzas.presupuesto_manual_m10 (anio, ambito, id_moneda, creado_por)
VALUES (2099, 'CI_AISLADA', :moneda_ci, :actor_ci)
RETURNING id_presupuesto_manual_m10 AS presupuesto_ci \gset

INSERT INTO finanzas.version_presupuesto_m10
  (id_presupuesto_manual_m10, numero_version, tipo_version, revision_base, creado_por)
VALUES (:presupuesto_ci, 1, 'ORIGINAL', 1, :actor_ci)
RETURNING id_version_presupuesto_m10 AS version_ci \gset

INSERT INTO finanzas.detalle_presupuesto_m10
  (id_version_presupuesto_m10, mes, tipo, categoria, monto)
VALUES
  (:version_ci, 1, 'RESULTADOS', 'VENTAS_SINTETICAS', 1000.00),
  (:version_ci, 2, 'FLUJO_CAJA', 'CAJA_SINTETICA', 500.00);

SELECT pg_temp.afirmar(
  (SELECT count(*) = 2 FROM finanzas.detalle_presupuesto_m10 WHERE id_version_presupuesto_m10 = :version_ci),
  'los datos sintéticos M10 no persistieron correctamente'
);

SELECT pg_temp.esperar_error(
  format('INSERT INTO finanzas.presupuesto_manual_m10 (anio, ambito, id_moneda, creado_por) VALUES (2099, %L, %s, %s)', 'CI_AISLADA', :moneda_ci, :actor_ci),
  '23505',
  'la unicidad anual/ámbito/moneda de M10 no rechazó un duplicado'
);
SELECT pg_temp.esperar_error(
  format('INSERT INTO finanzas.detalle_presupuesto_m10 (id_version_presupuesto_m10, mes, tipo, categoria, monto) VALUES (%s, 13, %L, %L, 1)', :version_ci, 'RESULTADOS', 'MES_INVALIDO'),
  '23514',
  'el CHECK de mes M10 no rechazó mes 13'
);
SELECT pg_temp.esperar_error(
  format('INSERT INTO finanzas.version_presupuesto_m10 (id_presupuesto_manual_m10, numero_version, tipo_version, revision_base, creado_por) VALUES (%s, 2, %L, 1, %s)', :presupuesto_ci, 'NO_APROBADA', :actor_ci),
  '23514',
  'el CHECK de tipo de versión M10 no rechazó un tipo inválido'
);

-- Pruebas negativas M11 con referencias sintéticas inexistentes.
SELECT pg_temp.esperar_error(
  'INSERT INTO finanzas.linea_orden_compra_b2b (id_orden_compra_b2b, numero_linea) VALUES (2147483647, 1)',
  '23503',
  'una línea OC aceptó una orden inexistente'
);
SELECT pg_temp.esperar_error(
  format('INSERT INTO finanzas.correccion_documental_m11 (tipo_documento, actuacion, motivo, respaldo, snapshot_anterior, snapshot_resultado, actor_id, clave_idempotencia) VALUES (%L,%L,%L,%L,%L::jsonb,%L::jsonb,%s,%L)', 'GDE', 'CI', 'Sintético', 'ci://respaldo', '{}', '{}', :actor_ci, 'ci-correccion-invalida'),
  '23514',
  'una corrección GDE sin original ni correctora superó su CHECK'
);
SELECT pg_temp.esperar_error(
  format('INSERT INTO finanzas.hallazgo_discrepancia_m11 (id_orden_compra_b2b, etapa, tipo_discrepancia, referencias_origen, evidencia, contexto, clave_idempotencia, detectado_por) VALUES (2147483647,%L,%L,%L::jsonb,%L::jsonb,%L::jsonb,%L,%s)', 'ORDEN_VS_SALIDA', 'CI', '{}', '{}', '{}', 'ci-hallazgo-inexistente', :actor_ci),
  '23503',
  'un hallazgo aceptó una OC inexistente'
);

ROLLBACK;

\echo 'Pruebas estructurales y sintéticas de migraciones 072-074: APROBADAS'
