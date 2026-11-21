"""Compose the Tungsten Series II low-clearance recess airflow video.
Inputs (in WORK, made by render.py and tts.py): A_kit.png, B_nokit.png (transparent CAD sections), C_below.png,
vo1..vo4.wav (voice-over), didot.ttf.  Output: frames in WORK/frames_h and WORK/frames_v, then ffmpeg (see make.sh).
Everything drawn here is an ILLUSTRATION of the airflow, not a thermal test or CFD.
Usage: python3 compose.py WORK h|v [start end]"""
import sys, os, json, math, wave
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont

WORK = sys.argv[1]; MODE = sys.argv[2]
FPS = 30
REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
W, H = 1920, 1080
K = 1920 / 2.1; CX, CZ = -0.05, -0.0656          # orthographic section camera (render.py)
def P(x, z): return (W / 2 + (x - CX) * K, H / 2 - (z - CZ) * K)

INK = (35, 31, 32); INK2 = (74, 69, 70); STEEL = (113, 119, 125); FLAME = (239, 65, 35); PAPER = (244, 243, 241)
AIR = (64, 118, 165); CONV = (242, 150, 38)
F = lambda s, b=False: ImageFont.truetype('/usr/share/fonts/truetype/liberation/LiberationSans-%s.ttf' % ('Bold' if b else 'Regular'), s)
D = lambda s: ImageFont.truetype(os.path.join(WORK, 'didot.ttf'), s)

TEMPO = 1.08
def wav_len(p):
    w = wave.open(p); return w.getnframes() / w.getframerate()
VO = [wav_len(os.path.join(WORK, f'vo{i}.wav')) / TEMPO for i in (1, 2, 3, 4)]
PAD = [1.6, 1.0, 1.0, 2.6]
LEAD = [0.9, 0.35, 0.35, 0.5]   # voice starts this long into each scene (audio.py)
DUR = [v + p for v, p in zip(VO, PAD)]
STARTS = np.cumsum([0] + DUR[:-1]); TOTAL = sum(DUR)

SUBS = [
    ["This is a six-kilowatt Tungsten Series II heater,", "recessed flush into a ceiling cavity just 7.5 in deep."],
    ["Here is an illustration of what happens without a ventilated kit.", "Radiant heat travels down to the people below.",
     "But heat from the back of the heater warms the air in the cavity.", "With nowhere to go, it rises and pools against the joists and the deck above.",
     "That's why every recessed heater goes in with the kit made for it."],
    ["With the low-clearance recess kit, the supplied recess box separates the heater from the framing,", "so there's no box to build on site.",
     "Dual fans draw air in at one end, carry it along behind the heater,", "and send it out through the vent end.",
     "The cavity stays cool, and the radiant heat still goes where it belongs: down to the seats.",
     "Mount it 94 in or more above the floor,", "and 500 mm from walls and between heaters."],
    ["Worry-free, dual fan-ventilated, 6 kW recessing.", "Plan it in with the Pro planning guide, at bromic.com."]]

def sub_at(si, ts):
    lines = SUBS[si]; n = [len(l) for l in lines]; tot = sum(n); t0 = LEAD[si]
    u = (ts - t0) / max(VO[si] - 0.3, 0.1) * tot
    acc = 0
    for l, c in zip(lines, n):
        acc += c
        if u <= acc: return l if ts >= t0 else ''
    return lines[-1] if ts <= VO[si] + 0.6 else ''

# ---------- static section art ----------
def hatch(img, x0, y0, x1, y1, step, col, ang=45):
    m = np.zeros(img.shape[:2], np.uint8)
    for k in range(-int(y1 - y0) - 40, int(x1 - x0) + 40, step):
        cv2.line(m, (int(x0 + k), int(y1)), (int(x0 + k + (y1 - y0)), int(y0)), 255, 1, cv2.LINE_AA)
    sl = (slice(int(y0), int(y1)), slice(int(x0), int(x1)))
    a = (m[sl] / 255.0)[..., None]; img[sl] = (img[sl] * (1 - a * 0.55) + np.array(col) * a * 0.55).astype(np.uint8)

