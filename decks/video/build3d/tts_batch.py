"""Record the voice-over for both versions with tts.py: TAKES takes per line, keep the liveliest sane take (pitch movement in semitones;
a take far longer than the words need, e.g. one that read the style prompt aloud, is refused).
  python3 tts_batch.py OUTDIR us|au      -> OUTDIR/<ver>/vo1..vo8.wav"""
import sys, os, re, subprocess, wave, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__))
OUT, VER = sys.argv[1], sys.argv[2]; TAKES = int(os.environ.get('TAKES', '2'))
VOICE = {'us': 'Achernar', 'au': 'Sulafat'}[VER]
STYLE = {'us': 'Say this as a warm, upbeat American product presenter, smiling, with energy and natural conversational pacing, lightly stressing the key words:',
         'au': 'Say this in a natural Australian accent, as a warm, upbeat presenter, smiling, with energy and natural conversational pacing, lightly stressing the key words:'}[VER]
VO = [' '.join(v.split()) for v in re.findall(r'\[\d · [^\]]*\]\n(.+?)(?:\n\n|\Z)', open(os.path.join(HERE, 'voiceover.txt')).read(), re.S)]
def score(p, words):
    w = wave.open(p); sr = w.getframerate(); a = np.frombuffer(w.readframes(w.getnframes()), np.int16) / 32768
    N, H = int(0.04 * sr), int(0.01 * sr); f0 = []
    for i in range(0, len(a) - N, H):
        x = a[i:i + N] * np.hanning(N)
        if np.sqrt(np.mean(x ** 2)) < 0.02: continue
        c = np.correlate(x, x, 'full')[N - 1:]; lo, hi = int(sr / 400), int(sr / 75); k = lo + np.argmax(c[lo:hi])
        if c[k] > 0.45 * c[0]: f0.append(sr / k)
    d = len(a) / sr; st = 12 * np.log2(np.array(f0) / np.median(f0))
    return (st.std() if d < words * 0.62 + 1.5 else -1), d
os.makedirs(os.path.join(OUT, VER), exist_ok=True)
for i, line in enumerate(VO, 1):
    dst = os.path.join(OUT, VER, 'vo%d.wav' % i)
    if os.path.exists(dst) and not os.environ.get('REDO'): continue
    best = None
    for k in range(TAKES):
        p = os.path.join(OUT, VER, 'take%d_%d.wav' % (i, k))
        if not os.path.exists(p): subprocess.run(['python3', os.path.join(HERE, 'tts.py'), line, p, VOICE, STYLE], check=True)
        s, d = score(p, len(line.split())); print(VER, i, k, 'pitch std %.2f st' % s, '%.1f s' % d, flush=True)
        if best is None or s > best[0]: best = (s, p)
    os.replace(best[1], dst)
print('done', VER, VOICE)
