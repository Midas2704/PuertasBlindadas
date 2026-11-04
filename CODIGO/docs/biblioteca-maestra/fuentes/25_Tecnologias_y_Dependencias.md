# Tecnologias y dependencias

**Proyecto:** Puertas Blindadas
**Documento:** 25
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

## Inventario
| Workspace | Tipo | Dependencia | Version | Uso/riesgo |
| --- | --- | --- | --- | --- |
| Controladores | dependencies | @aws-sdk/client-s3 | ^3.1149.0 | Contrato S3-compatible |
| Controladores | dependencies | @aws-sdk/s3-request-presigner | ^3.1149.0 | Dependencia declarada; localizar imports antes de actualizar |
| Controladores | dependencies | @prisma/adapter-pg | ^7.8.0 | Dependencia declarada; localizar imports antes de actualizar |
| Controladores | dependencies | @prisma/client | ^7.8.0 | Cliente tipado para PostgreSQL |
| Controladores | dependencies | cors | ^2.8.6 | Dependencia declarada; localizar imports antes de actualizar |
| Controladores | dependencies | dotenv | ^17.4.2 | Dependencia declarada; localizar imports antes de actualizar |
| Controladores | dependencies | exceljs | ^4.4.0 | Generacion/lectura de Excel |
| Controladores | dependencies | express | ^5.3.0 | Servidor y rutas HTTP |
| Controladores | dependencies | pg | ^8.21.0 | Dependencia declarada; localizar imports antes de actualizar |
| Controladores | devDependencies | @types/cors | ^2.8.19 | Dependencia declarada; localizar imports antes de actualizar |
| Controladores | devDependencies | @types/express | ^5.0.6 | Dependencia declarada; localizar imports antes de actualizar |
| Controladores | devDependencies | @types/node | ^25.9.3 | Dependencia declarada; localizar imports antes de actualizar |
| Controladores | devDependencies | @types/pg | ^8.20.0 | Dependencia declarada; localizar imports antes de actualizar |
| Controladores | devDependencies | nodemon | ^3.1.14 | Dependencia declarada; localizar imports antes de actualizar |
| Controladores | devDependencies | prisma | ^7.8.0 | Schema, migraciones y generacion |
| Controladores | devDependencies | ts-node | ^10.9.2 | Dependencia declarada; localizar imports antes de actualizar |
| Controladores | devDependencies | typescript | ^6.0.3 | Tipos y compilacion |
| Vistas | dependencies | lucide-react | ^1.17.0 | Iconografia |
| Vistas | dependencies | react | ^19.2.6 | Interfaz declarativa |
| Vistas | dependencies | react-dom | ^19.2.6 | Dependencia declarada; localizar imports antes de actualizar |
| Vistas | dependencies | react-router-dom | ^7.17.0 | Navegacion |
| Vistas | dependencies | recharts | ^3.10.1 | Graficos |
| Vistas | devDependencies | @eslint/js | ^10.0.1 | Dependencia declarada; localizar imports antes de actualizar |
| Vistas | devDependencies | @testing-library/jest-dom | ^6.9.1 | Dependencia declarada; localizar imports antes de actualizar |
| Vistas | devDependencies | @testing-library/react | ^16.3.3 | Pruebas desde conducta visible |
| Vistas | devDependencies | @testing-library/user-event | ^14.6.7 | Dependencia declarada; localizar imports antes de actualizar |
| Vistas | devDependencies | @types/node | ^24.12.3 | Dependencia declarada; localizar imports antes de actualizar |
| Vistas | devDependencies | @types/react | ^19.2.14 | Dependencia declarada; localizar imports antes de actualizar |
| Vistas | devDependencies | @types/react-dom | ^19.2.3 | Dependencia declarada; localizar imports antes de actualizar |
| Vistas | devDependencies | @vitejs/plugin-react | ^6.0.1 | Dependencia declarada; localizar imports antes de actualizar |
| Vistas | devDependencies | autoprefixer | ^10.5.0 | Dependencia declarada; localizar imports antes de actualizar |
| Vistas | devDependencies | eslint | ^10.3.0 | Dependencia declarada; localizar imports antes de actualizar |
| Vistas | devDependencies | eslint-plugin-react-hooks | ^7.1.1 | Dependencia declarada; localizar imports antes de actualizar |
| Vistas | devDependencies | eslint-plugin-react-refresh | ^0.5.2 | Dependencia declarada; localizar imports antes de actualizar |
| Vistas | devDependencies | globals | ^17.6.0 | Dependencia declarada; localizar imports antes de actualizar |
| Vistas | devDependencies | jsdom | ^26.1.0 | Dependencia declarada; localizar imports antes de actualizar |
| Vistas | devDependencies | postcss | ^8.5.15 | Dependencia declarada; localizar imports antes de actualizar |
| Vistas | devDependencies | tailwindcss | ^3.4.19 | Dependencia declarada; localizar imports antes de actualizar |
| Vistas | devDependencies | typescript | ~6.0.2 | Tipos y compilacion |
| Vistas | devDependencies | typescript-eslint | ^8.59.2 | Dependencia declarada; localizar imports antes de actualizar |
| Vistas | devDependencies | vite | ^8.0.12 | Desarrollo y empaquetado frontend |
| Vistas | devDependencies | vitest | ^4.1.11 | Pruebas frontend |
## Actualizaciones
Actualizar una dependencia puede cambiar tipos, bundle, SQL generado o comportamiento. Revisar changelog oficial, ejecutar pruebas focales y completas segun riesgo, y no mezclar actualizacion masiva con una correccion funcional.

## Fuentes de verdad consultadas
- `Controladores/prisma/schema.prisma`
- `Controladores/pruebas`
- `Controladores/src/controladores/C_Finanzas.ts`
- `Controladores/src/rutas/finanzas.ts`
- `Vistas/src`
- `Vistas/src/App.tsx`
