


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA "comun";



CREATE SCHEMA "finanzas";



CREATE SCHEMA "inventario";



CREATE SCHEMA "terreno";



CREATE EXTENSION IF NOT EXISTS "btree_gist" WITH SCHEMA "public";



CREATE FUNCTION "finanzas"."bloquear_detalle_publicacion_carta_b2c"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  version_id BIGINT;
BEGIN
  IF TG_OP = 'INSERT' THEN
    version_id := NEW."id_carta_comercial_b2c_version";
  ELSE
    version_id := OLD."id_carta_comercial_b2c_version";
  END IF;
  IF EXISTS (
    SELECT 1 FROM "finanzas"."carta_comercial_b2c_version" cv
    WHERE cv."id_carta_comercial_b2c_version" = version_id
      AND cv."estado_documental" IN ('DISPONIBLE','RETIRADA')
  ) THEN
    RAISE EXCEPTION 'El contenido de una carta B2C publicada es inmutable';
  END IF;
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  RETURN NEW;
END;
$$;



CREATE FUNCTION "finanzas"."bloquear_historial_alternativa_b2c"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RAISE EXCEPTION 'El historial de decisiones B2C es inmutable';
END;
$$;



CREATE FUNCTION "finanzas"."bloquear_mutacion_evento_auditoria_m9"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RAISE EXCEPTION 'La evidencia M9 es inmutable';
END;
$$;



CREATE FUNCTION "finanzas"."bloquear_mutacion_politica_m9"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$ BEGIN RAISE EXCEPTION 'Las versiones de política M9 son inmutables'; END; $$;



CREATE FUNCTION "finanzas"."bloquear_version_publicada"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  estado_anterior TEXT := COALESCE(to_jsonb(OLD)->>'estado_documental', to_jsonb(OLD)->>'estado');
BEGIN
  IF (TG_TABLE_NAME IN ('plantilla_documental_version','condicion_comercial_version') AND estado_anterior IN ('PUBLICADA','ARCHIVADA'))
     OR (TG_TABLE_NAME = 'carta_comercial_b2c_version' AND estado_anterior IN ('DISPONIBLE','RETIRADA'))
     OR (TG_TABLE_NAME = 'cotizacion_version' AND estado_anterior IN ('DISPONIBLE','REEMPLAZADA')) THEN
    RAISE EXCEPTION 'La versión publicada es inmutable';
  END IF;
  RETURN NEW;
END;
$$;



CREATE FUNCTION "finanzas"."exigir_documento_cotizacion_emitida"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NEW."segmento_comercial" IS NOT NULL
     AND NEW."estado_cotizacion" = 'emitida'
     AND OLD."estado_cotizacion" IS DISTINCT FROM NEW."estado_cotizacion"
     AND NOT EXISTS (
       SELECT 1 FROM "finanzas"."cotizacion_version" cv
       WHERE cv."id_cotizacion" = NEW."id_cotizacion"
         AND cv."tipo_version" IN ('EMISION','RECTIFICACION')
         AND cv."estado_documental" = 'DISPONIBLE'
     ) THEN
    RAISE EXCEPTION 'La cotización no puede emitirse sin PDF documental confirmado';
  END IF;
  RETURN NEW;
END;
$$;



CREATE FUNCTION "finanzas"."impedir_cambio_aplicacion_revision_ot"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$ BEGIN RAISE EXCEPTION 'La aplicación de una revisión técnica es inmutable' USING ERRCODE = '23514'; END; $$;



CREATE FUNCTION "finanzas"."impedir_cambio_cierre_produccion_ot"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$ BEGIN RAISE EXCEPTION 'El cierre productivo es inmutable' USING ERRCODE = '23514'; END; $$;



CREATE FUNCTION "finanzas"."impedir_cambio_decision_rectificacion_ot"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$ BEGIN RAISE EXCEPTION 'La decisión técnica es inmutable' USING ERRCODE = '23514'; END; $$;



CREATE FUNCTION "finanzas"."impedir_cambio_historial_produccion_ot"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$ BEGIN RAISE EXCEPTION 'El historial productivo es inmutable' USING ERRCODE = '23514'; END; $$;



CREATE FUNCTION "finanzas"."impedir_cambio_historial_rectificacion_ot"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$ BEGIN RAISE EXCEPTION 'El historial de rectificación es inmutable' USING ERRCODE = '23514'; END; $$;



CREATE FUNCTION "finanzas"."impedir_cambio_historial_unidad_fisica_ot"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$ BEGIN RAISE EXCEPTION 'El historial de planificación de OT es inmutable' USING ERRCODE = '23514'; END; $$;



CREATE FUNCTION "finanzas"."impedir_cambio_liberacion_ot"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$ BEGIN RAISE EXCEPTION 'La liberación de la OT es inmutable' USING ERRCODE = '23514'; END; $$;



CREATE FUNCTION "finanzas"."impedir_cambio_origen_tarea_ejecutable_ot"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$ BEGIN RAISE EXCEPTION 'El origen planificado de la tarea ejecutable es inmutable' USING ERRCODE = '23514'; END; $$;



CREATE FUNCTION "finanzas"."impedir_cambio_producto_comercial_version"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RAISE EXCEPTION 'Las versiones comerciales publicadas son inmutables' USING ERRCODE = '23514';
END;
$$;



CREATE FUNCTION "finanzas"."impedir_cambio_version_plantilla_fabricacion"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RAISE EXCEPTION 'Las versiones publicadas de plantillas de fabricación son inmutables' USING ERRCODE = '23514';
END;
$$;



CREATE FUNCTION "finanzas"."impedir_cambio_version_rectificacion_ot"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$ BEGIN RAISE EXCEPTION 'La versión enviada de rectificación es inmutable' USING ERRCODE = '23514'; END; $$;



CREATE FUNCTION "finanzas"."proteger_boleta_honorarios_confirmada"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF OLD.estado_documental = 'CONFIRMADA' THEN
    IF TG_OP = 'DELETE' THEN
      RAISE EXCEPTION 'Una boleta CONFIRMADA no puede eliminarse';
    END IF;
    IF NEW.id_prestador IS DISTINCT FROM OLD.id_prestador
       OR NEW.folio IS DISTINCT FROM OLD.folio
       OR NEW.fecha_emision IS DISTINCT FROM OLD.fecha_emision
       OR NEW.bruto IS DISTINCT FROM OLD.bruto
       OR NEW.modalidad_tributaria IS DISTINCT FROM OLD.modalidad_tributaria
       OR NEW.tasa_aplicada IS DISTINCT FROM OLD.tasa_aplicada
       OR NEW.retencion IS DISTINCT FROM OLD.retencion
       OR NEW.liquido IS DISTINCT FROM OLD.liquido
       OR NEW.estado_documental IS DISTINCT FROM OLD.estado_documental
       OR NEW.respaldo IS DISTINCT FROM OLD.respaldo
       OR NEW.referencia IS DISTINCT FROM OLD.referencia THEN
      RAISE EXCEPTION 'Una boleta CONFIRMADA es inmutable';
    END IF;
  END IF;
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END $$;



CREATE FUNCTION "finanzas"."proteger_borrado_origen_pago_remuneracion"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE id_origen INTEGER;
BEGIN
  id_origen := CASE TG_ARGV[0]
    WHEN 'REMUNERACION' THEN (to_jsonb(OLD)->>'id_remuneracion')::INTEGER
    WHEN 'ANTICIPO' THEN (to_jsonb(OLD)->>'id_anticipo')::INTEGER
    WHEN 'REGULARIZACION' THEN (to_jsonb(OLD)->>'id_regularizacion')::INTEGER
    WHEN 'BOLETA_HONORARIOS' THEN (to_jsonb(OLD)->>'id_boleta_honorarios')::INTEGER
  END;
  IF EXISTS (SELECT 1 FROM finanzas.pago_remuneracion WHERE origen_tipo = TG_ARGV[0] AND origen_id = id_origen) THEN RAISE EXCEPTION 'El origen posee pagos asociados'; END IF;
  RETURN OLD;
END $$;



CREATE FUNCTION "finanzas"."proteger_pago_remuneracion_confirmado"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF OLD.estado = 'CONFIRMADO' THEN
    IF NEW.estado = 'ANULADO' AND length(trim(NEW.motivo_anulacion)) > 0 AND NEW.anulado_por IS NOT NULL AND NEW.anulado_en IS NOT NULL
       AND NOT EXISTS (SELECT 1 FROM finanzas.reversion_pago_remuneracion WHERE id_pago_remuneracion = OLD.id_pago_remuneracion)
       AND NEW.id_pago_remuneracion IS NOT DISTINCT FROM OLD.id_pago_remuneracion AND NEW.origen_tipo IS NOT DISTINCT FROM OLD.origen_tipo
       AND NEW.origen_id IS NOT DISTINCT FROM OLD.origen_id AND NEW.monto IS NOT DISTINCT FROM OLD.monto AND NEW.id_medio_pago IS NOT DISTINCT FROM OLD.id_medio_pago
       AND NEW.respaldo IS NOT DISTINCT FROM OLD.respaldo AND NEW.referencia IS NOT DISTINCT FROM OLD.referencia AND NEW.clave_idempotencia IS NOT DISTINCT FROM OLD.clave_idempotencia
       AND NEW.creado_por IS NOT DISTINCT FROM OLD.creado_por AND NEW.creado_en IS NOT DISTINCT FROM OLD.creado_en
       AND NEW.confirmado_por IS NOT DISTINCT FROM OLD.confirmado_por AND NEW.confirmado_en IS NOT DISTINCT FROM OLD.confirmado_en THEN RETURN NEW;
    END IF;
    RAISE EXCEPTION 'Un pago confirmado sólo admite anulación controlada y sin reversiones';
  END IF;
  IF OLD.estado = 'ANULADO' THEN RAISE EXCEPTION 'Un pago anulado es inmutable'; END IF;
  RETURN NEW;
END $$;



CREATE FUNCTION "finanzas"."proteger_reversion_pago_remuneracion"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN RAISE EXCEPTION 'Una reversión registrada es inmutable'; END $$;



CREATE FUNCTION "finanzas"."validar_alternativa_b2c"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM "finanzas"."producto_comercial_version" pv
    JOIN "finanzas"."precio_producto_comercial" pp
      ON pp."id_precio_producto_comercial" = NEW."id_precio_producto_comercial"
    WHERE pv."id_producto_comercial_version" = NEW."id_producto_comercial_version"
      AND pv."id_extension_producto_comercial" = NEW."id_extension_producto_comercial"
      AND pp."id_extension_producto_comercial" = NEW."id_extension_producto_comercial"
      AND pp."segmento_comercial" = 'B2C'
      AND pp."id_moneda" = NEW."id_moneda"
      AND pp."monto" = NEW."precio_unitario"
      AND pp."estado" = 'ACTIVO'
  ) THEN
    RAISE EXCEPTION 'Producto, versión, precio y moneda no forman una alternativa B2C coherente';
  END IF;
  IF NEW."id_tarifa_instalacion_comercial" IS NULL AND NEW."precio_instalacion" IS NOT NULL THEN
    RAISE EXCEPTION 'Un precio de instalación requiere una tarifa comercial trazable';
  END IF;
  IF NEW."id_tarifa_instalacion_comercial" IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM "finanzas"."tarifa_instalacion_comercial" ti
    WHERE ti."id_tarifa_instalacion_comercial" = NEW."id_tarifa_instalacion_comercial"
      AND ti."id_moneda" = NEW."id_moneda"
      AND ti."estado" = 'ACTIVA'
      AND (
        (NEW."precio_instalacion" IS NULL AND ti."precio_comercial" IS NULL)
        OR ti."precio_comercial" = NEW."precio_instalacion"
      )
  ) THEN
    RAISE EXCEPTION 'La tarifa de instalación no coincide con la moneda y el precio conservados';
  END IF;
  RETURN NEW;
END;
$$;



CREATE FUNCTION "finanzas"."validar_contacto_cotizacion_b2b"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM "finanzas"."cotizacion" c WHERE c."id_cotizacion"=NEW."id_cotizacion" AND c."segmento_comercial"='B2B') THEN
    RAISE EXCEPTION 'Los contactos propios sólo se admiten en cotizaciones B2B';
  END IF;
  IF NEW."correo" IS NULL AND NEW."telefono" IS NULL THEN RAISE EXCEPTION 'El contacto debe incluir correo o teléfono'; END IF;
  RETURN NEW;
END; $$;



CREATE FUNCTION "finanzas"."validar_detalle_desde_alternativa_b2c"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NEW."id_alternativa_b2c_aceptada" IS NOT NULL AND NOT EXISTS (
    SELECT 1
    FROM "finanzas"."alternativa_b2c" a
    JOIN "finanzas"."grupo_alternativas_b2c" g ON g."id_grupo_alternativas_b2c" = a."id_grupo_alternativas_b2c"
    WHERE a."id_alternativa_b2c" = NEW."id_alternativa_b2c_aceptada"
      AND a."estado" = 'ACEPTADA'
      AND g."id_cotizacion" = NEW."id_cotizacion"
      AND a."id_extension_producto_comercial" = NEW."id_extension_producto_comercial"
      AND a."id_producto_comercial_version" = NEW."id_producto_comercial_version"
      AND a."id_precio_producto_comercial" = NEW."id_precio_producto_comercial"
  ) THEN
    RAISE EXCEPTION 'Sólo una alternativa aceptada y coherente puede transformarse en detalle contratado';
  END IF;
  RETURN NEW;
END;
$$;



CREATE FUNCTION "finanzas"."validar_detalle_servicio_c3_3"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM "finanzas"."precio_servicio_comercial" p JOIN "finanzas"."servicio_comercial" s ON s."id_servicio_comercial"=p."id_servicio_comercial"
    WHERE p."id_precio_servicio_comercial"=NEW."id_precio_servicio_comercial" AND p."id_servicio_comercial"=NEW."id_servicio_comercial" AND p."monto"=NEW."precio_unitario_autorizado" AND p."estado"='ACTIVO' AND s."estado"='ACTIVO'
  ) THEN RAISE EXCEPTION 'El precio de servicio no coincide con una versión activa'; END IF;
  RETURN NEW;
END; $$;



CREATE FUNCTION "finanzas"."validar_documento_disponible"("documento_id" bigint) RETURNS boolean
    LANGUAGE "sql" STABLE
    AS $$
  SELECT EXISTS (
    SELECT 1
    FROM "finanzas"."documento_logico" d
    JOIN "finanzas"."version_documento" v
      ON v."id_documento_logico" = d."id_documento_logico"
     AND v."numero_version" = d."numero_version_actual"
    WHERE d."id_documento_logico" = "documento_id"
      AND d."estado" = 'ACTIVO'
      AND v."estado" = 'DISPONIBLE'
  );
$$;



CREATE FUNCTION "finanzas"."validar_fotografia_carta_b2c"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM "finanzas"."producto_comercial_documento" pcd
    JOIN "finanzas"."version_documento" vd
      ON vd."id_version_documento" = NEW."id_version_documento"
     AND vd."id_documento_logico" = pcd."id_documento_logico"
    WHERE pcd."id_producto_comercial_documento" = NEW."id_producto_comercial_documento"
      AND pcd."tipo_documento" = 'FOTOGRAFIA_COMERCIAL'
      AND pcd."habilitado_b2c" = TRUE
      AND pcd."estado" = 'ACTIVO'
      AND vd."estado" = 'DISPONIBLE'
  ) THEN
    RAISE EXCEPTION 'La fotografía no está autorizada y disponible para publicación B2C';
  END IF;
  RETURN NEW;
END;
$$;



CREATE FUNCTION "finanzas"."validar_grupo_alternativas_b2c"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE segmento VARCHAR(3);
BEGIN
  SELECT c."segmento_comercial" INTO segmento
  FROM "finanzas"."cotizacion" c
  WHERE c."id_cotizacion" = NEW."id_cotizacion";
  IF segmento IS DISTINCT FROM 'B2C' THEN
    RAISE EXCEPTION 'Las alternativas sólo pueden asociarse a una cotización B2C explícita';
  END IF;
  RETURN NEW;
END;
$$;



CREATE FUNCTION "finanzas"."validar_opcional_alternativa_b2c"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM "finanzas"."alternativa_b2c" a
    JOIN "finanzas"."compatibilidad_opcional_producto" co
      ON co."id_compatibilidad_opcional" = NEW."id_compatibilidad_opcional"
    JOIN "finanzas"."precio_opcional_comercial" po
      ON po."id_precio_opcional_comercial" = NEW."id_precio_opcional_comercial"
    WHERE a."id_alternativa_b2c" = NEW."id_alternativa_b2c"
      AND co."id_extension_producto_comercial" = a."id_extension_producto_comercial"
      AND co."id_opcional_comercial" = po."id_opcional_comercial"
      AND co."habilitado_b2c" = TRUE
      AND co."estado" = 'ACTIVA'
      AND po."segmento_comercial" = 'B2C'
      AND po."id_moneda" = a."id_moneda"
      AND po."monto" = NEW."precio_unitario"
      AND po."estado" = 'ACTIVO'
  ) THEN
    RAISE EXCEPTION 'El opcional no es compatible, no está habilitado para B2C o usa otra moneda';
  END IF;
  RETURN NEW;
END;
$$;



CREATE FUNCTION "finanzas"."validar_origen_pago_remuneracion"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NEW.origen_tipo = 'REMUNERACION' AND NOT EXISTS (SELECT 1 FROM finanzas.remuneracion WHERE id_remuneracion = NEW.origen_id) THEN RAISE EXCEPTION 'Origen REMUNERACION inexistente';
  ELSIF NEW.origen_tipo = 'ANTICIPO' AND NOT EXISTS (SELECT 1 FROM finanzas.anticipo_remuneracion WHERE id_anticipo = NEW.origen_id) THEN RAISE EXCEPTION 'Origen ANTICIPO inexistente';
  ELSIF NEW.origen_tipo = 'REGULARIZACION' AND NOT EXISTS (SELECT 1 FROM finanzas.regularizacion_extraordinaria WHERE id_regularizacion = NEW.origen_id) THEN RAISE EXCEPTION 'Origen REGULARIZACION inexistente';
  ELSIF NEW.origen_tipo = 'BOLETA_HONORARIOS' AND NOT EXISTS (SELECT 1 FROM finanzas.boleta_honorarios WHERE id_boleta_honorarios = NEW.origen_id) THEN RAISE EXCEPTION 'Origen BOLETA_HONORARIOS inexistente';
  END IF;
  RETURN NEW;
END $$;



CREATE FUNCTION "finanzas"."validar_producto_carta_b2c"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM "finanzas"."producto_comercial_version" pv
    JOIN "finanzas"."precio_producto_comercial" pp
      ON pp."id_precio_producto_comercial" = NEW."id_precio_producto_comercial"
    WHERE pv."id_producto_comercial_version" = NEW."id_producto_comercial_version"
      AND pp."id_extension_producto_comercial" = pv."id_extension_producto_comercial"
      AND pp."segmento_comercial" = 'B2C'
      AND pp."estado" = 'ACTIVO'
  ) THEN
    RAISE EXCEPTION 'Producto, versión y precio no forman una publicación B2C coherente';
  END IF;
  RETURN NEW;
END;
$$;



CREATE FUNCTION "finanzas"."validar_publicacion_documental"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NEW."estado_documental" = 'DISPONIBLE' AND NOT "finanzas"."validar_documento_disponible"(NEW."id_documento_logico") THEN
    RAISE EXCEPTION 'El documento no tiene una versión confirmada y disponible';
  END IF;
  RETURN NEW;
END;
$$;



CREATE FUNCTION "finanzas"."validar_reversion_pago_remuneracion"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  pago finanzas.pago_remuneracion%ROWTYPE;
  total NUMERIC(14,4);
BEGIN
  SELECT * INTO pago FROM finanzas.pago_remuneracion
  WHERE id_pago_remuneracion = NEW.id_pago_remuneracion FOR UPDATE;
  IF pago.id_pago_remuneracion IS NULL OR pago.estado <> 'CONFIRMADO' THEN
    RAISE EXCEPTION 'Sólo un pago CONFIRMADO admite reversión';
  END IF;
  PERFORM pg_advisory_xact_lock(hashtext(pago.origen_tipo)::INTEGER, pago.origen_id);
  SELECT COALESCE(SUM(monto),0) INTO total
  FROM finanzas.reversion_pago_remuneracion
  WHERE id_pago_remuneracion = NEW.id_pago_remuneracion;
  IF total + NEW.monto > pago.monto THEN
    RAISE EXCEPTION 'La suma de reversiones excede el pago';
  END IF;
  RETURN NEW;
END $$;



CREATE FUNCTION "finanzas"."validar_saldo_pago_remuneracion"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  monto_original NUMERIC(14,4);
  pagado_efectivo NUMERIC(14,4);
BEGIN
  IF NEW.estado <> 'CONFIRMADO' OR (TG_OP = 'UPDATE' AND OLD.estado = 'CONFIRMADO') THEN
    RETURN NEW;
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext(NEW.origen_tipo)::INTEGER, NEW.origen_id);

  CASE NEW.origen_tipo
    WHEN 'REMUNERACION' THEN
      SELECT liquido_preliminar INTO monto_original
      FROM finanzas.remuneracion WHERE id_remuneracion = NEW.origen_id FOR UPDATE;
    WHEN 'ANTICIPO' THEN
      SELECT monto_final INTO monto_original
      FROM finanzas.anticipo_remuneracion WHERE id_anticipo = NEW.origen_id FOR UPDATE;
    WHEN 'REGULARIZACION' THEN
      SELECT monto INTO monto_original
      FROM finanzas.regularizacion_extraordinaria WHERE id_regularizacion = NEW.origen_id FOR UPDATE;
    WHEN 'BOLETA_HONORARIOS' THEN
      SELECT liquido INTO monto_original
      FROM finanzas.boleta_honorarios WHERE id_boleta_honorarios = NEW.origen_id FOR UPDATE;
  END CASE;

  IF monto_original IS NULL OR monto_original <= 0 THEN
    RAISE EXCEPTION 'El origen no posee un monto pagable válido';
  END IF;

  SELECT COALESCE(SUM(p.monto - COALESCE(r.total, 0)), 0)
  INTO pagado_efectivo
  FROM finanzas.pago_remuneracion p
  LEFT JOIN (
    SELECT id_pago_remuneracion, SUM(monto) AS total
    FROM finanzas.reversion_pago_remuneracion
    GROUP BY id_pago_remuneracion
  ) r ON r.id_pago_remuneracion = p.id_pago_remuneracion
  WHERE p.origen_tipo = NEW.origen_tipo
    AND p.origen_id = NEW.origen_id
    AND p.estado = 'CONFIRMADO'
    AND p.id_pago_remuneracion <> NEW.id_pago_remuneracion;

  IF pagado_efectivo + NEW.monto > monto_original THEN
    RAISE EXCEPTION 'El pago excede el saldo económico pendiente del origen';
  END IF;

  RETURN NEW;
END $$;



CREATE FUNCTION "finanzas"."validar_seleccion_alternativa_b2c"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NEW."id_alternativa_seleccionada" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM "finanzas"."alternativa_b2c" a WHERE a."id_alternativa_b2c"=NEW."id_alternativa_seleccionada" AND a."id_grupo_alternativas_b2c"=NEW."id_grupo_alternativas_b2c" AND a."estado"='PROPUESTA') THEN
    RAISE EXCEPTION 'La alternativa seleccionada debe pertenecer al grupo y permanecer propuesta';
  END IF;
  RETURN NEW;
END; $$;



CREATE FUNCTION "finanzas"."validar_transicion_documento_logico"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NEW."estado" IS DISTINCT FROM OLD."estado" AND NOT (
    (OLD."estado" = 'ACTIVO' AND NEW."estado" IN ('INACTIVO','ARCHIVADO')) OR
    (OLD."estado" = 'INACTIVO' AND NEW."estado" IN ('ACTIVO','ARCHIVADO'))
  ) THEN
    RAISE EXCEPTION 'Transición documental lógica no permitida: % -> %', OLD."estado", NEW."estado";
  END IF;
  RETURN NEW;
END;
$$;



CREATE FUNCTION "finanzas"."validar_transicion_intencion_documental"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NEW."estado" IS DISTINCT FROM OLD."estado" AND NOT (
    (OLD."estado" = 'PENDIENTE' AND NEW."estado" IN ('SUBIENDO','ERROR','CANCELADA','EXPIRADA')) OR
    (OLD."estado" = 'SUBIENDO' AND NEW."estado" IN ('VALIDANDO','ERROR','CANCELADA','EXPIRADA')) OR
    (OLD."estado" = 'VALIDANDO' AND NEW."estado" IN ('DISPONIBLE','ERROR','CUARENTENA')) OR
    (OLD."estado" = 'ERROR' AND NEW."estado" = 'PENDIENTE') OR
    (OLD."estado" = 'CUARENTENA' AND NEW."estado" = 'VALIDANDO')
  ) THEN
    RAISE EXCEPTION 'Transición de intención documental no permitida: % -> %', OLD."estado", NEW."estado";
  END IF;
  RETURN NEW;
END;
$$;



CREATE FUNCTION "finanzas"."validar_variante_documental_sin_ciclos"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF EXISTS (
    WITH RECURSIVE descendientes AS (
      SELECT "id_version_derivada" FROM "finanzas"."variante_documento" WHERE "id_version_original" = NEW."id_version_derivada"
      UNION
      SELECT v."id_version_derivada" FROM "finanzas"."variante_documento" v JOIN descendientes d ON v."id_version_original" = d."id_version_derivada"
    )
    SELECT 1 FROM descendientes WHERE "id_version_derivada" = NEW."id_version_original"
  ) THEN
    RAISE EXCEPTION 'La relación de variantes produciría un ciclo';
  END IF;
  RETURN NEW;
END;
$$;



CREATE FUNCTION "finanzas"."validar_version_documento"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE reemplazada RECORD;
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF NEW."estado" IS DISTINCT FROM OLD."estado" AND NOT (
      (OLD."estado" = 'PENDIENTE' AND NEW."estado" IN ('SUBIENDO','ERROR')) OR
      (OLD."estado" = 'SUBIENDO' AND NEW."estado" IN ('VALIDANDO','ERROR')) OR
      (OLD."estado" = 'VALIDANDO' AND NEW."estado" IN ('DISPONIBLE','ERROR','CUARENTENA')) OR
      (OLD."estado" = 'ERROR' AND NEW."estado" = 'PENDIENTE') OR
      (OLD."estado" = 'CUARENTENA' AND NEW."estado" IN ('VALIDANDO','ARCHIVADO')) OR
      (OLD."estado" = 'DISPONIBLE' AND NEW."estado" IN ('REEMPLAZADO','ARCHIVADO')) OR
      (OLD."estado" = 'REEMPLAZADO' AND NEW."estado" = 'ARCHIVADO')
    ) THEN
      RAISE EXCEPTION 'Transición de versión documental no permitida: % -> %', OLD."estado", NEW."estado";
    END IF;
    IF OLD."estado" IN ('DISPONIBLE','REEMPLAZADO','ARCHIVADO') AND (
      NEW."id_documento_logico" IS DISTINCT FROM OLD."id_documento_logico" OR
      NEW."numero_version" IS DISTINCT FROM OLD."numero_version" OR
      NEW."proveedor_logico" IS DISTINCT FROM OLD."proveedor_logico" OR
      NEW."contenedor_logico" IS DISTINCT FROM OLD."contenedor_logico" OR
      NEW."clave_objeto" IS DISTINCT FROM OLD."clave_objeto" OR
      NEW."version_proveedor" IS DISTINCT FROM OLD."version_proveedor" OR
      NEW."nombre_original" IS DISTINCT FROM OLD."nombre_original" OR
      NEW."nombre_seguro" IS DISTINCT FROM OLD."nombre_seguro" OR
      NEW."mime_declarado" IS DISTINCT FROM OLD."mime_declarado" OR
      NEW."mime_detectado" IS DISTINCT FROM OLD."mime_detectado" OR
      NEW."tamano_bytes" IS DISTINCT FROM OLD."tamano_bytes" OR
      NEW."sha256" IS DISTINCT FROM OLD."sha256" OR
      NEW."creado_por" IS DISTINCT FROM OLD."creado_por"
    ) THEN
      RAISE EXCEPTION 'Los metadatos de contenido de una versión confirmada son inmutables';
    END IF;
  END IF;
  IF NEW."id_version_reemplazada" IS NOT NULL THEN
    SELECT "id_documento_logico", "estado" INTO reemplazada FROM "finanzas"."version_documento" WHERE "id_version_documento" = NEW."id_version_reemplazada";
    IF NOT FOUND OR reemplazada."id_documento_logico" <> NEW."id_documento_logico" THEN
      RAISE EXCEPTION 'La versión reemplazada debe pertenecer al mismo documento lógico';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE "comun"."area_trabajo" (
    "area_trabajo_id_area" bigint NOT NULL,
    "area_trabajo_clasificacion" character varying(150),
    "area_trabajo_activo" boolean,
    "area_trabajo_nombre_area" character varying(150)
);



ALTER TABLE "comun"."area_trabajo" ALTER COLUMN "area_trabajo_id_area" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "comun"."area_trabajo_area_trabajo_id_area_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "comun"."estado_seguridad_usuario" (
    "id_usuario" bigint NOT NULL,
    "intentos" integer DEFAULT 0 NOT NULL,
    "bloqueos" integer DEFAULT 0 NOT NULL,
    "bloqueo_hasta" timestamp(6) with time zone,
    "bloqueo_persistente" boolean DEFAULT false NOT NULL,
    "actualizado" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "responsable" "text"
);



CREATE TABLE "comun"."obra" (
    "obra_obra_id" bigint NOT NULL,
    "obra_nombre_obra" "text",
    "obra_direccion_obra" "text",
    "obra_comuna" "text",
    "obra_region" "text",
    "obra_tipo_obra" "text",
    "obra_fecha_de_creacion" "date",
    "obra_fecha_de_ultima_edicion" "date",
    "obra_estado" "text",
    "obra_cantidad_puerta" integer,
    "obra_referencia" "text",
    "obra_observaciones" "text",
    "rut_cliente" character varying(12),
    "id_especificacion_puerta" bigint,
    "obra_ciudad" "text",
    "obra_edificio" character varying(150),
    "obra_unidad" character varying(100),
    "clave_ubicacion_normalizada" character varying(700),
    "revision_comercial" integer DEFAULT 1 NOT NULL
);



ALTER TABLE "comun"."obra" ALTER COLUMN "obra_obra_id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "comun"."obra_obra_obra_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "comun"."perfil" (
    "perfil_id_perfil" bigint NOT NULL,
    "perfil_nombre_perfil" character varying(150),
    "perfil_descripcion" "text",
    "activo_m4" boolean DEFAULT false NOT NULL,
    "admite_particulares" boolean DEFAULT false NOT NULL,
    "codigo_m4" "text"
);



ALTER TABLE "comun"."perfil" ALTER COLUMN "perfil_id_perfil" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "comun"."perfil_perfil_id_perfil_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "comun"."perfil_permiso" (
    "perfil_id_perfil" bigint NOT NULL,
    "permiso_id_permiso" bigint NOT NULL,
    "perfil_permiso_activo" boolean
);



CREATE TABLE "comun"."permiso" (
    "permiso_id_permiso" bigint NOT NULL,
    "permiso_modulo" character varying(150),
    "permiso_accion" character varying(150),
    "permiso_descripcion" "text",
    "permiso_nombre_del_permiso" character varying(150),
    "activo_m4" boolean DEFAULT false NOT NULL,
    "codigo_m4" "text",
    "requiere_administrador" boolean DEFAULT false NOT NULL
);



CREATE TABLE "comun"."permiso_dependencia" (
    "id_permiso" bigint NOT NULL,
    "id_requerido" bigint NOT NULL,
    CONSTRAINT "permiso_no_depende_de_si_mismo" CHECK (("id_permiso" <> "id_requerido"))
);



ALTER TABLE "comun"."permiso" ALTER COLUMN "permiso_id_permiso" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "comun"."permiso_permiso_id_permiso_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "comun"."proyecto" (
    "proyecto_proyecto_id" bigint NOT NULL,
    "proyecto_codigo_proyecto" "text",
    "proyecto_nombre_referencia" "text",
    "proyecto_fecha_instalacion" "date",
    "proyecto_fecha_ingreso" "date",
    "proyecto_estado_operacional" "text",
    "proyecto_estado_produccion" "text",
    "rut_cliente" character varying(12),
    "id_cotizacion_origen" integer
);



CREATE TABLE "comun"."proyecto_obra" (
    "id_proyecto_obra" bigint NOT NULL,
    "id_proyecto" bigint NOT NULL,
    "id_obra" bigint NOT NULL,
    "es_principal" boolean DEFAULT false NOT NULL,
    "origen" character varying(30) DEFAULT 'COTIZACION'::character varying NOT NULL,
    "creado_en" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "ck_proyecto_obra_origen" CHECK ((("origen")::"text" = ANY (ARRAY[('COTIZACION'::character varying)::"text", ('TERRENO'::character varying)::"text", ('ADMINISTRACION'::character varying)::"text"])))
);



CREATE SEQUENCE "comun"."proyecto_obra_id_proyecto_obra_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "comun"."proyecto_obra_id_proyecto_obra_seq" OWNED BY "comun"."proyecto_obra"."id_proyecto_obra";



ALTER TABLE "comun"."proyecto" ALTER COLUMN "proyecto_proyecto_id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "comun"."proyecto_proyecto_proyecto_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "comun"."sesion_usuario" (
    "id" "text" NOT NULL,
    "id_usuario" bigint NOT NULL,
    "secreto_hash" "text" NOT NULL,
    "inicio" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "vence" timestamp(6) with time zone NOT NULL,
    "invalidada" timestamp(6) with time zone,
    "motivo" "text",
    "direccion" "text",
    "agente" "text",
    "version_seguridad" integer NOT NULL
);



CREATE TABLE "comun"."token_recuperacion" (
    "id" "text" NOT NULL,
    "id_usuario" bigint NOT NULL,
    "secreto_hash" "text" NOT NULL,
    "creado" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "vence" timestamp(6) with time zone NOT NULL,
    "utilizado" timestamp(6) with time zone
);



CREATE TABLE "comun"."usuario" (
    "usuario_id_usuario" bigint NOT NULL,
    "usuario_fecha_de_ultima_edicion" timestamp with time zone,
    "usuario_rut_usuario" character varying(12),
    "usuario_fecha_de_creacion" timestamp with time zone,
    "usuario_correo" character varying(254),
    "usuario_username" character varying(100),
    "usuario_estado_cuenta" character varying(50),
    "usuario_fecha_ultima_conexion" timestamp with time zone,
    "usuario_nombre_completo_primer_nombre_usuario" character varying(100),
    "usuario_nombre_completo_segundo_nombre_usuario" character varying(100),
    "usuario_nombre_completo_primer_apellido_usuario" character varying(100),
    "usuario_nombre_completo_segundo_apellido_usuario" character varying(100),
    "usuario_es_gerencia" boolean,
    "gerencia" "text",
    "usuario_es_tecnico" boolean,
    "tecnico" "text",
    "usuario_es_jop" boolean,
    "jop" "text",
    "usuario_es_administrador" boolean,
    "administrador" "text",
    "usuario_es_secretaria" boolean,
    "secretaria" "text",
    "perfil_id_perfil" bigint,
    "empleado_rut_empleado" character varying(12),
    "acceso_m4" "text",
    "administrador_original" boolean DEFAULT false NOT NULL,
    "configuracion_particular" boolean DEFAULT false NOT NULL,
    "empleado_m4" character varying(15),
    "version_seguridad" integer DEFAULT 0 NOT NULL
);



CREATE TABLE "comun"."usuario_contrasena" (
    "usuario_id_usuario" bigint NOT NULL,
    "usuario_contrasena" "text" NOT NULL,
    "activa" boolean DEFAULT false NOT NULL,
    "creada" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "invalidada" timestamp(6) with time zone,
    "temporal" boolean DEFAULT false NOT NULL,
    "vence" timestamp(6) with time zone
);



CREATE TABLE "comun"."usuario_permiso_particular" (
    "id_usuario" bigint NOT NULL,
    "id_permiso" bigint NOT NULL
);



ALTER TABLE "comun"."usuario" ALTER COLUMN "usuario_id_usuario" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "comun"."usuario_usuario_id_usuario_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."afp" (
    "id_afp" integer NOT NULL,
    "nombre_afp" character varying(100) NOT NULL,
    "estado_afp" character varying(20) DEFAULT 'activo'::character varying NOT NULL,
    CONSTRAINT "chk_afp_estado" CHECK ((("estado_afp")::"text" = ANY (ARRAY[('activo'::character varying)::"text", ('inactivo'::character varying)::"text"])))
);



ALTER TABLE "finanzas"."afp" ALTER COLUMN "id_afp" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."afp_id_afp_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."ajuste_obligacion_proveedor_m5" (
    "id_ajuste_obligacion_m5" integer NOT NULL,
    "id_documento_ajuste_m5" integer NOT NULL,
    "id_obligacion_m5" integer NOT NULL,
    "id_proveedor" integer NOT NULL,
    "id_tipo_documento" integer NOT NULL,
    "folio_normalizado" character varying(80) NOT NULL,
    "id_moneda" integer NOT NULL,
    "tipo_ajuste" character varying(2) NOT NULL,
    "monto" numeric(14,2) NOT NULL,
    "monto_aplicado_obligacion" numeric(14,2) DEFAULT 0 CONSTRAINT "ajuste_obligacion_proveedor__monto_aplicado_obligacion_not_null" NOT NULL,
    "monto_saldo_favor" numeric(14,2) DEFAULT 0 NOT NULL,
    "estado" character varying(30) NOT NULL,
    "creado_por" bigint NOT NULL,
    "fecha_creacion" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "anulado_por" bigint,
    "fecha_anulacion" timestamp with time zone,
    "motivo_anulacion" "text",
    "id_respaldo_anulacion" integer,
    CONSTRAINT "chk_ajuste_documental_m5_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('confirmado'::character varying)::"text", ('pendiente_excedente'::character varying)::"text", ('rechazado'::character varying)::"text", ('anulado'::character varying)::"text"]))),
    CONSTRAINT "chk_ajuste_documental_m5_montos" CHECK ((("monto" > (0)::numeric) AND ("monto_aplicado_obligacion" >= (0)::numeric) AND ("monto_saldo_favor" >= (0)::numeric))),
    CONSTRAINT "chk_ajuste_documental_m5_tipo" CHECK ((("tipo_ajuste")::"text" = ANY (ARRAY[('NC'::character varying)::"text", ('ND'::character varying)::"text"])))
);



ALTER TABLE "finanzas"."ajuste_obligacion_proveedor_m5" ALTER COLUMN "id_ajuste_obligacion_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."ajuste_obligacion_proveedor_m5_id_ajuste_obligacion_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."ajuste_orden_compra_servicio_m5" (
    "id_ajuste_ocs_m5" integer NOT NULL,
    "id_ocs_m5" integer NOT NULL,
    "campo" character varying(80) NOT NULL,
    "valor_anterior" "text",
    "valor_propuesto" "text",
    "motivo" "text" NOT NULL,
    "solicitado_por" bigint NOT NULL,
    "fecha_solicitud" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "estado" character varying(20) DEFAULT 'pendiente'::character varying NOT NULL,
    "confirmado_por" bigint,
    "fecha_confirmacion" timestamp with time zone,
    CONSTRAINT "chk_ajuste_ocs_m5_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('pendiente'::character varying)::"text", ('confirmado'::character varying)::"text"])))
);



ALTER TABLE "finanzas"."ajuste_orden_compra_servicio_m5" ALTER COLUMN "id_ajuste_ocs_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."ajuste_orden_compra_servicio_m5_id_ajuste_ocs_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."ajuste_posterior_remuneracion" (
    "id_ajuste_posterior" integer NOT NULL,
    "id_remuneracion" integer NOT NULL,
    "id_empleado" integer NOT NULL,
    "id_periodo_origen" integer NOT NULL,
    "fecha_hallazgo" "date" NOT NULL,
    "monto" numeric(14,4) NOT NULL,
    "direccion" character varying(20) NOT NULL,
    "motivo" "text" NOT NULL,
    "tratamiento" character varying(30) DEFAULT 'PENDIENTE'::character varying NOT NULL,
    "id_periodo_aplicable" integer,
    "estado" character varying(20) DEFAULT 'CONFIRMADO'::character varying NOT NULL,
    "clave_idempotencia" character varying(100) NOT NULL,
    "motivo_tratamiento" "text",
    "requiere_resolucion_humana" boolean DEFAULT false CONSTRAINT "ajuste_posterior_remuneraci_requiere_resolucion_humana_not_null" NOT NULL,
    "creado_por" bigint NOT NULL,
    "creado_en" timestamp with time zone DEFAULT "now"() NOT NULL,
    "postergado_por" bigint,
    "postergado_en" timestamp with time zone,
    CONSTRAINT "ck_ajuste_posterior_direccion" CHECK ((("direccion")::"text" = ANY (ARRAY[('POSITIVO'::character varying)::"text", ('NEGATIVO'::character varying)::"text"]))),
    CONSTRAINT "ck_ajuste_posterior_estado" CHECK ((("estado")::"text" = 'CONFIRMADO'::"text")),
    CONSTRAINT "ck_ajuste_posterior_monto" CHECK (("monto" > (0)::numeric)),
    CONSTRAINT "ck_ajuste_posterior_motivo" CHECK (("length"(TRIM(BOTH FROM "motivo")) > 0)),
    CONSTRAINT "ck_ajuste_posterior_postergacion" CHECK (((("tratamiento")::"text" <> 'POSTERGADO'::"text") OR (("postergado_por" IS NOT NULL) AND ("postergado_en" IS NOT NULL))))
);



CREATE SEQUENCE "finanzas"."ajuste_posterior_remuneracion_id_ajuste_posterior_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."ajuste_posterior_remuneracion_id_ajuste_posterior_seq" OWNED BY "finanzas"."ajuste_posterior_remuneracion"."id_ajuste_posterior";



CREATE TABLE "finanzas"."ajuste_producto_plantilla_fabricacion" (
    "id_ajuste_plantilla" integer CONSTRAINT "ajuste_producto_plantilla_fabricac_id_ajuste_plantilla_not_null" NOT NULL,
    "id_extension_producto_comercial" integer CONSTRAINT "ajuste_producto_plantilla_f_id_extension_producto_come_not_null" NOT NULL,
    "id_plantilla_fabricacion" integer CONSTRAINT "ajuste_producto_plantilla_fab_id_plantilla_fabricacion_not_null" NOT NULL,
    "id_version_plantilla_base" integer CONSTRAINT "ajuste_producto_plantilla_fa_id_version_plantilla_base_not_null" NOT NULL,
    "cambios" "jsonb" DEFAULT '{"operaciones": []}'::"jsonb" NOT NULL,
    "estado" character varying(20) DEFAULT 'BORRADOR'::character varying NOT NULL,
    "revision" integer DEFAULT 1 NOT NULL,
    "creado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "creado_por" bigint NOT NULL,
    "actualizado_por" bigint NOT NULL,
    CONSTRAINT "ajuste_plantilla_estado_ck" CHECK ((("estado")::"text" = ANY (ARRAY[('BORRADOR'::character varying)::"text", ('PUBLICADO'::character varying)::"text", ('INACTIVO'::character varying)::"text"])))
);



CREATE SEQUENCE "finanzas"."ajuste_producto_plantilla_fabricacion_id_ajuste_plantilla_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."ajuste_producto_plantilla_fabricacion_id_ajuste_plantilla_seq" OWNED BY "finanzas"."ajuste_producto_plantilla_fabricacion"."id_ajuste_plantilla";



CREATE TABLE "finanzas"."alerta_financiera" (
    "id_alerta_financiera" integer NOT NULL,
    "tipo_alerta" character varying(80) NOT NULL,
    "fecha_generacion" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "descripcion_alerta" "text" NOT NULL,
    "nivel_alerta" character varying(30) DEFAULT 'media'::character varying NOT NULL,
    "estado_alerta" character varying(30) DEFAULT 'abierta'::character varying NOT NULL,
    "fecha_cierre" timestamp without time zone,
    "observacion" "text",
    CONSTRAINT "chk_alerta_financiera_estado" CHECK ((("estado_alerta")::"text" = ANY (ARRAY[('abierta'::character varying)::"text", ('en_revision'::character varying)::"text", ('cerrada'::character varying)::"text", ('anulada'::character varying)::"text"]))),
    CONSTRAINT "chk_alerta_financiera_nivel" CHECK ((("nivel_alerta")::"text" = ANY (ARRAY[('baja'::character varying)::"text", ('media'::character varying)::"text", ('alta'::character varying)::"text", ('critica'::character varying)::"text"])))
);



ALTER TABLE "finanzas"."alerta_financiera" ALTER COLUMN "id_alerta_financiera" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."alerta_financiera_id_alerta_financiera_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."alternativa_b2c" (
    "id_alternativa_b2c" bigint NOT NULL,
    "id_grupo_alternativas_b2c" bigint NOT NULL,
    "numero_alternativa" integer NOT NULL,
    "id_extension_producto_comercial" integer NOT NULL,
    "id_producto_comercial_version" integer NOT NULL,
    "id_precio_producto_comercial" bigint NOT NULL,
    "id_moneda" integer NOT NULL,
    "id_condicion_comercial_version" bigint,
    "id_tarifa_instalacion_comercial" bigint,
    "cantidad" integer DEFAULT 1 NOT NULL,
    "configuracion_snapshot" "jsonb" NOT NULL,
    "precio_unitario" numeric(14,2) NOT NULL,
    "precio_instalacion" numeric(14,2),
    "monto_neto" numeric(14,2) NOT NULL,
    "monto_impuesto" numeric(14,2) NOT NULL,
    "monto_total" numeric(14,2) NOT NULL,
    "estado" character varying(20) DEFAULT 'PROPUESTA'::character varying NOT NULL,
    "decidida_en" timestamp(6) with time zone,
    "decidida_por" bigint,
    "motivo_decision" "text",
    "revision" integer DEFAULT 1 NOT NULL,
    "creado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "ck_alternativa_b2c_cantidad" CHECK (("cantidad" > 0)),
    CONSTRAINT "ck_alternativa_b2c_decision" CHECK ((((("estado")::"text" = 'PROPUESTA'::"text") AND ("decidida_en" IS NULL) AND ("decidida_por" IS NULL) AND ("motivo_decision" IS NULL)) OR ((("estado")::"text" <> 'PROPUESTA'::"text") AND ("decidida_en" IS NOT NULL) AND ("decidida_por" IS NOT NULL) AND ("motivo_decision" IS NOT NULL)))),
    CONSTRAINT "ck_alternativa_b2c_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('PROPUESTA'::character varying)::"text", ('ACEPTADA'::character varying)::"text", ('RECHAZADA'::character varying)::"text", ('RETIRADA'::character varying)::"text"]))),
    CONSTRAINT "ck_alternativa_b2c_numero" CHECK (("numero_alternativa" > 0)),
    CONSTRAINT "ck_alternativa_b2c_precios" CHECK ((("precio_unitario" > (0)::numeric) AND (("precio_instalacion" IS NULL) OR ("precio_instalacion" > (0)::numeric)) AND ("monto_neto" > (0)::numeric) AND ("monto_impuesto" >= (0)::numeric) AND ("monto_total" = ("monto_neto" + "monto_impuesto")))),
    CONSTRAINT "ck_alternativa_b2c_revision" CHECK (("revision" > 0))
);



CREATE SEQUENCE "finanzas"."alternativa_b2c_id_alternativa_b2c_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."alternativa_b2c_id_alternativa_b2c_seq" OWNED BY "finanzas"."alternativa_b2c"."id_alternativa_b2c";



CREATE TABLE "finanzas"."alternativa_b2c_opcional" (
    "id_alternativa_b2c_opcional" bigint NOT NULL,
    "id_alternativa_b2c" bigint NOT NULL,
    "id_compatibilidad_opcional" bigint NOT NULL,
    "id_precio_opcional_comercial" bigint NOT NULL,
    "cantidad" integer DEFAULT 1 NOT NULL,
    "precio_unitario" numeric(14,2) NOT NULL,
    "snapshot_opcional" "jsonb" NOT NULL,
    CONSTRAINT "ck_alternativa_b2c_opcional_cantidad" CHECK (("cantidad" > 0)),
    CONSTRAINT "ck_alternativa_b2c_opcional_precio" CHECK (("precio_unitario" > (0)::numeric))
);



CREATE SEQUENCE "finanzas"."alternativa_b2c_opcional_id_alternativa_b2c_opcional_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."alternativa_b2c_opcional_id_alternativa_b2c_opcional_seq" OWNED BY "finanzas"."alternativa_b2c_opcional"."id_alternativa_b2c_opcional";



CREATE TABLE "finanzas"."anticipo_remuneracion" (
    "id_anticipo" integer NOT NULL,
    "id_empleado" integer NOT NULL,
    "id_periodo_remuneracion" integer NOT NULL,
    "modalidad" character varying(20) NOT NULL,
    "valor_ingresado" numeric(14,4) NOT NULL,
    "codigo_base_porcentaje" character varying(50),
    "monto_final" numeric(14,4),
    "estado_valorizacion" character varying(30) NOT NULL,
    "clave_idempotencia" character varying(100) NOT NULL,
    "creado_por" bigint NOT NULL,
    "creado_en" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "ck_anticipo_base" CHECK ((((("modalidad")::"text" = 'MONTO'::"text") AND ("codigo_base_porcentaje" IS NULL) AND ("monto_final" IS NOT NULL)) OR (("modalidad")::"text" = 'PORCENTAJE'::"text"))),
    CONSTRAINT "ck_anticipo_modalidad" CHECK ((("modalidad")::"text" = ANY (ARRAY[('MONTO'::character varying)::"text", ('PORCENTAJE'::character varying)::"text"]))),
    CONSTRAINT "ck_anticipo_valor" CHECK ((("valor_ingresado" > (0)::numeric) AND (("monto_final" IS NULL) OR ("monto_final" > (0)::numeric)))),
    CONSTRAINT "ck_anticipo_valorizacion" CHECK ((("estado_valorizacion")::"text" = ANY (ARRAY[('VALORIZADO'::character varying)::"text", ('PENDIENTE_VALORIZACION'::character varying)::"text"])))
);



CREATE SEQUENCE "finanzas"."anticipo_remuneracion_id_anticipo_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."anticipo_remuneracion_id_anticipo_seq" OWNED BY "finanzas"."anticipo_remuneracion"."id_anticipo";



CREATE TABLE "finanzas"."anulacion_movimiento_pago_m5" (
    "id_anulacion_movimiento_m5" integer CONSTRAINT "anulacion_movimiento_pago_m_id_anulacion_movimiento_m5_not_null" NOT NULL,
    "id_movimiento_pago_m5" integer NOT NULL,
    "monto_anulado" numeric(14,2) NOT NULL,
    "motivo" "text" NOT NULL,
    "id_respaldo_pago_m5" integer NOT NULL,
    "usuario_id_usuario" bigint NOT NULL,
    "fecha_hora" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "grupo_operacion" character varying(36),
    CONSTRAINT "chk_anulacion_movimiento_pago_m5_monto" CHECK (("monto_anulado" > (0)::numeric))
);



ALTER TABLE "finanzas"."anulacion_movimiento_pago_m5" ALTER COLUMN "id_anulacion_movimiento_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."anulacion_movimiento_pago_m5_id_anulacion_movimiento_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."anulacion_pago" (
    "id_anulacion_pago" integer NOT NULL,
    "id_pago_cliente" integer NOT NULL,
    "fecha" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "motivo" "text" NOT NULL,
    "responsable" "text" NOT NULL,
    "respaldo" "text" NOT NULL
);



CREATE SEQUENCE "finanzas"."anulacion_pago_id_anulacion_pago_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."anulacion_pago_id_anulacion_pago_seq" OWNED BY "finanzas"."anulacion_pago"."id_anulacion_pago";



CREATE TABLE "finanzas"."aplicacion_revision_tecnica_ot" (
    "id_aplicacion_revision" bigint NOT NULL,
    "id_unidad_fisica_ot" bigint NOT NULL,
    "id_version_rectificacion" bigint CONSTRAINT "aplicacion_revision_tecnica_o_id_version_rectificacion_not_null" NOT NULL,
    "aplicado_por" bigint NOT NULL,
    "aplicado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



CREATE SEQUENCE "finanzas"."aplicacion_revision_tecnica_ot_id_aplicacion_revision_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."aplicacion_revision_tecnica_ot_id_aplicacion_revision_seq" OWNED BY "finanzas"."aplicacion_revision_tecnica_ot"."id_aplicacion_revision";



CREATE TABLE "finanzas"."aplicacion_saldo_favor" (
    "id_aplicacion_saldo_favor" integer NOT NULL,
    "id_saldo_favor_cliente" integer NOT NULL,
    "id_nota_venta" integer NOT NULL,
    "monto" numeric(14,2) NOT NULL,
    "fecha" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "responsable" "text" NOT NULL,
    CONSTRAINT "chk_aplicacion_monto" CHECK (("monto" > (0)::numeric))
);



CREATE SEQUENCE "finanzas"."aplicacion_saldo_favor_id_aplicacion_saldo_favor_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."aplicacion_saldo_favor_id_aplicacion_saldo_favor_seq" OWNED BY "finanzas"."aplicacion_saldo_favor"."id_aplicacion_saldo_favor";



CREATE TABLE "finanzas"."asignacion_area_empleado" (
    "id_asignacion_area_empleado" integer NOT NULL,
    "id_empleado" integer NOT NULL,
    "id_area_trabajo" bigint NOT NULL,
    "vigencia_desde" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "vigencia_hasta" timestamp(6) with time zone,
    "motivo" "text" NOT NULL,
    "asignado_por" bigint NOT NULL,
    "finalizado_por" bigint,
    CONSTRAINT "chk_asignacion_area_motivo" CHECK (("btrim"("motivo") <> ''::"text")),
    CONSTRAINT "chk_asignacion_area_vigencia" CHECK ((("vigencia_hasta" IS NULL) OR ("vigencia_hasta" >= "vigencia_desde")))
);



CREATE SEQUENCE "finanzas"."asignacion_area_empleado_id_asignacion_area_empleado_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."asignacion_area_empleado_id_asignacion_area_empleado_seq" OWNED BY "finanzas"."asignacion_area_empleado"."id_asignacion_area_empleado";



CREATE TABLE "finanzas"."asignacion_concepto_remuneracion_empleado" (
    "id_asignacion_concepto" integer CONSTRAINT "asignacion_concepto_remuneracio_id_asignacion_concepto_not_null" NOT NULL,
    "id_empleado" integer NOT NULL,
    "id_concepto" integer NOT NULL,
    "vigencia_desde" "date" CONSTRAINT "asignacion_concepto_remuneracion_emplea_vigencia_desde_not_null" NOT NULL,
    "vigencia_hasta" "date",
    "valor_aplicable" numeric(14,4),
    "activa" boolean DEFAULT true NOT NULL,
    "fundamento" "text",
    "autorizacion_referencia" character varying(200),
    CONSTRAINT "chk_asignacion_concepto_valor" CHECK ((("valor_aplicable" IS NULL) OR ("valor_aplicable" >= (0)::numeric))),
    CONSTRAINT "chk_asignacion_concepto_vigencia" CHECK ((("vigencia_hasta" IS NULL) OR ("vigencia_hasta" >= "vigencia_desde")))
);



ALTER TABLE "finanzas"."asignacion_concepto_remuneracion_empleado" ALTER COLUMN "id_asignacion_concepto" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."asignacion_concepto_remuneracion_emp_id_asignacion_concepto_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."asignacion_esquema_remuneracional" (
    "id_asignacion_esquema" integer CONSTRAINT "asignacion_esquema_remuneraciona_id_asignacion_esquema_not_null" NOT NULL,
    "id_esquema" integer NOT NULL,
    "id_empleado" integer,
    "id_cargo" integer,
    "vigencia_desde" "date" NOT NULL,
    "vigencia_hasta" "date",
    "activa" boolean DEFAULT true NOT NULL,
    CONSTRAINT "chk_asignacion_esquema_destino" CHECK ((("id_empleado" IS NOT NULL) <> ("id_cargo" IS NOT NULL))),
    CONSTRAINT "chk_asignacion_esquema_vigencia" CHECK ((("vigencia_hasta" IS NULL) OR ("vigencia_hasta" >= "vigencia_desde")))
);



ALTER TABLE "finanzas"."asignacion_esquema_remuneracional" ALTER COLUMN "id_asignacion_esquema" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."asignacion_esquema_remuneracional_id_asignacion_esquema_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."asignacion_pago_cliente" (
    "id_asignacion_pago_cliente" integer NOT NULL,
    "id_pago_cliente" integer NOT NULL,
    "id_nota_venta" integer NOT NULL,
    "id_documento_tributario" integer,
    "id_hito_cobro" integer,
    "monto_asignado" numeric(14,2) NOT NULL,
    "fecha_asignacion" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "observacion" "text",
    CONSTRAINT "chk_asignacion_pago_cliente_monto" CHECK (("monto_asignado" > (0)::numeric)),
    CONSTRAINT "chk_asignacion_pago_cliente_origen" CHECK ((("id_nota_venta" IS NOT NULL) OR ("id_documento_tributario" IS NOT NULL) OR ("id_hito_cobro" IS NOT NULL)))
);



ALTER TABLE "finanzas"."asignacion_pago_cliente" ALTER COLUMN "id_asignacion_pago_cliente" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."asignacion_pago_cliente_id_asignacion_pago_cliente_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."asignacion_pago_proveedor" (
    "id_asignacion_pago_proveedor" integer NOT NULL,
    "id_pago_proveedor" integer NOT NULL,
    "id_documento_compra_proveedor" integer CONSTRAINT "asignacion_pago_proveedor_id_documento_compra_proveedo_not_null" NOT NULL,
    "monto_asignado" numeric(14,2) NOT NULL,
    "fecha_asignacion" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "observacion" "text",
    CONSTRAINT "chk_asignacion_pago_proveedor_monto" CHECK (("monto_asignado" > (0)::numeric))
);



ALTER TABLE "finanzas"."asignacion_pago_proveedor" ALTER COLUMN "id_asignacion_pago_proveedor" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."asignacion_pago_proveedor_id_asignacion_pago_proveedor_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."asociacion_documento_oc_m5" (
    "id_asociacion_m5" integer NOT NULL,
    "id_documento_m5" integer NOT NULL,
    "tipo_orden" character varying(10) NOT NULL,
    "id_ocs_m5" integer,
    "id_orden_externa" character varying(100),
    "monto_asignado" numeric(14,2) NOT NULL,
    "estado_diferencia" character varying(30) DEFAULT 'sin_evaluar'::character varying NOT NULL,
    "es_documento_final" boolean DEFAULT false NOT NULL,
    "justificacion" "text",
    "monto_disponible_snapshot" numeric(14,2),
    "monto_excedente" numeric(14,2) DEFAULT 0 NOT NULL,
    "estado_excedente" character varying(20) DEFAULT 'no_aplica'::character varying NOT NULL,
    "excedente_solicitado_por" bigint,
    "excedente_fecha_solicitud" timestamp with time zone,
    "excedente_aprobado_por" bigint,
    "excedente_fecha_resolucion" timestamp with time zone,
    CONSTRAINT "chk_asociacion_m5_excedente" CHECK ((("estado_excedente")::"text" = ANY (ARRAY[('no_aplica'::character varying)::"text", ('pendiente'::character varying)::"text", ('aprobado'::character varying)::"text", ('rechazado'::character varying)::"text"]))),
    CONSTRAINT "chk_asociacion_m5_monto" CHECK (("monto_asignado" > (0)::numeric)),
    CONSTRAINT "chk_asociacion_m5_tipo" CHECK ((("tipo_orden")::"text" = ANY (ARRAY[('OCS'::character varying)::"text", ('OCI'::character varying)::"text", ('EXCEPCION'::character varying)::"text"])))
);



ALTER TABLE "finanzas"."asociacion_documento_oc_m5" ALTER COLUMN "id_asociacion_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."asociacion_documento_oc_m5_id_asociacion_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."asociacion_respaldo_pago_m5" (
    "id_asociacion_respaldo_m5" integer NOT NULL,
    "id_respaldo_pago_m5" integer NOT NULL,
    "id_operacion_pago_m5" integer,
    "id_movimiento_pago_m5" integer,
    CONSTRAINT "chk_asociacion_respaldo_m5_destino" CHECK (("num_nonnulls"("id_operacion_pago_m5", "id_movimiento_pago_m5") = 1))
);



ALTER TABLE "finanzas"."asociacion_respaldo_pago_m5" ALTER COLUMN "id_asociacion_respaldo_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."asociacion_respaldo_pago_m5_id_asociacion_respaldo_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."atribucion_ejecucion_tarea_ot" (
    "id_atribucion_ejecucion" bigint NOT NULL,
    "id_ejecucion_tarea" bigint NOT NULL,
    "id_empleado_ejecutor" integer NOT NULL,
    "registrado_por" bigint NOT NULL,
    "registrado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



CREATE SEQUENCE "finanzas"."atribucion_ejecucion_tarea_ot_id_atribucion_ejecucion_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."atribucion_ejecucion_tarea_ot_id_atribucion_ejecucion_seq" OWNED BY "finanzas"."atribucion_ejecucion_tarea_ot"."id_atribucion_ejecucion";



CREATE TABLE "finanzas"."boleta_honorarios" (
    "id_boleta_honorarios" integer NOT NULL,
    "id_prestador" integer NOT NULL,
    "folio" character varying(80) NOT NULL,
    "fecha_emision" "date" NOT NULL,
    "bruto" numeric(14,4) NOT NULL,
    "modalidad_tributaria" character varying(40) NOT NULL,
    "tasa_aplicada" numeric(10,6),
    "retencion" numeric(14,4),
    "liquido" numeric(14,4),
    "estado_documental" character varying(30) DEFAULT 'PENDIENTE_CONFIRMACION'::character varying NOT NULL,
    "respaldo" "text",
    "referencia" character varying(200),
    CONSTRAINT "ck_boleta_honorarios_confirmada" CHECK (((("estado_documental")::"text" <> 'CONFIRMADA'::"text") OR (("tasa_aplicada" IS NOT NULL) AND ("retencion" IS NOT NULL) AND ("liquido" IS NOT NULL) AND ("bruto" = ("retencion" + "liquido"))))),
    CONSTRAINT "ck_boleta_honorarios_estado" CHECK ((("estado_documental")::"text" = ANY (ARRAY[('PENDIENTE_CONFIRMACION'::character varying)::"text", ('CONFIRMADA'::character varying)::"text"]))),
    CONSTRAINT "ck_boleta_honorarios_folio" CHECK (("length"(TRIM(BOTH FROM "folio")) > 0)),
    CONSTRAINT "ck_boleta_honorarios_montos" CHECK ((("bruto" > (0)::numeric) AND (("retencion" IS NULL) OR ("retencion" >= (0)::numeric)) AND (("liquido" IS NULL) OR ("liquido" > (0)::numeric))))
);



CREATE SEQUENCE "finanzas"."boleta_honorarios_id_boleta_honorarios_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."boleta_honorarios_id_boleta_honorarios_seq" OWNED BY "finanzas"."boleta_honorarios"."id_boleta_honorarios";



CREATE TABLE "finanzas"."cargo" (
    "id_cargo" integer NOT NULL,
    "nombre_cargo" character varying(100) NOT NULL,
    "descripcion_cargo" "text",
    "estado_cargo" character varying(20) DEFAULT 'activo'::character varying NOT NULL,
    CONSTRAINT "chk_cargo_estado" CHECK ((("estado_cargo")::"text" = ANY (ARRAY[('activo'::character varying)::"text", ('inactivo'::character varying)::"text"])))
);



ALTER TABLE "finanzas"."cargo" ALTER COLUMN "id_cargo" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."cargo_id_cargo_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."carta_comercial_b2c" (
    "id_carta_comercial_b2c" bigint NOT NULL,
    "codigo" character varying(60) NOT NULL,
    "titulo" character varying(200) NOT NULL,
    "contenido_borrador" "jsonb" NOT NULL,
    "estado" character varying(20) DEFAULT 'BORRADOR'::character varying NOT NULL,
    "revision" integer DEFAULT 1 NOT NULL,
    "creado_por" bigint NOT NULL,
    "creado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "ck_carta_b2c_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('BORRADOR'::character varying)::"text", ('PUBLICADA'::character varying)::"text", ('INACTIVA'::character varying)::"text"]))),
    CONSTRAINT "ck_carta_b2c_revision" CHECK (("revision" > 0))
);



CREATE SEQUENCE "finanzas"."carta_comercial_b2c_id_carta_comercial_b2c_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."carta_comercial_b2c_id_carta_comercial_b2c_seq" OWNED BY "finanzas"."carta_comercial_b2c"."id_carta_comercial_b2c";



CREATE TABLE "finanzas"."carta_comercial_b2c_version" (
    "id_carta_comercial_b2c_version" bigint CONSTRAINT "carta_comercial_b2c_version_id_carta_comercial_b2c_ver_not_null" NOT NULL,
    "id_carta_comercial_b2c" bigint NOT NULL,
    "numero_version" integer NOT NULL,
    "id_plantilla_documental_version" bigint CONSTRAINT "carta_comercial_b2c_version_id_plantilla_documental_ve_not_null" NOT NULL,
    "id_condicion_comercial_version" bigint,
    "snapshot_publicacion" "jsonb" NOT NULL,
    "id_documento_logico" bigint,
    "estado_documental" character varying(30) DEFAULT 'PENDIENTE_DOCUMENTO'::character varying NOT NULL,
    "clave_idempotencia" character varying(160) NOT NULL,
    "motivo" "text" NOT NULL,
    "publicado_por" bigint NOT NULL,
    "creado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "confirmado_en" timestamp(6) with time zone,
    CONSTRAINT "ck_carta_b2c_version_confirmacion" CHECK ((((("estado_documental")::"text" = 'DISPONIBLE'::"text") AND ("id_documento_logico" IS NOT NULL) AND ("confirmado_en" IS NOT NULL)) OR (("estado_documental")::"text" <> 'DISPONIBLE'::"text"))),
    CONSTRAINT "ck_carta_b2c_version_estado" CHECK ((("estado_documental")::"text" = ANY (ARRAY[('PENDIENTE_DOCUMENTO'::character varying)::"text", ('DISPONIBLE'::character varying)::"text", ('ERROR'::character varying)::"text", ('RETIRADA'::character varying)::"text"]))),
    CONSTRAINT "ck_carta_b2c_version_numero" CHECK (("numero_version" > 0))
);



CREATE TABLE "finanzas"."carta_comercial_b2c_version_fotografia" (
    "id_carta_version_fotografia" bigint CONSTRAINT "carta_comercial_b2c_version_id_carta_version_fotografi_not_null" NOT NULL,
    "id_carta_comercial_b2c_version" bigint CONSTRAINT "carta_comercial_b2c_versio_id_carta_comercial_b2c_ver_not_null2" NOT NULL,
    "id_producto_comercial_documento" bigint CONSTRAINT "carta_comercial_b2c_version_id_producto_comercial_docu_not_null" NOT NULL,
    "id_version_documento" bigint CONSTRAINT "carta_comercial_b2c_version_fotog_id_version_documento_not_null" NOT NULL,
    "orden_presentacion" integer CONSTRAINT "carta_comercial_b2c_version_fotogra_orden_presentacion_not_null" NOT NULL,
    CONSTRAINT "ck_carta_b2c_fotografia_orden" CHECK (("orden_presentacion" >= 0))
);



CREATE SEQUENCE "finanzas"."carta_comercial_b2c_version_fot_id_carta_version_fotografia_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."carta_comercial_b2c_version_fot_id_carta_version_fotografia_seq" OWNED BY "finanzas"."carta_comercial_b2c_version_fotografia"."id_carta_version_fotografia";



CREATE SEQUENCE "finanzas"."carta_comercial_b2c_version_id_carta_comercial_b2c_version_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."carta_comercial_b2c_version_id_carta_comercial_b2c_version_seq" OWNED BY "finanzas"."carta_comercial_b2c_version"."id_carta_comercial_b2c_version";



CREATE TABLE "finanzas"."carta_comercial_b2c_version_producto" (
    "id_carta_version_producto" bigint CONSTRAINT "carta_comercial_b2c_version__id_carta_version_producto_not_null" NOT NULL,
    "id_carta_comercial_b2c_version" bigint CONSTRAINT "carta_comercial_b2c_versio_id_carta_comercial_b2c_ver_not_null1" NOT NULL,
    "id_producto_comercial_version" integer CONSTRAINT "carta_comercial_b2c_version_id_producto_comercial_vers_not_null" NOT NULL,
    "id_precio_producto_comercial" bigint CONSTRAINT "carta_comercial_b2c_version_id_precio_producto_comerci_not_null" NOT NULL,
    "orden_presentacion" integer CONSTRAINT "carta_comercial_b2c_version_product_orden_presentacion_not_null" NOT NULL,
    "snapshot_producto" "jsonb" NOT NULL,
    CONSTRAINT "ck_carta_b2c_producto_orden" CHECK (("orden_presentacion" >= 0))
);



CREATE SEQUENCE "finanzas"."carta_comercial_b2c_version_produ_id_carta_version_producto_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."carta_comercial_b2c_version_produ_id_carta_version_producto_seq" OWNED BY "finanzas"."carta_comercial_b2c_version_producto"."id_carta_version_producto";



CREATE TABLE "finanzas"."catalogo_tarea_fabricacion" (
    "id_tarea_fabricacion" integer NOT NULL,
    "nombre" character varying(150) NOT NULL,
    "descripcion" "text",
    "id_area_trabajo" bigint NOT NULL,
    "tiempo_estimado_min" integer,
    "estado" character varying(20) DEFAULT 'ACTIVA'::character varying NOT NULL,
    "revision" integer DEFAULT 1 NOT NULL,
    "creado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "creado_por" bigint NOT NULL,
    "actualizado_por" bigint NOT NULL,
    CONSTRAINT "catalogo_tarea_fabricacion_estado_ck" CHECK ((("estado")::"text" = ANY (ARRAY[('ACTIVA'::character varying)::"text", ('INACTIVA'::character varying)::"text"]))),
    CONSTRAINT "catalogo_tarea_fabricacion_tiempo_ck" CHECK ((("tiempo_estimado_min" IS NULL) OR ("tiempo_estimado_min" > 0)))
);



CREATE SEQUENCE "finanzas"."catalogo_tarea_fabricacion_id_tarea_fabricacion_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."catalogo_tarea_fabricacion_id_tarea_fabricacion_seq" OWNED BY "finanzas"."catalogo_tarea_fabricacion"."id_tarea_fabricacion";



CREATE TABLE "finanzas"."categoria_egreso_m5" (
    "id_categoria_egreso_m5" integer NOT NULL,
    "nombre" character varying(100) NOT NULL,
    "activo" boolean DEFAULT true NOT NULL,
    "nombre_normalizado" character varying(100) NOT NULL,
    "creado_por" bigint,
    "fecha_creacion" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



ALTER TABLE "finanzas"."categoria_egreso_m5" ALTER COLUMN "id_categoria_egreso_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."categoria_egreso_m5_id_categoria_egreso_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."categoria_pago" (
    "id_categoria_pago" integer NOT NULL,
    "nombre" "text" NOT NULL,
    "activo" boolean DEFAULT true NOT NULL
);



CREATE SEQUENCE "finanzas"."categoria_pago_id_categoria_pago_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."categoria_pago_id_categoria_pago_seq" OWNED BY "finanzas"."categoria_pago"."id_categoria_pago";



CREATE TABLE "finanzas"."categoria_retencion_m9" (
    "id_categoria_retencion" integer NOT NULL,
    "codigo" character varying(100) NOT NULL,
    "descripcion" character varying(300),
    "ownership" character varying(40) NOT NULL,
    "creada_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



CREATE SEQUENCE "finanzas"."categoria_retencion_m9_id_categoria_retencion_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."categoria_retencion_m9_id_categoria_retencion_seq" OWNED BY "finanzas"."categoria_retencion_m9"."id_categoria_retencion";



CREATE TABLE "finanzas"."cierre_orden_trabajo_produccion" (
    "id_cierre_ot" bigint NOT NULL,
    "id_unidad_fisica_ot" bigint NOT NULL,
    "id_version_rectificacion" bigint CONSTRAINT "cierre_orden_trabajo_producci_id_version_rectificacion_not_null" NOT NULL,
    "resumen_tareas" "jsonb" NOT NULL,
    "observaciones" "text",
    "estado_anterior" character varying(40) NOT NULL,
    "estado_final" character varying(40) NOT NULL,
    "finalizado_por" bigint NOT NULL,
    "finalizado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



CREATE SEQUENCE "finanzas"."cierre_orden_trabajo_produccion_id_cierre_ot_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."cierre_orden_trabajo_produccion_id_cierre_ot_seq" OWNED BY "finanzas"."cierre_orden_trabajo_produccion"."id_cierre_ot";



CREATE TABLE "finanzas"."clasificacion_asociacion_m5" (
    "id_clasificacion_m5" integer NOT NULL,
    "id_asociacion_m5" integer NOT NULL,
    "id_categoria_egreso_m5" integer NOT NULL,
    "monto" numeric(14,2) NOT NULL,
    "nombre_categoria_snapshot" character varying(100),
    CONSTRAINT "clasificacion_asociacion_m5_monto_check" CHECK (("monto" > (0)::numeric))
);



ALTER TABLE "finanzas"."clasificacion_asociacion_m5" ALTER COLUMN "id_clasificacion_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."clasificacion_asociacion_m5_id_clasificacion_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."cliente_financiero" (
    "id_cliente_financiero" integer NOT NULL,
    "rut_cliente" character varying(15),
    "id_tipo_cliente_financiero" integer NOT NULL,
    "nombre_razon_social_referencia" character varying(150) NOT NULL,
    "contacto_financiero" character varying(150),
    "correo_financiero" character varying(150),
    "telefono_financiero" character varying(30),
    "estado_financiero" character varying(20) DEFAULT 'activo'::character varying NOT NULL,
    "fecha_actualizacion_datos_cliente" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "nivel_formalizacion" character varying(20) DEFAULT 'formal'::character varying NOT NULL,
    "referencia_demostracion" character varying(80),
    CONSTRAINT "chk_cliente_financiero_estado" CHECK ((("estado_financiero")::"text" = ANY (ARRAY[('activo'::character varying)::"text", ('inactivo'::character varying)::"text", ('bloqueado'::character varying)::"text"]))),
    CONSTRAINT "chk_formalizacion_i2" CHECK (((("nivel_formalizacion")::"text" = ANY (ARRAY[('formal'::character varying)::"text", ('provisional'::character varying)::"text"])) AND ((("nivel_formalizacion")::"text" <> 'formal'::"text") OR ("rut_cliente" IS NOT NULL))))
);



ALTER TABLE "finanzas"."cliente_financiero" ALTER COLUMN "id_cliente_financiero" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."cliente_financiero_id_cliente_financiero_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."comision_bancaria_m5" (
    "id_comision_bancaria_m5" integer NOT NULL,
    "id_operacion_pago_m5" integer NOT NULL,
    "id_movimiento_pago_m5" integer,
    "id_moneda" integer NOT NULL,
    "monto" numeric(14,2) NOT NULL,
    "equivalente_clp" numeric(14,2),
    "fecha_comision" "date" NOT NULL,
    "descripcion" "text" NOT NULL,
    "id_respaldo_pago_m5" integer NOT NULL,
    "registrado_por" bigint NOT NULL,
    "fecha_registro" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "comision_bancaria_m5_monto_check" CHECK (("monto" > (0)::numeric))
);



ALTER TABLE "finanzas"."comision_bancaria_m5" ALTER COLUMN "id_comision_bancaria_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."comision_bancaria_m5_id_comision_bancaria_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."compatibilidad_opcional_producto" (
    "id_compatibilidad_opcional" bigint CONSTRAINT "compatibilidad_opcional_pro_id_compatibilidad_opcional_not_null" NOT NULL,
    "id_extension_producto_comercial" integer CONSTRAINT "compatibilidad_opcional_pro_id_extension_producto_come_not_null" NOT NULL,
    "id_opcional_comercial" bigint NOT NULL,
    "habilitado_b2b" boolean DEFAULT false NOT NULL,
    "habilitado_b2c" boolean DEFAULT false NOT NULL,
    "condiciones_compatibilidad" "text",
    "estado" character varying(20) DEFAULT 'ACTIVA'::character varying NOT NULL,
    "revision" integer DEFAULT 1 NOT NULL,
    CONSTRAINT "ck_compatibilidad_opcional_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('ACTIVA'::character varying)::"text", ('INACTIVA'::character varying)::"text"]))),
    CONSTRAINT "ck_compatibilidad_opcional_revision" CHECK (("revision" > 0))
);



CREATE SEQUENCE "finanzas"."compatibilidad_opcional_producto_id_compatibilidad_opcional_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."compatibilidad_opcional_producto_id_compatibilidad_opcional_seq" OWNED BY "finanzas"."compatibilidad_opcional_producto"."id_compatibilidad_opcional";



CREATE TABLE "finanzas"."compensacion_saldo_favor_m5" (
    "id_compensacion_m5" integer NOT NULL,
    "id_saldo_favor_m5" integer NOT NULL,
    "id_proveedor" integer NOT NULL,
    "id_moneda" integer NOT NULL,
    "monto_total" numeric(14,2) NOT NULL,
    "estado" character varying(20) DEFAULT 'confirmada'::character varying NOT NULL,
    "creado_por" bigint NOT NULL,
    "fecha_creacion" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "compensacion_saldo_favor_m5_estado_check" CHECK ((("estado")::"text" = ANY (ARRAY[('confirmada'::character varying)::"text", ('revertida_parcial'::character varying)::"text", ('revertida_total'::character varying)::"text"]))),
    CONSTRAINT "compensacion_saldo_favor_m5_monto_total_check" CHECK (("monto_total" > (0)::numeric))
);



ALTER TABLE "finanzas"."compensacion_saldo_favor_m5" ALTER COLUMN "id_compensacion_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."compensacion_saldo_favor_m5_id_compensacion_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."componente_remuneracion" (
    "id_componente_remuneracion" integer NOT NULL,
    "id_remuneracion" integer NOT NULL,
    "id_concepto" integer,
    "tipo" character varying(40) NOT NULL,
    "modalidad" character varying(30) DEFAULT 'MONTO'::character varying NOT NULL,
    "descripcion" "text" NOT NULL,
    "monto" numeric(14,4),
    "direccion" character varying(20),
    "fuente_tipo" character varying(30) NOT NULL,
    "clave_negocio" character varying(120),
    "referencia_origen" character varying(200),
    "version_origen" character varying(100),
    "fecha_origen" "date",
    "estado_revision" character varying(30) DEFAULT 'propuesto'::character varying NOT NULL,
    "motivo" "text",
    "id_componente_origen" integer,
    "tipo_relacion" character varying(30),
    "creado_por" bigint NOT NULL,
    "revisado_por" bigint,
    "fecha_revision" timestamp with time zone,
    "creado_en" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "ck_componente_remuneracion_ajuste" CHECK ((((("tipo")::"text" = 'AJUSTE_MANUAL'::"text") AND ("direccion" IS NOT NULL) AND ("monto" IS NOT NULL)) OR ((("tipo")::"text" <> 'AJUSTE_MANUAL'::"text") AND ("direccion" IS NULL)))),
    CONSTRAINT "ck_componente_remuneracion_direccion" CHECK ((("direccion" IS NULL) OR (("direccion")::"text" = ANY (ARRAY[('POSITIVO'::character varying)::"text", ('NEGATIVO'::character varying)::"text"])))),
    CONSTRAINT "ck_componente_remuneracion_estado" CHECK ((("estado_revision")::"text" = ANY (ARRAY[('propuesto'::character varying)::"text", ('aprobado'::character varying)::"text", ('rechazado'::character varying)::"text", ('conflicto'::character varying)::"text", ('pendiente_valorizacion'::character varying)::"text", ('reemplazado'::character varying)::"text"]))),
    CONSTRAINT "ck_componente_remuneracion_modalidad" CHECK ((("modalidad")::"text" = ANY (ARRAY[('MONTO'::character varying)::"text", ('REGLA_TEMPORAL'::character varying)::"text"]))),
    CONSTRAINT "ck_componente_remuneracion_monto" CHECK ((("monto" IS NULL) OR ("monto" >= (0)::numeric))),
    CONSTRAINT "ck_componente_remuneracion_regla" CHECK (((("modalidad")::"text" <> 'REGLA_TEMPORAL'::"text") OR ((("tipo")::"text" = 'EXCEPCIONAL_POSITIVO'::"text") AND ("monto" IS NULL) AND (("estado_revision")::"text" = 'pendiente_valorizacion'::"text")))),
    CONSTRAINT "ck_componente_remuneracion_revision" CHECK (((("estado_revision")::"text" <> ALL (ARRAY[('aprobado'::character varying)::"text", ('rechazado'::character varying)::"text"])) OR (("revisado_por" IS NOT NULL) AND ("fecha_revision" IS NOT NULL)))),
    CONSTRAINT "ck_componente_remuneracion_tipo" CHECK ((("tipo")::"text" = ANY (ARRAY[('EXCEPCIONAL_POSITIVO'::character varying)::"text", ('VARIABLE_ADMINISTRATIVA'::character varying)::"text", ('VARIABLE_COMERCIAL'::character varying)::"text", ('VALOR_EXTERNO'::character varying)::"text", ('AJUSTE_MANUAL'::character varying)::"text", ('PRORRATEO'::character varying)::"text", ('SUELDO_BASE'::character varying)::"text", ('HABER_AUTOMATICO'::character varying)::"text", ('HECHO_TERRENO'::character varying)::"text", ('DEDUCCION_AUTOMATICA'::character varying)::"text", ('DEDUCCION_PREVISIONAL'::character varying)::"text", ('APORTE_EMPLEADOR_AUTOMATICO'::character varying)::"text", ('IMPUESTO_RENTA'::character varying)::"text"])))
);



CREATE SEQUENCE "finanzas"."componente_remuneracion_id_componente_remuneracion_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."componente_remuneracion_id_componente_remuneracion_seq" OWNED BY "finanzas"."componente_remuneracion"."id_componente_remuneracion";



CREATE TABLE "finanzas"."compromiso_credito_m8" (
    "id_compromiso" integer NOT NULL,
    "id_ficha_cliente" integer NOT NULL,
    "id_nota_venta" integer NOT NULL,
    "id_solicitud_excepcion" integer,
    "monto_original" numeric(14,2) NOT NULL,
    "monto_pendiente" numeric(14,2) NOT NULL,
    "condiciones" "text",
    "estado" character varying(20) DEFAULT 'VIGENTE'::character varying NOT NULL,
    "fecha_formalizacion" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "fecha_liberacion" timestamp(6) without time zone,
    CONSTRAINT "chk_compromiso_credito_m8_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('VIGENTE'::character varying)::"text", ('LIBERADO'::character varying)::"text"]))),
    CONSTRAINT "chk_compromiso_credito_m8_montos" CHECK ((("monto_original" > (0)::numeric) AND ("monto_pendiente" >= (0)::numeric) AND ("monto_pendiente" <= "monto_original")))
);



CREATE SEQUENCE "finanzas"."compromiso_credito_m8_id_compromiso_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."compromiso_credito_m8_id_compromiso_seq" OWNED BY "finanzas"."compromiso_credito_m8"."id_compromiso";



CREATE TABLE "finanzas"."concepto_remuneracion" (
    "id_concepto_remuneracion" integer NOT NULL,
    "nombre_concepto" character varying(100) NOT NULL,
    "descripcion_concepto" "text",
    "naturaleza_concepto" character varying(30) NOT NULL,
    "estado_concepto" character varying(20) DEFAULT 'activo'::character varying NOT NULL,
    "codigo_m6" character varying(40),
    CONSTRAINT "chk_concepto_remuneracion_estado" CHECK ((("estado_concepto")::"text" = ANY (ARRAY[('activo'::character varying)::"text", ('inactivo'::character varying)::"text"]))),
    CONSTRAINT "chk_concepto_remuneracion_naturaleza" CHECK ((("naturaleza_concepto")::"text" = ANY (ARRAY[('haber'::character varying)::"text", ('descuento'::character varying)::"text", ('bono'::character varying)::"text", ('retencion'::character varying)::"text", ('otro'::character varying)::"text", ('aporte_empleador'::character varying)::"text"])))
);



ALTER TABLE "finanzas"."concepto_remuneracion" ALTER COLUMN "id_concepto_remuneracion" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."concepto_remuneracion_id_concepto_remuneracion_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."conciliacion" (
    "id_conciliacion" integer NOT NULL,
    "id_movimiento_financiero" integer,
    "id_movimiento_bancario" integer,
    "fecha_conciliacion" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "monto_conciliado" numeric(14,2) NOT NULL,
    "diferencia_conciliacion" numeric(14,2) DEFAULT 0,
    "estado_conciliacion" character varying(30) DEFAULT 'pendiente'::character varying NOT NULL,
    "responsable_conciliacion" character varying(150),
    "observacion" "text",
    "evidencia" "text",
    "id_pago_cliente" integer,
    CONSTRAINT "chk_conciliacion_estado" CHECK ((("estado_conciliacion")::"text" = ANY (ARRAY[('pendiente'::character varying)::"text", ('conciliada'::character varying)::"text", ('observada'::character varying)::"text", ('anulada'::character varying)::"text"]))),
    CONSTRAINT "chk_conciliacion_monto" CHECK (("monto_conciliado" >= (0)::numeric))
);



ALTER TABLE "finanzas"."conciliacion" ALTER COLUMN "id_conciliacion" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."conciliacion_id_conciliacion_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."conciliacion_movimiento_pago_m5" (
    "id_conciliacion_movimiento_m5" integer CONSTRAINT "conciliacion_movimiento_pag_id_conciliacion_movimiento_not_null" NOT NULL,
    "id_movimiento_pago_m5" integer NOT NULL,
    "resultado" character varying(20) NOT NULL,
    "observacion" "text",
    "usuario_id_usuario" bigint NOT NULL,
    "fecha_hora" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "chk_conciliacion_movimiento_pago_m5_observacion" CHECK (((("resultado")::"text" <> 'con_discrepancia'::"text") OR ("length"(TRIM(BOTH FROM "observacion")) > 0))),
    CONSTRAINT "chk_conciliacion_movimiento_pago_m5_resultado" CHECK ((("resultado")::"text" = ANY (ARRAY[('conciliado'::character varying)::"text", ('con_discrepancia'::character varying)::"text"])))
);



ALTER TABLE "finanzas"."conciliacion_movimiento_pago_m5" ALTER COLUMN "id_conciliacion_movimiento_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."conciliacion_movimiento_pago__id_conciliacion_movimiento_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."condicion_cobro_nv" (
    "id_condicion_cobro_nv" integer NOT NULL,
    "id_nota_venta" integer NOT NULL,
    "descripcion" "text" NOT NULL,
    "monto_referencia" numeric(14,2),
    "porcentaje_referencia" numeric(5,2),
    "evento_referencia" "text"
);



CREATE SEQUENCE "finanzas"."condicion_cobro_nv_id_condicion_cobro_nv_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."condicion_cobro_nv_id_condicion_cobro_nv_seq" OWNED BY "finanzas"."condicion_cobro_nv"."id_condicion_cobro_nv";



CREATE TABLE "finanzas"."condicion_comercial" (
    "id_condicion_comercial" bigint NOT NULL,
    "codigo" character varying(60) NOT NULL,
    "nombre" character varying(200) NOT NULL,
    "segmento" character varying(20) NOT NULL,
    "estado" character varying(20) DEFAULT 'ACTIVA'::character varying NOT NULL,
    "revision" integer DEFAULT 1 NOT NULL,
    "creado_por" bigint NOT NULL,
    "creado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "ck_condicion_comercial_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('ACTIVA'::character varying)::"text", ('INACTIVA'::character varying)::"text"]))),
    CONSTRAINT "ck_condicion_comercial_revision" CHECK (("revision" > 0)),
    CONSTRAINT "ck_condicion_comercial_segmento" CHECK ((("segmento")::"text" = ANY (ARRAY[('B2B'::character varying)::"text", ('B2C'::character varying)::"text", ('CARTA_B2C'::character varying)::"text"])))
);



CREATE SEQUENCE "finanzas"."condicion_comercial_id_condicion_comercial_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."condicion_comercial_id_condicion_comercial_seq" OWNED BY "finanzas"."condicion_comercial"."id_condicion_comercial";



CREATE TABLE "finanzas"."condicion_comercial_version" (
    "id_condicion_comercial_version" bigint CONSTRAINT "condicion_comercial_version_id_condicion_comercial_ver_not_null" NOT NULL,
    "id_condicion_comercial" bigint NOT NULL,
    "numero_version" integer NOT NULL,
    "contenido" "jsonb" NOT NULL,
    "vigencia_desde" "date" NOT NULL,
    "vigencia_hasta" "date",
    "estado" character varying(20) DEFAULT 'BORRADOR'::character varying NOT NULL,
    "motivo" "text" NOT NULL,
    "publicado_por" bigint,
    "publicado_en" timestamp(6) with time zone,
    CONSTRAINT "ck_condicion_version_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('BORRADOR'::character varying)::"text", ('PUBLICADA'::character varying)::"text", ('ARCHIVADA'::character varying)::"text"]))),
    CONSTRAINT "ck_condicion_version_numero" CHECK (("numero_version" > 0)),
    CONSTRAINT "ck_condicion_version_publicacion" CHECK ((((("estado")::"text" = 'BORRADOR'::"text") AND ("publicado_por" IS NULL) AND ("publicado_en" IS NULL)) OR ((("estado")::"text" <> 'BORRADOR'::"text") AND ("publicado_por" IS NOT NULL) AND ("publicado_en" IS NOT NULL)))),
    CONSTRAINT "ck_condicion_version_vigencia" CHECK ((("vigencia_hasta" IS NULL) OR ("vigencia_hasta" >= "vigencia_desde")))
);



CREATE SEQUENCE "finanzas"."condicion_comercial_version_id_condicion_comercial_version_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."condicion_comercial_version_id_condicion_comercial_version_seq" OWNED BY "finanzas"."condicion_comercial_version"."id_condicion_comercial_version";



CREATE TABLE "finanzas"."condicion_crediticia_m8" (
    "id_condicion_crediticia" integer NOT NULL,
    "id_ficha_cliente" integer NOT NULL,
    "credito_habilitado" boolean DEFAULT false NOT NULL,
    "monto_cupo" numeric(14,2),
    "vigencia_desde" "date",
    "vigencia_hasta" "date",
    "suspendido" boolean DEFAULT false NOT NULL,
    "motivo_suspension" "text",
    "fecha_suspension" timestamp(6) without time zone,
    "fecha_reactivacion" timestamp(6) without time zone,
    "actualizado_en" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "chk_condicion_crediticia_m8_cupo" CHECK ((("monto_cupo" IS NULL) OR ("monto_cupo" >= (0)::numeric))),
    CONSTRAINT "chk_condicion_crediticia_m8_vigencia" CHECK ((("vigencia_hasta" IS NULL) OR ("vigencia_desde" IS NULL) OR ("vigencia_hasta" >= "vigencia_desde")))
);



CREATE SEQUENCE "finanzas"."condicion_crediticia_m8_id_condicion_crediticia_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."condicion_crediticia_m8_id_condicion_crediticia_seq" OWNED BY "finanzas"."condicion_crediticia_m8"."id_condicion_crediticia";



CREATE TABLE "finanzas"."config_cuotas_tarjeta" (
    "cantidad" integer NOT NULL,
    "activo" boolean DEFAULT true NOT NULL,
    CONSTRAINT "chk_cuotas_cantidad" CHECK (("cantidad" >= 1))
);



CREATE TABLE "finanzas"."config_umbral_por_vencer" (
    "id_configuracion" integer NOT NULL,
    "dias_habiles" integer NOT NULL,
    "fecha" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "chk_umbral_dias" CHECK (("dias_habiles" >= 0))
);



CREATE SEQUENCE "finanzas"."config_umbral_por_vencer_id_configuracion_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."config_umbral_por_vencer_id_configuracion_seq" OWNED BY "finanzas"."config_umbral_por_vencer"."id_configuracion";



CREATE TABLE "finanzas"."config_umbral_por_vencer_m5" (
    "id_config_umbral_m5" integer NOT NULL,
    "dias_habiles" integer NOT NULL,
    "usuario_id_usuario" bigint NOT NULL,
    "fecha_hora" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "chk_config_umbral_m5_dias" CHECK (("dias_habiles" >= 0))
);



ALTER TABLE "finanzas"."config_umbral_por_vencer_m5" ALTER COLUMN "id_config_umbral_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."config_umbral_por_vencer_m5_id_config_umbral_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."config_umbral_reclasificacion_m5" (
    "id_configuracion" integer NOT NULL,
    "monto_clp" numeric(14,2) NOT NULL,
    "actualizado_por" bigint,
    "fecha_actualizacion" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "config_umbral_reclasificacion_m5_id_configuracion_check" CHECK (("id_configuracion" = 1)),
    CONSTRAINT "config_umbral_reclasificacion_m5_monto_clp_check" CHECK (("monto_clp" >= (0)::numeric))
);



CREATE TABLE "finanzas"."configuracion_alerta_m9" (
    "id_configuracion_alerta" integer NOT NULL,
    "codigo" character varying(100) NOT NULL,
    "metrica" character varying(80) NOT NULL,
    "operador" character varying(4) NOT NULL,
    "umbral" numeric(24,6) NOT NULL,
    "activa" boolean DEFAULT true NOT NULL,
    "vigencia_desde" timestamp(6) with time zone NOT NULL,
    "vigencia_hasta" timestamp(6) with time zone,
    CONSTRAINT "chk_m9_alerta_operador" CHECK ((("operador")::"text" = ANY (ARRAY[('GT'::character varying)::"text", ('GTE'::character varying)::"text", ('LT'::character varying)::"text", ('LTE'::character varying)::"text", ('EQ'::character varying)::"text"]))),
    CONSTRAINT "chk_m9_alerta_vigencia" CHECK ((("vigencia_hasta" IS NULL) OR ("vigencia_hasta" >= "vigencia_desde")))
);



CREATE SEQUENCE "finanzas"."configuracion_alerta_m9_id_configuracion_alerta_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."configuracion_alerta_m9_id_configuracion_alerta_seq" OWNED BY "finanzas"."configuracion_alerta_m9"."id_configuracion_alerta";



CREATE TABLE "finanzas"."configuracion_area_trabajo" (
    "id_area_trabajo" bigint NOT NULL,
    "descripcion" "text",
    "revision" integer DEFAULT 1 NOT NULL,
    "actualizado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



CREATE TABLE "finanzas"."configuracion_concepto_remuneracion" (
    "id_configuracion_concepto" integer CONSTRAINT "configuracion_concepto_remun_id_configuracion_concepto_not_null" NOT NULL,
    "id_concepto" integer NOT NULL,
    "modalidad" character varying(20) NOT NULL,
    "valor" numeric(14,4),
    "regla_tipo" character varying(40),
    "vigencia_desde" "date" NOT NULL,
    "vigencia_hasta" "date",
    "es_excepcion" boolean DEFAULT false NOT NULL,
    "activa" boolean DEFAULT true NOT NULL,
    CONSTRAINT "chk_configuracion_concepto_modalidad" CHECK ((("modalidad")::"text" = ANY (ARRAY[('FIJO'::character varying)::"text", ('PORCENTAJE'::character varying)::"text", ('REGLA'::character varying)::"text"]))),
    CONSTRAINT "chk_configuracion_concepto_valor" CHECK ((("valor" IS NULL) OR ("valor" >= (0)::numeric))),
    CONSTRAINT "chk_configuracion_concepto_vigencia" CHECK ((("vigencia_hasta" IS NULL) OR ("vigencia_hasta" >= "vigencia_desde")))
);



ALTER TABLE "finanzas"."configuracion_concepto_remuneracion" ALTER COLUMN "id_configuracion_concepto" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."configuracion_concepto_remuneraci_id_configuracion_concepto_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."configuracion_conservacion_documental" (
    "id_configuracion_conservacion" integer CONSTRAINT "configuracion_conservacion__id_configuracion_conservac_not_null" NOT NULL,
    "estado" character varying(20) DEFAULT 'pendiente'::character varying NOT NULL,
    "criterio_descriptivo" "text",
    "fuente" character varying(200),
    "referencia" character varying(300),
    "vigencia_desde" "date" NOT NULL,
    "vigencia_hasta" "date",
    CONSTRAINT "chk_conservacion_documental_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('pendiente'::character varying)::"text", ('configurada'::character varying)::"text", ('inactiva'::character varying)::"text"]))),
    CONSTRAINT "chk_conservacion_documental_vigencia" CHECK ((("vigencia_hasta" IS NULL) OR ("vigencia_hasta" >= "vigencia_desde")))
);



ALTER TABLE "finanzas"."configuracion_conservacion_documental" ALTER COLUMN "id_configuracion_conservacion" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."configuracion_conservacion_do_id_configuracion_conservacion_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."contacto_cotizacion_b2b" (
    "id_contacto_cotizacion_b2b" bigint NOT NULL,
    "id_cotizacion" integer NOT NULL,
    "nombre" character varying(120) NOT NULL,
    "apellido" character varying(120),
    "cargo" character varying(120),
    "empresa_relacionada" character varying(200),
    "correo" character varying(254),
    "telefono" character varying(40),
    "tipo_contacto" character varying(30) DEFAULT 'COMERCIAL'::character varying NOT NULL,
    "es_principal" boolean DEFAULT false NOT NULL,
    "observaciones" "text",
    "estado" character varying(20) DEFAULT 'ACTIVO'::character varying NOT NULL,
    "revision" integer DEFAULT 1 NOT NULL,
    "creado_por" bigint NOT NULL,
    "creado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "ck_contacto_cotizacion_b2b_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('ACTIVO'::character varying)::"text", ('INACTIVO'::character varying)::"text"]))),
    CONSTRAINT "ck_contacto_cotizacion_b2b_nombre" CHECK (("btrim"(("nombre")::"text") <> ''::"text")),
    CONSTRAINT "ck_contacto_cotizacion_b2b_revision" CHECK (("revision" > 0)),
    CONSTRAINT "ck_contacto_cotizacion_b2b_tipo" CHECK ((("tipo_contacto")::"text" = ANY (ARRAY[('COMERCIAL'::character varying)::"text", ('TECNICO'::character varying)::"text", ('OBRA'::character varying)::"text", ('FACTURACION'::character varying)::"text", ('OTRO'::character varying)::"text"])))
);



CREATE SEQUENCE "finanzas"."contacto_cotizacion_b2b_id_contacto_cotizacion_b2b_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."contacto_cotizacion_b2b_id_contacto_cotizacion_b2b_seq" OWNED BY "finanzas"."contacto_cotizacion_b2b"."id_contacto_cotizacion_b2b";



CREATE TABLE "finanzas"."correccion_documental_m11" (
    "id_correccion_documental_m11" bigint NOT NULL,
    "tipo_documento" character varying(20) NOT NULL,
    "id_orden_compra_original" integer,
    "id_guia_original" integer,
    "id_guia_correctora" integer,
    "id_documento_original" integer,
    "id_documento_corrector" integer,
    "actuacion" character varying(80) NOT NULL,
    "motivo" "text" NOT NULL,
    "respaldo" "text" NOT NULL,
    "snapshot_anterior" "jsonb" NOT NULL,
    "snapshot_resultado" "jsonb" NOT NULL,
    "actor_id" bigint NOT NULL,
    "clave_idempotencia" character varying(120) NOT NULL,
    "creado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "ck_correccion_m11_documentos_distintos" CHECK ((("id_documento_original" IS NULL) OR ("id_documento_original" <> "id_documento_corrector"))),
    CONSTRAINT "ck_correccion_m11_original" CHECK ((((("tipo_documento")::"text" = 'OC'::"text") AND ("id_orden_compra_original" IS NOT NULL) AND ("id_guia_original" IS NULL) AND ("id_guia_correctora" IS NULL) AND ("id_documento_original" IS NULL) AND ("id_documento_corrector" IS NULL)) OR ((("tipo_documento")::"text" = 'GDE'::"text") AND ("id_orden_compra_original" IS NULL) AND ("id_guia_original" IS NOT NULL) AND ("id_guia_correctora" IS NOT NULL) AND ("id_documento_original" IS NULL) AND ("id_documento_corrector" IS NULL)) OR ((("tipo_documento")::"text" = 'DTE'::"text") AND ("id_orden_compra_original" IS NULL) AND ("id_guia_original" IS NULL) AND ("id_guia_correctora" IS NULL) AND ("id_documento_original" IS NOT NULL) AND ("id_documento_corrector" IS NOT NULL)))),
    CONSTRAINT "ck_correccion_m11_tipo" CHECK ((("tipo_documento")::"text" = ANY (ARRAY[('OC'::character varying)::"text", ('GDE'::character varying)::"text", ('DTE'::character varying)::"text"])))
);



CREATE SEQUENCE "finanzas"."correccion_documental_m11_id_correccion_documental_m11_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."correccion_documental_m11_id_correccion_documental_m11_seq" OWNED BY "finanzas"."correccion_documental_m11"."id_correccion_documental_m11";



CREATE TABLE "finanzas"."correspondencia_linea_oc_item_tecnico" (
    "id_linea_orden_compra_b2b" bigint CONSTRAINT "correspondencia_linea_oc_ite_id_linea_orden_compra_b2b_not_null" NOT NULL,
    "id_unidad_fisica_ot" bigint CONSTRAINT "correspondencia_linea_oc_item_tecn_id_unidad_fisica_ot_not_null" NOT NULL,
    "estado" character varying(30) DEFAULT 'ACREDITADA'::character varying NOT NULL,
    "evidencia" "jsonb" NOT NULL,
    "creado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "ck_correspondencia_linea_oc_estado" CHECK ((("estado")::"text" = 'ACREDITADA'::"text"))
);



CREATE TABLE "finanzas"."costo_envio_importacion_m5" (
    "id_costo_envio_m5" integer NOT NULL,
    "id_envio_importacion_m5" integer NOT NULL,
    "tipo_costo" character varying(40) NOT NULL,
    "fuente" character varying(20) NOT NULL,
    "id_obligacion_m5" integer,
    "id_comision_bancaria_m5" integer,
    "id_moneda" integer NOT NULL,
    "monto" numeric(14,2) NOT NULL,
    "equivalente_clp" numeric(14,2),
    "descripcion" "text",
    "id_respaldo_pago_m5" integer,
    "registrado_por" bigint NOT NULL,
    "fecha_registro" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "chk_costo_envio_m5_fuente" CHECK ((((("fuente")::"text" = 'directo'::"text") AND ("id_obligacion_m5" IS NULL) AND ("id_comision_bancaria_m5" IS NULL)) OR ((("fuente")::"text" = 'obligacion'::"text") AND ("id_obligacion_m5" IS NOT NULL) AND ("id_comision_bancaria_m5" IS NULL)) OR ((("fuente")::"text" = 'comision'::"text") AND ("id_obligacion_m5" IS NULL) AND ("id_comision_bancaria_m5" IS NOT NULL)))),
    CONSTRAINT "costo_envio_importacion_m5_fuente_check" CHECK ((("fuente")::"text" = ANY (ARRAY[('directo'::character varying)::"text", ('obligacion'::character varying)::"text", ('comision'::character varying)::"text"]))),
    CONSTRAINT "costo_envio_importacion_m5_monto_check" CHECK (("monto" > (0)::numeric))
);



ALTER TABLE "finanzas"."costo_envio_importacion_m5" ALTER COLUMN "id_costo_envio_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."costo_envio_importacion_m5_id_costo_envio_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."costo_proyecto" (
    "id_costo_proyecto" integer NOT NULL,
    "id_proyecto_financiero" integer NOT NULL,
    "id_moneda" integer NOT NULL,
    "descripcion_costo" "text" NOT NULL,
    "categoria_costo" character varying(80),
    "monto_costo" numeric(14,2) NOT NULL,
    "fecha_costo" "date" NOT NULL,
    "origen_costo" character varying(80),
    "estado_costo" character varying(30) DEFAULT 'registrado'::character varying NOT NULL,
    "observacion" "text",
    CONSTRAINT "chk_costo_proyecto_estado" CHECK ((("estado_costo")::"text" = ANY (ARRAY[('registrado'::character varying)::"text", ('validado'::character varying)::"text", ('anulado'::character varying)::"text"]))),
    CONSTRAINT "chk_costo_proyecto_monto" CHECK (("monto_costo" >= (0)::numeric))
);



ALTER TABLE "finanzas"."costo_proyecto" ALTER COLUMN "id_costo_proyecto" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."costo_proyecto_id_costo_proyecto_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."cotizacion" (
    "id_cotizacion" integer NOT NULL,
    "id_ficha_cliente" integer NOT NULL,
    "id_moneda" integer NOT NULL,
    "fecha_emision" "date" NOT NULL,
    "fecha_vigencia" "date",
    "subtotal_costos_estimados" numeric(14,2) DEFAULT 0 NOT NULL,
    "margen_esperado" numeric(5,2),
    "precio_sugerido" numeric(14,2),
    "monto_total_estimado" numeric(14,2),
    "estado_cotizacion" character varying(30) DEFAULT 'emitida'::character varying NOT NULL,
    "observacion" "text",
    "descuento_tipo" character varying(20),
    "descuento_valor" numeric(14,2) DEFAULT 0 NOT NULL,
    "exento_iva" boolean DEFAULT false NOT NULL,
    "monto_impuesto" numeric(14,2),
    "monto_neto" numeric(14,2),
    "referencia_demostracion" character varying(80),
    "segmento_comercial" character varying(3),
    "nombre_proyecto" character varying(200),
    "referencia_comercial" character varying(200),
    "alcance_comercial" character varying(30),
    "requiere_instalacion" character varying(20),
    "direccion_instalacion" character varying(500),
    "region_instalacion" character varying(120),
    "ciudad_instalacion" character varying(120),
    "comuna_instalacion" character varying(120),
    "estado_cobertura_instalacion" character varying(30),
    "id_tarifa_instalacion_comercial" bigint,
    "precio_instalacion_aplicado" numeric(14,2),
    "id_condicion_comercial_version" bigint,
    "responsable_comercial" bigint,
    "revision" integer DEFAULT 1 NOT NULL,
    "id_obra_contexto" bigint,
    CONSTRAINT "chk_cotizacion_estado" CHECK ((("estado_cotizacion")::"text" = ANY (ARRAY[('borrador'::character varying)::"text", ('emitida'::character varying)::"text", ('aprobada'::character varying)::"text", ('rechazada'::character varying)::"text", ('vencida'::character varying)::"text", ('anulada'::character varying)::"text", ('descartada'::character varying)::"text"]))),
    CONSTRAINT "chk_cotizacion_margen" CHECK ((("margen_esperado" IS NULL) OR ("margen_esperado" >= (0)::numeric))),
    CONSTRAINT "chk_cotizacion_precio" CHECK ((("precio_sugerido" IS NULL) OR ("precio_sugerido" >= (0)::numeric))),
    CONSTRAINT "chk_cotizacion_subtotal" CHECK (("subtotal_costos_estimados" >= (0)::numeric)),
    CONSTRAINT "chk_cotizacion_total" CHECK ((("monto_total_estimado" IS NULL) OR ("monto_total_estimado" >= (0)::numeric))),
    CONSTRAINT "ck_cotizacion_alcance_comercial" CHECK ((("alcance_comercial" IS NULL) OR (("alcance_comercial")::"text" = ANY (ARRAY[('SOLO_SUMINISTRO'::character varying)::"text", ('SOLO_INSTALACION'::character varying)::"text", ('SUMINISTRO_INSTALACION'::character varying)::"text"])))),
    CONSTRAINT "ck_cotizacion_estado_cobertura" CHECK ((("estado_cobertura_instalacion" IS NULL) OR (("estado_cobertura_instalacion")::"text" = ANY (ARRAY[('DISPONIBLE'::character varying)::"text", ('NO_DISPONIBLE'::character varying)::"text", ('REQUIERE_EVALUACION'::character varying)::"text", ('NO_APLICA'::character varying)::"text"])))),
    CONSTRAINT "ck_cotizacion_precio_instalacion" CHECK ((("precio_instalacion_aplicado" IS NULL) OR ("precio_instalacion_aplicado" > (0)::numeric))),
    CONSTRAINT "ck_cotizacion_requiere_instalacion" CHECK ((("requiere_instalacion" IS NULL) OR (("requiere_instalacion")::"text" = ANY (ARRAY[('SI'::character varying)::"text", ('NO'::character varying)::"text", ('POR_DEFINIR'::character varying)::"text"])))),
    CONSTRAINT "ck_cotizacion_revision" CHECK (("revision" > 0)),
    CONSTRAINT "ck_cotizacion_segmento_comercial" CHECK ((("segmento_comercial" IS NULL) OR (("segmento_comercial")::"text" = ANY (ARRAY[('B2B'::character varying)::"text", ('B2C'::character varying)::"text"]))))
);



ALTER TABLE "finanzas"."cotizacion" ALTER COLUMN "id_cotizacion" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."cotizacion_id_cotizacion_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."cotizacion_salud_empleado" (
    "id_cotizacion_salud" integer NOT NULL,
    "id_empleado" integer NOT NULL,
    "valor" numeric(14,6) NOT NULL,
    "unidad" character varying(20) NOT NULL,
    "vigencia_desde" "date" NOT NULL,
    "vigencia_hasta" "date",
    "activa" boolean DEFAULT true NOT NULL,
    CONSTRAINT "chk_cotizacion_salud_empleado_unidad" CHECK ((("unidad")::"text" = ANY (ARRAY[('PORCENTAJE'::character varying)::"text", ('UF'::character varying)::"text", ('CLP'::character varying)::"text"]))),
    CONSTRAINT "chk_cotizacion_salud_empleado_valor" CHECK (("valor" >= (0)::numeric)),
    CONSTRAINT "chk_cotizacion_salud_empleado_vigencia" CHECK ((("vigencia_hasta" IS NULL) OR ("vigencia_hasta" >= "vigencia_desde")))
);



CREATE SEQUENCE "finanzas"."cotizacion_salud_empleado_id_cotizacion_salud_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."cotizacion_salud_empleado_id_cotizacion_salud_seq" OWNED BY "finanzas"."cotizacion_salud_empleado"."id_cotizacion_salud";



CREATE TABLE "finanzas"."ficha_cliente" (
    "id_ficha_cliente" integer NOT NULL,
    "id_cliente_financiero" integer NOT NULL,
    "fecha_creacion" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "estado_ficha" character varying(20) DEFAULT 'activa'::character varying NOT NULL,
    "fecha_ultima_revision" timestamp without time zone,
    "observacion_financiera_general" "text",
    CONSTRAINT "chk_ficha_cliente_estado" CHECK ((("estado_ficha")::"text" = ANY (ARRAY[('activa'::character varying)::"text", ('inactiva'::character varying)::"text", ('bloqueada'::character varying)::"text", ('cerrada'::character varying)::"text"])))
);



CREATE TABLE "finanzas"."tipo_cliente_financiero" (
    "id_tipo_cliente_financiero" integer NOT NULL,
    "nombre_tipo_cliente_financiero" character varying(80) NOT NULL,
    "descripcion_tipo_cliente_financiero" "text",
    "estado_tipo_cliente_financiero" character varying(20) DEFAULT 'activo'::character varying NOT NULL,
    CONSTRAINT "chk_tipo_cliente_financiero_estado" CHECK ((("estado_tipo_cliente_financiero")::"text" = ANY (ARRAY[('activo'::character varying)::"text", ('inactivo'::character varying)::"text"])))
);



CREATE VIEW "finanzas"."cotizacion_segmento_pendiente_revision" AS
 SELECT "c"."id_cotizacion",
    "c"."id_ficha_cliente",
    "t"."nombre_tipo_cliente_financiero" AS "tipo_cliente_actual"
   FROM ((("finanzas"."cotizacion" "c"
     JOIN "finanzas"."ficha_cliente" "f" ON (("f"."id_ficha_cliente" = "c"."id_ficha_cliente")))
     JOIN "finanzas"."cliente_financiero" "cf" ON (("cf"."id_cliente_financiero" = "f"."id_cliente_financiero")))
     JOIN "finanzas"."tipo_cliente_financiero" "t" ON (("t"."id_tipo_cliente_financiero" = "cf"."id_tipo_cliente_financiero")))
  WHERE ("c"."segmento_comercial" IS NULL);



CREATE TABLE "finanzas"."cotizacion_version" (
    "id_cotizacion_version" integer NOT NULL,
    "id_cotizacion" integer NOT NULL,
    "fecha" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "antecedentes" "jsonb" NOT NULL,
    "motivo" "text" NOT NULL,
    "numero_version_comercial" integer,
    "tipo_version" character varying(30),
    "snapshot_comercial" "jsonb",
    "id_documento_logico" bigint,
    "estado_documental" character varying(30),
    "usuario_id_usuario" bigint,
    "clave_idempotencia" character varying(160),
    CONSTRAINT "ck_cotizacion_version_contrato_comercial" CHECK (((("numero_version_comercial" IS NULL) AND ("tipo_version" IS NULL) AND ("snapshot_comercial" IS NULL) AND ("estado_documental" IS NULL) AND ("usuario_id_usuario" IS NULL) AND ("clave_idempotencia" IS NULL)) OR (("numero_version_comercial" IS NOT NULL) AND ("tipo_version" IS NOT NULL) AND ("snapshot_comercial" IS NOT NULL) AND ("estado_documental" IS NOT NULL) AND ("usuario_id_usuario" IS NOT NULL) AND ("clave_idempotencia" IS NOT NULL)))),
    CONSTRAINT "ck_cotizacion_version_estado_documental" CHECK ((("estado_documental" IS NULL) OR (("estado_documental")::"text" = ANY (ARRAY[('PENDIENTE_DOCUMENTO'::character varying)::"text", ('DISPONIBLE'::character varying)::"text", ('ERROR'::character varying)::"text", ('REEMPLAZADA'::character varying)::"text"])))),
    CONSTRAINT "ck_cotizacion_version_numero_comercial" CHECK ((("numero_version_comercial" IS NULL) OR ("numero_version_comercial" > 0))),
    CONSTRAINT "ck_cotizacion_version_tipo" CHECK ((("tipo_version" IS NULL) OR (("tipo_version")::"text" = ANY (ARRAY[('BORRADOR'::character varying)::"text", ('EMISION'::character varying)::"text", ('RECTIFICACION'::character varying)::"text"]))))
);



CREATE SEQUENCE "finanzas"."cotizacion_version_id_cotizacion_version_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."cotizacion_version_id_cotizacion_version_seq" OWNED BY "finanzas"."cotizacion_version"."id_cotizacion_version";



CREATE TABLE "finanzas"."credito_proyecto" (
    "id_credito_proyecto" integer NOT NULL,
    "id_ficha_cliente" integer NOT NULL,
    "id_proyecto_financiero" integer,
    "id_limite_credito_cliente" integer NOT NULL,
    "id_fondo_global_credito" integer NOT NULL,
    "id_evaluacion_credito" integer NOT NULL,
    "monto_credito" numeric(14,2) NOT NULL,
    "fecha_otorgamiento" "date" NOT NULL,
    "fecha_vencimiento" "date",
    "estado_credito" character varying(30) DEFAULT 'vigente'::character varying NOT NULL,
    "motivo_aprobacion" "text",
    "observacion" "text",
    CONSTRAINT "chk_credito_proyecto_estado" CHECK ((("estado_credito")::"text" = ANY (ARRAY[('vigente'::character varying)::"text", ('pagado'::character varying)::"text", ('vencido'::character varying)::"text", ('anulado'::character varying)::"text"]))),
    CONSTRAINT "chk_credito_proyecto_monto" CHECK (("monto_credito" > (0)::numeric))
);



ALTER TABLE "finanzas"."credito_proyecto" ALTER COLUMN "id_credito_proyecto" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."credito_proyecto_id_credito_proyecto_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."cuenta_bancaria_m7" (
    "id_cuenta_bancaria_m7" integer NOT NULL,
    "banco" character varying(100) NOT NULL,
    "alias_cuenta" character varying(100) NOT NULL,
    "identificador_bancario" character varying(120) NOT NULL,
    "id_moneda" integer NOT NULL,
    "estado" character varying(20) DEFAULT 'activa'::character varying NOT NULL,
    "creado_por" bigint NOT NULL,
    "fecha_creacion" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizado_por" bigint,
    "fecha_actualizacion" timestamp(6) with time zone,
    CONSTRAINT "chk_cuenta_bancaria_m7_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('activa'::character varying)::"text", ('inactiva'::character varying)::"text"]))),
    CONSTRAINT "chk_cuenta_bancaria_m7_textos" CHECK ((("length"("btrim"(("banco")::"text")) > 0) AND ("length"("btrim"(("alias_cuenta")::"text")) > 0) AND ("length"("btrim"(("identificador_bancario")::"text")) > 0)))
);



CREATE SEQUENCE "finanzas"."cuenta_bancaria_m7_id_cuenta_bancaria_m7_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."cuenta_bancaria_m7_id_cuenta_bancaria_m7_seq" OWNED BY "finanzas"."cuenta_bancaria_m7"."id_cuenta_bancaria_m7";



CREATE TABLE "finanzas"."decision_rectificacion_orden_trabajo" (
    "id_decision_rectificacion" bigint CONSTRAINT "decision_rectificacion_orden_id_decision_rectificacion_not_null" NOT NULL,
    "id_rectificacion_ot" bigint CONSTRAINT "decision_rectificacion_orden_traba_id_rectificacion_ot_not_null" NOT NULL,
    "id_version_rectificacion" bigint CONSTRAINT "decision_rectificacion_orden__id_version_rectificacion_not_null" NOT NULL,
    "decision" character varying(20) NOT NULL,
    "motivo" "text",
    "observaciones_tecnicas" "text",
    "decidido_por" bigint NOT NULL,
    "decidido_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "decision_rectificacion_tipo_ck" CHECK ((("decision")::"text" = ANY (ARRAY[('APROBADA'::character varying)::"text", ('DEVUELTA'::character varying)::"text"])))
);



CREATE SEQUENCE "finanzas"."decision_rectificacion_orden_trab_id_decision_rectificacion_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."decision_rectificacion_orden_trab_id_decision_rectificacion_seq" OWNED BY "finanzas"."decision_rectificacion_orden_trabajo"."id_decision_rectificacion";



CREATE TABLE "finanzas"."decision_remuneracional_retrabajo" (
    "id_decision_retrabajo" integer CONSTRAINT "decision_remuneracional_retrabaj_id_decision_retrabajo_not_null" NOT NULL,
    "id_incidencia_retrabajo" bigint CONSTRAINT "decision_remuneracional_retrab_id_incidencia_retrabajo_not_null" NOT NULL,
    "id_tratamiento_remuneracional" integer CONSTRAINT "decision_remuneracional_ret_id_tratamiento_remuneracio_not_null" NOT NULL,
    "decision" character varying(30) NOT NULL,
    "motivo" "text" NOT NULL,
    "id_usuario_resolutor" bigint NOT NULL,
    "fecha_resolucion" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "ck_decision_remuneracional_retrabajo" CHECK ((("decision")::"text" = ANY (ARRAY[('remunerable'::character varying)::"text", ('no_remunerable'::character varying)::"text"])))
);



CREATE SEQUENCE "finanzas"."decision_remuneracional_retrabajo_id_decision_retrabajo_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."decision_remuneracional_retrabajo_id_decision_retrabajo_seq" OWNED BY "finanzas"."decision_remuneracional_retrabajo"."id_decision_retrabajo";



CREATE TABLE "finanzas"."detalle_compensacion_saldo_favor_m5" (
    "id_detalle_compensacion_m5" integer CONSTRAINT "detalle_compensacion_saldo__id_detalle_compensacion_m5_not_null" NOT NULL,
    "id_compensacion_m5" integer NOT NULL,
    "id_obligacion_m5" integer NOT NULL,
    "monto_aplicado" numeric(14,2) NOT NULL,
    CONSTRAINT "detalle_compensacion_saldo_favor_m5_monto_aplicado_check" CHECK (("monto_aplicado" > (0)::numeric))
);



ALTER TABLE "finanzas"."detalle_compensacion_saldo_favor_m5" ALTER COLUMN "id_detalle_compensacion_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."detalle_compensacion_saldo_favor_id_detalle_compensacion_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."detalle_conciliacion" (
    "id_detalle_conciliacion" integer NOT NULL,
    "id_conciliacion" integer NOT NULL,
    "descripcion_diferencia" "text",
    "monto_diferencia" numeric(14,2),
    "tipo_diferencia" character varying(50),
    "estado_revision" character varying(30) DEFAULT 'pendiente'::character varying NOT NULL,
    "observacion" "text",
    CONSTRAINT "chk_detalle_conciliacion_estado" CHECK ((("estado_revision")::"text" = ANY (ARRAY[('pendiente'::character varying)::"text", ('revisado'::character varying)::"text", ('resuelto'::character varying)::"text", ('anulado'::character varying)::"text"])))
);



ALTER TABLE "finanzas"."detalle_conciliacion" ALTER COLUMN "id_detalle_conciliacion" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."detalle_conciliacion_id_detalle_conciliacion_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."detalle_costo_material_cotizacion" (
    "id_detalle_costo_material_cotizacion" integer CONSTRAINT "detalle_costo_material_coti_id_detalle_costo_material__not_null" NOT NULL,
    "id_detalle_cotizacion" integer CONSTRAINT "detalle_costo_material_cotizacio_id_detalle_cotizacion_not_null" NOT NULL,
    "id_historial_precio_material" integer CONSTRAINT "detalle_costo_material_coti_id_historial_precio_materi_not_null" NOT NULL,
    "cantidad_material_estimada" numeric(14,4) CONSTRAINT "detalle_costo_material_coti_cantidad_material_estimada_not_null" NOT NULL,
    "precio_unitario_usado" numeric(14,2) CONSTRAINT "detalle_costo_material_cotizacio_precio_unitario_usado_not_null" NOT NULL,
    "subtotal_material_estimado" numeric(14,2) CONSTRAINT "detalle_costo_material_coti_subtotal_material_estimado_not_null" NOT NULL,
    "observacion" "text",
    CONSTRAINT "chk_detalle_costo_material_cantidad" CHECK (("cantidad_material_estimada" >= (0)::numeric)),
    CONSTRAINT "chk_detalle_costo_material_precio" CHECK (("precio_unitario_usado" >= (0)::numeric)),
    CONSTRAINT "chk_detalle_costo_material_subtotal" CHECK (("subtotal_material_estimado" >= (0)::numeric))
);



ALTER TABLE "finanzas"."detalle_costo_material_cotizacion" ALTER COLUMN "id_detalle_costo_material_cotizacion" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."detalle_costo_material_cotiza_id_detalle_costo_material_cot_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."detalle_costo_proyecto_documento_proveedor" (
    "id_detalle_costo_proyecto_documento_proveedor" integer CONSTRAINT "detalle_costo_proyecto_docu_id_detalle_costo_proyecto__not_null" NOT NULL,
    "id_documento_compra_proveedor" integer CONSTRAINT "detalle_costo_proyecto_docu_id_documento_compra_provee_not_null" NOT NULL,
    "id_costo_proyecto" integer CONSTRAINT "detalle_costo_proyecto_documento_pro_id_costo_proyecto_not_null" NOT NULL,
    "monto_imputado" numeric(14,2) CONSTRAINT "detalle_costo_proyecto_documento_provee_monto_imputado_not_null" NOT NULL,
    "porcentaje_imputado" numeric(5,2),
    "observacion" "text",
    CONSTRAINT "chk_detalle_costo_proyecto_monto" CHECK (("monto_imputado" >= (0)::numeric)),
    CONSTRAINT "chk_detalle_costo_proyecto_porcentaje" CHECK ((("porcentaje_imputado" IS NULL) OR (("porcentaje_imputado" >= (0)::numeric) AND ("porcentaje_imputado" <= (100)::numeric))))
);



ALTER TABLE "finanzas"."detalle_costo_proyecto_documento_proveedor" ALTER COLUMN "id_detalle_costo_proyecto_documento_proveedor" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."detalle_costo_proyecto_docume_id_detalle_costo_proyecto_doc_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."detalle_cotizacion" (
    "id_detalle_cotizacion" integer NOT NULL,
    "id_cotizacion" integer NOT NULL,
    "id_item_comercial" integer NOT NULL,
    "cantidad_item" numeric(12,2) DEFAULT 1 NOT NULL,
    "medida_alto_referencial" numeric(10,2),
    "medida_ancho_referencial" numeric(10,2),
    "medida_espesor_referencial" numeric(10,2),
    "descripcion_item_cotizado" "text",
    "observacion_medidas" "text",
    "subtotal_item_estimado" numeric(14,2) DEFAULT 0 NOT NULL,
    "id_extension_producto_comercial" integer,
    "id_producto_comercial_version" integer,
    "id_precio_producto_comercial" bigint,
    "tipo_linea_comercial" character varying(30),
    "precio_lista_aplicado" numeric(14,2),
    "precio_unitario_autorizado" numeric(14,2),
    "descuento_elegible" boolean,
    "es_precio_excepcional" boolean DEFAULT false NOT NULL,
    "motivo_precio_excepcional" "text",
    "precio_excepcional_autorizado_por" bigint,
    "snapshot_comercial" "jsonb",
    "revision" integer DEFAULT 1 NOT NULL,
    "id_alternativa_b2c_aceptada" bigint,
    CONSTRAINT "chk_detalle_cotizacion_cantidad" CHECK (("cantidad_item" > (0)::numeric)),
    CONSTRAINT "chk_detalle_cotizacion_subtotal" CHECK (("subtotal_item_estimado" >= (0)::numeric)),
    CONSTRAINT "ck_detalle_cotizacion_excepcion" CHECK (((("es_precio_excepcional" = false) AND ("motivo_precio_excepcional" IS NULL) AND ("precio_excepcional_autorizado_por" IS NULL)) OR (("es_precio_excepcional" = true) AND ("precio_unitario_autorizado" IS NOT NULL) AND ("motivo_precio_excepcional" IS NOT NULL) AND ("precio_excepcional_autorizado_por" IS NOT NULL)))),
    CONSTRAINT "ck_detalle_cotizacion_precios" CHECK (((("precio_lista_aplicado" IS NULL) OR ("precio_lista_aplicado" > (0)::numeric)) AND (("precio_unitario_autorizado" IS NULL) OR ("precio_unitario_autorizado" > (0)::numeric)))),
    CONSTRAINT "ck_detalle_cotizacion_producto_version" CHECK (((("id_extension_producto_comercial" IS NULL) AND ("id_producto_comercial_version" IS NULL)) OR (("id_extension_producto_comercial" IS NOT NULL) AND ("id_producto_comercial_version" IS NOT NULL)))),
    CONSTRAINT "ck_detalle_cotizacion_revision" CHECK (("revision" > 0)),
    CONSTRAINT "ck_detalle_cotizacion_tipo_linea" CHECK ((("tipo_linea_comercial" IS NULL) OR (("tipo_linea_comercial")::"text" = ANY (ARRAY[('PRODUCTO'::character varying)::"text", ('INSTALACION'::character varying)::"text", ('FLETE'::character varying)::"text", ('CARGA_DESCARGA'::character varying)::"text", ('SERVICIO_ADICIONAL'::character varying)::"text"]))))
);



ALTER TABLE "finanzas"."detalle_cotizacion" ALTER COLUMN "id_detalle_cotizacion" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."detalle_cotizacion_id_detalle_cotizacion_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."detalle_documento_compra_proveedor" (
    "id_detalle_documento_compra_proveedor" integer CONSTRAINT "detalle_documento_compra_pr_id_detalle_documento_compr_not_null" NOT NULL,
    "id_documento_compra_proveedor" integer CONSTRAINT "detalle_documento_compra_pr_id_documento_compra_provee_not_null" NOT NULL,
    "id_historial_precio_material" integer CONSTRAINT "detalle_documento_compra_pr_id_historial_precio_materi_not_null" NOT NULL,
    "cantidad_material" numeric(14,4) NOT NULL,
    "unidad_medida" character varying(30),
    "precio_unitario_documento" numeric(14,2) CONSTRAINT "detalle_documento_compra_pro_precio_unitario_documento_not_null" NOT NULL,
    "subtotal_linea" numeric(14,2) NOT NULL,
    "observacion" "text",
    CONSTRAINT "chk_detalle_documento_compra_cantidad" CHECK (("cantidad_material" > (0)::numeric)),
    CONSTRAINT "chk_detalle_documento_compra_precio" CHECK (("precio_unitario_documento" >= (0)::numeric)),
    CONSTRAINT "chk_detalle_documento_compra_subtotal" CHECK (("subtotal_linea" >= (0)::numeric))
);



ALTER TABLE "finanzas"."detalle_documento_compra_proveedor" ALTER COLUMN "id_detalle_documento_compra_proveedor" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."detalle_documento_compra_prov_id_detalle_documento_compra_p_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."detalle_evento_auditoria" (
    "id_detalle_evento_auditoria" integer NOT NULL,
    "id_evento_auditoria" integer NOT NULL,
    "atributo_modificado" character varying(100) NOT NULL,
    "valor_anterior" "text",
    "valor_nuevo" "text",
    "observacion" "text"
);



ALTER TABLE "finanzas"."detalle_evento_auditoria" ALTER COLUMN "id_detalle_evento_auditoria" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."detalle_evento_auditoria_id_detalle_evento_auditoria_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."detalle_imputacion_m5" (
    "id_detalle_imputacion_m5" integer NOT NULL,
    "id_propuesta_imputacion_m5" integer NOT NULL,
    "id_clasificacion_m5" integer NOT NULL,
    "destino" character varying(20) NOT NULL,
    "id_proyecto" bigint,
    "id_orden_trabajo" bigint,
    "monto" numeric(14,2) NOT NULL,
    CONSTRAINT "detalle_imputacion_m5_destino_check" CHECK ((("destino")::"text" = ANY (ARRAY[('general'::character varying)::"text", ('proyecto'::character varying)::"text"]))),
    CONSTRAINT "detalle_imputacion_m5_monto_check" CHECK (("monto" > (0)::numeric))
);



ALTER TABLE "finanzas"."detalle_imputacion_m5" ALTER COLUMN "id_detalle_imputacion_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."detalle_imputacion_m5_id_detalle_imputacion_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."detalle_liquidacion_remuneracion" (
    "id_detalle_liquidacion_remuneracion" integer CONSTRAINT "detalle_liquidacion_remuner_id_detalle_liquidacion_rem_not_null" NOT NULL,
    "id_liquidacion_remuneracion" integer CONSTRAINT "detalle_liquidacion_remuner_id_liquidacion_remuneracio_not_null" NOT NULL,
    "id_concepto_remuneracion" integer CONSTRAINT "detalle_liquidacion_remunerac_id_concepto_remuneracion_not_null" NOT NULL,
    "monto_concepto" numeric(14,2) NOT NULL,
    "observacion" "text",
    CONSTRAINT "chk_detalle_liquidacion_monto" CHECK (("monto_concepto" >= (0)::numeric))
);



ALTER TABLE "finanzas"."detalle_liquidacion_remuneracion" ALTER COLUMN "id_detalle_liquidacion_remuneracion" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."detalle_liquidacion_remunerac_id_detalle_liquidacion_remune_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."detalle_material_orden_compra_m5" (
    "id_detalle_material_oc_m5" integer CONSTRAINT "detalle_material_orden_compr_id_detalle_material_oc_m5_not_null" NOT NULL,
    "id_ocs_m5" integer NOT NULL,
    "material_sku" character varying(16) NOT NULL,
    "cantidad_pedida" numeric(12,4) NOT NULL,
    "cantidad_recibida" numeric(12,4) DEFAULT 0 NOT NULL,
    "fecha_esperada" "date",
    CONSTRAINT "chk_detalle_material_oc_m5_cantidades" CHECK ((("cantidad_pedida" > (0)::numeric) AND ("cantidad_recibida" >= (0)::numeric) AND ("cantidad_recibida" <= "cantidad_pedida")))
);



CREATE SEQUENCE "finanzas"."detalle_material_orden_compra_m5_id_detalle_material_oc_m5_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."detalle_material_orden_compra_m5_id_detalle_material_oc_m5_seq" OWNED BY "finanzas"."detalle_material_orden_compra_m5"."id_detalle_material_oc_m5";



CREATE TABLE "finanzas"."detalle_presupuesto_m10" (
    "id_detalle_presupuesto_m10" bigint NOT NULL,
    "id_version_presupuesto_m10" bigint NOT NULL,
    "mes" integer NOT NULL,
    "tipo" character varying(30) NOT NULL,
    "categoria" character varying(50) NOT NULL,
    "monto" numeric(14,2) NOT NULL,
    CONSTRAINT "ck_detalle_presupuesto_m10_mes" CHECK ((("mes" >= 1) AND ("mes" <= 12))),
    CONSTRAINT "ck_detalle_presupuesto_m10_monto" CHECK (("monto" >= (0)::numeric)),
    CONSTRAINT "ck_detalle_presupuesto_m10_tipo" CHECK ((("tipo")::"text" = ANY (ARRAY[('RESULTADOS'::character varying)::"text", ('FLUJO_CAJA'::character varying)::"text"])))
);



CREATE SEQUENCE "finanzas"."detalle_presupuesto_m10_id_detalle_presupuesto_m10_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."detalle_presupuesto_m10_id_detalle_presupuesto_m10_seq" OWNED BY "finanzas"."detalle_presupuesto_m10"."id_detalle_presupuesto_m10";



CREATE TABLE "finanzas"."detalle_reasignacion_costo_m5" (
    "id_detalle_reasignacion_m5" integer CONSTRAINT "detalle_reasignacion_costo__id_detalle_reasignacion_m5_not_null" NOT NULL,
    "id_solicitud_reasignacion_m5" integer CONSTRAINT "detalle_reasignacion_costo__id_solicitud_reasignacion__not_null" NOT NULL,
    "destino" character varying(20) NOT NULL,
    "id_proyecto" bigint,
    "id_orden_trabajo" bigint,
    "monto" numeric(14,2) NOT NULL,
    CONSTRAINT "chk_detalle_reasignacion_m5_destino" CHECK ((((("destino")::"text" = 'general'::"text") AND ("id_proyecto" IS NULL) AND ("id_orden_trabajo" IS NULL)) OR ((("destino")::"text" = 'proyecto'::"text") AND ("id_proyecto" IS NOT NULL)))),
    CONSTRAINT "detalle_reasignacion_costo_m5_destino_check" CHECK ((("destino")::"text" = ANY (ARRAY[('general'::character varying)::"text", ('proyecto'::character varying)::"text"]))),
    CONSTRAINT "detalle_reasignacion_costo_m5_monto_check" CHECK (("monto" > (0)::numeric))
);



ALTER TABLE "finanzas"."detalle_reasignacion_costo_m5" ALTER COLUMN "id_detalle_reasignacion_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."detalle_reasignacion_costo_m5_id_detalle_reasignacion_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."detalle_reclasificacion_egreso_m5" (
    "id_detalle_reclasificacion_m5" integer CONSTRAINT "detalle_reclasificacion_egr_id_detalle_reclasificacion_not_null" NOT NULL,
    "id_reclasificacion_m5" integer CONSTRAINT "detalle_reclasificacion_egreso_m_id_reclasificacion_m5_not_null" NOT NULL,
    "id_clasificacion_origen_m5" integer CONSTRAINT "detalle_reclasificacion_egr_id_clasificacion_origen_m5_not_null" NOT NULL,
    "id_asociacion_m5" integer NOT NULL,
    "id_categoria_origen_m5" integer CONSTRAINT "detalle_reclasificacion_egreso__id_categoria_origen_m5_not_null" NOT NULL,
    "id_categoria_destino_m5" integer CONSTRAINT "detalle_reclasificacion_egreso_id_categoria_destino_m5_not_null" NOT NULL,
    "monto" numeric(14,2) NOT NULL,
    CONSTRAINT "detalle_reclasificacion_egreso_m5_monto_check" CHECK (("monto" > (0)::numeric))
);



ALTER TABLE "finanzas"."detalle_reclasificacion_egreso_m5" ALTER COLUMN "id_detalle_reclasificacion_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."detalle_reclasificacion_egres_id_detalle_reclasificacion_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."detalle_servicio_cotizacion" (
    "id_detalle_servicio_cotizacion" bigint CONSTRAINT "detalle_servicio_cotizacion_id_detalle_servicio_cotiza_not_null" NOT NULL,
    "id_cotizacion" integer NOT NULL,
    "id_servicio_comercial" bigint NOT NULL,
    "id_precio_servicio_comercial" bigint CONSTRAINT "detalle_servicio_cotizacion_id_precio_servicio_comerci_not_null" NOT NULL,
    "tipo_linea_comercial" character varying(30) NOT NULL,
    "descripcion_cotizada" "text" NOT NULL,
    "cantidad" numeric(12,2) NOT NULL,
    "unidad_cobro_cotizada" character varying(40) NOT NULL,
    "precio_unitario_autorizado" numeric(14,2) NOT NULL,
    "descuento_elegible" boolean DEFAULT true NOT NULL,
    "subtotal" numeric(14,2) NOT NULL,
    "snapshot_comercial" "jsonb" NOT NULL,
    "revision" integer DEFAULT 1 NOT NULL,
    CONSTRAINT "ck_detalle_servicio_importes" CHECK ((("cantidad" > (0)::numeric) AND ("precio_unitario_autorizado" > (0)::numeric) AND ("subtotal" = "round"(("cantidad" * "precio_unitario_autorizado"), 2)))),
    CONSTRAINT "ck_detalle_servicio_revision" CHECK (("revision" > 0)),
    CONSTRAINT "ck_detalle_servicio_tipo" CHECK ((("tipo_linea_comercial")::"text" = ANY (ARRAY[('FLETE'::character varying)::"text", ('DESPACHO'::character varying)::"text", ('TRANSPORTE'::character varying)::"text", ('CARGA_DESCARGA'::character varying)::"text", ('SERVICIO_ADICIONAL'::character varying)::"text"])))
);



CREATE SEQUENCE "finanzas"."detalle_servicio_cotizacion_id_detalle_servicio_cotizacion_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."detalle_servicio_cotizacion_id_detalle_servicio_cotizacion_seq" OWNED BY "finanzas"."detalle_servicio_cotizacion"."id_detalle_servicio_cotizacion";



CREATE TABLE "finanzas"."documento_compra_proveedor" (
    "id_documento_compra_proveedor" integer CONSTRAINT "documento_compra_proveedor_id_documento_compra_proveed_not_null" NOT NULL,
    "id_proveedor" integer NOT NULL,
    "id_tipo_documento" integer NOT NULL,
    "id_moneda" integer NOT NULL,
    "numero_documento" character varying(80) NOT NULL,
    "fecha_emision" "date" NOT NULL,
    "fecha_vencimiento" "date",
    "monto_neto" numeric(14,2) DEFAULT 0 NOT NULL,
    "monto_impuesto" numeric(14,2) DEFAULT 0 NOT NULL,
    "monto_total" numeric(14,2) DEFAULT 0 NOT NULL,
    "tipo_cambio_usado" numeric(14,4),
    "fecha_tipo_cambio" "date",
    "monto_convertido" numeric(14,2),
    "estado_documento" character varying(30) DEFAULT 'registrado'::character varying NOT NULL,
    "respaldo_documento" "text",
    "observacion" "text",
    CONSTRAINT "chk_documento_compra_proveedor_convertido" CHECK ((("monto_convertido" IS NULL) OR ("monto_convertido" >= (0)::numeric))),
    CONSTRAINT "chk_documento_compra_proveedor_estado" CHECK ((("estado_documento")::"text" = ANY (ARRAY[('registrado'::character varying)::"text", ('pendiente_pago'::character varying)::"text", ('pagado'::character varying)::"text", ('vencido'::character varying)::"text", ('anulado'::character varying)::"text"]))),
    CONSTRAINT "chk_documento_compra_proveedor_montos" CHECK ((("monto_neto" >= (0)::numeric) AND ("monto_impuesto" >= (0)::numeric) AND ("monto_total" >= (0)::numeric)))
);



ALTER TABLE "finanzas"."documento_compra_proveedor" ALTER COLUMN "id_documento_compra_proveedor" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."documento_compra_proveedor_id_documento_compra_proveedor_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."documento_logico" (
    "id_documento_logico" bigint NOT NULL,
    "titulo" character varying(200) NOT NULL,
    "clasificacion" character varying(60) NOT NULL,
    "estado" character varying(20) DEFAULT 'ACTIVO'::character varying NOT NULL,
    "es_historico" boolean DEFAULT false NOT NULL,
    "numero_version_actual" integer,
    "id_configuracion_conservacion" integer,
    "creado_por" bigint NOT NULL,
    "creado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "desactivado_en" timestamp(6) with time zone,
    "motivo_desactivacion" "text",
    "revision" integer DEFAULT 1 NOT NULL,
    CONSTRAINT "chk_documento_logico_desactivacion" CHECK ((((("estado")::"text" = 'ACTIVO'::"text") AND ("desactivado_en" IS NULL)) OR (("estado")::"text" <> 'ACTIVO'::"text"))),
    CONSTRAINT "chk_documento_logico_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('ACTIVO'::character varying)::"text", ('INACTIVO'::character varying)::"text", ('ARCHIVADO'::character varying)::"text"]))),
    CONSTRAINT "chk_documento_logico_revision" CHECK (("revision" > 0)),
    CONSTRAINT "chk_documento_logico_version_actual" CHECK ((("numero_version_actual" IS NULL) OR ("numero_version_actual" > 0)))
);



CREATE SEQUENCE "finanzas"."documento_logico_id_documento_logico_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."documento_logico_id_documento_logico_seq" OWNED BY "finanzas"."documento_logico"."id_documento_logico";



CREATE TABLE "finanzas"."documento_pdf_postgres" (
    "contenedor" character varying(80) NOT NULL,
    "clave" character varying(700) NOT NULL,
    "mime" character varying(150) NOT NULL,
    "tamano_bytes" bigint NOT NULL,
    "sha256" character(64) NOT NULL,
    "contenido" "bytea" NOT NULL,
    "creado_en" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "chk_documento_pdf_postgres_bytes" CHECK (("octet_length"("contenido") = "tamano_bytes")),
    CONSTRAINT "chk_documento_pdf_postgres_mime" CHECK ((("mime")::"text" = 'application/pdf'::"text")),
    CONSTRAINT "documento_pdf_postgres_sha256_check" CHECK (("sha256" ~ '^[0-9a-f]{64}$'::"text")),
    CONSTRAINT "documento_pdf_postgres_tamano_bytes_check" CHECK ((("tamano_bytes" > 0) AND ("tamano_bytes" <= 20971520)))
);



CREATE TABLE "finanzas"."documento_proveedor_m5" (
    "id_documento_m5" integer NOT NULL,
    "id_proveedor" integer NOT NULL,
    "clase" character varying(20) NOT NULL,
    "id_tipo_documento" integer NOT NULL,
    "folio" character varying(80) NOT NULL,
    "folio_normalizado" character varying(80) NOT NULL,
    "fecha_emision" "date" NOT NULL,
    "id_moneda" integer NOT NULL,
    "monto_total" numeric(14,2) NOT NULL,
    "estado" character varying(20) DEFAULT 'borrador'::character varying NOT NULL,
    "respaldo" "text",
    "descripcion" "text",
    "excepcion_sin_oc_tipo" character varying(40),
    "excepcion_sin_oc_descripcion" "text",
    "fecha_vencimiento" "date",
    "condicion_pago_dias_snapshot" integer,
    "condicion_pago_tipo_snapshot" character varying(20),
    "vencimiento_justificacion" "text",
    "carga_historica" boolean DEFAULT false NOT NULL,
    "tipo_cambio" numeric(14,4),
    "tipo_cambio_origen" character varying(40),
    "tipo_cambio_justificacion" "text",
    "tipo_cambio_usuario" bigint,
    "tipo_cambio_fecha" timestamp with time zone,
    "creado_por" bigint NOT NULL,
    "fecha_creacion" timestamp with time zone DEFAULT "now"() NOT NULL,
    "confirmado_por" bigint,
    "fecha_confirmacion" timestamp with time zone,
    CONSTRAINT "chk_documento_m5_clase" CHECK ((("clase")::"text" = ANY (ARRAY[('preliminar'::character varying)::"text", ('definitivo'::character varying)::"text", ('ajuste'::character varying)::"text"]))),
    CONSTRAINT "chk_documento_m5_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('borrador'::character varying)::"text", ('confirmado'::character varying)::"text", ('pendiente_excedente'::character varying)::"text", ('rechazado'::character varying)::"text", ('anulado'::character varying)::"text"]))),
    CONSTRAINT "chk_documento_m5_monto" CHECK (("monto_total" > (0)::numeric))
);



ALTER TABLE "finanzas"."documento_proveedor_m5" ALTER COLUMN "id_documento_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."documento_proveedor_m5_id_documento_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."documento_tributario" (
    "id_documento_tributario" integer NOT NULL,
    "id_ficha_cliente" integer NOT NULL,
    "id_nota_venta" integer,
    "id_tipo_documento" integer NOT NULL,
    "id_moneda" integer NOT NULL,
    "id_documento_referencia" integer,
    "folio_documento" character varying(80) NOT NULL,
    "fecha_emision" "date" NOT NULL,
    "fecha_vencimiento" "date",
    "monto_neto" numeric(14,2) DEFAULT 0 NOT NULL,
    "monto_impuesto" numeric(14,2) DEFAULT 0 NOT NULL,
    "monto_total" numeric(14,2) DEFAULT 0 NOT NULL,
    "estado_documento" character varying(30) DEFAULT 'emitido'::character varying NOT NULL,
    "fecha_anulacion" timestamp without time zone,
    "respaldo_documento" "text",
    "observacion" "text",
    CONSTRAINT "chk_documento_tributario_estado" CHECK ((("estado_documento")::"text" = ANY (ARRAY[('emitido'::character varying)::"text", ('pagado'::character varying)::"text", ('vencido'::character varying)::"text", ('anulado'::character varying)::"text", ('referenciado'::character varying)::"text"]))),
    CONSTRAINT "chk_documento_tributario_montos" CHECK ((("monto_neto" >= (0)::numeric) AND ("monto_impuesto" >= (0)::numeric) AND ("monto_total" >= (0)::numeric)))
);



ALTER TABLE "finanzas"."documento_tributario" ALTER COLUMN "id_documento_tributario" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."documento_tributario_id_documento_tributario_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."documento_tributario_nota_venta" (
    "id_documento_tributario" integer CONSTRAINT "documento_tributario_nota_vent_id_documento_tributario_not_null" NOT NULL,
    "id_nota_venta" integer NOT NULL
);



CREATE TABLE "finanzas"."efecto_financiero_ocs_m5" (
    "id_efecto_financiero_ocs_m5" integer NOT NULL,
    "id_ocs_m5" integer NOT NULL,
    "tipo_efecto" character varying(40) NOT NULL,
    "referencia" character varying(150),
    "monto_documentado" numeric(14,2) DEFAULT 0 NOT NULL,
    "fecha_registro" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "chk_efecto_ocs_m5_monto" CHECK (("monto_documentado" >= (0)::numeric)),
    CONSTRAINT "chk_efecto_ocs_m5_tipo" CHECK ((("tipo_efecto")::"text" = ANY (ARRAY[('documento_definitivo'::character varying)::"text", ('obligacion'::character varying)::"text", ('otro'::character varying)::"text", ('ND_M5'::character varying)::"text", ('ND_ANULADA_M5'::character varying)::"text"])))
);



ALTER TABLE "finanzas"."efecto_financiero_ocs_m5" ALTER COLUMN "id_efecto_financiero_ocs_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."efecto_financiero_ocs_m5_id_efecto_financiero_ocs_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."empleado" (
    "rut_empleado" character varying(15) NOT NULL,
    "id_cargo" integer,
    "id_tipo_vinculo_laboral" integer,
    "id_prevision_salud" integer,
    "id_afp" integer,
    "nombres" character varying(120) NOT NULL,
    "apellido_paterno" character varying(80) NOT NULL,
    "apellido_materno" character varying(80),
    "fecha_nacimiento" "date",
    "fecha_ingreso" "date",
    "sueldo_base" numeric(14,2),
    "seguro_cesantia" boolean DEFAULT true NOT NULL,
    "estado_laboral" character varying(30) DEFAULT 'activo'::character varying NOT NULL,
    "id_empleado" integer NOT NULL,
    "fecha_aplicacion_sueldo_base" "date",
    "correo_particular" character varying(254),
    "telefono_particular" character varying(30),
    "direccion_particular" "text",
    "tipo_correo" character varying(30),
    "consentimiento_electronico" boolean,
    "canal_documental" character varying(30),
    "seguro_cesantia_fundamento_exclusion" "text",
    CONSTRAINT "chk_empleado_estado" CHECK ((("estado_laboral")::"text" = ANY (ARRAY[('activo'::character varying)::"text", ('inactivo'::character varying)::"text", ('desvinculado'::character varying)::"text", ('suspendido'::character varying)::"text"]))),
    CONSTRAINT "chk_empleado_sueldo" CHECK (("sueldo_base" >= (0)::numeric))
);



ALTER TABLE "finanzas"."empleado" ALTER COLUMN "id_empleado" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."empleado_id_empleado_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."envio_importacion_m5" (
    "id_envio_importacion_m5" integer NOT NULL,
    "referencia" character varying(120) NOT NULL,
    "referencia_normalizada" character varying(120) NOT NULL,
    "fecha" "date" NOT NULL,
    "descripcion" "text",
    "estado" character varying(30) DEFAULT 'abierto'::character varying NOT NULL,
    "creado_por" bigint NOT NULL,
    "fecha_creacion" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "chk_envio_importacion_m5_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('abierto'::character varying)::"text", ('en_revision'::character varying)::"text", ('cerrado_financieramente'::character varying)::"text"]))),
    CONSTRAINT "envio_importacion_m5_estado_check" CHECK ((("estado")::"text" = ANY (ARRAY[('abierto'::character varying)::"text", ('en_revision'::character varying)::"text", ('cerrado_financieramente'::character varying)::"text"])))
);



ALTER TABLE "finanzas"."envio_importacion_m5" ALTER COLUMN "id_envio_importacion_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."envio_importacion_m5_id_envio_importacion_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."envio_orden_compra_m5" (
    "id_envio_orden_m5" integer NOT NULL,
    "id_envio_importacion_m5" integer NOT NULL,
    "tipo_orden" character varying(10) NOT NULL,
    "id_ocs_m5" integer,
    "id_orden_externa" character varying(100),
    "asociado_por" bigint NOT NULL,
    "fecha_asociacion" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "chk_envio_orden_m5_tipo" CHECK ((((("tipo_orden")::"text" = 'OCS'::"text") AND ("id_ocs_m5" IS NOT NULL) AND ("id_orden_externa" IS NULL)) OR ((("tipo_orden")::"text" = 'OCI'::"text") AND ("id_ocs_m5" IS NULL) AND ("id_orden_externa" IS NOT NULL)))),
    CONSTRAINT "envio_orden_compra_m5_tipo_orden_check" CHECK ((("tipo_orden")::"text" = ANY (ARRAY[('OCS'::character varying)::"text", ('OCI'::character varying)::"text"])))
);



ALTER TABLE "finanzas"."envio_orden_compra_m5" ALTER COLUMN "id_envio_orden_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."envio_orden_compra_m5_id_envio_orden_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."esquema_remuneracional" (
    "id_esquema_remuneracional" integer NOT NULL,
    "codigo" character varying(40) NOT NULL,
    "nombre" character varying(120) NOT NULL,
    "descripcion" "text",
    "estado" character varying(20) DEFAULT 'activo'::character varying NOT NULL,
    "vigencia_desde" "date" NOT NULL,
    "vigencia_hasta" "date",
    CONSTRAINT "chk_esquema_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('activo'::character varying)::"text", ('inactivo'::character varying)::"text"]))),
    CONSTRAINT "chk_esquema_vigencia" CHECK ((("vigencia_hasta" IS NULL) OR ("vigencia_hasta" >= "vigencia_desde")))
);



ALTER TABLE "finanzas"."esquema_remuneracional" ALTER COLUMN "id_esquema_remuneracional" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."esquema_remuneracional_id_esquema_remuneracional_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."estado_tarea_produccion_ot" (
    "id_estado_tarea_produccion" bigint NOT NULL,
    "id_tarea_ejecutable_ot" bigint NOT NULL,
    "id_area_trabajo" bigint NOT NULL,
    "id_empleado_responsable" integer,
    "estado" character varying(30) DEFAULT 'PENDIENTE'::character varying NOT NULL,
    "prioridad" character varying(30),
    "tiempo_estimado_min" integer,
    "instrucciones" "text",
    "observaciones" "text",
    "fecha_planificada" "date",
    "revision" integer DEFAULT 1 NOT NULL,
    "actualizado_por" bigint NOT NULL,
    "actualizado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "ck_estado_tarea_produccion" CHECK ((("estado")::"text" = ANY (ARRAY[('PENDIENTE'::character varying)::"text", ('ASIGNADA'::character varying)::"text", ('EN_EJECUCION'::character varying)::"text", ('PENDIENTE_VALIDACION'::character varying)::"text", ('CERRADA'::character varying)::"text"]))),
    CONSTRAINT "ck_estado_tarea_tiempo" CHECK ((("tiempo_estimado_min" IS NULL) OR ("tiempo_estimado_min" > 0)))
);



CREATE SEQUENCE "finanzas"."estado_tarea_produccion_ot_id_estado_tarea_produccion_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."estado_tarea_produccion_ot_id_estado_tarea_produccion_seq" OWNED BY "finanzas"."estado_tarea_produccion_ot"."id_estado_tarea_produccion";



CREATE TABLE "finanzas"."etapa_adicional_orden_trabajo" (
    "id_etapa_adicional_ot" bigint NOT NULL,
    "id_unidad_fisica_ot" bigint NOT NULL,
    "id_area_trabajo" bigint NOT NULL,
    "nombre" character varying(150) NOT NULL,
    "descripcion" "text",
    "orden" integer NOT NULL,
    "motivo" "text" NOT NULL,
    "clave_idempotencia" character varying(120) NOT NULL,
    "creado_por" bigint NOT NULL,
    "creado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "ck_etapa_adicional_orden" CHECK (("orden" > 0))
);



CREATE SEQUENCE "finanzas"."etapa_adicional_orden_trabajo_id_etapa_adicional_ot_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."etapa_adicional_orden_trabajo_id_etapa_adicional_ot_seq" OWNED BY "finanzas"."etapa_adicional_orden_trabajo"."id_etapa_adicional_ot";



CREATE TABLE "finanzas"."evaluacion_credito" (
    "id_evaluacion_credito" integer NOT NULL,
    "id_ficha_cliente" integer NOT NULL,
    "fecha_evaluacion" "date" NOT NULL,
    "resultado_evaluacion" character varying(50) NOT NULL,
    "puntaje_riesgo" numeric(6,2),
    "comportamiento_pago_evaluado" "text",
    "fundamento_evaluacion" "text",
    "estado_evaluacion" character varying(30) DEFAULT 'vigente'::character varying NOT NULL,
    "observacion" "text",
    CONSTRAINT "chk_evaluacion_credito_estado" CHECK ((("estado_evaluacion")::"text" = ANY (ARRAY[('vigente'::character varying)::"text", ('reemplazada'::character varying)::"text", ('anulada'::character varying)::"text"]))),
    CONSTRAINT "chk_evaluacion_credito_puntaje" CHECK ((("puntaje_riesgo" IS NULL) OR ("puntaje_riesgo" >= (0)::numeric)))
);



ALTER TABLE "finanzas"."evaluacion_credito" ALTER COLUMN "id_evaluacion_credito" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."evaluacion_credito_id_evaluacion_credito_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."evento_auditoria" (
    "id_evento_auditoria" integer NOT NULL,
    "id_usuario" bigint NOT NULL,
    "fecha_evento" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tipo_evento" character varying(80) NOT NULL,
    "entidad_afectada" character varying(80) NOT NULL,
    "id_registro_afectado" integer NOT NULL,
    "accion_realizada" character varying(100) NOT NULL,
    "descripcion_evento" "text",
    "resultado_evento" character varying(30) DEFAULT 'registrado'::character varying NOT NULL,
    "observacion" "text",
    CONSTRAINT "chk_evento_auditoria_resultado" CHECK ((("resultado_evento")::"text" = ANY (ARRAY[('registrado'::character varying)::"text", ('aprobado'::character varying)::"text", ('rechazado'::character varying)::"text", ('fallido'::character varying)::"text", ('anulado'::character varying)::"text"])))
);



ALTER TABLE "finanzas"."evento_auditoria" ALTER COLUMN "id_evento_auditoria" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."evento_auditoria_id_evento_auditoria_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."evento_auditoria_m9" (
    "id_evento_m9" integer NOT NULL,
    "identidad_logica" character varying(160) NOT NULL,
    "version_contrato" character varying(20) NOT NULL,
    "fecha_ocurrencia" timestamp(6) with time zone NOT NULL,
    "zona_horaria" character varying(80) NOT NULL,
    "fecha_persistencia" timestamp(6) with time zone NOT NULL,
    "ejecutor_tipo" character varying(10) NOT NULL,
    "ejecutor_referencia" character varying(120),
    "productor" character varying(80) NOT NULL,
    "modulo_origen" character varying(40) NOT NULL,
    "operacion" character varying(100) NOT NULL,
    "resultado" character varying(10) NOT NULL,
    "entidad_tipo" character varying(80),
    "entidad_referencia" character varying(160),
    "secuencia" integer,
    "valores_anteriores" "jsonb",
    "valores_nuevos" "jsonb",
    "motivo" "text",
    "causa" "text",
    "id_evento_origen" integer,
    "id_evento_correctivo" integer,
    "contexto_terminal" boolean DEFAULT false NOT NULL,
    "evento_privacidad" boolean DEFAULT false NOT NULL,
    "metadatos_tecnicos" "jsonb",
    "hash_contenido" character(64) NOT NULL,
    "hash_integridad" character(64) NOT NULL,
    CONSTRAINT "chk_m9_ejecutor" CHECK ((("ejecutor_tipo")::"text" = ANY (ARRAY[('HUMANO'::character varying)::"text", ('SISTEMA'::character varying)::"text"]))),
    CONSTRAINT "chk_m9_resultado" CHECK ((("resultado")::"text" = ANY (ARRAY[('EXITOSO'::character varying)::"text", ('RECHAZADO'::character varying)::"text", ('FALLIDO'::character varying)::"text"]))),
    CONSTRAINT "chk_m9_secuencia" CHECK ((("secuencia" IS NULL) OR ("secuencia" >= 0)))
);



CREATE SEQUENCE "finanzas"."evento_auditoria_m9_id_evento_m9_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."evento_auditoria_m9_id_evento_m9_seq" OWNED BY "finanzas"."evento_auditoria_m9"."id_evento_m9";



CREATE TABLE "finanzas"."evento_credito_m8" (
    "id_evento" integer NOT NULL,
    "id_ficha_cliente" integer NOT NULL,
    "tipo_evento" character varying(40) NOT NULL,
    "motivo" "text",
    "valor_anterior" "text",
    "valor_nuevo" "text",
    "id_referencia" integer,
    "id_usuario" bigint NOT NULL,
    "fecha_evento" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



CREATE SEQUENCE "finanzas"."evento_credito_m8_id_evento_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."evento_credito_m8_id_evento_seq" OWNED BY "finanzas"."evento_credito_m8"."id_evento";



CREATE TABLE "finanzas"."evento_operacional_documental" (
    "id_evento_operacional" bigint NOT NULL,
    "tipo_evento" character varying(80) NOT NULL,
    "id_documento_logico" bigint,
    "id_version_documento" bigint,
    "estado" character varying(20) DEFAULT 'PENDIENTE'::character varying NOT NULL,
    "creado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "procesado_en" timestamp(6) with time zone,
    "cantidad_intentos" integer DEFAULT 0 NOT NULL,
    "proximo_intento_en" timestamp(6) with time zone,
    "codigo_error" character varying(100),
    "clave_idempotencia" character varying(180) NOT NULL,
    "payload_tecnico" "jsonb",
    "lease_token" "uuid",
    "lease_hasta" timestamp(6) with time zone,
    CONSTRAINT "chk_evento_documental_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('PENDIENTE'::character varying)::"text", ('PROCESANDO'::character varying)::"text", ('PROCESADO'::character varying)::"text", ('ERROR'::character varying)::"text", ('DESCARTADO'::character varying)::"text"]))),
    CONSTRAINT "chk_evento_documental_intentos" CHECK (("cantidad_intentos" >= 0)),
    CONSTRAINT "chk_evento_documental_lease" CHECK ((((("estado")::"text" = 'PROCESANDO'::"text") AND ("lease_token" IS NOT NULL) AND ("lease_hasta" IS NOT NULL)) OR ((("estado")::"text" <> 'PROCESANDO'::"text") AND ("lease_token" IS NULL) AND ("lease_hasta" IS NULL))))
);



CREATE SEQUENCE "finanzas"."evento_operacional_documental_id_evento_operacional_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."evento_operacional_documental_id_evento_operacional_seq" OWNED BY "finanzas"."evento_operacional_documental"."id_evento_operacional";



CREATE TABLE "finanzas"."extension_producto_comercial" (
    "id_extension_producto_comercial" integer CONSTRAINT "extension_producto_comercia_id_extension_producto_come_not_null" NOT NULL,
    "codigo_comercial" character varying(60) NOT NULL,
    "nombre_comercial" character varying(200) NOT NULL,
    "id_familia_producto_comercial" integer CONSTRAINT "extension_producto_comercia_id_familia_producto_comerc_not_null" NOT NULL,
    "subfamilia" character varying(120),
    "tipo_producto" character varying(100),
    "descripcion_general" "text",
    "descripcion_b2b" "text",
    "descripcion_b2c" "text",
    "observaciones" "text",
    "garantia_referencial" "text",
    "condiciones_particulares" "text",
    "caracteristicas_destacadas" "jsonb" DEFAULT '[]'::"jsonb" CONSTRAINT "extension_producto_comercia_caracteristicas_destacadas_not_null" NOT NULL,
    "caracteristicas_tecnicas" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "estado" character varying(20) DEFAULT 'BORRADOR'::character varying NOT NULL,
    "id_item_comercial" integer,
    "producto_terminado_id_producto" bigint,
    "numero_version_vigente" integer,
    "revision" integer DEFAULT 1 NOT NULL,
    "creado_en" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizado_en" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "creado_por" bigint NOT NULL,
    "actualizado_por" bigint NOT NULL,
    CONSTRAINT "chk_extension_producto_comercial_codigo" CHECK (((("codigo_comercial")::"text" = "upper"(("codigo_comercial")::"text")) AND (("codigo_comercial")::"text" ~ '^[A-Z0-9][A-Z0-9._-]{1,59}$'::"text"))),
    CONSTRAINT "chk_extension_producto_comercial_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('BORRADOR'::character varying)::"text", ('VINCULADO'::character varying)::"text", ('INACTIVO'::character varying)::"text"])))
);



CREATE SEQUENCE "finanzas"."extension_producto_comercial_id_extension_producto_comercia_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."extension_producto_comercial_id_extension_producto_comercia_seq" OWNED BY "finanzas"."extension_producto_comercial"."id_extension_producto_comercial";



CREATE TABLE "finanzas"."familia_producto_comercial" (
    "id_familia_producto_comercial" integer CONSTRAINT "familia_producto_comercial_id_familia_producto_comerci_not_null" NOT NULL,
    "codigo" character varying(40) NOT NULL,
    "nombre" character varying(150) NOT NULL,
    "descripcion" "text",
    "estado" character varying(20) DEFAULT 'ACTIVA'::character varying NOT NULL,
    "revision" integer DEFAULT 1 NOT NULL,
    "creado_en" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizado_en" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "creado_por" bigint NOT NULL,
    "actualizado_por" bigint NOT NULL,
    CONSTRAINT "chk_familia_producto_comercial_codigo" CHECK (((("codigo")::"text" = "upper"(("codigo")::"text")) AND (("codigo")::"text" ~ '^[A-Z0-9][A-Z0-9._-]{1,39}$'::"text"))),
    CONSTRAINT "chk_familia_producto_comercial_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('ACTIVA'::character varying)::"text", ('INACTIVA'::character varying)::"text"])))
);



CREATE SEQUENCE "finanzas"."familia_producto_comercial_id_familia_producto_comercial_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."familia_producto_comercial_id_familia_producto_comercial_seq" OWNED BY "finanzas"."familia_producto_comercial"."id_familia_producto_comercial";



CREATE TABLE "finanzas"."feriado_chile_m5" (
    "fecha" "date" NOT NULL,
    "descripcion" character varying(150) NOT NULL
);



ALTER TABLE "finanzas"."ficha_cliente" ALTER COLUMN "id_ficha_cliente" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."ficha_cliente_id_ficha_cliente_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."fondo_caja_chica_m5" (
    "id_fondo_caja_chica_m5" integer NOT NULL,
    "anio" integer NOT NULL,
    "mes" integer NOT NULL,
    "monto" numeric(14,2) NOT NULL,
    "actualizado_por" bigint NOT NULL,
    "fecha_actualizacion" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "chk_fondo_caja_chica_m5_monto" CHECK (("monto" >= (0)::numeric)),
    CONSTRAINT "chk_fondo_caja_chica_m5_periodo" CHECK ((("anio" >= 2000) AND ("anio" <= 9999) AND (("mes" >= 1) AND ("mes" <= 12))))
);



ALTER TABLE "finanzas"."fondo_caja_chica_m5" ALTER COLUMN "id_fondo_caja_chica_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."fondo_caja_chica_m5_id_fondo_caja_chica_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."fondo_global_credito" (
    "id_fondo_global_credito" integer NOT NULL,
    "fecha_calculo" "date" NOT NULL,
    "monto_disponible" numeric(14,2) NOT NULL,
    "monto_comprometido" numeric(14,2) DEFAULT 0 NOT NULL,
    "monto_restante" numeric(14,2) NOT NULL,
    "estado_fondo" character varying(30) DEFAULT 'vigente'::character varying NOT NULL,
    "observacion" "text",
    CONSTRAINT "chk_fondo_global_credito_estado" CHECK ((("estado_fondo")::"text" = ANY (ARRAY[('vigente'::character varying)::"text", ('cerrado'::character varying)::"text", ('anulado'::character varying)::"text"]))),
    CONSTRAINT "chk_fondo_global_credito_montos" CHECK ((("monto_disponible" >= (0)::numeric) AND ("monto_comprometido" >= (0)::numeric) AND ("monto_restante" >= (0)::numeric)))
);



ALTER TABLE "finanzas"."fondo_global_credito" ALTER COLUMN "id_fondo_global_credito" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."fondo_global_credito_id_fondo_global_credito_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."gasto_caja_chica" (
    "id_gasto_caja_chica" integer NOT NULL,
    "fecha_gasto" "date" NOT NULL,
    "monto_gasto" numeric(14,2) NOT NULL,
    "descripcion_gasto" "text" NOT NULL,
    "motivo_gasto" "text",
    "categoria_gasto" character varying(80),
    "responsable_gasto" character varying(150),
    "respaldo_gasto" "text",
    "estado_validacion" character varying(30) DEFAULT 'pendiente'::character varying NOT NULL,
    "observacion" "text",
    CONSTRAINT "chk_gasto_caja_chica_estado" CHECK ((("estado_validacion")::"text" = ANY (ARRAY[('pendiente'::character varying)::"text", ('aprobado'::character varying)::"text", ('rechazado'::character varying)::"text", ('anulado'::character varying)::"text"]))),
    CONSTRAINT "chk_gasto_caja_chica_monto" CHECK (("monto_gasto" > (0)::numeric))
);



ALTER TABLE "finanzas"."gasto_caja_chica" ALTER COLUMN "id_gasto_caja_chica" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."gasto_caja_chica_id_gasto_caja_chica_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."gasto_caja_chica_m5" (
    "id_gasto_caja_chica_m5" integer NOT NULL,
    "anio" integer NOT NULL,
    "mes" integer NOT NULL,
    "monto" numeric(14,2) NOT NULL,
    "descripcion" "text" NOT NULL,
    "fecha_gasto" "date" NOT NULL,
    "comercio_emisor" character varying(200),
    "estado" character varying(20) DEFAULT 'pendiente'::character varying NOT NULL,
    "registrado_por" bigint NOT NULL,
    "fecha_registro" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "resuelto_por" bigint,
    "fecha_resolucion" timestamp(6) with time zone,
    "condicion_aprobacion" character varying(20),
    "motivo_rechazo" "text",
    CONSTRAINT "chk_gasto_caja_chica_m5_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('pendiente'::character varying)::"text", ('aprobado'::character varying)::"text", ('rechazado'::character varying)::"text"]))),
    CONSTRAINT "chk_gasto_caja_chica_m5_monto" CHECK (("monto" > (0)::numeric)),
    CONSTRAINT "chk_gasto_caja_chica_m5_periodo" CHECK ((("anio" >= 2000) AND ("anio" <= 9999) AND (("mes" >= 1) AND ("mes" <= 12))))
);



ALTER TABLE "finanzas"."gasto_caja_chica_m5" ALTER COLUMN "id_gasto_caja_chica_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."gasto_caja_chica_m5_id_gasto_caja_chica_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."grupo_alternativas_b2c" (
    "id_grupo_alternativas_b2c" bigint NOT NULL,
    "id_cotizacion" integer NOT NULL,
    "numero_grupo" integer NOT NULL,
    "titulo" character varying(200),
    "estado" character varying(20) DEFAULT 'ABIERTO'::character varying NOT NULL,
    "revision" integer DEFAULT 1 NOT NULL,
    "creado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "id_alternativa_seleccionada" bigint,
    "seleccionada_en" timestamp(6) with time zone,
    "seleccionada_por" bigint,
    CONSTRAINT "ck_grupo_alternativa_seleccion" CHECK (((("id_alternativa_seleccionada" IS NULL) AND ("seleccionada_en" IS NULL) AND ("seleccionada_por" IS NULL)) OR (("id_alternativa_seleccionada" IS NOT NULL) AND ("seleccionada_en" IS NOT NULL) AND ("seleccionada_por" IS NOT NULL)))),
    CONSTRAINT "ck_grupo_alternativas_b2c_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('ABIERTO'::character varying)::"text", ('DECIDIDO'::character varying)::"text", ('CANCELADO'::character varying)::"text"]))),
    CONSTRAINT "ck_grupo_alternativas_b2c_numero" CHECK (("numero_grupo" > 0)),
    CONSTRAINT "ck_grupo_alternativas_b2c_revision" CHECK (("revision" > 0))
);



CREATE SEQUENCE "finanzas"."grupo_alternativas_b2c_id_grupo_alternativas_b2c_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."grupo_alternativas_b2c_id_grupo_alternativas_b2c_seq" OWNED BY "finanzas"."grupo_alternativas_b2c"."id_grupo_alternativas_b2c";



CREATE TABLE "finanzas"."guia_despacho" (
    "id_guia_despacho" integer NOT NULL,
    "id_nota_venta" integer NOT NULL,
    "folio" "text" NOT NULL,
    "fecha_emision" "date" NOT NULL,
    "estado" "text" DEFAULT 'emitida'::"text" NOT NULL,
    "antecedentes" "jsonb"
);



CREATE SEQUENCE "finanzas"."guia_despacho_id_guia_despacho_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."guia_despacho_id_guia_despacho_seq" OWNED BY "finanzas"."guia_despacho"."id_guia_despacho";



CREATE TABLE "finanzas"."hallazgo_discrepancia_m11" (
    "id_hallazgo_discrepancia_m11" bigint NOT NULL,
    "id_orden_compra_b2b" integer NOT NULL,
    "id_linea_orden_compra_b2b" bigint,
    "etapa" character varying(20) NOT NULL,
    "tipo_discrepancia" character varying(80) NOT NULL,
    "referencias_origen" "jsonb" NOT NULL,
    "evidencia" "jsonb" NOT NULL,
    "contexto" "jsonb" NOT NULL,
    "estado" character varying(20) DEFAULT 'PENDIENTE'::character varying NOT NULL,
    "clave_idempotencia" character varying(160) NOT NULL,
    "detectado_por" bigint,
    "revision" integer DEFAULT 1 NOT NULL,
    "creado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "ck_hallazgo_m11_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('PENDIENTE'::character varying)::"text", ('RESUELTO'::character varying)::"text"]))),
    CONSTRAINT "ck_hallazgo_m11_etapa" CHECK ((("etapa")::"text" = ANY (ARRAY[('ORDEN_VS_SALIDA'::character varying)::"text", ('SALIDA_VS_FACTURACION'::character varying)::"text"]))),
    CONSTRAINT "ck_hallazgo_m11_revision" CHECK (("revision" > 0))
);



CREATE SEQUENCE "finanzas"."hallazgo_discrepancia_m11_id_hallazgo_discrepancia_m11_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."hallazgo_discrepancia_m11_id_hallazgo_discrepancia_m11_seq" OWNED BY "finanzas"."hallazgo_discrepancia_m11"."id_hallazgo_discrepancia_m11";



CREATE TABLE "finanzas"."historial_cambio_produccion_ot" (
    "id_historial_cambio" bigint NOT NULL,
    "id_unidad_fisica_ot" bigint NOT NULL,
    "id_tarea_ejecutable_ot" bigint,
    "id_version_rectificacion" bigint,
    "entidad" character varying(40) NOT NULL,
    "evento" character varying(60) NOT NULL,
    "valor_anterior" "jsonb",
    "valor_nuevo" "jsonb",
    "motivo" "text" NOT NULL,
    "id_empleado_involucrado" integer,
    "usuario_id_usuario" bigint NOT NULL,
    "fecha_evento" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



CREATE SEQUENCE "finanzas"."historial_cambio_produccion_ot_id_historial_cambio_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."historial_cambio_produccion_ot_id_historial_cambio_seq" OWNED BY "finanzas"."historial_cambio_produccion_ot"."id_historial_cambio";



CREATE TABLE "finanzas"."historial_categoria_egreso_m5" (
    "id_historial_categoria_m5" integer CONSTRAINT "historial_categoria_egreso_m_id_historial_categoria_m5_not_null" NOT NULL,
    "id_categoria_egreso_m5" integer NOT NULL,
    "nombre_anterior" character varying(100),
    "nombre_nuevo" character varying(100),
    "activo_anterior" boolean,
    "activo_nuevo" boolean,
    "motivo" "text",
    "usuario_id_usuario" bigint NOT NULL,
    "fecha_hora" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



ALTER TABLE "finanzas"."historial_categoria_egreso_m5" ALTER COLUMN "id_historial_categoria_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."historial_categoria_egreso_m5_id_historial_categoria_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."historial_decision_alternativa_b2c" (
    "id_historial_decision" bigint CONSTRAINT "historial_decision_alternativa_b_id_historial_decision_not_null" NOT NULL,
    "id_alternativa_b2c" bigint NOT NULL,
    "estado_anterior" character varying(20),
    "estado_nuevo" character varying(20) NOT NULL,
    "motivo" "text" NOT NULL,
    "actor_id" bigint NOT NULL,
    "fecha" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "ck_historial_alternativa_b2c_anterior" CHECK ((("estado_anterior" IS NULL) OR (("estado_anterior")::"text" = ANY (ARRAY[('PROPUESTA'::character varying)::"text", ('ACEPTADA'::character varying)::"text", ('RECHAZADA'::character varying)::"text", ('RETIRADA'::character varying)::"text"])))),
    CONSTRAINT "ck_historial_alternativa_b2c_nuevo" CHECK ((("estado_nuevo")::"text" = ANY (ARRAY[('PROPUESTA'::character varying)::"text", ('ACEPTADA'::character varying)::"text", ('RECHAZADA'::character varying)::"text", ('RETIRADA'::character varying)::"text"])))
);



CREATE SEQUENCE "finanzas"."historial_decision_alternativa_b2c_id_historial_decision_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."historial_decision_alternativa_b2c_id_historial_decision_seq" OWNED BY "finanzas"."historial_decision_alternativa_b2c"."id_historial_decision";



CREATE TABLE "finanzas"."historial_envio_importacion_m5" (
    "id_historial_envio_m5" integer NOT NULL,
    "id_envio_importacion_m5" integer NOT NULL,
    "evento" character varying(40) NOT NULL,
    "detalle" "text" NOT NULL,
    "usuario_id_usuario" bigint NOT NULL,
    "fecha_hora" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



ALTER TABLE "finanzas"."historial_envio_importacion_m5" ALTER COLUMN "id_historial_envio_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."historial_envio_importacion_m5_id_historial_envio_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."historial_familia_producto_comercial" (
    "id_historial_familia_producto_comercial" integer CONSTRAINT "historial_familia_producto__id_historial_familia_produ_not_null" NOT NULL,
    "id_familia_producto_comercial" integer CONSTRAINT "historial_familia_producto__id_familia_producto_comerc_not_null" NOT NULL,
    "evento" character varying(40) NOT NULL,
    "valor_anterior" "jsonb",
    "valor_nuevo" "jsonb",
    "motivo" "text",
    "usuario_id_usuario" bigint CONSTRAINT "historial_familia_producto_comercia_usuario_id_usuario_not_null" NOT NULL,
    "fecha_evento" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



CREATE SEQUENCE "finanzas"."historial_familia_producto_co_id_historial_familia_producto_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."historial_familia_producto_co_id_historial_familia_producto_seq" OWNED BY "finanzas"."historial_familia_producto_comercial"."id_historial_familia_producto_comercial";



CREATE TABLE "finanzas"."historial_fondo_caja_chica_m5" (
    "id_historial_fondo_m5" integer NOT NULL,
    "id_fondo_caja_chica_m5" integer NOT NULL,
    "monto_anterior" numeric(14,2) NOT NULL,
    "monto_nuevo" numeric(14,2) NOT NULL,
    "usuario_id_usuario" bigint NOT NULL,
    "fecha_hora" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



ALTER TABLE "finanzas"."historial_fondo_caja_chica_m5" ALTER COLUMN "id_historial_fondo_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."historial_fondo_caja_chica_m5_id_historial_fondo_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."historial_gasto_caja_chica_m5" (
    "id_historial_gasto_m5" integer NOT NULL,
    "id_gasto_caja_chica_m5" integer NOT NULL,
    "evento" character varying(30) NOT NULL,
    "detalle" "text" NOT NULL,
    "usuario_id_usuario" bigint NOT NULL,
    "fecha_hora" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



ALTER TABLE "finanzas"."historial_gasto_caja_chica_m5" ALTER COLUMN "id_historial_gasto_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."historial_gasto_caja_chica_m5_id_historial_gasto_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."historial_orden_compra_servicio_m5" (
    "id_historial_ocs_m5" integer NOT NULL,
    "id_ocs_m5" integer NOT NULL,
    "campo" character varying(80) NOT NULL,
    "valor_anterior" "text",
    "valor_nuevo" "text",
    "usuario_id_usuario" bigint NOT NULL,
    "fecha_hora" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "motivo" "text"
);



ALTER TABLE "finanzas"."historial_orden_compra_servicio_m5" ALTER COLUMN "id_historial_ocs_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."historial_orden_compra_servicio_m5_id_historial_ocs_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."historial_ot_imputacion_m5" (
    "id_historial_ot_m5" integer NOT NULL,
    "id_detalle_imputacion_m5" integer NOT NULL,
    "id_proyecto" bigint NOT NULL,
    "id_ot_anterior" bigint,
    "id_ot_nueva" bigint NOT NULL,
    "monto_contexto" numeric(14,2) NOT NULL,
    "motivo" "text" NOT NULL,
    "usuario_id_usuario" bigint NOT NULL,
    "fecha_hora" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "historial_ot_imputacion_m5_monto_contexto_check" CHECK (("monto_contexto" > (0)::numeric))
);



ALTER TABLE "finanzas"."historial_ot_imputacion_m5" ALTER COLUMN "id_historial_ot_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."historial_ot_imputacion_m5_id_historial_ot_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."historial_precio_material" (
    "id_historial_precio_material" integer NOT NULL,
    "material_sku" character varying(50) NOT NULL,
    "id_proveedor" integer,
    "id_moneda" integer NOT NULL,
    "precio_unitario" numeric(14,2) NOT NULL,
    "tipo_cambio_usado" numeric(14,4),
    "precio_unitario_convertido" numeric(14,2),
    "fecha_registro" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "fecha_vigencia_inicio" "date" NOT NULL,
    "fecha_vigencia_fin" "date",
    "estado_precio" character varying(20) DEFAULT 'vigente'::character varying NOT NULL,
    "observacion" "text",
    CONSTRAINT "chk_historial_precio_material_estado" CHECK ((("estado_precio")::"text" = ANY (ARRAY[('vigente'::character varying)::"text", ('reemplazado'::character varying)::"text", ('anulado'::character varying)::"text"]))),
    CONSTRAINT "chk_historial_precio_material_precio" CHECK (("precio_unitario" >= (0)::numeric)),
    CONSTRAINT "chk_historial_precio_material_precio_convertido" CHECK ((("precio_unitario_convertido" IS NULL) OR ("precio_unitario_convertido" >= (0)::numeric))),
    CONSTRAINT "chk_historial_precio_material_vigencia" CHECK ((("fecha_vigencia_fin" IS NULL) OR ("fecha_vigencia_fin" >= "fecha_vigencia_inicio")))
);



ALTER TABLE "finanzas"."historial_precio_material" ALTER COLUMN "id_historial_precio_material" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."historial_precio_material_id_historial_precio_material_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."historial_producto_comercial" (
    "id_historial_producto_comercial" integer CONSTRAINT "historial_producto_comercia_id_historial_producto_come_not_null" NOT NULL,
    "id_extension_producto_comercial" integer CONSTRAINT "historial_producto_comercia_id_extension_producto_come_not_null" NOT NULL,
    "evento" character varying(50) NOT NULL,
    "valor_anterior" "jsonb",
    "valor_nuevo" "jsonb",
    "motivo" "text",
    "usuario_id_usuario" bigint NOT NULL,
    "fecha_evento" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



CREATE SEQUENCE "finanzas"."historial_producto_comercial_id_historial_producto_comercia_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."historial_producto_comercial_id_historial_producto_comercia_seq" OWNED BY "finanzas"."historial_producto_comercial"."id_historial_producto_comercial";



CREATE TABLE "finanzas"."historial_proveedor_m5" (
    "id_historial_proveedor_m5" integer NOT NULL,
    "id_proveedor" integer NOT NULL,
    "campo" character varying(80) NOT NULL,
    "valor_anterior" "text",
    "valor_nuevo" "text",
    "motivo" "text",
    "usuario_id_usuario" bigint NOT NULL,
    "fecha_hora" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



ALTER TABLE "finanzas"."historial_proveedor_m5" ALTER COLUMN "id_historial_proveedor_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."historial_proveedor_m5_id_historial_proveedor_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."historial_rectificacion_orden_trabajo" (
    "id_historial_rectificacion" bigint CONSTRAINT "historial_rectificacion_ord_id_historial_rectificacion_not_null" NOT NULL,
    "id_rectificacion_ot" bigint CONSTRAINT "historial_rectificacion_orden_trab_id_rectificacion_ot_not_null" NOT NULL,
    "entidad" character varying(50) NOT NULL,
    "tipo_modificacion" character varying(60) CONSTRAINT "historial_rectificacion_orden_trabaj_tipo_modificacion_not_null" NOT NULL,
    "valor_anterior" "jsonb",
    "valor_nuevo" "jsonb",
    "motivo" "text",
    "usuario_id_usuario" bigint CONSTRAINT "historial_rectificacion_orden_traba_usuario_id_usuario_not_null" NOT NULL,
    "fecha_evento" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



CREATE SEQUENCE "finanzas"."historial_rectificacion_orden_tr_id_historial_rectificacion_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."historial_rectificacion_orden_tr_id_historial_rectificacion_seq" OWNED BY "finanzas"."historial_rectificacion_orden_trabajo"."id_historial_rectificacion";



CREATE TABLE "finanzas"."historial_respaldo_pago_m5" (
    "id_historial_respaldo_m5" integer NOT NULL,
    "id_operacion_pago_m5" integer NOT NULL,
    "id_movimiento_pago_m5" integer,
    "id_respaldo_anterior" integer NOT NULL,
    "id_respaldo_nuevo" integer NOT NULL,
    "motivo" "text" NOT NULL,
    "usuario_id_usuario" bigint NOT NULL,
    "fecha_hora" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



ALTER TABLE "finanzas"."historial_respaldo_pago_m5" ALTER COLUMN "id_historial_respaldo_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."historial_respaldo_pago_m5_id_historial_respaldo_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."historial_seleccion_alternativa_b2c" (
    "id_historial_seleccion" bigint CONSTRAINT "historial_seleccion_alternativa_id_historial_seleccion_not_null" NOT NULL,
    "id_grupo_alternativas_b2c" bigint CONSTRAINT "historial_seleccion_alternat_id_grupo_alternativas_b2c_not_null" NOT NULL,
    "id_alternativa_anterior" bigint,
    "id_alternativa_nueva" bigint,
    "motivo" "text" NOT NULL,
    "actor_id" bigint NOT NULL,
    "revision_grupo" integer NOT NULL,
    "fecha" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "ck_historial_seleccion_cambio" CHECK (("id_alternativa_anterior" IS DISTINCT FROM "id_alternativa_nueva")),
    CONSTRAINT "ck_historial_seleccion_revision" CHECK (("revision_grupo" > 0))
);



CREATE SEQUENCE "finanzas"."historial_seleccion_alternativa_b2c_id_historial_seleccion_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."historial_seleccion_alternativa_b2c_id_historial_seleccion_seq" OWNED BY "finanzas"."historial_seleccion_alternativa_b2c"."id_historial_seleccion";



CREATE TABLE "finanzas"."historial_tarifa_tarea" (
    "id_historial_tarifa_tarea" integer NOT NULL,
    "id_tarea_catalogada" integer NOT NULL,
    "valor_unitario_tarea" numeric(14,2) NOT NULL,
    "fecha_vigencia_inicio" "date" NOT NULL,
    "fecha_vigencia_fin" "date",
    "estado_tarifa" character varying(30) DEFAULT 'vigente'::character varying NOT NULL,
    "observacion" "text",
    CONSTRAINT "chk_historial_tarifa_tarea_estado" CHECK ((("estado_tarifa")::"text" = ANY (ARRAY[('vigente'::character varying)::"text", ('reemplazada'::character varying)::"text", ('anulada'::character varying)::"text"]))),
    CONSTRAINT "chk_historial_tarifa_tarea_valor" CHECK (("valor_unitario_tarea" >= (0)::numeric)),
    CONSTRAINT "chk_historial_tarifa_tarea_vigencia" CHECK ((("fecha_vigencia_fin" IS NULL) OR ("fecha_vigencia_fin" >= "fecha_vigencia_inicio")))
);



ALTER TABLE "finanzas"."historial_tarifa_tarea" ALTER COLUMN "id_historial_tarifa_tarea" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."historial_tarifa_tarea_id_historial_tarifa_tarea_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."historial_umbral_reclasificacion_m5" (
    "id_historial_umbral_m5" integer CONSTRAINT "historial_umbral_reclasificacio_id_historial_umbral_m5_not_null" NOT NULL,
    "monto_anterior_clp" numeric(14,2) NOT NULL,
    "monto_nuevo_clp" numeric(14,2) NOT NULL,
    "usuario_id_usuario" bigint NOT NULL,
    "fecha_hora" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



ALTER TABLE "finanzas"."historial_umbral_reclasificacion_m5" ALTER COLUMN "id_historial_umbral_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."historial_umbral_reclasificacion_m5_id_historial_umbral_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."historial_unidad_fisica_ot" (
    "id_historial_unidad_fisica_ot" bigint CONSTRAINT "historial_unidad_fisica_ot_id_historial_unidad_fisica__not_null" NOT NULL,
    "id_unidad_fisica_ot" bigint NOT NULL,
    "evento" character varying(50) NOT NULL,
    "valor_anterior" "jsonb",
    "valor_nuevo" "jsonb",
    "motivo" "text",
    "usuario_id_usuario" bigint NOT NULL,
    "fecha_evento" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



CREATE SEQUENCE "finanzas"."historial_unidad_fisica_ot_id_historial_unidad_fisica_ot_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."historial_unidad_fisica_ot_id_historial_unidad_fisica_ot_seq" OWNED BY "finanzas"."historial_unidad_fisica_ot"."id_historial_unidad_fisica_ot";



CREATE TABLE "finanzas"."hito_cobro" (
    "id_hito_cobro" integer NOT NULL,
    "id_nota_venta" integer NOT NULL,
    "id_proyecto_financiero" integer,
    "descripcion_hito" character varying(150) NOT NULL,
    "fecha_programada_cobro" "date" NOT NULL,
    "monto_programado" numeric(14,2) NOT NULL,
    "estado_hito" character varying(30) DEFAULT 'pendiente'::character varying NOT NULL,
    "fecha_pago_real" "date",
    "observacion" "text",
    CONSTRAINT "chk_hito_cobro_estado" CHECK ((("estado_hito")::"text" = ANY (ARRAY[('pendiente'::character varying)::"text", ('pagado'::character varying)::"text", ('parcial'::character varying)::"text", ('vencido'::character varying)::"text", ('anulado'::character varying)::"text"]))),
    CONSTRAINT "chk_hito_cobro_monto" CHECK (("monto_programado" >= (0)::numeric))
);



ALTER TABLE "finanzas"."hito_cobro" ALTER COLUMN "id_hito_cobro" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."hito_cobro_id_hito_cobro_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."idempotencia_operacion_comercial" (
    "clave" character varying(160) NOT NULL,
    "operacion" character varying(80) NOT NULL,
    "actor_id" bigint NOT NULL,
    "respuesta" "jsonb",
    "creado_en" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "completado_en" timestamp with time zone
);



CREATE TABLE "finanzas"."intencion_carga_documental" (
    "id_intencion_carga" bigint NOT NULL,
    "id_publico" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "usuario_solicitante" bigint NOT NULL,
    "clasificacion" character varying(60) NOT NULL,
    "nombre_declarado" character varying(255) NOT NULL,
    "mime_declarado" character varying(150) NOT NULL,
    "tamano_esperado" bigint NOT NULL,
    "clave_temporal" character varying(700) NOT NULL,
    "clave_idempotencia" character varying(160) NOT NULL,
    "estado" character varying(20) DEFAULT 'PENDIENTE'::character varying NOT NULL,
    "creado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "expira_en" timestamp(6) with time zone NOT NULL,
    "confirmado_en" timestamp(6) with time zone,
    "identificador_multipart" character varying(500),
    "cantidad_reintentos" integer DEFAULT 0 NOT NULL,
    "codigo_error" character varying(100),
    "revision" integer DEFAULT 1 NOT NULL,
    "id_documento_logico" bigint,
    CONSTRAINT "chk_intencion_documental_clave_opaca" CHECK ((("clave_temporal")::"text" ~ '^tmp/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'::"text")),
    CONSTRAINT "chk_intencion_documental_documento_obligatorio" CHECK (("id_documento_logico" IS NOT NULL)),
    CONSTRAINT "chk_intencion_documental_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('PENDIENTE'::character varying)::"text", ('SUBIENDO'::character varying)::"text", ('VALIDANDO'::character varying)::"text", ('DISPONIBLE'::character varying)::"text", ('ERROR'::character varying)::"text", ('CUARENTENA'::character varying)::"text", ('EXPIRADA'::character varying)::"text", ('CANCELADA'::character varying)::"text"]))),
    CONSTRAINT "chk_intencion_documental_fechas" CHECK ((("expira_en" > "creado_en") AND (("confirmado_en" IS NULL) OR ("confirmado_en" >= "creado_en")))),
    CONSTRAINT "chk_intencion_documental_reintentos" CHECK (("cantidad_reintentos" >= 0)),
    CONSTRAINT "chk_intencion_documental_revision" CHECK (("revision" > 0)),
    CONSTRAINT "chk_intencion_documental_tamano" CHECK (("tamano_esperado" > 0))
);



CREATE SEQUENCE "finanzas"."intencion_carga_documental_id_intencion_carga_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."intencion_carga_documental_id_intencion_carga_seq" OWNED BY "finanzas"."intencion_carga_documental"."id_intencion_carga";



CREATE TABLE "finanzas"."intento_retry_m9" (
    "id_intento_m9" integer NOT NULL,
    "id_pendiente_m9" integer NOT NULL,
    "numero_intento" integer NOT NULL,
    "estado" character varying(20) NOT NULL,
    "error_codigo" character varying(100),
    "iniciado_en" timestamp(6) with time zone NOT NULL,
    "finalizado_en" timestamp(6) with time zone NOT NULL,
    CONSTRAINT "chk_m9_intento_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('EXITOSO'::character varying)::"text", ('FALLIDO'::character varying)::"text"])))
);



CREATE SEQUENCE "finanzas"."intento_retry_m9_id_intento_m9_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."intento_retry_m9_id_intento_m9_seq" OWNED BY "finanzas"."intento_retry_m9"."id_intento_m9";



CREATE TABLE "finanzas"."liberacion_orden_trabajo" (
    "id_liberacion_ot" bigint NOT NULL,
    "id_unidad_fisica_ot" bigint NOT NULL,
    "id_version_rectificacion" bigint NOT NULL,
    "liberado_por" bigint NOT NULL,
    "liberado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



CREATE SEQUENCE "finanzas"."liberacion_orden_trabajo_id_liberacion_ot_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."liberacion_orden_trabajo_id_liberacion_ot_seq" OWNED BY "finanzas"."liberacion_orden_trabajo"."id_liberacion_ot";



CREATE TABLE "finanzas"."limite_credito_cliente" (
    "id_limite_credito_cliente" integer NOT NULL,
    "id_ficha_cliente" integer NOT NULL,
    "id_evaluacion_credito" integer NOT NULL,
    "monto_limite" numeric(14,2) NOT NULL,
    "fecha_inicio_vigencia" "date" NOT NULL,
    "fecha_fin_vigencia" "date",
    "estado_limite" character varying(30) DEFAULT 'vigente'::character varying NOT NULL,
    "motivo_modificacion" "text",
    "observacion" "text",
    CONSTRAINT "chk_limite_credito_cliente_estado" CHECK ((("estado_limite")::"text" = ANY (ARRAY[('vigente'::character varying)::"text", ('reemplazado'::character varying)::"text", ('suspendido'::character varying)::"text", ('anulado'::character varying)::"text"]))),
    CONSTRAINT "chk_limite_credito_cliente_monto" CHECK (("monto_limite" >= (0)::numeric)),
    CONSTRAINT "chk_limite_credito_cliente_vigencia" CHECK ((("fecha_fin_vigencia" IS NULL) OR ("fecha_fin_vigencia" >= "fecha_inicio_vigencia")))
);



ALTER TABLE "finanzas"."limite_credito_cliente" ALTER COLUMN "id_limite_credito_cliente" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."limite_credito_cliente_id_limite_credito_cliente_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."limite_global_credito_m8" (
    "id_limite_global" integer NOT NULL,
    "monto_limite" numeric(14,2) NOT NULL,
    "vigencia_desde" "date" NOT NULL,
    "vigencia_hasta" "date",
    "motivo" "text" NOT NULL,
    "id_responsable" bigint NOT NULL,
    "creado_en" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "sustituido_en" timestamp(6) without time zone,
    CONSTRAINT "chk_limite_global_credito_m8_monto" CHECK (("monto_limite" >= (0)::numeric)),
    CONSTRAINT "chk_limite_global_credito_m8_vigencia" CHECK ((("vigencia_hasta" IS NULL) OR ("vigencia_hasta" >= "vigencia_desde")))
);



CREATE SEQUENCE "finanzas"."limite_global_credito_m8_id_limite_global_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."limite_global_credito_m8_id_limite_global_seq" OWNED BY "finanzas"."limite_global_credito_m8"."id_limite_global";



CREATE TABLE "finanzas"."linea_orden_compra_b2b" (
    "id_linea_orden_compra_b2b" bigint NOT NULL,
    "id_orden_compra_b2b" integer NOT NULL,
    "numero_linea" integer NOT NULL,
    "id_detalle_cotizacion" integer,
    "referencia_comercial" character varying(120),
    "concepto" "text",
    "especificaciones" "jsonb",
    "cantidad" numeric(12,2),
    "id_moneda" integer,
    "precio_unitario" numeric(14,2),
    "subtotal" numeric(14,2),
    "estado_cotejo" character varying(30) DEFAULT 'INFORMACION_INSUFICIENTE'::character varying NOT NULL,
    "resultado_cotejo" "jsonb",
    "creado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "ck_linea_oc_cantidad" CHECK ((("cantidad" IS NULL) OR ("cantidad" > (0)::numeric))),
    CONSTRAINT "ck_linea_oc_estado_cotejo" CHECK ((("estado_cotejo")::"text" = ANY (ARRAY[('COINCIDE'::character varying)::"text", ('DISCREPANCIA'::character varying)::"text", ('INFORMACION_INSUFICIENTE'::character varying)::"text"]))),
    CONSTRAINT "ck_linea_oc_numero" CHECK (("numero_linea" > 0)),
    CONSTRAINT "ck_linea_oc_precio" CHECK ((("precio_unitario" IS NULL) OR ("precio_unitario" >= (0)::numeric))),
    CONSTRAINT "ck_linea_oc_subtotal" CHECK ((("subtotal" IS NULL) OR ("subtotal" >= (0)::numeric)))
);



CREATE SEQUENCE "finanzas"."linea_orden_compra_b2b_id_linea_orden_compra_b2b_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."linea_orden_compra_b2b_id_linea_orden_compra_b2b_seq" OWNED BY "finanzas"."linea_orden_compra_b2b"."id_linea_orden_compra_b2b";



CREATE TABLE "finanzas"."liquidacion_remuneracion" (
    "id_liquidacion_remuneracion" integer NOT NULL,
    "rut_empleado" character varying(15) NOT NULL,
    "periodo_liquidacion" character varying(7) NOT NULL,
    "fecha_generacion" "date" NOT NULL,
    "fecha_aprobacion" "date",
    "sueldo_base_periodo" numeric(14,2) NOT NULL,
    "total_bonos" numeric(14,2) DEFAULT 0 NOT NULL,
    "total_descuentos" numeric(14,2) DEFAULT 0 NOT NULL,
    "total_haberes" numeric(14,2) DEFAULT 0 NOT NULL,
    "total_liquido" numeric(14,2) DEFAULT 0 NOT NULL,
    "estado_liquidacion" character varying(30) DEFAULT 'generada'::character varying NOT NULL,
    "respaldo_liquidacion" "text",
    "observacion" "text",
    CONSTRAINT "chk_liquidacion_remuneracion_estado" CHECK ((("estado_liquidacion")::"text" = ANY (ARRAY[('generada'::character varying)::"text", ('aprobada'::character varying)::"text", ('pagada'::character varying)::"text", ('anulada'::character varying)::"text"]))),
    CONSTRAINT "chk_liquidacion_remuneracion_montos" CHECK ((("sueldo_base_periodo" >= (0)::numeric) AND ("total_bonos" >= (0)::numeric) AND ("total_descuentos" >= (0)::numeric) AND ("total_haberes" >= (0)::numeric) AND ("total_liquido" >= (0)::numeric))),
    CONSTRAINT "chk_liquidacion_remuneracion_periodo" CHECK ((("periodo_liquidacion")::"text" ~ '^[0-9]{4}-[0-9]{2}$'::"text"))
);



ALTER TABLE "finanzas"."liquidacion_remuneracion" ALTER COLUMN "id_liquidacion_remuneracion" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."liquidacion_remuneracion_id_liquidacion_remuneracion_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."medio_pago" (
    "id_medio_pago" integer NOT NULL,
    "nombre_medio_pago" character varying(80) NOT NULL,
    "descripcion_medio_pago" "text",
    "estado_medio_pago" character varying(20) DEFAULT 'activo'::character varying NOT NULL,
    "codigo_medio_pago" character varying(40),
    "requiere_respaldo" boolean,
    CONSTRAINT "chk_medio_pago_estado" CHECK ((("estado_medio_pago")::"text" = ANY (ARRAY[('activo'::character varying)::"text", ('inactivo'::character varying)::"text"])))
);



ALTER TABLE "finanzas"."medio_pago" ALTER COLUMN "id_medio_pago" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."medio_pago_id_medio_pago_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."moneda" (
    "id_moneda" integer NOT NULL,
    "codigo_moneda" character varying(10) NOT NULL,
    "nombre_moneda" character varying(80) NOT NULL,
    "simbolo_moneda" character varying(10),
    "estado_moneda" character varying(20) DEFAULT 'activo'::character varying NOT NULL,
    CONSTRAINT "chk_moneda_estado" CHECK ((("estado_moneda")::"text" = ANY (ARRAY[('activo'::character varying)::"text", ('inactivo'::character varying)::"text"])))
);



ALTER TABLE "finanzas"."moneda" ALTER COLUMN "id_moneda" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."moneda_id_moneda_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."movimiento_bancario" (
    "id_movimiento_bancario" integer NOT NULL,
    "id_moneda" integer NOT NULL,
    "fecha_movimiento_bancario" timestamp without time zone NOT NULL,
    "monto_bancario" numeric(14,2) NOT NULL,
    "descripcion_bancaria" "text",
    "glosa_bancaria" "text",
    "tipo_movimiento_bancario" character varying(50),
    "banco" character varying(100),
    "cuenta_bancaria" character varying(80),
    "numero_operacion" character varying(100),
    "estado_conciliacion" character varying(30) DEFAULT 'pendiente'::character varying NOT NULL,
    "id_cuenta_bancaria_m7" integer,
    "naturaleza_bancaria" character varying(10),
    CONSTRAINT "chk_movimiento_bancario_estado" CHECK ((("estado_conciliacion")::"text" = ANY (ARRAY[('pendiente'::character varying)::"text", ('conciliado'::character varying)::"text", ('observado'::character varying)::"text", ('anulado'::character varying)::"text"]))),
    CONSTRAINT "chk_movimiento_bancario_monto" CHECK (("monto_bancario" > (0)::numeric)),
    CONSTRAINT "chk_movimiento_bancario_naturaleza_m7" CHECK ((("naturaleza_bancaria" IS NULL) OR (("naturaleza_bancaria")::"text" = ANY (ARRAY[('ingreso'::character varying)::"text", ('egreso'::character varying)::"text"]))))
);



ALTER TABLE "finanzas"."movimiento_bancario" ALTER COLUMN "id_movimiento_bancario" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."movimiento_bancario_id_movimiento_bancario_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."movimiento_financiero" (
    "id_movimiento_financiero" integer NOT NULL,
    "id_moneda" integer NOT NULL,
    "fecha_movimiento" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "tipo_movimiento_financiero" character varying(50) NOT NULL,
    "naturaleza_movimiento" character varying(30) NOT NULL,
    "motivo_movimiento" "text",
    "monto_movimiento" numeric(14,2) NOT NULL,
    "estado_movimiento" character varying(30) DEFAULT 'registrado'::character varying NOT NULL,
    "observacion" "text",
    CONSTRAINT "chk_movimiento_financiero_estado" CHECK ((("estado_movimiento")::"text" = ANY (ARRAY[('registrado'::character varying)::"text", ('conciliado'::character varying)::"text", ('anulado'::character varying)::"text"]))),
    CONSTRAINT "chk_movimiento_financiero_monto" CHECK (("monto_movimiento" > (0)::numeric)),
    CONSTRAINT "chk_movimiento_financiero_naturaleza" CHECK ((("naturaleza_movimiento")::"text" = ANY (ARRAY[('ingreso'::character varying)::"text", ('egreso'::character varying)::"text", ('ajuste'::character varying)::"text"])))
);



ALTER TABLE "finanzas"."movimiento_financiero" ALTER COLUMN "id_movimiento_financiero" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."movimiento_financiero_id_movimiento_financiero_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."movimiento_pago_proveedor_m5" (
    "id_movimiento_pago_m5" integer NOT NULL,
    "id_operacion_pago_m5" integer NOT NULL,
    "id_obligacion_m5" integer NOT NULL,
    "id_medio_pago" integer NOT NULL,
    "id_moneda" integer NOT NULL,
    "monto_aplicado" numeric(14,2) NOT NULL,
    "tasa_referencia" numeric(14,4),
    "fuente_tasa" character varying(80),
    "fecha_tasa" "date",
    "tasa_manual" boolean DEFAULT false NOT NULL,
    "tasa_manual_justificacion" "text",
    "tasa_manual_usuario" bigint,
    "tasa_manual_fecha" timestamp with time zone,
    "tasa_bancaria_efectiva" numeric(14,4),
    "equivalente_clp" numeric(14,2),
    "estado" character varying(20) DEFAULT 'borrador'::character varying NOT NULL,
    "fecha_creacion" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "chk_movimiento_pago_m5_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('borrador'::character varying)::"text", ('Vigente'::character varying)::"text"]))),
    CONSTRAINT "chk_movimiento_pago_m5_monto" CHECK (("monto_aplicado" > (0)::numeric)),
    CONSTRAINT "chk_movimiento_pago_m5_tasas" CHECK (((("tasa_referencia" IS NULL) OR ("tasa_referencia" > (0)::numeric)) AND (("tasa_bancaria_efectiva" IS NULL) OR ("tasa_bancaria_efectiva" > (0)::numeric))))
);



ALTER TABLE "finanzas"."movimiento_pago_proveedor_m5" ALTER COLUMN "id_movimiento_pago_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."movimiento_pago_proveedor_m5_id_movimiento_pago_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."nota_venta" (
    "id_nota_venta" integer NOT NULL,
    "id_ficha_cliente" integer NOT NULL,
    "id_cotizacion" integer,
    "id_moneda" integer NOT NULL,
    "numero_nota_venta" character varying(50) NOT NULL,
    "fecha_emision" "date" NOT NULL,
    "monto_neto" numeric(14,2) DEFAULT 0 NOT NULL,
    "monto_impuesto" numeric(14,2) DEFAULT 0 NOT NULL,
    "monto_total" numeric(14,2) DEFAULT 0 NOT NULL,
    "tipo_cambio_usado" numeric(14,4),
    "monto_convertido" numeric(14,2),
    "estado_nota_venta" character varying(30) DEFAULT 'emitida'::character varying NOT NULL,
    "estado_pago" character varying(30) DEFAULT 'pendiente'::character varying NOT NULL,
    "descuento_aplicado" numeric(14,2) DEFAULT 0,
    "motivo_descuento" "text",
    "fecha_anulacion" timestamp without time zone,
    "motivo_anulacion" "text",
    "observacion" "text",
    "fecha_vencimiento" "date",
    "exento_iva" boolean DEFAULT false NOT NULL,
    "id_proyecto_contexto" bigint,
    CONSTRAINT "chk_nota_venta_descuento" CHECK ((("descuento_aplicado" IS NULL) OR ("descuento_aplicado" >= (0)::numeric))),
    CONSTRAINT "chk_nota_venta_estado" CHECK ((("estado_nota_venta")::"text" = ANY (ARRAY[('emitida'::character varying)::"text", ('confirmada'::character varying)::"text", ('anulada'::character varying)::"text", ('cerrada'::character varying)::"text", ('provisional'::character varying)::"text", ('revertida_parcial'::character varying)::"text", ('revertida_total'::character varying)::"text"]))),
    CONSTRAINT "chk_nota_venta_estado_pago" CHECK ((("estado_pago")::"text" = ANY (ARRAY[('pendiente'::character varying)::"text", ('parcial'::character varying)::"text", ('pagada'::character varying)::"text", ('vencida'::character varying)::"text"]))),
    CONSTRAINT "chk_nota_venta_monto_convertido" CHECK ((("monto_convertido" IS NULL) OR ("monto_convertido" >= (0)::numeric))),
    CONSTRAINT "chk_nota_venta_montos" CHECK ((("monto_neto" >= (0)::numeric) AND ("monto_impuesto" >= (0)::numeric) AND ("monto_total" >= (0)::numeric)))
);



ALTER TABLE "finanzas"."nota_venta" ALTER COLUMN "id_nota_venta" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."nota_venta_id_nota_venta_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."obligacion_proveedor_m5" (
    "id_obligacion_m5" integer NOT NULL,
    "id_documento_m5" integer NOT NULL,
    "id_proveedor" integer NOT NULL,
    "monto_original" numeric(14,2) NOT NULL,
    "id_moneda" integer NOT NULL,
    "saldo_inicial" numeric(14,2) NOT NULL,
    "saldo_actual" numeric(14,2) NOT NULL,
    "fecha_emision" "date" NOT NULL,
    "fecha_vencimiento" "date" NOT NULL,
    "estado_pago" character varying(20) DEFAULT 'Pendiente'::character varying NOT NULL,
    "condicion_temporal" character varying(20),
    "condicion_pago_dias_snapshot" integer,
    "condicion_pago_tipo_snapshot" character varying(20),
    "tipo_cambio" numeric(14,4),
    "tipo_cambio_origen" character varying(40),
    "fecha_generacion" timestamp with time zone DEFAULT "now"() NOT NULL,
    "generado_por" bigint NOT NULL
);



ALTER TABLE "finanzas"."obligacion_proveedor_m5" ALTER COLUMN "id_obligacion_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."obligacion_proveedor_m5_id_obligacion_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."opcional_comercial" (
    "id_opcional_comercial" bigint NOT NULL,
    "codigo" character varying(60) NOT NULL,
    "nombre" character varying(200) NOT NULL,
    "descripcion_b2b" "text",
    "descripcion_b2c" "text",
    "estado" character varying(20) DEFAULT 'ACTIVO'::character varying NOT NULL,
    "revision" integer DEFAULT 1 NOT NULL,
    "creado_por" bigint NOT NULL,
    "creado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "ck_opcional_comercial_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('ACTIVO'::character varying)::"text", ('INACTIVO'::character varying)::"text"]))),
    CONSTRAINT "ck_opcional_comercial_revision" CHECK (("revision" > 0))
);



CREATE SEQUENCE "finanzas"."opcional_comercial_id_opcional_comercial_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."opcional_comercial_id_opcional_comercial_seq" OWNED BY "finanzas"."opcional_comercial"."id_opcional_comercial";



CREATE TABLE "finanzas"."operacion_pago_proveedor_m5" (
    "id_operacion_pago_m5" integer NOT NULL,
    "id_proveedor" integer NOT NULL,
    "estado" character varying(20) DEFAULT 'borrador'::character varying NOT NULL,
    "fecha_efectiva_pago" "date",
    "creado_por" bigint NOT NULL,
    "fecha_creacion" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "preparado_por" bigint,
    "fecha_preparacion" timestamp with time zone,
    "confirmado_por" bigint,
    "fecha_confirmacion" timestamp with time zone,
    "descartado_por" bigint,
    "fecha_descarte" timestamp with time zone,
    "total_confirmado" numeric(14,2),
    CONSTRAINT "chk_operacion_pago_m5_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('borrador'::character varying)::"text", ('preparada'::character varying)::"text", ('confirmada'::character varying)::"text", ('descartada'::character varying)::"text"]))),
    CONSTRAINT "chk_operacion_pago_m5_total" CHECK ((("total_confirmado" IS NULL) OR ("total_confirmado" > (0)::numeric)))
);



ALTER TABLE "finanzas"."operacion_pago_proveedor_m5" ALTER COLUMN "id_operacion_pago_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."operacion_pago_proveedor_m5_id_operacion_pago_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."orden_compra_b2b" (
    "id_orden_compra_b2b" integer NOT NULL,
    "id_cotizacion" integer NOT NULL,
    "folio" "text" NOT NULL,
    "respaldo" "text" NOT NULL,
    "fecha" "date" NOT NULL,
    "id_version_oferta_aceptada" integer,
    "estado_cotejo" character varying(30) DEFAULT 'INFORMACION_INSUFICIENTE'::character varying NOT NULL,
    "resultado_cotejo" "jsonb",
    "revision" integer DEFAULT 1 NOT NULL,
    CONSTRAINT "ck_orden_compra_estado_cotejo" CHECK ((("estado_cotejo")::"text" = ANY (ARRAY[('COINCIDE'::character varying)::"text", ('DISCREPANCIA'::character varying)::"text", ('INFORMACION_INSUFICIENTE'::character varying)::"text"]))),
    CONSTRAINT "ck_orden_compra_revision" CHECK (("revision" > 0))
);



CREATE SEQUENCE "finanzas"."orden_compra_b2b_id_orden_compra_b2b_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."orden_compra_b2b_id_orden_compra_b2b_seq" OWNED BY "finanzas"."orden_compra_b2b"."id_orden_compra_b2b";



CREATE TABLE "finanzas"."orden_compra_servicio_m5" (
    "id_orden_compra_servicio_m5" integer NOT NULL,
    "id_proveedor" integer NOT NULL,
    "monto_autorizado" numeric(14,2) NOT NULL,
    "estado_ocs" character varying(20) DEFAULT 'abierta'::character varying NOT NULL,
    "referencia" character varying(150),
    "periodo" character varying(50),
    "descripcion" "text",
    "fecha_creacion" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "fecha_actualizacion" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "creado_por" bigint NOT NULL,
    "monto_autorizado_original" numeric(14,2) NOT NULL,
    "id_moneda" integer,
    "id_ficha_cliente_contexto" integer,
    "id_cotizacion_contexto" integer,
    "id_proyecto_financiero_contexto" integer,
    "id_orden_trabajo_contexto" bigint,
    "fecha_esperada_recepcion" "date",
    CONSTRAINT "chk_ocs_m5_estado" CHECK ((("estado_ocs")::"text" = ANY (ARRAY[('abierta'::character varying)::"text", ('cerrada'::character varying)::"text", ('anulada'::character varying)::"text"]))),
    CONSTRAINT "chk_ocs_m5_monto" CHECK (("monto_autorizado" > (0)::numeric)),
    CONSTRAINT "chk_ocs_m5_monto_original" CHECK (("monto_autorizado_original" > (0)::numeric))
);



ALTER TABLE "finanzas"."orden_compra_servicio_m5" ALTER COLUMN "id_orden_compra_servicio_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."orden_compra_servicio_m5_id_orden_compra_servicio_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."origen_alerta_financiera" (
    "id_origen_alerta_financiera" integer NOT NULL,
    "id_alerta_financiera" integer NOT NULL,
    "entidad_origen" character varying(80) NOT NULL,
    "id_registro_origen" integer NOT NULL,
    "descripcion_origen" "text",
    CONSTRAINT "chk_origen_alerta_financiera_entidad" CHECK ((("entidad_origen")::"text" = ANY (ARRAY[('ficha_cliente'::character varying)::"text", ('nota_venta'::character varying)::"text", ('documento_tributario'::character varying)::"text", ('documento_compra_proveedor'::character varying)::"text", ('proyecto_financiero'::character varying)::"text", ('credito_proyecto'::character varying)::"text", ('evaluacion_credito'::character varying)::"text", ('fondo_global_credito'::character varying)::"text", ('proveedor'::character varying)::"text"])))
);



ALTER TABLE "finanzas"."origen_alerta_financiera" ALTER COLUMN "id_origen_alerta_financiera" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."origen_alerta_financiera_id_origen_alerta_financiera_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."origen_movimiento_financiero" (
    "id_origen_movimiento_financiero" integer CONSTRAINT "origen_movimiento_financier_id_origen_movimiento_finan_not_null" NOT NULL,
    "id_movimiento_financiero" integer NOT NULL,
    "entidad_origen" character varying(80) NOT NULL,
    "id_registro_origen" integer NOT NULL,
    "descripcion_origen" "text",
    CONSTRAINT "chk_origen_movimiento_financiero_entidad" CHECK ((("entidad_origen")::"text" = ANY (ARRAY[('pago_cliente'::character varying)::"text", ('pago_proveedor'::character varying)::"text", ('gasto_caja_chica'::character varying)::"text", ('liquidacion_remuneracion'::character varying)::"text", ('ajuste_manual'::character varying)::"text"])))
);



ALTER TABLE "finanzas"."origen_movimiento_financiero" ALTER COLUMN "id_origen_movimiento_financiero" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."origen_movimiento_financiero_id_origen_movimiento_financier_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."pago_cliente" (
    "id_pago_cliente" integer NOT NULL,
    "id_ficha_cliente" integer NOT NULL,
    "id_moneda" integer NOT NULL,
    "id_medio_pago" integer NOT NULL,
    "fecha_pago" "date" NOT NULL,
    "monto_pago" numeric(14,2) NOT NULL,
    "tipo_cambio_usado" numeric(14,4),
    "monto_convertido" numeric(14,2),
    "naturaleza_pago" character varying(30) DEFAULT 'ingreso_cliente'::character varying NOT NULL,
    "estado_verificacion" character varying(30) DEFAULT 'pendiente'::character varying NOT NULL,
    "comprobante_pago" "text",
    "observacion" "text",
    "antecedentes_medio" "jsonb",
    "cantidad_cuotas" integer,
    "estado_conciliacion" character varying(20) DEFAULT 'pendiente'::character varying NOT NULL,
    "fecha_registro" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "id_categoria_pago" integer,
    "referencia_demostracion" character varying(80),
    CONSTRAINT "chk_pago_cliente_estado" CHECK ((("estado_verificacion")::"text" = ANY (ARRAY[('pendiente'::character varying)::"text", ('verificado'::character varying)::"text", ('rechazado'::character varying)::"text", ('anulado'::character varying)::"text"]))),
    CONSTRAINT "chk_pago_cliente_monto" CHECK (("monto_pago" > (0)::numeric)),
    CONSTRAINT "chk_pago_cliente_monto_convertido" CHECK ((("monto_convertido" IS NULL) OR ("monto_convertido" >= (0)::numeric))),
    CONSTRAINT "chk_pago_cuotas" CHECK ((("cantidad_cuotas" IS NULL) OR ("cantidad_cuotas" >= 1)))
);



ALTER TABLE "finanzas"."pago_cliente" ALTER COLUMN "id_pago_cliente" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."pago_cliente_id_pago_cliente_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."pago_proveedor" (
    "id_pago_proveedor" integer NOT NULL,
    "id_proveedor" integer NOT NULL,
    "id_moneda" integer NOT NULL,
    "id_medio_pago" integer NOT NULL,
    "fecha_pago" "date" NOT NULL,
    "monto_pago" numeric(14,2) NOT NULL,
    "tipo_cambio_usado" numeric(14,4),
    "monto_convertido" numeric(14,2),
    "estado_pago" character varying(30) DEFAULT 'registrado'::character varying NOT NULL,
    "comprobante_pago" "text",
    "observacion" "text",
    CONSTRAINT "chk_pago_proveedor_convertido" CHECK ((("monto_convertido" IS NULL) OR ("monto_convertido" >= (0)::numeric))),
    CONSTRAINT "chk_pago_proveedor_estado" CHECK ((("estado_pago")::"text" = ANY (ARRAY[('registrado'::character varying)::"text", ('verificado'::character varying)::"text", ('anulado'::character varying)::"text"]))),
    CONSTRAINT "chk_pago_proveedor_monto" CHECK (("monto_pago" > (0)::numeric))
);



ALTER TABLE "finanzas"."pago_proveedor" ALTER COLUMN "id_pago_proveedor" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."pago_proveedor_id_pago_proveedor_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."pago_remuneracion" (
    "id_pago_remuneracion" integer NOT NULL,
    "origen_tipo" character varying(30) NOT NULL,
    "origen_id" integer NOT NULL,
    "monto" numeric(14,4) NOT NULL,
    "id_medio_pago" integer NOT NULL,
    "respaldo" "text",
    "referencia" character varying(200),
    "estado" character varying(20) DEFAULT 'PREPARADO'::character varying NOT NULL,
    "clave_idempotencia" character varying(100) NOT NULL,
    "creado_por" bigint NOT NULL,
    "creado_en" timestamp with time zone DEFAULT "now"() NOT NULL,
    "confirmado_por" bigint,
    "confirmado_en" timestamp with time zone,
    "motivo_anulacion" "text",
    "anulado_por" bigint,
    "anulado_en" timestamp with time zone,
    CONSTRAINT "ck_pago_remuneracion_anulacion" CHECK ((((("estado")::"text" = 'ANULADO'::"text") AND ("length"(TRIM(BOTH FROM "motivo_anulacion")) > 0) AND ("anulado_por" IS NOT NULL) AND ("anulado_en" IS NOT NULL)) OR ((("estado")::"text" <> 'ANULADO'::"text") AND ("motivo_anulacion" IS NULL) AND ("anulado_por" IS NULL) AND ("anulado_en" IS NULL)))),
    CONSTRAINT "ck_pago_remuneracion_confirmacion" CHECK ((((("estado")::"text" = 'PREPARADO'::"text") AND ("confirmado_por" IS NULL) AND ("confirmado_en" IS NULL)) OR ((("estado")::"text" = ANY (ARRAY[('CONFIRMADO'::character varying)::"text", ('ANULADO'::character varying)::"text"])) AND ("confirmado_por" IS NOT NULL) AND ("confirmado_en" IS NOT NULL)))),
    CONSTRAINT "ck_pago_remuneracion_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('PREPARADO'::character varying)::"text", ('CONFIRMADO'::character varying)::"text", ('ANULADO'::character varying)::"text"]))),
    CONSTRAINT "ck_pago_remuneracion_monto" CHECK (("monto" > (0)::numeric)),
    CONSTRAINT "ck_pago_remuneracion_origen" CHECK ((("origen_tipo")::"text" = ANY (ARRAY[('REMUNERACION'::character varying)::"text", ('ANTICIPO'::character varying)::"text", ('REGULARIZACION'::character varying)::"text", ('BOLETA_HONORARIOS'::character varying)::"text"])))
);



CREATE SEQUENCE "finanzas"."pago_remuneracion_id_pago_remuneracion_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."pago_remuneracion_id_pago_remuneracion_seq" OWNED BY "finanzas"."pago_remuneracion"."id_pago_remuneracion";



CREATE TABLE "finanzas"."pais" (
    "id_pais" integer NOT NULL,
    "nombre_pais" character varying(100) NOT NULL,
    "codigo_iso_pais" character varying(10),
    "estado_pais" character varying(20) DEFAULT 'activo'::character varying NOT NULL,
    CONSTRAINT "chk_pais_estado" CHECK ((("estado_pais")::"text" = ANY (ARRAY[('activo'::character varying)::"text", ('inactivo'::character varying)::"text"])))
);



ALTER TABLE "finanzas"."pais" ALTER COLUMN "id_pais" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."pais_id_pais_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."parametro_remuneracional" (
    "id_parametro_remuneracional" integer NOT NULL,
    "codigo" character varying(50) NOT NULL,
    "tipo" character varying(30) NOT NULL,
    "nombre" character varying(120) NOT NULL,
    "descripcion" "text",
    "valor" numeric(18,6),
    "unidad" character varying(30),
    "vigencia_desde" "date" NOT NULL,
    "vigencia_hasta" "date",
    "fuente" character varying(200),
    "referencia" character varying(300),
    "estado" character varying(20) DEFAULT 'pendiente'::character varying NOT NULL,
    CONSTRAINT "chk_parametro_remuneracional_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('pendiente'::character varying)::"text", ('activo'::character varying)::"text", ('inactivo'::character varying)::"text"]))),
    CONSTRAINT "chk_parametro_remuneracional_tipo" CHECK ((("tipo")::"text" = ANY (ARRAY[('LEGAL'::character varying)::"text", ('PREVISIONAL'::character varying)::"text", ('TRIBUTARIO'::character varying)::"text", ('PRORRATEO'::character varying)::"text", ('DASHBOARD'::character varying)::"text"]))),
    CONSTRAINT "chk_parametro_remuneracional_valor" CHECK ((("valor" IS NULL) OR ("valor" >= (0)::numeric))),
    CONSTRAINT "chk_parametro_remuneracional_vigencia" CHECK ((("vigencia_hasta" IS NULL) OR ("vigencia_hasta" >= "vigencia_desde")))
);



ALTER TABLE "finanzas"."parametro_remuneracional" ALTER COLUMN "id_parametro_remuneracional" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."parametro_remuneracional_id_parametro_remuneracional_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."pendiente_evento_m9" (
    "id_pendiente_m9" integer NOT NULL,
    "identidad_logica" character varying(160) NOT NULL,
    "productor" character varying(80) NOT NULL,
    "modulo_origen" character varying(40) NOT NULL,
    "operacion" character varying(100) NOT NULL,
    "fecha_ocurrencia" timestamp(6) with time zone NOT NULL,
    "creado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "proximo_intento_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "resuelto_en" timestamp(6) with time zone,
    "estado" character varying(20) DEFAULT 'PENDIENTE'::character varying NOT NULL,
    "cantidad_intentos" integer DEFAULT 0 NOT NULL,
    "ultimo_error_codigo" character varying(100),
    "ultimo_error_en" timestamp(6) with time zone,
    "payload_evento" "jsonb" NOT NULL,
    CONSTRAINT "chk_m9_pendiente_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('PENDIENTE'::character varying)::"text", ('REINTENTANDO'::character varying)::"text", ('RESUELTO'::character varying)::"text"]))),
    CONSTRAINT "chk_m9_pendiente_intentos" CHECK (("cantidad_intentos" >= 0))
);



CREATE SEQUENCE "finanzas"."pendiente_evento_m9_id_pendiente_m9_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."pendiente_evento_m9_id_pendiente_m9_seq" OWNED BY "finanzas"."pendiente_evento_m9"."id_pendiente_m9";



CREATE TABLE "finanzas"."periodo_remuneracion" (
    "id_periodo_remuneracion" integer NOT NULL,
    "anio" integer NOT NULL,
    "mes" integer NOT NULL,
    "fecha_inicio" "date" NOT NULL,
    "fecha_fin" "date" NOT NULL,
    "creado_en" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "cerrado_en" timestamp with time zone,
    "cerrado_por" bigint,
    CONSTRAINT "ck_periodo_remuneracion_cierre" CHECK (((("cerrado_en" IS NULL) AND ("cerrado_por" IS NULL)) OR (("cerrado_en" IS NOT NULL) AND ("cerrado_por" IS NOT NULL)))),
    CONSTRAINT "ck_periodo_remuneracion_fechas" CHECK (("fecha_inicio" <= "fecha_fin")),
    CONSTRAINT "ck_periodo_remuneracion_mes" CHECK ((("mes" >= 1) AND ("mes" <= 12)))
);



CREATE SEQUENCE "finanzas"."periodo_remuneracion_id_periodo_remuneracion_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."periodo_remuneracion_id_periodo_remuneracion_seq" OWNED BY "finanzas"."periodo_remuneracion"."id_periodo_remuneracion";



CREATE TABLE "finanzas"."plantilla_documental_comercial" (
    "id_plantilla_documental" bigint NOT NULL,
    "codigo" character varying(60) NOT NULL,
    "nombre" character varying(200) NOT NULL,
    "tipo_documento" character varying(30) NOT NULL,
    "segmento" character varying(20) NOT NULL,
    "estado" character varying(20) DEFAULT 'ACTIVA'::character varying NOT NULL,
    "revision" integer DEFAULT 1 NOT NULL,
    "creado_por" bigint NOT NULL,
    "creado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "ck_plantilla_documental_coherencia" CHECK ((((("tipo_documento")::"text" = 'COTIZACION'::"text") AND (("segmento")::"text" = ANY (ARRAY[('B2B'::character varying)::"text", ('B2C'::character varying)::"text"]))) OR ((("tipo_documento")::"text" = 'CARTA_GENERAL'::"text") AND (("segmento")::"text" = 'CARTA_B2C'::"text")))),
    CONSTRAINT "ck_plantilla_documental_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('ACTIVA'::character varying)::"text", ('INACTIVA'::character varying)::"text"]))),
    CONSTRAINT "ck_plantilla_documental_revision" CHECK (("revision" > 0)),
    CONSTRAINT "ck_plantilla_documental_segmento" CHECK ((("segmento")::"text" = ANY (ARRAY[('B2B'::character varying)::"text", ('B2C'::character varying)::"text", ('CARTA_B2C'::character varying)::"text"]))),
    CONSTRAINT "ck_plantilla_documental_tipo" CHECK ((("tipo_documento")::"text" = ANY (ARRAY[('COTIZACION'::character varying)::"text", ('CARTA_GENERAL'::character varying)::"text"])))
);



CREATE SEQUENCE "finanzas"."plantilla_documental_comercial_id_plantilla_documental_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."plantilla_documental_comercial_id_plantilla_documental_seq" OWNED BY "finanzas"."plantilla_documental_comercial"."id_plantilla_documental";



CREATE TABLE "finanzas"."plantilla_documental_version" (
    "id_plantilla_documental_version" bigint CONSTRAINT "plantilla_documental_versio_id_plantilla_documental_ve_not_null" NOT NULL,
    "id_plantilla_documental" bigint NOT NULL,
    "numero_version" integer NOT NULL,
    "esquema_contenido" "jsonb" NOT NULL,
    "id_condicion_comercial_version" bigint,
    "estado" character varying(20) DEFAULT 'BORRADOR'::character varying NOT NULL,
    "motivo" "text" NOT NULL,
    "publicado_por" bigint,
    "publicado_en" timestamp(6) with time zone,
    CONSTRAINT "ck_plantilla_documental_version_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('BORRADOR'::character varying)::"text", ('PUBLICADA'::character varying)::"text", ('ARCHIVADA'::character varying)::"text"]))),
    CONSTRAINT "ck_plantilla_documental_version_numero" CHECK (("numero_version" > 0)),
    CONSTRAINT "ck_plantilla_documental_version_publicacion" CHECK ((((("estado")::"text" = 'BORRADOR'::"text") AND ("publicado_por" IS NULL) AND ("publicado_en" IS NULL)) OR ((("estado")::"text" <> 'BORRADOR'::"text") AND ("publicado_por" IS NOT NULL) AND ("publicado_en" IS NOT NULL))))
);



CREATE SEQUENCE "finanzas"."plantilla_documental_version_id_plantilla_documental_versio_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."plantilla_documental_version_id_plantilla_documental_versio_seq" OWNED BY "finanzas"."plantilla_documental_version"."id_plantilla_documental_version";



CREATE TABLE "finanzas"."plantilla_fabricacion_familia" (
    "id_plantilla_fabricacion" integer NOT NULL,
    "id_familia_producto_comercial" integer CONSTRAINT "plantilla_fabricacion_famil_id_familia_producto_comerc_not_null" NOT NULL,
    "borrador" "jsonb" DEFAULT '{"etapas": []}'::"jsonb" NOT NULL,
    "numero_version_vigente" integer,
    "revision" integer DEFAULT 1 NOT NULL,
    "creado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "creado_por" bigint NOT NULL,
    "actualizado_por" bigint NOT NULL
);



CREATE SEQUENCE "finanzas"."plantilla_fabricacion_familia_id_plantilla_fabricacion_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."plantilla_fabricacion_familia_id_plantilla_fabricacion_seq" OWNED BY "finanzas"."plantilla_fabricacion_familia"."id_plantilla_fabricacion";



CREATE TABLE "finanzas"."politica_tratamiento_m9" (
    "id_politica_m9" integer NOT NULL,
    "id_categoria_retencion" integer NOT NULL,
    "version" integer NOT NULL,
    "accion" character varying(20) NOT NULL,
    "modulo_objetivo" character varying(40),
    "entidad_objetivo" character varying(80),
    "estrategia_ref" character varying(100),
    "permite_correlacion" boolean DEFAULT false NOT NULL,
    "preservar_minimo" boolean DEFAULT false NOT NULL,
    "finalidad_ref" character varying(200),
    "base_ref" character varying(200),
    "politica_owner_ref" character varying(200),
    "vigencia_desde" timestamp(6) with time zone NOT NULL,
    "vigencia_hasta" timestamp(6) with time zone,
    "creada_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "chk_m9_politica_accion" CHECK ((("accion")::"text" = ANY (ARRAY[('NONE'::character varying)::"text", ('ANONYMIZE'::character varying)::"text", ('PURGE'::character varying)::"text", ('BLOCK'::character varying)::"text"]))),
    CONSTRAINT "chk_m9_politica_vigencia" CHECK ((("vigencia_hasta" IS NULL) OR ("vigencia_hasta" >= "vigencia_desde")))
);



CREATE SEQUENCE "finanzas"."politica_tratamiento_m9_id_politica_m9_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."politica_tratamiento_m9_id_politica_m9_seq" OWNED BY "finanzas"."politica_tratamiento_m9"."id_politica_m9";



CREATE TABLE "finanzas"."precio_opcional_comercial" (
    "id_precio_opcional_comercial" bigint NOT NULL,
    "id_opcional_comercial" bigint NOT NULL,
    "segmento_comercial" character varying(3) NOT NULL,
    "id_moneda" integer NOT NULL,
    "monto" numeric(14,2) NOT NULL,
    "vigencia_desde" "date" NOT NULL,
    "vigencia_hasta" "date",
    "estado" character varying(20) DEFAULT 'ACTIVO'::character varying NOT NULL,
    "motivo" "text",
    "revision" integer DEFAULT 1 NOT NULL,
    "creado_por" bigint NOT NULL,
    "creado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "ck_precio_opcional_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('ACTIVO'::character varying)::"text", ('INACTIVO'::character varying)::"text"]))),
    CONSTRAINT "ck_precio_opcional_monto" CHECK (("monto" > (0)::numeric)),
    CONSTRAINT "ck_precio_opcional_revision" CHECK (("revision" > 0)),
    CONSTRAINT "ck_precio_opcional_segmento" CHECK ((("segmento_comercial")::"text" = ANY (ARRAY[('B2B'::character varying)::"text", ('B2C'::character varying)::"text"]))),
    CONSTRAINT "ck_precio_opcional_vigencia" CHECK ((("vigencia_hasta" IS NULL) OR ("vigencia_hasta" >= "vigencia_desde")))
);



CREATE SEQUENCE "finanzas"."precio_opcional_comercial_id_precio_opcional_comercial_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."precio_opcional_comercial_id_precio_opcional_comercial_seq" OWNED BY "finanzas"."precio_opcional_comercial"."id_precio_opcional_comercial";



CREATE TABLE "finanzas"."precio_producto_comercial" (
    "id_precio_producto_comercial" bigint NOT NULL,
    "id_extension_producto_comercial" integer CONSTRAINT "precio_producto_comercial_id_extension_producto_comerc_not_null" NOT NULL,
    "segmento_comercial" character varying(3) NOT NULL,
    "id_moneda" integer NOT NULL,
    "monto" numeric(14,2) NOT NULL,
    "vigencia_desde" "date" NOT NULL,
    "vigencia_hasta" "date",
    "estado" character varying(20) DEFAULT 'ACTIVO'::character varying NOT NULL,
    "motivo" "text",
    "revision" integer DEFAULT 1 NOT NULL,
    "creado_por" bigint NOT NULL,
    "creado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "ck_precio_producto_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('ACTIVO'::character varying)::"text", ('INACTIVO'::character varying)::"text"]))),
    CONSTRAINT "ck_precio_producto_monto" CHECK (("monto" > (0)::numeric)),
    CONSTRAINT "ck_precio_producto_revision" CHECK (("revision" > 0)),
    CONSTRAINT "ck_precio_producto_segmento" CHECK ((("segmento_comercial")::"text" = ANY (ARRAY[('B2B'::character varying)::"text", ('B2C'::character varying)::"text"]))),
    CONSTRAINT "ck_precio_producto_vigencia" CHECK ((("vigencia_hasta" IS NULL) OR ("vigencia_hasta" >= "vigencia_desde")))
);



CREATE SEQUENCE "finanzas"."precio_producto_comercial_id_precio_producto_comercial_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."precio_producto_comercial_id_precio_producto_comercial_seq" OWNED BY "finanzas"."precio_producto_comercial"."id_precio_producto_comercial";



CREATE TABLE "finanzas"."precio_servicio_comercial" (
    "id_precio_servicio_comercial" bigint NOT NULL,
    "id_servicio_comercial" bigint NOT NULL,
    "segmento_comercial" character varying(3) NOT NULL,
    "id_moneda" integer NOT NULL,
    "monto" numeric(14,2) NOT NULL,
    "vigencia_desde" "date" NOT NULL,
    "vigencia_hasta" "date",
    "estado" character varying(20) DEFAULT 'ACTIVO'::character varying NOT NULL,
    "motivo" "text",
    "revision" integer DEFAULT 1 NOT NULL,
    "creado_por" bigint NOT NULL,
    "creado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "ck_precio_servicio_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('ACTIVO'::character varying)::"text", ('INACTIVO'::character varying)::"text"]))),
    CONSTRAINT "ck_precio_servicio_monto" CHECK (("monto" > (0)::numeric)),
    CONSTRAINT "ck_precio_servicio_revision" CHECK (("revision" > 0)),
    CONSTRAINT "ck_precio_servicio_segmento" CHECK ((("segmento_comercial")::"text" = ANY (ARRAY[('B2B'::character varying)::"text", ('B2C'::character varying)::"text"]))),
    CONSTRAINT "ck_precio_servicio_vigencia" CHECK ((("vigencia_hasta" IS NULL) OR ("vigencia_hasta" >= "vigencia_desde")))
);



CREATE SEQUENCE "finanzas"."precio_servicio_comercial_id_precio_servicio_comercial_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."precio_servicio_comercial_id_precio_servicio_comercial_seq" OWNED BY "finanzas"."precio_servicio_comercial"."id_precio_servicio_comercial";



CREATE TABLE "finanzas"."prestador_honorarios" (
    "id_prestador_honorarios" integer NOT NULL,
    "identificador" character varying(30) NOT NULL,
    "nombre_razon_social" character varying(160) NOT NULL,
    "contacto" "text",
    "estado" character varying(20) DEFAULT 'ACTIVO'::character varying NOT NULL,
    CONSTRAINT "ck_prestador_honorarios_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('ACTIVO'::character varying)::"text", ('INACTIVO'::character varying)::"text"]))),
    CONSTRAINT "ck_prestador_honorarios_identidad" CHECK ((("length"(TRIM(BOTH FROM "identificador")) > 0) AND ("length"(TRIM(BOTH FROM "nombre_razon_social")) > 0)))
);



CREATE SEQUENCE "finanzas"."prestador_honorarios_id_prestador_honorarios_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."prestador_honorarios_id_prestador_honorarios_seq" OWNED BY "finanzas"."prestador_honorarios"."id_prestador_honorarios";



CREATE TABLE "finanzas"."presupuesto_manual_m10" (
    "id_presupuesto_manual_m10" bigint NOT NULL,
    "anio" integer NOT NULL,
    "ambito" character varying(40) DEFAULT 'GENERAL'::character varying NOT NULL,
    "id_moneda" integer NOT NULL,
    "estado" character varying(20) DEFAULT 'activo'::character varying NOT NULL,
    "revision" integer DEFAULT 1 NOT NULL,
    "creado_por" bigint NOT NULL,
    "fecha_creacion" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "fecha_actualizacion" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "ck_presupuesto_m10_anio" CHECK ((("anio" >= 2000) AND ("anio" <= 2200))),
    CONSTRAINT "ck_presupuesto_m10_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('activo'::character varying)::"text", ('inactivo'::character varying)::"text"]))),
    CONSTRAINT "ck_presupuesto_m10_revision" CHECK (("revision" >= 1))
);



CREATE SEQUENCE "finanzas"."presupuesto_manual_m10_id_presupuesto_manual_m10_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."presupuesto_manual_m10_id_presupuesto_manual_m10_seq" OWNED BY "finanzas"."presupuesto_manual_m10"."id_presupuesto_manual_m10";



CREATE TABLE "finanzas"."prevision_salud" (
    "id_prevision_salud" integer NOT NULL,
    "nombre_prevision_salud" character varying(100) NOT NULL,
    "tipo_prevision_salud" character varying(50),
    "estado_prevision_salud" character varying(20) DEFAULT 'activo'::character varying NOT NULL,
    CONSTRAINT "chk_prevision_salud_estado" CHECK ((("estado_prevision_salud")::"text" = ANY (ARRAY[('activo'::character varying)::"text", ('inactivo'::character varying)::"text"])))
);



ALTER TABLE "finanzas"."prevision_salud" ALTER COLUMN "id_prevision_salud" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."prevision_salud_id_prevision_salud_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."producto_comercial_documento" (
    "id_producto_comercial_documento" bigint CONSTRAINT "producto_comercial_document_id_producto_comercial_docu_not_null" NOT NULL,
    "id_extension_producto_comercial" integer CONSTRAINT "producto_comercial_document_id_extension_producto_come_not_null" NOT NULL,
    "id_documento_logico" bigint NOT NULL,
    "tipo_documento" character varying(40) NOT NULL,
    "orden_presentacion" integer DEFAULT 0 NOT NULL,
    "es_imagen_principal" boolean DEFAULT false NOT NULL,
    "habilitado_b2b" boolean DEFAULT false NOT NULL,
    "habilitado_b2c" boolean DEFAULT false NOT NULL,
    "estado" character varying(20) DEFAULT 'ACTIVO'::character varying NOT NULL,
    "asociado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "usuario_responsable" bigint NOT NULL,
    "revision" integer DEFAULT 1 NOT NULL,
    CONSTRAINT "chk_producto_documento_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('ACTIVO'::character varying)::"text", ('INACTIVO'::character varying)::"text"]))),
    CONSTRAINT "chk_producto_documento_orden" CHECK (("orden_presentacion" >= 0)),
    CONSTRAINT "chk_producto_documento_principal" CHECK (((NOT "es_imagen_principal") OR ((("tipo_documento")::"text" = 'FOTOGRAFIA_COMERCIAL'::"text") AND (("estado")::"text" = 'ACTIVO'::"text")))),
    CONSTRAINT "chk_producto_documento_revision" CHECK (("revision" > 0)),
    CONSTRAINT "chk_producto_documento_tipo" CHECK ((("tipo_documento")::"text" = ANY (ARRAY[('FOTOGRAFIA_COMERCIAL'::character varying)::"text", ('DIAGRAMA_TECNICO'::character varying)::"text", ('FICHA_TECNICA'::character varying)::"text", ('CATALOGO'::character varying)::"text", ('OTRO_AUTORIZADO'::character varying)::"text"])))
);



CREATE SEQUENCE "finanzas"."producto_comercial_documento_id_producto_comercial_document_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."producto_comercial_documento_id_producto_comercial_document_seq" OWNED BY "finanzas"."producto_comercial_documento"."id_producto_comercial_documento";



CREATE TABLE "finanzas"."producto_comercial_version" (
    "id_producto_comercial_version" integer CONSTRAINT "producto_comercial_version_id_producto_comercial_versi_not_null" NOT NULL,
    "id_extension_producto_comercial" integer CONSTRAINT "producto_comercial_version_id_extension_producto_comer_not_null" NOT NULL,
    "numero_version" integer NOT NULL,
    "codigo_comercial" character varying(60) NOT NULL,
    "nombre_comercial" character varying(200) NOT NULL,
    "id_familia_producto_comercial" integer CONSTRAINT "producto_comercial_version_id_familia_producto_comerci_not_null" NOT NULL,
    "codigo_familia" character varying(40) NOT NULL,
    "nombre_familia" character varying(150) NOT NULL,
    "subfamilia" character varying(120),
    "tipo_producto" character varying(100),
    "descripcion_general" "text",
    "descripcion_b2b" "text",
    "descripcion_b2c" "text",
    "observaciones" "text",
    "garantia_referencial" "text",
    "condiciones_particulares" "text",
    "caracteristicas_destacadas" "jsonb" NOT NULL,
    "caracteristicas_tecnicas" "jsonb" NOT NULL,
    "id_item_comercial" integer,
    "producto_terminado_id_producto" bigint,
    "vigencia_desde" "date" NOT NULL,
    "motivo" "text" NOT NULL,
    "usuario_id_usuario" bigint NOT NULL,
    "creado_en" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



CREATE SEQUENCE "finanzas"."producto_comercial_version_id_producto_comercial_version_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."producto_comercial_version_id_producto_comercial_version_seq" OWNED BY "finanzas"."producto_comercial_version"."id_producto_comercial_version";



CREATE TABLE "finanzas"."propuesta_imputacion_m5" (
    "id_propuesta_imputacion_m5" integer NOT NULL,
    "id_documento_m5" integer NOT NULL,
    "estado" character varying(20) DEFAULT 'pendiente'::character varying NOT NULL,
    "preparado_por" bigint NOT NULL,
    "fecha_preparacion" timestamp with time zone DEFAULT "now"() NOT NULL,
    "confirmado_por" bigint,
    "fecha_confirmacion" timestamp with time zone,
    CONSTRAINT "propuesta_imputacion_m5_estado_check" CHECK ((("estado")::"text" = ANY (ARRAY[('pendiente'::character varying)::"text", ('confirmado'::character varying)::"text"])))
);



ALTER TABLE "finanzas"."propuesta_imputacion_m5" ALTER COLUMN "id_propuesta_imputacion_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."propuesta_imputacion_m5_id_propuesta_imputacion_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."proveedor" (
    "id_proveedor" integer NOT NULL,
    "id_tipo_identificador" integer NOT NULL,
    "id_pais" integer,
    "id_moneda_preferente" integer,
    "identificador_tributario" character varying(50) NOT NULL,
    "nombre_razon_social" character varying(150) NOT NULL,
    "nacionalidad_origen" character varying(80),
    "contacto_proveedor" character varying(150),
    "correo_proveedor" character varying(150),
    "telefono_proveedor" character varying(30),
    "direccion_proveedor" "text",
    "estado_proveedor" character varying(30) DEFAULT 'activo'::character varying NOT NULL,
    "fecha_registro" "date" DEFAULT CURRENT_DATE NOT NULL,
    "tipo_proveedor_m5" character varying(30) DEFAULT 'Ambos'::character varying NOT NULL,
    "condicion_pago_dias_m5" integer,
    "condicion_pago_tipo_m5" character varying(20),
    CONSTRAINT "chk_proveedor_condicion_pago_m5" CHECK (((("condicion_pago_dias_m5" IS NULL) AND ("condicion_pago_tipo_m5" IS NULL)) OR (("condicion_pago_dias_m5" >= 0) AND (("condicion_pago_tipo_m5")::"text" = ANY (ARRAY[('DIAS_CORRIDOS'::character varying)::"text", ('DIAS_HABILES'::character varying)::"text"]))))),
    CONSTRAINT "chk_proveedor_estado" CHECK ((("estado_proveedor")::"text" = ANY (ARRAY[('activo'::character varying)::"text", ('inactivo'::character varying)::"text", ('bloqueado'::character varying)::"text"]))),
    CONSTRAINT "chk_proveedor_tipo_m5" CHECK ((("tipo_proveedor_m5")::"text" = ANY (ARRAY[('Insumos/Materiales'::character varying)::"text", ('Servicios'::character varying)::"text", ('Ambos'::character varying)::"text"])))
);



ALTER TABLE "finanzas"."proveedor" ALTER COLUMN "id_proveedor" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."proveedor_id_proveedor_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."proyeccion_financiera_m7" (
    "id_proyeccion_financiera_m7" integer NOT NULL,
    "tipo" character varying(30) NOT NULL,
    "anio" integer NOT NULL,
    "mes" integer NOT NULL,
    "id_moneda" integer NOT NULL,
    "categoria" character varying(50) NOT NULL,
    "monto_proyectado" numeric(14,2) NOT NULL,
    "observacion" "text",
    "estado" character varying(20) DEFAULT 'activo'::character varying NOT NULL,
    "creado_por" bigint NOT NULL,
    "fecha_creacion" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizado_por" bigint,
    "fecha_actualizacion" timestamp(6) with time zone,
    CONSTRAINT "ck_proyeccion_m7_anio" CHECK ((("anio" >= 2000) AND ("anio" <= 2200))),
    CONSTRAINT "ck_proyeccion_m7_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('activo'::character varying)::"text", ('inactivo'::character varying)::"text"]))),
    CONSTRAINT "ck_proyeccion_m7_mes" CHECK ((("mes" >= 1) AND ("mes" <= 12))),
    CONSTRAINT "ck_proyeccion_m7_monto" CHECK (("monto_proyectado" >= (0)::numeric)),
    CONSTRAINT "ck_proyeccion_m7_tipo" CHECK ((("tipo")::"text" = ANY (ARRAY[('FLUJO_CAJA'::character varying)::"text", ('ESTADO_RESULTADOS'::character varying)::"text"])))
);



CREATE SEQUENCE "finanzas"."proyeccion_financiera_m7_id_proyeccion_financiera_m7_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."proyeccion_financiera_m7_id_proyeccion_financiera_m7_seq" OWNED BY "finanzas"."proyeccion_financiera_m7"."id_proyeccion_financiera_m7";



CREATE TABLE "finanzas"."proyecto_financiero" (
    "id_proyecto_financiero" integer NOT NULL,
    "id_ficha_cliente" integer NOT NULL,
    "id_nota_venta" integer,
    "id_proyecto_terreno" bigint,
    "id_moneda" integer NOT NULL,
    "codigo_proyecto_financiero" character varying(80) NOT NULL,
    "fecha_inicio_financiera" "date",
    "fecha_cierre_financiera" "date",
    "estado_financiero_proyecto" character varying(30) DEFAULT 'activo'::character varying NOT NULL,
    "monto_venta_estimado" numeric(14,2),
    "monto_costo_estimado" numeric(14,2),
    "monto_costo_real" numeric(14,2),
    "margen_estimado" numeric(14,2),
    "margen_real" numeric(14,2),
    "observacion_financiera" "text",
    CONSTRAINT "chk_proyecto_financiero_estado" CHECK ((("estado_financiero_proyecto")::"text" = ANY (ARRAY[('activo'::character varying)::"text", ('en_revision'::character varying)::"text", ('cerrado'::character varying)::"text", ('anulado'::character varying)::"text"]))),
    CONSTRAINT "chk_proyecto_financiero_montos" CHECK (((("monto_venta_estimado" IS NULL) OR ("monto_venta_estimado" >= (0)::numeric)) AND (("monto_costo_estimado" IS NULL) OR ("monto_costo_estimado" >= (0)::numeric)) AND (("monto_costo_real" IS NULL) OR ("monto_costo_real" >= (0)::numeric))))
);



ALTER TABLE "finanzas"."proyecto_financiero" ALTER COLUMN "id_proyecto_financiero" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."proyecto_financiero_id_proyecto_financiero_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."reclasificacion_egreso_m5" (
    "id_reclasificacion_m5" integer NOT NULL,
    "id_documento_m5" integer NOT NULL,
    "monto_total" numeric(14,2) NOT NULL,
    "monto_referencia_clp" numeric(14,2) NOT NULL,
    "umbral_snapshot_clp" numeric(14,2) NOT NULL,
    "motivo" "text" NOT NULL,
    "estado" character varying(20) NOT NULL,
    "solicitado_por" bigint NOT NULL,
    "fecha_solicitud" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "resuelto_por" bigint,
    "fecha_resolucion" timestamp with time zone,
    "motivo_rechazo" "text",
    CONSTRAINT "reclasificacion_egreso_m5_estado_check" CHECK ((("estado")::"text" = ANY (ARRAY[('pendiente'::character varying)::"text", ('aprobada'::character varying)::"text", ('rechazada'::character varying)::"text"]))),
    CONSTRAINT "reclasificacion_egreso_m5_monto_referencia_clp_check" CHECK (("monto_referencia_clp" > (0)::numeric)),
    CONSTRAINT "reclasificacion_egreso_m5_monto_total_check" CHECK (("monto_total" > (0)::numeric)),
    CONSTRAINT "reclasificacion_egreso_m5_umbral_snapshot_clp_check" CHECK (("umbral_snapshot_clp" >= (0)::numeric))
);



ALTER TABLE "finanzas"."reclasificacion_egreso_m5" ALTER COLUMN "id_reclasificacion_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."reclasificacion_egreso_m5_id_reclasificacion_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."rectificacion_orden_trabajo" (
    "id_rectificacion_ot" bigint NOT NULL,
    "id_unidad_fisica_ot" bigint NOT NULL,
    "id_empleado_rectificador" integer,
    "id_especificacion_puerta" bigint,
    "estado" character varying(50) DEFAULT 'PENDIENTE_RECTIFICACION'::character varying NOT NULL,
    "fecha_asignacion" timestamp(6) with time zone,
    "fecha_inicio" timestamp(6) with time zone,
    "fecha_rectificacion" "date",
    "observaciones_tecnicas" "text",
    "caracteristicas_particulares" "jsonb" DEFAULT '{}'::"jsonb" CONSTRAINT "rectificacion_orden_trabajo_caracteristicas_particular_not_null" NOT NULL,
    "necesita_tareas_adicionales" boolean DEFAULT false CONSTRAINT "rectificacion_orden_trabajo_necesita_tareas_adicionale_not_null" NOT NULL,
    "comentarios_fabricacion" "text",
    "comentarios_instalacion" "text",
    "revision" integer DEFAULT 1 NOT NULL,
    "asignado_por" bigint,
    "actualizado_por" bigint NOT NULL,
    "creado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "rectificacion_ot_estado_ck" CHECK ((("estado")::"text" = ANY (ARRAY[('PENDIENTE_RECTIFICACION'::character varying)::"text", ('RECTIFICACION_ASIGNADA'::character varying)::"text", ('RECTIFICACION_EN_PROCESO'::character varying)::"text", ('PENDIENTE_APROBACION_TECNICA'::character varying)::"text", ('RECTIFICACION_DEVUELTA'::character varying)::"text", ('RECTIFICACION_APROBADA'::character varying)::"text"])))
);



CREATE SEQUENCE "finanzas"."rectificacion_orden_trabajo_id_rectificacion_ot_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."rectificacion_orden_trabajo_id_rectificacion_ot_seq" OWNED BY "finanzas"."rectificacion_orden_trabajo"."id_rectificacion_ot";



CREATE TABLE "finanzas"."reduccion_compromiso_credito_m8" (
    "id_reduccion" integer NOT NULL,
    "id_compromiso" integer NOT NULL,
    "id_pago_cliente" integer NOT NULL,
    "monto_reduccion" numeric(14,2) NOT NULL,
    "fecha_reduccion" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "chk_reduccion_credito_m8_monto" CHECK (("monto_reduccion" > (0)::numeric))
);



CREATE SEQUENCE "finanzas"."reduccion_compromiso_credito_m8_id_reduccion_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."reduccion_compromiso_credito_m8_id_reduccion_seq" OWNED BY "finanzas"."reduccion_compromiso_credito_m8"."id_reduccion";



CREATE TABLE "finanzas"."regularizacion_extraordinaria" (
    "id_regularizacion" integer NOT NULL,
    "id_ajuste_posterior" integer NOT NULL,
    "monto" numeric(14,4) NOT NULL,
    "motivo" "text" NOT NULL,
    "estado" character varying(20) DEFAULT 'ABIERTA'::character varying NOT NULL,
    "creado_por" bigint NOT NULL,
    "creado_en" timestamp with time zone DEFAULT "now"() NOT NULL,
    "actualizado_por" bigint,
    "actualizado_en" timestamp with time zone,
    "cerrado_por" bigint,
    "cerrado_en" timestamp with time zone,
    CONSTRAINT "ck_regularizacion_cierre" CHECK ((((("estado")::"text" = 'CERRADA'::"text") AND ("cerrado_por" IS NOT NULL) AND ("cerrado_en" IS NOT NULL)) OR (("estado")::"text" = 'ABIERTA'::"text"))),
    CONSTRAINT "ck_regularizacion_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('ABIERTA'::character varying)::"text", ('CERRADA'::character varying)::"text"]))),
    CONSTRAINT "ck_regularizacion_monto" CHECK (("monto" > (0)::numeric)),
    CONSTRAINT "ck_regularizacion_motivo" CHECK (("length"(TRIM(BOTH FROM "motivo")) > 0))
);



CREATE SEQUENCE "finanzas"."regularizacion_extraordinaria_id_regularizacion_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."regularizacion_extraordinaria_id_regularizacion_seq" OWNED BY "finanzas"."regularizacion_extraordinaria"."id_regularizacion";



CREATE TABLE "finanzas"."relacion_laboral_empleado" (
    "id_relacion_laboral_empleado" integer NOT NULL,
    "id_empleado" integer NOT NULL,
    "fecha_inicio" "date" NOT NULL,
    "fecha_termino" "date",
    "estado" character varying(20) DEFAULT 'vigente'::character varying NOT NULL,
    "id_tipo_vinculo_laboral" integer,
    "jornada" character varying(80),
    CONSTRAINT "chk_relacion_laboral_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('vigente'::character varying)::"text", ('terminada'::character varying)::"text"]))),
    CONSTRAINT "chk_relacion_laboral_fechas" CHECK ((("fecha_termino" IS NULL) OR ("fecha_termino" >= "fecha_inicio")))
);



ALTER TABLE "finanzas"."relacion_laboral_empleado" ALTER COLUMN "id_relacion_laboral_empleado" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."relacion_laboral_empleado_id_relacion_laboral_empleado_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."remuneracion" (
    "id_remuneracion" integer NOT NULL,
    "id_periodo_remuneracion" integer NOT NULL,
    "id_empleado" integer NOT NULL,
    "estado" character varying(20) DEFAULT 'abierta'::character varying NOT NULL,
    "creado_por" bigint NOT NULL,
    "creado_en" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "reemplaza_a_id" integer,
    "calculado_en" timestamp with time zone,
    "calculado_por" bigint,
    "total_haberes" numeric(14,4),
    "total_deducciones" numeric(14,4),
    "total_aportes_empleador" numeric(14,4),
    "base_imponible" numeric(14,4),
    "base_tributable" numeric(14,4),
    "liquido_preliminar" numeric(14,4),
    "cerrado_en" timestamp with time zone,
    "cerrado_por" bigint,
    "reapertura_solicitada_en" timestamp with time zone,
    "reapertura_solicitada_por" bigint,
    "reapertura_motivo" "text",
    "reapertura_aprobada_en" timestamp with time zone,
    "reapertura_aprobada_por" bigint,
    "total_descuentos_previsionales" numeric(14,4),
    "total_impuesto" numeric(14,4),
    "total_otras_deducciones" numeric(14,4),
    "costo_empresa" numeric(14,4),
    "snapshot_previsional" "jsonb",
    CONSTRAINT "ck_remuneracion_aprobacion_reapertura" CHECK (((("reapertura_aprobada_en" IS NULL) AND ("reapertura_aprobada_por" IS NULL)) OR (("reapertura_aprobada_en" IS NOT NULL) AND ("reapertura_aprobada_por" IS NOT NULL) AND ("reapertura_solicitada_por" IS NOT NULL) AND ("reapertura_aprobada_por" <> "reapertura_solicitada_por")))),
    CONSTRAINT "ck_remuneracion_cierre" CHECK ((((("estado")::"text" = 'cerrada'::"text") AND ("cerrado_en" IS NOT NULL) AND ("cerrado_por" IS NOT NULL)) OR (("estado")::"text" <> 'cerrada'::"text"))),
    CONSTRAINT "ck_remuneracion_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('abierta'::character varying)::"text", ('cerrada'::character varying)::"text", ('reemplazada'::character varying)::"text"]))),
    CONSTRAINT "ck_remuneracion_reapertura" CHECK (((("reapertura_solicitada_en" IS NULL) AND ("reapertura_solicitada_por" IS NULL) AND ("reapertura_motivo" IS NULL)) OR (("reapertura_solicitada_en" IS NOT NULL) AND ("reapertura_solicitada_por" IS NOT NULL) AND ("length"(TRIM(BOTH FROM "reapertura_motivo")) > 0)))),
    CONSTRAINT "ck_remuneracion_reemplazo_orden" CHECK ((("reemplaza_a_id" IS NULL) OR ("reemplaza_a_id" < "id_remuneracion"))),
    CONSTRAINT "ck_remuneracion_totales_no_negativos" CHECK (((("total_haberes" IS NULL) OR ("total_haberes" >= (0)::numeric)) AND (("total_deducciones" IS NULL) OR ("total_deducciones" >= (0)::numeric)) AND (("total_aportes_empleador" IS NULL) OR ("total_aportes_empleador" >= (0)::numeric)) AND (("base_imponible" IS NULL) OR ("base_imponible" >= (0)::numeric)) AND (("base_tributable" IS NULL) OR ("base_tributable" >= (0)::numeric)) AND (("liquido_preliminar" IS NULL) OR ("liquido_preliminar" >= (0)::numeric))))
);



CREATE SEQUENCE "finanzas"."remuneracion_id_remuneracion_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."remuneracion_id_remuneracion_seq" OWNED BY "finanzas"."remuneracion"."id_remuneracion";



CREATE TABLE "finanzas"."resolucion_hallazgo_m11" (
    "id_resolucion_hallazgo_m11" bigint NOT NULL,
    "id_hallazgo" bigint NOT NULL,
    "decision" character varying(120) NOT NULL,
    "motivo" "text" NOT NULL,
    "respaldo" "text" NOT NULL,
    "resultado" "text" NOT NULL,
    "actor_id" bigint NOT NULL,
    "clave_idempotencia" character varying(120) NOT NULL,
    "creado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



CREATE SEQUENCE "finanzas"."resolucion_hallazgo_m11_id_resolucion_hallazgo_m11_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."resolucion_hallazgo_m11_id_resolucion_hallazgo_m11_seq" OWNED BY "finanzas"."resolucion_hallazgo_m11"."id_resolucion_hallazgo_m11";



CREATE TABLE "finanzas"."resolucion_solicitud_crediticia_m8" (
    "id_resolucion" integer NOT NULL,
    "id_solicitud_crediticia" integer CONSTRAINT "resolucion_solicitud_creditici_id_solicitud_crediticia_not_null" NOT NULL,
    "decision" character varying(20) NOT NULL,
    "motivo" "text" NOT NULL,
    "monto_cupo_aprobado" numeric(14,2),
    "vigencia_desde" "date",
    "vigencia_hasta" "date",
    "condiciones_aprobadas" "text",
    "id_usuario_responsable" bigint CONSTRAINT "resolucion_solicitud_crediticia_id_usuario_responsable_not_null" NOT NULL,
    "fecha_resolucion" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "chk_resolucion_crediticia_m8_cupo" CHECK ((("monto_cupo_aprobado" IS NULL) OR ("monto_cupo_aprobado" >= (0)::numeric))),
    CONSTRAINT "chk_resolucion_crediticia_m8_decision" CHECK ((("decision")::"text" = ANY (ARRAY[('APROBADA'::character varying)::"text", ('RECHAZADA'::character varying)::"text"])))
);



CREATE SEQUENCE "finanzas"."resolucion_solicitud_crediticia_m8_id_resolucion_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."resolucion_solicitud_crediticia_m8_id_resolucion_seq" OWNED BY "finanzas"."resolucion_solicitud_crediticia_m8"."id_resolucion";



CREATE TABLE "finanzas"."respaldo_gasto_caja_chica_m5" (
    "id_respaldo_gasto_m5" integer NOT NULL,
    "id_gasto_caja_chica_m5" integer NOT NULL,
    "nombre_archivo" character varying(255) NOT NULL,
    "contenido" "text" NOT NULL,
    "tipo_respaldo" character varying(40),
    "comercio_emisor" character varying(200),
    "adjuntado_por" bigint NOT NULL,
    "fecha_hora" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



ALTER TABLE "finanzas"."respaldo_gasto_caja_chica_m5" ALTER COLUMN "id_respaldo_gasto_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."respaldo_gasto_caja_chica_m5_id_respaldo_gasto_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."respaldo_pago_proveedor_m5" (
    "id_respaldo_pago_m5" integer NOT NULL,
    "nombre_archivo" character varying(255) NOT NULL,
    "contenido" "text" NOT NULL,
    "creado_por" bigint NOT NULL,
    "fecha_creacion" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



ALTER TABLE "finanzas"."respaldo_pago_proveedor_m5" ALTER COLUMN "id_respaldo_pago_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."respaldo_pago_proveedor_m5_id_respaldo_pago_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."reversion_compensacion_m5" (
    "id_reversion_compensacion_m5" integer NOT NULL,
    "id_detalle_compensacion_m5" integer NOT NULL,
    "monto_revertido" numeric(14,2) NOT NULL,
    "motivo" "text" NOT NULL,
    "id_respaldo_pago_m5" integer NOT NULL,
    "usuario_id_usuario" bigint NOT NULL,
    "fecha_hora" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "reversion_compensacion_m5_monto_revertido_check" CHECK (("monto_revertido" > (0)::numeric))
);



ALTER TABLE "finanzas"."reversion_compensacion_m5" ALTER COLUMN "id_reversion_compensacion_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."reversion_compensacion_m5_id_reversion_compensacion_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."reversion_movimiento_pago_m5" (
    "id_reversion_movimiento_m5" integer CONSTRAINT "reversion_movimiento_pago_m_id_reversion_movimiento_m5_not_null" NOT NULL,
    "id_movimiento_pago_m5" integer NOT NULL,
    "monto_revertido" numeric(14,2) NOT NULL,
    "motivo" "text" NOT NULL,
    "id_respaldo_pago_m5" integer NOT NULL,
    "usuario_id_usuario" bigint NOT NULL,
    "fecha_hora" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "chk_reversion_movimiento_pago_m5_monto" CHECK (("monto_revertido" > (0)::numeric))
);



ALTER TABLE "finanzas"."reversion_movimiento_pago_m5" ALTER COLUMN "id_reversion_movimiento_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."reversion_movimiento_pago_m5_id_reversion_movimiento_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."reversion_nota_venta" (
    "id_reversion_nota_venta" integer NOT NULL,
    "id_nota_venta" integer NOT NULL,
    "monto" numeric(14,2) NOT NULL,
    "fecha" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "motivo" "text" NOT NULL,
    "responsable" "text" NOT NULL,
    "folio_nota_credito" "text" NOT NULL,
    "respaldo_pdf" "text" NOT NULL,
    "destino_excedente" character varying(30),
    CONSTRAINT "chk_reversion_nv_monto" CHECK (("monto" > (0)::numeric)),
    CONSTRAINT "destino_excedente_valido" CHECK ((("destino_excedente" IS NULL) OR (("destino_excedente")::"text" = ANY (ARRAY[('devolucion'::character varying)::"text", ('saldo_favor'::character varying)::"text"]))))
);



CREATE SEQUENCE "finanzas"."reversion_nota_venta_id_reversion_nota_venta_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."reversion_nota_venta_id_reversion_nota_venta_seq" OWNED BY "finanzas"."reversion_nota_venta"."id_reversion_nota_venta";



CREATE TABLE "finanzas"."reversion_pago" (
    "id_reversion_pago" integer NOT NULL,
    "id_pago_cliente" integer NOT NULL,
    "monto" numeric(14,2) NOT NULL,
    "fecha" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "motivo" "text" NOT NULL,
    "responsable" "text" NOT NULL,
    "respaldo" "text" NOT NULL,
    CONSTRAINT "chk_reversion_pago_monto" CHECK (("monto" > (0)::numeric))
);



CREATE SEQUENCE "finanzas"."reversion_pago_id_reversion_pago_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."reversion_pago_id_reversion_pago_seq" OWNED BY "finanzas"."reversion_pago"."id_reversion_pago";



CREATE TABLE "finanzas"."reversion_pago_remuneracion" (
    "id_reversion_pago_remuneracion" integer CONSTRAINT "reversion_pago_remuneracion_id_reversion_pago_remunera_not_null" NOT NULL,
    "id_pago_remuneracion" integer NOT NULL,
    "monto" numeric(14,4) NOT NULL,
    "motivo" "text" NOT NULL,
    "registrado_por" bigint NOT NULL,
    "registrado_en" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "ck_reversion_pago_remuneracion_monto" CHECK (("monto" > (0)::numeric)),
    CONSTRAINT "ck_reversion_pago_remuneracion_motivo" CHECK (("length"(TRIM(BOTH FROM "motivo")) > 0))
);



CREATE SEQUENCE "finanzas"."reversion_pago_remuneracion_id_reversion_pago_remuneracion_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."reversion_pago_remuneracion_id_reversion_pago_remuneracion_seq" OWNED BY "finanzas"."reversion_pago_remuneracion"."id_reversion_pago_remuneracion";



CREATE TABLE "finanzas"."saldo_favor_cliente" (
    "id_saldo_favor_cliente" integer NOT NULL,
    "id_cliente_financiero" integer NOT NULL,
    "id_nota_venta" integer NOT NULL,
    "id_reversion_nota_venta" integer NOT NULL,
    "monto_original" numeric(14,2) NOT NULL,
    "monto_disponible" numeric(14,2) NOT NULL,
    "fecha" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "chk_saldo_favor_montos" CHECK ((("monto_original" > (0)::numeric) AND ("monto_disponible" >= (0)::numeric) AND ("monto_disponible" <= "monto_original")))
);



CREATE SEQUENCE "finanzas"."saldo_favor_cliente_id_saldo_favor_cliente_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."saldo_favor_cliente_id_saldo_favor_cliente_seq" OWNED BY "finanzas"."saldo_favor_cliente"."id_saldo_favor_cliente";



CREATE TABLE "finanzas"."saldo_favor_proveedor_m5" (
    "id_saldo_favor_m5" integer NOT NULL,
    "id_proveedor" integer NOT NULL,
    "id_ajuste_origen_m5" integer NOT NULL,
    "id_moneda" integer NOT NULL,
    "monto_generado" numeric(14,2) NOT NULL,
    "monto_disponible" numeric(14,2) NOT NULL,
    "estado" character varying(20) DEFAULT 'disponible'::character varying NOT NULL,
    "fecha_creacion" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "chk_saldo_favor_m5_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('disponible'::character varying)::"text", ('agotado'::character varying)::"text", ('anulado'::character varying)::"text"]))),
    CONSTRAINT "chk_saldo_favor_m5_montos" CHECK ((("monto_generado" > (0)::numeric) AND ("monto_disponible" >= (0)::numeric) AND ("monto_disponible" <= "monto_generado")))
);



ALTER TABLE "finanzas"."saldo_favor_proveedor_m5" ALTER COLUMN "id_saldo_favor_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."saldo_favor_proveedor_m5_id_saldo_favor_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."saldo_inicial_bancario_m7" (
    "id_saldo_inicial_bancario_m7" integer NOT NULL,
    "id_cuenta_bancaria_m7" integer NOT NULL,
    "fecha_corte" "date" NOT NULL,
    "saldo_inicial" numeric(14,2) NOT NULL,
    "observacion" "text" NOT NULL,
    "estado" character varying(20) DEFAULT 'activo'::character varying NOT NULL,
    "creado_por" bigint NOT NULL,
    "fecha_creacion" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizado_por" bigint,
    "fecha_actualizacion" timestamp(6) with time zone,
    CONSTRAINT "chk_saldo_inicial_bancario_m7_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('activo'::character varying)::"text", ('inactivo'::character varying)::"text"]))),
    CONSTRAINT "chk_saldo_inicial_bancario_m7_observacion" CHECK (("length"("btrim"("observacion")) > 0))
);



CREATE SEQUENCE "finanzas"."saldo_inicial_bancario_m7_id_saldo_inicial_bancario_m7_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."saldo_inicial_bancario_m7_id_saldo_inicial_bancario_m7_seq" OWNED BY "finanzas"."saldo_inicial_bancario_m7"."id_saldo_inicial_bancario_m7";



CREATE TABLE "finanzas"."servicio_comercial" (
    "id_servicio_comercial" bigint NOT NULL,
    "codigo" character varying(50) NOT NULL,
    "nombre" character varying(160) NOT NULL,
    "descripcion" "text",
    "unidad_cobro" character varying(40) NOT NULL,
    "habilitado_b2b" boolean DEFAULT true NOT NULL,
    "habilitado_b2c" boolean DEFAULT false NOT NULL,
    "estado" character varying(20) DEFAULT 'ACTIVO'::character varying NOT NULL,
    "revision" integer DEFAULT 1 NOT NULL,
    "creado_por" bigint NOT NULL,
    "creado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "ck_servicio_comercial_codigo" CHECK ((("codigo")::"text" ~ '^[A-Z0-9][A-Z0-9._-]{1,49}$'::"text")),
    CONSTRAINT "ck_servicio_comercial_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('ACTIVO'::character varying)::"text", ('INACTIVO'::character varying)::"text"]))),
    CONSTRAINT "ck_servicio_comercial_nombre" CHECK (("btrim"(("nombre")::"text") <> ''::"text")),
    CONSTRAINT "ck_servicio_comercial_revision" CHECK (("revision" > 0)),
    CONSTRAINT "ck_servicio_comercial_unidad" CHECK ((("unidad_cobro")::"text" = ANY (ARRAY[('UNIDAD'::character varying)::"text", ('VIAJE'::character varying)::"text", ('TRAMO'::character varying)::"text", ('HORA'::character varying)::"text", ('JORNADA'::character varying)::"text", ('GLOBAL'::character varying)::"text"])))
);



CREATE SEQUENCE "finanzas"."servicio_comercial_id_servicio_comercial_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."servicio_comercial_id_servicio_comercial_seq" OWNED BY "finanzas"."servicio_comercial"."id_servicio_comercial";



CREATE TABLE "finanzas"."solicitud_correccion_tecnica_ot" (
    "id_solicitud_correccion" bigint CONSTRAINT "solicitud_correccion_tecnica_o_id_solicitud_correccion_not_null" NOT NULL,
    "id_unidad_fisica_ot" bigint NOT NULL,
    "id_version_base" bigint NOT NULL,
    "medida_original" "jsonb" NOT NULL,
    "medida_propuesta" "jsonb" NOT NULL,
    "motivo" "text" NOT NULL,
    "solicitado_por" bigint NOT NULL,
    "solicitado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



CREATE SEQUENCE "finanzas"."solicitud_correccion_tecnica_ot_id_solicitud_correccion_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."solicitud_correccion_tecnica_ot_id_solicitud_correccion_seq" OWNED BY "finanzas"."solicitud_correccion_tecnica_ot"."id_solicitud_correccion";



CREATE TABLE "finanzas"."solicitud_crediticia_m8" (
    "id_solicitud_crediticia" integer NOT NULL,
    "id_ficha_cliente" integer NOT NULL,
    "tipo_solicitud" character varying(20) NOT NULL,
    "estado_solicitud" character varying(20) DEFAULT 'BORRADOR'::character varying NOT NULL,
    "id_usuario_solicitante" bigint,
    "id_cotizacion" integer,
    "id_nota_venta" integer,
    "referencia_contexto" character varying(120),
    "antecedentes_resumen" "text",
    "fecha_creacion" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "fecha_actualizacion" timestamp(6) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "motivo_solicitud" "text",
    "condiciones_solicitadas" "text",
    CONSTRAINT "chk_solicitud_crediticia_m8_estado" CHECK ((("estado_solicitud")::"text" = ANY (ARRAY[('BORRADOR'::character varying)::"text", ('PENDIENTE'::character varying)::"text", ('APROBADA'::character varying)::"text", ('RECHAZADA'::character varying)::"text", ('CANCELADA'::character varying)::"text"]))),
    CONSTRAINT "chk_solicitud_crediticia_m8_tipo" CHECK ((("tipo_solicitud")::"text" = ANY (ARRAY[('INICIAL'::character varying)::"text", ('EXCEPCION'::character varying)::"text"])))
);



CREATE SEQUENCE "finanzas"."solicitud_crediticia_m8_id_solicitud_crediticia_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."solicitud_crediticia_m8_id_solicitud_crediticia_seq" OWNED BY "finanzas"."solicitud_crediticia_m8"."id_solicitud_crediticia";



CREATE TABLE "finanzas"."solicitud_reasignacion_costo_m5" (
    "id_solicitud_reasignacion_m5" integer CONSTRAINT "solicitud_reasignacion_cost_id_solicitud_reasignacion__not_null" NOT NULL,
    "id_detalle_origen_m5" integer NOT NULL,
    "monto_total" numeric(14,2) NOT NULL,
    "motivo" "text" NOT NULL,
    "estado" character varying(20) DEFAULT 'pendiente'::character varying NOT NULL,
    "excepcional_proyecto_cerrado" boolean DEFAULT false CONSTRAINT "solicitud_reasignacion_cost_excepcional_proyecto_cerra_not_null" NOT NULL,
    "justificacion_excepcion" "text",
    "solicitado_por" bigint NOT NULL,
    "fecha_solicitud" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "resuelto_por" bigint,
    "fecha_resolucion" timestamp with time zone,
    "motivo_rechazo" "text",
    CONSTRAINT "solicitud_reasignacion_costo_m5_estado_check" CHECK ((("estado")::"text" = ANY (ARRAY[('pendiente'::character varying)::"text", ('aprobada'::character varying)::"text", ('rechazada'::character varying)::"text"]))),
    CONSTRAINT "solicitud_reasignacion_costo_m5_monto_total_check" CHECK (("monto_total" > (0)::numeric))
);



ALTER TABLE "finanzas"."solicitud_reasignacion_costo_m5" ALTER COLUMN "id_solicitud_reasignacion_m5" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."solicitud_reasignacion_costo_m_id_solicitud_reasignacion_m5_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."tarea_catalogada" (
    "id_tarea_catalogada" integer NOT NULL,
    "nombre_tarea" character varying(120) NOT NULL,
    "descripcion_tarea" "text",
    "estado_tarea" character varying(30) DEFAULT 'activa'::character varying NOT NULL,
    CONSTRAINT "chk_tarea_catalogada_estado" CHECK ((("estado_tarea")::"text" = ANY (ARRAY[('activa'::character varying)::"text", ('inactiva'::character varying)::"text"])))
);



ALTER TABLE "finanzas"."tarea_catalogada" ALTER COLUMN "id_tarea_catalogada" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."tarea_catalogada_id_tarea_catalogada_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."tarea_ejecutable_unidad_ot" (
    "id_tarea_ejecutable_ot" bigint NOT NULL,
    "id_unidad_fisica_ot" bigint NOT NULL,
    "id_version_rectificacion" bigint NOT NULL,
    "id_tarea" bigint NOT NULL,
    "id_etapa_planificacion" character varying(120) NOT NULL,
    "id_tarea_planificacion" character varying(120) NOT NULL,
    "orden_etapa" integer NOT NULL,
    "orden_tarea" integer NOT NULL,
    "id_empleado_planificado" integer,
    "creado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "origen" character varying(30) DEFAULT 'PLAN_APROBADO'::character varying NOT NULL,
    "id_etapa_adicional_ot" bigint,
    "clave_idempotencia" character varying(120),
    "id_tarea_origen_correctiva" bigint,
    CONSTRAINT "ck_tarea_ejecutable_origen" CHECK ((("origen")::"text" = ANY (ARRAY[('PLAN_APROBADO'::character varying)::"text", ('TAREA_ADICIONAL'::character varying)::"text", ('ETAPA_ADICIONAL'::character varying)::"text", ('CORRECTIVA'::character varying)::"text"]))),
    CONSTRAINT "tarea_ejecutable_orden_ck" CHECK ((("orden_etapa" > 0) AND ("orden_tarea" > 0)))
);



CREATE SEQUENCE "finanzas"."tarea_ejecutable_unidad_ot_id_tarea_ejecutable_ot_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."tarea_ejecutable_unidad_ot_id_tarea_ejecutable_ot_seq" OWNED BY "finanzas"."tarea_ejecutable_unidad_ot"."id_tarea_ejecutable_ot";



CREATE TABLE "finanzas"."tarea_remunerable" (
    "id_tarea_remunerable" integer NOT NULL,
    "rut_empleado" character varying(15) NOT NULL,
    "id_historial_tarifa_tarea" integer NOT NULL,
    "id_proyecto_financiero" integer,
    "id_liquidacion_remuneracion" integer,
    "id_orden_trabajo" bigint,
    "fecha_tarea" "date" NOT NULL,
    "cantidad_realizada" numeric(12,2) NOT NULL,
    "estado_validacion" character varying(30) DEFAULT 'pendiente'::character varying NOT NULL,
    "monto_calculado" numeric(14,2) DEFAULT 0 NOT NULL,
    "referencia_unidad_terminada" character varying(100),
    "observacion" "text",
    CONSTRAINT "chk_tarea_remunerable_cantidad" CHECK (("cantidad_realizada" > (0)::numeric)),
    CONSTRAINT "chk_tarea_remunerable_estado" CHECK ((("estado_validacion")::"text" = ANY (ARRAY[('pendiente'::character varying)::"text", ('validada'::character varying)::"text", ('rechazada'::character varying)::"text", ('anulada'::character varying)::"text"]))),
    CONSTRAINT "chk_tarea_remunerable_monto" CHECK (("monto_calculado" >= (0)::numeric))
);



ALTER TABLE "finanzas"."tarea_remunerable" ALTER COLUMN "id_tarea_remunerable" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."tarea_remunerable_id_tarea_remunerable_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."tarifa_esquema_remuneracional" (
    "id_tarifa_esquema" integer NOT NULL,
    "id_esquema" integer NOT NULL,
    "modalidad" character varying(20) NOT NULL,
    "valor" numeric(14,4),
    "regla_tipo" character varying(40),
    "referencia" character varying(120),
    "vigencia_desde" "date" NOT NULL,
    "vigencia_hasta" "date",
    "es_excepcion" boolean DEFAULT false NOT NULL,
    "estado_revision" character varying(20) DEFAULT 'pendiente'::character varying NOT NULL,
    "causa_bloqueo" "text",
    "unidad" character varying(30),
    "tipo_aplicacion" character varying(20),
    CONSTRAINT "chk_tarifa_estado_revision" CHECK ((("estado_revision")::"text" = ANY (ARRAY[('pendiente'::character varying)::"text", ('activa'::character varying)::"text", ('bloqueada'::character varying)::"text"]))),
    CONSTRAINT "chk_tarifa_modalidad" CHECK ((("modalidad")::"text" = ANY (ARRAY[('FIJO'::character varying)::"text", ('PORCENTAJE'::character varying)::"text", ('REGLA'::character varying)::"text"]))),
    CONSTRAINT "chk_tarifa_valor" CHECK ((("valor" IS NULL) OR ("valor" >= (0)::numeric))),
    CONSTRAINT "chk_tarifa_vigencia" CHECK ((("vigencia_hasta" IS NULL) OR ("vigencia_hasta" >= "vigencia_desde"))),
    CONSTRAINT "ck_tarifa_esquema_aplicacion_unidad" CHECK ((("tipo_aplicacion" IS NULL) OR ((("tipo_aplicacion")::"text" = 'global'::"text") AND ("unidad" IS NULL)) OR ((("tipo_aplicacion")::"text" = 'por_unidad'::"text") AND ("unidad" IS NOT NULL)))),
    CONSTRAINT "ck_tarifa_esquema_tipo_aplicacion" CHECK ((("tipo_aplicacion" IS NULL) OR (("tipo_aplicacion")::"text" = ANY (ARRAY[('global'::character varying)::"text", ('por_unidad'::character varying)::"text"]))))
);



ALTER TABLE "finanzas"."tarifa_esquema_remuneracional" ALTER COLUMN "id_tarifa_esquema" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."tarifa_esquema_remuneracional_id_tarifa_esquema_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."tarifa_instalacion_comercial" (
    "id_tarifa_instalacion_comercial" bigint CONSTRAINT "tarifa_instalacion_comercia_id_tarifa_instalacion_come_not_null" NOT NULL,
    "alcance_geografico" character varying(20) NOT NULL,
    "region" character varying(120) NOT NULL,
    "region_normalizada" character varying(120) NOT NULL,
    "ciudad" character varying(120),
    "comuna" character varying(120),
    "comuna_normalizada" character varying(120),
    "estado_cobertura" character varying(30) NOT NULL,
    "id_moneda" integer,
    "precio_comercial" numeric(14,2),
    "vigencia_desde" "date" NOT NULL,
    "vigencia_hasta" "date",
    "condiciones" "text",
    "observaciones" "text",
    "estado" character varying(20) DEFAULT 'ACTIVA'::character varying NOT NULL,
    "revision" integer DEFAULT 1 NOT NULL,
    "creado_por" bigint NOT NULL,
    "creado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "ck_tarifa_instalacion_alcance" CHECK ((("alcance_geografico")::"text" = ANY (ARRAY[('COMUNA'::character varying)::"text", ('REGION'::character varying)::"text"]))),
    CONSTRAINT "ck_tarifa_instalacion_cobertura" CHECK ((("estado_cobertura")::"text" = ANY (ARRAY[('DISPONIBLE'::character varying)::"text", ('NO_DISPONIBLE'::character varying)::"text", ('REQUIERE_EVALUACION'::character varying)::"text"]))),
    CONSTRAINT "ck_tarifa_instalacion_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('ACTIVA'::character varying)::"text", ('INACTIVA'::character varying)::"text"]))),
    CONSTRAINT "ck_tarifa_instalacion_geografia" CHECK ((((("alcance_geografico")::"text" = 'COMUNA'::"text") AND ("comuna" IS NOT NULL) AND ("comuna_normalizada" IS NOT NULL)) OR ((("alcance_geografico")::"text" = 'REGION'::"text") AND ("comuna" IS NULL) AND ("comuna_normalizada" IS NULL)))),
    CONSTRAINT "ck_tarifa_instalacion_precio" CHECK ((((("estado_cobertura")::"text" = 'DISPONIBLE'::"text") AND ("precio_comercial" IS NOT NULL) AND ("precio_comercial" > (0)::numeric) AND ("id_moneda" IS NOT NULL)) OR ((("estado_cobertura")::"text" <> 'DISPONIBLE'::"text") AND ("precio_comercial" IS NULL) AND ("id_moneda" IS NULL)))),
    CONSTRAINT "ck_tarifa_instalacion_revision" CHECK (("revision" > 0)),
    CONSTRAINT "ck_tarifa_instalacion_vigencia" CHECK ((("vigencia_hasta" IS NULL) OR ("vigencia_hasta" >= "vigencia_desde")))
);



CREATE SEQUENCE "finanzas"."tarifa_instalacion_comercial_id_tarifa_instalacion_comercia_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."tarifa_instalacion_comercial_id_tarifa_instalacion_comercia_seq" OWNED BY "finanzas"."tarifa_instalacion_comercial"."id_tarifa_instalacion_comercial";



ALTER TABLE "finanzas"."tipo_cliente_financiero" ALTER COLUMN "id_tipo_cliente_financiero" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."tipo_cliente_financiero_id_tipo_cliente_financiero_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."tipo_documento" (
    "id_tipo_documento" integer NOT NULL,
    "nombre_tipo_documento" character varying(80) NOT NULL,
    "descripcion_tipo_documento" "text",
    "aplica_venta" boolean DEFAULT false NOT NULL,
    "aplica_compra" boolean DEFAULT false NOT NULL,
    "requiere_vencimiento" boolean DEFAULT false NOT NULL,
    "afecta_impuesto" boolean DEFAULT true NOT NULL,
    "estado_tipo_documento" character varying(20) DEFAULT 'activo'::character varying NOT NULL,
    CONSTRAINT "chk_tipo_documento_aplica" CHECK (("aplica_venta" OR "aplica_compra")),
    CONSTRAINT "chk_tipo_documento_estado" CHECK ((("estado_tipo_documento")::"text" = ANY (ARRAY[('activo'::character varying)::"text", ('inactivo'::character varying)::"text"])))
);



ALTER TABLE "finanzas"."tipo_documento" ALTER COLUMN "id_tipo_documento" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."tipo_documento_id_tipo_documento_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."tipo_identificador" (
    "id_tipo_identificador" integer NOT NULL,
    "nombre_tipo_identificador" character varying(80) NOT NULL,
    "descripcion_tipo_identificador" "text",
    "estado_tipo_identificador" character varying(20) DEFAULT 'activo'::character varying NOT NULL,
    CONSTRAINT "chk_tipo_identificador_estado" CHECK ((("estado_tipo_identificador")::"text" = ANY (ARRAY[('activo'::character varying)::"text", ('inactivo'::character varying)::"text"])))
);



ALTER TABLE "finanzas"."tipo_identificador" ALTER COLUMN "id_tipo_identificador" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."tipo_identificador_id_tipo_identificador_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."tipo_vinculo_laboral" (
    "id_tipo_vinculo_laboral" integer NOT NULL,
    "nombre_tipo_vinculo_laboral" character varying(80) NOT NULL,
    "descripcion_tipo_vinculo_laboral" "text",
    "estado_tipo_vinculo_laboral" character varying(20) DEFAULT 'activo'::character varying NOT NULL,
    CONSTRAINT "chk_tipo_vinculo_laboral_estado" CHECK ((("estado_tipo_vinculo_laboral")::"text" = ANY (ARRAY[('activo'::character varying)::"text", ('inactivo'::character varying)::"text"])))
);



ALTER TABLE "finanzas"."tipo_vinculo_laboral" ALTER COLUMN "id_tipo_vinculo_laboral" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "finanzas"."tipo_vinculo_laboral_id_tipo_vinculo_laboral_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."tramo_impuesto_renta" (
    "id_tramo_impuesto_renta" integer NOT NULL,
    "vigencia_desde" "date" NOT NULL,
    "vigencia_hasta" "date",
    "orden" integer NOT NULL,
    "limite_desde" numeric(18,6) NOT NULL,
    "limite_hasta" numeric(18,6),
    "factor" numeric(18,8) NOT NULL,
    "rebaja" numeric(18,6) NOT NULL,
    "unidad" character varying(30) NOT NULL,
    "fuente" character varying(200),
    "referencia" character varying(300),
    "estado" character varying(20) DEFAULT 'activo'::character varying NOT NULL,
    CONSTRAINT "chk_tramo_impuesto_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('activo'::character varying)::"text", ('inactivo'::character varying)::"text"]))),
    CONSTRAINT "chk_tramo_impuesto_limites" CHECK ((("limite_hasta" IS NULL) OR ("limite_hasta" >= "limite_desde"))),
    CONSTRAINT "chk_tramo_impuesto_numeros" CHECK ((("orden" > 0) AND ("limite_desde" >= (0)::numeric) AND ("factor" >= (0)::numeric) AND ("rebaja" >= (0)::numeric))),
    CONSTRAINT "chk_tramo_impuesto_vigencia" CHECK ((("vigencia_hasta" IS NULL) OR ("vigencia_hasta" >= "vigencia_desde")))
);



ALTER TABLE "finanzas"."tramo_impuesto_renta" ALTER COLUMN "id_tramo_impuesto_renta" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "finanzas"."tramo_impuesto_renta_id_tramo_impuesto_renta_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "finanzas"."tratamiento_privacidad_m9" (
    "id_tratamiento_m9" integer NOT NULL,
    "id_evento_m9" integer NOT NULL,
    "id_politica_m9" integer NOT NULL,
    "accion" character varying(20) NOT NULL,
    "estado" character varying(30) NOT NULL,
    "correlacion_anonima" character varying(160),
    "aplicado_en" timestamp(6) with time zone NOT NULL,
    "evidencia_terminal_id" integer,
    CONSTRAINT "chk_m9_tratamiento_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('APLICADO'::character varying)::"text", ('BLOQUEADO'::character varying)::"text", ('DEPENDENCIA_OWNER'::character varying)::"text"])))
);



CREATE SEQUENCE "finanzas"."tratamiento_privacidad_m9_id_tratamiento_m9_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."tratamiento_privacidad_m9_id_tratamiento_m9_seq" OWNED BY "finanzas"."tratamiento_privacidad_m9"."id_tratamiento_m9";



CREATE TABLE "finanzas"."tratamiento_remuneracional_ejecucion" (
    "id_tratamiento_remuneracional" integer CONSTRAINT "tratamiento_remuneracional__id_tratamiento_remuneracio_not_null" NOT NULL,
    "id_ejecucion_tarea" bigint CONSTRAINT "tratamiento_remuneracional_ejecucio_id_ejecucion_tarea_not_null" NOT NULL,
    "id_empleado" integer,
    "estado_remunerabilidad" character varying(30) DEFAULT 'pendiente'::character varying CONSTRAINT "tratamiento_remuneracional_ejec_estado_remunerabilidad_not_null" NOT NULL,
    "estado_valorizacion" character varying(30) DEFAULT 'pendiente'::character varying CONSTRAINT "tratamiento_remuneracional_ejecuci_estado_valorizacion_not_null" NOT NULL,
    "motivo" "text",
    "id_esquema" integer,
    "id_tarifa" integer,
    "valor_propuesto" numeric(14,4),
    "creado_en" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizado_en" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "ck_tratamiento_remunerabilidad" CHECK ((("estado_remunerabilidad")::"text" = ANY (ARRAY[('pendiente'::character varying)::"text", ('remunerable'::character varying)::"text", ('no_remunerable'::character varying)::"text", ('conflicto'::character varying)::"text"]))),
    CONSTRAINT "ck_tratamiento_valor" CHECK ((("valor_propuesto" IS NULL) OR ("valor_propuesto" >= (0)::numeric))),
    CONSTRAINT "ck_tratamiento_valorizacion" CHECK ((("estado_valorizacion")::"text" = ANY (ARRAY[('pendiente'::character varying)::"text", ('valorizado'::character varying)::"text", ('conflicto'::character varying)::"text", ('no_aplica'::character varying)::"text"])))
);



CREATE SEQUENCE "finanzas"."tratamiento_remuneracional_ej_id_tratamiento_remuneracional_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."tratamiento_remuneracional_ej_id_tratamiento_remuneracional_seq" OWNED BY "finanzas"."tratamiento_remuneracional_ejecucion"."id_tratamiento_remuneracional";



CREATE TABLE "finanzas"."unidad_fisica_orden_trabajo" (
    "id_unidad_fisica_ot" bigint NOT NULL,
    "id_cotizacion" integer NOT NULL,
    "id_detalle_cotizacion" integer NOT NULL,
    "id_extension_producto_comercial" integer CONSTRAINT "unidad_fisica_orden_trabajo_id_extension_producto_come_not_null" NOT NULL,
    "id_familia_producto_comercial" integer CONSTRAINT "unidad_fisica_orden_trabajo_id_familia_producto_comerc_not_null" NOT NULL,
    "numero_unidad" integer NOT NULL,
    "id_version_plantilla" integer NOT NULL,
    "id_orden_trabajo" bigint NOT NULL,
    "estado" character varying(40) DEFAULT 'PENDIENTE_RECTIFICACION'::character varying NOT NULL,
    "planificacion_inicial" "jsonb" NOT NULL,
    "planificacion_actual" "jsonb" NOT NULL,
    "revision" integer DEFAULT 1 NOT NULL,
    "creado_por" bigint NOT NULL,
    "creado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "actualizado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "unidad_fisica_ot_estado_ck" CHECK ((("estado")::"text" = ANY (ARRAY[('PENDIENTE_RECTIFICACION'::character varying)::"text", ('RECTIFICACION_ASIGNADA'::character varying)::"text", ('RECTIFICACION_EN_PROCESO'::character varying)::"text", ('PENDIENTE_APROBACION_TECNICA'::character varying)::"text", ('RECTIFICACION_DEVUELTA'::character varying)::"text", ('RECTIFICACION_APROBADA'::character varying)::"text", ('RECTIFICADA'::character varying)::"text", ('LIBERADA'::character varying)::"text", ('FINALIZADA'::character varying)::"text", ('CANCELADA'::character varying)::"text"]))),
    CONSTRAINT "unidad_fisica_ot_numero_ck" CHECK (("numero_unidad" > 0))
);



CREATE SEQUENCE "finanzas"."unidad_fisica_orden_trabajo_id_unidad_fisica_ot_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."unidad_fisica_orden_trabajo_id_unidad_fisica_ot_seq" OWNED BY "finanzas"."unidad_fisica_orden_trabajo"."id_unidad_fisica_ot";



CREATE VIEW "finanzas"."v_ficha_cliente_movimientos" AS
 SELECT "fc"."id_ficha_cliente",
    "cf"."id_cliente_financiero",
    "cf"."rut_cliente",
    'nota_venta'::"text" AS "tipo_origen",
    "nv"."id_nota_venta" AS "id_origen",
    ("nv"."fecha_emision")::timestamp without time zone AS "fecha_movimiento",
    "nv"."estado_nota_venta" AS "estado",
    "nv"."monto_total" AS "monto",
    "nv"."observacion" AS "descripcion"
   FROM (("finanzas"."ficha_cliente" "fc"
     JOIN "finanzas"."cliente_financiero" "cf" ON (("cf"."id_cliente_financiero" = "fc"."id_cliente_financiero")))
     JOIN "finanzas"."nota_venta" "nv" ON (("nv"."id_ficha_cliente" = "fc"."id_ficha_cliente")))
UNION ALL
 SELECT "fc"."id_ficha_cliente",
    "cf"."id_cliente_financiero",
    "cf"."rut_cliente",
    'documento_tributario'::"text" AS "tipo_origen",
    "dt"."id_documento_tributario" AS "id_origen",
    ("dt"."fecha_emision")::timestamp without time zone AS "fecha_movimiento",
    "dt"."estado_documento" AS "estado",
    "dt"."monto_total" AS "monto",
    "dt"."observacion" AS "descripcion"
   FROM (("finanzas"."ficha_cliente" "fc"
     JOIN "finanzas"."cliente_financiero" "cf" ON (("cf"."id_cliente_financiero" = "fc"."id_cliente_financiero")))
     JOIN "finanzas"."documento_tributario" "dt" ON (("dt"."id_ficha_cliente" = "fc"."id_ficha_cliente")))
UNION ALL
 SELECT "fc"."id_ficha_cliente",
    "cf"."id_cliente_financiero",
    "cf"."rut_cliente",
    'pago_cliente'::"text" AS "tipo_origen",
    "pc"."id_pago_cliente" AS "id_origen",
    ("pc"."fecha_pago")::timestamp without time zone AS "fecha_movimiento",
    "pc"."estado_verificacion" AS "estado",
    "pc"."monto_pago" AS "monto",
    "pc"."observacion" AS "descripcion"
   FROM (("finanzas"."ficha_cliente" "fc"
     JOIN "finanzas"."cliente_financiero" "cf" ON (("cf"."id_cliente_financiero" = "fc"."id_cliente_financiero")))
     JOIN "finanzas"."pago_cliente" "pc" ON (("pc"."id_ficha_cliente" = "fc"."id_ficha_cliente")))
UNION ALL
 SELECT "fc"."id_ficha_cliente",
    "cf"."id_cliente_financiero",
    "cf"."rut_cliente",
    'proyecto_financiero'::"text" AS "tipo_origen",
    "pf"."id_proyecto_financiero" AS "id_origen",
    ("pf"."fecha_inicio_financiera")::timestamp without time zone AS "fecha_movimiento",
    "pf"."estado_financiero_proyecto" AS "estado",
    COALESCE("pf"."monto_venta_estimado", (0)::numeric) AS "monto",
    "pf"."observacion_financiera" AS "descripcion"
   FROM (("finanzas"."ficha_cliente" "fc"
     JOIN "finanzas"."cliente_financiero" "cf" ON (("cf"."id_cliente_financiero" = "fc"."id_cliente_financiero")))
     JOIN "finanzas"."proyecto_financiero" "pf" ON (("pf"."id_ficha_cliente" = "fc"."id_ficha_cliente")))
UNION ALL
 SELECT "fc"."id_ficha_cliente",
    "cf"."id_cliente_financiero",
    "cf"."rut_cliente",
    'evaluacion_credito'::"text" AS "tipo_origen",
    "ec"."id_evaluacion_credito" AS "id_origen",
    ("ec"."fecha_evaluacion")::timestamp without time zone AS "fecha_movimiento",
    "ec"."estado_evaluacion" AS "estado",
    "ec"."puntaje_riesgo" AS "monto",
    "ec"."resultado_evaluacion" AS "descripcion"
   FROM (("finanzas"."ficha_cliente" "fc"
     JOIN "finanzas"."cliente_financiero" "cf" ON (("cf"."id_cliente_financiero" = "fc"."id_cliente_financiero")))
     JOIN "finanzas"."evaluacion_credito" "ec" ON (("ec"."id_ficha_cliente" = "fc"."id_ficha_cliente")));



CREATE VIEW "finanzas"."v_ficha_cliente_resumen" AS
 SELECT "fc"."id_ficha_cliente",
    "cf"."id_cliente_financiero",
    "cf"."rut_cliente",
    "cf"."nombre_razon_social_referencia",
    "cf"."contacto_financiero",
    "cf"."correo_financiero",
    "cf"."telefono_financiero",
    "tcf"."nombre_tipo_cliente_financiero",
    "fc"."estado_ficha",
    "fc"."fecha_creacion",
    "fc"."fecha_ultima_revision",
    "fc"."observacion_financiera_general",
    COALESCE("nv"."cantidad_notas_venta", (0)::bigint) AS "cantidad_notas_venta",
    COALESCE("nv"."total_notas_venta", (0)::numeric) AS "total_notas_venta",
    COALESCE("dt"."cantidad_documentos", (0)::bigint) AS "cantidad_documentos_tributarios",
    COALESCE("dt"."total_documentos", (0)::numeric) AS "total_documentos_tributarios",
    COALESCE("pc"."cantidad_pagos_cliente", (0)::bigint) AS "cantidad_pagos_cliente",
    COALESCE("pc"."total_pagado_cliente", (0)::numeric) AS "total_pagado_cliente",
    COALESCE("pf"."cantidad_proyectos_financieros", (0)::bigint) AS "cantidad_proyectos_financieros",
    COALESCE("pf"."total_costo_real", (0)::numeric) AS "total_costo_real_proyectos",
    COALESCE("ec"."cantidad_evaluaciones_credito", (0)::bigint) AS "cantidad_evaluaciones_credito",
    "lc"."monto_limite" AS "limite_credito_vigente",
    "lc"."estado_limite" AS "estado_limite_credito",
    COALESCE("cp"."cantidad_creditos", (0)::bigint) AS "cantidad_creditos_proyecto",
    COALESCE("cp"."total_creditos", (0)::numeric) AS "total_creditos_proyecto",
    COALESCE("al"."cantidad_alertas", (0)::bigint) AS "cantidad_alertas_financieras"
   FROM (((((((((("finanzas"."ficha_cliente" "fc"
     JOIN "finanzas"."cliente_financiero" "cf" ON (("cf"."id_cliente_financiero" = "fc"."id_cliente_financiero")))
     LEFT JOIN "finanzas"."tipo_cliente_financiero" "tcf" ON (("tcf"."id_tipo_cliente_financiero" = "cf"."id_tipo_cliente_financiero")))
     LEFT JOIN ( SELECT "nota_venta"."id_ficha_cliente",
            "count"(*) AS "cantidad_notas_venta",
            "sum"("nota_venta"."monto_total") AS "total_notas_venta"
           FROM "finanzas"."nota_venta"
          WHERE (("nota_venta"."estado_nota_venta")::"text" <> 'anulada'::"text")
          GROUP BY "nota_venta"."id_ficha_cliente") "nv" ON (("nv"."id_ficha_cliente" = "fc"."id_ficha_cliente")))
     LEFT JOIN ( SELECT "documento_tributario"."id_ficha_cliente",
            "count"(*) AS "cantidad_documentos",
            "sum"("documento_tributario"."monto_total") AS "total_documentos"
           FROM "finanzas"."documento_tributario"
          WHERE (("documento_tributario"."estado_documento")::"text" <> 'anulado'::"text")
          GROUP BY "documento_tributario"."id_ficha_cliente") "dt" ON (("dt"."id_ficha_cliente" = "fc"."id_ficha_cliente")))
     LEFT JOIN ( SELECT "pago_cliente"."id_ficha_cliente",
            "count"(*) AS "cantidad_pagos_cliente",
            "sum"("pago_cliente"."monto_pago") AS "total_pagado_cliente"
           FROM "finanzas"."pago_cliente"
          WHERE (("pago_cliente"."estado_verificacion")::"text" <> 'anulado'::"text")
          GROUP BY "pago_cliente"."id_ficha_cliente") "pc" ON (("pc"."id_ficha_cliente" = "fc"."id_ficha_cliente")))
     LEFT JOIN ( SELECT "proyecto_financiero"."id_ficha_cliente",
            "count"(*) AS "cantidad_proyectos_financieros",
            "sum"(COALESCE("proyecto_financiero"."monto_costo_real", (0)::numeric)) AS "total_costo_real"
           FROM "finanzas"."proyecto_financiero"
          WHERE (("proyecto_financiero"."estado_financiero_proyecto")::"text" <> 'anulado'::"text")
          GROUP BY "proyecto_financiero"."id_ficha_cliente") "pf" ON (("pf"."id_ficha_cliente" = "fc"."id_ficha_cliente")))
     LEFT JOIN ( SELECT "evaluacion_credito"."id_ficha_cliente",
            "count"(*) AS "cantidad_evaluaciones_credito"
           FROM "finanzas"."evaluacion_credito"
          WHERE (("evaluacion_credito"."estado_evaluacion")::"text" <> 'anulada'::"text")
          GROUP BY "evaluacion_credito"."id_ficha_cliente") "ec" ON (("ec"."id_ficha_cliente" = "fc"."id_ficha_cliente")))
     LEFT JOIN LATERAL ( SELECT "lcx"."monto_limite",
            "lcx"."estado_limite"
           FROM "finanzas"."limite_credito_cliente" "lcx"
          WHERE (("lcx"."id_ficha_cliente" = "fc"."id_ficha_cliente") AND (("lcx"."estado_limite")::"text" = 'vigente'::"text"))
          ORDER BY "lcx"."fecha_inicio_vigencia" DESC, "lcx"."id_limite_credito_cliente" DESC
         LIMIT 1) "lc" ON (true))
     LEFT JOIN ( SELECT "credito_proyecto"."id_ficha_cliente",
            "count"(*) AS "cantidad_creditos",
            "sum"("credito_proyecto"."monto_credito") AS "total_creditos"
           FROM "finanzas"."credito_proyecto"
          WHERE (("credito_proyecto"."estado_credito")::"text" <> 'anulado'::"text")
          GROUP BY "credito_proyecto"."id_ficha_cliente") "cp" ON (("cp"."id_ficha_cliente" = "fc"."id_ficha_cliente")))
     LEFT JOIN ( SELECT "oa"."id_registro_origen" AS "id_ficha_cliente",
            "count"(*) AS "cantidad_alertas"
           FROM ("finanzas"."origen_alerta_financiera" "oa"
             JOIN "finanzas"."alerta_financiera" "af" ON (("af"."id_alerta_financiera" = "oa"."id_alerta_financiera")))
          WHERE ((("oa"."entidad_origen")::"text" = 'ficha_cliente'::"text") AND (("af"."estado_alerta")::"text" <> 'anulada'::"text"))
          GROUP BY "oa"."id_registro_origen") "al" ON (("al"."id_ficha_cliente" = "fc"."id_ficha_cliente")));



CREATE TABLE "finanzas"."variante_documento" (
    "id_variante_documento" bigint NOT NULL,
    "id_version_original" bigint NOT NULL,
    "id_version_derivada" bigint NOT NULL,
    "tipo_variante" character varying(30) NOT NULL,
    "parametros_tecnicos" "jsonb",
    "creado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "chk_variante_documento_distinta" CHECK (("id_version_original" <> "id_version_derivada")),
    CONSTRAINT "chk_variante_documento_tipo" CHECK ((("tipo_variante")::"text" = ANY (ARRAY[('MINIATURA'::character varying)::"text", ('VISTA_PREVIA'::character varying)::"text", ('PDF_OPTIMIZADA'::character varying)::"text"])))
);



CREATE SEQUENCE "finanzas"."variante_documento_id_variante_documento_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."variante_documento_id_variante_documento_seq" OWNED BY "finanzas"."variante_documento"."id_variante_documento";



CREATE TABLE "finanzas"."version_documento" (
    "id_version_documento" bigint NOT NULL,
    "id_documento_logico" bigint NOT NULL,
    "numero_version" integer NOT NULL,
    "proveedor_logico" character varying(20) NOT NULL,
    "contenedor_logico" character varying(80) NOT NULL,
    "clave_objeto" character varying(700) NOT NULL,
    "version_proveedor" character varying(300),
    "nombre_original" character varying(255) NOT NULL,
    "nombre_seguro" character varying(255) NOT NULL,
    "mime_declarado" character varying(150) NOT NULL,
    "mime_detectado" character varying(150),
    "tamano_bytes" bigint NOT NULL,
    "sha256" character(64),
    "estado" character varying(20) DEFAULT 'PENDIENTE'::character varying NOT NULL,
    "creado_por" bigint NOT NULL,
    "creado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "validado_en" timestamp(6) with time zone,
    "id_version_reemplazada" bigint,
    "resultado_validaciones" "jsonb",
    "revision" integer DEFAULT 1 NOT NULL,
    CONSTRAINT "chk_version_documento_clave_opaca" CHECK ((("clave_objeto")::"text" ~ '^(objects|quarantine)/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'::"text")),
    CONSTRAINT "chk_version_documento_contenedor" CHECK ((("contenedor_logico")::"text" ~ '^[a-z0-9][a-z0-9._-]{2,62}$'::"text")),
    CONSTRAINT "chk_version_documento_disponible" CHECK (((("estado")::"text" <> 'DISPONIBLE'::"text") OR (("sha256" IS NOT NULL) AND ("mime_detectado" IS NOT NULL) AND ("validado_en" IS NOT NULL)))),
    CONSTRAINT "chk_version_documento_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('PENDIENTE'::character varying)::"text", ('SUBIENDO'::character varying)::"text", ('VALIDANDO'::character varying)::"text", ('DISPONIBLE'::character varying)::"text", ('ERROR'::character varying)::"text", ('CUARENTENA'::character varying)::"text", ('REEMPLAZADO'::character varying)::"text", ('ARCHIVADO'::character varying)::"text"]))),
    CONSTRAINT "chk_version_documento_no_autorreemplazo" CHECK ((("id_version_reemplazada" IS NULL) OR ("id_version_reemplazada" <> "id_version_documento"))),
    CONSTRAINT "chk_version_documento_numero" CHECK (("numero_version" > 0)),
    CONSTRAINT "chk_version_documento_proveedor" CHECK ((("proveedor_logico")::"text" = ANY (ARRAY[('R2'::character varying)::"text", ('S3'::character varying)::"text", ('LOCAL_PRIVADO'::character varying)::"text", ('POSTGRES'::character varying)::"text"]))),
    CONSTRAINT "chk_version_documento_revision" CHECK (("revision" > 0)),
    CONSTRAINT "chk_version_documento_sha256" CHECK ((("sha256" IS NULL) OR ("sha256" ~ '^[0-9a-f]{64}$'::"text"))),
    CONSTRAINT "chk_version_documento_tamano" CHECK (("tamano_bytes" > 0))
);



CREATE SEQUENCE "finanzas"."version_documento_id_version_documento_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."version_documento_id_version_documento_seq" OWNED BY "finanzas"."version_documento"."id_version_documento";



CREATE TABLE "finanzas"."version_plantilla_fabricacion" (
    "id_version_plantilla" integer NOT NULL,
    "id_plantilla_fabricacion" integer NOT NULL,
    "numero_version" integer NOT NULL,
    "contenido" "jsonb" NOT NULL,
    "motivo" "text" NOT NULL,
    "publicado_por" bigint NOT NULL,
    "publicado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



CREATE SEQUENCE "finanzas"."version_plantilla_fabricacion_id_version_plantilla_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."version_plantilla_fabricacion_id_version_plantilla_seq" OWNED BY "finanzas"."version_plantilla_fabricacion"."id_version_plantilla";



CREATE TABLE "finanzas"."version_presupuesto_m10" (
    "id_version_presupuesto_m10" bigint NOT NULL,
    "id_presupuesto_manual_m10" bigint NOT NULL,
    "numero_version" integer NOT NULL,
    "tipo_version" character varying(20) NOT NULL,
    "revision_base" integer NOT NULL,
    "motivo" character varying(1000),
    "creado_por" bigint NOT NULL,
    "fecha_creacion" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "ck_version_presupuesto_m10_numero" CHECK (("numero_version" >= 1)),
    CONSTRAINT "ck_version_presupuesto_m10_tipo" CHECK ((("tipo_version")::"text" = ANY (ARRAY[('ORIGINAL'::character varying)::"text", ('REVISION'::character varying)::"text"])))
);



CREATE SEQUENCE "finanzas"."version_presupuesto_m10_id_version_presupuesto_m10_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."version_presupuesto_m10_id_version_presupuesto_m10_seq" OWNED BY "finanzas"."version_presupuesto_m10"."id_version_presupuesto_m10";



CREATE TABLE "finanzas"."version_rectificacion_orden_trabajo" (
    "id_version_rectificacion" bigint CONSTRAINT "version_rectificacion_orden_t_id_version_rectificacion_not_null" NOT NULL,
    "id_rectificacion_ot" bigint CONSTRAINT "version_rectificacion_orden_trabaj_id_rectificacion_ot_not_null" NOT NULL,
    "numero_version" integer NOT NULL,
    "datos_rectificacion" "jsonb" CONSTRAINT "version_rectificacion_orden_trabaj_datos_rectificacion_not_null" NOT NULL,
    "planificacion" "jsonb" NOT NULL,
    "enviado_por" bigint NOT NULL,
    "enviado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);



CREATE SEQUENCE "finanzas"."version_rectificacion_orden_trabaj_id_version_rectificacion_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "finanzas"."version_rectificacion_orden_trabaj_id_version_rectificacion_seq" OWNED BY "finanzas"."version_rectificacion_orden_trabajo"."id_version_rectificacion";



CREATE TABLE "inventario"."alerta_faltante_pedido" (
    "alerta_faltante_pedido_id_alerta_faltante" bigint CONSTRAINT "alerta_faltante_pedido_alerta_faltante_pedido_id_alert_not_null" NOT NULL,
    "alerta_faltante_pedido_fecha_generacion" timestamp with time zone,
    "alerta_faltante_pedido_cantidad_disponible" numeric(12,4),
    "alerta_faltante_pedido_cantidad_requerida" numeric(12,4),
    "alerta_faltante_pedido_horas_anticipacion" integer,
    "alerta_faltante_pedido_estado" character varying(50),
    "material_sku" character varying(16),
    "proveedor_id_proveedor" integer,
    "usuario_id_usuario" bigint,
    "proyecto_id_proyecto" bigint
);



ALTER TABLE "inventario"."alerta_faltante_pedido" ALTER COLUMN "alerta_faltante_pedido_id_alerta_faltante" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "inventario"."alerta_faltante_pedido_alerta_faltante_pedido_id_alerta_fal_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "inventario"."alerta_inventario" (
    "alerta_inventario_id_alerta" bigint NOT NULL,
    "alerta_inventario_mensaje" "text",
    "alerta_inventario_fecha_generacion" timestamp with time zone,
    "alerta_inventario_fecha_est_agotamiento" "date",
    "alerta_inventario_estado" character varying(50),
    "material_sku" character varying(16),
    "proveedor_id_proveedor" integer,
    "alerta_inventario_tipo_alerta_id_tipo_alerta" bigint,
    "historial_alerta_id_historial" bigint
);



ALTER TABLE "inventario"."alerta_inventario" ALTER COLUMN "alerta_inventario_id_alerta" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "inventario"."alerta_inventario_alerta_inventario_id_alerta_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "inventario"."alerta_inventario_nivel_prioridad" (
    "alerta_inventario_nivel_prioridad_id_nivel_prioridad" bigint CONSTRAINT "alerta_inventario_nivel_pri_alerta_inventario_nivel_pr_not_null" NOT NULL,
    "alerta_inventario_prioridad_nombre" character varying(100)
);



ALTER TABLE "inventario"."alerta_inventario_nivel_prioridad" ALTER COLUMN "alerta_inventario_nivel_prioridad_id_nivel_prioridad" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "inventario"."alerta_inventario_nivel_prior_alerta_inventario_nivel_prior_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "inventario"."alerta_inventario_tipo_alerta" (
    "alerta_inventario_tipo_alerta_id_tipo_alerta" bigint CONSTRAINT "alerta_inventario_tipo_aler_alerta_inventario_tipo_ale_not_null" NOT NULL,
    "alerta_inventario_tipo_alerta_nombre" character varying(150),
    "alerta_inventario_nivel_prioridad_id" bigint
);



ALTER TABLE "inventario"."alerta_inventario_tipo_alerta" ALTER COLUMN "alerta_inventario_tipo_alerta_id_tipo_alerta" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "inventario"."alerta_inventario_tipo_alerta_alerta_inventario_tipo_alerta_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "inventario"."anaquel" (
    "anaquel_id_anaquel" bigint NOT NULL,
    "anaquel_descripcion" "text",
    "bodega_id_bodega" bigint
);



ALTER TABLE "inventario"."anaquel" ALTER COLUMN "anaquel_id_anaquel" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "inventario"."anaquel_anaquel_id_anaquel_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "inventario"."bodega" (
    "bodega_id_bodega" bigint NOT NULL,
    "bodega_nombre_bodega" character varying(150),
    "bodega_direccion" "text",
    "bodega_estado" character varying(50)
);



ALTER TABLE "inventario"."bodega" ALTER COLUMN "bodega_id_bodega" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "inventario"."bodega_bodega_id_bodega_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "inventario"."factura_compra" (
    "factura_compra_id_factura" bigint NOT NULL,
    "factura_compra_numero_factura" character varying(80),
    "factura_compra_monto_neto" numeric(14,2),
    "factura_compra_tipo_compra" character varying(100),
    "factura_compra_fecha_emision" "date",
    "proveedor_id_proveedor" integer,
    "factura_compra_tipo_cambio_id_tipo_cambio" bigint
);



ALTER TABLE "inventario"."factura_compra" ALTER COLUMN "factura_compra_id_factura" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "inventario"."factura_compra_factura_compra_id_factura_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "inventario"."factura_compra_tipo_cambio" (
    "factura_compra_tipo_cambio_id_tipo_cambio" bigint CONSTRAINT "factura_compra_tipo_cambio_factura_compra_tipo_cambio__not_null" NOT NULL,
    "factura_compra_tipo_cambio_moneda" character varying(10),
    "factura_compra_tipo_cambio_valor" numeric(14,4)
);



ALTER TABLE "inventario"."factura_compra_tipo_cambio" ALTER COLUMN "factura_compra_tipo_cambio_id_tipo_cambio" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "inventario"."factura_compra_tipo_cambio_factura_compra_tipo_cambio_id_ti_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "inventario"."historial_alerta" (
    "historial_alerta_id_historial" bigint NOT NULL,
    "historial_alerta_fecha_hora_resolucion" timestamp with time zone
);



ALTER TABLE "inventario"."historial_alerta" ALTER COLUMN "historial_alerta_id_historial" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "inventario"."historial_alerta_historial_alerta_id_historial_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "inventario"."insumo_estandar_proceso" (
    "insumo_estandar_proceso_id_insumo_estandar" bigint CONSTRAINT "insumo_estandar_proceso_insumo_estandar_proceso_id_ins_not_null" NOT NULL,
    "insumo_estandar_proceso_cantidad_estandar" numeric(12,4),
    "insumo_estandar_proceso_observacion" "text",
    "insumo_estandar_proceso_activo" boolean,
    "material_sku" character varying(16),
    "area_trabajo_id_area" bigint
);



ALTER TABLE "inventario"."insumo_estandar_proceso" ALTER COLUMN "insumo_estandar_proceso_id_insumo_estandar" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "inventario"."insumo_estandar_proceso_insumo_estandar_proceso_id_insumo_e_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "inventario"."inventario_bodega" (
    "material_sku" character varying(16) NOT NULL,
    "lote_id_lote" bigint NOT NULL,
    "bodega_id_bodega" bigint NOT NULL,
    "inventario_bodega_cantidad_fisica" numeric(12,4),
    "inventario_bodega_cantidad_reservada" numeric(12,4)
);



CREATE TABLE "inventario"."lote" (
    "lote_id_lote" bigint NOT NULL,
    "lote_numero_lote" character varying(80),
    "lote_fecha_ingreso" "date",
    "lote_fecha_vencimiento" "date",
    "lote_fecha_recepcion" "date",
    "lote_estado" character varying(50),
    "proveedor_id_proveedor" integer,
    "factura_compra_id_factura" bigint,
    "proyecto_id_proyecto" bigint
);



CREATE TABLE "inventario"."lote_fecha_pedido" (
    "lote_fecha_pedido_id" bigint NOT NULL,
    "lote_fecha_pedido_fecha_pedido" "date",
    "lote_fecha_pedido_precio_unitario" numeric(14,2),
    "lote_id_lote" bigint
);



ALTER TABLE "inventario"."lote_fecha_pedido" ALTER COLUMN "lote_fecha_pedido_id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "inventario"."lote_fecha_pedido_lote_fecha_pedido_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "inventario"."lote" ALTER COLUMN "lote_id_lote" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "inventario"."lote_lote_id_lote_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "inventario"."material" (
    "material_sku" character varying(16) NOT NULL,
    "material_nombre_material" character varying(200),
    "material_descripcion" "text",
    "material_material_critico" boolean,
    "material_presentacion" character varying(150),
    "material_stock_critico" numeric(12,4),
    "material_sotck_maximo" numeric(12,4),
    "material_stock_minimo" numeric(12,4),
    "material_es_rotativo" boolean,
    "material_estado" character varying(50),
    "es_material_pintura_custom" boolean,
    "material_pintura_custom" character varying(100),
    "es_material_pintura_no_custom" boolean,
    "material_pintura_no_custom" character varying(100),
    "material_categoria_general_id_categoria_general" bigint,
    "material_categoria_funcional_id_categoria_funcional" bigint,
    "material_clasificacion_nivel_especifico" bigint,
    "material_unidad_medida_id_medida" bigint
);



CREATE TABLE "inventario"."material_categoria_funcional" (
    "material_categoria_funcional_id_categoria_funcional" bigint CONSTRAINT "material_categoria_funciona_material_categoria_funcion_not_null" NOT NULL,
    "material_categoria_funcional_nombre" character varying(150)
);



ALTER TABLE "inventario"."material_categoria_funcional" ALTER COLUMN "material_categoria_funcional_id_categoria_funcional" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "inventario"."material_categoria_funcional_material_categoria_funcional_i_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "inventario"."material_categoria_general" (
    "material_categoria_general_id_categoria_general" bigint CONSTRAINT "material_categoria_general_material_categoria_general__not_null" NOT NULL,
    "material_categoria_general_nombre" character varying(150)
);



ALTER TABLE "inventario"."material_categoria_general" ALTER COLUMN "material_categoria_general_id_categoria_general" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "inventario"."material_categoria_general_material_categoria_general_id_ca_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "inventario"."material_clasificacion_categoria" (
    "material_clasificacion_categoria_id" bigint CONSTRAINT "material_clasificacion_cate_material_clasificacion_cat_not_null" NOT NULL,
    "material_clasificacion_categoria_nombre_categoria" character varying(150)
);



ALTER TABLE "inventario"."material_clasificacion_categoria" ALTER COLUMN "material_clasificacion_categoria_id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "inventario"."material_clasificacion_catego_material_clasificacion_catego_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "inventario"."material_clasificacion_nivel_especifico" (
    "material_clasificacion_nivel_especifico_id" bigint CONSTRAINT "material_clasificacion_nive_material_clasificacion_niv_not_null" NOT NULL,
    "material_clasificacion_nivel_especifico_nombre_nivel_especifico" character varying(150),
    "material_clasificacion_subcategoria_id" bigint
);



ALTER TABLE "inventario"."material_clasificacion_nivel_especifico" ALTER COLUMN "material_clasificacion_nivel_especifico_id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "inventario"."material_clasificacion_nivel__material_clasificacion_nivel__seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "inventario"."material_clasificacion_subcategoria" (
    "material_clasificacion_subcategoria_id" bigint CONSTRAINT "material_clasificacion_subc_material_clasificacion_sub_not_null" NOT NULL,
    "material_clasificacion_subcategoria_nombre_subcategoria" character varying(150),
    "material_clasificacion_subcategoria_es_color_custom" boolean,
    "material_clasificacion_categoria_id" bigint
);



ALTER TABLE "inventario"."material_clasificacion_subcategoria" ALTER COLUMN "material_clasificacion_subcategoria_id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "inventario"."material_clasificacion_subcat_material_clasificacion_subcat_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "inventario"."material_codigo_barras" (
    "material_sku" character varying(16) NOT NULL,
    "material_codigo_barras" character varying(100) NOT NULL
);



CREATE TABLE "inventario"."material_orden_trabajo" (
    "material_sku" character varying(16) NOT NULL,
    "orden_trabajo_id_orden" bigint NOT NULL,
    "material_orden_trabajo_consumo_estimado" numeric(12,4),
    "material_orden_trabajo_consumo_real" numeric(12,4)
);



CREATE TABLE "inventario"."material_producto_terminado" (
    "material_sku" character varying(16) NOT NULL,
    "producto_terminado_id_producto" bigint CONSTRAINT "material_producto_terminado_producto_terminado_id_prod_not_null" NOT NULL,
    "material_producto_terminado_cantidad_estimada" numeric(12,4),
    "material_producto_terminado_merma_estimada" numeric(12,4)
);



CREATE TABLE "inventario"."material_proveedor" (
    "material_sku" character varying(16) NOT NULL,
    "proveedor_id_proveedor" integer NOT NULL,
    "material_proveedor_tiempo_reposicion" integer,
    "material_proveedor_precio_referencial" numeric(14,2),
    "material_proveedor_proveedor_principal" boolean
);



CREATE TABLE "inventario"."material_unidad_medida" (
    "material_unidad_medida_id_unidad_medida" bigint CONSTRAINT "material_unidad_medida_material_unidad_medida_id_unida_not_null" NOT NULL,
    "material_unidad_medida_nombre" character varying(100)
);



ALTER TABLE "inventario"."material_unidad_medida" ALTER COLUMN "material_unidad_medida_id_unidad_medida" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "inventario"."material_unidad_medida_material_unidad_medida_id_unidad_med_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "inventario"."movimiento_inventario" (
    "movimiento_inventario_id_movimiento" bigint CONSTRAINT "movimiento_inventario_movimiento_inventario_id_movimie_not_null" NOT NULL,
    "movimiento_inventario_fecha_hora" timestamp with time zone,
    "movimiento_inventario_cantidad" numeric(12,4),
    "movimiento_inventario_estado" character varying(50),
    "material_sku" character varying(16),
    "bodega_id_bodega" bigint,
    "lote_id_lote" bigint,
    "proyecto_id_proyecto" bigint,
    "factura_compra_id_factura_compra" bigint,
    "usuario_id_usuario" bigint,
    "movimiento_inventario_tipo_movimiento_id_tipo_movimiento" bigint,
    "movimiento_inventario_motivo_movimiento_id_motivo_movimiento" bigint
);



CREATE TABLE "inventario"."movimiento_inventario_clasificacion_salida" (
    "id_clasificacion_salida" bigint CONSTRAINT "movimiento_inventario_clasific_id_clasificacion_salida_not_null" NOT NULL,
    "movimiento_inventario_clasificacion_salida_nombre" character varying(150)
);



ALTER TABLE "inventario"."movimiento_inventario_clasificacion_salida" ALTER COLUMN "id_clasificacion_salida" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "inventario"."movimiento_inventario_clasificacion_id_clasificacion_salida_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "inventario"."movimiento_inventario_motivo_movimiento" (
    "movimiento_inventario_motivo_movimiento_id_motivo_movimiento" bigint CONSTRAINT "movimiento_inventario_motiv_movimiento_inventario_moti_not_null" NOT NULL,
    "movimiento_inventario_motivo_movimiento_nombre" character varying(150),
    "id_clasificacion_salida" bigint
);



ALTER TABLE "inventario"."movimiento_inventario_motivo_movimiento" ALTER COLUMN "movimiento_inventario_motivo_movimiento_id_motivo_movimiento" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "inventario"."movimiento_inventario_motivo__movimiento_inventario_motivo__seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "inventario"."movimiento_inventario" ALTER COLUMN "movimiento_inventario_id_movimiento" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "inventario"."movimiento_inventario_movimiento_inventario_id_movimiento_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "inventario"."movimiento_inventario_tipo_movimiento" (
    "movimiento_inventario_tipo_movimiento_id_tipo_movimiento" bigint CONSTRAINT "movimiento_inventario_tipo__movimiento_inventario_tipo_not_null" NOT NULL,
    "movimiento_inventario_tipo_movimiento_nombre" character varying(150)
);



ALTER TABLE "inventario"."movimiento_inventario_tipo_movimiento" ALTER COLUMN "movimiento_inventario_tipo_movimiento_id_tipo_movimiento" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "inventario"."movimiento_inventario_tipo_mo_movimiento_inventario_tipo_mo_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "inventario"."notificacion" (
    "notificacion_id_notificacion" bigint NOT NULL,
    "notificacion_tipo_notificacion" character varying(150),
    "notificacion_mensaje" "text",
    "notificacion_fecha_generacion" timestamp with time zone,
    "notificacion_estado_lectura" character varying(50),
    "notificacion_origen" character varying(150),
    "alerta_inventario_id_alerta" bigint,
    "usuario_id_usuario" bigint
);



ALTER TABLE "inventario"."notificacion" ALTER COLUMN "notificacion_id_notificacion" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "inventario"."notificacion_notificacion_id_notificacion_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "inventario"."operacion_inventario" (
    "operacion_inventario_id" bigint NOT NULL,
    "clave_idempotencia" character varying(160) NOT NULL,
    "tipo_operacion" character varying(20) NOT NULL,
    "hash_solicitud" character(64) NOT NULL,
    "actor_id" bigint NOT NULL,
    "material_sku" character varying(16) NOT NULL,
    "bodega_id_bodega" bigint NOT NULL,
    "lote_id_lote" bigint NOT NULL,
    "movimiento_inventario_id" bigint,
    "reserva_inventario_id" bigint,
    "resultado" "jsonb" NOT NULL,
    "creado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "confirmado_en" timestamp(6) with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "chk_operacion_inventario_tipo" CHECK ((("tipo_operacion")::"text" = ANY (ARRAY[('ENTRADA'::character varying)::"text", ('SALIDA'::character varying)::"text", ('RESERVA'::character varying)::"text", ('LIBERACION'::character varying)::"text", ('AJUSTE'::character varying)::"text"])))
);



ALTER TABLE "inventario"."operacion_inventario" ALTER COLUMN "operacion_inventario_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "inventario"."operacion_inventario_operacion_inventario_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "inventario"."orden_trabajo" (
    "orden_trabajo_id_orden" bigint NOT NULL,
    "orden_trabajo_fecha_hora" timestamp with time zone,
    "orden_trabajo_estado" character varying(50),
    "especificaciones_puerta_id_especificacion_puerta" bigint,
    "proyecto_id_proyecto" bigint,
    "area_trabajo_id_area" bigint,
    "usuario_id_usuario" bigint
);



ALTER TABLE "inventario"."orden_trabajo" ALTER COLUMN "orden_trabajo_id_orden" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "inventario"."orden_trabajo_orden_trabajo_id_orden_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "inventario"."preparacion_pedido" (
    "preparacion_pedido_id_preparacion" bigint NOT NULL,
    "preparacion_pedido_observacion" "text",
    "reserva_inventario_id_reserva" bigint,
    "usuario_id_usuario" bigint
);



CREATE TABLE "inventario"."preparacion_pedido_estado" (
    "preparacion_pedido_estado_id_estado_preparacion" bigint CONSTRAINT "preparacion_pedido_estado_preparacion_pedido_estado_id_not_null" NOT NULL,
    "pedido_preparacion_estado_nombre_estado" character varying(100),
    "pedido_preparacion_estado_timestamp_accion" timestamp with time zone,
    "preparacion_pedido_id_preparacion" bigint
);



ALTER TABLE "inventario"."preparacion_pedido_estado" ALTER COLUMN "preparacion_pedido_estado_id_estado_preparacion" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "inventario"."preparacion_pedido_estado_preparacion_pedido_estado_id_esta_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "inventario"."preparacion_pedido" ALTER COLUMN "preparacion_pedido_id_preparacion" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "inventario"."preparacion_pedido_preparacion_pedido_id_preparacion_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "inventario"."producto_terminado" (
    "producto_terminado_id_producto" bigint NOT NULL,
    "producto_terminado_tipo_producto" character varying(150),
    "producto_terminado_nombre_producto" character varying(200),
    "producto_terminado_codigo_producto" character varying(80),
    "producto_terminado_requerimientos_certificacion" "text",
    "producto_terminado_requerimientos_medidas" "text",
    "producto_terminado_requerimientos_produccion" "text",
    "producto_terminado_requerimientos_instalacion" "text",
    "producto_terminado_activo" boolean
);



ALTER TABLE "inventario"."producto_terminado" ALTER COLUMN "producto_terminado_id_producto" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "inventario"."producto_terminado_producto_terminado_id_producto_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "inventario"."proveedor_contacto_correo" (
    "proveedor_id_proveedor" integer NOT NULL,
    "proveedor_contacto_correo" character varying(254) NOT NULL
);



CREATE TABLE "inventario"."proveedor_contacto_telefono" (
    "proveedor_id_proveedor" integer NOT NULL,
    "proveedor_contacto_telefono" character varying(30) CONSTRAINT "proveedor_contacto_telefono_proveedor_contacto_telefon_not_null" NOT NULL
);



CREATE TABLE "inventario"."reporte" (
    "reporte_id_reporte" bigint NOT NULL,
    "reporte_periodo_fin" "date",
    "reporte_fecha_generacion" timestamp with time zone,
    "reporte_formato_exportacion" character varying(50),
    "reporte_estado" character varying(50),
    "reporte_tipo_reporte" character varying(50),
    "reporte_periodo_inicio" "date",
    "usuario_id_usuario" bigint
);



CREATE TABLE "inventario"."reporte_movimiento_inventario" (
    "movimiento_inventario_id_movimiento" bigint CONSTRAINT "reporte_movimiento_inventar_movimiento_inventario_id_m_not_null" NOT NULL,
    "reporte_id_reporte" bigint NOT NULL
);



ALTER TABLE "inventario"."reporte" ALTER COLUMN "reporte_id_reporte" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "inventario"."reporte_reporte_id_reporte_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "inventario"."reserva_inventario" (
    "reserva_inventario_id_reserva" bigint NOT NULL,
    "reserva_inventario_cantidad_reservada" numeric(12,4),
    "reserva_inventario_fecha_reserva" timestamp with time zone,
    "reserva_inventario_fecha_liberacion" timestamp with time zone,
    "reserva_inventario_estado_reserva" character varying(50),
    "material_sku" character varying(16),
    "proyecto_id_proyecto" bigint,
    "orden_trabajo_id_orden" bigint,
    "bodega_id_bodega" bigint,
    "lote_id_lote" bigint,
    CONSTRAINT "chk_reserva_inventario_ubicacion_completa" CHECK (((("bodega_id_bodega" IS NULL) AND ("lote_id_lote" IS NULL)) OR (("bodega_id_bodega" IS NOT NULL) AND ("lote_id_lote" IS NOT NULL))))
);



ALTER TABLE "inventario"."reserva_inventario" ALTER COLUMN "reserva_inventario_id_reserva" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "inventario"."reserva_inventario_reserva_inventario_id_reserva_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "public"."_prisma_migrations" (
    "id" character varying(36) NOT NULL,
    "checksum" character varying(64) NOT NULL,
    "finished_at" timestamp with time zone,
    "migration_name" character varying(255) NOT NULL,
    "logs" "text",
    "rolled_back_at" timestamp with time zone,
    "started_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "applied_steps_count" integer DEFAULT 0 NOT NULL
);



CREATE TABLE "terreno"."adicionales_pagados" (
    "adicionales_pagados_id_adicionales" bigint NOT NULL,
    "adicionales_pagados_retiro_escombros" boolean,
    "adicionales_pagados_retiro_puerta_actual" boolean,
    "adicionales_pagados_alarma" boolean,
    "adicionales_pagados_subida_escalera" "text",
    "adicionales_pagados_endolados" boolean,
    "adicionales_pagados_pilastras_alto" numeric(12,4),
    "adicionales_pagados_pilastras_ancho" numeric(12,4),
    "adicionales_pagados_pilastras_espesor" numeric(12,4),
    "adicionales_pagados_observaciones" "text",
    "id_especificaciones_puerta" bigint
);



ALTER TABLE "terreno"."adicionales_pagados" ALTER COLUMN "adicionales_pagados_id_adicionales" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "terreno"."adicionales_pagados_adicionales_pagados_id_adicionales_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "terreno"."categoria_incidencia_terreno" (
    "id_categoria_incidencia" integer NOT NULL,
    "codigo" character varying(30) NOT NULL,
    "nombre" character varying(100) NOT NULL,
    "activa" boolean DEFAULT true NOT NULL
);



CREATE SEQUENCE "terreno"."categoria_incidencia_terreno_id_categoria_incidencia_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "terreno"."categoria_incidencia_terreno_id_categoria_incidencia_seq" OWNED BY "terreno"."categoria_incidencia_terreno"."id_categoria_incidencia";



CREATE TABLE "terreno"."checklist_de_materiales" (
    "checklist_de_materiales_checklist_de_materials_id" bigint CONSTRAINT "checklist_de_materiales_checklist_de_materiales_checkl_not_null" NOT NULL,
    "checklist_de_materiales_tipo_inicio_tarea" "text",
    "checklist_de_materiales_tipo_cierre_tarea" "text",
    "checklist_de_materiales_item" "text",
    "checklist_de_materiales_es_marcado" boolean,
    "checklist_de_materiales_marcado" "text",
    "checklist_de_materiales_es_no_marcado" boolean,
    "checklist_de_materiales_no_marcado" "text"
);



ALTER TABLE "terreno"."checklist_de_materiales" ALTER COLUMN "checklist_de_materiales_checklist_de_materials_id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "terreno"."checklist_de_materiales_checklist_de_materiales_checklist_d_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "terreno"."cliente" (
    "cliente_cliente_rut" character varying(12) NOT NULL,
    "cliente_razon_social" "text",
    "cliente_contacto_principal" "text",
    "cliente_correo" "text",
    "cliente_telefono" "text",
    "cliente_es_cliente_b2c" boolean,
    "cliente_cliente_b2c_rut" character varying(12),
    "cliente_cliente_b2c_correo" "text",
    "cliente_cliente_b2c_primer_nombre" "text",
    "cliente_cliente_b2c_segundo_nombre" "text",
    "cliente_cliente_b2c_primer_apellido" "text",
    "cliente_cliente_b2c_segundo_apellido" "text",
    "cliente_cliente_b2c_telefono_contacto" "text",
    "cliente_cliente_b2c_fecha_registro" "date",
    "cliente_cliente_b2c_telefono_contacto_adicional" "text",
    "cliente_cliente_b2c_fecha_ultima_edicion" "date",
    "cliente_es_cliente_b2b" boolean,
    "cliente_cliente_b2b_fecha_ultima_edicion" "date",
    "cliente_cliente_b2b_correo_institucional" "text",
    "cliente_cliente_b2b_fecha_registro" "date",
    "cliente_cliente_b2b_telefono_corporativo" "text",
    "cliente_cliente_b2b_razon_social" "text",
    "cliente_cliente_b2b_rut_empresa" character varying(12),
    "cliente_cliente_b2b_telefono_corp_adicional" "text",
    "cliente_cliente_b2b_representante_legal_primer_nombre" "text",
    "cliente_cliente_b2b_representante_legal_segundo_nombre" "text",
    "cliente_cliente_b2b_representante_legal_primer_apellido" "text",
    "cliente_cliente_b2b_representante_legal_segundo_apellido" "text"
);



CREATE TABLE "terreno"."detalles_herraje" (
    "detalles_herraje_detalle_herraje_id" bigint NOT NULL,
    "detalles_herraje_ubicacion" "text",
    "detalles_herraje_color" "text",
    "detalles_herraje_cantidad" integer,
    "detalles_herraje_observacion" "text",
    "material_sku" character varying(16),
    "id_especificacion_puerta" bigint
);



ALTER TABLE "terreno"."detalles_herraje" ALTER COLUMN "detalles_herraje_detalle_herraje_id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "terreno"."detalles_herraje_detalles_herraje_detalle_herraje_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "terreno"."ejecucion_tarea" (
    "id_ejecucion_tarea" bigint NOT NULL,
    "id_tarea" bigint NOT NULL,
    "id_usuario_ejecutor" bigint NOT NULL,
    "fecha_ejecucion" timestamp with time zone NOT NULL,
    "estado_ejecucion" character varying(20) DEFAULT 'pendiente'::character varying NOT NULL,
    "estado_validacion_productiva" character varying(20) DEFAULT 'pendiente'::character varying NOT NULL,
    "cantidad" numeric(14,4),
    "unidad" character varying(30),
    CONSTRAINT "ck_ejecucion_tarea_cantidad" CHECK ((("cantidad" IS NULL) OR ("cantidad" >= (0)::numeric))),
    CONSTRAINT "ck_ejecucion_tarea_cantidad_unidad" CHECK (((("cantidad" IS NULL) AND ("unidad" IS NULL)) OR (("cantidad" IS NOT NULL) AND ("unidad" IS NOT NULL)))),
    CONSTRAINT "ck_ejecucion_tarea_estado" CHECK ((("estado_ejecucion")::"text" = ANY (ARRAY[('pendiente'::character varying)::"text", ('en_ejecucion'::character varying)::"text", ('terminada'::character varying)::"text", ('anulada'::character varying)::"text"]))),
    CONSTRAINT "ck_ejecucion_tarea_validacion" CHECK ((("estado_validacion_productiva")::"text" = ANY (ARRAY[('pendiente'::character varying)::"text", ('validada'::character varying)::"text", ('rechazada'::character varying)::"text", ('devuelta'::character varying)::"text"])))
);



CREATE SEQUENCE "terreno"."ejecucion_tarea_id_ejecucion_tarea_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "terreno"."ejecucion_tarea_id_ejecucion_tarea_seq" OWNED BY "terreno"."ejecucion_tarea"."id_ejecucion_tarea";



CREATE TABLE "terreno"."especificacion_metalmecanica" (
    "especificacion_metalmecanica_id_metalmecanica" bigint CONSTRAINT "especificacion_metalmecanic_especificacion_metalmecani_not_null" NOT NULL,
    "especificacion_metalmecanica_bastidor" "text",
    "especificacion_metalmecanica_cerradura" "text",
    "especificacion_metalmecanica_manillon" "text",
    "especificacion_metalmecanica_pernos_fijos" "text",
    "especificacion_metalmecanica_manilla" "text",
    "especificacion_metalmecanica_herraje" "text",
    "especificacion_metalmecanica_cerrojo" "text",
    "especificacion_metalmecanica_ojo" "text",
    "especificacion_metalmecanica_otros" "text",
    "id_especificacion_puerta" bigint
);



ALTER TABLE "terreno"."especificacion_metalmecanica" ALTER COLUMN "especificacion_metalmecanica_id_metalmecanica" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "terreno"."especificacion_metalmecanica_especificacion_metalmecanica_i_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "terreno"."especificacion_proyecto_terreno" (
    "id_especificacion_proyecto_terreno" bigint CONSTRAINT "especificacion_proyecto_ter_id_especificacion_proyecto_not_null" NOT NULL,
    "especificacion_proyecto_terreno_estado_operacional" "text",
    "especificacion_proyecto_terreno_estado_produccion" "text",
    "especificacion_proyecto_terreno_estado_instalacion" "text",
    "especificacion_proyecto_terreno_fecha_inicio" "date",
    "especificacion_proyecto_terreno_fecha_cierre_operativo" "date",
    "especificacion_proyecto_terreno_observacion_estado" "text",
    "especificacion_proyecto_terreno_conformidad_cliente" "text",
    "id_especificacion_puerta" bigint
);



ALTER TABLE "terreno"."especificacion_proyecto_terreno" ALTER COLUMN "id_especificacion_proyecto_terreno" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "terreno"."especificacion_proyecto_terre_id_especificacion_proyecto_te_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "terreno"."especificacion_servicio_terreno" (
    "especificacion_servicio_terreno_servicio_terreno_id" bigint CONSTRAINT "especificacion_servicio_ter_especificacion_servicio_te_not_null" NOT NULL,
    "especificacion_servicio_terreno_especificacion_puerta_id" bigint CONSTRAINT "especificacion_servicio_te_especificacion_servicio_te_not_null1" NOT NULL
);



CREATE TABLE "terreno"."especificacion_terminaciones" (
    "especificacion_terminaciones_id_terminacion" bigint CONSTRAINT "especificacion_terminacione_especificacion_terminacion_not_null" NOT NULL,
    "especificacion_terminaciones_herrajes" "text",
    "especificacion_terminaciones_pletina" numeric(12,4),
    "especificacion_terminaciones_funda" numeric(12,4),
    "especificacion_terminaciones_medida_final" numeric(12,4),
    "especificacion_terminaciones_manilla" numeric(12,4),
    "especificacion_terminaciones_marco_metalico" numeric(12,4),
    "especificacion_terminaciones_bisagras" numeric(12,4),
    "especificacion_terminaciones_molduras" "text",
    "especificacion_terminaciones_rebaje" "text",
    "especificacion_terminaciones_canterias" "text",
    "especificacion_terminaciones_pura" "text",
    "especificacion_terminaciones_enchape" "text",
    "id_especificacion_puerta" bigint
);



ALTER TABLE "terreno"."especificacion_terminaciones" ALTER COLUMN "especificacion_terminaciones_id_terminacion" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "terreno"."especificacion_terminaciones_especificacion_terminaciones_i_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "terreno"."especificaciones_puerta" (
    "especificacion_puerta_especificacion_puerta_id" bigint CONSTRAINT "especificaciones_puerta_especificacion_puerta_especifi_not_null" NOT NULL,
    "especificacion_puerta_modelo_puerta" "text",
    "especificacion_puerta_zona" "text",
    "especificacion_puerta_sentido_apertura" "text",
    "especificacion_puerta_materialidad_vano" "text",
    "especificacion_puerta_materialidad_marco_actual" "text",
    "especificacion_puerta_solucion_marco" "text",
    "especificacion_puerta_hoja_pasiva" "text",
    "especificacion_puerta_hoja_activa" "text",
    "especificacion_puerta_diseno_puerta" "text",
    "especificacion_puerta_observaciones_de_diseno" "text",
    "especificacion_puerta_cubrejuntas" boolean,
    "especificacion_puerta_bisagras" "text",
    "especificacion_puerta_observaciones" "text",
    "id_medidas" bigint
);



ALTER TABLE "terreno"."especificaciones_puerta" ALTER COLUMN "especificacion_puerta_especificacion_puerta_id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "terreno"."especificaciones_puerta_especificacion_puerta_especificacio_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "terreno"."evidencia_terreno" (
    "evidencia_terreno_evidencia_terreno_id" bigint CONSTRAINT "evidencia_terreno_evidencia_terreno_evidencia_terreno__not_null" NOT NULL,
    "evidencia_terreno_tipo_evidencia" "text",
    "evidencia_terreno_fecha_captura" "date",
    "evidencia_terreno_imagen_o_vector" "bytea",
    "evidencia_terreno_metadata_dispositivo" "text",
    "evidencia_terreno_estado_temporal" "text",
    "evidencia_terreno_estado_evidencia" "text",
    "evidencia_terreno_observacion" "text",
    "id_formulario_de_cierre" bigint,
    "id_servicio_terreno" bigint,
    "id_incidencia_retrabajo" bigint
);



ALTER TABLE "terreno"."evidencia_terreno" ALTER COLUMN "evidencia_terreno_evidencia_terreno_id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "terreno"."evidencia_terreno_evidencia_terreno_evidencia_terreno_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "terreno"."formulario_de_cierre" (
    "formulario_de_cierre_formulario_de_cierre_id" bigint CONSTRAINT "formulario_de_cierre_formulario_de_cierre_formulario_d_not_null" NOT NULL,
    "formulario_de_cierre_detalle_de_observaciones" "text",
    "formulario_de_cierre_sentido_de_apertura_correcto" boolean,
    "formulario_de_cierre_pilastras_incluidas_y_ajustadas" boolean,
    "formulario_de_cierre_resultado_finalizado" "text",
    "formulario_de_cierre_cilindro_correcto" boolean,
    "formulario_de_cierre_ausencia_de_rayones_o_danos" boolean,
    "id_tarea" bigint
);



ALTER TABLE "terreno"."formulario_de_cierre" ALTER COLUMN "formulario_de_cierre_formulario_de_cierre_id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "terreno"."formulario_de_cierre_formulario_de_cierre_formulario_de_cie_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "terreno"."historial_cambio_orden_trabajo" (
    "historial_cambio_orden_trabajo_id_cambio" bigint CONSTRAINT "historial_cambio_orden_trab_historial_cambio_orden_tra_not_null" NOT NULL,
    "historial_cambio_orden_trabajo_version_nueva" "text",
    "historial_cambio_orden_trabajo_version_antigua" "text",
    "historial_cambio_orden_trabajo_fecha_hora" timestamp with time zone,
    "historial_cambio_orden_trabajo_descripcion" "text",
    "id_especificaciones_puerta" bigint
);



ALTER TABLE "terreno"."historial_cambio_orden_trabajo" ALTER COLUMN "historial_cambio_orden_trabajo_id_cambio" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "terreno"."historial_cambio_orden_trabaj_historial_cambio_orden_trabaj_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "terreno"."hoja_doble" (
    "hoja_doble_especificacion_puerta_id" bigint NOT NULL,
    "hoja_doble_actividad_derecha" "text",
    "hoja_doble_medidas_derecha_vertical_alto" numeric(12,4),
    "hoja_doble_medidas_derecha_vertical_ancho" numeric(12,4),
    "hoja_doble_medidas_derecha_vertical_espesor" numeric(12,4),
    "hoja_doble_medidas_derecha_horizontal_alto" numeric(12,4),
    "hoja_doble_medidas_derecha_horizontal_ancho" numeric(12,4),
    "hoja_doble_medidas_derecha_horizontal_espesor" numeric(12,4),
    "hoja_doble_actividad_izquierda" "text",
    "hoja_doble_medidas_izquierda_vertical_alto" numeric(12,4),
    "hoja_doble_medidas_izquierda_vertical_ancho" numeric(12,4),
    "hoja_doble_medidas_izquierda_vertical_espesor" numeric(12,4),
    "hoja_doble_medidas_izquierda_horizontal_alto" numeric(12,4),
    "hoja_doble_medidas_izquierda_horizontal_ancho" numeric(12,4),
    "hoja_doble_medidas_izquierda_horizontal_espesor" numeric(12,4)
);



CREATE TABLE "terreno"."hoja_simple" (
    "hoja_simple_especificacion_puerta_id" bigint NOT NULL,
    "hoja_simple_medidas_vertical_alto" numeric(12,4),
    "hoja_simple_medidas_vertical_ancho" numeric(12,4),
    "hoja_simple_medidas_vertical_espesor" numeric(12,4),
    "hoja_simple_medidas_horizontal_alto" numeric(12,4),
    "hoja_simple_medidas_horizontal_ancho" numeric(12,4),
    "hoja_simple_medidas_horizontal_espesor" numeric(12,4)
);



CREATE TABLE "terreno"."incidencia_retrabajo_tarea" (
    "id_incidencia_retrabajo" bigint NOT NULL,
    "id_ejecucion_tarea" bigint NOT NULL,
    "descripcion" "text" NOT NULL,
    "estado" character varying(20) DEFAULT 'pendiente'::character varying NOT NULL,
    "responsabilidad" character varying(120),
    "fecha_registro" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "causa_referencia" "text",
    "id_categoria_incidencia" integer,
    "id_area_responsable" bigint,
    "id_usuario_creador" bigint,
    "estado_revision" character varying(30) DEFAULT 'pendiente_revision'::character varying NOT NULL,
    "id_usuario_revisor" bigint,
    "fecha_revision" timestamp(6) with time zone,
    "observacion_revision" "text",
    CONSTRAINT "ck_incidencia_estado_revision" CHECK ((("estado_revision")::"text" = ANY (ARRAY[('pendiente_revision'::character varying)::"text", ('aprobada'::character varying)::"text", ('rechazada'::character varying)::"text"]))),
    CONSTRAINT "ck_incidencia_retrabajo_estado" CHECK ((("estado")::"text" = ANY (ARRAY[('pendiente'::character varying)::"text", ('corregida'::character varying)::"text", ('cerrada'::character varying)::"text"])))
);



CREATE SEQUENCE "terreno"."incidencia_retrabajo_tarea_id_incidencia_retrabajo_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



ALTER SEQUENCE "terreno"."incidencia_retrabajo_tarea_id_incidencia_retrabajo_seq" OWNED BY "terreno"."incidencia_retrabajo_tarea"."id_incidencia_retrabajo";



CREATE TABLE "terreno"."item_comercial" (
    "id_item_comercial" integer NOT NULL,
    "nombre_item" character varying(150) NOT NULL,
    "descripcion_item" "text",
    "tipo_item" character varying(50),
    "estado_item" character varying(30) DEFAULT 'activo'::character varying NOT NULL,
    CONSTRAINT "chk_terreno_item_estado" CHECK ((("estado_item")::"text" = ANY (ARRAY[('activo'::character varying)::"text", ('inactivo'::character varying)::"text"])))
);



ALTER TABLE "terreno"."item_comercial" ALTER COLUMN "id_item_comercial" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "terreno"."item_comercial_id_item_comercial_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "terreno"."medidas_puerta" (
    "medidas_puerta_medidas_id" bigint NOT NULL,
    "medidas_puerta_medidas_marco_ancho" numeric(12,4),
    "medidas_puerta_medidas_marco_alto" numeric(12,4),
    "medidas_puerta_medidas_marco_espesor" numeric(12,4),
    "medidas_puerta_medidas_vano_vertical_ancho" numeric(12,4),
    "medidas_puerta_medidas_vano_vertical_alto" numeric(12,4),
    "medidas_puerta_medidas_vano_vertical_espesor" numeric(12,4),
    "medidas_puerta_medidas_vano_horizontal_ancho" numeric(12,4),
    "medidas_puerta_medidas_vano_horizontal_alto" numeric(12,4),
    "medidas_puerta_medidas_vano_horizontal_espesor" numeric(12,4),
    "medidas_puerta_medidas_alojamiento_vertical_alto" numeric(12,4),
    "medidas_puerta_medidas_alojamiento_vertical_ancho" numeric(12,4),
    "medidas_puerta_medidas_alojamiento_vertical_espesor" numeric(12,4),
    "medidas_puerta_medidas_alojamiento_horizontal_alto" numeric(12,4),
    "medidas_puerta_medidas_alojamiento_horizontal_ancho" numeric(12,4),
    "medidas_puerta_medidas_alojamiento_horizontal_espesor" numeric(12,4),
    "medidas_puerta_alojamiento_vertical" numeric(12,4),
    "medidas_puerta_medidas_de_marco_ancho" numeric(12,4),
    "medidas_puerta_medidas_de_marco_alto" numeric(12,4),
    "medidas_puerta_medidas_de_marco_espesor" numeric(12,4),
    "id_especificacion_puerta" bigint,
    "id_cambio" bigint
);



ALTER TABLE "terreno"."medidas_puerta" ALTER COLUMN "medidas_puerta_medidas_id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "terreno"."medidas_puerta_medidas_puerta_medidas_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "terreno"."notificacion_tecnico" (
    "notificacion_tecnico_id_notificacion_tecnico" bigint CONSTRAINT "notificacion_tecnico_notificacion_tecnico_id_notificac_not_null" NOT NULL,
    "notificacion_tecnico_fecha_emision" timestamp with time zone,
    "notificacion_tecnico_mensaje" "text",
    "usuario_id_usuario" bigint,
    "servicio_terreno_id_servicio_terreno" bigint
);



ALTER TABLE "terreno"."notificacion_tecnico" ALTER COLUMN "notificacion_tecnico_id_notificacion_tecnico" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "terreno"."notificacion_tecnico_notificacion_tecnico_id_notificacion_t_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "terreno"."notificacion_terreno" (
    "notificacion_terreno_id_notificacion_terreno" bigint CONSTRAINT "notificacion_terreno_notificacion_terreno_id_notificac_not_null" NOT NULL,
    "notificacion_terreno_mensaje" "text",
    "usuario_id_usuario" bigint,
    "tarea_id_tarea" bigint
);



ALTER TABLE "terreno"."notificacion_terreno" ALTER COLUMN "notificacion_terreno_id_notificacion_terreno" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "terreno"."notificacion_terreno_notificacion_terreno_id_notificacion_t_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "terreno"."prestamo_herramientas" (
    "prestamo_herramienta_prestamo_herramienta_id" bigint CONSTRAINT "prestamo_herramientas_prestamo_herramienta_prestamo_he_not_null" NOT NULL,
    "prestamo_herramienta_fecha_entrega" timestamp with time zone,
    "prestamo_herramienta_fecha_devolucion" timestamp with time zone,
    "prestamo_herramienta_cantidad" integer,
    "prestamo_herramienta_estado_prestamo" "text",
    "prestamo_herramienta_observacion" "text",
    "rut_empleado" character varying(12),
    "sku_material" character varying(16)
);



ALTER TABLE "terreno"."prestamo_herramientas" ALTER COLUMN "prestamo_herramienta_prestamo_herramienta_id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "terreno"."prestamo_herramientas_prestamo_herramienta_prestamo_herrami_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "terreno"."receptor" (
    "receptor_receptor_id" bigint NOT NULL,
    "receptor_primer_nombre_receptor" "text",
    "receptor_segundo_nombre_receptor" "text",
    "receptor_primer_apellido_receptor" "text",
    "receptor_segundo_apellido_receptor" "text",
    "receptor_rut_receptor" "text",
    "id_tarea" bigint
);



ALTER TABLE "terreno"."receptor" ALTER COLUMN "receptor_receptor_id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "terreno"."receptor_receptor_receptor_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "terreno"."servicio_terreno" (
    "servicio_terreno_servicio_terreno_id" bigint NOT NULL,
    "servicio_terreno_tipo_servicio" character varying(50),
    "servicio_terreno_fecha_real" "date",
    "servicio_terreno_bloque_horario" time without time zone,
    "servicio_terreno_prioridad" "text",
    "servicio_terreno_fecha_programada" time without time zone,
    "servicio_terreno_estado" "text",
    "servicio_terreno_observaciones" "text",
    "id_usuario" bigint,
    "id_checklist_de_materials" bigint,
    "id_obra" bigint
);



ALTER TABLE "terreno"."servicio_terreno" ALTER COLUMN "servicio_terreno_servicio_terreno_id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "terreno"."servicio_terreno_servicio_terreno_servicio_terreno_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "terreno"."servicio_tterreno_herramientas_materiales" (
    "id_servicio_terreno_herr_material" bigint CONSTRAINT "servicio_tterreno_herramien_id_servicio_terreno_herr_m_not_null" NOT NULL,
    "servicio_terreno_herramientas_materiales_servicio_terreno_id" bigint CONSTRAINT "servicio_tterreno_herramien_servicio_terreno_herramien_not_null" NOT NULL
);



CREATE TABLE "terreno"."tarea" (
    "tarea_tarea_id" bigint NOT NULL,
    "tarea_descripcion" "text",
    "tarea_fecha_de_visita" "date",
    "tarea_fecha_de_termino" "date",
    "tarea_bloque_horario" timestamp with time zone,
    "tarea_fecha_de_creacion" "date",
    "tarea_fecha_de_ultima_actualizacion" "date",
    "tarea_fecha_de_inicio" "date",
    "tarea_fecha_de_inicio_en_terreno" "date",
    "tarea_titulo" "text",
    "tarea_horario_limite" timestamp with time zone,
    "tarea_instrucciones_de_oficina" "text",
    "tarea_urgencia" "text",
    "tarea_estado_de_tarea" "text",
    "id_usuario" bigint,
    "id_servicio_terreno" bigint,
    "id_especificacion_puerta" bigint,
    "id_orden_trabajo" bigint
);



ALTER TABLE "terreno"."tarea" ALTER COLUMN "tarea_tarea_id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "terreno"."tarea_tarea_tarea_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "terreno"."tarea_tipo" (
    "tarea_tipo_tarea_tipo_id" bigint NOT NULL,
    "tarea_tipo_tiempo_estimado_tarea" time without time zone,
    "tarea_tipo_remuneracion_tarea" integer,
    "id_tarea" bigint
);



ALTER TABLE "terreno"."tarea_tipo" ALTER COLUMN "tarea_tipo_tarea_tipo_id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "terreno"."tarea_tipo_tarea_tipo_tarea_tipo_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE "terreno"."tarea_usuario" (
    "tarea_usuario_tarea_id" bigint NOT NULL,
    "tarea_usuario_usuario_id" bigint NOT NULL
);



ALTER TABLE ONLY "comun"."proyecto_obra" ALTER COLUMN "id_proyecto_obra" SET DEFAULT "nextval"('"comun"."proyecto_obra_id_proyecto_obra_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."ajuste_posterior_remuneracion" ALTER COLUMN "id_ajuste_posterior" SET DEFAULT "nextval"('"finanzas"."ajuste_posterior_remuneracion_id_ajuste_posterior_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."ajuste_producto_plantilla_fabricacion" ALTER COLUMN "id_ajuste_plantilla" SET DEFAULT "nextval"('"finanzas"."ajuste_producto_plantilla_fabricacion_id_ajuste_plantilla_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."alternativa_b2c" ALTER COLUMN "id_alternativa_b2c" SET DEFAULT "nextval"('"finanzas"."alternativa_b2c_id_alternativa_b2c_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."alternativa_b2c_opcional" ALTER COLUMN "id_alternativa_b2c_opcional" SET DEFAULT "nextval"('"finanzas"."alternativa_b2c_opcional_id_alternativa_b2c_opcional_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."anticipo_remuneracion" ALTER COLUMN "id_anticipo" SET DEFAULT "nextval"('"finanzas"."anticipo_remuneracion_id_anticipo_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."anulacion_pago" ALTER COLUMN "id_anulacion_pago" SET DEFAULT "nextval"('"finanzas"."anulacion_pago_id_anulacion_pago_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."aplicacion_revision_tecnica_ot" ALTER COLUMN "id_aplicacion_revision" SET DEFAULT "nextval"('"finanzas"."aplicacion_revision_tecnica_ot_id_aplicacion_revision_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."aplicacion_saldo_favor" ALTER COLUMN "id_aplicacion_saldo_favor" SET DEFAULT "nextval"('"finanzas"."aplicacion_saldo_favor_id_aplicacion_saldo_favor_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."asignacion_area_empleado" ALTER COLUMN "id_asignacion_area_empleado" SET DEFAULT "nextval"('"finanzas"."asignacion_area_empleado_id_asignacion_area_empleado_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."atribucion_ejecucion_tarea_ot" ALTER COLUMN "id_atribucion_ejecucion" SET DEFAULT "nextval"('"finanzas"."atribucion_ejecucion_tarea_ot_id_atribucion_ejecucion_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."boleta_honorarios" ALTER COLUMN "id_boleta_honorarios" SET DEFAULT "nextval"('"finanzas"."boleta_honorarios_id_boleta_honorarios_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."carta_comercial_b2c" ALTER COLUMN "id_carta_comercial_b2c" SET DEFAULT "nextval"('"finanzas"."carta_comercial_b2c_id_carta_comercial_b2c_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."carta_comercial_b2c_version" ALTER COLUMN "id_carta_comercial_b2c_version" SET DEFAULT "nextval"('"finanzas"."carta_comercial_b2c_version_id_carta_comercial_b2c_version_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."carta_comercial_b2c_version_fotografia" ALTER COLUMN "id_carta_version_fotografia" SET DEFAULT "nextval"('"finanzas"."carta_comercial_b2c_version_fot_id_carta_version_fotografia_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."carta_comercial_b2c_version_producto" ALTER COLUMN "id_carta_version_producto" SET DEFAULT "nextval"('"finanzas"."carta_comercial_b2c_version_produ_id_carta_version_producto_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."catalogo_tarea_fabricacion" ALTER COLUMN "id_tarea_fabricacion" SET DEFAULT "nextval"('"finanzas"."catalogo_tarea_fabricacion_id_tarea_fabricacion_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."categoria_pago" ALTER COLUMN "id_categoria_pago" SET DEFAULT "nextval"('"finanzas"."categoria_pago_id_categoria_pago_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."categoria_retencion_m9" ALTER COLUMN "id_categoria_retencion" SET DEFAULT "nextval"('"finanzas"."categoria_retencion_m9_id_categoria_retencion_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."cierre_orden_trabajo_produccion" ALTER COLUMN "id_cierre_ot" SET DEFAULT "nextval"('"finanzas"."cierre_orden_trabajo_produccion_id_cierre_ot_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."compatibilidad_opcional_producto" ALTER COLUMN "id_compatibilidad_opcional" SET DEFAULT "nextval"('"finanzas"."compatibilidad_opcional_producto_id_compatibilidad_opcional_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."componente_remuneracion" ALTER COLUMN "id_componente_remuneracion" SET DEFAULT "nextval"('"finanzas"."componente_remuneracion_id_componente_remuneracion_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."compromiso_credito_m8" ALTER COLUMN "id_compromiso" SET DEFAULT "nextval"('"finanzas"."compromiso_credito_m8_id_compromiso_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."condicion_cobro_nv" ALTER COLUMN "id_condicion_cobro_nv" SET DEFAULT "nextval"('"finanzas"."condicion_cobro_nv_id_condicion_cobro_nv_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."condicion_comercial" ALTER COLUMN "id_condicion_comercial" SET DEFAULT "nextval"('"finanzas"."condicion_comercial_id_condicion_comercial_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."condicion_comercial_version" ALTER COLUMN "id_condicion_comercial_version" SET DEFAULT "nextval"('"finanzas"."condicion_comercial_version_id_condicion_comercial_version_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."condicion_crediticia_m8" ALTER COLUMN "id_condicion_crediticia" SET DEFAULT "nextval"('"finanzas"."condicion_crediticia_m8_id_condicion_crediticia_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."config_umbral_por_vencer" ALTER COLUMN "id_configuracion" SET DEFAULT "nextval"('"finanzas"."config_umbral_por_vencer_id_configuracion_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."configuracion_alerta_m9" ALTER COLUMN "id_configuracion_alerta" SET DEFAULT "nextval"('"finanzas"."configuracion_alerta_m9_id_configuracion_alerta_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."contacto_cotizacion_b2b" ALTER COLUMN "id_contacto_cotizacion_b2b" SET DEFAULT "nextval"('"finanzas"."contacto_cotizacion_b2b_id_contacto_cotizacion_b2b_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."correccion_documental_m11" ALTER COLUMN "id_correccion_documental_m11" SET DEFAULT "nextval"('"finanzas"."correccion_documental_m11_id_correccion_documental_m11_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."cotizacion_salud_empleado" ALTER COLUMN "id_cotizacion_salud" SET DEFAULT "nextval"('"finanzas"."cotizacion_salud_empleado_id_cotizacion_salud_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."cotizacion_version" ALTER COLUMN "id_cotizacion_version" SET DEFAULT "nextval"('"finanzas"."cotizacion_version_id_cotizacion_version_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."cuenta_bancaria_m7" ALTER COLUMN "id_cuenta_bancaria_m7" SET DEFAULT "nextval"('"finanzas"."cuenta_bancaria_m7_id_cuenta_bancaria_m7_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."decision_rectificacion_orden_trabajo" ALTER COLUMN "id_decision_rectificacion" SET DEFAULT "nextval"('"finanzas"."decision_rectificacion_orden_trab_id_decision_rectificacion_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."decision_remuneracional_retrabajo" ALTER COLUMN "id_decision_retrabajo" SET DEFAULT "nextval"('"finanzas"."decision_remuneracional_retrabajo_id_decision_retrabajo_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."detalle_material_orden_compra_m5" ALTER COLUMN "id_detalle_material_oc_m5" SET DEFAULT "nextval"('"finanzas"."detalle_material_orden_compra_m5_id_detalle_material_oc_m5_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."detalle_presupuesto_m10" ALTER COLUMN "id_detalle_presupuesto_m10" SET DEFAULT "nextval"('"finanzas"."detalle_presupuesto_m10_id_detalle_presupuesto_m10_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."detalle_servicio_cotizacion" ALTER COLUMN "id_detalle_servicio_cotizacion" SET DEFAULT "nextval"('"finanzas"."detalle_servicio_cotizacion_id_detalle_servicio_cotizacion_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."documento_logico" ALTER COLUMN "id_documento_logico" SET DEFAULT "nextval"('"finanzas"."documento_logico_id_documento_logico_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."estado_tarea_produccion_ot" ALTER COLUMN "id_estado_tarea_produccion" SET DEFAULT "nextval"('"finanzas"."estado_tarea_produccion_ot_id_estado_tarea_produccion_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."etapa_adicional_orden_trabajo" ALTER COLUMN "id_etapa_adicional_ot" SET DEFAULT "nextval"('"finanzas"."etapa_adicional_orden_trabajo_id_etapa_adicional_ot_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."evento_auditoria_m9" ALTER COLUMN "id_evento_m9" SET DEFAULT "nextval"('"finanzas"."evento_auditoria_m9_id_evento_m9_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."evento_credito_m8" ALTER COLUMN "id_evento" SET DEFAULT "nextval"('"finanzas"."evento_credito_m8_id_evento_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."evento_operacional_documental" ALTER COLUMN "id_evento_operacional" SET DEFAULT "nextval"('"finanzas"."evento_operacional_documental_id_evento_operacional_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."extension_producto_comercial" ALTER COLUMN "id_extension_producto_comercial" SET DEFAULT "nextval"('"finanzas"."extension_producto_comercial_id_extension_producto_comercia_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."familia_producto_comercial" ALTER COLUMN "id_familia_producto_comercial" SET DEFAULT "nextval"('"finanzas"."familia_producto_comercial_id_familia_producto_comercial_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."grupo_alternativas_b2c" ALTER COLUMN "id_grupo_alternativas_b2c" SET DEFAULT "nextval"('"finanzas"."grupo_alternativas_b2c_id_grupo_alternativas_b2c_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."guia_despacho" ALTER COLUMN "id_guia_despacho" SET DEFAULT "nextval"('"finanzas"."guia_despacho_id_guia_despacho_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."hallazgo_discrepancia_m11" ALTER COLUMN "id_hallazgo_discrepancia_m11" SET DEFAULT "nextval"('"finanzas"."hallazgo_discrepancia_m11_id_hallazgo_discrepancia_m11_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."historial_cambio_produccion_ot" ALTER COLUMN "id_historial_cambio" SET DEFAULT "nextval"('"finanzas"."historial_cambio_produccion_ot_id_historial_cambio_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."historial_decision_alternativa_b2c" ALTER COLUMN "id_historial_decision" SET DEFAULT "nextval"('"finanzas"."historial_decision_alternativa_b2c_id_historial_decision_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."historial_familia_producto_comercial" ALTER COLUMN "id_historial_familia_producto_comercial" SET DEFAULT "nextval"('"finanzas"."historial_familia_producto_co_id_historial_familia_producto_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."historial_producto_comercial" ALTER COLUMN "id_historial_producto_comercial" SET DEFAULT "nextval"('"finanzas"."historial_producto_comercial_id_historial_producto_comercia_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."historial_rectificacion_orden_trabajo" ALTER COLUMN "id_historial_rectificacion" SET DEFAULT "nextval"('"finanzas"."historial_rectificacion_orden_tr_id_historial_rectificacion_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."historial_seleccion_alternativa_b2c" ALTER COLUMN "id_historial_seleccion" SET DEFAULT "nextval"('"finanzas"."historial_seleccion_alternativa_b2c_id_historial_seleccion_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."historial_unidad_fisica_ot" ALTER COLUMN "id_historial_unidad_fisica_ot" SET DEFAULT "nextval"('"finanzas"."historial_unidad_fisica_ot_id_historial_unidad_fisica_ot_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."intencion_carga_documental" ALTER COLUMN "id_intencion_carga" SET DEFAULT "nextval"('"finanzas"."intencion_carga_documental_id_intencion_carga_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."intento_retry_m9" ALTER COLUMN "id_intento_m9" SET DEFAULT "nextval"('"finanzas"."intento_retry_m9_id_intento_m9_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."liberacion_orden_trabajo" ALTER COLUMN "id_liberacion_ot" SET DEFAULT "nextval"('"finanzas"."liberacion_orden_trabajo_id_liberacion_ot_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."limite_global_credito_m8" ALTER COLUMN "id_limite_global" SET DEFAULT "nextval"('"finanzas"."limite_global_credito_m8_id_limite_global_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."linea_orden_compra_b2b" ALTER COLUMN "id_linea_orden_compra_b2b" SET DEFAULT "nextval"('"finanzas"."linea_orden_compra_b2b_id_linea_orden_compra_b2b_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."opcional_comercial" ALTER COLUMN "id_opcional_comercial" SET DEFAULT "nextval"('"finanzas"."opcional_comercial_id_opcional_comercial_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."orden_compra_b2b" ALTER COLUMN "id_orden_compra_b2b" SET DEFAULT "nextval"('"finanzas"."orden_compra_b2b_id_orden_compra_b2b_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."pago_remuneracion" ALTER COLUMN "id_pago_remuneracion" SET DEFAULT "nextval"('"finanzas"."pago_remuneracion_id_pago_remuneracion_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."pendiente_evento_m9" ALTER COLUMN "id_pendiente_m9" SET DEFAULT "nextval"('"finanzas"."pendiente_evento_m9_id_pendiente_m9_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."periodo_remuneracion" ALTER COLUMN "id_periodo_remuneracion" SET DEFAULT "nextval"('"finanzas"."periodo_remuneracion_id_periodo_remuneracion_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."plantilla_documental_comercial" ALTER COLUMN "id_plantilla_documental" SET DEFAULT "nextval"('"finanzas"."plantilla_documental_comercial_id_plantilla_documental_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."plantilla_documental_version" ALTER COLUMN "id_plantilla_documental_version" SET DEFAULT "nextval"('"finanzas"."plantilla_documental_version_id_plantilla_documental_versio_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."plantilla_fabricacion_familia" ALTER COLUMN "id_plantilla_fabricacion" SET DEFAULT "nextval"('"finanzas"."plantilla_fabricacion_familia_id_plantilla_fabricacion_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."politica_tratamiento_m9" ALTER COLUMN "id_politica_m9" SET DEFAULT "nextval"('"finanzas"."politica_tratamiento_m9_id_politica_m9_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."precio_opcional_comercial" ALTER COLUMN "id_precio_opcional_comercial" SET DEFAULT "nextval"('"finanzas"."precio_opcional_comercial_id_precio_opcional_comercial_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."precio_producto_comercial" ALTER COLUMN "id_precio_producto_comercial" SET DEFAULT "nextval"('"finanzas"."precio_producto_comercial_id_precio_producto_comercial_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."precio_servicio_comercial" ALTER COLUMN "id_precio_servicio_comercial" SET DEFAULT "nextval"('"finanzas"."precio_servicio_comercial_id_precio_servicio_comercial_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."prestador_honorarios" ALTER COLUMN "id_prestador_honorarios" SET DEFAULT "nextval"('"finanzas"."prestador_honorarios_id_prestador_honorarios_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."presupuesto_manual_m10" ALTER COLUMN "id_presupuesto_manual_m10" SET DEFAULT "nextval"('"finanzas"."presupuesto_manual_m10_id_presupuesto_manual_m10_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."producto_comercial_documento" ALTER COLUMN "id_producto_comercial_documento" SET DEFAULT "nextval"('"finanzas"."producto_comercial_documento_id_producto_comercial_document_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."producto_comercial_version" ALTER COLUMN "id_producto_comercial_version" SET DEFAULT "nextval"('"finanzas"."producto_comercial_version_id_producto_comercial_version_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."proyeccion_financiera_m7" ALTER COLUMN "id_proyeccion_financiera_m7" SET DEFAULT "nextval"('"finanzas"."proyeccion_financiera_m7_id_proyeccion_financiera_m7_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."rectificacion_orden_trabajo" ALTER COLUMN "id_rectificacion_ot" SET DEFAULT "nextval"('"finanzas"."rectificacion_orden_trabajo_id_rectificacion_ot_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."reduccion_compromiso_credito_m8" ALTER COLUMN "id_reduccion" SET DEFAULT "nextval"('"finanzas"."reduccion_compromiso_credito_m8_id_reduccion_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."regularizacion_extraordinaria" ALTER COLUMN "id_regularizacion" SET DEFAULT "nextval"('"finanzas"."regularizacion_extraordinaria_id_regularizacion_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."remuneracion" ALTER COLUMN "id_remuneracion" SET DEFAULT "nextval"('"finanzas"."remuneracion_id_remuneracion_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."resolucion_hallazgo_m11" ALTER COLUMN "id_resolucion_hallazgo_m11" SET DEFAULT "nextval"('"finanzas"."resolucion_hallazgo_m11_id_resolucion_hallazgo_m11_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."resolucion_solicitud_crediticia_m8" ALTER COLUMN "id_resolucion" SET DEFAULT "nextval"('"finanzas"."resolucion_solicitud_crediticia_m8_id_resolucion_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."reversion_nota_venta" ALTER COLUMN "id_reversion_nota_venta" SET DEFAULT "nextval"('"finanzas"."reversion_nota_venta_id_reversion_nota_venta_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."reversion_pago" ALTER COLUMN "id_reversion_pago" SET DEFAULT "nextval"('"finanzas"."reversion_pago_id_reversion_pago_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."reversion_pago_remuneracion" ALTER COLUMN "id_reversion_pago_remuneracion" SET DEFAULT "nextval"('"finanzas"."reversion_pago_remuneracion_id_reversion_pago_remuneracion_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."saldo_favor_cliente" ALTER COLUMN "id_saldo_favor_cliente" SET DEFAULT "nextval"('"finanzas"."saldo_favor_cliente_id_saldo_favor_cliente_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."saldo_inicial_bancario_m7" ALTER COLUMN "id_saldo_inicial_bancario_m7" SET DEFAULT "nextval"('"finanzas"."saldo_inicial_bancario_m7_id_saldo_inicial_bancario_m7_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."servicio_comercial" ALTER COLUMN "id_servicio_comercial" SET DEFAULT "nextval"('"finanzas"."servicio_comercial_id_servicio_comercial_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."solicitud_correccion_tecnica_ot" ALTER COLUMN "id_solicitud_correccion" SET DEFAULT "nextval"('"finanzas"."solicitud_correccion_tecnica_ot_id_solicitud_correccion_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."solicitud_crediticia_m8" ALTER COLUMN "id_solicitud_crediticia" SET DEFAULT "nextval"('"finanzas"."solicitud_crediticia_m8_id_solicitud_crediticia_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."tarea_ejecutable_unidad_ot" ALTER COLUMN "id_tarea_ejecutable_ot" SET DEFAULT "nextval"('"finanzas"."tarea_ejecutable_unidad_ot_id_tarea_ejecutable_ot_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."tarifa_instalacion_comercial" ALTER COLUMN "id_tarifa_instalacion_comercial" SET DEFAULT "nextval"('"finanzas"."tarifa_instalacion_comercial_id_tarifa_instalacion_comercia_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."tratamiento_privacidad_m9" ALTER COLUMN "id_tratamiento_m9" SET DEFAULT "nextval"('"finanzas"."tratamiento_privacidad_m9_id_tratamiento_m9_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."tratamiento_remuneracional_ejecucion" ALTER COLUMN "id_tratamiento_remuneracional" SET DEFAULT "nextval"('"finanzas"."tratamiento_remuneracional_ej_id_tratamiento_remuneracional_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."unidad_fisica_orden_trabajo" ALTER COLUMN "id_unidad_fisica_ot" SET DEFAULT "nextval"('"finanzas"."unidad_fisica_orden_trabajo_id_unidad_fisica_ot_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."variante_documento" ALTER COLUMN "id_variante_documento" SET DEFAULT "nextval"('"finanzas"."variante_documento_id_variante_documento_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."version_documento" ALTER COLUMN "id_version_documento" SET DEFAULT "nextval"('"finanzas"."version_documento_id_version_documento_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."version_plantilla_fabricacion" ALTER COLUMN "id_version_plantilla" SET DEFAULT "nextval"('"finanzas"."version_plantilla_fabricacion_id_version_plantilla_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."version_presupuesto_m10" ALTER COLUMN "id_version_presupuesto_m10" SET DEFAULT "nextval"('"finanzas"."version_presupuesto_m10_id_version_presupuesto_m10_seq"'::"regclass");



ALTER TABLE ONLY "finanzas"."version_rectificacion_orden_trabajo" ALTER COLUMN "id_version_rectificacion" SET DEFAULT "nextval"('"finanzas"."version_rectificacion_orden_trabaj_id_version_rectificacion_seq"'::"regclass");



ALTER TABLE ONLY "terreno"."categoria_incidencia_terreno" ALTER COLUMN "id_categoria_incidencia" SET DEFAULT "nextval"('"terreno"."categoria_incidencia_terreno_id_categoria_incidencia_seq"'::"regclass");



ALTER TABLE ONLY "terreno"."ejecucion_tarea" ALTER COLUMN "id_ejecucion_tarea" SET DEFAULT "nextval"('"terreno"."ejecucion_tarea_id_ejecucion_tarea_seq"'::"regclass");



ALTER TABLE ONLY "terreno"."incidencia_retrabajo_tarea" ALTER COLUMN "id_incidencia_retrabajo" SET DEFAULT "nextval"('"terreno"."incidencia_retrabajo_tarea_id_incidencia_retrabajo_seq"'::"regclass");



ALTER TABLE ONLY "comun"."estado_seguridad_usuario"
    ADD CONSTRAINT "estado_seguridad_usuario_pkey" PRIMARY KEY ("id_usuario");



ALTER TABLE ONLY "comun"."permiso_dependencia"
    ADD CONSTRAINT "permiso_dependencia_pkey" PRIMARY KEY ("id_permiso", "id_requerido");



ALTER TABLE ONLY "comun"."area_trabajo"
    ADD CONSTRAINT "pk_area_trabajo" PRIMARY KEY ("area_trabajo_id_area");



ALTER TABLE ONLY "comun"."obra"
    ADD CONSTRAINT "pk_obra" PRIMARY KEY ("obra_obra_id");



ALTER TABLE ONLY "comun"."perfil"
    ADD CONSTRAINT "pk_perfil" PRIMARY KEY ("perfil_id_perfil");



ALTER TABLE ONLY "comun"."perfil_permiso"
    ADD CONSTRAINT "pk_perfil_permiso" PRIMARY KEY ("perfil_id_perfil", "permiso_id_permiso");



ALTER TABLE ONLY "comun"."permiso"
    ADD CONSTRAINT "pk_permiso" PRIMARY KEY ("permiso_id_permiso");



ALTER TABLE ONLY "comun"."proyecto"
    ADD CONSTRAINT "pk_proyecto" PRIMARY KEY ("proyecto_proyecto_id");



ALTER TABLE ONLY "comun"."usuario"
    ADD CONSTRAINT "pk_usuario" PRIMARY KEY ("usuario_id_usuario");



ALTER TABLE ONLY "comun"."usuario_contrasena"
    ADD CONSTRAINT "pk_usuario_contrasena" PRIMARY KEY ("usuario_id_usuario", "usuario_contrasena");



ALTER TABLE ONLY "comun"."proyecto_obra"
    ADD CONSTRAINT "proyecto_obra_pkey" PRIMARY KEY ("id_proyecto_obra");



ALTER TABLE ONLY "comun"."sesion_usuario"
    ADD CONSTRAINT "sesion_usuario_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "comun"."token_recuperacion"
    ADD CONSTRAINT "token_recuperacion_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "comun"."proyecto_obra"
    ADD CONSTRAINT "uq_proyecto_obra" UNIQUE ("id_proyecto", "id_obra");



ALTER TABLE ONLY "comun"."usuario_permiso_particular"
    ADD CONSTRAINT "usuario_permiso_particular_pkey" PRIMARY KEY ("id_usuario", "id_permiso");



ALTER TABLE ONLY "finanzas"."afp"
    ADD CONSTRAINT "afp_nombre_afp_key" UNIQUE ("nombre_afp");



ALTER TABLE ONLY "finanzas"."afp"
    ADD CONSTRAINT "afp_pkey" PRIMARY KEY ("id_afp");



ALTER TABLE ONLY "finanzas"."ajuste_obligacion_proveedor_m5"
    ADD CONSTRAINT "ajuste_obligacion_proveedor_m5_id_documento_ajuste_m5_key" UNIQUE ("id_documento_ajuste_m5");



ALTER TABLE ONLY "finanzas"."ajuste_obligacion_proveedor_m5"
    ADD CONSTRAINT "ajuste_obligacion_proveedor_m5_pkey" PRIMARY KEY ("id_ajuste_obligacion_m5");



ALTER TABLE ONLY "finanzas"."ajuste_orden_compra_servicio_m5"
    ADD CONSTRAINT "ajuste_orden_compra_servicio_m5_pkey" PRIMARY KEY ("id_ajuste_ocs_m5");



ALTER TABLE ONLY "finanzas"."ajuste_posterior_remuneracion"
    ADD CONSTRAINT "ajuste_posterior_remuneracion_clave_idempotencia_key" UNIQUE ("clave_idempotencia");



ALTER TABLE ONLY "finanzas"."ajuste_posterior_remuneracion"
    ADD CONSTRAINT "ajuste_posterior_remuneracion_pkey" PRIMARY KEY ("id_ajuste_posterior");



ALTER TABLE ONLY "finanzas"."ajuste_producto_plantilla_fabricacion"
    ADD CONSTRAINT "ajuste_producto_plantilla_fab_id_extension_producto_comerci_key" UNIQUE ("id_extension_producto_comercial");



ALTER TABLE ONLY "finanzas"."ajuste_producto_plantilla_fabricacion"
    ADD CONSTRAINT "ajuste_producto_plantilla_fabricacion_pkey" PRIMARY KEY ("id_ajuste_plantilla");



ALTER TABLE ONLY "finanzas"."alerta_financiera"
    ADD CONSTRAINT "alerta_financiera_pkey" PRIMARY KEY ("id_alerta_financiera");



ALTER TABLE ONLY "finanzas"."alternativa_b2c_opcional"
    ADD CONSTRAINT "alternativa_b2c_opcional_pkey" PRIMARY KEY ("id_alternativa_b2c_opcional");



ALTER TABLE ONLY "finanzas"."alternativa_b2c"
    ADD CONSTRAINT "alternativa_b2c_pkey" PRIMARY KEY ("id_alternativa_b2c");



ALTER TABLE ONLY "finanzas"."anticipo_remuneracion"
    ADD CONSTRAINT "anticipo_remuneracion_clave_idempotencia_key" UNIQUE ("clave_idempotencia");



ALTER TABLE ONLY "finanzas"."anticipo_remuneracion"
    ADD CONSTRAINT "anticipo_remuneracion_pkey" PRIMARY KEY ("id_anticipo");



ALTER TABLE ONLY "finanzas"."anulacion_movimiento_pago_m5"
    ADD CONSTRAINT "anulacion_movimiento_pago_m5_pkey" PRIMARY KEY ("id_anulacion_movimiento_m5");



ALTER TABLE ONLY "finanzas"."anulacion_pago"
    ADD CONSTRAINT "anulacion_pago_pkey" PRIMARY KEY ("id_anulacion_pago");



ALTER TABLE ONLY "finanzas"."aplicacion_revision_tecnica_ot"
    ADD CONSTRAINT "aplicacion_revision_tecnica_ot_id_version_rectificacion_key" UNIQUE ("id_version_rectificacion");



ALTER TABLE ONLY "finanzas"."aplicacion_revision_tecnica_ot"
    ADD CONSTRAINT "aplicacion_revision_tecnica_ot_pkey" PRIMARY KEY ("id_aplicacion_revision");



ALTER TABLE ONLY "finanzas"."aplicacion_saldo_favor"
    ADD CONSTRAINT "aplicacion_saldo_favor_pkey" PRIMARY KEY ("id_aplicacion_saldo_favor");



ALTER TABLE ONLY "finanzas"."asignacion_area_empleado"
    ADD CONSTRAINT "asignacion_area_empleado_pkey" PRIMARY KEY ("id_asignacion_area_empleado");



ALTER TABLE ONLY "finanzas"."asignacion_concepto_remuneracion_empleado"
    ADD CONSTRAINT "asignacion_concepto_remuneracion_empleado_pkey" PRIMARY KEY ("id_asignacion_concepto");



ALTER TABLE ONLY "finanzas"."asignacion_esquema_remuneracional"
    ADD CONSTRAINT "asignacion_esquema_remuneracional_pkey" PRIMARY KEY ("id_asignacion_esquema");



ALTER TABLE ONLY "finanzas"."asignacion_pago_cliente"
    ADD CONSTRAINT "asignacion_pago_cliente_pkey" PRIMARY KEY ("id_asignacion_pago_cliente");



ALTER TABLE ONLY "finanzas"."asignacion_pago_proveedor"
    ADD CONSTRAINT "asignacion_pago_proveedor_pkey" PRIMARY KEY ("id_asignacion_pago_proveedor");



ALTER TABLE ONLY "finanzas"."asociacion_documento_oc_m5"
    ADD CONSTRAINT "asociacion_documento_oc_m5_pkey" PRIMARY KEY ("id_asociacion_m5");



ALTER TABLE ONLY "finanzas"."asociacion_respaldo_pago_m5"
    ADD CONSTRAINT "asociacion_respaldo_pago_m5_pkey" PRIMARY KEY ("id_asociacion_respaldo_m5");



ALTER TABLE ONLY "finanzas"."atribucion_ejecucion_tarea_ot"
    ADD CONSTRAINT "atribucion_ejecucion_tarea_ot_id_ejecucion_tarea_key" UNIQUE ("id_ejecucion_tarea");



ALTER TABLE ONLY "finanzas"."atribucion_ejecucion_tarea_ot"
    ADD CONSTRAINT "atribucion_ejecucion_tarea_ot_pkey" PRIMARY KEY ("id_atribucion_ejecucion");



ALTER TABLE ONLY "finanzas"."boleta_honorarios"
    ADD CONSTRAINT "boleta_honorarios_pkey" PRIMARY KEY ("id_boleta_honorarios");



ALTER TABLE ONLY "finanzas"."cargo"
    ADD CONSTRAINT "cargo_nombre_cargo_key" UNIQUE ("nombre_cargo");



ALTER TABLE ONLY "finanzas"."cargo"
    ADD CONSTRAINT "cargo_pkey" PRIMARY KEY ("id_cargo");



ALTER TABLE ONLY "finanzas"."carta_comercial_b2c"
    ADD CONSTRAINT "carta_comercial_b2c_codigo_key" UNIQUE ("codigo");



ALTER TABLE ONLY "finanzas"."carta_comercial_b2c"
    ADD CONSTRAINT "carta_comercial_b2c_pkey" PRIMARY KEY ("id_carta_comercial_b2c");



ALTER TABLE ONLY "finanzas"."carta_comercial_b2c_version"
    ADD CONSTRAINT "carta_comercial_b2c_version_clave_idempotencia_key" UNIQUE ("clave_idempotencia");



ALTER TABLE ONLY "finanzas"."carta_comercial_b2c_version_fotografia"
    ADD CONSTRAINT "carta_comercial_b2c_version_fotografia_pkey" PRIMARY KEY ("id_carta_version_fotografia");



ALTER TABLE ONLY "finanzas"."carta_comercial_b2c_version"
    ADD CONSTRAINT "carta_comercial_b2c_version_pkey" PRIMARY KEY ("id_carta_comercial_b2c_version");



ALTER TABLE ONLY "finanzas"."carta_comercial_b2c_version_producto"
    ADD CONSTRAINT "carta_comercial_b2c_version_producto_pkey" PRIMARY KEY ("id_carta_version_producto");



ALTER TABLE ONLY "finanzas"."catalogo_tarea_fabricacion"
    ADD CONSTRAINT "catalogo_tarea_fabricacion_pkey" PRIMARY KEY ("id_tarea_fabricacion");



ALTER TABLE ONLY "finanzas"."categoria_egreso_m5"
    ADD CONSTRAINT "categoria_egreso_m5_nombre_key" UNIQUE ("nombre");



ALTER TABLE ONLY "finanzas"."categoria_egreso_m5"
    ADD CONSTRAINT "categoria_egreso_m5_pkey" PRIMARY KEY ("id_categoria_egreso_m5");



ALTER TABLE ONLY "finanzas"."categoria_pago"
    ADD CONSTRAINT "categoria_pago_pkey" PRIMARY KEY ("id_categoria_pago");



ALTER TABLE ONLY "finanzas"."categoria_retencion_m9"
    ADD CONSTRAINT "categoria_retencion_m9_codigo_key" UNIQUE ("codigo");



ALTER TABLE ONLY "finanzas"."categoria_retencion_m9"
    ADD CONSTRAINT "categoria_retencion_m9_pkey" PRIMARY KEY ("id_categoria_retencion");



ALTER TABLE ONLY "finanzas"."cierre_orden_trabajo_produccion"
    ADD CONSTRAINT "cierre_orden_trabajo_produccion_id_unidad_fisica_ot_key" UNIQUE ("id_unidad_fisica_ot");



ALTER TABLE ONLY "finanzas"."cierre_orden_trabajo_produccion"
    ADD CONSTRAINT "cierre_orden_trabajo_produccion_pkey" PRIMARY KEY ("id_cierre_ot");



ALTER TABLE ONLY "finanzas"."clasificacion_asociacion_m5"
    ADD CONSTRAINT "clasificacion_asociacion_m5_pkey" PRIMARY KEY ("id_clasificacion_m5");



ALTER TABLE ONLY "finanzas"."cliente_financiero"
    ADD CONSTRAINT "cliente_financiero_pkey" PRIMARY KEY ("id_cliente_financiero");



ALTER TABLE ONLY "finanzas"."cliente_financiero"
    ADD CONSTRAINT "cliente_financiero_rut_cliente_key" UNIQUE ("rut_cliente");



ALTER TABLE ONLY "finanzas"."comision_bancaria_m5"
    ADD CONSTRAINT "comision_bancaria_m5_pkey" PRIMARY KEY ("id_comision_bancaria_m5");



ALTER TABLE ONLY "finanzas"."compatibilidad_opcional_producto"
    ADD CONSTRAINT "compatibilidad_opcional_producto_pkey" PRIMARY KEY ("id_compatibilidad_opcional");



ALTER TABLE ONLY "finanzas"."compensacion_saldo_favor_m5"
    ADD CONSTRAINT "compensacion_saldo_favor_m5_pkey" PRIMARY KEY ("id_compensacion_m5");



ALTER TABLE ONLY "finanzas"."componente_remuneracion"
    ADD CONSTRAINT "componente_remuneracion_pkey" PRIMARY KEY ("id_componente_remuneracion");



ALTER TABLE ONLY "finanzas"."compromiso_credito_m8"
    ADD CONSTRAINT "compromiso_credito_m8_id_nota_venta_key" UNIQUE ("id_nota_venta");



ALTER TABLE ONLY "finanzas"."compromiso_credito_m8"
    ADD CONSTRAINT "compromiso_credito_m8_pkey" PRIMARY KEY ("id_compromiso");



ALTER TABLE ONLY "finanzas"."concepto_remuneracion"
    ADD CONSTRAINT "concepto_remuneracion_nombre_concepto_key" UNIQUE ("nombre_concepto");



ALTER TABLE ONLY "finanzas"."concepto_remuneracion"
    ADD CONSTRAINT "concepto_remuneracion_pkey" PRIMARY KEY ("id_concepto_remuneracion");



ALTER TABLE ONLY "finanzas"."conciliacion_movimiento_pago_m5"
    ADD CONSTRAINT "conciliacion_movimiento_pago_m5_pkey" PRIMARY KEY ("id_conciliacion_movimiento_m5");



ALTER TABLE ONLY "finanzas"."conciliacion"
    ADD CONSTRAINT "conciliacion_pkey" PRIMARY KEY ("id_conciliacion");



ALTER TABLE ONLY "finanzas"."condicion_cobro_nv"
    ADD CONSTRAINT "condicion_cobro_nv_pkey" PRIMARY KEY ("id_condicion_cobro_nv");



ALTER TABLE ONLY "finanzas"."condicion_comercial"
    ADD CONSTRAINT "condicion_comercial_codigo_key" UNIQUE ("codigo");



ALTER TABLE ONLY "finanzas"."condicion_comercial"
    ADD CONSTRAINT "condicion_comercial_pkey" PRIMARY KEY ("id_condicion_comercial");



ALTER TABLE ONLY "finanzas"."condicion_comercial_version"
    ADD CONSTRAINT "condicion_comercial_version_pkey" PRIMARY KEY ("id_condicion_comercial_version");



ALTER TABLE ONLY "finanzas"."condicion_crediticia_m8"
    ADD CONSTRAINT "condicion_crediticia_m8_id_ficha_cliente_key" UNIQUE ("id_ficha_cliente");



ALTER TABLE ONLY "finanzas"."condicion_crediticia_m8"
    ADD CONSTRAINT "condicion_crediticia_m8_pkey" PRIMARY KEY ("id_condicion_crediticia");



ALTER TABLE ONLY "finanzas"."config_cuotas_tarjeta"
    ADD CONSTRAINT "config_cuotas_tarjeta_pkey" PRIMARY KEY ("cantidad");



ALTER TABLE ONLY "finanzas"."config_umbral_por_vencer_m5"
    ADD CONSTRAINT "config_umbral_por_vencer_m5_pkey" PRIMARY KEY ("id_config_umbral_m5");



ALTER TABLE ONLY "finanzas"."config_umbral_por_vencer"
    ADD CONSTRAINT "config_umbral_por_vencer_pkey" PRIMARY KEY ("id_configuracion");



ALTER TABLE ONLY "finanzas"."config_umbral_reclasificacion_m5"
    ADD CONSTRAINT "config_umbral_reclasificacion_m5_pkey" PRIMARY KEY ("id_configuracion");



ALTER TABLE ONLY "finanzas"."configuracion_alerta_m9"
    ADD CONSTRAINT "configuracion_alerta_m9_codigo_key" UNIQUE ("codigo");



ALTER TABLE ONLY "finanzas"."configuracion_alerta_m9"
    ADD CONSTRAINT "configuracion_alerta_m9_pkey" PRIMARY KEY ("id_configuracion_alerta");



ALTER TABLE ONLY "finanzas"."configuracion_area_trabajo"
    ADD CONSTRAINT "configuracion_area_trabajo_pkey" PRIMARY KEY ("id_area_trabajo");



ALTER TABLE ONLY "finanzas"."configuracion_concepto_remuneracion"
    ADD CONSTRAINT "configuracion_concepto_remuneracion_pkey" PRIMARY KEY ("id_configuracion_concepto");



ALTER TABLE ONLY "finanzas"."configuracion_conservacion_documental"
    ADD CONSTRAINT "configuracion_conservacion_documental_pkey" PRIMARY KEY ("id_configuracion_conservacion");



ALTER TABLE ONLY "finanzas"."contacto_cotizacion_b2b"
    ADD CONSTRAINT "contacto_cotizacion_b2b_pkey" PRIMARY KEY ("id_contacto_cotizacion_b2b");



ALTER TABLE ONLY "finanzas"."correccion_documental_m11"
    ADD CONSTRAINT "correccion_documental_m11_clave_idempotencia_key" UNIQUE ("clave_idempotencia");



ALTER TABLE ONLY "finanzas"."correccion_documental_m11"
    ADD CONSTRAINT "correccion_documental_m11_pkey" PRIMARY KEY ("id_correccion_documental_m11");



ALTER TABLE ONLY "finanzas"."costo_envio_importacion_m5"
    ADD CONSTRAINT "costo_envio_importacion_m5_id_comision_bancaria_m5_key" UNIQUE ("id_comision_bancaria_m5");



ALTER TABLE ONLY "finanzas"."costo_envio_importacion_m5"
    ADD CONSTRAINT "costo_envio_importacion_m5_id_obligacion_m5_key" UNIQUE ("id_obligacion_m5");



ALTER TABLE ONLY "finanzas"."costo_envio_importacion_m5"
    ADD CONSTRAINT "costo_envio_importacion_m5_pkey" PRIMARY KEY ("id_costo_envio_m5");



ALTER TABLE ONLY "finanzas"."costo_proyecto"
    ADD CONSTRAINT "costo_proyecto_pkey" PRIMARY KEY ("id_costo_proyecto");



ALTER TABLE ONLY "finanzas"."cotizacion"
    ADD CONSTRAINT "cotizacion_pkey" PRIMARY KEY ("id_cotizacion");



ALTER TABLE ONLY "finanzas"."cotizacion_salud_empleado"
    ADD CONSTRAINT "cotizacion_salud_empleado_pkey" PRIMARY KEY ("id_cotizacion_salud");



ALTER TABLE ONLY "finanzas"."cotizacion_version"
    ADD CONSTRAINT "cotizacion_version_pkey" PRIMARY KEY ("id_cotizacion_version");



ALTER TABLE ONLY "finanzas"."credito_proyecto"
    ADD CONSTRAINT "credito_proyecto_pkey" PRIMARY KEY ("id_credito_proyecto");



ALTER TABLE ONLY "finanzas"."cuenta_bancaria_m7"
    ADD CONSTRAINT "cuenta_bancaria_m7_pkey" PRIMARY KEY ("id_cuenta_bancaria_m7");



ALTER TABLE ONLY "finanzas"."decision_rectificacion_orden_trabajo"
    ADD CONSTRAINT "decision_rectificacion_orden_traba_id_version_rectificacion_key" UNIQUE ("id_version_rectificacion");



ALTER TABLE ONLY "finanzas"."decision_rectificacion_orden_trabajo"
    ADD CONSTRAINT "decision_rectificacion_orden_trabajo_pkey" PRIMARY KEY ("id_decision_rectificacion");



ALTER TABLE ONLY "finanzas"."decision_remuneracional_retrabajo"
    ADD CONSTRAINT "decision_remuneracional_retrabajo_pkey" PRIMARY KEY ("id_decision_retrabajo");



ALTER TABLE ONLY "finanzas"."detalle_compensacion_saldo_favor_m5"
    ADD CONSTRAINT "detalle_compensacion_saldo_fa_id_compensacion_m5_id_obligac_key" UNIQUE ("id_compensacion_m5", "id_obligacion_m5");



ALTER TABLE ONLY "finanzas"."detalle_compensacion_saldo_favor_m5"
    ADD CONSTRAINT "detalle_compensacion_saldo_favor_m5_pkey" PRIMARY KEY ("id_detalle_compensacion_m5");



ALTER TABLE ONLY "finanzas"."detalle_conciliacion"
    ADD CONSTRAINT "detalle_conciliacion_pkey" PRIMARY KEY ("id_detalle_conciliacion");



ALTER TABLE ONLY "finanzas"."detalle_costo_material_cotizacion"
    ADD CONSTRAINT "detalle_costo_material_cotizacion_pkey" PRIMARY KEY ("id_detalle_costo_material_cotizacion");



ALTER TABLE ONLY "finanzas"."detalle_costo_proyecto_documento_proveedor"
    ADD CONSTRAINT "detalle_costo_proyecto_documento_proveedor_pkey" PRIMARY KEY ("id_detalle_costo_proyecto_documento_proveedor");



ALTER TABLE ONLY "finanzas"."detalle_cotizacion"
    ADD CONSTRAINT "detalle_cotizacion_pkey" PRIMARY KEY ("id_detalle_cotizacion");



ALTER TABLE ONLY "finanzas"."detalle_documento_compra_proveedor"
    ADD CONSTRAINT "detalle_documento_compra_proveedor_pkey" PRIMARY KEY ("id_detalle_documento_compra_proveedor");



ALTER TABLE ONLY "finanzas"."detalle_evento_auditoria"
    ADD CONSTRAINT "detalle_evento_auditoria_pkey" PRIMARY KEY ("id_detalle_evento_auditoria");



ALTER TABLE ONLY "finanzas"."detalle_imputacion_m5"
    ADD CONSTRAINT "detalle_imputacion_m5_pkey" PRIMARY KEY ("id_detalle_imputacion_m5");



ALTER TABLE ONLY "finanzas"."detalle_liquidacion_remuneracion"
    ADD CONSTRAINT "detalle_liquidacion_remuneracion_pkey" PRIMARY KEY ("id_detalle_liquidacion_remuneracion");



ALTER TABLE ONLY "finanzas"."detalle_material_orden_compra_m5"
    ADD CONSTRAINT "detalle_material_orden_compra_m5_pkey" PRIMARY KEY ("id_detalle_material_oc_m5");



ALTER TABLE ONLY "finanzas"."detalle_presupuesto_m10"
    ADD CONSTRAINT "detalle_presupuesto_m10_pkey" PRIMARY KEY ("id_detalle_presupuesto_m10");



ALTER TABLE ONLY "finanzas"."detalle_reasignacion_costo_m5"
    ADD CONSTRAINT "detalle_reasignacion_costo_m5_pkey" PRIMARY KEY ("id_detalle_reasignacion_m5");



ALTER TABLE ONLY "finanzas"."detalle_reclasificacion_egreso_m5"
    ADD CONSTRAINT "detalle_reclasificacion_egreso_m5_pkey" PRIMARY KEY ("id_detalle_reclasificacion_m5");



ALTER TABLE ONLY "finanzas"."detalle_servicio_cotizacion"
    ADD CONSTRAINT "detalle_servicio_cotizacion_pkey" PRIMARY KEY ("id_detalle_servicio_cotizacion");



ALTER TABLE ONLY "finanzas"."documento_compra_proveedor"
    ADD CONSTRAINT "documento_compra_proveedor_pkey" PRIMARY KEY ("id_documento_compra_proveedor");



ALTER TABLE ONLY "finanzas"."documento_logico"
    ADD CONSTRAINT "documento_logico_pkey" PRIMARY KEY ("id_documento_logico");



ALTER TABLE ONLY "finanzas"."documento_proveedor_m5"
    ADD CONSTRAINT "documento_proveedor_m5_pkey" PRIMARY KEY ("id_documento_m5");



ALTER TABLE ONLY "finanzas"."documento_tributario_nota_venta"
    ADD CONSTRAINT "documento_tributario_nota_venta_pkey" PRIMARY KEY ("id_documento_tributario", "id_nota_venta");



ALTER TABLE ONLY "finanzas"."documento_tributario"
    ADD CONSTRAINT "documento_tributario_pkey" PRIMARY KEY ("id_documento_tributario");



ALTER TABLE ONLY "finanzas"."efecto_financiero_ocs_m5"
    ADD CONSTRAINT "efecto_financiero_ocs_m5_pkey" PRIMARY KEY ("id_efecto_financiero_ocs_m5");



ALTER TABLE ONLY "finanzas"."empleado"
    ADD CONSTRAINT "empleado_pkey" PRIMARY KEY ("rut_empleado");



ALTER TABLE ONLY "finanzas"."envio_importacion_m5"
    ADD CONSTRAINT "envio_importacion_m5_pkey" PRIMARY KEY ("id_envio_importacion_m5");



ALTER TABLE ONLY "finanzas"."envio_importacion_m5"
    ADD CONSTRAINT "envio_importacion_m5_referencia_normalizada_key" UNIQUE ("referencia_normalizada");



ALTER TABLE ONLY "finanzas"."envio_orden_compra_m5"
    ADD CONSTRAINT "envio_orden_compra_m5_pkey" PRIMARY KEY ("id_envio_orden_m5");



ALTER TABLE ONLY "finanzas"."esquema_remuneracional"
    ADD CONSTRAINT "esquema_remuneracional_codigo_key" UNIQUE ("codigo");



ALTER TABLE ONLY "finanzas"."esquema_remuneracional"
    ADD CONSTRAINT "esquema_remuneracional_nombre_key" UNIQUE ("nombre");



ALTER TABLE ONLY "finanzas"."esquema_remuneracional"
    ADD CONSTRAINT "esquema_remuneracional_pkey" PRIMARY KEY ("id_esquema_remuneracional");



ALTER TABLE ONLY "finanzas"."estado_tarea_produccion_ot"
    ADD CONSTRAINT "estado_tarea_produccion_ot_id_tarea_ejecutable_ot_key" UNIQUE ("id_tarea_ejecutable_ot");



ALTER TABLE ONLY "finanzas"."estado_tarea_produccion_ot"
    ADD CONSTRAINT "estado_tarea_produccion_ot_pkey" PRIMARY KEY ("id_estado_tarea_produccion");



ALTER TABLE ONLY "finanzas"."etapa_adicional_orden_trabajo"
    ADD CONSTRAINT "etapa_adicional_orden_trabajo_clave_idempotencia_key" UNIQUE ("clave_idempotencia");



ALTER TABLE ONLY "finanzas"."etapa_adicional_orden_trabajo"
    ADD CONSTRAINT "etapa_adicional_orden_trabajo_pkey" PRIMARY KEY ("id_etapa_adicional_ot");



ALTER TABLE ONLY "finanzas"."evaluacion_credito"
    ADD CONSTRAINT "evaluacion_credito_pkey" PRIMARY KEY ("id_evaluacion_credito");



ALTER TABLE ONLY "finanzas"."evento_auditoria_m9"
    ADD CONSTRAINT "evento_auditoria_m9_identidad_logica_key" UNIQUE ("identidad_logica");



ALTER TABLE ONLY "finanzas"."evento_auditoria_m9"
    ADD CONSTRAINT "evento_auditoria_m9_pkey" PRIMARY KEY ("id_evento_m9");



ALTER TABLE ONLY "finanzas"."evento_auditoria"
    ADD CONSTRAINT "evento_auditoria_pkey" PRIMARY KEY ("id_evento_auditoria");



ALTER TABLE ONLY "finanzas"."evento_credito_m8"
    ADD CONSTRAINT "evento_credito_m8_pkey" PRIMARY KEY ("id_evento");



ALTER TABLE ONLY "finanzas"."evento_operacional_documental"
    ADD CONSTRAINT "evento_operacional_documental_clave_idempotencia_key" UNIQUE ("clave_idempotencia");



ALTER TABLE ONLY "finanzas"."evento_operacional_documental"
    ADD CONSTRAINT "evento_operacional_documental_pkey" PRIMARY KEY ("id_evento_operacional");



ALTER TABLE ONLY "finanzas"."condicion_comercial_version"
    ADD CONSTRAINT "ex_condicion_version_vigencia" EXCLUDE USING "gist" ("id_condicion_comercial" WITH =, "daterange"("vigencia_desde", COALESCE("vigencia_hasta", 'infinity'::"date"), '[]'::"text") WITH &&) WHERE ((("estado")::"text" = 'PUBLICADA'::"text"));



ALTER TABLE ONLY "finanzas"."precio_opcional_comercial"
    ADD CONSTRAINT "ex_precio_opcional_vigencia" EXCLUDE USING "gist" ("id_opcional_comercial" WITH =, "segmento_comercial" WITH =, "id_moneda" WITH =, "daterange"("vigencia_desde", COALESCE("vigencia_hasta", 'infinity'::"date"), '[]'::"text") WITH &&) WHERE ((("estado")::"text" = 'ACTIVO'::"text"));



ALTER TABLE ONLY "finanzas"."precio_producto_comercial"
    ADD CONSTRAINT "ex_precio_producto_vigencia" EXCLUDE USING "gist" ("id_extension_producto_comercial" WITH =, "segmento_comercial" WITH =, "id_moneda" WITH =, "daterange"("vigencia_desde", COALESCE("vigencia_hasta", 'infinity'::"date"), '[]'::"text") WITH &&) WHERE ((("estado")::"text" = 'ACTIVO'::"text"));



ALTER TABLE ONLY "finanzas"."precio_servicio_comercial"
    ADD CONSTRAINT "ex_precio_servicio_vigencia" EXCLUDE USING "gist" ("id_servicio_comercial" WITH =, "segmento_comercial" WITH =, "id_moneda" WITH =, "daterange"("vigencia_desde", COALESCE(("vigencia_hasta" + 1), 'infinity'::"date"), '[)'::"text") WITH &&) WHERE ((("estado")::"text" = 'ACTIVO'::"text"));



ALTER TABLE ONLY "finanzas"."tarifa_instalacion_comercial"
    ADD CONSTRAINT "ex_tarifa_instalacion_vigencia" EXCLUDE USING "gist" ("alcance_geografico" WITH =, "region_normalizada" WITH =, COALESCE("comuna_normalizada", ''::character varying) WITH =, "daterange"("vigencia_desde", COALESCE("vigencia_hasta", 'infinity'::"date"), '[]'::"text") WITH &&) WHERE ((("estado")::"text" = 'ACTIVA'::"text"));



ALTER TABLE ONLY "finanzas"."extension_producto_comercial"
    ADD CONSTRAINT "extension_producto_comercial_codigo_comercial_key" UNIQUE ("codigo_comercial");



ALTER TABLE ONLY "finanzas"."extension_producto_comercial"
    ADD CONSTRAINT "extension_producto_comercial_id_item_comercial_key" UNIQUE ("id_item_comercial");



ALTER TABLE ONLY "finanzas"."extension_producto_comercial"
    ADD CONSTRAINT "extension_producto_comercial_pkey" PRIMARY KEY ("id_extension_producto_comercial");



ALTER TABLE ONLY "finanzas"."extension_producto_comercial"
    ADD CONSTRAINT "extension_producto_comercial_producto_terminado_id_producto_key" UNIQUE ("producto_terminado_id_producto");



ALTER TABLE ONLY "finanzas"."familia_producto_comercial"
    ADD CONSTRAINT "familia_producto_comercial_codigo_key" UNIQUE ("codigo");



ALTER TABLE ONLY "finanzas"."familia_producto_comercial"
    ADD CONSTRAINT "familia_producto_comercial_pkey" PRIMARY KEY ("id_familia_producto_comercial");



ALTER TABLE ONLY "finanzas"."feriado_chile_m5"
    ADD CONSTRAINT "feriado_chile_m5_pkey" PRIMARY KEY ("fecha");



ALTER TABLE ONLY "finanzas"."ficha_cliente"
    ADD CONSTRAINT "ficha_cliente_id_cliente_financiero_key" UNIQUE ("id_cliente_financiero");



ALTER TABLE ONLY "finanzas"."ficha_cliente"
    ADD CONSTRAINT "ficha_cliente_pkey" PRIMARY KEY ("id_ficha_cliente");



ALTER TABLE ONLY "finanzas"."fondo_caja_chica_m5"
    ADD CONSTRAINT "fondo_caja_chica_m5_pkey" PRIMARY KEY ("id_fondo_caja_chica_m5");



ALTER TABLE ONLY "finanzas"."fondo_global_credito"
    ADD CONSTRAINT "fondo_global_credito_pkey" PRIMARY KEY ("id_fondo_global_credito");



ALTER TABLE ONLY "finanzas"."gasto_caja_chica_m5"
    ADD CONSTRAINT "gasto_caja_chica_m5_pkey" PRIMARY KEY ("id_gasto_caja_chica_m5");



ALTER TABLE ONLY "finanzas"."gasto_caja_chica"
    ADD CONSTRAINT "gasto_caja_chica_pkey" PRIMARY KEY ("id_gasto_caja_chica");



ALTER TABLE ONLY "finanzas"."grupo_alternativas_b2c"
    ADD CONSTRAINT "grupo_alternativas_b2c_pkey" PRIMARY KEY ("id_grupo_alternativas_b2c");



ALTER TABLE ONLY "finanzas"."guia_despacho"
    ADD CONSTRAINT "guia_despacho_pkey" PRIMARY KEY ("id_guia_despacho");



ALTER TABLE ONLY "finanzas"."hallazgo_discrepancia_m11"
    ADD CONSTRAINT "hallazgo_discrepancia_m11_clave_idempotencia_key" UNIQUE ("clave_idempotencia");



ALTER TABLE ONLY "finanzas"."hallazgo_discrepancia_m11"
    ADD CONSTRAINT "hallazgo_discrepancia_m11_pkey" PRIMARY KEY ("id_hallazgo_discrepancia_m11");



ALTER TABLE ONLY "finanzas"."historial_cambio_produccion_ot"
    ADD CONSTRAINT "historial_cambio_produccion_ot_pkey" PRIMARY KEY ("id_historial_cambio");



ALTER TABLE ONLY "finanzas"."historial_categoria_egreso_m5"
    ADD CONSTRAINT "historial_categoria_egreso_m5_pkey" PRIMARY KEY ("id_historial_categoria_m5");



ALTER TABLE ONLY "finanzas"."historial_decision_alternativa_b2c"
    ADD CONSTRAINT "historial_decision_alternativa_b2c_pkey" PRIMARY KEY ("id_historial_decision");



ALTER TABLE ONLY "finanzas"."historial_envio_importacion_m5"
    ADD CONSTRAINT "historial_envio_importacion_m5_pkey" PRIMARY KEY ("id_historial_envio_m5");



ALTER TABLE ONLY "finanzas"."historial_familia_producto_comercial"
    ADD CONSTRAINT "historial_familia_producto_comercial_pkey" PRIMARY KEY ("id_historial_familia_producto_comercial");



ALTER TABLE ONLY "finanzas"."historial_fondo_caja_chica_m5"
    ADD CONSTRAINT "historial_fondo_caja_chica_m5_pkey" PRIMARY KEY ("id_historial_fondo_m5");



ALTER TABLE ONLY "finanzas"."historial_gasto_caja_chica_m5"
    ADD CONSTRAINT "historial_gasto_caja_chica_m5_pkey" PRIMARY KEY ("id_historial_gasto_m5");



ALTER TABLE ONLY "finanzas"."historial_orden_compra_servicio_m5"
    ADD CONSTRAINT "historial_orden_compra_servicio_m5_pkey" PRIMARY KEY ("id_historial_ocs_m5");



ALTER TABLE ONLY "finanzas"."historial_ot_imputacion_m5"
    ADD CONSTRAINT "historial_ot_imputacion_m5_pkey" PRIMARY KEY ("id_historial_ot_m5");



ALTER TABLE ONLY "finanzas"."historial_precio_material"
    ADD CONSTRAINT "historial_precio_material_pkey" PRIMARY KEY ("id_historial_precio_material");



ALTER TABLE ONLY "finanzas"."historial_producto_comercial"
    ADD CONSTRAINT "historial_producto_comercial_pkey" PRIMARY KEY ("id_historial_producto_comercial");



ALTER TABLE ONLY "finanzas"."historial_proveedor_m5"
    ADD CONSTRAINT "historial_proveedor_m5_pkey" PRIMARY KEY ("id_historial_proveedor_m5");



ALTER TABLE ONLY "finanzas"."historial_rectificacion_orden_trabajo"
    ADD CONSTRAINT "historial_rectificacion_orden_trabajo_pkey" PRIMARY KEY ("id_historial_rectificacion");



ALTER TABLE ONLY "finanzas"."historial_respaldo_pago_m5"
    ADD CONSTRAINT "historial_respaldo_pago_m5_pkey" PRIMARY KEY ("id_historial_respaldo_m5");



ALTER TABLE ONLY "finanzas"."historial_seleccion_alternativa_b2c"
    ADD CONSTRAINT "historial_seleccion_alternativa_b2c_pkey" PRIMARY KEY ("id_historial_seleccion");



ALTER TABLE ONLY "finanzas"."historial_tarifa_tarea"
    ADD CONSTRAINT "historial_tarifa_tarea_pkey" PRIMARY KEY ("id_historial_tarifa_tarea");



ALTER TABLE ONLY "finanzas"."historial_umbral_reclasificacion_m5"
    ADD CONSTRAINT "historial_umbral_reclasificacion_m5_pkey" PRIMARY KEY ("id_historial_umbral_m5");



ALTER TABLE ONLY "finanzas"."historial_unidad_fisica_ot"
    ADD CONSTRAINT "historial_unidad_fisica_ot_pkey" PRIMARY KEY ("id_historial_unidad_fisica_ot");



ALTER TABLE ONLY "finanzas"."hito_cobro"
    ADD CONSTRAINT "hito_cobro_pkey" PRIMARY KEY ("id_hito_cobro");



ALTER TABLE ONLY "finanzas"."intencion_carga_documental"
    ADD CONSTRAINT "intencion_carga_documental_clave_temporal_key" UNIQUE ("clave_temporal");



ALTER TABLE ONLY "finanzas"."intencion_carga_documental"
    ADD CONSTRAINT "intencion_carga_documental_id_publico_key" UNIQUE ("id_publico");



ALTER TABLE ONLY "finanzas"."intencion_carga_documental"
    ADD CONSTRAINT "intencion_carga_documental_pkey" PRIMARY KEY ("id_intencion_carga");



ALTER TABLE ONLY "finanzas"."intento_retry_m9"
    ADD CONSTRAINT "intento_retry_m9_pkey" PRIMARY KEY ("id_intento_m9");



ALTER TABLE ONLY "finanzas"."liberacion_orden_trabajo"
    ADD CONSTRAINT "liberacion_orden_trabajo_id_unidad_fisica_ot_key" UNIQUE ("id_unidad_fisica_ot");



ALTER TABLE ONLY "finanzas"."liberacion_orden_trabajo"
    ADD CONSTRAINT "liberacion_orden_trabajo_id_version_rectificacion_key" UNIQUE ("id_version_rectificacion");



ALTER TABLE ONLY "finanzas"."liberacion_orden_trabajo"
    ADD CONSTRAINT "liberacion_orden_trabajo_pkey" PRIMARY KEY ("id_liberacion_ot");



ALTER TABLE ONLY "finanzas"."limite_credito_cliente"
    ADD CONSTRAINT "limite_credito_cliente_pkey" PRIMARY KEY ("id_limite_credito_cliente");



ALTER TABLE ONLY "finanzas"."limite_global_credito_m8"
    ADD CONSTRAINT "limite_global_credito_m8_pkey" PRIMARY KEY ("id_limite_global");



ALTER TABLE ONLY "finanzas"."linea_orden_compra_b2b"
    ADD CONSTRAINT "linea_orden_compra_b2b_pkey" PRIMARY KEY ("id_linea_orden_compra_b2b");



ALTER TABLE ONLY "finanzas"."liquidacion_remuneracion"
    ADD CONSTRAINT "liquidacion_remuneracion_pkey" PRIMARY KEY ("id_liquidacion_remuneracion");



ALTER TABLE ONLY "finanzas"."medio_pago"
    ADD CONSTRAINT "medio_pago_nombre_medio_pago_key" UNIQUE ("nombre_medio_pago");



ALTER TABLE ONLY "finanzas"."medio_pago"
    ADD CONSTRAINT "medio_pago_pkey" PRIMARY KEY ("id_medio_pago");



ALTER TABLE ONLY "finanzas"."moneda"
    ADD CONSTRAINT "moneda_codigo_moneda_key" UNIQUE ("codigo_moneda");



ALTER TABLE ONLY "finanzas"."moneda"
    ADD CONSTRAINT "moneda_pkey" PRIMARY KEY ("id_moneda");



ALTER TABLE ONLY "finanzas"."movimiento_bancario"
    ADD CONSTRAINT "movimiento_bancario_pkey" PRIMARY KEY ("id_movimiento_bancario");



ALTER TABLE ONLY "finanzas"."movimiento_financiero"
    ADD CONSTRAINT "movimiento_financiero_pkey" PRIMARY KEY ("id_movimiento_financiero");



ALTER TABLE ONLY "finanzas"."movimiento_pago_proveedor_m5"
    ADD CONSTRAINT "movimiento_pago_proveedor_m5_pkey" PRIMARY KEY ("id_movimiento_pago_m5");



ALTER TABLE ONLY "finanzas"."nota_venta"
    ADD CONSTRAINT "nota_venta_numero_nota_venta_key" UNIQUE ("numero_nota_venta");



ALTER TABLE ONLY "finanzas"."nota_venta"
    ADD CONSTRAINT "nota_venta_pkey" PRIMARY KEY ("id_nota_venta");



ALTER TABLE ONLY "finanzas"."obligacion_proveedor_m5"
    ADD CONSTRAINT "obligacion_proveedor_m5_id_documento_m5_key" UNIQUE ("id_documento_m5");



ALTER TABLE ONLY "finanzas"."obligacion_proveedor_m5"
    ADD CONSTRAINT "obligacion_proveedor_m5_pkey" PRIMARY KEY ("id_obligacion_m5");



ALTER TABLE ONLY "finanzas"."opcional_comercial"
    ADD CONSTRAINT "opcional_comercial_codigo_key" UNIQUE ("codigo");



ALTER TABLE ONLY "finanzas"."opcional_comercial"
    ADD CONSTRAINT "opcional_comercial_pkey" PRIMARY KEY ("id_opcional_comercial");



ALTER TABLE ONLY "finanzas"."operacion_pago_proveedor_m5"
    ADD CONSTRAINT "operacion_pago_proveedor_m5_pkey" PRIMARY KEY ("id_operacion_pago_m5");



ALTER TABLE ONLY "finanzas"."orden_compra_b2b"
    ADD CONSTRAINT "orden_compra_b2b_pkey" PRIMARY KEY ("id_orden_compra_b2b");



ALTER TABLE ONLY "finanzas"."orden_compra_servicio_m5"
    ADD CONSTRAINT "orden_compra_servicio_m5_pkey" PRIMARY KEY ("id_orden_compra_servicio_m5");



ALTER TABLE ONLY "finanzas"."origen_alerta_financiera"
    ADD CONSTRAINT "origen_alerta_financiera_pkey" PRIMARY KEY ("id_origen_alerta_financiera");



ALTER TABLE ONLY "finanzas"."origen_movimiento_financiero"
    ADD CONSTRAINT "origen_movimiento_financiero_pkey" PRIMARY KEY ("id_origen_movimiento_financiero");



ALTER TABLE ONLY "finanzas"."pago_cliente"
    ADD CONSTRAINT "pago_cliente_pkey" PRIMARY KEY ("id_pago_cliente");



ALTER TABLE ONLY "finanzas"."pago_proveedor"
    ADD CONSTRAINT "pago_proveedor_pkey" PRIMARY KEY ("id_pago_proveedor");



ALTER TABLE ONLY "finanzas"."pago_remuneracion"
    ADD CONSTRAINT "pago_remuneracion_clave_idempotencia_key" UNIQUE ("clave_idempotencia");



ALTER TABLE ONLY "finanzas"."pago_remuneracion"
    ADD CONSTRAINT "pago_remuneracion_pkey" PRIMARY KEY ("id_pago_remuneracion");



ALTER TABLE ONLY "finanzas"."pais"
    ADD CONSTRAINT "pais_nombre_pais_key" UNIQUE ("nombre_pais");



ALTER TABLE ONLY "finanzas"."pais"
    ADD CONSTRAINT "pais_pkey" PRIMARY KEY ("id_pais");



ALTER TABLE ONLY "finanzas"."parametro_remuneracional"
    ADD CONSTRAINT "parametro_remuneracional_pkey" PRIMARY KEY ("id_parametro_remuneracional");



ALTER TABLE ONLY "finanzas"."pendiente_evento_m9"
    ADD CONSTRAINT "pendiente_evento_m9_identidad_logica_key" UNIQUE ("identidad_logica");



ALTER TABLE ONLY "finanzas"."pendiente_evento_m9"
    ADD CONSTRAINT "pendiente_evento_m9_pkey" PRIMARY KEY ("id_pendiente_m9");



ALTER TABLE ONLY "finanzas"."periodo_remuneracion"
    ADD CONSTRAINT "periodo_remuneracion_pkey" PRIMARY KEY ("id_periodo_remuneracion");



ALTER TABLE ONLY "finanzas"."correspondencia_linea_oc_item_tecnico"
    ADD CONSTRAINT "pk_correspondencia_linea_oc_item_tecnico" PRIMARY KEY ("id_linea_orden_compra_b2b", "id_unidad_fisica_ot");



ALTER TABLE ONLY "finanzas"."documento_pdf_postgres"
    ADD CONSTRAINT "pk_documento_pdf_postgres" PRIMARY KEY ("contenedor", "clave");



ALTER TABLE ONLY "finanzas"."idempotencia_operacion_comercial"
    ADD CONSTRAINT "pk_idempotencia_operacion_comercial" PRIMARY KEY ("clave");



ALTER TABLE ONLY "finanzas"."plantilla_documental_comercial"
    ADD CONSTRAINT "plantilla_documental_comercial_codigo_key" UNIQUE ("codigo");



ALTER TABLE ONLY "finanzas"."plantilla_documental_comercial"
    ADD CONSTRAINT "plantilla_documental_comercial_pkey" PRIMARY KEY ("id_plantilla_documental");



ALTER TABLE ONLY "finanzas"."plantilla_documental_version"
    ADD CONSTRAINT "plantilla_documental_version_pkey" PRIMARY KEY ("id_plantilla_documental_version");



ALTER TABLE ONLY "finanzas"."plantilla_fabricacion_familia"
    ADD CONSTRAINT "plantilla_fabricacion_familia_id_familia_producto_comercial_key" UNIQUE ("id_familia_producto_comercial");



ALTER TABLE ONLY "finanzas"."plantilla_fabricacion_familia"
    ADD CONSTRAINT "plantilla_fabricacion_familia_pkey" PRIMARY KEY ("id_plantilla_fabricacion");



ALTER TABLE ONLY "finanzas"."politica_tratamiento_m9"
    ADD CONSTRAINT "politica_tratamiento_m9_pkey" PRIMARY KEY ("id_politica_m9");



ALTER TABLE ONLY "finanzas"."precio_opcional_comercial"
    ADD CONSTRAINT "precio_opcional_comercial_pkey" PRIMARY KEY ("id_precio_opcional_comercial");



ALTER TABLE ONLY "finanzas"."precio_producto_comercial"
    ADD CONSTRAINT "precio_producto_comercial_pkey" PRIMARY KEY ("id_precio_producto_comercial");



ALTER TABLE ONLY "finanzas"."precio_servicio_comercial"
    ADD CONSTRAINT "precio_servicio_comercial_pkey" PRIMARY KEY ("id_precio_servicio_comercial");



ALTER TABLE ONLY "finanzas"."prestador_honorarios"
    ADD CONSTRAINT "prestador_honorarios_identificador_key" UNIQUE ("identificador");



ALTER TABLE ONLY "finanzas"."prestador_honorarios"
    ADD CONSTRAINT "prestador_honorarios_pkey" PRIMARY KEY ("id_prestador_honorarios");



ALTER TABLE ONLY "finanzas"."presupuesto_manual_m10"
    ADD CONSTRAINT "presupuesto_manual_m10_pkey" PRIMARY KEY ("id_presupuesto_manual_m10");



ALTER TABLE ONLY "finanzas"."prevision_salud"
    ADD CONSTRAINT "prevision_salud_nombre_prevision_salud_key" UNIQUE ("nombre_prevision_salud");



ALTER TABLE ONLY "finanzas"."prevision_salud"
    ADD CONSTRAINT "prevision_salud_pkey" PRIMARY KEY ("id_prevision_salud");



ALTER TABLE ONLY "finanzas"."producto_comercial_documento"
    ADD CONSTRAINT "producto_comercial_documento_pkey" PRIMARY KEY ("id_producto_comercial_documento");



ALTER TABLE ONLY "finanzas"."producto_comercial_version"
    ADD CONSTRAINT "producto_comercial_version_pkey" PRIMARY KEY ("id_producto_comercial_version");



ALTER TABLE ONLY "finanzas"."propuesta_imputacion_m5"
    ADD CONSTRAINT "propuesta_imputacion_m5_pkey" PRIMARY KEY ("id_propuesta_imputacion_m5");



ALTER TABLE ONLY "finanzas"."proveedor"
    ADD CONSTRAINT "proveedor_pkey" PRIMARY KEY ("id_proveedor");



ALTER TABLE ONLY "finanzas"."proyeccion_financiera_m7"
    ADD CONSTRAINT "proyeccion_financiera_m7_pkey" PRIMARY KEY ("id_proyeccion_financiera_m7");



ALTER TABLE ONLY "finanzas"."proyecto_financiero"
    ADD CONSTRAINT "proyecto_financiero_codigo_proyecto_financiero_key" UNIQUE ("codigo_proyecto_financiero");



ALTER TABLE ONLY "finanzas"."proyecto_financiero"
    ADD CONSTRAINT "proyecto_financiero_pkey" PRIMARY KEY ("id_proyecto_financiero");



ALTER TABLE ONLY "finanzas"."reclasificacion_egreso_m5"
    ADD CONSTRAINT "reclasificacion_egreso_m5_pkey" PRIMARY KEY ("id_reclasificacion_m5");



ALTER TABLE ONLY "finanzas"."rectificacion_orden_trabajo"
    ADD CONSTRAINT "rectificacion_orden_trabajo_id_especificacion_puerta_key" UNIQUE ("id_especificacion_puerta");



ALTER TABLE ONLY "finanzas"."rectificacion_orden_trabajo"
    ADD CONSTRAINT "rectificacion_orden_trabajo_id_unidad_fisica_ot_key" UNIQUE ("id_unidad_fisica_ot");



ALTER TABLE ONLY "finanzas"."rectificacion_orden_trabajo"
    ADD CONSTRAINT "rectificacion_orden_trabajo_pkey" PRIMARY KEY ("id_rectificacion_ot");



ALTER TABLE ONLY "finanzas"."reduccion_compromiso_credito_m8"
    ADD CONSTRAINT "reduccion_compromiso_credito_m8_id_pago_cliente_key" UNIQUE ("id_pago_cliente");



ALTER TABLE ONLY "finanzas"."reduccion_compromiso_credito_m8"
    ADD CONSTRAINT "reduccion_compromiso_credito_m8_pkey" PRIMARY KEY ("id_reduccion");



ALTER TABLE ONLY "finanzas"."regularizacion_extraordinaria"
    ADD CONSTRAINT "regularizacion_extraordinaria_id_ajuste_posterior_key" UNIQUE ("id_ajuste_posterior");



ALTER TABLE ONLY "finanzas"."regularizacion_extraordinaria"
    ADD CONSTRAINT "regularizacion_extraordinaria_pkey" PRIMARY KEY ("id_regularizacion");



ALTER TABLE ONLY "finanzas"."relacion_laboral_empleado"
    ADD CONSTRAINT "relacion_laboral_empleado_pkey" PRIMARY KEY ("id_relacion_laboral_empleado");



ALTER TABLE ONLY "finanzas"."remuneracion"
    ADD CONSTRAINT "remuneracion_pkey" PRIMARY KEY ("id_remuneracion");



ALTER TABLE ONLY "finanzas"."resolucion_hallazgo_m11"
    ADD CONSTRAINT "resolucion_hallazgo_m11_clave_idempotencia_key" UNIQUE ("clave_idempotencia");



ALTER TABLE ONLY "finanzas"."resolucion_hallazgo_m11"
    ADD CONSTRAINT "resolucion_hallazgo_m11_pkey" PRIMARY KEY ("id_resolucion_hallazgo_m11");



ALTER TABLE ONLY "finanzas"."resolucion_solicitud_crediticia_m8"
    ADD CONSTRAINT "resolucion_solicitud_crediticia_m8_id_solicitud_crediticia_key" UNIQUE ("id_solicitud_crediticia");



ALTER TABLE ONLY "finanzas"."resolucion_solicitud_crediticia_m8"
    ADD CONSTRAINT "resolucion_solicitud_crediticia_m8_pkey" PRIMARY KEY ("id_resolucion");



ALTER TABLE ONLY "finanzas"."respaldo_gasto_caja_chica_m5"
    ADD CONSTRAINT "respaldo_gasto_caja_chica_m5_pkey" PRIMARY KEY ("id_respaldo_gasto_m5");



ALTER TABLE ONLY "finanzas"."respaldo_pago_proveedor_m5"
    ADD CONSTRAINT "respaldo_pago_proveedor_m5_pkey" PRIMARY KEY ("id_respaldo_pago_m5");



ALTER TABLE ONLY "finanzas"."reversion_compensacion_m5"
    ADD CONSTRAINT "reversion_compensacion_m5_pkey" PRIMARY KEY ("id_reversion_compensacion_m5");



ALTER TABLE ONLY "finanzas"."reversion_movimiento_pago_m5"
    ADD CONSTRAINT "reversion_movimiento_pago_m5_pkey" PRIMARY KEY ("id_reversion_movimiento_m5");



ALTER TABLE ONLY "finanzas"."reversion_nota_venta"
    ADD CONSTRAINT "reversion_nota_venta_pkey" PRIMARY KEY ("id_reversion_nota_venta");



ALTER TABLE ONLY "finanzas"."reversion_pago"
    ADD CONSTRAINT "reversion_pago_pkey" PRIMARY KEY ("id_reversion_pago");



ALTER TABLE ONLY "finanzas"."reversion_pago_remuneracion"
    ADD CONSTRAINT "reversion_pago_remuneracion_pkey" PRIMARY KEY ("id_reversion_pago_remuneracion");



ALTER TABLE ONLY "finanzas"."saldo_favor_cliente"
    ADD CONSTRAINT "saldo_favor_cliente_pkey" PRIMARY KEY ("id_saldo_favor_cliente");



ALTER TABLE ONLY "finanzas"."saldo_favor_proveedor_m5"
    ADD CONSTRAINT "saldo_favor_proveedor_m5_id_ajuste_origen_m5_key" UNIQUE ("id_ajuste_origen_m5");



ALTER TABLE ONLY "finanzas"."saldo_favor_proveedor_m5"
    ADD CONSTRAINT "saldo_favor_proveedor_m5_pkey" PRIMARY KEY ("id_saldo_favor_m5");



ALTER TABLE ONLY "finanzas"."saldo_inicial_bancario_m7"
    ADD CONSTRAINT "saldo_inicial_bancario_m7_pkey" PRIMARY KEY ("id_saldo_inicial_bancario_m7");



ALTER TABLE ONLY "finanzas"."servicio_comercial"
    ADD CONSTRAINT "servicio_comercial_codigo_key" UNIQUE ("codigo");



ALTER TABLE ONLY "finanzas"."servicio_comercial"
    ADD CONSTRAINT "servicio_comercial_pkey" PRIMARY KEY ("id_servicio_comercial");



ALTER TABLE ONLY "finanzas"."solicitud_correccion_tecnica_ot"
    ADD CONSTRAINT "solicitud_correccion_tecnica_ot_pkey" PRIMARY KEY ("id_solicitud_correccion");



ALTER TABLE ONLY "finanzas"."solicitud_crediticia_m8"
    ADD CONSTRAINT "solicitud_crediticia_m8_pkey" PRIMARY KEY ("id_solicitud_crediticia");



ALTER TABLE ONLY "finanzas"."solicitud_reasignacion_costo_m5"
    ADD CONSTRAINT "solicitud_reasignacion_costo_m5_pkey" PRIMARY KEY ("id_solicitud_reasignacion_m5");



ALTER TABLE ONLY "finanzas"."tarea_catalogada"
    ADD CONSTRAINT "tarea_catalogada_nombre_tarea_key" UNIQUE ("nombre_tarea");



ALTER TABLE ONLY "finanzas"."tarea_catalogada"
    ADD CONSTRAINT "tarea_catalogada_pkey" PRIMARY KEY ("id_tarea_catalogada");



ALTER TABLE ONLY "finanzas"."tarea_ejecutable_unidad_ot"
    ADD CONSTRAINT "tarea_ejecutable_plan_uq" UNIQUE ("id_unidad_fisica_ot", "id_version_rectificacion", "id_tarea_planificacion");



ALTER TABLE ONLY "finanzas"."tarea_ejecutable_unidad_ot"
    ADD CONSTRAINT "tarea_ejecutable_unidad_ot_id_tarea_key" UNIQUE ("id_tarea");



ALTER TABLE ONLY "finanzas"."tarea_ejecutable_unidad_ot"
    ADD CONSTRAINT "tarea_ejecutable_unidad_ot_pkey" PRIMARY KEY ("id_tarea_ejecutable_ot");



ALTER TABLE ONLY "finanzas"."tarea_remunerable"
    ADD CONSTRAINT "tarea_remunerable_pkey" PRIMARY KEY ("id_tarea_remunerable");



ALTER TABLE ONLY "finanzas"."tarifa_esquema_remuneracional"
    ADD CONSTRAINT "tarifa_esquema_remuneracional_pkey" PRIMARY KEY ("id_tarifa_esquema");



ALTER TABLE ONLY "finanzas"."tarifa_instalacion_comercial"
    ADD CONSTRAINT "tarifa_instalacion_comercial_pkey" PRIMARY KEY ("id_tarifa_instalacion_comercial");



ALTER TABLE ONLY "finanzas"."tipo_cliente_financiero"
    ADD CONSTRAINT "tipo_cliente_financiero_nombre_tipo_cliente_financiero_key" UNIQUE ("nombre_tipo_cliente_financiero");



ALTER TABLE ONLY "finanzas"."tipo_cliente_financiero"
    ADD CONSTRAINT "tipo_cliente_financiero_pkey" PRIMARY KEY ("id_tipo_cliente_financiero");



ALTER TABLE ONLY "finanzas"."tipo_documento"
    ADD CONSTRAINT "tipo_documento_nombre_tipo_documento_key" UNIQUE ("nombre_tipo_documento");



ALTER TABLE ONLY "finanzas"."tipo_documento"
    ADD CONSTRAINT "tipo_documento_pkey" PRIMARY KEY ("id_tipo_documento");



ALTER TABLE ONLY "finanzas"."tipo_identificador"
    ADD CONSTRAINT "tipo_identificador_nombre_tipo_identificador_key" UNIQUE ("nombre_tipo_identificador");



ALTER TABLE ONLY "finanzas"."tipo_identificador"
    ADD CONSTRAINT "tipo_identificador_pkey" PRIMARY KEY ("id_tipo_identificador");



ALTER TABLE ONLY "finanzas"."tipo_vinculo_laboral"
    ADD CONSTRAINT "tipo_vinculo_laboral_nombre_tipo_vinculo_laboral_key" UNIQUE ("nombre_tipo_vinculo_laboral");



ALTER TABLE ONLY "finanzas"."tipo_vinculo_laboral"
    ADD CONSTRAINT "tipo_vinculo_laboral_pkey" PRIMARY KEY ("id_tipo_vinculo_laboral");



ALTER TABLE ONLY "finanzas"."tramo_impuesto_renta"
    ADD CONSTRAINT "tramo_impuesto_renta_pkey" PRIMARY KEY ("id_tramo_impuesto_renta");



ALTER TABLE ONLY "finanzas"."tratamiento_privacidad_m9"
    ADD CONSTRAINT "tratamiento_privacidad_m9_pkey" PRIMARY KEY ("id_tratamiento_m9");



ALTER TABLE ONLY "finanzas"."tratamiento_remuneracional_ejecucion"
    ADD CONSTRAINT "tratamiento_remuneracional_ejecucion_pkey" PRIMARY KEY ("id_tratamiento_remuneracional");



ALTER TABLE ONLY "finanzas"."unidad_fisica_orden_trabajo"
    ADD CONSTRAINT "unidad_fisica_orden_trabajo_id_orden_trabajo_key" UNIQUE ("id_orden_trabajo");



ALTER TABLE ONLY "finanzas"."unidad_fisica_orden_trabajo"
    ADD CONSTRAINT "unidad_fisica_orden_trabajo_pkey" PRIMARY KEY ("id_unidad_fisica_ot");



ALTER TABLE ONLY "finanzas"."unidad_fisica_orden_trabajo"
    ADD CONSTRAINT "unidad_fisica_ot_detalle_unidad_uq" UNIQUE ("id_detalle_cotizacion", "numero_unidad");



ALTER TABLE ONLY "finanzas"."ajuste_obligacion_proveedor_m5"
    ADD CONSTRAINT "uq_ajuste_documental_m5_identidad" UNIQUE ("id_proveedor", "id_tipo_documento", "folio_normalizado");



ALTER TABLE ONLY "finanzas"."alternativa_b2c"
    ADD CONSTRAINT "uq_alternativa_b2c_numero" UNIQUE ("id_grupo_alternativas_b2c", "numero_alternativa");



ALTER TABLE ONLY "finanzas"."alternativa_b2c_opcional"
    ADD CONSTRAINT "uq_alternativa_b2c_opcional" UNIQUE ("id_alternativa_b2c", "id_compatibilidad_opcional");



ALTER TABLE ONLY "finanzas"."anulacion_movimiento_pago_m5"
    ADD CONSTRAINT "uq_anulacion_movimiento_pago_m5" UNIQUE ("id_movimiento_pago_m5");



ALTER TABLE ONLY "finanzas"."aplicacion_revision_tecnica_ot"
    ADD CONSTRAINT "uq_aplicacion_revision_unidad_version" UNIQUE ("id_unidad_fisica_ot", "id_version_rectificacion");



ALTER TABLE ONLY "finanzas"."asociacion_documento_oc_m5"
    ADD CONSTRAINT "uq_asociacion_documento_m5_ocs" UNIQUE ("id_documento_m5", "id_ocs_m5");



ALTER TABLE ONLY "finanzas"."boleta_honorarios"
    ADD CONSTRAINT "uq_boleta_honorarios_prestador_folio" UNIQUE ("id_prestador", "folio");



ALTER TABLE ONLY "finanzas"."carta_comercial_b2c_version"
    ADD CONSTRAINT "uq_carta_b2c_version" UNIQUE ("id_carta_comercial_b2c", "numero_version");



ALTER TABLE ONLY "finanzas"."carta_comercial_b2c_version"
    ADD CONSTRAINT "uq_carta_b2c_version_documento" UNIQUE ("id_documento_logico");



ALTER TABLE ONLY "finanzas"."carta_comercial_b2c_version_fotografia"
    ADD CONSTRAINT "uq_carta_b2c_version_fotografia" UNIQUE ("id_carta_comercial_b2c_version", "id_producto_comercial_documento", "id_version_documento");



ALTER TABLE ONLY "finanzas"."carta_comercial_b2c_version_producto"
    ADD CONSTRAINT "uq_carta_b2c_version_orden" UNIQUE ("id_carta_comercial_b2c_version", "orden_presentacion");



ALTER TABLE ONLY "finanzas"."carta_comercial_b2c_version_producto"
    ADD CONSTRAINT "uq_carta_b2c_version_producto" UNIQUE ("id_carta_comercial_b2c_version", "id_producto_comercial_version");



ALTER TABLE ONLY "finanzas"."clasificacion_asociacion_m5"
    ADD CONSTRAINT "uq_clasificacion_m5_asociacion_categoria" UNIQUE ("id_asociacion_m5", "id_categoria_egreso_m5");



ALTER TABLE ONLY "finanzas"."compatibilidad_opcional_producto"
    ADD CONSTRAINT "uq_compatibilidad_opcional_producto" UNIQUE ("id_extension_producto_comercial", "id_opcional_comercial");



ALTER TABLE ONLY "finanzas"."concepto_remuneracion"
    ADD CONSTRAINT "uq_concepto_remuneracion_codigo_m6" UNIQUE ("codigo_m6");



ALTER TABLE ONLY "finanzas"."condicion_comercial_version"
    ADD CONSTRAINT "uq_condicion_comercial_version" UNIQUE ("id_condicion_comercial", "numero_version");



ALTER TABLE ONLY "finanzas"."configuracion_conservacion_documental"
    ADD CONSTRAINT "uq_conservacion_documental_vigencia" UNIQUE ("vigencia_desde");



ALTER TABLE ONLY "finanzas"."decision_remuneracional_retrabajo"
    ADD CONSTRAINT "uq_decision_remuneracional_incidencia" UNIQUE ("id_incidencia_retrabajo");



ALTER TABLE ONLY "finanzas"."detalle_cotizacion"
    ADD CONSTRAINT "uq_detalle_cotizacion_alternativa_aceptada" UNIQUE ("id_alternativa_b2c_aceptada");



ALTER TABLE ONLY "finanzas"."detalle_material_orden_compra_m5"
    ADD CONSTRAINT "uq_detalle_material_oc_m5" UNIQUE ("id_ocs_m5", "material_sku");



ALTER TABLE ONLY "finanzas"."detalle_presupuesto_m10"
    ADD CONSTRAINT "uq_detalle_presupuesto_m10_partida" UNIQUE ("id_version_presupuesto_m10", "mes", "tipo", "categoria");



ALTER TABLE ONLY "finanzas"."documento_compra_proveedor"
    ADD CONSTRAINT "uq_documento_compra_proveedor_numero" UNIQUE ("id_proveedor", "numero_documento", "id_tipo_documento");



ALTER TABLE ONLY "finanzas"."documento_tributario"
    ADD CONSTRAINT "uq_documento_tributario_folio" UNIQUE ("id_tipo_documento", "folio_documento");



ALTER TABLE ONLY "finanzas"."empleado"
    ADD CONSTRAINT "uq_empleado_id" UNIQUE ("id_empleado");



ALTER TABLE ONLY "finanzas"."envio_orden_compra_m5"
    ADD CONSTRAINT "uq_envio_orden_m5_externa" UNIQUE ("id_envio_importacion_m5", "tipo_orden", "id_orden_externa");



ALTER TABLE ONLY "finanzas"."envio_orden_compra_m5"
    ADD CONSTRAINT "uq_envio_orden_m5_ocs" UNIQUE ("id_envio_importacion_m5", "id_ocs_m5");



ALTER TABLE ONLY "finanzas"."etapa_adicional_orden_trabajo"
    ADD CONSTRAINT "uq_etapa_adicional_orden" UNIQUE ("id_unidad_fisica_ot", "orden");



ALTER TABLE ONLY "finanzas"."fondo_caja_chica_m5"
    ADD CONSTRAINT "uq_fondo_caja_chica_m5_periodo" UNIQUE ("anio", "mes");



ALTER TABLE ONLY "finanzas"."grupo_alternativas_b2c"
    ADD CONSTRAINT "uq_grupo_alternativa_seleccionada" UNIQUE ("id_alternativa_seleccionada");



ALTER TABLE ONLY "finanzas"."grupo_alternativas_b2c"
    ADD CONSTRAINT "uq_grupo_alternativas_b2c_numero" UNIQUE ("id_cotizacion", "numero_grupo");



ALTER TABLE ONLY "finanzas"."intencion_carga_documental"
    ADD CONSTRAINT "uq_intencion_documental_idempotencia" UNIQUE ("usuario_solicitante", "clave_idempotencia");



ALTER TABLE ONLY "finanzas"."linea_orden_compra_b2b"
    ADD CONSTRAINT "uq_linea_oc_numero" UNIQUE ("id_orden_compra_b2b", "numero_linea");



ALTER TABLE ONLY "finanzas"."liquidacion_remuneracion"
    ADD CONSTRAINT "uq_liquidacion_remuneracion_periodo" UNIQUE ("rut_empleado", "periodo_liquidacion");



ALTER TABLE ONLY "finanzas"."intento_retry_m9"
    ADD CONSTRAINT "uq_m9_intento_numero" UNIQUE ("id_pendiente_m9", "numero_intento");



ALTER TABLE ONLY "finanzas"."politica_tratamiento_m9"
    ADD CONSTRAINT "uq_m9_politica_version" UNIQUE ("id_categoria_retencion", "version");



ALTER TABLE ONLY "finanzas"."tratamiento_privacidad_m9"
    ADD CONSTRAINT "uq_m9_tratamiento_evento_politica" UNIQUE ("id_evento_m9", "id_politica_m9");



ALTER TABLE ONLY "finanzas"."medio_pago"
    ADD CONSTRAINT "uq_medio_pago_codigo" UNIQUE ("codigo_medio_pago");



ALTER TABLE ONLY "finanzas"."parametro_remuneracional"
    ADD CONSTRAINT "uq_parametro_remuneracional_codigo_vigencia" UNIQUE ("codigo", "vigencia_desde");



ALTER TABLE ONLY "finanzas"."periodo_remuneracion"
    ADD CONSTRAINT "uq_periodo_remuneracion_anio_mes" UNIQUE ("anio", "mes");



ALTER TABLE ONLY "finanzas"."plantilla_documental_version"
    ADD CONSTRAINT "uq_plantilla_documental_version" UNIQUE ("id_plantilla_documental", "numero_version");



ALTER TABLE ONLY "finanzas"."precio_opcional_comercial"
    ADD CONSTRAINT "uq_precio_opcional_inicio" UNIQUE ("id_opcional_comercial", "segmento_comercial", "id_moneda", "vigencia_desde");



ALTER TABLE ONLY "finanzas"."precio_producto_comercial"
    ADD CONSTRAINT "uq_precio_producto_inicio" UNIQUE ("id_extension_producto_comercial", "segmento_comercial", "id_moneda", "vigencia_desde");



ALTER TABLE ONLY "finanzas"."precio_servicio_comercial"
    ADD CONSTRAINT "uq_precio_servicio_inicio" UNIQUE ("id_servicio_comercial", "segmento_comercial", "id_moneda", "vigencia_desde");



ALTER TABLE ONLY "finanzas"."presupuesto_manual_m10"
    ADD CONSTRAINT "uq_presupuesto_m10_identidad" UNIQUE ("anio", "ambito", "id_moneda");



ALTER TABLE ONLY "finanzas"."producto_comercial_version"
    ADD CONSTRAINT "uq_producto_comercial_version_numero" UNIQUE ("id_extension_producto_comercial", "numero_version");



ALTER TABLE ONLY "finanzas"."producto_comercial_documento"
    ADD CONSTRAINT "uq_producto_documento_asociacion" UNIQUE ("id_extension_producto_comercial", "id_documento_logico", "tipo_documento");



ALTER TABLE ONLY "finanzas"."proveedor"
    ADD CONSTRAINT "uq_proveedor_identidad_m5" UNIQUE ("id_pais", "id_tipo_identificador", "identificador_tributario");



ALTER TABLE ONLY "finanzas"."remuneracion"
    ADD CONSTRAINT "uq_remuneracion_identidad_contexto" UNIQUE ("id_remuneracion", "id_periodo_remuneracion", "id_empleado");



ALTER TABLE ONLY "finanzas"."remuneracion"
    ADD CONSTRAINT "uq_remuneracion_reemplazo_contexto" UNIQUE ("reemplaza_a_id", "id_periodo_remuneracion", "id_empleado");



ALTER TABLE ONLY "finanzas"."tarifa_instalacion_comercial"
    ADD CONSTRAINT "uq_tarifa_instalacion_inicio" UNIQUE ("alcance_geografico", "region_normalizada", "comuna_normalizada", "vigencia_desde");



ALTER TABLE ONLY "finanzas"."tramo_impuesto_renta"
    ADD CONSTRAINT "uq_tramo_impuesto_vigencia_orden" UNIQUE ("vigencia_desde", "orden");



ALTER TABLE ONLY "finanzas"."tratamiento_remuneracional_ejecucion"
    ADD CONSTRAINT "uq_tratamiento_remuneracional_ejecucion" UNIQUE ("id_ejecucion_tarea");



ALTER TABLE ONLY "finanzas"."variante_documento"
    ADD CONSTRAINT "uq_variante_documento_tipo" UNIQUE ("id_version_original", "tipo_variante");



ALTER TABLE ONLY "finanzas"."version_documento"
    ADD CONSTRAINT "uq_version_documento_numero" UNIQUE ("id_documento_logico", "numero_version");



ALTER TABLE ONLY "finanzas"."version_documento"
    ADD CONSTRAINT "uq_version_documento_objeto" UNIQUE ("proveedor_logico", "contenedor_logico", "clave_objeto");



ALTER TABLE ONLY "finanzas"."version_presupuesto_m10"
    ADD CONSTRAINT "uq_version_presupuesto_m10_numero" UNIQUE ("id_presupuesto_manual_m10", "numero_version");



ALTER TABLE ONLY "finanzas"."variante_documento"
    ADD CONSTRAINT "variante_documento_id_version_derivada_key" UNIQUE ("id_version_derivada");



ALTER TABLE ONLY "finanzas"."variante_documento"
    ADD CONSTRAINT "variante_documento_pkey" PRIMARY KEY ("id_variante_documento");



ALTER TABLE ONLY "finanzas"."version_documento"
    ADD CONSTRAINT "version_documento_id_version_reemplazada_key" UNIQUE ("id_version_reemplazada");



ALTER TABLE ONLY "finanzas"."version_documento"
    ADD CONSTRAINT "version_documento_pkey" PRIMARY KEY ("id_version_documento");



ALTER TABLE ONLY "finanzas"."version_plantilla_fabricacion"
    ADD CONSTRAINT "version_plantilla_fabricacion_pkey" PRIMARY KEY ("id_version_plantilla");



ALTER TABLE ONLY "finanzas"."version_plantilla_fabricacion"
    ADD CONSTRAINT "version_plantilla_numero_uq" UNIQUE ("id_plantilla_fabricacion", "numero_version");



ALTER TABLE ONLY "finanzas"."version_presupuesto_m10"
    ADD CONSTRAINT "version_presupuesto_m10_pkey" PRIMARY KEY ("id_version_presupuesto_m10");



ALTER TABLE ONLY "finanzas"."version_rectificacion_orden_trabajo"
    ADD CONSTRAINT "version_rectificacion_numero_uq" UNIQUE ("id_rectificacion_ot", "numero_version");



ALTER TABLE ONLY "finanzas"."version_rectificacion_orden_trabajo"
    ADD CONSTRAINT "version_rectificacion_orden_trabajo_pkey" PRIMARY KEY ("id_version_rectificacion");



ALTER TABLE ONLY "inventario"."alerta_faltante_pedido"
    ADD CONSTRAINT "pk_alerta_faltante_pedido" PRIMARY KEY ("alerta_faltante_pedido_id_alerta_faltante");



ALTER TABLE ONLY "inventario"."alerta_inventario"
    ADD CONSTRAINT "pk_alerta_inventario" PRIMARY KEY ("alerta_inventario_id_alerta");



ALTER TABLE ONLY "inventario"."alerta_inventario_nivel_prioridad"
    ADD CONSTRAINT "pk_alerta_inventario_nivel_prioridad" PRIMARY KEY ("alerta_inventario_nivel_prioridad_id_nivel_prioridad");



ALTER TABLE ONLY "inventario"."alerta_inventario_tipo_alerta"
    ADD CONSTRAINT "pk_alerta_inventario_tipo_alerta" PRIMARY KEY ("alerta_inventario_tipo_alerta_id_tipo_alerta");



ALTER TABLE ONLY "inventario"."anaquel"
    ADD CONSTRAINT "pk_anaquel" PRIMARY KEY ("anaquel_id_anaquel");



ALTER TABLE ONLY "inventario"."bodega"
    ADD CONSTRAINT "pk_bodega" PRIMARY KEY ("bodega_id_bodega");



ALTER TABLE ONLY "inventario"."factura_compra"
    ADD CONSTRAINT "pk_factura_compra" PRIMARY KEY ("factura_compra_id_factura");



ALTER TABLE ONLY "inventario"."factura_compra_tipo_cambio"
    ADD CONSTRAINT "pk_factura_compra_tipo_cambio" PRIMARY KEY ("factura_compra_tipo_cambio_id_tipo_cambio");



ALTER TABLE ONLY "inventario"."historial_alerta"
    ADD CONSTRAINT "pk_historial_alerta" PRIMARY KEY ("historial_alerta_id_historial");



ALTER TABLE ONLY "inventario"."insumo_estandar_proceso"
    ADD CONSTRAINT "pk_insumo_estandar_proceso" PRIMARY KEY ("insumo_estandar_proceso_id_insumo_estandar");



ALTER TABLE ONLY "inventario"."inventario_bodega"
    ADD CONSTRAINT "pk_inventario_bodega" PRIMARY KEY ("material_sku", "lote_id_lote", "bodega_id_bodega");



ALTER TABLE ONLY "inventario"."lote"
    ADD CONSTRAINT "pk_lote" PRIMARY KEY ("lote_id_lote");



ALTER TABLE ONLY "inventario"."lote_fecha_pedido"
    ADD CONSTRAINT "pk_lote_fecha_pedido" PRIMARY KEY ("lote_fecha_pedido_id");



ALTER TABLE ONLY "inventario"."material"
    ADD CONSTRAINT "pk_material" PRIMARY KEY ("material_sku");



ALTER TABLE ONLY "inventario"."material_categoria_funcional"
    ADD CONSTRAINT "pk_material_categoria_funcional" PRIMARY KEY ("material_categoria_funcional_id_categoria_funcional");



ALTER TABLE ONLY "inventario"."material_categoria_general"
    ADD CONSTRAINT "pk_material_categoria_general" PRIMARY KEY ("material_categoria_general_id_categoria_general");



ALTER TABLE ONLY "inventario"."material_clasificacion_categoria"
    ADD CONSTRAINT "pk_material_clasificacion_categoria" PRIMARY KEY ("material_clasificacion_categoria_id");



ALTER TABLE ONLY "inventario"."material_clasificacion_nivel_especifico"
    ADD CONSTRAINT "pk_material_clasificacion_nivel_especifico" PRIMARY KEY ("material_clasificacion_nivel_especifico_id");



ALTER TABLE ONLY "inventario"."material_clasificacion_subcategoria"
    ADD CONSTRAINT "pk_material_clasificacion_subcategoria" PRIMARY KEY ("material_clasificacion_subcategoria_id");



ALTER TABLE ONLY "inventario"."material_codigo_barras"
    ADD CONSTRAINT "pk_material_codigo_barras" PRIMARY KEY ("material_sku", "material_codigo_barras");



ALTER TABLE ONLY "inventario"."material_orden_trabajo"
    ADD CONSTRAINT "pk_material_orden_trabajo" PRIMARY KEY ("material_sku", "orden_trabajo_id_orden");



ALTER TABLE ONLY "inventario"."material_producto_terminado"
    ADD CONSTRAINT "pk_material_producto_terminado" PRIMARY KEY ("material_sku", "producto_terminado_id_producto");



ALTER TABLE ONLY "inventario"."material_proveedor"
    ADD CONSTRAINT "pk_material_proveedor" PRIMARY KEY ("material_sku", "proveedor_id_proveedor");



ALTER TABLE ONLY "inventario"."material_unidad_medida"
    ADD CONSTRAINT "pk_material_unidad_medida" PRIMARY KEY ("material_unidad_medida_id_unidad_medida");



ALTER TABLE ONLY "inventario"."movimiento_inventario"
    ADD CONSTRAINT "pk_movimiento_inventario" PRIMARY KEY ("movimiento_inventario_id_movimiento");



ALTER TABLE ONLY "inventario"."movimiento_inventario_clasificacion_salida"
    ADD CONSTRAINT "pk_movimiento_inventario_clasificacion_salida" PRIMARY KEY ("id_clasificacion_salida");



ALTER TABLE ONLY "inventario"."movimiento_inventario_motivo_movimiento"
    ADD CONSTRAINT "pk_movimiento_inventario_motivo_movimiento" PRIMARY KEY ("movimiento_inventario_motivo_movimiento_id_motivo_movimiento");



ALTER TABLE ONLY "inventario"."movimiento_inventario_tipo_movimiento"
    ADD CONSTRAINT "pk_movimiento_inventario_tipo_movimiento" PRIMARY KEY ("movimiento_inventario_tipo_movimiento_id_tipo_movimiento");



ALTER TABLE ONLY "inventario"."notificacion"
    ADD CONSTRAINT "pk_notificacion" PRIMARY KEY ("notificacion_id_notificacion");



ALTER TABLE ONLY "inventario"."operacion_inventario"
    ADD CONSTRAINT "pk_operacion_inventario" PRIMARY KEY ("operacion_inventario_id");



ALTER TABLE ONLY "inventario"."orden_trabajo"
    ADD CONSTRAINT "pk_orden_trabajo" PRIMARY KEY ("orden_trabajo_id_orden");



ALTER TABLE ONLY "inventario"."preparacion_pedido"
    ADD CONSTRAINT "pk_preparacion_pedido" PRIMARY KEY ("preparacion_pedido_id_preparacion");



ALTER TABLE ONLY "inventario"."preparacion_pedido_estado"
    ADD CONSTRAINT "pk_preparacion_pedido_estado" PRIMARY KEY ("preparacion_pedido_estado_id_estado_preparacion");



ALTER TABLE ONLY "inventario"."producto_terminado"
    ADD CONSTRAINT "pk_producto_terminado" PRIMARY KEY ("producto_terminado_id_producto");



ALTER TABLE ONLY "inventario"."proveedor_contacto_correo"
    ADD CONSTRAINT "pk_proveedor_contacto_correo" PRIMARY KEY ("proveedor_id_proveedor", "proveedor_contacto_correo");



ALTER TABLE ONLY "inventario"."proveedor_contacto_telefono"
    ADD CONSTRAINT "pk_proveedor_contacto_telefono" PRIMARY KEY ("proveedor_id_proveedor", "proveedor_contacto_telefono");



ALTER TABLE ONLY "inventario"."reporte"
    ADD CONSTRAINT "pk_reporte" PRIMARY KEY ("reporte_id_reporte");



ALTER TABLE ONLY "inventario"."reporte_movimiento_inventario"
    ADD CONSTRAINT "pk_reporte_movimiento_inventario" PRIMARY KEY ("movimiento_inventario_id_movimiento", "reporte_id_reporte");



ALTER TABLE ONLY "inventario"."reserva_inventario"
    ADD CONSTRAINT "pk_reserva_inventario" PRIMARY KEY ("reserva_inventario_id_reserva");



ALTER TABLE ONLY "inventario"."operacion_inventario"
    ADD CONSTRAINT "uq_operacion_inventario_clave" UNIQUE ("clave_idempotencia");



ALTER TABLE ONLY "inventario"."operacion_inventario"
    ADD CONSTRAINT "uq_operacion_inventario_movimiento" UNIQUE ("movimiento_inventario_id");



ALTER TABLE ONLY "public"."_prisma_migrations"
    ADD CONSTRAINT "_prisma_migrations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "terreno"."categoria_incidencia_terreno"
    ADD CONSTRAINT "categoria_incidencia_terreno_codigo_key" UNIQUE ("codigo");



ALTER TABLE ONLY "terreno"."categoria_incidencia_terreno"
    ADD CONSTRAINT "categoria_incidencia_terreno_pkey" PRIMARY KEY ("id_categoria_incidencia");



ALTER TABLE ONLY "terreno"."ejecucion_tarea"
    ADD CONSTRAINT "ejecucion_tarea_pkey" PRIMARY KEY ("id_ejecucion_tarea");



ALTER TABLE ONLY "terreno"."incidencia_retrabajo_tarea"
    ADD CONSTRAINT "incidencia_retrabajo_tarea_pkey" PRIMARY KEY ("id_incidencia_retrabajo");



ALTER TABLE ONLY "terreno"."adicionales_pagados"
    ADD CONSTRAINT "pk_adicionales_pagados" PRIMARY KEY ("adicionales_pagados_id_adicionales");



ALTER TABLE ONLY "terreno"."checklist_de_materiales"
    ADD CONSTRAINT "pk_checklist_de_materiales" PRIMARY KEY ("checklist_de_materiales_checklist_de_materials_id");



ALTER TABLE ONLY "terreno"."cliente"
    ADD CONSTRAINT "pk_cliente" PRIMARY KEY ("cliente_cliente_rut");



ALTER TABLE ONLY "terreno"."detalles_herraje"
    ADD CONSTRAINT "pk_detalles_herraje" PRIMARY KEY ("detalles_herraje_detalle_herraje_id");



ALTER TABLE ONLY "terreno"."especificacion_metalmecanica"
    ADD CONSTRAINT "pk_especificacion_metalmecanica" PRIMARY KEY ("especificacion_metalmecanica_id_metalmecanica");



ALTER TABLE ONLY "terreno"."especificacion_proyecto_terreno"
    ADD CONSTRAINT "pk_especificacion_proyecto_terreno" PRIMARY KEY ("id_especificacion_proyecto_terreno");



ALTER TABLE ONLY "terreno"."especificacion_servicio_terreno"
    ADD CONSTRAINT "pk_especificacion_servicio_terreno" PRIMARY KEY ("especificacion_servicio_terreno_servicio_terreno_id", "especificacion_servicio_terreno_especificacion_puerta_id");



ALTER TABLE ONLY "terreno"."especificacion_terminaciones"
    ADD CONSTRAINT "pk_especificacion_terminaciones" PRIMARY KEY ("especificacion_terminaciones_id_terminacion");



ALTER TABLE ONLY "terreno"."especificaciones_puerta"
    ADD CONSTRAINT "pk_especificaciones_puerta" PRIMARY KEY ("especificacion_puerta_especificacion_puerta_id");



ALTER TABLE ONLY "terreno"."evidencia_terreno"
    ADD CONSTRAINT "pk_evidencia_terreno" PRIMARY KEY ("evidencia_terreno_evidencia_terreno_id");



ALTER TABLE ONLY "terreno"."formulario_de_cierre"
    ADD CONSTRAINT "pk_formulario_de_cierre" PRIMARY KEY ("formulario_de_cierre_formulario_de_cierre_id");



ALTER TABLE ONLY "terreno"."historial_cambio_orden_trabajo"
    ADD CONSTRAINT "pk_historial_cambio_orden_trabajo" PRIMARY KEY ("historial_cambio_orden_trabajo_id_cambio");



ALTER TABLE ONLY "terreno"."hoja_doble"
    ADD CONSTRAINT "pk_hoja_doble" PRIMARY KEY ("hoja_doble_especificacion_puerta_id");



ALTER TABLE ONLY "terreno"."hoja_simple"
    ADD CONSTRAINT "pk_hoja_simple" PRIMARY KEY ("hoja_simple_especificacion_puerta_id");



ALTER TABLE ONLY "terreno"."medidas_puerta"
    ADD CONSTRAINT "pk_medidas_puerta" PRIMARY KEY ("medidas_puerta_medidas_id");



ALTER TABLE ONLY "terreno"."notificacion_tecnico"
    ADD CONSTRAINT "pk_notificacion_tecnico" PRIMARY KEY ("notificacion_tecnico_id_notificacion_tecnico");



ALTER TABLE ONLY "terreno"."notificacion_terreno"
    ADD CONSTRAINT "pk_notificacion_terreno" PRIMARY KEY ("notificacion_terreno_id_notificacion_terreno");



ALTER TABLE ONLY "terreno"."prestamo_herramientas"
    ADD CONSTRAINT "pk_prestamo_herramientas" PRIMARY KEY ("prestamo_herramienta_prestamo_herramienta_id");



ALTER TABLE ONLY "terreno"."receptor"
    ADD CONSTRAINT "pk_receptor" PRIMARY KEY ("receptor_receptor_id");



ALTER TABLE ONLY "terreno"."servicio_terreno"
    ADD CONSTRAINT "pk_servicio_terreno" PRIMARY KEY ("servicio_terreno_servicio_terreno_id");



ALTER TABLE ONLY "terreno"."servicio_tterreno_herramientas_materiales"
    ADD CONSTRAINT "pk_servicio_tterreno_herramientas_materiales" PRIMARY KEY ("id_servicio_terreno_herr_material", "servicio_terreno_herramientas_materiales_servicio_terreno_id");



ALTER TABLE ONLY "terreno"."tarea"
    ADD CONSTRAINT "pk_tarea" PRIMARY KEY ("tarea_tarea_id");



ALTER TABLE ONLY "terreno"."tarea_tipo"
    ADD CONSTRAINT "pk_tarea_tipo" PRIMARY KEY ("tarea_tipo_tarea_tipo_id");



ALTER TABLE ONLY "terreno"."tarea_usuario"
    ADD CONSTRAINT "pk_tarea_usuario" PRIMARY KEY ("tarea_usuario_tarea_id", "tarea_usuario_usuario_id");



ALTER TABLE ONLY "terreno"."item_comercial"
    ADD CONSTRAINT "pk_terreno_item_comercial" PRIMARY KEY ("id_item_comercial");



CREATE UNIQUE INDEX "credencial_unica_vigente" ON "comun"."usuario_contrasena" USING "btree" ("usuario_id_usuario") WHERE "activa";



CREATE INDEX "idx_proyecto_cliente_fecha" ON "comun"."proyecto" USING "btree" ("rut_cliente", "proyecto_fecha_ingreso");



CREATE INDEX "idx_proyecto_obra_obra" ON "comun"."proyecto_obra" USING "btree" ("id_obra", "id_proyecto");



CREATE UNIQUE INDEX "perfil_codigo_m4_key" ON "comun"."perfil" USING "btree" ("codigo_m4");



CREATE UNIQUE INDEX "permiso_codigo_m4_key" ON "comun"."permiso" USING "btree" ("codigo_m4");



CREATE INDEX "sesion_usuario_id_usuario_idx" ON "comun"."sesion_usuario" USING "btree" ("id_usuario");



CREATE UNIQUE INDEX "sesion_usuario_secreto_hash_key" ON "comun"."sesion_usuario" USING "btree" ("secreto_hash");



CREATE INDEX "token_recuperacion_id_usuario_idx" ON "comun"."token_recuperacion" USING "btree" ("id_usuario");



CREATE UNIQUE INDEX "token_recuperacion_secreto_hash_key" ON "comun"."token_recuperacion" USING "btree" ("secreto_hash");



CREATE UNIQUE INDEX "uq_area_trabajo_nombre_normalizado" ON "comun"."area_trabajo" USING "btree" ("lower"("btrim"(("area_trabajo_nombre_area")::"text"))) WHERE (("area_trabajo_nombre_area" IS NOT NULL) AND ("btrim"(("area_trabajo_nombre_area")::"text") <> ''::"text"));



CREATE UNIQUE INDEX "uq_obra_clave_ubicacion" ON "comun"."obra" USING "btree" ("clave_ubicacion_normalizada") WHERE ("clave_ubicacion_normalizada" IS NOT NULL);



CREATE UNIQUE INDEX "uq_proyecto_cotizacion_origen" ON "comun"."proyecto" USING "btree" ("id_cotizacion_origen") WHERE ("id_cotizacion_origen" IS NOT NULL);



CREATE UNIQUE INDEX "uq_proyecto_obra_principal" ON "comun"."proyecto_obra" USING "btree" ("id_proyecto") WHERE ("es_principal" = true);



CREATE UNIQUE INDEX "usuario_acceso_m4_key" ON "comun"."usuario" USING "btree" ("acceso_m4");



CREATE UNIQUE INDEX "usuario_empleado_m4_key" ON "comun"."usuario" USING "btree" ("empleado_m4");



CREATE INDEX "ajuste_plantilla_raiz_estado_idx" ON "finanzas"."ajuste_producto_plantilla_fabricacion" USING "btree" ("id_plantilla_fabricacion", "estado");



CREATE UNIQUE INDEX "anulacion_pago_id_pago_cliente_key" ON "finanzas"."anulacion_pago" USING "btree" ("id_pago_cliente");



CREATE UNIQUE INDEX "asignacion_pago_cliente_id_pago_cliente_key" ON "finanzas"."asignacion_pago_cliente" USING "btree" ("id_pago_cliente");



CREATE INDEX "catalogo_tarea_fabricacion_area_estado_idx" ON "finanzas"."catalogo_tarea_fabricacion" USING "btree" ("id_area_trabajo", "estado");



CREATE INDEX "catalogo_tarea_fabricacion_estado_nombre_idx" ON "finanzas"."catalogo_tarea_fabricacion" USING "btree" ("estado", "nombre");



CREATE UNIQUE INDEX "catalogo_tarea_fabricacion_nombre_area_uq" ON "finanzas"."catalogo_tarea_fabricacion" USING "btree" ("id_area_trabajo", "lower"("btrim"(("nombre")::"text")));



CREATE UNIQUE INDEX "categoria_pago_nombre_key" ON "finanzas"."categoria_pago" USING "btree" ("nombre");



CREATE UNIQUE INDEX "cliente_financiero_referencia_demostracion_key" ON "finanzas"."cliente_financiero" USING "btree" ("referencia_demostracion");



CREATE UNIQUE INDEX "cotizacion_referencia_demostracion_key" ON "finanzas"."cotizacion" USING "btree" ("referencia_demostracion");



CREATE INDEX "decision_rectificacion_fecha_idx" ON "finanzas"."decision_rectificacion_orden_trabajo" USING "btree" ("id_rectificacion_ot", "decidido_en");



CREATE INDEX "extension_producto_familia_estado_idx" ON "finanzas"."extension_producto_comercial" USING "btree" ("id_familia_producto_comercial", "estado");



CREATE INDEX "extension_producto_nombre_idx" ON "finanzas"."extension_producto_comercial" USING "btree" ("nombre_comercial");



CREATE INDEX "familia_producto_comercial_estado_nombre_idx" ON "finanzas"."familia_producto_comercial" USING "btree" ("estado", "nombre");



CREATE UNIQUE INDEX "guia_despacho_folio_key" ON "finanzas"."guia_despacho" USING "btree" ("folio");



CREATE INDEX "historial_familia_producto_fecha_idx" ON "finanzas"."historial_familia_producto_comercial" USING "btree" ("id_familia_producto_comercial", "fecha_evento");



CREATE INDEX "historial_producto_comercial_fecha_idx" ON "finanzas"."historial_producto_comercial" USING "btree" ("id_extension_producto_comercial", "fecha_evento");



CREATE INDEX "historial_rectificacion_fecha_idx" ON "finanzas"."historial_rectificacion_orden_trabajo" USING "btree" ("id_rectificacion_ot", "fecha_evento");



CREATE INDEX "historial_unidad_fisica_ot_fecha_idx" ON "finanzas"."historial_unidad_fisica_ot" USING "btree" ("id_unidad_fisica_ot", "fecha_evento");



CREATE INDEX "idx_ajuste_obligacion_m5_obligacion" ON "finanzas"."ajuste_obligacion_proveedor_m5" USING "btree" ("id_obligacion_m5", "estado");



CREATE INDEX "idx_ajuste_ocs_m5_ocs_estado" ON "finanzas"."ajuste_orden_compra_servicio_m5" USING "btree" ("id_ocs_m5", "estado");



CREATE INDEX "idx_ajuste_posterior_empleado_periodo" ON "finanzas"."ajuste_posterior_remuneracion" USING "btree" ("id_empleado", "id_periodo_origen");



CREATE INDEX "idx_ajuste_posterior_remuneracion" ON "finanzas"."ajuste_posterior_remuneracion" USING "btree" ("id_remuneracion", "estado");



CREATE INDEX "idx_alternativa_b2c_estado" ON "finanzas"."alternativa_b2c" USING "btree" ("id_grupo_alternativas_b2c", "estado");



CREATE INDEX "idx_alternativa_b2c_producto_version" ON "finanzas"."alternativa_b2c" USING "btree" ("id_extension_producto_comercial", "id_producto_comercial_version");



CREATE INDEX "idx_anticipo_empleado_periodo" ON "finanzas"."anticipo_remuneracion" USING "btree" ("id_empleado", "id_periodo_remuneracion");



CREATE INDEX "idx_anulacion_pago_m5_grupo" ON "finanzas"."anulacion_movimiento_pago_m5" USING "btree" ("grupo_operacion");



CREATE INDEX "idx_asignacion_area_disponibilidad" ON "finanzas"."asignacion_area_empleado" USING "btree" ("id_area_trabajo", "vigencia_hasta");



CREATE INDEX "idx_asignacion_area_empleado_historial" ON "finanzas"."asignacion_area_empleado" USING "btree" ("id_empleado", "vigencia_desde" DESC);



CREATE INDEX "idx_asignacion_concepto_concepto" ON "finanzas"."asignacion_concepto_remuneracion_empleado" USING "btree" ("id_concepto", "vigencia_desde");



CREATE INDEX "idx_asignacion_concepto_empleado" ON "finanzas"."asignacion_concepto_remuneracion_empleado" USING "btree" ("id_empleado", "vigencia_desde");



CREATE INDEX "idx_asignacion_esquema_cargo" ON "finanzas"."asignacion_esquema_remuneracional" USING "btree" ("id_cargo", "vigencia_desde");



CREATE INDEX "idx_asignacion_esquema_empleado" ON "finanzas"."asignacion_esquema_remuneracional" USING "btree" ("id_empleado", "vigencia_desde");



CREATE INDEX "idx_asignacion_pago_cliente_pago" ON "finanzas"."asignacion_pago_cliente" USING "btree" ("id_pago_cliente");



CREATE INDEX "idx_asignacion_pago_proveedor_pago" ON "finanzas"."asignacion_pago_proveedor" USING "btree" ("id_pago_proveedor");



CREATE INDEX "idx_asociacion_documento_m5" ON "finanzas"."asociacion_documento_oc_m5" USING "btree" ("id_documento_m5");



CREATE INDEX "idx_asociacion_respaldo_m5_respaldo" ON "finanzas"."asociacion_respaldo_pago_m5" USING "btree" ("id_respaldo_pago_m5");



CREATE INDEX "idx_atribucion_empleado_fecha" ON "finanzas"."atribucion_ejecucion_tarea_ot" USING "btree" ("id_empleado_ejecutor", "registrado_en");



CREATE INDEX "idx_boleta_honorarios_estado_fecha" ON "finanzas"."boleta_honorarios" USING "btree" ("estado_documental", "fecha_emision");



CREATE INDEX "idx_carta_b2c_estado" ON "finanzas"."carta_comercial_b2c" USING "btree" ("estado", "actualizado_en");



CREATE INDEX "idx_carta_b2c_fotografia_orden" ON "finanzas"."carta_comercial_b2c_version_fotografia" USING "btree" ("id_carta_comercial_b2c_version", "orden_presentacion");



CREATE INDEX "idx_carta_b2c_version_estado" ON "finanzas"."carta_comercial_b2c_version" USING "btree" ("id_carta_comercial_b2c", "estado_documental");



CREATE INDEX "idx_clasificacion_m5_asociacion" ON "finanzas"."clasificacion_asociacion_m5" USING "btree" ("id_asociacion_m5");



CREATE INDEX "idx_cliente_financiero_tipo" ON "finanzas"."cliente_financiero" USING "btree" ("id_tipo_cliente_financiero");



CREATE INDEX "idx_comision_bancaria_m5_operacion" ON "finanzas"."comision_bancaria_m5" USING "btree" ("id_operacion_pago_m5", "fecha_registro");



CREATE INDEX "idx_compatibilidad_opcional_estado" ON "finanzas"."compatibilidad_opcional_producto" USING "btree" ("id_extension_producto_comercial", "estado");



CREATE INDEX "idx_componente_remuneracion_clave" ON "finanzas"."componente_remuneracion" USING "btree" ("clave_negocio");



CREATE INDEX "idx_componente_remuneracion_contexto" ON "finanzas"."componente_remuneracion" USING "btree" ("id_remuneracion", "tipo", "estado_revision");



CREATE INDEX "idx_compromiso_credito_m8_cliente_estado" ON "finanzas"."compromiso_credito_m8" USING "btree" ("id_ficha_cliente", "estado");



CREATE INDEX "idx_conciliacion_movimientos" ON "finanzas"."conciliacion" USING "btree" ("id_movimiento_financiero", "id_movimiento_bancario");



CREATE INDEX "idx_conciliacion_pago_m5_movimiento" ON "finanzas"."conciliacion_movimiento_pago_m5" USING "btree" ("id_movimiento_pago_m5", "fecha_hora" DESC, "id_conciliacion_movimiento_m5" DESC);



CREATE INDEX "idx_condicion_comercial_segmento" ON "finanzas"."condicion_comercial" USING "btree" ("segmento", "estado");



CREATE INDEX "idx_condicion_version_vigencia" ON "finanzas"."condicion_comercial_version" USING "btree" ("id_condicion_comercial", "estado", "vigencia_desde", "vigencia_hasta");



CREATE INDEX "idx_config_umbral_m5_vigente" ON "finanzas"."config_umbral_por_vencer_m5" USING "btree" ("fecha_hora" DESC, "id_config_umbral_m5" DESC);



CREATE INDEX "idx_configuracion_concepto_vigencia" ON "finanzas"."configuracion_concepto_remuneracion" USING "btree" ("id_concepto", "vigencia_desde");



CREATE INDEX "idx_conservacion_documental_vigencia" ON "finanzas"."configuracion_conservacion_documental" USING "btree" ("vigencia_desde", "vigencia_hasta");



CREATE INDEX "idx_contacto_cotizacion_b2b_estado" ON "finanzas"."contacto_cotizacion_b2b" USING "btree" ("id_cotizacion", "estado");



CREATE INDEX "idx_correccion_m11_documento" ON "finanzas"."correccion_documental_m11" USING "btree" ("tipo_documento", "id_documento_original", "creado_en");



CREATE INDEX "idx_correccion_m11_guia" ON "finanzas"."correccion_documental_m11" USING "btree" ("tipo_documento", "id_guia_original", "creado_en");



CREATE INDEX "idx_correccion_m11_oc" ON "finanzas"."correccion_documental_m11" USING "btree" ("tipo_documento", "id_orden_compra_original", "creado_en");



CREATE INDEX "idx_correspondencia_linea_oc_unidad" ON "finanzas"."correspondencia_linea_oc_item_tecnico" USING "btree" ("id_unidad_fisica_ot");



CREATE INDEX "idx_costo_envio_m5_envio_moneda" ON "finanzas"."costo_envio_importacion_m5" USING "btree" ("id_envio_importacion_m5", "id_moneda");



CREATE INDEX "idx_costo_proyecto_proyecto" ON "finanzas"."costo_proyecto" USING "btree" ("id_proyecto_financiero");



CREATE INDEX "idx_cotizacion_condicion_comercial" ON "finanzas"."cotizacion" USING "btree" ("id_condicion_comercial_version");



CREATE INDEX "idx_cotizacion_ficha" ON "finanzas"."cotizacion" USING "btree" ("id_ficha_cliente");



CREATE INDEX "idx_cotizacion_obra_contexto" ON "finanzas"."cotizacion" USING "btree" ("id_obra_contexto");



CREATE INDEX "idx_cotizacion_salud_empleado_resolucion" ON "finanzas"."cotizacion_salud_empleado" USING "btree" ("id_empleado", "vigencia_desde", "vigencia_hasta");



CREATE INDEX "idx_cotizacion_segmento_estado" ON "finanzas"."cotizacion" USING "btree" ("segmento_comercial", "estado_cotizacion");



CREATE INDEX "idx_cotizacion_tarifa_instalacion" ON "finanzas"."cotizacion" USING "btree" ("id_tarifa_instalacion_comercial");



CREATE INDEX "idx_cotizacion_version_estado_documental" ON "finanzas"."cotizacion_version" USING "btree" ("estado_documental");



CREATE INDEX "idx_cotizacion_version_fecha" ON "finanzas"."cotizacion_version" USING "btree" ("id_cotizacion", "fecha");



CREATE INDEX "idx_credito_proyecto_ficha" ON "finanzas"."credito_proyecto" USING "btree" ("id_ficha_cliente");



CREATE INDEX "idx_cuenta_bancaria_m7_estado_moneda" ON "finanzas"."cuenta_bancaria_m7" USING "btree" ("estado", "id_moneda");



CREATE INDEX "idx_decision_retrabajo_tratamiento" ON "finanzas"."decision_remuneracional_retrabajo" USING "btree" ("id_tratamiento_remuneracional");



CREATE INDEX "idx_detalle_compensacion_obligacion" ON "finanzas"."detalle_compensacion_saldo_favor_m5" USING "btree" ("id_obligacion_m5");



CREATE INDEX "idx_detalle_costo_material_detalle" ON "finanzas"."detalle_costo_material_cotizacion" USING "btree" ("id_detalle_cotizacion");



CREATE INDEX "idx_detalle_cotizacion_cotizacion" ON "finanzas"."detalle_cotizacion" USING "btree" ("id_cotizacion");



CREATE INDEX "idx_detalle_cotizacion_item" ON "finanzas"."detalle_cotizacion" USING "btree" ("id_item_comercial");



CREATE INDEX "idx_detalle_cotizacion_precio_comercial" ON "finanzas"."detalle_cotizacion" USING "btree" ("id_precio_producto_comercial");



CREATE INDEX "idx_detalle_cotizacion_producto_version" ON "finanzas"."detalle_cotizacion" USING "btree" ("id_extension_producto_comercial", "id_producto_comercial_version");



CREATE INDEX "idx_detalle_doc_compra_documento" ON "finanzas"."detalle_documento_compra_proveedor" USING "btree" ("id_documento_compra_proveedor");



CREATE INDEX "idx_detalle_imputacion_m5_propuesta" ON "finanzas"."detalle_imputacion_m5" USING "btree" ("id_propuesta_imputacion_m5");



CREATE INDEX "idx_detalle_material_oc_m5_material_fecha" ON "finanzas"."detalle_material_orden_compra_m5" USING "btree" ("material_sku", "fecha_esperada");



CREATE INDEX "idx_detalle_presupuesto_m10_mes" ON "finanzas"."detalle_presupuesto_m10" USING "btree" ("id_version_presupuesto_m10", "mes");



CREATE INDEX "idx_detalle_reasignacion_m5_solicitud" ON "finanzas"."detalle_reasignacion_costo_m5" USING "btree" ("id_solicitud_reasignacion_m5");



CREATE INDEX "idx_detalle_servicio_catalogo_precio" ON "finanzas"."detalle_servicio_cotizacion" USING "btree" ("id_servicio_comercial", "id_precio_servicio_comercial");



CREATE INDEX "idx_detalle_servicio_cotizacion" ON "finanzas"."detalle_servicio_cotizacion" USING "btree" ("id_cotizacion");



CREATE INDEX "idx_documento_compra_proveedor_proveedor" ON "finanzas"."documento_compra_proveedor" USING "btree" ("id_proveedor");



CREATE INDEX "idx_documento_logico_clasificacion_estado" ON "finanzas"."documento_logico" USING "btree" ("clasificacion", "estado", "creado_en");



CREATE INDEX "idx_documento_logico_conservacion" ON "finanzas"."documento_logico" USING "btree" ("id_configuracion_conservacion");



CREATE INDEX "idx_documento_m5_estado_fecha" ON "finanzas"."documento_proveedor_m5" USING "btree" ("estado", "fecha_creacion");



CREATE INDEX "idx_documento_m5_proveedor_fecha" ON "finanzas"."documento_proveedor_m5" USING "btree" ("id_proveedor", "fecha_creacion");



CREATE INDEX "idx_documento_tributario_ficha" ON "finanzas"."documento_tributario" USING "btree" ("id_ficha_cliente");



CREATE INDEX "idx_documento_tributario_nota" ON "finanzas"."documento_tributario" USING "btree" ("id_nota_venta");



CREATE INDEX "idx_efecto_ocs_m5_ocs" ON "finanzas"."efecto_financiero_ocs_m5" USING "btree" ("id_ocs_m5");



CREATE INDEX "idx_empleado_cargo" ON "finanzas"."empleado" USING "btree" ("id_cargo");



CREATE INDEX "idx_envio_importacion_m5_estado_fecha" ON "finanzas"."envio_importacion_m5" USING "btree" ("estado", "fecha");



CREATE INDEX "idx_envio_orden_m5_envio" ON "finanzas"."envio_orden_compra_m5" USING "btree" ("id_envio_importacion_m5");



CREATE INDEX "idx_esquema_remuneracional_estado_vigencia" ON "finanzas"."esquema_remuneracional" USING "btree" ("estado", "vigencia_desde");



CREATE INDEX "idx_estado_tarea_area_estado" ON "finanzas"."estado_tarea_produccion_ot" USING "btree" ("id_area_trabajo", "estado");



CREATE INDEX "idx_estado_tarea_empleado_estado" ON "finanzas"."estado_tarea_produccion_ot" USING "btree" ("id_empleado_responsable", "estado");



CREATE INDEX "idx_evaluacion_credito_ficha" ON "finanzas"."evaluacion_credito" USING "btree" ("id_ficha_cliente");



CREATE INDEX "idx_evento_auditoria_entidad" ON "finanzas"."evento_auditoria" USING "btree" ("entidad_afectada", "id_registro_afectado");



CREATE INDEX "idx_evento_auditoria_usuario" ON "finanzas"."evento_auditoria" USING "btree" ("id_usuario");



CREATE INDEX "idx_evento_credito_m8_cliente_fecha" ON "finanzas"."evento_credito_m8" USING "btree" ("id_ficha_cliente", "fecha_evento");



CREATE INDEX "idx_evento_documental_documento" ON "finanzas"."evento_operacional_documental" USING "btree" ("id_documento_logico", "creado_en");



CREATE INDEX "idx_evento_documental_lease" ON "finanzas"."evento_operacional_documental" USING "btree" ("estado", "lease_hasta");



CREATE INDEX "idx_evento_documental_pendiente" ON "finanzas"."evento_operacional_documental" USING "btree" ("estado", "proximo_intento_en", "creado_en");



CREATE INDEX "idx_ficha_cliente_cliente" ON "finanzas"."ficha_cliente" USING "btree" ("id_cliente_financiero");



CREATE INDEX "idx_gasto_caja_chica_m5_periodo_estado" ON "finanzas"."gasto_caja_chica_m5" USING "btree" ("anio", "mes", "estado");



CREATE INDEX "idx_grupo_alternativas_b2c_estado" ON "finanzas"."grupo_alternativas_b2c" USING "btree" ("id_cotizacion", "estado");



CREATE INDEX "idx_hallazgo_m11_oc_estado" ON "finanzas"."hallazgo_discrepancia_m11" USING "btree" ("id_orden_compra_b2b", "estado");



CREATE INDEX "idx_historial_alternativa_b2c_fecha" ON "finanzas"."historial_decision_alternativa_b2c" USING "btree" ("id_alternativa_b2c", "fecha");



CREATE INDEX "idx_historial_envio_m5_envio" ON "finanzas"."historial_envio_importacion_m5" USING "btree" ("id_envio_importacion_m5", "fecha_hora");



CREATE INDEX "idx_historial_fondo_caja_m5" ON "finanzas"."historial_fondo_caja_chica_m5" USING "btree" ("id_fondo_caja_chica_m5", "fecha_hora");



CREATE INDEX "idx_historial_gasto_caja_m5" ON "finanzas"."historial_gasto_caja_chica_m5" USING "btree" ("id_gasto_caja_chica_m5", "fecha_hora");



CREATE INDEX "idx_historial_ocs_m5_ocs_fecha" ON "finanzas"."historial_orden_compra_servicio_m5" USING "btree" ("id_ocs_m5", "fecha_hora");



CREATE INDEX "idx_historial_ot_imputacion_m5_detalle" ON "finanzas"."historial_ot_imputacion_m5" USING "btree" ("id_detalle_imputacion_m5", "fecha_hora");



CREATE INDEX "idx_historial_precio_material_proveedor" ON "finanzas"."historial_precio_material" USING "btree" ("id_proveedor");



CREATE INDEX "idx_historial_precio_material_sku" ON "finanzas"."historial_precio_material" USING "btree" ("material_sku");



CREATE INDEX "idx_historial_produccion_tarea_fecha" ON "finanzas"."historial_cambio_produccion_ot" USING "btree" ("id_tarea_ejecutable_ot", "fecha_evento");



CREATE INDEX "idx_historial_produccion_unidad_fecha" ON "finanzas"."historial_cambio_produccion_ot" USING "btree" ("id_unidad_fisica_ot", "fecha_evento");



CREATE INDEX "idx_historial_proveedor_m5_proveedor_fecha" ON "finanzas"."historial_proveedor_m5" USING "btree" ("id_proveedor", "fecha_hora");



CREATE INDEX "idx_historial_respaldo_m5_operacion" ON "finanzas"."historial_respaldo_pago_m5" USING "btree" ("id_operacion_pago_m5", "fecha_hora" DESC);



CREATE INDEX "idx_historial_seleccion_fecha" ON "finanzas"."historial_seleccion_alternativa_b2c" USING "btree" ("id_grupo_alternativas_b2c", "fecha");



CREATE INDEX "idx_historial_tarifa_tarea_tarea" ON "finanzas"."historial_tarifa_tarea" USING "btree" ("id_tarea_catalogada");



CREATE INDEX "idx_hito_cobro_nota" ON "finanzas"."hito_cobro" USING "btree" ("id_nota_venta");



CREATE INDEX "idx_idempotencia_operacion_actor" ON "finanzas"."idempotencia_operacion_comercial" USING "btree" ("actor_id", "creado_en");



CREATE INDEX "idx_imputacion_m5_documento_estado" ON "finanzas"."propuesta_imputacion_m5" USING "btree" ("id_documento_m5", "estado");



CREATE INDEX "idx_intencion_documental_documento_estado" ON "finanzas"."intencion_carga_documental" USING "btree" ("id_documento_logico", "estado");



CREATE INDEX "idx_intencion_documental_estado_expira" ON "finanzas"."intencion_carga_documental" USING "btree" ("estado", "expira_en");



CREATE INDEX "idx_limite_credito_ficha" ON "finanzas"."limite_credito_cliente" USING "btree" ("id_ficha_cliente");



CREATE INDEX "idx_limite_global_credito_m8_vigencia" ON "finanzas"."limite_global_credito_m8" USING "btree" ("vigencia_desde", "vigencia_hasta");



CREATE INDEX "idx_linea_oc_detalle" ON "finanzas"."linea_orden_compra_b2b" USING "btree" ("id_detalle_cotizacion");



CREATE INDEX "idx_liquidacion_empleado_periodo" ON "finanzas"."liquidacion_remuneracion" USING "btree" ("rut_empleado", "periodo_liquidacion");



CREATE INDEX "idx_m9_alerta_vigente" ON "finanzas"."configuracion_alerta_m9" USING "btree" ("metrica", "activa", "vigencia_desde");



CREATE INDEX "idx_m9_clasificacion" ON "finanzas"."evento_auditoria_m9" USING "btree" ("modulo_origen", "operacion", "resultado");



CREATE INDEX "idx_m9_entidad" ON "finanzas"."evento_auditoria_m9" USING "btree" ("entidad_tipo", "entidad_referencia");



CREATE INDEX "idx_m9_intento_estado" ON "finanzas"."intento_retry_m9" USING "btree" ("estado", "finalizado_en");



CREATE INDEX "idx_m9_ocurrencia" ON "finanzas"."evento_auditoria_m9" USING "btree" ("fecha_ocurrencia", "id_evento_m9");



CREATE INDEX "idx_m9_pendiente_elegible" ON "finanzas"."pendiente_evento_m9" USING "btree" ("estado", "proximo_intento_en");



CREATE INDEX "idx_m9_pendiente_productor" ON "finanzas"."pendiente_evento_m9" USING "btree" ("productor", "estado");



CREATE INDEX "idx_m9_politica_vigente" ON "finanzas"."politica_tratamiento_m9" USING "btree" ("id_categoria_retencion", "vigencia_desde", "vigencia_hasta");



CREATE INDEX "idx_m9_productor_secuencia" ON "finanzas"."evento_auditoria_m9" USING "btree" ("productor", "secuencia");



CREATE INDEX "idx_m9_tratamiento_evento" ON "finanzas"."tratamiento_privacidad_m9" USING "btree" ("id_evento_m9", "aplicado_en");



CREATE INDEX "idx_movimiento_bancario_cuenta_fecha_m7" ON "finanzas"."movimiento_bancario" USING "btree" ("id_cuenta_bancaria_m7", "fecha_movimiento_bancario");



CREATE INDEX "idx_movimiento_bancario_fecha" ON "finanzas"."movimiento_bancario" USING "btree" ("fecha_movimiento_bancario");



CREATE INDEX "idx_movimiento_financiero_fecha" ON "finanzas"."movimiento_financiero" USING "btree" ("fecha_movimiento");



CREATE INDEX "idx_movimiento_pago_m5_obligacion" ON "finanzas"."movimiento_pago_proveedor_m5" USING "btree" ("id_obligacion_m5");



CREATE INDEX "idx_movimiento_pago_m5_operacion" ON "finanzas"."movimiento_pago_proveedor_m5" USING "btree" ("id_operacion_pago_m5", "id_movimiento_pago_m5");



CREATE INDEX "idx_nota_venta_ficha" ON "finanzas"."nota_venta" USING "btree" ("id_ficha_cliente");



CREATE INDEX "idx_obligacion_m5_proveedor_vencimiento" ON "finanzas"."obligacion_proveedor_m5" USING "btree" ("id_proveedor", "fecha_vencimiento");



CREATE INDEX "idx_ocs_m5_contexto" ON "finanzas"."orden_compra_servicio_m5" USING "btree" ("id_proyecto_financiero_contexto", "id_orden_trabajo_contexto");



CREATE INDEX "idx_ocs_m5_estado_fecha" ON "finanzas"."orden_compra_servicio_m5" USING "btree" ("estado_ocs", "fecha_creacion");



CREATE INDEX "idx_ocs_m5_proveedor_fecha" ON "finanzas"."orden_compra_servicio_m5" USING "btree" ("id_proveedor", "fecha_creacion");



CREATE INDEX "idx_opcional_comercial_estado" ON "finanzas"."opcional_comercial" USING "btree" ("estado", "nombre");



CREATE INDEX "idx_operacion_pago_m5_proveedor_estado" ON "finanzas"."operacion_pago_proveedor_m5" USING "btree" ("id_proveedor", "estado", "fecha_creacion" DESC);



CREATE INDEX "idx_orden_compra_oferta_aceptada" ON "finanzas"."orden_compra_b2b" USING "btree" ("id_version_oferta_aceptada");



CREATE INDEX "idx_origen_alerta_alerta" ON "finanzas"."origen_alerta_financiera" USING "btree" ("id_alerta_financiera");



CREATE INDEX "idx_origen_movimiento_financiero_movimiento" ON "finanzas"."origen_movimiento_financiero" USING "btree" ("id_movimiento_financiero");



CREATE INDEX "idx_pago_cliente_ficha" ON "finanzas"."pago_cliente" USING "btree" ("id_ficha_cliente");



CREATE INDEX "idx_pago_proveedor_proveedor" ON "finanzas"."pago_proveedor" USING "btree" ("id_proveedor");



CREATE INDEX "idx_pago_remuneracion_origen" ON "finanzas"."pago_remuneracion" USING "btree" ("origen_tipo", "origen_id", "estado");



CREATE INDEX "idx_parametro_remuneracional_resolucion" ON "finanzas"."parametro_remuneracional" USING "btree" ("codigo", "vigencia_desde");



CREATE INDEX "idx_periodo_remuneracion_cierre" ON "finanzas"."periodo_remuneracion" USING "btree" ("cerrado_en");



CREATE INDEX "idx_plantilla_documental_tipo" ON "finanzas"."plantilla_documental_comercial" USING "btree" ("tipo_documento", "segmento", "estado");



CREATE INDEX "idx_plantilla_documental_version_estado" ON "finanzas"."plantilla_documental_version" USING "btree" ("id_plantilla_documental", "estado");



CREATE INDEX "idx_precio_opcional_vigencia" ON "finanzas"."precio_opcional_comercial" USING "btree" ("id_opcional_comercial", "segmento_comercial", "estado", "vigencia_desde", "vigencia_hasta");



CREATE INDEX "idx_precio_producto_vigencia" ON "finanzas"."precio_producto_comercial" USING "btree" ("id_extension_producto_comercial", "segmento_comercial", "estado", "vigencia_desde", "vigencia_hasta");



CREATE INDEX "idx_precio_servicio_vigencia" ON "finanzas"."precio_servicio_comercial" USING "btree" ("id_servicio_comercial", "segmento_comercial", "estado", "vigencia_desde", "vigencia_hasta");



CREATE INDEX "idx_presupuesto_m10_anio_estado" ON "finanzas"."presupuesto_manual_m10" USING "btree" ("anio", "estado");



CREATE INDEX "idx_producto_documento_documento" ON "finanzas"."producto_comercial_documento" USING "btree" ("id_documento_logico");



CREATE INDEX "idx_producto_documento_presentacion" ON "finanzas"."producto_comercial_documento" USING "btree" ("id_extension_producto_comercial", "estado", "orden_presentacion");



CREATE INDEX "idx_proveedor_identidad_m5" ON "finanzas"."proveedor" USING "btree" ("id_pais", "id_tipo_identificador", "identificador_tributario");



CREATE INDEX "idx_proyeccion_m7_moneda_categoria" ON "finanzas"."proyeccion_financiera_m7" USING "btree" ("id_moneda", "categoria");



CREATE INDEX "idx_proyeccion_m7_periodo" ON "finanzas"."proyeccion_financiera_m7" USING "btree" ("tipo", "anio", "mes", "estado");



CREATE INDEX "idx_proyecto_financiero_ficha" ON "finanzas"."proyecto_financiero" USING "btree" ("id_ficha_cliente");



CREATE INDEX "idx_proyecto_financiero_terreno" ON "finanzas"."proyecto_financiero" USING "btree" ("id_proyecto_terreno");



CREATE INDEX "idx_reasignacion_costo_m5_origen_estado" ON "finanzas"."solicitud_reasignacion_costo_m5" USING "btree" ("id_detalle_origen_m5", "estado");



CREATE INDEX "idx_reduccion_credito_m8_compromiso" ON "finanzas"."reduccion_compromiso_credito_m8" USING "btree" ("id_compromiso");



CREATE INDEX "idx_regularizacion_extraordinaria_estado" ON "finanzas"."regularizacion_extraordinaria" USING "btree" ("estado");



CREATE INDEX "idx_relacion_laboral_empleado_fecha" ON "finanzas"."relacion_laboral_empleado" USING "btree" ("id_empleado", "fecha_inicio");



CREATE INDEX "idx_remuneracion_empleado_estado" ON "finanzas"."remuneracion" USING "btree" ("id_empleado", "estado");



CREATE INDEX "idx_remuneracion_periodo_empleado" ON "finanzas"."remuneracion" USING "btree" ("id_periodo_remuneracion", "id_empleado");



CREATE INDEX "idx_remuneracion_reapertura" ON "finanzas"."remuneracion" USING "btree" ("reapertura_solicitada_en", "reapertura_aprobada_en");



CREATE INDEX "idx_resolucion_m11_hallazgo" ON "finanzas"."resolucion_hallazgo_m11" USING "btree" ("id_hallazgo", "creado_en");



CREATE INDEX "idx_respaldo_gasto_caja_m5" ON "finanzas"."respaldo_gasto_caja_chica_m5" USING "btree" ("id_gasto_caja_chica_m5", "fecha_hora");



CREATE INDEX "idx_reversion_pago_m5_movimiento" ON "finanzas"."reversion_movimiento_pago_m5" USING "btree" ("id_movimiento_pago_m5", "fecha_hora");



CREATE INDEX "idx_reversion_pago_remuneracion_pago" ON "finanzas"."reversion_pago_remuneracion" USING "btree" ("id_pago_remuneracion", "registrado_en");



CREATE INDEX "idx_saldo_favor_m5_proveedor_moneda" ON "finanzas"."saldo_favor_proveedor_m5" USING "btree" ("id_proveedor", "id_moneda", "estado");



CREATE INDEX "idx_saldo_inicial_bancario_m7_corte_estado" ON "finanzas"."saldo_inicial_bancario_m7" USING "btree" ("fecha_corte", "estado");



CREATE INDEX "idx_servicio_comercial_b2b" ON "finanzas"."servicio_comercial" USING "btree" ("estado", "habilitado_b2b");



CREATE INDEX "idx_solicitud_correccion_unidad_fecha" ON "finanzas"."solicitud_correccion_tecnica_ot" USING "btree" ("id_unidad_fisica_ot", "solicitado_en");



CREATE INDEX "idx_solicitud_crediticia_m8_bandeja" ON "finanzas"."solicitud_crediticia_m8" USING "btree" ("estado_solicitud", "tipo_solicitud", "fecha_creacion");



CREATE INDEX "idx_solicitud_crediticia_m8_cliente" ON "finanzas"."solicitud_crediticia_m8" USING "btree" ("id_ficha_cliente");



CREATE INDEX "idx_solicitud_crediticia_m8_solicitante" ON "finanzas"."solicitud_crediticia_m8" USING "btree" ("id_usuario_solicitante");



CREATE INDEX "idx_tarea_remunerable_empleado" ON "finanzas"."tarea_remunerable" USING "btree" ("rut_empleado");



CREATE INDEX "idx_tarea_remunerable_orden" ON "finanzas"."tarea_remunerable" USING "btree" ("id_orden_trabajo");



CREATE INDEX "idx_tarifa_esquema_vigencia" ON "finanzas"."tarifa_esquema_remuneracional" USING "btree" ("id_esquema", "vigencia_desde");



CREATE INDEX "idx_tarifa_instalacion_busqueda" ON "finanzas"."tarifa_instalacion_comercial" USING "btree" ("region_normalizada", "comuna_normalizada", "estado", "vigencia_desde", "vigencia_hasta");



CREATE INDEX "idx_tramo_impuesto_vigencia" ON "finanzas"."tramo_impuesto_renta" USING "btree" ("vigencia_desde", "vigencia_hasta");



CREATE INDEX "idx_tratamiento_remuneracional_empleado" ON "finanzas"."tratamiento_remuneracional_ejecucion" USING "btree" ("id_empleado");



CREATE INDEX "idx_tratamiento_remuneracional_estado" ON "finanzas"."tratamiento_remuneracional_ejecucion" USING "btree" ("estado_remunerabilidad", "estado_valorizacion");



CREATE INDEX "idx_version_documento_historial" ON "finanzas"."version_documento" USING "btree" ("id_documento_logico", "estado", "creado_en");



CREATE INDEX "idx_version_documento_sha256" ON "finanzas"."version_documento" USING "btree" ("sha256");



CREATE INDEX "idx_version_presupuesto_m10_historial" ON "finanzas"."version_presupuesto_m10" USING "btree" ("id_presupuesto_manual_m10", "fecha_creacion");



CREATE UNIQUE INDEX "nota_venta_id_cotizacion_key" ON "finanzas"."nota_venta" USING "btree" ("id_cotizacion");



CREATE UNIQUE INDEX "orden_compra_b2b_id_cotizacion_key" ON "finanzas"."orden_compra_b2b" USING "btree" ("id_cotizacion");



CREATE UNIQUE INDEX "pago_cliente_referencia_demostracion_key" ON "finanzas"."pago_cliente" USING "btree" ("referencia_demostracion");



CREATE INDEX "producto_comercial_version_fecha_idx" ON "finanzas"."producto_comercial_version" USING "btree" ("id_extension_producto_comercial", "creado_en");



CREATE INDEX "rectificacion_ot_estado_empleado_idx" ON "finanzas"."rectificacion_orden_trabajo" USING "btree" ("estado", "id_empleado_rectificador");



CREATE UNIQUE INDEX "reversion_nota_venta_folio_nota_credito_key" ON "finanzas"."reversion_nota_venta" USING "btree" ("folio_nota_credito");



CREATE INDEX "tarea_ejecutable_secuencia_idx" ON "finanzas"."tarea_ejecutable_unidad_ot" USING "btree" ("id_unidad_fisica_ot", "orden_etapa", "orden_tarea");



CREATE UNIQUE INDEX "tarea_ejecutable_unidad_ot_clave_idempotencia_key" ON "finanzas"."tarea_ejecutable_unidad_ot" USING "btree" ("clave_idempotencia");



CREATE INDEX "unidad_fisica_ot_cotizacion_estado_idx" ON "finanzas"."unidad_fisica_orden_trabajo" USING "btree" ("id_cotizacion", "estado");



CREATE INDEX "unidad_fisica_ot_producto_familia_idx" ON "finanzas"."unidad_fisica_orden_trabajo" USING "btree" ("id_extension_producto_comercial", "id_familia_producto_comercial");



CREATE UNIQUE INDEX "uq_alternativa_b2c_aceptada_grupo" ON "finanzas"."alternativa_b2c" USING "btree" ("id_grupo_alternativas_b2c") WHERE (("estado")::"text" = 'ACEPTADA'::"text");



CREATE UNIQUE INDEX "uq_asignacion_area_empleado_vigente" ON "finanzas"."asignacion_area_empleado" USING "btree" ("id_empleado") WHERE ("vigencia_hasta" IS NULL);



CREATE UNIQUE INDEX "uq_categoria_egreso_m5_nombre_normalizado" ON "finanzas"."categoria_egreso_m5" USING "btree" ("nombre_normalizado");



CREATE UNIQUE INDEX "uq_componente_automatico_clave" ON "finanzas"."componente_remuneracion" USING "btree" ("id_remuneracion", "tipo", "clave_negocio") WHERE ((("fuente_tipo")::"text" = 'AUTOMATICA'::"text") AND ("clave_negocio" IS NOT NULL));



CREATE UNIQUE INDEX "uq_componente_externo_version" ON "finanzas"."componente_remuneracion" USING "btree" ("id_remuneracion", "fuente_tipo", "referencia_origen", "version_origen") WHERE ((("tipo")::"text" = 'VALOR_EXTERNO'::"text") AND ("referencia_origen" IS NOT NULL) AND ("version_origen" IS NOT NULL));



CREATE UNIQUE INDEX "uq_componente_prorrateo_activo" ON "finanzas"."componente_remuneracion" USING "btree" ("id_remuneracion") WHERE ((("tipo")::"text" = 'PRORRATEO'::"text") AND (("estado_revision")::"text" = ANY (ARRAY[('propuesto'::character varying)::"text", ('aprobado'::character varying)::"text", ('conflicto'::character varying)::"text", ('pendiente_valorizacion'::character varying)::"text"])));



CREATE UNIQUE INDEX "uq_contacto_cotizacion_b2b_principal" ON "finanzas"."contacto_cotizacion_b2b" USING "btree" ("id_cotizacion") WHERE ("es_principal" AND (("estado")::"text" = 'ACTIVO'::"text"));



CREATE UNIQUE INDEX "uq_cotizacion_salud_empleado_vigencia" ON "finanzas"."cotizacion_salud_empleado" USING "btree" ("id_empleado", "vigencia_desde");



CREATE UNIQUE INDEX "uq_cotizacion_version_comercial" ON "finanzas"."cotizacion_version" USING "btree" ("id_cotizacion", "numero_version_comercial") WHERE ("numero_version_comercial" IS NOT NULL);



CREATE UNIQUE INDEX "uq_cotizacion_version_documento" ON "finanzas"."cotizacion_version" USING "btree" ("id_documento_logico") WHERE ("id_documento_logico" IS NOT NULL);



CREATE UNIQUE INDEX "uq_cotizacion_version_idempotencia" ON "finanzas"."cotizacion_version" USING "btree" ("clave_idempotencia") WHERE ("clave_idempotencia" IS NOT NULL);



CREATE UNIQUE INDEX "uq_cuenta_bancaria_m7_identidad" ON "finanzas"."cuenta_bancaria_m7" USING "btree" ("banco", "identificador_bancario", "id_moneda");



CREATE UNIQUE INDEX "uq_documento_definitivo_m5_identidad" ON "finanzas"."documento_proveedor_m5" USING "btree" ("id_proveedor", "id_tipo_documento", "folio_normalizado") WHERE (("clase")::"text" = 'definitivo'::"text");



CREATE UNIQUE INDEX "uq_evento_documental_lease_token" ON "finanzas"."evento_operacional_documental" USING "btree" ("lease_token") WHERE ("lease_token" IS NOT NULL);



CREATE UNIQUE INDEX "uq_producto_documento_principal_activa" ON "finanzas"."producto_comercial_documento" USING "btree" ("id_extension_producto_comercial") WHERE ("es_imagen_principal" AND (("estado")::"text" = 'ACTIVO'::"text"));



CREATE UNIQUE INDEX "uq_proyeccion_m7_activa" ON "finanzas"."proyeccion_financiera_m7" USING "btree" ("tipo", "anio", "mes", "id_moneda", "categoria") WHERE (("estado")::"text" = 'activo'::"text");



CREATE UNIQUE INDEX "uq_relacion_laboral_vigente_empleado" ON "finanzas"."relacion_laboral_empleado" USING "btree" ("id_empleado") WHERE ((("estado")::"text" = 'vigente'::"text") AND ("fecha_termino" IS NULL));



CREATE UNIQUE INDEX "uq_remuneracion_actual_periodo_empleado" ON "finanzas"."remuneracion" USING "btree" ("id_periodo_remuneracion", "id_empleado") WHERE (("estado")::"text" <> 'reemplazada'::"text");



CREATE UNIQUE INDEX "uq_respaldo_pago_m5_movimiento" ON "finanzas"."asociacion_respaldo_pago_m5" USING "btree" ("id_respaldo_pago_m5", "id_movimiento_pago_m5") WHERE ("id_movimiento_pago_m5" IS NOT NULL);



CREATE UNIQUE INDEX "uq_respaldo_pago_m5_operacion" ON "finanzas"."asociacion_respaldo_pago_m5" USING "btree" ("id_respaldo_pago_m5", "id_operacion_pago_m5") WHERE ("id_operacion_pago_m5" IS NOT NULL);



CREATE UNIQUE INDEX "uq_saldo_inicial_bancario_m7_cuenta_corte" ON "finanzas"."saldo_inicial_bancario_m7" USING "btree" ("id_cuenta_bancaria_m7", "fecha_corte");



CREATE INDEX "version_plantilla_historial_idx" ON "finanzas"."version_plantilla_fabricacion" USING "btree" ("id_plantilla_fabricacion", "publicado_en");



CREATE INDEX "idx_operacion_inventario_actor_fecha" ON "inventario"."operacion_inventario" USING "btree" ("actor_id", "creado_en" DESC);



CREATE INDEX "idx_reserva_inventario_ubicacion_estado" ON "inventario"."reserva_inventario" USING "btree" ("material_sku", "bodega_id_bodega", "lote_id_lote", "reserva_inventario_estado_reserva");



CREATE INDEX "idx_ejecucion_tarea_ejecutor" ON "terreno"."ejecucion_tarea" USING "btree" ("id_usuario_ejecutor", "fecha_ejecucion");



CREATE INDEX "idx_ejecucion_tarea_revision_m6" ON "terreno"."ejecucion_tarea" USING "btree" ("estado_ejecucion", "estado_validacion_productiva", "fecha_ejecucion");



CREATE INDEX "idx_evidencia_terreno_incidencia" ON "terreno"."evidencia_terreno" USING "btree" ("id_incidencia_retrabajo");



CREATE INDEX "idx_incidencia_area" ON "terreno"."incidencia_retrabajo_tarea" USING "btree" ("id_area_responsable");



CREATE INDEX "idx_incidencia_categoria_revision" ON "terreno"."incidencia_retrabajo_tarea" USING "btree" ("id_categoria_incidencia", "estado_revision");



CREATE INDEX "idx_incidencia_retrabajo_ejecucion" ON "terreno"."incidencia_retrabajo_tarea" USING "btree" ("id_ejecucion_tarea");



CREATE INDEX "idx_incidencia_retrabajo_pendiente" ON "terreno"."incidencia_retrabajo_tarea" USING "btree" ("estado", "fecha_registro");



CREATE INDEX "idx_tarea_orden_trabajo" ON "terreno"."tarea" USING "btree" ("id_orden_trabajo");



CREATE TRIGGER "tr_alternativa_b2c_integridad" BEFORE INSERT OR UPDATE OF "id_extension_producto_comercial", "id_producto_comercial_version", "id_precio_producto_comercial", "id_moneda", "precio_unitario", "id_tarifa_instalacion_comercial", "precio_instalacion" ON "finanzas"."alternativa_b2c" FOR EACH ROW EXECUTE FUNCTION "finanzas"."validar_alternativa_b2c"();



CREATE TRIGGER "tr_alternativa_b2c_opcional_integridad" BEFORE INSERT OR UPDATE ON "finanzas"."alternativa_b2c_opcional" FOR EACH ROW EXECUTE FUNCTION "finanzas"."validar_opcional_alternativa_b2c"();



CREATE TRIGGER "tr_carta_b2c_documento_disponible" BEFORE INSERT OR UPDATE OF "estado_documental", "id_documento_logico" ON "finanzas"."carta_comercial_b2c_version" FOR EACH ROW WHEN ((("new"."estado_documental")::"text" = 'DISPONIBLE'::"text")) EXECUTE FUNCTION "finanzas"."validar_publicacion_documental"();



CREATE TRIGGER "tr_carta_b2c_fotografia_autorizada" BEFORE INSERT OR UPDATE OF "id_producto_comercial_documento", "id_version_documento" ON "finanzas"."carta_comercial_b2c_version_fotografia" FOR EACH ROW EXECUTE FUNCTION "finanzas"."validar_fotografia_carta_b2c"();



CREATE TRIGGER "tr_carta_b2c_fotografia_inmutable" BEFORE INSERT OR DELETE OR UPDATE ON "finanzas"."carta_comercial_b2c_version_fotografia" FOR EACH ROW EXECUTE FUNCTION "finanzas"."bloquear_detalle_publicacion_carta_b2c"();



CREATE TRIGGER "tr_carta_b2c_producto_coherente" BEFORE INSERT OR UPDATE OF "id_producto_comercial_version", "id_precio_producto_comercial" ON "finanzas"."carta_comercial_b2c_version_producto" FOR EACH ROW EXECUTE FUNCTION "finanzas"."validar_producto_carta_b2c"();



CREATE TRIGGER "tr_carta_b2c_producto_inmutable" BEFORE INSERT OR DELETE OR UPDATE ON "finanzas"."carta_comercial_b2c_version_producto" FOR EACH ROW EXECUTE FUNCTION "finanzas"."bloquear_detalle_publicacion_carta_b2c"();



CREATE TRIGGER "tr_carta_b2c_version_inmutable" BEFORE DELETE OR UPDATE ON "finanzas"."carta_comercial_b2c_version" FOR EACH ROW EXECUTE FUNCTION "finanzas"."bloquear_version_publicada"();



CREATE TRIGGER "tr_condicion_comercial_version_inmutable" BEFORE DELETE OR UPDATE ON "finanzas"."condicion_comercial_version" FOR EACH ROW EXECUTE FUNCTION "finanzas"."bloquear_version_publicada"();



CREATE TRIGGER "tr_contacto_cotizacion_b2b" BEFORE INSERT OR UPDATE ON "finanzas"."contacto_cotizacion_b2b" FOR EACH ROW EXECUTE FUNCTION "finanzas"."validar_contacto_cotizacion_b2b"();



CREATE TRIGGER "tr_cotizacion_exigir_documento_emitido" BEFORE UPDATE OF "estado_cotizacion" ON "finanzas"."cotizacion" FOR EACH ROW EXECUTE FUNCTION "finanzas"."exigir_documento_cotizacion_emitida"();



CREATE TRIGGER "tr_cotizacion_version_comercial_inmutable" BEFORE DELETE OR UPDATE ON "finanzas"."cotizacion_version" FOR EACH ROW WHEN (("old"."numero_version_comercial" IS NOT NULL)) EXECUTE FUNCTION "finanzas"."bloquear_version_publicada"();



CREATE TRIGGER "tr_cotizacion_version_documento_disponible" BEFORE INSERT OR UPDATE OF "estado_documental", "id_documento_logico" ON "finanzas"."cotizacion_version" FOR EACH ROW WHEN ((("new"."estado_documental")::"text" = 'DISPONIBLE'::"text")) EXECUTE FUNCTION "finanzas"."validar_publicacion_documental"();



CREATE TRIGGER "tr_detalle_cotizacion_alternativa_aceptada" BEFORE INSERT OR UPDATE OF "id_alternativa_b2c_aceptada", "id_cotizacion", "id_extension_producto_comercial", "id_producto_comercial_version", "id_precio_producto_comercial" ON "finanzas"."detalle_cotizacion" FOR EACH ROW EXECUTE FUNCTION "finanzas"."validar_detalle_desde_alternativa_b2c"();



CREATE TRIGGER "tr_detalle_servicio_c3_3" BEFORE INSERT OR UPDATE ON "finanzas"."detalle_servicio_cotizacion" FOR EACH ROW EXECUTE FUNCTION "finanzas"."validar_detalle_servicio_c3_3"();



CREATE TRIGGER "tr_grupo_alternativas_exige_b2c" BEFORE INSERT OR UPDATE OF "id_cotizacion" ON "finanzas"."grupo_alternativas_b2c" FOR EACH ROW EXECUTE FUNCTION "finanzas"."validar_grupo_alternativas_b2c"();



CREATE TRIGGER "tr_grupo_seleccion_alternativa_b2c" BEFORE INSERT OR UPDATE OF "id_alternativa_seleccionada" ON "finanzas"."grupo_alternativas_b2c" FOR EACH ROW EXECUTE FUNCTION "finanzas"."validar_seleccion_alternativa_b2c"();



CREATE TRIGGER "tr_historial_alternativa_b2c_inmutable" BEFORE DELETE OR UPDATE ON "finanzas"."historial_decision_alternativa_b2c" FOR EACH ROW EXECUTE FUNCTION "finanzas"."bloquear_historial_alternativa_b2c"();



CREATE TRIGGER "tr_historial_seleccion_inmutable" BEFORE DELETE OR UPDATE ON "finanzas"."historial_seleccion_alternativa_b2c" FOR EACH ROW EXECUTE FUNCTION "finanzas"."bloquear_historial_alternativa_b2c"();



CREATE TRIGGER "tr_plantilla_documental_version_inmutable" BEFORE DELETE OR UPDATE ON "finanzas"."plantilla_documental_version" FOR EACH ROW EXECUTE FUNCTION "finanzas"."bloquear_version_publicada"();



CREATE TRIGGER "tr_proteger_boleta_honorarios_confirmada" BEFORE DELETE OR UPDATE ON "finanzas"."boleta_honorarios" FOR EACH ROW EXECUTE FUNCTION "finanzas"."proteger_boleta_honorarios_confirmada"();



CREATE TRIGGER "tr_proteger_borrado_anticipo_pagado" BEFORE DELETE ON "finanzas"."anticipo_remuneracion" FOR EACH ROW EXECUTE FUNCTION "finanzas"."proteger_borrado_origen_pago_remuneracion"('ANTICIPO');



CREATE TRIGGER "tr_proteger_borrado_boleta_pagada" BEFORE DELETE ON "finanzas"."boleta_honorarios" FOR EACH ROW EXECUTE FUNCTION "finanzas"."proteger_borrado_origen_pago_remuneracion"('BOLETA_HONORARIOS');



CREATE TRIGGER "tr_proteger_borrado_regularizacion_pagada" BEFORE DELETE ON "finanzas"."regularizacion_extraordinaria" FOR EACH ROW EXECUTE FUNCTION "finanzas"."proteger_borrado_origen_pago_remuneracion"('REGULARIZACION');



CREATE TRIGGER "tr_proteger_borrado_remuneracion_pagada" BEFORE DELETE ON "finanzas"."remuneracion" FOR EACH ROW EXECUTE FUNCTION "finanzas"."proteger_borrado_origen_pago_remuneracion"('REMUNERACION');



CREATE TRIGGER "tr_proteger_pago_remuneracion_confirmado" BEFORE UPDATE ON "finanzas"."pago_remuneracion" FOR EACH ROW EXECUTE FUNCTION "finanzas"."proteger_pago_remuneracion_confirmado"();



CREATE TRIGGER "tr_proteger_reversion_pago_remuneracion" BEFORE UPDATE ON "finanzas"."reversion_pago_remuneracion" FOR EACH ROW EXECUTE FUNCTION "finanzas"."proteger_reversion_pago_remuneracion"();



CREATE TRIGGER "tr_validar_origen_pago_remuneracion" BEFORE INSERT OR UPDATE OF "origen_tipo", "origen_id" ON "finanzas"."pago_remuneracion" FOR EACH ROW EXECUTE FUNCTION "finanzas"."validar_origen_pago_remuneracion"();



CREATE TRIGGER "tr_validar_reversion_pago_remuneracion" BEFORE INSERT ON "finanzas"."reversion_pago_remuneracion" FOR EACH ROW EXECUTE FUNCTION "finanzas"."validar_reversion_pago_remuneracion"();



CREATE TRIGGER "tr_validar_saldo_pago_remuneracion" BEFORE INSERT OR UPDATE OF "estado" ON "finanzas"."pago_remuneracion" FOR EACH ROW EXECUTE FUNCTION "finanzas"."validar_saldo_pago_remuneracion"();



CREATE TRIGGER "trg_aplicacion_revision_ot_inmutable" BEFORE DELETE OR UPDATE ON "finanzas"."aplicacion_revision_tecnica_ot" FOR EACH ROW EXECUTE FUNCTION "finanzas"."impedir_cambio_aplicacion_revision_ot"();



CREATE TRIGGER "trg_cierre_produccion_ot_inmutable" BEFORE DELETE OR UPDATE ON "finanzas"."cierre_orden_trabajo_produccion" FOR EACH ROW EXECUTE FUNCTION "finanzas"."impedir_cambio_cierre_produccion_ot"();



CREATE TRIGGER "trg_decision_rectificacion_ot_inmutable" BEFORE DELETE OR UPDATE ON "finanzas"."decision_rectificacion_orden_trabajo" FOR EACH ROW EXECUTE FUNCTION "finanzas"."impedir_cambio_decision_rectificacion_ot"();



CREATE TRIGGER "trg_documento_logico_transicion" BEFORE UPDATE OF "estado" ON "finanzas"."documento_logico" FOR EACH ROW EXECUTE FUNCTION "finanzas"."validar_transicion_documento_logico"();



CREATE TRIGGER "trg_historial_produccion_ot_inmutable" BEFORE DELETE OR UPDATE ON "finanzas"."historial_cambio_produccion_ot" FOR EACH ROW EXECUTE FUNCTION "finanzas"."impedir_cambio_historial_produccion_ot"();



CREATE TRIGGER "trg_historial_rectificacion_ot_inmutable" BEFORE DELETE OR UPDATE ON "finanzas"."historial_rectificacion_orden_trabajo" FOR EACH ROW EXECUTE FUNCTION "finanzas"."impedir_cambio_historial_rectificacion_ot"();



CREATE TRIGGER "trg_historial_unidad_fisica_ot_inmutable" BEFORE DELETE OR UPDATE ON "finanzas"."historial_unidad_fisica_ot" FOR EACH ROW EXECUTE FUNCTION "finanzas"."impedir_cambio_historial_unidad_fisica_ot"();



CREATE TRIGGER "trg_intencion_documental_transicion" BEFORE UPDATE OF "estado" ON "finanzas"."intencion_carga_documental" FOR EACH ROW EXECUTE FUNCTION "finanzas"."validar_transicion_intencion_documental"();



CREATE TRIGGER "trg_liberacion_ot_inmutable" BEFORE DELETE OR UPDATE ON "finanzas"."liberacion_orden_trabajo" FOR EACH ROW EXECUTE FUNCTION "finanzas"."impedir_cambio_liberacion_ot"();



CREATE TRIGGER "trg_m9_evento_inmutable" BEFORE DELETE OR UPDATE ON "finanzas"."evento_auditoria_m9" FOR EACH ROW EXECUTE FUNCTION "finanzas"."bloquear_mutacion_evento_auditoria_m9"();



CREATE TRIGGER "trg_m9_politica_inmutable" BEFORE DELETE OR UPDATE ON "finanzas"."politica_tratamiento_m9" FOR EACH ROW EXECUTE FUNCTION "finanzas"."bloquear_mutacion_politica_m9"();



CREATE TRIGGER "trg_origen_tarea_ejecutable_ot_inmutable" BEFORE DELETE OR UPDATE ON "finanzas"."tarea_ejecutable_unidad_ot" FOR EACH ROW EXECUTE FUNCTION "finanzas"."impedir_cambio_origen_tarea_ejecutable_ot"();



CREATE TRIGGER "trg_producto_comercial_version_inmutable" BEFORE DELETE OR UPDATE ON "finanzas"."producto_comercial_version" FOR EACH ROW EXECUTE FUNCTION "finanzas"."impedir_cambio_producto_comercial_version"();



CREATE TRIGGER "trg_variante_documental_sin_ciclos" BEFORE INSERT OR UPDATE ON "finanzas"."variante_documento" FOR EACH ROW EXECUTE FUNCTION "finanzas"."validar_variante_documental_sin_ciclos"();



CREATE TRIGGER "trg_version_documento_reglas" BEFORE INSERT OR UPDATE ON "finanzas"."version_documento" FOR EACH ROW EXECUTE FUNCTION "finanzas"."validar_version_documento"();



CREATE TRIGGER "trg_version_plantilla_fabricacion_inmutable" BEFORE DELETE OR UPDATE ON "finanzas"."version_plantilla_fabricacion" FOR EACH ROW EXECUTE FUNCTION "finanzas"."impedir_cambio_version_plantilla_fabricacion"();



CREATE TRIGGER "trg_version_rectificacion_ot_inmutable" BEFORE DELETE OR UPDATE ON "finanzas"."version_rectificacion_orden_trabajo" FOR EACH ROW EXECUTE FUNCTION "finanzas"."impedir_cambio_version_rectificacion_ot"();



ALTER TABLE ONLY "comun"."estado_seguridad_usuario"
    ADD CONSTRAINT "estado_seguridad_usuario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") ON UPDATE RESTRICT ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "comun"."obra"
    ADD CONSTRAINT "fk_obra_id_especificacion_puerta" FOREIGN KEY ("id_especificacion_puerta") REFERENCES "terreno"."especificaciones_puerta"("especificacion_puerta_especificacion_puerta_id") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "comun"."obra"
    ADD CONSTRAINT "fk_obra_rut_cliente" FOREIGN KEY ("rut_cliente") REFERENCES "terreno"."cliente"("cliente_cliente_rut") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "comun"."perfil_permiso"
    ADD CONSTRAINT "fk_perfil_permiso_perfil_id_perfil" FOREIGN KEY ("perfil_id_perfil") REFERENCES "comun"."perfil"("perfil_id_perfil") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "comun"."perfil_permiso"
    ADD CONSTRAINT "fk_perfil_permiso_permiso_id_permiso" FOREIGN KEY ("permiso_id_permiso") REFERENCES "comun"."permiso"("permiso_id_permiso") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "comun"."proyecto"
    ADD CONSTRAINT "fk_proyecto_cotizacion_origen" FOREIGN KEY ("id_cotizacion_origen") REFERENCES "finanzas"."cotizacion"("id_cotizacion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "comun"."proyecto_obra"
    ADD CONSTRAINT "fk_proyecto_obra_obra" FOREIGN KEY ("id_obra") REFERENCES "comun"."obra"("obra_obra_id") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "comun"."proyecto_obra"
    ADD CONSTRAINT "fk_proyecto_obra_proyecto" FOREIGN KEY ("id_proyecto") REFERENCES "comun"."proyecto"("proyecto_proyecto_id") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "comun"."proyecto"
    ADD CONSTRAINT "fk_proyecto_rut_cliente" FOREIGN KEY ("rut_cliente") REFERENCES "terreno"."cliente"("cliente_cliente_rut") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "comun"."usuario_contrasena"
    ADD CONSTRAINT "fk_usuario_contrasena_usuario_id_usuario" FOREIGN KEY ("usuario_id_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "comun"."usuario"
    ADD CONSTRAINT "fk_usuario_empleado_rut_empleado" FOREIGN KEY ("empleado_rut_empleado") REFERENCES "finanzas"."empleado"("rut_empleado") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "comun"."usuario"
    ADD CONSTRAINT "fk_usuario_perfil_id_perfil" FOREIGN KEY ("perfil_id_perfil") REFERENCES "comun"."perfil"("perfil_id_perfil") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "comun"."permiso_dependencia"
    ADD CONSTRAINT "permiso_dependencia_id_permiso_fkey" FOREIGN KEY ("id_permiso") REFERENCES "comun"."permiso"("permiso_id_permiso") ON UPDATE RESTRICT ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "comun"."permiso_dependencia"
    ADD CONSTRAINT "permiso_dependencia_id_requerido_fkey" FOREIGN KEY ("id_requerido") REFERENCES "comun"."permiso"("permiso_id_permiso") ON UPDATE RESTRICT ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "comun"."sesion_usuario"
    ADD CONSTRAINT "sesion_usuario_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") ON UPDATE RESTRICT ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "comun"."token_recuperacion"
    ADD CONSTRAINT "token_recuperacion_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") ON UPDATE RESTRICT ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "comun"."usuario"
    ADD CONSTRAINT "usuario_empleado_m4_fkey" FOREIGN KEY ("empleado_m4") REFERENCES "finanzas"."empleado"("rut_empleado") ON UPDATE RESTRICT ON DELETE SET NULL DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "comun"."usuario_permiso_particular"
    ADD CONSTRAINT "usuario_permiso_particular_id_permiso_fkey" FOREIGN KEY ("id_permiso") REFERENCES "comun"."permiso"("permiso_id_permiso") ON UPDATE RESTRICT ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "comun"."usuario_permiso_particular"
    ADD CONSTRAINT "usuario_permiso_particular_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") ON UPDATE RESTRICT ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."ajuste_obligacion_proveedor_m5"
    ADD CONSTRAINT "ajuste_obligacion_proveedor_m5_anulado_por_fkey" FOREIGN KEY ("anulado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."ajuste_obligacion_proveedor_m5"
    ADD CONSTRAINT "ajuste_obligacion_proveedor_m5_creado_por_fkey" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."ajuste_obligacion_proveedor_m5"
    ADD CONSTRAINT "ajuste_obligacion_proveedor_m5_id_documento_ajuste_m5_fkey" FOREIGN KEY ("id_documento_ajuste_m5") REFERENCES "finanzas"."documento_proveedor_m5"("id_documento_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."ajuste_obligacion_proveedor_m5"
    ADD CONSTRAINT "ajuste_obligacion_proveedor_m5_id_moneda_fkey" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."ajuste_obligacion_proveedor_m5"
    ADD CONSTRAINT "ajuste_obligacion_proveedor_m5_id_obligacion_m5_fkey" FOREIGN KEY ("id_obligacion_m5") REFERENCES "finanzas"."obligacion_proveedor_m5"("id_obligacion_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."ajuste_obligacion_proveedor_m5"
    ADD CONSTRAINT "ajuste_obligacion_proveedor_m5_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "finanzas"."proveedor"("id_proveedor") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."ajuste_obligacion_proveedor_m5"
    ADD CONSTRAINT "ajuste_obligacion_proveedor_m5_id_respaldo_anulacion_fkey" FOREIGN KEY ("id_respaldo_anulacion") REFERENCES "finanzas"."respaldo_pago_proveedor_m5"("id_respaldo_pago_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."ajuste_obligacion_proveedor_m5"
    ADD CONSTRAINT "ajuste_obligacion_proveedor_m5_id_tipo_documento_fkey" FOREIGN KEY ("id_tipo_documento") REFERENCES "finanzas"."tipo_documento"("id_tipo_documento") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."ajuste_producto_plantilla_fabricacion"
    ADD CONSTRAINT "ajuste_plantilla_actualizador_fk" FOREIGN KEY ("actualizado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."ajuste_producto_plantilla_fabricacion"
    ADD CONSTRAINT "ajuste_plantilla_creador_fk" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."ajuste_producto_plantilla_fabricacion"
    ADD CONSTRAINT "ajuste_plantilla_producto_fk" FOREIGN KEY ("id_extension_producto_comercial") REFERENCES "finanzas"."extension_producto_comercial"("id_extension_producto_comercial") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."ajuste_producto_plantilla_fabricacion"
    ADD CONSTRAINT "ajuste_plantilla_raiz_fk" FOREIGN KEY ("id_plantilla_fabricacion") REFERENCES "finanzas"."plantilla_fabricacion_familia"("id_plantilla_fabricacion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."ajuste_producto_plantilla_fabricacion"
    ADD CONSTRAINT "ajuste_plantilla_version_fk" FOREIGN KEY ("id_version_plantilla_base") REFERENCES "finanzas"."version_plantilla_fabricacion"("id_version_plantilla") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."anulacion_movimiento_pago_m5"
    ADD CONSTRAINT "anulacion_movimiento_pago_m5_id_movimiento_pago_m5_fkey" FOREIGN KEY ("id_movimiento_pago_m5") REFERENCES "finanzas"."movimiento_pago_proveedor_m5"("id_movimiento_pago_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."anulacion_movimiento_pago_m5"
    ADD CONSTRAINT "anulacion_movimiento_pago_m5_id_respaldo_pago_m5_fkey" FOREIGN KEY ("id_respaldo_pago_m5") REFERENCES "finanzas"."respaldo_pago_proveedor_m5"("id_respaldo_pago_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."anulacion_movimiento_pago_m5"
    ADD CONSTRAINT "anulacion_movimiento_pago_m5_usuario_id_usuario_fkey" FOREIGN KEY ("usuario_id_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."anulacion_pago"
    ADD CONSTRAINT "anulacion_pago_id_pago_cliente_fkey" FOREIGN KEY ("id_pago_cliente") REFERENCES "finanzas"."pago_cliente"("id_pago_cliente") ON UPDATE RESTRICT ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."aplicacion_saldo_favor"
    ADD CONSTRAINT "aplicacion_saldo_favor_id_nota_venta_fkey" FOREIGN KEY ("id_nota_venta") REFERENCES "finanzas"."nota_venta"("id_nota_venta") ON UPDATE RESTRICT ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."aplicacion_saldo_favor"
    ADD CONSTRAINT "aplicacion_saldo_favor_id_saldo_favor_cliente_fkey" FOREIGN KEY ("id_saldo_favor_cliente") REFERENCES "finanzas"."saldo_favor_cliente"("id_saldo_favor_cliente") ON UPDATE RESTRICT ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."asociacion_respaldo_pago_m5"
    ADD CONSTRAINT "asociacion_respaldo_pago_m5_id_movimiento_pago_m5_fkey" FOREIGN KEY ("id_movimiento_pago_m5") REFERENCES "finanzas"."movimiento_pago_proveedor_m5"("id_movimiento_pago_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."asociacion_respaldo_pago_m5"
    ADD CONSTRAINT "asociacion_respaldo_pago_m5_id_operacion_pago_m5_fkey" FOREIGN KEY ("id_operacion_pago_m5") REFERENCES "finanzas"."operacion_pago_proveedor_m5"("id_operacion_pago_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."asociacion_respaldo_pago_m5"
    ADD CONSTRAINT "asociacion_respaldo_pago_m5_id_respaldo_pago_m5_fkey" FOREIGN KEY ("id_respaldo_pago_m5") REFERENCES "finanzas"."respaldo_pago_proveedor_m5"("id_respaldo_pago_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."catalogo_tarea_fabricacion"
    ADD CONSTRAINT "catalogo_tarea_fabricacion_actualizador_fk" FOREIGN KEY ("actualizado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."catalogo_tarea_fabricacion"
    ADD CONSTRAINT "catalogo_tarea_fabricacion_area_fk" FOREIGN KEY ("id_area_trabajo") REFERENCES "comun"."area_trabajo"("area_trabajo_id_area") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."catalogo_tarea_fabricacion"
    ADD CONSTRAINT "catalogo_tarea_fabricacion_creador_fk" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."categoria_egreso_m5"
    ADD CONSTRAINT "categoria_egreso_m5_creado_por_fkey" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."comision_bancaria_m5"
    ADD CONSTRAINT "comision_bancaria_m5_id_moneda_fkey" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."comision_bancaria_m5"
    ADD CONSTRAINT "comision_bancaria_m5_id_movimiento_pago_m5_fkey" FOREIGN KEY ("id_movimiento_pago_m5") REFERENCES "finanzas"."movimiento_pago_proveedor_m5"("id_movimiento_pago_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."comision_bancaria_m5"
    ADD CONSTRAINT "comision_bancaria_m5_id_operacion_pago_m5_fkey" FOREIGN KEY ("id_operacion_pago_m5") REFERENCES "finanzas"."operacion_pago_proveedor_m5"("id_operacion_pago_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."comision_bancaria_m5"
    ADD CONSTRAINT "comision_bancaria_m5_id_respaldo_pago_m5_fkey" FOREIGN KEY ("id_respaldo_pago_m5") REFERENCES "finanzas"."respaldo_pago_proveedor_m5"("id_respaldo_pago_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."comision_bancaria_m5"
    ADD CONSTRAINT "comision_bancaria_m5_registrado_por_fkey" FOREIGN KEY ("registrado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."compensacion_saldo_favor_m5"
    ADD CONSTRAINT "compensacion_saldo_favor_m5_creado_por_fkey" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."compensacion_saldo_favor_m5"
    ADD CONSTRAINT "compensacion_saldo_favor_m5_id_moneda_fkey" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."compensacion_saldo_favor_m5"
    ADD CONSTRAINT "compensacion_saldo_favor_m5_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "finanzas"."proveedor"("id_proveedor") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."compensacion_saldo_favor_m5"
    ADD CONSTRAINT "compensacion_saldo_favor_m5_id_saldo_favor_m5_fkey" FOREIGN KEY ("id_saldo_favor_m5") REFERENCES "finanzas"."saldo_favor_proveedor_m5"("id_saldo_favor_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."conciliacion"
    ADD CONSTRAINT "conciliacion_id_pago_cliente_fkey" FOREIGN KEY ("id_pago_cliente") REFERENCES "finanzas"."pago_cliente"("id_pago_cliente") ON UPDATE RESTRICT ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."conciliacion_movimiento_pago_m5"
    ADD CONSTRAINT "conciliacion_movimiento_pago_m5_id_movimiento_pago_m5_fkey" FOREIGN KEY ("id_movimiento_pago_m5") REFERENCES "finanzas"."movimiento_pago_proveedor_m5"("id_movimiento_pago_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."conciliacion_movimiento_pago_m5"
    ADD CONSTRAINT "conciliacion_movimiento_pago_m5_usuario_id_usuario_fkey" FOREIGN KEY ("usuario_id_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."condicion_cobro_nv"
    ADD CONSTRAINT "condicion_cobro_nv_id_nota_venta_fkey" FOREIGN KEY ("id_nota_venta") REFERENCES "finanzas"."nota_venta"("id_nota_venta") ON UPDATE RESTRICT ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."config_umbral_reclasificacion_m5"
    ADD CONSTRAINT "config_umbral_reclasificacion_m5_actualizado_por_fkey" FOREIGN KEY ("actualizado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."costo_envio_importacion_m5"
    ADD CONSTRAINT "costo_envio_importacion_m5_id_comision_bancaria_m5_fkey" FOREIGN KEY ("id_comision_bancaria_m5") REFERENCES "finanzas"."comision_bancaria_m5"("id_comision_bancaria_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."costo_envio_importacion_m5"
    ADD CONSTRAINT "costo_envio_importacion_m5_id_envio_importacion_m5_fkey" FOREIGN KEY ("id_envio_importacion_m5") REFERENCES "finanzas"."envio_importacion_m5"("id_envio_importacion_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."costo_envio_importacion_m5"
    ADD CONSTRAINT "costo_envio_importacion_m5_id_moneda_fkey" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."costo_envio_importacion_m5"
    ADD CONSTRAINT "costo_envio_importacion_m5_id_obligacion_m5_fkey" FOREIGN KEY ("id_obligacion_m5") REFERENCES "finanzas"."obligacion_proveedor_m5"("id_obligacion_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."costo_envio_importacion_m5"
    ADD CONSTRAINT "costo_envio_importacion_m5_id_respaldo_pago_m5_fkey" FOREIGN KEY ("id_respaldo_pago_m5") REFERENCES "finanzas"."respaldo_pago_proveedor_m5"("id_respaldo_pago_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."costo_envio_importacion_m5"
    ADD CONSTRAINT "costo_envio_importacion_m5_registrado_por_fkey" FOREIGN KEY ("registrado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."cotizacion_version"
    ADD CONSTRAINT "cotizacion_version_id_cotizacion_fkey" FOREIGN KEY ("id_cotizacion") REFERENCES "finanzas"."cotizacion"("id_cotizacion") ON UPDATE RESTRICT ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."cuenta_bancaria_m7"
    ADD CONSTRAINT "cuenta_bancaria_m7_actualizado_por_fkey" FOREIGN KEY ("actualizado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."cuenta_bancaria_m7"
    ADD CONSTRAINT "cuenta_bancaria_m7_creado_por_fkey" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."decision_rectificacion_orden_trabajo"
    ADD CONSTRAINT "decision_rectificacion_actor_fk" FOREIGN KEY ("decidido_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."decision_rectificacion_orden_trabajo"
    ADD CONSTRAINT "decision_rectificacion_rectificacion_fk" FOREIGN KEY ("id_rectificacion_ot") REFERENCES "finanzas"."rectificacion_orden_trabajo"("id_rectificacion_ot") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."decision_rectificacion_orden_trabajo"
    ADD CONSTRAINT "decision_rectificacion_version_fk" FOREIGN KEY ("id_version_rectificacion") REFERENCES "finanzas"."version_rectificacion_orden_trabajo"("id_version_rectificacion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_compensacion_saldo_favor_m5"
    ADD CONSTRAINT "detalle_compensacion_saldo_favor_m5_id_compensacion_m5_fkey" FOREIGN KEY ("id_compensacion_m5") REFERENCES "finanzas"."compensacion_saldo_favor_m5"("id_compensacion_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_compensacion_saldo_favor_m5"
    ADD CONSTRAINT "detalle_compensacion_saldo_favor_m5_id_obligacion_m5_fkey" FOREIGN KEY ("id_obligacion_m5") REFERENCES "finanzas"."obligacion_proveedor_m5"("id_obligacion_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_reasignacion_costo_m5"
    ADD CONSTRAINT "detalle_reasignacion_costo_m5_id_orden_trabajo_fkey" FOREIGN KEY ("id_orden_trabajo") REFERENCES "inventario"."orden_trabajo"("orden_trabajo_id_orden") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_reasignacion_costo_m5"
    ADD CONSTRAINT "detalle_reasignacion_costo_m5_id_proyecto_fkey" FOREIGN KEY ("id_proyecto") REFERENCES "comun"."proyecto"("proyecto_proyecto_id") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_reasignacion_costo_m5"
    ADD CONSTRAINT "detalle_reasignacion_costo_m5_id_solicitud_reasignacion_m5_fkey" FOREIGN KEY ("id_solicitud_reasignacion_m5") REFERENCES "finanzas"."solicitud_reasignacion_costo_m5"("id_solicitud_reasignacion_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_reclasificacion_egreso_m5"
    ADD CONSTRAINT "detalle_reclasificacion_egreso__id_clasificacion_origen_m5_fkey" FOREIGN KEY ("id_clasificacion_origen_m5") REFERENCES "finanzas"."clasificacion_asociacion_m5"("id_clasificacion_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_reclasificacion_egreso_m5"
    ADD CONSTRAINT "detalle_reclasificacion_egreso_m5_id_asociacion_m5_fkey" FOREIGN KEY ("id_asociacion_m5") REFERENCES "finanzas"."asociacion_documento_oc_m5"("id_asociacion_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_reclasificacion_egreso_m5"
    ADD CONSTRAINT "detalle_reclasificacion_egreso_m5_id_categoria_destino_m5_fkey" FOREIGN KEY ("id_categoria_destino_m5") REFERENCES "finanzas"."categoria_egreso_m5"("id_categoria_egreso_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_reclasificacion_egreso_m5"
    ADD CONSTRAINT "detalle_reclasificacion_egreso_m5_id_categoria_origen_m5_fkey" FOREIGN KEY ("id_categoria_origen_m5") REFERENCES "finanzas"."categoria_egreso_m5"("id_categoria_egreso_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_reclasificacion_egreso_m5"
    ADD CONSTRAINT "detalle_reclasificacion_egreso_m5_id_reclasificacion_m5_fkey" FOREIGN KEY ("id_reclasificacion_m5") REFERENCES "finanzas"."reclasificacion_egreso_m5"("id_reclasificacion_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."documento_tributario_nota_venta"
    ADD CONSTRAINT "documento_tributario_nota_venta_id_documento_tributario_fkey" FOREIGN KEY ("id_documento_tributario") REFERENCES "finanzas"."documento_tributario"("id_documento_tributario") ON UPDATE RESTRICT ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."documento_tributario_nota_venta"
    ADD CONSTRAINT "documento_tributario_nota_venta_id_nota_venta_fkey" FOREIGN KEY ("id_nota_venta") REFERENCES "finanzas"."nota_venta"("id_nota_venta") ON UPDATE RESTRICT ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."envio_importacion_m5"
    ADD CONSTRAINT "envio_importacion_m5_creado_por_fkey" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."envio_orden_compra_m5"
    ADD CONSTRAINT "envio_orden_compra_m5_asociado_por_fkey" FOREIGN KEY ("asociado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."envio_orden_compra_m5"
    ADD CONSTRAINT "envio_orden_compra_m5_id_envio_importacion_m5_fkey" FOREIGN KEY ("id_envio_importacion_m5") REFERENCES "finanzas"."envio_importacion_m5"("id_envio_importacion_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."envio_orden_compra_m5"
    ADD CONSTRAINT "envio_orden_compra_m5_id_ocs_m5_fkey" FOREIGN KEY ("id_ocs_m5") REFERENCES "finanzas"."orden_compra_servicio_m5"("id_orden_compra_servicio_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."ajuste_orden_compra_servicio_m5"
    ADD CONSTRAINT "fk_ajuste_ocs_m5_confirmante" FOREIGN KEY ("confirmado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."ajuste_orden_compra_servicio_m5"
    ADD CONSTRAINT "fk_ajuste_ocs_m5_ocs" FOREIGN KEY ("id_ocs_m5") REFERENCES "finanzas"."orden_compra_servicio_m5"("id_orden_compra_servicio_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."ajuste_orden_compra_servicio_m5"
    ADD CONSTRAINT "fk_ajuste_ocs_m5_solicitante" FOREIGN KEY ("solicitado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."ajuste_posterior_remuneracion"
    ADD CONSTRAINT "fk_ajuste_posterior_creador" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."ajuste_posterior_remuneracion"
    ADD CONSTRAINT "fk_ajuste_posterior_empleado" FOREIGN KEY ("id_empleado") REFERENCES "finanzas"."empleado"("id_empleado") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."ajuste_posterior_remuneracion"
    ADD CONSTRAINT "fk_ajuste_posterior_periodo_aplicable" FOREIGN KEY ("id_periodo_aplicable") REFERENCES "finanzas"."periodo_remuneracion"("id_periodo_remuneracion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."ajuste_posterior_remuneracion"
    ADD CONSTRAINT "fk_ajuste_posterior_periodo_origen" FOREIGN KEY ("id_periodo_origen") REFERENCES "finanzas"."periodo_remuneracion"("id_periodo_remuneracion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."ajuste_posterior_remuneracion"
    ADD CONSTRAINT "fk_ajuste_posterior_postergador" FOREIGN KEY ("postergado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."ajuste_posterior_remuneracion"
    ADD CONSTRAINT "fk_ajuste_posterior_remuneracion" FOREIGN KEY ("id_remuneracion") REFERENCES "finanzas"."remuneracion"("id_remuneracion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."alternativa_b2c"
    ADD CONSTRAINT "fk_alternativa_b2c_condicion" FOREIGN KEY ("id_condicion_comercial_version") REFERENCES "finanzas"."condicion_comercial_version"("id_condicion_comercial_version") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."alternativa_b2c"
    ADD CONSTRAINT "fk_alternativa_b2c_decisor" FOREIGN KEY ("decidida_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."alternativa_b2c"
    ADD CONSTRAINT "fk_alternativa_b2c_grupo" FOREIGN KEY ("id_grupo_alternativas_b2c") REFERENCES "finanzas"."grupo_alternativas_b2c"("id_grupo_alternativas_b2c") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."alternativa_b2c"
    ADD CONSTRAINT "fk_alternativa_b2c_moneda" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."alternativa_b2c_opcional"
    ADD CONSTRAINT "fk_alternativa_b2c_opcional_alternativa" FOREIGN KEY ("id_alternativa_b2c") REFERENCES "finanzas"."alternativa_b2c"("id_alternativa_b2c") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."alternativa_b2c_opcional"
    ADD CONSTRAINT "fk_alternativa_b2c_opcional_compatibilidad" FOREIGN KEY ("id_compatibilidad_opcional") REFERENCES "finanzas"."compatibilidad_opcional_producto"("id_compatibilidad_opcional") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."alternativa_b2c_opcional"
    ADD CONSTRAINT "fk_alternativa_b2c_opcional_precio" FOREIGN KEY ("id_precio_opcional_comercial") REFERENCES "finanzas"."precio_opcional_comercial"("id_precio_opcional_comercial") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."alternativa_b2c"
    ADD CONSTRAINT "fk_alternativa_b2c_precio" FOREIGN KEY ("id_precio_producto_comercial") REFERENCES "finanzas"."precio_producto_comercial"("id_precio_producto_comercial") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."alternativa_b2c"
    ADD CONSTRAINT "fk_alternativa_b2c_producto" FOREIGN KEY ("id_extension_producto_comercial") REFERENCES "finanzas"."extension_producto_comercial"("id_extension_producto_comercial") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."alternativa_b2c"
    ADD CONSTRAINT "fk_alternativa_b2c_producto_version" FOREIGN KEY ("id_producto_comercial_version") REFERENCES "finanzas"."producto_comercial_version"("id_producto_comercial_version") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."alternativa_b2c"
    ADD CONSTRAINT "fk_alternativa_b2c_tarifa_instalacion" FOREIGN KEY ("id_tarifa_instalacion_comercial") REFERENCES "finanzas"."tarifa_instalacion_comercial"("id_tarifa_instalacion_comercial") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."anticipo_remuneracion"
    ADD CONSTRAINT "fk_anticipo_creador" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."anticipo_remuneracion"
    ADD CONSTRAINT "fk_anticipo_empleado" FOREIGN KEY ("id_empleado") REFERENCES "finanzas"."empleado"("id_empleado") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."anticipo_remuneracion"
    ADD CONSTRAINT "fk_anticipo_periodo" FOREIGN KEY ("id_periodo_remuneracion") REFERENCES "finanzas"."periodo_remuneracion"("id_periodo_remuneracion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."aplicacion_revision_tecnica_ot"
    ADD CONSTRAINT "fk_aplicacion_revision_actor" FOREIGN KEY ("aplicado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."aplicacion_revision_tecnica_ot"
    ADD CONSTRAINT "fk_aplicacion_revision_unidad" FOREIGN KEY ("id_unidad_fisica_ot") REFERENCES "finanzas"."unidad_fisica_orden_trabajo"("id_unidad_fisica_ot") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."aplicacion_revision_tecnica_ot"
    ADD CONSTRAINT "fk_aplicacion_revision_version" FOREIGN KEY ("id_version_rectificacion") REFERENCES "finanzas"."version_rectificacion_orden_trabajo"("id_version_rectificacion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."asignacion_area_empleado"
    ADD CONSTRAINT "fk_asignacion_area_asignador" FOREIGN KEY ("asignado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."asignacion_area_empleado"
    ADD CONSTRAINT "fk_asignacion_area_catalogo" FOREIGN KEY ("id_area_trabajo") REFERENCES "comun"."area_trabajo"("area_trabajo_id_area") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."asignacion_area_empleado"
    ADD CONSTRAINT "fk_asignacion_area_empleado" FOREIGN KEY ("id_empleado") REFERENCES "finanzas"."empleado"("id_empleado") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."asignacion_area_empleado"
    ADD CONSTRAINT "fk_asignacion_area_finalizador" FOREIGN KEY ("finalizado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."asignacion_concepto_remuneracion_empleado"
    ADD CONSTRAINT "fk_asignacion_concepto_catalogo" FOREIGN KEY ("id_concepto") REFERENCES "finanzas"."concepto_remuneracion"("id_concepto_remuneracion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."asignacion_concepto_remuneracion_empleado"
    ADD CONSTRAINT "fk_asignacion_concepto_empleado" FOREIGN KEY ("id_empleado") REFERENCES "finanzas"."empleado"("id_empleado") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."asignacion_esquema_remuneracional"
    ADD CONSTRAINT "fk_asignacion_esquema" FOREIGN KEY ("id_esquema") REFERENCES "finanzas"."esquema_remuneracional"("id_esquema_remuneracional") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."asignacion_esquema_remuneracional"
    ADD CONSTRAINT "fk_asignacion_esquema_cargo" FOREIGN KEY ("id_cargo") REFERENCES "finanzas"."cargo"("id_cargo") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."asignacion_esquema_remuneracional"
    ADD CONSTRAINT "fk_asignacion_esquema_empleado" FOREIGN KEY ("id_empleado") REFERENCES "finanzas"."empleado"("id_empleado") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."asignacion_pago_cliente"
    ADD CONSTRAINT "fk_asignacion_pago_cliente_documento" FOREIGN KEY ("id_documento_tributario") REFERENCES "finanzas"."documento_tributario"("id_documento_tributario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."asignacion_pago_cliente"
    ADD CONSTRAINT "fk_asignacion_pago_cliente_hito" FOREIGN KEY ("id_hito_cobro") REFERENCES "finanzas"."hito_cobro"("id_hito_cobro") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."asignacion_pago_cliente"
    ADD CONSTRAINT "fk_asignacion_pago_cliente_nota" FOREIGN KEY ("id_nota_venta") REFERENCES "finanzas"."nota_venta"("id_nota_venta") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."asignacion_pago_cliente"
    ADD CONSTRAINT "fk_asignacion_pago_cliente_pago" FOREIGN KEY ("id_pago_cliente") REFERENCES "finanzas"."pago_cliente"("id_pago_cliente") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."asignacion_pago_proveedor"
    ADD CONSTRAINT "fk_asignacion_pago_proveedor_documento" FOREIGN KEY ("id_documento_compra_proveedor") REFERENCES "finanzas"."documento_compra_proveedor"("id_documento_compra_proveedor") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."asignacion_pago_proveedor"
    ADD CONSTRAINT "fk_asignacion_pago_proveedor_pago" FOREIGN KEY ("id_pago_proveedor") REFERENCES "finanzas"."pago_proveedor"("id_pago_proveedor") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."asociacion_documento_oc_m5"
    ADD CONSTRAINT "fk_asociacion_m5_documento" FOREIGN KEY ("id_documento_m5") REFERENCES "finanzas"."documento_proveedor_m5"("id_documento_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."asociacion_documento_oc_m5"
    ADD CONSTRAINT "fk_asociacion_m5_ocs" FOREIGN KEY ("id_ocs_m5") REFERENCES "finanzas"."orden_compra_servicio_m5"("id_orden_compra_servicio_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."atribucion_ejecucion_tarea_ot"
    ADD CONSTRAINT "fk_atribucion_ejecucion" FOREIGN KEY ("id_ejecucion_tarea") REFERENCES "terreno"."ejecucion_tarea"("id_ejecucion_tarea") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."atribucion_ejecucion_tarea_ot"
    ADD CONSTRAINT "fk_atribucion_empleado" FOREIGN KEY ("id_empleado_ejecutor") REFERENCES "finanzas"."empleado"("id_empleado") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."atribucion_ejecucion_tarea_ot"
    ADD CONSTRAINT "fk_atribucion_registrador" FOREIGN KEY ("registrado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."boleta_honorarios"
    ADD CONSTRAINT "fk_boleta_honorarios_prestador" FOREIGN KEY ("id_prestador") REFERENCES "finanzas"."prestador_honorarios"("id_prestador_honorarios") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."carta_comercial_b2c"
    ADD CONSTRAINT "fk_carta_b2c_creador" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."carta_comercial_b2c_version_fotografia"
    ADD CONSTRAINT "fk_carta_b2c_fotografia_asociacion" FOREIGN KEY ("id_producto_comercial_documento") REFERENCES "finanzas"."producto_comercial_documento"("id_producto_comercial_documento") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."carta_comercial_b2c_version_fotografia"
    ADD CONSTRAINT "fk_carta_b2c_fotografia_documento" FOREIGN KEY ("id_version_documento") REFERENCES "finanzas"."version_documento"("id_version_documento") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."carta_comercial_b2c_version_fotografia"
    ADD CONSTRAINT "fk_carta_b2c_fotografia_version_carta" FOREIGN KEY ("id_carta_comercial_b2c_version") REFERENCES "finanzas"."carta_comercial_b2c_version"("id_carta_comercial_b2c_version") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."carta_comercial_b2c_version_producto"
    ADD CONSTRAINT "fk_carta_b2c_producto_version_carta" FOREIGN KEY ("id_carta_comercial_b2c_version") REFERENCES "finanzas"."carta_comercial_b2c_version"("id_carta_comercial_b2c_version") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."carta_comercial_b2c_version_producto"
    ADD CONSTRAINT "fk_carta_b2c_producto_version_precio" FOREIGN KEY ("id_precio_producto_comercial") REFERENCES "finanzas"."precio_producto_comercial"("id_precio_producto_comercial") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."carta_comercial_b2c_version_producto"
    ADD CONSTRAINT "fk_carta_b2c_producto_version_producto" FOREIGN KEY ("id_producto_comercial_version") REFERENCES "finanzas"."producto_comercial_version"("id_producto_comercial_version") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."carta_comercial_b2c_version"
    ADD CONSTRAINT "fk_carta_b2c_version_condicion" FOREIGN KEY ("id_condicion_comercial_version") REFERENCES "finanzas"."condicion_comercial_version"("id_condicion_comercial_version") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."carta_comercial_b2c_version"
    ADD CONSTRAINT "fk_carta_b2c_version_documento" FOREIGN KEY ("id_documento_logico") REFERENCES "finanzas"."documento_logico"("id_documento_logico") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."carta_comercial_b2c_version"
    ADD CONSTRAINT "fk_carta_b2c_version_plantilla" FOREIGN KEY ("id_plantilla_documental_version") REFERENCES "finanzas"."plantilla_documental_version"("id_plantilla_documental_version") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."carta_comercial_b2c_version"
    ADD CONSTRAINT "fk_carta_b2c_version_publicador" FOREIGN KEY ("publicado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."carta_comercial_b2c_version"
    ADD CONSTRAINT "fk_carta_b2c_version_raiz" FOREIGN KEY ("id_carta_comercial_b2c") REFERENCES "finanzas"."carta_comercial_b2c"("id_carta_comercial_b2c") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."cierre_orden_trabajo_produccion"
    ADD CONSTRAINT "fk_cierre_ot_actor" FOREIGN KEY ("finalizado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."cierre_orden_trabajo_produccion"
    ADD CONSTRAINT "fk_cierre_ot_unidad" FOREIGN KEY ("id_unidad_fisica_ot") REFERENCES "finanzas"."unidad_fisica_orden_trabajo"("id_unidad_fisica_ot") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."cierre_orden_trabajo_produccion"
    ADD CONSTRAINT "fk_cierre_ot_version" FOREIGN KEY ("id_version_rectificacion") REFERENCES "finanzas"."version_rectificacion_orden_trabajo"("id_version_rectificacion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."clasificacion_asociacion_m5"
    ADD CONSTRAINT "fk_clasificacion_m5_asociacion" FOREIGN KEY ("id_asociacion_m5") REFERENCES "finanzas"."asociacion_documento_oc_m5"("id_asociacion_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."clasificacion_asociacion_m5"
    ADD CONSTRAINT "fk_clasificacion_m5_categoria" FOREIGN KEY ("id_categoria_egreso_m5") REFERENCES "finanzas"."categoria_egreso_m5"("id_categoria_egreso_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."cliente_financiero"
    ADD CONSTRAINT "fk_cliente_financiero_tipo_cliente" FOREIGN KEY ("id_tipo_cliente_financiero") REFERENCES "finanzas"."tipo_cliente_financiero"("id_tipo_cliente_financiero") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."compatibilidad_opcional_producto"
    ADD CONSTRAINT "fk_compatibilidad_opcional_catalogo" FOREIGN KEY ("id_opcional_comercial") REFERENCES "finanzas"."opcional_comercial"("id_opcional_comercial") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."compatibilidad_opcional_producto"
    ADD CONSTRAINT "fk_compatibilidad_opcional_producto" FOREIGN KEY ("id_extension_producto_comercial") REFERENCES "finanzas"."extension_producto_comercial"("id_extension_producto_comercial") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."componente_remuneracion"
    ADD CONSTRAINT "fk_componente_concepto" FOREIGN KEY ("id_concepto") REFERENCES "finanzas"."concepto_remuneracion"("id_concepto_remuneracion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."componente_remuneracion"
    ADD CONSTRAINT "fk_componente_creador" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."componente_remuneracion"
    ADD CONSTRAINT "fk_componente_origen" FOREIGN KEY ("id_componente_origen") REFERENCES "finanzas"."componente_remuneracion"("id_componente_remuneracion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."componente_remuneracion"
    ADD CONSTRAINT "fk_componente_remuneracion" FOREIGN KEY ("id_remuneracion") REFERENCES "finanzas"."remuneracion"("id_remuneracion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."componente_remuneracion"
    ADD CONSTRAINT "fk_componente_revisor" FOREIGN KEY ("revisado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."compromiso_credito_m8"
    ADD CONSTRAINT "fk_compromiso_credito_m8_excepcion" FOREIGN KEY ("id_solicitud_excepcion") REFERENCES "finanzas"."solicitud_crediticia_m8"("id_solicitud_crediticia") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."compromiso_credito_m8"
    ADD CONSTRAINT "fk_compromiso_credito_m8_ficha" FOREIGN KEY ("id_ficha_cliente") REFERENCES "finanzas"."ficha_cliente"("id_ficha_cliente") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."compromiso_credito_m8"
    ADD CONSTRAINT "fk_compromiso_credito_m8_nota" FOREIGN KEY ("id_nota_venta") REFERENCES "finanzas"."nota_venta"("id_nota_venta") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."conciliacion"
    ADD CONSTRAINT "fk_conciliacion_movimiento_bancario" FOREIGN KEY ("id_movimiento_bancario") REFERENCES "finanzas"."movimiento_bancario"("id_movimiento_bancario") ON DELETE SET NULL DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."conciliacion"
    ADD CONSTRAINT "fk_conciliacion_movimiento_financiero" FOREIGN KEY ("id_movimiento_financiero") REFERENCES "finanzas"."movimiento_financiero"("id_movimiento_financiero") ON DELETE SET NULL DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."condicion_comercial"
    ADD CONSTRAINT "fk_condicion_comercial_creador" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."condicion_crediticia_m8"
    ADD CONSTRAINT "fk_condicion_crediticia_m8_ficha" FOREIGN KEY ("id_ficha_cliente") REFERENCES "finanzas"."ficha_cliente"("id_ficha_cliente") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."condicion_comercial_version"
    ADD CONSTRAINT "fk_condicion_version_publicador" FOREIGN KEY ("publicado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."condicion_comercial_version"
    ADD CONSTRAINT "fk_condicion_version_raiz" FOREIGN KEY ("id_condicion_comercial") REFERENCES "finanzas"."condicion_comercial"("id_condicion_comercial") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."config_umbral_por_vencer_m5"
    ADD CONSTRAINT "fk_config_umbral_m5_usuario" FOREIGN KEY ("usuario_id_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."configuracion_area_trabajo"
    ADD CONSTRAINT "fk_configuracion_area_catalogo" FOREIGN KEY ("id_area_trabajo") REFERENCES "comun"."area_trabajo"("area_trabajo_id_area") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."configuracion_concepto_remuneracion"
    ADD CONSTRAINT "fk_configuracion_concepto" FOREIGN KEY ("id_concepto") REFERENCES "finanzas"."concepto_remuneracion"("id_concepto_remuneracion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."contacto_cotizacion_b2b"
    ADD CONSTRAINT "fk_contacto_cotizacion_b2b_actor" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."contacto_cotizacion_b2b"
    ADD CONSTRAINT "fk_contacto_cotizacion_b2b_cotizacion" FOREIGN KEY ("id_cotizacion") REFERENCES "finanzas"."cotizacion"("id_cotizacion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."correccion_documental_m11"
    ADD CONSTRAINT "fk_correccion_m11_actor" FOREIGN KEY ("actor_id") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."correccion_documental_m11"
    ADD CONSTRAINT "fk_correccion_m11_documento_corrector" FOREIGN KEY ("id_documento_corrector") REFERENCES "finanzas"."documento_tributario"("id_documento_tributario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."correccion_documental_m11"
    ADD CONSTRAINT "fk_correccion_m11_documento_original" FOREIGN KEY ("id_documento_original") REFERENCES "finanzas"."documento_tributario"("id_documento_tributario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."correccion_documental_m11"
    ADD CONSTRAINT "fk_correccion_m11_guia" FOREIGN KEY ("id_guia_original") REFERENCES "finanzas"."guia_despacho"("id_guia_despacho") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."correccion_documental_m11"
    ADD CONSTRAINT "fk_correccion_m11_guia_correctora" FOREIGN KEY ("id_guia_correctora") REFERENCES "finanzas"."guia_despacho"("id_guia_despacho") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."correccion_documental_m11"
    ADD CONSTRAINT "fk_correccion_m11_oc" FOREIGN KEY ("id_orden_compra_original") REFERENCES "finanzas"."orden_compra_b2b"("id_orden_compra_b2b") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."correspondencia_linea_oc_item_tecnico"
    ADD CONSTRAINT "fk_correspondencia_item_tecnico" FOREIGN KEY ("id_unidad_fisica_ot") REFERENCES "finanzas"."unidad_fisica_orden_trabajo"("id_unidad_fisica_ot") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."correspondencia_linea_oc_item_tecnico"
    ADD CONSTRAINT "fk_correspondencia_linea_oc" FOREIGN KEY ("id_linea_orden_compra_b2b") REFERENCES "finanzas"."linea_orden_compra_b2b"("id_linea_orden_compra_b2b") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."costo_proyecto"
    ADD CONSTRAINT "fk_costo_proyecto_moneda" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."costo_proyecto"
    ADD CONSTRAINT "fk_costo_proyecto_proyecto" FOREIGN KEY ("id_proyecto_financiero") REFERENCES "finanzas"."proyecto_financiero"("id_proyecto_financiero") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."cotizacion"
    ADD CONSTRAINT "fk_cotizacion_condicion_comercial" FOREIGN KEY ("id_condicion_comercial_version") REFERENCES "finanzas"."condicion_comercial_version"("id_condicion_comercial_version") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."cotizacion"
    ADD CONSTRAINT "fk_cotizacion_ficha_cliente" FOREIGN KEY ("id_ficha_cliente") REFERENCES "finanzas"."ficha_cliente"("id_ficha_cliente") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."cotizacion"
    ADD CONSTRAINT "fk_cotizacion_moneda" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."cotizacion"
    ADD CONSTRAINT "fk_cotizacion_obra_contexto" FOREIGN KEY ("id_obra_contexto") REFERENCES "comun"."obra"("obra_obra_id") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."cotizacion"
    ADD CONSTRAINT "fk_cotizacion_responsable_comercial" FOREIGN KEY ("responsable_comercial") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."cotizacion_salud_empleado"
    ADD CONSTRAINT "fk_cotizacion_salud_empleado" FOREIGN KEY ("id_empleado") REFERENCES "finanzas"."empleado"("id_empleado") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."cotizacion"
    ADD CONSTRAINT "fk_cotizacion_tarifa_instalacion_comercial" FOREIGN KEY ("id_tarifa_instalacion_comercial") REFERENCES "finanzas"."tarifa_instalacion_comercial"("id_tarifa_instalacion_comercial") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."cotizacion_version"
    ADD CONSTRAINT "fk_cotizacion_version_actor" FOREIGN KEY ("usuario_id_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."cotizacion_version"
    ADD CONSTRAINT "fk_cotizacion_version_documento" FOREIGN KEY ("id_documento_logico") REFERENCES "finanzas"."documento_logico"("id_documento_logico") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."credito_proyecto"
    ADD CONSTRAINT "fk_credito_proyecto_evaluacion" FOREIGN KEY ("id_evaluacion_credito") REFERENCES "finanzas"."evaluacion_credito"("id_evaluacion_credito") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."credito_proyecto"
    ADD CONSTRAINT "fk_credito_proyecto_ficha_cliente" FOREIGN KEY ("id_ficha_cliente") REFERENCES "finanzas"."ficha_cliente"("id_ficha_cliente") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."credito_proyecto"
    ADD CONSTRAINT "fk_credito_proyecto_fondo" FOREIGN KEY ("id_fondo_global_credito") REFERENCES "finanzas"."fondo_global_credito"("id_fondo_global_credito") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."credito_proyecto"
    ADD CONSTRAINT "fk_credito_proyecto_limite" FOREIGN KEY ("id_limite_credito_cliente") REFERENCES "finanzas"."limite_credito_cliente"("id_limite_credito_cliente") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."credito_proyecto"
    ADD CONSTRAINT "fk_credito_proyecto_proyecto" FOREIGN KEY ("id_proyecto_financiero") REFERENCES "finanzas"."proyecto_financiero"("id_proyecto_financiero") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."cuenta_bancaria_m7"
    ADD CONSTRAINT "fk_cuenta_bancaria_m7_moneda" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."decision_remuneracional_retrabajo"
    ADD CONSTRAINT "fk_decision_retrabajo_incidencia" FOREIGN KEY ("id_incidencia_retrabajo") REFERENCES "terreno"."incidencia_retrabajo_tarea"("id_incidencia_retrabajo") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."decision_remuneracional_retrabajo"
    ADD CONSTRAINT "fk_decision_retrabajo_resolutor" FOREIGN KEY ("id_usuario_resolutor") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."decision_remuneracional_retrabajo"
    ADD CONSTRAINT "fk_decision_retrabajo_tratamiento" FOREIGN KEY ("id_tratamiento_remuneracional") REFERENCES "finanzas"."tratamiento_remuneracional_ejecucion"("id_tratamiento_remuneracional") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_cotizacion"
    ADD CONSTRAINT "fk_det_cot_item_ext" FOREIGN KEY ("id_item_comercial") REFERENCES "terreno"."item_comercial"("id_item_comercial") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_conciliacion"
    ADD CONSTRAINT "fk_detalle_conciliacion_conciliacion" FOREIGN KEY ("id_conciliacion") REFERENCES "finanzas"."conciliacion"("id_conciliacion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_costo_material_cotizacion"
    ADD CONSTRAINT "fk_detalle_costo_material_detalle_cotizacion" FOREIGN KEY ("id_detalle_cotizacion") REFERENCES "finanzas"."detalle_cotizacion"("id_detalle_cotizacion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_costo_material_cotizacion"
    ADD CONSTRAINT "fk_detalle_costo_material_historial_precio" FOREIGN KEY ("id_historial_precio_material") REFERENCES "finanzas"."historial_precio_material"("id_historial_precio_material") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_costo_proyecto_documento_proveedor"
    ADD CONSTRAINT "fk_detalle_costo_proyecto_costo" FOREIGN KEY ("id_costo_proyecto") REFERENCES "finanzas"."costo_proyecto"("id_costo_proyecto") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_costo_proyecto_documento_proveedor"
    ADD CONSTRAINT "fk_detalle_costo_proyecto_documento" FOREIGN KEY ("id_documento_compra_proveedor") REFERENCES "finanzas"."documento_compra_proveedor"("id_documento_compra_proveedor") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_cotizacion"
    ADD CONSTRAINT "fk_detalle_cotizacion_alternativa_aceptada" FOREIGN KEY ("id_alternativa_b2c_aceptada") REFERENCES "finanzas"."alternativa_b2c"("id_alternativa_b2c") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_cotizacion"
    ADD CONSTRAINT "fk_detalle_cotizacion_autorizador_precio" FOREIGN KEY ("precio_excepcional_autorizado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_cotizacion"
    ADD CONSTRAINT "fk_detalle_cotizacion_cotizacion" FOREIGN KEY ("id_cotizacion") REFERENCES "finanzas"."cotizacion"("id_cotizacion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_cotizacion"
    ADD CONSTRAINT "fk_detalle_cotizacion_precio_comercial" FOREIGN KEY ("id_precio_producto_comercial") REFERENCES "finanzas"."precio_producto_comercial"("id_precio_producto_comercial") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_cotizacion"
    ADD CONSTRAINT "fk_detalle_cotizacion_producto_comercial" FOREIGN KEY ("id_extension_producto_comercial") REFERENCES "finanzas"."extension_producto_comercial"("id_extension_producto_comercial") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_cotizacion"
    ADD CONSTRAINT "fk_detalle_cotizacion_producto_version" FOREIGN KEY ("id_producto_comercial_version") REFERENCES "finanzas"."producto_comercial_version"("id_producto_comercial_version") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_documento_compra_proveedor"
    ADD CONSTRAINT "fk_detalle_documento_compra_documento" FOREIGN KEY ("id_documento_compra_proveedor") REFERENCES "finanzas"."documento_compra_proveedor"("id_documento_compra_proveedor") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_documento_compra_proveedor"
    ADD CONSTRAINT "fk_detalle_documento_compra_historial" FOREIGN KEY ("id_historial_precio_material") REFERENCES "finanzas"."historial_precio_material"("id_historial_precio_material") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_evento_auditoria"
    ADD CONSTRAINT "fk_detalle_evento_auditoria_evento" FOREIGN KEY ("id_evento_auditoria") REFERENCES "finanzas"."evento_auditoria"("id_evento_auditoria") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_imputacion_m5"
    ADD CONSTRAINT "fk_detalle_imputacion_m5_clasificacion" FOREIGN KEY ("id_clasificacion_m5") REFERENCES "finanzas"."clasificacion_asociacion_m5"("id_clasificacion_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_imputacion_m5"
    ADD CONSTRAINT "fk_detalle_imputacion_m5_ot" FOREIGN KEY ("id_orden_trabajo") REFERENCES "inventario"."orden_trabajo"("orden_trabajo_id_orden") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_imputacion_m5"
    ADD CONSTRAINT "fk_detalle_imputacion_m5_propuesta" FOREIGN KEY ("id_propuesta_imputacion_m5") REFERENCES "finanzas"."propuesta_imputacion_m5"("id_propuesta_imputacion_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_imputacion_m5"
    ADD CONSTRAINT "fk_detalle_imputacion_m5_proyecto" FOREIGN KEY ("id_proyecto") REFERENCES "comun"."proyecto"("proyecto_proyecto_id") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_liquidacion_remuneracion"
    ADD CONSTRAINT "fk_detalle_liquidacion_concepto" FOREIGN KEY ("id_concepto_remuneracion") REFERENCES "finanzas"."concepto_remuneracion"("id_concepto_remuneracion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_liquidacion_remuneracion"
    ADD CONSTRAINT "fk_detalle_liquidacion_liquidacion" FOREIGN KEY ("id_liquidacion_remuneracion") REFERENCES "finanzas"."liquidacion_remuneracion"("id_liquidacion_remuneracion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_material_orden_compra_m5"
    ADD CONSTRAINT "fk_detalle_material_oc_m5_material" FOREIGN KEY ("material_sku") REFERENCES "inventario"."material"("material_sku") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_material_orden_compra_m5"
    ADD CONSTRAINT "fk_detalle_material_oc_m5_ocs" FOREIGN KEY ("id_ocs_m5") REFERENCES "finanzas"."orden_compra_servicio_m5"("id_orden_compra_servicio_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_presupuesto_m10"
    ADD CONSTRAINT "fk_detalle_presupuesto_m10_version" FOREIGN KEY ("id_version_presupuesto_m10") REFERENCES "finanzas"."version_presupuesto_m10"("id_version_presupuesto_m10") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_servicio_cotizacion"
    ADD CONSTRAINT "fk_detalle_servicio_catalogo" FOREIGN KEY ("id_servicio_comercial") REFERENCES "finanzas"."servicio_comercial"("id_servicio_comercial") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_servicio_cotizacion"
    ADD CONSTRAINT "fk_detalle_servicio_cotizacion" FOREIGN KEY ("id_cotizacion") REFERENCES "finanzas"."cotizacion"("id_cotizacion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."detalle_servicio_cotizacion"
    ADD CONSTRAINT "fk_detalle_servicio_precio" FOREIGN KEY ("id_precio_servicio_comercial") REFERENCES "finanzas"."precio_servicio_comercial"("id_precio_servicio_comercial") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."documento_compra_proveedor"
    ADD CONSTRAINT "fk_documento_compra_proveedor_moneda" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."documento_compra_proveedor"
    ADD CONSTRAINT "fk_documento_compra_proveedor_proveedor" FOREIGN KEY ("id_proveedor") REFERENCES "finanzas"."proveedor"("id_proveedor") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."documento_compra_proveedor"
    ADD CONSTRAINT "fk_documento_compra_proveedor_tipo_documento" FOREIGN KEY ("id_tipo_documento") REFERENCES "finanzas"."tipo_documento"("id_tipo_documento") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."documento_logico"
    ADD CONSTRAINT "fk_documento_logico_conservacion" FOREIGN KEY ("id_configuracion_conservacion") REFERENCES "finanzas"."configuracion_conservacion_documental"("id_configuracion_conservacion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."documento_logico"
    ADD CONSTRAINT "fk_documento_logico_creador" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."documento_proveedor_m5"
    ADD CONSTRAINT "fk_documento_m5_creador" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."documento_proveedor_m5"
    ADD CONSTRAINT "fk_documento_m5_moneda" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."documento_proveedor_m5"
    ADD CONSTRAINT "fk_documento_m5_proveedor" FOREIGN KEY ("id_proveedor") REFERENCES "finanzas"."proveedor"("id_proveedor") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."documento_proveedor_m5"
    ADD CONSTRAINT "fk_documento_m5_tipo" FOREIGN KEY ("id_tipo_documento") REFERENCES "finanzas"."tipo_documento"("id_tipo_documento") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."documento_tributario"
    ADD CONSTRAINT "fk_documento_tributario_ficha_cliente" FOREIGN KEY ("id_ficha_cliente") REFERENCES "finanzas"."ficha_cliente"("id_ficha_cliente") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."documento_tributario"
    ADD CONSTRAINT "fk_documento_tributario_moneda" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."documento_tributario"
    ADD CONSTRAINT "fk_documento_tributario_nota_venta" FOREIGN KEY ("id_nota_venta") REFERENCES "finanzas"."nota_venta"("id_nota_venta") ON DELETE SET NULL DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."documento_tributario"
    ADD CONSTRAINT "fk_documento_tributario_referencia" FOREIGN KEY ("id_documento_referencia") REFERENCES "finanzas"."documento_tributario"("id_documento_tributario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."documento_tributario"
    ADD CONSTRAINT "fk_documento_tributario_tipo_documento" FOREIGN KEY ("id_tipo_documento") REFERENCES "finanzas"."tipo_documento"("id_tipo_documento") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."efecto_financiero_ocs_m5"
    ADD CONSTRAINT "fk_efecto_ocs_m5_ocs" FOREIGN KEY ("id_ocs_m5") REFERENCES "finanzas"."orden_compra_servicio_m5"("id_orden_compra_servicio_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."empleado"
    ADD CONSTRAINT "fk_empleado_afp" FOREIGN KEY ("id_afp") REFERENCES "finanzas"."afp"("id_afp") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."empleado"
    ADD CONSTRAINT "fk_empleado_cargo" FOREIGN KEY ("id_cargo") REFERENCES "finanzas"."cargo"("id_cargo") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."empleado"
    ADD CONSTRAINT "fk_empleado_prevision_salud" FOREIGN KEY ("id_prevision_salud") REFERENCES "finanzas"."prevision_salud"("id_prevision_salud") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."empleado"
    ADD CONSTRAINT "fk_empleado_tipo_vinculo" FOREIGN KEY ("id_tipo_vinculo_laboral") REFERENCES "finanzas"."tipo_vinculo_laboral"("id_tipo_vinculo_laboral") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."estado_tarea_produccion_ot"
    ADD CONSTRAINT "fk_estado_tarea_actualizador" FOREIGN KEY ("actualizado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."estado_tarea_produccion_ot"
    ADD CONSTRAINT "fk_estado_tarea_area" FOREIGN KEY ("id_area_trabajo") REFERENCES "comun"."area_trabajo"("area_trabajo_id_area") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."estado_tarea_produccion_ot"
    ADD CONSTRAINT "fk_estado_tarea_ejecutable" FOREIGN KEY ("id_tarea_ejecutable_ot") REFERENCES "finanzas"."tarea_ejecutable_unidad_ot"("id_tarea_ejecutable_ot") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."estado_tarea_produccion_ot"
    ADD CONSTRAINT "fk_estado_tarea_empleado" FOREIGN KEY ("id_empleado_responsable") REFERENCES "finanzas"."empleado"("id_empleado") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."etapa_adicional_orden_trabajo"
    ADD CONSTRAINT "fk_etapa_adicional_area" FOREIGN KEY ("id_area_trabajo") REFERENCES "comun"."area_trabajo"("area_trabajo_id_area") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."etapa_adicional_orden_trabajo"
    ADD CONSTRAINT "fk_etapa_adicional_creador" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."etapa_adicional_orden_trabajo"
    ADD CONSTRAINT "fk_etapa_adicional_unidad" FOREIGN KEY ("id_unidad_fisica_ot") REFERENCES "finanzas"."unidad_fisica_orden_trabajo"("id_unidad_fisica_ot") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."evaluacion_credito"
    ADD CONSTRAINT "fk_evaluacion_credito_ficha_cliente" FOREIGN KEY ("id_ficha_cliente") REFERENCES "finanzas"."ficha_cliente"("id_ficha_cliente") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."evento_auditoria"
    ADD CONSTRAINT "fk_evento_aud_usuario_ext" FOREIGN KEY ("id_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."evento_credito_m8"
    ADD CONSTRAINT "fk_evento_credito_m8_ficha" FOREIGN KEY ("id_ficha_cliente") REFERENCES "finanzas"."ficha_cliente"("id_ficha_cliente") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."evento_credito_m8"
    ADD CONSTRAINT "fk_evento_credito_m8_responsable" FOREIGN KEY ("id_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."evento_operacional_documental"
    ADD CONSTRAINT "fk_evento_documental_documento" FOREIGN KEY ("id_documento_logico") REFERENCES "finanzas"."documento_logico"("id_documento_logico") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."evento_operacional_documental"
    ADD CONSTRAINT "fk_evento_documental_version" FOREIGN KEY ("id_version_documento") REFERENCES "finanzas"."version_documento"("id_version_documento") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."extension_producto_comercial"
    ADD CONSTRAINT "fk_extension_producto_actualizador" FOREIGN KEY ("actualizado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."extension_producto_comercial"
    ADD CONSTRAINT "fk_extension_producto_creador" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."extension_producto_comercial"
    ADD CONSTRAINT "fk_extension_producto_familia" FOREIGN KEY ("id_familia_producto_comercial") REFERENCES "finanzas"."familia_producto_comercial"("id_familia_producto_comercial") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."extension_producto_comercial"
    ADD CONSTRAINT "fk_extension_producto_item" FOREIGN KEY ("id_item_comercial") REFERENCES "terreno"."item_comercial"("id_item_comercial") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."extension_producto_comercial"
    ADD CONSTRAINT "fk_extension_producto_terminado" FOREIGN KEY ("producto_terminado_id_producto") REFERENCES "inventario"."producto_terminado"("producto_terminado_id_producto") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."familia_producto_comercial"
    ADD CONSTRAINT "fk_familia_producto_comercial_actualizador" FOREIGN KEY ("actualizado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."familia_producto_comercial"
    ADD CONSTRAINT "fk_familia_producto_comercial_creador" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."ficha_cliente"
    ADD CONSTRAINT "fk_ficha_cliente_cliente_financiero" FOREIGN KEY ("id_cliente_financiero") REFERENCES "finanzas"."cliente_financiero"("id_cliente_financiero") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."grupo_alternativas_b2c"
    ADD CONSTRAINT "fk_grupo_alternativa_seleccionada" FOREIGN KEY ("id_alternativa_seleccionada") REFERENCES "finanzas"."alternativa_b2c"("id_alternativa_b2c") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."grupo_alternativas_b2c"
    ADD CONSTRAINT "fk_grupo_alternativa_selector" FOREIGN KEY ("seleccionada_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."grupo_alternativas_b2c"
    ADD CONSTRAINT "fk_grupo_alternativas_b2c_cotizacion" FOREIGN KEY ("id_cotizacion") REFERENCES "finanzas"."cotizacion"("id_cotizacion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."hallazgo_discrepancia_m11"
    ADD CONSTRAINT "fk_hallazgo_m11_actor" FOREIGN KEY ("detectado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."hallazgo_discrepancia_m11"
    ADD CONSTRAINT "fk_hallazgo_m11_linea_oc" FOREIGN KEY ("id_linea_orden_compra_b2b") REFERENCES "finanzas"."linea_orden_compra_b2b"("id_linea_orden_compra_b2b") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."hallazgo_discrepancia_m11"
    ADD CONSTRAINT "fk_hallazgo_m11_oc" FOREIGN KEY ("id_orden_compra_b2b") REFERENCES "finanzas"."orden_compra_b2b"("id_orden_compra_b2b") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_decision_alternativa_b2c"
    ADD CONSTRAINT "fk_historial_alternativa_b2c_actor" FOREIGN KEY ("actor_id") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_decision_alternativa_b2c"
    ADD CONSTRAINT "fk_historial_alternativa_b2c_alternativa" FOREIGN KEY ("id_alternativa_b2c") REFERENCES "finanzas"."alternativa_b2c"("id_alternativa_b2c") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_familia_producto_comercial"
    ADD CONSTRAINT "fk_historial_familia_producto" FOREIGN KEY ("id_familia_producto_comercial") REFERENCES "finanzas"."familia_producto_comercial"("id_familia_producto_comercial") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_familia_producto_comercial"
    ADD CONSTRAINT "fk_historial_familia_usuario" FOREIGN KEY ("usuario_id_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_orden_compra_servicio_m5"
    ADD CONSTRAINT "fk_historial_ocs_m5_ocs" FOREIGN KEY ("id_ocs_m5") REFERENCES "finanzas"."orden_compra_servicio_m5"("id_orden_compra_servicio_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_orden_compra_servicio_m5"
    ADD CONSTRAINT "fk_historial_ocs_m5_usuario" FOREIGN KEY ("usuario_id_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_precio_material"
    ADD CONSTRAINT "fk_historial_precio_material_moneda" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_precio_material"
    ADD CONSTRAINT "fk_historial_precio_material_proveedor" FOREIGN KEY ("id_proveedor") REFERENCES "finanzas"."proveedor"("id_proveedor") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_cambio_produccion_ot"
    ADD CONSTRAINT "fk_historial_produccion_actor" FOREIGN KEY ("usuario_id_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_cambio_produccion_ot"
    ADD CONSTRAINT "fk_historial_produccion_empleado" FOREIGN KEY ("id_empleado_involucrado") REFERENCES "finanzas"."empleado"("id_empleado") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_cambio_produccion_ot"
    ADD CONSTRAINT "fk_historial_produccion_tarea" FOREIGN KEY ("id_tarea_ejecutable_ot") REFERENCES "finanzas"."tarea_ejecutable_unidad_ot"("id_tarea_ejecutable_ot") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_cambio_produccion_ot"
    ADD CONSTRAINT "fk_historial_produccion_unidad" FOREIGN KEY ("id_unidad_fisica_ot") REFERENCES "finanzas"."unidad_fisica_orden_trabajo"("id_unidad_fisica_ot") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_cambio_produccion_ot"
    ADD CONSTRAINT "fk_historial_produccion_version" FOREIGN KEY ("id_version_rectificacion") REFERENCES "finanzas"."version_rectificacion_orden_trabajo"("id_version_rectificacion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_producto_comercial"
    ADD CONSTRAINT "fk_historial_producto_comercial" FOREIGN KEY ("id_extension_producto_comercial") REFERENCES "finanzas"."extension_producto_comercial"("id_extension_producto_comercial") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_producto_comercial"
    ADD CONSTRAINT "fk_historial_producto_usuario" FOREIGN KEY ("usuario_id_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_proveedor_m5"
    ADD CONSTRAINT "fk_historial_proveedor_m5_proveedor" FOREIGN KEY ("id_proveedor") REFERENCES "finanzas"."proveedor"("id_proveedor") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_proveedor_m5"
    ADD CONSTRAINT "fk_historial_proveedor_m5_usuario" FOREIGN KEY ("usuario_id_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_seleccion_alternativa_b2c"
    ADD CONSTRAINT "fk_historial_seleccion_actor" FOREIGN KEY ("actor_id") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_seleccion_alternativa_b2c"
    ADD CONSTRAINT "fk_historial_seleccion_anterior" FOREIGN KEY ("id_alternativa_anterior") REFERENCES "finanzas"."alternativa_b2c"("id_alternativa_b2c") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_seleccion_alternativa_b2c"
    ADD CONSTRAINT "fk_historial_seleccion_grupo" FOREIGN KEY ("id_grupo_alternativas_b2c") REFERENCES "finanzas"."grupo_alternativas_b2c"("id_grupo_alternativas_b2c") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_seleccion_alternativa_b2c"
    ADD CONSTRAINT "fk_historial_seleccion_nueva" FOREIGN KEY ("id_alternativa_nueva") REFERENCES "finanzas"."alternativa_b2c"("id_alternativa_b2c") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_tarifa_tarea"
    ADD CONSTRAINT "fk_historial_tarifa_tarea_tarea" FOREIGN KEY ("id_tarea_catalogada") REFERENCES "finanzas"."tarea_catalogada"("id_tarea_catalogada") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."hito_cobro"
    ADD CONSTRAINT "fk_hito_cobro_nota_venta" FOREIGN KEY ("id_nota_venta") REFERENCES "finanzas"."nota_venta"("id_nota_venta") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."hito_cobro"
    ADD CONSTRAINT "fk_hito_cobro_proyecto_financiero" FOREIGN KEY ("id_proyecto_financiero") REFERENCES "finanzas"."proyecto_financiero"("id_proyecto_financiero") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_precio_material"
    ADD CONSTRAINT "fk_hpm_material_ext" FOREIGN KEY ("material_sku") REFERENCES "inventario"."material"("material_sku") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."idempotencia_operacion_comercial"
    ADD CONSTRAINT "fk_idempotencia_operacion_actor" FOREIGN KEY ("actor_id") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."propuesta_imputacion_m5"
    ADD CONSTRAINT "fk_imputacion_m5_documento" FOREIGN KEY ("id_documento_m5") REFERENCES "finanzas"."documento_proveedor_m5"("id_documento_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."intencion_carga_documental"
    ADD CONSTRAINT "fk_intencion_documental_documento" FOREIGN KEY ("id_documento_logico") REFERENCES "finanzas"."documento_logico"("id_documento_logico") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."intencion_carga_documental"
    ADD CONSTRAINT "fk_intencion_documental_solicitante" FOREIGN KEY ("usuario_solicitante") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."limite_credito_cliente"
    ADD CONSTRAINT "fk_limite_credito_cliente_evaluacion" FOREIGN KEY ("id_evaluacion_credito") REFERENCES "finanzas"."evaluacion_credito"("id_evaluacion_credito") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."limite_credito_cliente"
    ADD CONSTRAINT "fk_limite_credito_cliente_ficha" FOREIGN KEY ("id_ficha_cliente") REFERENCES "finanzas"."ficha_cliente"("id_ficha_cliente") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."linea_orden_compra_b2b"
    ADD CONSTRAINT "fk_linea_oc_detalle_cotizacion" FOREIGN KEY ("id_detalle_cotizacion") REFERENCES "finanzas"."detalle_cotizacion"("id_detalle_cotizacion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."linea_orden_compra_b2b"
    ADD CONSTRAINT "fk_linea_oc_moneda" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."linea_orden_compra_b2b"
    ADD CONSTRAINT "fk_linea_oc_orden_compra" FOREIGN KEY ("id_orden_compra_b2b") REFERENCES "finanzas"."orden_compra_b2b"("id_orden_compra_b2b") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."liquidacion_remuneracion"
    ADD CONSTRAINT "fk_liquidacion_remuneracion_empleado" FOREIGN KEY ("rut_empleado") REFERENCES "finanzas"."empleado"("rut_empleado") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."evento_auditoria_m9"
    ADD CONSTRAINT "fk_m9_evento_correctivo" FOREIGN KEY ("id_evento_correctivo") REFERENCES "finanzas"."evento_auditoria_m9"("id_evento_m9") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."evento_auditoria_m9"
    ADD CONSTRAINT "fk_m9_evento_origen" FOREIGN KEY ("id_evento_origen") REFERENCES "finanzas"."evento_auditoria_m9"("id_evento_m9") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."movimiento_bancario"
    ADD CONSTRAINT "fk_movimiento_bancario_cuenta_m7" FOREIGN KEY ("id_cuenta_bancaria_m7") REFERENCES "finanzas"."cuenta_bancaria_m7"("id_cuenta_bancaria_m7") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."movimiento_bancario"
    ADD CONSTRAINT "fk_movimiento_bancario_moneda" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."movimiento_financiero"
    ADD CONSTRAINT "fk_movimiento_financiero_moneda" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."nota_venta"
    ADD CONSTRAINT "fk_nota_venta_cotizacion" FOREIGN KEY ("id_cotizacion") REFERENCES "finanzas"."cotizacion"("id_cotizacion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."nota_venta"
    ADD CONSTRAINT "fk_nota_venta_ficha_cliente" FOREIGN KEY ("id_ficha_cliente") REFERENCES "finanzas"."ficha_cliente"("id_ficha_cliente") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."nota_venta"
    ADD CONSTRAINT "fk_nota_venta_moneda" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."obligacion_proveedor_m5"
    ADD CONSTRAINT "fk_obligacion_m5_documento" FOREIGN KEY ("id_documento_m5") REFERENCES "finanzas"."documento_proveedor_m5"("id_documento_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."obligacion_proveedor_m5"
    ADD CONSTRAINT "fk_obligacion_m5_moneda" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."obligacion_proveedor_m5"
    ADD CONSTRAINT "fk_obligacion_m5_proveedor" FOREIGN KEY ("id_proveedor") REFERENCES "finanzas"."proveedor"("id_proveedor") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."orden_compra_servicio_m5"
    ADD CONSTRAINT "fk_ocs_m5_cotizacion_contexto" FOREIGN KEY ("id_cotizacion_contexto") REFERENCES "finanzas"."cotizacion"("id_cotizacion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."orden_compra_servicio_m5"
    ADD CONSTRAINT "fk_ocs_m5_creador" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."orden_compra_servicio_m5"
    ADD CONSTRAINT "fk_ocs_m5_ficha_contexto" FOREIGN KEY ("id_ficha_cliente_contexto") REFERENCES "finanzas"."ficha_cliente"("id_ficha_cliente") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."orden_compra_servicio_m5"
    ADD CONSTRAINT "fk_ocs_m5_moneda" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."orden_compra_servicio_m5"
    ADD CONSTRAINT "fk_ocs_m5_ot_contexto" FOREIGN KEY ("id_orden_trabajo_contexto") REFERENCES "inventario"."orden_trabajo"("orden_trabajo_id_orden") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."orden_compra_servicio_m5"
    ADD CONSTRAINT "fk_ocs_m5_proveedor" FOREIGN KEY ("id_proveedor") REFERENCES "finanzas"."proveedor"("id_proveedor") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."orden_compra_servicio_m5"
    ADD CONSTRAINT "fk_ocs_m5_proyecto_contexto" FOREIGN KEY ("id_proyecto_financiero_contexto") REFERENCES "finanzas"."proyecto_financiero"("id_proyecto_financiero") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."opcional_comercial"
    ADD CONSTRAINT "fk_opcional_comercial_creador" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."orden_compra_b2b"
    ADD CONSTRAINT "fk_orden_compra_oferta_aceptada" FOREIGN KEY ("id_version_oferta_aceptada") REFERENCES "finanzas"."cotizacion_version"("id_cotizacion_version") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."origen_alerta_financiera"
    ADD CONSTRAINT "fk_origen_alerta_financiera_alerta" FOREIGN KEY ("id_alerta_financiera") REFERENCES "finanzas"."alerta_financiera"("id_alerta_financiera") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."origen_movimiento_financiero"
    ADD CONSTRAINT "fk_origen_movimiento_financiero_movimiento" FOREIGN KEY ("id_movimiento_financiero") REFERENCES "finanzas"."movimiento_financiero"("id_movimiento_financiero") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."pago_cliente"
    ADD CONSTRAINT "fk_pago_cliente_ficha_cliente" FOREIGN KEY ("id_ficha_cliente") REFERENCES "finanzas"."ficha_cliente"("id_ficha_cliente") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."pago_cliente"
    ADD CONSTRAINT "fk_pago_cliente_medio_pago" FOREIGN KEY ("id_medio_pago") REFERENCES "finanzas"."medio_pago"("id_medio_pago") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."pago_cliente"
    ADD CONSTRAINT "fk_pago_cliente_moneda" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."pago_proveedor"
    ADD CONSTRAINT "fk_pago_proveedor_medio_pago" FOREIGN KEY ("id_medio_pago") REFERENCES "finanzas"."medio_pago"("id_medio_pago") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."pago_proveedor"
    ADD CONSTRAINT "fk_pago_proveedor_moneda" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."pago_proveedor"
    ADD CONSTRAINT "fk_pago_proveedor_proveedor" FOREIGN KEY ("id_proveedor") REFERENCES "finanzas"."proveedor"("id_proveedor") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."pago_remuneracion"
    ADD CONSTRAINT "fk_pago_remuneracion_anulador" FOREIGN KEY ("anulado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."pago_remuneracion"
    ADD CONSTRAINT "fk_pago_remuneracion_confirmador" FOREIGN KEY ("confirmado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."pago_remuneracion"
    ADD CONSTRAINT "fk_pago_remuneracion_creador" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."pago_remuneracion"
    ADD CONSTRAINT "fk_pago_remuneracion_medio" FOREIGN KEY ("id_medio_pago") REFERENCES "finanzas"."medio_pago"("id_medio_pago") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."periodo_remuneracion"
    ADD CONSTRAINT "fk_periodo_remuneracion_cerrador" FOREIGN KEY ("cerrado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."plantilla_documental_version"
    ADD CONSTRAINT "fk_plantilla_documental_condicion" FOREIGN KEY ("id_condicion_comercial_version") REFERENCES "finanzas"."condicion_comercial_version"("id_condicion_comercial_version") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."plantilla_documental_comercial"
    ADD CONSTRAINT "fk_plantilla_documental_creador" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."plantilla_documental_version"
    ADD CONSTRAINT "fk_plantilla_documental_publicador" FOREIGN KEY ("publicado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."plantilla_documental_version"
    ADD CONSTRAINT "fk_plantilla_documental_version_raiz" FOREIGN KEY ("id_plantilla_documental") REFERENCES "finanzas"."plantilla_documental_comercial"("id_plantilla_documental") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."precio_opcional_comercial"
    ADD CONSTRAINT "fk_precio_opcional_catalogo" FOREIGN KEY ("id_opcional_comercial") REFERENCES "finanzas"."opcional_comercial"("id_opcional_comercial") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."precio_opcional_comercial"
    ADD CONSTRAINT "fk_precio_opcional_creador" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."precio_opcional_comercial"
    ADD CONSTRAINT "fk_precio_opcional_moneda" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."precio_producto_comercial"
    ADD CONSTRAINT "fk_precio_producto_comercial_creador" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."precio_producto_comercial"
    ADD CONSTRAINT "fk_precio_producto_comercial_moneda" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."precio_producto_comercial"
    ADD CONSTRAINT "fk_precio_producto_comercial_producto" FOREIGN KEY ("id_extension_producto_comercial") REFERENCES "finanzas"."extension_producto_comercial"("id_extension_producto_comercial") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."precio_servicio_comercial"
    ADD CONSTRAINT "fk_precio_servicio_comercial_actor" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."precio_servicio_comercial"
    ADD CONSTRAINT "fk_precio_servicio_comercial_moneda" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."precio_servicio_comercial"
    ADD CONSTRAINT "fk_precio_servicio_comercial_servicio" FOREIGN KEY ("id_servicio_comercial") REFERENCES "finanzas"."servicio_comercial"("id_servicio_comercial") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."presupuesto_manual_m10"
    ADD CONSTRAINT "fk_presupuesto_m10_creador" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."presupuesto_manual_m10"
    ADD CONSTRAINT "fk_presupuesto_m10_moneda" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."producto_comercial_version"
    ADD CONSTRAINT "fk_producto_comercial_version_familia" FOREIGN KEY ("id_familia_producto_comercial") REFERENCES "finanzas"."familia_producto_comercial"("id_familia_producto_comercial") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."producto_comercial_version"
    ADD CONSTRAINT "fk_producto_comercial_version_producto" FOREIGN KEY ("id_extension_producto_comercial") REFERENCES "finanzas"."extension_producto_comercial"("id_extension_producto_comercial") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."producto_comercial_version"
    ADD CONSTRAINT "fk_producto_comercial_version_usuario" FOREIGN KEY ("usuario_id_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."producto_comercial_documento"
    ADD CONSTRAINT "fk_producto_documento_documento" FOREIGN KEY ("id_documento_logico") REFERENCES "finanzas"."documento_logico"("id_documento_logico") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."producto_comercial_documento"
    ADD CONSTRAINT "fk_producto_documento_producto" FOREIGN KEY ("id_extension_producto_comercial") REFERENCES "finanzas"."extension_producto_comercial"("id_extension_producto_comercial") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."producto_comercial_documento"
    ADD CONSTRAINT "fk_producto_documento_responsable" FOREIGN KEY ("usuario_responsable") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."proveedor"
    ADD CONSTRAINT "fk_proveedor_moneda_preferente" FOREIGN KEY ("id_moneda_preferente") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."proveedor"
    ADD CONSTRAINT "fk_proveedor_pais" FOREIGN KEY ("id_pais") REFERENCES "finanzas"."pais"("id_pais") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."proveedor"
    ADD CONSTRAINT "fk_proveedor_tipo_identificador" FOREIGN KEY ("id_tipo_identificador") REFERENCES "finanzas"."tipo_identificador"("id_tipo_identificador") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."proyecto_financiero"
    ADD CONSTRAINT "fk_proy_fin_terreno_ext" FOREIGN KEY ("id_proyecto_terreno") REFERENCES "comun"."proyecto"("proyecto_proyecto_id") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."proyeccion_financiera_m7"
    ADD CONSTRAINT "fk_proyeccion_m7_moneda" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."proyecto_financiero"
    ADD CONSTRAINT "fk_proyecto_financiero_ficha_cliente" FOREIGN KEY ("id_ficha_cliente") REFERENCES "finanzas"."ficha_cliente"("id_ficha_cliente") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."proyecto_financiero"
    ADD CONSTRAINT "fk_proyecto_financiero_moneda" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."proyecto_financiero"
    ADD CONSTRAINT "fk_proyecto_financiero_nota_venta" FOREIGN KEY ("id_nota_venta") REFERENCES "finanzas"."nota_venta"("id_nota_venta") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."reduccion_compromiso_credito_m8"
    ADD CONSTRAINT "fk_reduccion_credito_m8_compromiso" FOREIGN KEY ("id_compromiso") REFERENCES "finanzas"."compromiso_credito_m8"("id_compromiso") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."reduccion_compromiso_credito_m8"
    ADD CONSTRAINT "fk_reduccion_credito_m8_pago" FOREIGN KEY ("id_pago_cliente") REFERENCES "finanzas"."pago_cliente"("id_pago_cliente") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."regularizacion_extraordinaria"
    ADD CONSTRAINT "fk_regularizacion_actualizador" FOREIGN KEY ("actualizado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."regularizacion_extraordinaria"
    ADD CONSTRAINT "fk_regularizacion_ajuste" FOREIGN KEY ("id_ajuste_posterior") REFERENCES "finanzas"."ajuste_posterior_remuneracion"("id_ajuste_posterior") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."regularizacion_extraordinaria"
    ADD CONSTRAINT "fk_regularizacion_cerrador" FOREIGN KEY ("cerrado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."regularizacion_extraordinaria"
    ADD CONSTRAINT "fk_regularizacion_creador" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."relacion_laboral_empleado"
    ADD CONSTRAINT "fk_relacion_laboral_empleado" FOREIGN KEY ("id_empleado") REFERENCES "finanzas"."empleado"("id_empleado") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."relacion_laboral_empleado"
    ADD CONSTRAINT "fk_relacion_laboral_tipo_vinculo" FOREIGN KEY ("id_tipo_vinculo_laboral") REFERENCES "finanzas"."tipo_vinculo_laboral"("id_tipo_vinculo_laboral") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."remuneracion"
    ADD CONSTRAINT "fk_remuneracion_calculador" FOREIGN KEY ("calculado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."remuneracion"
    ADD CONSTRAINT "fk_remuneracion_cerrador" FOREIGN KEY ("cerrado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."remuneracion"
    ADD CONSTRAINT "fk_remuneracion_creador" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."remuneracion"
    ADD CONSTRAINT "fk_remuneracion_empleado" FOREIGN KEY ("id_empleado") REFERENCES "finanzas"."empleado"("id_empleado") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."remuneracion"
    ADD CONSTRAINT "fk_remuneracion_periodo" FOREIGN KEY ("id_periodo_remuneracion") REFERENCES "finanzas"."periodo_remuneracion"("id_periodo_remuneracion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."remuneracion"
    ADD CONSTRAINT "fk_remuneracion_reapertura_aprobador" FOREIGN KEY ("reapertura_aprobada_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."remuneracion"
    ADD CONSTRAINT "fk_remuneracion_reapertura_solicitante" FOREIGN KEY ("reapertura_solicitada_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."remuneracion"
    ADD CONSTRAINT "fk_remuneracion_reemplaza_a" FOREIGN KEY ("reemplaza_a_id", "id_periodo_remuneracion", "id_empleado") REFERENCES "finanzas"."remuneracion"("id_remuneracion", "id_periodo_remuneracion", "id_empleado") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."resolucion_solicitud_crediticia_m8"
    ADD CONSTRAINT "fk_resolucion_crediticia_m8_responsable" FOREIGN KEY ("id_usuario_responsable") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."resolucion_solicitud_crediticia_m8"
    ADD CONSTRAINT "fk_resolucion_crediticia_m8_solicitud" FOREIGN KEY ("id_solicitud_crediticia") REFERENCES "finanzas"."solicitud_crediticia_m8"("id_solicitud_crediticia") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."resolucion_hallazgo_m11"
    ADD CONSTRAINT "fk_resolucion_m11_actor" FOREIGN KEY ("actor_id") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."resolucion_hallazgo_m11"
    ADD CONSTRAINT "fk_resolucion_m11_hallazgo" FOREIGN KEY ("id_hallazgo") REFERENCES "finanzas"."hallazgo_discrepancia_m11"("id_hallazgo_discrepancia_m11") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."reversion_pago_remuneracion"
    ADD CONSTRAINT "fk_reversion_pago_remuneracion_pago" FOREIGN KEY ("id_pago_remuneracion") REFERENCES "finanzas"."pago_remuneracion"("id_pago_remuneracion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."reversion_pago_remuneracion"
    ADD CONSTRAINT "fk_reversion_pago_remuneracion_usuario" FOREIGN KEY ("registrado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."saldo_inicial_bancario_m7"
    ADD CONSTRAINT "fk_saldo_inicial_bancario_m7_cuenta" FOREIGN KEY ("id_cuenta_bancaria_m7") REFERENCES "finanzas"."cuenta_bancaria_m7"("id_cuenta_bancaria_m7") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."servicio_comercial"
    ADD CONSTRAINT "fk_servicio_comercial_actor" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."solicitud_correccion_tecnica_ot"
    ADD CONSTRAINT "fk_solicitud_correccion_actor" FOREIGN KEY ("solicitado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."solicitud_correccion_tecnica_ot"
    ADD CONSTRAINT "fk_solicitud_correccion_unidad" FOREIGN KEY ("id_unidad_fisica_ot") REFERENCES "finanzas"."unidad_fisica_orden_trabajo"("id_unidad_fisica_ot") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."solicitud_correccion_tecnica_ot"
    ADD CONSTRAINT "fk_solicitud_correccion_version" FOREIGN KEY ("id_version_base") REFERENCES "finanzas"."version_rectificacion_orden_trabajo"("id_version_rectificacion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."solicitud_crediticia_m8"
    ADD CONSTRAINT "fk_solicitud_crediticia_m8_cotizacion" FOREIGN KEY ("id_cotizacion") REFERENCES "finanzas"."cotizacion"("id_cotizacion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."solicitud_crediticia_m8"
    ADD CONSTRAINT "fk_solicitud_crediticia_m8_ficha" FOREIGN KEY ("id_ficha_cliente") REFERENCES "finanzas"."ficha_cliente"("id_ficha_cliente") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."solicitud_crediticia_m8"
    ADD CONSTRAINT "fk_solicitud_crediticia_m8_nota_venta" FOREIGN KEY ("id_nota_venta") REFERENCES "finanzas"."nota_venta"("id_nota_venta") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."solicitud_crediticia_m8"
    ADD CONSTRAINT "fk_solicitud_crediticia_m8_solicitante" FOREIGN KEY ("id_usuario_solicitante") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."tarea_ejecutable_unidad_ot"
    ADD CONSTRAINT "fk_tarea_ejecutable_etapa_adicional" FOREIGN KEY ("id_etapa_adicional_ot") REFERENCES "finanzas"."etapa_adicional_orden_trabajo"("id_etapa_adicional_ot") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."tarea_ejecutable_unidad_ot"
    ADD CONSTRAINT "fk_tarea_ejecutable_origen_correctiva" FOREIGN KEY ("id_tarea_origen_correctiva") REFERENCES "finanzas"."tarea_ejecutable_unidad_ot"("id_tarea_ejecutable_ot") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."tarea_remunerable"
    ADD CONSTRAINT "fk_tarea_rem_orden_ext" FOREIGN KEY ("id_orden_trabajo") REFERENCES "inventario"."orden_trabajo"("orden_trabajo_id_orden") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."tarea_remunerable"
    ADD CONSTRAINT "fk_tarea_remunerable_empleado" FOREIGN KEY ("rut_empleado") REFERENCES "finanzas"."empleado"("rut_empleado") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."tarea_remunerable"
    ADD CONSTRAINT "fk_tarea_remunerable_liquidacion" FOREIGN KEY ("id_liquidacion_remuneracion") REFERENCES "finanzas"."liquidacion_remuneracion"("id_liquidacion_remuneracion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."tarea_remunerable"
    ADD CONSTRAINT "fk_tarea_remunerable_proyecto" FOREIGN KEY ("id_proyecto_financiero") REFERENCES "finanzas"."proyecto_financiero"("id_proyecto_financiero") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."tarea_remunerable"
    ADD CONSTRAINT "fk_tarea_remunerable_tarifa" FOREIGN KEY ("id_historial_tarifa_tarea") REFERENCES "finanzas"."historial_tarifa_tarea"("id_historial_tarifa_tarea") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."tarifa_esquema_remuneracional"
    ADD CONSTRAINT "fk_tarifa_esquema" FOREIGN KEY ("id_esquema") REFERENCES "finanzas"."esquema_remuneracional"("id_esquema_remuneracional") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."tarifa_instalacion_comercial"
    ADD CONSTRAINT "fk_tarifa_instalacion_creador" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."tarifa_instalacion_comercial"
    ADD CONSTRAINT "fk_tarifa_instalacion_moneda" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."tratamiento_remuneracional_ejecucion"
    ADD CONSTRAINT "fk_tratamiento_ejecucion" FOREIGN KEY ("id_ejecucion_tarea") REFERENCES "terreno"."ejecucion_tarea"("id_ejecucion_tarea") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."tratamiento_remuneracional_ejecucion"
    ADD CONSTRAINT "fk_tratamiento_empleado" FOREIGN KEY ("id_empleado") REFERENCES "finanzas"."empleado"("id_empleado") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."tratamiento_remuneracional_ejecucion"
    ADD CONSTRAINT "fk_tratamiento_esquema" FOREIGN KEY ("id_esquema") REFERENCES "finanzas"."esquema_remuneracional"("id_esquema_remuneracional") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."tratamiento_remuneracional_ejecucion"
    ADD CONSTRAINT "fk_tratamiento_tarifa" FOREIGN KEY ("id_tarifa") REFERENCES "finanzas"."tarifa_esquema_remuneracional"("id_tarifa_esquema") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."variante_documento"
    ADD CONSTRAINT "fk_variante_documento_derivada" FOREIGN KEY ("id_version_derivada") REFERENCES "finanzas"."version_documento"("id_version_documento") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."variante_documento"
    ADD CONSTRAINT "fk_variante_documento_original" FOREIGN KEY ("id_version_original") REFERENCES "finanzas"."version_documento"("id_version_documento") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."version_documento"
    ADD CONSTRAINT "fk_version_documento_creador" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."version_documento"
    ADD CONSTRAINT "fk_version_documento_logico" FOREIGN KEY ("id_documento_logico") REFERENCES "finanzas"."documento_logico"("id_documento_logico") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."version_documento"
    ADD CONSTRAINT "fk_version_documento_reemplazada" FOREIGN KEY ("id_version_reemplazada") REFERENCES "finanzas"."version_documento"("id_version_documento") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."version_presupuesto_m10"
    ADD CONSTRAINT "fk_version_presupuesto_m10_creador" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."version_presupuesto_m10"
    ADD CONSTRAINT "fk_version_presupuesto_m10_presupuesto" FOREIGN KEY ("id_presupuesto_manual_m10") REFERENCES "finanzas"."presupuesto_manual_m10"("id_presupuesto_manual_m10") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."guia_despacho"
    ADD CONSTRAINT "guia_despacho_id_nota_venta_fkey" FOREIGN KEY ("id_nota_venta") REFERENCES "finanzas"."nota_venta"("id_nota_venta") ON UPDATE RESTRICT ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_categoria_egreso_m5"
    ADD CONSTRAINT "historial_categoria_egreso_m5_id_categoria_egreso_m5_fkey" FOREIGN KEY ("id_categoria_egreso_m5") REFERENCES "finanzas"."categoria_egreso_m5"("id_categoria_egreso_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_categoria_egreso_m5"
    ADD CONSTRAINT "historial_categoria_egreso_m5_usuario_id_usuario_fkey" FOREIGN KEY ("usuario_id_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_envio_importacion_m5"
    ADD CONSTRAINT "historial_envio_importacion_m5_id_envio_importacion_m5_fkey" FOREIGN KEY ("id_envio_importacion_m5") REFERENCES "finanzas"."envio_importacion_m5"("id_envio_importacion_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_envio_importacion_m5"
    ADD CONSTRAINT "historial_envio_importacion_m5_usuario_id_usuario_fkey" FOREIGN KEY ("usuario_id_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_fondo_caja_chica_m5"
    ADD CONSTRAINT "historial_fondo_caja_chica_m5_id_fondo_caja_chica_m5_fkey" FOREIGN KEY ("id_fondo_caja_chica_m5") REFERENCES "finanzas"."fondo_caja_chica_m5"("id_fondo_caja_chica_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_gasto_caja_chica_m5"
    ADD CONSTRAINT "historial_gasto_caja_chica_m5_id_gasto_caja_chica_m5_fkey" FOREIGN KEY ("id_gasto_caja_chica_m5") REFERENCES "finanzas"."gasto_caja_chica_m5"("id_gasto_caja_chica_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_ot_imputacion_m5"
    ADD CONSTRAINT "historial_ot_imputacion_m5_id_detalle_imputacion_m5_fkey" FOREIGN KEY ("id_detalle_imputacion_m5") REFERENCES "finanzas"."detalle_imputacion_m5"("id_detalle_imputacion_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_ot_imputacion_m5"
    ADD CONSTRAINT "historial_ot_imputacion_m5_id_ot_anterior_fkey" FOREIGN KEY ("id_ot_anterior") REFERENCES "inventario"."orden_trabajo"("orden_trabajo_id_orden") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_ot_imputacion_m5"
    ADD CONSTRAINT "historial_ot_imputacion_m5_id_ot_nueva_fkey" FOREIGN KEY ("id_ot_nueva") REFERENCES "inventario"."orden_trabajo"("orden_trabajo_id_orden") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_ot_imputacion_m5"
    ADD CONSTRAINT "historial_ot_imputacion_m5_id_proyecto_fkey" FOREIGN KEY ("id_proyecto") REFERENCES "comun"."proyecto"("proyecto_proyecto_id") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_ot_imputacion_m5"
    ADD CONSTRAINT "historial_ot_imputacion_m5_usuario_id_usuario_fkey" FOREIGN KEY ("usuario_id_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_rectificacion_orden_trabajo"
    ADD CONSTRAINT "historial_rectificacion_rectificacion_fk" FOREIGN KEY ("id_rectificacion_ot") REFERENCES "finanzas"."rectificacion_orden_trabajo"("id_rectificacion_ot") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_rectificacion_orden_trabajo"
    ADD CONSTRAINT "historial_rectificacion_usuario_fk" FOREIGN KEY ("usuario_id_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_respaldo_pago_m5"
    ADD CONSTRAINT "historial_respaldo_pago_m5_id_movimiento_pago_m5_fkey" FOREIGN KEY ("id_movimiento_pago_m5") REFERENCES "finanzas"."movimiento_pago_proveedor_m5"("id_movimiento_pago_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_respaldo_pago_m5"
    ADD CONSTRAINT "historial_respaldo_pago_m5_id_operacion_pago_m5_fkey" FOREIGN KEY ("id_operacion_pago_m5") REFERENCES "finanzas"."operacion_pago_proveedor_m5"("id_operacion_pago_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_respaldo_pago_m5"
    ADD CONSTRAINT "historial_respaldo_pago_m5_id_respaldo_anterior_fkey" FOREIGN KEY ("id_respaldo_anterior") REFERENCES "finanzas"."respaldo_pago_proveedor_m5"("id_respaldo_pago_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_respaldo_pago_m5"
    ADD CONSTRAINT "historial_respaldo_pago_m5_id_respaldo_nuevo_fkey" FOREIGN KEY ("id_respaldo_nuevo") REFERENCES "finanzas"."respaldo_pago_proveedor_m5"("id_respaldo_pago_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_respaldo_pago_m5"
    ADD CONSTRAINT "historial_respaldo_pago_m5_usuario_id_usuario_fkey" FOREIGN KEY ("usuario_id_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_umbral_reclasificacion_m5"
    ADD CONSTRAINT "historial_umbral_reclasificacion_m5_usuario_id_usuario_fkey" FOREIGN KEY ("usuario_id_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_unidad_fisica_ot"
    ADD CONSTRAINT "historial_unidad_fisica_ot_unidad_fk" FOREIGN KEY ("id_unidad_fisica_ot") REFERENCES "finanzas"."unidad_fisica_orden_trabajo"("id_unidad_fisica_ot") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."historial_unidad_fisica_ot"
    ADD CONSTRAINT "historial_unidad_fisica_ot_usuario_fk" FOREIGN KEY ("usuario_id_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."intento_retry_m9"
    ADD CONSTRAINT "intento_retry_m9_id_pendiente_m9_fkey" FOREIGN KEY ("id_pendiente_m9") REFERENCES "finanzas"."pendiente_evento_m9"("id_pendiente_m9") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."liberacion_orden_trabajo"
    ADD CONSTRAINT "liberacion_ot_actor_fk" FOREIGN KEY ("liberado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."liberacion_orden_trabajo"
    ADD CONSTRAINT "liberacion_ot_unidad_fk" FOREIGN KEY ("id_unidad_fisica_ot") REFERENCES "finanzas"."unidad_fisica_orden_trabajo"("id_unidad_fisica_ot") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."liberacion_orden_trabajo"
    ADD CONSTRAINT "liberacion_ot_version_fk" FOREIGN KEY ("id_version_rectificacion") REFERENCES "finanzas"."version_rectificacion_orden_trabajo"("id_version_rectificacion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."movimiento_pago_proveedor_m5"
    ADD CONSTRAINT "movimiento_pago_proveedor_m5_id_medio_pago_fkey" FOREIGN KEY ("id_medio_pago") REFERENCES "finanzas"."medio_pago"("id_medio_pago") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."movimiento_pago_proveedor_m5"
    ADD CONSTRAINT "movimiento_pago_proveedor_m5_id_moneda_fkey" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."movimiento_pago_proveedor_m5"
    ADD CONSTRAINT "movimiento_pago_proveedor_m5_id_obligacion_m5_fkey" FOREIGN KEY ("id_obligacion_m5") REFERENCES "finanzas"."obligacion_proveedor_m5"("id_obligacion_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."movimiento_pago_proveedor_m5"
    ADD CONSTRAINT "movimiento_pago_proveedor_m5_id_operacion_pago_m5_fkey" FOREIGN KEY ("id_operacion_pago_m5") REFERENCES "finanzas"."operacion_pago_proveedor_m5"("id_operacion_pago_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."movimiento_pago_proveedor_m5"
    ADD CONSTRAINT "movimiento_pago_proveedor_m5_tasa_manual_usuario_fkey" FOREIGN KEY ("tasa_manual_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."nota_venta"
    ADD CONSTRAINT "nota_venta_id_proyecto_contexto_fkey" FOREIGN KEY ("id_proyecto_contexto") REFERENCES "comun"."proyecto"("proyecto_proyecto_id") ON UPDATE RESTRICT ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."operacion_pago_proveedor_m5"
    ADD CONSTRAINT "operacion_pago_proveedor_m5_confirmado_por_fkey" FOREIGN KEY ("confirmado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."operacion_pago_proveedor_m5"
    ADD CONSTRAINT "operacion_pago_proveedor_m5_creado_por_fkey" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."operacion_pago_proveedor_m5"
    ADD CONSTRAINT "operacion_pago_proveedor_m5_descartado_por_fkey" FOREIGN KEY ("descartado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."operacion_pago_proveedor_m5"
    ADD CONSTRAINT "operacion_pago_proveedor_m5_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "finanzas"."proveedor"("id_proveedor") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."operacion_pago_proveedor_m5"
    ADD CONSTRAINT "operacion_pago_proveedor_m5_preparado_por_fkey" FOREIGN KEY ("preparado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."orden_compra_b2b"
    ADD CONSTRAINT "orden_compra_b2b_id_cotizacion_fkey" FOREIGN KEY ("id_cotizacion") REFERENCES "finanzas"."cotizacion"("id_cotizacion") ON UPDATE RESTRICT ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."pago_cliente"
    ADD CONSTRAINT "pago_cliente_id_categoria_pago_fkey" FOREIGN KEY ("id_categoria_pago") REFERENCES "finanzas"."categoria_pago"("id_categoria_pago") ON UPDATE RESTRICT ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."plantilla_fabricacion_familia"
    ADD CONSTRAINT "plantilla_fabricacion_actualizador_fk" FOREIGN KEY ("actualizado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."plantilla_fabricacion_familia"
    ADD CONSTRAINT "plantilla_fabricacion_creador_fk" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."plantilla_fabricacion_familia"
    ADD CONSTRAINT "plantilla_fabricacion_familia_fk" FOREIGN KEY ("id_familia_producto_comercial") REFERENCES "finanzas"."familia_producto_comercial"("id_familia_producto_comercial") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."politica_tratamiento_m9"
    ADD CONSTRAINT "politica_tratamiento_m9_id_categoria_retencion_fkey" FOREIGN KEY ("id_categoria_retencion") REFERENCES "finanzas"."categoria_retencion_m9"("id_categoria_retencion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."proyeccion_financiera_m7"
    ADD CONSTRAINT "proyeccion_financiera_m7_actualizado_por_fkey" FOREIGN KEY ("actualizado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."proyeccion_financiera_m7"
    ADD CONSTRAINT "proyeccion_financiera_m7_creado_por_fkey" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."reclasificacion_egreso_m5"
    ADD CONSTRAINT "reclasificacion_egreso_m5_id_documento_m5_fkey" FOREIGN KEY ("id_documento_m5") REFERENCES "finanzas"."documento_proveedor_m5"("id_documento_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."reclasificacion_egreso_m5"
    ADD CONSTRAINT "reclasificacion_egreso_m5_resuelto_por_fkey" FOREIGN KEY ("resuelto_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."reclasificacion_egreso_m5"
    ADD CONSTRAINT "reclasificacion_egreso_m5_solicitado_por_fkey" FOREIGN KEY ("solicitado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."rectificacion_orden_trabajo"
    ADD CONSTRAINT "rectificacion_ot_actualizador_fk" FOREIGN KEY ("actualizado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."rectificacion_orden_trabajo"
    ADD CONSTRAINT "rectificacion_ot_asignador_fk" FOREIGN KEY ("asignado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."rectificacion_orden_trabajo"
    ADD CONSTRAINT "rectificacion_ot_empleado_fk" FOREIGN KEY ("id_empleado_rectificador") REFERENCES "finanzas"."empleado"("id_empleado") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."rectificacion_orden_trabajo"
    ADD CONSTRAINT "rectificacion_ot_especificacion_fk" FOREIGN KEY ("id_especificacion_puerta") REFERENCES "terreno"."especificaciones_puerta"("especificacion_puerta_especificacion_puerta_id") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."rectificacion_orden_trabajo"
    ADD CONSTRAINT "rectificacion_ot_unidad_fk" FOREIGN KEY ("id_unidad_fisica_ot") REFERENCES "finanzas"."unidad_fisica_orden_trabajo"("id_unidad_fisica_ot") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."respaldo_gasto_caja_chica_m5"
    ADD CONSTRAINT "respaldo_gasto_caja_chica_m5_id_gasto_caja_chica_m5_fkey" FOREIGN KEY ("id_gasto_caja_chica_m5") REFERENCES "finanzas"."gasto_caja_chica_m5"("id_gasto_caja_chica_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."respaldo_pago_proveedor_m5"
    ADD CONSTRAINT "respaldo_pago_proveedor_m5_creado_por_fkey" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."reversion_compensacion_m5"
    ADD CONSTRAINT "reversion_compensacion_m5_id_detalle_compensacion_m5_fkey" FOREIGN KEY ("id_detalle_compensacion_m5") REFERENCES "finanzas"."detalle_compensacion_saldo_favor_m5"("id_detalle_compensacion_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."reversion_compensacion_m5"
    ADD CONSTRAINT "reversion_compensacion_m5_id_respaldo_pago_m5_fkey" FOREIGN KEY ("id_respaldo_pago_m5") REFERENCES "finanzas"."respaldo_pago_proveedor_m5"("id_respaldo_pago_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."reversion_compensacion_m5"
    ADD CONSTRAINT "reversion_compensacion_m5_usuario_id_usuario_fkey" FOREIGN KEY ("usuario_id_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."reversion_movimiento_pago_m5"
    ADD CONSTRAINT "reversion_movimiento_pago_m5_id_movimiento_pago_m5_fkey" FOREIGN KEY ("id_movimiento_pago_m5") REFERENCES "finanzas"."movimiento_pago_proveedor_m5"("id_movimiento_pago_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."reversion_movimiento_pago_m5"
    ADD CONSTRAINT "reversion_movimiento_pago_m5_id_respaldo_pago_m5_fkey" FOREIGN KEY ("id_respaldo_pago_m5") REFERENCES "finanzas"."respaldo_pago_proveedor_m5"("id_respaldo_pago_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."reversion_movimiento_pago_m5"
    ADD CONSTRAINT "reversion_movimiento_pago_m5_usuario_id_usuario_fkey" FOREIGN KEY ("usuario_id_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."reversion_nota_venta"
    ADD CONSTRAINT "reversion_nota_venta_id_nota_venta_fkey" FOREIGN KEY ("id_nota_venta") REFERENCES "finanzas"."nota_venta"("id_nota_venta") ON UPDATE RESTRICT ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."reversion_pago"
    ADD CONSTRAINT "reversion_pago_id_pago_cliente_fkey" FOREIGN KEY ("id_pago_cliente") REFERENCES "finanzas"."pago_cliente"("id_pago_cliente") ON UPDATE RESTRICT ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."saldo_favor_cliente"
    ADD CONSTRAINT "saldo_favor_cliente_id_cliente_financiero_fkey" FOREIGN KEY ("id_cliente_financiero") REFERENCES "finanzas"."cliente_financiero"("id_cliente_financiero") ON UPDATE RESTRICT ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."saldo_favor_cliente"
    ADD CONSTRAINT "saldo_favor_cliente_id_nota_venta_fkey" FOREIGN KEY ("id_nota_venta") REFERENCES "finanzas"."nota_venta"("id_nota_venta") ON UPDATE RESTRICT ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."saldo_favor_cliente"
    ADD CONSTRAINT "saldo_favor_cliente_id_reversion_nota_venta_fkey" FOREIGN KEY ("id_reversion_nota_venta") REFERENCES "finanzas"."reversion_nota_venta"("id_reversion_nota_venta") ON UPDATE RESTRICT ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."saldo_favor_proveedor_m5"
    ADD CONSTRAINT "saldo_favor_proveedor_m5_id_ajuste_origen_m5_fkey" FOREIGN KEY ("id_ajuste_origen_m5") REFERENCES "finanzas"."ajuste_obligacion_proveedor_m5"("id_ajuste_obligacion_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."saldo_favor_proveedor_m5"
    ADD CONSTRAINT "saldo_favor_proveedor_m5_id_moneda_fkey" FOREIGN KEY ("id_moneda") REFERENCES "finanzas"."moneda"("id_moneda") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."saldo_favor_proveedor_m5"
    ADD CONSTRAINT "saldo_favor_proveedor_m5_id_proveedor_fkey" FOREIGN KEY ("id_proveedor") REFERENCES "finanzas"."proveedor"("id_proveedor") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."saldo_inicial_bancario_m7"
    ADD CONSTRAINT "saldo_inicial_bancario_m7_actualizado_por_fkey" FOREIGN KEY ("actualizado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."saldo_inicial_bancario_m7"
    ADD CONSTRAINT "saldo_inicial_bancario_m7_creado_por_fkey" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."solicitud_reasignacion_costo_m5"
    ADD CONSTRAINT "solicitud_reasignacion_costo_m5_id_detalle_origen_m5_fkey" FOREIGN KEY ("id_detalle_origen_m5") REFERENCES "finanzas"."detalle_imputacion_m5"("id_detalle_imputacion_m5") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."solicitud_reasignacion_costo_m5"
    ADD CONSTRAINT "solicitud_reasignacion_costo_m5_resuelto_por_fkey" FOREIGN KEY ("resuelto_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."solicitud_reasignacion_costo_m5"
    ADD CONSTRAINT "solicitud_reasignacion_costo_m5_solicitado_por_fkey" FOREIGN KEY ("solicitado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."tarea_ejecutable_unidad_ot"
    ADD CONSTRAINT "tarea_ejecutable_empleado_fk" FOREIGN KEY ("id_empleado_planificado") REFERENCES "finanzas"."empleado"("id_empleado") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."tarea_ejecutable_unidad_ot"
    ADD CONSTRAINT "tarea_ejecutable_tarea_fk" FOREIGN KEY ("id_tarea") REFERENCES "terreno"."tarea"("tarea_tarea_id") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."tarea_ejecutable_unidad_ot"
    ADD CONSTRAINT "tarea_ejecutable_unidad_fk" FOREIGN KEY ("id_unidad_fisica_ot") REFERENCES "finanzas"."unidad_fisica_orden_trabajo"("id_unidad_fisica_ot") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."tarea_ejecutable_unidad_ot"
    ADD CONSTRAINT "tarea_ejecutable_version_fk" FOREIGN KEY ("id_version_rectificacion") REFERENCES "finanzas"."version_rectificacion_orden_trabajo"("id_version_rectificacion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."tratamiento_privacidad_m9"
    ADD CONSTRAINT "tratamiento_privacidad_m9_evidencia_terminal_id_fkey" FOREIGN KEY ("evidencia_terminal_id") REFERENCES "finanzas"."evento_auditoria_m9"("id_evento_m9") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."tratamiento_privacidad_m9"
    ADD CONSTRAINT "tratamiento_privacidad_m9_id_evento_m9_fkey" FOREIGN KEY ("id_evento_m9") REFERENCES "finanzas"."evento_auditoria_m9"("id_evento_m9") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."tratamiento_privacidad_m9"
    ADD CONSTRAINT "tratamiento_privacidad_m9_id_politica_m9_fkey" FOREIGN KEY ("id_politica_m9") REFERENCES "finanzas"."politica_tratamiento_m9"("id_politica_m9") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."unidad_fisica_orden_trabajo"
    ADD CONSTRAINT "unidad_fisica_ot_cotizacion_fk" FOREIGN KEY ("id_cotizacion") REFERENCES "finanzas"."cotizacion"("id_cotizacion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."unidad_fisica_orden_trabajo"
    ADD CONSTRAINT "unidad_fisica_ot_creador_fk" FOREIGN KEY ("creado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."unidad_fisica_orden_trabajo"
    ADD CONSTRAINT "unidad_fisica_ot_detalle_fk" FOREIGN KEY ("id_detalle_cotizacion") REFERENCES "finanzas"."detalle_cotizacion"("id_detalle_cotizacion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."unidad_fisica_orden_trabajo"
    ADD CONSTRAINT "unidad_fisica_ot_familia_fk" FOREIGN KEY ("id_familia_producto_comercial") REFERENCES "finanzas"."familia_producto_comercial"("id_familia_producto_comercial") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."unidad_fisica_orden_trabajo"
    ADD CONSTRAINT "unidad_fisica_ot_orden_fk" FOREIGN KEY ("id_orden_trabajo") REFERENCES "inventario"."orden_trabajo"("orden_trabajo_id_orden") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."unidad_fisica_orden_trabajo"
    ADD CONSTRAINT "unidad_fisica_ot_producto_fk" FOREIGN KEY ("id_extension_producto_comercial") REFERENCES "finanzas"."extension_producto_comercial"("id_extension_producto_comercial") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."unidad_fisica_orden_trabajo"
    ADD CONSTRAINT "unidad_fisica_ot_version_fk" FOREIGN KEY ("id_version_plantilla") REFERENCES "finanzas"."version_plantilla_fabricacion"("id_version_plantilla") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."version_plantilla_fabricacion"
    ADD CONSTRAINT "version_plantilla_plantilla_fk" FOREIGN KEY ("id_plantilla_fabricacion") REFERENCES "finanzas"."plantilla_fabricacion_familia"("id_plantilla_fabricacion") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."version_plantilla_fabricacion"
    ADD CONSTRAINT "version_plantilla_publicador_fk" FOREIGN KEY ("publicado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."version_rectificacion_orden_trabajo"
    ADD CONSTRAINT "version_rectificacion_enviador_fk" FOREIGN KEY ("enviado_por") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "finanzas"."version_rectificacion_orden_trabajo"
    ADD CONSTRAINT "version_rectificacion_rectificacion_fk" FOREIGN KEY ("id_rectificacion_ot") REFERENCES "finanzas"."rectificacion_orden_trabajo"("id_rectificacion_ot") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."alerta_faltante_pedido"
    ADD CONSTRAINT "fk_alerta_faltante_pedido_material_sku" FOREIGN KEY ("material_sku") REFERENCES "inventario"."material"("material_sku") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."alerta_faltante_pedido"
    ADD CONSTRAINT "fk_alerta_faltante_pedido_proveedor_id_proveedor" FOREIGN KEY ("proveedor_id_proveedor") REFERENCES "finanzas"."proveedor"("id_proveedor") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."alerta_faltante_pedido"
    ADD CONSTRAINT "fk_alerta_faltante_pedido_proyecto_id_proyecto" FOREIGN KEY ("proyecto_id_proyecto") REFERENCES "comun"."proyecto"("proyecto_proyecto_id") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."alerta_faltante_pedido"
    ADD CONSTRAINT "fk_alerta_faltante_pedido_usuario_id_usuario" FOREIGN KEY ("usuario_id_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."alerta_inventario"
    ADD CONSTRAINT "fk_alerta_inventario_alerta_inventario_tipo_alerta__2344ac23" FOREIGN KEY ("alerta_inventario_tipo_alerta_id_tipo_alerta") REFERENCES "inventario"."alerta_inventario_tipo_alerta"("alerta_inventario_tipo_alerta_id_tipo_alerta") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."alerta_inventario"
    ADD CONSTRAINT "fk_alerta_inventario_historial_alerta_id_historial" FOREIGN KEY ("historial_alerta_id_historial") REFERENCES "inventario"."historial_alerta"("historial_alerta_id_historial") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."alerta_inventario"
    ADD CONSTRAINT "fk_alerta_inventario_material_sku" FOREIGN KEY ("material_sku") REFERENCES "inventario"."material"("material_sku") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."alerta_inventario"
    ADD CONSTRAINT "fk_alerta_inventario_proveedor_id_proveedor" FOREIGN KEY ("proveedor_id_proveedor") REFERENCES "finanzas"."proveedor"("id_proveedor") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."alerta_inventario_tipo_alerta"
    ADD CONSTRAINT "fk_alerta_inventario_tipo_alerta_alerta_inventario__b68d21a3" FOREIGN KEY ("alerta_inventario_nivel_prioridad_id") REFERENCES "inventario"."alerta_inventario_nivel_prioridad"("alerta_inventario_nivel_prioridad_id_nivel_prioridad") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."anaquel"
    ADD CONSTRAINT "fk_anaquel_bodega_id_bodega" FOREIGN KEY ("bodega_id_bodega") REFERENCES "inventario"."bodega"("bodega_id_bodega") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."factura_compra"
    ADD CONSTRAINT "fk_factura_compra_factura_compra_tipo_cambio_id_tipo_cambio" FOREIGN KEY ("factura_compra_tipo_cambio_id_tipo_cambio") REFERENCES "inventario"."factura_compra_tipo_cambio"("factura_compra_tipo_cambio_id_tipo_cambio") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."factura_compra"
    ADD CONSTRAINT "fk_factura_compra_proveedor_id_proveedor" FOREIGN KEY ("proveedor_id_proveedor") REFERENCES "finanzas"."proveedor"("id_proveedor") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."insumo_estandar_proceso"
    ADD CONSTRAINT "fk_insumo_estandar_proceso_area_trabajo_id_area" FOREIGN KEY ("area_trabajo_id_area") REFERENCES "comun"."area_trabajo"("area_trabajo_id_area") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."insumo_estandar_proceso"
    ADD CONSTRAINT "fk_insumo_estandar_proceso_material_sku" FOREIGN KEY ("material_sku") REFERENCES "inventario"."material"("material_sku") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."inventario_bodega"
    ADD CONSTRAINT "fk_inventario_bodega_bodega_id_bodega" FOREIGN KEY ("bodega_id_bodega") REFERENCES "inventario"."bodega"("bodega_id_bodega") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."inventario_bodega"
    ADD CONSTRAINT "fk_inventario_bodega_lote_id_lote" FOREIGN KEY ("lote_id_lote") REFERENCES "inventario"."lote"("lote_id_lote") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."inventario_bodega"
    ADD CONSTRAINT "fk_inventario_bodega_material_sku" FOREIGN KEY ("material_sku") REFERENCES "inventario"."material"("material_sku") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."lote"
    ADD CONSTRAINT "fk_lote_factura_compra_id_factura" FOREIGN KEY ("factura_compra_id_factura") REFERENCES "inventario"."factura_compra"("factura_compra_id_factura") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."lote_fecha_pedido"
    ADD CONSTRAINT "fk_lote_fecha_pedido_lote_id_lote" FOREIGN KEY ("lote_id_lote") REFERENCES "inventario"."lote"("lote_id_lote") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."lote"
    ADD CONSTRAINT "fk_lote_proveedor_id_proveedor" FOREIGN KEY ("proveedor_id_proveedor") REFERENCES "finanzas"."proveedor"("id_proveedor") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."lote"
    ADD CONSTRAINT "fk_lote_proyecto_id_proyecto" FOREIGN KEY ("proyecto_id_proyecto") REFERENCES "comun"."proyecto"("proyecto_proyecto_id") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."material_clasificacion_nivel_especifico"
    ADD CONSTRAINT "fk_material_clasificacion_nivel_especifico_material_295c8a27" FOREIGN KEY ("material_clasificacion_subcategoria_id") REFERENCES "inventario"."material_clasificacion_subcategoria"("material_clasificacion_subcategoria_id") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."material_clasificacion_subcategoria"
    ADD CONSTRAINT "fk_material_clasificacion_subcategoria_material_cla_e8cfce14" FOREIGN KEY ("material_clasificacion_categoria_id") REFERENCES "inventario"."material_clasificacion_categoria"("material_clasificacion_categoria_id") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."material_codigo_barras"
    ADD CONSTRAINT "fk_material_codigo_barras_material_sku" FOREIGN KEY ("material_sku") REFERENCES "inventario"."material"("material_sku") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."material"
    ADD CONSTRAINT "fk_material_material_categoria_funcional_id_categor_7cec335a" FOREIGN KEY ("material_categoria_funcional_id_categoria_funcional") REFERENCES "inventario"."material_categoria_funcional"("material_categoria_funcional_id_categoria_funcional") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."material"
    ADD CONSTRAINT "fk_material_material_categoria_general_id_categoria_general" FOREIGN KEY ("material_categoria_general_id_categoria_general") REFERENCES "inventario"."material_categoria_general"("material_categoria_general_id_categoria_general") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."material"
    ADD CONSTRAINT "fk_material_material_clasificacion_nivel_especifico" FOREIGN KEY ("material_clasificacion_nivel_especifico") REFERENCES "inventario"."material_clasificacion_nivel_especifico"("material_clasificacion_nivel_especifico_id") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."material"
    ADD CONSTRAINT "fk_material_material_unidad_medida_id_medida" FOREIGN KEY ("material_unidad_medida_id_medida") REFERENCES "inventario"."material_unidad_medida"("material_unidad_medida_id_unidad_medida") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."material_orden_trabajo"
    ADD CONSTRAINT "fk_material_orden_trabajo_material_sku" FOREIGN KEY ("material_sku") REFERENCES "inventario"."material"("material_sku") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."material_orden_trabajo"
    ADD CONSTRAINT "fk_material_orden_trabajo_orden_trabajo_id_orden" FOREIGN KEY ("orden_trabajo_id_orden") REFERENCES "inventario"."orden_trabajo"("orden_trabajo_id_orden") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."material_producto_terminado"
    ADD CONSTRAINT "fk_material_producto_terminado_material_sku" FOREIGN KEY ("material_sku") REFERENCES "inventario"."material"("material_sku") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."material_producto_terminado"
    ADD CONSTRAINT "fk_material_producto_terminado_producto_terminado_i_5cce9a2a" FOREIGN KEY ("producto_terminado_id_producto") REFERENCES "inventario"."producto_terminado"("producto_terminado_id_producto") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."material_proveedor"
    ADD CONSTRAINT "fk_material_proveedor_material_sku" FOREIGN KEY ("material_sku") REFERENCES "inventario"."material"("material_sku") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."material_proveedor"
    ADD CONSTRAINT "fk_material_proveedor_proveedor_id_proveedor" FOREIGN KEY ("proveedor_id_proveedor") REFERENCES "finanzas"."proveedor"("id_proveedor") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."movimiento_inventario"
    ADD CONSTRAINT "fk_movimiento_inventario_bodega_id_bodega" FOREIGN KEY ("bodega_id_bodega") REFERENCES "inventario"."bodega"("bodega_id_bodega") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."movimiento_inventario"
    ADD CONSTRAINT "fk_movimiento_inventario_factura_compra_id_factura_compra" FOREIGN KEY ("factura_compra_id_factura_compra") REFERENCES "inventario"."factura_compra"("factura_compra_id_factura") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."movimiento_inventario"
    ADD CONSTRAINT "fk_movimiento_inventario_lote_id_lote" FOREIGN KEY ("lote_id_lote") REFERENCES "inventario"."lote"("lote_id_lote") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."movimiento_inventario"
    ADD CONSTRAINT "fk_movimiento_inventario_material_sku" FOREIGN KEY ("material_sku") REFERENCES "inventario"."material"("material_sku") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."movimiento_inventario_motivo_movimiento"
    ADD CONSTRAINT "fk_movimiento_inventario_motivo_movimiento_movimien_cf1b5d9c" FOREIGN KEY ("id_clasificacion_salida") REFERENCES "inventario"."movimiento_inventario_clasificacion_salida"("id_clasificacion_salida") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."movimiento_inventario"
    ADD CONSTRAINT "fk_movimiento_inventario_movimiento_inventario_moti_5114c33e" FOREIGN KEY ("movimiento_inventario_motivo_movimiento_id_motivo_movimiento") REFERENCES "inventario"."movimiento_inventario_motivo_movimiento"("movimiento_inventario_motivo_movimiento_id_motivo_movimiento") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."movimiento_inventario"
    ADD CONSTRAINT "fk_movimiento_inventario_movimiento_inventario_tipo_491f04a7" FOREIGN KEY ("movimiento_inventario_tipo_movimiento_id_tipo_movimiento") REFERENCES "inventario"."movimiento_inventario_tipo_movimiento"("movimiento_inventario_tipo_movimiento_id_tipo_movimiento") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."movimiento_inventario"
    ADD CONSTRAINT "fk_movimiento_inventario_proyecto_id_proyecto" FOREIGN KEY ("proyecto_id_proyecto") REFERENCES "comun"."proyecto"("proyecto_proyecto_id") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."movimiento_inventario"
    ADD CONSTRAINT "fk_movimiento_inventario_usuario_id_usuario" FOREIGN KEY ("usuario_id_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."notificacion"
    ADD CONSTRAINT "fk_notificacion_alerta_inventario_id_alerta" FOREIGN KEY ("alerta_inventario_id_alerta") REFERENCES "inventario"."alerta_inventario"("alerta_inventario_id_alerta") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."notificacion"
    ADD CONSTRAINT "fk_notificacion_usuario_id_usuario" FOREIGN KEY ("usuario_id_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."operacion_inventario"
    ADD CONSTRAINT "fk_operacion_inventario_actor" FOREIGN KEY ("actor_id") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."operacion_inventario"
    ADD CONSTRAINT "fk_operacion_inventario_bodega" FOREIGN KEY ("bodega_id_bodega") REFERENCES "inventario"."bodega"("bodega_id_bodega") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."operacion_inventario"
    ADD CONSTRAINT "fk_operacion_inventario_lote" FOREIGN KEY ("lote_id_lote") REFERENCES "inventario"."lote"("lote_id_lote") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."operacion_inventario"
    ADD CONSTRAINT "fk_operacion_inventario_material" FOREIGN KEY ("material_sku") REFERENCES "inventario"."material"("material_sku") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."operacion_inventario"
    ADD CONSTRAINT "fk_operacion_inventario_movimiento" FOREIGN KEY ("movimiento_inventario_id") REFERENCES "inventario"."movimiento_inventario"("movimiento_inventario_id_movimiento") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."operacion_inventario"
    ADD CONSTRAINT "fk_operacion_inventario_reserva" FOREIGN KEY ("reserva_inventario_id") REFERENCES "inventario"."reserva_inventario"("reserva_inventario_id_reserva") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."orden_trabajo"
    ADD CONSTRAINT "fk_orden_trabajo_area_trabajo_id_area" FOREIGN KEY ("area_trabajo_id_area") REFERENCES "comun"."area_trabajo"("area_trabajo_id_area") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."orden_trabajo"
    ADD CONSTRAINT "fk_orden_trabajo_especificaciones_puerta_id_especif_6a769728" FOREIGN KEY ("especificaciones_puerta_id_especificacion_puerta") REFERENCES "terreno"."especificaciones_puerta"("especificacion_puerta_especificacion_puerta_id") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."orden_trabajo"
    ADD CONSTRAINT "fk_orden_trabajo_proyecto_id_proyecto" FOREIGN KEY ("proyecto_id_proyecto") REFERENCES "comun"."proyecto"("proyecto_proyecto_id") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."orden_trabajo"
    ADD CONSTRAINT "fk_orden_trabajo_usuario_id_usuario" FOREIGN KEY ("usuario_id_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."preparacion_pedido_estado"
    ADD CONSTRAINT "fk_preparacion_pedido_estado_preparacion_pedido_id__ee3b6a24" FOREIGN KEY ("preparacion_pedido_id_preparacion") REFERENCES "inventario"."preparacion_pedido"("preparacion_pedido_id_preparacion") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."preparacion_pedido"
    ADD CONSTRAINT "fk_preparacion_pedido_reserva_inventario_id_reserva" FOREIGN KEY ("reserva_inventario_id_reserva") REFERENCES "inventario"."reserva_inventario"("reserva_inventario_id_reserva") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."preparacion_pedido"
    ADD CONSTRAINT "fk_preparacion_pedido_usuario_id_usuario" FOREIGN KEY ("usuario_id_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."proveedor_contacto_correo"
    ADD CONSTRAINT "fk_proveedor_contacto_correo_proveedor_id_proveedor" FOREIGN KEY ("proveedor_id_proveedor") REFERENCES "finanzas"."proveedor"("id_proveedor") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."proveedor_contacto_telefono"
    ADD CONSTRAINT "fk_proveedor_contacto_telefono_proveedor_id_proveedor" FOREIGN KEY ("proveedor_id_proveedor") REFERENCES "finanzas"."proveedor"("id_proveedor") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."reporte_movimiento_inventario"
    ADD CONSTRAINT "fk_reporte_movimiento_inventario_movimiento_inventa_c5801b43" FOREIGN KEY ("movimiento_inventario_id_movimiento") REFERENCES "inventario"."movimiento_inventario"("movimiento_inventario_id_movimiento") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."reporte_movimiento_inventario"
    ADD CONSTRAINT "fk_reporte_movimiento_inventario_reporte_id_reporte" FOREIGN KEY ("reporte_id_reporte") REFERENCES "inventario"."reporte"("reporte_id_reporte") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."reporte"
    ADD CONSTRAINT "fk_reporte_usuario_id_usuario" FOREIGN KEY ("usuario_id_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."reserva_inventario"
    ADD CONSTRAINT "fk_reserva_inventario_bodega" FOREIGN KEY ("bodega_id_bodega") REFERENCES "inventario"."bodega"("bodega_id_bodega") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."reserva_inventario"
    ADD CONSTRAINT "fk_reserva_inventario_lote" FOREIGN KEY ("lote_id_lote") REFERENCES "inventario"."lote"("lote_id_lote") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."reserva_inventario"
    ADD CONSTRAINT "fk_reserva_inventario_material_sku" FOREIGN KEY ("material_sku") REFERENCES "inventario"."material"("material_sku") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."reserva_inventario"
    ADD CONSTRAINT "fk_reserva_inventario_orden_trabajo_id_orden" FOREIGN KEY ("orden_trabajo_id_orden") REFERENCES "inventario"."orden_trabajo"("orden_trabajo_id_orden") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "inventario"."reserva_inventario"
    ADD CONSTRAINT "fk_reserva_inventario_proyecto_id_proyecto" FOREIGN KEY ("proyecto_id_proyecto") REFERENCES "comun"."proyecto"("proyecto_proyecto_id") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."adicionales_pagados"
    ADD CONSTRAINT "fk_adicionales_pagados_id_especificaciones_puerta" FOREIGN KEY ("id_especificaciones_puerta") REFERENCES "terreno"."especificaciones_puerta"("especificacion_puerta_especificacion_puerta_id") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."detalles_herraje"
    ADD CONSTRAINT "fk_detalles_herraje_id_especificacion_puerta" FOREIGN KEY ("id_especificacion_puerta") REFERENCES "terreno"."especificaciones_puerta"("especificacion_puerta_especificacion_puerta_id") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."detalles_herraje"
    ADD CONSTRAINT "fk_detalles_herraje_material_sku" FOREIGN KEY ("material_sku") REFERENCES "inventario"."material"("material_sku") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."ejecucion_tarea"
    ADD CONSTRAINT "fk_ejecucion_tarea_ejecutor" FOREIGN KEY ("id_usuario_ejecutor") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."ejecucion_tarea"
    ADD CONSTRAINT "fk_ejecucion_tarea_tarea" FOREIGN KEY ("id_tarea") REFERENCES "terreno"."tarea"("tarea_tarea_id") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."especificacion_metalmecanica"
    ADD CONSTRAINT "fk_especificacion_metalmecanica_id_especificacion_puerta" FOREIGN KEY ("id_especificacion_puerta") REFERENCES "terreno"."especificaciones_puerta"("especificacion_puerta_especificacion_puerta_id") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."especificacion_proyecto_terreno"
    ADD CONSTRAINT "fk_especificacion_proyecto_terreno_id_especificacion_puerta" FOREIGN KEY ("id_especificacion_puerta") REFERENCES "terreno"."especificaciones_puerta"("especificacion_puerta_especificacion_puerta_id") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."especificacion_servicio_terreno"
    ADD CONSTRAINT "fk_especificacion_servicio_terreno_especificacion_s_79bfd2c7" FOREIGN KEY ("especificacion_servicio_terreno_servicio_terreno_id") REFERENCES "terreno"."servicio_terreno"("servicio_terreno_servicio_terreno_id") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."especificacion_servicio_terreno"
    ADD CONSTRAINT "fk_especificacion_servicio_terreno_especificacion_s_ca0b84a5" FOREIGN KEY ("especificacion_servicio_terreno_especificacion_puerta_id") REFERENCES "terreno"."especificaciones_puerta"("especificacion_puerta_especificacion_puerta_id") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."especificacion_terminaciones"
    ADD CONSTRAINT "fk_especificacion_terminaciones_id_especificacion_puerta" FOREIGN KEY ("id_especificacion_puerta") REFERENCES "terreno"."especificaciones_puerta"("especificacion_puerta_especificacion_puerta_id") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."evidencia_terreno"
    ADD CONSTRAINT "fk_evidencia_terreno_id_formulario_de_cierre" FOREIGN KEY ("id_formulario_de_cierre") REFERENCES "terreno"."formulario_de_cierre"("formulario_de_cierre_formulario_de_cierre_id") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."evidencia_terreno"
    ADD CONSTRAINT "fk_evidencia_terreno_id_servicio_terreno" FOREIGN KEY ("id_servicio_terreno") REFERENCES "terreno"."servicio_terreno"("servicio_terreno_servicio_terreno_id") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."evidencia_terreno"
    ADD CONSTRAINT "fk_evidencia_terreno_incidencia" FOREIGN KEY ("id_incidencia_retrabajo") REFERENCES "terreno"."incidencia_retrabajo_tarea"("id_incidencia_retrabajo") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."formulario_de_cierre"
    ADD CONSTRAINT "fk_formulario_de_cierre_id_tarea" FOREIGN KEY ("id_tarea") REFERENCES "terreno"."tarea"("tarea_tarea_id") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."historial_cambio_orden_trabajo"
    ADD CONSTRAINT "fk_historial_cambio_orden_trabajo_id_especificaciones_puerta" FOREIGN KEY ("id_especificaciones_puerta") REFERENCES "terreno"."especificaciones_puerta"("especificacion_puerta_especificacion_puerta_id") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."incidencia_retrabajo_tarea"
    ADD CONSTRAINT "fk_incidencia_area" FOREIGN KEY ("id_area_responsable") REFERENCES "comun"."area_trabajo"("area_trabajo_id_area") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."incidencia_retrabajo_tarea"
    ADD CONSTRAINT "fk_incidencia_categoria" FOREIGN KEY ("id_categoria_incidencia") REFERENCES "terreno"."categoria_incidencia_terreno"("id_categoria_incidencia") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."incidencia_retrabajo_tarea"
    ADD CONSTRAINT "fk_incidencia_creador" FOREIGN KEY ("id_usuario_creador") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."incidencia_retrabajo_tarea"
    ADD CONSTRAINT "fk_incidencia_retrabajo_ejecucion" FOREIGN KEY ("id_ejecucion_tarea") REFERENCES "terreno"."ejecucion_tarea"("id_ejecucion_tarea") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."incidencia_retrabajo_tarea"
    ADD CONSTRAINT "fk_incidencia_revisor" FOREIGN KEY ("id_usuario_revisor") REFERENCES "comun"."usuario"("usuario_id_usuario") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."medidas_puerta"
    ADD CONSTRAINT "fk_medidas_puerta_id_cambio" FOREIGN KEY ("id_cambio") REFERENCES "terreno"."historial_cambio_orden_trabajo"("historial_cambio_orden_trabajo_id_cambio") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."medidas_puerta"
    ADD CONSTRAINT "fk_medidas_puerta_id_especificacion_puerta" FOREIGN KEY ("id_especificacion_puerta") REFERENCES "terreno"."especificaciones_puerta"("especificacion_puerta_especificacion_puerta_id") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."notificacion_tecnico"
    ADD CONSTRAINT "fk_notificacion_tecnico_servicio_terreno_id_servicio_terreno" FOREIGN KEY ("servicio_terreno_id_servicio_terreno") REFERENCES "terreno"."servicio_terreno"("servicio_terreno_servicio_terreno_id") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."notificacion_tecnico"
    ADD CONSTRAINT "fk_notificacion_tecnico_usuario_id_usuario" FOREIGN KEY ("usuario_id_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."notificacion_terreno"
    ADD CONSTRAINT "fk_notificacion_terreno_tarea_id_tarea" FOREIGN KEY ("tarea_id_tarea") REFERENCES "terreno"."tarea"("tarea_tarea_id") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."notificacion_terreno"
    ADD CONSTRAINT "fk_notificacion_terreno_usuario_id_usuario" FOREIGN KEY ("usuario_id_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."prestamo_herramientas"
    ADD CONSTRAINT "fk_prestamo_herramientas_rut_empleado" FOREIGN KEY ("rut_empleado") REFERENCES "finanzas"."empleado"("rut_empleado") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."prestamo_herramientas"
    ADD CONSTRAINT "fk_prestamo_herramientas_sku_material" FOREIGN KEY ("sku_material") REFERENCES "inventario"."material"("material_sku") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."receptor"
    ADD CONSTRAINT "fk_receptor_id_tarea" FOREIGN KEY ("id_tarea") REFERENCES "terreno"."tarea"("tarea_tarea_id") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."servicio_terreno"
    ADD CONSTRAINT "fk_servicio_terreno_id_checklist_de_materials" FOREIGN KEY ("id_checklist_de_materials") REFERENCES "terreno"."checklist_de_materiales"("checklist_de_materiales_checklist_de_materials_id") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."servicio_terreno"
    ADD CONSTRAINT "fk_servicio_terreno_id_obra" FOREIGN KEY ("id_obra") REFERENCES "comun"."obra"("obra_obra_id") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."servicio_terreno"
    ADD CONSTRAINT "fk_servicio_terreno_id_usuario" FOREIGN KEY ("id_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."servicio_tterreno_herramientas_materiales"
    ADD CONSTRAINT "fk_servicio_tterreno_herramientas_materiales_servic_58285965" FOREIGN KEY ("servicio_terreno_herramientas_materiales_servicio_terreno_id") REFERENCES "terreno"."servicio_terreno"("servicio_terreno_servicio_terreno_id") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."tarea"
    ADD CONSTRAINT "fk_tarea_id_especificacion_puerta" FOREIGN KEY ("id_especificacion_puerta") REFERENCES "terreno"."especificaciones_puerta"("especificacion_puerta_especificacion_puerta_id") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."tarea"
    ADD CONSTRAINT "fk_tarea_id_servicio_terreno" FOREIGN KEY ("id_servicio_terreno") REFERENCES "terreno"."servicio_terreno"("servicio_terreno_servicio_terreno_id") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."tarea"
    ADD CONSTRAINT "fk_tarea_id_usuario" FOREIGN KEY ("id_usuario") REFERENCES "comun"."usuario"("usuario_id_usuario") DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."tarea"
    ADD CONSTRAINT "fk_tarea_orden_trabajo" FOREIGN KEY ("id_orden_trabajo") REFERENCES "inventario"."orden_trabajo"("orden_trabajo_id_orden") ON DELETE RESTRICT DEFERRABLE INITIALLY DEFERRED;



ALTER TABLE ONLY "terreno"."tarea_tipo"
    ADD CONSTRAINT "fk_tarea_tipo_id_tarea" FOREIGN KEY ("id_tarea") REFERENCES "terreno"."tarea"("tarea_tarea_id") DEFERRABLE INITIALLY DEFERRED;
