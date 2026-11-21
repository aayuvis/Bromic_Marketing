"""Build a visual Outdoor Living Trends 2027 report from a report folder (na, au, uk, hospitality).
Run from the repo root:
  python3 reports/trends-2027/engine/build.py <id>              -> <id>/index.html (landscape, uses img/)
  python3 reports/trends-2027/engine/build.py <id> --letter     -> <id>/letter.html (US Letter portrait)
  add --inline for one self-contained file named after content.FILE (fonts, images and scripts embedded).
The report's words, numbers and pictures live in <id>/content.py; its charts in <id>/charts.js."""
import base64, importlib.util, json, os, re, sys, html
HERE = os.path.dirname(os.path.abspath(__file__))
TR = os.path.dirname(HERE)
ROOT = os.path.abspath(os.path.join(TR, '..', '..'))
E = html.escape

AUD_ICON = {'Architects': 'pencil-ruler', 'Builders': 'hard-hat', 'Homeowners': 'house', 'Designers': 'paintbrush',
            'Operators': 'utensils-crossed', 'Hospitality': 'wine', 'Integrators': 'sliders-horizontal', 'Hotels': 'hotel',
            'Pergola makers': 'layers', 'Cities': 'landmark', 'Builders & electricians': 'plug', 'Hospitality designers': 'paintbrush',
            'Developers': 'building-2', 'Patio builders': 'layers', 'Venues': 'wine', 'Retailers': 'store', 'Shipyards': 'wrench',
            'Hotel groups': 'hotel', 'Charter operators': 'sun', 'Councils': 'landmark', 'Installers': 'wrench'}

def b64(path, mime):
    return f'data:{mime};base64,' + base64.b64encode(open(path, 'rb').read()).decode()

def icon(name, cls='ic'):
    s = open(os.path.join(HERE, 'icons', name + '.svg')).read()
    inner = re.search(r'<svg[^>]*>(.*)</svg>', s, re.S).group(1)
    inner = re.sub(r'<!--.*?-->', '', inner, flags=re.S).strip()
    return (f'<svg class="{cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" '
            f'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{inner}</svg>')

def load(rid):
    spec = importlib.util.spec_from_file_location('content_' + rid, os.path.join(TR, rid, 'content.py'))
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); return m

