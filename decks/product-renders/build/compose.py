"""Lay a transparent render (heater + caught shadows) on a warm studio sweep and save a JPEG.
python3 compose.py IN.png OUT.jpg [sweep: light|grey]"""
import sys, numpy as np
from PIL import Image
im = Image.open(sys.argv[1]).convert('RGBA'); W, H = im.size
a = np.asarray(im).astype(np.float32) / 255
# studio sweep: warm white, a touch darker towards the corners, like a lit paper backdrop
y, x = np.mgrid[0:H, 0:W].astype(np.float32)
r = np.sqrt(((x - W * 0.52) / (W * 0.75)) ** 2 + ((y - H * 0.45) / (H * 0.8)) ** 2)
lv = 0.985 - 0.075 * np.clip(r, 0, 1.3) ** 1.6
bg = np.stack([lv * 1.0, lv * 0.992, lv * 0.978], -1)
if len(sys.argv) > 3 and sys.argv[3] == 'grey': bg = bg * 0.88
al = a[..., 3:4].copy()
import os
sp = sys.argv[1].replace('.png', '_shadow.png')
if os.path.exists(sp):  # shadows from the quarter-size pass where the full-size region render left the frame empty
    s_ = np.asarray(Image.open(sp).convert('RGBA').resize((W, H), Image.BILINEAR)).astype(np.float32) / 255
    empty = al < 0.002
    a = a.copy(); a[..., :3] = np.where(empty, s_[..., :3], a[..., :3]); al = np.where(empty, s_[..., 3:4], al)
# caught shadows (dark, partly transparent) are softened so the sweep stays light; the product itself (alpha ~1) is untouched
sh = (al < 0.985) & (a[..., :3].max(-1, keepdims=True) < 0.08)
from PIL import ImageFilter
shadow = np.where(sh, al, 0)[..., 0]
shadow = np.asarray(Image.fromarray((shadow * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(W / 160))).astype(np.float32)[..., None] / 255
al = np.where(sh, shadow * 0.5, al)   # caught shadows: blurred and lighter, so the sweep stays even with no hard streaks
out = a[..., :3] * al + bg * (1 - al)
# fine film grain so flat areas do not read as CG
g = np.random.default_rng(1).normal(0, 0.0045, (H, W, 1)).astype(np.float32)
out = np.clip(out + g, 0, 1)
Image.fromarray((out * 255 + 0.5).astype(np.uint8)).save(sys.argv[2], quality=93, subsampling=0)
print(sys.argv[2], W, H)
