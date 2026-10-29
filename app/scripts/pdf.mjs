#!/usr/bin/env node
// Renders a branded PDF of every gated asset (reports, guides, kits, sales kits) into app/dist/pdf/<id>.pdf, from the same
// built content the Hub shows. Run after `node scripts/build.mjs` (deploy.sh does). Needs Chromium (Playwright).
//   node scripts/pdf.mjs            all gated documents
//   node scripts/pdf.mjs A01-v2      one item
// Drafts say so on the cover and in every footer; [[VERIFY]] flags stay visible until a reviewer clears them.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const APP = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DIST = path.join(APP, 'dist');
const OUT = path.join(DIST, 'pdf');
const HUB = JSON.parse(fs.readFileSync(path.join(DIST, 'data.js'), 'utf8').replace(/^window\.HUB=/, '').replace(/;\s*$/, ''));
const only = process.argv.slice(2);
const DOC_TYPES = ['report', 'gated-guide', 'spec-kit', 'sales-kit', 'stats-page'];
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const IMG = Object.fromEntries(HUB.images.map((i) => [i.id, i]));
const AUD = HUB.matrix.audiences; const ASSET = Object.fromEntries(HUB.assets.map((a) => [a.id, a]));

export const pdfItems = (items) => items.filter((it) => it.gated === true && DOC_TYPES.includes(it.type));

const css = `
@page { size: Letter; margin: 0.8in 0.75in 0.85in; }
@page :first { margin: 0; }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { margin: 0; font: 10.5pt/1.55 "Helvetica Neue", Helvetica, Arial, sans-serif; color: #231F20; }
h1, h2, h3, h4 { font-family: Georgia, "Times New Roman", serif; font-weight: 400; line-height: 1.2; color: #231F20; break-after: avoid; }
h2 { font-size: 17pt; margin: 22pt 0 6pt; padding-top: 8pt; border-top: 0.75pt solid #DDD8D0; }
h3 { font-size: 12.5pt; margin: 14pt 0 4pt; }
p, ul, ol { margin: 0 0 8pt; orphans: 3; widows: 3; }
li { margin: 2pt 0; }
a { color: #231F20; text-decoration-color: #EF4123; }
strong { font-weight: 600; }
blockquote { margin: 12pt 0; padding: 2pt 0 2pt 12pt; border-left: 2pt solid #EF4123; font: italic 12pt/1.5 Georgia, serif; color: #4A4546; }
figure { margin: 12pt 0; break-inside: avoid; }
figure img { width: 100%; max-height: 3.6in; object-fit: cover; display: block; }
figcaption { font-size: 8pt; color: #71777D; margin-top: 3pt; }
table { border-collapse: collapse; width: 100%; font-size: 8.8pt; line-height: 1.4; margin: 8pt 0 12pt; break-inside: auto; }
tr { break-inside: avoid; }
th { text-align: left; font: 600 7.5pt/1.3 "Helvetica Neue", Helvetica, Arial, sans-serif; letter-spacing: .1em; text-transform: uppercase; color: #575C61; background: #F4F1EC; }
th, td { padding: 5pt 6pt; border-bottom: 0.5pt solid #DDD8D0; vertical-align: top; text-align: left; }
code { font-size: 9pt; background: #F4F1EC; padding: 0 3pt; }
hr { border: 0; height: 0.75pt; background: #DDD8D0; margin: 16pt 0; }
sup.cite a { color: #C7321A; text-decoration: none; font-weight: 600; font-size: 7pt; }
mark.verify { background: #F6ECD9; color: #8A5A12; font-size: .85em; font-weight: 600; padding: 0 3pt; }
.diagram { border: 0.75pt dashed #CBC5BB; padding: 8pt 10pt; margin: 10pt 0; font-size: 9pt; color: #71777D; }
.cover { height: 11in; position: relative; display: flex; flex-direction: column; background: #F4F1EC; page-break-after: always; }
.cover .top { padding: 0.75in 0.75in 0; display: flex; justify-content: space-between; align-items: flex-start; }
.wordmark { font: 400 20pt/1 Georgia, serif; letter-spacing: .32em; display: inline-flex; flex-direction: column; align-items: center; }
.wordmark small { font: 600 6pt/1 "Helvetica Neue", Arial, sans-serif; letter-spacing: .45em; margin-top: 4pt; color: #71777D; }
.cover .label { font: 600 7.5pt/1.4 "Helvetica Neue", Arial, sans-serif; letter-spacing: .16em; text-transform: uppercase; color: #575C61; }
.cover .draft { border: 0.75pt solid #EF4123; color: #231F20; padding: 4pt 8pt; font: 600 7.5pt/1 "Helvetica Neue", Arial, sans-serif; letter-spacing: .14em; text-transform: uppercase; }
.cover .titles { padding: 0.55in 0.75in 0.35in; }
.cover .rule { width: 0.55in; height: 2pt; background: #EF4123; margin-bottom: 14pt; }
.cover h1 { font-size: 30pt; line-height: 1.12; margin: 8pt 0 12pt; max-width: 6.4in; text-wrap: balance; }
.cover .dek { font: italic 13pt/1.5 Georgia, serif; color: #4A4546; max-width: 6in; margin: 0; }
.cover .hero { flex: 1; min-height: 0; margin: 0 0.75in; overflow: hidden; background: #ECE7DF; }
.cover .hero img { width: 100%; height: 100%; object-fit: cover; display: block; }
.cover .meta { padding: 16pt 0.75in 0.6in; display: flex; gap: 28pt; font-size: 8.5pt; color: #575C61; }
.cover .meta b { display: block; font: 600 7pt/1.4 "Helvetica Neue", Arial, sans-serif; letter-spacing: .14em; text-transform: uppercase; color: #71777D; }
.sources { font-size: 8.5pt; line-height: 1.45; padding-left: 14pt; }
.sources li { margin: 0 0 5pt; break-inside: avoid; }
.sources .sup { color: #575C61; }
.cta { margin-top: 20pt; background: #231F20; color: #F4F1EC; padding: 14pt 16pt; break-inside: avoid; }
.cta .label { font: 600 7pt/1.4 "Helvetica Neue", Arial, sans-serif; letter-spacing: .16em; text-transform: uppercase; color: #CBC5BB; }
.cta p { font: 400 14pt/1.3 Georgia, serif; margin: 4pt 0 0; color: #F4F1EC; }
.notice { margin-top: 14pt; font-size: 8pt; color: #71777D; }
/* trends reports: one trend per page, as the layout notes ask */
.trends main > h2 { break-before: page; border-top: 0; padding-top: 0; font-size: 22pt; }
.trends main > h2:first-child { break-before: auto; }
`;

