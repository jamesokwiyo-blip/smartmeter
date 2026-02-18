# Network Connection — Smart Energy Meter

Documentation of all WiFi connection logic, NTP time synchronization, and HTTP API communication in the firmware (`src/main.cpp` + `include/config.h`).

---

## 1. Libraries Used

| Library | Header | Purpose |
|---|---|---|
| Arduino WiFi | `<WiFi.h>` | Core ESP32 WiFi driver — connect, reconnect, status checks |
| WiFi UDP | `<WiFiUdp.h>` | UDP socket transport used by the NTP client |
| HTTP Client | `<HTTPClient.h>` | Send HTTP GET/POST requests to the API server |
| NTP Client | `<NTPClient.h>` | Fetch and maintain network-synchronized time |
| Arduino JSON | `<ArduinoJson.h>` | Serialize/deserialize JSON payloads for API communication |

Declared in `src/main.cpp`:

```cpp
#include <WiFi.h>
#include <WiFiUdp.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <NTPClient.h>
```

---

## 2. Configuration (`include/config.h`)

WiFi credentials and the API base URL are centralized in `config.h`. Edit only this file to switch networks or environments.

```cpp
// ==================== WIFI ====================
#define WIFI_SSID     "Airtel_4G_SMARTCONNECT_F812"
#define WIFI_PASSWORD "9B9F0F52"

// ==================== API ====================
// Local test:  http://192.168.1.120:5000/api  (same WiFi network as dev machine)
// Production:  https://smartmeter-jdw0.onrender.com/api
#define API_BASE_URL "http://192.168.1.120:5000/api"
```

These macros are consumed as constants at the top of `main.cpp`:

```cpp
const char* ssid       = WIFI_SSID;
const char* password   = WIFI_PASSWORD;
const char* apiBaseUrl = API_BASE_URL;
```

---

## 3. Initial Connection — `connectWiFi()`

Called once in `setup()`. Sets the radio to Station mode (`WIFI_STA`), starts the connection, and polls up to **20 attempts (~10 s total)** while keeping the keypad responsive via interleaved `handleKeypad()` calls.

```cpp
void connectWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    for (int i = 0; i < 10; i++) { handleKeypad(); delay(50); }  // ~500 ms, keypad stays responsive
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    wifiConnected = true;
    // Log IP + MAC address
    // Initialize NTP client
    timeClient.begin();
    timeSynchronized = false;
    ntpRetries = 10;
  } else {
    wifiConnected = false;
    // Log connection failure
  }
}
```

On success, `connectWiFi()` immediately initializes the NTP client and resets synchronization state so `synchronizeNTPTime()` runs on the next loop iteration.

---

## 4. Auto-Reconnect in `loop()`

Every **~10 seconds** the main loop checks `WiFi.status()`. If disconnected it first tries a fast `WiFi.reconnect()`, and falls back to the full `connectWiFi()` if that fails.

**Keypad priority rule:** reconnection is skipped for the first **30 seconds** after any keypad activity (`KEYPAD_PRIORITY_MS = 30000`) so the UI remains instant.

```cpp
if (WiFi.status() != WL_CONNECTED) {
    wifiConnected = false;
    bool doReconnect = (now % 10000 < 100);           // trigger once every ~10 s
    if (doReconnect) {
        bool skipForKeypad = (now - lastKeypadActivityMillis < KEYPAD_PRIORITY_MS);
        if (!skipForKeypad) {
            WiFi.reconnect();
            for (int i = 0; i < 20; i++) { handleKeypad(); delay(50); }  // ~1 s poll
            if (WiFi.status() == WL_CONNECTED) {
                wifiConnected = true;
                if (!timeSynchronized) {
                    timeClient.begin();
                    synchronizeNTPTime();
                }
            } else {
                connectWiFi();  // full reconnect attempt
            }
        }
    }
}
```

---

## 5. NTP Time Synchronization — `synchronizeNTPTime()`

After a successful WiFi connection, `synchronizeNTPTime()` is called. It cycles through **four fallback NTP servers** with up to **10 retries**, then applies the **GMT+2 timezone offset** for Rwanda manually.

### NTP Configuration

```cpp
const char* ntpServers[] = {
  "pool.ntp.org",
  "time.nist.gov",
  "time.google.com",
  "time.windows.com"
};

const long          gmtOffset_sec      = 7200;   // GMT+2 (Rwanda)
const int           daylightOffset_sec = 0;      // No DST in Rwanda
const unsigned long ntpUpdateInterval  = 60000;  // Re-fetch every 60 s

WiFiUDP    ntpUDP;
NTPClient  timeClient(ntpUDP, ntpServers[0], 0, ntpUpdateInterval);
// NTPClient offset is 0 — timezone is applied manually for full control
```

### Sync Logic (simplified)

```cpp
void synchronizeNTPTime() {
  if (timeSynchronized) return;
  if (!wifiConnected)   return;

  if (ntpRetries > 0) {
    timeClient.setPoolServerName(ntpServers[currentNTPServerIndex]);
    timeClient.begin();

    if (timeClient.update()) {
      unsigned long utcEpoch   = timeClient.getEpochTime();
      unsigned long localEpoch = utcEpoch + gmtOffset_sec + daylightOffset_sec;

      time_t rawTime = (time_t)localEpoch;
      struct tm *timeInfo = gmtime(&rawTime);

      // Format: YYYY-MM-DDTHH:MM:SS
      char formattedTime[25];
      snprintf(formattedTime, sizeof(formattedTime),
               "%04d-%02d-%02dT%02d:%02d:%02d",
               timeInfo->tm_year + 1900, timeInfo->tm_mon + 1, timeInfo->tm_mday,
               timeInfo->tm_hour, timeInfo->tm_min, timeInfo->tm_sec);

      timeSynchronized = true;
    } else {
      ntpRetries--;
      currentNTPServerIndex = (currentNTPServerIndex + 1) % 4;  // try next server
      timeClient.end();
    }
  }
}
```