def section_base(kind):
    img = np.full((H, W, 3), PAPER, np.uint8)
    yd0 = P(0, 0.2032 + 0.025)[1]; yd1 = P(0, 0.2032)[1]; yb0 = P(0, 0.0127)[1]; yb1 = P(0, 0)[1]
    # joist beyond the section: timber, light grain
    cv2.rectangle(img, (0, int(yd1)), (W, int(yb0)), (238, 228, 212), -1)
    for i, y in enumerate(range(int(yd1) + 9, int(yb0), 13)):
        cv2.line(img, (0, y + (i % 3)), (W, y - (i % 2)), (226, 212, 192), 1, cv2.LINE_AA)
    # deck above (section, hatched) and ceiling board (section) with the cut-out
    cv2.rectangle(img, (0, int(yd0)), (W, int(yd1)), (206, 194, 178), -1); hatch(img, 0, yd0, W, yd1, 9, INK2)
    cut = 0.812 if kind == 'kit' else 0.69
    xa, xb = P(-cut, 0)[0], P(cut, 0)[0]
    for x0, x1 in ((0, xa), (xb, W)):
        cv2.rectangle(img, (int(x0), int(yb0)), (int(x1), int(yb1)), (252, 252, 250), -1); hatch(img, x0, yb0, x1, yb1, 7, STEEL, 45)
        cv2.rectangle(img, (int(x0), int(yb0)), (int(x1), int(yb1)), INK2, 1, cv2.LINE_AA)
    cv2.line(img, (0, int(yd0)), (W, int(yd0)), INK2, 1, cv2.LINE_AA); cv2.line(img, (0, int(yd1)), (W, int(yd1)), INK2, 1, cv2.LINE_AA)
    # room below: floor line and two chairs, simple line drawing
    fy = 960
    cv2.line(img, (60, fy), (1700, fy), INK2, 2, cv2.LINE_AA)
    for cxp in (620, 1260):
        for s in (-1, 1):
            x = cxp + s * 95
            pts = np.array([[x - s * 30, fy], [x - s * 30, fy - 92], [x + s * 32, fy - 92], [x + s * 32, fy], [x + s * 32, fy - 92], [x + s * 40, fy - 175]], np.int32)
            cv2.polylines(img, [pts], False, INK2, 2, cv2.LINE_AA)
        cv2.line(img, (cxp - 70, fy - 128), (cxp + 70, fy - 128), INK2, 3, cv2.LINE_AA)
        cv2.line(img, (cxp, fy - 128), (cxp, fy), INK2, 2, cv2.LINE_AA)
    pil = Image.fromarray(img)
    rnd = Image.open(os.path.join(WORK, 'A_kit.png' if kind == 'kit' else 'B_nokit.png')).convert('RGBA')
    pil.paste(rnd, (0, 0), rnd)
    d = ImageDraw.Draw(pil)
    # dimension: 7.5 in cavity (right) and 94 in to the floor
    xd = 1700
    for (ya, yb, lab) in ((yd1, yb0, '7.5 in'), (yb1, fy, '94 in or more')):
        d.line([(xd, ya + 3), (xd, yb - 3)], fill=INK, width=2)
        for yy, s in ((ya, 1), (yb, -1)): d.polygon([(xd, yy + 2 * s), (xd - 7, yy + 14 * s), (xd + 7, yy + 14 * s)], fill=INK)
        d.text((xd + 14, (ya + yb) / 2 - 14), lab, font=F(24, True), fill=INK)
    d.text((xd + 14, (yd1 + yb0) / 2 + 14), 'cavity', font=F(19), fill=INK2)
    d.text((xd + 14, (yb1 + fy) / 2 + 14), 'to the floor', font=F(19), fill=INK2)
    if kind == 'kit': d.text((70, yd1 + 6), 'Joist (beyond the section)', font=F(17), fill=INK2)
    d.text((1120, fy + 6), 'Below the ceiling: not to scale', font=F(16), fill=STEEL)
    return pil

def label(d, x, y, tx, ty, text, col=INK):
    d.line([(x, y), (tx, ty)], fill=col, width=2); d.ellipse([x - 4, y - 4, x + 4, y + 4], fill=col)
    w = d.textlength(text, font=F(21, True)); ax = tx - w - 8 if tx < x else tx + 8
    d.text((ax, ty - 13), text, font=F(21, True), fill=col)

