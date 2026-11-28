"""Composite the full-quality recess-kit film (v4, owner's review 28 Nov 2026): locked-off CAD plates and per-state CAD renders
(render_hq.py) + particles, cavity tint, labels, kinetic type, the Bromic logo bug. Plates are only ever reduced (2240 x 1260 ->
1920 x 1080), never enlarged; overlays are drawn at 2x and reduced (anti-aliased). Subtitles are NOT drawn here: they differ per voice
version (US, AU) and are burned in at encode time from subs.py's ASS file, so both versions share one picture.
Every 3D point (particles, label anchors, dimension lines) is projected with the same camera maths as the render (shots.py).
  python3 compose_hq.py WORK h F0 F1      16:9 frames
  python3 compose_hq.py WORK v F0 F1      9:16 Reels frames (beat KIT + the hero end)
  python3 compose_hq.py WORK loop F0 F1   6 s silent loop frames
Frames go to WORK/<qh|qv|ql>/NNNNN.png, or as raw RGB24 to stdout with PIPE=1 (make_hq.sh pipes them straight into the encoder)."""
import sys, os, math, random, json, re
import numpy as np, cv2
cv2.setNumThreads(1)
from PIL import Image, ImageDraw, ImageFont, ImageFilter
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import shots
from shots import OPEN, CEIL, EXPL, APP, NOKIT, KIT, PROT, END

WORK, MODE = sys.argv[1], sys.argv[2]; F0, F1 = int(sys.argv[3]), int(sys.argv[4])
T = shots.load_timeline(WORK); FPS = shots.FPS
VOMAX = [max(a, b) for a, b in zip(*T['vo'].values())] if isinstance(T['vo'], dict) else T['vo']
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
INK, WHITE, FLAME = (35, 31, 32), (255, 255, 255), (239, 65, 35)
AIR, HEAT, RAD = (120, 170, 215), (255, 150, 50), (255, 90, 40)
LS = lambda s, b=False: ImageFont.truetype('/usr/share/fonts/truetype/liberation/LiberationSans-%s.ttf' % ('Bold' if b else 'Regular'), s)
DD = lambda s: ImageFont.truetype(os.path.join(WORK, 'didot.ttf'), s)
LOGO = Image.open(os.path.join(ROOT, 'images', 'portfolio', 'bromic-logo-white.png')).convert('RGBA')
LOGO_DARK = Image.open(os.path.join(ROOT, 'images', 'portfolio', 'bromic-logo.png')).convert('RGBA')
APP_IMG = Image.open(os.path.join(ROOT, 'images', 'library', 'w-bromic-heating-app-blog-image.webp')).convert('RGB')
APP_IMG = APP_IMG.crop((0, 0, 600, 578))                # Bromic's own app image; the green band along its foot is cropped off
B, TOP = 0.0127, 0.2032
STUDIO_WHITE = (255, 255, 255)
def E(u): return shots.ease(u)
def clamp(u): return min(1.0, max(0.0, u))
def vo_t(b, frac):
    """Beat-local time at a fraction of the beat's (longest) voice line: keeps type in step with the words in both versions."""
    return shots.LEAD[b] + VOMAX[b] * frac

# ------------------------------------------------------------------ base picture: CAD plates and frames, reduced only
R2 = os.path.join(WORK, 'r2'); _cache = {}
def img(name, rgba=False):
    if not name.endswith('.png'): name += '.png'
    k = name + ('#a' if rgba else '')
    if k not in _cache:
        im = Image.open(os.path.join(R2, name))
        _cache[k] = np.asarray(im.convert('RGBA' if rgba else 'RGB')).astype(np.float32)
    return _cache[k]
def aux(name):
    k = name + '_aux'
    if k not in _cache:
        a = cv2.imread(os.path.join(R2, name + '_aux.png'), cv2.IMREAD_UNCHANGED).astype(np.float32) / 65535.0
        _cache[k] = {'x': a[..., 2] * 5 - 2.5, 'y': a[..., 1] * 6 - 2.5, 'cat': a[..., 0]}
    return _cache[k]
FANB = json.load(open(os.path.join(R2, 'fan_borders.json'))) if os.path.exists(os.path.join(R2, 'fan_borders.json')) else []
WARM, COOL = np.array([255, 112, 52], np.float32), np.array([96, 168, 236], np.float32)

