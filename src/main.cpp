#include <Arduino.h>
#include "config.h"

// Serial logging: when SERIAL_LOGGING_ENABLED is 0 (production), no output
#if SERIAL_LOGGING_ENABLED
#  define SERIAL_PRINT(...)   Serial.print(__VA_ARGS__)
#  define SERIAL_PRINTLN(...) Serial.println(__VA_ARGS__)
#else
#  define SERIAL_PRINT(...)   ((void)0)
#  define SERIAL_PRINTLN(...) ((void)0)
#endif

// Combined sketch: PZEM + Nokia 5110 + PCF8574T Keypad + token logic + WiFi + API
#include <PZEM004Tv30.h>
#include <Adafruit_GFX.h>
#include <Adafruit_PCD8544.h>
#include <Wire.h>
#include <AdvKeyPad.h>
#include <WiFi.h>
#include <WiFiUdp.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <NTPClient.h>
#include <EEPROM.h>
// C library includes for string and math helpers used by strcmp/isnan
#include <string.h>
#include <math.h>

// --------------------- WIFI & API (from config.h) -------
const char* ssid = WIFI_SSID;
const char* password = WIFI_PASSWORD;
const char* apiBaseUrl = API_BASE_URL;

// --------------------- NTP CONFIG ---------------------
// NTP servers list
const char* ntpServers[] = {
  "pool.ntp.org",
  "time.nist.gov",
  "time.google.com",
  "time.windows.com"
};
// Timezone offset (in seconds), e.g., 7200 for GMT+2 (Rwanda)
const long gmtOffset_sec = 7200;
// Daylight savings time offset (in seconds), 0 for Rwanda
const int daylightOffset_sec = 0;
// NTP update interval (60 seconds)
const unsigned long ntpUpdateInterval = 60000;

WiFiUDP ntpUDP;
// Initialize NTPClient with 0 offset - we'll apply timezone manually for accuracy
// This ensures we have full control over timezone application
NTPClient timeClient(ntpUDP, ntpServers[0], 0, ntpUpdateInterval);
bool timeSynchronized = false;
unsigned long lastNTPAttempt = 0;
int currentNTPServerIndex = 0;
int ntpRetries = 10;
const unsigned long ntpRetryInterval = 1000; // 1 second between retries

// Meter and client details are in config.h (METER_NUMBER, CLIENT_NAME, CLIENT_TIN, CLIENT_PHONE)

// --------------------- PZEM CONFIG ---------------------
#define PZEM_RX_PIN 17
#define PZEM_TX_PIN 16
PZEM004Tv30 pzem(Serial2, PZEM_RX_PIN, PZEM_TX_PIN);

// --------------------- NOKIA 5110 CONFIG -----------------
#define LCD_CLK  18
#define LCD_DIN  23
#define LCD_DC   26
#define LCD_CE   5
#define LCD_RST  27
Adafruit_PCD8544 display(LCD_CLK, LCD_DIN, LCD_DC, LCD_CE, LCD_RST);

// --------------------- KEYPAD (PCF8574T) ----------------
const uint8_t KBD_ADDR = 0x20;
const uint8_t SDA_PIN = 21;
const uint8_t SCL_PIN = 22;
const byte ROWS = 4;
const byte COLS = 4;
char keys[ROWS][COLS] = {
  {'D', '#', '0', '*'},
  {'C', '9', '8', '7'},
  {'B', '6', '5', '4'},
  {'A', '3', '2', '1'}
};
AdvKeyPad keypad(KBD_ADDR);

// --------------------- RELAY (power control) --------------
// Relay ON = power to load, Relay OFF = cutoff when energy exhausted
#define RELAY_PIN 2
#define EEPROM_SIZE 64
#define EEPROM_ADDR_REMAINING_KWH       0   // float (4 bytes)
#define EEPROM_ADDR_SESSION_PURCHASED   4   // float (4 bytes)
#define EEPROM_ADDR_PZEM_SESSION_START  8   // float (4 bytes) — PZEM energy() at token application time
#define EEPROM_ADDR_TOKEN              12   // char[21] — active 20-digit token + null terminator

// --------------------- TOKENS ----------------------------
// Token format: 20 digits with spaces (e.g., "1888 6583 5478 3413 6861")
// Stored without spaces for comparison
struct Token { 
  const char *code;  // 20 digits without spaces
  float kwh; 
  const char *clientName;
  const char *clientTIN;
  const char *clientPhone;
};
Token tokens[] = {
  {"18886583547834136861", 5.0, CLIENT_NAME, CLIENT_TIN, CLIENT_PHONE},
  {"12345678901234567890", 10.0, CLIENT_NAME, CLIENT_TIN, CLIENT_PHONE},
  {"98765432109876543210", 25.0, CLIENT_NAME, CLIENT_TIN, CLIENT_PHONE}
};
const int TOKENS_COUNT = sizeof(tokens) / sizeof(tokens[0]);

// --------------------- STATE -----------------------------
enum State_t { STATE_READY, STATE_ENTERING, STATE_RUNNING, STATE_EXHAUSTED, STATE_BADTOKEN, STATE_WIFI_CONNECTING, STATE_INFO_SCREEN };
State_t state = STATE_WIFI_CONNECTING;
unsigned long infoScreenStart = 0;  // For C/B/# info screens (auto-return after 5s)
int infoScreenType = 0;             // 0=meter, 1=energy, 2=previous token
String lastTokenEntered = "";       // Last token applied (for B = check previous token)

// input buffer for 20-digit token (digits only, spaces added for display)
char inputBuf[21] = {0};  // 20 digits + null terminator
uint8_t inputLen = 0;

// running session
float remaining_kwh = 0.0;
float session_purchased_kwh = 0.0;
// PZEM energy() reading captured at the moment a token is applied.
// consumedKwh (real) = pzem.energy() - pzem_energy_at_session_start
float pzem_energy_at_session_start = 0.0f;
unsigned long lastMillis = 0;
String currentToken = "";  // Store current token for API calls

// keypad debounce
uint8_t lastKeyIndex = 255;
unsigned long lastKeyMillis = 0;
const unsigned long KEY_DEBOUNCE_MS = 80;

// keypad high priority: for 30s after any key press, skip blocking network calls so keypad stays responsive
unsigned long lastKeypadActivityMillis = 0;
const unsigned long KEYPAD_PRIORITY_MS = 30000;

// display timing
unsigned long lastDisplayMillis = 0;
const unsigned long DISPLAY_REFRESH_MS = 500;

