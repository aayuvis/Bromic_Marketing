// Builds the Bromic Content Hub: reads ../content, ../data, ../images, ../tools and writes app/dist.
// dist/data.js sets window.HUB, so the hub opens from file:// with no server.
//   node scripts/build.mjs           build dist/
//   node scripts/build.mjs --check   parse + validate only, exit 1 on errors
//   node scripts/build.mjs --single  also write dist-single/ (one HTML + images) for previews
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { marked } from 'marked';
import { makeEnhancer } from './visuals.mjs';

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

let ENHANCE = null;
function render(body, item, srcIndex) {
  let md = body;
  const verifies = [];
  md = md.replace(/\[\[VERIFY:\s*([^\]]+?)\]\]/g, (_, t) => { verifies.push(t.trim()); return `<mark class="verify" title="Needs verification">VERIFY: ${esc(t.trim())}</mark>`; });
  md = md.replace(/\[\[DIAGRAM:\s*((?:\[\^\w+\]|[^\]])+?)\]\]/g, (_, t) => `<span class="diagram">DIAGRAM: ${esc(t.trim())}</span>`);
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
      return `<figure data-img="${esc(id)}"><img src="${im.file}" alt="${esc(text || im.alt)}" loading="lazy" width="${im.w}" height="${im.h}"><figcaption>${esc(text || im.alt)}</figcaption></figure>`;
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
  const html = (ENHANCE ||= makeEnhancer(images))(marked.parse(md, { renderer, mangle: false, headerIds: false }));
  return { html, verifies };
}