def cavity_tint(t):
    """(warmth field over world x) for the cavity: NOKIT builds heat; KIT starts warm and cools from the inlet end with the air."""
    b, u = shots.beat_at(T, t); bt = t - T['start'][b]
    if b == NOKIT: w = E(clamp((u - 0.25) / 0.6)); return lambda x: np.zeros_like(x) + w, 1.0
    if b == KIT:
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
    strength = (0.50 * w + 0.42 * (1 - w)) if b == KIT else 0.50 * w
    al = (cav[..., None] * strength)
    lum = a.mean(axis=2, keepdims=True) / 255
    return a * (1 - al) + (col * (0.55 + 0.6 * lum)) * al

ZO = [None]
def plate_frame(name, t, a=None):
    a = img(name) if a is None else a
    z = ZO[0] or shots.zoom2d(T, t); H, W = a.shape[:2]; w, h = W / z, H / z
    im = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8))
    return im.resize((1920, 1080), Image.LANCZOS, box=((W - w) / 2, (H - h) / 2, (W + w) / 2, (H + h) / 2))

def on_white(rgba):
    """Studio white (#FFF) behind the transparent exploded-view render, with a soft contact shadow so grey metal reads on white."""
    al = rgba[..., 3:4] / 255.0; H, W = al.shape[:2]
    sh = cv2.GaussianBlur(al[..., 0], (0, 0), W / 220.0); sh = np.roll(sh, int(H * 0.018), axis=0)[..., None]
    bg = np.ones_like(rgba[..., :3]) * np.array(STUDIO_WHITE, np.float32)
    bg = bg * (1 - 0.22 * sh)
    return rgba[..., :3] * al + bg * (1 - al)

def heater_on(t):
    """0 -> 1: the heater switches on as the first line lands (OPEN); always on elsewhere."""
    b, u = shots.beat_at(T, t); bt = t - T['start'][b]
    if b != OPEN: return 1.0
    return E(clamp((bt - (shots.LEAD[OPEN] + 0.25)) / 1.6))

def lin(a): return (a / 255.0) ** 2.2
def srgb(a): return np.clip(a, 0, 1) ** (1 / 2.2) * 255.0

def base(f):
    t = f / FPS; b, u = shots.beat_at(T, t)
    if b == OPEN:                                       # OFF plate -> ON plate, blended in (approximately) linear light: the glow fades up
        k = heater_on(t)
        if k <= 0: return plate_frame('P0OFF', t)
        if k >= 1: return plate_frame('P0ON', t)
        return plate_frame('P0OFF', t, srgb(lin(img('P0OFF')) * (1 - k) + lin(img('P0ON')) * k))
    if b == END: return plate_frame('P7', t)
    if b == PROT: return plate_frame('P6', t)
    if b == CEIL:                                       # the section plane sweeps: the cut plate where the uncut surface lies in front of it
        A, Bp = img('P1A'), img('P1B'); y = aux('P1A')['y']; yc = shots.ycut(T, t)
        m = cv2.GaussianBlur((y < yc).astype(np.float32), (0, 0), 0.8)[..., None]
        return plate_frame('P1A', t, A * (1 - m) + Bp * m)
    if b == EXPL:
        k = shots.explode_index(T, t)
        if k is not None:                               # explode / reassemble: native 1920 x 1080 CAD frames on studio white
            return Image.fromarray(np.clip(on_white(img('X%03d' % k, True)), 0, 255).astype(np.uint8))
        return plate_frame('P2', t, on_white(img('P2', True)))
    if b == APP: return Image.new('RGB', (1920, 1080), (247, 246, 244))
    if b == NOKIT: return plate_frame('P4N', t, tint_plate(img('P4N'), 'P4N', t))
    a = img('P5K').copy()                               # KIT: the real impellers, spinning, pasted over the plate
    j = f - int(round(T['start'][KIT] * FPS)); key = shots.fan_key(max(0, j))
    for q, bd in enumerate(FANB):
        p = os.path.join(R2, 'F%d_%s.png' % (q, key))
        if not os.path.exists(p): continue
        reg = img('F%d_%s.png' % (q, key)); H, W = a.shape[:2]
        x0 = int(round(bd[0] * W)); y0 = int(round((1 - bd[3]) * H)); rh, rw = reg.shape[:2]
        fm = np.ones((rh, rw), np.float32); e = 6
        for i in range(e): v = (i + 1) / (e + 1); fm[i, :] = np.minimum(fm[i, :], v); fm[-1 - i, :] = np.minimum(fm[-1 - i, :], v); fm[:, i] = np.minimum(fm[:, i], v); fm[:, -1 - i] = np.minimum(fm[:, -1 - i], v)
        sub = a[y0:y0 + rh, x0:x0 + rw]; fm = fm[:sub.shape[0], :sub.shape[1], None]
        a[y0:y0 + rh, x0:x0 + rw] = sub * (1 - fm) + reg[:sub.shape[0], :sub.shape[1]] * fm
    return plate_frame('P5K', t, tint_plate(a, 'P5K', t))

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
        a = (u - bt) * T['dur'][shots.NOKIT] * sp               # seconds since birth
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
    d.rounded_rectangle((x - 16, y - 18, x + 330, y + 96), 10, fill=((20, 20, 22, int(170 * a)) if dark else (255, 255, 255, int(205 * a))))
    for i, (c, s) in enumerate(((AIR, 'Air flow'), (HEAT, 'Convective heat'), (RAD, 'Radiant heat'))):
        yy = y + 8 + i * 30; d.ellipse((x, yy - 7, x + 14, yy + 7), fill=(*c, int(255 * a))); text(d, (x + 26, yy), s, LS(21), col, 'lm', a)

