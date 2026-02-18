/**
 * config.h - Configuration for Smart Energy Meter
 * Set SERIAL_LOGGING_ENABLED to 0 for production (minimal serial output).
 * Set to 1 for development/debug (full serial logging).
 */

#ifndef CONFIG_H
#define CONFIG_H

// ==================== SERIAL LOGGING ====================
// 0 = Production: no verbose serial output (avoids flooding monitor)
// 1 = Development: full Serial.print/println for debugging
#define SERIAL_LOGGING_ENABLED 1

// ==================== METER DETAILS ====================
// 13-digit meter number (e.g. "0215002079873")
#define METER_NUMBER "0215002079873"

// ==================== CLIENT DETAILS ====================
#define CLIENT_NAME    "YUMVUHORE"
#define CLIENT_TIN     "1200000"              // Optional, leave empty if not available
#define CLIENT_PHONE   "0782946444"

// ==================== WIFI ====================
#define WIFI_SSID     "Airtel_4G_SMARTCONNECT_F812"
#define WIFI_PASSWORD "9B9F0F52"

// ==================== API ====================
// Local test:  http://192.168.1.120:5000/api  (same WiFi network as dev machine)
// Production:  https://smartmeter-jdw0.onrender.com/api
#define API_BASE_URL "http://192.168.1.120:5000/api"

#endif // CONFIG_H
