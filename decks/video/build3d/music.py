"""Original music for the recess-kit film, composed and synthesised here in numpy (no samples, no third-party material: nothing to license).
A warm, modern, light groove at 96 BPM in D major: an electric piano (two-operator FM, soft bell attack), a felt-piano style pluck
arpeggio, a round sub bass, a lifted pad, and a soft tonal pulse (a low "thump" and a quiet high tick made from decaying sine tones,
never noise: the owner asked for no hiss). Chords one a bar: Dmaj9 - Bm9 - Gmaj9 - A7sus4 (I - vi - IV - V), with a lift from bar 5
(arpeggio up an octave, pad opens), a breath where the exploded view holds, and a resolved Dmaj9 ending timed to the end card.
  python3 music.py OUT.wav TOTAL_SECONDS [END_AT]     (stereo 48 kHz; END_AT = where the last chord lands, default TOTAL - 4.5)"""
import sys, wave, numpy as np

SR = 48000; BPM = 96; BEAT = 60 / BPM; BAR = 4 * BEAT
rng = np.random.default_rng(3)
def hz(m): return 440.0 * 2 ** ((m - 69) / 12)
# voicings (MIDI): (bass root, chord tones for the EP, arpeggio notes)
CH = [(38, (62, 66, 69, 73, 76), (62, 66, 69, 73, 76, 73, 69, 66)),      # Dmaj9: D F# A C# E
      (35, (61, 62, 66, 69, 73), (59, 62, 66, 69, 73, 69, 66, 62)),      # Bm9:  B D F# A C#
      (31, (59, 62, 66, 69, 71), (55, 59, 62, 66, 69, 66, 62, 59)),      # Gmaj9: G B D F# A
      (33, (62, 64, 67, 69, 74), (57, 62, 64, 67, 69, 67, 64, 62))]      # A7sus4: A D E G

def ep(f, d, vel=1.0):
    """FM electric piano: carrier 1:1 with a decaying modulation index (bell, then warm body), slight tremolo."""
    n = int(d * SR); t = np.arange(n) / SR
    idx = 1.6 * np.exp(-t * 7) + 0.35
    y = np.sin(2 * np.pi * f * t + idx * np.sin(2 * np.pi * f * t)) * np.exp(-t * 1.1)
    y += 0.18 * np.sin(2 * np.pi * 14 * f * t) * np.exp(-t * 18)          # tine
    rel = np.minimum(1, (d - t) / 0.25)
    return vel * y * rel * (1 + 0.06 * np.sin(2 * np.pi * 4.5 * t))

def pluck(f, d=0.6, vel=1.0):
    n = int(d * SR); t = np.arange(n) / SR
    y = (np.sin(2 * np.pi * f * t) + 0.35 * np.sin(4 * np.pi * f * t) * np.exp(-t * 9) + 0.12 * np.sin(6 * np.pi * f * t) * np.exp(-t * 14))
    return vel * y * np.exp(-t * 5.5) * np.minimum(1, t / 0.004)

def bass(f, d):
    n = int(d * SR); t = np.arange(n) / SR
    y = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t) * np.exp(-t * 3)
    return y * np.minimum(1, t / 0.01) * np.exp(-t * 0.9) * np.minimum(1, (d - t) / 0.12)

def pad(notes, d):
    n = int(d * SR); t = np.arange(n) / SR; y = np.zeros(n)
    for m in notes:
        for det in (-4, 0, 4):                                              # cents
            f = hz(m) * 2 ** (det / 1200)
            y += (np.sin(2 * np.pi * f * t + rng.uniform(0, 6)) + 0.3 * np.sin(4 * np.pi * f * t + rng.uniform(0, 6)))
    e = np.minimum(1, t / 1.2) * np.minimum(1, (d - t) / 1.2)
    return y * e / (3 * len(notes))

def thump(d=0.35):
    n = int(d * SR); t = np.arange(n) / SR; f = 46 + 70 * np.exp(-t * 30)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 11)

def tick(d=0.05):
    n = int(d * SR); t = np.arange(n) / SR
    return (np.sin(2 * np.pi * 5200 * t) + 0.5 * np.sin(2 * np.pi * 7300 * t)) * np.exp(-t * 140)

