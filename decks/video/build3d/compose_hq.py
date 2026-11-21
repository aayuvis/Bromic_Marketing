"""Composite the full-quality recess-kit film: locked-off CAD plates and per-frame CAD renders (render_hq.py) + particles, cavity tint,
labels, kinetic type, subtitles. Plates are only ever reduced (2240 x 1260 -> 1920 x 1080), never enlarged or blended between frames;
overlays are drawn at 2x and reduced (anti-aliased); frames are PNG.
Every 3D point (particles, label anchors, dimension lines) is projected with the same camera maths as the render (shots.py).
  python3 compose.py WORK h F0 F1      16:9 frames -> WORK/fh/NNNNN.jpg
  python3 compose.py WORK v F0 F1      9:16 Reels frames -> WORK/fv/NNNNN.jpg (beat 5 + the hero end)
  python3 compose.py WORK loop F0 F1   6 s silent loop frames -> WORK/fl/NNNNN.jpg"""
import sys, os, math, random, json, re
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import shots

WORK, MODE = sys.argv[1], sys.argv[2]; F0, F1 = int(sys.argv[3]), int(sys.argv[4])
T = shots.load_timeline(WORK); FPS = shots.FPS
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
INK, WHITE, FLAME = (35, 31, 32), (255, 255, 255), (239, 65, 35)
AIR, HEAT, RAD = (120, 170, 215), (255, 150, 50), (255, 90, 40)
LS = lambda s, b=False: ImageFont.truetype('/usr/share/fonts/truetype/liberation/LiberationSans-%s.ttf' % ('Bold' if b else 'Regular'), s)
DD = lambda s: ImageFont.truetype(os.path.join(WORK, 'didot.ttf'), s)
LOGO = Image.open(os.path.join(ROOT, 'images', 'portfolio', 'bromic-logo-white.png')).convert('RGBA')
B, TOP = 0.0127, 0.2032
def E(u): return shots.ease(u)
def clamp(u): return min(1.0, max(0.0, u))

# ------------------------------------------------------------------ base picture: CAD plates and frames, reduced only
R2 = os.path.join(WORK, 'r2'); _cache = {}
def img(name):
    if not name.endswith('.png'): name += '.png'
    if name not in _cache: _cache[name] = np.asarray(Image.open(os.path.join(R2, name)).convert('RGB')).astype(np.float32)
    return _cache[name]
def aux(name):
    k = name + '_aux'
    if k not in _cache:
        a = cv2.imread(os.path.join(R2, name + '_aux.png'), cv2.IMREAD_UNCHANGED).astype(np.float32) / 65535.0
        _cache[k] = {'x': a[..., 2] * 5 - 2.5, 'y': a[..., 1] * 6 - 2.5, 'cat': a[..., 0]}
    return _cache[k]
FANB = json.load(open(os.path.join(R2, 'fan_borders.json'))) if os.path.exists(os.path.join(R2, 'fan_borders.json')) else []
FANK = json.load(open(os.path.join(R2, 'fan_keys.json'))) if os.path.exists(os.path.join(R2, 'fan_keys.json')) else {}
WARM, COOL = np.array([255, 112, 52], np.float32), np.array([96, 168, 236], np.float32)

def cavity_tint(t):
    """(warmth field over world x) for the cavity: beat 4 builds heat; beat 5 starts warm and cools from the inlet end with the air."""
    b, u = shots.beat_at(T, t); bt = t - T['start'][b]
    if b == 3: w = E(clamp((u - 0.25) / 0.6)); return lambda x: np.zeros_like(x) + w, 1.0
    if b == 4:
        xf = -0.95 + 1.95 * E(clamp((bt - 1.0) / 5.0))              # the cooling front moves inlet -> outlet with the air
        return (lambda x: np.clip((x - xf) / 0.18 + 0.5, 0, 1)), 1.0
    return None, 0.0

def tint_plate(a, name, t):
    """Tint the cavity surfaces (joists, deck) from the aux map: warm where hot, cool blue where the air has cooled it."""
    f, k = cavity_tint(t)
    if f is None: return a
    m = aux(name); cav = (np.abs(m['cat'] - 1.0) < 0.05).astype(np.float32)
    cav = cv2.GaussianBlur(cav, (0, 0), 1.2)
    w = f(m['x'])[..., None]; b = shots.beat_at(T, t)[0]
    col = WARM * w + COOL * (1 - w)
    strength = (0.50 * w + 0.42 * (1 - w)) if b == 4 else 0.50 * w
    al = (cav[..., None] * strength)
    lum = a.mean(axis=2, keepdims=True) / 255
    return a * (1 - al) + (col * (0.55 + 0.6 * lum)) * al

def plate_frame(name, t, a=None):
    a = img(name) if a is None else a
    z = ZO[0] or shots.zoom2d(T, t); H, W = a.shape[:2]; w, h = W / z, H / z
    im = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
    return im.resize((1920, 1080), Image.LANCZOS, box=((W - w) / 2, (H - h) / 2, (W + w) / 2, (H + h) / 2))

