# Renders the CAD stills for the recess-kit airflow video (Blender, Cycles CPU).
import bpy,sys,math,json
from mathutils import Vector
GLB='../cad/glb/6kW heater and recess kit.glb'
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=GLB)
sc=bpy.context.scene; sc.render.engine='CYCLES'; sc.cycles.device='CPU'; sc.cycles.samples=int(sys.argv[-1]) if sys.argv[-1].isdigit() else 48
sc.cycles.use_denoising=True; sc.view_settings.view_transform='Standard'; sc.render.resolution_x=1920; sc.render.resolution_y=1080
w=bpy.data.worlds.new('w'); sc.world=w; w.use_nodes=True; w.node_tree.nodes['Background'].inputs[0].default_value=(1,1,1,1); w.node_tree.nodes['Background'].inputs[1].default_value=1.3
def mat(name,col,rough=0.5,metal=0.0,emit=None,es=0):
    m=bpy.data.materials.new(name); m.use_nodes=True; b=m.node_tree.nodes['Principled BSDF']
    b.inputs['Base Color'].default_value=(*col,1); b.inputs['Roughness'].default_value=rough; b.inputs['Metallic'].default_value=metal
    if emit: b.inputs['Emission Color'].default_value=(*emit,1); b.inputs['Emission Strength'].default_value=es
    return m
M=dict(steel=mat('steel',(0.72,0.73,0.75),0.35,0.6,(0.75,0.76,0.78),0.25),fan=mat('fan',(0.32,0.33,0.35),0.5,0.2),body=mat('body',(0.06,0.06,0.065),0.45,0.3),
       fascia=mat('fascia',(0.02,0.02,0.02),0.7,0.0),elem=mat('elem',(0.25,0.05,0.03),0.6,0,(1,0.09,0.015),0),term=mat('term',(0.2,0.2,0.21),0.5),
       board=mat('board',(0.93,0.93,0.92),0.8),timber=mat('timber',(0.80,0.64,0.44),0.8),deck=mat('deck',(0.60,0.52,0.42),0.85))
parts={}
for o in list(sc.objects):
    if o.type!='MESH': continue
    ws=[o.matrix_world@Vector(c) for c in o.bound_box]; mn=[min(v[i] for v in ws) for i in range(3)]; mx=[max(v[i] for v in ws) for i in range(3)]
    heater = mx[2]<=0.056 and mn[0]>=-0.72 and mx[0]<=0.72
    elem = heater and mn[2]>-0.026 and mx[2]<-0.004 and (mx[0]-mn[0])>1.2
    fan = (abs((mn[0]+mx[0])/2)>0.5 and abs((mn[0]+mx[0])/2)<0.65 and mn[2]>0.05 and len(o.data.vertices)>50000)
    term = mx[0]<-0.76
    m = M['elem'] if elem else M['fascia'] if heater and mn[2]<-0.03 else M['body'] if heater else M['fan'] if fan else M['term'] if term else M['steel']
    o.data.materials.clear(); o.data.materials.append(m); parts[o.name]='heater' if heater else 'kit'
# ceiling: 1/2 in board (bottom at z=0), 2x8 joists 7.5 in deep, deck above
def box(name,x0,x1,y0,y1,z0,z1,m):
    bpy.ops.mesh.primitive_cube_add(location=((x0+x1)/2,(y0+y1)/2,(z0+z1)/2)); o=bpy.context.object; o.scale=((x1-x0)/2,(y1-y0)/2,(z1-z0)/2); o.name=name; o.data.materials.append(m); return o
B=0.0127; C=0.1905; T=B+C
board_l=box('boardL',-3,-0.82,0,1,0,B,M['board']); board_r=box('boardR',0.82,3,0,1,0,B,M['board'])
board_f=box('boardF',-0.82,0.82,0.1425,1,0,B,M['board'])                      # beside the cut-out (behind the cut plane)
deck=box('deck',-3,3,0,1,T,T+0.025,M['deck'])
joist=box('joist',-3,3,0.2032,0.2032+0.038,B,T,M['timber'])
sun=bpy.data.lights.new('s','SUN'); sun.energy=1.5;
al=bpy.data.lights.new('a','AREA'); al.energy=400; al.size=3; ao=bpy.data.objects.new('a',al); sc.collection.objects.link(ao); ao.location=(0,-1.2,0.1); ao.rotation_euler=(math.radians(90),0,0)
so=bpy.data.objects.new('s',sun); sc.collection.objects.link(so); so.rotation_euler=(math.radians(50),math.radians(10),math.radians(30))
cam=bpy.data.cameras.new('c'); co=bpy.data.objects.new('c',cam); sc.collection.objects.link(co); sc.camera=co
S,cx,cz=2.1,-0.05,-0.0656
def section(name):
    sc.render.film_transparent=True
    for nm in ('boardL','boardR','boardF','deck','joist','boardMid'):
        if nm in sc.objects: sc.objects[nm].hide_render=True
    co.location=(cx,-5,cz); co.rotation_euler=(math.radians(90),0,0); cam.type='ORTHO'; cam.ortho_scale=S; cam.clip_start=5.0; cam.clip_end=20
    sc.render.filepath=name; bpy.ops.render.render(write_still=True)
import os
if not os.environ.get('ONLY_C'): section('A_kit.png')
for o in sc.objects:
    if parts.get(o.name)=='kit': o.hide_render=True
board_mid=box('boardMid',-0.82,0.82,0,0.1425,0,B,M['board'])   # without the kit the cut-out is only the heater's width
board_mid.hide_render=True
if not os.environ.get('ONLY_C'): section('B_nokit.png')
for o in sc.objects:
    if parts.get(o.name)=='kit': o.hide_render=False
# finished ceiling from below, element glowing
M['elem'].node_tree.nodes['Principled BSDF'].inputs['Emission Strength'].default_value=6
sun.energy=1.2; w.node_tree.nodes['Background'].inputs[0].default_value=(0.55,0.62,0.75,1); w.node_tree.nodes['Background'].inputs[1].default_value=0.6
board_f.hide_render=False
board_b=box('boardB',-0.82,0.82,-1,-0.1425,0,B,M['board']); board_l2=box('bl2',-3,-0.82,-1,0,0,B,M['board']); board_r2=box('br2',0.82,3,-1,0,0,B,M['board'])
cam.type='PERSP'; cam.lens=27; cam.clip_start=0.01; co.location=(0.30,-0.80,-1.70)
d=Vector((-0.05,0.05,0.0))-co.location; co.rotation_euler=d.to_track_quat('-Z','Y').to_euler(); al.energy=60; ao.location=(0.5,-1.0,-1.0)
for nm in ('deck','joist'): sc.objects[nm].hide_render=True
sc.render.film_transparent=False
for nm in ('boardL','boardR','boardF'): sc.objects[nm].hide_render=False
M['elem'].node_tree.nodes['Principled BSDF'].inputs['Emission Strength'].default_value=22
w.node_tree.nodes['Background'].inputs[0].default_value=(0.30,0.25,0.22,1)
sc.render.filepath='C_below.png'; bpy.ops.render.render(write_still=True)
json.dump({'S':S,'cx':cx,'cz':cz,'W':1920,'H':1080,'B':B,'T':T},open('geom.json','w'))
