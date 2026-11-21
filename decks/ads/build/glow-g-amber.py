import sys, numpy as np
from PIL import Image, ImageFilter
W,H=2160,2700; x0,x1,yb=240,1925,1662
yy,xx=np.mgrid[0:H,0:W].astype(np.float32); cx=(x0+x1)/2; hw=(x1-x0)/2
d=np.clip(yy-yb,0,None); below=(yy>yb)
blur=lambda m,r: np.asarray(Image.fromarray((np.clip(m,0,1)*255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(r))).astype(np.float32)/255
rng=np.random.default_rng(3)
def stri(n,wmin,wmax,amp,fan):
    s=np.zeros((H,W),np.float32)
    for c in rng.uniform(x0+40,x1-40,n):
        xc=c+(c-cx)/hw*fan*d; w=rng.uniform(wmin,wmax)+d*0.04
        s+=np.exp(-((xx-xc)/w)**2)*rng.uniform(0.4,1.0)
    return s/s.max()*amp
v=sys.argv[1]; P=dict(E=(1.5,1000,0.22,0.30,(255,160,85)),F=(1.7,1300,0.40,0.20,(255,170,100)),G=(1.35,800,0.14,0.35,(255,140,65)))[v]
amp,falld,fan,strmix,col=P
half=hw+d*fan; e=np.clip((half-np.abs(xx-cx))/(90+d*0.35),0,1); e=e*e*(3-2*e)
fall=np.exp(-(d/falld)**1.4)*below
base=e*fall*amp
s=blur(stri(55,14,40,1.0,fan),14)        # soft vertical striations, like light through mist
mist=base*((1-strmix)+strmix*1.6*s)
lip=np.clip((hw-40-np.abs(xx-cx))/80,0,1)*np.exp(-((yy-(yb+18))/40.0)**2)*1.0*below
a=np.clip(blur(mist,10)+blur(lip,12),0,1)
if v=='F':  # warmth landing on the scene below
    a=np.clip(a+blur(np.exp(-((xx-cx)/(hw*1.2))**2-((yy-2300)/260.0)**2)*0.45,60),0,1)
a[:yb-3]*=0; a=blur(a,3)
t=np.clip(d/900,0,1)[...,None]
c0=np.array(col,np.float32); c1=c0*np.array([1,0.85,0.8])
cmix=(c0*(1-t)+c1*t)
r=np.clip((xx-1000)/160,0,1)[...,None]             # 0 on the white half, 1 on the black half
amber=np.array([255,118,30],np.float32)
cmix=cmix*(1-r)+amber*r
a=np.clip(a*(1+0.18*r[...,0]),0,1)
Image.fromarray((a[...,None]*cmix).clip(0,255).astype(np.uint8)).save(f'glow{v}2.png')
