/* Bromic white papers – hand-drawn technical sketches (rough.js).
   Every dimension drawn is in content.py with its source; brand profiles are drawn from the maker's published figures.
   A sketch is a mounting concept, not an engineering drawing. */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const INK = '#231F20', INK2 = '#4A4546', STEEL = '#71777D', FLAME = '#EF4123', FINK = '#C7321A', LINE = '#C9C9C6', WASH = '#FCE7E2', PAPER2 = '#F5F5F4';
  let seed = 7;
  const O = (o = {}) => Object.assign({ seed: seed++, roughness: 0.9, bowing: 0.6, stroke: INK, strokeWidth: 1.3 }, o);
  function el(tag, a, p) { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }
  function T(svg, x, y, s, o = {}) {
    const t = el('text', { x, y, 'font-size': o.size || 12, 'text-anchor': o.anchor || 'start', fill: o.fill || INK, 'font-weight': o.weight || 400,
      'font-family': o.serif ? '"Bromic Didot",Didot,serif' : '"Bromic Sans",Helvetica,Arial,sans-serif' }, svg);
    if (o.halo !== false) { t.setAttribute('stroke', o.halo || '#fff'); t.setAttribute('stroke-width', 4); t.setAttribute('paint-order', 'stroke'); t.setAttribute('stroke-linejoin', 'round'); }
    if (o.rot) t.setAttribute('transform', `rotate(${o.rot} ${x} ${y})`);
    t.textContent = s; return t;
  }
  const add = (svg, n) => (svg.appendChild(n), n);
  const R = svg => rough.svg(svg);
  function rect(svg, x, y, w, h, o = {}) { return add(svg, R(svg).rectangle(x, y, w, h, O(o))); }
  function line(svg, x1, y1, x2, y2, o = {}) { return add(svg, R(svg).line(x1, y1, x2, y2, O(o))); }
  function poly(svg, pts, o = {}) { return add(svg, R(svg).polygon(pts, O(o))); }
  function circ(svg, x, y, d, o = {}) { return add(svg, R(svg).circle(x, y, d, O(o))); }
  function ell(svg, x, y, w, h, o = {}) { return add(svg, R(svg).ellipse(x, y, w, h, O(o))); }
  function crisp(svg, x1, y1, x2, y2, c = STEEL, w = 0.9, dash) { const l = el('line', { x1, y1, x2, y2, stroke: c, 'stroke-width': w }, svg); if (dash) l.setAttribute('stroke-dasharray', dash); return l; }
  // dimension line with ticks and a label; vertical if x1==x2
  function dim(svg, x1, y1, x2, y2, label, o = {}) {
    crisp(svg, x1, y1, x2, y2, o.c || FINK, 1);
    const v = x1 === x2, t = 5;
    if (v) { crisp(svg, x1 - t, y1, x1 + t, y1, o.c || FINK, 1); crisp(svg, x2 - t, y2, x2 + t, y2, o.c || FINK, 1); T(svg, x1 + (o.left ? -8 : 8), (y1 + y2) / 2 + 4, label, { size: o.size || 11, fill: FINK, anchor: o.left ? 'end' : 'start', weight: 700 }); }
    else { crisp(svg, x1, y1 - t, x1, y1 + t, o.c || FINK, 1); crisp(svg, x2, y2 - t, x2, y2 + t, o.c || FINK, 1); T(svg, (x1 + x2) / 2, y1 + (o.below ? 15 : -6), label, { size: o.size || 11, fill: FINK, anchor: 'middle', weight: 700 }); }
  }
  function callout(svg, x, y, tx, ty, s, o = {}) { crisp(svg, x, y, tx, ty, INK2, 0.8); circ(svg, x, y, 5, { fill: INK, fillStyle: 'solid', strokeWidth: 0.6, roughness: 0.3 });
    String(s).split('|').forEach((l, i) => T(svg, tx + (o.anchor === 'end' ? -4 : 4), ty + 4 + i * 13, l, { size: o.size || 10.5, anchor: o.anchor || 'start', fill: INK2, weight: i ? 400 : 700 })); }

  /* --- heaters, drawn to the scale s (px per inch) --- */
  // Tungsten Series II in elevation: body length L in, height 3 in drawn (depth not claimed), single post of length post in
  function tungstenElev(svg, cx, ytop, s, o = {}) {
    const L = o.L || 56.5, post = o.post || 4, w = L * s, h = Math.max(3.2 * s, 9);
    const yb = ytop + post * s; // heater top
    if (o.post !== 0) { rect(svg, cx - 1.2 * s, ytop, 2.4 * s, post * s, { fill: o.fin || INK, fillStyle: 'solid', strokeWidth: 0.8 }); rect(svg, cx - 2 * s, ytop - 0.4 * s, 4 * s, 0.6 * s, { fill: o.fin || INK, fillStyle: 'solid', strokeWidth: 0.8 }); }
    const g = el('g', o.tilt ? { transform: `rotate(${o.tilt} ${cx} ${yb + h / 2})` } : {}, svg);
    add(g, R(svg).rectangle(cx - w / 2, yb, w, h, O({ fill: o.fin || INK, fillStyle: 'solid', strokeWidth: 0.9 })));
    add(g, R(svg).line(cx - w / 2 + 0.12 * w, yb + h - 2, cx + w / 2 - 0.12 * w, yb + h - 2, O({ stroke: FLAME, strokeWidth: 2.4, roughness: 0.4 })));
    return { x: cx, y: yb + h };
  }
  // Tungsten section (end view) – width W in
  function tungstenSection(svg, cx, ytop, s, o = {}) {
    const W = o.W || 7.2, H = o.H || 3.4, w = W * s, h = H * s;
    if (o.post) { rect(svg, cx - 1.2 * s, ytop, 2.4 * s, o.post * s, { fill: o.fin || INK, fillStyle: 'solid', strokeWidth: 0.8 }); ytop += o.post * s; }
    poly(svg, [[cx - w / 2, ytop], [cx + w / 2, ytop], [cx + w / 2 - 0.6 * s, ytop + h], [cx - w / 2 + 0.6 * s, ytop + h]], { fill: o.fin || INK, fillStyle: o.hatch ? 'hachure' : 'solid', hachureGap: 3, strokeWidth: 1 });
    line(svg, cx - w / 2 + s, ytop + h - 1, cx + w / 2 - s, ytop + h - 1, { stroke: FLAME, strokeWidth: 2.4, roughness: 0.3 });
    return { w, h, bottom: ytop + h };
  }
  function platinumElev(svg, cx, ytop, s, o = {}) {
    const L = o.L || 53.2, pole = o.pole || 8, w = L * s, h = Math.max(2.8 * s, 8);
    if (pole) rect(svg, cx - 0.8 * s, ytop, 1.6 * s, pole * s, { fill: '#9AA0A6', fillStyle: 'solid', strokeWidth: 0.8 });
    const yb = ytop + pole * s;
    rect(svg, cx - w / 2, yb, w, h, { fill: o.fin || '#2B2B2B', fillStyle: 'solid', strokeWidth: 0.9 });
    line(svg, cx - w / 2 + 0.08 * w, yb + h - 1.5, cx + w / 2 - 0.08 * w, yb + h - 1.5, { stroke: FLAME, strokeWidth: 2.4, roughness: 0.3 });
    return { y: yb + h };
  }
  function platinumRecess(svg, cx, yceil, s, o = {}) {
    const L = o.L || 53.2, w = L * s, d = (o.d || 5) * s;
    rect(svg, cx - w / 2 - 2, yceil - d, w + 4, d, { stroke: INK2, fill: PAPER2, fillStyle: 'solid', strokeWidth: 0.9 });
    line(svg, cx - w / 2 - 6, yceil, cx + w / 2 + 6, yceil, { strokeWidth: 2.2 });
    line(svg, cx - w / 2 + 0.08 * w, yceil - 2, cx + w / 2 - 0.08 * w, yceil - 2, { stroke: FLAME, strokeWidth: 2.4, roughness: 0.3 });
  }
  // Eclipse pendant: disc of diameter D in on a pole
  function eclipseElev(svg, cx, ytop, s, o = {}) {
    const D = o.D || 27.6, pole = o.pole || 24, d = D * s, h = Math.max(2.6 * s, 8);
    rect(svg, cx - 2.2 * s, ytop, 1.2 * s, pole * s, { fill: INK, fillStyle: 'solid', strokeWidth: 0.7 });
    rect(svg, cx + 1.0 * s, ytop, 1.2 * s, pole * s, { fill: INK, fillStyle: 'solid', strokeWidth: 0.7 });
    const yb = ytop + pole * s;
    poly(svg, [[cx - d / 2, yb + h], [cx - d / 2 + 2 * s, yb], [cx + d / 2 - 2 * s, yb], [cx + d / 2, yb + h]], { fill: INK, fillStyle: 'solid', strokeWidth: 0.9 });
    line(svg, cx - d / 2 + s, yb + h + 1.5, cx + d / 2 - s, yb + h + 1.5, { stroke: '#F6C35C', strokeWidth: 2.6, roughness: 0.3 });
    return { y: yb + h };
  }
  function aim(svg, x, y, tx, ty) { const l = crisp(svg, x, y, tx, ty, FLAME, 1.1, '4 4'); }
  function table(svg, cx, yfloor, s) { // a 30 in high table and two chairs, simple
    rect(svg, cx - 24 * s, yfloor - 30 * s, 48 * s, 1.6 * s, { fill: STEEL, fillStyle: 'solid', strokeWidth: 0.7 });
    line(svg, cx - 20 * s, yfloor - 29 * s, cx - 20 * s, yfloor, { stroke: STEEL }); line(svg, cx + 20 * s, yfloor - 29 * s, cx + 20 * s, yfloor, { stroke: STEEL });
    [-1, 1].forEach(k => { const x = cx + k * 34 * s; line(svg, x - 8 * s, yfloor - 18 * s, x + 8 * s, yfloor - 18 * s, { stroke: STEEL }); line(svg, x + k * 8 * s, yfloor - 18 * s, x + k * 9 * s, yfloor - 36 * s, { stroke: STEEL }); line(svg, x - 7 * s, yfloor - 18 * s, x - 7 * s, yfloor, { stroke: STEEL }); line(svg, x + 7 * s, yfloor - 18 * s, x + 7 * s, yfloor, { stroke: STEEL }); });
  }

  /* --- the pergola elevation for a brand: p = {span, clear, post, beamH, beamW, blade, mid, louvre:true|false, label} (inches) --- */
  function pergola(svg, p) {
    const W = 700, H = 380, x0 = 40, floor = 336;
    const span = p.span, s = Math.min((W - 2 * x0 - 40) / (span + 2 * p.post), (floor - 60) / (p.clear + p.beamH + 6));
    const xl = x0 + 20, xr = xl + (span + 2 * p.post) * s, ybeamB = floor - p.clear * s, ybeamT = ybeamB - p.beamH * s;
    line(svg, 10, floor, W - 10, floor, { stroke: INK2, strokeWidth: 1.2 });
    for (let x = 14; x < W - 14; x += 14) crisp(svg, x, floor + 1, x - 8, floor + 9, LINE, 0.8);
    rect(svg, xl, ybeamT, p.post * s, floor - ybeamT, { fill: p.frame || '#EDEDEB', fillStyle: 'solid' });
    rect(svg, xr - p.post * s, ybeamT, p.post * s, floor - ybeamT, { fill: p.frame || '#EDEDEB', fillStyle: 'solid' });
    rect(svg, xl, ybeamT, xr - xl, p.beamH * s, { fill: p.frame || '#EDEDEB', fillStyle: 'solid' });
    if (p.louvre !== false) { // blade ends above, inside the beam depth
      const n = Math.floor((xr - xl - 2 * p.post * s) / ((p.pitch || 8) * s));
      for (let i = 1; i < n; i++) { const x = xl + p.post * s + i * (p.pitch || 8) * s; line(svg, x - 2.4 * s, ybeamT + 0.25 * p.beamH * s, x + 2.4 * s, ybeamT + 0.12 * p.beamH * s, { stroke: STEEL, strokeWidth: 1.6, roughness: 0.5 }); }
    }
    const mid = (xl + xr) / 2;
    if (p.mid) rect(svg, mid - (p.midW || p.beamW) * s / 2, ybeamT, (p.midW || p.beamW) * s, (p.midH || p.beamH) * s, { fill: '#D9D9D6', fillStyle: 'cross-hatch', hachureGap: 4, strokeWidth: 0.9 });
    // heaters: Tungsten on its single post under the beam, left third; Eclipse at the centre; Platinum right third
    const tx = xl + (xr - xl) * 0.22, px = xl + (xr - xl) * 0.78;
    const tb = tungstenElev(svg, tx, ybeamB, s, { L: p.tL || 45, post: 4, fin: p.tfin });
    const eb = eclipseElev(svg, mid, ybeamB, s, { pole: p.ePole || 24 });
    if (p.platRecess) platinumRecess(svg, px, ybeamB, s, { L: 33.1 }); else platinumElev(svg, px, ybeamB, s, { L: 33.1, pole: 8 });
    table(svg, tx, floor, s); table(svg, mid, floor, s); table(svg, px, floor, s);
    // dimensions
    dim(svg, xl + p.post * s, ybeamB + 10 + 64 * s, xr - p.post * s, ybeamB + 10 + 64 * s, p.spanLabel || `${p.span} in between posts`, { below: true });
    dim(svg, xr + 18, ybeamB, xr + 18, floor, p.clearLabel || `${p.clear} in clear`);
    dim(svg, xl - 14, ybeamT, xl - 14, ybeamB, p.beamLabel || `${p.beamH} in`, { left: true });
    T(svg, tx, ybeamT - 10, 'Tungsten · single post', { size: 10.5, anchor: 'middle', weight: 700 });
    T(svg, mid, ybeamT - 10, p.mid ? 'Eclipse · pendant on the centre beam' : 'Eclipse · pendant', { size: 10.5, anchor: 'middle', weight: 700 });
    T(svg, px, ybeamT - 10, p.platRecess ? 'Platinum · recessed in a solid bay' : 'Platinum · on its 8 in pole', { size: 10.5, anchor: 'middle', weight: 700 });
    crisp(svg, xl, floor - 96 * s, xr, floor - 96 * s, FLAME, 0.8, '2 5');
    T(svg, xr - 4, floor - 96 * s - 5, '8 ft: lowest heater mount', { size: 9.5, anchor: 'end', fill: FINK });
  }
  // beam detail: beam profile section with Tungsten section on single post below, both to one scale
  function beamDetail(svg, p) {
    const s = p.ds || 9, cx = 170, y0 = 40;
    const bw = p.beamW * s, bh = p.beamH * s;
    rect(svg, cx - bw / 2, y0, bw, bh, { fill: '#EDEDEB', fillStyle: 'solid' });
    if (p.gutter) rect(svg, cx - bw / 2 + 0.25 * s, y0 + 0.25 * s, bw * 0.45, bh * 0.45, { stroke: STEEL, strokeWidth: 0.8, fill: '#fff', fillStyle: 'solid' });
    if (p.slot) { rect(svg, cx - 0.6 * s, y0 + bh - 0.7 * s, 1.2 * s, 0.7 * s, { stroke: FINK, strokeWidth: 0.9, fill: '#fff', fillStyle: 'solid' }); }
    const t = tungstenSection(svg, cx, y0 + bh, s, { post: 4 });
    rect(svg, cx - 2.0 * s, y0 + bh, 4 * s, 0.5 * s, { fill: INK, fillStyle: 'solid', strokeWidth: 0.6 });
    dim(svg, cx - bw / 2, y0 - 12, cx + bw / 2, y0 - 12, `${p.beamW} in`);
    dim(svg, cx + bw / 2 + 14, y0, cx + bw / 2 + 14, y0 + bh, `${p.beamH} in`);
    dim(svg, cx - t.w / 2, t.bottom + 16, cx + t.w / 2, t.bottom + 16, '7.2 in', { below: true });
    callout(svg, cx + 0.5 * s, y0 + bh + 2 * s, 300, y0 + bh + 4, 'Single post|wiring runs inside it', {});
    callout(svg, cx, y0 + bh + 0.2 * s, 300, y0 + bh - 30, 'Plate 2.5 × 4 in|fixed to the beam', {});
    if (p.note) T(svg, 20, 300, p.note, { size: 10, fill: STEEL });
  }

  /* --- generic diagrams --- */
  const D = {
    // Series I vs Series II on the same 6 in beam, to scale
    footprint(svg) {
      const s = 16, y0 = 40;
      [[180, 'Series I', 8.4, '8.4 in (214 mm)', true], [500, 'Series II', 7.2, '7.2 in (183 mm)', false]].forEach(([cx, n, W, lab, old]) => {
        rect(svg, cx - 3 * s, y0, 6 * s, 3.2 * s, { fill: '#EDEDEB', fillStyle: 'solid' });
        T(svg, cx, y0 - 10, '6 in beam', { size: 10, anchor: 'middle', fill: STEEL });
        if (old) { rect(svg, cx - 2.6 * s, y0 + 3.2 * s, 0.9 * s, 4 * s, { fill: STEEL, fillStyle: 'solid', strokeWidth: 0.6 }); rect(svg, cx + 1.7 * s, y0 + 3.2 * s, 0.9 * s, 4 * s, { fill: STEEL, fillStyle: 'solid', strokeWidth: 0.6 }); }
        const t = tungstenSection(svg, cx, y0 + 3.2 * s, s, { W, post: old ? 4 : 4, fin: old ? STEEL : INK });
        dim(svg, cx - t.w / 2, t.bottom + 18, cx + t.w / 2, t.bottom + 18, lab, { below: true, size: 12 });
        T(svg, cx, t.bottom + 62, n, { size: 22, anchor: 'middle', serif: true, fill: old ? STEEL : INK });
        T(svg, cx, t.bottom + 80, old ? 'two suspension tubes' : 'one single post, wiring inside', { size: 11, anchor: 'middle', fill: INK2 });
      });
      T(svg, 340, 330, 'Drawn to one scale. Width from the Series II launch deck; depth is not compared until both are measured the same way.', { size: 9.5, anchor: 'middle', fill: STEEL });
    },
    // single post install, exploded
    install(svg) {
      const s = 11, cx = 230, y0 = 60;
      rect(svg, 40, y0 - 26, 380, 26, { fill: '#EDEDEB', fillStyle: 'solid' });
      T(svg, 50, y0 - 32, 'Pergola beam or ceiling', { size: 10.5, fill: STEEL });
      crisp(svg, 70, y0 - 13, cx - 6, y0 - 13, FLAME, 1.4, '5 3'); T(svg, 70, y0 - 2, 'Cable inside the beam', { size: 10, fill: FINK, weight: 700 });
      rect(svg, cx - 2 * s, y0, 4 * s, 0.5 * s, { fill: INK, fillStyle: 'solid' });
      rect(svg, cx - 1.2 * s, y0 + 0.5 * s, 2.4 * s, 6 * s, { fill: INK, fillStyle: 'solid' });
      crisp(svg, cx, y0 - 13, cx, y0 + 6.2 * s, FLAME, 1.4, '5 3');
      const yb = y0 + 6.5 * s;
      rect(svg, cx - 170, yb, 340, 3.2 * s, { fill: INK, fillStyle: 'solid' });
      line(svg, cx - 140, yb + 3.2 * s - 2, cx + 140, yb + 3.2 * s - 2, { stroke: FLAME, strokeWidth: 2.6, roughness: 0.3 });
      callout(svg, cx + 2 * s, y0 + 2, 470, y0 + 4, 'Mounting plate|2.5 × 4 in, set positions 15°, 30°, 45°');
      callout(svg, cx + 1.2 * s, y0 + 4 * s, 470, y0 + 52, 'One single post|replaces Series I’s two tubes');
      callout(svg, cx + 120, yb + 10, 470, yb + 30, 'No junction box on show|wiring enters through the post');
      // accessories row
      const ay = 250;
      T(svg, 20, ay - 12, 'Accessories', { size: 11, weight: 700, fill: FINK });
      // pitched adaptor
      poly(svg, [[30, ay + 40], [120, ay + 5], [120, ay + 40]], { fill: '#EDEDEB', fillStyle: 'solid' }); T(svg, 75, ay + 58, 'Pitched-ceiling adaptor', { size: 10, anchor: 'middle', weight: 700 }); T(svg, 75, ay + 71, '3/12 to 12/12', { size: 10, anchor: 'middle', fill: STEEL });
      // wall bracket
      rect(svg, 190, ay, 8, 50, { fill: '#EDEDEB', fillStyle: 'solid' }); line(svg, 198, ay + 10, 262, ay + 10, { strokeWidth: 3 }); line(svg, 262, ay + 10, 262, ay + 26, { strokeWidth: 3 }); rect(svg, 236, ay + 26, 52, 9, { fill: INK, fillStyle: 'solid' });
      T(svg, 240, ay + 58, 'Wall bracket', { size: 10, anchor: 'middle', weight: 700 }); T(svg, 240, ay + 71, '14 in or 18 in reach', { size: 10, anchor: 'middle', fill: STEEL });
      // recess kit
      rect(svg, 340, ay + 4, 110, 30, { fill: PAPER2, fillStyle: 'solid' }); line(svg, 330, ay + 34, 460, ay + 34, { strokeWidth: 2 }); line(svg, 352, ay + 31, 438, ay + 31, { stroke: FLAME, strokeWidth: 2.4, roughness: 0.3 });
      dim(svg, 470, ay + 4, 470, ay + 34, '7.5 in');
      T(svg, 395, ay + 58, 'Low-clearance recess kit', { size: 10, anchor: 'middle', weight: 700 }); T(svg, 395, ay + 71, 'fan-ventilated, box supplied', { size: 10, anchor: 'middle', fill: STEEL });
      // angle bracket
      const bx = 600; rect(svg, bx - 20, ay, 40, 6, { fill: INK, fillStyle: 'solid' }); [15, 30, 45].forEach((a, i) => { const r = 46, rad = (90 - a) * Math.PI / 180; crisp(svg, bx, ay + 6, bx + Math.cos(rad) * r, ay + 6 + Math.sin(rad) * r, i === 2 ? FLAME : STEEL, 1.2, i === 2 ? null : '3 3'); });
      T(svg, bx, ay + 58, 'Mounting bracket', { size: 10, anchor: 'middle', weight: 700 }); T(svg, bx, ay + 71, '15°, 30°, 45° set positions', { size: 10, anchor: 'middle', fill: STEEL });
    },
    coastal(svg) {
      const x = 40, y = 40, w = 300;
      [['Salt air, pool chemicals, sun', '#fff', STEEL], ['High-temperature corrosion-resistant coating', '#3A3A3A', '#fff'], ['316 marine-grade stainless steel', '#9AA0A6', INK], ['IPX5 heater body', '#C9CED3', INK]].forEach(([t, f, c], i) => {
        if (i === 0) { for (let k = 0; k < 9; k++) { const xx = x + 20 + k * 32; crisp(svg, xx, y, xx + 10, y + 26, STEEL, 1, '2 4'); } T(svg, x + w + 20, y + 18, t, { size: 11.5, weight: 700, fill: INK2 }); return; }
        rect(svg, x, y + 34 + (i - 1) * 46, w, 38, { fill: f, fillStyle: 'solid', strokeWidth: 1 }); T(svg, x + w + 20, y + 58 + (i - 1) * 46, t, { size: 11.5, weight: 700 });
      });
      T(svg, x, y + 200, 'Tungsten Coastal: protected twice. Recess kit in powder-coated 316 stainless, IPX5.', { size: 10.5, fill: INK2 });
      T(svg, x, y + 216, 'For coastal homes and venues; not for marine craft (Platinum Electric Marine covers vessels).', { size: 10.5, fill: INK2 });
    },
    smart(svg) {
      const cx = 340, cy = 160;
      const box = (x, y, w, h, t, sub, f) => { rect(svg, x - w / 2, y - h / 2, w, h, { fill: f || '#fff', fillStyle: 'solid' }); T(svg, x, y - (sub ? 2 : -4), t, { size: 11.5, anchor: 'middle', weight: 700 }); if (sub) T(svg, x, y + 13, sub, { size: 9.5, anchor: 'middle', fill: STEEL }); };
      box(cx, cy, 170, 54, 'Affinity Smart-Heat', 'On/Off · Dimmer · Eclipse', WASH);
      box(cx, 40, 170, 44, 'Bromic app', 'zones · schedules · timers');
      [['Alexa', 90, 70], ['Google Assistant', 590, 70], ['Control4', 70, 250], ['Crestron', 230, 300], ['Lutron', 450, 300], ['BMS · 0–10 V', 610, 250]].forEach(([t, x, y]) => { crisp(svg, cx, cy, x, y, STEEL, 0.9, '3 3'); box(x, y, 124, 34, t); });
      crisp(svg, cx, cy - 27, cx, 62, INK, 1.1);
      [['Tungsten', 210], ['Platinum', 340], ['Eclipse', 470]].forEach(([t, x]) => { crisp(svg, cx, cy + 27, x, 222, FLAME, 1.2); circ(svg, x, 222, 8, { fill: FLAME, fillStyle: 'solid', stroke: FINK }); T(svg, x, 244, t, { size: 10.5, anchor: 'middle', weight: 700, fill: FINK }); });
    },
    colours(svg) {
      const sw = (x, y, f, t, sub, b) => { rect(svg, x, y, 86, 56, { fill: f, fillStyle: 'solid', stroke: b || INK, strokeWidth: 1 }); T(svg, x + 43, y + 74, t, { size: 10.5, anchor: 'middle', weight: 700 }); if (sub) T(svg, x + 43, y + 88, sub, { size: 9.5, anchor: 'middle', fill: STEEL }); };
      T(svg, 20, 24, 'Tungsten Select finishes', { size: 11, weight: 700, fill: FINK });
      sw(20, 36, '#1E1E1E', 'Black'); sw(120, 36, '#FAFAF8', 'White', null, STEEL); sw(220, 36, '#55585B', 'Graphite', '4 and 6 kW');
      T(svg, 360, 24, 'Frames they sit under', { size: 11, weight: 700, fill: FINK });
      (window.FRAMES || []).slice(0, 4).forEach((f, i) => sw(360 + i * 82, 36, f[1], f[0], f[2]));
    },
    ladder(svg) {
      const tiers = [['Good', 'Tungsten Classic', 'Affordable power, honest style', 1], ['Better', 'Tungsten Select', 'Slim single post, three finishes, recess kit', 2], ['Best', 'Platinum', 'The architectural heater', 3]];
      tiers.forEach(([t, n, d, k], i) => { const x = 30 + i * 160, h = 50 + k * 50; rect(svg, x, 250 - h, 140, h, { fill: k === 3 ? WASH : PAPER2, fillStyle: 'solid', stroke: k === 3 ? FINK : INK }); T(svg, x + 70, 250 - h + 22, t.toUpperCase(), { size: 10, anchor: 'middle', weight: 700, fill: FINK }); T(svg, x + 70, 250 - h + 44, n, { size: 15, anchor: 'middle', serif: true }); d.split(', ').forEach((dd, j) => T(svg, x + 70, 250 - h + 62 + j * 13, dd, { size: 9.5, anchor: 'middle', fill: INK2 })); });
      const x = 520; rect(svg, x, 100, 150, 150, { fill: '#fff', fillStyle: 'solid', stroke: INK }); T(svg, x + 75, 122, 'THE CENTRE', { size: 10, anchor: 'middle', weight: 700, fill: FINK }); T(svg, x + 75, 144, 'Eclipse', { size: 15, anchor: 'middle', serif: true });
      ['Heat and light', 'from one pendant', 'on the centre beam'].forEach((d, j) => T(svg, x + 75, 162 + j * 13, d, { size: 9.5, anchor: 'middle', fill: INK2 }));
      ell(svg, x + 75, 222, 70, 14, { fill: '#1E1E1E', fillStyle: 'solid' }); crisp(svg, x + 75, 198, x + 75, 215, INK, 2);
      line(svg, 20, 252, 680, 252, { strokeWidth: 1.2 });
      T(svg, 20, 272, 'Value', { size: 10, fill: STEEL }); T(svg, 470, 272, 'Architecture', { size: 10, anchor: 'end', fill: STEEL });
      crisp(svg, 60, 268, 420, 268, STEEL, 0.9); poly(svg, [[420, 264], [428, 268], [420, 272]], { fill: STEEL, fillStyle: 'solid', strokeWidth: 0.5 });
    },
  };

  function draw() {
    document.querySelectorAll('svg[data-diag]').forEach(svg => { const k = svg.dataset.diag; if (D[k]) D[k](svg); });
    document.querySelectorAll('svg[data-pergola]').forEach(svg => pergola(svg, JSON.parse(svg.dataset.pergola)));
    document.querySelectorAll('svg[data-beam]').forEach(svg => beamDetail(svg, JSON.parse(svg.dataset.beam)));
    window.__ready = true;
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw); else window.addEventListener('load', draw);
})();
