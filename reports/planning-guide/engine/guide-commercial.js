/* Commercial Edition drawings (rough.js): venue layouts drawn to scale in feet, plus the venue charts.
   Loaded after guide.js: keeps its drawings (spectrum, open3, cloud, timeline, phone, scale…) and adds the venue ones.
   Counts follow the Bromic sizing model (templates/calculation-model.md): area = seats × 20 ft²; heaters = area ÷ (coverage ×
   cover × climate), rounded up; freestanding never more than 4 seats each. Placement follows cad/REAL-INSTALL-STUDY.md: heaters at
   the edges facing the seats, or as rows over a central table line in a space one heater wide. */
(function () {
  const BASE = window.REPORT_CHARTS;
  window.REPORT_CHARTS = (BZ) => {
  const base = BASE ? BASE(BZ) : { CH: {}, MINI: {} };
  const { T, O, add, el, INK, INK2, STEEL, FLAME, FINK, LINE } = BZ;
  const WASH = '#FCE7E2', PAPER = '#FAFAF8', ROOF = '#ECEAE6';
  let gid = 0;
  const grad = (svg) => {
    const id = 'zg' + (gid++), d = el('defs', {}, svg), g = el('radialGradient', { id }, d);
    el('stop', { offset: '0%', 'stop-color': FLAME, 'stop-opacity': 0.42 }, g);
    el('stop', { offset: '70%', 'stop-color': FLAME, 'stop-opacity': 0.16 }, g);
    el('stop', { offset: '100%', 'stop-color': FLAME, 'stop-opacity': 0.04 }, g);
    return id;
  };
  const rcOf = (svg) => rough.svg(svg);

  /* ---------- plans in feet ---------- */
  function plan(svg, G) {
    const rc = rcOf(svg), VW = +svg.viewBox.baseVal.width, VH = +svg.viewBox.baseVal.height;
    const s = Math.min((VW - 110) / G.W, (VH - 80) / G.D), ox = (VW - G.W * s) / 2 + 6, oy = 34 + (VH - 80 - G.D * s) / 2;
    const X = (x) => ox + x * s, Y = (y) => oy + y * s, zid = grad(svg);
    // roof
    if (G.roof === 'roof') add(svg, rc.rectangle(X(0), Y(0), G.W * s, G.D * s, O({ stroke: 'none', fill: ROOF, fillStyle: 'solid', roughness: 0.4 })));
    if (G.roof === 'part') G.roofRect.forEach(([x, y, w, d]) => add(svg, rc.rectangle(X(x), Y(y), w * s, d * s, O({ stroke: 'none', fill: ROOF, fillStyle: 'solid', roughness: 0.4 }))));
    if (G.roof === 'pergola') for (let x = 1; x < G.W; x += 1.5) add(svg, rc.line(X(x), Y(0.2), X(x), Y(G.D - 0.2), O({ stroke: '#C9C6C1', strokeWidth: 1, roughness: 0.6 })));
    // water, fire and other ground items first
    (G.items || []).filter((i) => i.t === 'pool').forEach((i) => add(svg, rc.rectangle(X(i.x), Y(i.y), i.w * s, i.d * s, O({ stroke: '#7FA7B8', fill: '#CFE3EA', fillStyle: 'hachure', hachureGap: 7, hachureAngle: 20 }))));
    // warm zones (true scale): a linear heater's zone is an ellipse along its length, round heaters a circle
    (G.heaters || []).forEach((h) => {
      const r = Math.sqrt(h.A / Math.PI), cx = h.zx ?? h.x, cy = h.zy ?? h.y;
      let rx = r, ry = r; if (h.k === 'lin' || h.k === 'gas') { rx = r * 1.25; ry = r / 1.25; if (h.rot === 90) [rx, ry] = [ry, rx]; }
      el('ellipse', { cx: X(cx), cy: Y(cy), rx: rx * s, ry: ry * s, fill: `url(#${zid})` }, svg);
      add(svg, rc.ellipse(X(cx), Y(cy), 2 * rx * s, 2 * ry * s, O({ stroke: FLAME, strokeWidth: 1, strokeLineDash: [5, 5], roughness: 0.8 })));
    });
    // furniture
    const chair = (x, y) => add(svg, rc.rectangle(X(x - 0.9), Y(y - 0.9), 1.8 * s, 1.8 * s, O({ stroke: INK2, strokeWidth: 1, fill: '#fff', fillStyle: 'solid', roughness: 0.7 })));
    (G.items || []).forEach((i) => {
      if (i.t === 'table') {
        const st = i.seats || {};
        const row = (n, y) => { for (let k = 0; k < n; k++) chair(i.x + (k + 0.5) * i.w / n, y); };
        row(st.top || 0, i.y - 1.2); row(st.bottom || 0, i.y + i.d + 1.2);
        if (st.left) chair(i.x - 1.2, i.y + i.d / 2); if (st.right) chair(i.x + i.w + 1.2, i.y + i.d / 2);
        add(svg, rc.rectangle(X(i.x), Y(i.y), i.w * s, i.d * s, O({ fill: '#E7DCCD', fillStyle: 'solid', strokeWidth: 1.4 })));
      }
      if (i.t === 'round') {
        for (let k = 0; k < i.n; k++) { const a = (k / i.n) * 2 * Math.PI + 0.4; chair(i.x + Math.cos(a) * (i.r + 1.2), i.y + Math.sin(a) * (i.r + 1.2)); }
        add(svg, rc.circle(X(i.x), Y(i.y), 2 * i.r * s, O({ fill: '#E7DCCD', fillStyle: 'solid', strokeWidth: 1.4 })));
      }
      if (i.t === 'sofa') { add(svg, rc.rectangle(X(i.x), Y(i.y), i.w * s, i.d * s, O({ fill: '#D9D4CC', fillStyle: 'solid', strokeWidth: 1.2 }))); }
      if (i.t === 'chair') add(svg, rc.rectangle(X(i.x - 1.25), Y(i.y - 1.25), 2.5 * s, 2.5 * s, O({ fill: '#D9D4CC', fillStyle: 'solid', strokeWidth: 1.2 })));
      if (i.t === 'stool') add(svg, rc.circle(X(i.x), Y(i.y), 1.3 * s, O({ fill: '#fff', fillStyle: 'solid', strokeWidth: 1, stroke: INK2 })));
      if (i.t === 'coffee') add(svg, rc.rectangle(X(i.x), Y(i.y), i.w * s, i.d * s, O({ fill: '#E7DCCD', fillStyle: 'solid', strokeWidth: 1 })));
      if (i.t === 'fire') { add(svg, rc.rectangle(X(i.x), Y(i.y), i.w * s, i.d * s, O({ fill: '#3A3534', fillStyle: 'solid', strokeWidth: 1.2 }))); add(svg, rc.line(X(i.x + 0.5), Y(i.y + i.d / 2), X(i.x + i.w - 0.5), Y(i.y + i.d / 2), O({ stroke: '#F5A04A', strokeWidth: 3 }))); }
      if (i.t === 'fireplace') { add(svg, rc.rectangle(X(i.x), Y(i.y), i.w * s, i.d * s, O({ fill: '#B9B2A8', fillStyle: 'cross-hatch', hachureGap: 5 }))); }
      if (i.t === 'counter') { add(svg, rc.rectangle(X(i.x), Y(i.y), i.w * s, i.d * s, O({ fill: '#C9C6C1', fillStyle: 'solid', strokeWidth: 1.2 }))); if (i.grill) add(svg, rc.rectangle(X(i.grill[0]), Y(i.grill[1]), 3 * s, i.d * s * 0.8, O({ fill: '#3A3534', fillStyle: 'solid' }))); }
      if (i.t === 'booth') add(svg, rc.rectangle(X(i.x), Y(i.y), i.w * s, i.d * s, O({ fill: '#D9D4CC', fillStyle: 'solid', strokeWidth: 1.2 })));
      if (i.t === 'lounger') { add(svg, rc.rectangle(X(i.x), Y(i.y), i.w * s, i.d * s, O({ fill: '#fff', fillStyle: 'solid', strokeWidth: 1, stroke: INK2 }))); }
      if (i.t === 'stand') { add(svg, rc.rectangle(X(i.x), Y(i.y), i.w * s, i.d * s, O({ fill: '#3A3534', fillStyle: 'solid', strokeWidth: 1 }))); }
      if (i.t === 'path') add(svg, rc.rectangle(X(i.x), Y(i.y), i.w * s, i.d * s, O({ stroke: STEEL, strokeWidth: 1, strokeLineDash: [6, 6], roughness: 0.5 })));
      if (i.t === 'divider') add(svg, rc.line(X(i.x1), Y(i.y1), X(i.x2), Y(i.y2), O({ stroke: STEEL, strokeWidth: 1.2, strokeLineDash: [3, 6], roughness: 0.5 })));
      if (i.t === 'plant') add(svg, rc.circle(X(i.x), Y(i.y), 2 * i.r * s, O({ stroke: '#6E8B5E', fill: '#CFDCC4', fillStyle: 'hachure', hachureGap: 5 })));
    });
    // walls and open sides
    const side = (k, x1, y1, x2, y2, lx, ly, anchor) => {
      const t = G.sides[k]; if (!t) return;
      if (t === 'house') { add(svg, rc.rectangle(Math.min(X(x1), X(x2)) - (y1 === y2 ? 0 : 7), Math.min(Y(y1), Y(y2)) - (y1 === y2 ? 7 : 0), y1 === y2 ? Math.abs(X(x2) - X(x1)) : 8, y1 === y2 ? 8 : Math.abs(Y(y2) - Y(y1)), O({ fill: INK, fillStyle: 'solid', roughness: 0.5 }))); T(svg, lx, ly, 'House', { size: 12, anchor, fill: INK2, weight: 700 }); }
      else if (t === 'wall') add(svg, rc.line(X(x1), Y(y1), X(x2), Y(y2), O({ strokeWidth: 3.6 })));
      else if (t === 'rail') { add(svg, rc.line(X(x1), Y(y1), X(x2), Y(y2), O({ strokeWidth: 1.4, stroke: INK2 }))); T(svg, lx, ly, 'Railing, open', { size: 12, anchor, fill: STEEL }); }
      else if (t === 'open') { add(svg, rc.line(X(x1), Y(y1), X(x2), Y(y2), O({ stroke: STEEL, strokeWidth: 1, strokeLineDash: [7, 6], roughness: 0.5 }))); T(svg, lx, ly, 'Open', { size: 12, anchor, fill: STEEL }); }
    };
    side('top', 0, 0, G.W, 0, X(G.W / 2), Y(0) - 12, 'middle');
    side('bottom', 0, G.D, G.W, G.D, X(G.W / 2), Y(G.D) + 20, 'middle');
    side('left', 0, 0, 0, G.D, X(0) - 10, Y(G.D / 2), 'end');
    side('right', G.W, 0, G.W, G.D, X(G.W) + 10, Y(G.D / 2), 'start');
    // heaters
    (G.heaters || []).forEach((h) => {
      if (h.k === 'lin' || h.k === 'gas') {
        const L = (h.len || 4) * s, w = (h.k === 'gas' ? 1.1 : 0.7) * s, vert = h.rot === 90;
        const x = X(h.x) - (vert ? w / 2 : L / 2), y = Y(h.y) - (vert ? L / 2 : w / 2);
        add(svg, rc.rectangle(x, y, vert ? w : L, vert ? L : w, O({ fill: INK, fillStyle: 'solid', roughness: 0.4 })));
        add(svg, rc.rectangle(x + (vert ? w * 0.25 : 3), y + (vert ? 3 : w * 0.25), vert ? w * 0.5 : L - 6, vert ? L - 6 : w * 0.5, O({ stroke: 'none', fill: FLAME, fillStyle: 'solid', roughness: 0.3 })));
      } else if (h.k === 'ecl') {
        add(svg, rc.circle(X(h.x), Y(h.y), 2.2 * s, O({ fill: INK, fillStyle: 'solid' }))); add(svg, rc.circle(X(h.x), Y(h.y), 1.2 * s, O({ stroke: 'none', fill: FLAME, fillStyle: 'solid' })));
      } else if (h.k === 'fs') {
        add(svg, rc.rectangle(X(h.x) - 0.8 * s, Y(h.y) - 0.6 * s, 1.6 * s, 1.2 * s, O({ fill: INK, fillStyle: 'solid' })));
        add(svg, rc.curve([[X(h.x), Y(h.y)], [X((h.x + h.zx) / 2) + 6, Y((h.y + h.zy) / 2) - 18], [X(h.zx), Y(h.zy)]], O({ strokeWidth: 2.2 })));
        add(svg, rc.circle(X(h.zx), Y(h.zy), 2.2 * s, O({ fill: INK, fillStyle: 'solid' }))); add(svg, rc.circle(X(h.zx), Y(h.zy), 1.2 * s, O({ stroke: 'none', fill: FLAME, fillStyle: 'solid' })));
      }
    });
    // dimensions
    T(svg, X(0), Y(G.D) + (G.sides.bottom ? 40 : 22), `${G.W} × ${G.D} ft`, { size: 12.5, fill: INK2, weight: 700 });
    (G.notes || []).forEach(([x, y, t, a]) => T(svg, X(x), Y(y), t, { size: 11.5, fill: INK2, anchor: a || 'middle' }));
  }


  const CH = base.CH;
  const lin = (x, y, A, o = {}) => Object.assign({ k: 'lin', x, y, A, len: A >= 160 ? 4.7 : A >= 130 ? 4.2 : 3.6 }, o);
  const GEO = {
    // C1 restaurant covered terrace: 24 seats = 480 ft², covered, cool: 480 / (160 × 1.1 × 0.85) = 3.2 → 4 × Tungsten 6000 W
    C1: { W: 32, D: 18, roof: 'roof', sides: { top: 'house', left: 'wall', right: 'open', bottom: 'open' },
      items: [5, 14, 23].flatMap((x) => [{ t: 'table', x, y: 4.6, w: 2.6, d: 2.6, seats: { top: 1, bottom: 1, left: 1, right: 1 } }, { t: 'table', x, y: 11.4, w: 2.6, d: 2.6, seats: { top: 1, bottom: 1, left: 1, right: 1 } }]),
      heaters: [lin(10, 1.1, 160, { zy: 5.9 }), lin(22, 1.1, 160, { zy: 5.9 }), lin(10, 16.9, 160, { zy: 12.7 }), lin(22, 16.9, 160, { zy: 12.7 })],
      notes: [[16, 2.6, 'Heaters on the canopy edges, angled in over the tables']] },
    // C2 street dining enclosure: 16 seats = 320 ft², covered, cool: 320 / (130 × 0.935) = 2.6 → 3 × Tungsten 4000 W in a row (one heater wide)
    C2: { W: 26, D: 9, roof: 'roof', sides: { top: 'open', left: 'wall', right: 'wall', bottom: 'wall' },
      items: [2.2, 8.4, 14.6, 20.8].map((x) => ({ t: 'table', x, y: 3.2, w: 2.6, d: 2.6, seats: { top: 1, bottom: 1, left: 1, right: 1 } })),
      heaters: [lin(6.5, 4.5, 130), lin(13, 4.5, 130), lin(19.5, 4.5, 130)],
      notes: [[13, -1.6, 'Sidewalk side, open'], [13, 10.6, 'Roadway side, screened']] },
    // C3 rooftop bar: 8 stools + 8 lounge seats = 16 seats = 320 ft², pergola, cool: 320 / (121 × 0.85) = 3.1 → 4 × Eclipse
    C3: { W: 30, D: 16, roof: 'pergola', sides: { top: 'wall', left: 'open', right: 'open', bottom: 'open' },
      items: [{ t: 'counter', x: 2.5, y: 0.6, w: 15.5, d: 2.4 }, ...[3.8, 5.8, 7.8, 9.8, 11.8, 13.8, 15.8, 17.6].map((x) => ({ t: 'stool', x, y: 4.4 })),
        { t: 'sofa', x: 20.5, y: 5, w: 7.5, d: 2.4 }, { t: 'sofa', x: 20.5, y: 7.4, w: 2.4, d: 5.2 }, { t: 'coffee', x: 23.6, y: 8.2, w: 3.6, d: 2.6 }, { t: 'chair', x: 28.2, y: 12.4 }, { t: 'chair', x: 25, y: 13.6 }],
      heaters: [{ k: 'ecl', x: 7, y: 4.6, A: 121 }, { k: 'ecl', x: 14.6, y: 4.6, A: 121 }, { k: 'ecl', x: 22.5, y: 7.2, A: 121 }, { k: 'ecl', x: 26.4, y: 11, A: 121 }],
      notes: [[10.3, 2.1, 'Bar'], [10.3, 7.2, 'High-tops: pendants about 10 ft up']] },
    // C4 hotel pool cabanas: 3 cabanas of 4 seats, 64 ft² each, covered: 1 × Eclipse each
    C4: { W: 34, D: 20, roof: 'part', roofRect: [[1.5, 0, 9, 8.5], [12.5, 0, 9, 8.5], [23.5, 0, 9, 8.5]], sides: { top: 'wall', left: 'open', right: 'open', bottom: 'open' },
      items: [1.5, 12.5, 23.5].flatMap((x) => [{ t: 'sofa', x: x + 1, y: 0.8, w: 7, d: 2.4 }, { t: 'coffee', x: x + 3.2, y: 4, w: 2.6, d: 1.8 }, { t: 'chair', x: x + 7.2, y: 6.6 }]).concat([{ t: 'pool', x: 4, y: 11.5, w: 26, d: 7 }]),
      heaters: [6, 17, 28].map((x) => ({ k: 'ecl', x, y: 4.4, A: 121 })),
      notes: [[6, 9.7, 'Cabana'], [17, 9.7, 'Cabana'], [28, 9.7, 'Cabana'], [17, 15.4, 'Pool']] },
    // C5 pergola garden: 32 seats = 640 ft², pergola, cool: 640 / (143 × 0.85) = 5.3 → 6 × Platinum Electric 4500 W on the perimeter beams
    C5: { W: 36, D: 20, roof: 'pergola', sides: { top: 'wall', left: 'wall', right: 'open', bottom: 'open' },
      items: [[5, 4.6], [21, 4.6], [5, 13.4], [21, 13.4]].map(([x, y]) => ({ t: 'table', x, y, w: 8.5, d: 2.8, seats: { top: 3, bottom: 3, left: 1, right: 1 } })),
      heaters: [lin(9.2, 0.8, 143, { zy: 6 }), lin(25.2, 0.8, 143, { zy: 6 }), lin(9.2, 19.2, 143, { zy: 14.8 }), lin(25.2, 19.2, 143, { zy: 14.8 }),
        lin(0.8, 10, 143, { rot: 90, zx: 4 }), lin(35.2, 10, 143, { rot: 90, zx: 31.8 })] },
    // C6 café frontage under an awning: 12 seats = 240 ft², partly covered, cool: 240 / (100 × 0.85) = 2.8 → 3 × Tungsten 3000 W on the shopfront wall
    C6: { W: 24, D: 9, roof: 'part', roofRect: [[0, 0, 24, 6]], sides: { top: 'house', left: 'open', right: 'open', bottom: 'open' },
      items: [2.8, 6.8, 10.8, 14.8, 18.8, 22.8].map((x, k) => ({ t: 'round', x: x - 0.6, y: k % 2 ? 4.4 : 3.6, r: 1, n: 2 })).concat([{ t: 'path', x: 0.2, y: 7, w: 23.6, d: 1.8 }]),
      heaters: [lin(4.4, 0.5, 100, { zy: 3.8 }), lin(12, 0.5, 100, { zy: 3.8 }), lin(19.6, 0.5, 100, { zy: 3.8 })],
      notes: [[12, 6.6, 'Awning edge'], [12, 8.3, 'Pavement walkway kept clear']] },
    // C7 hotel entrance and valet: about 200 ft² of standing and waiting space under the canopy, covered, cool: 200 / (160 × 0.935) = 1.3 → 2 × Tungsten 6000 W
    C7: { W: 24, D: 14, roof: 'part', roofRect: [[0, 0, 24, 9]], sides: { top: 'house', left: 'open', right: 'open', bottom: 'open' },
      items: [{ t: 'sofa', x: 1.2, y: 1, w: 5, d: 2 }, { t: 'sofa', x: 17.8, y: 1, w: 5, d: 2 }, { t: 'stand', x: 15.6, y: 6, w: 2, d: 1.4 }, { t: 'path', x: 9, y: 0.2, w: 6, d: 8.6 }],
      heaters: [lin(5, 0.5, 160, { zy: 4.6 }), lin(19, 0.5, 160, { zy: 4.6 })],
      notes: [[12, 4.6, 'Entrance'], [16.6, 8.4, 'Valet'], [12, 11.6, 'Drive-up lane']] },
    // C8 open restaurant terrace on natural gas: 24 seats = 480 ft², open, cool: 480 / (215 × 0.85 × 0.85) = 3.1 → 4 × Platinum Gas 39,800 Btu on the building wall
    C8: { W: 32, D: 15, roof: 'none', sides: { top: 'house', left: 'open', right: 'open', bottom: 'open' },
      items: [5, 14.7, 24.4].flatMap((x) => [{ t: 'table', x, y: 4.6, w: 2.6, d: 2.6, seats: { top: 1, bottom: 1, left: 1, right: 1 } }, { t: 'table', x, y: 10.4, w: 2.6, d: 2.6, seats: { top: 1, bottom: 1, left: 1, right: 1 } }])
        .concat([{ t: 'plant', x: 1.6, y: 13.4, r: 1 }, { t: 'plant', x: 30.4, y: 13.4, r: 1 }]),
      heaters: [4.4, 12.4, 19.6, 27.6].map((x) => ({ k: 'gas', x, y: 0.6, len: 3, A: 215, zx: x, zy: 7.6 })),
      notes: [[16, 2.3, 'Built-in gas on the building wall, 96 in+']] },
  };
  Object.keys(GEO).forEach((k) => { CH[k] = (svg) => plan(svg, GEO[k]); });

  // service sections: each section on its own controller channel
  CH.zones = (svg) => {
    const g = el('svg', { viewBox: '0 0 760 420', x: 0, y: 0, width: 760, height: 420 }, svg);
    plan(g, { W: 36, D: 18, roof: 'roof', sides: { top: 'house', left: 'wall', right: 'open', bottom: 'open' },
      items: [[3, 4.6], [3, 11.6], [15, 4.6], [15, 11.6], [27, 4.6], [27, 11.6]].map(([x, y]) => ({ t: 'table', x, y, w: 5.5, d: 2.6, seats: { top: 2, bottom: 2 } }))
        .concat([{ t: 'divider', x1: 12, y1: 0.4, x2: 12, y2: 17.6 }, { t: 'divider', x1: 24, y1: 0.4, x2: 24, y2: 17.6 }]),
      heaters: [lin(6, 1.1, 130, { zy: 5.8 }), lin(6, 16.9, 130, { zy: 12.8 }), lin(18, 1.1, 130, { zy: 5.8 }), lin(18, 16.9, 130, { zy: 12.8 }), lin(30, 1.1, 130, { zy: 5.8 }), lin(30, 16.9, 130, { zy: 12.8 })],
      notes: [[6, 9.4, 'Section A · channel 1'], [18, 9.4, 'Section B · channel 2'], [30, 9.4, 'Section C · channel 3']] });
    T(svg, 380, 412, 'Quiet Tuesday: warm Section A. Full Saturday: warm all three.', { size: 14, anchor: 'middle', fill: FINK, weight: 700 });
  };

  // mounting height by use (Bromic guidance)
  CH.heights = (svg) => {
    const rc = rough.svg(svg), G = 380, F = 24; // ground y, px per ft
    add(svg, rc.line(10, G, 750, G, O({ strokeWidth: 2 })));
    const person = (x, h, sit) => { const top = G - h * F; add(svg, rc.circle(x, top + 10, 20, O({ fill: '#fff', fillStyle: 'solid' }))); add(svg, rc.line(x, top + 20, x, G - (sit ? 1.6 * F : 2.8 * F), O({ strokeWidth: 2 }))); if (sit) { add(svg, rc.line(x, G - 1.6 * F, x + 26, G - 1.6 * F, O({ strokeWidth: 2 }))); add(svg, rc.line(x + 26, G - 1.6 * F, x + 26, G, O({ strokeWidth: 2 }))); } else { add(svg, rc.line(x, G - 2.8 * F, x - 10, G, O({ strokeWidth: 2 }))); add(svg, rc.line(x, G - 2.8 * F, x + 10, G, O({ strokeWidth: 2 }))); } };
    [[130, 8, 'Seated Dining', 'About 8 ft', 'tbl'], [380, 10, 'High-Tops And The Bar Rail', 'About 10 ft', 'bar'], [630, 12, 'Entrances And Standing', 'About 12 ft', 'stand']].forEach(([x, h, t, v, k]) => {
      const y = G - h * F;
      add(svg, rc.line(x - 120, y - 12, x + 120, y - 12, O({ stroke: LINE, strokeWidth: 1 })));
      add(svg, rc.rectangle(x - 46, y - 6, 92, 12, O({ fill: INK, fillStyle: 'solid', roughness: 0.4 }))); add(svg, rc.rectangle(x - 40, y - 2, 80, 5, O({ stroke: 'none', fill: FLAME, fillStyle: 'solid' })));
      add(svg, rc.polygon([[x - 40, y + 8], [x + 40, y + 8], [x + 92, G - 30], [x - 92, G - 30]], O({ stroke: FLAME, strokeWidth: 0.8, fill: FLAME, fillStyle: 'hachure', hachureGap: 11, fillWeight: 0.6, roughness: 0.6 })));
      add(svg, rc.line(x - 108, y, x - 108, G, O({ stroke: FINK, strokeWidth: 1.2 }))); T(svg, x - 112, (y + G) / 2, v, { size: 15, anchor: 'end', fill: FINK, weight: 700, halo: '#fff' });
      if (k === 'tbl') { add(svg, rc.rectangle(x - 30, G - 2.5 * F, 60, 8, O({ fill: '#E7DCCD', fillStyle: 'solid' }))); person(x - 62, 4.4, true); person(x + 36, 4.4, true); }
      if (k === 'bar') { add(svg, rc.rectangle(x - 20, G - 3.5 * F, 70, 3.5 * F, O({ fill: '#C9C6C1', fillStyle: 'solid' }))); person(x - 50, 5.6, false); }
      if (k === 'stand') { person(x - 30, 5.8, false); person(x + 22, 5.6, false); }
      T(svg, x, G + 30, t, { size: 17, serif: true, anchor: 'middle' });
    });
  };

  // the same 40 seats (800 ft²), Platinum Electric 4500 W, by cover and climate (Bromic sizing model)
  CH.matrixc = (svg) => {
    const rc = rough.svg(svg), cols = ['Open', 'Partly covered', 'Covered'], rows = [['Mild', [7, 6, 6]], ['Cool', [8, 7, 6]], ['Cold', [10, 8, 8]]];
    const x0 = 150, y0 = 110, cw = 200, ch = 150;
    T(svg, 0, 24, 'Heaters for the same 40 seats (800 ft²)', { size: 15, weight: 700 });
    cols.forEach((c, j) => {
      const cx = x0 + j * cw + cw / 2;
      if (j === 1) for (let k = -3; k <= 3; k++) add(svg, rc.line(cx + k * 14, 50, cx + k * 14, 70, O({ stroke: INK2, strokeWidth: 1.4 })));
      if (j === 2) add(svg, rc.rectangle(cx - 50, 52, 100, 14, O({ fill: INK2, fillStyle: 'solid' })));
      if (j === 0) add(svg, rc.circle(cx, 60, 22, O({ stroke: '#E8B04B', strokeWidth: 1.4 })));
      T(svg, cx, 96, c, { size: 15, anchor: 'middle', weight: 700 });
    });
    rows.forEach(([r, v], i) => {
      const y = y0 + i * ch;
      T(svg, 0, y + ch / 2 + 6, r, { size: 26, serif: true });
      add(svg, rc.line(0, y, x0 + 3 * cw, y, O({ stroke: LINE, strokeWidth: 1, roughness: 0.4 })));
      v.forEach((n, j) => {
        const cx = x0 + j * cw + cw / 2;
        T(svg, cx, y + 62, String(n), { size: 52, serif: true, anchor: 'middle', fill: FINK });
        const per = Math.min(n, 5); for (let k = 0; k < n; k++) { const row = Math.floor(k / per), col = k % per, bx = cx - (per * 32) / 2 + col * 32; add(svg, rc.rectangle(bx + 3, y + 84 + row * 16, 26, 8, O({ fill: INK, fillStyle: 'solid', roughness: 0.4 }))); add(svg, rc.rectangle(bx + 6, y + 86 + row * 16, 20, 4, O({ stroke: 'none', fill: FLAME, fillStyle: 'solid', roughness: 0.2 }))); }
      });
    });
    add(svg, rc.line(0, y0 + 3 * ch, x0 + 3 * cw, y0 + 3 * ch, O({ stroke: LINE, strokeWidth: 1, roughness: 0.4 })));
  };

  // five-year fuel for the 40-seat example (1,000 heater hours a year), US commercial rates
  CH.fuel5 = (svg) => {
    const rc = rough.svg(svg), max = 70000, W = 520, rows = [['Natural gas', 'Tungsten Freestanding Gas × 10', 19190, 0], ['Electric', 'Platinum Electric 4500 W × 7', 22160, 0, 1], ['Propane', 'Tungsten Freestanding Gas × 10', 51082, 18417]];
    rows.forEach(([t, s, v, h, hl], i) => {
      const y = 20 + i * 92, w = W * v / max, wh = W * h / max;
      T(svg, 0, y + 22, t, { size: 22, serif: true, fill: hl ? FINK : INK }); T(svg, 0, y + 42, s, { size: 12.5, fill: INK2 });
      add(svg, rc.rectangle(230, y + 6, w, 30, O({ stroke: hl ? FINK : INK2, fill: hl ? FLAME : '#C9C6C1', fillStyle: hl ? 'solid' : 'hachure', hachureGap: 6 })));
      if (h) add(svg, rc.rectangle(230 + w, y + 6, wh, 30, O({ stroke: INK2, fill: '#8F8988', fillStyle: 'cross-hatch', hachureGap: 7 })));
      T(svg, 240 + w + wh, y + 28, '$' + (v + h).toLocaleString('en-US'), { size: 22, serif: true, fill: hl ? FINK : INK });
      if (h) T(svg, 230 + w + 4, y + 56, '+ cylinder handling', { size: 12, fill: INK2 });
    });
    T(svg, 230, 300, 'Five years of energy at full output; propane adds about 884 cylinder swaps a year.', { size: 12.5, fill: STEEL });
  };

  // payback on the worked example by the share of heated seats filled (placeholder installed cost)
  CH.payback = (svg) => {
    const rc = rough.svg(svg), rows = [['A quarter filled', 38.8], ['Half filled', 18.3, 1], ['Three quarters filled', 12.0]], W = 440, max = 40;
    rows.forEach(([t, v, hl], i) => {
      const y = 18 + i * 74, w = W * v / max;
      T(svg, 0, y + 24, t, { size: 15, weight: hl ? 700 : 400, fill: hl ? INK : INK2 });
      add(svg, rc.rectangle(190, y + 6, w, 28, O({ stroke: hl ? FINK : INK2, fill: hl ? FLAME : '#C9C6C1', fillStyle: hl ? 'solid' : 'hachure', hachureGap: 6 })));
      T(svg, 200 + w, y + 28, v.toFixed(1) + ' months', { size: 20, serif: true, fill: hl ? FINK : INK });
    });
    add(svg, rc.line(190 + W * 12 / max, 6, 190 + W * 12 / max, 232, O({ stroke: STEEL, strokeWidth: 1, strokeLineDash: [4, 5] })));
    T(svg, 190 + W * 12 / max + 6, 238, 'one year', { size: 11.5, fill: STEEL });
  };

  // running cost per hour at full output, US commercial rates
  CH.costc = (svg) => {
    const rc = rough.svg(svg), rows = [['Tungsten Freestanding Gas, natural gas', 0.38], ['Eclipse Electric 2900 W', 0.41], ['Tungsten Electric 4000 W', 0.56], ['Platinum Electric 4500 W', 0.63, 1], ['Tungsten Freestanding Gas, propane', 1.02]];
    rows.forEach(([t, v, hl], i) => {
      const y = 16 + i * 52, w = 250 * v / 1.1;
      T(svg, 0, y + 20, t, { size: 13.5, fill: hl ? INK : INK2, weight: hl ? 700 : 400 });
      add(svg, rc.rectangle(300, y + 4, w, 24, O({ stroke: hl ? FINK : INK2, fill: hl ? FLAME : '#C9C6C1', fillStyle: hl ? 'solid' : 'hachure', hachureGap: 6 })));
      T(svg, 310 + w, y + 22, v < 1 ? Math.round(v * 100) + '¢' : '$' + v.toFixed(2), { size: 19, serif: true, fill: hl ? FINK : INK });
    });
  };

  return base;
  };
})();
