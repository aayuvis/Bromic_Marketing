#!/usr/bin/env node
// Renders a branded PDF of every gated asset (reports, guides, kits, sales kits) into app/dist/pdf/<id>.pdf, from the same
// built content the Hub shows. Run after `node scripts/build.mjs` (deploy.sh does). Needs Chromium (Playwright).
//   node scripts/pdf.mjs            all gated documents
//   node scripts/pdf.mjs A01-v2      one item
// The PDF is the reader-facing final version: internal sections (editor's notes, layout notes, change logs, open questions),
// [[VERIFY]] flags and draft labels are stripped (they stay visible in the Hub for reviewers), and every section gets a photo.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

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

const VCSS = `section.ch .ch-b, .trends section.s:not(.end) { columns: 1 !important; max-width: 6.9in; }
section.ch .ch-b > p, section.ch .ch-b > ul, section.ch .ch-b > ol { font-size: 10.6pt; line-height: 1.6; max-width: 6.4in; }
section.ch .ch-b > h3 { font-size: 14pt; margin-top: 14pt; }
.op { position: static !important; height: auto !important; margin: 0 0 14pt !important; background: none !important; overflow: visible !important; }
.op::after { display: none !important; }
.op-pic { height: 3.7in; margin: 0 -0.5in; overflow: hidden; background: #231F20; } .op-pic img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 18%; display: block; }
.op-t { position: static !important; color: #231F20 !important; display: grid; grid-template-columns: auto 1fr; gap: 0 14pt; align-items: baseline; padding: 14pt 0 10pt; border-bottom: 0.75pt solid #231F20; }
.op-n { font: 400 30pt/1 Didot, "Bromic Didot", "Bodoni 72", serif !important; color: #EF4123 !important; margin: 0 !important; }
.op h2 { color: #231F20 !important; font-size: 24pt !important; line-height: 1.12 !important; }
.trends section.ch .op-pic { height: 5.2in; }
section.lead { columns: 1 !important; }
.statc { display: grid; grid-template-columns: 1.9in 1fr; gap: 16pt; align-items: center; margin: 14pt 0 6pt; padding: 14pt 0; border-top: 0.75pt solid #231F20; border-bottom: 0.75pt solid #E3E3E1; break-inside: avoid; }
.statc-n { font: 400 66pt/0.9 Didot, "Bromic Didot", "Bodoni 72", serif; color: #EF4123; }
.statc p { margin: 0; font: 400 14pt/1.4 Didot, "Bromic Didot", "Bodoni 72", serif; color: #231F20; }
section.lead > p.fn, section.ch > p.fn { font: 300 6.2pt/1.4 "Helvetica Neue", Helvetica, Arial, sans-serif !important; color: #8A8F94; }
.lead-b { columns: 1 !important; } .lead-b > p:first-of-type { font-size: 15.5pt !important; max-width: 6.6in; }

/* ---------- marketing layout (owner, 19 Nov 2026): every chapter opens on a new page with a photograph ---------- */
body { font-size: 10.4pt; line-height: 1.55; }
section.ch { break-before: page; }
section.ch .ch-b { columns: 2; column-gap: 0.34in; flex: 1; }
section.ch .ch-b > h3 { column-span: none; }
section.ch .ch-b > .v-steps, section.ch .ch-b > .v-waves, section.ch .ch-b > .v-vs, section.ch .ch-b > .v-prods, section.ch .ch-b > .v-bars, section.ch .ch-b > .table-wrap, section.ch .ch-b > figure, section.ch .ch-b > .v-notes, section.ch .ch-b > blockquote { column-span: all; }
section.ch .ch-b > p:first-child { font: 400 14.5pt/1.4 Didot, "Bromic Didot", "Bodoni 72", serif; color: #231F20; column-span: all; margin: 0 0 12pt; }
.op { position: relative; height: 3.9in; margin: 0 -0.5in 16pt; overflow: hidden; background: #231F20; break-inside: avoid; }
.op img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 18%; display: block; }
.op::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(20,18,19,0) 35%, rgba(20,18,19,.78)); }
.op-t { position: absolute; left: 0.5in; right: 0.5in; bottom: 0.32in; z-index: 2; color: #fff; }
.op-n { display: block; font: 400 34pt/1 Didot, "Bromic Didot", "Bodoni 72", serif; color: #EF4123; margin-bottom: 4pt; }
.op h2 { color: #fff; font-size: 26pt; line-height: 1.1; margin: 0; padding: 0; max-width: 6.6in; }
.op h2::before { display: none; }
figure.mid { column-span: all; margin: 8pt 0 10pt; } figure.mid img { width: 100%; height: 2.6in; object-fit: cover; object-position: 50% 18%; }
figure img { object-position: 50% 18%; }
.cover .hero img { object-position: 50% 22%; }
.v-stat { color: #EF4123; font-weight: 700; font-size: 1.35em; letter-spacing: -.01em; }
.lead-b > p:first-of-type .v-stat, .ch-b > p:first-child .v-stat { font-size: 1.6em; }
section.lead { break-before: page; }
section.lead:first-child { break-before: auto; }
.lead-img { margin: 0 -0.5in 16pt; height: 4.2in; overflow: hidden; } .lead-img img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 18%; display: block; max-height: none; }
.lead-b { columns: 2; column-gap: 0.34in; flex: 1; } .lead-b > h1 { column-span: all; font-size: 26pt; margin: 0 0 8pt; }
.lead-b > p:first-of-type { column-span: all; font: 400 14.5pt/1.4 Didot, "Bromic Didot", "Bodoni 72", serif; }
p.fn { break-before: avoid; page-break-before: avoid; margin: 10pt 0 0; padding: 5pt 0 0; border-top: 0.5pt solid #E3E3E1; font-size: 6.2pt; line-height: 1.4; color: #8A8F94; break-inside: avoid; }
p.fn b { color: #EF4123; font-weight: 600; margin-right: 2pt; }
.ch-b figure img, .lead-b figure img { max-height: 2.3in; }
section.end { break-before: auto; } .colophon { font-size: 6.8pt; }
/* product cards: bigger pictures */
.trends section.ch .op { height: 5.4in; }
.trends section.ch .ch-b > p:first-child > strong:first-child { display: block; font: 400 54pt/1 Didot, "Bromic Didot", "Bodoni 72", serif; color: #EF4123; margin: 0 0 4pt; }
.cta { margin-top: 14pt; }

.v-dial { max-width: 4.7in; column-span: all; margin: 4pt auto 8pt; } .v-dial-n { font-size: 17pt; } .v-dial-s b { font-size: 10.5pt; } .v-dial-s small { font-size: 7pt; } .v-dial-s { width: 1.35in; }
.v-spec, .v-vs, .v-prods, .v-bars, .v-notes { column-span: all; } .v-spec dd, .v-vs dd { font-size: 8.6pt; } .v-spec-cols h4 { font-size: 13pt; } .v-vs h4 { font-size: 17pt; }
.v-prods { grid-template-columns: repeat(3, 1fr); gap: 14pt 12pt; } .v-prods h4 { font-size: 11.5pt; } .v-prods p { font-size: 8pt; }
.v-note { font-size: 9pt; padding: 4pt 0; } .v-notes-h { font-size: 12pt; } .v-bar-g > b { font-size: 10.5pt; } .v-bar em { font-size: 7.5pt; }`;
const css = `
@page { size: Letter; margin: 0.55in 0.5in 0.6in; }
@page :first { margin: 0; }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
@font-face { font-family: "Helvetica Neue"; src: local("Helvetica Neue Light"), local("HelveticaNeue-Light"), url("fonts/arimo-latin.woff2") format("woff2"); font-weight: 300; font-display: swap; }
@font-face { font-family: "Helvetica Neue"; src: local("Helvetica Neue"), local("HelveticaNeue"), url("fonts/arimo-latin.woff2") format("woff2"); font-weight: 400; font-display: swap; }
@font-face { font-family: "Helvetica Neue"; src: local("Helvetica Neue Medium"), local("HelveticaNeue-Medium"), url("fonts/arimo-latin.woff2") format("woff2"); font-weight: 500; font-display: swap; }
@font-face { font-family: "Helvetica Neue"; src: local("Helvetica Neue Bold"), local("HelveticaNeue-Bold"), url("fonts/arimo-latin.woff2") format("woff2"); font-weight: 700; font-display: swap; }
@font-face { font-family: "Bromic Didot"; src: local("Didot"), url("fonts/gfs-didot-latin.woff2") format("woff2"); }
body { margin: 0; font: 300 9.6pt/1.5 "Helvetica Neue", Helvetica, Arial, sans-serif; color: #231F20; }
h1, h2 { text-transform: capitalize; }
h1, h2, h3, h4 { font-family: Didot, "Bromic Didot", "Bodoni 72", serif; font-weight: 400; line-height: 1.15; color: #231F20; break-after: avoid; }
h2 { font-size: 19pt; margin: 0 0 8pt; padding-top: 10pt; position: relative; }
h2::before { content: ""; position: absolute; top: 0; left: 0; width: 0.4in; height: 1.6pt; background: #EF4123; }
h3 { font-size: 11.5pt; margin: 10pt 0 3pt; break-after: avoid; }
p, ul, ol { margin: 0 0 6pt; orphans: 3; widows: 3; }
ul, ol { padding-left: 13pt; }
li { margin: 1.5pt 0; }
a { color: #231F20; text-decoration-color: #EF4123; }
strong { font-weight: 600; }
blockquote { margin: 8pt 0; padding: 8pt 12pt; border-left: 2pt solid #EF4123; background: #F7F5F2; font: 400 11.5pt/1.4 Didot, "Bromic Didot", "Bodoni 72", serif; color: #231F20; break-inside: avoid; }
figure { margin: 8pt 0; break-inside: avoid; }
figure img { width: 100%; max-height: 2.6in; object-fit: cover; display: block; }
figcaption { font-size: 7pt; color: #71777D; margin-top: 2pt; }
table { border-collapse: collapse; width: 100%; font-size: 8pt; line-height: 1.35; margin: 4pt 0 10pt; break-inside: avoid; }
tr { break-inside: avoid; }
th { text-align: left; font: 600 6.8pt/1.3 "Helvetica Neue", Helvetica, Arial, sans-serif; letter-spacing: .1em; text-transform: uppercase; color: #FFFFFF; background: #231F20; }
th, td { padding: 4pt 6pt; border-bottom: 0.5pt solid #E3E3E1; vertical-align: top; text-align: left; }
tbody tr:nth-child(even) td { background: #F7F5F2; }
code { font-size: 8.5pt; background: #F5F5F4; padding: 0 3pt; }
hr { display: none; }
sup.cite a { color: #C7321A; text-decoration: none; font-weight: 600; font-size: 6.5pt; }
mark.verify { display: none; }
.diagram { display: none; }
/* sections: prose flows in two columns; headings, pictures and tables run full width */
section.n, section.lead { columns: 2; column-gap: 0.32in; margin: 0 0 14pt; }
section.n > h2, section.n > figure, section.lead > figure, section.n > table, section.n > .tw, section.n > blockquote, section.n .cta { column-span: all; }
section.n > p:first-of-type, section.lead > p:first-of-type { font-size: 11pt; line-height: 1.45; color: #231F20; }
section.lead > p:first-of-type { font: 400 13.5pt/1.4 Didot, "Bromic Didot", "Bodoni 72", serif; column-span: all; margin-bottom: 10pt; }
figure.sec { margin: 0 0 10pt; }
figure.sec img { width: 100%; height: 2.15in; max-height: none; object-fit: cover; }
/* cover: full-bleed photograph, title on a white panel */
.cover { height: 11in; position: relative; display: flex; flex-direction: column; background: #FFFFFF; page-break-after: always; }
.cover .hero { height: 6.9in; position: relative; overflow: hidden; background: #231F20; }
.cover .hero img { width: 100%; height: 100%; object-fit: cover; display: block; }
.cover .hero::after { content: ""; position: absolute; inset: 0 0 auto 0; height: 1.6in; background: linear-gradient(rgba(20,18,19,.55), rgba(20,18,19,0)); }
.cover .hero img.logo { position: absolute; top: 0.45in; left: 0.5in; z-index: 2; width: auto; height: 0.46in; object-fit: contain; }
.cover .titles { padding: 0.38in 0.5in 0; flex: 1; }
.cover .label { font: 600 7.5pt/1.4 "Helvetica Neue", Arial, sans-serif; letter-spacing: .18em; text-transform: uppercase; color: #EF4123; }
.cover h1 { font-size: 31pt; line-height: 1.08; margin: 6pt 0 10pt; max-width: 7in; text-wrap: balance; }
.cover .dek { font: 300 11.5pt/1.45 "Helvetica Neue", Helvetica, Arial, sans-serif; color: #4A4546; max-width: 6.6in; margin: 0; }
.cover .meta { padding: 0 0.5in 0.45in; display: flex; gap: 28pt; font-size: 8pt; color: #575C61; border-top: 0; }
.cover .meta b { display: block; font: 600 6.5pt/1.4 "Helvetica Neue", Arial, sans-serif; letter-spacing: .16em; text-transform: uppercase; color: #71777D; }
.sources { font-size: 6.8pt; line-height: 1.35; padding-left: 12pt; columns: 2; column-gap: 0.3in; color: #4A4546; }
.sources li { margin: 0 0 3pt; break-inside: avoid; }
.sources a { word-break: break-all; color: #71777D; }
.cta { margin: 10pt 0; background: #231F20; color: #FFFFFF; padding: 14pt 16pt; break-inside: avoid; display: flex; justify-content: space-between; align-items: center; gap: 16pt; }
.cta .label { font: 600 6.5pt/1.4 "Helvetica Neue", Arial, sans-serif; letter-spacing: .16em; text-transform: uppercase; color: #EF4123; }
.cta p { font: 400 16pt/1.25 Didot, "Bromic Didot", "Bodoni 72", serif; margin: 3pt 0 0; color: #FFFFFF; }
.cta .go { font: 600 7.5pt/1 "Helvetica Neue", Arial, sans-serif; letter-spacing: .14em; text-transform: uppercase; border: 0.75pt solid #EF4123; padding: 7pt 10pt; white-space: nowrap; }
section.s.end { break-before: auto; }
section.end h2 { font-size: 13pt; }
.colophon { margin-top: 8pt; padding-top: 6pt; border-top: 0.5pt solid #E3E3E1; font-size: 6.8pt; color: #71777D; }
/* trends reports: one trend a page, the picture large, the number in flame */
.trends section.s { break-before: page; }
.trends section.s:first-child, .trends section.s.end { break-before: auto; }
.trends section.s h2 { font-size: 24pt; margin-top: 0; }
.trends section.s figure.sec img { height: 5.6in; }
.trends main { font-size: 11.5pt; line-height: 1.5; }
.trends section.s > p:first-of-type { font-size: 12.5pt; }
.trends section.s > p:first-of-type > strong:first-child { display: block; font: 400 54pt/1 Didot, "Bromic Didot", "Bodoni 72", serif; color: #EF4123; margin: 2pt 0 4pt; }
.trends section.s:not(.end) { columns: 2; column-gap: 0.32in; }
.trends section.s > h2, .trends section.s > figure, .trends section.s > p:first-of-type { column-span: all; }
`;

