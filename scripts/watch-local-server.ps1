$ErrorActionPreference = "SilentlyContinue"

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$siteUrl = $env:SITE_URL
if (-not $siteUrl) {
  $siteUrl = "https://tear-bowl-den-gradually.trycloudflare.com"
}
$log = Join-Path $root "server-watchdog.log"

function Start-TechMagazineServer {
  $existing = Get-CimInstance Win32_Process -Filter "name = 'node.exe'" |
    Where-Object { $_.CommandLine -match 'server.js' -and $_.CommandLine -notmatch 'apps/api' }
  if ($existing) { return }
  $env:SITE_URL = $siteUrl
  Start-Process -FilePath "node" -ArgumentList "server.js" -WorkingDirectory $root -WindowStyle Hidden
  Add-Content -Path $log -Value "$(Get-Date -Format s) restarted server"
}

while ($true) {
  try {
    $response = Invoke-WebRequest -UseBasicParsing "http://127.0.0.1:8000/api/health" -TimeoutSec 8
    if ($response.StatusCode -ne 200) { Start-TechMagazineServer }
  } catch {
    Start-TechMagazineServer
  }
  Start-Sleep -Seconds 20
}