def kit_labels(pil, a=1.0):
    over = Image.new('RGBA', pil.size, (0, 0, 0, 0)); d = ImageDraw.Draw(over)
    label(d, *P(0.30, 0.186), *P(0.38, 0.33), 'Recess box (supplied)')
    label(d, *P(0.59, 0.12), *P(0.74, 0.27), 'Cooling fan')
    label(d, *P(-0.59, 0.12), *P(-0.80, 0.27), 'Cooling fan')
    label(d, *P(-0.25, 0.02), *P(-0.36, -0.20), 'Heater')
    label(d, *P(-0.72, -0.03), *P(-0.92, -0.17), 'Vent end')
    if a < 1: over.putalpha(over.getchannel('A').point(lambda v: int(v * a)))
    pil.alpha_composite(over) if pil.mode == 'RGBA' else pil.paste(over, (0, 0), over)

# ---------- vector fields ----------
def poly(points, n=120):
    pts = np.array([P(*p) for p in points], float)
    seg = np.r_[0, np.cumsum(np.linalg.norm(np.diff(pts, axis=0), axis=1))]
    s = np.linspace(0, seg[-1], n); x = np.interp(s, seg, pts[:, 0]); y = np.interp(s, seg, pts[:, 1])
    return np.c_[x, y], seg[-1]

def arrow(layer, x, y, dx, dy, size, col, alpha):
    """Draw one vector (shaft + head) into the layer: colour image and alpha mask."""
    if alpha <= 0.02: return
    cimg, mask = layer
    n = math.hypot(dx, dy) or 1; ux, uy = dx / n, dy / n; px, py = -uy, ux
    tip = (x + ux * size, y + uy * size); l = (x - ux * size * 0.6 + px * size * 0.55, y - uy * size * 0.6 + py * size * 0.55)
    r = (x - ux * size * 0.6 - px * size * 0.55, y - uy * size * 0.6 - py * size * 0.55)
    tail = (x - ux * size * 1.9, y - uy * size * 1.9)
    a = int(alpha * 255)
    for im, cc in ((cimg, col), (mask, a)):
        cv2.line(im, (int(tail[0] * 4), int(tail[1] * 4)), (int(x * 4), int(y * 4)), cc, max(1, int(size * 0.28)), cv2.LINE_AA, 2)
        cv2.fillConvexPoly(im, (np.array([tip, l, r]) * 4).astype(np.int32), cc, cv2.LINE_AA, 2)

def new_layer(): return (np.zeros((H, W, 3), np.uint8), np.zeros((H, W), np.uint8))
def apply_layer(img, layer):
    cimg, mask = layer; m = (mask.astype(np.float32) / 255)[..., None]
    img[:] = (img * (1 - m) + cimg * m).astype(np.uint8)

def flow(img, path, t, speed, spacing, size, col, alpha=1.0, fade_end=False, grow=None):
    pts, L = path; n = max(1, int(L / spacing))
    for i in range(n):
        s = (t * speed + i * spacing) % L; f = s / L
        k = min(int(f * (len(pts) - 1)), len(pts) - 2); a = pts[k]; b = pts[k + 1]; fr = f * (len(pts) - 1) - k
        x, y = a + (b - a) * fr
        al = alpha * min(1, f * 8) * (1 - f) ** 0.6 if fade_end else alpha * min(1, f * 8, (1 - f) * 8)
        sz = size * (grow(f) if grow else 1)
        arrow(img, x, y, b[0] - a[0], b[1] - a[1], sz, col, al)

RAD = [poly([(x, -0.05), (x + x * 0.30, -0.50)], 40) for x in np.linspace(-0.6, 0.6, 9)]
AIR_LANES = [poly([(0.80, -0.36), (0.71, -0.06), (0.66, 0.05), (0.59, z), (0.30, z), (0.0, z), (-0.30, z), (-0.59, z), (-0.66, 0.05), (-0.71, -0.06), (-0.82, -0.36)], 160)
             for z in (0.105, 0.135, 0.162)]
