"""Full-quality CAD renders for the recess-kit film (owner, 21 Nov 2026: "not pixelated or smudged… ensure CAD is used").
Every product part on screen is the real CAD (6 kW heater and low-clearance recess kit). Cameras are locked off per beat, so each beat
is one clean plate rendered natively at 2240 x 1260 (compose.py only ever reduces it); only moving CAD parts are rendered per frame:
  - the exploding kit (beat 3): every explode frame at 1920 x 1080 (reassembly reuses them in reverse);
  - the Noctua impellers (beat 5): split from their frames and spun about each fan's own axis, rendered in small border regions over
    the plate (spin-up frames + the 3 frames of a blade-pitch cycle at steady speed), with motion blur.
Aux maps (world X, world Y and a part category, Raw colour, 16-bit PNG) drive the 2D section wipe and the cavity tint.
Cycles + OpenImageDenoise (albedo + normal), adaptive sampling, fixed seed, PNG. Restartable: existing outputs are skipped.
  python render_hq.py WORK [job ...]        jobs: plates aux explode fans   (default: all)  -> WORK/r2/…"""
import sys, os, math, json, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy, numpy as np
from mathutils import Matrix, Vector, Quaternion
from bpy_extras.object_utils import world_to_camera_view
import scene, shots

WORK = sys.argv[1]; JOBS = sys.argv[2:] or ['plates', 'aux', 'explode', 'fans']
FPS = shots.FPS
GLB = os.environ.get('GLB', os.path.join(WORK, '..', 'cad', 'glb', '6kW heater and recess kit.glb'))
OUT = os.environ.get('R2') or os.path.join(WORK, 'r2'); os.makedirs(OUT, exist_ok=True)
LOG = os.path.join(OUT, 'times.jsonl')
sc, M, meshes = scene.setup(GLB, os.path.join(WORK, 'nauo.json'), (1920, 1080), 48)
c = sc.cycles
c.use_adaptive_sampling = True; c.adaptive_threshold = float(os.environ.get('NOISE', '0.025')); c.adaptive_min_samples = 16
c.samples = int(os.environ.get('SAMPLES', '64'))
c.use_denoising = True; c.denoiser = 'OPENIMAGEDENOISE'; c.denoising_input_passes = 'RGB_ALBEDO_NORMAL'
try: c.denoising_prefilter = 'ACCURATE'
except Exception: pass
c.seed = 7; c.use_animated_seed = False
c.max_bounces = 4; c.diffuse_bounces = 2; c.glossy_bounces = 3; c.transmission_bounces = 2; c.transparent_max_bounces = 12
c.sample_clamp_indirect = 8.0
sc.render.threads_mode = 'FIXED'; sc.render.threads = int(os.environ.get('THREADS', '3'))
sc.render.use_persistent_data = True
sc.render.image_settings.file_format = 'PNG'; sc.render.image_settings.color_depth = '8'; sc.render.image_settings.compression = 15
sc.render.use_motion_blur = False; sc.render.motion_blur_shutter = 0.5

for o in meshes:                                        # coil meshes: 800k vertices behind the grille
    if len(o.data.vertices) > 120000 and o['cat'] == 'element':
        m = o.modifiers.new('d', 'DECIMATE'); m.ratio = 0.35
        bpy.context.view_layer.objects.active = o; bpy.ops.object.modifier_apply(modifier='d')

# ---------- Noctua fans: split each impeller from its frame (real CAD geometry); fan centre and axis ----------
M['noctua_frame'] = scene.mat('noctua_frame', (0.62, 0.52, 0.40), 0.55)
M['noctua_blade'] = scene.mat('noctua_blade', (0.26, 0.15, 0.10), 0.45)
FANS = []                                               # dicts: cen, axis, parts (frame pieces), imp (impeller pieces)
for o in [o for o in meshes if o['cat'] == 'fan']:
    bpy.ops.object.select_all(action='DESELECT'); o.select_set(True); bpy.context.view_layer.objects.active = o
    bpy.ops.object.mode_set(mode='EDIT'); bpy.ops.mesh.select_all(action='SELECT'); bpy.ops.mesh.separate(type='LOOSE')
    bpy.ops.object.mode_set(mode='OBJECT')
    parts = list(bpy.context.selected_objects)
    allv = np.concatenate([np.array([p.matrix_world @ v.co for v in p.data.vertices]) for p in parts])
    cen = (allv.min(0) + allv.max(0)) / 2
    w, V = np.linalg.eigh(np.cov((allv - cen).T)); axis = V[:, 0]
    if axis[2] < 0: axis = -axis
    F = {'cen': Vector(cen), 'axis': Vector(axis), 'parts': [], 'imp': []}
    for p in parts:
        pv = np.array([p.matrix_world @ v.co for v in p.data.vertices]); d = pv - cen
        rad = np.linalg.norm(d - np.outer(d @ axis, axis), axis=1).max()
        p['cat'] = 'fan'; p['home'] = list(p.location); p.data.materials.clear()
        if rad < 0.069 and len(pv) > 200: p.data.materials.append(M['noctua_blade']); F['imp'].append(p)
        else: p.data.materials.append(M['noctua_frame']); F['parts'].append(p)
        if p not in meshes: meshes.append(p)
    FANS.append(F)