### Timestamp Helper — `getFormattedTimestamp()`

Returns an **ISO 8601** local timestamp string used in every API payload:

```cpp
String getFormattedTimestamp() {
  if (timeSynchronized && timeClient.isTimeSet()) {
    unsigned long localEpoch = timeClient.getEpochTime() + gmtOffset_sec + daylightOffset_sec;
    time_t rawTime = (time_t)localEpoch;
    struct tm *timeInfo = gmtime(&rawTime);

    char formattedTime[25];
    snprintf(formattedTime, sizeof(formattedTime),
             "%04d-%02d-%02dT%02d:%02d:%02d",
             timeInfo->tm_year + 1900, timeInfo->tm_mon + 1, timeInfo->tm_mday,
             timeInfo->tm_hour, timeInfo->tm_min, timeInfo->tm_sec);

    return String(formattedTime);
  }
  return "1970-01-01T00:00:00";  // fallback if NTP not synced
}
```

---

## 6. API Communication over WiFi

All HTTP calls use `HTTPClient`. There are three distinct network interactions:

---

### 6.1 POST Energy Data — `sendEnergyDataToAPI()`

Triggered every **30 seconds** during `STATE_RUNNING`. Sends live PZEM sensor readings and energy balance to the server.

```cpp
void sendEnergyDataToAPI() {
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
    if (WiFi.status() != WL_CONNECTED) return;
  }

  HTTPClient http;
  String url = String(apiBaseUrl) + "/energy-data";

  http.begin(url);
  http.setTimeout(3000);  // 3 s — keeps keypad responsive on failure
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Connection", "close");

  // JSON payload fields:
  // meterNumber, token, clientName, clientTIN, clientPhone,
  // remainingKwh, consumedKwh, sessionDuration,
  // voltage, current, power, totalEnergy, frequency, powerFactor,
  // timestamp (ms epoch), timestampFormatted (ISO 8601)

  DynamicJsonDocument doc(1024);
  doc["meterNumber"]        = METER_NUMBER;
  doc["remainingKwh"]       = remaining_kwh;
  doc["consumedKwh"]        = energy - pzem_energy_at_session_start;
  doc["timestamp"]          = (unsigned long long)localEpoch * 1000;
  doc["timestampFormatted"] = getFormattedTimestamp();
  // ... other fields ...

  String jsonPayload;
  serializeJson(doc, jsonPayload);

  // Retry up to 2 times
  int httpResponseCode = -1, retries = 0;
  while (httpResponseCode <= 0 && retries < 2) {
    httpResponseCode = http.POST(jsonPayload);
    retries++;
  }

  http.end();
}
```

**Interval:** `API_SEND_INTERVAL_MS = 30000` ms

---

### 6.2 GET Pending Token — `checkForPendingToken()`

Polled every **10 seconds** when in `STATE_READY` or `STATE_RUNNING`. Asks the server if a new token purchase is waiting for this meter.

```cpp
bool checkForPendingToken() {
  if (WiFi.status() != WL_CONNECTED) return false;

  HTTPClient http;
  String url = String(apiBaseUrl) + "/purchases/pending-token/" + String(METER_NUMBER);

  http.begin(url);
  http.setTimeout(2000);  // 2 s — fail fast, don't block keypad
  http.addHeader("Connection", "close");

  int httpResponseCode = http.GET();

  if (httpResponseCode == 200) {
    // Parse JSON response
    // If success && hasToken → call applyTokenFromServer(tokenNumber, kwhAmount, purchaseId)
  }

  http.end();
  return false;
}
```

**Interval:** `TOKEN_CHECK_INTERVAL_MS = 10000` ms

---

### 6.3 POST Token Confirmation — inside `applyTokenFromServer()`

After a server-issued token is applied to the meter, a confirmation POST is sent back so the server marks the purchase as delivered.

```cpp
// Confirm token was applied to server
HTTPClient http;
String url = String(apiBaseUrl) + "/purchases/confirm-token/" + purchaseId;

http.begin(url);
http.setTimeout(2000);
int httpResponseCode = http.POST("{}");

if (httpResponseCode > 0) {
  // Token confirmed on server
} else {
  // Log failure, will retry on next poll cycle
}
http.end();
```

---

## 7. WiFi State Variable

A global `bool wifiConnected` tracks connection status and gates all HTTP calls:

```cpp
bool wifiConnected = false;  // set true on connect, false on disconnect
```

Every API function checks this flag **before** calling `WiFi.status()` to avoid unnecessary blocking calls.

---

## 8. Key Design Decisions

| Decision | Reason |
|---|---|
| `WIFI_STA` mode only | Meter acts as a client only — no AP/hotspot needed |
| Keypad priority (30 s skip) | Prevents network blocking from freezing token entry |
| Short HTTP timeouts (2–3 s) | A dead server should never lock up the keypad for long |
| 2-retry logic on POST | Transient failures (brief drop) are recovered without skipping a data point |
| Manual timezone offset on NTP | Full control over GMT+2 application; avoids library timezone bugs |
| 4 fallback NTP servers | Redundancy — if one server is unreachable, the next is tried automatically |
| `Connection: close` header | Ensures clean TCP teardown; avoids socket exhaustion on the ESP32 |
