"""The film's timeline, camera paths and exploded-view offsets as plain maths (no bpy), shared by render.py (inside Blender) and
compose.py (outside), so particles and labels drawn in 2D land exactly on the 3D render.
Beats: 1 cold open · 2 ceiling opens · 3 exploded build · 4 without a ventilated kit · 5 with the kit · 6 protection · 7 hero end.
Beats 1, 6 and 7 are one CAD still each, pushed in 2D; every other frame is rendered at 30 fps (render_hq.py)."""
import json, math, os

FPS = 30
MIN = [4.5, 7.5, 10.0, 10.0, 12.5, 6.0, 7.5]          # floor for each beat (s); the voice can lengthen it
STEP = [0, 2, 2, 4, 3, 0, 0]                          # render every STEP-th frame; 0 = one high-quality still moved in 2D (zoom2d)
LEAD = [0.4, 0.6, 0.4, 0.5, 0.5, 0.4, 0.6]            # seconds of picture before the voice starts

def timeline(vo_lengths):
    d = [max(m, l + lead + 0.6) for m, l, lead in zip(MIN, vo_lengths, LEAD)]
    start = [0.0]
    for x in d[:-1]: start.append(start[-1] + x)
    return {'dur': d, 'start': start, 'total': sum(d), 'frames': int(round(sum(d) * FPS))}

def ease(u): u = min(1, max(0, u)); return u * u * (3 - 2 * u)
def ease2(u): u = min(1, max(0, u)); return u * u * u * (u * (6 * u - 15) + 10)
def lerp(a, b, u): return [x + (y - x) * u for x, y in zip(a, b)]

def beat_at(T, t):
    for i in range(len(T['dur']) - 1, -1, -1):
        if t >= T['start'][i]: return i, (t - T['start'][i]) / T['dur'][i]
    return 0, 0.0

# ---- camera: (location, target, lens) per beat as a function of u in 0..1 ----
def cam(T, t):
    b, u = beat_at(T, t)
    if b == 0:   # cold open: from below the glowing heater (a still; the push-in is done in 2D, see zoom2d)
        return (0.75, -1.70, -1.30), (0.02, 0.02, -0.05), 30
    if b == 1:   # the section plane sweeps the front half away, then the camera rises past the cut to a 3/4 section
        e = ease2(u); m = (-0.35, -1.95, -0.40)
        a = lerp((0.55, -1.25, -1.05), m, e); c = lerp(m, (-0.95, -1.50, 0.42), e); loc = lerp(a, c, e)
        return loc, lerp((0.0, 0.0, 0.0), (0.0, 0.0, 0.07), e), 32 + 4 * e
    if b == 2:   # slow orbit around the exploded kit, mid-grey studio, from slightly above so the fans read 3/4
        a = math.radians(-118 + 34 * ease(u)); r = 3.25
        return (-0.18 + r * math.cos(a), r * math.sin(a), 1.05 - 0.25 * ease(u)), (-0.18, 0.0, 0.02), 31
    if b == 3:   # without a kit: front section from slightly above, slow dolly along the cavity
        e = ease(u); return lerp((-0.62, -1.18, 0.30), (0.20, -1.05, 0.34), e), lerp((-0.30, 0.0, 0.09), (0.25, 0.0, 0.10), e), 36
    if b == 4:   # with the kit: follow the air from the inlet end to the outlet end
        e = ease(u); x = -0.78 + 1.42 * e
        return (x + 0.06, -0.92, 0.17 - 0.05 * math.sin(math.pi * e)), (x + 0.14, 0.0, 0.07), 34
    if b == 5:   # protection: the terminal box and the over-temperature cut-out (still + 2D push)
        return (-0.62, -0.78, 0.02), (-0.83, -0.01, 0.08), 38
    # hero end: below the finished ceiling at dusk (still + 2D pull back)
    return (0.95, -2.10, -1.45), (0.0, 0.0, -0.10), 28

def look_matrix(loc, target):
    """Rows of the camera rotation (camera X, Y, Z axes in world), -Z looking at target, world Z up (Blender's track -Z / up Y)."""
    f = [t - l for t, l in zip(target, loc)]; n = math.sqrt(sum(c * c for c in f)); f = [c / n for c in f]
    up = (0.0, 0.0, 1.0)
    r = [f[1] * up[2] - f[2] * up[1], f[2] * up[0] - f[0] * up[2], f[0] * up[1] - f[1] * up[0]]; n = math.sqrt(sum(c * c for c in r)); r = [c / n for c in r]
    u = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]]
    return r, u, [-c for c in f]

def project(T, t, p, W, H, sensor=36.0):
    loc, target, lens = cam(T, t); X, Y, Z = look_matrix(loc, target)
    d = [p[i] - loc[i] for i in range(3)]
    xc = sum(d[i] * X[i] for i in range(3)); yc = sum(d[i] * Y[i] for i in range(3)); zc = sum(d[i] * Z[i] for i in range(3))
    if zc >= -1e-4: return None
    k = (lens / (sensor / 2)) / -zc
    return (W / 2 + xc * k * W / 2, H / 2 - yc * k * W / 2, -zc)

def zoom2d(T, t):
    """2D camera move for the still beats: scale about the frame centre (1 = the render as is)."""
    b, u = beat_at(T, t)
    if b == 0: return 1.0 + 0.16 * ease(u)
    if b == 5: return 1.0 + 0.12 * ease(u)
    if b == 6: return 1.16 - 0.16 * ease(u)
    return 1.0

# ---- section clip (world y below which surfaces are cut away) ----
def ycut(T, t):
    b, u = beat_at(T, t)
    if b in (0, 6): return -9.0
    if b == 1: return -2.3 + 2.3 * ease(min(1, max(0, (u - 0.08) / 0.5)))
    if b == 5: return -0.035
    return 0.0

# ---- exploded view: offset (m) of each part category over beat 3 ----
EXPLODE = {'fan': (0, 0, 0.66), 'fanbr': (0, 0, 0.66), 'chassis': (0, 0, 0.30), 'inlet': (-0.17, 0, 0.30), 'outlet': (0.17, 0, 0.30),
           'steel': (0, 0, 0.30), 'barrier': (0, 0, -0.16), 'trim': (0, 0, -0.40), 'heater': (0, 0, -0.68), 'fascia': (0, 0, -0.68),
           'reflector': (0, 0, -0.68), 'element': (0, 0, -0.68), 'term': (-0.34, 0, 0.02), 'cutout': (-0.34, 0, 0.02)}
def explode(T, t):
    b, u = beat_at(T, t)
    if b != 2: return 0.0
    if u < 0.30: return ease2(u / 0.30)
    if u < 0.74: return 1.0
    return 1.0 - ease2((u - 0.74) / 0.26)

# the order parts lock back in on reassembly (used for the click cues): fraction of beat 3
ASSEMBLY_CLICKS = [0.80, 0.84, 0.88, 0.92, 0.96]

def load_timeline(work):
    return json.load(open(os.path.join(work, 'timeline.json')))