def base(f):
    t = f / FPS; b, u = shots.beat_at(T, t)
    if b in (0, 5, 6): return plate_frame('P%d' % b, t)
    if b == 1:                                          # the section plane sweeps: show the cut plate where the uncut surface lies in front of it
        A, Bp = img('P1A'), img('P1B'); y = aux('P1A')['y']; yc = shots.ycut(T, t)
        m = cv2.GaussianBlur((y < yc).astype(np.float32), (0, 0), 0.8)[..., None]
        return plate_frame('P1A', t, A * (1 - m) + Bp * m)
    if b == 2:
        if u < shots.EX_IN or u >= shots.EX_OUT:        # explode / reassemble: native 1920 x 1080 CAD frames (reassembly = the same, reversed)
            return Image.open(os.path.join(R2, 'X%05d.png' % shots.explode_src_frame(T, f))).convert('RGB')
        return plate_frame('P2', t)
    if b == 3: return plate_frame('P3', t, tint_plate(img('P3'), 'P3', t))
    a = img('P4').copy()                                # beat 5: the real impellers, spinning, pasted over the plate
    key = FANK.get(str(f))
    for j, bd in enumerate(FANB):
        p = os.path.join(R2, 'F%d_%s.png' % (j, key))
        if not key or not os.path.exists(p): continue
        reg = img('F%d_%s.png' % (j, key)); H, W = a.shape[:2]
        x0 = int(round(bd[0] * W)); y0 = int(round((1 - bd[3]) * H)); rh, rw = reg.shape[:2]
        fm = np.ones((rh, rw), np.float32); e = 6
        for i in range(e): v = (i + 1) / (e + 1); fm[i, :] = np.minimum(fm[i, :], v); fm[-1 - i, :] = np.minimum(fm[-1 - i, :], v); fm[:, i] = np.minimum(fm[:, i], v); fm[:, -1 - i] = np.minimum(fm[:, -1 - i], v)
        sub = a[y0:y0 + rh, x0:x0 + rw]; fm = fm[:sub.shape[0], :sub.shape[1], None]
        a[y0:y0 + rh, x0:x0 + rw] = sub * (1 - fm) + reg[:sub.shape[0], :sub.shape[1]] * fm
    return plate_frame('P4', t, tint_plate(a, 'P4', t))

# ------------------------------------------------------------------ particles (world space, deterministic)
rng = random.Random(7)
AIRP = [(-0.71, -0.42), (-0.71, -0.02), (-0.63, 0.08), (-0.52, 0.145), (0.0, 0.15), (0.52, 0.145), (0.63, 0.08), (0.71, -0.02), (0.71, -0.42)]
def polyline(path):
    seg = []; L = 0
    for (x0, z0), (x1, z1) in zip(path, path[1:]):
        l = math.hypot(x1 - x0, z1 - z0); seg.append((x0, z0, x1, z1, L, l)); L += l
    return seg, L
SEG, PL = polyline(AIRP)
def along(s):
    for x0, z0, x1, z1, a, l in SEG:
        if s <= a + l: u = (s - a) / l; return x0 + (x1 - x0) * u, z0 + (z1 - z0) * u
    return AIRP[-1]
AIR_PARTS = [(rng.uniform(0, 30), rng.uniform(0.005, 0.09), rng.uniform(-0.012, 0.012), rng.uniform(0.85, 1.15)) for _ in range(260)]
CONV_PARTS = [(rng.uniform(0, 1), rng.uniform(-0.58, 0.58), rng.uniform(0.01, 0.09), rng.uniform(0.6, 1.4)) for _ in range(320)]
RAYS = [(rng.uniform(-0.6, 0.6), rng.uniform(-0.05, 0.05), rng.uniform(0, 1)) for _ in range(46)]

def particles_nokit(t, u):
    """Heat behind the heater: rises from the heater's back, then pools and spreads under the deck. Builds up over the beat."""
    out = []
    for birth, x0, y, sp in CONV_PARTS:
        bt = 0.08 + birth * 0.85                      # births spread over the beat, so the pool keeps growing
        if u < bt: out.append(None); continue
        a = (u - bt) * T['dur'][3] * sp               # seconds since birth
        rise = clamp(a / 1.4)
        z = 0.065 + (TOP - 0.085) * (1 - (1 - rise) ** 2)
        x = x0 + 0.03 * math.sin(a * 2.1 + x0 * 9) + (0.08 * (a - 1.4) * (1 if x0 > 0 else -1) if a > 1.4 else 0)
        x = max(-1.6, min(1.6, x))
        if a > 1.4: z = TOP - 0.02 - 0.012 * abs(math.sin(a * 1.7 + y * 40))
        out.append(((x, y, z), HEAT, 0.95 * clamp(a / 0.4), 3.2))
    return out

