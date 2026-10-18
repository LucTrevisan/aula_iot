# Tempos da aula (16x9)

Vídeo completo: **aula-completa.mp4**, 05:02.2.
Cada linha diz em que momento o trecho começa e o que narrar nele. "No clipe" é o tempo dentro do arquivo do capítulo.
Para gravar a voz no Canva: coloque cada clipe numa página, use "Gravar a si mesmo" e leia os trechos na ordem; o próximo trecho começa no tempo indicado.

## 01 · Abertura

Arquivo: `capitulos/01-abertura.mp4` · começa em 00:00.0 · dura 00:26.7

| Trecho | No vídeo | No clipe | Texto |
|---|---|---|---|
| 01-1 | 00:00.0 | 00:00.0 | Você toca num botão do celular e uma luz acende do outro lado da sala. |
| 01-2 | 00:05.2 | 00:05.2 | O número que aparece no app não nasce no celular. Ele vem de um sensor ligado numa placa: o ESP32. |
| 01-3 | 00:13.5 | 00:13.5 | E quando você toca no botão, o comando precisa chegar até a placa para acender o LED. |
| 01-4 | 00:19.1 | 00:19.1 | Como o app e a placa conversam? Com três ideias: API, WebSocket e MQTT. |

## 02 · O que é uma API

Arquivo: `capitulos/02-o-que-e-uma-api.mp4` · começa em 00:26.7 · dura 00:24.1

| Trecho | No vídeo | No clipe | Texto |
|---|---|---|---|
| 02-1 | 00:26.7 | 00:00.0 | A cozinha fica lá atrás. Você está na mesa, com fome. |
| 02-2 | 00:31.2 | 00:04.6 | Ninguém atravessa a parede: você não entra na cozinha, e a cozinha não vem até a sua mesa. |
| 02-3 | 00:37.1 | 00:10.4 | Quem faz a ponte é o garçom. Ele leva o pedido e volta com o prato. |
| 02-4 | 00:42.0 | 00:15.4 | De um lado, um aplicativo que precisa de algo. Do outro, um sistema que tem. A API leva o pedido e traz a resposta. |

## 03 · O cardápio

Arquivo: `capitulos/03-o-cardapio.mp4` · começa em 00:50.8 · dura 00:11.7

| Trecho | No vídeo | No clipe | Texto |
|---|---|---|---|
| 03-1 | 00:50.8 | 00:00.0 | Você só pode pedir o que está nele. Pedir um prato que não existe não funciona. |
| 03-2 | 00:55.8 | 00:05.1 | Ela diz o que dá para pedir e como pedir: o endereço, o verbo e o formato da resposta. |

## 04 · Pedido e resposta

Arquivo: `capitulos/04-pedido-e-resposta.mp4` · começa em 01:02.5 · dura 00:26.9

| Trecho | No vídeo | No clipe | Texto |
|---|---|---|---|
| 04-1 | 01:02.5 | 00:00.0 | Na web, o pedido segue um protocolo chamado HTTP. Vai um verbo e um endereço. |
| 04-2 | 01:08.8 | 00:06.4 | A resposta volta com um código, como 200 OK, e os dados em JSON. |
| 04-3 | 01:14.1 | 00:11.7 | Os verbos dizem a intenção: GET busca, POST envia, PUT atualiza e DELETE apaga. |
| 04-4 | 01:22.5 | 00:20.0 | Repare: no HTTP, o servidor nunca fala primeiro. Ele só responde quando alguém pergunta. |

## 05 · O problema do tempo real

Arquivo: `capitulos/05-o-problema-do-tempo-real.mp4` · começa em 01:29.3 · dura 00:23.4

| Trecho | No vídeo | No clipe | Texto |
|---|---|---|---|
| 05-1 | 01:29.3 | 00:00.0 | Um sensor de temperatura muda a qualquer momento. E o app quer saber na hora. |
| 05-2 | 01:34.7 | 00:05.3 | Com HTTP, o app precisa perguntar de novo, e de novo, e de novo. Isso se chama polling. |
| 05-3 | 01:41.6 | 00:12.3 | É chamar o garçom a cada minuto: já saiu? Gasta rede, gasta bateria, e a novidade ainda chega atrasada. |
| 05-4 | 01:49.0 | 00:19.6 | O ideal é o sistema avisar sozinho quando algo muda. |

## 06 · WebSocket

Arquivo: `capitulos/06-websocket.mp4` · começa em 01:52.8 · dura 00:31.0

| Trecho | No vídeo | No clipe | Texto |
|---|---|---|---|
| 06-1 | 01:52.8 | 00:00.0 | O WebSocket começa como um pedido HTTP comum, pedindo um upgrade. |
| 06-2 | 01:57.8 | 00:05.1 | Depois disso, a linha fica aberta, como numa ligação. Os dois lados falam quando quiserem. |
| 06-3 | 02:03.8 | 00:11.0 | Isso se chama full-duplex. O endereço começa com ws://, ou wss:// na versão criptografada. |
| 06-4 | 02:14.5 | 00:21.7 | O WebSocket não organiza quem recebe cada mensagem. Com dezenas de aparelhos, vira bagunça. Para isso existe o MQTT. |

## 07 · MQTT: publicar e assinar

