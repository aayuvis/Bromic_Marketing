import sys, glob
sys.path.insert(0,'/tmp/claude-0/-home-user/0ea6ef7b-27b7-5460-ab43-18d94f10d5f1/scratchpad/b8')
from crops import C
from PIL import Image
import numpy as np
C['own-fsgas']=('owner/tungsten-fs-gas-dusk',(130,0,1360,1067)); C['own-t2']=('owner/tungsten-ii-dusk',(0,0,894,807))
OPT={
 'a':['ecl-halo','pe-cedar-night','tp-london','pg-centrico','pe-led'],
 'b':['pe-white','pg-bracket','ecl-mandarin','tp-strx','pe-recess'],
 'c':['pe-close','tg-post','ecl-paris','tp-deck','pg-louvre'],
 'd':['ecl-desert','pe-atrium','own-fsgas','aff-keypad','pe-cedar-night'],
 'e':['own-t2','pe-led','ecl-uk','tg-post','pe-close'],
}
H=800; BL=100; TOP=200
logo=Image.open('/home/user/Bromic_Marketing/decks/img/logo.png').convert('RGBA'); logo.thumbnail((480,135))
O='/home/user/Bromic_Marketing/images/portfolio/options/'; import os; os.makedirs(O,exist_ok=True)
for k,ids in OPT.items():
  tiles=[]
  for i in ids:
    f,b=C[i]; im=Image.open(glob.glob(f+'.*')[0]).convert('RGB').crop(b); s=H/im.height; tiles.append(np.array(im.resize((round(im.width*s),H),Image.LANCZOS)).astype(float))
  W=sum(t.shape[1] for t in tiles)-BL*(len(tiles)-1); out=np.zeros((H,W,3)); x=0
  for n,t in enumerate(tiles):
    w=t.shape[1]
    if n==0: out[:,x:x+w]=t
    else:
      a=np.ones(w); a[:BL]=np.linspace(0,1,BL); out[:,x:x+w]=out[:,x:x+w]*(1-a[None,:,None])+t*a[None,:,None]
    x+=w-BL
  full=Image.new('RGB',(W,H+TOP),'white'); full.paste(Image.fromarray(np.clip(out,0,255).astype(np.uint8)),(0,TOP)); full.paste(logo,((W-logo.width)//2,(TOP-logo.height)//2+4),logo)
  full.save(O+f'banner-{k}.jpg',quality=90); full.save(O+f'banner-{k}.webp',quality=86); print(k,full.size)
