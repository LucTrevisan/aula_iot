# Roteiro: Como as coisas conversam

Vídeo didático sobre API, WebSocket, MQTT, ESP32 e WebXR, no formato vertical 9:16.
São **13 capítulos** e **45 trechos**, com cerca de **4 min 47 s** de fala no ritmo normal.

Cada trecho tem um código, como `02-3` (capítulo 2, trecho 3). O mesmo código aparece no painel do player
(embaixo dos botões) e é o nome do arquivo de áudio daquele trecho. As durações são estimativas: o vídeo
espera a sua fala terminar, então você pode falar no seu ritmo.

## Três jeitos de usar a sua voz

**1. Gravar dentro da página (recomendado).** Abra o `index.html` no Chrome ou no Edge e clique em
**Gravar minha voz**. Escolha a pasta `audio` do projeto, vá ao trecho inicial e aperte **Gravar**.
A legenda do vídeo vira o seu teleprompter: leia o trecho enquanto a cena anima e aperte **→** quando
terminar. Cada trecho vira um arquivo, como `audio/02-3.webm`. Errou? Aperte **←** e grave de novo.
**Esc** encerra. Depois escolha **Narração: minha voz gravada** e o vídeo toca com a sua voz,
sincronizado trecho a trecho.

**2. Gravar fora (celular, Audacity, gravador).** Grave cada trecho num arquivo separado e salve na
pasta `audio` com o código como nome: `01-1.mp3`, `01-2.mp3`… Servem os formatos .webm, .mp3,
.m4a, .wav e .ogg. Deixe meio segundo de silêncio no começo e no fim de cada arquivo.

**3. Ao vivo, na sala.** Escolha **Ao vivo: eu falo e aperto →**. Cada trecho anima e espera você.
Fale e avance com **→**, **espaço** ou um passador de slides.

Para gerar um vídeo final com a sua voz: deixe a narração em **minha voz gravada**, aperte **H**
(só o vídeo aparece) e grave a tela em 9:16 com o OBS ou com a Barra de Jogo do Windows (Win + Alt + R).

Dicas de gravação: fale perto do microfone, num lugar sem eco; leia o trecho uma vez antes de gravar;
os termos em inglês podem ser ditos do jeito que a turma conhece (MQTT como "eme-quê-tê-tê", por exemplo).

---

## 01 · Abertura

Sobretítulo: **GUIA RÁPIDO** · 4 trechos · cerca de 26 s

### 01-1 · cerca de 6 s

Na tela: Título "Como as coisas conversam?" e o celular com o app Casa inteligente. Título: *Como as coisas conversam?*

> Você toca num botão do celular e uma luz acende do outro lado da sala.

### 01-2 · cerca de 8 s

Na tela: O celular vai para a esquerda; aparecem o sensor e o LED do ESP32. A temperatura viaja do sensor até o app. Título: *A temperatura vem da placa.*

> O número que aparece no app não nasce no celular. Ele vem de um sensor ligado numa placa: o ESP32.

### 01-3 · cerca de 7 s

Na tela: O botão do app liga, o comando "LED: ON" vai até a placa e o LED acende. Título: *O botão chega até a placa.*

> E quando você toca no botão, o comando precisa chegar até a placa para acender o LED.

### 01-4 · cerca de 6 s

Na tela: Pontos de interrogação nas ligações; a tabela completa com "o caminho → API · WS · MQTT". Título: *Como eles conversam?*

> Como o app e a placa conversam? Com três ideias: API, WebSocket e MQTT.

## 02 · O que é uma API

Sobretítulo: **PARA ENTENDER** · 4 trechos · cerca de 28 s

### 02-1 · cerca de 4 s

Na tela: A cozinha no alto, você na mesa e uma parede no meio. Título: *Pensa num restaurante.*

> A cozinha fica lá atrás. Você está na mesa, com fome.

### 02-2 · cerca de 7 s

Na tela: Linhas vermelhas com X: ninguém atravessa a parede. Título: *Pensa num restaurante.*

