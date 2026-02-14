#include <Arduino.h>

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
// C library includes for string and math helpers used by strcmp/isnan
#include <string.h>
#include <math.h>

// --------------------- WIFI CONFIG ---------------------
// WiFi credentials - can be changed here or via serial input
const char* ssid = "Airtel_4G_SMARTCONNECT_F812";  // Change this to your WiFi SSID
const char* password = "9B9F0F52";  // Change this to your WiFi password
// Smartmeter backend (port 5000). 
// PC IP: 192.168.1.120 (same network as ESP32)
const char* apiBaseUrl = "http://192.168.1.120:5000/api";

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

// --------------------- METER CONFIG ---------------------
const char* METER_NUMBER = "0215002079873";  // 13-digit meter number

// --------------------- CLIENT CONFIG ---------------------
const char* CLIENT_NAME = "YUMVUHORE";
const char* CLIENT_TIN = "";  // Optional, leave empty if not available
const char* CLIENT_PHONE = "0782946444";

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

// --------------------- LED -------------------------------
#define LED_PIN 2

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
  {"18886583547834136861", 5.0, "YUMVUHORE", "", "0782946444"},
  {"12345678901234567890", 10.0, "YUMVUHORE", "", "0782946444"},
  {"98765432109876543210", 25.0, "YUMVUHORE", "", "0782946444"}
};
const int TOKENS_COUNT = sizeof(tokens) / sizeof(tokens[0]);

// --------------------- STATE -----------------------------
enum State_t { STATE_READY, STATE_ENTERING, STATE_RUNNING, STATE_EXHAUSTED, STATE_BADTOKEN, STATE_WIFI_CONNECTING };
State_t state = STATE_WIFI_CONNECTING;

// input buffer for 20-digit token (digits only, spaces added for display)
char inputBuf[21] = {0};  // 20 digits + null terminator
uint8_t inputLen = 0;

// running session
float remaining_kwh = 0.0;
unsigned long lastMillis = 0;
String currentToken = "";  // Store current token for API calls

// keypad debounce
uint8_t lastKeyIndex = 255;
unsigned long lastKeyMillis = 0;
const unsigned long KEY_DEBOUNCE_MS = 80;

// display timing
unsigned long lastDisplayMillis = 0;
const unsigned long DISPLAY_REFRESH_MS = 500;

// API timing
unsigned long lastApiSendMillis = 0;
const unsigned long API_SEND_INTERVAL_MS = 30000;  // Send data every 30 seconds
unsigned long sessionStartTime = 0;

// Token polling timing
unsigned long lastTokenCheckMillis = 0;
const unsigned long TOKEN_CHECK_INTERVAL_MS = 10000;  // Check for pending tokens every 10 seconds

// WiFi connection status
bool wifiConnected = false;

// Forward declarations
void showReadyScreen();
void handleKeypad();
void showRunningScreen();
void showExhaustedScreen();
void blinkLED();
void showEnteringScreen();
void submitToken();
void connectWiFi();
void sendEnergyDataToAPI();
void sendTestDataToAPI();  // Function to send test data for server testing
void showWiFiConnectingScreen();
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
    Serial.println("Error: Couldn't find PCF8574T I2C expander");
    display.clearDisplay();
    display.setCursor(0,0);
    display.println("Keypad Err");
    display.display();
    while (1);
  }

  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  // Connect to WiFi
  state = STATE_WIFI_CONNECTING;
  showWiFiConnectingScreen();
  connectWiFi();
  
  if (wifiConnected) {
    showReadyScreen();
    state = STATE_READY;
    
    // Start NTP synchronization
    synchronizeNTPTime();
    
    // Uncomment the line below to send test data on startup (for testing)
    // sendTestDataToAPI();
  } else {
    state = STATE_READY;  // Continue without WiFi
    showReadyScreen();
  }
}

