"""Sound for the premium recess-kit film, all made here (no licensed music): a soft composed music bed (warm pad chords and a gentle
pulse), synthesised cues (dusk swell, section whoosh, exploded whoosh, assembly clicks, heat drone, fan spin-up whir) and the
voice-over (WORK/vt1..vt7.wav, trimmed and sped by make.sh), with the music ducked under the voice.
  python3 audio.py WORK h|v   ->  WORK/audio_h.wav (16:9) or WORK/audio_v.wav (Reels: beat 5 then the hero end)"""
import sys, os, wave
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import shots
WORK, MODE = sys.argv[1], sys.argv[2]; SR = 48000
T = shots.load_timeline(WORK)
rng = np.random.default_rng(11)

def load(i):
    w = wave.open(os.path.join(WORK, 'vt%d.wav' % i)); a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    return a if w.getframerate() == SR else np.interp(np.arange(int(len(a) * SR / w.getframerate())) * w.getframerate() / SR, np.arange(len(a)), a)

def bandnoise(n, lo, hi):
    X = np.fft.rfft(rng.normal(0, 1, n)); f = np.fft.rfftfreq(n, 1 / SR); X[(f < lo) | (f > hi)] = 0
    y = np.fft.irfft(X, n); return y / (np.abs(y).max() + 1e-9)

def env(n, att, rel):
    e = np.ones(n); a = int(att * SR); r = int(rel * SR)
    if a: e[:a] = np.linspace(0, 1, a)
    if r: e[-r:] = np.minimum(e[-r:], np.linspace(1, 0, r))
    return e

def music(total):
    n = int(total * SR); t = np.arange(n) / SR; out = np.zeros(n)
    chords = [(57, 61, 64, 68), (54, 57, 61, 64), (50, 54, 57, 61), (52, 56, 59, 64)]     # Amaj7, F#m7, Dmaj7, E
    seg = 7.6
    for k in range(int(total / seg) + 1):
        c = chords[k % 4]; s0 = int(k * seg * SR); s1 = min(n, int((k + 1) * seg * SR) + int(1.2 * SR))
        if s0 >= n: break
        tt = t[s0:s1] - k * seg; e = np.minimum(1, tt / 1.6) * np.minimum(1, np.maximum(0, (seg + 1.2 - tt) / 1.6))
        for m in c:
            f = 440 * 2 ** ((m - 69) / 12)
            for det in (-0.6, 0.6):
                out[s0:s1] += 0.11 * e * np.sin(2 * np.pi * (f + det) * tt + rng.uniform(0, 6))
        out[s0:s1] += 0.08 * e * np.sin(2 * np.pi * (440 * 2 ** ((c[0] - 12 - 69) / 12)) * tt)
    beat = 60 / 72                                                     # a soft low pulse from beat 2 on
    for k in range(int(total / beat)):
        tk = k * beat
        if tk < T['start'][1] or tk > T['start'][6] + 3: continue
        c = chords[int(tk / seg) % 4]; f = 440 * 2 ** ((c[0] - 24 - 69) / 12) * (1.5 if k % 4 == 2 else 1)
        s0 = int(tk * SR); L = int(0.7 * SR); tt = np.arange(min(L, n - s0)) / SR
        out[s0:s0 + len(tt)] += 0.10 * np.exp(-tt * 6) * np.sin(2 * np.pi * f * tt)
    return out / (np.abs(out).max() + 1e-9)

def add(buf, t0, x, g):
    s = int(t0 * SR)
    if s >= len(buf): return
    x = x[:len(buf) - s]; buf[s:s + len(x)] += g * x

def swell(d=3.0):
    n = int(d * SR); t = np.arange(n) / SR; e = np.sin(np.pi * np.minimum(1, t / d)) ** 2
    return e * (0.6 * np.sin(2 * np.pi * 55 * t) + 0.4 * np.sin(2 * np.pi * 82.4 * t) + 0.25 * bandnoise(n, 200, 1200))

