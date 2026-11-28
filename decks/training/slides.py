"""Slide images for the Hub's full-screen viewer: decks/training/out/<File>.pdf -> out/slides/<File>/NN.webp (1600 px wide).
Run after a deck is rebuilt: python3 decks/training/slides.py [File ...]  (no argument: every PDF whose slides are missing or older)."""
import glob, os, subprocess, sys, tempfile
from PIL import Image
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out')
pdfs = [os.path.join(OUT, f + '.pdf') for f in sys.argv[1:]] or sorted(glob.glob(os.path.join(OUT, '*.pdf')))
for pdf in pdfs:
    name = os.path.basename(pdf)[:-4]; d = os.path.join(OUT, 'slides', name)
    first = os.path.join(d, '01.webp')
    if not sys.argv[1:] and os.path.exists(first) and os.path.getmtime(first) > os.path.getmtime(pdf): continue
    for f in glob.glob(os.path.join(d, '*.webp')): os.remove(f)
    os.makedirs(d, exist_ok=True)
    with tempfile.TemporaryDirectory() as t:
        subprocess.run(['pdftoppm', '-r', '120', '-png', pdf, os.path.join(t, 'p')], check=True)
        for i, f in enumerate(sorted(glob.glob(os.path.join(t, 'p-*.png'))), 1):
            im = Image.open(f).convert('RGB'); im.thumbnail((1600, 1600), Image.LANCZOS)
            im.save(os.path.join(d, f'{i:02d}.webp'), quality=74, method=5)
    print(name, len(glob.glob(os.path.join(d, '*.webp'))), 'slides')