> Ninguém atravessa a parede: você não entra na cozinha, e a cozinha não vem até a sua mesa.

### 02-3 · cerca de 6 s

Na tela: A parede abre e o garçom aparece. O "pedido" sobe e o "prato" desce. Título: *Pensa num restaurante.*

> Quem faz a ponte é o garçom. Ele leva o pedido e volta com o prato.

### 02-4 · cerca de 9 s

Na tela: Os cartões viram "aplicativo" e "sistema", o garçom vira "API" e a tabela se completa. Título: *A API é o garçom.*

> De um lado, um aplicativo que precisa de algo. Do outro, um sistema que tem. A API leva o pedido e traz a resposta.

## 03 · O cardápio

Sobretítulo: **A REGRA** · 2 trechos · cerca de 14 s

### 03-1 · cerca de 6 s

Na tela: Cardápio com pizza, sopa e salada, ligado ao pedido "pizza". Título: *Existe um cardápio.*

> Você só pode pedir o que está nele. Pedir um prato que não existe não funciona.

### 03-2 · cerca de 8 s

Na tela: O cardápio vira "Documentação": GET /temperatura, POST /led, GET /status. Título: *Na API, é a documentação.*

> Ela diz o que dá para pedir e como pedir: o endereço, o verbo e o formato da resposta.

## 04 · Pedido e resposta

Sobretítulo: **NA PRÁTICA** · 4 trechos · cerca de 23 s

### 04-1 · cerca de 6 s

Na tela: Aplicativo em cima, servidor embaixo; a requisição GET desce. Título: *Pedido vai, resposta volta.*

> Na web, o pedido segue um protocolo chamado HTTP. Vai um verbo e um endereço.

### 04-2 · cerca de 6 s

Na tela: A resposta "200 · JSON" sobe; aparecem os códigos 200, 404 e 500. Título: *Pedido vai, resposta volta.*

> A resposta volta com um código, como 200 OK, e os dados em JSON.

### 04-3 · cerca de 6 s

Na tela: Os quatro verbos aparecem um a um. Título: *Pedido vai, resposta volta.*

> Os verbos dizem a intenção: GET busca, POST envia, PUT atualiza e DELETE apaga.

### 04-4 · cerca de 6 s

Na tela: Faixa "1 pergunta → 1 resposta". Título: *Quem pergunta é o cliente.*

> Repare: no HTTP, o servidor nunca fala primeiro. Ele só responde quando alguém pergunta.

## 05 · O problema do tempo real

Sobretítulo: **O PROBLEMA** · 4 trechos · cerca de 25 s

### 05-1 · cerca de 6 s

Na tela: Aplicativo e sensor com a temperatura; contador de perguntas zerado. Título: *E se o dado muda toda hora?*

> Um sensor de temperatura muda a qualquer momento. E o app quer saber na hora.

### 05-2 · cerca de 7 s

Na tela: Começa o polling: "mudou?" desce, "não" sobe e o contador dispara. Título: *Já mudou? Não.*

> Com HTTP, o app precisa perguntar de novo, e de novo, e de novo. Isso se chama polling.

### 05-3 · cerca de 8 s

Na tela: Balão "Já saiu meu prato? Ainda não…". Título: *Já mudou? Não.*

> É chamar o garçom a cada minuto: já saiu? Gasta rede, gasta bateria, e a novidade ainda chega atrasada.

### 05-4 · cerca de 4 s

Na tela: O cartão do sensor acende. Título: *Precisamos de tempo real.*

> O ideal é o sistema avisar sozinho quando algo muda.

## 06 · WebSocket

Sobretítulo: **SOLUÇÃO 1** · 4 trechos · cerca de 24 s

### 06-1 · cerca de 4 s

Na tela: O navegador pede "Upgrade" e o servidor responde "101". Título: *WebSocket: a linha aberta.*

> O WebSocket começa como um pedido HTTP comum, pedindo um upgrade.

### 06-2 · cerca de 6 s