def particles_kit(t, u, spin_in=1.0):
    out = []
    tt = t
    for ph, y, dz, sp in AIR_PARTS:                   # room air: in at the terminal-box end, along behind the heater, out at the far end
        s = ((tt * 0.55 * sp + ph) % 3.6) * PL / 3.6
        x, z = along(s); z += dz
        warmth = clamp((x + 0.45) / 1.0) if -0.6 < x else 0.0
        c = tuple(int(AIR[i] + (HEAT[i] - AIR[i]) * 0.55 * warmth) for i in range(3))
        fade = clamp(s / 0.12) * clamp((PL - s) / 0.15)
        out.append(((x, y, z), c, 0.9 * fade * spin_in, 3.0))
    for birth, x0, y, sp in CONV_PARTS[:200]:         # convective heat off the heater's back, picked up by the air stream
        ph = (birth * 2.2 + tt * 0.5 * sp) % 2.2
        z = 0.065 + min(ph, 0.5) * 0.12
        x = x0 + max(0.0, ph - 0.35) * 0.55 * spin_in
        if x > 0.6: out.append(None); continue
        out.append(((x, y, z), HEAT, 0.8 * clamp(1 - ph / 2.2) * spin_in, 2.6))
    return out

def rays(t, strength):
    out = []
    for x, y, ph in RAYS:
        s = (t * 0.6 + ph) % 1.0
        z0 = -0.04 - s * 0.9; z1 = z0 - 0.18
        out.append(((x, y, z0), (x, y, z1), strength * (1 - s)))
    return out

def trail_dots(now, prev, t, crop=None, scale=1.0):
    dots, lines = [], []
    for a_, b_ in zip(now, prev):
        if a_ is None: continue
        p, c, a, r = a_; q = proj(t, p, crop=crop)
        if not q or a <= 0.01: continue
        dots.append(((q[0], q[1]), c, a, r * 1.9 * scale))
        if b_ is not None:
            q0 = proj(t, b_[0], crop=crop)
            if q0 and math.hypot(q[0] - q0[0], q[1] - q0[1]) < 140 * scale:
                lines.append(((q0[0], q0[1]), (q[0], q[1]), c, a * 0.55, max(2, int(r * 2.2 * scale))))
    return dots, lines

def ray_lines(t, strength, crop=None, scale=1.0):
    out = []
    for p0, p1, a in rays(t, strength):
        q0, q1 = proj(t, p0, crop=crop), proj(t, p1, crop=crop)
        if q0 and q1: out.append(((q0[0], q0[1]), (q1[0], q1[1]), RAD, a * 0.8, int(10 * scale)))
    return out

# ------------------------------------------------------------------ drawing helpers
ZO = [None]
def proj(t, p, W=1920, H=1080, crop=None):
    q = shots.project(T, t, p, W, H)
    if q is None: return None
    z = ZO[0] or shots.zoom2d(T, t)
    if z != 1.0: q = (W / 2 + (q[0] - W / 2) * z, H / 2 + (q[1] - H / 2) * z, q[2])
    if crop:                                          # (x0, y0, scale) maps 1920x1080 coordinates into the Reels panel
        return ((q[0] - crop[0]) * crop[2], (q[1] - crop[1]) * crop[2], q[2])
    return q

SS = 2
class D2:
    """ImageDraw on a canvas SS x larger: every coordinate, width and font scaled; reduce afterwards for anti-aliased lines and dots."""
    def __init__(self, im): self.d = ImageDraw.Draw(im)
    @staticmethod
    def _p(xy):
        if isinstance(xy, (list, tuple)) and xy and isinstance(xy[0], (list, tuple)): return [(x * SS, y * SS) for x, y in xy]
        return [v * SS for v in xy]
    def line(self, xy, fill=None, width=1, **k): self.d.line(self._p(xy), fill=fill, width=max(1, int(round(width * SS))), **k)
    def ellipse(self, xy, fill=None, outline=None, width=1): self.d.ellipse(self._p(xy), fill=fill, outline=outline, width=max(1, int(round(width * SS))))
    def rectangle(self, xy, fill=None, outline=None, width=1): self.d.rectangle(self._p(xy), fill=fill, outline=outline, width=max(1, int(round(width * SS))))
    def rounded_rectangle(self, xy, r, fill=None, outline=None, width=1): self.d.rounded_rectangle(self._p(xy), r * SS, fill=fill, outline=outline, width=max(1, int(round(width * SS))))
    def polygon(self, xy, fill=None): self.d.polygon(self._p(xy), fill=fill)
    def text(self, xy, s, font=None, fill=None, anchor=None): self.d.text((xy[0] * SS, xy[1] * SS), s, font=font.font_variant(size=font.size * SS), fill=fill, anchor=anchor)
    def textlength(self, s, font=None): return self.d.textlength(s, font=font.font_variant(size=font.size * SS)) / SS
def reduce(L, size):
    """Premultiplied reduce of an SS x RGBA layer."""
    return L.convert('RGBa').resize(size, Image.LANCZOS).convert('RGBA')
