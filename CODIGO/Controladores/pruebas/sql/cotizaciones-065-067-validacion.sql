-- Ejecutar únicamente sobre una base descartable ya migrada hasta 067.
BEGIN;

INSERT INTO finanzas.precio_producto_comercial (
  id_precio_producto_comercial, id_extension_producto_comercial, segmento_comercial,
  id_moneda, monto, vigencia_desde, vigencia_hasta, creado_por
) VALUES
  (920001, 910001, 'B2C', 910001, 100000, DATE '2026-01-01', DATE '2026-12-31', 910001),
  (920002, 910001, 'B2B', 910001, 130000, DATE '2026-01-01', DATE '2026-12-31', 910001);

INSERT INTO finanzas.opcional_comercial (
  id_opcional_comercial, codigo, nombre, descripcion_b2c, creado_por
) VALUES (920001, 'OPC-TST-067', 'Opcional sintético', 'Sólo para prueba aislada', 910001);

INSERT INTO finanzas.compatibilidad_opcional_producto (
  id_compatibilidad_opcional, id_extension_producto_comercial, id_opcional_comercial,
  habilitado_b2c
) VALUES (920001, 910001, 920001, TRUE);

INSERT INTO finanzas.precio_opcional_comercial (
  id_precio_opcional_comercial, id_opcional_comercial, segmento_comercial,
  id_moneda, monto, vigencia_desde, vigencia_hasta, creado_por
) VALUES (920001, 920001, 'B2C', 910001, 5000, DATE '2026-01-01', DATE '2026-12-31', 910001);

INSERT INTO finanzas.tarifa_instalacion_comercial (
  id_tarifa_instalacion_comercial, alcance_geografico, region, region_normalizada,
  ciudad, comuna, comuna_normalizada, estado_cobertura, id_moneda, precio_comercial,
  vigencia_desde, vigencia_hasta, creado_por
) VALUES
  (920001, 'COMUNA', 'Metropolitana', 'METROPOLITANA', 'Santiago', 'Santiago', 'SANTIAGO', 'DISPONIBLE', 910001, 20000, DATE '2026-01-01', DATE '2026-12-31', 910001),
  (920002, 'REGION', 'Metropolitana', 'METROPOLITANA', NULL, NULL, NULL, 'DISPONIBLE', 910001, 30000, DATE '2026-01-01', DATE '2026-12-31', 910001),
  (920003, 'REGION', 'Valparaíso', 'VALPARAISO', NULL, NULL, NULL, 'REQUIERE_EVALUACION', NULL, NULL, DATE '2026-01-01', DATE '2026-12-31', 910001),
  (920004, 'REGION', 'Aysén', 'AYSEN', NULL, NULL, NULL, 'NO_DISPONIBLE', NULL, NULL, DATE '2026-01-01', DATE '2026-12-31', 910001),
  (920005, 'REGION', 'Los Lagos', 'LOS LAGOS', NULL, NULL, NULL, 'DISPONIBLE', 910001, 45000, DATE '2024-01-01', DATE '2024-12-31', 910001);

DO $$
DECLARE tarifa BIGINT;
BEGIN
  SELECT id_tarifa_instalacion_comercial INTO tarifa
  FROM finanzas.tarifa_instalacion_comercial
  WHERE estado = 'ACTIVA'
    AND DATE '2026-10-15' BETWEEN vigencia_desde AND COALESCE(vigencia_hasta, DATE 'infinity')
    AND region_normalizada = 'METROPOLITANA'
    AND ((alcance_geografico = 'COMUNA' AND comuna_normalizada = 'SANTIAGO') OR alcance_geografico = 'REGION')
  ORDER BY CASE alcance_geografico WHEN 'COMUNA' THEN 0 ELSE 1 END
  LIMIT 1;
  IF tarifa IS DISTINCT FROM 920001 THEN RAISE EXCEPTION 'No prevaleció la tarifa comunal exacta'; END IF;

  SELECT id_tarifa_instalacion_comercial INTO tarifa
  FROM finanzas.tarifa_instalacion_comercial
  WHERE estado = 'ACTIVA'
    AND DATE '2026-10-15' BETWEEN vigencia_desde AND COALESCE(vigencia_hasta, DATE 'infinity')
    AND region_normalizada = 'METROPOLITANA'
    AND ((alcance_geografico = 'COMUNA' AND comuna_normalizada = 'PROVIDENCIA') OR alcance_geografico = 'REGION')
  ORDER BY CASE alcance_geografico WHEN 'COMUNA' THEN 0 ELSE 1 END
  LIMIT 1;
  IF tarifa IS DISTINCT FROM 920002 THEN RAISE EXCEPTION 'No se aplicó fallback regional'; END IF;

  IF EXISTS (
    SELECT 1 FROM finanzas.tarifa_instalacion_comercial
    WHERE region_normalizada = 'COQUIMBO' AND estado = 'ACTIVA'
      AND DATE '2026-10-15' BETWEEN vigencia_desde AND COALESCE(vigencia_hasta, DATE 'infinity')
  ) THEN RAISE EXCEPTION 'La ausencia de tarifa fue inventada'; END IF;

  IF EXISTS (
    SELECT 1 FROM finanzas.tarifa_instalacion_comercial
    WHERE region_normalizada = 'LOS LAGOS' AND estado = 'ACTIVA'
      AND DATE '2026-10-15' BETWEEN vigencia_desde AND COALESCE(vigencia_hasta, DATE 'infinity')
  ) THEN RAISE EXCEPTION 'Una tarifa vencida quedó vigente'; END IF;
