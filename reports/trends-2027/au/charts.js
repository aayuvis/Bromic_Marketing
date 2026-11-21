/* Charts for Outdoor Living Trends 2027 · Australia. Each number drawn here is in australia-storyline.md with its source. */
window.REPORT_CHARTS = (BZ) => {
  const { T, O, add, el, dumbbell, pie, vbars, waffle, people, hstack, INK, INK2, STEEL, FLAME, FINK, LIGHT, LINE } = BZ;
  // a vertical timeline of dated events
  function timeline(svg, x, y0, step, items, o = {}) {
    const rc = rough.svg(svg);
    add(svg, rc.line(x, y0 - 14, x, y0 + step * (items.length - 1) + 14, O({ stroke: o.dark ? LIGHT : INK })));
    items.forEach(([a, b], i) => {
      const y = y0 + i * step;
      add(svg, rc.circle(x, y, 14, O({ stroke: FINK, fill: FLAME, fillStyle: 'solid' })));
      T(svg, x + 20, y - 2, a, { size: o.size || 18, serif: true, fill: FINK });
      T(svg, x + 20, y + 16, b, { size: 12.5, fill: o.dark ? '#D8D2CB' : INK2 });
    });
  }
  const CH = {
    s1(svg) {
      waffle(svg, 12, 30, 50, 40, 10, 26, 18, { square: true });
      T(svg, 0, 186, 'About 40,000 of 50,000+ new Victorian homes', { size: 15, serif: true, fill: FINK });
      T(svg, 0, 205, 'a year had connected to gas before the 2024 rule', { size: 12.5, fill: INK2 });
      T(svg, 0, 224, 'Each square: 1,000 homes (Planning Victoria)', { size: 11.5, fill: STEEL });
      timeline(svg, 420, 30, 66, [
        ['Dec 2023', 'ACT: no new gas network connections'],
        ['Jan 2024', 'Victoria: no gas in new-dwelling permits'],
        ['Jan 2026', 'City of Sydney: new homes all-electric'],
        ['Jan 2027', 'Victoria all-electric; Sydney adds outdoor gas appliances']]);
    },
    s2(svg) {
      waffle(svg, 12, 30, 100, 40, 10, 22, 15);
      T(svg, 0, 256, '4 in 10 homes have rooftop solar', { size: 18, serif: true, fill: FINK });
      T(svg, 0, 276, 'Each dot: 1 in 100 Australian homes', { size: 12, fill: STEEL });
      hstack(svg, 300, 120, 540, 40, [
        { v: 271508, n: '271,508', t: 'Batteries installed before H2 2025', c: '#B8B6B2', s: 'cross-hatch' },
        { v: 183245, n: '183,245', t: 'Installed in H2 2025', c: FLAME, s: 'hachure' }]);
      T(svg, 300, 70, 'Home batteries: 454,753 by the end of 2025', { size: 16, weight: 700 });
      T(svg, 300, 90, 'Clean Energy Council, via pv magazine', { size: 12, fill: STEEL });
      T(svg, 300, 236, 'Four times as many installed in H2 2025 as a year before', { size: 13, fill: INK2 });
    },
    s3(svg) {
      pie(svg, 90, 95, 140, 37, { label: '37%', cap: 'of all housing spend|goes on renovation' });
      vbars(svg, 330, 240, [{ v: 1, t: '1×', l: 'Pre-|pandemic' }, { v: 2.9, t: '~3×', l: 'Sep quarter|2025', hl: 1 }], 3.2, 180, { w: 70, g: 40 });
      T(svg, 300, 306, 'Renovation lending, owner-occupiers (HIA)', { size: 12, fill: STEEL });
      vbars(svg, 610, 240, [{ v: 100, t: '100', l: 'Victoria' }, { v: 148, t: '~150', l: 'NSW', hl: 1 }], 160, 180, { w: 70, g: 40 });
      T(svg, 590, 306, 'Renovation investment 2026, Victoria = 100 (HIA)', { size: 12, fill: STEEL });
    },
    s4(svg) {
      vbars(svg, 30, 240, [{ v: 670, t: '670 m²', l: '2015' }, { v: 645, t: '645 m²', l: '2025', hl: 1 }], 700, 170, { w: 80, g: 44, vs: 20 });
      T(svg, 0, 306, 'Median land size, houses sold', { size: 12, fill: STEEL });
      vbars(svg, 340, 240, [{ v: 241, t: '241 m²', l: 'Average new|house' }], 700, 170, { w: 80, g: 44, vs: 20 });
      T(svg, 330, 306, 'Houses hold their size', { size: 12, fill: STEEL });
      vbars(svg, 580, 240, [{ v: 62, t: '+62%', l: 'Courtyard', hl: 1 }, { v: 55, t: '+55%', l: 'Open|fireplace', hl: 1 }], 70, 170, { w: 80, g: 44, vs: 20 });
      T(svg, 570, 306, 'Growth in home searches, 2025 (PropTrack)', { size: 12, fill: STEEL });
    },
    s5(svg) {
      vbars(svg, 40, 240, [{ v: 64.0, t: '64%', l: 'World' }, { v: 70.4, t: '70%', l: 'Australia', hl: 1 }], 80, 180, { w: 80, g: 50 });
      T(svg, 20, 306, 'Pergolas and patios: share of structures revenue, 2025', { size: 12, fill: STEEL });
      vbars(svg, 520, 240, [{ v: 6.1, t: '6.1%', l: 'World' }, { v: 6.9, t: '6.9%', l: 'Australia', hl: 1 }], 8, 180, { w: 80, g: 50 });
      T(svg, 500, 306, 'Forecast market growth a year, to 2033', { size: 12, fill: STEEL });
    },
    s6(svg) {
      vbars(svg, 20, 230, [{ v: 15.29, t: '15.3 °C', l: 'Sydney', hl: 1 }, { v: 12.18, t: '12.2 °C', l: 'Melbourne', hl: 1 }, { v: 8.14, t: '8.1 °C', l: 'Canberra', hl: 1 }], 17, 170, { w: 66, g: 30, vs: 19 });
      T(svg, 0, 300, 'Winter 2026 average: warmest on record (provisional)', { size: 12, fill: STEEL });
      vbars(svg, 480, 230, [{ v: 3.2, t: '3.2 °C', l: 'Melbourne' }, { v: 2.6, t: '2.6 °C', l: 'Hobart' }, { v: 0.1, t: '0.1 °C', l: 'Melbourne|Airport' }], 17, 170, { w: 66, g: 30, vs: 19 });
      T(svg, 460, 300, 'Overnight lows, 6 July 2026: five states below zero', { size: 12, fill: STEEL });
    },
    s7(svg) {
      people(svg, 20, 40, 12, 4, 6, 42);
      T(svg, 0, 160, 'More than 1 in 3 venues: turnover up 20%', { size: 15, serif: true, fill: FINK });
      vbars(svg, 390, 240, [{ v: 1000, t: '~1,000', l: 'Sydney|approvals', hl: 1 }, { v: 800, t: '800+', l: 'Sydney|businesses' }, { v: 580, t: '580+', l: 'NSW businesses,|relaxed rules' }, { v: 380, t: '380', l: 'NSW ongoing|approvals' }], 1100, 180, { w: 62, g: 50, vs: 20 });
      T(svg, 0, 200, 'About 13,000 m² of Sydney outdoor', { size: 13, fill: INK2 });
      T(svg, 0, 218, 'dining area; fees waived for good', { size: 13, fill: INK2 });
      T(svg, 370, 306, 'City of Sydney, July 2025 · NSW Government, March 2026', { size: 12, fill: STEEL });
    },
    s8(svg) {
      pie(svg, 100, 95, 140, 10.4, { label: '10.4%', cap: 'of foodservice businesses|closed in a year (R&CA)' });
      vbars(svg, 400, 240, [{ v: 0.31, t: '0.31%', l: 'All|businesses' }, { v: 1.15, t: '1.15%', l: 'Cafés and|restaurants', hl: 1 }], 1.3, 180, { w: 80, g: 50, vs: 20 });
      T(svg, 380, 306, 'Trade-payment default rate, July 2026 (CreditorWatch)', { size: 12, fill: STEEL });
    },
    s9(svg) {
      dumbbell(svg, [
        { l: 'Own a smart home product', u: 'Share of households', a: 69, b: 86, al: '69%', bl: '86%', ay: '2022', by: '2026' },
        { l: 'Have a smart-home budget', u: 'Share of households', a: 44, b: 71, al: '44%', bl: '71%', ay: '2024', by: '2026' }], 100, { x0: 330, x1: 600, gap: 120 });
      vbars(svg, 680, 240, [{ v: 7.7, t: 'A$7.7bn', l: '2025' }, { v: 11, t: 'A$11bn+', l: '2026', hl: 1 }], 12, 170, { w: 60, g: 30, vs: 17 });
      T(svg, 650, 306, 'Smart home market (forecast)', { size: 12, fill: STEEL });
    },
    s10(svg) {
      waffle(svg, 12, 30, 100, 85, 10, 22, 15);
      T(svg, 0, 256, '85 in 100 Australians live', { size: 18, serif: true, fill: FINK });
      T(svg, 0, 276, 'within 50 km of the coast', { size: 12.5, fill: INK2 });
      const rc = rough.svg(svg);
      [['Modern Coastal', 'a named 2026 home style (WGSN)'], ['Stacker doors', 'whole living areas open to the alfresco'], ['The outdoor room', '“the year of the outdoor room” (Home Beautiful)']].forEach(([a, b], i) => {
        const y = 50 + i * 80;
        add(svg, rc.rectangle(330, y - 26, 500, 62, O({ stroke: LINE })));
        add(svg, rc.circle(356, y + 5, 16, O({ stroke: FINK, fill: FLAME, fillStyle: 'solid' })));
        T(svg, 380, y, a, { size: 19, serif: true, fill: INK });
        T(svg, 380, y + 20, b, { size: 12.5, fill: INK2 });
      });
    },
    market(svg) {
      const rc = rough.svg(svg), yrs = [], vals = [];
      for (let y = 2025; y <= 2033; y++) { yrs.push(y); vals.push(y === 2025 ? 50.4 : 54.2 * Math.pow(1.069, y - 2026)); }
      const X = i => 60 + i * 55, Y = v => 250 - v * 2.0;
      add(svg, rc.line(50, 250, 510, 250, O({ stroke: INK })));
      [25, 50, 75, 100].forEach(v => { add(svg, rc.line(50, Y(v), 510, Y(v), O({ stroke: LINE, strokeWidth: 0.8, roughness: 0.5 }))); T(svg, 0, Y(v) + 4, '$' + v + 'M', { size: 11, fill: STEEL }); });
      const pts = vals.map((v, i) => [X(i), Y(v)]);
      add(svg, rc.polygon([[X(0), 250], ...pts, [X(8), 250]], O({ stroke: 'none', fill: FLAME, fillStyle: 'hachure', hachureGap: 7, fillWeight: 1 })));
      add(svg, rc.linearPath(pts, O({ stroke: FINK, strokeWidth: 3 })));
      [[0, 'US$50.4M', 26], [1, 'US$54.2M', 48], [8, 'US$86.5M', 18]].forEach(([i, a, dy]) => {
        add(svg, rc.circle(X(i), Y(vals[i]), 14, O({ stroke: FINK, fill: '#fff', fillStyle: 'solid' })));
        T(svg, X(i) + (i === 8 ? -6 : 4), Y(vals[i]) - dy, a, { size: 19, serif: true, fill: FINK, anchor: i === 8 ? 'end' : 'start' });
      });
      yrs.forEach((y, i) => { if (i % 2 === 0) T(svg, X(i), 268, String(y), { size: 11.5, anchor: 'middle', fill: STEEL }); });
    },
  };
  const MINI = {
    search(svg) {
      const rc = rough.svg(svg), hl = { 5: 'Outdoor area', 7: 'Balcony', 10: 'Heating' };
      for (let i = 1; i <= 10; i++) {
        const x = 20 + (i - 1) * 29, on = !!hl[i];
        add(svg, rc.circle(x, 70, 24, O({ stroke: on ? FINK : '#6E6867', fill: on ? FLAME : 'none', fillStyle: 'solid', roughness: 0.9 })));
        T(svg, x, 75, String(i), { size: 12, anchor: 'middle', fill: on ? '#fff' : '#BDB6AE', weight: 700 });
      }
      T(svg, 136, 112, 'Outdoor area', { size: 12, anchor: 'middle', fill: LIGHT });
      T(svg, 194, 136, 'Balcony', { size: 12, anchor: 'middle', fill: LIGHT });
      T(svg, 296, 112, 'Heating', { size: 12, anchor: 'end', fill: LIGHT });
      T(svg, 6, 30, 'Top 10 home searches, 2025', { size: 12, fill: '#BDB6AE' });
    },
    reno(svg) { pie(svg, 150, 85, 140, 37, { ring: '#6E6867' }); T(svg, 150, 178, '37% of housing spend', { size: 12, anchor: 'middle', fill: '#BDB6AE' }); },
    vic(svg) {
      const rc = rough.svg(svg), xs = [20, 95, 185, 270], lab = [['2023', 'ACT'], ['2024', 'VIC permits'], ['2026', 'Sydney'], ['2027', 'VIC + Sydney']];
      add(svg, rc.line(10, 90, 292, 90, O({ stroke: LIGHT })));
      xs.forEach((x, i) => {
        add(svg, rc.circle(x, 90, i === 3 ? 22 : 14, O({ stroke: FINK, fill: FLAME, fillStyle: 'solid' })));
        T(svg, x, i % 2 ? 128 : 62, lab[i][0], { size: 16, serif: true, anchor: i === 0 ? 'start' : i === 3 ? 'end' : 'middle', fill: FLAME });
        T(svg, x, i % 2 ? 146 : 44, lab[i][1], { size: 11, anchor: i === 0 ? 'start' : i === 3 ? 'end' : 'middle', fill: '#D8D2CB' });
      });
    },
    pergola(svg) { pie(svg, 150, 85, 140, 70.4, { ring: '#6E6867' }); T(svg, 150, 178, 'Pergolas and patios, 2025', { size: 12, anchor: 'middle', fill: '#BDB6AE' }); },
    gap(svg) { pie(svg, 110, 86, 150, 40, {}); T(svg, 110, 206, '~40%', { size: 38, serif: true, anchor: 'middle', fill: FINK }); },
  };
  return { CH, MINI };
};
