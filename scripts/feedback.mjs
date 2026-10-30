#!/usr/bin/env node
// Lists open Content Hub feedback (GitHub issues titled "[Feedback] …") and edit requests ("[Edit] …", sent from the Hub's
// editor by a reviewer without a GitHub token) grouped by element, for the start of a session.
// An [Edit] issue carries a JSON patch: { file, base_commit, edits: [{ block, old, new }], hero, title, summary }.
// Apply each edit by replacing `old` with `new` in `file` (and the front-matter fields), run the tests, commit with Fixes #N.
//   node scripts/feedback.mjs            open feedback
//   node scripts/feedback.mjs --all      open and closed
// Each issue body starts with a block written by the Hub's Feedback button:
//   <!-- bromic-feedback v1 -->  element: item:RES-CO-01 · section: … · type: Correction · page: … · commit: … ---  then the text.
const REPO = 'aayuvis/Bromic_Marketing';
const all = process.argv.includes('--all');
const res = await fetch(`https://api.github.com/repos/${REPO}/issues?state=${all ? 'all' : 'open'}&per_page=100&sort=created&direction=asc`, { headers: { Accept: 'application/vnd.github+json' } });
if (!res.ok) { console.error(`GitHub answered ${res.status}. Use the GitHub tools instead (list issues in ${REPO}).`); process.exit(1); }
const issues = (await res.json()).filter((i) => !i.pull_request && /^\[(Feedback|Edit)\]/i.test(i.title));
const parse = (b) => { const m = /<!-- bromic-(?:feedback|edit) v1 -->([\s\S]*?)\n---\n?([\s\S]*)/.exec(b || ''); const o = { text: (m ? m[2] : b || '').trim() }; if (m) for (const l of m[1].split('\n')) { const i = l.indexOf(':'); if (i > 0) o[l.slice(0, i).trim()] = l.slice(i + 1).trim(); } return o; };
const by = {};
for (const i of issues) { const f = parse(i.body); (by[f.element || 'unspecified'] ||= []).push({ ...f, n: i.number, state: i.state, title: i.title }); }
if (!issues.length) console.log('No feedback.');
for (const [el, list] of Object.entries(by)) {
  console.log(`\n## ${el}`);
  for (const f of list) console.log(`- #${f.n} [${f.state}] ${f.type || ''}${f.section ? ' · ' + f.section : ''}${f.from ? ' · from ' + f.from : ''}\n  ${f.text.replace(/\n+/g, '\n  ').slice(0, 800)}`);
}