def grade(im, night=False):
    a = np.asarray(im).astype(np.float32) / 255
    H, W = a.shape[:2]; yy, xx = np.mgrid[0:H, 0:W]
    r = np.sqrt(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2)
    a *= (1 - (0.22 if night else 0.10) * np.clip(r - 0.45, 0, 1) ** 1.5)[..., None]
    g = np.random.default_rng(int(1e6 * random.random())).normal(0, 0.003, (H, W, 1)); a += g
    return Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))

def cavity_air(t, size=(1920, 1080), crop=None, alpha=0.20):
    """A soft volumetric tint on the cavity air (section plane), coloured by the same warmth field as the surfaces."""
    f, k = cavity_tint(t)
    if f is None: return None
    b = shots.beat_at(T, t)[0]; yp = 0.03 if b == shots.NOKIT else -0.07
    L, d = new_layer(size); xs = np.linspace(-1.55, 1.55, 48)
    for x0, x1 in zip(xs, xs[1:]):
        w = float(f(np.array([(x0 + x1) / 2]))[0]); col = WARM * w + COOL * (1 - w)
        a = alpha * (w if b == shots.NOKIT else 1.0)
        q = [proj(t, p, crop=crop) for p in ((x0, yp, B + 0.004), (x1, yp, B + 0.004), (x1, yp, TOP - 0.004), (x0, yp, TOP - 0.004))]
        if all(q) and a > 0.005: d.polygon([(p[0], p[1]) for p in q], fill=(*[int(v) for v in col], int(255 * a)))
    return reduce(L, size).filter(ImageFilter.GaussianBlur(5))

def colour_key(d, a, x, y, dark=False):
    if a <= 0: return
    for i in range(60):
        u = i / 59; col = WARM * (1 - u) + COOL * u
        d.rectangle((x + i * 3.4, y, x + (i + 1) * 3.4 + 0.5, y + 12), fill=(*[int(v) for v in col], int(255 * a)))
    text(d, (x, y + 30), 'warm  ↔  cool', LS(19), WHITE if dark else INK, 'lm', a)


def grade_v(im, b):
    """Grade per beat: no vignette on the studio-white and app pages (clean white), a light one on the CAD rooms."""
    if b in (EXPL, APP):
        a = np.asarray(im).astype(np.float32) / 255
        a += np.random.default_rng(int(1e6 * random.random())).normal(0, 0.004, a.shape[:2] + (1,))
        return Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))
    return grade(im, False)

def logo_bug(L, a, x, y, w=150, dark=True):
    """The Bromic logo, small and quiet, on every shot (the end card carries the full-size logo instead)."""
    if a <= 0: return
    lg = (LOGO_DARK if dark else LOGO).copy(); lg.thumbnail((w * SS, w * SS), Image.LANCZOS)
    al = lg.split()[3].point(lambda v: int(v * a)); lg.putalpha(al); L.alpha_composite(lg, (int(x * SS), int(y * SS)))

def big_logo(L, a, x, y, w=300, dark=True):
    if a <= 0: return
    lg = (LOGO_DARK if dark else LOGO).copy(); lg.thumbnail((w * SS, w * SS), Image.LANCZOS)
    al = lg.split()[3].point(lambda v: int(v * a)); lg.putalpha(al); L.alpha_composite(lg, (int(x * SS), int(y * SS)))

