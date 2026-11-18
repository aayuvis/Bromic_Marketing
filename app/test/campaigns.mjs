// Campaigns (data/campaigns/*.json): Bromic voice in reader-facing copy (no long dash, no exclamation mark), no competitor named
// outside the audit, every film's turn names its Affinity Smart-Heat control, every price illustrative, every image on disk.
import fs from 'node:fs'; import path from 'node:path';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
const D = path.join(ROOT, 'data', 'campaigns');
let bad = 0; const fail = (f, m) => { bad++; console.log(`  FAIL ${f}: ${m}`); };
for (const f of fs.existsSync(D) ? fs.readdirSync(D).filter((x) => x.endsWith('.json')) : []) {
  const C = JSON.parse(fs.readFileSync(path.join(D, f), 'utf8'));
  const { audit, voice_examples, ...copy } = C; const text = JSON.stringify(copy);
  if (text.includes('—')) fail(f, 'long dash in campaign copy');
  if (/[a-z]!(\s|")/.test(text)) fail(f, 'exclamation mark in campaign copy');
  if (/Infratech|Heatscope|Heatstrip/i.test(text)) fail(f, 'competitor named outside the audit');
  for (const p of C.films || []) { if (!/Affinity/.test(p.turn || '')) fail(f, `${p.id} turn without Affinity controls`); if (!p.proof) fail(f, `${p.id} has no product truth`); }
  for (const r of [...(C.receipts || []), ...(C.scenes || [])]) if (r.illustrative !== true) fail(f, `${r.id} prices not marked illustrative`);
  const keys = [...(C.films || []).flatMap((p) => [p.img_cold, p.img_warm]), ...(C.concepts || []).map((c) => c.img), ...(C.trade || []).map((t) => t.img), ...(C.scenes || []).flatMap((s) => [s.img_cold, s.img_warm])].filter(Boolean);
  for (const k of keys) if (!fs.existsSync(path.join(ROOT, 'images', 'campaigns', C.id, k + '.webp'))) fail(f, `image ${k} missing`);
  if (!(audit || []).length) fail(f, 'no audit');
  for (const a of audit || []) if (!['fixed', 'open'].includes(a.status) || !['high', 'medium', 'low'].includes(a.severity)) fail(f, `audit ${a.id} status or severity`);
  console.log(`  ok   campaign ${C.id}: ${(C.films || []).length} films, ${(C.concepts || []).length} concepts, ${(C.trade || []).length} trade, ${(audit || []).length} audit items`);
}
process.exit(bad ? 1 : 0);