END;
$$;

DO $$
BEGIN
  BEGIN
    INSERT INTO finanzas.tarifa_instalacion_comercial (
      alcance_geografico, region, region_normalizada, comuna, comuna_normalizada,
      estado_cobertura, id_moneda, precio_comercial, vigencia_desde, vigencia_hasta, creado_por
    ) VALUES ('COMUNA', 'Metropolitana', 'METROPOLITANA', 'Santiago', 'SANTIAGO',
      'DISPONIBLE', 910001, 21000, DATE '2026-06-01', DATE '2027-01-01', 910001);
    RAISE EXCEPTION 'Se permitió una vigencia superpuesta';
  EXCEPTION WHEN exclusion_violation THEN NULL;
  END;

  BEGIN
    INSERT INTO finanzas.tarifa_instalacion_comercial (
      alcance_geografico, region, region_normalizada, estado_cobertura,
      vigencia_desde, vigencia_hasta, creado_por
    ) VALUES ('REGION', 'Biobío', 'BIOBIO', 'DISPONIBLE', DATE '2026-01-01', DATE '2026-12-31', 910001);
    RAISE EXCEPTION 'Se permitió cobertura disponible sin precio';
  EXCEPTION WHEN check_violation THEN NULL;
  END;
END;
$$;

INSERT INTO finanzas.grupo_alternativas_b2c (
  id_grupo_alternativas_b2c, id_cotizacion, numero_grupo, titulo
) VALUES (920001, 910002, 1, 'Comparación sintética');

INSERT INTO finanzas.alternativa_b2c (
  id_alternativa_b2c, id_grupo_alternativas_b2c, numero_alternativa,
  id_extension_producto_comercial, id_producto_comercial_version,
  id_precio_producto_comercial, id_moneda, cantidad, configuracion_snapshot,
  precio_unitario, monto_neto, monto_impuesto, monto_total,
  estado, decidida_en, decidida_por, motivo_decision
) VALUES
  (920001, 920001, 1, 910001, 910001, 920001, 910001, 1, '{"modelo":"descartado"}', 100000, 100000, 19000, 119000, 'RECHAZADA', CURRENT_TIMESTAMP, 910001, 'Alternativa descartada sintética'),
  (920002, 920001, 2, 910001, 910001, 920001, 910001, 1, '{"modelo":"aceptado"}', 100000, 100000, 19000, 119000, 'ACEPTADA', CURRENT_TIMESTAMP, 910001, 'Alternativa aceptada sintética');

INSERT INTO finanzas.alternativa_b2c_opcional (
  id_alternativa_b2c_opcional, id_alternativa_b2c, id_compatibilidad_opcional,
  id_precio_opcional_comercial, cantidad, precio_unitario, snapshot_opcional
) VALUES (920001, 920002, 920001, 920001, 1, 5000, '{"nombre":"Opcional sintético"}');

INSERT INTO finanzas.historial_decision_alternativa_b2c (
  id_historial_decision, id_alternativa_b2c, estado_anterior, estado_nuevo, motivo, actor_id
) VALUES (920001, 920002, 'PROPUESTA', 'ACEPTADA', 'Selección sintética', 910001);

