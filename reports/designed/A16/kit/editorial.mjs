// Editorial Lookbook theme for whole documents (from the approved sample, reports/themes/editorial/build.js):
// full-bleed warm evening photography, Didot display, drop caps, pull quotes taken from the text, captions in
// small caps, folios. Shared by A16 and A15; the render and print check live in ../../A11/kit/render.mjs.
export const ROOT = '../../..';

export const css = `
@font-face { font-family: 'Didot'; src: url('${ROOT}/app/src/fonts/gfs-didot-latin.woff2') format('woff2'); }
@font-face { font-family: 'Arimo'; src: url('${ROOT}/app/src/fonts/arimo-latin.woff2') format('woff2'); }
:root { --ink:#231F20; --steel:#6E7377; --mist:#A7ABAE; --rule:#D9DBDC; --flame:#EF4123; --paper:#FFFFFF; --body:#3a3637;
  --m:0.5in; --gap:0.18in; }
@page { size: 8.5in 11in; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
html, body { background: var(--paper); }
body { font-family: 'Arimo', 'Helvetica Neue', Arial, sans-serif; color: var(--ink); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { width: 8.5in; height: 11in; position: relative; overflow: hidden; background: var(--paper); page-break-after: always; break-after: page; }
.page:last-child { page-break-after: auto; break-after: auto; }
.x { position: absolute; }
.photo { position: absolute; background-size: cover; background-repeat: no-repeat; }
.didot, h1, h2, h3, h4 { font-family: 'Didot', 'Bodoni 72', serif; font-weight: 400; }
.label { display: block; font-size: 7.5pt; letter-spacing: 0.22em; text-transform: uppercase; color: var(--flame); }
.caption { font-size: 7.6pt; line-height: 1.45; color: var(--steel); letter-spacing: 0.04em; }
.caption b { font-variant: small-caps; text-transform: lowercase; letter-spacing: 0.1em; font-weight: 400; color: var(--ink); }
.caption.light { color: rgba(255,255,255,.86); }
.caption.light b { color: #fff; }
p { font-size: 9.4pt; line-height: 1.6; color: var(--body); hyphens: auto; }
p + p { margin-top: 7pt; }
sup { font-size: 6pt; color: var(--flame); vertical-align: 3pt; line-height: 0; margin-left: 1pt; }
strong { color: var(--ink); font-weight: 700; }
h2 { font-size: 34pt; line-height: 0.98; letter-spacing: -0.008em; margin: 10pt 0 14pt; }
h3 { font-size: 19pt; line-height: 1.04; margin: 0 0 7pt; }
.lede::first-letter { font-family: 'Didot', serif; float: left; font-size: 58pt; line-height: 0.78; padding: 5pt 7pt 0 0; color: var(--ink); }
.deckp { hyphens: manual; font-family: 'Didot', serif; font-style: italic; font-size: 14pt; line-height: 1.3; color: var(--ink); }
.pull { padding-left: 12pt; border-left: 1.2pt solid var(--flame); }
.pull q { font-family: 'Didot', serif; font-size: 15pt; line-height: 1.22; font-style: italic; quotes: '\\201C' '\\201D'; display: block; color: var(--ink); }
.pull.light q { color: #fff; }
.rule { border-top: 0.5pt solid var(--ink); }
.tcf { font-size: 6.4pt; letter-spacing: 0.18em; text-transform: uppercase; color: var(--flame); white-space: nowrap; font-style: normal; }
.tcf::before { content: ''; display: inline-block; width: 8pt; height: 0.8pt; background: var(--flame); vertical-align: 2.5pt; margin-right: 4pt; }
/* folio */
.folio { position: absolute; left: var(--m); right: var(--m); bottom: 0.34in; display: flex; justify-content: space-between; align-items: baseline;
  font-size: 6.8pt; letter-spacing: 0.2em; text-transform: uppercase; color: var(--steel); border-top: 0.5pt solid var(--rule); padding-top: 7pt; }
.folio .n { font-family: 'Didot', serif; font-size: 10pt; letter-spacing: 0; color: var(--ink); }
.folio.light { color: rgba(255,255,255,.85); border-color: rgba(255,255,255,.35); }
.folio.light .n { color: #fff; }
/* lists */
.dash { list-style: none; }
.dash li { position: relative; padding: 0 0 6pt 15pt; font-size: 9pt; line-height: 1.55; color: var(--body); }
.dash li::before { content: ''; position: absolute; left: 0; top: 6.4pt; width: 8pt; height: 0.8pt; background: var(--flame); }
.check { list-style: none; }
.check li { font-size: 8.6pt; line-height: 1.42; padding: 0 0 6pt 15pt; position: relative; break-inside: avoid; color: var(--body); }
.check li::before { content: ''; position: absolute; left: 0; top: 2.2pt; width: 7pt; height: 7pt; border: 0.7pt solid var(--ink); }
/* key-value rows */
.rows { border-top: 0.5pt solid var(--ink); }
.rows > div { display: grid; grid-template-columns: 1.4in 1fr; gap: 12pt; padding: 7pt 0; border-bottom: 0.5pt solid var(--rule); }
.rows b { font-weight: 400; font-size: 7.2pt; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink); padding-top: 1.5pt; line-height: 1.4; }
.rows span { font-size: 8.8pt; line-height: 1.5; color: var(--body); }
/* tables */
table.ed { width: 100%; border-collapse: collapse; }
table.ed th { font-weight: 400; font-size: 6.8pt; letter-spacing: 0.18em; text-transform: uppercase; color: var(--steel); text-align: left; padding: 0 10pt 7pt 0; border-bottom: 0.5pt solid var(--ink); vertical-align: bottom; }
table.ed td { font-size: 8.4pt; line-height: 1.45; color: var(--body); padding: 8pt 10pt 8pt 0; border-bottom: 0.5pt solid var(--rule); vertical-align: top; }
table.ed td:first-child { color: var(--ink); }
table.ed td.fam { font-family: 'Didot', serif; font-size: 11.5pt; line-height: 1.15; color: var(--ink); }
/* cta */
.btn { display: inline-block; background: var(--ink); color: #fff; font-size: 7.6pt; letter-spacing: 0.22em; text-transform: uppercase; padding: 10pt 18pt; text-decoration: none; }
.btn.flame { background: var(--flame); }
/* sources */
.srcs { list-style: none; counter-reset: s; }
.srcs li { counter-increment: s; position: relative; padding: 0 0 3.2pt 12pt; font-size: 6.6pt; line-height: 1.45; color: var(--steel); break-inside: avoid; }
.srcs li::before { content: counter(s); position: absolute; left: 0; top: 0; color: var(--flame); font-size: 6.4pt; }
.srcs li i { font-style: italic; }
.srcs.light li { color: rgba(255,255,255,.78); }
.fine { font-size: 6.6pt; line-height: 1.5; color: var(--steel); }
`;

export const folio = (n, title, audience, { side = 'r', light = false } = {}) => `
  <div class="folio blk${light ? ' light' : ''}">${side === 'l'
    ? `<span class="n">${n}</span><span>${title}</span><span>Bromic Heating · ${audience}</span>`
    : `<span>Bromic Heating · ${audience}</span><span>${title}</span><span class="n">${n}</span>`}</div>`;

export const photo = (src, cls, pos = '50% 50%', extra = '') => `<div class="photo ${cls}" style="background-image:url('${src}');background-position:${pos};${extra}"></div>`;
export const TC = '<em class="tcf">To confirm</em>';
export const sup = (...n) => `<sup>${n.join(',')}</sup>`;

export const doc = (title, pageCss, pages) => `<!doctype html><html lang="en-US"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title><style>${css}${pageCss}</style></head><body>${pages.join('\n')}</body></html>`;
