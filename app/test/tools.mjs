// Runs every tools/<id>/test.mjs.
import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process';
const T = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..', 'tools');
let bad = 0;
for (const d of fs.readdirSync(T)) {
  const t = path.join(T, d, 'test.mjs');
  if (!fs.existsSync(t)) continue;
  try { execFileSync(process.execPath, [t], { stdio: 'pipe' }); console.log(`  ok   ${d}`); }
  catch (e) { bad++; console.log(`  FAIL ${d}\n${String(e.stdout || '') + String(e.stderr || '')}`); }
}
process.exit(bad ? 1 : 0);
