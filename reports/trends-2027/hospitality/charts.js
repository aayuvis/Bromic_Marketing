/* Charts for Outdoor Hospitality Trends 2027 · Global. Each number drawn here is in content.py / the storyline with its source. */
window.REPORT_CHARTS = (BZ) => {
  const { T, O, add, el, dumbbell, pie, vbars, waffle, people, hstack, INK, INK2, STEEL, FLAME, FINK, LIGHT, LINE } = BZ;
  const CH = {
    h1(svg) {
      pie(svg, 80, 95, 130, 81, { label: '81%+', cap: 'of full-service operators|offer outdoor dining' });
      pie(svg, 270, 95, 130, 30, { label: '30%', cap: 'expanded patio capacity|in the past year' });
      pie(svg, 460, 95, 130, 39, { label: '39%', cap: 'plan to add|private events' });
      vbars(svg, 640, 240, [{ v: 100, t: '100', l: 'Mar 2024–|Feb 2025' }, { v: 124, t: '124', l: 'Mar 2025–|Feb 2026', hl: 1 }], 130, 170, { w: 70, g: 40 });
      T(svg, 610, 306, 'Canadian outdoor dining, index (OpenTable)', { size: 12, fill: STEEL });
    },
    h2(svg) {
      people(svg, 14, 20, 100, 62, 10, 27);
      T(svg, 0, 305, '62 in 100 choose a restaurant for its outdoor seating', { size: 12.5, fill: INK2 });
      pie(svg, 480, 95, 130, 74, { label: '74%', cap: 'plan to dine outdoors at least|monthly in the warmer months' });
      pie(svg, 700, 95, 130, 25, { label: '25%', cap: 'have stayed outdoors in bad|weather rather than move inside' });
    },
    h3(svg) {
      const rc = rough.svg(svg), M = 'JFMAMJJASOND';
      [['Before', [3, 4, 5, 6, 7, 8, 9, 10]], ['From 2026', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]]].forEach(([lab, on], r) => {
        T(svg, 0, 50 + r * 62, lab, { size: 15, weight: 700 }); T(svg, 0, 68 + r * 62, r ? 'year-round, by law' : 'April to late November', { size: 12, fill: STEEL });
        for (let m = 0; m < 12; m++) {
          const lit = on.includes(m), x = 190 + m * 52;
          add(svg, rc.rectangle(x, 28 + r * 62, 44, 42, O({ stroke: lit ? FINK : LINE, fill: lit ? (r ? FLAME : '#F6B3A5') : 'none', fillStyle: r ? 'hachure' : 'solid', hachureGap: 5 })));
          T(svg, x + 22, 55 + r * 62, M[m], { size: 13, anchor: 'middle', fill: lit && !r ? INK : INK2, weight: 700 });
        }
      });
      T(svg, 0, 172, 'New York roadway dining season', { size: 12, fill: STEEL });
      T(svg, 0, 198, 'Hong Kong outdoor seating approval, simple cases', { size: 14, weight: 700 });
      const X = mo => 300 + mo * 36;
      [['Median before', 12, 0], ['From April 2026', 1, 1]].forEach(([l, v, i]) => {
        const y = 212 + i * 50;
        T(svg, 290, y + 21, l, { size: 13, anchor: 'end', fill: INK2 });
        add(svg, rc.rectangle(300, y, X(v) - 300, 30, O({ stroke: i ? FINK : INK2, fill: i ? FLAME : STEEL, fillStyle: i ? 'solid' : 'cross-hatch', hachureGap: 7 })));
        T(svg, X(v) + 12, y + 22, i ? 'about 1 month' : '12 months', { size: 20, serif: true, fill: i ? FINK : INK2 });
      });
    },
    h4(svg) {
      const rc = rough.svg(svg), y = 160;
      add(svg, rc.line(20, y, 840, y, O({ stroke: INK, strokeWidth: 2 })));
      const ev = [['2022', 'France bans heating|open terraces'], ['2024', 'England’s pavement licences|made permanent'], ['2025', 'EU ecodesign rules leave|outdoor heaters to local rules'],
        ['Jun 2026', 'New York all-electric|act upheld on appeal'], ['Jul 2027', 'New York rule extends to|buildings of 7+ storeys']];
      ev.forEach(([a, b], i) => {
        const x = 70 + i * 180, up = i % 2 === 0;
        add(svg, rc.circle(x, y, 18, O({ stroke: FINK, fill: FLAME, fillStyle: 'solid' })));
        add(svg, rc.line(x, up ? y - 14 : y + 14, x, up ? y - 44 : y + 44, O({ stroke: STEEL, strokeWidth: 1 })));
        const ty = up ? y - 108 : y + 72;
        T(svg, x, ty, a, { size: 24, serif: true, fill: FINK, anchor: 'middle' });
        b.split('|').forEach((l, j) => T(svg, x, ty + 22 + j * 16, l, { size: 12.5, fill: INK2, anchor: 'middle' }));
      });
    },
    h5(svg) {
      vbars(svg, 30, 250, [{ v: 13.37, t: '13.37', l: '2025' }, { v: 14.01, t: '14.01', l: '2026' }, { v: 14.26, t: '14.26', l: '2027|forecast', hl: 1 }], 16, 180, { w: 70, g: 34 });
      T(svg, 0, 314, 'US commercial electricity, US cents per kWh (EIA)', { size: 12, fill: STEEL });
      dumbbell(svg, [{ l: 'Average US restaurant expenses', u: 'Index, 2019 = 100 (National Restaurant Association)', a: 100, b: 136, al: '100', bl: '136', ay: '2019', by: '2026' }], 150, { x0: 470, x1: 840, top: 170, lx: 470, ly: -70 });
    },
    h6(svg) {
      const rc = rough.svg(svg), X = h => 40 + (h - 15) * 78;
      add(svg, rc.line(X(15), 250, X(25), 250, O({ stroke: INK })));
      [15, 17, 19, 21, 23, 25].forEach(h => { add(svg, rc.line(X(h), 244, X(h), 256, O({ stroke: INK }))); T(svg, X(h), 276, h === 25 ? '1am' : h === 24 ? '12am' : (h - 12) + 'pm', { size: 13, anchor: 'middle', fill: INK2 }); });
      add(svg, rc.rectangle(X(19), 70, X(22) - X(19), 50, O({ stroke: INK2, fill: STEEL, fillStyle: 'cross-hatch', hachureGap: 8 })));
      T(svg, X(22) + 12, 92, 'Previous peak', { size: 15, weight: 700 }); T(svg, X(22) + 12, 110, '7–10pm', { size: 13, fill: STEEL });
      add(svg, rc.rectangle(X(17), 150, X(19) - X(17), 70, O({ stroke: FINK, fill: FLAME, fillStyle: 'hachure', hachureGap: 5 })));
      T(svg, X(17) - 12, 182, 'New peak, 2025', { size: 15, weight: 700, anchor: 'end', fill: FINK }); T(svg, X(17) - 12, 200, '5–7pm', { size: 13, fill: FINK, anchor: 'end' });
      T(svg, 0, 314, 'Hours with the highest average rate of sale, GB On Premise', { size: 12, fill: STEEL });
    },
    h7(svg) {
      vbars(svg, 50, 250, [{ v: 40.6, t: '+40.6%', l: 'US host-city|restaurant orders' }, { v: 62.4, t: '+62.4%', l: 'GB venue sales,|knockout day' },
        { v: 90, t: '+90%', l: 'UK pubs and bars,|England matches' }, { v: 121, t: '+121%', l: 'UK late night,|10pm–1am', hl: 1 }], 130, 190, { w: 100, g: 100 });
      T(svg, 0, 314, 'Uplift on 2026 World Cup match days against normal trading (NIQ, Square, SpotOn)', { size: 12, fill: STEEL });
    },
    h8(svg) {
      pie(svg, 80, 95, 130, 79, { label: '79%', cap: 'say fresh air is|essential to relaxing' });
      pie(svg, 270, 95, 130, 54, { label: '54%', cap: 'want heat-centred or|hydro wellness' });
      pie(svg, 460, 95, 130, 35, { label: '35%', cap: 'would book a hotel for its|outdoor relaxation spaces' });
      vbars(svg, 620, 240, [{ v: 882, t: '$882bn', l: '2024' }, { v: 982, t: '$982bn', l: '2025' }, { v: 1384, t: '$1.38trn', l: '2030|forecast', hl: 1 }], 1500, 160, { w: 54, g: 22, vs: 17 });
      T(svg, 600, 306, 'Wellness tourism (Global Wellness Institute)', { size: 12, fill: STEEL });
    },
    h9(svg) {
      vbars(svg, 40, 250, [{ v: 123, t: '~123M', l: 'Saudi Arabia,|all tourists', hl: 1 }, { v: 42.68, t: '42.68M', l: 'Japan international|arrivals' }, { v: 19.59, t: '19.59M', l: 'Dubai overnight|visitors' }], 130, 180, { w: 90, g: 80 });
      T(svg, 0, 314, 'Visitors in 2025 (Saudi Ministry of Tourism, JNTO, Dubai DET)', { size: 12, fill: STEEL });
      pie(svg, 700, 95, 140, 58, { label: '~58%', cap: 'of the pipeline’s rooms|are in Saudi Arabia' });
    },
    h10(svg) {
      vbars(svg, 40, 240, [{ v: 1203, t: '1,203', l: 'Record order|book, 2023' }, { v: 1093, t: '1,093', l: 'Order book,|2026 report' }], 1400, 170, { w: 84, g: 50 });
      T(svg, 0, 306, 'Yachts over 24 m on order or in build (BOAT International)', { size: 12, fill: STEEL });
      pie(svg, 480, 95, 130, 52, { label: '52%', cap: 'of projects are at|Italian yards' });
      vbars(svg, 640, 240, [{ v: 201, t: '201', l: 'Delivered|in 2025' }, { v: 612, t: '612', l: 'In build', hl: 1 }], 700, 170, { w: 70, g: 40 });
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
      [[0, 'US$1.41B'], [1, 'US$1.48B'], [9, 'US$2.47B']].forEach(([i, a]) => {
        add(svg, rc.circle(X(i), Y(vals[i]), 14, O({ stroke: FINK, fill: '#fff', fillStyle: 'solid' })));
        T(svg, X(i) + (i === 9 ? -6 : 4), Y(vals[i]) - (i === 1 ? 34 : 18), a, { size: 19, serif: true, fill: FINK, anchor: i === 9 ? 'end' : 'start' });
      });
      yrs.forEach((y, i) => { if (i % 3 === 0 || i === 9) T(svg, X(i), 268, String(y), { size: 11.5, anchor: 'middle', fill: STEEL }); });
      T(svg, 60, 30, 'Catering and hospitality buy 58% of it', { size: 13, fill: INK2, weight: 700 });
    },
  };
  const MINI = {
    patio(svg) { pie(svg, 150, 85, 140, 20, { ring: '#6E6867' }); },
    stay(svg) {
      const rc = rough.svg(svg);
      add(svg, rc.circle(150, 88, 150, O({ stroke: LIGHT, strokeWidth: 1.6 })));
      for (let i = 0; i < 12; i++) { const a = i * Math.PI / 6; add(svg, rc.line(150 + Math.cos(a) * 64, 88 + Math.sin(a) * 64, 150 + Math.cos(a) * 72, 88 + Math.sin(a) * 72, O({ stroke: '#8F8988', strokeWidth: 1 }))); }
      add(svg, rc.arc(150, 88, 120, 120, -Math.PI / 2, -Math.PI / 2 + 2 * Math.PI * (127 % 60) / 60 + 2 * Math.PI, true, O({ stroke: FINK, fill: FLAME, fillStyle: 'hachure', hachureGap: 5 })));
      add(svg, rc.circle(150, 88, 56, O({ stroke: '#6E6867', fill: '#141213', fillStyle: 'solid' })));
      T(svg, 150, 96, '2h 7m', { size: 17, serif: true, anchor: 'middle', fill: LIGHT });
    },
    travel(svg) { pie(svg, 150, 85, 140, 79, { ring: '#6E6867' }); },
    rooms(svg) { waffle(svg, 70, 22, 100, 58, 10, 16, 12, { square: true, dark: 1 }); },
    gap(svg) { pie(svg, 110, 105, 170, 58, {}); T(svg, 110, 118, '58%', { size: 40, serif: true, anchor: 'middle', fill: INK, halo: '#fff' }); },
  };
  return { CH, MINI };
};