def whoosh(d=1.3, lo=300, hi=4000):
    n = int(d * SR); t = np.arange(n) / SR; x = np.zeros(n); k = 8
    for i in range(k):
        a, b = int(i * n / k), int((i + 1) * n / k); fc = lo + (hi - lo) * (i / k)
        x[a:b] = bandnoise(b - a, fc * 0.6, fc * 1.4)
    return x * np.sin(np.pi * t / d) ** 2

def click():
    n = int(0.09 * SR); t = np.arange(n) / SR
    return (0.6 * bandnoise(n, 2000, 9000) * np.exp(-t * 90) + 0.5 * np.sin(2 * np.pi * 2600 * t) * np.exp(-t * 60)) * 0.9

def drone(d):
    n = int(d * SR); t = np.arange(n) / SR; e = np.minimum(1, t / (d * 0.7)) * np.minimum(1, (d - t) / 0.8)
    return e * (0.5 * np.sin(2 * np.pi * 73.4 * t) + 0.35 * np.sin(2 * np.pi * 110 * t * (1 + 0.004 * t)) + 0.15 * bandnoise(n, 80, 400))

def whir(d, spin=1.6):
    n = int(d * SR); t = np.arange(n) / SR; ramp = np.minimum(1, t / spin)
    f = 35 + 85 * ramp; ph = 2 * np.pi * np.cumsum(f) / SR
    tone = 0.5 * np.sin(ph) + 0.25 * np.sin(2 * ph)
    return (tone + 0.7 * bandnoise(n, 300, 2200)) * ramp * np.minimum(1, (d - t) / 0.8) * 0.5

def build(segments, total):
    """segments: list of (beat, source_start, dest_start, length)."""
    n = int(total * SR) + SR
    voice = np.zeros(n); fx = np.zeros(n)
    for b, s0, d0, L in segments:
        v = load(b + 1); add(voice, d0 + shots.LEAD[b], v, 1.0)
        D = T['dur'][b]
        if b in (0, 6): add(fx, d0, swell(3.2), 0.28)
        if b == 1: add(fx, d0 + D * 0.08, whoosh(1.4), 0.30)
        if b == 2:
            add(fx, d0 + 0.1, whoosh(1.1, 400, 2500), 0.22)
            for c in shots.ASSEMBLY_CLICKS: add(fx, d0 + D * c, click(), 0.30)
        if b == 3: add(fx, d0 + 0.4, drone(D - 0.6), 0.16)
        if b == 4: add(fx, d0, whir(L), 0.11)
    voice *= 0.89 / (np.abs(voice).max() + 1e-9)
    m = music(total + 1); m = np.pad(m, (0, max(0, n - len(m))))[:n]
    k = int(0.25 * SR); c = np.cumsum(np.pad((np.abs(voice) > 0.02).astype(float), (k // 2, k - k // 2)))
    act = (c[k:] - c[:-k])[:n] / k                      # moving average (fast)
    duck = 1 - 0.45 * np.clip(act * 3, 0, 1)
    fade = np.minimum(1, np.arange(n) / SR / 1.5) * np.clip((total - np.arange(n) / SR) / 2.0, 0, 1)
    mix = voice + fx + 0.075 * m * duck * fade
    mix = np.tanh(mix * 1.1) / np.tanh(1.1)
    mix *= 0.95 / (np.abs(mix).max() + 1e-9)
    return mix[:int(total * SR)]

if MODE == 'h':
    segs = [(b, T['start'][b], T['start'][b], T['dur'][b]) for b in range(7)]; total = T['total']
else:
    d4, d6 = T['dur'][4], T['dur'][6]; segs = [(4, T['start'][4], 0.0, d4), (6, T['start'][6], d4, d6)]; total = d4 + d6
mix = build(segs, total)
out = os.path.join(WORK, 'audio_%s.wav' % MODE)
with wave.open(out, 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
print(out, round(len(mix) / SR, 1))
