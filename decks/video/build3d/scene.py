"""Scene for the premium 3D recess-kit film: the real CAD (6 kW heater and low-clearance recess kit), a timber-joist ceiling with a
7.5 in cavity, materials, lights, a section-clip shader and the exploded-view rig. Imported by render.py inside Blender (bpy).
Geometry (metres, z up, x along the heater): ceiling board z 0..0.0127, cavity to 0.2032 (7.5 in), deck above; kit chassis
x -0.77..0.77 (INLET END at -x, next to the terminal box; OUTLET END at +x), fans near x = +/-0.59 at the box top, radiant barrier
z 0.033..0.073, trim x +/-0.812."""
import bpy, json, math, os, re
from mathutils import Vector, Matrix

HERE = os.path.dirname(os.path.abspath(__file__))
B, C = 0.0127, 0.1905; T = B + C                 # board, 7.5 in cavity, top of cavity
JY = 0.184                                       # joist inner faces (16 in centres, 14.5 in clear)

def setup(glb, nauo_json, res=(960, 540), samples=10):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=glb)
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'; sc.cycles.device = 'CPU'; sc.cycles.samples = samples; sc.cycles.use_denoising = True
    sc.cycles.max_bounces = 4; sc.cycles.transparent_max_bounces = 12; sc.cycles.caustics_reflective = False; sc.cycles.caustics_refractive = False
    sc.render.resolution_x, sc.render.resolution_y = res; sc.render.fps = 30
    sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Medium High Contrast'
    sc.render.image_settings.file_format = 'JPEG'; sc.render.image_settings.quality = 94
    names = json.load(open(nauo_json))
    cat = {}
    def classify(o, inherited):
        n = names.get(o.name.split('.')[0], '')
        c = inherited
        for pat, k in (('TRIM LCCRK 3-6', 'trim'), ('RADIANT BARRIER', 'barrier'), ('CHASSIS INLET END', 'inlet'), ('CHASSIS OUTLET END', 'outlet'),
                       ('CHASSIS (MAIN|SIDE)', 'chassis'), ('FLANGE', 'chassis'), ('FAN LCCRK SUB', 'fanbr'), ('Noctua', 'fan'), ('FAN (MOUNTING|TCS)', 'fanbr'),
                       ('T23B', 'fanbr'), ('TERMINAL BOX LCCRK|JUNCTION BOX|Cable Strain|CB16|CTSN|RECEPTACLE|SOCKET|GLAND', 'term'), ('80DEG', 'cutout'),
                       ('Tungsten Electric Assembly', 'heater'), ('Front Cover', 'fascia'), ('Reflector', 'reflector'), ('ELEMENT COIL|Quartz Tube', 'element'),
                       ('Element Support|Element Lock|Ceramic Element|End Plate', 'heater')):
            if re.search(pat, n): c = k; break
        cat[o.name] = c
        for ch in o.children: classify(ch, c)
    for o in list(sc.objects):
        if o.parent is None: classify(o, 'steel')
    # flatten: keep world transforms, drop parents, so every mesh can be offset on its own
    meshes = [o for o in sc.objects if o.type == 'MESH']
    for o in meshes:
        mw = o.matrix_world.copy(); o.parent = None; o.matrix_world = mw
    for o in [o for o in sc.objects if o.type == 'EMPTY']: bpy.data.objects.remove(o)
    M = materials()
    for o in meshes:
        k = cat.get(o.name, 'steel')
        o.data.materials.clear(); o.data.materials.append(M.get(k, M['steel']))
        o['cat'] = k; o['home'] = list(o.location)
    ceiling(M)
    lights()
    return sc, M, meshes

