// B4 · Dealer track · Tungsten Smart-Heat® Electric Series II
// Facts: data/product-marketing/tungsten-electric-series-ii.json (tiers, upgrades, pillars, accessories, dimensions, slimness,
// launch, m3, claim_checks: "use_instead"/"safest" wording only) and the training brief (pergola guide planning figures).
// Competition is never named on a slide. [[VERIFY]] items stay off the slides and are flagged "to confirm" in the notes.
// Tilt (owner, 28 Nov 2026): every Series II model, 2 to 6 kW, tilts up to 45°.
// Look: the white paper's Series II pages (reports/white-papers/pergola-2027-umph): the hero render with callouts, "Lighter On The
// Beam", the recess section, colour matched to the frame, and the accessories on white.
const L = require('./lib');
const { T, H1, pic, rule, num, HEX, W, M } = L;
const fs = require('fs'), path = require('path'), sharp = require('sharp');

// Cut-outs on white, trimmed to the product (returns an absolute path for L.pic).
const CUT = path.join(__dirname, 'cache', 'cut'); fs.mkdirSync(CUT, { recursive: true });
const cuts = {};
async function cutout(id) {
  const f = path.join(__dirname, '../../images/library', id + '.webp'), out = path.join(CUT, `${id}-1.png`);
  if (!fs.existsSync(out)) await sharp(await sharp(f).flatten({ background: '#ffffff' }).png().toBuffer()).trim({ background: '#ffffff', threshold: 18 })
    .extend({ top: 24, bottom: 24, left: 24, right: 24, background: '#ffffff' }).png().toFile(out);
  return (cuts[id] = out);
}

