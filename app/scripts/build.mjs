// Builds the Bromic Content Hub: reads ../content, ../data, ../images, ../tools and writes app/dist.
// dist/data.js sets window.HUB, so the hub opens from file:// with no server.
//   node scripts/build.mjs           build dist/
//   node scripts/build.mjs --check   parse + validate only, exit 1 on errors
//   node scripts/build.mjs --single  also write dist-single/ (one HTML + images) for previews
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { marked } from 'marked';

const APP = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const ROOT = path.resolve(APP, '..');
const DIST = path.join(APP, 'dist');
const CHECK = process.argv.includes('--check');
const SINGLE = process.argv.includes('--single');

const readJSON = (p) => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const walk = (dir) => !fs.existsSync(dir) ? [] : fs.readdirSync(dir, { withFileTypes: true })
  .flatMap((d) => d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export const TYPES = {
  article: 'Article', kb: 'Knowledge base', 'gated-guide': 'Gated guide', report: 'Report', 'stats-page': 'Stats page',
  'spec-kit': 'Specification kit', 'sales-kit': 'Sales kit', 'case-study': 'Case study', tool: 'Tool', blog: 'Blog post',
};
const AUD = ['RES', 'ARC', 'BLD', 'COM'];
const STG = ['AW', 'CO', 'IN', 'PP', 'BY'];

const matrix = readJSON('data/journey-matrix.json');
const assets = readJSON('data/assets.json').assets;
const facts = readJSON('data/product-facts.json');
const images = readJSON('images/library/manifest.json');
const imgIds = new Set(images.map((i) => i.id));
const assetIds = new Set(assets.map((a) => a.id));

function parse(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { file, error: 'no frontmatter' };
  let fm;
  try { fm = yaml.load(m[1]) || {}; } catch (e) { return { file, error: 'yaml: ' + e.message.split('\n')[0] }; }
  return { file, fm, body: m[2] };
}

const arr = (v) => v == null ? [] : Array.isArray(v) ? v : [v];
const words = (s) => (s.replace(/```[\s\S]*?```/g, '').replace(/[#>*_|`\-]/g, ' ').match(/[A-Za-z0-9][\w'’.,%$/-]*/g) || []).length;

function faqOf(body) {
  const i = body.search(/^##\s+(FAQ|Frequently asked questions)\s*$/im);
  if (i < 0) return [];
  const rest = body.slice(i).split('\n').slice(1).join('\n');
  const stop = rest.search(/^##\s/m);
  const block = stop >= 0 ? rest.slice(0, stop) : rest;
  return block.split(/^###\s+/m).slice(1).map((chunk) => {
    const [q, ...a] = chunk.split('\n');
    return { q: q.trim(), a: a.join(' ').replace(/\[\^s?\w+\]/g, '').replace(/\[\[(VERIFY|DIAGRAM):[^\]]*\]\]/g, '').replace(/[*_`]/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\s+/g, ' ').trim() };
  }).filter((x) => x.q && x.a);
}

function render(body, item, srcIndex) {
  let md = body;
  const verifies = [];
  md = md.replace(/\[\[VERIFY:\s*([^\]]+?)\]\]/g, (_, t) => { verifies.push(t.trim()); return `<mark class="verify" title="Needs verification">VERIFY: ${esc(t.trim())}</mark>`; });
  md = md.replace(/\[\[DIAGRAM:\s*([^\]]+?)\]\]/g, (_, t) => `<span class="diagram">DIAGRAM: ${esc(t.trim())}</span>`);
  md = md.replace(/\[\^(\w+)\]/g, (_, id) => {
    const n = srcIndex[id];
    return n ? `<sup class="cite"><a href="#src-${esc(item.id)}-${esc(id)}" data-src="${esc(id)}">${n}</a></sup>` : `<sup class="cite missing" title="No source ${esc(id)}">?</sup>`;
  });
  const renderer = new marked.Renderer();
  renderer.image = (href, title, text) => {
    if (href?.startsWith('img:')) {
      const id = href.slice(4);
      const im = images.find((i) => i.id === id);
      if (!im) return `<span class="missing">missing image ${esc(id)}</span>`;
      return `<figure><img src="${im.file}" alt="${esc(text || im.alt)}" loading="lazy" width="${im.w}" height="${im.h}"><figcaption>${esc(text || im.alt)}</figcaption></figure>`;
    }
    return `<img src="${esc(href)}" alt="${esc(text)}">`;
  };
  renderer.link = (href, title, text) => {
    if (href?.startsWith('item:')) return `<a href="#/item/${esc(href.slice(5))}" class="xref">${text}</a>`;
    if (href?.startsWith('asset:')) return `<a href="#/assets/${esc(href.slice(6))}" class="xref">${text}</a>`;
    const ext = /^https?:/.test(href || '');
    return `<a href="${esc(href)}"${ext ? ' target="_blank" rel="noopener"' : ''}>${text}</a>`;
  };
  renderer.table = (header, body) => `<div class="table-wrap"><table><thead>${header}</thead><tbody>${body}</tbody></table></div>`;
  const html = marked.parse(md, { renderer, mangle: false, headerIds: false });
  return { html, verifies };
}

const errors = [];
const warn = [];
const files = [...walk(path.join(ROOT, 'content'))].filter((f) => f.endsWith('.md'));
const items = [];
for (const f of files) {
  const p = parse(f);
  const rel = path.relative(ROOT, f);
  if (p.error) { errors.push(`${rel}: ${p.error}`); continue; }
  const fm = p.fm;
  const it = {
    id: String(fm.id || path.basename(f, '.md')), file: rel, type: fm.type, title: fm.title || path.basename(f),
    slug: fm.slug || '', audience: arr(fm.audience).map(String), stage: arr(fm.stage).map(String), cell: fm.cell || '',
    asset: fm.asset ? String(fm.asset) : '', summary: fm.summary || '', primary_keyword: fm.primary_keyword || '',
    secondary_keywords: arr(fm.secondary_keywords), ai_prompt: fm.ai_prompt || '', meta_description: fm.meta_description || '',
    cta: fm.cta || null, hero: fm.hero || '', owner_review: fm.owner_review || '', status: fm.status || 'draft',
    gated: !!fm.gated, related: arr(fm.related).map(String), updated: fm.updated ? (fm.updated instanceof Date ? fm.updated.toISOString().slice(0, 10) : String(fm.updated).slice(0, 10)) : '',
    needs_approval: fm.needs_approval || '', live_url: fm.live_url || '', images: arr(fm.images).map(String), dek: fm.dek || '', action: fm.action || '', merges: arr(fm.merges).map(String),
    technical_reviewer: fm.technical_reviewer || '', last_reviewed: fm.last_reviewed ? (fm.last_reviewed instanceof Date ? fm.last_reviewed.toISOString().slice(0, 10) : String(fm.last_reviewed)) : '', sources: arr(fm.sources).map((s) => ({ ...s, id: String(s.id) })),
  };
  const srcIndex = {};
  it.sources.forEach((s, i) => { srcIndex[s.id] = i + 1; });
  const r = render(p.body, it, srcIndex);
  it.html = r.html;
  it.verifies = r.verifies;
  it.words = words(p.body);
  it.faq = faqOf(p.body);
  it.markdown = fs.readFileSync(f, 'utf8');
  it.cited = [...new Set([...p.body.matchAll(/\[\^(\w+)\]/g)].map((m) => m[1]))];
  // validation
  const where = `${rel}`;
  if (!TYPES[it.type]) errors.push(`${where}: unknown type "${it.type}"`);
  if (!it.audience.length || it.audience.some((a) => !AUD.includes(a))) errors.push(`${where}: audience must be from ${AUD}`);
  if (!it.stage.length || it.stage.some((s) => !STG.includes(s))) errors.push(`${where}: stage must be from ${STG}`);
  if (it.hero && !imgIds.has(it.hero)) errors.push(`${where}: hero image "${it.hero}" not in library`);
  if (it.asset && !assetIds.has(it.asset)) warn.push(`${where}: asset ${it.asset} not in backlog`);
  if (it.cta && it.cta.asset && !assetIds.has(String(it.cta.asset))) warn.push(`${where}: CTA asset ${it.cta.asset} not in backlog`);
  for (const c of it.cited) if (!srcIndex[c]) errors.push(`${where}: cites [^${c}] with no source entry`);
  if (it.type === 'article') {
    if (!it.cta) errors.push(`${where}: article needs a cta`);
    if (!it.faq.length) errors.push(`${where}: article needs an FAQ`);
    if (!/<table/.test(it.html)) errors.push(`${where}: article needs a table`);
    if (it.meta_description.length > 160) warn.push(`${where}: meta_description ${it.meta_description.length} chars`);
  }
  if (it.type === 'blog') {  // a blog post replaces a live bromic.com URL (content/reports/blog-audit.md, data/page-ownership.json)
    if (!it.cta) errors.push(`${where}: blog post needs a cta`);
    if (!/^https:\/\/www\.bromic\.com\/blog\//.test(it.live_url)) errors.push(`${where}: blog post needs live_url (the bromic.com/blog/ URL it replaces)`);
    if (!it.technical_reviewer || !it.last_reviewed) warn.push(`${where}: blog post needs technical_reviewer and last_reviewed (AEO template)`);
    const first = (p.body.split(/\n\s*\n/).map((x) => x.trim()).find((x) => x && !/^(#|!\[|>|\||<)/.test(x)) || '');
    const n = first.split(/\s+/).filter(Boolean).length;
    if (n < 35 || n > 90) warn.push(`${where}: opening answer is ${n} words (AEO template: 40–80)`);
    if (it.meta_description.length > 160) warn.push(`${where}: meta_description ${it.meta_description.length} chars`);
  }
  if (/500 series/i.test(p.body)) errors.push(`${where}: legacy "500 series" naming`);
  if (/!(?!\[)/.test(p.body.replace(/!\[/g, '').replace(/`[^`]*`/g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/!=/g, '')) && /[a-z]!\s/.test(p.body)) warn.push(`${where}: exclamation mark`);
  if (/(Tungsten (Coastal|Select))(?![^.\n]{0,80}coming soon)/i.test(p.body) && !/coming soon/i.test(p.body)) errors.push(`${where}: Tungsten Coastal/Select without "coming soon"`);
  items.push(it);
}
// related link check
const ids = new Set(items.map((i) => i.id));
for (const it of items) for (const r of it.related) if (!ids.has(r)) warn.push(`${it.file}: related "${r}" not found`);

// tools
const tools = fs.existsSync(path.join(ROOT, 'tools')) ? fs.readdirSync(path.join(ROOT, 'tools'), { withFileTypes: true })
  .filter((d) => d.isDirectory() && fs.existsSync(path.join(ROOT, 'tools', d.name, 'index.html'))).map((d) => d.name) : [];

// open questions
const oqDir = path.join(ROOT, 'reviews', 'open-questions');
const openQuestions = fs.existsSync(oqDir) ? fs.readdirSync(oqDir).filter((f) => f.endsWith('.md')).map((f) => ({
  name: f.replace(/\.md$/, ''), html: marked.parse(fs.readFileSync(path.join(oqDir, f), 'utf8')),
})) : [];
const extraReviews = ['reviews/open-questions.md', 'reviews/review-log.md'].filter((f) => fs.existsSync(path.join(ROOT, f)))
  .map((f) => ({ name: path.basename(f, '.md'), html: marked.parse(fs.readFileSync(path.join(ROOT, f), 'utf8')) }));

// bromic.com inventory (data/site-inventory.json, built by scripts/merge_site_inventory.py)
const sitePath = path.join(ROOT, 'data', 'site-inventory.json');
const site = fs.existsSync(sitePath) ? readJSON('data/site-inventory.json').filter((r) => !r.error).map((r) => ({
  url: r.url.startsWith('au-unconfirmed:') ? '' : r.url, kind: r.kind, title: r.title, summary: r.summary || '', q: r.question_answered || '', audience: r.audience || [], stage: r.stage || [],
  products: r.products || [], controls: !!r.controls_mentioned, issues: r.issues || [], stats: r.stats || [], facts: (r.product_facts || []).length,
  cta: r.cta || [], gated: !!r.gated, downloads: r.downloads || [], images: (r.images || []).length,
  people: (r.people_quoted || []).map((x) => [x.name, x.role_org].filter(Boolean).join(', ')),
  ...(r.kind === 'case-study' || r.kind === 'press' ? { customer: r.customer, location: r.location, segment: r.segment, market: r.market, read: r.read || 'read', also: r.also_at || [] } : {}),
  ...(r.kind === 'gallery' ? { segment: r.segment, location: r.location, mount: r.mount } : {}),
})) : [];

// case studies: records, taxonomy, slide collections, whitespace targets (scripts/build_case_studies.py)
const csFile = (f) => (fs.existsSync(path.join(ROOT, 'data', f)) ? readJSON('data/' + f) : null);
const cs = { records: csFile('case-studies.json') || [], tax: csFile('case-study-taxonomy.json'), collections: (csFile('case-study-collections.json') || {}).collections || [], targets: (csFile('case-study-targets.json') || {}).targets || [] };
for (const r of cs.records) for (const id of r.images || []) if (!imgIds.has(id)) errors.push(`data/case-studies.json ${r.id}: image "${id}" not in library`);

// Blog plan: every live bromic.com/blog post (content/reports/blog-audit.md) → its call and what replaces it.
const blogPlan = [];
{
  const auditFile = path.join(ROOT, 'content', 'reports', 'blog-audit.md');
  const audit = fs.existsSync(auditFile) ? fs.readFileSync(auditFile, 'utf8') : '';
  const norm = (u) => (u || '').replace(/\/?$/, '/');
  for (const m of audit.matchAll(/^\| \[(.+?)\]\((https:\/\/www\.bromic\.com\/blog\/[^)]+)\) \| ([A-Z]{3}-[A-Z]{2}) \| ([^|]+?) \| ([^|]*?) \|/gm)) {
    const [, title, url, cell, call, why] = m; const u = norm(url);
    const post = items.find((it) => it.type === 'blog' && norm(it.live_url) === u);
    const into = items.find((it) => it.type === 'blog' && it.merges.map(norm).includes(u));
    const viaOwn = (fs.existsSync(path.join(ROOT, 'data', 'page-ownership.json')) ? readJSON('data/page-ownership.json').items : []).find((o) => norm(o.target_url) === u && items.some((it) => it.id === o.id && it.type !== 'blog'));
    blogPlan.push({ title, url: u, cell, call: call.trim(), why: why.trim(), post: post?.id || '', into: into?.id || '', article: viaOwn?.id || '' });
  }
}

// SEO/AEO: how each draft is published (data/page-ownership.json) — upgrade a live URL before creating a new one
const own = fs.existsSync(path.join(ROOT, 'data', 'page-ownership.json')) ? readJSON('data/page-ownership.json') : { items: [] };
for (const it of items) { const o = own.items.find((x) => x.id === it.id); if (o) it.publish = o; }
for (const o of own.items) if (!items.some((it) => it.id === o.id)) warn.push(`data/page-ownership.json: "${o.id}" is not a content item`);

// image usage
const usage = {};
for (const it of items) {
  const used = new Set([it.hero, ...[...it.markdown.matchAll(/img:([\w-]+)/g)].map((m) => m[1])].filter(Boolean));
  for (const u of used) (usage[u] ||= []).push(it.id);
}

let commit = ''; try { commit = (await import('node:child_process')).execSync('git rev-parse --short HEAD', { cwd: ROOT }).toString().trim(); } catch {}
const HUB = { built: new Date().toISOString(), commit, matrix, assets, facts, images, usage, tools, site, cs, blogPlan, openQuestions: [...extraReviews, ...openQuestions], types: TYPES, items };

console.log(`items ${items.length} · tools ${tools.length} · images ${images.length} · site pages ${site.length} · errors ${errors.length} · warnings ${warn.length}`);
warn.forEach((w) => console.log('  warn  ' + w));
errors.forEach((e) => console.log('  ERROR ' + e));
if (CHECK) process.exit(errors.length ? 1 : 0);

// write dist
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
for (const f of ['index.html', 'styles.css', 'app.js']) fs.copyFileSync(path.join(APP, 'src', f), path.join(DIST, f));
fs.writeFileSync(path.join(DIST, 'data.js'), 'window.HUB=' + JSON.stringify(HUB) + ';');
fs.cpSync(path.join(ROOT, 'images', 'library'), path.join(DIST, 'images', 'library'), { recursive: true });
if (fs.existsSync(path.join(ROOT, 'tools', '_shared'))) fs.cpSync(path.join(ROOT, 'tools', '_shared'), path.join(DIST, 'tools', '_shared'), { recursive: true });
for (const t of tools) fs.cpSync(path.join(ROOT, 'tools', t), path.join(DIST, 'tools', t), { recursive: true, filter: (s) => !/test\.mjs$|README\.md$/.test(s) });
console.log('dist written → app/dist/index.html');

if (SINGLE) {
  const out = path.join(APP, 'dist-single');
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  let html = fs.readFileSync(path.join(APP, 'src', 'index.html'), 'utf8');
  html = html.replace('<link rel="stylesheet" href="styles.css">', `<style>${fs.readFileSync(path.join(APP, 'src', 'styles.css'), 'utf8')}</style>`)
    .replace('<script src="data.js"></script>', `<script>window.HUB=${JSON.stringify(HUB).replace(/<\/script/gi, '<\\/script')};</script>`)
    .replace('<script src="app.js"></script>', `<script>${fs.readFileSync(path.join(APP, 'src', 'app.js'), 'utf8')}</script>`);
  fs.writeFileSync(path.join(out, 'index.html'), html);
  fs.cpSync(path.join(DIST, 'images'), path.join(out, 'images'), { recursive: true });
  fs.cpSync(path.join(DIST, 'tools'), path.join(out, 'tools'), { recursive: true });
  console.log('single-file preview → app/dist-single/');
}
