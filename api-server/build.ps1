# Quick Build Script for ESP32 Project
# Usage: .\build.ps1 [command]
# Examples:
#   .\build.ps1           # Build the project
#   .\build.ps1 upload    # Build and upload
#   .\build.ps1 monitor   # Monitor serial

# Add PlatformIO to PATH
$pioPath = "$env:USERPROFILE\.platformio\penv\Scripts"
$env:PATH += ";$pioPath"

# Determine command
$command = if ($args.Count -gt 0) { $args[0] } else { "run" }

switch ($command) {
    "upload" {
        Write-Host "Building and uploading to ESP32..." -ForegroundColor Cyan
        & "$pioPath\pio.exe" run -t upload
    }
    "monitor" {
        Write-Host "Opening serial monitor..." -ForegroundColor Cyan
        & "$pioPath\pio.exe" device monitor
    }
    "clean" {
        Write-Host "Cleaning build files..." -ForegroundColor Cyan
        & "$pioPath\pio.exe" run -t clean
    }
    "run" {
        Write-Host "Building ESP32 project..." -ForegroundColor Cyan
        & "$pioPath\pio.exe" run
    }
    default {
        Write-Host "Unknown command: $command" -ForegroundColor Red
        Write-Host "Available commands: run, upload, monitor, clean" -ForegroundColor Yellow
    }
}
