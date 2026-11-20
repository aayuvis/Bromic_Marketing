# Render heaters into a camera matched to a photo: level camera at the origin looking along +Y, Z up.
# Each heater: face centre at world (dx, D, h); mount = 'wall' (angled bracket into a vertical surface facing the camera)
#  or 'ceiling' (post straight up into a horizontal surface). Output: RGBA at the photo's size.
import bpy,sys,math,json,mathutils
spec=json.load(open(sys.argv[sys.argv.index('--')+1])); out=sys.argv[sys.argv.index('--')+2]
V=mathutils.Vector; M3=mathutils.Matrix
bpy.ops.wm.read_factory_settings(use_empty=True); sc=bpy.context.scene
def mat(name,col,metal=0,rough=0.5,emit=None,es=0,trans=0):
  m=bpy.data.materials.get(name)
  if m: return m
  m=bpy.data.materials.new(name); m.use_nodes=True; b=m.node_tree.nodes['Principled BSDF']
  b.inputs['Base Color'].default_value=(*col,1); b.inputs['Metallic'].default_value=metal; b.inputs['Roughness'].default_value=rough
  if trans: b.inputs['Transmission Weight'].default_value=trans; b.inputs['IOR'].default_value=1.46
  if emit and es>0: b.inputs['Emission Color'].default_value=(*emit,1); b.inputs['Emission Strength'].default_value=es
  return m
fin=spec['finish']; G=spec['glow']
body=mat('powder',{'black':(0.022,0.021,0.021),'white':(0.66,0.66,0.645)}[fin],0,0.48)
body.node_tree.nodes['Principled BSDF'].inputs['Coat Weight'].default_value=0.18; body.node_tree.nodes['Principled BSDF'].inputs['Coat Roughness'].default_value=0.3
nt=body.node_tree; bv=nt.nodes.new('ShaderNodeBevel'); bv.inputs['Radius'].default_value=0.004
nz=nt.nodes.new('ShaderNodeTexNoise'); nz.inputs['Scale'].default_value=900; bp=nt.nodes.new('ShaderNodeBump'); bp.inputs['Strength'].default_value=0.015
nt.links.new(nz.outputs['Fac'],bp.inputs['Height']); nt.links.new(bv.outputs['Normal'],bp.inputs['Normal']); nt.links.new(bp.outputs['Normal'],nt.nodes['Principled BSDF'].inputs['Normal'])
refl=mat('reflector',(0.45,0.38,0.32),1,0.35)
coil=mat('coil',(0.5,0.16,0.04) if G else (0.3,0.28,0.27),0,0.5,(1.0,0.30,0.05),G)
quartz=mat('quartz',(1,0.95,0.92),0,0.08,(1.0,0.32,0.07),G*0.012,trans=0.9)
cer=mat('ceramic',(0.8,0.78,0.74),0,0.6); steel=mat('steel',(0.4,0.4,0.42),1,0.4)
logo=mat('logo',(0.8,0.8,0.8),0,0.4); logod=mat('logodark',(0.08,0.08,0.08),0,0.4)
FRAME={'wall':(V((1,0,0)),V((0,-0.876,0.484)),V((0,0.484,0.876))),   # x, out-of-surface normal, up  (model coords)
       'ceiling':(V((1,0,0)),V((0,-1,0)),V((0,0,1)))}                  # for the ceiling model "out" is down (-Y) and "up" is +Z (horizontal)
