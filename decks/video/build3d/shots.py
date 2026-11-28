"""The film's timeline, cameras and exploded-view offsets as plain maths (no bpy), shared by render_hq.py (inside Blender) and
compose_hq.py (outside), so particles and labels drawn in 2D land exactly on the 3D render.
Beats (v4, owner's review 28 Nov 2026):
  0 OPEN   cold open, bright: the heater in its kit, OFF, switching ON as the first line lands
  1 CEIL   the ceiling opens (section sweep), the whole kit in a 7.5 in cavity
  2 EXPL   exploded build on a clean studio white
  3 APP    a shut-off time in the Bromic app (2D: Bromic's own app image, no CAD)
  4 NOKIT  without a ventilated kit (whole heater in section)
  5 KIT    with the kit (whole box in section, the real impellers spinning)
  6 PROT   built-in protection: the whole kit, with a detail inset of the terminal box
  7 END    hero end, the heater ON, bright dusk
Every camera is locked off (owner, 21 Nov 2026: solid, unsmudged frames): each beat is one native CAD plate (2240 x 1260, only ever
reduced) moved in 2D by zoom2d; only moving CAD parts are rendered per frame, and those renders are indexed by the beat's OWN state
(explode amount, fan angle), never by absolute frame numbers, so a new voice-over never forces a re-render."""
import json, math, os

FPS = 30
OPEN, CEIL, EXPL, APP, NOKIT, KIT, PROT, END = range(8)
NB = 8
MIN = [6.0, 7.0, 10.0, 7.5, 9.0, 14.0, 6.5, 10.0]    # floor for each beat (s); the voice can lengthen it
LEAD = [1.2, 0.6, 0.4, 0.5, 0.5, 0.5, 0.4, 0.8]      # seconds of picture before the voice starts (OPEN: the heater is seen OFF first)
TAIL = 0.6

def timeline(vo_lengths):
    """vo_lengths: per beat, the LONGEST of the versions' lines, so every version shares one picture."""
    d = [max(m, l + lead + TAIL) for m, l, lead in zip(MIN, vo_lengths, LEAD)]
    d[END] = max(d[END], vo_lengths[END] + LEAD[END] + 2.2)      # the end card holds after the last word
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

# ---- cameras: (location, target, lens) per beat (and the protection detail inset, 'PROT_D')
def cam_b(b):
    if b == OPEN:    # from below, a bright terrace ceiling: the black trim and grille read against a light board
        return (0.70, -1.75, -1.25), (0.0, 0.02, -0.02), 30
    if b == CEIL:    # 3/4 above the ceiling line, pulled back so the whole kit (both ends) and the 7.5 in dimension are in frame
        return (-1.25, -2.30, 0.62), (0.0, 0.0, 0.06), 30
    if b == EXPL:    # exploded kit on studio white, from the front and a little above so the fans read face-on
        a = math.radians(-100); r = 3.25
        return (-0.18 + r * math.cos(a), r * math.sin(a), 0.95), (-0.18, 0.0, 0.02), 31
    if b in (NOKIT, KIT):   # the whole box in section, both ends in frame (the owner's reference framing)
        return (0.0, -1.55, 0.16), (0.0, 0.0, 0.075), 30
    if b == PROT:    # the whole kit from the terminal-box end, section cut just in front of the cut-out
        return (-0.10, -1.75, 0.30), (-0.06, 0.0, 0.08), 30
    if b == 'PROT_D':  # detail for the inset: the terminal box and the over-temperature cut-out
        return (-0.62, -0.78, 0.02), (-0.83, -0.01, 0.08), 38
    if b == END:     # hero end, bright dusk from below
        return (0.95, -2.10, -1.45), (0.0, 0.0, -0.10), 28
    return cam_b(OPEN)

def cam(T, t): return cam_b(beat_at(T, t)[0])

def look_matrix(loc, target):
    """Rows of the camera rotation (camera X, Y, Z axes in world), -Z looking at target, world Z up (Blender's track -Z / up Y)."""
    f = [t - l for t, l in zip(target, loc)]; n = math.sqrt(sum(c * c for c in f)); f = [c / n for c in f]
    up = (0.0, 0.0, 1.0)
    r = [f[1] * up[2] - f[2] * up[1], f[2] * up[0] - f[0] * up[2], f[0] * up[1] - f[1] * up[0]]; n = math.sqrt(sum(c * c for c in r)); r = [c / n for c in r]
    u = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]]
    return r, u, [-c for c in f]

def project_cam(c, p, W, H, sensor=36.0):
    loc, target, lens = c; X, Y, Z = look_matrix(loc, target)
    d = [p[i] - loc[i] for i in range(3)]
    xc = sum(d[i] * X[i] for i in range(3)); yc = sum(d[i] * Y[i] for i in range(3)); zc = sum(d[i] * Z[i] for i in range(3))
    if zc >= -1e-4: return None
    k = (lens / (sensor / 2)) / -zc
    return (W / 2 + xc * k * W / 2, H / 2 - yc * k * W / 2, -zc)

