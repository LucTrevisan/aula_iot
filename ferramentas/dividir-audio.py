"""
Divide uma narração gravada de uma vez só (audio/audio.mp3) em um arquivo por trecho
(audio/01-1.mp3, audio/01-2.mp3 ...) e escreve audio/indice.js para o player.

Como funciona: transcreve o áudio com tempo de cada palavra (Whisper), casa as palavras com o
roteiro.txt e corta no meio da pausa que vem antes da primeira palavra de cada trecho.

Uso (na pasta do projeto):
    pip install faster-whisper          (só na primeira vez)
    python ferramentas/dividir-audio.py
    python ferramentas/dividir-audio.py outra-gravacao.mp3

Precisa do ffmpeg no PATH. Na primeira vez, baixa o modelo de reconhecimento de voz (~500 MB).
"""
import json, os, re, subprocess, sys, unicodedata, difflib

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AUDIO = sys.argv[1] if len(sys.argv) > 1 else os.path.join(RAIZ, "audio", "audio.mp3")
ROTEIRO = os.path.join(RAIZ, "roteiro.txt")
PASTA = os.path.join(RAIZ, "audio")
MODELO = os.environ.get("MODELO_WHISPER", "small")


def norm(s):
    s = unicodedata.normalize("NFD", s.lower())
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.findall(r"[a-z0-9]+", s)


def transcrever():
    from faster_whisper import WhisperModel
    print(f"Transcrevendo {os.path.basename(AUDIO)} (modelo {MODELO}); leva alguns minutos...")
    model = WhisperModel(MODELO, device="cpu", compute_type="int8")
    segs, info = model.transcribe(AUDIO, language="pt", word_timestamps=True, vad_filter=False, beam_size=5,
                                  initial_prompt="Aula sobre API, HTTP, WebSocket, MQTT, broker, ESP32, JSON, polling, full-duplex, QoS, Babylon.js, WebXR, LED, LDR.")
    words = [{"w": w.word.strip(), "s": w.start, "e": w.end} for seg in segs for w in (seg.words or [])]
    return words, info.duration


def silencios():
    out = subprocess.run(["ffmpeg", "-hide_banner", "-nostats", "-i", AUDIO, "-af", "silencedetect=noise=-38dB:d=0.12", "-f", "null", "-"],
                         capture_output=True, text=True, encoding="utf-8", errors="ignore").stderr
    res, st = [], None
    for line in out.splitlines():
        m = re.search(r"silence_start: ([\d.]+)", line)
        if m: st = float(m.group(1))
        m = re.search(r"silence_end: ([\d.]+)", line)
        if m and st is not None: res.append((st, float(m.group(1)))); st = None
    return res


def main():
    if not os.path.exists(AUDIO): sys.exit(f"Não achei {AUDIO}")
    trechos = []
    for line in open(ROTEIRO, encoding="utf-8"):
        m = re.match(r"^\[(\d\d-\d+)\]\s*(.*)$", line.strip())
        if m: trechos.append((m.group(1), m.group(2)))
    S, Sk = [], []
    for k, (_, txt) in enumerate(trechos):
        for tok in norm(txt): S.append(tok); Sk.append(k)

    words, dur = transcrever()
    T, Tw = [], []
    for i, w in enumerate(words):
        for tok in norm(w["w"]): T.append(tok); Tw.append(i)
    s2t = {}
    for a, b, n in difflib.SequenceMatcher(None, S, T, autojunk=False).get_matching_blocks():
        for j in range(n): s2t[a + j] = b + j
    print(f"Palavras do roteiro reconhecidas na gravação: {100 * len(s2t) / len(S):.0f}%")
    sil = silencios()

    cuts = [0.0]
    for k in range(1, len(trechos)):
        idxs = [i for i, kk in enumerate(Sk) if kk == k]
        hit = next(((Tw[s2t[si]], off) for off, si in enumerate(idxs) if si in s2t), None)
        if not hit: sys.exit(f"Não encontrei o trecho {trechos[k][0]} na gravação. Confira se ele foi lido.")
        wm, off = hit
        if off == 0:
            start, prev = words[wm]["s"], (words[wm - 1]["e"] if wm > 0 else 0.0)
            lo, hi = min(prev, start) - 0.25, max(prev, start) + 0.25
        else:  # as primeiras palavras não foram reconhecidas: maior pausa antes da primeira reconhecida
            start, prev = words[wm]["s"], words[max(0, wm - off - 1)]["s"]
            lo, hi = prev, start + 0.1
        cand = [(a, b) for a, b in sil if b > lo and a < hi]
        cuts.append(round((lambda ab: (ab[0] + ab[1]) / 2)(max(cand, key=lambda x: x[1] - x[0])) if cand else (prev + start) / 2, 3))
    cuts.append(dur)

    index = {}
    for k, (tid, _) in enumerate(trechos):
        a, b = cuts[k], cuts[k + 1]
        if b - a < 0.5: sys.exit(f"O trecho {tid} ficou curto demais ({b - a:.2f} s). Confira a gravação.")
        nome = f"{tid}.mp3"
        fade = f"afade=t=in:st=0:d=0.015,afade=t=out:st={max(0, b - a - 0.025):.3f}:d=0.025"
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-ss", f"{a:.3f}", "-to", f"{b:.3f}", "-i", AUDIO,
                        "-af", fade, "-c:a", "libmp3lame", "-b:a", "160k", "-ar", "44100", os.path.join(PASTA, nome)], check=True)
        index[tid] = nome
        print(f"  {tid}  {a:7.2f}s → {b:7.2f}s")
    with open(os.path.join(PASTA, "indice.js"), "w", encoding="utf-8") as f:
        f.write("// Narração dividida por trecho (gerado por ferramentas/dividir-audio.py). O player usa esta lista.\n")
        f.write("window.AUDIO_INDEX = " + json.dumps(index, indent=1) + ";\n")
    print(f"\nPronto: {len(index)} arquivos em audio/ e audio/indice.js.")


if __name__ == "__main__":
    main()
