/* Outdoor Living Trends 2027 · North America – hand-drawn charts and diagrams (rough.js).
   Every number drawn here is in north-america-storyline.md with its source. */
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const INK = '#231F20', INK2 = '#4A4546', STEEL = '#71777D', FLAME = '#EF4123', FINK = '#C7321A', LIGHT = '#F1EDE7', LINE = '#C9C9C6';
  let seed = 11;
  const O = (o = {}) => Object.assign({ seed: seed++, roughness: 1.25, bowing: 1.1, stroke: INK, strokeWidth: 1.5 }, o);
  function el(tag, attrs, parent) { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
  function T(svg, x, y, s, o = {}) {
    const t = el('text', { x, y, 'font-size': o.size || 14, 'text-anchor': o.anchor || 'start', fill: o.fill || INK, 'font-weight': o.weight || 400,
      'font-family': o.serif ? '"Bromic Didot",Didot,serif' : '"Bromic Sans",Helvetica,Arial,sans-serif', 'letter-spacing': o.ls || 0 }, svg);
    t.textContent = s; return t;
  }
  const add = (svg, n) => (svg.appendChild(n), n);

  /* --- building blocks --- */
  function dumbbell(svg, rows, max, o = {}) {
    const rc = rough.svg(svg), x0 = o.x0 || 330, x1 = o.x1 || 820, sx = v => x0 + (x1 - x0) * v / max, gap = o.gap || 100, top = o.top || 50;
    rows.forEach((r, i) => {
      const y = top + i * gap;
      const lx = o.lx || 0, ly = o.ly || 0;
      T(svg, lx, y - 4 + ly, r.l, { size: 17, weight: 700 });
      if (r.u) T(svg, lx, y + 17 + ly, r.u, { size: 12.5, fill: STEEL });
      add(svg, rc.line(x0, y + 18, x1, y + 18, O({ stroke: LINE, strokeWidth: 1, roughness: 0.6 })));
      if (r.a != null) {
        add(svg, rc.line(sx(r.a), y, sx(r.b), y, O({ stroke: FLAME, strokeWidth: 3 })));
        add(svg, rc.circle(sx(r.a), y, 18, O({ stroke: STEEL, fill: '#fff', fillStyle: 'solid' })));
        T(svg, sx(r.a), y - 18, r.al, { size: 14, anchor: 'middle', fill: STEEL });
      }
      add(svg, rc.circle(sx(r.b), y, 24, O({ stroke: FINK, fill: FLAME, fillStyle: 'solid' })));
      T(svg, sx(r.b) + (r.a != null && r.b - r.a < max * 0.08 ? 22 : 0), y - 20, r.bl, { size: 22, anchor: r.a != null && r.b - r.a < max * 0.08 ? 'start' : 'middle', serif: true, fill: FINK });
    });
  }
  function pie(svg, cx, cy, d, pct, o = {}) {
    const rc = rough.svg(svg), a0 = -Math.PI / 2;
    add(svg, rc.circle(cx, cy, d, O({ stroke: o.ring || LINE, strokeWidth: 1.2 })));
    add(svg, rc.arc(cx, cy, d, d, a0, a0 + 2 * Math.PI * pct / 100, true, O({ stroke: o.stroke || FINK, fill: o.fill || FLAME, fillStyle: 'hachure', hachureGap: o.gap || 5, fillWeight: 1.4 })));
    if (o.label) T(svg, cx, cy + d / 2 + 40, o.label, { size: 36, anchor: 'middle', serif: true, fill: o.labelFill || FINK });
    if (o.cap) o.cap.split('|').forEach((c, i) => T(svg, cx, cy + d / 2 + 62 + i * 17, c, { size: 13, anchor: 'middle', fill: o.capFill || INK2 }));
  }
  function vbars(svg, x, base, bars, max, h, o = {}) {
    const rc = rough.svg(svg), w = o.w || 62, g = o.g || 34;
    bars.forEach((b, i) => {
      const bh = h * b.v / max, bx = x + i * (w + g);
      add(svg, rc.rectangle(bx, base - bh, w, bh, O({ stroke: b.hl ? FINK : (o.dark ? LIGHT : INK2), fill: b.hl ? FLAME : (o.dark ? '#8F8988' : STEEL), fillStyle: b.hl ? 'hachure' : 'cross-hatch', hachureGap: b.hl ? 5 : 7 })));
      T(svg, bx + w / 2, base - bh - 10, b.t, { size: o.vs || 22, anchor: 'middle', serif: true, fill: b.hl ? (o.dark ? FLAME : FINK) : (o.dark ? LIGHT : INK2) });
      (b.l || '').split('|').forEach((l, j) => T(svg, bx + w / 2, base + 18 + j * 15, l, { size: 12.5, anchor: 'middle', fill: o.dark ? '#BDB6AE' : INK2 }));
    });
    add(svg, rc.line(x - 10, base, x + bars.length * (w + g) - g + 10, base, O({ stroke: o.dark ? LIGHT : INK })));
  }
  function waffle(svg, x, y, total, n, cols, step, d, o = {}) {
    const rc = rough.svg(svg);
    for (let i = 0; i < total; i++) {
      const cx = x + (i % cols) * step, cy = y + Math.floor(i / cols) * step, on = i < n;
      if (o.square) add(svg, rc.rectangle(cx - d / 2, cy - d / 2, d, d, O({ roughness: 0.9, strokeWidth: 1, stroke: on ? FINK : (o.dark ? '#6E6867' : LINE), fill: on ? FLAME : 'none', fillStyle: 'solid' })));
      else add(svg, rc.circle(cx, cy, d, O({ roughness: 0.8, strokeWidth: 1, stroke: on ? FINK : (o.dark ? '#6E6867' : '#B8B6B2'), fill: on ? FLAME : 'none', fillStyle: 'solid' })));
    }
  }
  function people(svg, x, y, total, n, cols, step) {
    const g = el('g', { filter: 'url(#sk)' }, svg);
    for (let i = 0; i < total; i++) {
      const px = x + (i % cols) * step, py = y + Math.floor(i / cols) * step, c = i < n ? FLAME : '#C9C6C1';
      el('circle', { cx: px, cy: py, r: step * 0.16, fill: c }, g);
      el('path', { d: `M${px - step * 0.26} ${py + step * 0.6} q0 ${-step * 0.38} ${step * 0.26} ${-step * 0.38} q${step * 0.26} 0 ${step * 0.26} ${step * 0.38} z`, fill: c }, g);
    }
  }
  function hstack(svg, x, y, w, h, parts) {
    const rc = rough.svg(svg), tot = parts.reduce((s, p) => s + p.v, 0); let cx = x;
    parts.forEach((p, i) => {
      const pw = w * p.v / tot;
      add(svg, rc.rectangle(cx, y, pw, h, O({ stroke: INK, fill: p.c, fillStyle: p.s || 'hachure', hachureGap: 6 })));
      T(svg, cx + pw / 2, y + h + 20, p.t, { size: 13, anchor: 'middle', fill: INK2 });
      T(svg, cx + pw / 2, y - 10, p.n, { size: 20, anchor: 'middle', serif: true, fill: i === 2 ? FINK : INK });
      cx += pw;
    });
  }

  /* --- charts, one per shift --- */
  const CH = {
    s1(svg) {
      dumbbell(svg, [
        { l: 'Outdoor living rooms', u: 'AIA, net index, 2025 → 2026', a: 40, b: 51, al: 'net 40', bl: 'net 51' },
        { l: 'Blended indoor-outdoor space', u: 'AIA, net index, 2025 → 2026', a: 40, b: 43, al: 'net 40', bl: 'net 43' },
        { l: 'Outdoor renovators hiring a pro', u: 'Houzz, % of renovators, 2024 → 2026', a: 65, b: 71, al: '65%', bl: '71%' }], 80);
    },
    s2(svg) {
      pie(svg, 80, 95, 130, 83, { label: '83%', cap: 'of new outdoor spaces|include a lounge' });
      pie(svg, 270, 95, 130, 48, { label: '48%', cap: 'of lounges include|a fire feature' });
      pie(svg, 460, 95, 130, 49, { label: '49%', cap: 'of dining areas include|a fire feature' });
      vbars(svg, 640, 240, [{ v: 28, t: '28%', l: 'All|Americans' }, { v: 47, t: '47%', l: 'Gen Z', hl: 1 }], 50, 170, { w: 70, g: 40 });
      T(svg, 640, 300, 'Expect to host more at home in 2026', { size: 12.5, fill: STEEL });
    },
    s3(svg) {
      dumbbell(svg, [
        { l: 'Sunrooms and three-season porches', u: 'Largest gain of any room', a: 6, b: 25, al: 'net 6', bl: 'net 25' },
        { l: 'Heated exterior space', u: 'Rising again', a: 12, b: 16, al: 'net 12', bl: 'net 16' },
        { l: 'Infrared patio heaters', u: 'Holding steady', b: 16, bl: 'net 16' }], 30, { x0: 380 });
      T(svg, 380, 318, 'AIA Home Design Trends Survey, net index (share reporting more demand minus share reporting less)', { size: 11.5, fill: STEEL });
    },
    s4(svg) {
      dumbbell(svg, [
        { l: 'Shade structures', u: 'Share of structure upgrades', a: 20, b: 35, al: '20%', bl: '35%' },
        { l: 'Outdoor kitchens adding infrastructure', u: 'Plumbing, electrical or heating', a: 58, b: 68, al: '58%', bl: '68%' },
        { l: 'Outdoor kitchens under cover', u: 'Fully or partly covered', b: 74, bl: '74%' }], 80, { x0: 380 });
      T(svg, 380, 318, 'Houzz Outdoor Trends Study 2026, n=1,191', { size: 11.5, fill: STEEL });
    },
    s5(svg) {
      waffle(svg, 8, 40, 245, 241, 35, 15.4, 10.5);
      T(svg, 0, 172, 'Each dot is a US city. Flame: a warmer fall than in 1970.', { size: 13, fill: INK2 });
      T(svg, 0, 192, '241 of 245 cities, +2.9°F on average', { size: 20, serif: true, fill: FINK });
      vbars(svg, 650, 250, [{ v: 9.6, t: '9.6', l: '2024' }, { v: 11.7, t: '11.7', l: '2025', hl: 1 }], 13, 190, { w: 62, g: 36 });
      T(svg, 520, 300, 'Hours a week outdoors at home (Trex, brand-commissioned)', { size: 11.5, fill: STEEL });
    },
    s6(svg) {
      const rc = rough.svg(svg), M = 'JFMAMJJASOND';
      [['Before', [3, 4, 5, 6, 7, 8, 9, 10]], ['From 2026', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]]].forEach(([lab, on], r) => {
        T(svg, 0, 50 + r * 62, lab, { size: 15, weight: 700 }); T(svg, 0, 68 + r * 62, r ? 'year-round, by law' : 'April to late November', { size: 12, fill: STEEL });
        for (let m = 0; m < 12; m++) {
          const lit = on.includes(m), x = 190 + m * 52;
          add(svg, rc.rectangle(x, 28 + r * 62, 44, 42, O({ stroke: lit ? FINK : LINE, fill: lit ? (r ? FLAME : '#F6B3A5') : 'none', fillStyle: r ? 'hachure' : 'solid', hachureGap: 5 })));
          T(svg, x + 22, 55 + r * 62, M[m], { size: 13, anchor: 'middle', fill: lit && !r ? INK : INK2, weight: 700 });
        }
      });
      T(svg, 0, 178, 'New York roadway dining season', { size: 12, fill: STEEL, ls: 1 });
      hstack(svg, 0, 228, 820, 38, [
        { v: 304, n: '304', t: 'Curb lane cafés', c: '#B8B6B2', s: 'cross-hatch' },
        { v: 583, n: '583', t: 'Sidewalk cafés', c: INK2, s: 'hachure' },
        { v: 615, n: '615', t: 'Private patios', c: FLAME, s: 'hachure' }]);
      T(svg, 0, 318, 'Toronto CaféTO outdoor dining spaces, 2024 season – about 1,500', { size: 12, fill: STEEL });
    },
    s7(svg) {
      people(svg, 14, 20, 100, 62, 10, 27);
      T(svg, 0, 305, '62 in 100 Canadians choose a restaurant for its outdoor seating', { size: 12.5, fill: INK2 });
      pie(svg, 480, 95, 130, 58, { label: '58%', cap: 'of the outdoor heating market|is catering and hospitality' });
      pie(svg, 700, 95, 130, 42, { label: '42%', cap: 'of US operators were|not profitable in 2025', fill: STEEL, stroke: INK2, labelFill: INK2 });
    },
    s8(svg) {
      vbars(svg, 30, 230, [{ v: 3.64, t: '3.64M', l: 'Heat|pumps', hl: 1 }, { v: 3.25, t: '3.25M', l: 'Gas|furnaces' }], 4, 170, { w: 80, g: 44 });
      T(svg, 0, 306, 'US shipments, 2025 (AHRI)', { size: 12, fill: STEEL });
      pie(svg, 430, 90, 120, 54, { label: '54%', cap: 'Gas and propane today –|electric grows fastest', fill: STEEL, stroke: INK2, labelFill: INK2 });
      const rc = rough.svg(svg);
      add(svg, rc.line(590, 40, 590, 280, O({ stroke: INK })));
      [['2025', 'Heat pumps out-ship furnaces'], ['Jun 2026', 'New York all-electric act upheld'], ['2026', 'NEC 2026 – plan outdoor circuits'], ['Montréal', 'No networked gas in new buildings']].forEach(([a, b], i) => {
        const y = 50 + i * 72; add(svg, rc.circle(590, y, 14, O({ stroke: FINK, fill: FLAME, fillStyle: 'solid' })));
        T(svg, 610, y - 2, a, { size: 18, serif: true, fill: FINK }); T(svg, 610, y + 17, b, { size: 12.5, fill: INK2 });
      });
    },
    s9(svg) {
      waffle(svg, 14, 20, 100, 64, 10, 24, 17, { square: true });
      T(svg, 0, 268, '64 in 100 new-home lots', { size: 18, serif: true, fill: FINK });
      T(svg, 0, 288, 'are under 9,000 sq ft (NAHB, 2025)', { size: 12.5, fill: INK2 });
      pie(svg, 420, 90, 130, 60.5, { label: '60.5%', cap: 'of new homes have a patio –|a six-year low' });
      dumbbell(svg, [{ l: '', b: 53, bl: 'net 53' }], 60, { x0: 600, x1: 840, top: 100 });
      T(svg, 600, 60, 'Multigenerational living', { size: 15, weight: 700 }); T(svg, 600, 78, 'AIA, net index', { size: 12, fill: STEEL });
    },
    s10(svg) {
      waffle(svg, 12, 20, 100, 49, 10, 24, 17);
      T(svg, 0, 268, '49 in 100 US internet households', { size: 18, serif: true, fill: FINK });
      T(svg, 0, 288, 'own a smart-home device (Parks Associates)', { size: 12.5, fill: INK2 });
      vbars(svg, 320, 240, [{ v: 25, t: '25%', l: 'Smart|cameras', hl: 1 }, { v: 3, t: '3%', l: 'Standard|cameras' }], 30, 170, { w: 62, g: 34 });
      T(svg, 300, 300, 'What outdoor renovators install (Houzz)', { size: 11.5, fill: STEEL });
      dumbbell(svg, [{ l: 'Tech-friendly', u: 'AIA, net', b: 51, bl: 'net 51' }, { l: 'Energy management', u: 'AIA, net', b: 34, bl: 'net 34' }], 60, { x0: 690, x1: 850, top: 100, gap: 120, lx: 690, ly: -50 });
    },
    market(svg) {
      const rc = rough.svg(svg), yrs = [], vals = [];
      for (let y = 2025; y <= 2034; y++) { yrs.push(y); vals.push(y === 2025 ? 1.41 : 1.48 * Math.pow(1.066, y - 2026)); }
      const X = i => 50 + i * 50, Y = v => 250 - v * 72;
      add(svg, rc.line(40, 250, 510, 250, O({ stroke: INK })));
      [1, 2, 3].forEach(v => { add(svg, rc.line(40, Y(v), 510, Y(v), O({ stroke: LINE, strokeWidth: 0.8, roughness: 0.5 }))); T(svg, 0, Y(v) + 4, '$' + v + 'B', { size: 11, fill: STEEL }); });
      const pts = vals.map((v, i) => [X(i), Y(v)]);
      add(svg, rc.polygon([[X(0), 250], ...pts, [X(9), 250]], O({ stroke: 'none', fill: FLAME, fillStyle: 'hachure', hachureGap: 7, fillWeight: 1 })));
      add(svg, rc.linearPath(pts, O({ stroke: FINK, strokeWidth: 3 })));
      [[0, 'US$1.41B', '2025'], [1, 'US$1.48B', '2026'], [9, 'US$2.47B', '2034']].forEach(([i, a, b]) => {
        add(svg, rc.circle(X(i), Y(vals[i]), 14, O({ stroke: FINK, fill: '#fff', fillStyle: 'solid' })));
        T(svg, X(i) + (i === 9 ? -6 : 4), Y(vals[i]) - (i === 1 ? 34 : 18), a, { size: 19, serif: true, fill: FINK, anchor: i === 9 ? 'end' : 'start' });
      });
      yrs.forEach((y, i) => { if (i % 3 === 0 || i === 9) T(svg, X(i), 268, String(y), { size: 11.5, anchor: 'middle', fill: STEEL }); });
      T(svg, 60, 30, 'North America is the largest region: 45.7%', { size: 13, fill: INK2, weight: 700 });
    },
  };

  /* --- minis on the numbers page (dark) and the closing gap gauge --- */
  const MINI = {
    aia(svg) { vbars(svg, 70, 160, [{ v: 40, t: 'net 40', l: '2025' }, { v: 51, t: 'net 51', l: '2026', hl: 1 }], 55, 120, { w: 58, g: 40, dark: 1, vs: 19 }); },
    houzz(svg) { pie(svg, 150, 85, 140, 54, { ring: '#6E6867' }); },
    falls(svg) { waffle(svg, 6, 64, 245, 241, 35, 8.4, 6, { dark: 1 }); },
    year(svg) {
      const rc = rough.svg(svg);
      for (let m = 0; m < 12; m++) {
        const a0 = -Math.PI / 2 + m * Math.PI / 6 + 0.04, a1 = a0 + Math.PI / 6 - 0.08;
        add(svg, rc.arc(150, 88, 150, 150, a0, a1, true, O({ stroke: FINK, fill: FLAME, fillStyle: 'hachure', hachureGap: 5 })));
      }
      add(svg, rc.circle(150, 88, 80, O({ stroke: '#6E6867', fill: '#141213', fillStyle: 'solid' })));
      T(svg, 150, 100, '12', { size: 34, serif: true, anchor: 'middle', fill: LIGHT });
    },
    gap(svg) { pie(svg, 110, 105, 170, 23, {}); T(svg, 110, 118, '23%', { size: 40, serif: true, anchor: 'middle', fill: INK }); },
  };

  /* --- diagrams (680 x 540) --- */
  function label(svg, x, y, s, o = {}) { return T(svg, x, y, s, Object.assign({ size: 14, fill: INK2 }, o)); }
  const DG = {
    floorplan(svg) {
      const rc = rough.svg(svg), W = O({ strokeWidth: 3 });
      add(svg, rc.rectangle(90, 60, 500, 230, W));
      add(svg, rc.line(290, 60, 290, 290, O({ strokeWidth: 2 }))); add(svg, rc.line(460, 60, 460, 290, O({ strokeWidth: 2 })));
      label(svg, 190, 170, 'Kitchen', { anchor: 'middle' }); label(svg, 375, 170, 'Living', { anchor: 'middle' }); label(svg, 525, 170, 'Dining', { anchor: 'middle' });
      add(svg, rc.line(200, 290, 520, 290, O({ stroke: '#F5F5F4', strokeWidth: 6, roughness: 0 })));
      add(svg, rc.line(200, 290, 520, 290, O({ stroke: INK2, strokeWidth: 1, strokeLineDash: [6, 5] })));
      label(svg, 360, 284, 'sliding doors', { anchor: 'middle', size: 11.5 });
      add(svg, rc.rectangle(150, 290, 420, 170, O({ strokeLineDash: [10, 6], stroke: INK2 })));
      label(svg, 160, 482, 'Covered outdoor room', { size: 15, weight: 700, fill: INK });
      add(svg, rc.rectangle(190, 360, 150, 50, O({ stroke: INK2, fill: '#DAD7D2', fillStyle: 'solid' })));
      add(svg, rc.circle(460, 385, 80, O({ stroke: INK2 })));
      [[265, 385], [460, 385]].forEach(([x, y]) => add(svg, rc.ellipse(x, y, 210, 130, O({ stroke: FLAME, strokeWidth: 1, fill: FLAME, fillStyle: 'hachure', hachureGap: 9, fillWeight: 0.8 }))));
      [[205, 318], [400, 318]].forEach(([x, y]) => add(svg, rc.rectangle(x, y, 120, 10, O({ stroke: FINK, fill: FLAME, fillStyle: 'solid' }))));
      add(svg, rc.rectangle(560, 90, 18, 26, O({ fill: INK, fillStyle: 'solid' })));
      add(svg, rc.linearPath([[569, 116], [569, 310], [520, 310]], O({ stroke: FINK, strokeLineDash: [8, 6] })));
      label(svg, 600, 104, 'Panel', { size: 12 });
      label(svg, 470, 304, 'heater circuit', { size: 12, fill: FINK });
    },
    pergola(svg) {
      const rc = rough.svg(svg), P = (cx, cy, w, d) => [[cx - w / 2, cy], [cx - w / 2 + d, cy - d * 0.55], [cx + w / 2 + d, cy - d * 0.55], [cx + w / 2, cy]];
      const layers = [
        [100, 'Roof', 'louvres or solid cover'], [195, 'Lighting', 'on the same circuit plan'], [290, 'Heat', 'mounted to beam or ceiling'], [385, 'Controls', 'dimmer, zones, app']];
      layers.forEach(([y, a, b], i) => {
        const pts = P(250, y, 320, 120);
        if (i === 0) { add(svg, rc.polygon(pts, O({ fill: '#DAD7D2', fillStyle: 'solid', stroke: INK }))); for (let k = 1; k < 9; k++) { const t = k / 9; add(svg, rc.line(90 + 320 * t, y, 90 + 320 * t + 120, y - 66, O({ stroke: INK2, strokeWidth: 1 }))); } }
        if (i === 1) { add(svg, rc.polygon(pts, O({ stroke: LINE, strokeLineDash: [5, 5] }))); add(svg, rc.line(110, y - 10, 420, y - 10, O({ stroke: '#E8B04B', strokeWidth: 4 }))); }
        if (i === 2) { add(svg, rc.polygon(pts, O({ stroke: LINE, strokeLineDash: [5, 5] }))); add(svg, rc.rectangle(150, y - 40, 200, 20, O({ fill: INK, fillStyle: 'solid' }))); add(svg, rc.rectangle(162, y - 34, 176, 8, O({ stroke: FINK, fill: FLAME, fillStyle: 'solid' }))); add(svg, rc.ellipse(250, y + 10, 300, 60, O({ stroke: FLAME, strokeWidth: 0.8, fill: FLAME, fillStyle: 'hachure', hachureGap: 10, fillWeight: 0.7 }))); }
        if (i === 3) { add(svg, rc.rectangle(220, y - 50, 50, 64, O({ fill: '#fff', fillStyle: 'solid' }))); add(svg, rc.circle(245, y - 18, 30, O({ stroke: FINK }))); add(svg, rc.line(245, y - 18, 254, y - 28, O({ stroke: FINK, strokeWidth: 2 }))); }
        add(svg, rc.line(460, y - 30, 500, y - 30, O({ stroke: FINK })));
        label(svg, 510, y - 32, a, { size: 20, serif: true, fill: INK }); label(svg, 510, y - 12, b, { size: 12.5 });
        if (i < 3) add(svg, rc.line(250, y + 8, 250, y + 55, O({ stroke: STEEL, strokeWidth: 1, strokeLineDash: [4, 5] })));
      });
      add(svg, rc.line(90, 470, 90, 400, O({ strokeWidth: 3 }))); add(svg, rc.line(410, 470, 410, 400, O({ strokeWidth: 3 })));
      add(svg, rc.polygon(P(250, 478, 320, 120), O({ stroke: INK2, fill: '#E7E4DF', fillStyle: 'solid' })));
      add(svg, rc.line(460, 450, 500, 450, O({ stroke: FINK }))); label(svg, 510, 448, 'Power', { size: 20, serif: true, fill: INK }); label(svg, 510, 468, 'run at rough-in', { size: 12.5 });
    },
    season(svg) {
      const rc = rough.svg(svg), cx = 300, cy = 270, M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const kind = [0, 0, 1, 2, 2, 3, 3, 3, 2, 2, 1, 0];
      for (let m = 0; m < 12; m++) {
        const a0 = -Math.PI / 2 + m * Math.PI / 6 + 0.03, a1 = a0 + Math.PI / 6 - 0.06, k = kind[m];
        const st = [O({ stroke: LINE }), O({ stroke: FINK, fill: '#F6B3A5', fillStyle: 'hachure', hachureGap: 9 }), O({ stroke: FINK, fill: FLAME, fillStyle: 'hachure', hachureGap: 5 }), O({ stroke: FINK, fill: FLAME, fillStyle: 'solid' })][k];
        add(svg, rc.arc(cx, cy, 400, 400, a0, a1, true, st));
        const am = (a0 + a1) / 2; label(svg, cx + Math.cos(am) * 225, cy + Math.sin(am) * 225 + 5, M[m], { anchor: 'middle', size: 13, weight: 700, fill: INK });
      }
      add(svg, rc.circle(cx, cy, 230, O({ stroke: LINE, fill: '#F5F5F4', fillStyle: 'solid' })));
      label(svg, cx, cy - 6, 'More evenings', { anchor: 'middle', size: 24, serif: true, fill: INK });
      label(svg, cx, cy + 18, 'worth claiming', { anchor: 'middle', size: 14 });
      [[FLAME, 'solid', 'Summer'], [FLAME, 'hachure', 'Shoulder evenings, with heat'], ['#F6B3A5', 'hachure', 'Edge of season, heat and cover']].forEach(([c, s, t], i) => {
        add(svg, rc.rectangle(470, 470 + i * 24, 20, 15, O({ stroke: FINK, fill: c, fillStyle: s, hachureGap: 4 }))); label(svg, 498, 482 + i * 24, t, { size: 12 });
      });
    },
    lot(svg) {
      const rc = rough.svg(svg);
      add(svg, rc.rectangle(150, 40, 340, 455, O({ strokeLineDash: [12, 7], stroke: INK2 })));
      label(svg, 320, 30, 'Median new-home lot: 8,543 sq ft', { anchor: 'middle', size: 15, weight: 700, fill: INK });
      add(svg, rc.rectangle(185, 130, 270, 230, O({ strokeWidth: 3, fill: '#DAD7D2', fillStyle: 'cross-hatch', hachureGap: 12 })));
      label(svg, 320, 250, 'House', { anchor: 'middle', size: 18, serif: true, fill: INK });
      add(svg, rc.rectangle(235, 360, 170, 80, O({ stroke: INK2, fill: '#fff', fillStyle: 'solid' })));
      label(svg, 320, 425, 'Patio', { anchor: 'middle', size: 14 });
      [[255, 362], [345, 362]].forEach(([x, y]) => { add(svg, rc.rectangle(x, y, 60, 8, O({ stroke: FINK, fill: FLAME, fillStyle: 'solid' }))); });
      add(svg, rc.arc(320, 362, 230, 150, 0, Math.PI, true, O({ stroke: FLAME, strokeWidth: 0.8, fill: FLAME, fillStyle: 'hachure', hachureGap: 9, fillWeight: 0.7 })));
      add(svg, rc.line(410, 368, 520, 330, O({ stroke: FINK }))); label(svg, 525, 322, 'Wall-mounted heat', { size: 15, serif: true, fill: INK }); label(svg, 525, 340, 'no floor space used', { size: 12 });
      add(svg, rc.line(405, 430, 520, 450, O({ stroke: INK2 }))); label(svg, 525, 455, 'Patio floor stays free', { size: 12 });
      label(svg, 40, 470, 'Front', { size: 12, fill: STEEL }); label(svg, 40, 80, 'Back', { size: 12, fill: STEEL });
    },
    phone(svg) {
      const rc = rough.svg(svg);
      add(svg, rc.path('M150 40 h200 q24 0 24 24 v412 q0 24 -24 24 h-200 q-24 0 -24 -24 v-412 q0 -24 24 -24 z', O({ strokeWidth: 2.4, fill: '#fff', fillStyle: 'solid' })));
      label(svg, 250, 92, 'Evening', { anchor: 'middle', size: 24, serif: true, fill: INK });
      label(svg, 250, 112, 'outdoor scene', { anchor: 'middle', size: 12, fill: STEEL });
      [['Lights', 0.55, INK2], ['Music', 0.35, INK2], ['Heat · Lounge', 0.75, FLAME], ['Heat · Dining', 0.45, FLAME]].forEach(([t, v, c], i) => {
        const y = 160 + i * 66; label(svg, 160, y, t, { size: 14, weight: 700, fill: INK });
        add(svg, rc.line(160, y + 20, 340, y + 20, O({ stroke: LINE, strokeWidth: 4, roughness: 0.6 })));
        add(svg, rc.line(160, y + 20, 160 + 180 * v, y + 20, O({ stroke: c, strokeWidth: 4, roughness: 0.6 })));
        add(svg, rc.circle(160 + 180 * v, y + 20, 16, O({ stroke: c, fill: '#fff', fillStyle: 'solid' })));
      });
      label(svg, 160, 440, 'Off at 11 pm', { size: 13, fill: INK2 });
      add(svg, rc.rectangle(470, 190, 170, 18, O({ fill: INK, fillStyle: 'solid' }))); add(svg, rc.rectangle(480, 195, 150, 8, O({ stroke: FINK, fill: FLAME, fillStyle: 'solid' })));
      add(svg, rc.ellipse(555, 250, 210, 70, O({ stroke: FLAME, strokeWidth: 0.8, fill: FLAME, fillStyle: 'hachure', hachureGap: 9, fillWeight: 0.7 })));
      add(svg, rc.linearPath([[376, 300], [430, 300], [470, 210]], O({ stroke: FINK, strokeLineDash: [6, 6] })));
      label(svg, 470, 320, 'Zoned and dimmable', { size: 18, serif: true, fill: INK });
      label(svg, 470, 340, 'Affinity Smart-Heat controls;', { size: 12 }); label(svg, 470, 356, 'app features need compatible', { size: 12 }); label(svg, 470, 372, 'Affinity controls, sold separately', { size: 12 });
    },
  };

  function decorate() {
    document.querySelectorAll('[data-r="circle"]').forEach(h => {
      const s = el('svg', { viewBox: '0 0 50 50', style: 'position:absolute;inset:0;width:100%;height:100%;overflow:visible' });
      h.style.position = 'relative'; h.prepend(s);
      add(s, rough.svg(s).circle(25, 25, 46, O({ stroke: getComputedStyle(h).color, strokeWidth: 1.2, roughness: 1.6 })));
    });
    document.querySelectorAll('[data-r="box"]').forEach(h => {
      const s = el('svg', { viewBox: '0 0 22 22', style: 'position:absolute;inset:0;width:100%;height:100%;overflow:visible' }, h);
      const rc = rough.svg(s); add(s, rc.rectangle(1, 1, 20, 20, O({ strokeWidth: 1.3 }))); add(s, rc.linearPath([[4, 11], [9, 17], [21, 2]], O({ stroke: FLAME, strokeWidth: 2.4 })));
    });
  }

  let PW = 0;
  function fit() { PW = PW || (document.querySelector('.pg') || {}).offsetWidth || 1600; const pw = PW, z = Math.min(1, (window.innerWidth - 24) / pw); document.querySelectorAll('.pg').forEach(p => p.style.zoom = z); }

  const defs = el('svg', { width: 0, height: 0, style: 'position:absolute' }, document.body);
  defs.innerHTML = '<filter id="sk"><feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="1.4"/></filter>';
  function draw() {
    document.querySelectorAll('[data-chart]').forEach(s => CH[s.dataset.chart] && CH[s.dataset.chart](s));
    document.querySelectorAll('[data-mini]').forEach(s => MINI[s.dataset.mini](s));
    document.querySelectorAll('[data-diag]').forEach(s => DG[s.dataset.diag](s));
    decorate(); fit(); window.addEventListener('resize', fit);
    window.__ready = true;
  }
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(draw);
})();
