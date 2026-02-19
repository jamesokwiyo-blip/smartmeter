# Allow port 5000 in Windows Firewall so the ESP32 can reach the smartmeter server on this PC.
# Run once (may require Administrator). In PowerShell: .\scripts\allow-port-5000-firewall.ps1

$ruleName = "SmartMeter API (port 5000)"
$port = 5000

# Remove existing rule if present (idempotent)
Remove-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue

# Add inbound rule for TCP 5000
New-NetFirewallRule -DisplayName $ruleName -Direction Inbound -Protocol TCP -LocalPort $port -Action Allow | Out-Null
Write-Host "Firewall: Inbound TCP port $port allowed (rule: $ruleName)" -ForegroundColor Green

# Show this PC's IPv4 address so you can set API_BASE_URL in config.h
$ip = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.InterfaceAlias -notmatch 'Loopback' -and $_.IPAddress -notmatch '^169\.' } | Select-Object -First 1).IPAddress
Write-Host "This PC IP (use in config.h): $ip" -ForegroundColor Cyan
Write-Host "Set in include/config.h: #define API_BASE_URL \"http://${ip}:5000/api\"" -ForegroundColor Cyan
