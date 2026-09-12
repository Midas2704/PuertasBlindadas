# Estado técnico vigente

Fecha de vigencia: **12 de septiembre de 2026**  
Implementación de referencia: **commit `e0189a1`**

Este documento concentra las reglas técnicas vigentes que reemplazan las conclusiones operativas de entregas y auditorías anteriores. Los documentos históricos se conservan como evidencia de cada etapa.

## Seguridad y permisos M4

- Gerencia dispone de CU51, CU52 y CU54.
- Contador dispone de CU51, CU52 y CU54 según el RF vigente.
- Secretaría no dispone de CU51, CU52 ni CU54.
- El bloqueo temporal ocurre al tercer intento fallido y dura 10 minutos.
- La sesión tiene una duración máxima configurable de 60 minutos y vence tras 10 minutos de inactividad. Una operación autorizada renueva solamente el plazo de inactividad, sin superar la duración máxima.
- Los valores se configuran mediante `M4_INTENTOS`, `M4_BLOQUEO_MINUTOS`, `M4_SESION_MINUTOS` y `M4_INACTIVIDAD_MINUTOS`.

El seed M4 es idempotente. Conserva toda credencial raíz activa y vigente. Si la cuenta raíz no tiene una credencial vigente, crea una sola para desarrollo usando `M4_CLAVE_INICIAL` o un secreto aleatorio comunicado una vez por la consola. El seed no se ejecuta en producción.

## Reglas financieras corregidas

- **CU36:** registra documentos tributarios emitidos externamente con tipo configurado, folio, fechas, montos propios, respaldo y observación. Puede asociar una o más Notas de Venta mediante la relación existente. No integra SII ni copia automáticamente los montos de la NV.
- **CU51:** consulta anulaciones y reversiones antes de anular. Conserva el pago original, registra la anulación, retira su efecto financiero y recalcula saldo y estado de la NV.
- **CU57:** genera un PDF válido y permite previsualizarlo, abrirlo para impresión y descargarlo desde la ficha financiera.
- **Fechas de negocio:** morosidad y fecha predeterminada de Banco Central utilizan `fechaNegocio()`. Una NV puede ser morosa sólo desde el día siguiente a su vencimiento, con saldo pendiente vigente mayor que cero y estado comercial aplicable.
- **CU24:** la aceptación B2B con Orden de Compra está disponible; los mensajes operativos ya no la presentan como pendiente.

## Alcance de persistencia

La corrección usa el modelo Prisma y las relaciones existentes. No cambia `schema.prisma`, no crea migraciones y no modifica migraciones aplicadas. Tampoco cambia la arquitectura Vista → C_Finanzas → controlador modular → Prisma → PostgreSQL.

CU27 se mantiene como **IMPLEMENTADO FUNCIONALMENTE — persistencia estructurada pendiente**. Esta revisión no modifica su implementación ni normaliza su detalle en Prisma.

## Diagnóstico pendiente de CU68

La fuente funcional exige una única sesión activa por usuario. La evidencia está en `Matriz_Reglas_de_Negocio_Para_Codigo_M1_M4.docx`, RN-M4-21 y RN-M4-22, asociadas a RF59 y RF64. La configuración actual permite sesiones múltiples cuando `M4_SESION_UNICA=false`; esta contradicción queda registrada para una decisión posterior y CU68 no se modifica en esta revisión.

## Verificación

Las reglas están cubiertas por `Controladores/pruebas/rf-vigente.test.cjs`, además de la suite existente. La validación de esta versión comprende compilación de backend y frontend, suite completa, pruebas focalizadas y revisión de diferencias de Git.
