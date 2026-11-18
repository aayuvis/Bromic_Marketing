import math, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter
random.seed(7)
W,H=3900,2000; PAPER=(246,243,236); INK=(58,54,52); RED=(225,60,35); GLOW=(245,150,90); STEEL=(120,120,120)
im=Image.new('RGB',(W,H),PAPER); d=ImageDraw.Draw(im)
DID='/home/user/Bromic_Marketing/app/src/fonts/gfs-didot-latin.woff2'; LT='/usr/share/fonts/opentype/inter/Inter-Light.otf'; SB='/usr/share/fonts/opentype/inter/Inter-SemiBold.otf'
F=lambda p,s: ImageFont.truetype(p,s)
def jit(p,a=2.2): return (p[0]+random.uniform(-a,a),p[1]+random.uniform(-a,a))
def stroke(pts,col=INK,w=3,passes=2,closed=False):
  if closed: pts=pts+[pts[0]]
  for _ in range(passes):
    q=[jit(p) for p in pts]; d.line(q,fill=col,width=w,joint='curve')
def rot(pts,c,a):
  ca,sa=math.cos(a),math.sin(a); return [(c[0]+(x-c[0])*ca-(y-c[1])*sa, c[1]+(x-c[0])*sa+(y-c[1])*ca) for x,y in pts]
def rrect(x,y,w,h,r):
  pts=[]
  for cx,cy,a0 in [(x+w-r,y+r,-90),(x+w-r,y+h-r,0),(x+r,y+h-r,90),(x+r,y+r,180)]:
    for k in range(10): a=math.radians(a0+k*9); pts.append((cx+r*math.cos(a),cy+r*math.sin(a)))
  return pts
def circle(c,r,a0=0,a1=360,n=90):
  return [(c[0]+r*math.cos(math.radians(a0+(a1-a0)*k/n)),c[1]+r*math.sin(math.radians(a0+(a1-a0)*k/n))) for k in range(n+1)]
def linear(cx,cy,length,thick,ang):  # Tungsten / Platinum linear heater, long axis along ang
  x,y=cx-length/2,cy-thick/2; o=rrect(x,y,length,thick,thick*0.35); stroke(rot(o,(cx,cy),ang),w=4)
  g=rrect(x+thick*0.45,y+thick*0.22,length-thick*0.9,thick*0.56,4); stroke(rot(g,(cx,cy),ang),w=2,passes=1)
  for t in (0.42,0.58): stroke(rot([(x+thick*0.6,y+thick*t),(x+length-thick*0.6,y+thick*t)],(cx,cy),ang),col=RED,w=4,passes=1)
  n=int(length/26)
  for k in range(n):  # diamond grille hatch
    xx=x+thick*0.5+k*(length-thick)/n; stroke(rot([(xx,y+thick*0.25),(xx+12,y+thick*0.5),(xx,y+thick*0.75)],(cx,cy),ang),col=STEEL,w=1,passes=1)
def eclipse(c,r,a0=0,a1=360,halo=True,coil=True):
  if halo:
    g=Image.new('RGBA',(W,H),(0,0,0,0)); ImageDraw.Draw(g).line(circle(c,r*1.04,a0,a1),fill=GLOW+(160,),width=18)
    im.paste(Image.alpha_composite(im.convert('RGBA'),g.filter(ImageFilter.GaussianBlur(10))).convert('RGB'))
  stroke(circle(c,r,a0,a1),w=5); stroke(circle(c,r*0.86,a0,a1),w=2,passes=1)
  if coil:
    rr=r*0.42; ys=range(int(-rr)+10,int(rr),22)
    for i,yy in enumerate(ys):
      hw=math.sqrt(max(0,rr*rr-yy*yy))*0.92; pts=[(c[0]-hw,c[1]+yy),(c[0]+hw,c[1]+yy)]
      if a1-a0<360: pts=[p for p in pts if a0<=math.degrees(math.atan2(p[1]-c[1],p[0]-c[0]))%360<=a1 or a1>=360]
      d.line(pts if i%2==0 else pts[::-1],fill=RED,width=3)
def gas(cx,cy,w,h,ang):
  x,y=cx-w/2,cy-h/2; stroke(rot(rrect(x,y,w,h,14),(cx,cy),ang),w=4)
  stroke(rot([(x-w*0.06,y-h*0.12),(x+w*1.06,y-h*0.12)],(cx,cy),ang),w=5)  # hood
  pw=(w*0.8)/5
  for k in range(5):
    px=x+w*0.1+k*pw; stroke(rot(rrect(px+4,y+h*0.2,pw-8,h*0.6,3),(cx,cy),ang),col=RED,w=3,passes=1)