for k,h in enumerate(spec['heaters']):
  WALLG=h['glb'].replace('3kW diamond black, ceiling mount','6kW diamond, angled wall mount')
  before=set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=WALLG); new=[o for o in bpy.data.objects if o not in before]
  if h['mount']=='ceiling':
    CUT=['bmc-00538','bmc-00541','bmc-00553','heyco','bmc-00535']
    for o in list(new):
      if o.type=='MESH' and any(c in o.data.name.lower() for c in CUT): bpy.data.objects.remove(o); new.remove(o)
    b2=set(bpy.data.objects); bpy.ops.import_scene.gltf(filepath=WALLG.replace('6kW diamond, angled wall mount','3kW diamond black, ceiling mount')); n2=[o for o in bpy.data.objects if o not in b2]
    for o in list(n2):
      if o.type=='MESH' and not any(c in o.data.name.lower() for c in CUT[:4]): bpy.data.objects.remove(o); n2.remove(o)
    new+=n2
  for o in new:
    if o.type!='MESH': continue
    c=o.data.name.lower()
    m=coil if 'coil' in c else quartz if 'quartz tube' in c else refl if 'reflector' in c else cer if 'ceramic' in c else steel if any(x in c for x in ['screw','washer','m5 nut','rivet']) else None
    if m is None:
      for s in o.material_slots:
        om=s.material; b=om.node_tree.nodes.get('Principled BSDF') if om and om.node_tree else None
        col=b.inputs['Base Color'].default_value[:3] if b else (0,0,0)
        s.material=(logo if fin=='black' else logod) if ('front cover' in c and min(col)>0.95) else body
    else: o.data.materials.clear(); o.data.materials.append(m)
    for p in o.data.polygons: p.use_smooth=True
  rig=bpy.data.objects.new(f'rig{k}',None); sc.collection.objects.link(rig)
  for o in new:
    if o.parent is None: o.parent=rig
  xm,nm,um=FRAME[h['mount']]
  A=M3((xm,nm,um)).transposed()                       # model basis as columns
  if h['mount']=='wall': B=M3(((1,0,0),(0,-1,0),(0,0,1))).transposed()   # world: x, toward camera (-Y), up
  else: B=M3(((1,0,0),(0,0,-1),(0,-1,0))).transposed()                   # ceiling: out = down (-Z), "up" = away from camera (+Y)
  R=B@A.inverted()
  R=M3.Rotation(math.radians(h.get('yaw',0)),3,'Z')@M3.Rotation(math.radians(h.get('roll',0)),3,'Y')@R
  face=R@V((0,-0.027,0))
  if 'pose' in h:
    import numpy as _np
    rv=_np.array(h['pose']['r']); th=_np.linalg.norm(rv); Rc=_np.array(M3.Rotation(th,3,V(rv/th))) if th>0 else _np.eye(3)
    Cm=_np.array([[1,0,0],[0,0,1],[0,-1,0]]); Rw=Cm@Rc; tw=Cm@_np.array(h['pose']['t'])
    Mw=_np.eye(4); Mw[:3,:3]=Rw; Mw[:3,3]=tw; rig.matrix_world=mathutils.Matrix(Mw.tolist())
  else:
    rig.matrix_world=M3.Translation(V((h['dx'],h['D'],h['h']))-face)@R.to_4x4()
  if spec.get('catcher',True) and k==0:
    if h['mount']=='wall': pn=V((0,0.876,-0.484)); pc=V((0,0.2785,-0.1055))
    else: pn=V((0,1,0)); pc=V((0,0.207,0))
    bpy.ops.mesh.primitive_plane_add(size=60); pl=bpy.context.object; pl.is_shadow_catcher=True
    pl.rotation_euler=(-pn).to_track_quat('Z','Y').to_euler(); pl.location=pc+pn*0.004; pl.parent=rig
    pl.data.materials.append(mat('catch',(0.6,0.6,0.6),0,0.8))
W,H,f=spec['W'],spec['H'],spec['f']
cam=bpy.data.cameras.new('c'); co=bpy.data.objects.new('c',cam); sc.collection.objects.link(co); sc.camera=co
cam.sensor_fit='HORIZONTAL'; cam.sensor_width=36; cam.lens=f*36/W; cam.clip_start=0.05
co.rotation_euler=(math.radians(90+spec.get('pitch',0)),0,0)
w=bpy.data.worlds.new('w'); sc.world=w; w.use_nodes=True; bg=w.node_tree.nodes['Background']
bg.inputs[0].default_value=(*spec['amb'],1); bg.inputs[1].default_value=spec.get('amb_strength',0.8)
if 'sun' in spec:
  sl=bpy.data.lights.new('sun','SUN'); sl.energy=spec['sun']['e']; sl.angle=math.radians(spec['sun'].get('angle',8)); sl.color=spec['sun'].get('col',(1,1,1))
  so=bpy.data.objects.new('sun',sl); sc.collection.objects.link(so); so.rotation_euler=(-V(spec['sun']['dir'])).to_track_quat('-Z','Y').to_euler()
  so.rotation_euler=V(spec['sun']['dir']).to_track_quat('Z','Y').to_euler()
for L in spec.get('lights',[]):
  l=bpy.data.lights.new('l','AREA'); l.energy=L['e']; l.size=L.get('size',2); l.color=L.get('col',(1,1,1)); lo=bpy.data.objects.new('l',l); sc.collection.objects.link(lo)
  lo.location=V(L['at']); tgt=V(L.get('to',(0,4,2))); lo.rotation_euler=(tgt-lo.location).to_track_quat('-Z','Y').to_euler()
sc.render.engine='CYCLES'; sc.cycles.device='CPU'; sc.cycles.samples=spec.get('samples',128); sc.cycles.use_denoising=True
sc.render.resolution_x=int(W*spec.get('scale',2)); sc.render.resolution_y=int(H*spec.get('scale',2)); sc.render.film_transparent=True
sc.view_settings.view_transform='Standard'; sc.view_settings.exposure=spec.get('exposure',0)
bpy.context.view_layer.update()
from bpy_extras.object_utils import world_to_camera_view
pts=[o.matrix_world@V(v) for o in sc.objects if o.type=='MESH' and not o.is_shadow_catcher for v in o.bound_box]
uv=[world_to_camera_view(sc,co,p) for p in pts]
sc.render.use_border=True; sc.render.use_crop_to_border=False
sc.render.border_min_x=max(0,min(u.x for u in uv)-0.08); sc.render.border_max_x=min(1,max(u.x for u in uv)+0.08)
sc.render.border_min_y=max(0,min(u.y for u in uv)-0.12); sc.render.border_max_y=min(1,max(u.y for u in uv)+0.12)
sc.render.image_settings.file_format='PNG'; sc.render.image_settings.color_mode='RGBA'; sc.render.filepath=out
print('border',sc.render.border_min_x,sc.render.border_max_x,sc.render.border_min_y,sc.render.border_max_y,len(pts))
bpy.ops.render.render(write_still=True)
for o in sc.objects:
  if o.type=='MESH' and o.is_shadow_catcher: o.hide_render=True
sc.cycles.samples=16; sc.render.filepath=out.replace('.png','_h.png'); bpy.ops.render.render(write_still=True); print('done',out)
