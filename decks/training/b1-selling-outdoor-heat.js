// Training Hub · Dealer track · B1: How To Sell Outdoor Heat, And Bromic (30–45 min).
// Facts: reports/white-papers/pergola-2027/content.py (trend figures, sizing, controls) and
// reports/white-papers/pergola-2027-umph/content.py (SCRIPT1, OBJ). Run: NODE_PATH=$PWD/node_modules node b1-selling-outdoor-heat.js
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const L = require('./lib');
const { T, H1, card, ico, pic, bullets, HEX, W, M } = L;

const ROOT = '/home/user/Bromic_Marketing';
const CACHE = path.join(__dirname, 'cache');
// Page images of the two retail tools, rendered from their committed PDFs.
function pdfPage(pdf, page, name) {
  const base = path.join(CACHE, name);
  if (!fs.existsSync(base + '.jpg')) execFileSync('pdftoppm', ['-jpeg', '-r', '150', '-singlefile', '-f', String(page), '-l', String(page), pdf, base]);
  return base + '.jpg';
}
const FLY = path.join(ROOT, 'reports/retail/take-home-flyer/Bromic-Take-Home-Flyer.pdf');
const PBA = path.join(ROOT, 'reports/retail/portfolio-applications/Bromic-Portfolio-By-Application.pdf');

const ICONS = ['LuSunset', 'LuCalendarDays', 'LuHouse', 'LuTrendingUp', 'LuUmbrella', 'LuSmartphone', 'LuThermometer', 'LuLayers',
  'LuSearch', 'LuPencil', 'LuEye', 'LuReceipt', 'LuWrench', 'LuKey', 'LuMessagesSquare', 'LuSlidersHorizontal', 'LuCable',
  'LuRuler', 'LuFileText', 'LuBookOpen', 'LuTarget', 'LuSparkles'];