const errors = [];
const warn = [];
const I18N = path.join(ROOT, 'content', 'i18n');   // translations: loaded separately, never as items of their own
const files = [...walk(path.join(ROOT, 'content'))].filter((f) => f.endsWith('.md') && !f.startsWith(I18N + path.sep));
const items = [];
for (const f of files) {
  const p = parse(f);
  const raw = fs.readFileSync(f, 'utf8');
  const rel = path.relative(ROOT, f);
  if (p.error) { errors.push(`${rel}: ${p.error}`); continue; }
  const fm = p.fm;
  const it = {
    id: String(fm.id || path.basename(f, '.md')), file: rel, type: fm.type, title: fm.title || path.basename(f),
    slug: fm.slug || '', audience: arr(fm.audience).map(String), stage: arr(fm.stage).map(String), cell: fm.cell || '',
    asset: fm.asset ? String(fm.asset) : '', summary: fm.summary || '', primary_keyword: fm.primary_keyword || '',
    secondary_keywords: arr(fm.secondary_keywords), ai_prompt: fm.ai_prompt || '', meta_description: fm.meta_description || '',
    cta: fm.cta || null, hero: fm.hero || '', hero_caption: fm.hero_caption || '', source_kind: fm.source_kind || '', origin: fm.origin || '', evidence: fm.evidence || '', completeness: fm.completeness || '', owner_review: fm.owner_review || '', status: fm.status || 'draft',
    gated: !!fm.gated, related: arr(fm.related).map(String), updated: fm.updated ? (fm.updated instanceof Date ? fm.updated.toISOString().slice(0, 10) : String(fm.updated).slice(0, 10)) : '',
    needs_approval: fm.needs_approval || '', live_url: fm.live_url || '', images: arr(fm.images).map(String), dek: fm.dek || '', action: fm.action || '', merges: arr(fm.merges).map(String),
    technical_reviewer: fm.technical_reviewer || '', last_reviewed: fm.last_reviewed ? (fm.last_reviewed instanceof Date ? fm.last_reviewed.toISOString().slice(0, 10) : String(fm.last_reviewed)) : '', sources: arr(fm.sources).map((s) => ({ ...s, id: String(s.id) })),
  };
  const srcIndex = {};
  it.sources.forEach((s, i) => { srcIndex[s.id] = i + 1; });
  // Render block by block so the Hub's editor can map each block back to its lines in the file: the HTML carries
  // <!--b:N--> before each block, and it.blocks holds [start, end] offsets into it.markdown.
  const toks = marked.lexer(p.body);
  const bodyAt = raw.length - p.body.length;
  if (toks.map((t) => t.raw).join('') === p.body) {
    let at = bodyAt, html = '', ver = [];
    it.blocks = [];
    toks.forEach((t, n) => {
      it.blocks.push([at, at + t.raw.length]); at += t.raw.length;
      if (t.type === 'space') return;
      const r = render(t.raw, it, srcIndex);
      html += `<!--b:${n}-->` + r.html; ver = ver.concat(r.verifies);
    });
    it.html = html; it.verifies = ver;
  } else {
    const r = render(p.body, it, srcIndex);
    it.html = r.html; it.verifies = r.verifies; it.blocks = null;
  }
  it.words = words(p.body);
  it.faq = faqOf(p.body);
  it.markdown = raw;
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
    if (!/<table|class="v-(steps|waves|vs|prods|bars)"/.test(it.html)) errors.push(`${where}: article needs a table`);
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
  if (/(Tungsten (Coastal|Select)|Select and Coastal|Coastal and Select)[^.\n]{0,60}coming soon|coming soon[^.\n]{0,40}(Tungsten )?(Coastal|Select)/i.test(p.body)) errors.push(`${where}: Tungsten Select/Coastal called "coming soon" (launched October 2026)`);
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
// ---------- translations (content/i18n/<lang>/, templates/regionalisation.md) ----------
const regions = readJSON('data/regions.json');
const tr = {};   // lang → { id → translated fields }
const byId = Object.fromEntries(items.map((i) => [i.id, i]));
for (const lang of fs.existsSync(I18N) ? fs.readdirSync(I18N) : []) {
  for (const f of [...walk(path.join(I18N, lang))].filter((x) => x.endsWith('.md'))) {
    const p = parse(f); const rel = path.relative(ROOT, f);
    if (p.error) { errors.push(`${rel}: ${p.error}`); continue; }
    const fm = p.fm, id = String(fm.translation_of || fm.id), en = byId[id];
    if (!en) { warn.push(`${rel}: translation of unknown item ${id}`); continue; }
    const raw = fs.readFileSync(f, 'utf8');
    const srcIndex = {}; en.sources.forEach((s, i) => { srcIndex[s.id] = i + 1; });
    const t = { id, lang, file: rel, title: fm.title || en.title, summary: fm.summary || '', dek: fm.dek || '', meta_description: fm.meta_description || '',
      cta: fm.cta || en.cta, status: fm.translation_status || 'machine-draft', native_reviewer: fm.native_reviewer || '', markdown: raw };
    const toks = marked.lexer(p.body), bodyAt = raw.length - p.body.length;
    if (toks.map((k) => k.raw).join('') === p.body) {
      let at = bodyAt, html = '', ver = []; t.blocks = [];
      toks.forEach((k, n) => { t.blocks.push([at, at + k.raw.length]); at += k.raw.length; if (k.type === 'space') return; const r = render(k.raw, en, srcIndex); html += `<!--b:${n}-->` + r.html; ver = ver.concat(r.verifies); });
      t.html = html; t.verifies = ver;
    } else { const r = render(p.body, en, srcIndex); t.html = r.html; t.verifies = r.verifies; t.blocks = null; }
    t.words = words(p.body); t.faq = faqOf(p.body);
    (tr[lang] ||= {})[id] = t;
    (en.langs ||= []).push(lang);
  }
}

const usage = {};
for (const it of items) {
  const used = new Set([it.hero, ...[...it.markdown.matchAll(/img:([\w-]+)/g)].map((m) => m[1])].filter(Boolean));
  for (const u of used) (usage[u] ||= []).push(it.id);
}

let commit = ''; try { commit = (await import('node:child_process')).execSync('git rev-parse --short HEAD', { cwd: ROOT }).toString().trim(); } catch {}
const repo = { owner: 'aayuvis', name: 'Bromic_Marketing', branch: process.env.HUB_BRANCH || 'claude/dreamy-euler-xxi5g7' };
const roles = JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'team-roles.json'), 'utf8'));
const PMDIR = path.join(ROOT, 'data', 'product-marketing');
const pm = fs.existsSync(PMDIR) ? fs.readdirSync(PMDIR).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(fs.readFileSync(path.join(PMDIR, f), 'utf8'))) : [];
const portfolio = fs.existsSync(path.join(ROOT, 'data', 'portfolio.json')) ? JSON.parse(fs.readFileSync(path.join(ROOT, 'data', 'portfolio.json'), 'utf8')).items : [];
const CMDIR = path.join(ROOT, 'data', 'campaigns');
const campaigns = fs.existsSync(CMDIR) ? fs.readdirSync(CMDIR).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(fs.readFileSync(path.join(CMDIR, f), 'utf8'))) : [];
const RTF = path.join(ROOT, 'data', 'retail', 'retail.json');
const retail = fs.existsSync(RTF) ? JSON.parse(fs.readFileSync(RTF, 'utf8')) : null;
const RKF = path.join(ROOT, 'data', 'retail', 'kit.json');   // the print-ready retail kit (PDFs + covers), published under dist/retail-kit/
const retailKit = fs.existsSync(RKF) ? JSON.parse(fs.readFileSync(RKF, 'utf8')).items.filter((k) => fs.existsSync(path.join(ROOT, k.pdf))).map((k) => ({ ...k, href: 'retail-kit/' + path.basename(k.pdf), thumbHref: 'retail-kit/' + path.basename(k.thumb), alt: k.alt && fs.existsSync(path.join(ROOT, k.alt.pdf)) ? { label: k.alt.label, href: 'retail-kit/' + path.basename(k.alt.pdf), pdf: k.alt.pdf } : null, mb: +(fs.statSync(path.join(ROOT, k.pdf)).size / 1048576).toFixed(1) })) : [];
// Trends 2027: the visual reports (reports/trends-2027/<id>/, built by reports/trends-2027/engine) listed on #/trends.
const TRF = path.join(ROOT, 'data', 'trends-2027.json');
const trends = fs.existsSync(TRF) ? JSON.parse(fs.readFileSync(TRF, 'utf8')) : null;
// Visual guides (reports/planning-guide/<edition>/): replace an item's text PDF with the designed guide (data/visual-guides.json).
const VGF = path.join(ROOT, 'data', 'visual-guides.json');
const vguides = fs.existsSync(VGF) ? JSON.parse(fs.readFileSync(VGF, 'utf8')).guides : [];
// Designed editions (owner, 22 Nov 2026: modernise every asset with the agreed themes): reports/designed/<ID>/meta.json and
// reports/designed/case-studies/index.json. Each PDF (and its cover thumb, when one exists) is published under dist/designed/.
const designed = { items: {}, cases: {} };
{ const D = path.join(ROOT, 'reports', 'designed');
  const add = (m, kind) => { if (!m || !m.pdf || !fs.existsSync(path.join(ROOT, m.pdf))) return; const id = m.item_id || m.id; if (!id) return;
    const e = { title: m.title || '', theme: m.theme || '', pages: m.pages || null, pdf: m.pdf, thumb: m.thumb && fs.existsSync(path.join(ROOT, m.thumb)) ? m.thumb : null, kind: m.kind || kind,
      href: 'designed/' + id + '/' + path.basename(m.pdf), mb: +(fs.statSync(path.join(ROOT, m.pdf)).size / 1048576).toFixed(1) };
    if (e.thumb) e.thumbHref = 'designed/' + id + '/' + path.basename(e.thumb);
    (kind === 'case' && !items.some((it) => it.id === id) ? designed.cases : designed.items)[id] = e; };
  if (fs.existsSync(D)) for (const d of fs.readdirSync(D)) { const mf = path.join(D, d, 'meta.json'); if (fs.existsSync(mf)) add(JSON.parse(fs.readFileSync(mf, 'utf8')), 'doc'); }
  const cf = path.join(D, 'case-studies', 'index.json');
  if (fs.existsSync(cf)) { const j = JSON.parse(fs.readFileSync(cf, 'utf8')); for (const m of (Array.isArray(j) ? j : j.items || j.studies || [])) add(m, 'case'); } }
