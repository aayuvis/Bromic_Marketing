import math, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter
PAPER=(246,243,236); INK=(58,54,52); RED=(225,60,35); GLOW=(245,150,90); STEEL=(120,120,120); GLASS=(70,68,70)
DID='/home/user/Bromic_Marketing/app/src/fonts/gfs-didot-latin.woff2'; LT='/usr/share/fonts/opentype/inter/Inter-Light.otf'; SB='/usr/share/fonts/opentype/inter/Inter-SemiBold.otf'
F=lambda p,s: ImageFont.truetype(p,s)
W,H=3900,1500; T=380; B_=1040; HL=B_-T
im=d=None
def jit(p,a=2.0): return (p[0]+random.uniform(-a,a),p[1]+random.uniform(-a,a))
def stroke(pts,col=INK,w=3,passes=2,closed=False):
  if closed: pts=pts+[pts[0]]
  for _ in range(passes): d.line([jit(p) for p in pts],fill=col,width=w,joint='curve')
def rot(pts,c,a):
  ca,sa=math.cos(a),math.sin(a); return [(c[0]+(x-c[0])*ca-(y-c[1])*sa, c[1]+(x-c[0])*sa+(y-c[1])*ca) for x,y in pts]
def rrect(x,y,w,h,r):
  pts=[]
  for cx,cy,a0 in [(x+w-r,y+r,-90),(x+w-r,y+h-r,0),(x+r,y+h-r,90),(x+r,y+r,180)]:
    for k in range(10): a=math.radians(a0+k*9); pts.append((cx+r*math.cos(a),cy+r*math.sin(a)))
  return pts
def arc(c,rx,a0,a1,ry=None,n=90):
  ry=ry or rx; return [(c[0]+rx*math.cos(math.radians(a0+(a1-a0)*k/n)),c[1]+ry*math.sin(math.radians(a0+(a1-a0)*k/n))) for k in range(n+1)]
def glow(pts,w=18):
  global im,d
  g=Image.new('RGBA',(W,H),(0,0,0,0)); ImageDraw.Draw(g).line(pts,fill=GLOW+(150,),width=w)
  im=Image.alpha_composite(im.convert('RGBA'),g.filter(ImageFilter.GaussianBlur(10))).convert('RGB'); d=ImageDraw.Draw(im)
# ---------- products
def tungsten(cx,cy,L,t,ang):
  x,y=cx-L/2,cy-t/2; stroke(rot(rrect(x,y,L,t,t*0.35),(cx,cy),ang),w=4); stroke(rot(rrect(x+t*0.45,y+t*0.22,L-t*0.9,t*0.56,4),(cx,cy),ang),w=2,passes=1)
  for tt in (0.42,0.58): stroke(rot([(x+t*0.6,y+t*tt),(x+L-t*0.6,y+t*tt)],(cx,cy),ang),col=RED,w=4,passes=1)
  n=int(L/26)
  for k in range(n):
    xx=x+t*0.5+k*(L-t)/n; stroke(rot([(xx,y+t*0.25),(xx+12,y+t*0.5),(xx,y+t*0.75)],(cx,cy),ang),col=STEEL,w=1,passes=1)
def platinum(cx,cy,L,t,ang):
  x,y=cx-L/2,cy-t/2; p=rot(rrect(x,y,L,t,6),(cx,cy),ang); d.polygon(p,fill=GLASS); stroke(p,w=4,closed=True)
  stroke(rot([(x+10,y+8),(x+L-10,y+8)],(cx,cy),ang),col=(200,200,200),w=2,passes=1); stroke(rot([(x+20,y+t*0.5),(x+L-20,y+t*0.5)],(cx,cy),ang),col=RED,w=3,passes=1)
