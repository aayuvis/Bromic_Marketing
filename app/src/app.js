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
    lock: '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9"/><path d="M8 11V8a4 4 0 018 0v3"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    copy: '<svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12"/><path d="M16 8V4H4v12h4"/></svg>',
    down: '<svg viewBox="0 0 24 24"><path d="M12 4v12M6 10l6 6 6-6M4 20h16"/></svg>',
    print: '<svg viewBox="0 0 24 24"><path d="M7 9V3h10v6M7 17H4v-8h16v8h-3M7 14h10v7H7z"/></svg>',
    ext: '<svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/></svg>',
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

  function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('on'); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('on'), 1800); }
  async function copy(text, msg) {
    try { await navigator.clipboard.writeText(text); toast(msg); }
    catch { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); toast(msg); }
  }
  function download(name, text, type = 'text/html') {
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 500);
  }

  function card(it) {
    const hero = it.hero || (it.type === 'tool' ? 't-009-025' : '');
    const v = it.verifies.length;
    return `<a class="card" href="#/item/${esc(it.id)}">
      <div class="ph-img">${img(hero)}${isGated(it) ? `<span class="lock">${ic.lock}GATED</span>` : ''}</div>
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
  function home() {
    const gated = H.items.filter(isGated).length;
    const srcs = H.items.flatMap((i) => i.sources);
    const ver = srcs.filter((s) => s.verified).length;
    const verifies = H.items.reduce((n, i) => n + i.verifies.length, 0);
    const p1 = H.assets.filter((a) => a.priority === 'P1');
    const byType = Object.keys(TYPES).map((t) => [t, H.items.filter((i) => i.type === t).length]).filter(([, n]) => n);
    const max = Math.max(1, ...byType.map(([, n]) => n));
    const recent = [...H.items].sort((a, b) => (b.updated || '').localeCompare(a.updated || '') || b.words - a.words).slice(0, 6);
    return `
    <section class="hero">${img('l-022-201', '', false)}
      <div class="hero-in"><span class="flame-rule"></span><span class="label">Content & MQL asset base · FY27</span>
        <h1>Designed from the start, not added later.</h1>
        <p>Only 23% of homeowners prioritise outdoor heating at the planning stage. Every asset here moves heating earlier — into the architect's drawing, the builder's pre-wire and the homeowner's first budget.</p></div>
    </section>
    <div class="stats">
      <div class="stat"><span class="label">Content items</span><b>${H.items.length}</b><span class="sub">${H.items.filter((i) => i.type === 'article').length} anchor articles</span></div>
      <div class="stat"><span class="label">Gated MQL assets</span><b>${gated}</b><span class="sub">guides, kits, tools</span></div>
      <div class="stat"><span class="label">Sources mapped</span><b>${srcs.length}</b><span class="sub">${ver} verified · ${srcs.length - ver} pending</span></div>
      <div class="stat"><span class="label">Open verifications</span><b>${verifies}</b><span class="sub">inline [[VERIFY]] flags</span></div>
      <div class="stat"><span class="label">Image library</span><b>${H.images.length}</b><span class="sub">Bromic-owned</span></div>
    </div>
    <div class="sec-h"><h2>Coverage by audience and lifecycle</h2><a href="#/journey">Open the journey map →</a></div>
    ${matrixGrid()}
    <div class="two" style="margin-top:8px">
      <div><div class="sec-h"><h2>By type</h2><a href="#/library">Library →</a></div>
        <div class="typebars">${byType.map(([t, n]) => `<a class="r" href="#/library?type=${t}"><span>${esc(TYPES[t])}</span><span class="bar"><i class="${GATED_TYPES.includes(t) || t === 'tool' ? 'f' : ''}" style="width:${(n / max) * 100}%"></i></span><span class="muted">${n}</span></a>`).join('')}</div></div>
      <div><div class="sec-h"><h2>Priority 1 backlog</h2><a href="#/assets">All 24 →</a></div>
        <ul class="list">${p1.map((a) => { const n = linked(a.id).length; return `<li><a href="#/assets/${a.id}"><span><span class="label">${a.id}</span><br><span class="t">${esc(a.name)}</span></span><span class="${n ? 'muted' : 'gap'}">${n ? n + ' item' + (n > 1 ? 's' : '') : 'gap'}</span></a></li>`; }).join('')}</ul></div>
    </div>
    <div class="sec-h"><h2>Recently drafted</h2><a href="#/library">Everything →</a></div>
    <div class="grid">${recent.map(card).join('')}</div>`;
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

  function item(id) {
    const it = ITEM[id];
    if (!it) return `<div class="empty">No item “${esc(id)}”. <a href="#/library">Back to the library</a></div>`;
    const cell = CELL[it.cell];
    const cta = it.cta;
    const ctaAsset = cta && ASSET[cta.asset];
    const rel = it.related.map((r) => ITEM[r]).filter(Boolean);
    const md = it.meta_description || '';
    const tool = it.type === 'tool' && H.tools.find((t) => t.startsWith(it.asset || it.id));
    return `<nav class="crumbs"><a href="#/library">Library</a><span>/</span><a href="${libHref({ type: it.type })}">${esc(TYPES[it.type] || it.type)}</a>${it.cell ? `<span>/</span><a href="#/journey/${esc(it.cell)}">${esc(it.cell)}</a>` : ''}</nav>
    ${it.hero ? `<div class="reader-hero">${img(it.hero, '', false)}</div>` : ''}
    <div class="reader"><article>
      <span class="label">${esc(TYPES[it.type] || it.type)} · ${esc(it.id)}${isGated(it) ? ' · Gated' : ''}</span>
      <h1>${esc(it.title)}</h1>
      ${it.summary ? `<p class="dek">${esc(it.summary)}</p>` : ''}
      ${tool ? `<p><a class="btn primary" href="#/tool/${esc(tool)}">${ic.arrow} Open the tool</a></p>` : ''}
      <div class="prose">${it.html}</div>
      ${it.sources.length ? `<hr class="rule"><h2 style="font-size:24px;margin-bottom:6px">Sources</h2><p class="muted" style="margin-top:0;font-size:13px">${it.sources.length} mapped · ${it.sources.length - unverified(it)} verified</p>
      <ol class="srcs">${it.sources.map((s, i) => `<li id="src-${esc(it.id)}-${esc(s.id)}"><span class="n">${i + 1}</span><span><b>${esc(s.publisher || '')}</b>${s.title ? ` — ${esc(s.title)}` : ''}${s.year ? ` (${esc(s.year)})` : ''} ${s.verified ? '<span class="chip ok">Verified</span>' : '<span class="chip warn">Verify</span>'}
        ${s.supports ? `<div class="s-sup">Supports: ${esc(s.supports)}</div>` : ''}${s.url ? `<div><a href="${esc(/^https?:/.test(s.url) ? s.url : '#')}" target="_blank" rel="noopener">${esc(s.url)}</a></div>` : ''}</span></li>`).join('')}</ol>` : ''}
    </article>
    <aside class="side">
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
      ${rel.length ? `<div class="panel"><h4>Related</h4><ul class="list">${rel.map((r) => `<li><a href="#/item/${esc(r.id)}"><span class="t" style="font-size:15px">${esc(r.title)}</span></a></li>`).join('')}</ul></div>` : ''}
      <div class="btns">
        <button class="btn" data-act="md" data-id="${esc(it.id)}">${ic.copy}Copy Markdown</button>
        <button class="btn" data-act="html" data-id="${esc(it.id)}">${ic.down}Export HTML</button>
        <button class="btn" data-act="print">${ic.print}Print / PDF</button>
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
        <td>${its.length ? its.map((i) => `<a href="#/item/${esc(i.id)}">${esc(i.id)}</a>`).join('<br>') : '<span class="gap" style="color:var(--flame-ink)">—</span>'}</td></tr>`;
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
      <div class="btns"><a class="btn" href="tools/${esc(t)}/index.html" target="_blank" rel="noopener">${ic.ext}Open full page</a>${c ? `<a class="btn" href="#/item/${esc(c.id)}">About this tool</a>` : ''}</div></div>
      <iframe class="tool-frame" src="tools/${esc(t)}/index.html?embed=1" title="${esc(c?.title || t)}"></iframe>`;
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
      <div class="btns" style="margin-top:18px"><button class="btn" data-copyid="${esc(i.id)}">${ic.copy}Copy id</button><a class="btn" href="${i.file}" download>${ic.down}Download</a></div></aside>`;
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
      <div class="sec-h"><h2>Open questions</h2></div>
      ${H.openQuestions.map((q, n) => `<details class="oq" ${n === 0 ? 'open' : ''}><summary>${esc(q.name.replace(/-/g, ' '))}</summary>${q.html}</details>`).join('') || '<div class="empty">No open questions logged.</div>'}`;
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
      ${(r.tags.controls || []).includes('controls-not-stated') && r.kind === 'case-study' ? '<p class="vcount" style="font-size:13px">Controls not stated: add them when this is upgraded</p>' : ''}</div></article>`;
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
      <div class="btns"><button class="btn" data-wscsv>${ic.down}Download CSV</button></div></div>
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
      <div class="btns"><a class="btn" href="tools/CS-capture/index.html${qs ? '?' + qs : ''}" target="_blank" rel="noopener">${ic.ext}Open full page</a></div></div>${csTabs('capture')}
      <iframe class="tool-frame" style="min-height:1400px" src="tools/CS-capture/index.html?embed=1${qs ? '&' + qs : ''}" title="Case-study capture"></iframe>`;
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
      : p === 'tools' ? tools() : p === 'tool' ? tool(a) : p === 'images' ? images() : p === 'sources' ? sources() : p === 'review' ? review() : p === 'site' ? sitePage() : p === 'cases' ? casesPage(a) : '<div class="empty">Not found. <a href="#/home">Overview</a></div>';
    view.innerHTML = html;
    const it = p === 'item' && ITEM[a];
    document.title = it ? `${it.title} · Bromic Content Hub` : 'Bromic Content Hub';
    if (p === 'journey' && a) setTimeout(() => $('#cell')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 20);
    else if (p !== 'assets' && !route.keepScroll) window.scrollTo(0, 0);
    route.keepScroll = false;
  }

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-href]'); if (b) { route.keepScroll = true; location.hash = b.dataset.href; return; }
    if (e.target.closest('[data-clear]')) { $('#q').value = ''; searchTerm = ''; location.hash = '#/library'; route(); return; }
    const act = e.target.closest('[data-act]');
    if (act) {
      const it = ITEM[act.dataset.id];
      if (act.dataset.act === 'md') copy(it.markdown, 'Markdown copied');
      if (act.dataset.act === 'html') download(`${it.id}-${it.slug || 'export'}.html`, exportHTML(it));
      if (act.dataset.act === 'print') window.print();
      return;
    }
    const t = e.target.closest('[data-img]'); if (t) lightbox(t.dataset.img);
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
  $('#built').textContent = 'Built ' + new Date(H.built).toLocaleString();
  window.addEventListener('hashchange', route);
  route();
})();
