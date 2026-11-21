import sys, numpy as np
from PIL import Image, ImageFilter
W,H=2160,2700; x0,x1,yb=240,1925,1662
yy,xx=np.mgrid[0:H,0:W].astype(np.float32); cx=(x0+x1)/2; hw=(x1-x0)/2
d=np.clip(yy-yb,0,None); below=(yy>yb)
blur=lambda m,r: np.asarray(Image.fromarray((np.clip(m,0,1)*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r))).astype(np.float32)/255
slot=blur(((xx>320)&(xx<1820)&(yy>1500)&(yy<1630)).astype(np.float32)*0.35,10)
v=sys.argv[1]
if v=='A':   # halo: a soft ellipse of warmth hugging the heater, no cone
    a=np.exp(-((xx-cx)/(hw*0.95))**8)*np.exp(-(d/260.0)**1.3)*below*0.9
    a=blur(a,60); col=(255,170,90)
elif v=='B': # sunbeam: a tall, very wide, faint wash that reaches the ground, like evening sun
    half=hw+d*0.9; e=np.clip((half-np.abs(xx-cx))/(300+d),0,1)
    a=e*np.exp(-d/900.0)*below*1.0; a=blur(a,80); col=(255,185,120)
elif v=='C': # pool: light falls to a warm pool on the scene below, little in the air
    air=np.exp(-((xx-cx)/(hw*0.9))**6)*np.exp(-d/220.0)*below*0.7
    pool=np.exp(-((xx-cx)/(hw*1.1))**2-((yy-2200)/260.0)**2)*1.0
    a=blur(air+pool,70); col=(255,160,80)
elif v=='D': # ember: deeper amber, short, rich; the heater reads hot
    half=hw+d*0.35; e=np.clip((half-np.abs(xx-cx))/(120+d*0.5),0,1)
    a=e*np.exp(-d/330.0)*below*1.0; a=blur(a,40); col=(255,135,55)
a[:yb-4]*=0; a=np.clip(blur(a,5)+slot,0,1)
Image.fromarray((a[...,None]*np.array(col,np.float32)).clip(0,255).astype(np.uint8)).save(f'glow{v}.png')
