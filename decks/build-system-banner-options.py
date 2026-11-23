"""Three richer system-banner options for the owner to choose from (owner, 23 Nov 2026: "the banner is boring...make it better").
  A  dark ink band that flows out of the scene, Didot headline, the system as three numbered steps, products with a soft reflection
  B  warm stone band, magazine layout: Didot line at the left, the products on low plinths at the right
  C  a frosted-glass panel floating over the lower part of the scene, the products in one quiet row with hairline dividers
Type: GFS Didot (app/src/fonts) for display lines, Arial metrics (Liberation Sans) for body; flame #EF4123 only on small rules
and numbers. Every product line comes from data/product-facts.json (names as in templates/bromic-voice.md).

Usage:  python3 decks/build-system-banner-options.py SCENE.jpg FINISH OPTION(a|b|c) OUT.jpg [--thumb THUMB.webp]"""
import os, argparse
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
TILES = os.path.join(HERE, 'img', 'system')
DIDOT = os.path.join(ROOT, 'app', 'src', 'fonts', 'gfs-didot-latin.woff2')
SANS = '/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf'
INK = (29, 29, 31); FLAME = (0xEF, 0x41, 0x23); MINW = 3840

# product lines: product-facts.json (tungsten-select, affinity-controls; accessories: recess kits)
STEPS = [
    ('01', 'Heat', 'Tungsten Smart-Heat® Electric', '3-year heater and 7-year element warranty'),
    ('02', 'Recess', 'Low-Clearance Recess Kit', 'For recessed ceiling installation'),
    ('03', 'Control', 'Affinity Smart-Heat® Dimmer, 2-Channel', 'Dimming in 1% steps, zones and schedules in the app'),
]


def F(path, px): return ImageFont.truetype(path, max(8, round(px)))


def trim(im):
    bb = im.getchannel('A').point(lambda v: 255 if v > 6 else 0).getbbox(); return im.crop(bb)


def fit(im, bw, bh):
    s = min(bw / im.width, bh / im.height)
    return im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)


def products(finish):
    return [trim(Image.open(os.path.join(TILES, f)).convert('RGBA')) for f in
            (f'heater-{finish}.png', f'kitempty-{finish}.png', 'affinity-dimmer-2ch-cut.png')]   # the kit is shown empty (owner, 23 Nov 2026)


def spaced(d, xy, text, font, fill, track, anchor='l'):
    """Small capitals with letter spacing; anchor l (left) or m (centre)."""
    w = sum(d.textlength(c, font=font) for c in text) + track * (len(text) - 1)
    x, y = xy; x = x - w / 2 if anchor == 'm' else x
    for c in text:
        d.text((x, y), c, font=font, fill=fill); x += d.textlength(c, font=font) + track
    return w


def centred(d, cx, y, text, font, fill):
    d.text((round(cx - d.textlength(text, font=font) / 2), y), text, font=font, fill=fill)


