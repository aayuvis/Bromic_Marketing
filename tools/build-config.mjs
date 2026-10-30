#!/usr/bin/env node
// Regenerates each tool's config.js from its config.json, validates every assumption, and re-inlines
// config + logic + the shared brand CSS and lead gate into index.html, so the page works from file://
// and inside an iframe with no network and no module loading.
//
//   node tools/build-config.mjs           # write
//   node tools/build-config.mjs --check   # exit 1 if any generated file is stale or an assumption is incomplete
//
// index.html holds markers:  /* @inline:begin <path> */ … /* @inline:end <path> */
//   <path> is relative to the tool folder. config.json → `const CONFIG = {...};`
//   a .js file → `const <Name> = (() => { …code without `export`…; return { exported names }; })();`
//   a .css file → copied as is.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
export const TOOLS = ['A03-sizing', 'A20-tco', 'A21-roi', 'CS-capture'];
const check = process.argv.includes('--check');

// Every object with a `value` is an assumption and must be fully described.
export function validateAssumptions(node, path = '', out = []) {
  if (Array.isArray(node)) { node.forEach((n, i) => validateAssumptions(n, `${path}[${i}]`, out)); return out; }
  if (!node || typeof node !== 'object') return out;
  if ('value' in node) {
    for (const k of ['unit', 'source', 'owner']) if (!node[k] || typeof node[k] !== 'string') out.push(`${path}: missing ${k}`);
    if (typeof node.verified !== 'boolean') out.push(`${path}: verified must be true or false`);
    if (node.verified === false && !/\[\[VERIFY: .+ — .+\]\]/.test(node.verify || '')) out.push(`${path}: unverified without a [[VERIFY: what — owner]] note`);
    return out;
  }
  for (const [k, v] of Object.entries(node)) validateAssumptions(v, path ? `${path}.${k}` : k, out);
  return out;
}

const NAMES = { 'logic.js': 'Logic', 'lead.js': 'Lead', 'case-study-taxonomy.json': 'TAX', 'images.json': 'IMAGES' };

function inlineJs(code, file) {
  const names = [...code.matchAll(/^export\s+(?:async\s+)?(?:function\*?|const|let|class)\s+([A-Za-z_$][\w$]*)/gm)].map((m) => m[1]);
  if (/^\s*import\s/m.test(code)) throw new Error(`${file}: inlined modules may not import`);
  const body = code.replace(/^export\s+(?=(?:async\s+)?(?:function|const|let|class)\b)/gm, '');
  const name = NAMES[basename(file)] || basename(file, '.js').replace(/\W/g, '_');
  return `const ${name} = (() => {\n${body}\nreturn { ${names.join(', ')} };\n})();`;
}

function build(tool) {
  const dir = join(ROOT, tool);
  const cfgPath = join(dir, 'config.json');
  const hasCfg = existsSync(cfgPath);  // a tool without assumptions (CS-capture) has no config.json
  const cfg = hasCfg ? JSON.parse(readFileSync(cfgPath, 'utf8')) : {};
  const problems = validateAssumptions(cfg).map((p) => `${tool}/config.json ${p}`);
  const json = JSON.stringify(cfg, null, 2);

  const configJs = `// Generated from config.json by tools/build-config.mjs — edit config.json, not this file.\nexport default ${json};\n`;
  const outputs = hasCfg ? [[join(dir, 'config.js'), configJs]] : [];

  const htmlPath = join(dir, 'index.html');
  if (existsSync(htmlPath)) {
    const html = readFileSync(htmlPath, 'utf8');
    const re = /\/\* @inline:begin (\S+) \*\/[\s\S]*?\/\* @inline:end \1 \*\//g;
    let count = 0;
    const next = html.replace(re, (_, rel) => {
      count++;
      const src = resolve(dir, rel);
      let text;
      if (rel === 'config.json') text = `const CONFIG = ${json};`;
      else if (rel.endsWith('.js')) text = inlineJs(readFileSync(src, 'utf8'), rel);
      else if (rel.endsWith('.json')) text = `const ${NAMES[basename(rel)] || basename(rel, '.json').replace(/\W/g, '_')} = ${JSON.stringify(JSON.parse(readFileSync(src, 'utf8')))};`;
      else text = readFileSync(src, 'utf8').trimEnd();
      if (/<\/(script|style)/i.test(text)) problems.push(`${tool}: ${rel} contains a closing script/style tag`);
      return `/* @inline:begin ${rel} */\n${text}\n/* @inline:end ${rel} */`;
    });
    if (!count) problems.push(`${tool}/index.html: no @inline markers`);
    outputs.push([htmlPath, next]);
  }

  let stale = [];
  for (const [p, text] of outputs) {
    const cur = existsSync(p) ? readFileSync(p, 'utf8') : null;
    if (cur === text) continue;
    if (check) stale.push(p); else writeFileSync(p, text);
  }
  return { problems, stale };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let failed = false;
  for (const t of TOOLS) {
    if (!existsSync(join(ROOT, t, 'index.html'))) { console.error(`${t}: no index.html`); failed = true; continue; }
    const { problems, stale } = build(t);
    for (const p of problems) console.error('  ✗ ' + p);
    for (const s of stale) console.error('  ✗ stale: ' + s + ' (run node tools/build-config.mjs)');
    if (problems.length || stale.length) failed = true;
    else console.log(`${t}: ${check ? 'up to date' : 'built'}`);
  }
  process.exit(failed ? 1 : 0);
}
