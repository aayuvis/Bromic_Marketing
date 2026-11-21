/* Professional Edition drawings (rough.js), added on top of guide.js. Figures come from content/guides/A02-planning-guide-v2-pro.md,
   the Series II manual and LC recess-kit instructions (cad/REAL-INSTALL-STUDY.md §5) and the Bromic sizing model.
   Layouts follow real installs: heaters at the edges, faces toward the seats, in rows or pairs. */
(() => {
  const base = window.REPORT_CHARTS;
  window.REPORT_CHARTS = (BZ) => {
    const r = base(BZ), CH = r.CH;
    const { T, O, add, el, INK, INK2, STEEL, FLAME, FINK, LINE } = BZ;
    const ROOF = '#ECEAE6', WOOD = '#D9C7AE', rcOf = (svg) => rough.svg(svg);
    let gid = 0;
    const grad = (svg) => {
      const id = 'pz' + (gid++), d = el('defs', {}, svg), g = el('radialGradient', { id }, d);
      el('stop', { offset: '0%', 'stop-color': FLAME, 'stop-opacity': 0.42 }, g);
      el('stop', { offset: '70%', 'stop-color': FLAME, 'stop-opacity': 0.15 }, g);
      el('stop', { offset: '100%', 'stop-color': FLAME, 'stop-opacity': 0.03 }, g);
      return id;
    };
    const dimV = (G, x, y1, y2, t, side = 1) => { const rc = rcOf(G); add(G, rc.line(x, y1, x, y2, O({ stroke: FINK, strokeWidth: 1.2, roughness: 0.4 }))); add(G, rc.line(x - 5, y1, x + 5, y1, O({ stroke: FINK, roughness: 0.3 }))); add(G, rc.line(x - 5, y2, x + 5, y2, O({ stroke: FINK, roughness: 0.3 }))); T(G, x + side * 8, (y1 + y2) / 2 + 4, t, { size: 12.5, fill: FINK, weight: 700, anchor: side > 0 ? 'start' : 'end', halo: '#fff' }); };
    const dimH = (G, x1, x2, y, t) => { const rc = rcOf(G); add(G, rc.line(x1, y, x2, y, O({ stroke: FINK, strokeWidth: 1.2, roughness: 0.4 }))); add(G, rc.line(x1, y - 5, x1, y + 5, O({ stroke: FINK, roughness: 0.3 }))); add(G, rc.line(x2, y - 5, x2, y + 5, O({ stroke: FINK, roughness: 0.3 }))); T(G, (x1 + x2) / 2, y - 8, t, { size: 12.5, fill: FINK, weight: 700, anchor: 'middle', halo: '#fff' }); };
    const person = (G, x, floor, seated, scale = 3) => { const rc = rcOf(G), Y = (inch) => floor - inch * scale, top = seated ? 50 : 69;
      add(G, rc.circle(x, Y(top - 4), 7.4 * scale, O({ fill: '#fff', fillStyle: 'solid' })));
      if (seated) { add(G, rc.linearPath([[x, Y(top - 10)], [x, Y(18)], [x + 6.6 * scale, Y(18)], [x + 6.6 * scale, Y(0)]], O({ strokeWidth: 2.2 }))); add(G, rc.rectangle(x - 3.3 * scale, Y(18), 11 * scale, 2 * scale, O({ fill: INK2, fillStyle: 'solid' }))); }
      else add(G, rc.linearPath([[x, Y(top - 10)], [x, Y(32)], [x - 2.6 * scale, Y(0)], [x, Y(32)], [x + 2.6 * scale, Y(0)]], O({ strokeWidth: 2.2 }))); };
    // a heater in section: a slim rounded body, glowing face toward `ang` (degrees from straight down, + = toward the right)
    const heater = (G, cx, cy, ang, L = 70) => {
      const rc = rcOf(G), g = el('g', { transform: `rotate(${ang} ${cx} ${cy})` }, G);
      add(g, rc.rectangle(cx - L / 2, cy - 7, L, 14, O({ fill: INK, fillStyle: 'solid', roughness: 0.4 })));
      add(g, rc.rectangle(cx - L / 2 + 5, cy + 3, L - 10, 4, O({ stroke: 'none', fill: FLAME, fillStyle: 'solid', roughness: 0.2 })));
      return g;
    };
    const glow = (G, cx, cy, ang, len, spread) => { // a soft warm wedge from the heater face
      const a = (ang) * Math.PI / 180, dx = Math.sin(a), dy = Math.cos(a), px = Math.cos(a), py = -Math.sin(a);
      add(G, rcOf(G).polygon([[cx - px * 26, cy - py * 26], [cx + px * 26, cy + py * 26], [cx + dx * len + px * spread, cy + dy * len + py * spread], [cx + dx * len - px * spread, cy + dy * len - py * spread]], O({ stroke: 'none', fill: FLAME, fillStyle: 'hachure', hachureGap: 10, fillWeight: 0.6 })));
    };

    /* ---------- plans with real-install placement ---------- */
    function pplan(svg, G) {
      const rc = rcOf(svg), VW = +svg.viewBox.baseVal.width, VH = +svg.viewBox.baseVal.height;
      const s = Math.min((VW - 120) / G.W, (VH - 86) / G.D), ox = (VW - G.W * s) / 2 + 4, oy = 34 + (VH - 86 - G.D * s) / 2;
      const X = (x) => ox + x * s, Y = (y) => oy + y * s, zid = grad(svg);
      if (G.roof === 'roof') add(svg, rc.rectangle(X(0), Y(0), G.W * s, G.D * s, O({ stroke: 'none', fill: ROOF, fillStyle: 'solid', roughness: 0.4 })));
      if (G.roof === 'louvre') for (let y = 0.8; y < G.D; y += 1.1) add(svg, rc.line(X(0.3), Y(y), X(G.W - 0.3), Y(y), O({ stroke: '#C9C6C1', strokeWidth: 1, roughness: 0.5 })));
      if (G.roof === 'louvre' || G.beams) [[0, 0, G.W, 0], [0, G.D, G.W, G.D], [0, 0, 0, G.D], [G.W, 0, G.W, G.D]].forEach(([a, b, c, d]) => add(svg, rc.line(X(a), Y(b), X(c), Y(d), O({ stroke: '#8F877C', strokeWidth: 5, roughness: 0.4 }))));
      (G.joists || []).forEach((x) => add(svg, rc.line(X(x), Y(0.3), X(x), Y(G.D - 0.3), O({ stroke: '#CFC9C0', strokeWidth: 1, strokeLineDash: [3, 5], roughness: 0.3 }))));
      // warm zones, set toward the seats from each heater
      (G.heaters || []).forEach((h) => {
        const rr = Math.sqrt(h.A / Math.PI), f = h.face || [0, 0], off = h.off ?? 0, cx = h.x + f[0] * off, cy = h.y + f[1] * off;
        let rx = rr * 1.2, ry = rr / 1.2; if (h.k === 'ecl') rx = ry = rr; if (h.rot === 90) [rx, ry] = [ry, rx];
        el('ellipse', { cx: X(cx), cy: Y(cy), rx: rx * s, ry: ry * s, fill: `url(#${zid})` }, svg);
        add(svg, rc.ellipse(X(cx), Y(cy), 2 * rx * s, 2 * ry * s, O({ stroke: FLAME, strokeWidth: 1, strokeLineDash: [5, 5], roughness: 0.8 })));
      });
      const chair = (x, y) => add(svg, rc.rectangle(X(x - 0.9), Y(y - 0.9), 1.8 * s, 1.8 * s, O({ stroke: INK2, strokeWidth: 1, fill: '#fff', fillStyle: 'solid', roughness: 0.7 })));
      (G.items || []).forEach((i) => {
        if (i.t === 'table') { const st = i.seats || {}, row = (n, y) => { for (let k = 0; k < n; k++) chair(i.x + (k + 0.5) * i.w / n, y); };
          row(st.top || 0, i.y - 1.2); row(st.bottom || 0, i.y + i.d + 1.2); if (st.left) chair(i.x - 1.2, i.y + i.d / 2); if (st.right) chair(i.x + i.w + 1.2, i.y + i.d / 2);
          add(svg, rc.rectangle(X(i.x), Y(i.y), i.w * s, i.d * s, O({ fill: '#E7DCCD', fillStyle: 'solid', strokeWidth: 1.4 }))); }
        if (i.t === 'sofa') add(svg, rc.rectangle(X(i.x), Y(i.y), i.w * s, i.d * s, O({ fill: '#D9D4CC', fillStyle: 'solid', strokeWidth: 1.2 })));
        if (i.t === 'chair') add(svg, rc.rectangle(X(i.x - 1.25), Y(i.y - 1.25), 2.5 * s, 2.5 * s, O({ fill: '#D9D4CC', fillStyle: 'solid', strokeWidth: 1.2 })));
        if (i.t === 'stool') add(svg, rc.circle(X(i.x), Y(i.y), 1.3 * s, O({ fill: '#fff', fillStyle: 'solid', strokeWidth: 1, stroke: INK2 })));
        if (i.t === 'coffee') add(svg, rc.rectangle(X(i.x), Y(i.y), i.w * s, i.d * s, O({ fill: '#E7DCCD', fillStyle: 'solid', strokeWidth: 1 })));
        if (i.t === 'fireplace') add(svg, rc.rectangle(X(i.x), Y(i.y), i.w * s, i.d * s, O({ fill: '#B9B2A8', fillStyle: 'cross-hatch', hachureGap: 5 })));
        if (i.t === 'counter') { add(svg, rc.rectangle(X(i.x), Y(i.y), i.w * s, i.d * s, O({ fill: '#C9C6C1', fillStyle: 'solid', strokeWidth: 1.2 }))); if (i.grill) add(svg, rc.rectangle(X(i.grill[0]), Y(i.grill[1]), 3 * s, i.d * s * 0.8, O({ fill: '#3A3534', fillStyle: 'solid' }))); }
        if (i.t === 'plant') add(svg, rc.circle(X(i.x), Y(i.y), 2 * i.r * s, O({ stroke: '#6E8B5E', fill: '#CFDCC4', fillStyle: 'hachure', hachureGap: 5 })));
      });
      const side = (k, x1, y1, x2, y2, lx, ly, anchor) => {
        const t = G.sides[k]; if (!t) return;
        if (t === 'house') { add(svg, rc.rectangle(Math.min(X(x1), X(x2)) - (y1 === y2 ? 0 : 7), Math.min(Y(y1), Y(y2)) - (y1 === y2 ? 7 : 0), y1 === y2 ? Math.abs(X(x2) - X(x1)) : 8, y1 === y2 ? 8 : Math.abs(Y(y2) - Y(y1)), O({ fill: INK, fillStyle: 'solid', roughness: 0.5 }))); T(svg, lx, ly, 'House', { size: 12, anchor, fill: INK2, weight: 700 }); }
        else if (t === 'wall') add(svg, rc.line(X(x1), Y(y1), X(x2), Y(y2), O({ strokeWidth: 3.6 })));
        else if (t === 'glass') { add(svg, rc.line(X(x1), Y(y1), X(x2), Y(y2), O({ strokeWidth: 3, stroke: '#7FA7B8' }))); T(svg, lx, ly, 'Glazing', { size: 12, anchor, fill: '#5F8797', weight: 700 }); }
        else if (t === 'rail') { add(svg, rc.line(X(x1), Y(y1), X(x2), Y(y2), O({ strokeWidth: 1.4, stroke: INK2 }))); T(svg, lx, ly, 'Railing, open', { size: 12, anchor, fill: STEEL }); }
        else if (t === 'open') { add(svg, rc.line(X(x1), Y(y1), X(x2), Y(y2), O({ stroke: STEEL, strokeWidth: 1, strokeLineDash: [7, 6], roughness: 0.5 }))); T(svg, lx, ly, 'Open', { size: 12, anchor, fill: STEEL }); }
      };
      side('top', 0, 0, G.W, 0, X(G.W / 2), Y(0) - 12, 'middle'); side('bottom', 0, G.D, G.W, G.D, X(G.W / 2), Y(G.D) + 20, 'middle');
      side('left', 0, 0, 0, G.D, X(0) - 10, Y(G.D / 2), 'end'); side('right', G.W, 0, G.W, G.D, X(G.W) + 10, Y(G.D / 2), 'start');
      (G.heaters || []).forEach((h) => {
        if (h.k === 'ecl') { add(svg, rc.circle(X(h.x), Y(h.y), 2.2 * s, O({ fill: INK, fillStyle: 'solid' }))); add(svg, rc.circle(X(h.x), Y(h.y), 1.2 * s, O({ stroke: 'none', fill: FLAME, fillStyle: 'solid' }))); }
        else { const L = (h.len || 4.7) * s, w = (h.k === 'gas' ? 1.1 : 0.75) * s, v = h.rot === 90, x = X(h.x) - (v ? w / 2 : L / 2), y = Y(h.y) - (v ? L / 2 : w / 2);
          add(svg, rc.rectangle(x, y, v ? w : L, v ? L : w, O({ fill: INK, fillStyle: 'solid', roughness: 0.4 })));
          add(svg, rc.rectangle(x + (v ? w * 0.25 : 3), y + (v ? 3 : w * 0.25), v ? w * 0.5 : L - 6, v ? L - 6 : w * 0.5, O({ stroke: 'none', fill: FLAME, fillStyle: 'solid', roughness: 0.3 }))); }
        if (h.face && (h.face[0] || h.face[1])) { const x0 = X(h.x) + h.face[0] * 0.9 * s, y0 = Y(h.y) + h.face[1] * 0.9 * s, x1 = x0 + h.face[0] * 2.2 * s, y1 = y0 + h.face[1] * 2.2 * s;
          add(svg, rc.line(x0, y0, x1, y1, O({ stroke: FINK, strokeWidth: 2, roughness: 0.3 })));
          const a = Math.atan2(y1 - y0, x1 - x0); add(svg, rc.polygon([[x1, y1], [x1 - 9 * Math.cos(a - 0.45), y1 - 9 * Math.sin(a - 0.45)], [x1 - 9 * Math.cos(a + 0.45), y1 - 9 * Math.sin(a + 0.45)]], O({ stroke: FINK, fill: FINK, fillStyle: 'solid', roughness: 0.2 }))); }
        if (h.tag) { const tx = X(h.x + (h.tagd ? h.tagd[0] : 0)), ty = Y(h.y + (h.tagd ? h.tagd[1] : -1.3)); add(svg, rc.circle(tx, ty, 22, O({ stroke: INK, fill: '#fff', fillStyle: 'solid', roughness: 0.5 }))); T(svg, tx, ty + 4, h.tag, { size: 11, anchor: 'middle', weight: 700 }); }
      });
      T(svg, X(0), Y(G.D) + (G.sides.bottom ? 40 : 22), `${G.W} × ${G.D} ft`, { size: 12.5, fill: INK2, weight: 700 });
      (G.notes || []).forEach(([x, y, t, a]) => T(svg, X(x), Y(y), t, { size: 11.5, fill: INK2, anchor: a || 'middle', halo: '#FAFAF8' }));
    }
    // Counts are the Bromic sizing model's for cool evenings (see build_pro.py LAYOUTS). Tungsten 3/6 kW 1,436 mm (4.7 ft), 2/4 kW 1,144 mm (3.75 ft).
    const PG = {
      P1: { W: 24, D: 16, roof: 'roof', sides: { top: 'house', left: 'wall', right: 'open', bottom: 'open' }, joists: [4, 8, 12, 16, 20],
        items: [{ t: 'table', x: 3, y: 7, w: 9, d: 3.4, seats: { top: 4, bottom: 4, left: 1, right: 1 } }, { t: 'sofa', x: 15.5, y: 3, w: 7, d: 2.6 }, { t: 'sofa', x: 15.5, y: 5.6, w: 2.6, d: 5 }, { t: 'coffee', x: 18.6, y: 6.6, w: 3.4, d: 2.6 }, { t: 'chair', x: 21.6, y: 12.4 }],
        heaters: [{ k: 'lin', x: 5.5, y: 8.7, A: 150, tag: 'H1', face: [0, 0] }, { k: 'lin', x: 10.5, y: 8.7, A: 150, tag: 'H2', face: [0, 0] }, { k: 'lin', x: 19.5, y: 8.4, A: 150, tag: 'H3', face: [0, 0] }],
        notes: [[12, 14.6, 'Recessed between the joists, in a row parallel to the open edge']] },
      P2: { W: 20, D: 14, roof: 'roof', sides: { top: 'house', left: 'wall', right: 'open', bottom: 'open' },
        items: [{ t: 'fireplace', x: 0, y: 4.2, w: 1.6, d: 5 }, { t: 'sofa', x: 4.2, y: 3, w: 2.6, d: 8 }, { t: 'coffee', x: 7.6, y: 5.2, w: 2.6, d: 3.6 }, { t: 'chair', x: 11.6, y: 4 }, { t: 'chair', x: 11.6, y: 10.2 },
          { t: 'table', x: 14.2, y: 5.4, w: 3.2, d: 3.2, seats: { top: 2, bottom: 2, left: 0, right: 1 } }],
        heaters: [{ k: 'lin', x: 6.5, y: 1.8, A: 150, tag: 'H1', face: [0, 1], off: 4.6 }, { k: 'lin', x: 15.4, y: 12.2, A: 150, tag: 'H2', face: [0, -1], off: 4.6, tagd: [0, 1.4] }],
        notes: [[8, 13.2, 'Pitched ceiling: adaptor, vertical post, heater level']] },
      P3: { W: 22, D: 14, roof: 'louvre', sides: { top: 'house', left: 'open', right: 'open', bottom: 'open' },
        items: [{ t: 'counter', x: 0.6, y: 0.8, w: 11, d: 2.2, grill: [2, 1] }, { t: 'counter', x: 2.5, y: 5, w: 8, d: 2.4 },
          { t: 'stool', x: 3.8, y: 8.6 }, { t: 'stool', x: 5.8, y: 8.6 }, { t: 'stool', x: 7.8, y: 8.6 }, { t: 'stool', x: 9.4, y: 8.6 },
          { t: 'sofa', x: 14.4, y: 3.4, w: 2.6, d: 7 }, { t: 'coffee', x: 17.6, y: 5.2, w: 2.4, d: 3.2 }, { t: 'chair', x: 20.6, y: 4.4 }, { t: 'chair', x: 20.6, y: 9.6 }],
        heaters: [{ k: 'lin', x: 6.6, y: 13.4, len: 3.75, A: 110, tag: 'H1', face: [0, -1], off: 4.4, tagd: [0, 1.4] }, { k: 'lin', x: 17.2, y: 13.4, len: 3.75, A: 110, tag: 'H2', face: [0, -1], off: 5.4, tagd: [0, 1.4] }, { k: 'lin', x: 21.4, y: 7, len: 3.75, A: 110, rot: 90, tag: 'H3', face: [-1, 0], off: 3.4, tagd: [-1.6, -2.6] }],
        notes: [[6.6, 4.2, 'Grill']] },
      P4: { W: 30, D: 10, roof: 'roof', sides: { top: 'house', left: 'wall', right: 'wall', bottom: 'open' }, joists: [5, 10, 15, 20, 25],
        items: [{ t: 'chair', x: 3, y: 6 }, { t: 'chair', x: 6.2, y: 6 }, { t: 'coffee', x: 4, y: 3.2, w: 2.6, d: 1.6 }, { t: 'sofa', x: 11, y: 4.6, w: 8, d: 2.6 }, { t: 'chair', x: 21.6, y: 6 }, { t: 'chair', x: 24.8, y: 6 }, { t: 'coffee', x: 22.4, y: 3.2, w: 2.6, d: 1.6 }],
        heaters: [{ k: 'lin', x: 5, y: 4.4, A: 122, tag: 'H1' }, { k: 'lin', x: 15, y: 4.4, A: 122, tag: 'H2' }, { k: 'lin', x: 25, y: 4.4, A: 122, tag: 'H3' }],
        notes: [[15, 1.4, 'A row of three, at least 500 mm from the house wall']] },
      P5: { W: 20, D: 12, roof: 'roof', sides: { top: 'glass', left: 'wall', right: 'open', bottom: 'rail' },
        items: [{ t: 'sofa', x: 2, y: 2.4, w: 8, d: 2.6 }, { t: 'coffee', x: 4, y: 6, w: 4, d: 2.4 }, { t: 'chair', x: 3, y: 10.2 }, { t: 'chair', x: 9, y: 10.2 },
          { t: 'table', x: 13, y: 4, w: 3.4, d: 3.4, seats: { top: 2, bottom: 2, left: 0, right: 0 } }],
        heaters: [{ k: 'lin', x: 6, y: 0.6, A: 150, tag: 'H1', face: [0, 1], off: 5.2, tagd: [-4, 0.4] }, { k: 'lin', x: 14.7, y: 0.6, A: 150, tag: 'H2', face: [0, 1], off: 5.2, tagd: [4, 0.4] }],
        notes: [[10, 9.2, 'Wall brackets on the glazing frame, angled down']] },
      P6: { W: 26, D: 15, roof: 'none', sides: { top: 'house', left: 'open', right: 'open', bottom: 'open' },
        items: [{ t: 'table', x: 6, y: 5.8, w: 14, d: 3.6, seats: { top: 5, bottom: 5, left: 1, right: 1 } }, { t: 'plant', x: 2, y: 13, r: 1.2 }, { t: 'plant', x: 24, y: 13, r: 1.2 }],
        heaters: [{ k: 'gas', x: 8.5, y: 0.6, len: 3, A: 155, tag: 'H1', face: [0, 1], off: 6.8, tagd: [-2.8, 0.4] }, { k: 'gas', x: 17.5, y: 0.6, len: 3, A: 155, tag: 'H2', face: [0, 1], off: 6.8, tagd: [2.8, 0.4] }],
        notes: [[13, 13.6, 'Gas on the house wall at 96 in or more, deflectors above']] },
    };
    Object.keys(PG).forEach((k) => { CH[k] = (svg) => pplan(svg, PG[k]); });

    /* ---------- reflected ceiling plan coordination ---------- */
    CH.rcp = (svg) => {
      const rc = rcOf(svg), x0 = 40, y0 = 40, W = 560, H = 330;
      add(svg, rc.rectangle(x0, y0, W, H, O({ fill: ROOF, fillStyle: 'solid', strokeWidth: 2 })));
      for (let x = x0 + 70; x < x0 + W; x += 70) add(svg, rc.line(x, y0 + 4, x, y0 + H - 4, O({ stroke: '#CFC9C0', strokeWidth: 1, strokeLineDash: [3, 5], roughness: 0.3 })));
      add(svg, rc.rectangle(x0 + 30, y0 + 120, 300, 150, O({ stroke: STEEL, strokeWidth: 1, strokeLineDash: [6, 5], roughness: 0.4 }))); T(svg, x0 + 180, y0 + 290, 'Seating below', { size: 12, fill: STEEL, anchor: 'middle' });
      [[x0 + 105, y0 + 195], [x0 + 245, y0 + 195]].forEach(([x, y]) => { el('ellipse', { cx: x, cy: y, rx: 80, ry: 62, fill: 'rgba(239,65,35,.14)' }, svg); add(svg, rc.rectangle(x - 46, y - 8, 92, 16, O({ fill: INK, fillStyle: 'solid', roughness: 0.4 }))); add(svg, rc.rectangle(x - 40, y - 3, 80, 6, O({ stroke: 'none', fill: FLAME, fillStyle: 'solid' }))); });
      [[x0 + 175, y0 + 140], [x0 + 175, y0 + 250], [x0 + 35, y0 + 60], [x0 + 315, y0 + 60], [x0 + 420, y0 + 160], [x0 + 520, y0 + 160], [x0 + 420, y0 + 280], [x0 + 520, y0 + 280]].forEach(([x, y]) => { add(svg, rc.circle(x, y, 16, O({ fill: '#fff', fillStyle: 'solid', strokeWidth: 1.2 }))); add(svg, rc.line(x - 5, y - 5, x + 5, y + 5, O({ strokeWidth: 1 }))); add(svg, rc.line(x + 5, y - 5, x - 5, y + 5, O({ strokeWidth: 1 }))); });
      const fx = x0 + 470, fy = y0 + 220; add(svg, rc.circle(fx, fy, 22, O({ fill: '#fff', fillStyle: 'solid' }))); for (let k = 0; k < 3; k++) { const a = k * 2.094 + 0.3; add(svg, rc.line(fx + 11 * Math.cos(a), fy + 11 * Math.sin(a), fx + 60 * Math.cos(a), fy + 60 * Math.sin(a), O({ strokeWidth: 3, stroke: INK2 }))); }
      [[x0 + 470, y0 + 60], [x0 + 540, y0 + 60]].forEach(([x, y]) => add(svg, rc.rectangle(x - 9, y - 9, 18, 18, O({ fill: INK2, fillStyle: 'solid' }))));
      add(svg, rc.rectangle(x0 + W - 26, y0 + H - 34, 18, 22, O({ fill: '#fff', fillStyle: 'solid' })));
      const call = (x1, y1, x2, y2, t, a = 'start') => { add(svg, rc.line(x1, y1, x2, y2, O({ stroke: FINK, strokeWidth: 1, roughness: 0.3 }))); T(svg, x2 + (a === 'start' ? 6 : -6), y2 + 4, t, { size: 13, fill: INK, anchor: a }); };
      call(x0 + 245, y0 + 187, x0 + W + 30, y0 + 120, 'Heaters over the seating, in a row');
      call(x0 + 175, y0 + 140, x0 + W + 30, y0 + 160, 'Downlights between, not under, the heaters');
      call(fx + 30, fy - 30, x0 + W + 30, y0 + 200, 'Fan clear of the heat path');
      call(x0 + 540, y0 + 60, x0 + W + 30, y0 + 40, 'Speakers and sensors off the heater line');
      call(x0 + W - 17, y0 + H - 23, x0 + W + 30, y0 + 300, 'Junction box with access');
      call(x0 + 330, y0 + 270, x0 + W + 30, y0 + 250, 'Heat zones drawn before finishes');
      T(svg, x0, 24, 'Reflected ceiling plan · heaters coordinated with lighting, fans and speakers', { size: 13, fill: STEEL, weight: 700 });
    };

    /* ---------- Series II mounts, in elevation ---------- */
    CH.series2 = (svg) => {
      const cols = +(svg.dataset.cols || 5), F = 420, S = 2.6, Yin = (i) => F - i * S;
      const P = [['On A Wall Or Beam', 'Angled bracket on the single post', 'Wall 72 in or more'], ['Flat Ceiling, Near The Edge', 'Short post, tilted toward the seats', 'Ceiling 96 in or more'],
        ['Pitched Ceiling', 'Adaptor 3/12–12/12; post vertical, heater level', 'Ceiling 96 in or more'], ['Out From The Wall', 'Wall adaptor 14 or 18 in out, face down', 'Over a bar rail or banquette'], ['Recessed', 'Low-clearance kit, 7.5 in cavity', '94 in or more']];
      P.forEach(([h, d, m], i) => {
        const G = cols >= 5 ? svg : el('g', { transform: `translate(${((i % cols) - i) * 292},${Math.floor(i / cols) * 470})` }, svg), rc = rcOf(G), x0 = 10 + i * 292, cx = x0 + 140;
        add(G, rc.line(x0, F, x0 + 270, F, O({ strokeWidth: 2 })));
        if (i === 0) { add(G, rc.line(x0 + 30, F, x0 + 30, Yin(122), O({ strokeWidth: 5 }))); add(G, rc.line(x0 + 30, Yin(80), x0 + 52, Yin(80), O({ strokeWidth: 3 }))); heater(G, x0 + 82, Yin(78), -38); glow(G, x0 + 82, Yin(78), -38, 210, 70); dimV(G, x0 + 262, F, Yin(76), '72 in', -1); person(G, x0 + 180, F, true, S); }
        if (i === 1) { add(G, rc.line(x0, Yin(108), x0 + 270, Yin(108), O({ strokeWidth: 4 }))); add(G, rc.line(x0 + 252, Yin(108), x0 + 252, F, O({ strokeWidth: 1, stroke: STEEL, strokeLineDash: [6, 5] }))); T(G, x0 + 248, Yin(60), 'Open', { size: 11, fill: STEEL, anchor: 'end' });
          add(G, rc.line(x0 + 210, Yin(108), x0 + 210, Yin(101), O({ strokeWidth: 3 }))); heater(G, x0 + 210, Yin(98), 30); glow(G, x0 + 210, Yin(98), 30, 200, 60); dimV(G, x0 + 14, F, Yin(98), '96 in min.', 1); T(G, x0 + 238, Yin(118), '≤30° (4/6 kW)', { size: 11.5, fill: FINK, anchor: 'end', weight: 700, halo: '#fff' }); person(G, x0 + 110, F, true, S); }
        if (i === 2) { add(G, rc.line(x0, Yin(150), x0 + 270, Yin(104), O({ strokeWidth: 4 }))); add(G, rc.line(cx, Yin(127), cx, Yin(100), O({ strokeWidth: 3 }))); add(G, rc.rectangle(cx - 9, Yin(129), 18, 7, O({ fill: INK2, fillStyle: 'solid' }))); heater(G, cx, Yin(98), 0); glow(G, cx, Yin(98), 0, 200, 70); dimV(G, x0 + 14, F, Yin(98), '96 in min.', 1); person(G, cx + 60, F, true, S); }
        if (i === 3) { add(G, rc.line(x0 + 30, F, x0 + 30, Yin(122), O({ strokeWidth: 5 }))); add(G, rc.linearPath([[x0 + 30, Yin(104)], [x0 + 30 + 14 * S, Yin(104)], [x0 + 30 + 14 * S, Yin(99)]], O({ strokeWidth: 3 }))); heater(G, x0 + 30 + 14 * S, Yin(96), 0, 60); glow(G, x0 + 30 + 14 * S, Yin(96), 0, 170, 60); dimH(G, x0 + 30, x0 + 30 + 14 * S, Yin(112), '14 in'); add(G, rc.rectangle(x0 + 120, Yin(42), 120, 8, O({ fill: WOOD, fillStyle: 'solid' }))); person(G, x0 + 150, F, false, S); }
        if (i === 4) { add(G, rc.rectangle(x0, Yin(108) - 22, 270, 22, O({ fill: WOOD, fillStyle: 'hachure', hachureGap: 6 }))); add(G, rc.line(x0, Yin(100), x0 + 270, Yin(100), O({ strokeWidth: 3 }))); add(G, rc.rectangle(cx - 40, Yin(100) - 18, 80, 18, O({ fill: INK, fillStyle: 'solid' }))); add(G, rc.rectangle(cx - 34, Yin(100) - 4, 68, 4, O({ stroke: 'none', fill: FLAME, fillStyle: 'solid' }))); glow(G, cx, Yin(100), 0, 200, 70); dimV(G, x0 + 14, F, Yin(100), '94 in min.', 1); person(G, cx + 50, F, true, S); }
        T(G, x0, 22, h, { size: 19, serif: true }); T(G, x0, 40, d, { size: 12, fill: INK2 }); T(G, x0, 56, m, { size: 12, fill: FINK, weight: 700 });
      });
    };

    /* ---------- low-clearance recess, section and plan ---------- */
    CH.recess = (svg) => {
      const rc = rcOf(svg);
      // section
      T(svg, 20, 22, 'Section across the joists', { size: 15, weight: 700 });
      add(svg, rc.rectangle(20, 50, 520, 14, O({ fill: '#C9C6C1', fillStyle: 'solid' }))); T(svg, 548, 61, 'Roof deck', { size: 11.5, fill: STEEL });
      [40, 210, 380, 500].forEach((x) => add(svg, rc.rectangle(x, 64, 22, 120, O({ fill: WOOD, fillStyle: 'hachure', hachureGap: 5 }))));
      add(svg, rc.rectangle(20, 184, 520, 12, O({ fill: '#E7DCCD', fillStyle: 'solid' }))); T(svg, 548, 195, 'Finished ceiling', { size: 11.5, fill: STEEL });
      add(svg, rc.rectangle(240, 110, 120, 74, O({ fill: '#B9B2A8', fillStyle: 'cross-hatch', hachureGap: 6 }))); add(svg, rc.rectangle(226, 184, 148, 10, O({ fill: INK, fillStyle: 'solid' }))); add(svg, rc.rectangle(244, 186, 112, 5, O({ stroke: 'none', fill: FLAME, fillStyle: 'solid' })));
      glow(svg, 300, 196, 0, 120, 80);
      dimV(svg, 395, 196, 110, '7.5 in min. cavity', 1);
      T(svg, 300, 100, 'LC kit between joists', { size: 12, anchor: 'middle', fill: INK2 });
      // plan
      const px = 20, py = 300; T(svg, px, py - 18, 'Plan of the ceiling', { size: 15, weight: 700 });
      add(svg, rc.rectangle(px, py, 560, 180, O({ fill: ROOF, fillStyle: 'solid' })));
      add(svg, rc.line(px, py, px, py + 180, O({ strokeWidth: 4 }))); T(svg, px + 6, py + 196, 'Wall', { size: 11.5, fill: STEEL });
      [100, 200, 300, 400, 500].forEach((x) => add(svg, rc.line(px + x, py + 6, px + x, py + 174, O({ stroke: '#CFC9C0', strokeDasharray: '', strokeWidth: 1, strokeLineDash: [3, 5], roughness: 0.3 }))));
      [[px + 150, py + 20], [px + 350, py + 20]].forEach(([x, y]) => { add(svg, rc.rectangle(x - 18, y, 36, 140, O({ fill: INK, fillStyle: 'solid' }))); add(svg, rc.rectangle(x - 8, y + 6, 16, 128, O({ stroke: 'none', fill: FLAME, fillStyle: 'solid' }))); add(svg, rc.rectangle(x - 18, y + 124, 36, 16, O({ fill: '#8F877C', fillStyle: 'solid' }))); });
      dimH(svg, px, px + 132, py + 90, '500 mm min.');
      dimH(svg, px + 168, px + 332, py + 60, '500 mm min. between');
      dimV(svg, px + 395, py + 160, py + 176, '200 mm clear at the terminal end', 1);
      T(svg, px + 560, py + 214, 'Long axis with the joists · slope no more than ¼ in per 1 in (about 14°) · cut-out 61 × 10 in (3/6 kW)', { size: 12, fill: INK2, anchor: 'end' });
    };

    /* ---------- mounting height by use, and how intensity falls ---------- */
    CH.heights = (svg) => {
      const rc = rcOf(svg), F = 400, S = 2.4, Yin = (i) => F - i * S;
      [['Seated tables', 96, true, '≈ 8 ft', '≈ 4 ft to the head'], ['High-tops, bar rails', 120, false, '≈ 10 ft', '≈ 4 ft to the head'], ['Standing, entries', 144, false, '≈ 12 ft', '≈ 6 ft to the head']].forEach(([t, h, seat, a, b], i) => {
        const x0 = 20 + i * 250, cx = x0 + 120;
        add(svg, rc.line(x0, F, x0 + 220, F, O({ strokeWidth: 2 })));
        heater(svg, cx, Yin(h), 0, 64); glow(svg, cx, Yin(h), 0, h * S - 30, 60);
        if (!seat && i === 1) add(svg, rc.rectangle(cx + 6, Yin(42), 70, 6, O({ fill: WOOD, fillStyle: 'solid' })));
        person(svg, cx + (i === 1 ? 20 : 0), F, seat, S);
        dimV(svg, x0 + 8, F, Yin(h), a, 1);
        T(svg, x0, 26, t, { size: 18, serif: true }); T(svg, x0, 44, b, { size: 12, fill: INK2 });
      });
      // inverse square
      const ix = 790; T(svg, ix, 26, 'Twice as far, a quarter of the warmth', { size: 18, serif: true });
      T(svg, ix, 44, 'Ideal point source; linear heaters fall off less close in', { size: 12, fill: INK2 });
      [[1, 100], [1.25, 64], [1.5, 44], [2, 25]].forEach(([d, p], i) => { const x = ix + 20 + i * 64, h = p * 2.6;
        add(svg, rc.rectangle(x, F - h, 40, h, O({ fill: i ? '#F6B3A5' : FLAME, fillStyle: i ? 'hachure' : 'solid', stroke: FINK, hachureGap: 5 })));
        T(svg, x + 20, F - h - 8, p + '%', { size: 15, serif: true, anchor: 'middle', fill: FINK }); T(svg, x + 20, F + 18, d + '×', { size: 12, anchor: 'middle', fill: INK2 }); });
      T(svg, ix + 20, F + 36, 'Distance to the guest', { size: 11.5, fill: STEEL });
    };

    /* ---------- the dead zone under a wall heater ---------- */
    CH.deadzone = (svg) => {
      const rc = rcOf(svg), F = 260, S = 1.9, Yin = (i) => F - i * S;
      [[0, 'Table against the wall', false], [1, 'Table set forward', true]].forEach(([i, t, ok]) => {
        const x0 = 14 + i * 330; add(svg, rc.line(x0, F, x0 + 300, F, O({ strokeWidth: 2 }))); add(svg, rc.line(x0 + 20, F, x0 + 20, Yin(120), O({ strokeWidth: 5 })));
        heater(svg, x0 + 52, Yin(80), -40, 54); glow(svg, x0 + 52, Yin(80), -40, 150, 46);
        const tx = ok ? x0 + 170 : x0 + 30; add(svg, rc.rectangle(tx, Yin(30), 90, 6, O({ fill: WOOD, fillStyle: 'solid' }))); add(svg, rc.line(tx + 45, Yin(30), tx + 45, F, O({ strokeWidth: 2 })));
        if (ok) { add(svg, rc.linearPath([[x0 + 255, 60], [x0 + 265, 72], [x0 + 286, 46]], O({ stroke: '#3F6B4F', strokeWidth: 3 }))); }
        else { add(svg, rc.line(x0 + 250, 46, x0 + 282, 76, O({ stroke: FINK, strokeWidth: 3 }))); add(svg, rc.line(x0 + 282, 46, x0 + 250, 76, O({ stroke: FINK, strokeWidth: 3 }))); }
        T(svg, x0, 22, t, { size: 17, serif: true, fill: ok ? INK : INK2 });
      });
    };

    /* ---------- amps per heater ---------- */
    CH.amps = (svg) => {
      const rc = rcOf(svg), rows = [['Tungsten 2000 W', 9.6, 8.3, 1], ['Tungsten 3000 W', 14.4, 12.5, 1], ['Tungsten 4000 W', 19.2, 16.7, 1], ['Tungsten 6000 W', 28.8, 25.0, 1],
        ['Platinum 2300 W', 11.1, 9.6], ['Platinum 3400 W', 16.3, 14.2], ['Platinum 4500 W', 21.6, 18.8], ['Eclipse 2900 W', 13.9, 12.1], ['Cobalt 4000 W', 18.75, 16.6], ['Cobalt 6000 W', 28.4, 25.0]];
      const x0 = 200, sc = 14, rh = 38, y0 = 54;
      T(svg, 0, 22, 'Amps per heater · bar: at 240 V · dot: at 208 V · tick: × 1.25 for the branch circuit (240 V)', { size: 13, fill: STEEL, weight: 700 });
      [0, 10, 20, 30, 40].forEach((a) => { add(svg, rc.line(x0 + a * sc, y0 - 8, x0 + a * sc, y0 + rows.length * rh - 6, O({ stroke: LINE, strokeWidth: 0.8, roughness: 0.3 }))); T(svg, x0 + a * sc, y0 + rows.length * rh + 12, a + ' A', { size: 11.5, anchor: 'middle', fill: STEEL }); });
      rows.forEach(([t, a208, a240, calc], i) => { const y = y0 + i * rh;
        T(svg, 0, y + 15, t + (calc ? ' *' : ''), { size: 13.5, fill: INK });
        add(svg, rc.rectangle(x0, y + 2, a240 * sc, 18, O({ fill: i < 4 ? FLAME : '#C9C6C1', fillStyle: i < 4 ? 'solid' : 'hachure', stroke: i < 4 ? FINK : INK2, hachureGap: 5, roughness: 0.6 })));
        const t125 = a240 * 1.25; add(svg, rc.line(x0 + t125 * sc, y - 2, x0 + t125 * sc, y + 24, O({ stroke: INK, strokeWidth: 2, roughness: 0.3 })));
        add(svg, rc.circle(x0 + a208 * sc, y + 11, 10, O({ fill: INK, fillStyle: 'solid', roughness: 0.3 })));
        T(svg, x0 + Math.max(t125, a208) * sc + 14, y + 16, `${a240.toFixed(1)} A · ${a208.toFixed(1)} A`, { size: 12.5, fill: INK2 });
      });
      T(svg, 0, y0 + rows.length * rh + 34, '* Calculated as watts ÷ volts; the product page lists none. Others as published on bromic.com.', { size: 11.5, fill: STEEL });
    };

    /* ---------- heaters per 6 kW channel ---------- */
    CH.channels = (svg) => {
      const rc = rcOf(svg), rows = [['Tungsten 2000 W', 3], ['Tungsten 3000 W', 2], ['Tungsten 4000 or 6000 W', 1], ['Platinum 2300 W', 2], ['Platinum 3400 or 4500 W', 1], ['Cobalt 4000 or 6000 W', 1], ['Eclipse (Eclipse controller)', 1, 'ecl'], ['Built-in gas (On/Off controller)', 10, 'gas']];
      T(svg, 0, 20, 'Heaters on one channel · Dimmer and On/Off channels carry 6 kW at 208–277 V', { size: 13, fill: STEEL, weight: 700 });
      rows.forEach(([t, n, k], i) => { const y = 46 + i * 40; T(svg, 0, y + 15, t, { size: 13.5 });
        for (let j = 0; j < n; j++) { const x = 260 + j * (k === 'gas' ? 34 : 64);
          if (k === 'ecl') { add(svg, rc.circle(x + 12, y + 10, 22, O({ fill: INK, fillStyle: 'solid' }))); add(svg, rc.circle(x + 12, y + 10, 11, O({ stroke: 'none', fill: FLAME, fillStyle: 'solid' }))); }
          else { const w = k === 'gas' ? 26 : 54; add(svg, rc.rectangle(x, y + 4, w, 12, O({ fill: INK, fillStyle: 'solid', roughness: 0.4 }))); add(svg, rc.rectangle(x + 3, y + 8, w - 6, 4, O({ stroke: 'none', fill: FLAME, fillStyle: 'solid', roughness: 0.2 }))); } }
        T(svg, k === 'gas' ? 260 + n * 34 + 6 : 260 + n * 64 + 4, y + 15, '× ' + n + (k === 'gas' ? ' (up to)' : ''), { size: 15, serif: true, fill: FINK }); });
    };

    /* ---------- control paths: app or BMS ---------- */
    CH.bms = (svg) => {
      const rc = rcOf(svg), box = (x, y, w, t, sub, hl) => { add(svg, rc.rectangle(x, y, w, 52, O({ fill: hl ? '#FCE7E2' : '#fff', fillStyle: 'solid', stroke: hl ? FINK : INK, roughness: 0.6 }))); T(svg, x + w / 2, y + 22, t, { size: 14, anchor: 'middle', weight: 700 }); if (sub) T(svg, x + w / 2, y + 40, sub, { size: 11.5, anchor: 'middle', fill: INK2 }); };
      const arr = (x1, y1, x2, y2) => { add(svg, rc.line(x1, y1, x2, y2, O({ stroke: FINK, strokeWidth: 1.6, roughness: 0.3 }))); const a = Math.atan2(y2 - y1, x2 - x1); add(svg, rc.polygon([[x2, y2], [x2 - 9 * Math.cos(a - 0.4), y2 - 9 * Math.sin(a - 0.4)], [x2 - 9 * Math.cos(a + 0.4), y2 - 9 * Math.sin(a + 0.4)]], O({ stroke: FINK, fill: FINK, fillStyle: 'solid', roughness: 0.2 }))); };
      T(svg, 0, 22, 'Path A · the app and wall switches run the heat', { size: 15, serif: true });
      box(0, 40, 150, 'Smart-Heat app', 'Schedules, zones'); box(0, 104, 150, 'Wall switch', 'At the door'); box(220, 70, 170, 'Affinity controller', 'One channel a zone', true); box(460, 70, 150, 'Heater zones', 'Each at its own level');
      arr(150, 66, 220, 92); arr(150, 130, 220, 104); arr(390, 96, 460, 96);
      T(svg, 0, 212, 'Path B · the BMS drives each zone', { size: 15, serif: true });
      box(0, 230, 150, 'BMS', 'Building system'); box(0, 294, 150, 'Wall switch', 'Local override'); box(220, 230, 170, 'Expansion board', 'Ethernet or 0–10 V'); box(220, 294, 170, 'Affinity controller', '', true); box(460, 262, 150, 'Heater zones', '');
      arr(150, 256, 220, 256); arr(305, 282, 305, 294); arr(150, 320, 220, 320); arr(390, 312, 460, 292);
      T(svg, 0, 376, 'BMS mode disables the app: choose one path and write it into the sequence of operation.', { size: 12.5, fill: FINK, weight: 700 });
    };

    /* ---------- how heat moves outdoors ---------- */
    CH.modes = (svg) => {
      const rc = rcOf(svg), F = 200;
      [['Convection', 'Warms the air, which rises and blows away'], ['Conduction', 'Warms only what a guest touches'], ['Radiant', 'Warms people and surfaces directly']].forEach(([t, d], i) => {
        const x0 = 10 + i * 300, cx = x0 + 130; add(svg, rc.line(x0, F, x0 + 260, F, O({ strokeWidth: 2 })));
        if (i === 0) { add(svg, rc.rectangle(cx - 40, F - 30, 80, 30, O({ fill: '#C9C6C1', fillStyle: 'solid' }))); for (let k = -1; k <= 1; k++) add(svg, rc.curve([[cx + k * 26, F - 34], [cx + k * 26 + 14, F - 80], [cx + k * 26 + 40, F - 120], [cx + k * 26 + 90, F - 150]], O({ stroke: '#C9C6C1', strokeWidth: 2 }))); T(svg, cx + 100, F - 150, 'lost upward', { size: 11.5, fill: STEEL }); }
        if (i === 1) { add(svg, rc.rectangle(cx - 60, F - 46, 120, 10, O({ fill: WOOD, fillStyle: 'solid' }))); add(svg, rc.rectangle(cx - 20, F - 60, 40, 14, O({ fill: '#F6B3A5', fillStyle: 'solid', stroke: FINK }))); add(svg, rc.line(cx - 54, F - 36, cx - 54, F, O({ strokeWidth: 2 }))); add(svg, rc.line(cx + 54, F - 36, cx + 54, F, O({ strokeWidth: 2 }))); }
        if (i === 2) { heater(svg, cx - 40, F - 160, 25, 60); for (let k = -2; k <= 2; k++) add(svg, rc.line(cx - 30, F - 150, cx + 40 + k * 18, F - 40 + Math.abs(k) * 6, O({ stroke: FLAME, strokeWidth: 1.4, strokeLineDash: [6, 5] }))); person(svg, cx + 50, F, true, 2.2); }
        T(svg, x0, 22, t, { size: 19, serif: true, fill: i === 2 ? FINK : INK }); T(svg, x0, 40, d, { size: 12, fill: INK2 });
      });
    };

    /* ---------- Series II clearances ---------- */
    CH.clear = (svg) => {
      const rc = rcOf(svg), F = 380, S = 2.2, Yin = (i) => F - i * S, top = Yin(130);
      add(svg, rc.line(20, top, 620, top, O({ strokeWidth: 4 }))); add(svg, rc.line(30, top, 30, F, O({ strokeWidth: 4 }))); add(svg, rc.line(20, F, 620, F, O({ strokeWidth: 2 })));
      const hy = top + 13 * S + 10; [[30 + 18 * S + 40, 'H1'], [30 + 18 * S + 40 + 62 + 20 * S, 'H2']].forEach(([x]) => { add(svg, rc.line(x, top, x, hy - 6, O({ strokeWidth: 3 }))); heater(svg, x, hy, 0, 62); glow(svg, x, hy, 0, 150, 50); });
      const h1 = 30 + 18 * S + 40, h2 = h1 + 62 + 20 * S;
      dimH(svg, 30, h1 - 31, top + 40, '18 in (4/6 kW)');
      dimV(svg, h1 + 50, top, hy - 7, '13 in (4/6 kW)', 1);
      dimH(svg, h1 + 31, h2 - 31, hy + 40, '20 in min.');
      dimV(svg, 560, F, hy, '96 in min.', -1);
      add(svg, rc.rectangle(h2 + 70, Yin(66), 90, 66 * S, O({ fill: '#F2E6D8', fillStyle: 'cross-hatch', hachureGap: 8, stroke: INK2 }))); T(svg, h2 + 115, Yin(70), 'Combustibles', { size: 11.5, anchor: 'middle', fill: INK2 });
      T(svg, 20, top - 16, 'Series II manual: 12 in / 9 in for 2–3 kW; 18 in / 13 in for 4–6 kW; 36 in to combustibles in front of the heater', { size: 12, fill: STEEL });
    };

    /* ---------- minimum height above the floor by family ---------- */
    CH.aff = (svg) => {
      const rc = rcOf(svg), F = 330, S = 2.4, Yin = (i) => F - i * S;
      [[0, 48, 72, 96, 120].forEach((v) => { add(svg, rc.line(40, Yin(v), 760, Yin(v), O({ stroke: LINE, strokeWidth: 0.8, roughness: 0.3 }))); T(svg, 34, Yin(v) + 4, v + ' in', { size: 11, anchor: 'end', fill: STEEL }); })];
      [['Tungsten, Platinum Electric', 72, 96], ['Cobalt Electric', 72, 96], ['Eclipse Electric', null, 96], ['Eclipse Freestanding', null, 79, 'clearance'], ['Built-in gas', null, 96]].forEach(([t, w, c, k], i) => {
        const x = 70 + i * 150;
        if (w) { add(svg, rc.rectangle(x, Yin(w), 34, w * S, O({ fill: '#F6B3A5', fillStyle: 'hachure', stroke: FINK, hachureGap: 5 }))); T(svg, x + 17, Yin(w) - 6, w + ' in', { size: 12.5, anchor: 'middle', fill: FINK, weight: 700 }); T(svg, x + 17, F + 16, 'wall', { size: 11, anchor: 'middle', fill: INK2 }); }
        add(svg, rc.rectangle(x + 46, Yin(c), 34, c * S, O({ fill: FLAME, fillStyle: 'solid', stroke: FINK }))); T(svg, x + 63, Yin(c) - 6, c + ' in', { size: 12.5, anchor: 'middle', fill: FINK, weight: 700 }); T(svg, x + 63, F + 16, k || 'ceiling', { size: 11, anchor: 'middle', fill: INK2 });
        T(svg, x + 40, F + 36, t, { size: 12, anchor: 'middle', fill: INK, weight: 700 });
      });
    };
    return r;
  };
})();