for o in meshes:                                        # brackets near a fan move (and turn) with it
    if o['cat'] == 'fanbr':
        h = Vector(o['home']); near = min(FANS, key=lambda F: (F['cen'] - h).length)
        if (near['cen'] - h).length < 0.12: near['parts'].append(o)
HOME = {o.name: o.matrix_world.copy() for o in meshes}
FANOBJ = {o.name for F in FANS for o in F['parts'] + F['imp']}
print('fans', [(round(F['cen'].x, 3), len(F['imp']), len(F['parts'])) for F in FANS], flush=True)

co = scene.camera(); clip = bpy.data.node_groups['Clip'].nodes['ycut'].outputs[0]
sc.objects['glow'].data.energy = 0
warm = bpy.data.lights.new('warm', 'POINT'); warm.color = (1.0, 0.45, 0.18); warm.shadow_soft_size = 0.4
wo = bpy.data.objects.new('warm', warm); sc.collection.objects.link(wo); wo.location = (0.0, -0.15, -0.45)
studio = [sc.objects[n] for n in ('key', 'fill', 'rim')]
for l in studio: l.data['e0'] = l.data.energy
EL = M['element'].node_tree.nodes['Principled BSDF']
CUT = M['cutout'].node_tree.nodes['Principled BSDF']
STEEL = [M[k].node_tree.nodes['Principled BSDF'] for k in ('steel', 'inlet', 'outlet')]
for n in (M['timber'], M['deck'], M['insul']): n.node_tree.nodes['Principled BSDF'].inputs['Emission Strength'].default_value = 0
KIT = {'trim', 'barrier', 'chassis', 'inlet', 'outlet', 'fan', 'fanbr', 'term', 'cutout'}
def kitpart(o):
    if o['cat'] in KIT: return True
    if o['cat'] == 'steel':
        h = o['home']; return h[2] > 0.06 or abs(h[0]) > 0.66
    return False
infill = [scene.box('infill%d' % s, -0.775, 0.775, *(sorted((s * 0.08, s * 0.127))), 0, scene.B, M['board']) for s in (-1, 1)]
infill += [scene.box('infillE%d' % s, *(sorted((s * 0.64, s * 0.775))), -0.08, 0.08, 0, scene.B, M['board']) for s in (-1, 1)]
for o in infill: o.hide_render = True
rim2 = bpy.data.lights.new('rim2', 'AREA'); rim2.energy = 0; rim2.size = 2.5; rim2.color = (0.95, 0.97, 1.0)
r2o = bpy.data.objects.new('rim2', rim2); sc.collection.objects.link(r2o); r2o.location = (-0.6, 2.2, 1.6); r2o.rotation_euler = (math.radians(-50), 0, math.radians(195))
STUDIO_OFF = ('boardL', 'boardR', 'boardF', 'boardBk', 'joist+1', 'joist-1', 'deck', 'fascia', 'backwall', 'floor', 'tableTop')

def fan_matrix(F, e, ang, cam_loc):
    """World transform for a fan's parts: spin (impeller only) about the axis, turn to face the camera as it explodes, translate."""
    off = Vector(shots.EXPLODE['fan']) * e
    face = Quaternion()
    if e > 0:
        tgt = (Vector(cam_loc) - (F['cen'] + off)).normalized()
        face = Quaternion().slerp(F['axis'].rotation_difference(tgt), e)
    def M_(spin):
        R = face.to_matrix().to_4x4() @ Quaternion(F['axis'], spin).to_matrix().to_4x4()
        return Matrix.Translation(F['cen'] + off) @ R @ Matrix.Translation(-F['cen'])
    return M_(0.0), M_(ang)