def app_page(L, d, bt, D, W=1920, H=1080, vertical=False):
    """APP beat: Bromic's own app image on a clean page, the line about a shut-off time, and the Affinity note (hub rule 4)."""
    a = clamp(bt / 0.6) * clamp((D - bt) / 0.5)
    if vertical:
        s = 900; x0, y0 = 90, 640
    else:
        s = 760; x0, y0 = 1060, 160
    z = 1.0 + 0.04 * E(clamp(bt / D))                     # a slow push in on the photograph (cropped inside its card, never enlarged past it)
    iw = int(s * SS)
    src = APP_IMG; cw, ch = src.size; w, h = cw / z, ch / z
    ph = src.resize((iw, int(iw * ch / cw)), Image.LANCZOS, box=((cw - w) / 2, (ch - h) / 2, (cw + w) / 2, (ch + h) / 2)).convert('RGBA')
    m = Image.new('L', ph.size, 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, ph.size[0], ph.size[1]), 22 * SS, fill=int(255 * a)); ph.putalpha(m)
    sh = Image.new('RGBA', (ph.size[0] + 120 * SS, ph.size[1] + 120 * SS), (0, 0, 0, 0))
    ImageDraw.Draw(sh).rounded_rectangle((60 * SS, 74 * SS, 60 * SS + ph.size[0], 74 * SS + ph.size[1]), 22 * SS, fill=(0, 0, 0, int(60 * a)))
    sh = sh.filter(ImageFilter.GaussianBlur(22 * SS))
    yy = y0 + 18 * (1 - E(a))
    L.alpha_composite(sh, (int((x0 - 60) * SS), int((yy - 60) * SS))); L.alpha_composite(ph, (int(x0 * SS), int(yy * SS)))
    if vertical:
        kicker(d, 'Affinity Smart-Heat Controls', clamp(bt / 0.5), 64, 150)
        text(d, (64, 250), 'Set A Shut-Off Time', DD(84), INK, alpha=clamp((bt - 0.3) / 0.6))
        text(d, (64, 350), 'In The Bromic App', DD(84), INK, alpha=clamp((bt - 0.5) / 0.6))
        text(d, (64, 470), 'Peace of mind on top of worry-free,', LS(36), INK, alpha=clamp((bt - 1.2) / 0.6))
        text(d, (64, 520), 'dual fan-ventilated recessing', LS(36), INK, alpha=clamp((bt - 1.2) / 0.6))
        text(d, (64, 1600), 'App control needs compatible Affinity Smart-Heat', LS(26), (110, 110, 110), alpha=clamp((bt - 1.6) / 0.6))
        text(d, (64, 1640), 'controls, sold separately.', LS(26), (110, 110, 110), alpha=clamp((bt - 1.6) / 0.6))
        return
    kicker(d, 'Affinity Smart-Heat Controls', clamp(bt / 0.6), 120, 300)
    t1 = min(vo_t(APP, 0.5) - 0.6, 2.2)
    title(d, 'Set A Shut-Off Time', t1, bt, x=120, y=340, size=72)
    title(d, 'In The Bromic App', t1 + 0.25, bt, x=120, y=428, size=72)
    a2 = clamp((bt - 0.5) / 0.6)
    text(d, (120, 580), 'Peace of mind on top of worry-free,', LS(34), INK, alpha=a2)
    text(d, (120, 626), 'dual fan-ventilated recessing.', LS(34), INK, alpha=a2)
    d.line((120, 700, 220, 700), fill=(*FLAME, int(255 * a2)), width=3)
    text(d, (120, 860), 'App control needs compatible Affinity Smart-Heat controls, sold separately.', LS(21), (110, 110, 110), alpha=clamp((bt - 1.4) / 0.6))

