#!/usr/bin/env node
/* =====================================================================
   Exporta a aula (index.html) como vídeo MP4, pronto para o Canva.

   Gera, na pasta de saída:
     aula-completa.mp4        a aula inteira
     capitulos/01-....mp4     um clipe por capítulo (bom para uma página do Canva cada)
     tempos.md                em que segundo começa cada trecho, com o texto para narrar
     legendas.srt             legendas da aula completa
     capa.png                 imagem da abertura

   Uso (na pasta do projeto):
     node ferramentas/exportar-video.mjs                     16:9, sem voz
     node ferramentas/exportar-video.mjs --voz minha         16:9 com as gravações da pasta audio/
     node ferramentas/exportar-video.mjs --formato 9x16      vertical
     node ferramentas/exportar-video.mjs --sem-quiz          termina no capítulo "Para guardar"
     node ferramentas/exportar-video.mjs --saida minha-pasta

   Precisa de: Node 22 ou mais novo, Google Chrome ou Microsoft Edge, e ffmpeg no PATH.
   O vídeo é gravado em tempo real: a exportação leva o mesmo tempo que a aula (uns 5 minutos).
   ===================================================================== */
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

/* ---------- opções ---------- */
const args = {};
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (!a.startsWith('--')) continue;
  const k = a.slice(2), v = process.argv[i + 1];
  if (v && !v.startsWith('--')) { args[k] = v; i++; } else args[k] = true;
}
const FORMATO = args.formato === '9x16' ? '9x16' : '16x9';
const VOZ = args.voz === 'minha' ? 'minha' : 'nenhuma';
const SEM_QUIZ = !!args['sem-quiz'];
const ATE = Number.isInteger(+args.ate) && +args.ate > 0 ? +args.ate : 0; // --ate 3: só até o capítulo 3
const FPS = 30;
// câmera lenta: a página toca a 0,5× e o vídeo volta ao normal; dobra os quadros capturados (vídeo mais suave)
const R = args.rapido ? 1 : Math.min(1, Math.max(.2, +args.lento || .5));
const STEP = 1 / (FPS * R); // segundos reais entre dois quadros do vídeo final
const [W, H] = FORMATO === '16x9' ? [1920, 1080] : [1080, 1920];
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SAIDA = path.resolve(ROOT, args.saida || (FORMATO === '16x9' ? 'video-16x9' : 'video-9x16'));
const INDEX = path.join(ROOT, 'index.html');

const fail = msg => { console.error('\n✖ ' + msg + '\n'); process.exit(1); };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const mmss = s => { const m = Math.floor(s / 60), r = s - m * 60; return `${String(m).padStart(2, '0')}:${r.toFixed(1).padStart(4, '0')}`; };
const srtTime = s => { const ms = Math.round(s * 1000), h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, ss = Math.floor(ms / 1000) % 60; return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')},${String(ms % 1000).padStart(3, '0')}`; };
const slug = t => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/* ---------- conferências ---------- */
if (typeof WebSocket === 'undefined') fail('Este script precisa do Node 22 ou mais novo (node --version).');
if (!fs.existsSync(INDEX)) fail('Não achei o index.html em ' + ROOT);
if (spawnSync('ffmpeg', ['-version']).error) fail('Não achei o ffmpeg. No Windows: winget install Gyan.FFmpeg  (depois feche e abra o terminal).');
const BROWSER = [process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe', 'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
].find(p => p && fs.existsSync(p));
if (!BROWSER) fail('Não achei o Chrome nem o Edge. Indique o caminho em CHROME_PATH.');

fs.mkdirSync(path.join(SAIDA, 'capitulos'), { recursive: true });
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'aula-export-'));
console.log(`Exportando em ${FORMATO} (${W}×${H}), voz: ${VOZ}${SEM_QUIZ ? ', sem o quiz' : ''}`);
console.log(`Saída: ${SAIDA}\nA aula toca em câmera lenta (${R}×) para o vídeo ficar suave; isso leva uns ${Math.round(5 / R)} minutos.\n`);

