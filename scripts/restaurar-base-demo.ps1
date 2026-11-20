[CmdletBinding()]
param(
  [switch]$ConfirmarSobrescritura
)

$ErrorActionPreference = 'Stop'
if (-not $ConfirmarSobrescritura) {
  throw 'La restauración reemplaza únicamente la base LOCAL. Repita con -ConfirmarSobrescritura.'
}

$raiz = Split-Path -Parent $PSScriptRoot
$compose = Join-Path $raiz 'docker-compose.local.yml'
$composeSource = Join-Path $raiz 'docker-compose.source.yml'
$archivoEnv = Join-Path $raiz '.env'
$dump = Join-Path $raiz 'database\demo\puertasblindadas-demo.dump'
$checksum = Join-Path $raiz 'database\demo\puertasblindadas-demo.dump.sha256'

foreach ($archivo in @($archivoEnv, $dump, $checksum)) {
  if (-not (Test-Path -LiteralPath $archivo)) { throw "Falta el archivo requerido: $archivo" }
}

function Leer-Env([string]$nombre) {
  $linea = Get-Content -LiteralPath $archivoEnv | Where-Object { $_ -match "^$([regex]::Escape($nombre))=" } | Select-Object -First 1
  if (-not $linea) { throw "Falta $nombre en .env" }
  return $linea.Substring($linea.IndexOf('=') + 1)
}

$usuario = Leer-Env 'LOCAL_POSTGRES_USER'
$clave = Leer-Env 'LOCAL_POSTGRES_PASSWORD'
$base = Leer-Env 'LOCAL_POSTGRES_DB'
if ($base -notmatch '^pblindadas_local([_a-z0-9]*)$') {
  throw "Nombre de base local no autorizado: $base"
}

$esperado = ((Get-Content -LiteralPath $checksum -Raw).Split()[0]).ToLowerInvariant()
$real = (Get-FileHash -LiteralPath $dump -Algorithm SHA256).Hash.ToLowerInvariant()
if ($real -ne $esperado) { throw 'El SHA-256 del respaldo demo no coincide.' }

docker compose --env-file $archivoEnv -f $compose up -d postgres
if ($LASTEXITCODE -ne 0) { throw 'No se pudo iniciar PostgreSQL local.' }

$contenedor = 'pblindadas-local-postgres'
$listo = $false
1..30 | ForEach-Object {
  if (-not $listo) {
    Start-Sleep -Seconds 2
    docker exec -e PGPASSWORD=$clave $contenedor pg_isready -U $usuario -d postgres *> $null
    if ($LASTEXITCODE -eq 0) { $listo = $true }
  }
}
if (-not $listo) { throw 'PostgreSQL local no quedó disponible.' }

docker exec -e PGPASSWORD=$clave $contenedor psql -U $usuario -d postgres -v ON_ERROR_STOP=1 -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='$base' AND pid <> pg_backend_pid();"
docker exec -e PGPASSWORD=$clave $contenedor dropdb -U $usuario --if-exists $base
docker exec -e PGPASSWORD=$clave $contenedor createdb -U $usuario $base
docker cp $dump "${contenedor}:/tmp/puertasblindadas-demo.dump"
try {
  docker exec -e PGPASSWORD=$clave $contenedor pg_restore -U $usuario -d $base --exit-on-error --no-owner --no-acl /tmp/puertasblindadas-demo.dump
  if ($LASTEXITCODE -ne 0) { throw 'pg_restore informó un error.' }
} finally {
  docker exec $contenedor rm -f /tmp/puertasblindadas-demo.dump *> $null
}

$resumen = docker exec -e PGPASSWORD=$clave $contenedor psql -U $usuario -d $base -Atc @'
SELECT concat_ws('|',
  (SELECT count(*) FROM pg_tables WHERE schemaname IN ('comun','finanzas','inventario','terreno','public')),
  (SELECT count(*) FROM comun.sesion_usuario),
  (SELECT count(*) FROM comun.token_recuperacion),
  (SELECT count(*) FROM comun.usuario WHERE administrador_original),
  (SELECT count(*) FROM finanzas.cotizacion),
  (SELECT count(*) FROM finanzas.cliente_financiero),
  (SELECT count(*) FROM finanzas.version_presupuesto_m10 v JOIN finanzas.presupuesto_manual_m10 p USING(id_presupuesto_manual_m10) WHERE p.anio=2026),
  (SELECT count(*) FROM finanzas.detalle_presupuesto_m10 d JOIN finanzas.version_presupuesto_m10 v USING(id_version_presupuesto_m10) JOIN finanzas.presupuesto_manual_m10 p USING(id_presupuesto_manual_m10) WHERE p.anio=2026)
)
'@
if ($LASTEXITCODE -ne 0) { throw 'No se pudo validar la base demo restaurada.' }
$campos = $resumen.Trim().Split('|')
if ($campos.Count -ne 8 -or $campos[0] -ne '294' -or $campos[1] -ne '0' -or $campos[2] -ne '0' -or $campos[3] -ne '1' -or $campos[6] -ne '2' -or $campos[7] -ne '216') {
  throw "La base demo restaurada no cumple la fotografía esperada: $resumen"
}

docker compose --env-file $archivoEnv -f $compose -f $composeSource up -d backend frontend
if ($LASTEXITCODE -ne 0) { throw 'No se pudieron iniciar backend y frontend.' }

Write-Host 'Base demo restaurada y validada: 294 tablas.'
Write-Host "Cotizaciones: $($campos[4]); clientes financieros: $($campos[5]); partidas EF-19: $($campos[7])."
Write-Host 'Aplicación: http://127.0.0.1:8081/'
