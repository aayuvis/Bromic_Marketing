#!/usr/bin/env node
// Prints a Markdown table of every assumption in tools/<id>/config.json (path · value · unit · source · owner · status).
// Used to keep each tool's README in step with its config:  node tools/readme-table.mjs A03-sizing
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const id = process.argv[2];
const cfg = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), id, 'config.json'), 'utf8'));
const cell = (s) => String(s ?? '').replace(/\|/g, '/').replace(/\n/g, ' ');
const rows = [];
(function walk(n, p) {
  if (Array.isArray(n)) return n.forEach((x, i) => walk(x, `${p}[${i}]${x && x.id ? ` (${x.id})` : ''}`));
  if (!n || typeof n !== 'object') return;
  if ('value' in n) return rows.push(`| \`${p}\` | ${cell(JSON.stringify(n.value))} | ${cell(n.unit)} | ${cell(n.source)} | ${cell(n.owner)} | ${n.verified ? 'verified' : cell(n.verify)} |`);
  for (const [k, v] of Object.entries(n)) if (!k.startsWith('_')) walk(v, p ? `${p}.${k}` : k);
})(cfg, '');
console.log('| Setting | Value | Unit | Source | Owner | Status |\n|---|---|---|---|---|---|\n' + rows.join('\n'));
