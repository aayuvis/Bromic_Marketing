/* Charts for the UK report. Each number drawn here is in uk/content.py with its source. */
window.REPORT_CHARTS = (BZ) => {
  const { T, O, add, el, dumbbell, pie, vbars, waffle, people, hstack, INK, INK2, STEEL, FLAME, FINK, LIGHT, LINE } = BZ;
  // bars either side of a zero line, for growth and decline
  function pmbars(svg, x, zero, bars, max, h, o = {}) {
    const rc = rough.svg(svg), w = o.w || 70, g = o.g || 40;
    bars.forEach((b, i) => {
      const bh = h * Math.abs(b.v) / max, bx = x + i * (w + g), up = b.v >= 0;
      add(svg, rc.rectangle(bx, up ? zero - bh : zero, w, bh, O({ stroke: up ? FINK : INK2, fill: up ? FLAME : STEEL, fillStyle: up ? 'hachure' : 'cross-hatch', hachureGap: up ? 5 : 7 })));
      T(svg, bx + w / 2, up ? zero - bh - 10 : zero + bh + 24, b.t, { size: 21, anchor: 'middle', serif: true, fill: up ? FINK : INK2 });
      (b.l || '').split('|').forEach((l, j) => T(svg, bx + w / 2, (up ? zero + 18 : zero - 30 + 0) + j * 15 - (up ? 0 : 0), l, { size: 12.5, anchor: 'middle', fill: INK2 }));
    });
    add(svg, rc.line(x - 10, zero, x + bars.length * (w + g) - g + 10, zero, O({ stroke: INK })));
  }
  const CH = {
    s1(svg) {
      pie(svg, 85, 95, 130, 61, { label: '61%', cap: 'say a good garden makes|the house feel bigger' });
      pie(svg, 300, 95, 130, 55, { label: '55%', cap: 'are zoning their|garden' });
      pie(svg, 515, 95, 130, 77, { label: '77%', cap: 'of adults have a|private garden (HTA)' });
      pie(svg, 730, 95, 130, 82, { label: '82%', cap: 'of English homes have a|private plot (EHS)' });
    },
    s2(svg) {
      people(svg, 14, 20, 100, 57, 10, 27);
      T(svg, 0, 305, '57 in 100: too cold or rainy to use the garden more', { size: 12.5, fill: INK2 });
      vbars(svg, 380, 240, [{ v: 14, t: '14%', l: 'Often' }, { v: 51, t: '51%', l: 'Sometimes', hl: 1 }], 60, 170, { w: 62, g: 30 });
      T(svg, 370, 300, 'Cancel outdoor plans on the forecast', { size: 12, fill: STEEL });
      vbars(svg, 640, 240, [{ v: 100, t: '100', l: '1961–1990' }, { v: 113, t: '113', l: '2016–2025', hl: 1 }], 120, 170, { w: 62, g: 40 });
      T(svg, 620, 300, 'Winter half-year rainfall (1961–1990 = 100)', { size: 12, fill: STEEL });
    },
    s3(svg) {
      const rc = rough.svg(svg), base = 260, max = 140, h = 210, Y = v => base - h * v / max;
      vbars(svg, 60, base, [{ v: 123, t: '123%', l: 'Sunshine|summer 2026', hl: 1 }, { v: 117, t: '117%', l: 'Sunshine|year 2025', hl: 1 }, { v: 77, t: '77%', l: 'Rainfall|summer 2026' }, { v: 120, t: '120%', l: 'Rainfall|autumn 2025' }], max, h, { w: 110, g: 80 });
      add(svg, rc.line(40, Y(100), 820, Y(100), O({ stroke: INK2, strokeWidth: 1, strokeLineDash: [7, 6], roughness: 0.6 })));
      T(svg, 830, Y(100) + 4, 'average', { size: 12, fill: STEEL, anchor: 'end' });
      T(svg, 40, 322, 'Share of the 1991–2020 average', { size: 12, fill: STEEL });
    },
    s4(svg) {
      vbars(svg, 40, 250, [{ v: 11, t: '+11%', l: 'All garden|centre sales' }, { v: 25, t: '+25%', l: 'BBQs and|heating', hl: 1 }], 45, 190, { w: 80, g: 40 });
      T(svg, 30, 312, 'Garden centres, July 2026 against July 2025', { size: 12, fill: STEEL });
      vbars(svg, 330, 250, [{ v: 42, t: '+42%', l: 'Outdoor|cooking', hl: 1 }], 45, 190, { w: 80 });
      T(svg, 300, 312, 'John Lewis, October 2025 against October 2024', { size: 12, fill: STEEL });
      dumbbell(svg, [{ l: 'Built-in outdoor kitchens', u: 'Share of renovators (Houzz UK)', a: 2, b: 3, al: '2%', bl: '3%', ay: '2023', by: '2024' }], 5, { x0: 640, x1: 840, top: 170, lx: 640, ly: -70 });
    },
    s5(svg) {
      pie(svg, 95, 95, 140, 47, { label: '47%', cap: 'renewables' });
      pie(svg, 305, 95, 140, 28, { label: '28%', cap: 'gas', fill: STEEL, stroke: INK2, labelFill: INK2 });
      T(svg, 0, 318, 'Share of UK electricity supply, 2025', { size: 12, fill: STEEL });
      const rc = rough.svg(svg);
      T(svg, 520, 40, 'Pavement licences: infrared, not gas', { size: 15, weight: 700 });
      ['St Albans', 'York', 'Stevenage', 'North Somerset'].forEach((c, i) => {
        const y = 80 + i * 56;
        add(svg, rc.rectangle(520, y - 18, 24, 24, O({ strokeWidth: 1.3 })));
        add(svg, rc.linearPath([[524, y - 6], [530, y + 2], [546, y - 22]], O({ stroke: FLAME, strokeWidth: 2.4 })));
        T(svg, 560, y, c, { size: 20, serif: true });
      });
      T(svg, 520, 318, 'Council conditions, 2024–2026', { size: 12, fill: STEEL });
    },
    s6(svg) {
      pie(svg, 85, 95, 130, 80, { label: '80%', cap: 'name energy prices|a top worry' });
      pie(svg, 290, 95, 130, 74, { label: '74%', cap: 'saw higher|electricity bills', fill: STEEL, stroke: INK2, labelFill: INK2 });
      vbars(svg, 480, 240, [{ v: 52.6, t: '53p', l: '2 kW' }, { v: 105.3, t: '£1.05', l: '4 kW' }, { v: 157.9, t: '£1.58', l: '6 kW', hl: 1 }], 170, 170, { w: 70, g: 40 });
      T(svg, 440, 300, 'One hour at full power on the Oct–Dec 2026 cap', { size: 12, fill: STEEL });
      T(svg, 440, 317, '(26.32p a kWh) – our calculation', { size: 12, fill: STEEL });
    },
    s7(svg) {
      vbars(svg, 30, 250, [{ v: 55, t: '55%', l: 'Front|gardens' }, { v: 36, t: '36%', l: 'Back|gardens' }, { v: 42, t: '42%', l: 'All|gardens', hl: 1 }], 70, 190, { w: 66, g: 30 });
      T(svg, 20, 312, 'Share of garden area that is paved', { size: 12, fill: STEEL });
      T(svg, 420, 30, 'Homes with a private plot', { size: 15, weight: 700 });
      T(svg, 420, 48, 'English Housing Survey 2024–25', { size: 12, fill: STEEL });
      dumbbell(svg, [{ l: 'Owner-occupiers', b: 92, bl: '92%' }, { l: 'Private renters', b: 63, bl: '63%' }, { l: 'Social renters', b: 61, bl: '61%' }], 100, { x0: 580, x1: 840, top: 110, gap: 80, lx: 420, ly: 6 });
    },
    s8(svg) {
      vbars(svg, 30, 250, [{ v: 9.1, t: '+9.1%', l: 'Apr|2025', hl: 1 }, { v: 2.8, t: '+2.8%', l: 'Aug|2025' }, { v: 4.2, t: '+4.2%', l: 'Jul|2026', hl: 1 }, { v: 3.8, t: '+3.8%', l: 'Sep|2026', hl: 1 }], 10, 190, { w: 62, g: 30 });
      T(svg, 20, 312, 'Managed pubs, like-for-like sales growth', { size: 12, fill: STEEL });
      vbars(svg, 520, 250, [{ v: 161, t: '161', l: 'Q1|2026' }, { v: 295, t: '295', l: 'Jan–Sep|2026' }, { v: 360, t: '~360', l: '2026|forecast' }], 400, 190, { w: 62, g: 30 });
      T(svg, 510, 312, 'Pubs closed in Great Britain (BBPA)', { size: 12, fill: STEEL });
    },
    s9(svg) {
      pmbars(svg, 30, 170, [{ v: 9, t: '+9%', l: 'Garden centres|2025' }, { v: 4, t: '+4.0%', l: 'Garden centre|card spend' }], 10, 120, { w: 74, g: 50 });
      T(svg, 20, 318, 'HTA 2025; Barclays, July 2026', { size: 12, fill: STEEL });
      pie(svg, 620, 95, 120, 51, { label: '51%', cap: 'of homeowners|renovated in 2024', fill: STEEL, stroke: INK2, labelFill: INK2 });
      pie(svg, 780, 95, 120, 50, { label: '50%', cap: 'of them worked|outdoors' });
    },
    s10(svg) {
      pie(svg, 85, 95, 130, 83, { label: '83%', cap: 'say green space helps|their state of mind' });
      pie(svg, 300, 95, 130, 70, { label: '70%', cap: 'use the garden|to relax (2023)' });
      pie(svg, 515, 95, 130, 44, { label: '44%', cap: 'mainly want to relax|outside in 2026' });
      waffle(svg, 668, 30, 100, 77, 10, 18, 12);
      T(svg, 660, 222, '77 in 100 adults', { size: 18, serif: true, fill: FINK });
      T(svg, 660, 240, 'have a private garden', { size: 12.5, fill: INK2 });
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
      T(svg, 60, 30, 'Growing 6.6% a year worldwide', { size: 13, fill: INK2, weight: 700 });
    },
  };
  const MINI = {
    zones(svg) { pie(svg, 150, 88, 140, 55, { ring: '#6E6867' }); },
    cold(svg) {
      const g = el('g', { filter: 'url(#sk)' }, svg);
      for (let i = 0; i < 100; i++) {
        const px = 60 + (i % 20) * 9.5, py = 30 + Math.floor(i / 20) * 26, c = i < 57 ? FLAME : '#6E6867';
        el('circle', { cx: px, cy: py, r: 2.6, fill: c }, g);
        el('path', { d: `M${px - 4} ${py + 13} q0 -7 4 -7 q4 0 4 7 z`, fill: c }, g);
      }
    },
    record(svg) { vbars(svg, 80, 160, [{ v: 16.1, t: '16.1°', l: 'Summer 2025' }, { v: 16.5, t: '16.5°', l: 'Summer 2026', hl: 1 }], 18, 120, { w: 58, g: 40, dark: 1, vs: 19 }); },
    heat(svg) { vbars(svg, 80, 160, [{ v: 11, t: '+11%', l: 'All sales' }, { v: 25, t: '+25%', l: 'BBQs, heating', hl: 1 }], 28, 120, { w: 58, g: 40, dark: 1, vs: 19 }); },
    gap(svg) { pie(svg, 110, 105, 170, 57, {}); T(svg, 110, 118, '57%', { size: 40, serif: true, anchor: 'middle', fill: INK, halo: '#fff' }); },
  };
  return { CH, MINI };
};
