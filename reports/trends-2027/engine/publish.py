"""Build, quality-check and print one trend report in both formats.
Run from the repo root:  python3 reports/trends-2027/engine/publish.py <id> [--shots DIR] [--no-pdf] [--no-prep]
  1. prepares the images (engine/prep.py)
  2. builds landscape (index.html) and US Letter portrait (letter.html), plus single-file versions
  3. runs engine/qa.js on both (fails on script errors, missing images, overflow, overlapping labels or blocks)
  4. prints both PDFs with JPEG images (PDFs keep the size down; WebP is stored uncompressed by the printer)
PDFs and single-file HTML are written next to index.html and are not committed (see .gitignore)."""
import os, subprocess, sys, tempfile, shutil, importlib.util
from PIL import Image
HERE = os.path.dirname(os.path.abspath(__file__)); TR = os.path.dirname(HERE); ROOT = os.path.abspath(os.path.join(TR, '..', '..'))
rid = sys.argv[1]
shots = sys.argv[sys.argv.index('--shots') + 1] if '--shots' in sys.argv else '-'
RD = os.path.join(TR, rid)
spec = importlib.util.spec_from_file_location('c', os.path.join(RD, 'content.py')); C = importlib.util.module_from_spec(spec); spec.loader.exec_module(C)
run = lambda *a: subprocess.run(a, cwd=ROOT, check=True)
if '--no-prep' not in sys.argv: run('python3', os.path.join(HERE, 'prep.py'), rid)  # needs OpenCV; the committed img/ is enough to build
for extra in ([], ['--letter'], ['--inline'], ['--letter', '--inline']):
    run('python3', os.path.join(HERE, 'build.py'), rid, *extra)
tmp = tempfile.mkdtemp(); os.makedirs(os.path.join(tmp, 'img'))
for f in os.listdir(os.path.join(RD, 'img')):
    if f.endswith('.webp'):
        im = Image.open(os.path.join(RD, 'img', f)).convert('RGB'); im.thumbnail((1700, 1700))
        im.save(os.path.join(tmp, 'img', f[:-5] + '.jpg'), quality=80, optimize=True)
ok = True
for src, name, sub in (('index.html', C.FILE + '.pdf', 'landscape'), ('letter.html', C.FILE + '-Letter.pdf', 'letter')):
    h = open(os.path.join(RD, src)).read().replace('.webp"', '.jpg"').replace('../../../', ROOT + '/')
    open(os.path.join(tmp, src), 'w').write(h)
    sd = '-'
    if shots != '-':
        sd = os.path.join(shots, rid, sub); os.makedirs(sd, exist_ok=True)
    args = ['node', os.path.join(HERE, 'qa.js'), os.path.join(tmp, src), sd]
    if '--no-pdf' not in sys.argv: args.append(os.path.join(RD, name))
    env = dict(os.environ, NODE_PATH=os.pathsep.join(x for x in [os.path.join(ROOT, 'app', 'node_modules'), os.environ.get('NODE_PATH', '')] if x))
    r = subprocess.run(args, cwd=ROOT, env=env)
    ok = ok and r.returncode == 0
shutil.rmtree(tmp)
sys.exit(0 if ok else 1)
