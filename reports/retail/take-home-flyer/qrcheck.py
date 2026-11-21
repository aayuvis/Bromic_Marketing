"""Proves the flyer's QR codes scan: decodes the codes as rendered in the page, and the whole back page of each PDF
rendered back to pixels (pdftoppm, 300 dpi), with OpenCV's QRCodeDetector. Prints OK or FAIL per check."""
import json, os, subprocess, tempfile
import cv2

HERE = os.path.dirname(os.path.abspath(__file__))
cfg = json.load(open(os.path.join(HERE, 'flyer.json')))
want = {q['id']: q['url'] for q in cfg['qr']}
det = cv2.QRCodeDetector()

for fmt in ('letter', 'half'):
    for qid, url in want.items():
        im = cv2.imread(os.path.join(HERE, 'img', f'scan-{fmt}-{qid}.png'))
        im = cv2.copyMakeBorder(im, 40, 40, 40, 40, cv2.BORDER_CONSTANT, value=(255, 255, 255))  # the paper around the code
        got, _, _ = det.detectAndDecode(im)
        print(('OK  ' if got == url else 'FAIL'), f'{fmt} page render  {qid}: {got!r}')

for pdf in ('Bromic-Take-Home-Flyer.pdf', 'Bromic-Take-Home-Flyer-Half-Letter.pdf'):
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(['pdftoppm', '-r', '300', '-f', '2', '-l', '2', '-png', os.path.join(HERE, pdf), os.path.join(tmp, 'b')], check=True)
        png = [f for f in os.listdir(tmp) if f.endswith('.png')][0]
        im = cv2.imread(os.path.join(tmp, png))
        ok, decoded, _, _ = det.detectAndDecodeMulti(im)
        found = set(d for d in decoded if d) if ok else set()
        for qid, url in want.items():
            print(('OK  ' if url in found else 'FAIL'), f'{pdf} back page {qid}: {url}')
