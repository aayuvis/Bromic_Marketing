// B4 · Dealer track · Tungsten Smart-Heat® Electric Series II
// Facts: data/product-marketing/tungsten-electric-series-ii.json (tiers, upgrades, pillars, accessories, dimensions, slimness,
// launch, m3, claim_checks: "use_instead"/"safest" wording only) and the training brief (pergola guide planning figures).
// Competition is never named on a slide. [[VERIFY]] items stay off the slides and are flagged "to confirm" in the notes.
const L = require('./lib');
const { T, H1, card, ico, pic, HEX, W, M } = L;

const ICONS = ['LuRuler', 'LuWeight', 'LuMove', 'LuCloudRain', 'LuPalette', 'LuLayers', 'LuSparkles', 'LuAnchor', 'LuShip', 'LuFan', 'LuPackage',
  'LuRotate3D', 'LuHouse', 'LuTrophy', 'LuCalendar', 'LuMegaphone', 'LuEye', 'LuSearch', 'LuSlidersHorizontal', 'LuThermometer', 'LuShieldCheck',
  'LuArrowRight', 'LuSun', 'LuSquareStack', 'LuWaves', 'LuGauge', 'LuSmartphone', 'LuMoveDiagonal', 'LuTimer'];

async function main() {
  L.start({ title: 'Tungsten Series II', footer: 'Bromic Training Hub  ·  Dealer track  ·  Tungsten Smart-Heat® Electric Series II', icons: ICONS });
  await L.prepIcons();
  const P = () => L.pres;
  const label = (s, t, x, y, w, o = {}) => T(s, t.toUpperCase(), { x, y, w, h: 0.3, fontSize: 11, bold: true, color: HEX.FLAME, charSpacing: 3, ...o });

  // 1 · Cover
  L.cover({ kicker: 'Dealer Track  ·  Module B4', title: 'Tungsten Smart-Heat® Electric Series II', img: 'l-006-028',
    sub: 'The new Tungsten family: what changed, how it mounts, and how to sell it.', meta: 'Bromic Training Hub  ·  About 60 minutes',
    notes: 'Welcome. Tungsten Series II is the biggest change to our best-selling electric heater in years. By the end of this module you will place each tier with the right customer, explain what changed from Series I, spec a pergola package with its accessories and controls, and pitch it in a minute. There are three exercises and two quick checks.' });

  // 2 · Divider 01
  L.divider({ n: '01', title: 'The New Family', line: 'Classic, Select and Coastal – with Platinum above them.', img: 'l-004-012', icon: 'LuSquareStack', section: 'The New Family',
    notes: 'Section one: the line-up and where each heater sits.' });

  // 3 · Good, better, by the sea, best
  { const s = L.content('The New Family', 'Good, Better, Best', 'One Family, A Heater For Every Customer',
    'Walk left to right. Classic is the good choice: style and value, in black, 2 to 6 kW, with a two-year warranty. Select is the better choice: black, white or graphite, three fronts, the single post, the low-clearance recess kit and IPX5, with 3 years on the heater and 7 on the elements. Coastal is Select built for life by the water, in 4 and 6 kW, black or white. Platinum Smart-Heat Electric sits above as the best: the flush, glass-ceramic heater for the most considered spaces. Graphite is on the 4 and 6 kW Select. Prices are not part of trade training slides – use the current price list.');
    const tiers = [
      ['Good', 'Tungsten Classic', 'dk-Tungsten-Series-II-Classic-black-hero', ['2, 3, 4 and 6 kW', 'Black, wireframe front', '2-year warranty']],
      ['Better', 'Tungsten Select', 'dk-Tungsten-Series-II-Select-black-hero', ['2, 3, 4 and 6 kW', 'Black, white, graphite', '3 yr heater, 7 yr elements']],
      ['By The Sea', 'Tungsten Coastal', 'l-005-025', ['4 and 6 kW', 'Black and white', 'Marine-grade build']],
      ['Best', 'Platinum Electric', 'w-platinum-black', ['2300, 3400, 4500 W', 'Glass-ceramic face', '3-year warranty']]];
    const cw = (W - 2 * M - 3 * 0.3) / 4;
    tiers.forEach(([tier, name, img, pts], i) => { const x = M + i * (cw + 0.3);
      card(s, x, 1.85, cw, 4.9, i === 3 ? HEX.INK : HEX.GREY, 'tier');
      pic(s, img, x + 0.15, 2.0, cw - 0.3, 2.0, img.startsWith('l-') ? 'cover' : 'contain', 'tier-' + i);
      label(s, tier, x + 0.25, 4.2, cw - 0.5);
      T(s, name, { x: x + 0.25, y: 4.52, w: cw - 0.4, h: 0.5, fontSize: 18, color: i === 3 ? HEX.WHITE : HEX.INK, fontFace: 'Bodoni MT' });
      T(s, pts.map((p, j) => ({ text: p, options: { breakLine: j < pts.length - 1, paraSpaceAfter: 6 } })), { x: x + 0.25, y: 5.15, w: cw - 0.5, h: 1.55, fontSize: 16, color: i === 3 ? 'D9D6D2' : HEX.BODY }); }); }

  // 4 · Classic and Select: same heat
  { const s = L.content('The New Family', 'Classic And Select', 'The Same Warmth – The Customer Chooses The Look',
    'This is the line that stops a customer trading down for the wrong reason. Classic and Select give exactly the same heat coverage: 65, 100, 130 and 160 square feet for 2, 3, 4 and 6 kW. What the customer pays for with Select is the look and the install: three finishes, three fronts, the single post, the low-clearance recess kit, IPX5 and the longer warranty. Classic launches in January 2027.');
    pic(s, 't2-classic', M, 2.0, 5.6, 1.35, 'contain', 'classic-front');
    pic(s, 't2-select-black', M, 4.1, 5.6, 1.35, 'contain', 'select-front');
    label(s, 'Classic  ·  Good', M, 1.7, 5.6, { color: HEX.STEEL }); label(s, 'Select  ·  Better', M, 3.8, 5.6, { color: HEX.STEEL });
    card(s, 7.0, 1.85, 5.73, 4.9, HEX.INK, 'same-heat');
    label(s, 'Heat coverage, both tiers', 7.4, 2.2, 5);
    [['2 kW', '65'], ['3 kW', '100'], ['4 kW', '130'], ['6 kW', '160']].forEach(([kw, ft], i) => { const y = 2.75 + i * 0.95;
      T(s, kw, { x: 7.4, y, w: 1.6, h: 0.7, fontSize: 22, color: 'D9D6D2', valign: 'middle' });
      T(s, [{ text: ft, options: { fontSize: 40, fontFace: 'Bodoni MT', color: HEX.WHITE } }, { text: '  ft²', options: { fontSize: 18, color: 'D9D6D2' } }], { x: 9.0, y: y - 0.1, w: 3.4, h: 0.85, valign: 'middle' }); }); }

  // 5 · Three finishes
  { const s = L.content('The New Family', 'Finishes', 'All Black, All White, All Graphite',
    'On Select, each finish covers the whole heater, front included, so it reads as one piece against a timber or plaster ceiling. Black, white and graphite; graphite is on the 4 and 6 kW models. Coastal comes in black and white; Classic in black. Ask the customer about the ceiling and the frame colour first – the finish follows.');
    pic(s, 'dk-Tungsten-Series-II-Select-family-three-finishes', M, 1.85, 8.4, 4.9, 'cover', 'three-finishes');
    const f = [['Black', '231F20'], ['White', 'FFFFFF'], ['Graphite', '5A5C5E']];
    f.forEach(([n, c], i) => { const y = 2.1 + i * 1.05; s.addShape(P().shapes.OVAL, { x: 9.4, y, w: 0.7, h: 0.7, fill: { color: c }, line: { color: 'C9C9C6', width: 1 }, objectName: 'swatch-' + n });
      T(s, n, { x: 10.3, y: y + 0.1, w: 2.4, h: 0.5, fontSize: 22, color: HEX.INK, fontFace: 'Bodoni MT', valign: 'middle' }); });
    T(s, 'The whole heater in one finish, front included. Graphite on 4 and 6 kW.', { x: 9.4, y: 5.4, w: 3.33, h: 1.3, fontSize: 15 }); }

  // 6 · Fronts
  { const s = L.content('The New Family', 'Fronts', 'Three Fronts To Suit The Room',
    'Select comes with the Diamond Pattern front as standard; the traditional oval and the triangle are sold separately. Coastal has the Diamond Pattern. Classic has its own stylised wireframe front. Whether every front fits a recessed install is still to confirm with the Product team, so check before you promise it on a recess job.');
    pic(s, 'dk-Tungsten-Series-II-Select-graphite-grille-macro', 6.3, 1.85, 6.43, 4.9, 'cover', 'grille-macro');
    const fr = [['Diamond Pattern', 'Standard on Select and Coastal'], ['Traditional Oval', 'Select, sold separately'], ['Triangle', 'Select, sold separately']];
    fr.forEach(([n, b], i) => { const y = 2.0 + i * 1.5; ico(s, i === 0 ? 'LuSparkles' : 'LuLayers', M, y, 0.8, i === 0 ? 'solid' : 'light');
      T(s, n, { x: M + 1.1, y, w: 4.4, h: 0.5, fontSize: 22, color: HEX.INK, fontFace: 'Bodoni MT' }); T(s, b, { x: M + 1.1, y: y + 0.55, w: 4.4, h: 0.5, fontSize: 16 }); }); }

  // 7 · Divider 02
  L.divider({ n: '02', title: 'What Changed From Series I', line: 'Slimmer, lighter, cleaner to mount – and tougher in the weather.', img: 'l-003-009', icon: 'LuSearch', section: 'What Changed',
    notes: 'Section two: what is new against Tungsten Series I, which customers already know.' });

  // 8 · What changed
  { const s = L.content('What Changed', 'Series I To Series II', 'Six Changes Your Customer Will Notice',
    'Narrower: 183 mm wide against 214 mm, about 14% (launch deck). Lighter: 13 to 15 lb against 19.8 to 22 lb, about a third (manuals). A single post replaces the two suspension tubes of Series I, with no visible junction box; Classic keeps the Series I mounting. IPX5 on Select and Coastal, against IPX4. Full-body finishes and new fronts. And the low-clearance recess kit. Do not make a depth claim: the deck and the manuals disagree, so it stays off customer copy until the Product team measures both the same way.');
    const ch = [['LuRuler', 'About 14% narrower'], ['LuWeight', 'About a third lighter'], ['LuMoveDiagonal', 'Single post, no visible junction box'], ['LuCloudRain', 'IPX5 on Select and Coastal'], ['LuPalette', 'Full-body finishes, new fronts'], ['LuFan', 'Low-clearance recess kit']];
    ch.forEach(([ic, t], i) => { const col = i % 2, row = Math.floor(i / 2); const x = M + col * 3.55, y = 2.0 + row * 1.5;
      ico(s, ic, x, y, 0.8, 'light'); T(s, t, { x: x + 0.95, y: y - 0.05, w: 2.45, h: 0.9, fontSize: 17, color: HEX.INK, valign: 'middle' }); });
    // width and weight bars
    card(s, 8.0, 1.85, 4.73, 4.9, HEX.GREY, 'compare');
    const bars = [['Width', 'Series I', 214, 'mm', 214], ['', 'Series II', 183, 'mm', 214], ['Weight, 3 and 6 kW', 'Series I', 22, 'lb', 22], ['', 'Series II', 15, 'lb', 22]];
    bars.forEach(([h, n, v, u, max], i) => { const y = 2.35 + i * 1.05 + (i > 1 ? 0.3 : 0);
      if (h) label(s, h, 8.3, y - 0.35, 4, { color: HEX.STEEL });
      T(s, n, { x: 8.3, y: y + 0.05, w: 1.1, h: 0.4, fontSize: 14, color: HEX.INK });
      const bw = 2.2 * v / max; card(s, 9.45, y, bw, 0.5, n === 'Series II' ? HEX.FLAME : 'C9C9C6', 'bar');
      T(s, `${v} ${u}`, { x: 9.45 + bw + 0.1, y: y + 0.05, w: 1.1, h: 0.4, fontSize: 15, bold: true, color: HEX.INK }); }); }

  // 9 · Exercise 1: spot the difference
  { const s = L.exercise({ section: 'What Changed', n: 1, minutes: 8, icon: 'LuEye', title: 'Series I Or Series II?',
      task: 'In pairs: which heaters are Series I and which are Series II? Name the clue you used for each.',
      notes: 'How to run it: two minutes in pairs, then go round the room, one picture each. Answers: A is Series I – the front guard is stainless over a white or black body. B is Series II Select – the Diamond Pattern front is in the same black as the body. C is Series I – stainless fronts on angled brackets along a pergola beam. D is Series II Select – Diamond Pattern, black all over. Debrief: the quickest tell is the front. On Series II Select the front is the body colour; on Series I it is stainless. Then the profile – slimmer – and on the ceiling, the single post with no visible junction box. This is exactly what you show a customer who asks why Series II costs more.' });
    const tiles = [['w-tungelec-stacked', 'contain'], ['t2-select-black', 'contain'], ['w-vbb7428', 'cover'], ['l-007-034', 'cover']];
    const cw = (W - 2 * M - 3 * 0.3) / 4;
    tiles.forEach(([img, mode], i) => { const x = M + i * (cw + 0.3); card(s, x, 3.2, cw, 3.5, HEX.WHITE, 'tile'); pic(s, img, x + 0.12, 3.32, cw - 0.24, 2.65, mode, 'spot-' + i);
      T(s, String.fromCharCode(65 + i), { x: x + 0.15, y: 6.0, w: 1, h: 0.65, fontSize: 30, color: HEX.FLAME, fontFace: 'Bodoni MT' }); }); }

  // 10 · Divider 03
  L.divider({ n: '03', title: 'Mounting And Coverage', line: 'Ceiling, pitched ceiling, wall, post or recessed – one heater for every setting.', img: 'l-001-000', icon: 'LuRotate3D', section: 'Mounting And Accessories',
    notes: 'Section three: how Series II mounts, the four new accessories, and how much space each model heats.' });

  // 11 · Single post
  { const s = L.content('Mounting And Accessories', 'Single Post', 'A Heater That Seems To Float',
    'On its single post the heater appears to float, with no visible junction box. The post replaces the two suspension tubes of Series I: fewer parts to fit and a cleaner ceiling. The framework gives a 5 in post for the 2 and 3 kW and a 9 in post for the 4 and 6 kW, straight or angled. Classic keeps the proven Series I mounting.');
    pic(s, 'rv-pr-d-social-black-ceiling-post-graphite-4x5', 7.6, 1.85, 5.13, 4.9, 'cover', 'single-post');
    const pts = [['LuMoveDiagonal', 'One post, one fixing', 'Replaces the two suspension tubes of Series I.'], ['LuEye', 'No visible junction box', 'A clean line from ceiling to heater.'], ['LuRuler', 'Two post lengths', '5 in for 2 and 3 kW; 9 in for 4 and 6 kW.']];
    pts.forEach(([ic, t, b], i) => { const y = 2.0 + i * 1.5; ico(s, ic, M, y, 0.8, 'light'); T(s, t, { x: M + 1.1, y, w: 5.6, h: 0.5, fontSize: 22, color: HEX.INK, fontFace: 'Bodoni MT' }); T(s, b, { x: M + 1.1, y: y + 0.55, w: 5.6, h: 0.6, fontSize: 16 }); }); }

  // 12 · Brackets and the pitched ceiling
  { const s = L.content('Mounting And Accessories', 'New Accessories', 'Walls, Angles And Pitched Ceilings',
    'Three new pieces of hardware. The wall-mounting bracket holds the heater out from the wall: 14 in of reach with a 5 in drop, or 18 in of reach. The new mounting bracket has set positions for 15, 30 and 45 degrees, so the heater aims at the seats and can be re-angled later. The pitched-ceiling adaptor takes ceilings from 3/12 to 12/12; 6/12 is the most common residential pitch. The 45 degree position on the 4 and 6 kW is still to confirm – the manual says 30 – so check before you promise 45 on a 6 kW.');
    const cols = [['rv-pr-d-social-graphite-wall-bracket-black-4x5', 'Wall Bracket', '14 in or 18 in reach'], ['rv-pr-select-graphite-angled-bracket', 'Angled Bracket', 'Set at 15°, 30° or 45°'], [null, 'Pitched-Ceiling Adaptor', '3/12 to 12/12 pitch']];
    const cw = (W - 2 * M - 2 * 0.35) / 3;
    cols.forEach(([img, t, b], i) => { const x = M + i * (cw + 0.35);
      if (img) pic(s, img, x, 1.85, cw, 3.55, 'cover', 'acc-' + i);
      else { card(s, x, 1.85, cw, 3.55, HEX.GREY, 'pitch');
        // a simple roof-pitch sketch: 6/12 roof line with a heater on the adaptor
        s.addShape(P().shapes.LINE, { x: x + 0.4, y: 2.45, w: cw - 0.8, h: 1.9, flipV: true, line: { color: HEX.INK, width: 3 }, objectName: 'roof-line' });
        s.addShape(P().shapes.LINE, { x: x + 0.4, y: 4.35, w: cw - 0.8, h: 0, line: { color: 'C9C9C6', width: 1.5, dashType: 'dash' }, objectName: 'level' });
        T(s, '3/12 – 12/12', { x: x + 0.4, y: 4.5, w: cw - 0.8, h: 0.5, fontSize: 22, color: HEX.FLAME, fontFace: 'Bodoni MT', align: 'center' });
        T(s, '14° to 45°', { x: x + 0.4, y: 2.05, w: 1.8, h: 0.4, fontSize: 14, color: HEX.STEEL }); }
      T(s, t, { x, y: 5.55, w: cw, h: 0.5, fontSize: 21, color: HEX.INK, fontFace: 'Bodoni MT' }); T(s, b, { x, y: 6.1, w: cw, h: 0.5, fontSize: 16 }); }); }

  // 13 · Low-clearance recess
  { const s = L.content('Mounting And Accessories', 'Low-Clearance Recess Kit', 'The Only 6 kW Recessed Heater With A Dual Fan-Ventilated Kit',
    'Use this exact wording (owner, 28 Nov 2026): the only 6 kW recessed outdoor heater with a dual fan-ventilated, low-clearance recess kit. It recesses 2, 3, 4 and 6 kW into a 7.5 inch ceiling cavity; the kit is dual fan-ventilated, so there is no site-built box. The recess box comes with the kit. One kit serves Select and Coastal; Coastal gets a marine-grade version in powder-coated 316 stainless, rated IPX5. The integrated fans need a dedicated, unswitched supply so they stay powered. Do not say "shallowest" or "lowest clearance": other brands recess into about 7.25 in framed, fire-rated pockets. The number of fans and any fire-rated lining requirement are still to confirm with the Product team.');
    pic(s, 't2-low-clearance-recess', M, 1.85, 6.0, 2.6, 'contain', 'recess-kit');
    pic(s, 'rv-pr-d-recess-black-timber-logo-f1-4', 6.85, 1.85, 5.88, 4.9, 'cover', 'recessed-timber');
    const pts = [['LuFan', 'Dual fan-ventilated'], ['LuPackage', 'Recess box supplied – nothing to build on site'], ['LuAnchor', 'Marine-grade kit for Coastal']];
    pts.forEach(([ic, t], i) => { const y = 4.65 + i * 0.72; ico(s, ic, M, y, 0.6, 'light'); T(s, t, { x: M + 0.8, y: y + 0.02, w: 5.3, h: 0.56, fontSize: 16, color: HEX.INK, valign: 'middle' }); }); }

  // 14 · Coverage and heights
  { const s = L.content('Mounting And Accessories', 'Coverage And Heights', 'How Much Space Each Model Heats',
    'Coverage is the same on Classic and Select. Recommended mounting heights, heater to floor: 2 and 3 kW at 8 to 9 ft, 4 kW at 8 to 10 ft, 6 kW at 8 to 12 ft. To size a partly covered space on cool evenings, divide the seating area by the coverage times 0.85 and round up. The picture shows a 6 kW heating about 160 square feet of terrace. Series II minimum heights are still to confirm with the Product team – use the installation manual on site.');
    const rows = [['2 kW', '65 ft²', '8–9 ft'], ['3 kW', '100 ft²', '8–9 ft'], ['4 kW', '130 ft²', '8–10 ft'], ['6 kW', '160 ft²', '8–12 ft']];
    ['Output', 'Heats up to', 'Mount at'].forEach((h, j) => label(s, h, M + 0.3 + j * 2.1, 1.9, 2, { color: HEX.STEEL }));
    rows.forEach((r, i) => { const y = 2.3 + i * 0.78; card(s, M, y, 6.3, 0.68, i % 2 ? HEX.WHITE : HEX.GREY, 'row');
      r.forEach((c, j) => T(s, c, { x: M + 0.3 + j * 2.1, y: y + 0.1, w: 2, h: 0.5, fontSize: j === 0 ? 20 : 18, color: HEX.INK, fontFace: j === 0 ? 'Bodoni MT' : 'Arial', valign: 'middle' })); });
    card(s, M, 5.55, 6.3, 1.15, HEX.INK, 'formula');
    T(s, [{ text: 'Heaters  =  area ÷ (coverage × 0.85)', options: { fontSize: 19, color: HEX.WHITE, fontFace: 'Bodoni MT', breakLine: true } }, { text: 'Partly covered, cool evenings. Round up.', options: { fontSize: 14, color: 'D9D6D2' } }], { x: M + 0.3, y: 5.68, w: 5.8, h: 0.95, valign: 'middle' });
    pic(s, 'rv-hb-tungsten-6kw-terrace', 7.25, 1.85, 5.48, 4.9, 'cover', 'coverage-6kw'); }

  // 15 · Check 1
  L.quiz({ section: 'Mounting And Accessories', n: 1, q: 'A Customer Asks If Select Heats More Than Classic. What Do You Say?',
    options: ['Yes – Select covers about a third more', 'No – the same coverage; Select adds the look, the mounts and the warranty', 'Only the 6 kW Select heats more', 'Only Coastal heats more'], answer: 1,
    why: 'Classic and Select give the same heat coverage: 65, 100, 130 and 160 ft² for 2, 3, 4 and 6 kW. Select adds three finishes, three fronts, the single post, the low-clearance recess kit, IPX5 and 3 years on the heater with 7 on the elements.' });

  // 16 · Statement: Coastal
  L.statement({ section: 'Coastal', kicker: 'Tungsten Coastal', line: 'Built For Life By The Water.', img: 'l-005-024',
    notes: 'Coastal is the answer for any home or venue on the coast: salt air, spray and sun. It is for coastal homes and venues, not for boats.' });

  // 17 · Coastal
  { const s = L.content('Coastal', 'Tungsten Coastal', 'Corrosion Protection, Twice Over',
    'Coastal protects against corrosion twice over: a marine-grade build with a high-temperature, corrosion-resistant coating, and a recess kit in powder-coated 316 stainless steel rated IPX5. It comes in 4 and 6 kW, at 208 and 240 V, in black or white, with the Diamond Pattern front. It is never for installation on boats. The heater body material and the coating name are still to confirm with the Product team, so say "marine-grade build" rather than naming the steel.');
    pic(s, 'l-005-022', 7.0, 1.85, 5.73, 4.9, 'cover', 'coastal-recessed');
    const pts = [['LuShieldCheck', 'Corrosion-resistant coating', 'Over a marine-grade build.'], ['LuAnchor', 'Marine-grade recess kit', 'Powder-coated 316 stainless, IPX5.'], ['LuThermometer', '4 and 6 kW', 'Black or white, Diamond Pattern front.'], ['LuShip', 'Not for boats', 'For coastal homes and venues.']];
    pts.forEach(([ic, t, b], i) => { const y = 1.95 + i * 1.2; ico(s, ic, M, y, 0.75, i === 3 ? 'dark' : 'light'); T(s, t, { x: M + 1.0, y: y - 0.02, w: 5.6, h: 0.45, fontSize: 20, color: HEX.INK, fontFace: 'Bodoni MT' }); T(s, b, { x: M + 1.0, y: y + 0.46, w: 5.6, h: 0.5, fontSize: 16 }); }); }

  // 18 · Divider 04
  L.divider({ n: '04', title: 'Selling Series II', line: 'How it wins, when it lands, and how to put it on every pergola.', img: 'l-008-059', icon: 'LuTrophy', section: 'Selling Series II',
    notes: 'Section four: the competition, the launch timing, and two exercises to practise the sale.' });

  // 19 · Against the competition
  { const s = L.content('Selling Series II', 'Against The Competition', 'Where Series II Wins',
    'Use these in conversation, not in print, until Specification and compliance signs them off, and never name the competitor. Recess: their flush frame needs a framed pocket lined on all five sides with Type X drywall, on flat ceilings only, with a 15-minute cool-down recommended after 4 hours of continuous use; ours is a dual fan-ventilated kit in a 7.5 in cavity, recess box supplied. Pitched ceilings: their flush frame cannot be pitched; we have the adaptor. Finish: their reflector face and wire guard stay stainless in every colour; ours is one finish end to end. Weather: IPX5 against IPX4. On heat, call it parity – each maker measures coverage its own way – so compete on controls and installation.');
    const rows = [['LuFan', 'Recessing', 'Dual fan-ventilated kit, 7.5 in cavity, box supplied', 'Framed pocket lined on five sides; flat ceilings only'],
      ['LuHouse', 'Pitched ceilings', 'Adaptor from 3/12 to 12/12', 'Flush frame on flat ceilings only'],
      ['LuPalette', 'Finish', 'The whole heater in one finish', 'Stainless face and guard in every colour'],
      ['LuCloudRain', 'Weather', 'IPX5', 'IPX4'],
      ['LuSmartphone', 'Controls', 'Affinity and the Bromic app, from one maker', 'App control through a third-party bridge']];
    label(s, 'Tungsten Series II', 4.6, 1.75, 4); label(s, 'The competition', 8.75, 1.75, 4, { color: HEX.STEEL });
    rows.forEach(([ic, b, us, them], i) => { const y = 2.05 + i * 0.88; card(s, M, y, W - 2 * M, 0.8, i % 2 ? HEX.WHITE : HEX.GREY, 'row');
      ico(s, ic, M + 0.12, y + 0.11, 0.6, 'light'); T(s, b, { x: M + 0.9, y: y + 0.1, w: 2.9, h: 0.62, fontSize: 18, color: HEX.INK, fontFace: 'Bodoni MT', valign: 'middle' });
      T(s, us, { x: 4.6, y: y + 0.06, w: 4.0, h: 0.7, fontSize: 15, bold: true, color: HEX.INK, valign: 'middle' });
      T(s, them, { x: 8.75, y: y + 0.06, w: 3.9, h: 0.7, fontSize: 15, color: HEX.STEEL, valign: 'middle' }); });
    T(s, 'Heat output is parity – compete on controls and installation.', { x: M, y: 6.8 - 0.25, w: 9, h: 0.3, fontSize: 12, color: HEX.STEEL, italic: true }); }

  // 20 · Launch timing
  { const s = L.content('Selling Series II', 'Launch Timing', 'From Series I To Series II',
    'Series II stock reached the distribution centre in mid-September 2026. In October 2026 Select and Coastal launched, Series I moved to entry level, and Cobalt was discontinued once sold through. In January 2027 Classic launches and Series I is discontinued after sell-through – that completes the launch. Practical advice: sell your Series I stock now as the entry choice, and lead every new conversation with Select.');
    const ph = [['Mid-Sep 2026', 'Stock Ready', 'Series II in the distribution centre, ready to ship'], ['Oct 2026', 'Select And Coastal', 'Launched. Series I moves to entry level; Cobalt sells through'], ['Jan 2027', 'Classic', 'Launches as Series I sells through – the family is complete']];
    s.addShape(P().shapes.LINE, { x: M + 0.4, y: 2.6, w: W - 2 * M - 0.8, h: 0, line: { color: 'C9C9C6', width: 2 }, objectName: 'timeline' });
    const cw = (W - 2 * M - 2 * 0.4) / 3;
    ph.forEach(([when, t, b], i) => { const x = M + i * (cw + 0.4);
      s.addShape(P().shapes.OVAL, { x: x + 0.2, y: 2.38, w: 0.44, h: 0.44, fill: { color: i === 1 ? HEX.FLAME : HEX.INK }, line: { color: HEX.WHITE, width: 3 }, objectName: 'milestone' });
      label(s, when, x + 0.2, 1.85, cw - 0.3, { color: i === 1 ? HEX.FLAME : HEX.STEEL });
      card(s, x, 3.15, cw, 3.1, i === 1 ? HEX.WASH : HEX.GREY, 'phase');
      T(s, t, { x: x + 0.3, y: 3.4, w: cw - 0.6, h: 0.6, fontSize: 24, color: HEX.INK, fontFace: 'Bodoni MT' });
      T(s, b, { x: x + 0.3, y: 4.15, w: cw - 0.6, h: 1.9, fontSize: 18 }); }); }

  // 21 · Exercise 2: spec a pergola
  L.exercise({ section: 'Selling Series II', n: 2, minutes: 15, icon: 'LuSquareStack', title: 'Spec A Pergola Package',
    task: 'A homeowner has a 14 × 20 ft louvered pergola over a dining and lounge area. Spec the full package.',
    steps: ['Work out the area and how many heaters you need', 'Choose the tier, output and finish', 'Choose the mounts and accessories', 'Add the controls and the wall switch', 'Note the mounting height and the wiring'],
    img: 'w-240619-yorba-linda-ca-dc-64',
    notes: 'How to run it: groups of three, ten minutes to build the package, five to compare. Suggested answer: 14 × 20 ft is 280 ft². 280 ÷ (160 × 0.85) = 2.06, so three Tungsten Select 6 kW heaters (three 4 kW also work: 280 ÷ (130 × 0.85) = 2.5, rounded up to three). Finish to match the pergola frame – black, white or graphite. Mount on the perimeter beams, never on a louvre, on the single post or the angled bracket aimed in at the seats at 15 to 45 degrees (45 on 4 and 6 kW to confirm), 8 to 12 ft above the floor for 6 kW; a wall bracket where the clear height is below 8 ft. Controls: three heaters at 6 kW fill three channels, so one Affinity 5-channel Dimmer with two spare, plus a manual wall switch. Each heater on a dedicated circuit, hard-wired by a licensed electrician; pre-wire through the posts and beams. Wi-Fi and app features need compatible Affinity controls, sold separately. Debrief: who forgot the controls?' });

  // 22 · Exercise 3: 60-second pitch
  L.exercise({ section: 'Selling Series II', n: 3, minutes: 10, icon: 'LuMegaphone', title: 'Pitch Series II In 60 Seconds',
    task: 'In pairs, pitch Tungsten Select to a homeowner in one minute. Your partner times you and listens for each point.',
    steps: ['Open with their evening: the table, the view, one more hour outside', 'Show the look: one finish end to end, three fronts', 'Show the install: single post, pitched ceilings, recessing', 'Close on controls: the Affinity Dimmer and the app', 'Ask for the next step: a design plan or a quote'],
    img: 'dk-Tungsten-Series-II-Select-family-three-finishes', imgMode: 'contain',
    notes: 'How to run it: one minute each, partner times and ticks the five points, then swap. Ask two volunteers to pitch to the room. Debrief: did they open with the customer’s evening or with the spec sheet? The best pitches start with the moment, then the proof. Keep to approved claims: no "only", "shallowest" or "lowest clearance", and no default timer length.' });

  // 23 · Check 2
  L.quiz({ section: 'Selling Series II', n: 2, q: 'What Is The Minimum Ceiling Cavity For The Low-Clearance Recess Kit?',
    options: ['5.5 in', '7.5 in', '9.25 in', 'A framed pocket lined on five sides'], answer: 1,
    why: '7.5 in (190.5 mm), with the recess box supplied in the kit and integrated cooling fans on a dedicated, unswitched supply. Select and Coastal only; Classic uses the existing Tungsten recess kit.' });

  // 24 · Closing
  L.closing({ title: 'Lead With Select, Quote The Package', img: 'w-kion-sui-madrid-spain-tungsten-electric-4',
    points: ['Classic good, Select better, Coastal by the sea, Platinum best', 'Classic and Select heat the same – the look and the install differ', 'Narrower, lighter, single post, IPX5, full-body finishes', 'The only 6 kW recessed heater with a dual fan-ventilated, low-clearance kit', 'Every heater on the quote with its Affinity controls'],
    next: 'Next: take B3, Affinity Smart-Heat Controls, and spec your next pergola with both.',
    notes: 'Recap the five points. Ask each person to name one current customer they will offer Series II to this month, and which tier. Remind them that Select and Coastal are available now and Classic follows in January 2027.' });

  await L.finish('Bromic-Dealer-Tungsten-Series-II');
}
main().catch((e) => { console.error(e); process.exit(1); });
