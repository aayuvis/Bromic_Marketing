// Product marketing frameworks (data/product-marketing/*.json): every buyer has every benefit in matrix 1, weights are 1–3,
// matrices 2 and 3 cover every benefit, competitor comparisons carry their approver, and no claim uses a long dash or "!".
import fs from 'node:fs'; import path from 'node:path';
const D = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..', 'data', 'product-marketing');
let bad = 0; const fail = (f, m) => { bad++; console.log(`  FAIL ${f}: ${m}`); };
for (const f of fs.existsSync(D) ? fs.readdirSync(D).filter((x) => x.endsWith('.json')) : []) {
  const P = JSON.parse(fs.readFileSync(path.join(D, f), 'utf8'));
  const B = P.benefits.map((b) => b.id), U = P.user_types.map((u) => u.id);
  if (B.filter((b, i) => !P.benefits[i].proposed).length < 10) fail(f, 'needs at least ten core benefit fields');
  for (const c of P.carousels || []) { if (c.cards.length !== 4) fail(f, `${c.id} needs four cards`); for (const k of c.cards) { if (!B.includes(k.benefit)) fail(f, `${c.id} card on unknown benefit ${k.benefit}`); if (!fs.existsSync(path.join(D, '..', '..', 'decks', 'carousels', `${c.id}-${c.cards.indexOf(k) + 1}.jpg`))) fail(f, `${c.id} card image missing; run python3 decks/build-carousels.py`); } }
  for (const s of P.storyboards || []) if (!fs.existsSync(path.join(D, '..', '..', s.board))) fail(f, `${s.id} board missing`);
  for (const u of U) for (const b of B) { const c = (P.m1[u] || {})[b]; if (!c || ![1, 2, 3].includes(c.w) || !c.claim) fail(f, `m1 ${u}/${b}`); }
  for (const b of B) { if (!P.m2.some((r) => r.benefit === b)) fail(f, `m2 has no row for ${b}`); const r = (P.m3.rows || []).find((x) => x.benefit === b); if (!r) fail(f, `m3 has no row for ${b}`); else for (const u of U) if (!(r.users[u] || {}).claim) fail(f, `m3 ${b}/${u}`); }
  if (P.m3.rows && !P.needs_approval) fail(f, 'competitor matrix without needs_approval');
  const text = JSON.stringify([P.m1, P.m2, P.m3]).replace(/\[\[VERIFY[^\]]*\]\]/g, '');
  if (/\S — \S/.test(text)) fail(f, 'long dash in a claim'); if (/[a-z]!/.test(text)) fail(f, 'exclamation mark in a claim');
  console.log(`  ok   ${P.id}: ${U.length} buyers × ${B.length} benefits`);
}
process.exit(bad ? 1 : 0);
