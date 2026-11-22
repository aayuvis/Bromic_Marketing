// Blueprint theme for whole documents: sheet chrome (grid, zone letters, frame, title strip, cover title block)
// and the extra styles a long document needs. Base tokens, CSS and drawings: ./blueprint-base.mjs (from the theme sample).
export * from './blueprint-base.mjs';
import { T, ROOT, THEME, baseCss, defs } from './blueprint-base.mjs';

export const TC = '<span class="tcf">To confirm</span>';
export const sup = (...n) => `<sup class="fnr">${n.join(',')}</sup>`;

export function zones(dark) {
  const c = dark ? 'rgba(201,214,232,.55)' : T.steel;
  const cols = [1, 2, 3, 4, 5, 6], rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const top = cols.map((k, i) => `<span style="left:${(i + 0.5) * 100 / cols.length}%">${k}</span>`).join('');
  const side = rows.map((k, i) => `<span style="top:${(i + 0.5) * 100 / rows.length}%">${k}</span>`).join('');
  return `<div class="zones" style="color:${c}"><div class="zt">${top}</div><div class="zb">${top}</div><div class="zl">${side}</div><div class="zr">${side}</div></div>`;
}

const pad = (v) => String(v).padStart(2, '0');

// doc: { project, asset, date, revision, total }
export const titleStrip = (doc, sheet, title, notes) => `<div class="strip">
  <div class="cell grow"><b>NOTES</b><span>${notes}</span></div>
  <div class="cell"><b>PROJECT</b><span>${doc.project}</span></div>
  <div class="cell"><b>SHEET TITLE</b><span>${title}</span></div>
  <div class="cell s"><b>ASSET</b><span>${doc.asset}</span></div>
  <div class="cell s"><b>SCALE</b><span>NTS</span></div>
  <div class="cell"><b>REVISION</b><span>${doc.revision}</span></div>
  <div class="cell s"><b>DATE</b><span>${doc.date}</span></div>
  <div class="cell sheet"><b>SHEET</b><span>${pad(sheet)}<i>/${pad(doc.total)}</i></span></div>
</div>`;

export const coverBlock = (doc) => `<div class="tblock">
  <div class="r"><b>PROJECT</b><span>${doc.project}</span></div>
  <div class="r two"><div><b>ASSET</b><span>${doc.asset}</span></div><div><b>SCALE</b><span>NTS</span></div><div><b>DATE</b><span>${doc.date}</span></div></div>
  <div class="r two"><div><b>REVISION</b><span>${doc.revision}</span></div><div class="sh"><b>SHEET</b><span>01<i>/${pad(doc.total)}</i></span></div></div>
</div>`;

// A white drawing sheet. body: absolutely placed blocks (each carries class blk for the overlap check).
export const sheet = (doc, n, { eyebrow, title, lede = '', stripTitle, notes, body, cls = '' }) => `<section class="page light ${cls}">
  <div class="grid"></div>${zones(false)}<div class="frame"></div>
  <header class="s-head blk">
    <p class="eyebrow">${eyebrow}</p>
    <h2>${title}</h2>
    ${lede ? `<p class="s-lede">${lede}</p>` : ''}
  </header>
  ${body}
  ${titleStrip(doc, n, stripTitle, notes)}
</section>`;

export const fig = (svg, bubble, title, sub, cls = '') => `<figure class="panel ${cls}">${svg}
  <figcaption><span class="bubble">${bubble}</span><span><b>${title}</b><em>${sub}</em></span></figcaption></figure>`;

export const plate = (src, cap, h, pos = 'center', cls = '') => `<figure class="plate ${cls}">
  <div class="plate-img" style="height:${h};background-image:url(${src});background-position:${pos}"></div>
  <figcaption><b>SITE PHOTO</b> ${cap}</figcaption></figure>`;

export const sourcesList = (sources) => `<ol class="srcs">${sources.map((s, i) => `<li><span class="sn">${i + 1}</span><span>${s}</span></li>`).join('')}</ol>`;

