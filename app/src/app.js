/* Bromic Content Hub — vanilla JS, hash routing, state → HTML string. Data: window.HUB (built by scripts/build.mjs). */
(() => {
  'use strict';
  const H = window.HUB;
  const $ = (s, el = document) => el.querySelector(s);
  const view = $('#view');
  const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const AUD = H.matrix.audiences, STG = H.matrix.stages;
  const AK = Object.keys(AUD), SK = Object.keys(STG);
  const TYPES = H.types;
  const IMG = Object.fromEntries(H.images.map((i) => [i.id, i]));
  const ITEM = Object.fromEntries(H.items.map((i) => [i.id, i]));
  const ASSET = Object.fromEntries(H.assets.map((a) => [a.id, a]));
  const CELL = Object.fromEntries(H.matrix.cells.map((c) => [c.id, c]));
  const STATUSES = ['draft', 'in-review', 'approved', 'published'];
  const GATED_TYPES = ['gated-guide', 'spec-kit', 'sales-kit'];

  const ic = {
    chat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v10H9l-5 4z"/></svg>',
    lock: '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9"/><path d="M8 11V8a4 4 0 018 0v3"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    copy: '<svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12"/><path d="M16 8V4H4v12h4"/></svg>',
    down: '<svg viewBox="0 0 24 24"><path d="M12 4v12M6 10l6 6 6-6M4 20h16"/></svg>',
    print: '<svg viewBox="0 0 24 24"><path d="M7 9V3h10v6M7 17H4v-8h16v8h-3M7 14h10v7H7z"/></svg>',
    ext: '<svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/></svg>',
    pen: '<svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4"/></svg>',
  };

  const img = (id, cls = '', thumb = true) => {
    const im = IMG[id];
    if (!im) return `<div class="${cls}" aria-hidden="true"></div>`;
    return `<img src="${thumb ? im.thumb : im.file}" alt="${esc(im.alt)}" loading="lazy" class="${cls}">`;
  };
  const audChips = (it) => it.audience.map((a) => `<span class="chip">${esc(a)}</span>`).join('');
  const stgChips = (it) => it.stage.map((s) => `<span class="chip">${esc(STG[s]?.name || s)}</span>`).join('');
  const isGated = (it) => it.gated || GATED_TYPES.includes(it.type);
  const itemsFor = (pred) => H.items.filter(pred);
  const unverified = (it) => it.sources.filter((s) => !s.verified).length;

  // ---------- regions and languages (data/regions.json, templates/regionalisation.md) ----------
  const RG = H.regions || { regions: [], default: 'us', languages: { en: 'English' } };
  const REGION = Object.fromEntries(RG.regions.map((r) => [r.id, r]));
  const store = { get: (k) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
  const qp = new URLSearchParams(location.search);
  let region = REGION[qp.get('region')] ? qp.get('region') : REGION[store.get('bromic-hub-region')] ? store.get('bromic-hub-region') : RG.default;
  let lang = qp.get('lang') || store.get('bromic-hub-lang') || 'en';
  if (!REGION[region].langs.includes(lang)) lang = REGION[region].langs[0];
  const R = () => REGION[region];
  // Keep each item's English, then lay a translation over it in place so every view shows the chosen language.
  const EN_KEYS = ['title', 'summary', 'dek', 'meta_description', 'cta', 'html', 'blocks', 'markdown', 'file', 'verifies', 'faq', 'words'];
  for (const it of H.items) { it._en = Object.fromEntries(EN_KEYS.map((k) => [k, it[k]])); it.lang = 'en'; }
  function applyLang() {
    const T = (window.HUB_TR || {})[lang] || {};
    for (const it of H.items) {
      Object.assign(it, it._en); it.lang = 'en'; it.tr = null;
      const t = lang !== 'en' && T[it.id];
      if (t) { for (const k of EN_KEYS) if (t[k] != null && t[k] !== '') it[k] = t[k]; it.lang = lang; it.tr = { status: t.status, reviewer: t.native_reviewer }; }
    }
    document.documentElement.lang = lang;
  }
  function loadLang(l) {
    if (l === 'en' || (window.HUB_TR || {})[l]) return Promise.resolve();
    return new Promise((res) => { const sc = document.createElement('script'); sc.src = `data-${l}.js?v=${encodeURIComponent((H.commit || 'dev') + '-' + Date.parse(H.built).toString(36))}`; sc.onload = res; sc.onerror = res; document.head.appendChild(sc); });
  }
  function setRegion(r, l) {
    region = r; lang = l && REGION[r].langs.includes(l) ? l : REGION[r].langs[0];   // a region opens in its own language
    store.set('bromic-hub-region', region); store.set('bromic-hub-lang', lang);
    return loadLang(lang).then(() => { applyLang(); regionBar(); chromeText(); route.keepScroll = true; route(); });
  }
  function regionBar() {
    const el = $('#regions'); if (!el) return;
    el.innerHTML = RG.regions.map((r) => `<button type="button" class="rg${r.id === region ? ' on' : ''}" data-region="${r.id}" aria-pressed="${r.id === region}" title="${esc(r.name)}">${esc(r.label)}</button>`).join('')
      + (R().langs.length > 1 ? `<span class="rg-langs" role="group" aria-label="Language">${R().langs.map((l) => `<button type="button" class="rl${l === lang ? ' on' : ''}" data-lang="${l}" aria-pressed="${l === lang}" title="${esc(RG.languages[l] || l)}">${l.toUpperCase()}</button>`).join('')}</span>` : '');
  }
  // English pages outside the US: units converted on the page (US imperial master). Canada shows both.
  const CV = RG.conversions || {};
  const nf = (x, d) => Number(x).toLocaleString(lang === 'de' ? 'de-DE' : lang === 'nl' ? 'nl-NL' : 'en-GB', { maximumFractionDigits: d, minimumFractionDigits: 0 });
  const rnd = (x) => (Math.abs(x) >= 10 ? nf(Math.round(x), 0) : nf(Math.round(x * 10) / 10, 1));
  const N = (t) => Number(String(t).replace(/,/g, ''));
  const UNIT_RULES = [
    [/(\d[\d,]*(?:\.\d+)?)\s?[–-]\s?(\d[\d,]*(?:\.\d+)?)\s?(?:ft²|sq\.?\s?ft\.?|square feet)/g, (m, a, b) => `${rnd(N(a) * CV.ft2_to_m2)}–${rnd(N(b) * CV.ft2_to_m2)} m²`],
    [/(\d[\d,]*(?:\.\d+)?)\s?(?:ft²|sq\.?\s?ft\.?|square feet|square foot)/g, (m, a) => `${rnd(N(a) * CV.ft2_to_m2)} m²`],
    [/(\d+(?:\.\d+)?)\s?(?:'|ft|feet)?\s?[×x]\s?(\d+(?:\.\d+)?)\s?(?:ft|feet|')(?![²\w])/g, (m, a, b) => `${rnd(N(a) * CV.ft_to_m)} × ${rnd(N(b) * CV.ft_to_m)} m`],
    [/(\d+(?:\.\d+)?)\s?(?:ft|feet|foot)\b(?!²)/g, (m, a) => `${rnd(N(a) * CV.ft_to_m)} m`],
    [/(\d+(?:\.\d+)?)\s?(?:in\.|inches|inch)(?!\w)/g, (m, a) => `${nf(Math.round(N(a) * CV.in_to_mm), 0)} mm`],
    [/(-?\d+)\s?[–-]\s?(-?\d+)\s?°F/g, (m, a, b) => `${nf(Math.round((N(a) - 32) * 5 / 9), 0)}–${nf(Math.round((N(b) - 32) * 5 / 9), 0)}°C`],
    [/(-?\d+(?:\.\d+)?)\s?°F/g, (m, a) => `${nf(Math.round((N(a) - 32) * 5 / 9), 0)}°C`],
    [/(\d[\d,]*(?:\.\d+)?)\s?(?:BTU\/hr|BTU\/h|Btu\/h|Btu\/hr|BTUs?|Btu)(?!\w)/g, (m, a) => `${rnd(N(a) * CV.btu_h_to_kw)} kW`],
    [/(\d[\d,]*(?:\.\d+)?)\s?(?:US gal|gallons?|gal)(?!\w)/g, (m, a) => `${rnd(N(a) * CV.gal_us_to_l)} L`],
    [/(\d[\d,]*(?:\.\d+)?)\s?(?:lb|lbs|pounds?)(?!\w)/g, (m, a) => `${rnd(N(a) * CV.lb_to_kg)} kg`],
  ];
  function convertText(t) {
    // Each match is parked behind a token so a later rule never converts it again (ranges, Canada's brackets).
    const parked = []; let out = t;
    for (const [re, fn] of UNIT_RULES) out = out.replace(re, (...a) => { const v = fn(...a); parked.push(R().dual ? `${v} (${a[0]})` : v); return `\u0000${parked.length - 1}\u0000`; });
    return out.replace(/\u0000(\d+)\u0000/g, (m, i) => parked[+i]);
  }
  function regionalise(root) {
    if (!root || R().units !== 'metric') return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: (n) => n.parentElement.closest('script,style,textarea,input,code,.ed-ta,[data-noconv]') ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
    const nodes = []; while (w.nextNode()) nodes.push(w.currentNode);
    for (const n of nodes) { const v = convertText(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; }
  }
  function regionPanel(it) {
    const r = R(), site = (r.sites && r.sites[lang]) || r.site;
    if (region === 'us' && lang === 'en') return '';
    const tr = it.lang !== 'en';
    return `<div class="panel region-panel"><h4>${esc(STR('For'))} ${esc(STR(r.name))}</h4>
      ${tr ? `<p class="rp-note">${esc(STR('Machine translation, native review pending.'))}</p>` : lang !== 'en' ? `<p class="rp-note">${esc(STR('Not translated yet: shown in English.'))}</p>` : ''}
      <dl class="kv">
        <dt>${esc(STR('Units'))}</dt><dd>${r.units === 'metric' ? (tr ? esc(STR('Metric')) : esc(STR('Metric, converted from the US original'))) + (r.dual ? ' ' + esc(STR('(imperial in brackets)')) : '') : 'Imperial'}</dd>
        <dt>${esc(STR('Mains'))}</dt><dd>${esc(r.voltage)}</dd>
        <dt>${esc(STR('Electrical'))}</dt><dd>${esc(r.electrical_code)}</dd>
        <dt>${esc(STR('Gas'))}</dt><dd>${esc(r.gas_code)}</dd>
        <dt>${esc(STR('Installer'))}</dt><dd>${esc(r.installer)}; ${esc(r.authority)}</dd>
        <dt>${esc(STR('Bromic'))}</dt><dd><a href="${esc(site)}" target="_blank" rel="noopener">${esc(site.replace(/^https:\/\/(www\.)?/, '').replace(/\/$/, ''))}</a></dd>
      </dl>
      ${!tr ? `<p class="rp-note">${esc(STR('Prices, statistics and code references in the text are US figures unless stated. Use local prices and codes.'))}</p>` : ''}
      ${r.verify ? `<p class="rp-note vcount">${esc(r.verify.replace(/^\[\[VERIFY:\s*|\]\]$/g, ''))}</p>` : ''}</div>`;
  }


  // Interface words. English is the key; German and Dutch are drafts for native review like the content.
  const UI = {
    de: {
      'Overview': 'Übersicht', 'Library': 'Bibliothek', 'Blog': 'Blog', 'Downloads': 'Downloads', 'Journey': 'Customer Journey', 'Backlog': 'Backlog', 'Tools': 'Tools',
      'Case studies': 'Referenzen', 'Images': 'Bilder', 'Sources': 'Quellen', 'bromic.com': 'bromic.com', 'Review': 'Review',
      'Search content, keywords, sources': 'Inhalte, Stichwörter, Quellen suchen',
      'Bromic Content Hub': 'Bromic Content Hub', 'Designed from the start, not added later.': 'Von Anfang an geplant, nicht nachträglich ergänzt.',
      'HERO': 'Alle Bromic-Inhalte, die Terrassenheizung früher ins Projekt bringen: in die Planung des Architekten, die Vorverkabelung des Bauunternehmers und das erste Budget des Bauherrn. Finden Sie sie nach Zielgruppe, nach Phase der Entscheidung oder nach Bedarf.',
      'Who it is for': 'Für wen', 'Where they are': 'Wo sie stehen', 'What you need': 'Was Sie brauchen',
      '01 · Who it is for': '01 · Für wen', 'Four audiences, four different questions': 'Vier Zielgruppen, vier verschiedene Fragen',
      'Each audience gets content written for its job, not one brochure for everyone.': 'Jede Zielgruppe bekommt Inhalte für ihre Aufgabe, keine Einheitsbroschüre.',
      '02 · Where they are': '02 · Wo sie stehen', 'From first idea to a working system': 'Von der ersten Idee bis zur laufenden Anlage',
      'Every piece has one job at one stage, and one next step that moves the reader on.': 'Jeder Inhalt hat eine Aufgabe in einer Phase und einen nächsten Schritt.',
      '03 · What you need': '03 · Was Sie brauchen', 'Read, download, use, prove': 'Lesen, herunterladen, nutzen, belegen',
      'Start here': 'Hier beginnen', 'The flagship pieces': 'Die wichtigsten Inhalte', 'For the content team': 'Für das Content-Team',
      'See the full map: every audience at every stage, with the question each piece answers': 'Die ganze Übersicht: jede Zielgruppe in jeder Phase, mit der Frage, die jeder Inhalt beantwortet',
      'Read and answer': 'Lesen und Antworten', 'Download': 'Herunterladen', 'Try a tool': 'Tool nutzen', 'Prove it': 'Belegen',
      'NEED_READ': 'Artikel, Antworten und Blogbeiträge, die gefunden und von KI-Suchen zitiert werden.',
      'NEED_DL': 'Reports, Planungshandbücher und Spec Kits, jeweils als fertiges PDF hinter einem Formular.',
      'NEED_TOOL': 'Rechner, die aus einem Besuch einen Kontakt machen: Dimensionierung, Fünfjahreskosten, Umsatz.',
      'NEED_PROVE': 'Referenzprojekte nach Projekttyp und die Bromic-Bildbibliothek.',
      'pieces': 'Inhalte', 'All': 'Alle', 'for': 'für',
      'For': 'Für', 'Machine translation, native review pending.': 'Maschinelle Übersetzung, muttersprachliche Prüfung ausstehend.',
      'Not translated yet: shown in English.': 'Noch nicht übersetzt: auf Englisch angezeigt.',
      'Units': 'Einheiten', 'Metric': 'Metrisch', 'Metric, converted from the US original': 'Metrisch, aus dem US-Original umgerechnet', '(imperial in brackets)': '(imperial in Klammern)',
      'Mains': 'Netz', 'Electrical': 'Elektro', 'Gas': 'Gas', 'Installer': 'Installation', 'Bromic': 'Bromic',
      'Prices, statistics and code references in the text are US figures unless stated. Use local prices and codes.': 'Preise, Statistiken und Normen im Text sind US-Angaben, sofern nicht anders vermerkt. Verwenden Sie lokale Preise und Normen.',
      'Edit this page': 'Seite bearbeiten', 'Download the PDF': 'PDF herunterladen', 'Open the tool': 'Tool öffnen', 'Details': 'Details', 'Related': 'Verwandte Inhalte', 'Give feedback': 'Feedback geben',
      'Homeowners': 'Bauherren und Hausbesitzer', 'Architects and designers': 'Architekten und Planer', 'Builders and installers': 'Bauunternehmer und Installateure', 'Restaurant and hotel operators': 'Gastronomie und Hotellerie',
      'JOB_RES': 'Wollen einen warmen, schönen Außenraum und eine klare Antwort: wie viele Heizstrahler, was sie kosten, wie sie aussehen.',
      'JOB_ARC': 'Brauchen Datenblätter, Abstände, Heizflächen und Details, die direkt in die Planung passen.',
      'JOB_BLD': 'Brauchen die richtige Vorverkabelung im Rohbau, Preisstufen zum Upselling und Montagen, die die Abnahme beim ersten Mal bestehen.',
      'JOB_COM': 'Brauchen volle Terrassen in der Übergangszeit und eine Amortisationsrechnung, die der Eigentümer unterschreibt.',
      'STG_AW': 'Terrassenheizung auf den Plan bringen, bevor der Entwurf steht.', 'STG_CO': 'Elektrisch oder Gas, wie viele, was es kostet, beantworten und den Kontakt gewinnen.',
      'STG_IN': 'Die Details für die Entscheidung liefern: Datenblätter, Layouts, Budgets.', 'STG_PP': 'Die letzten Risiken ausräumen: Normen, Vorverkabelung, Lieferzeiten, Genehmigungen.',
      'STG_BY': 'Gut einrichten und Käufer zu Referenzen machen.',
      'Germany': 'Deutschland', 'United Kingdom': 'Vereinigtes Königreich', 'United States': 'USA', 'Australia': 'Australien', 'New Zealand': 'Neuseeland', 'Canada': 'Kanada', 'Belgium, Netherlands, Luxembourg': 'Benelux',
    },
    nl: {
      'Overview': 'Overzicht', 'Library': 'Bibliotheek', 'Blog': 'Blog', 'Downloads': 'Downloads', 'Journey': 'Klantreis', 'Backlog': 'Backlog', 'Tools': 'Tools',
      'Case studies': 'Referenties', 'Images': 'Beelden', 'Sources': 'Bronnen', 'bromic.com': 'bromic.com', 'Review': 'Review',
      'Search content, keywords, sources': 'Zoek content, trefwoorden, bronnen',
      'Bromic Content Hub': 'Bromic Content Hub', 'Designed from the start, not added later.': 'Vanaf het begin ontworpen, niet achteraf toegevoegd.',
      'HERO': 'Alle Bromic-content die buitenverwarming eerder in het project brengt: in de tekening van de architect, de voorbekabeling van de aannemer en het eerste budget van de huiseigenaar. Zoek op doelgroep, op fase van de beslissing of op wat je nodig hebt.',
      'Who it is for': 'Voor wie', 'Where they are': 'Waar ze staan', 'What you need': 'Wat je nodig hebt',
      '01 · Who it is for': '01 · Voor wie', 'Four audiences, four different questions': 'Vier doelgroepen, vier verschillende vragen',
      'Each audience gets content written for its job, not one brochure for everyone.': 'Elke doelgroep krijgt content voor zijn eigen taak, geen brochure voor iedereen.',
      '02 · Where they are': '02 · Waar ze staan', 'From first idea to a working system': 'Van eerste idee tot werkend systeem',
      'Every piece has one job at one stage, and one next step that moves the reader on.': 'Elk stuk heeft één taak in één fase en één volgende stap.',
      '03 · What you need': '03 · Wat je nodig hebt', 'Read, download, use, prove': 'Lezen, downloaden, gebruiken, bewijzen',
      'Start here': 'Begin hier', 'The flagship pieces': 'De belangrijkste stukken', 'For the content team': 'Voor het contentteam',
      'See the full map: every audience at every stage, with the question each piece answers': 'Bekijk het volledige overzicht: elke doelgroep in elke fase, met de vraag die elk stuk beantwoordt',
      'Read and answer': 'Lezen en antwoorden', 'Download': 'Downloaden', 'Try a tool': 'Probeer een tool', 'Prove it': 'Bewijs het',
      'NEED_READ': 'Artikelen, antwoorden en blogs die gevonden en door AI-zoekmachines geciteerd worden.',
      'NEED_DL': 'Rapporten, planningsgidsen en spec kits, elk als afgewerkte pdf achter een formulier.',
      'NEED_TOOL': 'Rekentools die van een bezoek een lead maken: dimensionering, vijfjaarskosten, omzet.',
      'NEED_PROVE': 'Referentieprojecten per projecttype en de Bromic-beeldbibliotheek.',
      'pieces': 'stukken', 'All': 'Alle', 'for': 'voor',
      'For': 'Voor', 'Machine translation, native review pending.': 'Machinevertaling, controle door moedertaalspreker volgt.',
      'Not translated yet: shown in English.': 'Nog niet vertaald: in het Engels getoond.',
      'Units': 'Eenheden', 'Metric': 'Metrisch', 'Metric, converted from the US original': 'Metrisch, omgerekend uit het Amerikaanse origineel', '(imperial in brackets)': '(imperiaal tussen haakjes)',
      'Mains': 'Net', 'Electrical': 'Elektra', 'Gas': 'Gas', 'Installer': 'Installatie', 'Bromic': 'Bromic',
      'Prices, statistics and code references in the text are US figures unless stated. Use local prices and codes.': 'Prijzen, statistieken en normen in de tekst zijn Amerikaanse gegevens, tenzij anders vermeld. Gebruik lokale prijzen en normen.',
      'Edit this page': 'Pagina bewerken', 'Download the PDF': 'Pdf downloaden', 'Open the tool': 'Tool openen', 'Details': 'Details', 'Related': 'Gerelateerd', 'Give feedback': 'Feedback geven',
      'Homeowners': 'Huiseigenaren', 'Architects and designers': 'Architecten en ontwerpers', 'Builders and installers': 'Aannemers en installateurs', 'Restaurant and hotel operators': 'Horeca en hotels',
      'JOB_RES': 'Willen een warme, mooie buitenruimte en een helder antwoord: hoeveel verwarmers, wat ze kosten en hoe ze eruitzien.',
      'JOB_ARC': 'Hebben specificaties, afstanden, verwarmd oppervlak en details nodig die direct in de tekening passen.',
      'JOB_BLD': 'Hebben de juiste voorbekabeling in de ruwbouw nodig, prijsniveaus om op te verkopen en installaties die in één keer worden goedgekeurd.',
      'JOB_COM': 'Willen volle terrassen in het tussenseizoen en een terugverdienberekening die de eigenaar tekent.',
      'STG_AW': 'Buitenverwarming op de tekening krijgen voordat het ontwerp vastligt.', 'STG_CO': 'Elektrisch of gas, hoeveel en wat het kost beantwoorden, en de lead winnen.',
      'STG_IN': 'De details voor de keuze leveren: specificaties, indelingen, budgetten.', 'STG_PP': 'De laatste risico’s wegnemen: normen, voorbekabeling, levertijden, vergunningen.',
      'STG_BY': 'Goed instellen, en kopers referenties maken.',
      'Belgium, Netherlands, Luxembourg': 'Nederland', 'Germany': 'Duitsland', 'United Kingdom': 'Verenigd Koninkrijk', 'United States': 'Verenigde Staten', 'Australia': 'Australië', 'New Zealand': 'Nieuw-Zeeland', 'Canada': 'Canada',
    },
  };
  const STR = (k) => (UI[lang] && UI[lang][k]) || ({ HERO: '', NEED_READ: '', NEED_DL: '', NEED_TOOL: '', NEED_PROVE: '' }[k] ?? k);
  function chromeText() {
    document.querySelectorAll('.tabs a[data-tab]').forEach((a) => { a.dataset.en ||= a.textContent; a.textContent = STR(a.dataset.en); });
    const q = $('#q'); if (q) { q.dataset.en ||= q.placeholder; q.placeholder = STR(q.dataset.en); }
  }

  // A translated page downloads its translated PDF (pdf/<lang>/<id>.pdf, built by scripts/pdf.mjs from data-<lang>.js).
  const pdfHref = (it) => (it.tr && it.lang !== 'en' ? `pdf/${it.lang}/${encodeURIComponent(it.id)}.pdf` : `pdf/${encodeURIComponent(it.id)}.pdf`);

  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 1800); }
  async function copy(text, msg) {
    try { await navigator.clipboard.writeText(text); toast(msg); }
    catch { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); toast(msg); }
  }
  const FRAMED = !!window.HUB_FRAME;  // inside a Claude page: downloads and print are blocked, so copy instead
  if (FRAMED) document.documentElement.classList.add('framed');
  function download(name, text, type = 'text/html') {
    if (FRAMED) { copy(text, 'Copied (downloads are blocked here)'); return; }
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 500);
  }

  function card(it) {
    const hero = it.hero || (it.type === 'tool' ? 't-009-025' : '');
    const v = it.verifies.length;
    return `<a class="card" href="#/item/${esc(it.id)}">
      <div class="ph-img">${img(hero)}${isGated(it) ? `<span class="lock">${ic.lock}GATED${hasPdf(it) ? ' · PDF' : ''}</span>` : ''}</div>
      <div class="body">
        <span class="label">${esc(TYPES[it.type] || it.type)} · ${esc(it.id)}</span>
        <h3>${esc(it.title)}</h3>
        ${it.summary ? `<p>${esc(it.summary)}</p>` : ''}
        <div class="chips">${audChips(it)}${stgChips(it)}</div>
        <div class="meta"><span class="status ${esc(it.status)}">${esc(it.status.replace('-', ' '))}</span>
          <span>${it.words ? it.words.toLocaleString() + ' words' : ''}${v ? ` · <span class="vcount">${v} to verify</span>` : ''}</span></div>
      </div></a>`;
  }

  // ---------- matrix ----------
  function matrixGrid(active) {
    let h = `<div class="mx-wrap"><div class="matrix" role="grid" aria-label="Content by audience and lifecycle stage"><div class="mx-h"><span class="label">Audience</span></div>`;
    for (const s of SK) h += `<div class="mx-h"><span class="label">${esc(STG[s].name)}</span><small>${esc(STG[s].funnel)}</small></div>`;
    for (const a of AK) {
      h += `<div class="mx-h mx-a"><b>${esc(AUD[a].name.split(' (')[0])}</b><small>${esc(AUD[a].persona)}</small></div>`;
      for (const s of SK) {
        const id = `${a}-${s}`, c = CELL[id];
        const its = itemsFor((i) => i.audience.includes(a) && i.stage.includes(s));
        const dots = its.slice(0, 14).map((i) => `<i class="dot ${i.type === 'article' ? 'article' : i.type === 'kb' ? 'kb' : i.type === 'tool' ? 'tool' : isGated(i) ? 'gated' : 'other'}" title="${esc(i.title)}"></i>`).join('');
        h += `<a class="mx-c heat-${Math.min(its.length, 3)}${active === id ? ' on' : ''}" href="#/journey/${id}" role="gridcell" aria-label="${esc(AUD[a].name)}, ${esc(STG[s].name)}: ${its.length} items">
          <span class="n">${its.length}<small>items</small></span>
          <span class="dots">${dots}</span>
          ${c ? `<span class="pain">${esc(c.pain_point)}</span>` : ''}</a>`;
      }
    }
    return h + `</div></div><div class="legend"><span><i class="dot article"></i>Article</span><span><i class="dot kb"></i>Knowledge base</span><span><i class="dot gated"></i>Gated asset</span><span><i class="dot tool"></i>Tool</span><span><i class="dot other"></i>Other</span></div>`;
  }

  // ---------- views ----------
  // ---------- front page: purpose, then three ways in (who, where, what), then the flagships; the team's numbers last ----------
  const AUD_FRONT = {
    RES: { img: 'l-010-071', short: 'Homeowners', job: 'Want a warm, good-looking outdoor room, and a straight answer on how many heaters, what they cost and how they look.' },
    ARC: { img: 'l-010-075', short: 'Architects and designers', job: 'Need specs, clearances, coverage and details that drop into a drawing set, so heating is designed in from the start.' },
    BLD: { img: 'g-rough-in', short: 'Builders and installers', job: 'Need the pre-wire right at rough-in, pricing tiers to sell up, and installs that pass inspection first time.' },
    COM: { img: 'p-003-006', short: 'Restaurant and hotel operators', job: 'Need full patios in the shoulder season and a payback case the owner will sign.' },
  };
  const STG_FRONT = {
    AW: 'Put outdoor heating on the plan before the design is fixed.',
    CO: 'Answer electric or gas, how many and what it costs, and earn the lead.',
    IN: 'Give the specifics to choose: specs, layouts, budgets.',
    PP: 'Remove the last risks: codes, pre-wire, lead times, approvals.',
    BY: 'Set it up well, and turn buyers into references.',
  };
  const FLAGSHIP = ['A01-v2', 'A01c', 'A02-homeowner', 'A02-pro', 'A03', 'A20', 'A21', 'A11'];
  const rankFront = (i) => (i.type === 'tool' ? 0 : isGated(i) ? 1 : i.type === 'article' ? 2 : i.type === 'kb' ? 3 : 4);
  const shortTitle = (t) => t.split(/[:—]/)[0].trim();

  function home() {
    const gated = H.items.filter(isGated).length;
    const srcs = H.items.flatMap((i) => i.sources);
    const ver = srcs.filter((s) => s.verified).length;
    const verifies = H.items.reduce((n, i) => n + i.verifies.length, 0);
    const byType = (ts) => H.items.filter((i) => ts.includes(i.type)).length;
    const p1 = H.assets.filter((a) => a.priority === 'P1');
    const gaps = p1.filter((a) => !linked(a.id).length).length;
    const inReview = H.items.filter((i) => i.status === 'in-review').length;

    const audCards = AK.map((a) => {
      const f0 = AUD_FRONT[a] || {}; const f = { ...f0, short: STR(f0.short || ''), job: lang === 'en' ? f0.job : STR('JOB_' + a) }; const its = itemsFor((i) => i.audience.includes(a));
      const top = [...its].sort((x, y) => rankFront(x) - rankFront(y)).slice(0, 3);
      return `<article class="fp-aud">
        <a class="fp-aud-pic" href="#/library?aud=${a}" tabindex="-1" aria-hidden="true">${img(f.img)}</a>
        <div class="fp-aud-b">
          <span class="label">${esc(AUD[a].persona)}</span>
          <h3><a href="#/library?aud=${a}">${esc(f.short || AUD[a].name)}</a></h3>
          <p>${esc(f.job || '')}</p>
          <ul>${top.map((i) => `<li><a href="#/item/${esc(i.id)}"><span class="fp-t">${esc(TYPES[i.type] || i.type)}</span>${esc(shortTitle(i.title))}</a></li>`).join('')}</ul>
          <a class="fp-more" href="#/library?aud=${a}">${esc(STR('All'))} ${its.length} ${esc(STR('for'))} ${esc((f.short || '').toLowerCase())} ${ic.arrow}</a>
        </div></article>`;
    }).join('');

    const stages = SK.map((s, n) => {
      const its = itemsFor((i) => i.stage.includes(s));
      const top = [...its].filter((i) => i.type !== 'blog').sort((x, y) => rankFront(x) - rankFront(y)).slice(0, 2);
      return `<a class="fp-stg" href="#/library?stage=${s}">
        <span class="fp-stg-n">${String(n + 1).padStart(2, '0')}</span>
        <span class="label">${esc(STG[s].funnel)}</span>
        <h3>${esc(STG[s].name)}</h3>
        <p>${esc(lang === 'en' ? STG_FRONT[s] || '' : STR('STG_' + s))}</p>
        <span class="fp-stg-eg">${top.map((i) => esc(shortTitle(i.title))).join(' · ')}</span>
        <span class="fp-stg-c">${its.length} ${esc(STR('pieces'))} ${ic.arrow}</span></a>`;
    }).join('');

    const tools = H.items.filter((i) => i.type === 'tool');
    const needs = [
      { t: STR('Read and answer'), d: lang === 'en' ? 'Articles, answers and blog posts that rank and get quoted by AI search.' : STR('NEED_READ'), n: byType(['article', 'kb', 'blog']), href: '#/library?type=article', img: 'l-022-201',
        links: [['Articles', '#/library?type=article'], ['Answers', '#/library?type=kb'], ['Blog', '#/blog']] },
      { t: STR('Download'), d: lang === 'en' ? 'Reports, planning guides and spec kits, each a finished PDF behind a form.' : STR('NEED_DL'), n: pdfList().length, href: '#/downloads', img: 't-001-000',
        links: pdfList().slice(0, 3).map((i) => [shortTitle(i.title), `#/item/${i.id}`]) },
      { t: STR('Try a tool'), d: lang === 'en' ? 'Calculators that turn a visit into a lead: sizing, five-year cost, revenue.' : STR('NEED_TOOL'), n: tools.length, href: '#/tools', img: 'p-003-006',
        links: tools.map((i) => [shortTitle(i.title), `#/item/${i.id}`]) },
      { t: STR('Prove it'), d: lang === 'en' ? 'Case studies tagged by project type, and the Bromic image library.' : STR('NEED_PROVE'), n: (H.cs?.records?.length || 0), href: '#/cases', img: 'l-016-131',
        links: [['Case studies', '#/cases'], ['Find the gaps', '#/cases/whitespace'], ['Images', '#/images']] },
    ];
    const needCards = needs.map((x) => `<article class="fp-need">
        <a class="fp-need-pic" href="${x.href}" tabindex="-1" aria-hidden="true">${img(x.img)}<span class="fp-need-n">${x.n}</span></a>
        <div class="fp-need-b"><h3><a href="${x.href}">${esc(x.t)}</a></h3><p>${esc(x.d)}</p>
        <div class="fp-links">${x.links.map(([l, h]) => `<a href="${h}">${esc(l)}</a>`).join('')}</div></div></article>`).join('');

    const flag = FLAGSHIP.map((id) => ITEM[id]).filter(Boolean);

    return `
    <section class="hero fp-hero">${img('l-022-201', '', false)}
      <div class="hero-in"><span class="flame-rule"></span><span class="label">Bromic Content Hub · ${esc(STR(R().name))}</span>
        <h1>${esc(STR('Designed from the start, not added later.'))}</h1>
        <p>${lang === 'en' ? 'Every piece of Bromic content that moves outdoor heating earlier: into the architect\'s drawing, the builder\'s pre-wire and the homeowner\'s first budget. Find it by who it is for, where they are in the decision, or what you need.' : esc(STR('HERO'))}</p>
        <nav class="fp-ways" aria-label="Ways in">
          <a href="#fp-who"><span>01</span>${esc(STR('Who it is for'))}</a>
          <a href="#fp-where"><span>02</span>${esc(STR('Where they are'))}</a>
          <a href="#fp-what"><span>03</span>${esc(STR('What you need'))}</a>
        </nav></div>
    </section>

    <section id="fp-who" class="fp-sec">
      <div class="fp-h"><span class="fp-k">${esc(STR('01 · Who it is for'))}</span><h2>${esc(STR('Four audiences, four different questions'))}</h2>
        <p>${esc(STR('Each audience gets content written for its job, not one brochure for everyone.'))}</p></div>
      <div class="fp-auds">${audCards}</div>
    </section>

    <section id="fp-where" class="fp-sec">
      <div class="fp-h"><span class="fp-k">${esc(STR('02 · Where they are'))}</span><h2>${esc(STR('From first idea to a working system'))}</h2>
        <p>${esc(STR('Every piece has one job at one stage, and one next step that moves the reader on.'))}</p></div>
      <div class="fp-journey">${stages}</div>
      <p class="fp-note"><a href="#/journey">${esc(STR('See the full map: every audience at every stage, with the question each piece answers'))} ${ic.arrow}</a></p>
    </section>

    <section id="fp-what" class="fp-sec">
      <div class="fp-h"><span class="fp-k">${esc(STR('03 · What you need'))}</span><h2>${esc(STR('Read, download, use, prove'))}</h2></div>
      <div class="fp-needs">${needCards}</div>
    </section>

    <section class="fp-sec">
      <div class="fp-h"><span class="fp-k">${esc(STR('Start here'))}</span><h2>${esc(STR('The flagship pieces'))}</h2></div>
      <div class="grid">${flag.map(card).join('')}</div>
    </section>

    <section class="fp-team" aria-labelledby="fp-team-h">
      <div class="fp-team-h"><h2 id="fp-team-h">For the content team</h2>
        <p>Drafts are review-ready, not published. Here is where the work stands.</p></div>
      <div class="fp-team-stats">
        <a href="#/library"><b>${H.items.length}</b><span>pieces · ${gated} gated</span></a>
        <a href="#/review"><b>${inReview}</b><span>in review</span></a>
        <a href="#/sources"><b>${verifies}</b><span>facts to verify · ${ver}/${srcs.length} sources checked</span></a>
        <a href="#/assets"><b>${p1.length - gaps}/${p1.length}</b><span>priority assets drafted</span></a>
        <a href="#/images"><b>${H.images.length}</b><span>images</span></a>
      </div>
      <details class="fp-cov"><summary>Coverage map: audience by stage</summary>${matrixGrid()}</details>
    </section>`;
  }

  function linked(assetId) { return H.items.filter((i) => i.asset === assetId || i.id === assetId || i.id.startsWith(assetId + '-')); }

  // library state lives in the hash query
  function parseQ() { const q = new URLSearchParams((location.hash.split('?')[1]) || ''); return { stage: q.get('stage') || '', aud: q.get('aud') || '', type: q.get('type') || '', status: q.get('status') || '', gated: q.get('gated') || '', sort: q.get('sort') || 'journey' }; }
  function libHref(st) { const q = new URLSearchParams(); for (const [k, v] of Object.entries(st)) if (v && !(k === 'sort' && v === 'journey')) q.set(k, v); const s = q.toString(); return '#/library' + (s ? '?' + s : ''); }
  function match(it, st, skip) {
    return (skip === 'stage' || !st.stage || it.stage.includes(st.stage)) && (skip === 'aud' || !st.aud || it.audience.includes(st.aud))
      && (skip === 'type' || !st.type || it.type === st.type) && (skip === 'status' || !st.status || it.status === st.status)
      && (skip === 'gated' || !st.gated || (st.gated === 'yes') === isGated(it)) && (!searchTerm || hay(it).includes(searchTerm));
  }
  const hay = (it) => (hay.c ||= {})[it.id] ||= [it.id, it.title, it.summary, it.primary_keyword, ...it.secondary_keywords, it.ai_prompt, it.markdown, ...it.sources.map((s) => s.publisher + ' ' + s.title)].join(' ').toLowerCase();
  let searchTerm = '';

  function library() {
    const st = parseQ();
    const groups = [
      ['stage', 'Lifecycle', SK.map((k) => [k, STG[k].name])],
      ['aud', 'Audience', AK.map((k) => [k, AUD[k].name.split(' (')[0]])],
      ['type', 'Type', Object.keys(TYPES).map((k) => [k, TYPES[k]])],
      ['gated', 'Access', [['yes', 'Gated (MQL)'], ['no', 'Open']]],
      ['status', 'Status', STATUSES.concat('template').map((k) => [k, k.replace('-', ' ')])],
    ];
    const f = groups.map(([key, label, opts]) => `<div class="fgroup"><span class="label">${label}</span>${opts.map(([v, l]) => {
      const n = H.items.filter((i) => match(i, { ...st, [key]: v }, '')).length;
      const on = st[key] === v;
      return `<button class="fopt" aria-pressed="${on}" data-href="${libHref({ ...st, [key]: on ? '' : v })}" ${!n && !on ? 'disabled' : ''}><span style="text-transform:capitalize">${esc(l)}</span><span class="c">${n}</span></button>`;
    }).join('')}</div>`).join('');
    let list = H.items.filter((i) => match(i, st));
    const ord = (i) => AK.indexOf(i.audience[0]) * 10 + SK.indexOf(i.stage[0]);
    list.sort(st.sort === 'title' ? (a, b) => a.title.localeCompare(b.title) : st.sort === 'verify' ? (a, b) => b.verifies.length - a.verifies.length
      : st.sort === 'words' ? (a, b) => b.words - a.words : (a, b) => ord(a) - ord(b) || (a.type === 'article' ? -1 : 1));
    const active = Object.entries(st).filter(([k, v]) => v && k !== 'sort').length || searchTerm;
    return `<div class="ph"><div><span class="label">Library</span><h1>Every asset, by lifecycle, audience and type</h1></div></div>
    <div class="lib"><aside class="filters" aria-label="Filters">${f}</aside>
      <section><div class="toolbar"><span class="muted">${list.length} of ${H.items.length}${searchTerm ? ` matching “${esc(searchTerm)}”` : ''}${active ? ` · <button class="clear" data-clear>Clear filters</button>` : ''}</span>
        <label class="muted" style="font-size:13px">Sort <select id="sort">${[['journey', 'Journey order'], ['title', 'Title'], ['verify', 'Most to verify'], ['words', 'Longest']].map(([v, l]) => `<option value="${v}" ${st.sort === v ? 'selected' : ''}>${l}</option>`).join('')}</select></label></div>
        ${list.length ? `<div class="grid">${list.map(card).join('')}</div>` : '<div class="empty">Nothing matches. Clear a filter.</div>'}</section></div>`;
  }

  // Gated documents get a PDF at deploy (app/scripts/pdf.mjs uses the same rule).
  const PDF_TYPES = ['report', 'gated-guide', 'spec-kit', 'sales-kit', 'stats-page'];
  const hasPdf = (it) => it.gated === true && PDF_TYPES.includes(it.type) && !FRAMED;
  function item(id) {
    const it = ITEM[id];
    if (!it) return `<div class="empty">No item “${esc(id)}”. <a href="#/library">Back to the library</a></div>`;
    const cell = CELL[it.cell];
    const cta = it.cta;
    const ctaAsset = cta && ASSET[cta.asset];
    const rel = it.related.map((r) => ITEM[r]).filter(Boolean);
    const md = it.meta_description || '';
    const tool = it.type === 'tool' && H.tools.find((t) => t.startsWith(it.asset || it.id));
    const ED = window.HubEditor, hero = ED ? ED.heroId(it) : it.hero;
    return `<nav class="crumbs"><a href="#/library">Library</a><span>/</span><a href="${libHref({ type: it.type })}">${esc(TYPES[it.type] || it.type)}</a>${it.cell ? `<span>/</span><a href="#/journey/${esc(it.cell)}">${esc(it.cell)}</a>` : ''}</nav>
    <div class="ed-start"><button type="button" class="btn" data-edit-page>${ic.pen}${esc(STR('Edit this page'))}</button></div>
    ${hero ? `<div class="reader-hero">${img(hero, '', false)}${ED ? ED.heroButton(it) : ''}</div>` : ED && ED.active(it.id) ? `<div class="reader-hero ed-nohero">${ED.heroButton(it)}</div>` : ''}
    <div class="reader"><article>
      <span class="label">${esc(TYPES[it.type] || it.type)} · ${esc(it.id)}${isGated(it) ? ' · Gated' : ''}</span>
      <h1>${ED ? ED.title(it) : esc(it.title)}</h1>
      ${it.summary || (ED && ED.active(it.id)) ? `<p class="dek">${ED ? ED.summary(it) : esc(it.summary)}</p>` : ''}
      ${tool ? `<p><a class="btn primary" href="#/tool/${esc(tool)}">${ic.arrow} ${esc(STR('Open the tool'))}</a></p>` : ''}
      ${hasPdf(it) ? `<p><a class="btn primary" href="${pdfHref(it)}" download="Bromic-${esc(it.id)}${it.tr && it.lang !== 'en' ? '-' + it.lang : ''}.pdf">${ic.down}${esc(STR('Download the PDF'))}</a> <span class="muted" style="font-size:13px">${it.status === 'approved' || it.status === 'published' ? 'Ready to share' : 'Review draft'}</span></p>` : ''}
      <div class="prose">${ED ? ED.prose(it) : it.html}</div>
      ${it.sources.length ? `<hr class="rule"><h2 style="font-size:24px;margin-bottom:6px">Sources</h2><p class="muted" style="margin-top:0;font-size:13px">${it.sources.length} mapped · ${it.sources.length - unverified(it)} verified</p>
      <ol class="srcs">${it.sources.map((s, i) => `<li id="src-${esc(it.id)}-${esc(s.id)}"><span class="n">${i + 1}</span><span><b>${esc(s.publisher || '')}</b>${s.title ? ` — ${esc(s.title)}` : ''}${s.year ? ` (${esc(s.year)})` : ''} ${s.verified ? '<span class="chip ok">Verified</span>' : '<span class="chip warn">Verify</span>'}
        ${s.supports ? `<div class="s-sup">Supports: ${esc(s.supports)}</div>` : ''}${s.url ? `<div><a href="${esc(/^https?:/.test(s.url) ? s.url : '#')}" target="_blank" rel="noopener">${esc(s.url)}</a></div>` : ''}</span></li>`).join('')}</ol>` : ''}
    </article>
    <aside class="side">
      ${regionPanel(it)}
      ${cta ? `<a class="cta" href="${ctaAsset ? '#/assets/' + esc(cta.asset) : '#'}"><span><span class="label" style="color:inherit;opacity:.7">Call to action${cta.asset ? ' → ' + esc(cta.asset) : ''}</span><br>${esc(cta.label || '')}</span>${ic.arrow}</a>` : ''}
      <div class="panel"><h4>Details</h4><dl class="kv">
        <dt>Status</dt><dd><span class="status ${esc(it.status)}">${esc(it.status)}</span></dd>
        <dt>Audience</dt><dd>${it.audience.map((a) => esc(AUD[a]?.name || a)).join(', ')}</dd>
        <dt>Lifecycle</dt><dd>${it.stage.map((s) => esc(STG[s]?.name || s)).join(', ')}</dd>
        ${it.asset ? `<dt>Asset</dt><dd><a href="#/assets/${esc(it.asset)}">${esc(it.asset)} · ${esc(ASSET[it.asset]?.name || '')}</a></dd>` : ''}
        <dt>Reviewer</dt><dd>${esc(it.owner_review || '—')}</dd>
        ${it.publish ? `<dt>Publish as</dt><dd><b>${esc(it.publish.publish_as)}</b>${it.publish.target_url ? ` → <a href="${esc(it.publish.target_url)}" target="_blank" rel="noopener">${esc(it.publish.target_url.replace('https://www.bromic.com', ''))}</a>` : ''}<br><span class="muted" style="font-size:13px">${esc(it.publish.reason || '')}</span></dd>
        ${it.publish.owner_link ? `<dt>Must link to</dt><dd><a href="${esc(it.publish.owner_link)}" target="_blank" rel="noopener">${esc(it.publish.owner_link.replace('https://www.bromic.com', '') || '/')}</a> (owner of the purchase intent)</dd>` : ''}
        ${it.publish.cannibalisation_risk && !/^none/i.test(it.publish.cannibalisation_risk) ? `<dt>Cannibalisation</dt><dd class="vcount" style="font-size:13px">${esc(it.publish.cannibalisation_risk)}</dd>` : ''}` : ''}
        ${it.needs_approval ? `<dt>Approval</dt><dd>${esc(it.needs_approval)}</dd>` : ''}
        <dt>Length</dt><dd>${it.words.toLocaleString()} words</dd>
        ${it.updated ? `<dt>Updated</dt><dd>${esc(it.updated)}</dd>` : ''}
        <dt>File</dt><dd style="font-size:12px">${esc(it.file)}</dd>
      </dl></div>
      ${it.primary_keyword || it.ai_prompt ? `<div class="panel"><h4>Search & AI</h4><dl class="kv">
        ${it.primary_keyword ? `<dt>Keyword</dt><dd>${esc(it.primary_keyword)}</dd>` : ''}
        ${it.secondary_keywords.length ? `<dt>Secondary</dt><dd>${it.secondary_keywords.map(esc).join(', ')}</dd>` : ''}
        ${it.ai_prompt ? `<dt>AI prompt</dt><dd><i>${esc(it.ai_prompt)}</i></dd>` : ''}
        ${md ? `<dt>Meta</dt><dd>${esc(md)} <span class="charcount ${md.length > 155 ? 'bad' : 'muted'}">${md.length}/155</span></dd>` : ''}
        ${it.faq.length ? `<dt>FAQ schema</dt><dd>${it.faq.length} questions</dd>` : ''}
      </dl></div>` : ''}
      ${it.verifies.length ? `<div class="panel"><h4>To verify · ${it.verifies.length}</h4><ol class="vlist">${it.verifies.map((v) => `<li>${esc(v)}</li>`).join('')}</ol></div>` : ''}
      ${cell ? `<div class="panel"><h4>Journey cell · ${esc(cell.id)}</h4><p style="margin:0 0 8px;font-size:13.5px">${esc(cell.pain_point)}</p><a href="#/journey/${esc(cell.id)}" style="font-size:13px">Open cell →</a></div>` : ''}
      <div class="panel"><h4>Feedback</h4><div id="fb-panel"><p class="muted" style="font-size:13px;margin:0">Loading…</p></div><button class="btn" style="margin-top:10px" data-fb>${ic.chat}Give feedback</button></div>
      ${rel.length ? `<div class="panel"><h4>Related</h4><ul class="list">${rel.map((r) => `<li><a href="#/item/${esc(r.id)}"><span class="t" style="font-size:15px">${esc(r.title)}</span></a></li>`).join('')}</ul></div>` : ''}
      <div class="btns">
        ${hasPdf(it) ? `<a class="btn primary" href="${pdfHref(it)}" download="Bromic-${esc(it.id)}${it.tr && it.lang !== 'en' ? '-' + it.lang : ''}.pdf">${ic.down}Download PDF</a>` : ''}
        <button class="btn" data-act="md" data-id="${esc(it.id)}">${ic.copy}Copy Markdown</button>
        <button class="btn" data-act="html" data-id="${esc(it.id)}">${FRAMED ? ic.copy + 'Copy HTML' : ic.down + 'Export HTML'}</button>
        <button class="btn no-frame" data-act="print">${ic.print}Print / PDF</button>
      </div>
    </aside></div>`;
  }

  function journey(cellId) {
    const c = CELL[cellId];
    let detail = '';
    if (c) {
      const its = itemsFor((i) => i.audience.includes(c.audience) && i.stage.includes(c.stage));
      const a = ASSET[c.mql_asset];
      detail = `<section class="cell-detail" id="cell"><div>
        <span class="label">${esc(AUD[c.audience].name)} · ${esc(STG[c.stage].name)} · ${esc(STG[c.stage].funnel)}</span>
        <h2>${esc(c.anchor_article)}</h2>
        <div class="qa">
          <div><span class="label">Pain point</span><p>${esc(c.pain_point)}</p></div>
          <div><span class="label">Opportunity</span><p>${esc(c.opportunity)}</p></div>
          <div><span class="label">Problem to solve</span><p>${esc(c.problem_to_solve)}</p></div>
          <div><span class="label">The question people ask AI</span><p class="prompt">${esc(c.ai_prompt)}</p></div>
          <div><span class="label">Keywords · ${esc(c.intent)}</span><div class="chips" style="margin-top:6px"><span class="chip solid">${esc(c.primary_keyword)}</span>${c.secondary_keywords.map((k) => `<span class="chip">${esc(k)}</span>`).join('')}</div></div>
          <div><span class="label">KPI</span><p>${esc(c.kpi)}</p></div>
        </div></div>
        <div><span class="label">MQL asset</span>
          <p style="margin:6px 0 18px"><a href="#/assets/${esc(c.mql_asset)}" class="t" style="font:400 19px var(--serif)">${esc(c.mql_asset)} · ${esc(a?.name || '')}</a></p>
          <span class="label">Content in this cell · ${its.length}</span>
          <ul class="list" style="margin-top:6px">${its.map((i) => `<li><a href="#/item/${esc(i.id)}"><span class="t" style="font-size:15px">${esc(i.title)}</span><span class="chip">${esc(TYPES[i.type])}</span></a></li>`).join('') || '<li><span class="row gap">No content yet — the anchor article is the gap.</span></li>'}</ul>
        </div></section>`;
    }
    return `<div class="ph"><div><span class="label">Journey map</span><h1>Four audiences, five stages, twenty jobs</h1>
      <p>Each cell is a buyer moment: what hurts, what we can own, the question they ask an AI, and the asset that converts it. Select a cell.</p></div></div>
      ${matrixGrid(cellId)}${detail}
      ${H.matrix.source === 'reconstructed' ? `<p class="muted" style="font-size:12px;margin-top:16px">Cells reconstructed from the handover brief — replace <code>data/journey-matrix.json</code> with the original when available. Keywords are directional, pending validation.</p>` : ''}`;
  }

  function assets(id) {
    const rows = H.assets.map((a) => {
      const its = linked(a.id);
      return `<tr id="a-${a.id}" ${id === a.id ? 'style="background:var(--flame-wash)"' : ''}><td><b>${a.id}</b></td><td><span class="pri ${a.priority}">${a.priority}</span></td>
        <td><b style="font:400 16px var(--serif)">${esc(a.name)}</b>${a.provenance === 'proposed' ? '<div class="prov">Proposed — not in the brief</div>' : ''}</td>
        <td>${esc(TYPES[a.type] || a.type)}</td><td>${a.audiences.join(' ')}</td><td>${a.stages.map((s) => STG[s]?.name || s).join(', ')}</td>
        <td>${a.gated ? 'Gated' : 'Open'}</td><td style="text-transform:capitalize">${esc(a.status)}</td><td>${esc(a.owner)}</td>
        <td>${its.length ? its.map((i) => `<a href="#/item/${esc(i.id)}">${esc(i.id)}</a>${hasPdf(i) ? ` · <a href="pdf/${esc(i.id)}.pdf" download="Bromic-${esc(i.id)}.pdf">PDF</a>` : ''}`).join('<br>') : '<span class="gap" style="color:var(--flame-ink)">—</span>'}</td></tr>`;
    }).join('');
    setTimeout(() => id && document.getElementById('a-' + id)?.scrollIntoView({ block: 'center' }), 30);
    return `<div class="ph"><div><span class="label">Build backlog</span><h1>A01–A24</h1><p>Priority 1 first. Draft content is linked; a dash is a gap.</p></div></div>
      <div class="tbl-wrap"><table class="data"><thead><tr><th>ID</th><th>Pri</th><th>Asset</th><th>Type</th><th>Audience</th><th>Lifecycle</th><th>Access</th><th>Status</th><th>Reviewer</th><th>Content</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  }

  function tools() {
    const cards = H.items.filter((i) => i.type === 'tool');
    return `<div class="ph"><div><span class="label">Tools</span><h1>Calculators that qualify the lead</h1><p>Result on screen as a teaser; the full report sits behind the lead form. Every assumption lives in the tool's <code>config.json</code>.</p></div></div>
    <div class="grid">${H.tools.map((t) => { const c = cards.find((i) => t.startsWith(i.asset || '#')) || {}; return `<a class="card" href="#/tool/${esc(t)}"><div class="ph-img">${img(c.hero || 't-009-025')}</div><div class="body"><span class="label">Tool · ${esc(t.split('-')[0])}</span><h3>${esc(c.title || t)}</h3>${c.summary ? `<p>${esc(c.summary)}</p>` : ''}<div class="meta"><span>Open ${ic.arrow.replace('<svg', '<svg width="12" height="12" style="fill:none;stroke:currentColor;stroke-width:1.8;vertical-align:-1px"')}</span></div></div></a>`; }).join('') || '<div class="empty">No tools built yet.</div>'}</div>`;
  }
  function tool(t) {
    const c = H.items.find((i) => i.type === 'tool' && t.startsWith(i.asset || '#'));
    return `<nav class="crumbs"><a href="#/tools">Tools</a><span>/</span><span>${esc(t)}</span></nav>
      <div class="ph"><div><h1>${esc(c?.title || t)}</h1>${c?.summary ? `<p>${esc(c.summary)}</p>` : ''}</div>
      <div class="btns"><a class="btn" href="tools/${esc(t)}/index.html?region=${region}&lang=${lang}${FRAMED ? '&framed=1' : ''}" target="_blank" rel="noopener">${ic.ext}Open full page</a>${c ? `<a class="btn" href="#/item/${esc(c.id)}">About this tool</a>` : ''}</div></div>
      <iframe class="tool-frame" src="tools/${esc(t)}/index.html?embed=1&region=${region}&lang=${lang}${FRAMED ? '&framed=1' : ''}" title="${esc(c?.title || t)}"></iframe>`;
  }

  let imgFilter = { product: '', aud: '', src: '' };
  function images() {
    const prods = [...new Set(H.images.map((i) => i.product.replace(/ \(.*\)$/, '')))].sort();
    const srcs = [...new Set(H.images.map((i) => i.source))];
    const list = H.images.filter((i) => (!imgFilter.product || i.product.startsWith(imgFilter.product)) && (!imgFilter.aud || i.audiences.includes(imgFilter.aud) || i.audiences.includes('ALL')) && (!imgFilter.src || i.source === imgFilter.src));
    const sel = (k, opts, label) => `<label class="muted" style="font-size:13px">${label} <select data-imgf="${k}"><option value="">All</option>${opts.map((o) => `<option ${imgFilter[k] === o ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select></label>`;
    return `<div class="ph"><div><span class="label">Image library</span><h1>Bromic photography, tagged for reuse</h1><p>bromic.com photography (case studies, gallery, product pages), the Lookbook 2026, Trends 2026 and the 2021 Planning Guide. Order of preference: bromic.com → Bromic asset library → Bromic publications → generated, labelled.</p></div></div>
      <div class="callout"><b>bromic.com:</b> <code>python3 scripts/bromic_site_images.py fetch</code> pulls every image the site inventory names; <code>sheets</code> makes contact sheets to look at; <code>ingest</code> adds the kept ones with their page link. Rights stay [[VERIFY]] until Megan Spies confirms.</div>
      <div class="callout"><b>Add images:</b> drop files into <code>images/inbox/</code> in the Bromic_Marketing repo, then run <code>python3 scripts/ingest_images.py</code> — they are resized, tagged and appear here on the next build.</div>
      <div class="toolbar"><span class="muted">${list.length} images</span><span class="btns">${sel('product', prods, 'Product')}${sel('aud', AK, 'Audience')}${sel('src', srcs, 'Source')}</span></div>
      <div class="masonry">${list.map((i) => `<button class="tile" data-img="${i.id}"><img src="${i.thumb}" alt="${esc(i.alt)}" loading="lazy" width="${i.w}" height="${i.h}"><span class="cap"><span><b>${esc(i.product)}</b><br>${esc(i.setting)}</span><span>${(H.usage[i.id] || []).length ? (H.usage[i.id].length + '×') : ''}</span></span></button>`).join('')}</div>`;
  }
  function lightbox(id) {
    const i = IMG[id]; if (!i) return;
    const used = H.usage[id] || [];
    const el = document.createElement('div');
    el.className = 'lightbox'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', i.alt);
    el.innerHTML = `<div class="pic"><img src="${i.file}" alt="${esc(i.alt)}"></div><button class="x" aria-label="Close">×</button>
      <aside><span class="label">${esc(i.id)}</span><h3 style="font-size:22px;margin:8px 0 12px">${esc(i.product)}</h3><p style="margin:0 0 16px">${esc(i.alt)}</p>
      <dl class="kv"><dt>Setting</dt><dd>${esc(i.setting)}</dd><dt>Audience</dt><dd>${i.audiences.join(', ')}</dd><dt>Source</dt><dd>${i.page_url ? `<a href="${esc(i.page_url)}" target="_blank" rel="noopener">${esc(i.source)}</a>${i.used_on && i.used_on.length > 1 ? ` (+${i.used_on.length - 1} pages)` : ''}` : `${esc(i.source)}, p.${i.page}`}</dd>${i.notes ? `<dt>Note</dt><dd>${esc(i.notes)}</dd>` : ''}<dt>Size</dt><dd>${i.w}×${i.h}, ${i.orientation}</dd><dt>Rights</dt><dd>${esc(i.rights)}</dd>
      <dt>Used in</dt><dd>${used.length ? used.map((u) => `<a href="#/item/${esc(u)}">${esc(u)}</a>`).join(', ') : 'Not yet'}</dd></dl>
      <div class="btns" style="margin-top:18px"><button class="btn" data-copyid="${esc(i.id)}">${ic.copy}Copy id</button><button class="btn" data-fbel="image:${esc(i.id)}" data-fblabel="Image ${esc(i.id)}">${ic.chat}Feedback</button><a class="btn no-frame" href="${i.file}" download>${ic.down}Download</a></div></aside>`;
    const close = () => { el.remove(); document.removeEventListener('keydown', k); };
    const k = (e) => { if (e.key === 'Escape') close(); };
    el.addEventListener('click', (e) => { if (e.target === el || e.target.classList.contains('x') || e.target.closest('.pic') && e.target.tagName !== 'IMG' || e.target.closest('a[href^="#/item"]')) close(); const c = e.target.closest('[data-copyid]'); if (c) copy(c.dataset.copyid, 'Image id copied'); });
    document.addEventListener('keydown', k);
    document.body.appendChild(el); el.querySelector('.x').focus();
  }

  function sources() {
    const map = new Map();
    for (const it of H.items) for (const s of it.sources) {
      const key = (s.url || s.publisher + s.title).replace(/[#?].*$/, '').toLowerCase();
      const e = map.get(key) || { ...s, by: [] }; e.by.push(it.id); e.verified = e.verified || s.verified; map.set(key, e);
    }
    const list = [...map.values()].filter((s) => !searchTerm || (s.publisher + s.title + s.supports).toLowerCase().includes(searchTerm)).sort((a, b) => b.by.length - a.by.length || String(a.publisher).localeCompare(b.publisher));
    const v = list.filter((s) => s.verified).length;
    return `<div class="ph"><div><span class="label">Sources</span><h1>Every claim, mapped to where it came from</h1><p>${list.length} distinct sources · ${v} verified · ${list.length - v} awaiting a reviewer. A statistic without a verified source does not ship.</p></div></div>
      <div class="tbl-wrap"><table class="data"><thead><tr><th>Publisher</th><th>Source</th><th>Year</th><th>Supports</th><th>Status</th><th>Cited by</th></tr></thead><tbody>
      ${list.map((s) => `<tr><td><b>${esc(s.publisher)}</b></td><td>${s.url && /^https?:/.test(s.url) ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title || s.url)}</a>` : esc(s.title || s.url || '')}</td><td>${esc(s.year || '')}</td><td style="max-width:320px">${esc(s.supports || '')}</td><td>${s.verified ? '<span class="chip ok">Verified</span>' : '<span class="chip warn">Verify</span>'}</td><td>${[...new Set(s.by)].map((b) => `<a href="#/item/${esc(b)}">${esc(b)}</a>`).join(' ')}</td></tr>`).join('')}
      </tbody></table></div>`;
  }

  function review() {
    const col = (s) => H.items.filter((i) => i.status === s).length;
    const byOwner = {};
    for (const it of H.items) (byOwner[it.owner_review || 'Unassigned'] ||= []).push(it);
    const top = [...H.items].filter((i) => i.verifies.length || unverified(i)).sort((a, b) => (b.verifies.length + unverified(b)) - (a.verifies.length + unverified(a)));
    return `<div class="ph"><div><span class="label">Review</span><h1>What needs a human before it ships</h1><p>Nothing here is published. Owners sign off; 454 Creative lays out; WordPress follows.</p></div></div>
      <div class="kanban">${STATUSES.map((s) => `<a class="col" href="${libHref({ status: s })}" style="text-decoration:none"><span class="label">${s.replace('-', ' ')}</span><b>${col(s)}</b></a>`).join('')}</div>
      <div class="two"><div><div class="sec-h"><h2>By reviewer</h2></div><ul class="list">${Object.entries(byOwner).sort((a, b) => b[1].length - a[1].length).map(([o, its]) => `<li><span class="row"><span class="t" style="font-size:16px">${esc(o)}</span><span class="muted">${its.length} items · ${its.reduce((n, i) => n + i.verifies.length, 0)} flags</span></span></li>`).join('')}</ul></div>
      <div><div class="sec-h"><h2>Most to verify</h2></div><ul class="list">${top.slice(0, 12).map((i) => `<li><a href="#/item/${esc(i.id)}"><span class="t" style="font-size:15px">${esc(i.title)}</span><span class="vcount" style="font-size:13px;white-space:nowrap">${i.verifies.length} flags · ${unverified(i)} sources</span></a></li>`).join('')}</ul></div></div>
      <div class="sec-h"><h2>Feedback</h2><a href="https://github.com/${REPO}/issues?q=%5BFeedback%5D" target="_blank" rel="noopener">All on GitHub →</a></div>
      <div class="panel" id="fb-all"><p class="muted" style="margin:0">Loading…</p></div>
      <div class="sec-h"><h2>Open questions</h2></div>
      ${H.openQuestions.map((q, n) => `<details class="oq" ${n === 0 ? 'open' : ''}><summary>${esc(q.name.replace(/-/g, ' '))}</summary>${q.html}</details>`).join('') || '<div class="empty">No open questions logged.</div>'}`;
  }

  // ---------- downloads: every gated document as a PDF ----------
  const pdfList = () => H.items.filter(hasPdf).sort((a, b) => (a.id.startsWith('A01') ? 0 : 1) - (b.id.startsWith('A01') ? 0 : 1) || a.id.localeCompare(b.id));
  const pdfBtn = (it, label = 'Download PDF') => `<a class="btn primary" href="${pdfHref(it)}" download="Bromic-${esc(it.id)}${it.tr && it.lang !== 'en' ? '-' + it.lang : ''}.pdf">${ic.down}${label}</a>`;
  function downloadsPage() {
    const L = pdfList();
    return `<div class="ph"><div><span class="label">Downloads</span><h1>Reports, guides and kits as PDFs</h1><p>${L.length} documents, rebuilt from the latest content at every update. Each opens with a cover and carries its sources and one next step.</p></div></div>
      <div class="dl-grid">${L.map((it) => `<article class="dl-card"><a class="dl-cover" href="#/item/${esc(it.id)}">${img(it.hero)}</a>
        <div class="dl-body"><span class="label">${esc(TYPES[it.type] || it.type)} · ${it.audience.map((a) => esc(AUD[a]?.name || a)).join(', ')}</span>
        <h3><a href="#/item/${esc(it.id)}">${esc(it.title)}</a></h3>${it.meta_description || it.summary ? `<p>${esc(it.meta_description || it.summary)}</p>` : ''}
        <div class="btns">${pdfBtn(it)}<a class="btn" href="${pdfHref(it)}" target="_blank" rel="noopener">${ic.ext}Open</a></div></div></article>`).join('')}</div>`;
  }

  // ---------- blog: the live bromic.com/blog, post by post, and what replaces each ----------
  let blogF = '';
  function blogPage() {
    const P = H.blogPlan || [];
    const kind = (r) => r.post ? 'post' : r.into ? 'merged' : r.article ? 'article' : /retire|unpublish/i.test(r.call) ? 'retired' : 'todo';
    const posts = H.items.filter((i) => i.type === 'blog');
    const n = (k) => P.filter((r) => kind(r) === k).length;
    const after = P.length - n('merged') - n('retired');
    const list = P.filter((r) => !blogF || kind(r) === blogF || (blogF === 'post' && kind(r) === 'post'));
    const pill = { post: '<span class="chip solid">New post</span>', merged: '<span class="chip">Merged, 301</span>', article: '<span class="chip ok">Hub article</span>', retired: '<span class="chip warn">Retire / unpublish</span>', todo: '<span class="chip warn">Not yet written</span>' };
    const tgt = (r) => { const id = r.post || r.into || r.article; const it = id && ITEM[id]; return it ? `<a href="#/item/${esc(id)}">${esc(id)} · ${esc(it.title)}</a>${r.into ? ' <span class="muted">(merged into)</span>' : ''}<br><span class="muted" style="font-size:12.5px">${esc(it.status)} · ${it.words.toLocaleString()} words${it.verifies.length ? ` · <span class="vcount">${it.verifies.length} to verify</span>` : ''}</span>` : `<span class="muted">${esc(r.why).slice(0, 140)}</span>`; };
    const words = posts.reduce((a, i) => a + i.words, 0);
    return `<div class="ph"><div><span class="label">Blog</span><h1>bromic.com/blog, rewritten post by post</h1><p>${P.length} live posts become ${after}: each keeps its URL (the SEO plan recovers existing pages rather than adding new ones), merged posts redirect into the strongest one, and every rewrite follows the answer-first template with its controls, sources and one next step.</p></div></div>
      <div class="stats"><div class="stat"><span class="label">Live today</span><b>${P.length}</b><span class="sub">posts on bromic.com/blog</span></div>
        <div class="stat"><span class="label">New posts written</span><b>${n('post')}</b><span class="sub">${words.toLocaleString()} words, drafts for review</span></div>
        <div class="stat"><span class="label">Merged</span><b>${n('merged')}</b><span class="sub">301 into a stronger post</span></div>
        <div class="stat"><span class="label">Hub articles</span><b>${n('article')}</b><span class="sub">replace the post body</span></div>
        <div class="stat"><span class="label">Retire</span><b>${n('retired')}</b><span class="sub">${n('todo') ? n('todo') + ' still to write' : 'nothing left to write'}</span></div></div>
      <div class="toolbar" style="margin-top:22px"><span class="muted">${list.length} of ${P.length} live posts</span><span class="btns"><label class="muted" style="font-size:13px">Show <select data-blogf><option value="">All</option>${['post', 'merged', 'article', 'retired', 'todo'].map((k) => `<option value="${k}" ${blogF === k ? 'selected' : ''}>${{ post: 'New posts', merged: 'Merged', article: 'Hub articles', retired: 'Retire', todo: 'Not yet written' }[k]}</option>`).join('')}</select></label></span></div>
      <div class="tbl-wrap"><table class="data"><thead><tr><th>Live post</th><th>Cell</th><th>Call</th><th>Replaced by</th></tr></thead><tbody>
      ${list.map((r) => `<tr><td style="min-width:220px"><a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.title)}</a></td><td><a href="#/journey/${esc(r.cell)}">${esc(r.cell)}</a></td><td style="min-width:150px">${pill[kind(r)]}<br><span class="muted" style="font-size:12.5px">${esc(r.call)}</span></td><td style="min-width:260px">${tgt(r)}</td></tr>`).join('')}
      </tbody></table></div>
      <p class="muted" style="font-size:13px;margin-top:14px">The redirect plan and the reasons behind each call: <a href="#/item/R-BLOG-AUDIT">Blog audit</a> · ownership of each search intent: <a href="#/item/R-SEO-AEO">SEO and AEO gap analysis</a>.</p>`;
  }

  // ---------- case studies: library, whitespace, capture ----------
  const CS = H.cs || { records: [], tax: null, collections: [], targets: [] };
  const TG = (g, id) => CS.tax?.groups[g]?.tags.find((t) => t.id === id)?.label || id;
  let csF = {}; let csKind = 'all'; let csColl = ''; let wsF = { product: '', space: '', install: '' };
  const matchQ = (r, q) => Object.entries(q).every(([g, ids]) => !ids.length || ids.some((id) => (r.tags[g] || []).includes(id)));
  function csList() {
    const coll = CS.collections.find((c) => c.id === csColl);
    return CS.records.filter((r) => (csKind === 'all' || (csKind === 'written' ? r.kind === 'case-study' : r.kind === 'project' && !r.written_as))
      && matchQ(r, csF) && (!coll || matchQ(r, coll.query) || (coll.named || []).includes(r.id))
      && (!searchTerm || [r.title, r.customer, r.location, r.summary].join(' ').toLowerCase().includes(searchTerm)));
  }
  const csTabs = (cur) => `<div class="btns" role="tablist" style="margin:0 0 18px">${[['', 'Library'], ['whitespace', 'Whitespace'], ['capture', 'Capture a project']].map(([k, l]) => `<a class="btn ${cur === k ? 'primary' : ''}" role="tab" aria-selected="${cur === k}" href="#/cases${k ? '/' + k : ''}">${l}</a>`).join('')}</div>`;
  function csCard(r) {
    const img = r.images?.length ? IMG[r.images[0]] : null;
    const chips = ['segment', 'space', 'install', 'product', 'theme'].flatMap((g) => (r.tags[g] || []).map((id) => `<span class="chip">${esc(TG(g, id))}</span>`)).join('');
    const badge = r.kind === 'case-study' ? (r.read === 'search-snippet-only' ? '<span class="chip warn">Search listing only</span>' : '<span class="chip solid">Case study</span>') : r.written_as ? '<span class="chip">Photos of a written study</span>' : '<span class="chip">Photos only, not written up</span>';
    return `<article class="cs-card">${img ? `<button class="cs-img" data-img="${img.id}" aria-label="View photo"><img src="${img.thumb}" alt="${esc(img.alt)}" loading="lazy"></button>` : '<div class="cs-img none">No photo in the library yet</div>'}
      <div class="cs-body"><div class="row gap">${badge}${(r.tags.market || []).map((m) => `<span class="chip">${esc(m)}</span>`).join('')}${r.year ? `<span class="muted" style="font-size:13px">${r.year}</span>` : ''}</div>
      <h3>${r.url ? `<a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.title || r.customer || r.id)}</a>` : esc(r.title || r.id)}</h3>
      <p class="muted" style="font-size:14px;margin:0 0 8px">${esc(r.location || '')}</p><p style="font-size:14px">${esc(r.summary || '')}</p>
      <div class="chips">${chips}</div>
      ${(r.tags.proof || []).length ? `<p class="muted" style="font-size:13px;margin-top:8px">Proof: ${r.tags.proof.map((id) => esc(TG('proof', id))).join(', ')}</p>` : ''}
      ${(r.tags.controls || []).includes('controls-not-stated') && r.kind === 'case-study' ? '<p class="vcount" style="font-size:13px">Controls not stated: add them when this is upgraded</p>' : ''}
      <button class="fb-link" data-fbel="case:${esc(r.id)}" data-fblabel="${esc(r.title || r.id)}">${ic.chat}Feedback on this</button></div></article>`;
  }
  function csLibrary() {
    if (!CS.tax) return '<div class="empty">No case-study data. Run <code>python3 scripts/build_case_studies.py</code>.</div>';
    const list = csList();
    const groupSel = (g) => `<label class="muted" style="font-size:13px">${esc(CS.tax.groups[g].label)} <select data-csf="${g}"><option value="">All</option>${CS.tax.groups[g].tags.filter((t) => CS.records.some((r) => (r.tags[g] || []).includes(t.id))).map((t) => `<option value="${t.id}" ${(csF[g] || [])[0] === t.id ? 'selected' : ''}>${esc(t.label)}</option>`).join('')}</select></label>`;
    const nW = CS.records.filter((r) => r.kind === 'case-study').length, nP = CS.records.filter((r) => r.kind === 'project' && !r.written_as).length;
    return `<div class="ph"><div><span class="label">Case studies</span><h1>Every Bromic project, tagged the way sales sells it</h1><p>${nW} written case studies (US, Australia, Europe, marine) and ${nP} photographed projects never written up, from bromic.com, bromic.com.au and bromic.ca. Tag by segment, space, install, product, controls, theme, market and proof; the collections are the sales deck's.</p></div></div>
      ${csTabs('')}
      <div class="sec-h"><h2>Collections</h2></div><div class="cs-colls">${CS.collections.map((c) => { const n = CS.records.filter((r) => matchQ(r, c.query) || (c.named || []).includes(r.id)).length; const r0 = CS.records.find((r) => ((c.named || []).includes(r.id) || matchQ(r, c.query)) && r.images?.length); const im = r0 && IMG[r0.images[0]];
        return `<button class="cs-coll ${csColl === c.id ? 'on' : ''}" data-cscoll="${c.id}">${im ? `<img src="${im.thumb}" alt="" loading="lazy">` : ''}<span><b>${esc(c.title)}</b><br><i>${esc(c.place)}</i><br><span class="muted">${n} on the sites${(c.deck_only || []).length ? ` · ${c.deck_only.length} deck-only to capture` : ''}</span></span></button>`; }).join('')}</div>
      ${csColl ? (() => { const c = CS.collections.find((x) => x.id === csColl); return (c.deck_only || []).length ? `<div class="callout"><b>${esc(c.title)}: in the sales deck, not on any Bromic site.</b> ${c.deck_only.map((d) => `${esc(d.place)} <a href="#/cases/capture?segment=${esc((c.query.segment || [''])[0])}&market=${esc(d.market)}">Capture it</a>`).join(' · ')}</div>` : ''; })() : ''}
      <div class="toolbar"><span class="muted">${list.length} shown${csColl || Object.values(csF).some((x) => x.length) ? ' · <button class="clear" data-csclear>Clear</button>' : ''}</span>
      <span class="btns"><label class="muted" style="font-size:13px">Show <select data-cskind><option value="all" ${csKind === 'all' ? 'selected' : ''}>All</option><option value="written" ${csKind === 'written' ? 'selected' : ''}>Written case studies</option><option value="photos" ${csKind === 'photos' ? 'selected' : ''}>Photo-only projects</option></select></label>
      ${['segment', 'market', 'space', 'install', 'product', 'theme', 'proof'].map(groupSel).join('')}</span></div>
      <div class="cs-grid">${list.slice(0, 120).map(csCard).join('') || '<div class="empty">Nothing matches. That may be whitespace: <a href="#/cases/whitespace">see the grid</a>.</div>'}</div>${list.length > 120 ? `<p class="muted">Showing 120 of ${list.length}; narrow the filters.</p>` : ''}`;
  }
  function wsCell(seg, mkt) {
    const recs = CS.records.filter((r) => (r.tags.segment || []).includes(seg) && (r.tags.market || []).includes(mkt) && matchQ(r, Object.fromEntries(Object.entries(wsF).filter(([, v]) => v).map(([g, v]) => [g, [v]]))));
    const written = recs.filter((r) => r.kind === 'case-study' && r.read !== 'search-snippet-only');
    const photos = recs.filter((r) => r.kind === 'project' && !r.written_as);
    const target = CS.targets.find((t) => t.segment === seg && t.market === mkt);
    return { written, photos, target, unread: recs.filter((r) => r.read === 'search-snippet-only') };
  }
  function csWhitespace() {
    if (!CS.tax) return '';
    const mk = CS.tax.grid.markets.concat(['MARINE']);
    const segs = CS.tax.groups.segment.tags;
    let covered = 0, total = 0;
    const rows = segs.map((sg) => `<tr><th scope="row">${esc(sg.label)}</th>${mk.map((m) => {
      const marine = sg.id.startsWith('marine'); if (marine !== (m === 'MARINE')) return '<td class="ws na" aria-label="not applicable"></td>';
      const c = wsCell(sg.id, m); total++; if (c.written.length) covered++;
      const cls = c.written.length ? 'w' : c.photos.length ? 'p' : 'e';
      const lab = c.written.length ? `${c.written.length}` : c.photos.length ? `${c.photos.length} ph` : c.target ? (c.target.priority === 'owner' ? 'Priority' : 'Suggested') : '';
      return `<td class="ws ${cls} ${c.target ? 't-' + c.target.priority : ''}"><button data-ws="${sg.id}|${m}" aria-label="${esc(sg.label)}, ${esc(m)}: ${c.written.length} written, ${c.photos.length} photo-only${c.target ? ', ' + c.target.priority + ' target' : ''}">${lab}</button></td>`; }).join('')}</tr>`).join('');
    const fsel = (g) => `<label class="muted" style="font-size:13px">${esc(CS.tax.groups[g].label)} <select data-wsf="${g}"><option value="">Any</option>${CS.tax.groups[g].tags.map((t) => `<option value="${t.id}" ${wsF[g] === t.id ? 'selected' : ''}>${esc(t.label)}</option>`).join('')}</select></label>`;
    const owner = CS.targets.filter((t) => t.priority === 'owner'), sugg = CS.targets.filter((t) => t.priority !== 'owner');
    return `<div class="ph"><div><span class="label">Case-study whitespace</span><h1>What sales can't show a prospect yet</h1><p>${covered} of ${total} segment × market cells have a written case study. Dark: written · mid: photos only, never written up · outlined: priority to fill. Filter by product, space or install to find narrower gaps ("no pergola story in Australia").</p></div>
      <div class="btns"><button class="btn" data-wscsv>${FRAMED ? ic.copy + 'Copy CSV' : ic.down + 'Download CSV'}</button></div></div>
      ${csTabs('whitespace')}
      <div class="toolbar"><span class="muted">Click a cell for what exists or the outreach brief.</span><span class="btns">${fsel('product')}${fsel('space')}${fsel('install')}</span></div>
      <div class="tbl-wrap"><table class="data wsgrid"><thead><tr><th></th>${mk.map((m) => `<th>${esc(m === 'MARINE' ? 'At sea' : m)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div>
      <div id="wsdetail"></div>
      <div class="two"><div><div class="sec-h"><h2>Owner priorities</h2></div><ul class="list">${owner.map((t) => `<li><button class="row linkish" data-ws="${t.segment}|${t.market}"><span class="t" style="font-size:16px">${esc(TG('segment', t.segment))} · ${esc(t.market)}</span><span class="muted">${esc(t.angle)}</span></button></li>`).join('')}</ul></div>
      <div><div class="sec-h"><h2>Suggested next</h2></div><ul class="list">${sugg.map((t) => `<li><button class="row linkish" data-ws="${t.segment}|${t.market}"><span class="t" style="font-size:16px">${esc(TG('segment', t.segment))} · ${esc(t.market)}</span><span class="muted">${esc(t.angle)}</span></button></li>`).join('')}</ul></div></div>`;
  }
  function wsDetail(seg, m) {
    const c = wsCell(seg, m), sg = TG('segment', seg), t = c.target;
    const recLink = (r) => `<li>${r.url ? `<a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.title || r.id)}</a>` : esc(r.title || r.id)} <span class="muted">${esc(r.location || '')}</span></li>`;
    const cap = `#/cases/capture?segment=${encodeURIComponent(seg)}&market=${encodeURIComponent(m)}`;
    return `<section class="card" style="margin-top:18px"><span class="label">${esc(m === 'MARINE' ? 'At sea' : m)}</span><h2 style="margin-top:4px">${esc(sg)}</h2>
      ${c.written.length ? `<p><b>Written case studies</b></p><ul>${c.written.map(recLink).join('')}</ul>` : '<p class="vcount">No written case study.</p>'}
      ${c.photos.length ? `<p><b>Photographed, never written up</b>: the fastest win is to write one of these.</p><ul>${c.photos.map(recLink).join('')}</ul>` : ''}
      ${c.unread.length ? `<p><b>Known from a search listing only</b></p><ul>${c.unread.map(recLink).join('')}</ul>` : ''}
      ${t ? `<div class="callout"><b>${t.priority === 'owner' ? 'Owner priority' : 'Suggested target'}: ${esc(t.angle)}</b><dl class="kv" style="margin-top:10px"><dt>Why</dt><dd>${esc(t.why)}</dd><dt>Who to approach</dt><dd>${esc(t.prospects)}</dd>
        <dt>Lead with</dt><dd>${t.lead_with.map((x) => esc(TG('product', x))).join(', ')}, with ${esc(t.controls)}</dd><dt>Capture</dt><dd>${esc(t.capture)}</dd><dt>Owner</dt><dd>${esc(t.owner)}</dd></dl></div>`
        : (!c.written.length ? `<p class="muted">Not prioritised yet. Add it to <code>data/case-study-targets.json</code> with an owner, or capture a project now.</p>` : '')}
      <div class="btns"><a class="btn primary" href="${cap}">Capture a ${esc(sg.toLowerCase())} project</a></div></section>`;
  }
  function csCSV() {
    const mk = CS.tax.grid.markets.concat(['MARINE']); const lines = [['segment', 'market', 'written', 'photo_only', 'target', 'angle', 'owner'].join(',')];
    for (const sg of CS.tax.groups.segment.tags) for (const m of mk) { if (sg.id.startsWith('marine') !== (m === 'MARINE')) continue; const c = wsCell(sg.id, m);
      lines.push([sg.label, m, c.written.length, c.photos.length, c.target?.priority || '', c.target?.angle || '', c.target?.owner || ''].map((x) => `"${String(x).replace(/"/g, '""')}"`).join(',')); }
    return lines.join('\n');
  }
  function casesPage(sub) {
    const [k, qs] = (location.hash.split('/cases/')[1] || '').split('?');
    if (k === 'whitespace') return csWhitespace();
    if (k === 'capture') return `<div class="ph"><div><span class="label">Case studies</span><h1>Capture a project</h1><p>For sales and marketing on site: the property, the people, products and controls, results, photos and every approval. It saves in your browser until you download the record.</p></div>
      <div class="btns"><a class="btn" href="tools/CS-capture/index.html?${FRAMED ? 'framed=1&' : ''}${qs || ''}" target="_blank" rel="noopener">${ic.ext}Open full page</a></div></div>${csTabs('capture')}
      <iframe class="tool-frame" style="min-height:1400px" src="tools/CS-capture/index.html?embed=1${FRAMED ? '&framed=1' : ''}${qs ? '&' + qs : ''}" title="Case-study capture"></iframe>`;
    return csLibrary();
  }

  // ---------- bromic.com inventory ----------
  let siteF = { kind: '', aud: '', stg: '', issues: '', market: '' };
  const KINDS = { page: 'Page', landing: 'Landing page', product: 'Product', 'case-study': 'Case study', press: 'Press', blog: 'Blog post', podcast: 'Podcast', gallery: 'Gallery photo' };
  function sitePage() {
    const S = H.site || [];
    if (!S.length) return '<div class="empty">No bromic.com inventory yet. Run <code>python3 scripts/merge_site_inventory.py</code>.</div>';
    const words = S.filter((r) => r.kind !== 'gallery');
    const list = words.filter((r) => (!siteF.kind || r.kind === siteF.kind) && (!siteF.aud || r.audience.includes(siteF.aud)) && (!siteF.stg || r.stage.includes(siteF.stg))
      && (!siteF.issues || r.issues.length) && (!siteF.market || r.market === siteF.market) && (!searchTerm || (r.title + ' ' + r.summary + ' ' + r.q + ' ' + r.products.join(' ')).toLowerCase().includes(searchTerm)));
    const cnt = (a, s) => words.filter((r) => r.audience.includes(a) && r.stage.includes(s)).length;
    const max = Math.max(1, ...AK.flatMap((a) => SK.map((s) => cnt(a, s))));
    const kinds = Object.keys(KINDS).filter((k) => S.some((r) => r.kind === k));
    const sel = (k, opts, label, names = {}) => `<label class="muted" style="font-size:13px">${label} <select data-sitef="${k}"><option value="">All</option>${opts.map((o) => `<option value="${esc(o)}" ${siteF[k] === o ? 'selected' : ''}>${esc(names[o] || o)}</option>`).join('')}</select></label>`;
    const nIssues = words.reduce((n, r) => n + r.issues.length, 0);
    return `<div class="ph"><div><span class="label">bromic.com</span><h1>What the live site already says</h1><p>${words.length} pages and ${S.length - words.length} gallery photos read on 29 Oct 2026, summarised in our words, mapped to audience and stage. ${nIssues} issues logged. Figures quoted here are leads to check on the live page, not sources.</p></div></div>
      <div class="two"><div><div class="sec-h"><h2>Coverage by journey cell</h2></div>
      <div class="tbl-wrap"><table class="data heat"><thead><tr><th></th>${SK.map((s) => `<th>${esc(STG[s].name)}</th>`).join('')}</tr></thead><tbody>
      ${AK.map((a) => `<tr><th>${esc(AUD[a].name)}</th>${SK.map((s) => { const n = cnt(a, s); return `<td><button class="cellbtn" data-sitecell="${a}|${s}" style="background:rgba(239,65,35,${(n / max * 0.55).toFixed(2)})">${n}</button></td>`; }).join('')}</tr>`).join('')}
      </tbody></table></div><p class="muted" style="font-size:13px">Pages per cell (a page can sit in several). Pale cells are where bromic.com has least to offer that reader.</p></div>
      <div><div class="sec-h"><h2>By type</h2></div><ul class="list">${kinds.map((k) => `<li><button class="row linkish" data-sitef-kind="${k}"><span class="t" style="font-size:16px">${esc(KINDS[k])}</span><span class="muted">${S.filter((r) => r.kind === k).length}</span></button></li>`).join('')}</ul></div></div>
      <div class="toolbar"><span class="muted">${list.length} of ${words.length} pages${searchTerm ? ` matching “${esc(searchTerm)}”` : ''}</span><span class="btns">${sel('kind', kinds.filter((k) => k !== 'gallery'), 'Type', KINDS)}${sel('market', [...new Set(words.map((r) => r.market).filter(Boolean))].sort(), 'Market')}${sel('aud', AK, 'Audience')}${sel('stg', SK, 'Stage', Object.fromEntries(SK.map((s) => [s, STG[s].name])))}<label class="muted" style="font-size:13px"><input type="checkbox" data-sitef="issues" ${siteF.issues ? 'checked' : ''}> With issues</label></span></div>
      <div class="sitelist">${list.map((r) => `<details class="oq"><summary><span class="chip">${esc(KINDS[r.kind] || r.kind)}</span> <b>${esc(r.title || r.url)}</b>${r.market ? ` <span class="chip">${esc(r.market)}</span>` : ''}${r.read === 'search-snippet-only' ? ' <span class="chip warn">Search listing only</span>' : ''} <span class="muted" style="font-size:13px">${r.audience.join(' ')} · ${r.stage.join(' ')}${r.issues.length ? ` · <span class="vcount">${r.issues.length} issue${r.issues.length > 1 ? 's' : ''}</span>` : ''}</span></summary>
        <p>${esc(r.summary)}</p>${r.q ? `<p class="muted">Answers: “${esc(r.q)}”</p>` : ''}
        <dl class="kv"><dt>URL</dt><dd>${r.url ? `<a href="${esc(r.url)}" target="_blank" rel="noopener">${esc(r.url.replace(/^https:\/\/www\./, ''))}</a>` : 'No URL found'}${r.also && r.also.length ? ` · also on <a href="${esc(r.also[0])}" target="_blank" rel="noopener">bromic.com.au</a>` : ''}</dd>
        ${r.customer ? `<dt>Customer</dt><dd>${esc(r.customer)}${r.location ? ', ' + esc(r.location) : ''}${r.segment ? ' · ' + esc(r.segment) : ''}</dd>` : ''}
        ${r.products.length ? `<dt>Products</dt><dd>${esc(r.products.join(', '))}</dd>` : ''}<dt>Controls named</dt><dd>${r.controls ? 'Yes' : '<span class="vcount">No</span>'}</dd>
        ${r.cta.length ? `<dt>Calls to action</dt><dd>${r.cta.map((c) => esc(c.label)).join(' · ')}${r.gated ? ' (gated)' : ''}</dd>` : ''}
        ${r.downloads.length ? `<dt>Downloads</dt><dd>${esc(r.downloads.join(', '))}</dd>` : ''}${r.people.length ? `<dt>People quoted</dt><dd>${esc(r.people.join('; '))}</dd>` : ''}
        <dt>Images</dt><dd>${r.images}</dd>${r.facts ? `<dt>Spec values</dt><dd>${r.facts} (in data/site-inventory.json)</dd>` : ''}</dl>
        ${r.stats.length ? `<p class="label" style="margin-top:12px">Statistics on the page</p><ul>${r.stats.map((x) => `<li>${esc(x.claim)} <span class="muted">— ${x.source_named ? esc(x.source_named) : '<span class="vcount">no source named</span>'}</span></li>`).join('')}</ul>` : ''}
        ${r.issues.length ? `<p class="label" style="margin-top:12px">Issues</p><ul>${r.issues.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>` : ''}</details>`).join('')}</div>`;
  }

  // ---------- feedback: every element → a GitHub issue that Claude reads, implements and closes ----------
  // The Hub is static, so feedback becomes an issue in the repo, marked "[Feedback]" with a machine-readable block naming the
  // element. CLAUDE.md tells every session to read open feedback first, implement it, commit "Fixes #N" and redeploy.
  const REPO = 'aayuvis/Bromic_Marketing';
  const FB_TYPES = ['Correction', 'Content', 'Design', 'Data or source', 'Idea'];
  let fbIssues = null; let fbLoading = false;
  const fbCtx = () => {
    const h = location.hash.replace(/^#\/?/, '').split('?')[0]; const [p, a] = h.split('/');
    if (p === 'item' && ITEM[a]) return { element: `item:${a}`, label: `${a} · ${ITEM[a].title}` };
    if (p === 'tool') return { element: `tool:${a}`, label: `Tool ${a}` };
    if (p === 'journey' && a) return { element: `cell:${a}`, label: `Journey cell ${a}` };
    if (p === 'assets' && a) return { element: `asset:${a}`, label: `Backlog ${a}` };
    if (p === 'cases') return { element: `cases:${a || 'library'}`, label: `Case studies${a ? ' · ' + a : ''}` };
    return { element: `page:${p || 'home'}`, label: `${(p || 'overview').replace(/^./, (c) => c.toUpperCase())} page` };
  };
  function fbParse(body) { const m = /<!-- bromic-(?:feedback|edit) v1 -->([\s\S]*?)\n---/.exec(body || ''); const o = {}; if (m) for (const l of m[1].split('\n')) { const i = l.indexOf(':'); if (i > 0) o[l.slice(0, i).trim()] = l.slice(i + 1).trim(); } return o; }
  async function fbLoad(force) {
    if (fbLoading || (fbIssues && !force)) return fbIssues;
    try { const c = JSON.parse(sessionStorage.getItem('fb-cache') || 'null'); if (!force && c && Date.now() - c.t < 5 * 60e3) { fbIssues = c.d; return fbIssues; } } catch {}
    fbLoading = true;
    try {
      const r = await fetch(`https://api.github.com/repos/${REPO}/issues?state=all&per_page=100&sort=updated`, { headers: { Accept: 'application/vnd.github+json' } });
      if (!r.ok) throw new Error(r.status);
      fbIssues = (await r.json()).filter((i) => !i.pull_request && /^\[(Feedback|Edit)\]/i.test(i.title)).map((i) => ({ n: i.number, title: i.title, state: i.state, url: i.html_url, at: i.updated_at, comments: i.comments, ...fbParse(i.body) }));
      try { sessionStorage.setItem('fb-cache', JSON.stringify({ t: Date.now(), d: fbIssues })); } catch {}
    } catch { fbIssues = fbIssues || []; fbIssues.failed = true; }
    fbLoading = false; return fbIssues;
  }
  const fbFor = (el) => (fbIssues || []).filter((i) => i.element === el || (el.startsWith('item:') && i.element === el));
  function fbList(list) {
    if (!list.length) return '<p class="muted" style="font-size:13px;margin:0">No feedback yet.</p>';
    return `<ul class="fb-list">${list.map((i) => `<li><span class="chip ${i.state === 'closed' ? 'ok' : 'warn'}">${i.state === 'closed' ? 'Done' : 'Open'}</span> <a href="${esc(i.url)}" target="_blank" rel="noopener">#${i.n} ${esc(i.title.replace(/^\[Feedback\]\s*/i, ''))}</a>${i.section ? `<span class="muted"> · ${esc(i.section)}</span>` : ''}</li>`).join('')}</ul>`;
  }
  function fbOpen(extra = {}) {
    const ctx = { ...fbCtx(), ...extra };
    document.querySelector('.fb-dialog')?.remove();
    const el = document.createElement('div'); el.className = 'fb-dialog'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Give feedback');
    el.innerHTML = `<form class="fb-card"><div class="row" style="justify-content:space-between;align-items:flex-start;gap:12px"><div><span class="label">Feedback</span><h3 style="font-size:20px;margin:4px 0 0">${esc(ctx.label)}</h3>${ctx.section ? `<p class="muted" style="margin:2px 0 0;font-size:13px">Section: ${esc(ctx.section)}</p>` : ''}</div><button type="button" class="x" aria-label="Close">×</button></div>
      ${ctx.quote ? `<blockquote class="fb-quote">${esc(ctx.quote.slice(0, 400))}</blockquote>` : ''}
      <fieldset class="fb-types"><legend class="label">Kind</legend>${FB_TYPES.map((t, i) => `<label><input type="radio" name="fbt" value="${esc(t)}" ${i === (ctx.quote ? 0 : 1) ? 'checked' : ''}> ${esc(t)}</label>`).join('')}</fieldset>
      <label class="label" for="fb-text">What should change</label>
      <textarea id="fb-text" required placeholder="Be specific: what is wrong or missing, and what it should say or do instead."></textarea>
      <label class="label" for="fb-who">Your name (optional)</label><input id="fb-who" type="text" placeholder="So Claude can credit or ask you">
      <div class="btns" style="margin-top:14px"><button class="btn primary" type="submit">${ic.ext}Send via GitHub</button><button class="btn" type="button" data-fbcopy>${ic.copy}Copy instead</button></div>
      <p class="muted" style="font-size:12.5px;margin:10px 0 0">This opens a pre-filled issue on GitHub (sign in once). Claude reads open feedback at the start of every session, makes the change, and closes the issue with the commit. No GitHub account? Copy it and send it to marketing.</p></form>`;
    const body = () => {
      const t = el.querySelector('input[name=fbt]:checked')?.value || 'Content';
      return `<!-- bromic-feedback v1 -->\nelement: ${ctx.element}\n${ctx.section ? `section: ${ctx.section}\n` : ''}type: ${t}\npage: ${location.href}\n${H.commit ? `commit: ${H.commit}\n` : ''}${el.querySelector('#fb-who').value ? `from: ${el.querySelector('#fb-who').value}\n` : ''}---\n\n${ctx.quote ? `> ${ctx.quote.replace(/\n+/g, ' ').slice(0, 600)}\n\n` : ''}${el.querySelector('#fb-text').value}\n`;
    };
    const title = () => `[Feedback] ${ctx.element.replace(/^item:/, '')}${ctx.section ? ' · ' + ctx.section.slice(0, 40) : ''}: ${el.querySelector('#fb-text').value.trim().split(/\s+/).slice(0, 8).join(' ')}`;
    const close = () => { el.remove(); document.removeEventListener('keydown', k); };
    const k = (e) => { if (e.key === 'Escape') close(); };
    el.addEventListener('click', (e) => { if (e.target === el || e.target.classList.contains('x')) close(); if (e.target.closest('[data-fbcopy]')) { if (!el.querySelector('#fb-text').value.trim()) { el.querySelector('#fb-text').focus(); return; } copy(title() + '\n\n' + body(), 'Feedback copied'); } });
    el.querySelector('form').addEventListener('submit', (e) => {
      e.preventDefault(); if (!el.querySelector('#fb-text').value.trim()) return;
      const u = `https://github.com/${REPO}/issues/new?labels=feedback&title=${encodeURIComponent(title())}&body=${encodeURIComponent(body())}`;
      const a = document.createElement('a'); a.href = u; a.target = '_blank'; a.rel = 'noopener'; document.body.appendChild(a); a.click(); a.remove();
      sessionStorage.removeItem('fb-cache'); toast('GitHub opened in a new tab: press "Submit new issue" there'); close();
    });
    document.addEventListener('keydown', k); document.body.appendChild(el); el.querySelector('#fb-text').focus();
  }
  // Section comment buttons on headings, and "Comment on this" for selected text, inside any readable page.
  function fbDecorate() {
    const prose = $('.prose'); if (prose && !prose.dataset.fb && !document.body.classList.contains('ed-editing')) {
      prose.dataset.fb = '1';
      prose.querySelectorAll('h2, h3').forEach((h) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'fb-h'; b.dataset.fbsection = h.textContent.trim(); b.title = 'Comment on this section'; b.setAttribute('aria-label', 'Comment on the section ' + h.textContent.trim()); b.innerHTML = ic.chat; h.appendChild(b); });
    }
    const slot = $('#fb-panel'); if (slot) fbLoad().then((l) => { const c = fbCtx(); slot.innerHTML = l?.failed ? `<p class="muted" style="font-size:13px;margin:0">Feedback could not be loaded. <a href="https://github.com/${REPO}/issues?q=%5BFeedback%5D" target="_blank" rel="noopener">See it on GitHub</a>.</p>` : fbList(fbFor(c.element)); });
    const all = $('#fb-all'); if (all) fbLoad(true).then((l) => { all.innerHTML = l?.failed ? `<p class="muted">Could not reach GitHub just now. <a href="https://github.com/${REPO}/issues?q=%5BFeedback%5D" target="_blank" rel="noopener">Open the feedback list on GitHub</a>.</p>` : `<p class="muted" style="font-size:13px">${l.filter((i) => i.state === 'open').length} open · ${l.filter((i) => i.state === 'closed').length} done</p>${fbList(l)}`; });
  }
  let fbSel = null;
  document.addEventListener('selectionchange', () => {
    clearTimeout(fbSel); fbSel = setTimeout(() => {
      const s = window.getSelection(); const chip = $('#fb-sel');
      const txt = s && String(s).trim(); const inProse = s && s.rangeCount && s.anchorNode && s.anchorNode.parentElement?.closest('.prose, .cs-card, .cell-detail, .tbl-wrap');
      if (!txt || txt.length < 3 || !inProse || document.body.classList.contains('ed-editing')) { if (chip) chip.hidden = true; return; }
      const r = s.getRangeAt(0).getBoundingClientRect(); const c = chip || Object.assign(document.createElement('button'), { id: 'fb-sel', type: 'button', className: 'btn primary fb-sel', innerHTML: ic.chat + 'Comment on this' });
      if (!chip) document.body.appendChild(c);
      c.hidden = false; c.style.top = Math.max(8, window.scrollY + r.top - 44) + 'px'; c.style.left = Math.max(8, Math.min(window.scrollX + r.left, window.scrollX + innerWidth - 190)) + 'px'; c.dataset.quote = txt;
      const h = [...document.querySelectorAll('.prose h2, .prose h3')].filter((x) => x.compareDocumentPosition(s.anchorNode) & Node.DOCUMENT_POSITION_FOLLOWING).pop(); c.dataset.section = h ? h.textContent.trim() : '';
    }, 180);
  });

  // ---------- export ----------
  function exportHTML(it) {
    const faq = it.faq.length ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: it.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) })}<\/script>` : '';
    const art = it.type === 'article' || it.type === 'kb' ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Article', headline: it.title, description: it.meta_description || it.summary, publisher: { '@type': 'Organization', name: 'Bromic Heating' }, dateModified: it.updated })}<\/script>` : '';
    const body = it.html.replace(/src="images\//g, 'src="https://REPLACE-WITH-MEDIA-LIBRARY/');
    const srcs = it.sources.length ? `<h2>Sources</h2><ol>${it.sources.map((s) => `<li id="src-${esc(it.id)}-${esc(s.id)}">${esc(s.publisher)}${s.title ? ', ' + esc(s.title) : ''}${s.year ? ' (' + esc(s.year) + ')' : ''}${/^https?:/.test(s.url || '') ? `. <a href="${esc(s.url)}">${esc(s.url)}</a>` : ''}</li>`).join('')}</ol>` : '';
    return `<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><title>${esc(it.title)}</title><meta name="description" content="${esc(it.meta_description || it.summary)}">\n${art}\n${faq}\n</head><body>\n<!-- ${esc(it.id)} · ${esc(it.status)} · reviewer: ${esc(it.owner_review)} · VERIFY flags: ${it.verifies.length}. Draft — do not publish before sign-off. -->\n<h1>${esc(it.title)}</h1>\n${body}\n${srcs}\n${it.cta ? `<p><a class="bromic-cta" data-asset="${esc(it.cta.asset)}" href="#">${esc(it.cta.label)}</a></p>` : ''}\n</body></html>`;
  }

  // ---------- router ----------
  function route() {
    const h = location.hash.replace(/^#\/?/, '').split('?')[0];
    const [p0, a] = h.split('/');
    const p = p0 === 'home' ? '' : p0;
    const tab = { '': 'home', item: 'library', tool: 'tools' }[p] ?? p;
    document.querySelectorAll('.tabs a').forEach((x) => x.toggleAttribute('aria-current', false) || (x.dataset.tab === tab && x.setAttribute('aria-current', 'page')));
    const html = p === '' ? home() : p === 'library' ? library() : p === 'item' ? item(decodeURIComponent(a || '')) : p === 'journey' ? journey(a) : p === 'assets' ? assets(a)
      : p === 'tools' ? tools() : p === 'tool' ? tool(a) : p === 'images' ? images() : p === 'sources' ? sources() : p === 'review' ? review() : p === 'site' ? sitePage() : p === 'cases' ? casesPage(a) : p === 'blog' ? blogPage() : p === 'downloads' ? downloadsPage() : '<div class="empty">Not found. <a href="#/home">Overview</a></div>';
    view.innerHTML = html;
    const it = p === 'item' && ITEM[a];
    document.title = it ? `${it.title} · Bromic Content Hub` : 'Bromic Content Hub';
    if (p === 'journey' && a) setTimeout(() => $('#cell')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 20);
    else if (p !== 'assets' && !route.keepScroll) window.scrollTo(0, 0);
    route.keepScroll = false;
    setTimeout(fbDecorate, 0);
    if (window.HubEditor) window.HubEditor.bar(it || null);
    regionalise(view);
  }

  // ---------- reviewer editor (editor.js, loaded on demand) ----------
  const currentId = () => { const h = location.hash.replace(/^#\/?/, '').split('?')[0].split('/'); return h[0] === 'item' ? decodeURIComponent(h[1] || '') : ''; };
  function loadEditor() {
    if (window.HubEditor) return Promise.resolve(window.HubEditor);
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = 'editor.js?v=' + encodeURIComponent((H.commit || 'dev') + '-' + Date.parse(H.built).toString(36));
      s.onload = () => { window.HubEditor.init({ H, ITEM, IMG, esc, toast, currentId, rerender: () => { const y = window.scrollY; route.keepScroll = true; route(); window.scrollTo(0, y); } }); res(window.HubEditor); };
      s.onerror = rej; document.head.appendChild(s);
    });
  }
  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-edit-page]')) return;
    const id = currentId();
    loadEditor().then((ED) => ED.start(id)).catch(() => toast('Could not load the editor'));
  });
  try { if (localStorage.getItem('bromic-hub-edits-v1') || localStorage.getItem('bromic-hub-saved-v1')) { const v = JSON.parse(localStorage.getItem('bromic-hub-edits-v1') || '{}'), w = JSON.parse(localStorage.getItem('bromic-hub-saved-v1') || '{}'); if (Object.keys(v).length || Object.keys(w).length) loadEditor().then(() => { route.keepScroll = true; route(); }); } } catch {}

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-href]'); if (b) { route.keepScroll = true; location.hash = b.dataset.href; return; }
    if (e.target.closest('[data-clear]')) { $('#q').value = ''; searchTerm = ''; location.hash = '#/library'; route(); return; }
    const act = e.target.closest('[data-act]');
    if (act) {
      const it = ITEM[act.dataset.id];
      if (act.dataset.act === 'md') copy(it.markdown, 'Markdown copied');
      if (act.dataset.act === 'html') download(`${it.id}-${it.slug || 'export'}.html`, exportHTML(it));
      if (act.dataset.act === 'print' && !FRAMED) window.print();
      return;
    }
    const t = e.target.closest('[data-img]'); if (t) lightbox(t.dataset.img);
    const fb = e.target.closest('[data-fb], [data-fbsection], #fb-sel, [data-fbel]');
    if (fb) { e.preventDefault(); e.stopPropagation(); const extra = {}; if (fb.dataset.fbsection) extra.section = fb.dataset.fbsection; if (fb.id === 'fb-sel') { extra.quote = fb.dataset.quote; if (fb.dataset.section) extra.section = fb.dataset.section; fb.hidden = true; } if (fb.dataset.fbel) { extra.element = fb.dataset.fbel; extra.label = fb.dataset.fblabel || fb.dataset.fbel; } fbOpen(extra); return; }
    const cc = e.target.closest('[data-cscoll]'); if (cc) { csColl = csColl === cc.dataset.cscoll ? '' : cc.dataset.cscoll; route.keepScroll = true; view.innerHTML = casesPage(); return; }
    if (e.target.closest('[data-csclear]')) { csF = {}; csColl = ''; csKind = 'all'; view.innerHTML = casesPage(); return; }
    const wc = e.target.closest('[data-ws]'); if (wc) { const [sg, m] = wc.dataset.ws.split('|'); const d = $('#wsdetail'); if (d) { d.innerHTML = wsDetail(sg, m); d.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } return; }
    if (e.target.closest('[data-wscsv]')) { download('case-study-whitespace.csv', csCSV()); return; }
    const sc = e.target.closest('[data-sitecell]'); if (sc) { const [a, s] = sc.dataset.sitecell.split('|'); siteF = { ...siteF, aud: a, stg: s }; route.keepScroll = true; view.innerHTML = sitePage(); return; }
    const sk = e.target.closest('[data-sitef-kind]'); if (sk) { siteF = { ...siteF, kind: sk.dataset.sitefKind === 'gallery' ? '' : sk.dataset.sitefKind }; if (sk.dataset.sitefKind === 'gallery') { imgFilter.src = 'bromic.com'; location.hash = '#/images'; return; } view.innerHTML = sitePage(); return; }
    const cite = e.target.closest('sup.cite a');
    if (cite) { e.preventDefault(); const el = document.getElementById(cite.getAttribute('href').slice(1)); if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.style.background = 'var(--flame-wash)'; setTimeout(() => (el.style.background = ''), 1600); } }
  });
  document.addEventListener('change', (e) => {
    if (e.target.id === 'sort') { route.keepScroll = true; location.hash = libHref({ ...parseQ(), sort: e.target.value }); }
    if (e.target.dataset.imgf) { imgFilter[e.target.dataset.imgf] = e.target.value; view.innerHTML = images(); }
    if (e.target.dataset.blogf !== undefined) { blogF = e.target.value; view.innerHTML = blogPage(); return; }
    if (e.target.dataset.csf) { const g = e.target.dataset.csf; csF[g] = e.target.value ? [e.target.value] : []; view.innerHTML = casesPage(); return; }
    if (e.target.dataset.cskind !== undefined) { csKind = e.target.value; view.innerHTML = casesPage(); return; }
    if (e.target.dataset.wsf) { wsF[e.target.dataset.wsf] = e.target.value; view.innerHTML = casesPage(); return; }
    if (e.target.dataset.sitef) { const k = e.target.dataset.sitef; siteF[k] = e.target.type === 'checkbox' ? (e.target.checked ? '1' : '') : e.target.value; view.innerHTML = sitePage(); }
  });
  $('#q').addEventListener('input', (e) => {
    searchTerm = e.target.value.trim().toLowerCase();
    const p = location.hash.replace(/^#\/?/, '').split(/[/?]/)[0];
    if (p === 'sources') { view.innerHTML = sources(); return; }
    if (p === 'site') { view.innerHTML = sitePage(); return; }
    if (p === 'cases') { view.innerHTML = casesPage(); return; }
    if (p !== 'library') { location.hash = '#/library'; return; }
    route.keepScroll = true; route();
    $('#q').focus();
  });
  document.addEventListener('keydown', (e) => { if (e.key === '/' && document.activeElement.tagName !== 'INPUT') { e.preventDefault(); $('#q').focus(); } });
  const root = document.documentElement;
  try { const t = localStorage.getItem('bch-theme'); if (t) root.dataset.theme = t; } catch {}
  $('#theme').addEventListener('click', () => {
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('bch-theme', root.dataset.theme); } catch {}
  });
  $('#built').textContent = 'Built ' + new Date(H.built).toLocaleString() + (H.commit ? ' from commit ' + H.commit : '');
  window.addEventListener('hashchange', route);
  document.addEventListener('click', (e) => {
    const r = e.target.closest('[data-region]'); if (r) { setRegion(r.dataset.region); return; }
    const l = e.target.closest('[data-lang]'); if (l) { setRegion(region, l.dataset.lang); return; }
  });
  regionBar(); chromeText();
  loadLang(lang).then(() => { applyLang(); route(); });
})();
