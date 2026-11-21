// Quality check and print for a built trend report.
// node qa.js <html> <shots-dir|-> [pdf-out]
// Fails (exit 1) on: a script error, an image that did not load, text running past its page or its chart,
// chart text overlapping other chart text, a figure caption or block that overlaps another block.
const { chromium } = require('playwright');
(async () => {
  const [html, dir, pdf] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1700, height: 1100 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + html); await p.waitForFunction('window.__ready', null, { timeout: 60000 });
  await p.evaluate(() => document.querySelectorAll('.pg').forEach(x => x.style.zoom = 1));
  await p.waitForTimeout(400);
  const issues = await p.evaluate(() => {
    const out = [];
    const inside = (q, r, pad = 0) => q.left >= r.left - pad && q.right <= r.right + pad && q.top >= r.top - pad && q.bottom <= r.bottom + pad;
    const hit = (a, b) => !(a.right <= b.left || b.right <= a.left || a.bottom <= b.top || b.bottom <= a.top);
    document.querySelectorAll('img').forEach(i => { if (!i.complete || !i.naturalWidth) out.push('image not loaded: ' + i.getAttribute('src').slice(0, 60)); });
    [...document.querySelectorAll('.pg')].forEach((pg, k) => {
      const n = k + 1, r = pg.getBoundingClientRect();
      // text leaves (paragraphs, headings, list items, captions) must sit inside the page
      pg.querySelectorAll('h1,h2,h4,p,li,figcaption,small,.kick,.fig,.cap,.nf,.tt,.tw').forEach(e => {
        const q = e.getBoundingClientRect(); if (!q.width) return;
        if (!inside(q, r, 1)) out.push(`p${n}: text off page – ${e.className || e.tagName}: "${e.textContent.trim().slice(0, 40)}"`);
        if (e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflow !== 'visible') out.push(`p${n}: clipped – "${e.textContent.trim().slice(0, 40)}"`);
      });
      // chart and diagram text: inside its svg and not overlapping other text in the same svg
      pg.querySelectorAll('svg.chart, svg.mini, svg.diag, svg.plan').forEach(svg => {
        const sr = svg.getBoundingClientRect();
        const ts = [...svg.querySelectorAll('text')].map(t => ({ t: t.textContent, q: t.getBoundingClientRect() })).filter(x => x.q.width);
        ts.forEach(x => { if (!inside(x.q, sr, 2)) out.push(`p${n}: chart text outside chart – "${x.t.slice(0, 40)}"`); });
        for (let i = 0; i < ts.length; i++) for (let j = i + 1; j < ts.length; j++) {
          const a = ts[i].q, c = ts[j].q, ov = Math.max(0, Math.min(a.right, c.right) - Math.max(a.left, c.left)) * Math.max(0, Math.min(a.bottom, c.bottom) - Math.max(a.top, c.top));
          if (ov > 0.25 * Math.min(a.width * a.height, c.width * c.height)) out.push(`p${n}: chart labels overlap – "${ts[i].t.slice(0, 25)}" / "${ts[j].t.slice(0, 25)}"`);
        }
      });
      // layout blocks must not collide
      const blocks = [...pg.querySelectorAll('.hd, .full > svg.chart, .row2, .trio, .waves, .tiles, .sys, .lays, .qt, .qv, .qimg, .bimg, .il, .ir, .foot')].map(e => ({ e, q: e.getBoundingClientRect() }));
      for (let i = 0; i < blocks.length; i++) for (let j = i + 1; j < blocks.length; j++) {
        const a = blocks[i], c = blocks[j];
        if (a.e.contains(c.e) || c.e.contains(a.e)) continue;
        const ov = Math.max(0, Math.min(a.q.right, c.q.right) - Math.max(a.q.left, c.q.left)) * Math.max(0, Math.min(a.q.bottom, c.q.bottom) - Math.max(a.q.top, c.q.top));
        if (ov > 40) out.push(`p${n}: blocks overlap – ${a.e.className} / ${c.e.className}`);
      }
      // the content of each block must end before the folio line
      const f = pg.querySelector('.folio'); if (f) { const fq = f.getBoundingClientRect();
        pg.querySelectorAll('.trio, .waves, .tiles, .sys, .lays, .qt > *:last-child, .qv > *:last-child, .six, .ckl li:last-child, .srcs .note, .foot').forEach(e => { const q = e.getBoundingClientRect(); if (q.bottom > fq.top + 2 && !e.closest('.insight')) out.push(`p${n}: runs into the footer – "${e.textContent.trim().slice(0, 40)}"`); }); }
    });
    return out;
  });
  const pgs = await p.$$('.pg');
  if (dir && dir !== '-') for (let i = 0; i < pgs.length; i++) await pgs[i].screenshot({ path: `${dir}/p${String(i + 1).padStart(2, '0')}.jpg`, quality: 72 });
  const all = errs.map(e => 'script: ' + e).concat(issues);
  console.log(`${html.split('/').slice(-2).join('/')}: ${pgs.length} pages, ${all.length} issues`);
  all.forEach(x => console.log('  ' + x));
  if (pdf) await p.pdf({ path: pdf, printBackground: true, preferCSSPageSize: true });
  await b.close();
  process.exit(all.length ? 1 : 0);
})();
