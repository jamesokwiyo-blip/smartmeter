# PlatformIO Helper Script
# This script adds PlatformIO to PATH and runs the pio command

$pioPath = "$env:USERPROFILE\.platformio\penv\Scripts"
if (Test-Path "$pioPath\pio.exe") {
    $env:PATH += ";$pioPath"
    & "$pioPath\pio.exe" $args
} else {
    Write-Host "Error: PlatformIO not found at $pioPath" -ForegroundColor Red
    Write-Host "Please install PlatformIO IDE or CLI" -ForegroundColor Yellow
    exit 1
}
