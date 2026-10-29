"""Generate gap imagery with Gemini, only where Bromic's own photography has nothing that fits.
Key: /root/.gkey (mode 600) or GKEY_FILE. Never commit the key. Raw output -> images/_raw/ (gitignored);
LOOK at every image, then: python3 scripts/gen_images.py --accept <id> ... to add it to the library as `generated`.
Rules: no lettering, no logos, no product close-ups (never draw a Bromic heater that does not exist)."""
import base64, json, os, ssl, sys, time, urllib.request
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
RAW = os.path.join(ROOT, 'images', '_raw'); os.makedirs(RAW, exist_ok=True)
KEY = open(os.environ.get('GKEY_FILE', '/root/.gkey')).read().strip()
MODEL = os.environ.get('GMODEL', 'gemini-3-pro-image')
STYLE = ("Photograph shot on Leica M11 with 50mm Summilux at f/1.4, ISO 150, natural film-like colour, soft bokeh, "
         "warm key light from the top left, hyper-realistic, premium architectural editorial mood, calm and understated. "
         "No text, no lettering, no logos, no signage, no watermark, no brand names.")
SCENES = {
 'g-rough-in': ("Covered patio under construction at rough-in stage: exposed timber ceiling joists and blocking, yellow and white "
                "electrical cable stapled along joists to empty round electrical junction boxes fixed to blocking in the ceiling, "
                "plywood sheathing, late-afternoon light through the open side, no heaters installed, no people.", '16:9',
                'Construction', 'patio ceiling at rough-in', ['BLD','ARC'], 'Covered patio ceiling at rough-in: joists, blocking, cable runs and junction boxes before the soffit closes'),
 'g-plans': ("An architect's large drafting table near a window at dusk: printed architectural floor plans and a building section of a "
             "house with a covered terrace (abstract linework only, no readable text or numbers), a scale ruler, a pencil, a trace roll, "
             "a cup of coffee, soft warm light, shallow depth of field.", '16:9', 'Specification', 'architect studio', ['ARC'],
             'Architectural drawings of a covered terrace on a drafting table'),
 'g-electrician': ("Close view of a licensed electrician's hands, in work gloves, fitting a round electrical junction box to a timber pergola beam "
                   "outdoors, cable entering the box, a cordless drill resting on the beam, dusk sky behind, shallow depth of field. "
                   "Hands and forearms only, no face.", '4:3', 'Installation', 'pergola beam install', ['BLD'],
                   'Electrician fitting a junction box to a pergola beam'),
 'g-restaurant-service': ("A busy upscale restaurant terrace at dusk in autumn: guests in light jackets dining at candlelit tables, a server "
                          "carrying plates, warm overhead glow falling on the guests from a source above and out of frame (no heaters or lamps visible), "
                          "timber canopy edge at the top of frame, city street softly blurred beyond, natural candid moment, nobody looking at the camera.", '16:9',
                          'Commercial', 'restaurant terrace in service', ['COM'], 'Guests dining on a heated restaurant terrace on an autumn evening'),
 'g-operator': ("A restaurant owner in her forties reviewing figures on a tablet at the end of a bar counter in the late afternoon, an empty "
                "terrace with tables visible through open glass doors behind her, calm and focused, natural light, candid.", '4:3',
                'Commercial', 'operator at the bar', ['COM'], 'Restaurant owner reviewing patio revenue on a tablet'),
 'g-family-evening': ("A family of three (parents and a girl of about nine) sharing dessert at an outdoor table on a covered patio on a cool "
                      "autumn evening, light knitwear, warm glow from above, garden lights in soft bokeh behind, candid, faces partly turned, "
                      "nobody looking at the camera.", '16:9', 'Lifestyle', 'family on a covered patio', ['RES'],
                      'Family lingering over dessert on a warm covered patio on an autumn evening'),
}
ctx = ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt')
op = urllib.request.build_opener(urllib.request.ProxyHandler(), urllib.request.HTTPSHandler(context=ctx))
def gen(sid, prompt, ar):
    body = {'contents': [{'parts': [{'text': prompt + ' ' + STYLE}]}],
            'generationConfig': {'responseModalities': ['IMAGE'], 'imageConfig': {'aspectRatio': ar}}}
    req = urllib.request.Request(f'https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent',
        data=json.dumps(body).encode(), headers={'x-goog-api-key': KEY, 'Content-Type': 'application/json'})
    resp = json.loads(op.open(req, timeout=300).read())
    for part in resp.get('candidates', [{}])[0].get('content', {}).get('parts', []):
        b = part.get('inlineData') or part.get('inline_data')
        if b and b.get('data'):
            open(os.path.join(RAW, sid + '.png'), 'wb').write(base64.b64decode(b['data'])); return True
    raise RuntimeError('no image')

def accept(ids):
    from PIL import Image
    lib = os.path.join(ROOT, 'images', 'library'); mp = os.path.join(lib, 'manifest.json')
    man = json.load(open(mp)); have = {m['id'] for m in man}
    for sid in ids:
        _, ar, prod, setting, aud, alt = SCENES[sid]
        im = Image.open(os.path.join(RAW, sid + '.png')).convert('RGB')
        big = im.copy(); big.thumbnail((1600, 1600)); big.save(os.path.join(lib, sid + '.webp'), quality=80)
        th = im.copy(); th.thumbnail((520, 520)); th.save(os.path.join(lib, sid + '-t.webp'), quality=72)
        rec = {'id': sid, 'file': f'images/library/{sid}.webp', 'thumb': f'images/library/{sid}-t.webp', 'w': big.size[0], 'h': big.size[1],
               'orientation': 'landscape' if im.width > im.height * 1.15 else 'portrait' if im.height > im.width * 1.15 else 'square',
               'product': prod, 'setting': setting, 'audiences': aud, 'alt': alt, 'source': 'Generated (Gemini)', 'source_file': 'scripts/gen_images.py',
               'page': 0, 'rights': 'AI-generated for Bromic; no Bromic product depicted in detail; label as illustrative', 'status': 'generated'}
        man = [m for m in man if m['id'] != sid] + [rec]
    json.dump(man, open(mp, 'w'), indent=1); print('accepted', ids)

if __name__ == '__main__':
    if '--accept' in sys.argv: accept(sys.argv[sys.argv.index('--accept') + 1:]); sys.exit()
    only = sys.argv[1:] or list(SCENES)
    for sid in only:
        for a in (1, 2, 3):
            try: gen(sid, SCENES[sid][0], SCENES[sid][1]); print(sid, 'ok', flush=True); break
            except Exception as e: print(sid, 'attempt', a, type(e).__name__, str(e)[:120], flush=True); time.sleep(5 * a)