DO $$
BEGIN
  BEGIN
    INSERT INTO finanzas.alternativa_b2c (
      id_grupo_alternativas_b2c, numero_alternativa, id_extension_producto_comercial,
      id_producto_comercial_version, id_precio_producto_comercial, id_moneda, cantidad,
      configuracion_snapshot, precio_unitario, monto_neto, monto_impuesto, monto_total
    ) VALUES (920001, 3, 910001, 910001, 920002, 910001, 1, '{}', 130000, 130000, 24700, 154700);
    RAISE EXCEPTION 'Se permitió una combinación B2B en alternativas B2C';
  EXCEPTION WHEN raise_exception THEN
    IF SQLERRM = 'Se permitió una combinación B2B en alternativas B2C' THEN RAISE; END IF;
  END;

  BEGIN
    UPDATE finanzas.detalle_cotizacion
    SET id_extension_producto_comercial = 910001,
        id_producto_comercial_version = 910001,
        id_precio_producto_comercial = 920001,
        id_alternativa_b2c_aceptada = 920001
    WHERE id_detalle_cotizacion = 910002;
    RAISE EXCEPTION 'Se permitió contratar una alternativa rechazada';
  EXCEPTION WHEN raise_exception THEN
    IF SQLERRM = 'Se permitió contratar una alternativa rechazada' THEN RAISE; END IF;
  END;
END;
$$;

UPDATE finanzas.detalle_cotizacion
SET id_extension_producto_comercial = 910001,
    id_producto_comercial_version = 910001,
    id_precio_producto_comercial = 920001,
    id_alternativa_b2c_aceptada = 920002
WHERE id_detalle_cotizacion = 910002;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM finanzas.detalle_cotizacion WHERE id_alternativa_b2c_aceptada = 920001) THEN
    RAISE EXCEPTION 'La alternativa descartada generó detalle contratado';
  END IF;
  IF (SELECT monto_total_estimado FROM finanzas.cotizacion WHERE id_cotizacion = 910002) <> 119000 THEN
    RAISE EXCEPTION 'Las alternativas modificaron el monto de venta';
  END IF;
  IF EXISTS (SELECT 1 FROM finanzas.nota_venta WHERE id_cotizacion = 910002) THEN
    RAISE EXCEPTION 'Las alternativas generaron Nota de Venta';
  END IF;
  IF EXISTS (SELECT 1 FROM finanzas.unidad_fisica_orden_trabajo WHERE id_cotizacion = 910002) THEN
    RAISE EXCEPTION 'Las alternativas generaron Orden de Trabajo';
  END IF;
END;
$$;

INSERT INTO finanzas.condicion_comercial (
  id_condicion_comercial, codigo, nombre, segmento, creado_por
) VALUES (920001, 'COND-B2C-TST', 'Condición B2C sintética', 'B2C', 910001);
INSERT INTO finanzas.condicion_comercial_version (
  id_condicion_comercial_version, id_condicion_comercial, numero_version, contenido,
  vigencia_desde, estado, motivo, publicado_por, publicado_en
) VALUES (920001, 920001, 1, '{"pago":"sintético"}', DATE '2026-01-01', 'PUBLICADA', 'Prueba aislada', 910001, CURRENT_TIMESTAMP);

INSERT INTO finanzas.plantilla_documental_comercial (
  id_plantilla_documental, codigo, nombre, tipo_documento, segmento, creado_por
) VALUES (920001, 'CARTA-B2C-TST', 'Carta B2C sintética', 'CARTA_GENERAL', 'CARTA_B2C', 910001);
INSERT INTO finanzas.plantilla_documental_version (
  id_plantilla_documental_version, id_plantilla_documental, numero_version,
  esquema_contenido, id_condicion_comercial_version, estado, motivo, publicado_por, publicado_en
) VALUES (920001, 920001, 1, '{"bloques":[]}', 920001, 'PUBLICADA', 'Prueba aislada', 910001, CURRENT_TIMESTAMP);

INSERT INTO finanzas.documento_logico (
  id_documento_logico, titulo, clasificacion, es_historico, numero_version_actual, creado_por
) VALUES
  (920001, 'Carta B2C sintética', 'COMERCIAL', TRUE, 1, 910001),
  (920002, 'Cotización B2C sintética', 'COTIZACION', TRUE, 1, 910001),
  (920003, 'Fotografía sintética', 'COMERCIAL', TRUE, 1, 910001);

