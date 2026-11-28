// Training Hub · Dealer track · B2: The Bromic Portfolio (30–45 min).
// Facts: data/product-marketing/*.json (pillars, tiers, accessories), reports/white-papers/pergola-2027/content.py (coverage, heights,
// gas rule, Affinity), reports/white-papers/portfolio-applications/content.py (APPS and the application cards).
// Look: the white papers' range and portfolio pages (cut-outs on white side by side, dark-header tables, Didot numerals over rules).
// Run: NODE_PATH=$PWD/node_modules node b2-bromic-portfolio.js
const L = require('./lib');
const { T, H1, pic, rule, num, HEX, W, M } = L;
const fs = require('fs'), path = require('path'), sharp = require('sharp');

// Cut-outs on white, trimmed to the product so a line-up reads at one scale (the white papers' range pages).
// lift brightens a near-white studio ground to white. Returns an absolute path that L.pic takes.
const CUT = path.join(__dirname, 'cache', 'cut'); fs.mkdirSync(CUT, { recursive: true });
const cuts = {};
async function cutout(id, lift = 1) {
  const f = id.startsWith('rv-') ? path.join(__dirname, '../../images/review/full', id.slice(3) + '.jpg') : path.join(__dirname, '../../images/library', id + '.webp');
  const out = path.join(CUT, `${id}-${lift}.png`);
  if (!fs.existsSync(out)) {
    let im = sharp(f).flatten({ background: '#ffffff' });
    if (lift !== 1) im = sharp(await im.linear(lift, 0).toBuffer());
    const buf = await im.png().toBuffer();
    await sharp(buf).trim({ background: '#ffffff', threshold: 18 }).extend({ top: 24, bottom: 24, left: 24, right: 24, background: '#ffffff' }).png().toFile(out);
  }
  return (cuts[id] = out);
}

