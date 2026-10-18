# Como as coisas conversam

Aula sobre **API, WebSocket e MQTT** em duas partes:

1. **Vídeo didático** (`index.html`): explicação animada no formato vertical 9:16, no estilo de vídeo curto, com narração, tabela de analogias e quiz.
2. **Laboratório XR** (`laboratorio.html`): uma bancada em 3D (Babylon.js) que recebe os dados de um **ESP32** por **MQTT sobre WebSocket** e abre em realidade virtual ou aumentada (WebXR).

## O que tem na pasta

| Arquivo | Para que serve |
|---|---|
| `index.html` | O vídeo da aula: 13 capítulos, 45 trechos, cerca de 5 minutos, em 9:16 ou 16:9 |
| `video-16x9/` | O vídeo já exportado em MP4 16:9 para o Canva: aula completa, um clipe por capítulo, tempos e legendas |
| `ferramentas/exportar-video.mjs` | Gera de novo os MP4 (por exemplo, com a sua voz) |
| `ferramentas/dividir-audio.py` | Divide uma narração gravada de uma vez só em um arquivo por trecho |
| `roteiro.md` / `roteiro.txt` | O texto de cada trecho, para você gravar a sua voz |
| `audio/` | A sua narração: `audio.mp3` (original) e um arquivo por trecho (`01-1.mp3`…`13-1.mp3`) com o `indice.js` |
| `laboratorio.html` | A bancada 3D/XR que conversa com o ESP32 |
| `esp32/esp32_mqtt_aula/esp32_mqtt_aula.ino` | Firmware do ESP32 (Arduino IDE) |

---

## 1. O vídeo da aula (`index.html`)

Abra com dois cliques (Chrome ou Edge). Aperte **Assistir à aula**.

**Quem narra** (seletor no painel lateral, ou tecla **V**):

- **Voz do navegador**: lê as legendas sozinho. No Edge, as vozes "Natural" (Francisca, Antônio) soam melhor.
- **Minha voz gravada**: toca as suas gravações da pasta `audio`, sincronizadas trecho a trecho.
- **Ao vivo**: cada trecho anima e espera você falar. Avance com **→**, **espaço** ou um passador de slides.
- **Sem voz**: só legenda, no tempo de leitura.

**Atalhos:** espaço (play/pausa) · ← → (trechos) · Shift + ← → (capítulos) · F (tela cheia) · H (só o vídeo, para gravar a tela).
Para abrir direto num capítulo, use `index.html#c5` (capítulo 5).

### Gravar a sua voz

1. Clique em **Gravar minha voz** e depois em **Escolher pasta audio** (selecione a pasta `audio` deste projeto).
2. Vá até o trecho onde quer começar e aperte **Gravar deste trecho**. Libere o microfone.
3. A legenda do vídeo vira o seu teleprompter. Leia enquanto a cena anima e aperte **→** ao terminar o trecho.
4. **←** volta para regravar. **Esc** encerra.
5. Escolha **Narração: minha voz gravada** e assista.

Pode gravar em partes, em dias diferentes. Também dá para gravar fora (celular, Audacity): salve cada trecho na pasta `audio` com o código do trecho como nome (`02-3.mp3`). Os códigos estão no `roteiro.md`.

> A gravação direta na pasta funciona no Chrome e no Edge do computador. Em outros navegadores, use **Baixar gravações** e mova os arquivos para a pasta `audio`.

**Gravou a aula inteira num arquivo só?** Salve como `audio/audio.mp3` e rode `python ferramentas/dividir-audio.py` (na primeira vez, antes: `pip install faster-whisper`). Ele reconhece a fala, encontra onde começa cada trecho do `roteiro.txt` e corta na pausa certa. A narração atual já foi dividida assim: os 45 trechos casaram com o roteiro e o player usa a sua voz automaticamente.

**Botão do laboratório:** "Abrir o laboratório XR" abre `https://luctrevisan.github.io/kit_iot/` numa aba nova. Para trocar, edite `LAB_URL` no começo do script do `index.html`.

**Para virar um vídeo (.mp4) para postar:** deixe a narração em "minha voz gravada", aperte **H** e grave a tela com o OBS ou com a Barra de Jogo do Windows (**Win + Alt + R**). O palco já está em 9:16.

**Personalizar o selo do topo:** no `index.html`, troque o texto de `PERFIL` (nome e linha de baixo).

**Formato:** no painel lateral, escolha **9:16 · vertical** (TikTok, Reels) ou **16:9** (Canva, YouTube, projetor). No 16:9, o título, a legenda e a tabela de analogias ficam à esquerda e o diagrama à direita. Para abrir direto em 16:9: `index.html?formato=16x9`.

