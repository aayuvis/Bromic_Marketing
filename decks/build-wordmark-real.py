import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageOps
import numpy as np
C='/tmp/claude-0/-home-user/0ea6ef7b-27b7-5460-ab43-18d94f10d5f1/scratchpad/word/cut/'
DID='/home/user/Bromic_Marketing/app/src/fonts/gfs-didot-latin.woff2'; LT='/usr/share/fonts/opentype/inter/Inter-Light.otf'; SB='/usr/share/fonts/opentype/inter/Inter-SemiBold.otf'
F=lambda p,s: ImageFont.truetype(p,s)
W,H=3900,1500; T=330; BS=1110; HL=BS-T; BG=(244,241,235); INK=(35,31,32); STEEL=(113,119,125); FLAME=(239,65,35)
P={k:Image.open(C+k+'.png').convert('RGBA') for k in ['tungsten','platinum','gas','portable','pendant','efs','eface']}
LAY=[]
def put(img,cx,cy,w=None,h=None,ang=0,flipx=False,flipy=False):
  im=img
  if flipx: im=ImageOps.mirror(im)
  if flipy: im=ImageOps.flip(im)
  if w: im=im.resize((int(w),max(1,int(im.height*w/im.width))),Image.LANCZOS)
  elif h: im=im.resize((max(1,int(im.width*h/im.height)),int(h)),Image.LANCZOS)
  if ang: im=im.rotate(ang,expand=True,resample=Image.BICUBIC)
  LAY.append((im,int(cx-im.width/2),int(cy-im.height/2))); return im.size