def new_layer(size): L = Image.new('RGBA', (size[0] * SS, size[1] * SS), (0, 0, 0, 0)); return L, D2(L)

def glow_layer(size, dots, lines, blur=6):
    L, d = new_layer(size)
    for (x, y), c, a, r in dots:
        d.ellipse((x - r, y - r, x + r, y + r), fill=(*c, int(255 * a)))
    for (x0, y0), (x1, y1), c, a, w in lines:
        d.line((x0, y0, x1, y1), fill=(*c, int(255 * a)), width=w)
    L = reduce(L, size)
    halo = L.filter(ImageFilter.GaussianBlur(blur))
    return halo, L

def add_light(im, layer, gain=1.0):
    a = np.asarray(im).astype(np.float32); l = np.asarray(layer).astype(np.float32)
    alpha = l[..., 3:4] / 255 * gain
    a = a + l[..., :3] * alpha * 0.9
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))

def over(im, layer):
    im = im.convert('RGBA'); im.alpha_composite(layer); return im.convert('RGB')

def fan_overlay(t, spin, crop=None, size=(1920, 1080)):
    """Spinning blades drawn in each fan's plane (fans are tilted; blades shown as a soft rotating star)."""
    L = Image.new('RGBA', size, (0, 0, 0, 0)); d = ImageDraw.Draw(L)
    for cx, n in ((-0.5885, (0.7071, 0, 0.7071)), (0.5885, (-0.7071, 0, 0.7071))):
        u1 = (0, 1, 0); u2 = (n[1] * u1[2] - n[2] * u1[1], n[2] * u1[0] - n[0] * u1[2], n[0] * u1[1] - n[1] * u1[0])
        c = (cx, 0.0, 0.12); R = 0.062
        for k in range(7):
            a0 = spin + k * 2 * math.pi / 7
            pts = []
            for s in np.linspace(0, 0.55, 8):
                rr = R * (0.25 + 0.75 * s / 0.55); ang = a0 + s * 1.3
                p = tuple(c[i] + rr * (math.cos(ang) * u1[i] + math.sin(ang) * u2[i]) for i in range(3))
                q = proj(t, p, crop=crop)
                if q: pts.append((q[0], q[1]))
            if len(pts) > 1: d.line(pts, fill=(240, 245, 250, 210), width=6)
    return L.filter(ImageFilter.GaussianBlur(1.6))

def text(d, xy, s, font, fill, anchor='la', alpha=1.0, spacing=0):
    if alpha <= 0: return
    c = (*fill[:3], int(255 * clamp(alpha)))
    if spacing:
        x, y = xy
        for ch in s: d.text((x, y), ch, font=font, fill=c, anchor=anchor); x += d.textlength(ch, font=font) + spacing
    else: d.text(xy, s, font=font, fill=c, anchor=anchor)

def callout(d, t, anchor3, label, side, a, crop=None, dark=False, fs=26):
    """Dot on the part, a leader line that draws itself, and the label."""
    q = proj(t, anchor3, crop=crop)
    if q is None or a <= 0: return
    x, y = q[0], q[1]; dx, dy = side
    gl = clamp(a * 1.6); tx, ty = x + dx * gl, y + dy * gl
    col = WHITE if dark else INK
    d.ellipse((x - 6, y - 6, x + 6, y + 6), fill=(*FLAME, int(255 * clamp(a * 3))))
    d.ellipse((x - 11, y - 11, x + 11, y + 11), outline=(*FLAME, int(140 * clamp(a * 3))), width=2)
    d.line((x, y, tx, ty), fill=(*col, int(230 * clamp(a * 2))), width=2)
    if gl >= 0.98:
        f = LS(fs, True); w = d.textlength(label, font=f); ax = tx + 10 if dx >= 0 else tx - 10 - w
        pad = 8; d.rounded_rectangle((ax - pad, ty - fs * 0.75, ax + w + pad, ty + fs * 0.75), 6, fill=(*((20, 20, 22) if dark else (255, 255, 255)), int(200 * clamp((a - 0.6) * 4))))
        text(d, (ax, ty), label, f, col, 'lm', clamp((a - 0.6) * 4))

def kicker(d, s, a, x=72, y=60, col=FLAME): text(d, (x, y), s.upper(), LS(20, True), col, alpha=a, spacing=3)

def title(d, s, t0, t, x=72, y=92, size=58, col=INK, dur=0.7):
    a = clamp((t - t0) / dur); yy = y + 24 * (1 - E(a))
    text(d, (x, yy), s, DD(size), col, alpha=a)

def legend(d, a, x, y, dark=False):
    if a <= 0: return
    col = WHITE if dark else INK
    d.rounded_rectangle((x - 16, y - 18, x + 330, y + 120), 10, fill=((20, 20, 22, int(170 * a)) if dark else (255, 255, 255, int(205 * a))))
    for i, (c, s) in enumerate(((AIR, 'Air flow'), (HEAT, 'Convective heat'), (RAD, 'Radiant heat'))):
        yy = y + 8 + i * 30; d.ellipse((x, yy - 7, x + 14, yy + 7), fill=(*c, int(255 * a))); text(d, (x + 26, yy), s, LS(21), col, 'lm', a)
    text(d, (x, y + 102), 'Illustration – not a thermal test', LS(16), (130, 130, 130), 'lm', a)

