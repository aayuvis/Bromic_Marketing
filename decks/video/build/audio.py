"""Voice-over track: each scene's voice (vo1..vo4.wav, Gemini TTS 24 kHz), sped to 1.08x with ffmpeg atempo (pitch kept),
placed at its scene start, with a very soft ambient pad made here from sine tones (no licensed music).
Usage: python3 audio.py WORK h|v"""
import sys, os, json, subprocess, wave
import numpy as np
WORK, MODE = sys.argv[1], sys.argv[2]
SR = 48000
T = json.load(open(os.path.join(WORK, f'timing_{MODE}.json')))
def load(path, tempo):
    out = os.path.join(WORK, f'_t{os.path.basename(path)}_{tempo}.wav')
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', path, '-filter:a', f'atempo={tempo},aresample={SR}', '-ac', '1', out], check=True)
    w = wave.open(out); a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768; return a
total = T['total']; n = int(total * SR) + SR
voice = np.zeros(n, np.float32)
if MODE == 'h':
    starts = np.cumsum([0] + T['dur'][:-1]); lead = [0.9, 0.35, 0.35, 0.5]
    for i in range(4):
        a = load(os.path.join(WORK, f'vo{i + 1}.wav'), 1.08); s = int((starts[i] + lead[i]) * SR); voice[s:s + len(a)] += a[:n - s]
else:
    a = load(os.path.join(WORK, 'vo3.wav'), 1.15); s = int(0.35 * SR); voice[s:s + len(a)] += a[:n - s]
voice *= 0.89 / max(1e-6, np.abs(voice).max())
t = np.arange(n) / SR
pad = np.zeros(n, np.float32)
for f, g in ((110.0, 1.0), (164.81, 0.7), (220.0, 0.5), (277.18, 0.35)):     # A2, E3, A3, C#4: a soft open chord
    pad += g * np.sin(2 * np.pi * f * t) * (0.6 + 0.4 * np.sin(2 * np.pi * t / (9 + f / 50)))
pad /= np.abs(pad).max()
k = np.ones(400) / 400; pad = np.convolve(pad, k, 'same')                     # gentle low-pass
env = np.minimum(1, t / 3) * np.minimum(1, np.maximum(0, (total - t) / 3))
mix = voice + pad * env * 0.045                                             # about -27 dB under the voice
mix = np.clip(mix, -1, 1)
out = os.path.join(WORK, f'audio_{MODE}.wav')
with wave.open(out, 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
print(out, round(len(mix) / SR, 1))
