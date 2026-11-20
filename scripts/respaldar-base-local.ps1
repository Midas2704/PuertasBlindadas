[CmdletBinding()]
param([string]$DirectorioSalida = (Join-Path $HOME 'PuertasBlindadas-Backups'))

$ErrorActionPreference = 'Stop'
$raiz = Split-Path -Parent $PSScriptRoot
$archivoEnv = Join-Path $raiz '.env'
function Leer-Env([string]$nombre) {
  $linea = Get-Content -LiteralPath $archivoEnv | Where-Object { $_ -match "^$([regex]::Escape($nombre))=" } | Select-Object -First 1
  if (-not $linea) { throw "Falta $nombre en .env" }
  return $linea.Substring($linea.IndexOf('=') + 1)
}
$usuario=Leer-Env 'LOCAL_POSTGRES_USER'; $clave=Leer-Env 'LOCAL_POSTGRES_PASSWORD'; $base=Leer-Env 'LOCAL_POSTGRES_DB'
New-Item -ItemType Directory -Force -Path $DirectorioSalida | Out-Null
$marca=Get-Date -Format 'yyyyMMdd_HHmmss'; $salida=Join-Path $DirectorioSalida "pblindadas-local-$marca.dump"
docker exec -e PGPASSWORD=$clave pblindadas-local-postgres pg_dump -U $usuario -d $base -Fc --no-owner --no-acl > $salida
if ($LASTEXITCODE -ne 0 -or -not (Test-Path $salida)) { throw 'Falló el respaldo local.' }
$hash=(Get-FileHash -Algorithm SHA256 -LiteralPath $salida).Hash.ToLower()
Set-Content -LiteralPath "$salida.sha256" -Value "$hash  $([IO.Path]::GetFileName($salida))" -Encoding ascii
Write-Host "Respaldo local: $salida"
Write-Host "SHA-256: $hash"
