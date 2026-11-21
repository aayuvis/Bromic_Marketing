import cv2, numpy as np, sys
def sketch(src, dst, glow=True, wash=0.35):
    im=cv2.imread(src); im=cv2.resize(im,None,fx=1,fy=1)
    g=cv2.cvtColor(im,cv2.COLOR_BGR2GRAY)
    inv=255-g; bl=cv2.GaussianBlur(inv,(0,0),5)
    dodge=cv2.divide(g,255-bl,scale=256).astype(np.float32)/255
    dodge=np.clip(dodge,0,1)**1.8            # darker lines
    # crisp ink edges
    e=cv2.Canny(cv2.GaussianBlur(g,(3,3),0),60,140).astype(np.float32)/255
    e=cv2.GaussianBlur(e,(0,0),0.7)
    line=np.clip(dodge*(1-0.55*e),0,1)
    # watercolour wash: smoothed, desaturated colour
    sm=cv2.bilateralFilter(im,9,60,60); sm=cv2.edgePreservingFilter(sm,flags=1,sigma_s=40,sigma_r=0.5)
    hsv=cv2.cvtColor(sm,cv2.COLOR_BGR2HSV).astype(np.float32); hsv[...,1]*=0.55; hsv[...,2]=np.clip(hsv[...,2]*1.1+25,0,255)
    wc=cv2.cvtColor(hsv.astype(np.uint8),cv2.COLOR_HSV2BGR).astype(np.float32)/255
    paper=np.ones_like(wc)*np.array([0.955,0.965,0.97])  # warm white (BGR)
    base=paper*(1-wash)+wc*wash
    out=base*line[...,None]
    if glow:
        h=cv2.cvtColor(im,cv2.COLOR_BGR2HSV).astype(np.float32)
        hue=h[...,0]; s=h[...,1]/255; v=h[...,2]/255
        m=((hue<14)|(hue>170)).astype(np.float32)*np.clip((s-0.6)*4,0,1)*np.clip((v-0.62)*4,0,1)
        m=cv2.GaussianBlur(m,(0,0),3); m=np.clip(m*1.6,0,1)
        halo=cv2.GaussianBlur(m,(0,0),20)*0.3
        flame=np.array([0x23,0x41,0xEF],np.float32)/255
        o=im.astype(np.float32)/255
        out=out*(1-halo[...,None])+ (out*0.5+flame*0.5)*halo[...,None]
        out=out*(1-m[...,None])+o*m[...,None]
    # paper grain
    n=np.random.default_rng(1).normal(0,0.018,g.shape).astype(np.float32)
    out=np.clip(out+n[...,None],0,1)
    cv2.imwrite(dst,(out*255).astype(np.uint8),[cv2.IMWRITE_JPEG_QUALITY,88])
if __name__=='__main__':
    for a in sys.argv[1:]:
        i,o=a.split(':'); sketch(i,o)
