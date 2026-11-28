// Training Hub · Hospitality track · D2: Heated Seats, Paid Back (30-minute workshop for restaurant, bar and hotel operators).
// Figures: ONLY the method and defaults of tools/A21-roi and tools/A20-tco (README, config.json, logic.js) and
// templates/calculation-model.md; every revenue input is an assumption the operator replaces. Case studies: data/case-studies.json
// (Bromic's own published pages only, no quotes). Zones, routine and care: content/articles/COM-BY-01. Gas rules:
// reports/white-papers/pergola-2027/content.py (gas manual, FAQ), COM-BY-01 (IFC 605.5). BMS: content/sales/A25, deck B3.
// Run: cd decks/training && NODE_PATH=$PWD/node_modules node d2-heated-seats-paid-back.js
const L = require('./lib');
const { T, H1, pic, rule, num, stat, HEX, W, M } = L;
const path = require('path');

async function main() {
  L.start({ title: 'Heated Seats, Paid Back', footer: 'Hospitality Workshop · Heated Seats, Paid Back' });
  await L.prepIcons();
  const pres = L.pres, SH = () => pres.shapes;
  const caps = (s, t, x, y, w, o = {}) => T(s, t.toUpperCase(), { x, y, w, h: 0.3, fontSize: 9.5, bold: true, color: HEX.STEEL, charSpacing: 3, ...o });
  const box = (s, x, y, w, h, fill, name = 'panel', o = {}) => s.addShape(SH().RECTANGLE, { x, y, w, h, fill: fill ? { color: fill } : { type: 'none' }, line: o.line ? { color: o.line, width: o.lw || 1, dashType: o.dash || 'solid' } : { color: fill || HEX.WHITE, width: 0 }, objectName: name });
  function line(s, x1, y1, x2, y2, o = {}) {
    s.addShape(SH().LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1), flipV: (x2 - x1) * (y2 - y1) < 0,
      line: { color: o.color || HEX.INK, width: o.width || 1, dashType: o.dash || 'solid', endArrowType: o.end, beginArrowType: o.begin }, objectName: o.name || 'line' });
  }
  const lab = (s, t, x, y, w, o = {}) => T(s, t, { x, y, w, h: o.h || 0.28, fontSize: o.size || 10.5, color: o.color || HEX.STEEL, align: o.align || 'left', valign: 'middle', bold: !!o.bold });
  const WHITE = path.join(__dirname, 'cache', 'd-white-panel.jpg');
  await require('sharp')({ create: { width: 1076, height: 980, channels: 3, background: '#FFFFFF' } }).jpeg().toFile(WHITE);
  const SRC = (s, t) => T(s, t, { x: M, y: 6.62, w: 12.1, h: 0.3, fontSize: 9, color: HEX.STEEL });
  const kick = (s, t, x, y, w, color = HEX.FLAME) => T(s, t.toUpperCase(), { x, y, w, h: 0.28, fontSize: 9.5, bold: true, color, charSpacing: 4 });

  // 1 · cover
  L.cover({
    kicker: 'Hospitality Workshop · D2', title: 'Heated Seats, *Paid Back*',
    sub: 'Seats, seasons and return, gas or electric, and the zones and controls that run a heated terrace.',
    meta: '30 minutes · 2 exercises · 2 knowledge checks', img: 'd-tungsten-pole-rooftop-bar',
    notes: 'Welcome (1 min). This workshop is for restaurant, bar and hotel operators and their teams: owners, general managers, floor managers and facilities. In thirty minutes we run the seat-payback sum the way our ROI tool does it, compare gas and electric for a venue, zone a terrace by area and time of day, connect it to a building management system, and set a care routine. Two exercises and two quick checks. Every number in the sums is an assumption you replace with your own; none of them is a Bromic claim.',
  });

  // 2 · take-aways
  {
    const s = L.content('Welcome', 'In This Workshop', 'What You Will Take Away',
      'Four things (1 min). The seat-payback sum, run on your own numbers. Gas or electric for your venue, and the rules that come with gas. Zones by area and by time of day, on the right controls, and the building management system. And a care routine every shift can follow.');
    [['Seats, Seasons And Return', 'The payback sum, on your own numbers.'], ['Gas Or Electric', 'What each needs under a roof, and five years of fuel.'],
     ['Zones And Controls', 'By area, by time of day, and on the BMS.'], ['Care', 'A shift routine and a season routine.']].forEach(([h, d], i) => {
      const y = 1.95 + i * 1.2;
      rule(s, M, y, 6.0);
      num(s, i + 1, M, y + 0.12, { size: 26, h: 0.55, w: 0.8 });
      H1(s, h, { x: M + 0.95, y: y + 0.14, w: 5.05, h: 0.45, fontSize: 21 });
      T(s, d, { x: M + 0.95, y: y + 0.6, w: 5.05, h: 0.5, fontSize: 14 });
    });
    pic(s, 'w-kion-sui-madrid-spain-tungsten-electric-5', 7.35, 0, W - 7.35, 6.8, 'cover', 'photo');
  }

  // 3 · divider
  L.divider({ n: '01', title: 'Seats, Seasons And *Return*', line: 'Heat sells seats on the nights the terrace would be empty.', img: 'rv-ts2-photo-06', section: 'Seats, Seasons And Return',
    notes: 'Part one (11 min with the exercise). The sum our ROI calculator runs, step by step, and how sensitive it is to one input.' });

  // 4 · the sum
  {
    const s = L.content('Seats, Seasons And Return', 'The Method', 'Three Lines Turn Heated Seats Into A Payback',
      'This is the method in our payback calculator, A21 (2 min). Line one, added revenue: heated seats, times turns a night, times the average check, times the extra nights the terrace opens because it is heated, times the share of those seats you fill. Line two: multiply by your contribution margin, the revenue left after food, drink and variable labour, then take off the running cost: heaters times kW times hours times nights times your electricity price. Line three: your installed cost divided by a month of that net gain. We use margin after running cost on purpose; payback on revenue alone overstates the return. Source: tools/A21-roi README and templates/calculation-model.md.');
    const F = [['Heated Seats', 'inside the heat'], ['Turns', 'a night'], ['Average Check', 'per guest'], ['Extra Nights', 'heat opens'], ['Share Filled', 'on those nights']];
    const cw = 1.55, gap = 0.55;
    kick(s, '1 · Added revenue', M, 1.85, 6);
    F.forEach(([h, d], i) => {
      const x = M + i * (cw + gap);
      rule(s, x, 2.3, cw);
      H1(s, h, { x, y: 2.42, w: cw, h: 0.75, fontSize: 18 });
      T(s, d, { x, y: 3.15, w: cw, h: 0.3, fontSize: 12, color: HEX.STEEL });
      if (i < 4) H1(s, '×', { x: x + cw + 0.08, y: 2.45, w: 0.45, h: 0.5, fontSize: 26, color: HEX.FLAME, align: 'center' });
    });
    H1(s, '=', { x: M + 5 * (cw + gap) - gap + 0.08, y: 2.45, w: 0.4, h: 0.5, fontSize: 26, color: HEX.FLAME, align: 'center' });
    box(s, 11.13, 2.3, 1.6, 1.15, HEX.INK, 'result');
    H1(s, 'Added Revenue', { x: 11.3, y: 2.4, w: 1.3, h: 0.95, fontSize: 15, color: HEX.WHITE, valign: 'middle' });
    // line 2 and 3
    const rows = [['2 · Net gain a year', 'Added revenue × contribution margin  −  running cost', 'Running cost = heaters × kW × hours × nights × $/kWh'],
      ['3 · Payback in months', 'Installed cost  ÷  (net gain a year ÷ 12)', 'Your own quote: heaters, controls, wiring, permits']];
    rows.forEach(([k, eq, d], i) => {
      const y = 4.05 + i * 1.45;
      kick(s, k, M, y, 6);
      rule(s, M, y + 0.38, W - 2 * M, i ? HEX.FLAME : HEX.INK, i ? 1.5 : 0.75);
      H1(s, eq, { x: M, y: y + 0.5, w: 7.6, h: 0.55, fontSize: 22 });
      T(s, d, { x: 8.55, y: y + 0.56, w: 4.18, h: 0.5, fontSize: 13, color: HEX.STEEL });
    });
  }

  // 5 · from seats to heaters
  {
    const s = L.content('Seats, Seasons And Return', 'Sizing', 'From Seats To Heaters',
      'Before the money, the heater count (1.5 min). We allow 20 square feet a seat, aisles included: the top of the NAFEM space-planning range, so tables are never crammed. 40 seats is 800 square feet. For overhead heaters: area divided by coverage times the cover and climate factors; on a partly covered terrace on cool evenings that is 0.85. Platinum 4500 W covers 143: 800 ÷ (143 × 0.85) = 6.6, so seven. Freestanding heaters are counted both ways, because guests block a freestanding heater\'s warmth: never more than 4 seats a heater. Tungsten Freestanding Gas covers 215: 800 ÷ (215 × 0.85) = 4.4, but 40 ÷ 4 = 10, so ten. Every count comes with its controls: seven Platinum 4500 W on Affinity Dimmer channels (one heater a channel, for example a 5-channel and a 2-channel controller), with a wall switch per zone. Wi-Fi and app features need compatible Affinity controls, sold separately. Source: templates/calculation-model.md; coverage from data/product-facts.json.');
    const cw = 2.55;
    [['40', 'seats'], ['800 ft²', 'at 20 ft² a seat'], ['× 0.85', 'partly covered, cool evenings']].forEach(([f, l], i) => {
      stat(s, f, l, M + i * (cw + 0.35), 1.95, cw, { size: 54, h: 0.95, lh: 0.5, ls: 13, color: i === 2 ? HEX.INK : HEX.FLAME });
    });
    const P = [['Overhead · Platinum 4500 W', '800 ÷ (143 × 0.85) = 6.6', 'Seven heaters', 'Affinity Dimmer, one heater a channel, and a wall switch per zone.'],
      ['Freestanding · Tungsten Gas', '800 ÷ (215 × 0.85) = 4.4, but 40 ÷ 4 = 10', 'Ten heaters', 'Never more than 4 seats a freestanding heater: guests block its warmth.']];
    P.forEach(([h, sum, n, d], i) => {
      const x = M + i * (4.25 + 0.3), y = 4.0;
      kick(s, h, x, y, 4.25, HEX.STEEL);
      rule(s, x, y + 0.35, 4.25);
      T(s, sum, { x, y: y + 0.48, w: 4.25, h: 0.35, fontSize: 14, color: HEX.INK });
      H1(s, n, { x, y: y + 0.88, w: 4.25, h: 0.6, fontSize: 28, color: HEX.FLAME });
      T(s, d, { x, y: y + 1.5, w: 4.25, h: 0.7, fontSize: 13 });
    });
    pic(s, 'rv-ts2-ai-08', 9.95, 1.95, 2.78, 4.6, 'cover', 'photo');
    SRC(s, 'Method: templates/calculation-model.md (20 ft² a seat, NAFEM). Coverage: product facts. Seats here are an example: use your own.');
  }

  // 6 · worked example
  {
    const s = L.content('Seats, Seasons And Return', 'With These Inputs', 'One Worked Example, Every Input An Assumption',
      'Run it once together (2 min). These are the default inputs in our payback calculator, taken from the worked example in the COM-IN-01 article. They are illustrative, not benchmarks, and none of them is a Bromic claim: replace every one with your own. 40 heated seats, 1.5 turns a night, a 45 dollar average check, 60 extra nights, half the heated seats filled: 81,000 dollars of added revenue. At a 30% contribution margin that is 24,300. Seven Platinum 4500 W for five hours on 60 nights is 9,450 kWh; at 14.07 cents (EIA, US commercial average, January to May 2026) that is 1,330 dollars. Net gain 22,970 dollars a year, 1,914 a month. The installed cost of 35,000 dollars is a placeholder in the tool, seven heaters at 5,000 all in: it is not a Bromic price or a quote. 35,000 ÷ 1,914 is 18.3 months. Typical installed cost per heater is still to confirm with Specification and compliance; the benchmark inputs with Hospitality sales.');
    const IN = [['Heated seats', '40'], ['Turns a night', '1.5'], ['Average check', '$45'], ['Extra nights a year', '60'], ['Share of seats filled', '50%'], ['Contribution margin', '30%'],
      ['Heaters × kW × hours', '7 × 4.5 kW × 5 h'], ['Electricity', '14.07¢ / kWh'], ['Installed cost (placeholder)', '$35,000']];
    caps(s, 'Inputs · replace every one with yours', M, 1.85, 6);
    IN.forEach(([a, b], i) => {
      const y = 2.2 + i * 0.47;
      rule(s, M, y, 5.9, i ? 'C9C9C6' : HEX.INK, 0.5);
      T(s, a, { x: M, y: y + 0.05, w: 3.4, h: 0.38, fontSize: 13.5, color: HEX.INK, valign: 'middle' });
      T(s, b, { x: M + 3.4, y: y + 0.05, w: 2.5, h: 0.38, fontSize: 13.5, bold: true, color: HEX.INK, align: 'right', valign: 'middle' });
    });
    rule(s, M, 2.2 + 9 * 0.47, 5.9, 'C9C9C6', 0.5);
    // the waterfall on ink
    const px = 6.95, pw = W - M - px;
    box(s, px, 1.85, pw, 4.9, HEX.INK, 'result-panel');
    kick(s, 'What the sum gives, a year', px + 0.35, 2.1, 5);
    const bw = pw - 3.35, max = 81000;
    [['Added revenue', 81000, '$81,000', 'B9B5B0'], ['× 30% margin', 24300, '$24,300', 'B9B5B0'], ['− running cost', 1330, '$1,330', '8A8580'], ['Net gain', 22970, '$22,970', HEX.FLAME]].forEach(([a, v, f, c], i) => {
      const y = 2.55 + i * 0.6;
      T(s, a, { x: px + 0.35, y, w: 1.55, h: 0.42, fontSize: 12, color: 'E6E2DE', valign: 'middle' });
      box(s, px + 1.95, y + 0.11, Math.max(0.05, bw * v / max), 0.2, c, 'bar');
      T(s, f, { x: px + pw - 1.25, y, w: 0.95, h: 0.42, fontSize: 12, bold: true, color: i === 3 ? HEX.FLAME : HEX.WHITE, align: 'right', valign: 'middle' });
    });
    rule(s, px + 0.35, 5.05, pw - 0.7, '5A5556', 0.5);
    H1(s, '18.3', { x: px + 0.35, y: 5.12, w: 1.9, h: 1.1, fontSize: 60, color: HEX.FLAME });
    T(s, 'months to pay back $35,000, with these inputs', { x: px + 2.25, y: 5.35, w: pw - 2.6, h: 0.75, fontSize: 14, color: HEX.WHITE, valign: 'middle' });
    T(s, 'Installed cost is the tool\'s placeholder, not a Bromic price.', { x: px + 0.35, y: 6.25, w: pw - 0.7, h: 0.3, fontSize: 10, color: 'B9B5B0' });
  }

  // 7 · sensitivity
  {
    const s = L.content('Seats, Seasons And Return', 'Sensitivity', 'The Share Of Seats You Fill Moves Everything',
      'One input matters more than the rest (1.5 min). Keep every other input of the worked example and change only the share of heated seats filled. At 25%, added revenue is 40,500 dollars, net gain 10,820, payback about 39 months. At 50%, 18.3 months. At 75%, 121,500 dollars, net gain 35,120, about 12 months. A one-year payback needs about 75% of the heated seats filled on the extra nights. Our article advises starting low: estimate the share you are confident of, not the one you hope for. Source: tools/A21-roi test case 2 and README; COM-IN-01.');
    const R = [['25%', 38.8, 'Net gain $10,820 a year'], ['50%', 18.3, 'Net gain $22,970 a year'], ['75%', 12.0, 'Net gain $35,120 a year']];
    caps(s, 'Seats filled', M, 1.85, 2.4); caps(s, 'Payback, months', 3.2, 1.85, 4);
    R.forEach(([p, m, d], i) => {
      const y = 2.3 + i * 1.2, bw = 6.4 * m / 38.8;
      rule(s, M, y, W - 2 * M, i ? 'C9C9C6' : HEX.INK, 0.5);
      H1(s, p, { x: M, y: y + 0.12, w: 2.4, h: 0.9, fontSize: 48, color: HEX.INK });
      box(s, 3.2, y + 0.42, bw, 0.22, i === 2 ? HEX.FLAME : HEX.STEEL, 'bar');
      H1(s, m.toFixed(1), { x: 3.3 + bw, y: y + 0.15, w: 1.4, h: 0.8, fontSize: 34, color: i === 2 ? HEX.FLAME : HEX.INK });
      T(s, d, { x: 3.2, y: y + 0.72, w: 5, h: 0.35, fontSize: 12, color: HEX.STEEL });
    });
    rule(s, M, 2.3 + 3 * 1.2, W - 2 * M, 'C9C9C6', 0.5);
    box(s, M, 6.0, W - 2 * M, 0.75, HEX.WASH, 'action-box');
    H1(s, 'A one-year payback needs about 75% of heated seats filled. Start with the share you are sure of.', { x: M + 0.35, y: 6.0, w: W - 2 * M - 0.7, h: 0.75, fontSize: 18, valign: 'middle' });
  }

  // 8 · exercise 1
  {
    const s = L.exercise({ section: 'Seats, Seasons And Return', n: 1, minutes: 8, title: 'Run The Seat-Payback Sum For Your Venue',
      task: 'Fill in the worksheet with your own terrace. Every number is yours, not ours.',
      steps: ['Heated seats, turns, average check: from your own book.', 'Extra nights: the months heat would keep the terrace open.', 'Share filled: the figure you are sure of. Then margin.', 'Heaters from the seats; running cost; your installed quote; payback.'],
      img: WHITE,
      notes: 'Eight minutes, alone or with your own team (1 to explain, 5 to fill in, 2 to compare). There is no single right answer: the model answer is the method. Check each worksheet for four things. One, heated seats are only the seats inside the heat, not the whole terrace. Two, extra nights are nights the terrace would be closed or empty without heat, not every night it opens. Three, revenue is turned into contribution margin before running cost comes off; payback on revenue would read about 5 months on the worked example instead of 18.3. Four, the heater count follows the model, 20 ft² a seat and coverage × 0.85, with its controls on the quote, and the installed cost is the operator\'s own quote, never a number from this slide. Example to fall back on: the worked example (40 seats, 1.5 turns, $45, 60 nights, 50%, 30%, seven Platinum 4500 W for 5 h at 14.07¢, $35,000 placeholder) gives $81,000, $24,300, $1,330, $22,970 and 18.3 months. Point to the online calculator (A21) to run it again with exact energy prices by state.' });
    const F = { x: 7.35, y: 1.85, w: 5.38, h: 4.9 };
    box(s, F.x, F.y, F.w, F.h, HEX.GREY, 'worksheet');
    kick(s, 'Worksheet', F.x + 0.3, F.y + 0.2, 3);
    const rows = [['Heated seats', ''], ['× Turns a night', ''], ['× Average check', '$'], ['× Extra nights', ''], ['× Share filled', '%'], ['= Added revenue', '$'],
      ['× Contribution margin', '%'], ['− Running cost', '$'], ['= Net gain a year', '$'], ['Installed cost, your quote', '$'], ['Payback, months', '']];
    rows.forEach(([a, u], i) => {
      const y = F.y + 0.6 + i * 0.37, hot = a.startsWith('=') || a.startsWith('Payback');
      T(s, a, { x: F.x + 0.3, y, w: 2.7, h: 0.32, fontSize: 11.5, bold: hot, color: hot ? HEX.INK : HEX.BODY, valign: 'bottom' });
      T(s, u, { x: F.x + 3.05, y, w: 0.3, h: 0.32, fontSize: 11.5, color: HEX.STEEL, valign: 'bottom' });
      line(s, F.x + 3.3, y + 0.32, F.x + F.w - 0.3, y + 0.32, { color: hot ? HEX.FLAME : HEX.STEEL, width: hot ? 1.25 : 0.5, name: 'write-line' });
    });
  }

  // 9 · proof from Bromic venues
  {
    const s = L.content('Seats, Seasons And Return', 'Bromic Venues', 'Four Terraces That Stayed Open',
      'Four of our own published case studies (2 min); the details are on each page at bromic.com/case-study. Stella\'s Wine Bar at The Post Oak Hotel, Houston: four Eclipse pendants and two Platinum Electric heaters, laid out from a 2D heat plan by our design service. Rare Society, San Clemente: Platinum Electric heating semi-enclosed patios. A rooftop bar sixteen storeys up in Irvine: wind and window-washing rigs ruled out gas and perimeter mounts, so we mixed Eclipse Freestanding with hard-wired Tungsten Electric. Centrico, North Orange County: ceiling-mounted Platinum Gas, planned to meet fire code. Also worth telling: Kahite Golf Course in Tennessee built a covered patio of about 100 seats with nine Tungsten 6000 W, and the case study reports it doubled the club\'s seating. Some of these used earlier controls; today each would carry its Affinity controls and wall switch, as shown. We quote no revenue from any of them.');
    const V = [['w-stellas-bromic-eclipse-and-platinum-electric', 'Stella\'s Wine Bar', 'Houston, Texas', 'Four Eclipse pendants and two Platinum Electric, from our 2D heat plan.', 'Eclipse controller · Affinity Dimmer'],
      ['w-rare-society-platinum-electric-1', 'Rare Society', 'San Clemente, California', 'Platinum Electric over semi-enclosed patios.', 'Affinity On/Off or Dimmer · wall switch'],
      ['w-bromic-sep18th-18', 'A Rooftop Bar', 'Irvine, California', 'Sixteen storeys up: Eclipse Freestanding and hard-wired Tungsten Electric.', 'Eclipse Dimmer Controller · Affinity Dimmer'],
      ['w-bromic-centrico-photos', 'Centrico', 'North Orange County, California', 'Ceiling-mounted Platinum Gas, planned to meet fire code.', 'Affinity On/Off · wall switch']];
    const cw = (W - 2 * M - 3 * 0.3) / 4;
    V.forEach(([im, n, loc, d, c], i) => {
      const x = M + i * (cw + 0.3);
      pic(s, im, x, 1.85, cw, 2.3, 'cover', 'photo');
      H1(s, n, { x, y: 4.3, w: cw, h: 0.42, fontSize: 18 });
      T(s, loc.toUpperCase(), { x, y: 4.72, w: cw, h: 0.28, fontSize: 8.5, bold: true, color: HEX.STEEL, charSpacing: 1.5 });
      T(s, d, { x, y: 5.05, w: cw, h: 0.85, fontSize: 12.5 });
      rule(s, x, 5.95, cw, HEX.INK, 0.5);
      T(s, c, { x, y: 6.02, w: cw, h: 0.5, fontSize: 10.5, bold: true, color: HEX.INK });
    });
    SRC(s, 'Bromic case studies, bromic.com/case-study. Controls shown are today\'s equivalents. Wi-Fi and app features need compatible Affinity controls, sold separately.');
  }

  // 10 · divider
  L.divider({ n: '02', title: 'Gas Or *Electric*', line: 'What each asks of the space, and five years of fuel.', img: 'w-bromic-tungsten-gas-4', section: 'Gas Or Electric',
    notes: 'Part two (5 min). Both work beautifully on a terrace. They ask different things of the space and the budget.' });

  // 11 · the comparison table
  {
    const s = L.content('Gas Or Electric', 'For A Venue', 'What Each Fuel Asks Of The Space',
      'Read row by row (2 min). Under a roof, electric needs no gas line, no flue and no ventilation sums. Gas under a roof follows its ventilation rule: with a roof and more than two walls, at least 25% of the total wall area must be fully open, plus 30% of the rest. Gas heaters are never recessed; Tungsten Select, Coastal and Platinum electric recess flush with the low-clearance kit. Mounted gas heaters go at least 8 ft above the floor. Reach: Tungsten 6 kW up to 160 square feet, Platinum 4500 W 143, Eclipse 121; Tungsten Freestanding Gas up to 215, but never more than four seats a freestanding heater. Control: electric dims in 1% steps on the Affinity Dimmer, with zones and schedules in the app; gas is on and off, on the Affinity On/Off by zone (the product page says up to 10 gas heaters a channel, to confirm with the Product team) or a wall switch. Portable gas: where the International Fire Code applies, at least 5 ft from buildings, awnings and exits, with cylinders stored to NFPA 58 and your site plan. Always follow the manual and the local authority. Sources: Heat The Pergola guide (gas manual, FAQ), COM-BY-01 (IFC 605.5), COM-PP-01, product facts.');
    const hd = (t) => ({ text: t.toUpperCase(), options: { bold: true, color: HEX.WHITE, fill: { color: HEX.INK }, fontSize: 9, charSpacing: 2 } });
    const c0 = (t) => ({ text: t, options: { bold: true, color: HEX.INK } });
    const r = (t) => ({ text: t, options: {} });
    const rows = [[hd(''), hd('Electric'), hd('Gas')],
      [c0('Under a roof'), r('No gas line, flue or ventilation sums'), r('Roof and more than two walls: at least 25% of the total wall area fully open, plus 30% of the rest')],
      [c0('Recessed'), r('Flush with the low-clearance kit'), { text: 'Never', options: { bold: true, color: HEX.FLAME } }],
      [c0('Mounting'), r('Ceiling, wall, post, pole or pendant'), r('At least 8 ft above the floor, or freestanding')],
      [c0('Reach a heater'), r('Up to 160 ft² (Tungsten 6 kW); 143 (Platinum 4500 W); 121 (Eclipse)'), r('Up to 215 ft² (Tungsten Freestanding Gas), never more than 4 seats')],
      [c0('Control'), r('Affinity Dimmer in 1% steps, zones and schedules in the app; Eclipse controller'), r('On and off: Affinity On/Off by zone, or a wall switch')],
      [c0('Freestanding'), r('Eclipse Freestanding, with its own dimmer and remote'), r('5 ft from buildings, awnings and exits where the IFC applies; cylinders stored to NFPA 58')]];
    s.addTable(rows, { x: M, y: 1.85, w: 8.6, colW: [1.7, 3.2, 3.7], rowH: [0.4, 0.78, 0.5, 0.55, 0.78, 0.78, 0.78], fontFace: 'Arial', fontSize: 12.5, color: HEX.BODY, valign: 'middle', margin: [0.03, 0.12, 0.03, 0.12],
      border: [{ type: 'none' }, { type: 'none' }, { type: 'solid', pt: 0.5, color: 'C9C9C6' }, { type: 'none' }] });
    pic(s, 'w-sheraton-2', 9.55, 1.85, 3.18, 2.3, 'cover', 'photo');
    pic(s, 'w-tungsten-electric-ceiling-mounted-chile', 9.55, 4.3, 3.18, 2.3, 'cover', 'photo');
    T(s, 'Platinum Gas; Tungsten Electric.', { x: 9.55, y: 6.62, w: 3.18, h: 0.3, fontSize: 9, color: HEX.STEEL });
  }

  // 12 · five years of fuel
  {
    const s = L.content('Gas Or Electric', 'With These Inputs', 'Five Years Of Fuel For The Same 40 Seats',
      'The five-year comparison from our cost tool, A20, test case 1 (2 min). Same terrace: 40 seats, 800 square feet, partly covered, cool evenings. Seven Platinum 4500 W against ten Tungsten Freestanding Gas, on natural gas and on propane, 1,000 heater hours a year. Prices: 14.07 cents a kWh, 1.01 dollars a therm, 2.46 dollars a gallon (the article\'s EIA figures); a propane cylinder swap takes 10 minutes at 25 dollars an hour. Electric: 31,500 kWh, 4,432 dollars a year, 22,160 over five years. Natural gas: 3,800 therms, 3,838 a year, 19,190 over five. Propane: 4,153 gallons, 10,216 a year, plus 884 cylinder swaps, 147 hours, 3,683 dollars of handling a year: 69,499 over five. Purchase, installation and maintenance are left out, because the tool holds them as placeholders, and prices are held flat. The point: electric and natural gas run close; propane\'s cost is the cylinders. Every input is an assumption: run the tool with your state\'s prices. The tool\'s newer EIA defaults differ slightly; which set to use is still to confirm with Finance.');
    const C = [['Electric', '$22,160', '7 Platinum 4500 W', '31,500 kWh a year', '$4,432 a year · no handling'],
      ['Natural Gas', '$19,190', '10 Tungsten Freestanding Gas', '3,800 therms a year', '$3,838 a year · no handling'],
      ['Propane', '$69,499', '10 Tungsten Freestanding Gas', '4,153 gal a year', '$10,216 a year, plus 884 cylinder swaps']];
    const cw = (W - 2 * M - 2 * 0.4) / 3;
    C.forEach(([h, f, n, e, d], i) => {
      const x = M + i * (cw + 0.4);
      kick(s, h, x, 1.9, cw, i === 2 ? HEX.FLAME : HEX.STEEL);
      stat(s, f, 'fuel and handling, five years', x, 2.25, cw, { size: 56, h: 1.0, lh: 0.4, ls: 12, lc: HEX.STEEL, color: i === 2 ? HEX.FLAME : HEX.INK });
      [n, e, d].forEach((t, j) => {
        const y = 4.0 + j * 0.5;
        rule(s, x, y, cw, 'C9C9C6', 0.5);
        T(s, t, { x, y: y + 0.07, w: cw, h: 0.4, fontSize: 13, color: HEX.INK, bold: j === 0 });
      });
    });
    box(s, M, 5.75, W - 2 * M, 0.8, HEX.WASH, 'inputs');
    T(s, 'WITH THESE INPUTS', { x: M + 0.3, y: 5.82, w: 3, h: 0.25, fontSize: 9, bold: true, color: HEX.FLAME, charSpacing: 3 });
    T(s, '40 seats, partly covered, cool · 1,000 heater hours a year · 14.07¢/kWh, $1.01/therm, $2.46/gal · 10 min a swap at $25/h · purchase, install and maintenance left out', { x: M + 0.3, y: 6.08, w: W - 2 * M - 0.6, h: 0.42, fontSize: 12, color: HEX.INK });
  }

  // 13 · check 1
  L.quiz({ section: 'Gas Or Electric', n: 1, q: 'Your Terrace Has A Solid Soffit. Can You Recess A Gas Heater In It?',
    options: ['Yes, with the low-clearance recess kit.', 'No. Gas heaters are never recessed.', 'Only on propane.', 'Only above 10 ft.'],
    answer: 1, why: 'Gas heaters cannot be recessed. For a flush look in a solid soffit, use Tungsten Select or Coastal (7.5 in cavity) or Platinum Electric (7.1 in) in the low-clearance kit, each on its Affinity controller with a wall switch. Source: Heat The Pergola guide (FAQ, gas manual). Allow 1 minute.' });

  // 14 · divider
  L.divider({ n: '03', title: 'Zones And *Controls*', line: 'Warmth that follows the floor, and the book.', img: 'd-tungsten-suspended-restaurant', section: 'Zones And Controls',
    notes: 'Part three (10 min with the exercise). Zones by area, zones by time of day, the controls for each, and the building management system.' });

  // 15 · zones by area: a drawn terrace plan and the five zones
  {
    const s = L.content('Zones And Controls', 'Zones By Area', 'Draw The Zones Around The Way You Serve',
      'Outdoor heat cannot be run from a thermostat, so the zones and the team do that work (2 min). Draw zones around service, and let the wiring follow. Bar rail and standing: busy early, empties late. Main dining: follows the reservations. Edge and overflow, the perimeter and the windward side: opens only when busy or windy. Lounge or waiting: short dwell, lower output. Event or private: runs on its own schedule. Each zone has its own controller channel: an Affinity On/Off or Dimmer for Tungsten and Platinum, the Affinity Eclipse controller for Eclipse, with a wall switch. A small terrace may need only two zones. Source: COM-BY-01.');
    // plan
    const X = M, Y = 1.95, PW = 6.0, PH = 4.65;
    box(s, X, Y, PW, PH, null, 'terrace', { line: HEX.INK, lw: 1 });
    const Z = [[X, Y, PW, 0.95, HEX.WASH, 'Bar rail', 'Busy early, empties late'], [X, Y + 0.95, 4.2, 2.6, 'FFFFFF', 'Main dining', 'Follows the reservations'],
      [X + 4.2, Y + 0.95, 1.8, 3.7, HEX.GREY, 'Edge', 'Windward, when busy'], [X, Y + 3.55, 2.3, 1.1, 'FBEDE8', 'Lounge', 'Short dwell, lower'], [X + 2.3, Y + 3.55, 1.9, 1.1, 'EFEFED', 'Event', 'Own schedule']];
    Z.forEach(([x, y, w, h, f, n, d], i) => {
      box(s, x, y, w, h, f, 'zone', { line: HEX.STEEL, lw: 0.5, dash: 'dash' });
      num(s, i + 1, x + 0.15, y + 0.1, { size: 16, h: 0.35, w: 0.45 });
      H1(s, n, { x: x + 0.6, y: y + 0.1, w: w - 0.7, h: 0.35, fontSize: 15 });
      T(s, d, { x: x + 0.6, y: y + 0.45, w: w - 0.7, h: 0.3, fontSize: 10, color: HEX.STEEL });
    });
    for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) box(s, X + 0.55 + c * 0.9, Y + 1.85 + r * 0.75, 0.5, 0.42, HEX.WHITE, 'table', { line: HEX.INK, lw: 0.75 });
    for (let k = 0; k < 9; k++) box(s, X + 0.4 + k * 0.6, Y + 0.72, 0.16, 0.16, HEX.LINE, 'stool');
    line(s, X + PW + 0.1, Y + 2.8, X + PW + 0.55, Y + 2.8, { color: HEX.STEEL, width: 1.25, begin: 'triangle', name: 'wind' });
    T(s, 'WIND', { x: X + PW + 0.08, y: Y + 2.45, w: 0.6, h: 0.25, fontSize: 8, bold: true, color: HEX.STEEL, charSpacing: 2 });
    // right: the rule
    const rx = 7.45, rw = W - M - rx;
    L.icon(s, 'zones', rx, 1.95, 0.6);
    rule(s, rx, 2.7, rw);
    H1(s, 'One controller channel a zone', { x: rx, y: 2.82, w: rw, h: 0.5, fontSize: 21 });
    T(s, 'Affinity On/Off or Dimmer for Tungsten and Platinum; the Affinity Eclipse controller for Eclipse; a wall switch for every zone.', { x: rx, y: 3.38, w: rw, h: 0.95, fontSize: 14 });
    rule(s, rx, 4.5, rw, HEX.FLAME, 1.5);
    H1(s, 'Zone the service, then let the wiring follow.', { x: rx, y: 4.62, w: rw, h: 0.8, fontSize: 19 });
    T(s, 'A small terrace may need only two zones.', { x: rx, y: 5.45, w: rw, h: 0.4, fontSize: 13, color: HEX.STEEL });
  }

  // 16 · zones by time of day
  {
    const s = L.content('Zones And Controls', 'Zones By Time Of Day', 'Let The Heat Follow The Book',
      'An example evening, not a rule: your hours will differ (2 min). Bromic medium-wave electric heaters warm in about 30 seconds (Planning Guide v1.2), so bring each zone on as its first tables are seated, not an hour ahead. The bar rail comes on first. Main dining rises with the reservations. The windward edge comes on only once guests sit there. On milder nights dim the output, or use Eclipse\'s 33, 66 and 100% steps. Timers switch each zone off a set time after its last cover, and a firm schedule turns everything off at close, so nothing depends on memory at the end of a long night. Schedules and timers need compatible Affinity controls and the Bromic app, sold separately. Source: COM-BY-01, product facts.');
    const hrs = ['5 PM', '6', '7', '8', '9', '10', '11', 'Close'];
    const gx = 2.95, gw = W - M - gx - 0.35, step = gw / 7, top = 1.95;
    hrs.forEach((h, i) => { T(s, h, { x: gx + i * step - 0.4, y: top, w: 0.8, h: 0.28, fontSize: 10, color: HEX.STEEL, align: 'center' }); line(s, gx + i * step, top + 0.32, gx + i * step, top + 3.55, { color: HEX.LINE, width: 0.5, name: 'hour' }); });
    // each zone: [label, [[from, to, full?], ...]]
    const Z = [['Bar rail', [[0, 4, 1], [4, 6.2, 0]]], ['Main dining', [[0.7, 1.4, 0], [1.4, 4.6, 1], [4.6, 5.8, 0]]], ['Edge', [[2, 4, 1]]], ['Lounge', [[3, 6.5, 0]]]];
    Z.forEach(([n, segs], i) => {
      const y = top + 0.5 + i * 0.72;
      rule(s, M, y, W - 2 * M, 'C9C9C6', 0.5);
      H1(s, n, { x: M, y: y + 0.1, w: 2.2, h: 0.55, fontSize: 18, valign: 'middle' });
      segs.forEach(([a, b, full]) => box(s, gx + a * step, y + 0.24, (b - a) * step, 0.3, full ? HEX.FLAME : 'F6B3A4', 'heat'));
    });
    box(s, gx + 7 * step - 0.03, top + 0.4, 0.06, 2.95, HEX.INK, 'close-line');
    // legend and the three rules
    box(s, gx, top + 3.55, 0.4, 0.16, HEX.FLAME, 'key'); T(s, 'Full', { x: gx + 0.5, y: top + 3.48, w: 0.9, h: 0.3, fontSize: 10, color: HEX.STEEL });
    box(s, gx + 1.3, top + 3.55, 0.4, 0.16, 'F6B3A4', 'key'); T(s, 'Dimmed', { x: gx + 1.8, y: top + 3.48, w: 1.2, h: 0.3, fontSize: 10, color: HEX.STEEL });
    T(s, 'An example evening', { x: W - M - 3, y: top + 3.48, w: 3, h: 0.3, fontSize: 10, color: HEX.STEEL, align: 'right' });
    const P = [['On As Tables Are Seated', 'Electric warms in about 30 seconds.'], ['Dimmed On Mild Nights', 'Or Eclipse at 33, 66 or 100%.'], ['Off By Schedule', 'Timers after the last cover; all off at close.']];
    const cw = (W - 2 * M - 2 * 0.35) / 3;
    P.forEach(([h, d], i) => {
      const x = M + i * (cw + 0.35);
      num(s, i + 1, x, 5.9, { size: 22, h: 0.45, w: 0.6 });
      H1(s, h, { x: x + 0.65, y: 5.88, w: cw - 0.65, h: 0.4, fontSize: 16 });
      T(s, d, { x: x + 0.65, y: 6.28, w: cw - 0.65, h: 0.35, fontSize: 12 });
    });
  }

  // 17 · the controls for each zone
  {
    const s = L.content('Zones And Controls', 'Controls', 'Every Heater Arrives With Its Controls',
      'The controls for each kind of zone (1.5 min). Tungsten and Platinum electric: an Affinity On/Off, or the Dimmer for output in 1% steps, in 1, 2 or 5 channels, each up to 6 kW at 208–277 V; Tungsten 4000 and 6000 W also run on 277 V, the supply many restaurants and hotels have. Eclipse: the Affinity Eclipse controller, one Eclipse a channel, heat and light set separately; Eclipse Freestanding comes with its own Eclipse Dimmer Controller and remote. Mounted gas: on and off, on the Affinity On/Off by zone. And a wall switch, 20 A, 120–277 V, for every zone. The app adds zones, schedules and timers; Wi-Fi and app features need compatible Affinity controls, sold separately. Controller capacities are to confirm on the current cut sheet with the Product team. Sources: A25, product facts, deck B3.');
    const P = [['w-platinum-black', 'Tungsten And Platinum Electric', 'Affinity On/Off or Dimmer', '1, 2 or 5 channels, each up to 6 kW at 208–277 V.'],
      ['w-eclipse-electric', 'Eclipse', 'Affinity Eclipse controller', 'One Eclipse a channel, heat and light set separately.'],
      ['w-tungsten-gas-500', 'Mounted Gas', 'Affinity On/Off', 'On and off, by zone.'],
      ['w-manual-1ch-indoor-switch-image', 'Every Zone', 'A wall switch', '20 A, 120–277 V, single or dual.']];
    const cw = (W - 2 * M - 3 * 0.3) / 4;
    P.forEach(([im, h, c, d], i) => {
      const x = M + i * (cw + 0.3);
      pic(s, im, x + 0.2, 1.9, cw - 0.4, 1.9, 'contain', 'product');
      T(s, h.toUpperCase(), { x, y: 3.95, w: cw, h: 0.28, fontSize: 9, bold: true, charSpacing: 2, color: HEX.STEEL });
      rule(s, x, 4.3, cw, i === 3 ? HEX.FLAME : HEX.INK, i === 3 ? 1.5 : 0.75);
      H1(s, c, { x, y: 4.42, w: cw, h: 0.75, fontSize: 20 });
      T(s, d, { x, y: 5.2, w: cw, h: 0.65, fontSize: 13 });
    });
    box(s, M, 6.0, W - 2 * M, 0.65, HEX.GREY, 'app-strip');
    L.icon(s, 'app', M + 0.2, 6.05, 0.55);
    T(s, 'The Bromic app adds zones, schedules and timers. Wi-Fi and app features need compatible Affinity controls, sold separately.', { x: M + 0.95, y: 6.0, w: W - 2 * M - 1.2, h: 0.65, fontSize: 13, color: HEX.INK, valign: 'middle' });
  }

  // 18 · the BMS
  {
    const s = L.content('Zones And Controls', 'Building Management', 'On The BMS, The Building Runs The Heat',
      'For hotels and larger venues the building management system often runs the heat (1.5 min). The Affinity expansion board adds Ethernet and 0–10 V. It is built into the 5-channel controller and added to the 1- and 2-channel ones. Say this clearly to the facilities team: in BMS mode the app is disabled, so the building system becomes the control, including schedules. Alexa and Google Assistant need no board. Control4, Crestron and Lutron are supported where compatible; it may need extra integration hardware or configuration. Sources: A25 (Affinity product pages), deck B3.');
    // diagram: heaters -> controller with board -> two modes
    const y0 = 2.15;
    [0, 1, 2].forEach((k) => { const hy = y0 + 0.35 + k * 0.85; box(s, M, hy, 1.4, 0.16, HEX.INK, 'heater'); box(s, M + 0.06, hy + 0.11, 1.28, 0.05, HEX.FLAME, 'glow'); line(s, M + 1.4, hy + 0.08, M + 2.15, y0 + 1.25, { color: HEX.INK, width: 1 }); });
    lab(s, 'Heaters, one channel a zone', M, y0 + 2.75, 2.2, { color: HEX.INK, bold: true });
    box(s, M + 2.15, y0 + 0.25, 1.7, 2.0, HEX.INK, 'controller');
    T(s, 'AFFINITY', { x: M + 2.15, y: y0 + 0.4, w: 1.7, h: 0.3, fontSize: 9, bold: true, color: HEX.FLAME, charSpacing: 2, align: 'center' });
    T(s, '5-channel controller', { x: M + 2.25, y: y0 + 0.75, w: 1.5, h: 0.5, fontSize: 11, color: HEX.WHITE, align: 'center' });
    box(s, M + 2.35, y0 + 1.45, 1.3, 0.55, HEX.FLAME, 'board');
    T(s, 'Expansion board', { x: M + 2.35, y: y0 + 1.45, w: 1.3, h: 0.55, fontSize: 10, bold: true, color: HEX.WHITE, align: 'center', valign: 'middle' });
    // BMS branch
    line(s, M + 3.85, y0 + 1.72, M + 4.9, y0 + 1.72, { color: HEX.FLAME, width: 2, end: 'triangle' });
    T(s, 'Ethernet or\n0–10 V', { x: M + 3.85, y: y0 + 1.8, w: 1.05, h: 0.45, fontSize: 9, bold: true, color: HEX.FLAME, align: 'center' });
    box(s, M + 4.95, y0 + 1.3, 1.65, 0.85, HEX.WASH, 'bms');
    H1(s, 'BMS', { x: M + 4.95, y: y0 + 1.3, w: 1.65, h: 0.85, fontSize: 24, align: 'center', valign: 'middle' });
    // app branch, disabled
    line(s, M + 3.85, y0 + 0.55, M + 4.9, y0 + 0.55, { color: 'C9C9C6', width: 1.5, dash: 'dash' });
    box(s, M + 4.95, y0 + 0.2, 1.65, 0.7, null, 'app', { line: 'C9C9C6', lw: 1, dash: 'dash' });
    T(s, 'App', { x: M + 4.95, y: y0 + 0.2, w: 1.65, h: 0.7, fontSize: 16, color: 'B9B5B0', align: 'center', valign: 'middle', fontFace: 'Bodoni MT' });
    T(s, 'Disabled in BMS mode', { x: M + 4.75, y: y0 - 0.15, w: 2.1, h: 0.3, fontSize: 9.5, bold: true, color: HEX.STEEL, align: 'center' });
    // right column: the points
    const rx = 8.0, rw = W - M - rx;
    const pts = [['Ethernet And 0–10 V', 'Through the expansion board.'], ['Built Into The 5-Channel', 'Added to the 1- and 2-channel controllers.'], ['BMS Mode Disables The App', 'The building system becomes the control.'], ['Home Systems Where Compatible', 'Control4, Crestron, Lutron; may need extra hardware.']];
    pts.forEach(([h, d], i) => {
      const y = 1.95 + i * 1.18;
      rule(s, rx, y, rw, i === 2 ? HEX.FLAME : HEX.INK, i === 2 ? 1.5 : 0.75);
      H1(s, h, { x: rx, y: y + 0.1, w: rw, h: 0.45, fontSize: 18, color: i === 2 ? HEX.FLAME : HEX.INK });
      T(s, d, { x: rx, y: y + 0.55, w: rw, h: 0.5, fontSize: 13 });
    });
    pic(s, 'w-expansion-board', M, 5.15, 2.4, 1.6, 'contain', 'expansion-board');
    rule(s, M + 2.7, 5.55, 4.0, HEX.INK, 0.5);
    T(s, 'The Affinity expansion board: built into the 5-channel controller, added to the 1- and 2-channel.', { x: M + 2.7, y: 5.65, w: 4.0, h: 0.7, fontSize: 12, color: HEX.INK });
  }

  // 19 · exercise 2: zone a terrace
  {
    const s = L.exercise({ section: 'Zones And Controls', n: 2, minutes: 10, title: 'Zone A Terrace',
      task: 'A hotel terrace under a louvered pergola, 9 ft to the beams, cool evenings. The hotel runs a BMS. Zone it and size it.',
      steps: ['Draw the zones around the service: bar, dining, edge.', 'Size each zone: seats × 20 ft² ÷ (heat area × 0.85).', 'Choose the controllers and count the channels.', 'Write the evening schedule, and say who runs it: app or BMS.'],
      img: WHITE,
      notes: 'Ten minutes in pairs (1 to set up, 7 to work, 2 to debrief). Model answer, with Tungsten Select 6 kW on the beams (160 square feet, 8 to 12 ft, so 9 ft suits it). Bar rail, 12 seats: 240 square feet ÷ (160 × 0.85) = 1.76, two heaters. Main dining, 32 seats: 640 ÷ 136 = 4.71, five. Windward edge, 12 seats: 240 ÷ 136 = 1.76, two. Nine heaters; each 6 kW heater fills one Affinity Dimmer channel (up to 6 kW at 208–277 V), so nine channels: two 5-channel Dimmers, one for dining and one for bar and edge with a spare channel for later. A wall switch for each zone. A modern hotel might prefer Platinum 4500 W (143, 8–10 ft): two, six and two, ten heaters, same logic. Because the hotel runs a BMS, the 5-channel controllers\' built-in expansion board connects over Ethernet or 0–10 V; in BMS mode the app is disabled, so the schedule lives in the BMS. Schedule: bar on at opening, dining on as the first tables are seated, edge only when busy or windy, dimmed on milder nights, timers off after each zone\'s last cover, all off at close. Debrief: did anyone zone by heater instead of by service? Did every zone get its wall switch? Bromic\'s design service would confirm the count and positions (calculation-model.md; COM-BY-01; A25).' });
    const F = { x: 7.35, y: 1.85, w: 5.38, h: 4.9 };
    const X = F.x + 0.45, Y = F.y + 0.55, PW = 4.0, PH = 3.85;
    box(s, X, Y, PW, PH, null, 'terrace', { line: HEX.INK, lw: 1, dash: 'dash' });
    T(s, 'PERGOLA · 9 FT TO THE BEAMS', { x: X, y: F.y + 0.18, w: 4.5, h: 0.28, fontSize: 8.5, bold: true, color: HEX.STEEL, charSpacing: 2 });
    // bar counter and stools
    box(s, X + 0.25, Y + 0.2, PW - 0.5, 0.28, HEX.INK, 'bar-counter');
    for (let k = 0; k < 12; k++) box(s, X + 0.32 + k * 0.285, Y + 0.6, 0.15, 0.15, HEX.LINE, 'stool');
    lab(s, 'Bar rail, 12', X + 0.25, Y + 0.8, 2, { color: HEX.INK, bold: true, size: 10 });
    // dining: 8 tables of 4
    for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) {
      const tx = X + 0.3 + c * 0.72, ty = Y + 1.35 + r * 0.95;
      box(s, tx, ty, 0.42, 0.42, HEX.WHITE, 'table', { line: HEX.INK, lw: 0.75 });
      [[0.13, -0.17], [0.13, 0.47], [-0.17, 0.13], [0.47, 0.13]].forEach(([a, b]) => box(s, tx + a, ty + b, 0.12, 0.12, HEX.LINE, 'chair'));
    }
    lab(s, 'Dining, 32', X + 0.3, Y + 3.25, 2, { color: HEX.INK, bold: true, size: 10 });
    // edge: 6 two-tops on the right
    for (let k = 0; k < 6; k++) { const ty = Y + 1.2 + k * 0.42; box(s, X + PW - 0.62, ty, 0.3, 0.26, HEX.WHITE, 'two-top', { line: HEX.INK, lw: 0.75 }); box(s, X + PW - 0.84, ty + 0.07, 0.12, 0.12, HEX.LINE, 'chair'); box(s, X + PW - 0.22, ty + 0.07, 0.12, 0.12, HEX.LINE, 'chair'); }
    lab(s, 'Edge, 12', X + PW - 1.05, Y + 0.8, 1.0, { color: HEX.INK, bold: true, size: 10, align: 'right' });
    line(s, X + PW + 0.15, Y + 2.2, X + PW + 0.75, Y + 2.2, { color: HEX.FLAME, width: 1.5, begin: 'triangle', name: 'wind' });
    T(s, 'WIND', { x: X + PW + 0.15, y: Y + 1.85, w: 0.7, h: 0.25, fontSize: 8, bold: true, color: HEX.FLAME, charSpacing: 2 });
    T(s, 'Seats only; sizes from 20 ft² a seat.', { x: F.x + 0.45, y: F.y + F.h - 0.4, w: 4.5, h: 0.28, fontSize: 10, color: HEX.STEEL });
  }

  // 20 · check 2
  L.quiz({ section: 'Zones And Controls', n: 2, q: 'The Hotel Wants Its BMS To Run The Terrace. What Changes?',
    options: ['Nothing: the app and the BMS both run it.', 'The heaters must be changed to gas.', 'The expansion board connects it, and the app is disabled.', 'Each heater needs its own Wi-Fi router.'],
    answer: 2, why: 'The Affinity expansion board adds Ethernet and 0–10 V (built into the 5-channel controller). In BMS mode the app is disabled and the building system becomes the control, schedules included. Source: A25, deck B3. Allow 1 minute.' });

  // 21 · divider
  L.divider({ n: '04', title: 'Care And *Maintenance*', line: 'A short routine, and licensed trades for the rest.', img: 'w-platinum-gas-sheraton-carlsbad-ca-usa', section: 'Care And Maintenance',
    notes: 'Part four (3 min). How to keep a heated terrace looking and working the way it did on the first night.' });

  // 22 · the care table and a long-lived terrace
  {
    const s = L.content('Care And Maintenance', 'Season After Season', 'Clean Weekly, Inspect Monthly, Service By Licensed Trades',
      'The routine (1.5 min). Staff wipe housings and fascias once they are cool, and check grilles for debris, cobwebs and nests, weekly in season. A manager checks brackets, poles and fixings, and cords, wall switches and controllers, monthly. A licensed gas fitter checks hoses, regulators and connections, and a licensed electrician checks circuits and connections, at the start of each season and as the manual says. By the coast, Bromic\'s manuals ask for salt spray to be wiped off, a fortnightly clean and a yearly check by a qualified technician. Off-season, cover or store portable units. Always let a heater cool first, keep water off the element, and leave sealed units closed. The model\'s manual always takes precedence; Bromic\'s recommended intervals per model are still to confirm with the Product team. On the right, the Sheraton Carlsbad case study: 15 Platinum Gas heaters on a 120-seat resort patio installed around 2008 needed only a few modular parts swapped after about twelve coastal years. Today they would run on an Affinity On/Off controller by zone, with a wall switch. Sources: COM-BY-01, Heat The Pergola guide (manuals), Bromic case study.');
    const hd = (t) => ({ text: t.toUpperCase(), options: { bold: true, color: HEX.WHITE, fill: { color: HEX.INK }, fontSize: 9, charSpacing: 2 } });
    const r = (t, o = {}) => ({ text: t, options: o });
    const rows = [[hd('Task'), hd('Who'), hd('How often')],
      [r('Wipe housing and fascia, once cool', { color: HEX.INK }), r('Staff'), r('Weekly in season')],
      [r('Check grilles for debris and nests', { color: HEX.INK }), r('Staff'), r('Weekly in season')],
      [r('Brackets, poles, cords, switches, controllers', { color: HEX.INK }), r('Manager'), r('Monthly')],
      [r('Gas hoses, regulator, connections', { color: HEX.INK }), r('Licensed gas fitter'), r('Season start, per manual')],
      [r('Circuits and connections', { color: HEX.INK }), r('Licensed electrician'), r('Season start, per manual')],
      [r('By the coast: wipe off salt spray', { color: HEX.INK, bold: true }), r('Staff, then a technician'), r('Fortnightly; checked yearly')]];
    s.addTable(rows, { x: M, y: 1.85, w: 7.4, colW: [3.5, 2.0, 1.9], rowH: [0.4, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55], fontFace: 'Arial', fontSize: 12.5, color: HEX.BODY, valign: 'middle', margin: [0.03, 0.12, 0.03, 0.12],
      border: [{ type: 'none' }, { type: 'none' }, { type: 'solid', pt: 0.5, color: 'C9C9C6' }, { type: 'none' }] });
    T(s, 'General guidance. The model\'s manual always comes first; anything beyond cleaning belongs with a licensed trade.', { x: M, y: 5.95, w: 7.4, h: 0.5, fontSize: 11, color: HEX.STEEL });
    const px = 8.35, pw = W - M - px;
    pic(s, 'w-sheraton-1', px, 1.85, pw, 2.2, 'cover', 'photo');
    box(s, px, 4.05, pw, 2.7, HEX.INK, 'case');
    kick(s, 'Sheraton Carlsbad', px + 0.3, 4.25, pw - 0.6);
    H1(s, '15 Platinum Gas, 120 seats, by the sea since about 2008', { x: px + 0.3, y: 4.55, w: pw - 0.6, h: 1.1, fontSize: 19, color: HEX.WHITE });
    T(s, 'About twelve coastal years on, only a few modular parts swapped. Bromic case study.', { x: px + 0.3, y: 5.7, w: pw - 0.6, h: 0.85, fontSize: 12.5, color: 'E6E2DE' });
  }

  // 23 · the shift routine
  {
    const s = L.content('Care And Maintenance', 'Every Shift', 'One Page At The Host Stand',
      'Keep it to one page, at the host stand and in the app (1 min). Opening: a visual check, heaters undamaged, grilles clear, nothing hung on or near them; umbrellas, banners and décor clear of the heaters per the manual; portable gas upright, wheels locked, at least 5 ft from buildings, awnings and exits where the International Fire Code applies; switch on by zone as tables are seated. During service: adjust output by zone so guests can stay where they are; report any odour, flicker, tripped breaker or damage to the manager and switch that unit off. Closing: confirm every zone is off in the app or at the wall switch; close the cylinder valve on portable gas and store it per the site plan; log faults for the maintenance contractor. Source: COM-BY-01 (IFC 2021 §605.5).');
    const C = [['Opening', ['Heaters undamaged, grilles clear, nothing hung on them.', 'Umbrellas and décor clear of every heater.', 'Portable gas upright, wheels locked, 5 ft from buildings and exits.', 'On by zone as tables are seated.']],
      ['During Service', ['Adjust output by zone, so guests stay where they sit.', 'Odour, flicker, a tripped breaker or damage: switch that unit off and tell the manager.']],
      ['Closing', ['Every zone off, in the app or at the wall switch.', 'Portable gas: cylinder valve closed, stored per the site plan.', 'Faults logged for the maintenance contractor.']]];
    const cw = (W - 2 * M - 2 * 0.4) / 3;
    C.forEach(([h, items], i) => {
      const x = M + i * (cw + 0.4);
      H1(s, h, { x, y: 1.9, w: cw, h: 0.55, fontSize: 24, color: i === 0 ? HEX.FLAME : HEX.INK });
      rule(s, x, 2.5, cw, HEX.INK, 1.25);
      items.forEach((t, j) => {
        const y = 2.65 + j * 0.95;
        num(s, j + 1, x, y, { size: 18, h: 0.4, w: 0.55 });
        T(s, t, { x: x + 0.6, y: y + 0.04, w: cw - 0.6, h: 0.8, fontSize: 13.5, color: HEX.INK });
        if (j < items.length - 1) rule(s, x + 0.6, y + 0.86, cw - 0.6, HEX.LINE, 0.5);
      });
    });
    SRC(s, 'Source: COM-BY-01; International Fire Code 2021, §605.5, where it applies. Follow the manual and your local authority.');
  }

  // 24 · the design service
  {
    const s = L.content('Care And Maintenance', 'The Design Service', 'Send Us The Floor Plan. We Draw The Terrace.',
      'Our design service is free (1 min). Send a floor plan or photos to bromic.com/design-your-space, or call 1-800-301-1293, Monday to Friday, 9 am to 4 pm Pacific. We return heater selection, placement and coverage drawings, with the zones and controls the space needs, as we did for Stella\'s Wine Bar in Houston with a 2D heat plan. For a group, start each new site from the last one\'s layout and keep zone names, controllers and routines the same, so a manager who moves between sites knows the system on day one. Sources: Lookbook 2026, COM-BY-01, Stella\'s case study.');
    pic(s, 'w-stellas-wine-bar-houston-tx-3', M, 1.85, 6.6, 4.9, 'cover', 'photo');
    const rx = 7.65, rw = W - M - rx;
    [['Send', 'A floor plan or photos, with the seating marked.'], ['We Draw', 'Heaters, positions, coverage, zones and controls.'], ['You Repeat', 'Each new site starts from the last one\'s layout.']].forEach(([h, d], i) => {
      const y = 1.85 + i * 1.25;
      rule(s, rx, y, rw);
      num(s, i + 1, rx, y + 0.1, { size: 34, h: 0.7, w: 0.9 });
      H1(s, h, { x: rx + 0.95, y: y + 0.15, w: rw - 0.95, h: 0.45, fontSize: 20 });
      T(s, d, { x: rx + 0.95, y: y + 0.6, w: rw - 0.95, h: 0.55, fontSize: 13 });
    });
    box(s, rx, 5.75, rw, 1.0, HEX.INK, 'contact');
    T(s, 'bromic.com/design-your-space', { x: rx + 0.3, y: 5.85, w: rw - 0.6, h: 0.4, fontSize: 17, color: HEX.WHITE, fontFace: 'Bodoni MT' });
    T(s, '1-800-301-1293 · Mon–Fri, 9–4 PT', { x: rx + 0.3, y: 6.25, w: rw - 0.6, h: 0.35, fontSize: 12, color: 'E6E2DE' });
    T(s, 'Stella\'s Wine Bar, Houston: laid out from our 2D heat plan.', { x: M, y: 6.78, w: 6.6, h: 0.2, fontSize: 9, color: HEX.STEEL });
  }

  // 25 · closing
  L.closing({ section: 'Close', title: 'Heat The Seats You Can *Fill*',
    points: ['Run the payback on your own numbers.', 'Size from seats: 20 ft² a seat, coverage × 0.85.', 'Gas follows its ventilation rule; never recessed.', 'One channel a zone, a wall switch for each.', 'Clean weekly; licensed trades each season.'],
    next: 'Next: run the payback calculator with your own figures, and send us your floor plan.', img: 'rv-ts2-ai-06',
    notes: 'Close (1 min). Read the five habits. Ask each operator to name the input they are least sure of, usually the share of seats filled, and how they will find out: their own booking data from last shoulder season. Leave the payback calculator (A21) and the five-year cost tool (A20) with them, and offer the design service for their floor plan.' });

  await L.finish('Bromic-Hospitality-Heated-Seats-Paid-Back');
}
main().catch((e) => { console.error(e); process.exit(1); });
