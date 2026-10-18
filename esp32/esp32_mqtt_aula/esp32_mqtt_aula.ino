/*
  Aula IoT · ESP32 + MQTT
  ------------------------------------------------------------
  Publica as leituras dos sensores em JSON e obedece a comandos para o LED.
  Conversa com o laboratorio.html (Bancada XR) através de um broker MQTT.

  Tópicos (TOPICO_BASE + ...):
    /telemetria   ESP32 publica a cada 2 s  {"temp":24.6,"umid":55,"luz":73,"pot":40,"rssi":-61,"uptime":120}
    /led/set      ESP32 assina: ON, OFF ou TOGGLE
    /led/estado   ESP32 confirma o estado do LED (mensagem retida)
    /botao        ESP32 avisa quando o botão BOOT é apertado
    /status       "online" ao conectar; "offline" pelo testamento (Last Will) se a placa cair

  Bibliotecas (Arduino IDE > Ferramentas > Gerenciar bibliotecas):
    - PubSubClient (Nick O'Leary)
    - Só se USAR_DHT22 = 1: DHT sensor library (Adafruit) + Adafruit Unified Sensor

  Placa: "ESP32 Dev Module" (pacote "esp32" da Espressif no Gerenciador de Placas).
  Funciona só com a placa: os sensores desligados abaixo geram valores simulados.
*/

#include <WiFi.h>
#include <PubSubClient.h>

// ===================== CONFIGURE AQUI =====================
const char* WIFI_SSID     = "NOME_DA_REDE";
const char* WIFI_SENHA    = "SENHA_DA_REDE";
const char* MQTT_BROKER   = "broker.hivemq.com";   // o mesmo broker escolhido no laboratório
const uint16_t MQTT_PORTA = 1883;                  // o ESP32 usa MQTT puro (TCP). O navegador usa WSS na 8884.
const char* TOPICO_BASE   = "escola/lab1/esp32";   // igual ao campo "Tópico base" do laboratório

// 1 = sensor ligado na placa · 0 = valor simulado
#define USAR_DHT22  0
#define USAR_LDR    0
#define USAR_POT    0

#define PINO_DHT    4    // DHT22: pino de dados no GPIO 4 (resistor de 10 kΩ entre dados e 3V3)
#define PINO_LDR    34   // LDR: divisor com resistor de 10 kΩ. Use GPIO 32 a 39 (ADC1): o ADC2 não lê com o Wi-Fi ligado
#define PINO_POT    35   // potenciômetro: pontas em 3V3 e GND, pino do meio no GPIO 35
#define PINO_LED    2    // LED da placa DevKit V1. Sem LED na placa? LED + resistor de 220 Ω no GPIO 2
#define PINO_BOTAO  0    // botão BOOT da própria placa

const unsigned long INTERVALO_MS = 2000;
// ===========================================================

#if USAR_DHT22
  #include <DHT.h>
  DHT dht(PINO_DHT, DHT22);
#endif

WiFiClient rede;
PubSubClient mqtt(rede);

String tTelemetria, tLedSet, tLedEstado, tBotao, tStatus;
bool ledLigado = false;
bool botaoAntes = HIGH;
unsigned long ultimoEnvio = 0, ultimaTentativa = 0, ultimoBotao = 0;
float tempSim = 24.5, umidSim = 55, potSim = 40;

void publicarEstadoLed() {
  mqtt.publish(tLedEstado.c_str(), ledLigado ? "ON" : "OFF", true);  // true = retida: quem chegar depois já sabe o estado
}

void aplicarLed(bool ligar) {
  ledLigado = ligar;
  digitalWrite(PINO_LED, ligar ? HIGH : LOW);
  publicarEstadoLed();
  Serial.printf("LED %s\n", ligar ? "ligado" : "desligado");
}

// A biblioteca chama esta função quando chega mensagem num tópico assinado
void aoReceber(char* topico, byte* dados, unsigned int tamanho) {
  String msg;
  for (unsigned int i = 0; i < tamanho; i++) msg += (char)dados[i];
  msg.trim();
  msg.toUpperCase();
  Serial.printf("<- %s: %s\n", topico, msg.c_str());

  if (tLedSet == topico) {
    if (msg == "ON" || msg == "1" || msg == "LIGAR") aplicarLed(true);
    else if (msg == "OFF" || msg == "0" || msg == "DESLIGAR") aplicarLed(false);
    else if (msg == "TOGGLE") aplicarLed(!ledLigado);
  }
}

