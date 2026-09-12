# Mapa del proyecto

El paquete contiene el código fuente completo, configuración, modelo de datos, migraciones, pruebas y documentación necesaria para instalar, compilar y ejecutar el sistema.

## Raíz

| Archivo | Contenido y propósito |
|---|---|
| `.gitignore` | Reglas generales para evitar archivos locales, dependencias y compilados en Git. |
| `README.md` | Instrucciones principales de instalación, configuración y ejecución del sistema. |
| `frontend_style_guide.md` | Guía visual y convenciones utilizadas por la interfaz. |
| `auditoria-cu-inicial.md` | Registro inicial de cobertura de casos de uso. |
| `auditoria-cu-corregida.md` | Revisión corregida de la cobertura funcional. |
| `auditoria-cu-final.md` | Estado consolidado de los casos de uso revisados. |
| `MAPA_DEL_PROYECTO.md` | Este inventario del contenido del paquete. |

## `Controladores/` — backend

| Archivo | Contenido y propósito |
|---|---|
| `.env.example` | Plantilla de variables de entorno; indica qué datos debe configurar cada instalación. |
| `package.json` | Dependencias y comandos del backend: desarrollo, compilación, pruebas, Prisma y carga inicial. |
| `package-lock.json` | Versiones exactas de las dependencias del backend. |
| `prisma.config.ts` | Configuración de Prisma y conexión con su esquema. |
| `tsconfig.json` | Configuración de compilación TypeScript del backend. |
| `scripts/limpiar-compilacion.cjs` | Limpia la salida anterior antes de compilar. |

### `Controladores/src/`

| Archivo | Contenido y propósito |
|---|---|
| `app.ts` | Construye la aplicación Express, registra middleware y monta las rutas financieras. |
| `db.ts` | Inicializa Prisma y la conexión PostgreSQL. |
| `servidor.ts` | Punto de inicio del servidor HTTP. |
| `rutas/finanzas.ts` | Define las rutas HTTP y deriva cada solicitud hacia `C_Finanzas`. |
| `controladores/C_Finanzas.ts` | Fachada central entre las vistas y los controladores M1–M4; coordina autorización y operaciones. |
| `controladores/M1Controller.ts` | Gestión de clientes, catálogo, ficha financiera, búsquedas y estados. |
| `controladores/M2Controller.ts` | Cotizaciones, borradores, ventas, condiciones comerciales, documentos y operaciones asociadas. |
| `controladores/M3Controller.ts` | Pagos, saldos, conciliaciones, morosidad, reversiones y comprobantes. |
| `controladores/M4Controller.ts` | Usuarios, sesiones, permisos, contraseñas y administración de accesos. |
| `validaciones/autorizacion.ts` | Contratos y tipos del mecanismo de autorización. |
| `validaciones/permisos.ts` | Mapeo de operaciones a permisos y casos de uso. |
| `validaciones/solicitudes.ts` | Normalización y validación de identificadores, textos, números y filtros HTTP. |
| `utilidades/C_BancoCentral.ts` | Consulta y tratamiento del tipo de cambio con su comportamiento alternativo controlado. |
| `utilidades/ErrorAplicacion.ts` | Error de aplicación con código HTTP y mensaje controlado. |
| `utilidades/correo.ts` | Adaptador de correo usado por recuperación y notificaciones. |
| `utilidades/finanzas.ts` | Cálculos financieros compartidos, fechas de negocio y relaciones Prisma reutilizadas. |
| `utilidades/pago.ts` | Validación y preparación de antecedentes de pagos según el medio seleccionado. |
| `utilidades/seguridad.ts` | Funciones criptográficas para claves, tokens y sesiones. |

### `Controladores/prisma/`

