"""Instagram carousel cards (1080x1350) for Tungsten Series II, from data/product-marketing/tungsten-electric-series-ii.json
`carousels`, on Bromic's own photography and renders. Output: decks/carousels/<id>-<n>.jpg. Run: python3 decks/build-carousels.py"""
import json, os
from PIL import Image, ImageDraw, ImageFont
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
LIB = os.path.join(R, 'images', 'library'); OUT = os.path.join(R, 'decks', 'carousels'); os.makedirs(OUT, exist_ok=True)
DID = os.path.join(R, 'app', 'src', 'fonts', 'gfs-didot-latin.woff2')
LT, SB = '/usr/share/fonts/opentype/inter/Inter-Light.otf', '/usr/share/fonts/opentype/inter/Inter-SemiBold.otf'
F = lambda p, s: ImageFont.truetype(p, s)
INK, FLAME, STEEL, LINE = (35, 31, 32), (239, 65, 35), (113, 119, 125), (227, 227, 225)
W, H, PH = 1080, 1350, 760
LOGO = Image.open(os.path.join(R, 'decks', 'img', 'logo.png')).convert('RGBA')
def lines(d, txt, font, px):
    out, cur = [], ''
    for w in txt.split():
        t = (cur + ' ' + w).strip()
        if d.textlength(t, font=font) <= px: cur = t
        else: out.append(cur); cur = w
    return out + [cur]
def photo(id_):
    im = Image.open(os.path.join(LIB, id_ + '.webp')).convert('RGB')
    if id_.startswith('t2-'):  # product render on white: letterbox on white, a rule below
        bg = Image.new('RGB', (W, PH), (255, 255, 255)); im.thumbnail((W - 160, PH - 120)); bg.paste(im, ((W - im.width) // 2, (PH - im.height) // 2)); return bg
    r = max(W / im.width, PH / im.height); im = im.resize((round(im.width * r), round(im.height * r)), Image.LANCZOS)
    x, y = (im.width - W) // 2, (im.height - PH) // 2; return im.crop((x, y, x + W, y + PH))
D = json.load(open(os.path.join(R, 'data', 'product-marketing', 'tungsten-electric-series-ii.json')))
for c in D['carousels']:
    n = len(c['cards'])
    for i, k in enumerate(c['cards']):
        im = Image.new('RGB', (W, H), 'white'); im.paste(photo(k['image']), (0, 0)); d = ImageDraw.Draw(im)
        if k['image'].startswith('t2-'): d.line([(80, PH), (W - 80, PH)], fill=LINE, width=2)
        x = 80; y = PH + 60
        d.text((x, y), f"{i + 1:02d} / {n:02d}   ·   {k['label'].upper()}", font=F(SB, 24), fill=FLAME); y += 58
        hf = F(DID, 72 if len(k['headline']) < 26 else 62)
        for ln in lines(d, k['headline'], hf, W - 160): d.text((x, y), ln, font=hf, fill=INK); y += hf.size + 8
        y += 18; bf = F(LT, 31)
        for ln in lines(d, k['body'], bf, W - 160): d.text((x, y), ln, font=bf, fill=INK); y += 42
        d.line([(x, H - 110), (W - 80, H - 110)], fill=LINE, width=2)
        lg = LOGO.copy(); lg.thumbnail((200, 64)); im.paste(lg, (x, H - 82), lg)
        for j in range(n): d.ellipse([W - 80 - (n - j) * 30, H - 62, W - 80 - (n - j) * 30 + 14, H - 48], fill=FLAME if j == i else LINE)
        if i == n - 1:
            cf = F(SB, 24); t = c['cta'].upper(); tw = d.textlength(t, font=cf)
            d.rectangle([W - 80 - tw - 60 - n * 30 - 20, H - 78, W - 80 - n * 30 - 20, H - 32], fill=FLAME)
            d.text((W - 80 - tw - 30 - n * 30 - 20, H - 68), t, font=cf, fill='white')
        im.save(os.path.join(OUT, f"{c['id']}-{i + 1}.jpg"), quality=88)
    print(c['id'], n, 'cards')
