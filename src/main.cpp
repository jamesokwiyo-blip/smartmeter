#include <Arduino.h>

// Combined sketch: PZEM + Nokia 5110 + PCF8574T Keypad + token logic
#include <PZEM004Tv30.h>
#include <Adafruit_GFX.h>
#include <Adafruit_PCD8544.h>
#include <Wire.h>
#include <AdvKeyPad.h>
// C library includes for string and math helpers used by strcmp/isnan
#include <string.h>
#include <math.h>

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
struct Token { const char *code; float kwh; };
Token tokens[] = {
  {"12345", 5.0},
  {"54321", 10.0},
  {"00001", 25.0},
  {"55555", 2.0},
  {"00002", 20.0}
};
const int TOKENS_COUNT = sizeof(tokens) / sizeof(tokens[0]);

// --------------------- STATE -----------------------------
enum State_t { STATE_READY, STATE_ENTERING, STATE_RUNNING, STATE_EXHAUSTED, STATE_BADTOKEN };
State_t state = STATE_READY;

// input buffer
char inputBuf[6] = {0};
uint8_t inputLen = 0;

// running session
float remaining_kwh = 0.0;
unsigned long lastMillis = 0;

// keypad debounce
uint8_t lastKeyIndex = 255;
unsigned long lastKeyMillis = 0;
const unsigned long KEY_DEBOUNCE_MS = 80;

// display timing
unsigned long lastDisplayMillis = 0;
const unsigned long DISPLAY_REFRESH_MS = 500;

// Forward declarations (prototypes) for functions used before their definitions
void showReadyScreen();
void handleKeypad();
void showRunningScreen();
void showExhaustedScreen();
void blinkLED();
void showEnteringScreen();
void submitToken();

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

  showReadyScreen();
}

void loop() {
  handleKeypad();
  unsigned long now = millis();

  // Update running energy consumption
  if (state == STATE_RUNNING) {
    if (lastMillis == 0) lastMillis = now;
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

    // Check energy exhausted
    if (remaining_kwh <= 0.00001) {
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

  delay(5);
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
        if (inputLen < 5) {
          inputBuf[inputLen++] = k;
          inputBuf[inputLen] = '\0';
          showEnteringScreen();
          if (inputLen == 5) submitToken();
        }
      }
    } else if (k == 'D') {
      if (state == STATE_ENTERING && inputLen > 0) submitToken();
    } else if (k == 'A') {
      inputLen = 0; inputBuf[0] = '\0';
      remaining_kwh = 0;
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
  bool found = false;
  float kwh = 0.0;
  for (int i = 0; i < TOKENS_COUNT; ++i) {
    if (strcmp(inputBuf, tokens[i].code) == 0) {
      found = true;
      kwh = tokens[i].kwh;
      break;
    }
  }

  if (!found) {
    state = STATE_BADTOKEN;
    display.clearDisplay();
    display.setCursor(0,0);
    display.println("BAD TOKEN!");
    display.println("Returning...");
    display.display();
    Serial.println("BAD TOKEN");
    return;
  }

  remaining_kwh = kwh;
  state = STATE_RUNNING;
  lastMillis = millis();
  lastDisplayMillis = 0;
  digitalWrite(LED_PIN, HIGH);
  showRunningScreen();
  Serial.print("Token accepted, kWh: "); Serial.println(kwh);

  inputLen = 0;
  inputBuf[0] = '\0';
}

// Display functions
void showReadyScreen() {
  display.clearDisplay();
  display.setCursor(0,0);
  display.println("Energy Meter");
  display.println("----------------");
  display.println("Status: READY");
  display.println("");
  display.println("Enter 5-digit token");
  display.display();
}

void showEnteringScreen() {
  display.clearDisplay();
  display.setCursor(0,0);
  display.println("Energy Meter");
  display.println("----------------");
  display.print("Token: ");
  for (uint8_t i = 0; i < inputLen; ++i) display.print(inputBuf[i]);
  for (uint8_t i = inputLen; i < 5; ++i) display.print('_');
  display.println("");
  display.println("D=Submit  A=Clear  *=Back");
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
  display.println("");
  display.println("LED ON - Running");
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

void blinkLED() {
  unsigned long t = millis() / 500;
  if (t % 2 == 0) digitalWrite(LED_PIN, HIGH);
  else digitalWrite(LED_PIN, LOW);
}