INSERT INTO finanzas.version_documento (
  id_version_documento, id_documento_logico, numero_version, proveedor_logico,
  contenedor_logico, clave_objeto, nombre_original, nombre_seguro, mime_declarado,
  mime_detectado, tamano_bytes, sha256, estado, creado_por, validado_en, resultado_validaciones
) VALUES
  (920001, 920001, 1, 'R2', 'prueba-aislada', 'objects/11111111-1111-4111-8111-111111111111', 'carta.pdf', 'carta.pdf', 'application/pdf', 'application/pdf', 100, repeat('a',64), 'DISPONIBLE', 910001, CURRENT_TIMESTAMP, '{"solo_metadatos":true}'),
  (920002, 920002, 1, 'R2', 'prueba-aislada', 'objects/22222222-2222-4222-8222-222222222222', 'cotizacion.pdf', 'cotizacion.pdf', 'application/pdf', 'application/pdf', 100, repeat('b',64), 'DISPONIBLE', 910001, CURRENT_TIMESTAMP, '{"solo_metadatos":true}'),
  (920003, 920003, 1, 'R2', 'prueba-aislada', 'objects/33333333-3333-4333-8333-333333333333', 'foto.jpg', 'foto.jpg', 'image/jpeg', 'image/jpeg', 100, repeat('c',64), 'DISPONIBLE', 910001, CURRENT_TIMESTAMP, '{"solo_metadatos":true}');

INSERT INTO finanzas.producto_comercial_documento (
  id_producto_comercial_documento, id_extension_producto_comercial, id_documento_logico,
  tipo_documento, es_imagen_principal, habilitado_b2c, usuario_responsable
) VALUES (920001, 910001, 920003, 'FOTOGRAFIA_COMERCIAL', TRUE, TRUE, 910001);

INSERT INTO finanzas.carta_comercial_b2c (
  id_carta_comercial_b2c, codigo, titulo, contenido_borrador, creado_por
) VALUES (920001, 'CARTA-GENERAL-TST', 'Carta general sintética', '{"borrador":true}', 910001);
INSERT INTO finanzas.carta_comercial_b2c_version (
  id_carta_comercial_b2c_version, id_carta_comercial_b2c, numero_version,
  id_plantilla_documental_version, id_condicion_comercial_version, snapshot_publicacion,
  id_documento_logico, estado_documental, clave_idempotencia, motivo, publicado_por
) VALUES (920001, 920001, 1, 920001, 920001, '{"publicacion":"sintética"}', 920001,
  'PENDIENTE_DOCUMENTO', 'carta-b2c-tst-920001', 'Prueba aislada', 910001);
INSERT INTO finanzas.carta_comercial_b2c_version_producto (
  id_carta_version_producto, id_carta_comercial_b2c_version, id_producto_comercial_version,
  id_precio_producto_comercial, orden_presentacion, snapshot_producto
) VALUES (920001, 920001, 910001, 920001, 0, '{"producto":"sintético"}');
INSERT INTO finanzas.carta_comercial_b2c_version_fotografia (
  id_carta_version_fotografia, id_carta_comercial_b2c_version,
  id_producto_comercial_documento, id_version_documento, orden_presentacion
) VALUES (920001, 920001, 920001, 920003, 0);
UPDATE finanzas.carta_comercial_b2c_version
SET estado_documental = 'DISPONIBLE', confirmado_en = CURRENT_TIMESTAMP
WHERE id_carta_comercial_b2c_version = 920001;

DO $$
BEGIN
  BEGIN
    UPDATE finanzas.carta_comercial_b2c_version_producto
    SET snapshot_producto = '{"alterado":true}'
    WHERE id_carta_version_producto = 920001;
    RAISE EXCEPTION 'Se permitió mutar una publicación disponible';
  EXCEPTION WHEN raise_exception THEN
    IF SQLERRM = 'Se permitió mutar una publicación disponible' THEN RAISE; END IF;
  END;

  BEGIN
    UPDATE finanzas.cotizacion SET estado_cotizacion = 'emitida' WHERE id_cotizacion = 910002;
    RAISE EXCEPTION 'Se permitió emitir sin versión documental';
  EXCEPTION WHEN raise_exception THEN
    IF SQLERRM = 'Se permitió emitir sin versión documental' THEN RAISE; END IF;
  END;
END;
$$;

INSERT INTO finanzas.cotizacion_version (
  id_cotizacion, antecedentes, motivo, numero_version_comercial, tipo_version,
  snapshot_comercial, id_documento_logico, estado_documental,
  usuario_id_usuario, clave_idempotencia
) VALUES (910002, '{"origen":"prueba-067"}', 'Emisión sintética', 1, 'EMISION',
  '{"monto_total":119000}', 920002, 'DISPONIBLE', 910001, 'cotizacion-tst-910002-v1');
UPDATE finanzas.cotizacion SET estado_cotizacion = 'emitida' WHERE id_cotizacion = 910002;

COMMIT;

SELECT 'VALIDACION_SQL_065_067_OK' AS resultado;
