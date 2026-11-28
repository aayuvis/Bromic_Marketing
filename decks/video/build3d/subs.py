"""Subtitles for one voice version as an ASS file (burned in at encode time, so the US and AU films share one picture).
Lines come from voiceover.txt, broken at sentence ends first, then commas, never more than 11 words; each line's time is its share of
that version's own recorded line.   python3 subs.py WORK us|au OUT.ass"""
import sys, os, re, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__))); import shots
WORK, VER, OUT = sys.argv[1:4]
T = shots.load_timeline(WORK); L = T['vo'][VER]
VO = [' '.join(v.split()) for v in re.findall(r'\[\d · [^\]]*\]\n(.+?)(?:\n\n|\Z)', open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'voiceover.txt')).read(), re.S)]
def chunks(s, n=11):
    w = s.split(); out = []; cur = []
    for i, x in enumerate(w):
        cur.append(x)
        end = x.endswith(('.', '?', ':')); comma = x.endswith(',')
        soon = any(y.endswith(('.', '?', ':')) for y in w[i + 1:i + 3])
        if end or (len(cur) >= n and not soon) or (comma and len(cur) >= 4): out.append(' '.join(cur)); cur = []
    if cur:
        if out and len(cur) <= 2: out[-1] += ' ' + ' '.join(cur)
        else: out.append(' '.join(cur))
    return out
SHOW = [('Two, three, four and six kilowatts', '2, 3, 4 and 6 kW'), ('seven and a half inches', '7.5 inches'), ('Seven and a half inches', '7.5 inches'),
        ('six-kilowatt', '6 kW'), ('bromic dot com', 'bromic.com')]
def show(c):
    for a, b in SHOW: c = c.replace(a, b)
    return c
def ts(x): h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60; return '%d:%02d:%05.2f' % (h, m, s)
head = """[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
WrapStyle: 2
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Sub,Liberation Sans,31,&H00FFFFFF,&H00FFFFFF,&H4C141412,&H4C141412,0,0,0,0,100,100,0,0,3,9,0,2,60,60,46,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
ev = []
for i, s in enumerate(VO):
    t0 = T['start'][i] + shots.LEAD[i]; cs = chunks(s); wts = [len(c) + 6 for c in cs]; tot = sum(wts); acc = t0
    for c, w in zip(cs, wts):
        dt = L[i] * w / tot; ev.append('Dialogue: 0,%s,%s,Sub,,0,0,0,,%s' % (ts(acc), ts(acc + dt - 0.04), show(c))); acc += dt
open(OUT, 'w').write(head + '\n'.join(ev) + '\n'); print(OUT, len(ev), 'lines')
