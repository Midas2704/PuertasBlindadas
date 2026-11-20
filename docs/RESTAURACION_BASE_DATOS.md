# Restauración del respaldo PostgreSQL

El respaldo productivo no forma parte de Git. Se entrega cifrado con AES-256-CBC, PBKDF2 y 250.000 iteraciones. La clave se conserva por separado.

El script de restauración:

1. exige confirmación explícita;
2. rechaza nombres de base que no comiencen por `pblindadas_local`;
3. descifra en una carpeta temporal;
4. valida el SHA-256 interno del `pg_dump`;
5. restaura mediante `pg_restore --exit-on-error`;
6. exige exactamente 294 tablas;
7. elimina los archivos descifrados temporales.

La fotografía respaldada el 16 de noviembre de 2026 contiene:

| Esquema | Tablas |
|---|---:|
| comun | 14 |
| finanzas | 212 |
| inventario | 39 |
| public | 1 |
| terreno | 28 |
| **Total** | **294** |

PostgreSQL de origen: 18.6. Tamaño lógico informado: 35.903.167 bytes.
