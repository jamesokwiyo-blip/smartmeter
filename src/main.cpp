#include <Arduino.h>

// Combined sketch: PZEM + Nokia 5110 + PCF8574T Keypad + token logic + WiFi + API
#include <PZEM004Tv30.h>
#include <Adafruit_GFX.h>
#include <Adafruit_PCD8544.h>
#include <Wire.h>
#include <AdvKeyPad.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
// C library includes for string and math helpers used by strcmp/isnan
#include <string.h>
#include <math.h>

// --------------------- WIFI CONFIG ---------------------
const char* ssid = "YOUR_WIFI_SSID";           // Change this
const char* password = "YOUR_WIFI_PASSWORD";     // Change this
const char* apiBaseUrl = "http://your-server.com/api";  // Change this

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

// input buffer for 20-digit token (with spaces: 4-4-4-4-4 format)
char inputBuf[25] = {0};  // 20 digits + 4 spaces + null terminator
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
String removeSpaces(String str);
void showWiFiConnectingScreen();

void setup() {
  Serial.begin(115200);
  delay(50);
  Serial2.begin(9600, SERIAL_8N1, PZEM_RX_PIN, PZEM_TX_PIN);

  display.begin();
  display.setContrast(55);
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
  connectWiFi();
  
  if (wifiConnected) {
    showReadyScreen();
    state = STATE_READY;
  } else {
    state = STATE_READY;  // Continue without WiFi
    showReadyScreen();
  }
}

void loop() {
  handleKeypad();
  unsigned long now = millis();

  // Reconnect WiFi if disconnected
  if (!wifiConnected && WiFi.status() != WL_CONNECTED) {
    if (now % 10000 < 100) {  // Check every 10 seconds
      connectWiFi();
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
  } else {
    wifiConnected = false;
    Serial.println("");
    Serial.println("WiFi connection failed!");
  }
}

void sendEnergyDataToAPI() {
  if (!wifiConnected || WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi not connected, skipping API call");
    return;
  }

  HTTPClient http;
  String url = String(apiBaseUrl) + "/energy-data";
  
  http.begin(url);
  http.addHeader("Content-Type", "application/json");

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
  
  doc["timestamp"] = millis();  // Unix timestamp in milliseconds

  String jsonPayload;
  serializeJson(doc, jsonPayload);

  Serial.println("Sending data to API:");
  Serial.println(jsonPayload);

  int httpResponseCode = http.POST(jsonPayload);

  if (httpResponseCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    String response = http.getString();
    Serial.println("Response: " + response);
  } else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }

  http.end();
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

    // Ignore B and C
    if (k == 'B' || k == 'C') return;

    if (k >= '0' && k <= '9') {
      if (state == STATE_READY) {
        state = STATE_ENTERING;
        inputLen = 0;
        inputBuf[0] = '\0';
      }
      if (state == STATE_ENTERING) {
        // 20 digits total, with spaces at positions 4, 9, 14, 19
        // Format: XXXX XXXX XXXX XXXX XXXX
        if (inputLen < 24) {  // 20 digits + 4 spaces
          // Add space after every 4 digits (positions 4, 9, 14, 19)
          if (inputLen > 0 && (inputLen % 5 == 4)) {
            inputBuf[inputLen++] = ' ';
          }
          inputBuf[inputLen++] = k;
          inputBuf[inputLen] = '\0';
          showEnteringScreen();
          // Auto-submit when 20 digits entered (24 chars with spaces)
          if (inputLen == 24) {
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
  // Remove spaces from input for comparison
  String tokenWithoutSpaces = removeSpaces(String(inputBuf));
  
  if (tokenWithoutSpaces.length() != 20) {
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
    if (tokenWithoutSpaces.equals(tokens[i].code)) {
      found = true;
      kwh = tokens[i].kwh;
      clientName = tokens[i].clientName;
      clientTIN = tokens[i].clientTIN;
      clientPhone = tokens[i].clientPhone;
      break;
    }
  }

  if (!found) {
    state = STATE_BADTOKEN;
    display.clearDisplay();
    display.setCursor(0,0);
    display.println("BAD TOKEN!");
    display.println("Not found");
    display.println("Returning...");
    display.display();
    Serial.println("BAD TOKEN - Not found in database");
    inputLen = 0;
    inputBuf[0] = '\0';
    return;
  }

  remaining_kwh = kwh;
  currentToken = tokenWithoutSpaces;
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

String removeSpaces(String str) {
  String result = "";
  for (unsigned int i = 0; i < str.length(); i++) {
    if (str[i] != ' ') {
      result += str[i];
    }
  }
  return result;
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
  
  // Display token with formatting
  int digitCount = 0;
  for (uint8_t i = 0; i < inputLen; ++i) {
    if (inputBuf[i] != ' ') {
      display.print(inputBuf[i]);
      digitCount++;
      if (digitCount % 4 == 0 && digitCount < 20) {
        display.print(' ');
      }
    } else {
      display.print(' ');
    }
  }
  
  // Show remaining placeholders
  int remainingDigits = 20 - digitCount;
  for (int i = 0; i < remainingDigits; ++i) {
    if (i > 0 && i % 4 == 0) display.print(' ');
    display.print('_');
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
