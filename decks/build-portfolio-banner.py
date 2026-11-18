from PIL import Image
import numpy as np, glob
R='/home/user/Bromic_Marketing/images/_raw/'
H=800; BL=110; TOP=200
P=[ # file, crop box in source px (x0,y0,x1,y1)
 ('closeups2/w-bromic-eclipse-pendant-light', (380,180,1600,1067)),
 ('closeups2/w-kion-sui-madrid-spain-tungsten-electric-4', (150,180,2150,1600)),
 ('closeups2/w-dsc05545-courtney-saib', (150,180,2560,1650)),
 ('closeups2/w-commercial-australia-brisbane-kedron-wavell-', (60,140,899,980)),
 ('closeups/ep-disc', (640,0,2440,1080)),
]
tiles=[]
for f,b in P:
  im=Image.open(glob.glob(R+f+'.*')[0]).convert('RGB').crop(b); s=H/im.height; im=im.resize((round(im.width*s),H),Image.LANCZOS); tiles.append(np.array(im).astype(float)); print(f.split('/')[-1][:30], im.size)
W=sum(t.shape[1] for t in tiles)-BL*(len(tiles)-1)
out=np.zeros((H,W,3)); x=0
for i,t in enumerate(tiles):
  w=t.shape[1]; a=np.ones(w)
  if i>0: a[:BL]=np.linspace(0,1,BL)
  if i==0: out[:,x:x+w]=t
  else:
    out[:,x:x+w]=out[:,x:x+w]*(1-a[None,:,None])+t*a[None,:,None]
  x+=w-BL
pano=Image.fromarray(np.clip(out,0,255).astype(np.uint8))
full=Image.new('RGB',(W,H+TOP),'white'); full.paste(pano,(0,TOP))
logo=Image.open('/home/user/Bromic_Marketing/decks/img/logo.png').convert('RGBA'); logo.thumbnail((480,135)); full.paste(logo,((W-logo.width)//2,(TOP-logo.height)//2+4),logo)
O='/tmp/claude-0/-home-user/0ea6ef7b-27b7-5460-ab43-18d94f10d5f1/scratchpad/b8/'
full.save(O+'stitch.jpg',quality=92); v=full.copy(); v.thumbnail((2000,2000)); v.save(O+'stitch-view.png'); print(full.size)