// Rotating display screens during STATE_RUNNING
// 0=Energy(remaining/consumed), 1=Voltage+Current, 2=Power+SensorE, 3=Freq+PF, 4=Time
uint8_t runningScreenIdx = 0;
unsigned long lastScreenSwapMillis = 0;
const unsigned long SCREEN_SWAP_MS = 4000;  // rotate every 4 seconds

// API timing
unsigned long lastApiSendMillis = 0;
const unsigned long API_SEND_INTERVAL_MS = 30000;  // Send data every 30 seconds
unsigned long sessionStartTime = 0;

// Token polling timing
unsigned long lastTokenCheckMillis = 0;
const unsigned long TOKEN_CHECK_INTERVAL_MS = 10000;  // Check for pending tokens every 10 seconds

// WiFi connection status
bool wifiConnected = false;

// EEPROM helpers: persist purchased/remaining energy across power loss
void loadEnergyFromEEPROM();
void saveRemainingToEEPROM();
void saveSessionPurchasedToEEPROM();
void savePzemSessionStartToEEPROM();
void saveTokenToEEPROM();

// Forward declarations
void showReadyScreen();
void printHeader(const char* subtitle);
void handleKeypad();
void showRunningScreen();
void showExhaustedScreen();
void showEnteringScreen();
void submitToken();
void connectWiFi();
void sendEnergyDataToAPI();
void sendTestDataToAPI();  // Function to send test data for server testing
void showWiFiConnectingScreen();
void showMeterNumberScreen();
void showCheckEnergyScreen();
void showPreviousTokenScreen();
bool checkForPendingToken();  // Check server for pending token
bool applyTokenFromServer(String tokenNumber, float kwhAmount, String purchaseId);  // Apply token received from server
bool validateTokenFromServer(String tokenNumber);  // Validate token with server
void synchronizeNTPTime();  // Synchronize time with NTP servers
String getFormattedTimestamp();  // Get formatted timestamp (ISO 8601 format)

void setup() {
  Serial.begin(115200);
  delay(50);
  Serial2.begin(9600, SERIAL_8N1, PZEM_RX_PIN, PZEM_TX_PIN);

  display.begin();
  display.setContrast(75);  // Increased brightness (range: 0-127, higher = brighter)
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(BLACK);

  Wire.begin(SDA_PIN, SCL_PIN);
  if (!keypad.begin()) {
    SERIAL_PRINTLN("Error: Couldn't find PCF8574T I2C expander");
    display.clearDisplay();
    display.setCursor(0,0);
    display.println("Keypad Err");
    display.display();
    while (1);
  }

  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);  // Relay OFF (no power to load) until we have energy

  EEPROM.begin(EEPROM_SIZE);
  loadEnergyFromEEPROM();

  // Relay from restored energy: ON if we have remaining, OFF otherwise
  if (remaining_kwh > 0.00001f) {
    digitalWrite(RELAY_PIN, HIGH);  // Relay ON (power to load)
  } else {
    remaining_kwh = 0.0f;
    session_purchased_kwh = 0.0f;
    digitalWrite(RELAY_PIN, LOW);   // Relay OFF (cutoff)
  }

  // Connect to WiFi
  state = STATE_WIFI_CONNECTING;
  showWiFiConnectingScreen();
  connectWiFi();
  
  if (wifiConnected) {
    if (remaining_kwh > 0.00001f) {
      state = STATE_RUNNING;
      digitalWrite(RELAY_PIN, HIGH);
      showRunningScreen();
    } else {
      showReadyScreen();
      state = STATE_READY;
    }
    // Start NTP synchronization
    synchronizeNTPTime();
    
    // Uncomment the line below to send test data on startup (for testing)
    // sendTestDataToAPI();
  } else {
    state = (remaining_kwh > 0.00001f) ? STATE_RUNNING : STATE_READY;
    if (state == STATE_RUNNING) {
      digitalWrite(RELAY_PIN, HIGH);
      showRunningScreen();
    } else {
      showReadyScreen();
    }
  }
}

/**
 * loop() execution order and blocking:
 * 1. handleKeypad() - ONLY keypad poll; if we block below, no keys are seen until we return.
 * 2. WiFi reconnect - can block (delay + connectWiFi up to ~10s).
 * 3. NTP sync - timeClient.update() can block several seconds.
 * 4. checkForPendingToken() every 10s - http.GET() blocks up to timeout (2s).
 * 5. STATE_RUNNING: sendEnergyDataToAPI() every 30s - http.POST() + retry delay block.
 * 6. submitToken() -> validateTokenFromServer() / applyTokenFromServer() - HTTP + delay(2s) block.
 * So: long delays and HTTP calls prevent handleKeypad() from running; keypad is polled only once per loop. Fix: poll keypad during every long delay and again at end of loop.
 */
