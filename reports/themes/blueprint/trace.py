"""Trace a frontal Bromic product render into clean line art (transparent PNG, one colour).
Usage: python3 trace.py <render.jpg> <out.png> <hex colour>"""
import sys, cv2, numpy as np
src, out, col = sys.argv[1], sys.argv[2], sys.argv[3].lstrip('#')
im = cv2.imread(src)
g = cv2.cvtColor(im, cv2.COLOR_BGR2GRAY)
# crop to the product: anything clearly darker or more saturated than the studio ground
hsv = cv2.cvtColor(im, cv2.COLOR_BGR2HSV)
mask = ((g < 150) | (hsv[..., 1] > 60)).astype(np.uint8)
mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, np.ones((9, 9), np.uint8))
ys, xs = np.where(mask)
pad = 40
y0, y1, x0, x1 = max(ys.min()-pad, 0), ys.max()+pad, max(xs.min()-pad, 0), xs.max()+pad
crop = g[y0:y1, x0:x1]
crop = cv2.bilateralFilter(crop, 9, 40, 9)
e = cv2.Canny(crop, 40, 110)
# drop specks
n, lab, st, _ = cv2.connectedComponentsWithStats(e, 8)
keep = np.zeros_like(e)
for i in range(1, n):
    if st[i, cv2.CC_STAT_AREA] >= 25:
        keep[lab == i] = 255
keep = cv2.dilate(keep, np.ones((2, 2), np.uint8))
r, gg, b = (int(col[i:i+2], 16) for i in (0, 2, 4))
rgba = np.zeros((*keep.shape, 4), np.uint8)
rgba[..., 0], rgba[..., 1], rgba[..., 2] = b, gg, r
rgba[..., 3] = keep
cv2.imwrite(out, rgba)
print(out, keep.shape)
