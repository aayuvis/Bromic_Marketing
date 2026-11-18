from PIL import Image, ImageDraw, ImageFilter, ImageChops
import numpy as np
S='/home/user/Bromic_Marketing/images/_raw/studio/'; O='/tmp/claude-0/-home-user/0ea6ef7b-27b7-5460-ab43-18d94f10d5f1/scratchpad/word/cut/'
B8='/tmp/claude-0/-home-user/0ea6ef7b-27b7-5460-ab43-18d94f10d5f1/scratchpad/b8/'
def key(im,thresh=22):
  rgb=im.convert('RGB'); w,h=rgb.size; m=rgb.copy()
  for p in [(0,0),(w-1,0),(0,h-1),(w-1,h-1),(w//2,0),(w//2,h-1),(0,h//2),(w-1,h//2)]:
    if sum(m.getpixel(p))>600: ImageDraw.floodfill(m,p,(255,0,255),thresh=thresh)
  a=np.array(m); bg=(a[...,0]==255)&(a[...,1]==0)&(a[...,2]==255)
  al=Image.fromarray(np.where(bg,0,255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.9))
  out=rgb.convert('RGBA'); out.putalpha(al); return out.crop(out.getbbox())
def save(n,im): im.save(O+n+'.png'); print(n,im.size)
st=Image.open(S+'w-tungelec-stacked.png').convert('RGB'); save('tungsten',key(st.crop((0,560,1080,1080))))
save('platinum',key(Image.open(S+'w-platinum-black.png')))
save('gas',key(Image.open(S+'w-bromic-platinum-gas-300-on.jpg')))
save('portable',key(Image.open(S+'w-tung-port.png')))
p=Image.open(S+'w-eclipse-straight-mount-1.png').convert('RGBA'); save('pendant',p.crop(p.getbbox()))
save('efs',Image.open(B8+'4-cut.png').convert('RGBA'))
f=Image.open(S+'w-eclipse-electric-face.png').convert('RGBA'); a=np.array(f.convert('L')).astype(int); ys,xs=np.where(a<70)
cx,cy=(xs.min()+xs.max())/2,(ys.min()+ys.max())/2; R=(xs.max()-xs.min())/2+12
yy,xx=np.mgrid[0:f.height,0:f.width]; dd=np.sqrt((xx-cx)**2+(yy-cy)**2); f.putalpha(Image.fromarray((np.clip((R-dd)/3,0,1)*255).astype(np.uint8)))
save('eface',f.crop(f.getbbox()))
# check sheet on magenta
import glob,os
fs=sorted(glob.glob(O+'*.png')); s=Image.new('RGB',(330*len(fs),330),(255,0,255))
for i,fn in enumerate(fs):
  t=Image.open(fn); t.thumbnail((320,320)); s.paste(t,(i*330,5),t)
s.save(O+'../cutcheck.png')