under = bpy.data.lights.new('under', 'AREA'); under.energy = 0; under.size = 4.0; under.color = (1.0, 0.95, 0.88)
uo = bpy.data.objects.new('under', under); sc.collection.objects.link(uo); uo.location = (0.4, -1.4, -2.2); uo.rotation_euler = (math.radians(180), 0, 0)
EL_BASE = EL.inputs['Base Color'].default_value[:]
FR = [1000]
def setup_frame(b, e=0.0, spin=None, on=True, ycut=None, camb=None, blur=False):
    """Pose the scene for beat b: explode amount e (EXPL), fan angles spin=(prev, now, next) (KIT), heater on/off."""
    loc, target, lens = shots.cam_b(b if camb is None else camb); X, Y, Z = shots.look_matrix(loc, target)
    co.matrix_world = Matrix(((X[0], Y[0], Z[0], loc[0]), (X[1], Y[1], Z[1], loc[1]), (X[2], Y[2], Z[2], loc[2]), (0, 0, 0, 1)))
    co.data.lens = lens; co.data.dof.focus_distance = (Vector(target) - Vector(loc)).length
    bright = b in (shots.OPEN, shots.END); studio2 = b == shots.EXPL
    co.data.dof.aperture_fstop = 4.0 if bright else (11.0 if studio2 else 5.6)
    clip.default_value = shots.ycut_b(b) if ycut is None else ycut
    bg = sc.world.node_tree.nodes['Background']
    if b == shots.OPEN: bg.inputs[0].default_value = (0.80, 0.84, 0.92, 1); bg.inputs[1].default_value = float(os.environ.get('W0', '0.55'))
    elif b == shots.END: bg.inputs[0].default_value = (0.42, 0.40, 0.55, 1); bg.inputs[1].default_value = float(os.environ.get('W7', '0.45'))
    elif studio2: bg.inputs[0].default_value = (1.0, 1.0, 1.0, 1); bg.inputs[1].default_value = 0.35
    else: scene.set_world(False)
    sc.render.film_transparent = studio2; sc.render.image_settings.color_mode = 'RGBA' if studio2 else 'RGB'                # studio white is laid in 2D behind the parts (clean #FFF, no grey cast)
    for l in studio: l.hide_render = bright; l.data.energy = l.data['e0'] * (0.8 if studio2 else 1.0)
    under.energy = (float(os.environ.get('U0', '160')) if b == shots.OPEN else float(os.environ.get('U7', '90'))) if bright else 0
    under.color = (1.0, 0.95, 0.88) if b == shots.OPEN else (1.0, 0.86, 0.72)
    rim2.energy = 420 if studio2 else 0
    warm.energy = (5 if b == shots.OPEN else 8) if (bright and on) else 0
    # medium-wave look: an even, deep orange behind the grille, the elements brightest; strength kept low so AgX never whitens it
    EL.inputs['Emission Strength'].default_value = 0.0 if not on else (3.2 if bright else (1.8 if studio2 else 3.0))
    EL.inputs['Emission Color'].default_value = (1.0, 0.20, 0.035, 1)
    EL.inputs['Base Color'].default_value = EL_BASE if on else (0.16, 0.15, 0.15, 1)
    for s_ in STEEL:
        s_.inputs['Base Color'].default_value = ((0.34, 0.35, 0.37, 1) if studio2 else (0.55, 0.56, 0.57, 1))
        s_.inputs['Roughness'].default_value = 0.40 if studio2 else 0.32
    CUT.inputs['Emission Strength'].default_value = 6.0 if b == shots.PROT else 0.0
    HX = shots.heater_xf(e)
    for o in meshes:
        if o.name in FANOBJ: continue
        cat = o['cat'] if (o['cat'] != 'steel' or kitpart(o)) else 'heater'
        if cat in ('heater', 'fascia', 'reflector', 'element'):
            o.matrix_world = Matrix(HX) @ HOME[o.name]
        else:
            off = shots.EXPLODE.get(cat, (0, 0, 0)); h = o['home']
            o.location = (h[0] + off[0] * e, h[1] + off[1] * e, h[2] + off[2] * e)
        o.hide_render = (b == shots.NOKIT and kitpart(o))
    FR[0] += 5; sc.frame_set(FR[0])
    angs = spin or (0.0, 0.0, 0.0)
    for F in FANS:
        for o in F['parts'] + F['imp']:
            o.rotation_mode = 'QUATERNION'; o.hide_render = (b == shots.NOKIT)
        for k, ang in zip((-1, 0, 1), angs):
            if not blur and k != 0: continue
            Mf, Mi = fan_matrix(F, e, ang, loc)
            for o in F['parts'] + F['imp']:
                mw = (Mi if o in F['imp'] else Mf) @ HOME[o.name]; l_, r_, _ = mw.decompose()
                o.location = l_; o.rotation_quaternion = r_
                if blur: o.keyframe_insert('location', frame=FR[0] + k); o.keyframe_insert('rotation_quaternion', frame=FR[0] + k)
    sc.frame_set(FR[0])
    for o in infill: o.hide_render = (b != shots.NOKIT)
    for n in STUDIO_OFF: sc.objects[n].hide_render = studio2
    for o in sc.objects:
        if o.name.startswith('leg'): o.hide_render = studio2
    sc.render.use_motion_blur = blur
    return b