| Archivo | Contenido y propósito |
|---|---|
| `schema.prisma` | Modelo Prisma completo para los esquemas financieros y las tablas relacionadas. |
| `seed.ts` | Carga inicial de catálogos y datos de referencia funcionales. |
| `seed-m4.ts` | Carga inicial específica del módulo de usuarios, accesos y permisos. |
| `views/finanzas/v_ficha_cliente_movimientos.sql` | Vista SQL con movimientos que alimentan la ficha financiera del cliente. |
| `views/finanzas/v_ficha_cliente_resumen.sql` | Vista SQL con el resumen consolidado de la ficha financiera. |
| `migrations/migration_lock.toml` | Identifica PostgreSQL como proveedor de las migraciones. |
| `migrations/000_base_existente/migration.sql` | Registra la base heredada utilizada como punto de partida. |
| `migrations/001_base_i2/migration.sql` | Incorpora la estructura financiera base de la entrega I2. |
| `migrations/002_secuencias_heredadas/migration.sql` | Ajusta secuencias de tablas existentes para inserciones seguras. |
| `migrations/003_seguridad_m4/migration.sql` | Añade tablas y relaciones del módulo de seguridad M4. |
| `migrations/004_destino_excedente/migration.sql` | Añade persistencia para el destino de excedentes financieros. |
| `migrations/005_sesiones_multiples/migration.sql` | Habilita y registra múltiples sesiones controladas. |

### `Controladores/pruebas/`

| Archivo | Contenido y propósito |
|---|---|
| `arquitectura-y-m1.test.cjs` | Comprueba la separación M1–M4, el paso por la fachada y las funciones principales de clientes. |
| `brechas-cierre.test.cjs` | Pruebas integradas de reglas financieras y cierres funcionales. |
| `brechas-focalizadas.test.cjs` | Casos concretos de mora, antecedentes de pago, cliente provisional y conciliación. |
| `cu20-cu23-cu27.test.cjs` | Pruebas de reanudación de borradores, formalización B2C y venta directa con referencias comerciales. |
| `delta-financiero.test.cjs` | Verifica consistencia transaccional de consolidación, pagos, reversiones y moneda. |
| `m4.test.cjs` | Suite de usuarios, permisos, sesiones, recuperación y seguridad HTTP. |

## `Vistas/` — frontend

| Archivo | Contenido y propósito |
|---|---|
| `.gitignore` | Exclusiones locales específicas del frontend. |
| `package.json` | Dependencias y comandos de desarrollo, compilación y lint. |
| `package-lock.json` | Versiones exactas de las dependencias del frontend. |
| `index.html` | Documento HTML base donde se monta React. |
| `vite.config.ts` | Configuración del empaquetador Vite. |
| `eslint.config.js` | Reglas de análisis estático del frontend. |
| `postcss.config.js` | Configuración del procesamiento CSS. |
| `tailwind.config.js` | Tema, rutas de contenido y configuración de Tailwind. |
| `tsconfig.json` | Configuración TypeScript principal del frontend. |
| `tsconfig.app.json` | Configuración TypeScript para la aplicación React. |
| `tsconfig.node.json` | Configuración TypeScript para herramientas de Node y Vite. |

### `Vistas/src/`