async function main() {
  L.start({ title: 'How To Sell Outdoor Heat, And Bromic', footer: 'Dealer Training · How To Sell Outdoor Heat, And Bromic', icons: ICONS });
  await L.prepIcons(ICONS);
  const pres = L.pres;

  // 1 · cover
  L.cover({
    kicker: 'Dealer Training · B1', title: 'How To Sell Outdoor Heat, And Bromic',
    sub: 'Why customers buy heat, how to put it in the first conversation, and how to answer every objection.',
    meta: '30–45 minutes · 3 exercises · 2 knowledge checks', img: 'w-gno-2',
    notes: 'Welcome. This session is about selling the evening: why people buy outdoor heat, why they buy Bromic, and a six-step way to put heat on the first quote. There are three short exercises and two quick checks, so have a pen and a partner ready.',
  });

  // 2 · what you will take away
  {
    const s = L.content('Welcome', 'In This Session', 'What You Will Take Away',
      'Four things to leave with. First, why customers buy heat at all. Second, the three reasons they choose Bromic. Third, a six-step sale that puts heat on the drawing before the budget is set. Fourth, answers to the eight objections you will hear, and a quote with heat and controls on it from the start.');
    const items = [
      ['LuSunset', 'Why Customers Buy Heat', 'The moment, more evenings, more of what they paid for.'],
      ['LuSparkles', 'Why Bromic', 'Radiant warmth, made for the space, run from a phone.'],
      ['LuTarget', 'The Six-Step Sale', 'Heat in the first conversation, on the first drawing.'],
      ['LuMessagesSquare', 'Every Objection Answered', 'Eight answers, and heat with controls on the first quote.'],
    ];
    items.forEach(([ic, h, d], i) => {
      const y = 1.95 + i * 1.18;
      ico(s, ic, M, y, 0.72, 'light');
      H1(s, h, { x: M + 1.0, y: y - 0.02, w: 5.6, h: 0.45, fontSize: 21 });
      T(s, d, { x: M + 1.0, y: y + 0.45, w: 5.6, h: 0.5, fontSize: 15 });
    });
    pic(s, 'l-008-059', 7.25, 1.85, 5.48, 4.9, 'cover', 'photo');
  }

  // 3 · divider
  L.divider({ n: '01', title: 'Why Customers Buy Heat', line: 'People buy the evening. The heater is how they get it.', img: 'l-007-041', icon: 'LuSunset',
    notes: 'Module one. Before we talk about any heater, we talk about why someone wants one.' });

  // 4 · three reasons
  {
    const s = L.content('Why Customers Buy Heat', 'Why They Buy', 'They Are Buying More Evenings',
      'Customers rarely ask for a heater. They ask for one more course, one more story, one more hour outside. Heat gives them more months of the year in a space they have already paid for. Lead with the moment, then the evenings, then the value of the room they own.');
    const cols = [
      ['LuSunset', 'The Moment', 'One more course. One more story. One more hour outside, in any season.'],
      ['LuCalendarDays', 'More Evenings', 'Spring and autumn evenings, and winter in milder climates.'],
      ['LuHouse', 'More Of What They Paid For', 'A pergola or patio that works as a room, not just summer shade.'],
    ];
    const cw = 3.75;
    cols.forEach(([ic, h, d], i) => {
      const x = M + i * (cw + 0.42);
      pic(s, ['w-kion-sui-madrid-spain-tungsten-electric-4', 'l-001-000', 'w-strx-230222-bromic-dc-1'][i], x, 1.85, cw, 2.9, 'cover', 'photo');
      ico(s, ic, x, 5.0, 0.62, 'solid');
      H1(s, h, { x: x + 0.8, y: 4.95, w: cw - 0.8, h: 0.72, fontSize: 19, valign: 'middle' });
      T(s, d, { x, y: 5.8, w: cw, h: 0.9, fontSize: 15 });
    });
  }

  // 5 · outdoor rooms are rising
  {
    const s = L.content('Why Customers Buy Heat', 'The Market', 'Outdoor Rooms Are Rising',
      'Two numbers to quote. The AIA Home Design Trends Survey puts the net share of residential architecture firms reporting rising demand for outdoor living rooms at 51% in Q2 2026, up from 40% a year earlier. That is a net index, not a share of homes. Houzz\'s 2026 Outdoor Trends Study found 35% of homeowners upgrading structures added shade structures, up 15 points on 2024. Sources: AIA Home Design Trends Survey Q3 2026; Houzz 2026 U.S. Outdoor Trends Study.');
    // stat 1: two bars, 40% then 51%
    card(s, M, 1.9, 5.85, 4.85, HEX.GREY, 'stat-card');
    T(s, 'ARCHITECTS REPORTING RISING DEMAND FOR OUTDOOR ROOMS', { x: M + 0.35, y: 2.15, w: 5.2, h: 0.5, fontSize: 11, bold: true, color: HEX.STEEL, charSpacing: 2 });
    const base = 6.15, scale = 0.05;
    [['2025', 40, HEX.STEEL], ['2026', 51, HEX.FLAME]].forEach(([yr, v, col], i) => {
      const x = M + 0.9 + i * 2.3, h = v * scale;
      s.addShape(pres.shapes.RECTANGLE, { x, y: base - h, w: 1.5, h, fill: { color: col }, line: { color: col, width: 0 }, objectName: 'bar' });
      H1(s, `${v}%`, { x: x - 0.3, y: base - h - 0.75, w: 2.1, h: 0.7, fontSize: 32, align: 'center', color: i ? HEX.FLAME : HEX.INK });
      T(s, yr, { x, y: base + 0.08, w: 1.5, h: 0.35, fontSize: 14, align: 'center', color: HEX.STEEL });
    });
    // stat 2
    card(s, 6.88, 1.9, 5.85, 4.85, HEX.INK, 'stat-card');
    ico(s, 'LuUmbrella', 7.25, 2.25, 0.72, 'solid');
    H1(s, '35%', { x: 7.25, y: 3.15, w: 5, h: 1.3, fontSize: 80, color: HEX.WHITE });
    T(s, 'of homeowners upgrading structures added shade structures', { x: 7.25, y: 4.6, w: 5.1, h: 0.9, fontSize: 17, color: 'E6E2DE' });
    T(s, 'Up 15 points in two years', { x: 7.25, y: 5.75, w: 5.1, h: 0.4, fontSize: 15, bold: true, color: HEX.FLAME });
  }

  // 6 · then they wire them
  {
    const s = L.content('Why Customers Buy Heat', 'The Market', 'Then They Cover It, Wire It And Connect It',
      'Once there is a roof, people wire it. Houzz 2026: 74% of outdoor kitchens are fully or partly covered, 44% fully and 30% partly. Houzz 2024: 68% of outdoor products bought in renovations can be monitored or controlled from a phone. Your customer already expects the roof and the lights on their phone; heat should join them. Sources: Houzz 2026 and 2024 U.S. Outdoor Trends Studies.');
    [['74%', 'of outdoor kitchens are fully or partly covered', 'LuHouse'], ['68%', 'of outdoor products bought in renovations can be run from a phone', 'LuSmartphone']].forEach(([n, d, ic], i) => {
      const y = 1.95 + i * 2.45;
      ico(s, ic, M, y + 0.15, 0.72, 'light');
      H1(s, n, { x: M + 1.0, y, w: 3.2, h: 1.2, fontSize: 66, color: HEX.FLAME });
      T(s, d, { x: M + 1.0, y: y + 1.3, w: 5.4, h: 0.8, fontSize: 17, color: HEX.INK });
    });
    pic(s, 'w-bromic-heating-app-blog-image', 7.35, 1.85, 5.38, 4.9, 'cover', 'photo');
  }

  // 6a–6c · the market in USD millions (owner, 28 Nov 2026: "retailers should take outdoor heating more seriously")
  const SRC = (s, t) => T(s, t, { x: M, y: 6.62, w: 12.1, h: 0.3, fontSize: 9, color: HEX.STEEL });
  {
    const s = L.content('Why Customers Buy Heat', 'The Market', 'USD 1.4–1.5 Billion Today, 2.5 Billion By 2032',
      'The line to say: outdoor heating is a USD 1.4 to 1.5 billion category today, heading to about USD 2.5 billion by 2032, and the growth is driven by high-end installed heating: electric, mounted, built-in and controlled from a phone. Where the numbers come from: Fortune Business Insights (Outdoor Heating Market, 2026 edition) puts the global market at USD 1,410 million in 2025 and 1,480 million in 2026; IMARC (2026) at USD 1,500 million in 2025. Fortune forecasts USD 2,470 million by 2034, so "2.5 billion by 2032" is our framing of the faster forecasts (Technavio 2026: 8.2% a year; Market Glass 2025: USD 3,000 million by 2030); reports range from 4.7% to 8.2% growth a year. North America is the largest region: USD 640 million in 2025, 45.7% of the world; the US alone is about USD 550 million in 2026 (Fortune). Electric is the fastest-growing fuel (Market Glass: 9.2% a year against 5.3% for gas), and smart, connected heaters in North America grow 14.2% a year (Ken Research 2026). These are free summaries of paid reports; check against the live pages before external use.');
    card(s, M, 1.9, 7.35, 4.6, HEX.GREY, 'chart-card');
    T(s, 'GLOBAL OUTDOOR HEATING, USD BILLIONS', { x: M + 0.35, y: 2.1, w: 6.5, h: 0.35, fontSize: 11, bold: true, color: HEX.STEEL, charSpacing: 2 });
    const base = 6.0, k = 1.15;
    [['Today', 1.45, '1.4–1.5'], ['2032', 2.5, '2.5']].forEach(([yr, v, lab], i) => {
      const x = M + 1.2 + i * 3.0, h = v * k, col = i ? HEX.FLAME : HEX.STEEL;
      s.addShape(pres.shapes.RECTANGLE, { x, y: base - h, w: 1.9, h, fill: { color: col }, line: { color: col, width: 0 }, objectName: 'bar' });
      H1(s, lab, { x: x - 0.5, y: base - h - 0.7, w: 2.9, h: 0.62, fontSize: 32, align: 'center', color: i ? HEX.FLAME : HEX.INK });
      T(s, yr, { x: x - 0.5, y: base + 0.08, w: 2.9, h: 0.3, fontSize: 14, align: 'center', color: HEX.STEEL });
    });
    card(s, 8.15, 1.9, 4.58, 4.6, HEX.INK, 'stat-card');
    ico(s, 'LuTrendingUp', 8.5, 2.2, 0.62, 'solid');
    T(s, 'DRIVEN BY', { x: 8.5, y: 3.0, w: 4, h: 0.3, fontSize: 11, bold: true, color: HEX.FLAME, charSpacing: 2 });
    H1(s, 'High-End Installed Heating', { x: 8.5, y: 3.35, w: 3.95, h: 1.3, fontSize: 30, color: HEX.WHITE });
    T(s, 'Electric, mounted and built-in, run from the phone.', { x: 8.5, y: 4.7, w: 3.95, h: 0.6, fontSize: 14, color: 'E6E2DE' });
    T(s, 'North America is the largest region: USD 640M, 46% of the world.', { x: 8.5, y: 5.45, w: 3.95, h: 0.8, fontSize: 13, bold: true, color: HEX.FLAME });
    SRC(s, 'Sources: Fortune Business Insights 2026; IMARC 2026; Technavio 2026; Market Glass 2025. Reports range from 4.7% to 8.2% growth a year.');
  }
  {
    const s = L.content('Why Customers Buy Heat', 'The Market', 'Where The Money Is Today, And Where It Is Moving',
      'Three splits from the same report, so they add up (Fortune Business Insights, Outdoor Heating Market, 2026 edition, 2026 shares). Fuel: gas and propane are 54% of the market; electric is the fastest-growing fuel. Market Glass (Patio Heaters, 2025) puts electric growth at 9.2% a year against 5.3% for gas. End use: hospitality, meaning restaurants, bars and hotels, is 58%; residential is rising. Product: freestanding, the portable mushroom heater, is 61%; wall-mounted and hanging heaters, which include built-in and recessed, are growing steadily. No free source splits propane from natural gas, or reports recessed heaters on their own; do not quote a figure for either. The point for the floor: today\'s market is portable gas for restaurants, and the growth is electric, mounted and at home. That is exactly where Bromic plays.');
    const rows = [
      ['LuFlame', 'Fuel', 54, 'Gas and propane', 'Electric and other', 'Electric is the fastest-growing fuel: 9.2% a year, against 5.3% for gas'],
      ['LuUsers', 'Who buys', 58, 'Hospitality', 'Residential and other', 'Homes are the rising share'],
      ['LuLayers', 'Type', 61, 'Freestanding (mushroom)', 'Wall, ceiling, built-in, tabletop', 'Mounted and built-in heaters are growing steadily'],
    ];
    rows.forEach(([ic, lab, v, a, b, grow], i) => {
      const y = 1.95 + i * 1.55, x0 = M + 2.0, bw = 6.0, wa = bw * v / 100;
      ico(s, ic, M, y + 0.05, 0.55, 'light');
      T(s, lab.toUpperCase(), { x: M + 0.7, y: y + 0.17, w: 1.3, h: 0.3, fontSize: 11, bold: true, color: HEX.STEEL, charSpacing: 2 });
      s.addShape(pres.shapes.RECTANGLE, { x: x0, y, w: wa, h: 0.65, fill: { color: HEX.STEEL }, line: { color: HEX.STEEL, width: 0 }, objectName: 'bar-today' });
      s.addShape(pres.shapes.RECTANGLE, { x: x0 + wa, y, w: bw - wa, h: 0.65, fill: { color: HEX.FLAME }, line: { color: HEX.FLAME, width: 0 }, objectName: 'bar-growth' });
      T(s, `${v}%`, { x: x0 + 0.15, y, w: 1.2, h: 0.65, fontSize: 20, bold: true, valign: 'middle', color: HEX.WHITE });
      T(s, `${100 - v}%`, { x: x0 + wa + 0.15, y, w: 1.2, h: 0.65, fontSize: 20, bold: true, valign: 'middle', color: HEX.WHITE });
      T(s, a, { x: x0, y: y + 0.72, w: wa, h: 0.3, fontSize: 12, color: HEX.STEEL });
      T(s, b, { x: x0 + wa, y: y + 0.72, w: bw - wa + 0.6, h: 0.3, fontSize: 12, bold: true, color: HEX.FLAME });
      ico(s, 'LuTrendingUp', 8.85, y + 0.05, 0.5, 'light');
      T(s, grow, { x: 9.5, y: y + 0.02, w: 3.25, h: 0.95, fontSize: 14, color: HEX.INK, valign: 'top' });
    });
    T(s, 'Grey is where the market is today. Flame is where it is growing, and where Bromic is strongest.', { x: M, y: 6.25, w: 12.1, h: 0.35, fontSize: 14, bold: true, color: HEX.INK });
    SRC(s, 'Shares: Fortune Business Insights, Outdoor Heating Market, 2026. Fuel growth: Market Glass, Patio Heaters, 2025.');
  }
  {
    const s = L.content('Why Customers Buy Heat', 'The Market', 'The Fastest-Growing Corners Are Ours',
      'Growth a year by segment, each from its own publisher, so read them as directions rather than one consistent model. Smart and connected heaters in North America: about USD 31 million in 2024, growing 14.2% a year (Ken Research, North America Outdoor Heating Market, 2026). Electric heaters: 9.2% a year (Market Glass, Patio Heaters, 2025). Outdoor kitchens, the room heat goes into: USD 26,300 million in 2025, growing 9.1% a year (Grand View Research). Outdoor heating overall: 6.6% a year (Fortune Business Insights, 2026). Gas heaters: 5.3% a year (Market Glass). Ken Research calls gas and propane patio heaters in North America the largest but slowest-growing pool. The ask: give outdoor heat a permanent place on the floor, lead with electric and controls, and sell it with the outdoor kitchen and the pergola.');
    const bars = [['Smart, connected heaters (N. America)', 14.2, 1], ['Electric heaters', 9.2, 1], ['Outdoor kitchens', 9.1, 0], ['Outdoor heating overall', 6.6, 0], ['Gas heaters', 5.3, 0]];
    T(s, 'GROWTH A YEAR', { x: M, y: 1.9, w: 6, h: 0.3, fontSize: 11, bold: true, color: HEX.STEEL, charSpacing: 2 });
    bars.forEach(([lab, v, hot], i) => {
      const y = 2.35 + i * 0.82, w = v * 0.28, col = hot ? HEX.FLAME : HEX.STEEL;
      T(s, lab, { x: M, y, w: 3.4, h: 0.6, fontSize: 14, valign: 'middle', color: HEX.INK, bold: !!hot });
      s.addShape(pres.shapes.RECTANGLE, { x: M + 3.5, y: y + 0.08, w, h: 0.44, fill: { color: col }, line: { color: col, width: 0 }, objectName: 'bar' });
      T(s, `${v}%`, { x: M + 3.6 + w, y, w: 1.1, h: 0.6, fontSize: 18, bold: true, valign: 'middle', color: hot ? HEX.FLAME : HEX.INK });
    });
    card(s, 9.4, 1.9, 3.33, 4.45, HEX.INK, 'ask-card');
    T(s, 'THE ASK', { x: 9.7, y: 2.15, w: 2.8, h: 0.3, fontSize: 11, bold: true, color: HEX.FLAME, charSpacing: 2 });
    T(s, bullets(['Give heat a place on the floor all year', 'Lead with electric and controls', 'Sell it with the kitchen and the pergola']), { x: 9.7, y: 2.6, w: 2.8, h: 3.5, fontSize: 16, color: HEX.WHITE });
    SRC(s, 'Ken Research 2026 (smart, N. America); Market Glass 2025 (electric, gas); Grand View Research (outdoor kitchens); Fortune Business Insights 2026 (overall).');
  }

  // 7 · before 5 pm / after 5 pm
  {
    const s = L.content('Why Customers Buy Heat', 'Extend The Moment', 'Before 5 PM. After 5 PM.',
      'Same pergola, same family. Before 5 pm it is shade, a kitchen and the pool. After 5 pm, with heat on the beam, it is still in use. That second picture is what your customer is buying. Note: the after-5-pm image is an illustration made from the daytime photograph of this Bromic installation in Yorba Linda, California, not a photograph. Say so if asked.');
    const iw = 5.9;
    [['w-240619-yorba-linda-ca-dc-64', 'BEFORE 5 PM', 'Shade, a kitchen and the pool.'], ['rv-pg-yorba-linda-after-5pm', 'AFTER 5 PM', 'The same pergola, still in use.']].forEach(([im, lab, cap], i) => {
      const x = M + i * (iw + 0.33);
      pic(s, im, x, 1.85, iw, 4.15, 'cover', 'photo');
      s.addShape(pres.shapes.RECTANGLE, { x: x + 0.2, y: 2.05, w: 1.75, h: 0.42, fill: { color: i ? HEX.FLAME : HEX.WHITE }, line: { color: i ? HEX.FLAME : HEX.WHITE, width: 0 }, objectName: 'label' });
      T(s, lab, { x: x + 0.2, y: 2.05, w: 1.75, h: 0.42, fontSize: 12, bold: true, align: 'center', valign: 'middle', charSpacing: 2, color: i ? HEX.WHITE : HEX.INK });
      T(s, cap, { x, y: 6.15, w: iw, h: 0.45, fontSize: 16, color: HEX.INK });
    });
  }

  // 8 · statement
  L.statement({ section: 'Why Customers Buy Heat', kicker: 'The Opportunity', img: 'w-strx-230222-bromic-dc-1',
    line: 'Only 23% Of Homeowners Plan Heat In From The Start. The Rest Are Waiting For You To Ask.',
    notes: 'Most homeowners think of heat once the structure is up and the first cool evening arrives. That is the gap. If you raise it in the first conversation, heat goes on the drawing, the wiring goes inside the structure, and the evenings look after themselves. Source: Bromic Trends 2026, research by Atomik Research.' });

  // 9 · divider
  L.divider({ n: '02', title: 'Why Bromic', line: 'Three reasons customers choose us, and a heater for every budget.', img: 'l-006-028', icon: 'LuSparkles',
    notes: 'Module two. Once they want heat, why Bromic?' });

  // 10 · three reasons
  {
    const s = L.content('Why Bromic', 'Why Bromic', 'Three Reasons Customers Choose Us',
      'Keep it to three. One, radiant heat warms people, not the air, so they feel it in seconds even with a breeze; one Tungsten 6 kW covers up to 160 square feet. Two, there is a Bromic for every space: ceiling, wall, pergola beam, recessed or freestanding, electric or gas. Three, the Bromic app runs zones, schedules and dimming, with Alexa and Google. App features need compatible Affinity controls, sold separately.');
    const R = [
      ['LuThermometer', 'Warms People, Not The Air', 'Radiant heat you feel in seconds, even with a breeze.', 'Up to 160 ft² from one heater'],
      ['LuLayers', 'Made For The Space', 'Ceiling, wall, pergola beam, recessed or freestanding.', 'Electric or gas, in black, white or graphite'],
      ['LuSmartphone', 'Run From A Phone', 'Zones, schedules and dimming in the Bromic app.', 'Works with Alexa and Google'],
    ];
    const cw = 3.75;
    R.forEach(([ic, h, d, p], i) => {
      const x = M + i * (cw + 0.42);
      card(s, x, 1.9, cw, 4.85, HEX.GREY, 'card');
      ico(s, ic, x + 0.35, 2.25, 0.8, 'solid');
      H1(s, h, { x: x + 0.35, y: 3.3, w: cw - 0.7, h: 1.0, fontSize: 22 });
      T(s, d, { x: x + 0.35, y: 4.4, w: cw - 0.7, h: 1.1, fontSize: 16 });
      T(s, p, { x: x + 0.35, y: 5.7, w: cw - 0.7, h: 0.8, fontSize: 15, bold: true, color: HEX.FLAME });
    });
  }

  // 11 · good / better / best
  {
    const s = L.content('Why Bromic', 'A Heater For Every Budget', 'Good, Better, Best, And The Centre',
      'This is the ladder you quote from. Tungsten Classic is good: the same heat coverage as Select at an entry price, black, with a two-year warranty; it launches in January 2027. Tungsten Select is better: single post, black, white or graphite, IPX5, flush recess in a 7.5 in cavity, three years on the heater and seven on the elements. Platinum Electric is best: glass-ceramic, 2.1 in deep, quiet heat with very little visible glow. Eclipse is the centre: heat and a dimmable light over the table. Prices are relative here; use your current price list.');
    const L4 = [
      ['GOOD', 'Tungsten Classic', 'dk-Tungsten-Series-II-Classic-black-hero', 'Same heat as Select, at an entry price'],
      ['BETTER', 'Tungsten Select', 'dk-Tungsten-Series-II-Select-black-hero', 'Single post, three finishes, flush recess'],
      ['BEST', 'Platinum Electric', 'w-platinum-black', 'Glass-ceramic, 2.1 in deep, quiet heat'],
      ['THE CENTRE', 'Eclipse', 'w-eclipse-electric', 'Heat and light over the table'],
    ];
    const cw = 2.83;
    L4.forEach(([tier, name, im, d], i) => {
      const x = M + i * (cw + 0.26), best = i === 2;
      card(s, x, 1.9, cw, 4.85, best ? HEX.INK : HEX.GREY, 'tier-card');
      T(s, tier, { x: x + 0.25, y: 2.1, w: cw - 0.5, h: 0.35, fontSize: 12, bold: true, charSpacing: 3, color: HEX.FLAME });
      H1(s, name, { x: x + 0.25, y: 2.45, w: cw - 0.5, h: 0.55, fontSize: 21, color: best ? HEX.WHITE : HEX.INK });
      pic(s, im, x + 0.25, 3.15, cw - 0.5, 1.95, 'contain', 'product');
      T(s, d, { x: x + 0.25, y: 5.3, w: cw - 0.5, h: 1.2, fontSize: 15, color: best ? 'E6E2DE' : HEX.BODY });
    });
  }

  // 12 · check 1
  L.quiz({ section: 'Why Bromic', n: 1, q: 'They Love Select, But The Budget Is Tight. What Do You Say?',
    options: ['Choose Tungsten Classic: the same heat coverage at an entry price.', 'Drop the controls to save money.', 'Go down a size and accept less warmth.', 'Wait and add heat next year.'],
    answer: 0, why: 'Classic and Select give the same heat coverage at two price points, so the customer keeps the warmth and chooses the look. Controls are never optional, a smaller heater may not cover the seats, and adding heat later means opening the structure.' });

  // 13 · divider
  L.divider({ n: '03', title: 'The Six-Step Sale', line: 'From the first visit to the first warm evening.', img: 'w-kion-sui-madrid-spain-tungsten-electric-5', icon: 'LuTarget',
    notes: 'Module three. Six steps, each with a line you can say word for word.' });

  // 14, 15 · the six steps
  const SCRIPT = [
    ['LuSearch', 'Discover', '"When do you picture using it? Late summer dinners, autumn evenings, game nights in winter?"', 'Ask before you design. The answer sizes the heat.'],
    ['LuPencil', 'Design It In', '"We\'ll mark the heater positions now, so the wiring goes inside the posts and nothing shows."', 'Heat goes on the drawing, not the add-on list.'],
    ['LuEye', 'Show It', '"This is how the heat falls on the table. Here is Tungsten in your frame colour, and Platinum if you want it flush."', 'Use the coverage images and the finish swatches.'],
    ['LuReceipt', 'Quote It As Standard', '"Your pergola, with heat and controls, ready for every season."', 'Quote heat in the base package, with a version without.'],
    ['LuWrench', 'Install Once', '"We pre-wire every bay while the frame is open."', 'One visit, no retrofit.'],
    ['LuKey', 'Hand Over', '"Here is your app: the roof, the lights and the heat together."', 'Set zones and schedules on their phone before you leave.'],
  ];
  [[0, 'Steps 1–3', 'Before The Drawing Is Done', 'The first three steps happen before anyone draws a line. Ask the evening question first: how late, how cold, how often. Then mark heater positions on the plan so the wiring runs inside the posts. Then show where the heat lands, using the coverage images and the frame-colour finishes.'],
   [3, 'Steps 4–6', 'Quote, Install, Hand Over', 'Quote heat as standard, with a version without, so the customer decides to take it out rather than to add it. Pre-wire every bay while the frame is open: one visit, no retrofit. At handover, set up the app on their phone with zones and schedules before you leave. A customer who leaves warm and in control sends you the neighbours.']].forEach(([from, k, t, notes]) => {
    const s = L.content('The Six-Step Sale', `The Six-Step Sale · ${k}`, t, notes);
    const cw = 3.75;
    SCRIPT.slice(from, from + 3).forEach(([ic, h, say, how], j) => {
      const x = M + j * (cw + 0.42), n = from + j + 1;
      H1(s, String(n), { x, y: 1.8, w: 1, h: 1.0, fontSize: 60, color: HEX.FLAME });
      ico(s, ic, x + cw - 0.75, 1.95, 0.72, 'light');
      H1(s, h, { x, y: 2.95, w: cw, h: 0.55, fontSize: 22 });
      card(s, x, 3.65, cw, 2.0, HEX.GREY, 'say-card');
      T(s, say, { x: x + 0.25, y: 3.8, w: cw - 0.5, h: 1.75, fontSize: 15, italic: true, color: HEX.INK, valign: 'middle' });
      T(s, how, { x, y: 5.85, w: cw, h: 0.8, fontSize: 15 });
    });
  });

  // 16 · exercise: opening question
  L.exercise({ section: 'The Six-Step Sale', n: 1, minutes: 5, title: 'Write Your Opening Question', icon: 'LuPencil',
    task: 'Write the one question you will ask every customer before you show them a heater.',
    steps: ['Write it in your own words, in one sentence.', 'Make it about the evening: when, how late, how cold, who with.', 'Read it to the person next to you. Would it make you picture the evening?', 'Keep the best two lines for your next visit.'],
    img: 'l-001-000',
    notes: 'Give five minutes. Two minutes to write, two to read to a partner, one to collect a few out loud. Good questions are open and about the evening, for example: "When do you picture using it?", "How late do you like to sit outside?", "What evenings do you lose to the cold now?". Debrief: a question about the heater ("Do you want a heater?") gets a yes or a no; a question about the evening gets a story, and the story sizes the heat.' });

  // 17 · divider objections
  L.divider({ n: '04', title: 'Every Objection, Answered', line: 'Eight things customers say, and what you say back.', img: 'w-mountain-view-retreat-platinum-electric-rece', icon: 'LuMessagesSquare',
    notes: 'Module four. You will hear these eight objections again and again. Each answer positions Tungsten and Platinum together, so the customer always has a next step.' });

  // 18, 19 · objections
  const OBJ = [
    ['"It\'s over budget."', 'Tungsten Classic and Select give the same heat coverage at two price points. Platinum is there when the design leads. Start with one heater over the table and pre-wire for more.'],
    ['"We\'ll add heat later."', 'Later means opening the frame and running visible conduit. Pre-wire now, and Tungsten and Platinum, surface or recessed, both stay an option.'],
    ['"Will we really use it?"', 'Ask how many evenings they lose to the cold now. Tungsten for strong, directional warmth; Platinum for quiet heat with very little visible glow.'],
    ['"Heaters look bulky."', 'Tungsten Series II is slim, on one post, in black, white or graphite. Platinum is 2.1 in deep glass-ceramic and recesses flush in a solid bay.'],
    ['"We\'re by the sea."', 'Tungsten Coastal and Platinum Electric Marine are both built in 316 marine-grade stainless; Coastal adds a corrosion-resistant coating.'],
    ['"Not another app."', 'Affinity runs Tungsten and Platinum alike, with Alexa, Google and the home system they already have.'],
    ['"Gas is cheaper."', 'Under a roof, electric Tungsten and Platinum need no gas line, flue or ventilation sums, and switch on instantly.'],
    ['"The electrician will cost a fortune."', 'Tungsten and Platinum each take one dedicated circuit per heater or controller channel. Run while the frame is open, it is the least it will ever cost.'],
  ];
  [[0, '1 Of 2', 'Price, Timing, Use And Looks', 'Read each objection, then the answer, then ask the room for their own version. Over budget: Classic gives the same heat coverage as Select at a lower price point, and one heater over the table with pre-wiring for more keeps the door open. Add it later: later means opening the frame. Will we use it: ask how many evenings they lose now. Bulky: Series II is slim on one post; Platinum is 2.1 in deep.'],
   [4, '2 Of 2', 'Sea Air, Apps, Gas And Wiring', 'By the sea: Coastal and Platinum Marine are built in 316 marine-grade stainless; Coastal adds a corrosion-resistant coating. They are for homes and venues by the water. The Coastal body material and coating name are to confirm with the Product team. Not another app: Affinity works with Alexa, Google and home systems; compatibility varies by system and may need extra hardware. Gas is cheaper: under a roof, electric needs no gas line, flue or ventilation sums. Electrician: one dedicated circuit per heater or controller channel, cheapest while the frame is open. Hard-wiring is always by a licensed electrician, to local code.']].forEach(([from, k, t, notes]) => {
    const s = L.content('Every Objection, Answered', `Objections · ${k}`, t, notes);
    const cw = 5.9, ch = 2.3;
    OBJ.slice(from, from + 4).forEach(([q, a], j) => {
      const x = M + (j % 2) * (cw + 0.33), y = 1.9 + Math.floor(j / 2) * (ch + 0.25);
      card(s, x, y, cw, ch, HEX.GREY, 'objection-card');
      H1(s, q, { x: x + 0.3, y: y + 0.2, w: cw - 0.6, h: 0.55, fontSize: 21, color: HEX.FLAME });
      T(s, a, { x: x + 0.3, y: y + 0.85, w: cw - 0.6, h: ch - 1.0, fontSize: 15, color: HEX.INK });
    });
  });

  // 20 · exercise: role play
  L.exercise({ section: 'Every Objection, Answered', n: 2, minutes: 10, title: 'Role-Play The Objections In Pairs', icon: 'LuMessagesSquare',
    task: 'One of you is the customer, one is the dealer. Work through the eight objections, then swap.',
    steps: ['The customer picks an objection and says it like they mean it.', 'The dealer answers in under 30 seconds, in their own words.', 'The dealer ends with a question that moves the sale on.', 'After four objections, swap roles. The customer scores each answer out of 3.'],
    img: 'w-bromicatria23',
    notes: 'Pair people up and give ten minutes, five each way. Encourage customers to push back a second time. Scoring: 1 point for a true answer, 1 for naming Tungsten and Platinum together, 1 for a closing question. Debrief: ask which objection was hardest. Usually it is "we\'ll add heat later" or "the electrician will cost a fortune"; the answer to both is the same: pre-wire while the frame is open. Remind people never to invent a price or a spec on the spot; say "I\'ll confirm that for you".' });

  // 21 · heat and controls on the first quote
  {
    const s = L.content('The First Quote', 'The First Quote', 'Heat And Controls On The First Quote',
      'Every heater on a quote has its control next to it. For Tungsten and Platinum that is an Affinity On/Off or Dimmer controller, 1, 2 or 5 channels, each up to 6 kW at 208 to 277 V, with a wall switch as the local disconnect where code asks for one. Eclipse takes the Affinity Eclipse controller, or the Eclipse Dimmer Controller with remote. Wi-Fi and app features need compatible Affinity controls, sold separately; say so on the quote. Wiring is by a licensed electrician on a dedicated circuit; permit and GFCI rules vary by jurisdiction.');
    const lines = [
      ['LuThermometer', 'The heaters', 'Sized to the seating area, at the right mounting height.'],
      ['LuSlidersHorizontal', 'The controls', 'Affinity On/Off or Dimmer for Tungsten and Platinum; the Eclipse controller for Eclipse.'],
      ['LuKey', 'A wall switch', 'The local disconnect, where the code asks for one.'],
      ['LuCable', 'The pre-wire', 'A dedicated circuit to every heater position, by a licensed electrician.'],
      ['LuSmartphone', 'The app set-up', 'Zones and schedules on the customer\'s phone at handover.'],
    ];
    lines.forEach(([ic, h, d], i) => {
      const y = 1.85 + i * 0.98;
      ico(s, ic, M, y, 0.62, 'light');
      T(s, [{ text: h + '  ', options: { bold: true, color: HEX.INK } }, { text: d }], { x: M + 0.85, y: y + 0.02, w: 5.9, h: 0.8, fontSize: 15, valign: 'middle' });
    });
    pic(s, 'w-affinity-dimmer-5ch', 7.35, 1.85, 5.38, 4.9, 'contain', 'photo');
  }

  // 22 · size it
  {
    const s = L.content('The First Quote', 'Size It Before You Quote', 'Seating Area ÷ (Heat Area × 0.85)',
      'One line sizes most quotes. Measure the seating area, divide by the heater\'s heat area times 0.85 for a partly covered space on cool evenings, and round up. Heat areas: Tungsten 2, 3, 4 and 6 kW cover up to 65, 100, 130 and 160 square feet, and Classic and Select are the same. Platinum 2300, 3400 and 4500 W cover 65, 108 and 143. Eclipse covers 121. Mount Tungsten 6 kW at 8 to 12 ft and Platinum 4500 W at 8 to 10 ft. Worked example: 12 by 20 ft is 240 square feet; 240 divided by 136 is 1.76, so two Tungsten 6 kW; 240 divided by 121.6 is 1.97, so two Platinum 4500 W.');
    const COV = [['Tungsten 2 / 3 / 4 / 6 kW', '65 / 100 / 130 / 160 ft²'], ['Platinum 2300 / 3400 / 4500 W', '65 / 108 / 143 ft²'], ['Eclipse 2,900 W', '121 ft²']];
    T(s, 'HEAT AREA, ONE HEATER', { x: M, y: 1.95, w: 5.8, h: 0.35, fontSize: 11, bold: true, color: HEX.STEEL, charSpacing: 2 });
    COV.forEach(([a, b], i) => {
      const y = 2.4 + i * 0.82;
      card(s, M, y, 5.8, 0.68, HEX.GREY, 'row');
      T(s, a, { x: M + 0.25, y, w: 3.0, h: 0.68, fontSize: 15, bold: true, color: HEX.INK, valign: 'middle' });
      T(s, b, { x: M + 3.2, y, w: 2.45, h: 0.68, fontSize: 15, valign: 'middle', align: 'right' });
    });
    T(s, 'Classic and Select share the same heat areas.', { x: M, y: 4.95, w: 5.8, h: 0.4, fontSize: 14, color: HEX.STEEL });
    card(s, 6.88, 1.9, 5.85, 4.85, HEX.INK, 'example');
    ico(s, 'LuRuler', 7.25, 2.2, 0.72, 'solid');
    T(s, 'WORKED EXAMPLE', { x: 8.15, y: 2.38, w: 4, h: 0.35, fontSize: 12, bold: true, color: HEX.FLAME, charSpacing: 3 });
    T(s, [
      { text: '12 × 20 ft = 240 ft²', options: { breakLine: true, bold: true, color: HEX.WHITE, fontSize: 22, paraSpaceAfter: 14 } },
      { text: 'Tungsten 6 kW: 240 ÷ (160 × 0.85) = 1.76', options: { breakLine: true, paraSpaceAfter: 4 } },
      { text: 'Two heaters', options: { breakLine: true, bold: true, color: HEX.FLAME, paraSpaceAfter: 14 } },
      { text: 'Platinum 4500 W: 240 ÷ (143 × 0.85) = 1.97', options: { breakLine: true, paraSpaceAfter: 4 } },
      { text: 'Two heaters', options: { bold: true, color: HEX.FLAME } },
    ], { x: 7.25, y: 3.2, w: 5.2, h: 3.3, fontSize: 16, color: 'E6E2DE' });
  }

  // 23 · exercise: three-tier quote
  L.exercise({ section: 'The First Quote', n: 3, minutes: 15, title: 'Build A Good, Better, Best Quote', icon: 'LuReceipt',
    task: 'Quote three tiers for a 12 × 20 ft louvered pergola: black frame, 9 ft clear, cool evenings, run from a phone.',
    steps: ['Size the heat for each tier with the one-line rule.', 'Good: Tungsten Classic. Better: Tungsten Select. Best: Platinum Electric.', 'Add the controls, the wall switch and the pre-wire to every tier.', 'Write one line for each tier that says why a customer would choose it.'],
    img: 'w-vbb7428',
    notes: 'Give fifteen minutes in pairs or threes. A model answer: Good, two Tungsten Classic 6 kW in black on the perimeter beams, an Affinity 2-channel controller, a wall switch, two dedicated circuits; the same heat coverage at the entry price. Better, two Tungsten Select 6 kW in black on single posts, IPX5, with an Affinity 2-channel Dimmer and the app; slimmer, nothing on show, three years on the heater and seven on the elements. Best, two Platinum Electric 4500 W in black glass, recessed flush in a solid bay or on their poles, with an Affinity 2-channel Dimmer and the app; quiet heat with very little visible glow. 9 ft clear suits Tungsten 6 kW (8 to 12 ft) and Platinum 4500 W (8 to 10 ft). Optional: an Eclipse pendant over the table as the centre, on its own Eclipse controller. App features need compatible Affinity controls, sold separately. Debrief: did every tier carry its controls? Did anyone quote without the pre-wire? Use your current price list for numbers; none are given here.' });

  // 24 · tools
  {
    const s = L.content('The First Quote', 'Tools For The Floor', 'Two Things To Put In Their Hands',
      'Two tools close the conversation. The take-home flyer is two pages: Extend The Moment, why Bromic, the four heaters, and a QR code to Bromic\'s free design service, with space to stamp your store. The Portfolio By Application brochure shows nine outdoor rooms and the heater to show first in each, with its controls. Give the flyer to every visitor; walk serious buyers through the brochure.');
    const fly1 = pdfPage(FLY, 1, 'b1-flyer-p1'), pba1 = pdfPage(PBA, 1, 'b1-pba-p1');
    const pw = 3.4, ph = pw * 11 / 8.5;
    [[fly1, M, 'Take-Home Flyer', 'Two pages: why Bromic, the four heaters and a QR code to the free design service.', 'For every visitor. Stamp your store on the back.'],
     [pba1, 6.88, 'Portfolio By Application', 'Nine outdoor rooms and the heater to show first in each, with its controls.', 'For serious buyers. Walk them through it.']].forEach(([f, x, h, d, w]) => {
      card(s, x - 0.02, 1.83, pw + 0.04, ph + 0.04, HEX.LINE, 'page-edge');
      pic(s, f, x, 1.85, pw, ph, 'contain', 'tool-page');
      ico(s, x === M ? 'LuFileText' : 'LuBookOpen', x + pw + 0.3, 1.9, 0.62, 'light');
      H1(s, h, { x: x + pw + 0.3, y: 2.7, w: 2.15, h: 1.0, fontSize: 20 });
      T(s, d, { x: x + pw + 0.3, y: 3.8, w: 2.15, h: 1.7, fontSize: 15 });
      T(s, w, { x: x + pw + 0.3, y: 5.55, w: 2.15, h: 1.0, fontSize: 14, bold: true, color: HEX.FLAME });
    });
  }

  // 25 · check 2
  L.quiz({ section: 'The First Quote', n: 2, q: '"We\'ll Add Heat Later." What Is Your Best Answer?',
    options: ['Fine, call us when it gets cold.', 'Pre-wire every heater position now, while the frame is open.', 'Gas is easier to add later, so plan for gas.', 'Buy a portable heater for now.'],
    answer: 1, why: 'Later means opening the frame and running visible conduit. Pre-wiring now keeps Tungsten and Platinum, surface or recessed, both an option, and it is the least the wiring will ever cost.' });

  // 26 · closing
  L.closing({ title: 'Put Heat In The First Conversation',
    points: ['Ask about the evening before you show a heater.', 'Quote Classic, Select and Platinum, with Eclipse as the centre.', 'Every heater leaves with its controls and a wall switch.', 'Pre-wire every position while the frame is open.', 'Hand over the flyer, and the brochure to serious buyers.'],
    next: 'Next: The Bromic Portfolio, every heater and where it goes.', img: 'w-gno-2',
    notes: 'Close with the five habits. Ask everyone to write down which one they will use on their next visit. Next session covers the full portfolio, so they can answer "which one?" for any space.' });

  await L.finish('Bromic-Dealer-How-To-Sell-Outdoor-Heat');
}
main().catch((e) => { console.error(e); process.exit(1); });
