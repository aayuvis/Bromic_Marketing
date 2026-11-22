// Retail one-pagers in the white Blueprint look: Controls and Mounting Options (US Letter portrait).
// Facts only from data/retail/retail.json, data/product-facts.json, data/product-marketing/*.json and the Series II manual
// notes in cad/REAL-INSTALL-STUDY.md. Open facts read "To confirm". No prices.
// Run: node reports/retail/controls-mounting/build.mjs
//   → controls.html, mounting.html, pages/controls.png, pages/mounting.png,
//     Bromic-Controls-Sheet.pdf, Bromic-Mounting-Options.pdf, print-check.txt
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const ROOT = '../../..';
const BP = '../../themes/blueprint';

const T = { ink: '#231F20', draw: '#1C2B44', steel: '#6B7480', hair: '#B9C3D0', flame: '#EF4123', paper: '#FFFFFF' };
const TC = '<i class="tc">To confirm</i>';

// ---------- SVG helpers ----------
const lead = (x1, y1, x2, y2, label, { anchor = 'start', cls = 'callt' } = {}) => {
  const lx = anchor === 'start' ? x2 + 4 : x2 - 4;
  return `<circle cx="${x1}" cy="${y1}" r="1.7" fill="${T.draw}"/><polyline points="${x1},${y1} ${x2},${y2}" fill="none" stroke="${T.draw}" stroke-width=".6"/>
  <text x="${lx}" y="${y2 + 3}" class="${cls}" text-anchor="${anchor}">${label}</text>`;
};
const bub = (x, y, k, flame = false) => `<circle cx="${x}" cy="${y}" r="8.5" class="${flame ? 'bubf' : 'bub'}"/><text x="${x}" y="${y + 3.2}" class="bubt${flame ? ' f' : ''}" text-anchor="middle">${k}</text>`;
const slab = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" class="cut" style="fill:url(#hatch)"/>`;
// a linear heater seen from the front: body, end caps, Diamond grille
const heater = (x, y, w, h = 12) => `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2.6}" class="heat"/>
  <rect x="${x + h * 0.7}" y="${y + h * 0.25}" width="${w - h * 1.4}" height="${h * 0.5}" style="fill:url(#dia)" stroke="${T.draw}" stroke-width=".4"/>
  <line x1="${x + h * 0.75}" y1="${y + h / 2}" x2="${x + w - h * 0.75}" y2="${y + h / 2}" stroke="${T.flame}" stroke-width=".7" opacity=".85"/></g>`;
const rays = (pts) => `<g class="ray">${pts.map(([a, b, c, d]) => `<path d="M${a} ${b} L${c} ${d}"/>`).join('')}</g>`;

// ---------- Controls: how a system fits together ----------
const ctlDiagram = `<svg viewBox="0 0 678 240" class="dwg" role="img" aria-label="An Affinity Smart-Heat controller with two channels feeding two zones of heaters, a manual wall switch, the Bromic app over Wi-Fi and the expansion board to building systems">
  <!-- zones of heaters -->
  <rect x="6" y="14" width="236" height="84" class="zone"/>
  <text x="14" y="28" class="zonet">ZONE 1 · DINING</text>
  ${heater(24, 36, 150)}${heater(24, 60, 150)}
  <text x="182" y="45.5" class="callt">3 kW</text><text x="182" y="69.5" class="callt">3 kW</text>
  <text x="14" y="90" class="boxs">CHANNEL 1 · 3 + 3 = 6 kW</text>
  <rect x="6" y="108" width="236" height="64" class="zone"/>
  <text x="14" y="122" class="zonet">ZONE 2 · LOUNGE</text>
  ${heater(24, 132, 190, 14)}
  <text x="14" y="164" class="boxs">CHANNEL 2 · ONE 6 kW HEATER</text>
  ${bub(232, 8, 1)}
  <!-- channel runs -->
  <path d="M242 54 H276 V80 H300" class="run"/><path d="M242 140 H276 V116 H300" class="run"/>
  <text x="248" y="48" class="tiny">CH 1</text><text x="246" y="134" class="tiny">CH 2</text>
  <!-- controller -->
  <text x="352" y="16" class="boxt" text-anchor="middle">AFFINITY SMART-HEAT®</text>
  <text x="352" y="27" class="boxt" text-anchor="middle">CONTROLLER</text>
  <rect x="300" y="36" width="104" height="112" rx="5" class="box"/>
  ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => `<line x1="${314 + i * 7.6}" y1="50" x2="${314 + i * 7.6}" y2="134" class="thin"/>`).join('')}
  <rect x="296" y="74" width="6" height="12" class="box"/><rect x="296" y="110" width="6" height="12" class="box"/>
  ${bub(410, 30, 2)}
  <!-- the per-channel limit, marked -->
  <text x="8" y="196" class="flamet">UP TO 6 kW A CHANNEL</text><text x="8" y="208" class="boxs">AT 208–277 V · ADD UP EACH CHANNEL</text>
  <path d="M136 192 H262 V146" stroke="${T.flame}" stroke-width=".8" fill="none" marker-end="url(#arF)"/>
  <!-- wall switch -->
  <path d="M404 128 H470 V140" class="run"/>
  <rect x="457" y="140" width="26" height="38" rx="2" class="box"/><rect x="465" y="149" width="10" height="20" rx="1.5" class="box"/>
  <text x="470" y="192" class="boxt" text-anchor="middle">MANUAL WALL SWITCH</text>
  <text x="470" y="203" class="boxs" text-anchor="middle">20 A · 120–277 V</text>
  ${bub(494, 136, 3)}
  <!-- app -->
  <rect x="600" y="6" width="54" height="96" rx="8" class="box"/>
  <rect x="604" y="14" width="46" height="78" rx="2" class="scr"/>
  ${[0, 1, 2].map((i) => `<text x="608" y="${27 + i * 23}" class="tiny">ZONE ${i + 1}</text><line x1="608" y1="${34 + i * 23}" x2="646" y2="${34 + i * 23}" class="thin"/><circle cx="${630 - i * 10}" cy="${34 + i * 23}" r="2.8" fill="#fff" stroke="${T.flame}" stroke-width=".9"/>`).join('')}
  ${bub(592, 10, 4)}
  <text x="676" y="116" class="boxt" text-anchor="end">BROMIC APP</text>
  <text x="676" y="127" class="boxs" text-anchor="end">ZONES · SCHEDULES · TIMERS</text>
  <text x="676" y="144" class="boxs" text-anchor="end">ALEXA · GOOGLE ASSISTANT</text>
  <text x="676" y="155" class="boxs" text-anchor="end">CONTROL4 · CRESTRON · LUTRON</text>
  <text x="676" y="166" class="boxs" text-anchor="end">COMPATIBILITY VARIES</text>
  <!-- wireless link -->
  <path d="M404 70 C 470 70, 520 56, 596 56" class="wifi"/>
  ${[0, 1, 2].map((i) => `<path d="M${566 + i * 6} ${50 - i * 4} a ${6 + i * 5} ${6 + i * 5} 0 0 1 0 ${12 + i * 8}" class="arc"/>`).join('')}
  <text x="420" y="44" class="callt">2.4 GHz WI-FI</text><text x="420" y="55" class="boxs">BLUETOOTH ABOUT 30 FT</text>
  <!-- expansion board -->
  <line x1="340" y1="148" x2="340" y2="190" class="run"/>
  <rect x="306" y="190" width="72" height="30" rx="2" class="box"/>
  ${[0, 1, 2, 3, 4].map((i) => `<rect x="${316 + i * 11}" y="212" width="6" height="5" class="thin"/>`).join('')}
  <text x="342" y="204" class="tiny" text-anchor="middle">EXPANSION BOARD</text>
  ${bub(296, 190, 5)}
  <path d="M378 212 H530" class="run" marker-end="url(#arD)"/>
  <text x="536" y="200" class="boxt">BUILDING SYSTEMS</text><text x="536" y="211" class="boxs">ETHERNET · 0–10 V</text>
  <text x="536" y="222" class="boxs">BUILT INTO 5-CHANNEL UNITS</text><text x="536" y="233" class="boxs">BMS MODE TURNS THE APP OFF</text>
</svg>`;

const card = (name, line, rows, fits) => `<div class="card"><p class="cn">${name}</p><p class="cl">${line}</p>
  <dl>${rows.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl><p class="fits"><b>QUOTE WITH</b>${fits}</p></div>`;
const cards = `<div class="cards">
  ${card('On/Off', 'Switches the heaters on each channel on and off.', [['CHANNELS', '1, 2 or 5'], ['A CHANNEL', '6 kW at 208–277 V, or up to 10 gas heaters'], ['RATING', 'IP54']], 'Electric heaters · mounted gas')}
  ${card('Dimmer', 'Sets the warmth to the evening in 1% steps.', [['CHANNELS', '1, 2 or 5'], ['A CHANNEL', '6 kW at 208–277 V'], ['STEPS', '1%']], 'Tungsten Electric · Platinum Electric')}
  ${card('Eclipse', 'Heat in three steps and the LED ring, from the app.', [['CHANNELS', '1 or 5'], ['A CHANNEL', 'One Eclipse heater'], ['HEAT', '33 · 66 · 100%']], 'Eclipse Smart-Heat® Electric')}
  <figure class="ph"><div class="ph-img" style="background-image:url(${ROOT}/images/library/w-affinity-dimmer-2ch-2.webp)"></div>
    <figcaption><b>PHOTO</b> Affinity Smart-Heat® 2-channel Dimmer with the Bromic app.</figcaption></figure>
</div>`;

const qrow = (heater, sub, ctl, setting, cap, app, soon = false) => `<tr${soon ? ' class="soon"' : ''}><td class="ser">${heater}${sub ? `<span class="sub">${sub}</span>` : ''}</td><td>${ctl}</td><td>${setting}</td><td>${cap}</td><td>${app}</td></tr>`;
const quote = `<table class="mx q"><colgroup><col style="width:162px"><col style="width:168px"><col style="width:112px"><col style="width:118px"><col></colgroup>
  <thead><tr><th>HEATER</th><th>CONTROLLER TO QUOTE</th><th>HEAT SETTING</th><th>CAPACITY</th><th>APP AND WI-FI</th></tr></thead><tbody>
  ${qrow('Tungsten Smart-Heat® Electric', 'SERIES II SELECT, COASTAL<br>CLASSIC: JANUARY 2027<br>AND SERIES I', 'Affinity Dimmer as standard; On/Off where dimming is not wanted', 'Dims in 1% steps', '6 kW a channel at 208–277 V', 'Yes, through the Affinity controller')}
  ${qrow('Platinum Smart-Heat® Electric', 'CLASSIC AND MARINE', 'Affinity Dimmer or On/Off; expansion board for building systems', 'Dims in 1% steps', '6 kW a channel at 208–277 V', 'Yes, through the Affinity controller')}
  ${qrow('Eclipse Smart-Heat® Electric', 'PENDANT', 'Affinity Eclipse Controller, or Eclipse Dimmer Controller with remote', 'Heat 33, 66, 100%; LED ring dims', 'One Eclipse a channel', 'With the Affinity Eclipse Controller')}
  ${qrow('Eclipse Smart-Heat® Freestanding', '', 'Eclipse Dimmer Controller and remote, included', 'Heat 33, 66, 100%', 'Included', TC)}
  ${qrow('Platinum Gas · Tungsten Gas', 'MOUNTED', 'Affinity On/Off', 'On or off', 'Up to 10 gas heaters a channel', `Yes, through Affinity On/Off · Tungsten Gas: ${TC}`)}
  ${qrow('Tungsten Smart-Heat® Freestanding Gas', '', 'None: set at its own knob', 'Its own knob', '–', 'Not on the app')}
  </tbody></table>`;

// ---------- Mounting: one section, every mount ----------
const F = 254, S = 1.7, y = (inch) => +(F - inch * S).toFixed(1);
const CEIL = y(112); // flat ceiling finish line, drawn at 112 in
const roofY = (x) => +(CEIL - (x - 430) * 0.3).toFixed(1); // the pitched bay
const RAIL = [[96, 'CEILING · POLE · GAS', 'ECLIPSE PENDANT HEAD', 66], [94, 'RECESSED', 'TUNGSTEN SERIES II', 96], [79, 'ECLIPSE FREESTANDING', 'CLEARANCE', 126], [72, 'WALL MOUNT', 'ELECTRIC', 156]];
const mountDiagram = `<svg viewBox="0 0 678 268" class="dwg" role="img" aria-label="Section through a covered patio showing a wall bracket, a recessed heater, an Eclipse pendant, a ceiling post, a pitched-ceiling adaptor and a freestanding heater, with minimum mounting heights">
  <!-- height rail -->
  <text x="2" y="12" class="lblt">MINIMUM HEIGHT</text><text x="2" y="22" class="rails">ABOVE THE FLOOR</text>
  <line x1="132" y1="${F}" x2="132" y2="${y(100)}" class="obj"/>
  ${RAIL.map(([v, a, b, ly]) => `
    <line x1="126" y1="${y(v)}" x2="138" y2="${y(v)}" stroke="${T.flame}" stroke-width="1.1"/>
    <polyline points="126,${y(v)} 118,${ly - 4}" fill="none" stroke="${T.draw}" stroke-width=".5"/>
    <text x="114" y="${ly}" class="railv" text-anchor="end">${v} IN</text>
    <text x="114" y="${ly + 10}" class="raill" text-anchor="end">${a}</text>
    <text x="114" y="${ly + 19}" class="rails" text-anchor="end">${b}</text>`).join('')}
  <text x="114" y="${F + 4}" class="raill" text-anchor="end">FINISHED FLOOR</text>
  <line x1="140" y1="${y(96)}" x2="590" y2="${y(96)}" class="lvl"/>
  <!-- structure: wall, floor, flat ceiling, pitched bay, post -->
  ${slab(150, 20, 12, F - 20)}
  ${slab(150, F, 520, 12)}
  ${slab(162, 20, 268, 12)}
  <line x1="162" y1="${CEIL}" x2="430" y2="${CEIL}" class="obj"/>
  ${[194, 262, 334, 404].map((x) => `<rect x="${x}" y="32" width="7" height="${CEIL - 32}" class="cut" style="fill:#fff"/>`).join('')}
  <polygon points="430,${CEIL} 430,20 560,${roofY(560) - 12} 560,${roofY(560)}" style="fill:url(#hatch2)" stroke="${T.draw}" stroke-width=".9"/>
  <rect x="554" y="${roofY(560)}" width="8" height="${F - roofY(560)}" class="cut" style="fill:#fff"/>
  <!-- furniture -->
  <g class="furn">
    <rect x="236" y="${y(29)}" width="100" height="3"/><line x1="244" y1="${y(29) + 3}" x2="244" y2="${F}"/><line x1="328" y1="${y(29) + 3}" x2="328" y2="${F}"/>
    <path d="M216 ${F} V${y(17)} H236 M216 ${y(17)} V${y(34)}"/><path d="M356 ${F} V${y(17)} H336 M356 ${y(17)} V${y(34)}"/>
    <path d="M450 ${F} V${y(16)} H528 V${F} M450 ${y(16)} V${y(30)} M528 ${y(16)} V${y(24)}"/>
    <path d="M612 ${F} V${y(16)} H652 V${F} M652 ${y(16)} V${y(32)}"/>
  </g>
  <!-- 1 wall bracket, angled -->
  <line x1="162" y1="${y(86)}" x2="176" y2="${y(86)}" class="obj" style="stroke-width:2"/>
  <g transform="rotate(32 176 ${y(86)})"><rect x="174" y="${y(86) - 2}" width="30" height="13" rx="5" class="heat"/><line x1="178" y1="${y(86) + 11.2}" x2="200" y2="${y(86) + 11.2}" stroke="${T.flame}" stroke-width="1.1"/></g>
  ${rays([[196, y(78), 232, y(46)], [190, y(76), 212, y(40)], [200, y(82), 248, y(60)]])}
  ${bub(178, y(103), 1, true)}
  <!-- 2 recessed, low-clearance kit -->
  <rect x="212" y="${CEIL - 16}" width="40" height="16" class="cut" style="fill:#fff"/>
  <rect x="214" y="${CEIL - 5}" width="36" height="5" class="heat"/><line x1="216" y1="${CEIL - 0.6}" x2="248" y2="${CEIL - 0.6}" stroke="${T.flame}" stroke-width="1.2"/>
  <text x="232" y="${CEIL - 19}" class="tiny" text-anchor="middle">KIT</text>
  ${rays([[222, CEIL + 3, 214, y(68)], [232, CEIL + 3, 232, y(66)], [242, CEIL + 3, 250, y(68)]])}
  ${bub(232, CEIL + 15, 2, true)}
  <!-- 3 Eclipse pendant on a pole -->
  <line x1="298" y1="${CEIL}" x2="298" y2="${y(104)}" class="obj" style="stroke-width:1.6"/>
  <path d="M274 ${y(104)} Q298 ${y(108)} 322 ${y(104)} L318 ${y(101)} Q298 ${y(103.5)} 278 ${y(101)} Z" class="heat"/>
  <ellipse cx="298" cy="${y(101.2)}" rx="20" ry="1.6" fill="none" stroke="${T.flame}" stroke-width="1"/>
  ${rays([[288, y(99), 274, y(40)], [298, y(99), 298, y(38)], [308, y(99), 322, y(40)]])}
  ${bub(298, y(90), 3, true)}
  <!-- 4 ceiling post, Series II -->
  <line x1="384" y1="${CEIL}" x2="384" y2="${y(103)}" class="obj" style="stroke-width:2"/>
  ${heater(352, y(103), 64, 9)}
  ${rays([[372, y(97), 356, y(44)], [384, y(97), 384, y(42)], [396, y(97), 412, y(44)]])}
  ${bub(384, y(89), 4, true)}
  <!-- 5 pitched-ceiling adaptor: post hangs straight, heater level -->
  <path d="M472 ${roofY(472)} L488 ${roofY(488)} L480 ${roofY(480) + 6} Z" class="box"/>
  <line x1="480" y1="${roofY(480) + 6}" x2="480" y2="${y(104)}" class="obj" style="stroke-width:2"/>
  ${heater(450, y(104), 60, 9)}
  ${rays([[470, y(98), 458, y(46)], [480, y(98), 480, y(44)], [490, y(98), 504, y(46)]])}
  ${bub(480, y(90), 5, true)}
  <text x="500" y="${roofY(500) + 14}" class="tiny">3/12–12/12</text>
  <!-- 6 freestanding -->
  <path d="M600 ${F} h32 M616 ${F} v-6" class="obj"/>
  <path d="M616 ${F - 6} C 616 ${y(70)}, 614 ${y(92)}, 640 ${y(92)}" class="obj" fill="none" style="stroke-width:1.6"/>
  <path d="M626 ${y(92)} Q650 ${y(96)} 672 ${y(92)} L669 ${y(89.5)} Q648 ${y(92)} 629 ${y(89.5)} Z" class="heat"/>
  <ellipse cx="649" cy="${y(89.8)}" rx="18" ry="1.4" fill="none" stroke="${T.flame}" stroke-width="1"/>
  ${rays([[640, y(87), 630, y(40)], [652, y(87), 652, y(38)]])}
  ${bub(596, y(70), 6, true)}
  <!-- tilt detail, top right -->
  <g transform="translate(592 6)">
    <text x="0" y="6" class="lblt">BRACKET</text><text x="0" y="15" class="rails">SERIES II</text>
    <line x1="8" y1="26" x2="8" y2="70" class="obj" style="stroke-width:2"/>
    ${[0, 15, 30, 45].map((a) => `<line x1="8" y1="26" x2="${(8 + 42 * Math.sin(a * Math.PI / 180)).toFixed(1)}" y2="${(26 + 42 * Math.cos(a * Math.PI / 180)).toFixed(1)}" stroke="${a ? T.flame : T.draw}" stroke-width="${a ? 0.8 : 0.6}" ${a ? '' : 'stroke-dasharray="2 2"'}/>`).join('')}
    <text x="0" y="82" class="tiny">15° · 30° · 45°</text>
  </g>
</svg>`;

const legend = `<ol class="legend">
  <li><span class="no">1</span><b>Wall bracket</b>Angled at the seats</li>
  <li><span class="no">2</span><b>Recessed</b>Flush, with its kit</li>
  <li><span class="no">3</span><b>Pendant pole</b>Eclipse, over the table</li>
  <li><span class="no">4</span><b>Ceiling post</b>Or a pole, for height</li>
  <li><span class="no">5</span><b>Pitched adaptor</b>Post straight, heater level</li>
  <li><span class="no">6</span><b>Freestanding</b>Eclipse arch, gas tower</li>
</ol>`;

const mrow = (ser, sub, cells, soon = false) => `<tr${soon ? ' class="soon"' : ''}><td class="ser">${ser}${sub ? `<span class="sub">${sub}</span>` : ''}</td>${cells.map((c) => typeof c === 'string' ? `<td>${c}</td>` : `<td colspan="${c[1]}" class="span">${c[0]}</td>`).join('')}</tr>`;
const NO = '<span class="no-m">–</span>';
const tcl = '<i class="tc">to confirm</i>';
const mount = `<table class="mx m"><colgroup><col style="width:106px"><col style="width:96px"><col style="width:112px"><col style="width:70px"><col style="width:106px"><col style="width:96px"><col></colgroup>
  <thead><tr><th>SERIES</th><th>1 · WALL</th><th>4 · CEILING AND POLE</th><th>5 · PITCHED</th><th>2 · RECESSED</th><th>TILT</th><th>MINIMUM HEIGHT</th></tr></thead><tbody>
  ${mrow('Tungsten Select · Coastal', 'SERIES II', ['Bracket, straight or angled; Wall-Mounting Bracket, 14 or 18 in reach', 'Single post; 600 and 1,200 mm poles', 'Pitched-Ceiling Adaptor, 3/12 to 12/12', 'Low-Clearance Recess Kit, 7.5 in cavity; marine-grade on Coastal', `15°, 30°, 45°; 4 and 6 kW on a ceiling 30° in the manual, 45° ${tcl}`, `Wall 71 in · ceiling 96 in · recessed 94 in · ${tcl}`])}
  ${mrow('Tungsten Classic', 'SERIES II · JANUARY 2027', [[`Same mounting as Tungsten Electric Series I · ${tcl}`, 3], 'Existing Tungsten recess kit', TC, 'Wall 72 in · ceiling 96 in (Series I)'])}
  ${mrow('Platinum Smart-Heat® Electric', 'CLASSIC AND MARINE', ['Bracket included, straight or angled', '8 in pole included; 2 ft and 4 ft poles', NO, 'Low-clearance kit, 7.1 in cavity; standard kit 10 in above (13.8 in for 4500 W)', `Wall bracket 28° or 30°, ${tcl}`, 'Wall 72 in · ceiling 96 in · recessed about 8 ft'])}
  ${mrow('Eclipse Smart-Heat® Electric', 'PENDANT', [`Wall-mount pole; projection ${tcl}`, '24 in twin pole included; 8, 24, 48 in straight; 24 in curved', NO, 'Not recessed', NO, 'Head 8 ft (96 in)'])}
  ${mrow('Eclipse Smart-Heat® Freestanding', '6 · FREESTANDING', [['Arched arm on a weighted base with two wheels; 15 ft cable to an IP54 outdoor outlet; the base holds in winds up to 20 mph', 5], '79 in clearance'])}
  ${mrow('Platinum Gas · Tungsten Gas', 'MOUNTED', ['Wall bracket, included with Platinum Gas', 'Ceiling pole: two Platinum back to back; Tungsten poles in six lengths', 'On a ceiling pole', 'Not recessed', '0°, 10° or 20°; Tungsten arm ±25°', '96 in · 3 ft to combustibles, 14 in above with a heat deflector'])}
  ${mrow('Tungsten Smart-Heat® Freestanding Gas', '6 · FREESTANDING', [['Wheels, tilting head and anti-tilt switch; propane from a 20 lb cylinder in the base, or natural gas on a 10 ft quick-connect line', 5], TC])}
  </tbody></table>`;

// ---------- page furniture ----------
const zones = () => {
  const cols = [1, 2, 3, 4, 5, 6], rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const top = cols.map((k, i) => `<span style="left:${(i + 0.5) * 100 / cols.length}%">${k}</span>`).join('');
  const side = rows.map((k, i) => `<span style="top:${(i + 0.5) * 100 / rows.length}%">${k}</span>`).join('');
  return `<div class="zones"><div class="zt">${top}</div><div class="zb">${top}</div><div class="zl">${side}</div><div class="zr">${side}</div></div>`;
};
const strip = (sheet, title, notes) => `<div class="strip">
  <div class="cell grow"><b>SOURCES</b><span>${notes}</span></div>
  <div class="cell"><b>FOR</b><span>Retail partners</span></div>
  <div class="cell"><b>SHEET TITLE</b><span>${title}</span></div>
  <div class="cell s"><b>SCALE</b><span>NTS</span></div>
  <div class="cell"><b>REVISION</b><span>Draft for review</span></div>
  <div class="cell s"><b>DATE</b><span>2026-11-21</span></div>
  <div class="cell sheet"><b>SHEET</b><span>${sheet}</span></div>
</div>`;
const head = (eyebrow, h2, lede, photo, cap) => `<header class="s-head${photo ? ' mount-h' : ''}">
  <div class="s-text"><div class="brand"><img class="logo" src="${ROOT}/images/portfolio/bromic-logo.png" alt="Bromic"><span class="lbl">RETAIL ONE-PAGER</span></div>
  <p class="eyebrow">${eyebrow}</p><h2>${h2}</h2><p class="s-lede">${lede}</p></div>
  ${photo ? `<figure class="ph top"><div class="ph-img" style="background-image:url(${ROOT}/images/library/${photo})"></div><figcaption><b>PHOTO</b> ${cap}</figcaption></figure>` : ''}
</header>`;

const controls = `<section class="page light">
  <div class="grid"></div>${zones()}<div class="frame"></div><div class="flow">
  ${head('AFFINITY SMART-HEAT® CONTROLS', 'Every Heater Leaves With Its Controls',
    'Every Bromic heater is quoted with its Affinity Smart-Heat® Controls and a manual wall switch, so the warmth is always where, and when, your customer wants it. Controls are part of the heater, on the same quote.', null, '')}
  <figure class="panel sys">
    <div class="hdr"><span class="lbl">HOW A SYSTEM FITS TOGETHER</span><span class="lbl r">ILLUSTRATIVE · TWO-CHANNEL DIMMER</span></div>
    ${ctlDiagram}
    <p class="order"><span>1</span> HEATERS <i>→</i> <span>2</span> AFFINITY CONTROLLER <i>→</i> <span>3</span> MANUAL WALL SWITCH <i>→</i> <span>4</span> BROMIC APP <i>·</i> <span>5</span> EXPANSION BOARD</p>
  </figure>
  <div class="sec"><div class="hdr"><span class="lbl">ON/OFF, DIMMER OR ECLIPSE</span><span class="lbl r">EVERY CONTROLLER IS SOLD SEPARATELY</span></div>${cards}</div>
  <div class="sec mxw"><div class="hdr"><span class="lbl">WHAT TO QUOTE WITH EACH SERIES</span><span class="lbl r">CONTROLS ARE REQUIRED ON EVERY HEATER</span></div>${quote}
  </div>
  <div class="foot2"><p class="disc"><b>GOOD TO KNOW</b> Wi-Fi and app features need compatible Affinity Smart-Heat® Controls, sold separately. Alexa and Google Assistant need no expansion board; Control4, Crestron and Lutron may need extra hardware. Quote no default timer length. Controllers carry a 1-year warranty. Installation by a licensed electrician to local code.</p>
  <a class="btn">EXPLORE AFFINITY SMART-HEAT CONTROLS <span>→</span></a></div>
  </div>
  ${strip('01', 'Affinity Smart-Heat® Controls', 'Bromic Lookbook 2026 p.41 · bromic.com Affinity controller, wall switch and expansion board pages, read 29 Oct 2026 · Retail Hub, controls page')}
</section>`;

const mounting = `<section class="page light">
  <div class="grid"></div>${zones()}<div class="frame"></div><div class="flow">
  ${head('MOUNTING OPTIONS', 'Designed To Fit Every Outdoor Room',
    'Wall, ceiling, pitched roof or flush in the soffit, there is a Bromic mount for the space your customer has. Start with the surface, then the series, and quote the bracket, pole or kit with the heater.', 'l-005-022.webp', 'Tungsten Coastal, recessed flush.')}
  <figure class="panel sec2">
    <div class="hdr"><span class="lbl">SECTION · EVERY WAY TO MOUNT</span><span class="lbl r">ILLUSTRATIVE · NOT TO SCALE</span></div>
    ${mountDiagram}
    ${legend}
  </figure>
  <div class="sec mxw2"><div class="hdr"><span class="lbl">MOUNTS BY SERIES</span><span class="lbl r">– NOT OFFERED</span></div>${mount}
    <p class="fn">Published minimums, varying with output; Series II figures are from its manual, pending Product team sign-off. Recessed Series II heaters run with the joists, 500 mm or more from a wall. Quote every heater with its Affinity Smart-Heat® Controls and a manual wall switch; Wi-Fi and app features need compatible Affinity Smart-Heat® Controls, sold separately.</p>
  </div>
  <div class="foot2"><p class="disc"><b>BEFORE ANY HEATER GOES UP</b> Follow the installation manual for the model and local codes. Electric heaters are installed by a licensed electrician to NFPA 70 (NEC), gas heaters by a licensed gas fitter to ANSI Z223.1/NFPA 54. Check every install with the local building authority.</p>
  <a class="btn">REQUEST YOUR DESIGN PLAN <span>→</span></a></div>
  </div>
  ${strip('02', 'Mounting Options', 'Bromic Lookbook 2026 · bromic.com product pages, read 29 Oct 2026 · Tungsten Series II launch deck and installation manual, low-clearance recess kit instructions · Planning Guide v1.2, 2021')}
</section>`;

// ---------- styles ----------
const css = `
@font-face{font-family:BzDidot;src:url(${ROOT}/app/src/fonts/gfs-didot-latin.woff2) format('woff2')}
@font-face{font-family:BzSans;src:url(${ROOT}/app/src/fonts/arimo-latin.woff2) format('woff2')}
@font-face{font-family:BzMono;src:url(${BP}/fonts/plex-mono-400.woff2) format('woff2');font-weight:400}
@font-face{font-family:BzMono;src:url(${BP}/fonts/plex-mono-500.woff2) format('woff2');font-weight:500}
@page{size:Letter;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#fff}
body{font-family:BzSans,Arial,sans-serif;color:${T.ink};-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:8.5in;height:11in;position:relative;overflow:hidden;margin:0 auto;background:#fff}
.grid{position:absolute;inset:.42in;pointer-events:none;background-image:linear-gradient(rgba(28,43,68,.07) .6px,transparent .6px),linear-gradient(90deg,rgba(28,43,68,.07) .6px,transparent .6px),linear-gradient(rgba(28,43,68,.028) .5px,transparent .5px),linear-gradient(90deg,rgba(28,43,68,.028) .5px,transparent .5px);background-size:1in 1in,1in 1in,.125in .125in,.125in .125in}
.frame{position:absolute;inset:.42in;border:.9px solid ${T.draw};pointer-events:none}
.zones{position:absolute;inset:.3in;border:.5px solid ${T.steel};color:${T.steel};font:500 6px/1 BzMono,monospace;letter-spacing:.1em;pointer-events:none}
.zones .zt,.zones .zb{position:absolute;left:.12in;right:.12in;height:.12in}.zones .zt{top:0}.zones .zb{bottom:0}
.zones .zl,.zones .zr{position:absolute;top:.12in;bottom:.12in;width:.12in}.zones .zl{left:0}.zones .zr{right:0}
.zones span{position:absolute;transform:translate(-50%,-50%)}
.zones .zt span,.zones .zb span{top:50%}.zones .zl span,.zones .zr span{left:50%}
.lbl,.eyebrow{font:500 7.6px/1.2 BzMono,monospace;letter-spacing:.16em;text-transform:uppercase}
.eyebrow{color:${T.flame}}
h2{font-family:BzDidot,Didot,serif;font-weight:400;letter-spacing:-.005em}
.s-head{position:absolute;left:.72in;right:.72in;top:.62in;display:flex;gap:.3in;align-items:flex-start}
.s-text{flex:1}
.brand{display:flex;align-items:center;justify-content:space-between;border-bottom:.9px solid ${T.draw};padding-bottom:7px;margin-bottom:12px;color:${T.draw}}
.logo{height:15px;display:block}
.s-head h2{font-size:33px;line-height:1.08;margin:6px 0 8px;color:${T.ink}}
.s-lede{font-size:10.6px;line-height:1.55;color:#3f3b3c;max-width:5.9in}
.ph{border:.6px solid ${T.draw};padding:4px;background:#fff}
.ph.top{width:1.5in;flex:none;margin-top:0}
.ph.top .ph-img{height:.92in}
.ph-img{height:1.36in;background-size:cover;background-position:center}
.ph figcaption{display:block;font:400 6.8px/1.4 BzMono,monospace;letter-spacing:.04em;margin-top:4px;color:${T.steel}}
.ph figcaption b{font-weight:500;color:${T.flame};margin-right:4px;letter-spacing:.14em}
.hdr{display:flex;justify-content:space-between;border-bottom:.9px solid ${T.draw};padding-bottom:5px;margin-bottom:8px;color:${T.draw}}
.hdr .r{color:${T.flame}}
.panel{color:${T.draw}}
.dwg{display:block;width:100%;height:auto;overflow:visible}
.dwg .cut{stroke:${T.draw};stroke-width:.9;fill:none}
.dwg .obj{stroke:${T.draw};stroke-width:1;fill:none}
.dwg .thin{stroke:${T.draw};stroke-width:.5;fill:none}
.dwg .ext{stroke:${T.draw};stroke-width:.4}
.dwg .lvl{stroke:${T.flame};stroke-width:.5;stroke-dasharray:6 4;opacity:.55}
.dwg .heat{fill:#fff;stroke:${T.draw};stroke-width:1}
.dwg .furn path,.dwg .furn line,.dwg .furn rect{stroke:${T.steel};stroke-width:.7;fill:none}
.dwg .ray path{stroke:${T.flame};stroke-width:.6;stroke-dasharray:3 3;fill:none;opacity:.75}
.dwg .callt{font:500 8.4px BzMono,monospace;letter-spacing:.08em;fill:${T.draw}}
.dwg .box{fill:#fff;stroke:${T.draw};stroke-width:.9}
.dwg .scr{fill:#fff;stroke:${T.draw};stroke-width:.5}
.dwg .boxt{font:500 8.4px BzMono,monospace;letter-spacing:.06em;fill:${T.draw}}
.dwg .boxs{font:400 7.2px BzMono,monospace;letter-spacing:.05em;fill:${T.steel}}
.dwg .tiny{font:500 6.8px BzMono,monospace;letter-spacing:.05em;fill:${T.draw}}
.dwg .zonet{font:500 8px BzMono,monospace;letter-spacing:.12em;fill:${T.draw}}
.dwg .flamet{font:500 9px BzMono,monospace;letter-spacing:.1em;fill:${T.flame}}
.dwg .lblt{font:500 7.6px BzMono,monospace;letter-spacing:.14em;fill:${T.draw}}
.dwg .railv{font:500 10px BzMono,monospace;letter-spacing:.04em;fill:${T.flame}}
.dwg .raill{font:500 7px BzMono,monospace;letter-spacing:.08em;fill:${T.draw}}
.dwg .rails{font:400 6.4px BzMono,monospace;letter-spacing:.06em;fill:${T.steel}}
.dwg .zone{fill:rgba(239,65,35,.025);stroke:${T.draw};stroke-width:.6;stroke-dasharray:8 3 2 3}
.dwg .run{stroke:${T.draw};stroke-width:1.1;fill:none}
.dwg .wifi{stroke:${T.draw};stroke-width:.8;stroke-dasharray:3 3;fill:none}
.dwg .arc{stroke:${T.flame};stroke-width:.8;fill:none}
.dwg .bub{fill:#fff;stroke:${T.draw};stroke-width:.9}.dwg .bubf{fill:#fff;stroke:${T.flame};stroke-width:1}
.dwg .bubt{font:500 8.4px BzMono,monospace;fill:${T.draw}}.dwg .bubt.f{fill:${T.flame}}
.steps,.legend{list-style:none;display:grid;grid-template-columns:repeat(5,1fr);gap:10px;margin-top:6px;border-top:.6px solid ${T.draw};padding-top:7px}
.legend{grid-template-columns:repeat(6,1fr);gap:8px}
.steps li,.legend li{font-size:7.8px;line-height:1.35;color:#3f3b3c;position:relative;padding-left:21px}
.steps b,.legend b{display:block;font:500 7.6px/1.3 BzMono,monospace;letter-spacing:.06em;text-transform:uppercase;color:${T.draw};margin-bottom:1px}
.steps .no,.legend .no{position:absolute;left:0;top:0;width:15px;height:15px;border-radius:50%;border:.8px solid ${T.draw};display:grid;place-items:center;font:500 7.4px/1 BzMono,monospace;color:${T.draw}}
.legend .no{border-color:${T.flame};color:${T.flame}}
.sys{position:absolute;left:.72in;right:.72in;top:2.06in}
.sec{position:absolute;left:.72in;right:.72in;top:5.32in}
.cards{display:grid;grid-template-columns:1fr 1fr 1fr 1.42in;gap:12px}
.card{border:.7px solid ${T.draw};padding:6px 9px 7px;background:#fff;display:flex;flex-direction:column}
.cn{font-family:BzDidot,Didot,serif;font-size:17px;line-height:1.1;color:${T.ink}}
.cl{font-size:8.4px;line-height:1.35;color:#3f3b3c;margin:2px 0 5px}
.card dl{display:grid;grid-template-columns:auto 1fr;gap:2px 8px;font-size:8.2px;line-height:1.28;border-top:.5px solid ${T.hair};padding-top:5px}
.card dt{font:500 6.6px/1.6 BzMono,monospace;letter-spacing:.1em;color:${T.steel}}
.card dd{color:${T.ink}}
.fits{margin-top:auto;padding-top:5px;font-size:8.2px;line-height:1.3;color:${T.ink}}
.fits b{display:block;font:500 6.6px BzMono,monospace;letter-spacing:.12em;color:${T.flame};margin-bottom:1px}
.cards .ph .ph-img{height:.86in}
.mxw{top:6.98in}
.mx{width:100%;border-collapse:collapse;table-layout:fixed;font-size:8.3px;line-height:1.33;color:${T.ink}}
.mx th{font:500 6.6px/1.2 BzMono,monospace;letter-spacing:.12em;text-align:left;color:${T.steel};padding:0 8px 5px 0;border-bottom:.6px solid ${T.draw}}
.mx td{padding:3.6px 8px 3.6px 0;border-bottom:.5px solid ${T.hair};vertical-align:top}
.mx td.ser{font-weight:700;font-size:8.6px}
.mx .sub{display:block;font:500 6.2px/1.4 BzMono,monospace;letter-spacing:.08em;color:${T.steel};font-weight:500;margin-top:1px}
.mx td.span{color:#3f3b3c}
.soon-t{color:${T.flame}}
.tc{color:${T.flame};font-style:italic}
.no-m{color:${T.steel}}
.fn{font:400 6.9px/1.5 BzMono,monospace;color:${T.steel};margin-top:6px;letter-spacing:.01em}
.cta{position:absolute;left:.72in;right:.72in;bottom:1.0in;display:flex;align-items:center;gap:16px}
.btn{display:inline-flex;gap:12px;align-items:center;border:.9px solid ${T.flame};color:${T.flame};font:500 7.6px/1 BzMono,monospace;letter-spacing:.16em;padding:7px 12px;text-decoration:none;background:#fff}
.addr{font:400 7px/1 BzMono,monospace;letter-spacing:.1em;color:${T.steel}}
.foot2{position:absolute;left:.72in;right:.72in;bottom:.98in;display:flex;gap:.3in;align-items:center}
.foot2 .btn{flex:none}
.disc{flex:1;font-size:8px;line-height:1.45;color:#3f3b3c;border-left:1.2px solid ${T.flame};padding-left:8px}
.disc b{font:500 6.8px BzMono,monospace;letter-spacing:.14em;color:${T.flame};margin-right:5px}
.strip{position:absolute;left:.42in;right:.42in;bottom:.42in;height:.48in;display:flex;border-top:.9px solid ${T.draw};font:400 7px/1.25 BzMono,monospace;color:${T.ink};background:#fff}
.strip .cell{padding:5px 7px;border-right:.5px solid ${T.hair};display:flex;flex-direction:column;justify-content:space-between;white-space:nowrap}
.strip .cell:last-child{border-right:0}
.strip .cell.grow{flex:1;white-space:normal}
.strip .cell.grow span{font-size:6px;line-height:1.35;color:${T.steel}}
.strip b{font-weight:500;font-size:5.4px;letter-spacing:.16em;color:${T.steel}}
.strip .sheet span{font-size:15px;line-height:1;color:${T.draw}}
.flow{position:absolute;left:.72in;right:.72in;top:.62in;bottom:.98in;display:flex;flex-direction:column;gap:10px}
.flow>*{position:static!important;flex:none}
.flow>.cta,.flow>.foot2{margin-top:auto}
.s-head{display:flex;gap:.3in;align-items:flex-start}
.mount-h h2{font-size:29px}
.order{font:500 7.4px/1 BzMono,monospace;letter-spacing:.1em;color:${T.draw};margin-top:3px;padding-top:6px;border-top:.6px solid ${T.draw}}
.order span{display:inline-grid;place-items:center;width:14px;height:14px;border-radius:50%;border:.8px solid ${T.draw};font-size:7px;margin-right:3px}
.order i{font-style:normal;color:${T.flame};margin:0 6px}
/* mounting sheet */
.sec2{position:absolute;left:.72in;right:.72in;top:2.12in}
.mxw2{position:absolute;left:.72in;right:.72in;top:5.92in}
.mx.m{font-size:7.9px;line-height:1.3}
.mx.m td{padding:4px 7px 4px 0}
`;

const defs = `<svg width="0" height="0" style="position:absolute"><defs>
  <marker id="arD" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 1.5 L10 5 L0 8.5" fill="${T.draw}"/></marker>
  <marker id="arF" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 1.5 L10 5 L0 8.5" fill="${T.flame}"/></marker>
  <pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="5" stroke="${T.draw}" stroke-width=".5"/></pattern>
  <pattern id="hatch2" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="${T.draw}" stroke-width=".35"/></pattern>
  <pattern id="dia" width="5" height="4" patternUnits="userSpaceOnUse"><path d="M0 2 L2.5 0 L5 2 L2.5 4 Z" fill="none" stroke="${T.draw}" stroke-width=".35"/></pattern>
</defs></svg>`;

const doc = (title, body) => `<!doctype html><html lang="en-US"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${title}</title><style>${css}</style></head><body>${defs}${body}</body></html>`;

const SHEETS = [
  { id: 'controls', title: 'Bromic Controls Sheet', body: controls, pdf: 'Bromic-Controls-Sheet.pdf' },
  { id: 'mounting', title: 'Bromic Mounting Options', body: mounting, pdf: 'Bromic-Mounting-Options.pdf' },
];

// ---------- render and print check ----------
const { chromium } = require('playwright');
mkdirSync(join(here, 'pages'), { recursive: true });
const browser = await chromium.launch();
const report = [];
for (const s of SHEETS) {
  const html = doc(s.title, s.body);
  writeFileSync(join(here, `${s.id}.html`), html);
  // copy rules: no prices, no "optional" controls, no long dash, no exclamation mark in the words
  const words = html.replace(/<style>[\s\S]*?<\/style>/, '').replace(/<[^>]+>/g, ' ');
  if (/\$\s?\d/.test(words)) report.push(`${s.id}: a price appears`);
  if (/optional/i.test(words)) report.push(`${s.id}: "optional" appears`);
  if (/—/.test(words)) report.push(`${s.id}: long dash in copy`);
  if (/!/.test(words)) report.push(`${s.id}: exclamation mark`);
  if (!/sold separately/i.test(words)) report.push(`${s.id}: the Wi-Fi/app line is missing`);
  const page = await browser.newPage({ viewport: { width: 816, height: 1056 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(join(here, `${s.id}.html`)).href, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const qa = await page.evaluate(() => {
    const out = [];
    const pg = document.querySelector('.page').getBoundingClientRect();
    const frame = { left: pg.left + 40, right: pg.right - 40, top: pg.top + 40, bottom: pg.bottom - 40 };
    const stripTop = document.querySelector('.strip').getBoundingClientRect().top;
    const hit = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    // text leaves inside the frame; overflow of fixed boxes
    document.querySelectorAll('.page p, .page h2, .page li, .page td, .page th, .page dd, .page dt, .page figcaption, .page .btn').forEach((el) => {
      const r = el.getBoundingClientRect(); if (!r.width) return;
      if (r.left < frame.left - 1 || r.right > frame.right + 1 || r.top < frame.top - 1) out.push(`off frame: "${el.textContent.trim().slice(0, 40)}"`);
      if (!el.closest('.strip') && r.bottom > stripTop - 2) out.push(`runs into the title strip: "${el.textContent.trim().slice(0, 40)}"`);
      if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflow !== 'visible') out.push(`clipped: "${el.textContent.trim().slice(0, 40)}"`);
    });
    const fl = document.querySelector('.flow');
    if (fl.scrollHeight > fl.clientHeight + 1) out.push(`content is ${fl.scrollHeight - fl.clientHeight}px taller than the sheet`);
    // blocks must not collide
    const blocks = [...document.querySelectorAll('.s-head, .panel, .sec, .cta, .foot2')].map((e) => ({ e, r: e.getBoundingClientRect() }));
    for (let i = 0; i < blocks.length; i++) for (let j = i + 1; j < blocks.length; j++) {
      if (hit(blocks[i].r, blocks[j].r) > 4) out.push(`blocks overlap: ${blocks[i].e.className} / ${blocks[j].e.className}`);
    }
    // drawing text: inside its drawing and not overlapping other drawing text
    document.querySelectorAll('svg.dwg').forEach((svg) => {
      const sr = svg.getBoundingClientRect();
      const ts = [...svg.querySelectorAll('text')].map((t) => ({ t: t.textContent, r: t.getBoundingClientRect() })).filter((x) => x.r.width);
      ts.forEach((x) => { if (x.r.left < sr.left - 2 || x.r.right > sr.right + 2 || x.r.top < sr.top - 2 || x.r.bottom > sr.bottom + 2) out.push(`drawing text outside its drawing: "${x.t}"`); });
      for (let i = 0; i < ts.length; i++) for (let j = i + 1; j < ts.length; j++) {
        const ov = hit(ts[i].r, ts[j].r);
        if (ov > 0.15 * Math.min(ts[i].r.width * ts[i].r.height, ts[j].r.width * ts[j].r.height)) out.push(`drawing labels overlap: "${ts[i].t}" / "${ts[j].t}"`);
      }
    });
    // images
    const bg = [...document.querySelectorAll('.ph-img')].map((d) => getComputedStyle(d).backgroundImage.slice(5, -2));
    document.querySelectorAll('img').forEach((im) => { if (!im.naturalWidth) out.push('missing image ' + im.src); });
    return { out, bg };
  });
  for (const u of qa.bg) {
    const ok = await page.evaluate((u) => new Promise((res) => { const i = new Image(); i.onload = () => res(i.naturalWidth); i.onerror = () => res(0); i.src = u; }), u);
    if (!ok) qa.out.push('missing photo ' + u);
  }
  qa.out.forEach((x) => report.push(`${s.id}: ${x}`));
  await page.locator('.page').screenshot({ path: join(here, 'pages', `${s.id}.png`) });
  await page.pdf({ path: join(here, s.pdf), format: 'Letter', printBackground: true, preferCSSPageSize: true });
  const pages = await page.evaluate(() => document.querySelectorAll('.page').length);
  if (pages !== 1) report.push(`${s.id}: ${pages} pages`);
  await page.close();
}
await browser.close();
const txt = `Print check, ${new Date().toISOString().slice(0, 10)}\n` + (report.length ? report.join('\n') : 'clean: both sheets fit one Letter page, no text off the frame or into the title strip, no overlapping drawing labels, all images load, no prices, no "optional", no long dash, Wi-Fi line present') + '\n';
writeFileSync(join(here, 'print-check.txt'), txt);
console.log(txt);