# ---------- materials (Tungsten look: satin powder coat, brushed stainless, deep-orange element) ----------
def clip_group():
    if 'Clip' in bpy.data.node_groups: return bpy.data.node_groups['Clip']
    g = bpy.data.node_groups.new('Clip', 'ShaderNodeTree')
    g.interface.new_socket('Shader', in_out='INPUT', socket_type='NodeSocketShader')
    g.interface.new_socket('Shader', in_out='OUTPUT', socket_type='NodeSocketShader')
    n = g.nodes; L = g.links
    gi = n.new('NodeGroupInput'); go = n.new('NodeGroupOutput')
    geo = n.new('ShaderNodeNewGeometry'); sep = n.new('ShaderNodeSeparateXYZ'); L.new(geo.outputs['Position'], sep.inputs[0])
    yc = n.new('ShaderNodeValue'); yc.name = 'ycut'; yc.outputs[0].default_value = -9
    lt = n.new('ShaderNodeMath'); lt.operation = 'LESS_THAN'; L.new(sep.outputs['Y'], lt.inputs[0]); L.new(yc.outputs[0], lt.inputs[1])
    tr = n.new('ShaderNodeBsdfTransparent'); mx = n.new('ShaderNodeMixShader')
    L.new(lt.outputs[0], mx.inputs[0]); L.new(gi.outputs[0], mx.inputs[1]); L.new(tr.outputs[0], mx.inputs[2]); L.new(mx.outputs[0], go.inputs[0])
    return g

def mat(name, col, rough=0.5, metal=0.0, coat=0.0, emit=None, es=0.0, aniso=0.0, clip=True):
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal
    b.inputs['Coat Weight'].default_value = coat
    if aniso: b.inputs['Anisotropic'].default_value = aniso
    if emit: b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = es
    if clip:
        out = nt.nodes['Material Output']; gn = nt.nodes.new('ShaderNodeGroup'); gn.node_tree = clip_group()
        nt.links.new(b.outputs[0], gn.inputs[0]); nt.links.new(gn.outputs[0], out.inputs['Surface'])
    return m

def materials():
    M = {}
    M['steel'] = mat('steel', (0.62, 0.63, 0.64), 0.32, 1.0, aniso=0.4)                 # 304 stainless, brushed
    M['chassis'] = M['steel']; M['inlet'] = mat('inlet', (0.60, 0.62, 0.66), 0.3, 1.0); M['outlet'] = mat('outlet', (0.66, 0.62, 0.60), 0.3, 1.0)
    M['trim'] = mat('trim', (0.050, 0.050, 0.054), 0.38, 0.0, 0.35)                     # black powder coat
    M['barrier'] = mat('barrier', (0.85, 0.86, 0.88), 0.18, 1.0)                        # bright radiant barrier
    M['fan'] = mat('fan', (0.16, 0.16, 0.17), 0.45, 0.0)
    M['fanbr'] = mat('fanbr', (0.55, 0.56, 0.58), 0.35, 1.0)
    M['term'] = mat('term', (0.22, 0.22, 0.23), 0.45, 0.2)
    M['cutout'] = mat('cutout', (0.75, 0.16, 0.08), 0.4, 0.0, emit=(1.0, 0.25, 0.08), es=0.0)
    M['heater'] = mat('heater', (0.050, 0.050, 0.054), 0.38, 0.0, 0.35)
    M['fascia'] = mat('fascia', (0.03, 0.03, 0.032), 0.5, 0.2, 0.2)
    M['reflector'] = mat('reflector', (0.9, 0.9, 0.9), 0.15, 1.0)
    M['element'] = mat('element', (0.25, 0.05, 0.03), 0.6, 0.0, emit=(1.0, 0.07, 0.045), es=0.0)
    M['board'] = mat('board', (0.90, 0.90, 0.89), 0.85)
    M['timber'] = mat('timber', (0.74, 0.55, 0.34), 0.75, emit=(1.0, 0.32, 0.08), es=0.0)
    M['deck'] = mat('deck', (0.55, 0.44, 0.32), 0.8, emit=(1.0, 0.32, 0.08), es=0.0)
    M['insul'] = mat('insul', (0.86, 0.78, 0.62), 0.95, emit=(1.0, 0.32, 0.08), es=0.0)
    M['floor'] = mat('floor', (0.62, 0.60, 0.57), 0.6, clip=False)
    M['beam'] = mat('beam', (0.20, 0.15, 0.11), 0.6)
    M['wall'] = mat('wall', (0.80, 0.78, 0.74), 0.85, clip=False)
    M['table'] = mat('table', (0.42, 0.30, 0.20), 0.5, clip=False)
    return M