void loop() {
  handleKeypad();
  unsigned long now = millis();

  // Reconnect WiFi if disconnected - skip during keypad priority (first 30s after any key)
  if (WiFi.status() != WL_CONNECTED) {
    wifiConnected = false;
    bool doReconnect = (now % 10000 < 100);  // every 10s
    if (doReconnect) {
      bool skipForKeypad = (now - lastKeypadActivityMillis < KEYPAD_PRIORITY_MS);
      if (!skipForKeypad) {
      SERIAL_PRINTLN("WiFi disconnected, attempting reconnect...");
      WiFi.reconnect();
      for (int i = 0; i < 20; i++) { handleKeypad(); delay(50); }  // ~1s, keypad stays responsive
      if (WiFi.status() == WL_CONNECTED) {
        wifiConnected = true;
        SERIAL_PRINTLN("WiFi reconnected!");
        // Reinitialize NTP after reconnection
        if (!timeSynchronized) {
          timeClient.begin();
          synchronizeNTPTime();
        }
      } else {
        connectWiFi();
      }
      }
    }
  } else if (!wifiConnected) {
    wifiConnected = true;
    SERIAL_PRINTLN("WiFi reconnected!");
    // Reinitialize NTP after reconnection
    if (!timeSynchronized) {
      timeClient.begin();
      synchronizeNTPTime();
    }
  }
  
  // Keypad priority: for 30s after any key we skip blocking work; then resume normal loop
  bool keypadPriorityActive = (now - lastKeypadActivityMillis < KEYPAD_PRIORITY_MS);
  static bool wasKeypadPriority = false;
  if (!keypadPriorityActive && wasKeypadPriority) {
    Serial.println("[KEYPAD] 30s idle - normal loop resumed");
    wasKeypadPriority = false;
  }
  if (keypadPriorityActive) wasKeypadPriority = true;

  // Synchronize NTP time at WiFi connect (skip during keypad priority so loop stays fast)
  if (wifiConnected && WiFi.status() == WL_CONNECTED && !timeSynchronized) {
    if (!keypadPriorityActive)
      synchronizeNTPTime();
  }

  // Check for pending tokens from server - SKIP during keypad priority (first 30s after any key)
  if (!keypadPriorityActive &&
      (state == STATE_READY || state == STATE_RUNNING) && wifiConnected && WiFi.status() == WL_CONNECTED) {
    if (now - lastTokenCheckMillis >= TOKEN_CHECK_INTERVAL_MS) {
      lastTokenCheckMillis = now;
      checkForPendingToken();
    }
  }

  // Update running energy consumption
  if (state == STATE_RUNNING) {
    if (lastMillis == 0) {
      lastMillis = now;
      sessionStartTime = now;
    }
    unsigned long dt_ms = now - lastMillis;
    if (dt_ms >= 200) {
      float powerW = pzem.power();
      if (!isnan(powerW)) {
        float delta_kwh = (powerW * (dt_ms / 1000.0)) / 3600000.0;
        remaining_kwh -= delta_kwh;
        if (remaining_kwh < 0) remaining_kwh = 0;
      }
      lastMillis = now;
    }

    // Rotate display screen every 4 seconds (auto-advance)
    if (now - lastScreenSwapMillis >= SCREEN_SWAP_MS) {
      runningScreenIdx = (runningScreenIdx + 1) % 5;
      lastScreenSwapMillis = now;
    }
    if (now - lastDisplayMillis >= DISPLAY_REFRESH_MS) {
      showRunningScreen();
      lastDisplayMillis = now;
    }

    // Guard: only proceed with API send and exhaustion check when sensor gives valid readings
    float voltage = pzem.voltage();
    float current = pzem.current();
    if (!isnan(voltage) && !isnan(current)) {

    // Send data to API periodically - SKIP during keypad priority so keypad stays responsive
    if (!keypadPriorityActive &&
        wifiConnected && (now - lastApiSendMillis >= API_SEND_INTERVAL_MS)) {
      sendEnergyDataToAPI();
      lastApiSendMillis = now;
    }

    // Check energy exhausted -> cutoff power (relay OFF)
    if (remaining_kwh <= 0.00001) {
      // Send final data before exhausting (always send)
      if (wifiConnected) {
        sendEnergyDataToAPI();
      }
      digitalWrite(RELAY_PIN, LOW);  // Cutoff power
      saveRemainingToEEPROM();
      state = STATE_EXHAUSTED;
      lastMillis = 0;
      showExhaustedScreen();
    } else {
      // Periodically save remaining to EEPROM so it survives power loss
      static unsigned long lastEepromSave = 0;
      if (now - lastEepromSave >= 5000) {
        lastEepromSave = now;
        saveRemainingToEEPROM();
      }
    }
  }  // end if (!isnan(voltage) && !isnan(current))
  }  // end if (state == STATE_RUNNING)

  if (state == STATE_EXHAUSTED) {
    if (millis() - lastDisplayMillis >= 1000) {
      showExhaustedScreen();
      lastDisplayMillis = millis();
    }
  }

  if (state == STATE_BADTOKEN) {
    static unsigned long badStart = 0;
    if (badStart == 0) badStart = millis();
    if (millis() - badStart >= 2000) {
      badStart = 0;
      state = STATE_READY;
      inputLen = 0;
      inputBuf[0] = '\0';
      showReadyScreen();
    }
  }

  if (state == STATE_WIFI_CONNECTING) {
    if (millis() - lastDisplayMillis >= 1000) {
      showWiFiConnectingScreen();
      lastDisplayMillis = millis();
    }
  }

  // Info screens (C=Energy, B=Prev token, #/*/0=Meter): auto-return to READY after 5s
  if (state == STATE_INFO_SCREEN && (now - infoScreenStart >= 5000)) {
    state = STATE_READY;
    showReadyScreen();
  }

  handleKeypad();  // Poll again so keys are not missed after long stretches
  delay(5);
}

void connectWiFi() {
  SERIAL_PRINT("Connecting to WiFi: ");
  SERIAL_PRINTLN(ssid);
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    for (int i = 0; i < 10; i++) { handleKeypad(); delay(50); }  // ~500ms, keypad stays responsive
    SERIAL_PRINT(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    wifiConnected = true;
    SERIAL_PRINTLN("");
    SERIAL_PRINTLN("WiFi connected!");
    SERIAL_PRINT("IP address: ");
    SERIAL_PRINTLN(WiFi.localIP());
    SERIAL_PRINT("MAC address: ");
    SERIAL_PRINTLN(WiFi.macAddress());
    
    // Initialize NTP client after WiFi connection
    timeClient.begin();
    timeSynchronized = false;
    lastNTPAttempt = 0;
    currentNTPServerIndex = 0;
    ntpRetries = 10;
  } else {
    wifiConnected = false;
    SERIAL_PRINTLN("");
    SERIAL_PRINTLN("WiFi connection failed!");
  }
}

/**
 * Synchronize time with NTP servers
 */
void synchronizeNTPTime() {
  if (timeSynchronized) return; // No need to synchronize if time is already synchronized
  
  if (!wifiConnected || WiFi.status() != WL_CONNECTED) {
    return; // Can't sync without WiFi
  }

  unsigned long currentMillis = millis();
  
  // Check if it's time to retry the NTP request
  if (currentMillis - lastNTPAttempt >= ntpRetryInterval) {
    lastNTPAttempt = currentMillis;

    if (ntpRetries > 0) {
      SERIAL_PRINT("Trying NTP server: ");
      SERIAL_PRINTLN(ntpServers[currentNTPServerIndex]);

      timeClient.setPoolServerName(ntpServers[currentNTPServerIndex]);
      timeClient.begin();

      if (timeClient.update()) {
        SERIAL_PRINTLN("Time synchronized successfully!");
        
        // Get UTC epoch time from NTP (NTPClient initialized with 0 offset)
        unsigned long utcEpoch = timeClient.getEpochTime();
        
        // Manually add timezone offset for Rwanda (GMT+2 = 7200 seconds)
        unsigned long localEpoch = utcEpoch + gmtOffset_sec + daylightOffset_sec;
        
        // Convert to time components
        time_t rawTime = (time_t)localEpoch;
        struct tm *timeInfo = gmtime(&rawTime);
        
        char formattedTime[25];
        snprintf(formattedTime, sizeof(formattedTime), "%04d-%02d-%02dT%02d:%02d:%02d",
                 timeInfo->tm_year + 1900, timeInfo->tm_mon + 1, timeInfo->tm_mday,
                 timeInfo->tm_hour, timeInfo->tm_min, timeInfo->tm_sec);
        
        SERIAL_PRINT("NTP UTC Time: ");
        SERIAL_PRINTLN(utcEpoch);
        SERIAL_PRINT("Local Time (GMT+2): ");
        SERIAL_PRINTLN(formattedTime);
        timeSynchronized = true;
      } else {
        SERIAL_PRINTLN("Failed to get time from this server, retrying...");
        ntpRetries--;
        currentNTPServerIndex = (currentNTPServerIndex + 1) % (sizeof(ntpServers) / sizeof(ntpServers[0]));
        timeClient.end(); // End previous client session
      }
    } else {
      SERIAL_PRINTLN("Unable to synchronize time from all NTP servers.");
      timeSynchronized = true; // Stop retrying
    }
  }
}

