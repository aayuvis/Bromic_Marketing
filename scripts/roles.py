"""Replace people's names with team roles (data/team-roles.json) across the Hub's sources. Idempotent.
python3 scripts/roles.py [--dry-run]"""
import json, os, re, sys
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
R = json.load(open(os.path.join(ROOT, 'data', 'team-roles.json')))['roles']
NAMES = [  # longest first
  ('Brian Kim/Finance', 'Finance'), ('Brian Kim / Finance', 'Finance'), ('Mike Clifford', 'Product team'), ('Megan Spies', 'Marketing'),
  ('Brian Kim', 'Digital marketing'), ('Blake Petty', 'Hospitality sales'), ('Shaughn Ritchie', 'Specification and compliance'),
  ('Arvin Avaness', 'Trade sales'), ('Peter Abraham', 'Sales operations'), ('Karl Tschauner', 'US field sales'),
  ('Josh Maingard', 'Marine team'), ('Sean (West Canada)', 'Canada sales'), ('Raffaele Marti', 'Germany partner'), ('Aayush Vishnoi', 'Leadership'),
]
DIRS = ['content', 'data', 'reviews', 'templates', 'tools', 'images/library', 'docs']
SKIP = re.compile(r'(node_modules|/_raw/|team-roles\.json|\.webp$|\.png$|\.jpe?g$|\.pdf$)')
dry = '--dry-run' in sys.argv; n_files = n_subs = 0
for d in DIRS:
    for dp, _, fs in os.walk(os.path.join(ROOT, d)):
        for f in fs:
            p = os.path.join(dp, f)
            if SKIP.search(p) or not re.search(r'\.(md|json|js|html|yml|yaml|txt)$', f): continue
            lang = 'de' if '/i18n/de/' in p else 'nl' if '/i18n/nl/' in p else 'en'
            t = open(p, encoding='utf-8').read(); o = t
            for name, role in NAMES:
                rep = role if lang == 'en' else R[role][lang]
                t = t.replace(name, rep)
            if t != o:
                n_files += 1; n_subs += sum(o.count(nm) for nm, _ in NAMES)
                if not dry: open(p, 'w', encoding='utf-8').write(t)
print(f'{n_files} files, {n_subs} names replaced{" (dry run)" if dry else ""}')
