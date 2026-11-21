"""Sound for the full-quality recess-kit film: the female voice-over (Gemini TTS "Sulafat", WORK/vt1..vt7.wav), a professionally
produced CC0 instrumental (see MUSIC.md; decoded to WORK/music/music.wav by make_hq.sh) edited to length with fades and ducked under the
voice, and subtle synthesised cues from audio.py. Stereo 48 kHz; make_hq.sh then normalises the mix to -14 LUFS.
  python3 audio_hq.py WORK h|v   ->  WORK/audio_hq_h.wav or WORK/audio_hq_v.wav"""
import sys, os, wave
import numpy as np
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
WORK, MODE = sys.argv[1], sys.argv[2]
sys.argv = [sys.argv[0], WORK, 'h']                     # reuse audio.py's cue generators without running its main mix
import importlib.util
spec = importlib.util.spec_from_file_location('acues', os.path.join(os.path.dirname(os.path.abspath(__file__)), 'audio.py'))
src = open(spec.origin).read().split("if MODE == 'h':")[0]
A = {'__file__': spec.origin, '__name__': 'acues'}; exec(compile(src, spec.origin, 'exec'), A)
SR, T, shots, load, add = A['SR'], A['T'], A['shots'], A['load'], A['add']

def music_track():
    w = wave.open(os.path.join(WORK, 'music', 'music.wav'))
    a = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32).reshape(-1, w.getnchannels()) / 32768
    assert w.getframerate() == SR
    return a if a.shape[1] == 2 else np.repeat(a, 2, 1)

def db(x): return 10 ** (x / 20)

def build(segments, total, music_from=0.0):
    n = int(total * SR) + SR
    voice = np.zeros(n); fx = np.zeros(n)
    for b, s0, d0, L in segments:
        v = load(b + 1); add(voice, d0 + shots.LEAD[b], v, 1.0)
        D = T['dur'][b]
        if b in (0, 6): add(fx, d0, A['swell'](3.2), 0.12)
        if b == 1: add(fx, d0 + D * 0.08, A['whoosh'](1.4), 0.12)
        if b == 2:
            add(fx, d0 + 0.1, A['whoosh'](1.1, 400, 2500), 0.10)
            for c in shots.ASSEMBLY_CLICKS: add(fx, d0 + D * c, A['click'](), 0.13)
        if b == 3: add(fx, d0 + 0.4, A['drone'](D - 0.6), 0.06)
        if b == 4: add(fx, d0, A['whir'](L), 0.05)
    voice *= 0.85 / (np.abs(voice).max() + 1e-9)
    m = music_track(); s = int(music_from * SR); m = m[s:s + n]
    m = np.pad(m, ((0, max(0, n - len(m))), (0, 0)))
    t = np.arange(n) / SR
    fade = np.minimum(1, t / 1.5) * np.clip((total - t) / 3.0, 0, 1)
    k = int(0.30 * SR); c = np.cumsum(np.pad((np.abs(voice) > 0.02).astype(float), (k // 2, k - k // 2)))
    act = np.clip((c[k:] - c[:-k])[:n] / k * 3, 0, 1)
    k2 = int(0.25 * SR); cs = np.cumsum(np.pad(act, (k2 // 2, k2 - k2 // 2))); act = (cs[k2:] - cs[:-k2])[:n] / k2   # smooth the duck
    # music sits about 12 dB under the voice in the gaps and about 18 dB under it while she speaks
    rms_v = np.sqrt(np.mean(voice[np.abs(voice) > 0.02] ** 2)); rms_m = np.sqrt(np.mean(m ** 2)) + 1e-9
    base = rms_v / rms_m * db(-12)
    g = base * (1 - (1 - db(-6)) * act) * fade
    mix = m * g[:, None] + (voice + fx)[:, None]
    mix *= 0.9 / (np.abs(mix).max() + 1e-9)
    return mix[:int(total * SR)]

if MODE == 'h':
    segs = [(b, T['start'][b], T['start'][b], T['dur'][b]) for b in range(7)]; total = T['total']; mf = 0.0
else:
    d4, d6 = T['dur'][4], T['dur'][6]; segs = [(4, T['start'][4], 0.0, d4), (6, T['start'][6], d4, d6)]; total = d4 + d6; mf = 0.0
mix = build(segs, total, mf)
out = os.path.join(WORK, 'audio_hq_%s.wav' % MODE)
with wave.open(out, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype(np.int16).tobytes())
print(out, round(len(mix) / SR, 1))
