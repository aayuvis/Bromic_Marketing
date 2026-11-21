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

# ---- camera: (location, target, lens) per beat. Every camera is locked off (owner, 21 Nov 2026: solid, unsmudged frames): each beat
# is one native CAD render (a clean plate at 2240 x 1260, only ever reduced) moved in 2D by zoom2d; only the parts that move (the
# exploding kit, the spinning impellers) are rendered frame by frame.
EXPLODE_CAM = None
def cam(T, t):
    b, u = beat_at(T, t)
    if b == 0:   # cold open: from below the glowing heater
        return (0.75, -1.70, -1.30), (0.02, 0.02, -0.05), 30
    if b == 1:   # the ceiling opens: a 3/4 view above the ceiling line; the section plane sweeps the near half away
        return (-0.95, -1.50, 0.42), (0.0, 0.0, 0.07), 36
    if b == 2:   # exploded kit, mid-grey studio, from the front and a little above so the fans read face-on
        a = math.radians(-100); r = 3.25
        return (-0.18 + r * math.cos(a), r * math.sin(a), 0.95), (-0.18, 0.0, 0.02), 31
    if b == 3:   # without a kit: front section
        return (-0.25, -1.12, 0.32), (-0.02, 0.0, 0.095), 36
    if b == 4:   # with the kit: the whole box in section, both fans whole
        return (0.0, -1.55, 0.16), (0.0, 0.0, 0.075), 30
    if b == 5:   # protection: the terminal box and the over-temperature cut-out
        return (-0.62, -0.78, 0.02), (-0.83, -0.01, 0.08), 38
    return (0.95, -2.10, -1.45), (0.0, 0.0, -0.10), 28     # hero end at dusk

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
    """2D camera move on the locked-off plate: scale about the frame centre (1 = the render as is, never below 1)."""
    b, u = beat_at(T, t)
    if b == 0: return 1.0 + 0.16 * ease(u)
    if b == 2: return 1.0 + 0.07 * math.sin(math.pi * min(1, max(0, (u - EX_IN) / (EX_OUT - EX_IN))))
    if b == 6: return 1.16 - 0.16 * ease(u)
    return 1.0 + 0.08 * ease(u)

# ---- section clip (world y below which surfaces are cut away) ----
def ycut(T, t):
    b, u = beat_at(T, t)
    if b in (0, 2, 6): return -9.0                    # no section cut on the exterior shots or the exploded studio
    if b == 1: return -2.3 + 2.3 * ease(min(1, max(0, (u - 0.08) / 0.5)))
    if b == 5: return -0.035
    if b == 4: return -0.08                               # just in front of the fans, so both fans show whole
    return 0.0

# ---- exploded view: offset (m) of each part category over beat 3 ----
EXPLODE = {'fan': (0, -0.55, 0.55), 'fanbr': (0, -0.55, 0.55), 'chassis': (0, 0, 0.30), 'inlet': (-0.17, 0, 0.30), 'outlet': (0.17, 0, 0.30),
           'steel': (0, 0, 0.30), 'barrier': (0, 0, -0.16), 'trim': (0, 0, -0.40), 'heater': (0, 0, -0.68), 'fascia': (0, 0, -0.68),
           'reflector': (0, 0, -0.68), 'element': (0, 0, -0.68), 'term': (-0.34, 0, 0.02), 'cutout': (-0.34, 0, 0.02)}
EX_IN, EX_OUT = 0.21, 0.79                               # explode over u 0..0.21, hold (>= 2 s), reassemble over 0.79..1 (same frames reversed)
def explode(T, t):
    b, u = beat_at(T, t)
    if b != 2: return 0.0
    if u < EX_IN: return ease2(u / EX_IN)
    if u < EX_OUT: return 1.0
    return ease2((1 - u) / (1 - EX_OUT))
HEATER_C = (0.0, 0.0, -0.01)
def heater_xf(e):
    """4x4 (row lists) moving the heater group: down by its explode offset and turned about its long axis so the grille faces the
    exploded-view camera (a rigid move of the CAD parts)."""
    th = math.radians(-112) * e; c, s = math.cos(th), math.sin(th); o = EXPLODE['heater']
    cx, cy, cz = HEATER_C; ty, tz = cy + o[1] * e, cz + o[2] * e
    # T(c + off) . Rx(th) . T(-c)
    return [[1, 0, 0, o[0] * e], [0, c, -s, ty - (c * cy - s * cz)], [0, s, c, tz - (s * cy + c * cz)], [0, 0, 0, 1]]
def heater_point(p, e):
    M = heater_xf(e); return tuple(sum(M[i][j] * v for j, v in enumerate((*p, 1))) for i in range(3))

def explode_src_frame(T, f):
    """Reassembly reuses the explode frames in reverse (same locked camera): the rendered frame for frame f of beat 3."""
    s = int(round(T['start'][2] * FPS)); u = (f / FPS - T['start'][2]) / T['dur'][2]
    if u >= EX_OUT: return s + int(round((1 - u) * T['dur'][2] * FPS))
    return f
def explode_frames(T):
    s = int(round(T['start'][2] * FPS)); n = int(round(EX_IN * T['dur'][2] * FPS)); return list(range(s, s + n + 1))

# the order parts lock back in on reassembly (used for the click cues): fraction of beat 3
ASSEMBLY_CLICKS = [0.82, 0.86, 0.90, 0.94, 0.98]

def load_timeline(work):
    return json.load(open(os.path.join(work, 'timeline.json')))
