# Base de datos académica de demostración

La carpeta `database/demo/` contiene una copia PostgreSQL 18 restaurable del sistema Puertas Blindadas.

## Alcance conservado

- 294 tablas distribuidas entre `comun`, `finanzas`, `inventario`, `terreno` y `public`.
- 493 cotizaciones académicas.
- 79 clientes financieros y 63 registros de clientes de Terreno.
- Presupuesto EF-19 de 2026: dos versiones y 216 partidas en total.
- Datos M7 de 2026, productos, precios, inventario, pagos, remuneraciones y documentos PDF académicos.
- Relaciones, restricciones, índices y 263 secuencias con sus valores.

## Saneamiento de seguridad

Los datos comerciales se conservaron porque son ficticios. Antes de generar el respaldo público se realizaron estas medidas:

- Eliminación de 87 sesiones históricas y de todos los tokens de recuperación.
- Sustitución irreversible de todos los hashes de contraseñas previos.
- Una credencial demo vigente por cada usuario que ya tenía acceso.
- Reinicio de bloqueos e intentos de acceso.
- Incremento de la versión de seguridad de las cuentas.
- Búsqueda de contraseñas, tokens, claves API, cabeceras de autorización, claves de nube y llaves privadas en columnas de texto/JSON: sin hallazgos.
- Revisión de texto extraído de 14 PDF (35 páginas): sin patrones de secretos o tokens.

El respaldo exacto cifrado del VPS y su clave no forman parte del repositorio público.

## Credencial de demostración

- Acceso: `20776101-K` (cuenta `Midas`)
- Contraseña: `Demo##Puertas2026`

Esta contraseña es pública y sirve exclusivamente para el entorno académico local.

## Restauración automática

Desde PowerShell, en la raíz del repositorio:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\scripts\instalar-demo.ps1
```

La instalación crea una contraseña aleatoria para PostgreSQL en `.env`, valida el SHA-256 del respaldo, restaura únicamente `pblindadas_local`, comprueba las 294 tablas y levanta la aplicación en `http://127.0.0.1:8081/`.
