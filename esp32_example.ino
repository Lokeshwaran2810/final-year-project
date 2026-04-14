#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <HTTPClient.h> // Added for backend telemetry integration
#include <OneWire.h>
#include <DallasTemperature.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>

/* ---------------- PIN DEFINITIONS ---------------- */
#define ONE_WIRE_BUS 15
#define TRIG_PIN     5
#define ECHO_PIN     18
#define IR_PIN       19

#define LED_GREEN    2
#define LED_RED      4
#define BUZZER_PIN   23

/* ---------------- THRESHOLDS ---------------- */
#define TEMP_THRESHOLD          30.0
#define BOTTLE_EMPTY_DISTANCE   25
#define DROP_FACTOR             20
#define FLOW_INTERVAL           60000
#define NO_FLOW_TIMEOUT         15000
#define MIN_OBJECT_TIME         500

#define BUZZER_ON_TIME          2000
#define BUZZER_OFF_TIME         5000

/* ---------------- BACKEND INTEGRATION ---------------- */
// IP Address of the machine running your Node.js backend
// Update this if your computer's local IP address changes!
const char* serverUrl = "http://10.217.102.136:3001/api/telemetry"; 
const char* patientId = "P-101"; // ID representing Jai Adithia's live sensors profile

unsigned long lastTelemetryPost = 0;
const unsigned long telemetryInterval = 2000; // Post to backend every 2s

OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

LiquidCrystal_I2C lcd(0x27, 16, 2);

/* ---------------- VARIABLES ---------------- */
volatile uint32_t irCount = 0;
volatile unsigned long lastIRTrigger = 0;
volatile unsigned long lastDropTime  = 0;

float tempC = 0;
float distance = 0;
float flowRate = 0;

unsigned long lastLCDUpdate = 0;
unsigned long lastFlowTime  = 0;

bool buzzerState = false;
unsigned long buzzerTimer = 0;

bool bottleAlert = false;
bool noFlowAlert = false;

/* ⭐ FLOW MODE (0 stop, 1 normal, 2 fast) */
uint8_t flowMode = 0;
unsigned long lastSimDrop = 0;

const char* ssid = "iotdataa";
const char* password = "123456789";

AsyncWebServer server(80);

/* ---------------- IR INTERRUPT ---------------- */
void IR_ISR() {
  if(flowMode==0) return;

  unsigned long now = millis();
  if (now - lastIRTrigger > MIN_OBJECT_TIME) {
    irCount++;
    lastDropTime = now;
    lastIRTrigger = now;
  }
}