Arquivo: `capitulos/07-mqtt-publicar-e-assinar.mp4` · começa em 02:23.8 · dura 00:28.4

| Trecho | No vídeo | No clipe | Texto |
|---|---|---|---|
| 07-1 | 02:23.8 | 00:00.0 | O MQTT é um protocolo de mensagens feito para a Internet das Coisas. |
| 07-2 | 02:28.9 | 00:05.1 | Quem posta não manda o vídeo para cada pessoa. Posta no canal, e a plataforma entrega para quem se inscreveu. |
| 07-3 | 02:35.7 | 00:11.9 | No MQTT é igual: o ESP32 publica no tópico escola/lab1/temperatura, e o broker entrega para quem assinou. |
| 07-4 | 02:45.8 | 00:22.0 | Quem publica nem sabe quantos estão ouvindo. Dá para incluir um painel novo sem mexer no sensor. |

## 08 · Tópicos, QoS e testamento

Arquivo: `capitulos/08-topicos-qos-e-testamento.mp4` · começa em 02:52.2 · dura 00:32.3

| Trecho | No vídeo | No clipe | Texto |
|---|---|---|---|
| 08-1 | 02:52.2 | 00:00.0 | Os nomes vão do geral para o específico, separados por barras. |
| 08-2 | 02:56.6 | 00:04.4 | O + vale um nível qualquer. O # vale tudo dali para baixo. |
| 08-3 | 03:01.6 | 00:09.4 | Zero: no máximo uma vez. Um: pelo menos uma vez. Dois: exatamente uma vez. |
| 08-4 | 03:09.5 | 00:17.3 | A mensagem retida fica guardada para quem chegar depois. O testamento avisa todos se o aparelho cair. |
| 08-5 | 03:16.4 | 00:24.2 | O MQTT nasceu para monitorar oleodutos por satélite, onde cada byte custava caro. Por isso ele é tão leve. |

## 09 · WebSocket + MQTT

Arquivo: `capitulos/09-websocket-mqtt.mp4` · começa em 03:24.6 · dura 00:22.4

| Trecho | No vídeo | No clipe | Texto |
|---|---|---|---|
| 09-1 | 03:24.6 | 00:00.0 | WebSocket e MQTT não competem. Um completa o outro. |
| 09-2 | 03:29.4 | 00:04.9 | O WebSocket é o transporte, o cano. O MQTT é o jeito de organizar as mensagens que passam por ele. |
| 09-3 | 03:36.7 | 00:12.2 | O navegador não abre conexão MQTT pura. Então o MQTT viaja dentro de um WebSocket. É assim que a cena 3D fala com o broker. |

## 10 · O ESP32

Arquivo: `capitulos/10-o-esp32.mp4` · começa em 03:46.9 · dura 00:18.8

| Trecho | No vídeo | No clipe | Texto |
|---|---|---|---|
| 10-1 | 03:46.9 | 00:00.0 | O ESP32 é um microcontrolador barato, com Wi-Fi e Bluetooth no mesmo chip. |
| 10-2 | 03:53.5 | 00:06.5 | Temperatura, luz e um potenciômetro entram pelos pinos. Um LED ou um relé saem. |
| 10-3 | 03:59.8 | 00:12.8 | No nosso projeto, ele publica as leituras em JSON e assina um tópico de comandos para o LED. |

## 11 · Arquitetura do projeto

Arquivo: `capitulos/11-arquitetura-do-projeto.mp4` · começa em 04:05.7 · dura 00:27.9

| Trecho | No vídeo | No clipe | Texto |
|---|---|---|---|
| 11-1 | 04:05.7 | 00:00.0 | O ESP32 publica a telemetria no broker, usando MQTT sobre TCP. |
| 11-2 | 04:12.1 | 00:06.4 | A página feita com Babylon.js assina os tópicos por WebSocket e transforma os números em objetos 3D. |
| 11-3 | 04:20.3 | 00:14.5 | Com WebXR, a mesma cena abre nos óculos de realidade virtual ou no celular, em realidade aumentada. |
| 11-4 | 04:27.5 | 00:21.8 | Você aperta um botão virtual, a página publica um comando e o LED de verdade acende. |

## 12 · Para guardar

Arquivo: `capitulos/12-para-guardar.mp4` · começa em 04:33.6 · dura 00:20.9

| Trecho | No vídeo | No clipe | Texto |
|---|---|---|---|
| 12-1 | 04:33.6 | 00:00.0 | A API é o garçom. O HTTP é pedir e esperar a resposta. |
| 12-2 | 04:39.0 | 00:05.4 | O WebSocket é a linha aberta. O MQTT é o canal com inscritos, e o broker é a plataforma. |
| 12-3 | 04:45.9 | 00:12.3 | E o ESP32 é quem sente e age no mundo físico. Agora é com você: faça o quiz e abra o laboratório. |

## 13 · Quiz

Arquivo: `capitulos/13-quiz.mp4` · começa em 04:54.5 · dura 00:07.7

| Trecho | No vídeo | No clipe | Texto |
|---|---|---|---|
| 13-1 | 04:54.5 | 00:00.0 | Toque na resposta que você acha certa. No fim, aparece a sua pontuação. |
