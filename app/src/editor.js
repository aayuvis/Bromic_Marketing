/* Bromic Content Hub — the reviewer's editor. Loaded on demand by app.js (window.HubEditor).
   A reviewer rewrites any block of a page (as Markdown), retitles it, rewrites its summary, or switches its hero or any
   inline image for one from the library. Changes are kept in this browser until saved, then either
   (a) committed straight to the content file on GitHub with the reviewer's own token (kept only in this browser), or
   (b) sent as a GitHub issue that Claude applies at the start of the next session (CLAUDE.md "Feedback loop").
   Every block maps to exact offsets in the file (it.blocks, built by scripts/build.mjs), so a save rewrites only what changed. */
(() => {
  'use strict';
  let C = null;                       // context from app.js: { H, ITEM, IMG, esc, rerender, toast }
  const KEY = 'bromic-hub-edits-v1', SAVED = 'bromic-hub-saved-v1', TOK = 'bromic-hub-gh', WHO = 'bromic-hub-who';
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k) || sessionStorage.getItem(k) || 'null') ?? d; } catch { return d; } };
  const store = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
  let edits = load(KEY, {});          // { [itemId]: { blocks: {n: md}, hero, title, summary } }
  let saved = load(SAVED, {});        // { [itemId]: { built, sha, edits } } shown until the next deploy
  let editing = '';                   // item id in edit mode
  let openBlock = null;               // block index being edited
  let marked = null;

  const esc = (s) => C.esc(s);
  const E = (id) => edits[id] || null;
  const count = (e) => (e ? Object.keys(e.blocks || {}).length + ['hero', 'title', 'summary'].filter((k) => e[k] != null).length : 0);
  const persist = () => { for (const k of Object.keys(edits)) if (!count(edits[k])) delete edits[k]; store(KEY, edits); };

  function view(it) {                 // the edits a reader of this browser should see: unsaved first, then saved-but-not-live
    const s = saved[it.id], u = edits[it.id];
    if (!s && !u) return null;
    const v = { blocks: { ...(s?.edits.blocks || {}), ...(u?.blocks || {}) } };
    for (const k of ['hero', 'title', 'summary']) v[k] = u?.[k] ?? s?.edits[k] ?? null;
    return v;
  }

  // ---------- rules checked before a save (the same hard rules the build enforces) ----------
  function lint(text) {
    const out = [];
    if (/500 series/i.test(text)) out.push({ hard: true, msg: 'Legacy "500 series" naming is not allowed.' });
    if (/Tungsten (Coastal|Select)/i.test(text) && !/coming soon/i.test(text)) out.push({ hard: true, msg: 'Tungsten Coastal and Select must be labelled "coming soon".' });
    if (/[a-z]!(\s|$)/i.test(text.replace(/!\[/g, ''))) out.push({ hard: false, msg: 'Exclamation mark: the Bromic voice does not use them.' });
    if (/\p{Extended_Pictographic}/u.test(text)) out.push({ hard: false, msg: 'Emoji: the Bromic voice does not use them.' });
    if (/controls?\b[^.]{0,40}\boptional\b|\boptional\b[^.]{0,40}\bcontrols?\b/i.test(text)) out.push({ hard: true, msg: 'Controls are never "optional".' });
    return out;
  }

  // ---------- markdown preview for an edited block ----------
  function needMarked() {
    if (marked) return Promise.resolve(marked);
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = 'vendor/marked.min.js'; s.onload = () => { marked = window.marked; res(marked); }; s.onerror = rej;
      document.head.appendChild(s);
    });
  }
  function md(text, it) {
    if (!marked) return `<div class="ed-raw">${esc(text)}</div>`;
    const srcIx = Object.fromEntries(it.sources.map((s, i) => [s.id, i + 1]));
    let t = text.replace(/\[\[VERIFY:\s*([^\]]+?)\]\]/g, (_, v) => `<mark class="verify">VERIFY: ${esc(v)}</mark>`)
      .replace(/\[\^(\w+)\]/g, (_, id) => srcIx[id] ? `<sup class="cite"><a href="#src-${esc(it.id)}-${esc(id)}">${srcIx[id]}</a></sup>` : '<sup class="cite missing">?</sup>');
    const r = new marked.Renderer();
    r.image = (href, title, alt) => {
      if (String(href).startsWith('img:')) { const id = href.slice(4), im = C.IMG[id];
        return im ? `<figure data-img="${esc(id)}"><img src="${im.file}" alt="${esc(alt || im.alt)}"><figcaption>${esc(alt || im.alt)}</figcaption></figure>` : `<span class="missing">missing image ${esc(id)}</span>`; }
      return `<img src="${esc(href)}" alt="${esc(alt)}">`;
    };
    r.link = (href, title, txt) => String(href).startsWith('item:') ? `<a href="#/item/${esc(href.slice(5))}" class="xref">${txt}</a>` : `<a href="${esc(href)}" target="_blank" rel="noopener">${txt}</a>`;
    r.table = (h, b) => `<div class="table-wrap"><table><thead>${h}</thead><tbody>${b}</tbody></table></div>`;
    return marked.parse(t, { renderer: r, mangle: false, headerIds: false });
  }

  const blockText = (it, n) => it.markdown.slice(it.blocks[n][0], it.blocks[n][1]);

  // ---------- what app.js renders ----------
  function prose(it) {
    const v = view(it), on = editing === it.id && it.blocks;
    if (!v && !on) return it.html;
    const parts = it.html.split(/<!--b:(\d+)-->/);   // ['', n, html, n, html, ...]
    let out = parts[0];
    for (let i = 1; i < parts.length; i += 2) {
      const n = parts[i];
      let html = parts[i + 1];
      const changed = v && v.blocks[n] != null;
      if (changed) html = md(v.blocks[n], it);
      if (on) html = html.replace(/<figure data-img="([\w.-]+)">/g, '<figure data-img="$1"><button type="button" class="ed-swap" data-ed-swap="$1">Switch image</button>');
      if (on && String(openBlock) === n) {
        const cur = changed ? v.blocks[n] : blockText(it, n);
        out += `<div class="ed-b open" data-b="${n}"><textarea class="ed-ta" data-ed-ta="${n}" spellcheck="true">${esc(cur.replace(/\n+$/, ''))}</textarea>
          <div class="ed-tools"><button type="button" class="btn primary" data-ed-done="${n}">Done</button><button type="button" class="btn" data-ed-cancel="${n}">Cancel</button>
          ${changed ? `<button type="button" class="btn" data-ed-revert="${n}">Back to the original</button>` : ''}
          <span class="ed-hint">Markdown: **bold**, [link](url). Keep markers like [^s1] (citations) and ![caption](img:id) (images).</span></div>
          <div class="ed-lint" data-ed-lint="${n}"></div></div>`;
      } else out += on ? `<div class="ed-b${changed ? ' changed' : ''}" data-b="${n}">${html}<button type="button" class="ed-pen" data-ed-open="${n}" aria-label="Edit this block">Edit</button></div>`
        : changed ? `<div class="ed-b changed">${html}</div>` : html;
    }
    return out;
  }
  function heroId(it) { return view(it)?.hero || it.hero; }
  function title(it) { const t = view(it)?.title ?? it.title; return editing === it.id ? `<span class="ed-inline" contenteditable="plaintext-only" data-ed-field="title" spellcheck="true">${esc(t)}</span>` : esc(t); }
  function summary(it) { const t = view(it)?.summary ?? it.summary; return editing === it.id ? `<span class="ed-inline" contenteditable="plaintext-only" data-ed-field="summary" spellcheck="true">${esc(t)}</span>` : esc(t); }
  function heroButton(it) { return editing === it.id ? `<button type="button" class="ed-swap ed-swap-hero" data-ed-swap-hero="1">Switch the main image</button>` : ''; }

  function bar(it) {
    let el = document.getElementById('ed-bar');
    document.body.classList.toggle('ed-editing', !!it && editing === it.id);
    if (!it) { if (el) el.hidden = true; document.body.classList.remove('ed-on'); return; }
    const n = count(edits[it.id]), s = saved[it.id];
    if (!el) { el = document.createElement('div'); el.id = 'ed-bar'; document.body.appendChild(el); }
    if (editing !== it.id && !n && !s) { el.hidden = true; document.body.classList.remove('ed-on'); return; }
    el.hidden = false; document.body.classList.add('ed-on');
    el.innerHTML = `<div class="ed-bar-in">
      <span class="ed-state">${editing === it.id ? '<b>Editing</b>' : ''}${n ? ` ${n} unsaved ${n === 1 ? 'change' : 'changes'}` : editing === it.id ? ' Click any block, the title or summary, or Switch image' : ''}${s ? ` <span class="ed-saved">Saved ${esc(s.how === 'issue' ? 'to Claude' : 'to GitHub')}${s.sha ? ' · ' + esc(s.sha.slice(0, 7)) : ''}: live after the next build</span>` : ''}</span>
      <span class="ed-actions">
        ${n ? '<button type="button" class="btn" data-ed-review>Review</button><button type="button" class="btn" data-ed-discard>Discard</button><button type="button" class="btn primary" data-ed-save>Save</button>' : ''}
        <button type="button" class="btn" data-ed-toggle>${editing === it.id ? 'Stop editing' : 'Edit'}</button>
      </span></div>`;
  }

  // ---------- modal ----------
  function modal(html, wide) {
    close();
    const m = document.createElement('div'); m.className = 'ed-modal'; m.id = 'ed-modal';
    m.innerHTML = `<div class="ed-dlg${wide ? ' wide' : ''}" role="dialog" aria-modal="true">${html}<button type="button" class="ed-x" data-ed-close aria-label="Close">×</button></div>`;
    document.body.appendChild(m);
    setTimeout(() => m.querySelector('input,textarea,button')?.focus(), 30);
    return m;
  }
  function close() { document.getElementById('ed-modal')?.remove(); }

  // image picker: the library, searchable; the current image first
  let pick = null;
  function picker(cur, onPick) {
    pick = { cur, onPick, q: '', n: 48 };
    modal(`<h3>Switch image</h3><p class="muted" style="margin:0 0 10px;font-size:13px">Pick from the Bromic image library (${C.H.images.length}). Show heaters only as they are really installed.</p>
      <input type="search" class="ed-search" data-ed-q placeholder="Search: product, setting, place (e.g. Eclipse rooftop)">
      <div class="ed-grid" id="ed-grid"></div>`, true);
    grid();
  }
  function grid() {
    const words = pick.q.toLowerCase().split(/\s+/).filter(Boolean);
    const hay = (i) => `${i.id} ${i.alt} ${i.product || ''} ${i.setting || ''} ${(i.audiences || []).join(' ')}`.toLowerCase();
    const list = C.H.images.filter((i) => words.every((w) => hay(i).includes(w)));
    const cur = C.IMG[pick.cur];
    const show = [...(cur && !words.length ? [cur] : []), ...list.filter((i) => i.id !== pick.cur)].slice(0, pick.n);
    document.getElementById('ed-grid').innerHTML = show.map((i) => `<button type="button" class="ed-tile${i.id === pick.cur ? ' cur' : ''}" data-ed-pick="${esc(i.id)}" title="${esc(i.alt)}">
        <img src="${i.thumb}" alt="" loading="lazy"><span>${i.id === pick.cur ? '<b>Current</b> · ' : ''}${esc(i.product || i.setting || i.id)}</span></button>`).join('')
      + (list.length > pick.n ? `<button type="button" class="btn" data-ed-more style="grid-column:1/-1">Show more (${list.length - pick.n})</button>` : '')
      + (!show.length ? '<p class="muted">Nothing matches.</p>' : '');
  }

  // ---------- applying edits to a file ----------
  function setFm(text, key, value) {
    const end = text.indexOf('\n---', 4);
    let fm = text.slice(0, end), rest = text.slice(end);
    const line = `${key}: ${JSON.stringify(value)}`;
    const re = new RegExp(`^${key}:.*(\\n[ \\t]+.*)*$`, 'm');
    fm = re.test(fm) ? fm.replace(re, line) : fm.replace(/^title:.*$/m, (t) => `${t}\n${line}`);
    return fm + rest;
  }
  function apply(fresh, it, e) {
    let text = fresh; const problems = [];
    if (e.blocks && Object.keys(e.blocks).length) {
      if (fresh === it.markdown) {
        const ns = Object.keys(e.blocks).map(Number).sort((a, b) => b - a);   // back to front, so offsets hold
        for (const n of ns) { const [a, b] = it.blocks[n]; const tail = it.markdown.slice(a, b).match(/\n*$/)[0]; text = text.slice(0, a) + e.blocks[n].replace(/\n+$/, '') + tail + text.slice(b); }
      } else {                         // the file changed since this build: replace each original block only where it is still unique
        for (const [n, nw] of Object.entries(e.blocks)) {
          const old = blockText(it, n).replace(/\n+$/, '');
          const at = text.indexOf(old);
          if (at < 0 || text.indexOf(old, at + 1) >= 0) { problems.push(`Block ${n} changed in the file since this page was built.`); continue; }
          text = text.slice(0, at) + nw.replace(/\n+$/, '') + text.slice(at + old.length);
        }
      }
    }
    if (e.hero) text = setFm(text, 'hero', e.hero);
    if (e.title != null) text = setFm(text, 'title', e.title);
    if (e.summary != null) text = setFm(text, 'summary', e.summary);
    return { text, problems };
  }

  const b64 = (s) => { const u = new TextEncoder().encode(s); let bin = ''; for (let i = 0; i < u.length; i += 0x8000) bin += String.fromCharCode(...u.subarray(i, i + 0x8000)); return btoa(bin); };
  const unb64 = (s) => new TextDecoder().decode(Uint8Array.from(atob(s.replace(/\n/g, '')), (c) => c.charCodeAt(0)));

  async function commit(it, token, who) {
    const R = C.H.repo, path = it.file.split('/').map(encodeURIComponent).join('/');
    const api = `https://api.github.com/repos/${R.owner}/${R.name}/contents/${path}`;
    const h = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' };
    const g = await fetch(`${api}?ref=${encodeURIComponent(R.branch)}`, { headers: h });
    if (!g.ok) throw new Error(g.status === 401 || g.status === 403 ? 'GitHub did not accept the token (it needs Contents: read and write on this repository).' : `GitHub said ${g.status} reading the file.`);
    const cur = await g.json();
    const { text, problems } = apply(unb64(cur.content), it, edits[it.id]);
    if (problems.length) throw new Error(problems.join(' ') + ' Reload the page and redo that block.');
    const n = count(edits[it.id]);
    const p = await fetch(api, { method: 'PUT', headers: { ...h, 'Content-Type': 'application/json' }, body: JSON.stringify({
      message: `Hub edit: ${it.id}, ${n} ${n === 1 ? 'change' : 'changes'}${who ? ' by ' + who : ''}`, content: b64(text), sha: cur.sha, branch: R.branch }) });
    if (!p.ok) throw new Error(p.status === 409 ? 'Someone saved this file a moment ago. Try again.' : `GitHub said ${p.status} saving the file.`);
    return (await p.json()).commit.sha;
  }

  function issue(it, who) {
    const R = C.H.repo, e = edits[it.id];
    const patch = { file: it.file, base_commit: C.H.commit, edits: Object.entries(e.blocks || {}).map(([n, nw]) => ({ block: +n, old: blockText(it, n).replace(/\n+$/, ''), new: nw })),
      ...(e.hero ? { hero: { old: it.hero, new: e.hero } } : {}), ...(e.title != null ? { title: e.title } : {}), ...(e.summary != null ? { summary: e.summary } : {}) };
    const body = `<!-- bromic-edit v1 -->\nelement: item:${it.id}\ntype: edit\npage: #/item/${it.id}\ncommit: ${C.H.commit}\nby: ${who || ''}\n---\nApply these edits to \`${it.file}\` (Hub editor).\n\n\`\`\`json\n${JSON.stringify(patch, null, 1)}\n\`\`\`\n`;
    const title = `[Edit] ${it.id}: ${count(e)} ${count(e) === 1 ? 'change' : 'changes'}`;
    let url = `https://github.com/${R.owner}/${R.name}/issues/new?title=${encodeURIComponent(title)}&labels=edit&body=${encodeURIComponent(body)}`;
    if (url.length > 7500) {               // too long for a link: copy it, and open the form with a short note
      navigator.clipboard?.writeText(body).catch(() => {});
      url = `https://github.com/${R.owner}/${R.name}/issues/new?title=${encodeURIComponent(title)}&labels=edit&body=${encodeURIComponent('Paste the change (it is on your clipboard) below this line.\n\n')}`;
      C.toast('The change is on your clipboard: paste it into the issue');
    }
    window.open(url, '_blank', 'noopener');
  }

  function reviewHtml(it) {
    const e = edits[it.id]; if (!e) return '<p>No changes.</p>';
    const row = (label, a, b) => `<div class="ed-diff"><span class="label">${esc(label)}</span><div class="ed-old">${esc(a)}</div><div class="ed-new">${esc(b)}</div></div>`;
    return [
      e.title != null ? row('Title', it.title, e.title) : '',
      e.summary != null ? row('Summary', it.summary, e.summary) : '',
      e.hero ? `<div class="ed-diff"><span class="label">Main image</span><div class="ed-imgs">${C.IMG[it.hero] ? `<img src="${C.IMG[it.hero].thumb}" alt="">` : ''}<span>→</span><img src="${C.IMG[e.hero].thumb}" alt=""></div></div>` : '',
      ...Object.entries(e.blocks || {}).map(([n, t]) => row(`Block ${+n + 1}`, blockText(it, n).trim(), t.trim())),
    ].join('');
  }

  function saveDialog(it) {
    const all = [...Object.values(edits[it.id].blocks || {}), edits[it.id].title || '', edits[it.id].summary || ''].join('\n');
    const L = lint(all), hard = L.some((x) => x.hard);
    const tok = load(TOK, null), who = load(WHO, '');
    modal(`<h3>Save ${count(edits[it.id])} ${count(edits[it.id]) === 1 ? 'change' : 'changes'}</h3>
      ${L.length ? `<ul class="ed-lint-list">${L.map((x) => `<li class="${x.hard ? 'hard' : ''}">${esc(x.msg)}</li>`).join('')}</ul>` : ''}
      ${hard ? '<p>Fix the rules above before saving.</p>' : `
      <label class="label" for="ed-who">Your name</label><input id="ed-who" class="ed-input" value="${esc(who)}" placeholder="For the change history">
      <div class="ed-paths">
        <div class="ed-path"><h4>Save to GitHub now</h4>
          <p>Writes the change into <code>${esc(it.file)}</code> on the working branch. The Hub rebuilds itself within a few minutes.</p>
          ${tok ? `<p class="muted" style="font-size:12.5px">Connected with a token saved in this browser. <button type="button" class="linkish" data-ed-forget>Forget it</button></p>`
            : `<label class="label" for="ed-tok">GitHub token</label><input id="ed-tok" class="ed-input" type="password" placeholder="github_pat_…" autocomplete="off">
            <p class="muted" style="font-size:12.5px;margin:6px 0">Create a <a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener">fine-grained token</a>: repository access <b>only ${esc(C.H.repo.owner)}/${esc(C.H.repo.name)}</b>, permission <b>Contents: Read and write</b>. It stays in this browser and is sent only to GitHub.</p>
            <label style="font-size:13px"><input type="checkbox" id="ed-remember" checked> Remember on this device</label>`}
          <button type="button" class="btn primary" data-ed-commit style="margin-top:10px">Save to GitHub</button></div>
        <div class="ed-path"><h4>Or send it to Claude</h4>
          <p>Opens a GitHub issue holding the exact change. Claude applies it, checks it against the content rules, and closes the issue. Needs only a GitHub account.</p>
          <button type="button" class="btn" data-ed-issue>Send to Claude</button></div>
      </div>`}
      <p class="ed-msg" id="ed-msg" role="status"></p>`);
  }

  // ---------- events ----------
  function onClick(ev) {
    const t = ev.target; const it = C.ITEM[C.currentId()];
    if (t.closest('[data-ed-close]') || t.id === 'ed-modal') { close(); return; }
    if (!it) return;
    const q = (a) => t.closest(`[${a}]`);
    let x;
    if (q('data-ed-toggle')) { editing = editing === it.id ? '' : it.id; openBlock = null; if (editing) needMarked().then(() => C.rerender()); C.rerender(); return; }
    if ((x = q('data-ed-open'))) { openBlock = x.dataset.edOpen; C.rerender(); setTimeout(() => { const ta = document.querySelector('.ed-ta'); if (ta) { grow(ta); ta.focus(); } }, 20); return; }
    if ((x = q('data-ed-cancel'))) { openBlock = null; C.rerender(); return; }
    if ((x = q('data-ed-revert'))) { const n = x.dataset.edRevert; if (edits[it.id]) delete edits[it.id].blocks[n]; persist(); openBlock = null; C.rerender(); return; }
    if ((x = q('data-ed-done'))) {
      const n = x.dataset.edDone, val = document.querySelector(`[data-ed-ta="${n}"]`).value;
      const L = lint(val).filter((l) => l.hard);
      if (L.length) { document.querySelector(`[data-ed-lint="${n}"]`).textContent = L.map((l) => l.msg).join(' '); return; }
      const e = (edits[it.id] ||= { blocks: {} }); e.blocks ||= {};
      if (val.replace(/\s+$/, '') === blockText(it, n).replace(/\s+$/, '')) delete e.blocks[n]; else e.blocks[n] = val;
      persist(); openBlock = null; needMarked().then(() => C.rerender()); return;
    }
    if ((x = q('data-ed-swap'))) {
      const old = x.dataset.edSwap, n = x.closest('[data-b]')?.dataset.b;
      picker(old, (nw) => {
        const e = (edits[it.id] ||= { blocks: {} }); e.blocks ||= {};
        const base = e.blocks[n] ?? saved[it.id]?.edits.blocks?.[n] ?? blockText(it, n);
        e.blocks[n] = base.replace(`img:${old}`, `img:${nw}`); persist(); needMarked().then(() => C.rerender());
      }); return;
    }
    if (q('data-ed-swap-hero')) { picker(heroId(it), (nw) => { (edits[it.id] ||= { blocks: {} }).hero = nw === it.hero ? null : nw; persist(); C.rerender(); }); return; }
    if ((x = q('data-ed-pick'))) { const f = pick.onPick; close(); f(x.dataset.edPick); return; }
    if (q('data-ed-more')) { pick.n += 48; grid(); return; }
    if (q('data-ed-discard')) { if (confirm('Discard every unsaved change to this page?')) { delete edits[it.id]; persist(); openBlock = null; C.rerender(); } return; }
    if (q('data-ed-review')) { modal(`<h3>Your changes</h3>${reviewHtml(it)}<p style="margin-top:14px"><button type="button" class="btn primary" data-ed-save>Save</button></p>`, true); return; }
    if (q('data-ed-save')) { saveDialog(it); return; }
    if (q('data-ed-forget')) { localStorage.removeItem(TOK); sessionStorage.removeItem(TOK); saveDialog(it); return; }
    if (q('data-ed-issue')) {
      const who = document.getElementById('ed-who')?.value.trim() || ''; store(WHO, who);
      issue(it, who);
      saved[it.id] = { at: new Date().toISOString(), how: 'issue', edits: edits[it.id] }; store(SAVED, saved);
      delete edits[it.id]; persist(); close(); editing = ''; C.rerender(); C.toast('Sent to Claude as a GitHub issue'); return;
    }
    if (q('data-ed-commit')) {
      const who = document.getElementById('ed-who')?.value.trim() || ''; store(WHO, who);
      let tok = load(TOK, null);
      const inp = document.getElementById('ed-tok');
      if (!tok && inp) { tok = inp.value.trim(); if (!tok) { document.getElementById('ed-msg').textContent = 'Paste a token first, or send the change to Claude.'; return; }
        if (document.getElementById('ed-remember')?.checked) localStorage.setItem(TOK, JSON.stringify(tok)); else sessionStorage.setItem(TOK, JSON.stringify(tok)); }
      const msg = document.getElementById('ed-msg'); msg.textContent = 'Saving to GitHub…';
      t.closest('button').disabled = true;
      commit(it, tok, who).then((sha) => {
        saved[it.id] = { at: new Date().toISOString(), how: 'github', sha, edits: edits[it.id] }; store(SAVED, saved);
        delete edits[it.id]; persist(); close(); editing = ''; C.rerender(); C.toast('Saved to GitHub. Live after the next build.');
      }).catch((e) => { msg.textContent = e.message; t.closest('button').disabled = false; });
      return;
    }
  }
  function grow(ta) { ta.style.height = 'auto'; ta.style.height = Math.min(window.innerHeight * 0.7, ta.scrollHeight + 4) + 'px'; }
  function onInput(ev) {
    const t = ev.target;
    if (t.matches?.('.ed-ta')) { grow(t); const L = lint(t.value); document.querySelector(`[data-ed-lint="${t.dataset.edTa}"]`).innerHTML = L.map((l) => `<span class="${l.hard ? 'hard' : ''}">${esc(l.msg)}</span>`).join(' '); }
    if (t.matches?.('[data-ed-q]')) { pick.q = t.value; pick.n = 48; grid(); }
  }
  function onBlur(ev) {
    const t = ev.target; if (!t.matches?.('[data-ed-field]')) return;
    const it = C.ITEM[C.currentId()]; if (!it) return;
    const k = t.dataset.edField, val = t.textContent.replace(/\s+/g, ' ').trim();
    const e = (edits[it.id] ||= { blocks: {} });
    e[k] = val && val !== it[k] ? val : null;
    persist(); bar(it);
  }
  function onKey(ev) {
    if (ev.key === 'Escape') { if (document.getElementById('ed-modal')) close(); else if (openBlock != null) { openBlock = null; C.rerender(); } }
    if (ev.key === 'Enter' && ev.target.matches?.('[data-ed-field]')) { ev.preventDefault(); ev.target.blur(); }
  }

  window.HubEditor = {
    init(ctx) {
      C = ctx;
      for (const [id, s] of Object.entries(saved)) if (C.H.built > s.at) delete saved[id];  // a newer build is live: it carries the save
      store(SAVED, saved);
      document.addEventListener('click', onClick);
      document.addEventListener('input', onInput);
      document.addEventListener('focusout', onBlur);
      document.addEventListener('keydown', onKey);
      if (Object.keys(edits).length || Object.keys(saved).length) needMarked().then(() => C.rerender());
    },
    start(id) { editing = id; openBlock = null; C.rerender(); needMarked().then(() => C.rerender()); },
    active: (id) => editing === id,
    touched: (id) => !!(edits[id] || saved[id]),
    prose, heroId, heroButton, title, summary, bar,
    lint, apply, // exposed for tests
  };
})();
