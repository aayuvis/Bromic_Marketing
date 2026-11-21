"""Studio product renders of Tungsten Smart-Heat Electric Series II from the real CAD (cad/tungsten-select/, converted to glb).
Usage (Blender's Python):  python render.py SHOTS.json SHOT_ID OUT.png [SCALE]
Each shot: heaters (glb, finish, mount ceiling|wall, offset, glow), camera (pos and target relative to the first heater's
face centre, lens, f-stop, focus 'logo'|'centre'|xyz), resolution. The mounting surface is a shadow catcher; the film is
transparent so compose.py lays the heater and its soft shadow on a studio sweep."""
import bpy, sys, json, math, mathutils
V = mathutils.Vector; M3 = mathutils.Matrix
args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else sys.argv[1:]
SH = json.load(open(args[0]))[args[1]]; OUT = args[2]; SCALE = float(args[3]) if len(args) > 3 else 1.0
GLB = '/tmp/claude-0/-home-user/0ea6ef7b-27b7-5460-ab43-18d94f10d5f1/scratchpad/cad/glb/'
bpy.ops.wm.read_factory_settings(use_empty=True); sc = bpy.context.scene

def principled(name, col, rough=0.5, metal=0.0, coat=0.0, coat_rough=0.2, emit=None, es=0.0, trans=0.0, aniso=0.0, bump=0.0):
    m = bpy.data.materials.new(name); m.use_nodes = True; nt = m.node_tree; b = nt.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value = (*col, 1); b.inputs['Roughness'].default_value = rough; b.inputs['Metallic'].default_value = metal
    b.inputs['Coat Weight'].default_value = coat; b.inputs['Coat Roughness'].default_value = coat_rough
    if trans: b.inputs['Transmission Weight'].default_value = trans; b.inputs['IOR'].default_value = 1.46
    if aniso: b.inputs['Anisotropic'].default_value = aniso
    if emit is not None and es > 0: b.inputs['Emission Color'].default_value = (*emit, 1); b.inputs['Emission Strength'].default_value = es
    if bump:  # powder-coat orange peel + soft rounded edges
        bv = nt.nodes.new('ShaderNodeBevel'); bv.inputs['Radius'].default_value = 0.0025
        nz = nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value = 1400; nz.inputs['Detail'].default_value = 4
        bp = nt.nodes.new('ShaderNodeBump'); bp.inputs['Strength'].default_value = bump; bp.inputs['Distance'].default_value = 0.0004
        nt.links.new(nz.outputs['Fac'], bp.inputs['Height']); nt.links.new(bv.outputs['Normal'], bp.inputs['Normal'])
        nt.links.new(bp.outputs['Normal'], b.inputs['Normal'])
    return m

# finishes: linear colours measured from powder-coat references (sRGB black ~17, white ~232/230/224, graphite ~74/72/70)
FIN = {'black': dict(col=(0.0025, 0.0025, 0.0028), rough=0.42, coat=0.12, coat_rough=0.3, spec=0.28, logo=(0.92, 0.92, 0.92)),
       'white': dict(col=(0.80, 0.79, 0.745), rough=0.45, coat=0.25, coat_rough=0.25, logo=(0.10, 0.10, 0.10)),
       'graphite': dict(col=(0.068, 0.064, 0.060), rough=0.40, coat=0.35, coat_rough=0.22, logo=(0.90, 0.90, 0.90))}
refl = principled('reflector', (0.91, 0.90, 0.88), rough=0.28, metal=1.0, aniso=0.55)
quartz = principled('quartz', (1, 1, 1), rough=0.04, trans=1.0)
cer = principled('ceramic', (0.86, 0.84, 0.79), rough=0.6)
steel = principled('steel', (0.75, 0.75, 0.76), rough=0.32, metal=1.0)
foam = principled('foam', (0.05, 0.05, 0.05), rough=0.9)

FRAME = {'wall': (V((1, 0, 0)), V((0, -0.876, 0.484)), V((0, 0.484, 0.876))),   # model x, out-of-surface, up
         'ceiling': (V((1, 0, 0)), V((0, -1, 0)), V((0, 0, 1)))}
WORLD = {'wall': (V((1, 0, 0)), V((0, -1, 0)), V((0, 0, 1))),       # wall behind (+Y), heater faces the camera side, tilted down
         'ceiling': (V((1, 0, 0)), V((0, 0, -1)), V((0, -1, 0)))}   # face points down; a proper rotation (det +1), never a mirror