/**
 * Get formatted timestamp in ISO 8601 format (YYYY-MM-DDTHH:MM:SS)
 */
String getFormattedTimestamp() {
  if (timeSynchronized && timeClient.isTimeSet()) {
    // Get UTC epoch time from NTP (NTPClient initialized with 0 offset)
    unsigned long utcEpoch = timeClient.getEpochTime();
    
    // Manually add timezone offset for Rwanda (GMT+2 = 7200 seconds)
    unsigned long localEpoch = utcEpoch + gmtOffset_sec + daylightOffset_sec;
    
    // Convert to time components
    time_t rawTime = (time_t)localEpoch;
    struct tm *timeInfo = gmtime(&rawTime);
    
    char formattedTime[25];
    snprintf(formattedTime, sizeof(formattedTime), "%04d-%02d-%02dT%02d:%02d:%02d",
             timeInfo->tm_year + 1900, timeInfo->tm_mon + 1, timeInfo->tm_mday,
             timeInfo->tm_hour, timeInfo->tm_min, timeInfo->tm_sec);
    
    return String(formattedTime);
  } else {
    // Fallback: return placeholder if NTP not synchronized
    SERIAL_PRINTLN("WARNING: NTP not synchronized, using fallback timestamp");
    return "1970-01-01T00:00:00";
  }
}

void sendEnergyDataToAPI() {
  // Check WiFi connection before each request
  if (WiFi.status() != WL_CONNECTED) {
    SERIAL_PRINTLN("WiFi disconnected, attempting reconnect...");
    wifiConnected = false;
    connectWiFi();
    if (WiFi.status() != WL_CONNECTED) {
      SERIAL_PRINTLN("WiFi not connected, skipping API call");
      return;
    }
  }
  wifiConnected = true;

  if (currentToken.length() == 0) {
    SERIAL_PRINTLN("Skipping API send: no active token");
    return;
  }

  HTTPClient http;
  String url = String(apiBaseUrl) + "/energy-data";
  
  http.begin(url);
  http.setTimeout(3000);   // 3s - keep short so keypad stays responsive on failure
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Connection", "close");  // Ensure clean connection

  // Get current PZEM readings
  float voltage = pzem.voltage();
  float current = pzem.current();
  float power = pzem.power();
  float energy = pzem.energy();
  float frequency = pzem.frequency();
  float pf = pzem.pf();

  // Create JSON payload
  DynamicJsonDocument doc(1024);
  doc["meterNumber"] = METER_NUMBER;
  doc["token"] = currentToken;
  doc["clientName"] = CLIENT_NAME;
  if (strlen(CLIENT_TIN) > 0) {
    doc["clientTIN"] = CLIENT_TIN;
  }
  doc["clientPhone"] = CLIENT_PHONE;
  doc["remainingKwh"] = remaining_kwh;
  // consumedKwh = actual PZEM sensor energy since this session's token was applied
  float consumed_kwh = energy - pzem_energy_at_session_start;
  if (isnan(consumed_kwh) || consumed_kwh < 0.0f) consumed_kwh = 0.0f;
  doc["consumedKwh"] = consumed_kwh;
  doc["sessionDuration"] = (millis() - sessionStartTime) / 1000;  // seconds
  
  // Add PZEM readings if valid (V, I, P, total energy, F, PF - for dashboard diagnostics)
  if (!isnan(voltage)) doc["voltage"] = voltage;
  if (!isnan(current)) doc["current"] = current;
  if (!isnan(power)) doc["power"] = power;
  if (!isnan(energy)) doc["totalEnergy"] = energy;
  if (!isnan(frequency)) doc["frequency"] = frequency;
  if (!isnan(pf)) doc["powerFactor"] = pf;
  
  // Add Unix timestamp in milliseconds (NTP synchronized)
  // Database expects Number, not String
  if (timeSynchronized && timeClient.isTimeSet()) {
    unsigned long utcEpoch = timeClient.getEpochTime();
    unsigned long localEpoch = utcEpoch + gmtOffset_sec + daylightOffset_sec;
    doc["timestamp"] = (unsigned long long)localEpoch * 1000;  // Convert to milliseconds
  } else {
    doc["timestamp"] = millis();  // Fallback to millis if NTP not synced
  }
  
  // Also include formatted timestamp as a separate field for readability
  doc["timestampFormatted"] = getFormattedTimestamp();

  String jsonPayload;
  serializeJson(doc, jsonPayload);

  SERIAL_PRINTLN("Sending data to API:");
  SERIAL_PRINTLN(jsonPayload);

  // Retry logic for failed requests
  int httpResponseCode = -1;
  int retries = 0;
  const int maxRetries = 2;
  
  while (httpResponseCode <= 0 && retries < maxRetries) {
    if (retries > 0) {
      SERIAL_PRINT("Retry attempt ");
      SERIAL_PRINT(retries);
      SERIAL_PRINTLN("...");
      for (int i = 0; i < 20; i++) { handleKeypad(); delay(50); }  // ~1s, keypad stays responsive
      
      // Recheck WiFi
      if (WiFi.status() != WL_CONNECTED) {
        SERIAL_PRINTLN("WiFi lost during retry, reconnecting...");
        connectWiFi();
        if (WiFi.status() != WL_CONNECTED) {
          SERIAL_PRINTLN("WiFi reconnection failed");
          http.end();
          return;
        }
      }
    }
    
    httpResponseCode = http.POST(jsonPayload);
    retries++;
  }

  if (httpResponseCode > 0) {
    SERIAL_PRINT("HTTP Response code: ");
    SERIAL_PRINTLN(httpResponseCode);
    String response = http.getString();
    SERIAL_PRINTLN("Response: " + response);
  } else {
    SERIAL_PRINT("Error code: ");
    SERIAL_PRINTLN(httpResponseCode);
    SERIAL_PRINTLN("Failed after retries. WiFi status: " + String(WiFi.status()));
  }

  http.end();
}