# ------------------------------------------------------------------ subtitles from the voice-over script
VO = re.findall(r'\[\d · [^\]]*\]\n(.+?)(?:\n\n|\Z)', open(os.path.join(os.path.dirname(__file__), 'voiceover.txt')).read(), re.S)
VO = [' '.join(v.split()) for v in VO]
def chunks(s, n=11):
    """Subtitle lines: break at sentence ends first, then at commas, never more than n words."""
    w = s.split(); out = []; cur = []
    for i, x in enumerate(w):
        cur.append(x)
        end = x.endswith(('.', '?', ':')); comma = x.endswith(',')
        soon = any(y.endswith(('.', '?', ':')) for y in w[i + 1:i + 3])       # a sentence ends within 2 words: don't strand them
        if end or (len(cur) >= n and not soon) or (comma and len(cur) >= 4): out.append(' '.join(cur)); cur = []
    if cur:
        if out and len(cur) <= 2: out[-1] += ' ' + ' '.join(cur)
        else: out.append(' '.join(cur))
    return out
def subtitle_at(t, beats_start, scale=1.0):
    for i, s in enumerate(VO):
        t0 = beats_start[i] + shots.LEAD[i]; L = T['vo'][i]
        if t0 <= t < t0 + L:
            cs = chunks(s); wts = [len(c) + 6 for c in cs]; tot = sum(wts); acc = t0
            for c, w in zip(cs, wts):
                dt = L * w / tot
                if t < acc + dt: return c
                acc += dt
    return None
def draw_sub(d, s, W, y, size=30):
    if not s: return
    f = LS(size); w = d.textlength(s, font=f)
    d.rounded_rectangle((W / 2 - w / 2 - 18, y - size * 0.8, W / 2 + w / 2 + 18, y + size * 0.8), 10, fill=(18, 18, 20, 170))
    text(d, (W / 2, y), s, f, WHITE, 'mm')

def grade(im, night=False):
    a = np.asarray(im).astype(np.float32) / 255
    H, W = a.shape[:2]; yy, xx = np.mgrid[0:H, 0:W]
    r = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2)
    a *= (1 - (0.22 if night else 0.10) * np.clip(r - 0.45, 0, 1) ** 1.5)[..., None]
    g = np.random.default_rng(int(1e6 * random.random())).normal(0, 0.006, (H, W, 1)); a += g
    return Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))

def cavity_air(t, size=(1920, 1080), crop=None, alpha=0.20):
    """A soft volumetric tint on the cavity air (section plane), coloured by the same warmth field as the surfaces."""
    f, k = cavity_tint(t)
    if f is None: return None
    b = shots.beat_at(T, t)[0]; yp = 0.03 if b == 3 else -0.07
    L, d = new_layer(size); xs = np.linspace(-1.55, 1.55, 48)
    for x0, x1 in zip(xs, xs[1:]):
        w = float(f(np.array([(x0 + x1) / 2]))[0]); col = WARM * w + COOL * (1 - w)
        a = alpha * (w if b == 3 else 1.0)
        q = [proj(t, p, crop=crop) for p in ((x0, yp, B + 0.004), (x1, yp, B + 0.004), (x1, yp, TOP - 0.004), (x0, yp, TOP - 0.004))]
        if all(q) and a > 0.005: d.polygon([(p[0], p[1]) for p in q], fill=(*[int(v) for v in col], int(255 * a)))
    return reduce(L, size).filter(ImageFilter.GaussianBlur(5))

def colour_key(d, a, x, y, dark=False):
    if a <= 0: return
    for i in range(60):
        u = i / 59; col = WARM * (1 - u) + COOL * u
        d.rectangle((x + i * 3.4, y, x + (i + 1) * 3.4 + 0.5, y + 12), fill=(*[int(v) for v in col], int(255 * a)))
    text(d, (x, y + 30), 'warm  ↔  cool – illustration', LS(19), WHITE if dark else INK, 'lm', a)

