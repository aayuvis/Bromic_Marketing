// Blueprint kit: the approved Blueprint theme (reports/themes/blueprint/build.mjs) made reusable for whole documents.
// Tokens, CSS, SVG helpers and the drawings come from the theme sample unchanged; the additions below the
// marked line serve longer documents (running text sheets, spec columns, schedules, sources).
export const ROOT = '../../..';
export const THEME = '../../themes/blueprint';
export const T = {
  navy: '#0E1A2B', navyLine: '#C9D6E8', ink: '#231F20', draw: '#1C2B44', steel: '#6B7480',
  hair: '#B9C3D0', flame: '#EF4123', paper: '#FFFFFF',
};
// ---------- SVG helpers ----------
export const n = (v) => +v.toFixed(1);
// vertical dimension line, arrowheads both ends, extension lines to the left reaching `ext` x
export function dimV(x, y1, y2, label, { ext = null, col = T.draw, side = 'right', mk = 'arD' } = {}) {
  const exts = ext === null ? '' :
    `<line x1="${ext}" y1="${y1}" x2="${x + 6}" y2="${y1}" class="ext"/><line x1="${ext}" y1="${y2}" x2="${x + 6}" y2="${y2}" class="ext"/>`;
  const my = (y1 + y2) / 2, tx = side === 'right' ? x + 9 : x - 5;
  return `${exts}<line x1="${x}" y1="${y1 + 0.5}" x2="${x}" y2="${y2 - 0.5}" stroke="${col}" stroke-width=".8" marker-start="url(#${mk}s)" marker-end="url(#${mk}e)"/>
  <text x="${tx}" y="${my}" class="dimt" transform="rotate(-90 ${tx} ${my})" text-anchor="middle" fill="${col}">${label}</text>`;
}
export function dimH(y, x1, x2, label, { col = T.draw, mk = 'arD', ext = null } = {}) {
  const exts = ext === null ? '' :
    `<line x1="${x1}" y1="${ext}" x2="${x1}" y2="${y - 6}" class="ext"/><line x1="${x2}" y1="${ext}" x2="${x2}" y2="${y - 6}" class="ext"/>`;
  return `${exts}<line x1="${x1 + 0.5}" y1="${y}" x2="${x2 - 0.5}" y2="${y}" stroke="${col}" stroke-width=".8" marker-start="url(#${mk}s)" marker-end="url(#${mk}e)"/>
  <text x="${(x1 + x2) / 2}" y="${y - 5}" class="dimt" text-anchor="middle" fill="${col}">${label}</text>`;
}
// callout leader: dot on the object, elbow, label
export function lead(x1, y1, x2, y2, label, { anchor = 'start', col = T.draw } = {}) {
  const lx = anchor === 'start' ? x2 + 4 : x2 - 4;
  return `<circle cx="${x1}" cy="${y1}" r="1.6" fill="${col}"/><polyline points="${x1},${y1} ${x2},${y2}" fill="none" stroke="${col}" stroke-width=".6"/>
  <text x="${lx}" y="${y2 + 2.6}" class="callt" text-anchor="${anchor}" fill="${col}">${label}</text>`;
}
export const timber = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" class="cut"/><path d="M${x} ${y}L${x + w} ${y + h}M${x + w} ${y}L${x} ${y + h}" class="thin"/>`;
export const slab = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" class="cut" style="fill:url(#hatch)"/>`;


// ---------- Drawings ----------
// Section A–A: mounting heights. Scale 2.2 px per inch, floor at y=282.
const F = 250, S = 2.0, yIn = (inch) => n(F - inch * S);
export const sectionAA = `<svg viewBox="0 0 450 280" class="dwg" role="img" aria-label="Section showing minimum mounting heights of 72 in for wall and 96 in for ceiling heaters">
  <!-- structure -->
  ${slab(40, 20, 372, 16)}
  <path d="M412 16 l6 6 -10 6 10 6 -6 6" class="thin" fill="none"/>
  ${slab(40, F, 372, 16)}
  <path d="M412 ${F - 4} l6 6 -10 6 10 6 -6 6" class="thin" fill="none"/>
  ${slab(40, 36, 16, F - 36)}
  <line x1="56" y1="36" x2="412" y2="36" class="obj"/><line x1="56" y1="${F}" x2="412" y2="${F}" class="obj"/>
  <!-- furniture, lounge table and chairs in elevation -->
  <g class="furn">
    <rect x="246" y="${yIn(29)}" width="96" height="3"/><line x1="254" y1="${yIn(29) + 3}" x2="254" y2="${F}"/><line x1="334" y1="${yIn(29) + 3}" x2="334" y2="${F}"/>
    <path d="M226 ${F} V${yIn(17)} H246 M226 ${yIn(17)} V${yIn(34)}"/><path d="M362 ${F} V${yIn(17)} H342 M362 ${yIn(17)} V${yIn(34)}"/>
  </g>
  <!-- radiant field -->
  <g class="ray"><path d="M286 ${yIn(97)} L272 ${yIn(36)} M312 ${yIn(97)} L312 ${yIn(36)} M338 ${yIn(97)} L352 ${yIn(36)}"/>
  <path d="M88 ${yIn(75)} L128 ${yIn(66)} M86 ${yIn(71)} L120 ${yIn(57)} M90 ${yIn(79)} L134 ${yIn(76)}"/></g>
  <!-- ceiling-mounted heater, bracket to soffit -->
  <line x1="292" y1="36" x2="292" y2="${yIn(101)}" class="obj"/><line x1="332" y1="36" x2="332" y2="${yIn(101)}" class="obj"/>
  <rect x="268" y="${yIn(101)}" width="88" height="${n(4 * S)}" class="heat"/>
  <line x1="274" y1="${yIn(97) - 0.6}" x2="350" y2="${yIn(97) - 0.6}" stroke="${T.flame}" stroke-width="1"/>
  <!-- wall-mounted heater on bracket, tilted toward the occupied zone -->
  <line x1="56" y1="${yIn(79)}" x2="70" y2="${yIn(79)}" class="obj"/>
  <g transform="rotate(18 70 ${yIn(76)})"><rect x="66" y="${yIn(79)}" width="24" height="${n(7 * S)}" class="heat"/><line x1="90" y1="${yIn(78)}" x2="90" y2="${yIn(73)}" stroke="${T.flame}" stroke-width="1"/></g>
  <!-- wall switch and controller -->
  <rect x="56" y="${yIn(52)}" width="6" height="10" class="cut" style="fill:#fff"/>
  <rect x="56" y="${yIn(64)}" width="9" height="14" class="cut" style="fill:#fff"/>
  <!-- dimensions -->
  ${dimV(122, yIn(72), F, '72 IN MIN · AFF', { ext: 82 })}
  ${dimV(398, yIn(97), F, '96 IN MIN · AFF', { ext: 358 })}
  <!-- callouts -->
  ${lead(268, yIn(99), 244, 50, 'CEILING-MOUNTED', { anchor: 'end' })}
  ${lead(62, yIn(59), 152, yIn(56), 'AFFINITY CONTROLLER')}
  ${lead(60, yIn(47), 152, yIn(43), 'MANUAL WALL SWITCH')}
  <text x="156" y="${yIn(43) + 12}" class="callt sub">VISIBLE FROM THE HEATED AREA</text>
  ${lead(88, yIn(80), 160, yIn(90), 'WALL-MOUNTED')}
  <text x="164" y="${yIn(90) + 11}" class="callt sub">AIM AT THE OCCUPIED ZONE</text>
  <text x="296" y="${F + 26}" class="callt sub" text-anchor="middle">FINISHED FLOOR</text>
</svg>`;

// D1: recessed soffit section
export const d1 = `<svg viewBox="-4 0 330 280" class="dwg" role="img" aria-label="Recessed soffit section with recess kit, blocking, cavity depth, ceiling finish and junction box">
  ${slab(14, 26, 272, 14)}
  ${timber(34, 40, 18, 112)}${timber(248, 40, 18, 112)}
  ${timber(92, 84, 16, 16)}${timber(192, 84, 16, 16)}
  <!-- recess kit -->
  <path d="M100 100 H200 V172 M100 100 V172" class="obj" fill="none"/>
  <line x1="92" y1="100" x2="208" y2="100" class="obj"/>
  <!-- heater in kit, face flush with finish -->
  <rect x="108" y="156" width="84" height="22" class="heat"/>
  <path d="M112 175 H188" stroke="${T.flame}" stroke-width="1.2"/>
  <!-- ceiling finish line -->
  <rect x="14" y="172" width="86" height="6" class="cut" style="fill:url(#dots)"/><rect x="200" y="172" width="86" height="6" class="cut" style="fill:url(#dots)"/>
  
  <!-- junction box and conduit -->
  <rect x="220" y="112" width="18" height="14" class="cut" style="fill:#fff"/><path d="M220 119 H196" class="thin" stroke-dasharray="3 2"/>
  <!-- radiant field below -->
  <g class="ray"><path d="M124 180 L104 236 M150 180 V240 M176 180 L196 236"/></g>
  <!-- tag dimensions -->
  ${dimV(72, 100, 178, 'A', { ext: 92, side: 'left' })}
  ${dimV(150, 40, 100, 'B')}
  <!-- callouts -->
  ${lead(52, 60, 14, 12, 'STRUCTURE', { anchor: 'start' })}
  ${lead(208, 92, 290, 70, 'BLOCKING')}
  ${lead(200, 140, 290, 146, 'RECESS KIT')}
  ${lead(238, 119, 290, 112, 'J-BOX')}
  ${lead(250, 175, 236, 206, 'CEILING FINISH LINE')}
  ${lead(108, 177, 40, 262, 'HEATER FACE FLUSH WITH FINISH')}
</svg>`;

// Controls: one controller per zone, wall switch per zone, app over Wi-Fi
export const zone = (x, name, ctrl, tags) => {
  const hs = tags.map((t, i) => `<rect x="${x + 6 + i * 44}" y="146" width="36" height="12" class="heat"/><text x="${x + 24 + i * 44}" y="170" class="callt" text-anchor="middle">${t}</text>
  <line x1="${x + 24 + i * 44}" y1="128" x2="${x + 24 + i * 44}" y2="146" class="obj"/>`).join('');
  return `<g><rect x="${x}" y="90" width="${Math.max(tags.length * 44 + 4, 100)}" height="38" class="box"/>
  <text x="${x + 6}" y="104" class="boxt">${ctrl[0]}</text><text x="${x + 6}" y="117" class="boxs">${ctrl[1]}</text>
  <line x1="${x + 6}" y1="128" x2="${x + 6 + (tags.length - 1) * 44 + 18}" y2="128" class="obj"/>${hs}
  <circle cx="${x + Math.max(tags.length * 44 + 4, 100) - 9}" cy="${80}" r="6" class="box"/><text x="${x + Math.max(tags.length * 44 + 4, 100) - 9}" y="82.5" class="tiny" text-anchor="middle">WS</text>
  <line x1="${x + Math.max(tags.length * 44 + 4, 100) - 9}" y1="86" x2="${x + Math.max(tags.length * 44 + 4, 100) - 9}" y2="90" class="obj"/>
  <text x="${x}" y="194" class="zonet">${name}</text></g>`;
};
export const controls = `<svg viewBox="0 0 450 206" class="dwg" role="img" aria-label="Control zoning diagram: one Affinity controller and one manual wall switch per zone, the app over Wi-Fi">
  <rect x="150" y="6" width="150" height="30" class="box"/>
  <text x="225" y="19" class="boxt" text-anchor="middle">BROMIC SMART-HEAT APP</text><text x="225" y="30" class="boxs" text-anchor="middle">ZONES · SCHEDULES · TIMERS</text>
  <path d="M225 36 V54 M62 54 H372 M62 54 V90 M212 54 V90 M372 54 V90" class="wifi"/>
  <text x="232" y="50" class="tiny">WI-FI</text>
  ${zone(12, 'ZONE 1 · DINING', ['AFFINITY DIMMER', 'VARIABLE OUTPUT'], ['H1', 'H1', 'H1'])}
  ${zone(162, 'ZONE 2 · BAR', ['AFFINITY ON/OFF', 'ON/OFF PER ZONE'], ['H1', 'H1'])}
  ${zone(322, 'ZONE 3 · LOUNGE', ['AFFINITY ECLIPSE', 'HEAT STEPS + RIM LIGHT'], ['H2', 'H2'])}
</svg>`;

// D4: coverage plan (illustrative). Footprint radii from equal-area circles: 121 ft² → r 6.2 ft; drawn at 7 px/ft.
const PX = 7, r121 = n(Math.sqrt(121 / Math.PI) * PX);
const tbl = (cx, cy) => `<rect x="${cx - 18}" y="${cy - 9}" width="36" height="18" class="furnp"/>` +
  [-12, 0, 12].map((d) => `<rect x="${cx + d - 4}" y="${cy - 17}" width="8" height="6" class="furnp"/><rect x="${cx + d - 4}" y="${cy + 11}" width="8" height="6" class="furnp"/>`).join('');
export const plan = `<svg viewBox="0 -2 420 294" class="dwg" role="img" aria-label="Illustrative coverage plan of a dining terrace with heater positions, footprints, zones and controller locations">
  <defs><clipPath id="terr"><rect x="20" y="20" width="380" height="250"/></clipPath></defs>
  ${slab(14, 14, 392, 6)}${slab(14, 20, 6, 256)}
  <path d="M20 270 H400 V20" class="thin" stroke-dasharray="8 3 2 3" fill="none"/>
  <text x="396" y="284" class="tiny" text-anchor="end">OPEN EDGE</text>
  <g clip-path="url(#terr)">
    <path d="M150 20 V270 M290 20 V270" class="zone"/>
    ${[[52, 70], [52, 150], [52, 230], [112, 110], [112, 190]].map(([x, y]) => tbl(x + 14, y)).join('')}
    <rect x="160" y="40" width="22" height="200" class="furnp"/>
    ${[60, 90, 120, 150, 180, 210].map((y) => `<circle cx="196" cy="${y}" r="5" class="furnp"/>`).join('')}
    <rect x="318" y="70" width="60" height="24" rx="4" class="furnp"/><rect x="318" y="190" width="60" height="24" rx="4" class="furnp"/><rect x="330" y="122" width="36" height="36" rx="18" class="furnp"/>
    ${[[66, 70], [66, 150], [66, 230], [126, 110], [126, 190]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r121 * 0.9}" class="foot"/>`).join('')}
    ${[[210, 80], [210, 200]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r121 * 0.95}" class="foot"/>`).join('')}
    ${[[348, 100], [348, 180]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="${r121}" class="foot f2"/>`).join('')}
  </g>
  ${[[66, 70], [66, 150], [66, 230], [126, 110], [126, 190], [210, 80], [210, 200]].map(([x, y]) => `<rect x="${x - 13}" y="${y - 2.5}" width="26" height="5" class="heat"/>`).join('')}
  ${[[348, 100], [348, 180]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" class="heat"/><circle cx="${x}" cy="${y}" r="3" fill="${T.flame}"/>`).join('')}
  <text x="85" y="8" class="zonet" text-anchor="middle">ZONE 1 · DINING</text>
  <text x="220" y="8" class="zonet" text-anchor="middle">ZONE 2 · BAR</text>
  <text x="345" y="8" class="zonet" text-anchor="middle">ZONE 3 · LOUNGE</text>
  ${[[26, 254, 'C1'], [156, 254, 'C2'], [296, 254, 'C3']].map(([x, y, t]) => `<rect x="${x}" y="${y}" width="18" height="10" class="ctl"/><text x="${x + 9}" y="${y + 7.5}" class="tiny" text-anchor="middle">${t}</text><circle cx="${x + 30}" cy="${y + 5}" r="5" class="ctl"/><text x="${x + 30}" y="${y + 7.5}" class="tiny" text-anchor="middle">S</text>`).join('')}
</svg>`;


// MasterFormat tree (from "The Right Home In MasterFormat")
export const node = (x, y, w, h, code, title, hi = false) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" class="${hi ? 'box hi' : 'box'}"/>
  <text x="${x + 7}" y="${y + h / 2 - 1}" class="boxt${hi ? ' hit' : ''}">${code}</text><text x="${x + 7}" y="${y + h / 2 + 7}" class="boxs">${title}</text>`;
export const mf = `<svg viewBox="0 0 680 136" class="dwg" role="img" aria-label="MasterFormat tree: Division 23, 23 83 00 radiant heating units, 23 83 33 electric radiant heaters recommended">
  <path d="M92 66 H116 M116 21 V123 M116 21 H140 M116 93 H140 M116 123 H140 M270 21 H300 M300 10 V58 M300 10 H330 M300 34 H330 M300 58 H330" class="obj" style="stroke-width:.7"/>
  ${node(0, 51, 92, 30, 'DIVISION 23', 'HVAC')}
  ${node(140, 8, 130, 26, '23 83 00', 'RADIANT HEATING UNITS')}
  ${node(140, 80, 130, 26, '23 82 39', 'UNIT HEATERS')}
  ${node(140, 110, 130, 26, '23 55 23', 'GAS-FIRED RADIANT HEATERS')}
  ${node(330, 0, 150, 20, '23 83 13', 'RADIANT HEATING ELECTRIC CABLES AND MATS')}
  ${node(330, 24, 150, 20, '23 83 23', 'RADIANT HEATING ELECTRIC PANELS')}
  ${node(330, 48, 150, 20, '23 83 33', 'ELECTRIC RADIANT HEATERS', true)}
  <path d="M480 58 H498" stroke="${T.flame}" stroke-width=".8" marker-end="url(#arFe)"/>
  <text x="504" y="56" class="boxt hit">RECOMMENDED</text><text x="504" y="64.5" class="boxs">A SELF-CONTAINED ELECTRIC INFRARED EMITTER</text>
  <text x="280" y="91" class="boxs">CONVECTION UNITS THAT MOVE WARM AIR · OUTDOORS IT RISES AND DRIFTS AWAY</text>
  <text x="280" y="99.5" class="boxs">A POOR MATCH FOR OUTDOOR SPACES</text>
  <text x="280" y="121" class="boxs">THE HOME FOR GAS RADIANT EQUIPMENT · WRITE BROMIC GAS HEATERS HERE AS A SEPARATE SECTION</text>
</svg>`;


export const defs = `<svg width="0" height="0" style="position:absolute"><defs>
  <marker id="arDs" viewBox="0 0 10 10" refX="0" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M10 1.5 L0 5 L10 8.5" fill="${T.draw}"/></marker>
  <marker id="arDe" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 1.5 L10 5 L0 8.5" fill="${T.draw}"/></marker>
  <marker id="arFe" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 1.5 L10 5 L0 8.5" fill="${T.flame}"/></marker>
  <marker id="arWs" viewBox="0 0 10 10" refX="0" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M10 1.5 L0 5 L10 8.5" fill="${T.navyLine}"/></marker>
  <marker id="arWe" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 1.5 L10 5 L0 8.5" fill="${T.navyLine}"/></marker>
  <pattern id="hatch" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="5" stroke="${T.draw}" stroke-width=".5"/></pattern>
  <pattern id="dots" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".45" fill="${T.draw}"/><circle cx="3" cy="3" r=".45" fill="${T.draw}"/></pattern>
</defs></svg>`;

export const baseCss = `
@font-face{font-family:BzDidot;src:url(${ROOT}/app/src/fonts/gfs-didot-latin.woff2) format('woff2')}
@font-face{font-family:BzSans;src:url(${ROOT}/app/src/fonts/arimo-latin.woff2) format('woff2')}
@font-face{font-family:BzMono;src:url(${THEME}/fonts/plex-mono-400.woff2) format('woff2');font-weight:400}
@font-face{font-family:BzMono;src:url(${THEME}/fonts/plex-mono-500.woff2) format('woff2');font-weight:500}
@page{size:Letter;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:#888}
body{font-family:BzSans,Arial,sans-serif;color:${T.ink};-webkit-print-color-adjust:exact;print-color-adjust:exact}
.page{width:8.5in;height:11in;position:relative;overflow:hidden;margin:0 auto;page-break-after:always;break-after:page}
.page:last-child{page-break-after:auto;break-after:auto}
.dark{background:${T.navy};color:#fff}
.light{background:${T.paper}}
/* fine grid: 1/8 in minor, 1 in major */
.grid{position:absolute;inset:.42in;pointer-events:none}
.dark .grid{background-image:linear-gradient(rgba(201,214,232,.10) .6px,transparent .6px),linear-gradient(90deg,rgba(201,214,232,.10) .6px,transparent .6px),linear-gradient(rgba(201,214,232,.04) .5px,transparent .5px),linear-gradient(90deg,rgba(201,214,232,.04) .5px,transparent .5px);background-size:1in 1in,1in 1in,.125in .125in,.125in .125in}
.light .grid{background-image:linear-gradient(rgba(28,43,68,.07) .6px,transparent .6px),linear-gradient(90deg,rgba(28,43,68,.07) .6px,transparent .6px),linear-gradient(rgba(28,43,68,.028) .5px,transparent .5px),linear-gradient(90deg,rgba(28,43,68,.028) .5px,transparent .5px);background-size:1in 1in,1in 1in,.125in .125in,.125in .125in}
.frame{position:absolute;inset:.42in;border:.9px solid;pointer-events:none}
.dark .frame{border-color:rgba(201,214,232,.7)}.light .frame{border-color:${T.draw}}
.zones{position:absolute;inset:.3in;border:.5px solid currentColor;font:500 6px/1 BzMono,monospace;letter-spacing:.1em;pointer-events:none}
.zones .zt,.zones .zb{position:absolute;left:.12in;right:.12in;height:.12in}.zones .zt{top:0}.zones .zb{bottom:0}
.zones .zl,.zones .zr{position:absolute;top:.12in;bottom:.12in;width:.12in}.zones .zl{left:0}.zones .zr{right:0}
.zones span{position:absolute;transform:translate(-50%,-50%)}
.zones .zt span,.zones .zb span{top:50%}.zones .zl span,.zones .zr span{left:50%}
.lbl,.eyebrow{font:500 7px/1.2 BzMono,monospace;letter-spacing:.16em;text-transform:uppercase}
.eyebrow{color:${T.flame}}
h1,h2,h3{font-family:BzDidot,Didot,serif;font-weight:400;letter-spacing:-.005em}

/* ---- cover ---- */
.c-top{position:absolute;left:.72in;right:.72in;top:.7in;display:flex;justify-content:space-between;align-items:flex-start}
.logo{width:1.3in;display:block}
.c-meta{display:flex;flex-direction:column;align-items:flex-end;gap:5px;font:400 7px/1 BzMono,monospace;letter-spacing:.16em;color:${T.navyLine}}
.c-head{position:absolute;left:.72in;top:1.95in;width:5.4in}
.c-head h1{font-size:60px;line-height:1.02;margin:14px 0 14px;color:#fff}
.c-sub{font:400 13px/1.4 BzSans,sans-serif;color:${T.navyLine};margin-bottom:16px}
.c-lede{font:400 10.5px/1.6 BzSans,sans-serif;color:rgba(255,255,255,.82);max-width:4.6in;padding-left:12px;border-left:.8px solid ${T.flame}}
.c-elev{position:absolute;left:.72in;right:.72in;top:5.0in}
.c-elev img{display:block;width:6.66in;margin:0 auto;opacity:.95}
.c-dim{display:block;width:6.66in;margin:0 auto 2px;overflow:visible}
.c-cl{display:block;width:6.66in;height:.19in;margin:0 auto}
.c-dim .ext{stroke:${T.navyLine};stroke-width:.5;opacity:.7}
.c-dim .dimt{font:500 7px BzMono,monospace;letter-spacing:.14em}
figcaption{display:flex;gap:8px;align-items:center}
figcaption b{display:block;font:500 7.2px/1.3 BzMono,monospace;letter-spacing:.12em}
figcaption em{display:block;font:400 6.4px/1.4 BzMono,monospace;letter-spacing:.1em;font-style:normal;opacity:.75;margin-top:1px}
.bubble{flex:none;width:22px;height:22px;border-radius:50%;border:.8px solid currentColor;display:grid;place-items:center;font:500 7.5px/1 BzMono,monospace;position:relative}
.c-elev figcaption{margin:14px 0 0 .03in;color:#fff}
.c-elev figcaption em{color:${T.navyLine}}
.c-low{position:absolute;left:.72in;right:.72in;top:7.4in;display:grid;grid-template-columns:1fr 2.5in;gap:.35in}
.index .lbl{color:${T.navyLine};margin-bottom:8px}
.index table{width:100%;border-collapse:collapse;font-size:8.5px}
.index td{padding:5px 6px 5px 0;border-top:.5px solid rgba(201,214,232,.28);color:rgba(255,255,255,.88);vertical-align:baseline}
.index tr:last-child td{border-bottom:.5px solid rgba(201,214,232,.28)}
.index td:first-child{font:500 7px BzMono,monospace;color:${T.flame};width:22px}
.index td:nth-child(3){font:400 6.8px BzMono,monospace;letter-spacing:.06em;color:${T.navyLine};white-space:nowrap}
.index td:last-child{font:500 6.8px BzMono,monospace;letter-spacing:.08em;text-transform:uppercase;text-align:right;white-space:nowrap}
.tc{color:#9AA6B6;font-style:normal}.dark .tc{color:#8E9BB0}
.live{color:#fff}
.plate{border:.6px solid;padding:5px}
.dark .plate{border-color:rgba(201,214,232,.6)}
.plate-img{height:1.32in;background-size:cover;background-position:center}
.plate figcaption{display:block;font:400 6.6px/1.4 BzMono,monospace;letter-spacing:.06em;margin-top:5px;color:${T.navyLine}}
.plate figcaption b{display:inline;font-size:6.6px;color:${T.flame};margin-right:4px;letter-spacing:.14em}
.tblock{position:absolute;right:.42in;bottom:.42in;width:3.3in;border-left:.9px solid rgba(201,214,232,.7);border-top:.9px solid rgba(201,214,232,.7);font:400 7.5px/1.2 BzMono,monospace;color:#fff}
.tblock .r{padding:5px 8px;border-bottom:.5px solid rgba(201,214,232,.35)}
.tblock .r:last-child{border-bottom:0}
.tblock .two{display:flex;padding:0}.tblock .two>div{flex:1;padding:5px 8px;border-right:.5px solid rgba(201,214,232,.35)}.tblock .two>div:last-child{border-right:0}
.tblock b{display:block;font-weight:500;font-size:5.6px;letter-spacing:.16em;color:${T.navyLine};margin-bottom:3px}
.tblock .sh span{font-size:14px;line-height:1}.tblock i{font-style:normal;opacity:.55;font-size:8px}

/* ---- inner sheets ---- */
.s-head{position:absolute;left:.72in;right:.72in;top:.7in}
.s-head h2{font-size:30px;line-height:1.1;margin:8px 0 6px;color:${T.ink}}
.s-lede{font-size:9.5px;line-height:1.55;color:#4A4546;max-width:5.6in}
.sched{position:absolute;left:.72in;right:.72in;top:1.82in}
.sched .hdr{display:flex;justify-content:space-between;border-bottom:.9px solid ${T.draw};padding-bottom:5px;color:${T.draw}}
.sched .r{color:${T.flame}}
.sched table{width:100%;border-collapse:collapse;font-size:7.6px;line-height:1.35;color:${T.ink}}
.sched th{font:500 5.9px/1.2 BzMono,monospace;letter-spacing:.13em;text-align:left;color:${T.steel};padding:6px 6px 5px 0;border-bottom:.5px solid ${T.hair}}
.sched td{padding:5px 7px 5px 0;border-bottom:.5px solid ${T.hair};vertical-align:top}
.sched table.eq{table-layout:fixed}.sched td.m{font:400 7px/1.4 BzMono,monospace}
.sched td.ser{font-weight:700;color:${T.ink}}
.sched td.tag span{display:inline-grid;place-items:center;width:22px;height:13px;border:.7px solid ${T.draw};font:500 6.4px BzMono,monospace;color:${T.draw}}
.sched tr.soon td{color:#5d5a5b}
.soon-t{font:500 6px BzMono,monospace;letter-spacing:.1em;text-transform:uppercase;color:${T.flame};white-space:nowrap}
.sched .tc{color:${T.steel};font-style:italic}
.fn{font:400 6.4px/1.45 BzMono,monospace;color:${T.steel};margin-top:6px;letter-spacing:.02em}
.dwgs{position:absolute;left:.72in;right:.72in;top:4.4in;display:grid;grid-template-columns:4.05in 1fr;gap:.25in}
.lower{position:absolute;left:.72in;right:.72in;top:7.42in;display:grid;grid-template-columns:4.05in 1fr;gap:.25in}
.panel{color:${T.draw};position:relative}
.panel figcaption{margin-top:4px;padding-top:6px;border-top:.6px solid ${T.draw}}
.dwg{display:block;width:100%;height:auto;overflow:visible}
.dwg .cut{stroke:${T.draw};stroke-width:.9;fill:none}
.dwg rect.cut[fill]{}
.dwg .obj{stroke:${T.draw};stroke-width:1;fill:none}
.dwg .thin{stroke:${T.draw};stroke-width:.5;fill:none}
.dwg .ext{stroke:${T.draw};stroke-width:.4}
.dwg .heat{fill:#fff;stroke:${T.draw};stroke-width:1}
.dwg .furn path,.dwg .furn line,.dwg .furn rect{stroke:${T.steel};stroke-width:.7;fill:none}
.dwg .ray path{stroke:${T.flame};stroke-width:.6;stroke-dasharray:3 3;fill:none;opacity:.8}
.dwg .dimt{font:500 6.6px BzMono,monospace;letter-spacing:.1em}
.dwg .callt{font:500 6.2px BzMono,monospace;letter-spacing:.1em;fill:${T.draw}}
.dwg .callt.sub{font-weight:400;fill:${T.steel};font-size:5.6px}
.dwg .box{fill:#fff;stroke:${T.draw};stroke-width:.8}
.dwg .boxt{font:500 6.3px BzMono,monospace;letter-spacing:.08em;fill:${T.draw}}
.dwg .boxs{font:400 5.3px BzMono,monospace;letter-spacing:.06em;fill:${T.steel}}
.dwg .tiny{font:500 5px BzMono,monospace;letter-spacing:.06em;fill:${T.draw}}
.dwg .zonet{font:500 6px BzMono,monospace;letter-spacing:.14em;fill:${T.flame}}
.dwg .wifi{stroke:${T.draw};stroke-width:.6;stroke-dasharray:2 2;fill:none}
.dwg .furnp{fill:#fff;stroke:${T.steel};stroke-width:.6}
.dwg .foot{fill:rgba(239,65,35,.035);stroke:${T.flame};stroke-width:.6;stroke-dasharray:3 2}
.dwg .zone{stroke:${T.draw};stroke-width:.6;stroke-dasharray:10 3 2 3;fill:none}
.dwg .ctl{fill:#fff;stroke:${T.draw};stroke-width:.7}
.mf{position:absolute;left:.72in;right:.72in;top:5.55in}
.mf .hdr{display:flex;justify-content:space-between;border-bottom:.9px solid ${T.draw};padding-bottom:5px;margin-bottom:10px;color:${T.draw}}
.mf .hdr .r{color:${T.flame}}
.dwg .box.hi{stroke:${T.flame};stroke-width:1}.dwg .hit{fill:${T.flame}}
.notes .lbl{color:${T.draw};border-bottom:.9px solid ${T.draw};padding-bottom:5px;margin-bottom:6px}
.notes ol{list-style:none;counter-reset:n}
.notes li{counter-increment:n;position:relative;padding:0 0 5px 18px;font-size:7.4px;line-height:1.45;color:#3a3637}
.notes li::before{content:counter(n,decimal-leading-zero);position:absolute;left:0;top:.5px;font:500 6.2px BzMono,monospace;color:${T.flame}}
.strip{position:absolute;left:.42in;right:.42in;bottom:.42in;height:.48in;display:flex;border-top:.9px solid ${T.draw};font:400 7px/1.25 BzMono,monospace;color:${T.ink};background:#fff}
.strip .cell{padding:5px 7px;border-right:.5px solid ${T.hair};display:flex;flex-direction:column;justify-content:space-between;white-space:nowrap}
.strip .cell:last-child{border-right:0}
.strip .cell.grow{flex:1;white-space:normal}
.strip .cell.grow span{font-size:6px;line-height:1.35;color:${T.steel}}
.strip b{font-weight:500;font-size:5.4px;letter-spacing:.16em;color:${T.steel}}
.strip .sheet span{font-size:15px;line-height:1;color:${T.draw}}.strip .sheet i{font-style:normal;font-size:8px;color:${T.steel}}

/* ---- sheet 3 ---- */
.p3{position:absolute;left:.72in;right:.72in;top:1.45in;display:grid;grid-template-columns:4.15in 1fr;gap:.3in}
.legend{display:flex;flex-wrap:wrap;gap:4px 12px;margin-top:6px;font:500 5.8px BzMono,monospace;letter-spacing:.1em;color:${T.draw}}
.legend span{display:flex;align-items:center;gap:5px}
.legend i{display:inline-grid;place-items:center;font:500 4.6px BzMono,monospace;font-style:normal}
.lg-h{width:14px;height:4px;border:.8px solid ${T.draw}}
.lg-e{width:9px;height:9px;border-radius:50%;border:.8px solid ${T.draw};box-shadow:inset 0 0 0 2px #fff,inset 0 0 0 4px ${T.flame}}
.lg-c{width:12px;height:8px;border:.7px solid ${T.draw}}
.lg-s{width:9px;height:9px;border-radius:50%;border:.7px solid ${T.draw}}
.checks{list-style:none;border-top:.9px solid ${T.draw}}
.checks li{display:grid;grid-template-columns:12px 18px 1fr;gap:6px;align-items:start;padding:6.4px 0;border-bottom:.5px solid ${T.hair};font-size:8.2px;line-height:1.42;color:#3a3637}
.checks .bx{width:9px;height:9px;border:.8px solid ${T.draw};margin-top:1.5px}
.checks .no{font:500 6.4px/1.9 BzMono,monospace;color:${T.flame}}
.cta{position:absolute;left:.42in;right:.42in;top:7.3in;height:2.2in;background:${T.navy};color:#fff;display:grid;grid-template-columns:2.15in 1fr;gap:.35in;padding:.3in .3in .3in .3in;overflow:hidden}
.cta-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(201,214,232,.08) .6px,transparent .6px),linear-gradient(90deg,rgba(201,214,232,.08) .6px,transparent .6px);background-size:1in 1in;background-position:-.42in -.62in}
.cta>*{position:relative}.cta>.cta-grid{position:absolute}
.cta .plate{border-color:rgba(201,214,232,.6)}
.cta .plate-img{height:1.28in}
.cta-body{display:flex;flex-direction:column;justify-content:center}
.cta h3{font-size:23px;line-height:1.2;margin:8px 0 14px;max-width:4.3in}
.btn{align-self:flex-start;display:inline-flex;gap:14px;align-items:center;background:${T.flame};color:#fff;font:500 8px/1 BzMono,monospace;letter-spacing:.18em;padding:10px 16px;text-decoration:none}
.addr{font:400 6.2px/1.6 BzMono,monospace;letter-spacing:.1em;color:${T.navyLine};margin-top:12px;max-width:3.9in}
.disc{position:absolute;left:.72in;right:.72in;top:9.62in;font-size:6.6px;line-height:1.5;color:${T.steel}}
`;