/**
 * sendTestDataToAPI()
 * Sends test/simulated energy meter data to the API server for testing purposes
 * This function can be called manually or triggered for testing the server
 */
void sendTestDataToAPI() {
  if (!wifiConnected || WiFi.status() != WL_CONNECTED) {
    SERIAL_PRINTLN("WiFi not connected, skipping test API call");
    return;
  }

  HTTPClient http;
  String url = String(apiBaseUrl) + "/energy-data";
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");

  // Create test JSON payload with simulated data
  DynamicJsonDocument doc(1024);
  doc["meterNumber"] = METER_NUMBER;
  doc["token"] = "18886583547834136861";  // Test token
  doc["clientName"] = CLIENT_NAME;
  if (strlen(CLIENT_TIN) > 0) {
    doc["clientTIN"] = CLIENT_TIN;
  }
  doc["clientPhone"] = CLIENT_PHONE;
  doc["remainingKwh"] = 4.523;  // Test remaining energy
  doc["sessionDuration"] = 120;  // Test session duration in seconds
  
  // Add simulated PZEM readings
  doc["voltage"] = 230.5;      // Test voltage
  doc["current"] = 5.2;        // Test current
  doc["power"] = 1200.0;       // Test power
  doc["totalEnergy"] = 150.5;  // Test total energy
  doc["frequency"] = 50.0;     // Test frequency
  doc["powerFactor"] = 0.95;   // Test power factor
  
  doc["timestamp"] = getFormattedTimestamp();  // ISO 8601 formatted timestamp

  String jsonPayload;
  serializeJson(doc, jsonPayload);

  SERIAL_PRINTLN("========================================");
  SERIAL_PRINTLN("Sending TEST data to API:");
  SERIAL_PRINTLN(jsonPayload);
  SERIAL_PRINTLN("========================================");

  int httpResponseCode = http.POST(jsonPayload);

  if (httpResponseCode > 0) {
    SERIAL_PRINT("Ô£à TEST - HTTP Response code: ");
    SERIAL_PRINTLN(httpResponseCode);
    String response = http.getString();
    SERIAL_PRINTLN("Response: " + response);
  } else {
    SERIAL_PRINT("ÔØî TEST - Error code: ");
    SERIAL_PRINTLN(httpResponseCode);
    SERIAL_PRINTLN("Check server URL and connectivity");
  }

  http.end();
}

/**
 * checkForPendingToken()
 * Checks the server for pending tokens for this meter
 * Returns true if a token was found and applied, false otherwise
 */
bool checkForPendingToken() {
  // Check WiFi connection
  if (WiFi.status() != WL_CONNECTED) {
    wifiConnected = false;
    return false;
  }
  wifiConnected = true;

  HTTPClient http;
  String url = String(apiBaseUrl) + "/purchases/pending-token/" + String(METER_NUMBER);
  
  http.begin(url);
  http.setTimeout(2000);  // 2s - fail fast so keypad is not blocked
  http.addHeader("Connection", "close");

  int httpResponseCode = http.GET();

  if (httpResponseCode == 200) {
    String response = http.getString();
    DynamicJsonDocument doc(512);
    deserializeJson(doc, response);

    if (doc["success"].as<bool>() && doc["hasToken"].as<bool>()) {
      String tokenNumber = doc["token"]["tokenNumber"].as<String>();
      float kwhAmount = doc["token"]["kwhAmount"].as<float>();
      String purchaseId = doc["token"]["purchaseId"].as<String>();

      SERIAL_PRINTLN("Found pending token: " + tokenNumber);
      SERIAL_PRINT("kWh: "); SERIAL_PRINTLN(kwhAmount);

      // Apply the token
      if (applyTokenFromServer(tokenNumber, kwhAmount, purchaseId)) {
        http.end();
        return true;
      }
    }
    // No pending token found - silently continue (don't log every check)
    // Device will maintain current state and remaining energy
  } else {
    // Only log actual errors, not "no token" responses
    SERIAL_PRINT("Error checking pending token: ");
    SERIAL_PRINTLN(httpResponseCode);
  }

  http.end();
  return false;
}

/**
 * applyTokenFromServer()
 * Applies a token received from the server
 * Returns true if successful, false otherwise
 */
bool applyTokenFromServer(String tokenNumber, float kwhAmount, String purchaseId) {
  // Snapshot the PZEM energy reading right now — consumed = pzem.energy() - this baseline
  float current_pzem_e = pzem.energy();
  bool fresh_session = !(state == STATE_RUNNING && remaining_kwh > 0);

  if (!fresh_session) {
    // Already running — top-up: keep existing baseline (consumed keeps accumulating)
    remaining_kwh += kwhAmount;
    SERIAL_PRINT("Top-up: added kWh. Total remaining: ");
    SERIAL_PRINTLN(remaining_kwh);
  } else {
    // Fresh start or after exhaustion — reset baseline to current PZEM reading
    remaining_kwh = kwhAmount;
    if (!isnan(current_pzem_e) && current_pzem_e >= 0.0f) {
      pzem_energy_at_session_start = current_pzem_e;
    } else {
      pzem_energy_at_session_start = 0.0f;
    }
    savePzemSessionStartToEEPROM();
    SERIAL_PRINT("New session baseline PZEM energy: ");
    SERIAL_PRINTLN(pzem_energy_at_session_start);
  }
  currentToken = tokenNumber;
  lastTokenEntered = tokenNumber;
  state = STATE_RUNNING;
  lastMillis = millis();
  sessionStartTime = millis();
  lastDisplayMillis = 0;
  lastApiSendMillis = 0;
  session_purchased_kwh = remaining_kwh;
  saveRemainingToEEPROM();
  saveSessionPurchasedToEEPROM();
  saveTokenToEEPROM();
  digitalWrite(RELAY_PIN, HIGH);  // Power to load
  
  SERIAL_PRINT("Token applied from server, kWh: "); SERIAL_PRINTLN(kwhAmount);
  SERIAL_PRINT("Token: "); SERIAL_PRINTLN(currentToken);

  // Show notification on display
  display.clearDisplay();
  display.setCursor(0,0);
  display.println("Token Applied!");
  display.println("From Server");
  if (state == STATE_RUNNING && remaining_kwh > kwhAmount) {
    // Show that energy was added to existing
    display.print("Added: ");
    display.print(kwhAmount, 2);
    display.println(" kWh");
    display.print("Total: ");
    display.print(remaining_kwh, 2);
    display.println(" kWh");
  } else {
    // New token starting
    display.print("kWh: ");
    display.println(kwhAmount, 2);
  }
  display.display();
  for (int i = 0; i < 40; i++) { handleKeypad(); delay(50); }  // ~2s, keypad stays responsive
  showRunningScreen();

  // Confirm token was applied to server
  HTTPClient http;
  String url = String(apiBaseUrl) + "/purchases/confirm-token/" + purchaseId;
  
  http.begin(url);
  http.setTimeout(2000);
  int httpResponseCode = http.POST("{}");

  if (httpResponseCode > 0) {
    SERIAL_PRINTLN("Token confirmed on server");
  } else {
    SERIAL_PRINT("Failed to confirm token: ");
    SERIAL_PRINTLN(httpResponseCode);
  }
  http.end();

  // Send initial data to API
  if (wifiConnected) {
    sendEnergyDataToAPI();
  }

  return true;
}

