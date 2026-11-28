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
    const W = 700, H = 380, x0 = 66, floor = 336;
    const span = p.span, s = Math.min((W - 2 * x0 - 150) / (span + 2 * p.post), (floor - 60) / (p.clear + p.beamH + 6));
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
    if (p.low) { // too low for ceiling heaters: wall-mount on the posts' inner faces at 6.5 ft, aimed in
      const yw = floor - 84 * s;
      rect(svg, xl + p.post * s, yw - 1.5 * s, 7 * s, 1.2 * s, { fill: INK, fillStyle: 'solid', strokeWidth: 0.6 });
      const g = el('g', { transform: `rotate(28 ${xl + p.post * s + 7 * s} ${yw})` }, svg);
      add(g, R(svg).rectangle(xl + p.post * s + 7 * s, yw, 4 * s, 2.4 * s, O({ fill: INK, fillStyle: 'solid', strokeWidth: 0.8 })));
      rect(svg, xr - p.post * s - 7 * s, yw - 1.5 * s, 7 * s, 1.2 * s, { fill: '#9AA0A6', fillStyle: 'solid', strokeWidth: 0.6 });
      const g2 = el('g', { transform: `rotate(-28 ${xr - p.post * s - 7 * s} ${yw})` }, svg);
      add(g2, R(svg).rectangle(xr - p.post * s - 11 * s, yw, 4 * s, 2.4 * s, O({ fill: '#2B2B2B', fillStyle: 'solid', strokeWidth: 0.8 })));
      table(svg, mid, floor, s);
      T(svg, xl + p.post * s + 10, yw + 40, 'Tungsten Select', { size: 11, weight: 700 });
      T(svg, xl + p.post * s + 10, yw + 54, 'wall bracket, 6 ft up', { size: 10, fill: STEEL });
      T(svg, xr - p.post * s - 10, yw + 40, 'Platinum', { size: 11, anchor: 'end', weight: 700 });
      T(svg, xr - p.post * s - 10, yw + 54, 'wall bracket', { size: 10, anchor: 'end', fill: STEEL });
      T(svg, mid, ybeamT - 10, 'Under 8 ft clear: no ceiling heaters', { size: 10.5, anchor: 'middle', weight: 700, fill: FINK });
    } else {
    const tb = tungstenElev(svg, tx, ybeamB, s, { L: p.tL || 45, post: 4, fin: p.tfin });
    const eb = eclipseElev(svg, mid, ybeamB, s, { pole: p.ePole || 8 });
    if (p.platRecess) platinumRecess(svg, px, ybeamB, s, { L: 33.1 }); else platinumElev(svg, px, ybeamB, s, { L: 33.1, pole: 8 });
    table(svg, tx, floor, s); table(svg, mid, floor, s); table(svg, px, floor, s);
    T(svg, tx, ybeamT - 10, 'Tungsten Select', { size: 11, anchor: 'middle', weight: 700 });
    T(svg, mid, ybeamT - 10, 'Eclipse', { size: 11, anchor: 'middle', weight: 700 });
    T(svg, px, ybeamT - 10, 'Platinum', { size: 11, anchor: 'middle', weight: 700 });
    }
    // dimensions
    dim(svg, xl + p.post * s, floor - 46 * s, xr - p.post * s, floor - 46 * s, p.spanLabel || `${p.span} in between posts`, { below: false });
    dim(svg, xr + 18, ybeamB, xr + 18, floor, p.clearLabel || `${p.clear} in clear`);
    dim(svg, xl - 14, ybeamT, xl - 14, ybeamB, p.beamLabel || `${p.beamH} in`, { left: true });
    if (!p.low) { crisp(svg, xl, floor - 96 * s, xr, floor - 96 * s, FLAME, 0.8, '2 5');
    T(svg, xl + p.post * s + 6, floor - 96 * s + 13, '8 ft: lowest ceiling-heater mount', { size: 9.5, fill: FINK }); }
  }
  // beam detail: beam profile section with Tungsten section on single post below, both to one scale
  function beamDetail(svg, p) {
    const s = p.ds || 6.5, cx = 150, y0 = 28;
    const bw = p.beamW * s, bh = p.beamH * s;
    rect(svg, cx - bw / 2, y0, bw, bh, { fill: '#EDEDEB', fillStyle: 'solid' });
    if (p.gutter) rect(svg, cx - bw / 2 + 0.25 * s, y0 + 0.25 * s, bw * 0.45, bh * 0.45, { stroke: STEEL, strokeWidth: 0.8, fill: '#fff', fillStyle: 'solid' });
    if (p.slot) { rect(svg, cx - 0.6 * s, y0 + bh - 0.7 * s, 1.2 * s, 0.7 * s, { stroke: FINK, strokeWidth: 0.9, fill: '#fff', fillStyle: 'solid' }); }
    const t = tungstenSection(svg, cx, y0 + bh, s, { post: 4 });
    rect(svg, cx - 2.0 * s, y0 + bh, 4 * s, 0.5 * s, { fill: INK, fillStyle: 'solid', strokeWidth: 0.6 });
    dim(svg, cx - bw / 2, y0 - 12, cx + bw / 2, y0 - 12, `${p.beamW} in`);
    dim(svg, cx + bw / 2 + 14, y0, cx + bw / 2 + 14, y0 + bh, `${p.beamH} in`);
    dim(svg, cx - t.w / 2, t.bottom + 16, cx + t.w / 2, t.bottom + 16, '7.2 in', { below: true });
    callout(svg, cx + 0.5 * s, y0 + bh + 2 * s, 280, y0 + bh + 26, 'Single post|wiring runs inside it', {});
    callout(svg, cx, y0 + bh + 0.2 * s, 280, y0 + bh - 16, 'Plate 2.5 × 4 in|fixed to the beam', {});
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
      const x = 10, y = 14, w = 200;
      [['Salt air and sun', '#fff', STEEL], ['Corrosion-resistant coating', '#3A3A3A', '#fff'], ['316 marine-grade stainless steel', '#9AA0A6', INK], ['IPX5 heater body', '#C9CED3', INK]].forEach(([t, f, c], i) => {
        if (i === 0) { for (let k = 0; k < 9; k++) { const xx = x + 20 + k * 32; crisp(svg, xx, y, xx + 10, y + 26, STEEL, 1, '2 4'); } T(svg, x + w + 14, y + 18, t, { size: 13, weight: 700, fill: INK2 }); return; }
        rect(svg, x, y + 34 + (i - 1) * 46, w, 38, { fill: f, fillStyle: 'solid', strokeWidth: 1 }); T(svg, x + w + 14, y + 58 + (i - 1) * 46, t, { size: 13, weight: 700 });
      });

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
      T(svg, 20, 272, 'Value', { size: 10, fill: STEEL }); T(svg, 436, 272, 'Architecture', { size: 10, fill: STEEL });
      crisp(svg, 60, 268, 420, 268, STEEL, 0.9); poly(svg, [[420, 264], [428, 268], [420, 272]], { fill: STEEL, fillStyle: 'solid', strokeWidth: 0.5 });
    },
  };


  /* ---------- isometric pergola types (feet; x right-down, y left-down, z up) ---------- */
  function isoScene(svg, boxes, o) {
    const c = 0.866, sn = 0.5, vb = svg.viewBox.baseVal, VW = vb.width, VH = vb.height;
    const U = (x, y, z) => [(x - y) * c, (x + y) * sn - z];
    const pts = []; boxes.forEach(b => { for (const dx of [0, b.w]) for (const dy of [0, b.d]) for (const dz of [0, b.h]) pts.push(U(b.x + dx, b.y + dy, b.z + dz)); });
    if (o.ground) { const [W, D] = o.ground; [[-1, -1], [W + 1, -1], [W + 1, D + 1], [-1, D + 1]].forEach(([x, y]) => pts.push(U(x, y, 0))); }
    if (o.wall) { const [W, H] = o.wall; pts.push(U(-0.2, -0.2, H), U(W + 0.4, -0.2, H)); }
    const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const k = Math.min((VW - 16) / (x1 - x0), (VH - 12) / (y1 - y0)), ox = (VW - (x1 - x0) * k) / 2 - x0 * k, oy = (VH - (y1 - y0) * k) / 2 - y0 * k;
    const P = (x, y, z) => { const u = U(x, y, z); return [ox + u[0] * k, oy + u[1] * k]; };
    // ground
    if (o.ground) { const [W, D] = o.ground; poly(svg, [P(-1, -1, 0), P(W + 1, -1, 0), P(W + 1, D + 1, 0), P(-1, D + 1, 0)], { stroke: LINE, fill: PAPER2, fillStyle: 'solid', strokeWidth: 0.8, roughness: 0.6 }); }
    if (o.wall) { const [W, H] = o.wall; poly(svg, [P(-0.2, -0.2, 0), P(W + 0.4, -0.2, 0), P(W + 0.4, -0.2, H), P(-0.2, -0.2, H)], { stroke: STEEL, fill: '#E9E6E1', fillStyle: 'hachure', hachureGap: 6, hachureAngle: 60, strokeWidth: 0.8 }); }
    boxes.slice().sort((a, b) => (a.x + a.w / 2 + a.y + a.d / 2 + (a.z + a.h / 2) * 0.3) - (b.x + b.w / 2 + b.y + b.d / 2 + (b.z + b.h / 2) * 0.3)).forEach(b => {
      const { x, y, z, w, d, h } = b, f = b.f || '#F2F2F0', g = b.g || '#DADAD6', t = b.t || '#FFFFFF', sw = b.sw || 0.9;
      poly(svg, [P(x + w, y, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x + w, y, z + h)], { fill: f, fillStyle: 'solid', strokeWidth: sw, roughness: 0.5 });
      poly(svg, [P(x, y + d, z), P(x + w, y + d, z), P(x + w, y + d, z + h), P(x, y + d, z + h)], { fill: g, fillStyle: 'solid', strokeWidth: sw, roughness: 0.5 });
      poly(svg, [P(x, y, z + h), P(x + w, y, z + h), P(x + w, y + d, z + h), P(x, y + d, z + h)], { fill: t, fillStyle: 'solid', strokeWidth: sw, roughness: 0.5 });
      if (b.glow) { const a = P(x + 0.15 * w, y + d, z), bb = P(x + 0.85 * w, y + d, z); crisp(svg, a[0], a[1] + 1, bb[0], bb[1] + 1, FLAME, 3); }
      if (b.disc) { const [cx, cy] = P(x + w / 2, y + d / 2, z); ell(svg, cx, cy + 1, w * k * 1.2, w * k * 0.62, { fill: INK, fillStyle: 'solid', strokeWidth: 0.8 }); ell(svg, cx, cy + 3, w * k * 1.05, w * k * 0.5, { stroke: '#F6C35C', strokeWidth: 2, roughness: 0.3 }); }
    });
    (o.labels || []).forEach(([x, y, z, tx, ty, t]) => { const [px, py] = P(x, y, z); callout(svg, px, py, tx, ty, t, { size: 10.5, anchor: tx < px ? 'end' : 'start' }); });
    return P;
  }
  const FR = { f: '#E4E4E1', g: '#CFCFCB', t: '#F7F7F5' }, DK = { f: '#3A3A3A', g: '#2A2A2A', t: '#4A4A4A' }, TIM = { f: '#C9A27A', g: '#A9825C', t: '#D9B68E' };
  const HT = (x, y, z, w = 4.7) => Object.assign({ x, y, z, w, d: 0.6, h: 0.32, glow: 1, sw: 0.7 }, DK);
  function frame(W, D, H, o = {}) {
    const m = o.mat || FR, p = o.post || 0.5, bh = o.bh || 0.7, out = [];
    if (!o.attached) out.push(Object.assign({ x: 0, y: 0, z: 0, w: p, d: p, h: H }, m));
    out.push(Object.assign({ x: W - p, y: 0, z: 0, w: p, d: p, h: o.attached ? 0 : H }, m));
    out.push(Object.assign({ x: 0, y: D - p, z: 0, w: p, d: p, h: H }, m), Object.assign({ x: W - p, y: D - p, z: 0, w: p, d: p, h: H }, m));
    out.push(Object.assign({ x: 0, y: 0, z: H, w: W, d: p, h: bh }, m), Object.assign({ x: 0, y: D - p, z: H, w: W, d: p, h: bh }, m));
    out.push(Object.assign({ x: 0, y: 0, z: H, w: p, d: D, h: bh }, m), Object.assign({ x: W - p, y: 0, z: H, w: p, d: D, h: bh }, m));
    return out.filter(b => b.h > 0);
  }
  const TYPES = {
    louvered(svg) { const W = 12, D = 10, H = 8.6, b = frame(W, D, H);
      for (let x = 0.9; x < W - 0.6; x += 0.75) b.push({ x, y: 0.5, z: H + 0.15, w: 0.45, d: D - 1, h: 0.12, f: '#ECECEA', g: '#D8D8D4', t: '#FAFAF8', sw: 0.5 });
      b.push(HT(3.6, D - 1.3, H - 0.55), HT(3.6, 0.6, H - 0.55));
      isoScene(svg, b, { ground: [W, D], ox: 170, oy: 40, k: 13 }); },
    attached(svg) { const W = 12, D = 9, H = 8.4, b = frame(W, D, H, { attached: true, mat: DK });
      for (let y = 1; y < D - 0.6; y += 0.75) b.push({ x: 0.5, y, z: H + 0.15, w: W - 1, d: 0.45, h: 0.12, f: '#555', g: '#444', t: '#666', sw: 0.5 });
      b.push(Object.assign({ x: 0.1, y: 2.5, z: 6.3, w: 0.5, d: 4.7, h: 0.32, glow: 0 }, DK));
      b.push(HT(3.2, D - 1.2, H - 0.55));
      const P = isoScene(svg, b, { wall: [W, 10], ground: [W, D], ox: 175, oy: 38, k: 13 }); },
    timber(svg) { const W = 12, D = 10, H = 8.8, b = frame(W, D, H, { mat: TIM, post: 0.55, bh: 0.9 });
      for (let x = 0.8; x < W - 0.5; x += 1.1) b.push(Object.assign({ x, y: -0.4, z: H + 0.9, w: 0.25, d: D + 0.8, h: 0.5, sw: 0.6 }, TIM));
      b.push(HT(3.6, D - 1.4, H - 0.6));
      isoScene(svg, b, { ground: [W, D], ox: 170, oy: 34, k: 13 }); },
    pavilion(svg) { const W = 12, D = 10, H = 8.6, b = frame(W, D, H, { mat: TIM });
      b.push({ x: -0.3, y: -0.3, z: H + 0.7, w: W + 0.6, d: D + 0.6, h: 0.45, f: '#BBB6AE', g: '#A39E96', t: '#D4CFC6' });
      b.push({ x: 2.5, y: 3.2, z: H + 0.68, w: 4.7, d: 0.6, h: 0.02, f: INK, g: INK, t: INK, glow: 1 }, { x: 2.5, y: 6.4, z: H + 0.68, w: 4.7, d: 0.6, h: 0.02, f: INK, g: INK, t: INK, glow: 1 });
      isoScene(svg, b, { ground: [W, D], ox: 170, oy: 34, k: 13 }); },
    fabric(svg) { const W = 12, D = 10, H = 8.4, b = frame(W, D, H, { mat: DK });
      b.push({ x: 0.5, y: 0.5, z: H + 0.55, w: W - 1, d: D - 1, h: 0.05, f: '#EFE9DE', g: '#E6DFD2', t: '#F6F1E8', sw: 0.6 });
      b.push(Object.assign({ x: W - 0.95, y: 3, z: 6.4, w: 0.45, d: 4.7, h: 0.32, glow: 0 }, DK));
      isoScene(svg, b, { ground: [W, D], ox: 170, oy: 36, k: 13 }); },
    hospitality(svg) { const W = 20, D = 12, H = 9.4, b = frame(W, D, H);
      b.push({ x: W / 2 - 0.25, y: 0, z: H, w: 0.5, d: D, h: 0.7, f: '#E4E4E1', g: '#CFCFCB', t: '#F7F7F5' });
      for (let x = 0.9; x < W - 0.6; x += 0.9) if (Math.abs(x - W / 2) > 0.5) b.push({ x, y: 0.5, z: H + 0.15, w: 0.5, d: D - 1, h: 0.1, f: '#ECECEA', g: '#D8D8D4', t: '#FAFAF8', sw: 0.45 });
      b.push(HT(2.2, D - 1.3, H - 0.55), HT(12.8, D - 1.3, H - 0.55), HT(2.2, 0.6, H - 0.55), HT(12.8, 0.6, H - 0.55));
      b.push({ x: W / 2 - 0.9, y: D / 2 - 0.9, z: H - 2.3, w: 1.8, d: 1.8, h: 0.1, f: INK, g: INK, t: INK, disc: 1 });
      isoScene(svg, b, { ground: [W, D], ox: 165, oy: 26, k: 9.6 }); },
  };


  /* ---------- pergola types as elevations (inches) ---------- */
  function typeElev(svg, p) {
    const vb = svg.viewBox.baseVal, VW = vb.width, VH = vb.height, floor = VH - 14;
    const span = p.span || 144, H = p.H || 108, post = 5, s = Math.min((VW - 60) / (span + 2 * post), (floor - 30) / (H + 24));
    const xl = (VW - (span + 2 * post) * s) / 2, xr = xl + (span + 2 * post) * s, yb = floor - H * s;
    const fr = p.mat === 'timber' ? { fill: '#D9B68E', fillStyle: 'hachure', hachureGap: 3, stroke: '#7A5534' } : p.mat === 'dark' ? { fill: '#3A3A3A', fillStyle: 'solid' } : { fill: '#EDEDEB', fillStyle: 'solid' };
    line(svg, 6, floor, VW - 6, floor, { stroke: INK2, strokeWidth: 1.1 });
    for (let x = 10; x < VW - 10; x += 12) crisp(svg, x, floor + 1, x - 7, floor + 8, LINE, 0.7);
    const bh = (p.bh || 8) * s;
    if (p.wall) { rect(svg, xl - 14, floor - (H + 40) * s, 14 + post * s, (H + 40) * s, { fill: '#E9E6E1', fillStyle: 'hachure', hachureGap: 5, stroke: STEEL }); }
    else rect(svg, xl, yb - bh, post * s, floor - yb + bh, fr);
    rect(svg, xr - post * s, yb - bh, post * s, floor - yb + bh, fr);
    if (p.bays) for (let i = 1; i < p.bays; i++) { const x = xl + (xr - xl) * i / p.bays - post * s / 2; rect(svg, x, yb - bh, post * s, floor - yb + bh, fr); }
    if (p.type === 'pavilion') { rect(svg, xl - 10, yb - 16 * s, xr - xl + 20, 16 * s, { fill: '#C9C4BC', fillStyle: 'solid' }); }
    else rect(svg, xl, yb - bh, xr - xl, bh, fr);
    if (p.type === 'louvered') { for (let x = xl + 10; x < xr - 6; x += 8 * s) line(svg, x - 2.6 * s, yb - bh * 0.75, x + 2.6 * s, yb - bh * 0.9, { stroke: STEEL, strokeWidth: 1.3, roughness: 0.4 }); }
    if (p.type === 'timber') { for (let x = xl - 6; x < xr + 6; x += 16 * s) rect(svg, x, yb - bh - 7 * s, 2 * s, 7 * s, { fill: '#D9B68E', fillStyle: 'solid', stroke: '#7A5534', strokeWidth: 0.7 }); line(svg, xl - 12, yb - bh - 7 * s, xr + 12, yb - bh - 7 * s, { stroke: '#7A5534' }); }
    if (p.type === 'fabric') { const pts = []; for (let i = 0; i <= 12; i++) { const x = xl + (xr - xl) * i / 12; pts.push([x, yb - bh - 6 - Math.sin(i / 12 * Math.PI * 6) * 2.5]); } add(svg, R(svg).linearPath(pts, O({ stroke: '#B8A98C', strokeWidth: 2 }))); }
    const tbl = (f) => table(svg, xl + (xr - xl) * f, floor, s);
    (p.heaters || []).forEach(([k, f]) => {
      const x = xl + (xr - xl) * f;
      if (k === 't') tungstenElev(svg, x, yb, s, { L: 45, post: 4 });
      if (k === 'e') eclipseElev(svg, x, yb, s, { pole: 8 });
      if (k === 'p') platinumElev(svg, x, yb, s, { L: 33.1, pole: 8 });
      if (k === 'r') { const L = 45 * s; line(svg, x - L / 2, yb - 1, x + L / 2, yb - 1, { stroke: INK, strokeWidth: 4, roughness: 0.2 }); line(svg, x - L / 2 + 4, yb + 1.5, x + L / 2 - 4, yb + 1.5, { stroke: FLAME, strokeWidth: 2.2, roughness: 0.2 }); }
      if (k === 'wl' || k === 'wr') { const left = k === 'wl', px = left ? xl + post * s : xr - post * s, y = floor - 84 * s, d = left ? 1 : -1;
        line(svg, px, y, px + d * 7 * s, y, { strokeWidth: 2.2 });
        const g = el('g', { transform: `rotate(${left ? 30 : -30} ${px + d * 7 * s} ${y})` }, svg);
        add(g, R(svg).rectangle(left ? px + 7 * s : px - 7 * s - 33 * s, y, 33 * s, Math.max(3 * s, 6), O({ fill: f > 0.5 ? '#2B2B2B' : INK, fillStyle: 'solid', strokeWidth: 0.8 }))); }
    });
    (p.tables || [0.5]).forEach(tbl);
    T(svg, xr + 6, yb + 4, p.H === 92 ? '' : '', { size: 9 });
  }

  /* ---------- generic beam types (inches, to one scale) ---------- */
  function beamType(svg, p) {
    const s = 7.2, cx = 110, y0 = 34, bw = p.w * s, bh = p.h * s;
    const fill = p.timber ? '#D9B68E' : p.steel ? '#9AA0A6' : '#EDEDEB';
    rect(svg, cx - bw / 2, y0, bw, bh, { fill, fillStyle: p.timber ? 'hachure' : 'solid', hachureGap: 4 });
    if (p.gutter) rect(svg, cx - bw / 2 + 2, y0 + 2, bw * 0.5, bh * 0.4, { stroke: STEEL, strokeWidth: 0.7, fill: '#fff', fillStyle: 'solid' });
    if (p.channel) rect(svg, cx - 0.7 * s, y0 + bh - 0.8 * s, 1.4 * s, 0.8 * s, { stroke: FINK, strokeWidth: 0.9, fill: '#fff', fillStyle: 'solid' });
    rect(svg, cx - 2 * s, y0 + bh, 4 * s, 0.5 * s, { fill: INK, fillStyle: 'solid', strokeWidth: 0.6 });
    const t = tungstenSection(svg, cx, y0 + bh + 0.5 * s, s, { post: 4 });
    dim(svg, cx - bw / 2, y0 - 9, cx + bw / 2, y0 - 9, p.wl, { size: 10 });
    dim(svg, cx + bw / 2 + 10, y0, cx + bw / 2 + 10, y0 + bh, p.hl, { size: 10 });
    T(svg, cx, t.bottom + 18, 'Tungsten on its single post', { size: 9.5, anchor: 'middle', fill: STEEL });
  }

  /* ---------- Series I vs II front elevations, one scale (mm) ---------- */
  D.front = function (svg) {
    const s = 0.3, x0 = 40;
    [[40, 'Series I · 3 and 6 kW', 1410, true], [150, 'Series II · 3 and 6 kW', 1436, false]].forEach(([y, n, L, old]) => {
      line(svg, x0 - 20, y, x0 + L * s + 20, y, { stroke: STEEL, strokeWidth: 1 });
      if (old) { rect(svg, x0 + 0.2 * L * s, y, 12, 26, { fill: STEEL, fillStyle: 'solid', strokeWidth: 0.6 }); rect(svg, x0 + 0.8 * L * s - 12, y, 12, 26, { fill: STEEL, fillStyle: 'solid', strokeWidth: 0.6 }); }
      else rect(svg, x0 + L * s / 2 - 8, y, 16, 26, { fill: INK, fillStyle: 'solid', strokeWidth: 0.6 });
      rect(svg, x0, y + 26, L * s, 36, { fill: old ? STEEL : INK, fillStyle: 'solid' });
      line(svg, x0 + 30, y + 58, x0 + L * s - 30, y + 58, { stroke: FLAME, strokeWidth: 2.6, roughness: 0.3 });
      dim(svg, x0, y + 78, x0 + L * s, y + 78, `${L} mm`, { below: true, size: 11 });
      T(svg, x0 + L * s + 34, y + 50, n, { size: 13, weight: 700, fill: old ? STEEL : INK });
      T(svg, x0 + L * s + 34, y + 66, old ? 'two suspension tubes' : 'one single post', { size: 11, fill: INK2 });
    });
  };
  D.pitchedOld = function (svg) {
    poly(svg, [[20, 90], [180, 20], [180, 90]], { fill: '#EDEDEB', fillStyle: 'solid' });
    rect(svg, 116, 40, 26, 22, { fill: INK, fillStyle: 'solid', strokeWidth: 0.6 }); rect(svg, 124, 62, 10, 18, { fill: INK, fillStyle: 'solid', strokeWidth: 0.6 }); rect(svg, 70, 80, 120, 14, { fill: INK, fillStyle: 'solid' });
    T(svg, 100, 116, '3/12 to 12/12 roof pitch', { size: 11, anchor: 'middle', fill: INK2 });
  };


  /* ---------- mounting heights chart (feet) ---------- */
  D.heights = function (svg) {
    const rows = (window.HEIGHTS || []), x0 = 70, y0 = 330, ft = 24, bw = 70, gap = 26;
    line(svg, x0 - 10, y0, x0 + rows.length * (bw + gap), y0, { strokeWidth: 1.4 });
    for (let f = 0; f <= 12; f += 2) { const y = y0 - f * ft; crisp(svg, x0 - 14, y, x0 + rows.length * (bw + gap) - gap, y, f ? '#EEE' : INK2, 0.8); T(svg, x0 - 20, y + 4, f + ' ft', { size: 11, anchor: 'end', fill: STEEL }); }
    crisp(svg, x0 - 14, y0 - 6 * ft, x0 + rows.length * (bw + gap) - gap, y0 - 6 * ft, FLAME, 1, '4 4');
    T(svg, x0 + rows.length * (bw + gap) - gap, y0 - 6 * ft - 6, 'wall or post mounts from 6 ft', { size: 10.5, anchor: 'end', fill: FINK });
    rows.forEach(([name, lo, hi], i) => {
      const x = x0 + i * (bw + gap);
      rect(svg, x, y0 - hi * ft, bw, (hi - lo) * ft, { fill: FLAME, fillStyle: 'hachure', hachureGap: 4, stroke: FINK, strokeWidth: 1.2 });
      rect(svg, x + 6, y0 - hi * ft - 10, bw - 12, 8, { fill: INK, fillStyle: 'solid', strokeWidth: 0.6 });
      T(svg, x + bw / 2, y0 - hi * ft - 18, `${lo}–${hi} ft`, { size: 13, anchor: 'middle', weight: 700, fill: FINK });
      name.split('|').forEach((l, j) => T(svg, x + bw / 2, y0 + 18 + j * 14, l, { size: 11, anchor: 'middle', fill: INK, weight: j ? 400 : 700 }));
    });
    // a table and chair at the left for scale
  };

  D.prewire = function (svg) {
    const x0 = 40, sc = 0.15;
    [['Pre-wire at build', 200, 400, false], ['Retrofit later', 600, 1200, true]].forEach(([n, lo, hi, hl], i) => {
      const y = 40 + i * 90;
      T(svg, x0, y - 8, n, { size: 14, weight: 700 });
      rect(svg, x0, y, lo * sc * 2, 34, { fill: hl ? FLAME : STEEL, fillStyle: hl ? 'hachure' : 'cross-hatch', hachureGap: 5, stroke: hl ? FINK : INK2 });
      rect(svg, x0 + lo * sc * 2, y, (hi - lo) * sc * 2, 34, { fill: hl ? '#F6B8A8' : '#C9CDD1', fillStyle: 'hachure', hachureGap: 7, stroke: hl ? FINK : INK2, strokeWidth: 0.8 });
      T(svg, x0 + hi * sc * 2 + 12, y + 24, '$' + lo.toLocaleString() + '–$' + hi.toLocaleString(), { size: 20, serif: true, fill: hl ? FINK : INK });
    });
  };

  /* ---------- crisp technical drawing helpers (no roughness) ---------- */
  function cr(svg, x, y, w, h, f = '#EEE', st = INK, sw = 1) { return el('rect', { x, y, width: w, height: h, fill: f, stroke: st, 'stroke-width': sw }, svg); }
  function cl(svg, x1, y1, x2, y2, st = INK, sw = 1, dash) { const l = el('line', { x1, y1, x2, y2, stroke: st, 'stroke-width': sw }, svg); if (dash) l.setAttribute('stroke-dasharray', dash); return l; }
  function cp(svg, pts, f = '#EEE', st = INK, sw = 1) { return el('polygon', { points: pts.map(p => p.join(',')).join(' '), fill: f, stroke: st, 'stroke-width': sw }, svg); }
  function marker(svg, x, y, n) { el('circle', { cx: x, cy: y, r: 11, fill: FLAME }, svg); T(svg, x, y + 4, String(n), { size: 12, anchor: 'middle', fill: '#fff', weight: 700, halo: false }); }
  function hatch(svg, x, y, w, h) { for (let i = -h; i < w; i += 5) cl(svg, x + Math.max(0, i), y + Math.max(0, -i), x + Math.min(w, i + h), y + Math.min(h, h - (i + h - w > 0 ? i + h - w : 0)), '#B9B9B5', 0.5); }

  D.pitched = function (svg) {
    // 6/12 roof (26.6 deg): rafter line, the adaptor wedge on the slope, vertical post, level heater
    const a = Math.atan(6 / 12), x1 = 10, y1 = 112, x2 = 200, y2 = y1 - (x2 - x1) * Math.tan(a);
    cp(svg, [[x1, y1], [x2, y2], [x2, y2 - 12], [x1, y1 - 12]], '#E4E2DE', INK2, 1);
    const cx = 110, cy = y1 - (cx - x1) * Math.tan(a);
    const wl = cx - 16, wr = cx + 16, yl = y1 - (wl - x1) * Math.tan(a), yr = y1 - (wr - x1) * Math.tan(a), yb = Math.max(yl, yr) + 6;
    cp(svg, [[wl, yl], [wr, yr], [wr, yb], [wl, yb]], INK, INK, 1);
    cr(svg, cx - 4, yb, 8, 26, INK, INK, 1);
    cr(svg, cx - 70, yb + 26, 140, 12, INK, INK, 1);
    cl(svg, cx - 58, yb + 37, cx + 58, yb + 37, FLAME, 2.6);
    T(svg, x1 + 4, y1 - 18, '6/12 pitch', { size: 10, fill: STEEL });
    T(svg, cx + 24, yb - 2, 'adaptor', { size: 10, fill: STEEL });
  };

  D.value = function (svg) {
    const box = (x, y, w, t, sub, hl) => { cr(svg, x, y, w, 52, hl ? WASH : '#F5F5F4', hl ? FINK : '#D6D6D2', 1); T(svg, x + w / 2, y + 22, t, { size: 13, anchor: 'middle', weight: 700, halo: false }); if (sub) T(svg, x + w / 2, y + 40, sub, { size: 10.5, anchor: 'middle', fill: STEEL, halo: false }); };
    const arr = (x1, y, x2) => { cl(svg, x1, y, x2 - 6, y, FINK, 1.6); cp(svg, [[x2 - 8, y - 5], [x2, y], [x2 - 8, y + 5]], FINK, FINK, 1); };
    T(svg, 10, 22, 'THE HOMEOWNER', { size: 11, weight: 700, fill: FINK, halo: false });
    [['Heat on the quote', 'planned in, not bolted on'], ['More evenings', 'spring, autumn and winter'], ['More use', 'of what they paid for'], ['Referrals', 'friends see it working']].forEach(([t, s], i) => { box(10 + i * 170, 34, 150, t, s, i === 2); if (i < 3) arr(160 + i * 170, 60, 180 + i * 170); });
    T(svg, 10, 132, 'THE DEALER', { size: 11, weight: 700, fill: FINK, halo: false });
    [['Heat on the quote', 'every pergola, every time'], ['A bigger ticket', 'heaters, controls, wiring'], ['More margin', 'per job, same visit'], ['Fewer callbacks', 'pre-wired, done once']].forEach(([t, s], i) => { box(10 + i * 170, 144, 150, t, s, i === 2); if (i < 3) arr(160 + i * 170, 170, 180 + i * 170); });
  };

  /* where to mount: crisp elevation of a two-bay louvered pergola with numbered mounting points */
  D.mount2 = function (svg) {
    const W = 680, floor = 250, s = 1.85, post = 6 * s, span = 300, H = 108;
    const xl = 40, xr = xl + span * s * 1.0, yb = floor - H * s, bh = 9 * s, mid = (xl + xr) / 2;
    cl(svg, 10, floor, W - 10, floor, INK, 1.2); for (let x = 14; x < W - 10; x += 9) cl(svg, x, floor + 1, x - 6, floor + 7, '#C9C9C6', 0.6);
    [xl, mid - post / 2, xr - post].forEach(x => { cr(svg, x, yb - bh, post, floor - yb + bh, '#F2F2F0', INK, 1); });
    cr(svg, xl, yb - bh, xr - xl, bh, '#F2F2F0', INK, 1);
    cr(svg, xl + 3, yb - bh + 3, 26, bh * 0.5, '#fff', STEEL, 0.6);
    for (let x = xl + post + 8; x < xr - post - 4; x += 15) { if (Math.abs(x - mid) < 10) continue; cl(svg, x - 5, yb - bh * 0.15, x + 5, yb - bh * 0.85, STEEL, 1.4); }
    // 1: Tungsten on single post under perimeter beam (left bay), angled 15 deg
    const t1 = xl + 70; cr(svg, t1 - 2, yb, 4, 8, INK, INK, 1); el('g', { transform: `rotate(-12 ${t1} ${yb + 10})` }, svg).appendChild(el('rect', { x: t1 - 40, y: yb + 8, width: 80, height: 7, fill: INK }));
    marker(svg, t1, yb + 34, 1);
    // 2: Eclipse pendant at the centre beam over a table
    cr(svg, mid - 3, yb, 2, 16, INK, INK, 1); cr(svg, mid + 1, yb, 2, 16, INK, INK, 1); cp(svg, [[mid - 26, yb + 22], [mid - 22, yb + 16], [mid + 22, yb + 16], [mid + 26, yb + 22]], INK, INK, 1); cl(svg, mid - 24, yb + 24, mid + 24, yb + 24, '#F6C35C', 2);
    marker(svg, mid + 40, yb + 34, 2);
    // 3: wall bracket on the right post
    const py = floor - 80 * s; cl(svg, xr - post, py, xr - post - 18, py, INK, 2); el('g', { transform: `rotate(28 ${xr - post - 18} ${py})` }, svg).appendChild(el('rect', { x: xr - post - 18 - 62, y: py, width: 62, height: 7, fill: INK }));
    marker(svg, xr - post - 70, py + 40, 3);
    // 4: recessed in a solid bay (right half shown with a ceiling panel)
    const r1 = mid + 70, r2 = xr - post - 24; cr(svg, r1, yb - 4, r2 - r1, 4, '#D9D7D2', INK2, 0.8); cl(svg, (r1 + r2) / 2 - 36, yb, (r1 + r2) / 2 + 36, yb, FLAME, 3);
    marker(svg, (r1 + r2) / 2, yb + 34, 4);
    // tables
    [xl + 70, mid, (r1 + r2) / 2].forEach(x => { cr(svg, x - 34, floor - 30 * s, 68, 3, STEEL, STEEL, 0.5); cl(svg, x - 28, floor - 29 * s, x - 28, floor, STEEL, 1); cl(svg, x + 28, floor - 29 * s, x + 28, floor, STEEL, 1); });
    // dims
    cl(svg, xr + 18, yb, xr + 18, floor, FINK, 0.9); cl(svg, xr + 13, yb, xr + 23, yb, FINK, 0.9); cl(svg, xr + 13, floor, xr + 23, floor, FINK, 0.9);
    T(svg, xr + 26, (yb + floor) / 2, '8 ft min.', { size: 11, fill: FINK, weight: 700 });
  };


  /* recess in a pergola: single centre beam (does not fit) vs a heater channel between two beams (fits); section, inches */
  D.channel = function (svg) {
    const s = 9, y0 = 62, dim = (x1, x2, y, t) => { cl(svg, x1, y, x2, y, FINK, 0.9); cl(svg, x1, y - 4, x1, y + 4, FINK, 0.9); cl(svg, x2, y - 4, x2, y + 4, FINK, 0.9); T(svg, (x1 + x2) / 2, y - 6, t, { size: 11, anchor: 'middle', fill: FINK, weight: 700 }); };
    const vdim = (x, y1, y2, t) => { cl(svg, x, y1, x, y2, FINK, 0.9); cl(svg, x - 4, y1, x + 4, y1, FINK, 0.9); cl(svg, x - 4, y2, x + 4, y2, FINK, 0.9); T(svg, x + 7, (y1 + y2) / 2 + 4, t, { size: 11, fill: FINK, weight: 700 }); };
    // A: single 6x10 beam with a 10 in cut-out overlaid
    const ax = 70; T(svg, ax + 30, 22, 'A · Inside one centre beam', { size: 12.5, weight: 700, anchor: 'middle', halo: false });
    cr(svg, ax, y0, 6 * s, 10 * s, '#F2F2F0', INK, 1.2);
    cr(svg, ax + 3 * s - 5 * s, y0 + 10 * s - 7.5 * s, 10 * s, 7.5 * s, 'none', FLAME, 1.4).setAttribute('stroke-dasharray', '5 4');
    dim(ax, ax + 6 * s, y0 - 6, '6 in widest beam');
    dim(ax + 3 * s - 5 * s, ax + 3 * s + 5 * s, y0 + 10 * s + 18, '10 in kit cut-out');
    T(svg, ax + 3 * s, y0 + 10 * s + 52, 'Does not fit, and beams', { size: 11.5, anchor: 'middle', fill: INK2, halo: false });
    T(svg, ax + 3 * s, y0 + 10 * s + 67, 'must not be cut or notched', { size: 11.5, anchor: 'middle', fill: INK2, halo: false });
    // B: heater channel: two 2x8 beams, clear gap, soffit, kit inside
    const bx = 330; T(svg, bx + 7 * s, 22, 'B · A heater channel between two beams', { size: 12.5, weight: 700, anchor: 'middle', halo: false });
    cr(svg, bx, y0, 2 * s, 8 * s, '#F2F2F0', INK, 1.2); cr(svg, bx + 12 * s, y0, 2 * s, 8 * s, '#F2F2F0', INK, 1.2);
    cr(svg, bx - 6, y0 + 8 * s, 14 * s + 12, 0.8 * s, '#D9D7D2', INK2, 1);
    cr(svg, bx + 2 * s + 0.4 * s, y0 + 8 * s - 7.5 * s, 10 * s - 0.8 * s, 7.5 * s, '#3A3A3A', INK, 1);
    cr(svg, bx + 2 * s - 0.6 * s, y0 + 8.8 * s, 11.2 * s, 0.5 * s, INK, INK, 1);
    cl(svg, bx + 2 * s + 6, y0 + 9.3 * s + 2, bx + 12 * s - 6, y0 + 9.3 * s + 2, FLAME, 2.6);
    dim(bx + 2 * s, bx + 12 * s, y0 - 6, '10 in clear between beams');
    vdim(bx + 14 * s + 14, y0, y0 + 8 * s, '8 in beam: room for the 7.5 in cavity');
    T(svg, bx + 7 * s, y0 + 10 * s + 34, 'Soffit closes the channel; the kit’s trim sits on it.', { size: 11.5, anchor: 'middle', fill: INK2, halo: false });
  };

  function draw() {
    window.HEIGHTS = window.HEIGHTS || [];
    document.querySelectorAll('svg[data-diag]').forEach(svg => { const k = svg.dataset.diag; if (D[k]) D[k](svg); });
    document.querySelectorAll('svg[data-pergola]').forEach(svg => pergola(svg, JSON.parse(svg.dataset.pergola)));
    document.querySelectorAll('svg[data-beam]').forEach(svg => beamDetail(svg, JSON.parse(svg.dataset.beam)));
    document.querySelectorAll('svg[data-type]').forEach(svg => typeElev(svg, JSON.parse(svg.dataset.type)));
    document.querySelectorAll('svg[data-beamtype]').forEach(svg => beamType(svg, JSON.parse(svg.dataset.beamtype)));
    window.__ready = true;
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw); else window.addEventListener('load', draw);
})();