def half(img,side):
  w,h=img.size; m=Image.new('L',(w,h),0); ImageDraw.Draw(m).rectangle([0,0,w//2,h] if side=='left' else [w//2,0,w,h],fill=255)
  out=img.copy(); out.putalpha(Image.fromarray(np.minimum(np.array(img.split()[3]),np.array(m)))); return out
def wedge(img,a0,a1):  # remove a wedge (degrees, 0=right, clockwise) for an open ring
  w,h=img.size; m=Image.new('L',(w,h),255); ImageDraw.Draw(m).pieslice([0,0,w,h],a0,a1,fill=0)
  out=img.copy(); out.putalpha(Image.fromarray(np.minimum(np.array(img.split()[3]),np.array(m)))); return out
def squash(img,k): return img.resize((img.width,int(img.height*k)),Image.LANCZOS)
def rodimg(length,width=26):
  r=Image.new('RGBA',(width,int(length)),(0,0,0,0)); d=ImageDraw.Draw(r); d.rectangle([0,0,width,length],fill=(30,30,32,255)); d.line([(width*0.3,0),(width*0.3,length)],fill=(80,80,84,255),width=3)
  return r
def accent(cx,y):
  LAY.append(('accent',cx,y))
TH=150  # stroke thickness for linear heaters
def stem(x,kind='tungsten'): put(P[kind],x+TH/2,(T+BS)/2,w=HL,ang=90); return x+TH
# ---- letters (x = left edge, returns right edge)
def B_eclipses(x,kind='tungsten'):
  s=stem(x,kind); r=HL/4.15; put(P['eface'],s+r*0.78,T+r,w=2*r); put(P['eface'],s+r*0.86,BS-r*1.06,w=2*r*1.06); return s+r*1.92
EB=None
def efs_bowl():
  global EB
  if EB is None:
    im=P['efs']; EB=im.crop((0,0,im.width,int(im.height*0.62))); EB=EB.crop(EB.getbbox())
  return EB
def B_fs(x):
  s=stem(x); hb=HL/2+10; w,_=put(efs_bowl(),0,0,h=hb); LAY.pop()
  put(efs_bowl(),s-20+w/2,T+hb/2,h=hb); put(efs_bowl(),s-20+w/2,BS-hb/2,h=hb,flipy=True); return s-20+w
def B_fs_old(x):  # two Eclipse Freestanding, mirrored: poles form the stem, discs the bowls, bases meet at the waist
  hh=HL/2+20; w,_=put(P['efs'],0,0,h=hh,flipx=True); LAY.pop()
  put(P['efs'],x+w/2,T+hh/2,h=hh,flipx=True); put(P['efs'],x+w/2,BS-hh/2,h=hh,flipx=True,flipy=True); return x+w
def R_eclipse(x,kind='tungsten',leg='gas'):
  s=stem(x,kind); r=HL/3.9; put(P['eface'],s+r*0.82,T+r,w=2*r)
  if leg=='gas': put(P['gas'],s+190,BS-150,w=330,ang=-55)
  else: put(P['tungsten'],s+170,BS-HL*0.25,w=HL*0.58,ang=-62)
  return s+r*1.9
def R_fs(x):
  s=stem(x); hb=HL*0.6; w,_=put(efs_bowl(),0,0,h=hb); LAY.pop(); put(efs_bowl(),s-20+w/2,T+hb/2,h=hb)
  put(P['gas'],s+190,BS-150,w=300,ang=-55); return s-20+w
def R_fs_old(x):
  hh=HL*0.62; w,_=put(P['efs'],0,0,h=hh,flipx=True); LAY.pop(); put(P['efs'],x+w/2,T+hh/2,h=hh,flipx=True)
  put(P['gas'],x+w*0.55,BS-150,w=300,ang=-55); return x+w*1.05
def R_pendant(x):
  put(rodimg(HL),x+15,(T+BS)/2); r=HL/3.9; put(P['eface'],x+40+r,T+r,w=2*r); put(rodimg(40,22),x+38,T+r,ang=90)
  put(P['tungsten'],x+230,BS-HL*0.25,w=HL*0.58,ang=-62); return x+40+r*2
def B_pendants(x):
  put(rodimg(HL),x+15,(T+BS)/2); r=HL/4.15
  for cy,k in [(T+r,1),(BS-r*1.06,1.06)]: put(P['eface'],x+40+r*k,cy,w=2*r*k); put(rodimg(40,22),x+38,cy,ang=90)
  return x+40+r*2.12
def O_face(x): r=HL/2; put(P['eface'],x+r,(T+BS)/2,w=2*r); accent(x+r,T); return x+2*r
def O_tilt(x): r=HL/2; im=squash(P['eface'],0.8); put(im,x+r,(T+BS)/2,w=2*r); accent(x+r,T+r*0.2); return x+2*r
def O_pendant(x): r=HL/2; put(P['pendant'],x+r,(T+BS)/2,w=2*r); accent(x+r,(T+BS)/2-r*0.45); return x+2*r
def M_lin(x,kind='tungsten'):
  wM=640; put(P[kind],x+TH/2,(T+BS)/2,w=HL,ang=90); put(P[kind],x+wM-TH/2,(T+BS)/2,w=HL,ang=90)
  L=HL*0.74; put(P[kind],x+wM*0.33,T+HL*0.37,w=L,ang=-62); put(P[kind],x+wM*0.67,T+HL*0.37,w=L,ang=62); return x+wM
def M_towers(x):
  wP=put(P['portable'],0,0,h=HL)[0]; LAY.pop(); wM=wP*2+340
  put(P['portable'],x+wP/2,(T+BS)/2,h=HL); put(P['portable'],x+wM-wP/2,(T+BS)/2,h=HL,flipx=True)
  L=HL*0.62; put(P['tungsten'],x+wM*0.38,T+HL*0.45,w=L,ang=-62); put(P['tungsten'],x+wM*0.62,T+HL*0.45,w=L,ang=62); return x+wM
def M_pend(x):
  wM=640; put(rodimg(HL),x+15,(T+BS)/2); put(rodimg(HL),x+wM-15,(T+BS)/2)
  low=(x+wM/2,T+HL*0.62); L=math.hypot(wM/2,HL*0.62); a=math.degrees(math.atan2(HL*0.62,wM/2))
  put(rodimg(L,20),(x+15+low[0])/2,(T+low[1])/2,ang=90-a); put(rodimg(L,20),(x+wM-15+low[0])/2,(T+low[1])/2,ang=-(90-a))
  put(P['pendant'],low[0],low[1]+40,w=420); return x+wM
def I_lin(x,kind='tungsten'): return stem(x,kind)
def I_port(x): w,_=put(P['portable'],0,0,h=HL); LAY.pop(); put(P['portable'],x+w/2,(T+BS)/2,h=HL); return x+w
def C_fs(x): w,_=put(P['efs'],0,0,h=HL); LAY.pop(); put(P['efs'],x+w/2,(T+BS)/2,h=HL,flipx=True); return x+w
def C_half(x):
  r=HL/2; put(half(P['eface'].resize((int(2*r),int(2*r)),Image.LANCZOS),'left'),x+r,(T+BS)/2); return x+r+20
def C_open(x): r=HL/2; put(wedge(P['eface'].resize((int(2*r),int(2*r)),Image.LANCZOS),-40,40),x+r,(T+BS)/2); return x+2*r*0.9
OPTIONS=[
 ('1','Eclipse Rounds',[(B_eclipses,{}),(R_eclipse,{}),(O_face,{}),(M_lin,{}),(I_port,{}),(C_half,{})]),
 ('2','The Freestanding Pair',[(B_fs,{}),(R_fs,{}),(O_face,{}),(M_towers,{}),(I_lin,{}),(C_open,{})]),
 ('3','Glass And Light',[(B_eclipses,{'kind':'platinum'}),(R_eclipse,{'kind':'platinum','leg':'tungsten'}),(O_tilt,{}),(M_lin,{'kind':'platinum'}),(I_lin,{'kind':'platinum'}),(C_half,{})]),
 ('4','Every Fuel',[(B_eclipses,{}),(R_eclipse,{}),(O_face,{}),(M_towers,{}),(I_port,{}),(C_half,{})]),
 ('5','Hung From Above',[(B_pendants,{}),(R_pendant,{}),(O_face,{}),(M_pend,{}),(I_lin,{}),(C_half,{})]),
]
import os; OUT='/home/user/Bromic_Marketing/images/portfolio/wordmark/real/'; os.makedirs(OUT,exist_ok=True)
for no,name,letters in OPTIONS:
  GAP=70; LAY.clear(); x=0
  for fn,kw in letters: x=fn(x,**kw)+GAP
  width=x-GAP; W=max(3900,int(width+360)); off=(W-width)/2
  bg=Image.new('RGB',(W,H),BG); 
  sh=Image.new('RGBA',(W,H),(0,0,0,0))
  for it in LAY:
    if it[0]=='accent': continue
    im,lx,ly=it; s=Image.new('RGBA',im.size,(30,22,18,0)); s.putalpha(im.split()[3].point(lambda v:int(v*0.22))); sh.paste(s,(int(lx+off)+18,ly+26),s)
  base=Image.alpha_composite(bg.convert('RGBA'),sh.filter(ImageFilter.GaussianBlur(22)))
  for it in LAY:
    if it[0]=='accent':
      _,cx,y=it; dr=ImageDraw.Draw(base)
      for k in range(3): dr.line([(cx+off+60+k*34,y-110),(cx+off+k*34,y-22)],fill=FLAME+(255,),width=14)
      continue
    im,lx,ly=it; base.alpha_composite(im,(int(lx+off),ly))
  base=base.convert('RGB'); d=ImageDraw.Draw(base)
  d.text((110,80),f'BROMIC IN PRODUCT  ·  OPTION {no} OF 5',font=F(SB,30),fill=FLAME); d.text((110,124),name,font=F(DID,70),fill=INK)
  d.text((110,H-90),'Built from Bromic product renders. Concept artwork: products are rotated and arranged as letters, not shown as installed.',font=F(LT,26),fill=STEEL)
  base.save(OUT+f'option-{no}.jpg',quality=92); print(no,int(width))
ims=[Image.open(OUT+f'option-{n}.jpg') for n in '12345']
for t in ims: t.thumbnail((2000,2000))
s=Image.new('RGB',(2000,sum(t.height+16 for t in ims)),'white'); y=0
for t in ims: s.paste(t,(0,y)); y+=t.height+16
s.save(OUT+'all-options.jpg',quality=88)
