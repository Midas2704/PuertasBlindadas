# C3.5 — Identidad Obra, Proyecto y puerta física

## Implementado

- **Obra** identifica el lugar físico mediante `terreno.obra.obra_obra_id`. Una Cotización puede vincularla opcionalmente por `finanzas.cotizacion.id_obra_contexto`; los históricos permanecen sin vínculo cuando no existe evidencia inequívoca.
- **Proyecto** identifica un pedido formalizado. Se crea al consolidar la venta, nunca al guardar ni al emitir un borrador. `terreno.proyecto.id_cotizacion_origen` impide crear dos Proyectos para la misma Cotización.
- **Proyecto–Obra** se persiste en `terreno.proyecto_obra`. La tabla puente admite más de una Obra futura sin imponer esa cardinalidad antes de la definición empresarial. Para el flujo actual se registra una Obra principal.
- **Unidad física** nace después de la aceptación en `finanzas.unidad_fisica_orden_trabajo`. Su identidad es estable y única por detalle y `numero_unidad`; cada unidad tiene una única OT real.
- **Línea comercial** sigue agrupando cantidades. Una línea de cantidad 10 produce diez unidades físicas y diez OT, sin crear productos maestros nuevos.

## Trazabilidad entre versiones

- Antes de aceptar, cada emisión conserva snapshot y PDF inmutables; los cambios comerciales originan otra versión, no otra puerta física.
- Al aceptar, la pareja `id_detalle_cotizacion + numero_unidad` crea la identidad física.
- Cambiar medida, terminación o cerradura después de aceptar debe registrarse en el historial/rectificación de esa unidad; no crea por sí solo otra identidad.
- Agregar una unidad contratada distinta sí requiere una identidad física nueva y su OT correspondiente.

## Pendiente de definición conjunta

La sustitución, eliminación o incorporación de unidades después de iniciar Producción requiere una política formal compartida con Producción e Inventario. C3.5 no automatiza esa reconciliación ni reasigna identidades entre versiones.
