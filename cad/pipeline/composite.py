import json,sys,cv2,numpy as np
S='/tmp/claude-0/-home-user/0ea6ef7b-27b7-5460-ab43-18d94f10d5f1/scratchpad/comp'
k=sys.argv[1]; job=json.load(open(S+'/jobs.json'))[k]; P=json.load(open(S+'/pts.json'))[k]
orig=cv2.imread(f"/home/user/Bromic_Marketing/images/library/{job['id']}.webp").astype(np.float32)/255
clean=cv2.imread(f'{S}/clean/{k}.png').astype(np.float32)/255
H,W=orig.shape[:2]
# 1) where the old heater + mounts were: diff inside an expanded box around each quad
m=np.zeros((H,W),np.float32)
d=np.abs(clean-orig).max(2)
for q in P[1]:
  q=np.array(q,np.float32); c=q.mean(0); big=(q-c)*np.array([1.3,5.0])+c  # generous box, more in height for brackets
  x0,y0=np.maximum(0,big.min(0)-40).astype(int); x1,y1=np.minimum([W,H],big.max(0)+40).astype(int)
  sub=(d[y0:y1,x0:x1]>0.10).astype(np.uint8)
  sub=cv2.morphologyEx(sub,cv2.MORPH_CLOSE,np.ones((15,15),np.uint8)); sub=cv2.dilate(sub,np.ones((9,9),np.uint8))
  m[y0:y1,x0:x1]=np.maximum(m[y0:y1,x0:x1],sub)
  cv2.fillConvexPoly(m,cv2.convexHull(((q-c)*1.12+c).astype(np.int32)),1)
roi=np.zeros((H,W),np.uint8)
for (x0,y0,x1,y1) in json.load(open(S+'/match.json'))[k].get('erase',[]):
  m[y0:y1,x0:x1]=1; roi[y0:y1,x0:x1]=1
for q in P[1]:
  q=np.array(q,np.float32); c=q.mean(0); ext=np.ptp(q,0)
  x0,y0=np.maximum(0,c-ext*0.8-30).astype(int); x1,y1=np.minimum([W,H],c+ext*0.8+30).astype(int); roi[y0:y1,x0:x1]=1
g=((cv2.GaussianBlur(d,(0,0),2)>0.14)&(roi>0)).astype(np.uint8)
g=cv2.morphologyEx(g,cv2.MORPH_OPEN,np.ones((3,3),np.uint8))
n,lab,st,_=cv2.connectedComponentsWithStats(g)
for j in range(1,n):
  if st[j,4]>W*H*0.0004:
    blob=(lab==j).astype(np.uint8); m=np.maximum(m,cv2.dilate(cv2.morphologyEx(blob,cv2.MORPH_CLOSE,np.ones((21,21),np.uint8)),np.ones((11,11),np.uint8)).astype(np.float32))
