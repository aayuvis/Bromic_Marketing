// Training Hub · Dealer track · B2: The Bromic Portfolio (30–45 min).
// Facts: data/product-marketing/*.json (pillars, tiers), reports/white-papers/pergola-2027/content.py (coverage, heights,
// gas rule, Affinity), reports/white-papers/portfolio-applications/content.py (APPS and the application cards).
// Run: NODE_PATH=$PWD/node_modules node b2-bromic-portfolio.js
const L = require('./lib');
const { T, H1, card, ico, pic, HEX, M } = L;

const ICONS = ['LuZap', 'LuFuel', 'LuHouse', 'LuTrees', 'LuWaves', 'LuAnchor', 'LuSlidersHorizontal', 'LuThermometer', 'LuRuler',
  'LuShieldCheck', 'LuPalette', 'LuLayers', 'LuSun', 'LuWind', 'LuRotateCw', 'LuPlug', 'LuSmartphone', 'LuLampCeiling', 'LuMapPin',
  'LuSearch', 'LuEye', 'LuSparkles', 'LuWifi', 'LuKey', 'LuTarget', 'LuSofa', 'LuStore'];

async function main() {
  L.start({ title: 'The Bromic Portfolio', footer: 'Dealer Training · The Bromic Portfolio', icons: ICONS });
  await L.prepIcons(ICONS);

  // A series page: big photo left, four facts right, the controls in an ink band below them.
  function series({ section, kicker, title, img, mode = 'cover', facts, controls, notes }) {
    const s = L.content(section, kicker, title, notes);
    pic(s, img, M, 1.85, 6.1, 4.9, mode, 'series-image');
    const x = 7.05, w = 5.68;
    facts.forEach(([ic, t], i) => {
      const y = 1.9 + i * 0.86;
      ico(s, ic, x, y, 0.56, 'light');
      T(s, t, { x: x + 0.75, y: y - 0.04, w: w - 0.75, h: 0.72, fontSize: 15, color: HEX.INK, valign: 'middle' });
    });
    card(s, x, 5.45, w, 1.3, HEX.INK, 'controls');
    ico(s, 'LuSlidersHorizontal', x + 0.25, 5.79, 0.62, 'solid');
    T(s, 'CONTROLS', { x: x + 1.05, y: 5.6, w: w - 1.25, h: 0.3, fontSize: 11, bold: true, charSpacing: 3, color: HEX.FLAME });
    T(s, controls, { x: x + 1.05, y: 5.9, w: w - 1.25, h: 0.75, fontSize: 14, color: HEX.WHITE });
    return s;
  }

  // 1 · cover
  L.cover({
    kicker: 'Dealer Training · B2', title: 'The Bromic Portfolio',
    sub: 'Every heater, where it goes, and the controls that go with it.',
    meta: '30–45 minutes · 3 exercises · 2 knowledge checks', img: 'l-004-012',
    notes: 'Welcome. By the end of this session you should be able to look at any outdoor space and say which Bromic heater to show first, and which controls go with it. Three exercises and two quick checks along the way.',
  });

  // 2 · one family
  {
    const s = L.content('Welcome', 'The Range', 'One Family For Every Outdoor Room',
      'Eight heater families, one brand. Electric on ceilings, walls, posts and recesses: Tungsten Series II, Tungsten Coastal and Platinum Electric. Heat and light in one: the Eclipse pendant and Eclipse Freestanding. Gas, mounted: Tungsten Gas and Platinum Gas. And gas that moves: Tungsten Freestanding Gas. Electric heaters run on Affinity controls and the Bromic app.');
    const P = [
      ['pf-tungsten-series-ii', 'Tungsten Series II', 'Electric'], ['pf-tungsten-coastal', 'Tungsten Coastal', 'Electric · by the water'],
      ['pf-platinum-electric', 'Platinum Electric', 'Electric · and Marine'], ['pf-eclipse-pendant', 'Eclipse Pendant', 'Electric · heat and light'],
      ['pf-eclipse-freestanding', 'Eclipse Freestanding', 'Electric · freestanding'], ['pf-tungsten-gas', 'Tungsten Gas', 'Gas · mounted'],
      ['pf-platinum-gas', 'Platinum Gas', 'Gas · mounted'], ['pf-tungsten-freestanding-gas', 'Tungsten Freestanding', 'Gas · freestanding'],
    ];
    const cw = 2.83, ih = 1.55;
    P.forEach(([im, n, t], i) => {
      const x = M + (i % 4) * (cw + 0.26), y = 1.85 + Math.floor(i / 4) * 2.5;
      pic(s, im, x, y, cw, ih, 'cover', 'product');
      H1(s, n, { x, y: y + ih + 0.08, w: cw, h: 0.4, fontSize: 17 });
      T(s, t, { x, y: y + ih + 0.5, w: cw, h: 0.3, fontSize: 12, color: HEX.FLAME, bold: true });
    });
  }

  // 3 · divider
  L.divider({ n: '01', title: 'How To Choose', line: 'Fuel, mount and setting: three questions narrow it to one heater.', img: 'w-aba-restaurant', icon: 'LuSearch',
    notes: 'Module one. Before the series, three choices that narrow the range: electric or gas, on the structure or freestanding, and how close to the water.' });

  // 4 · electric vs gas
  {
    const s = L.content('How To Choose', 'Choice 1', 'Electric Or Gas',
      'Under a roof, electric is simplest: no gas line, no flue and no ventilation sums, and it switches on instantly. Gas suits a site where the line already runs, or propane where there is none, and venues that want a big reach per heater: up to 215 square feet. Gas under a roof follows its ventilation rule: with a roof and more than two walls, at least 25% of the total wall area must be fully open, plus 30% of the rest. Gas heaters cannot be recessed. Always follow the manual and local code.');
    const col = [
      ['w-vbb7428', 'LuZap', 'Electric', ['No gas line, flue or ventilation sums under a roof', 'On the ceiling, wall, post, or recessed flush', 'Dimmed and scheduled from the Bromic app']],
      ['w-bromic-pg-residential-hr', 'LuFuel', 'Gas', ['Natural gas or propane, the same warmth', 'Up to 215 ft² from one heater', 'Never recessed; needs open walls under a roof']],
    ];
    col.forEach(([im, ic, h, pts], i) => {
      const x = M + i * 6.23;
      pic(s, im, x, 1.85, 5.9, 2.45, 'cover', 'photo');
      ico(s, ic, x, 4.5, 0.66, 'solid');
      H1(s, h, { x: x + 0.85, y: 4.5, w: 4.5, h: 0.66, fontSize: 24, valign: 'middle' });
      T(s, L.bullets(pts), { x, y: 5.35, w: 5.9, h: 1.4, fontSize: 15, color: HEX.INK });
    });
  }

  // 5 · structure vs freestanding
  {
    const s = L.content('How To Choose', 'Choice 2', 'On The Structure Or Freestanding',
      'If there is a roof, a wall or a post, mount the heater: on the beam or ceiling on Tungsten\'s single post, on a wall bracket, on the pitched-ceiling adaptor from 3/12 to 12/12, as an Eclipse pendant over the table, or recessed flush with the low-clearance kit. If there is none, go freestanding: Eclipse Freestanding arches heat and light over the sofa; the Tungsten Freestanding Gas tower rolls to wherever the table is.');
    const col = [
      ['l-008-059', 'LuHouse', 'On The Structure', 'Beam, ceiling, wall, pitched roof, pendant or recessed flush.', 'Tungsten · Platinum · Eclipse pendant · mounted gas'],
      ['l-002-007', 'LuTrees', 'Freestanding', 'No roof or wall: a heater that stands beside the seats.', 'Eclipse Freestanding · Tungsten Freestanding Gas'],
    ];
    col.forEach(([im, ic, h, d, which], i) => {
      const x = M + i * 6.23;
      pic(s, im, x, 1.85, 5.9, 2.75, 'cover', 'photo');
      ico(s, ic, x, 4.8, 0.66, 'solid');
      H1(s, h, { x: x + 0.85, y: 4.8, w: 4.8, h: 0.66, fontSize: 24, valign: 'middle' });
      T(s, d, { x, y: 5.6, w: 5.9, h: 0.5, fontSize: 15, color: HEX.INK });
      T(s, which, { x, y: 6.15, w: 5.9, h: 0.5, fontSize: 15, bold: true, color: HEX.FLAME });
    });
  }

  // 6 · by the water
  {
    const s = L.content('How To Choose', 'Choice 3', 'By The Water',
      'Salt air and pool chlorine test every metal. Two heaters are built for it. Tungsten Coastal: 4 and 6 kW, 208 and 240 V, black or white, a marine-grade build under a high-temperature corrosion-resistant coating, with a recess kit in powder-coated 316 stainless, IPX5. Platinum Electric Marine: the same glass face in AISI 316 stainless, IPX5 (IP55 on 4500 W), five-year warranty on land-based installs. Both are for homes and venues by the water, not boats. Coastal body material and coating name are to confirm with the Product team; Marine use on vessels is also to confirm. Remind customers that stainless is not stain-free: wipe off salt spray and clean regularly, as the manuals ask.');
    pic(s, 'l-005-020', M, 1.85, 6.1, 4.9, 'cover', 'photo');
    [['LuWaves', 'Tungsten Coastal', ['Marine-grade build under a corrosion-resistant coating', '4 and 6 kW, black or white', 'Recess kit in powder-coated 316 stainless, IPX5']],
     ['LuAnchor', 'Platinum Electric Marine', ['AISI 316 marine-grade stainless', 'IPX5, IP55 on 4500 W', '5-year warranty on land-based installs']]].forEach(([ic, h, pts], i) => {
      const y = 1.85 + i * 2.5;
      card(s, 7.05, y, 5.68, 2.3, HEX.GREY, 'card');
      ico(s, ic, 7.3, y + 0.25, 0.6, 'solid');
      H1(s, h, { x: 8.1, y: y + 0.25, w: 4.4, h: 0.6, fontSize: 21, valign: 'middle' });
      T(s, L.bullets(pts, { paraSpaceAfter: 4 }), { x: 7.3, y: y + 1.0, w: 5.2, h: 1.2, fontSize: 15, color: HEX.INK });
    });
  }

  // 7 · check 1
  L.quiz({ section: 'How To Choose', n: 1, q: 'A Covered Patio, No Gas Line, And The Heater Should Disappear. Which One?',
    options: ['Tungsten Gas on a drop pole', 'Platinum Electric, recessed flush', 'Tungsten Freestanding Gas', 'Eclipse Freestanding'],
    answer: 1, why: 'Electric needs no gas line, and Platinum Electric recesses flush in a ceiling cavity as shallow as 7.1 in with the low-clearance kit: 2.1 in deep glass-ceramic with very little visible glow. It goes on an Affinity Dimmer with a wall switch. Tungsten Select recessed in a 7.5 in cavity is a fair second answer.' });

  // 8 · divider
  L.divider({ n: '02', title: 'The Series', line: 'Each heater, four facts to remember, and its controls.', img: 'rv-pr-d-recess-black-timber-logo-f1-4', icon: 'LuLayers',
    notes: 'Module two walks through each series. For every one, remember four facts and the controls that go with it. The controls are never optional.' });

  // 9 · Tungsten Series II
  series({ section: 'The Series', kicker: 'Electric · Launched October 2026', title: 'Tungsten Series II', img: 'rv-pr-d-social-black-ceiling-post-graphite-4x5',
    facts: [['LuThermometer', '2, 3, 4 and 6 kW; dual elements on 4 and 6 kW. Up to 160 ft² a heater.'],
      ['LuRuler', 'One single post, wiring inside, no junction box on show. About 14% narrower and a third lighter than Series I.'],
      ['LuLayers', 'Recesses flush in a 7.5 in cavity, fan-ventilated, recess box supplied. Pitched adaptor from 3/12 to 12/12.'],
      ['LuShieldCheck', 'IPX5. 208, 240 and 277 V (2 kW is 240 V only).']],
    controls: 'Affinity On/Off or Dimmer, 1, 2 or 5 channels, up to 6 kW a channel; a wall switch.',
    notes: 'Tungsten Series II is the slim, directional heater for patios and pergolas. Select and Coastal launched in October 2026; Classic follows in January 2027. Key facts: up to 6 kW, a single post with the cable inside, IPX5, and a low-clearance recess kit for a 7.5 in cavity with the box supplied. The angled bracket sets 15, 30 or 45 degrees; 45 degrees on the 4 and 6 kW is to confirm. Controls: Affinity On/Off or Dimmer, each channel up to 6 kW at 208 to 277 V, so one 6 kW Tungsten a channel, plus a wall switch.' });

  // 10 · Classic / Select / Coastal
  {
    const s = L.content('The Series', 'Tungsten Series II', 'Classic, Select And Coastal',
      'Three versions. Classic is the entry point: the same heat coverage as Select, a black body with stainless end covers, the proven Series I mounting, and a two-year warranty; it launches in January 2027. Select is the one to show first: black, white or graphite (graphite on 4 and 6 kW), three fronts with the Diamond Pattern as standard, single post, the new recess kit, three years on the heater and seven on the elements. Coastal is for homes by the water: 4 and 6 kW, black or white, with the marine-grade recess kit; three years on the heater and seven on the elements.');
    const C = [
      ['Tungsten Classic', 'dk-Tungsten-Series-II-Classic-black-hero', 'January 2027', ['Same heat coverage as Select', 'Black, stainless end covers', 'Series I mounting', '2-year warranty']],
      ['Tungsten Select', 'dk-Tungsten-Series-II-Select-family-three-finishes', 'Available now', ['Black, white or graphite', 'Single post, flush recess kit', 'Three fronts, Diamond standard', '3 years heater, 7 elements']],
      ['Tungsten Coastal', 'pf-tungsten-coastal', 'Available now', ['4 and 6 kW, black or white', 'Corrosion-resistant coating', 'Marine-grade recess kit', '3 years heater, 7 elements']],
    ];
    const cw = 3.75;
    C.forEach(([n, im, when, pts], i) => {
      const x = M + i * (cw + 0.42);
      card(s, x, 1.85, cw, 4.9, HEX.GREY, 'card');
      pic(s, im, x, 1.85, cw, 1.85, 'cover', 'product');
      T(s, when.toUpperCase(), { x: x + 0.3, y: 3.9, w: cw - 0.6, h: 0.3, fontSize: 11, bold: true, charSpacing: 3, color: HEX.FLAME });
      H1(s, n, { x: x + 0.3, y: 4.2, w: cw - 0.6, h: 0.5, fontSize: 21 });
      T(s, L.bullets(pts, { paraSpaceAfter: 3 }), { x: x + 0.3, y: 4.8, w: cw - 0.6, h: 1.85, fontSize: 14, color: HEX.INK });
    });
  }

  // 11 · Platinum Electric
  series({ section: 'The Series', kicker: 'Electric · Platinum', title: 'Platinum Electric And Marine', img: 'w-p1021414-hdr-denoiseai-low-light',
    facts: [['LuEye', 'Tinted glass-ceramic face: quiet heat with very little visible glow. Black or white.'],
      ['LuRuler', 'Just 2.1 in deep. Flush in a cavity as shallow as 7.1 in with the low-clearance kit.'],
      ['LuThermometer', '2300, 3400 and 4500 W: up to 65, 108 and 143 ft². 208 V or 240 V.'],
      ['LuAnchor', 'Marine: AISI 316 stainless, 5-year warranty on land. Platinum: 3-year warranty.']],
    controls: 'Affinity Dimmer for 1% steps, zones and schedules in the app; a wall switch.',
    notes: 'Platinum is the best tier and the design-led choice: a glass-ceramic face in stainless, 2.1 inches deep, that reads as part of the architecture. It recesses flush in a 7.1 inch cavity with the low-clearance kit, recess box supplied, and comes with an 8 inch pole and wall bracket. Mount 2300 and 3400 W at 8 to 9 ft, 4500 W at 8 to 10 ft. Do not quote a visible-light figure; none is published yet. Marine use on vessels is to confirm with the Product team, so sell Marine for homes and venues by the water.' });

  // 12 · Platinum Gas
  series({ section: 'The Series', kicker: 'Gas · Platinum', title: 'Platinum Gas', img: 'w-california-laprovenance-platinumgas-01',
    facts: [['LuThermometer', '23,600 and 39,800 BTU: heat areas up to 160 and 215 ft².'],
      ['LuFuel', 'Natural gas or propane, the same rated input on both.'],
      ['LuPalette', 'A ceramic-glass screen in a black or stainless body, designed to be seen.'],
      ['LuRotateCw', 'Wall bracket included, or two back to back on a ceiling pole. Tilts 0°, 10° or 20°. At least 8 ft up.']],
    controls: 'Affinity On/Off to switch heaters by zone, or a manual wall switch.',
    notes: 'Platinum Gas is the gas heater for restaurant, hotel and rooftop terraces where the heater is part of the look. Two sizes, natural gas or propane at the same input. Mount at least 8 ft above the floor; it is never recessed. Warranty is two years, excluding hoses and igniters. How many gas heaters one Affinity channel switches is to confirm with the Product team, so do not quote a number.' });

  // 13 · Tungsten Gas
  series({ section: 'The Series', kicker: 'Gas · Tungsten', title: 'Tungsten Gas', img: 'w-bromic-tungsten-gas-4',
    facts: [['LuThermometer', 'Two sizes: coverage up to 160 or 215 ft².'],
      ['LuFuel', 'Every model in natural gas or propane.'],
      ['LuRotateCw', 'Wall, beam or drop pole: pivot arm ±25°, poles in six lengths.'],
      ['LuShieldCheck', 'A heat deflector brings top clearance from 3 ft to 14 in. 8 ft minimum height.']],
    controls: 'Affinity On/Off by zone, or a manual wall switch.',
    notes: 'Tungsten Gas is the compact, matte black honeycomb heater for covered bars, restaurants and alfresco areas. Coverage up to 160 or 215 square feet. Do not quote a BTU output for the mounted models: the published figures conflict and are to confirm with the Product team. Gas capacity on an Affinity channel is also to confirm.' });

  // 14 · Tungsten Freestanding Gas
  series({ section: 'The Series', kicker: 'Gas · Freestanding', title: 'Tungsten Freestanding Gas', img: 'l-002-008',
    facts: [['LuMapPin', 'Rolls on built-in wheels to wherever tonight\'s seating is. The head tilts to the guests.'],
      ['LuThermometer', 'About 215 ft² of warmth.'],
      ['LuFuel', 'Propane, with a 20 lb cylinder in the base, or natural gas on a 10 ft quick-connect line.'],
      ['LuShieldCheck', 'Flame failure device and anti-tilt switch.']],
    controls: 'Its own output knob on the propane tower. Not on the app.',
    notes: 'The tower for open seating away from walls: pool decks, lawns, restaurant patios. Propane or natural gas. The propane model\'s knob adjusts high to low; the natural gas model runs on high. The exact BTU figure differs between sources and is to confirm, so sell it by coverage: about 215 square feet. It is not on the Bromic app.' });

  // 15 · Eclipse pendant
  series({ section: 'The Series', kicker: 'Electric · Heat And Light', title: 'Eclipse Pendant', img: 'w-eclipse-electric-24twin-pole-residential-sce',
    facts: [['LuLampCeiling', 'Radiant heat and a dimmable 3000K LED ring in one fixture.'],
      ['LuThermometer', '2,900 W over up to 121 ft². Three heat steps: 33, 66 and 100%.'],
      ['LuRuler', '24 in twin pole included; 8, 24 or 48 in straight, curved or wall poles. Head at least 8 ft up.'],
      ['LuShieldCheck', '27.6 in matte black disc. 3-year warranty.']],
    controls: 'Affinity Eclipse Controller, one Eclipse a channel; or the Eclipse Dimmer Controller with remote.',
    notes: 'Eclipse is the centre of the room: heat and light over the dining table, hung from a centre or fan beam. Heat and light are set separately from the remote or the app. Mount the head at 8 to 9 ft. App features need the Affinity Eclipse Controller, sold separately.' });

  // 16 · Eclipse Freestanding
  series({ section: 'The Series', kicker: 'Electric · Freestanding', title: 'Eclipse Freestanding', img: 'l-016-136',
    facts: [['LuSofa', 'Arches heat and light over open seating with no ceiling or wall.'],
      ['LuPlug', '220–240 V, a 15 ft cable and plug: needs an IP54 outdoor outlet.'],
      ['LuWind', 'Weighted base for winds up to 20 mph; fix the base above that.'],
      ['LuLampCeiling', 'The same Eclipse head: 2,900 W, 121 ft², and the warm LED ring.']],
    controls: 'Eclipse Dimmer Controller and remote.',
    notes: 'Eclipse Freestanding, sold earlier as Eclipse Portable, is for lawns, pool decks and rooftops with no structure. It needs a 220 to 240 V IP54 outdoor outlet and 79 inches of floor clearance under the head. App control of the freestanding model is to confirm with the Product team, so sell it with the Eclipse Dimmer Controller and remote.' });

  // 17 · controls
  {
    const s = L.content('The Series', 'Affinity Smart-Heat', 'Every Heater Leaves With Its Controls',
      'The rule: every heater on a quote has its control next to it. Affinity On/Off and Dimmer come in 1, 2 or 5 channels, each up to 6 kW at 208 to 277 V: one 6 kW Tungsten a channel. Eclipse takes the Affinity Eclipse controller, one Eclipse a channel. A manual wall switch is the local disconnect where code asks for one. The Bromic app runs zones, schedules, timers and dimming, with Alexa and Google Assistant; Control4, Crestron and Lutron compatibility varies and may need extra hardware. Wi-Fi and app features need compatible Affinity controls, sold separately.');
    const C = [
      ['LuSlidersHorizontal', 'Affinity On/Off Or Dimmer', 'Tungsten and Platinum. 1, 2 or 5 channels, up to 6 kW a channel at 208–277 V.'],
      ['LuLampCeiling', 'Affinity Eclipse Controller', 'One Eclipse a channel. Heat and light set separately.'],
      ['LuKey', 'Wall Switch', 'The local disconnect, where the code asks for one.'],
      ['LuSmartphone', 'The Bromic App', 'Zones, schedules, timers and dimming. Alexa and Google.'],
    ];
    C.forEach(([ic, h, d], i) => {
      const y = 1.85 + i * 1.12;
      ico(s, ic, M, y, 0.66, 'light');
      H1(s, h, { x: M + 0.9, y: y - 0.04, w: 5.6, h: 0.42, fontSize: 19 });
      T(s, d, { x: M + 0.9, y: y + 0.4, w: 5.6, h: 0.6, fontSize: 15 });
    });
    T(s, 'Wi-Fi and app features need compatible Affinity controls, sold separately.', { x: M, y: 6.35, w: 6.4, h: 0.4, fontSize: 13, color: HEX.STEEL });
    pic(s, 'w-affinity-onoff', 7.35, 1.85, 2.6, 4.9, 'contain', 'controller');
    pic(s, 'w-bromic-heating-app-blog-image', 10.13, 1.85, 2.6, 4.9, 'cover', 'app');
  }

  // 18 · good / better / best
  {
    const s = L.content('The Series', 'Where Each One Sits', 'Good, Better, Best, And The Centre',
      'Quote from the ladder. Good is Tungsten Classic, better is Tungsten Select, best is Platinum Electric. Classic and Select give the same heat coverage, so the customer chooses the look and the warranty, not the warmth. Eclipse sits beside the ladder as the centre of the room: heat and light over the table. Prices are relative here; use your current price list.');
    const L4 = [
      ['GOOD', 'Tungsten Classic', 'dk-Tungsten-Series-II-Classic-black-hero', 'Same heat as Select. Black. 2-year warranty.'],
      ['BETTER', 'Tungsten Select', 'dk-Tungsten-Series-II-Select-black-hero', 'Three finishes, single post, flush recess. 3 + 7 years.'],
      ['BEST', 'Platinum Electric', 'w-platinum-black', 'Glass-ceramic, 2.1 in deep, quiet heat. 3 years.'],
      ['THE CENTRE', 'Eclipse', 'w-eclipse-electric', 'Heat and light over the table. 3 years.'],
    ];
    const cw = 2.83;
    L4.forEach(([tier, name, im, d], i) => {
      const x = M + i * (cw + 0.26), best = i === 2;
      card(s, x, 1.85, cw, 4.9, best ? HEX.INK : HEX.GREY, 'tier-card');
      T(s, tier, { x: x + 0.25, y: 2.05, w: cw - 0.5, h: 0.35, fontSize: 12, bold: true, charSpacing: 3, color: HEX.FLAME });
      H1(s, name, { x: x + 0.25, y: 2.4, w: cw - 0.5, h: 0.5, fontSize: 21, color: best ? HEX.WHITE : HEX.INK });
      pic(s, im, x + 0.25, 3.1, cw - 0.5, 1.95, 'contain', 'product');
      T(s, d, { x: x + 0.25, y: 5.25, w: cw - 0.5, h: 1.3, fontSize: 15, color: best ? 'E6E2DE' : HEX.BODY });
    });
  }

  // 19 · check 2
  L.quiz({ section: 'The Series', n: 2, q: 'What Do Tungsten Classic And Select Have In Common?',
    options: ['The finishes', 'The heat coverage', 'The warranty', 'The mounting'],
    answer: 1, why: 'Classic and Select give the same heat coverage, up to 65, 100, 130 and 160 square feet for 2, 3, 4 and 6 kW. Classic is black with the Series I mounting and a two-year warranty; Select adds white and graphite, the single post, the new recess kit, and three years on the heater, seven on the elements.' });

  // 20 · divider
  L.divider({ n: '03', title: 'Nine Spaces, The Right Heat', line: 'What to show first in every outdoor room.', img: 'w-gazebo-bromic', icon: 'LuMapPin',
    notes: 'Module three turns the range into answers: nine spaces customers describe, and the heater to show first in each.' });

  // 21 · nine spaces
  {
    const s = L.content('Nine Spaces, The Right Heat', 'At A Glance', 'Nine Spaces, And What To Show First',
      'This grid matches the Portfolio By Application brochure. Covered patio: Tungsten Select, with Classic for the same warmth at an entry price. Pergola: Select on its single post. Pitched porch: Tungsten Series II on the pitched adaptor. Flush ceiling: Platinum or Tungsten, recessed. Design-led room: Platinum Electric. Over the table: the Eclipse pendant. By the water: Tungsten Coastal or Platinum Marine. Lawn and pool: Eclipse Freestanding or the Tungsten Gas tower. Restaurant and bar: Tungsten Gas or Platinum Gas. Every one leaves with its controls.');
    const APPS = [
      ['w-connecticut-privateresidence-tungstenelectri-3', 'Covered Patio', 'Tungsten Select'],
      ['w-240619-yorba-linda-ca-dc-64', 'Pergola', 'Tungsten Select · single post'],
      ['w-dsc05737-courtney-saib', 'Pitched Porch', 'Tungsten + pitched adaptor'],
      ['w-platinumelectricflushmountedw-lowclearancere', 'Flush Ceiling', 'Platinum or Tungsten, recessed'],
      ['l-010-071', 'Design-Led Room', 'Platinum Electric'],
      ['l-013-102', 'Over The Table', 'Eclipse pendant'],
      ['l-005-022', 'By The Water', 'Tungsten Coastal · Platinum Marine'],
      ['l-018-151', 'Lawn And Pool', 'Eclipse Freestanding · Tungsten Gas tower'],
      ['w-tungsten-gas-500-fiddler-sydney-2-1', 'Restaurant, Bar', 'Tungsten Gas · Platinum Gas'],
    ];
    const cw = 3.85, ih = 1.0, gx = 0.28;
    APPS.forEach(([im, t, h], i) => {
      const x = M + (i % 3) * (cw + gx), y = 1.75 + Math.floor(i / 3) * 1.72;
      pic(s, im, x, y, 1.6, ih + 0.5, 'cover', 'space');
      H1(s, t, { x: x + 1.75, y: y + 0.08, w: cw - 1.75, h: 0.4, fontSize: 16 });
      T(s, h, { x: x + 1.75, y: y + 0.5, w: cw - 1.75, h: 0.8, fontSize: 14, bold: true, color: HEX.FLAME });
    });
  }

  // 22 · coverage
  {
    const s = L.content('Nine Spaces, The Right Heat', 'Coverage', 'Show Where The Heat Lands',
      'Show the customer where the warmth falls and the right size sells itself. One Tungsten 6 kW covers up to 160 square feet, one Platinum 4500 W up to 143, one Eclipse up to 121. To size a space: seating area divided by heat area times 0.85 for a partly covered space on cool evenings, rounded up. These are coverage illustrations, not photographs.');
    const CV = [['rv-hb-tungsten-6kw-terrace', 'Tungsten 6 kW', 'Up to 160 ft² over a dining table'],
      ['rv-hb-platinum-4500w-lounge', 'Platinum 4500 W', 'Up to 143 ft² over a lounge'],
      ['rv-hb-eclipse-pendant-dining', 'Eclipse', 'Up to 121 ft² over a round table']];
    const cw = (12.13 - 0.5) / 3, ch = cw / 1.5;
    CV.forEach(([im, h, d], i) => {
      const x = M + i * (cw + 0.25);
      pic(s, im, x, 1.9, cw, ch, 'contain', 'coverage');
      H1(s, h, { x, y: 1.9 + ch + 0.15, w: cw, h: 0.5, fontSize: 21 });
      T(s, d, { x, y: 1.9 + ch + 0.65, w: cw, h: 0.4, fontSize: 15 });
    });
    card(s, M, 6.0, 12.13, 0.72, HEX.GREY, 'rule');
    ico(s, 'LuRuler', M + 0.15, 6.06, 0.6, 'light');
    T(s, [{ text: 'Size it:  ', options: { bold: true, color: HEX.INK } }, { text: 'seating area ÷ (heat area × 0.85), rounded up.' }], { x: M + 0.95, y: 6.0, w: 11, h: 0.72, fontSize: 16, valign: 'middle' });
  }

  // 23 · exercise: match the heater to the photo
  {
    const s = L.exercise({ section: 'Nine Spaces, The Right Heat', n: 1, minutes: 5, title: 'Match The Heater To The Photo', icon: 'LuSearch',
      task: 'Name the Bromic heater in each photo, and the control you would sell with it.',
      notes: 'Give five minutes, individually, then go round the room. Answers: 1, Eclipse pendant, on the Affinity Eclipse Controller or the Eclipse Dimmer Controller with remote. 2, Eclipse Freestanding, with the Eclipse Dimmer Controller and remote. 3, Platinum Gas, wall-mounted over a covered courtyard, switched by Affinity On/Off or a wall switch. 4, Platinum Electric recessed flush in the roof, on an Affinity Dimmer. 5, Tungsten Freestanding Gas, at its own knob. 6, Tungsten Coastal in white on a wall by the sea, on an Affinity Dimmer with a wall switch. Debrief: which pairs were confused? Usually Platinum Electric and Platinum Gas: the electric one is a flat glass panel with very little glow; the gas one has a ceramic-glass screen over a glowing burner.' });
    const P = ['l-013-102', 'l-016-131', 'w-1', 'w-mountain-view-retreat-platinum-electric-rece', 'l-018-154', 'l-005-020'];
    const cw = 3.85, ch = 2.0;
    P.forEach((im, i) => {
      const x = M + (i % 3) * (cw + 0.28), y = 2.5 + Math.floor(i / 3) * (ch + 0.15);
      pic(s, im, x, y, cw, ch, 'cover', 'match-photo');
      s.addShape(L.pres.shapes.OVAL, { x: x + 0.15, y: y + 0.15, w: 0.55, h: 0.55, fill: { color: HEX.FLAME }, line: { color: HEX.WHITE, width: 1.5 }, objectName: 'number' });
      T(s, String(i + 1), { x: x + 0.15, y: y + 0.15, w: 0.55, h: 0.55, fontSize: 18, bold: true, color: HEX.WHITE, align: 'center', valign: 'middle' });
    });
  }

  // 24 · exercise: which one for this customer
  {
    const s = L.exercise({ section: 'Nine Spaces, The Right Heat', n: 2, minutes: 10, title: 'Which One For This Customer?', icon: 'LuTarget',
      task: 'In pairs, choose the heater to show first and its controls. Be ready to say why in one line.',
      notes: 'Ten minutes in pairs, then take one answer per scenario from the room. Model answers. 1, beach house: Tungsten Coastal in white, 4 or 6 kW, on an Affinity Dimmer with a wall switch; Platinum Electric Marine in white if they want it flush and quiet. 2, restaurant with a gas line: Platinum Gas where the heater is seen, or Tungsten Gas on drop poles, switched by zone on Affinity On/Off or a wall switch; check the open-wall rule under the roof. 3, lawn by the pool with no roof: Eclipse Freestanding for heat and light, with its Eclipse Dimmer Controller and remote, on a 220 to 240 V IP54 outdoor outlet; or the Tungsten Freestanding Gas tower where there is no outlet. 4, dining table under a pergola centre beam: an Eclipse pendant from the fan or centre beam on the Affinity Eclipse Controller; Tungsten Select on the perimeter beams if the table is long. Debrief: did every answer include its controls?' });
    const SC = [
      ['LuWaves', 'The Beach House', 'A covered deck facing the ocean. White ceiling. They want slim heaters that last.'],
      ['LuStore', 'The Restaurant', 'A covered terrace with open sides and a gas line already in. Thirty seats.'],
      ['LuSun', 'The Pool Lawn', 'Loungers on the lawn by the pool. No roof, no gas. They want light in the evening too.'],
      ['LuSparkles', 'The Dinner Table', 'A round table under a pergola centre beam. They host friends most weekends.'],
    ];
    const cw = 5.9, ch = 1.95;
    SC.forEach(([ic, h, d], i) => {
      const x = M + (i % 2) * (cw + 0.33), y = 2.7 + Math.floor(i / 2) * (ch + 0.2);
      card(s, x, y, cw, ch, HEX.WHITE, 'scenario');
      ico(s, ic, x + 0.3, y + 0.3, 0.62, 'solid');
      H1(s, `${i + 1}  ${h}`, { x: x + 1.1, y: y + 0.3, w: cw - 1.3, h: 0.62, fontSize: 21, valign: 'middle' });
      T(s, d, { x: x + 0.3, y: y + 1.05, w: cw - 0.6, h: 0.8, fontSize: 15, color: HEX.INK });
    });
  }

  // 25 · exercise: build the package
  L.exercise({ section: 'Nine Spaces, The Right Heat', n: 3, minutes: 15, title: 'Build The Right Package', icon: 'LuSlidersHorizontal',
    task: 'A 16 × 20 ft covered patio, white flush ceiling, 9 ft high, an 8 in cavity. They want it quiet and on their phone.',
    steps: ['Choose the heater and finish, and say why.', 'Size it: seating area ÷ (heat area × 0.85), rounded up.', 'Check the mounting height and the recess cavity.', 'Add the controller, channels, wall switch and circuits.'],
    img: 'w-platinumelectricflushmountedw-lowclearancere',
    notes: 'Fifteen minutes in pairs or threes. Model answer: Platinum Electric 4500 W in white, recessed flush with the low-clearance kit, which needs a 7.1 in cavity, so 8 inches works. 16 by 20 is 320 square feet; 320 divided by (143 times 0.85, 121.6) is 2.63, so three heaters. Platinum 4500 W mounts at 8 to 10 ft, so 9 ft is right. Controls: an Affinity 5-channel Dimmer with one heater a channel and the app, plus a wall switch; three dedicated circuits by a licensed electrician. An alternative: three Tungsten Select 6 kW in white, recessed in the 7.5 in kit (320 divided by 136 is 2.35, so three), on the same controller. Debrief: who forgot the wall switch or the circuits? App features need compatible Affinity controls, sold separately; it goes on the quote.' });

  // 26 · closing
  L.closing({ title: 'One Family, The Right Heat',
    points: ['Choose by fuel, mount and setting.', 'Show Select first; Classic for budget, Platinum for design.', 'Eclipse is the centre: heat and light over the table.', 'Coastal and Platinum Marine for homes by the water.', 'Every heater leaves with its controls and a wall switch.'],
    next: 'Keep the Portfolio By Application brochure on the counter.', img: 'w-slc-bromic-heater-1-cropped',
    notes: 'Close with the five rules. Ask each person to name the heater they would show first in their own showroom\'s most common space. Point them to the Portfolio By Application brochure and the take-home flyer as the tools to use on the floor.' });

  await L.finish('Bromic-Dealer-Bromic-Portfolio');
}
main().catch((e) => { console.error(e); process.exit(1); });