# ------------------------------------------------------------------ one 16:9 frame
def frame_h(f):
    t = f / FPS; b, u = shots.beat_at(T, t); bt = t - T['start'][b]; D = T['dur'][b]
    im = base(f)
    ca = cavity_air(t)
    if ca is not None: im = over(im, ca)
    dots, lines = [], []
    # particles and rays
    rl = []
    if b == 3:
        dots, lines = trail_dots(particles_nokit(t, u), particles_nokit(t - 0.12, u - 0.12 / D), t)
        rl = ray_lines(t, 0.6)
    if b == 4:
        spin_in = clamp(bt / 1.6)
        dots, lines = trail_dots(particles_kit(t, u, spin_in), particles_kit(t - 0.12, u, clamp((bt - 0.12) / 1.6)), t)
        rl = ray_lines(t, 0.65)
    if rl:
        rh, _ = glow_layer((1920, 1080), [], rl, 10); im = add_light(im, rh, 2.6)
    if dots or lines:
        halo, core = glow_layer((1920, 1080), dots, lines, 9)
        im = add_light(im, halo, 2.2); im = over(im, core)
    L, d = new_layer((1920, 1080))
    night = b in (0, 6)
    if b == 0:                                        # cold open: three words land one by one
        for i, w in enumerate(('6 kW.', '7.5 In.', 'Flush.')):
            t0 = 0.5 + i * 1.15; a = clamp((bt - t0) / 0.5)
            text(d, (1180 + 40 * (1 - E(a)), 690 + i * 104), w, DD(92), WHITE, 'ls', a * clamp((D - bt) / 0.6))
        kicker(d, 'Tungsten Smart-Heat Electric Series II', clamp((bt - 0.2) / 0.6) * clamp((D - bt) / 0.6), 1184, 560, (255, 190, 160))
    if b == 1:
        kicker(d, 'The low-clearance recess kit', clamp(bt / 0.6))
        title(d, 'Flush In A 7.5 In Cavity', 0.3, bt)
        cu = clamp((u - 0.08) / 0.5)
        if 0.02 < cu < 0.999:                         # the section plane sweeping toward the heater
            y = -2.3 + 2.3 * E(cu); pts = [proj(t, (x, y, B + 0.001)) for x in np.linspace(-2.2, 2.2, 12)]
            pts = [(q[0], q[1]) for q in pts if q]
            if len(pts) > 1: d.line(pts, fill=(*FLAME, 220), width=3)
        a = clamp((u - 0.66) / 0.2)
        if a > 0:                                     # self-drawing 7.5 in dimension
            p0, p1 = proj(t, (0.86, 0.0, B)), proj(t, (0.86, 0.0, B + (TOP - B) * E(a)))
            if p0 and p1:
                d.line((p0[0], p0[1], p1[0], p1[1]), fill=(*FLAME, 255), width=3)
                for q in (p0, p1): d.line((q[0] - 14, q[1], q[0] + 14, q[1]), fill=(*FLAME, 255), width=3)
                text(d, (p1[0] + 22, (p0[1] + p1[1]) / 2), '7.5 in cavity', LS(28, True), INK, 'lm', clamp((a - 0.5) * 2))
    if b == 2:
        kicker(d, 'Inside the kit', clamp(bt / 0.6)); title(d, 'One Supplied Recess Box', 0.3, bt)
        e = shots.explode(T, t); X = shots.EXPLODE
        items = [((0.0, -0.12, 0.094), 'chassis', 'Recess box (supplied)', (-260, -70)),
                 ((0.5885, 0.0, 0.12), 'fan', 'Dual cooling fans', (150, -60)),
                 ((-0.5885, 0.0, 0.12), 'fan', '', (0, 0)),
                 ((0.25, 0.0, 0.053), 'barrier', 'Radiant barrier', (260, -30)),
                 ((0.70, -0.13, 0.02), 'trim', 'Trim', (170, 20)),
                 ((0.30, -0.075, -0.035), 'heater', 'Tungsten Series II, 6 kW', (210, 60)),
                 ((-0.836, -0.11, 0.094), 'term', 'Terminal box', (-170, -60)),
                 ((-0.779, -0.017, 0.073), 'cutout', 'Over-temperature cut-out', (70, 120))]
        for k, (p, c, lab, side) in enumerate(items):
            o = X[c]; pp = shots.heater_point(p, e) if c == 'heater' else (p[0] + o[0] * e, p[1] + o[1] * e, p[2] + o[2] * e)
            a = clamp((u - shots.EX_IN - 0.02 - 0.035 * k) / 0.06) * clamp((shots.EX_OUT - 0.01 - u) / 0.03)
            if lab: callout(d, t, pp, lab, side, a)
            elif a > 0:
                q = proj(t, pp)
                if q: d.ellipse((q[0] - 6, q[1] - 6, q[0] + 6, q[1] + 6), fill=(*FLAME, int(255 * clamp(a * 3))))
    if b == 3:
        kicker(d, 'Illustration · without a ventilated kit', clamp(bt / 0.6)); title(d, 'Heat Behind The Heater Has Nowhere To Go', 0.3, bt, size=52)
        a = clamp((u - 0.55) / 0.08)
        if a > 0:
            x, y = 1460, 150; s = 1 + 0.25 * (1 - E(a))
            d.rounded_rectangle((x - 20 * s, y - 34, x + 420, y + 42), 12, fill=(255, 255, 255, int(235 * a)))
            r = 22 * s; d.ellipse((x - r + 18, y - r, x + r + 18, y + r), outline=(*FLAME, int(255 * a)), width=5)
            d.line((x + 18 - r * 0.7, y + r * 0.7, x + 18 + r * 0.7, y - r * 0.7), fill=(*FLAME, int(255 * a)), width=5)
            text(d, (x + 56, y - 10), 'Not how to install', LS(28, True), FLAME, 'lm', a)
            text(d, (x + 56, y + 20), 'Always use the kit for your model', LS(20), INK, 'lm', a)
        legend(d, clamp((bt - 1.0) / 0.6), 1500, 930); colour_key(d, clamp((bt - 1.6) / 0.6), 1500, 862)
    if b == 4:
        kicker(d, 'With the low-clearance recess kit', clamp(bt / 0.6)); title(d, 'Dual Fan-Ventilated. The Cavity Stays Cool.', 0.3, bt, size=52)
        callout(d, t, (-0.5885, -0.02, 0.12), 'Dual cooling fans', (-60, -150), clamp((u - 0.10) / 0.12) * clamp((0.42 - u) / 0.05))
        callout(d, t, (0.0, -0.02, 0.053), 'Radiant barrier', (40, 150), clamp((u - 0.40) / 0.12) * clamp((0.70 - u) / 0.05))
        callout(d, t, (0.45, -0.02, -0.05), 'Radiant heat, down to the seats', (80, 170), clamp((u - 0.68) / 0.12) * clamp((0.99 - u) / 0.03))
        a = clamp((u - 0.18) / 0.10) * clamp((0.40 - u) / 0.05)
        if a > 0: text(d, (960, 200), 'The cavity cools as the air flows', LS(30, True), (40, 100, 170), 'mm', a)
        legend(d, clamp((bt - 1.0) / 0.6), 1500, 930); colour_key(d, clamp((bt - 1.6) / 0.6), 1500, 862)
    if b == 5:
        kicker(d, 'Built-in protection', clamp(bt / 0.6)); title(d, 'Over-Temperature Cut-Out', 0.3, bt)
        text(d, (72, 168), 'In the terminal box · manual reset', LS(26), INK, alpha=clamp((bt - 0.8) / 0.6))
        callout(d, t, (-0.779, -0.017, 0.073), 'Over-temperature cut-out (manual reset)', (220, -200), clamp((u - 0.20) / 0.15))
    if b == 6:
        a = clamp((bt - 0.8) / 0.8); y = 640 + 30 * (1 - E(a))
        kicker(d, 'Tungsten Smart-Heat Electric Series II', a, 110, y - 56, (255, 190, 160))
        text(d, (110, y), 'Worry-Free, Dual Fan-Ventilated', DD(76), WHITE, alpha=a)
        text(d, (110, y + 92), '6 kW Recessing', DD(76), WHITE, alpha=clamp((bt - 1.3) / 0.8))
        a2 = clamp((bt - 2.6) / 0.6)
        if a2 > 0:
            f = LS(24, True); s = 'SEE THE PRO PLANNING GUIDE  ·  BROMIC.COM'; w = d.textlength(s, font=f)
            d.rectangle((110, y + 196, 110 + w + 56, y + 252), outline=(255, 255, 255, int(255 * a2)), width=2)
            text(d, (138, y + 224), s, f, WHITE, 'lm', a2)
        a3 = clamp((bt - 3.4) / 0.8)
        if a3 > 0:
            lg = LOGO.copy(); lg.thumbnail((300 * SS, 120 * SS), Image.LANCZOS); al = lg.split()[3].point(lambda v: int(v * a3)); lg.putalpha(al); L.alpha_composite(lg, (110 * SS, 90 * SS))
    draw_sub(d, subtitle_at(t, T['start']), 1920, 1018)
    im = over(im, reduce(L, (1920, 1080)))
    return grade(im, night)