def project(T, t, p, W, H, sensor=36.0): return project_cam(cam(T, t), p, W, H, sensor)

def zoom2d(T, t):
    """2D camera move on the locked-off plate: scale about the frame centre (1 = the render as is, never below 1)."""
    b, u = beat_at(T, t)
    if b == OPEN: return 1.0 + 0.12 * ease(u)
    if b == EXPL: return 1.0 + 0.06 * math.sin(math.pi * min(1, max(0, (u - EX_IN) / (EX_OUT - EX_IN))))
    if b == END: return 1.14 - 0.14 * ease(u)
    if b == APP: return 1.0
    return 1.0 + 0.05 * ease(u)

# ---- section clip (world y below which surfaces are cut away), per beat
def ycut_b(b):
    if b in (OPEN, EXPL, END, APP): return -9.0
    if b == PROT: return -0.035
    if b == KIT: return -0.08                             # just in front of the fans, so both fans show whole
    return 0.0
def ycut(T, t):
    b, u = beat_at(T, t)
    if b == CEIL: return -2.3 + 2.3 * ease(min(1, max(0, (u - 0.08) / 0.5)))
    return ycut_b(b)

# ---- exploded view: offset (m) of each part category
EXPLODE = {'fan': (0, -0.55, 0.55), 'fanbr': (0, -0.55, 0.55), 'chassis': (0, 0, 0.30), 'inlet': (-0.17, 0, 0.30), 'outlet': (0.17, 0, 0.30),
           'steel': (0, 0, 0.30), 'barrier': (0, 0, -0.16), 'trim': (0, 0, -0.40), 'heater': (0, 0, -0.68), 'fascia': (0, 0, -0.68),
           'reflector': (0, 0, -0.68), 'element': (0, 0, -0.68), 'term': (-0.34, 0, 0.02), 'cutout': (-0.34, 0, 0.02)}
EX_IN, EX_OUT = 0.21, 0.79                               # explode over u 0..0.21, hold, reassemble over 0.79..1 (same frames reversed)
NX = 64                                                  # explode renders, at evenly spaced progress k/(NX-1) (eased amount ease2)
def explode_progress(T, t):
    """Progress 0..1 through the explode move (before easing), or None outside the move (the hold is one plate)."""
    b, u = beat_at(T, t)
    if b != EXPL: return None
    if u < EX_IN: return u / EX_IN
    if u >= EX_OUT: return (1 - u) / (1 - EX_OUT)
    return None
def explode(T, t):
    b, u = beat_at(T, t)
    if b != EXPL: return 0.0
    p = explode_progress(T, t)
    return 1.0 if p is None else ease2(p)
def explode_index(T, t):
    p = explode_progress(T, t); return None if p is None else int(round(min(1, max(0, p)) * (NX - 1)))
HEATER_C = (0.0, 0.0, -0.01)
def heater_xf(e):
    """4x4 (row lists) moving the heater group: down by its explode offset and turned about its long axis so the grille faces the
    exploded-view camera (a rigid move of the CAD parts)."""
    th = math.radians(-112) * e; c, s = math.cos(th), math.sin(th); o = EXPLODE['heater']
    cx, cy, cz = HEATER_C; ty, tz = cy + o[1] * e, cz + o[2] * e
    return [[1, 0, 0, o[0] * e], [0, c, -s, ty - (c * cy - s * cz)], [0, s, c, tz - (s * cy + c * cz)], [0, 0, 0, 1]]
def heater_point(p, e):
    M = heater_xf(e); return tuple(sum(M[i][j] * v for j, v in enumerate((*p, 1))) for i in range(3))

ASSEMBLY_CLICKS = [0.82, 0.86, 0.90, 0.94, 0.98]

# ---- the fans in beat KIT, by the beat's own clock: spin up over SPINUP s, then exactly one blade pitch (2 pi / 7) every 3 frames
SPINUP = 0.8
STEADY = 2 * math.pi * 30 / 21
PITCH = 2 * math.pi / 7
def spin_angle_local(bt):
    if bt <= 0: return 0.0
    return STEADY * (bt * bt / (2 * SPINUP) if bt < SPINUP else bt - SPINUP / 2)
def fan_key(j):
    """Render key for local frame j of beat KIT: unique spin-up frames, then one of 3 steady angles."""
    if j <= int(round(SPINUP * FPS)): return 'u%03d' % j
    a = spin_angle_local(j / FPS); return 's%d' % (int(round((a % PITCH) / (PITCH / 3))) % 3)
def fan_keys(nframes):
    keys = {}
    for j in range(nframes): keys.setdefault(fan_key(j), j)
    return keys

def load_timeline(work):
    return json.load(open(os.path.join(work, 'timeline.json')))