/**
 * validateTokenFromServer()
 * Validates a token with the server
 * Returns true if token is valid, false otherwise
 */
bool validateTokenFromServer(String tokenNumber) {
  if (!wifiConnected || WiFi.status() != WL_CONNECTED) {
    return false;
  }

  // Check if this token is pending for this meter
  HTTPClient http;
  String url = String(apiBaseUrl) + "/purchases/pending-token/" + String(METER_NUMBER);
  
  http.begin(url);
  http.setTimeout(2000);  // fail fast so keypad stays responsive

  int httpResponseCode = http.GET();

  if (httpResponseCode == 200) {
    String response = http.getString();
    DynamicJsonDocument doc(512);
    deserializeJson(doc, response);

    if (doc["success"].as<bool>() && doc["hasToken"].as<bool>()) {
      String pendingToken = doc["token"]["tokenNumber"].as<String>();
      if (pendingToken == tokenNumber) {
        // Token matches pending token, apply it
        float kwhAmount = doc["token"]["kwhAmount"].as<float>();
        String purchaseId = doc["token"]["purchaseId"].as<String>();
        http.end();
        return applyTokenFromServer(tokenNumber, kwhAmount, purchaseId);
      }
    }
  }

  http.end();
  return false;
}

void handleKeypad() {
  uint8_t keyIndex = keypad.getKey();
  if (keyIndex < 16) {
    unsigned long now = millis();
    if (keyIndex == lastKeyIndex && (now - lastKeyMillis) < KEY_DEBOUNCE_MS) return;
    lastKeyIndex = keyIndex;
    lastKeyMillis = now;
    lastKeypadActivityMillis = now;  // high priority: next 30s skip blocking network

    char k = keys[keyIndex / COLS][keyIndex % COLS];
    // Always print to Serial for keypad debugging (independent of SERIAL_LOGGING_ENABLED)
    Serial.print("[KEYPAD] Key pressed: ");
    Serial.println(k);
    SERIAL_PRINT("Key: "); SERIAL_PRINTLN(k);

    // When showing info screen (C/B/#), any key returns to READY
    if (state == STATE_INFO_SCREEN) {
      state = STATE_READY;
      showReadyScreen();
      return;
    }

    // EXHAUSTED: A = reset and return to READY (enter new token)
    if (state == STATE_EXHAUSTED && k == 'A') {
      inputLen = 0;
      inputBuf[0] = '\0';
      state = STATE_READY;
      showReadyScreen();
      return;
    }

    // READY: A = start manual token entry. C = Check Energy, B = Previous token, # * 0 = Meter number
    if (state == STATE_READY) {
      if (k == 'A') {
        state = STATE_ENTERING;
        inputLen = 0;
        inputBuf[0] = '\0';
        showEnteringScreen();
        return;
      }
      if (k == 'C') {
        showCheckEnergyScreen();
        state = STATE_INFO_SCREEN;
        infoScreenStart = now;
        infoScreenType = 1;
        return;
      }
      if (k == 'B') {
        showPreviousTokenScreen();
        state = STATE_INFO_SCREEN;
        infoScreenStart = now;
        infoScreenType = 2;
        return;
      }
      if (k == '#' || k == '*' || k == '0') {
        showMeterNumberScreen();
        state = STATE_INFO_SCREEN;
        infoScreenStart = now;
        infoScreenType = 0;
        return;
      }
    }

    // RUNNING: * = next display screen, # = previous screen
    if (state == STATE_RUNNING) {
      if (k == '*') {
        runningScreenIdx = (runningScreenIdx + 1) % 5;
        lastScreenSwapMillis = now;
        showRunningScreen();
        return;
      }
      if (k == '#') {
        runningScreenIdx = (runningScreenIdx + 4) % 5;  // +4 mod 5 = go back one
        lastScreenSwapMillis = now;
        showRunningScreen();
        return;
      }
      // C = Check Energy info screen while running
      if (k == 'C') {
        showCheckEnergyScreen();
        state = STATE_INFO_SCREEN;
        infoScreenStart = now;
        infoScreenType = 1;
        return;
      }
    }

    // ENTERING: 0-9 add digit (auto-submit at 20). D = delete, * = backspace. A = cancel.
    if (k >= '0' && k <= '9') {
      if (state == STATE_READY) {
        state = STATE_ENTERING;
        inputLen = 0;
        inputBuf[0] = '\0';
      }
      if (state == STATE_ENTERING) {
        if (inputLen < 20) {
          inputBuf[inputLen++] = k;
          inputBuf[inputLen] = '\0';
          showEnteringScreen();
          if (inputLen == 20) {
            submitToken();  // Auto-validate with server when WiFi available
          }
        }
      }
    } else if (k == 'D' || k == '*') {
      // D = Delete (backspace), * = backspace
      if (state == STATE_ENTERING && inputLen > 0) {
        inputLen--;
        inputBuf[inputLen] = '\0';
        showEnteringScreen();
        if (inputLen == 0) state = STATE_READY;
      }
    } else if (k == 'A') {
      if (state == STATE_ENTERING) {
        inputLen = 0;
        inputBuf[0] = '\0';
        state = STATE_READY;
        showReadyScreen();
      }
      // In READY, A already handled above (start token entry)
    }
  } else {
    lastKeyIndex = 255;
  }
}