# ------------------------------------------------------------------ Reels (9:16): beat 5 then the hero end, big type
def reels_timeline():
    b5, b7 = 4, 6
    return [(T['start'][b5], T['dur'][b5]), (T['start'][b7], T['dur'][b7])]
def frame_v(f):
    segs = reels_timeline(); t = f / FPS; acc = 0
    for s0, dd in segs:
        if t < acc + dd: src_t = s0 + (t - acc); break
        acc += dd
    else: src_t = segs[-1][0] + segs[-1][1] - 1 / FPS
    sf = int(round(src_t * FPS)); b, u = shots.beat_at(T, src_t); bt = src_t - T['start'][b]
    full = base(sf)
    crop = (420, 0, 1080 / 1080)                      # a 1080 x 1080 square from the middle of the 16:9 frame
    panel = full.crop((420, 0, 1500, 1080))
    dots, lines = [], []
    if b == 4:
        spin_in = clamp(bt / 1.6)
        dots, lines = trail_dots(particles_kit(src_t, u, spin_in), particles_kit(src_t - 0.12, u, clamp((bt - 0.12) / 1.6)), src_t, crop, 1.15)
        rh, _ = glow_layer((1080, 1080), [], ray_lines(src_t, 0.65, crop, 1.15), 10); panel = add_light(panel, rh, 1.6)
        halo, core = glow_layer((1080, 1080), dots, lines, 9); panel = add_light(panel, halo, 2.2); panel = over(panel, core)
        ca = cavity_air(src_t, (1080, 1080), crop)
        if ca is not None: panel = over(panel, ca)
    night = b == 6
    canvas = Image.new('RGB', (1080, 1920), (16, 15, 16) if night else (244, 243, 241))
    canvas.paste(panel, (0, 420))
    L, d = new_layer((1080, 1920))
    col = WHITE if night else INK
    if b == 4:
        kicker(d, 'Tungsten Series II · recess kit', clamp(bt / 0.5), 64, 120)
        a = clamp((bt - 0.2) / 0.6)
        text(d, (64, 210 + 20 * (1 - E(a))), 'Dual Fan-Ventilated', DD(78), col, alpha=a)
        text(d, (64, 300 + 20 * (1 - E(a))), '6 kW, Flush', DD(78), col, alpha=clamp((bt - 0.5) / 0.6))
        for k, (s, t0) in enumerate((('Air in, along behind the heater, out', 1.5), ('The cavity stays cool', 5.0), ('Radiant heat goes down to the seats', 8.5))):
            a = clamp((bt - t0) / 0.5) * clamp((t0 + 3.4 - bt) / 0.4)
            text(d, (540, 1640), s, LS(46, True), col, 'mm', a)
        text(d, (540, 1730), 'Illustration – not a thermal test', LS(26), (130, 130, 130), 'mm', clamp((bt - 1.0) / 0.5))
        colour_key(d, clamp((bt - 1.6) / 0.6), 438, 1780)
    else:
        a = clamp((bt - 0.5) / 0.8)
        text(d, (64, 190 + 20 * (1 - E(a))), 'Worry-Free,', DD(84), WHITE, alpha=a)
        text(d, (64, 290 + 20 * (1 - E(a))), 'Dual Fan-Ventilated', DD(84), WHITE, alpha=clamp((bt - 0.9) / 0.8))
        a2 = clamp((bt - 2.0) / 0.6)
        text(d, (540, 1640), '6 kW Recessing', DD(72), WHITE, 'mm', a2)
        f = LS(30, True); s = 'BROMIC.COM'; w = d.textlength(s, font=f)
        if a2 > 0: d.rectangle((540 - w / 2 - 30, 1720, 540 + w / 2 + 30, 1790), outline=(255, 255, 255, int(255 * a2)), width=2); text(d, (540, 1755), s, f, WHITE, 'mm', a2)
        a3 = clamp((bt - 2.8) / 0.8)
        if a3 > 0:
            lg = LOGO.copy(); lg.thumbnail((300 * SS, 120 * SS), Image.LANCZOS); al = lg.split()[3].point(lambda v: int(v * a3)); lg.putalpha(al); L.alpha_composite(lg, (64 * SS, (1500 - 120) * SS))
    canvas = over(canvas, reduce(L, (1080, 1920)))
    return grade(canvas, night)