const RVF = path.join(ROOT, 'data', 'image-review.json');
const review = fs.existsSync(RVF) ? JSON.parse(fs.readFileSync(RVF, 'utf8')).items : [];
const HUB = { built: new Date().toISOString(), commit, repo, regions, roles, langsAvailable: Object.fromEntries(Object.entries(tr).map(([l, m]) => [l, Object.keys(m).length])), matrix, assets, facts, images, usage, tools, site, cs, blogPlan, pm, campaigns, portfolio, retail, retailKit, trends, vguides, designed, review, openQuestions: [...extraReviews, ...openQuestions], types: TYPES, items };

console.log(`items ${items.length} · tools ${tools.length} · images ${images.length} · site pages ${site.length} · errors ${errors.length} · warnings ${warn.length}`);
warn.forEach((w) => console.log('  warn  ' + w));
errors.forEach((e) => console.log('  ERROR ' + e));
if (CHECK) process.exit(errors.length ? 1 : 0);

// write dist
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });
for (const f of ['index.html', 'styles.css', 'visuals.css', 'app.js', 'editor.js']) fs.copyFileSync(path.join(APP, 'src', f), path.join(DIST, f));
fs.cpSync(path.join(APP, 'src', 'fonts'), path.join(DIST, 'fonts'), { recursive: true });
if (fs.existsSync(path.join(ROOT, 'decks', 'video'))) { fs.mkdirSync(path.join(DIST, 'decks', 'video'), { recursive: true }); for (const f of fs.readdirSync(path.join(ROOT, 'decks', 'video')).filter((x) => /-3D(-Reels|-Loop)?\.mp4$|-3D-poster\.jpg$/.test(x))) fs.copyFileSync(path.join(ROOT, 'decks', 'video', f), path.join(DIST, 'decks', 'video', f)); }  // the recess-kit film, playable on the Hub
if (fs.existsSync(path.join(ROOT, 'decks'))) { fs.mkdirSync(path.join(DIST, 'decks'), { recursive: true }); for (const f of fs.readdirSync(path.join(ROOT, 'decks')).filter((x) => /\.(pptx|jpg)$/.test(x))) fs.copyFileSync(path.join(ROOT, 'decks', f), path.join(DIST, 'decks', f));
  if (fs.existsSync(path.join(ROOT, 'decks', 'carousels'))) { fs.mkdirSync(path.join(DIST, 'decks', 'carousels'), { recursive: true }); for (const f of fs.readdirSync(path.join(ROOT, 'decks', 'carousels'))) fs.copyFileSync(path.join(ROOT, 'decks', 'carousels', f), path.join(DIST, 'decks', 'carousels', f)); } }