void submitToken() {
  // Input buffer already contains only digits (no spaces)
  String tokenString = String(inputBuf);
  
  if (tokenString.length() != 20) {
    state = STATE_BADTOKEN;
    display.clearDisplay();
    display.setCursor(0,0);
    display.println("INVALID TOKEN!");
    display.println("Must be 20 digits");
    display.println("Returning...");
    display.display();
    SERIAL_PRINTLN("INVALID TOKEN - Wrong length");
    inputLen = 0;
    inputBuf[0] = '\0';
    return;
  }

  bool found = false;
  float kwh = 0.0;
  const char* clientName = CLIENT_NAME;
  const char* clientTIN = CLIENT_TIN;
  const char* clientPhone = CLIENT_PHONE;
  
  for (int i = 0; i < TOKENS_COUNT; ++i) {
    if (tokenString.equals(tokens[i].code)) {
      found = true;
      kwh = tokens[i].kwh;
      clientName = tokens[i].clientName;
      clientTIN = tokens[i].clientTIN;
      clientPhone = tokens[i].clientPhone;
      break;
    }
  }

  // If not found locally, check server if WiFi is available
  if (!found && wifiConnected) {
    SERIAL_PRINTLN("Token not found locally, checking server...");
    display.clearDisplay();
    display.setCursor(0,0);
    display.println("Checking server...");
    display.display();
    
    if (validateTokenFromServer(tokenString)) {
      lastTokenEntered = tokenString;
      inputLen = 0;
      inputBuf[0] = '\0';
      return;
    } else {
      state = STATE_BADTOKEN;
      display.clearDisplay();
      display.setCursor(0,0);
      display.println("BAD TOKEN!");
      display.println("Not found");
      display.println("Returning...");
      display.display();
      SERIAL_PRINTLN("BAD TOKEN - Not found on server either");
      inputLen = 0;
      inputBuf[0] = '\0';
      return;
    }
  } else if (!found) {
    // No WiFi, can't check server
    state = STATE_BADTOKEN;
    display.clearDisplay();
    display.setCursor(0,0);
    display.println("BAD TOKEN!");
    display.println("Not found");
    display.println("No network");
    display.println("Returning...");
    display.display();
    SERIAL_PRINTLN("BAD TOKEN - Not found locally and no WiFi");
    inputLen = 0;
    inputBuf[0] = '\0';
    return;
  }

  // Apply token from local database — snapshot PZEM energy baseline
  float current_pzem_e = pzem.energy();
  remaining_kwh = kwh;
  session_purchased_kwh = kwh;
  if (!isnan(current_pzem_e) && current_pzem_e >= 0.0f) {
    pzem_energy_at_session_start = current_pzem_e;
  } else {
    pzem_energy_at_session_start = 0.0f;
  }
  currentToken = tokenString;
  lastTokenEntered = tokenString;
  state = STATE_RUNNING;
  lastMillis = millis();
  sessionStartTime = millis();
  lastDisplayMillis = 0;
  lastApiSendMillis = 0;
  saveRemainingToEEPROM();
  saveSessionPurchasedToEEPROM();
  savePzemSessionStartToEEPROM();
  saveTokenToEEPROM();
  SERIAL_PRINT("Local token: PZEM baseline = "); SERIAL_PRINTLN(pzem_energy_at_session_start);
  digitalWrite(RELAY_PIN, HIGH);  // Power to load
  showRunningScreen();
  SERIAL_PRINT("Token accepted, kWh: "); SERIAL_PRINTLN(kwh);
  SERIAL_PRINT("Token: "); SERIAL_PRINTLN(currentToken);

  // Send initial data to API
  if (wifiConnected) {
    sendEnergyDataToAPI();
  }

  inputLen = 0;
  inputBuf[0] = '\0';
}

// Display functions
void showReadyScreen() {
  display.clearDisplay();
  display.setCursor(0, 0);
  printHeader("-- READY --");
  display.print("Meter:");
  display.println(METER_NUMBER);
  display.println("A=Token C=Energy");
  display.println("B=Prev #=MeterNo");
  display.display();
}

void showEnteringScreen() {
  display.clearDisplay();
  display.setCursor(0, 0);
  printHeader("ENTER TOKEN");
  display.print(">");
  
  // Display token with formatting (add spaces every 4 digits)
  for (uint8_t i = 0; i < inputLen; ++i) {
    display.print(inputBuf[i]);
    // Add space after every 4 digits (after positions 3, 7, 11, 15)
    if ((i + 1) % 4 == 0 && i < 19) {
      display.print(' ');
    }
  }
  
  // Show remaining placeholders with spaces
  int remainingDigits = 20 - inputLen;
  for (int i = 0; i < remainingDigits; ++i) {
    display.print('_');
    // Add space after every 4 digits
    if ((inputLen + i + 1) % 4 == 0 && (inputLen + i) < 19) {
      display.print(' ');
    }
  }
  
  display.println("");
  display.println("D=Delete *=BkSp A=Cancel");
  display.display();
}

// Print brand header + screen subtitle on every screen
// Nokia 5110: 14 chars per row at text size 1
void printHeader(const char* subtitle) {
  display.println("SMART METER ");  // brand line (fits 14+2 wrap, looks fine)
  display.println(subtitle);
  display.println("-------------");
}