m=cv2.GaussianBlur(m,(0,0),3)[...,None]
cv2.imwrite(S+f'/out/{k}_mask.png',(m[...,0]*255).astype(np.uint8))
# Poisson-blend the clean plate into the original so tones meet without a seam
mk=(m[...,0]>0.02).astype(np.uint8)*255
P=20; o8=cv2.copyMakeBorder((orig*255).astype(np.uint8),P,P,P,P,cv2.BORDER_REFLECT); c8=cv2.copyMakeBorder((clean*255).astype(np.uint8),P,P,P,P,cv2.BORDER_REFLECT)
mk=cv2.copyMakeBorder(mk,P,P,P,P,cv2.BORDER_CONSTANT,value=0)
base=orig.copy()
if mk.any():
  x,y,w,h=cv2.boundingRect(mk)
  bl=cv2.seamlessClone(c8,o8,mk,(x+w//2,y+h//2),cv2.NORMAL_CLONE)[P:-P,P:-P].astype(np.float32)/255
  base=orig*(1-m)+bl*m
for (x0,y0,x1,y1) in json.load(open(S+'/match.json'))[k].get('erase',[]):
  e=np.zeros((H,W),np.float32); e[y0:y1,x0:x1]=1; e=cv2.GaussianBlur(e,(0,0),6)[...,None]
  cl=clean+(orig[y1:y1+30,x0:x1].reshape(-1,3).mean(0)-clean[y1:y1+30,x0:x1].reshape(-1,3).mean(0))*0.0
  base=base*(1-e)+cl*e

# 2) matched-camera render (full = heater + caught shadow, _h = heater only)
cfg=json.load(open(S+'/match.json'))[k]
def rd(p):
  r=cv2.imread(p,cv2.IMREAD_UNCHANGED).astype(np.float32)/255; return cv2.resize(r,(W,H),interpolation=cv2.INTER_AREA)
full=rd(S+'/r/'+cfg['render']); hon=rd(S+'/r/'+cfg['render'].replace('.png','_h.png'))
a=hon[...,3:]; ah=hon[...,3]
rgb=np.clip(hon[...,:3]/np.maximum(ah,1e-3)[...,None],0,1)
core=(ah>0.85).astype(np.float32)
num=cv2.GaussianBlur(rgb*core[...,None],(0,0),2); den=cv2.GaussianBlur(core,(0,0),2)[...,None]
fill=num/np.maximum(den,1e-4)
wfill=np.clip((0.85-ah)/0.85,0,1)[...,None]
rgb=rgb*(1-wfill)+fill*wfill
shadow=np.clip(full[...,3]-hon[...,3],0,1)
# the surface the heater is mounted on: flood-fill the clean plate from just around the heater
b8=(base*255).astype(np.uint8); surf=np.zeros((H+2,W+2),np.uint8)
ring=cv2.dilate((a[...,0]>0.3).astype(np.uint8),np.ones((9,9),np.uint8))-cv2.dilate((a[...,0]>0.3).astype(np.uint8),np.ones((5,5),np.uint8))
ys,xs=np.where(ring>0); tol=cfg.get('surf_tol',14)
for i in np.linspace(0,len(xs)-1,min(40,len(xs))).astype(int):
  if surf[ys[i]+1,xs[i]+1]==0:
    cv2.floodFill(b8.copy(),surf,(int(xs[i]),int(ys[i])),0,(tol,)*3,(tol,)*3,cv2.FLOODFILL_MASK_ONLY|(255<<8)|4)
surf=cv2.GaussianBlur((surf[1:-1,1:-1]>0).astype(np.float32),(0,0),2)
if cfg.get('surf_all'): surf=np.ones_like(surf)
cv2.imwrite(f'{S}/out/{k}_surf.png',(surf*255).astype(np.uint8))
sh=cv2.GaussianBlur(shadow,(0,0),cfg.get('soft',0.7))*surf*cfg.get('shadow_k',0.8)
blk=np.array(cfg.get('black',[0.06,0.04,0.035]),np.float32)[::-1]
rgb=blk+rgb*(1-blk)
# --- integrate the heater into the photograph ---
A0=a[...,0].copy()
dt=cv2.distanceTransform((A0>0.5).astype(np.uint8),cv2.DIST_L2,5); hh=max(6.0,float(dt.max())*2)   # heater's short dimension in px
sig=cfg.get('soft',max(0.9,W/1500)); rgb=cv2.GaussianBlur(rgb,(0,0),sig); A=cv2.GaussianBlur(A0,(0,0),sig*0.9)
bgS=cv2.GaussianBlur(base,(0,0),hh*0.25); bgL=cv2.GaussianBlur(base,(0,0),hh*1.5)
# scene haze / veiling light and slightly lower contrast, so the heater lives in the same air as the photo
hz=cfg.get('haze',0.035); m=rgb.reshape(-1,3)[A0.ravel()>0.5].mean(0) if (A0>0.5).any() else rgb.mean((0,1))
emis=((rgb[...,2]>rgb[...,0]*1.4)&(rgb[...,2]>0.35)).astype(np.float32)
emis=cv2.GaussianBlur(emis,(0,0),1)[...,None]
import os
_fin=json.load(open(S+f'/sp_{k}.json')).get('finish','black') if os.path.exists(S+f'/sp_{k}.json') else 'black'
rgb=rgb*(1-(1-emis)*(1-cfg.get('body_k',0.72 if _fin=='black' else 1.08)))
gry=rgb.mean(2,keepdims=True); rgb=rgb*(emis+(1-emis)*0.35)+gry*(1-emis)*0.65
rgb=m+(rgb-m)*cfg.get('contrast',0.96); rgb=rgb*(1-hz)+bgL*hz
# light wrap on the outline
edge=np.clip(A-cv2.erode(A,np.ones((3,3),np.uint8),iterations=1),0,1)*A
bgE=cv2.GaussianBlur(base,(0,0),3)
rgb=rgb*(1-0.18*edge[...,None])+bgE*0.18*edge[...,None]
# occlusion where the heater meets the surface + soft drop shadow from the scene light
dil=cv2.dilate(A0,np.ones((3,3),np.uint8),iterations=max(1,int(hh*0.08)))
ao=np.clip(cv2.GaussianBlur(dil,(0,0),hh*0.35)-A0,0,1)
ox,oy=cfg.get('drop',[0.12,0.45]); M2=np.float32([[1,0,ox*hh],[0,1,oy*hh]])
drop=cv2.GaussianBlur(cv2.warpAffine(A0,M2,(W,H)),(0,0),hh*0.55)
dark=np.clip(cfg.get('ao_k',0.5)*ao+cfg.get('drop_k',0.42)*drop,0,0.6)*surf*(1-A)
out=base*(1-sh[...,None])*(1-dark[...,None])
em=np.clip(rgb[...,2]-0.5,0,None)*(rgb[...,2]>rgb[...,0]*1.5)*A
for s_,g_ in ((hh*0.8,0.35),(hh*3,0.2)):
  out=out+cv2.GaussianBlur(em,(0,0),s_)[...,None]*np.array([0.25,0.5,1.0],np.float32)*g_*cfg.get('spill',0.6)*surf[...,None]
out=out*(1-A[...,None])+rgb*A[...,None]
# photo grain over the whole heater area (clumped like the photo's)
g=cv2.GaussianBlur(np.random.default_rng(2).normal(0,1,(H,W)).astype(np.float32),(0,0),0.7)
out=out+(g*cfg.get('grain',0.012))[...,None]*A[...,None]
# a touch of the photo's JPEG softness: down/up resample in the heater area
lo=cv2.resize(cv2.resize(out,(W//2,H//2),interpolation=cv2.INTER_AREA),(W,H),interpolation=cv2.INTER_LINEAR)
wz=cv2.GaussianBlur(cv2.dilate(A,np.ones((7,7),np.uint8)),(0,0),3)[...,None]*0.35
out=out*(1-wz)+lo*wz
cv2.imwrite(f'{S}/out/{k}.png',np.clip(out*255,0,255).astype(np.uint8)); print('ok',k)
