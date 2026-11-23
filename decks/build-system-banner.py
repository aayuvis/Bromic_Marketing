"""System banner: a scene with a white band below it showing the complete system (owner, 23 Nov 2026: "in the new images put a
banner below with the heater image with logo + the recess kit image + affinity 2 channel dimmer image....and the bromic logo").
Same look as the portfolio banners (build-portfolio-banner.py): white field, the Bromic logo, ink and steel type, flame only on a
thin rule. Hard rule 4: the heater is shown with its controls.

Tiles (product cut-outs on transparent, cached in decks/img/system/):
  heater-<finish>.png   Series II 6 kW from the CAD, BROMIC logo readable   (product-renders/build/render_system_tiles.py)
  kit-<finish>.png      the heater seated in the low-clearance recess kit   (same script; trim 1,624 x 283 mm, vents at both ends)
  affinity-dimmer-2ch.png  Affinity Smart-Heat 2-channel dimmer, bromic.com product image (Affinity-Dimmer-2CH-2.png)

Usage:  python3 decks/build-system-banner.py SCENE.jpg FINISH OUT.jpg [--thumb THUMB.webp]
FINISH is black, graphite or white (the finish of the heaters in the scene). The output is the scene at the same width
(upscaled to at least 3840 wide if smaller) with the banner appended below; the scene itself is never altered."""
import sys, os, argparse
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
TILES = os.environ.get('SYSTEM_TILES', os.path.join(HERE, 'img', 'system'))
LOGO = os.path.join(HERE, 'img', 'logo.png')
FONT = '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'   # Arial metrics (Arimo/Liberation Sans)
INK = (34, 34, 34); FLAME = (0xEF, 0x41, 0x23); RULE = (226, 226, 226)
LABELS = ['Tungsten Smart-Heat Electric Series II', 'Low-Clearance Recess Kit', 'Affinity Smart-Heat 2-Channel Dimmer']
BAND = 0.25      # banner height as a share of the scene height
MINW = 3840


def trim(im, pad=0):
    """Crop a transparent cut-out to its visible pixels."""
    a = im.getchannel('A').point(lambda v: 255 if v > 6 else 0)
    bb = a.getbbox()
    return im.crop((max(0, bb[0] - pad), max(0, bb[1] - pad), min(im.width, bb[2] + pad), min(im.height, bb[3] + pad)))


def fit(im, bw, bh):
    """Scale to fit inside bw x bh, keeping the aspect ratio (never stretched)."""
    s = min(bw / im.width, bh / im.height)
    return im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)


def tiles(finish):
    return [trim(Image.open(os.path.join(TILES, f)).convert('RGBA')) for f in
            (f'heater-{finish}.png', f'kitempty-{finish}.png', 'affinity-dimmer-2ch.png')]


def banner(W, H, finish):
    """A white band W x H: the logo at the left over a short flame rule, a hairline, then three evenly spaced tiles with labels."""
    b = Image.new('RGB', (W, H), 'white'); d = ImageDraw.Draw(b)
    u = H / 640                                    # layout unit (designed at 3840 x 640)
    m = round(150 * u)                             # outer margin
    lw = round(W * 0.19)                           # logo panel width
    logo = fit(Image.open(LOGO).convert('RGBA'), lw - m - round(40 * u), round(120 * u))
    ly = (H - logo.height) // 2 - round(14 * u)
    b.paste(logo, (m, ly), logo)
    ry = ly + logo.height + round(40 * u)
    d.rectangle((m, ry, m + round(120 * u) - 1, ry + max(3, round(5 * u)) - 1), fill=FLAME)
    x0 = lw + round(30 * u)                        # hairline between the logo and the system
    d.rectangle((x0, round(120 * u), x0 + max(2, round(2 * u)) - 1, H - round(120 * u)), fill=RULE)
    font = ImageFont.truetype(FONT, max(14, round(30 * u)))
    area0 = x0 + round(70 * u); area1 = W - round(90 * u)
    cw = (area1 - area0) / 3
    ty, th = round(60 * u), round(430 * u)         # tile box
    label_y = round(530 * u)
    for i, (im, lab) in enumerate(zip(tiles(finish), LABELS)):
        cx = area0 + cw * (i + 0.5)
        t = fit(im, round(cw * 0.92), th)
        x = round(cx - t.width / 2); y = ty + (th - t.height) // 2
        if i < 2:   # a soft, low shadow under the CAD cut-outs so a white heater still reads on the white band
            r = max(3, round(14 * u)); pd = 4 * r            # padded so the blur is never cut off at the tile edge
            a = Image.new('L', (t.width + 2 * pd, t.height + 2 * pd), 0)
            a.paste(t.getchannel('A').point(lambda v: 70 if v > 20 else 0), (pd, pd)); a = a.filter(ImageFilter.GaussianBlur(r))
            b.paste((120, 120, 120), (x - pd + round(4 * u), y - pd + round(12 * u)), a)
        b.paste(t, (x, y), t)
        tw = d.textlength(lab, font=font)
        d.text((round(cx - tw / 2), label_y), lab, font=font, fill=INK)
    return b


def build(scene, finish, out, thumb=None):
    sc = Image.open(scene).convert('RGB')
    if sc.width < MINW:
        s = MINW / sc.width; sc = sc.resize((MINW, round(sc.height * s)), Image.LANCZOS)
    W = sc.width; bh = round(sc.height * BAND)
    full = Image.new('RGB', (W, sc.height + bh), 'white')
    full.paste(sc, (0, 0)); full.paste(banner(W, bh, finish), (0, sc.height))
    full.save(out, quality=92, subsampling=0, optimize=True)
    if thumb:
        t = full.copy(); t.thumbnail((900, 900), Image.LANCZOS); t.save(thumb, quality=82, method=6)
    return full.size


if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('scene'); ap.add_argument('finish', choices=['black', 'graphite', 'white'])
    ap.add_argument('out'); ap.add_argument('--thumb')
    a = ap.parse_args(); print(build(a.scene, a.finish, a.out, a.thumb))
