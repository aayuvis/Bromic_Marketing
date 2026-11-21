"""Lay a transparent render (heater + caught shadows) on a warm studio sweep, grade it like a photograph and save a JPEG.
python3 compose.py IN.png OUT.jpg [sweep: light|grey]
Grade (owner, 21 Nov 2026: "colour grade them slightly to natural colours ... right shadows ... colours still look like render"):
  shadows: the rendered caught shadow is kept only near the heater (it fades with distance, so grazing-light streaks across the
  sweep go) and a soft, short grounding shadow is added behind the body, darkest at contact;
  colour: gentle filmic curve, blacks lifted a touch, saturation down, the element glow given a camera's halation, fine grain."""
import sys, os, numpy as np  # needs opencv-python (cv2) for the blurs
from PIL import Image, ImageFilter
im = Image.open(sys.argv[1]).convert('RGBA'); W, H = im.size
a = np.asarray(im).astype(np.float32) / 255
def blur(m, r):  # gaussian blur (sigma r px) of a float map, any channels
    import cv2
    return cv2.GaussianBlur(np.ascontiguousarray(m, np.float32), (0, 0), max(r, 0.3))
# studio sweep: warm white, a touch darker towards the corners, like a lit paper backdrop
y, x = np.mgrid[0:H, 0:W].astype(np.float32)
r = np.sqrt(((x - W * 0.52) / (W * 0.75)) ** 2 + ((y - H * 0.45) / (H * 0.8)) ** 2)
lv = 0.992 - 0.085 * np.clip(r, 0, 1.3) ** 1.6
bg = np.stack([lv * 1.0, lv * 0.990, lv * 0.972], -1)
# white heaters sit on a mid warm-grey sweep so the body separates from the backdrop (owner, 21 Nov 2026)
tone = float(os.environ.get('SWEEP', '0')) or (0.80 if ('white' in os.path.basename(sys.argv[1]) and 'pair' not in sys.argv[1]) else 0.88 if 'pair' in sys.argv[1] else 1.0)
if len(sys.argv) > 3 and sys.argv[3] == 'grey': tone = 0.88
bg = bg * tone
al = a[..., 3].copy()
sp = sys.argv[1].replace('.png', '_shadow.png')
if os.path.exists(sp):  # shadows from the quarter-size pass where the full-size region render left the frame empty
    s_ = np.asarray(Image.open(sp).convert('RGBA').resize((W, H), Image.BILINEAR)).astype(np.float32) / 255
    empty = al < 0.002
    a = a.copy(); a[..., :3] = np.where(empty[..., None], s_[..., :3], a[..., :3]); al = np.where(empty, s_[..., 3], al)
obj = (al > 0.985).astype(np.float32)                       # the heater itself
sh = (al <= 0.985) & (a[..., :3].max(-1) < 0.08)            # caught shadow pixels (dark, partly transparent)
# distance from the heater, cheaply: how much of a wide blur of the object reaches each pixel
k = W / 40
near = np.clip(blur(obj, k) * 6, 0, 1)                      # ~1 close to the body, falling to 0 a few heater-heights away
cast = np.where(sh, al, 0) * near ** 1.5
cast = blur(cast, W / 500) * 0.55 * float(os.environ.get('CAST', '1'))   # CAST=0 drops the rendered caught shadow (e.g. a hidden post seen from below)
# grounding shadow: the body's own silhouette, blurred twice (contact + soft), nudged up-left (light from the front-below)
dx, dy = int(W * 0.004), int(-H * 0.006)
sil = np.roll(np.roll(obj, dy, 0), dx, 1)
ground = 0.22 * blur(sil, W / 260) + 0.10 * blur(sil, W / 70)
shadow = np.clip(1 - (1 - cast) * (1 - ground), 0, 0.6) * (1 - obj)
rgb = a[..., :3]
out = bg * (1 - shadow[..., None] * np.array([1.0, 1.0, 0.97]))  # shadows a hair warmer-dark, like bounce off a warm room
out = rgb * obj[..., None] + out * (1 - obj[..., None])
# soft anti-aliased edge: use the real alpha at the boundary
edge = (al > 0.02) & (al <= 0.985) & ~sh
out = np.where(edge[..., None], rgb * al[..., None] + out * (1 - al[..., None]), out)
# ---- grade ----
glow = np.clip((out[..., 0] - out[..., 2]) * 2.2 - 0.35, 0, 1) * np.clip(out[..., 0] * 1.4 - 0.4, 0, 1)   # warm, bright element light
hal = blur(np.stack([glow * 1.0, glow * 0.55, glow * 0.25], -1), W / 220) * 0.38 + blur(np.stack([glow, glow * 0.6, glow * 0.3], -1), W / 60) * 0.12
out = 1 - (1 - out) * (1 - hal)                              # halation: light bleeds softly into the grille, as on a camera
lum = (out * np.array([0.2126, 0.7152, 0.0722])).sum(-1, keepdims=True)
sat = np.where(glow[..., None] > 0.05, 0.86, 0.9)          # a little less saturated overall; the glow loses its CG orange
out = lum + (out - lum) * sat
out[..., 0] = out[..., 0] * 0.985 + glow * 0.01; out[..., 1] = out[..., 1] * 0.995 + glow * 0.025   # glow towards warm amber-yellow
c = np.clip(out, 0, 1)
c = c + 0.06 * (c - c * c) * (c - 0.5) * 4                 # gentle S-curve
c = 0.03 + c * (1 - 0.03 - 0.012)                          # blacks lifted a touch, highlights rolled off
c = c * np.array([1.0, 0.995, 0.985]) + np.array([0.004, 0.002, 0.0])   # slightly warm, like daylight-balanced film
vig = 1 - 0.06 * np.clip(r, 0, 1.4) ** 2
c = c * vig[..., None]
# photographic grain: luminance, slightly clumped, stronger in the mid-tones
rng = np.random.default_rng(1)
g = blur(np.clip(rng.normal(0.5, 0.18, (H, W)), 0, 1), 0.6) - 0.5
c = c + (g * 0.022 * (0.4 + 2.4 * lum[..., 0] * (1 - lum[..., 0])))[..., None]
Image.fromarray((np.clip(c, 0, 1) * 255 + 0.5).astype(np.uint8)).save(sys.argv[2], quality=93, subsampling=0)
print(sys.argv[2], W, H)
