"""Render the 3D frames of the premium recess-kit film (Blender Cycles, CPU, denoised).
Run inside the CAD venv from the work directory (not from scratchpad/cad, whose inspect.py shadows the stdlib):
  python render.py WORK [first_frame last_frame]
Writes WORK/r/NNNNN.jpg for every rendered frame (every frame in fast beats, every 2nd in slow ones; compose.py blends the gaps)."""
import sys, os, math, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import bpy
from mathutils import Matrix, Vector
import scene, shots

WORK = sys.argv[1]; T = shots.load_timeline(WORK)
F0 = int(sys.argv[2]) if len(sys.argv) > 3 else 0; F1 = int(sys.argv[3]) if len(sys.argv) > 3 else T['frames']
GLB = os.environ.get('GLB', os.path.join(WORK, '..', 'cad', 'glb', '6kW heater and recess kit.glb'))
sc, M, meshes = scene.setup(GLB, os.path.join(WORK, 'nauo.json'), (960, 540), 4)
for o in meshes:                                    # detail never visible at this size: keep renders fast
    if len(o.data.vertices) > 20000:
        m = o.modifiers.new('d', 'DECIMATE'); m.ratio = 0.25
        bpy.context.view_layer.objects.active = o; bpy.ops.object.modifier_apply(modifier='d')
sc.render.use_persistent_data = True; sc.cycles.max_bounces = 3
co = scene.camera(); clip = bpy.data.node_groups['Clip'].nodes['ycut'].outputs[0]
glow = sc.objects['glow']; glow.data.energy = 0
warm = bpy.data.lights.new('warm', 'POINT'); warm.color = (1.0, 0.45, 0.18); warm.shadow_soft_size = 0.4
wo = bpy.data.objects.new('warm', warm); sc.collection.objects.link(wo); wo.location = (0.0, -0.15, -0.45)
studio = [sc.objects[n] for n in ('key', 'fill', 'rim')]
EL = M['element'].node_tree.nodes['Principled BSDF']
TINT = [M[k].node_tree.nodes['Principled BSDF'] for k in ('timber', 'deck')]
CUT = M['cutout'].node_tree.nodes['Principled BSDF']
KIT = {'trim', 'barrier', 'chassis', 'inlet', 'outlet', 'fan', 'fanbr', 'term', 'cutout'}
def kitpart(o):
    if o['cat'] in KIT: return True
    if o['cat'] == 'steel':          # loose fixings: kit if they sit outside the heater body
        h = o['home']; return h[2] > 0.06 or abs(h[0]) > 0.66
    return False
# narrow ceiling infill so that, without the kit, the cut-out is only the heater's width
infill = [scene.box('infill%d' % s, -0.775, 0.775, *(sorted((s * 0.08, s * 0.127))), 0, scene.B, M['board']) for s in (-1, 1)]
infill += [scene.box('infillE%d' % s, *(sorted((s * 0.64, s * 0.775))), -0.08, 0.08, 0, scene.B, M['board']) for s in (-1, 1)]
for o in infill: o.hide_render = True

_last = {}
HI = [False]
def setv(key, sock, v):
    if _last.get(key) != v: sock.default_value = v; _last[key] = v

def frame(f):
    t = f / shots.FPS; b, u = shots.beat_at(T, t)
    loc, target, lens = shots.cam(T, t); X, Y, Z = shots.look_matrix(loc, target)
    co.matrix_world = Matrix(((X[0], Y[0], Z[0], loc[0]), (X[1], Y[1], Z[1], loc[1]), (X[2], Y[2], Z[2], loc[2]), (0, 0, 0, 1)))
    co.data.lens = lens; co.data.dof.focus_distance = (Vector(target) - Vector(loc)).length
    co.data.dof.aperture_fstop = 2.8 if b in (0, 6) else 5.6
    setv('clip', clip, shots.ycut(T, t))
    night = b in (0, 6)
    if _last.get('night') != night:
        scene.set_world(night); _last['night'] = night
        for l in studio: l.hide_render = night
        warm.energy = 12 if night else 0
        sc.cycles.samples = 4 if night else 3
        EL.inputs['Emission Strength'].default_value = 11 if night else 8
        EL.inputs['Emission Color'].default_value = (1.0, 0.11, 0.02, 1)
    if HI[0]: sc.cycles.samples = 14
    tint = 0.0
    if b == 3: tint = 1.3 * shots.ease(min(1, max(0, (u - 0.25) / 0.6)))
    tint = round(tint, 2)
    for i, n in enumerate(TINT): setv('tint%d' % i, n.inputs['Emission Strength'], tint)
    setv('cut', CUT.inputs['Emission Strength'], round(6.0 * shots.ease(min(1, u * 2.5)), 2) if b == 5 else 0.0)
    e = shots.explode(T, t)
    if _last.get('e') != e or _last.get('b') != b:
      _last['e'] = e; _last['b'] = b
      for o in meshes:
        off = shots.EXPLODE.get(o['cat'], (0, 0, 0))
        if o['cat'] == 'steel' and not kitpart(o): off = shots.EXPLODE['heater']
        h = o['home']; o.location = (h[0] + off[0] * e, h[1] + off[1] * e, h[2] + off[2] * e)
        hid = (b == 3 and kitpart(o))
        if o.hide_render != hid: o.hide_render = hid
    if _last.get('vis') != b:
        _last['vis'] = b
        for o in infill: o.hide_render = (b != 3)
        for n in ('boardL', 'boardR', 'boardF', 'boardBk', 'joist+1', 'joist-1', 'deck', 'fascia', 'backwall', 'floor', 'tableTop'):
            sc.objects[n].hide_render = (b == 2)                # the exploded view is a clean studio shot
        for o in sc.objects:
            if o.name.startswith('leg'): o.hide_render = (b == 2)
    sc.render.filepath = os.path.join(WORK, 'r', '%05d.jpg' % f)
    bpy.ops.render.render(write_still=True)

os.makedirs(os.path.join(WORK, 'r'), exist_ok=True)
sc.render.resolution_x, sc.render.resolution_y = (800, 450)
if os.environ.get('PREVIEW'):                       # PREVIEW="t1,t2,..." seconds -> WORK/p/<t>.jpg
    os.makedirs(os.path.join(WORK, 'p'), exist_ok=True)
    for s in os.environ['PREVIEW'].split(','):
        frame(int(float(s) * shots.FPS)); os.replace(sc.render.filepath, os.path.join(WORK, 'p', '%05.1f.jpg' % float(s)))
    sys.exit(0)
for f in range(F0, F1):
    b, _ = shots.beat_at(T, f / shots.FPS)
    first = f == 0 or shots.beat_at(T, (f - 1) / shots.FPS)[0] != b
    last = f == T['frames'] - 1 or shots.beat_at(T, (f + 1) / shots.FPS)[0] != b
    if shots.STEP[b] == 0:                          # one high-quality still for the beat, 1920 x 1080
        if not first or os.path.exists(os.path.join(WORK, 'r', '%05d.jpg' % f)): continue
        sc.render.resolution_x, sc.render.resolution_y = (1920, 1080); _last.pop('night', None)
        HI[0] = True; frame(f); HI[0] = False
        sc.render.resolution_x, sc.render.resolution_y = (800, 450); _last.pop('night', None)
        continue
    if f % shots.STEP[b] and not last: continue
    if os.path.exists(os.path.join(WORK, 'r', '%05d.jpg' % f)): continue
    frame(f)
print('done', F0, F1)