export const extraCss = `
/* ---- additions for whole documents ---- */
.light .plate{border-color:${T.draw}}
.light .plate figcaption{color:${T.steel}}
.fnr{font:500 5.6px/0 BzMono,monospace;color:${T.flame};vertical-align:3.4px;margin-left:1px;letter-spacing:0}
.dark .fnr{color:${T.flame}}
.tcf{display:inline-block;font:500 5.6px/1 BzMono,monospace;letter-spacing:.12em;text-transform:uppercase;color:${T.flame};border:.6px solid ${T.flame};padding:1.6px 3px 1.2px;vertical-align:1px;white-space:nowrap;font-style:normal}
.dark .tcf{color:#F7A08F;border-color:#F7A08F}
.x{position:absolute}
.lblr{display:flex;justify-content:space-between;border-bottom:.9px solid ${T.draw};padding-bottom:5px;margin-bottom:8px;color:${T.draw}}
.lblr .r{color:${T.flame}}
.txt p{font-size:8.6px;line-height:1.55;color:#3a3637}
.txt p+p{margin-top:6px}
.txt strong{color:${T.ink}}
.bul{list-style:none}
.bul li{position:relative;padding:0 0 6px 14px;font-size:8.2px;line-height:1.5;color:#3a3637}
.bul li::before{content:'';position:absolute;left:0;top:4.6px;width:6px;height:.8px;background:${T.flame}}
.bul li b{color:${T.ink}}
.num{list-style:none;counter-reset:n}
.num li{counter-increment:n;position:relative;padding:0 0 7px 22px;font-size:8.2px;line-height:1.5;color:#3a3637}
.num li::before{content:counter(n,decimal-leading-zero);position:absolute;left:0;top:1px;font:500 6.4px BzMono,monospace;color:${T.flame}}
.num li b{color:${T.ink}}
.kv{width:100%;border-collapse:collapse;font-size:7.8px;line-height:1.4}
.kv th{font:500 5.9px/1.2 BzMono,monospace;letter-spacing:.13em;text-align:left;color:${T.steel};padding:5px 8px 5px 0;border-bottom:.5px solid ${T.hair};vertical-align:bottom}
.kv td{padding:5px 8px 5px 0;border-bottom:.5px solid ${T.hair};vertical-align:top;color:#3a3637}
.kv td.code{font:500 7px/1.4 BzMono,monospace;color:${T.draw};white-space:nowrap}
.kv td.st{font:500 6.2px/1.6 BzMono,monospace;letter-spacing:.1em;text-transform:uppercase;text-align:right;white-space:nowrap}
.kv tr:first-child td{border-top:.9px solid ${T.draw}}
.kv thead+tbody tr:first-child td{border-top:0}
.kv thead tr th{border-bottom:.9px solid ${T.draw}}
.pullq{font-family:BzDidot,Didot,serif;font-size:21px;line-height:1.15;color:${T.ink}}
.pullq::before{content:'';display:block;width:26px;height:1px;background:${T.flame};margin-bottom:9px}
/* spec text */
.spec{column-gap:.24in;column-fill:auto;overflow:hidden}
.spec h4{font:500 7px/1.2 BzMono,monospace;letter-spacing:.16em;color:#fff;background:${T.draw};padding:5px 7px 4px;margin:0 0 8px;break-after:avoid}
.spec h4:not(:first-child){margin-top:10px}
.spec h5{font:500 6.6px/1.3 BzMono,monospace;letter-spacing:.12em;color:${T.draw};border-bottom:.6px solid ${T.draw};padding-bottom:3px;margin:9px 0 5px;break-after:avoid}
.spec h4+h5{margin-top:0}
.spec p{font-size:7.5px;line-height:1.5;color:#3a3637;padding-left:13px;text-indent:-13px;margin-bottom:3.4px;break-inside:avoid}
.spec p b.l{display:inline-block;width:13px;text-indent:0;font:500 6.4px/1 BzMono,monospace;color:${T.flame}}
.spec p.s{padding-left:26px}
.spec p.s b.l{color:${T.draw}}
.spec p strong{color:${T.ink}}
.spec .ns{font-style:italic;color:${T.steel}}
.spec .end{font:500 6.6px/1.3 BzMono,monospace;letter-spacing:.16em;color:${T.flame};text-align:center;border-top:.6px solid ${T.draw};border-bottom:.6px solid ${T.draw};padding:6px 0;margin-top:10px;text-indent:0;padding-left:0}
.boxnote{border:.7px solid ${T.draw};padding:9px 11px;background:#fff}
.boxnote .lbl{color:${T.flame};margin-bottom:5px}
.boxnote p{font-size:7.8px;line-height:1.5;color:#3a3637}
.srcs{list-style:none}
.srcs li{display:grid;grid-template-columns:14px 1fr;gap:4px;font-size:6.5px;line-height:1.45;color:${T.steel};padding:3px 0;border-bottom:.5px solid ${T.hair};break-inside:avoid}
.srcs .sn{font:500 6px/1.5 BzMono,monospace;color:${T.flame}}
.srcs i{font-style:italic}
.srcs .u{font:400 5.6px/1.4 BzMono,monospace;color:#8A929C;word-break:break-all}
.dark .lbl{color:${T.navyLine}}
`;

export const page = ({ title, css = '', body }) => `<!doctype html><html lang="en-US"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title><style>${baseCss}${extraCss}${css}</style></head><body>${defs}${body}</body></html>`;

export { ROOT, THEME };