def reverb_ir(seconds=2.2, seed=0):
    r = np.random.default_rng(seed); n = int(seconds * SR); t = np.arange(n) / SR
    x = r.normal(0, 1, n) * np.exp(-t * 3.2)
    X = np.fft.rfft(x); fr = np.fft.rfftfreq(n, 1 / SR); X *= 1 / (1 + (fr / 3500) ** 2)   # dark, warm tail
    x = np.fft.irfft(X, n); x[:int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR)); return x / np.sqrt(np.sum(x ** 2))

def conv(a, ir):
    n = len(a) + len(ir); N = 1 << (n - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(a, N) * np.fft.rfft(ir, N), N)[:len(a)]

def place(buf, t0, x, g, pan=0.0):
    s = int(t0 * SR)
    if s >= buf.shape[0] or s + len(x) <= 0: return
    x = x[:buf.shape[0] - s]; l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    buf[s:s + len(x), 0] += g * l * x * 1.41; buf[s:s + len(x), 1] += g * r * x * 1.41

def compose(total, end_at=None):
    end_at = total - 4.5 if end_at is None else end_at
    nbars = int(end_at / BAR); t_end = nbars * BAR                       # the final chord lands on a bar line just before end_at
    shift = end_at - t_end                                                # start a little late so the ending lands on end_at
    n = int((total + 3) * SR)
    dry = np.zeros((n, 2)); wet_send = np.zeros((n, 2))
    for k in range(nbars + 1):
        t0 = shift + k * BAR; last = k == nbars
        root, chord, arp = CH[0] if last else CH[k % 4]
        lift = 1 if (4 <= k < nbars - 1) else 0
        breath = (nbars // 2 - 1) <= k <= (nbars // 2)                    # a lighter bar pair mid-film
        d = (total - t0 + 0.5) if last else BAR + 0.3
        # electric piano: the chord on beat 1, a soft re-voice on the "and" of 3
        for i, m in enumerate(chord):
            place(dry, t0 + i * 0.012, ep(hz(m), min(d, 4.5 if last else BAR)), 0.10, pan=-0.25 + 0.12 * i)
            if not last: place(dry, t0 + 2.5 * BEAT + i * 0.01, ep(hz(m), 1.4, 0.55), 0.06, pan=0.2 - 0.1 * i)
        place(wet_send, t0, pad([m + 12 * lift for m in chord[1:4]], d + 1.0), 0.09 if lift else 0.06)
        if k >= 2 and not last:                                           # bass in from bar 3
            place(dry, t0, bass(hz(root), 2.6 * BEAT), 0.30)
            place(dry, t0 + 2.5 * BEAT, bass(hz(root + (7 if k % 2 else 12)), 1.4 * BEAT), 0.20)
            place(dry, t0 + 3.5 * BEAT, bass(hz(root), 0.5 * BEAT), 0.14)
        if last: place(dry, t0, bass(hz(root), 4.0), 0.26)
        if k >= 1 and not last and not breath:                            # pluck arpeggio, eighths, gentle swing in velocity
            for j in range(8):
                v = (1.0, 0.55, 0.8, 0.5, 0.9, 0.55, 0.75, 0.5)[j]
                place(dry, t0 + j * BEAT / 2, pluck(hz(arp[j] + 12 * lift), 0.7, v), 0.085, pan=(-0.5 if j % 2 else 0.5) * 0.6)
        if k >= 2 and not last and not breath:                            # soft tonal pulse
            for j in range(4):
                if j in (0, 2): place(dry, t0 + j * BEAT, thump(), 0.22)
                place(dry, t0 + j * BEAT + BEAT / 2, tick(), 0.025, pan=0.3)
    wet = np.zeros_like(dry); src = dry * 0.35 + wet_send
    wet[:, 0] = conv(src[:, 0], reverb_ir(2.4, 1)); wet[:, 1] = conv(src[:, 1], reverb_ir(2.4, 2))
    out = dry + wet_send * 0.6 + wet * 0.5
    t = np.arange(n) / SR
    out *= (np.minimum(1, t / 1.0) * np.clip((total - t) / 2.0, 0, 1))[:, None]
    out = np.tanh(out * 1.6) / 1.6                                         # gentle glue
    out /= np.abs(out).max() + 1e-9
    return out[:int(total * SR)]

if __name__ == '__main__':
    out, total = sys.argv[1], float(sys.argv[2]); end_at = float(sys.argv[3]) if len(sys.argv) > 3 else None
    m = compose(total, end_at)
    with wave.open(out, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((m * 0.9 * 32767).astype(np.int16).tobytes())
    print(out, round(len(m) / SR, 1), 's')
