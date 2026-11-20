[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'
$raiz = Split-Path -Parent $PSScriptRoot
$compose = Join-Path $raiz 'docker-compose.local.yml'
$archivoEnv = Join-Path $raiz '.env'

function Leer-Env([string]$nombre) {
  $linea = Get-Content -LiteralPath $archivoEnv | Where-Object { $_ -match "^$([regex]::Escape($nombre))=" } | Select-Object -First 1
  if (-not $linea) { throw "Falta $nombre en .env" }
  return $linea.Substring($linea.IndexOf('=') + 1)
}

$usuario = Leer-Env 'LOCAL_POSTGRES_USER'
$clave = Leer-Env 'LOCAL_POSTGRES_PASSWORD'
$base = Leer-Env 'LOCAL_POSTGRES_DB'
$frontend = Leer-Env 'LOCAL_FRONTEND_PORT'
$backend = Leer-Env 'LOCAL_BACKEND_PORT'
$contenedor = 'pblindadas-local-postgres'

docker compose --env-file $archivoEnv -f $compose ps
$conteos = docker exec -e PGPASSWORD=$clave $contenedor psql -U $usuario -d $base -Atc "SELECT schemaname||'|'||count(*) FROM pg_tables WHERE schemaname NOT IN ('pg_catalog','information_schema') GROUP BY schemaname ORDER BY schemaname;"
$total = docker exec -e PGPASSWORD=$clave $contenedor psql -U $usuario -d $base -Atc "SELECT count(*) FROM pg_tables WHERE schemaname NOT IN ('pg_catalog','information_schema');"
$m10 = docker exec -e PGPASSWORD=$clave $contenedor psql -U $usuario -d $base -Atc "SELECT p.anio,v.numero_version,count(d.*) FROM finanzas.presupuesto_manual_m10 p JOIN finanzas.version_presupuesto_m10 v USING(id_presupuesto_manual_m10) LEFT JOIN finanzas.detalle_presupuesto_m10 d USING(id_version_presupuesto_m10) WHERE p.anio=2026 GROUP BY p.anio,v.numero_version ORDER BY v.numero_version;"
$m7 = docker exec -e PGPASSWORD=$clave $contenedor psql -U $usuario -d $base -Atc "SELECT count(*) FROM finanzas.proyeccion_financiera_m7 WHERE anio=2026;"
$constraints = docker exec -e PGPASSWORD=$clave $contenedor psql -U $usuario -d $base -Atc "SELECT count(*) FROM pg_constraint WHERE NOT convalidated;"

$frontStatus = try { (Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:$frontend/" -TimeoutSec 10).StatusCode } catch { 0 }
$backStatus = try { (Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:$backend/" -TimeoutSec 10).StatusCode } catch { [int]$_.Exception.Response.StatusCode }

Write-Host "Tablas: $($total.Trim())"
$conteos | ForEach-Object { Write-Host "  $_" }
Write-Host "M10 2026 (año|versión|partidas):"
$m10 | ForEach-Object { Write-Host "  $_" }
Write-Host "M7 2026 partidas: $($m7.Trim())"
Write-Host "Constraints no validados: $($constraints.Trim())"
Write-Host "Frontend HTTP: $frontStatus"
Write-Host "Backend raíz HTTP: $backStatus (404 es válido: la API no publica una página raíz)"

if ($total.Trim() -ne '294') { throw 'El total de tablas no coincide con la fotografía respaldada.' }
if ($constraints.Trim() -ne '0') { throw 'Existen restricciones PostgreSQL sin validar.' }
if ($frontStatus -ne 200) { throw 'El frontend no respondió correctamente.' }
Write-Host 'Verificación técnica básica completada.'