def end_card(L, d, bt, x=110, y=110, size=60, vertical=False):
    a = clamp((bt - 0.6) / 0.8)
    if vertical:
        kicker(d, 'Tungsten Smart-Heat Electric Series II', a, 64, 110)
        lines = ['The Only 6 kW Recessed', 'Outdoor Heater With A', 'Dual Fan-Ventilated,', 'Low-Clearance Recess Kit']
        for i, s in enumerate(lines): text(d, (64, 180 + i * 78 + 20 * (1 - E(a))), s, DD(64), INK, alpha=clamp((bt - 0.6 - 0.3 * i) / 0.8))
        a2 = clamp((bt - vo_t(END, 0.55)) / 0.6)
        f = LS(30, True); s = 'PLAN IT IN AT BROMIC.COM'; w = d.textlength(s, font=f)
        if a2 > 0:
            d.rectangle((540 - w / 2 - 30, 1636, 540 + w / 2 + 30, 1700), outline=(*INK, int(255 * a2)), width=2); text(d, (540, 1668), s, f, INK, 'mm', a2)
            text(d, (540, 1748), 'Contact us for a complimentary design plan', LS(34), INK, 'mm', clamp((bt - vo_t(END, 0.72)) / 0.6))
        big_logo(L, clamp((bt - vo_t(END, 0.85)) / 0.8), 410, 1792, 260)
        return
    kicker(d, 'Tungsten Smart-Heat Electric Series II', a, x, y)
    lines = ['The Only 6 kW Recessed Outdoor Heater', 'With A Dual Fan-Ventilated,', 'Low-Clearance Recess Kit']
    for i, s in enumerate(lines): text(d, (x, y + 30 + i * (size + 14) + 20 * (1 - E(a))), s, DD(size), INK, alpha=clamp((bt - 0.6 - 0.35 * i) / 0.8))
    a2 = clamp((bt - vo_t(END, 0.55)) / 0.6)
    if a2 > 0:
        f = LS(24, True); s = 'PLAN IT IN AT BROMIC.COM  ·  CONTACT US FOR A COMPLIMENTARY DESIGN PLAN'; w = d.textlength(s, font=f)
        yb = 896
        d.rectangle((x, yb, x + w + 56, yb + 56), fill=(255, 255, 255, int(150 * a2)), outline=(*INK, int(255 * a2)), width=2)
        text(d, (x + 28, yb + 28), s, f, INK, 'lm', a2)
    big_logo(L, clamp((bt - vo_t(END, 0.85)) / 0.8), 1540, 92, 280)

