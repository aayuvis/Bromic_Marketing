// Checks translations in content/i18n/<lang>/ against their English master (templates/regionalisation.md).
//   node app/test/i18n.mjs                 every translation
//   node app/test/i18n.mjs de [files...]   one language, optionally only some English source paths
// A translation must keep every citation marker, image, internal link and VERIFY note of its master, carry the translation
// front matter, use metric units only, and keep the hard rules (no "500 series", Coastal/Select coming soon, controls never optional).
import fs from 'node:fs';
import path from 'node:path';
import yaml from '../node_modules/js-yaml/dist/js-yaml.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..', '..');
const I18N = path.join(ROOT, 'content', 'i18n');
const walk = (d) => !fs.existsSync(d) ? [] : fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const parse = (f) => { const raw = fs.readFileSync(f, 'utf8'); const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/); if (!m) return null; return { fm: yaml.load(m[1]) || {}, body: m[2] }; };
const count = (s, re) => (s.match(re) || []).length;
const set = (s, re) => new Set([...s.matchAll(re)].map((m) => m[1]));

const [langArg, ...only] = process.argv.slice(2);
const langs = langArg ? [langArg] : (fs.existsSync(I18N) ? fs.readdirSync(I18N) : []);
let failures = 0, checked = 0;
const RULES = {
  de: { controlsOptional: /(Steuerung|Steuergerät)[^.]{0,40}\boptional\b|\boptional\b[^.]{0,40}(Steuerung|Steuergerät)/i },
  nl: { controlsOptional: /(bediening|besturing|regelaar)[^.]{0,40}\boptioneel\b|\boptioneel\b[^.]{0,40}(bediening|besturing|regelaar)/i },
};
for (const lang of langs) {
  const files = walk(path.join(I18N, lang)).filter((f) => f.endsWith('.md'));
  for (const f of files) {
    const rel = path.relative(path.join(I18N, lang), f);
    const src = path.join(ROOT, 'content', rel);
    if (only.length && !only.some((o) => o.endsWith(rel))) continue;
    checked++;
    const problems = [];
    const t = parse(f), e = fs.existsSync(src) && parse(src);
    if (!t) problems.push('no front matter');
    else if (!e) problems.push(`no English master at content/${rel}`);
    else {
      const fm = t.fm;
      if (fm.lang !== lang) problems.push(`lang must be ${lang}`);
      if (String(fm.translation_of) !== String(e.fm.id)) problems.push(`translation_of must be ${e.fm.id}`);
      if (String(fm.id) !== String(e.fm.id)) problems.push('id must match the English file');
      if (!fm.translation_status) problems.push('translation_status missing');
      for (const k of ['type', 'hero', 'gated', 'status']) if (JSON.stringify(fm[k]) !== JSON.stringify(e.fm[k])) problems.push(`${k} must match the English file`);
      if (JSON.stringify(fm.audience) !== JSON.stringify(e.fm.audience) || JSON.stringify(fm.stage) !== JSON.stringify(e.fm.stage)) problems.push('audience and stage must match');
      if ((fm.sources || []).length !== (e.fm.sources || []).length) problems.push('sources list must match the English file');
      if (!fm.title || fm.title === e.fm.title) problems.push('title not translated');
      const b = t.body, eb = e.body;
      const cites = set(eb, /\[\^(\w+)\]/g), tc = set(b, /\[\^(\w+)\]/g);
      for (const c of cites) if (!tc.has(c)) problems.push(`citation [^${c}] missing`);
      for (const c of tc) if (!cites.has(c)) problems.push(`citation [^${c}] not in the English file`);
      const imgs = set(eb, /img:([\w.-]+)/g), ti = set(b, /img:([\w.-]+)/g);
      for (const i of imgs) if (!ti.has(i)) problems.push(`image ${i} missing`);
      const links = set(eb, /\((?:item|asset):([\w-]+)\)/g), tl = set(b, /\((?:item|asset):([\w-]+)\)/g);
      for (const l of links) if (!tl.has(l)) problems.push(`internal link ${l} missing`);
      if (count(b, /\[\[VERIFY:/g) < count(eb, /\[\[VERIFY:/g)) problems.push(`VERIFY notes: ${count(b, /\[\[VERIFY:/g)} of ${count(eb, /\[\[VERIFY:/g)}`);
      if (/\b\d[\d,.]*\s?(ft²|sq\.? ?ft|square feet|°F)\b|\b\d[\d,.]*\s?(BTU|Btu)(\/h(r)?)?\b(?![^(]*\))/.test(b.replace(/`[^`]*`/g, ''))) problems.push('imperial unit left in the text (ft², °F or BTU)');
      if (/500 series/i.test(b)) problems.push('legacy "500 series" naming');
      if (/Tungsten (Coastal|Select)/i.test(b) && !/(coming soon|demnächst|binnenkort|bald erhältlich|in Kürze)/i.test(b)) problems.push('Tungsten Coastal/Select without "coming soon"');
      if (RULES[lang] && RULES[lang].controlsOptional.test(b)) problems.push('controls described as optional');
      if (/[a-zäöüß]!\s/i.test(b.replace(/!\[/g, ''))) problems.push('exclamation mark');
    }
    if (problems.length) { failures++; console.log(`  ✗ ${lang}/${rel}\n      ${problems.join('\n      ')}`); }
  }
}
console.log(`translations: ${checked} checked · ${failures} with problems`);
process.exit(failures ? 1 : 0);