void showRunningScreen() {
  float sensor_kwh = pzem.energy();
  // consumed = actual PZEM energy since this session token was applied
  float consumed_kwh = sensor_kwh - pzem_energy_at_session_start;
  if (isnan(consumed_kwh) || consumed_kwh < 0.0f) consumed_kwh = 0.0f;
  float voltage    = pzem.voltage();
  float current_a  = pzem.current();
  float power_w    = pzem.power();
  float frequency  = pzem.frequency();
  float pf         = pzem.pf();

  display.clearDisplay();
  display.setCursor(0, 0);

  switch (runningScreenIdx) {
    // ---- Screen 0: Energy (remaining / consumed / sensor total) ----
    case 0:
      printHeader("ENERGY");
      display.print("Rem:");
      if (remaining_kwh < 10.0f) display.print(remaining_kwh, 3);
      else display.print(remaining_kwh, 2);
      display.println("kWh");
      display.print("Used:");
      if (consumed_kwh < 10.0f) display.print(consumed_kwh, 3);
      else display.print(consumed_kwh, 2);
      display.println("kWh");
      display.print("Tot:");
      if (!isnan(sensor_kwh)) display.print(sensor_kwh, 3);
      else display.print("--");
      display.println("kWh");
      break;

    // ---- Screen 1: Voltage + Current ----
    case 1:
      printHeader("VOLTAGE-CURRENT");
      display.print("V: ");
      if (!isnan(voltage)) { display.print(voltage, 1); display.println(" V"); }
      else display.println("-- V");
      display.print("I: ");
      if (!isnan(current_a)) { display.print(current_a, 3); display.println(" A"); }
      else display.println("-- A");
      display.println(wifiConnected ? "WiFi: ON" : "WiFi: OFF");
      break;

    // ---- Screen 2: Power + Sensor Energy ----
    case 2:
      printHeader("POWER-ENERGY");
      display.print("P: ");
      if (!isnan(power_w)) { display.print(power_w, 1); display.println(" W"); }
      else display.println("-- W");
      display.print("E: ");
      if (!isnan(sensor_kwh)) { display.print(sensor_kwh, 3); display.println("kWh"); }
      else display.println("-- kWh");
      break;

    // ---- Screen 3: Frequency + Power Factor ----
    case 3:
      printHeader("AC PARAMS");
      display.print("Hz: ");
      if (!isnan(frequency)) display.println(frequency, 2);
      else display.println("--");
      display.print("PF: ");
      if (!isnan(pf)) display.println(pf, 2);
      else display.println("--");
      display.println(wifiConnected ? "WiFi: ON" : "WiFi: OFF");
      break;

    // ---- Screen 4: Date / Time ----
    case 4:
      printHeader("DATE-TIME");
      if (timeSynchronized && timeClient.isTimeSet()) {
        unsigned long utcEpoch = timeClient.getEpochTime();
        unsigned long localEpoch = utcEpoch + gmtOffset_sec + daylightOffset_sec;
        time_t rawTime = (time_t)localEpoch;
        struct tm *ti = gmtime(&rawTime);
        char timeBuf[10], dateBuf[12];
        snprintf(timeBuf, sizeof(timeBuf), "%02d:%02d:%02d",
                 ti->tm_hour, ti->tm_min, ti->tm_sec);
        snprintf(dateBuf, sizeof(dateBuf), "%04d-%02d-%02d",
                 ti->tm_year + 1900, ti->tm_mon + 1, ti->tm_mday);
        display.println(timeBuf);
        display.println(dateBuf);
        display.println("GMT+2");
      } else {
        display.println("Not synced");
        display.print("Meter:");
        display.println(METER_NUMBER);
      }
      break;

    default:
      runningScreenIdx = 0;
      break;
  }

  display.display();
}

void showExhaustedScreen() {
  display.clearDisplay();
  display.setCursor(0, 0);
  printHeader("!! EXHAUSTED !!");
  display.println("No balance left.");
  display.println("Press A to reset");
  display.display();
}

void showMeterNumberScreen() {
  display.clearDisplay();
  display.setCursor(0, 0);
  printHeader("METER NUMBER");
  display.println(METER_NUMBER);
  display.println("Any key to return");
  display.display();
}

void showCheckEnergyScreen() {
  float sensor_kwh = pzem.energy();
  float power_w    = pzem.power();
  // Consumed = PZEM energy since this token was applied (same formula as API payload)
  float consumed_kwh = sensor_kwh - pzem_energy_at_session_start;
  if (isnan(consumed_kwh) || consumed_kwh < 0.0f) consumed_kwh = 0.0f;

  display.clearDisplay();
  display.setCursor(0, 0);
  printHeader("CHECK ENERGY");

  // Consumed since token applied
  display.print("Consumed: ");
  if (consumed_kwh < 10.0f) display.print(consumed_kwh, 3);
  else display.print(consumed_kwh, 2);
  display.println(" kWh");

  // PZEM total since meter powered on
  display.print("Total E: ");
  if (!isnan(sensor_kwh)) { display.print(sensor_kwh, 3); display.println("kWh"); }
  else display.println("-- kWh");

  // Remaining token balance
  display.print("Balance: ");
  if (remaining_kwh < 10.0f) display.print(remaining_kwh, 3);
  else display.print(remaining_kwh, 2);
  display.println(" kWh");

  display.display();
}

void showPreviousTokenScreen() {
  display.clearDisplay();
  display.setCursor(0, 0);
  printHeader("PREV TOKEN");
  if (lastTokenEntered.length() == 20) {
    for (int i = 0; i < 20; i++) {
      display.print(lastTokenEntered[i]);
      if ((i + 1) % 4 == 0 && i < 19) display.print(' ');
    }
    display.println("");
  } else {
    display.println("(none yet)");
  }
  display.println("(Any key or 5s to return)");
  display.display();
}

void showWiFiConnectingScreen() {
  display.clearDisplay();
  display.setCursor(0, 0);
  printHeader("CONNECTING...");
  display.println("WiFi");
  display.println("Please wait...");
  display.display();
}

// --------------------- EEPROM persistence ------------------
void loadEnergyFromEEPROM() {
  float r = 0.0f, s = 0.0f, p = 0.0f;
  EEPROM.get(EEPROM_ADDR_REMAINING_KWH, r);
  EEPROM.get(EEPROM_ADDR_SESSION_PURCHASED, s);
  EEPROM.get(EEPROM_ADDR_PZEM_SESSION_START, p);
  if (!isnan(r) && r >= 0.0f) remaining_kwh = r;
  if (!isnan(s) && s >= 0.0f) session_purchased_kwh = s;
  if (!isnan(p) && p >= 0.0f) pzem_energy_at_session_start = p;
  // Restore active token so API sends survive reboots
  char savedToken[21] = {0};
  EEPROM.get(EEPROM_ADDR_TOKEN, savedToken);
  savedToken[20] = '\0';
  if (savedToken[0] >= '0' && savedToken[0] <= '9') {
    currentToken = String(savedToken);
    lastTokenEntered = currentToken;
    SERIAL_PRINT("Restored token from EEPROM: "); SERIAL_PRINTLN(currentToken);
  }
}

void saveRemainingToEEPROM() {
  EEPROM.put(EEPROM_ADDR_REMAINING_KWH, remaining_kwh);
  EEPROM.commit();
}

void saveSessionPurchasedToEEPROM() {
  EEPROM.put(EEPROM_ADDR_SESSION_PURCHASED, session_purchased_kwh);
  EEPROM.commit();
}

void savePzemSessionStartToEEPROM() {
  EEPROM.put(EEPROM_ADDR_PZEM_SESSION_START, pzem_energy_at_session_start);
  EEPROM.commit();
}

void saveTokenToEEPROM() {
  char buf[21] = {0};
  currentToken.toCharArray(buf, sizeof(buf));
  EEPROM.put(EEPROM_ADDR_TOKEN, buf);
  EEPROM.commit();
}