Na tela: Abre o tubo do WebSocket; mensagens sobem e descem sem parar. Título: *WebSocket: a linha aberta.*

> Depois disso, a linha fica aberta, como numa ligação. Os dois lados falam quando quiserem.

### 06-3 · cerca de 6 s

Na tela: Cartão "Full-duplex" e os endereços ws:// e wss://. Título: *WebSocket: a linha aberta.*

> Isso se chama full-duplex. O endereço começa com ws://, ou wss:// na versão criptografada.

Como falar: Isso se chama full-duplex. O endereço começa com W S, ou com W S S na versão criptografada.

### 06-4 · cerca de 8 s

Na tela: Nota "Mas o WebSocket é só o cano". Título: *Mas é só o cano.*

> O WebSocket não organiza quem recebe cada mensagem. Com dezenas de aparelhos, vira bagunça. Para isso existe o MQTT.

## 07 · MQTT: publicar e assinar

Sobretítulo: **SOLUÇÃO 2** · 4 trechos · cerca de 27 s

### 07-1 · cerca de 5 s

Na tela: O broker aparece no centro. Título: *MQTT: publicar e assinar.*

> O MQTT é um protocolo de mensagens feito para a Internet das Coisas.

### 07-2 · cerca de 8 s

Na tela: Dois ESP32 em cima, três assinantes embaixo e a tabela "no canal → no MQTT". Título: *Pensa num canal de vídeos.*

> Quem posta não manda o vídeo para cada pessoa. Posta no canal, e a plataforma entrega para quem se inscreveu.

### 07-3 · cerca de 7 s

Na tela: A temperatura vai do ESP32 ao broker e desce só para quem assinou lab1/temperatura. Título: *Pensa num canal de vídeos.*

> No MQTT é igual: o ESP32 publica no tópico escola/lab1/temperatura, e o broker entrega para quem assinou.

Como falar: No MQTT é igual: o ESP32 publica no tópico escola, barra, lab um, barra, temperatura. E o broker entrega para quem assinou.

### 07-4 · cerca de 7 s

Na tela: Mensagens contínuas: temperatura para o painel e o celular, luz para a planilha. Título: *Pensa num canal de vídeos.*

> Quem publica nem sabe quantos estão ouvindo. Dá para incluir um painel novo sem mexer no sensor.

## 08 · Tópicos, QoS e testamento

Sobretítulo: **OS DETALHES** · 5 trechos · cerca de 30 s

### 08-1 · cerca de 4 s

Na tela: Árvore de tópicos escola/lab1/… e escola/lab2/…. Título: *Tópicos são como pastas.*

> Os nomes vão do geral para o específico, separados por barras.

### 08-2 · cerca de 5 s

Na tela: escola/+/temperatura destaca as duas "temperatura"; depois escola/lab1/# destaca o lab1 inteiro. Título: *+ e # assinam vários.*

> O + vale um nível qualquer. O # vale tudo dali para baixo.

Como falar: O sinal de mais vale um nível qualquer. A cerquilha vale tudo dali para baixo.

### 08-3 · cerca de 6 s

Na tela: Cartões QoS 0, QoS 1 e QoS 2 aparecem um a um. Título: *QoS: a garantia de entrega.*

> Zero: no máximo uma vez. Um: pelo menos uma vez. Dois: exatamente uma vez.

### 08-4 · cerca de 7 s

Na tela: Cartões Retain e Testamento. Título: *Retain e testamento.*

> A mensagem retida fica guardada para quem chegar depois. O testamento avisa todos se o aparelho cair.

### 08-5 · cerca de 8 s

Na tela: Destaque "2 bytes". Título: *Desde 1999, em 2 bytes.*

> O MQTT nasceu para monitorar oleodutos por satélite, onde cada byte custava caro. Por isso ele é tão leve.

## 09 · WebSocket + MQTT

Sobretítulo: **JUNTANDO** · 3 trechos · cerca de 22 s

### 09-1 · cerca de 4 s

Na tela: Cartões WebSocket (transporte) e MQTT (mensagens). Título: *Qual usar? Os dois.*