async function main() {
  L.start({ title: 'Tungsten Series II', footer: 'Bromic Training Hub  ·  Dealer track  ·  Tungsten Smart-Heat® Electric Series II' });
  await L.prepIcons();
  for (const id of ['t2-classic', 't2-select-black', 't2-single-post-black', 't2-low-clearance-recess', 'w-platinum-black']) await cutout(id);
  const P = () => L.pres;
  const box = (s, x, y, w, h, color, name = 'panel', line) => s.addShape(P().shapes.RECTANGLE, { x, y, w, h, fill: { color }, line: { color: line || color, width: line ? 0.75 : 0 }, objectName: name });
  const label = (s, t, x, y, w, o = {}) => T(s, t.toUpperCase(), { x, y, w, h: 0.3, fontSize: 9.5, bold: true, color: HEX.FLAME, charSpacing: 3, ...o });
  function table(s, x, y, cols, head, rows, o = {}) {
    const hh = o.hh || 0.42, rh = o.rh || 0.5, tw = cols.reduce((a, b) => a + b, 0), fsz = o.fs || 13;
    box(s, x, y, tw, hh, HEX.INK, 'table-head');
    if (o.wash != null) { const wx = x + cols.slice(0, o.wash).reduce((a, b) => a + b, 0); box(s, wx, y + hh, cols[o.wash], rh * rows.length, HEX.WASH, 'table-wash'); }
    let cx = x; head.forEach((h, j) => { T(s, h.toUpperCase(), { x: cx + 0.14, y, w: cols[j] - 0.22, h: hh, fontSize: 9, bold: true, charSpacing: 2, color: HEX.WHITE, valign: 'middle' }); cx += cols[j]; });
    rows.forEach((r, i) => {
      const ry = y + hh + i * rh; cx = x;
      r.forEach((c, j) => {
        const lead = j === 0 && o.lead, strong = o.wash === j && o.strong;
        T(s, c, { x: cx + 0.14, y: ry, w: cols[j] - 0.22, h: rh, valign: 'middle', fontSize: lead ? fsz + 3 : fsz, fontFace: lead ? 'Bodoni MT' : 'Arial', color: lead || strong ? HEX.INK : HEX.BODY, bold: strong });
        cx += cols[j];
      });
      rule(s, x, ry + rh, tw, 'C9C9C6', 0.5);
    });
  }
  // a numbered list under hairlines: Didot numeral, Didot heading, a line
  function steps(s, list, x, y, w, step, o = {}) {
    list.forEach(([h, b], i) => {
      const sy = y + i * step; rule(s, x, sy, w, HEX.INK, 0.5);
      num(s, i + 1, x, sy + 0.12, { size: o.ns || 20, h: 0.45, w: 0.7 });
      H1(s, h, { x: x + 0.75, y: sy + 0.12, w: w - 0.75, h: 0.42, fontSize: o.hs || 21 });
      if (b) T(s, b, { x: x + 0.75, y: sy + 0.58, w: w - 0.75, h: step - 0.65, fontSize: o.bs || 15 });
    });
  }
  // a white callout with a flame bar, laid over a render (the white paper's "Made For The Pergola")
  function callout(s, h, d, x, y, w = 2.75) {
    box(s, x, y, w, 0.9, 'F5F5F4', 'callout'); box(s, x, y, 0.05, 0.9, HEX.FLAME, 'callout-bar');
    H1(s, h, { x: x + 0.2, y: y + 0.08, w: w - 0.3, h: 0.34, fontSize: 15 });
    T(s, d, { x: x + 0.2, y: y + 0.43, w: w - 0.3, h: 0.42, fontSize: 10.5 });
  }

  // 1 · Cover
  L.cover({ kicker: 'Dealer Track  ·  Module B4', title: 'Tungsten Smart-Heat® Electric *Series II*', img: 'l-006-028',
    sub: 'The new Tungsten family: what changed, how it mounts, and how to sell it.', meta: 'Bromic Training Hub  ·  About 60 minutes',
    notes: 'Welcome. Tungsten Series II is the biggest change to our best-selling electric heater in years. By the end of this module you will place each tier with the right customer, explain what changed from Series I, spec a pergola package with its accessories and controls, and pitch it in a minute. There are three exercises and two quick checks.' });

  // 2 · Divider 01
  L.divider({ n: '01', title: 'The New Family', line: 'Classic, Select and Coastal – with Platinum above them.', img: 'l-004-012', section: 'The New Family',
    notes: 'Section one: the line-up and where each heater sits.' });

  // 3 · Good, better, by the sea, best: the white paper's "Same Warmth At Every Price Point"
  { const s = L.content('The New Family', 'Good, Better, Best', 'One Family, A Heater For Every Customer',
    'Walk left to right. Classic is the good choice: style and value, in black, 2 to 6 kW, with a two-year warranty. Select is the better choice: black, white or graphite, three fronts, the single post, the low-clearance recess kit and IPX5, with 3 years on the heater and 7 on the elements. Coastal is Select built for life by the water, in 4 and 6 kW, black or white. Platinum Smart-Heat Electric sits above as the best: the flush, glass-ceramic heater for the most considered spaces. Graphite is on the 4 and 6 kW Select. Prices are not part of trade training slides – use the current price list.');
    const tiers = [
      ['Good', 'Tungsten Classic', 'rv-pr-classic-black-hero', 'cover', ['2, 3, 4 and 6 kW', 'Black, wireframe front', '2-year warranty']],
      ['Better', 'Tungsten Select', 'rv-pr-select-black-hero', 'cover', ['2, 3, 4 and 6 kW', 'Black, white, graphite', '3 yr heater, 7 yr elements']],
      ['By The Sea', 'Tungsten Coastal', 'l-005-025', 'cover', ['4 and 6 kW', 'Black and white', 'Marine-grade build']],
      ['Best', 'Platinum Electric', cuts['w-platinum-black'], 'contain', ['2300, 3400, 4500 W', 'Glass-ceramic face', '3-year warranty']]];
    const cw = (W - 2 * M - 3 * 0.35) / 4;
    tiers.forEach(([tier, name, img, mode, pts], i) => { const x = M + i * (cw + 0.35), best = i === 3;
      rule(s, x, 1.9, cw, best ? HEX.FLAME : HEX.INK, best ? 2.25 : 1);
      label(s, tier, x, 2.02, cw, { color: best ? HEX.FLAME : HEX.STEEL });
      H1(s, name, { x, y: 2.32, w: cw, h: 0.48, fontSize: 21 });
      if (mode === 'contain') pic(s, img, x + 0.2, 3.05, cw - 0.4, 1.6, mode, 'tier-' + i); else pic(s, img, x, 2.95, cw, 1.8, mode, 'tier-' + i);
      pts.forEach((p, j) => { const y = 4.95 + j * 0.55; rule(s, x, y, cw, 'C9C9C6', 0.5); T(s, p, { x, y: y + 0.1, w: cw, h: 0.4, fontSize: 15, color: HEX.INK }); }); }); }

  // 4 · Classic and Select: same heat, shown as four big figures
  { const s = L.content('The New Family', 'Classic And Select', 'The Same Warmth – The Customer Chooses The Look',
    'This is the line that stops a customer trading down for the wrong reason. Classic and Select give exactly the same heat coverage: 65, 100, 130 and 160 square feet for 2, 3, 4 and 6 kW. What the customer pays for with Select is the look and the install: three finishes, three fronts, the single post, the low-clearance recess kit, IPX5 and the longer warranty. Classic launches in January 2027.');
    label(s, 'Classic  ·  Good', M, 1.9, 5.6, { color: HEX.STEEL }); pic(s, cuts['t2-classic'], M, 2.25, 5.8, 1.0, 'contain', 'classic-front');
    label(s, 'Select  ·  Better', M, 3.6, 5.6, { color: HEX.STEEL }); pic(s, cuts['t2-select-black'], M, 3.95, 5.8, 1.0, 'contain', 'select-front');
    rule(s, M, 5.4, 5.8, 'C9C9C6', 0.5);
    H1(s, 'Select adds the look and the install: finishes, fronts, the single post, the recess kit, IPX5 and the longer warranty.', { x: M, y: 5.55, w: 5.8, h: 1.2, fontSize: 17 });
    label(s, 'Heat coverage, both tiers', 7.1, 1.9, 5.6);
    [['65 ft²', '2 kW'], ['100 ft²', '3 kW'], ['130 ft²', '4 kW'], ['160 ft²', '6 kW']].forEach(([f, kw], i) =>
      L.stat(s, f, kw + '  ·  Classic and Select', 7.1 + (i % 2) * 2.95, 2.35 + Math.floor(i / 2) * 2.25, 2.68, { size: 54, h: 1.0, lh: 0.4, ls: 14 })); }

  // 5 · Finishes: colour that matches the frame (the white paper's "Every Frame, A Perfect Match")
  { const s = L.content('The New Family', 'Finishes', 'All Black, All White, All Graphite',
    'On Select, each finish covers the whole heater, front included, so it reads as one piece against a timber or plaster ceiling. Black, white and graphite; graphite is on the 4 and 6 kW models. Coastal comes in black and white; Classic in black. Ask the customer about the ceiling and the frame colour first – the finish follows.');
    const F = [['Black', HEX.INK, HEX.WHITE, 'rv-pr-select-3kw-black-hero', 'Select in black'], ['White', 'F1F0EE', HEX.INK, 'rv-pr-select-3kw-white-hero', 'Select in white'],
      ['Graphite', '5A5C5E', HEX.WHITE, 'rv-pr-select-3kw-graphite-hero', 'Select in graphite, 4 and 6 kW']];
    const cw = 2.62;
    F.forEach(([n, c, tc, img, cap], i) => { const x = M + i * (cw + 0.2);
      box(s, x, 1.85, cw, 0.42, c, 'frame-' + n, c === 'F1F0EE' ? 'C9C9C6' : null);
      T(s, (n + ' frame').toUpperCase(), { x: x + 0.15, y: 1.85, w: cw - 0.3, h: 0.42, fontSize: 9, bold: true, charSpacing: 2, color: tc, valign: 'middle' });
      pic(s, img, x, 2.27, cw, 3.1, 'cover', 'finish-' + n);
      T(s, cap, { x, y: 5.45, w: cw, h: 0.3, fontSize: 11, bold: true, color: HEX.INK }); });
    table(s, 9.15, 1.85, [1.38, 1.2, 1.0], ['Finish', 'Select', 'Coastal'], [['Black', 'Yes', 'Yes'], ['White', 'Yes', 'Yes'], ['Graphite', '4 and 6 kW', '–']], { hh: 0.42, rh: 0.55, fs: 13, lead: true });
    T(s, 'Classic comes in black.', { x: 9.15, y: 4.0, w: 3.58, h: 0.3, fontSize: 12, color: HEX.STEEL });
    rule(s, 9.15, 4.55, 3.58, HEX.FLAME, 1.5);
    H1(s, 'Ask about the ceiling and the frame colour first – the finish follows.', { x: 9.15, y: 4.7, w: 3.58, h: 1.4, fontSize: 18 });
    T(s, 'The whole heater in one finish, front included.', { x: 9.15, y: 6.15, w: 3.58, h: 0.5, fontSize: 12, color: HEX.STEEL }); }

  // 6 · Fronts
  { const s = L.content('The New Family', 'Fronts', 'Three Fronts To Suit The Room',
    'Select comes with the Diamond Pattern front as standard; the traditional oval and the triangle are sold separately. Coastal has the Diamond Pattern. Classic has its own stylised wireframe front. Whether every front fits a recessed install is still to confirm with the Product team, so check before you promise it on a recess job.');
    steps(s, [['Diamond Pattern', 'Standard on Select and Coastal'], ['Traditional Oval', 'Select, sold separately'], ['Triangle', 'Select, sold separately']], M, 1.95, 5.2, 1.45);
    pic(s, 'dk-Tungsten-Series-II-Select-graphite-grille-macro', 6.3, 1.85, W - M - 6.3, 2.3, 'cover', 'grille-macro');
    T(s, 'The Diamond Pattern front.', { x: 6.3, y: 4.19, w: 6, h: 0.22, fontSize: 9, color: HEX.STEEL });
    pic(s, 'rv-pr-select-graphite-oval-front-hero', 6.3, 4.5, W - M - 6.3, 2.25, 'cover', 'oval-front');
    T(s, 'The traditional oval front.', { x: 6.3, y: 6.78, w: 6, h: 0.2, fontSize: 9, color: HEX.STEEL }); }

  // 7 · Divider 02
  L.divider({ n: '02', title: 'What Changed From Series I', line: 'Slimmer, lighter, cleaner to mount – and tougher in the weather.', img: 'l-003-009', section: 'What Changed',
    notes: 'Section two: what is new against Tungsten Series I, which customers already know.' });

  // 8 · What changed: "Lighter On The Beam" – a drawing to one scale and a dark-header table
  { const s = L.content('What Changed', 'Series I To Series II', 'Six Changes Your Customer Will Notice',
    'Narrower: 183 mm wide against 214 mm, about 14% (launch deck). Lighter: 13 to 15 lb against 19.8 to 22 lb, about a third (manuals). A single post replaces the two suspension tubes of Series I, with no visible junction box; Classic keeps the Series I mounting. IPX5 on Select and Coastal, against IPX4. Full-body finishes and new fronts. And the low-clearance recess kit. Do not make a depth claim: the deck and the manuals disagree, so it stays off customer copy until the Product team measures both the same way.');
    const k = 2.35 / 214; // inches a millimetre, both drawn to one scale
    const prof = (cx, mm, two, body, title, sub, fig) => {
      const bw = mm * k, top = 2.15;
      box(s, cx - 0.55, top, 1.1, 0.5, HEX.WHITE, 'beam', HEX.INK);
      T(s, '6 in beam', { x: cx - 0.8, y: top - 0.3, w: 1.6, h: 0.25, fontSize: 9, color: HEX.STEEL, align: 'center' });
      if (two) { box(s, cx - 0.42, top + 0.5, 0.11, 0.75, '8A8580', 'tube'); box(s, cx + 0.31, top + 0.5, 0.11, 0.75, '8A8580', 'tube'); }
      else box(s, cx - 0.17, top + 0.5, 0.34, 0.75, HEX.INK, 'post');
      box(s, cx - bw / 2, top + 1.25, bw, 0.62, body, 'body');
      box(s, cx - bw / 2 + 0.12, top + 1.8, bw - 0.24, 0.05, HEX.FLAME, 'element');
      const dy = top + 2.05;
      s.addShape(P().shapes.LINE, { x: cx - bw / 2, y: dy, w: bw, h: 0, line: { color: HEX.FLAME, width: 1 }, objectName: 'dim' });
      [cx - bw / 2, cx + bw / 2].forEach((tx) => s.addShape(P().shapes.LINE, { x: tx, y: dy - 0.07, w: 0, h: 0.14, line: { color: HEX.FLAME, width: 1 }, objectName: 'dim-tick' }));
      T(s, fig, { x: cx - 1.3, y: dy + 0.05, w: 2.6, h: 0.28, fontSize: 11, bold: true, color: HEX.FLAME, align: 'center' });
      H1(s, title, { x: cx - 1.3, y: dy + 0.38, w: 2.6, h: 0.45, fontSize: 22, color: two ? HEX.STEEL : HEX.INK, align: 'center' });
      T(s, sub, { x: cx - 1.4, y: dy + 0.85, w: 2.8, h: 0.3, fontSize: 11, color: HEX.STEEL, align: 'center' });
    };
    prof(2.0, 214, true, '6E6A6B', 'Series I', 'two suspension tubes', '8.4 in (214 mm)');
    prof(4.95, 183, false, HEX.INK, 'Series II', 'one single post, wiring inside', '7.2 in (183 mm)');
    T(s, 'Drawn to one scale. Width from the Series II launch deck; depth is not compared until both are measured the same way.', { x: M, y: 6.0, w: 5.9, h: 0.5, fontSize: 9.5, color: HEX.STEEL, align: 'center' });
    table(s, 7.0, 1.85, [1.45, 1.95, 2.33], ['', 'Series I', 'Series II'], [
      ['Width', '214 mm', '183 mm: about 14% narrower'],
      ['Weight', '19.8–22 lb', '13–15 lb: about a third lighter'],
      ['Mount', 'Two suspension tubes', 'Single post, no visible junction box'],
      ['Weather', 'IPX4', 'IPX5 on Select and Coastal'],
      ['Finish', 'Stainless front', 'Full-body finishes, new fronts'],
      ['Recess', 'Existing recess kit', 'Low-clearance recess kit'],
    ], { rh: 0.78, fs: 13, lead: true, wash: 2, strong: true }); }

  // 9 · Exercise 1: spot the difference
  { const s = L.exercise({ section: 'What Changed', n: 1, minutes: 8, title: 'Series I Or Series II?',
      task: 'In pairs: which heaters are Series I and which are Series II? Name the clue you used for each.',
      notes: 'How to run it: two minutes in pairs, then go round the room, one picture each. Answers: A is Series I – the front guard is stainless over a white or black body. B is Series II Select – the Diamond Pattern front is in the same black as the body. C is Series I – stainless fronts on angled brackets along a pergola beam. D is Series II Select – Diamond Pattern, black all over. Debrief: the quickest tell is the front. On Series II Select the front is the body colour; on Series I it is stainless. Then the profile – slimmer – and on the ceiling, the single post with no visible junction box. This is exactly what you show a customer who asks why Series II costs more.' });
    const tiles = [['w-tungelec-stacked', 'contain'], ['rv-pr-select-black-hero', 'cover'], ['w-vbb7428', 'cover'], ['l-007-034', 'cover']];
    const cw = (W - 2 * M - 3 * 0.3) / 4;
    tiles.forEach(([img, mode], i) => { const x = M + i * (cw + 0.3);
      pic(s, img, x, 2.85, cw, 3.0, mode, 'spot-' + i);
      rule(s, x, 6.0, cw, HEX.INK, 0.5);
      T(s, String.fromCharCode(65 + i), { x, y: 6.05, w: 1, h: 0.65, fontSize: 32, color: HEX.FLAME, fontFace: 'Bodoni MT' });
      T(s, 'Series I or II? The clue:', { x: x + 0.7, y: 6.22, w: cw - 0.7, h: 0.3, fontSize: 11, color: HEX.STEEL }); }); }

  // 10 · Divider 03
  L.divider({ n: '03', title: 'Mounting And Coverage', line: 'Ceiling, pitched ceiling, wall, post or recessed – one heater for every setting.', img: 'l-001-000', section: 'Mounting And Accessories',
    notes: 'Section three: how Series II mounts, the four new accessories, and how much space each model heats.' });

  // 11 · Single post: the cut-out with callouts, the installed heater bleeding off the page
  { const s = L.content('Mounting And Accessories', 'Single Post', 'A Heater That Seems To Float',
    'On its single post the heater appears to float, with no visible junction box. The post replaces the two suspension tubes of Series I: fewer parts to fit and a cleaner ceiling. The framework gives a 5 in post for the 2 and 3 kW and a 9 in post for the 4 and 6 kW, straight or angled. Classic keeps the proven Series I mounting.');
    pic(s, cuts['t2-single-post-black'], 3.75, 2.0, 3.35, 4.7, 'contain', 'single-post-cutout');
    callout(s, 'One Post, One Fixing', 'Replaces the two suspension tubes of Series I.', M, 2.1, 2.95);
    callout(s, 'No Visible Junction Box', 'A clean line from ceiling to heater.', M, 3.65, 2.95);
    callout(s, 'Two Post Lengths', '5 in for 2 and 3 kW; 9 in for 4 and 6 kW.', M, 5.2, 2.95);
    T(s, 'Tungsten Select on its single post.', { x: 3.75, y: 6.55, w: 3.35, h: 0.25, fontSize: 9, color: HEX.STEEL, align: 'center' });
    pic(s, 'rv-pr-d-social-black-ceiling-post-graphite-4x5', 7.45, 0, W - 7.45, 6.85, 'cover', 'single-post'); }

  // 12 · Brackets and the pitched ceiling: the accessories, as the white paper's "Nothing On Show"
  { const s = L.content('Mounting And Accessories', 'New Accessories', 'Walls, Angles And Pitched Ceilings',
    'Three new pieces of hardware. The wall-mounting bracket holds the heater out from the wall: 14 in of reach with a 5 in drop, or 18 in of reach. The new mounting bracket has set positions for 15, 30 and 45 degrees, so the heater aims at the seats and can be re-angled later. Every Series II model, 2 to 6 kW, tilts up to 45 degrees (owner decision, 28 November 2026). The pitched-ceiling adaptor takes ceilings from 3/12 to 12/12; 6/12 is the most common residential pitch.');
    const cw = (W - 2 * M - 2 * 0.35) / 3;
    const cols = [['rv-pr-d-social-graphite-wall-bracket-black-4x5', 'mount-wall', 'Wall Bracket', '14 in or 18 in reach'],
      ['rv-pr-select-graphite-angled-bracket', 'mount-ceiling', 'Angled Bracket', 'Set at 15°, 30° or 45° – every model, 2 to 6 kW'],
      [null, 'mount-pitched', 'Pitched-Ceiling Adaptor', '3/12 to 12/12 pitch; 6/12 is the most common']];
    cols.forEach(([img, ic, t, b], i) => { const x = M + i * (cw + 0.35);
      if (img) pic(s, img, x, 1.85, cw, 3.4, 'cover', 'acc-' + i);
      else {
        // the pitched-ceiling adaptor, drawn: a 6/12 roof, the wedge adaptor on it, the post and the heater hanging level
        box(s, x, 1.85, cw, 3.4, 'F5F5F4', 'pitch-ground');
        const x0 = x + 0.3, x1 = x + cw - 0.3, y0 = 3.55, slope = 0.5, ry = (px) => y0 - (px - x0) * slope;
        s.addShape(P().shapes.LINE, { x: x0, y: ry(x1), w: x1 - x0, h: y0 - ry(x1), flipV: true, line: { color: HEX.INK, width: 2.5 }, objectName: 'roof' });
        const xm = x + cw / 2 + 0.1, a = 0.7;
        s.addShape(P().shapes.RIGHT_TRIANGLE, { x: xm - a / 2, y: ry(xm + a / 2), w: a, h: a * slope, flipH: true, fill: { color: HEX.INK }, line: { color: HEX.INK, width: 0 }, objectName: 'adaptor' });
        const by = ry(xm - a / 2);
        box(s, xm - 0.07, by, 0.14, 0.55, HEX.INK, 'post');
        box(s, xm - 1.05, by + 0.55, 2.1, 0.24, HEX.INK, 'heater');
        box(s, xm - 0.95, by + 0.72, 1.9, 0.04, HEX.FLAME, 'element');
        T(s, 'adaptor', { x: xm + 0.45, y: by - 0.15, w: 1.0, h: 0.25, fontSize: 10, color: HEX.STEEL });
        T(s, '6/12 pitch', { x: x0, y: y0 + 0.05, w: 1.4, h: 0.25, fontSize: 10, color: HEX.STEEL });
        H1(s, '3/12 – 12/12', { x, y: 4.55, w: cw, h: 0.5, fontSize: 24, color: HEX.FLAME, align: 'center' });
      }
      L.icon(s, ic, x, 5.42, 0.5);
      label(s, t, x + 0.65, 5.45, cw - 0.65);
      T(s, b, { x: x + 0.65, y: 5.78, w: cw - 0.65, h: 0.75, fontSize: 15, color: HEX.INK }); }); }

  // 13 · Low-clearance recess: the kit on white, the cavity as a big figure, the installed heater
  { const s = L.content('Mounting And Accessories', 'Low-Clearance Recess Kit', 'The Only 6 kW Recessed Heater With A Dual Fan-Ventilated Kit',
    'Use this exact wording (owner, 28 Nov 2026): the only 6 kW recessed outdoor heater with a dual fan-ventilated, low-clearance recess kit. It recesses 2, 3, 4 and 6 kW into a 7.5 inch ceiling cavity; the kit is dual fan-ventilated, so there is no site-built box. The recess box comes with the kit. One kit serves Select and Coastal; Coastal gets a marine-grade version in powder-coated 316 stainless, rated IPX5. The integrated fans need a dedicated, unswitched supply so they stay powered. Do not say "shallowest" or "lowest clearance": other brands recess into about 7.25 in framed, fire-rated pockets. The number of fans and any fire-rated lining requirement are still to confirm with the Product team.');
    pic(s, cuts['t2-low-clearance-recess'], M, 2.2, 5.9, 2.05, 'contain', 'recess-kit');
    L.stat(s, '7.5 in', 'ceiling cavity for 2, 3, 4 and 6 kW', M, 4.45, 2.3, { size: 54, h: 1.0, lh: 0.8, ls: 13 });
    [['Dual fan-ventilated'], ['Recess box supplied – nothing to build on site'], ['Marine-grade kit for Coastal']].forEach(([t], i) => {
      const y = 4.45 + i * 0.78; rule(s, 3.25, y, 3.25, HEX.INK, 0.5);
      num(s, i + 1, 3.25, y + 0.1, { size: 16, h: 0.4, w: 0.5 });
      T(s, t, { x: 3.8, y: y + 0.12, w: 2.7, h: 0.6, fontSize: 14, color: HEX.INK }); });
    pic(s, 'rv-pr-d-recess-black-timber-logo-f1-4', 6.85, 2.2, W - 6.85, 4.65, 'cover', 'recessed-timber'); }

  // 14 · Coverage and heights: a dark-header table, the sizing rule in a wash box, the coverage picture
  { const s = L.content('Mounting And Accessories', 'Coverage And Heights', 'How Much Space Each Model Heats',
    'Coverage is the same on Classic and Select. Recommended mounting heights, heater to floor: 2 and 3 kW at 8 to 9 ft, 4 kW at 8 to 10 ft, 6 kW at 8 to 12 ft. To size a partly covered space on cool evenings, divide the seating area by the coverage times 0.85 and round up. The picture shows a 6 kW heating about 160 square feet of terrace. Series II minimum heights are still to confirm with the Product team – use the installation manual on site.');
    table(s, M, 1.85, [1.6, 2.35, 2.35], ['Output', 'Heats up to', 'Mount at'], [['2 kW', '65 ft²', '8–9 ft'], ['3 kW', '100 ft²', '8–9 ft'], ['4 kW', '130 ft²', '8–10 ft'], ['6 kW', '160 ft²', '8–12 ft']],
      { rh: 0.62, fs: 17, lead: true });
    box(s, M, 5.35, 6.3, 1.4, HEX.WASH, 'formula');
    label(s, 'Size it', M + 0.3, 5.5, 3);
    H1(s, 'Heaters  =  area ÷ (coverage × 0.85)', { x: M + 0.3, y: 5.82, w: 5.8, h: 0.45, fontSize: 21 });
    T(s, 'Partly covered, cool evenings. Round up.', { x: M + 0.3, y: 6.3, w: 5.8, h: 0.3, fontSize: 13, color: HEX.BODY });
    pic(s, 'rv-hb-tungsten-6kw-terrace', 7.25, 1.85, W - M - 7.25, 4.9, 'cover', 'coverage-6kw');
    T(s, 'A 6 kW heating about 160 ft² of terrace. Coverage illustration.', { x: 7.25, y: 6.78, w: 5.4, h: 0.2, fontSize: 9, color: HEX.STEEL }); }

  // 15 · Check 1
  L.quiz({ section: 'Mounting And Accessories', n: 1, q: 'A Customer Asks If Select Heats More Than Classic. What Do You Say?',
    options: ['Yes – Select covers about a third more', 'No – the same coverage; Select adds the look, the mounts and the warranty', 'Only the 6 kW Select heats more', 'Only Coastal heats more'], answer: 1,
    why: 'Classic and Select give the same heat coverage: 65, 100, 130 and 160 ft² for 2, 3, 4 and 6 kW. Select adds three finishes, three fronts, the single post, the low-clearance recess kit, IPX5 and 3 years on the heater with 7 on the elements.' });

  // 16 · Statement: Coastal
  L.statement({ section: 'Coastal', kicker: 'Tungsten Coastal', line: 'Built For Life By The *Water*.', img: 'l-005-024',
    notes: 'Coastal is the answer for any home or venue on the coast: salt air, spray and sun. It is for coastal homes and venues, not for boats.' });

  // 17 · Coastal: the photograph bleeding off the left edge, four ruled facts in a 2 × 2
  { const s = L.content('Coastal', 'Tungsten Coastal', 'Corrosion Protection, Twice Over',
    'Coastal protects against corrosion twice over: a marine-grade build with a high-temperature, corrosion-resistant coating, and a recess kit in powder-coated 316 stainless steel rated IPX5. It comes in 4 and 6 kW, at 208 and 240 V, in black or white, with the Diamond Pattern front. It is never for installation on boats. The heater body material and the coating name are still to confirm with the Product team, so say "marine-grade build" rather than naming the steel.');
    pic(s, 'l-005-022', 0, 1.85, 6.4, 5.0, 'cover', 'coastal-recessed');
    const pts = [['Corrosion-Resistant Coating', 'Over a marine-grade build.'], ['Marine-Grade Recess Kit', 'Powder-coated 316 stainless, IPX5.'], ['4 And 6 kW', 'Black or white, Diamond Pattern front.'], ['Not For Boats', 'For coastal homes and venues.']];
    const cw = 2.85;
    pts.forEach(([t, b], i) => { const x = 6.95 + (i % 2) * (cw + 0.3), y = 1.95 + Math.floor(i / 2) * 2.35;
      rule(s, x, y, cw, HEX.INK, 0.75); num(s, i + 1, x, y + 0.12, { size: 26, h: 0.55, w: 0.8 });
      if (i === 0) L.icon(s, 'coastal', x + cw - 0.55, y + 0.15, 0.55);
      H1(s, t, { x, y: y + 0.75, w: cw, h: 0.75, fontSize: 19 }); T(s, b, { x, y: y + 1.5, w: cw, h: 0.6, fontSize: 15 }); }); }

  // 18 · Divider 04
  L.divider({ n: '04', title: 'Selling Series II', line: 'How it wins, when it lands, and how to put it on every pergola.', img: 'l-008-059', section: 'Selling Series II',
    notes: 'Section four: the competition, the launch timing, and two exercises to practise the sale.' });

  // 19 · Against the competition: the white paper's comparison table
  { const s = L.content('Selling Series II', 'Against The Competition', 'Where Series II Wins',
    'Use these in conversation, not in print, until Specification and compliance signs them off, and never name the competitor. Recess: their flush frame needs a framed pocket lined on all five sides with Type X drywall, on flat ceilings only, with a 15-minute cool-down recommended after 4 hours of continuous use; ours is a dual fan-ventilated kit in a 7.5 in cavity, recess box supplied. Pitched ceilings: their flush frame cannot be pitched; we have the adaptor. Finish: their reflector face and wire guard stay stainless in every colour; ours is one finish end to end. Weather: IPX5 against IPX4. On heat, call it parity – each maker measures coverage its own way – so compete on controls and installation.');
    table(s, M, 1.85, [2.5, 4.9, 4.73], ['', 'Tungsten Series II', 'The competition'], [
      ['Recessing', 'Dual fan-ventilated kit, 7.5 in cavity, box supplied', 'Framed pocket lined on five sides; flat ceilings only'],
      ['Pitched ceilings', 'Adaptor from 3/12 to 12/12', 'Flush frame on flat ceilings only'],
      ['Finish', 'The whole heater in one finish', 'Stainless face and guard in every colour'],
      ['Weather', 'IPX5', 'IPX4'],
      ['Controls', 'Affinity and the Bromic app, from one maker', 'App control through a third-party bridge']], { rh: 0.78, fs: 15, lead: true, wash: 1, strong: true });
    T(s, 'Heat output is parity – compete on controls and installation.', { x: M, y: 6.45, w: 9, h: 0.3, fontSize: 12, color: HEX.STEEL, italic: true }); }

  // 20 · Launch timing: a hairline timeline, three Didot dates, the action in a wash box
  { const s = L.content('Selling Series II', 'Launch Timing', 'From Series I To Series II',
    'Series II stock reached the distribution centre in mid-September 2026. In October 2026 Select and Coastal launched, Series I moved to entry level, and Cobalt was discontinued once sold through. In January 2027 Classic launches and Series I is discontinued after sell-through – that completes the launch. Practical advice: sell your Series I stock now as the entry choice, and lead every new conversation with Select.');
    const ph = [['Mid-Sep 2026', 'Stock Ready', 'Series II in the distribution centre, ready to ship'], ['Oct 2026', 'Select And Coastal', 'Launched. Series I moves to entry level; Cobalt sells through'], ['Jan 2027', 'Classic', 'Launches as Series I sells through – the family is complete']];
    const cw = (W - 2 * M - 2 * 0.4) / 3;
    rule(s, M, 2.75, W - 2 * M, 'C9C9C6', 1);
    ph.forEach(([when, t, b], i) => { const x = M + i * (cw + 0.4), hot = i === 1;
      H1(s, when, { x, y: 1.9, w: cw, h: 0.7, fontSize: 30, color: hot ? HEX.FLAME : HEX.INK });
      box(s, x, 2.68, 0.16, 0.16, hot ? HEX.FLAME : HEX.INK, 'milestone');
      if (hot) rule(s, x, 2.75, cw, HEX.FLAME, 2);
      H1(s, t, { x, y: 3.05, w: cw, h: 0.5, fontSize: 22 });
      T(s, b, { x, y: 3.6, w: cw, h: 1.1, fontSize: 16 }); });
    box(s, M, 4.75, W - 2 * M, 1.95, HEX.WASH, 'action');
    label(s, 'On the floor', M + 0.4, 5.0, 4);
    H1(s, 'Sell your Series I stock now as the entry choice, and lead every new conversation with Select.', { x: M + 0.4, y: 5.4, w: 10.5, h: 1.1, fontSize: 26 }); }

  // 21 · Exercise 2: spec a pergola
  L.exercise({ section: 'Selling Series II', n: 2, minutes: 15, title: 'Spec A Pergola Package',
    task: 'A homeowner has a 14 × 20 ft louvered pergola over a dining and lounge area. Spec the full package.',
    steps: ['Work out the area and how many heaters you need', 'Choose the tier, output and finish', 'Choose the mounts and accessories', 'Add the controls and the wall switch', 'Note the mounting height and the wiring'],
    img: 'w-240619-yorba-linda-ca-dc-64',
    notes: 'How to run it: groups of three, ten minutes to build the package, five to compare. Suggested answer: 14 × 20 ft is 280 ft². 280 ÷ (160 × 0.85) = 2.06, so three Tungsten Select 6 kW heaters (three 4 kW also work: 280 ÷ (130 × 0.85) = 2.5, rounded up to three). Finish to match the pergola frame – black, white or graphite. Mount on the perimeter beams, never on a louvre, on the single post or the angled bracket aimed in at the seats at 15 to 45 degrees (every model, 2 to 6 kW, tilts up to 45), 8 to 12 ft above the floor for 6 kW; a wall bracket where the clear height is below 8 ft. Controls: three heaters at 6 kW fill three channels, so one Affinity 5-channel Dimmer with two spare, plus a manual wall switch. Each heater on a dedicated circuit, hard-wired by a licensed electrician; pre-wire through the posts and beams. Wi-Fi and app features need compatible Affinity controls, sold separately. Debrief: who forgot the controls?' });

  // 22 · Exercise 3: 60-second pitch
  L.exercise({ section: 'Selling Series II', n: 3, minutes: 10, title: 'Pitch Series II In 60 Seconds',
    task: 'In pairs, pitch Tungsten Select to a homeowner in one minute. Your partner times you and listens for each point.',
    steps: ['Open with their evening: the table, the view, one more hour outside', 'Show the look: one finish end to end, three fronts', 'Show the install: single post, pitched ceilings, recessing', 'Close on controls: the Affinity Dimmer and the app', 'Ask for the next step: a design plan or a quote'],
    img: 'dk-Tungsten-Series-II-Select-family-three-finishes', imgMode: 'cover',
    notes: 'How to run it: one minute each, partner times and ticks the five points, then swap. Ask two volunteers to pitch to the room. Debrief: did they open with the customer’s evening or with the spec sheet? The best pitches start with the moment, then the proof. Keep to approved claims: no "only", "shallowest" or "lowest clearance", and no default timer length.' });

  // 23 · Check 2
  L.quiz({ section: 'Selling Series II', n: 2, q: 'What Is The Minimum Ceiling Cavity For The Low-Clearance Recess Kit?',
    options: ['5.5 in', '7.5 in', '9.25 in', 'A framed pocket lined on five sides'], answer: 1,
    why: '7.5 in (190.5 mm), with the recess box supplied in the kit and integrated cooling fans on a dedicated, unswitched supply. Select and Coastal only; Classic uses the existing Tungsten recess kit.' });

  // 24 · Closing
  L.closing({ title: 'Lead With *Select*, Quote The Package', img: 'w-kion-sui-madrid-spain-tungsten-electric-4',
    points: ['Classic good, Select better, Coastal by the sea, Platinum best', 'Classic and Select heat the same – the look and the install differ', 'Narrower, lighter, single post, IPX5, full-body finishes', 'The only 6 kW recessed heater with a dual fan-ventilated, low-clearance kit', 'Every heater on the quote with its Affinity controls'],
    next: 'Next: take B3, Affinity Smart-Heat Controls, and spec your next pergola with both.',
    notes: 'Recap the five points. Ask each person to name one current customer they will offer Series II to this month, and which tier. Remind them that Select and Coastal are available now and Classic follows in January 2027.' });

  await L.finish('Bromic-Dealer-Tungsten-Series-II');
}
main().catch((e) => { console.error(e); process.exit(1); });