function docHTML(it, built) {
  const hero = it.hero && IMG[it.hero];
  const draft = it.status !== 'approved' && it.status !== 'published';
  const aud = it.audience.map((a) => AUD[a]?.name || a).join(' · ');
  const cta = it.cta && it.cta.label ? `<div class="cta"><span class="label">Next step${it.cta.asset && ASSET[it.cta.asset] ? ' · ' + esc(ASSET[it.cta.asset].name) : ''}</span><p>${esc(it.cta.label)}</p></div>` : '';
  const srcs = it.sources.length ? `<h2>Sources</h2><ol class="sources">${it.sources.map((s) => `<li id="src-${esc(it.id)}-${esc(s.id)}"><b>${esc(s.publisher || '')}</b>${s.title ? `, ${esc(s.title)}` : ''}${s.year ? ` (${esc(s.year)})` : ''}${/^https?:/.test(s.url || '') ? `. <a href="${esc(s.url)}">${esc(s.url)}</a>` : ''}${s.verified ? '' : ' <mark class="verify">to verify</mark>'}${s.supports ? `<div class="sup">${esc(s.supports)}</div>` : ''}</li>`).join('')}</ol>` : '';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(it.title)} | Bromic Heating</title><base href="file://${DIST}/"><style>${css}</style></head><body class="${/^A01/.test(it.id) ? 'trends' : ''}">
  <section class="cover">
    <div class="top"><span class="wordmark">BROMIC<small>HEATING</small></span>${draft ? '<span class="draft">Draft for review</span>' : ''}</div>
    <div class="titles"><div class="rule"></div><span class="label">${esc(aud)}</span><h1>${esc(it.title)}</h1>${it.summary ? `<p class="dek">${esc(it.summary)}</p>` : ''}</div>
    <div class="hero">${hero ? `<img src="${esc(hero.file)}" alt="${esc(hero.alt)}">` : ''}</div>
    <div class="meta"><span><b>Updated</b>${esc(it.updated || '')}</span><span><b>Reference</b>${esc(it.id)}</span><span><b>Status</b>${esc(it.status)}${it.verifies.length ? ` · ${it.verifies.length} items to verify` : ''}</span><span><b>Built</b>${esc(built)}</span></div>
  </section>
  <main>${it.html.replace(/src="images\/library\/([\w.-]+?)\.webp"/g, (m, id) => (id.endsWith('-t') ? m : `src="images/library/${id}-t.webp"`))}${cta}${srcs}
  <p class="notice">Confirm every installation with your local building authority and a licensed electrician or gas fitter. Wi-Fi and app features need compatible Affinity Smart-Heat controls, sold separately.${draft ? ' This is a review draft, not for distribution until approved.' : ''}</p></main>
  </body></html>`;
}

const items = pdfItems(HUB.items).filter((it) => !only.length || only.includes(it.id));
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
const built = `${new Date(HUB.built).toISOString().slice(0, 10)}${HUB.commit ? ' · ' + HUB.commit : ''}`;
for (const it of items) {
  const page = await browser.newPage();
  const tmp = path.join(DIST, `_pdf-${it.id}.html`);
  fs.writeFileSync(tmp, docHTML(it, built));
  await page.goto('file://' + tmp, { waitUntil: 'load' });
  const draft = it.status !== 'approved' && it.status !== 'published';
  await page.pdf({
    path: path.join(OUT, `${it.id}.pdf`), format: 'Letter', printBackground: true, displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: `<div style="width:100%;font:7pt Helvetica,Arial,sans-serif;color:#71777D;padding:0 0.75in;display:flex;justify-content:space-between">
      <span>Bromic Heating · ${esc(it.title).slice(0, 80)}${draft ? ' · Draft for review' : ''}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
    margin: { top: '0.8in', bottom: '0.85in', left: '0.75in', right: '0.75in' },
  });
  fs.unlinkSync(tmp); await page.close();
  console.log(`pdf/${it.id}.pdf  ${(fs.statSync(path.join(OUT, `${it.id}.pdf`)).size / 1e6).toFixed(1)} MB  ${it.title.slice(0, 60)}`);
}
await browser.close();
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(items.map((it) => it.id)));
