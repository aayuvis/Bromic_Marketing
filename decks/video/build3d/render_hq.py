"""Full-quality frames for the recess-kit film (owner, 21 Nov 2026: "not pixelated or smudged… ensure CAD is used").
Every product part is the real CAD (6 kW heater and low-clearance recess kit): the Noctua impellers are split from their frames and
spun about each fan's own axis (with motion blur). Every moving frame is rendered natively at 1920 x 1080, true 30 fps, Cycles with
OpenImageDenoise (albedo + normal), fixed seed, PNG; the three still beats are rendered once at 2240 x 1260 so their 2D push-in only
ever downsamples. Run inside the CAD venv from the work directory:
  python render_hq.py WORK [F0 F1]          frames -> WORK/r2/NNNNN.png (skips frames that exist: restartable)
  PREVIEW="t1,t2" python render_hq.py WORK  test frames -> WORK/p2/<t>.png"""
import sys, os, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy, bmesh, numpy as np
from mathutils import Matrix, Vector, Quaternion
import scene, shots

WORK = sys.argv[1]; T = shots.load_timeline(WORK)
F0 = int(sys.argv[2]) if len(sys.argv) > 3 else 0; F1 = int(sys.argv[3]) if len(sys.argv) > 3 else T['frames']
GLB = os.environ.get('GLB', os.path.join(WORK, '..', 'cad', 'glb', '6kW heater and recess kit.glb'))
SAMPLES = int(os.environ.get('SAMPLES', '48'))
sc, M, meshes = scene.setup(GLB, os.path.join(WORK, 'nauo.json'), (1920, 1080), SAMPLES)
c = sc.cycles
c.use_adaptive_sampling = True; c.adaptive_threshold = 0.02; c.adaptive_min_samples = 16
c.use_denoising = True; c.denoiser = 'OPENIMAGEDENOISE'; c.denoising_input_passes = 'RGB_ALBEDO_NORMAL'
try: c.denoising_prefilter = 'ACCURATE'
except Exception: pass
c.seed = 7; c.use_animated_seed = False                 # same noise pattern every frame: no denoiser shimmer
c.max_bounces = 4; c.diffuse_bounces = 2; c.glossy_bounces = 3; c.transmission_bounces = 2; c.transparent_max_bounces = 12
c.light_sampling_threshold = 0.01; c.sample_clamp_indirect = 8.0
sc.render.threads_mode = 'FIXED'; sc.render.threads = int(os.environ.get('THREADS', '4'))
sc.render.use_persistent_data = True
sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_depth = '8'; sc.render.image_settings.compression = 15
sc.render.use_motion_blur = True; sc.render.motion_blur_shutter = 0.5

for o in meshes:                                        # the coil meshes are 800k vertices hidden behind the grille
    if len(o.data.vertices) > 120000 and o['cat'] == 'element':
        m = o.modifiers.new('d', 'DECIMATE'); m.ratio = 0.35
        bpy.context.view_layer.objects.active = o; bpy.ops.object.modifier_apply(modifier='d')

# ---------- Noctua fans: split each impeller from its frame (real CAD geometry), find the fan axis ----------
M['noctua_frame'] = scene.mat('noctua_frame', (0.62, 0.52, 0.40), 0.55)          # Noctua beige frame
M['noctua_blade'] = scene.mat('noctua_blade', (0.26, 0.15, 0.10), 0.45)          # Noctua brown impeller
IMP = []                                                # (object, centre, axis, home matrix)
for o in [o for o in meshes if o['cat'] == 'fan']:
    bpy.ops.object.select_all(action='DESELECT'); o.select_set(True); bpy.context.view_layer.objects.active = o
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.mesh.separate(type='LOOSE')
    bpy.ops.object.mode_set(mode='OBJECT')
    parts = [p for p in bpy.context.selected_objects]
    allv = np.concatenate([np.array([p.matrix_world @ v.co for v in p.data.vertices]) for p in parts])
    cen = (allv.min(0) + allv.max(0)) / 2
    w, V = np.linalg.eigh(np.cov((allv - cen).T)); axis = V[:, 0]           # thinnest direction = the fan axis
    if axis[2] < 0: axis = -axis
    for p in parts:
        pv = np.array([p.matrix_world @ v.co for v in p.data.vertices]); d = pv - cen
        rad = np.linalg.norm(d - np.outer(d @ axis, axis), axis=1).max()
        p['cat'] = 'fan'; p['home'] = list(p.location); p.data.materials.clear()
        if rad < 0.069 and len(pv) > 200:              # the impeller (hub + 7 blades) sits inside the 140 mm frame
            p.data.materials.append(M['noctua_blade']); IMP.append((p, Vector(cen), Vector(axis), p.matrix_world.copy()))
            p.rotation_mode = 'QUATERNION'
        else:
            p.data.materials.append(M['noctua_frame'])
        if p not in meshes: meshes.append(p)