// Internal sections never go to readers.
const INTERNAL = /editor.{0,6}s note|layout notes|notes for 454|change ?log|open questions|for review|review notes|what changed|corrections applied|reviewer|anmerkung(en)? der redaktion|redaktionsnotiz|layout-hinweise|hinweise für 454|änderungsprotokoll|offene fragen|zur prüfung|prüfhinweise|was sich geändert hat|korrekturen|prüfer|notitie van de redactie|lay-?outnotities|notities voor 454|wijzigingslog|open vragen|ter review|reviewnotities|wat is er veranderd|correcties|beoordelaar/i;
// Labels per language for the printed page (the body text comes from the translation itself).
const LBL = {
  en: { next: 'Next step', sources: 'Sources', edition: 'Edition', site: 'bromic.com', locale: 'en-US', format: 'Letter', draft: '',
    colophon: 'Confirm every installation with your local building authority and a licensed electrician or gas fitter. Wi-Fi and app features need compatible Affinity Smart-Heat controls, sold separately.' },
  de: { next: 'Nächster Schritt', sources: 'Quellen', edition: 'Ausgabe', site: 'bromic.de', locale: 'de-DE', format: 'A4', draft: 'Maschinelle Übersetzung, Entwurf',
    colophon: 'Lassen Sie jede Installation mit Ihrer Baubehörde abstimmen und von einem Elektrofachbetrieb oder Gasinstallateur ausführen (DIN VDE 0100, DVGW-TRGI). WLAN- und App-Funktionen erfordern kompatible Affinity Smart-Heat-Steuerungen, separat erhältlich.',
    aud: { RES: 'Bauherren', ARC: 'Architekten und Planer', BLD: 'Bauunternehmer und Installateure', COM: 'Gastronomie und Hotellerie' } },
  nl: { next: 'Volgende stap', sources: 'Bronnen', edition: 'Editie', site: 'bromic.nl', locale: 'nl-NL', format: 'A4', draft: 'Machinevertaling, concept',
    colophon: 'Stem elke installatie af met uw gemeente en laat haar uitvoeren door een erkend installateur (NEN 1010, NEN 1078). Wifi- en appfuncties vereisen compatibele Affinity Smart-Heat-bediening, apart verkrijgbaar.',
    aud: { RES: 'Huiseigenaren', ARC: 'Architecten en ontwerpers', BLD: 'Aannemers en installateurs', COM: 'Horeca en hotels' } },
};
const PHOTO_OK = (i) => i && !i.notes && i.kind !== 'cutout' && i.kind !== 'diagram' && i.kind !== 'heat-plan' && i.kind !== 'render' && i.status !== 'rejected' && !/coming soon|coastal|select/i.test(i.product || '');
function imagePool(it) {
  const ownOnly = [...(it.images || [])].filter((id) => IMG[id] && id !== it.hero);
  const own = [...(it.images || []), ...[...(it.html.matchAll(/`([ltwpg]-[\w.-]+)`/g))].map((m) => m[1])].filter((id) => IMG[id] && id !== it.hero);
  const aud = new Set(it.audience);
  const rest = HUB.images.filter((i) => PHOTO_OK(i) && i.id !== it.hero && (i.audiences || []).some((a) => aud.has(a) || a === 'ALL') && /^(w|l|t)-/.test(i.id));
  let h = 0; for (const c of it.id) h = (h * 31 + c.charCodeAt(0)) >>> 0;   // stable shuffle per document
  rest.sort((x, y) => ((x.id.length * 7 + h) % 13) - ((y.id.length * 7 + h) % 13) || x.id.localeCompare(y.id));
  return { own: [...new Set(own)], rest: [...new Set(rest.map((i) => i.id))].filter((id) => !own.includes(id)), ownOnly };
}
function finalBody(it) {
  let html = it.html.replace(/<p>\s*\[(DIAGRAM|DIAGRAMM|DIAGRAMME|INFOGRAPHIC|IMAGE|PHOTO)[^\]]*\]\s*<\/p>/gi, '').replace(/\[(DIAGRAM|DIAGRAMM|INFOGRAPHIC)[^\]]*\]/gi, '').replace(/<mark class="verify"[^>]*>[\s\S]*?<\/mark>/g, '').replace(/:\s*\[\[VERIFY[^\]]*\]\]\s*\.?/g, ': see the current Bromic specification sheet.').replace(/\(\s*\[\[VERIFY[^\]]*\]\]\s*\)/g, '').replace(/\s*\[\[VERIFY[^\]]*\]\]/g, '').replace(/<p>\s*<\/p>/g, '');
  const plain = (h) => h.replace(/<[^>]+>/g, '').replace(/&#39;|&rsquo;|&#x27;/g, "'").replace(/&amp;/g, '&').trim();
  // cut every internal section (from its h2 to the next h2)
  const parts = html.split(/(?=<h2[\s>])/);
  const head = (p) => plain((p.match(/<h2[^>]*>([\s\S]*?)<\/h2>/) || [])[1] || '');
  const kept = parts.filter((p) => !/^<h2/.test(p) || !INTERNAL.test(head(p)))
    // a heading that only repeats the title is dropped (its text stays)
    .map((p) => (/^<h2/.test(p) && it.title.toLowerCase().startsWith(head(p).toLowerCase()) ? p.replace(/<h2[^>]*>[\s\S]*?<\/h2>/, '') : p))
    .filter((p) => plain(p).length > 0);
  // trailing <hr> left by a cut section
  const pool = imagePool(it); const used = new Set();
  // numbered sections (trends 01–10) take the item's own images in order; other pages draw from the wider pool first
  const take = (numbered) => { const order = numbered ? [...pool.own, ...pool.rest] : [...pool.rest, ...pool.own]; const id = order.find((x) => !used.has(x)); if (id) used.add(id); return id && IMG[id]; };
  const fig = (im) => `<figure class="sec"><img src="${esc(im.file)}" alt="${esc(im.alt)}"></figure>`;
  // Footnotes: every chapter lists, in small type at its foot, only the sources it cites (publisher, title, year).
  const SRC = Object.fromEntries((it.sources || []).map((x) => [x.id, x]));
  const notesFor = (p) => { const ids = [...new Set([...p.matchAll(/data-src="(\w+)">(\d+)</g)].map((m) => m[1] + '|' + m[2]))];
    return ids.length ? `<p class="fn">${ids.map((k) => { const [id, n] = k.split('|'); const x = SRC[id] || {}; return `<span><b>${n}</b>${esc(String(x.publisher || '').replace(/\s*\(.*?\)\s*/g, ' ').trim())}${x.year ? ` ${esc(x.year)}` : ''}</span>`; }).join(' · ')}</p>` : ''; };
  // a headline figure: the first percentage in a chapter's opening paragraph, red, bold, larger
  const stat = (h) => { let done = false; return h.replace(/<p>([\s\S]*?)<\/p>/, (m, inner) => '<p>' + inner.replace(/(^|[^\w$.,>])(\d{1,3}(?:\.\d)?%)(?![^<]*<\/(?:a|sup|mark)>)/, (x, pre, n) => (done ? x : ((done = true), `${pre}<span class="v-stat">${n}</span>`))) + '</p>'); };
  let chap = 0;
  const out = kept.map((p, i) => {
    const isSec = /^<h2/.test(p);
    const hasImg = /<img\s/.test(p);
    if (!isSec) {
      // opening spread: the photograph full width, the headline figure as a callout
      let body = p; let im = null;
      const inl = body.match(/<figure[^>]*>[\s\S]*?<\/figure>/); if (inl) { body = body.replace(inl[0], ''); const src = (inl[0].match(/src="([^"]+)"/) || [])[1]; im = { file: src, alt: '' }; } else im = take(false);
      let callout = '';
      body = body.replace(/<p>((?:(?!<\/p>)[\s\S])*?(\d{1,3}(?:\.\d)?%)(?:(?!<\/p>)[\s\S])*?)<\/p>/g, (m, inner, n) => { if (callout || !/class="cite"/.test(inner) || +n.replace('%', '') > 100) return m; callout = `<div class="statc"><span class="statc-n">${n}</span><p>${inner}</p></div>`; return ''; });
      return `<section class="lead">${im ? `<figure class="lead-img"><img src="${esc(im.file)}" alt="${esc(im.alt)}"></figure>` : ''}<div class="lead-b">${body}</div>${callout}${notesFor(p)}</section>`;
    }
    const numbered = /^<h2[^>]*>\s*\d{2}\s/.test(p);
    const title = (p.match(/<h2[^>]*>([\s\S]*?)<\/h2>/) || [])[1] || '';
    const im = take(numbered);
    chap++;
    const label = (title.match(/^(Step \d+|Schritt \d+|Stap \d+|\d{2})[.\s]*/) || [])[1];
    const clean = label ? title.replace(/^(Step \d+|Schritt \d+|Stap \d+|\d{2})[.\s]*/, '') : title;
    const opener = `<header class="op">${im ? `<div class="op-pic"><img src="${esc(im.file)}" alt="${esc(im.alt)}"></div>` : ''}<div class="op-t"><span class="op-n">${esc(label || String(chap).padStart(2, '0'))}</span><h2>${clean}</h2></div></header>`;
    let body = p.replace(/<h2[^>]*>[\s\S]*?<\/h2>/, '');
    // a second picture inside long chapters
    const im2 = !hasImg && plain(body).length > 1400 ? take(numbered) : null;
    if (im2) body = body.replace(/(<\/p>)/, `$1<figure class="mid"><img src="${esc(im2.file)}" alt="${esc(im2.alt)}"></figure>`);
    return `<section class="ch${numbered ? ' s' : ''}">${opener}<div class="ch-b">${stat(body)}</div>${notesFor(p)}</section>`;
  }).join('').replace(/<hr>\s*(?=<\/div>)/g, '');
  return { html: out, band: take(false) };
}

function docHTML(it, built, L = LBL.en, lang = 'en') {
  const hero = it.hero && IMG[it.hero];
  const aud = it.audience.map((a) => (L.aud && L.aud[a]) || AUD[a]?.name || a).join(' · ');
  const dek = it.dek || it.meta_description || it.summary;
  const { html, band } = finalBody(it);
  const cta = it.cta && it.cta.label ? `<div class="cta"><div><span class="label">${esc(L.next)}</span><p>${esc(it.cta.label)}</p></div><span class="go">${esc(L.site)}</span></div>` : '';
  const srcs = `<section class="end"><p class="colophon">${esc(L.colophon)} © ${new Date(HUB.built).getFullYear()} Bromic Heating · ${L.site}</p></section>`;
  const month = new Date((it.updated || HUB.built.slice(0, 10)) + 'T12:00:00Z').toLocaleString(L.locale, { month: 'long', year: 'numeric', timeZone: 'UTC' });
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><title>${esc(it.title)} | Bromic Heating</title><base href="file://${DIST}/"><style>${css}${fs.readFileSync(path.join(APP, 'src', 'visuals.css'), 'utf8').replace(/@media[^{]*\{[\s\S]*\}\s*$/, '')}
${VCSS}</style></head><body class="${/^A01/.test(it.id) ? 'trends' : ''}">
  <section class="cover">
    <div class="hero">${hero ? `<img src="${esc(hero.file)}" alt="${esc(hero.alt)}">` : ''}<img class="logo" src="pdf/_img/bromic-logo-white.png" alt="Bromic Heating"></div>
    <div class="titles"><span class="label">${esc(aud)}</span><h1>${esc(it.title)}</h1>${dek ? `<p class="dek">${esc(dek)}</p>` : ''}</div>
    <div class="meta"><span><b>${esc(L.edition)}</b>${esc(month)}</span><span><b>Bromic Heating</b>${L.site}${L.draft ? ' · ' + esc(L.draft) : ''}</span></div>
  </section>
  <main>${html}${cta}${srcs}</main>
  </body></html>`;
}

const items = pdfItems(HUB.items).filter((it) => !only.length || only.includes(it.id));
const IMGDIR = path.join(OUT, '_img');
function printCopies(htmlDoc) {
  const ids = [...new Set([...htmlDoc.matchAll(/src="images\/library\/([\w.-]+?)(-t)?\.webp"/g)].map((m) => m[1]))];
  fs.mkdirSync(IMGDIR, { recursive: true });
  const todo = ids.filter((id) => !fs.existsSync(path.join(IMGDIR, id + '.jpg')));
  if (todo.length) {
    const py = `import sys\nfrom PIL import Image\nfor i in sys.argv[2:]:\n    im=Image.open(f"{sys.argv[1]}/{i}.webp").convert("RGB"); im.thumbnail((1500,1500)); im.save(f"${IMGDIR}/{i}.jpg",quality=72,optimize=True,progressive=True)`;
    const r = spawnSync('python3', ['-c', py, path.join(DIST, 'images', 'library'), ...todo]);
    if (r.status) throw new Error(String(r.stderr));
  }
  return htmlDoc.replace(/src="images\/library\/([\w.-]+?)(-t)?\.webp"/g, (m, id) => `src="pdf/_img/${id}.jpg"`);
}
fs.mkdirSync(OUT, { recursive: true }); fs.mkdirSync(IMGDIR, { recursive: true });
fs.copyFileSync(path.join(APP, '..', 'images', 'portfolio', 'bromic-logo-white.png'), path.join(IMGDIR, 'bromic-logo-white.png'));
const browser = await chromium.launch();
const built = `${new Date(HUB.built).toISOString().slice(0, 10)}${HUB.commit ? ' · ' + HUB.commit : ''}`;
async function print(it, L, lang, file) {
  const page = await browser.newPage();
  const tmp = path.join(DIST, `_pdf-${lang}-${it.id}.html`);
  fs.writeFileSync(tmp, printCopies(docHTML(it, built, L, lang)));
  await page.goto('file://' + tmp, { waitUntil: 'load' });
  await page.pdf({
    path: file, format: L.format, printBackground: true, displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: `<div style="width:100%;font:7pt Helvetica,Arial,sans-serif;color:#71777D;padding:0 0.5in;display:flex;justify-content:space-between">
      <span><b style="color:#EF4123">BROMIC</b> &nbsp;${esc(it.title).slice(0, 80)}${L.draft ? ' · ' + esc(L.draft) : ''}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`,
    margin: { top: '0.55in', bottom: '0.6in', left: '0.5in', right: '0.5in' },
  });
  fs.unlinkSync(tmp); await page.close();
  console.log(`${path.relative(DIST, file)}  ${(fs.statSync(file).size / 1e6).toFixed(1)} MB  ${it.title.slice(0, 60)}`);
}
for (const it of items) await print(it, LBL.en, 'en', path.join(OUT, `${it.id}.pdf`));
// Translations: the same document in German and Dutch, from data-<lang>.js (A4, local labels, marked as a machine draft).
const langIndex = {};
for (const lang of Object.keys(LBL).filter((l) => l !== 'en')) {
  const f = path.join(DIST, `data-${lang}.js`); if (!fs.existsSync(f)) continue;
  const T = JSON.parse(fs.readFileSync(f, 'utf8').replace(/^\(window\.HUB_TR=window\.HUB_TR\|\|\{\}\)\[[^\]]+\]=/, '').replace(/;\s*$/, ''));
  fs.mkdirSync(path.join(OUT, lang), { recursive: true });
  langIndex[lang] = [];
  for (const it of items) {
    const t = T[it.id]; if (!t) continue;
    const tit = { ...it, title: t.title, summary: t.summary, dek: t.dek, meta_description: t.meta_description, html: t.html, cta: t.cta || it.cta };
    await print(tit, LBL[lang], lang, path.join(OUT, lang, `${it.id}.pdf`));
    langIndex[lang].push(it.id);
  }
}
await browser.close();
fs.rmSync(IMGDIR, { recursive: true, force: true });
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(items.map((it) => it.id)));
fs.writeFileSync(path.join(OUT, 'langs.json'), JSON.stringify(langIndex));