heads = []
for k, h in enumerate(SH['heaters']):
    f = FIN[h['finish']]
    body = principled(f'powder{k}', f['col'], f['rough'], 0, f['coat'], f['coat_rough'], bump=0.35)
    body.node_tree.nodes['Principled BSDF'].inputs['Specular IOR Level'].default_value = f.get('spec', 0.5)
    logo = principled(f'logo{k}', f['logo'], 0.35); red = principled(f'red{k}', (0.86, 0.054, 0.016), 0.4)   # Bromic flame mark
    coil = principled(f'coil{k}', (0.12, 0.03, 0.015), 0.5, emit=(1.0, 0.30, 0.045), es=h.get('glow', 16.0))
    before = set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=GLB + h['glb']); new = [o for o in bpy.data.objects if o not in before]
    if h.get('short_post'):  # Series II single short post: the 6 kW heater with the ceiling bracket of the 3 kW ceiling-mount CAD
        CUT = ['bmc-00538', 'bmc-00541', 'bmc-00553', 'heyco', 'bmc-00535']
        for o in list(new):
            if o.type == 'MESH' and any(c in o.data.name.lower() for c in CUT): bpy.data.objects.remove(o); new.remove(o)
        b2 = set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=GLB + '3kW diamond black, ceiling mount.glb'); n2 = [o for o in bpy.data.objects if o not in b2]
        for o in list(n2):
            if o.type == 'MESH' and not any(c in o.data.name.lower() for c in CUT[:4]): bpy.data.objects.remove(o); n2.remove(o)
        n2 = [o for o in n2 if o.name in bpy.data.objects]
        new += n2
    meshes = [o for o in new if o.type == 'MESH']
    for o in meshes:
        c = o.data.name.lower()
        if 'coil' in c: m = coil
        elif 'quartz tube' in c: m = quartz
        elif 'reflector' in c: m = refl
        elif 'ceramic' in c or 'paste' in c: m = cer
        elif 'foam' in c: m = foam
        elif any(x in c for x in ['screw', 'washer', 'nut', 'rivet']): m = steel
        else: m = None
        if m is None:
            for s in o.material_slots:
                om = s.material; b = om.node_tree.nodes.get('Principled BSDF') if om and om.node_tree else None
                col = b.inputs['Base Color'].default_value[:3] if b else (0, 0, 0)
                s.material = logo if ('front cover' in c and min(col) > 0.95) else red if ('front cover' in c and col[0] > 0.8 and col[1] < 0.2) else body
        else:
            o.data.materials.clear(); o.data.materials.append(m)
        for p in o.data.polygons: p.use_smooth = True
        mod = o.modifiers.new('ws', 'WEIGHTED_NORMAL'); mod.keep_sharp = True
    rig = bpy.data.objects.new(f'rig{k}', None); sc.collection.objects.link(rig)
    for o in new:
        if o.parent is None: o.parent = rig
    a = M3((FRAME[h['mount']][0], FRAME[h['mount']][1], FRAME[h['mount']][2])).transposed()
    b = M3((WORLD[h['mount']][0], WORLD[h['mount']][1], WORLD[h['mount']][2])).transposed()
    R = (b @ a.inverted()).to_4x4()
    assert R.to_3x3().determinant() > 0, 'mount transform would mirror the CAD (logo reads backwards)'
    tilt = mathutils.Matrix.Rotation(math.radians(h.get('tilt', 0)), 4, 'X')
    rig.matrix_world = mathutils.Matrix.Translation(V(h.get('offset', (0, 0, 0)))) @ tilt @ R
    bpy.context.view_layer.update()
    fc = [o for o in meshes if 'front cover' in o.data.name.lower()][0]
    # logo centre: polygons with the logo material
    lp = [fc.matrix_world @ p.center for p in fc.data.polygons if fc.material_slots[p.material_index].material == logo]
    cs = [o.matrix_world @ V(c) for o in meshes for c in o.bound_box]
    lo = V([min(c[i] for c in cs) for i in range(3)]); hi = V([max(c[i] for c in cs) for i in range(3)])
    fcs = [fc.matrix_world @ V(c) for c in fc.bound_box]
    centre = sum(fcs, V()) / 8
    heads.append(dict(centre=centre, logo=(sum(lp, V()) / len(lp)) if lp else centre, lo=lo, hi=hi, mount=h['mount']))

# mounting surface as a shadow catcher (ceiling above the plate, or wall behind the bracket)
h0 = heads[0]
pl_lo = V([min(hh['lo'][i] for hh in heads) for i in range(3)]); pl_hi = V([max(hh['hi'][i] for hh in heads) for i in range(3)])
if SH.get('surface', True):
    bpy.ops.mesh.primitive_plane_add(size=40)
    pl = bpy.context.active_object
    if h0['mount'] == 'ceiling': pl.location = (0, 0, pl_hi.z + 0.0005); pl.rotation_euler = (math.pi, 0, 0)
    else: pl.location = (0, pl_hi.y + 0.0005, 0); pl.rotation_euler = (math.pi / 2, 0, 0)
    pl.is_shadow_catcher = True
    pl.data.materials.append(principled('catch', (0.9, 0.9, 0.9), 0.8))
if SH.get('floor'):
    bpy.ops.mesh.primitive_plane_add(size=60); fl = bpy.context.active_object; fl.location = (0, 0, SH['floor']); fl.is_shadow_catcher = True