def eclipse(c,r,a0=0,a1=360,coil=True,halo=True,ry=None):
  if halo: glow(arc(c,r*1.04,a0,a1,(ry or r)*1.04))
  stroke(arc(c,r,a0,a1,ry),w=5); stroke(arc(c,r*0.86,a0,a1,(ry or r)*0.86),w=2,passes=1)
  if coil:
    rr=r*0.42; k=(ry or r)/r
    for i,yy in enumerate(range(int(-rr)+10,int(rr),22)):
      hw=math.sqrt(max(0,rr*rr-yy*yy))*0.92; xa,xb=c[0]-hw,c[0]+hw
      if a1-a0<360:
        if a0<=-90 and a1<=90: xa=max(xa,c[0])        # right half
        if a0>=90: xb=min(xb,c[0])                    # left half
      if xb>xa: d.line([(xa,c[1]+yy*k),(xb,c[1]+yy*k)],fill=RED,width=3)
def gas(cx,cy,w,h,ang):
  x,y=cx-w/2,cy-h/2; stroke(rot(rrect(x,y,w,h,14),(cx,cy),ang),w=4); stroke(rot([(x-w*0.06,y-h*0.12),(x+w*1.06,y-h*0.12)],(cx,cy),ang),w=5)
  pw=(w*0.8)/5
  for k in range(5): stroke(rot(rrect(x+w*0.1+k*pw+4,y+h*0.2,pw-8,h*0.6,3),(cx,cy),ang),col=RED,w=3,passes=1)
def fsgas(x):  # Tungsten Freestanding Gas tower, centred on x
  for dx in (-35,40): stroke([(x+dx+18*math.sin(t/12*math.pi*1.3),T+130+t*(HL-260)/12) for t in range(13)],w=6)
  stroke(rrect(x-115,B_-140,230,140,30),w=5); gas(x+5,T+60,250,120,0)
def efs(c,R,a0,a1,disc_at,base_at,dr=80):  # Eclipse Freestanding: arc pole, disc at one end, base at the other
  stroke(arc(c,R,a0,a1,n=70),w=7)
  p=arc(c,R,disc_at,disc_at,n=1)[0]; eclipse(p,dr)
  if base_at is not None: q=arc(c,R,base_at,base_at,n=1)[0]; stroke(rrect(q[0]-90,q[1]-5,180,60,18),w=5)
def rod(x,y0,y1): stroke([(x-6,y0),(x-6,y1)],w=4); stroke([(x+6,y0),(x+6,y1)],w=4); stroke(rrect(x-30,y0-14,60,16,6),w=3,passes=1)
# ---------- letters: each draws at left edge x and returns its right edge
def B_eclipses(x,stem='tungsten'):
  (tungsten if stem=='tungsten' else platinum)(x+55,(T+B_)/2,HL,110,math.pi/2); r=HL/4.1
  eclipse((x+110+r*0.82,T+r),r); eclipse((x+110+r*0.92,B_-r*1.08),r*1.08); return x+110+r*2.0
def B_freestanding(x):
  tungsten(x+55,(T+B_)/2,HL,110,math.pi/2); r=HL/4.2
  efs((x+110,T+r),r,-90,40,40,None,dr=62); efs((x+110,B_-r),r*1.05,-40,90,-40,None,dr=62); return x+110+r*1.9
def B_pendants(x):
  rod(x+40,T,B_); r=HL/4.2; eclipse((x+60+r,T+r),r); eclipse((x+60+r*1.05,B_-r*1.05),r*1.05)
  stroke([(x+40,T+r),(x+60,T+r)],w=4); stroke([(x+40,B_-r),(x+60,B_-r)],w=4); return x+60+r*2.1
def R_eclipse(x,leg='gas',stem='tungsten'):
  (tungsten if stem=='tungsten' else platinum)(x+55,(T+B_)/2,HL,110,math.pi/2); r=HL/3.9
  eclipse((x+110+r*0.9,T+r),r)
  if leg=='gas': gas(x+260,B_-160,260,170,math.radians(55))
  else: tungsten(x+260,B_-170,HL*0.55,80,math.radians(60))
  return x+110+r*1.9
def R_freestanding(x):
  tungsten(x+55,(T+B_)/2,HL,110,math.pi/2); r=HL/3.9
  efs((x+110,T+r),r,-90,45,45,None,dr=70); gas(x+250,B_-160,250,165,math.radians(55)); return x+110+r*1.35
