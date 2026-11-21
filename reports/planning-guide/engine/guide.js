/* Planning guide drawings (rough.js). Coverage and counts come from the Bromic sizing model (templates/calculation-model.md);
   the layouts are drawn to scale in feet, each warm zone a heater's approximate coverage. */
window.REPORT_CHARTS = (BZ) => {
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

  const GEO = {
    L1: { W: 30, D: 16, roof: 'roof', sides: { top: 'house', left: 'wall', right: 'open', bottom: 'open' },
      items: [{ t: 'table', x: 4, y: 6.3, w: 8, d: 3.4, seats: { top: 3, bottom: 3, left: 1, right: 1 } },
        { t: 'sofa', x: 18.5, y: 3, w: 9, d: 2.6 }, { t: 'sofa', x: 18.5, y: 5.6, w: 2.6, d: 6 }, { t: 'coffee', x: 22, y: 7, w: 4, d: 3 }, { t: 'chair', x: 28, y: 12.5 }],
      heaters: [{ k: 'lin', x: 6, y: 8, A: 130 }, { k: 'lin', x: 10.6, y: 8, A: 130 }, { k: 'lin', x: 23, y: 7.6, A: 130 }] },
    L2: { W: 18, D: 14, roof: 'pergola', sides: { top: 'open', left: 'open', right: 'open', bottom: 'open' },
      items: [{ t: 'table', x: 5, y: 5.3, w: 8, d: 3.4, seats: { top: 3, bottom: 3, left: 1, right: 1 } }],
      heaters: [{ k: 'ecl', x: 6.8, y: 7, A: 121 }, { k: 'ecl', x: 11.2, y: 7, A: 121 }] },
    L3: { W: 20, D: 13, roof: 'roof', sides: { top: 'house', left: 'wall', right: 'open', bottom: 'open' },
      items: [{ t: 'fireplace', x: 0, y: 3.5, w: 1.6, d: 5 }, { t: 'sofa', x: 6.5, y: 3, w: 2.6, d: 7 }, { t: 'chair', x: 3.6, y: 2.8 }, { t: 'chair', x: 3.6, y: 10.2 }, { t: 'coffee', x: 3.6, y: 4.8, w: 2.4, d: 3.4 },
        { t: 'round', x: 15, y: 6.5, r: 2, n: 4 }],
      heaters: [{ k: 'lin', x: 5.5, y: 6.5, A: 130, rot: 90 }, { k: 'lin', x: 14.5, y: 6.5, A: 130, rot: 90 }] },
    L4: { W: 14, D: 9, roof: 'roof', sides: { top: 'house', left: 'wall', right: 'wall', bottom: 'rail' },
      items: [{ t: 'round', x: 7, y: 5, r: 1.6, n: 4 }, { t: 'plant', x: 1.5, y: 7.5, r: 0.9 }, { t: 'plant', x: 12.5, y: 7.5, r: 0.9 }],
      heaters: [{ k: 'lin', x: 7, y: 0.5, len: 3.6, A: 100, zx: 7, zy: 4.6 }], notes: [[7, 1.8, 'Wall heater, 72 in+']] },
    L5: { W: 20, D: 16, roof: 'none', sides: { top: 'wall', left: 'wall', right: 'open', bottom: 'open' },
      items: [{ t: 'fire', x: 8, y: 6.8, w: 4, d: 2.4 }, { t: 'sofa', x: 7, y: 3, w: 6, d: 2.6 }, { t: 'sofa', x: 7, y: 10.4, w: 6, d: 2.6 },
        { t: 'chair', x: 4.8, y: 8 }, { t: 'chair', x: 15.2, y: 8 }, { t: 'plant', x: 2, y: 2, r: 1.2 }, { t: 'plant', x: 18, y: 14, r: 1.2 }],
      heaters: [{ k: 'fs', x: 3, y: 11.5, zx: 7, zy: 8, A: 121 }, { k: 'fs', x: 17, y: 4.5, zx: 13, zy: 8, A: 121 }] },
    L6: { W: 30, D: 16, roof: 'part', roofRect: [[0, 0, 12, 10]], sides: { top: 'wall', left: 'wall', right: 'open', bottom: 'open' },
      items: [{ t: 'pool', x: 15, y: 3, w: 12, d: 10 }, { t: 'sofa', x: 1.2, y: 1.2, w: 9.6, d: 2.6 }, { t: 'sofa', x: 1.2, y: 3.8, w: 2.6, d: 5 }, { t: 'coffee', x: 5, y: 5, w: 3.6, d: 2.6 }, { t: 'chair', x: 9.6, y: 7.6 },
        { t: 'chair', x: 13.5, y: 14 }, { t: 'chair', x: 17, y: 14.2 }],
      heaters: [{ k: 'lin', x: 6, y: 5.4, A: 130 }], notes: [[6, 11.6, 'Cabana roof'], [21, 8.4, 'Pool']] },
    L7: { W: 22, D: 13, roof: 'roof', sides: { top: 'house', left: 'wall', right: 'open', bottom: 'open' },
      items: [{ t: 'counter', x: 0.4, y: 0.6, w: 11, d: 2.2, grill: [2, 0.8] }, { t: 'counter', x: 2.5, y: 5, w: 8, d: 2.4 },
        { t: 'stool', x: 3.8, y: 8.6 }, { t: 'stool', x: 5.8, y: 8.6 }, { t: 'stool', x: 7.8, y: 8.6 }, { t: 'stool', x: 9.4, y: 8.6 },
        { t: 'sofa', x: 14, y: 3, w: 2.6, d: 7 }, { t: 'coffee', x: 17.4, y: 5, w: 2.4, d: 3 }, { t: 'chair', x: 20.4, y: 4 }, { t: 'chair', x: 20.4, y: 9 }],
      heaters: [{ k: 'lin', x: 6.6, y: 9.6, A: 130 }, { k: 'lin', x: 17.4, y: 6.5, A: 130, rot: 90 }], notes: [[2.5, 4.2, 'Grill', 'start']] },
    L8: { W: 26, D: 15, roof: 'none', sides: { top: 'house', left: 'open', right: 'open', bottom: 'open' },
      items: [{ t: 'table', x: 6, y: 5.8, w: 14, d: 3.6, seats: { top: 5, bottom: 5, left: 1, right: 1 } }, { t: 'plant', x: 2, y: 13, r: 1.2 }, { t: 'plant', x: 24, y: 13, r: 1.2 }],
      heaters: [{ k: 'gas', x: 8.5, y: 0.6, len: 3, A: 215, zx: 8.5, zy: 7.4 }, { k: 'gas', x: 17.5, y: 0.6, len: 3, A: 215, zx: 17.5, zy: 7.4 }], notes: [[13, 2.2, 'Gas heaters on the house wall, 96 in+']] },
  };

  /* ---------- other drawings ---------- */
  const CH = {};
  Object.keys(GEO).forEach((k) => { CH[k] = (svg) => plan(svg, GEO[k]); });

  CH.seats = (svg) => {
    const rc = rcOf(svg);
    // left: a deck, and only the seating marked
    plan(Object.assign(el('svg', { viewBox: '0 0 470 420', x: 0, y: 0, width: 470, height: 420 }, svg)), { W: 26, D: 18, roof: 'none', sides: { top: 'house' },
      items: [{ t: 'table', x: 3, y: 6, w: 8, d: 3.4, seats: { top: 3, bottom: 3, left: 1, right: 1 } }, { t: 'sofa', x: 15, y: 4, w: 8, d: 2.4 }, { t: 'sofa', x: 15, y: 6.4, w: 2.4, d: 5 }, { t: 'coffee', x: 18.4, y: 7.2, w: 3.6, d: 2.6 }, { t: 'plant', x: 23, y: 15.5, r: 1.2 }],
      heaters: [] });
    add(svg, rc.rectangle(52, 52, 380, 288, O({ stroke: STEEL, strokeLineDash: [8, 6], roughness: 0.6 })));
    add(svg, rc.rectangle(96, 140, 168, 128, O({ stroke: FINK, fill: FLAME, fillStyle: 'hachure', hachureGap: 8, fillWeight: 0.8 })));
    add(svg, rc.rectangle(286, 112, 146, 132, O({ stroke: FINK, fill: FLAME, fillStyle: 'hachure', hachureGap: 8, fillWeight: 0.8 })));
    T(svg, 242, 380, 'Warm the seats (flame), not the whole deck (dashed)', { size: 13, anchor: 'middle', fill: INK2 });
    // right: seats to area
    [[4, 80, 'Table for four'], [6, 120, 'Lounge for six'], [8, 160, 'Table for eight'], [12, 240, 'Table for twelve']].forEach(([n, a, t], i) => {
      const y = 40 + i * 98;
      for (let k = 0; k < n; k++) add(svg, rc.rectangle(520 + (k % 6) * 22, y + Math.floor(k / 6) * 22, 16, 16, O({ stroke: INK2, strokeWidth: 1, fill: '#fff', fillStyle: 'solid', roughness: 0.7 })));
      T(svg, 790, y + 22, `≈ ${a} ft²`, { size: 30, serif: true, anchor: 'end', fill: FINK });
      T(svg, 520, y + 62, t, { size: 13, fill: INK2 });
    });
  };

  CH.open3 = (svg) => {
    const cols = +(svg.dataset.cols || 4); let G = svg;
    const rc = rcOf(svg), P = [['Open To The Sky', 'A courtyard or terrace with no roof'], ['Covered, Two Sides Open', 'A porch or loggia under a roof'], ['Three Walls, 30%+ Open', 'Still outdoor: a third of the edge open'], ['Fully Enclosed', 'Not an outdoor space – talk to a designer']];
    P.forEach(([h, d], i) => {
      G = cols >= 4 ? svg : el('g', { transform: `translate(${((i % cols) - i) * 365},${Math.floor(i / cols) * 300})` }, svg);
      const x0 = 20 + i * 365, y0 = 30, w = 300, dd = 200;
      if (i === 1 || i === 2 || i === 3) add(G, rc.rectangle(x0, y0, w, dd, O({ stroke: 'none', fill: ROOF, fillStyle: 'solid', roughness: 0.4 })));
      const L = (a, b, c, e, t) => add(G, t === 'w' ? rc.line(a, b, c, e, O({ strokeWidth: 4 })) : rc.line(a, b, c, e, O({ stroke: STEEL, strokeWidth: 1, strokeLineDash: [7, 6] })));
      const sides = [['w', 'w', 'o', 'w'], ['w', 'o', 'o', 'w'], ['w', 'w', 'o', 'w'], ['w', 'w', 'w', 'w']][i];
      L(x0, y0, x0 + w, y0, sides[0]); L(x0 + w, y0, x0 + w, y0 + dd, sides[1]); L(x0, y0 + dd, x0 + w, y0 + dd, sides[2]); L(x0, y0, x0, y0 + dd, sides[3]);
      if (i === 0) { L(x0 + w, y0, x0 + w, y0 + dd, 'w'); add(G, rc.line(x0, y0 + dd, x0 + 110, y0 + dd, O({ strokeWidth: 4 }))); add(G, rc.line(x0 + 190, y0 + dd, x0 + w, y0 + dd, O({ strokeWidth: 4 }))); }
      if (i === 3) { add(G, rc.line(x0 + 40, y0 + 40, x0 + w - 40, y0 + dd - 40, O({ stroke: FINK, strokeWidth: 3 }))); add(G, rc.line(x0 + w - 40, y0 + 40, x0 + 40, y0 + dd - 40, O({ stroke: FINK, strokeWidth: 3 }))); }
      else add(G, rc.ellipse(x0 + w / 2, y0 + dd / 2, 170, 110, O({ stroke: FLAME, fill: FLAME, fillStyle: 'hachure', hachureGap: 9, fillWeight: 0.8, strokeWidth: 1 })));
      T(G, x0, y0 + dd + 40, h, { size: 21, serif: true, fill: i === 3 ? INK2 : INK });
      T(G, x0, y0 + dd + 62, d, { size: 13, fill: INK2 });
    });
    G = svg; T(G, 20, 18, 'Plan views · solid line: wall or glass · dashed: permanently open · grey: roof', { size: 12, fill: STEEL });
  };

  CH.cloud = (svg) => {
    const rc = rcOf(svg);
    add(svg, rc.rectangle(40, 30, 640, 18, O({ fill: INK2, fillStyle: 'solid' })));
    add(svg, rc.line(60, 48, 60, 220, O({ strokeWidth: 3 }))); add(svg, rc.line(660, 48, 660, 220, O({ strokeWidth: 3 })));
    add(svg, rc.line(20, 220, 700, 220, O({ strokeWidth: 2 })));
    add(svg, rc.ellipse(360, 82, 520, 60, O({ stroke: '#F2A68F', fill: '#F6B3A5', fillStyle: 'hachure', hachureGap: 7, fillWeight: 0.7, strokeWidth: 0.8 })));
    T(svg, 360, 87, 'heat cloud: warm air held under the roof', { size: 13, anchor: 'middle', fill: FINK });
    [[220, 52], [500, 52]].forEach(([x, y]) => { add(svg, rc.rectangle(x - 50, y, 100, 10, O({ fill: INK, fillStyle: 'solid' }))); for (let k = -2; k <= 2; k++) add(svg, rc.line(x + k * 14, y + 12, x + k * 42, 190, O({ stroke: FLAME, strokeWidth: 1.2, strokeLineDash: [6, 6] }))); });
    const person = (x) => { add(svg, rc.circle(x, 158, 18, O({ fill: '#fff', fillStyle: 'solid' }))); add(svg, rc.linearPath([[x, 167], [x, 196], [x + 18, 196], [x + 18, 220]], O({ strokeWidth: 2 }))); add(svg, rc.line(x - 8, 200, x + 22, 200, O({ strokeWidth: 3, stroke: INK2 }))); };
    [170, 260, 450, 540].forEach(person);
    T(svg, 360, 245, 'Section: radiant warmth reaches people directly; the roof holds a little warm air as a bonus', { size: 12, anchor: 'middle', fill: STEEL });
  };

  CH.mounts = (svg) => {
    const cols = +(svg.dataset.cols || 4); let G = svg;
    const rc = rcOf(svg), S = 3.0, F = 450, Yin = (inch) => F - inch * S;
    const person = (x, seated) => { const top = seated ? 50 : 69;
      add(G, rc.circle(x, Yin(top - 4), 22, O({ fill: '#fff', fillStyle: 'solid' })));
      if (seated) { add(G, rc.linearPath([[x, Yin(top - 10)], [x, Yin(18)], [x + 20, Yin(18)], [x + 20, Yin(0)]], O({ strokeWidth: 2.2 }))); add(G, rc.rectangle(x - 10, Yin(18), 34, 6, O({ fill: INK2, fillStyle: 'solid' }))); }
      else add(G, rc.linearPath([[x, Yin(top - 10)], [x, Yin(32)], [x - 8, Yin(0)], [x, Yin(32)], [x + 8, Yin(0)]], O({ strokeWidth: 2.2 }))); };
    const dim = (x, inch, t) => { add(G, rc.line(x, F, x, Yin(inch), O({ stroke: FINK, strokeWidth: 1.2 }))); add(G, rc.line(x - 6, Yin(inch), x + 6, Yin(inch), O({ stroke: FINK }))); T(G, x + 8, Yin(inch / 2), t, { size: 13, fill: FINK, weight: 700 }); };
    const cone = (x, y, w, h) => add(G, rc.polygon([[x - w / 2, y], [x + w / 2, y], [x + w * 1.4, y + h], [x - w * 1.4, y + h]], O({ stroke: 'none', fill: FLAME, fillStyle: 'hachure', hachureGap: 10, fillWeight: 0.6 })));
    const P = [['Recessed Or On The Ceiling', 'Ceiling 96 in or more', 'Tungsten · Platinum Electric'], ['On A Wall Or Beam', 'Wall 72 in or more', 'Tungsten · Platinum Electric'], ['Pendant From A High Ceiling', 'Eclipse 96 in or more', 'Eclipse Electric'], ['Nothing Overhead', 'Freestanding', 'Eclipse Freestanding · Tungsten Freestanding Gas']];
    P.forEach(([h, d, f], i) => {
      G = cols >= 4 ? svg : el('g', { transform: `translate(${((i % cols) - i) * 365},${Math.floor(i / cols) * 480})` }, svg);
      const x0 = 15 + i * 365, cx = x0 + 170;
      add(G, rc.line(x0, F, x0 + 330, F, O({ strokeWidth: 2 })));
      if (i === 0) { add(G, rc.line(x0, Yin(100), x0 + 330, Yin(100), O({ strokeWidth: 4 }))); cone(cx, Yin(99), 60, 99 * S - 60); add(G, rc.rectangle(cx - 30, Yin(100) - 2, 60, 7, O({ fill: INK, fillStyle: 'solid' }))); dim(x0 + 30, 96, '96 in min.'); person(cx + 70, true); person(cx - 50, true); }
      if (i === 1) { add(G, rc.line(x0 + 40, F, x0 + 40, Yin(120), O({ strokeWidth: 5 }))); add(G, rc.polygon([[x0 + 44, Yin(78)], [x0 + 92, Yin(70)], [x0 + 92, Yin(66)], [x0 + 44, Yin(74)]], O({ fill: INK, fillStyle: 'solid' }))); add(G, rc.polygon([[x0 + 92, Yin(72)], [x0 + 300, Yin(10)], [x0 + 170, Yin(0)], [x0 + 92, Yin(66)]], O({ stroke: 'none', fill: FLAME, fillStyle: 'hachure', hachureGap: 10, fillWeight: 0.6 }))); dim(x0 + 20, 72, '72 in'); person(cx + 60, true); }
      if (i === 2) { add(G, rc.line(x0, Yin(120), x0 + 330, Yin(120), O({ strokeWidth: 4 }))); add(G, rc.line(cx, Yin(120), cx, Yin(99), O({ strokeWidth: 2 }))); add(G, rc.ellipse(cx, Yin(98), 60, 12, O({ fill: INK, fillStyle: 'solid' }))); cone(cx, Yin(97), 50, 97 * S - 60); dim(x0 + 30, 96, '96 in min.'); person(cx + 60, true); person(cx - 70, true); }
      if (i === 3) { add(G, rc.rectangle(cx + 70, F - 10, 40, 10, O({ fill: INK, fillStyle: 'solid' }))); add(G, rc.curve([[cx + 90, F - 10], [cx + 105, Yin(70)], [cx + 60, Yin(92)], [cx, Yin(88)]], O({ strokeWidth: 3 }))); add(G, rc.ellipse(cx, Yin(86), 60, 12, O({ fill: INK, fillStyle: 'solid' }))); cone(cx, Yin(85), 50, 85 * S - 60); person(cx - 20, true); }
      T(G, x0, 26, h, { size: 21, serif: true, fill: INK });
      T(G, x0, 46, d, { size: 13, fill: FINK, weight: 700 });
      T(G, x0, 64, f, { size: 12.5, fill: INK2 });
    });
  };

  CH.matrix = (svg) => {
    const rc = rcOf(svg), cols = ['Open', 'Partly covered', 'Covered'], rows = [['Mild', [3, 2, 2]], ['Cool', [3, 3, 2]], ['Cold', [4, 3, 3]]];
    const x0 = 150, y0 = 110, cw = 200, ch = 150;
    T(svg, 0, 24, 'Heaters for the same 12 seats (240 ft²)', { size: 15, weight: 700 });
    cols.forEach((c, j) => {
      const cx = x0 + j * cw + cw / 2;
      if (j === 1) for (let k = -3; k <= 3; k++) add(svg, rc.line(cx + k * 14, 50, cx + k * 14, 70, O({ stroke: INK2, strokeWidth: 1.4 })));
      if (j === 2) add(svg, rc.rectangle(cx - 50, 52, 100, 14, O({ fill: INK2, fillStyle: 'solid' })));
      if (j === 0) { add(svg, rc.circle(cx, 60, 22, O({ stroke: '#E8B04B', strokeWidth: 1.4 }))); }
      T(svg, cx, 96, c, { size: 15, anchor: 'middle', weight: 700 });
    });
    rows.forEach(([r, v], i) => {
      const y = y0 + i * ch;
      T(svg, 0, y + ch / 2 + 6, r, { size: 26, serif: true });
      add(svg, rc.line(0, y, x0 + 3 * cw, y, O({ stroke: LINE, strokeWidth: 1, roughness: 0.4 })));
      v.forEach((n, j) => {
        const cx = x0 + j * cw + cw / 2;
        T(svg, cx, y + 62, String(n), { size: 52, serif: true, anchor: 'middle', fill: FINK });
        for (let k = 0; k < n; k++) { const bx = cx - (n * 34) / 2 + k * 34; add(svg, rc.rectangle(bx + 3, y + 90, 28, 8, O({ fill: INK, fillStyle: 'solid', roughness: 0.4 }))); add(svg, rc.rectangle(bx + 6, y + 92, 22, 4, O({ stroke: 'none', fill: FLAME, fillStyle: 'solid', roughness: 0.2 }))); }
      });
    });
    add(svg, rc.line(0, y0 + 3 * ch, x0 + 3 * cw, y0 + 3 * ch, O({ stroke: LINE, strokeWidth: 1, roughness: 0.4 })));
  };

  CH.spectrum = (svg) => {
    const rc = rcOf(svg), VW = svg.viewBox.baseVal.width, VH = svg.viewBox.baseVal.height, x0 = 60, x1 = VW - 20, base = VH - 110, top = 70, X = (l) => x0 + (x1 - x0) * l / 8;
    const band = (a, b, fill) => add(svg, rc.rectangle(X(a), top - 20, X(b) - X(a), base - top + 20, O({ stroke: 'none', fill, fillStyle: 'solid', roughness: 0.3 })));
    band(0.78, 1.4, '#FBEDE8'); band(1.4, 3, '#F9DCD3'); band(3, 8, '#F4F1EE');
    ['#7A4DC7', '#3A6FD8', '#3FA34D', '#E8C73A', '#E07B2E', '#D53A2A'].forEach((c, i) => add(svg, rc.rectangle(X(0.38 + i * 0.0667), top - 20, X(0.0667) - X(0) + 1, base - top + 20, O({ stroke: 'none', fill: c, fillStyle: 'solid', roughness: 0 }))));
    const planck = (l, Tk) => 1 / (Math.pow(l, 5) * (Math.exp(14388 / (l * Tk)) - 1));
    // each curve labelled at its own peak, with a short leader, staggered so no label meets another
    [[2400, 'Short wave · about 2,400 K', STEEL, [6, 4], 'end', 0], [1200, 'Medium wave · about 1,200 K', FINK, null, 'start', 0], [700, 'Long wave · about 700 K', INK2, [3, 5], 'start', 40]].forEach(([Tk, lab, col, dash, anc, dy]) => {
      const pk = 2898 / Tk, mx = planck(pk, Tk), pts = [];
      for (let l = 0.3; l <= 8; l += 0.05) pts.push([X(l), base - (base - top - 34) * planck(l, Tk) / mx]);
      add(svg, rc.curve(pts, O({ stroke: col, strokeWidth: Tk === 1200 ? 3.4 : 2, roughness: 0.6, strokeLineDash: dash || undefined })));
      const ly = top - 32 + dy, lx = X(pk) + (anc === 'end' ? -10 : 10);
      add(svg, rc.line(X(pk), top + 12, X(pk), ly + 6, O({ stroke: col, strokeWidth: 1 })));
      add(svg, rc.line(X(pk), ly + 6, lx, ly + 6, O({ stroke: col, strokeWidth: 1 })));
      T(svg, lx + (anc === 'end' ? -4 : 4), ly + 10, lab, { size: 14, fill: col, weight: 700, anchor: anc, halo: '#fff' });
    });
    add(svg, rc.line(x0, base, x1, base, O({ strokeWidth: 1.6 })));
    for (let l = 0; l <= 8; l++) T(svg, X(l), base + 20, l + ' µm', { size: 12, anchor: 'middle', fill: STEEL });
    // band names under the axis, on two rows so neighbours never touch
    [[0.58, 'Visible', '#4A4546', 0], [1.09, 'IR-A · short wave, 0.78–1.4 µm', INK2, 1], [2.2, 'IR-B · medium wave, 1.4–3 µm', FINK, 0], [5.5, 'IR-C · long wave, 3 µm and beyond', INK2, 1]].forEach(([l, t, c, r]) =>
      T(svg, X(l), base + 46 + r * 20, t, { size: 13, anchor: 'middle', fill: c, weight: 700 }));
    T(svg, x0, base + 98, 'Each curve is scaled to its own peak: hotter elements peak at shorter wavelengths and glow brighter.', { size: 12.5, fill: STEEL });
  };

  CH.scale = (svg) => {
    const rc = rcOf(svg), s = 8.2; let x = 8;
    [[65, 'Tungsten 2000 W'], [100, 'Tungsten 3000 W'], [121, 'Eclipse'], [143, 'Platinum 4500 W'], [215, 'Freestanding gas']].forEach(([A, t]) => {
      const d = 2 * Math.sqrt(A / Math.PI) * s, cx = x + d / 2;
      add(svg, rc.circle(cx, 78, d, O({ stroke: FLAME, fill: FLAME, fillStyle: 'hachure', hachureGap: 7, fillWeight: 0.7, strokeWidth: 1 })));
      T(svg, cx, 160, `${A} ft²`, { size: 19, serif: true, anchor: 'middle', fill: FINK }); T(svg, cx, 180, t, { size: 11.5, anchor: 'middle', fill: INK2 });
      x += d + 14;
    });
    add(svg, rc.line(x - 6, 208, x - 6 - 10 * s, 208, O({ strokeWidth: 1.4 }))); T(svg, x - 12 - 10 * s, 212, 'Scale: 10 ft', { size: 11, anchor: 'end', fill: STEEL });
  };

  CH.cost = (svg) => {
    const rc = rcOf(svg), rows = [['Tungsten Electric 2000 W', 0.37], ['Eclipse Electric 2900 W', 0.53], ['Platinum Gas 23,600 Btu, natural gas', 0.60], ['Tungsten Electric 4000 W', 0.73, 1], ['Platinum Electric 4500 W', 0.82], ['Tungsten Electric 6000 W', 1.10]];
    rows.forEach(([t, v, hl], i) => {
      const y = 22 + i * 50, w = 290 * v / 1.1;
      T(svg, 0, y + 20, t, { size: 13.5, fill: hl ? INK : INK2, weight: hl ? 700 : 400 });
      add(svg, rc.rectangle(260, y + 4, w, 24, O({ stroke: hl ? FINK : INK2, fill: hl ? FLAME : '#C9C6C1', fillStyle: hl ? 'solid' : 'hachure', hachureGap: 6 })));
      T(svg, 270 + w, y + 22, v < 1 ? Math.round(v * 100) + '¢' : '$' + v.toFixed(2), { size: 19, serif: true, fill: hl ? FINK : INK });
    });
  };

  CH.phone = (svg) => {
    const rc = rcOf(svg);
    add(svg, rc.path('M50 10 h160 q18 0 18 18 v244 q0 18 -18 18 h-160 q-18 0 -18 -18 v-244 q0 -18 18 -18 z', O({ strokeWidth: 2.2, fill: '#fff', fillStyle: 'solid' })));
    T(svg, 130, 52, 'Evening', { size: 20, serif: true, anchor: 'middle' });
    [['Lights', 0.55, INK2], ['Heat · Lounge', 0.75, FLAME], ['Heat · Dining', 0.45, FLAME]].forEach(([t, v, c], i) => {
      const y = 92 + i * 56; T(svg, 56, y, t, { size: 12, weight: 700 });
      add(svg, rc.line(56, y + 16, 204, y + 16, O({ stroke: LINE, strokeWidth: 4, roughness: 0.5 }))); add(svg, rc.line(56, y + 16, 56 + 148 * v, y + 16, O({ stroke: c, strokeWidth: 4, roughness: 0.5 })));
      add(svg, rc.circle(56 + 148 * v, y + 16, 14, O({ stroke: c, fill: '#fff', fillStyle: 'solid' })));
    });
    T(svg, 56, 266, 'Off at 11 pm', { size: 11.5, fill: INK2 });
  };

  CH.timeline = (svg) => {
    const cols = +(svg.dataset.cols || 4); let G = svg;
    const rc = rcOf(svg), P = [['1', 'Frame', 'Mark each heater’s place and add blocking'], ['2', 'Rough-In', 'Circuits, junction boxes, recess kits, the controller’s spot'], ['3', 'Ceiling Closes', 'The wiring is hidden, exactly where the heaters hang'], ['4', 'Heaters Fitted', 'Heaters, controller, wall switch and app set up']];
    P.forEach(([n, h, d], i) => {
      G = cols >= 4 ? svg : el('g', { transform: `translate(${((i % cols) - i) * 365},${Math.floor(i / cols) * 330})` }, svg);
      const x0 = 10 + i * 365, y = 110;
      for (let k = 0; k < 6; k++) add(G, rc.rectangle(x0 + k * 52, y, 12, 40, O({ fill: '#D9C7AE', fillStyle: 'solid', strokeWidth: 1 })));
      if (i === 0) [[x0 + 90, y + 60], [x0 + 210, y + 60]].forEach(([x, yy]) => { add(G, rc.line(x - 10, yy - 6, x + 10, yy + 6, O({ stroke: FINK, strokeWidth: 2 }))); add(G, rc.line(x + 10, yy - 6, x - 10, yy + 6, O({ stroke: FINK, strokeWidth: 2 }))); });
      if (i >= 1) { add(G, rc.linearPath([[x0, y + 26], [x0 + 300, y + 26]], O({ stroke: FLAME, strokeWidth: 2, strokeLineDash: i === 1 ? undefined : [6, 6] }))); [x0 + 90, x0 + 210].forEach((x) => add(G, rc.rectangle(x - 30, y + 36, 60, 12, O({ stroke: i === 1 ? INK2 : INK, fill: i === 3 ? INK : 'none', fillStyle: 'solid' })))); }
      if (i >= 2) add(G, rc.rectangle(x0, y + 48, 310, 8, O({ fill: '#E7DCCD', fillStyle: 'solid', strokeWidth: 1 })));
      if (i === 3) [x0 + 90, x0 + 210].forEach((x) => { add(G, rc.rectangle(x - 26, y + 50, 52, 5, O({ stroke: 'none', fill: FLAME, fillStyle: 'solid' }))); add(G, rc.polygon([[x - 26, y + 58], [x + 26, y + 58], [x + 60, y + 140], [x - 60, y + 140]], O({ stroke: 'none', fill: FLAME, fillStyle: 'hachure', hachureGap: 10, fillWeight: 0.6 }))); });
      if (i < 3 && (cols >= 4 || i % cols === 0)) T(G, x0 + 338, y + 36, '→', { size: 34, serif: true, fill: FLAME, anchor: 'middle' });
      T(G, x0, 60, n, { size: 46, serif: true, fill: FLAME });
      T(G, x0 + 40, 58, h, { size: 22, serif: true });
      T(G, x0, 290, d, { size: 13, fill: INK2 });
    });
    G = svg; T(G, 10, cols >= 4 ? 340 : 650, 'Section through the ceiling at each stage', { size: 12, fill: STEEL });
  };

  return { CH, MINI: {} };
};