# ------------------------------------------------------------------ 6 s seamless loop: one frame of beat 5, particles and fans cycling
def frame_loop(f):
    """6 s seamless loop: 180 steady frames from late in beat 5 (fans at steady speed repeat every 3 frames; particles crossfade)."""
    P = 6.0; n4 = int(round(T['dur'][4] * FPS)); s4 = int(round(T['start'][4] * FPS))
    src = s4 + n4 - 180 + f; src_t = src / FPS; ZO[0] = 1.04
    im = base(src)
    ca = cavity_air(src_t)
    if ca is not None: im = over(im, ca)
    def layer(tt):
        dots, lines = trail_dots(particles_kit(tt, 0.5, 1.0), particles_kit(tt - 0.12, 0.5, 1.0), src_t)
        rays_ = []
        for p0, p1, a in rays(tt, 0.65):
            q0, q1 = proj(src_t, p0), proj(src_t, p1)
            if q0 and q1: rays_.append(((q0[0], q0[1]), (q1[0], q1[1]), RAD, a * 0.8, 10))
        h, core = glow_layer((1920, 1080), dots, lines, 9)
        rh, _ = glow_layer((1920, 1080), [], rays_, 10)
        return Image.alpha_composite(h, rh), core
    t = f / FPS; w = clamp((t - (P - 1.0)) / 1.0)
    h1, c1 = layer(t)
    if w > 0:
        h0, c0 = layer(t - P); h1 = Image.blend(h1, h0, w); c1 = Image.blend(c1, c0, w)
    im = add_light(im, h1, 2.2); im = over(im, c1)
    return grade(im)

out = os.environ.get('OUTDIR') or {'h': 'qh', 'v': 'qv', 'loop': 'ql'}[MODE]; os.makedirs(os.path.join(WORK, out), exist_ok=True)
fn = {'h': frame_h, 'v': frame_v, 'loop': frame_loop}[MODE]
for f in range(F0, F1):
    p = os.path.join(WORK, out, '%05d.png' % f)
    if not os.path.exists(p): fn(f).save(p, compress_level=1)