# ------------------------------------------------------------------ one 16:9 frame
def frame_h(f):
    t = f / FPS; b, u = shots.beat_at(T, t); bt = t - T['start'][b]; D = T['dur'][b]
    im = base(f)
    ca = cavity_air(t)
    if ca is not None: im = over(im, ca)
    dots, lines = [], []
    rl = []
    if b == NOKIT:
        dots, lines = trail_dots(particles_nokit(t, u), particles_nokit(t - 0.12, u - 0.12 / D), t)
        rl = ray_lines(t, 0.6)
    if b == KIT:
        spin_in = clamp(bt / shots.SPINUP)
        dots, lines = trail_dots(particles_kit(t, u, spin_in), particles_kit(t - 0.12, u, clamp((bt - 0.12) / shots.SPINUP)), t)
        rl = ray_lines(t, 0.65)
    if rl:
        rh, _ = glow_layer((1920, 1080), [], rl, 10); im = add_light(im, rh, 2.6)
    if dots or lines:
        halo, core = glow_layer((1920, 1080), dots, lines, 9)
        im = add_light(im, halo, 2.2); im = over(im, core)
    L, d = new_layer((1920, 1080))
    if b == OPEN:                                     # three lines land with the voice; the heater switches on with the first
        for i, (w, fr) in enumerate((('2, 3, 4 and 6 kW.', 0.0), ('7.5 In.', 0.47), ('Worry-Free Recessing.', 0.74))):
            t0 = vo_t(OPEN, fr) - 0.15; a = clamp((bt - t0) / 0.5)
            text(d, (1010 + 40 * (1 - E(a)), 730 + i * 90), w, DD(74), INK, 'ls', a * clamp((D - bt) / 0.6))
        kicker(d, 'Tungsten Smart-Heat Electric Series II', clamp((bt - 0.2) / 0.6) * clamp((D - bt) / 0.6), 1014, 620)
    if b == CEIL:
        kicker(d, 'The low-clearance recess kit', clamp(bt / 0.6))
        title(d, 'Recessed In A 7.5 In Cavity', 0.3, bt)
        cu = clamp((u - 0.08) / 0.5)
        if 0.02 < cu < 0.999:                         # the section plane sweeping toward the heater
            y = -2.3 + 2.3 * E(cu); pts = [proj(t, (x, y, B + 0.001)) for x in np.linspace(-2.2, 2.2, 12)]
            pts = [(q[0], q[1]) for q in pts if q]
            if len(pts) > 1: d.line(pts, fill=(*FLAME, 220), width=3)
        a = clamp((u - 0.62) / 0.2)
        if a > 0:                                     # self-drawing 7.5 in dimension
            p0, p1 = proj(t, (0.86, 0.0, B)), proj(t, (0.86, 0.0, B + (TOP - B) * E(a)))
            if p0 and p1:
                d.line((p0[0], p0[1], p1[0], p1[1]), fill=(*FLAME, 255), width=3)
                for q in (p0, p1): d.line((q[0] - 14, q[1], q[0] + 14, q[1]), fill=(*FLAME, 255), width=3)
                text(d, (p1[0] + 22, (p0[1] + p1[1]) / 2 - 16), '7.5 in cavity', LS(28, True), INK, 'lm', clamp((a - 0.5) * 2))
                text(d, (p1[0] + 22, (p0[1] + p1[1]) / 2 + 16), '190.5 mm', LS(22), INK, 'lm', clamp((a - 0.5) * 2))
    if b == EXPL:
        kicker(d, 'Inside the kit', clamp(bt / 0.6)); title(d, 'One Supplied Recess Box', 0.3, bt)
        e = shots.explode(T, t); X = shots.EXPLODE
        items = [((0.0, -0.12, 0.094), 'chassis', 'Recess box (supplied)', (-260, -70)),
                 ((0.5885, 0.0, 0.12), 'fan', 'Dual cooling fans', (150, -60)),
                 ((-0.5885, 0.0, 0.12), 'fan', '', (0, 0)),
                 ((0.25, 0.0, 0.053), 'barrier', 'Radiant barrier', (260, -30)),
                 ((0.70, -0.13, 0.02), 'trim', 'Trim', (170, 20)),
                 ((0.30, -0.075, -0.035), 'heater', 'Tungsten Series II (6 kW shown)', (210, 60)),
                 ((-0.836, -0.11, 0.094), 'term', 'Terminal box', (-170, -60)),
                 ((-0.779, -0.017, 0.073), 'cutout', 'Over-temperature cut-out', (70, 120))]
        for k, (p, c, lab, side) in enumerate(items):
            o = X[c]; pp = shots.heater_point(p, e) if c == 'heater' else (p[0] + o[0] * e, p[1] + o[1] * e, p[2] + o[2] * e)
            a = clamp((u - shots.EX_IN - 0.02 - 0.035 * k) / 0.06) * clamp((shots.EX_OUT - 0.01 - u) / 0.03)
            if lab: callout(d, t, pp, lab, side, a)
            elif a > 0:
                q = proj(t, pp)
                if q: d.ellipse((q[0] - 6, q[1] - 6, q[0] + 6, q[1] + 6), fill=(*FLAME, int(255 * clamp(a * 3))))
    if b == APP: app_page(L, d, bt, D)
    if b == NOKIT:
        kicker(d, 'Without a ventilated kit', clamp(bt / 0.6)); title(d, 'Heat Behind The Heater Has Nowhere To Go', 0.3, bt, size=52)
        a = clamp((u - 0.55) / 0.08)
        if a > 0:
            x, y = 1340, 150; s = 1 + 0.25 * (1 - E(a))
            d.rounded_rectangle((x - 20 * s, y - 34, x + 420, y + 42), 12, fill=(255, 255, 255, int(235 * a)))
            r = 22 * s; d.ellipse((x - r + 18, y - r, x + r + 18, y + r), outline=(*FLAME, int(255 * a)), width=5)
            d.line((x + 18 - r * 0.7, y + r * 0.7, x + 18 + r * 0.7, y - r * 0.7), fill=(*FLAME, int(255 * a)), width=5)
            text(d, (x + 56, y - 10), 'Not how to install', LS(28, True), FLAME, 'lm', a)
            text(d, (x + 56, y + 20), 'Always use the kit for your model', LS(20), INK, 'lm', a)
        legend(d, clamp((bt - 1.0) / 0.6), 1500, 930); colour_key(d, clamp((bt - 1.6) / 0.6), 1500, 862)
    if b == KIT:
        kicker(d, 'With the low-clearance recess kit', clamp(bt / 0.6)); title(d, 'Dual Fan-Ventilated. The Cavity Stays Cool.', 0.3, bt, size=52)
        s2, s3 = vo_t(KIT, 0.43), vo_t(KIT, 0.70)    # the radiant-barrier sentence, then "the cavity stays cool"
        callout(d, t, (-0.5885, -0.02, 0.12), 'Dual cooling fans', (-60, -150), clamp((bt - 1.0) / 1.2) * clamp((s2 - 0.2 - bt) / 0.5))
        a = clamp((bt - s2 + 0.3) / 1.0) * clamp((s3 + 0.4 - bt) / 0.5)
        callout(d, t, (0.0, -0.02, 0.053), 'Radiant barrier', (40, 150), a)
        if a > 0: text(d, (960, 200), 'The radiant barrier reduces heat build-up in the cavity', LS(30, True), (40, 100, 170), 'mm', a)
        a = clamp((bt - 1.6) / 1.0) * clamp((s2 - 0.3 - bt) / 0.5)
        if a > 0: text(d, (960, 200), 'The cavity cools as the air flows', LS(30, True), (40, 100, 170), 'mm', a)
        callout(d, t, (0.45, -0.02, -0.05), 'Radiant heat, down to the seats', (-300, 175), clamp((bt - s3 - 0.2) / 1.0) * clamp((D - bt) / 0.4))
        legend(d, clamp((bt - 1.0) / 0.6), 1500, 930); colour_key(d, clamp((bt - 1.6) / 0.6), 1500, 862)
    if b == PROT:
        kicker(d, 'Built-in protection', clamp(bt / 0.6)); title(d, 'Over-Temperature Cut-Out', 0.3, bt)
        text(d, (72, 168), 'In the terminal box · manual reset', LS(26), INK, alpha=clamp((bt - 0.8) / 0.6))
        prot_inset(L, d, t, bt, D)
    if b == END: end_card(L, d, bt)
    if b != END or bt < vo_t(END, 0.8): logo_bug(L, clamp(t / 0.8) * (clamp((vo_t(END, 0.8) + 0.6 - bt) / 0.6) if b == END else 1.0), 1730, 44, 150, dark=True)
    im = over(im, reduce(L, (1920, 1080)))
    return grade_v(im, b)