---

## Vídeo para o Canva (16:9)

A pasta `video-16x9/` já traz tudo pronto, em 1920×1080 a 30 quadros por segundo:

| Arquivo | Uso |
|---|---|
| `aula-completa.mp4` | a aula inteira com a sua narração, sincronizada trecho a trecho |
| `capitulos/01-abertura.mp4` … | um clipe por capítulo: coloque um em cada página do Canva |
| `tempos.md` | em que segundo começa cada trecho e o texto para falar ali |
| `legendas.srt` | legendas da aula completa (YouTube e editores de vídeo aceitam) |
| `capa.png` | imagem da abertura, para miniatura |

**No Canva:** crie um design 16:9 (Apresentação ou Vídeo 1920×1080), envie os MP4 em **Uploads** e arraste cada clipe para uma página. Os clipes já vêm com a sua voz: cada trecho dura o tempo da sua fala.

**Gerar os vídeos de novo** (por exemplo, depois de regravar a narração):

```
node ferramentas/exportar-video.mjs --voz minha --saida video-16x9
```

Sem `--voz minha`, o vídeo sai mudo, no tempo de uma leitura calma, para você narrar no próprio Canva seguindo o `tempos.md`. Outras opções:

```
node ferramentas/exportar-video.mjs --sem-quiz          termina no capítulo "Para guardar"
node ferramentas/exportar-video.mjs --formato 9x16      versão vertical (pasta video-9x16)
node ferramentas/exportar-video.mjs --ate 3             só os capítulos 1 a 3 (teste rápido)
```

O exportador precisa do Node 22+, do Chrome ou Edge e do ffmpeg (todos já estão neste computador). Ele toca a aula em câmera lenta para o vídeo ficar suave, então leva uns 10 minutos.

---

## 2. O laboratório XR (`laboratorio.html`)

Abre funcionando em **Simulação**: um broker de mentira e um ESP32 virtual rodam dentro da página, sem placa e sem internet (só a primeira carga precisa de internet, para baixar o Babylon.js).

Na cena: clique no **LED** ou no botão do painel para acender e apagar, no **BOOT** para "apertar o botão", no **potenciômetro** para girar e no **sol** para acender uma "lanterna" no LDR. Cada mensagem aparece como uma bolinha voando ESP32 → broker → painel (laranja) ou painel → broker → ESP32 (verde-água), e fica registrada no **Monitor MQTT**.

**Com o ESP32 de verdade:**

1. Escolha **Broker real** e o mesmo broker do firmware (padrão: HiveMQ público).
2. Use o mesmo **Tópico base** do firmware.
3. Desmarque **ESP32 virtual** e clique em **Conectar**.

Experimento do testamento (Last Will): com o ESP32 virtual ligado, desmarque a caixa. O "aparelho" cai sem se despedir e o broker avisa todo mundo: o status vira **offline**. Com a placa real, basta tirar o cabo USB.

### Tópicos

| Tópico | Quem publica | Mensagem |
|---|---|---|
| `escola/lab1/esp32/telemetria` | ESP32, a cada 2 s | `{"temp":24.6,"umid":55,"luz":73,"pot":40,"rssi":-61,"uptime":120}` |
| `escola/lab1/esp32/led/set` | painel, celular, qualquer um | `ON`, `OFF` ou `TOGGLE` |
| `escola/lab1/esp32/led/estado` | ESP32 (retida) | `ON` ou `OFF` |
| `escola/lab1/esp32/botao` | ESP32 | `PRESSIONADO` |
| `escola/lab1/esp32/status` | ESP32 (retida) / broker | `online` ou `offline` (testamento) |

### VR e AR (WebXR)

WebXR só funciona em página **HTTPS**. Aberto do disco (`file://`), o laboratório funciona em 3D, mas sem os botões "Entrar em VR/AR".