def R_pendant(x):
  rod(x+40,T,B_); r=HL/3.9; eclipse((x+60+r,T+r),r); stroke([(x+40,T+r),(x+60,T+r)],w=4); tungsten(x+250,B_-170,HL*0.55,80,math.radians(60)); return x+60+r*2
def O_face(x): r=HL/2; eclipse((x+r,(T+B_)/2),r); accent(x+r,T); return x+2*r
def O_tilted(x): r=HL/2; eclipse((x+r,(T+B_)/2),r,ry=r*0.82); accent(x+r,T+r*0.18); return x+2*r
def O_open(x): r=HL/2; eclipse((x+r,(T+B_)/2),r,coil=False); eclipse((x+r,(T+B_)/2),r*0.45,halo=False); accent(x+r,T); return x+2*r
def accent(cx,y):
  for k in range(3): d.line([(cx+50+k*28,y-95),(cx+k*28,y-20)],fill=RED,width=10)
def M_tungsten(x,kind='tungsten'):
  f=tungsten if kind=='tungsten' else platinum
  f(x+50,(T+B_)/2,HL,100,math.pi/2); f(x+590,(T+B_)/2,HL,100,math.pi/2)
  f(x+228,T+HL*0.36,HL*0.74,82,math.radians(60)); f(x+412,T+HL*0.36,HL*0.74,82,math.radians(120)); return x+640
def M_towers(x):
  fsgas(x+120); fsgas(x+600); tungsten(x+275,T+HL*0.45,HL*0.6,76,math.radians(62)); tungsten(x+445,T+HL*0.45,HL*0.6,76,math.radians(118)); return x+720
def M_pendants(x):
  rod(x+40,T,B_); rod(x+560,T,B_); eclipse((x+300,T+HL*0.55),HL*0.22)
  stroke([(x+46,T),(x+300,T+HL*0.55-HL*0.22)],w=5); stroke([(x+554,T),(x+300,T+HL*0.55-HL*0.22)],w=5); return x+600
def I_fsgas(x): fsgas(x+125); return x+250
def I_linear(x,kind='tungsten'): (tungsten if kind=='tungsten' else platinum)(x+55,(T+B_)/2,HL,110,math.pi/2); return x+110
def I_portable(x):
  stroke([(x+60,T+120),(x+40,B_-120)],w=6); stroke([(x+140,T+120),(x+160,B_-120)],w=6); stroke(rrect(x,B_-130,200,130,24),w=5); gas(x+100,T+60,220,110,0); return x+200
