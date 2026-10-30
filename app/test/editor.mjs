// The Hub editor writes a reviewer's change back into the file: only the changed block or front-matter line moves.
//   node app/test/editor.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { marked } from 'marked';
const src = fs.readFileSync(new URL('../src/editor.js', import.meta.url), 'utf8');
const ctx = { window: {}, document: { addEventListener() {} }, localStorage: { getItem: () => null, setItem() {} }, sessionStorage: { getItem: () => null }, TextEncoder, TextDecoder, btoa, atob, console };
vm.runInNewContext(src, ctx);
const ED = ctx.window.HubEditor;
const md = '---\nid: X\ntitle: "Old title"\nsummary: "Old summary"\nhero: l-1\n---\n# Head\n\nFirst para.\n\nSecond para [^s1].\n';
const body = md.slice(md.indexOf('# Head'));
const at = md.indexOf('# Head');
let o = at; const blocks = marked.lexer(body).map((t) => [o, (o += t.raw.length)]);   // as scripts/build.mjs does
const it = { id: 'X', hero: 'l-1', title: 'Old title', summary: 'Old summary', markdown: md, blocks };
const nth = (re) => blocks.findIndex(([a, b]) => re.test(md.slice(a, b)));
assert.equal(it.blocks.map(([a, b]) => md.slice(a, b)).join(''), body, 'fixture offsets');
// same file as the build: offsets
let r = ED.apply(md, it, { blocks: { [nth(/First/)]: 'First para, rewritten.' }, title: 'New: "quoted" title', hero: 'w-2' });
assert.equal(r.problems.length, 0, String(r.problems));
assert.match(r.text, /\n\nFirst para, rewritten\.\n\nSecond para \[\^s1\]\.\n$/);
assert.match(r.text, /^title: "New: \\"quoted\\" title"$/m);
assert.match(r.text, /^hero: "w-2"$/m);
assert.match(r.text, /^summary: "Old summary"$/m);
// the file moved on since the build: the block is found by its text
const moved = md.replace('# Head', '# Head, renamed by someone else');
r = ED.apply(moved, it, { blocks: { [nth(/Second/)]: 'Second para, edited [^s1].' } });
assert.equal(r.problems.length, 0, String(r.problems));
assert.match(r.text, /# Head, renamed by someone else/);
assert.match(r.text, /Second para, edited \[\^s1\]\./);
// and when the block itself was changed elsewhere, it refuses rather than guessing
r = ED.apply(md.replace('First para.', 'First para changed.'), it, { blocks: { [nth(/First/)]: 'Mine.' } });
assert.equal(r.problems.length, 1);
// rules: hard ones block a save
assert.ok(ED.lint('the 500 series heater').some((l) => l.hard));
assert.ok(ED.lint('Tungsten Coastal looks great').some((l) => l.hard));
assert.ok(ED.lint('controls are optional').some((l) => l.hard));
assert.ok(!ED.lint('Tungsten Coastal, coming soon.').some((l) => l.hard));
console.log('editor: 4 checks ok');