# ---- layout
BASE=1320; TOPL=620; HL=BASE-TOPL
d.text((120,90),'SKETCH BOARD  ·  BROMIC, SPELLED IN PRODUCT',font=F(SB,34),fill=RED)
d.text((120,140),'Every Letter Is A Heater',font=F(DID,96),fill=INK)
d.text((120,262),'Concept for a brand banner and end card: the six letters drawn only with real Bromic product forms. Pencil first; the final is built from product renders and photography.',font=F(LT,34),fill=STEEL)
X=[260,800,1360,2130,2800,3110]
# B: vertical Tungsten stem + two half Eclipse rings
x=X[0]; linear(x,(TOPL+BASE)/2,HL,110,math.pi/2)
r=HL/4.2; eclipse((x+40,TOPL+r*1.02),r,-90,90); eclipse((x+40,BASE-r*1.1),r*1.1,-90,90)
# R: stem + half ring + tilted Platinum Gas leg
x=X[1]; linear(x,(TOPL+BASE)/2,HL,110,math.pi/2)
eclipse((x+40,TOPL+r*1.05),r*1.05,-90,90); gas(x+230,BASE-150,260,170,math.radians(55))
# O: full Eclipse front view + logo accent strokes as heat
x=X[2]; R=HL/2*0.98; eclipse((x+120,(TOPL+BASE)/2),R)
for k in range(3): d.line([(x+170+k*28,TOPL-95),(x+120+k*28,TOPL-20)],fill=RED,width=10)
# M: two vertical linears + two tilted linears meeting low in the middle
x=X[3]; linear(x-230,(TOPL+BASE)/2,HL,100,math.pi/2); linear(x+310,(TOPL+BASE)/2,HL,100,math.pi/2)
linear(x-50,TOPL+HL*0.36,HL*0.74,82,math.radians(60)); linear(x+130,TOPL+HL*0.36,HL*0.74,82,math.radians(120))
# I: Tungsten freestanding gas tower
x=X[4]
for dx in (-35,40):
  stroke([(x+dx+18*math.sin(t/12*math.pi*1.3),TOPL+130+t*(HL-260)/12) for t in range(13)],w=6)
stroke(rrect(x-120,BASE-140,230,140,30),w=5); gas(x+10,TOPL+60,250,120,0)
# C: Eclipse freestanding: arc pole forming the C, disc at the top end, base at the bottom end
x=X[5]; Rc=HL/2*0.86; c=(x+Rc,(TOPL+BASE)/2)
stroke(circle(c,Rc,45,315,80),w=7)
top=circle(c,Rc,315,315,1)[0]; eclipse((top[0]+70,top[1]+30),90)
bot=circle(c,Rc,45,45,1)[0]; stroke(rrect(bot[0]-60,bot[1]-5,200,70,20),w=5)
# baseline
d.line([(140,BASE+40),(W-140,BASE+40)],fill=(200,195,186),width=2)
notes=[('B','Tungsten Electric, vertical, as the stem. Two Eclipse rings, halved, as the bowls; their halo light traces the curve.'),
 ('R','Tungsten stem and one Eclipse bowl. The leg is Platinum Gas on its tilt bracket, angled like the real install.'),
 ('O','One Eclipse, face on: the ring, the halo, the red coil. Three heat strokes above it echo the accent in the Bromic logo.'),
 ('M','Two Tungsten heaters upright, two more tilted to meet low in the middle. Tilt angles stay within what the brackets allow.'),
 ('I','Tungsten Freestanding Gas: the tall curved tower and its head read as one upright stroke.'),
 ('C','Eclipse Freestanding: its arcing pole is the C, the disc at the top end, the weighted base at the bottom.')]
cw=(W-240)/6
for i,(L,t) in enumerate(notes):
  x0=120+i*cw; y0=BASE+110
  d.text((x0,y0),L,font=F(DID,90),fill=INK); words=t.split(); line=''; y=y0+120
  for w_ in words:
    if d.textlength(line+' '+w_,font=F(LT,27))>cw-50: d.text((x0,y),line.strip(),font=F(LT,27),fill=INK); y+=38; line=''
    line+=' '+w_
  d.text((x0,y),line.strip(),font=F(LT,27),fill=INK)
d.text((120,H-90),'Next: build each letter from real renders and photos, every product shown as it really looks and installs, with its Affinity Smart-Heat® Controls named in any ad that carries it.',font=F(LT,28),fill=STEEL)
out='/home/user/Bromic_Marketing/images/portfolio/bromic-wordmark-sketch.png'; im.save(out); im.thumbnail((2000,2000)); im.save('/tmp/claude-0/-home-user/0ea6ef7b-27b7-5460-ab43-18d94f10d5f1/scratchpad/word/view.png'); print('ok')
