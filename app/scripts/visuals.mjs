// Turns plain Markdown structures into designed blocks, for the Hub and the PDFs alike (styles: app/src/visuals.css).
// The Markdown stays plain (translations and the editor keep working); only the rendered HTML changes.
//   - a "Step | Decision | You'll need" table  -> a numbered journey with icons
//   - a task list (- [ ] …)                   -> "Your notes" cards with write-in lines and options to circle
//   - a Wavelength table                      -> three wave cards, medium wave highlighted
//   - an Electric | Gas table                 -> two side-by-side cards
//   - a table of Smart-Heat families          -> product cards with a studio picture
//   - a coverage table                        -> bars
//   - a cost-per-hour table                   -> the table, with a bar in the last column
// Every other table gets the refined table style.
const P = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
const ICON = {
  home: P('<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M10 21v-6h4v6"/>'),
  ruler: P('<path d="M3 17 17 3l4 4L7 21z"/><path d="M7 13l2 2M10 10l2 2M13 7l2 2"/>'),
  fuel: P('<path d="M12 3c1 4 5 5.5 5 10a5 5 0 0 1-10 0c0-3 2-4.5 2-7 1.6 1 2.3 2.2 2.4 3.4C12.6 7.5 12.8 5.2 12 3z"/>'),
  look: P('<path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-.9 2-1.9 0-1.2-1-1.6-1-2.6 0-.9.8-1.5 1.8-1.5H17a4 4 0 0 0 4-4c0-4.4-4-8-9-8z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>'),
  size: P('<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/><path d="M9 12h6"/>'),
  power: P('<path d="M9 3v5M15 3v5"/><path d="M6 8h12v3a6 6 0 0 1-12 0z"/><path d="M12 17v4"/>'),
  controls: P('<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>'),
  code: P('<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>'),
  consult: P('<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>'),
  bolt: P('<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>'),
  note: P('<path d="M5 3h10l4 4v14H5z"/><path d="M15 3v4h4M8 12h8M8 16h6"/>'),
};
const STEP_ICONS = ['home', 'ruler', 'fuel', 'look', 'size', 'power', 'controls', 'code', 'consult'];
const wave = (n) => { let d = 'M2 12'; const w = 20 / (n * 2); for (let i = 0; i < n * 2; i++) d += ` q ${w / 2} ${i % 2 ? 7 : -7} ${w} 0`; return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="${d}"/></svg>`; };
const strip = (h) => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&#39;/g, "'").trim();
const cells = (row, tag) => [...row.matchAll(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'g'))].map((m) => m[1].trim());
function parseTable(t) {
  const head = cells((t.match(/<thead>([\s\S]*?)<\/thead>/) || [])[1] || '', 'th');
  const rows = [...((t.match(/<tbody>([\s\S]*?)<\/tbody>/) || [])[1] || '').matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map((m) => cells(m[1], 'td'));
  return { head, rows };
}
// studio pictures for the product cards (library ids)
const FAMILY_IMG = [[/marine/i, 'w-platinum'], [/coastal/i, 't2-select-white'], [/select/i, 't2-select-black'], [/eclipse.*(freestanding|portable)/i, 'w-eclipse-portable'], [/eclipse/i, 'w-eclipse-electric-face'],
  [/tungsten.*freestanding|tungsten.*portable/i, 'w-tung-port'], [/tungsten.*gas/i, 'w-tungsten-gas-500'], [/platinum.*gas/i, 'w-platinum-gas-300'], [/cobalt/i, 'w-cobalt-electric-product'], [/platinum/i, 'w-platinum-black'], [/tungsten/i, 'w-tungelec-stacked']];

export function makeEnhancer(images) {
  const IMG = Object.fromEntries(images.map((i) => [i.id, i]));
  const pic = (name) => { const hit = FAMILY_IMG.find(([re]) => re.test(name)); const im = hit && IMG[hit[1]]; return im ? `<img src="${im.thumb || im.file}" alt="" loading="lazy">` : ''; };

  function steps({ head, rows }) {
    return `<ol class="v-steps">${rows.map((r, i) => `<li><span class="v-ic">${ICON[STEP_ICONS[i % STEP_ICONS.length]]}</span><span class="v-n">${String(strip(r[0]) || i + 1).padStart(2, '0')}</span><b>${r[1]}</b>${r[2] ? `<small><span class="v-k">${strip(head[2] || '')}</span> ${r[2]}</small>` : ''}</li>`).join('')}</ol>`;
  }
  function waves({ head, rows }) {
    return `<div class="v-waves">${rows.map((r) => { const t = strip(r[0]); const n = /short|kurz|kort/i.test(t) ? 5 : /medium|mittel|middel/i.test(t) ? 3 : 1.5; const best = /medium|mittel|middel/i.test(t);
      return `<article class="v-wave${best ? ' best' : ''}"><span class="v-ic">${wave(n)}</span><h4>${r[0]}</h4>${best ? '<span class="v-tag">Bromic</span>' : ''}<dl>${r.slice(1).map((c, k) => `<dt>${head[k + 1] || ''}</dt><dd>${c}</dd>`).join('')}</dl></article>`; }).join('')}</div>`;
  }
  function versus({ head, rows }) {
    return `<div class="v-vs">${head.slice(1).map((h, k) => `<article><span class="v-ic">${/gas/i.test(strip(h)) ? ICON.fuel : ICON.bolt}</span><h4>${h}</h4><dl>${rows.map((r) => `<dt>${r[0]}</dt><dd>${r[k + 1] || ''}</dd>`).join('')}</dl></article>`).join('')}</div>`;
  }
  function families({ head, rows }) {
    return `<div class="v-prods">${rows.map((r) => `<article><span class="v-pic">${pic(strip(r[0]))}</span><div><h4>${r[0]}</h4><dl>${r.slice(1).map((c, k) => `<dt>${head[k + 1] || ''}</dt><dd>${c}</dd>`).join('')}</dl></div></article>`).join('')}</div>`;
  }
  function coverage({ head, rows }) {
    const parsed = rows.map((r) => { const name = strip(r[0].replace(/<sup[\s\S]*?<\/sup>/g, '')); const vals = (strip(r[1].replace(/<sup[\s\S]*?<\/sup>/g, '')).match(/\d[\d,]*/g) || []).map((v) => +v.replace(/,/g, '')); const tail = (r[1].match(/(<sup[\s\S]*)$/) || [])[1] || '';
      const base = name.replace(/\s*\d[\d,./ ]*\s*(W|Btu|kW)?\b.*$/i, '').trim() || name; const vars = (name.match(/\d[\d,]*(?=\s*[\/W]|\s*Btu|\s*$)/g) || []);
      return { name, base, vals, vars, tail, unit: (strip(r[1]).match(/ft²|m²/) || ['ft²'])[0] }; });
    const max = Math.max(1, ...parsed.flatMap((p) => p.vals));
    return `<div class="v-bars"><span class="v-k">${strip(head[1] || '')}</span>${parsed.map((p) => `<div class="v-bar-g"><b>${p.vals.length > 1 ? p.base : p.name}${p.tail}</b>${p.vals.map((v, k) => `<span class="v-bar"><i style="width:${Math.round((v / max) * 100)}%"></i><em>${p.vals.length > 1 && p.vars[k] ? p.vars[k] + (/btu/i.test(p.name) ? ' Btu' : ' W') + ' · ' : ''}${v.toLocaleString('en-US')} ${p.unit}</em></span>`).join('')}</div>`).join('')}</div>`;
  }
  function costBars(t, { rows }) {
    const first = (c) => +((strip(c).match(/\$?(\d+(\.\d+)?)/) || [])[1] || 0);
    const max = Math.max(0.01, ...rows.map((r) => first(r[r.length - 1])));
    let i = 0;
    return t.replace(/<table>/, '<table class="v-cost">').replace(/(<tr>(?:(?!<\/tr>)[\s\S])*?)(<td>)((?:(?!<td>)[\s\S])*?<\/td>\s*<\/tr>)/g, (m, a, td, rest) => {
      if (/<th/.test(a)) return m; const v = first(rows[i++]?.slice(-1)[0] || ''); return `${a}<td class="v-cbar"><i style="width:${Math.round((v / max) * 100)}%"></i>${rest}`;
    });
  }
  function notes(ul) {
    const items = [...ul.matchAll(/<li>\s*<input[^>]*>\s*([\s\S]*?)<\/li>/g)].map((m) => m[1].trim());
    const fmt = (t) => t
      .replace(/_{3,}/g, '<span class="v-line"></span>')
      .replace(/\b(Y|J) \/ N\b/g, '<span class="v-opt">Yes</span><span class="v-opt">No</span>')
      .replace(/(^|:\s*)((?:[A-Za-zÀ-ÿ][\wÀ-ÿ -]{1,24} \/ ){2,}[A-Za-zÀ-ÿ][\wÀ-ÿ -]{1,24})(?=$|[.;,<])/g, (m, pre, list) => `${pre}${list.split(' / ').map((o) => `<span class="v-opt">${o.trim()}</span>`).join('')}`);
    return `<div class="v-notes"><span class="v-notes-h"><span class="v-ic">${ICON.note}</span>Your notes</span>${items.map((t) => `<div class="v-note">${fmt(t)}</div>`).join('')}</div>`;
  }

  return function enhance(html) {
    let out = html.replace(/<div class="table-wrap">(<table>[\s\S]*?<\/table>)<\/div>/g, (m, t) => {
      const T = parseTable(t); const h = T.head.map(strip); const h0 = (h[0] || '').toLowerCase();
      if (/^(step|schritt|stap)$/.test(h0) && T.head.length >= 2) return steps(T);
      if (/^(wavelength|wellenl|golfleng)/.test(h0) || (T.rows.length === 3 && T.rows.every((r) => /wave|welle|golf/i.test(strip(r[0]))))) return waves(T);
      if (h.length === 3 && /electric|elektr/i.test(h[1]) && /gas/i.test(h[2])) return versus(T);
      if (/^(family|familie|serie|collection|kollektion|reeks)/.test(h0) && T.rows.length >= 3 && T.rows.filter((r) => /smart-heat|tungsten|platinum|eclipse|cobalt/i.test(strip(r[0]))).length >= T.rows.length - 1) return families(T);
      if (h.length === 2 && /coverage|abdeckung|dekking|bereik/i.test(h[1])) return coverage(T);
      if (/cost per hour|kosten pro stunde|kosten per uur/i.test(h[h.length - 1])) return `<div class="table-wrap v-tw">${costBars(t, T)}</div>`;
      return m.replace('class="table-wrap"', 'class="table-wrap v-tw"');
    });
    out = out.replace(/<ul>\s*(<li>\s*<input[^>]*type="checkbox"[\s\S]*?)<\/ul>/g, (m, inner) => (/<li>(?!\s*<input)/.test(inner) ? m : notes(m)));
    return out;
  };
}
