# Auditoria M9

**Proyecto:** Puertas Blindadas
**Documento:** 16
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

## Responsabilidad de M9

M9 conserva evidencia funcional: actor, entidad, operacion, resultado, fecha, correlacion e integridad. No guarda binarios, secretos o URLs firmadas.

## Integridad

`hash_contenido` representa el material normalizado del evento. `hash_integridad` usa el contrato canonico y el material completo correspondiente. Ambos deben producirse mediante el productor oficial; calcular `sha256(JSON.stringify(objeto))` de forma independiente rompe la verificacion.

## Idempotencia

Una clave de solicitud repetida no crea eventos de exito duplicados. Los fallos revertidos no deben registrarse como exito.

## Evidencia comprometida

Un evento que no supera verificacion se muestra como **INTEGRIDAD COMPROMETIDA**, nunca como verificado. La consulta no debe ocultar los eventos validos porque exista uno invalido. La exportacion debe marcar el estado de forma explicita.

## Caso SINCRONIZAR_PERMISOS_MIDAS

El bug historico escribia directamente `evento_auditoria_m9` y reutilizaba un hash no canonico como contenido e integridad. M9 lo detecto. La correccion usa el productor oficial. El evento historico no se borra ni se reescribe: sigue siendo evidencia forense comprometida.

## Archivos centrales

- `Controladores/src/controladores/M9Controller.ts`
- `Controladores/src/m9/RepositorioAuditoriaM9.ts`
- `Controladores/src/m9/contratoProductor.ts`
- `Controladores/src/administracion/sincronizarPermisosMidas.ts`

## Metodos M9 inventariados
| Clase | Metodo | Archivo | Linea |
| --- | --- | --- | --- |
| M9Controller | constructor | Controladores/src/controladores/M9Controller.ts | 40 |
| M9Controller | diagnosticar | Controladores/src/controladores/M9Controller.ts | 52 |
| M9Controller | normalizar | Controladores/src/controladores/M9Controller.ts | 56 |
| M9Controller | recibir | Controladores/src/controladores/M9Controller.ts | 95 |
| M9Controller | verificarIntegridad | Controladores/src/controladores/M9Controller.ts | 138 |
| M9Controller | estadoIntegridad | Controladores/src/controladores/M9Controller.ts | 143 |
| M9Controller | verificarScope | Controladores/src/controladores/M9Controller.ts | 148 |
| M9Controller | presentar | Controladores/src/controladores/M9Controller.ts | 154 |
| M9Controller | proyectarForense | Controladores/src/controladores/M9Controller.ts | 173 |
| M9Controller | normalizarFiltros | Controladores/src/controladores/M9Controller.ts | 179 |
| M9Controller | resolverConsulta | Controladores/src/controladores/M9Controller.ts | 186 |
| M9Controller | terminal | Controladores/src/controladores/M9Controller.ts | 195 |
| M9Controller | consultar | Controladores/src/controladores/M9Controller.ts | 199 |
| M9Controller | detalle | Controladores/src/controladores/M9Controller.ts | 208 |
| M9Controller | exportar | Controladores/src/controladores/M9Controller.ts | 226 |
| M9Controller | resumenAnalitico | Controladores/src/controladores/M9Controller.ts | 250 |
| M9Controller | diagnosticarPendientes | Controladores/src/controladores/M9Controller.ts | 256 |
| M9Controller | reintentarPendientes | Controladores/src/controladores/M9Controller.ts | 264 |
| M9Controller | tratarPorPolitica | Controladores/src/controladores/M9Controller.ts | 279 |
| M9Controller | estadoObservabilidad | Controladores/src/controladores/M9Controller.ts | 286 |
| PuenteM9DocumentosProducto | publicar | Controladores/src/documental/productos/IntegracionM9DocumentosProducto.ts | 48 |
| PuenteM9DocumentosProducto | constructor | Controladores/src/documental/productos/IntegracionM9DocumentosProducto.ts | 55 |
| PuenteM9DocumentosProducto | publicar | Controladores/src/documental/productos/IntegracionM9DocumentosProducto.ts | 56 |
## Pruebas M9
| Suite | Casos |
| --- | --- |
| Controladores/pruebas/m6-post-auditoria.test.cjs | 13 |
| Controladores/pruebas/m9-autorizacion-e2e.test.cjs | 5 |
| Controladores/pruebas/m9-confiabilidad-observabilidad.test.cjs | 11 |
| Controladores/pruebas/m9-consulta-exportacion.test.cjs | 11 |
| Controladores/pruebas/m9-ingesta-integridad.test.cjs | 13 |
| Controladores/pruebas/m9-pdf-informe.test.cjs | 7 |
| Controladores/pruebas/m9-politicas-privacidad.test.cjs | 8 |
| Controladores/pruebas/m9-post-contratos.test.cjs | 7 |
| Controladores/pruebas/m9-productores-failclosed.test.cjs | 4 |
| Controladores/pruebas/m9-retry-alertas-seguridad.test.cjs | 6 |
| Vistas/src/views/Auditoria/Auditoria.test.tsx | 2 |
## Procedimiento forense
1. Preservar evento y hashes.
2. Ejecutar verificacion canonica sin reescritura.
3. Marcar resultado comprometido.
4. Mantener eventos validos consultables.
5. Exportar el estado de integridad.
6. Corregir solo el productor futuro.
7. Registrar el incidente y su correlacion.

## Fuentes de verdad consultadas
- `Controladores/prisma/schema.prisma`
- `Controladores/pruebas`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/rutas/finanzas.ts`
- `Vistas/src`
- `Vistas/src/App.tsx`
