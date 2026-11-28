// Training Hub · Dealer track · B6: Merchandising And The Showroom (30 min workshop).
// Facts: data/retail/retail.json (merchandising, selling, controls, range-selector), data/product-facts.json
// (principles.wavelength: about 30 seconds), reports/white-papers/pergola-2027/content.py (frame colours),
// the How To Sell deck (b1: market figures, design style, good/better/best), and the two retail PDFs.
// Run: NODE_PATH=$PWD/node_modules node b6-merchandising-and-showroom.js
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const L = require('./lib');
const { T, H1, pic, rule, num, stat, HEX, W, M } = L;
const caps = (s, t, x, y, w, o = {}) => T(s, t.toUpperCase(), { x, y, w, h: 0.3, fontSize: 10, bold: true, color: HEX.STEEL, charSpacing: 3, ...o });
const box = (s, x, y, w, h, fill, name = 'panel') => s.addShape(L.pres.shapes.RECTANGLE, { x, y, w, h, fill: { color: fill }, line: { color: fill, width: 0 }, objectName: name });

const ROOT = '/home/user/Bromic_Marketing';
const CACHE = path.join(__dirname, 'cache');
// page images of the two retail tools, rendered from their committed PDFs
function pdfPage(pdf, page, name, dpi = 150) {
  const base = path.join(CACHE, name);
  if (!fs.existsSync(base + '.jpg')) execFileSync('pdftoppm', ['-jpeg', '-r', String(dpi), '-singlefile', '-f', String(page), '-l', String(page), pdf, base]);
  return base + '.jpg';
}
const FLY = path.join(ROOT, 'reports/retail/take-home-flyer/Bromic-Take-Home-Flyer.pdf');
const PBA = path.join(ROOT, 'reports/retail/portfolio-applications/Bromic-Portfolio-By-Application.pdf');
const ECL = path.join(CACHE, 'src/b6-w-eclipse-electric-w.jpg'), DIM = path.join(CACHE, 'src/b6-w-affinity-dimmer-5ch-w.jpg'); // cut-outs with the grey ground lifted to white
const page = (s, f, x, y, w) => { const h = w * 11 / 8.5; box(s, x - 0.02, y - 0.02, w + 0.04, h + 0.04, HEX.LINE, 'page-edge'); pic(s, f, x, y, w, h, 'contain', 'tool-page'); return h; };

