# Historia tecnica y decisiones arquitectonicas

**Proyecto:** Puertas Blindadas
**Documento:** 29
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

## Historial de commits usado
| Commit | Fecha | Decision/cambio |
| --- | --- | --- |
| d073500 | 2026-10-19 | fix: mostrar OT comerciales en Terreno segun alcance M4 |
| db62c6e | 2026-10-19 | fix: preservar integridad forense de auditoria M9 |
| 93e1dcb | 2026-10-19 | fix: corregir vista previa y redisenar PDFs comerciales |
| 0644171 | 2026-10-18 | feat: redisenar administrador funcional de permisos M4 |
| 7da046b | 2026-10-18 | fix: preservar permisos efectivos de Midas |
| 7d28a9e | 2026-10-18 | feat: integrar terreno y sistema comercial documental hasta C3.5 |
| b2ad0c4 | 2026-10-14 | fix: corregir observaciones funcionales y navegacion general |
| 2e98598 | 2026-10-14 | feat: redisenar portada corporativa de puertas blindadas |
| 44edfa4 | 2026-10-14 | feat: implementar portal multisistema y separar finanzas de terreno |
| edccce5 | 2026-10-14 | feat: implementar flujo integral de ordenes de trabajo |
| 4562af5 | 2026-10-13 | (UI) Corrige tooltips flotantes del Dashboard M7 |
| 29c255c | 2026-10-12 | (UI) Corrige observaciones de interfaz y selectores |
| 41ec28d | 2026-10-12 | (Documental) Refuerza portabilidad segura R2 S3 |
| ad9ecaf | 2026-10-12 | (Documental) Prepara activacion segura de documentos comerciales |
| 2654aa6 | 2026-10-12 | (Documental) Integra backend comercial y prepara M4 M9 |
| 837838f | 2026-10-12 | (Mantenedores) Prepara interfaz documental de productos |
| dd994e1 | 2026-10-12 | (Documental) Refuerza seguridad y cierre tecnico |
| fd08532 | 2026-10-12 | (Documental) Implementa seguridad e integridad documental |
| 9f4bd7a | 2026-10-12 | (Documental) Implementa adaptador portable R2 S3 |
| 3cb6106 | 2026-10-12 | (Documental) Implementa nucleo y contratos portables |
| 895561a | 2026-10-12 | (Mantenedores) Estandariza fichas flotantes y mejora UX |
| 614edcf | 2026-10-11 | (Mantenedores) Implementa catalogo comercial de productos y familias |
| c8f1c0a | 2026-10-11 | (Mantenedores) Implementa panel central y navegación |
| 9c856e1 | 2026-10-11 | (M7) Ejecuta QA integral y corrige regresiones |
| 94291e9 | 2026-10-10 | (M7) Mejora integración y cobertura financiera de Inventario |
| 0c9f7e5 | 2026-10-10 | (M7) Integra análisis de producción y costos por modelo |
| 59727da | 2026-10-10 | (M7) Incorpora saldos bancarios iniciales y cobertura de disponibilidades |
| df9166a | 2026-10-10 | (M7) Integra cobertura de gastos operacionales y EBITDA |
| 9a02691 | 2026-10-10 | (M7) Implementa presupuesto anual del Estado de Resultados |
| 99425bb | 2026-10-10 | (M7) Mejora visualización de cupos y alertas de crédito |
| fe63138 | 2026-10-10 | (M7) Incorpora comparativo interanual de conversiones |
| b9f3716 | 2026-10-10 | (M7) Completa filtro temporal maestro del dashboard |
| cdb4909 | 2026-10-10 | (M7) Corrige granularidad diaria y comparación temporal |
| 2db3def | 2026-10-09 | (M7) Agrega comparación flexible entre períodos de ventas |
| 25e47aa | 2026-10-09 | (UI/M7) Agrega comparativo YoY y MoM al análisis mensual |
| aed181c | 2026-10-09 | (UI/M7) Corrige composición visual del dashboard gerencial |
| 0aa6b72 | 2026-10-09 | (M7/M6) Integra mejoras gerenciales de dashboard e incidencias |
| de9a40e | 2026-10-04 | (M6) Incorpora catálogos previsionales y selección de salud |
| 3b16c23 | 2026-10-04 | (M6) Completa previsión legal, historial remuneracional y validación RUT |
| b037f28 | 2026-10-04 | (UI) Corrige gestión de accesos de usuarios |
| 027064d | 2026-10-04 | (Chore) Humaniza comentarios del código financiero |
| b4cd603 | 2026-10-04 | (UI/PDF) Mejora informes y exportaciones financieras |
| 20f666d | 2026-10-03 | (UI) Muestra dashboard gerencial completo en inicio |
| 5df2207 | 2026-10-03 | (M7/UI) Incorpora dashboard gerencial histórico de 12 meses |
| b335093 | 2026-10-03 | (QA/M9) Corrige fechas demo y paginación de auditoría |
| 8e22ebe | 2026-10-03 | (UI/QA) Mejora experiencia móvil y dataset histórico demostrativo |
| 1889702 | 2026-10-03 | (UI) Dashboard gerencial con visualizaciones ejecutivas |
| 8c6cf01 | 2026-10-02 | (QA) Completa dataset demo e integración M8 M7 |
| 56bc27c | 2026-10-02 | (QA) Datos demo integrales y limpieza visual final |
| d13f1b3 | 2026-10-02 | (UI) Integración visual final Dashboard M7 Crédito M8 y Auditoría M9 |
| 06d0344 | 2026-10-02 | (M9) Implementación definitiva Auditoría CUT275-CUT445 |
| 0f2d4ce | 2026-10-02 | (M8) Implementación definitiva módulo Crédito CU259-CU274 |
| 4c6efe8 | 2026-10-02 | (M7) Cierre definitivo Dashboard y delta funcional |
| f028c35 | 2026-10-01 | (Angella) Cierra correcciones finales y freeze tecnico M7 |
| ce3352d | 2026-10-01 | (Angella) Implementa atraso parcial M7 CU252 |
| b6c262b | 2026-10-01 | (Angella) Implementa M7 CU242 CU247 CU248 y avanza CU250 CU253 |
| 02900b4 | 2026-10-01 | (Angella) Implementa M7 CU222 y avanza CU223 CU232 CU236 CU237 |
| 017fe4a | 2026-10-01 | (Angella) Implementa M7 CU216 CU217 CU219 CU220 CU221 |
| 35a6f25 | 2026-10-01 | (Angella) Rebaselina M7 definitivo y consolida implementacion existente |
| b88328b | 2026-09-30 | (Angella) Implementa M7 CU215 CU216 CU217 CU218 CU219 |
| c628a59 | 2026-09-29 | (Angella) Corrige integridad historica y concurrencia M6 |
| 3fdf8b2 | 2026-09-29 | (Angella) Implementa M6 CU211 CU212 CU213 CU214 y completa modulo |
| 732ec85 | 2026-09-29 | (Angella) Implementa M6 CU206 CU207 CU208 CU209 CU210 flujo operacional |
| 48a29b6 | 2026-09-28 | (Angella) Implementa M6 CU205 ajuste y liberacion de orden de trabajo |
| 9c0387b | 2026-09-28 | (Angella) Implementa M6 CU204 generacion de orden de trabajo |
| f4ad003 | 2026-09-28 | (Angella) Implementa M6 CU203 correccion de levantamiento tecnico |
| 5c7ca5a | 2026-09-28 | (Angella) Implementa M6 CU202 levantamiento tecnico |
| c4138fc | 2026-09-28 | (Angella) Implementa M6 CU199 CU200 CU201 flujo inicial de Terreno |
| 17d327c | 2026-09-27 | (Angella) Implementa M6 CU198 confirmacion tributaria de honorarios |
| 0335c34 | 2026-09-27 | (Angella) Implementa M6 CU196-CU197 consulta y preparacion de honorarios |
| 6e4c124 | 2026-09-27 | (Angella) Implementa M6 CU191-CU195 documentos y exportaciones |
| 127ac43 | 2026-09-27 | (Angella) Implementa M6 CU187-CU190 honorarios anulacion y reversiones |
| 023fdc5 | 2026-09-27 | (Angella) Implementa M6 CU183-CU186 ajustes anticipos y pagos |
| f877676 | 2026-09-27 | (Angella) Implementa M6 CU178-CU182 ciclo mensual y reapertura |
| b70807f | 2026-09-25 | (Angella) Implementa M6 CU174-CU177 componentes y ajustes individuales |
| 16c6fb9 | 2026-09-25 | (Angella) Implementa M6 CU172-CU173 hechos remunerables y retrabajos |
| b04cf97 | 2026-09-25 | (Angella) Implementa M6 CU167-CU171 parámetros y configuración |
| 0a3ce31 | 2026-09-24 | (Angella) Implementa M6 CU159-CU166 esquemas haberes y vigencias |
| 8173ff6 | 2026-09-24 | (Angella) Implementa M6 CU155-CU158 empleados y perfil remuneracional |
| 785a451 | 2026-09-24 | (Angella) Organiza navegación lateral por módulos |
## Decisiones transversales
- Cliente financiero autonomo: separa identidad financiera de tablas heredadas.
- Obra vs Proyecto: lugar reutilizable frente a pedido independiente.
- Unidad fisica vs producto: permite una OT por puerta sin duplicar catalogo.
- PDF inmutable: conserva oferta emitida.
- Midas: cuenta raiz con CU aprobados, sin bypass.
- M9: evidencia canonica e integridad forense.
- Storage/ClamAV: adaptadores privados y fail-closed.
- Alternativas B2C: propuesta no equivale a contratacion.

## Fuentes de verdad consultadas
- `Controladores/prisma/schema.prisma`
- `Controladores/pruebas`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/rutas/finanzas.ts`
- `Vistas/src`
- `Vistas/src/App.tsx`