def render(path, res, border=None, tag=''):
    if os.path.exists(path): return
    sc.render.resolution_x, sc.render.resolution_y = res; sc.render.resolution_percentage = 100
    sc.render.use_border = border is not None; sc.render.use_crop_to_border = border is not None
    if border: sc.render.border_min_x, sc.render.border_max_x, sc.render.border_min_y, sc.render.border_max_y = border
    t0 = time.time(); sc.render.filepath = path; bpy.ops.render.render(write_still=True)
    dt = round(time.time() - t0, 1); print('rendered', os.path.basename(path), dt, 's', flush=True)
    open(LOG, 'a').write(json.dumps({'file': os.path.basename(path), 'kind': tag, 'secs': dt, 'at': time.time()}) + '\n')

PLATE = (2240, 1260)
O = shots
PLATES = [('P0OFF', dict(b=O.OPEN, on=False)), ('P0ON', dict(b=O.OPEN)), ('P1A', dict(b=O.CEIL, ycut=-9.0)), ('P1B', dict(b=O.CEIL, ycut=0.0)),
          ('P2', dict(b=O.EXPL, e=1.0)), ('P4N', dict(b=O.NOKIT)), ('P5K', dict(b=O.KIT)), ('P6', dict(b=O.PROT)),
          ('P6D', dict(b=O.PROT, camb='PROT_D')), ('P7', dict(b=O.END))]

# ---------- aux maps: world X, world Y, part category (Raw, 16-bit) ----------
CAT = {'cavity': 1.0, 'kit': 0.7, 'heater': 0.45, 'room': 0.2}
def aux_material(code):
    m = bpy.data.materials.new('aux%.2f' % code); m.use_nodes = True; nt = m.node_tree; nt.nodes.clear()
    geo = nt.nodes.new('ShaderNodeNewGeometry'); sep = nt.nodes.new('ShaderNodeSeparateXYZ'); nt.links.new(geo.outputs['Position'], sep.inputs[0])
    mx = nt.nodes.new('ShaderNodeMapRange'); mx.inputs[1].default_value = -2.5; mx.inputs[2].default_value = 2.5; nt.links.new(sep.outputs['X'], mx.inputs[0])
    my = nt.nodes.new('ShaderNodeMapRange'); my.inputs[1].default_value = -2.5; my.inputs[2].default_value = 3.5; nt.links.new(sep.outputs['Y'], my.inputs[0])
    cmb = nt.nodes.new('ShaderNodeCombineXYZ'); nt.links.new(mx.outputs[0], cmb.inputs[0]); nt.links.new(my.outputs[0], cmb.inputs[1]); cmb.inputs[2].default_value = code
    em = nt.nodes.new('ShaderNodeEmission'); nt.links.new(cmb.outputs[0], em.inputs[0]); em.inputs[1].default_value = 1.0
    gn = nt.nodes.new('ShaderNodeGroup'); gn.node_tree = bpy.data.node_groups['Clip']; nt.links.new(em.outputs[0], gn.inputs[0])
    out = nt.nodes.new('ShaderNodeOutputMaterial'); nt.links.new(gn.outputs[0], out.inputs['Surface'])
    return m
