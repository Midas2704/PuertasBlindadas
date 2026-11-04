# Diccionario de errores

**Proyecto:** Puertas Blindadas
**Documento:** 36
**Version:** 1.0
**Fecha de corte:** 2026-10-19 14:31 Hora verano Sudamérica Pacífico
**Rama:** `feature/terreno-agenda-visitas`
**SHA documentado:** `d0735003f88a6b6a5d540049866bd74a680c2e04`

> Alcance de evidencia: este manual describe el codigo, schema Prisma, migraciones, pruebas y documentacion presentes en el SHA indicado. Cuando una capacidad no puede demostrarse desde esas fuentes se marca como **NO CONFIRMADO EN EL REPOSITORIO**. Implementado, preparado, bloqueado, legacy y pendiente son estados distintos.

## Tabla de contenidos

{{TOC}}

## Como leer este documento

- **Comportamiento actual** significa que existe codigo operativo y evidencia verificable.
- **Preparado** significa que existen contratos, modelos o interfaz, pero falta una dependencia o activacion.
- **Bloqueado** significa que el sistema impide deliberadamente la operacion por seguridad o falta de autorizacion.
- **Pendiente** significa que no existe una implementacion completa demostrable.
- Las rutas de archivos se expresan desde `CODIGO/`.

## Inventario de ErrorAplicacion
| HTTP | Mensaje | Origen | Linea | Accion usuario/soporte |
| --- | --- | --- | --- | --- |
| 400 | ${campo} inválida | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts | 76 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | ${campo} inválido | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts | 70 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | ${campo} inválido | Controladores/src/comercial/ServicioCatalogoComercial.ts | 16 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | ${nombre} debe ser un entero positivo | Controladores/src/controladores/M6Controller.ts | 87 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | ${nombre} debe ser un monto no negativo con hasta cuatro decimales | Controladores/src/controladores/M6Controller.ts | 101 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | ${nombre} debe ser un número entero mayor a cero | Controladores/src/controladores/M2Controller.ts | 66 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | ${nombre} debe ser un número válido no negativo | Controladores/src/validaciones/solicitudes.ts | 17 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | ${nombre} debe usar formato AAAA-MM-DD | Controladores/src/controladores/M7Controller.ts | 83 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | ${nombre} debe usar letras, números, punto, guion o guion bajo | Controladores/src/controladores/M2Controller.ts | 24 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | ${nombre} es obligatorio | Controladores/src/validaciones/solicitudes.ts | 15 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | ${nombre} es obligatorio y admite hasta ${maximo} caracteres | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 51 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | ${nombre} inválida | Controladores/src/controladores/M5Controller.ts | 143 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | ${nombre} inválida | Controladores/src/controladores/M6Controller.ts | 70 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | ${nombre} inválido | Controladores/src/controladores/M6Controller.ts | 103 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | ${nombre} inválido | Controladores/src/m9/seguridad.ts | 17 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | ${nombre} no es una fecha válida | Controladores/src/controladores/M7Controller.ts | 85 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | ${n} debe ser ${cero? | Controladores/src/controladores/M8Controller.ts | 14 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | ${n} inválida | Controladores/src/controladores/M8Controller.ts | 15 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | ${n} inválido | Controladores/src/comercial/ServicioEscrituraComercial.ts | 8 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | ${n} inválido | Controladores/src/controladores/M8Controller.ts | 13 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Acción de incidencia inválida | Controladores/src/controladores/M6Controller.ts | 3450 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Adjunta la Nota de Crédito PDF | Controladores/src/controladores/M2Controller.ts | 791 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Alcance geográfico inválido | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts | 102 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Antecedentes inválidos | Controladores/src/controladores/M2Controller.ts | 1406 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Archivo PDF no válido | Controladores/src/controladores/M2Controller.ts | 793 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Archivo y contenido del respaldo son obligatorios | Controladores/src/controladores/M5Controller.ts | 1956 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Año inválido | Controladores/src/controladores/M6Controller.ts | 361 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Año y mes válidos son obligatorios | Controladores/src/controladores/M6Controller.ts | 1321 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Banco, alias e identificador bancario válidos son obligatorios | Controladores/src/controladores/M7Controller.ts | 336 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | CLP no requiere tipo de cambio | Controladores/src/controladores/M5Controller.ts | 1114 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | CU160 sólo permite conceptos HABER | Controladores/src/controladores/M6Controller.ts | 810 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | CU186 sólo paga remuneraciones o regularizaciones | Controladores/src/controladores/M6Controller.ts | 2030 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | CU214 sólo permite conceptos DEDUCCION activos | Controladores/src/controladores/M6Controller.ts | 3501 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Cada condición necesita una descripción | Controladores/src/controladores/M2Controller.ts | 1411 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Cada contacto debe incluir nombre y correo o teléfono | Controladores/src/controladores/M2Controller.ts | 142 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Cada modelo debe indicar producto y precio versionados | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 327 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Campo de ajuste no permitido | Controladores/src/controladores/M5Controller.ts | 746 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Canal de entrega inválido | Controladores/src/controladores/M6Controller.ts | 2347 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Canal documental inválido | Controladores/src/controladores/M6Controller.ts | 847 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Cantidad y unidad deben informarse juntas | Controladores/src/controladores/M6Controller.ts | 3180 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Característica destacada inválida | Controladores/src/controladores/M2Controller.ts | 54 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Categoría de Estado de Resultados inválida | Controladores/src/controladores/M7Controller.ts | 925 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Categoría de flujo inválida | Controladores/src/controladores/M7Controller.ts | 924 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Categoría de incidencia no disponible | Controladores/src/controladores/M6Controller.ts | 3365 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Categoría o área no disponible | Controladores/src/controladores/M6Controller.ts | 3459 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Ciudad y comuna son obligatorias | Controladores/src/controladores/M7Controller.ts | 1736 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Clase, fuente, clave y descripción válidas son obligatorias | Controladores/src/controladores/M6Controller.ts | 1696 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Clave de idempotencia inválida | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 56 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Clave de idempotencia inválida | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts | 87 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Clave de idempotencia inválida | Controladores/src/controladores/M2Controller.ts | 712 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Cliente inválido | Controladores/src/controladores/M6Controller.ts | 3305 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Cliente inválido | Controladores/src/controladores/M7Controller.ts | 1266 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Cliente no disponible | Controladores/src/controladores/M2Controller.ts | 1159 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Cliente y orden de trabajo deben informarse juntos | Controladores/src/controladores/M6Controller.ts | 3353 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Cobertura inválida | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts | 101 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Completa las tres medidas del producto | Controladores/src/controladores/M2Controller.ts | 174 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Completa motivo, folio y revisión del monto del PDF | Controladores/src/controladores/M2Controller.ts | 789 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Completa nombre o Razón Social y tipo de cliente | Controladores/src/controladores/M1Controller.ts | 14 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Configuración no válida | Controladores/src/controladores/M4Controller.ts | 157 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Configuración particular no válida | Controladores/src/controladores/M4Controller.ts | 161 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Confirma el registro del cliente | Controladores/src/controladores/M2Controller.ts | 647 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Confirma la operación | Controladores/src/controladores/M1Controller.ts | 47 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Consentimiento electrónico inválido | Controladores/src/controladores/M6Controller.ts | 679 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Contraseña actual incorrecta | Controladores/src/controladores/M4Controller.ts | 127 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Correo inválido | Controladores/src/controladores/M4Controller.ts | 158 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Correo particular inválido | Controladores/src/controladores/M6Controller.ts | 672 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Cubrejuntas debe ser verdadero, falso o vacío | Controladores/src/controladores/M6Controller.ts | 2701 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Cubrejuntas inválido | Controladores/src/controladores/M6Controller.ts | 2964 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Cuenta bancaria inválida | Controladores/src/controladores/M7Controller.ts | 343 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Código obligatorio | Controladores/src/controladores/M6Controller.ts | 1163 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Código y nombre son obligatorios | Controladores/src/controladores/M6Controller.ts | 868 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Código, nombre y modalidad HABER válidos son obligatorios | Controladores/src/controladores/M6Controller.ts | 946 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Código, nombre y naturaleza válidos son obligatorios | Controladores/src/controladores/M6Controller.ts | 1093 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Código, nombre y requisito de respaldo son obligatorios | Controladores/src/controladores/M6Controller.ts | 1153 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Código, tipo y nombre válidos son obligatorios | Controladores/src/controladores/M6Controller.ts | 1011 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Datos comerciales inválidos | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts | 66 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Debe existir exactamente un contacto principal | Controladores/src/controladores/M2Controller.ts | 136 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Debe identificar al empleado que inicia el trabajo | Controladores/src/controladores/M6Controller.ts | 3174 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Debe identificar al empleado que realizó el trabajo | Controladores/src/controladores/M6Controller.ts | 3186 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Debe seleccionar una tarea de catálogo o indicar un nombre particular | Controladores/src/controladores/M6Controller.ts | 3219 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Debes confirmar la operación | Controladores/src/controladores/M4Controller.ts | 19 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Debes confirmar la operación | Controladores/src/controladores/M5Controller.ts | 502 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Debes confirmar la reapertura | Controladores/src/controladores/M5Controller.ts | 843 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Debes indicar al menos un campo para corregir | Controladores/src/controladores/M6Controller.ts | 2751 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Debes indicar al menos una Orden de Compra | Controladores/src/controladores/M5Controller.ts | 964 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Debes ingresar al menos una tarea de producción | Controladores/src/controladores/M6Controller.ts | 3061 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Debes revisar y confirmar la planificación de todas las puertas antes de aprobar la Cotización | Controladores/src/controladores/M2Controller.ts | 564 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Decisión productiva inválida | Controladores/src/controladores/M6Controller.ts | 3201 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Decisión y motivo son obligatorios | Controladores/src/controladores/M8Controller.ts | 27 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Define al menos una etapa de cobro | Controladores/src/controladores/M2Controller.ts | 773 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Descripción y modalidad válida son obligatorias | Controladores/src/controladores/M6Controller.ts | 1651 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Descuento fuera de límites | Controladores/src/controladores/M2Controller.ts | 117 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Destino de imputación inválido | Controladores/src/controladores/M5Controller.ts | 1086 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Destino de reasignación inválido | Controladores/src/controladores/M5Controller.ts | 1730 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Dirección permitida: asc o desc | Controladores/src/controladores/M5Controller.ts | 153 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Dirección y motivo son obligatorios | Controladores/src/controladores/M6Controller.ts | 1788 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Dirección, descripción y motivo son obligatorios | Controladores/src/controladores/M6Controller.ts | 1731 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Ejecutor inválido | Controladores/src/controladores/M9Controller.ts | 66 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El Proyecto destino es obligatorio | Controladores/src/controladores/M5Controller.ts | 1735 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El Proyecto u OT cerrado requiere justificación excepcional | Controladores/src/controladores/M5Controller.ts | 1772 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El RUT del empleado es obligatorio | Controladores/src/controladores/M4Controller.ts | 152 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El RUT es obligatorio para clientes B2B | Controladores/src/controladores/M1Controller.ts | 15 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El RUT es obligatorio para clientes B2B | Controladores/src/controladores/M2Controller.ts | 644 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El RUT es obligatorio para formalizar | Controladores/src/controladores/M2Controller.ts | 758 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El RUT ingresado no es válido | Controladores/src/utilidades/rut.ts | 33 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El ajuste no presenta cambios | Controladores/src/controladores/M5Controller.ts | 781 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El apellido paterno es obligatorio | Controladores/src/controladores/M6Controller.ts | 469 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El archivo generado no es un PDF válido | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 277 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El bruto de la boleta debe ser mayor que cero | Controladores/src/controladores/M6Controller.ts | 2162 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El consentimiento debe indicarse explícitamente | Controladores/src/controladores/M6Controller.ts | 845 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El contacto es obligatorio para clientes B2B | Controladores/src/controladores/M2Controller.ts | 646 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El contenido documental contiene código no autorizado | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 74 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El correo de contacto no es válido | Controladores/src/controladores/M2Controller.ts | 143 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El crédito requiere cuotas | Controladores/src/utilidades/pago.ts | 24 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El default debe quedar dentro de la vigencia del esquema | Controladores/src/controladores/M6Controller.ts | 895 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El documento tributario debe existir y pertenecer al mismo cliente | Controladores/src/controladores/M3Controller.ts | 32 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El documento tributario no está relacionado con la Nota de Venta | Controladores/src/controladores/M3Controller.ts | 33 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El evento contiene un campo prohibido | Controladores/src/m9/seguridad.ts | 11 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El excedente de la Nota de Débito requiere justificación | Controladores/src/controladores/M5Controller.ts | 1553 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El folio es obligatorio | Controladores/src/controladores/M2Controller.ts | 1401 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El folio es obligatorio | Controladores/src/controladores/M6Controller.ts | 2130 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El folio o número es obligatorio | Controladores/src/controladores/M5Controller.ts | 148 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El folio y respaldo de la Orden de Compra son obligatorios | Controladores/src/controladores/M2Controller.ts | 614 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El fundamento es obligatorio | Controladores/src/controladores/M6Controller.ts | 1760 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El horizonte debe ser un entero entre 1 y 90 días | Controladores/src/controladores/M7Controller.ts | 1586 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El identificador fiscal es obligatorio | Controladores/src/controladores/M5Controller.ts | 378 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El límite hasta no puede ser menor al límite desde | Controladores/src/controladores/M6Controller.ts | 1069 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El margen debe ser menor a 100 | Controladores/src/controladores/M2Controller.ts | 1197 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El margen debe ser menor a 100 para calcular el precio | Controladores/src/controladores/M2Controller.ts | 1148 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El medio de pago exige respaldo | Controladores/src/controladores/M6Controller.ts | 1953 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El monto autorizado debe ser numérico y mayor que cero | Controladores/src/controladores/M5Controller.ts | 158 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El monto conciliado debe ser positivo | Controladores/src/controladores/M3Controller.ts | 157 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El monto conciliado no puede superar el pago | Controladores/src/controladores/M3Controller.ts | 162 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El monto debe ser mayor a cero | Controladores/src/controladores/M2Controller.ts | 1301 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El monto debe ser mayor que cero | Controladores/src/controladores/M7Controller.ts | 1693 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El monto debe ser numérico y mayor o igual que cero | Controladores/src/controladores/M5Controller.ts | 163 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El monto debe ser positivo | Controladores/src/controladores/M3Controller.ts | 126 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El monto financiado debe ser positivo y no superar el total | Controladores/src/controladores/M2Controller.ts | 625 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El monto neto no coincide con el detalle comercial | Controladores/src/controladores/M2Controller.ts | 1322 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El motivo de anulación es obligatorio | Controladores/src/controladores/M6Controller.ts | 2232 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El motivo de la asignación es obligatorio | Controladores/src/controladores/M6Controller.ts | 2933 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El motivo de la corrección es obligatorio | Controladores/src/controladores/M6Controller.ts | 2726 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El motivo de la reasignación es obligatorio | Controladores/src/controladores/M6Controller.ts | 3137 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El motivo de postergación es obligatorio | Controladores/src/controladores/M6Controller.ts | 1821 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El motivo de reapertura es obligatorio | Controladores/src/controladores/M6Controller.ts | 1617 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El motivo de reversión es obligatorio | Controladores/src/controladores/M6Controller.ts | 2237 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El motivo del ajuste es obligatorio | Controladores/src/controladores/M6Controller.ts | 3156 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El motivo del cambio es obligatorio | Controladores/src/controladores/M6Controller.ts | 332 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El motivo del registro o modificación es obligatorio | Controladores/src/controladores/M6Controller.ts | 2958 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El motivo es obligatorio | Controladores/src/controladores/M2Controller.ts | 29 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El motivo es obligatorio | Controladores/src/controladores/M5Controller.ts | 137 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El motivo es obligatorio | Controladores/src/controladores/M6Controller.ts | 1857 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El motivo es obligatorio | Controladores/src/controladores/M8Controller.ts | 26 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El motivo es obligatorio | Controladores/src/controladores/M9Controller.ts | 68 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El motivo extraordinario es obligatorio | Controladores/src/controladores/M8Controller.ts | 24 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El motivo y las observaciones técnicas son obligatorios | Controladores/src/controladores/M6Controller.ts | 3003 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El nombre comercial es obligatorio | Controladores/src/controladores/M2Controller.ts | 876 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El nombre de la etapa ${indice + 1} es obligatorio | Controladores/src/controladores/M2Controller.ts | 1050 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El nombre de la familia es obligatorio | Controladores/src/controladores/M2Controller.ts | 820 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El nombre de la tarea es obligatorio | Controladores/src/controladores/M2Controller.ts | 997 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El nombre del área es obligatorio | Controladores/src/controladores/M6Controller.ts | 266 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El nombre es obligatorio | Controladores/src/controladores/M5Controller.ts | 1688 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El nombre o Razón Social es obligatorio | Controladores/src/controladores/M1Controller.ts | 41 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El origen o contexto de la tasa es obligatorio | Controladores/src/controladores/M5Controller.ts | 1111 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El pago debe ser positivo y no superar el saldo disponible | Controladores/src/utilidades/pago.ts | 16 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El país es obligatorio para definir la identidad fiscal | Controladores/src/controladores/M5Controller.ts | 372 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El período debe usar formato YYYY-MM | Controladores/src/controladores/M5Controller.ts | 169 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El período necesita fecha desde y hasta | Controladores/src/controladores/M7Controller.ts | 93 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El porcentaje debe informarse como factor decimal | Controladores/src/controladores/M6Controller.ts | 711 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El precio definido debe ser positivo | Controladores/src/controladores/M2Controller.ts | 1292 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El precio inicial debe pertenecer a un segmento habilitado | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts | 98 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El rango de fechas es inválido | Controladores/src/controladores/M6Controller.ts | 364 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El rechazo requiere motivo | Controladores/src/controladores/M6Controller.ts | 1667 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El respaldo del documento externo es obligatorio | Controladores/src/controladores/M2Controller.ts | 1390 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El respaldo del pago es obligatorio | Controladores/src/utilidades/pago.ts | 28 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El respaldo es obligatorio | Controladores/src/controladores/M5Controller.ts | 1346 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El resultado del servicio es obligatorio | Controladores/src/controladores/M6Controller.ts | 3272 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El segmento B2B o B2C es obligatorio | Controladores/src/comercial/ServicioCatalogoComercial.ts | 29 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El segmento B2B o B2C es obligatorio | Controladores/src/controladores/C_Finanzas.ts | 569 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El segmento comercial debe ser B2B o B2C | Controladores/src/controladores/M2Controller.ts | 226 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El servicio debe habilitar al menos un segmento | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts | 97 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El teléfono es obligatorio para clientes B2C provisionales | Controladores/src/controladores/M2Controller.ts | 645 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El tipo de cambio USD/CLP debe ser mayor a cero | Controladores/src/controladores/M2Controller.ts | 458 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El tipo de costo es obligatorio | Controladores/src/controladores/M5Controller.ts | 1860 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El título de la tarea ${indice + 1} es obligatorio | Controladores/src/controladores/M6Controller.ts | 3068 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El umbral debe estar entre 0 y 100 | Controladores/src/controladores/M7Controller.ts | 1123 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El umbral debe ser un entero mayor o igual que cero | Controladores/src/controladores/M5Controller.ts | 362 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El umbral debe ser un monto mayor o igual que cero | Controladores/src/controladores/M5Controller.ts | 1697 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El umbral debe ser un número de días válido | Controladores/src/controladores/M2Controller.ts | 1414 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El umbral debe ser un número válido | Controladores/src/controladores/M7Controller.ts | 1122 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El umbral es obligatorio | Controladores/src/controladores/M7Controller.ts | 1119 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El valor debe ser numérico y no negativo | Controladores/src/controladores/M7Controller.ts | 1733 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | El vencimiento anterior a la emisión sólo se permite como carga histórica justificada | Controladores/src/controladores/M5Controller.ts | 1054 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Enlace de recuperación no válido | Controladores/src/controladores/M4Controller.ts | 262 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Estado de cuenta inválido | Controladores/src/controladores/M7Controller.ts | 338 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Estado de empleado inválido | Controladores/src/controladores/M6Controller.ts | 167 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Estado de familia inválido | Controladores/src/controladores/M2Controller.ts | 809 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Estado de pago inválido | Controladores/src/controladores/M5Controller.ts | 341 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Estado de parámetro inválido | Controladores/src/controladores/M6Controller.ts | 1012 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Estado de política inválido | Controladores/src/controladores/M6Controller.ts | 1134 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Estado de prestador inválido | Controladores/src/controladores/M6Controller.ts | 2059 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Estado de producto inválido | Controladores/src/controladores/M2Controller.ts | 869 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Estado de resolución inválido | Controladores/src/controladores/M6Controller.ts | 3387 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Estado de revisión inválido | Controladores/src/controladores/M6Controller.ts | 3386 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Estado de tarea inválido | Controladores/src/controladores/M2Controller.ts | 982 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Estado documental inválido | Controladores/src/controladores/M6Controller.ts | 2096 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Estado inválido | Controladores/src/controladores/M6Controller.ts | 879 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Estado inválido | Controladores/src/controladores/M8Controller.ts | 22 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Estado laboral inválido | Controladores/src/controladores/M6Controller.ts | 476 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Estado permitido: Activo, Inactivo o Todos | Controladores/src/controladores/M5Controller.ts | 524 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Estado permitido: activos, inactivos o todos | Controladores/src/validaciones/solicitudes.ts | 23 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Estado temporal inválido | Controladores/src/controladores/M5Controller.ts | 340 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Etapa ${indice + 1} inválida | Controladores/src/controladores/M2Controller.ts | 522 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Etapa ${indice+1} inválida | Controladores/src/controladores/M6Controller.ts | 2950 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Etapa ${indice+1} sin nombre | Controladores/src/controladores/M6Controller.ts | 2950 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Etapa inválida: usa Anticipo, Abono parcial o Pago final | Controladores/src/controladores/M2Controller.ts | 778 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Evento origen inexistente | Controladores/src/controladores/M9Controller.ts | 71 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Evento original inexistente | Controladores/src/controladores/M9Controller.ts | 72 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Existe una característica técnica no admitida | Controladores/src/controladores/M2Controller.ts | 40 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Existe una tarea catalogada inexistente o inactiva | Controladores/src/controladores/M2Controller.ts | 1045 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Falta el antecedente del medio de pago | Controladores/src/utilidades/pago.ts | 30 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Faltan puertas en la planificación | Controladores/src/controladores/M2Controller.ts | 538 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Familia de parámetro M7 inválida | Controladores/src/controladores/M7Controller.ts | 1738 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Fecha de emisión inválida | Controladores/src/controladores/M2Controller.ts | 1386 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Fecha de incidencia inválida | Controladores/src/controladores/M6Controller.ts | 3380 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Fecha de vencimiento inválida | Controladores/src/controladores/M2Controller.ts | 1410 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Fecha de vencimiento obligatoria o inválida | Controladores/src/controladores/M2Controller.ts | 1387 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Fecha de vigencia inválida | Controladores/src/controladores/M2Controller.ts | 60 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Filtro ${clave} inválido | Controladores/src/validaciones/solicitudes.ts | 25 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Formato de evidencia no permitido | Controladores/src/controladores/M6Controller.ts | 37 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Formato de exportación no soportado | Controladores/src/controladores/M9Controller.ts | 228 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Fuente de costo inválida | Controladores/src/controladores/M5Controller.ts | 1865 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Fuente, referencia, versión, clave y descripción son obligatorias | Controladores/src/controladores/M6Controller.ts | 1716 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Fundamento y autorización son obligatorios | Controladores/src/controladores/M6Controller.ts | 3497 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Gasto general no admite Proyecto ni Orden de Trabajo | Controladores/src/controladores/M5Controller.ts | 1092 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Granularidad inválida; use dia, semana o mes | Controladores/src/controladores/M7Controller.ts | 1039 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Horizonte inválido | Controladores/src/controladores/M7Controller.ts | 1057 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Identificador inválido | Controladores/src/validaciones/solicitudes.ts | 4 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Identificador y nombre o razón social son obligatorios | Controladores/src/controladores/M6Controller.ts | 2058 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Incluye al menos un producto | Controladores/src/controladores/M2Controller.ts | 1149 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Incluye al menos una línea comercial válida | Controladores/src/controladores/M2Controller.ts | 1320 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Indica IVA o exención | Controladores/src/controladores/M2Controller.ts | 114 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Indica dirección, región, comuna o texto de búsqueda | Controladores/src/comercial/ServicioObraProyectoComercial.ts | 31 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Indica las distribuciones que serán revertidas | Controladores/src/controladores/M5Controller.ts | 1667 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Indica si la cotización requiere instalación | Controladores/src/controladores/M2Controller.ts | 329 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La Cotización no pertenece al Cliente | Controladores/src/controladores/M8Controller.ts | 24 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La Nota de Venta no pertenece al Cliente | Controladores/src/controladores/M8Controller.ts | 24 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La OCS no presenta cambios | Controladores/src/controladores/M5Controller.ts | 734 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La Obra seleccionada no existe | Controladores/src/controladores/M2Controller.ts | 109 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La Orden de Trabajo no pertenece al Proyecto | Controladores/src/controladores/M5Controller.ts | 1091 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La Orden de Trabajo no pertenece al Proyecto de la imputación | Controladores/src/controladores/M5Controller.ts | 1722 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La Orden de Trabajo no pertenece al Proyecto destino | Controladores/src/controladores/M5Controller.ts | 1742 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La asignación debe quedar dentro de la vigencia del esquema | Controladores/src/controladores/M6Controller.ts | 762 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La cantidad de días debe ser un entero mayor o igual que cero | Controladores/src/controladores/M5Controller.ts | 175 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La cantidad de material debe ser mayor a cero | Controladores/src/controladores/M2Controller.ts | 184 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La cantidad de producto debe ser un entero mayor a cero | Controladores/src/controladores/M2Controller.ts | 176 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La cantidad debe ser mayor a cero | Controladores/src/controladores/M2Controller.ts | 1263 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La cantidad del servicio debe ser mayor a cero | Controladores/src/controladores/M2Controller.ts | 309 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La cantidad recibida no puede superar la cantidad pedida | Controladores/src/controladores/M5Controller.ts | 670 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La característica ${campo} no es válida | Controladores/src/controladores/M2Controller.ts | 45 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La categoría destino debe ser distinta | Controladores/src/controladores/M5Controller.ts | 1703 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La categoría es obligatoria | Controladores/src/controladores/M6Controller.ts | 3345 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La clasificación debe cuadrar exactamente con cada asociación | Controladores/src/controladores/M5Controller.ts | 1071 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La clasificación no pertenece al documento | Controladores/src/controladores/M5Controller.ts | 1703 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La clave de idempotencia es obligatoria | Controladores/src/controladores/M6Controller.ts | 1777 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La compatibilidad debe habilitar al menos un segmento | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts | 116 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La condición de pago no presenta cambios | Controladores/src/controladores/M5Controller.ts | 607 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La contraseña debe tener entre ${politica.longitud} y 256 caracteres | Controladores/src/utilidades/seguridad.ts | 34 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La contraseña ya fue utilizada recientemente | Controladores/src/controladores/M4Controller.ts | 52 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La corrección completa debe enviarse en una sola solicitud | Controladores/src/controladores/M5Controller.ts | 1702 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La corrección de OT requiere una imputación a Proyecto | Controladores/src/controladores/M5Controller.ts | 1719 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La corrección requiere contexto, causa o responsabilidad | Controladores/src/controladores/M6Controller.ts | 3466 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La cotización B2B requiere al menos un contacto propio | Controladores/src/controladores/M2Controller.ts | 134 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La cotización pactada sólo corresponde a una Isapre | Controladores/src/controladores/M6Controller.ts | 702 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La decisión debe ser REMUNERABLE o NO REMUNERABLE | Controladores/src/controladores/M6Controller.ts | 1261 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La decisión debe ser aprobar o rechazar | Controladores/src/controladores/M6Controller.ts | 1666 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La descripción es obligatoria | Controladores/src/controladores/M6Controller.ts | 3344 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La discrepancia requiere una observación | Controladores/src/controladores/M5Controller.ts | 1505 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La distribución de compensación es obligatoria y no admite obligaciones repetidas | Controladores/src/controladores/M5Controller.ts | 1643 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La distribución entre Órdenes de Compra debe ser exactamente igual al monto del documento | Controladores/src/controladores/M5Controller.ts | 974 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La distribución no cuadra con el monto que se pretende reasignar | Controladores/src/controladores/M5Controller.ts | 1764 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La distribución propuesta es obligatoria | Controladores/src/controladores/M5Controller.ts | 1762 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La etapa ${indice + 1} requiere nombre | Controladores/src/controladores/M2Controller.ts | 524 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La evidencia de conciliación es obligatoria | Controladores/src/controladores/M3Controller.ts | 161 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La evidencia debe pesar entre 1 byte y 5 MB | Controladores/src/controladores/M6Controller.ts | 39 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La evidencia debe ser un archivo válido | Controladores/src/controladores/M6Controller.ts | 35 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La evidencia es obligatoria | Controladores/src/controladores/M6Controller.ts | 3436 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La excepción debe vincularse a una operación M2 | Controladores/src/controladores/M8Controller.ts | 24 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La exclusión del Seguro de Cesantía requiere fundamento | Controladores/src/controladores/M6Controller.ts | 695 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La exportación comparativa no está disponible para este origen | Controladores/src/controladores/M7Controller.ts | 2190 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La fecha de cobro del cheque debe ser futura | Controladores/src/utilidades/pago.ts | 32 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La fecha de término no puede ser anterior al inicio | Controladores/src/controladores/M6Controller.ts | 534 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La fecha desde debe ser anterior o igual a la fecha hasta | Controladores/src/controladores/M7Controller.ts | 105 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La fecha desde no puede ser posterior a la fecha hasta | Controladores/src/controladores/M6Controller.ts | 3529 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La identidad fiscal no presenta cambios | Controladores/src/controladores/M5Controller.ts | 476 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La identidad fiscal sólo puede modificarse mediante CU77 | Controladores/src/controladores/M5Controller.ts | 431 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La imputación debe cuadrar exactamente con cada clasificación | Controladores/src/controladores/M5Controller.ts | 1084 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La justificación es obligatoria | Controladores/src/controladores/M5Controller.ts | 1002 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La justificación es obligatoria | Controladores/src/controladores/M6Controller.ts | 1262 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La justificación es obligatoria | Controladores/src/controladores/M7Controller.ts | 1695 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La modalidad REGLA requiere metadata controlada | Controladores/src/controladores/M6Controller.ts | 949 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La modalidad requiere valor | Controladores/src/controladores/M6Controller.ts | 948 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La modalidad tributaria es obligatoria | Controladores/src/controladores/M6Controller.ts | 2131 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La moneda del ajuste debe coincidir con la obligación | Controladores/src/controladores/M5Controller.ts | 1538 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La moneda es obligatoria | Controladores/src/controladores/M7Controller.ts | 1697 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La nueva vigencia debe ser posterior a hoy | Controladores/src/controladores/M2Controller.ts | 747 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La observación es obligatoria y admite hasta 1000 caracteres | Controladores/src/controladores/M7Controller.ts | 347 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La observación o motivo de cierre es obligatorio | Controladores/src/controladores/M6Controller.ts | 3223 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La observación supera el máximo de 1000 caracteres | Controladores/src/controladores/M7Controller.ts | 928 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La planificación contiene una puerta que no pertenece a la Cotización | Controladores/src/controladores/M2Controller.ts | 517 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La planificación debe contener exactamente ${base.unidades.length} puertas | Controladores/src/controladores/M2Controller.ts | 507 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La planificación no puede quedar sin tareas | Controladores/src/controladores/M6Controller.ts | 2951 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La planificación requiere al menos una etapa | Controladores/src/controladores/M6Controller.ts | 2948 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La plantilla contiene una medida obligatoria no admitida | Controladores/src/controladores/M2Controller.ts | 1064 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La plantilla debe contener una lista de hasta 60 etapas | Controladores/src/controladores/M2Controller.ts | 1036 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La plantilla debe tener al menos una etapa antes de publicarse | Controladores/src/controladores/M2Controller.ts | 1101 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La puerta ${esperada.producto} #${numeroUnidad} no puede generar una OT vacía | Controladores/src/controladores/M2Controller.ts | 535 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La puerta ${esperada.producto} #${numeroUnidad} requiere al menos una etapa | Controladores/src/controladores/M2Controller.ts | 519 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La razón social es obligatoria | Controladores/src/controladores/M5Controller.ts | 403 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La referencia es obligatoria | Controladores/src/controladores/M5Controller.ts | 1846 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La región es obligatoria | Controladores/src/comercial/ServicioCatalogoComercial.ts | 141 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La región es obligatoria cuando se solicita instalación | Controladores/src/controladores/M2Controller.ts | 336 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La regla requiere metadata controlada | Controladores/src/controladores/M6Controller.ts | 1095 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La regla temporal requiere una referencia controlada | Controladores/src/controladores/M6Controller.ts | 1654 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La resolución debe venir decidida y fundada por el owner | Controladores/src/m9/contratosPostM9.ts | 16 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La resolución del conflicto requiere fundamento | Controladores/src/controladores/M6Controller.ts | 1676 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La reversión supera el monto aún disponible | Controladores/src/controladores/M3Controller.ts | 117 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La revisión optimista es obligatoria | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 66 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La selección de permisos no es válida | Controladores/src/controladores/M4Controller.ts | 202 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La tarea ${catalogada.nombre} no pertenece al área de su etapa | Controladores/src/controladores/M2Controller.ts | 1055 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La tarea ${posicion + 1} requiere nombre | Controladores/src/controladores/M2Controller.ts | 529 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La tarea particular ${posicion + 1} de la etapa ${indice + 1} requiere nombre | Controladores/src/controladores/M2Controller.ts | 1057 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La validación de cierre debe confirmarse | Controladores/src/controladores/M6Controller.ts | 53 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La venta directa requiere cliente activo y formal | Controladores/src/controladores/M2Controller.ts | 1316 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La ventana histórica debe contener entre 1 y 24 meses | Controladores/src/controladores/M7Controller.ts | 391 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La vigencia debe ser posterior a hoy | Controladores/src/controladores/M2Controller.ts | 1146 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La vigencia hasta no puede ser anterior a la vigencia desde | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts | 80 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La vigencia hasta no puede ser anterior a la vigencia desde | Controladores/src/controladores/M6Controller.ts | 728 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | La vigencia no puede estar vencida | Controladores/src/controladores/M2Controller.ts | 1216 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Las alternativas B2C deben ser una lista de hasta 8 modelos | Controladores/src/controladores/M2Controller.ts | 372 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Las características destacadas deben ser una lista de hasta 20 elementos | Controladores/src/controladores/M2Controller.ts | 52 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Las características técnicas deben ser un objeto | Controladores/src/controladores/M2Controller.ts | 38 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Las medidas obligatorias no pueden repetirse | Controladores/src/controladores/M2Controller.ts | 1066 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Las tareas de la etapa ${indice + 1} no son válidas | Controladores/src/controladores/M2Controller.ts | 1051 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Los contactos B2B deben ser una lista de hasta 20 registros | Controladores/src/controladores/M2Controller.ts | 132 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Los días deben ser un entero positivo | Controladores/src/controladores/M7Controller.ts | 1737 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Los materiales de la Cotización deben tener un costo vigente en CLP | Controladores/src/controladores/M2Controller.ts | 182 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Los montos del documento no son coherentes | Controladores/src/controladores/M2Controller.ts | 1389 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Los nombres son obligatorios | Controladores/src/controladores/M6Controller.ts | 464 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Los servicios deben ser una lista de hasta 30 partidas | Controladores/src/controladores/M2Controller.ts | 303 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Límite de retry inválido | Controladores/src/controladores/M9Controller.ts | 266 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Límites, factor, rebaja y unidad son obligatorios | Controladores/src/controladores/M6Controller.ts | 1068 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | M9 no clasifica incidentes | Controladores/src/m9/contratosPostM9.ts | 22 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Material ajeno o duplicado | Controladores/src/controladores/M2Controller.ts | 1261 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Materiales o productos inválidos | Controladores/src/controladores/M2Controller.ts | 1198 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Modalidad inválida | Controladores/src/controladores/M6Controller.ts | 913 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Modalidad tributaria de boleta inválida | Controladores/src/controladores/M6Controller.ts | 2161 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Modo de permisos no válido | Controladores/src/controladores/M4Controller.ts | 215 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Moneda inválida | Controladores/src/controladores/M7Controller.ts | 337 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Moneda no disponible | Controladores/src/controladores/M7Controller.ts | 927 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Moneda no habilitada | Controladores/src/controladores/M2Controller.ts | 1152 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Moneda y monto no negativo son obligatorios | Controladores/src/controladores/M7Controller.ts | 926 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Monto de reversión inconsistente con la Nota de Crédito | Controladores/src/controladores/M2Controller.ts | 787 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Monto inválido | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts | 90 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Monto proyectado inválido | Controladores/src/controladores/M7Controller.ts | 921 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Monto, motivo y respaldo son obligatorios | Controladores/src/controladores/M3Controller.ts | 112 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Motivo y clave de idempotencia son obligatorios | Controladores/src/controladores/M6Controller.ts | 3217 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Motivo y medida propuesta son obligatorios | Controladores/src/controladores/M6Controller.ts | 3225 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Motivo y respaldo son obligatorios | Controladores/src/controladores/M3Controller.ts | 98 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Naturaleza permitida: entrada o salida | Controladores/src/controladores/M7Controller.ts | 1691 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | No hay cambios para guardar | Controladores/src/controladores/M1Controller.ts | 40 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | No hay cambios para guardar | Controladores/src/controladores/M5Controller.ts | 455 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | No puede modificarse ID, creador, fecha de creación ni estado mediante CU90 | Controladores/src/controladores/M5Controller.ts | 711 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | No repitas un opcional dentro de una alternativa | Controladores/src/controladores/M2Controller.ts | 398 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | No repitas un opcional en el mismo producto | Controladores/src/controladores/M2Controller.ts | 271 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | No repitas una etapa de cobro | Controladores/src/controladores/M2Controller.ts | 779 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | No se informaron cambios de checklist | Controladores/src/controladores/M6Controller.ts | 3263 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | No se puede repetir un material en la Orden de Compra | Controladores/src/controladores/M5Controller.ts | 674 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Nombre obligatorio | Controladores/src/controladores/M6Controller.ts | 877 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Nombre y contenido del respaldo son obligatorios | Controladores/src/controladores/M5Controller.ts | 1331 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Nombre y teléfono son obligatorios para formalizar | Controladores/src/controladores/M2Controller.ts | 759 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Nombre y tipo de cliente son obligatorios | Controladores/src/controladores/M2Controller.ts | 643 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Nombre, motivo y clave de idempotencia son obligatorios | Controladores/src/controladores/M6Controller.ts | 3212 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Operación M4 desconocida | Controladores/src/controladores/M4Controller.ts | 240 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Operación comercial no soportada | Controladores/src/comercial/ServicioEscrituraComercial.ts | 120 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Orden de Trabajo inválida | Controladores/src/controladores/M6Controller.ts | 3385 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Orden de trabajo inválida | Controladores/src/controladores/M6Controller.ts | 3354 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Orden permitido: razonSocial, identificador o saldoPendiente | Controladores/src/controladores/M5Controller.ts | 527 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Ordenamiento de empleados inválido | Controladores/src/controladores/M6Controller.ts | 170 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Ordenamiento inválido | Controladores/src/controladores/M5Controller.ts | 342 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Ordenamiento inválido | Controladores/src/validaciones/solicitudes.ts | 28 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Origen de Dashboard inválido | Controladores/src/controladores/M7Controller.ts | 2186 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Origen de pago inválido | Controladores/src/controladores/M6Controller.ts | 1933 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Origen inválido | Controladores/src/controladores/M8Controller.ts | 41 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Owner o referencia ausente | Controladores/src/m9/contratosPostM9.ts | 15 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Paginación inválida | Controladores/src/controladores/M9Controller.ts | 182 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | País no válido o inactivo | Controladores/src/controladores/M5Controller.ts | 375 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Permiso no asignable | Controladores/src/controladores/M4Controller.ts | 144 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Período de proyección inválido | Controladores/src/controladores/M7Controller.ts | 923 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Período mensual inválido | Controladores/src/controladores/M7Controller.ts | 101 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Planificación de puerta inválida | Controladores/src/controladores/M2Controller.ts | 512 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Planificación inválida | Controladores/src/controladores/M6Controller.ts | 2947 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Proyecto inválido | Controladores/src/controladores/M7Controller.ts | 1436 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | REGLA requiere metadata controlada | Controladores/src/controladores/M6Controller.ts | 970 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | RUT, nombres y apellido paterno son obligatorios | Controladores/src/controladores/M6Controller.ts | 136 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Rango de fecha inválido | Controladores/src/controladores/M9Controller.ts | 183 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Región, comuna y dirección son obligatorias para identificar una Obra | Controladores/src/comercial/ServicioObraProyectoComercial.ts | 15 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Requisito de respaldo inválido | Controladores/src/controladores/M6Controller.ts | 1166 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Resultado de conciliación inválido | Controladores/src/controladores/M5Controller.ts | 1503 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Resultado de entrega inválido | Controladores/src/controladores/M6Controller.ts | 2348 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Resultado no soportado | Controladores/src/m9/seguridad.ts | 25 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Saldo inicial inválido | Controladores/src/controladores/M7Controller.ts | 345 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Secuencia inválida | Controladores/src/controladores/M9Controller.ts | 69 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Segmento comercial inválido | Controladores/src/comercial/ServicioCatalogoComercial.ts | 10 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Segmento comercial inválido | Controladores/src/controladores/M7Controller.ts | 217 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Segmento de condición inválido | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts | 109 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Segmento documental inválido | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 202 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Segmento inválido | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts | 91 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Segmento permitido: B2B o B2C | Controladores/src/validaciones/solicitudes.ts | 30 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Seguro de cesantía inválido | Controladores/src/controladores/M6Controller.ts | 666 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Selecciona al menos una medida obligatoria para la rectificación | Controladores/src/controladores/M2Controller.ts | 1063 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Selecciona la operación o al menos un movimiento | Controladores/src/controladores/M5Controller.ts | 1336 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Selecciona los materiales | Controladores/src/controladores/M2Controller.ts | 177 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Selecciona permisos | Controladores/src/controladores/M4Controller.ts | 218 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Selecciona un canal electrónico disponible | Controladores/src/controladores/M6Controller.ts | 849 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Selecciona un cliente | Controladores/src/controladores/M2Controller.ts | 1144 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Selecciona un documento tributario existente del mismo cliente | Controladores/src/controladores/M2Controller.ts | 595 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Selecciona un medio activo | Controladores/src/utilidades/pago.ts | 18 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Selecciona un medio de pago | Controladores/src/utilidades/pago.ts | 17 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Selecciona un producto activo del catálogo | Controladores/src/controladores/M2Controller.ts | 172 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Selecciona un área activa | Controladores/src/controladores/M2Controller.ts | 1000 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Selecciona una cantidad de cuotas habilitada | Controladores/src/utilidades/pago.ts | 27 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Selecciona una categoría activa | Controladores/src/utilidades/pago.ts | 21 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Selecciona una categoría de pago | Controladores/src/utilidades/pago.ts | 19 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Situación permitida: Vencida, Por vencer, Por pagar, Sin deuda o Todos | Controladores/src/controladores/M5Controller.ts | 526 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Sólo puede crearse una cuenta para un Empleado activo | Controladores/src/controladores/M4Controller.ts | 154 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Sólo se consulta tipo de cambio para USD | Controladores/src/utilidades/C_BancoCentral.ts | 16 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | TEMPORAL_M5_REGLA_MONEDA_COMPENSACION: crédito y obligación deben usar la misma moneda | Controladores/src/controladores/M5Controller.ts | 1653 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Tarea ${indice + 1} contiene campos que pertenecen a otro flujo | Controladores/src/controladores/M6Controller.ts | 3066 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Tarea ${indice + 1} inválida | Controladores/src/controladores/M6Controller.ts | 3063 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Tarea ${posicion + 1} inválida | Controladores/src/controladores/M2Controller.ts | 528 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Tarea ${posicion+1} sin nombre | Controladores/src/controladores/M6Controller.ts | 2950 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Tareas de etapa ${indice + 1} inválidas | Controladores/src/controladores/M2Controller.ts | 525 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Texto inválido | Controladores/src/controladores/M8Controller.ts | 12 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Texto inválido o demasiado largo | Controladores/src/validaciones/solicitudes.ts | 11 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Timestamp inválido | Controladores/src/m9/seguridad.ts | 61 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Timestamp sin zona horaria | Controladores/src/m9/seguridad.ts | 54 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Timestamp y zona horaria no son coherentes | Controladores/src/m9/seguridad.ts | 63 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Tipo de Orden de Compra inválido | Controladores/src/controladores/M5Controller.ts | 968 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Tipo de antecedente permitido: historial, documentos, pagos o todos | Controladores/src/controladores/M5Controller.ts | 566 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Tipo de aplicación de tarifa inválido | Controladores/src/controladores/M6Controller.ts | 916 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Tipo de cambio inválido | Controladores/src/utilidades/pago.ts | 35 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Tipo de cliente no configurado | Controladores/src/controladores/M2Controller.ts | 650 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Tipo de cliente no válido | Controladores/src/controladores/M1Controller.ts | 18 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Tipo de contacto no válido | Controladores/src/controladores/M2Controller.ts | 145 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Tipo de cómputo permitido: DIAS_CORRIDOS o DIAS_HABILES | Controladores/src/controladores/M5Controller.ts | 176 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Tipo de descuento inválido | Controladores/src/controladores/M2Controller.ts | 116 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Tipo de documento no soportado | Controladores/src/controladores/M6Controller.ts | 2303 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Tipo de evento inválido | Controladores/src/controladores/M6Controller.ts | 366 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Tipo de excepción sin OC no permitido | Controladores/src/controladores/M5Controller.ts | 929 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Tipo de exportación inválido | Controladores/src/controladores/M7Controller.ts | 2024 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Tipo de identificación fiscal no válido o inactivo | Controladores/src/controladores/M5Controller.ts | 376 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Tipo de partida de servicio no autorizado | Controladores/src/controladores/M2Controller.ts | 311 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Tipo de parámetro inválido | Controladores/src/controladores/M6Controller.ts | 994 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Tipo de proveedor permitido: Insumos/Materiales, Servicios o Ambos | Controladores/src/controladores/M5Controller.ts | 132 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Tipo de proyección inválido | Controladores/src/controladores/M7Controller.ts | 892 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Tipo de servicio es obligatorio | Controladores/src/controladores/M6Controller.ts | 2454 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Tipo inválido | Controladores/src/controladores/M8Controller.ts | 22 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Tipo y folio son obligatorios | Controladores/src/controladores/M2Controller.ts | 1363 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Todas las etapas deben pertenecer a áreas activas | Controladores/src/controladores/M2Controller.ts | 1041 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Todas las obligaciones deben pertenecer al mismo proveedor | Controladores/src/controladores/M5Controller.ts | 1653 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Umbral externo inválido | Controladores/src/controladores/M9Controller.ts | 258 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Un evento no puede ser derivado y correctivo simultáneamente | Controladores/src/controladores/M9Controller.ts | 70 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Un parámetro activo requiere valor | Controladores/src/controladores/M6Controller.ts | 1013 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Una cobertura disponible requiere precio y moneda | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts | 105 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Una cobertura no disponible o evaluable no debe informar precio | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts | 106 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Una fecha distinta de la propuesta exige justificación | Controladores/src/controladores/M5Controller.ts | 1053 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Una política configurada requiere un criterio descriptivo | Controladores/src/controladores/M6Controller.ts | 1135 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Una tarifa global no utiliza unidad | Controladores/src/controladores/M6Controller.ts | 917 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Una tarifa por unidad requiere unidad | Controladores/src/controladores/M6Controller.ts | 918 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Unidad de cobro inválida | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts | 96 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Unidad de cotización de salud inválida | Controladores/src/controladores/M6Controller.ts | 710 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Uno de los movimientos no pertenece a la operación | Controladores/src/controladores/M5Controller.ts | 1334 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Uno de los ítems comerciales no existe o está inactivo | Controladores/src/controladores/M2Controller.ts | 1324 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Usuario inválido | Controladores/src/controladores/M4Controller.ts | 18 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Versión de contrato no soportada | Controladores/src/controladores/M9Controller.ts | 62 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Vigencia inválida | Controladores/src/controladores/M8Controller.ts | 27 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Zona horaria inválida | Controladores/src/m9/seguridad.ts | 68 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Área inválida | Controladores/src/controladores/M6Controller.ts | 3384 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Área responsable inválida | Controladores/src/controladores/M6Controller.ts | 3347 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 400 | Área responsable no disponible | Controladores/src/controladores/M6Controller.ts | 3366 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 401 | Credencial no disponible | Controladores/src/controladores/M4Controller.ts | 47 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 401 | Cuenta bloqueada | Controladores/src/controladores/M4Controller.ts | 76 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 401 | Inicia sesión para continuar | Controladores/src/controladores/M4Controller.ts | 70 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 401 | La persistencia de alternativas requiere un actor autenticado | Controladores/src/controladores/M2Controller.ts | 377 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 401 | La sesión finalizó; vuelve a iniciar sesión | Controladores/src/controladores/M4Controller.ts | 74 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 401 | Los contactos de la cotización requieren un actor autenticado | Controladores/src/controladores/M2Controller.ts | 131 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 401 | Se requiere una sesión backend autenticada | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts | 57 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | Asignar permisos requiere autorización administrativa | Controladores/src/controladores/M4Controller.ts | 208 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | Cambiar a permisos del perfil requiere autorización para cambiar configuración | Controladores/src/controladores/M4Controller.ts | 196 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | Capacidad técnica insuficiente | Controladores/src/controladores/M9Controller.ts | 59 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | Contador no puede aprobar su propia reclasificación | Controladores/src/controladores/M5Controller.ts | 1707 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | Contador no puede aprobar un excedente que originó | Controladores/src/controladores/M5Controller.ts | 1016 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | Contador no puede autoaprobar su propio gasto cuando implica exceso | Controladores/src/controladores/M5Controller.ts | 1961 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | Debes cambiar tu contraseña antes de continuar | Controladores/src/controladores/M4Controller.ts | 80 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | El actor no posee el permiso comercial requerido | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts | 61 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | El empleado que realizó la rectificación no puede aprobarla | Controladores/src/controladores/M6Controller.ts | 2988 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | El pago no pertenece al caso de uso autorizado | Controladores/src/controladores/M6Controller.ts | 2040 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | La Orden de Trabajo no está asignada al empleado autenticado | Controladores/src/controladores/M6Controller.ts | 2822 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | La consulta de entregas requiere un usuario interno | Controladores/src/controladores/M6Controller.ts | 2358 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | La cuenta no está vinculada a un empleado para autoservicio documental | Controladores/src/controladores/M6Controller.ts | 2242 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | La ejecución de otro responsable requiere un encargado autorizado | Controladores/src/controladores/M6Controller.ts | 3186 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | La entrega documental manual requiere un usuario interno | Controladores/src/controladores/M6Controller.ts | 2344 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | La mantención comercial requiere un permiso M4 específico pendiente de autorización | Controladores/src/comercial/ServicioCatalogoComercial.ts | 189 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | La operación ${operacion} no tiene permiso M4 registrado | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts | 60 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | La operación comercial no posee una política M4 definida | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts | 59 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | La operación requiere configuración de Gerencia | Controladores/src/controladores/M4Controller.ts | 83 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | La operación requiere rol Administrador | Controladores/src/controladores/M4Controller.ts | 84 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | La tarea no está asignada al usuario autenticado | Controladores/src/controladores/M6Controller.ts | 2625 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | Módulo fuera del scope | Controladores/src/controladores/M9Controller.ts | 151 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | No tienes alcance para consultar Órdenes de Trabajo; solicita una asignación de empleado o un permiso de gestión | Controladores/src/controladores/M6Controller.ts | 2913 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | No tienes permiso ${p} | Controladores/src/controladores/M8Controller.ts | 16 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | No tienes permiso para aplicar descuentos | Controladores/src/controladores/C_Finanzas.ts | 197 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | No tienes permiso para consultar el análisis de origen | Controladores/src/controladores/M7Controller.ts | 2187 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | No tienes permiso para consultar el detalle solicitado | Controladores/src/controladores/M7Controller.ts | 2026 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | No tienes permiso para descargar PDF de Dashboard | Controladores/src/controladores/M7Controller.ts | 2172 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | No tienes permiso para esta operación | Controladores/src/controladores/M4Controller.ts | 85 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | No tienes permiso para exportar información del Dashboard | Controladores/src/controladores/M7Controller.ts | 2022 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | No tienes permiso para los filtros o condiciones solicitados | Controladores/src/controladores/M4Controller.ts | 86 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | Productor fuera del scope | Controladores/src/controladores/M9Controller.ts | 152 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | Quien registró o envió la rectificación no puede aprobarla | Controladores/src/controladores/M6Controller.ts | 2984 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | Reautenticación fallida | Controladores/src/controladores/M4Controller.ts | 230 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | Retirar permisos requiere autorización administrativa | Controladores/src/controladores/M4Controller.ts | 209 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | Secretaría no puede ingresar una tasa manual | Controladores/src/controladores/C_Finanzas.ts | 200 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | Sólo Gerencia o Contador pueden confirmar la imputación | Controladores/src/controladores/C_Finanzas.ts | 199 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | Sólo Gerencia o Contador pueden confirmar pagos a proveedores | Controladores/src/controladores/C_Finanzas.ts | 201 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | Sólo Gerencia o Contador pueden ejecutar esta operación | Controladores/src/controladores/C_Finanzas.ts | 202 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | Sólo Gerencia o Contador pueden ingresar una tasa manual | Controladores/src/controladores/M5Controller.ts | 1384 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | Sólo Gerencia puede ajustar costos o precio sugerido | Controladores/src/controladores/C_Finanzas.ts | 206 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | Sólo Gerencia puede confirmar un ajuste de OCS | Controladores/src/controladores/C_Finanzas.ts | 198 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | Sólo Gerencia puede resolver reasignaciones de costo | Controladores/src/controladores/C_Finanzas.ts | 203 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | Sólo el creador o un revisor autorizado puede adjuntar evidencia | Controladores/src/controladores/M6Controller.ts | 3440 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | Sólo puedes acceder a tus propios documentos de remuneración | Controladores/src/controladores/M6Controller.ts | 2244 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | Sólo un Administrador puede registrar ajustes manuales de liquidez | Controladores/src/controladores/M7Controller.ts | 1689 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | Sólo un administrador puede registrar la ejecución de otro usuario | Controladores/src/controladores/M6Controller.ts | 3185 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 403 | Sólo un encargado autorizado puede iniciar la tarea para otro responsable | Controladores/src/controladores/M6Controller.ts | 3174 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | AFP activa no encontrada | Controladores/src/controladores/M6Controller.ts | 689 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Ajuste documental no encontrado | Controladores/src/controladores/M5Controller.ts | 1573 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Ajuste posterior no encontrado | Controladores/src/controladores/M6Controller.ts | 1816 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Alternativa no encontrada en la cotización | Controladores/src/controladores/M2Controller.ts | 701 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Anticipo no encontrado | Controladores/src/controladores/M6Controller.ts | 1900 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Asignación de esquema no encontrada | Controladores/src/controladores/M6Controller.ts | 780 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Asignación de haber no encontrada | Controladores/src/controladores/M6Controller.ts | 824 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Asociación documental no encontrada | Controladores/src/controladores/M5Controller.ts | 999 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Boleta de honorarios no encontrada | Controladores/src/controladores/M6Controller.ts | 1929 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Cargo activo no encontrado | Controladores/src/controladores/M6Controller.ts | 688 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Carta comercial B2C no encontrada | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 177 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Categoría de egreso activa no encontrada | Controladores/src/controladores/M5Controller.ts | 1070 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Categoría destino activa no encontrada | Controladores/src/controladores/M5Controller.ts | 1703 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Categoría no encontrada | Controladores/src/controladores/M5Controller.ts | 1693 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Clasificación de origen no encontrada | Controladores/src/controladores/M5Controller.ts | 1699 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Cliente no encontrado | Controladores/src/controladores/M1Controller.ts | 50 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Cliente no encontrado | Controladores/src/controladores/M7Controller.ts | 1270 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Cliente no encontrado | Controladores/src/utilidades/creditoM8.ts | 13 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Comisión bancaria referenciada no encontrada | Controladores/src/controladores/M5Controller.ts | 1863 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Compensación no encontrada | Controladores/src/controladores/M5Controller.ts | 1631 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Componente no encontrado | Controladores/src/controladores/M6Controller.ts | 1671 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Concepto activo no encontrado | Controladores/src/controladores/M6Controller.ts | 809 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Concepto de deducción o aporte no encontrado | Controladores/src/controladores/M6Controller.ts | 1107 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Costo de envío no encontrado | Controladores/src/controladores/M5Controller.ts | 1877 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Cotización de contexto no encontrada | Controladores/src/controladores/M5Controller.ts | 682 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Cotización no encontrada | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 543 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Cotización no encontrada | Controladores/src/comercial/ServicioObraProyectoComercial.ts | 76 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Cotización no encontrada | Controladores/src/controladores/M2Controller.ts | 475 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Cuenta bancaria activa no encontrada | Controladores/src/controladores/M7Controller.ts | 984 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Cuenta bancaria no encontrada | Controladores/src/controladores/M7Controller.ts | 966 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Deducción no encontrada | Controladores/src/controladores/M6Controller.ts | 3513 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Diferencia documental no encontrada | Controladores/src/controladores/M5Controller.ts | 1014 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Distribución de compensación no encontrada | Controladores/src/controladores/M5Controller.ts | 1670 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Documento M5 de proveedor no encontrado | Controladores/src/controladores/M5Controller.ts | 877 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Documento de proveedor no encontrado | Controladores/src/controladores/M5Controller.ts | 1998 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Documento histórico confirmado no encontrado | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 520 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Ejecución no encontrada | Controladores/src/controladores/M6Controller.ts | 3360 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Ejecución terminada y validada no encontrada | Controladores/src/controladores/M6Controller.ts | 1211 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | El producto no está publicado o no posee una equivalencia operativa activa | Controladores/src/comercial/ServicioCatalogoComercial.ts | 76 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | El respaldo no pertenece a la operación confirmada | Controladores/src/controladores/M5Controller.ts | 1359 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Empleado no encontrado | Controladores/src/controladores/M6Controller.ts | 233 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Envío o importación no encontrado | Controladores/src/controladores/M5Controller.ts | 1835 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Esquema activo no encontrado | Controladores/src/controladores/M6Controller.ts | 761 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Esquema no encontrado | Controladores/src/controladores/M6Controller.ts | 875 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Etapa adicional no encontrada | Controladores/src/controladores/M6Controller.ts | 3218 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Etapa planificada no encontrada | Controladores/src/controladores/M6Controller.ts | 3218 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Evidencia no encontrada | Controladores/src/controladores/M6Controller.ts | 3430 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Evidencia no encontrada | Controladores/src/controladores/M9Controller.ts | 214 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Familia comercial activa no encontrada | Controladores/src/controladores/M2Controller.ts | 1078 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Familia comercial no encontrada | Controladores/src/controladores/M2Controller.ts | 835 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Ficha de Cliente de contexto no encontrada | Controladores/src/controladores/M5Controller.ts | 680 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Gasto de Caja Chica no encontrado | Controladores/src/controladores/M5Controller.ts | 1943 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Guarda primero un borrador de la plantilla | Controladores/src/controladores/M2Controller.ts | 1097 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Guía de Despacho no encontrada | Controladores/src/controladores/M2Controller.ts | 1403 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | HABER no encontrado | Controladores/src/controladores/M6Controller.ts | 958 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Imputación de origen no encontrada | Controladores/src/controladores/M5Controller.ts | 1750 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Imputación no encontrada | Controladores/src/controladores/M5Controller.ts | 1716 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Incidencia no encontrada | Controladores/src/controladores/M6Controller.ts | 3439 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Institución de salud activa no encontrada | Controladores/src/controladores/M6Controller.ts | 694 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Medio de pago no encontrado | Controladores/src/controladores/M6Controller.ts | 1161 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Moneda activa no encontrada | Controladores/src/controladores/M5Controller.ts | 679 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Moneda no encontrada | Controladores/src/controladores/M7Controller.ts | 1700 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Movimiento confirmado no encontrado | Controladores/src/controladores/M5Controller.ts | 1371 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Movimiento internacional relacionado no encontrado | Controladores/src/controladores/M5Controller.ts | 1822 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Movimiento no encontrado | Controladores/src/controladores/M5Controller.ts | 1321 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | No existe configuración HABER aplicable para la fecha | Controladores/src/controladores/M6Controller.ts | 979 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | No existe parámetro efectivo para la fecha | Controladores/src/controladores/M6Controller.ts | 1052 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | No existen remuneraciones oficiales vigentes para los filtros | Controladores/src/controladores/M6Controller.ts | 2388 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Nota de Venta no encontrada | Controladores/src/controladores/M2Controller.ts | 775 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Nota de Venta no encontrada | Controladores/src/controladores/M3Controller.ts | 73 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Obligación M5 no encontrada | Controladores/src/controladores/M5Controller.ts | 1532 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Obligación no encontrada | Controladores/src/controladores/M5Controller.ts | 1650 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Obligación referenciada no encontrada | Controladores/src/controladores/M5Controller.ts | 1862 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Obra no encontrada | Controladores/src/controladores/M6Controller.ts | 2456 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Opcional no encontrado | Controladores/src/comercial/ServicioEscrituraComercial.ts | 70 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Operación de pago no encontrada | Controladores/src/controladores/M5Controller.ts | 1152 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Orden de Trabajo de contexto no encontrada | Controladores/src/controladores/M5Controller.ts | 685 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Orden de Trabajo del flujo comercial no encontrada | Controladores/src/controladores/M6Controller.ts | 2923 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Orden de Trabajo destino no encontrada | Controladores/src/controladores/M5Controller.ts | 1741 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Orden de Trabajo no encontrada | Controladores/src/controladores/M5Controller.ts | 1091 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Orden de Trabajo no encontrada | Controladores/src/controladores/M6Controller.ts | 2935 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Orden de compra de servicios no encontrada | Controladores/src/controladores/M5Controller.ts | 649 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Pago de remuneración no encontrado | Controladores/src/controladores/M6Controller.ts | 1963 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Pago no encontrado | Controladores/src/controladores/M3Controller.ts | 68 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Pago no encontrado | Controladores/src/controladores/M6Controller.ts | 2233 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Parámetro remuneracional no encontrado | Controladores/src/controladores/M6Controller.ts | 1030 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Plantilla documental no encontrada | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 219 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Prestador de honorarios no encontrado | Controladores/src/controladores/M6Controller.ts | 2132 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Producto comercial no encontrado | Controladores/src/comercial/ServicioCatalogoComercial.ts | 176 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Producto comercial no encontrado | Controladores/src/controladores/M2Controller.ts | 909 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Proveedor no encontrado | Controladores/src/controladores/M5Controller.ts | 434 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Proyección no encontrada | Controladores/src/controladores/M7Controller.ts | 932 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Proyecto de contexto no encontrado | Controladores/src/controladores/M5Controller.ts | 684 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Proyecto destino no encontrado | Controladores/src/controladores/M5Controller.ts | 1737 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Proyecto no encontrado | Controladores/src/controladores/M5Controller.ts | 1089 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Proyecto no encontrado | Controladores/src/controladores/M7Controller.ts | 1439 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Publicación histórica confirmada no encontrada | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 507 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Rectificación no encontrada | Controladores/src/controladores/M6Controller.ts | 2994 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Regularización no encontrada | Controladores/src/controladores/M6Controller.ts | 1850 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Relación laboral no encontrada | Controladores/src/controladores/M6Controller.ts | 562 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Remuneración no encontrada | Controladores/src/controladores/M6Controller.ts | 1376 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Retrabajo no encontrado | Controladores/src/controladores/M6Controller.ts | 1264 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Saldo a favor disponible no encontrado | Controladores/src/controladores/M5Controller.ts | 1620 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Saldo inicial no encontrado | Controladores/src/controladores/M7Controller.ts | 986 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Solicitud de ajuste no encontrada | Controladores/src/controladores/M5Controller.ts | 791 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Solicitud de reasignación no encontrada | Controladores/src/controladores/M5Controller.ts | 1787 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Solicitud de reclasificación no encontrada | Controladores/src/controladores/M5Controller.ts | 1707 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Solicitud no encontrada | Controladores/src/controladores/M8Controller.ts | 23 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Tarea de fabricación no encontrada | Controladores/src/controladores/M2Controller.ts | 1014 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Tarea de producción no encontrada | Controladores/src/controladores/M6Controller.ts | 3110 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Tarea no encontrada | Controladores/src/controladores/M6Controller.ts | 2622 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Tarifa no encontrada | Controladores/src/controladores/M6Controller.ts | 931 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Tipo de documento no encontrado | Controladores/src/controladores/M5Controller.ts | 938 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Tipo de vínculo laboral activo no encontrado | Controladores/src/controladores/M6Controller.ts | 541 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Una OCS no existe | Controladores/src/controladores/M5Controller.ts | 976 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Uno o más materiales no existen | Controladores/src/controladores/M5Controller.ts | 686 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Usuario no encontrado | Controladores/src/controladores/M4Controller.ts | 39 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Usuario responsable no encontrado | Controladores/src/controladores/M6Controller.ts | 2560 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Valor externo de origen no encontrado | Controladores/src/controladores/M6Controller.ts | 1737 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Valor externo o ajuste no encontrado | Controladores/src/controladores/M6Controller.ts | 1746 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Versión no encontrada | Controladores/src/comercial/ServicioEscrituraComercial.ts | 114 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Visita no encontrada | Controladores/src/controladores/M6Controller.ts | 2495 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 404 | Área de trabajo no encontrada | Controladores/src/controladores/M6Controller.ts | 284 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | ${autorizacionCredito.resultado}: ${autorizacionCredito.motivos.join( | Controladores/src/controladores/M2Controller.ts | 627 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | AFP y previsión de salud son obligatorias para calcular la remuneración | Controladores/src/m6/calculoPrevisional.ts | 57 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Aprobación requiere evidencia | Controladores/src/controladores/M6Controller.ts | 46 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Asigna un empleado rectificador antes de registrar información | Controladores/src/controladores/M6Controller.ts | 2960 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Cada etapa requiere un área y al menos una tarea | Controladores/src/controladores/M6Controller.ts | 3025 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Cliente sin Crédito habilitado | Controladores/src/controladores/M8Controller.ts | 28 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Completa empleado, fecha y especificación técnica | Controladores/src/controladores/M6Controller.ts | 2976 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Completa las condiciones comerciales antes de consolidar | Controladores/src/controladores/M2Controller.ts | 587 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Configuración base no habilitada | Controladores/src/controladores/M4Controller.ts | 185 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Conflicto concurrente al registrar el costo | Controladores/src/controladores/M5Controller.ts | 1867 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Conflicto concurrente al revertir la compensación | Controladores/src/controladores/M5Controller.ts | 1678 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Conflicto concurrente: el ajuste no fue anulado | Controladores/src/controladores/M5Controller.ts | 1599 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Conflicto concurrente: la reversa no fue registrada | Controladores/src/controladores/M5Controller.ts | 1497 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Conflicto concurrente: vuelve a revisar el saldo disponible | Controladores/src/controladores/M5Controller.ts | 1661 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Conflicto concurrente: vuelve a revisar la obligación | Controladores/src/controladores/M5Controller.ts | 1565 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Conflicto concurrente: vuelve a revisar los saldos | Controladores/src/controladores/M5Controller.ts | 1452 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Continuidad administrativa insuficiente: debe quedar otra cuenta Activa habilitada | Controladores/src/controladores/M4Controller.ts | 174 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Cotización no emitida/vigente o ya consolidada | Controladores/src/controladores/M2Controller.ts | 582 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Crédito sólo aplica a Cliente B2B | Controladores/src/utilidades/creditoM8.ts | 15 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Cuenta no habilitada para Administrador | Controladores/src/controladores/M4Controller.ts | 228 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Cuenta no habilitada para el procedimiento | Controladores/src/controladores/M4Controller.ts | 236 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Debes cerrar las tareas anteriores antes de ejecutar esta etapa | Controladores/src/controladores/M6Controller.ts | 3187 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Debes cerrar las tareas anteriores antes de iniciar esta etapa | Controladores/src/controladores/M6Controller.ts | 3174 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Documento definitivo no disponible para generar obligación | Controladores/src/controladores/M5Controller.ts | 1121 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El Cliente ya tiene Crédito habilitado | Controladores/src/controladores/M8Controller.ts | 24 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El Empleado ya tiene un Usuario asociado | Controladores/src/controladores/M4Controller.ts | 155 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El PDF almacenado no supera la verificación de integridad | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 294 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El PDF histórico no supera la verificación SHA-256 | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 525 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El Proyecto ya fue formalizado con otra Obra; requiere control de cambios | Controladores/src/comercial/ServicioObraProyectoComercial.ts | 95 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El RUT ya está asociado a otro cliente | Controladores/src/controladores/M2Controller.ts | 765 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El ajuste posterior exige una remuneración oficial CERRADA | Controladores/src/controladores/M6Controller.ts | 1795 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El ajuste ya fue postergado o cambió concurrentemente | Controladores/src/controladores/M6Controller.ts | 1827 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El anticipo está PENDIENTE DE VALORIZACIÓN | Controladores/src/controladores/M6Controller.ts | 1922 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El anticipo no posee un pago confirmado para emitir comprobante oficial | Controladores/src/controladores/M6Controller.ts | 2264 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El aprobador debe ser distinto del solicitante | Controladores/src/controladores/M6Controller.ts | 1638 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El borrador cambió antes de publicarse; vuelve a cargarlo | Controladores/src/controladores/M2Controller.ts | 1099 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El borrador debe actualizar sus materiales a costos locales CLP | Controladores/src/controladores/M2Controller.ts | 1275 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El borrador fue actualizado por otra sesión; recarga antes de guardar | Controladores/src/controladores/M2Controller.ts | 1212 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El borrador fue modificado por otra persona; vuelve a cargarlo | Controladores/src/controladores/M2Controller.ts | 1087 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El borrador no tiene un costeo completo; requiere la edición ampliada de M2 | Controladores/src/controladores/M2Controller.ts | 1273 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El canal documental no posee un correo disponible | Controladores/src/controladores/M6Controller.ts | 2331 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El catálogo seleccionado ya no está disponible | Controladores/src/controladores/M6Controller.ts | 720 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El cliente no corresponde al segmento comercial seleccionado | Controladores/src/controladores/M2Controller.ts | 1164 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El cliente no corresponde al segmento persistido de la Cotización | Controladores/src/controladores/M2Controller.ts | 671 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El cliente no está disponible para formalización B2C | Controladores/src/controladores/M2Controller.ts | 762 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El cliente ya está ${estado} | Controladores/src/controladores/M1Controller.ts | 51 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El cliente ya existe | Controladores/src/controladores/M2Controller.ts | 651 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El componente aún está pendiente de valorización | Controladores/src/controladores/M6Controller.ts | 1675 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El componente cambió concurrentemente | Controladores/src/controladores/M6Controller.ts | 1678 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El componente ya fue resuelto | Controladores/src/controladores/M6Controller.ts | 1674 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El contacto fue modificado por otra sesión | Controladores/src/controladores/M2Controller.ts | 149 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El contacto no pertenece a esta cotización | Controladores/src/controladores/M2Controller.ts | 148 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El creador no puede aprobar ni rechazar su propia incidencia | Controladores/src/controladores/M6Controller.ts | 44 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El código del umbral está ocupado por una configuración incompatible | Controladores/src/controladores/M7Controller.ts | 1129 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El default por cargo se superpone con otra vigencia del mismo esquema | Controladores/src/controladores/M6Controller.ts | 898 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El destino cerró y requiere una nueva solicitud excepcional | Controladores/src/controladores/M5Controller.ts | 1795 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El detalle postpago sólo está disponible para operaciones confirmadas | Controladores/src/controladores/M5Controller.ts | 1285 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El documento debe estar confirmado | Controladores/src/controladores/M5Controller.ts | 1703 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El documento ya fue confirmado | Controladores/src/controladores/M5Controller.ts | 971 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El documento ya tiene obligación | Controladores/src/controladores/M5Controller.ts | 1122 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El ejecutor debe estar activo en el área de la tarea | Controladores/src/controladores/M6Controller.ts | 3174 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El ejecutor debe ser un empleado activo del área de la tarea | Controladores/src/controladores/M6Controller.ts | 3186 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El empleado debe estar activo y asignado actualmente al área Terreno | Controladores/src/controladores/M6Controller.ts | 2936 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El empleado debe estar activo y pertenecer actualmente al área de la tarea | Controladores/src/controladores/M6Controller.ts | 3145 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El empleado no es exigible en el período | Controladores/src/controladores/M6Controller.ts | 1567 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El empleado no posee consentimiento y canal documental vigentes | Controladores/src/controladores/M6Controller.ts | 2329 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El empleado no tiene correo corporativo | Controladores/src/controladores/M6Controller.ts | 851 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El empleado no tiene correo particular | Controladores/src/controladores/M6Controller.ts | 850 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El empleado ya pertenece a esta área | Controladores/src/controladores/M6Controller.ts | 344 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El empleado ya tiene una relación laboral vigente o cambió concurrentemente | Controladores/src/controladores/M6Controller.ts | 552 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El envío cambió concurrentemente | Controladores/src/controladores/M5Controller.ts | 1904 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El envío debe estar En revisión para cerrarse | Controladores/src/controladores/M5Controller.ts | 1911 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El envío no está editable | Controladores/src/controladores/M5Controller.ts | 1856 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El envío no tiene costos consolidados | Controladores/src/controladores/M5Controller.ts | 1912 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El excedente no está pendiente | Controladores/src/controladores/M5Controller.ts | 1015 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El fondo del mes debe configurarse antes de registrar gastos | Controladores/src/controladores/M5Controller.ts | 1952 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El fondo histórico del gasto no existe | Controladores/src/controladores/M5Controller.ts | 1961 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El fondo mensual cambió concurrentemente | Controladores/src/controladores/M5Controller.ts | 1947 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El gasto cambió concurrentemente | Controladores/src/controladores/M5Controller.ts | 1961 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El gasto requiere respaldo antes de aprobarse | Controladores/src/controladores/M5Controller.ts | 1961 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El gasto ya fue resuelto | Controladores/src/controladores/M5Controller.ts | 1957 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El levantamiento fue corregido concurrentemente; vuelve a intentarlo | Controladores/src/controladores/M6Controller.ts | 2772 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El levantamiento fue modificado concurrentemente; vuelve a intentarlo | Controladores/src/controladores/M6Controller.ts | 2719 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El medio de pago no tiene configuración M6 válida | Controladores/src/controladores/M6Controller.ts | 1952 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El monto preparado no coincide con el saldo económico pendiente del origen | Controladores/src/controladores/M6Controller.ts | 2011 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El monto supera la clasificación vigente | Controladores/src/controladores/M5Controller.ts | 1703 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El monto supera la imputación vigente disponible | Controladores/src/controladores/M5Controller.ts | 1769 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El movimiento cambió concurrentemente; vuelve a revisar el pago | Controladores/src/controladores/M5Controller.ts | 1466 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El movimiento no conserva efecto vigente anulable | Controladores/src/controladores/M5Controller.ts | 1461 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El opcional fue modificado por otro usuario | Controladores/src/comercial/ServicioEscrituraComercial.ts | 72 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El pago cambió concurrentemente | Controladores/src/controladores/M6Controller.ts | 2013 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El pago no está PREPARADO | Controladores/src/controladores/M6Controller.ts | 2004 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El pago no está disponible para conciliación | Controladores/src/controladores/M3Controller.ts | 160 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El pago no está disponible para reversión | Controladores/src/controladores/M3Controller.ts | 115 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El pago no tiene todos los antecedentes obligatorios para generar el comprobante | Controladores/src/controladores/M3Controller.ts | 152 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El pago tiene una reversión previa y no puede anularse | Controladores/src/controladores/M3Controller.ts | 103 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El pago ya está anulado | Controladores/src/controladores/M3Controller.ts | 102 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El parámetro cambió concurrentemente | Controladores/src/controladores/M7Controller.ts | 1746 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El parámetro tributario vigente no tiene el código, unidad o valor esperado | Controladores/src/controladores/M6Controller.ts | 2175 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El período cambió concurrentemente | Controladores/src/controladores/M6Controller.ts | 1605 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El período global está CERRADO | Controladores/src/controladores/M6Controller.ts | 1388 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El precio fue modificado por otro usuario | Controladores/src/comercial/ServicioEscrituraComercial.ts | 47 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El precio no corresponde al producto seleccionado | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 338 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El producto ${producto.codigo_comercial} · ${producto.nombre_comercial} requiere una plantilla de fabricación publicada | Controladores/src/controladores/M2Controller.ts | 493 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El producto cambió concurrentemente o el código ya está en uso | Controladores/src/controladores/M2Controller.ts | 919 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El producto cambió mientras lo editabas; vuelve a cargarlo | Controladores/src/controladores/M2Controller.ts | 915 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El producto cambió mientras se publicaba; vuelve a cargarlo | Controladores/src/controladores/M2Controller.ts | 963 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El producto no tiene un precio comercial vigente para el segmento y moneda seleccionados | Controladores/src/controladores/M2Controller.ts | 259 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El producto o su versión comercial ya no están publicados | Controladores/src/controladores/M2Controller.ts | 253 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El producto terminado no existe o no está activo | Controladores/src/controladores/M2Controller.ts | 942 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El producto ya está ${estado.toLowerCase()} | Controladores/src/controladores/M2Controller.ts | 926 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El proveedor debe estar Activo para compensar | Controladores/src/controladores/M5Controller.ts | 1619 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El proveedor no está habilitado | Controladores/src/controladores/M5Controller.ts | 1124 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El proveedor no está habilitado operacionalmente | Controladores/src/controladores/M5Controller.ts | 937 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El proveedor no está habilitado operacionalmente para registrar ajustes | Controladores/src/controladores/M5Controller.ts | 1535 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El proveedor no está habilitado para iniciar pagos | Controladores/src/controladores/M5Controller.ts | 1265 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El proveedor no tiene condición de pago vigente | Controladores/src/controladores/M5Controller.ts | 1043 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El proveedor no tiene obligaciones pendientes | Controladores/src/controladores/M5Controller.ts | 1266 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El proveedor propuesto ya no está Activo | Controladores/src/controladores/M5Controller.ts | 801 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El proveedor ya no está habilitado | Controladores/src/controladores/M5Controller.ts | 1399 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El proyecto no está activo | Controladores/src/controladores/M5Controller.ts | 1090 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El proyecto seleccionado no existe o no está activo | Controladores/src/controladores/M2Controller.ts | 1326 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El registro de Terreno o Inventario ya está vinculado a otra ficha comercial | Controladores/src/controladores/M2Controller.ts | 951 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El registro no existe o fue modificado por otro usuario | Controladores/src/comercial/ServicioEscrituraComercial.ts | 127 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El responsable debe estar activo en el área de la tarea | Controladores/src/controladores/M6Controller.ts | 3219 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El retrabajo ya tiene una decisión remuneracional incompatible | Controladores/src/controladores/M6Controller.ts | 1271 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El régimen de salud ${entrada.salud.nombre} no tiene una regla previsional configurada | Controladores/src/m6/calculoPrevisional.ts | 80 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El saldo inicial ya existe o cambió concurrentemente | Controladores/src/controladores/M7Controller.ts | 996 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El segmento persistido del borrador no puede sustituirse silenciosamente | Controladores/src/controladores/M2Controller.ts | 1222 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El servicio no está activo | Controladores/src/comercial/ServicioEscrituraComercial.ts | 45 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El servicio no tiene un precio B2B vigente para la moneda seleccionada | Controladores/src/controladores/M2Controller.ts | 315 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El tipo de relación laboral no está resuelto de forma única para el período | Controladores/src/m6/calculoPrevisional.ts | 104 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El tipo de vínculo laboral no permite resolver el Seguro de Cesantía | Controladores/src/m6/calculoPrevisional.ts | 118 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El tramo se superpone con otro del mismo conjunto | Controladores/src/controladores/M6Controller.ts | 1077 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El umbral cambió concurrentemente | Controladores/src/controladores/M7Controller.ts | 1143 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El umbral de margen efectivo tiene una configuración inválida | Controladores/src/controladores/M7Controller.ts | 1106 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El usuario no está asignado a la tarea histórica | Controladores/src/controladores/M6Controller.ts | 3185 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El vencimiento sólo se determina para un documento definitivo en preparación | Controladores/src/controladores/M5Controller.ts | 1041 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El área seleccionada no está activa | Controladores/src/controladores/M6Controller.ts | 3213 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | El ítem comercial no existe o no está activo | Controladores/src/controladores/M2Controller.ts | 941 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Esta configuración base no admite permisos particulares | Controladores/src/controladores/M4Controller.ts | 201 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Evento fuera de orden | Controladores/src/controladores/M9Controller.ts | 77 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Existe excedente; elige devolución o saldo a favor antes de confirmar | Controladores/src/controladores/M3Controller.ts | 53 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Existe más de un conjunto tributario efectivo para la fecha | Controladores/src/controladores/M6Controller.ts | 1060 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Existe más de un límite global vigente | Controladores/src/utilidades/creditoM8.ts | 34 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Existe más de un umbral de margen efectivo para la fecha | Controladores/src/controladores/M7Controller.ts | 1103 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Existe más de una tasa de retención/PPM vigente para la fecha de emisión | Controladores/src/controladores/M6Controller.ts | 2172 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Existe un excedente sin aprobación | Controladores/src/controladores/M5Controller.ts | 1128 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Existe un responsable que ya no está activo en el área planificada | Controladores/src/controladores/M6Controller.ts | 3026 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Existen Obras parecidas. Revisa y confirma expresamente que se trata de una ubicación distinta | Controladores/src/comercial/ServicioObraProyectoComercial.ts | 55 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Existen costos sin equivalente confiable para el cierre | Controladores/src/controladores/M5Controller.ts | 1913 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Existen diferencias o excedentes pendientes vinculados al envío | Controladores/src/controladores/M5Controller.ts | 1917 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Existen documentos o validaciones relevantes todavía en preparación | Controladores/src/controladores/M5Controller.ts | 1921 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Existen ejecuciones pendientes de validación | Controladores/src/controladores/M6Controller.ts | 3227 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Existen etapas adicionales sin tareas productivas | Controladores/src/controladores/M6Controller.ts | 3227 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Existen incidencias productivas bloqueantes | Controladores/src/controladores/M6Controller.ts | 3227 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Falta configuración previsional única para ${codigo} en ${fechaClave(entrada.fechaInicio)} | Controladores/src/m6/calculoPrevisional.ts | 44 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Falta determinar vencimiento | Controladores/src/controladores/M5Controller.ts | 1129 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Falta la fecha efectiva de pago | Controladores/src/controladores/M5Controller.ts | 1398 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Falta resolver la tasa de un movimiento en moneda extranjera | Controladores/src/controladores/M5Controller.ts | 1408 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Faltan medidas obligatorias: ${faltantes.join( | Controladores/src/controladores/M6Controller.ts | 2977 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Hay identidades heredadas duplicadas; revisa el cliente antes de continuar | Controladores/src/controladores/M2Controller.ts | 1157 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Identidad lógica duplicada con contenido distinto | Controladores/src/controladores/M9Controller.ts | 107 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La Cotización USD no conserva un tipo de cambio histórico válido | Controladores/src/controladores/M2Controller.ts | 443 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La Cotización contiene productos comerciales incompletos | Controladores/src/controladores/M2Controller.ts | 674 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La Cotización debe estar en elaboración | Controladores/src/controladores/M2Controller.ts | 657 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La Cotización está incompleta | Controladores/src/controladores/M2Controller.ts | 668 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La Cotización está vencida; no se puede aceptar | Controladores/src/controladores/M2Controller.ts | 612 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La Cotización fue modificada por otra sesión | Controladores/src/comercial/ServicioObraProyectoComercial.ts | 78 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La Cotización no está disponible para aceptación | Controladores/src/controladores/M2Controller.ts | 610 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La Cotización no está vencida | Controladores/src/controladores/M2Controller.ts | 749 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La Cotización no pertenece al Cliente indicado | Controladores/src/controladores/M5Controller.ts | 683 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La Cotización no pertenece al segmento B2B | Controladores/src/controladores/M2Controller.ts | 611 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La Cotización no pertenece al segmento B2C | Controladores/src/controladores/M2Controller.ts | 584 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La Cotización ya no está disponible o no pertenece al cliente | Controladores/src/controladores/M2Controller.ts | 764 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La Guía de Despacho ya no permite modificaciones | Controladores/src/controladores/M2Controller.ts | 1404 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La Nota de Crédito tiene saldo a favor utilizado; primero deben revertirse sus compensaciones | Controladores/src/controladores/M5Controller.ts | 1589 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La Nota de Venta no está habilitada para recibir pagos | Controladores/src/utilidades/pago.ts | 14 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La OCS cambió y ya no está disponible | Controladores/src/controladores/M5Controller.ts | 1139 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La OCS no está disponible o no corresponde al proveedor | Controladores/src/controladores/M5Controller.ts | 978 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La OCS no tiene efectos financieros y debe modificarse mediante CU90 | Controladores/src/controladores/M5Controller.ts | 777 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La OCS no tiene moneda verificable y no puede compararse de forma segura | Controladores/src/controladores/M5Controller.ts | 979 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La OCS tiene efectos financieros y no puede anularse directamente; utiliza el ajuste trazable cuando corresponda | Controladores/src/controladores/M5Controller.ts | 817 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La OCS tiene un excedente pendiente de aprobación y no puede cerrarse | Controladores/src/controladores/M5Controller.ts | 832 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La OCS ya tiene efectos financieros; debe utilizarse el flujo de ajuste CU91 | Controladores/src/controladores/M5Controller.ts | 716 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La OT comercial todavía no está liberada para producción | Controladores/src/controladores/M6Controller.ts | 3112 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La OT debe estar liberada y abierta para agregar etapas | Controladores/src/controladores/M6Controller.ts | 3213 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La OT debe estar liberada y abierta para agregar tareas | Controladores/src/controladores/M6Controller.ts | 3218 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La OT debe estar liberada y sin correcciones técnicas pendientes | Controladores/src/controladores/M6Controller.ts | 3227 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La OT fue liberada concurrentemente | Controladores/src/controladores/M6Controller.ts | 3028 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La OT no cuenta con liberación técnica | Controladores/src/controladores/M6Controller.ts | 3227 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La OT no tiene rectificación registrada | Controladores/src/controladores/M6Controller.ts | 2976 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La OT no tiene tareas ejecutables | Controladores/src/controladores/M6Controller.ts | 3227 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La OT no tiene una revisión técnica aprobada vigente | Controladores/src/controladores/M6Controller.ts | 3218 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La OT requiere rectificación aprobada y liberación técnica antes de generar tareas productivas | Controladores/src/controladores/M6Controller.ts | 3078 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La OT requiere una versión vigente aprobada antes de liberarse | Controladores/src/controladores/M6Controller.ts | 3024 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La Obra no está disponible para nuevas vinculaciones | Controladores/src/comercial/ServicioObraProyectoComercial.ts | 80 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La Obra pertenece a otro cliente; requiere revisión explícita | Controladores/src/comercial/ServicioObraProyectoComercial.ts | 82 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La Obra seleccionada no admite nuevas vinculaciones | Controladores/src/controladores/M2Controller.ts | 110 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La Orden de Compra ya está asociada al envío | Controladores/src/controladores/M5Controller.ts | 1856 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La Orden de Trabajo debe estar liberada | Controladores/src/controladores/M6Controller.ts | 3113 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La Orden de Trabajo debe estar liberada para generar tareas de producción | Controladores/src/controladores/M6Controller.ts | 3079 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La Orden de Trabajo fue generada concurrentemente; vuelve a consultar | Controladores/src/controladores/M6Controller.ts | 2801 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La Orden de Trabajo fue liberada o modificada concurrentemente | Controladores/src/controladores/M6Controller.ts | 3051 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La Orden de Trabajo no pertenece al levantamiento indicado | Controladores/src/controladores/M6Controller.ts | 3044 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La Orden de Trabajo no tiene una especificación asociada | Controladores/src/controladores/M6Controller.ts | 3081 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La Orden de Trabajo requiere una medida vigente antes de liberarse | Controladores/src/controladores/M6Controller.ts | 3040 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La Orden de Trabajo ya no admite ajustes técnicos antes de su liberación | Controladores/src/controladores/M6Controller.ts | 2733 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La aceptación requiere un PDF documental confirmado | Controladores/src/controladores/M2Controller.ts | 719 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La aceptación requiere una cotización B2C | Controladores/src/controladores/M2Controller.ts | 717 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La aceptación se encuentra en proceso | Controladores/src/controladores/M2Controller.ts | 715 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La alternativa aceptada debe corresponder exactamente a una partida física ya emitida; requiere rectificación comercial | Controladores/src/controladores/M2Controller.ts | 725 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La alternativa no está disponible para selección | Controladores/src/controladores/M2Controller.ts | 689 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La alternativa no pertenece al borrador actual | Controladores/src/controladores/M2Controller.ts | 409 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La alternativa seleccionada no está disponible | Controladores/src/controladores/M2Controller.ts | 723 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La alternativa ya fue decidida o cambió de revisión | Controladores/src/controladores/M2Controller.ts | 702 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La asignación cambió concurrentemente; vuelve a intentarlo | Controladores/src/controladores/M6Controller.ts | 351 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La asignación de esquema fue finalizada o modificada concurrentemente | Controladores/src/controladores/M6Controller.ts | 784 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La asignación de esquema ya fue finalizada | Controladores/src/controladores/M6Controller.ts | 781 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La asignación de haber fue finalizada o modificada concurrentemente | Controladores/src/controladores/M6Controller.ts | 828 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La asignación de haber ya fue finalizada | Controladores/src/controladores/M6Controller.ts | 825 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La asignación del haber se superpone con otra vigencia | Controladores/src/controladores/M6Controller.ts | 812 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La asignación se superpone con otra vigencia del mismo esquema | Controladores/src/controladores/M6Controller.ts | 768 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La asociación documental no está completa | Controladores/src/controladores/M5Controller.ts | 1126 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La boleta cambió concurrentemente | Controladores/src/controladores/M6Controller.ts | 2151 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La boleta no está CONFIRMADA con antecedentes económicos coherentes | Controladores/src/controladores/M6Controller.ts | 1930 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La cantidad de ${producto.nombre_comercial} debe ser un entero positivo para generar sus OT | Controladores/src/controladores/M2Controller.ts | 490 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La carta debe publicar modelos en una sola moneda | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 344 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La carta fue modificada durante la publicación | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 362 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La carta fue modificada por otra sesión | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 272 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La carta histórica no supera la verificación SHA-256 | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 511 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La carta requiere al menos un modelo comercial | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 320 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La carta requiere condiciones comerciales publicadas | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 324 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La carta requiere una plantilla CARTA_B2C publicada | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 323 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La clasificación no está completa | Controladores/src/controladores/M5Controller.ts | 1131 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La clasificación original cambió y ya no tiene monto suficiente | Controladores/src/controladores/M5Controller.ts | 1707 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La clave de idempotencia pertenece a otra cotización | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 399 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La clave de idempotencia pertenece a otra operación | Controladores/src/comercial/ServicioEscrituraComercial.ts | 26 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La clave de idempotencia pertenece a otra publicación | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 312 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La clave de idempotencia ya fue utilizada | Controladores/src/controladores/M6Controller.ts | 3213 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La clave pertenece a otra operación | Controladores/src/controladores/M2Controller.ts | 715 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La cobertura de instalación es inconsistente | Controladores/src/controladores/M2Controller.ts | 675 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La comisión bancaria sólo aplica a un pago internacional | Controladores/src/controladores/M5Controller.ts | 1820 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La compensación supera el saldo a favor disponible | Controladores/src/controladores/M5Controller.ts | 1652 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La compensación supera el saldo de una obligación | Controladores/src/controladores/M5Controller.ts | 1653 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La condición comercial seleccionada no está publicada o vigente | Controladores/src/controladores/M2Controller.ts | 358 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La configuración del HABER se superpone con otra vigencia equivalente | Controladores/src/controladores/M6Controller.ts | 972 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La configuración del aporte previsional del empleador está incompleta para el período | Controladores/src/m6/calculoPrevisional.ts | 125 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La configuración histórica del umbral es ambigua | Controladores/src/controladores/M7Controller.ts | 1133 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La configuración se superpone con otra vigencia equivalente | Controladores/src/controladores/M6Controller.ts | 923 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La consolidación exige cliente B2C activo y formalizado | Controladores/src/controladores/M2Controller.ts | 586 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La cotización B2B requiere un cliente formal con RUT | Controladores/src/controladores/M2Controller.ts | 1165 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La cotización cambió durante la emisión | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 416 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La cotización debe estar emitida antes de aceptar una alternativa | Controladores/src/controladores/M2Controller.ts | 718 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La cotización fue modificada por otra sesión | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 407 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La cotización no posee un grupo de alternativas abierto | Controladores/src/controladores/M2Controller.ts | 686 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La cotización no posee un segmento documental válido | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 544 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La cotización no puede emitirse: falta ${snapshot.camposPendientes.join( | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 403 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La cotización pactada de Isapre no está configurada de forma única para el período | Controladores/src/m6/calculoPrevisional.ts | 88 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La cuenta administrativa original está protegida | Controladores/src/controladores/M4Controller.ts | 171 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La cuenta bancaria ya existe o cambió concurrentemente | Controladores/src/controladores/M7Controller.ts | 976 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La cuenta no es Administrador | Controladores/src/controladores/M4Controller.ts | 233 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La cuenta no está Activa | Controladores/src/controladores/M4Controller.ts | 180 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La cuenta no tiene bloqueo persistente | Controladores/src/controladores/M4Controller.ts | 237 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La cuenta raíz Midas no puede modificarse | Controladores/src/controladores/M4Controller.ts | 179 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La cuenta seleccionada no está vinculada a un empleado | Controladores/src/controladores/M6Controller.ts | 3143 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La deducción fue finalizada o modificada concurrentemente | Controladores/src/controladores/M6Controller.ts | 3517 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La deducción se superpone con otra vigencia | Controladores/src/controladores/M6Controller.ts | 3503 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La deducción ya fue finalizada | Controladores/src/controladores/M6Controller.ts | 3514 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La ejecución no está terminada y validada productivamente | Controladores/src/controladores/M6Controller.ts | 1219 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La ejecución no existe, no está terminada o ya fue revisada | Controladores/src/controladores/M6Controller.ts | 3204 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La ejecución no pertenece a la orden de trabajo y cliente seleccionados | Controladores/src/controladores/M6Controller.ts | 3363 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La ejecución no tiene tratamiento remuneracional | Controladores/src/controladores/M6Controller.ts | 1269 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La emisión B2B requiere exactamente un contacto principal propio de la cotización | Controladores/src/controladores/M2Controller.ts | 673 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La emisión B2B requiere un cliente formal con RUT | Controladores/src/controladores/M2Controller.ts | 672 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La emisión definitiva requiere revisión, motivo y clave de idempotencia | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 446 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La emisión requiere una plantilla documental publicada | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 404 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La exclusión del Seguro de Cesantía requiere fundamento | Controladores/src/m6/calculoPrevisional.ts | 107 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La familia cambió mientras la editabas; vuelve a cargarla | Controladores/src/controladores/M2Controller.ts | 841 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La familia debe estar activa para publicar | Controladores/src/controladores/M2Controller.ts | 959 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La familia ya está ${estado.toLowerCase()} | Controladores/src/controladores/M2Controller.ts | 853 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La fuente financiera ya fue vinculada a un envío | Controladores/src/controladores/M5Controller.ts | 1867 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La identidad fiscal resultante ya pertenece a otro proveedor | Controladores/src/controladores/M5Controller.ts | 469 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La imputación cambió concurrentemente | Controladores/src/controladores/M5Controller.ts | 1779 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La imputación de origen ya no está confirmada | Controladores/src/controladores/M5Controller.ts | 1752 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La imputación debe estar confirmada | Controladores/src/controladores/M5Controller.ts | 1718 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La imputación no está confirmada | Controladores/src/controladores/M5Controller.ts | 1132 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La imputación original cambió y no tiene monto suficiente | Controladores/src/controladores/M5Controller.ts | 1791 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La incidencia cambió concurrentemente | Controladores/src/controladores/M6Controller.ts | 3480 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La incidencia cambió concurrentemente o la transición no es válida | Controladores/src/controladores/M6Controller.ts | 3468 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La incidencia requiere categoría estructurada antes de revisión | Controladores/src/controladores/M6Controller.ts | 45 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La incidencia ya fue revisada | Controladores/src/controladores/M6Controller.ts | 43 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La instalación no está disponible para la ubicación seleccionada | Controladores/src/controladores/M2Controller.ts | 342 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La integración OCI aún no puede validarse | Controladores/src/controladores/M5Controller.ts | 1127 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La integridad previa al almacenamiento no coincide | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 281 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La liquidación sólo se deriva de una remuneración CERRADA | Controladores/src/controladores/M6Controller.ts | 1591 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La medida vigente del levantamiento no pertenece a la puerta asociada | Controladores/src/controladores/M6Controller.ts | 2636 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La moneda del documento no coincide con la OCS | Controladores/src/controladores/M5Controller.ts | 980 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La moneda local CLP no está disponible para costear materiales | Controladores/src/controladores/M2Controller.ts | 1168 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La nueva versión debe conservar su alcance geográfico | Controladores/src/comercial/ServicioEscrituraComercial.ts | 93 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La nueva versión no corresponde al mismo producto, segmento y moneda | Controladores/src/comercial/ServicioEscrituraComercial.ts | 55 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La obligación no es elegible para este proveedor | Controladores/src/controladores/M5Controller.ts | 1300 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La operación cambió concurrentemente y no fue anulada | Controladores/src/controladores/M5Controller.ts | 1483 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La operación de pago debe estar confirmada | Controladores/src/controladores/M5Controller.ts | 1817 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La operación debe estar confirmada | Controladores/src/controladores/M5Controller.ts | 1369 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La operación debe estar preparada antes de confirmar | Controladores/src/controladores/M5Controller.ts | 1447 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La operación idempotente se encuentra en proceso | Controladores/src/comercial/ServicioEscrituraComercial.ts | 28 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La operación no contiene movimientos anulables | Controladores/src/controladores/M5Controller.ts | 1476 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La operación requiere al menos un movimiento | Controladores/src/controladores/M5Controller.ts | 1400 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La operación requiere respaldo | Controladores/src/controladores/M5Controller.ts | 1402 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La operación supera el saldo actual de una obligación | Controladores/src/controladores/M5Controller.ts | 1411 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La operación ya no admite cambios | Controladores/src/controladores/M5Controller.ts | 1385 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La operación ya no está disponible | Controladores/src/controladores/M5Controller.ts | 1397 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La partida presupuestaria cambió concurrentemente; vuelve a cargarla | Controladores/src/controladores/M7Controller.ts | 942 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La planificación actual no contiene tareas válidas | Controladores/src/controladores/M6Controller.ts | 2977 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La planificación aprobada contiene una tarea sin nombre | Controladores/src/controladores/M6Controller.ts | 3025 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La planificación aprobada contiene áreas inactivas | Controladores/src/controladores/M6Controller.ts | 3025 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La planificación contiene un área inactiva o inexistente | Controladores/src/controladores/M2Controller.ts | 541 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La planificación contiene áreas inactivas | Controladores/src/controladores/M6Controller.ts | 2951 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La plantilla cambió o no está en borrador | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 248 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La plantilla de ${esperada.producto}, unidad ${numeroUnidad}, cambió; vuelve a abrir la planificación | Controladores/src/controladores/M2Controller.ts | 518 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La plantilla fue modificada por otra sesión | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 220 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La plantilla no posee contenido publicable | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 246 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La plantilla requiere título y secciones antes de publicarse | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 250 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La plantilla vigente de ${producto.nombre_comercial} no contiene etapas | Controladores/src/controladores/M2Controller.ts | 498 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La política se superpone con otra vigencia | Controladores/src/controladores/M6Controller.ts | 1139 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La posición ya está ocupada; use una posición posterior sin reordenar etapas existentes | Controladores/src/controladores/M6Controller.ts | 3213 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La reactivación requiere cuenta Inactiva y Empleado activo | Controladores/src/controladores/M4Controller.ts | 182 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La reapertura cambió concurrentemente | Controladores/src/controladores/M6Controller.ts | 1641 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La reapertura de un período global cerrado está pendiente de definición | Controladores/src/controladores/M6Controller.ts | 1622 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La rectificación cambió; recarga antes de enviar | Controladores/src/controladores/M6Controller.ts | 2976 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La rectificación debe estar en proceso antes de enviarse | Controladores/src/controladores/M6Controller.ts | 2976 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La rectificación enviada ya no admite reasignación silenciosa | Controladores/src/controladores/M6Controller.ts | 2937 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La rectificación fue modificada concurrentemente | Controladores/src/controladores/M6Controller.ts | 2967 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La rectificación fue modificada por otro usuario; recarga la ficha | Controladores/src/controladores/M6Controller.ts | 2960 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La rectificación fue revisada concurrentemente | Controladores/src/controladores/M6Controller.ts | 2998 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La rectificación no está pendiente de aprobación técnica | Controladores/src/controladores/M6Controller.ts | 2996 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La rectificación no está pendiente de revisión | Controladores/src/controladores/M6Controller.ts | 3005 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La rectificación técnica vigente no está aprobada | Controladores/src/controladores/M6Controller.ts | 3227 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La regularización no está editable | Controladores/src/controladores/M6Controller.ts | 1862 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La regularización no puede cerrarse | Controladores/src/controladores/M6Controller.ts | 1870 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La regularización pagada es inmutable | Controladores/src/controladores/M6Controller.ts | 1860 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La relación laboral afecta el período de remuneración cerrado ${afectados.anio}-${String(afectados.mes).padStart(2,  | Controladores/src/controladores/M6Controller.ts | 527 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La relación laboral cambió concurrentemente | Controladores/src/controladores/M6Controller.ts | 588 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La remuneración cambió concurrentemente | Controladores/src/controladores/M6Controller.ts | 1581 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La remuneración cerrada no pagada debe corregirse por CU182 o justificar su tratamiento posterior | Controladores/src/controladores/M6Controller.ts | 1797 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La remuneración del período ya está CERRADA | Controladores/src/controladores/M6Controller.ts | 1887 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La remuneración mantiene bloqueos de cálculo | Controladores/src/controladores/M6Controller.ts | 1579 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La remuneración no está ABIERTA | Controladores/src/controladores/M6Controller.ts | 1403 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La remuneración no posee una liquidación oficial | Controladores/src/controladores/M6Controller.ts | 2256 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La remuneración no tiene saldo positivo pagable | Controladores/src/controladores/M6Controller.ts | 1910 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La remuneración ya tiene pago registrado | Controladores/src/controladores/M6Controller.ts | 1624 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La reversa supera el efecto neto vigente del movimiento | Controladores/src/controladores/M5Controller.ts | 1492 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La reversa supera lo compensado en una distribución | Controladores/src/controladores/M5Controller.ts | 1672 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La reversión requiere una NV vigente con pagos asociados | Controladores/src/controladores/M2Controller.ts | 785 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La revisión técnica vigente debe estar aprobada antes de aplicarse | Controladores/src/controladores/M6Controller.ts | 3016 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La selección fue modificada por otra sesión | Controladores/src/controladores/M2Controller.ts | 687 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La sesión del administrador original está protegida | Controladores/src/controladores/M4Controller.ts | 285 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La sesión seleccionada ya no está activa | Controladores/src/controladores/M4Controller.ts | 283 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La solicitud de ajuste ya fue resuelta | Controladores/src/controladores/M5Controller.ts | 792 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La solicitud ya fue resuelta | Controladores/src/controladores/M5Controller.ts | 1707 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La solicitud ya tiene una decisión | Controladores/src/controladores/M8Controller.ts | 26 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La suma de movimientos supera el saldo actual de la obligación | Controladores/src/controladores/M5Controller.ts | 1302 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La suma de reversiones excede el monto del pago | Controladores/src/controladores/M6Controller.ts | 2238 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La tarea de catálogo no está activa en el área de la etapa | Controladores/src/controladores/M6Controller.ts | 3219 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La tarea fue cerrada o modificada concurrentemente | Controladores/src/controladores/M6Controller.ts | 3223 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La tarea fue iniciada o modificada concurrentemente | Controladores/src/controladores/M6Controller.ts | 3174 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La tarea fue modificada concurrentemente | Controladores/src/controladores/M6Controller.ts | 3159 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La tarea fue modificada por otra persona; vuelve a cargarla | Controladores/src/controladores/M2Controller.ts | 1018 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La tarea fue modificada por otro usuario; recarga la ficha | Controladores/src/controladores/M6Controller.ts | 3144 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La tarea fue reasignada concurrentemente | Controladores/src/controladores/M6Controller.ts | 3146 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La tarea no pertenece a la visita | Controladores/src/controladores/M6Controller.ts | 3279 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La tarea no pertenece al flujo productivo versionado | Controladores/src/controladores/M6Controller.ts | 3141 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La tarea no puede iniciarse en su estado actual | Controladores/src/controladores/M6Controller.ts | 3174 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La tarea no tiene una visita asociada | Controladores/src/controladores/M6Controller.ts | 2628 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La tarea requiere al menos una ejecución validada antes del cierre | Controladores/src/controladores/M6Controller.ts | 3223 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La tarea tiene ejecuciones pendientes de validación | Controladores/src/controladores/M6Controller.ts | 3223 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La tarea todavía no tiene un levantamiento técnico registrado | Controladores/src/controladores/M6Controller.ts | 2732 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La tarea ya está cerrada | Controladores/src/controladores/M6Controller.ts | 3185 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La tarifa de instalación no corresponde a la moneda seleccionada | Controladores/src/controladores/M2Controller.ts | 349 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La tarifa fue modificada por otro usuario | Controladores/src/comercial/ServicioEscrituraComercial.ts | 96 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La tasa tributaria vigente es inválida | Controladores/src/controladores/M6Controller.ts | 2178 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La tasa tributaria vigente produce un líquido inválido | Controladores/src/controladores/M6Controller.ts | 2183 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La transición de resolución no es válida | Controladores/src/controladores/M6Controller.ts | 52 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La unidad de la cotización pactada de Isapre es inválida | Controladores/src/m6/calculoPrevisional.ts | 94 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La variable ya fue registrada | Controladores/src/controladores/M6Controller.ts | 1702 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La versión aprobada no contiene etapas válidas | Controladores/src/controladores/M6Controller.ts | 3025 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La versión aprobada ya no es la vigente | Controladores/src/controladores/M6Controller.ts | 3013 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La versión enviada no puede editarse silenciosamente | Controladores/src/controladores/M6Controller.ts | 2960 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La versión ya fue revisada | Controladores/src/controladores/M6Controller.ts | 2995 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La vigencia del parámetro es ambigua | Controladores/src/controladores/M6Controller.ts | 1053 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La vigencia del parámetro se superpone con otra configuración | Controladores/src/controladores/M6Controller.ts | 1017 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La vigencia histórica del parámetro es ambigua | Controladores/src/controladores/M7Controller.ts | 1742 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La vigencia se superpone con otro conjunto tributario | Controladores/src/controladores/M6Controller.ts | 1074 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La vinculación cambió concurrentemente | Controladores/src/controladores/M2Controller.ts | 951 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La visita no tiene un checklist existente que pueda actualizarse | Controladores/src/controladores/M6Controller.ts | 3257 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | La visita no tiene una obra asociada | Controladores/src/controladores/M6Controller.ts | 2629 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Las Notas de Venta deben pertenecer al mismo cliente y moneda | Controladores/src/controladores/M2Controller.ts | 1378 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Las OT provenientes de cotizaciones requieren aprobación técnica antes de liberarse | Controladores/src/controladores/M6Controller.ts | 3043 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Las alternativas de este borrador ya fueron decididas | Controladores/src/controladores/M2Controller.ts | 381 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Las partidas de servicios de C3.3 sólo están habilitadas para B2B | Controladores/src/controladores/M2Controller.ts | 304 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Las reversas superan la compensación original | Controladores/src/controladores/M5Controller.ts | 246 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Las tareas de producción fueron generadas concurrentemente; vuelve a consultar | Controladores/src/controladores/M6Controller.ts | 3099 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Los ajustes reducen la deuda por debajo de cero | Controladores/src/controladores/M5Controller.ts | 247 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Los efectos postpago superan el monto original | Controladores/src/controladores/M5Controller.ts | 237 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Los efectos vigentes superan la deuda ajustada de la obligación | Controladores/src/controladores/M5Controller.ts | 248 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | No es posible anular la operación completa porque uno de sus movimientos ya no conserva efecto anulable | Controladores/src/controladores/M5Controller.ts | 1478 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | No existe cobertura autorizada para exportar el reporte | Controladores/src/controladores/M6Controller.ts | 3610 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | No existe cobertura comercial configurada para la ubicación seleccionada | Controladores/src/controladores/M2Controller.ts | 343 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | No existe una liquidación oficial vigente para reenviar | Controladores/src/controladores/M6Controller.ts | 2318 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | No existe una solicitud de reapertura aprobable | Controladores/src/controladores/M6Controller.ts | 1637 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | No existe una tabla tributaria única y completa para el período | Controladores/src/m6/calculoPrevisional.ts | 147 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | No existe una tasa de retención/PPM vigente para la fecha de emisión | Controladores/src/controladores/M6Controller.ts | 2171 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | No existe una versión técnica aprobada como base | Controladores/src/controladores/M6Controller.ts | 3225 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | No se permiten nuevas asignaciones a un área inactiva | Controladores/src/controladores/M6Controller.ts | 343 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | No se puede agregar evidencia después de la revisión | Controladores/src/controladores/M6Controller.ts | 3441 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | No se puede desactivar una familia con productos activos | Controladores/src/controladores/M2Controller.ts | 854 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | No se puede desactivar: el cliente mantiene operaciones abiertas | Controladores/src/controladores/M1Controller.ts | 54 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | No se puede desactivar: existen ${bloqueos.length} procesos externos pendientes | Controladores/src/controladores/M5Controller.ts | 510 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | No se puede insertar una etapa antes de etapas ya cerradas | Controladores/src/controladores/M6Controller.ts | 3213 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | No se puede insertar una vigencia anterior a una configuración futura | Controladores/src/controladores/M7Controller.ts | 1131 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | No se puede mantener un permiso sin sus dependencias | Controladores/src/controladores/M4Controller.ts | 145 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | No se puede reclasificar una incidencia ya revisada | Controladores/src/controladores/M6Controller.ts | 3455 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | No se pueden mezclar OCS y OCI en un mismo documento | Controladores/src/controladores/M5Controller.ts | 966 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Nota de Venta no disponible | Controladores/src/controladores/M2Controller.ts | 1368 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Nota de Venta no disponible para anular | Controladores/src/controladores/M2Controller.ts | 1354 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Otra publicación actualizó la plantilla; vuelve a cargarla | Controladores/src/controladores/M2Controller.ts | 1109 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Otra publicación modificó el producto; vuelve a cargarlo | Controladores/src/controladores/M2Controller.ts | 966 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Propuesta de imputación no disponible | Controladores/src/controladores/M5Controller.ts | 1104 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Reactiva el producto antes de administrar sus vínculos | Controladores/src/controladores/M2Controller.ts | 940 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Reactiva el producto antes de modificarlo | Controladores/src/controladores/M2Controller.ts | 910 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Registra medidas reales antes de enviar | Controladores/src/controladores/M6Controller.ts | 2976 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Regulariza los permisos antes de reactivar | Controladores/src/controladores/M4Controller.ts | 183 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Retira primero el rol Administrador, respetando continuidad | Controladores/src/controladores/M4Controller.ts | 190 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Saldo a favor o Nota de Venta no elegible para la aplicación | Controladores/src/controladores/M3Controller.ts | 132 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Se requiere referencia cambiaria confirmada | Controladores/src/controladores/M5Controller.ts | 1134 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Selecciona un medio de pago activo | Controladores/src/controladores/M5Controller.ts | 1301 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Selecciona un tipo de documento de venta configurado | Controladores/src/controladores/M2Controller.ts | 1384 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Selecciona una NV de un cliente activo | Controladores/src/controladores/M3Controller.ts | 29 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Selecciona una alternativa vigente y recarga su revisión | Controladores/src/controladores/M2Controller.ts | 721 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Selecciona una familia activa | Controladores/src/controladores/M2Controller.ts | 897 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo los empleados activos pueden asignarse a producción | Controladores/src/controladores/M6Controller.ts | 341 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo puede ajustarse una OCS Abierta | Controladores/src/controladores/M5Controller.ts | 776 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo puede anularse un ajuste confirmado y vigente | Controladores/src/controladores/M5Controller.ts | 1584 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo puede anularse una OCS Abierta | Controladores/src/controladores/M5Controller.ts | 816 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo puede aprobarse la versión vigente enviada | Controladores/src/controladores/M6Controller.ts | 2994 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo puede cerrarse una OCS Abierta | Controladores/src/controladores/M5Controller.ts | 828 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo puede confirmarse un ajuste sobre una OCS Abierta | Controladores/src/controladores/M5Controller.ts | 795 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo puede corregirse evidencia de una operación confirmada | Controladores/src/controladores/M5Controller.ts | 1354 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo puede devolverse la versión vigente enviada | Controladores/src/controladores/M6Controller.ts | 3005 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo puede editarse directamente una OCS Abierta | Controladores/src/controladores/M5Controller.ts | 715 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo puede pagarse una regularización CERRADA y positiva | Controladores/src/controladores/M6Controller.ts | 1916 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo puede pagarse una remuneración CERRADA y actual | Controladores/src/controladores/M6Controller.ts | 1909 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo puede reabrirse una OCS Cerrada | Controladores/src/controladores/M5Controller.ts | 847 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo puede utilizarse un proveedor Activo para una OCS | Controladores/src/controladores/M5Controller.ts | 678 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo se adjuntan respaldos a un borrador | Controladores/src/controladores/M5Controller.ts | 1329 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo se descartan operaciones en borrador | Controladores/src/controladores/M5Controller.ts | 1440 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo se editan operaciones en borrador | Controladores/src/controladores/M5Controller.ts | 1291 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo se guarda una operación en borrador | Controladores/src/controladores/M5Controller.ts | 1421 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo se puede confirmar una Nota de Venta emitida | Controladores/src/controladores/M2Controller.ts | 1341 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo se puede descartar una cotización en Borrador | Controladores/src/controladores/M2Controller.ts | 1428 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo se puede editar un Borrador; las condiciones emitidas se conservan | Controladores/src/controladores/M2Controller.ts | 1211 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo se puede emitir un borrador disponible | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 406 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo se puede emitir un borrador disponible | Controladores/src/controladores/M2Controller.ts | 667 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo se puede publicar un borrador | Controladores/src/comercial/ServicioEscrituraComercial.ts | 115 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo se retoman operaciones en borrador | Controladores/src/controladores/M5Controller.ts | 1437 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo un ajuste POSITIVO puede originar una regularización | Controladores/src/controladores/M6Controller.ts | 1838 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo un borrador puede cambiar su Obra vinculada | Controladores/src/comercial/ServicioObraProyectoComercial.ts | 77 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo un borrador puede enviarse | Controladores/src/controladores/M8Controller.ts | 25 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo un pago CONFIRMADO admite reversión | Controladores/src/controladores/M6Controller.ts | 2238 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo un pago CONFIRMADO puede anularse | Controladores/src/controladores/M6Controller.ts | 2233 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo un pago PREPARADO puede corregirse | Controladores/src/controladores/M6Controller.ts | 1982 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo un producto vinculado a un ítem operativo activo puede publicarse | Controladores/src/controladores/M2Controller.ts | 958 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo una OT liberada y abierta admite corrección técnica | Controladores/src/controladores/M6Controller.ts | 3225 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo una boleta PENDIENTE_CONFIRMACION puede confirmarse | Controladores/src/controladores/M6Controller.ts | 2190 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo una boleta PENDIENTE_CONFIRMACION puede editarse | Controladores/src/controladores/M6Controller.ts | 2147 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo una cotización B2B puede guardar contactos propios | Controladores/src/controladores/M2Controller.ts | 129 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo una cotización B2C puede guardar alternativas | Controladores/src/controladores/M2Controller.ts | 374 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo una incidencia aprobada puede avanzar a corrección o cierre | Controladores/src/controladores/M6Controller.ts | 50 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo una remuneración ABIERTA puede exportarse como cálculo preliminar | Controladores/src/controladores/M6Controller.ts | 2370 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo una remuneración CERRADA sin solicitud vigente puede solicitar reapertura | Controladores/src/controladores/M6Controller.ts | 1623 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Sólo una solicitud Pendiente puede resolverse | Controladores/src/controladores/M8Controller.ts | 27 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | TEMPORAL_M5_DB_PATCH_PENDIENTE: integración OCI aún no disponible | Controladores/src/controladores/M5Controller.ts | 967 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | TEMPORAL_M5_DB_PATCH_PENDIENTE: no es posible validar el autorizado OCI | Controladores/src/controladores/M5Controller.ts | 1546 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | TEMPORAL_M5_DB_PATCH_PENDIENTE_INTEGRACION_OCI: la fuente oficial OCI no está disponible | Controladores/src/controladores/M5Controller.ts | 1853 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | TEMPORAL_M5_REGLA_UMBRAL_MONEDA: no existe equivalente CLP confirmado | Controladores/src/controladores/M5Controller.ts | 1704 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Tiene pagos asociados: utiliza la reversión comercial desde el detalle de la Nota de Venta | Controladores/src/controladores/M2Controller.ts | 1353 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Todas las remuneraciones exigibles deben estar CERRADAS | Controladores/src/controladores/M6Controller.ts | 1603 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Todas las tareas obligatorias y adicionales deben estar cerradas | Controladores/src/controladores/M6Controller.ts | 3227 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Todos los movimientos requieren respaldo | Controladores/src/controladores/M5Controller.ts | 1407 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Un costo referenciado se corrige en su fuente financiera | Controladores/src/controladores/M5Controller.ts | 1878 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Un empleado seleccionado ya no está activo en el área indicada | Controladores/src/controladores/M2Controller.ts | 544 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Un medio de pago ya no está activo | Controladores/src/controladores/M5Controller.ts | 1406 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Un opcional de la alternativa no es compatible o no tiene precio B2C vigente | Controladores/src/controladores/M2Controller.ts | 401 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Un opcional dejó de ser compatible o no tiene precio vigente | Controladores/src/controladores/M2Controller.ts | 284 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Un pago con reversiones no puede anularse sin una regla explícita | Controladores/src/controladores/M6Controller.ts | 2233 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Un responsable de tarea ya no está activo en el área seleccionada | Controladores/src/controladores/M6Controller.ts | 2953 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Una OCS vinculada está anulada o no tiene moneda compatible | Controladores/src/controladores/M5Controller.ts | 1550 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Una alternativa decidida no puede sobrescribirse | Controladores/src/controladores/M2Controller.ts | 410 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Una alternativa usa un producto, versión o precio B2C que dejó de estar vigente | Controladores/src/controladores/M2Controller.ts | 392 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Una categoría destino ya no está activa | Controladores/src/controladores/M5Controller.ts | 1707 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Una cuenta Activa particular debe conservar permisos efectivos | Controladores/src/controladores/M4Controller.ts | 204 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Una de las Notas de Venta no está disponible | Controladores/src/controladores/M2Controller.ts | 1376 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Una obligación ya no está disponible | Controladores/src/controladores/M5Controller.ts | 1405 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Una relación terminada no se reactiva; registra un nuevo período | Controladores/src/controladores/M6Controller.ts | 566 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Una tarea cerrada no puede editarse; crea una tarea correctiva | Controladores/src/controladores/M6Controller.ts | 3157 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Una tarea cerrada no puede reasignarse | Controladores/src/controladores/M6Controller.ts | 3142 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Una tarea correctiva debe relacionarse con una tarea cerrada de la misma OT | Controladores/src/controladores/M6Controller.ts | 3219 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Una tarea de catálogo ya no está activa en el área seleccionada | Controladores/src/controladores/M6Controller.ts | 2952 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Uno o más modelos o precios B2C no están vigentes | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 332 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Utiliza el desbloqueo administrativo | Controladores/src/controladores/M4Controller.ts | 238 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Vigencia superpuesta | Controladores/src/controladores/M8Controller.ts | 31 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Ya existe un ajuste con el mismo proveedor, tipo y folio | Controladores/src/controladores/M5Controller.ts | 1539 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Ya existe un ajuste pendiente para este campo | Controladores/src/controladores/M5Controller.ts | 778 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Ya existe un cliente con ese RUT | Controladores/src/controladores/M1Controller.ts | 19 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Ya existe un documento definitivo con el mismo proveedor, tipo y folio | Controladores/src/controladores/M5Controller.ts | 940 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Ya existe un empleado con ese RUT | Controladores/src/controladores/M6Controller.ts | 152 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Ya existe un envío con esa referencia | Controladores/src/controladores/M5Controller.ts | 1848 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Ya existe un prestador con ese identificador | Controladores/src/controladores/M6Controller.ts | 2064 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Ya existe un producto con ese código comercial | Controladores/src/controladores/M2Controller.ts | 903 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Ya existe un proveedor con esa identidad fiscal | Controladores/src/controladores/M5Controller.ts | 425 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Ya existe un saldo inicial para la cuenta y fecha de corte; edita el registro existente | Controladores/src/controladores/M7Controller.ts | 988 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Ya existe un área con ese nombre | Controladores/src/controladores/M6Controller.ts | 270 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Ya existe una Obra con esa ubicación (ID ${existente.obra_obra_id.toString()}); selecciónala explícitamente | Controladores/src/comercial/ServicioObraProyectoComercial.ts | 52 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Ya existe una categoría con ese nombre | Controladores/src/controladores/M5Controller.ts | 1689 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Ya existe una configuración del umbral para esa fecha | Controladores/src/controladores/M7Controller.ts | 1130 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Ya existe una cuenta bancaria con la misma identidad exacta | Controladores/src/controladores/M7Controller.ts | 968 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Ya existe una familia con ese código | Controladores/src/controladores/M2Controller.ts | 829 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Ya existe una partida activa equivalente; edita el registro existente | Controladores/src/controladores/M7Controller.ts | 934 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 409 | Ya existe una tarea con ese nombre en el área | Controladores/src/controladores/M2Controller.ts | 1004 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 413 | El contenido documental excede el límite permitido | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 72 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 413 | El documento excede el límite de recuperación | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 83 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 500 | Integridad de evidencia comprometida | Controladores/src/controladores/M9Controller.ts | 140 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 502 | Banco Central entregó un tipo de cambio inválido | Controladores/src/controladores/M2Controller.ts | 453 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 503 | Auditoría crítica no confirmada | Controladores/src/m9/contratoProductor.ts | 221 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 503 | Banco Central no devolvió un tipo de cambio válido | Controladores/src/utilidades/C_BancoCentral.ts | 31 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 503 | Banco Central respondió ${respuesta.status} | Controladores/src/utilidades/C_BancoCentral.ts | 22 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 503 | C_BancoCentral no está configurado | Controladores/src/utilidades/C_BancoCentral.ts | 17 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 503 | El storage no permite recuperar documentos | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 508 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 503 | El storage no soporta escritura exclusiva y recuperación | Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts | 283 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 503 | No fue posible confirmar la evidencia crítica | Controladores/src/controladores/M9Controller.ts | 130 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 503 | No fue posible enviar el documento: ${(error as Error).message} | Controladores/src/controladores/M6Controller.ts | 2339 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
| 504 | Timeout M9 | Controladores/src/m9/contratoProductor.ts | 205 | Leer contexto, verificar permiso/estado/datos; no repetir escritura sin diagnostico |
## Interpretacion
400 datos invalidos; 401 sesion/autenticacion; 403 autorizacion/alcance; 404 entidad; 409 conflicto/idempotencia/revision; 422 regla de negocio; 500 fallo no controlado. Confirmar siempre el uso real en el archivo citado.

## Fuentes de verdad consultadas
- `Controladores/prisma/schema.prisma`
- `Controladores/pruebas`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/rutas/finanzas.ts`
- `Vistas/src`
- `Vistas/src/App.tsx`
