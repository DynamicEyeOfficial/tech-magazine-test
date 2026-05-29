param(
  [string]$ProjectDir = "C:\Users\joegh\Documents\Codex\2026-05-18\if-i-need-you-to-make",
  [string]$NodePath = "C:\Users\joegh\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe",
  [string]$HealthUrl = "http://127.0.0.1:8000/api/health",
  [int]$IntervalSeconds = 15
)

$ErrorActionPreference = "Continue"
$logPath = Join-Path $ProjectDir "server-watchdog.log"
$outPath = Join-Path $ProjectDir "server-live.log"
$errPath = Join-Path $ProjectDir "server-live.err.log"

function Write-WatchLog {
  param([string]$Message)
  $stamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  Add-Content -LiteralPath $logPath -Value "[$stamp] $Message"
}

function Test-Server {
  try {
    $response = Invoke-WebRequest -Uri $HealthUrl -UseBasicParsing -TimeoutSec 5
    return $response.StatusCode -eq 200
  } catch {
    return $false
  }
}

function Stop-StaleServer {
  $processes = Get-CimInstance Win32_Process | Where-Object {
    $_.Name -eq "node.exe" -and $_.CommandLine -match "server.js" -and $_.CommandLine -match [regex]::Escape($ProjectDir)
  }
  foreach ($process in $processes) {
    try {
      Stop-Process -Id $process.ProcessId -Force
      Write-WatchLog "Stopped stale server process $($process.ProcessId)."
    } catch {
      Write-WatchLog "Could not stop process $($process.ProcessId): $($_.Exception.Message)"
    }
  }
}

function Start-Server {
  Write-WatchLog "Starting Tech Magazine server."
  Start-Process -FilePath $NodePath -ArgumentList "server.js" -WorkingDirectory $ProjectDir -RedirectStandardOutput $outPath -RedirectStandardError $errPath -WindowStyle Hidden
}

Write-WatchLog "Watchdog started."

while ($true) {
  if (-not (Test-Server)) {
    Write-WatchLog "Health check failed. Restarting local server."
    Stop-StaleServer
    Start-Sleep -Seconds 1
    Start-Server
    Start-Sleep -Seconds 5
    if (Test-Server) {
      Write-WatchLog "Server recovered."
    } else {
      Write-WatchLog "Server still unhealthy after restart."
    }
  }
  Start-Sleep -Seconds $IntervalSeconds
}