async function main() {
  L.start({ title: 'Merchandising And The Showroom', footer: 'Dealer Training · Merchandising And The Showroom' });
  await L.prepIcons();
  const sharp = require('sharp');
  // the QR code from the flyer's back page, cut at 300 dpi
  const QR = path.join(CACHE, 'b6-flyer-qr.jpg');
  if (!fs.existsSync(QR)) { const p2 = pdfPage(FLY, 2, 'b6-flyer-p2-300', 300); await sharp(p2).extract({ left: 176, top: 2748, width: 370, height: 370 }).jpeg({ quality: 95 }).toFile(QR); }
  const fly1 = pdfPage(FLY, 1, 'b6-flyer-p1'), fly2 = pdfPage(FLY, 2, 'b6-flyer-p2');
  const pb = (n) => pdfPage(PBA, n, `b6-pba-p${n}`);

  // 1 · cover
  L.cover({
    kicker: 'Dealer Training · B6', title: 'Merchandising And The *Showroom*',
    sub: 'Show heat as a room, switch it on in front of the customer, and send them home with the flyer.',
    meta: '30-minute workshop · 2 exercises · 2 knowledge checks', img: 'l-012-093',
    notes: 'Welcome. This is a 30-minute workshop on the floor itself: where heat sits in the store, how to run a live demo, how to show finishes and price points, how to reset through the seasons, and what the customer takes home. Two exercises: you will plan a heat room set and run a two-minute demo. Timing: about 2 minutes here.',
  });

  // 2 · take-aways
  {
    const s = L.content('Welcome', 'In This Session', 'What You Will Take Away',
      'Four things to leave with. One: heat sits in a room set beside the pergolas, kitchens and furniture, never on a shelf. Two: the choice is shown, not described: finishes, frame colours, design style and a good, better, best wall with Eclipse at the centre. Three: a live demo the customer feels in seconds, with the app on a tablet, run from a two-minute script. Four: seasonal resets and the two take-home pieces, handed over at the right moment. About 1 minute.');
    const items = [
      ['Heat As A Room', 'Beside the pergolas, kitchens and furniture.'],
      ['The Choice, On Show', 'Finishes, frames, design style and price points.'],
      ['A Live Demo', 'Felt in seconds, run from the app, in two minutes.'],
      ['Out The Door', 'Seasonal resets, the flyer and the brochure.'],
    ];
    pic(s, 'w-gazebo-bromic', M, 1.85, 5.6, 4.95, 'cover', 'photo');
    items.forEach(([h, d], i) => {
      const y = 1.85 + i * 1.22, x = 6.75;
      rule(s, x, y, W - M - x);
      num(s, i + 1, x, y + 0.12, { size: 26, h: 0.55, w: 0.8 });
      H1(s, h, { x: x + 0.95, y: y + 0.14, w: 5, h: 0.45, fontSize: 21 });
      T(s, d, { x: x + 0.95, y: y + 0.6, w: 5, h: 0.45, fontSize: 14 });
    });
  }

  // 3 · the market (wording as the How To Sell deck, slides 7–9)
  {
    const s = L.content('Welcome', 'Why It Earns Floor Space', 'USD 1.4–1.5 Billion Today, 2.5 Billion By 2032',
      'The owner\'s message for retail: outdoor heating is a high-growth category, and it deserves a permanent place on your floor. The line to say: outdoor heating is a USD 1.4 to 1.5 billion category today, heading to about USD 2.5 billion by 2032, and the growth is driven by high-end installed heating: electric, mounted, built-in and controlled from a phone. That is what a showroom can show and a big-box shelf cannot. Sources, as in the How To Sell deck: Fortune Business Insights (Outdoor Heating Market, 2026 edition) puts the global market at USD 1,410 million in 2025 and 1,480 million in 2026; IMARC (2026) at USD 1,500 million in 2025. Fortune forecasts USD 2,470 million by 2034, so "2.5 billion by 2032" is our framing of the faster forecasts (Technavio 2026: 8.2% a year; Market Glass 2025: USD 3,000 million by 2030); reports range from 4.7% to 8.2% growth a year. North America is the largest region: USD 640 million in 2025, 45.7% of the world (Fortune). These are free summaries of paid reports; check against the live pages before external use. About 2 minutes.');
    caps(s, 'Global outdoor heating, USD billions', M, 1.85, 7);
    stat(s, '1.4–1.5', 'Today', M, 2.3, 3.6, { size: 72, h: 1.15, color: HEX.INK, lc: HEX.STEEL, lh: 0.4 });
    stat(s, '2.5', 'By 2032', M + 3.9, 2.3, 2.4, { size: 72, h: 1.15, lc: HEX.STEEL, lh: 0.4 });
    rule(s, M, 4.55, 6.3, HEX.FLAME, 1.5);
    T(s, 'DRIVEN BY', { x: M, y: 4.7, w: 4, h: 0.3, fontSize: 10, bold: true, color: HEX.FLAME, charSpacing: 4 });
    H1(s, 'High-End Installed Heating', { x: M, y: 5.0, w: 6.3, h: 0.6, fontSize: 28 });
    T(s, 'Electric, mounted and built-in, run from the phone: the heat a showroom can switch on and a shelf cannot.', { x: M, y: 5.65, w: 6.0, h: 0.75, fontSize: 14 });
    pic(s, 'w-delmonico-08', 7.35, 1.85, 5.38, 4.95, 'cover', 'photo');
    T(s, 'Sources: Fortune Business Insights 2026; IMARC 2026; Technavio 2026; Market Glass 2025.', { x: M, y: 6.55, w: 6.4, h: 0.3, fontSize: 9, color: HEX.STEEL });
  }

  // 4 · divider
  L.divider({ n: '01', title: 'Where Heat Sits On The Floor', line: 'Beside the things your customer is already buying.', img: 'l-006-028',
    notes: 'Part one, about 4 minutes. Where heat goes in the store decides whether a customer ever pictures it at home.' });

  // 5 · a room set
  {
    const s = L.content('Where Heat Sits On The Floor', 'The Principle', 'Show Heat As A Room Set',
      'Customers buy the evening, so show them one. A heater in a box on a shelf is a product; a heater over a set table, under a pergola, next to the outdoor kitchen is an evening they can picture. Four principles, no fixed layout: put heat where the outdoor room already is; mount it the way it is installed at home, at its listed height; put its controls on the wall beside it; and set the furniture so a customer can sit under it. The store layout and dimensions are yours; these are principles, not a plan. Suggested in-store guidance: data/retail/retail.json, Display And Merchandising. Display kits, fixtures and a showroom guide: to confirm with Marketing. About 2 minutes.');
    pic(s, 'w-img-0194', M, 1.85, 6.5, 4.95, 'cover', 'photo');
    const P = [
      ['Where The Room Already Is', 'Beside the pergolas, the kitchens and the lounge sets.'],
      ['Mounted As At Home', 'On a beam, a ceiling or a wall, at its listed height.'],
      ['Controls Beside It', 'The controller and the wall switch, with one label for both.'],
      ['A Seat Under It', 'Set the table so a customer sits in the heat.'],
    ];
    P.forEach(([h, d], i) => {
      const x = 7.55, y = 1.85 + i * 1.24;
      rule(s, x, y, W - M - x);
      num(s, i + 1, x, y + 0.1, { size: 20, h: 0.45, w: 0.6 });
      H1(s, h, { x: x + 0.65, y: y + 0.12, w: 4.5, h: 0.45, fontSize: 19 });
      T(s, d, { x: x + 0.65, y: y + 0.58, w: 4.5, h: 0.6, fontSize: 13.5 });
    });
  }

  // 6 · the neighbours
  {
    const s = L.content('Where Heat Sits On The Floor', 'Its Neighbours', 'Next To Pergolas, Kitchens And Furniture',
      'Three neighbours, each with a reason. Pergolas: heat on the beam is the pergola sold for more evenings; show Tungsten Select on its single post with the cable inside. Outdoor kitchens: the room people already cover and wire; show a wall or ceiling heater over the counter. Furniture: the dining set and the lounge are where people sit, so hang Eclipse over the table or arch Eclipse Freestanding over the sofa. Every heater on show has its controls: Affinity On/Off or Dimmer for Tungsten and Platinum, the Eclipse controller for Eclipse, with a wall switch; Eclipse Freestanding comes with its Eclipse Dimmer Controller and remote. About 2 minutes.');
    const C = [
      ['pergola', 'w-gazebo-bromic', 'Pergolas', 'Tungsten Select on the beam, on its single post, the cable inside.'],
      ['dining', 'w-bromic-platinum-electric-4500w', 'Outdoor Kitchens', 'A wall or ceiling heater over the counter.'],
      ['lounge', 'l-016-136', 'Furniture', 'Eclipse over the table, or Eclipse Freestanding over the sofa.'],
    ];
    const cw = 3.8;
    C.forEach(([ic, im, h, d], i) => {
      const x = M + i * (cw + 0.35);
      pic(s, im, x, 1.85, cw, 2.9, 'cover', 'photo');
      L.icon(s, ic, x, 4.95, 0.5);
      rule(s, x, 5.55, cw);
      H1(s, h, { x, y: 5.66, w: cw, h: 0.45, fontSize: 20 });
      T(s, d, { x, y: 6.1, w: cw, h: 0.65, fontSize: 13.5 });
    });
  }

  // 7 · controls beside every heater
  {
    const s = L.content('Where Heat Sits On The Floor', 'On Every Display', 'Controls Beside Every Heater',
      'A heater on display without its controls teaches the customer that controls are extra. Put the matching controller and the wall switch beside each heater, with one shelf label covering both, so the price they see is the price they will pay. Tungsten and Platinum Electric: Affinity Dimmer, in 1% steps, or On/Off; 1, 2 or 5 channels, 6 kW a channel at 208 to 277 V. Eclipse Electric: the Affinity Eclipse Controller, or the Eclipse Dimmer Controller with remote. Mounted gas: Affinity On/Off. Wi-Fi and app features need compatible Affinity controls, sold separately. Source: data/retail/retail.json, Controls and Display And Merchandising. About 1 minute.');
    pic(s, DIM, M, 1.85, 4.6, 4.3, 'contain', 'controller');
    T(s, 'Affinity Smart-Heat Dimmer, 5 channels.', { x: M, y: 6.25, w: 4.6, h: 0.3, fontSize: 10, color: HEX.STEEL });
    const hd = { bold: true, color: HEX.WHITE, fill: { color: HEX.INK }, fontSize: 9, charSpacing: 1 };
    const rows = [
      [{ text: 'ON DISPLAY', options: hd }, { text: 'BESIDE IT, ON ONE LABEL', options: hd }],
      ['Tungsten Series II, Platinum Electric', 'Affinity Dimmer or On/Off, and a wall switch'],
      ['Eclipse Electric pendant', 'Affinity Eclipse Controller, or Eclipse Dimmer Controller with remote'],
      ['Eclipse Freestanding', 'Eclipse Dimmer Controller and remote, included'],
      ['Platinum Gas, Tungsten Gas (mounted)', 'Affinity On/Off, and a wall switch'],
    ].map((r, i) => i ? [{ text: r[0], options: { bold: true, color: HEX.INK } }, { text: r[1] }] : r);
    s.addTable(rows, { x: 5.75, y: 1.9, w: 6.98, colW: [2.95, 4.03], rowH: [0.45, 0.72, 0.72, 0.72, 0.72], fontFace: 'Arial', fontSize: 13, color: HEX.BODY, valign: 'middle', margin: [0, 0.12, 0, 0.12],
      border: [{ type: 'none' }, { type: 'none' }, { type: 'solid', pt: 0.75, color: 'C9C9C6' }, { type: 'none' }] });
    box(s, 5.75, 5.55, 6.98, 1.2, HEX.WASH, 'action');
    L.icon(s, 'controller-dimmer', 5.95, 5.73, 0.8);
    T(s, 'Wi-Fi and app features need compatible Affinity controls, sold separately. Say so on the label.', { x: 6.95, y: 5.75, w: 5.6, h: 0.85, fontSize: 15, color: HEX.INK, fontFace: 'Bodoni MT', valign: 'middle' });
  }

  // 8 · divider
  L.divider({ n: '02', title: 'Show The *Choice*', line: 'Finishes, frames, design style and the price ladder.', img: 'l-010-069',
    notes: 'Part two, about 9 minutes including the first exercise. The customer chooses with their eyes, so the choice has to be on show.' });

  // 9 · finishes and frames
  {
    const s = L.content('Show The Choice', 'Finishes And Frames', 'Black, White And Graphite, Matched To The Frame',
      'Show the three Tungsten Select finishes side by side: black, white and graphite, the whole heater in one finish; graphite is on the 4 and 6 kW models. Coastal comes in black or white; Classic in black; Platinum Electric in black or white glass; Eclipse in matte black. Then match the frame. Pergola frames come in black, white, grey and bronze. Black frame: Select black, Platinum black glass or Eclipse, and the heater disappears. White, beige or sandstone: Select white or Platinum white glass, part of a light roof. Grey or anthracite: Select graphite, tone on tone. Bronze, adobe or clay: Select black or graphite, a warm contrast. If you have frame samples from your pergola suppliers, put them beside the heaters. Sources: launch deck and Lookbook 2026 via the Pergola white paper (reports/white-papers/pergola-2027/content.py). About 2 minutes.');
    pic(s, 'dk-Tungsten-Series-II-Select-family-three-finishes', M, 1.85, 5.2, 3.95, 'contain', 'finishes');
    L.icon(s, 'finishes', M, 5.95, 0.5);
    T(s, 'Tungsten Select in black, graphite and white. Graphite on 4 and 6 kW.', { x: M + 0.65, y: 6.0, w: 4.5, h: 0.5, fontSize: 11, color: HEX.STEEL });
    const FR = [['Black', '1E1E1E', 'Select black, Platinum black, Eclipse', 'Disappears into the frame'],
      ['White, sandstone', 'F4F4F2', 'Select white, Platinum white', 'Part of a light roof'],
      ['Grey, anthracite', '4A4D50', 'Select graphite', 'Tone on tone'],
      ['Bronze, clay', '5B4636', 'Select black or graphite', 'A warm contrast']];
    const x0 = 6.3, tw = W - M - x0;
    caps(s, 'Frame', x0, 1.85, 2); caps(s, 'Show beside it', x0 + 2.35, 1.85, 3);
    FR.forEach(([f, hex, show, eff], i) => {
      const y = 2.2 + i * 1.12;
      rule(s, x0, y, tw);
      s.addShape(L.pres.shapes.RECTANGLE, { x: x0, y: y + 0.18, w: 0.42, h: 0.42, fill: { color: hex }, line: { color: 'C9C9C6', width: 0.5 }, objectName: 'frame-swatch' });
      H1(s, f, { x: x0 + 0.58, y: y + 0.15, w: 1.75, h: 0.8, fontSize: 17 });
      T(s, show, { x: x0 + 2.35, y: y + 0.15, w: 4.08, h: 0.5, fontSize: 13, color: HEX.INK, bold: true });
      T(s, eff, { x: x0 + 2.35, y: y + 0.68, w: 4.08, h: 0.35, fontSize: 13 });
    });
    rule(s, x0, 2.2 + 4 * 1.12, tw);
  }

  // 10 · design style
  {
    const s = L.content('Show The Choice', 'The Design-Style Question', '“How Would You Describe The Style Of Your Space?”',
      'Ask the style question before you walk them anywhere; the answer tells you which display to stand at. Modern, contemporary or minimal: show Platinum and Eclipse first, by default. Platinum is tinted glass-ceramic, 2.1 in deep, and can sit flush; Eclipse is heat and a dimmable light over the table. Transitional or farmhouse: Tungsten Select in black, white or graphite. Timber or traditional: Tungsten on the beam in black or graphite, or recessed. By the water: Tungsten Coastal or Platinum Electric Marine. Every one with its Affinity controls and a wall switch. Sources: How To Sell deck (b1) and Portfolio By Application, page 11. About 2 minutes.');
    // the modern default, big, on white: Platinum and Eclipse cut-outs on the left
    T(s, 'MODERN · THE DEFAULT', { x: M, y: 1.95, w: 6, h: 0.3, fontSize: 10, bold: true, color: HEX.FLAME, charSpacing: 4 });
    H1(s, 'Platinum And Eclipse, First', { x: M, y: 2.25, w: 6, h: 0.6, fontSize: 28 });
    pic(s, 'w-platinum-black', M, 3.0, 3.1, 2.6, 'contain', 'platinum');
    pic(s, ECL, M + 3.2, 3.0, 2.9, 2.6, 'contain', 'eclipse');
    rule(s, M, 5.75, 6.1, HEX.FLAME, 1.5);
    T(s, 'Platinum: glass-ceramic, 2.1 in deep. Eclipse: heat and a dimmable light over the table.', { x: M, y: 5.88, w: 6.1, h: 0.6, fontSize: 13.5, color: HEX.INK });
    L.icon(s, 'design-style', 7.3, 1.95, 0.6);
    T(s, 'OTHER STYLES', { x: 8.05, y: 2.1, w: 4, h: 0.3, fontSize: 10, bold: true, color: HEX.FLAME, charSpacing: 4 });
    const R = [['Transitional, farmhouse', 'Tungsten Select in black, white or graphite'], ['Timber, traditional', 'Tungsten on the beam, or recessed'], ['By the water', 'Tungsten Coastal or Platinum Marine']];
    R.forEach(([a, b], i) => {
      const y = 2.75 + i * 1.12;
      rule(s, 7.3, y, W - M - 7.3);
      caps(s, a, 7.3, y + 0.14, 5.2, { color: HEX.STEEL });
      H1(s, b, { x: 7.3, y: y + 0.45, w: 5.4, h: 0.55, fontSize: 19 });
    });
    rule(s, 7.3, 2.75 + 3 * 1.12, W - M - 7.3);
    T(s, 'Every one with its Affinity controls and a wall switch.', { x: 7.3, y: 6.25, w: 5.4, h: 0.4, fontSize: 13, color: HEX.STEEL });
  }

  // 11 · price-point display
  {
    const s = L.content('Show The Choice', 'The Price-Point Wall', 'Good, Better, Best, And Eclipse As The Centre',
      'Show the ladder as one display, in this order, so the customer can compare at a glance. Good: Tungsten Classic, the same heat coverage as Select at an entry price, black, two-year warranty; it launches in January 2027, so show it when your stock arrives. Better: Tungsten Select, single post, black, white or graphite, three fronts, IPX5, three years on the heater and seven on the elements. Best: Platinum Electric, glass-ceramic, 2.1 in deep, three years. Eclipse is the centre: hang it over a set table in the middle of the room, heat and light together, on its Eclipse controller. One label per heater with its controls. Prices: use your current price list; none are given here. Sources: Portfolio By Application, page 5; How To Sell deck. About 2 minutes.');
    const LAD = [['GOOD', 'Tungsten Classic', 'dk-Tungsten-Series-II-Classic-black-hero', 'Same heat as Select, at an entry price. Black. 2 years.'],
      ['BETTER', 'Tungsten Select', 'dk-Tungsten-Series-II-Select-black-hero', 'Single post, three finishes, IPX5. 3 years heater, 7 elements.'],
      ['BEST', 'Platinum Electric', 'w-platinum-black', 'Glass-ceramic, 2.1 in deep, quiet heat. 3 years.']];
    const cw = 2.55;
    LAD.forEach(([t, n, im, d], i) => {
      const x = M + i * (cw + 0.25);
      T(s, t, { x, y: 1.9, w: cw, h: 0.3, fontSize: 10, bold: true, charSpacing: 4, color: HEX.FLAME });
      H1(s, n, { x, y: 2.2, w: cw, h: 0.5, fontSize: 20 });
      pic(s, im, x, 2.85, cw, 2.3, 'contain', 'product');
      rule(s, x, 5.35, cw);
      T(s, d, { x, y: 5.47, w: cw, h: 0.9, fontSize: 13 });
    });
    box(s, 9.05, 1.85, W - M - 9.05, 4.95, HEX.INK, 'centre');
    T(s, 'THE CENTRE', { x: 9.35, y: 2.1, w: 3, h: 0.3, fontSize: 10, bold: true, charSpacing: 4, color: HEX.FLAME });
    H1(s, 'Eclipse', { x: 9.35, y: 2.4, w: 3, h: 0.55, fontSize: 26, color: HEX.WHITE });
    pic(s, 'l-013-106', 9.35, 3.05, 3.08, 2.05, 'cover', 'eclipse');
    T(s, 'Hung over a set table in the middle of the room: heat and a dimmable light, on its Eclipse controller.', { x: 9.35, y: 5.25, w: 3.08, h: 1.3, fontSize: 13, color: 'E6E2DE' });
    T(s, 'Every heater on the wall with its controls on its label.', { x: M, y: 6.42, w: 8.2, h: 0.35, fontSize: 13, color: HEX.INK, fontFace: 'Bodoni MT' });
  }

  // 12 · exercise 1
  L.exercise({ section: 'Show The Choice', n: 1, minutes: 7, title: 'Plan A Heat Room Set',
    task: 'Sketch a heat room set for your own store, beside a pergola, outdoor kitchen or furniture set you already show.',
    steps: ['Choose the neighbour: a pergola, an outdoor kitchen or a dining or lounge set.', 'Choose the heater for its style, and its finish for the frame colour.', 'Mark where it mounts, at its listed height, and where the controls and wall switch sit.', 'Mark the seat under it, the demo spot and where the flyer and brochure live.'],
    img: 'w-dorrington-homes-platinum-electric-2',
    notes: 'Give 7 minutes: 4 to sketch alone or in pairs on paper, 3 to share two or three plans. No dimensions: use your own floor. A model answer: beside the black louvered pergola already on the floor, two Tungsten Select 6 kW in black on single posts from the beam (mount height 8 to 12 ft, if the store ceiling allows; otherwise a smaller model at its own listed height), an Affinity 2-channel Dimmer and a wall switch on the post beside the entrance to the set, one label covering heater and controls; a dining set for six under the heaters; a store tablet on a stand with the Bromic app; the flyers in a holder at the table and the Portfolio By Application brochure at the counter. For a modern set: Platinum Electric 4500 W in black glass on the beam (8 to 10 ft) and an Eclipse pendant over the table on its Eclipse controller. Debrief: did every heater have its controls beside it? Could a customer sit in the heat? Installation by a licensed electrician to local code. Display kits and fixtures from Bromic: to confirm with Marketing.' });

  // 13 · check 1
  L.quiz({ section: 'Show The Choice', n: 1, q: 'A Customer Says Their Home Is Modern And Minimal. Where Do You Walk Them First?',
    options: ['The Tungsten Classic, because it is the entry price.', 'Platinum and Eclipse, then the rest of the range.', 'The gas tower, because it moves.', 'Whatever display is nearest the door.'],
    answer: 1, why: 'Modern, contemporary or minimal defaults to Platinum and Eclipse: glass-ceramic, 2.1 in deep and flush, or heat and light over the table. Classic is the good tier, the answer to a tight budget.' });

  // 14 · divider
  L.divider({ n: '03', title: 'A *Live* Demo', line: 'Switch it on in front of them. They feel it in seconds.', img: 'l-013-104',
    notes: 'Part three, about 9 minutes including the second exercise. Nothing sells radiant heat like feeling it.' });

  // 15 · feel it
  {
    const s = L.content('A Live Demo', 'Let Them Feel It', 'A Heater On A Dimmer, Switched On In Front Of Them',
      'The demo is a live electric heater, mounted at its listed height, on an Affinity Dimmer, with the wall switch beside it. Switch it on in front of the customer. Platinum, Tungsten and Eclipse Electric are medium wave infrared and warm up in about 30 seconds (product facts: principles.wavelength, Planning Guide v1.2). Radiant heat warms people and objects directly, so they feel it on their face and hands, not in the air of the store. Then hand them the dimmer: turn it up for a cold night, down for a mild one. Listed heights: Tungsten 2 and 3 kW 8 to 9 ft, 4 kW 8 to 10 ft, 6 kW 8 to 12 ft; Platinum 2300 and 3400 W 8 to 9 ft, 4500 W 8 to 10 ft; Eclipse 8 ft and up. Pick the model your ceiling suits. Installation by a licensed electrician to local code. A space counts as outdoor when at least 30% of its perimeter is permanently open: a store demo is a short demonstration, so ask your rep and electrician what applies indoors (to confirm with the Product team). About 2 minutes.');
    stat(s, '30 s', 'To warm up: medium wave infrared.', M, 1.9, 4.2, { size: 72, h: 1.15, lh: 0.4 });
    const K = [['controller-dimmer', 'On An Affinity Dimmer', 'Hand them the dimmer: up for a cold night, down for a mild one.'],
      ['mount-height', 'At Its Listed Height', 'Mounted as it would be at home, by a licensed electrician.'],
      ['wall-switch', 'The Wall Switch Beside It', 'Switch it on in front of them.']];
    K.forEach(([ic, h, d], i) => {
      const y = 3.85 + i * 1.0;
      L.icon(s, ic, M, y + 0.05, 0.5);
      H1(s, h, { x: M + 0.7, y, w: 3.6, h: 0.4, fontSize: 17 });
      T(s, d, { x: M + 0.7, y: y + 0.38, w: 3.6, h: 0.5, fontSize: 12 });
    });
    pic(s, 'w-kion-sui-madrid-spain-tungsten-electric-4', 5.3, 1.85, W - M - 5.3, 3.5, 'cover', 'photo');
    const hd = { bold: true, color: HEX.WHITE, fill: { color: HEX.INK }, fontSize: 9, charSpacing: 1 };
    const rows = [[{ text: 'HEATER', options: hd }, { text: 'LISTED HEIGHT', options: hd }, { text: 'HEATER', options: hd }, { text: 'LISTED HEIGHT', options: hd }],
      ['Tungsten 2–3 kW', '8–9 ft', 'Platinum 2300 / 3400 W', '8–9 ft'], ['Tungsten 4 kW', '8–10 ft', 'Platinum 4500 W', '8–10 ft'], ['Tungsten 6 kW', '8–12 ft', 'Eclipse', '8 ft and up']]
      .map((r, i) => i ? r.map((c, j) => ({ text: c, options: j % 2 ? {} : { bold: true, color: HEX.INK } })) : r);
    s.addTable(rows, { x: 5.3, y: 5.5, w: W - M - 5.3, colW: [2.0, 1.4, 2.45, 1.58], rowH: 0.32, fontFace: 'Arial', fontSize: 11, color: HEX.BODY, valign: 'middle', margin: [0, 0.1, 0, 0.1],
      border: [{ type: 'none' }, { type: 'none' }, { type: 'solid', pt: 0.75, color: 'C9C9C6' }, { type: 'none' }] });
  }

  // 16 · the app on a tablet
  {
    const s = L.content('A Live Demo', 'The App On A Tablet', 'Then Show Them It Runs From A Phone',
      'Keep a store tablet beside the demo heater with the Bromic app open and a demo zone set up. Show three things: a zone (group the heaters over the dining table, the lounge and the bar, and run each on its own); a schedule (warm before guests arrive, off when the evening ends); and dimming in 1% steps on the Dimmer. Mention voice: Amazon Alexa and Google Assistant; and home systems: Control4, Crestron and Lutron, where compatibility varies and may need extra hardware. The app runs over 2.4 GHz Wi-Fi, with Bluetooth at about 30 ft. Wi-Fi and app features need compatible Affinity controls, sold separately: say so every time. Sources: data/retail/retail.json, Controls; Portfolio By Application, page 10. About 2 minutes.');
    pic(s, 'w-e57caf05-21e4-4f53-9114-170c5861aec4', 0, 1.85, 6.4, 4.95, 'cover', 'photo');
    const A = [['zones', 'Zones', 'The dining table, the lounge and the bar, each on its own.'],
      ['schedule', 'Schedules', 'Warm before guests arrive, off when the evening ends.'],
      ['controller-dimmer', 'Dimming', 'In 1% steps on the Affinity Dimmer.'],
      ['voice', 'Voice And Home Systems', 'Alexa and Google; Control4, Crestron and Lutron.']];
    A.forEach(([ic, h, d], i) => {
      const x = 6.95, y = 1.85 + i * 1.03;
      rule(s, x, y, W - M - x);
      L.icon(s, ic, x, y + 0.15, 0.48);
      H1(s, h, { x: x + 0.7, y: y + 0.12, w: 4.9, h: 0.42, fontSize: 18 });
      T(s, d, { x: x + 0.7, y: y + 0.52, w: 4.9, h: 0.45, fontSize: 13 });
    });
    box(s, 6.95, 6.0, W - M - 6.95, 0.78, HEX.WASH, 'note');
    T(s, 'Wi-Fi and app features need compatible Affinity controls, sold separately.', { x: 7.15, y: 6.0, w: 5.4, h: 0.78, fontSize: 14, color: HEX.INK, fontFace: 'Bodoni MT', valign: 'middle' });
  }

  // 17 · staff demo script
  {
    const s = L.content('A Live Demo', 'Staff Demo Script', 'Two Minutes, Five Moves',
      'Every member of staff runs the same demo, in their own words. 0:00, ask the evening question: "When do you picture using it?" 0:15, ask the style question, and stand at the right display. 0:30, switch the heater on at the wall switch and let them stand under it; in about 30 seconds they feel it. 1:00, hand them the dimmer and the tablet: turn it down, set a zone, show a schedule. 1:30, close with the controls and the next step: every heater comes with its Affinity controls and a wall switch, app features need compatible Affinity controls sold separately, and here is the flyer with the QR code to Bromic\'s free design service. Switch the heater off when they leave. Never quote a price or a spec you are unsure of: "I\'ll confirm that for you." About 2 minutes.');
    const S = [['0:00', 'Ask The Evening', '"When do you picture using it?"'],
      ['0:15', 'Ask The Style', '"How would you describe the style of your space?"'],
      ['0:30', 'Switch It On', '"Stand here. You\'ll feel it in about 30 seconds."'],
      ['1:00', 'Hand Them Control', '"Turn it down. Now set the dining zone on the tablet."'],
      ['1:30', 'Close With The Next Step', '"It comes with its controls and a wall switch. Scan this, and our design team will plan your space, free."']];
    caps(s, 'Time', M, 1.8, 1); caps(s, 'Move', M + 1.6, 1.8, 3); caps(s, 'Say it', 5.6, 1.8, 4);
    S.forEach(([t, h, say], i) => {
      const y = 2.15 + i * 0.92;
      rule(s, M, y, W - 2 * M, i === 2 ? HEX.FLAME : HEX.INK, i === 2 ? 1.5 : 0.75);
      H1(s, t, { x: M, y: y + 0.08, w: 1.5, h: 0.75, fontSize: 34, color: HEX.FLAME });
      H1(s, h, { x: M + 1.6, y: y + 0.2, w: 3.8, h: 0.5, fontSize: 20 });
      H1(s, say, { x: 5.6, y: y + 0.18, w: 7.1, h: 0.7, fontSize: 16, italic: true, color: HEX.BODY });
    });
    rule(s, M, 2.15 + 5 * 0.92, W - 2 * M);
  }

  // 18 · exercise 2
  L.exercise({ section: 'A Live Demo', n: 2, minutes: 6, title: 'Run A Two-Minute Live Demo',
    task: 'In pairs, run the demo script on a customer, then swap. Keep it to two minutes.',
    steps: ['The customer names their space and style; the dealer asks both questions.', 'The dealer switches the heater on (or mimes it) and hands over the dimmer and the tablet.', 'The dealer closes with the controls and the flyer, before the two minutes are up.', 'The customer scores out of 3, then swap roles.'],
    img: 'w-eclipse-electric-w-bromic-heating-app',
    notes: 'Give 6 minutes: about 2 each way plus a minute to debrief. Use the store\'s live heater if you have one; otherwise mime the switch and use a phone for the app. Time it with a phone. Scoring, 1 point each: both questions asked before any product is named; the customer was handed the controls (dimmer or app) rather than watching; the close named the controls, said app features need compatible Affinity controls sold separately, and handed over the flyer with its QR code. A model run: "When do you picture using it?" "Evenings on the terrace." "And the style?" "Modern." Walk to Platinum and Eclipse, switch on at the wall switch, "stand here, you\'ll feel it in about 30 seconds", hand over the dimmer, set the dining zone on the tablet, then: "It comes with its Affinity controls and a wall switch; the app needs compatible Affinity controls, sold separately. Scan this and our design team will plan your space, free." Debrief: who ran over time, and where?' });

  // 19 · divider
  L.divider({ n: '04', title: 'Out The *Door*', line: 'Seasonal resets, the flyer and the brochure.', img: 'l-007-039',
    notes: 'Part four, about 6 minutes. The floor changes with the seasons, and the customer leaves with something in their hand.' });

  // 20 · seasonal resets
  {
    const s = L.content('Out The Door', 'Seasonal Resets', 'Heat Has A Place On The Floor All Year',
      'Principles, not a calendar: your season and your climate set the dates. Give heat a permanent place on the floor and change what it says. Spring: the new pergolas, kitchens and furniture arrive; put heat in those room sets from day one, so it is on the first drawing and the first quote. Summer: show the after-5-pm story; heat is what makes the room work once the sun goes down, and the wiring goes in while the frame is open. Autumn: the cool evenings come; bring the demo heater to the front and switch it on for every customer. Winter: in milder climates, winter evenings outside; elsewhere, plan the spring builds with the design service and pre-wire. Source for the year-round ask: How To Sell deck, "Give heat a place on the floor all year". About 2 minutes.');
    const SE = [['Spring', 'New Room Sets', 'Heat goes into the new pergola, kitchen and furniture sets from day one.'],
      ['Summer', 'After 5 PM', 'Show what the room does once the sun goes down. Pre-wire while frames are open.'],
      ['Autumn', 'To The Front', 'Bring the demo heater forward and switch it on for every customer.'],
      ['Winter', 'Plan The Spring', 'Winter evenings outside in milder climates; design-service plans for spring builds.']];
    pic(s, 'l-002-004', M, 1.85, W - 2 * M, 2.55, 'cover', 'photo');
    const cw = 2.85;
    SE.forEach(([se, h, d], i) => {
      const x = M + i * (cw + 0.2);
      rule(s, x, 4.65, cw);
      T(s, se.toUpperCase(), { x, y: 4.77, w: cw, h: 0.3, fontSize: 10, bold: true, charSpacing: 4, color: HEX.FLAME });
      H1(s, h, { x, y: 5.07, w: cw, h: 0.45, fontSize: 20 });
      T(s, d, { x, y: 5.57, w: cw, h: 1.2, fontSize: 13.5 });
    });
  }

  // 21 · the take-home flyer
  {
    const s = L.content('Out The Door', 'The Take-Home Flyer', 'Every Visitor Leaves With The Flyer',
      'The take-home flyer is two pages. Front: Extend The Moment, why Bromic in three lines, and the pergola builder\'s quote. Back: Which Warmth Is Yours, the four heaters (Tungsten, Platinum, Eclipse and freestanding), three questions to answer at home (where will you sit, how big is it, what is your style), and a QR code to Bromic\'s free design service, with a box to stamp your store. When: hand it over at the end of every demo, and to every visitor who stops at the heat display. How: stamp your store in the box first, point to the QR code, and say what happens when they scan it. Source: reports/retail/take-home-flyer. About 1 minute.');
    const pw = 3.5;
    page(s, fly1, M, 1.85, pw); page(s, fly2, M + pw + 0.25, 1.85, pw);
    const x = 8.45, w = W - M - x;
    T(s, 'WHEN', { x, y: 1.85, w, h: 0.3, fontSize: 10, bold: true, charSpacing: 4, color: HEX.FLAME });
    rule(s, x, 2.2, w);
    H1(s, 'At the end of every demo, and to every visitor at the heat display.', { x, y: 2.32, w, h: 1.0, fontSize: 19 });
    T(s, 'HOW', { x, y: 3.6, w, h: 0.3, fontSize: 10, bold: true, charSpacing: 4, color: HEX.FLAME });
    rule(s, x, 3.95, w);
    ['Stamp your store in the box on the back.', 'Point to the three questions to answer at home.', 'Show the QR code and say what it does.'].forEach((t, i) => {
      const y = 4.1 + i * 0.72;
      num(s, i + 1, x, y, { size: 18, h: 0.4, w: 0.5 });
      T(s, t, { x: x + 0.55, y: y + 0.05, w: w - 0.55, h: 0.5, fontSize: 14, color: HEX.INK });
    });
    T(s, 'Bromic Take-Home Flyer, front and back.', { x: 8.45, y: 6.45, w: 4.2, h: 0.3, fontSize: 10, color: HEX.STEEL });
  }

  // 22 · the brochure
  {
    const s = L.content('Out The Door', 'Portfolio By Application', 'Walk Serious Buyers Through The Brochure',
      'The Portfolio By Application brochure is twelve pages: every outdoor room and the heater to show first in it, with its controls and who to sell it to. Covered patio, pergola, pitched porch, flush ceiling, design-led room, over the table, by the water, lawn and pool, restaurant and bar. It also carries the good, better, best page with Eclipse as the centre, where the heat lands, the app, and the three questions for the floor. When: for a serious buyer, sit down at the counter or the room set and open it to their room. Then leave it with them, with the flyer. The QR code to the design service is on the flyer; the brochure closes on bromic.com. Source: reports/retail/portfolio-applications. About 1 minute.');
    const P = [[1, 'The cover'], [2, 'Every outdoor room'], [5, 'Good, better, best'], [11, 'Three questions on the floor']];
    const pw = 2.8;
    P.forEach(([n, cap], i) => {
      const x = M + i * (pw + 0.3);
      const h = page(s, pb(n), x, 1.85, pw);
      T(s, `Page ${n} · ${cap}`, { x, y: 1.85 + h + 0.08, w: pw, h: 0.3, fontSize: 10, color: HEX.STEEL });
    });
    box(s, M, 5.95, W - 2 * M, 0.85, HEX.WASH, 'when');
    T(s, 'WHEN', { x: M + 0.3, y: 5.95, w: 1.2, h: 0.85, fontSize: 10, bold: true, charSpacing: 4, color: HEX.FLAME, valign: 'middle' });
    H1(s, 'For serious buyers, sitting down: open it to their room, show the heater, its controls and where the heat lands, then leave it with the flyer.', { x: M + 1.4, y: 5.95, w: W - 2 * M - 1.7, h: 0.85, fontSize: 16, valign: 'middle' });
  }

  // 23 · the QR code and the design service
  {
    const s = L.content('Out The Door', 'The Next Step', 'The QR Code Takes Them To The Design Service',
      'The QR code on the back of the flyer goes to bromic.com/design-your-space. The customer sends a photo or plans of their space and Bromic\'s design team suggests the right heaters, free. The line on the flyer: "Scan to send us a photo of your space. Our design team will suggest the right heaters, free." They can also call 1-800-301-1293, Monday to Friday, 9 to 4 Pacific. For your own quotes, send the customer\'s photos or plans to the same service for a full plan. Sources: Take-Home Flyer; data/retail/retail.json, Installation, Warranty And Support. About 1 minute.');
    box(s, M, 1.85, 4.3, 4.95, HEX.GREY, 'qr-panel');
    pic(s, QR, M + 0.65, 2.25, 3.0, 3.0, 'contain', 'qr-code');
    T(s, 'Scan to try it now.', { x: M, y: 5.55, w: 4.3, h: 0.4, fontSize: 13, color: HEX.STEEL, align: 'center' });
    const x = 5.6, w = W - M - x;
    H1(s, '"Scan to send us a photo of your space. Our design team will suggest the right heaters, free."', { x, y: 1.95, w, h: 1.5, fontSize: 24, italic: true });
    T(s, 'THE TAKE-HOME FLYER', { x, y: 3.5, w, h: 0.3, fontSize: 9, bold: true, charSpacing: 3, color: HEX.STEEL });
    stat(s, 'Free', 'Complimentary design service: bromic.com/design-your-space', x, 4.05, 3.3, { size: 54, h: 0.9, lh: 0.8, ls: 13 });
    stat(s, '1-800-301-1293', 'Or by phone, Monday to Friday, 9 to 4 PT.', x + 3.6, 4.05, w - 3.6, { size: 30, h: 0.9, lh: 0.8, ls: 13, color: HEX.INK });
    T(s, 'Send your own customers\' photos and plans the same way, for a full plan.', { x, y: 6.25, w, h: 0.4, fontSize: 13, color: HEX.INK, fontFace: 'Bodoni MT' });
  }

  // 24 · check 2
  L.quiz({ section: 'Out The Door', n: 2, q: 'The Demo Is Over And The Customer Is Keen. What Goes In Their Hand?',
    options: ['Nothing: they can look it up online.', 'The flyer with your store stamped on it, and the brochure open to their room.', 'A price list without controls.', 'A business card only.'],
    answer: 1, why: 'Every visitor gets the flyer, stamped with your store, with its QR code to the free design service; a serious buyer also gets the Portfolio By Application brochure, opened to their room. A price without controls breaks the attach rule.' });

  // 25 · closing
  L.closing({ title: 'Make Heat A *Room*',
    points: ['Set heat beside the pergolas, kitchens and furniture.', 'Put the controls and wall switch beside every heater.', 'Show finishes, frames and the ladder; modern starts at Platinum and Eclipse.', 'Switch it on in front of them, then hand over the dimmer and the tablet.', 'Send every customer home with the flyer and its QR code.'],
    next: 'Before your next shift: walk your floor and mark where heat will sit.', img: 'l-013-100',
    notes: 'Close with the five habits. Ask everyone to name the one change they will make to their floor this week. Display kits, fixtures and a Bromic showroom guide: to confirm with Marketing; ask your Bromic rep. About 1 minute.' });

  await L.finish('Bromic-Dealer-Merchandising-And-Showroom');
}
main().catch((e) => { console.error(e); process.exit(1); });
