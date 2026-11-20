import json,cv2,numpy as np,sys
S='/tmp/claude-0/-home-user/0ea6ef7b-27b7-5460-ab43-18d94f10d5f1/scratchpad/comp'
GL='/tmp/claude-0/-home-user/0ea6ef7b-27b7-5460-ab43-18d94f10d5f1/scratchpad/cad/glb/'
WALL=GL+'6kW diamond, angled wall mount.glb'; CEIL=GL+'3kW diamond black, ceiling mount.glb'
P=json.load(open(S+'/pts.json')); J=json.load(open(S+'/jobs.json')); M=json.load(open(S+'/match.json'))
P['X']=['d-tungsten-louvre-detail',[[[171,674],[1143,211],[1229,417],[211,811]]],'black',2]
SC={ # key: mode, mount, light, finish
'K4':('ends','wall','dusk','black'),'R':('ends','wall','day','black'),'n20':('ends','wall','dusk','black'),'n10':('ends','wall','dusk','black'),
'q22':('ends','wall','night','black'),'n12':('ends','ceiling','day','black'),'n15':('ends','ceiling','day','white'),'n16':('ends','wall','day','black'),
'n18':('ends','wall','day','black'),'F':('ends','wall','day','white'),'q98':('ends','wall','dusk','black'),'q82':('ends','wall','day','black'),'O':('ends','wall','dusk','black'),
'X':('pnp','ceiling','day','black'),'H':('pnp','ceiling','dusk','black'),'M':('pnp','ceiling','dusk','black'),'N':('pnp','ceiling','day','black'),
'T':('pnp','ceiling','day','white'),'U':('pnp','ceiling','day','white'),'G':('pnp','ceiling','dusk','black'),'L':('ends','ceiling','dusk','black'),'I':('ends','wall','dusk','black')}
P.setdefault('G',['w-dsc00012',[[[137,379],[1289,622],[1210,703],[130,497]]],'black',0])
P['K4']=P['K']
GLOW={'day':1.6,'dusk':2.4,'night':2.8}
lin=lambda c: ((c+0.055)/1.055)**2.4 if c>0.04045 else c/12.92
OBJ=np.array([[-.711,-.027,.088],[.711,-.027,.088],[.711,-.027,-.088],[-.711,-.027,-.088]],np.float64)
def ends(q):
  q=np.array(q,float); s=[np.linalg.norm(q[i]-q[(i+1)%4]) for i in range(4)]
  if s[0]+s[2] > s[1]+s[3]:  # sides 1 and 3 are the short ends
    a=(q[1]+q[2])/2; b=(q[3]+q[0])/2
  else: a=(q[0]+q[1])/2; b=(q[2]+q[3])/2
  return (a,b) if a[0]<b[0] else (b,a)