CONV_KIT = [poly([(x, 0.056), (x - 0.03, 0.09), (x - 0.12, 0.12), (-0.59, 0.12), (-0.66, 0.05), (-0.71, -0.06), (-0.82, -0.36)], 120) for x in np.linspace(-0.45, 0.45, 6)]
CONV_NOKIT = []
for x in np.linspace(-0.55, 0.55, 8):
    side = 1 if x >= 0 else -1
    CONV_NOKIT.append(poly([(x, 0.056), (x + side * 0.02, 0.13), (x + side * 0.10, 0.19), (x + side * 0.35, 0.196), (x + side * 0.55, 0.17), (x + side * 0.45, 0.11), (x + side * 0.25, 0.16), (x + side * 0.42, 0.19)], 140))

def heat_map(img, level, kind):
    if level <= 0: return
    yd1 = P(0, 0.2032)[1]; yb0 = P(0, 0.0127)[1]
    yy, xx = np.mgrid[int(yd1):int(yb0), 0:W]
    cxp = P(0, 0)[0]
    if kind == 'hot':
        g = np.exp(-((xx - cxp) / 640.0) ** 2) * (0.35 + 0.65 * ((yb0 - yy) / (yb0 - yd1)) ** 1.3)
        col = np.array(FLAME, float); a = (np.clip(g * level, 0, 1) * 0.62)[..., None]
    else:
        g = np.ones_like(xx, float); col = np.array((150, 190, 225), float); a = (g * level * 0.16)[..., None]
    sl = img[int(yd1):int(yb0)]
    img[int(yd1):int(yb0)] = (sl * (1 - a) + col * a).astype(np.uint8)

def legend(d, x, y, scale=1.0):
    d.text((x, y), 'Illustration – not a thermal test', font=F(int(17 * scale)), fill=STEEL)
    for i, (c, t) in enumerate(((AIR, 'Air flow'), (FLAME, 'Radiant heat'), (CONV, 'Convective heat'))):
        yy = y + int((30 + i * 28) * scale)
        d.line([(x, yy + 10 * scale), (x + 34 * scale, yy + 10 * scale)], fill=c, width=int(4 * scale))
        d.polygon([(x + 44 * scale, yy + 10 * scale), (x + 30 * scale, yy + 3 * scale), (x + 30 * scale, yy + 17 * scale)], fill=c)
        d.text((x + 54 * scale, yy), t, font=F(int(19 * scale)), fill=INK)

BASE = {'kit': section_base('kit'), 'nokit': section_base('nokit')}
CIMG = Image.open(os.path.join(WORK, 'C_below.png')).convert('RGB')
LOGO_W = Image.open(os.path.join(REPO, 'images/portfolio/bromic-logo-white.png')).convert('RGBA')