def box(name, x0, x1, y0, y1, z0, z1, m):
    bpy.ops.mesh.primitive_cube_add(location=((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2))
    o = bpy.context.object; o.scale = ((x1 - x0) / 2, (y1 - y0) / 2, (z1 - z0) / 2); o.name = name; o.data.materials.append(m)
    o['cat'] = 'ceiling'; o['home'] = list(o.location); return o

def ceiling(M):
    X = 4.5; cx, cy = 0.775, 0.127; Y0, Y1 = -2.2, 3.0     # cut-out 61 x 10 in; the terrace roof runs to an open edge at y = -2.2
    box('boardL', -X, -cx, Y0, Y1, 0, B, M['board']); box('boardR', cx, X, Y0, Y1, 0, B, M['board'])
    box('boardF', -cx, cx, Y0, -cy, 0, B, M['board']); box('boardBk', -cx, cx, cy, Y1, 0, B, M['board'])
    box('fascia', -X, X, Y0 - 0.05, Y0, -0.28, T + 0.022, M['beam'])          # the roof edge beam at the open side
    box('backwall', -X, X, Y1, Y1 + 0.1, -2.4, T, M['wall'])
    box('boardPlug', -cx, cx, -cy, cy, 0, B, M['board']).hide_render = True   # the uncut ceiling for the cold open
    for s in (-1, 1):
        y0, y1 = (JY, JY + 0.038) if s > 0 else (-JY - 0.038, -JY)
        box('joist%+d' % s, -X, X, y0, y1, B, T, M['timber'])
    box('deck', -X, X, Y0, Y1, T, T + 0.022, M['deck'])
    box('insul', -X, X, Y0, Y1, T + 0.022, T + 0.16, M['insul']).hide_render = True
    box('floor', -6, 6, -6, 6, -2.40, -2.39, M['floor'])     # floor about 94 in below the ceiling
    box('tableTop', -0.75, 0.75, -0.55, 0.15, -1.66, -1.63, M['table'])
    for x in (-0.68, 0.68):
        for y in (-0.48, 0.08): box('leg', x - 0.025, x + 0.025, y - 0.025, y + 0.025, -2.39, -1.66, M['table'])

def lights():
    sc = bpy.context.scene
    w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True
    bg = w.node_tree.nodes['Background']; bg.inputs[0].default_value = (0.92, 0.92, 0.93, 1); bg.inputs[1].default_value = 0.9
    def area(name, e, size, loc, rot, col=(1, 1, 1)):
        l = bpy.data.lights.new(name, 'AREA'); l.energy = e; l.size = size; l.color = col
        o = bpy.data.objects.new(name, l); sc.collection.objects.link(o); o.location = loc; o.rotation_euler = rot; return o
    area('key', 260, 2.0, (-1.4, -1.8, 1.2), (math.radians(55), 0, math.radians(-38)))
    area('fill', 90, 3.0, (1.8, -1.4, -0.6), (math.radians(110), 0, math.radians(52)), (0.92, 0.95, 1.0))
    area('rim', 160, 1.5, (0.4, 1.6, 0.9), (math.radians(-60), 0, math.radians(170)))
    g = bpy.data.lights.new('glow', 'AREA'); g.energy = 0; g.size = 1.4; g.color = (1.0, 0.42, 0.16); g.shape = 'RECTANGLE'; g.size_y = 0.16
    o = bpy.data.objects.new('glow', g); sc.collection.objects.link(o); o.location = (0, 0, -0.05); o.rotation_euler = (math.radians(180), 0, 0)

def set_world(night):
    bg = bpy.context.scene.world.node_tree.nodes['Background']
    if night: bg.inputs[0].default_value = (0.10, 0.13, 0.24, 1); bg.inputs[1].default_value = 0.7
    else: bg.inputs[0].default_value = (0.92, 0.92, 0.93, 1); bg.inputs[1].default_value = 0.9

def camera():
    sc = bpy.context.scene
    cam = bpy.data.cameras.new('cam'); co = bpy.data.objects.new('cam', cam); sc.collection.objects.link(co); sc.camera = co
    cam.lens = 40; cam.clip_start = 0.01; cam.clip_end = 60; cam.dof.use_dof = True; cam.dof.aperture_fstop = 4.0
    return co

def look(co, loc, target, lens=None, focus=None):
    co.location = Vector(loc); d = Vector(target) - co.location
    co.rotation_euler = d.to_track_quat('-Z', 'Y').to_euler()
    if lens: co.data.lens = lens
    co.data.dof.focus_distance = focus if focus else d.length
