/* Charts for this report. Each number drawn here is in the report's storyline with its source. */
window.REPORT_CHARTS = (BZ) => {
  const { T, O, add, el, dumbbell, pie, vbars, waffle, people, hstack, INK, INK2, STEEL, FLAME, FINK, LIGHT, LINE } = BZ;
  /* --- charts, one per shift --- */
  const CH = {
    s1(svg) {
      dumbbell(svg, [
        { l: 'Outdoor living rooms', u: 'Architects, net index', a: 40, b: 51, al: 'net 40', bl: 'net 51', ay: '2025', by: '2026' },
        { l: 'Blended indoor-outdoor space', u: 'Architects, net index', a: 40, b: 43, al: 'net 40', bl: 'net 43', ay: '2025', by: '2026' },
        { l: 'Outdoor renovators hiring a pro', u: 'Houzz, share of renovators', a: 65, b: 71, al: '65%', bl: '71%', ay: '2024', by: '2026' }], 80);
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
        { l: 'Sunrooms and three-season porches', u: 'Largest gain of any room', a: 6, b: 25, al: 'net 6', bl: 'net 25', ay: '2025', by: '2026' },
        { l: 'Heated exterior space', u: 'Rising again', a: 12, b: 16, al: 'net 12', bl: 'net 16', ay: '2025', by: '2026' },
        { l: 'Infrared patio heaters', u: 'Holding steady', b: 16, bl: 'net 16', by: '2026' }], 30, { x0: 380 });
      T(svg, 380, 318, 'Net index: architects reporting more demand minus those reporting less', { size: 12, fill: STEEL });
    },
    s4(svg) {
      dumbbell(svg, [
        { l: 'Shade structures', u: 'Share of structure upgrades', a: 20, b: 35, al: '20%', bl: '35%', ay: '2025', by: '2026' },
        { l: 'Outdoor kitchens adding infrastructure', u: 'Plumbing, electrical or heating', a: 58, b: 68, al: '58%', bl: '68%', ay: '2025', by: '2026' },
        { l: 'Outdoor kitchens under cover', u: 'Fully or partly covered', b: 74, bl: '74%', by: '2026' }], 80, { x0: 380 });
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
      dumbbell(svg, [{ l: '', b: 53, bl: 'net 53', by: '2026' }], 60, { x0: 600, x1: 840, top: 100 });
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

  return { CH, MINI };
};