for k,(mode,mount,light,fin) in SC.items():
  i,quads=P[k][0],P[k][1]
  im=cv2.imread(f'/home/user/Bromic_Marketing/images/library/{i}.webp'); H,W=im.shape[:2]; f=1.1*max(W,H); cx,cy=W/2,H/2
  hs=[]
  for q in quads:
    if mode=='ends':
      L,R=ends(q)
      def proj(Pp): return np.array([cx+f*Pp[0]/Pp[1], cy-f*Pp[2]/Pp[1]])
      def res(x):
        d=np.array([np.cos(x[3]),np.sin(x[3]),0]); return np.r_[proj(x[:3]-0.705*d)-L, proj(x[:3]+0.705*d)-R, 3*x[3]]
      D0=f*1.41/np.linalg.norm(R-L); m=(L+R)/2; best=None
      for yd in np.arange(-80,81,2.0):
        x=np.array([(m[0]-cx)*D0/f,D0,(cy-m[1])*D0/f,np.radians(yd)])
        for it in range(40):
          r=res(x); Jm=np.zeros((5,3))
          for j in range(3):
            e=np.zeros(4); e[j]=1e-6; Jm[:,j]=(res(x+e)-r)/1e-6
          st=np.linalg.lstsq(Jm,r,rcond=None)[0]; x[:3]-=st
          if x[1]<0.5: x[1]=0.5
        sc=np.abs(res(x)[:4]).max()+0.02*abs(yd)
        if best is None or sc<best[0]: best=(sc,x.copy())
      x=best[1]
      for it in range(40):
        r=res(x); Jm=np.zeros((5,4))
        for j in range(4):
          e=np.zeros(4); e[j]=1e-6; Jm[:,j]=(res(x+e)-r)/1e-6
        x2=x-np.linalg.lstsq(Jm,r,rcond=None)[0]
        if x2[1]>0.5 and abs(x2[3])<1.5: x=x2
      hs.append({'glb':WALL if mount=='wall' else CEIL,'mount':mount,'dx':x[0],'D':x[1],'h':x[2],'yaw':float(np.degrees(x[3]))})
      print(k,'ends D=%.2f yaw=%.1f res=%.1f'%(x[1],np.degrees(x[3]),np.abs(res(x)[:4]).max()))
    else:
      Kc=np.array([[f,0,cx],[0,f,cy],[0,0,1]]); q=np.array(q,float); best=None
      for order in (q,q[[1,0,3,2]],q[[3,2,1,0]],q[[2,3,0,1]]):
        n,rvs,tvs,errs=cv2.solvePnPGeneric(OBJ,order,Kc,None,flags=cv2.SOLVEPNP_IPPE)
        for rv,tv,e in zip(rvs,tvs,errs):
          Rm,_=cv2.Rodrigues(rv); t=tv.ravel(); to_cam=-(Rm@np.array([0,-.027,0])+t)
          if (-Rm[:,1])@to_cam<=0: continue
          post=Rm@(np.array([0,0.876,-0.484]) if mount=='wall' else np.array([0,1.,0]))
          upv=Rm@(np.array([0,0.484,0.876]) if mount=='wall' else np.array([0,1.,0]))
          e=float(np.ravel(e)[0])+(0 if post@to_cam<0 else 100)+(0 if upv[1]<0 else 60)
          if best is None or e<best[0]: best=(e,rv.ravel().tolist(),t.tolist())
      hs.append({'glb':WALL if mount=='wall' else CEIL,'mount':mount,'pose':{'r':best[1],'t':best[2]}})
      print(k,'pnp err %.1f dist %.2f'%(best[0],np.linalg.norm(best[2])))
  allq=np.vstack(quads); x0,y0=allq.min(0).astype(int); x1,y1=allq.max(0).astype(int); pad=int(max(x1-x0,y1-y0)*0.4)
  reg=im[max(0,y0-pad):y1+pad,max(0,x0-pad):x1+pad].reshape(-1,3)[:,::-1]/255.
  amb=[lin(c) for c in np.median(reg,0)]
  if mount=='ceiling': sd={'day':[0.2,-0.9,-0.35],'dusk':[0.25,-0.85,-0.3],'night':[0.2,-0.8,-0.4]}[light]
  else: sd={'day':[-0.25,-0.85,0.45],'dusk':[0.2,-0.9,0.35],'night':[0.15,-0.9,0.4]}[light]
  spec={'W':W,'H':H,'f':f,'finish':fin,'glow':GLOW[light],'heaters':hs,'amb':amb,'amb_strength':{'day':0.9,'dusk':0.6,'night':0.45}[light],
        'sun':{'dir':sd,'e':{'day':3.0,'dusk':1.4,'night':0.7}[light],'angle':{'day':14,'dusk':22,'night':30}[light],'col':[1,0.95,0.9] if light=='day' else [1,0.85,0.72]},'samples':128}
  if mode=='pnp': spec['scale']=1.0; spec['samples']=64
  if k=='K4':
    import copy; spec['heaters']=json.load(open(S+'/K3d.json'))['heaters']; spec['f']=983.0
  json.dump(spec,open(f'{S}/sp_{k}.json','w'),indent=1)
  blk=(np.percentile(im.reshape(-1,3),1,axis=0)/255.)[::-1].tolist()   # BGR->RGB? keep BGR order for comp (it reverses)
  M[k]={'render':f'f_{k}.png','black':[float(v) for v in np.percentile(im.reshape(-1,3)[:,::-1],1,axis=0)/255.],'soft':0.7 if mode=='ends' else 0.9,'spill':{'day':0.35,'dusk':0.6,'night':0.7}[light],'shadow_k':0.55,'erase':M.get(k,{}).get('erase',[]),'grain':0.012}
  J[k]={'id':i,'glow':P[k][3],'lum':0.5}
json.dump(P,open(S+'/pts.json','w')); json.dump(J,open(S+'/jobs.json','w')); json.dump(M,open(S+'/match.json','w'))