print('impellers', len(IMP), [round(x, 3) for x in IMP[0][2]] if IMP else None)

def spin_angle(t):
    """Impeller angle (rad): fans spin up at the start of beat 5 (with the kit) and keep turning to its end."""
    b, u = shots.beat_at(T, t)
    if b != 4: return 0.0
    bt = t - T['start'][4]; w = 2 * math.pi * 1.4         # 1.4 rev/s: readable blades with a soft blur at 1/60 s
    return w * (bt * bt / 3.2 if bt < 1.6 else bt - 0.8)

co = scene.camera(); clip = bpy.data.node_groups['Clip'].nodes['ycut'].outputs[0]
glow = sc.objects['glow']; glow.data.energy = 0
warm = bpy.data.lights.new('warm', 'POINT'); warm.color = (1.0, 0.45, 0.18); warm.shadow_soft_size = 0.4
wo = bpy.data.objects.new('warm', warm); sc.collection.objects.link(wo); wo.location = (0.0, -0.15, -0.45)
studio = [sc.objects[n] for n in ('key', 'fill', 'rim')]
EL = M['element'].node_tree.nodes['Principled BSDF']
TINT = [M[k].node_tree.nodes['Principled BSDF'] for k in ('timber', 'deck')]
CUT = M['cutout'].node_tree.nodes['Principled BSDF']
STEEL = [M[k].node_tree.nodes['Principled BSDF'] for k in ('steel', 'inlet', 'outlet')]
KIT = {'trim', 'barrier', 'chassis', 'inlet', 'outlet', 'fan', 'fanbr', 'term', 'cutout'}
def kitpart(o):
    if o['cat'] in KIT: return True
    if o['cat'] == 'steel':
        h = o['home']; return h[2] > 0.06 or abs(h[0]) > 0.66
    return False
infill = [scene.box('infill%d' % s, -0.775, 0.775, *(sorted((s * 0.08, s * 0.127))), 0, scene.B, M['board']) for s in (-1, 1)]
infill += [scene.box('infillE%d' % s, *(sorted((s * 0.64, s * 0.775))), -0.08, 0.08, 0, scene.B, M['board']) for s in (-1, 1)]
for o in infill: o.hide_render = True
# exploded view: a soft mid-grey studio and rim lights so dark parts separate from the background
rim2 = bpy.data.lights.new('rim2', 'AREA'); rim2.energy = 0; rim2.size = 2.5; rim2.color = (0.95, 0.97, 1.0)
r2o = bpy.data.objects.new('rim2', rim2); sc.collection.objects.link(r2o); r2o.location = (-0.6, 2.2, 1.6); r2o.rotation_euler = (math.radians(-50), 0, math.radians(195))

_last = {}
def setv(key, sock, v):
    if _last.get(key) != v: sock.default_value = v; _last[key] = v

def place_impellers(t, offset_of):
    for p, cen, axis, home in IMP:
        off = Vector(offset_of('fan'))
        for k, dt in ((-1, -1 / 30), (0, 0.0), (1, 1 / 30)):   # keyframes either side for motion blur
            R = Matrix.Translation(cen + off) @ Quaternion(axis, spin_angle(t + dt)).to_matrix().to_4x4() @ Matrix.Translation(-cen)
            mw = R @ home; loc, rot, _ = mw.decompose()
            p.location = loc; p.rotation_quaternion = rot
            p.keyframe_insert('location', frame=FR + k); p.keyframe_insert('rotation_quaternion', frame=FR + k)