> WebSocket e MQTT não competem. Um completa o outro.

### 09-2 · cerca de 8 s

Na tela: As linhas dos dois cartões aparecem lado a lado. Título: *Qual usar? Os dois.*

> O WebSocket é o transporte, o cano. O MQTT é o jeito de organizar as mensagens que passam por ele.

### 09-3 · cerca de 10 s

Na tela: Navegador, tubo WebSocket, broker e ESP32; pacotes MQTT passam pelo tubo. Título: *MQTT dentro do WebSocket.*

> O navegador não abre conexão MQTT pura. Então o MQTT viaja dentro de um WebSocket. É assim que a cena 3D fala com o broker.

## 10 · O ESP32

Sobretítulo: **NO MUNDO FÍSICO** · 3 trechos · cerca de 18 s

### 10-1 · cerca de 5 s

Na tela: Desenho da placa ESP32 com antena, chip, BOOT e LED. Título: *Quem sente é o ESP32.*

> O ESP32 é um microcontrolador barato, com Wi-Fi e Bluetooth no mesmo chip.

### 10-2 · cerca de 6 s

Na tela: DHT22, LDR e potenciômetro ligados aos pinos; o LED da placa acende. Título: *Ele lê sensores e liga coisas.*

> Temperatura, luz e um potenciômetro entram pelos pinos. Um LED ou um relé saem.

### 10-3 · cerca de 7 s

Na tela: Código com publish/subscribe e o JSON publicado. Título: *A cada 2 segundos, um JSON.*

> No nosso projeto, ele publica as leituras em JSON e assina um tópico de comandos para o LED.

## 11 · Arquitetura do projeto

Sobretítulo: **NO NOSSO PROJETO** · 4 trechos · cerca de 24 s

### 11-1 · cerca de 4 s

Na tela: ESP32 → broker (MQTT · TCP 1883). Título: *Do sensor ao óculos VR.*

> O ESP32 publica a telemetria no broker, usando MQTT sobre TCP.

### 11-2 · cerca de 7 s

Na tela: Broker → Babylon.js; a temperatura atualiza no painel 3D. Título: *Do sensor ao óculos VR.*

> A página feita com Babylon.js assina os tópicos por WebSocket e transforma os números em objetos 3D.

### 11-3 · cerca de 7 s

Na tela: Babylon.js → WebXR (óculos e celular). Título: *Do sensor ao óculos VR.*

> Com WebXR, a mesma cena abre nos óculos de realidade virtual ou no celular, em realidade aumentada.

### 11-4 · cerca de 6 s

Na tela: O comando led/set ON sobe até o ESP32, o LED liga e a confirmação volta. Título: *E o caminho de volta.*

> Você aperta um botão virtual, a página publica um comando e o LED de verdade acende.

## 12 · Para guardar

Sobretítulo: **PARA GUARDAR** · 3 trechos · cerca de 22 s

### 12-1 · cerca de 5 s

Na tela: Resumo: API e HTTP entram na tabela. Título: *Cada um no seu papel.*

> A API é o garçom. O HTTP é pedir e esperar a resposta.

### 12-2 · cerca de 8 s

Na tela: WebSocket, MQTT e broker entram na tabela. Título: *Cada um no seu papel.*

> O WebSocket é a linha aberta. O MQTT é o canal com inscritos, e o broker é a plataforma.

### 12-3 · cerca de 9 s

Na tela: ESP32 entra na tabela; aparecem os botões do laboratório e do quiz. Título: *Cada um no seu papel.*

> E o ESP32 é quem sente e age no mundo físico. Agora é com você: faça o quiz e abra o laboratório.

## 13 · Quiz

Sobretítulo: **QUIZ RÁPIDO** · 1 trecho · cerca de 5 s

### 13-1 · cerca de 5 s

Na tela: Primeira pergunta do quiz. Título: *Bora testar? 5 perguntas.*

> Toque na resposta que você acha certa. No fim, aparece a sua pontuação.