def art(si, ts):
    """The section (or finished ceiling) with animated vectors, no titles or subtitles."""
    if si == 3:
        im = np.array(CIMG).astype(np.float32)
        z = 1 + 0.03 * ts / DUR[3]                           # slow push-in
        M = cv2.getRotationMatrix2D((W * 0.65, H / 2), 0, z); M[0, 2] += 330; im = cv2.warpAffine(im, M, (W, H), borderMode=cv2.BORDER_REPLICATE)
        grad = np.clip(np.linspace(1.15, -0.2, W), 0, 1)[None, :, None] ** 1.2
        im = im * (1 - grad * 0.75) + np.array((20, 18, 19)) * grad * 0.75
        return Image.fromarray(np.clip(im, 0, 255).astype(np.uint8)).convert('RGBA')
    kind = 'nokit' if si == 1 else 'kit'
    img = np.array(BASE[kind].convert('RGB'))
    if si == 1:
        heat_map(img, min(1, ts / (DUR[1] * 0.75)), 'hot')
    if si == 2:
        heat_map(img, 1.0, 'cool')
    pil = Image.fromarray(img).convert('RGBA')
    if si in (0, 2):
        kit_labels(pil, min(1, ts / 1.5) if si == 0 else 0.85)
    img = np.array(pil.convert('RGB'))
    lay = new_layer()
    if si >= 1:
        rad_a = min(1, ts / 1.2)
        for p in RAD: flow(lay, p, ts, 120, 70, 13, FLAME, 0.9 * rad_a, fade_end=True, grow=lambda f: 1.0 - 0.45 * f)
    if si == 1:
        ca = min(1, max(0, ts - 1.5) / 1.5)
        for j, p in enumerate(CONV_NOKIT): flow(lay, p, ts + j * 0.37, 42 + 3 * (j % 3), 46, 10, CONV, 0.95 * ca)
    if si == 2:
        for j, p in enumerate(AIR_LANES): flow(lay, p, ts + j * 0.5, 150, 64, 12, AIR, 0.95)
        for j, p in enumerate(CONV_KIT): flow(lay, p, ts + j * 0.29, 120, 80, 9, CONV, 0.9)
    apply_layer(img, lay)
    pil = Image.fromarray(img).convert('RGBA'); d = ImageDraw.Draw(pil)
    if si >= 1:
        d.rounded_rectangle([1360, 676, 1660, 820], 6, fill=(255, 255, 255)); legend(d, 1378, 688)
    if si == 1:  # not a permitted install
        bx, by = 90, 560
        d.rounded_rectangle([bx - 12, by - 12, bx + 470, by + 70], 6, fill=(255, 255, 255))
        d.ellipse([bx, by, bx + 54, by + 54], outline=FLAME, width=5); d.line([(bx + 10, by + 44), (bx + 44, by + 10)], fill=FLAME, width=5)
        d.text((bx + 68, by + 2), 'Not how to install', font=F(24, True), fill=FLAME)
        d.text((bx + 68, by + 32), 'Always use the kit for your model', font=F(20), fill=INK)
    return pil

TITLES = [
    ('TUNGSTEN SMART-HEAT ELECTRIC SERIES II', '6 kW, Flush In A 7.5 In Cavity', 'The low-clearance recess kit, in section', []),
    ('ILLUSTRATION · WITHOUT A VENTILATED KIT', 'Heat Behind The Heater Has Nowhere To Go', 'It rises and pools against the joists and the deck', []),
    ('ILLUSTRATION · WITH THE LOW-CLEARANCE RECESS KIT', 'Dual Fan-Ventilated: The Cavity Stays Cool', '',
     ['Recess box supplied – no site-built box', 'Minimum cavity 7.5 in', 'Mount 94 in or more above the floor', '500 mm from walls and between heaters', 'Coastal: marine-grade 316 kit']),
    ('', 'Worry-Free, Dual Fan-Ventilated 6 kW Recessing', 'Tungsten Smart-Heat Electric Series II · low-clearance recess kit', [])]

def chips_visible(si, ts, items):
    if not items: return []
    step = (VO[si] - 2) / len(items); return items[:max(0, min(len(items), int((ts - 1.0) / step) + 1))]

def frame_h(t):
    si = int(np.searchsorted(STARTS, t, side='right') - 1); ts = t - STARTS[si]
    pil = art(si, ts)
    if ts < 0.6 and si > 0:  # crossfade from the previous scene
        prev = art(si - 1, DUR[si - 1] - 0.6 + ts); pil = Image.blend(prev, pil, ts / 0.6)
    d = ImageDraw.Draw(pil)
    k, h, s, items = TITLES[si]
    dark = si == 3
    tc = (255, 255, 255) if dark else INK
    if dark:
        y0 = 330
        d.text((90, y0 - 60), 'TUNGSTEN SMART-HEAT ELECTRIC SERIES II', font=F(20, True), fill=(255, 196, 176))
        words = h.split(' '); l1 = ' '.join(words[:3]); l2 = ' '.join(words[3:])
        d.text((88, y0), l1, font=D(76), fill=tc); d.text((88, y0 + 92), l2, font=D(76), fill=tc)
        d.text((90, y0 + 208), s, font=F(24), fill=(225, 220, 214))
        if ts > 3.0:
            d.rectangle([90, y0 + 270, 650, y0 + 330], outline=(255, 255, 255), width=2)
            d.text((112, y0 + 286), 'SEE THE PRO PLANNING GUIDE · BROMIC.COM', font=F(19, True), fill=(255, 255, 255))
        lw = LOGO_W.copy(); lw.thumbnail((220, 120)); pil.alpha_composite(lw, (90, 120))
    else:
        d.text((90, 54), k, font=F(19, True), fill=FLAME)
        d.text((88, 86), h, font=D(58), fill=tc)
        if s: d.text((90, 166), s, font=F(24), fill=INK2)
        vis = chips_visible(si, ts, items)
        if vis: d.text((90, 168), vis[-1], font=F(26, True), fill=FLAME)
    sub = sub_at(si, ts)
    if sub:
        tw = d.textlength(sub, font=F(30)); x = (W - tw) / 2
        d.rectangle([x - 18, 994, x + tw + 18, 1046], fill=(20, 18, 19) if not dark else (255, 255, 255))
        d.text((x, 1000), sub, font=F(30), fill=(255, 255, 255) if not dark else INK)
    return pil.convert('RGB')