/* ---------- não deixar o computador dormir durante a gravação ---------- */
let acordado = null;
if (process.platform === 'win32') {
  const ps = "$t = Add-Type -MemberDefinition '[DllImport(\"kernel32.dll\")] public static extern uint SetThreadExecutionState(uint f);' -Name Acordado -Namespace Aula -PassThru; " +
    'while ($true) { [void]$t::SetThreadExecutionState(0x80000003); Start-Sleep -Seconds 30 }';
  acordado = spawn('powershell', ['-NoProfile', '-NonInteractive', '-Command', ps], { stdio: 'ignore' });
} else if (process.platform === 'darwin') {
  acordado = spawn('caffeinate', ['-dis', '-w', String(process.pid)], { stdio: 'ignore' });
}
const filhos = [acordado]; // tudo o que este script abriu é fechado na saída, mesmo com erro
process.on('exit', () => { for (const p of filhos) { try { p?.kill(); } catch { } } });

/* ---------- navegador sem janela + DevTools Protocol ---------- */
const port = 9400 + Math.floor(Math.random() * 400);
const browser = spawn(BROWSER, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${path.join(TMP, 'perfil')}`,
  `--window-size=${W},${H}`, '--force-device-scale-factor=1', '--hide-scrollbars', '--mute-audio',
  '--autoplay-policy=no-user-gesture-required', '--no-first-run', '--no-default-browser-check', 'about:blank'], { stdio: 'ignore' });
filhos.push(browser);
let target;
for (let i = 0; i < 60 && !target; i++) {
  try { target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find(t => t.type === 'page'); } catch { }
  if (!target) await sleep(250);
}
if (!target) { browser.kill(); fail('O navegador não abriu a porta de controle.'); }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
let seq = 0; const pending = new Map(), handlers = {};
ws.onmessage = ev => {
  const m = JSON.parse(ev.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
  else if (m.method) (handlers[m.method] || []).forEach(h => h(m.params));
};
const send = (method, params = {}) => new Promise(r => { const id = ++seq; pending.set(id, r); ws.send(JSON.stringify({ id, method, params })); });
const on = (method, h) => (handlers[method] ||= []).push(h);
const evaluate = async expr => {
  const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true, userGesture: true });
  if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text);
  return r.result?.result?.value;
};

/* ---------- eventos da página: início de cada trecho, áudio tocando, fim ---------- */
const beats = [], audios = []; let endAt = 0;
on('Runtime.bindingCalled', p => {
  if (p.name !== '__expo') return;
  const e = JSON.parse(p.payload);
  if (e.ev === 'beat') { beats.push({ id: e.id, t: e.t / 1000 }); process.stdout.write(`▶ ${e.id} `); }
  if (e.ev === 'audio') audios.push({ id: e.id, url: e.url, t: e.t / 1000 });
  if (e.ev === 'end') endAt = e.t / 1000;
});
on('Runtime.exceptionThrown', p => console.error('\n[página] erro:', p.exceptionDetails?.exception?.description || p.exceptionDetails?.text));

await send('Runtime.enable'); await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false }); // área da página exatamente W×H
await send('Runtime.addBinding', { name: '__expo' });
const loaded = new Promise(r => on('Page.loadEventFired', r));
const url = pathToFileURL(INDEX).href + `?formato=${FORMATO}&exportar=1&voz=${VOZ}&lento=${R}`;
await send('Page.navigate', { url });
await loaded;
await evaluate('document.fonts ? document.fonts.ready.then(() => true) : true');
await sleep(1200);
const scenes = await evaluate(`JSON.stringify(SCENES.map(s => ({ title: s.title, beats: s.beats.map(b => b.say.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ')) })))`).then(JSON.parse);
if (VOZ === 'minha') {
  const r = await evaluate('scanTakes().then(r => JSON.stringify(r))').then(JSON.parse);
  console.log(`Gravações encontradas na pasta audio: ${r.found} de ${r.total}. As que faltam ficam sem voz, no tempo de leitura.`);
  if (!r.found) console.log('(Dica: grave pelo botão "Gravar minha voz" escolhendo a pasta audio, ou salve os arquivos como audio/01-1.mp3 etc.)');
  await evaluate("(setMode('mine', true), true)");
}

/* ---------- captura: cada quadro novo vira quadros a 30 fps no ffmpeg ---------- */
const videoTmp = path.join(TMP, 'video.mp4');
const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
  '-vf', `scale=${W}:${H}:flags=lanczos,setsar=1,format=yuv420p`, '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '16', '-r', String(FPS), videoTmp],
  { stdio: ['pipe', 'inherit', 'inherit'] });
filhos.push(ff);
let last = null, t0 = 0, nextT = 0, written = 0, received = 0;
const writeUntil = async t => {
  if (last && t - nextT > 30) { console.error('\n✖ Salto de mais de 30 s entre quadros (computador suspenso?). Rode de novo.'); process.exit(1); }
  while (last && nextT < t) {
    if (!ff.stdin.write(last)) await new Promise(r => ff.stdin.once('drain', r));
    nextT += STEP; written++;
  }
};
let queue = Promise.resolve();
on('Page.screencastFrame', p => {
  send('Page.screencastFrameAck', { sessionId: p.sessionId });
  const buf = Buffer.from(p.data, 'base64'), t = p.metadata?.timestamp || Date.now() / 1000;
  received++;
  queue = queue.then(async () => { if (t0) await writeUntil(t); last = buf; });
});
await send('Page.startScreencast', { format: 'jpeg', quality: 92, maxWidth: W, maxHeight: H, everyNthFrame: 1 });
await sleep(400);
await evaluate('(startIfNeeded(), go(0, 0, true), true)');
while (!beats.length) await sleep(20);
t0 = beats[0].t; nextT = t0;

// espera o fim: o quiz (último capítulo) ou o começo dele, com --sem-quiz
const abortar = msg => { try { ff.stdin.destroy(); ff.kill(); } catch { } try { browser.kill(); } catch { } fail(msg); };
const limite = Date.now() + 15 / R * 60 * 1000;
let tEnd = 0, volta = Date.now();
while (!tEnd) {
  await sleep(100);
  const agora = Date.now();
  if (agora - volta > 10000) abortar('O computador ficou suspenso durante a gravação e o vídeo sairia com uma parte congelada. Rode de novo, sem deixar o computador dormir.');
  volta = agora;
  if (agora > limite) abortar('A aula não terminou no tempo esperado (a página parou em ' + (beats.at(-1)?.id || '?') + '). Rode de novo; se repetir, teste com --ate 2.');
  const quiz = beats.find(b => b.id.startsWith(String(scenes.length).padStart(2, '0') + '-'));
  const depois = ATE && beats.find(b => b.id.startsWith(String(ATE + 1).padStart(2, '0') + '-'));
  if (depois) tEnd = depois.t;
  else if (SEM_QUIZ && quiz) tEnd = quiz.t;
  else if (endAt) tEnd = endAt + 3 / R; // 3 s de vídeo parado no fim
}
while (Date.now() / 1000 < tEnd + 0.3) await sleep(50);
await send('Page.stopScreencast');
await queue;
await writeUntil(tEnd);
ff.stdin.end();
await new Promise(r => ff.on('close', r));
ws.close(); browser.kill();
const total = (tEnd - t0) * R; // duração do vídeo final, em segundos
console.log(`\n\nCapturados ${received} quadros (${(received / total).toFixed(1)} por segundo de vídeo), vídeo de ${mmss(total)}.`);

/* ---------- áudio (opcional) e vídeo completo ---------- */
const run = (a, label) => { const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', ...a], { stdio: 'inherit' }); if (r.status !== 0) fail('O ffmpeg falhou em: ' + label); };
const completo = path.join(SAIDA, 'aula-completa.mp4');
const usados = audios.filter(a => a.t < tEnd).map(a => ({ ...a, file: a.url.startsWith('blob:') ? null : path.join(ROOT, decodeURI(a.url).replace(/\?.*$/, '')) })).filter(a => a.file && fs.existsSync(a.file));
if (usados.length) {
  const inputs = usados.flatMap(a => ['-i', a.file]);
  const delays = usados.map((a, i) => { const ms = Math.max(0, Math.round((a.t - t0) * R * 1000)); return `[${i + 1}:a]aresample=48000,adelay=${ms}|${ms}[a${i}]`; });
  const mix = `${delays.join(';')};${usados.map((_, i) => `[a${i}]`).join('')}amix=inputs=${usados.length}:normalize=0:dropout_transition=0,apad[aout]`;
  run(['-i', videoTmp, ...inputs, '-filter_complex', mix, '-map', '0:v', '-map', '[aout]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', completo], 'mixar o áudio');
  const atrasos = usados.map(a => { const b = beats.find(x => x.id === a.id); return b ? (a.t - b.t) * R * 1000 : 0; });
  console.log(`Voz: ${usados.length} gravações encaixadas no vídeo (a voz começa em média ${Math.round(atrasos.reduce((s, x) => s + x, 0) / atrasos.length)} ms depois do início da animação de cada trecho).`);
} else {
  run(['-i', videoTmp, '-c:v', 'copy', '-movflags', '+faststart', completo], 'salvar o vídeo');
}

/* ---------- capítulos, tempos, legendas e capa ---------- */
const rel = t => Math.max(0, (t - t0) * R);
const caps = scenes.map((s, si) => {
  const pre = String(si + 1).padStart(2, '0') + '-';
  const bs = beats.filter(b => b.id.startsWith(pre) && b.t < tEnd);
  return { si, title: s.title, beats: bs, start: bs.length ? rel(bs[0].t) : null };
}).filter(c => c.start !== null);
caps.forEach((c, i) => { c.end = i + 1 < caps.length ? caps[i + 1].start : total; });
for (const c of caps) {
  const nome = `${String(c.si + 1).padStart(2, '0')}-${slug(c.title)}.mp4`;
  run(['-ss', c.start.toFixed(3), '-to', c.end.toFixed(3), '-i', completo, '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p',
    ...(usados.length ? ['-c:a', 'aac', '-b:a', '192k'] : ['-an']), '-movflags', '+faststart', path.join(SAIDA, 'capitulos', nome)], 'cortar ' + nome);
  c.file = nome;
  process.stdout.write(`✓ capitulos/${nome}\n`);
}

const allBeats = beats.filter(b => b.t < tEnd).map((b, i, arr) => {
  const [cap, tr] = b.id.split('-').map(Number);
  return { ...b, start: rel(b.t), end: i + 1 < arr.length ? rel(arr[i + 1].t) : total, text: scenes[cap - 1]?.beats[tr - 1] || '' };
});
const srt = allBeats.map((b, i) => `${i + 1}\n${srtTime(b.start)} --> ${srtTime(Math.max(b.start + .5, b.end - .05))}\n${b.text}\n`).join('\n');
fs.writeFileSync(path.join(SAIDA, 'legendas.srt'), srt, 'utf8');

let md = `# Tempos da aula (${FORMATO})\n\nVídeo completo: **aula-completa.mp4**, ${mmss(total)}.\n` +
  `Cada linha diz em que momento o trecho começa e o que narrar nele. "No clipe" é o tempo dentro do arquivo do capítulo.\n` +
  `Para gravar a voz no Canva: coloque cada clipe numa página, use "Gravar a si mesmo" e leia os trechos na ordem; o próximo trecho começa no tempo indicado.\n`;
for (const c of caps) {
  md += `\n## ${String(c.si + 1).padStart(2, '0')} · ${c.title}\n\nArquivo: \`capitulos/${c.file}\` · começa em ${mmss(c.start)} · dura ${mmss(c.end - c.start)}\n\n| Trecho | No vídeo | No clipe | Texto |\n|---|---|---|---|\n`;
  for (const b of allBeats.filter(x => x.id.startsWith(String(c.si + 1).padStart(2, '0') + '-')))
    md += `| ${b.id} | ${mmss(b.start)} | ${mmss(b.start - c.start)} | ${b.text.replace(/\|/g, '/')} |\n`;
}
fs.writeFileSync(path.join(SAIDA, 'tempos.md'), md, 'utf8');
run(['-ss', '0.8', '-i', completo, '-frames:v', '1', path.join(SAIDA, 'capa.png')], 'tirar a capa');

fs.rmSync(TMP, { recursive: true, force: true });
console.log(`\nPronto! Arquivos em ${SAIDA}`);
console.log(' · aula-completa.mp4  · capitulos/  · tempos.md  · legendas.srt  · capa.png');
process.exit(0); // fecha também o processo que mantém o computador acordado