def aux_render(name, **kw):
    path = os.path.join(OUT, name + '_aux.png')
    if os.path.exists(path): return
    setup_frame(**kw)
    keep = {o.name: list(o.data.materials) for o in sc.objects if o.type == 'MESH'}
    mats = {k: aux_material(v) for k, v in CAT.items()}
    for o in sc.objects:
        if o.type != 'MESH': continue
        n = o.name; k = 'room'
        if n.startswith(('joist', 'deck', 'insul')): k = 'cavity'
        elif 'cat' in o.keys() and o['cat'] in ('heater', 'fascia', 'reflector', 'element'): k = 'heater'
        elif 'cat' in o.keys() and (o['cat'] in KIT or (o['cat'] == 'steel' and kitpart(o))): k = 'kit'
        o.data.materials.clear(); o.data.materials.append(mats[k])
    vs = (sc.view_settings.view_transform, sc.view_settings.look); s0 = (c.samples, c.use_denoising, c.use_adaptive_sampling)
    sc.view_settings.view_transform = 'Raw'; sc.view_settings.look = 'None'; c.samples = 8; c.use_denoising = False; c.use_adaptive_sampling = False
    sc.render.image_settings.color_depth = '16'; sc.render.filter_size = 0.6; dof = co.data.dof.use_dof; co.data.dof.use_dof = False
    wbg = sc.world.node_tree.nodes['Background'].inputs[1].default_value; sc.world.node_tree.nodes['Background'].inputs[1].default_value = 0
    render(path, PLATE, tag='aux')
    sc.world.node_tree.nodes['Background'].inputs[1].default_value = wbg
    sc.view_settings.view_transform, sc.view_settings.look = vs; c.samples, c.use_denoising, c.use_adaptive_sampling = s0
    sc.render.image_settings.color_depth = '8'; sc.render.filter_size = 1.5; co.data.dof.use_dof = dof
    for o in sc.objects:
        if o.type == 'MESH' and o.name in keep:
            o.data.materials.clear()
            for m in keep[o.name]: o.data.materials.append(m)

def fan_border():
    """Normalised render borders around each fan (plate camera at time t), with a margin."""
    bd = []
    for F in FANS:
        pts = []
        for o in F['parts'] + F['imp']:
            for v in o.bound_box:
                p = world_to_camera_view(sc, co, o.matrix_world @ Vector(v)); pts.append((p.x, p.y))
        xs, ys = [p[0] for p in pts], [p[1] for p in pts]; m = 0.012
        bd.append((max(0, min(xs) - m), min(1, max(xs) + m), max(0, min(ys) - m * 1.8), min(1, max(ys) + m * 1.8)))
    return bd

ETA = os.path.join(WORK, 'ETA.txt')
def eta(stage, done, todo, secs):
    rate = secs / max(1, done)
    open(ETA, 'a').write('%s UTC  %s: %d done, %d to go, %.0f s each (measured) -> this stage ends about %s UTC\n' % (
        time.strftime('%H:%M', time.gmtime()), stage, done, todo, rate, time.strftime('%H:%M', time.gmtime(time.time() + rate * todo))))

if 'plates' in JOBS:
    only = os.environ.get('ONLY', '').split(',') if os.environ.get('ONLY') else None
    res = tuple(int(v) for v in os.environ['RES'].split('x')) if os.environ.get('RES') else PLATE
    for name, kw in PLATES:
        if only and name not in only: continue
        setup_frame(**kw); render(os.path.join(OUT, name + '.png'), res, tag='plate')
if 'aux' in JOBS:
    aux_render('P1A', b=O.CEIL, ycut=-9.0); aux_render('P4N', b=O.NOKIT); aux_render('P5K', b=O.KIT)
if 'explode' in JOBS:
    t0 = time.time(); n = 0
    for k in range(O.NX):
        p = os.path.join(OUT, 'X%03d.png' % k)
        if os.path.exists(p): continue
        setup_frame(b=O.EXPL, e=O.ease2(k / (O.NX - 1))); render(p, (1920, 1080), tag='explode'); n += 1
        if n % 8 == 1: eta('explode frames', n, O.NX - k - 1, time.time() - t0)
if 'fans' in JOBS:                                     # beat KIT: impeller regions over plate P5K, unique angles only
    setup_frame(b=O.KIT); B = fan_border(); json.dump(B, open(os.path.join(OUT, 'fan_borders.json'), 'w'))
    keys = O.fan_keys(900); t0 = time.time(); n = 0; todo = list(keys.items())
    for i, (key, j) in enumerate(todo):
        if all(os.path.exists(os.path.join(OUT, 'F%d_%s.png' % (q, key))) for q in range(len(B))): continue
        a3 = tuple(O.spin_angle_local((j + d) / FPS) for d in (-1, 0, 1))
        setup_frame(b=O.KIT, spin=a3, blur=True)
        for q, bd in enumerate(B): render(os.path.join(OUT, 'F%d_%s.png' % (q, key)), PLATE, border=bd, tag='fan')
        n += 1
        if n % 6 == 1: eta('fan regions', n, len(todo) - i - 1, time.time() - t0)
print('jobs done', JOBS, flush=True)