def place(canvas, im, x, y, u, shadow=(0, 0, 0), strength=0.45, reflect=0.0, floor=None):
    """Paste a cut-out with a soft contact shadow under it (and optionally a faded floor reflection)."""
    floor = floor if floor is not None else y + im.height
    r = round(22 * u); pd = 4 * r
    a = im.getchannel('A')
    # contact shadow: the silhouette squashed onto the floor line, blurred
    sq = a.resize((im.width, max(2, round(im.height * 0.10))))
    m = Image.new('L', (im.width + 2 * pd, sq.height + 2 * pd), 0); m.paste(sq.point(lambda v: round(v * strength)), (pd, pd))
    m = m.filter(ImageFilter.GaussianBlur(r))
    canvas.paste(shadow, (x - pd, floor - sq.height // 2 - pd + round(6 * u)), m)
    m2 = Image.new('L', (im.width + 2 * pd, im.height + 2 * pd), 0); m2.paste(a.point(lambda v: round(v * strength * 0.45)), (pd, pd))
    m2 = m2.filter(ImageFilter.GaussianBlur(r * 1.6))
    canvas.paste(shadow, (x - pd + round(10 * u), y - pd + round(26 * u)), m2)
    if reflect:
        rf = im.transpose(Image.FLIP_TOP_BOTTOM); h = round(im.height * 0.45); rf = rf.crop((0, 0, rf.width, h))
        g = Image.linear_gradient('L').resize((rf.width, h)).point(lambda v: round((255 - v) * reflect))
        ra = ImageChops.multiply(rf.getchannel('A'), g); canvas.paste(rf.convert('RGB'), (x, floor + round(4 * u)), ra)
    canvas.paste(im, (x, y), im)


def option_a(sc, finish):
    W, H = sc.size; u = W / 3840; bh = round(H * 0.38); out = Image.new('RGB', (W, H + bh), INK)
    out.paste(sc, (0, 0))
    g = round(H * 0.16)   # the scene's floor falls into the ink band
    grad = Image.linear_gradient('L').resize((W, g)).point(lambda v: round(255 * (lambda t: t * t * (3 - 2 * t))(v / 255)))
    out.paste(INK, (0, H - g), grad)
    d = ImageDraw.Draw(out); y0 = H
    m = round(170 * u)
    logo = Image.open(os.path.join(HERE, 'img', 'logo-white.png')).convert('RGBA'); logo = fit(logo, round(400 * u), round(130 * u))
    out.paste(logo, (m, y0 + round(150 * u)), logo)
    fd = F(DIDOT, 118 * u)
    d.text((m, y0 + round(380 * u)), 'The Complete', font=fd, fill=(245, 243, 240))
    d.text((m, y0 + round(510 * u)), 'Recessed System', font=fd, fill=(245, 243, 240))
    d.rectangle((m, y0 + round(700 * u), m + round(110 * u), y0 + round(705 * u)), fill=FLAME)
    spaced(d, (m, y0 + round(745 * u)), 'TUNGSTEN SMART-HEAT® ELECTRIC SERIES II', F(SANS, 26 * u), (170, 168, 165), round(5 * u))
    a0, a1 = round(1380 * u), W - round(130 * u); cw = (a1 - a0) / 3
    fl, fn, fs = F(SANS, 30 * u), F(SANS, 36 * u), F(SANS, 28 * u)
    for i, (im, (n, step, name, fact)) in enumerate(zip(products(finish), STEPS)):
        cx = a0 + cw * (i + 0.5)
        if i: d.rectangle((round(a0 + cw * i), y0 + round(170 * u), round(a0 + cw * i) + max(1, round(1.5 * u)), y0 + bh - round(170 * u)), fill=(62, 62, 64))
        w = spaced(d, (cx, y0 + round(150 * u)), f'{n}   {step.upper()}', fl, (235, 233, 230), round(6 * u), 'm')
        spaced(d, (cx - w / 2, y0 + round(150 * u)), n, fl, FLAME, round(6 * u))
        # a soft pool of light behind each product so black finishes still read on the ink
        gl = Image.new('L', (round(cw), round(560 * u)), 0); ImageDraw.Draw(gl).ellipse((round(cw * 0.12), round(120 * u), round(cw * 0.88), round(470 * u)), fill=34)
        gl = gl.filter(ImageFilter.GaussianBlur(round(90 * u))); out.paste((120, 118, 116), (round(cx - cw / 2), y0 + round(180 * u)), gl)
        t = fit(im, round(cw * 0.86), round(420 * u)); floor = y0 + round(640 * u)
        place(out, t, round(cx - t.width / 2), floor - t.height, u, shadow=(0, 0, 0), strength=0.8, reflect=0.16, floor=floor)
        centred(d, cx, y0 + round(745 * u), name, fn, (245, 243, 240))
        centred(d, cx, y0 + round(800 * u), fact, fs, (150, 148, 145))
    return out


def option_b(sc, finish):
    W, H = sc.size; u = W / 3840; bh = round(H * 0.36); STONE = (231, 224, 214)
    out = Image.new('RGB', (W, H + bh), STONE); out.paste(sc, (0, 0)); d = ImageDraw.Draw(out); y0 = H
    m = round(170 * u)
    spaced(d, (m, y0 + round(150 * u)), 'THE SYSTEM', F(SANS, 26 * u), FLAME, round(7 * u))
    fd = F(DIDOT, 132 * u)
    d.text((m, y0 + round(220 * u)), 'Warmth,', font=fd, fill=INK)
    d.text((m, y0 + round(365 * u)), 'Built In', font=fd, fill=INK)
    d.rectangle((m, y0 + round(570 * u), m + round(110 * u), y0 + round(575 * u)), fill=FLAME)
    logo = Image.open(os.path.join(HERE, 'img', 'logo.png')).convert('RGBA'); logo = fit(logo, round(330 * u), round(105 * u))
    out.paste(logo, (m, y0 + bh - round(130 * u) - logo.height), logo)
    a0, a1 = round(1150 * u), W - round(130 * u); cw = (a1 - a0) / 3
    pw, ph = round(cw * 0.84), round(44 * u); floor = y0 + round(640 * u)
    fl, fs = F(SANS, 26 * u), F(SANS, 26 * u)
    for i, (im, (n, step, name, fact)) in enumerate(zip(products(finish), STEPS)):
        cx = a0 + cw * (i + 0.5)
        # plinth: a low slab a shade lighter than the band, with a soft shadow on its leading edge
        px0 = round(cx - pw / 2); sh = Image.new('L', (pw + 160, ph + 160), 0)
        ImageDraw.Draw(sh).rounded_rectangle((80, 80 + round(18 * u), 80 + pw, 80 + ph + round(18 * u)), radius=round(10 * u), fill=70)
        out.paste((120, 105, 90), (px0 - 80, floor - 80), sh.filter(ImageFilter.GaussianBlur(round(22 * u))))
        d.rounded_rectangle((px0, floor, px0 + pw, floor + ph), radius=round(10 * u), fill=(241, 236, 229))
        d.rectangle((px0 + round(10 * u), floor, px0 + pw - round(10 * u), floor + max(1, round(2 * u))), fill=(250, 248, 244))
        t = fit(im, round(cw * 0.84), round(460 * u))
        place(out, t, round(cx - t.width / 2), floor - t.height + round(8 * u), u, shadow=(70, 60, 50), strength=0.6, floor=floor + round(8 * u))
        spaced(d, (cx, floor + ph + round(48 * u)), f'{n}  {name.upper()}', fl, INK, round(4 * u), 'm')
        centred(d, cx, floor + ph + round(98 * u), fact, fs, (110, 102, 94))
    return out


def option_c(sc, finish):
    W, H = sc.size; u = W / 3840; out = sc.copy()
    pm = round(100 * u); ph = round(H * 0.215); py = H - pm - ph; box = (pm, py, W - pm, H - pm); rad = round(28 * u)
    region = out.crop(box).filter(ImageFilter.GaussianBlur(round(46 * u)))
    region = Image.blend(region, Image.new('RGB', region.size, (246, 244, 241)), 0.62)
    mask = Image.new('L', region.size, 0); ImageDraw.Draw(mask).rounded_rectangle((0, 0, region.width - 1, region.height - 1), radius=rad, fill=255)
    sh = Image.new('L', (region.width + 200, region.height + 200), 0); sh.paste(mask.point(lambda v: v * 0.35), (100, 120))
    out.paste((0, 0, 0), (pm - 100, py - 100), sh.filter(ImageFilter.GaussianBlur(round(40 * u))))
    out.paste(region, box[:2], mask)
    d = ImageDraw.Draw(out)
    d.rounded_rectangle(box, radius=rad, outline=(255, 255, 255), width=max(1, round(2 * u)))
    x0 = pm + round(110 * u)
    logo = Image.open(os.path.join(HERE, 'img', 'logo.png')).convert('RGBA'); logo = fit(logo, round(330 * u), round(105 * u))
    out.paste(logo, (x0, py + round(100 * u)), logo)
    d.text((x0, py + round(250 * u)), 'The Recessed System', font=F(DIDOT, 64 * u), fill=INK)
    d.rectangle((x0, py + round(370 * u), x0 + round(90 * u), py + round(374 * u)), fill=FLAME)
    a0, a1 = pm + round(1150 * u), W - pm - round(60 * u); cw = (a1 - a0) / 3
    fn, fs = F(SANS, 26 * u), F(SANS, 22 * u)
    for i, (im, (n, step, name, fact)) in enumerate(zip(products(finish), STEPS)):
        cx = a0 + cw * (i + 0.5); xl = round(a0 + cw * i)
        d.rectangle((xl, py + round(90 * u), xl + max(1, round(1.5 * u)), H - pm - round(90 * u)), fill=(150, 146, 140))
        t = fit(im, round(cw * 0.74), round(ph * 0.54)); floor = py + round(ph * 0.68)
        place(out, t, round(cx - t.width / 2), floor - t.height, u, shadow=(40, 36, 32), strength=0.55, floor=floor)
        w = spaced(d, (cx, floor + round(42 * u)), f'{n}  {name.upper()}', fn, INK, round(3 * u), 'm')
        spaced(d, (cx - w / 2, floor + round(42 * u)), n, fn, FLAME, round(3 * u))
        centred(d, cx, floor + round(86 * u), fact, fs, (88, 84, 80))
    return out


def build(scene, finish, opt, out, thumb=None):
    sc = Image.open(scene).convert('RGB')
    if sc.width < MINW: sc = sc.resize((MINW, round(sc.height * MINW / sc.width)), Image.LANCZOS)
    im = {'a': option_a, 'b': option_b, 'c': option_c}[opt](sc, finish)
    im.save(out, quality=92, subsampling=0, optimize=True)
    if thumb:
        t = im.copy(); t.thumbnail((900, 900), Image.LANCZOS); t.save(thumb, quality=82, method=6)
    return im.size


if __name__ == '__main__':
    ap = argparse.ArgumentParser(); ap.add_argument('scene'); ap.add_argument('finish', choices=['black', 'graphite', 'white'])
    ap.add_argument('option', choices=['a', 'b', 'c']); ap.add_argument('out'); ap.add_argument('--thumb')
    a = ap.parse_args(); print(build(a.scene, a.finish, a.option, a.out, a.thumb))
