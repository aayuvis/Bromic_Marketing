"""Build a Bromic white paper (US Letter portrait) from reports/white-papers/<id>/content.py.
Run from the repo root:
  python3 reports/white-papers/build.py <id>            -> <id>/letter.html (images from images/library)
  python3 reports/white-papers/build.py <id> --pdf      -> also runs the print check and writes <id>/<FILE>.pdf
The words, figures and sources live in content.py; the sketches are drawn by sketch.js (rough.js)."""
import html, importlib.util, json, os, re, subprocess, sys, shutil, tempfile
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
E = html.escape

def md(s):
    """Light inline markup: **bold**, [n] -> superscript source number."""
    s = E(s)
    s = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', s)
    s = re.sub(r'\[(\d+(?:,\s*\d+)*)\]', lambda m: f'<sup>{m.group(1).replace(" ", "")}</sup>', s)
    return s

def build(rid, pdf=False):
    spec = importlib.util.spec_from_file_location('c', os.path.join(HERE, rid, 'content.py'))
    C = importlib.util.module_from_spec(spec); spec.loader.exec_module(C)
    RD = os.path.join(HERE, rid); os.makedirs(os.path.join(RD, 'img'), exist_ok=True)
    used = set()

    def img(i, cls='', alt='', pos=None):
        used.add(i); st = f' style="object-position:{pos}"' if pos else ''
        return f'<img class="{cls}" src="img/{i}.jpg" alt="{E(alt)}"{st}>'

    def folio(p, dk=False):
        return f'<div class="folio{" dk" if dk else ""}"><span>{E(C.FOLIO)}</span><span class="draft">Draft for review</span><span>{p:02d}</span></div>'

    def bl(items): return '<ul class="b">' + ''.join(f'<li>{md(x)}</li>' for x in items) + '</ul>'
    def tbl(t):
        head = ''.join(f'<th>{E(h)}</th>' for h in t['head'])
        def cell(c):
            if c.startswith('*') and not c.startswith('**'): return f'<td class="win">{md(c[1:])}</td>'
            return f'<td>{md(c)}</td>'
        rows = ''.join('<tr' + (' class="hl"' if r[0].startswith('!') else '') + '>' + ''.join(cell(c.lstrip('!')) for c in r) + '</tr>' for r in t['rows'])
        return f'<table class="t"><thead><tr>{head}</tr></thead><tbody>{rows}</tbody></table>'
    def block(b):
        k = b[0]
        if k == 'p': return f'<p>{md(b[1])}</p>'
        if k == 'lede': return f'<p class="lede">{md(b[1])}</p>'
        if k == 'h3': return f'<h3>{md(b[1])}</h3>'
        if k == 'h4': return f'<h4>{md(b[1])}</h4>'
        if k == 'ul': return bl(b[1])
        if k == 'table': return tbl(b[1])
        if k == 'box': return f'<div class="box{" fl" if len(b) > 3 and b[3] else ""}"><h4>{E(b[1])}</h4>{"".join(block(x) for x in b[2])}</div>'
        if k == 'voice': return f'<div class="voice"><p>{md(b[1])}</p><small>{md(b[2])}</small></div>'
        if k == 'diag': return f'<figure><svg class="diag" data-diag="{b[1]}" viewBox="0 0 {b[2]}"></svg>{f"<figcaption>{md(b[3])}</figcaption>" if len(b) > 3 else ""}</figure>'
        if k == 'photo': return f'<figure style="height:{b[2]}px">{img(b[1], alt=b[3], pos=b[4] if len(b) > 4 else None)}</figure><figcaption>{md(b[3])}</figcaption>'
        if k == 'photos': return '<div class="cols" style="gap:10px">' + ''.join(f'<div><figure style="height:{b[2]}px">{img(i, alt=c)}</figure><figcaption>{md(c)}</figcaption></div>' for i, c in b[1]) + '</div>'
        if k == 'stats': return '<div class="stats">' + ''.join(f'<div class="st"><div class="n">{E(n)}</div><p>{md(t)}</p><small>{md(s)}</small></div>' for n, t, s in b[1]) + '</div>'
        if k == 'cols': return f'<div class="cols">{"".join("<div>" + "".join(block(x) for x in col) + "</div>" for col in b[1])}</div>'
        if k == 'html': return b[1]
        raise ValueError(k)

    pages, p = [], 1
    for pg in C.PAGES:
        t = pg['type']
        if t == 'cover':
            pages.append(f'''<section class="pg cover">{img(pg['img'], 'bg', pg['alt'], pg.get('pos'))}
  <div class="cv"><img class="logo" src="LOGOW" alt="Bromic Heating"><div class="ck">{E(pg['kicker'])}</div><h1>{pg['title_html']}</h1>
  <div class="sub">{E(pg['sub'])}</div><p>{E(pg['blurb'])}</p></div>
  <div class="cvnote"><span>{E(pg['note'])}</span><span>Draft for review</span></div></section>''')
        elif t == 'back':
            pages.append(f'''<section class="pg back">{img(pg['img'], 'bg', pg['alt'])}<div class="bt"><div class="kick">{E(pg['kicker'])}</div><h2>{E(pg['h2'])}</h2>
  <p>{md(pg['text'])}</p><div class="cta">{E(pg['cta'])}</div><div class="site">{E(pg['site'])}</div><img class="logo" src="LOGOW" alt="Bromic Heating"></div></section>''')
        elif t == 'sources':
            src = ''.join(f'<li>{E(s)}</li>' for s in C.SOURCES)
            pages.append(f'<section class="pg srcs"><div class="kick">Sources</div><h2>Where The Facts Come From</h2><p class="note" style="margin-bottom:10px">{md(C.NOTE)}</p><ol>{src}</ol>{folio(p)}</section>')
        elif t == 'brand':
            spec_ = ''.join(f'<div><b>{E(a)}</b>{md(b)}</div>' for a, b in pg['spec'])
            fit = ''.join(f'<div><h4>{E(a)}</h4><p>{md(b)}</p></div>' for a, b in pg['fit'])
            pj = E(json.dumps(pg['pergola'])); bj = E(json.dumps(pg['beam'])) if pg.get('beam') else ''
            beam = f'<svg class="diag" data-beam="{bj}" viewBox="0 0 470 215" style="width:56%;float:left"></svg>' if bj else ''
            pages.append(f'''<section class="pg brand"><div class="kick">{E(pg['kicker'])}</div><h2>{E(pg['h2'])}</h2><p>{md(pg['intro'])}</p>
  <div class="spec">{spec_}</div>
  <figure><svg class="diag" data-pergola="{pj}" viewBox="0 0 700 380"></svg><figcaption>{md(pg['cap'])}</figcaption></figure>
  <div class="fit" style="margin-top:10px">{fit}</div>
  {('<div style="margin-top:10px;overflow:hidden">' + beam + '<div style="margin-left:60%">' + ''.join(block(x) for x in pg.get('side', [])) + '</div></div>') if beam else ''.join(block(x) for x in pg.get('side', []))}
  {folio(p)}</section>''')
        else:  # generic page: kicker, h2, blocks
            body = ''.join(block(b) for b in pg['blocks'])
            pages.append(f'<section class="pg {t}"><div class="kick">{E(pg["kicker"])}</div><h2>{md(pg["h2"])}</h2>{body}{folio(p)}</section>')
        p += 1

    # images: library webp -> jpg, sized for print
    used.update(re.findall(r'src="img/([^"]+)\.jpg"', '\n'.join(pages)))
    for i in used:
        out = os.path.join(RD, 'img', i + '.jpg')
        if not os.path.exists(out):
            srcp = (os.path.join(ROOT, 'images', 'review', 'full', i[3:] + '.jpg') if i.startswith('rv-') else
                    os.path.join(ROOT, 'images', 'portfolio', i[3:] + '.webp') if i.startswith('pf-') else
                    os.path.join(ROOT, 'images', 'library', i + '.webp'))
            im = Image.open(srcp).convert('RGB'); im.thumbnail((1800, 1800)); im.save(out, quality=82, optimize=True)
    css = open(os.path.join(HERE, 'wp.css')).read().replace('FONT_DIDOT', '../../../app/src/fonts/gfs-didot-latin.woff2').replace('FONT_ARIMO', '../../../app/src/fonts/arimo-latin.woff2')
    rough = open(os.path.join(ROOT, 'reports', 'trends-2027', 'engine', 'vendor', 'rough-4.6.6.js')).read()
    sk = open(os.path.join(HERE, 'sketch.js')).read()
    body = '\n'.join(pages).replace('src="LOGOW"', 'src="../../../images/portfolio/bromic-logo-white.png"').replace('src="LOGO"', 'src="../../../images/portfolio/bromic-logo.png"')
    frames = f'<script>window.FRAMES={json.dumps(getattr(C, "FRAMES", []))}</script>'
    doc = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>{E(C.TITLE)}</title><style>{css}</style></head><body><main id="deck">{body}</main>{frames}<script>{rough}</script><script>{sk}</script></body></html>'''
    out = os.path.join(RD, 'letter.html'); open(out, 'w').write(doc); print(out, len(C.PAGES), 'pages')
    if pdf:
        env = dict(os.environ, NODE_PATH=os.pathsep.join([os.path.join(ROOT, 'app', 'node_modules'), subprocess.run(['npm', 'root', '-g'], capture_output=True, text=True).stdout.strip()]))
        shots = sys.argv[sys.argv.index('--shots') + 1] if '--shots' in sys.argv else '-'
        r = subprocess.run(['node', os.path.join(ROOT, 'reports', 'trends-2027', 'engine', 'qa.js'), out, shots, os.path.join(RD, C.FILE + '.pdf')], cwd=ROOT, env=env)
        sys.exit(r.returncode)

if __name__ == '__main__':
    a = [x for x in sys.argv[1:] if not x.startswith('--')]
    build(a[0], pdf='--pdf' in sys.argv)
