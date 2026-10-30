// Hard rules from HANDOVER §5–§7, checked on every content item. Exit 1 on any failure.
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
const walk = (d) => !fs.existsSync(d) ? [] : fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const files = walk(path.join(ROOT, 'content')).filter((f) => f.endsWith('.md') && !f.includes(path.sep + 'i18n' + path.sep));  // translations: test/i18n.mjs
const fails = [], warns = [];
const fail = (f, m) => fails.push(`${path.relative(ROOT, f)}: ${m}`);
for (const f of files) {
  const raw = fs.readFileSync(f, 'utf8');
  const [, fmTxt, body] = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/) || [];
  if (!fmTxt) { fail(f, 'no frontmatter'); continue; }
  const fm = yaml.load(fmTxt);
  const prose = body.replace(/```[\s\S]*?```/g, '').replace(/<!--[\s\S]*?-->/g, '');
  // 1. controls with every product recommendation
  if (/\b(Platinum|Eclipse|Tungsten)\b/.test(prose) && !['report', 'stats-page', 'case-study'].includes(fm.type) && !/Affinity|controls?\b/i.test(prose)) fail(f, 'names a heater but never its controls');
  if (prose.split('\n').some((l) => /controls?[^.\n]{0,40}\boptional\b/i.test(l) && !/^#{2,4} |never optional|not optional|isn.t optional|not an? optional|required|"Optional Step/i.test(l))) fail(f, 'presents controls as optional');
  // 2. coming soon
  if (/Tungsten (Coastal|Select)/.test(prose) && !/coming soon/i.test(prose)) fail(f, 'Tungsten Coastal/Select without "coming soon"');
  // 3. legacy naming, built-in Tungsten gas BTU
  if (/500 series/i.test(prose)) fail(f, 'legacy "500 series" naming');
  if (/39,?800/.test(prose) && !/\[\[VERIFY|conflict|do not publish|removed|old figure|2021/i.test(prose)) fail(f, '39,800 BTU published as fact');
  // 4. one CTA (gated assets and articles)
  if (['article', 'kb', 'blog', 'gated-guide', 'stats-page', 'spec-kit', 'sales-kit', 'tool'].includes(fm.type) && fm.status !== 'template' && !(fm.cta && fm.cta.label)) fail(f, 'missing cta');
  // 5. every source has a publisher and a url or file
  for (const s of fm.sources || []) if (!s.publisher || !s.url) fail(f, `source ${s.id} lacks publisher or url`);
  // 6. voice: no exclamation marks, no emoji
  if (/[A-Za-z][!](\s|$)/.test(prose.replace(/!\[/g, ''))) fail(f, 'exclamation mark');
  if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(prose)) fail(f, 'emoji');
  // 7. code/permit content carries the disclaimer
  if (/\b(NEC|NFPA|IFC|permit|fire code|building code)\b/.test(prose) && ['article', 'kb', 'blog', 'gated-guide', 'spec-kit'].includes(fm.type) && !/local[^.\n]{0,30}(authority|authorities|inspector|jurisdiction|fire marshal|building department)|authority having jurisdiction|\bAHJ\b|FDNY|Department of Buildings|licensed (electrician|gas fitter|master plumber)/i.test(prose)) fail(f, 'code content without local-authority disclaimer');
  // 8. competitor mentions need approval flag
  if (/\b(Infratech|Heatscope|Heatstrip)\b/.test(prose) && !fm.needs_approval) fail(f, 'competitor named without needs_approval');
  // warn: a percentage in a paragraph with no citation
  for (const para of prose.split(/\n\s*\n/)) if (/\b\d{1,3}(\.\d)?%/.test(para) && !/\[\^\w+\]|\[\[VERIFY|^\|/.test(para) && !/^#/.test(para.trim())) warns.push(`${path.relative(ROOT, f)}: uncited % — "${para.trim().slice(0, 70)}…"`);
}
warns.forEach((w) => console.log('  warn ' + w));
fails.forEach((x) => console.log('  FAIL ' + x));
console.log(`content rules: ${files.length} items · ${fails.length} failures · ${warns.length} warnings`);
process.exit(fails.length ? 1 : 0);