def build(rid, inline=False, letter=False):
    C = load(rid)
    RD = os.path.join(TR, rid)
    aud = dict(AUD_ICON, **getattr(C, 'AUD_ICON_EXTRA', {}))
    n_sh = len(C.SHIFTS)
    folio_txt = getattr(C, 'FOLIO', f'Outdoor Living Trends 2027 · {C.REGION}')

    def folio(p, dark=False):
        return (f'<div class="folio{" dk" if dark else ""}"><span>{E(folio_txt)}</span>'
                f'<span class="draft">Draft for review</span><span>{p:02d}</span></div>')

    def img(src_id, cls='', alt=''):
        return f'<img class="{cls}" src="img/{src_id}.webp" alt="{E(alt)}">'

    def page_a(s, p):
        words = ''.join(f'<li><span class="wico" data-r="circle">{icon(i)}</span>{E(w)}</li>' for w, i in s['words'])
        sig = ''.join(f'<li><b>{E(f)}</b><span>{E(t)}</span></li>' for f, t in s['signals'])
        return f'''<section class="pg pa side{s['side']}" id="s{s['n']}">
  <figure class="ph">{img(s['photo'], alt=s['cap'])}<div class="bign">{s['n']}</div><figcaption>{E(s['cap'])}</figcaption></figure>
  <div class="tx">
    <div class="kick">Shift {s['n']} of {n_sh}</div>
    <h2>{E(s['title'])}</h2>
    <ul class="words">{words}</ul>
    <p class="read">{E(s['read'])}</p>
    <ul class="sig">{sig}</ul>
  </div>{folio(p)}</section>'''

    def page_b(s, p):
        kind, ref, cap = s['right']
        if kind == 'sketch':
            vis = f'<figure class="sk">{img(ref + "-sketch", alt=cap)}<figcaption>{E(cap)}</figcaption></figure>'
        elif kind == 'photo':
            vis = f'<figure class="sk">{img(ref, alt=cap)}<figcaption>{E(cap)}</figcaption></figure>'
        else:
            vis = f'<figure class="sk dg"><svg class="diag" data-diag="{ref}" viewBox="0 0 680 540"></svg><figcaption>{E(cap)}</figcaption></figure>'
        impl = ''.join(f'<div class="aud"><span class="aico" data-r="circle">{icon(aud[a])}</span><h4>{E(a)}</h4><p>{E(t)}</p></div>' for a, t in s['impl'])
        f, c, src = s['hero']
        return f'''<section class="pg pb" id="s{s['n']}b">
  <div class="stat">
    <div class="kick">Shift {s['n']} · {E(s['title'])}</div>
    <div class="hero"><div class="fig">{E(f)}</div><div class="cap">{E(c)}<small>{E(src)}</small></div></div>
    <svg class="chart" data-chart="{s['chart']}" viewBox="0 0 860 330"></svg>
  </div>
  {vis}
  <div class="impl">
    <div class="ilead"><div class="kick">The Implication</div><p>{E(s['lead'])}</p></div>
    {impl}
  </div>
  <div class="insight">{icon('flame', 'fl')}<div><div class="kick">Bromic Insight</div><p>{E(s['insight'])}</p></div></div>
  {folio(p)}</section>'''

    pages, p = [], 1
    cv = C.COVER
    pages.append(f'''<section class="pg cover">{img(cv['img'], 'bg', cv['alt'])}
  <div class="cv"><img class="logo" src="LOGO" alt="Bromic Heating">
    <div class="ckick">{E(cv.get('kicker', 'Bromic Outdoor Living Report'))}</div>
    <h1>{cv.get('title_html', 'Outdoor Living<br>Trends <em>2027</em>')}</h1>
    <div class="region">{E(cv.get('region', C.REGION))}</div>
    <p>{E(cv['sub'])}</p>
  </div><div class="cvnote">{E(cv['note'])}</div></section>''')
    p += 1
    it = C.INTRO
    toc = ''.join(f'<a class="tile" href="#s{s["n"]}"><span class="tn">{s["n"]}</span><span class="tt">{E(s["title"])}</span>'
                  f'<span class="tw">{" · ".join(w for w, _ in s["words"])}</span></a>' for s in C.SHIFTS)
    paras = ''.join(f'<p>{E(x)}</p>' for x in it['paras'])
    pages.append(f'''<section class="pg intro">
  <div class="il"><div class="kick">Outdoor Living Trends 2027</div>
    <h2>{E(it['h2'])}</h2>
    <p class="lede">{E(it['lede'])}</p>
    {paras}
    <figure class="istrip">{img(it['img'], alt=it['alt'])}</figure>
  </div>
  <div class="ir"><div class="kick">The {n_sh} Shifts</div><div class="toc">{toc}</div></div>{folio(p)}</section>''')
    p += 1
    nm = C.NUMS
    cols = ''.join(f'<div class="nc"><svg class="mini" data-mini="{k}" viewBox="0 0 300 190"></svg><div class="nf">{E(f)}</div><p>{E(t)}</p><small>{E(s)}</small></div>' for k, f, t, s in nm['items'])
    pages.append(f'''<section class="pg nums">
  <div class="kick">The Shift In Numbers</div><h2>{E(nm['h2'])}</h2>
  <div class="ncols">{cols}</div>
  <figure class="nstrip">{img(nm['img'], alt=nm['alt'])}</figure>
  {folio(p, True)}</section>''')
    p += 1
    for s in C.SHIFTS:
        pages.append(page_a(s, p)); p += 1
        pages.append(page_b(s, p)); p += 1
    cl = C.CLOSE
    checks = ''.join(f'<li><span class="cb" data-r="box"></span>{E(t)}</li>' for t in cl['checks'])
    pages.append(f'''<section class="pg close">
  <figure class="cph">{img(cl['img'], alt=cl['alt'])}</figure>
  <div class="ct"><div class="kick">The Conclusion</div><h2>{E(cl['h2'])}</h2>
    <p class="read">{E(cl['read'])}</p>
    <div class="cgrid">
      <div><svg class="chart" data-chart="{cl['chart']}" viewBox="0 0 520 280"></svg><small>{E(cl['chart_cap'])}</small></div>
      <div class="gap"><svg class="mini" data-mini="{cl['gap_mini']}" viewBox="0 0 220 220"></svg><p>{cl['gap_html']}</p><small>{E(cl['gap_src'])}</small></div>
    </div>
    <div class="ckl"><div class="kick">{E(cl.get('checks_title', 'What Early Planning Enables'))}</div><ul>{checks}</ul></div>
  </div>{folio(p)}</section>''')
    p += 1
    po = C.POSTER
    lines = ''.join(f'<li><b>{E(a)}</b><span>{E(b)}</span></li>' for a, b in po['lines'])
    pimg, palt = (po['img_letter'], po['alt_letter']) if letter and po.get('img_letter') else (po['img'], po['alt'])
    pages.append(f'''<section class="pg poster">{img(pimg, 'bg', palt)}
  <div class="pt"><div class="kick">{E(po.get('kicker', 'Plan It In'))}</div>
    <ul class="plan">{lines}</ul>
    <div class="cta">{E(po['cta'])}</div><div class="site">{E(po['site'])}</div>
    <img class="logo" src="LOGOW" alt="Bromic Heating"></div></section>''')
    p += 1
    src = ''.join(f'<li>{E(s)}</li>' for s in C.SOURCES)
    pages.append(f'''<section class="pg srcs"><div class="kick">Sources</div><h2>Where The Numbers Come From</h2><ol>{src}</ol>
  <p class="note">{E(C.NOTE)}</p>
  {folio(p)}</section>''')

    css = open(os.path.join(HERE, 'report.css')).read()
    if letter: css += '\n' + open(os.path.join(HERE, 'report-letter.css')).read()
    js = open(os.path.join(HERE, 'report.js')).read()
    charts = open(os.path.join(RD, 'charts.js')).read()
    rough = open(os.path.join(HERE, 'vendor', 'rough-4.6.6.js')).read()
    fonts = os.path.join(ROOT, 'app', 'src', 'fonts')
    if inline:
        css = css.replace('FONT_DIDOT', b64(os.path.join(fonts, 'gfs-didot-latin.woff2'), 'font/woff2')).replace('FONT_ARIMO', b64(os.path.join(fonts, 'arimo-latin.woff2'), 'font/woff2'))
    else:
        css = css.replace('FONT_DIDOT', '../../../app/src/fonts/gfs-didot-latin.woff2').replace('FONT_ARIMO', '../../../app/src/fonts/arimo-latin.woff2')
    body = '\n'.join(pages)
    logo = os.path.join(ROOT, 'images', 'portfolio', 'bromic-logo.png'); logow = os.path.join(ROOT, 'images', 'portfolio', 'bromic-logo-white.png')
    if inline:
        body = body.replace('src="LOGO"', f'src="{b64(logo, "image/png")}"').replace('src="LOGOW"', f'src="{b64(logow, "image/png")}"')
        body = re.sub(r'src="img/([^"]+)"', lambda m: f'src="{b64(os.path.join(RD, "img", m.group(1)), "image/webp")}"', body)
    else:
        body = body.replace('src="LOGO"', 'src="../../../images/portfolio/bromic-logo.png"').replace('src="LOGOW"', 'src="../../../images/portfolio/bromic-logo-white.png"')
    doc = f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>{E(getattr(C, 'TITLE', 'Outdoor Living Trends 2027'))}</title>
<style>{css}</style></head><body><main id="deck">
{body}
</main><script>{rough}</script><script>{charts}</script><script>{js}</script></body></html>'''
    name = (C.FILE + ('-Letter' if letter else '') + '.html') if inline else ('letter.html' if letter else 'index.html')
    out = os.path.join(RD, name)
    open(out, 'w').write(doc)
    print(out, round(len(doc) / 1e6, 2), 'MB')

if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    build(args[0] if args else 'na', inline='--inline' in sys.argv, letter='--letter' in sys.argv)
