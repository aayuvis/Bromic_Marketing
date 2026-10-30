// Region and language for the Bromic tools (data/regions.json, templates/regionalisation.md). Inlined into each tool by
// tools/build-config.mjs, after REGIONS and STRINGS. No DOM work until a function is called.
//   ?region=uk&lang=en on the tool's URL (the Hub passes both), else the Hub's choice saved in this browser, else the US.
// The tools keep their maths in US units; this module converts what the visitor types in and what the page shows.

export function current() {
  let q = null; try { q = new URLSearchParams(location.search); } catch {}
  const saved = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
  const byId = Object.fromEntries(REGIONS.regions.map((r) => [r.id, r]));
  const id = byId[q && q.get('region')] ? q.get('region') : byId[saved('bromic-hub-region')] ? saved('bromic-hub-region') : REGIONS.default;
  const r = byId[id];
  let lang = (q && q.get('lang')) || saved('bromic-hub-lang') || r.langs[0];
  if (!r.langs.includes(lang)) lang = r.langs[0];
  const locale = lang === 'de' ? 'de-DE' : lang === 'nl' ? 'nl-NL' : id === 'us' ? 'en-US' : id === 'ca' ? 'en-CA' : id === 'au' ? 'en-AU' : id === 'nz' ? 'en-NZ' : 'en-GB';
  return { id, r, lang, locale, metric: r.units === 'metric', dual: !!r.dual, currency: r.currency, symbol: r.symbol };
}

const C = () => REGIONS.conversions;
export const nf = (n, d, ctx) => Number(n).toLocaleString(ctx.locale, { maximumFractionDigits: d, minimumFractionDigits: 0 });

// Lengths and areas: the visitor's unit ↔ feet.
export const lenOut = (ft, ctx) => (ctx.metric ? ft * C().ft_to_m : ft);
export const lenIn = (v, ctx) => (ctx.metric ? v / C().ft_to_m : v);
export const uLen = (ctx) => (ctx.metric ? 'm' : 'ft');
export const uArea = (ctx) => (ctx.metric ? 'm²' : 'ft²');
export const areaOut = (ft2, ctx) => (ctx.metric ? ft2 * C().ft2_to_m2 : ft2);
export function fmtLen(ft, ctx) { const v = lenOut(ft, ctx); return `${nf(v, ctx.metric ? 1 : 1, ctx)} ${uLen(ctx)}`; }
export function fmtArea(ft2, ctx) { const v = areaOut(ft2, ctx); return `${nf(v, v < 10 ? 1 : 0, ctx)} ${uArea(ctx)}`; }

// Money in the region's currency (the tools pass amounts already in that currency).
export function money(n, ctx, cents = false) {
  const neg = n < 0, v = Math.abs(n);
  const s = v.toLocaleString(ctx.locale, { minimumFractionDigits: cents ? 2 : 0, maximumFractionDigits: cents ? 2 : 0 });
  return (neg ? '−' : '') + (ctx.lang === 'de' || ctx.lang === 'nl' ? `${s} ${ctx.symbol}` : `${ctx.symbol}${s}`);
}

export const t = (s, ctx) => (ctx.lang !== 'en' && STRINGS[ctx.lang] && STRINGS[ctx.lang][s]) || s;

// Imperial left in English text (config hints, plan labels, notes) → metric, as the Hub does on its pages.
const RULES = (ctx) => {
  const k = C(), r = (x) => nf(Math.abs(x) >= 10 ? Math.round(x) : Math.round(x * 10) / 10, 1, ctx), N = (s) => Number(String(s).replace(/,/g, ''));
  return [
    [/(\d[\d,]*(?:\.\d+)?)\s?[–-]\s?(\d[\d,]*(?:\.\d+)?)\s?(?:ft²|sq\.?\s?ft\.?|square feet)/g, (m, a, b) => `${r(N(a) * k.ft2_to_m2)}–${r(N(b) * k.ft2_to_m2)} m²`],
    [/(\d[\d,]*(?:\.\d+)?)\s?(?:ft²|sq\.?\s?ft\.?|square feet)/g, (m, a) => `${r(N(a) * k.ft2_to_m2)} m²`],
    [/(\d+(?:\.\d+)?) to (\d+(?:\.\d+)?)\s?(?:ft|feet)\b(?!²)/g, (m, a, b) => `${r(N(a) * k.ft_to_m)} to ${r(N(b) * k.ft_to_m)} m`],
    [/(\d+(?:\.\d+)?)\s?(?:ft|feet|foot)\b(?!²)/g, (m, a) => `${r(N(a) * k.ft_to_m)} m`],
    [/(-?\d+)\s?[–-]\s?(-?\d+)\s?°F/g, (m, a, b) => `${Math.round((N(a) - 32) * 5 / 9)}–${Math.round((N(b) - 32) * 5 / 9)}°C`],
    [/(-?\d+(?:\.\d+)?)\s?°F/g, (m, a) => `${Math.round((N(a) - 32) * 5 / 9)}°C`],
    [/(\d[\d,]*(?:\.\d+)?)\s?(?:BTU\/hr|BTU\/h|Btu\/h|BTU)(?!\w)/g, (m, a) => `${r(N(a) * k.btu_h_to_kw)} kW`],
  ];
};
export function convert(text, ctx) {
  if (!ctx.metric) return text;
  const parked = []; let out = text;
  for (const [re, fn] of RULES(ctx)) out = out.replace(re, (...a) => { const v = fn(...a); parked.push(ctx.dual ? `${v} (${a[0]})` : v); return `\u0000${parked.length - 1}\u0000`; });
  return out.replace(/\u0000(\d+)\u0000/g, (m, i) => parked[+i]);
}

// Translate whole text nodes and labels that match the dictionary, then convert units. Inputs and scripts are left alone.
export function localise(root, ctx) {
  if (!root || (ctx.lang === 'en' && !ctx.metric)) return;
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.parentElement && n.parentElement.closest('script,style,textarea,[data-noloc]') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT) });
  const nodes = []; while (w.nextNode()) nodes.push(w.currentNode);
  for (const n of nodes) {
    const raw = n.nodeValue, s = raw.replace(/\s+/g, ' ').trim(); if (!s) continue;
    let v = t(s, ctx); v = convert(v, ctx);
    if (v !== s) n.nodeValue = raw.match(/^\s*/)[0] + v + raw.match(/\s*$/)[0];
  }
  root.querySelectorAll('[placeholder],[aria-label],[title]').forEach((e) => ['placeholder', 'aria-label', 'title'].forEach((a) => { const v = e.getAttribute(a); if (v) { const nv = convert(t(v.trim(), ctx), ctx); if (nv !== v) e.setAttribute(a, nv); } }));
  document.documentElement.lang = ctx.lang;
}
