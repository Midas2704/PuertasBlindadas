# Trazabilidad completa de casos de uso CU

**Proyecto:** Puertas Blindadas
**Documento:** 06
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

## Matriz CU detectada
| CU | Referencias | Estado | Evidencia resumida |
| --- | --- | --- | --- |
| CU01 | 13 | Referenciado | # Auditoría conservadora de cobertura CU01–CU74 |
| CU02 | 8 | Referenciado | CU01:'Crear cliente', CU02:'Editar cliente', CU03:'Desactivar cliente', CU04:'Reactivar cliente', |
| CU03 | 6 | Referenciado | CU01:'Crear cliente', CU02:'Editar cliente', CU03:'Desactivar cliente', CU04:'Reactivar cliente', |
| CU3 | 1 | Referenciado | assert.doesNotMatch(vista, /CU3(?:6[8-9]\|[7-9][0-9])/); |
| CU04 | 8 | Referenciado | CU01:'Crear cliente', CU02:'Editar cliente', CU03:'Desactivar cliente', CU04:'Reactivar cliente', |
| CU05 | 12 | Referenciado | <Route path="clientes" element={<Protegido permiso="CU05"><CatalogoClientes /></Protegido>} /> |
| CU06 | 7 | Referenciado | CU01:G,CU02:G,CU03:G,CU04:G,CU05:GSC,CU06:GSC,CU07:GSC,CU08:GSC,CU09:GSC,CU10:GSC,CU11:GSC, |
| CU07 | 7 | Referenciado | CU01:G,CU02:G,CU03:G,CU04:G,CU05:GSC,CU06:GSC,CU07:GSC,CU08:GSC,CU09:GSC,CU10:GSC,CU11:GSC, |
| CU08 | 8 | Referenciado | CU01:G,CU02:G,CU03:G,CU04:G,CU05:GSC,CU06:GSC,CU07:GSC,CU08:GSC,CU09:GSC,CU10:GSC,CU11:GSC, |
| CU09 | 12 | Referenciado | <Route path="clientes/:rut" element={<Protegido permiso="CU09"><VerFicha /></Protegido>} /> |
| CU10 | 6 | Referenciado | CU01:G,CU02:G,CU03:G,CU04:G,CU05:GSC,CU06:GSC,CU07:GSC,CU08:GSC,CU09:GSC,CU10:GSC,CU11:GSC, |
| CU11 | 7 | Referenciado | /** M1 CU01–CU11: catálogo, ficha y mantenimiento de clientes. */ |
| CU12 | 5 | Referenciado | /** M2 CU12–CU41. Compatibilidad del frontend existente; no sustituye la implementación completa de los CU. */ |
| CU13 | 6 | Referenciado | CU12:GS,CU13:G,CU14:GS,CU15:GS,CU16:GS,CU17:GS,CU18:GS,CU19:GS,CU20:GS,CU21:GS,CU22:GS,CU23:G, |
| CU14 | 6 | Referenciado | CU12:GS,CU13:G,CU14:GS,CU15:GS,CU16:GS,CU17:GS,CU18:GS,CU19:GS,CU20:GS,CU21:GS,CU22:GS,CU23:G, |
| CU15 | 5 | Referenciado | CU12:GS,CU13:G,CU14:GS,CU15:GS,CU16:GS,CU17:GS,CU18:GS,CU19:GS,CU20:GS,CU21:GS,CU22:GS,CU23:G, |
| CU16 | 4 | Referenciado | CU12:GS,CU13:G,CU14:GS,CU15:GS,CU16:GS,CU17:GS,CU18:GS,CU19:GS,CU20:GS,CU21:GS,CU22:GS,CU23:G, |
| CU17 | 4 | Referenciado | CU12:GS,CU13:G,CU14:GS,CU15:GS,CU16:GS,CU17:GS,CU18:GS,CU19:GS,CU20:GS,CU21:GS,CU22:GS,CU23:G, |
| CU18 | 6 | Referenciado | CU12:GS,CU13:G,CU14:GS,CU15:GS,CU16:GS,CU17:GS,CU18:GS,CU19:GS,CU20:GS,CU21:GS,CU22:GS,CU23:G, |
| CU19 | 10 | Referenciado | <Route path="cotizacion/nueva" element={<Protegido permiso={new URLSearchParams(window.location.search).has('borrador') ? 'CU20' : 'CU19'}><ArmarCotizacion /></Protegido>} /> |
| CU20 | 14 | Referenciado | <Route path="aprobaciones" element={<Protegido permiso="CU20"><BandejaAprobacionGerencia /></Protegido>} /> |
| CU21 | 5 | Referenciado | CU12:GS,CU13:G,CU14:GS,CU15:GS,CU16:GS,CU17:GS,CU18:GS,CU19:GS,CU20:GS,CU21:GS,CU22:GS,CU23:G, |
| CU22 | 6 | Referenciado | CU12:GS,CU13:G,CU14:GS,CU15:GS,CU16:GS,CU17:GS,CU18:GS,CU19:GS,CU20:GS,CU21:GS,CU22:GS,CU23:G, |
| CU23 | 6 | Referenciado | CU12:GS,CU13:G,CU14:GS,CU15:GS,CU16:GS,CU17:GS,CU18:GS,CU19:GS,CU20:GS,CU21:GS,CU22:GS,CU23:G, |
| CU24 | 9 | Referenciado | - **CU24:** la aceptación B2B con Orden de Compra está disponible; los mensajes operativos ya no la presentan como pendiente. |
| CU25 | 9 | Referenciado | CU24:GS,CU25:GS,CU26:GS,CU27:GS,CU28:GS,CU29:GS,CU30:GS,CU31:G,CU32:GS,CU33:G,CU34:GS,CU35:GS, |
| CU26 | 4 | Referenciado | CU24:GS,CU25:GS,CU26:GS,CU27:GS,CU28:GS,CU29:GS,CU30:GS,CU31:G,CU32:GS,CU33:G,CU34:GS,CU35:GS, |
| CU27 | 9 | Referenciado | <Route path="venta/directa" element={<Protegido permiso="CU27"><NotaDeVentaDirecta /></Protegido>} /> |
| CU28 | 5 | Referenciado | CU24:GS,CU25:GS,CU26:GS,CU27:GS,CU28:GS,CU29:GS,CU30:GS,CU31:G,CU32:GS,CU33:G,CU34:GS,CU35:GS, |
| CU29 | 4 | Referenciado | CU24:GS,CU25:GS,CU26:GS,CU27:GS,CU28:GS,CU29:GS,CU30:GS,CU31:G,CU32:GS,CU33:G,CU34:GS,CU35:GS, |
| CU30 | 4 | Referenciado | CU24:GS,CU25:GS,CU26:GS,CU27:GS,CU28:GS,CU29:GS,CU30:GS,CU31:G,CU32:GS,CU33:G,CU34:GS,CU35:GS, |
| CU31 | 5 | Referenciado | CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'], |
| CU32 | 5 | Referenciado | CU24:GS,CU25:GS,CU26:GS,CU27:GS,CU28:GS,CU29:GS,CU30:GS,CU31:G,CU32:GS,CU33:G,CU34:GS,CU35:GS, |
| CU33 | 5 | Referenciado | CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'], |
| CU34 | 5 | Referenciado | CU24:GS,CU25:GS,CU26:GS,CU27:GS,CU28:GS,CU29:GS,CU30:GS,CU31:G,CU32:GS,CU33:G,CU34:GS,CU35:GS, |
| CU35 | 6 | Referenciado | CU24:GS,CU25:GS,CU26:GS,CU27:GS,CU28:GS,CU29:GS,CU30:GS,CU31:G,CU32:GS,CU33:G,CU34:GS,CU35:GS, |
| CU36 | 8 | Referenciado | CU25:'Consolidar cotización particular', CU27:'Generar Nota de Venta', CU28:'Consultar monedas', CU35:'Editar guía de despacho', CU36:'Registrar documento de venta', |
| CU37 | 6 | Referenciado | CU36:GS,CU37:GC,CU38:GC,CU39:GS,CU40:GS,CU41:G, |
| CU38 | 8 | Referenciado | CU36:GS,CU37:GC,CU38:GC,CU39:GS,CU40:GS,CU41:G, |
| CU39 | 5 | Referenciado | CU36:GS,CU37:GC,CU38:GC,CU39:GS,CU40:GS,CU41:G, |
| CU40 | 5 | Referenciado | CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'], |
| CU41 | 13 | Referenciado | 'CU41', |
| CU42 | 11 | Referenciado | /** M3 CU42–CU58: pagos, reversas, saldos a favor y conciliación. */ |
| CU43 | 9 | Referenciado | CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'], |
| CU44 | 4 | Referenciado | CU42:GSC,CU43:GSC,CU44:GSC,CU45:GSC,CU46:GSC,CU47:GSC,CU48:GSC,CU49:GSC,CU50:GSC, |
| CU45 | 6 | Referenciado | CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'], |
| CU46 | 4 | Referenciado | CU42:GSC,CU43:GSC,CU44:GSC,CU45:GSC,CU46:GSC,CU47:GSC,CU48:GSC,CU49:GSC,CU50:GSC, |
| CU47 | 9 | Referenciado | - CU47 mantiene el tipo de cambio manual; no existe integración implementada con `C_BancoCentral`. |
| CU48 | 4 | Referenciado | CU42:GSC,CU43:GSC,CU44:GSC,CU45:GSC,CU46:GSC,CU47:GSC,CU48:GSC,CU49:GSC,CU50:GSC, |
| CU49 | 7 | Referenciado | CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'], |
| CU50 | 6 | Referenciado | CU42:GSC,CU43:GSC,CU44:GSC,CU45:GSC,CU46:GSC,CU47:GSC,CU48:GSC,CU49:GSC,CU50:GSC, |
| CU51 | 8 | Referenciado | - **CU51:** consulta anulaciones y reversiones antes de anular. Conserva el pago original, registra la anulación, retira su efecto financiero y recalcula saldo y estado de la NV. |
| CU52 | 7 | Referenciado | - Contador dispone de CU51, CU52 y CU54 según el RF vigente. |
| CU53 | 4 | Referenciado | CU51:GC,CU52:GC,CU53:GC,CU54:GC,CU55:GSC,CU56:GSC,CU57:GC,CU58:GC, |
| CU54 | 8 | Referenciado | - Contador dispone de CU51, CU52 y CU54 según el RF vigente. |
| CU55 | 6 | Referenciado | CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'], |
| CU56 | 6 | Referenciado | CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'], |
| CU57 | 8 | Referenciado | - **CU57:** genera un PDF válido y permite previsualizarlo, abrirlo para impresión y descargarlo desde la ficha financiera. |
| CU58 | 9 | Referenciado | /** M3 CU42–CU58: pagos, reversas, saldos a favor y conciliación. */ |
| CU59 | 12 | Referenciado | 'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150', |
| CU60 | 6 | Referenciado | 'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150', |
| CU61 | 6 | Referenciado | 'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150', |
| CU62 | 9 | Referenciado | 'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150', |
| CU63 | 10 | Referenciado | 'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150', |
| CU64 | 10 | Referenciado | 'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150', |
| CU65 | 10 | Referenciado | 'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150', |
| CU66 | 12 | Referenciado | 'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150', |
| CU67 | 8 | Referenciado | - CU67 conserva la consulta de usuarios, configuración, permisos y rol Administrador para Gerencia en modo de sólo lectura. CU59–CU66, CU71, CU72 y CU74 exigen además rol Administrador. |
| CU68 | 9 | Referenciado | ## CU68 |
| CU69 | 6 | Referenciado | CU68:'Consultar sesión propia', CU69:'Cambiar contraseña propia', CU70:'Cerrar sesión propia', CU71:'Restablecer contraseña de usuario', |
| CU70 | 8 | Referenciado | - CU70 permite que el administrador original utilice su correo asociado para recuperarse incluso con bloqueo persistente; las demás cuentas con ese bloqueo siguen excluidas del mecanismo autónomo. |
| CU71 | 9 | Referenciado | 'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150', |
| CU72 | 8 | Referenciado | 'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150', |
| CU73 | 10 | Referenciado | - CU73 presenta todas las cuentas con su estado de sesión. Gerencia recibe el estado básico y el rol Administrador habilita fecha, vigencia, dirección, agente y cierre autorizado. |
| CU74 | 12 | Referenciado | # Auditoría conservadora de cobertura CU01–CU74 |
| CU75 | 7 | Referenciado | -- CU75 y CU77 exigen país funcionalmente para toda alta o identidad corregida. |
| CU76 | 5 | Referenciado | 'TEMPORAL_M5_DB_PATCH: trazabilidad operativa CU76-CU79 pendiente de reconciliación'; |
| CU77 | 5 | Referenciado | -- CU75 y CU77 exigen país funcionalmente para toda alta o identidad corregida. |
| CU78 | 3 | Referenciado | CU75:G,CU76:GS,CU77:G,CU78:G,CU79:G,CU80:GSC,CU81:GSC,CU82:GSC,CU83:GSC,CU84:GSC, |
| CU79 | 5 | Referenciado | 'TEMPORAL_M5_DB_PATCH: trazabilidad operativa CU76-CU79 pendiente de reconciliación'; |
| CU80 | 6 | Referenciado | /** Única fuente para la etiqueta y el filtro financiero de CU80/CU83. */ |
| CU81 | 3 | Referenciado | CU75:G,CU76:GS,CU77:G,CU78:G,CU79:G,CU80:GSC,CU81:GSC,CU82:GSC,CU83:GSC,CU84:GSC, |
| CU82 | 3 | Referenciado | CU75:G,CU76:GS,CU77:G,CU78:G,CU79:G,CU80:GSC,CU81:GSC,CU82:GSC,CU83:GSC,CU84:GSC, |
| CU83 | 5 | Referenciado | /** Única fuente para la etiqueta y el filtro financiero de CU80/CU83. */ |
| CU84 | 9 | Referenciado | -- Soporte mínimo para CU75-CU84. Debe reconciliarse con el próximo patch del equipo de BD. |
| CU85 | 4 | Referenciado | CU76:['CU80'],CU77:['CU80'],CU78:['CU80'],CU79:['CU80'],CU81:['CU80'],CU82:['CU80'],CU83:['CU80'],CU84:['CU80'],CU85:['CU84'],CU86:['CU80'],CU87:['CU84'],CU89:['CU88'],CU90:['CU88'],CU91:['CU88'],CU92:['CU88'],CU93:['CU88'],CU94:['CU88'], |
| CU86 | 4 | Referenciado | CU76:['CU80'],CU77:['CU80'],CU78:['CU80'],CU79:['CU80'],CU81:['CU80'],CU82:['CU80'],CU83:['CU80'],CU84:['CU80'],CU85:['CU84'],CU86:['CU80'],CU87:['CU84'],CU89:['CU88'],CU90:['CU88'],CU91:['CU88'],CU92:['CU88'],CU93:['CU88'],CU94:['CU88'], |
| CU87 | 4 | Referenciado | 'TEMPORAL_M5_DB_PATCH: DIAS_CORRIDOS o DIAS_HABILES para la política prospectiva CU87'; |
| CU88 | 9 | Referenciado | 'TEMPORAL_M5_DB_PATCH: orden de compra de servicios mínima CU88-CU90'; |
| CU89 | 4 | Referenciado | CU76:['CU80'],CU77:['CU80'],CU78:['CU80'],CU79:['CU80'],CU81:['CU80'],CU82:['CU80'],CU83:['CU80'],CU84:['CU80'],CU85:['CU84'],CU86:['CU80'],CU87:['CU84'],CU89:['CU88'],CU90:['CU88'],CU91:['CU88'],CU92:['CU88'],CU93:['CU88'],CU94:['CU88'], |
| CU90 | 6 | Referenciado | 'TEMPORAL_M5_DB_PATCH: orden de compra de servicios mínima CU88-CU90'; |
| CU91 | 6 | Referenciado | 'TEMPORAL_M5_DB_PATCH: monto inicial inmutable para trazabilidad CU91'; |
| CU92 | 4 | Referenciado | CU76:['CU80'],CU77:['CU80'],CU78:['CU80'],CU79:['CU80'],CU81:['CU80'],CU82:['CU80'],CU83:['CU80'],CU84:['CU80'],CU85:['CU84'],CU86:['CU80'],CU87:['CU84'],CU89:['CU88'],CU90:['CU88'],CU91:['CU88'],CU92:['CU88'],CU93:['CU88'],CU94:['CU88'], |
| CU93 | 4 | Referenciado | CU76:['CU80'],CU77:['CU80'],CU78:['CU80'],CU79:['CU80'],CU81:['CU80'],CU82:['CU80'],CU83:['CU80'],CU84:['CU80'],CU85:['CU84'],CU86:['CU80'],CU87:['CU84'],CU89:['CU88'],CU90:['CU88'],CU91:['CU88'],CU92:['CU88'],CU93:['CU88'],CU94:['CU88'], |
| CU94 | 4 | Referenciado | -- Soporte mínimo para CU91-CU94. No registra documentos, obligaciones ni aprobaciones de excedentes. |
| CU95 | 5 | Referenciado | <Route path="documentos-proveedor" element={<Protegido permiso="CU95"><DocumentosProveedor /></Protegido>} /> |
| CU96 | 5 | Referenciado | -- Persistencia provisional mínima CU96-CU105. Legacy permanece sin reinterpretación. |
| CU97 | 5 | Referenciado | 'TEMPORAL_M5_DB_PATCH: marcador de efectos para integrar documentos y obligaciones desde CU97+'; |
| CU98 | 4 | Referenciado | CU96:GS,CU97:GSC,CU98:GSC,CU99:GSC,CU100:GC,CU101:GSC,CU102:GSC,CU103:GSC,CU104:GC,CU105:GSC, |
| CU99 | 6 | Referenciado | // TEMPORAL_M5_DB_PATCH: CU99/CU100 conectarán aquí la aprobación real del excedente. |
| CU100 | 5 | Referenciado | // TEMPORAL_M5_DB_PATCH: CU99/CU100 conectarán aquí la aprobación real del excedente. |
| CU101 | 4 | Referenciado | CU96:GS,CU97:GSC,CU98:GSC,CU99:GSC,CU100:GC,CU101:GSC,CU102:GSC,CU103:GSC,CU104:GC,CU105:GSC, |
| CU102 | 4 | Referenciado | CU132:['CU131'],CU133:['CU132'],CU134:['CU102'],CU135:['CU102'],CU136:['CU135'],CU137:['CU134'], |
| CU103 | 4 | Referenciado | CU96:GS,CU97:GSC,CU98:GSC,CU99:GSC,CU100:GC,CU101:GSC,CU102:GSC,CU103:GSC,CU104:GC,CU105:GSC, |
| CU104 | 4 | Referenciado | CU96:GS,CU97:GSC,CU98:GSC,CU99:GSC,CU100:GC,CU101:GSC,CU102:GSC,CU103:GSC,CU104:GC,CU105:GSC, |
| CU105 | 5 | Referenciado | -- Persistencia provisional mínima CU96-CU105. Legacy permanece sin reinterpretación. |
| CU106 | 9 | Referenciado | 'CU106', |
| CU107 | 3 | Referenciado | CU106:GSC,CU107:GSC,CU108:GSC,CU109:GSC,CU110:G, |
| CU108 | 3 | Referenciado | CU106:GSC,CU107:GSC,CU108:GSC,CU109:GSC,CU110:G, |
| CU109 | 3 | Referenciado | CU106:GSC,CU107:GSC,CU108:GSC,CU109:GSC,CU110:G, |
| CU110 | 5 | Referenciado | 'CU110', |
| CU111 | 6 | Referenciado | -- Persistencia M5 separada de pago_proveedor Legacy para CU111-CU120. |
| CU112 | 2 | Referenciado | CU111:GSC,CU112:GSC,CU113:GSC,CU114:GSC,CU115:GC,CU116:GSC,CU117:GSC,CU118:GSC,CU119:GSC,CU120:GC, |
| CU113 | 2 | Referenciado | CU111:GSC,CU112:GSC,CU113:GSC,CU114:GSC,CU115:GC,CU116:GSC,CU117:GSC,CU118:GSC,CU119:GSC,CU120:GC, |
| CU114 | 2 | Referenciado | CU111:GSC,CU112:GSC,CU113:GSC,CU114:GSC,CU115:GC,CU116:GSC,CU117:GSC,CU118:GSC,CU119:GSC,CU120:GC, |
| CU115 | 3 | Referenciado | CU111:GSC,CU112:GSC,CU113:GSC,CU114:GSC,CU115:GC,CU116:GSC,CU117:GSC,CU118:GSC,CU119:GSC,CU120:GC, |
| CU116 | 2 | Referenciado | CU111:GSC,CU112:GSC,CU113:GSC,CU114:GSC,CU115:GC,CU116:GSC,CU117:GSC,CU118:GSC,CU119:GSC,CU120:GC, |
| CU117 | 2 | Referenciado | CU111:GSC,CU112:GSC,CU113:GSC,CU114:GSC,CU115:GC,CU116:GSC,CU117:GSC,CU118:GSC,CU119:GSC,CU120:GC, |
| CU118 | 2 | Referenciado | CU111:GSC,CU112:GSC,CU113:GSC,CU114:GSC,CU115:GC,CU116:GSC,CU117:GSC,CU118:GSC,CU119:GSC,CU120:GC, |
| CU119 | 2 | Referenciado | CU111:GSC,CU112:GSC,CU113:GSC,CU114:GSC,CU115:GC,CU116:GSC,CU117:GSC,CU118:GSC,CU119:GSC,CU120:GC, |
| CU120 | 5 | Referenciado | -- Persistencia M5 separada de pago_proveedor Legacy para CU111-CU120. |
| CU121 | 4 | Referenciado | -- Efectos postpago y control bancario para CU121-CU126. |
| CU122 | 2 | Referenciado | CU121:['CU120'],CU122:['CU121'],CU123:['CU118'],CU124:['CU123'],CU125:['CU123'],CU126:['CU123'], |
| CU123 | 4 | Referenciado | CU121:['CU120'],CU122:['CU121'],CU123:['CU118'],CU124:['CU123'],CU125:['CU123'],CU126:['CU123'], |
| CU124 | 4 | Referenciado | COMMENT ON TABLE finanzas.anulacion_movimiento_pago_m5 IS 'TEMPORAL_M5_DB_PATCH: CU124 conserva el pago original y registra que no ocurrió'; |
| CU125 | 4 | Referenciado | COMMENT ON TABLE finanzas.reversion_movimiento_pago_m5 IS 'TEMPORAL_M5_DB_PATCH: CU125 registra devoluciones posteriores del proveedor'; |
| CU126 | 4 | Referenciado | -- Efectos postpago y control bancario para CU121-CU126. |
| CU127 | 4 | Referenciado | -- Ajustes documentales, saldos a favor e historial de evidencia para CU127-CU131. |
| CU128 | 5 | Referenciado | COMMENT ON TABLE finanzas.ajuste_obligacion_proveedor_m5 IS 'TEMPORAL_M5_DB_PATCH: ledger inmutable de NC y ND para CU128-CU130'; |
| CU129 | 4 | Referenciado | CU127:GC,CU128:GSC,CU129:GSC,CU130:GC,CU131:GSC, |
| CU130 | 5 | Referenciado | COMMENT ON TABLE finanzas.ajuste_obligacion_proveedor_m5 IS 'TEMPORAL_M5_DB_PATCH: ledger inmutable de NC y ND para CU128-CU130'; |
| CU131 | 5 | Referenciado | -- Ajustes documentales, saldos a favor e historial de evidencia para CU127-CU131. |
| CU132 | 6 | Referenciado | -- TEMPORAL_M5_DB_PATCH: CU132-CU137. |
| CU133 | 4 | Referenciado | // TEMPORAL_M5_DB_PATCH_PENDIENTE CU132-CU133: el disponible menor al generado indica compensaciones activas. |
| CU134 | 7 | Referenciado | 'CU134', |
| CU135 | 3 | Referenciado | CU132:GC,CU133:GC,CU134:GC,CU135:GC,CU136:GC,CU137:G, |
| CU136 | 3 | Referenciado | CU132:GC,CU133:GC,CU134:GC,CU135:GC,CU136:GC,CU137:G, |
| CU137 | 5 | Referenciado | 'CU137', |
| CU138 | 5 | Referenciado | -- TEMPORAL_M5_DB_PATCH: CU138-CU145. |
| CU139 | 5 | Referenciado | COMMENT ON TABLE finanzas.solicitud_reasignacion_costo_m5 IS 'TEMPORAL_M5_DB_PATCH: ledger CU139-CU140; no modifica deuda ni categoria'; |
| CU140 | 4 | Referenciado | COMMENT ON TABLE finanzas.solicitud_reasignacion_costo_m5 IS 'TEMPORAL_M5_DB_PATCH: ledger CU139-CU140; no modifica deuda ni categoria'; |
| CU141 | 3 | Referenciado | CU138:GSC,CU139:GSC,CU140:G,CU141:GC,CU142:GSC,CU143:GSC,CU144:GSC,CU145:GSC, |
| CU142 | 5 | Referenciado | <Route path="envios-importaciones" element={<Protegido permiso="CU142"><EnviosImportaciones /></Protegido>} /> |
| CU143 | 3 | Referenciado | CU138:GSC,CU139:GSC,CU140:G,CU141:GC,CU142:GSC,CU143:GSC,CU144:GSC,CU145:GSC, |
| CU144 | 3 | Referenciado | CU138:GSC,CU139:GSC,CU140:G,CU141:GC,CU142:GSC,CU143:GSC,CU144:GSC,CU145:GSC, |
| CU145 | 4 | Referenciado | -- TEMPORAL_M5_DB_PATCH: CU138-CU145. |
| CU146 | 4 | Referenciado | -- TEMPORAL_M5_DB_PATCH: CU146-CU154. Caja Chica mensual y ciclo final de envios. |
| CU147 | 3 | Referenciado | CU146:GSC,CU147:GSC,CU148:GC,CU149:GSC,CU150:G,CU151:GSC,CU152:GSC,CU153:GC,CU154:GC, |
| CU148 | 3 | Referenciado | CU146:GSC,CU147:GSC,CU148:GC,CU149:GSC,CU150:G,CU151:GSC,CU152:GSC,CU153:GC,CU154:GC, |
| CU149 | 6 | Referenciado | <Route path="caja-chica" element={<Protegido permiso="CU149"><CajaChica /></Protegido>} /> |
| CU150 | 3 | Referenciado | 'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150', |
| CU151 | 4 | Referenciado | CU146:GSC,CU147:GSC,CU148:GC,CU149:GSC,CU150:G,CU151:GSC,CU152:GSC,CU153:GC,CU154:GC, |
| CU152 | 4 | Referenciado | CU146:GSC,CU147:GSC,CU148:GC,CU149:GSC,CU150:G,CU151:GSC,CU152:GSC,CU153:GC,CU154:GC, |
| CU153 | 3 | Referenciado | CU146:GSC,CU147:GSC,CU148:GC,CU149:GSC,CU150:G,CU151:GSC,CU152:GSC,CU153:GC,CU154:GC, |
| CU154 | 5 | Referenciado | -- TEMPORAL_M5_DB_PATCH: CU146-CU154. Caja Chica mensual y ciclo final de envios. |
| CU155 | 9 | Referenciado | 'CU155', |
| CU156 | 4 | Referenciado | CU155:'Ver empleados y áreas de trabajo', CU156:'Crear empleado', CU157:'Editar empleado y gestionar áreas de trabajo', |
| CU157 | 10 | Referenciado | 'CU157', |
| CU158 | 3 | Referenciado | CU158:['CU156'], |
| CU159 | 4 | Referenciado | CU159:['CU156','CU162'], |
| CU160 | 5 | Referenciado | CU159:[],CU160:[],CU161:[],CU162:[],CU163:[],CU164:[],CU165:[],CU166:[], |
| CU161 | 3 | Referenciado | CU159:[],CU160:[],CU161:[],CU162:[],CU163:[],CU164:[],CU165:[],CU166:[], |
| CU162 | 7 | Referenciado | 'CU162', |
| CU163 | 7 | Referenciado | 'CU163', |
| CU164 | 7 | Referenciado | 'CU164', |
| CU165 | 7 | Referenciado | 'CU165', |
| CU166 | 7 | Referenciado | 'CU166', |
| CU167 | 11 | Referenciado | 'CU167', |
| CU168 | 8 | Referenciado | 'CU168', |
| CU169 | 9 | Referenciado | 'CU169', |
| CU170 | 8 | Referenciado | 'CU170', |
| CU171 | 8 | Referenciado | 'CU171', |
| CU172 | 6 | Referenciado | <Route path="detalle-remuneracion" element={<Protegido permiso={['CU172','CU173','CU174','CU175','CU176','CU177','CU179','CU180','CU182','CU183','CU184']}><DetalleRemuneracion /></Protegido>} /> |
| CU173 | 6 | Referenciado | -- CU173 conserva una decisión independiente por incidencia, sin mover el retrabajo desde Terreno. |
| CU174 | 7 | Referenciado | -- Scaffolding individual para CU174-CU177. No implementa población, cálculo ni cierre CU178-CU180. |
| CU175 | 6 | Referenciado | <Route path="detalle-remuneracion" element={<Protegido permiso={['CU172','CU173','CU174','CU175','CU176','CU177','CU179','CU180','CU182','CU183','CU184']}><DetalleRemuneracion /></Protegido>} /> |
| CU176 | 6 | Referenciado | <Route path="detalle-remuneracion" element={<Protegido permiso={['CU172','CU173','CU174','CU175','CU176','CU177','CU179','CU180','CU182','CU183','CU184']}><DetalleRemuneracion /></Protegido>} /> |
| CU177 | 7 | Referenciado | -- Scaffolding individual para CU174-CU177. No implementa población, cálculo ni cierre CU178-CU180. |
| CU178 | 6 | Referenciado | -- Scaffolding individual para CU174-CU177. No implementa población, cálculo ni cierre CU178-CU180. |
| CU179 | 8 | Referenciado | <Route path="detalle-remuneracion" element={<Protegido permiso={['CU172','CU173','CU174','CU175','CU176','CU177','CU179','CU180','CU182','CU183','CU184']}><DetalleRemuneracion /></Protegido>} /> |
| CU180 | 7 | Referenciado | -- Scaffolding individual para CU174-CU177. No implementa población, cálculo ni cierre CU178-CU180. |
| CU181 | 5 | Referenciado | <Route path="periodos-remuneracion" element={<Protegido permiso={['CU178','CU181']}><PeriodosRemuneracion /></Protegido>} /> |
| CU182 | 10 | Referenciado | -- Corrige la cardinalidad del scaffolding sin implementar el flujo de reemplazo CU182. |
| CU183 | 7 | Referenciado | <Route path="detalle-remuneracion" element={<Protegido permiso={['CU172','CU173','CU174','CU175','CU176','CU177','CU179','CU180','CU182','CU183','CU184']}><DetalleRemuneracion /></Protegido>} /> |
| CU184 | 6 | Referenciado | <Route path="detalle-remuneracion" element={<Protegido permiso={['CU172','CU173','CU174','CU175','CU176','CU177','CU179','CU180','CU182','CU183','CU184']}><DetalleRemuneracion /></Protegido>} /> |
| CU185 | 5 | Referenciado | <Route path="pagos-remuneraciones" element={<Protegido permiso={['CU185','CU186','CU187','CU188','CU189','CU190']}><RegistroPagosRemuneracion /></Protegido>} /> |
| CU186 | 7 | Referenciado | <Route path="pagos-remuneraciones" element={<Protegido permiso={['CU185','CU186','CU187','CU188','CU189','CU190']}><RegistroPagosRemuneracion /></Protegido>} /> |
| CU187 | 8 | Referenciado | <Route path="pagos-remuneraciones" element={<Protegido permiso={['CU185','CU186','CU187','CU188','CU189','CU190']}><RegistroPagosRemuneracion /></Protegido>} /> |
| CU188 | 4 | Referenciado | <Route path="pagos-remuneraciones" element={<Protegido permiso={['CU185','CU186','CU187','CU188','CU189','CU190']}><RegistroPagosRemuneracion /></Protegido>} /> |
| CU189 | 6 | Referenciado | <Route path="pagos-remuneraciones" element={<Protegido permiso={['CU185','CU186','CU187','CU188','CU189','CU190']}><RegistroPagosRemuneracion /></Protegido>} /> |
| CU190 | 5 | Referenciado | <Route path="pagos-remuneraciones" element={<Protegido permiso={['CU185','CU186','CU187','CU188','CU189','CU190']}><RegistroPagosRemuneracion /></Protegido>} /> |
| CU191 | 6 | Referenciado | <Route path="documentos-remuneracion" element={<Protegido permiso={['CU191','CU192','CU193']}><DocumentosRemuneracion /></Protegido>} /> |
| CU192 | 5 | Referenciado | <Route path="documentos-remuneracion" element={<Protegido permiso={['CU191','CU192','CU193']}><DocumentosRemuneracion /></Protegido>} /> |
| CU193 | 5 | Referenciado | <Route path="documentos-remuneracion" element={<Protegido permiso={['CU191','CU192','CU193']}><DocumentosRemuneracion /></Protegido>} /> |
| CU194 | 3 | Referenciado | CU194:['CU179'], |
| CU195 | 3 | Referenciado | CU195:['CU180'], |
| CU196 | 6 | Referenciado | <Route path="honorarios" element={<Protegido permiso={['CU196','CU197','CU198']}><Honorarios /></Protegido>} /> |
| CU197 | 7 | Referenciado | <Route path="honorarios" element={<Protegido permiso={['CU196','CU197','CU198']}><Honorarios /></Protegido>} /> |
| CU198 | 14 | Referenciado | <Route path="honorarios" element={<Protegido permiso={['CU196','CU197','CU198']}><Honorarios /></Protegido>} /> |
| CU199 | 15 | Referenciado | 'CU199', 'CU200', 'CU201', 'CU202', 'CU203', 'CU204', 'CU205', 'CU206', |
| CU200 | 9 | Referenciado | 'CU199', 'CU200', 'CU201', 'CU202', 'CU203', 'CU204', 'CU205', 'CU206', |
| CU201 | 14 | Referenciado | 'CU199', 'CU200', 'CU201', 'CU202', 'CU203', 'CU204', 'CU205', 'CU206', |
| CU202 | 29 | Referenciado | 'CU199', 'CU200', 'CU201', 'CU202', 'CU203', 'CU204', 'CU205', 'CU206', |
| CU203 | 17 | Referenciado | 'CU199', 'CU200', 'CU201', 'CU202', 'CU203', 'CU204', 'CU205', 'CU206', |
| CU204 | 19 | Referenciado | 'CU199', 'CU200', 'CU201', 'CU202', 'CU203', 'CU204', 'CU205', 'CU206', |
| CU205 | 27 | Referenciado | 'CU199', 'CU200', 'CU201', 'CU202', 'CU203', 'CU204', 'CU205', 'CU206', |
| CU206 | 17 | Referenciado | 'CU199', 'CU200', 'CU201', 'CU202', 'CU203', 'CU204', 'CU205', 'CU206', |
| CU207 | 20 | Referenciado | 'CU207', 'CU208', 'CU209', 'CU210', 'CU211', 'CU212', 'CU213', |
| CU208 | 8 | Referenciado | 'CU207', 'CU208', 'CU209', 'CU210', 'CU211', 'CU212', 'CU213', |
| CU209 | 17 | Referenciado | 'CU207', 'CU208', 'CU209', 'CU210', 'CU211', 'CU212', 'CU213', |
| CU210 | 10 | Referenciado | 'CU207', 'CU208', 'CU209', 'CU210', 'CU211', 'CU212', 'CU213', |
| CU211 | 14 | Referenciado | 'CU207', 'CU208', 'CU209', 'CU210', 'CU211', 'CU212', 'CU213', |
| CU212 | 18 | Referenciado | 'CU207', 'CU208', 'CU209', 'CU210', 'CU211', 'CU212', 'CU213', |
| CU213 | 15 | Referenciado | 'CU207', 'CU208', 'CU209', 'CU210', 'CU211', 'CU212', 'CU213', |
| CU214 | 6 | Referenciado | CU214:[], |
| CU215 | 23 | Referenciado | <Route path="dashboard-m7" element={<Protegido permiso="CU215"><PanelGeneralM7 /></Protegido>} /> |
| CU216 | 8 | Referenciado | <Route path="dashboard-m7/centro-atencion" element={<Protegido permiso="CU216"><CentroAtencionM7 /></Protegido>} /> |
| CU217 | 5 | Referenciado | <Route path="dashboard-m7/cotizaciones-pendientes" element={<Protegido permiso="CU217"><CotizacionesPendientesM7 /></Protegido>} /> |
| CU218 | 8 | Referenciado | <Route path="dashboard-m7/ventas" element={<Protegido permiso={['CU218','CU219','CU220']}><AnalisisVentasM7 /></Protegido>} /> |
| CU219 | 9 | Referenciado | <Route path="dashboard-m7/ventas" element={<Protegido permiso={['CU218','CU219','CU220']}><AnalisisVentasM7 /></Protegido>} /> |
| CU220 | 9 | Referenciado | <Route path="dashboard-m7/ventas" element={<Protegido permiso={['CU218','CU219','CU220']}><AnalisisVentasM7 /></Protegido>} /> |
| CU221 | 4 | Referenciado | <Route path="dashboard-m7/clientes/:id" element={<Protegido permiso="CU221"><ContextoClienteM7 /></Protegido>} /> |
| CU222 | 7 | Referenciado | 'cuentas-cobrar': { permisos: ['CU222', 'CU223', 'CU225'], titulo: 'Cuentas por Cobrar y Cobranza', cargar: () => this.consultarCuentasCobrar(consulta, permisos) }, |
| CU223 | 6 | Referenciado | 'cuentas-cobrar': { permisos: ['CU222', 'CU223', 'CU225'], titulo: 'Cuentas por Cobrar y Cobranza', cargar: () => this.consultarCuentasCobrar(consulta, permisos) }, |
| CU224 | 5 | Referenciado | <Route path="dashboard-m7/cuentas-cobrar" element={<Protegido permiso={['CU222','CU223','CU224','CU225']}><CuentasCobrarM7 /></Protegido>} /> |
| CU225 | 7 | Referenciado | 'cuentas-cobrar': { permisos: ['CU222', 'CU223', 'CU225'], titulo: 'Cuentas por Cobrar y Cobranza', cargar: () => this.consultarCuentasCobrar(consulta, permisos) }, |
| CU226 | 7 | Referenciado | 'cuentas-pagar': { permisos: ['CU226', 'CU227'], titulo: 'Cuentas por Pagar', cargar: () => this.consultarCuentasPagar(consulta, permisos) }, |
| CU227 | 6 | Referenciado | 'cuentas-pagar': { permisos: ['CU226', 'CU227'], titulo: 'Cuentas por Pagar', cargar: () => this.consultarCuentasPagar(consulta, permisos) }, |
| CU228 | 11 | Referenciado | - Liquidez: naturalezas reales, monedas activas y CU228. |
| CU229 | 4 | Referenciado | <Route path="dashboard-m7/liquidez" element={<Protegido permiso={['CU228','CU229','CU230','CU231']}><LiquidezM7 /></Protegido>} /> |
| CU230 | 7 | Referenciado | <Route path="dashboard-m7/liquidez" element={<Protegido permiso={['CU228','CU229','CU230','CU231']}><LiquidezM7 /></Protegido>} /> |
| CU231 | 7 | Referenciado | <Route path="dashboard-m7/liquidez" element={<Protegido permiso={['CU228','CU229','CU230','CU231']}><LiquidezM7 /></Protegido>} /> |
| CU232 | 10 | Referenciado | 'CU232', |
| CU233 | 8 | Referenciado | <Route path="dashboard-m7/margen-proyectos" element={<Protegido permiso={['CU233','CU234','CU235']}><MargenProyectosM7 /></Protegido>} /> |
| CU234 | 5 | Referenciado | <Route path="dashboard-m7/margen-proyectos" element={<Protegido permiso={['CU233','CU234','CU235']}><MargenProyectosM7 /></Protegido>} /> |
| CU235 | 5 | Referenciado | <Route path="dashboard-m7/margen-proyectos" element={<Protegido permiso={['CU233','CU234','CU235']}><MargenProyectosM7 /></Protegido>} /> |
| CU236 | 4 | Referenciado | <Route path="dashboard-m7/proyectos/exposicion" element={<Protegido permiso="CU236"><ExposicionProyectosM7 /></Protegido>} /> |
| CU237 | 5 | Referenciado | <Route path="dashboard-m7/proyectos/:id" element={<Protegido permiso="CU237"><ContextoProyectoM7 /></Protegido>} /> |
| CU238 | 11 | Referenciado | <Route path="dashboard-m7/resumenes" element={<Protegido permiso={['CU238','CU239']}><ResumenesM7 /></Protegido>} /> |
| CU239 | 6 | Referenciado | <Route path="dashboard-m7/resumenes" element={<Protegido permiso={['CU238','CU239']}><ResumenesM7 /></Protegido>} /> |
| CU240 | 8 | Referenciado | <Route path="dashboard-m7/control" element={<Protegido permiso={['CU228','CU232','CU240','CU241','CU243','CU244','CU249','CU251','CU254','CU255','CU256','CU257','CU258']}><DeltaControladoM7 /></Protegido>} /> |
| CU241 | 8 | Referenciado | <Route path="dashboard-m7/control" element={<Protegido permiso={['CU228','CU232','CU240','CU241','CU243','CU244','CU249','CU251','CU254','CU255','CU256','CU257','CU258']}><DeltaControladoM7 /></Protegido>} /> |
| CU242 | 8 | Referenciado | <Route path="dashboard-m7/operacion" element={<Protegido permiso={['CU242','CU247','CU248','CU250','CU252','CU253']}><OperacionCostosM7 /></Protegido>} /> |
| CU243 | 6 | Referenciado | <Route path="dashboard-m7/control" element={<Protegido permiso={['CU228','CU232','CU240','CU241','CU243','CU244','CU249','CU251','CU254','CU255','CU256','CU257','CU258']}><DeltaControladoM7 /></Protegido>} /> |
| CU244 | 8 | Referenciado | 'CU244', |
| CU245 | 7 | Referenciado | assert.equal(operacionesPermiso.descargarPdfDashboardM7, 'CU245'); |
| CU246 | 19 | Referenciado | 'CU246', |
| CU247 | 9 | Referenciado | <Route path="dashboard-m7/operacion" element={<Protegido permiso={['CU242','CU247','CU248','CU250','CU252','CU253']}><OperacionCostosM7 /></Protegido>} /> |
| CU248 | 6 | Referenciado | <Route path="dashboard-m7/operacion" element={<Protegido permiso={['CU242','CU247','CU248','CU250','CU252','CU253']}><OperacionCostosM7 /></Protegido>} /> |
| CU249 | 7 | Referenciado | <Route path="dashboard-m7/control" element={<Protegido permiso={['CU228','CU232','CU240','CU241','CU243','CU244','CU249','CU251','CU254','CU255','CU256','CU257','CU258']}><DeltaControladoM7 /></Protegido>} /> |
| CU250 | 8 | Referenciado | <Route path="dashboard-m7/operacion" element={<Protegido permiso={['CU242','CU247','CU248','CU250','CU252','CU253']}><OperacionCostosM7 /></Protegido>} /> |
| CU251 | 6 | Referenciado | <Route path="dashboard-m7/control" element={<Protegido permiso={['CU228','CU232','CU240','CU241','CU243','CU244','CU249','CU251','CU254','CU255','CU256','CU257','CU258']}><DeltaControladoM7 /></Protegido>} /> |
| CU252 | 6 | Referenciado | <Route path="dashboard-m7/operacion" element={<Protegido permiso={['CU242','CU247','CU248','CU250','CU252','CU253']}><OperacionCostosM7 /></Protegido>} /> |
| CU253 | 8 | Referenciado | <Route path="dashboard-m7/operacion" element={<Protegido permiso={['CU242','CU247','CU248','CU250','CU252','CU253']}><OperacionCostosM7 /></Protegido>} /> |
| CU254 | 7 | Referenciado | <Route path="dashboard-m7/control" element={<Protegido permiso={['CU228','CU232','CU240','CU241','CU243','CU244','CU249','CU251','CU254','CU255','CU256','CU257','CU258']}><DeltaControladoM7 /></Protegido>} /> |
| CU255 | 7 | Referenciado | <Route path="dashboard-m7/control" element={<Protegido permiso={['CU228','CU232','CU240','CU241','CU243','CU244','CU249','CU251','CU254','CU255','CU256','CU257','CU258']}><DeltaControladoM7 /></Protegido>} /> |
| CU256 | 7 | Referenciado | <Route path="dashboard-m7/control" element={<Protegido permiso={['CU228','CU232','CU240','CU241','CU243','CU244','CU249','CU251','CU254','CU255','CU256','CU257','CU258']}><DeltaControladoM7 /></Protegido>} /> |
| CU257 | 9 | Referenciado | 'CU257', |
| CU258 | 9 | Referenciado | <Route path="dashboard-m7/control" element={<Protegido permiso={['CU228','CU232','CU240','CU241','CU243','CU244','CU249','CU251','CU254','CU255','CU256','CU257','CU258']}><DeltaControladoM7 /></Protegido>} /> |
| CU259 | 11 | Referenciado | 'CU259', TRUE, FALSE |
| CU260 | 7 | Referenciado | ('CU260','Crear y enviar solicitud inicial'),('CU261','Crear y enviar solicitud de excepción'),('CU262','Cancelar solicitud crediticia'), |
| CU261 | 6 | Referenciado | ('CU260','Crear y enviar solicitud inicial'),('CU261','Crear y enviar solicitud de excepción'),('CU262','Cancelar solicitud crediticia'), |
| CU262 | 6 | Referenciado | ('CU260','Crear y enviar solicitud inicial'),('CU261','Crear y enviar solicitud de excepción'),('CU262','Cancelar solicitud crediticia'), |
| CU263 | 5 | Referenciado | ('CU263','Resolver solicitud inicial'),('CU264','Resolver solicitud de excepción'),('CU265','Modificar cupo y vigencia'), |
| CU264 | 5 | Referenciado | ('CU263','Resolver solicitud inicial'),('CU264','Resolver solicitud de excepción'),('CU265','Modificar cupo y vigencia'), |
| CU265 | 5 | Referenciado | ('CU263','Resolver solicitud inicial'),('CU264','Resolver solicitud de excepción'),('CU265','Modificar cupo y vigencia'), |
| CU266 | 5 | Referenciado | ('CU266','Suspender Crédito'),('CU267','Reactivar Crédito'),('CU268','Configurar límite global'), |
| CU267 | 5 | Referenciado | ('CU266','Suspender Crédito'),('CU267','Reactivar Crédito'),('CU268','Configurar límite global'), |
| CU268 | 10 | Referenciado | 'CU268', |
| CU269 | 5 | Referenciado | ('CU269','Consultar exposición global'),('CU270','Consultar situación crediticia'),('CU271','Consultar historial crediticio'), |
| CU270 | 7 | Referenciado | ('CU269','Consultar exposición global'),('CU270','Consultar situación crediticia'),('CU271','Consultar historial crediticio'), |
| CU271 | 5 | Referenciado | ('CU269','Consultar exposición global'),('CU270','Consultar situación crediticia'),('CU271','Consultar historial crediticio'), |
| CU272 | 7 | Referenciado | ('CU272','Exportar Crédito contextual'),('CU273','Consultar distribución crediticia'),('CU274','Consultar composición del Crédito comprometido') |
| CU273 | 4 | Referenciado | ('CU272','Exportar Crédito contextual'),('CU273','Consultar distribución crediticia'),('CU274','Consultar composición del Crédito comprometido') |
| CU274 | 9 | Referenciado | ('CU272','Exportar Crédito contextual'),('CU273','Consultar distribución crediticia'),('CU274','Consultar composición del Crédito comprometido') |
| CU275 | 1 | Referenciado | await t.test('23 CU275 no existe y F047 no tiene umbral hardcodeado',()=>{assert.equal(codigosTodosLosCU.includes('CU275'),false);assert.equal(Object.hasOwn(operacionesPermiso,'CU275'),false)}); |
| CU355 | 18 | Referenciado | 'CU355', |
| CU359 | 9 | Referenciado | 'CU74','CU355','CU359','CU360','CU378','CU379','CU380','CU381', |
| CU360 | 30 | Referenciado | 'CU360', |
| CU361 | 9 | Referenciado | ('CU361', 'crear catálogo comercial', 'Crear familias y fichas comerciales de productos', 'Crear productos comerciales'), |
| CU362 | 10 | Referenciado | ('CU362', 'modificar catálogo comercial', 'Modificar familias y borradores comerciales', 'Modificar productos comerciales'), |
| CU363 | 6 | Referenciado | ('CU363', 'desactivar catálogo comercial', 'Desactivar familias y fichas comerciales', 'Desactivar productos comerciales'), |
| CU364 | 5 | Referenciado | ('CU364', 'reactivar catálogo comercial', 'Reactivar familias y fichas comerciales', 'Reactivar productos comerciales'), |
| CU365 | 10 | Referenciado | ('CU365', 'publicar versión comercial', 'Publicar versiones inmutables de fichas comerciales', 'Publicar productos comerciales'), |
| CU366 | 17 | Referenciado | ('CU366', 'administrar vínculos comerciales', 'Vincular fichas comerciales con Terreno e Inventario', 'Vincular productos comerciales'), |
| CU367 | 20 | Referenciado | ('CU367', 'consultar historial comercial', 'Consultar versiones e historial del catálogo comercial', 'Consultar historial comercial') |
| CU368 | 14 | Referenciado | ('CU368','gestionar precios comerciales','Gestionar precios comerciales versionados','Gestionar precios comerciales'), |
| CU369 | 10 | Referenciado | ('CU369','gestionar opcionales comerciales','Gestionar opcionales, compatibilidades y precios','Gestionar opcionales comerciales'), |
| CU370 | 12 | Referenciado | ('CU370','gestionar tarifas comerciales','Gestionar tarifas y cobertura comercial de instalación','Gestionar tarifas comerciales'), |
| CU371 | 10 | Referenciado | ('CU371','editar condiciones comerciales','Crear y versionar condiciones comerciales','Editar condiciones comerciales'), |
| CU372 | 10 | Referenciado | ('CU372','publicar condiciones comerciales','Publicar condiciones comerciales versionadas','Publicar condiciones comerciales'), |
| CU373 | 8 | Referenciado | ('CU373','cargar documentos comerciales','Cargar y reemplazar versiones de documentos comerciales','Cargar documentos comerciales'), |
| CU374 | 10 | Referenciado | ('CU374','gestionar galería comercial','Gestionar fotografías, galería y asociaciones de productos','Gestionar galería comercial'), |
| CU375 | 11 | Referenciado | ('CU375','previsualizar documentos comerciales','Solicitar vista previa de documentos autorizados','Previsualizar documentos comerciales'), |
| CU376 | 14 | Referenciado | ('CU376','descargar documentos comerciales','Descargar documentos comerciales autorizados','Descargar documentos comerciales') |
| CU377 | 16 | BLOQUEADO/NO APROBADO | * activo y aprobado. CU377 permanece excluido mientras no exista aprobación formal. |
| CU378 | 13 | Referenciado | 'CU74','CU355','CU359','CU360','CU378','CU379','CU380','CU381', |
| CU379 | 13 | Referenciado | 'CU74','CU355','CU359','CU360','CU378','CU379','CU380','CU381', |
| CU380 | 12 | Referenciado | 'CU74','CU355','CU359','CU360','CU378','CU379','CU380','CU381', |
| CU381 | 12 | Referenciado | 'CU74','CU355','CU359','CU360','CU378','CU379','CU380','CU381', |
## Criterio de las fichas
Cada ficha contiene los 23 campos solicitados. Los enlaces se derivan de referencias reales. Cuando el patron estatico no demuestra una relacion se escribe NO CONFIRMADO EN EL REPOSITORIO; no se completa por intuicion.
## CU01
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | # Auditoría conservadora de cobertura CU01–CU74 |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU01 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/CatalogoClientes/CatalogoClientes.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M1Controller.ts |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | Controladores/pruebas/m9-productores-failclosed.test.cjs; auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/m4-permisos-funcionales.test.cjs; Controladores/pruebas/m4.test.cjs; Controladores/pruebas/m9-productores-failclosed.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU02, CU03, CU04, CU11, CU74 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m4-permisos-funcionales.test.cjs`
- `Controladores/pruebas/m4.test.cjs`
- `Controladores/pruebas/m9-productores-failclosed.test.cjs`
- `Controladores/src/controladores/M1Controller.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/CatalogoClientes/CatalogoClientes.tsx`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
- `documentacion/DELTA_M4.md`
- `documentacion/ESTADO_TECNICO_VIGENTE.md`
- `documentacion/ETAPA_1_I2.md`
### Evidencia textual
- `# Auditoría conservadora de cobertura CU01–CU74`
- `# Auditoría inicial de cobertura CU01 a CU74`
- `/** M1 CU01–CU11: catálogo, ficha y mantenimiento de clientes. */`
- `CU01:'Crear cliente', CU02:'Editar cliente', CU03:'Desactivar cliente', CU04:'Reactivar cliente',`
## CU02
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU01:'Crear cliente', CU02:'Editar cliente', CU03:'Desactivar cliente', CU04:'Reactivar cliente', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU02 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/CatalogoClientes/CatalogoClientes.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; Vistas/src/views/Seguridad/Usuarios.test.tsx; Vistas/src/views/Seguridad/permisosM4.test.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Vistas/src/views/Seguridad/Usuarios.test.tsx; Vistas/src/views/Seguridad/permisosM4.test.ts |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU01, CU03, CU04, CU05, CU06, CU07, CU08, CU09, CU10, CU11 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/CatalogoClientes/CatalogoClientes.tsx`
- `Vistas/src/views/Seguridad/Usuarios.test.tsx`
- `Vistas/src/views/Seguridad/permisosM4.test.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `CU01:'Crear cliente', CU02:'Editar cliente', CU03:'Desactivar cliente', CU04:'Reactivar cliente',`
- `CU01:G,CU02:G,CU03:G,CU04:G,CU05:GSC,CU06:GSC,CU07:GSC,CU08:GSC,CU09:GSC,CU10:GSC,CU11:GSC,`
- `const dependencias=[{permiso:'CU02',requiere:'CU05'}];`
- `it('impide quitar un permiso requerido por otra acción seleccionada',()=>{expect(quitarConValidacion(['CU05','CU02'],'CU05',dependencias).bloqueadoPor).toEqual(['CU02'])});`
## CU03
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU01:'Crear cliente', CU02:'Editar cliente', CU03:'Desactivar cliente', CU04:'Reactivar cliente', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU03 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/CatalogoClientes/CatalogoClientes.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | NO CONFIRMADO EN EL REPOSITORIO |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU01, CU02, CU04, CU05, CU06, CU07, CU08, CU09, CU10, CU11 |
| 23. Estado actual | REGISTRADO O REFERENCIADO; COBERTURA FOCAL NO ENLAZADA |
### Trazabilidad completa de archivos
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/CatalogoClientes/CatalogoClientes.tsx`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `CU01:'Crear cliente', CU02:'Editar cliente', CU03:'Desactivar cliente', CU04:'Reactivar cliente',`
- `CU01:G,CU02:G,CU03:G,CU04:G,CU05:GSC,CU06:GSC,CU07:GSC,CU08:GSC,CU09:GSC,CU10:GSC,CU11:GSC,`
- `| CU03 | Desactivar cliente | M1 | `M1Controller.cambiarEstadoCliente` | Catálogo / acción | CLIENTE_FINANCIERO | operaciones abiertas | PARCIAL |`
- `| CU03 | IMPLEMENTADO | Sí | Sí | Sí | Sí | No | `/clientes` → `C_Finanzas.desactivarCliente` → `M1Controller.cambiarEstadoCliente` | SIN PRUEBA AUTOMATIZADA — validado manualmente |`
## CU3
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | assert.doesNotMatch(vista, /CU3(?:6[8-9]\|[7-9][0-9])/); |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | General |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU3 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | NO CONFIRMADO EN EL REPOSITORIO |
| 15. Validaciones | NO CONFIRMADO EN EL REPOSITORIO |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/mantenedores-modal-ux.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | Ninguna dependencia textual inequivoca detectada. |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/mantenedores-modal-ux.test.cjs`
### Evidencia textual
- `assert.doesNotMatch(vista, /CU3(?:6[8-9]|[7-9][0-9])/);`
## CU04
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU01:'Crear cliente', CU02:'Editar cliente', CU03:'Desactivar cliente', CU04:'Reactivar cliente', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU04 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/CatalogoClientes/CatalogoClientes.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | NO CONFIRMADO EN EL REPOSITORIO |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU01, CU02, CU03, CU05, CU06, CU07, CU08, CU09, CU10, CU11 |
| 23. Estado actual | REGISTRADO O REFERENCIADO; COBERTURA FOCAL NO ENLAZADA |
### Trazabilidad completa de archivos
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/CatalogoClientes/CatalogoClientes.tsx`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
- `documentacion/DELTA_M4.md`
- `documentacion/ETAPA_1_I2.md`
### Evidencia textual
- `CU01:'Crear cliente', CU02:'Editar cliente', CU03:'Desactivar cliente', CU04:'Reactivar cliente',`
- `CU01:G,CU02:G,CU03:G,CU04:G,CU05:GSC,CU06:GSC,CU07:GSC,CU08:GSC,CU09:GSC,CU10:GSC,CU11:GSC,`
- `| CU04 | IMPLEMENTADO | Sí | Sí | Sí | Sí | No | `/clientes` → `C_Finanzas.reactivarCliente` → `M1Controller.cambiarEstadoCliente` | SIN PRUEBA AUTOMATIZADA — validado manualmente |`
- `| CU04 | Reactivar cliente | M1 | `M1Controller.cambiarEstadoCliente` | Catálogo / acción | CLIENTE_FINANCIERO | estado previo | PARCIAL |`
## CU05
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="clientes" element={<Protegido permiso="CU05"><CatalogoClientes /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU05 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; Vistas/src/views/Seguridad/Usuarios.test.tsx; Vistas/src/views/Seguridad/permisosM4.test.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | Controladores/pruebas/m9-autorizacion-e2e.test.cjs; auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/m4.test.cjs; Controladores/pruebas/m9-autorizacion-e2e.test.cjs; Vistas/src/views/PortalPrincipal/PortalPrincipal.test.tsx; Vistas/src/views/Seguridad/Usuarios.test.tsx; Vistas/src/views/Seguridad/permisosM4.test.ts |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU01, CU02, CU03, CU04, CU06, CU07, CU08, CU09, CU10, CU11 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m4.test.cjs`
- `Controladores/pruebas/m9-autorizacion-e2e.test.cjs`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/PortalPrincipal/PortalPrincipal.test.tsx`
- `Vistas/src/views/Seguridad/Usuarios.test.tsx`
- `Vistas/src/views/Seguridad/permisosM4.test.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `<Route path="clientes" element={<Protegido permiso="CU05"><CatalogoClientes /></Protegido>} />`
- `<Route path="finanzas" element={<Protegido permiso="CU05"><DashboardPrincipal /></Protegido>} />`
- `CU01:G,CU02:G,CU03:G,CU04:G,CU05:GSC,CU06:GSC,CU07:GSC,CU08:GSC,CU09:GSC,CU10:GSC,CU11:GSC,`
- `CU05:'Ver y buscar clientes', CU06:'Buscar clientes', CU07:'Filtrar clientes por estado', CU08:'Consultar información financiera del cliente', CU09:'Ver ficha del cliente',`
## CU06
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU01:G,CU02:G,CU03:G,CU04:G,CU05:GSC,CU06:GSC,CU07:GSC,CU08:GSC,CU09:GSC,CU10:GSC,CU11:GSC, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU06 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/CatalogoClientes/CatalogoClientes.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | Controladores/src/controladores/C_Finanzas.ts |
| 13. Controlador | Controladores/src/controladores/C_Finanzas.ts |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | NO CONFIRMADO EN EL REPOSITORIO |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU01, CU02, CU03, CU04, CU05, CU07, CU08, CU09, CU10, CU11 |
| 23. Estado actual | REGISTRADO O REFERENCIADO; COBERTURA FOCAL NO ENLAZADA |
### Trazabilidad completa de archivos
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/CatalogoClientes/CatalogoClientes.tsx`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `CU01:G,CU02:G,CU03:G,CU04:G,CU05:GSC,CU06:GSC,CU07:GSC,CU08:GSC,CU09:GSC,CU10:GSC,CU11:GSC,`
- `CU05:'Ver y buscar clientes', CU06:'Buscar clientes', CU07:'Filtrar clientes por estado', CU08:'Consultar información financiera del cliente', CU09:'Ver ficha del cliente',`
- `if(solicitud.consulta?.busqueda || solicitud.consulta?.search) adicionales.push('CU06');`
- `type="text" disabled={!sesion?.permisos.includes('CU06')}`
## CU07
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU01:G,CU02:G,CU03:G,CU04:G,CU05:GSC,CU06:GSC,CU07:GSC,CU08:GSC,CU09:GSC,CU10:GSC,CU11:GSC, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU07 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/CatalogoClientes/CatalogoClientes.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | Controladores/src/controladores/C_Finanzas.ts |
| 13. Controlador | Controladores/src/controladores/C_Finanzas.ts |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | NO CONFIRMADO EN EL REPOSITORIO |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU01, CU02, CU03, CU04, CU05, CU06, CU08, CU09, CU10, CU11 |
| 23. Estado actual | REGISTRADO O REFERENCIADO; COBERTURA FOCAL NO ENLAZADA |
### Trazabilidad completa de archivos
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/CatalogoClientes/CatalogoClientes.tsx`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `CU01:G,CU02:G,CU03:G,CU04:G,CU05:GSC,CU06:GSC,CU07:GSC,CU08:GSC,CU09:GSC,CU10:GSC,CU11:GSC,`
- `CU05:'Ver y buscar clientes', CU06:'Buscar clientes', CU07:'Filtrar clientes por estado', CU08:'Consultar información financiera del cliente', CU09:'Ver ficha del cliente',`
- `if(solicitud.consulta?.estado && solicitud.consulta.estado!=='activos') adicionales.push('CU07');`
- `| CU07 | Filtrar por estado | M1 | `listarClientes` | selector estado | CLIENTE_FINANCIERO | autorización CU07 | IMPLEMENTADO |`
## CU08
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU01:G,CU02:G,CU03:G,CU04:G,CU05:GSC,CU06:GSC,CU07:GSC,CU08:GSC,CU09:GSC,CU10:GSC,CU11:GSC, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU08 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/CatalogoClientes/CatalogoClientes.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | Controladores/src/controladores/C_Finanzas.ts |
| 13. Controlador | Controladores/src/controladores/C_Finanzas.ts |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | NO CONFIRMADO EN EL REPOSITORIO |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU01, CU02, CU03, CU04, CU05, CU06, CU07, CU09, CU10, CU11 |
| 23. Estado actual | REGISTRADO O REFERENCIADO; COBERTURA FOCAL NO ENLAZADA |
### Trazabilidad completa de archivos
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/CatalogoClientes/CatalogoClientes.tsx`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
- `documentacion/ETAPA_1_I2.md`
### Evidencia textual
- `CU01:G,CU02:G,CU03:G,CU04:G,CU05:GSC,CU06:GSC,CU07:GSC,CU08:GSC,CU09:GSC,CU10:GSC,CU11:GSC,`
- `CU05:'Ver y buscar clientes', CU06:'Buscar clientes', CU07:'Filtrar clientes por estado', CU08:'Consultar información financiera del cliente', CU09:'Ver ficha del cliente',`
- `if(solicitud.consulta?.deuda==='true' || solicitud.consulta?.morosos==='true') adicionales.push('CU08');`
- `type="checkbox" disabled={!sesion?.permisos.includes('CU08')}`
## CU09
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="clientes/:rut" element={<Protegido permiso="CU09"><VerFicha /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU09 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/m9/autorizacion.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | Controladores/pruebas/m9-autorizacion-e2e.test.cjs; Controladores/src/m9/autorizacion.ts; auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/m7-cierre-hallazgos.test.cjs; Controladores/pruebas/m7-cu216-cu221.test.cjs; Controladores/pruebas/m7-ventas-familia-navegacion.test.cjs; Controladores/pruebas/m9-autorizacion-e2e.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU01, CU02, CU03, CU04, CU05, CU06, CU07, CU08, CU10, CU11 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-cierre-hallazgos.test.cjs`
- `Controladores/pruebas/m7-cu216-cu221.test.cjs`
- `Controladores/pruebas/m7-ventas-familia-navegacion.test.cjs`
- `Controladores/pruebas/m9-autorizacion-e2e.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/m9/autorizacion.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `<Route path="clientes/:rut" element={<Protegido permiso="CU09"><VerFicha /></Protegido>} />`
- `CLIENTE:{permiso:'CU09',ruta:id=>`/clientes/${encodeURIComponent(id)}`},`
- `CU01:G,CU02:G,CU03:G,CU04:G,CU05:GSC,CU06:GSC,CU07:GSC,CU08:GSC,CU09:GSC,CU10:GSC,CU11:GSC,`
- `CU05:'Ver y buscar clientes', CU06:'Buscar clientes', CU07:'Filtrar clientes por estado', CU08:'Consultar información financiera del cliente', CU09:'Ver ficha del cliente',`
## CU10
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU01:G,CU02:G,CU03:G,CU04:G,CU05:GSC,CU06:GSC,CU07:GSC,CU08:GSC,CU09:GSC,CU10:GSC,CU11:GSC, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU10 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | NO CONFIRMADO EN EL REPOSITORIO |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU01, CU02, CU03, CU04, CU05, CU06, CU07, CU08, CU09, CU11 |
| 23. Estado actual | REGISTRADO O REFERENCIADO; COBERTURA FOCAL NO ENLAZADA |
### Trazabilidad completa de archivos
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
- `documentacion/DELTA_M4.md`
- `documentacion/ETAPA_1_I2.md`
### Evidencia textual
- `CU01:G,CU02:G,CU03:G,CU04:G,CU05:GSC,CU06:GSC,CU07:GSC,CU08:GSC,CU09:GSC,CU10:GSC,CU11:GSC,`
- `| CU10 | Filtrar/ordenar ficha | M1 | consulta parcial | ficha | historial compuesto | filtro/orden no completo | PARCIAL |`
- `| CU10 | IMPLEMENTADO | Sí | Sí | Sí | Sí | No | `/clientes/:rut` → `C_Finanzas.abrirFicha` → `M1Controller.abrirFicha` | SIN PRUEBA AUTOMATIZADA — validado manualmente |`
## CU11
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | /** M1 CU01–CU11: catálogo, ficha y mantenimiento de clientes. */ |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU11 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M1Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | NO CONFIRMADO EN EL REPOSITORIO |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU01, CU02, CU03, CU04, CU05, CU06, CU07, CU08, CU09, CU10 |
| 23. Estado actual | REGISTRADO O REFERENCIADO; COBERTURA FOCAL NO ENLAZADA |
### Trazabilidad completa de archivos
- `Controladores/src/controladores/M1Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
- `documentacion/DELTA_M4.md`
- `documentacion/ETAPA_1_I2.md`
### Evidencia textual
- `/** M1 CU01–CU11: catálogo, ficha y mantenimiento de clientes. */`
- `CU01:G,CU02:G,CU03:G,CU04:G,CU05:GSC,CU06:GSC,CU07:GSC,CU08:GSC,CU09:GSC,CU10:GSC,CU11:GSC,`
- `| CU11 | Filtrar/ordenar catálogo | M1 | orden fijo | catálogo | CLIENTE_FINANCIERO | orden no configurable | PARCIAL |`
- `| CU11 | IMPLEMENTADO | Sí | Sí | Sí | Sí | No | `/clientes` → `C_Finanzas.listarClientes` → `M1Controller.listarClientes` | SIN PRUEBA AUTOMATIZADA — validado manualmente |`
## CU12
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | /** M2 CU12–CU41. Compatibilidad del frontend existente; no sustituye la implementación completa de los CU. */ |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Auditoria M9 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU12 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M2Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | NO CONFIRMADO EN EL REPOSITORIO |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU13, CU14, CU15, CU16, CU17, CU18, CU19, CU20, CU21, CU22, CU23, CU41 |
| 23. Estado actual | REGISTRADO O REFERENCIADO; COBERTURA FOCAL NO ENLAZADA |
### Trazabilidad completa de archivos
- `Controladores/src/controladores/M2Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `/** M2 CU12–CU41. Compatibilidad del frontend existente; no sustituye la implementación completa de los CU. */`
- `CU12:GS,CU13:G,CU14:GS,CU15:GS,CU16:GS,CU17:GS,CU18:GS,CU19:GS,CU20:GS,CU21:GS,CU22:GS,CU23:G,`
- `| CU12 | IMPLEMENTADO | Sí | Sí | Sí | Sí | No | `/cotizacion/nueva` → `C_Finanzas.guardarCotizacion` → `M2Controller.guardarCotizacion` | SIN PRUEBA AUTOMATIZADA — validado manualmente |`
- `| CU12 | Seleccionar cliente para cotización | M2 | `guardarCotizacion` | Armar Cotización | CLIENTE/FICHA | cliente activo | IMPLEMENTADO |`
## CU13
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU12:GS,CU13:G,CU14:GS,CU15:GS,CU16:GS,CU17:GS,CU18:GS,CU19:GS,CU20:GS,CU21:GS,CU22:GS,CU23:G, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Auditoria M9 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU13 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/brechas-cierre.test.cjs; Controladores/pruebas/brechas-focalizadas.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU05, CU09, CU12, CU14, CU15, CU16, CU17, CU18, CU19, CU20, CU21, CU22, CU23, CU27, CU31, CU33, CU40, CU42, CU43, CU45, CU49, CU51, CU52, CU54, CU55, CU56, CU57, CU58 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/brechas-cierre.test.cjs`
- `Controladores/pruebas/brechas-focalizadas.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `CU12:GS,CU13:G,CU14:GS,CU15:GS,CU16:GS,CU17:GS,CU18:GS,CU19:GS,CU20:GS,CU21:GS,CU22:GS,CU23:G,`
- `CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'],`
- `const resultado = await m2.registrarClienteDesdeCotizacion({ tipo: 'B2C', nombre: 'Prueba CU13', contacto: 'Contacto', telefono: '555-0101', confirmado: true, idCotizacion: cot.id_cotizacion });`
- `test('CU13 registra desde M2 y asocia el cliente a un borrador', async () => {`
## CU14
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU12:GS,CU13:G,CU14:GS,CU15:GS,CU16:GS,CU17:GS,CU18:GS,CU19:GS,CU20:GS,CU21:GS,CU22:GS,CU23:G, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU14 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/m2-productos-comerciales.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU12, CU13, CU15, CU16, CU17, CU18, CU19, CU20, CU21, CU22, CU23, CU360 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m2-productos-comerciales.test.cjs`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `CU12:GS,CU13:G,CU14:GS,CU15:GS,CU16:GS,CU17:GS,CU18:GS,CU19:GS,CU20:GS,CU21:GS,CU22:GS,CU23:G,`
- `CU14:'Ver productos', CU15:'Ver inventario', CU18:'Emitir cotización', CU19:'Crear y guardar cotización', CU20:'Ver y editar cotizaciones',`
- `await t.test('34 consulta autorizada sólo con CU360', () => {assert.equal(permiteOperacion('listarProductosComerciales',['CU360']),true);assert.equal(permiteOperacion('listarProductosComerciales',['CU14']),false);});`
- `| CU14 | IMPLEMENTADO | Sí | Sí | Sí | Sí | No | `/cotizacion/nueva` → `C_Finanzas.guardarCotizacion` → `M2Controller.guardarCotizacion` | SIN PRUEBA AUTOMATIZADA — validado manualmente |`
## CU15
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU12:GS,CU13:G,CU14:GS,CU15:GS,CU16:GS,CU17:GS,CU18:GS,CU19:GS,CU20:GS,CU21:GS,CU22:GS,CU23:G, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU15 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | NO CONFIRMADO EN EL REPOSITORIO |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU12, CU13, CU14, CU16, CU17, CU18, CU19, CU20, CU21, CU22, CU23 |
| 23. Estado actual | REGISTRADO O REFERENCIADO; COBERTURA FOCAL NO ENLAZADA |
### Trazabilidad completa de archivos
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `CU12:GS,CU13:G,CU14:GS,CU15:GS,CU16:GS,CU17:GS,CU18:GS,CU19:GS,CU20:GS,CU21:GS,CU22:GS,CU23:G,`
- `CU14:'Ver productos', CU15:'Ver inventario', CU18:'Emitir cotización', CU19:'Crear y guardar cotización', CU20:'Ver y editar cotizaciones',`
- `| CU15 | Costo base | M2 | costeo en `guardarCotizacion` | resultado costeo | HISTORIAL_PRECIO_MATERIAL | costo vigente/moneda | PARCIAL |`
- `| CU15 | IMPLEMENTADO | Sí | Sí | Sí | Sí | No | `/cotizacion/nueva` → `C_Finanzas.guardarCotizacion` → `M2Controller.guardarCotizacion` | SIN PRUEBA AUTOMATIZADA — validado manualmente |`
## CU16
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU12:GS,CU13:G,CU14:GS,CU15:GS,CU16:GS,CU17:GS,CU18:GS,CU19:GS,CU20:GS,CU21:GS,CU22:GS,CU23:G, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Auditoria M9 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU16 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | NO CONFIRMADO EN EL REPOSITORIO |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU12, CU13, CU14, CU15, CU17, CU18, CU19, CU20, CU21, CU22, CU23 |
| 23. Estado actual | REGISTRADO O REFERENCIADO; COBERTURA FOCAL NO ENLAZADA |
### Trazabilidad completa de archivos
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `CU12:GS,CU13:G,CU14:GS,CU15:GS,CU16:GS,CU17:GS,CU18:GS,CU19:GS,CU20:GS,CU21:GS,CU22:GS,CU23:G,`
- `| CU16 | IMPLEMENTADO | Sí | Sí | Sí | Sí | No | `/cotizacion/nueva` → `C_Finanzas.guardarCotizacion` → `M2Controller.guardarCotizacion` | SIN PRUEBA AUTOMATIZADA — validado manualmente |`
- `| CU16 | Precio sugerido | M2 | cálculo en `guardarCotizacion` | resultado | COTIZACION | margen | PARCIAL |`
## CU17
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU12:GS,CU13:G,CU14:GS,CU15:GS,CU16:GS,CU17:GS,CU18:GS,CU19:GS,CU20:GS,CU21:GS,CU22:GS,CU23:G, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Auditoria M9 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU17 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | NO CONFIRMADO EN EL REPOSITORIO |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU12, CU13, CU14, CU15, CU16, CU18, CU19, CU20, CU21, CU22, CU23 |
| 23. Estado actual | REGISTRADO O REFERENCIADO; COBERTURA FOCAL NO ENLAZADA |
### Trazabilidad completa de archivos
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `CU12:GS,CU13:G,CU14:GS,CU15:GS,CU16:GS,CU17:GS,CU18:GS,CU19:GS,CU20:GS,CU21:GS,CU22:GS,CU23:G,`
- `| CU17 | IMPLEMENTADO | Sí | Sí | Sí | Sí | No | `/cotizacion/nueva` → `C_Finanzas.guardarCotizacion` → `M2Controller.guardarCotizacion` | SIN PRUEBA AUTOMATIZADA — validado manualmente |`
- `| CU17 | Vigencia | M2 | validación de fecha | formulario | COTIZACION | fecha futura | IMPLEMENTADO |`
## CU18
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU12:GS,CU13:G,CU14:GS,CU15:GS,CU16:GS,CU17:GS,CU18:GS,CU19:GS,CU20:GS,CU21:GS,CU22:GS,CU23:G, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU18 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/c4-3-documental-real.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU05, CU09, CU12, CU13, CU14, CU15, CU16, CU17, CU19, CU20, CU21, CU22, CU23, CU27, CU31, CU33, CU40, CU42, CU43, CU45, CU49, CU51, CU52, CU54, CU55, CU56, CU57, CU58 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/c4-3-documental-real.test.cjs`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `CU12:GS,CU13:G,CU14:GS,CU15:GS,CU16:GS,CU17:GS,CU18:GS,CU19:GS,CU20:GS,CU21:GS,CU22:GS,CU23:G,`
- `CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'],`
- `CU14:'Ver productos', CU15:'Ver inventario', CU18:'Emitir cotización', CU19:'Crear y guardar cotización', CU20:'Ver y editar cotizaciones',`
- `| CU18 | Emitir cotización | M2 | no hay emisión separada | botón no completo | COTIZACION | completitud | NO IMPLEMENTADO |`
## CU19
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="cotizacion/nueva" element={<Protegido permiso={new URLSearchParams(window.location.search).has('borrador') ? 'CU20' : 'CU19'}><ArmarCotizacion /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU19 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/c3-5-obra-proyecto-http.test.cjs; Controladores/pruebas/c4-3-documental-real.test.cjs; Controladores/pruebas/m4-permisos-funcionales.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU05, CU09, CU12, CU13, CU14, CU15, CU16, CU17, CU18, CU20, CU21, CU22, CU23, CU27, CU31, CU33, CU40, CU42, CU43, CU45, CU49, CU51, CU52, CU54, CU55, CU56, CU57, CU58 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/c3-5-obra-proyecto-http.test.cjs`
- `Controladores/pruebas/c4-3-documental-real.test.cjs`
- `Controladores/pruebas/m4-permisos-funcionales.test.cjs`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `<Route path="cotizacion/nueva" element={<Protegido permiso={new URLSearchParams(window.location.search).has('borrador') ? 'CU20' : 'CU19'}><ArmarCotizacion /></Protegido>} />`
- `CU12:GS,CU13:G,CU14:GS,CU15:GS,CU16:GS,CU17:GS,CU18:GS,CU19:GS,CU20:GS,CU21:GS,CU22:GS,CU23:G,`
- `CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'],`
- `CU14:'Ver productos', CU15:'Ver inventario', CU18:'Emitir cotización', CU19:'Crear y guardar cotización', CU20:'Ver y editar cotizaciones',`
## CU20
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="aprobaciones" element={<Protegido permiso="CU20"><BandejaAprobacionGerencia /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU20 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/c3-5-obra-proyecto-http.test.cjs; Controladores/pruebas/c4-3-documental-real.test.cjs; Controladores/pruebas/cotizaciones-c3-3-estructura.test.cjs; Controladores/pruebas/cu20-cu23-cu27.test.cjs; Controladores/pruebas/m7-cu216-cu221.test.cjs; Controladores/pruebas/m7-ventas-familia-navegacion.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU05, CU09, CU12, CU13, CU14, CU15, CU16, CU17, CU18, CU19, CU21, CU22, CU23, CU27, CU31, CU33, CU40, CU42, CU43, CU45, CU49, CU51, CU52, CU54, CU55, CU56, CU57, CU58 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/c3-5-obra-proyecto-http.test.cjs`
- `Controladores/pruebas/c4-3-documental-real.test.cjs`
- `Controladores/pruebas/cotizaciones-c3-3-estructura.test.cjs`
- `Controladores/pruebas/cu20-cu23-cu27.test.cjs`
- `Controladores/pruebas/m7-cu216-cu221.test.cjs`
- `Controladores/pruebas/m7-ventas-familia-navegacion.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `<Route path="aprobaciones" element={<Protegido permiso="CU20"><BandejaAprobacionGerencia /></Protegido>} />`
- `<Route path="cotizacion/nueva" element={<Protegido permiso={new URLSearchParams(window.location.search).has('borrador') ? 'CU20' : 'CU19'}><ArmarCotizacion /></Protegido>} />`
- `CU12:GS,CU13:G,CU14:GS,CU15:GS,CU16:GS,CU17:GS,CU18:GS,CU19:GS,CU20:GS,CU21:GS,CU22:GS,CU23:G,`
- `CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'],`
## CU21
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU12:GS,CU13:G,CU14:GS,CU15:GS,CU16:GS,CU17:GS,CU18:GS,CU19:GS,CU20:GS,CU21:GS,CU22:GS,CU23:G, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU21 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | NO CONFIRMADO EN EL REPOSITORIO |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU05, CU09, CU12, CU13, CU14, CU15, CU16, CU17, CU18, CU19, CU20, CU22, CU23, CU24, CU27, CU31, CU33, CU40, CU42, CU43, CU45, CU49, CU51, CU52, CU54, CU55, CU56, CU57, CU58 |
| 23. Estado actual | REGISTRADO O REFERENCIADO; COBERTURA FOCAL NO ENLAZADA |
### Trazabilidad completa de archivos
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `CU12:GS,CU13:G,CU14:GS,CU15:GS,CU16:GS,CU17:GS,CU18:GS,CU19:GS,CU20:GS,CU21:GS,CU22:GS,CU23:G,`
- `CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'],`
- `CU21:'Reactivar cotización', CU22:'Rechazar o descartar cotización', CU23:'Formalizar cliente particular', CU24:'Aprobar cotización y aceptar alternativa',`
- `| CU21 | IMPLEMENTADO | Sí | Sí | Sí | Sí | No | `/aprobaciones` → `C_Finanzas.reactivarCotizacion` → `M2Controller.reactivarCotizacion` | SIN PRUEBA AUTOMATIZADA — validado manualmente |`
## CU22
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU12:GS,CU13:G,CU14:GS,CU15:GS,CU16:GS,CU17:GS,CU18:GS,CU19:GS,CU20:GS,CU21:GS,CU22:GS,CU23:G, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU22 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/cotizaciones-c3-3-estructura.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU12, CU13, CU14, CU15, CU16, CU17, CU18, CU19, CU20, CU21, CU23, CU24, CU27, CU36, CU37, CU47 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/cotizaciones-c3-3-estructura.test.cjs`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `CU12:GS,CU13:G,CU14:GS,CU15:GS,CU16:GS,CU17:GS,CU18:GS,CU19:GS,CU20:GS,CU21:GS,CU22:GS,CU23:G,`
- `CU21:'Reactivar cotización', CU22:'Rechazar o descartar cotización', CU23:'Formalizar cliente particular', CU24:'Aprobar cotización y aceptar alternativa',`
- `anularVenta:'CU37', registrarDocumento:'CU36', descartarBorrador:'CU22', aprobarCotizacion:'CU24', aprobarVenta:'CU27', tipoCambio:'CU47',`
- `assert.equal(permiteOperacion('rechazarAlternativaB2C', ['CU22']), true);`
## CU23
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU12:GS,CU13:G,CU14:GS,CU15:GS,CU16:GS,CU17:GS,CU18:GS,CU19:GS,CU20:GS,CU21:GS,CU22:GS,CU23:G, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU23 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/cu20-cu23-cu27.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU05, CU09, CU12, CU13, CU14, CU15, CU16, CU17, CU18, CU19, CU20, CU21, CU22, CU24, CU27, CU31, CU33, CU40, CU42, CU43, CU45, CU49, CU51, CU52, CU54, CU55, CU56, CU57, CU58 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/cu20-cu23-cu27.test.cjs`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `CU12:GS,CU13:G,CU14:GS,CU15:GS,CU16:GS,CU17:GS,CU18:GS,CU19:GS,CU20:GS,CU21:GS,CU22:GS,CU23:G,`
- `CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'],`
- `CU21:'Reactivar cotización', CU22:'Rechazar o descartar cotización', CU23:'Formalizar cliente particular', CU24:'Aprobar cotización y aceptar alternativa',`
- `const formalizado = await m2.formalizarClienteB2C({ idCliente: primero.id_cliente_financiero, idCotizacion: cotizacion.id_cotizacion, rut, nombre: 'Cliente formal CU23', telefono: '+56922222222' });`
## CU24
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | - **CU24:** la aceptación B2B con Orden de Compra está disponible; los mensajes operativos ya no la presentan como pendiente. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU24 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | Controladores/pruebas/m9-productores-failclosed.test.cjs; auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/c4-3-documental-real.test.cjs; Controladores/pruebas/cotizaciones-c3-3-estructura.test.cjs; Controladores/pruebas/m9-productores-failclosed.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU21, CU22, CU23, CU25, CU26, CU27, CU28, CU29, CU30, CU31, CU32, CU33, CU34, CU35, CU36, CU37, CU47 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/c4-3-documental-real.test.cjs`
- `Controladores/pruebas/cotizaciones-c3-3-estructura.test.cjs`
- `Controladores/pruebas/m9-productores-failclosed.test.cjs`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
- `documentacion/ESTADO_TECNICO_VIGENTE.md`
### Evidencia textual
- `- **CU24:** la aceptación B2B con Orden de Compra está disponible; los mensajes operativos ya no la presentan como pendiente.`
- `CU21:'Reactivar cotización', CU22:'Rechazar o descartar cotización', CU23:'Formalizar cliente particular', CU24:'Aprobar cotización y aceptar alternativa',`
- `CU24:GS,CU25:GS,CU26:GS,CU27:GS,CU28:GS,CU29:GS,CU30:GS,CU31:G,CU32:GS,CU33:G,CU34:GS,CU35:GS,`
- `anularVenta:'CU37', registrarDocumento:'CU36', descartarBorrador:'CU22', aprobarCotizacion:'CU24', aprobarVenta:'CU27', tipoCambio:'CU47',`
## CU25
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU24:GS,CU25:GS,CU26:GS,CU27:GS,CU28:GS,CU29:GS,CU30:GS,CU31:G,CU32:GS,CU33:G,CU34:GS,CU35:GS, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU25 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/components/OperacionesFinancieras.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/c4-3-documental-real.test.cjs; Controladores/pruebas/delta-financiero.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU24, CU26, CU27, CU28, CU29, CU30, CU31, CU32, CU33, CU34, CU35, CU36, CU38, CU43 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/c4-3-documental-real.test.cjs`
- `Controladores/pruebas/delta-financiero.test.cjs`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/components/OperacionesFinancieras.tsx`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
- `documentacion/DELTA_M4.md`
### Evidencia textual
- `CU24:GS,CU25:GS,CU26:GS,CU27:GS,CU28:GS,CU29:GS,CU30:GS,CU31:G,CU32:GS,CU33:G,CU34:GS,CU35:GS,`
- `CU25:'Consolidar cotización particular', CU27:'Generar Nota de Venta', CU28:'Consultar monedas', CU35:'Editar guía de despacho', CU36:'Registrar documento de venta',`
- `const actor={id:999999n,permisos:['CU25','CU38','CU43']};const fachada=new C_Finanzas({autorizar:async()=>actor},undefined,m2,m3);`
- `obtenerPlanificacionAprobacionCotizacion: ['CU25'],`
## CU26
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU24:GS,CU25:GS,CU26:GS,CU27:GS,CU28:GS,CU29:GS,CU30:GS,CU31:G,CU32:GS,CU33:G,CU34:GS,CU35:GS, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Auditoria M9 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU26 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | NO CONFIRMADO EN EL REPOSITORIO |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU24, CU25, CU27, CU28, CU29, CU30, CU31, CU32, CU33, CU34, CU35 |
| 23. Estado actual | REGISTRADO O REFERENCIADO; COBERTURA FOCAL NO ENLAZADA |
### Trazabilidad completa de archivos
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `CU24:GS,CU25:GS,CU26:GS,CU27:GS,CU28:GS,CU29:GS,CU30:GS,CU31:G,CU32:GS,CU33:G,CU34:GS,CU35:GS,`
- `| CU26 | IMPLEMENTADO | Sí | Sí | Sí | Sí | No | `/venta/directa` → `C_Finanzas.crearVentaDirecta` → `M2Controller.crearVentaDirecta` | SIN PRUEBA AUTOMATIZADA — validado manualmente |`
- `| CU26 | Seleccionar cliente NV directa | M2 | `crearVentaDirecta` | Venta directa | FICHA | cliente formal | IMPLEMENTADO |`
## CU27
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="venta/directa" element={<Protegido permiso="CU27"><NotaDeVentaDirecta /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU27 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/cu20-cu23-cu27.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU05, CU09, CU13, CU18, CU19, CU20, CU21, CU23, CU24, CU25, CU26, CU28, CU29, CU30, CU31, CU32, CU33, CU34, CU35, CU36, CU40, CU42, CU43, CU45, CU49, CU51, CU52, CU54, CU55, CU56, CU57, CU58 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/cu20-cu23-cu27.test.cjs`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
- `documentacion/ESTADO_TECNICO_VIGENTE.md`
### Evidencia textual
- `<Route path="venta/directa" element={<Protegido permiso="CU27"><NotaDeVentaDirecta /></Protegido>} />`
- `CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'],`
- `CU24:GS,CU25:GS,CU26:GS,CU27:GS,CU28:GS,CU29:GS,CU30:GS,CU31:G,CU32:GS,CU33:G,CU34:GS,CU35:GS,`
- `CU25:'Consolidar cotización particular', CU27:'Generar Nota de Venta', CU28:'Consultar monedas', CU35:'Editar guía de despacho', CU36:'Registrar documento de venta',`
## CU28
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU24:GS,CU25:GS,CU26:GS,CU27:GS,CU28:GS,CU29:GS,CU30:GS,CU31:G,CU32:GS,CU33:G,CU34:GS,CU35:GS, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU28 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | NO CONFIRMADO EN EL REPOSITORIO |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU24, CU25, CU26, CU27, CU29, CU30, CU31, CU32, CU33, CU34, CU35, CU36 |
| 23. Estado actual | REGISTRADO O REFERENCIADO; COBERTURA FOCAL NO ENLAZADA |
### Trazabilidad completa de archivos
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `CU24:GS,CU25:GS,CU26:GS,CU27:GS,CU28:GS,CU29:GS,CU30:GS,CU31:G,CU32:GS,CU33:G,CU34:GS,CU35:GS,`
- `CU25:'Consolidar cotización particular', CU27:'Generar Nota de Venta', CU28:'Consultar monedas', CU35:'Editar guía de despacho', CU36:'Registrar documento de venta',`
- `| CU28 | IMPLEMENTADO | Sí | Sí | Sí | Sí | No | `/venta/directa` → `C_Finanzas.crearVentaDirecta` → `M2Controller.crearVentaDirecta` | SIN PRUEBA AUTOMATIZADA — validado manualmente |`
- `| CU28 | Moneda cotización | M2 | `guardarCotizacion` | Armar Cotización | MONEDA/COTIZACION | moneda habilitada | IMPLEMENTADO |`
## CU29
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU24:GS,CU25:GS,CU26:GS,CU27:GS,CU28:GS,CU29:GS,CU30:GS,CU31:G,CU32:GS,CU33:G,CU34:GS,CU35:GS, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Auditoria M9 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU29 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | NO CONFIRMADO EN EL REPOSITORIO |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU24, CU25, CU26, CU27, CU28, CU30, CU31, CU32, CU33, CU34, CU35 |
| 23. Estado actual | REGISTRADO O REFERENCIADO; COBERTURA FOCAL NO ENLAZADA |
### Trazabilidad completa de archivos
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `CU24:GS,CU25:GS,CU26:GS,CU27:GS,CU28:GS,CU29:GS,CU30:GS,CU31:G,CU32:GS,CU33:G,CU34:GS,CU35:GS,`
- `| CU29 | IMPLEMENTADO | Sí | Sí | Sí | Sí | No | `/venta/directa` → `C_Finanzas.crearVentaDirecta` → `M2Controller.crearVentaDirecta` | SIN PRUEBA AUTOMATIZADA — validado manualmente |`
- `| CU29 | Moneda NV directa | M2 | `crearVentaDirecta` | Venta directa | MONEDA/NV | moneda habilitada | IMPLEMENTADO |`
## CU30
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU24:GS,CU25:GS,CU26:GS,CU27:GS,CU28:GS,CU29:GS,CU30:GS,CU31:G,CU32:GS,CU33:G,CU34:GS,CU35:GS, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Auditoria M9 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU30 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | NO CONFIRMADO EN EL REPOSITORIO |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU24, CU25, CU26, CU27, CU28, CU29, CU31, CU32, CU33, CU34, CU35 |
| 23. Estado actual | REGISTRADO O REFERENCIADO; COBERTURA FOCAL NO ENLAZADA |
### Trazabilidad completa de archivos
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `CU24:GS,CU25:GS,CU26:GS,CU27:GS,CU28:GS,CU29:GS,CU30:GS,CU31:G,CU32:GS,CU33:G,CU34:GS,CU35:GS,`
- `| CU30 | IVA/exención cotización | M2 | `importes` | Armar Cotización | COTIZACION | booleano IVA | IMPLEMENTADO |`
## CU31
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'], |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Auditoria M9 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU31 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | Controladores/src/controladores/C_Finanzas.ts |
| 13. Controlador | Controladores/src/controladores/C_Finanzas.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | NO CONFIRMADO EN EL REPOSITORIO |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU05, CU09, CU13, CU18, CU19, CU20, CU21, CU23, CU24, CU25, CU26, CU27, CU28, CU29, CU30, CU32, CU33, CU34, CU35, CU40, CU42, CU43, CU45, CU49, CU51, CU52, CU54, CU55, CU56, CU57, CU58 |
| 23. Estado actual | REGISTRADO O REFERENCIADO; COBERTURA FOCAL NO ENLAZADA |
### Trazabilidad completa de archivos
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'],`
- `CU24:GS,CU25:GS,CU26:GS,CU27:GS,CU28:GS,CU29:GS,CU30:GS,CU31:G,CU32:GS,CU33:G,CU34:GS,CU35:GS,`
- `export const codigosImplementados = [...new Set([...Object.values(operacionesPermiso), 'CU31','CU33'])];`
- `| CU31 | Descuento cotización | M2 | `importes` + permiso | Armar Cotización | COTIZACION | límites/permiso | IMPLEMENTADO |`
## CU32
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU24:GS,CU25:GS,CU26:GS,CU27:GS,CU28:GS,CU29:GS,CU30:GS,CU31:G,CU32:GS,CU33:G,CU34:GS,CU35:GS, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Auditoria M9 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU32 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU24, CU25, CU26, CU27, CU28, CU29, CU30, CU31, CU33, CU34, CU35 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `CU24:GS,CU25:GS,CU26:GS,CU27:GS,CU28:GS,CU29:GS,CU30:GS,CU31:G,CU32:GS,CU33:G,CU34:GS,CU35:GS,`
- `| CU32 | IVA/exención NV directa | M2 | `importes` | Venta directa | NV | booleano IVA | IMPLEMENTADO |`
## CU33
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'], |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Auditoria M9 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU33 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | Controladores/src/controladores/C_Finanzas.ts |
| 13. Controlador | Controladores/src/controladores/C_Finanzas.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | NO CONFIRMADO EN EL REPOSITORIO |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU05, CU09, CU13, CU18, CU19, CU20, CU21, CU23, CU24, CU25, CU26, CU27, CU28, CU29, CU30, CU31, CU32, CU34, CU35, CU40, CU42, CU43, CU45, CU49, CU51, CU52, CU54, CU55, CU56, CU57, CU58 |
| 23. Estado actual | REGISTRADO O REFERENCIADO; COBERTURA FOCAL NO ENLAZADA |
### Trazabilidad completa de archivos
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'],`
- `CU24:GS,CU25:GS,CU26:GS,CU27:GS,CU28:GS,CU29:GS,CU30:GS,CU31:G,CU32:GS,CU33:G,CU34:GS,CU35:GS,`
- `export const codigosImplementados = [...new Set([...Object.values(operacionesPermiso), 'CU31','CU33'])];`
- `| CU33 | Descuento NV directa | M2 | `importes` + permiso | Venta directa | NV | límites/permiso | IMPLEMENTADO |`
## CU34
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU24:GS,CU25:GS,CU26:GS,CU27:GS,CU28:GS,CU29:GS,CU30:GS,CU31:G,CU32:GS,CU33:G,CU34:GS,CU35:GS, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Auditoria M9 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU34 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | NO CONFIRMADO EN EL REPOSITORIO |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU24, CU25, CU26, CU27, CU28, CU29, CU30, CU31, CU32, CU33, CU35 |
| 23. Estado actual | REGISTRADO O REFERENCIADO; COBERTURA FOCAL NO ENLAZADA |
### Trazabilidad completa de archivos
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
- `documentacion/ETAPA_1_I2.md`
### Evidencia textual
- `CU24:GS,CU25:GS,CU26:GS,CU27:GS,CU28:GS,CU29:GS,CU30:GS,CU31:G,CU32:GS,CU33:G,CU34:GS,CU35:GS,`
- `| CU34 | Generar guía | M2 | `registrarDocumento` | gestión/bandeja | GUIA_DESPACHO | NV válida | PARCIAL |`
## CU35
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU24:GS,CU25:GS,CU26:GS,CU27:GS,CU28:GS,CU29:GS,CU30:GS,CU31:G,CU32:GS,CU33:G,CU34:GS,CU35:GS, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU35 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/brechas-cierre.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU24, CU25, CU26, CU27, CU28, CU29, CU30, CU31, CU32, CU33, CU34, CU36 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/brechas-cierre.test.cjs`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `CU24:GS,CU25:GS,CU26:GS,CU27:GS,CU28:GS,CU29:GS,CU30:GS,CU31:G,CU32:GS,CU33:G,CU34:GS,CU35:GS,`
- `CU25:'Consolidar cotización particular', CU27:'Generar Nota de Venta', CU28:'Consultar monedas', CU35:'Editar guía de despacho', CU36:'Registrar documento de venta',`
- `test('CU35 modifica sólo la guía asociada y conserva la NV', async () => {`
- `| CU35 | Modificar guía | M2 | `modificarGuia` | sin vista dedicada | GUIA_DESPACHO | folio | PARCIAL |`
## CU36
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU25:'Consolidar cotización particular', CU27:'Generar Nota de Venta', CU28:'Consultar monedas', CU35:'Editar guía de despacho', CU36:'Registrar documento de venta', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU36 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU22, CU24, CU25, CU27, CU28, CU35, CU37, CU38, CU39, CU40, CU41, CU47 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `MAPA_DEL_PROYECTO.md`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
- `documentacion/ESTADO_TECNICO_VIGENTE.md`
### Evidencia textual
- `CU25:'Consolidar cotización particular', CU27:'Generar Nota de Venta', CU28:'Consultar monedas', CU35:'Editar guía de despacho', CU36:'Registrar documento de venta',`
- `CU36:GS,CU37:GC,CU38:GC,CU39:GS,CU40:GS,CU41:G,`
- `anularVenta:'CU37', registrarDocumento:'CU36', descartarBorrador:'CU22', aprobarCotizacion:'CU24', aprobarVenta:'CU27', tipoCambio:'CU47',`
- `await t.test('CU36 conserva antecedentes externos y relaciona más de una NV',async()=>{`
## CU37
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU36:GS,CU37:GC,CU38:GC,CU39:GS,CU40:GS,CU41:G, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU37 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/m4.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU22, CU24, CU27, CU36, CU38, CU39, CU40, CU41, CU47 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m4.test.cjs`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `CU36:GS,CU37:GC,CU38:GC,CU39:GS,CU40:GS,CU41:G,`
- `CU37:'Anular Nota de Venta', CU38:'Revertir Nota de Venta', CU39:'Definir condiciones de cobro', CU40:'Configurar etapas de cobro', CU41:'Configurar umbral comercial',`
- `anularVenta:'CU37', registrarDocumento:'CU36', descartarBorrador:'CU22', aprobarCotizacion:'CU24', aprobarVenta:'CU27', tipoCambio:'CU47',`
- `| CU37 | Anular NV sin pagos | M2 | `anularVenta` | bandeja/ficha | NV | sin pagos | IMPLEMENTADO |`
## CU38
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU36:GS,CU37:GC,CU38:GC,CU39:GS,CU40:GS,CU41:G, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU38 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/components/OperacionesFinancieras.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/delta-financiero.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU25, CU36, CU37, CU39, CU40, CU41, CU43, CU47, CU49, CU50 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/delta-financiero.test.cjs`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/components/OperacionesFinancieras.tsx`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
- `documentacion/DELTA_M4.md`
### Evidencia textual
- `CU36:GS,CU37:GC,CU38:GC,CU39:GS,CU40:GS,CU41:G,`
- `CU37:'Anular Nota de Venta', CU38:'Revertir Nota de Venta', CU39:'Definir condiciones de cobro', CU40:'Configurar etapas de cobro', CU41:'Configurar umbral comercial',`
- `const actor={id:999999n,permisos:['CU25','CU38','CU43']};const fachada=new C_Finanzas({autorizar:async()=>actor},undefined,m2,m3);`
- `test('delta CU25/CU38/CU43/CU47/CU49/CU50: consistencia financiera',async t=>{`
## CU39
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU36:GS,CU37:GC,CU38:GC,CU39:GS,CU40:GS,CU41:G, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU39 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | NO CONFIRMADO EN EL REPOSITORIO |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU36, CU37, CU38, CU40, CU41 |
| 23. Estado actual | REGISTRADO O REFERENCIADO; COBERTURA FOCAL NO ENLAZADA |
### Trazabilidad completa de archivos
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `CU36:GS,CU37:GC,CU38:GC,CU39:GS,CU40:GS,CU41:G,`
- `CU37:'Anular Nota de Venta', CU38:'Revertir Nota de Venta', CU39:'Definir condiciones de cobro', CU40:'Configurar etapas de cobro', CU41:'Configurar umbral comercial',`
- `| CU39 | Condiciones cobro B2B | M2 | `definirCondicionesCobro` | sin vista dedicada | NV | fecha | PARCIAL |`
- `| CU39 | IMPLEMENTADO | Sí | Sí | Sí | Sí | No | `/clientes/:rut` → `C_Finanzas.definirCondicionesCobro` → `M2Controller.definirCondicionesCobro` | SIN PRUEBA AUTOMATIZADA — validado manualmente |`
## CU40
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'], |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU40 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | NO CONFIRMADO EN EL REPOSITORIO |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU05, CU09, CU13, CU18, CU19, CU20, CU21, CU23, CU27, CU31, CU33, CU36, CU37, CU38, CU39, CU41, CU42, CU43, CU45, CU49, CU51, CU52, CU54, CU55, CU56, CU57, CU58 |
| 23. Estado actual | REGISTRADO O REFERENCIADO; COBERTURA FOCAL NO ENLAZADA |
### Trazabilidad completa de archivos
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'],`
- `CU36:GS,CU37:GC,CU38:GC,CU39:GS,CU40:GS,CU41:G,`
- `CU37:'Anular Nota de Venta', CU38:'Revertir Nota de Venta', CU39:'Definir condiciones de cobro', CU40:'Configurar etapas de cobro', CU41:'Configurar umbral comercial',`
- `| CU40 | Etapas cobro B2C | M2 | no existe | no existe | HITO_COBRO | — | NO IMPLEMENTADO |`
## CU41
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU41', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU41 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/Mantenedores/Mantenedores.tsx; Vistas/src/views/Mantenedores/permisos.ts |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M2Controller.ts |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/brechas-cierre.test.cjs; Controladores/pruebas/mantenedores-panel.test.cjs; Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU12, CU36, CU37, CU38, CU39, CU40 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/brechas-cierre.test.cjs`
- `Controladores/pruebas/mantenedores-panel.test.cjs`
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/controladores/M2Controller.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/Mantenedores/Mantenedores.tsx`
- `Vistas/src/views/Mantenedores/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
- `documentacion/ETAPA_1_I2.md`
### Evidencia textual
- `'CU41',`
- `/** M2 CU12–CU41. Compatibilidad del frontend existente; no sustituye la implementación completa de los CU. */`
- `<Route path="configuracion/umbral" element={<Protegido permiso="CU41"><UmbralPorVencer /></Protegido>} />`
- `CU36:GS,CU37:GC,CU38:GC,CU39:GS,CU40:GS,CU41:G,`
## CU42
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | /** M3 CU42–CU58: pagos, reversas, saldos a favor y conciliación. */ |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU42 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M3Controller.ts; Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/m7-cierre-hallazgos.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU05, CU09, CU13, CU18, CU19, CU20, CU21, CU23, CU27, CU31, CU33, CU40, CU43, CU45, CU47, CU49, CU51, CU52, CU54, CU55, CU56, CU57, CU58 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-cierre-hallazgos.test.cjs`
- `Controladores/src/controladores/M3Controller.ts`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
- `documentacion/ETAPA_1_I2.md`
### Evidencia textual
- `/** M3 CU42–CU58: pagos, reversas, saldos a favor y conciliación. */`
- `<Route path="pagos" element={<Protegido permiso="CU42"><PagosCliente /></Protegido>} />`
- `CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'],`
- `CU42:'Consultar contexto de pago', CU43:'Registrar pago', CU45:'Consultar catálogos de pago', CU47:'Consultar tipo de cambio', CU49:'Consultar saldo de venta',`
## CU43
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'], |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU43 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/components/OperacionesFinancieras.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | Controladores/pruebas/m9-productores-failclosed.test.cjs; auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/delta-financiero.test.cjs; Controladores/pruebas/m9-productores-failclosed.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU05, CU09, CU13, CU18, CU19, CU20, CU21, CU23, CU25, CU27, CU31, CU33, CU38, CU40, CU42, CU44, CU45, CU46, CU47, CU48, CU49, CU50, CU51, CU52, CU54, CU55, CU56, CU57, CU58 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/delta-financiero.test.cjs`
- `Controladores/pruebas/m9-productores-failclosed.test.cjs`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/components/OperacionesFinancieras.tsx`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
- `documentacion/DELTA_M4.md`
### Evidencia textual
- `CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'],`
- `CU42:'Consultar contexto de pago', CU43:'Registrar pago', CU45:'Consultar catálogos de pago', CU47:'Consultar tipo de cambio', CU49:'Consultar saldo de venta',`
- `CU42:GSC,CU43:GSC,CU44:GSC,CU45:GSC,CU46:GSC,CU47:GSC,CU48:GSC,CU49:GSC,CU50:GSC,`
- `const actor={id:999999n,permisos:['CU25','CU38','CU43']};const fachada=new C_Finanzas({autorizar:async()=>actor},undefined,m2,m3);`
## CU44
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU42:GSC,CU43:GSC,CU44:GSC,CU45:GSC,CU46:GSC,CU47:GSC,CU48:GSC,CU49:GSC,CU50:GSC, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Auditoria M9 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU44 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | NO CONFIRMADO EN EL REPOSITORIO |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU42, CU43, CU45, CU46, CU47, CU48, CU49, CU50 |
| 23. Estado actual | REGISTRADO O REFERENCIADO; COBERTURA FOCAL NO ENLAZADA |
### Trazabilidad completa de archivos
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `CU42:GSC,CU43:GSC,CU44:GSC,CU45:GSC,CU46:GSC,CU47:GSC,CU48:GSC,CU49:GSC,CU50:GSC,`
- `| CU44 | Categoría sugerida/editable | M3 | `prepararPago` | catálogo sin formulario completo | PAGO/CATEGORIA | categoría | PARCIAL |`
- `| CU44 | IMPLEMENTADO | Sí | Sí | Sí | Sí | No | `/pagos` → `C_Finanzas.registrarPago` → `M3Controller.registrarPago` | Utilidad adicional: `prepararPago`; no sustituye al controlador. SIN PRUEBA AUTOMATIZADA — validado manualmente |`
## CU45
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'], |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU45 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/brechas-focalizadas.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU05, CU09, CU13, CU18, CU19, CU20, CU21, CU23, CU27, CU31, CU33, CU40, CU42, CU43, CU44, CU46, CU47, CU48, CU49, CU50, CU51, CU52, CU54, CU55, CU56, CU57, CU58 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/brechas-focalizadas.test.cjs`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'],`
- `CU42:'Consultar contexto de pago', CU43:'Registrar pago', CU45:'Consultar catálogos de pago', CU47:'Consultar tipo de cambio', CU49:'Consultar saldo de venta',`
- `CU42:GSC,CU43:GSC,CU44:GSC,CU45:GSC,CU46:GSC,CU47:GSC,CU48:GSC,CU49:GSC,CU50:GSC,`
- `test('CU45: un medio no efectivo necesita antecedente y crédito necesita cuotas', () => {`
## CU46
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU42:GSC,CU43:GSC,CU44:GSC,CU45:GSC,CU46:GSC,CU47:GSC,CU48:GSC,CU49:GSC,CU50:GSC, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Auditoria M9 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU46 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | NO CONFIRMADO EN EL REPOSITORIO |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU42, CU43, CU44, CU45, CU47, CU48, CU49, CU50 |
| 23. Estado actual | REGISTRADO O REFERENCIADO; COBERTURA FOCAL NO ENLAZADA |
### Trazabilidad completa de archivos
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `CU42:GSC,CU43:GSC,CU44:GSC,CU45:GSC,CU46:GSC,CU47:GSC,CU48:GSC,CU49:GSC,CU50:GSC,`
- `| CU46 | Cuotas tarjeta | M3 | `prepararPago` | sin vista completa | PAGO | cuotas | PARCIAL |`
- `| CU46 | IMPLEMENTADO | Sí | Sí | Sí | Sí | No | `/pagos` → `C_Finanzas.registrarPago` → `M3Controller.registrarPago` | `prepararPago` valida tarjeta, cuota seleccionada y monto; SIN PRUEBA AUTOMATIZADA — validado manualmente |`
## CU47
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | - CU47 mantiene el tipo de cambio manual; no existe integración implementada con `C_BancoCentral`. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU47 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/brechas-cierre.test.cjs; Controladores/pruebas/delta-financiero.test.cjs; Controladores/pruebas/m4.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU22, CU24, CU27, CU36, CU37, CU42, CU43, CU44, CU45, CU46, CU48, CU49, CU50 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/brechas-cierre.test.cjs`
- `Controladores/pruebas/delta-financiero.test.cjs`
- `Controladores/pruebas/m4.test.cjs`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
- `documentacion/DELTA_M4.md`
### Evidencia textual
- `- CU47 mantiene el tipo de cambio manual; no existe integración implementada con `C_BancoCentral`.`
- `CU42:'Consultar contexto de pago', CU43:'Registrar pago', CU45:'Consultar catálogos de pago', CU47:'Consultar tipo de cambio', CU49:'Consultar saldo de venta',`
- `CU42:GSC,CU43:GSC,CU44:GSC,CU45:GSC,CU46:GSC,CU47:GSC,CU48:GSC,CU49:GSC,CU50:GSC,`
- `anularVenta:'CU37', registrarDocumento:'CU36', descartarBorrador:'CU22', aprobarCotizacion:'CU24', aprobarVenta:'CU27', tipoCambio:'CU47',`
## CU48
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU42:GSC,CU43:GSC,CU44:GSC,CU45:GSC,CU46:GSC,CU47:GSC,CU48:GSC,CU49:GSC,CU50:GSC, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Auditoria M9 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU48 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | NO CONFIRMADO EN EL REPOSITORIO |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU42, CU43, CU44, CU45, CU46, CU47, CU49, CU50 |
| 23. Estado actual | REGISTRADO O REFERENCIADO; COBERTURA FOCAL NO ENLAZADA |
### Trazabilidad completa de archivos
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `CU42:GSC,CU43:GSC,CU44:GSC,CU45:GSC,CU46:GSC,CU47:GSC,CU48:GSC,CU49:GSC,CU50:GSC,`
- `| CU48 | Documento tributario pago | M3 | `registrarPago` | selección no completa | DTE/ASIGNACION | mismo cliente | PARCIAL |`
- `| CU48 | IMPLEMENTADO | Sí | Sí | Sí | Sí | No | `/pagos` → `C_Finanzas.registrarPago` → `M3Controller.registrarPago` | SIN PRUEBA AUTOMATIZADA — validado manualmente |`
## CU49
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'], |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU49 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/delta-financiero.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU05, CU09, CU13, CU18, CU19, CU20, CU21, CU23, CU25, CU27, CU31, CU33, CU38, CU40, CU42, CU43, CU44, CU45, CU46, CU47, CU48, CU50, CU51, CU52, CU54, CU55, CU56, CU57, CU58 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/delta-financiero.test.cjs`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
- `documentacion/DELTA_M4.md`
### Evidencia textual
- `CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'],`
- `CU42:'Consultar contexto de pago', CU43:'Registrar pago', CU45:'Consultar catálogos de pago', CU47:'Consultar tipo de cambio', CU49:'Consultar saldo de venta',`
- `CU42:GSC,CU43:GSC,CU44:GSC,CU45:GSC,CU46:GSC,CU47:GSC,CU48:GSC,CU49:GSC,CU50:GSC,`
- `test('delta CU25/CU38/CU43/CU47/CU49/CU50: consistencia financiera',async t=>{`
## CU50
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU42:GSC,CU43:GSC,CU44:GSC,CU45:GSC,CU46:GSC,CU47:GSC,CU48:GSC,CU49:GSC,CU50:GSC, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU50 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/delta-financiero.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU25, CU38, CU42, CU43, CU44, CU45, CU46, CU47, CU48, CU49 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/delta-financiero.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
- `documentacion/DELTA_M4.md`
### Evidencia textual
- `CU42:GSC,CU43:GSC,CU44:GSC,CU45:GSC,CU46:GSC,CU47:GSC,CU48:GSC,CU49:GSC,CU50:GSC,`
- `test('delta CU25/CU38/CU43/CU47/CU49/CU50: consistencia financiera',async t=>{`
- `| CU49 | IMPLEMENTADO | Sí | Sí | Sí | Sí | Sí | `/clientes/:rut` → `C_Finanzas.anularPago` → `M3Controller.anularPago` | `CU49/CU50 usan monto vigente y no cambian estado comercial` |`
- `| CU50 | Estado de pago | M3 | `recalcularSaldo` | respuesta API | NV | pendiente/parcial/pagada | IMPLEMENTADO |`
## CU51
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | - **CU51:** consulta anulaciones y reversiones antes de anular. Conserva el pago original, registra la anulación, retira su efecto financiero y recalcula saldo y estado de la NV. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU51 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU52, CU54 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `MAPA_DEL_PROYECTO.md`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
- `documentacion/ESTADO_TECNICO_VIGENTE.md`
### Evidencia textual
- `- **CU51:** consulta anulaciones y reversiones antes de anular. Conserva el pago original, registra la anulación, retira su efecto financiero y recalcula saldo y estado de la NV.`
- `- Contador dispone de CU51, CU52 y CU54 según el RF vigente.`
- `- Gerencia dispone de CU51, CU52 y CU54.`
- `- Secretaría no dispone de CU51, CU52 ni CU54.`
## CU52
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | - Contador dispone de CU51, CU52 y CU54 según el RF vigente. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU52 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU05, CU09, CU13, CU18, CU19, CU20, CU21, CU23, CU27, CU31, CU33, CU40, CU42, CU43, CU45, CU49, CU51, CU54, CU55, CU56, CU57, CU58 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
- `documentacion/ESTADO_TECNICO_VIGENTE.md`
### Evidencia textual
- `- Contador dispone de CU51, CU52 y CU54 según el RF vigente.`
- `- Gerencia dispone de CU51, CU52 y CU54.`
- `- Secretaría no dispone de CU51, CU52 ni CU54.`
- `CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'],`
## CU53
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU51:GC,CU52:GC,CU53:GC,CU54:GC,CU55:GSC,CU56:GSC,CU57:GC,CU58:GC, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Auditoria M9 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU53 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | NO CONFIRMADO EN EL REPOSITORIO |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU38, CU51, CU52, CU54, CU55, CU56, CU57, CU58 |
| 23. Estado actual | REGISTRADO O REFERENCIADO; COBERTURA FOCAL NO ENLAZADA |
### Trazabilidad completa de archivos
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `CU51:GC,CU52:GC,CU53:GC,CU54:GC,CU55:GSC,CU56:GSC,CU57:GC,CU58:GC,`
- `| CU53 | IMPLEMENTADO | Sí | Sí | Sí | Sí | Sí | `/clientes/:rut` → `C_Finanzas.revertirVenta` → `M3Controller.procesarExcedente` | `CU38 fachada coordina excedente y saldo a favor sin perder monto original` |`
- `| CU53 | Saldo a favor | M3 | `procesarExcedente` | mensaje sin gestión dedicada | SALDO_FAVOR | elección explícita | PARCIAL |`
## CU54
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | - Contador dispone de CU51, CU52 y CU54 según el RF vigente. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU54 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/brechas-cierre.test.cjs; Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU05, CU09, CU13, CU18, CU19, CU20, CU21, CU23, CU27, CU31, CU33, CU40, CU42, CU43, CU45, CU49, CU51, CU52, CU55, CU56, CU57, CU58 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/brechas-cierre.test.cjs`
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
- `documentacion/ESTADO_TECNICO_VIGENTE.md`
### Evidencia textual
- `- Contador dispone de CU51, CU52 y CU54 según el RF vigente.`
- `- Gerencia dispone de CU51, CU52 y CU54.`
- `- Secretaría no dispone de CU51, CU52 ni CU54.`
- `CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'],`
## CU55
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'], |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU55 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/brechas-cierre.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU05, CU09, CU13, CU18, CU19, CU20, CU21, CU23, CU27, CU31, CU33, CU40, CU42, CU43, CU45, CU49, CU51, CU52, CU53, CU54, CU56, CU57, CU58 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/brechas-cierre.test.cjs`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'],`
- `CU51:'Anular pago', CU52:'Revertir pago', CU54:'Aplicar saldo a favor', CU55:'Ver pago', CU56:'Consultar morosidad', CU57:'Generar comprobante', CU58:'Conciliar pago',`
- `CU51:GC,CU52:GC,CU53:GC,CU54:GC,CU55:GSC,CU56:GSC,CU57:GC,CU58:GC,`
- `test('CU55 devuelve detalle de pago de sólo lectura', async () => {`
## CU56
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'], |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU56 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/brechas-focalizadas.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU05, CU09, CU13, CU18, CU19, CU20, CU21, CU23, CU27, CU31, CU33, CU40, CU42, CU43, CU45, CU49, CU51, CU52, CU53, CU54, CU55, CU57, CU58 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/brechas-focalizadas.test.cjs`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'],`
- `CU51:'Anular pago', CU52:'Revertir pago', CU54:'Aplicar saldo a favor', CU55:'Ver pago', CU56:'Consultar morosidad', CU57:'Generar comprobante', CU58:'Conciliar pago',`
- `CU51:GC,CU52:GC,CU53:GC,CU54:GC,CU55:GSC,CU56:GSC,CU57:GC,CU58:GC,`
- `test('CU56: la mora comienza al día siguiente de la fecha final', () => {`
## CU57
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | - **CU57:** genera un PDF válido y permite previsualizarlo, abrirlo para impresión y descargarlo desde la ficha financiera. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU57 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU05, CU09, CU13, CU18, CU19, CU20, CU21, CU23, CU27, CU31, CU33, CU40, CU42, CU43, CU45, CU49, CU51, CU52, CU53, CU54, CU55, CU56, CU58 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `MAPA_DEL_PROYECTO.md`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
- `documentacion/ESTADO_TECNICO_VIGENTE.md`
### Evidencia textual
- `- **CU57:** genera un PDF válido y permite previsualizarlo, abrirlo para impresión y descargarlo desde la ficha financiera.`
- `CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'],`
- `CU51:'Anular pago', CU52:'Revertir pago', CU54:'Aplicar saldo a favor', CU55:'Ver pago', CU56:'Consultar morosidad', CU57:'Generar comprobante', CU58:'Conciliar pago',`
- `CU51:GC,CU52:GC,CU53:GC,CU54:GC,CU55:GSC,CU56:GSC,CU57:GC,CU58:GC,`
## CU58
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | /** M3 CU42–CU58: pagos, reversas, saldos a favor y conciliación. */ |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU58 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M3Controller.ts |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/brechas-focalizadas.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU05, CU09, CU13, CU18, CU19, CU20, CU21, CU23, CU27, CU31, CU33, CU40, CU42, CU43, CU45, CU49, CU51, CU52, CU53, CU54, CU55, CU56, CU57 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/brechas-focalizadas.test.cjs`
- `Controladores/src/controladores/M3Controller.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
- `documentacion/DELTA_M4.md`
- `documentacion/ETAPA_1_I2.md`
### Evidencia textual
- `/** M3 CU42–CU58: pagos, reversas, saldos a favor y conciliación. */`
- `CU13:['CU19'],CU18:['CU19'],CU21:['CU20'],CU23:['CU09'],CU31:['CU19'], CU33:['CU27'], CU40:['CU09'],CU42:['CU05'],CU43:['CU05','CU49','CU45'], CU51:['CU43'],CU52:['CU43'],CU54:['CU43'],CU56:['CU49'],CU57:['CU55'],CU58:['CU43'],`
- `CU51:'Anular pago', CU52:'Revertir pago', CU54:'Aplicar saldo a favor', CU55:'Ver pago', CU56:'Consultar morosidad', CU57:'Generar comprobante', CU58:'Conciliar pago',`
- `CU51:GC,CU52:GC,CU53:GC,CU54:GC,CU55:GSC,CU56:GSC,CU57:GC,CU58:GC,`
## CU59
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU59 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Seguridad/Usuarios.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M4Controller.ts |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; Vistas/src/views/Seguridad/Usuarios.test.tsx; Vistas/src/views/Seguridad/Usuarios.tsx |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | Controladores/pruebas/m9-productores-failclosed.test.cjs; auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/m4.test.cjs; Controladores/pruebas/m9-productores-failclosed.test.cjs; Vistas/src/views/Seguridad/Usuarios.test.tsx |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU60, CU61, CU62, CU63, CU64, CU65, CU66, CU67, CU71, CU72, CU74, CU110, CU137, CU150 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m4.test.cjs`
- `Controladores/pruebas/m9-productores-failclosed.test.cjs`
- `Controladores/src/controladores/M4Controller.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Seguridad/Usuarios.test.tsx`
- `Vistas/src/views/Seguridad/Usuarios.tsx`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
- `documentacion/DELTA_M4.md`
- `documentacion/ESTADO_TECNICO_VIGENTE.md`
### Evidencia textual
- `'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150',`
- `- CU67 conserva la consulta de usuarios, configuración, permisos y rol Administrador para Gerencia en modo de sólo lectura. CU59–CU66, CU71, CU72 y CU74 exigen además rol Administrador.`
- `/** Único controlador funcional M4 (CU59–CU74). Ningún otro módulo lo invoca. */`
- `CU59:'Crear usuarios y consultar catálogos', CU60:'Desactivar usuario', CU61:'Reactivar usuario', CU62:'Cambiar perfil de usuario',`
## CU60
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU60 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Seguridad/Usuarios.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; Vistas/src/views/Seguridad/Usuarios.tsx |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | NO CONFIRMADO EN EL REPOSITORIO |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU59, CU61, CU62, CU63, CU64, CU65, CU66, CU67, CU71, CU72, CU73, CU74, CU110, CU137, CU150 |
| 23. Estado actual | REGISTRADO O REFERENCIADO; COBERTURA FOCAL NO ENLAZADA |
### Trazabilidad completa de archivos
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Seguridad/Usuarios.tsx`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150',`
- `CU59:'Crear usuarios y consultar catálogos', CU60:'Desactivar usuario', CU61:'Reactivar usuario', CU62:'Cambiar perfil de usuario',`
- `CU59:G,CU60:G,CU61:G,CU62:G,CU63:G,CU64:G,CU65:G,CU66:G,CU67:G,`
- `CU60:['CU67'],CU61:['CU67'],CU62:['CU67'],CU63:['CU67'],CU64:['CU67'],CU65:['CU67'],CU66:['CU67'],CU71:['CU67'],CU72:['CU67'],CU74:['CU73'],`
## CU61
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU61 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Seguridad/Usuarios.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; Vistas/src/views/Seguridad/Usuarios.tsx |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | NO CONFIRMADO EN EL REPOSITORIO |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU59, CU60, CU62, CU63, CU64, CU65, CU66, CU67, CU71, CU72, CU73, CU74, CU110, CU137, CU150 |
| 23. Estado actual | REGISTRADO O REFERENCIADO; COBERTURA FOCAL NO ENLAZADA |
### Trazabilidad completa de archivos
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Seguridad/Usuarios.tsx`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150',`
- `CU59:'Crear usuarios y consultar catálogos', CU60:'Desactivar usuario', CU61:'Reactivar usuario', CU62:'Cambiar perfil de usuario',`
- `CU59:G,CU60:G,CU61:G,CU62:G,CU63:G,CU64:G,CU65:G,CU66:G,CU67:G,`
- `CU60:['CU67'],CU61:['CU67'],CU62:['CU67'],CU63:['CU67'],CU64:['CU67'],CU65:['CU67'],CU66:['CU67'],CU71:['CU67'],CU72:['CU67'],CU74:['CU73'],`
## CU62
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU62 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Seguridad/Usuarios.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M4Controller.ts |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; Vistas/src/views/Seguridad/Usuarios.test.tsx; Vistas/src/views/Seguridad/Usuarios.tsx |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/m4-permisos-funcionales.test.cjs; Vistas/src/views/Seguridad/Usuarios.test.tsx |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU59, CU60, CU61, CU63, CU64, CU65, CU66, CU67, CU71, CU72, CU73, CU74, CU110, CU137, CU150 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m4-permisos-funcionales.test.cjs`
- `Controladores/src/controladores/M4Controller.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Seguridad/Usuarios.test.tsx`
- `Vistas/src/views/Seguridad/Usuarios.tsx`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150',`
- `CU59:'Crear usuarios y consultar catálogos', CU60:'Desactivar usuario', CU61:'Reactivar usuario', CU62:'Cambiar perfil de usuario',`
- `CU59:G,CU60:G,CU61:G,CU62:G,CU63:G,CU64:G,CU65:G,CU66:G,CU67:G,`
- `CU60:['CU67'],CU61:['CU67'],CU62:['CU67'],CU63:['CU67'],CU64:['CU67'],CU65:['CU67'],CU66:['CU67'],CU71:['CU67'],CU72:['CU67'],CU74:['CU73'],`
## CU63
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU63 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Seguridad/Usuarios.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M4Controller.ts |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; Vistas/src/views/Seguridad/Usuarios.test.tsx; Vistas/src/views/Seguridad/Usuarios.tsx; Vistas/src/views/Seguridad/permisosM4.test.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/m4-permisos-funcionales.test.cjs; Vistas/src/views/Seguridad/Usuarios.test.tsx; Vistas/src/views/Seguridad/permisosM4.test.ts |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU59, CU60, CU61, CU62, CU64, CU65, CU66, CU67, CU71, CU72, CU73, CU74, CU110, CU137, CU150 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m4-permisos-funcionales.test.cjs`
- `Controladores/src/controladores/M4Controller.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Seguridad/Usuarios.test.tsx`
- `Vistas/src/views/Seguridad/Usuarios.tsx`
- `Vistas/src/views/Seguridad/permisosM4.test.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150',`
- `CU59:G,CU60:G,CU61:G,CU62:G,CU63:G,CU64:G,CU65:G,CU66:G,CU67:G,`
- `CU60:['CU67'],CU61:['CU67'],CU62:['CU67'],CU63:['CU67'],CU64:['CU67'],CU65:['CU67'],CU66:['CU67'],CU71:['CU67'],CU72:['CU67'],CU74:['CU73'],`
- `CU63:'Asignar permisos particulares', CU64:'Retirar permisos particulares', CU65:'Asignar rol Administrador', CU66:'Retirar rol Administrador', CU67:'Ver usuarios y accesos',`
## CU64
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU64 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Seguridad/Usuarios.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M4Controller.ts |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; Vistas/src/views/Seguridad/Usuarios.test.tsx; Vistas/src/views/Seguridad/Usuarios.tsx |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/m4-permisos-funcionales.test.cjs; Controladores/pruebas/m4.test.cjs; Vistas/src/views/Seguridad/Usuarios.test.tsx |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU59, CU60, CU61, CU62, CU63, CU65, CU66, CU67, CU71, CU72, CU73, CU74, CU110, CU137, CU150 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m4-permisos-funcionales.test.cjs`
- `Controladores/pruebas/m4.test.cjs`
- `Controladores/src/controladores/M4Controller.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Seguridad/Usuarios.test.tsx`
- `Vistas/src/views/Seguridad/Usuarios.tsx`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150',`
- `CU59:G,CU60:G,CU61:G,CU62:G,CU63:G,CU64:G,CU65:G,CU66:G,CU67:G,`
- `CU60:['CU67'],CU61:['CU67'],CU62:['CU67'],CU63:['CU67'],CU64:['CU67'],CU65:['CU67'],CU66:['CU67'],CU71:['CU67'],CU72:['CU67'],CU74:['CU73'],`
- `CU63:'Asignar permisos particulares', CU64:'Retirar permisos particulares', CU65:'Asignar rol Administrador', CU66:'Retirar rol Administrador', CU67:'Ver usuarios y accesos',`
## CU65
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU65 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Seguridad/Usuarios.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M4Controller.ts |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; Vistas/src/views/Seguridad/Usuarios.test.tsx; Vistas/src/views/Seguridad/Usuarios.tsx |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/c4-2-permisos-midas.test.cjs; Vistas/src/views/Seguridad/Usuarios.test.tsx |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU59, CU60, CU61, CU62, CU63, CU64, CU66, CU67, CU71, CU72, CU73, CU74, CU110, CU137, CU150 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/seed-m4.ts`
- `Controladores/pruebas/c4-2-permisos-midas.test.cjs`
- `Controladores/src/controladores/M4Controller.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Seguridad/Usuarios.test.tsx`
- `Vistas/src/views/Seguridad/Usuarios.tsx`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150',`
- `CU59:G,CU60:G,CU61:G,CU62:G,CU63:G,CU64:G,CU65:G,CU66:G,CU67:G,`
- `CU60:['CU67'],CU61:['CU67'],CU62:['CU67'],CU63:['CU67'],CU64:['CU67'],CU65:['CU67'],CU66:['CU67'],CU71:['CU67'],CU72:['CU67'],CU74:['CU73'],`
- `CU63:'Asignar permisos particulares', CU64:'Retirar permisos particulares', CU65:'Asignar rol Administrador', CU66:'Retirar rol Administrador', CU67:'Ver usuarios y accesos',`
## CU66
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU66 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Seguridad/Usuarios.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M4Controller.ts |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; Vistas/src/views/Seguridad/Usuarios.test.tsx; Vistas/src/views/Seguridad/Usuarios.tsx |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/c4-2-permisos-midas.test.cjs; Controladores/pruebas/m4.test.cjs; Vistas/src/views/Seguridad/Usuarios.test.tsx |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU59, CU60, CU61, CU62, CU63, CU64, CU65, CU67, CU71, CU72, CU73, CU74, CU110, CU137, CU150 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/seed-m4.ts`
- `Controladores/pruebas/c4-2-permisos-midas.test.cjs`
- `Controladores/pruebas/m4.test.cjs`
- `Controladores/src/controladores/M4Controller.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Seguridad/Usuarios.test.tsx`
- `Vistas/src/views/Seguridad/Usuarios.tsx`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
- `documentacion/ESTADO_TECNICO_VIGENTE.md`
### Evidencia textual
- `'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150',`
- `- CU67 conserva la consulta de usuarios, configuración, permisos y rol Administrador para Gerencia en modo de sólo lectura. CU59–CU66, CU71, CU72 y CU74 exigen además rol Administrador.`
- `CU59:G,CU60:G,CU61:G,CU62:G,CU63:G,CU64:G,CU65:G,CU66:G,CU67:G,`
- `CU60:['CU67'],CU61:['CU67'],CU62:['CU67'],CU63:['CU67'],CU64:['CU67'],CU65:['CU67'],CU66:['CU67'],CU71:['CU67'],CU72:['CU67'],CU74:['CU73'],`
## CU67
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | - CU67 conserva la consulta de usuarios, configuración, permisos y rol Administrador para Gerencia en modo de sólo lectura. CU59–CU66, CU71, CU72 y CU74 exigen además rol Administrador. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU67 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | NO CONFIRMADO EN EL REPOSITORIO |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU59, CU60, CU61, CU62, CU63, CU64, CU65, CU66, CU71, CU72, CU73, CU74 |
| 23. Estado actual | REGISTRADO O REFERENCIADO; COBERTURA FOCAL NO ENLAZADA |
### Trazabilidad completa de archivos
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
- `documentacion/ESTADO_TECNICO_VIGENTE.md`
### Evidencia textual
- `- CU67 conserva la consulta de usuarios, configuración, permisos y rol Administrador para Gerencia en modo de sólo lectura. CU59–CU66, CU71, CU72 y CU74 exigen además rol Administrador.`
- `<Route path="usuarios" element={<Protegido permiso="CU67"><Usuarios/></Protegido>}/>`
- `CU59:G,CU60:G,CU61:G,CU62:G,CU63:G,CU64:G,CU65:G,CU66:G,CU67:G,`
- `CU60:['CU67'],CU61:['CU67'],CU62:['CU67'],CU63:['CU67'],CU64:['CU67'],CU65:['CU67'],CU66:['CU67'],CU71:['CU67'],CU72:['CU67'],CU74:['CU73'],`
## CU68
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | ## CU68 |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU68 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | Controladores/src/controladores/C_Finanzas.ts |
| 13. Controlador | Controladores/src/controladores/C_Finanzas.ts |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU70 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
- `documentacion/DELTA_M4.md`
- `documentacion/ESTADO_TECNICO_VIGENTE.md`
### Evidencia textual
- `## CU68`
- `- CU68 mantiene una sola sesión activa. Si las credenciales son válidas y ya existe una sesión, la pantalla permite conservarla o confirmar su cierre antes de crear la nueva.`
- `// CU68/CU70 no exigen sesión previa. Cada comando protegido representa una confirmación de CU.`
- `1. CU68: se rechaza una segunda sesión y se mantiene la primera; decisión conservadora provisional ante “bloquea la sesión”.`
## CU69
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU68:'Consultar sesión propia', CU69:'Cambiar contraseña propia', CU70:'Cerrar sesión propia', CU71:'Restablecer contraseña de usuario', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU69 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU68, CU70, CU71, CU72, CU73, CU74 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
### Evidencia textual
- `CU68:'Consultar sesión propia', CU69:'Cambiar contraseña propia', CU70:'Cerrar sesión propia', CU71:'Restablecer contraseña de usuario',`
- `CU68:GSC,CU69:GSC,CU70:GSC,CU71:G,CU72:G,CU73:G,CU74:G,`
- `const esperados=Object.fromEntries(Object.entries(actores).map(([perfil,codigos])=>[perfil,codigos.filter(codigo=>!['CU68','CU69','CU70'].includes(codigo))]));`
- `const operacionesPersonales = new Set(['CU68','CU69','CU70']);`
## CU70
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | - CU70 permite que el administrador original utilice su correo asociado para recuperarse incluso con bloqueo persistente; las demás cuentas con ese bloqueo siguen excluidas del mecanismo autónomo. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU70 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | Controladores/src/controladores/C_Finanzas.ts |
| 13. Controlador | Controladores/src/controladores/C_Finanzas.ts |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU68, CU69, CU71 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
- `documentacion/ESTADO_TECNICO_VIGENTE.md`
### Evidencia textual
- `- CU70 permite que el administrador original utilice su correo asociado para recuperarse incluso con bloqueo persistente; las demás cuentas con ese bloqueo siguen excluidas del mecanismo autónomo.`
- `- CU70 usa un proveedor de correo provisional/injectable; no se presenta como integración externa terminada.`
- `// CU68/CU70 no exigen sesión previa. Cada comando protegido representa una confirmación de CU.`
- `CU68:'Consultar sesión propia', CU69:'Cambiar contraseña propia', CU70:'Cerrar sesión propia', CU71:'Restablecer contraseña de usuario',`
## CU71
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU71 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Seguridad/Usuarios.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; Vistas/src/views/Seguridad/Usuarios.test.tsx; Vistas/src/views/Seguridad/Usuarios.tsx |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/m4.test.cjs; Vistas/src/views/Seguridad/Usuarios.test.tsx |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU59, CU60, CU61, CU62, CU63, CU64, CU65, CU66, CU67, CU68, CU69, CU70, CU72, CU73, CU74, CU110, CU137, CU150 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m4.test.cjs`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Seguridad/Usuarios.test.tsx`
- `Vistas/src/views/Seguridad/Usuarios.tsx`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
- `documentacion/ESTADO_TECNICO_VIGENTE.md`
### Evidencia textual
- `'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150',`
- `- CU67 conserva la consulta de usuarios, configuración, permisos y rol Administrador para Gerencia en modo de sólo lectura. CU59–CU66, CU71, CU72 y CU74 exigen además rol Administrador.`
- `CU60:['CU67'],CU61:['CU67'],CU62:['CU67'],CU63:['CU67'],CU64:['CU67'],CU65:['CU67'],CU66:['CU67'],CU71:['CU67'],CU72:['CU67'],CU74:['CU73'],`
- `CU68:'Consultar sesión propia', CU69:'Cambiar contraseña propia', CU70:'Cerrar sesión propia', CU71:'Restablecer contraseña de usuario',`
## CU72
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU72 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Seguridad/Usuarios.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; Vistas/src/views/Seguridad/Usuarios.test.tsx; Vistas/src/views/Seguridad/Usuarios.tsx |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Vistas/src/views/Seguridad/Usuarios.test.tsx |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU59, CU60, CU61, CU62, CU63, CU64, CU65, CU66, CU67, CU68, CU69, CU70, CU71, CU73, CU74, CU110, CU137, CU150 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Seguridad/Usuarios.test.tsx`
- `Vistas/src/views/Seguridad/Usuarios.tsx`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
- `documentacion/ESTADO_TECNICO_VIGENTE.md`
### Evidencia textual
- `'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150',`
- `- CU67 conserva la consulta de usuarios, configuración, permisos y rol Administrador para Gerencia en modo de sólo lectura. CU59–CU66, CU71, CU72 y CU74 exigen además rol Administrador.`
- `CU60:['CU67'],CU61:['CU67'],CU62:['CU67'],CU63:['CU67'],CU64:['CU67'],CU65:['CU67'],CU66:['CU67'],CU71:['CU67'],CU72:['CU67'],CU74:['CU73'],`
- `CU68:GSC,CU69:GSC,CU70:GSC,CU71:G,CU72:G,CU73:G,CU74:G,`
## CU73
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | - CU73 presenta todas las cuentas con su estado de sesión. Gerencia recibe el estado básico y el rol Administrador habilita fecha, vigencia, dirección, agente y cierre autorizado. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU73 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/pruebas/m4-seguridad-fina.test.cjs; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/m4-seguridad-fina.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU60, CU61, CU62, CU63, CU64, CU65, CU66, CU67, CU71, CU72, CU74 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m4-seguridad-fina.test.cjs`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
- `documentacion/DELTA_M4.md`
- `documentacion/ESTADO_TECNICO_VIGENTE.md`
### Evidencia textual
- `- CU73 presenta todas las cuentas con su estado de sesión. Gerencia recibe el estado básico y el rol Administrador habilita fecha, vigencia, dirección, agente y cierre autorizado.`
- `2. CU73: no se inventa Excepción 1; la contradicción con “No aplica” requiere delta funcional.`
- `<Route path="sesiones" element={<Protegido permiso="CU73"><Sesiones/></Protegido>}/>`
- `CU60:['CU67'],CU61:['CU67'],CU62:['CU67'],CU63:['CU67'],CU64:['CU67'],CU65:['CU67'],CU66:['CU67'],CU71:['CU67'],CU72:['CU67'],CU74:['CU73'],`
## CU74
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | # Auditoría conservadora de cobertura CU01–CU74 |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU74 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Seguridad/Sesiones.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M4Controller.ts |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/pruebas/m4-seguridad-fina.test.cjs; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; Vistas/src/views/Seguridad/Sesiones.tsx |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | auditoria-cu-corregida.md; auditoria-cu-final.md; auditoria-cu-inicial.md |
| 19. Pruebas | Controladores/pruebas/c4-2-permisos-midas.test.cjs; Controladores/pruebas/m4-seguridad-fina.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU01, CU59, CU60, CU61, CU62, CU63, CU64, CU65, CU66, CU71, CU72, CU110, CU137, CU150, CU355, CU359, CU360, CU378, CU379, CU380, CU381 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/seed-m4.ts`
- `Controladores/pruebas/c4-2-permisos-midas.test.cjs`
- `Controladores/pruebas/m4-seguridad-fina.test.cjs`
- `Controladores/src/controladores/M4Controller.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Seguridad/Sesiones.tsx`
- `auditoria-cu-corregida.md`
- `auditoria-cu-final.md`
- `auditoria-cu-inicial.md`
- `documentacion/DELTA_M4.md`
- `documentacion/ESTADO_TECNICO_VIGENTE.md`
### Evidencia textual
- `# Auditoría conservadora de cobertura CU01–CU74`
- `# Auditoría inicial de cobertura CU01 a CU74`
- `'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150',`
- `'CU74','CU355','CU359','CU360','CU378','CU379','CU380','CU381',`
## CU75
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | -- CU75 y CU77 exigen país funcionalmente para toda alta o identidad corregida. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Auditoria M9 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU75 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/CatalogoProveedores/CatalogoProveedores.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/007_m5_proveedores/migration.sql |
| 18. Auditoria M9 | Controladores/pruebas/m9-productores-failclosed.test.cjs |
| 19. Pruebas | Controladores/pruebas/m5-cu146-cu154.test.cjs; Controladores/pruebas/m5-cu75-cu84.test.cjs; Controladores/pruebas/m9-productores-failclosed.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU76, CU77, CU78, CU79, CU80, CU81, CU82, CU83, CU84 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/007_m5_proveedores/migration.sql`
- `Controladores/prisma/seed.ts`
- `Controladores/pruebas/m5-cu146-cu154.test.cjs`
- `Controladores/pruebas/m5-cu75-cu84.test.cjs`
- `Controladores/pruebas/m9-productores-failclosed.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/CatalogoProveedores/CatalogoProveedores.tsx`
### Evidencia textual
- `-- CU75 y CU77 exigen país funcionalmente para toda alta o identidad corregida.`
- `-- Soporte mínimo para CU75-CU84. Debe reconciliarse con el próximo patch del equipo de BD.`
- `/** Escenarios visuales repetibles de M5 para catálogo, filtros y fichas CU75-CU84. */`
- `CU75:G,CU76:GS,CU77:G,CU78:G,CU79:G,CU80:GSC,CU81:GSC,CU82:GSC,CU83:GSC,CU84:GSC,`
## CU76
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'TEMPORAL_M5_DB_PATCH: trazabilidad operativa CU76-CU79 pendiente de reconciliación'; |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU76 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/CatalogoProveedores/CatalogoProveedores.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/007_m5_proveedores/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu75-cu84.test.cjs; Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU75, CU77, CU78, CU79, CU80, CU81, CU82, CU83, CU84, CU85, CU86, CU87, CU88, CU89, CU90, CU91, CU92, CU93, CU94 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/007_m5_proveedores/migration.sql`
- `Controladores/pruebas/m5-cu75-cu84.test.cjs`
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/CatalogoProveedores/CatalogoProveedores.tsx`
### Evidencia textual
- `'TEMPORAL_M5_DB_PATCH: trazabilidad operativa CU76-CU79 pendiente de reconciliación';`
- `CU75:G,CU76:GS,CU77:G,CU78:G,CU79:G,CU80:GSC,CU81:GSC,CU82:GSC,CU83:GSC,CU84:GSC,`
- `CU76:['CU80'],CU77:['CU80'],CU78:['CU80'],CU79:['CU80'],CU81:['CU80'],CU82:['CU80'],CU83:['CU80'],CU84:['CU80'],CU85:['CU84'],CU86:['CU80'],CU87:['CU84'],CU89:['CU88'],CU90:['CU88'],CU91:['CU88'],CU92:['CU88'],CU93:['CU88'],CU94:['CU88'],`
- `assert.deepEqual(actores('CU76'), ['gerencia', 'secretaria']);`
## CU77
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | -- CU75 y CU77 exigen país funcionalmente para toda alta o identidad corregida. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU77 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/CatalogoProveedores/CatalogoProveedores.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M5Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/007_m5_proveedores/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu75-cu84.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU75, CU76, CU78, CU79, CU80, CU81, CU82, CU83, CU84, CU85, CU86, CU87, CU88, CU89, CU90, CU91, CU92, CU93, CU94 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/007_m5_proveedores/migration.sql`
- `Controladores/pruebas/m5-cu75-cu84.test.cjs`
- `Controladores/src/controladores/M5Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/CatalogoProveedores/CatalogoProveedores.tsx`
### Evidencia textual
- `-- CU75 y CU77 exigen país funcionalmente para toda alta o identidad corregida.`
- `CU75:G,CU76:GS,CU77:G,CU78:G,CU79:G,CU80:GSC,CU81:GSC,CU82:GSC,CU83:GSC,CU84:GSC,`
- `CU76:['CU80'],CU77:['CU80'],CU78:['CU80'],CU79:['CU80'],CU81:['CU80'],CU82:['CU80'],CU83:['CU80'],CU84:['CU80'],CU85:['CU84'],CU86:['CU80'],CU87:['CU84'],CU89:['CU88'],CU90:['CU88'],CU91:['CU88'],CU92:['CU88'],CU93:['CU88'],CU94:['CU88'],`
- `await assert.rejects(modulo.actualizarProveedor(id, { identificador: identificadorFiscal() }, usuario.usuario_id_usuario), error => error.estado === 400 && /CU77/.test(error.message));`
## CU78
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU75:G,CU76:GS,CU77:G,CU78:G,CU79:G,CU80:GSC,CU81:GSC,CU82:GSC,CU83:GSC,CU84:GSC, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU78 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/CatalogoProveedores/CatalogoProveedores.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu75-cu84.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU75, CU76, CU77, CU79, CU80, CU81, CU82, CU83, CU84, CU85, CU86, CU87, CU88, CU89, CU90, CU91, CU92, CU93, CU94 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu75-cu84.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/CatalogoProveedores/CatalogoProveedores.tsx`
### Evidencia textual
- `CU75:G,CU76:GS,CU77:G,CU78:G,CU79:G,CU80:GSC,CU81:GSC,CU82:GSC,CU83:GSC,CU84:GSC,`
- `CU76:['CU80'],CU77:['CU80'],CU78:['CU80'],CU79:['CU80'],CU81:['CU80'],CU82:['CU80'],CU83:['CU80'],CU84:['CU80'],CU85:['CU84'],CU86:['CU80'],CU87:['CU84'],CU89:['CU88'],CU90:['CU88'],CU91:['CU88'],CU92:['CU88'],CU93:['CU88'],CU94:['CU88'],`
- `crearProveedor:'CU75', actualizarProveedor:'CU76', corregirIdentidadProveedor:'CU77', desactivarProveedor:'CU78', reactivarProveedor:'CU79',`
- `for (const codigo of ['CU77', 'CU78', 'CU79']) assert.deepEqual(actores(codigo), ['gerencia']);`
## CU79
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'TEMPORAL_M5_DB_PATCH: trazabilidad operativa CU76-CU79 pendiente de reconciliación'; |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU79 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/CatalogoProveedores/CatalogoProveedores.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M5Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/007_m5_proveedores/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu75-cu84.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU75, CU76, CU77, CU78, CU80, CU81, CU82, CU83, CU84, CU85, CU86, CU87, CU88, CU89, CU90, CU91, CU92, CU93, CU94 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/007_m5_proveedores/migration.sql`
- `Controladores/pruebas/m5-cu75-cu84.test.cjs`
- `Controladores/src/controladores/M5Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/CatalogoProveedores/CatalogoProveedores.tsx`
### Evidencia textual
- `'TEMPORAL_M5_DB_PATCH: trazabilidad operativa CU76-CU79 pendiente de reconciliación';`
- `CU75:G,CU76:GS,CU77:G,CU78:G,CU79:G,CU80:GSC,CU81:GSC,CU82:GSC,CU83:GSC,CU84:GSC,`
- `CU76:['CU80'],CU77:['CU80'],CU78:['CU80'],CU79:['CU80'],CU81:['CU80'],CU82:['CU80'],CU83:['CU80'],CU84:['CU80'],CU85:['CU84'],CU86:['CU80'],CU87:['CU84'],CU89:['CU88'],CU90:['CU88'],CU91:['CU88'],CU92:['CU88'],CU93:['CU88'],CU94:['CU88'],`
- `crearProveedor:'CU75', actualizarProveedor:'CU76', corregirIdentidadProveedor:'CU77', desactivarProveedor:'CU78', reactivarProveedor:'CU79',`
## CU80
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | /** Única fuente para la etiqueta y el filtro financiero de CU80/CU83. */ |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU80 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M5Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu75-cu84.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU75, CU76, CU77, CU78, CU79, CU81, CU82, CU83, CU84, CU85, CU86, CU87, CU88, CU89, CU90, CU91, CU92, CU93, CU94 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/seed.ts`
- `Controladores/pruebas/m5-cu75-cu84.test.cjs`
- `Controladores/src/controladores/M5Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
### Evidencia textual
- `/** Única fuente para la etiqueta y el filtro financiero de CU80/CU83. */`
- `<Route path="proveedores" element={<Protegido permiso="CU80"><CatalogoProveedores /></Protegido>} />`
- `CU75:G,CU76:GS,CU77:G,CU78:G,CU79:G,CU80:GSC,CU81:GSC,CU82:GSC,CU83:GSC,CU84:GSC,`
- `CU76:['CU80'],CU77:['CU80'],CU78:['CU80'],CU79:['CU80'],CU81:['CU80'],CU82:['CU80'],CU83:['CU80'],CU84:['CU80'],CU85:['CU84'],CU86:['CU80'],CU87:['CU84'],CU89:['CU88'],CU90:['CU88'],CU91:['CU88'],CU92:['CU88'],CU93:['CU88'],CU94:['CU88'],`
## CU81
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU75:G,CU76:GS,CU77:G,CU78:G,CU79:G,CU80:GSC,CU81:GSC,CU82:GSC,CU83:GSC,CU84:GSC, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU81 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | Controladores/src/controladores/C_Finanzas.ts |
| 13. Controlador | Controladores/src/controladores/C_Finanzas.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu75-cu84.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU75, CU76, CU77, CU78, CU79, CU80, CU82, CU83, CU84, CU85, CU86, CU87, CU88, CU89, CU90, CU91, CU92, CU93, CU94 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu75-cu84.test.cjs`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/validaciones/permisos.ts`
### Evidencia textual
- `CU75:G,CU76:GS,CU77:G,CU78:G,CU79:G,CU80:GSC,CU81:GSC,CU82:GSC,CU83:GSC,CU84:GSC,`
- `CU76:['CU80'],CU77:['CU80'],CU78:['CU80'],CU79:['CU80'],CU81:['CU80'],CU82:['CU80'],CU83:['CU80'],CU84:['CU80'],CU85:['CU84'],CU86:['CU80'],CU87:['CU84'],CU89:['CU88'],CU90:['CU88'],CU91:['CU88'],CU92:['CU88'],CU93:['CU88'],CU94:['CU88'],`
- `for (const codigo of ['CU80', 'CU81', 'CU82', 'CU83', 'CU84']) assert.deepEqual(actores(codigo), ['contador', 'gerencia', 'secretaria']);`
- `if(solicitud.consulta?.busqueda) adicionales.push('CU81');`
## CU82
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU75:G,CU76:GS,CU77:G,CU78:G,CU79:G,CU80:GSC,CU81:GSC,CU82:GSC,CU83:GSC,CU84:GSC, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU82 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | Controladores/src/controladores/C_Finanzas.ts |
| 13. Controlador | Controladores/src/controladores/C_Finanzas.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu75-cu84.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU75, CU76, CU77, CU78, CU79, CU80, CU81, CU83, CU84, CU85, CU86, CU87, CU88, CU89, CU90, CU91, CU92, CU93, CU94 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu75-cu84.test.cjs`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/validaciones/permisos.ts`
### Evidencia textual
- `CU75:G,CU76:GS,CU77:G,CU78:G,CU79:G,CU80:GSC,CU81:GSC,CU82:GSC,CU83:GSC,CU84:GSC,`
- `CU76:['CU80'],CU77:['CU80'],CU78:['CU80'],CU79:['CU80'],CU81:['CU80'],CU82:['CU80'],CU83:['CU80'],CU84:['CU80'],CU85:['CU84'],CU86:['CU80'],CU87:['CU84'],CU89:['CU88'],CU90:['CU88'],CU91:['CU88'],CU92:['CU88'],CU93:['CU88'],CU94:['CU88'],`
- `for (const codigo of ['CU80', 'CU81', 'CU82', 'CU83', 'CU84']) assert.deepEqual(actores(codigo), ['contador', 'gerencia', 'secretaria']);`
- `if(solicitud.consulta?.estado && String(solicitud.consulta.estado).toLowerCase()!=='todos') adicionales.push('CU82');`
## CU83
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | /** Única fuente para la etiqueta y el filtro financiero de CU80/CU83. */ |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU83 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | Controladores/src/controladores/C_Finanzas.ts |
| 13. Controlador | Controladores/src/controladores/C_Finanzas.ts; Controladores/src/controladores/M5Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu106-cu110.test.cjs; Controladores/pruebas/m5-cu75-cu84.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU75, CU76, CU77, CU78, CU79, CU80, CU81, CU82, CU84, CU85, CU86, CU87, CU88, CU89, CU90, CU91, CU92, CU93, CU94 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu106-cu110.test.cjs`
- `Controladores/pruebas/m5-cu75-cu84.test.cjs`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/controladores/M5Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
### Evidencia textual
- `/** Única fuente para la etiqueta y el filtro financiero de CU80/CU83. */`
- `CU75:G,CU76:GS,CU77:G,CU78:G,CU79:G,CU80:GSC,CU81:GSC,CU82:GSC,CU83:GSC,CU84:GSC,`
- `CU76:['CU80'],CU77:['CU80'],CU78:['CU80'],CU79:['CU80'],CU81:['CU80'],CU82:['CU80'],CU83:['CU80'],CU84:['CU80'],CU85:['CU84'],CU86:['CU80'],CU87:['CU84'],CU89:['CU88'],CU90:['CU88'],CU91:['CU88'],CU92:['CU88'],CU93:['CU88'],CU94:['CU88'],`
- `for (const codigo of ['CU80', 'CU81', 'CU82', 'CU83', 'CU84']) assert.deepEqual(actores(codigo), ['contador', 'gerencia', 'secretaria']);`
## CU84
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | -- Soporte mínimo para CU75-CU84. Debe reconciliarse con el próximo patch del equipo de BD. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Auditoria M9 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU84 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/CatalogoProveedores/CatalogoProveedores.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/m9/autorizacion.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/007_m5_proveedores/migration.sql |
| 18. Auditoria M9 | Controladores/src/m9/autorizacion.ts |
| 19. Pruebas | Controladores/pruebas/m5-cu75-cu84.test.cjs; Controladores/pruebas/m7-cierre-hallazgos.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU75, CU76, CU77, CU78, CU79, CU80, CU81, CU82, CU83 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/007_m5_proveedores/migration.sql`
- `Controladores/prisma/seed.ts`
- `Controladores/pruebas/m5-cu75-cu84.test.cjs`
- `Controladores/pruebas/m7-cierre-hallazgos.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/m9/autorizacion.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/CatalogoProveedores/CatalogoProveedores.tsx`
### Evidencia textual
- `-- Soporte mínimo para CU75-CU84. Debe reconciliarse con el próximo patch del equipo de BD.`
- `/** Escenarios visuales repetibles de M5 para catálogo, filtros y fichas CU75-CU84. */`
- `<Route path="proveedores/:id" element={<Protegido permiso="CU84"><VerFichaProveedor /></Protegido>} />`
- `CU75:G,CU76:GS,CU77:G,CU78:G,CU79:G,CU80:GSC,CU81:GSC,CU82:GSC,CU83:GSC,CU84:GSC,`
## CU85
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU76:['CU80'],CU77:['CU80'],CU78:['CU80'],CU79:['CU80'],CU81:['CU80'],CU82:['CU80'],CU83:['CU80'],CU84:['CU80'],CU85:['CU84'],CU86:['CU80'],CU87:['CU84'],CU89:['CU88'],CU90:['CU88'],CU91:['CU88'],CU92:['CU88'],CU93:['CU88'],CU94:['CU88'], |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU85 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/VerFichaProveedor/VerFichaProveedor.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | Controladores/src/controladores/C_Finanzas.ts |
| 13. Controlador | Controladores/src/controladores/C_Finanzas.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu85-cu90.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU76, CU77, CU78, CU79, CU80, CU81, CU82, CU83, CU84, CU86, CU87, CU88, CU89, CU90, CU91, CU92, CU93, CU94 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu85-cu90.test.cjs`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/VerFichaProveedor/VerFichaProveedor.tsx`
### Evidencia textual
- `CU76:['CU80'],CU77:['CU80'],CU78:['CU80'],CU79:['CU80'],CU81:['CU80'],CU82:['CU80'],CU83:['CU80'],CU84:['CU80'],CU85:['CU84'],CU86:['CU80'],CU87:['CU84'],CU89:['CU88'],CU90:['CU88'],CU91:['CU88'],CU92:['CU88'],CU93:['CU88'],CU94:['CU88'],`
- `CU85:GSC,CU86:GSC,CU87:GC,CU88:GSC,CU89:GS,CU90:GS,`
- `await assert.rejects(fachada.ejecutar('abrirFichaProveedor', { parametros: { id: 1 }, consulta: { tipoAntecedente: 'pagos' }, contexto: {} }), /CU85/);`
- `await crearDocumento(proveedor.id_proveedor, 100, new Date('2026-03-01T00:00:00Z'), `CU85-${Date.now()}`);`
## CU86
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU76:['CU80'],CU77:['CU80'],CU78:['CU80'],CU79:['CU80'],CU81:['CU80'],CU82:['CU80'],CU83:['CU80'],CU84:['CU80'],CU85:['CU84'],CU86:['CU80'],CU87:['CU84'],CU89:['CU88'],CU90:['CU88'],CU91:['CU88'],CU92:['CU88'],CU93:['CU88'],CU94:['CU88'], |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU86 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/CatalogoProveedores/CatalogoProveedores.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | Controladores/src/controladores/C_Finanzas.ts |
| 13. Controlador | Controladores/src/controladores/C_Finanzas.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu85-cu90.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU76, CU77, CU78, CU79, CU80, CU81, CU82, CU83, CU84, CU85, CU87, CU88, CU89, CU90, CU91, CU92, CU93, CU94 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu85-cu90.test.cjs`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/CatalogoProveedores/CatalogoProveedores.tsx`
### Evidencia textual
- `CU76:['CU80'],CU77:['CU80'],CU78:['CU80'],CU79:['CU80'],CU81:['CU80'],CU82:['CU80'],CU83:['CU80'],CU84:['CU80'],CU85:['CU84'],CU86:['CU80'],CU87:['CU84'],CU89:['CU88'],CU90:['CU88'],CU91:['CU88'],CU92:['CU88'],CU93:['CU88'],CU94:['CU88'],`
- `CU85:GSC,CU86:GSC,CU87:GC,CU88:GSC,CU89:GS,CU90:GS,`
- `assert.deepEqual(asc.map(item => item.razonSocial), ['Orden CU86 Alfa', 'Orden CU86 Zeta']);`
- `assert.deepEqual(desc.map(item => item.razonSocial), ['Orden CU86 Zeta', 'Orden CU86 Alfa']);`
## CU87
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'TEMPORAL_M5_DB_PATCH: DIAS_CORRIDOS o DIAS_HABILES para la política prospectiva CU87'; |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU87 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/VerFichaProveedor/VerFichaProveedor.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/008_m5_ocs_condicion_pago/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu85-cu90.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU76, CU77, CU78, CU79, CU80, CU81, CU82, CU83, CU84, CU85, CU86, CU88, CU89, CU90, CU91, CU92, CU93, CU94 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/008_m5_ocs_condicion_pago/migration.sql`
- `Controladores/pruebas/m5-cu85-cu90.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/VerFichaProveedor/VerFichaProveedor.tsx`
### Evidencia textual
- `'TEMPORAL_M5_DB_PATCH: DIAS_CORRIDOS o DIAS_HABILES para la política prospectiva CU87';`
- `'TEMPORAL_M5_DB_PATCH: cantidad de días de la política prospectiva CU87';`
- `-- Soporte mínimo para CU87-CU90. Debe reconciliarse con el patch definitivo del equipo de BD.`
- `CU76:['CU80'],CU77:['CU80'],CU78:['CU80'],CU79:['CU80'],CU81:['CU80'],CU82:['CU80'],CU83:['CU80'],CU84:['CU80'],CU85:['CU84'],CU86:['CU80'],CU87:['CU84'],CU89:['CU88'],CU90:['CU88'],CU91:['CU88'],CU92:['CU88'],CU93:['CU88'],CU94:['CU88'],`
## CU88
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'TEMPORAL_M5_DB_PATCH: orden de compra de servicios mínima CU88-CU90'; |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU88 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/008_m5_ocs_condicion_pago/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu85-cu90.test.cjs; Controladores/pruebas/m7-ventas-familia-navegacion.test.cjs; Controladores/pruebas/rf-vigente.test.cjs; Vistas/src/views/verificacionAccionesFinal.test.tsx |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU76, CU77, CU78, CU79, CU80, CU81, CU82, CU83, CU84, CU85, CU86, CU87, CU89, CU90, CU91, CU92, CU93, CU94 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/008_m5_ocs_condicion_pago/migration.sql`
- `Controladores/pruebas/m5-cu85-cu90.test.cjs`
- `Controladores/pruebas/m7-ventas-familia-navegacion.test.cjs`
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/verificacionAccionesFinal.test.tsx`
### Evidencia textual
- `'TEMPORAL_M5_DB_PATCH: orden de compra de servicios mínima CU88-CU90';`
- `<Route path="ordenes-compra-servicios" element={<Protegido permiso="CU88"><OrdenesCompraServicios /></Protegido>} />`
- `<Route path="ordenes-compra-servicios/:id" element={<Protegido permiso="CU88"><OrdenesCompraServicios /></Protegido>} />`
- `CU76:['CU80'],CU77:['CU80'],CU78:['CU80'],CU79:['CU80'],CU81:['CU80'],CU82:['CU80'],CU83:['CU80'],CU84:['CU80'],CU85:['CU84'],CU86:['CU80'],CU87:['CU84'],CU89:['CU88'],CU90:['CU88'],CU91:['CU88'],CU92:['CU88'],CU93:['CU88'],CU94:['CU88'],`
## CU89
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU76:['CU80'],CU77:['CU80'],CU78:['CU80'],CU79:['CU80'],CU81:['CU80'],CU82:['CU80'],CU83:['CU80'],CU84:['CU80'],CU85:['CU84'],CU86:['CU80'],CU87:['CU84'],CU89:['CU88'],CU90:['CU88'],CU91:['CU88'],CU92:['CU88'],CU93:['CU88'],CU94:['CU88'], |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU89 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/OrdenesCompraServicios/OrdenesCompraServicios.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu85-cu90.test.cjs; Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU76, CU77, CU78, CU79, CU80, CU81, CU82, CU83, CU84, CU85, CU86, CU87, CU88, CU90, CU91, CU92, CU93, CU94 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu85-cu90.test.cjs`
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/OrdenesCompraServicios/OrdenesCompraServicios.tsx`
### Evidencia textual
- `CU76:['CU80'],CU77:['CU80'],CU78:['CU80'],CU79:['CU80'],CU81:['CU80'],CU82:['CU80'],CU83:['CU80'],CU84:['CU80'],CU85:['CU84'],CU86:['CU80'],CU87:['CU84'],CU89:['CU88'],CU90:['CU88'],CU91:['CU88'],CU92:['CU88'],CU93:['CU88'],CU94:['CU88'],`
- `CU85:GSC,CU86:GSC,CU87:GC,CU88:GSC,CU89:GS,CU90:GS,`
- `actualizarCondicionPagoProveedor:'CU87', listarOrdenesCompraServicios:'CU88', obtenerOrdenCompraServicio:'CU88', crearOrdenCompraServicio:'CU89', modificarOrdenCompraServicio:'CU90',`
- `assert.equal(operacionesPermiso.crearOrdenCompraServicio, 'CU89');`
## CU90
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'TEMPORAL_M5_DB_PATCH: orden de compra de servicios mínima CU88-CU90'; |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU90 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/OrdenesCompraServicios/OrdenesCompraServicios.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M5Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/008_m5_ocs_condicion_pago/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu85-cu90.test.cjs; Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU76, CU77, CU78, CU79, CU80, CU81, CU82, CU83, CU84, CU85, CU86, CU87, CU88, CU89, CU91, CU92, CU93, CU94 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/008_m5_ocs_condicion_pago/migration.sql`
- `Controladores/pruebas/m5-cu85-cu90.test.cjs`
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/controladores/M5Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/OrdenesCompraServicios/OrdenesCompraServicios.tsx`
### Evidencia textual
- `'TEMPORAL_M5_DB_PATCH: orden de compra de servicios mínima CU88-CU90';`
- `-- Soporte mínimo para CU87-CU90. Debe reconciliarse con el patch definitivo del equipo de BD.`
- `CU76:['CU80'],CU77:['CU80'],CU78:['CU80'],CU79:['CU80'],CU81:['CU80'],CU82:['CU80'],CU83:['CU80'],CU84:['CU80'],CU85:['CU84'],CU86:['CU80'],CU87:['CU84'],CU89:['CU88'],CU90:['CU88'],CU91:['CU88'],CU92:['CU88'],CU93:['CU88'],CU94:['CU88'],`
- `CU85:GSC,CU86:GSC,CU87:GC,CU88:GSC,CU89:GS,CU90:GS,`
## CU91
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'TEMPORAL_M5_DB_PATCH: monto inicial inmutable para trazabilidad CU91'; |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU91 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/OrdenesCompraServicios/OrdenesCompraServicios.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M5Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/009_m5_ajustes_ciclo_ocs/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu91-cu95.test.cjs; Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU76, CU77, CU78, CU79, CU80, CU81, CU82, CU83, CU84, CU85, CU86, CU87, CU88, CU89, CU90, CU92, CU93, CU94 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/009_m5_ajustes_ciclo_ocs/migration.sql`
- `Controladores/pruebas/m5-cu91-cu95.test.cjs`
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/controladores/M5Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/OrdenesCompraServicios/OrdenesCompraServicios.tsx`
### Evidencia textual
- `'TEMPORAL_M5_DB_PATCH: monto inicial inmutable para trazabilidad CU91';`
- `'TEMPORAL_M5_DB_PATCH: preparación y confirmación acotada de ajustes OCS CU91';`
- `-- Soporte mínimo para CU91-CU94. No registra documentos, obligaciones ni aprobaciones de excedentes.`
- `CU76:['CU80'],CU77:['CU80'],CU78:['CU80'],CU79:['CU80'],CU81:['CU80'],CU82:['CU80'],CU83:['CU80'],CU84:['CU80'],CU85:['CU84'],CU86:['CU80'],CU87:['CU84'],CU89:['CU88'],CU90:['CU88'],CU91:['CU88'],CU92:['CU88'],CU93:['CU88'],CU94:['CU88'],`
## CU92
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU76:['CU80'],CU77:['CU80'],CU78:['CU80'],CU79:['CU80'],CU81:['CU80'],CU82:['CU80'],CU83:['CU80'],CU84:['CU80'],CU85:['CU84'],CU86:['CU80'],CU87:['CU84'],CU89:['CU88'],CU90:['CU88'],CU91:['CU88'],CU92:['CU88'],CU93:['CU88'],CU94:['CU88'], |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU92 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/OrdenesCompraServicios/OrdenesCompraServicios.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu91-cu95.test.cjs; Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU76, CU77, CU78, CU79, CU80, CU81, CU82, CU83, CU84, CU85, CU86, CU87, CU88, CU89, CU90, CU91, CU93, CU94, CU95 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu91-cu95.test.cjs`
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/OrdenesCompraServicios/OrdenesCompraServicios.tsx`
### Evidencia textual
- `CU76:['CU80'],CU77:['CU80'],CU78:['CU80'],CU79:['CU80'],CU81:['CU80'],CU82:['CU80'],CU83:['CU80'],CU84:['CU80'],CU85:['CU84'],CU86:['CU80'],CU87:['CU84'],CU89:['CU88'],CU90:['CU88'],CU91:['CU88'],CU92:['CU88'],CU93:['CU88'],CU94:['CU88'],`
- `CU91:GS,CU92:GS,CU93:GSC,CU94:G,CU95:GSC,`
- `assert.deepEqual(actores('CU92'), ['gerencia', 'secretaria']);`
- `const proveedor = await crearProveedor('Anulación OCS CU92');`
## CU93
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU76:['CU80'],CU77:['CU80'],CU78:['CU80'],CU79:['CU80'],CU81:['CU80'],CU82:['CU80'],CU83:['CU80'],CU84:['CU80'],CU85:['CU84'],CU86:['CU80'],CU87:['CU84'],CU89:['CU88'],CU90:['CU88'],CU91:['CU88'],CU92:['CU88'],CU93:['CU88'],CU94:['CU88'], |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU93 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/OrdenesCompraServicios/OrdenesCompraServicios.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu91-cu95.test.cjs; Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU76, CU77, CU78, CU79, CU80, CU81, CU82, CU83, CU84, CU85, CU86, CU87, CU88, CU89, CU90, CU91, CU92, CU94, CU95 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu91-cu95.test.cjs`
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/OrdenesCompraServicios/OrdenesCompraServicios.tsx`
### Evidencia textual
- `CU76:['CU80'],CU77:['CU80'],CU78:['CU80'],CU79:['CU80'],CU81:['CU80'],CU82:['CU80'],CU83:['CU80'],CU84:['CU80'],CU85:['CU84'],CU86:['CU80'],CU87:['CU84'],CU89:['CU88'],CU90:['CU88'],CU91:['CU88'],CU92:['CU88'],CU93:['CU88'],CU94:['CU88'],`
- `CU91:GS,CU92:GS,CU93:GSC,CU94:G,CU95:GSC,`
- `assert.deepEqual(actores('CU93'), ['contador', 'gerencia', 'secretaria']);`
- `const proveedor = await crearProveedor('Cierre OCS CU93');`
## CU94
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | -- Soporte mínimo para CU91-CU94. No registra documentos, obligaciones ni aprobaciones de excedentes. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU94 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/OrdenesCompraServicios/OrdenesCompraServicios.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/009_m5_ajustes_ciclo_ocs/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu91-cu95.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU76, CU77, CU78, CU79, CU80, CU81, CU82, CU83, CU84, CU85, CU86, CU87, CU88, CU89, CU90, CU91, CU92, CU93, CU95 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/009_m5_ajustes_ciclo_ocs/migration.sql`
- `Controladores/pruebas/m5-cu91-cu95.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/OrdenesCompraServicios/OrdenesCompraServicios.tsx`
### Evidencia textual
- `-- Soporte mínimo para CU91-CU94. No registra documentos, obligaciones ni aprobaciones de excedentes.`
- `CU76:['CU80'],CU77:['CU80'],CU78:['CU80'],CU79:['CU80'],CU81:['CU80'],CU82:['CU80'],CU83:['CU80'],CU84:['CU80'],CU85:['CU84'],CU86:['CU80'],CU87:['CU84'],CU89:['CU88'],CU90:['CU88'],CU91:['CU88'],CU92:['CU88'],CU93:['CU88'],CU94:['CU88'],`
- `CU91:GS,CU92:GS,CU93:GSC,CU94:G,CU95:GSC,`
- `assert.deepEqual(actores('CU94'), ['gerencia']);`
## CU95
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="documentos-proveedor" element={<Protegido permiso="CU95"><DocumentosProveedor /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU95 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu91-cu95.test.cjs; Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU91, CU92, CU93, CU94, CU106, CU123, CU127, CU128, CU129, CU130, CU131 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu91-cu95.test.cjs`
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
### Evidencia textual
- `<Route path="documentos-proveedor" element={<Protegido permiso="CU95"><DocumentosProveedor /></Protegido>} />`
- `CU127:['CU123'],CU128:['CU106'],CU129:['CU106'],CU130:['CU95'],CU131:['CU106'],`
- `CU91:GS,CU92:GS,CU93:GSC,CU94:G,CU95:GSC,`
- `assert.deepEqual(actores('CU95'), ['contador', 'gerencia', 'secretaria']);`
## CU96
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | -- Persistencia provisional mínima CU96-CU105. Legacy permanece sin reinterpretación. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU96 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/010_m5_documentos_obligaciones/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu96-cu105.test.cjs; Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU97, CU98, CU99, CU100, CU101, CU102, CU103, CU104, CU105 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/010_m5_documentos_obligaciones/migration.sql`
- `Controladores/pruebas/m5-cu96-cu105.test.cjs`
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx`
### Evidencia textual
- `-- Persistencia provisional mínima CU96-CU105. Legacy permanece sin reinterpretación.`
- `COMMENT ON TABLE finanzas.documento_proveedor_m5 IS 'TEMPORAL_M5_DB_PATCH: documentos CU96-CU105 aislados de Legacy';`
- `CU96:GS,CU97:GSC,CU98:GSC,CU99:GSC,CU100:GC,CU101:GSC,CU102:GSC,CU103:GSC,CU104:GC,CU105:GSC,`
## CU97
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'TEMPORAL_M5_DB_PATCH: marcador de efectos para integrar documentos y obligaciones desde CU97+'; |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU97 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/009_m5_ajustes_ciclo_ocs/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu96-cu105.test.cjs; Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU96, CU98, CU99, CU100, CU101, CU102, CU103, CU104, CU105 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/009_m5_ajustes_ciclo_ocs/migration.sql`
- `Controladores/pruebas/m5-cu96-cu105.test.cjs`
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx`
### Evidencia textual
- `'TEMPORAL_M5_DB_PATCH: marcador de efectos para integrar documentos y obligaciones desde CU97+';`
- `CU96:GS,CU97:GSC,CU98:GSC,CU99:GSC,CU100:GC,CU101:GSC,CU102:GSC,CU103:GSC,CU104:GC,CU105:GSC,`
## CU98
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU96:GS,CU97:GSC,CU98:GSC,CU99:GSC,CU100:GC,CU101:GSC,CU102:GSC,CU103:GSC,CU104:GC,CU105:GSC, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU98 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu96-cu105.test.cjs; Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU96, CU97, CU99, CU100, CU101, CU102, CU103, CU104, CU105 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu96-cu105.test.cjs`
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx`
### Evidencia textual
- `CU96:GS,CU97:GSC,CU98:GSC,CU99:GSC,CU100:GC,CU101:GSC,CU102:GSC,CU103:GSC,CU104:GC,CU105:GSC,`
## CU99
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | // TEMPORAL_M5_DB_PATCH: CU99/CU100 conectarán aquí la aprobación real del excedente. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU99 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M5Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu127-cu131.test.cjs; Controladores/pruebas/m5-cu96-cu105.test.cjs; Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU96, CU97, CU98, CU100, CU101, CU102, CU103, CU104, CU105, CU129 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu127-cu131.test.cjs`
- `Controladores/pruebas/m5-cu96-cu105.test.cjs`
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/controladores/M5Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx`
### Evidencia textual
- `// TEMPORAL_M5_DB_PATCH: CU99/CU100 conectarán aquí la aprobación real del excedente.`
- `CU96:GS,CU97:GSC,CU98:GSC,CU99:GSC,CU100:GC,CU101:GSC,CU102:GSC,CU103:GSC,CU104:GC,CU105:GSC,`
- `await t.test('CU129 reutiliza CU99-CU100 y no aplica un excedente OCS pendiente', async () => {`
## CU100
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | // TEMPORAL_M5_DB_PATCH: CU99/CU100 conectarán aquí la aprobación real del excedente. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU100 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M5Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu127-cu131.test.cjs; Controladores/pruebas/m5-cu96-cu105.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU96, CU97, CU98, CU99, CU101, CU102, CU103, CU104, CU105, CU129 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu127-cu131.test.cjs`
- `Controladores/pruebas/m5-cu96-cu105.test.cjs`
- `Controladores/src/controladores/M5Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx`
### Evidencia textual
- `// TEMPORAL_M5_DB_PATCH: CU99/CU100 conectarán aquí la aprobación real del excedente.`
- `CU96:GS,CU97:GSC,CU98:GSC,CU99:GSC,CU100:GC,CU101:GSC,CU102:GSC,CU103:GSC,CU104:GC,CU105:GSC,`
- `await t.test('CU129 reutiliza CU99-CU100 y no aplica un excedente OCS pendiente', async () => {`
## CU101
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU96:GS,CU97:GSC,CU98:GSC,CU99:GSC,CU100:GC,CU101:GSC,CU102:GSC,CU103:GSC,CU104:GC,CU105:GSC, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU101 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu96-cu105.test.cjs; Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU96, CU97, CU98, CU99, CU100, CU102, CU103, CU104, CU105 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu96-cu105.test.cjs`
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx`
### Evidencia textual
- `CU96:GS,CU97:GSC,CU98:GSC,CU99:GSC,CU100:GC,CU101:GSC,CU102:GSC,CU103:GSC,CU104:GC,CU105:GSC,`
## CU102
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU132:['CU131'],CU133:['CU132'],CU134:['CU102'],CU135:['CU102'],CU136:['CU135'],CU137:['CU134'], |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU102 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu96-cu105.test.cjs; Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU96, CU97, CU98, CU99, CU100, CU101, CU103, CU104, CU105, CU131, CU132, CU133, CU134, CU135, CU136, CU137 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu96-cu105.test.cjs`
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx`
### Evidencia textual
- `CU132:['CU131'],CU133:['CU132'],CU134:['CU102'],CU135:['CU102'],CU136:['CU135'],CU137:['CU134'],`
- `CU96:GS,CU97:GSC,CU98:GSC,CU99:GSC,CU100:GC,CU101:GSC,CU102:GSC,CU103:GSC,CU104:GC,CU105:GSC,`
## CU103
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU96:GS,CU97:GSC,CU98:GSC,CU99:GSC,CU100:GC,CU101:GSC,CU102:GSC,CU103:GSC,CU104:GC,CU105:GSC, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU103 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu96-cu105.test.cjs; Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU96, CU97, CU98, CU99, CU100, CU101, CU102, CU104, CU105 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu96-cu105.test.cjs`
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx`
### Evidencia textual
- `CU96:GS,CU97:GSC,CU98:GSC,CU99:GSC,CU100:GC,CU101:GSC,CU102:GSC,CU103:GSC,CU104:GC,CU105:GSC,`
## CU104
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU96:GS,CU97:GSC,CU98:GSC,CU99:GSC,CU100:GC,CU101:GSC,CU102:GSC,CU103:GSC,CU104:GC,CU105:GSC, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU104 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M5Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu96-cu105.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU96, CU97, CU98, CU99, CU100, CU101, CU102, CU103, CU105 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu96-cu105.test.cjs`
- `Controladores/src/controladores/M5Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx`
### Evidencia textual
- `CU96:GS,CU97:GSC,CU98:GSC,CU99:GSC,CU100:GC,CU101:GSC,CU102:GSC,CU103:GSC,CU104:GC,CU105:GSC,`
- `} catch { /* Se conserva en preparación hasta CU104. */ }`
## CU105
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | -- Persistencia provisional mínima CU96-CU105. Legacy permanece sin reinterpretación. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU105 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/010_m5_documentos_obligaciones/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu96-cu105.test.cjs; Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU96, CU97, CU98, CU99, CU100, CU101, CU102, CU103, CU104 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/010_m5_documentos_obligaciones/migration.sql`
- `Controladores/pruebas/m5-cu96-cu105.test.cjs`
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx`
### Evidencia textual
- `-- Persistencia provisional mínima CU96-CU105. Legacy permanece sin reinterpretación.`
- `COMMENT ON TABLE finanzas.documento_proveedor_m5 IS 'TEMPORAL_M5_DB_PATCH: documentos CU96-CU105 aislados de Legacy';`
- `COMMENT ON TABLE finanzas.obligacion_proveedor_m5 IS 'TEMPORAL_M5_DB_PATCH: obligación única provisional CU105';`
- `CU96:GS,CU97:GSC,CU98:GSC,CU99:GSC,CU100:GC,CU101:GSC,CU102:GSC,CU103:GSC,CU104:GC,CU105:GSC,`
## CU106
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU106', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU106 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/Mantenedores/Mantenedores.tsx; Vistas/src/views/Mantenedores/permisos.ts |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/011_m5_cuentas_por_pagar/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu106-cu110.test.cjs; Controladores/pruebas/m7-cierre-hallazgos.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU107, CU108, CU109, CU110 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/011_m5_cuentas_por_pagar/migration.sql`
- `Controladores/pruebas/m5-cu106-cu110.test.cjs`
- `Controladores/pruebas/m7-cierre-hallazgos.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/Mantenedores/Mantenedores.tsx`
- `Vistas/src/views/Mantenedores/permisos.ts`
### Evidencia textual
- `'CU106',`
- `-- Configuración independiente de clientes para CU106-CU110.`
- `<Route path="cuentas-por-pagar" element={<Protegido permiso="CU106"><CuentasPorPagar /></Protegido>} />`
- `CU106:GSC,CU107:GSC,CU108:GSC,CU109:GSC,CU110:G,`
## CU107
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU106:GSC,CU107:GSC,CU108:GSC,CU109:GSC,CU110:G, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU107 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | Controladores/src/controladores/C_Finanzas.ts |
| 13. Controlador | Controladores/src/controladores/C_Finanzas.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu106-cu110.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU106, CU108, CU109, CU110 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu106-cu110.test.cjs`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/validaciones/permisos.ts`
### Evidencia textual
- `CU106:GSC,CU107:GSC,CU108:GSC,CU109:GSC,CU110:G,`
- `CU107:['CU106'],CU108:['CU106'],CU109:['CU106'],CU110:['CU106'],`
- `if(solicitud.consulta?.estadoTemporal && String(solicitud.consulta.estadoTemporal).toLowerCase()!=='todos') adicionales.push('CU107');`
## CU108
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU106:GSC,CU107:GSC,CU108:GSC,CU109:GSC,CU110:G, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU108 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | Controladores/src/controladores/C_Finanzas.ts |
| 13. Controlador | Controladores/src/controladores/C_Finanzas.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu106-cu110.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU106, CU107, CU109, CU110 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu106-cu110.test.cjs`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/validaciones/permisos.ts`
### Evidencia textual
- `CU106:GSC,CU107:GSC,CU108:GSC,CU109:GSC,CU110:G,`
- `CU107:['CU106'],CU108:['CU106'],CU109:['CU106'],CU110:['CU106'],`
- `if(solicitud.consulta?.estadoPago && String(solicitud.consulta.estadoPago).toLowerCase()!=='todos') adicionales.push('CU108');`
## CU109
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU106:GSC,CU107:GSC,CU108:GSC,CU109:GSC,CU110:G, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU109 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | Controladores/src/controladores/C_Finanzas.ts |
| 13. Controlador | Controladores/src/controladores/C_Finanzas.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu106-cu110.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU106, CU107, CU108, CU110 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu106-cu110.test.cjs`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/validaciones/permisos.ts`
### Evidencia textual
- `CU106:GSC,CU107:GSC,CU108:GSC,CU109:GSC,CU110:G,`
- `CU107:['CU106'],CU108:['CU106'],CU109:['CU106'],CU110:['CU106'],`
- `if(solicitud.consulta?.proveedor || solicitud.consulta?.busqueda || solicitud.consulta?.ordenar || solicitud.consulta?.direccion) adicionales.push('CU109');`
## CU110
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU110', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU110 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/CuentasPorPagar/CuentasPorPagar.tsx; Vistas/src/views/Mantenedores/permisos.ts |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/011_m5_cuentas_por_pagar/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu106-cu110.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU59, CU60, CU61, CU62, CU63, CU64, CU65, CU66, CU71, CU72, CU74, CU106, CU107, CU108, CU109, CU137, CU150 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/011_m5_cuentas_por_pagar/migration.sql`
- `Controladores/pruebas/m5-cu106-cu110.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/CuentasPorPagar/CuentasPorPagar.tsx`
- `Vistas/src/views/Mantenedores/permisos.ts`
### Evidencia textual
- `'CU110',`
- `'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150',`
- `-- Configuración independiente de clientes para CU106-CU110.`
- `CU106:GSC,CU107:GSC,CU108:GSC,CU109:GSC,CU110:G,`
## CU111
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | -- Persistencia M5 separada de pago_proveedor Legacy para CU111-CU120. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU111 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/012_m5_pagos_proveedores/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu111-cu120.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU106, CU112, CU113, CU114, CU115, CU116, CU117, CU118, CU119, CU120 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/012_m5_pagos_proveedores/migration.sql`
- `Controladores/pruebas/m5-cu111-cu120.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
### Evidencia textual
- `-- Persistencia M5 separada de pago_proveedor Legacy para CU111-CU120.`
- `<Route path="pagos-proveedores" element={<Protegido permiso="CU111"><PagosProveedores /></Protegido>} />`
- `CU111:GSC,CU112:GSC,CU113:GSC,CU114:GSC,CU115:GC,CU116:GSC,CU117:GSC,CU118:GSC,CU119:GSC,CU120:GC,`
- `CU111:['CU106'],CU112:['CU111'],CU113:['CU112'],CU114:['CU112'],CU115:['CU112'],CU116:['CU112','CU113','CU114'],CU117:['CU111'],CU118:['CU117'],CU119:['CU117'],CU120:['CU116'],`
## CU112
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU111:GSC,CU112:GSC,CU113:GSC,CU114:GSC,CU115:GC,CU116:GSC,CU117:GSC,CU118:GSC,CU119:GSC,CU120:GC, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU112 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu111-cu120.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU106, CU111, CU113, CU114, CU115, CU116, CU117, CU118, CU119, CU120 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu111-cu120.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
### Evidencia textual
- `CU111:GSC,CU112:GSC,CU113:GSC,CU114:GSC,CU115:GC,CU116:GSC,CU117:GSC,CU118:GSC,CU119:GSC,CU120:GC,`
- `CU111:['CU106'],CU112:['CU111'],CU113:['CU112'],CU114:['CU112'],CU115:['CU112'],CU116:['CU112','CU113','CU114'],CU117:['CU111'],CU118:['CU117'],CU119:['CU117'],CU120:['CU116'],`
## CU113
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU111:GSC,CU112:GSC,CU113:GSC,CU114:GSC,CU115:GC,CU116:GSC,CU117:GSC,CU118:GSC,CU119:GSC,CU120:GC, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU113 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu111-cu120.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU106, CU111, CU112, CU114, CU115, CU116, CU117, CU118, CU119, CU120 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu111-cu120.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
### Evidencia textual
- `CU111:GSC,CU112:GSC,CU113:GSC,CU114:GSC,CU115:GC,CU116:GSC,CU117:GSC,CU118:GSC,CU119:GSC,CU120:GC,`
- `CU111:['CU106'],CU112:['CU111'],CU113:['CU112'],CU114:['CU112'],CU115:['CU112'],CU116:['CU112','CU113','CU114'],CU117:['CU111'],CU118:['CU117'],CU119:['CU117'],CU120:['CU116'],`
## CU114
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU111:GSC,CU112:GSC,CU113:GSC,CU114:GSC,CU115:GC,CU116:GSC,CU117:GSC,CU118:GSC,CU119:GSC,CU120:GC, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU114 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu111-cu120.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU106, CU111, CU112, CU113, CU115, CU116, CU117, CU118, CU119, CU120 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu111-cu120.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
### Evidencia textual
- `CU111:GSC,CU112:GSC,CU113:GSC,CU114:GSC,CU115:GC,CU116:GSC,CU117:GSC,CU118:GSC,CU119:GSC,CU120:GC,`
- `CU111:['CU106'],CU112:['CU111'],CU113:['CU112'],CU114:['CU112'],CU115:['CU112'],CU116:['CU112','CU113','CU114'],CU117:['CU111'],CU118:['CU117'],CU119:['CU117'],CU120:['CU116'],`
## CU115
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU111:GSC,CU112:GSC,CU113:GSC,CU114:GSC,CU115:GC,CU116:GSC,CU117:GSC,CU118:GSC,CU119:GSC,CU120:GC, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU115 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/PagosProveedores/PagosProveedores.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu111-cu120.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU106, CU111, CU112, CU113, CU114, CU116, CU117, CU118, CU119, CU120 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu111-cu120.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/PagosProveedores/PagosProveedores.tsx`
### Evidencia textual
- `CU111:GSC,CU112:GSC,CU113:GSC,CU114:GSC,CU115:GC,CU116:GSC,CU117:GSC,CU118:GSC,CU119:GSC,CU120:GC,`
- `CU111:['CU106'],CU112:['CU111'],CU113:['CU112'],CU114:['CU112'],CU115:['CU112'],CU116:['CU112','CU113','CU114'],CU117:['CU111'],CU118:['CU117'],CU119:['CU117'],CU120:['CU116'],`
## CU116
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU111:GSC,CU112:GSC,CU113:GSC,CU114:GSC,CU115:GC,CU116:GSC,CU117:GSC,CU118:GSC,CU119:GSC,CU120:GC, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU116 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu111-cu120.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU106, CU111, CU112, CU113, CU114, CU115, CU117, CU118, CU119, CU120 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu111-cu120.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
### Evidencia textual
- `CU111:GSC,CU112:GSC,CU113:GSC,CU114:GSC,CU115:GC,CU116:GSC,CU117:GSC,CU118:GSC,CU119:GSC,CU120:GC,`
- `CU111:['CU106'],CU112:['CU111'],CU113:['CU112'],CU114:['CU112'],CU115:['CU112'],CU116:['CU112','CU113','CU114'],CU117:['CU111'],CU118:['CU117'],CU119:['CU117'],CU120:['CU116'],`
## CU117
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU111:GSC,CU112:GSC,CU113:GSC,CU114:GSC,CU115:GC,CU116:GSC,CU117:GSC,CU118:GSC,CU119:GSC,CU120:GC, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU117 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu111-cu120.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU106, CU111, CU112, CU113, CU114, CU115, CU116, CU118, CU119, CU120 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu111-cu120.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
### Evidencia textual
- `CU111:GSC,CU112:GSC,CU113:GSC,CU114:GSC,CU115:GC,CU116:GSC,CU117:GSC,CU118:GSC,CU119:GSC,CU120:GC,`
- `CU111:['CU106'],CU112:['CU111'],CU113:['CU112'],CU114:['CU112'],CU115:['CU112'],CU116:['CU112','CU113','CU114'],CU117:['CU111'],CU118:['CU117'],CU119:['CU117'],CU120:['CU116'],`
## CU118
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU111:GSC,CU112:GSC,CU113:GSC,CU114:GSC,CU115:GC,CU116:GSC,CU117:GSC,CU118:GSC,CU119:GSC,CU120:GC, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU118 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu111-cu120.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU106, CU111, CU112, CU113, CU114, CU115, CU116, CU117, CU119, CU120, CU121, CU122, CU123, CU124, CU125, CU126 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu111-cu120.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
### Evidencia textual
- `CU111:GSC,CU112:GSC,CU113:GSC,CU114:GSC,CU115:GC,CU116:GSC,CU117:GSC,CU118:GSC,CU119:GSC,CU120:GC,`
- `CU111:['CU106'],CU112:['CU111'],CU113:['CU112'],CU114:['CU112'],CU115:['CU112'],CU116:['CU112','CU113','CU114'],CU117:['CU111'],CU118:['CU117'],CU119:['CU117'],CU120:['CU116'],`
- `CU121:['CU120'],CU122:['CU121'],CU123:['CU118'],CU124:['CU123'],CU125:['CU123'],CU126:['CU123'],`
## CU119
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU111:GSC,CU112:GSC,CU113:GSC,CU114:GSC,CU115:GC,CU116:GSC,CU117:GSC,CU118:GSC,CU119:GSC,CU120:GC, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU119 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu111-cu120.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU106, CU111, CU112, CU113, CU114, CU115, CU116, CU117, CU118, CU120 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu111-cu120.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
### Evidencia textual
- `CU111:GSC,CU112:GSC,CU113:GSC,CU114:GSC,CU115:GC,CU116:GSC,CU117:GSC,CU118:GSC,CU119:GSC,CU120:GC,`
- `CU111:['CU106'],CU112:['CU111'],CU113:['CU112'],CU114:['CU112'],CU115:['CU112'],CU116:['CU112','CU113','CU114'],CU117:['CU111'],CU118:['CU117'],CU119:['CU117'],CU120:['CU116'],`
## CU120
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | -- Persistencia M5 separada de pago_proveedor Legacy para CU111-CU120. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU120 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/PagosProveedores/PagosProveedores.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/012_m5_pagos_proveedores/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu111-cu120.test.cjs; Controladores/pruebas/m5-cu121-cu126.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU106, CU111, CU112, CU113, CU114, CU115, CU116, CU117, CU118, CU119, CU121, CU122, CU123, CU124, CU125, CU126 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/012_m5_pagos_proveedores/migration.sql`
- `Controladores/pruebas/m5-cu111-cu120.test.cjs`
- `Controladores/pruebas/m5-cu121-cu126.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/PagosProveedores/PagosProveedores.tsx`
### Evidencia textual
- `-- Persistencia M5 separada de pago_proveedor Legacy para CU111-CU120.`
- `CU111:GSC,CU112:GSC,CU113:GSC,CU114:GSC,CU115:GC,CU116:GSC,CU117:GSC,CU118:GSC,CU119:GSC,CU120:GC,`
- `CU111:['CU106'],CU112:['CU111'],CU113:['CU112'],CU114:['CU112'],CU115:['CU112'],CU116:['CU112','CU113','CU114'],CU117:['CU111'],CU118:['CU117'],CU119:['CU117'],CU120:['CU116'],`
- `CU121:['CU120'],CU122:['CU121'],CU123:['CU118'],CU124:['CU123'],CU125:['CU123'],CU126:['CU123'],`
## CU121
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | -- Efectos postpago y control bancario para CU121-CU126. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU121 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M5Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/013_m5_postpagos_proveedores/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu121-cu126.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU118, CU120, CU122, CU123, CU124, CU125, CU126 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/013_m5_postpagos_proveedores/migration.sql`
- `Controladores/pruebas/m5-cu121-cu126.test.cjs`
- `Controladores/src/controladores/M5Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
### Evidencia textual
- `-- Efectos postpago y control bancario para CU121-CU126.`
- `/** Única fórmula de CU121: saldo inicial menos efectos netos confirmados. */`
- `CU121:['CU120'],CU122:['CU121'],CU123:['CU118'],CU124:['CU123'],CU125:['CU123'],CU126:['CU123'],`
- `CU121:[],CU122:[],CU123:GSC,CU124:GC,CU125:GC,CU126:GC,`
## CU122
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU121:['CU120'],CU122:['CU121'],CU123:['CU118'],CU124:['CU123'],CU125:['CU123'],CU126:['CU123'], |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU122 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu121-cu126.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU118, CU120, CU121, CU123, CU124, CU125, CU126 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu121-cu126.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
### Evidencia textual
- `CU121:['CU120'],CU122:['CU121'],CU123:['CU118'],CU124:['CU123'],CU125:['CU123'],CU126:['CU123'],`
- `CU121:[],CU122:[],CU123:GSC,CU124:GC,CU125:GC,CU126:GC,`
## CU123
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU121:['CU120'],CU122:['CU121'],CU123:['CU118'],CU124:['CU123'],CU125:['CU123'],CU126:['CU123'], |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU123 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/PagosProveedores/PagosProveedores.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu121-cu126.test.cjs; Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU95, CU106, CU118, CU120, CU121, CU122, CU124, CU125, CU126, CU127, CU128, CU129, CU130, CU131 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu121-cu126.test.cjs`
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/PagosProveedores/PagosProveedores.tsx`
### Evidencia textual
- `CU121:['CU120'],CU122:['CU121'],CU123:['CU118'],CU124:['CU123'],CU125:['CU123'],CU126:['CU123'],`
- `CU121:[],CU122:[],CU123:GSC,CU124:GC,CU125:GC,CU126:GC,`
- `CU127:['CU123'],CU128:['CU106'],CU129:['CU106'],CU130:['CU95'],CU131:['CU106'],`
- `const cargarConfirmados=()=>puede('CU123')?api('/pagos-proveedores/confirmados').then(setConfirmados).catch(e=>setError(e.message)):Promise.resolve();`
## CU124
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | COMMENT ON TABLE finanzas.anulacion_movimiento_pago_m5 IS 'TEMPORAL_M5_DB_PATCH: CU124 conserva el pago original y registra que no ocurrió'; |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU124 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/PagosProveedores/PagosProveedores.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/013_m5_postpagos_proveedores/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu121-cu126.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU118, CU120, CU121, CU122, CU123, CU125, CU126 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/013_m5_postpagos_proveedores/migration.sql`
- `Controladores/pruebas/m5-cu121-cu126.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/PagosProveedores/PagosProveedores.tsx`
### Evidencia textual
- `COMMENT ON TABLE finanzas.anulacion_movimiento_pago_m5 IS 'TEMPORAL_M5_DB_PATCH: CU124 conserva el pago original y registra que no ocurrió';`
- `CU121:['CU120'],CU122:['CU121'],CU123:['CU118'],CU124:['CU123'],CU125:['CU123'],CU126:['CU123'],`
- `CU121:[],CU122:[],CU123:GSC,CU124:GC,CU125:GC,CU126:GC,`
- `listarPagosConfirmados:'CU123', consultarDetallePagoProveedor:'CU123', anularMovimientoPago:'CU124', anularOperacionPago:'CU124', revertirMovimientoPago:'CU125', conciliarMovimientoPago:'CU126',`
## CU125
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | COMMENT ON TABLE finanzas.reversion_movimiento_pago_m5 IS 'TEMPORAL_M5_DB_PATCH: CU125 registra devoluciones posteriores del proveedor'; |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU125 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/PagosProveedores/PagosProveedores.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/013_m5_postpagos_proveedores/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu121-cu126.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU118, CU120, CU121, CU122, CU123, CU124, CU126 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/013_m5_postpagos_proveedores/migration.sql`
- `Controladores/pruebas/m5-cu121-cu126.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/PagosProveedores/PagosProveedores.tsx`
### Evidencia textual
- `COMMENT ON TABLE finanzas.reversion_movimiento_pago_m5 IS 'TEMPORAL_M5_DB_PATCH: CU125 registra devoluciones posteriores del proveedor';`
- `CU121:['CU120'],CU122:['CU121'],CU123:['CU118'],CU124:['CU123'],CU125:['CU123'],CU126:['CU123'],`
- `CU121:[],CU122:[],CU123:GSC,CU124:GC,CU125:GC,CU126:GC,`
- `listarPagosConfirmados:'CU123', consultarDetallePagoProveedor:'CU123', anularMovimientoPago:'CU124', anularOperacionPago:'CU124', revertirMovimientoPago:'CU125', conciliarMovimientoPago:'CU126',`
## CU126
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | -- Efectos postpago y control bancario para CU121-CU126. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU126 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/PagosProveedores/PagosProveedores.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/013_m5_postpagos_proveedores/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu121-cu126.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU118, CU120, CU121, CU122, CU123, CU124, CU125 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/013_m5_postpagos_proveedores/migration.sql`
- `Controladores/pruebas/m5-cu121-cu126.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/PagosProveedores/PagosProveedores.tsx`
### Evidencia textual
- `-- Efectos postpago y control bancario para CU121-CU126.`
- `COMMENT ON TABLE finanzas.conciliacion_movimiento_pago_m5 IS 'TEMPORAL_M5_DB_PATCH: CU126 control bancario sin efecto financiero';`
- `CU121:['CU120'],CU122:['CU121'],CU123:['CU118'],CU124:['CU123'],CU125:['CU123'],CU126:['CU123'],`
- `CU121:[],CU122:[],CU123:GSC,CU124:GC,CU125:GC,CU126:GC,`
## CU127
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | -- Ajustes documentales, saldos a favor e historial de evidencia para CU127-CU131. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU127 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/PagosProveedores/PagosProveedores.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/014_m5_ajustes_saldos_favor/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu127-cu131.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU95, CU106, CU123, CU128, CU129, CU130, CU131 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/014_m5_ajustes_saldos_favor/migration.sql`
- `Controladores/pruebas/m5-cu127-cu131.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/PagosProveedores/PagosProveedores.tsx`
### Evidencia textual
- `-- Ajustes documentales, saldos a favor e historial de evidencia para CU127-CU131.`
- `CU127:GC,CU128:GSC,CU129:GSC,CU130:GC,CU131:GSC,`
- `CU127:['CU123'],CU128:['CU106'],CU129:['CU106'],CU130:['CU95'],CU131:['CU106'],`
- `await t.test('CU127 conserva respaldo histórico y registra motivo, actor y fecha', async () => {`
## CU128
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | COMMENT ON TABLE finanzas.ajuste_obligacion_proveedor_m5 IS 'TEMPORAL_M5_DB_PATCH: ledger inmutable de NC y ND para CU128-CU130'; |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU128 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/014_m5_ajustes_saldos_favor/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu127-cu131.test.cjs; Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU95, CU106, CU123, CU127, CU129, CU130, CU131 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/014_m5_ajustes_saldos_favor/migration.sql`
- `Controladores/pruebas/m5-cu127-cu131.test.cjs`
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx`
### Evidencia textual
- `COMMENT ON TABLE finanzas.ajuste_obligacion_proveedor_m5 IS 'TEMPORAL_M5_DB_PATCH: ledger inmutable de NC y ND para CU128-CU130';`
- `CU127:GC,CU128:GSC,CU129:GSC,CU130:GC,CU131:GSC,`
- `CU127:['CU123'],CU128:['CU106'],CU129:['CU106'],CU130:['CU95'],CU131:['CU106'],`
- `await t.test('CU128 aplica NC hasta la deuda y separa el excedente como saldo a favor', async () => {`
## CU129
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU127:GC,CU128:GSC,CU129:GSC,CU130:GC,CU131:GSC, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU129 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu127-cu131.test.cjs; Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU95, CU99, CU100, CU106, CU123, CU127, CU128, CU130, CU131 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu127-cu131.test.cjs`
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx`
### Evidencia textual
- `CU127:GC,CU128:GSC,CU129:GSC,CU130:GC,CU131:GSC,`
- `CU127:['CU123'],CU128:['CU106'],CU129:['CU106'],CU130:['CU95'],CU131:['CU106'],`
- `await t.test('CU129 ND aumenta la deuda y usa la fórmula única', async () => {`
- `await t.test('CU129 reutiliza CU99-CU100 y no aplica un excedente OCS pendiente', async () => {`
## CU130
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | COMMENT ON TABLE finanzas.ajuste_obligacion_proveedor_m5 IS 'TEMPORAL_M5_DB_PATCH: ledger inmutable de NC y ND para CU128-CU130'; |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU130 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/014_m5_ajustes_saldos_favor/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu127-cu131.test.cjs; Controladores/pruebas/m5-cu132-cu137.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU95, CU106, CU123, CU127, CU128, CU129, CU131 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/014_m5_ajustes_saldos_favor/migration.sql`
- `Controladores/pruebas/m5-cu127-cu131.test.cjs`
- `Controladores/pruebas/m5-cu132-cu137.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx`
### Evidencia textual
- `COMMENT ON TABLE finanzas.ajuste_obligacion_proveedor_m5 IS 'TEMPORAL_M5_DB_PATCH: ledger inmutable de NC y ND para CU128-CU130';`
- `CU127:GC,CU128:GSC,CU129:GSC,CU130:GC,CU131:GSC,`
- `CU127:['CU123'],CU128:['CU106'],CU129:['CU106'],CU130:['CU95'],CU131:['CU106'],`
- `await t.test('CU130 anula ND y NC sin borrar trazabilidad ni crear crédito impropio', async () => {`
## CU131
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | -- Ajustes documentales, saldos a favor e historial de evidencia para CU127-CU131. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU131 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/014_m5_ajustes_saldos_favor/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu127-cu131.test.cjs; Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU95, CU102, CU106, CU123, CU127, CU128, CU129, CU130, CU132, CU133, CU134, CU135, CU136, CU137 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/014_m5_ajustes_saldos_favor/migration.sql`
- `Controladores/pruebas/m5-cu127-cu131.test.cjs`
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx`
### Evidencia textual
- `-- Ajustes documentales, saldos a favor e historial de evidencia para CU127-CU131.`
- `CU127:GC,CU128:GSC,CU129:GSC,CU130:GC,CU131:GSC,`
- `CU127:['CU123'],CU128:['CU106'],CU129:['CU106'],CU130:['CU95'],CU131:['CU106'],`
- `CU132:['CU131'],CU133:['CU132'],CU134:['CU102'],CU135:['CU102'],CU136:['CU135'],CU137:['CU134'],`
## CU132
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | -- TEMPORAL_M5_DB_PATCH: CU132-CU137. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU132 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/CuentasPorPagar/CuentasPorPagar.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M5Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/014_m5_ajustes_saldos_favor/migration.sql; Controladores/prisma/migrations/015_m5_compensaciones_reclasificaciones/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu132-cu137.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU133, CU134, CU135, CU136, CU137 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/014_m5_ajustes_saldos_favor/migration.sql`
- `Controladores/prisma/migrations/015_m5_compensaciones_reclasificaciones/migration.sql`
- `Controladores/pruebas/m5-cu132-cu137.test.cjs`
- `Controladores/src/controladores/M5Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/CuentasPorPagar/CuentasPorPagar.tsx`
### Evidencia textual
- `-- TEMPORAL_M5_DB_PATCH: CU132-CU137.`
- `// TEMPORAL_M5_DB_PATCH_PENDIENTE CU132-CU133: el disponible menor al generado indica compensaciones activas.`
- `COMMENT ON TABLE finanzas.saldo_favor_proveedor_m5 IS 'TEMPORAL_M5_DB_PATCH: crédito por excedente de NC, sin compensación CU132';`
- `CU132:GC,CU133:GC,CU134:GC,CU135:GC,CU136:GC,CU137:G,`
## CU133
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | // TEMPORAL_M5_DB_PATCH_PENDIENTE CU132-CU133: el disponible menor al generado indica compensaciones activas. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU133 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/CuentasPorPagar/CuentasPorPagar.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M5Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu132-cu137.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU102, CU131, CU132, CU134, CU135, CU136, CU137 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu132-cu137.test.cjs`
- `Controladores/src/controladores/M5Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/CuentasPorPagar/CuentasPorPagar.tsx`
### Evidencia textual
- `// TEMPORAL_M5_DB_PATCH_PENDIENTE CU132-CU133: el disponible menor al generado indica compensaciones activas.`
- `CU132:GC,CU133:GC,CU134:GC,CU135:GC,CU136:GC,CU137:G,`
- `CU132:['CU131'],CU133:['CU132'],CU134:['CU102'],CU135:['CU102'],CU136:['CU135'],CU137:['CU134'],`
## CU134
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU134', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU134 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/CategoriasEgreso/CategoriasEgreso.tsx; Vistas/src/views/Mantenedores/Mantenedores.tsx; Vistas/src/views/Mantenedores/permisos.ts |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu132-cu137.test.cjs; Controladores/pruebas/mantenedores-panel.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU102, CU131, CU132, CU133, CU135, CU136, CU137 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu132-cu137.test.cjs`
- `Controladores/pruebas/mantenedores-panel.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/CategoriasEgreso/CategoriasEgreso.tsx`
- `Vistas/src/views/Mantenedores/Mantenedores.tsx`
- `Vistas/src/views/Mantenedores/permisos.ts`
### Evidencia textual
- `'CU134',`
- `<Route path="categorias-egreso" element={<Protegido permiso="CU134"><CategoriasEgreso /></Protegido>} />`
- `CU132:GC,CU133:GC,CU134:GC,CU135:GC,CU136:GC,CU137:G,`
- `CU132:['CU131'],CU133:['CU132'],CU134:['CU102'],CU135:['CU102'],CU136:['CU135'],CU137:['CU134'],`
## CU135
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU132:GC,CU133:GC,CU134:GC,CU135:GC,CU136:GC,CU137:G, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU135 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu132-cu137.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU102, CU131, CU132, CU133, CU134, CU136, CU137 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu132-cu137.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx`
### Evidencia textual
- `CU132:GC,CU133:GC,CU134:GC,CU135:GC,CU136:GC,CU137:G,`
- `CU132:['CU131'],CU133:['CU132'],CU134:['CU102'],CU135:['CU102'],CU136:['CU135'],CU137:['CU134'],`
## CU136
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU132:GC,CU133:GC,CU134:GC,CU135:GC,CU136:GC,CU137:G, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU136 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/CategoriasEgreso/CategoriasEgreso.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu132-cu137.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU102, CU131, CU132, CU133, CU134, CU135, CU137 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu132-cu137.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/CategoriasEgreso/CategoriasEgreso.tsx`
### Evidencia textual
- `CU132:GC,CU133:GC,CU134:GC,CU135:GC,CU136:GC,CU137:G,`
- `CU132:['CU131'],CU133:['CU132'],CU134:['CU102'],CU135:['CU102'],CU136:['CU135'],CU137:['CU134'],`
## CU137
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU137', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU137 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/CategoriasEgreso/CategoriasEgreso.tsx; Vistas/src/views/Mantenedores/permisos.ts |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/015_m5_compensaciones_reclasificaciones/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu132-cu137.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU59, CU60, CU61, CU62, CU63, CU64, CU65, CU66, CU71, CU72, CU74, CU110, CU132, CU133, CU134, CU135, CU136, CU150 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/015_m5_compensaciones_reclasificaciones/migration.sql`
- `Controladores/pruebas/m5-cu132-cu137.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/CategoriasEgreso/CategoriasEgreso.tsx`
- `Vistas/src/views/Mantenedores/permisos.ts`
### Evidencia textual
- `'CU137',`
- `'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150',`
- `-- TEMPORAL_M5_DB_PATCH: CU132-CU137.`
- `CU132:GC,CU133:GC,CU134:GC,CU135:GC,CU136:GC,CU137:G,`
## CU138
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | -- TEMPORAL_M5_DB_PATCH: CU138-CU145. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU138 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/016_m5_reasignaciones_envios/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu138-cu145.test.cjs; Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU139, CU140, CU141, CU142, CU143, CU144, CU145 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/016_m5_reasignaciones_envios/migration.sql`
- `Controladores/pruebas/m5-cu138-cu145.test.cjs`
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx`
### Evidencia textual
- `-- TEMPORAL_M5_DB_PATCH: CU138-CU145.`
- `CU138:GSC,CU139:GSC,CU140:G,CU141:GC,CU142:GSC,CU143:GSC,CU144:GSC,CU145:GSC,`
- `test('M5 P10 CU138-CU145 corrige imputaciones y agrupa costos de importación',async t=>{`
## CU139
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | COMMENT ON TABLE finanzas.solicitud_reasignacion_costo_m5 IS 'TEMPORAL_M5_DB_PATCH: ledger CU139-CU140; no modifica deuda ni categoria'; |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU139 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/016_m5_reasignaciones_envios/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu138-cu145.test.cjs; Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU138, CU140, CU141, CU142, CU143, CU144, CU145 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/016_m5_reasignaciones_envios/migration.sql`
- `Controladores/pruebas/m5-cu138-cu145.test.cjs`
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx`
### Evidencia textual
- `COMMENT ON TABLE finanzas.solicitud_reasignacion_costo_m5 IS 'TEMPORAL_M5_DB_PATCH: ledger CU139-CU140; no modifica deuda ni categoria';`
- `CU138:GSC,CU139:GSC,CU140:G,CU141:GC,CU142:GSC,CU143:GSC,CU144:GSC,CU145:GSC,`
## CU140
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | COMMENT ON TABLE finanzas.solicitud_reasignacion_costo_m5 IS 'TEMPORAL_M5_DB_PATCH: ledger CU139-CU140; no modifica deuda ni categoria'; |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU140 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/016_m5_reasignaciones_envios/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu138-cu145.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU138, CU139, CU141, CU142, CU143, CU144, CU145 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/016_m5_reasignaciones_envios/migration.sql`
- `Controladores/pruebas/m5-cu138-cu145.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/DocumentosProveedor/DocumentosProveedor.tsx`
### Evidencia textual
- `COMMENT ON TABLE finanzas.solicitud_reasignacion_costo_m5 IS 'TEMPORAL_M5_DB_PATCH: ledger CU139-CU140; no modifica deuda ni categoria';`
- `CU138:GSC,CU139:GSC,CU140:G,CU141:GC,CU142:GSC,CU143:GSC,CU144:GSC,CU145:GSC,`
## CU141
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU138:GSC,CU139:GSC,CU140:G,CU141:GC,CU142:GSC,CU143:GSC,CU144:GSC,CU145:GSC, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU141 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/PagosProveedores/PagosProveedores.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu138-cu145.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU138, CU139, CU140, CU142, CU143, CU144, CU145 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu138-cu145.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/PagosProveedores/PagosProveedores.tsx`
### Evidencia textual
- `CU138:GSC,CU139:GSC,CU140:G,CU141:GC,CU142:GSC,CU143:GSC,CU144:GSC,CU145:GSC,`
## CU142
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="envios-importaciones" element={<Protegido permiso="CU142"><EnviosImportaciones /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU142 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/016_m5_reasignaciones_envios/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu138-cu145.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU138, CU139, CU140, CU141, CU143, CU144, CU145 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/016_m5_reasignaciones_envios/migration.sql`
- `Controladores/pruebas/m5-cu138-cu145.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
### Evidencia textual
- `<Route path="envios-importaciones" element={<Protegido permiso="CU142"><EnviosImportaciones /></Protegido>} />`
- `COMMENT ON TABLE finanzas.envio_importacion_m5 IS 'TEMPORAL_M5_DB_PATCH: agrupador financiero CU142-CU145';`
- `CU138:GSC,CU139:GSC,CU140:G,CU141:GC,CU142:GSC,CU143:GSC,CU144:GSC,CU145:GSC,`
- `{ path: '/envios-importaciones', label: 'Envíos e Importaciones', icon: Anchor, permission: 'CU142' },`
## CU143
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU138:GSC,CU139:GSC,CU140:G,CU141:GC,CU142:GSC,CU143:GSC,CU144:GSC,CU145:GSC, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU143 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/EnviosImportaciones/EnviosImportaciones.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu138-cu145.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU138, CU139, CU140, CU141, CU142, CU144, CU145 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu138-cu145.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/EnviosImportaciones/EnviosImportaciones.tsx`
### Evidencia textual
- `CU138:GSC,CU139:GSC,CU140:G,CU141:GC,CU142:GSC,CU143:GSC,CU144:GSC,CU145:GSC,`
## CU144
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU138:GSC,CU139:GSC,CU140:G,CU141:GC,CU142:GSC,CU143:GSC,CU144:GSC,CU145:GSC, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU144 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/EnviosImportaciones/EnviosImportaciones.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu138-cu145.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU138, CU139, CU140, CU141, CU142, CU143, CU145 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu138-cu145.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/EnviosImportaciones/EnviosImportaciones.tsx`
### Evidencia textual
- `CU138:GSC,CU139:GSC,CU140:G,CU141:GC,CU142:GSC,CU143:GSC,CU144:GSC,CU145:GSC,`
## CU145
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | -- TEMPORAL_M5_DB_PATCH: CU138-CU145. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU145 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/EnviosImportaciones/EnviosImportaciones.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/016_m5_reasignaciones_envios/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu138-cu145.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU138, CU139, CU140, CU141, CU142, CU143, CU144 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/016_m5_reasignaciones_envios/migration.sql`
- `Controladores/pruebas/m5-cu138-cu145.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/EnviosImportaciones/EnviosImportaciones.tsx`
### Evidencia textual
- `-- TEMPORAL_M5_DB_PATCH: CU138-CU145.`
- `COMMENT ON TABLE finanzas.envio_importacion_m5 IS 'TEMPORAL_M5_DB_PATCH: agrupador financiero CU142-CU145';`
- `CU138:GSC,CU139:GSC,CU140:G,CU141:GC,CU142:GSC,CU143:GSC,CU144:GSC,CU145:GSC,`
- `test('M5 P10 CU138-CU145 corrige imputaciones y agrupa costos de importación',async t=>{`
## CU146
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | -- TEMPORAL_M5_DB_PATCH: CU146-CU154. Caja Chica mensual y ciclo final de envios. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU146 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/EnviosImportaciones/EnviosImportaciones.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/017_m5_cierre_envios_caja_chica/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu146-cu154.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU147, CU148, CU149, CU150, CU151, CU152, CU153, CU154 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/017_m5_cierre_envios_caja_chica/migration.sql`
- `Controladores/pruebas/m5-cu146-cu154.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/EnviosImportaciones/EnviosImportaciones.tsx`
### Evidencia textual
- `-- TEMPORAL_M5_DB_PATCH: CU146-CU154. Caja Chica mensual y ciclo final de envios.`
- `CU146:GSC,CU147:GSC,CU148:GC,CU149:GSC,CU150:G,CU151:GSC,CU152:GSC,CU153:GC,CU154:GC,`
- `test('M5 P11 CU146-CU154 cierra importaciones y administra Caja Chica mensual',async t=>{`
## CU147
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU146:GSC,CU147:GSC,CU148:GC,CU149:GSC,CU150:G,CU151:GSC,CU152:GSC,CU153:GC,CU154:GC, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU147 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/EnviosImportaciones/EnviosImportaciones.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu146-cu154.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU146, CU148, CU149, CU150, CU151, CU152, CU153, CU154 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu146-cu154.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/EnviosImportaciones/EnviosImportaciones.tsx`
### Evidencia textual
- `CU146:GSC,CU147:GSC,CU148:GC,CU149:GSC,CU150:G,CU151:GSC,CU152:GSC,CU153:GC,CU154:GC,`
## CU148
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU146:GSC,CU147:GSC,CU148:GC,CU149:GSC,CU150:G,CU151:GSC,CU152:GSC,CU153:GC,CU154:GC, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU148 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/EnviosImportaciones/EnviosImportaciones.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu146-cu154.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU146, CU147, CU149, CU150, CU151, CU152, CU153, CU154 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu146-cu154.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/EnviosImportaciones/EnviosImportaciones.tsx`
### Evidencia textual
- `CU146:GSC,CU147:GSC,CU148:GC,CU149:GSC,CU150:G,CU151:GSC,CU152:GSC,CU153:GC,CU154:GC,`
## CU149
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="caja-chica" element={<Protegido permiso="CU149"><CajaChica /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU149 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu146-cu154.test.cjs; Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU146, CU147, CU148, CU150, CU151, CU152, CU153, CU154 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu146-cu154.test.cjs`
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
### Evidencia textual
- `<Route path="caja-chica" element={<Protegido permiso="CU149"><CajaChica /></Protegido>} />`
- `CU146:GSC,CU147:GSC,CU148:GC,CU149:GSC,CU150:G,CU151:GSC,CU152:GSC,CU153:GC,CU154:GC,`
- `{ path: '/caja-chica', label: 'Caja Chica', icon: Banknote, permission: 'CU149' },`
## CU150
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU150 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/CajaChica/CajaChica.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu146-cu154.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU59, CU60, CU61, CU62, CU63, CU64, CU65, CU66, CU71, CU72, CU74, CU110, CU137, CU146, CU147, CU148, CU149, CU151, CU152, CU153, CU154 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu146-cu154.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/CajaChica/CajaChica.tsx`
### Evidencia textual
- `'CU59','CU60','CU61','CU62','CU63','CU64','CU65','CU66','CU71','CU72','CU74','CU110','CU137','CU150',`
- `CU146:GSC,CU147:GSC,CU148:GC,CU149:GSC,CU150:G,CU151:GSC,CU152:GSC,CU153:GC,CU154:GC,`
## CU151
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU146:GSC,CU147:GSC,CU148:GC,CU149:GSC,CU150:G,CU151:GSC,CU152:GSC,CU153:GC,CU154:GC, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU151 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/CajaChica/CajaChica.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu146-cu154.test.cjs; Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU146, CU147, CU148, CU149, CU150, CU152, CU153, CU154 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu146-cu154.test.cjs`
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/CajaChica/CajaChica.tsx`
### Evidencia textual
- `CU146:GSC,CU147:GSC,CU148:GC,CU149:GSC,CU150:G,CU151:GSC,CU152:GSC,CU153:GC,CU154:GC,`
## CU152
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU146:GSC,CU147:GSC,CU148:GC,CU149:GSC,CU150:G,CU151:GSC,CU152:GSC,CU153:GC,CU154:GC, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU152 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/CajaChica/CajaChica.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu146-cu154.test.cjs; Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU146, CU147, CU148, CU149, CU150, CU151, CU153, CU154 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu146-cu154.test.cjs`
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/CajaChica/CajaChica.tsx`
### Evidencia textual
- `CU146:GSC,CU147:GSC,CU148:GC,CU149:GSC,CU150:G,CU151:GSC,CU152:GSC,CU153:GC,CU154:GC,`
## CU153
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU146:GSC,CU147:GSC,CU148:GC,CU149:GSC,CU150:G,CU151:GSC,CU152:GSC,CU153:GC,CU154:GC, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU153 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/CajaChica/CajaChica.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu146-cu154.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU146, CU147, CU148, CU149, CU150, CU151, CU152, CU154 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu146-cu154.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/CajaChica/CajaChica.tsx`
### Evidencia textual
- `CU146:GSC,CU147:GSC,CU148:GC,CU149:GSC,CU150:G,CU151:GSC,CU152:GSC,CU153:GC,CU154:GC,`
## CU154
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | -- TEMPORAL_M5_DB_PATCH: CU146-CU154. Caja Chica mensual y ciclo final de envios. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Proveedores M5 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU154 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/CajaChica/CajaChica.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/017_m5_cierre_envios_caja_chica/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu146-cu154.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU75, CU146, CU147, CU148, CU149, CU150, CU151, CU152, CU153 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/017_m5_cierre_envios_caja_chica/migration.sql`
- `Controladores/prisma/seed.ts`
- `Controladores/pruebas/m5-cu146-cu154.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/CajaChica/CajaChica.tsx`
### Evidencia textual
- `-- TEMPORAL_M5_DB_PATCH: CU146-CU154. Caja Chica mensual y ciclo final de envios.`
- `CU146:GSC,CU147:GSC,CU148:GC,CU149:GSC,CU150:G,CU151:GSC,CU152:GSC,CU153:GC,CU154:GC,`
- `console.log('Seed M5 completado: proveedores, egresos, importaciones y Caja Chica para CU75-CU154.');`
- `test('M5 P11 CU146-CU154 cierra importaciones y administra Caja Chica mensual',async t=>{`
## CU155
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU155', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU155 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/Mantenedores/Mantenedores.tsx; Vistas/src/views/Mantenedores/permisos.ts |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/m9/autorizacion.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | Controladores/src/m9/autorizacion.ts |
| 19. Pruebas | Controladores/pruebas/areas-trabajo-empleados.test.cjs; Controladores/pruebas/m6-cu155-cu158.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU157 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/areas-trabajo-empleados.test.cjs`
- `Controladores/pruebas/m6-cu155-cu158.test.cjs`
- `Controladores/src/m9/autorizacion.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/Mantenedores/Mantenedores.tsx`
- `Vistas/src/views/Mantenedores/permisos.ts`
### Evidencia textual
- `'CU155',`
- `<Route path="empleados" element={<Protegido permiso="CU155"><CatalogoEmpleados /></Protegido>} />`
- `<Route path="empleados/:id" element={<Protegido permiso="CU155"><FichaEmpleado /></Protegido>} />`
- `<Route path="mantenedores/areas-trabajo" element={<Protegido permiso={['CU155','CU157']}><AreasTrabajo /></Protegido>} />`
## CU156
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU155:'Ver empleados y áreas de trabajo', CU156:'Crear empleado', CU157:'Editar empleado y gestionar áreas de trabajo', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU156 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/CatalogoEmpleados/CatalogoEmpleados.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu155-cu158.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU155, CU157, CU158 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu155-cu158.test.cjs`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/CatalogoEmpleados/CatalogoEmpleados.tsx`
### Evidencia textual
- `CU155:'Ver empleados y áreas de trabajo', CU156:'Crear empleado', CU157:'Editar empleado y gestionar áreas de trabajo',`
- `CU156:[],`
- `CU157:['CU156'],`
- `CU158:['CU156'],`
## CU157
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU157', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU157 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/FichaEmpleado/FichaEmpleado.tsx; Vistas/src/views/Mantenedores/AreasTrabajo.tsx; Vistas/src/views/Mantenedores/Mantenedores.tsx; Vistas/src/views/Mantenedores/permisos.ts |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/areas-trabajo-empleados.test.cjs; Controladores/pruebas/m6-cu155-cu158.test.cjs; Controladores/pruebas/m6-cu178-cu182.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU155, CU156 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/areas-trabajo-empleados.test.cjs`
- `Controladores/pruebas/m6-cu155-cu158.test.cjs`
- `Controladores/pruebas/m6-cu178-cu182.test.cjs`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/FichaEmpleado/FichaEmpleado.tsx`
- `Vistas/src/views/Mantenedores/AreasTrabajo.tsx`
- `Vistas/src/views/Mantenedores/Mantenedores.tsx`
- `Vistas/src/views/Mantenedores/permisos.ts`
### Evidencia textual
- `'CU157',`
- `<Route path="mantenedores/areas-trabajo" element={<Protegido permiso={['CU155','CU157']}><AreasTrabajo /></Protegido>} />`
- `CU155:'Ver empleados y áreas de trabajo', CU156:'Crear empleado', CU157:'Editar empleado y gestionar áreas de trabajo',`
- `CU157:['CU156'],`
## CU158
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU158:['CU156'], |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Terreno/Remuneraciones M6 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU158 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/FichaEmpleado/FichaEmpleado.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu155-cu158.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU156 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu155-cu158.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/FichaEmpleado/FichaEmpleado.tsx`
### Evidencia textual
- `CU158:['CU156'],`
- `CU158:[],`
- `assert.equal(operacionesPermiso.actualizarPerfilRemuneracional, 'CU158');`
- `await t.test('CU158 enruta el catálogo remuneracional antes del parámetro de empleado', async () => {`
## CU159
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU159:['CU156','CU162'], |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Auditoria M9 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU159 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/FichaEmpleado/FichaEmpleado.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | Controladores/pruebas/m6-post-auditoria.test.cjs |
| 19. Pruebas | Controladores/pruebas/m6-cu159-cu166.test.cjs; Controladores/pruebas/m6-post-auditoria.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU156, CU160, CU161, CU162, CU163, CU164, CU165, CU166 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu159-cu166.test.cjs`
- `Controladores/pruebas/m6-post-auditoria.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/FichaEmpleado/FichaEmpleado.tsx`
### Evidencia textual
- `CU159:['CU156','CU162'],`
- `CU159:[],CU160:[],CU161:[],CU162:[],CU163:[],CU164:[],CU165:[],CU166:[],`
- `await t.test('8 CU159 considera historia finalizada al validar solapamientos', async () => {`
- `await t.test('9 CU159 finaliza concurrentemente una sola vez', async () => {`
## CU160
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU159:[],CU160:[],CU161:[],CU162:[],CU163:[],CU164:[],CU165:[],CU166:[], |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Auditoria M9 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU160 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/FichaEmpleado/FichaEmpleado.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M6Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | Controladores/pruebas/m6-post-auditoria.test.cjs |
| 19. Pruebas | Controladores/pruebas/m6-cu159-cu166.test.cjs; Controladores/pruebas/m6-post-auditoria.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU156, CU159, CU161, CU162, CU163, CU164, CU165, CU166 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu159-cu166.test.cjs`
- `Controladores/pruebas/m6-post-auditoria.test.cjs`
- `Controladores/src/controladores/M6Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/FichaEmpleado/FichaEmpleado.tsx`
### Evidencia textual
- `CU159:[],CU160:[],CU161:[],CU162:[],CU163:[],CU164:[],CU165:[],CU166:[],`
- `CU160:['CU156','CU165'],`
- `await t.test('10 CU160 finaliza concurrentemente una sola vez', async () => {`
- `await t.test('CU160 asigna sólo conceptos HABER y no calcula liquidación',async()=>{`
## CU161
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU159:[],CU160:[],CU161:[],CU162:[],CU163:[],CU164:[],CU165:[],CU166:[], |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Terreno/Remuneraciones M6 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU161 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/FichaEmpleado/FichaEmpleado.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu159-cu166.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU156, CU159, CU160, CU162, CU163, CU164, CU165, CU166, CU191, CU193 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu159-cu166.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/FichaEmpleado/FichaEmpleado.tsx`
### Evidencia textual
- `CU159:[],CU160:[],CU161:[],CU162:[],CU163:[],CU164:[],CU165:[],CU166:[],`
- `CU161:['CU156'],`
- `CU193:['CU161','CU191'],`
- `await t.test('CU161 reutiliza estado actual y valida disponibilidad del canal',async()=>{`
## CU162
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU162', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU162 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/EsquemasRemuneracionales/EsquemasRemuneracionales.tsx; Vistas/src/views/Mantenedores/Mantenedores.tsx; Vistas/src/views/Mantenedores/permisos.ts |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu159-cu166.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU156, CU159, CU160, CU161, CU163, CU164, CU165, CU166 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu159-cu166.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/EsquemasRemuneracionales/EsquemasRemuneracionales.tsx`
- `Vistas/src/views/Mantenedores/Mantenedores.tsx`
- `Vistas/src/views/Mantenedores/permisos.ts`
### Evidencia textual
- `'CU162',`
- `<Route path="esquemas-remuneracionales" element={<Protegido permiso={['CU162','CU163','CU164','CU165','CU166']}><EsquemasRemuneracionales /></Protegido>} />`
- `CU159:['CU156','CU162'],`
- `CU159:[],CU160:[],CU161:[],CU162:[],CU163:[],CU164:[],CU165:[],CU166:[],`
## CU163
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU163', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU163 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/EsquemasRemuneracionales/EsquemasRemuneracionales.tsx; Vistas/src/views/Mantenedores/Mantenedores.tsx; Vistas/src/views/Mantenedores/permisos.ts |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu159-cu166.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU159, CU160, CU161, CU162, CU164, CU165, CU166 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu159-cu166.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/EsquemasRemuneracionales/EsquemasRemuneracionales.tsx`
- `Vistas/src/views/Mantenedores/Mantenedores.tsx`
- `Vistas/src/views/Mantenedores/permisos.ts`
### Evidencia textual
- `'CU163',`
- `<Route path="esquemas-remuneracionales" element={<Protegido permiso={['CU162','CU163','CU164','CU165','CU166']}><EsquemasRemuneracionales /></Protegido>} />`
- `CU159:[],CU160:[],CU161:[],CU162:[],CU163:[],CU164:[],CU165:[],CU166:[],`
- `CU163:['CU162'],`
## CU164
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU164', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU164 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/EsquemasRemuneracionales/EsquemasRemuneracionales.tsx; Vistas/src/views/Mantenedores/Mantenedores.tsx; Vistas/src/views/Mantenedores/permisos.ts |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu159-cu166.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU159, CU160, CU161, CU162, CU163, CU165, CU166 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu159-cu166.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/EsquemasRemuneracionales/EsquemasRemuneracionales.tsx`
- `Vistas/src/views/Mantenedores/Mantenedores.tsx`
- `Vistas/src/views/Mantenedores/permisos.ts`
### Evidencia textual
- `'CU164',`
- `<Route path="esquemas-remuneracionales" element={<Protegido permiso={['CU162','CU163','CU164','CU165','CU166']}><EsquemasRemuneracionales /></Protegido>} />`
- `CU159:[],CU160:[],CU161:[],CU162:[],CU163:[],CU164:[],CU165:[],CU166:[],`
- `CU164:['CU162'],`
## CU165
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU165', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU165 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/EsquemasRemuneracionales/EsquemasRemuneracionales.tsx; Vistas/src/views/Mantenedores/Mantenedores.tsx; Vistas/src/views/Mantenedores/permisos.ts |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu159-cu166.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU156, CU159, CU160, CU161, CU162, CU163, CU164, CU166 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu159-cu166.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/EsquemasRemuneracionales/EsquemasRemuneracionales.tsx`
- `Vistas/src/views/Mantenedores/Mantenedores.tsx`
- `Vistas/src/views/Mantenedores/permisos.ts`
### Evidencia textual
- `'CU165',`
- `<Route path="esquemas-remuneracionales" element={<Protegido permiso={['CU162','CU163','CU164','CU165','CU166']}><EsquemasRemuneracionales /></Protegido>} />`
- `CU159:[],CU160:[],CU161:[],CU162:[],CU163:[],CU164:[],CU165:[],CU166:[],`
- `CU160:['CU156','CU165'],`
## CU166
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU166', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU166 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/EsquemasRemuneracionales/EsquemasRemuneracionales.tsx; Vistas/src/views/Mantenedores/Mantenedores.tsx; Vistas/src/views/Mantenedores/permisos.ts |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu159-cu166.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU159, CU160, CU161, CU162, CU163, CU164, CU165 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu159-cu166.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/EsquemasRemuneracionales/EsquemasRemuneracionales.tsx`
- `Vistas/src/views/Mantenedores/Mantenedores.tsx`
- `Vistas/src/views/Mantenedores/permisos.ts`
### Evidencia textual
- `'CU166',`
- `<Route path="esquemas-remuneracionales" element={<Protegido permiso={['CU162','CU163','CU164','CU165','CU166']}><EsquemasRemuneracionales /></Protegido>} />`
- `CU159:[],CU160:[],CU161:[],CU162:[],CU163:[],CU164:[],CU165:[],CU166:[],`
- `CU166:['CU165'],`
## CU167
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU167', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU167 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/MantenedorParametros/MantenedorParametros.tsx; Vistas/src/views/Mantenedores/Mantenedores.tsx; Vistas/src/views/Mantenedores/permisos.ts |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M6Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu167-cu171.test.cjs; Controladores/pruebas/m7-cu220-cu224.test.cjs; Controladores/pruebas/m7-cu246.test.cjs; Controladores/pruebas/mantenedores-panel.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU168, CU169, CU170, CU171, CU246, CU268 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu167-cu171.test.cjs`
- `Controladores/pruebas/m7-cu220-cu224.test.cjs`
- `Controladores/pruebas/m7-cu246.test.cjs`
- `Controladores/pruebas/mantenedores-panel.test.cjs`
- `Controladores/src/controladores/M6Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/MantenedorParametros/MantenedorParametros.tsx`
- `Vistas/src/views/Mantenedores/Mantenedores.tsx`
- `Vistas/src/views/Mantenedores/permisos.ts`
### Evidencia textual
- `'CU167',`
- `// CU167 no define una semántica de parámetro para la base porcentual del anticipo.`
- `<Route path="parametros-remuneraciones" element={<Protegido permiso={['CU167','CU168','CU169','CU170','CU171','CU246','CU268']}><MantenedorParametros /></Protegido>} />`
- `CU167:[],`
## CU168
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU168', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU168 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/MantenedorParametros/MantenedorParametros.tsx; Vistas/src/views/Mantenedores/Mantenedores.tsx; Vistas/src/views/Mantenedores/permisos.ts |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu167-cu171.test.cjs; Controladores/pruebas/mantenedores-panel.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU167, CU169, CU170, CU171, CU246, CU268 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu167-cu171.test.cjs`
- `Controladores/pruebas/mantenedores-panel.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/MantenedorParametros/MantenedorParametros.tsx`
- `Vistas/src/views/Mantenedores/Mantenedores.tsx`
- `Vistas/src/views/Mantenedores/permisos.ts`
### Evidencia textual
- `'CU168',`
- `<Route path="parametros-remuneraciones" element={<Protegido permiso={['CU167','CU168','CU169','CU170','CU171','CU246','CU268']}><MantenedorParametros /></Protegido>} />`
- `CU167:[],CU168:[],CU169:[],CU170:[],CU171:[],`
- `CU168:[],`
## CU169
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU169', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU169 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/MantenedorParametros/MantenedorParametros.tsx; Vistas/src/views/Mantenedores/Mantenedores.tsx; Vistas/src/views/Mantenedores/permisos.ts |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu167-cu171.test.cjs; Controladores/pruebas/m6-cu174-cu177.test.cjs; Controladores/pruebas/mantenedores-panel.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU167, CU168, CU170, CU171, CU246, CU268 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu167-cu171.test.cjs`
- `Controladores/pruebas/m6-cu174-cu177.test.cjs`
- `Controladores/pruebas/mantenedores-panel.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/MantenedorParametros/MantenedorParametros.tsx`
- `Vistas/src/views/Mantenedores/Mantenedores.tsx`
- `Vistas/src/views/Mantenedores/permisos.ts`
### Evidencia textual
- `'CU169',`
- `<Route path="parametros-remuneraciones" element={<Protegido permiso={['CU167','CU168','CU169','CU170','CU171','CU246','CU268']}><MantenedorParametros /></Protegido>} />`
- `CU167:[],CU168:[],CU169:[],CU170:[],CU171:[],`
- `CU169:[],`
## CU170
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU170', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU170 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/MantenedorParametros/MantenedorParametros.tsx; Vistas/src/views/Mantenedores/Mantenedores.tsx; Vistas/src/views/Mantenedores/permisos.ts |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu167-cu171.test.cjs; Controladores/pruebas/mantenedores-panel.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU167, CU168, CU169, CU171, CU246, CU268 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu167-cu171.test.cjs`
- `Controladores/pruebas/mantenedores-panel.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/MantenedorParametros/MantenedorParametros.tsx`
- `Vistas/src/views/Mantenedores/Mantenedores.tsx`
- `Vistas/src/views/Mantenedores/permisos.ts`
### Evidencia textual
- `'CU170',`
- `<Route path="parametros-remuneraciones" element={<Protegido permiso={['CU167','CU168','CU169','CU170','CU171','CU246','CU268']}><MantenedorParametros /></Protegido>} />`
- `CU167:[],CU168:[],CU169:[],CU170:[],CU171:[],`
- `CU170:[],`
## CU171
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU171', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU171 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/MantenedorParametros/MantenedorParametros.tsx; Vistas/src/views/Mantenedores/Mantenedores.tsx; Vistas/src/views/Mantenedores/permisos.ts |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu167-cu171.test.cjs; Controladores/pruebas/mantenedores-panel.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU167, CU168, CU169, CU170, CU246, CU268 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu167-cu171.test.cjs`
- `Controladores/pruebas/mantenedores-panel.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/MantenedorParametros/MantenedorParametros.tsx`
- `Vistas/src/views/Mantenedores/Mantenedores.tsx`
- `Vistas/src/views/Mantenedores/permisos.ts`
### Evidencia textual
- `'CU171',`
- `<Route path="parametros-remuneraciones" element={<Protegido permiso={['CU167','CU168','CU169','CU170','CU171','CU246','CU268']}><MantenedorParametros /></Protegido>} />`
- `CU167:[],CU168:[],CU169:[],CU170:[],CU171:[],`
- `CU171:[],`
## CU172
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="detalle-remuneracion" element={<Protegido permiso={['CU172','CU173','CU174','CU175','CU176','CU177','CU179','CU180','CU182','CU183','CU184']}><DetalleRemuneracion /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU172 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/DetalleRemuneracion/DetalleRemuneracion.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu167-cu171.test.cjs; Controladores/pruebas/m6-cu172-cu173.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU163, CU173, CU174, CU175, CU176, CU177, CU179, CU180, CU182, CU183, CU184 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu167-cu171.test.cjs`
- `Controladores/pruebas/m6-cu172-cu173.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/DetalleRemuneracion/DetalleRemuneracion.tsx`
### Evidencia textual
- `<Route path="detalle-remuneracion" element={<Protegido permiso={['CU172','CU173','CU174','CU175','CU176','CU177','CU179','CU180','CU182','CU183','CU184']}><DetalleRemuneracion /></Protegido>} />`
- `CU172:['CU163'],`
- `CU172:[],CU173:[],CU174:[],CU175:[],CU176:[],CU177:[],`
- `assert.doesNotMatch(vista, /CU172/);`
## CU173
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | -- CU173 conserva una decisión independiente por incidencia, sin mover el retrabajo desde Terreno. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Auditoria M9 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU173 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/DetalleRemuneracion/DetalleRemuneracion.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/029_m6_auditoria_retrabajos_unidades/migration.sql |
| 18. Auditoria M9 | Controladores/prisma/migrations/029_m6_auditoria_retrabajos_unidades/migration.sql |
| 19. Pruebas | Controladores/pruebas/m6-cu172-cu173.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU172, CU174, CU175, CU176, CU177, CU179, CU180, CU182, CU183, CU184 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/029_m6_auditoria_retrabajos_unidades/migration.sql`
- `Controladores/pruebas/m6-cu172-cu173.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/DetalleRemuneracion/DetalleRemuneracion.tsx`
### Evidencia textual
- `-- CU173 conserva una decisión independiente por incidencia, sin mover el retrabajo desde Terreno.`
- `<Route path="detalle-remuneracion" element={<Protegido permiso={['CU172','CU173','CU174','CU175','CU176','CU177','CU179','CU180','CU182','CU183','CU184']}><DetalleRemuneracion /></Protegido>} />`
- `CU172:[],CU173:[],CU174:[],CU175:[],CU176:[],CU177:[],`
- `CU173:[],`
## CU174
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | -- Scaffolding individual para CU174-CU177. No implementa población, cálculo ni cierre CU178-CU180. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU174 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/DetalleRemuneracion/DetalleRemuneracion.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/030_m6_componentes_individuales/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu172-cu173.test.cjs; Controladores/pruebas/m6-cu174-cu177.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU172, CU173, CU175, CU176, CU177, CU178, CU179, CU180, CU182, CU183, CU184 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/030_m6_componentes_individuales/migration.sql`
- `Controladores/pruebas/m6-cu172-cu173.test.cjs`
- `Controladores/pruebas/m6-cu174-cu177.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/DetalleRemuneracion/DetalleRemuneracion.tsx`
### Evidencia textual
- `-- Scaffolding individual para CU174-CU177. No implementa población, cálculo ni cierre CU178-CU180.`
- `<Route path="detalle-remuneracion" element={<Protegido permiso={['CU172','CU173','CU174','CU175','CU176','CU177','CU179','CU180','CU182','CU183','CU184']}><DetalleRemuneracion /></Protegido>} />`
- `CU172:[],CU173:[],CU174:[],CU175:[],CU176:[],CU177:[],`
- `CU174:[],`
## CU175
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="detalle-remuneracion" element={<Protegido permiso={['CU172','CU173','CU174','CU175','CU176','CU177','CU179','CU180','CU182','CU183','CU184']}><DetalleRemuneracion /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU175 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/DetalleRemuneracion/DetalleRemuneracion.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu172-cu173.test.cjs; Controladores/pruebas/m6-cu174-cu177.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU172, CU173, CU174, CU176, CU177, CU179, CU180, CU182, CU183, CU184 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu172-cu173.test.cjs`
- `Controladores/pruebas/m6-cu174-cu177.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/DetalleRemuneracion/DetalleRemuneracion.tsx`
### Evidencia textual
- `<Route path="detalle-remuneracion" element={<Protegido permiso={['CU172','CU173','CU174','CU175','CU176','CU177','CU179','CU180','CU182','CU183','CU184']}><DetalleRemuneracion /></Protegido>} />`
- `CU172:[],CU173:[],CU174:[],CU175:[],CU176:[],CU177:[],`
- `CU175:[],`
- `await t.test('CU175 automático versus manual genera conflicto y resolución sin overwrite',async()=>{`
## CU176
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="detalle-remuneracion" element={<Protegido permiso={['CU172','CU173','CU174','CU175','CU176','CU177','CU179','CU180','CU182','CU183','CU184']}><DetalleRemuneracion /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU176 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/DetalleRemuneracion/DetalleRemuneracion.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu172-cu173.test.cjs; Controladores/pruebas/m6-cu174-cu177.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU172, CU173, CU174, CU175, CU177, CU179, CU180, CU182, CU183, CU184 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu172-cu173.test.cjs`
- `Controladores/pruebas/m6-cu174-cu177.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/DetalleRemuneracion/DetalleRemuneracion.tsx`
### Evidencia textual
- `<Route path="detalle-remuneracion" element={<Protegido permiso={['CU172','CU173','CU174','CU175','CU176','CU177','CU179','CU180','CU182','CU183','CU184']}><DetalleRemuneracion /></Protegido>} />`
- `CU172:[],CU173:[],CU174:[],CU175:[],CU176:[],CU177:[],`
- `CU176:[],`
- `await t.test('CU176 ajustes positivos y negativos no modifican el valor externo',async()=>{`
## CU177
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | -- Scaffolding individual para CU174-CU177. No implementa población, cálculo ni cierre CU178-CU180. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU177 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/DetalleRemuneracion/DetalleRemuneracion.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/030_m6_componentes_individuales/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu172-cu173.test.cjs; Controladores/pruebas/m6-cu174-cu177.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU169, CU172, CU173, CU174, CU175, CU176, CU178, CU179, CU180, CU182, CU183, CU184 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/030_m6_componentes_individuales/migration.sql`
- `Controladores/pruebas/m6-cu172-cu173.test.cjs`
- `Controladores/pruebas/m6-cu174-cu177.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/DetalleRemuneracion/DetalleRemuneracion.tsx`
### Evidencia textual
- `-- Scaffolding individual para CU174-CU177. No implementa población, cálculo ni cierre CU178-CU180.`
- `<Route path="detalle-remuneracion" element={<Protegido permiso={['CU172','CU173','CU174','CU175','CU176','CU177','CU179','CU180','CU182','CU183','CU184']}><DetalleRemuneracion /></Protegido>} />`
- `CU172:[],CU173:[],CU174:[],CU175:[],CU176:[],CU177:[],`
- `CU177:['CU169'],`
## CU178
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | -- Scaffolding individual para CU174-CU177. No implementa población, cálculo ni cierre CU178-CU180. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU178 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/030_m6_componentes_individuales/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu174-cu177.test.cjs; Controladores/pruebas/m6-cu178-cu182.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU157, CU174, CU177, CU179, CU180, CU181, CU182, CU183, CU184, CU185, CU186, CU187, CU188, CU189, CU190 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/030_m6_componentes_individuales/migration.sql`
- `Controladores/pruebas/m6-cu174-cu177.test.cjs`
- `Controladores/pruebas/m6-cu178-cu182.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
### Evidencia textual
- `-- Scaffolding individual para CU174-CU177. No implementa población, cálculo ni cierre CU178-CU180.`
- `<Route path="periodos-remuneracion" element={<Protegido permiso={['CU178','CU181']}><PeriodosRemuneracion /></Protegido>} />`
- `CU178:['CU157'],`
- `CU178:[],CU179:[],CU180:[],CU181:[],CU182:[],CU183:[],CU184:[],CU185:[],CU186:[],CU187:[],CU188:[],CU189:[],CU190:[],`
## CU179
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="detalle-remuneracion" element={<Protegido permiso={['CU172','CU173','CU174','CU175','CU176','CU177','CU179','CU180','CU182','CU183','CU184']}><DetalleRemuneracion /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU179 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/DetalleRemuneracion/DetalleRemuneracion.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu172-cu173.test.cjs; Controladores/pruebas/m6-cu174-cu177.test.cjs; Controladores/pruebas/m6-cu178-cu182.test.cjs; Controladores/pruebas/m6-cu183-cu186.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU172, CU173, CU174, CU175, CU176, CU177, CU178, CU180, CU181, CU182, CU183, CU184, CU185, CU186, CU187, CU188, CU189, CU190 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu172-cu173.test.cjs`
- `Controladores/pruebas/m6-cu174-cu177.test.cjs`
- `Controladores/pruebas/m6-cu178-cu182.test.cjs`
- `Controladores/pruebas/m6-cu183-cu186.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/DetalleRemuneracion/DetalleRemuneracion.tsx`
### Evidencia textual
- `<Route path="detalle-remuneracion" element={<Protegido permiso={['CU172','CU173','CU174','CU175','CU176','CU177','CU179','CU180','CU182','CU183','CU184']}><DetalleRemuneracion /></Protegido>} />`
- `CU178:[],CU179:[],CU180:[],CU181:[],CU182:[],CU183:[],CU184:[],CU185:[],CU186:[],CU187:[],CU188:[],CU189:[],CU190:[],`
- `CU179:['CU178'],`
- `CU180:['CU179'],`
## CU180
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | -- Scaffolding individual para CU174-CU177. No implementa población, cálculo ni cierre CU178-CU180. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU180 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/DetalleRemuneracion/DetalleRemuneracion.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/030_m6_componentes_individuales/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu172-cu173.test.cjs; Controladores/pruebas/m6-cu178-cu182.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU172, CU173, CU174, CU175, CU176, CU177, CU178, CU179, CU181, CU182, CU183, CU184, CU185, CU186, CU187, CU188, CU189, CU190 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/030_m6_componentes_individuales/migration.sql`
- `Controladores/pruebas/m6-cu172-cu173.test.cjs`
- `Controladores/pruebas/m6-cu178-cu182.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/DetalleRemuneracion/DetalleRemuneracion.tsx`
### Evidencia textual
- `-- Scaffolding individual para CU174-CU177. No implementa población, cálculo ni cierre CU178-CU180.`
- `<Route path="detalle-remuneracion" element={<Protegido permiso={['CU172','CU173','CU174','CU175','CU176','CU177','CU179','CU180','CU182','CU183','CU184']}><DetalleRemuneracion /></Protegido>} />`
- `CU178:[],CU179:[],CU180:[],CU181:[],CU182:[],CU183:[],CU184:[],CU185:[],CU186:[],CU187:[],CU188:[],CU189:[],CU190:[],`
- `CU180:['CU179'],`
## CU181
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="periodos-remuneracion" element={<Protegido permiso={['CU178','CU181']}><PeriodosRemuneracion /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU181 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/PeriodosRemuneracion/PeriodosRemuneracion.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu178-cu182.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU157, CU178, CU179, CU180, CU182, CU183, CU184, CU185, CU186, CU187, CU188, CU189, CU190 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu178-cu182.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/PeriodosRemuneracion/PeriodosRemuneracion.tsx`
### Evidencia textual
- `<Route path="periodos-remuneracion" element={<Protegido permiso={['CU178','CU181']}><PeriodosRemuneracion /></Protegido>} />`
- `CU178:[],CU179:[],CU180:[],CU181:[],CU182:[],CU183:[],CU184:[],CU185:[],CU186:[],CU187:[],CU188:[],CU189:[],CU190:[],`
- `CU181:['CU178','CU180'],`
- `await t.test('CU157 y CU181 serializan la población del período',async()=>{`
## CU182
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | -- Corrige la cardinalidad del scaffolding sin implementar el flujo de reemplazo CU182. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU182 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/DetalleRemuneracion/DetalleRemuneracion.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M6Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/031_m6_reemplazo_remuneraciones/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu172-cu173.test.cjs; Controladores/pruebas/m6-cu174-cu177.test.cjs; Controladores/pruebas/m6-cu178-cu182.test.cjs; Controladores/pruebas/m6-cu183-cu186.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU172, CU173, CU174, CU175, CU176, CU177, CU178, CU179, CU180, CU181, CU183, CU184, CU185, CU186, CU187, CU188, CU189, CU190 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/031_m6_reemplazo_remuneraciones/migration.sql`
- `Controladores/pruebas/m6-cu172-cu173.test.cjs`
- `Controladores/pruebas/m6-cu174-cu177.test.cjs`
- `Controladores/pruebas/m6-cu178-cu182.test.cjs`
- `Controladores/pruebas/m6-cu183-cu186.test.cjs`
- `Controladores/src/controladores/M6Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/DetalleRemuneracion/DetalleRemuneracion.tsx`
### Evidencia textual
- `-- Corrige la cardinalidad del scaffolding sin implementar el flujo de reemplazo CU182.`
- `<Route path="detalle-remuneracion" element={<Protegido permiso={['CU172','CU173','CU174','CU175','CU176','CU177','CU179','CU180','CU182','CU183','CU184']}><DetalleRemuneracion /></Protegido>} />`
- `CU178:[],CU179:[],CU180:[],CU181:[],CU182:[],CU183:[],CU184:[],CU185:[],CU186:[],CU187:[],CU188:[],CU189:[],CU190:[],`
- `CU182:['CU180'],`
## CU183
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="detalle-remuneracion" element={<Protegido permiso={['CU172','CU173','CU174','CU175','CU176','CU177','CU179','CU180','CU182','CU183','CU184']}><DetalleRemuneracion /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU183 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/DetalleRemuneracion/DetalleRemuneracion.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu167-cu171.test.cjs; Controladores/pruebas/m6-cu172-cu173.test.cjs; Controladores/pruebas/m6-cu183-cu186.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU172, CU173, CU174, CU175, CU176, CU177, CU178, CU179, CU180, CU181, CU182, CU184, CU185, CU186, CU187, CU188, CU189, CU190 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu167-cu171.test.cjs`
- `Controladores/pruebas/m6-cu172-cu173.test.cjs`
- `Controladores/pruebas/m6-cu183-cu186.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/DetalleRemuneracion/DetalleRemuneracion.tsx`
### Evidencia textual
- `<Route path="detalle-remuneracion" element={<Protegido permiso={['CU172','CU173','CU174','CU175','CU176','CU177','CU179','CU180','CU182','CU183','CU184']}><DetalleRemuneracion /></Protegido>} />`
- `CU178:[],CU179:[],CU180:[],CU181:[],CU182:[],CU183:[],CU184:[],CU185:[],CU186:[],CU187:[],CU188:[],CU189:[],CU190:[],`
- `CU183:[],`
- `CU184:['CU183'],`
## CU184
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="detalle-remuneracion" element={<Protegido permiso={['CU172','CU173','CU174','CU175','CU176','CU177','CU179','CU180','CU182','CU183','CU184']}><DetalleRemuneracion /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU184 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/DetalleRemuneracion/DetalleRemuneracion.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu172-cu173.test.cjs; Controladores/pruebas/m6-cu183-cu186.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU171, CU172, CU173, CU174, CU175, CU176, CU177, CU178, CU179, CU180, CU181, CU182, CU183, CU185, CU186, CU187, CU188, CU189, CU190 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu172-cu173.test.cjs`
- `Controladores/pruebas/m6-cu183-cu186.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/DetalleRemuneracion/DetalleRemuneracion.tsx`
### Evidencia textual
- `<Route path="detalle-remuneracion" element={<Protegido permiso={['CU172','CU173','CU174','CU175','CU176','CU177','CU179','CU180','CU182','CU183','CU184']}><DetalleRemuneracion /></Protegido>} />`
- `CU178:[],CU179:[],CU180:[],CU181:[],CU182:[],CU183:[],CU184:[],CU185:[],CU186:[],CU187:[],CU188:[],CU189:[],CU190:[],`
- `CU184:['CU183'],`
- `CU186:['CU171','CU180','CU184'],`
## CU185
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="pagos-remuneraciones" element={<Protegido permiso={['CU185','CU186','CU187','CU188','CU189','CU190']}><RegistroPagosRemuneracion /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU185 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/RegistroPagosRemuneracion/RegistroPagosRemuneracion.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu183-cu186.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU171, CU178, CU179, CU180, CU181, CU182, CU183, CU184, CU186, CU187, CU188, CU189, CU190, CU191 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu183-cu186.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/RegistroPagosRemuneracion/RegistroPagosRemuneracion.tsx`
### Evidencia textual
- `<Route path="pagos-remuneraciones" element={<Protegido permiso={['CU185','CU186','CU187','CU188','CU189','CU190']}><RegistroPagosRemuneracion /></Protegido>} />`
- `CU178:[],CU179:[],CU180:[],CU181:[],CU182:[],CU183:[],CU184:[],CU185:[],CU186:[],CU187:[],CU188:[],CU189:[],CU190:[],`
- `CU185:['CU171'],`
- `CU191:['CU180','CU185'],`
## CU186
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="pagos-remuneraciones" element={<Protegido permiso={['CU185','CU186','CU187','CU188','CU189','CU190']}><RegistroPagosRemuneracion /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU186 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/RegistroPagosRemuneracion/RegistroPagosRemuneracion.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M6Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | Controladores/pruebas/m9-productores-failclosed.test.cjs |
| 19. Pruebas | Controladores/pruebas/m6-cu183-cu186.test.cjs; Controladores/pruebas/m9-productores-failclosed.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU01, CU24, CU43, CU59, CU75, CU171, CU178, CU179, CU180, CU181, CU182, CU183, CU184, CU185, CU187, CU188, CU189, CU190, CU245, CU260 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu183-cu186.test.cjs`
- `Controladores/pruebas/m9-productores-failclosed.test.cjs`
- `Controladores/src/controladores/M6Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/RegistroPagosRemuneracion/RegistroPagosRemuneracion.tsx`
### Evidencia textual
- `<Route path="pagos-remuneraciones" element={<Protegido permiso={['CU185','CU186','CU187','CU188','CU189','CU190']}><RegistroPagosRemuneracion /></Protegido>} />`
- `CU178:[],CU179:[],CU180:[],CU181:[],CU182:[],CU183:[],CU184:[],CU185:[],CU186:[],CU187:[],CU188:[],CU189:[],CU190:[],`
- `CU186:['CU171','CU180','CU184'],`
- `const actor={id:9n,sesion:'s',permisos:['CU01','CU24','CU43','CU59','CU75','CU186','CU245','CU260'],configuracion:'gerencia',administrador:true,cambiarClave:false,nombre:'Gerencia',acceso:'activo'};`
## CU187
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="pagos-remuneraciones" element={<Protegido permiso={['CU185','CU186','CU187','CU188','CU189','CU190']}><RegistroPagosRemuneracion /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU187 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/RegistroPagosRemuneracion/RegistroPagosRemuneracion.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu187-cu190.test.cjs; Controladores/pruebas/m6-cu198.test.cjs; Controladores/pruebas/m6-historial-remuneracional.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU171, CU178, CU179, CU180, CU181, CU182, CU183, CU184, CU185, CU186, CU188, CU189, CU190, CU198 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu187-cu190.test.cjs`
- `Controladores/pruebas/m6-cu198.test.cjs`
- `Controladores/pruebas/m6-historial-remuneracional.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/RegistroPagosRemuneracion/RegistroPagosRemuneracion.tsx`
### Evidencia textual
- `<Route path="pagos-remuneraciones" element={<Protegido permiso={['CU185','CU186','CU187','CU188','CU189','CU190']}><RegistroPagosRemuneracion /></Protegido>} />`
- `CU178:[],CU179:[],CU180:[],CU181:[],CU182:[],CU183:[],CU184:[],CU185:[],CU186:[],CU187:[],CU188:[],CU189:[],CU190:[],`
- `CU187:['CU171'],`
- `await t.test('CU187 puede pagar el líquido fijado por CU198', async () => {`
## CU188
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="pagos-remuneraciones" element={<Protegido permiso={['CU185','CU186','CU187','CU188','CU189','CU190']}><RegistroPagosRemuneracion /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU188 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu187-cu190.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU178, CU179, CU180, CU181, CU182, CU183, CU184, CU185, CU186, CU187, CU189, CU190 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu187-cu190.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
### Evidencia textual
- `<Route path="pagos-remuneraciones" element={<Protegido permiso={['CU185','CU186','CU187','CU188','CU189','CU190']}><RegistroPagosRemuneracion /></Protegido>} />`
- `<Route path="pagos-remuneraciones/:id" element={<Protegido permiso={['CU188','CU189','CU190']}><DetallePagoRemuneracion /></Protegido>} />`
- `CU178:[],CU179:[],CU180:[],CU181:[],CU182:[],CU183:[],CU184:[],CU185:[],CU186:[],CU187:[],CU188:[],CU189:[],CU190:[],`
- `CU188:[],`
## CU189
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="pagos-remuneraciones" element={<Protegido permiso={['CU185','CU186','CU187','CU188','CU189','CU190']}><RegistroPagosRemuneracion /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU189 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/DetallePagoRemuneracion/DetallePagoRemuneracion.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu183-cu186.test.cjs; Controladores/pruebas/m6-cu187-cu190.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU178, CU179, CU180, CU181, CU182, CU183, CU184, CU185, CU186, CU187, CU188, CU190 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu183-cu186.test.cjs`
- `Controladores/pruebas/m6-cu187-cu190.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/DetallePagoRemuneracion/DetallePagoRemuneracion.tsx`
### Evidencia textual
- `<Route path="pagos-remuneraciones" element={<Protegido permiso={['CU185','CU186','CU187','CU188','CU189','CU190']}><RegistroPagosRemuneracion /></Protegido>} />`
- `<Route path="pagos-remuneraciones/:id" element={<Protegido permiso={['CU188','CU189','CU190']}><DetallePagoRemuneracion /></Protegido>} />`
- `CU178:[],CU179:[],CU180:[],CU181:[],CU182:[],CU183:[],CU184:[],CU185:[],CU186:[],CU187:[],CU188:[],CU189:[],CU190:[],`
- `CU189:['CU188'],`
## CU190
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="pagos-remuneraciones" element={<Protegido permiso={['CU185','CU186','CU187','CU188','CU189','CU190']}><RegistroPagosRemuneracion /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU190 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/DetallePagoRemuneracion/DetallePagoRemuneracion.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu187-cu190.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU178, CU179, CU180, CU181, CU182, CU183, CU184, CU185, CU186, CU187, CU188, CU189 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu187-cu190.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/DetallePagoRemuneracion/DetallePagoRemuneracion.tsx`
### Evidencia textual
- `<Route path="pagos-remuneraciones" element={<Protegido permiso={['CU185','CU186','CU187','CU188','CU189','CU190']}><RegistroPagosRemuneracion /></Protegido>} />`
- `<Route path="pagos-remuneraciones/:id" element={<Protegido permiso={['CU188','CU189','CU190']}><DetallePagoRemuneracion /></Protegido>} />`
- `CU178:[],CU179:[],CU180:[],CU181:[],CU182:[],CU183:[],CU184:[],CU185:[],CU186:[],CU187:[],CU188:[],CU189:[],CU190:[],`
- `CU190:['CU188'],`
## CU191
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="documentos-remuneracion" element={<Protegido permiso={['CU191','CU192','CU193']}><DocumentosRemuneracion /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU191 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/FichaEmpleado/FichaEmpleado.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu191-cu195.test.cjs; Controladores/pruebas/m6-historial-remuneracional.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU161, CU180, CU185, CU192, CU193 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu191-cu195.test.cjs`
- `Controladores/pruebas/m6-historial-remuneracional.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/FichaEmpleado/FichaEmpleado.tsx`
### Evidencia textual
- `<Route path="documentos-remuneracion" element={<Protegido permiso={['CU191','CU192','CU193']}><DocumentosRemuneracion /></Protegido>} />`
- `CU191:['CU180','CU185'],`
- `CU192:['CU191'],`
- `CU193:['CU161','CU191'],`
## CU192
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="documentos-remuneracion" element={<Protegido permiso={['CU191','CU192','CU193']}><DocumentosRemuneracion /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU192 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/DocumentosRemuneracion/DocumentosRemuneracion.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu191-cu195.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU191, CU193 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu191-cu195.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/DocumentosRemuneracion/DocumentosRemuneracion.tsx`
### Evidencia textual
- `<Route path="documentos-remuneracion" element={<Protegido permiso={['CU191','CU192','CU193']}><DocumentosRemuneracion /></Protegido>} />`
- `CU192:['CU191'],`
- `reenviarDocumentoRemuneracion:'CU192', registrarEntregaDocumento:'CU193', consultarEntregaDocumento:'CU193',`
- `{ path: '/documentos-remuneracion', label: 'Documentos de Remuneración', icon: FileSearch, permissions: ['CU191', 'CU192', 'CU193'] },`
## CU193
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="documentos-remuneracion" element={<Protegido permiso={['CU191','CU192','CU193']}><DocumentosRemuneracion /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU193 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/DocumentosRemuneracion/DocumentosRemuneracion.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu191-cu195.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU161, CU191, CU192 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu191-cu195.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/DocumentosRemuneracion/DocumentosRemuneracion.tsx`
### Evidencia textual
- `<Route path="documentos-remuneracion" element={<Protegido permiso={['CU191','CU192','CU193']}><DocumentosRemuneracion /></Protegido>} />`
- `CU193:['CU161','CU191'],`
- `reenviarDocumentoRemuneracion:'CU192', registrarEntregaDocumento:'CU193', consultarEntregaDocumento:'CU193',`
- `{ path: '/documentos-remuneracion', label: 'Documentos de Remuneración', icon: FileSearch, permissions: ['CU191', 'CU192', 'CU193'] },`
## CU194
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU194:['CU179'], |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Terreno/Remuneraciones M6 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU194 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/DetalleRemuneracion/DetalleRemuneracion.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu191-cu195.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU179, CU195 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu191-cu195.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/DetalleRemuneracion/DetalleRemuneracion.tsx`
### Evidencia textual
- `CU194:['CU179'],`
- `exportarCalculoPreliminar:'CU194', exportarRemuneracionesOficiales:'CU195',`
## CU195
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU195:['CU180'], |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Terreno/Remuneraciones M6 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU195 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/PeriodosRemuneracion/PeriodosRemuneracion.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu191-cu195.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU180, CU191, CU194 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu191-cu195.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/PeriodosRemuneracion/PeriodosRemuneracion.tsx`
### Evidencia textual
- `CU195:['CU180'],`
- `exportarCalculoPreliminar:'CU194', exportarRemuneracionesOficiales:'CU195',`
- `test('M6 T9 CU191-CU195 documentos y exportaciones',async t=>{`
## CU196
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="honorarios" element={<Protegido permiso={['CU196','CU197','CU198']}><Honorarios /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU196 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu187-cu190.test.cjs; Controladores/pruebas/m6-cu196-cu197.test.cjs; Vistas/src/views/verificacionAccionesFinal.test.tsx |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU197, CU198 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu187-cu190.test.cjs`
- `Controladores/pruebas/m6-cu196-cu197.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/verificacionAccionesFinal.test.tsx`
### Evidencia textual
- `<Route path="honorarios" element={<Protegido permiso={['CU196','CU197','CU198']}><Honorarios /></Protegido>} />`
- `CU196:[],`
- `CU197:['CU196'],`
- `assert.equal(codigosTodosLosCU.length, 274); assert.deepEqual(matrizPermisosPorCU.CU196, []); assert.deepEqual(matrizPermisosPorCU.CU197, []); assert.deepEqual(matrizPermisosPorCU.CU198, []);`
## CU197
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="honorarios" element={<Protegido permiso={['CU196','CU197','CU198']}><Honorarios /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU197 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/Honorarios/Honorarios.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu196-cu197.test.cjs; Controladores/pruebas/m6-cu198.test.cjs; Vistas/src/views/verificacionAccionesFinal.test.tsx |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU167, CU196, CU198 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu196-cu197.test.cjs`
- `Controladores/pruebas/m6-cu198.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/Honorarios/Honorarios.tsx`
- `Vistas/src/views/verificacionAccionesFinal.test.tsx`
### Evidencia textual
- `<Route path="honorarios" element={<Protegido permiso={['CU196','CU197','CU198']}><Honorarios /></Protegido>} />`
- `CU197:['CU196'],`
- `CU198:['CU197','CU167'],`
- `assert.equal(codigosTodosLosCU.length, 274); assert.deepEqual(matrizPermisosPorCU.CU196, []); assert.deepEqual(matrizPermisosPorCU.CU197, []); assert.deepEqual(matrizPermisosPorCU.CU198, []);`
## CU198
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="honorarios" element={<Protegido permiso={['CU196','CU197','CU198']}><Honorarios /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU198 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/Honorarios/Honorarios.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m5-cu146-cu154.test.cjs; Controladores/pruebas/m6-cu159-cu166.test.cjs; Controladores/pruebas/m6-cu172-cu173.test.cjs; Controladores/pruebas/m6-cu174-cu177.test.cjs; Controladores/pruebas/m6-cu178-cu182.test.cjs; Controladores/pruebas/m6-cu183-cu186.test.cjs; Controladores/pruebas/m6-cu187-cu190.test.cjs; Controladores/pruebas/m6-cu191-cu195.test.cjs; Controladores/pruebas/m6-cu196-cu197.test.cjs; Controladores/pruebas/m6-cu198.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU167, CU196, CU197 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m5-cu146-cu154.test.cjs`
- `Controladores/pruebas/m6-cu159-cu166.test.cjs`
- `Controladores/pruebas/m6-cu172-cu173.test.cjs`
- `Controladores/pruebas/m6-cu174-cu177.test.cjs`
- `Controladores/pruebas/m6-cu178-cu182.test.cjs`
- `Controladores/pruebas/m6-cu183-cu186.test.cjs`
- `Controladores/pruebas/m6-cu187-cu190.test.cjs`
- `Controladores/pruebas/m6-cu191-cu195.test.cjs`
- `Controladores/pruebas/m6-cu196-cu197.test.cjs`
- `Controladores/pruebas/m6-cu198.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/Honorarios/Honorarios.tsx`
### Evidencia textual
- `<Route path="honorarios" element={<Protegido permiso={['CU196','CU197','CU198']}><Honorarios /></Protegido>} />`
- `CU198:['CU197','CU167'],`
- `assert.equal(codigosTodosLosCU.length, 274); assert.deepEqual(matrizPermisosPorCU.CU196, []); assert.deepEqual(matrizPermisosPorCU.CU197, []); assert.deepEqual(matrizPermisosPorCU.CU198, []);`
- `assert.equal(codigosTodosLosCU.length, 274); assert.deepEqual(matrizPermisosPorCU.CU198, []);`
## CU199
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU199', 'CU200', 'CU201', 'CU202', 'CU203', 'CU204', 'CU205', 'CU206', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU199 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/seguridad/accesosSistemas.ts; Vistas/src/views/GestionTerreno/GestionTerreno.tsx; Vistas/src/views/Terreno/TerrenoWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M6Controller.ts; Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; Vistas/src/seguridad/accesosSistemas.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/037_m6_terreno_visitas/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m4-permisos-funcionales.test.cjs; Controladores/pruebas/m6-agenda-terreno.test.cjs; Controladores/pruebas/m6-cu199-cu201.test.cjs; Controladores/pruebas/m7-cu222-cu237.test.cjs; Vistas/src/views/Terreno/AgendaTerreno.test.tsx; Vistas/src/views/Terreno/InstalacionesTerreno.test.tsx |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU200, CU201, CU202, CU203, CU204, CU205, CU206, CU210, CU211 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/037_m6_terreno_visitas/migration.sql`
- `Controladores/pruebas/m4-permisos-funcionales.test.cjs`
- `Controladores/pruebas/m6-agenda-terreno.test.cjs`
- `Controladores/pruebas/m6-cu199-cu201.test.cjs`
- `Controladores/pruebas/m7-cu222-cu237.test.cjs`
- `Controladores/src/controladores/M6Controller.ts`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/seguridad/accesosSistemas.ts`
- `Vistas/src/views/GestionTerreno/GestionTerreno.tsx`
- `Vistas/src/views/Terreno/AgendaTerreno.test.tsx`
- `Vistas/src/views/Terreno/InstalacionesTerreno.test.tsx`
- `Vistas/src/views/Terreno/TerrenoWrapper.tsx`
### Evidencia textual
- `'CU199', 'CU200', 'CU201', 'CU202', 'CU203', 'CU204', 'CU205', 'CU206',`
- `-- CU199 ancla la visita Legacy en su obra sin reemplazar servicio_terreno.`
- `<Route path="agenda" element={<Protegido permiso={['CU199','CU200','CU210']}><AgendaTerreno /></Protegido>} />`
- `<Route path="instalaciones" element={<Protegido permiso={['CU199','CU200','CU210','CU211']}><InstalacionesTerreno /></Protegido>} />`
## CU200
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU199', 'CU200', 'CU201', 'CU202', 'CU203', 'CU204', 'CU205', 'CU206', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU200 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/seguridad/accesosSistemas.ts; Vistas/src/views/GestionTerreno/GestionTerreno.tsx; Vistas/src/views/Terreno/TerrenoWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M6Controller.ts |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; Vistas/src/seguridad/accesosSistemas.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-agenda-terreno.test.cjs; Controladores/pruebas/m6-cu199-cu201.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU199, CU201, CU202, CU203, CU204, CU205, CU206, CU207, CU209, CU210, CU211, CU212, CU213 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-agenda-terreno.test.cjs`
- `Controladores/pruebas/m6-cu199-cu201.test.cjs`
- `Controladores/src/controladores/M6Controller.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/seguridad/accesosSistemas.ts`
- `Vistas/src/views/GestionTerreno/GestionTerreno.tsx`
- `Vistas/src/views/Terreno/TerrenoWrapper.tsx`
### Evidencia textual
- `'CU199', 'CU200', 'CU201', 'CU202', 'CU203', 'CU204', 'CU205', 'CU206',`
- `<Route path="agenda" element={<Protegido permiso={['CU199','CU200','CU210']}><AgendaTerreno /></Protegido>} />`
- `<Route path="instalaciones" element={<Protegido permiso={['CU199','CU200','CU210','CU211']}><InstalacionesTerreno /></Protegido>} />`
- `<Route path="reportes" element={<Protegido permiso={['CU199','CU200','CU202','CU205','CU207','CU209','CU210','CU211','CU212','CU213']}><ReportesTerreno /></Protegido>} />`
## CU201
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU199', 'CU200', 'CU201', 'CU202', 'CU203', 'CU204', 'CU205', 'CU206', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU201 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/seguridad/accesosSistemas.ts; Vistas/src/views/Terreno/TerrenoWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; Vistas/src/seguridad/accesosSistemas.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu172-cu173.test.cjs; Controladores/pruebas/m6-cu178-cu182.test.cjs; Controladores/pruebas/m6-cu183-cu186.test.cjs; Controladores/pruebas/m6-cu187-cu190.test.cjs; Controladores/pruebas/m6-cu191-cu195.test.cjs; Controladores/pruebas/m6-cu196-cu197.test.cjs; Controladores/pruebas/m6-cu198.test.cjs; Controladores/pruebas/m6-cu199-cu201.test.cjs; Controladores/pruebas/m6-cu202.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU199, CU200, CU202, CU203, CU204, CU205, CU206, CU208 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu172-cu173.test.cjs`
- `Controladores/pruebas/m6-cu178-cu182.test.cjs`
- `Controladores/pruebas/m6-cu183-cu186.test.cjs`
- `Controladores/pruebas/m6-cu187-cu190.test.cjs`
- `Controladores/pruebas/m6-cu191-cu195.test.cjs`
- `Controladores/pruebas/m6-cu196-cu197.test.cjs`
- `Controladores/pruebas/m6-cu198.test.cjs`
- `Controladores/pruebas/m6-cu199-cu201.test.cjs`
- `Controladores/pruebas/m6-cu202.test.cjs`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/seguridad/accesosSistemas.ts`
- `Vistas/src/views/Terreno/TerrenoWrapper.tsx`
### Evidencia textual
- `'CU199', 'CU200', 'CU201', 'CU202', 'CU203', 'CU204', 'CU205', 'CU206',`
- `<Route path="mis-tareas" element={<Protegido permiso={['CU201','CU208']}><MisTareasTerreno /></Protegido>} />`
- `CU199:'Crear visitas y ver obras', CU200:'Asignar responsables de visita', CU201:'Ver tareas propias de Terreno', CU202:'Gestionar levantamientos y panel de Terreno',`
- `CU201:[],`
## CU202
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU199', 'CU200', 'CU201', 'CU202', 'CU203', 'CU204', 'CU205', 'CU206', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU202 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/seguridad/accesosSistemas.ts; Vistas/src/views/GestionTerreno/GestionTerreno.tsx; Vistas/src/views/IncidenciasTerreno/IncidenciasTerreno.tsx; Vistas/src/views/LevantamientoTecnico/LevantamientoTecnico.tsx; Vistas/src/views/MisTareasTerreno/MisTareasTerreno.tsx; Vistas/src/views/Terreno/AgendaTerreno.tsx; Vistas/src/views/Terreno/InstalacionesTerreno.tsx; Vistas/src/views/Terreno/TerrenoWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M6Controller.ts |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; Vistas/src/seguridad/accesosSistemas.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m2-aprobacion-ot-unidad.test.cjs; Controladores/pruebas/m6-cu172-cu173.test.cjs; Controladores/pruebas/m6-cu178-cu182.test.cjs; Controladores/pruebas/m6-cu183-cu186.test.cjs; Controladores/pruebas/m6-cu187-cu190.test.cjs; Controladores/pruebas/m6-cu191-cu195.test.cjs; Controladores/pruebas/m6-cu196-cu197.test.cjs; Controladores/pruebas/m6-cu198.test.cjs; Controladores/pruebas/m6-cu202.test.cjs; Controladores/pruebas/m6-cu203.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU199, CU200, CU201, CU203, CU204, CU205, CU206, CU207, CU209, CU210, CU211, CU212, CU213 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m2-aprobacion-ot-unidad.test.cjs`
- `Controladores/pruebas/m6-cu172-cu173.test.cjs`
- `Controladores/pruebas/m6-cu178-cu182.test.cjs`
- `Controladores/pruebas/m6-cu183-cu186.test.cjs`
- `Controladores/pruebas/m6-cu187-cu190.test.cjs`
- `Controladores/pruebas/m6-cu191-cu195.test.cjs`
- `Controladores/pruebas/m6-cu196-cu197.test.cjs`
- `Controladores/pruebas/m6-cu198.test.cjs`
- `Controladores/pruebas/m6-cu202.test.cjs`
- `Controladores/pruebas/m6-cu203.test.cjs`
- `Controladores/pruebas/m6-dashboard-terreno.test.cjs`
- `Controladores/pruebas/m6-ficha-operativa-ot.test.cjs`
- `Controladores/pruebas/m6-gestion-rectificacion-ot.test.cjs`
- `Controladores/src/controladores/M6Controller.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/seguridad/accesosSistemas.ts`
- `Vistas/src/views/GestionTerreno/GestionTerreno.tsx`
- `Vistas/src/views/IncidenciasTerreno/IncidenciasTerreno.test.tsx`
- `Vistas/src/views/IncidenciasTerreno/IncidenciasTerreno.tsx`
- `Vistas/src/views/LevantamientoTecnico/LevantamientoTecnico.tsx`
- `Vistas/src/views/MisTareasTerreno/MisTareasTerreno.tsx`
- `Vistas/src/views/PortalPrincipal/PortalPrincipal.test.tsx`
- `Vistas/src/views/Terreno/AgendaTerreno.test.tsx`
- `Vistas/src/views/Terreno/AgendaTerreno.tsx`
- `Vistas/src/views/Terreno/InstalacionesTerreno.test.tsx`
- `Vistas/src/views/Terreno/InstalacionesTerreno.tsx`
- `Vistas/src/views/Terreno/TerrenoWrapper.tsx`
### Evidencia textual
- `'CU199', 'CU200', 'CU201', 'CU202', 'CU203', 'CU204', 'CU205', 'CU206',`
- `<Route path="ordenes-trabajo" element={<Protegido permiso={['CU202','CU205','CU207','CU209']}><GestionOrdenesTrabajo /></Protegido>} />`
- `<Route path="ordenes-trabajo/:id" element={<Protegido permiso={['CU202','CU205','CU207','CU209']}><DetalleOrdenTrabajo /></Protegido>} />`
- `<Route path="reportes" element={<Protegido permiso={['CU199','CU200','CU202','CU205','CU207','CU209','CU210','CU211','CU212','CU213']}><ReportesTerreno /></Protegido>} />`
## CU203
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU199', 'CU200', 'CU201', 'CU202', 'CU203', 'CU204', 'CU205', 'CU206', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU203 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/seguridad/accesosSistemas.ts; Vistas/src/views/LevantamientoTecnico/LevantamientoTecnico.tsx; Vistas/src/views/MisTareasTerreno/MisTareasTerreno.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; Vistas/src/seguridad/accesosSistemas.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu172-cu173.test.cjs; Controladores/pruebas/m6-cu178-cu182.test.cjs; Controladores/pruebas/m6-cu183-cu186.test.cjs; Controladores/pruebas/m6-cu187-cu190.test.cjs; Controladores/pruebas/m6-cu191-cu195.test.cjs; Controladores/pruebas/m6-cu196-cu197.test.cjs; Controladores/pruebas/m6-cu198.test.cjs; Controladores/pruebas/m6-cu202.test.cjs; Controladores/pruebas/m6-cu203.test.cjs; Controladores/pruebas/m6-cu204.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU199, CU200, CU201, CU202, CU204, CU205, CU206 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu172-cu173.test.cjs`
- `Controladores/pruebas/m6-cu178-cu182.test.cjs`
- `Controladores/pruebas/m6-cu183-cu186.test.cjs`
- `Controladores/pruebas/m6-cu187-cu190.test.cjs`
- `Controladores/pruebas/m6-cu191-cu195.test.cjs`
- `Controladores/pruebas/m6-cu196-cu197.test.cjs`
- `Controladores/pruebas/m6-cu198.test.cjs`
- `Controladores/pruebas/m6-cu202.test.cjs`
- `Controladores/pruebas/m6-cu203.test.cjs`
- `Controladores/pruebas/m6-cu204.test.cjs`
- `Controladores/pruebas/m6-cu205.test.cjs`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/seguridad/accesosSistemas.ts`
- `Vistas/src/views/LevantamientoTecnico/LevantamientoTecnico.tsx`
- `Vistas/src/views/MisTareasTerreno/MisTareasTerreno.tsx`
### Evidencia textual
- `'CU199', 'CU200', 'CU201', 'CU202', 'CU203', 'CU204', 'CU205', 'CU206',`
- `<Route path="tareas/:id/levantamiento" element={<Protegido permiso={['CU202','CU203','CU204','CU205','CU206']}><LevantamientoTecnico /></Protegido>} />`
- `CU203:'Corregir levantamiento', CU204:'Generar orden de trabajo desde levantamiento', CU205:'Ajustar y liberar órdenes de trabajo', CU206:'Generar tareas de producción',`
- `CU203:[],`
## CU204
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU199', 'CU200', 'CU201', 'CU202', 'CU203', 'CU204', 'CU205', 'CU206', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU204 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/seguridad/accesosSistemas.ts; Vistas/src/views/LevantamientoTecnico/LevantamientoTecnico.tsx; Vistas/src/views/MisTareasTerreno/MisTareasTerreno.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; Vistas/src/seguridad/accesosSistemas.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu172-cu173.test.cjs; Controladores/pruebas/m6-cu178-cu182.test.cjs; Controladores/pruebas/m6-cu183-cu186.test.cjs; Controladores/pruebas/m6-cu187-cu190.test.cjs; Controladores/pruebas/m6-cu191-cu195.test.cjs; Controladores/pruebas/m6-cu196-cu197.test.cjs; Controladores/pruebas/m6-cu198.test.cjs; Controladores/pruebas/m6-cu202.test.cjs; Controladores/pruebas/m6-cu203.test.cjs; Controladores/pruebas/m6-cu204.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU199, CU200, CU201, CU202, CU203, CU205, CU206 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu172-cu173.test.cjs`
- `Controladores/pruebas/m6-cu178-cu182.test.cjs`
- `Controladores/pruebas/m6-cu183-cu186.test.cjs`
- `Controladores/pruebas/m6-cu187-cu190.test.cjs`
- `Controladores/pruebas/m6-cu191-cu195.test.cjs`
- `Controladores/pruebas/m6-cu196-cu197.test.cjs`
- `Controladores/pruebas/m6-cu198.test.cjs`
- `Controladores/pruebas/m6-cu202.test.cjs`
- `Controladores/pruebas/m6-cu203.test.cjs`
- `Controladores/pruebas/m6-cu204.test.cjs`
- `Controladores/pruebas/m6-cu205.test.cjs`
- `Controladores/pruebas/m7-cu222-cu237.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/seguridad/accesosSistemas.ts`
- `Vistas/src/views/LevantamientoTecnico/LevantamientoTecnico.tsx`
- `Vistas/src/views/MisTareasTerreno/MisTareasTerreno.tsx`
### Evidencia textual
- `'CU199', 'CU200', 'CU201', 'CU202', 'CU203', 'CU204', 'CU205', 'CU206',`
- `<Route path="tareas/:id/levantamiento" element={<Protegido permiso={['CU202','CU203','CU204','CU205','CU206']}><LevantamientoTecnico /></Protegido>} />`
- `CU203:'Corregir levantamiento', CU204:'Generar orden de trabajo desde levantamiento', CU205:'Ajustar y liberar órdenes de trabajo', CU206:'Generar tareas de producción',`
- `CU204:[],`
## CU205
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU199', 'CU200', 'CU201', 'CU202', 'CU203', 'CU204', 'CU205', 'CU206', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU205 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/seguridad/accesosSistemas.ts; Vistas/src/views/GestionOrdenesTrabajo/DetalleOrdenTrabajo.tsx; Vistas/src/views/GestionTerreno/GestionTerreno.tsx; Vistas/src/views/IncidenciasTerreno/IncidenciasTerreno.tsx; Vistas/src/views/LevantamientoTecnico/LevantamientoTecnico.tsx; Vistas/src/views/Terreno/AgendaTerreno.tsx; Vistas/src/views/Terreno/InstalacionesTerreno.tsx; Vistas/src/views/Terreno/TerrenoWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M6Controller.ts |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; Vistas/src/seguridad/accesosSistemas.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu172-cu173.test.cjs; Controladores/pruebas/m6-cu178-cu182.test.cjs; Controladores/pruebas/m6-cu183-cu186.test.cjs; Controladores/pruebas/m6-cu187-cu190.test.cjs; Controladores/pruebas/m6-cu191-cu195.test.cjs; Controladores/pruebas/m6-cu196-cu197.test.cjs; Controladores/pruebas/m6-cu198.test.cjs; Controladores/pruebas/m6-cu202.test.cjs; Controladores/pruebas/m6-cu203.test.cjs; Controladores/pruebas/m6-cu204.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU199, CU200, CU201, CU202, CU203, CU204, CU206, CU207, CU209, CU210, CU211, CU212, CU213 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu172-cu173.test.cjs`
- `Controladores/pruebas/m6-cu178-cu182.test.cjs`
- `Controladores/pruebas/m6-cu183-cu186.test.cjs`
- `Controladores/pruebas/m6-cu187-cu190.test.cjs`
- `Controladores/pruebas/m6-cu191-cu195.test.cjs`
- `Controladores/pruebas/m6-cu196-cu197.test.cjs`
- `Controladores/pruebas/m6-cu198.test.cjs`
- `Controladores/pruebas/m6-cu202.test.cjs`
- `Controladores/pruebas/m6-cu203.test.cjs`
- `Controladores/pruebas/m6-cu204.test.cjs`
- `Controladores/pruebas/m6-cu205.test.cjs`
- `Controladores/pruebas/m6-cu206.test.cjs`
- `Controladores/pruebas/m6-ficha-operativa-ot.test.cjs`
- `Controladores/pruebas/m6-gestion-rectificacion-ot.test.cjs`
- `Controladores/src/controladores/M6Controller.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/seguridad/accesosSistemas.ts`
- `Vistas/src/views/GestionOrdenesTrabajo/DetalleOrdenTrabajo.test.tsx`
- `Vistas/src/views/GestionOrdenesTrabajo/DetalleOrdenTrabajo.tsx`
- `Vistas/src/views/GestionTerreno/GestionTerreno.tsx`
- `Vistas/src/views/IncidenciasTerreno/IncidenciasTerreno.tsx`
- `Vistas/src/views/LevantamientoTecnico/LevantamientoTecnico.tsx`
- `Vistas/src/views/Terreno/AgendaTerreno.tsx`
- `Vistas/src/views/Terreno/InstalacionesTerreno.tsx`
- `Vistas/src/views/Terreno/TerrenoWrapper.tsx`
### Evidencia textual
- `'CU199', 'CU200', 'CU201', 'CU202', 'CU203', 'CU204', 'CU205', 'CU206',`
- `<Route path="ordenes-trabajo" element={<Protegido permiso={['CU202','CU205','CU207','CU209']}><GestionOrdenesTrabajo /></Protegido>} />`
- `<Route path="ordenes-trabajo/:id" element={<Protegido permiso={['CU202','CU205','CU207','CU209']}><DetalleOrdenTrabajo /></Protegido>} />`
- `<Route path="reportes" element={<Protegido permiso={['CU199','CU200','CU202','CU205','CU207','CU209','CU210','CU211','CU212','CU213']}><ReportesTerreno /></Protegido>} />`
## CU206
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU199', 'CU200', 'CU201', 'CU202', 'CU203', 'CU204', 'CU205', 'CU206', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU206 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/seguridad/accesosSistemas.ts; Vistas/src/views/LevantamientoTecnico/LevantamientoTecnico.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; Vistas/src/seguridad/accesosSistemas.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu172-cu173.test.cjs; Controladores/pruebas/m6-cu178-cu182.test.cjs; Controladores/pruebas/m6-cu183-cu186.test.cjs; Controladores/pruebas/m6-cu187-cu190.test.cjs; Controladores/pruebas/m6-cu191-cu195.test.cjs; Controladores/pruebas/m6-cu196-cu197.test.cjs; Controladores/pruebas/m6-cu198.test.cjs; Controladores/pruebas/m6-cu202.test.cjs; Controladores/pruebas/m6-cu203.test.cjs; Controladores/pruebas/m6-cu205.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU199, CU200, CU201, CU202, CU203, CU204, CU205 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu172-cu173.test.cjs`
- `Controladores/pruebas/m6-cu178-cu182.test.cjs`
- `Controladores/pruebas/m6-cu183-cu186.test.cjs`
- `Controladores/pruebas/m6-cu187-cu190.test.cjs`
- `Controladores/pruebas/m6-cu191-cu195.test.cjs`
- `Controladores/pruebas/m6-cu196-cu197.test.cjs`
- `Controladores/pruebas/m6-cu198.test.cjs`
- `Controladores/pruebas/m6-cu202.test.cjs`
- `Controladores/pruebas/m6-cu203.test.cjs`
- `Controladores/pruebas/m6-cu205.test.cjs`
- `Controladores/pruebas/m6-cu206.test.cjs`
- `Controladores/pruebas/m6-cu207-cu210.test.cjs`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/seguridad/accesosSistemas.ts`
- `Vistas/src/views/LevantamientoTecnico/LevantamientoTecnico.tsx`
### Evidencia textual
- `'CU199', 'CU200', 'CU201', 'CU202', 'CU203', 'CU204', 'CU205', 'CU206',`
- `<Route path="tareas/:id/levantamiento" element={<Protegido permiso={['CU202','CU203','CU204','CU205','CU206']}><LevantamientoTecnico /></Protegido>} />`
- `CU203:'Corregir levantamiento', CU204:'Generar orden de trabajo desde levantamiento', CU205:'Ajustar y liberar órdenes de trabajo', CU206:'Generar tareas de producción',`
- `CU206:[],`
## CU207
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU207', 'CU208', 'CU209', 'CU210', 'CU211', 'CU212', 'CU213', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU207 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/seguridad/accesosSistemas.ts; Vistas/src/views/GestionOrdenesTrabajo/DetalleOrdenTrabajo.tsx; Vistas/src/views/GestionTerreno/GestionTerreno.tsx; Vistas/src/views/IncidenciasTerreno/IncidenciasTerreno.tsx; Vistas/src/views/ProduccionTerreno/ProduccionTerreno.tsx; Vistas/src/views/Terreno/AgendaTerreno.tsx; Vistas/src/views/Terreno/InstalacionesTerreno.tsx; Vistas/src/views/Terreno/TerrenoWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M6Controller.ts |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; Vistas/src/seguridad/accesosSistemas.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m4-permisos-funcionales.test.cjs; Controladores/pruebas/m6-cu187-cu190.test.cjs; Controladores/pruebas/m6-cu191-cu195.test.cjs; Controladores/pruebas/m6-cu205.test.cjs; Controladores/pruebas/m6-cu206.test.cjs; Controladores/pruebas/m6-cu207-cu210.test.cjs; Controladores/pruebas/m6-ficha-operativa-ot.test.cjs; Vistas/src/views/GestionOrdenesTrabajo/DetalleOrdenTrabajo.test.tsx |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU202, CU205, CU208, CU209, CU210, CU211, CU212, CU213 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m4-permisos-funcionales.test.cjs`
- `Controladores/pruebas/m6-cu187-cu190.test.cjs`
- `Controladores/pruebas/m6-cu191-cu195.test.cjs`
- `Controladores/pruebas/m6-cu205.test.cjs`
- `Controladores/pruebas/m6-cu206.test.cjs`
- `Controladores/pruebas/m6-cu207-cu210.test.cjs`
- `Controladores/pruebas/m6-ficha-operativa-ot.test.cjs`
- `Controladores/src/controladores/M6Controller.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/seguridad/accesosSistemas.ts`
- `Vistas/src/views/GestionOrdenesTrabajo/DetalleOrdenTrabajo.test.tsx`
- `Vistas/src/views/GestionOrdenesTrabajo/DetalleOrdenTrabajo.tsx`
- `Vistas/src/views/GestionTerreno/GestionTerreno.tsx`
- `Vistas/src/views/IncidenciasTerreno/IncidenciasTerreno.tsx`
- `Vistas/src/views/ProduccionTerreno/ProduccionTerreno.tsx`
- `Vistas/src/views/Terreno/AgendaTerreno.tsx`
- `Vistas/src/views/Terreno/InstalacionesTerreno.tsx`
- `Vistas/src/views/Terreno/TerrenoWrapper.tsx`
### Evidencia textual
- `'CU207', 'CU208', 'CU209', 'CU210', 'CU211', 'CU212', 'CU213',`
- `<Route path="ordenes-trabajo" element={<Protegido permiso={['CU202','CU205','CU207','CU209']}><GestionOrdenesTrabajo /></Protegido>} />`
- `<Route path="ordenes-trabajo/:id" element={<Protegido permiso={['CU202','CU205','CU207','CU209']}><DetalleOrdenTrabajo /></Protegido>} />`
- `<Route path="produccion" element={<Protegido permiso={['CU207','CU209']}><ProduccionTerreno /></Protegido>} />`
## CU208
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU207', 'CU208', 'CU209', 'CU210', 'CU211', 'CU212', 'CU213', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU208 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/seguridad/accesosSistemas.ts; Vistas/src/views/MisTareasTerreno/MisTareasTerreno.tsx; Vistas/src/views/Terreno/TerrenoWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; Vistas/src/seguridad/accesosSistemas.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/028_m6_hechos_remunerables_retrabajo/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu207-cu210.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU201, CU207, CU209, CU210, CU211, CU212, CU213 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/028_m6_hechos_remunerables_retrabajo/migration.sql`
- `Controladores/pruebas/m6-cu207-cu210.test.cjs`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/seguridad/accesosSistemas.ts`
- `Vistas/src/views/MisTareasTerreno/MisTareasTerreno.tsx`
- `Vistas/src/views/Terreno/TerrenoWrapper.tsx`
### Evidencia textual
- `'CU207', 'CU208', 'CU209', 'CU210', 'CU211', 'CU212', 'CU213',`
- `-- Habilitadores técnicos mínimos de Terreno. No implementan CU208, CU209, CU212 ni CU213.`
- `<Route path="mis-tareas" element={<Protegido permiso={['CU201','CU208']}><MisTareasTerreno /></Protegido>} />`
- `CU207:'Gestionar tareas de producción', CU208:'Ejecutar tareas de producción', CU209:'Aprobar ejecución y rectificaciones', CU210:'Preparar salida e instalaciones',`
## CU209
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU207', 'CU208', 'CU209', 'CU210', 'CU211', 'CU212', 'CU213', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU209 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/seguridad/accesosSistemas.ts; Vistas/src/views/GestionOrdenesTrabajo/DetalleOrdenTrabajo.tsx; Vistas/src/views/GestionTerreno/GestionTerreno.tsx; Vistas/src/views/IncidenciasTerreno/IncidenciasTerreno.tsx; Vistas/src/views/ProduccionTerreno/ProduccionTerreno.tsx; Vistas/src/views/Terreno/AgendaTerreno.tsx; Vistas/src/views/Terreno/InstalacionesTerreno.tsx; Vistas/src/views/Terreno/TerrenoWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M6Controller.ts |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; Vistas/src/seguridad/accesosSistemas.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/028_m6_hechos_remunerables_retrabajo/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu207-cu210.test.cjs; Controladores/pruebas/m6-ficha-operativa-ot.test.cjs; Controladores/pruebas/m6-gestion-rectificacion-ot.test.cjs; Vistas/src/views/GestionOrdenesTrabajo/DetalleOrdenTrabajo.test.tsx |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU202, CU205, CU207, CU208, CU210, CU211, CU212, CU213 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/028_m6_hechos_remunerables_retrabajo/migration.sql`
- `Controladores/pruebas/m6-cu207-cu210.test.cjs`
- `Controladores/pruebas/m6-ficha-operativa-ot.test.cjs`
- `Controladores/pruebas/m6-gestion-rectificacion-ot.test.cjs`
- `Controladores/src/controladores/M6Controller.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/seguridad/accesosSistemas.ts`
- `Vistas/src/views/GestionOrdenesTrabajo/DetalleOrdenTrabajo.test.tsx`
- `Vistas/src/views/GestionOrdenesTrabajo/DetalleOrdenTrabajo.tsx`
- `Vistas/src/views/GestionTerreno/GestionTerreno.tsx`
- `Vistas/src/views/IncidenciasTerreno/IncidenciasTerreno.tsx`
- `Vistas/src/views/ProduccionTerreno/ProduccionTerreno.tsx`
- `Vistas/src/views/Terreno/AgendaTerreno.tsx`
- `Vistas/src/views/Terreno/InstalacionesTerreno.tsx`
- `Vistas/src/views/Terreno/TerrenoWrapper.tsx`
### Evidencia textual
- `'CU207', 'CU208', 'CU209', 'CU210', 'CU211', 'CU212', 'CU213',`
- `-- Habilitadores técnicos mínimos de Terreno. No implementan CU208, CU209, CU212 ni CU213.`
- `<Route path="ordenes-trabajo" element={<Protegido permiso={['CU202','CU205','CU207','CU209']}><GestionOrdenesTrabajo /></Protegido>} />`
- `<Route path="ordenes-trabajo/:id" element={<Protegido permiso={['CU202','CU205','CU207','CU209']}><DetalleOrdenTrabajo /></Protegido>} />`
## CU210
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU207', 'CU208', 'CU209', 'CU210', 'CU211', 'CU212', 'CU213', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU210 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/seguridad/accesosSistemas.ts; Vistas/src/views/GestionTerreno/GestionTerreno.tsx; Vistas/src/views/Terreno/TerrenoWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M6Controller.ts |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; Vistas/src/seguridad/accesosSistemas.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-agenda-terreno.test.cjs; Controladores/pruebas/m6-cu207-cu210.test.cjs; Vistas/src/views/verificacionAccionesFinal.test.tsx |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU199, CU200, CU202, CU205, CU207, CU208, CU209, CU211, CU212, CU213 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-agenda-terreno.test.cjs`
- `Controladores/pruebas/m6-cu207-cu210.test.cjs`
- `Controladores/src/controladores/M6Controller.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/seguridad/accesosSistemas.ts`
- `Vistas/src/views/GestionTerreno/GestionTerreno.tsx`
- `Vistas/src/views/Terreno/TerrenoWrapper.tsx`
- `Vistas/src/views/verificacionAccionesFinal.test.tsx`
### Evidencia textual
- `'CU207', 'CU208', 'CU209', 'CU210', 'CU211', 'CU212', 'CU213',`
- `<Route path="agenda" element={<Protegido permiso={['CU199','CU200','CU210']}><AgendaTerreno /></Protegido>} />`
- `<Route path="instalaciones" element={<Protegido permiso={['CU199','CU200','CU210','CU211']}><InstalacionesTerreno /></Protegido>} />`
- `<Route path="reportes" element={<Protegido permiso={['CU199','CU200','CU202','CU205','CU207','CU209','CU210','CU211','CU212','CU213']}><ReportesTerreno /></Protegido>} />`
## CU211
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU207', 'CU208', 'CU209', 'CU210', 'CU211', 'CU212', 'CU213', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU211 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/seguridad/accesosSistemas.ts; Vistas/src/views/GestionTerreno/GestionTerreno.tsx; Vistas/src/views/Terreno/InstalacionesTerreno.tsx; Vistas/src/views/Terreno/TerrenoWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M6Controller.ts |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; Vistas/src/seguridad/accesosSistemas.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-agenda-terreno.test.cjs; Controladores/pruebas/m6-cu172-cu173.test.cjs; Controladores/pruebas/m6-cu207-cu210.test.cjs; Controladores/pruebas/m6-cu211-cu214.test.cjs; Vistas/src/views/Terreno/InstalacionesTerreno.test.tsx; Vistas/src/views/verificacionAccionesFinal.test.tsx |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU199, CU200, CU202, CU205, CU207, CU208, CU209, CU210, CU212, CU213 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-agenda-terreno.test.cjs`
- `Controladores/pruebas/m6-cu172-cu173.test.cjs`
- `Controladores/pruebas/m6-cu207-cu210.test.cjs`
- `Controladores/pruebas/m6-cu211-cu214.test.cjs`
- `Controladores/src/controladores/M6Controller.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/seguridad/accesosSistemas.ts`
- `Vistas/src/views/GestionTerreno/GestionTerreno.tsx`
- `Vistas/src/views/Terreno/InstalacionesTerreno.test.tsx`
- `Vistas/src/views/Terreno/InstalacionesTerreno.tsx`
- `Vistas/src/views/Terreno/TerrenoWrapper.tsx`
- `Vistas/src/views/verificacionAccionesFinal.test.tsx`
### Evidencia textual
- `'CU207', 'CU208', 'CU209', 'CU210', 'CU211', 'CU212', 'CU213',`
- `<Route path="instalaciones" element={<Protegido permiso={['CU199','CU200','CU210','CU211']}><InstalacionesTerreno /></Protegido>} />`
- `<Route path="reportes" element={<Protegido permiso={['CU199','CU200','CU202','CU205','CU207','CU209','CU210','CU211','CU212','CU213']}><ReportesTerreno /></Protegido>} />`
- `<Route path="visitas" element={<Protegido permiso={['CU199','CU200','CU210','CU211']}><GestionTerreno /></Protegido>} />`
## CU212
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU207', 'CU208', 'CU209', 'CU210', 'CU211', 'CU212', 'CU213', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU212 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/seguridad/accesosSistemas.ts; Vistas/src/views/GestionOrdenesTrabajo/DetalleOrdenTrabajo.tsx; Vistas/src/views/IncidenciasTerreno/IncidenciasTerreno.tsx; Vistas/src/views/Terreno/InstalacionesTerreno.tsx; Vistas/src/views/Terreno/TerrenoWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M6Controller.ts |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; Vistas/src/seguridad/accesosSistemas.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/028_m6_hechos_remunerables_retrabajo/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu211-cu214.test.cjs; Controladores/pruebas/m6-dashboard-terreno.test.cjs; Controladores/pruebas/m6-incidencias-revision.test.cjs; Controladores/pruebas/ui-selectores-incidencias.test.cjs; Vistas/src/views/GestionOrdenesTrabajo/DetalleOrdenTrabajo.test.tsx; Vistas/src/views/IncidenciasTerreno/IncidenciasTerreno.test.tsx; Vistas/src/views/Terreno/InstalacionesTerreno.test.tsx |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU207, CU208, CU209, CU210, CU211, CU213 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/028_m6_hechos_remunerables_retrabajo/migration.sql`
- `Controladores/pruebas/m6-cu211-cu214.test.cjs`
- `Controladores/pruebas/m6-dashboard-terreno.test.cjs`
- `Controladores/pruebas/m6-incidencias-revision.test.cjs`
- `Controladores/pruebas/ui-selectores-incidencias.test.cjs`
- `Controladores/src/controladores/M6Controller.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/seguridad/accesosSistemas.ts`
- `Vistas/src/views/GestionOrdenesTrabajo/DetalleOrdenTrabajo.test.tsx`
- `Vistas/src/views/GestionOrdenesTrabajo/DetalleOrdenTrabajo.tsx`
- `Vistas/src/views/IncidenciasTerreno/IncidenciasTerreno.test.tsx`
- `Vistas/src/views/IncidenciasTerreno/IncidenciasTerreno.tsx`
- `Vistas/src/views/Terreno/InstalacionesTerreno.test.tsx`
- `Vistas/src/views/Terreno/InstalacionesTerreno.tsx`
- `Vistas/src/views/Terreno/TerrenoWrapper.tsx`
- `documentacion/CORRECCIONES_UI_OBSERVACIONES_VICHO_2026_10_12.md`
### Evidencia textual
- `'CU207', 'CU208', 'CU209', 'CU210', 'CU211', 'CU212', 'CU213',`
- `- Seguridad: las rutas siguen bajo CU212/CU213, autenticación y `C_Finanzas`; no se agregaron permisos.`
- `-- Habilitadores técnicos mínimos de Terreno. No implementan CU208, CU209, CU212 ni CU213.`
- `<Route path="incidencias" element={<Protegido permiso={['CU212','CU213']}><IncidenciasTerreno /></Protegido>} />`
## CU213
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU207', 'CU208', 'CU209', 'CU210', 'CU211', 'CU212', 'CU213', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU213 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/seguridad/accesosSistemas.ts; Vistas/src/views/GestionOrdenesTrabajo/DetalleOrdenTrabajo.tsx; Vistas/src/views/IncidenciasTerreno/IncidenciasTerreno.tsx; Vistas/src/views/Terreno/InstalacionesTerreno.tsx; Vistas/src/views/Terreno/TerrenoWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M6Controller.ts; Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; Vistas/src/seguridad/accesosSistemas.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/028_m6_hechos_remunerables_retrabajo/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu211-cu214.test.cjs; Controladores/pruebas/m6-incidencias-revision.test.cjs; Vistas/src/views/IncidenciasTerreno/IncidenciasTerreno.test.tsx |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU207, CU208, CU209, CU210, CU211, CU212 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/028_m6_hechos_remunerables_retrabajo/migration.sql`
- `Controladores/pruebas/m6-cu211-cu214.test.cjs`
- `Controladores/pruebas/m6-incidencias-revision.test.cjs`
- `Controladores/src/controladores/M6Controller.ts`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/seguridad/accesosSistemas.ts`
- `Vistas/src/views/GestionOrdenesTrabajo/DetalleOrdenTrabajo.tsx`
- `Vistas/src/views/IncidenciasTerreno/IncidenciasTerreno.test.tsx`
- `Vistas/src/views/IncidenciasTerreno/IncidenciasTerreno.tsx`
- `Vistas/src/views/Terreno/InstalacionesTerreno.tsx`
- `Vistas/src/views/Terreno/TerrenoWrapper.tsx`
- `documentacion/CORRECCIONES_UI_OBSERVACIONES_VICHO_2026_10_12.md`
### Evidencia textual
- `'CU207', 'CU208', 'CU209', 'CU210', 'CU211', 'CU212', 'CU213',`
- `- Seguridad: las rutas siguen bajo CU212/CU213, autenticación y `C_Finanzas`; no se agregaron permisos.`
- `-- Habilitadores técnicos mínimos de Terreno. No implementan CU208, CU209, CU212 ni CU213.`
- `<Route path="incidencias" element={<Protegido permiso={['CU212','CU213']}><IncidenciasTerreno /></Protegido>} />`
## CU214
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | CU214:[], |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU214 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/FichaEmpleado/FichaEmpleado.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M6Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | Controladores/pruebas/m6-post-auditoria.test.cjs |
| 19. Pruebas | Controladores/pruebas/m6-cu178-cu182.test.cjs; Controladores/pruebas/m6-cu211-cu214.test.cjs; Controladores/pruebas/m6-post-auditoria.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | Ninguna dependencia textual inequivoca detectada. |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu178-cu182.test.cjs`
- `Controladores/pruebas/m6-cu211-cu214.test.cjs`
- `Controladores/pruebas/m6-post-auditoria.test.cjs`
- `Controladores/src/controladores/M6Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/FichaEmpleado/FichaEmpleado.tsx`
### Evidencia textual
- `CU214:[],`
- `await t.test('11 CU214 finaliza concurrentemente una sola vez', async () => {`
- `catalogoDeduccionesEmpleado:'CU214', listarDeduccionesEmpleado:'CU214', asignarDeduccionEmpleado:'CU214', finalizarDeduccionEmpleado:'CU214',`
- `const puedeCU214 = Boolean(sesion?.permisos.includes('CU214'));`
## CU215
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="dashboard-m7" element={<Protegido permiso="CU215"><PanelGeneralM7 /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU215 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardM7/componentes.tsx; Vistas/src/views/DashboardPrincipal/DashboardPrincipal.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu172-cu173.test.cjs; Controladores/pruebas/m6-cu178-cu182.test.cjs; Controladores/pruebas/m6-cu183-cu186.test.cjs; Controladores/pruebas/m6-cu187-cu190.test.cjs; Controladores/pruebas/m6-cu191-cu195.test.cjs; Controladores/pruebas/m6-cu196-cu197.test.cjs; Controladores/pruebas/m6-cu198.test.cjs; Controladores/pruebas/m6-cu202.test.cjs; Controladores/pruebas/m6-cu203.test.cjs; Controladores/pruebas/m6-cu205.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | Ninguna dependencia textual inequivoca detectada. |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu172-cu173.test.cjs`
- `Controladores/pruebas/m6-cu178-cu182.test.cjs`
- `Controladores/pruebas/m6-cu183-cu186.test.cjs`
- `Controladores/pruebas/m6-cu187-cu190.test.cjs`
- `Controladores/pruebas/m6-cu191-cu195.test.cjs`
- `Controladores/pruebas/m6-cu196-cu197.test.cjs`
- `Controladores/pruebas/m6-cu198.test.cjs`
- `Controladores/pruebas/m6-cu202.test.cjs`
- `Controladores/pruebas/m6-cu203.test.cjs`
- `Controladores/pruebas/m6-cu205.test.cjs`
- `Controladores/pruebas/m6-cu206.test.cjs`
- `Controladores/pruebas/m6-cu207-cu210.test.cjs`
- `Controladores/pruebas/m6-cu211-cu214.test.cjs`
- `Controladores/pruebas/m7-cu215-cu219.test.cjs`
- `Controladores/pruebas/m7-cu220-cu224.test.cjs`
- `Controladores/pruebas/m7-historico-panel.test.cjs`
- `Controladores/pruebas/m7-integracion-inventario.test.cjs`
- `Controladores/pruebas/m7-rebaseline-definitivo.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardM7/componentes.tsx`
- `Vistas/src/views/DashboardPrincipal/DashboardPrincipal.tsx`
### Evidencia textual
- `<Route path="dashboard-m7" element={<Protegido permiso="CU215"><PanelGeneralM7 /></Protegido>} />`
- `assert.equal(codigosTodosLosCU.includes('CU215'),true);`
- `assert.equal(codigosTodosLosCU.length, 274); assert.equal(codigosTodosLosCU.includes('CU215'),true);`
- `await t.test('permiso y ruta reutilizan CU215', () => { assert.equal(operacionesPermiso.consultarHistoricoPanelGeneralM7, 'CU215'); assert.match(readFileSync(resolve('src/rutas/finanzas.ts'), 'utf8'), /dashboard-m7\/historico/); });`
## CU216
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="dashboard-m7/centro-atencion" element={<Protegido permiso="CU216"><CentroAtencionM7 /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU216 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-cu216-cu221.test.cjs; Controladores/pruebas/m7-cu220-cu224.test.cjs; Controladores/pruebas/m7-cu252.test.cjs; Controladores/pruebas/m7-rebaseline-definitivo.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | Ninguna dependencia textual inequivoca detectada. |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-cu216-cu221.test.cjs`
- `Controladores/pruebas/m7-cu220-cu224.test.cjs`
- `Controladores/pruebas/m7-cu252.test.cjs`
- `Controladores/pruebas/m7-rebaseline-definitivo.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
### Evidencia textual
- `<Route path="dashboard-m7/centro-atencion" element={<Protegido permiso="CU216"><CentroAtencionM7 /></Protegido>} />`
- `['centroAtencion', ['CU216'], () => this.consultarCentroAtencion(consulta, permisos)],`
- `assert.equal(permiteOperacion('consultarAnalisisVentasM7', ['CU216']), false);`
- `await t.test('33 CU216 no concede permisos subyacentes', () => { assert.equal(permiteOperacion('consultarCuentasCobrarM7', ['CU216']), false); assert.equal(permiteOperacion('consultarMargenProyectosM7', ['CU216']), false); });`
## CU217
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="dashboard-m7/cotizaciones-pendientes" element={<Protegido permiso="CU217"><CotizacionesPendientesM7 /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU217 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-cu216-cu221.test.cjs; Controladores/pruebas/m7-rebaseline-definitivo.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU218 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-cu216-cu221.test.cjs`
- `Controladores/pruebas/m7-rebaseline-definitivo.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
### Evidencia textual
- `<Route path="dashboard-m7/cotizaciones-pendientes" element={<Protegido permiso="CU217"><CotizacionesPendientesM7 /></Protegido>} />`
- `['cotizacionesPendientes', ['CU217'], () => this.consultarCotizacionesPendientes(consulta, permisos)],`
- `assert.equal(permiteOperacion('consultarCuentasCobrarM7', ['CU217']), false);`
- `await t.test('13 CU218 habilita únicamente el segmento de conversión', () => { assert.equal(permiteOperacion('consultarAnalisisVentasM7', ['CU218']), true); assert.equal(permiteOperacion('consultarAnalisisVentasM7', ['CU217']), false); });`
## CU218
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="dashboard-m7/ventas" element={<Protegido permiso={['CU218','CU219','CU220']}><AnalisisVentasM7 /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU218 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardM7/AnalisisVentasM7.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-cu216-cu221.test.cjs; Controladores/pruebas/m7-delta-controlado.test.cjs; Controladores/pruebas/m7-historico-panel.test.cjs; Controladores/pruebas/m7-rebaseline-definitivo.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU219, CU220 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-cu216-cu221.test.cjs`
- `Controladores/pruebas/m7-delta-controlado.test.cjs`
- `Controladores/pruebas/m7-historico-panel.test.cjs`
- `Controladores/pruebas/m7-rebaseline-definitivo.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardM7/AnalisisVentasM7.tsx`
### Evidencia textual
- `<Route path="dashboard-m7/ventas" element={<Protegido permiso={['CU218','CU219','CU220']}><AnalisisVentasM7 /></Protegido>} />`
- `['ventas', ['CU218', 'CU219', 'CU220'], () => this.consultarAnalisisVentas(consulta, permisos)],`
- `assert.deepEqual(Object.keys(await modulo.consultarAnalisisVentas({}, ['CU218'])).sort(), ['conversion', 'conversionSegmentos', 'estado', 'periodo', 'segmento']);`
- `assert.equal(permiteOperacion('consultarCuentasPagarM7', ['CU218']), false);`
## CU219
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="dashboard-m7/ventas" element={<Protegido permiso={['CU218','CU219','CU220']}><AnalisisVentasM7 /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU219 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardM7/AnalisisVentasM7.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-cu215-cu219.test.cjs; Controladores/pruebas/m7-cu216-cu221.test.cjs; Controladores/pruebas/m7-historico-panel.test.cjs; Controladores/pruebas/m7-rebaseline-definitivo.test.cjs; Controladores/pruebas/m7-ventas-familia-navegacion.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU218, CU220 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-cu215-cu219.test.cjs`
- `Controladores/pruebas/m7-cu216-cu221.test.cjs`
- `Controladores/pruebas/m7-historico-panel.test.cjs`
- `Controladores/pruebas/m7-rebaseline-definitivo.test.cjs`
- `Controladores/pruebas/m7-ventas-familia-navegacion.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardM7/AnalisisVentasM7.tsx`
### Evidencia textual
- `<Route path="dashboard-m7/ventas" element={<Protegido permiso={['CU218','CU219','CU220']}><AnalisisVentasM7 /></Protegido>} />`
- `['ventas', ['CU218', 'CU219', 'CU220'], () => this.consultarAnalisisVentas(consulta, permisos)],`
- `assert.equal(operacionesPermiso.consultarAnalisisVentasM7, 'CU219');`
- `assert.equal(permiteOperacion('consultarLiquidezM7', ['CU219']), false);`
## CU220
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="dashboard-m7/ventas" element={<Protegido permiso={['CU218','CU219','CU220']}><AnalisisVentasM7 /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU220 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardM7/AnalisisVentasM7.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-cu215-cu219.test.cjs; Controladores/pruebas/m7-cu216-cu221.test.cjs; Controladores/pruebas/m7-historico-panel.test.cjs; Controladores/pruebas/m7-rebaseline-definitivo.test.cjs; Controladores/pruebas/m7-ventas-familia-navegacion.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU218, CU219 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-cu215-cu219.test.cjs`
- `Controladores/pruebas/m7-cu216-cu221.test.cjs`
- `Controladores/pruebas/m7-historico-panel.test.cjs`
- `Controladores/pruebas/m7-rebaseline-definitivo.test.cjs`
- `Controladores/pruebas/m7-ventas-familia-navegacion.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardM7/AnalisisVentasM7.tsx`
### Evidencia textual
- `<Route path="dashboard-m7/ventas" element={<Protegido permiso={['CU218','CU219','CU220']}><AnalisisVentasM7 /></Protegido>} />`
- `['ventas', ['CU218', 'CU219', 'CU220'], () => this.consultarAnalisisVentas(consulta, permisos)],`
- `assert.equal(permiteOperacion('consultarAnalisisVentasM7', ['CU220']), true);`
- `assert.equal(permiteOperacion('consultarMargenProyectosM7', ['CU220']), false);`
## CU221
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="dashboard-m7/clientes/:id" element={<Protegido permiso="CU221"><ContextoClienteM7 /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU221 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardM7/CotizacionesPendientesM7.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-cu216-cu221.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU219, CU222 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-cu216-cu221.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardM7/CotizacionesPendientesM7.tsx`
### Evidencia textual
- `<Route path="dashboard-m7/clientes/:id" element={<Protegido permiso="CU221"><ContextoClienteM7 /></Protegido>} />`
- `await t.test('25 CU221 + CU222 muestra CxC', () => assert.ok(Object.hasOwn(contexto.bloques, 'cuentasCobrar')));`
- `await t.test('26 CU221 sin CU222 no devuelve CxC', async () => { const r = await modulo.consultarContextoCliente(clienteA.id_cliente_financiero, consulta, ['CU221']); assert.equal(Object.hasOwn(r.bloques, 'cuentasCobrar'), false); });`
- `await t.test('27 CU221 + CU219 muestra Ventas', () => assert.ok(Object.hasOwn(contexto.bloques, 'ventas')));`
## CU222
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'cuentas-cobrar': { permisos: ['CU222', 'CU223', 'CU225'], titulo: 'Cuentas por Cobrar y Cobranza', cargar: () => this.consultarCuentasCobrar(consulta, permisos) }, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU222 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-cu215-cu219.test.cjs; Controladores/pruebas/m7-cu216-cu221.test.cjs; Controladores/pruebas/m7-cu222-cu237.test.cjs; Controladores/pruebas/m7-rebaseline-definitivo.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU223, CU224, CU225 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-cu215-cu219.test.cjs`
- `Controladores/pruebas/m7-cu216-cu221.test.cjs`
- `Controladores/pruebas/m7-cu222-cu237.test.cjs`
- `Controladores/pruebas/m7-rebaseline-definitivo.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
### Evidencia textual
- `'cuentas-cobrar': { permisos: ['CU222', 'CU223', 'CU225'], titulo: 'Cuentas por Cobrar y Cobranza', cargar: () => this.consultarCuentasCobrar(consulta, permisos) },`
- `<Route path="dashboard-m7/cuentas-cobrar" element={<Protegido permiso={['CU222','CU223','CU224','CU225']}><CuentasCobrarM7 /></Protegido>} />`
- `['cuentasCobrar', ['CU222', 'CU223', 'CU224', 'CU225'], () => this.consultarCuentasCobrar(consulta, permisos)],`
- `assert.equal(operacionesPermiso.consultarCuentasCobrarM7, 'CU222');`
## CU223
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'cuentas-cobrar': { permisos: ['CU222', 'CU223', 'CU225'], titulo: 'Cuentas por Cobrar y Cobranza', cargar: () => this.consultarCuentasCobrar(consulta, permisos) }, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU223 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-cu215-cu219.test.cjs; Controladores/pruebas/m7-cu222-cu237.test.cjs; Controladores/pruebas/m7-rebaseline-definitivo.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU222, CU224, CU225 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-cu215-cu219.test.cjs`
- `Controladores/pruebas/m7-cu222-cu237.test.cjs`
- `Controladores/pruebas/m7-rebaseline-definitivo.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
### Evidencia textual
- `'cuentas-cobrar': { permisos: ['CU222', 'CU223', 'CU225'], titulo: 'Cuentas por Cobrar y Cobranza', cargar: () => this.consultarCuentasCobrar(consulta, permisos) },`
- `<Route path="dashboard-m7/cuentas-cobrar" element={<Protegido permiso={['CU222','CU223','CU224','CU225']}><CuentasCobrarM7 /></Protegido>} />`
- `['cuentasCobrar', ['CU222', 'CU223', 'CU224', 'CU225'], () => this.consultarCuentasCobrar(consulta, permisos)],`
- `assert.equal(permiteOperacion('consultarCuentasCobrarM7', ['CU223']), true);`
## CU224
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="dashboard-m7/cuentas-cobrar" element={<Protegido permiso={['CU222','CU223','CU224','CU225']}><CuentasCobrarM7 /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU224 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-cierre-hallazgos.test.cjs; Controladores/pruebas/m7-delta-controlado.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU218, CU222, CU223, CU225 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-cierre-hallazgos.test.cjs`
- `Controladores/pruebas/m7-delta-controlado.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
### Evidencia textual
- `<Route path="dashboard-m7/cuentas-cobrar" element={<Protegido permiso={['CU222','CU223','CU224','CU225']}><CuentasCobrarM7 /></Protegido>} />`
- `['cuentasCobrar', ['CU222', 'CU223', 'CU224', 'CU225'], () => this.consultarCuentasCobrar(consulta, permisos)],`
- `assert.deepEqual(Object.keys(await modulo.consultarCuentasCobrar({}, ['CU224'])).sort(), ['concentracionDeuda', 'estado', 'obligacionesPagadas', 'periodo']);`
- `await t.test('02 CU218 y CU224 exponen sólo su segmento', async () => {`
## CU225
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'cuentas-cobrar': { permisos: ['CU222', 'CU223', 'CU225'], titulo: 'Cuentas por Cobrar y Cobranza', cargar: () => this.consultarCuentasCobrar(consulta, permisos) }, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU225 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-cierre-hallazgos.test.cjs; Controladores/pruebas/m7-cu215-cu219.test.cjs; Controladores/pruebas/m7-cu222-cu237.test.cjs; Controladores/pruebas/m7-rebaseline-definitivo.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU222, CU223, CU224 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-cierre-hallazgos.test.cjs`
- `Controladores/pruebas/m7-cu215-cu219.test.cjs`
- `Controladores/pruebas/m7-cu222-cu237.test.cjs`
- `Controladores/pruebas/m7-rebaseline-definitivo.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
### Evidencia textual
- `'cuentas-cobrar': { permisos: ['CU222', 'CU223', 'CU225'], titulo: 'Cuentas por Cobrar y Cobranza', cargar: () => this.consultarCuentasCobrar(consulta, permisos) },`
- `<Route path="dashboard-m7/cuentas-cobrar" element={<Protegido permiso={['CU222','CU223','CU224','CU225']}><CuentasCobrarM7 /></Protegido>} />`
- `['cuentasCobrar', ['CU222', 'CU223', 'CU224', 'CU225'], () => this.consultarCuentasCobrar(consulta, permisos)],`
- `assert.equal(permiteOperacion('consultarCuentasCobrarM7', ['CU225']), true);`
## CU226
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'cuentas-pagar': { permisos: ['CU226', 'CU227'], titulo: 'Cuentas por Pagar', cargar: () => this.consultarCuentasPagar(consulta, permisos) }, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU226 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-cierre-hallazgos.test.cjs; Controladores/pruebas/m7-cu215-cu219.test.cjs; Controladores/pruebas/m7-cu216-cu221.test.cjs; Controladores/pruebas/m7-rebaseline-definitivo.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU227 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-cierre-hallazgos.test.cjs`
- `Controladores/pruebas/m7-cu215-cu219.test.cjs`
- `Controladores/pruebas/m7-cu216-cu221.test.cjs`
- `Controladores/pruebas/m7-rebaseline-definitivo.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
### Evidencia textual
- `'cuentas-pagar': { permisos: ['CU226', 'CU227'], titulo: 'Cuentas por Pagar', cargar: () => this.consultarCuentasPagar(consulta, permisos) },`
- `<Route path="dashboard-m7/cuentas-pagar" element={<Protegido permiso={['CU226','CU227']}><CuentasPagarM7 /></Protegido>} />`
- `['cuentasPagar', ['CU226', 'CU227'], () => this.consultarCuentasPagar(consulta, permisos)],`
- `assert.equal(operacionesPermiso.consultarCuentasPagarM7, 'CU226');`
## CU227
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'cuentas-pagar': { permisos: ['CU226', 'CU227'], titulo: 'Cuentas por Pagar', cargar: () => this.consultarCuentasPagar(consulta, permisos) }, |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU227 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-cierre-hallazgos.test.cjs; Controladores/pruebas/m7-cu215-cu219.test.cjs; Controladores/pruebas/m7-rebaseline-definitivo.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU226 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-cierre-hallazgos.test.cjs`
- `Controladores/pruebas/m7-cu215-cu219.test.cjs`
- `Controladores/pruebas/m7-rebaseline-definitivo.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
### Evidencia textual
- `'cuentas-pagar': { permisos: ['CU226', 'CU227'], titulo: 'Cuentas por Pagar', cargar: () => this.consultarCuentasPagar(consulta, permisos) },`
- `<Route path="dashboard-m7/cuentas-pagar" element={<Protegido permiso={['CU226','CU227']}><CuentasPagarM7 /></Protegido>} />`
- `['cuentasPagar', ['CU226', 'CU227'], () => this.consultarCuentasPagar(consulta, permisos)],`
- `assert.equal(permiteOperacion('consultarCuentasPagarM7', ['CU227']), true);`
## CU228
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | - Liquidez: naturalezas reales, monedas activas y CU228. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU228 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardM7/DeltaControladoM7.tsx; Vistas/src/views/DashboardM7/LiquidezM7.tsx; Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-cierre-hallazgos.test.cjs; Controladores/pruebas/m7-rebaseline-definitivo.test.cjs; Controladores/pruebas/m7-saldos-bancarios.test.cjs; Controladores/pruebas/ui-selectores-incidencias.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU229, CU230, CU231, CU232, CU240, CU241, CU243, CU244, CU249, CU251, CU254, CU255, CU256, CU257, CU258 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-cierre-hallazgos.test.cjs`
- `Controladores/pruebas/m7-rebaseline-definitivo.test.cjs`
- `Controladores/pruebas/m7-saldos-bancarios.test.cjs`
- `Controladores/pruebas/ui-selectores-incidencias.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardM7/DeltaControladoM7.tsx`
- `Vistas/src/views/DashboardM7/LiquidezM7.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `documentacion/CORRECCIONES_UI_OBSERVACIONES_VICHO_2026_10_12.md`
### Evidencia textual
- `- Liquidez: naturalezas reales, monedas activas y CU228.`
- `- Se agregó una consulta mínima `GET /dashboard-m7/liquidez/ajustes/catalogos`, protegida por CU228 y coordinada por `C_Finanzas`.`
- `<Route path="dashboard-m7/control" element={<Protegido permiso={['CU228','CU232','CU240','CU241','CU243','CU244','CU249','CU251','CU254','CU255','CU256','CU257','CU258']}><DeltaControladoM7 /></Protegido>} />`
- `<Route path="dashboard-m7/liquidez" element={<Protegido permiso={['CU228','CU229','CU230','CU231']}><LiquidezM7 /></Protegido>} />`
## CU229
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="dashboard-m7/liquidez" element={<Protegido permiso={['CU228','CU229','CU230','CU231']}><LiquidezM7 /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU229 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-rebaseline-definitivo.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU228, CU230, CU231 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-rebaseline-definitivo.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
### Evidencia textual
- `<Route path="dashboard-m7/liquidez" element={<Protegido permiso={['CU228','CU229','CU230','CU231']}><LiquidezM7 /></Protegido>} />`
- `['liquidez', ['CU228', 'CU229', 'CU230', 'CU231'], () => this.consultarLiquidez(consulta, permisos)],`
- `assert.equal(permiteOperacion('consultarLiquidezM7', ['CU229']), true);`
- `assert.equal(permiteOperacion('registrarAjusteLiquidezM7', ['CU229']), false);`
## CU230
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="dashboard-m7/liquidez" element={<Protegido permiso={['CU228','CU229','CU230','CU231']}><LiquidezM7 /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU230 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-cierre-hallazgos.test.cjs; Controladores/pruebas/m7-cu215-cu219.test.cjs; Controladores/pruebas/m7-historico-panel.test.cjs; Controladores/pruebas/m7-rebaseline-definitivo.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU228, CU229, CU231 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-cierre-hallazgos.test.cjs`
- `Controladores/pruebas/m7-cu215-cu219.test.cjs`
- `Controladores/pruebas/m7-historico-panel.test.cjs`
- `Controladores/pruebas/m7-rebaseline-definitivo.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
### Evidencia textual
- `<Route path="dashboard-m7/liquidez" element={<Protegido permiso={['CU228','CU229','CU230','CU231']}><LiquidezM7 /></Protegido>} />`
- `['liquidez', ['CU228', 'CU229', 'CU230', 'CU231'], () => this.consultarLiquidez(consulta, permisos)],`
- `assert.equal(operacionesPermiso.consultarLiquidezM7, 'CU230');`
- `await t.test('17 CU230 agrupa por día', () => assert.equal(flujo.flujoHistorico.valor.granularidad, 'dia'));`
## CU231
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="dashboard-m7/liquidez" element={<Protegido permiso={['CU228','CU229','CU230','CU231']}><LiquidezM7 /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU231 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-cierre-hallazgos.test.cjs; Controladores/pruebas/m7-cu215-cu219.test.cjs; Controladores/pruebas/m7-cu222-cu237.test.cjs; Controladores/pruebas/m7-rebaseline-definitivo.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU228, CU229, CU230 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-cierre-hallazgos.test.cjs`
- `Controladores/pruebas/m7-cu215-cu219.test.cjs`
- `Controladores/pruebas/m7-cu222-cu237.test.cjs`
- `Controladores/pruebas/m7-rebaseline-definitivo.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
### Evidencia textual
- `<Route path="dashboard-m7/liquidez" element={<Protegido permiso={['CU228','CU229','CU230','CU231']}><LiquidezM7 /></Protegido>} />`
- `['liquidez', ['CU228', 'CU229', 'CU230', 'CU231'], () => this.consultarLiquidez(consulta, permisos)],`
- `alertas = indicador('DATOS_INSUFICIENTES', null, 'CU231 no dispone de una serie válida de liquidez proyectada');`
- `assert.equal(permiteOperacion('consultarLiquidezM7', ['CU231']), true);`
## CU232
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU232', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU232 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardM7/DeltaControladoM7.tsx; Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/Mantenedores/Mantenedores.tsx; Vistas/src/views/Mantenedores/permisos.ts |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-cierre-hallazgos.test.cjs; Controladores/pruebas/m7-cu222-cu237.test.cjs; Controladores/pruebas/m7-delta-controlado.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU228, CU240, CU241, CU243, CU244, CU249, CU251, CU254, CU255, CU256, CU257, CU258 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-cierre-hallazgos.test.cjs`
- `Controladores/pruebas/m7-cu222-cu237.test.cjs`
- `Controladores/pruebas/m7-delta-controlado.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardM7/DeltaControladoM7.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/Mantenedores/Mantenedores.tsx`
- `Vistas/src/views/Mantenedores/permisos.ts`
### Evidencia textual
- `'CU232',`
- `<Route path="dashboard-m7/control" element={<Protegido permiso={['CU228','CU232','CU240','CU241','CU243','CU244','CU249','CU251','CU254','CU255','CU256','CU257','CU258']}><DeltaControladoM7 /></Protegido>} />`
- `<Route path="dashboard-m7/riesgo-deficit" element={<Protegido permiso="CU232"><RiesgoDeficitM7 /></Protegido>} />`
- `['riesgoDeficit', ['CU232'], () => this.consultarRiesgoDeficit(consulta, permisos)],`
## CU233
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="dashboard-m7/margen-proyectos" element={<Protegido permiso={['CU233','CU234','CU235']}><MargenProyectosM7 /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU233 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-cu215-cu219.test.cjs; Controladores/pruebas/m7-cu216-cu221.test.cjs; Controladores/pruebas/m7-cu220-cu224.test.cjs; Controladores/pruebas/m7-cu246.test.cjs; Controladores/pruebas/m7-rebaseline-definitivo.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU234, CU235 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-cu215-cu219.test.cjs`
- `Controladores/pruebas/m7-cu216-cu221.test.cjs`
- `Controladores/pruebas/m7-cu220-cu224.test.cjs`
- `Controladores/pruebas/m7-cu246.test.cjs`
- `Controladores/pruebas/m7-rebaseline-definitivo.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
### Evidencia textual
- `<Route path="dashboard-m7/margen-proyectos" element={<Protegido permiso={['CU233','CU234','CU235']}><MargenProyectosM7 /></Protegido>} />`
- `['margenProyectos', ['CU233', 'CU234', 'CU235'], () => this.consultarMargenProyectos(consulta, permisos)],`
- `assert.equal(operacionesPermiso.consultarMargenProyectosM7, 'CU233');`
- `await t.test('04 sin configuración CU233 queda pendiente', async () => { const margen = await modulo.consultarMargenProyectos({ anio: 2042, mes: 4 }); assert.equal(margen.umbralMargen.estado, 'CONFIGURACION_PENDIENTE'); });`
## CU234
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="dashboard-m7/margen-proyectos" element={<Protegido permiso={['CU233','CU234','CU235']}><MargenProyectosM7 /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU234 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-cu222-cu237.test.cjs; Controladores/pruebas/m7-rebaseline-definitivo.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU233, CU235, CU236 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-cu222-cu237.test.cjs`
- `Controladores/pruebas/m7-rebaseline-definitivo.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
### Evidencia textual
- `<Route path="dashboard-m7/margen-proyectos" element={<Protegido permiso={['CU233','CU234','CU235']}><MargenProyectosM7 /></Protegido>} />`
- `['margenProyectos', ['CU233', 'CU234', 'CU235'], () => this.consultarMargenProyectos(consulta, permisos)],`
- `assert.equal(permiteOperacion('consultarMargenProyectosM7', ['CU234']), true);`
- `await t.test('29 CU236 no concede CU234 CU235', () => { assert.equal(Object.hasOwn(filaProyecto, 'desgloseIngresos'), false); assert.equal(Object.hasOwn(filaProyecto, 'desgloseCostos'), false); });`
## CU235
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="dashboard-m7/margen-proyectos" element={<Protegido permiso={['CU233','CU234','CU235']}><MargenProyectosM7 /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU235 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-cu222-cu237.test.cjs; Controladores/pruebas/m7-rebaseline-definitivo.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU233, CU234, CU236 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-cu222-cu237.test.cjs`
- `Controladores/pruebas/m7-rebaseline-definitivo.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
### Evidencia textual
- `<Route path="dashboard-m7/margen-proyectos" element={<Protegido permiso={['CU233','CU234','CU235']}><MargenProyectosM7 /></Protegido>} />`
- `['margenProyectos', ['CU233', 'CU234', 'CU235'], () => this.consultarMargenProyectos(consulta, permisos)],`
- `assert.equal(permiteOperacion('consultarMargenProyectosM7', ['CU235']), true);`
- `await t.test('29 CU236 no concede CU234 CU235', () => { assert.equal(Object.hasOwn(filaProyecto, 'desgloseIngresos'), false); assert.equal(Object.hasOwn(filaProyecto, 'desgloseCostos'), false); });`
## CU236
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="dashboard-m7/proyectos/exposicion" element={<Protegido permiso="CU236"><ExposicionProyectosM7 /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU236 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-cu222-cu237.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU234, CU235, CU237 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-cu222-cu237.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
### Evidencia textual
- `<Route path="dashboard-m7/proyectos/exposicion" element={<Protegido permiso="CU236"><ExposicionProyectosM7 /></Protegido>} />`
- `['exposicionProyectos', ['CU236'], () => this.consultarExposicionProyectos(consulta, permisos)],`
- `await t.test('29 CU236 no concede CU234 CU235', () => { assert.equal(Object.hasOwn(filaProyecto, 'desgloseIngresos'), false); assert.equal(Object.hasOwn(filaProyecto, 'desgloseCostos'), false); });`
- `const contextoFinanciero = await modulo.consultarContextoProyecto(proyectoAbierto.id_proyecto_financiero, consulta, ['CU237', 'CU236']);`
## CU237
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="dashboard-m7/proyectos/:id" element={<Protegido permiso="CU237"><ContextoProyectoM7 /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU237 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-cu222-cu237.test.cjs; Controladores/pruebas/m7-ventas-familia-navegacion.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU236 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-cu222-cu237.test.cjs`
- `Controladores/pruebas/m7-ventas-familia-navegacion.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
### Evidencia textual
- `<Route path="dashboard-m7/proyectos/:id" element={<Protegido permiso="CU237"><ContextoProyectoM7 /></Protegido>} />`
- `assert.match(backend, /permisos\.includes\('CU237'\)/);`
- `await t.test('30 CU237 no concede permisos operacionales', () => { assert.equal(operacionesPermiso.consultarContextoProyectoM7, 'CU237'); assert.equal(permiteOperacion('listarVisitasTerreno', ['CU237']), false); });`
- `const contextoFinanciero = await modulo.consultarContextoProyecto(proyectoAbierto.id_proyecto_financiero, consulta, ['CU237', 'CU236']);`
## CU238
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="dashboard-m7/resumenes" element={<Protegido permiso={['CU238','CU239']}><ResumenesM7 /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU238 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardM7/PanelGeneralM7.tsx; Vistas/src/views/DashboardM7/ResumenesM7.tsx; Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-cobertura-ebitda.test.cjs; Controladores/pruebas/m7-historico-panel.test.cjs; Controladores/pruebas/m7-presupuesto-resultados.test.cjs; Controladores/pruebas/m7-rebaseline-definitivo.test.cjs; Controladores/pruebas/m7-ventas-familia-navegacion.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU239 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-cobertura-ebitda.test.cjs`
- `Controladores/pruebas/m7-historico-panel.test.cjs`
- `Controladores/pruebas/m7-presupuesto-resultados.test.cjs`
- `Controladores/pruebas/m7-rebaseline-definitivo.test.cjs`
- `Controladores/pruebas/m7-ventas-familia-navegacion.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardM7/PanelGeneralM7.tsx`
- `Vistas/src/views/DashboardM7/ResumenesM7.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
### Evidencia textual
- `<Route path="dashboard-m7/resumenes" element={<Protegido permiso={['CU238','CU239']}><ResumenesM7 /></Protegido>} />`
- `['resumenResultados', ['CU238'], () => this.consultarResumenResultados(consulta)],`
- `assert.equal(operacionesPermiso.consultarResumenResultadosM7, 'CU238');`
- `assert.match(panel, /sesion\?\.permisos\.includes\('CU238'\)/);`
## CU239
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="dashboard-m7/resumenes" element={<Protegido permiso={['CU238','CU239']}><ResumenesM7 /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU239 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardM7/ResumenesM7.tsx; Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-rebaseline-definitivo.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU238 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-rebaseline-definitivo.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardM7/ResumenesM7.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
### Evidencia textual
- `<Route path="dashboard-m7/resumenes" element={<Protegido permiso={['CU238','CU239']}><ResumenesM7 /></Protegido>} />`
- `['situacionFinanciera', ['CU239'], () => this.consultarSituacionFinanciera(consulta)],`
- `assert.equal(operacionesPermiso.consultarSituacionFinancieraM7, 'CU239');`
- `situacion: { permisos: ['CU239'], titulo: 'Situación financiera resumida', cargar: () => this.consultarSituacionFinanciera(consulta) },`
## CU240
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="dashboard-m7/control" element={<Protegido permiso={['CU228','CU232','CU240','CU241','CU243','CU244','CU249','CU251','CU254','CU255','CU256','CU257','CU258']}><DeltaControladoM7 /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU240 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardM7/DeltaControladoM7.tsx; Vistas/src/views/DashboardM7/PanelGeneralM7.tsx; Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-credito-ejecutivo.test.cjs; Controladores/pruebas/m7-delta-controlado.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU228, CU232, CU241, CU243, CU244, CU249, CU251, CU254, CU255, CU256, CU257, CU258 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-credito-ejecutivo.test.cjs`
- `Controladores/pruebas/m7-delta-controlado.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardM7/DeltaControladoM7.tsx`
- `Vistas/src/views/DashboardM7/PanelGeneralM7.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
### Evidencia textual
- `<Route path="dashboard-m7/control" element={<Protegido permiso={['CU228','CU232','CU240','CU241','CU243','CU244','CU249','CU251','CU254','CU255','CU256','CU257','CU258']}><DeltaControladoM7 /></Protegido>} />`
- `['exposicionCredito', ['CU240'], () => this.consultarExposicionCreditoM7(consulta)],`
- `assert.match(m7, /\['exposicionCredito',\s*\['CU240'\]/);`
- `assert.match(panel, /permisos\.includes\('CU240'\)/);`
## CU241
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="dashboard-m7/control" element={<Protegido permiso={['CU228','CU232','CU240','CU241','CU243','CU244','CU249','CU251','CU254','CU255','CU256','CU257','CU258']}><DeltaControladoM7 /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU241 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardM7/DeltaControladoM7.tsx; Vistas/src/views/DashboardM7/PanelGeneralM7.tsx; Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-credito-ejecutivo.test.cjs; Controladores/pruebas/m7-delta-controlado.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU228, CU232, CU240, CU243, CU244, CU249, CU251, CU254, CU255, CU256, CU257, CU258 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-credito-ejecutivo.test.cjs`
- `Controladores/pruebas/m7-delta-controlado.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardM7/DeltaControladoM7.tsx`
- `Vistas/src/views/DashboardM7/PanelGeneralM7.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
### Evidencia textual
- `<Route path="dashboard-m7/control" element={<Protegido permiso={['CU228','CU232','CU240','CU241','CU243','CU244','CU249','CU251','CU254','CU255','CU256','CU257','CU258']}><DeltaControladoM7 /></Protegido>} />`
- `['alertasCredito', ['CU241'], () => this.consultarAlertasCreditoM7(consulta)],`
- `assert.match(m7, /\['alertasCredito',\s*\['CU241'\]/);`
- `assert.match(panel, /permisos\.includes\('CU241'\)/);`
## CU242
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="dashboard-m7/operacion" element={<Protegido permiso={['CU242','CU247','CU248','CU250','CU252','CU253']}><OperacionCostosM7 /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU242 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardM7/OperacionCostosM7.tsx; Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-cu242-cu253.test.cjs; Controladores/pruebas/m7-historico-panel.test.cjs; Controladores/pruebas/m7-produccion-modelos.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU247, CU248, CU250, CU252, CU253 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-cu242-cu253.test.cjs`
- `Controladores/pruebas/m7-historico-panel.test.cjs`
- `Controladores/pruebas/m7-produccion-modelos.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardM7/OperacionCostosM7.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
### Evidencia textual
- `<Route path="dashboard-m7/operacion" element={<Protegido permiso={['CU242','CU247','CU248','CU250','CU252','CU253']}><OperacionCostosM7 /></Protegido>} />`
- `['costoRemuneraciones', ['CU242'], () => this.consultarCostoRemuneraciones(consulta)],`
- `await t.test('25 permiso de producción no expone costo sin CU242', () => { assert.equal(permiteOperacion('consultarProduccionModelosM7', ['CU247']), true); assert.match(bloque, /const puedeVerCostos = permisos\.includes\('CU242'\)/); });`
- `await t.test('33 CU242 no concede M6 individual',()=>assert.equal(operacionesPermiso.consultarCostoRemuneracionesM7,'CU242'));`
## CU243
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="dashboard-m7/control" element={<Protegido permiso={['CU228','CU232','CU240','CU241','CU243','CU244','CU249','CU251','CU254','CU255','CU256','CU257','CU258']}><DeltaControladoM7 /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU243 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardM7/DeltaControladoM7.tsx; Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-delta-controlado.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU228, CU232, CU240, CU241, CU244, CU249, CU251, CU254, CU255, CU256, CU257, CU258 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-delta-controlado.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardM7/DeltaControladoM7.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
### Evidencia textual
- `<Route path="dashboard-m7/control" element={<Protegido permiso={['CU228','CU232','CU240','CU241','CU243','CU244','CU249','CU251','CU254','CU255','CU256','CU257','CU258']}><DeltaControladoM7 /></Protegido>} />`
- `['resumenIva', ['CU243'], () => this.consultarResumenIva(consulta)],`
- `consultarExposicionCreditoM7:'CU240', consultarAlertasCreditoM7:'CU241', consultarResumenIvaM7:'CU243', consultarCostosFabricacionM7:'CU244', consultarBloqueosEconomicosM7:'CU249', consultarMargenInstalacionesM7:'CU251',`
- `{ path: '/dashboard-m7/control', label: 'Control Financiero', icon: SearchCheck, permissions: ['CU228', 'CU232', 'CU240', 'CU241', 'CU243', 'CU244', 'CU249', 'CU251', 'CU254', 'CU255', 'CU256', 'CU257', 'CU258'] },`
## CU244
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU244', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU244 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardM7/DeltaControladoM7.tsx; Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/Mantenedores/Mantenedores.tsx; Vistas/src/views/Mantenedores/permisos.ts |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-delta-controlado.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU228, CU232, CU240, CU241, CU243, CU249, CU251, CU254, CU255, CU256, CU257, CU258 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-delta-controlado.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardM7/DeltaControladoM7.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/Mantenedores/Mantenedores.tsx`
- `Vistas/src/views/Mantenedores/permisos.ts`
### Evidencia textual
- `'CU244',`
- `<Route path="dashboard-m7/control" element={<Protegido permiso={['CU228','CU232','CU240','CU241','CU243','CU244','CU249','CU251','CU254','CU255','CU256','CU257','CU258']}><DeltaControladoM7 /></Protegido>} />`
- `['costosFabricacion', ['CU244'], () => this.consultarCostosFabricacion(consulta)],`
- `assert.equal(operacionesPermiso.configurarParametroLiquidezM7, 'CU232'); assert.equal(operacionesPermiso.configurarCostoInstalacionM7, 'CU244'); assert.equal(operacionesPermiso.configurarParametroStockInmovilM7, 'CU257');`
## CU245
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | assert.equal(operacionesPermiso.descargarPdfDashboardM7, 'CU245'); |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Auditoria M9 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU245 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/DashboardM7/componentes.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | Controladores/pruebas/m9-productores-failclosed.test.cjs |
| 19. Pruebas | Controladores/pruebas/m7-cu220-cu224.test.cjs; Controladores/pruebas/m7-historico-panel.test.cjs; Controladores/pruebas/m7-rebaseline-definitivo.test.cjs; Controladores/pruebas/m9-productores-failclosed.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU233 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-cu220-cu224.test.cjs`
- `Controladores/pruebas/m7-historico-panel.test.cjs`
- `Controladores/pruebas/m7-rebaseline-definitivo.test.cjs`
- `Controladores/pruebas/m9-productores-failclosed.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/DashboardM7/componentes.tsx`
### Evidencia textual
- `assert.equal(operacionesPermiso.descargarPdfDashboardM7, 'CU245');`
- `await t.test('23 vista sin CU245 no descarga', async () => assert.rejects(modulo.descargarPdfContextual({ origen: 'margen', consulta }, ['CU233']), e => e.estado === 403));`
- `await t.test('24 CU245 sin permiso de origen no descarga', async () => assert.rejects(modulo.descargarPdfContextual({ origen: 'margen', consulta }, ['CU245']), e => e.estado === 403));`
- `await t.test('CU245 sin permiso del análisis de origen no descarga', async () => {`
## CU246
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU246', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU246 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardM7/LiquidezM7.tsx; Vistas/src/views/DashboardM7/PresupuestoResultadosM7.tsx; Vistas/src/views/DashboardM7/ResumenesM7.tsx; Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/MantenedorParametros/MantenedorParametros.tsx; Vistas/src/views/Mantenedores/Mantenedores.tsx; Vistas/src/views/Mantenedores/permisos.ts |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu167-cu171.test.cjs; Controladores/pruebas/m7-cierre-hallazgos.test.cjs; Controladores/pruebas/m7-cobertura-ebitda.test.cjs; Controladores/pruebas/m7-cu220-cu224.test.cjs; Controladores/pruebas/m7-cu246.test.cjs; Controladores/pruebas/m7-historico-panel.test.cjs; Controladores/pruebas/m7-presupuesto-resultados.test.cjs; Controladores/pruebas/m7-rebaseline-definitivo.test.cjs; Controladores/pruebas/m7-saldos-bancarios.test.cjs; Controladores/pruebas/mantenedores-panel.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU167, CU168, CU169, CU170, CU171, CU268 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m6-cu167-cu171.test.cjs`
- `Controladores/pruebas/m7-cierre-hallazgos.test.cjs`
- `Controladores/pruebas/m7-cobertura-ebitda.test.cjs`
- `Controladores/pruebas/m7-cu220-cu224.test.cjs`
- `Controladores/pruebas/m7-cu246.test.cjs`
- `Controladores/pruebas/m7-historico-panel.test.cjs`
- `Controladores/pruebas/m7-presupuesto-resultados.test.cjs`
- `Controladores/pruebas/m7-rebaseline-definitivo.test.cjs`
- `Controladores/pruebas/m7-saldos-bancarios.test.cjs`
- `Controladores/pruebas/mantenedores-panel.test.cjs`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardM7/LiquidezM7.tsx`
- `Vistas/src/views/DashboardM7/PresupuestoResultadosM7.tsx`
- `Vistas/src/views/DashboardM7/ResumenesM7.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/MantenedorParametros/MantenedorParametros.tsx`
- `Vistas/src/views/Mantenedores/Mantenedores.tsx`
- `Vistas/src/views/Mantenedores/permisos.ts`
### Evidencia textual
- `'CU246',`
- `<Route path="parametros-remuneraciones" element={<Protegido permiso={['CU167','CU168','CU169','CU170','CU171','CU246','CU268']}><MantenedorParametros /></Protegido>} />`
- `assert.equal(operacionesPermiso.configurarUmbralMargenM7, 'CU246');`
- `assert.match(app, /\['CU167','CU168','CU169','CU170','CU171','CU246','CU268'\]/);`
## CU247
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="dashboard-m7/operacion" element={<Protegido permiso={['CU242','CU247','CU248','CU250','CU252','CU253']}><OperacionCostosM7 /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU247 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardM7/OperacionCostosM7.tsx; Vistas/src/views/DashboardM7/PanelGeneralM7.tsx; Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-cu242-cu253.test.cjs; Controladores/pruebas/m7-historico-panel.test.cjs; Controladores/pruebas/m7-produccion-modelos.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU242, CU248, CU250, CU252, CU253 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-cu242-cu253.test.cjs`
- `Controladores/pruebas/m7-historico-panel.test.cjs`
- `Controladores/pruebas/m7-produccion-modelos.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardM7/OperacionCostosM7.tsx`
- `Vistas/src/views/DashboardM7/PanelGeneralM7.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
### Evidencia textual
- `<Route path="dashboard-m7/operacion" element={<Protegido permiso={['CU242','CU247','CU248','CU250','CU252','CU253']}><OperacionCostosM7 /></Protegido>} />`
- `['ordenesTrabajo', ['CU247'], () => this.consultarOrdenesTrabajo(consulta)],`
- `await t.test('13 permiso operacional independiente',()=>assert.equal(operacionesPermiso.consultarOrdenesTrabajoM7,'CU247'));`
- `await t.test('25 permiso de producción no expone costo sin CU242', () => { assert.equal(permiteOperacion('consultarProduccionModelosM7', ['CU247']), true); assert.match(bloque, /const puedeVerCostos = permisos\.includes\('CU242'\)/); });`
## CU248
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="dashboard-m7/operacion" element={<Protegido permiso={['CU242','CU247','CU248','CU250','CU252','CU253']}><OperacionCostosM7 /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU248 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardM7/OperacionCostosM7.tsx; Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-cu242-cu253.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU242, CU247, CU250, CU252, CU253 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-cu242-cu253.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardM7/OperacionCostosM7.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
### Evidencia textual
- `<Route path="dashboard-m7/operacion" element={<Protegido permiso={['CU242','CU247','CU248','CU250','CU252','CU253']}><OperacionCostosM7 /></Protegido>} />`
- `['cargaOperacional', ['CU248'], () => this.consultarCargaOperacional(consulta)],`
- `await t.test('34 CU247 no concede CU248',()=>{assert.equal(operacionesPermiso.consultarOrdenesTrabajoM7,'CU247');assert.equal(operacionesPermiso.consultarCargaOperacionalM7,'CU248')});`
- `await t.test('35 CU248 no concede CU250',()=>assert.equal(operacionesPermiso.consultarInstalacionesM7,'CU250'));`
## CU249
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="dashboard-m7/control" element={<Protegido permiso={['CU228','CU232','CU240','CU241','CU243','CU244','CU249','CU251','CU254','CU255','CU256','CU257','CU258']}><DeltaControladoM7 /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU249 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardM7/DeltaControladoM7.tsx; Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-delta-controlado.test.cjs; Controladores/pruebas/m7-rebaseline-definitivo.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU228, CU232, CU240, CU241, CU243, CU244, CU251, CU254, CU255, CU256, CU257, CU258 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-delta-controlado.test.cjs`
- `Controladores/pruebas/m7-rebaseline-definitivo.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardM7/DeltaControladoM7.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
### Evidencia textual
- `<Route path="dashboard-m7/control" element={<Protegido permiso={['CU228','CU232','CU240','CU241','CU243','CU244','CU249','CU251','CU254','CU255','CU256','CU257','CU258']}><DeltaControladoM7 /></Protegido>} />`
- `['bloqueosEconomicos', ['CU249'], () => this.consultarBloqueosEconomicosM7(consulta)],`
- `assert.doesNotMatch(fuentes, /CU249-PRE/);`
- `consultarExposicionCreditoM7:'CU240', consultarAlertasCreditoM7:'CU241', consultarResumenIvaM7:'CU243', consultarCostosFabricacionM7:'CU244', consultarBloqueosEconomicosM7:'CU249', consultarMargenInstalacionesM7:'CU251',`
## CU250
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="dashboard-m7/operacion" element={<Protegido permiso={['CU242','CU247','CU248','CU250','CU252','CU253']}><OperacionCostosM7 /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU250 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardM7/OperacionCostosM7.tsx; Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-cu242-cu253.test.cjs; Controladores/pruebas/m7-cu252.test.cjs; Controladores/pruebas/m7-historico-panel.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU242, CU247, CU248, CU252, CU253 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-cu242-cu253.test.cjs`
- `Controladores/pruebas/m7-cu252.test.cjs`
- `Controladores/pruebas/m7-historico-panel.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardM7/OperacionCostosM7.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
### Evidencia textual
- `<Route path="dashboard-m7/operacion" element={<Protegido permiso={['CU242','CU247','CU248','CU250','CU252','CU253']}><OperacionCostosM7 /></Protegido>} />`
- `['instalaciones', ['CU250'], () => this.consultarInstalaciones(consulta)],`
- `await t.test('13 CU250 no concede CU252', () => { assert.equal(operacionesPermiso.consultarAtrasosInstalacionesM7, 'CU252'); assert.equal(permiteOperacion('consultarAtrasosInstalacionesM7', ['CU250']), false); });`
- `await t.test('18 fallo CU252 no tumba CU250 ni CU253', async () => {`
## CU251
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="dashboard-m7/control" element={<Protegido permiso={['CU228','CU232','CU240','CU241','CU243','CU244','CU249','CU251','CU254','CU255','CU256','CU257','CU258']}><DeltaControladoM7 /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU251 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardM7/DeltaControladoM7.tsx; Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-delta-controlado.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU228, CU232, CU240, CU241, CU243, CU244, CU249, CU254, CU255, CU256, CU257, CU258 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-delta-controlado.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardM7/DeltaControladoM7.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
### Evidencia textual
- `<Route path="dashboard-m7/control" element={<Protegido permiso={['CU228','CU232','CU240','CU241','CU243','CU244','CU249','CU251','CU254','CU255','CU256','CU257','CU258']}><DeltaControladoM7 /></Protegido>} />`
- `['margenInstalaciones', ['CU251'], () => this.consultarMargenInstalaciones(consulta)],`
- `consultarExposicionCreditoM7:'CU240', consultarAlertasCreditoM7:'CU241', consultarResumenIvaM7:'CU243', consultarCostosFabricacionM7:'CU244', consultarBloqueosEconomicosM7:'CU249', consultarMargenInstalacionesM7:'CU251',`
- `{ path: '/dashboard-m7/control', label: 'Control Financiero', icon: SearchCheck, permissions: ['CU228', 'CU232', 'CU240', 'CU241', 'CU243', 'CU244', 'CU249', 'CU251', 'CU254', 'CU255', 'CU256', 'CU257', 'CU258'] },`
## CU252
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="dashboard-m7/operacion" element={<Protegido permiso={['CU242','CU247','CU248','CU250','CU252','CU253']}><OperacionCostosM7 /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU252 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardM7/OperacionCostosM7.tsx; Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-cu252.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU242, CU247, CU248, CU250, CU253 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-cu252.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardM7/OperacionCostosM7.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
### Evidencia textual
- `<Route path="dashboard-m7/operacion" element={<Protegido permiso={['CU242','CU247','CU248','CU250','CU252','CU253']}><OperacionCostosM7 /></Protegido>} />`
- `['atrasosInstalaciones', ['CU252'], () => this.consultarAtrasosInstalaciones(consulta)],`
- `await t.test('13 CU250 no concede CU252', () => { assert.equal(operacionesPermiso.consultarAtrasosInstalacionesM7, 'CU252'); assert.equal(permiteOperacion('consultarAtrasosInstalacionesM7', ['CU250']), false); });`
- `await t.test('14 CU253 no concede CU252', () => assert.equal(permiteOperacion('consultarAtrasosInstalacionesM7', ['CU253']), false));`
## CU253
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="dashboard-m7/operacion" element={<Protegido permiso={['CU242','CU247','CU248','CU250','CU252','CU253']}><OperacionCostosM7 /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU253 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardM7/OperacionCostosM7.tsx; Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-cu242-cu253.test.cjs; Controladores/pruebas/m7-cu252.test.cjs; Controladores/pruebas/m7-historico-panel.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU242, CU247, CU248, CU250, CU252 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-cu242-cu253.test.cjs`
- `Controladores/pruebas/m7-cu252.test.cjs`
- `Controladores/pruebas/m7-historico-panel.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardM7/OperacionCostosM7.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
### Evidencia textual
- `<Route path="dashboard-m7/operacion" element={<Protegido permiso={['CU242','CU247','CU248','CU250','CU252','CU253']}><OperacionCostosM7 /></Protegido>} />`
- `['incidenciasRetrabajos', ['CU253'], () => this.consultarIncidenciasRetrabajos(consulta)],`
- `await t.test('14 CU253 no concede CU252', () => assert.equal(permiteOperacion('consultarAtrasosInstalacionesM7', ['CU253']), false));`
- `await t.test('18 fallo CU252 no tumba CU250 ni CU253', async () => {`
## CU254
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="dashboard-m7/control" element={<Protegido permiso={['CU228','CU232','CU240','CU241','CU243','CU244','CU249','CU251','CU254','CU255','CU256','CU257','CU258']}><DeltaControladoM7 /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU254 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardM7/DeltaControladoM7.tsx; Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-delta-controlado.test.cjs; Controladores/pruebas/m7-integracion-inventario.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU228, CU232, CU240, CU241, CU243, CU244, CU249, CU251, CU255, CU256, CU257, CU258 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-delta-controlado.test.cjs`
- `Controladores/pruebas/m7-integracion-inventario.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardM7/DeltaControladoM7.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
### Evidencia textual
- `<Route path="dashboard-m7/control" element={<Protegido permiso={['CU228','CU232','CU240','CU241','CU243','CU244','CU249','CU251','CU254','CU255','CU256','CU257','CU258']}><DeltaControladoM7 /></Protegido>} />`
- `['inventarioValorizado', ['CU254'], () => this.consultarInventarioValorizado(consulta)],`
- `const permisos = { consultarInventarioValorizadoM7: 'CU254', consultarMaterialesProyectoOtM7: 'CU255', consultarRiesgoStockM7: 'CU256', consultarRotacionInventarioM7: 'CU257', consultarComprasRecepcionesM7: 'CU258' };`
- `const permisosInventario = ['CU254', 'CU255', 'CU256', 'CU257', 'CU258']; const inventarioCompleto = permisosInventario.every(tiene);`
## CU255
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="dashboard-m7/control" element={<Protegido permiso={['CU228','CU232','CU240','CU241','CU243','CU244','CU249','CU251','CU254','CU255','CU256','CU257','CU258']}><DeltaControladoM7 /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU255 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardM7/DeltaControladoM7.tsx; Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-delta-controlado.test.cjs; Controladores/pruebas/m7-integracion-inventario.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU228, CU232, CU240, CU241, CU243, CU244, CU249, CU251, CU254, CU256, CU257, CU258 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-delta-controlado.test.cjs`
- `Controladores/pruebas/m7-integracion-inventario.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardM7/DeltaControladoM7.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
### Evidencia textual
- `<Route path="dashboard-m7/control" element={<Protegido permiso={['CU228','CU232','CU240','CU241','CU243','CU244','CU249','CU251','CU254','CU255','CU256','CU257','CU258']}><DeltaControladoM7 /></Protegido>} />`
- `['materialesProyectoOt', ['CU255'], () => this.consultarMaterialesProyectoOt(consulta)],`
- `assert.equal(permiteOperacion('consultarRiesgoStockM7', ['CU255']), false);`
- `const permisos = { consultarInventarioValorizadoM7: 'CU254', consultarMaterialesProyectoOtM7: 'CU255', consultarRiesgoStockM7: 'CU256', consultarRotacionInventarioM7: 'CU257', consultarComprasRecepcionesM7: 'CU258' };`
## CU256
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="dashboard-m7/control" element={<Protegido permiso={['CU228','CU232','CU240','CU241','CU243','CU244','CU249','CU251','CU254','CU255','CU256','CU257','CU258']}><DeltaControladoM7 /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU256 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardM7/DeltaControladoM7.tsx; Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-delta-controlado.test.cjs; Controladores/pruebas/m7-integracion-inventario.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU228, CU232, CU240, CU241, CU243, CU244, CU249, CU251, CU254, CU255, CU257, CU258 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-delta-controlado.test.cjs`
- `Controladores/pruebas/m7-integracion-inventario.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardM7/DeltaControladoM7.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
### Evidencia textual
- `<Route path="dashboard-m7/control" element={<Protegido permiso={['CU228','CU232','CU240','CU241','CU243','CU244','CU249','CU251','CU254','CU255','CU256','CU257','CU258']}><DeltaControladoM7 /></Protegido>} />`
- `['riesgoStock', ['CU256'], () => this.consultarRiesgoStock(consulta)],`
- `const permisos = { consultarInventarioValorizadoM7: 'CU254', consultarMaterialesProyectoOtM7: 'CU255', consultarRiesgoStockM7: 'CU256', consultarRotacionInventarioM7: 'CU257', consultarComprasRecepcionesM7: 'CU258' };`
- `const permisosInventario = ['CU254', 'CU255', 'CU256', 'CU257', 'CU258']; const inventarioCompleto = permisosInventario.every(tiene);`
## CU257
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU257', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU257 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardM7/DeltaControladoM7.tsx; Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/Mantenedores/Mantenedores.tsx; Vistas/src/views/Mantenedores/permisos.ts |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-delta-controlado.test.cjs; Controladores/pruebas/m7-integracion-inventario.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU228, CU232, CU240, CU241, CU243, CU244, CU249, CU251, CU254, CU255, CU256, CU258 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-delta-controlado.test.cjs`
- `Controladores/pruebas/m7-integracion-inventario.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardM7/DeltaControladoM7.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/Mantenedores/Mantenedores.tsx`
- `Vistas/src/views/Mantenedores/permisos.ts`
### Evidencia textual
- `'CU257',`
- `<Route path="dashboard-m7/control" element={<Protegido permiso={['CU228','CU232','CU240','CU241','CU243','CU244','CU249','CU251','CU254','CU255','CU256','CU257','CU258']}><DeltaControladoM7 /></Protegido>} />`
- `['rotacionInventario', ['CU257'], () => this.consultarRotacionInventario(consulta)],`
- `assert.equal(operacionesPermiso.configurarParametroLiquidezM7, 'CU232'); assert.equal(operacionesPermiso.configurarCostoInstalacionM7, 'CU244'); assert.equal(operacionesPermiso.configurarParametroStockInmovilM7, 'CU257');`
## CU258
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | <Route path="dashboard-m7/control" element={<Protegido permiso={['CU228','CU232','CU240','CU241','CU243','CU244','CU249','CU251','CU254','CU255','CU256','CU257','CU258']}><DeltaControladoM7 /></Protegido>} /> |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Dashboard M7 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU258 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardM7/DeltaControladoM7.tsx; Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M7Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m7-cu215-cu219.test.cjs; Controladores/pruebas/m7-delta-controlado.test.cjs; Controladores/pruebas/m7-integracion-inventario.test.cjs; Controladores/pruebas/m7-rebaseline-definitivo.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU228, CU232, CU240, CU241, CU243, CU244, CU249, CU251, CU254, CU255, CU256, CU257 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m7-cu215-cu219.test.cjs`
- `Controladores/pruebas/m7-delta-controlado.test.cjs`
- `Controladores/pruebas/m7-integracion-inventario.test.cjs`
- `Controladores/pruebas/m7-rebaseline-definitivo.test.cjs`
- `Controladores/src/controladores/M7Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardM7/DeltaControladoM7.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
### Evidencia textual
- `<Route path="dashboard-m7/control" element={<Protegido permiso={['CU228','CU232','CU240','CU241','CU243','CU244','CU249','CU251','CU254','CU255','CU256','CU257','CU258']}><DeltaControladoM7 /></Protegido>} />`
- `['comprasRecepciones', ['CU258'], () => this.consultarComprasRecepciones(consulta, permisos)],`
- `assert.equal(codigosTodosLosCU[257], 'CU258');`
- `await t.test('23 rutas y frontend cubren CU240-CU258', () => {`
## CU259
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU259', TRUE, FALSE |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Auditoria M9 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU259 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M8Controller.ts |
| 14. Servicio | Controladores/src/m9/autorizacion.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/042_m8_solicitudes_crediticias/migration.sql |
| 18. Auditoria M9 | Controladores/src/m9/autorizacion.ts |
| 19. Pruebas | Controladores/pruebas/m7-cu215-cu219.test.cjs; Controladores/pruebas/m7-delta-controlado.test.cjs; Controladores/pruebas/m7-rebaseline-definitivo.test.cjs; Controladores/pruebas/m8-cu259.test.cjs; Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | Ninguna dependencia textual inequivoca detectada. |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/042_m8_solicitudes_crediticias/migration.sql`
- `Controladores/pruebas/m7-cu215-cu219.test.cjs`
- `Controladores/pruebas/m7-delta-controlado.test.cjs`
- `Controladores/pruebas/m7-rebaseline-definitivo.test.cjs`
- `Controladores/pruebas/m8-cu259.test.cjs`
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/controladores/M8Controller.ts`
- `Controladores/src/m9/autorizacion.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
### Evidencia textual
- `'CU259', TRUE, FALSE`
- `'M8', 'consultar solicitudes crediticias', 'Consulta de bandeja y detalle de solicitudes crediticias', 'CU259',`
- `<Route path="credito" element={<Protegido permiso="CU259"><SolicitudesCredito /></Protegido>} />`
- `<Route path="credito/solicitudes" element={<Protegido permiso="CU259"><SolicitudesCredito /></Protegido>} />`
## CU260
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | ('CU260','Crear y enviar solicitud inicial'),('CU261','Crear y enviar solicitud de excepción'),('CU262','Cancelar solicitud crediticia'), |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU260 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Credito/SolicitudesCredito.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M8Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/043_m8_credito_core/migration.sql |
| 18. Auditoria M9 | Controladores/pruebas/m9-productores-failclosed.test.cjs |
| 19. Pruebas | Controladores/pruebas/m8-cu260-cu274.test.cjs; Controladores/pruebas/m9-productores-failclosed.test.cjs; Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU261, CU262, CU263, CU264, CU265, CU266, CU267, CU268, CU269, CU270, CU271, CU272, CU273, CU274 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/043_m8_credito_core/migration.sql`
- `Controladores/pruebas/m8-cu260-cu274.test.cjs`
- `Controladores/pruebas/m9-productores-failclosed.test.cjs`
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/controladores/M8Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Credito/SolicitudesCredito.tsx`
### Evidencia textual
- `('CU260','Crear y enviar solicitud inicial'),('CU261','Crear y enviar solicitud de excepción'),('CU262','Cancelar solicitud crediticia'),`
- `CU260:S,CU261:S,CU262:GS,CU263:G,CU264:G,CU265:G,CU266:G,CU267:G,CU268:G,CU269:G,CU270:GSC,CU271:G,CU272:GSC,CU273:G,CU274:G,`
- `JOIN "terreno"."permiso" permiso ON permiso."codigo_m4" BETWEEN 'CU260' AND 'CU274'`
- `OR (perfil."codigo_m4"='secretaria' AND permiso."codigo_m4" IN ('CU260','CU261','CU262','CU270','CU272'))`
## CU261
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | ('CU260','Crear y enviar solicitud inicial'),('CU261','Crear y enviar solicitud de excepción'),('CU262','Cancelar solicitud crediticia'), |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU261 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Credito/SolicitudesCredito.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M8Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/043_m8_credito_core/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m8-cu260-cu274.test.cjs; Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU260, CU262, CU263, CU264, CU265, CU266, CU267, CU268, CU269, CU270, CU271, CU272, CU273, CU274 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/043_m8_credito_core/migration.sql`
- `Controladores/pruebas/m8-cu260-cu274.test.cjs`
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/controladores/M8Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Credito/SolicitudesCredito.tsx`
### Evidencia textual
- `('CU260','Crear y enviar solicitud inicial'),('CU261','Crear y enviar solicitud de excepción'),('CU262','Cancelar solicitud crediticia'),`
- `CU260:S,CU261:S,CU262:GS,CU263:G,CU264:G,CU265:G,CU266:G,CU267:G,CU268:G,CU269:G,CU270:GSC,CU271:G,CU272:GSC,CU273:G,CU274:G,`
- `OR (perfil."codigo_m4"='secretaria' AND permiso."codigo_m4" IN ('CU260','CU261','CU262','CU270','CU272'))`
- `crearSolicitudInicialM8:'CU260', crearSolicitudExcepcionM8:'CU261', cancelarSolicitudCreditoM8:'CU262',`
## CU262
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | ('CU260','Crear y enviar solicitud inicial'),('CU261','Crear y enviar solicitud de excepción'),('CU262','Cancelar solicitud crediticia'), |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU262 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Credito/SolicitudesCredito.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M8Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/043_m8_credito_core/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m8-cu260-cu274.test.cjs; Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU260, CU261, CU263, CU264, CU265, CU266, CU267, CU268, CU269, CU270, CU271, CU272, CU273, CU274 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/043_m8_credito_core/migration.sql`
- `Controladores/pruebas/m8-cu260-cu274.test.cjs`
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/controladores/M8Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Credito/SolicitudesCredito.tsx`
### Evidencia textual
- `('CU260','Crear y enviar solicitud inicial'),('CU261','Crear y enviar solicitud de excepción'),('CU262','Cancelar solicitud crediticia'),`
- `CU260:S,CU261:S,CU262:GS,CU263:G,CU264:G,CU265:G,CU266:G,CU267:G,CU268:G,CU269:G,CU270:GSC,CU271:G,CU272:GSC,CU273:G,CU274:G,`
- `OR (perfil."codigo_m4"='secretaria' AND permiso."codigo_m4" IN ('CU260','CU261','CU262','CU270','CU272'))`
- `WHERE (perfil."codigo_m4"='gerencia' AND permiso."codigo_m4" IN ('CU262','CU263','CU264','CU265','CU266','CU267','CU268','CU269','CU270','CU271','CU272','CU273','CU274'))`
## CU263
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | ('CU263','Resolver solicitud inicial'),('CU264','Resolver solicitud de excepción'),('CU265','Modificar cupo y vigencia'), |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU263 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Credito/SolicitudesCredito.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M8Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/043_m8_credito_core/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m8-cu260-cu274.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU260, CU261, CU262, CU264, CU265, CU266, CU267, CU268, CU269, CU270, CU271, CU272, CU273, CU274 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/043_m8_credito_core/migration.sql`
- `Controladores/pruebas/m8-cu260-cu274.test.cjs`
- `Controladores/src/controladores/M8Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Credito/SolicitudesCredito.tsx`
### Evidencia textual
- `('CU263','Resolver solicitud inicial'),('CU264','Resolver solicitud de excepción'),('CU265','Modificar cupo y vigencia'),`
- `CU260:S,CU261:S,CU262:GS,CU263:G,CU264:G,CU265:G,CU266:G,CU267:G,CU268:G,CU269:G,CU270:GSC,CU271:G,CU272:GSC,CU273:G,CU274:G,`
- `WHERE (perfil."codigo_m4"='gerencia' AND permiso."codigo_m4" IN ('CU262','CU263','CU264','CU265','CU266','CU267','CU268','CU269','CU270','CU271','CU272','CU273','CU274'))`
- `resolverSolicitudInicialM8:'CU263', resolverSolicitudExcepcionM8:'CU264', modificarCupoCreditoM8:'CU265',`
## CU264
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | ('CU263','Resolver solicitud inicial'),('CU264','Resolver solicitud de excepción'),('CU265','Modificar cupo y vigencia'), |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU264 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Credito/SolicitudesCredito.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M8Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/043_m8_credito_core/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m8-cu260-cu274.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU260, CU261, CU262, CU263, CU265, CU266, CU267, CU268, CU269, CU270, CU271, CU272, CU273, CU274 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/043_m8_credito_core/migration.sql`
- `Controladores/pruebas/m8-cu260-cu274.test.cjs`
- `Controladores/src/controladores/M8Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Credito/SolicitudesCredito.tsx`
### Evidencia textual
- `('CU263','Resolver solicitud inicial'),('CU264','Resolver solicitud de excepción'),('CU265','Modificar cupo y vigencia'),`
- `CU260:S,CU261:S,CU262:GS,CU263:G,CU264:G,CU265:G,CU266:G,CU267:G,CU268:G,CU269:G,CU270:GSC,CU271:G,CU272:GSC,CU273:G,CU274:G,`
- `WHERE (perfil."codigo_m4"='gerencia' AND permiso."codigo_m4" IN ('CU262','CU263','CU264','CU265','CU266','CU267','CU268','CU269','CU270','CU271','CU272','CU273','CU274'))`
- `resolverSolicitudInicialM8:'CU263', resolverSolicitudExcepcionM8:'CU264', modificarCupoCreditoM8:'CU265',`
## CU265
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | ('CU263','Resolver solicitud inicial'),('CU264','Resolver solicitud de excepción'),('CU265','Modificar cupo y vigencia'), |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU265 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Credito/CreditoCliente.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M8Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/043_m8_credito_core/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m8-cu260-cu274.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU260, CU261, CU262, CU263, CU264, CU266, CU267, CU268, CU269, CU270, CU271, CU272, CU273, CU274 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/043_m8_credito_core/migration.sql`
- `Controladores/pruebas/m8-cu260-cu274.test.cjs`
- `Controladores/src/controladores/M8Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Credito/CreditoCliente.tsx`
### Evidencia textual
- `('CU263','Resolver solicitud inicial'),('CU264','Resolver solicitud de excepción'),('CU265','Modificar cupo y vigencia'),`
- `CU260:S,CU261:S,CU262:GS,CU263:G,CU264:G,CU265:G,CU266:G,CU267:G,CU268:G,CU269:G,CU270:GSC,CU271:G,CU272:GSC,CU273:G,CU274:G,`
- `WHERE (perfil."codigo_m4"='gerencia' AND permiso."codigo_m4" IN ('CU262','CU263','CU264','CU265','CU266','CU267','CU268','CU269','CU270','CU271','CU272','CU273','CU274'))`
- `resolverSolicitudInicialM8:'CU263', resolverSolicitudExcepcionM8:'CU264', modificarCupoCreditoM8:'CU265',`
## CU266
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | ('CU266','Suspender Crédito'),('CU267','Reactivar Crédito'),('CU268','Configurar límite global'), |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU266 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Credito/CreditoCliente.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M8Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/043_m8_credito_core/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m8-cu260-cu274.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU260, CU261, CU262, CU263, CU264, CU265, CU267, CU268, CU269, CU270, CU271, CU272, CU273, CU274 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/043_m8_credito_core/migration.sql`
- `Controladores/pruebas/m8-cu260-cu274.test.cjs`
- `Controladores/src/controladores/M8Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Credito/CreditoCliente.tsx`
### Evidencia textual
- `('CU266','Suspender Crédito'),('CU267','Reactivar Crédito'),('CU268','Configurar límite global'),`
- `CU260:S,CU261:S,CU262:GS,CU263:G,CU264:G,CU265:G,CU266:G,CU267:G,CU268:G,CU269:G,CU270:GSC,CU271:G,CU272:GSC,CU273:G,CU274:G,`
- `WHERE (perfil."codigo_m4"='gerencia' AND permiso."codigo_m4" IN ('CU262','CU263','CU264','CU265','CU266','CU267','CU268','CU269','CU270','CU271','CU272','CU273','CU274'))`
- `suspenderCreditoM8:'CU266', reactivarCreditoM8:'CU267', configurarLimiteCreditoM8:'CU268',`
## CU267
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | ('CU266','Suspender Crédito'),('CU267','Reactivar Crédito'),('CU268','Configurar límite global'), |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU267 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Credito/CreditoCliente.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M8Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/043_m8_credito_core/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m8-cu260-cu274.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU260, CU261, CU262, CU263, CU264, CU265, CU266, CU268, CU269, CU270, CU271, CU272, CU273, CU274 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/043_m8_credito_core/migration.sql`
- `Controladores/pruebas/m8-cu260-cu274.test.cjs`
- `Controladores/src/controladores/M8Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Credito/CreditoCliente.tsx`
### Evidencia textual
- `('CU266','Suspender Crédito'),('CU267','Reactivar Crédito'),('CU268','Configurar límite global'),`
- `CU260:S,CU261:S,CU262:GS,CU263:G,CU264:G,CU265:G,CU266:G,CU267:G,CU268:G,CU269:G,CU270:GSC,CU271:G,CU272:GSC,CU273:G,CU274:G,`
- `WHERE (perfil."codigo_m4"='gerencia' AND permiso."codigo_m4" IN ('CU262','CU263','CU264','CU265','CU266','CU267','CU268','CU269','CU270','CU271','CU272','CU273','CU274'))`
- `suspenderCreditoM8:'CU266', reactivarCreditoM8:'CU267', configurarLimiteCreditoM8:'CU268',`
## CU268
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU268', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Credito M8 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU268 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/MantenedorParametros/MantenedorParametros.tsx; Vistas/src/views/Mantenedores/Mantenedores.tsx; Vistas/src/views/Mantenedores/permisos.ts |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M8Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/043_m8_credito_core/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m6-cu167-cu171.test.cjs; Controladores/pruebas/m8-cu260-cu274.test.cjs; Controladores/pruebas/mantenedores-panel.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU167, CU168, CU169, CU170, CU171, CU246, CU260, CU261, CU262, CU263, CU264, CU265, CU266, CU267, CU269, CU270, CU271, CU272, CU273, CU274 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/043_m8_credito_core/migration.sql`
- `Controladores/pruebas/m6-cu167-cu171.test.cjs`
- `Controladores/pruebas/m8-cu260-cu274.test.cjs`
- `Controladores/pruebas/mantenedores-panel.test.cjs`
- `Controladores/src/controladores/M8Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/MantenedorParametros/MantenedorParametros.tsx`
- `Vistas/src/views/Mantenedores/Mantenedores.tsx`
- `Vistas/src/views/Mantenedores/permisos.ts`
### Evidencia textual
- `'CU268',`
- `('CU266','Suspender Crédito'),('CU267','Reactivar Crédito'),('CU268','Configurar límite global'),`
- `<Route path="parametros-remuneraciones" element={<Protegido permiso={['CU167','CU168','CU169','CU170','CU171','CU246','CU268']}><MantenedorParametros /></Protegido>} />`
- `CU260:S,CU261:S,CU262:GS,CU263:G,CU264:G,CU265:G,CU266:G,CU267:G,CU268:G,CU269:G,CU270:GSC,CU271:G,CU272:GSC,CU273:G,CU274:G,`
## CU269
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | ('CU269','Consultar exposición global'),('CU270','Consultar situación crediticia'),('CU271','Consultar historial crediticio'), |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU269 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Credito/SolicitudesCredito.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M8Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/043_m8_credito_core/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m8-cu260-cu274.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU260, CU261, CU262, CU263, CU264, CU265, CU266, CU267, CU268, CU270, CU271, CU272, CU273, CU274 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/043_m8_credito_core/migration.sql`
- `Controladores/pruebas/m8-cu260-cu274.test.cjs`
- `Controladores/src/controladores/M8Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Credito/SolicitudesCredito.tsx`
### Evidencia textual
- `('CU269','Consultar exposición global'),('CU270','Consultar situación crediticia'),('CU271','Consultar historial crediticio'),`
- `CU260:S,CU261:S,CU262:GS,CU263:G,CU264:G,CU265:G,CU266:G,CU267:G,CU268:G,CU269:G,CU270:GSC,CU271:G,CU272:GSC,CU273:G,CU274:G,`
- `WHERE (perfil."codigo_m4"='gerencia' AND permiso."codigo_m4" IN ('CU262','CU263','CU264','CU265','CU266','CU267','CU268','CU269','CU270','CU271','CU272','CU273','CU274'))`
- `consultarExposicionCreditoM8:'CU269', validarFormalizacionCreditoM8:'CU269', consultarSituacionCreditoM8:'CU270',`
## CU270
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | ('CU269','Consultar exposición global'),('CU270','Consultar situación crediticia'),('CU271','Consultar historial crediticio'), |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU270 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Credito/CreditoCliente.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M8Controller.ts |
| 14. Servicio | Controladores/src/m9/autorizacion.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/043_m8_credito_core/migration.sql |
| 18. Auditoria M9 | Controladores/src/m9/autorizacion.ts |
| 19. Pruebas | Controladores/pruebas/m8-cu260-cu274.test.cjs; Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU260, CU261, CU262, CU263, CU264, CU265, CU266, CU267, CU268, CU269, CU271, CU272, CU273, CU274 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/043_m8_credito_core/migration.sql`
- `Controladores/pruebas/m8-cu260-cu274.test.cjs`
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/controladores/M8Controller.ts`
- `Controladores/src/m9/autorizacion.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Credito/CreditoCliente.tsx`
### Evidencia textual
- `('CU269','Consultar exposición global'),('CU270','Consultar situación crediticia'),('CU271','Consultar historial crediticio'),`
- `CLIENTE_CREDITO:{permiso:'CU270',ruta:id=>`/credito/solicitudes?cliente=${encodeURIComponent(id)}`},`
- `CU260:S,CU261:S,CU262:GS,CU263:G,CU264:G,CU265:G,CU266:G,CU267:G,CU268:G,CU269:G,CU270:GSC,CU271:G,CU272:GSC,CU273:G,CU274:G,`
- `OR (perfil."codigo_m4"='contador' AND permiso."codigo_m4" IN ('CU270','CU272'))`
## CU271
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | ('CU269','Consultar exposición global'),('CU270','Consultar situación crediticia'),('CU271','Consultar historial crediticio'), |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU271 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Credito/CreditoCliente.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M8Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/043_m8_credito_core/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m8-cu260-cu274.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU260, CU261, CU262, CU263, CU264, CU265, CU266, CU267, CU268, CU269, CU270, CU272, CU273, CU274 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/043_m8_credito_core/migration.sql`
- `Controladores/pruebas/m8-cu260-cu274.test.cjs`
- `Controladores/src/controladores/M8Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Credito/CreditoCliente.tsx`
### Evidencia textual
- `('CU269','Consultar exposición global'),('CU270','Consultar situación crediticia'),('CU271','Consultar historial crediticio'),`
- `CU260:S,CU261:S,CU262:GS,CU263:G,CU264:G,CU265:G,CU266:G,CU267:G,CU268:G,CU269:G,CU270:GSC,CU271:G,CU272:GSC,CU273:G,CU274:G,`
- `WHERE (perfil."codigo_m4"='gerencia' AND permiso."codigo_m4" IN ('CU262','CU263','CU264','CU265','CU266','CU267','CU268','CU269','CU270','CU271','CU272','CU273','CU274'))`
- `await t.test('17 CU271 reconstruye hechos sin historial paralelo',async()=>{const h=await m.historialCliente(idFicha,A(actorG,['CU271']));assert.ok(h.eventos.some(x=>x.tipo==='SUSPENSION'));assert.ok(h.solicitudes.length>=3)});`
## CU272
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | ('CU272','Exportar Crédito contextual'),('CU273','Consultar distribución crediticia'),('CU274','Consultar composición del Crédito comprometido') |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU272 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Credito/CreditoCliente.tsx; Vistas/src/views/Credito/SolicitudesCredito.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M8Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/043_m8_credito_core/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m8-cu260-cu274.test.cjs; Controladores/pruebas/rf-vigente.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU260, CU261, CU262, CU263, CU264, CU265, CU266, CU267, CU268, CU269, CU270, CU271, CU273, CU274 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/043_m8_credito_core/migration.sql`
- `Controladores/pruebas/m8-cu260-cu274.test.cjs`
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/controladores/M8Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Credito/CreditoCliente.tsx`
- `Vistas/src/views/Credito/SolicitudesCredito.tsx`
### Evidencia textual
- `('CU272','Exportar Crédito contextual'),('CU273','Consultar distribución crediticia'),('CU274','Consultar composición del Crédito comprometido')`
- `CU260:S,CU261:S,CU262:GS,CU263:G,CU264:G,CU265:G,CU266:G,CU267:G,CU268:G,CU269:G,CU270:GSC,CU271:G,CU272:GSC,CU273:G,CU274:G,`
- `OR (perfil."codigo_m4"='contador' AND permiso."codigo_m4" IN ('CU270','CU272'))`
- `OR (perfil."codigo_m4"='secretaria' AND permiso."codigo_m4" IN ('CU260','CU261','CU262','CU270','CU272'))`
## CU273
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | ('CU272','Exportar Crédito contextual'),('CU273','Consultar distribución crediticia'),('CU274','Consultar composición del Crédito comprometido') |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU273 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M8Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/043_m8_credito_core/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m8-cu260-cu274.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU260, CU261, CU262, CU263, CU264, CU265, CU266, CU267, CU268, CU269, CU270, CU271, CU272, CU274 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/043_m8_credito_core/migration.sql`
- `Controladores/pruebas/m8-cu260-cu274.test.cjs`
- `Controladores/src/controladores/M8Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
### Evidencia textual
- `('CU272','Exportar Crédito contextual'),('CU273','Consultar distribución crediticia'),('CU274','Consultar composición del Crédito comprometido')`
- `CU260:S,CU261:S,CU262:GS,CU263:G,CU264:G,CU265:G,CU266:G,CU267:G,CU268:G,CU269:G,CU270:GSC,CU271:G,CU272:GSC,CU273:G,CU274:G,`
- `WHERE (perfil."codigo_m4"='gerencia' AND permiso."codigo_m4" IN ('CU262','CU263','CU264','CU265','CU266','CU267','CU268','CU269','CU270','CU271','CU272','CU273','CU274'))`
- `async distribucion(a:ActorCredito){autorizar(a,'CU273');return this.calcularDistribucion()}`
## CU274
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | ('CU272','Exportar Crédito contextual'),('CU273','Consultar distribución crediticia'),('CU274','Consultar composición del Crédito comprometido') |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU274 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Credito/CreditoCliente.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M8Controller.ts |
| 14. Servicio | Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/043_m8_credito_core/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m4.test.cjs; Controladores/pruebas/m7-cu215-cu219.test.cjs; Controladores/pruebas/m7-rebaseline-definitivo.test.cjs; Controladores/pruebas/m8-cu259.test.cjs; Controladores/pruebas/m8-cu260-cu274.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU260, CU261, CU262, CU263, CU264, CU265, CU266, CU267, CU268, CU269, CU270, CU271, CU272, CU273 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/043_m8_credito_core/migration.sql`
- `Controladores/pruebas/m4.test.cjs`
- `Controladores/pruebas/m7-cu215-cu219.test.cjs`
- `Controladores/pruebas/m7-rebaseline-definitivo.test.cjs`
- `Controladores/pruebas/m8-cu259.test.cjs`
- `Controladores/pruebas/m8-cu260-cu274.test.cjs`
- `Controladores/src/controladores/M8Controller.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Credito/CreditoCliente.tsx`
### Evidencia textual
- `('CU272','Exportar Crédito contextual'),('CU273','Consultar distribución crediticia'),('CU274','Consultar composición del Crédito comprometido')`
- `CU260:S,CU261:S,CU262:GS,CU263:G,CU264:G,CU265:G,CU266:G,CU267:G,CU268:G,CU269:G,CU270:GSC,CU271:G,CU272:GSC,CU273:G,CU274:G,`
- `JOIN "terreno"."permiso" permiso ON permiso."codigo_m4" BETWEEN 'CU260' AND 'CU274'`
- `WHERE (perfil."codigo_m4"='gerencia' AND permiso."codigo_m4" IN ('CU262','CU263','CU264','CU265','CU266','CU267','CU268','CU269','CU270','CU271','CU272','CU273','CU274'))`
## CU275
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | await t.test('23 CU275 no existe y F047 no tiene umbral hardcodeado',()=>{assert.equal(codigosTodosLosCU.includes('CU275'),false);assert.equal(Object.hasOwn(operacionesPermiso,'CU275'),false)}); |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Credito M8 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU275 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | NO CONFIRMADO EN EL REPOSITORIO |
| 15. Validaciones | NO CONFIRMADO EN EL REPOSITORIO |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | NO CONFIRMADO EN EL REPOSITORIO |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m8-cu260-cu274.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | Ninguna dependencia textual inequivoca detectada. |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/pruebas/m8-cu260-cu274.test.cjs`
### Evidencia textual
- `await t.test('23 CU275 no existe y F047 no tiene umbral hardcodeado',()=>{assert.equal(codigosTodosLosCU.includes('CU275'),false);assert.equal(Object.hasOwn(operacionesPermiso,'CU275'),false)});`
## CU355
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU355', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU355 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx; Vistas/src/views/FichaEmpleado/FichaEmpleado.tsx; Vistas/src/views/Mantenedores/permisos.ts |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | Controladores/src/controladores/C_Finanzas.ts |
| 13. Controlador | Controladores/src/controladores/C_Finanzas.ts |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; Vistas/src/views/Seguridad/permisosM4.test.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/045_m9_permisos_auditoria/migration.sql |
| 18. Auditoria M9 | Controladores/prisma/migrations/045_m9_permisos_auditoria/migration.sql; Controladores/pruebas/m9-autorizacion-e2e.test.cjs; Vistas/src/views/Auditoria/Auditoria.test.tsx |
| 19. Pruebas | Controladores/pruebas/c3-5-obra-proyecto-http.test.cjs; Controladores/pruebas/c4-2-permisos-midas.test.cjs; Controladores/pruebas/c4-3-documental-real.test.cjs; Controladores/pruebas/m4-permisos-funcionales.test.cjs; Controladores/pruebas/m4.test.cjs; Controladores/pruebas/m6-historial-remuneracional.test.cjs; Controladores/pruebas/m9-autorizacion-e2e.test.cjs; Controladores/pruebas/rf-vigente.test.cjs; Vistas/src/views/Auditoria/Auditoria.test.tsx; Vistas/src/views/Seguridad/permisosM4.test.ts |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU74, CU359, CU360, CU378, CU379, CU380, CU381 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/045_m9_permisos_auditoria/migration.sql`
- `Controladores/pruebas/c3-5-obra-proyecto-http.test.cjs`
- `Controladores/pruebas/c4-2-permisos-midas.test.cjs`
- `Controladores/pruebas/c4-3-documental-real.test.cjs`
- `Controladores/pruebas/m4-permisos-funcionales.test.cjs`
- `Controladores/pruebas/m4.test.cjs`
- `Controladores/pruebas/m6-historial-remuneracional.test.cjs`
- `Controladores/pruebas/m9-autorizacion-e2e.test.cjs`
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/Auditoria/Auditoria.test.tsx`
- `Vistas/src/views/DashboardWrapper/DashboardWrapper.tsx`
- `Vistas/src/views/FichaEmpleado/FichaEmpleado.tsx`
- `Vistas/src/views/Mantenedores/permisos.ts`
- `Vistas/src/views/Seguridad/permisosM4.test.ts`
### Evidencia textual
- `'CU355',`
- `'CU74','CU355','CU359','CU360','CU378','CU379','CU380','CU381',`
- `('M9', 'consultar auditoria', 'Consultar evidencia de Auditoría dentro del alcance autorizado', 'Consultar Auditoría', 'CU355', TRUE, FALSE),`
- `<Route path="auditoria" element={<Protegido permiso="CU355"><Auditoria /></Protegido>} />`
## CU359
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU74','CU355','CU359','CU360','CU378','CU379','CU380','CU381', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU359 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Auditoria/Auditoria.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/045_m9_permisos_auditoria/migration.sql |
| 18. Auditoria M9 | Controladores/prisma/migrations/045_m9_permisos_auditoria/migration.sql; Controladores/pruebas/m9-autorizacion-e2e.test.cjs; Vistas/src/views/Auditoria/Auditoria.test.tsx; Vistas/src/views/Auditoria/Auditoria.tsx |
| 19. Pruebas | Controladores/pruebas/c4-2-permisos-midas.test.cjs; Controladores/pruebas/m4.test.cjs; Controladores/pruebas/m9-autorizacion-e2e.test.cjs; Controladores/pruebas/rf-vigente.test.cjs; Vistas/src/views/Auditoria/Auditoria.test.tsx |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU74, CU355, CU360, CU361, CU362, CU363, CU364, CU365, CU366, CU367, CU368, CU369, CU370, CU371, CU372, CU373, CU374, CU375, CU376, CU377, CU378, CU379, CU380, CU381 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/045_m9_permisos_auditoria/migration.sql`
- `Controladores/pruebas/c4-2-permisos-midas.test.cjs`
- `Controladores/pruebas/m4.test.cjs`
- `Controladores/pruebas/m9-autorizacion-e2e.test.cjs`
- `Controladores/pruebas/rf-vigente.test.cjs`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Auditoria/Auditoria.test.tsx`
- `Vistas/src/views/Auditoria/Auditoria.tsx`
### Evidencia textual
- `'CU74','CU355','CU359','CU360','CU378','CU379','CU380','CU381',`
- `('M9', 'exportar auditoria', 'Exportar evidencia de Auditoría dentro del alcance autorizado', 'Exportar Auditoría', 'CU359', TRUE, FALSE)`
- `CU355:'Consultar auditoría', CU359:'Exportar auditoría',`
- `CU355:GSC,CU359:GC,CU360:[],CU361:[],CU362:[],CU363:[],CU364:[],CU365:[],CU366:[],CU367:[],CU368:[],CU369:[],CU370:[],CU371:[],CU372:[],CU373:[],CU374:[],CU375:[],CU376:[],CU377:[],CU378:[],CU379:[],CU380:[],CU381:[],`
## CU360
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU360', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU360 |
| 8. Ruta frontend | Vistas/src/App.tsx |
| 9. Componente React | Vistas/src/views/Mantenedores/Mantenedores.tsx; Vistas/src/views/Mantenedores/permisos.ts |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/documental/seguridad/AutorizacionDocumental.ts; Controladores/src/documental/seguridad/MatrizCapacidadesDocumentales.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/pruebas/seguridad-comercial-c2-5.test.cjs; Controladores/pruebas/seguridad-integridad-documental.test.cjs; Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/documental/seguridad/AutorizacionDocumental.ts; Controladores/src/documental/seguridad/MatrizCapacidadesDocumentales.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; documentacion/C2_5_SEGURIDAD_M4_COMERCIAL_DOCUMENTAL.md; documentacion/CIERRE_SEGURIDAD_DOCUMENTAL_4_4_1.md; documentacion/SEGURIDAD_INTEGRIDAD_DOCUMENTAL.md |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/054_mantenedor_productos_comerciales/migration.sql; Controladores/prisma/migrations/068_permisos_comerciales_documentales_c2_6/migration.sql; Controladores/prisma/migrations/070_permisos_documentales_c4_2/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/c4-2-permisos-midas.test.cjs; Controladores/pruebas/c4-documentos-comerciales.test.cjs; Controladores/pruebas/catalogo-comercial-c1.test.cjs; Controladores/pruebas/catalogo-documental-c2.test.cjs; Controladores/pruebas/documentos-producto-backend.test.cjs; Controladores/pruebas/m2-productos-comerciales.test.cjs; Controladores/pruebas/m2-tareas-plantillas-fabricacion.test.cjs; Controladores/pruebas/m4.test.cjs; Controladores/pruebas/seguridad-comercial-c2-5.test.cjs; Controladores/pruebas/seguridad-integridad-documental.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU74, CU355, CU359, CU378, CU379, CU380, CU381 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/054_mantenedor_productos_comerciales/migration.sql`
- `Controladores/prisma/migrations/068_permisos_comerciales_documentales_c2_6/migration.sql`
- `Controladores/prisma/migrations/070_permisos_documentales_c4_2/migration.sql`
- `Controladores/pruebas/c4-2-permisos-midas.test.cjs`
- `Controladores/pruebas/c4-documentos-comerciales.test.cjs`
- `Controladores/pruebas/catalogo-comercial-c1.test.cjs`
- `Controladores/pruebas/catalogo-documental-c2.test.cjs`
- `Controladores/pruebas/documentos-producto-backend.test.cjs`
- `Controladores/pruebas/m2-productos-comerciales.test.cjs`
- `Controladores/pruebas/m2-tareas-plantillas-fabricacion.test.cjs`
- `Controladores/pruebas/m4.test.cjs`
- `Controladores/pruebas/seguridad-comercial-c2-5.test.cjs`
- `Controladores/pruebas/seguridad-integridad-documental.test.cjs`
- `Controladores/src/comercial/SeguridadCapacidadesComerciales.ts`
- `Controladores/src/documental/seguridad/AutorizacionDocumental.ts`
- `Controladores/src/documental/seguridad/MatrizCapacidadesDocumentales.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/App.tsx`
- `Vistas/src/views/Mantenedores/Mantenedores.tsx`
- `Vistas/src/views/Mantenedores/permisos.ts`
- `documentacion/BLOQUE_4_5A_INTERFAZ_DOCUMENTAL.md`
- `documentacion/BLOQUE_4_5B_1_INTEGRACION_BACKEND_DOCUMENTAL.md`
- `documentacion/BLOQUE_4_5B_2A_1_PORTABILIDAD_SEGURA_R2.md`
- `documentacion/BLOQUE_4_5B_2A_PREPARACION_ACTIVACION.md`
- `documentacion/C1_MANTENEDORES_COMERCIALES.md`
- `documentacion/C2_5_SEGURIDAD_M4_COMERCIAL_DOCUMENTAL.md`
- `documentacion/C2_CATALOGO_DOCUMENTAL_COTIZACIONES.md`
- `documentacion/CIERRE_SEGURIDAD_DOCUMENTAL_4_4_1.md`
- `documentacion/SEGURIDAD_INTEGRIDAD_DOCUMENTAL.md`
### Evidencia textual
- `'CU360',`
- `'CU74','CU355','CU359','CU360','CU378','CU379','CU380','CU381',`
- `('CU360', 'consultar catálogo comercial', 'Consultar familias y fichas comerciales de productos', 'Consultar productos comerciales'),`
- `- CU360: consultar metadatos.`
## CU361
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | ('CU361', 'crear catálogo comercial', 'Crear familias y fichas comerciales de productos', 'Crear productos comerciales'), |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU361 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Mantenedores/ProductosFamilias.tsx; Vistas/src/views/Mantenedores/TareasFabricacion.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/pruebas/seguridad-comercial-c2-5.test.cjs; Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; documentacion/C2_5_SEGURIDAD_M4_COMERCIAL_DOCUMENTAL.md |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/054_mantenedor_productos_comerciales/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m2-productos-comerciales.test.cjs; Controladores/pruebas/seguridad-comercial-c2-5.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU355, CU359, CU360, CU362, CU363, CU364, CU365, CU366, CU367, CU368, CU369, CU370, CU371, CU372, CU373, CU374, CU375, CU376, CU377, CU378, CU379, CU380, CU381 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/054_mantenedor_productos_comerciales/migration.sql`
- `Controladores/pruebas/m2-productos-comerciales.test.cjs`
- `Controladores/pruebas/seguridad-comercial-c2-5.test.cjs`
- `Controladores/src/comercial/SeguridadCapacidadesComerciales.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Mantenedores/ProductosFamilias.tsx`
- `Vistas/src/views/Mantenedores/TareasFabricacion.tsx`
- `documentacion/C2_5_SEGURIDAD_M4_COMERCIAL_DOCUMENTAL.md`
### Evidencia textual
- `('CU361', 'crear catálogo comercial', 'Crear familias y fichas comerciales de productos', 'Crear productos comerciales'),`
- `CU355:GSC,CU359:GC,CU360:[],CU361:[],CU362:[],CU363:[],CU364:[],CU365:[],CU366:[],CU367:[],CU368:[],CU369:[],CU370:[],CU371:[],CU372:[],CU373:[],CU374:[],CU375:[],CU376:[],CU377:[],CU378:[],CU379:[],CU380:[],CU381:[],`
- `CU360:'Ver catálogo comercial', CU361:'Crear productos, familias y tareas', CU362:'Editar productos, familias y plantillas',`
- `WHERE dependiente."codigo_m4" IN ('CU361','CU362','CU363','CU364','CU365','CU366','CU367')`
## CU362
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | ('CU362', 'modificar catálogo comercial', 'Modificar familias y borradores comerciales', 'Modificar productos comerciales'), |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU362 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Mantenedores/ProductosFamilias.tsx; Vistas/src/views/Mantenedores/TareasFabricacion.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/pruebas/seguridad-comercial-c2-5.test.cjs; Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; documentacion/C2_5_SEGURIDAD_M4_COMERCIAL_DOCUMENTAL.md |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/054_mantenedor_productos_comerciales/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/m2-productos-comerciales.test.cjs; Controladores/pruebas/m2-tareas-plantillas-fabricacion.test.cjs; Controladores/pruebas/seguridad-comercial-c2-5.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU355, CU359, CU360, CU361, CU363, CU364, CU365, CU366, CU367, CU368, CU369, CU370, CU371, CU372, CU373, CU374, CU375, CU376, CU377, CU378, CU379, CU380, CU381 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/054_mantenedor_productos_comerciales/migration.sql`
- `Controladores/pruebas/m2-productos-comerciales.test.cjs`
- `Controladores/pruebas/m2-tareas-plantillas-fabricacion.test.cjs`
- `Controladores/pruebas/seguridad-comercial-c2-5.test.cjs`
- `Controladores/src/comercial/SeguridadCapacidadesComerciales.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Mantenedores/ProductosFamilias.tsx`
- `Vistas/src/views/Mantenedores/TareasFabricacion.tsx`
- `documentacion/C2_5_SEGURIDAD_M4_COMERCIAL_DOCUMENTAL.md`
### Evidencia textual
- `('CU362', 'modificar catálogo comercial', 'Modificar familias y borradores comerciales', 'Modificar productos comerciales'),`
- `CU355:GSC,CU359:GC,CU360:[],CU361:[],CU362:[],CU363:[],CU364:[],CU365:[],CU366:[],CU367:[],CU368:[],CU369:[],CU370:[],CU371:[],CU372:[],CU373:[],CU374:[],CU375:[],CU376:[],CU377:[],CU378:[],CU379:[],CU380:[],CU381:[],`
- `CU360:'Ver catálogo comercial', CU361:'Crear productos, familias y tareas', CU362:'Editar productos, familias y plantillas',`
- `WHERE dependiente."codigo_m4" IN ('CU361','CU362','CU363','CU364','CU365','CU366','CU367')`
## CU363
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | ('CU363', 'desactivar catálogo comercial', 'Desactivar familias y fichas comerciales', 'Desactivar productos comerciales'), |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU363 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Mantenedores/ProductosFamilias.tsx; Vistas/src/views/Mantenedores/TareasFabricacion.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/054_mantenedor_productos_comerciales/migration.sql |
| 18. Auditoria M9 | Controladores/pruebas/m9-autorizacion-e2e.test.cjs |
| 19. Pruebas | Controladores/pruebas/m9-autorizacion-e2e.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU355, CU359, CU360, CU361, CU362, CU364, CU365, CU366, CU367, CU368, CU369, CU370, CU371, CU372, CU373, CU374, CU375, CU376, CU377, CU378, CU379, CU380, CU381 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/054_mantenedor_productos_comerciales/migration.sql`
- `Controladores/pruebas/m9-autorizacion-e2e.test.cjs`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Mantenedores/ProductosFamilias.tsx`
- `Vistas/src/views/Mantenedores/TareasFabricacion.tsx`
### Evidencia textual
- `('CU363', 'desactivar catálogo comercial', 'Desactivar familias y fichas comerciales', 'Desactivar productos comerciales'),`
- `CU355:GSC,CU359:GC,CU360:[],CU361:[],CU362:[],CU363:[],CU364:[],CU365:[],CU366:[],CU367:[],CU368:[],CU369:[],CU370:[],CU371:[],CU372:[],CU373:[],CU374:[],CU375:[],CU376:[],CU377:[],CU378:[],CU379:[],CU380:[],CU381:[],`
- `CU363:'Desactivar productos, familias y tareas', CU364:'Reactivar productos, familias y tareas', CU365:'Publicar versiones de producto y fabricación',`
- `WHERE dependiente."codigo_m4" IN ('CU361','CU362','CU363','CU364','CU365','CU366','CU367')`
## CU364
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | ('CU364', 'reactivar catálogo comercial', 'Reactivar familias y fichas comerciales', 'Reactivar productos comerciales'), |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU364 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Mantenedores/ProductosFamilias.tsx; Vistas/src/views/Mantenedores/TareasFabricacion.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/054_mantenedor_productos_comerciales/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | NO CONFIRMADO EN EL REPOSITORIO |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU355, CU359, CU360, CU361, CU362, CU363, CU365, CU366, CU367, CU368, CU369, CU370, CU371, CU372, CU373, CU374, CU375, CU376, CU377, CU378, CU379, CU380, CU381 |
| 23. Estado actual | REGISTRADO O REFERENCIADO; COBERTURA FOCAL NO ENLAZADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/054_mantenedor_productos_comerciales/migration.sql`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Mantenedores/ProductosFamilias.tsx`
- `Vistas/src/views/Mantenedores/TareasFabricacion.tsx`
### Evidencia textual
- `('CU364', 'reactivar catálogo comercial', 'Reactivar familias y fichas comerciales', 'Reactivar productos comerciales'),`
- `CU355:GSC,CU359:GC,CU360:[],CU361:[],CU362:[],CU363:[],CU364:[],CU365:[],CU366:[],CU367:[],CU368:[],CU369:[],CU370:[],CU371:[],CU372:[],CU373:[],CU374:[],CU375:[],CU376:[],CU377:[],CU378:[],CU379:[],CU380:[],CU381:[],`
- `CU363:'Desactivar productos, familias y tareas', CU364:'Reactivar productos, familias y tareas', CU365:'Publicar versiones de producto y fabricación',`
- `WHERE dependiente."codigo_m4" IN ('CU361','CU362','CU363','CU364','CU365','CU366','CU367')`
## CU365
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | ('CU365', 'publicar versión comercial', 'Publicar versiones inmutables de fichas comerciales', 'Publicar productos comerciales'), |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU365 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Mantenedores/ProductosFamilias.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/pruebas/seguridad-comercial-c2-5.test.cjs; Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; documentacion/C2_5_SEGURIDAD_M4_COMERCIAL_DOCUMENTAL.md |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/054_mantenedor_productos_comerciales/migration.sql |
| 18. Auditoria M9 | Controladores/pruebas/m9-autorizacion-e2e.test.cjs |
| 19. Pruebas | Controladores/pruebas/m2-productos-comerciales.test.cjs; Controladores/pruebas/m9-autorizacion-e2e.test.cjs; Controladores/pruebas/mantenedores-modal-ux.test.cjs; Controladores/pruebas/seguridad-comercial-c2-5.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU355, CU359, CU360, CU361, CU362, CU363, CU364, CU366, CU367, CU368, CU369, CU370, CU371, CU372, CU373, CU374, CU375, CU376, CU377, CU378, CU379, CU380, CU381 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/054_mantenedor_productos_comerciales/migration.sql`
- `Controladores/pruebas/m2-productos-comerciales.test.cjs`
- `Controladores/pruebas/m9-autorizacion-e2e.test.cjs`
- `Controladores/pruebas/mantenedores-modal-ux.test.cjs`
- `Controladores/pruebas/seguridad-comercial-c2-5.test.cjs`
- `Controladores/src/comercial/SeguridadCapacidadesComerciales.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Mantenedores/ProductosFamilias.tsx`
- `documentacion/C2_5_SEGURIDAD_M4_COMERCIAL_DOCUMENTAL.md`
### Evidencia textual
- `('CU365', 'publicar versión comercial', 'Publicar versiones inmutables de fichas comerciales', 'Publicar productos comerciales'),`
- `CU355:GSC,CU359:GC,CU360:[],CU361:[],CU362:[],CU363:[],CU364:[],CU365:[],CU366:[],CU367:[],CU368:[],CU369:[],CU370:[],CU371:[],CU372:[],CU373:[],CU374:[],CU375:[],CU376:[],CU377:[],CU378:[],CU379:[],CU380:[],CU381:[],`
- `CU363:'Desactivar productos, familias y tareas', CU364:'Reactivar productos, familias y tareas', CU365:'Publicar versiones de producto y fabricación',`
- `WHERE dependiente."codigo_m4" IN ('CU361','CU362','CU363','CU364','CU365','CU366','CU367')`
## CU366
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | ('CU366', 'administrar vínculos comerciales', 'Vincular fichas comerciales con Terreno e Inventario', 'Vincular productos comerciales'), |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU366 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Mantenedores/ProductosFamilias.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/pruebas/seguridad-comercial-c2-5.test.cjs; Controladores/pruebas/seguridad-integridad-documental.test.cjs; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; documentacion/C2_5_SEGURIDAD_M4_COMERCIAL_DOCUMENTAL.md; documentacion/CIERRE_SEGURIDAD_DOCUMENTAL_4_4_1.md; documentacion/SEGURIDAD_INTEGRIDAD_DOCUMENTAL.md |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/054_mantenedor_productos_comerciales/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/documentos-producto-backend.test.cjs; Controladores/pruebas/mantenedores-modal-ux.test.cjs; Controladores/pruebas/portabilidad-segura-r2-s3.test.cjs; Controladores/pruebas/seguridad-comercial-c2-5.test.cjs; Controladores/pruebas/seguridad-integridad-documental.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU355, CU359, CU360, CU361, CU362, CU363, CU364, CU365, CU367, CU368, CU369, CU370, CU371, CU372, CU373, CU374, CU375, CU376, CU377, CU378, CU379, CU380, CU381 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/054_mantenedor_productos_comerciales/migration.sql`
- `Controladores/pruebas/documentos-producto-backend.test.cjs`
- `Controladores/pruebas/mantenedores-modal-ux.test.cjs`
- `Controladores/pruebas/portabilidad-segura-r2-s3.test.cjs`
- `Controladores/pruebas/seguridad-comercial-c2-5.test.cjs`
- `Controladores/pruebas/seguridad-integridad-documental.test.cjs`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Mantenedores/ProductosFamilias.tsx`
- `documentacion/BLOQUE_4_5A_INTERFAZ_DOCUMENTAL.md`
- `documentacion/BLOQUE_4_5B_1_INTEGRACION_BACKEND_DOCUMENTAL.md`
- `documentacion/BLOQUE_4_5B_2A_1_PORTABILIDAD_SEGURA_R2.md`
- `documentacion/BLOQUE_4_5B_2A_PREPARACION_ACTIVACION.md`
- `documentacion/C2_5_SEGURIDAD_M4_COMERCIAL_DOCUMENTAL.md`
- `documentacion/C2_CATALOGO_DOCUMENTAL_COTIZACIONES.md`
- `documentacion/CIERRE_SEGURIDAD_DOCUMENTAL_4_4_1.md`
- `documentacion/SEGURIDAD_INTEGRIDAD_DOCUMENTAL.md`
### Evidencia textual
- `('CU366', 'administrar vínculos comerciales', 'Vincular fichas comerciales con Terreno e Inventario', 'Vincular productos comerciales'),`
- `- CU366: asociar producto.`
- `CU355:GSC,CU359:GC,CU360:[],CU361:[],CU362:[],CU363:[],CU364:[],CU365:[],CU366:[],CU367:[],CU368:[],CU369:[],CU370:[],CU371:[],CU372:[],CU373:[],CU374:[],CU375:[],CU376:[],CU377:[],CU378:[],CU379:[],CU380:[],CU381:[],`
- `CU366:'Vincular producto comercial', CU367:'Consultar historial comercial y documental', CU368:'Gestionar precios y servicios comerciales',`
## CU367
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | ('CU367', 'consultar historial comercial', 'Consultar versiones e historial del catálogo comercial', 'Consultar historial comercial') |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU367 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Mantenedores/ProductosFamilias.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/documental/seguridad/AutorizacionDocumental.ts; Controladores/src/documental/seguridad/MatrizCapacidadesDocumentales.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/pruebas/seguridad-comercial-c2-5.test.cjs; Controladores/pruebas/seguridad-integridad-documental.test.cjs; Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/documental/seguridad/AutorizacionDocumental.ts; Controladores/src/documental/seguridad/MatrizCapacidadesDocumentales.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; documentacion/C2_5_SEGURIDAD_M4_COMERCIAL_DOCUMENTAL.md; documentacion/CIERRE_SEGURIDAD_DOCUMENTAL_4_4_1.md; documentacion/SEGURIDAD_INTEGRIDAD_DOCUMENTAL.md |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/054_mantenedor_productos_comerciales/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/catalogo-documental-c2.test.cjs; Controladores/pruebas/documentos-producto-backend.test.cjs; Controladores/pruebas/m4.test.cjs; Controladores/pruebas/seguridad-comercial-c2-5.test.cjs; Controladores/pruebas/seguridad-integridad-documental.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | Ninguna dependencia textual inequivoca detectada. |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/054_mantenedor_productos_comerciales/migration.sql`
- `Controladores/pruebas/catalogo-documental-c2.test.cjs`
- `Controladores/pruebas/documentos-producto-backend.test.cjs`
- `Controladores/pruebas/m4.test.cjs`
- `Controladores/pruebas/seguridad-comercial-c2-5.test.cjs`
- `Controladores/pruebas/seguridad-integridad-documental.test.cjs`
- `Controladores/src/comercial/SeguridadCapacidadesComerciales.ts`
- `Controladores/src/documental/seguridad/AutorizacionDocumental.ts`
- `Controladores/src/documental/seguridad/MatrizCapacidadesDocumentales.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Mantenedores/ProductosFamilias.tsx`
- `documentacion/BLOQUE_4_5A_INTERFAZ_DOCUMENTAL.md`
- `documentacion/BLOQUE_4_5B_1_INTEGRACION_BACKEND_DOCUMENTAL.md`
- `documentacion/BLOQUE_4_5B_2A_1_PORTABILIDAD_SEGURA_R2.md`
- `documentacion/BLOQUE_4_5B_2A_PREPARACION_ACTIVACION.md`
- `documentacion/C2_5_SEGURIDAD_M4_COMERCIAL_DOCUMENTAL.md`
- `documentacion/C2_CATALOGO_DOCUMENTAL_COTIZACIONES.md`
- `documentacion/CIERRE_SEGURIDAD_DOCUMENTAL_4_4_1.md`
- `documentacion/SEGURIDAD_INTEGRIDAD_DOCUMENTAL.md`
### Evidencia textual
- `('CU367', 'consultar historial comercial', 'Consultar versiones e historial del catálogo comercial', 'Consultar historial comercial')`
- `- CU367: consultar historial.`
- `- Consulta de versiones e historial con CU367.`
- `CONSULTAR_HISTORIAL: 'CU367',`
## CU368
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | ('CU368','gestionar precios comerciales','Gestionar precios comerciales versionados','Gestionar precios comerciales'), |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU368 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Mantenedores/CatalogosComerciales.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/pruebas/seguridad-comercial-c2-5.test.cjs; Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; documentacion/C2_5_SEGURIDAD_M4_COMERCIAL_DOCUMENTAL.md |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/068_permisos_comerciales_documentales_c2_6/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/c4-3-documental-real.test.cjs; Controladores/pruebas/catalogo-comercial-c1.test.cjs; Controladores/pruebas/comercial-c2-7-integracion-pg18.test.cjs; Controladores/pruebas/cotizaciones-c3-3-pg18.test.cjs; Controladores/pruebas/permisos-comerciales-c2-6.test.cjs; Controladores/pruebas/seguridad-comercial-c2-5.test.cjs; Vistas/src/views/Mantenedores/CatalogosComerciales.test.tsx |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU355, CU359, CU360, CU361, CU362, CU363, CU364, CU365, CU366, CU367, CU369, CU370, CU371, CU372, CU373, CU374, CU375, CU376, CU377, CU378, CU379, CU380, CU381 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/068_permisos_comerciales_documentales_c2_6/migration.sql`
- `Controladores/pruebas/c4-3-documental-real.test.cjs`
- `Controladores/pruebas/catalogo-comercial-c1.test.cjs`
- `Controladores/pruebas/comercial-c2-7-integracion-pg18.test.cjs`
- `Controladores/pruebas/cotizaciones-c3-3-pg18.test.cjs`
- `Controladores/pruebas/permisos-comerciales-c2-6.test.cjs`
- `Controladores/pruebas/seguridad-comercial-c2-5.test.cjs`
- `Controladores/src/comercial/SeguridadCapacidadesComerciales.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Mantenedores/CatalogosComerciales.test.tsx`
- `Vistas/src/views/Mantenedores/CatalogosComerciales.tsx`
- `documentacion/C2_5_SEGURIDAD_M4_COMERCIAL_DOCUMENTAL.md`
- `documentacion/C2_6_ACTIVACION_CONTROLADA_M4.md`
### Evidencia textual
- `('CU368','gestionar precios comerciales','Gestionar precios comerciales versionados','Gestionar precios comerciales'),`
- `- Aprobación y registro empresarial de CU368–CU377.`
- `- CU368–CU376 quedan registrados por la migración `068_permisos_comerciales_documentales_c2_6`.`
- `CU355:GSC,CU359:GC,CU360:[],CU361:[],CU362:[],CU363:[],CU364:[],CU365:[],CU366:[],CU367:[],CU368:[],CU369:[],CU370:[],CU371:[],CU372:[],CU373:[],CU374:[],CU375:[],CU376:[],CU377:[],CU378:[],CU379:[],CU380:[],CU381:[],`
## CU369
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | ('CU369','gestionar opcionales comerciales','Gestionar opcionales, compatibilidades y precios','Gestionar opcionales comerciales'), |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU369 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Mantenedores/CatalogosComerciales.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/pruebas/seguridad-comercial-c2-5.test.cjs; Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; documentacion/C2_5_SEGURIDAD_M4_COMERCIAL_DOCUMENTAL.md |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/068_permisos_comerciales_documentales_c2_6/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/comercial-c2-7-integracion-pg18.test.cjs; Controladores/pruebas/permisos-comerciales-c2-6.test.cjs; Controladores/pruebas/seguridad-comercial-c2-5.test.cjs; Vistas/src/views/Mantenedores/CatalogosComerciales.test.tsx |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU355, CU359, CU360, CU361, CU362, CU363, CU364, CU365, CU366, CU367, CU368, CU370, CU371, CU372, CU373, CU374, CU375, CU376, CU377, CU378, CU379, CU380, CU381 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/068_permisos_comerciales_documentales_c2_6/migration.sql`
- `Controladores/pruebas/comercial-c2-7-integracion-pg18.test.cjs`
- `Controladores/pruebas/permisos-comerciales-c2-6.test.cjs`
- `Controladores/pruebas/seguridad-comercial-c2-5.test.cjs`
- `Controladores/src/comercial/SeguridadCapacidadesComerciales.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Mantenedores/CatalogosComerciales.test.tsx`
- `Vistas/src/views/Mantenedores/CatalogosComerciales.tsx`
- `documentacion/C2_5_SEGURIDAD_M4_COMERCIAL_DOCUMENTAL.md`
### Evidencia textual
- `('CU369','gestionar opcionales comerciales','Gestionar opcionales, compatibilidades y precios','Gestionar opcionales comerciales'),`
- `CU355:GSC,CU359:GC,CU360:[],CU361:[],CU362:[],CU363:[],CU364:[],CU365:[],CU366:[],CU367:[],CU368:[],CU369:[],CU370:[],CU371:[],CU372:[],CU373:[],CU374:[],CU375:[],CU376:[],CU377:[],CU378:[],CU379:[],CU380:[],CU381:[],`
- `CU369:'Gestionar opcionales comerciales', CU370:'Gestionar tarifas de instalación', CU371:'Gestionar condiciones comerciales', CU372:'Publicar condiciones comerciales',`
- `assert.deepEqual(aprobados,['CU368','CU369','CU370','CU371','CU372']);`
## CU370
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | ('CU370','gestionar tarifas comerciales','Gestionar tarifas y cobertura comercial de instalación','Gestionar tarifas comerciales'), |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU370 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Mantenedores/CatalogosComerciales.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/pruebas/seguridad-comercial-c2-5.test.cjs; Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; documentacion/C2_5_SEGURIDAD_M4_COMERCIAL_DOCUMENTAL.md |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/068_permisos_comerciales_documentales_c2_6/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/catalogo-comercial-c1.test.cjs; Controladores/pruebas/comercial-c2-7-integracion-pg18.test.cjs; Controladores/pruebas/m4-permisos-funcionales.test.cjs; Controladores/pruebas/permisos-comerciales-c2-6.test.cjs; Controladores/pruebas/seguridad-comercial-c2-5.test.cjs; Vistas/src/views/Mantenedores/CatalogosComerciales.test.tsx |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU355, CU359, CU360, CU361, CU362, CU363, CU364, CU365, CU366, CU367, CU368, CU369, CU371, CU372, CU373, CU374, CU375, CU376, CU377, CU378, CU379, CU380, CU381 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/068_permisos_comerciales_documentales_c2_6/migration.sql`
- `Controladores/pruebas/catalogo-comercial-c1.test.cjs`
- `Controladores/pruebas/comercial-c2-7-integracion-pg18.test.cjs`
- `Controladores/pruebas/m4-permisos-funcionales.test.cjs`
- `Controladores/pruebas/permisos-comerciales-c2-6.test.cjs`
- `Controladores/pruebas/seguridad-comercial-c2-5.test.cjs`
- `Controladores/src/comercial/SeguridadCapacidadesComerciales.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Mantenedores/CatalogosComerciales.test.tsx`
- `Vistas/src/views/Mantenedores/CatalogosComerciales.tsx`
- `documentacion/C2_5_SEGURIDAD_M4_COMERCIAL_DOCUMENTAL.md`
### Evidencia textual
- `('CU370','gestionar tarifas comerciales','Gestionar tarifas y cobertura comercial de instalación','Gestionar tarifas comerciales'),`
- `CU355:GSC,CU359:GC,CU360:[],CU361:[],CU362:[],CU363:[],CU364:[],CU365:[],CU366:[],CU367:[],CU368:[],CU369:[],CU370:[],CU371:[],CU372:[],CU373:[],CU374:[],CU375:[],CU376:[],CU377:[],CU378:[],CU379:[],CU380:[],CU381:[],`
- `CU369:'Gestionar opcionales comerciales', CU370:'Gestionar tarifas de instalación', CU371:'Gestionar condiciones comerciales', CU372:'Publicar condiciones comerciales',`
- `['CU370','Precios y Condiciones Comerciales','Gestionar tarifas de instalación'],['CU379','Documentos Comerciales','Publicar plantillas documentales'],`
## CU371
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | ('CU371','editar condiciones comerciales','Crear y versionar condiciones comerciales','Editar condiciones comerciales'), |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU371 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Mantenedores/CatalogosComerciales.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/pruebas/seguridad-comercial-c2-5.test.cjs; Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; documentacion/C2_5_SEGURIDAD_M4_COMERCIAL_DOCUMENTAL.md |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/068_permisos_comerciales_documentales_c2_6/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/comercial-c2-7-integracion-pg18.test.cjs; Controladores/pruebas/permisos-comerciales-c2-6.test.cjs; Controladores/pruebas/seguridad-comercial-c2-5.test.cjs; Vistas/src/views/Mantenedores/CatalogosComerciales.test.tsx |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU355, CU359, CU360, CU361, CU362, CU363, CU364, CU365, CU366, CU367, CU368, CU369, CU370, CU372, CU373, CU374, CU375, CU376, CU377, CU378, CU379, CU380, CU381 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/068_permisos_comerciales_documentales_c2_6/migration.sql`
- `Controladores/pruebas/comercial-c2-7-integracion-pg18.test.cjs`
- `Controladores/pruebas/permisos-comerciales-c2-6.test.cjs`
- `Controladores/pruebas/seguridad-comercial-c2-5.test.cjs`
- `Controladores/src/comercial/SeguridadCapacidadesComerciales.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Mantenedores/CatalogosComerciales.test.tsx`
- `Vistas/src/views/Mantenedores/CatalogosComerciales.tsx`
- `documentacion/C2_5_SEGURIDAD_M4_COMERCIAL_DOCUMENTAL.md`
### Evidencia textual
- `('CU371','editar condiciones comerciales','Crear y versionar condiciones comerciales','Editar condiciones comerciales'),`
- `CU355:GSC,CU359:GC,CU360:[],CU361:[],CU362:[],CU363:[],CU364:[],CU365:[],CU366:[],CU367:[],CU368:[],CU369:[],CU370:[],CU371:[],CU372:[],CU373:[],CU374:[],CU375:[],CU376:[],CU377:[],CU378:[],CU379:[],CU380:[],CU381:[],`
- `CU369:'Gestionar opcionales comerciales', CU370:'Gestionar tarifas de instalación', CU371:'Gestionar condiciones comerciales', CU372:'Publicar condiciones comerciales',`
- `JOIN "terreno"."permiso" editar ON editar."codigo_m4"='CU371'`
## CU372
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | ('CU372','publicar condiciones comerciales','Publicar condiciones comerciales versionadas','Publicar condiciones comerciales'), |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU372 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Mantenedores/CatalogosComerciales.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/pruebas/seguridad-comercial-c2-5.test.cjs; Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; documentacion/C2_5_SEGURIDAD_M4_COMERCIAL_DOCUMENTAL.md |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/068_permisos_comerciales_documentales_c2_6/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/comercial-c2-7-integracion-pg18.test.cjs; Controladores/pruebas/permisos-comerciales-c2-6.test.cjs; Controladores/pruebas/seguridad-comercial-c2-5.test.cjs; Vistas/src/views/Mantenedores/CatalogosComerciales.test.tsx |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU355, CU359, CU360, CU361, CU362, CU363, CU364, CU365, CU366, CU367, CU368, CU369, CU370, CU371, CU373, CU374, CU375, CU376, CU377, CU378, CU379, CU380, CU381 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/068_permisos_comerciales_documentales_c2_6/migration.sql`
- `Controladores/pruebas/comercial-c2-7-integracion-pg18.test.cjs`
- `Controladores/pruebas/permisos-comerciales-c2-6.test.cjs`
- `Controladores/pruebas/seguridad-comercial-c2-5.test.cjs`
- `Controladores/src/comercial/SeguridadCapacidadesComerciales.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Mantenedores/CatalogosComerciales.test.tsx`
- `Vistas/src/views/Mantenedores/CatalogosComerciales.tsx`
- `documentacion/C2_5_SEGURIDAD_M4_COMERCIAL_DOCUMENTAL.md`
### Evidencia textual
- `('CU372','publicar condiciones comerciales','Publicar condiciones comerciales versionadas','Publicar condiciones comerciales'),`
- `-- CU372 exige además capacidad de edición/versionado de condiciones.`
- `CU355:GSC,CU359:GC,CU360:[],CU361:[],CU362:[],CU363:[],CU364:[],CU365:[],CU366:[],CU367:[],CU368:[],CU369:[],CU370:[],CU371:[],CU372:[],CU373:[],CU374:[],CU375:[],CU376:[],CU377:[],CU378:[],CU379:[],CU380:[],CU381:[],`
- `CU368–CU372 son identificadores consecutivos propuestos después del último CU real verificado, CU367. No se incorporan a `permisos.ts`, seeds, migraciones, perfiles ni usuarios.`
## CU373
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | ('CU373','cargar documentos comerciales','Cargar y reemplazar versiones de documentos comerciales','Cargar documentos comerciales'), |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU373 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/documental/seguridad/AutorizacionDocumental.ts; Controladores/src/documental/seguridad/MatrizCapacidadesDocumentales.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/pruebas/seguridad-comercial-c2-5.test.cjs; Controladores/src/documental/seguridad/AutorizacionDocumental.ts; Controladores/src/documental/seguridad/MatrizCapacidadesDocumentales.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; documentacion/C2_5_SEGURIDAD_M4_COMERCIAL_DOCUMENTAL.md |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/068_permisos_comerciales_documentales_c2_6/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/permisos-comerciales-c2-6.test.cjs; Controladores/pruebas/seguridad-comercial-c2-5.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU355, CU359, CU360, CU361, CU362, CU363, CU364, CU365, CU366, CU367, CU368, CU369, CU370, CU371, CU372, CU374, CU375, CU376, CU377, CU378, CU379, CU380, CU381 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/068_permisos_comerciales_documentales_c2_6/migration.sql`
- `Controladores/pruebas/permisos-comerciales-c2-6.test.cjs`
- `Controladores/pruebas/seguridad-comercial-c2-5.test.cjs`
- `Controladores/src/documental/seguridad/AutorizacionDocumental.ts`
- `Controladores/src/documental/seguridad/MatrizCapacidadesDocumentales.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `documentacion/C2_5_SEGURIDAD_M4_COMERCIAL_DOCUMENTAL.md`
### Evidencia textual
- `('CU373','cargar documentos comerciales','Cargar y reemplazar versiones de documentos comerciales','Cargar documentos comerciales'),`
- `CREAR_INTENCION: 'CU373', CONFIRMAR_CARGA: 'CU373', REEMPLAZAR: 'CU373',`
- `CU355:GSC,CU359:GC,CU360:[],CU361:[],CU362:[],CU363:[],CU364:[],CU365:[],CU366:[],CU367:[],CU368:[],CU369:[],CU370:[],CU371:[],CU372:[],CU373:[],CU374:[],CU375:[],CU376:[],CU377:[],CU378:[],CU379:[],CU380:[],CU381:[],`
- `CU373:'Cargar y reemplazar documentos comerciales', CU374:'Gestionar fotografías y documentos de producto', CU375:'Ver vista previa de documentos',`
## CU374
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | ('CU374','gestionar galería comercial','Gestionar fotografías, galería y asociaciones de productos','Gestionar galería comercial'), |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU374 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/documental/seguridad/AutorizacionDocumental.ts; Controladores/src/documental/seguridad/MatrizCapacidadesDocumentales.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/pruebas/seguridad-comercial-c2-5.test.cjs; Controladores/src/documental/seguridad/AutorizacionDocumental.ts; Controladores/src/documental/seguridad/MatrizCapacidadesDocumentales.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; documentacion/C2_5_SEGURIDAD_M4_COMERCIAL_DOCUMENTAL.md |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/068_permisos_comerciales_documentales_c2_6/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/documentos-producto-backend.test.cjs; Controladores/pruebas/permisos-comerciales-c2-6.test.cjs; Controladores/pruebas/seguridad-comercial-c2-5.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU355, CU359, CU360, CU361, CU362, CU363, CU364, CU365, CU366, CU367, CU368, CU369, CU370, CU371, CU372, CU373, CU375, CU376, CU377, CU378, CU379, CU380, CU381 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/068_permisos_comerciales_documentales_c2_6/migration.sql`
- `Controladores/pruebas/documentos-producto-backend.test.cjs`
- `Controladores/pruebas/permisos-comerciales-c2-6.test.cjs`
- `Controladores/pruebas/seguridad-comercial-c2-5.test.cjs`
- `Controladores/src/documental/seguridad/AutorizacionDocumental.ts`
- `Controladores/src/documental/seguridad/MatrizCapacidadesDocumentales.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `documentacion/C2_5_SEGURIDAD_M4_COMERCIAL_DOCUMENTAL.md`
- `documentacion/C2_CATALOGO_DOCUMENTAL_COTIZACIONES.md`
### Evidencia textual
- `('CU374','gestionar galería comercial','Gestionar fotografías, galería y asociaciones de productos','Gestionar galería comercial'),`
- `ASOCIAR_PRODUCTO: 'CU374', DEFINIR_IMAGEN_PRINCIPAL: 'CU374', ORDENAR_GALERIA: 'CU374', DEFINIR_USO_B2B_B2C: 'CU374',`
- `CU355:GSC,CU359:GC,CU360:[],CU361:[],CU362:[],CU363:[],CU364:[],CU365:[],CU366:[],CU367:[],CU368:[],CU369:[],CU370:[],CU371:[],CU372:[],CU373:[],CU374:[],CU375:[],CU376:[],CU377:[],CU378:[],CU379:[],CU380:[],CU381:[],`
- `CU373:'Cargar y reemplazar documentos comerciales', CU374:'Gestionar fotografías y documentos de producto', CU375:'Ver vista previa de documentos',`
## CU375
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | ('CU375','previsualizar documentos comerciales','Solicitar vista previa de documentos autorizados','Previsualizar documentos comerciales'), |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU375 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | NO CONFIRMADO EN EL REPOSITORIO |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/documental/seguridad/AutorizacionDocumental.ts; Controladores/src/documental/seguridad/MatrizCapacidadesDocumentales.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/pruebas/seguridad-comercial-c2-5.test.cjs; Controladores/src/documental/seguridad/AutorizacionDocumental.ts; Controladores/src/documental/seguridad/MatrizCapacidadesDocumentales.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; documentacion/C2_5_SEGURIDAD_M4_COMERCIAL_DOCUMENTAL.md |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/068_permisos_comerciales_documentales_c2_6/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/c4-3-documental-real.test.cjs; Controladores/pruebas/c4-documentos-comerciales.test.cjs; Controladores/pruebas/catalogo-documental-c2.test.cjs; Controladores/pruebas/permisos-comerciales-c2-6.test.cjs; Controladores/pruebas/seguridad-comercial-c2-5.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU355, CU359, CU360, CU361, CU362, CU363, CU364, CU365, CU366, CU367, CU368, CU369, CU370, CU371, CU372, CU373, CU374, CU376, CU377, CU378, CU379, CU380, CU381 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/068_permisos_comerciales_documentales_c2_6/migration.sql`
- `Controladores/pruebas/c4-3-documental-real.test.cjs`
- `Controladores/pruebas/c4-documentos-comerciales.test.cjs`
- `Controladores/pruebas/catalogo-documental-c2.test.cjs`
- `Controladores/pruebas/permisos-comerciales-c2-6.test.cjs`
- `Controladores/pruebas/seguridad-comercial-c2-5.test.cjs`
- `Controladores/src/documental/seguridad/AutorizacionDocumental.ts`
- `Controladores/src/documental/seguridad/MatrizCapacidadesDocumentales.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `documentacion/C2_5_SEGURIDAD_M4_COMERCIAL_DOCUMENTAL.md`
### Evidencia textual
- `('CU375','previsualizar documentos comerciales','Solicitar vista previa de documentos autorizados','Previsualizar documentos comerciales'),`
- `CU355:GSC,CU359:GC,CU360:[],CU361:[],CU362:[],CU363:[],CU364:[],CU365:[],CU366:[],CU367:[],CU368:[],CU369:[],CU370:[],CU371:[],CU372:[],CU373:[],CU374:[],CU375:[],CU376:[],CU377:[],CU378:[],CU379:[],CU380:[],CU381:[],`
- `CU373:'Cargar y reemplazar documentos comerciales', CU374:'Gestionar fotografías y documentos de producto', CU375:'Ver vista previa de documentos',`
- `SOLICITAR_VISTA_PREVIA: 'CU375', DESCARGAR: 'CU376',`
## CU376
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | ('CU376','descargar documentos comerciales','Descargar documentos comerciales autorizados','Descargar documentos comerciales') |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU376 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/components/documental/DocumentosHistoricosCotizacion.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/documental/seguridad/AutorizacionDocumental.ts; Controladores/src/documental/seguridad/MatrizCapacidadesDocumentales.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/pruebas/seguridad-comercial-c2-5.test.cjs; Controladores/src/documental/seguridad/AutorizacionDocumental.ts; Controladores/src/documental/seguridad/MatrizCapacidadesDocumentales.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; documentacion/C2_5_SEGURIDAD_M4_COMERCIAL_DOCUMENTAL.md |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/068_permisos_comerciales_documentales_c2_6/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/c4-3-documental-real.test.cjs; Controladores/pruebas/catalogo-documental-c2.test.cjs; Controladores/pruebas/documentos-producto-backend.test.cjs; Controladores/pruebas/permisos-comerciales-c2-6.test.cjs; Controladores/pruebas/seguridad-comercial-c2-5.test.cjs; Vistas/src/components/documental/DocumentosHistoricosCotizacion.test.tsx |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU355, CU359, CU360, CU361, CU362, CU363, CU364, CU365, CU366, CU367, CU368, CU369, CU370, CU371, CU372, CU373, CU374, CU375, CU377, CU378, CU379, CU380, CU381 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/068_permisos_comerciales_documentales_c2_6/migration.sql`
- `Controladores/pruebas/c4-3-documental-real.test.cjs`
- `Controladores/pruebas/catalogo-documental-c2.test.cjs`
- `Controladores/pruebas/documentos-producto-backend.test.cjs`
- `Controladores/pruebas/permisos-comerciales-c2-6.test.cjs`
- `Controladores/pruebas/seguridad-comercial-c2-5.test.cjs`
- `Controladores/src/documental/seguridad/AutorizacionDocumental.ts`
- `Controladores/src/documental/seguridad/MatrizCapacidadesDocumentales.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/components/documental/DocumentosHistoricosCotizacion.test.tsx`
- `Vistas/src/components/documental/DocumentosHistoricosCotizacion.tsx`
- `documentacion/C2_5_SEGURIDAD_M4_COMERCIAL_DOCUMENTAL.md`
- `documentacion/C2_6_ACTIVACION_CONTROLADA_M4.md`
### Evidencia textual
- `('CU376','descargar documentos comerciales','Descargar documentos comerciales autorizados','Descargar documentos comerciales')`
- `- CU368–CU376 quedan registrados por la migración `068_permisos_comerciales_documentales_c2_6`.`
- `CU355:GSC,CU359:GC,CU360:[],CU361:[],CU362:[],CU363:[],CU364:[],CU365:[],CU366:[],CU367:[],CU368:[],CU369:[],CU370:[],CU371:[],CU372:[],CU373:[],CU374:[],CU375:[],CU376:[],CU377:[],CU378:[],CU379:[],CU380:[],CU381:[],`
- `CU376:'Descargar documentos e históricos', CU378:'Crear y editar plantillas documentales', CU379:'Publicar plantillas documentales',`
## CU377
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | * activo y aprobado. CU377 permanece excluido mientras no exista aprobación formal. |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU377 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Seguridad/Usuarios.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | Controladores/src/controladores/M4Controller.ts |
| 14. Servicio | Controladores/src/administracion/sincronizarPermisosMidas.ts; Controladores/src/documental/seguridad/AutorizacionDocumental.ts; Controladores/src/documental/seguridad/MatrizCapacidadesDocumentales.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/pruebas/seguridad-comercial-c2-5.test.cjs; Controladores/src/documental/seguridad/AutorizacionDocumental.ts; Controladores/src/documental/seguridad/MatrizCapacidadesDocumentales.ts; Controladores/src/validaciones/permisos.ts; Vistas/src/views/Seguridad/Usuarios.tsx; documentacion/C2_5_SEGURIDAD_M4_COMERCIAL_DOCUMENTAL.md |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/070_permisos_documentales_c4_2/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/c4-2-permisos-midas.test.cjs; Controladores/pruebas/c4-documentos-comerciales.test.cjs; Controladores/pruebas/documentos-producto-backend.test.cjs; Controladores/pruebas/m4-permisos-funcionales.test.cjs; Controladores/pruebas/permisos-comerciales-c2-6.test.cjs; Controladores/pruebas/seguridad-comercial-c2-5.test.cjs |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU368 |
| 23. Estado actual | BLOQUEADO / NO APROBADO |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/070_permisos_documentales_c4_2/migration.sql`
- `Controladores/pruebas/c4-2-permisos-midas.test.cjs`
- `Controladores/pruebas/c4-documentos-comerciales.test.cjs`
- `Controladores/pruebas/documentos-producto-backend.test.cjs`
- `Controladores/pruebas/m4-permisos-funcionales.test.cjs`
- `Controladores/pruebas/permisos-comerciales-c2-6.test.cjs`
- `Controladores/pruebas/seguridad-comercial-c2-5.test.cjs`
- `Controladores/src/administracion/sincronizarPermisosMidas.ts`
- `Controladores/src/controladores/M4Controller.ts`
- `Controladores/src/documental/seguridad/AutorizacionDocumental.ts`
- `Controladores/src/documental/seguridad/MatrizCapacidadesDocumentales.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Seguridad/Usuarios.tsx`
- `documentacion/C2_5_SEGURIDAD_M4_COMERCIAL_DOCUMENTAL.md`
- `documentacion/C2_6_ACTIVACION_CONTROLADA_M4.md`
- `documentacion/C4_1_ACTIVACION_DOCUMENTAL_LOCAL.md`
### Evidencia textual
- `* activo y aprobado. CU377 permanece excluido mientras no exista aprobación formal.`
- `- Aprobación y registro empresarial de CU368–CU377.`
- `- CU377 no se registra y continúa cerrado.`
- `- CU377: permanece cerrado.`
## CU378
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU74','CU355','CU359','CU360','CU378','CU379','CU380','CU381', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU378 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Mantenedores/DocumentosComerciales.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts; Vistas/src/views/Seguridad/Usuarios.test.tsx |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/070_permisos_documentales_c4_2/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/c4-2-permisos-midas.test.cjs; Controladores/pruebas/c4-3-documental-real.test.cjs; Controladores/pruebas/c4-documentos-comerciales.test.cjs; Controladores/pruebas/c4-documentos-pg18.test.cjs; Vistas/src/views/Mantenedores/DocumentosComerciales.test.tsx; Vistas/src/views/Seguridad/Usuarios.test.tsx |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU74, CU355, CU359, CU360, CU361, CU362, CU363, CU364, CU365, CU366, CU367, CU368, CU369, CU370, CU371, CU372, CU373, CU374, CU375, CU376, CU377, CU379, CU380, CU381 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/070_permisos_documentales_c4_2/migration.sql`
- `Controladores/pruebas/c4-2-permisos-midas.test.cjs`
- `Controladores/pruebas/c4-3-documental-real.test.cjs`
- `Controladores/pruebas/c4-documentos-comerciales.test.cjs`
- `Controladores/pruebas/c4-documentos-pg18.test.cjs`
- `Controladores/src/comercial/SeguridadCapacidadesComerciales.ts`
- `Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Mantenedores/DocumentosComerciales.test.tsx`
- `Vistas/src/views/Mantenedores/DocumentosComerciales.tsx`
- `Vistas/src/views/Seguridad/Usuarios.test.tsx`
- `documentacion/C4_1_ACTIVACION_DOCUMENTAL_LOCAL.md`
### Evidencia textual
- `'CU74','CU355','CU359','CU360','CU378','CU379','CU380','CU381',`
- `('CU378','editar plantillas documentales','Crear y editar borradores de plantillas documentales','Editar plantillas documentales'),`
- `CU355:GSC,CU359:GC,CU360:[],CU361:[],CU362:[],CU363:[],CU364:[],CU365:[],CU366:[],CU367:[],CU368:[],CU369:[],CU370:[],CU371:[],CU372:[],CU373:[],CU374:[],CU375:[],CU376:[],CU377:[],CU378:[],CU379:[],CU380:[],CU381:[],`
- `CU376:'Descargar documentos e históricos', CU378:'Crear y editar plantillas documentales', CU379:'Publicar plantillas documentales',`
## CU379
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU74','CU355','CU359','CU360','CU378','CU379','CU380','CU381', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU379 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Mantenedores/DocumentosComerciales.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/070_permisos_documentales_c4_2/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/c4-2-permisos-midas.test.cjs; Controladores/pruebas/c4-3-documental-real.test.cjs; Controladores/pruebas/c4-documentos-comerciales.test.cjs; Controladores/pruebas/c4-documentos-pg18.test.cjs; Controladores/pruebas/m4-permisos-funcionales.test.cjs; Vistas/src/views/Mantenedores/DocumentosComerciales.test.tsx |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU74, CU355, CU359, CU360, CU361, CU362, CU363, CU364, CU365, CU366, CU367, CU368, CU369, CU370, CU371, CU372, CU373, CU374, CU375, CU376, CU377, CU378, CU380, CU381 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/070_permisos_documentales_c4_2/migration.sql`
- `Controladores/pruebas/c4-2-permisos-midas.test.cjs`
- `Controladores/pruebas/c4-3-documental-real.test.cjs`
- `Controladores/pruebas/c4-documentos-comerciales.test.cjs`
- `Controladores/pruebas/c4-documentos-pg18.test.cjs`
- `Controladores/pruebas/m4-permisos-funcionales.test.cjs`
- `Controladores/src/comercial/SeguridadCapacidadesComerciales.ts`
- `Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Mantenedores/DocumentosComerciales.test.tsx`
- `Vistas/src/views/Mantenedores/DocumentosComerciales.tsx`
- `documentacion/C4_1_ACTIVACION_DOCUMENTAL_LOCAL.md`
### Evidencia textual
- `'CU74','CU355','CU359','CU360','CU378','CU379','CU380','CU381',`
- `('CU379','publicar plantillas documentales','Publicar versiones inmutables de plantillas documentales','Publicar plantillas documentales'),`
- `CU355:GSC,CU359:GC,CU360:[],CU361:[],CU362:[],CU363:[],CU364:[],CU365:[],CU366:[],CU367:[],CU368:[],CU369:[],CU370:[],CU371:[],CU372:[],CU373:[],CU374:[],CU375:[],CU376:[],CU377:[],CU378:[],CU379:[],CU380:[],CU381:[],`
- `CU376:'Descargar documentos e históricos', CU378:'Crear y editar plantillas documentales', CU379:'Publicar plantillas documentales',`
## CU380
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU74','CU355','CU359','CU360','CU378','CU379','CU380','CU381', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU380 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Mantenedores/DocumentosComerciales.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/070_permisos_documentales_c4_2/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/c4-2-permisos-midas.test.cjs; Controladores/pruebas/c4-3-documental-real.test.cjs; Controladores/pruebas/c4-documentos-comerciales.test.cjs; Controladores/pruebas/c4-documentos-pg18.test.cjs; Vistas/src/views/Mantenedores/DocumentosComerciales.test.tsx |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU74, CU355, CU359, CU360, CU361, CU362, CU363, CU364, CU365, CU366, CU367, CU368, CU369, CU370, CU371, CU372, CU373, CU374, CU375, CU376, CU377, CU378, CU379, CU381 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/070_permisos_documentales_c4_2/migration.sql`
- `Controladores/pruebas/c4-2-permisos-midas.test.cjs`
- `Controladores/pruebas/c4-3-documental-real.test.cjs`
- `Controladores/pruebas/c4-documentos-comerciales.test.cjs`
- `Controladores/pruebas/c4-documentos-pg18.test.cjs`
- `Controladores/src/comercial/SeguridadCapacidadesComerciales.ts`
- `Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Mantenedores/DocumentosComerciales.test.tsx`
- `Vistas/src/views/Mantenedores/DocumentosComerciales.tsx`
- `documentacion/C4_1_ACTIVACION_DOCUMENTAL_LOCAL.md`
### Evidencia textual
- `'CU74','CU355','CU359','CU360','CU378','CU379','CU380','CU381',`
- `('CU380','editar carta comercial B2C','Crear y editar borradores de carta comercial general B2C','Editar carta comercial B2C'),`
- `CU355:GSC,CU359:GC,CU360:[],CU361:[],CU362:[],CU363:[],CU364:[],CU365:[],CU366:[],CU367:[],CU368:[],CU369:[],CU370:[],CU371:[],CU372:[],CU373:[],CU374:[],CU375:[],CU376:[],CU377:[],CU378:[],CU379:[],CU380:[],CU381:[],`
- `CU380:'Crear y editar carta comercial B2C', CU381:'Publicar carta comercial B2C',`
## CU381
| Campo | Evidencia/descripcion |
| --- | --- |
| 1. Objetivo | 'CU74','CU355','CU359','CU360','CU378','CU379','CU380','CU381', |
| 2. Actor | Actor autenticado con el CU efectivo; revisar dependencias administrativas y alcance en el catalogo M4. |
| 3. Area funcional | Seguridad M4 |
| 4. Precondiciones | Sesion vigente, CU efectivo, entidad existente y estado compatible; dependencias adicionales se validan en backend. |
| 5. Flujo normal | Vista/cliente API -> ruta -> fachada/controlador -> Prisma -> M9 cuando corresponde. |
| 6. Flujos alternativos | Datos invalidos, entidad inexistente, falta de permiso, conflicto de revision, estado incompatible o dependencia indisponible. |
| 7. Permiso M4 | CU381 |
| 8. Ruta frontend | NO CONFIRMADO EN EL REPOSITORIO |
| 9. Componente React | Vistas/src/views/Mantenedores/DocumentosComerciales.tsx |
| 10. Endpoint | NO CONFIRMADO EN EL REPOSITORIO |
| 11. Ruta backend | NO CONFIRMADO EN EL REPOSITORIO |
| 12. Fachada | NO CONFIRMADO EN EL REPOSITORIO |
| 13. Controlador | NO CONFIRMADO EN EL REPOSITORIO |
| 14. Servicio | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 15. Validaciones | Controladores/src/comercial/SeguridadCapacidadesComerciales.ts; Controladores/src/seguridad/catalogoPermisosFuncional.ts; Controladores/src/validaciones/permisos.ts |
| 16. Tablas afectadas | Consultar los modelos Prisma invocados por el controlador citado; NO CONFIRMADO automaticamente cuando no hay controlador enlazado. |
| 17. Migraciones | Controladores/prisma/migrations/070_permisos_documentales_c4_2/migration.sql |
| 18. Auditoria M9 | NO CONFIRMADO EN EL REPOSITORIO |
| 19. Pruebas | Controladores/pruebas/c4-2-permisos-midas.test.cjs; Controladores/pruebas/c4-3-documental-real.test.cjs; Controladores/pruebas/c4-documentos-comerciales.test.cjs; Controladores/pruebas/c4-documentos-pg18.test.cjs; Vistas/src/views/Mantenedores/DocumentosComerciales.test.tsx |
| 20. Resultado esperado | La accion autorizada termina con respuesta explicita y efectos persistentes coherentes; una lectura respeta alcance. |
| 21. Errores conocidos | Revisar Diccionario de Errores y pruebas enlazadas; no se atribuye un bug sin evidencia. |
| 22. Dependencias con otros CU | CU74, CU355, CU359, CU360, CU361, CU362, CU363, CU364, CU365, CU366, CU367, CU368, CU369, CU370, CU371, CU372, CU373, CU374, CU375, CU376, CU377, CU378, CU379, CU380 |
| 23. Estado actual | IMPLEMENTADO Y CON PRUEBA REFERENCIADA |
### Trazabilidad completa de archivos
- `Controladores/prisma/migrations/070_permisos_documentales_c4_2/migration.sql`
- `Controladores/pruebas/c4-2-permisos-midas.test.cjs`
- `Controladores/pruebas/c4-3-documental-real.test.cjs`
- `Controladores/pruebas/c4-documentos-comerciales.test.cjs`
- `Controladores/pruebas/c4-documentos-pg18.test.cjs`
- `Controladores/src/comercial/SeguridadCapacidadesComerciales.ts`
- `Controladores/src/comercial/documentos/ServicioDocumentosComerciales.ts`
- `Controladores/src/seguridad/catalogoPermisosFuncional.ts`
- `Controladores/src/validaciones/permisos.ts`
- `Vistas/src/views/Mantenedores/DocumentosComerciales.test.tsx`
- `Vistas/src/views/Mantenedores/DocumentosComerciales.tsx`
- `documentacion/C4_1_ACTIVACION_DOCUMENTAL_LOCAL.md`
### Evidencia textual
- `'CU74','CU355','CU359','CU360','CU378','CU379','CU380','CU381',`
- `('CU381','publicar carta comercial B2C','Publicar versiones inmutables de carta comercial general B2C','Publicar carta comercial B2C')`
- `CU355:GSC,CU359:GC,CU360:[],CU361:[],CU362:[],CU363:[],CU364:[],CU365:[],CU366:[],CU367:[],CU368:[],CU369:[],CU370:[],CU371:[],CU372:[],CU373:[],CU374:[],CU375:[],CU376:[],CU377:[],CU378:[],CU379:[],CU380:[],CU381:[],`
- `CU380:'Crear y editar carta comercial B2C', CU381:'Publicar carta comercial B2C',`

## Fuentes de verdad consultadas
- `Controladores/prisma/schema.prisma`
- `Controladores/pruebas`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/rutas/finanzas.ts`
- `Vistas/src`
- `Vistas/src/App.tsx`