def C_efs(x): R=HL/2*0.86; c=(x+R,(T+B_)/2); efs(c,R,45,315,315,45,dr=85); return x+R+R*0.71+90
def C_halfpendant(x): r=HL/2; c=(x+r,(T+B_)/2); eclipse(c,r,90,270); rod(c[0],T-160,T+4); return x+r+20
def C_openring(x): r=HL/2; c=(x+r,(T+B_)/2); eclipse(c,r,40,320,coil=False); eclipse((c[0],c[1]),r*0.42,halo=False); return x+r*1.8
OPTIONS=[
 ('1','Eclipse Rounds','Round heat does the curves.',[(B_eclipses,{}),(R_eclipse,{}),(O_face,{}),(M_tungsten,{}),(I_fsgas,{}),(C_halfpendant,{})],
  ['B  Tungsten stem, two Eclipse heaters as the bowls','R  Tungsten stem, Eclipse bowl, Platinum Gas leg on its tilt bracket','O  Eclipse face on, logo accent as heat','M  Four Tungsten heaters','I  Tungsten Freestanding Gas','C  Half an Eclipse Pendant, drop rod above']),
 ('2','The Freestanding Pair','The arcs carry the letters.',[(B_freestanding,{}),(R_freestanding,{}),(O_face,{}),(M_towers,{}),(I_linear,{}),(C_efs,{})],
  ['B  Two Eclipse Freestanding arcs facing each other','R  One Eclipse Freestanding arc, Platinum Gas leg','O  Eclipse face on','M  Two Tungsten Freestanding Gas towers, Tungsten V','I  One Tungsten upright','C  Eclipse Freestanding: pole, disc and base']),
 ('3','Glass And Light','Platinum lines, Eclipse rounds.',[(B_eclipses,{'stem':'platinum'}),(R_eclipse,{'stem':'platinum','leg':'tungsten'}),(O_tilted,{}),(M_tungsten,{'kind':'platinum'}),(I_linear,{'kind':'platinum'}),(C_halfpendant,{})],
  ['B  Platinum Electric stem, two Eclipse bowls','R  Platinum stem, Eclipse bowl, Tungsten leg','O  Eclipse seen from below, in perspective','M  Four Platinum Electric glass heaters','I  Platinum Electric upright','C  Half an Eclipse Pendant']),
 ('4','Every Fuel','Electric and gas in one word.',[(B_eclipses,{}),(R_eclipse,{}),(O_open,{}),(M_towers,{}),(I_portable,{}),(C_openring,{})],
  ['B  Tungsten stem, two Eclipse bowls','R  Tungsten stem, Eclipse bowl, Platinum Gas leg','O  Eclipse halo ring around its glowing core','M  Two Tungsten Freestanding Gas towers, Tungsten V','I  Tungsten Portable','C  Eclipse halo, opened like a C']),
 ('5','Hung From Above','Pendants and drop rods.',[(B_pendants,{}),(R_pendant,{}),(O_face,{}),(M_pendants,{}),(I_linear,{}),(C_halfpendant,{})],
  ['B  Drop rod stem, two Eclipse Pendants','R  Drop rod, Eclipse Pendant, Tungsten leg','O  Eclipse face on','M  Two drop rods, an Eclipse Pendant at the low point','I  Tungsten upright','C  Half an Eclipse Pendant']),
]
outs=[]
for no,name,line,letters,notes in OPTIONS:
  random.seed(int(no)*11)
  im=Image.new('RGB',(W,H),PAPER); d=ImageDraw.Draw(im)
  d.text((110,70),f'SKETCH BOARD  ·  BROMIC IN PRODUCT  ·  OPTION {no} OF 5',font=F(SB,32),fill=RED)
  d.text((110,118),name,font=F(DID,84),fill=INK); d.text((110,222),line,font=F(LT,34),fill=STEEL)
  # measure pass on a scratch canvas to centre the word
  save=(im,d); im=Image.new('RGB',(W,H)); d=ImageDraw.Draw(im); x=0; GAP=95
  for fn,kw in letters: x=fn(x,**kw)+GAP
  width=x-GAP; im,d=save; x=(W-width)/2
  for fn,kw in letters: x=fn(x,**kw)+GAP
  d.line([(110,B_+50),(W-110,B_+50)],fill=(205,200,192),width=2)
  cw=(W-220)/6
  for i,n in enumerate(notes):
    L,t=n.split('  ',1); x0=110+i*cw; d.text((x0,B_+90),L,font=F(DID,64),fill=INK)
    y=B_+178; line_=''
    for w_ in t.split():
      if d.textlength(line_+' '+w_,font=F(LT,26))>cw-40: d.text((x0,y),line_.strip(),font=F(LT,26),fill=INK); y+=36; line_=''
      line_+=' '+w_
    d.text((x0,y),line_.strip(),font=F(LT,26),fill=INK)
  p=f'/home/user/Bromic_Marketing/images/portfolio/wordmark/option-{no}.png'; import os; os.makedirs(os.path.dirname(p),exist_ok=True); im.save(p); outs.append(p); print(no,width)
sheet=Image.new('RGB',(2000,len(outs)*(int(2000*H/W)+16)),'white'); y=0
for p in outs: t=Image.open(p); t.thumbnail((2000,2000)); sheet.paste(t,(0,y)); y+=t.height+16
sheet.save('/tmp/claude-0/-home-user/0ea6ef7b-27b7-5460-ab43-18d94f10d5f1/scratchpad/word/all.png')
