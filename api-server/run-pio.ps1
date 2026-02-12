# PlatformIO Runner Script
# This script adds PlatformIO to PATH and runs the specified command

# Add PlatformIO to PATH
$pioPath = "$env:USERPROFILE\.platformio\penv\Scripts"
if (Test-Path "$pioPath\pio.exe") {
    $env:PATH += ";$pioPath"
    Write-Host "PlatformIO added to PATH" -ForegroundColor Green
} else {
    Write-Host "Error: PlatformIO not found at $pioPath" -ForegroundColor Red
    Write-Host "Please install PlatformIO IDE or CLI" -ForegroundColor Yellow
    exit 1
}

# Run the pio command with all arguments
if ($args.Count -eq 0) {
    Write-Host "Usage: .\run-pio.ps1 [pio-command] [options]" -ForegroundColor Yellow
    Write-Host "Examples:" -ForegroundColor Yellow
    Write-Host "  .\run-pio.ps1 run" -ForegroundColor Cyan
    Write-Host "  .\run-pio.ps1 run -t upload" -ForegroundColor Cyan
    Write-Host "  .\run-pio.ps1 device monitor" -ForegroundColor Cyan
    exit 0
}

& "$pioPath\pio.exe" $args