| Archivo | Contenido y propósito |
|---|---|
| `main.tsx` | Punto de entrada de React y montaje de la aplicación. |
| `App.tsx` | Árbol de rutas y permisos de acceso a las pantallas. |
| `App.css` | Estilos específicos del componente principal. |
| `index.css` | Estilos globales, Tailwind y reglas visuales compartidas. |
| `lucide-react.d.ts` | Declaraciones TypeScript complementarias para los iconos. |
| `api/finanzas.ts` | Cliente HTTP común para comunicarse con el backend y controlar sesiones vencidas. |
| `seguridad/Sesion.tsx` | Contexto de sesión, protección de vistas y operaciones autenticadas. |
| `components/ModalDetalleDocumento.tsx` | Modal reutilizable para consultar documentos y antecedentes financieros. |
| `components/OperacionesFinancieras.tsx` | Acciones disponibles sobre notas, pagos, documentos y condiciones comerciales. |
| `views/ArmarCotizacion/ArmarCotizacion.tsx` | Formulario completo para crear, retomar, guardar y emitir cotizaciones. |
| `views/BandejaAprobacion/BandejaAprobacionGerencia.tsx` | Bandeja de cotizaciones y ventas pendientes, con acciones según estado y permiso. |
| `views/CatalogoClientes/CatalogoClientes.tsx` | Listado, búsqueda, filtrado y mantenimiento de clientes. |
| `views/Configuracion/UmbralPorVencer.tsx` | Configuración del umbral para documentos próximos a vencer. |
| `views/DashboardPrincipal/DashboardPrincipal.tsx` | Indicadores y resumen financiero principal. |
| `views/DashboardWrapper/DashboardWrapper.tsx` | Estructura visual general, menú lateral y navegación protegida. |
| `views/NotaDeVentaDirecta/NotaDeVentaDirecta.tsx` | Registro de notas de venta directas con múltiples líneas comerciales. |
| `views/Pagos/PagosCliente.tsx` | Registro de pagos, selección de medios y antecedentes asociados. |
| `views/Seguridad/Acceso.tsx` | Inicio de sesión, recuperación y cambio de contraseña. |
| `views/Seguridad/Sesiones.tsx` | Consulta y cierre administrativo de sesiones. |
| `views/Seguridad/Usuarios.tsx` | Administración de usuarios, configuraciones y permisos. |
| `views/VerFicha/VerFicha.tsx` | Ficha financiera completa del cliente con documentos, deuda, proyectos y movimientos. |
| `assets/hero.png` | Imagen principal utilizada por la interfaz. |
| `assets/react.svg` | Recurso gráfico de React incluido en el frontend. |
| `assets/vite.svg` | Recurso gráfico de Vite incluido en el frontend. |

### `Vistas/public/`

| Archivo | Contenido y propósito |
|---|---|
| `favicon.svg` | Icono del sitio mostrado por el navegador. |
| `icons.svg` | Recurso público de iconos vectoriales. |

## `db/` — instalación directa de PostgreSQL

| Archivo | Contenido y propósito |
|---|---|
| `README.md` | Instrucciones para preparar la base mediante los scripts SQL. |
| `schema.sql` | Definición SQL consolidada de la base de datos. |
| `seed.sql` | Datos iniciales para una instalación basada directamente en SQL. |
| `setup.ps1` | Automatiza la preparación de PostgreSQL desde PowerShell. |

## `documentacion/`

| Archivo | Contenido y propósito |
|---|---|
| `ETAPA_1_I2.md` | Descripción técnica y funcional de la etapa I2. |
| `DELTA_M4.md` | Cambios y alcance del módulo M4. |
| `RESULTADO_RECONCILIACION_M4.md` | Resultado de la comparación y reconciliación del módulo M4. |
| `REVISION_MIGRACION_M4.md` | Revisión de la migración y compatibilidad del esquema M4. |
| `verificacion_m4/comparacion_esquemas.json` | Resultado estructurado de la comparación entre esquemas. |
| `verificacion_m4/historial_final.json` | Historial final utilizado para comprobar la reconciliación. |

## Elementos que se obtienen al instalar o compilar

| Elemento omitido | Motivo |
|---|---|
| `node_modules/` | Se reconstruye con `npm install` usando los archivos `package-lock.json`. |
| `dist/` | Se genera con `npm run build`; no es código fuente. |
| `.env` | Contiene configuración local y posibles credenciales. Se entrega `.env.example`. |
| `.git/` | Contiene historial y metadatos del repositorio, disponibles directamente en GitHub. |
| `coverage/` | Es salida generada por herramientas de pruebas. |
| Otros archivos `.zip` | Se excluyen para evitar paquetes anidados y tamaño innecesario. |
