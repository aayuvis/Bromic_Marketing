"""Build, check and print the Commercial Edition in both formats (landscape and US Letter).
Run from the repo root: python3 reports/planning-guide/engine/publish_commercial.py [--shots DIR] [--no-pdf] [--no-prep]"""
import os, subprocess, sys, tempfile, shutil
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); PG = os.path.dirname(HERE); ROOT = os.path.abspath(os.path.join(PG, '..', '..'))
ed = 'commercial'; RD = os.path.join(PG, ed)
shots = sys.argv[sys.argv.index('--shots') + 1] if '--shots' in sys.argv else '-'
FILE = 'Bromic-Outdoor-Heating-Planning-Guide-2027-Commercial'
run = lambda *a: subprocess.run(a, cwd=ROOT, check=True)
if '--no-prep' not in sys.argv: run('python3', os.path.join(HERE, 'prep_commercial.py'))
for extra in ([], ['--letter'], ['--inline'], ['--letter', '--inline']): run('python3', os.path.join(HERE, 'build_commercial.py'), *extra)
tmp = tempfile.mkdtemp(); os.makedirs(os.path.join(tmp, 'img'))
for f in os.listdir(os.path.join(RD, 'img')):
    if f.endswith('.webp'):
        im = Image.open(os.path.join(RD, 'img', f)).convert('RGB'); im.thumbnail((1700, 1700)); im.save(os.path.join(tmp, 'img', f[:-5] + '.jpg'), quality=80, optimize=True)
ok = True
for src, name, sub in (('index.html', FILE + '.pdf', 'landscape'), ('letter.html', FILE + '-Letter.pdf', 'letter')):
    h = open(os.path.join(RD, src)).read().replace('.webp"', '.jpg"').replace('../../../', ROOT + '/')
    open(os.path.join(tmp, src), 'w').write(h)
    sd = '-'
    if shots != '-': sd = os.path.join(shots, ed, sub); os.makedirs(sd, exist_ok=True)
    args = ['node', os.path.join(HERE, 'qa.js'), os.path.join(tmp, src), sd] + ([] if '--no-pdf' in sys.argv else [os.path.join(RD, name)])
    env = dict(os.environ, NODE_PATH=os.pathsep.join(x for x in [os.path.join(ROOT, 'app', 'node_modules'), os.environ.get('NODE_PATH', '')] if x))
    ok = subprocess.run(args, cwd=ROOT, env=env).returncode == 0 and ok
shutil.rmtree(tmp); sys.exit(0 if ok else 1)
