// Harvest bromic.com into the repo (needs bromic.com allowed in the session's network settings).
//   node scripts/fetch_bromic.mjs                 # blog + product pages + their images
//   node scripts/fetch_bromic.mjs --pages-only    # text only
//   node scripts/fetch_bromic.mjs --max=400       # cap pages
// Writes: sources/web/<path>.md (title, URL, meta, headings, body text, image list) and sources/web/index.json;
// images → images/inbox/web/<section>/ (then run python3 scripts/ingest_images.py). Polite: 1 request at a time, 400 ms gap.
// It never edits content/ — a human or agent reads sources/web and updates product-facts.json / articles from it.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'sources', 'web');
const IMG = path.join(ROOT, 'images', 'inbox', 'web');
const BASES = (process.env.BROMIC_BASES || 'https://www.bromic.com').split(',');
const MAX = +(process.argv.find((a) => a.startsWith('--max='))?.split('=')[1] || 600);
const PAGES_ONLY = process.argv.includes('--pages-only');
const KEEP = /\/(blog|heating|outdoor-heaters|products?|product-category|electric|gas|portable|controls|affinity|tungsten|platinum|eclipse|cobalt|design-your-space|resources|downloads|commercial|residential|projects|case-stud|inspiration|faq|support)/i;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(OUT, { recursive: true });

async function get(url, binary = false) {
  for (let a = 1; a <= 3; a++) {
    try {
      const r = await fetch(url, { headers: { 'user-agent': 'BromicMarketingContentHub/1.0 (internal)' }, redirect: 'follow' });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return binary ? Buffer.from(await r.arrayBuffer()) : await r.text();
    } catch (e) { if (a === 3) { console.log('  fail', url, e.message); return null; } await sleep(1000 * a); }
  }
}
const locs = (xml) => [...(xml || '').matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, '&'));

async function sitemapUrls(base) {
  const seen = new Set(), pages = new Set();
  const queue = ['/sitemap_index.xml', '/wp-sitemap.xml', '/sitemap.xml', '/page-sitemap.xml', '/post-sitemap.xml', '/product-sitemap.xml'].map((p) => base + p);
  while (queue.length) {
    const u = queue.shift(); if (seen.has(u)) continue; seen.add(u);
    const xml = await get(u); if (!xml) continue;
    for (const l of locs(xml)) { if (/\.xml(\?|$)/.test(l)) queue.push(l); else pages.add(l); }
    await sleep(300);
  }
  return [...pages];
}
const text = (h) => h.replace(/<(script|style|noscript|svg|nav|footer|header|form)[\s\S]*?<\/\1>/gi, ' ')
  .replace(/<br\s*\/?>/gi, '\n').replace(/<\/(p|div|li|h[1-6]|tr|section|article)>/gi, '\n').replace(/<li[^>]*>/gi, '- ')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&#8217;|&rsquo;/g, '’').replace(/&#8211;|&ndash;/g, '–')
  .replace(/&#8212;|&mdash;/g, '—').replace(/&#8220;|&#8221;|&quot;/g, '"').replace(/&#\d+;/g, '').replace(/[ \t]+/g, ' ').replace(/\n\s*\n\s*/g, '\n\n').trim();
const attr = (h, re) => (h.match(re) || [])[1] || '';

async function main() {
  const index = [];
  const imgs = new Map();
  for (const base of BASES) {
    let urls = (await sitemapUrls(base)).filter((u) => u.startsWith(base) && KEEP.test(new URL(u).pathname));
    if (!urls.length) urls = [base + '/blog/', base + '/design-your-space/'];
    urls = [...new Set(urls)].slice(0, MAX);
    console.log(`${base}: ${urls.length} pages`);
    for (const u of urls) {
      const h = await get(u); await sleep(400); if (!h) continue;
      const p = new URL(u).pathname.replace(/\/$/, '') || '/home';
      const main = (h.match(/<(main|article)[\s\S]*?<\/\1>/i) || [h])[0];
      const title = text(attr(h, /<title>([\s\S]*?)<\/title>/i));
      const meta = attr(h, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)/i);
      const date = attr(h, /article:published_time["'][^>]+content=["']([^"']+)/i) || attr(h, /<time[^>]+datetime=["']([^"']+)/i);
      const heads = [...main.matchAll(/<h([1-3])[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => '#'.repeat(+m[1]) + ' ' + text(m[2]));
      const pics = [...new Set([...main.matchAll(/(?:src|data-src|srcset)=["']([^"']+)/gi)].flatMap((m) => m[1].split(',').map((s) => s.trim().split(' ')[0]))
        .filter((s) => /\.(jpe?g|png|webp)(\?|$)/i.test(s) && !/logo|icon|sprite|-\d{2,3}x\d{2,3}\./i.test(s)).map((s) => new URL(s, u).href))];
      const og = attr(h, /property=["']og:image["'][^>]+content=["']([^"']+)/i);
      if (og) pics.unshift(og);
      const section = p.split('/').filter(Boolean)[0] || 'home';
      pics.forEach((s) => imgs.set(s, section));
      const file = path.join(OUT, p.replace(/[^a-z0-9/_-]/gi, '-') + '.md');
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, `---\nurl: ${u}\ntitle: ${JSON.stringify(title)}\nmeta: ${JSON.stringify(meta)}\ndate: ${date}\nfetched: ${new Date().toISOString().slice(0, 10)}\n---\n\n## Headings\n${heads.join('\n')}\n\n## Text\n${text(main)}\n\n## Images\n${pics.map((s) => '- ' + s).join('\n')}\n`);
      index.push({ url: u, path: path.relative(ROOT, file), title, meta, date, section, images: pics.length });
      console.log('  page', p);
    }
  }
  fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(index, null, 1));
  if (PAGES_ONLY) return console.log(`${index.length} pages saved`);
  let n = 0;
  for (const [src, section] of imgs) {
    const name = decodeURIComponent(new URL(src).pathname.split('/').pop()).replace(/[^\w.-]/g, '-');
    const dest = path.join(IMG, section, name);
    if (fs.existsSync(dest)) continue;
    const buf = await get(src, true); await sleep(250); if (!buf || buf.length < 25_000) continue; // skip icons/tiny
    fs.mkdirSync(path.dirname(dest), { recursive: true }); fs.writeFileSync(dest, buf); n++;
  }
  console.log(`${index.length} pages · ${n} images → images/inbox/web/ · next: python3 scripts/ingest_images.py`);
}
main();
