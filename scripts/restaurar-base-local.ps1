[CmdletBinding()]
param(
  [Parameter(Mandatory=$true)][string]$RespaldoCifrado,
  [Parameter(Mandatory=$true)][string]$ArchivoClave,
  [switch]$ConfirmarSobrescritura
)

$ErrorActionPreference = 'Stop'
if (-not $ConfirmarSobrescritura) {
  throw 'La restauración reemplaza la base LOCAL. Repita con -ConfirmarSobrescritura.'
}
$raiz = Split-Path -Parent $PSScriptRoot
$compose = Join-Path $raiz 'docker-compose.local.yml'
$archivoEnv = Join-Path $raiz '.env'
if (-not (Test-Path $archivoEnv)) { throw 'Falta .env. Ejecute primero instalar-local.ps1.' }
foreach ($archivo in @($RespaldoCifrado,$ArchivoClave)) {
  if (-not (Test-Path -LiteralPath $archivo)) { throw "No existe $archivo" }
}

function Leer-Env([string]$nombre) {
  $linea = Get-Content -LiteralPath $archivoEnv | Where-Object { $_ -match "^$([regex]::Escape($nombre))=" } | Select-Object -First 1
  if (-not $linea) { throw "Falta $nombre en .env" }
  return $linea.Substring($linea.IndexOf('=') + 1)
}

$openssl = (Get-Command openssl -ErrorAction SilentlyContinue).Source
if (-not $openssl) {
  $openssl = 'C:\Program Files\Git\usr\bin\openssl.exe'
}
if (-not (Test-Path -LiteralPath $openssl)) { throw 'No se encontró OpenSSL. Instale Git para Windows.' }

$usuario = Leer-Env 'LOCAL_POSTGRES_USER'
$clave = Leer-Env 'LOCAL_POSTGRES_PASSWORD'
$base = Leer-Env 'LOCAL_POSTGRES_DB'
if ($base -notmatch '^pblindadas_local') { throw "Nombre de base local no autorizado: $base" }

$temporal = Join-Path ([IO.Path]::GetTempPath()) ("pblindadas-restore-" + [guid]::NewGuid())
New-Item -ItemType Directory -Path $temporal | Out-Null
try {
  $paquete = Join-Path $temporal 'database-package.tar.gz'
  & $openssl enc -d -aes-256-cbc -pbkdf2 -iter 250000 -in $RespaldoCifrado -out $paquete -pass "file:$ArchivoClave"
  if ($LASTEXITCODE -ne 0) { throw 'No fue posible descifrar el respaldo.' }
  tar -xzf $paquete -C $temporal
  $dump = Join-Path $temporal 'pblindadas_finanzas.dump'
  $esperado = ((Get-Content (Join-Path $temporal 'database-dump.sha256') -Raw).Split()[0]).ToLower()
  $real = (Get-FileHash -Algorithm SHA256 -LiteralPath $dump).Hash.ToLower()
  if ($real -ne $esperado) { throw 'El SHA-256 interno del dump no coincide.' }

  docker compose --env-file $archivoEnv -f $compose up -d postgres
  if ($LASTEXITCODE -ne 0) { throw 'No se pudo iniciar PostgreSQL local.' }
  $contenedor = 'pblindadas-local-postgres'
  $listo = $false
  1..30 | ForEach-Object {
    Start-Sleep -Seconds 2
    docker exec -e PGPASSWORD=$clave $contenedor pg_isready -U $usuario -d postgres *> $null
    if ($LASTEXITCODE -eq 0) { $listo = $true }
  }
  if (-not $listo) { throw 'PostgreSQL local no quedó disponible.' }

  docker exec -e PGPASSWORD=$clave $contenedor psql -U $usuario -d postgres -v ON_ERROR_STOP=1 -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='$base' AND pid <> pg_backend_pid();"
  docker exec -e PGPASSWORD=$clave $contenedor dropdb -U $usuario --if-exists $base
  docker exec -e PGPASSWORD=$clave $contenedor createdb -U $usuario $base
  docker cp $dump "${contenedor}:/tmp/pblindadas_finanzas.dump"
  docker exec -e PGPASSWORD=$clave $contenedor pg_restore -U $usuario -d $base --exit-on-error --no-owner --no-acl /tmp/pblindadas_finanzas.dump
  if ($LASTEXITCODE -ne 0) { throw 'pg_restore informó un error.' }
  docker exec $contenedor rm -f /tmp/pblindadas_finanzas.dump

  $tablas = (docker exec -e PGPASSWORD=$clave $contenedor psql -U $usuario -d $base -Atc "SELECT count(*) FROM pg_tables WHERE schemaname NOT IN ('pg_catalog','information_schema');").Trim()
  if ($tablas -ne '294') { throw "Se esperaban 294 tablas y se restauraron $tablas." }
  docker compose --env-file $archivoEnv -f $compose up -d backend frontend
  Write-Host 'Restauración completada: 294 tablas. Frontend: http://127.0.0.1:8081/'
} finally {
  if (Test-Path -LiteralPath $temporal) { Remove-Item -LiteralPath $temporal -Recurse -Force }
}