# camera
cam_d = bpy.data.cameras.new('cam'); cam = bpy.data.objects.new('cam', cam_d); sc.collection.objects.link(cam); sc.camera = cam
C = SH['camera']; base = h0['centre']
tgt = base + V(C.get('target', (0, 0, 0)))
cam.location = base + V(C['pos'])
d = (tgt - cam.location).normalized(); up = V(C.get('up', (0, 0, 1)))
x = d.cross(up).normalized(); y = x.cross(d)
cam.matrix_world = (M3((x, y, -d)).transposed()).to_4x4() @ mathutils.Matrix.Identity(4) if False else mathutils.Matrix.Translation(cam.location) @ M3((x, y, -d)).transposed().to_4x4()
if C.get('roll'): cam.rotation_euler.rotate_axis('Z', math.radians(C['roll']))
if C.get('fit'):  # pull the camera back along its view line until every heater corner sits inside the frame with this margin
    from bpy_extras.object_utils import world_to_camera_view
    r0 = sc.render; r0.resolution_x = int(SH['res'][0]); r0.resolution_y = int(SH['res'][1])
    cam_d.lens = C.get('lens', 50); cam_d.sensor_width = 36; bpy.context.view_layer.update()
    corners = [V((x_, y_, z_)) for hh in heads for x_ in (hh['lo'].x, hh['hi'].x) for y_ in (hh['lo'].y, hh['hi'].y) for z_ in (hh['lo'].z, hh['hi'].z)]
    ctr = sum(corners, V()) / len(corners); m = C['fit']
    p0 = cam.location.copy(); dirv = (p0 - ctr).normalized(); dist = (p0 - ctr).length
    def fits(dd):
        cam.location = ctr + dirv * dd; t = (ctr - cam.location).normalized(); xx = t.cross(up).normalized(); yy = xx.cross(t)
        cam.matrix_world = mathutils.Matrix.Translation(cam.location) @ M3((xx, yy, -t)).transposed().to_4x4()
        if C.get('roll'): cam.rotation_euler.rotate_axis('Z', math.radians(C['roll']))
        bpy.context.view_layer.update()
        pts = [world_to_camera_view(sc, cam, c) for c in corners]
        return all(m <= p.x <= 1 - m and m <= p.y <= 1 - m and p.z > 0 for p in pts)
    lo_, hi_ = dist * 0.3, dist * 4
    for _ in range(30):
        mid = (lo_ + hi_) / 2
        if fits(mid): hi_ = mid
        else: lo_ = mid
    fits(hi_); tgt = ctr
cam_d.lens = C.get('lens', 50); cam_d.sensor_width = 36; cam_d.clip_start = 0.01
if C.get('fstop'):
    cam_d.dof.use_dof = True; cam_d.dof.aperture_fstop = C['fstop']
    ft = h0['logo'] if C.get('focus') == 'logo' else (base + V(C['focus'])) if isinstance(C.get('focus'), list) else tgt
    cam_d.dof.focus_distance = (ft - cam.location).length

# studio light: big soft key, rim, fill, and a dim world
def area(name, loc, size, power, col=(1, 1, 1), look=None):
    L = bpy.data.lights.new(name, 'AREA'); L.size = size; L.energy = power; L.color = col
    o = bpy.data.objects.new(name, L); sc.collection.objects.link(o); o.location = base + V(loc)
    t = (look if look is not None else base) - o.location
    o.rotation_euler = t.to_track_quat('-Z', 'Y').to_euler()
key = SH.get('key', (-2.0, -2.2, -1.6)); area('key', key, SH.get('key_size', 5.0), SH.get('key_w', 900), (1.0, 0.98, 0.95))
area('fill', SH.get('fill', (2.4, -1.8, -0.8)), 3.0, SH.get('fill_w', 300), (0.95, 0.97, 1.0))
area('rim', SH.get('rim', (0.5, 2.2, -0.4)), 1.2, SH.get('rim_w', 500))
area('top', (0, -0.5, 2.5), 4, SH.get('top_w', 150))
w = bpy.data.worlds.new('w'); sc.world = w; w.use_nodes = True; w.node_tree.nodes['Background'].inputs[0].default_value = (0.92, 0.92, 0.92, 1)
w.node_tree.nodes['Background'].inputs[1].default_value = SH.get('world', 0.12)

r = sc.render; r.engine = 'CYCLES'; cy = sc.cycles; cy.device = 'CPU'
cy.samples = int(SH.get('samples', 256)); cy.use_adaptive_sampling = True; cy.adaptive_threshold = SH.get('noise', 0.012)
cy.use_denoising = True; cy.denoiser = 'OPENIMAGEDENOISE'
cy.max_bounces = 10; cy.glossy_bounces = 6; cy.transmission_bounces = 10; cy.transparent_max_bounces = 10; cy.caustics_reflective = False; cy.caustics_refractive = False
cy.blur_glossy = 0.6; cy.seed = 7
r.film_transparent = True; r.resolution_x = int(SH['res'][0] * SCALE); r.resolution_y = int(SH['res'][1] * SCALE); r.resolution_percentage = 100
sc.view_settings.view_transform = 'AgX'; sc.view_settings.look = 'AgX - Medium High Contrast'; sc.view_settings.exposure = SH.get('exposure', 0.0)
r.image_settings.file_format = 'PNG'; r.image_settings.color_mode = 'RGBA'; r.image_settings.color_depth = '16'
r.filepath = OUT; bpy.ops.render.render(write_still=True)
print('LOGO', list(h0['logo']), 'CENTRE', list(h0['centre']))
