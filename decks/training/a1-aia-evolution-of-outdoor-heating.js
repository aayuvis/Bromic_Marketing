// A1 · AIA/CES lunch and learn: The Evolution Of Outdoor Heating (course AIA4041002, 1 LU HSW, about 60 minutes).
// The CE hour is brand-neutral: generic technologies, no product names or sales claims. Bromic appears only in the
// appendix after Questions. Run: cd decks/training && NODE_PATH=$PWD/node_modules node a1-aia-evolution-of-outdoor-heating.js
const L = require('./lib');
// a plain white panel in the exercise picture frame, so the drawn plans and lettered photos sit on white
const WASH = require('path').join(__dirname, 'cache', 'a1-white-panel.jpg');
const { pic, T, H1, card, bullets, HEX, W, M } = L;


(async () => {
  require('fs').mkdirSync(require('path').dirname(WASH), { recursive: true });
  await require('sharp')({ create: { width: 1076, height: 980, channels: 3, background: '#FFFFFF' } }).jpeg().toFile(WASH);
  const APP_PHOTO = require('path').join(__dirname, 'cache', 'app-photo-cropped.jpg'); // the app photograph without its green foot band
  await require('sharp')(require('path').join(__dirname, '..', '..', 'images', 'library', 'w-bromic-heating-app-blog-image.webp')).extract({ left: 0, top: 0, width: 600, height: 574 }).jpeg({ quality: 90 }).toFile(APP_PHOTO);
  const { pres } = L.start({ title: 'The Evolution Of Outdoor Heating', footer: 'The Evolution Of Outdoor Heating  ·  AIA/CES course AIA4041002  ·  1 LU HSW' });
  await L.prepIcons();
  const S = pres.shapes;
  const rect = (s, x, y, w, h, color, o = {}) => s.addShape(S.RECTANGLE, { x, y, w, h, fill: { color, ...(o.t != null ? { transparency: o.t } : {}) }, line: o.line ? { color: o.line, width: o.lw || 1, dashType: o.dash || 'solid' } : { color, width: 0 }, objectName: o.name || 'shape' });
  const oval = (s, x, y, w, h, color, t = 0, line) => s.addShape(S.OVAL, { x, y, w, h, fill: { color, transparency: t }, line: line ? { color: line, width: 1 } : { color, width: 0 }, objectName: 'shape' });
  const ln = (s, x, y, w, h, color = HEX.INK, width = 1.5, o = {}) => s.addShape(S.LINE, { x, y, w, h, line: { color, width, dashType: o.dash || 'solid', endArrowType: o.arrow ? 'triangle' : undefined, beginArrowType: o.arrow2 ? 'triangle' : undefined }, flipV: !!o.flipV, objectName: 'line' });
  const cap = (s, text, x, y, w, o = {}) => T(s, text, { x, y, w, h: 0.3, fontSize: 12, color: HEX.STEEL, ...o });
  // ---- v2 composition kit (the white papers' language) ----
  const { rule, num, stat, icon, rich } = L;
  const PH = 7.5, FR = { x: 7.35, y: 1.85, w: 5.38, h: 4.9 }; // the exercise picture frame
  // a photograph bled off the right edge, top to bottom (only on the right: the title and logo sit left)
  const bleed = (s, img, x = 7.6, o = {}) => pic(s, img, x, 0, W - x, PH, 'cover', o.name || 'photo');
  // a Didot letter set over a photograph corner (A, B, C) with a soft ink plate behind it
  const tag = (s, ch, x, y) => { rect(s, x, y, 0.52, 0.6, HEX.INK, { t: 15, name: 'letter-plate' }); H1(s, ch, { x, y: y - 0.02, w: 0.52, h: 0.6, fontSize: 28, color: HEX.WHITE, align: 'center', valign: 'middle' }); };
  // a hairline-headed block: rule, Didot lead, body
  const block = (s, x, y, w, lead, body, o = {}) => {
    rule(s, x, y, w, o.rc || HEX.INK, 0.75);
    H1(s, lead, { x, y: y + 0.12, w, h: o.lh || 0.45, fontSize: o.ls || 19, color: o.dark ? HEX.WHITE : HEX.INK });
    if (body) T(s, body, { x, y: y + 0.14 + (o.lh || 0.45), w, h: o.bh || 0.8, fontSize: o.bs || 14, color: o.dark ? 'D9D6D2' : HEX.BODY });
  };
  // a line from one point to another (any direction), optional arrow at the end
  const seg = (s, x1, y1, x2, y2, color = HEX.INK, width = 1.25, o = {}) => {
    const flip = (x2 - x1) * (y2 - y1) < 0, ex = Math.max(x1, x2), ey = flip ? Math.min(y1, y2) : Math.max(y1, y2);
    const atEnd = x2 === ex && y2 === ey && !(x1 === ex && y1 === ey);
    s.addShape(S.LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), flipV: flip,
      line: { color, width, dashType: o.dash || 'solid', ...(o.arrow ? (atEnd ? { endArrowType: 'triangle' } : { beginArrowType: 'triangle' }) : {}), ...(o.both ? { beginArrowType: 'triangle', endArrowType: 'triangle' } : {}) }, objectName: o.name || 'line' });
  };
  // a hatched band (a ceiling, soffit or beam in section), as the manuals draw structure
  const hatch = (s, x, y, w, h, color = HEX.INK) => { rect(s, x, y, w, h, HEX.WHITE, { line: color, lw: 1, name: 'structure' });
    for (let k = x + 0.12; k + h <= x + w; k += 0.16) seg(s, k, y + h, k + h, y, color, 0.5); };
  // the flame bar the white papers put beside quotes and called-out cards
  const fbar = (s, x, y, h) => rect(s, x, y, 0.05, h, HEX.FLAME, { name: 'flame-bar' });
  // a dark-header table with hairline rows (the PDFs' spec tables)
  const ftable = (s, rows, o) => s.addTable(rows.map((r, i) => r.map((c, j) => ({ text: c, options: {
    bold: i === 0 || (j === 0 && o.boldFirst), color: i === 0 ? HEX.WHITE : (j === 0 && o.steelFirst ? HEX.STEEL : HEX.INK),
    fill: { color: i === 0 ? (o.head && o.head[j]) || HEX.INK : HEX.WHITE },
    border: i === 0 ? [{ type: 'none' }, { type: 'none' }, { type: 'none' }, { type: 'none' }] : [{ type: 'none' }, { type: 'none' }, { pt: 0.75, color: 'C9C9C6' }, { type: 'none' }] } }))),
  { x: o.x, y: o.y, w: o.w, colW: o.colW, fontFace: 'Arial', fontSize: o.size || 14, rowH: o.rowH || 0.5, valign: 'middle', margin: [0.04, 0.12, 0.04, 0.12] });
  // a divider whose kicker is not "Part" (the appendix): a full-bleed photo, gradient from the bottom
  const SHADE_UP = require('path').join(__dirname, 'cache', 'shade-up.png');
  const plainDivider = ({ section, kicker, big, title, line, img, notes }) => {
    const s = L.statement({ section, kicker: 'x', line: 'x', img });
    s._slideObjects.splice(-3); // drop the statement's side shade and words; we set our own
    s.addImage({ path: SHADE_UP, x: 0, y: 0, w: W, h: PH, objectName: 'shade' });
    T(s, kicker.toUpperCase(), { x: M, y: 3.25, w: 9, h: 0.3, fontSize: 10, bold: true, color: HEX.FLAME, charSpacing: 5 });
    if (big) H1(s, big, { x: M - 0.04, y: 3.5, w: 6, h: 1.4, fontSize: 96, color: HEX.FLAME });
    H1(s, rich(title), { x: M, y: 4.95, w: 9, h: 0.9, fontSize: 40, color: HEX.WHITE });
    if (line) T(s, line, { x: M, y: 5.9, w: 8, h: 0.7, fontSize: 15, color: 'E6E2DE' });
    if (notes) s.addNotes(notes);
    return s;
  };
  // A table and chair in elevation (a seat, drawn like the manuals: no figures)
  const seat = (s, x, y, c = HEX.STEEL) => { // y is the table top; the floor is 0.47 below
    seg(s, x, y, x + 0.62, y, c, 1.75); seg(s, x + 0.08, y, x + 0.08, y + 0.47, c, 1.25); seg(s, x + 0.54, y, x + 0.54, y + 0.47, c, 1.25);
    seg(s, x + 0.72, y + 0.22, x + 0.94, y + 0.22, c, 1.5); seg(s, x + 0.94, y - 0.1, x + 0.94, y + 0.47, c, 1.25); seg(s, x + 0.74, y + 0.22, x + 0.74, y + 0.47, c, 1.25); };

  // ---------- 1 Cover ----------
  L.cover({
    kicker: 'AIA/CES Lunch And Learn', title: 'The Evolution Of Outdoor Heating',
    sub: 'How radiant heat, fuel and placement turn an outdoor space into a room people use all year.',
    meta: 'Course AIA4041002  ·  1 LU HSW  ·  About 60 minutes', img: 'w-kion-sui-madrid-spain-tungsten-electric-4',
    notes: 'Welcome everyone and thank them for lunch. This is a registered AIA/CES course, AIA4041002, worth 1 LU HSW. Over the next hour we will look at why outdoor heating matters, how the technologies differ, how to choose a fuel, how to specify and place heaters, and where the industry is heading. It is hands-on: six short exercises and two knowledge checks, so keep a pen handy. Make sure the sign-in sheet goes round now so every attendee gets credit.',
  });

  // ---------- 2 AIA/CES statements (required) ----------
  {
    const s = L.content('Welcome', 'AIA/CES', 'Registered With AIA/CES',
      'Read or summarise both statements; they are required for every AIA/CES session. Point out the last line: this hour is about methods, not products, and product questions are welcome once the course has ended. The brief "About Bromic" appendix follows the Questions slide.');
    // two statements as a document page: a narrow column and a wide one, each under its hairline
    rule(s, M, 1.95, 3.9, HEX.INK);
    H1(s, 'Copyright', { x: M, y: 2.1, w: 3.9, h: 0.5, fontSize: 22 });
    T(s, 'This presentation is protected by U.S. and international copyright laws. Reproduction, distribution, display and use of the presentation without written permission of the speaker is prohibited.', { x: M, y: 2.75, w: 3.7, h: 2.2, fontSize: 14 });
    rule(s, 5.05, 1.95, 7.68, HEX.INK);
    H1(s, 'AIA/CES', { x: 5.05, y: 2.1, w: 6, h: 0.5, fontSize: 22 });
    fbar(s, M, 5.4, 1.3);
    T(s, 'This hour is about methods, not products.', { x: M + 0.25, y: 5.4, w: 3.5, h: 1.3, fontSize: 19, fontFace: 'Bodoni MT', color: HEX.INK, valign: 'middle' });
    T(s, [
      { text: 'This program is registered with the AIA/CES for continuing professional education. As such, it does not include content that may be deemed or construed to constitute approval, sponsorship or endorsement by AIA of any method, product, service, enterprise or organization.', options: { breakLine: true, paraSpaceAfter: 8 } },
      { text: 'The statements expressed by speakers, panelists, and other participants reflect their own views and do not necessarily reflect the views or positions of The American Institute of Architects, or of AIA components, or those of their respective officers, directors, members, employees, or other organizations, groups or individuals associated with them.', options: { breakLine: true, paraSpaceAfter: 8 } },
      { text: 'Questions related to specific products and services may be addressed at the conclusion of this presentation.' },
    ], { x: 5.05, y: 2.75, w: 7.68, h: 3.95, fontSize: 14 });
  }

  // ---------- 3 Your presenter ----------
  {
    const s = L.content('Welcome', 'Your Presenter', 'Who Is Talking Today',
      'Fill in your name, title and how to reach you before the session. Say in one line what you do and the kinds of projects you help with, then ask the room: who has a project with an outdoor space on the boards right now? Keep those projects in mind; we will use them in the exercises.');
    bleed(s, 'w-p1021414-hdr-denoiseai-low-light', 7.6);
    // a calling card: three hairlines to write on
    [['Name', 2.15], ['Title', 3.2], ['Contact', 4.25]].forEach(([k, y]) => {
      T(s, k.toUpperCase(), { x: M, y, w: 6, h: 0.3, fontSize: 10, bold: true, color: HEX.FLAME, charSpacing: 4 });
      rule(s, M, y + 0.85, 6.3, HEX.INK, 0.75);
    });
    fbar(s, M, 5.55, 0.95);
    T(s, 'Ask anything, any time. Product questions wait for the end of the hour.', { x: M + 0.25, y: 5.55, w: 6.0, h: 0.95, fontSize: 19, fontFace: 'Bodoni MT', color: HEX.INK, valign: 'middle' });
  }

  // ---------- 4 Learning objectives ----------
  {
    const s = L.content('Welcome', 'Learning Objectives', 'By The End Of This Hour You Can',
      'Read the five objectives. They map to the four parts of the session: why heat the outdoors, heat and fuel, specify and place, and where heating is going. Tell them the exercises are how we check each objective, and that the last slide of the CE hour gives three things to put on their drawings next week.');
    const obj = [
      'Explain the value of outdoor heating to clients and occupants',
      'Differentiate between outdoor heating technologies',
      'Evaluate natural gas, propane and electric fuel sources',
      'Apply best practices in heater specification and placement',
      'Anticipate future trends in outdoor heating',
    ];
    // numbered Didot lines under hairlines, a photograph bled off the right
    obj.forEach((t, i) => {
      const y = 1.95 + i * 0.95;
      rule(s, M, y, 7.0, HEX.INK, 0.75);
      num(s, i + 1, M, y + 0.12, { size: 28, h: 0.65, w: 0.9 });
      H1(s, t, { x: M + 1.0, y: y + 0.16, w: 6.0, h: 0.7, fontSize: 19, valign: 'top' });
    });
    bleed(s, 'l-007-041', 8.45);
  }

  // ---------- Part 1 Why heat the outdoors ----------
  L.divider({ n: '01', title: 'Why Heat The Outdoors', section: 'Why Heat The Outdoors', img: 'w-tungsten-electric-wall-mount-canada',
    line: 'Comfort is what turns an outdoor area into a room people use.',
    notes: 'Part one, about ten minutes. Ask for a show of hands: who has designed an outdoor space that sits empty half the year? That empty half is what we are here to fix.' });

  {
    const s = L.content('Why Heat The Outdoors', 'What Clients Ask For', 'Clients Want Outdoor Rooms',
      'Source: The American Institute of Architects, Home Design Trends Survey, Q2 2026 (figure 1): share of residential architects reporting client interest in a room type increasing, minus the share reporting it decreasing. Outdoor living areas and rooms led every special-function room at a net 51%, up from 40% a year earlier; heated exterior space rose from 12% to 16%. The figure is a net percentage: the share of firms seeing interest rise minus the share seeing it fall, so 51% means about half the profession, net, sees more clients asking. The point: clients are asking for outdoor rooms, and a room is only a room if it is comfortable on a cool evening.');
    // the white papers' market page: two Didot figures over hairlines, then a wide photograph
    stat(s, '51%', 'Net share of residential architects seeing rising client interest in outdoor living areas and rooms (more firms seeing it rise than fall), up from 40% a year earlier.', M, 1.95, 5.75, { size: 66, h: 1.05, lh: 1.0, ls: 13 });
    stat(s, '16%', 'Heated exterior space rose too, from 12% to 16%.', 6.98, 1.95, 5.75, { size: 66, h: 1.05, lh: 1.0, ls: 13 });
    pic(s, 'l-009-061', M, 4.3, W - 2 * M, 2.25);
    cap(s, 'Source: AIA Home Design Trends Survey, Q2 2026. Net figures: firms seeing interest rise, less those seeing it fall.', M, 6.6, 12.1, { fontSize: 10, h: 0.25 });
  }

  {
    const s = L.content('Why Heat The Outdoors', 'Applications', 'Heat Opens Spaces You Already Have',
      'Outdoor space adds usable square footage without the cost of building enclosed space, but only if it is comfortable. Walk the six tiles. Homes: a longer entertaining season. Rooftops and amenities: shared space residents and tenants use all year. Restaurants and hotels: guests stay longer and spend more per visit. Entries and valet: places people pass through become places they wait in comfort. Workplaces: outdoor work and meeting space supports return to the office. Venues and marine: stadiums, golf, theatres, decks and yachts. Ask: which of these is on your boards?');
    // a gallery: one large picture and five smaller, each captioned in Didot under its hairline
    const G = [['l-010-071', 'Homes'], ['w-eclipse-1200pole-industrial-1', 'Rooftops And Amenities'], ['w-platinum-electric-javiers-crystal-cove-newpo', 'Restaurants And Hotels'],
      ['w-bromic-ambiente-sedona-17', 'Entries And Valet'], ['w-boardwalk-edits-49', 'Workplaces'], ['w-tungsten-500-top-golf-monterrey', 'Venues And Marine']];
    const lab = (t, x, y, w, i) => { num(s, i + 1, x, y, { size: 13, h: 0.3, w: 0.4 }); H1(s, t, { x: x + 0.42, y: y - 0.02, w: w - 0.42, h: 0.34, fontSize: 15 }); };
    pic(s, G[0][0], M, 1.85, 4.6, 4.15); lab(G[0][1], M, 6.08, 4.6, 0);
    const sw = (W - M - 5.5 - 0.5) / 3, sh = 1.85;
    G.slice(1).forEach(([img, t], k) => {
      const i = k + 1, col = k < 2 ? k : k - 2, row = k < 2 ? 0 : 1;
      const w2 = row === 0 ? (sw * 3 + 0.5 - 0.25) / 2 : sw, x = 5.5 + col * (w2 + 0.25), y = 1.85 + row * 2.3;
      pic(s, img, x, y, w2, sh); lab(t, x, y + sh + 0.08, w2, i);
    });
  }

  L.statement({ section: 'Why Heat The Outdoors', kicker: 'The Planning Gap', line: 'Only *23%* Of Homeowners Rank Heating A Top Priority When They Plan An Outdoor Space',
    img: 'l-001-000',
    notes: 'Source: survey of 2,000+ US homeowners by Atomik Research, commissioned by Bromic Heating, released February 2026. 23% ranked heating a top planning priority, while 67% said heating would have the biggest effect on extending their outdoor use. That gap is the architect\'s opportunity: heat is easy to plan on paper and expensive to add after the ceiling is closed.' });

  // ---------- Part 2 Heat and fuel ----------
  L.divider({ n: '02', title: 'Heat And Fuel', section: 'Heat And Fuel', img: 'w-p1021449-hdr-denoiseai-low-light',
    line: 'How heat travels, why infrared wins outdoors, and which fuel suits which site.',
    notes: 'Part two, about fifteen minutes: heating technologies and fuel sources, with two exercises and a knowledge check.' });

  {
    const s = L.content('Heat And Fuel', 'The Physics', 'Three Ways Heat Travels',
      'Convection heats the air, and outdoors the air moves away: the first breeze takes your heat with it, which is why forced-air heat does not work outside. Conduction moves heat through touch, like a warm bench or a heated floor; it is local and only works where people make contact. Radiant, or infrared, heat warms people and surfaces directly, like the sun on a cold day: instant, silent, no air movement needed. That is why infrared is the standard for open-air spaces.');
    const cols = [
      ['Convection', 'Heats the air. Air moves in a cycle, so it needs an enclosed room and is slow to warm people.', 'Outdoors: the wind takes it'],
      ['Conduction', 'Moves heat through direct contact: a warm bench, a heated floor. No air movement.', 'Outdoors: local and rare'],
      ['Radiant (Infrared)', 'Warms people and objects, not the air. Instant, direct, silent, like the sun on a cold day.', 'Outdoors: the standard'],
    ];
    const cw = (W - 2 * M - 2 * 0.3) / 3;
    cols.forEach(([h, b, v], i) => {
      const x = M + i * (cw + 0.3), last = i === 2, ink = last ? HEX.WHITE : HEX.INK, st = last ? 'B9B5B0' : HEX.STEEL;
      if (last) rect(s, x, 1.85, cw, 4.9, HEX.INK, { name: 'ink-panel' }); else rule(s, x, 1.85, cw, HEX.INK);
      // a small diagram of each: drawn, not an icon
      const dx = x + 0.35, dy = 2.15, dw = cw - 0.7, fl = dy + 1.15;
      ln(s, dx, fl, dw, 0, st, 1.25);
      if (i === 0) { rect(s, dx + 0.2, fl - 0.18, 0.6, 0.18, ink, { name: 'heater' });
        [0.35, 0.6].forEach((o, j) => { seg(s, dx + o, fl - 0.25, dx + o, fl - 0.95 + j * 0.2); seg(s, dx + o, fl - 0.95 + j * 0.2, dx + o + 1.6, fl - 0.95 + j * 0.2, HEX.FLAME, 1.25, { arrow: true }); });
        T(s, 'WIND', { x: dx + 2.1, y: fl - 1.05, w: 1, h: 0.25, fontSize: 9, bold: true, color: st, charSpacing: 3 }); }
      if (i === 1) { rect(s, dx + 0.6, fl - 0.42, 1.9, 0.08, ink, { name: 'bench' }); rect(s, dx + 0.75, fl - 0.34, 0.06, 0.34, ink, { name: 'leg' }); rect(s, dx + 2.3, fl - 0.34, 0.06, 0.34, ink, { name: 'leg' });
        rect(s, dx + 0.6, fl - 0.5, 1.9, 0.05, HEX.FLAME, { name: 'warm-surface' }); }
      if (i === 2) { rect(s, dx + 1.1, dy, 1.3, 0.14, ink, { name: 'heater' }); rect(s, dx + 1.18, dy + 0.14, 1.14, 0.04, HEX.FLAME, { name: 'glow' });
        [-0.9, -0.45, 0, 0.45, 0.9].forEach((o) => seg(s, dx + 1.75 + o * 0.3, dy + 0.26, dx + 1.75 + o * 1.1, dy + 0.95, HEX.FLAME, 1.25, { arrow: true }));
        rect(s, dx + 0.7, fl - 0.08, 2.1, 0.08, 'E6E2DE', { name: 'table' }); }
      H1(s, h, { x: x + (last ? 0.35 : 0), y: 3.55, w: cw - 0.5, h: 0.6, fontSize: 26, color: ink });
      T(s, b, { x: x + (last ? 0.35 : 0), y: 4.25, w: cw - 0.6, h: 1.5, fontSize: 15, color: last ? 'E6E2DE' : HEX.BODY });
      rule(s, x + (last ? 0.35 : 0), 5.95, cw - (last ? 0.7 : 0.2), last ? '5A5556' : HEX.LINE, 0.75);
      T(s, v, { x: x + (last ? 0.35 : 0), y: 6.05, w: cw - 0.6, h: 0.45, fontSize: 15, bold: true, color: HEX.FLAME });
    });
  }

  {
    const s = L.content('Heat And Fuel', 'Infrared Wavelengths', 'Not All Infrared Is The Same',
      'Infrared heaters differ by the wavelength they emit. Long wave runs at low temperature with almost no glow, but takes about five minutes to warm up and is the least efficient. Medium wave shows a dull red glow and warms in about 30 seconds. Short wave runs hottest with a sharp red glow, is instant, and is the most efficient. Direct heat mixes short and medium wave for the highest efficiency; indirect heat mixes medium and long wave. Open flames lose much of their heat to the air by convection, so fire features feel warm close up and fade fast. Efficiency figures are the comparative values used in this course; individual heaters vary.');
    const TB = [['', 'Long Wave', 'Medium Wave', 'Short Wave'], ['Temperature', 'Low', 'Medium', 'High'], ['Visible light', 'Minimal', 'Dull red', 'Sharp red'],
      ['Warm-up time', 'About 5 minutes', 'About 30 seconds', 'Instant'], ['Efficiency', '40%', '60%', '80%']];
    ftable(s, TB, { x: M, y: 1.95, w: 7.7, colW: [1.85, 1.95, 1.95, 1.95], rowH: 0.6, size: 15, head: [HEX.INK, HEX.INK, HEX.INK, HEX.FLAME], steelFirst: true, boldFirst: true });
    fbar(s, M, 5.3, 1.0);
    T(s, 'Direct heat mixes short and medium wave. Indirect heat mixes medium and long wave, and loses more to the air.', { x: M + 0.25, y: 5.3, w: 7.3, h: 1.0, fontSize: 18, fontFace: 'Bodoni MT', color: HEX.INK, valign: 'middle' });
    bleed(s, 'w-bromic-eclipse-pendant-light', 8.95);
  }

  const ex1 = L.exercise({ section: 'Heat And Fuel', n: 1, minutes: 4, title: 'Feel The Wavelength',
    task: 'Match long, medium and short wave to the three spaces. There is a best fit for each.',
    steps: ['Look at how people use each space: passing through, sitting for hours, or both.', 'Weigh warm-up time, glow and efficiency from the table.', 'Pair up, agree an answer, and be ready to say why.'],
    img: WASH,
    notes: 'Run it: two minutes in pairs, two minutes debrief. Suggested answers. A, the valet entry: short wave. People arrive and wait for minutes, so instant heat matters most and the glow is part of the welcome. B, the covered porch: medium wave. Quick 30-second warm-up, a soft glow that does not glare across a dining table, and wide, even comfort for long evenings. C, the glazed winter room: long wave. The air is still and enclosed, people stay for hours, and almost no visible light suits an interior-style room. Debrief: the right wavelength follows how long people stay and how much glow the design can take.' });
  // three tall photographs side by side, each lettered, captioned underneath
  [['w-bromic-ambiente-sedona-17', 'Hotel valet entry'], ['w-connecticut-privateresidence-tungstenelectri-2', 'Covered dining porch'], ['w-tungsten-3', 'Glazed winter room']].forEach(([id, t], i) => {
    const w = (FR.w - 0.3) / 3, x = FR.x + i * (w + 0.15);
    pic(ex1, id, x, FR.y, w, 4.35); tag(ex1, String.fromCharCode(65 + i), x, FR.y);
    rule(ex1, x, FR.y + 4.45, w, HEX.INK); H1(ex1, t, { x, y: FR.y + 4.5, w, h: 0.4, fontSize: 14 });
  });

  L.quiz({ section: 'Heat And Fuel', n: 1, q: 'A Breeze Crosses The Terrace. Which Heat Still Reaches The Diners?',
    options: ['Warm air from a forced-air heater', 'Infrared from a radiant heater above the table', 'Warm air rising from a fire pit', 'A heated floor two tables away'],
    answer: 1, why: 'Radiant heat travels as infrared and warms people and surfaces directly, so moving air does not carry it away. Forced air and the convective heat from a fire pit blow downwind; a heated floor only warms what touches it.' });

  {
    const s = L.content('Heat And Fuel', 'Fuel Sources', 'Three Fuels, Three Kinds Of Site',
      'Gas heaters give high output, so fewer heaters cover a large space, and natural gas is the cheapest to run once plumbed. But gas needs larger clearances and ventilation, cannot be recessed, and offers simpler controls with no dimming. Propane frees you from a gas line and suits sites with no structure, but tanks must be changed, it is the most expensive to run, and some jurisdictions restrict it. Electric suits enclosed and semi-enclosed spaces: no on-site emissions, recessing, dimming and the widest control options, with few moving parts. The trade-off is panel capacity: each heater needs a dedicated circuit, and large open areas need more heaters.');
    const cols = [
      ['gas', 'Natural Gas', 'Large spaces and high ceilings. Plumbed to the building, high output, lowest running cost.', 'A gas line to every position, larger clearances, ventilation. No recessing or dimming.'],
      ['heater-freestanding', 'Propane', 'Sites with no structure or gas line. Freestanding and flexible.', 'Tanks to change, the highest running cost, and local restrictions in some cities.'],
      ['electric', 'Electric', 'Enclosed and semi-enclosed spaces, low ceilings, recessed designs. No on-site emissions, dimmable.', 'Panel capacity and a dedicated circuit per heater. More heaters for large open areas.'],
    ];
    // a comparison table: the fuels across, best for and watch for down, each fuel with its drawn mark
    const lw = 1.7, cw = (W - 2 * M - lw) / 3;
    cols.forEach(([icn, h], i) => { const x = M + lw + i * cw; icon(s, icn, x + 0.12, 1.85, 0.62); });
    ftable(s, [['', ...cols.map((c) => c[1])], ['Best for', ...cols.map((c) => c[2])], ['Watch for', ...cols.map((c) => c[3])]],
      { x: M, y: 2.6, w: W - 2 * M, colW: [lw, cw, cw, cw], rowH: [0.6, 1.55, 1.55], size: 15, steelFirst: true, boldFirst: true });
  }

  const ex2 = L.exercise({ section: 'Heat And Fuel', n: 2, minutes: 5, title: 'Fuel Match',
    task: 'Choose a fuel for each project, and name the one thing you would check first.',
    steps: ['A: a city rooftop bar. B: a beach house porch. C: a mountain lodge terrace.', 'Pick natural gas, propane or electric for each.', 'Name your first check: structure, supply, code, or climate.'],
    img: WASH,
    notes: 'Run it: three minutes at the tables, two minutes debrief. There is more than one defensible answer; the reasoning is the point. A, rooftop bar: usually electric. No tanks to carry up or store on a roof, no flue, and many jurisdictions restrict propane on roofs; first check panel capacity and the structure for mounting. B, beach house porch: electric, recessed or surface mounted in the porch ceiling, with corrosion-resistant finishes and fixings by the sea; first check salt exposure and clearances. C, mountain lodge: natural gas where a line exists, for high output under tall ceilings in cold air, or high-output electric; first check ambient temperature, wind exposure and how open the terrace is. Ask who chose propane and why: it is right where there is no structure or supply.' });
  // three projects as a strip of wide photographs, each with its Didot letter and name beside it
  [['w-eclipse-1200pole-industrial-1', 'City rooftop bar'], ['l-002-006', 'Beach house porch'], ['l-007-037', 'Mountain lodge terrace']].forEach(([id, t], i) => {
    const h = (FR.h - 0.3) / 3, y = FR.y + i * (h + 0.15);
    pic(ex2, id, FR.x, y, 3.3, h);
    rule(ex2, FR.x + 3.5, y, FR.w - 3.5, HEX.INK);
    H1(ex2, String.fromCharCode(65 + i), { x: FR.x + 3.5, y: y + 0.08, w: 0.8, h: 0.75, fontSize: 40, color: HEX.FLAME });
    H1(ex2, t, { x: FR.x + 3.5, y: y + 0.82, w: FR.w - 3.5, h: 0.6, fontSize: 16 });
  });

  // ---------- Part 3 Specify and place ----------
  L.divider({ n: '03', title: 'Specify And Place', section: 'Specify And Place', img: 'w-tungsten-electric-ceiling-mounted-chile',
    line: 'Site, comfort zones, height, mounting and clearances, then a design challenge.',
    notes: 'Part three, about twenty-five minutes, and the heart of the session: three exercises, a knowledge check and a ten-minute team design challenge.' });

  {
    const s = L.content('Specify And Place', 'Environmental Factors', 'What The Site Takes Away',
      'We all feel heat differently, and the site changes how much heat reaches people. Colder ambient air shrinks the comfortable area around each heater. Wind strips heat from people and surfaces and lowers efficiency. A roof, a wall or a screen holds warmth in, while an open terrace loses it. That is why the sizing rule divides by a site factor: take the heater maker\'s published coverage, multiply by 0.85 for a partly covered space on cool evenings, and divide the seating area by the result. Rough seating area: 20 square feet a seat.');
    const rows = [['cold', 'Ambient temperature', 'Colder air shrinks each heater\'s comfortable area.'],
      ['wind', 'Wind', 'Moving air strips heat from people and surfaces.'],
      ['covered-patio', 'How open the space is', 'A roof, wall or screen holds warmth; an open edge loses it.']];
    // three site factors, each with its mark beside a hairline
    rows.forEach(([icn, h, b], i) => {
      const y = 1.9 + i * 1.02;
      icon(s, icn, M, y + 0.12, 0.62);
      block(s, M + 0.85, y, 6.0, h, b, { ls: 19, lh: 0.42, bh: 0.4, bs: 14 });
    });
    rect(s, M, 5.05, 6.85, 1.7, HEX.INK, { name: 'ink-panel' });
    T(s, 'THE SIZING RULE', { x: M + 0.35, y: 5.25, w: 5.8, h: 0.3, fontSize: 10, bold: true, color: HEX.FLAME, charSpacing: 4 });
    H1(s, 'Heaters = area ÷ (coverage × 0.85)', { x: M + 0.35, y: 5.6, w: 6.3, h: 0.55, fontSize: 24, color: HEX.WHITE });
    T(s, 'Area: 20 ft² a seat  ·  0.85: partly covered, cool evenings', { x: M + 0.35, y: 6.22, w: 6.2, h: 0.35, fontSize: 13, color: 'D9D6D2' });
    pic(s, 'w-juneau-showhome-1', 7.85, 1.9, W - M - 7.85, 4.62, 'cover');
    cap(s, 'A deck in Juneau, Alaska: cold air and sea wind call for more output.', 7.85, 6.56, 5.2, { fontSize: 10, h: 0.22 });
  }

  L.exercise({ section: 'Specify And Place', n: 3, minutes: 3, title: 'Where Would You Sit?',
    task: 'It is a cold evening on this terrace. Choose the table you would ask for.',
    steps: ['Find every heater in the photo.', 'Pick your table: under a heater, between two, or at the rail.', 'Hands up for each choice, then we look at why.'],
    img: 'w-tungsten-electric-kansas-bar-grill-buenos-ai-3',
    notes: 'Run it: one minute to choose, then a quick show of hands for each zone. Most people pick a table inside the heaters\' reach and avoid the rail. Ask the few who chose the rail what they gave up. The point: people position themselves where they are most comfortable, so seats outside the heat stay empty and the client loses covers. The next slide names the three zones they just felt.' });

  {
    const s = L.content('Specify And Place', 'Comfort Zones', 'Dead, Single And Optimal Zones',
      'Here is the terrace you just chose from, as a plan. Where two heaters overlap, guests feel warm on every side: the optimal zone. Under one heater they feel warm on one side: the single-heater zone, fine for short stays. Outside every heater\'s reach is the dead zone, and seats there stay empty. Good placement puts the long-stay seats in the optimal zone and keeps tables out of the dead zone. The closer you are to a heater, the warmer you feel.');
    const zones = [['Optimal zone', 'Two heaters overlap: warm on every side. Put long-stay seats here.', HEX.FLAME, HEX.WHITE],
      ['Single-heater zone', 'One heater: warm on one side. Fine for short stays.', HEX.WASH, HEX.INK],
      ['Dead zone', 'Outside every heater\'s reach. Seats here stay empty.', HEX.GREY, HEX.INK]];
    // a legend: each zone headed by a bar in its own colour, as the plan draws it
    zones.forEach(([h, b, f], i) => {
      const y = 1.95 + i * 1.55;
      rect(s, M, y, 5.4, 0.09, f === HEX.GREY ? 'C9C9C6' : f, { name: 'zone-key' });
      H1(s, h, { x: M, y: y + 0.2, w: 5.4, h: 0.45, fontSize: 21 });
      T(s, b, { x: M, y: y + 0.7, w: 5.2, h: 0.7, fontSize: 14 });
    });
    // plan diagram
    const px = 6.55, py = 1.95, pw = 6.15, ph = 4.5;
    rect(s, px, py, pw, ph, HEX.WHITE, { line: HEX.INK, lw: 0.75 });
    rect(s, px, py, pw, 0.35, HEX.INK, { name: 'building' });
    T(s, 'BUILDING', { x: px + 0.2, y: py, w: 3, h: 0.35, fontSize: 11, bold: true, color: HEX.WHITE, valign: 'middle', charSpacing: 3 });
    const hx = [px + 1.75, px + 3.6];
    hx.forEach((x) => oval(s, x - 1.45, py + 0.55, 2.9, 2.6, HEX.FLAME, 55));
    hx.forEach((x) => { rect(s, x - 0.45, py + 1.75, 0.9, 0.14, HEX.INK, { name: 'heater' }); });
    // seats: tables as circles
    [[px + 1.0, py + 1.4], [px + 2.67, py + 1.25], [px + 2.67, py + 2.35], [px + 4.4, py + 1.5], [px + 1.4, py + 3.6], [px + 3.4, py + 3.65], [px + 5.3, py + 2.8], [px + 5.35, py + 3.85]].forEach(([x, y]) => {
      oval(s, x - 0.2, y - 0.2, 0.4, 0.4, HEX.WHITE, 0, HEX.STEEL);
    });
    T(s, 'Optimal', { x: px + 2.2, y: py + 0.62, w: 1, h: 0.3, fontSize: 12, bold: true, color: HEX.INK, align: 'center' });
    T(s, 'Single', { x: px + 0.35, y: py + 2.45, w: 1, h: 0.3, fontSize: 12, bold: true, color: HEX.INK });
    T(s, 'Dead zone', { x: px + 4.45, y: py + 4.12, w: 1.5, h: 0.3, fontSize: 12, bold: true, color: HEX.STEEL, align: 'right' });
    T(s, 'RAIL', { x: px + 0.2, y: py + ph - 0.32, w: 2, h: 0.28, fontSize: 11, bold: true, color: HEX.STEEL, charSpacing: 3 });
    ln(s, px, py + ph, pw, 0, HEX.STEEL, 2.5, { dash: 'dash' });
    cap(s, 'Plan, not to scale. Heaters shown as dark bars.', px, 6.5, pw, { fontSize: 11, h: 0.25 });
  }

  {
    const s = L.content('Specify And Place', 'The Inverse Square Law', 'Twice The Height, A Quarter Of The Heat',
      'The inverse square law says intensity falls with the square of the distance from the source, for heat as for light. Take a heater whose recommended height is 8 feet. Raise it to 9 feet and about 21% less heat reaches the seat; at 10 feet, 36% less; at 12 feet, 56% less; at 15 feet, 72% less. These are theoretical values from (8 ÷ height) squared and ignore wind and temperature. Note for presenters: the earlier version of this course showed 76% at 15 feet; the arithmetic gives 72%. Moral: mount within the maker\'s recommended height range, and choose higher-output heaters for tall ceilings rather than more of the same.');
    T(s, 'Heat at the seat falls with the square of the distance from the heater.', { x: M, y: 1.95, w: 4.9, h: 1.0, fontSize: 20, color: HEX.INK, fontFace: 'Bodoni MT' });
    s.addText([{ text: 'Heat at seat', options: { bold: true, color: HEX.INK, breakLine: true } }, { text: '= (recommended height ÷ actual height)²', options: { color: HEX.BODY } }], { x: M, y: 3.05, w: 4.9, h: 0.7, fontSize: 15, fontFace: 'Arial', margin: 0, valign: 'top' });
    stat(s, '28%', 'A heater rated for 8 ft, mounted at 15 ft, delivers about 28% of its heat to the seat.', M, 4.05, 4.9, { size: 64, h: 1.05, lh: 0.8, ls: 14 });
    cap(s, 'Theoretical values; wind and temperature not included.', M, 6.45, 4.9, { fontSize: 10, h: 0.25 });
    // the curve drawn as heaters at five heights over one seat: each bar is the heat that arrives
    const bx = 6.2, base = 6.25, top = 2.35, bw = 0.62, gap = (W - M - bx - 5 * bw) / 4;
    T(s, 'HEAT REACHING THE SEAT, HEATER RATED FOR 8 FT', { x: bx, y: 1.95, w: 6.5, h: 0.28, fontSize: 9.5, bold: true, color: HEX.STEEL, charSpacing: 3 });
    [['8 ft', 100], ['9 ft', 79], ['10 ft', 64], ['12 ft', 44], ['15 ft', 28]].forEach(([h, v], i) => {
      const x = bx + i * (bw + gap), bh = (base - top - 0.55) * v / 100;
      rect(s, x, base - bh, bw, bh, i === 0 ? 'C9C9C6' : HEX.FLAME, { name: 'bar' });
      H1(s, v + '%', { x: x - 0.3, y: base - bh - 0.55, w: bw + 0.6, h: 0.5, fontSize: 22, align: 'center', color: HEX.INK });
      T(s, h, { x: x - 0.3, y: base + 0.1, w: bw + 0.6, h: 0.3, fontSize: 13, align: 'center', color: HEX.INK, bold: true });
    });
    rule(s, bx - 0.1, base, W - M - bx + 0.1, HEX.INK, 1);
  }

  L.quiz({ section: 'Specify And Place', n: 2, q: 'You Raise A Heater From 8 ft To 12 ft. How Much Heat Reaches The Seat?',
    options: ['About 90%', 'About two thirds', 'Under half', 'About a quarter'],
    answer: 2, why: '(8 ÷ 12)² = 0.44, so about 44% of the heat reaches the seat: a 56% loss. "About a quarter" is the answer for 15 ft (28%). Fix: mount within the recommended range, or choose a higher-output heater rated for the taller height.' });

  const ex4 = L.exercise({ section: 'Specify And Place', n: 4, minutes: 3, title: 'Spot The Heater',
    task: 'Name the mounting in each photo. Then say what the design gains from it.',
    steps: ['Choose from: recessed, surface (wall or ceiling), drop or pendant, freestanding.', 'Call out A to D as fast as you can.', 'For one photo, say why the designer chose it.'],
    img: WASH,
    notes: 'Run it fast, as a call-out. Answers: A, recessed: flush in the ceiling, heat you feel but barely see, using a recess kit for low clearances, ideal for new builds and retrofits. B, surface mounted on the wall: simple, aims heat at a table, works where there is no ceiling. C, drop or pendant on poles from the ceiling: brings the heater down to the right height under a tall or sloping ceiling and can add light. D, freestanding: no structure or wiring needed, moves with the furniture. Debrief: the right mounting gives the highest and best use of the space and keeps the design intact.' });
  // four photographs, each with only its letter: the room calls out the mounting
  [['w-platinum-electric-black-taol-2020'], ['w-tungsten-electric-studio-city-4'], ['w-eclipse-electric-24twin-pole-residential-sce'], ['w-strx-230222-bromic-dc-3']].forEach(([id], i) => {
    const w = (FR.w - 0.15) / 2, h = (FR.h - 0.15) / 2, x = FR.x + (i % 2) * (w + 0.15), y = FR.y + Math.floor(i / 2) * (h + 0.15);
    pic(ex4, id, x, y, w, h); tag(ex4, String.fromCharCode(65 + i), x, y);
  });

  // Fix the install: four small drawings
  {
    const s = L.exercise({ section: 'Specify And Place', n: 5, minutes: 4, title: 'Fix The Install',
      task: 'Four installs, four mistakes. Say what is wrong with each and how you would fix it.',
      steps: ['Work in pairs: one spots the fault, one proposes the fix.', 'Think about height, clearance, spacing and aim.', 'Two minutes, then we compare.'],
      img: WASH,
      notes: 'Run it: two minutes in pairs, two minutes debrief, then the next slide shows the rules. A, mounted at 15 ft over the seats: too high, the inverse square law takes about 72% of the heat; fix by dropping it on a pole or pendant into the recommended range, or choosing a higher-output heater. B, tight against a timber soffit: no clearance to combustibles above; fix with the maker\'s top clearance, or a recess kit rated for that ceiling. C, two heaters side by side at one end of a long table: crowded together, leaving the far end in a dead zone; fix by spacing them along the table at least the minimum distance apart so their coverage overlaps over the seats. D, heater on the back wall while the seats are at the rail 14 ft away: the seats sit in the dead zone; fix by moving heat over the seats with a ceiling mount or a pole, or adding a second row. These are real install fails: each one costs a client a retrofit.' });
    // four installs drawn like a manual's details: hairline frames, a Didot letter, flame for what is wrong
    const g = 0.15, w = (FR.w - g) / 2, h = (FR.h - g) / 2;
    const P = (i) => ({ x: FR.x + (i % 2) * (w + g), y: FR.y + Math.floor(i / 2) * (h + g) });
    const heater = (x, y, ww = 0.7) => { rect(s, x, y, ww, 0.13, HEX.INK, { name: 'heater' }); rect(s, x + 0.08, y + 0.13, ww - 0.16, 0.04, HEX.FLAME, { name: 'heater-glow' }); };
    for (let i = 0; i < 4; i++) { const p = P(i); rect(s, p.x, p.y, w, h, HEX.WHITE, { line: HEX.INK, lw: 0.75, name: 'detail-frame' }); H1(s, 'ABCD'[i], { x: p.x + 0.12, y: p.y + 0.04, w: 0.5, h: 0.5, fontSize: 24, color: HEX.FLAME }); }
    const floor = (p) => ln(s, p.x + 0.2, p.y + h - 0.35, w - 0.4, 0, HEX.INK, 1.5);
    // A: too high
    { const p = P(0); hatch(s, p.x + 0.7, p.y + 0.25, w - 0.9, 0.12); heater(p.x + 0.95, p.y + 0.42); floor(p); seat(s, p.x + 0.75, p.y + h - 0.82, HEX.STEEL);
      seg(s, p.x + 2.1, p.y + 0.6, p.x + 2.1, p.y + h - 0.38, HEX.FLAME, 1.25, { both: true }); T(s, '15 ft', { x: p.x + 2.15, y: p.y + 1.0, w: 0.45, h: 0.3, fontSize: 12, bold: true, color: HEX.FLAME }); }
    // B: tight to timber soffit
    { const p = P(1); hatch(s, p.x + 0.6, p.y + 0.25, w - 0.8, 0.22, 'B08A5E'); heater(p.x + 0.9, p.y + 0.47); floor(p); seat(s, p.x + 0.85, p.y + h - 0.82, HEX.STEEL);
      T(s, 'Timber soffit', { x: p.x + 0.6, y: p.y + 0.65, w: 1.4, h: 0.25, fontSize: 10, color: HEX.STEEL }); }
    // C: plan, two heaters bunched at one end of a long table
    { const p = P(2); rect(s, p.x + 0.3, p.y + 0.95, w - 0.6, 0.45, HEX.WHITE, { line: HEX.STEEL, lw: 1, name: 'table' });
      for (let k = 0; k < 6; k++) { rect(s, p.x + 0.42 + k * 0.33, p.y + 0.68, 0.2, 0.16, HEX.WHITE, { line: HEX.STEEL, lw: 0.75, name: 'chair' }); rect(s, p.x + 0.42 + k * 0.33, p.y + 1.51, 0.2, 0.16, HEX.WHITE, { line: HEX.STEEL, lw: 0.75, name: 'chair' }); }
      heater(p.x + 0.36, p.y + 1.1, 0.42); heater(p.x + 0.82, p.y + 1.1, 0.42); T(s, 'PLAN', { x: p.x + w - 0.8, y: p.y + 0.12, w: 0.65, h: 0.25, fontSize: 9, bold: true, color: HEX.STEEL, charSpacing: 3, align: 'right' }); }
    // D: back wall, seats at the rail
    { const p = P(3); rect(s, p.x + 0.2, p.y + 0.55, 0.1, h - 0.9, HEX.INK, { name: 'wall' }); heater(p.x + 0.3, p.y + 0.62, 0.5); floor(p);
      seat(s, p.x + w - 1.5, p.y + h - 0.82, HEX.STEEL); ln(s, p.x + w - 0.32, p.y + h - 1.15, 0, 0.8, HEX.INK, 1.5); T(s, 'Rail', { x: p.x + w - 0.75, y: p.y + h - 1.42, w: 0.5, h: 0.25, fontSize: 10, color: HEX.STEEL, align: 'right' });
      seg(s, p.x + 0.35, p.y + h - 0.22, p.x + w - 0.35, p.y + h - 0.22, HEX.FLAME, 1.25, { both: true });
      T(s, '14 ft', { x: p.x + 0.45, y: p.y + h - 0.6, w: 0.6, h: 0.25, fontSize: 11, bold: true, color: HEX.FLAME, align: 'center' }); }
  }

  {
    const s = L.content('Specify And Place', 'Clearances', 'Clearances Keep Heat Where You Want It',
      'Mounting within the maker\'s clearances protects the building and ensures the heater delivers its coverage. The figures shown are typical for electric infrared heaters; always take the numbers from the manual for the heater you specify and check with the local authority having jurisdiction. Gas heaters need more: they cannot be recessed, need larger clearances to combustibles above, and need fresh air. A common rule in gas heater manuals: with a roof and more than two walls, at least 25% of the total wall area must be fully open, plus 30% of the rest. Electric heaters follow NFPA 70 (NEC); gas heaters ANSI Z223.1/NFPA 54. Installation by a licensed electrician or gas fitter.');
    // elevation, drawn like a manual: hatched ceiling, heaters on drop rods, flame dimension lines
    const dx = M, dy = 1.95, dw = 6.6, dh = 4.75;
    hatch(s, dx + 0.3, dy + 0.3, dw - 0.6, 0.2);
    T(s, 'CEILING', { x: dx + 0.3, y: dy + 0.02, w: 1.5, h: 0.25, fontSize: 9, bold: true, color: HEX.STEEL, charSpacing: 3 });
    const hy = dy + 0.95;
    const heater = (x) => { ln(s, x + 0.7, dy + 0.5, 0, 0.45, HEX.INK, 1.5); rect(s, x, hy, 1.4, 0.18, HEX.INK, { name: 'heater' }); rect(s, x + 0.12, hy + 0.18, 1.16, 0.05, HEX.FLAME, { name: 'heater-glow' }); };
    heater(dx + 0.7); heater(dx + 3.1);
    seg(s, dx + 2.12, hy + 0.09, dx + 3.08, hy + 0.09, HEX.FLAME, 1.25, { both: true });
    T(s, '20 in apart', { x: dx + 2.0, y: hy - 0.32, w: 1.2, h: 0.28, fontSize: 12, bold: true, color: HEX.FLAME, align: 'center' });
    seg(s, dx + 4.75, dy + 0.52, dx + 4.75, hy - 0.02, HEX.FLAME, 1.25, { both: true });
    ln(s, dx + 4.5, hy, 0.4, 0, HEX.STEEL, 0.5);
    T(s, '12 in to ceiling', { x: dx + 4.85, y: dy + 0.58, w: 1.5, h: 0.28, fontSize: 12, bold: true, color: HEX.FLAME });
    seg(s, dx + 1.4, hy + 0.25, dx + 1.4, hy + 1.35, HEX.FLAME, 1.25, { both: true });
    T(s, '3 ft face to combustibles', { x: dx + 1.5, y: hy + 0.65, w: 2.4, h: 0.28, fontSize: 12, bold: true, color: HEX.FLAME });
    ln(s, dx + 0.3, dy + dh - 0.4, dw - 0.6, 0, HEX.INK, 1.5);
    T(s, 'FLOOR', { x: dx + 0.3, y: dy + dh - 0.33, w: 1.5, h: 0.25, fontSize: 9, bold: true, color: HEX.STEEL, charSpacing: 3 });
    seg(s, dx + 5.9, hy + 0.2, dx + 5.9, dy + dh - 0.42, HEX.INK, 1.25, { both: true });
    ln(s, dx + 4.55, hy + 0.18, 1.5, 0, HEX.STEEL, 0.5, { dash: 'dash' });
    T(s, 'Ceiling mount 8 ft min', { x: dx + 3.75, y: dy + 3.0, w: 2.05, h: 0.3, fontSize: 12, bold: true, color: HEX.INK, align: 'right' });
    T(s, 'Wall mount 6 ft min', { x: dx + 3.75, y: dy + 3.32, w: 2.05, h: 0.3, fontSize: 12, color: HEX.BODY, align: 'right' });
    seat(s, dx + 1.0, dy + dh - 0.87, HEX.STEEL);
    // right: the rule of the drawing, then the ink panel for gas
    const rx = 7.75;
    rule(s, rx, 1.95, W - M - rx, HEX.FLAME, 1.5);
    H1(s, 'Typical electric infrared figures. Take yours from the manual.', { x: rx, y: 2.1, w: W - M - rx, h: 0.9, fontSize: 19 });
    rect(s, rx, 3.25, W - M - rx, 3.45, HEX.INK, { name: 'ink-panel' });
    icon(s, 'gas', rx + 0.35, 3.5, 0.6, { dark: true });
    H1(s, 'Gas Needs More', { x: rx + 1.15, y: 3.55, w: 3.5, h: 0.5, fontSize: 24, color: HEX.WHITE, valign: 'middle' });
    ['Never recessed', 'Larger clearance to combustibles above', 'Fresh air: with a roof and more than two walls, at least 25% of the wall area fully open, plus 30% of the rest'].forEach((t, i) => {
      const y = 4.35 + i * 0.6; rule(s, rx + 0.35, y, W - M - rx - 0.7, '5A5556', 0.5);
      T(s, t, { x: rx + 0.35, y: y + 0.08, w: W - M - rx - 0.7, h: i === 2 ? 0.95 : 0.45, fontSize: 14, color: 'E6E2DE' });
    });
  }

  // Heat-map design challenge
  const PLAN = { ft: 0.125 };
  const drawPlan = (s, x, y, withHeat) => {
    const f = PLAN.ft, pw = 40 * f, ph = 20 * f;
    rect(s, x, y - 0.4, pw, 0.4, HEX.INK, { name: 'building' });
    T(s, 'BUILDING  ·  DOORS', { x: x + 0.15, y: y - 0.4, w: 3.5, h: 0.4, fontSize: 11, bold: true, color: HEX.WHITE, valign: 'middle', charSpacing: 3 });
    rect(s, x, y, pw, ph, HEX.WHITE, { line: HEX.INK, lw: 1, name: 'terrace' });
    for (let b = 1; b <= 3; b++) ln(s, x, y + (ph * b) / 4, pw, 0, 'D9D6D2', 0.75, { dash: 'dash' });
    if (withHeat) {
      [20 / 3, 20, 100 / 3].forEach((cx) => [5, 15].forEach((cy) => oval(s, x + (cx - 7.6) * f, y + (cy - 5.9) * f, 15.2 * f, 11.8 * f, HEX.FLAME, 62)));
    }
    [4, 12, 20, 28, 36].forEach((cx) => [5, 15].forEach((cy) => {
      const X = x + cx * f, Y = y + cy * f;
      [[-1.9, 0], [1.9, 0], [0, -1.9], [0, 1.9]].forEach(([ox, oy]) => oval(s, X + ox * f - 0.06, Y + oy * f - 0.06, 0.12, 0.12, HEX.STEEL));
      oval(s, X - 0.17, Y - 0.17, 0.34, 0.34, HEX.WHITE, 0, HEX.STEEL);
    }));
    if (withHeat) {
      [20 / 3, 20, 100 / 3].forEach((cx, zi) => {
        [5, 15].forEach((cy) => { rect(s, x + cx * f - 0.3, y + (cy + (cy === 5 ? -2.6 : 2.6)) * f - 0.05, 0.6, 0.11, HEX.INK, { name: 'heater' }); });
        T(s, `ZONE ${zi + 1}`, { x: x + cx * f - 0.6, y: y + ph + 0.08, w: 1.2, h: 0.25, fontSize: 11, bold: true, color: HEX.FLAME, align: 'center', charSpacing: 2 });
      });
    } else {
      T(s, '40 ft', { x, y: y + ph + 0.05, w: pw, h: 0.28, fontSize: 12, bold: true, color: HEX.INK, align: 'center' });
    }
    T(s, '20 ft', { x: x + pw + 0.05, y: y + ph / 2 - 0.15, w: 0.5, h: 0.3, fontSize: 12, bold: true, color: HEX.INK });
    T(s, 'Open on three sides', { x, y: y + ph + 0.35, w: pw, h: 0.28, fontSize: 11, color: HEX.STEEL, align: 'center' });
  };

  {
    const s = L.exercise({ section: 'Specify And Place', n: 6, minutes: 10, title: 'Heat-Map This Plan',
      task: 'Teams of four: heat this 40-seat terrace so every seat is comfortable on a cool evening.',
      steps: ['Work out the seating area: 20 ft² a seat.', 'Size it: area ÷ (coverage × 0.85). Use a 6 kW electric infrared heater the maker rates for 160 ft², mounted 8–12 ft.', 'Sketch heater positions and coverage. No seat in a dead zone.', 'Group heaters into zones and mark the controls.'],
      img: WASH,
      notes: 'The main event. Hand out printed plans or have teams sketch on paper. Ten minutes: two to size, five to place, three to zone. Walk the room and prompt: where is your dead zone? Which tables are long-stay? Where does the electrician run the circuits? The site: a 40 by 20 foot terrace off a restaurant, ten tables of four, a pergola roof with beams at 10 feet clear, open on three sides. Givens: 20 square feet a seat; 160 square feet coverage per 6 kW heater; 0.85 for partly covered on cool evenings. Ask two teams to present before you show the worked answer.' });
    T(s, 'PLAN  ·  PERGOLA, BEAMS AT 10 FT', { x: 7.6, y: 1.95, w: 5.0, h: 0.3, fontSize: 9.5, bold: true, color: HEX.STEEL, charSpacing: 3 });
    drawPlan(s, 7.6, 2.85, false);
    rule(s, 7.6, 6.15, 5.0, HEX.INK);
    H1(s, '10 tables of 4  ·  40 seats', { x: 7.6, y: 6.22, w: 5.0, h: 0.4, fontSize: 17 });
  }

  {
    const s = L.content('Specify And Place', 'Heat-Map: A Worked Answer', 'Six Heaters, Three Zones',
      'Walk the arithmetic. 40 seats at 20 square feet is 800 square feet. Each heater covers 160 square feet; on a partly covered terrace on cool evenings we count 85% of that, 136. 800 divided by 136 is 5.9, so round up to six. Place them in two rows of three on the beams at 10 feet, inside the 8 to 12 foot range, angled toward the tables so the coverage overlaps over every seat: no table in a dead zone. Group them as three zones of two so the restaurant heats only the part in use. Each 6 kW heater draws 25 A at 240 V (6,000 W ÷ 240 V), so each gets a dedicated circuit; show controls by the door. If a lower-output heater is chosen, the same rule gives more heaters: at 143 square feet, seven. Ask teams how close they came, and what they did differently.');
    const rows = [['40 seats × 20 ft²', '= 800 ft²'], ['800 ÷ (160 × 0.85)', '= 5.9'], ['Round up', '= 6 heaters']];
    // the sum as a worked column: each line under a hairline, the result in flame Didot
    rows.forEach(([a, b], i) => {
      const y = 1.95 + i * 0.7;
      rule(s, M, y, 6.0, i === 0 ? HEX.INK : HEX.LINE, 0.75);
      T(s, a, { x: M, y: y + 0.05, w: 3.4, h: 0.6, fontSize: 17, color: HEX.INK, valign: 'middle' });
      H1(s, b, { x: M + 3.4, y: y + 0.03, w: 2.6, h: 0.6, fontSize: i === 2 ? 28 : 24, color: HEX.FLAME, valign: 'middle', align: 'right' });
    });
    rule(s, M, 4.05, 6.0, HEX.INK, 0.75);
    ['Two rows of three on the beams at 10 ft, angled to the tables', 'Coverage overlaps over every seat: no dead zone', 'Three zones of two, controls by the door', 'A dedicated circuit per heater: 25 A at 240 V'].forEach((t, i) => {
      const y = 4.3 + i * 0.6; num(s, i + 1, M, y - 0.02, { size: 16, h: 0.35, w: 0.5 });
      T(s, t, { x: M + 0.55, y, w: 5.45, h: 0.5, fontSize: 14, color: HEX.INK });
    });
    T(s, 'PLAN  ·  WORKED ANSWER', { x: 7.35, y: 1.95, w: 5.0, h: 0.3, fontSize: 9.5, bold: true, color: HEX.STEEL, charSpacing: 3 });
    drawPlan(s, 7.35, 2.85, true);
  }

  // ---------- Part 4 Where heating is going ----------
  L.divider({ n: '04', title: 'Where Heating Is Going', section: 'Where Heating Is Going', img: 'w-slc-bromic-heater-1-cropped',
    line: 'Electrification, zones, smart controls, and heat and light in one fixture.',
    notes: 'Part four, about five minutes: the trends shaping what you will specify over the next few years.' });

  {
    const s = L.content('Where Heating Is Going', 'Future Trends', 'Electric, Zoned And Connected',
      'Four trends. Electrification: regulations and policy shifts in major metro areas are moving new projects away from on-site combustion, including propane restrictions, so plan panel capacity early. Zoning: heat only the areas in use, in homes and in commercial projects; zoned, directional heating saves energy. Smart controls: schedules, timers, app control, multi-user management and integration with building and home systems, which also supports code-compliant efficiency. Heat and light in one: fixtures that combine a heater and a light solve two problems with one ceiling position.');
    const cards4 = [['electric', 'Electrification', 'Cities are moving away from on-site combustion. Plan panel capacity early.'],
      ['zones', 'Zones', 'Heat only the areas in use. Directional heat saves energy.'],
      ['app', 'Smart Controls', 'Schedules, apps, multi-user access and building systems.'],
      ['heater-eclipse', 'Heat And Light In One', 'One fixture, one ceiling position, two jobs done.']];
    // four trends in a 2 × 2 under hairlines, each with its mark; the photograph bled off the right
    const cw = 3.2, chh = 2.45;
    cards4.forEach(([icn, h, b], i) => {
      const x = M + (i % 2) * (cw + 0.35), y = 1.95 + Math.floor(i / 2) * chh;
      rule(s, x, y, cw, HEX.INK);
      icon(s, icn, x, y + 0.2, 0.6);
      H1(s, h, { x, y: y + 0.9, w: cw, h: 0.45, fontSize: 20 });
      T(s, b, { x, y: y + 1.38, w: cw - 0.1, h: 0.85, fontSize: 14 });
    });
    bleed(s, 'w-e57caf05-21e4-4f53-9114-170c5861aec4', 7.85);
  }

  {
    const s = L.content('Where Heating Is Going', 'Specify Early', 'Plan The Heat With The Building',
      'Specifying heat early keeps the design intact: heaters sit where the ceiling, beams and lighting plan expect them, recess cavities and blocking are built in, and circuits or gas lines run before finishes go on. A retrofit means opening ceilings, surface conduit and compromises. Early heat also adds value: the space works from day one. Use manufacturer design services: most heater makers will lay out heater selection, placement and coverage from your plans or photos, which takes work off your plate and gives you and your client options.');
    const r = [['Design integrity', 'Heaters sit where the ceiling and lighting plan expect them.'],
      ['No costly retrofit', 'Cavities, blocking and circuits go in before the finishes.'],
      ['Value from day one', 'The outdoor room works in every season.'],
      ['Use design services', 'Ask the maker for a heat plan from your drawings.']];
    // a framed photograph on the left this time; four reasons as numbered lines on the right
    pic(s, 'w-residential-us-pavillion-du-lac-1', M, 1.95, 5.6, 4.75);
    r.forEach(([h, b], i) => {
      const y = 1.95 + i * 1.2, x = 6.75, w = W - M - x, last = i === 3;
      if (last) rect(s, x, y, w, 1.05, HEX.WASH, { name: 'action-box' }); else rule(s, x, y, w, HEX.INK);
      num(s, i + 1, x + (last ? 0.25 : 0), y + 0.1, { size: 26, h: 0.55, w: 0.8 });
      H1(s, h, { x: x + 0.95, y: y + 0.12, w: w - 1.1, h: 0.42, fontSize: 20 });
      T(s, b, { x: x + 0.95, y: y + 0.55, w: w - 1.1, h: 0.45, fontSize: 14 });
    });
  }

  {
    const s = L.closing({ section: 'Close', title: 'Specify *Early*',
      points: ['Heater positions, mounting heights and coverage on the RCP', 'A circuit or gas line, and controls, for every zone', 'Blocking, recess cavities and clearances in the sections'],
      img: 'w-bromicatria23',
      notes: 'Close the CE portion here. Three things for their next set of drawings. One: heater positions, mounting heights and coverage on the reflected ceiling plan. Two: a dedicated circuit or gas line, and the control location, for each zone on the power plan. Three: blocking, recess cavities and clearances in the sections and details. Recap the objectives in one breath: value, technologies, fuel, placement, trends.',
      next: 'Ask for a heat plan before design development closes.' });
    T(s, 'Three things to put on your drawings next week.', { x: M, y: 2.6, w: 6.2, h: 0.4, fontSize: 15, color: 'B9B5B0' });
  }

  L.statement({ section: 'Close', kicker: 'Thank You', line: 'Questions', img: 'l-013-110',
    notes: 'Open the floor. Remind attendees that attendance will be reported to AIA/CES and that certificates of completion follow. Once CE questions are done, the session has ended; product questions can be taken with the short appendix that follows.' });

  // ---------- Appendix: About Bromic (after the CE hour) ----------
  plainDivider({ kicker: 'Appendix  ·  After the session', big: 'A', title: 'About Bromic', section: 'About Bromic', img: 'l-006-028',
    line: 'The CE hour has ended. A short look at the range, for anyone with product questions.',
    notes: 'Make the break clear: the CE course is complete. This appendix is optional and only for attendees who want product information.' });

  {
    const s = L.content('About Bromic', 'The Range', 'One Family For Every Outdoor Room',
      'Three families. Tungsten Smart-Heat Electric Series II: Classic, Select and Coastal; Classic and Select give the same heat coverage, so the choice is about the look. Select and Coastal launched in October 2026, Classic follows in January 2027. Single post, no visible junction box, IPX5, and a low-clearance recess kit for a 7.5 inch cavity. Platinum Smart-Heat Electric: the slim architectural option with minimal glow, 2300, 3400 and 4500 W covering 65 to 143 square feet, recessed, ceiling or wall, with a Marine version. Eclipse: the centre-beam heat-and-light option, 2,900 W covering 121 square feet, pendant, pole or freestanding. Gas: Tungsten Gas and Platinum Gas, natural gas or propane. Every heater is specified with its controls.');
    const cols = [['dk-Tungsten-Series-II-Select-black-hero', 'Tungsten Series II', 'Classic, Select and Coastal. 2–6 kW, 65–160 ft². Single post, IPX5, low-clearance recess in a 7.5 in cavity.', 'Good, better'],
      ['w-bromic-shoot-may-11-2023-54', 'Platinum Electric', 'Slim and architectural, minimal glow. 2300–4500 W, 65–143 ft². Recessed, ceiling or wall; Marine version.', 'Best'],
      ['pf-eclipse-pendant', 'Eclipse', 'Heat and dimmable light in one. 2,900 W, 121 ft². Pendant, pole or freestanding.', 'Heat and light']];
    const cw = (W - 2 * M - 2 * 0.3) / 3;
    // the range page: each family pictured at one height, its tier in flame caps over a hairline, the name in Didot
    cols.forEach(([img, h, b, tg], i) => {
      const x = M + i * (cw + 0.3);
      pic(s, img, x, 1.85, cw, 2.55, img.startsWith('dk-') ? 'contain' : 'cover');
      rule(s, x, 4.6, cw, HEX.INK);
      T(s, tg.toUpperCase(), { x, y: 4.72, w: cw, h: 0.28, fontSize: 9.5, bold: true, color: HEX.FLAME, charSpacing: 4 });
      H1(s, h, { x, y: 5.0, w: cw, h: 0.5, fontSize: 24 });
      T(s, b, { x, y: 5.55, w: cw, h: 1.2, fontSize: 14 });
    });
  }

  // design style (owner, 28 Nov 2026): the style of the outdoor room picks the series; modern defaults to Platinum and Eclipse
  {
    const s = L.content('About Bromic', 'Specify By Style', 'Match The Heater To The Architecture',
      'A quick way to choose: start from the design style of the outdoor room. Modern, contemporary or minimal: Platinum and Eclipse, by default. Platinum is a glass-ceramic panel 2.1 in deep, black or white, surface-mounted or flush in the ceiling with very little visible glow; Eclipse makes the heater a light fitting, with radiant heat and a dimmable 3000K LED ring over the table. Many modern rooms take both. Transitional or modern farmhouse: Tungsten Select, slim on a single post, in black, white or graphite to match the frames. Timber or traditional, with exposed beams or boarded ceilings: Tungsten in black or graphite on the beam, or recessed in the low-clearance kit so the ceiling stays the feature. Coastal: Tungsten Coastal or Platinum Electric Marine. Industrial or hospitality: Tungsten electric, or Tungsten Gas where the line runs. Every heater is specified with its Affinity controls and a wall switch.');
    const cols = [
      ['l-010-071', 'MODERN · DEFAULT', 'Platinum And Eclipse', 'Flush glass panel, or heat and light as one fixture.', 1],
      ['w-connecticut-privateresidence-tungstenelectri-3', 'TRANSITIONAL · FARMHOUSE', 'Tungsten Select', 'Slim on one post, in black, white or graphite.', 0],
      ['w-dsc05737-courtney-saib', 'TIMBER · TRADITIONAL', 'Tungsten, On The Beam Or Recessed', 'Black or graphite; the ceiling stays the feature.', 0],
      ['l-005-022', 'COASTAL', 'Tungsten Coastal · Platinum Marine', 'Built for salt air, whatever the style.', 0],
      ['w-tungsten-gas-500-fiddler-sydney-2-1', 'INDUSTRIAL · HOSPITALITY', 'Tungsten Electric Or Gas', 'Graphite or black on exposed beams.', 0],
    ];
    const cw = 2.28, gap = 0.175;
    // five styles as tall photographs; the default style carries a flame bar beside its name
    cols.forEach(([im, k, h, d, hot], i) => {
      const x = M + i * (cw + gap);
      pic(s, im, x, 1.85, cw, 2.45, 'cover');
      rule(s, x, 4.45, cw, hot ? HEX.FLAME : HEX.INK, hot ? 1.5 : 0.75);
      T(s, k, { x, y: 4.55, w: cw, h: 0.42, fontSize: 9, bold: true, charSpacing: 2, color: hot ? HEX.FLAME : HEX.STEEL });
      H1(s, h, { x, y: 4.98, w: cw, h: 0.75, fontSize: 17 });
      T(s, d, { x, y: 5.72, w: cw, h: 0.7, fontSize: 12.5 });
    });
    rect(s, M, 6.45, 12.1, 0.42, HEX.WASH, { name: 'controls-note' });
    T(s, 'Every heater is specified with its controls: Affinity On/Off or Dimmer, the Eclipse controller for Eclipse, and a wall switch.', { x: M + 0.2, y: 6.45, w: 11.8, h: 0.42, fontSize: 12.5, bold: true, color: HEX.INK, valign: 'middle' });
  }

  {
    const s = L.content('About Bromic', 'Controls', 'Affinity Smart-Heat Controls',
      'Every heater is specified with its controls. Affinity On/Off and Dimmer controllers come in 1, 2 or 5 channels, each channel up to 6 kW at 208–277 V, so one 6 kW heater a channel. The Affinity Eclipse controller runs heat and light separately. A manual wall switch acts as the local disconnect where the code asks for one. The Bromic app adds zones, schedules and timers, with Amazon Alexa and Google Assistant, and Control4, Crestron and Lutron integration; compatibility varies by system and may need extra hardware. Wi-Fi and app features need compatible Affinity controls, sold separately.');
    // the controller cut out on white, four controls each with its own mark, the app photograph bled right
    pic(s, 'w-affinity-dimmer-5ch', M, 1.9, 2.9, 4.0, 'contain');
    cap(s, 'Affinity Dimmer, 5 channels', M, 5.95, 2.9, { fontSize: 10, h: 0.25 });
    [['controller-dimmer', 'On/Off or Dimmer', '1, 2 or 5 channels, up to 6 kW a channel at 208–277 V'], ['heater-eclipse', 'Eclipse controller', 'Heat and light set separately'],
      ['wall-switch', 'Manual wall switch', 'The local disconnect'], ['app', 'App', 'Zones, schedules, timers, voice and home systems']].forEach(([ic, h, b], i) => {
      const x = 3.85, y = 1.9 + i * 1.02;
      icon(s, ic, x, y + 0.14, 0.5);
      block(s, x + 0.7, y, 4.0, h, b, { ls: 18, lh: 0.4, bh: 0.5, bs: 13 });
    });
    cap(s, 'Wi-Fi and app features need compatible Affinity controls, sold separately. Home-system compatibility varies.', 3.85, 6.1, 4.7, { h: 0.55, fontSize: 10 });
    bleed(s, APP_PHOTO, 8.95);
  }

  {
    const s = L.content('About Bromic', 'Design Service', 'Send Us Your Plan, We Send The Heat Map',
      'Bromic\'s complimentary design service selects the heaters, places them and draws the coverage from your photos, plans or drawings, with Revit and CAD files for your set. For the terrace from the challenge, the same rule gives six Tungsten 6 kW heaters, which cover 160 square feet each, on Affinity Dimmer controls with a wall switch; or seven Platinum 4500 W, which cover 143 square feet each, for a slimmer look. Contact: bromic.com/design-your-space, 1-800-301-1293, Monday to Friday, 9 to 4 Pacific.');
    H1(s, 'Heater selection, placement and coverage drawings from your photos, plans or drawings. Revit and CAD files for your set.', { x: M, y: 1.95, w: 6.4, h: 1.25, fontSize: 19 });
    // the white papers' action box: wash ground, flame caps, the two answers in Didot
    rect(s, M, 3.4, 6.4, 2.35, HEX.WASH, { name: 'action-box' });
    T(s, 'THE CHALLENGE TERRACE, WITH BROMIC', { x: M + 0.35, y: 3.6, w: 5.8, h: 0.3, fontSize: 9.5, bold: true, color: HEX.FLAME, charSpacing: 4 });
    [['6 × Tungsten 6 kW', '160 ft² each, or'], ['7 × Platinum 4500 W', '143 ft² each, for a slimmer line']].forEach(([a, b], i) => {
      H1(s, a, { x: M + 0.35, y: 4.0 + i * 0.62, w: 3.1, h: 0.5, fontSize: 20 }); T(s, b, { x: M + 3.45, y: 4.08 + i * 0.62, w: 2.8, h: 0.4, fontSize: 13, color: HEX.INK });
    });
    T(s, 'On Affinity Dimmer controls with a wall switch', { x: M + 0.35, y: 5.3, w: 5.8, h: 0.32, fontSize: 13, bold: true, color: HEX.INK });
    rule(s, M, 6.1, 6.4, HEX.INK);
    T(s, 'bromic.com/design-your-space  ·  1-800-301-1293', { x: M, y: 6.2, w: 6.4, h: 0.4, fontSize: 15, bold: true, color: HEX.INK, valign: 'middle' });
    pic(s, 'l-022-201', 7.4, 1.95, W - M - 7.4, 4.75);
  }

  await L.finish('Bromic-AIA-Evolution-Of-Outdoor-Heating');
})().catch((e) => { console.error(e); process.exit(1); });