void loop() {
  handleKeypad();
  unsigned long now = millis();

  // Reconnect WiFi if disconnected
  if (WiFi.status() != WL_CONNECTED) {
    wifiConnected = false;
    if (now % 10000 < 100) {  // Check every 10 seconds
      Serial.println("WiFi disconnected, attempting reconnect...");
      WiFi.reconnect();
      delay(1000);
      if (WiFi.status() == WL_CONNECTED) {
        wifiConnected = true;
        Serial.println("WiFi reconnected!");
        // Reinitialize NTP after reconnection
        if (!timeSynchronized) {
          timeClient.begin();
          synchronizeNTPTime();
        }
      } else {
        // If reconnect fails, use WiFiManager
        connectWiFi();
      }
    }
  } else if (!wifiConnected) {
    wifiConnected = true;
    Serial.println("WiFi reconnected!");
    // Reinitialize NTP after reconnection
    if (!timeSynchronized) {
      timeClient.begin();
      synchronizeNTPTime();
    }
  }
  
  // Synchronize NTP time if WiFi is connected
  if (wifiConnected && WiFi.status() == WL_CONNECTED && !timeSynchronized) {
    synchronizeNTPTime();
  }

  // Check for pending tokens from server (when ready or running, and WiFi connected)
  // This allows new tokens to be applied even while a token is currently running
  if ((state == STATE_READY || state == STATE_RUNNING) && wifiConnected && WiFi.status() == WL_CONNECTED) {
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

    // Display remaining energy
    if (now - lastDisplayMillis >= DISPLAY_REFRESH_MS) {
      showRunningScreen();
      lastDisplayMillis = now;
    }

    // Output AC parameters on Serial monitor
    float voltage = pzem.voltage();
    float current = pzem.current();
    float frequency = pzem.frequency();
    float pf = pzem.pf();
    if (!isnan(voltage) && !isnan(current) && !isnan(frequency) && !isnan(pf)) {
      Serial.print("V:"); Serial.print(voltage); Serial.print("V ");
      Serial.print("I:"); Serial.print(current); Serial.print("A ");
      Serial.print("F:"); Serial.print(frequency); Serial.print("Hz ");
      Serial.print("PF:"); Serial.println(pf);
    }

    // Send data to API periodically
    if (wifiConnected && (now - lastApiSendMillis >= API_SEND_INTERVAL_MS)) {
      sendEnergyDataToAPI();
      lastApiSendMillis = now;
    }

    // Check energy exhausted
    if (remaining_kwh <= 0.00001) {
      // Send final data before exhausting
      if (wifiConnected) {
        sendEnergyDataToAPI();
      }
      state = STATE_EXHAUSTED;
      lastMillis = 0;
      showExhaustedScreen();
    }
  }

  if (state == STATE_EXHAUSTED) {
    blinkLED();
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

  delay(5);
}

void connectWiFi() {
  Serial.print("Connecting to WiFi: ");
  Serial.println(ssid);
  
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  
  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    wifiConnected = true;
    Serial.println("");
    Serial.println("WiFi connected!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
    Serial.print("MAC address: ");
    Serial.println(WiFi.macAddress());
    
    // Initialize NTP client after WiFi connection
    timeClient.begin();
    timeSynchronized = false;
    lastNTPAttempt = 0;
    currentNTPServerIndex = 0;
    ntpRetries = 10;
  } else {
    wifiConnected = false;
    Serial.println("");
    Serial.println("WiFi connection failed!");
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
      Serial.print("Trying NTP server: ");
      Serial.println(ntpServers[currentNTPServerIndex]);

      timeClient.setPoolServerName(ntpServers[currentNTPServerIndex]);
      timeClient.begin();

      if (timeClient.update()) {
        Serial.println("Time synchronized successfully!");
        
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
        
        Serial.print("NTP UTC Time: ");
        Serial.println(utcEpoch);
        Serial.print("Local Time (GMT+2): ");
        Serial.println(formattedTime);
        timeSynchronized = true;
      } else {
        Serial.println("Failed to get time from this server, retrying...");
        ntpRetries--;
        currentNTPServerIndex = (currentNTPServerIndex + 1) % (sizeof(ntpServers) / sizeof(ntpServers[0]));
        timeClient.end(); // End previous client session
      }
    } else {
      Serial.println("Unable to synchronize time from all NTP servers.");
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
    Serial.println("WARNING: NTP not synchronized, using fallback timestamp");
    return "1970-01-01T00:00:00";
  }
}

void sendEnergyDataToAPI() {
  // Check WiFi connection before each request
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected, attempting reconnect...");
    wifiConnected = false;
    connectWiFi();
    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("WiFi not connected, skipping API call");
      return;
    }
  }
  wifiConnected = true;

  HTTPClient http;
  String url = String(apiBaseUrl) + "/energy-data";
  
  http.begin(url);
  http.setTimeout(10000);  // 10 second timeout
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
  doc["sessionDuration"] = (millis() - sessionStartTime) / 1000;  // seconds
  
  // Add PZEM readings if valid
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

  Serial.println("Sending data to API:");
  Serial.println(jsonPayload);

  // Retry logic for failed requests
  int httpResponseCode = -1;
  int retries = 0;
  const int maxRetries = 2;
  
  while (httpResponseCode <= 0 && retries < maxRetries) {
    if (retries > 0) {
      Serial.print("Retry attempt ");
      Serial.print(retries);
      Serial.println("...");
      delay(1000);  // Wait before retry
      
      // Recheck WiFi
      if (WiFi.status() != WL_CONNECTED) {
        Serial.println("WiFi lost during retry, reconnecting...");
        connectWiFi();
        if (WiFi.status() != WL_CONNECTED) {
          Serial.println("WiFi reconnection failed");
          http.end();
          return;
        }
      }
    }
    
    httpResponseCode = http.POST(jsonPayload);
    retries++;
  }

  if (httpResponseCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    String response = http.getString();
    Serial.println("Response: " + response);
  } else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
    Serial.println("Failed after retries. WiFi status: " + String(WiFi.status()));
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
    Serial.println("WiFi not connected, skipping test API call");
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

  Serial.println("========================================");
  Serial.println("Sending TEST data to API:");
  Serial.println(jsonPayload);
  Serial.println("========================================");

  int httpResponseCode = http.POST(jsonPayload);

  if (httpResponseCode > 0) {
    Serial.print("✅ TEST - HTTP Response code: ");
    Serial.println(httpResponseCode);
    String response = http.getString();
    Serial.println("Response: " + response);
  } else {
    Serial.print("❌ TEST - Error code: ");
    Serial.println(httpResponseCode);
    Serial.println("Check server URL and connectivity");
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
  http.setTimeout(8000);  // 8 second timeout
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

      Serial.println("Found pending token: " + tokenNumber);
      Serial.print("kWh: "); Serial.println(kwhAmount);

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
    Serial.print("Error checking pending token: ");
    Serial.println(httpResponseCode);
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
  // Apply the token (add to existing remaining energy if already running)
  if (state == STATE_RUNNING && remaining_kwh > 0) {
    // If already running, add new token energy to existing balance
    remaining_kwh += kwhAmount;
    Serial.print("Added new token energy. Total remaining: ");
    Serial.println(remaining_kwh);
  } else {
    // Starting fresh or exhausted, set new energy
    remaining_kwh = kwhAmount;
  }
  currentToken = tokenNumber;
  state = STATE_RUNNING;
  lastMillis = millis();
  sessionStartTime = millis();
  lastDisplayMillis = 0;
  lastApiSendMillis = 0;
  digitalWrite(LED_PIN, HIGH);
  
  Serial.print("Token applied from server, kWh: "); Serial.println(kwhAmount);
  Serial.print("Token: "); Serial.println(currentToken);

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
  delay(2000);
  showRunningScreen();

  // Confirm token was applied to server
  HTTPClient http;
  String url = String(apiBaseUrl) + "/purchases/confirm-token/" + purchaseId;
  
  http.begin(url);
  http.setTimeout(5000);
  int httpResponseCode = http.POST("{}");

  if (httpResponseCode > 0) {
    Serial.println("Token confirmed on server");
  } else {
    Serial.print("Failed to confirm token: ");
    Serial.println(httpResponseCode);
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
  http.setTimeout(5000);

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

    char k = keys[keyIndex / COLS][keyIndex % COLS];
    Serial.print("Key: "); Serial.println(k);

    // Key B: Send test data to API (for testing server)
    if (k == 'B') {
      if (wifiConnected) {
        Serial.println("Key B pressed - Sending test data to API");
        sendTestDataToAPI();
        display.clearDisplay();
        display.setCursor(0,0);
        display.println("Energy Meter");
        display.println("----------------");
        display.println("Test data sent!");
        display.println("Check Serial");
        display.display();
        delay(2000);
        if (state == STATE_READY) {
          showReadyScreen();
        } else {
          showEnteringScreen();
        }
      } else {
        Serial.println("WiFi not connected - Cannot send test data");
        display.clearDisplay();
        display.setCursor(0,0);
        display.println("Energy Meter");
        display.println("----------------");
        display.println("WiFi not connected");
        display.println("Cannot test API");
        display.display();
        delay(2000);
        if (state == STATE_READY) {
          showReadyScreen();
        } else {
          showEnteringScreen();
        }
      }
      return;
    }
    
    // Ignore C
    if (k == 'C') return;

    if (k >= '0' && k <= '9') {
      if (state == STATE_READY) {
        state = STATE_ENTERING;
        inputLen = 0;
        inputBuf[0] = '\0';
      }
      if (state == STATE_ENTERING) {
        // 20 digits total - store only digits in buffer (spaces added only for display)
        // Format: XXXX XXXX XXXX XXXX XXXX (display format)
        if (inputLen < 20) {  // Allow up to 20 digits
          inputBuf[inputLen++] = k;
          inputBuf[inputLen] = '\0';
          showEnteringScreen();
          // Auto-submit when 20 digits entered
          if (inputLen == 20) {
            submitToken();
          }
        }
      }
    } else if (k == 'D') {
      if (state == STATE_ENTERING && inputLen >= 20) {  // At least 20 digits
        submitToken();
      }
    } else if (k == 'A') {
      inputLen = 0; 
      inputBuf[0] = '\0';
      remaining_kwh = 0;
      currentToken = "";
      state = STATE_READY;
      digitalWrite(LED_PIN, LOW);
      showReadyScreen();
    } else if (k == '*') {
      if (state == STATE_ENTERING && inputLen > 0) {
        inputLen--;
        inputBuf[inputLen] = '\0';
        showEnteringScreen();
        if (inputLen == 0) state = STATE_READY;
      }
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
    Serial.println("INVALID TOKEN - Wrong length");
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
    Serial.println("Token not found locally, checking server...");
    display.clearDisplay();
    display.setCursor(0,0);
    display.println("Checking server...");
    display.display();
    
    if (validateTokenFromServer(tokenString)) {
      // Token validated and applied by server, return early
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
      Serial.println("BAD TOKEN - Not found on server either");
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
    Serial.println("BAD TOKEN - Not found locally and no WiFi");
    inputLen = 0;
    inputBuf[0] = '\0';
    return;
  }

  // Apply token from local database
  remaining_kwh = kwh;
  currentToken = tokenString;
  state = STATE_RUNNING;
  lastMillis = millis();
  sessionStartTime = millis();
  lastDisplayMillis = 0;
  lastApiSendMillis = 0;
  digitalWrite(LED_PIN, HIGH);
  showRunningScreen();
  Serial.print("Token accepted, kWh: "); Serial.println(kwh);
  Serial.print("Token: "); Serial.println(currentToken);

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
  display.setCursor(0,0);
  display.println("Energy Meter");
  display.println("----------------");
  display.print("Meter: ");
  display.println(METER_NUMBER);
  display.println("Status: READY");
  display.println("");
  display.println("Enter 20-digit token");
  display.display();
}

void showEnteringScreen() {
  display.clearDisplay();
  display.setCursor(0,0);
  display.println("Energy Meter");
  display.println("----------------");
  display.print("Token: ");
  
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
  display.println("D=Submit  A=Clear");
  display.display();
}

void showRunningScreen() {
  display.clearDisplay();
  display.setCursor(0,0);
  display.println("Energy Meter");
  display.println("----------------");
  display.print("Remaining: ");
  if (remaining_kwh < 10.0) display.print(remaining_kwh, 3);
  else display.print(remaining_kwh, 2);
  display.println(" kWh");
  display.print("Meter: ");
  display.println(METER_NUMBER);
  if (wifiConnected) {
    display.println("WiFi: ON");
  } else {
    display.println("WiFi: OFF");
  }
  display.display();
}

void showExhaustedScreen() {
  display.clearDisplay();
  display.setCursor(0,0);
  display.println("Energy Meter");
  display.println("----------------");
  display.println("ENERGY EXHAUSTED");
  display.println("");
  display.println("Press A to reset");
  display.display();
}

void showWiFiConnectingScreen() {
  display.clearDisplay();
  display.setCursor(0,0);
  display.println("Energy Meter");
  display.println("----------------");
  display.println("Connecting WiFi");
  display.println("Please wait...");
  display.display();
}

void blinkLED() {
  unsigned long t = millis() / 500;
  if (t % 2 == 0) digitalWrite(LED_PIN, HIGH);
  else digitalWrite(LED_PIN, LOW);
}