fs.mkdirSync(path.join(DIST, 'vendor'), { recursive: true });
fs.copyFileSync(path.join(APP, 'node_modules', 'marked', 'marked.min.js'), path.join(DIST, 'vendor', 'marked.min.js'));  // the editor's preview
// cache-busting: a new deploy always loads its own script, data and styles (GitHub Pages lets browsers cache for 10 minutes)
{ const v = (commit || 'dev') + '-' + Date.parse(HUB.built).toString(36);
  const ix = path.join(DIST, 'index.html');
  fs.writeFileSync(ix, fs.readFileSync(ix, 'utf8').replace(/(src|href)="(app\.js|data\.js|styles\.css|editor\.js)"/g, `$1="$2?v=${v}"`)); }
fs.writeFileSync(path.join(DIST, 'data.js'), 'window.HUB=' + JSON.stringify(HUB) + ';');
for (const [lang, m] of Object.entries(tr)) fs.writeFileSync(path.join(DIST, `data-${lang}.js`), `(window.HUB_TR=window.HUB_TR||{})[${JSON.stringify(lang)}]=` + JSON.stringify(m) + ';');
fs.cpSync(path.join(ROOT, 'images', 'library'), path.join(DIST, 'images', 'library'), { recursive: true });
for (const e of [...Object.entries(designed.items), ...Object.entries(designed.cases)]) { const o = path.join(DIST, 'designed', e[0]); fs.mkdirSync(o, { recursive: true }); fs.copyFileSync(path.join(ROOT, e[1].pdf), path.join(o, path.basename(e[1].pdf))); if (e[1].thumb) fs.copyFileSync(path.join(ROOT, e[1].thumb), path.join(o, path.basename(e[1].thumb))); }
for (const g of vguides) {  // the designed guide: both formats, images, cover and PDFs, with paths rewritten for dist
  const src = path.join(ROOT, 'reports', g.dir), out = path.join(DIST, g.dir);
  if (!fs.existsSync(path.join(src, 'index.html'))) continue;
  fs.mkdirSync(out, { recursive: true });
  for (const f of ['index.html', 'letter.html']) if (fs.existsSync(path.join(src, f)))
    fs.writeFileSync(path.join(out, f), fs.readFileSync(path.join(src, f), 'utf8').replaceAll('../../../app/src/fonts/', '../../fonts/').replaceAll('../../../images/portfolio/', '../../images/portfolio/'));
  fs.cpSync(path.join(src, 'img'), path.join(out, 'img'), { recursive: true, filter: (s) => !/_tmp/.test(s) });
  for (const f of fs.readdirSync(src).filter((x) => /^cover.*\.webp$|\.pdf$/.test(x))) fs.copyFileSync(path.join(src, f), path.join(out, f));
}
if (trends) for (const r of trends.reports) {  // each report: landscape and Letter pages, their images, covers and (when rendered) PDFs
  const src = path.join(ROOT, 'reports', 'trends-2027', r.id), out = path.join(DIST, 'trends-2027', r.id);
  if (!fs.existsSync(path.join(src, 'index.html'))) continue;
  fs.mkdirSync(out, { recursive: true });
  for (const f of ['index.html', 'letter.html']) if (fs.existsSync(path.join(src, f)))
    fs.writeFileSync(path.join(out, f), fs.readFileSync(path.join(src, f), 'utf8').replaceAll('../../../app/src/fonts/', '../../fonts/').replaceAll('../../../images/portfolio/', '../../images/portfolio/'));
  fs.cpSync(path.join(src, 'img'), path.join(out, 'img'), { recursive: true, filter: (s) => !/_tmp/.test(s) });
  for (const f of fs.readdirSync(src).filter((x) => /^cover.*\.webp$|\.pdf$/.test(x))) fs.copyFileSync(path.join(src, f), path.join(out, f));
}
if (retailKit.length) { const o = path.join(DIST, 'retail-kit'); fs.mkdirSync(o, { recursive: true }); for (const k of retailKit) for (const f of [k.pdf, k.thumb, k.alt && k.alt.pdf].filter(Boolean)) fs.copyFileSync(path.join(ROOT, f), path.join(o, path.basename(f))); }
if (fs.existsSync(path.join(ROOT, 'images', 'portfolio'))) fs.cpSync(path.join(ROOT, 'images', 'portfolio'), path.join(DIST, 'images', 'portfolio'), { recursive: true });
if (fs.existsSync(path.join(ROOT, 'images', 'campaigns'))) fs.cpSync(path.join(ROOT, 'images', 'campaigns'), path.join(DIST, 'images', 'campaigns'), { recursive: true });
if (fs.existsSync(path.join(ROOT, 'images', 'review'))) {
  fs.cpSync(path.join(ROOT, 'images', 'review'), path.join(DIST, 'images', 'review'), { recursive: true });
  // the approved set as one download (rebuilt at every publish, so it follows the approvals file)
  const ok = review.filter((r) => r.status === 'approved'), zp = path.join(DIST, 'review', 'approved.zip');
  fs.mkdirSync(path.dirname(zp), { recursive: true });
  if (ok.length) { const { execFileSync } = await import('node:child_process');
    execFileSync('python3', ['-c', 'import sys,zipfile,os\nz=zipfile.ZipFile(sys.argv[1],"w",zipfile.ZIP_STORED)\nfor f in sys.argv[2:]: z.write(f,os.path.basename(f))\nz.close()', zp, ...ok.map((r) => path.join(ROOT, r.file))]); }
}
if (fs.existsSync(path.join(ROOT, 'tools', '_shared'))) fs.cpSync(path.join(ROOT, 'tools', '_shared'), path.join(DIST, 'tools', '_shared'), { recursive: true });
for (const t of tools) fs.cpSync(path.join(ROOT, 'tools', t), path.join(DIST, 'tools', t), { recursive: true, filter: (s) => !/test\.mjs$|README\.md$|\.py$/.test(s) });
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