FR = 1000
def frame(f, still=False):
    global FR
    t = f / shots.FPS; b, u = shots.beat_at(T, t)
    loc, target, lens = shots.cam(T, t); X, Y, Z = shots.look_matrix(loc, target)
    co.matrix_world = Matrix(((X[0], Y[0], Z[0], loc[0]), (X[1], Y[1], Z[1], loc[1]), (X[2], Y[2], Z[2], loc[2]), (0, 0, 0, 1)))
    co.data.lens = lens; co.data.dof.focus_distance = (Vector(target) - Vector(loc)).length
    co.data.dof.aperture_fstop = 2.8 if b in (0, 6) else (8.0 if b == 2 else 5.6)
    setv('clip', clip, shots.ycut(T, t))
    night = b in (0, 6); studio2 = b == 2
    if _last.get('mode') != (night, studio2):
        _last['mode'] = (night, studio2)
        scene.set_world(night)
        bg = sc.world.node_tree.nodes['Background']
        if studio2: bg.inputs[0].default_value = (0.42, 0.43, 0.45, 1); bg.inputs[1].default_value = 0.75
        for l in studio: l.hide_render = night
        rim2.energy = 420 if studio2 else 0
        warm.energy = 12 if night else 0
        EL.inputs['Emission Strength'].default_value = 7 if night else 5
        EL.inputs['Emission Color'].default_value = (1.0, 0.11, 0.02, 1)
        for s in STEEL: s.inputs['Base Color'].default_value = ((0.42, 0.43, 0.45, 1) if studio2 else (0.55, 0.56, 0.57, 1))
    tint = round(1.3 * shots.ease(min(1, max(0, (u - 0.25) / 0.6))), 2) if b == 3 else 0.0
    for i, n in enumerate(TINT): setv('tint%d' % i, n.inputs['Emission Strength'], tint)
    setv('cut', CUT.inputs['Emission Strength'], round(6.0 * shots.ease(min(1, u * 2.5)), 2) if b == 5 else 0.0)
    e = shots.explode(T, t)
    def offset_of(cat):
        o = shots.EXPLODE.get(cat, (0, 0, 0)); return (o[0] * e, o[1] * e, o[2] * e)
    if _last.get('e') != e or _last.get('b') != b:
        _last['e'] = e; _last['b'] = b
        for o in meshes:
            if any(o is p for p, *_ in IMP): continue
            cat = o['cat'] if (o['cat'] != 'steel' or kitpart(o)) else 'heater'
            off = offset_of(cat); h = o['home']; o.location = (h[0] + off[0], h[1] + off[1], h[2] + off[2])
            hid = (b == 3 and kitpart(o))
            if o.hide_render != hid: o.hide_render = hid
        for p, *_ in IMP: p.hide_render = (b == 3)
    FR += 3; sc.frame_set(FR)
    place_impellers(t, offset_of); sc.frame_set(FR)
    if _last.get('vis') != b:
        _last['vis'] = b
        for o in infill: o.hide_render = (b != 3)
        for n in ('boardL', 'boardR', 'boardF', 'boardBk', 'joist+1', 'joist-1', 'deck', 'fascia', 'backwall', 'floor', 'tableTop'):
            sc.objects[n].hide_render = (b == 2)
        for o in sc.objects:
            if o.name.startswith('leg'): o.hide_render = (b == 2)
    bpy.ops.render.render(write_still=True)

out = os.path.join(WORK, 'r2'); os.makedirs(out, exist_ok=True)
if os.environ.get('PREVIEW'):
    os.makedirs(os.path.join(WORK, 'p2'), exist_ok=True)
    for s in os.environ['PREVIEW'].split(','):
        f = int(float(s) * shots.FPS); b = shots.beat_at(T, f / shots.FPS)[0]
        if shots.STEP[b] == 0: sc.render.resolution_x, sc.render.resolution_y = (2240, 1260)
        else: sc.render.resolution_x, sc.render.resolution_y = (1920, 1080)
        sc.render.filepath = os.path.join(WORK, 'p2', '%05.1f.png' % float(s)); frame(f)
    sys.exit(0)
import time
t0 = time.time(); n = 0
for f in range(F0, F1):
    b, _ = shots.beat_at(T, f / shots.FPS)
    if shots.STEP[b] == 0:                              # still beats: one render at 2240 x 1260 (pushed in 2D, only ever reduced)
        s = int(round(T['start'][b] * shots.FPS))
        if f != s: continue
        p = os.path.join(out, 'S%d.png' % b)
        if os.path.exists(p): continue
        sc.render.resolution_x, sc.render.resolution_y = (2240, 1260); sc.render.filepath = p; frame(f)
        sc.render.resolution_x, sc.render.resolution_y = (1920, 1080); n += 1; continue
    p = os.path.join(out, '%05d.png' % f)
    if os.path.exists(p): continue
    sc.render.filepath = p; frame(f); n += 1
    print('frame', f, round((time.time() - t0) / n, 1), 's/frame', flush=True)
print('done', F0, F1, n, 'frames', round(time.time() - t0), 's')