def prot_inset(L, d, t, bt, D, cx=1600, cy=870, r=170, crop=None, scale=1.0):
    """The whole kit stays in frame (owner: no cropped kit shots); the cut-out is shown in a round inset from the detail plate P6D,
    reduced from its native render, with a leader to where it sits in the kit."""
    a = clamp((bt - 0.9) / 0.6)
    if a <= 0: return
    q = proj(t, (-0.779, -0.017, 0.073), crop=crop)
    det = img('P6D'); H, W = det.shape[:2]
    p = shots.project_cam(shots.cam_b('PROT_D'), (-0.779, -0.017, 0.073), W, H)
    R = int(r * scale); side = int(2 * R * 1.0 / 0.62)        # the inset shows the plate at 0.62 x: always a reduction
    x0 = int(min(max(p[0] - side / 2, 0), W - side)); y0 = int(min(max(p[1] - side / 2, 0), H - side))
    sub = Image.fromarray(np.clip(det[y0:y0 + side, x0:x0 + side], 0, 255).astype(np.uint8)).resize((2 * R * SS, 2 * R * SS), Image.LANCZOS).convert('RGBA')
    m = Image.new('L', sub.size, 0); ImageDraw.Draw(m).ellipse((0, 0, sub.size[0] - 1, sub.size[1] - 1), fill=int(255 * a)); sub.putalpha(m)
    ccx, ccy = cx, cy
    if q:
        d.line((q[0], q[1], ccx - R * 0.94, ccy - R * 0.34), fill=(*FLAME, int(230 * a)), width=3)
        d.ellipse((q[0] - 7, q[1] - 7, q[0] + 7, q[1] + 7), fill=(*FLAME, int(255 * a)))
    L.alpha_composite(sub, (int((ccx - R) * SS), int((ccy - R) * SS)))
    d.ellipse((ccx - R, ccy - R, ccx + R, ccy + R), outline=(*FLAME, int(255 * a)), width=4)
    # where the cut-out sits inside the inset
    ix = ccx - R + (p[0] - x0) / side * 2 * R; iy = ccy - R + (p[1] - y0) / side * 2 * R
    d.ellipse((ix - 16, iy - 16, ix + 16, iy + 16), outline=(*FLAME, int(255 * clamp((bt - 1.5) / 0.4))), width=3)
    f = LS(int(24 * max(1, scale)), True); s = 'Over-temperature cut-out · manual reset'; w = d.textlength(s, font=f)
    a2 = clamp((bt - 1.5) / 0.5)
    xr = ccx - R - 28
    d.rounded_rectangle((xr - w - 12, ccy + 40, xr + 12, ccy + 80), 8, fill=(255, 255, 255, int(215 * a2)))
    text(d, (xr, ccy + 60), s, f, INK, 'rm', a2)

# ------------------------------------------------------------------ Reels (9:16): KIT, then the hero end, big type
def reels_timeline():
    return [(T['start'][KIT], T['dur'][KIT]), (T['start'][END], T['dur'][END])]
