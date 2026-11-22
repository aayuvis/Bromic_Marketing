"""Contact sheet of every studio render in decks/product-renders/ -> Tungsten-Series-II-contact-sheet.jpg (4 across, labelled).
python3 sheet.py"""
import glob, os, math
from PIL import Image, ImageDraw, ImageFont
D = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fs = sorted(f for f in glob.glob(D + '/Tungsten-Series-II-*.jpg') if 'contact-sheet' not in f)
COLS, TW, TH, PAD, LAB = 4, 720, 480, 20, 44
rows = math.ceil(len(fs) / COLS)
sheet = Image.new('RGB', (PAD + COLS * (TW + PAD), PAD + rows * (TH + LAB + PAD)), 'white'); d = ImageDraw.Draw(sheet)
try: font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 22)
except OSError: font = ImageFont.load_default()
for i, f in enumerate(fs):
    im = Image.open(f).convert('RGB'); s = max(TW / im.width, TH / im.height)
    im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    l, t = (im.width - TW) // 2, (im.height - TH) // 2; im = im.crop((l, t, l + TW, t + TH))
    x, y = PAD + (i % COLS) * (TW + PAD), PAD + (i // COLS) * (TH + LAB + PAD)
    sheet.paste(im, (x, y)); d.text((x, y + TH + 10), os.path.basename(f)[len('Tungsten-Series-II-'):-4], fill=(30, 30, 30), font=font)
sheet.save(D + '/Tungsten-Series-II-contact-sheet.jpg', quality=85); print(len(fs), sheet.size)