# vertical (Reels): scene 3 (with the kit) and the finish card
VDUR = [VO[2] * TEMPO / 1.15 + 0.8, 2.6]
def frame_v(t):
    si, ts = (2, t * 1.15 / TEMPO) if t < VDUR[0] else (3, (t - VDUR[0]))
    canvas = Image.new('RGB', (1080, 1920), PAPER if si == 2 else (20, 18, 19)); d = ImageDraw.Draw(canvas)
    if si == 2:
        a = art(2, min(ts, DUR[2] - 0.01)).convert('RGB').crop((140, 250, 1780, 980)).resize((1080, 481), Image.LANCZOS)
        canvas.paste(a, (0, 560))
        d.text((60, 150), 'ILLUSTRATION · WITH THE KIT', font=F(28, True), fill=FLAME)
        d.text((56, 200), 'Dual Fan-Ventilated:', font=D(80), fill=INK); d.text((56, 300), 'The Cavity Stays Cool', font=D(80), fill=INK)
        for i, it in enumerate(chips_visible(2, ts, TITLES[2][3])): d.text((60, 1100 + i * 56), '— ' + it, font=F(38), fill=INK)
        sub = sub_at(2, ts)
        if sub:
            import textwrap
            for j, ln in enumerate(textwrap.wrap(sub, 34)):
                tw = d.textlength(ln, font=F(42)); d.rectangle([(1080 - tw) / 2 - 16, 1500 + j * 62, (1080 + tw) / 2 + 16, 1554 + j * 62], fill=(20, 18, 19))
                d.text(((1080 - tw) / 2, 1504 + j * 62), ln, font=F(42), fill=(255, 255, 255))
    else:
        c = CIMG.copy().resize((1920, 1080)).crop((600, 50, 1680, 1030)); canvas.paste(c, (0, 500))
        d.text((60, 160), 'Worry-Free, Dual', font=D(78), fill=(255, 255, 255)); d.text((60, 260), 'Fan-Ventilated', font=D(78), fill=(255, 255, 255))
        d.text((60, 360), '6 kW Recessing', font=D(78), fill=(255, 255, 255))
        d.text((60, 1560), 'SEE THE PRO PLANNING GUIDE', font=F(34, True), fill=(255, 255, 255)); d.text((60, 1610), 'bromic.com', font=F(34), fill=(225, 220, 214))
        lw = LOGO_W.copy(); lw.thumbnail((300, 160)); canvas.paste(lw, (60, 1720), lw)
    return canvas

if __name__ == '__main__':
    out = os.path.join(WORK, 'frames_' + MODE); os.makedirs(out, exist_ok=True)
    total = TOTAL if MODE == 'h' else sum(VDUR)
    n = int(total * FPS); a = int(sys.argv[3]) if len(sys.argv) > 3 else 0; b = int(sys.argv[4]) if len(sys.argv) > 4 else n
    for i in range(a, min(b, n)):
        (frame_h if MODE == 'h' else frame_v)(i / FPS).save(os.path.join(out, f'{i:05d}.jpg'), quality=92)
    if a == 0: json.dump({'total': total, 'frames': n, 'dur': DUR, 'vo': VO, 'vdur': VDUR}, open(os.path.join(WORK, f'timing_{MODE}.json'), 'w'))
