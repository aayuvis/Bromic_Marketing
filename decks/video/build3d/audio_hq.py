"""Sound for the recess-kit film (v4): the voice-over for one version (WORK/vo/<us|au>/vt1..vt8.wav), the film's own composed music
(music.py: nothing licensed, nothing downloaded) ducked under the voice, and a few quiet TONAL cues. The owner heard a hiss at 0:07 in
v3 (the section-sweep whoosh, filtered noise): v4 has no noise-based sound at all - every cue is built from sine tones.
Stereo 48 kHz; make_hq.sh then normalises the mix to -14 LUFS integrated (-1.5 dBTP).
  python3 audio_hq.py WORK h|v us|au   ->  WORK/audio_<mode>_<ver>.wav"""
import sys, os, wave
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import shots, music
from shots import OPEN, EXPL, KIT, END
WORK, MODE, VER = sys.argv[1], sys.argv[2], sys.argv[3]
SR = 48000; T = shots.load_timeline(WORK)
VOMAX = [max(a, b) for a, b in zip(*T['vo'].values())]

def load(i):
    w = wave.open(os.path.join(WORK, 'vo', VER, 'vt%d.wav' % i)); a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
    assert w.getframerate() == SR; return a
def add(buf, t0, x, g):
    s = int(t0 * SR)
    if s >= len(buf): return
    x = x[:len(buf) - s]; buf[s:s + len(x)] += g * x
def db(x): return 10 ** (x / 20)

def switch_on(d=2.2):
    """The heater coming on: a soft tonal click, then a warm two-note swell (no noise)."""
    n = int(d * SR); t = np.arange(n) / SR
    clk = np.sin(2 * np.pi * 1450 * t) * np.exp(-t * 90) * 0.6
    e = np.minimum(1, t / 1.1) * np.exp(-np.maximum(0, t - 1.1) * 2.2)
    sw = e * (0.55 * np.sin(2 * np.pi * 146.8 * t) + 0.35 * np.sin(2 * np.pi * 220.0 * t) + 0.15 * np.sin(2 * np.pi * 293.7 * t))
    return clk + 0.5 * sw
def tick():
    n = int(0.12 * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 2350 * t) * np.exp(-t * 70) + 0.5 * np.sin(2 * np.pi * 880 * t) * np.exp(-t * 40)) * 0.8
def fan_hum(d):
    """Fans spinning up and running: low tones that rise with the spin, then sit quietly (no noise)."""
    n = int(d * SR); t = np.arange(n) / SR; ramp = np.minimum(1, t / shots.SPINUP)
    f = 40 + 70 * ramp; ph = 2 * np.pi * np.cumsum(f) / SR
    return (0.6 * np.sin(ph) + 0.25 * np.sin(2 * ph) + 0.1 * np.sin(3 * ph)) * ramp * np.minimum(1, (d - t) / 0.8) * np.where(t < 2.5, 1.0, 0.55)

def build(segments, total, end_at):
    """segments: (beat, dest_start)."""
    n = int(total * SR) + SR
    voice = np.zeros(n); fx = np.zeros(n)
    for b, d0 in segments:
        add(voice, d0 + shots.LEAD[b], load(b + 1), 1.0)
        D = T['dur'][b]
        if b == OPEN: add(fx, d0 + shots.LEAD[OPEN] + 0.25, switch_on(), 0.10)
        if b == EXPL:
            for c in shots.ASSEMBLY_CLICKS: add(fx, d0 + D * c, tick(), 0.07)
        if b == KIT: add(fx, d0, fan_hum(min(D, 6.0)), 0.035)
    voice *= 0.85 / (np.abs(voice).max() + 1e-9)
    m = music.compose(total + 0.5, end_at); m = np.pad(m, ((0, max(0, n - len(m))), (0, 0)))[:n]
    k = int(0.30 * SR); c = np.cumsum(np.pad((np.abs(voice) > 0.02).astype(float), (k // 2, k - k // 2)))
    act = np.clip((c[k:] - c[:-k])[:n] / k * 3, 0, 1)
    k2 = int(0.35 * SR); cs = np.cumsum(np.pad(act, (k2 // 2, k2 - k2 // 2))); act = (cs[k2:] - cs[:-k2])[:n] / k2   # smooth the duck
    # the music sits about 9 dB under the voice in the gaps and about 16 dB under it while she speaks
    rms_v = np.sqrt(np.mean(voice[np.abs(voice) > 0.02] ** 2)); rms_m = np.sqrt(np.mean(m[:int(total * SR)] ** 2)) + 1e-9
    g = rms_v / rms_m * db(-9) * (1 - (1 - db(-7)) * act)
    mix = m * g[:, None] + (voice + fx)[:, None]
    mix *= 0.9 / (np.abs(mix).max() + 1e-9)
    return mix[:int(total * SR)]

if MODE == 'h':
    segs = [(b, T['start'][b]) for b in range(shots.NB)]; total = T['total']
    end_at = T['start'][END] + shots.LEAD[END] + VOMAX[END] * 0.55
else:
    dk = T['dur'][KIT]; segs = [(KIT, 0.0), (END, dk)]; total = dk + T['dur'][END]
    end_at = dk + shots.LEAD[END] + VOMAX[END] * 0.55
mix = build(segs, total, end_at)
out = os.path.join(WORK, 'audio_%s_%s.wav' % (MODE, VER))
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
print(out, round(len(mix) / SR, 1))