/* ---------------- WEB PAGE ---------------- */
const char index_html[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
<title>HEALTH MONITORING</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body{font-family:Arial;text-align:center;transition:0.5s;}
.normal{background:#22c55e;color:black;}
.alert{background:#dc2626;color:white;animation:blink 1s infinite;}
@keyframes blink{50%{opacity:0.3;}}
.card{background:rgba(0,0,0,0.3);padding:20px;margin:10px auto;width:300px;border-radius:10px;}
</style>
</head>
<body class="alert" id="body">

<h2>ESP32 HEALTH MONITOR</h2>

<div class="card">Temperature : <b><span id="temp">0</span> °C</b></div>
<div class="card">Distance : <b><span id="dist">0</span> cm</b></div>
<div class="card">Drop Count : <b><span id="ir">0</span></b></div>
<div class="card">Flow Rate : <b><span id="flow">0</span> ml/min</b></div>

<script>
document.addEventListener("dblclick",()=>{ fetch('/toggle'); });

setInterval(()=>{
 fetch('/sensor').then(r=>r.json()).then(d=>{
  temp.innerText=d.temp;
  dist.innerText=d.dist;
  ir.innerText=d.ir;
  flow.innerText=d.flow;
  body.className=(d.flow>0)?"normal":"alert";
 });
},1000);
</script>
</body>
</html>
)rawliteral";

void setup() {

  Serial.begin(115200);
  delay(2000);

  sensors.begin();

  lcd.init();
  lcd.backlight();
  lcd.print("Starting...");

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(IR_PIN, INPUT_PULLUP);
  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_RED, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  attachInterrupt(digitalPinToInterrupt(IR_PIN), IR_ISR, FALLING);

  WiFi.begin(ssid,password);
  Serial.print("Connecting to WiFi");
  while(WiFi.status()!=WL_CONNECTED){
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected! IP Address: ");
  Serial.println(WiFi.localIP());

  server.on("/",HTTP_GET,[](AsyncWebServerRequest *r){
    r->send_P(200,"text/html",index_html);
  });

  /* ⭐ MULTI STAGE TOGGLE */
  server.on("/toggle",HTTP_GET,[](AsyncWebServerRequest *r){
    flowMode++;
    if(flowMode>2) flowMode=0;
    r->send(200,"text/plain","OK");
  });

  server.on("/sensor",HTTP_GET,[](AsyncWebServerRequest *request){

    /* ⭐ SIMULATED DROPS */
    unsigned long interval=0;
    if(flowMode==1) interval=2000;
    if(flowMode==2) interval=900;

    if(flowMode!=0 && millis()-lastSimDrop>interval){
      irCount++;
      lastDropTime=millis();
      lastSimDrop=millis();
    }

    uint32_t countCopy;
    noInterrupts(); countCopy=irCount; interrupts();

    String json="{";
    json+="\"temp\":"+String(tempC,1)+",";
    json+="\"dist\":"+String(distance,0)+",";
    json+="\"ir\":"+String(countCopy)+",";
    json+="\"flow\":"+String(flowRate,1);
    json+="}";

    request->send(200,"application/json",json);
  });

  server.begin();
}

/* ---------------- LOOP ---------------- */
void loop(){

  sensors.requestTemperatures();
  tempC=sensors.getTempCByIndex(0);

  digitalWrite(TRIG_PIN,LOW);delayMicroseconds(2);
  digitalWrite(TRIG_PIN,HIGH);delayMicroseconds(10);
  digitalWrite(TRIG_PIN,LOW);

  long duration=pulseIn(ECHO_PIN,HIGH,30000);
  distance=(duration>0)?duration*0.034/2:0;

  if(millis()-lastFlowTime>=FLOW_INTERVAL){
    noInterrupts();
    uint32_t drops=irCount;
    irCount=0;
    interrupts();

    flowRate=(float)drops/DROP_FACTOR;
    lastFlowTime=millis();
  }

  bottleAlert=(distance>BOTTLE_EMPTY_DISTANCE);
  noFlowAlert=(millis()-lastDropTime>NO_FLOW_TIMEOUT);

  bool nurseAlert=bottleAlert||noFlowAlert;

  digitalWrite(LED_RED,nurseAlert);
  digitalWrite(LED_GREEN,!nurseAlert);

  // ⭐ DripSense Backend Integration
  // Fire off telemetry to our central server exactly as React expects for 'Jai Adithia'
  if (millis() - lastTelemetryPost >= telemetryInterval) {
    if(WiFi.status() == WL_CONNECTED) {
      HTTPClient http;
      http.begin(serverUrl);
      http.addHeader("Content-Type", "application/json");

      uint32_t countCopy;
      noInterrupts(); countCopy = irCount; interrupts();

      // Construct JSON matching the expected structure
      String json = "{";
      json += "\"id\":\"" + String(patientId) + "\",";
      json += "\"temp\":" + String(tempC, 1) + ",";
      json += "\"dist\":" + String(distance, 0) + ",";
      json += "\"ir\":" + String(countCopy) + ",";
      json += "\"flow\":" + String(flowRate, 1);
      json += "}";

      int httpResponseCode = http.POST(json);
      
      // Uncomment for debugging:
      // if(httpResponseCode > 0) { Serial.println("Telemetry Posted: HTTP " + String(httpResponseCode)); }
      
      http.end();
    }
    lastTelemetryPost = millis();
  }

  delay(200);
}