async function main() {
  L.start({ title: 'The Bromic Portfolio', footer: 'Dealer Training · The Bromic Portfolio' });
  await L.prepIcons();
  for (const [id, lift] of [['w-platinum-black', 1], ['w-eclipse-electric', 1], ['w-eclipse-portable', 1.2], ['w-tungsten-gas-500', 1], ['w-bromic-platinum-gas-300-on', 1],
    ['w-tungportfront-1', 1], ['t2-classic', 1], ['t2-select-black', 1], ['w-affinity-dimmer-5ch', 1], ['w-manual-1ch-indoor-switch-image', 1]]) await cutout(id, lift);
  const R = () => L.pres.shapes.RECTANGLE;
  const box = (s, x, y, w, h, color, name = 'panel') => s.addShape(R(), { x, y, w, h, fill: { color }, line: { color, width: 0 }, objectName: name });
  const cap = (s, t, x, y, w, o = {}) => T(s, t.toUpperCase(), { x, y, w, h: 0.28, fontSize: 9.5, bold: true, charSpacing: 3, color: HEX.FLAME, ...o });
  // a table in the white papers' style: ink header row, white caps, hairline rows; optional washed column
  function table(s, x, y, cols, head, rows, o = {}) {
    const hh = o.hh || 0.42, rh = o.rh || 0.5, tw = cols.reduce((a, b) => a + b, 0), fs = o.fs || 13;
    box(s, x, y, tw, hh, HEX.INK, 'table-head');
    if (o.wash != null) { const wx = x + cols.slice(0, o.wash).reduce((a, b) => a + b, 0); box(s, wx, y + hh, cols[o.wash], rh * rows.length, HEX.WASH, 'table-wash'); }
    let cx = x; head.forEach((h, j) => { T(s, h.toUpperCase(), { x: cx + 0.14, y, w: cols[j] - 0.22, h: hh, fontSize: 9, bold: true, charSpacing: 2, color: HEX.WHITE, valign: 'middle' }); cx += cols[j]; });
    rows.forEach((r, i) => {
      const ry = y + hh + i * rh; cx = x;
      r.forEach((c, j) => { T(s, c, { x: cx + 0.14, y: ry, w: cols[j] - 0.22, h: rh, fontSize: fs, valign: 'middle', color: j === 0 && o.lead ? HEX.INK : HEX.BODY, bold: j === 0 && !!o.lead }); cx += cols[j]; });
      rule(s, x, ry + rh, tw, 'C9C9C6', 0.5);
    });
  }
  // the controls: an ink panel, the controller icon bare in white, flame caps, white text
  function controls(s, x, y, w, h, text, ic) {
    box(s, x, y, w, h, HEX.INK, 'controls');
    const tx = ic ? x + 1.0 : x + 0.3;
    if (ic) L.icon(s, ic, x + 0.28, y + (h - 0.55) / 2, 0.55, { dark: true });
    cap(s, 'Controls', tx, y + 0.2, w - (tx - x) - 0.25);
    T(s, text, { x: tx, y: y + 0.48, w: w - (tx - x) - 0.25, h: h - 0.6, fontSize: 14, color: HEX.WHITE });
  }
  // four facts as numbered lines under hairlines
  function facts(s, list, x, y, w, step) {
    list.forEach((t, i) => {
      const fy = y + i * step; rule(s, x, fy, w, HEX.INK, 0.5);
      num(s, i + 1, x, fy + 0.1, { size: 17, h: 0.4, w: 0.55 });
      T(s, t, { x: x + 0.65, y: fy + 0.12, w: w - 0.65, h: step - 0.2, fontSize: 15, color: HEX.INK });
    });
  }
  // A series page, in three layouts so seven pages do not read as one template:
  //  'left'  photo left, numbered facts right, controls panel below them
  //  'right' numbered facts left, photo bleeding off the top and right edge
  //  'band'  photo as a wide band, the four facts as columns, controls in a wash strip
  function series({ section, kicker, title, img, layout = 'left', facts: F, controls: ctl, ic, caption, notes }) {
    const s = L.content(section, kicker, title, notes);
    if (layout === 'left') {
      pic(s, img, M, 1.85, 6.1, 4.9, 'cover', 'series-image');
      if (caption) T(s, caption, { x: M, y: 6.78, w: 6.1, h: 0.2, fontSize: 9, color: HEX.STEEL });
      facts(s, F, 7.05, 1.85, 5.68, 0.86);
      controls(s, 7.05, 5.45, 5.68, 1.3, ctl, ic);
    } else if (layout === 'right') {
      pic(s, img, 7.35, 0, W - 7.35, 6.85, 'cover', 'series-image');
      facts(s, F, M, 1.95, 6.2, 0.84);
      controls(s, M, 5.45, 6.2, 1.3, ctl, ic);
    } else {
      pic(s, img, M, 1.85, W - 2 * M, 2.45, 'cover', 'series-image');
      const cw = (W - 2 * M - 3 * 0.3) / 4;
      F.forEach((t, i) => {
        const x = M + i * (cw + 0.3); rule(s, x, 4.55, cw, HEX.INK, 0.5);
        num(s, i + 1, x, 4.63, { size: 17, h: 0.4, w: 0.55 });
        T(s, t, { x, y: 5.05, w: cw, h: 1.05, fontSize: 14, color: HEX.INK });
      });
      box(s, M, 6.15, W - 2 * M, 0.62, HEX.WASH, 'controls');
      cap(s, 'Controls', M + 0.25, 6.15, 1.4, { h: 0.62, valign: 'middle' });
      T(s, ctl, { x: M + 1.6, y: 6.15, w: W - 2 * M - 1.8, h: 0.62, fontSize: 14, color: HEX.INK, valign: 'middle' });
    }
    return s;
  }

  // 1 · cover
  L.cover({
    kicker: 'Dealer Training · B2', title: 'The Bromic *Portfolio*',
    sub: 'Every heater, where it goes, and the controls that go with it.',
    meta: '30–45 minutes · 3 exercises · 2 knowledge checks', img: 'l-004-012',
    notes: 'Welcome. By the end of this session you should be able to look at any outdoor space and say which Bromic heater to show first, and which controls go with it. Three exercises and two quick checks along the way.',
  });

  // 2 · one family: the range page, product cut-outs on white side by side
  {
    const s = L.content('Welcome', 'The Range', 'One Family For Every Outdoor Room',
      'Eight heater families, one brand. Electric on ceilings, walls, posts and recesses: Tungsten Series II, Tungsten Coastal and Platinum Electric. Heat and light in one: the Eclipse pendant and Eclipse Freestanding. Gas, mounted: Tungsten Gas and Platinum Gas. And gas that moves: Tungsten Freestanding Gas. Electric heaters run on Affinity controls and the Bromic app.');
    const P = [
      ['rv-pr-select-black-hero', 'cover', 'Tungsten Series II', 'Electric'], ['pf-tungsten-coastal', 'cover', 'Tungsten Coastal', 'Electric · by the water'],
      [cuts['w-platinum-black'], 'contain', 'Platinum Electric', 'Electric · and Marine'], [cuts['w-eclipse-electric'], 'contain', 'Eclipse Pendant', 'Electric · heat and light'],
      [cuts['w-eclipse-portable'], 'contain', 'Eclipse Freestanding', 'Electric · freestanding'], [cuts['w-tungsten-gas-500'], 'contain', 'Tungsten Gas', 'Gas · mounted'],
      [cuts['w-bromic-platinum-gas-300-on'], 'contain', 'Platinum Gas', 'Gas · mounted'], [cuts['w-tungportfront-1'], 'contain', 'Tungsten Freestanding', 'Gas · freestanding'],
    ];
    const cw = (W - 2 * M - 3 * 0.3) / 4, ih = 1.62;
    P.forEach(([im, mode, n, t], i) => {
      const x = M + (i % 4) * (cw + 0.3), y = 1.85 + Math.floor(i / 4) * 2.5;
      if (mode === 'contain') pic(s, im, x + 0.25, y + 0.2, cw - 0.5, ih - 0.35, mode, 'product');
      else pic(s, im, x, y, cw, ih, mode, 'product');
      rule(s, x, y + ih + 0.1, cw, HEX.INK, 0.5);
      H1(s, n, { x, y: y + ih + 0.18, w: cw, h: 0.36, fontSize: 16 });
      cap(s, t, x, y + ih + 0.53, cw, { fontSize: 8.5, charSpacing: 2, color: t.startsWith('Gas') ? HEX.STEEL : HEX.FLAME });
    });
  }

  // 3 · divider
  L.divider({ n: '01', title: 'How To Choose', line: 'Fuel, mount, setting and style: four questions narrow it to one heater.', img: 'w-aba-restaurant',
    notes: 'Module one. Before the series, four choices that narrow the range: electric or gas, on the structure or freestanding, how close to the water, and the design style of the outdoor room.' });

  // 4 · electric vs gas: two photographs, a heading with its fuel icon, three ruled lines each
  {
    const s = L.content('How To Choose', 'Choice 1', 'Electric Or Gas',
      'Under a roof, electric is simplest: no gas line, no flue and no ventilation sums, and it switches on instantly. Gas suits a site where the line already runs, or propane where there is none, and venues that want a big reach per heater: up to 215 square feet. Gas under a roof follows its ventilation rule: with a roof and more than two walls, at least 25% of the total wall area must be fully open, plus 30% of the rest. Gas heaters cannot be recessed. Always follow the manual and local code.');
    const col = [
      ['w-vbb7428', 'electric', 'Electric', ['No gas line, flue or ventilation sums under a roof', 'On the ceiling, wall, post, or recessed flush', 'Dimmed and scheduled from the Bromic app']],
      ['w-bromic-pg-residential-hr', 'gas', 'Gas', ['Natural gas or propane, the same warmth', 'Up to 215 ft² from one heater', 'Never recessed; needs open walls under a roof']],
    ];
    const cw = (W - 2 * M - 0.45) / 2;
    col.forEach(([im, ic, h, pts], i) => {
      const x = M + i * (cw + 0.45);
      pic(s, im, x, 1.85, cw, 2.5, 'cover', 'photo');
      L.icon(s, ic, x, 4.55, 0.5);
      H1(s, h, { x: x + 0.65, y: 4.52, w: 4.5, h: 0.56, fontSize: 26, valign: 'middle' });
      pts.forEach((p, j) => { const y = 5.25 + j * 0.5; rule(s, x, y, cw, j ? 'C9C9C6' : HEX.INK, 0.5); T(s, p, { x, y: y + 0.08, w: cw, h: 0.4, fontSize: 15, color: HEX.INK }); });
    });
  }

  // 5 · structure vs freestanding: two ruled blocks on the left, two photographs stacked on the right
  {
    const s = L.content('How To Choose', 'Choice 2', 'On The Structure Or Freestanding',
      'If there is a roof, a wall or a post, mount the heater: on the beam or ceiling on Tungsten\'s single post, on a wall bracket, on the pitched-ceiling adaptor from 3/12 to 12/12, as an Eclipse pendant over the table, or recessed flush with the low-clearance kit. If there is none, go freestanding: Eclipse Freestanding arches heat and light over the sofa; the Tungsten Freestanding Gas tower rolls to wherever the table is.');
    const col = [
      ['l-008-059', 'mount-ceiling', 'On The Structure', 'Beam, ceiling, wall, pitched roof, pendant or recessed flush.', 'Tungsten · Platinum · Eclipse pendant · mounted gas'],
      ['l-002-007', 'heater-freestanding', 'Freestanding', 'No roof or wall: a heater that stands beside the seats.', 'Eclipse Freestanding · Tungsten Freestanding Gas'],
    ];
    col.forEach(([im, ic, h, d, which], i) => {
      const y = 1.95 + i * 2.45;
      rule(s, M, y, 5.7, HEX.INK, 0.75);
      num(s, i + 1, M, y + 0.12, { size: 20, h: 0.45, w: 0.6 });
      L.icon(s, ic, M + 5.1, y + 0.15, 0.6);
      H1(s, h, { x: M, y: y + 0.6, w: 5.0, h: 0.5, fontSize: 26 });
      T(s, d, { x: M, y: y + 1.18, w: 5.7, h: 0.5, fontSize: 15, color: HEX.INK });
      T(s, which, { x: M, y: y + 1.7, w: 5.7, h: 0.4, fontSize: 13, bold: true, color: HEX.FLAME });
      pic(s, im, 6.85, 1.85 + i * 2.5, W - M - 6.85, 2.4, 'cover', 'photo');
    });
  }

  // 6 · by the water: a half-page photograph and a dark-header comparison table
  {
    const s = L.content('How To Choose', 'Choice 3', 'By The Water',
      'Salt air and pool chlorine test every metal. Two heaters are built for it. Tungsten Coastal: 4 and 6 kW, 208 and 240 V, black or white, a marine-grade build under a high-temperature corrosion-resistant coating, with a recess kit in powder-coated 316 stainless, IPX5. Platinum Electric Marine: the same glass face in AISI 316 stainless, IPX5 (IP55 on 4500 W), five-year warranty on land-based installs. Both are for homes and venues by the water, not boats. Coastal body material and coating name are to confirm with the Product team; Marine use on vessels is also to confirm. Remind customers that stainless is not stain-free: wipe off salt spray and clean regularly, as the manuals ask.');
    pic(s, 'l-005-020', 0, 1.85, 6.35, 4.95, 'cover', 'photo');
    table(s, 6.85, 1.85, [2.94, 2.94], ['Tungsten Coastal', 'Platinum Electric Marine'], [
      ['Marine-grade build under a corrosion-resistant coating', 'AISI 316 marine-grade stainless'],
      ['4 and 6 kW, black or white', 'IPX5, IP55 on 4500 W'],
      ['Recess kit in powder-coated 316 stainless, IPX5', '5-year warranty on land-based installs'],
    ], { rh: 0.78, fs: 14, hh: 0.45 });
    L.icon(s, 'coastal', 6.85, 4.95, 0.55);
    H1(s, 'For homes and venues by the water, not boats.', { x: 7.6, y: 4.95, w: 5.1, h: 0.9, fontSize: 20 });
    T(s, 'Stainless is not stain-free: wipe off salt spray and clean regularly, as the manuals ask.', { x: 7.6, y: 5.9, w: 5.1, h: 0.7, fontSize: 13, color: HEX.STEEL });
  }

  // 6a · design style (owner, 28 Nov 2026: "what's your design style... if it's modern, the default is Platinum and or Eclipse")
  {
    const s = L.content('How To Choose', 'Choice 4', 'What Is The Style Of Your Outdoor Room?',
      'Ask it early: "How would you describe the style of your outdoor space?" The answer picks the series faster than any spec. Modern, contemporary or minimal: show Platinum and Eclipse first, by default. Platinum is the quiet glass-ceramic panel, 2.1 in deep, black or white, surface-mounted or flush in the ceiling with very little visible glow; Eclipse turns the heater into a piece of lighting, with radiant heat and a dimmable 3000K LED ring over the table. Many modern rooms take both: Platinum over the lounge, Eclipse over the dining table. Transitional, modern farmhouse or California casual: Tungsten Select, slim on a single post in black, white or graphite to match the window frames and the pergola; Classic where the budget is tighter, with the same warmth. Timber, craftsman or traditional, with exposed beams or tongue-and-groove: Tungsten in black or graphite on the beam, or recessed so the ceiling stays the feature; Platinum recessed where the look must disappear. By the water, whatever the style: Tungsten Coastal or Platinum Electric Marine. Industrial, rustic or a busy venue: Tungsten in graphite or black on the beam, or Tungsten Gas where the line runs. Whatever the style, every heater leaves with its controls: Affinity On/Off or Dimmer for Tungsten and Platinum, the Eclipse controller for Eclipse, and a wall switch.');
    const cols = [
      ['l-010-071', 'Modern · Default', 'Platinum And Eclipse', 'Flush glass panel, or heat and light as one fixture.', 1],
      ['w-connecticut-privateresidence-tungstenelectri-3', 'Transitional · Farmhouse', 'Tungsten Select', 'Slim on one post, in black, white or graphite.', 0],
      ['w-dsc05737-courtney-saib', 'Timber · Traditional', 'Tungsten, On The Beam Or Recessed', 'Black or graphite; the ceiling stays the feature.', 0],
      ['l-005-022', 'Coastal', 'Tungsten Coastal · Platinum Marine', 'Built for salt air, whatever the style.', 0],
      ['w-tungsten-gas-500-fiddler-sydney-2-1', 'Industrial · Venue', 'Tungsten Electric Or Gas', 'Graphite or black on exposed beams.', 0],
    ];
    const gap = 0.25, cw = (W - 2 * M - 4 * gap) / 5;
    cols.forEach(([im, k, h, d, hot], i) => {
      const x = M + i * (cw + gap);
      pic(s, im, x, 1.85, cw, 2.35, 'cover', 'photo');
      rule(s, x, 4.35, cw, hot ? HEX.FLAME : HEX.INK, hot ? 2 : 0.5);
      cap(s, k, x, 4.45, cw, { fontSize: 8.5, charSpacing: 2, h: 0.4, color: hot ? HEX.FLAME : HEX.STEEL });
      H1(s, h, { x, y: 4.85, w: cw, h: 0.85, fontSize: 17 });
      T(s, d, { x, y: 5.72, w: cw, h: 0.75, fontSize: 13 });
    });
    rule(s, M, 6.5, W - 2 * M, 'C9C9C6', 0.5);
    T(s, 'Every heater leaves with its controls: Affinity On/Off or Dimmer, the Eclipse controller for Eclipse, and a wall switch.', { x: M, y: 6.56, w: 12.1, h: 0.3, fontSize: 12, color: HEX.INK });
  }

  // 7 · check 1
  L.quiz({ section: 'How To Choose', n: 1, q: 'A Covered Patio, No Gas Line, And The Heater Should Disappear. Which One?',
    options: ['Tungsten Gas on a drop pole', 'Platinum Electric, recessed flush', 'Tungsten Freestanding Gas', 'Eclipse Freestanding'],
    answer: 1, why: 'Electric needs no gas line, and Platinum Electric recesses flush in a ceiling cavity as shallow as 7.1 in with the low-clearance kit: 2.1 in deep glass-ceramic with very little visible glow. It goes on an Affinity Dimmer with a wall switch. Tungsten Select recessed in a 7.5 in cavity is a fair second answer.' });

  // 8 · divider
  L.divider({ n: '02', title: 'The Series', line: 'Each heater, four facts to remember, and its controls.', img: 'rv-pr-d-recess-black-timber-logo-f1-4',
    notes: 'Module two walks through each series. For every one, remember four facts and the controls that go with it. The controls are never optional.' });

  // 9 · Tungsten Series II: the hero render with callouts, as on the white paper's "Made For The Pergola"
  {
    const s = L.content('The Series', 'Electric · Launched October 2026', 'Tungsten Series II',
      'Tungsten Series II is the slim, directional heater for patios and pergolas. Select and Coastal launched in October 2026; Classic follows in January 2027. Key facts: up to 6 kW, a single post with the cable inside, IPX5, and a low-clearance recess kit for a 7.5 in cavity with the box supplied. The angled bracket sets 15, 30 or 45 degrees, on every model from 2 to 6 kW. Controls: Affinity On/Off or Dimmer, each channel up to 6 kW at 208 to 277 V, so one 6 kW Tungsten a channel, plus a wall switch.');
    pic(s, 'rv-pr-select-black-hero', M, 1.85, 7.35, 4.9, 'cover', 'hero-render');
    const CO = [
      ['Up To 6 kW', '2, 3, 4 and 6 kW; dual elements on 4 and 6 kW. Up to 160 ft² a heater.', M + 0.2, 2.02],
      ['One Single Post', 'Wiring inside, no junction box on show. About 14% narrower and a third lighter than Series I.', M + 7.35 - 3.1, 2.02],
      ['Recesses Flush', 'In a 7.5 in cavity, fan-ventilated, recess box supplied. Pitched adaptor from 3/12 to 12/12.', M + 0.2, 5.62],
      ['IPX5', '208, 240 and 277 V (2 kW is 240 V only).', M + 7.35 - 3.1, 5.62],
    ];
    CO.forEach(([h, d, x, y]) => {
      box(s, x, y, 2.9, 0.96, HEX.WHITE, 'callout'); box(s, x, y, 0.05, 0.96, HEX.FLAME, 'callout-bar');
      H1(s, h, { x: x + 0.2, y: y + 0.07, w: 2.6, h: 0.33, fontSize: 14 });
      T(s, d, { x: x + 0.2, y: y + 0.4, w: 2.62, h: 0.52, fontSize: 9.5, color: HEX.BODY });
    });
    pic(s, 'rv-pr-select-family-three-finishes', 8.3, 1.85, 4.43, 2.95, 'cover', 'finishes');
    T(s, 'Select in black, white and graphite.', { x: 8.3, y: 4.86, w: 4.43, h: 0.25, fontSize: 10, color: HEX.STEEL });
    controls(s, 8.3, 5.3, 4.43, 1.45, 'Affinity On/Off or Dimmer, 1, 2 or 5 channels, up to 6 kW a channel; a wall switch.', 'controller-dimmer');
  }

  // 10 · Classic / Select / Coastal: products on white over a dark-header spec table
  {
    const s = L.content('The Series', 'Tungsten Series II', 'Classic, Select And Coastal',
      'Three versions. Classic is the entry point: the same heat coverage as Select, a black body with stainless end covers, the proven Series I mounting, and a two-year warranty; it launches in January 2027. Select is the one to show first: black, white or graphite (graphite on 4 and 6 kW), three fronts with the Diamond Pattern as standard, single post, the new recess kit, three years on the heater and seven on the elements. Coastal is for homes by the water: 4 and 6 kW, black or white, with the marine-grade recess kit; three years on the heater and seven on the elements.');
    const lw = 1.75, cw = (W - 2 * M - lw) / 3;
    [['rv-pr-classic-black-hero', 'cover'], ['rv-pr-select-family-three-finishes', 'cover'], ['pf-tungsten-coastal', 'cover']].forEach(([im, mode], i) =>
      pic(s, im, M + lw + i * cw + 0.08, 1.85, cw - 0.16, 1.85, mode, 'product'));
    table(s, M, 3.85, [lw, cw, cw, cw], ['', 'Tungsten Classic', 'Tungsten Select', 'Tungsten Coastal'], [
      ['Available', 'January 2027', 'Available now', 'Available now'],
      ['Heat', 'Same heat coverage as Select', 'Same heat coverage as Classic', '4 and 6 kW'],
      ['Finish', 'Black, stainless end covers', 'Black, white or graphite; three fronts, Diamond standard', 'Black or white; corrosion-resistant coating'],
      ['Mounting', 'Series I mounting', 'Single post, flush recess kit', 'Marine-grade recess kit'],
      ['Warranty', '2 years', '3 years heater, 7 elements', '3 years heater, 7 elements'],
    ], { rh: 0.5, fs: 12.5, lead: true, wash: 2 });
  }

  // 11 · Platinum Electric
  series({ section: 'The Series', kicker: 'Electric · Platinum', title: 'Platinum Electric And Marine', img: 'w-p1021414-hdr-denoiseai-low-light', layout: 'left', ic: 'controller-dimmer',
    facts: ['Tinted glass-ceramic face: quiet heat with very little visible glow. Black or white.',
      'Just 2.1 in deep. Flush in a cavity as shallow as 7.1 in with the low-clearance kit.',
      '2300, 3400 and 4500 W: up to 65, 108 and 143 ft². 208 V or 240 V.',
      'Marine: AISI 316 stainless, 5-year warranty on land. Platinum: 3-year warranty.'],
    controls: 'Affinity Dimmer for 1% steps, zones and schedules in the app; a wall switch.',
    notes: 'Platinum is the best tier and the design-led choice: a glass-ceramic face in stainless, 2.1 inches deep, that reads as part of the architecture. It recesses flush in a 7.1 inch cavity with the low-clearance kit, recess box supplied, and comes with an 8 inch pole and wall bracket. Mount 2300 and 3400 W at 8 to 9 ft, 4500 W at 8 to 10 ft. Do not quote a visible-light figure; none is published yet. Marine use on vessels is to confirm with the Product team, so sell Marine for homes and venues by the water.' });

  // 12 · Platinum Gas
  series({ section: 'The Series', kicker: 'Gas · Platinum', title: 'Platinum Gas', img: 'w-california-laprovenance-platinumgas-01', layout: 'right', ic: 'controller-onoff',
    facts: ['23,600 and 39,800 BTU: heat areas up to 160 and 215 ft².',
      'Natural gas or propane, the same rated input on both.',
      'A ceramic-glass screen in a black or stainless body, designed to be seen.',
      'Wall bracket included, or two back to back on a ceiling pole. Tilts 0°, 10° or 20°. At least 8 ft up.'],
    controls: 'Affinity On/Off to switch heaters by zone, or a manual wall switch.',
    notes: 'Platinum Gas is the gas heater for restaurant, hotel and rooftop terraces where the heater is part of the look. Two sizes, natural gas or propane at the same input. Mount at least 8 ft above the floor; it is never recessed. Warranty is two years, excluding hoses and igniters. How many gas heaters one Affinity channel switches is to confirm with the Product team, so do not quote a number.' });

  // 13 · Tungsten Gas
  series({ section: 'The Series', kicker: 'Gas · Tungsten', title: 'Tungsten Gas', img: 'w-bromic-tungsten-gas-4', layout: 'band',
    facts: ['Two sizes: coverage up to 160 or 215 ft².',
      'Every model in natural gas or propane.',
      'Wall, beam or drop pole: pivot arm ±25°, poles in six lengths.',
      'A heat deflector brings top clearance from 3 ft to 14 in. 8 ft minimum height.'],
    controls: 'Affinity On/Off by zone, or a manual wall switch.',
    notes: 'Tungsten Gas is the compact, matte black honeycomb heater for covered bars, restaurants and alfresco areas. Coverage up to 160 or 215 square feet. Do not quote a BTU output for the mounted models: the published figures conflict and are to confirm with the Product team. Gas capacity on an Affinity channel is also to confirm.' });

  // 14 · Tungsten Freestanding Gas
  series({ section: 'The Series', kicker: 'Gas · Freestanding', title: 'Tungsten Freestanding Gas', img: 'l-002-008', layout: 'right',
    facts: ['Rolls on built-in wheels to wherever tonight\'s seating is. The head tilts to the guests.',
      'About 215 ft² of warmth.',
      'Propane, with a 20 lb cylinder in the base, or natural gas on a 10 ft quick-connect line.',
      'Flame failure device and anti-tilt switch.'],
    controls: 'Its own output knob on the propane tower. Not on the app.',
    notes: 'The tower for open seating away from walls: pool decks, lawns, restaurant patios. Propane or natural gas. The propane model\'s knob adjusts high to low; the natural gas model runs on high. The exact BTU figure differs between sources and is to confirm, so sell it by coverage: about 215 square feet. It is not on the Bromic app.' });

  // 15 · Eclipse pendant
  series({ section: 'The Series', kicker: 'Electric · Heat And Light', title: 'Eclipse Pendant', img: 'w-eclipse-electric-24twin-pole-residential-sce', layout: 'left', ic: 'heater-eclipse',
    facts: ['Radiant heat and a dimmable 3000K LED ring in one fixture.',
      '2,900 W over up to 121 ft². Three heat steps: 33, 66 and 100%.',
      '24 in twin pole included; 8, 24 or 48 in straight, curved or wall poles. Head at least 8 ft up.',
      '27.6 in matte black disc. 3-year warranty.'],
    controls: 'Affinity Eclipse Controller, one Eclipse a channel; or the Eclipse Dimmer Controller with remote.',
    notes: 'Eclipse is the centre of the room: heat and light over the dining table, hung from a centre or fan beam. Heat and light are set separately from the remote or the app. Mount the head at 8 to 9 ft. App features need the Affinity Eclipse Controller, sold separately.' });

  // 16 · Eclipse Freestanding
  series({ section: 'The Series', kicker: 'Electric · Freestanding', title: 'Eclipse Freestanding', img: 'l-016-136', layout: 'right', ic: 'controller-dimmer',
    facts: ['Arches heat and light over open seating with no ceiling or wall.',
      '220–240 V, a 15 ft cable and plug: needs an IP54 outdoor outlet.',
      'Weighted base for winds up to 20 mph; fix the base above that.',
      'The same Eclipse head: 2,900 W, 121 ft², and the warm LED ring.'],
    controls: 'Eclipse Dimmer Controller and remote.',
    notes: 'Eclipse Freestanding, sold earlier as Eclipse Portable, is for lawns, pool decks and rooftops with no structure. It needs a 220 to 240 V IP54 outdoor outlet and 79 inches of floor clearance under the head. App control of the freestanding model is to confirm with the Product team, so sell it with the Eclipse Dimmer Controller and remote.' });

  // 17 · controls: the controllers side by side on white, each over its rule
  {
    const s = L.content('The Series', 'Affinity Smart-Heat', 'Every Heater Leaves With Its Controls',
      'The rule: every heater on a quote has its control next to it. Affinity On/Off and Dimmer come in 1, 2 or 5 channels, each up to 6 kW at 208 to 277 V: one 6 kW Tungsten a channel. Eclipse takes the Affinity Eclipse controller, one Eclipse a channel. A manual wall switch is the local disconnect where code asks for one. The Bromic app runs zones, schedules, timers and dimming, with Alexa and Google Assistant; Control4, Crestron and Lutron compatibility varies and may need extra hardware. Wi-Fi and app features need compatible Affinity controls, sold separately.');
    const C = [
      [cuts['w-affinity-dimmer-5ch'], 'contain', 'Affinity On/Off Or Dimmer', 'Tungsten and Platinum. 1, 2 or 5 channels, up to 6 kW a channel at 208–277 V.'],
      [null, 'heater-eclipse', 'Affinity Eclipse Controller', 'One Eclipse a channel. Heat and light set separately.'],
      [cuts['w-manual-1ch-indoor-switch-image'], 'contain', 'Wall Switch', 'The local disconnect, where the code asks for one.'],
      ['w-bromic-heating-app-blog-image', 'cover', 'The Bromic App', 'Zones, schedules, timers and dimming. Alexa and Google.'],
    ];
    const cw = (W - 2 * M - 3 * 0.35) / 4;
    C.forEach(([im, mode, h, d], i) => {
      const x = M + i * (cw + 0.35);
      if (im) pic(s, im, x, 1.85, cw, 2.45, mode, 'controller');
      else L.icon(s, mode, x + (cw - 1.3) / 2, 1.85 + (2.45 - 1.3) / 2, 1.3);
      rule(s, x, 4.5, cw, HEX.INK, 0.5);
      num(s, i + 1, x, 4.58, { size: 17, h: 0.4, w: 0.55 });
      H1(s, h, { x, y: 5.0, w: cw, h: 0.7, fontSize: 18 });
      T(s, d, { x, y: 5.72, w: cw, h: 0.8, fontSize: 13 });
    });
    T(s, 'Wi-Fi and app features need compatible Affinity controls, sold separately.', { x: M, y: 6.55, w: 9, h: 0.3, fontSize: 11, color: HEX.STEEL });
  }

  // 18 · good / better / best: the white paper's "Same Warmth At Every Price Point"
  {
    const s = L.content('The Series', 'Where Each One Sits', 'Good, Better, Best, And The Centre',
      'Quote from the ladder. Good is Tungsten Classic, better is Tungsten Select, best is Platinum Electric. Classic and Select give the same heat coverage, so the customer chooses the look and the warranty, not the warmth. Eclipse sits beside the ladder as the centre of the room: heat and light over the table. Prices are relative here; use your current price list.');
    const L4 = [
      ['Good', 'Tungsten Classic', 'rv-pr-classic-black-hero', 'cover', 'Same heat as Select. Black. 2-year warranty.'],
      ['Better', 'Tungsten Select', 'rv-pr-select-black-hero', 'cover', 'Three finishes, single post, flush recess. 3 + 7 years.'],
      ['Best', 'Platinum Electric', cuts['w-platinum-black'], 'contain', 'Glass-ceramic, 2.1 in deep, quiet heat. 3 years.'],
      ['The Centre', 'Eclipse', cuts['w-eclipse-electric'], 'contain', 'Heat and light over the table. 3 years.'],
    ];
    const cw = (W - 2 * M - 3 * 0.35) / 4;
    L4.forEach(([tier, name, im, mode, d], i) => {
      const x = M + i * (cw + 0.35), best = i === 2;
      rule(s, x, 1.9, cw, best ? HEX.FLAME : HEX.INK, best ? 2.25 : 1);
      cap(s, tier, x, 2.02, cw, { color: best ? HEX.FLAME : HEX.STEEL });
      H1(s, name, { x, y: 2.32, w: cw, h: 0.5, fontSize: 21 });
      pic(s, im, x, 3.0, cw, 2.0, mode, 'product');
      rule(s, x, 5.2, cw, 'C9C9C6', 0.5);
      T(s, d, { x, y: 5.3, w: cw, h: 1.3, fontSize: 15, color: HEX.INK });
    });
  }

  // 19 · check 2
  L.quiz({ section: 'The Series', n: 2, q: 'What Do Tungsten Classic And Select Have In Common?',
    options: ['The finishes', 'The heat coverage', 'The warranty', 'The mounting'],
    answer: 1, why: 'Classic and Select give the same heat coverage, up to 65, 100, 130 and 160 square feet for 2, 3, 4 and 6 kW. Classic is black with the Series I mounting and a two-year warranty; Select adds white and graphite, the single post, the new recess kit, and three years on the heater, seven on the elements.' });

  // 20 · divider
  L.divider({ n: '03', title: 'Nine Spaces, The Right Heat', line: 'What to show first in every outdoor room.', img: 'w-gazebo-bromic',
    notes: 'Module three turns the range into answers: nine spaces customers describe, and the heater to show first in each.' });

  // 21 · nine spaces: a dark-header table and one photograph, as the white paper's portfolio page
  {
    const s = L.content('Nine Spaces, The Right Heat', 'At A Glance', 'Nine Spaces, And What To Show First',
      'This grid matches the Portfolio By Application brochure. Covered patio: Tungsten Select, with Classic for the same warmth at an entry price. Pergola: Select on its single post. Pitched porch: Tungsten Series II on the pitched adaptor. Flush ceiling: Platinum or Tungsten, recessed. Design-led room: Platinum Electric. Over the table: the Eclipse pendant. By the water: Tungsten Coastal or Platinum Marine. Lawn and pool: Eclipse Freestanding or the Tungsten Gas tower. Restaurant and bar: Tungsten Gas or Platinum Gas. Every one leaves with its controls.');
    table(s, M, 1.85, [0.6, 2.7, 4.3], ['', 'Space', 'Show first'], [
      ['01', 'Covered Patio', 'Tungsten Select'], ['02', 'Pergola', 'Tungsten Select · single post'], ['03', 'Pitched Porch', 'Tungsten + pitched adaptor'],
      ['04', 'Flush Ceiling', 'Platinum or Tungsten, recessed'], ['05', 'Design-Led Room', 'Platinum Electric'], ['06', 'Over The Table', 'Eclipse pendant'],
      ['07', 'By The Water', 'Tungsten Coastal · Platinum Marine'], ['08', 'Lawn And Pool', 'Eclipse Freestanding · Tungsten Gas tower'], ['09', 'Restaurant, Bar', 'Tungsten Gas · Platinum Gas'],
    ].map(([n, sp, h]) => [[{ text: n, options: { fontFace: 'Bodoni MT', color: HEX.FLAME, fontSize: 15 } }], [{ text: sp, options: { fontFace: 'Bodoni MT', color: HEX.INK, fontSize: 16 } }], h]), { rh: 0.5, fs: 13.5 });
    pic(s, 'l-013-102', 8.45, 1.85, W - M - 8.45, 4.92, 'cover', 'photo');
    T(s, 'Every one leaves with its controls.', { x: 8.45, y: 6.78, w: 4.3, h: 0.2, fontSize: 9, color: HEX.STEEL });
  }

  // 22 · coverage: three illustrations with big Didot figures under hairlines
  {
    const s = L.content('Nine Spaces, The Right Heat', 'Coverage', 'Show Where The Heat Lands',
      'Show the customer where the warmth falls and the right size sells itself. One Tungsten 6 kW covers up to 160 square feet, one Platinum 4500 W up to 143, one Eclipse up to 121. To size a space: seating area divided by heat area times 0.85 for a partly covered space on cool evenings, rounded up. These are coverage illustrations, not photographs.');
    const CV = [['rv-hb-tungsten-6kw-terrace', '160 ft²', 'Tungsten 6 kW · up to, over a dining table'],
      ['rv-hb-platinum-4500w-lounge', '143 ft²', 'Platinum 4500 W · up to, over a lounge'],
      ['rv-hb-eclipse-pendant-dining', '121 ft²', 'Eclipse · up to, over a round table']];
    const cw = (W - 2 * M - 2 * 0.3) / 3, ch = 2.55;
    CV.forEach(([im, f, d], i) => {
      const x = M + i * (cw + 0.3);
      pic(s, im, x, 1.85, cw, ch, 'cover', 'coverage');
      L.stat(s, f, d, x, 4.6, cw, { size: 40, h: 0.72, lh: 0.4, ls: 13 });
    });
    box(s, M, 6.1, W - 2 * M, 0.66, HEX.WASH, 'size-it');
    T(s, [{ text: 'Size it   ', options: { bold: true, color: HEX.FLAME, fontSize: 11, charSpacing: 3 } }, { text: 'seating area ÷ (heat area × 0.85), rounded up.', options: { fontFace: 'Bodoni MT', fontSize: 18, color: HEX.INK } }], { x: M + 0.3, y: 6.1, w: 11.5, h: 0.66, valign: 'middle' });
  }

  // 23 · exercise: match the heater to the photo
  {
    const s = L.exercise({ section: 'Nine Spaces, The Right Heat', n: 1, minutes: 5, title: 'Match The Heater To The Photo',
      task: 'Name the Bromic heater in each photo, and the control you would sell with it.',
      notes: 'Give five minutes, individually, then go round the room. Answers: 1, Eclipse pendant, on the Affinity Eclipse Controller or the Eclipse Dimmer Controller with remote. 2, Eclipse Freestanding, with the Eclipse Dimmer Controller and remote. 3, Platinum Gas, wall-mounted over a covered courtyard, switched by Affinity On/Off or a wall switch. 4, Platinum Electric recessed flush in the roof, on an Affinity Dimmer. 5, Tungsten Freestanding Gas, at its own knob. 6, Tungsten Coastal in white on a wall by the sea, on an Affinity Dimmer with a wall switch. Debrief: which pairs were confused? Usually Platinum Electric and Platinum Gas: the electric one is a flat glass panel with very little glow; the gas one has a ceramic-glass screen over a glowing burner.' });
    const P = ['l-013-102', 'l-016-131', 'w-1', 'w-mountain-view-retreat-platinum-electric-rece', 'l-018-154', 'l-005-020'];
    const cw = (W - 2 * M - 2 * 0.25) / 3, ch = 1.95;
    P.forEach((im, i) => {
      const x = M + (i % 3) * (cw + 0.25), y = 2.75 + Math.floor(i / 3) * (ch + 0.15);
      pic(s, im, x, y, cw, ch, 'cover', 'match-photo');
      box(s, x, y, 0.55, 0.55, HEX.INK, 'number-tag');
      T(s, String(i + 1), { x, y, w: 0.55, h: 0.55, fontFace: 'Bodoni MT', fontSize: 20, color: HEX.WHITE, align: 'center', valign: 'middle' });
    });
  }

  // 24 · exercise: which one for this customer (four briefs, each under its rule, a space icon to the right)
  {
    const s = L.exercise({ section: 'Nine Spaces, The Right Heat', n: 2, minutes: 10, title: 'Which One For This Customer?',
      task: 'In pairs, choose the heater to show first and its controls. Be ready to say why in one line.',
      notes: 'Ten minutes in pairs, then take one answer per scenario from the room. Model answers. 1, beach house: Tungsten Coastal in white, 4 or 6 kW, on an Affinity Dimmer with a wall switch; Platinum Electric Marine in white if they want it flush and quiet. 2, restaurant with a gas line: Platinum Gas where the heater is seen, or Tungsten Gas on drop poles, switched by zone on Affinity On/Off or a wall switch; check the open-wall rule under the roof. 3, lawn by the pool with no roof: Eclipse Freestanding for heat and light, with its Eclipse Dimmer Controller and remote, on a 220 to 240 V IP54 outdoor outlet; or the Tungsten Freestanding Gas tower where there is no outlet. 4, dining table under a pergola centre beam: an Eclipse pendant from the fan or centre beam on the Affinity Eclipse Controller; Tungsten Select on the perimeter beams if the table is long. Debrief: did every answer include its controls?' });
    const SC = [
      ['coastal', 'The Beach House', 'A covered deck facing the ocean. White ceiling. They want slim heaters that last.'],
      ['restaurant', 'The Restaurant', 'A covered terrace with open sides and a gas line already in. Thirty seats.'],
      ['pool', 'The Pool Lawn', 'Loungers on the lawn by the pool. No roof, no gas. They want light in the evening too.'],
      ['dining', 'The Dinner Table', 'A round table under a pergola centre beam. They host friends most weekends.'],
    ];
    const cw = (W - 2 * M - 3 * 0.35) / 4;
    SC.forEach(([ic, h, d], i) => {
      const x = M + i * (cw + 0.35);
      rule(s, x, 3.0, cw, HEX.INK, 0.75);
      num(s, i + 1, x, 3.12, { size: 30, h: 0.65, w: 1 });
      L.icon(s, ic, x + cw - 0.6, 3.15, 0.6);
      H1(s, h, { x, y: 3.95, w: cw, h: 0.5, fontSize: 21 });
      T(s, d, { x, y: 4.55, w: cw, h: 1.9, fontSize: 15, color: HEX.INK });
    });
  }

  // 25 · exercise: build the package, as three choices in order (owner, 28 Nov 2026:
  // "pick the heater, pick the mounting – recess kit, etc etc, pick the controller")
  const ex3 = L.exercise({ section: 'Nine Spaces, The Right Heat', n: 3, minutes: 15, title: 'Build The Right Package',
    task: 'A 16 × 20 ft covered patio, white flush ceiling, 9 ft high, an 8 in cavity. They want it quiet and on their phone.',
    img: 'w-platinumelectricflushmountedw-lowclearancere',
    notes: 'Fifteen minutes in pairs or threes. Work in order: heater, then mounting, then controller; the next slide shows the options. Model answer. 1, the heater: Platinum Electric 4500 W in white. 16 by 20 is 320 square feet; 320 divided by (143 times 0.85, 121.6) is 2.63, so three heaters. 2, the mounting: recessed flush with the low-clearance kit, which needs a 7.1 in cavity, so 8 inches works. Platinum 4500 W mounts at 8 to 10 ft, so 9 ft is right. 3, the controller: an Affinity 5-channel Dimmer with one heater a channel and the app, plus a wall switch; three dedicated circuits by a licensed electrician. An alternative: three Tungsten Select 6 kW in white (320 divided by 136 is 2.35, so three), recessed in the 7.5 in kit, on the same controller. Debrief: who forgot the wall switch or the circuits? App features need compatible Affinity controls, sold separately; it goes on the quote.' });
  {
    // three choices, in order, on the wash action panel
    const STEPS = [['Pick The Heater', 'Series, output and finish. Size it: seating area ÷ (heat area × 0.85), rounded up.'],
      ['Pick The Mounting', 'Bracket, post, pole, adaptor or recess kit. Check the mounting height and the recess cavity.'],
      ['Pick The Controller', 'Channels, the wall switch and the circuits.']];
    box(ex3, M, 3.35, 6.4, 3.4, HEX.WASH, 'steps-panel');
    STEPS.forEach(([h, d], i) => {
      const y = 3.55 + i * 1.07;
      if (i) rule(ex3, M + 0.3, y - 0.1, 5.8, 'E8BFB2', 0.5);
      num(ex3, i + 1, M + 0.3, y, { size: 28, h: 0.6, w: 0.8 });
      H1(ex3, h, { x: M + 1.2, y: y + 0.02, w: 4.9, h: 0.38, fontSize: 19 });
      T(ex3, d, { x: M + 1.2, y: y + 0.42, w: 4.95, h: 0.5, fontSize: 12.5, color: HEX.INK });
    });
  }

  // 26 · the three choices, with the real options under each
  {
    const s = L.content('Nine Spaces, The Right Heat', 'Exercise 03  ·  The Options', 'Pick The Heater, The Mounting, The Controller',
      'Leave this up while the groups work: one choice from each row, in order. Model answer, heater to mounting to controller. 1, the heater: Platinum Electric 4500 W in white; 320 square feet divided by (143 times 0.85, 121.6) is 2.63, so three. 2, the mounting: the low-clearance recess kit, which needs a 7.1 in cavity, so the 8 in cavity works; 4500 W mounts at 8 to 10 ft, so 9 ft is right. 3, the controller: an Affinity 5-channel Dimmer, one heater a channel, with the app, plus a wall switch and three dedicated circuits by a licensed electrician. The alternative is three Tungsten Select 6 kW in white in the 7.5 in low-clearance kit, on the same controller.');
    const lx = M, ox = 3.55, ow = W - M - ox;
    const rows = [
      ['Pick The Heater', 1.85, [
        [cuts['t2-classic'], 'contain', 'Tungsten Classic', 'Good · black'], [cuts['t2-select-black'], 'contain', 'Tungsten Select', 'Better · three finishes'],
        ['pf-tungsten-coastal', 'cover', 'Tungsten Coastal', 'By the water'], [cuts['w-platinum-black'], 'contain', 'Platinum Electric', 'Best · 2.1 in deep'],
        [cuts['w-eclipse-electric'], 'contain', 'Eclipse', 'Heat and light']]],
      ['Pick The Mounting', 3.55, [
        ['mount-ceiling', null, 'Ceiling Bracket', 'On the beam or ceiling'], ['mount-wall', null, 'Wall Bracket', '14 or 18 in reach'],
        ['mount-pole', null, 'Pole', 'Drop pole; Platinum\'s 8 in pole'], ['mount-pitched', null, 'Pitched-Ceiling Adaptor', '3/12 to 12/12'],
        ['recess-kit', null, 'Low-Clearance Recess Kit', 'Flush: 7.5 in Tungsten, 7.1 in Platinum'], ['single-post', null, 'Single Post', 'Tungsten Select, wiring inside']]],
      ['Pick The Controller', 5.25, [
        ['controller-onoff', null, 'Affinity On/Off', '1, 2 or 5 channels, up to 6 kW each'], ['controller-dimmer', null, 'Affinity Dimmer', 'Dimming, zones and schedules in the app'],
        ['heater-eclipse', null, 'Affinity Eclipse Controller', 'One Eclipse a channel'], ['wall-switch', null, 'Wall Switch', 'The local disconnect']]],
    ];
    rows.forEach(([h, y, opts], r) => {
      rule(s, lx, y, W - 2 * M, HEX.INK, 0.75);
      num(s, r + 1, lx, y + 0.1, { size: 26, h: 0.55, w: 0.8 });
      H1(s, h, { x: lx, y: y + 0.68, w: 2.7, h: 0.8, fontSize: 19 });
      const gap = 0.18, w = (ow - (opts.length - 1) * gap) / opts.length;
      opts.forEach(([im, mode, n, d], i) => {
        const x = ox + i * (w + gap);
        if (mode) pic(s, im, x, y + 0.12, w, 0.78, mode, 'option');
        else L.icon(s, im, x, y + 0.14, 0.62);
        T(s, n, { x, y: y + 0.88, w, h: 0.4, fontSize: 10.5, bold: true, color: HEX.INK, valign: 'bottom' });
        T(s, d, { x, y: y + 1.3, w, h: 0.36, fontSize: 9, color: HEX.STEEL });
      });
    });
  }

  // 27 · closing
  L.closing({ title: 'One Family, The *Right* Heat',
    points: ['Choose by fuel, mount and setting.', 'Show Select first; Classic for budget, Platinum for design.', 'Eclipse is the centre: heat and light over the table.', 'Coastal and Platinum Marine for homes by the water.', 'Every heater leaves with its controls and a wall switch.'],
    next: 'Keep the Portfolio By Application brochure on the counter.', img: 'w-slc-bromic-heater-1-cropped',
    notes: 'Close with the five rules. Ask each person to name the heater they would show first in their own showroom\'s most common space. Point them to the Portfolio By Application brochure and the take-home flyer as the tools to use on the floor.' });

  await L.finish('Bromic-Dealer-Bromic-Portfolio');
}
main().catch((e) => { console.error(e); process.exit(1); });