void conectarWiFi() {
  if (WiFi.status() == WL_CONNECTED) return;
  Serial.printf("Conectando ao Wi-Fi \"%s\"", WIFI_SSID);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_SENHA);
  unsigned long t0 = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - t0 < 20000) {
    delay(400);
    Serial.print('.');
  }
  if (WiFi.status() == WL_CONNECTED) {
    Serial.print(" ok! IP: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println(" não conectou. Confira nome e senha da rede (só 2,4 GHz).");
  }
}

bool conectarMQTT() {
  String id = "esp32-aula-" + String((uint32_t)ESP.getEfuseMac(), HEX);
  Serial.printf("Conectando ao broker %s:%u como %s... ", MQTT_BROKER, MQTT_PORTA, id.c_str());

  // Testamento (Last Will): se a placa sumir sem se despedir, o broker publica "offline" em /status
  if (mqtt.connect(id.c_str(), nullptr, nullptr, tStatus.c_str(), 1, true, "offline")) {
    Serial.println("ok!");
    mqtt.publish(tStatus.c_str(), "online", true);
    mqtt.subscribe(tLedSet.c_str());
    publicarEstadoLed();
    return true;
  }
  Serial.printf("falhou (código %d). Tento de novo em 3 s.\n", mqtt.state());
  return false;
}

float lerTemperatura(float &umidade) {
#if USAR_DHT22
  float t = dht.readTemperature();
  float h = dht.readHumidity();
  if (!isnan(t) && !isnan(h)) {
    umidade = h;
    return t;
  }
  Serial.println("DHT22 sem resposta: usando valor simulado.");
#endif
  tempSim = constrain(tempSim + random(-15, 16) / 100.0 + (ledLigado ? 0.02 : -0.01), 18, 34);
  umidSim = constrain(umidSim + random(-10, 11) / 10.0, 30, 85);
  umidade = umidSim;
  return tempSim;
}

int lerLuz() {
  if (USAR_LDR) return map(analogRead(PINO_LDR), 0, 4095, 0, 100);
  return constrain((int)(58 + 22 * sin(millis() / 35000.0) + random(-3, 4)), 0, 100);
}

int lerPotenciometro() {
  if (USAR_POT) return map(analogRead(PINO_POT), 0, 4095, 0, 100);
  if (random(100) < 8) potSim = random(0, 101);
  return (int)potSim;
}

void publicarTelemetria() {
  float umidade = 0;
  float temperatura = lerTemperatura(umidade);
  char json[160];
  snprintf(json, sizeof(json),
           "{\"temp\":%.1f,\"umid\":%.0f,\"luz\":%d,\"pot\":%d,\"rssi\":%d,\"uptime\":%lu}",
           temperatura, umidade, lerLuz(), lerPotenciometro(), WiFi.RSSI(), millis() / 1000);
  mqtt.publish(tTelemetria.c_str(), json);
  Serial.printf("-> %s: %s\n", tTelemetria.c_str(), json);
}

void verificarBotao() {
  bool agora = digitalRead(PINO_BOTAO);
  if (agora == LOW && botaoAntes == HIGH && millis() - ultimoBotao > 250) {  // 250 ms contra o "repique" do botão
    ultimoBotao = millis();
    mqtt.publish(tBotao.c_str(), "PRESSIONADO");
    Serial.println("-> botão BOOT apertado");
  }
  botaoAntes = agora;
}

void setup() {
  Serial.begin(115200);
  delay(200);
  Serial.println("\n== Aula IoT · ESP32 + MQTT ==");

  pinMode(PINO_LED, OUTPUT);
  digitalWrite(PINO_LED, LOW);
  pinMode(PINO_BOTAO, INPUT_PULLUP);
  analogReadResolution(12);
#if USAR_DHT22
  dht.begin();
#endif
  randomSeed(esp_random());

  String base = TOPICO_BASE;
  tTelemetria = base + "/telemetria";
  tLedSet     = base + "/led/set";
  tLedEstado  = base + "/led/estado";
  tBotao      = base + "/botao";
  tStatus     = base + "/status";

  conectarWiFi();
  mqtt.setServer(MQTT_BROKER, MQTT_PORTA);
  mqtt.setCallback(aoReceber);
  mqtt.setBufferSize(512);
  mqtt.setKeepAlive(30);
}

void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    conectarWiFi();
    return;
  }
  if (!mqtt.connected()) {
    if (ultimaTentativa == 0 || millis() - ultimaTentativa > 3000) {
      ultimaTentativa = millis();
      conectarMQTT();
    }
    return;
  }
  mqtt.loop();  // recebe mensagens e mantém a conexão viva
  verificarBotao();
  if (millis() - ultimoEnvio >= INTERVALO_MS) {
    ultimoEnvio = millis();
    publicarTelemetria();
  }
}