def frame_v(f):
    segs = reels_timeline(); t = f / FPS; acc = 0
    for s0, dd in segs:
        if t < acc + dd: src_t = s0 + (t - acc); break
        acc += dd
    else: src_t = segs[-1][0] + segs[-1][1] - 1 / FPS
    sf = int(round(src_t * FPS)); b, u = shots.beat_at(T, src_t); bt = src_t - T['start'][b]
    full = base(sf)
    if b == KIT:                                      # the WHOLE kit (owner: no cropped kit shots): the full 16:9 picture, reduced to 1080 wide
        crop = (0, 0, 1080 / 1920); PW, PH = 1080, 608
        panel = full.resize((PW, PH), Image.LANCZOS)
        spin_in = clamp(bt / shots.SPINUP)
        dots, lines = trail_dots(particles_kit(src_t, u, spin_in), particles_kit(src_t - 0.12, u, clamp((bt - 0.12) / shots.SPINUP)), src_t, crop, 0.75)
        rh, _ = glow_layer((PW, PH), [], ray_lines(src_t, 0.65, crop, 0.75), 7); panel = add_light(panel, rh, 1.6)
        halo, core = glow_layer((PW, PH), dots, lines, 6); panel = add_light(panel, halo, 2.2); panel = over(panel, core)
        ca = cavity_air(src_t, (PW, PH), crop)
        if ca is not None: panel = over(panel, ca)
        canvas = Image.new('RGB', (1080, 1920), (244, 243, 241)); canvas.paste(panel, (0, 640))
    else:                                             # the hero end: a 1080 x 1080 square from the middle of the 16:9 frame
        panel = full.crop((420, 0, 1500, 1080))
        canvas = Image.new('RGB', (1080, 1920), (244, 243, 241)); canvas.paste(panel, (0, 520))
    L, d = new_layer((1080, 1920))
    if b == KIT:
        kicker(d, 'Tungsten Series II · recess kit', clamp(bt / 0.5), 64, 120)
        a = clamp((bt - 0.2) / 0.6)
        text(d, (64, 210 + 20 * (1 - E(a))), 'Worry-Free Recessing', DD(78), INK, alpha=a)
        text(d, (64, 300 + 20 * (1 - E(a))), 'Dual Fan-Ventilated', DD(78), INK, alpha=clamp((bt - 0.5) / 0.6))
        s2, s3 = vo_t(KIT, 0.43), vo_t(KIT, 0.70)
        for k, (s, t0, t1) in enumerate((('Air in, along behind the heater, out', 1.2, s2 - 0.1), ('Less heat build-up in the cavity', s2, s3 - 0.1),
                                         ('Radiant heat goes down to the seats', s3, T['dur'][KIT] - 0.2))):
            a = clamp((bt - t0) / 0.5) * clamp((t1 - bt) / 0.4)
            text(d, (540, 1640), s, LS(46, True), INK, 'mm', a)
        colour_key(d, clamp((bt - 1.6) / 0.6), 438, 1740)
    else:
        end_card(L, d, bt, vertical=True)
    if b != END or bt < vo_t(END, 0.8):
        logo_bug(L, clamp(t / 0.8) * (clamp((vo_t(END, 0.8) + 0.6 - bt) / 0.6) if b == END else 1.0), 870, 40, 160, dark=True)
    canvas = over(canvas, reduce(L, (1080, 1920)))
    return grade(canvas, False)

# ------------------------------------------------------------------ 6 s seamless loop: steady KIT frames, particles and fans cycling
def frame_loop(f):
    P = 6.0; n4 = int(round(T['dur'][KIT] * FPS)); s4 = int(round(T['start'][KIT] * FPS))
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
    L, d = new_layer((1920, 1080)); logo_bug(L, 1.0, 1730, 44, 150, dark=True); im = over(im, reduce(L, (1920, 1080)))
    return grade(im)

fn = {'h': frame_h, 'v': frame_v, 'loop': frame_loop}[MODE]
if os.environ.get('PIPE'):
    out = sys.stdout.buffer
    for f in range(F0, F1): out.write(fn(f).convert('RGB').tobytes())
    out.flush()
else:
    od = os.environ.get('OUTDIR') or {'h': 'qh', 'v': 'qv', 'loop': 'ql'}[MODE]; os.makedirs(os.path.join(WORK, od), exist_ok=True)
    for f in range(F0, F1):
        p = os.path.join(WORK, od, '%05d.png' % f)
        if not os.path.exists(p): fn(f).save(p, compress_level=1)