- **Publicar em HTTPS:** suba a pasta no GitHub Pages ou arraste-a em [app.netlify.com/drop](https://app.netlify.com/drop). Em HTTPS, o broker precisa ser `wss://` (os três públicos da lista já são).
- **Óculos (Meta Quest):** abra o endereço no Meta Quest Browser e toque em **Entrar em VR**. O painel 3D funciona com os controles; aponte e aperte o gatilho. Teletransporte: aponte para o chão.
- **Celular Android:** Chrome com ARCore, botão **Entrar em AR**. A bancada aparece cerca de 1 m à sua frente. iPhone ainda não suporta WebXR no Safari.
- **Testar no computador sem óculos:** extensão "Immersive Web Emulator" (Meta) no Chrome.

---

## 3. O ESP32 (`esp32/esp32_mqtt_aula/`)

1. Arduino IDE → **Gerenciador de Placas** → instale **esp32** (Espressif). Placa: **ESP32 Dev Module**.
2. **Gerenciar Bibliotecas** → instale **PubSubClient** (Nick O'Leary). Se for usar o DHT22, instale também **DHT sensor library** (Adafruit).
3. No topo do `.ino`, preencha `WIFI_SSID`, `WIFI_SENHA`, `MQTT_BROKER` e `TOPICO_BASE`.
4. Envie para a placa e abra o Monitor Serial em **115200**.

Sem nenhum sensor, a placa já funciona: o LED da própria placa (GPIO 2) é o atuador, o botão **BOOT** é a entrada e as leituras são simuladas. Para ligar sensores de verdade, mude `USAR_DHT22`, `USAR_LDR` e `USAR_POT` para `1`.

| Componente | Ligação |
|---|---|
| DHT22 | dados → GPIO 4 · VCC → 3V3 · GND → GND · 10 kΩ entre dados e 3V3 |
| LDR | 3V3 → LDR → GPIO 34 → 10 kΩ → GND |
| Potenciômetro | pontas em 3V3 e GND · pino do meio → GPIO 35 |
| LED externo (opcional) | GPIO 2 → resistor 220 Ω → LED → GND |

Use os pinos 32 a 39 para leituras analógicas: os do ADC2 não funcionam com o Wi-Fi ligado. O ESP32 só conecta em redes **2,4 GHz**.

**Testar sem o laboratório:** com o [MQTT Explorer](https://mqtt-explorer.com/) ou pelo terminal:

```
mosquitto_sub -h broker.hivemq.com -t "escola/lab1/esp32/#" -v
mosquitto_pub -h broker.hivemq.com -t "escola/lab1/esp32/led/set" -m ON
```

### Broker na própria escola (opcional)

Para não depender de internet, rode o Mosquitto num computador da rede. `mosquitto.conf`:

```
listener 1883
listener 9001
protocol websockets
allow_anonymous true
```

No firmware, `MQTT_BROKER` vira o IP desse computador (ex.: `192.168.0.10`). No laboratório, escolha **Mosquitto na minha rede** e troque `localhost` pelo mesmo IP (`ws://192.168.0.10:9001`).

---

## Atenção: brokers públicos

Brokers públicos são abertos: **qualquer pessoa no mundo pode ler e publicar** no seu tópico. Por isso, troque `lab1` por algo único da turma (ex.: `escola/3b-iot-2026/esp32`), no firmware e no laboratório. Isso também rende uma boa conversa sobre segurança: em projetos reais, o broker exige usuário, senha e TLS (porta 8883).

---

## Sugestão de aula (50 min)

| Tempo | Atividade |
|---|---|
| 10 min | Vídeo, com a sua voz ou ao vivo |
| 5 min | Quiz (último capítulo), em duplas |
| 10 min | Laboratório em simulação: cada dupla acende o LED e acompanha o Monitor MQTT |
| 15 min | ESP32 de verdade: a turma assina o tópico pelo celular e alguém aperta o BOOT |
| 10 min | Desafios |

**Desafios para a turma**

1. Pelo campo "Publicar" do Monitor MQTT, apague o LED sem usar o botão.
2. Qual assinatura recebe a temperatura de todos os laboratórios, mas não a luz?
3. Desligue o ESP32 virtual. Quem avisou que ele caiu, se ele não pôde avisar?
4. Abra o laboratório em dois celulares. Por que os dois veem o LED mudar ao mesmo tempo?
5. No firmware, publique um alerta em `.../alerta` quando a temperatura passar de 30 °C.

## Problemas comuns

| Sintoma | Causa provável |
|---|---|
| Laboratório "conectando…" para sempre | Rede da escola bloqueia a porta 8884. Teste outro broker da lista ou o celular roteando. |
| ESP32 "falhou (código -2)" no Monitor Serial | Sem rota até o broker: confira o Wi-Fi e o endereço do broker. |
| Dados chegam no Monitor Serial, mas não no laboratório | Tópico base diferente entre firmware e laboratório (maiúsculas contam). |
| Sem botão "Entrar em VR" | Página fora de HTTPS, ou navegador sem WebXR. |
| A narração não fala | O navegador não tem voz em português. Instale uma voz no Windows ou use "Ao vivo". |
