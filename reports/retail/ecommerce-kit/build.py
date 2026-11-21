#!/usr/bin/env python3
"""Build the Bromic e-commerce content kit from src/listings.py.

  python3 reports/retail/ecommerce-kit/build.py            # everything
  python3 reports/retail/ecommerce-kit/build.py --no-pdf   # skip the browser steps (modules, PDF)

Writes listings.json, listings.csv, images/ (main white images, plan thumbnails, enhanced-content modules),
index.html and Bromic-Ecommerce-Content-Kit.pdf next to this file. Fails on a copy rule (length targets, a VERIFY
note, a long dash, an exclamation mark, a price, a competitor name, legacy naming, promo words).
Browser steps use Playwright (NODE_PATH with playwright, Chromium installed).
"""
import csv, html, json, os, re, shutil, subprocess, sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

KIT = Path(__file__).resolve().parent
REPO = KIT.parents[2]
LIB = REPO / "images" / "library"
FONTS = REPO / "app" / "src" / "fonts"
RENDERS = Path(os.environ.get("SERIES_II_RENDERS",
               "/tmp/claude-0/-home-user/0ea6ef7b-27b7-5460-ab43-18d94f10d5f1/scratchpad/pr/full"))
sys.path.insert(0, str(KIT / "src"))
from listings import LISTINGS, SERIES_COMPARISON, WHICH_HEATER  # noqa: E402

IMG = KIT / "images"
MAIN, THUMB, MOD = IMG / "main", IMG / "plan", IMG / "modules"
for d in (MAIN, THUMB, MOD):
    d.mkdir(parents=True, exist_ok=True)

TARGETS = {"short": (45, 60), "medium": (100, 120), "long": (170, 200)}
BULLET_MAX, DESC_WORDS = 250, (150, 250)
BANNED = [r"\[\[VERIFY", "—", "!", r"\$", r"\bInfratech\b", r"\bHeatscope\b", r"\bHeatstrip\b", r"\bSunpak\b",
          r"\bLynx\b", r"\bEurofase\b", r"\bCobalt\b", r"500 series", r"\bbest\b", r"\bunmatched\b", r"\bsale\b",
          r"free shipping", r"#1", r"\bguarantee", r"\bcheapest\b", r"\bdeal\b", r"\bthe only\b"]
TITLE_CHARS = re.compile(r"[~!*$?_{}#<>|;^¬¦®™]")  # marketplace title restrictions; no ® in titles


# ----------------------------------------------------------------------------- checks
def customer_text(L):
    parts = list(L["titles"].values()) + L["bullets"] + [L["description"]]
    parts += [f"{k}: {v}" for k, v in L["specs"]] + L["in_the_box"] + L["required_separately"] + L["optional_accessories"]
    parts += L["keywords"]
    e = L["enhanced"]
    parts += [e["banner"]["headline"], e["banner"]["sub"]] + [f["h"] + " " + f["body"] for f in e["features"]]
    return parts


def check(L):
    errs, stats = [], {}
    for k, (lo, hi) in TARGETS.items():
        n = len(L["titles"][k])
        stats[f"title_{k}_chars"] = n
        if not lo <= n <= hi:
            errs.append(f"title {k} is {n} chars, target {lo}-{hi}")
        if TITLE_CHARS.search(L["titles"][k]):
            errs.append(f"title {k} has a restricted character")
        if not L["titles"][k].startswith("Bromic "):
            errs.append(f"title {k} is not brand-first")
    if len(L["bullets"]) != 5:
        errs.append("needs 5 bullets")
    stats["bullet_chars"] = [len(b) for b in L["bullets"]]
    for b in L["bullets"]:
        if len(b) > BULLET_MAX:
            errs.append(f"bullet over {BULLET_MAX}: {len(b)} '{b[:40]}'")
    w = len(L["description"].split())
    stats["description_words"] = w
    if not DESC_WORDS[0] <= w <= DESC_WORDS[1]:
        errs.append(f"description {w} words")
    for t in customer_text(L):
        for pat in BANNED:
            if re.search(pat, t, flags=re.I if pat.startswith(r"\b") else 0):
                errs.append(f"banned '{pat}' in: {t[:70]}")
    req = " ".join(L["required_separately"]).lower()
    if L["fuel"] != "Controls" and "controll" not in req and "knob" not in req and "controller" not in " ".join(L["in_the_box"]).lower():
        errs.append("no controls in required/in-the-box")
    if L["fuel"] in ("Electric", "Gas") and "licensed" not in req:
        errs.append("no licensed installer line")
    if "Coastal" in L["description"] and L["id"] == "tungsten-electric-series-ii" and "coming soon" not in L["description"].lower():
        errs.append("Select/Coastal must say coming soon")
    return errs, stats


# ----------------------------------------------------------------------------- images
def fit_on_white(rgba, out, size=2000, fill=0.85, quality=92):
    """Trim to the product's bounds and centre it on #FFFFFF with its longest side at `fill` of the frame."""
    a = np.asarray(rgba)[..., 3]
    ys, xs = np.where(a > 8)
    box = (xs.min(), ys.min(), xs.max() + 1, ys.max() + 1)
    im = rgba.crop(box)
    s = size * fill / max(im.size)
    im = im.resize((max(1, round(im.width * s)), max(1, round(im.height * s))), Image.LANCZOS)
    bg = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    bg.alpha_composite(im, ((size - im.width) // 2, (size - im.height) // 2))
    rgb = bg.convert("RGB")
    rgb.save(out, quality=quality, subsampling=0)
    return {"file": str(out.relative_to(KIT)), "fill_longest_side": round(max(im.size) / size, 3),
            "corner_px": rgb.getpixel((0, 0)), "upscale": round(s, 2)}


def from_render(name):
    """Series II CAD render: alpha = heater + caught shadow. Keep the heater, keep only a faint contact shadow."""
    im = Image.open(RENDERS / f"{name}.png").convert("RGBA")
    arr = np.asarray(im).astype(np.float32)
    al = arr[..., 3] / 255.0
    heater = (al > 0.6).astype(np.uint8) * 255
    near = Image.fromarray(heater).filter(ImageFilter.MaxFilter(31)).filter(ImageFilter.GaussianBlur(40))
    prox = np.clip(np.asarray(near).astype(np.float32) / 255.0 * 1.6, 0, 1)
    shadow = al <= 0.6
    al2 = np.where(shadow, al * 0.22 * prox, al)
    arr[..., 3] = al2 * 255
    return Image.fromarray(arr.astype(np.uint8), "RGBA")


def from_white_cutout(lib_id):
    """Library cutout on a near-white ground: make the ground transparent by flood-filling from the edges."""
    im = Image.open(LIB / f"{lib_id}.webp").convert("RGBA")
    if np.asarray(im)[..., 3].min() < 250:  # already has alpha
        bg = Image.new("RGBA", im.size, (255, 255, 255, 255)); bg.alpha_composite(im); im = bg
    rgb = np.asarray(im.convert("RGB")).astype(np.int16)
    near = (rgb.min(axis=2) >= 238).astype(np.uint8) * 255
    m = Image.fromarray(near, "L").convert("RGB")  # floodfill on "L" is a no-op in this Pillow
    w, h = m.size
    for x, y in [(x, 0) for x in range(0, w, 8)] + [(x, h - 1) for x in range(0, w, 8)] + \
                [(0, y) for y in range(0, h, 8)] + [(w - 1, y) for y in range(0, h, 8)]:
        if m.getpixel((x, y))[0] == 255:
            ImageDraw.floodfill(m, (x, y), (128, 0, 0))
    ground = np.asarray(m)[..., 0] == 128
    soft = Image.fromarray((~ground).astype(np.uint8) * 255).filter(ImageFilter.GaussianBlur(0.8))
    out = im.copy(); out.putalpha(soft)
    return out


def from_grey_cutout(lib_id):
    """Dark product on a light grey ground (Eclipse Freestanding): luminance and saturation key."""
    im = Image.open(LIB / f"{lib_id}.webp").convert("RGB")
    a = np.asarray(im).astype(np.float32)
    L = a.mean(2); mx = a.max(2); mn = a.min(2); sat = (mx - mn) / np.maximum(mx, 1)
    alpha = np.maximum(np.clip((185 - L) / 60, 0, 1), np.clip((sat - 0.25) / 0.2, 0, 1))
    m = Image.fromarray((alpha * 255).astype("uint8"))
    hard = m.point(lambda v: 255 if v > 128 else 0).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.MinFilter(5))
    al = np.minimum(alpha * 255, np.asarray(hard.filter(ImageFilter.MaxFilter(5))))
    out = im.convert("RGBA"); out.putalpha(Image.fromarray(al.astype("uint8")))
    return out


MAIN_JOBS = {
    # file name: (kind, source, note)
    "tungsten-series-ii-select-black-main.jpg": ("render", "select-black-hero", "Series II CAD render (Select, black)"),
    "tungsten-series-ii-select-white.jpg": ("render", "select-white-hero", "Series II CAD render (Select, white)"),
    "tungsten-series-ii-select-graphite.jpg": ("render", "select-graphite-hero", "Series II CAD render (Select, graphite)"),
    "tungsten-series-ii-coastal-white.jpg": ("render", "coastal-white-hero", "Series II CAD render (Coastal, white)"),
    "tungsten-series-ii-select-black-front.jpg": ("render", "select-black-front", "Series II CAD render (Select, black, front)"),
    "platinum-electric-black-main.jpg": ("white", "w-platinum-black", "bromic.com cutout, 1024 px source"),
    "platinum-electric-white.jpg": ("white", "w-platinum-white", "bromic.com cutout, 1024 px source"),
    "eclipse-electric-main.jpg": ("white", "w-eclipse-electric", "bromic.com cutout, 1024 px source, 24 in twin pole (included)"),
    "eclipse-freestanding-main.jpg": ("grey", "w-eclipse-portable", "cut from a grey-ground bromic.com shot, 1200 px source; replace with a white-ground original"),
    "platinum-gas-main.jpg": ("white", "w-platinum-gas-500", "bromic.com cutout, 1024 px source, wall bracket (included)"),
    "tungsten-gas-main.jpg": ("white", "w-tungsten-gas-500", "bromic.com cutout, 1024 px source"),
    "tungsten-freestanding-gas-main.jpg": ("white", "w-tung-port", "bromic.com cutout, 1600 px source"),
    "tungsten-freestanding-gas-front.jpg": ("white", "w-tungportfront-1", "bromic.com cutout, 1024 px source"),
    "affinity-wall-switch.jpg": ("white", "w-manual-1ch-indoor-switch-image", "bromic.com cutout, 1080 px source"),
    "affinity-expansion-board.jpg": ("white", "w-expansion-board", "bromic.com cutout, 1600 px source"),
}


def build_main_images():
    report = {}
    for fn, (kind, src, note) in MAIN_JOBS.items():
        out = MAIN / fn
        if kind == "render":
            if not (RENDERS / f"{src}.png").exists():
                if out.exists():
                    report[fn] = {"file": str(out.relative_to(KIT)), "note": note + " (kept; render source not found)"}
                    continue
                raise SystemExit(f"missing render {src}")
            rgba = from_render(src)
        elif kind == "white":
            rgba = from_white_cutout(src)
        else:
            rgba = from_grey_cutout(src)
        r = fit_on_white(rgba, out)
        r.update(source=src, note=note)
        if r["corner_px"] != (255, 255, 255):
            raise SystemExit(f"{fn}: corner is not #FFFFFF")
        report[fn] = r
        Image.open(out).resize((600, 600), Image.LANCZOS).save(THUMB / ("main-" + fn), quality=85)
    return report


def plan_thumbs():
    ids = set()
    for L in LISTINGS:
        for p in L["images"]["plan"]:
            if p["library_id"]:
                ids.add(p["library_id"])
        ids.add(L["enhanced"]["banner"]["library_id"])
    for i in sorted(ids):
        src = LIB / f"{i}.webp"
        if not src.exists():
            raise SystemExit(f"missing library image {i}")
        im = Image.open(src).convert("RGB"); im.thumbnail((640, 640))
        im.save(THUMB / f"{i}.jpg", quality=82)
    for i in ("t2-select-black", "t2-low-clearance-recess", "t2-single-post-black", "l-005-020", "l-013-100",
              "w-platinum-black", "w-eclipse-electric", "w-platinum-gas-500", "w-tungsten-gas-500", "w-tung-port",
              "l-019-164", "l-016-134", "l-010-073", "l-006-028", "w-bromic-platinum-electric", "w-tungsten-gas-fayetteville-ny-restaurant"):
        im = Image.open(LIB / f"{i}.webp").convert("RGB"); im.thumbnail((1600, 1600))
        im.save(THUMB / f"{i}-lg.jpg", quality=86)


# ----------------------------------------------------------------------------- modules (HTML → PNG)
FONT_CSS = f"""
@font-face {{ font-family: 'Bromic Didot'; src: url('{(FONTS / "gfs-didot-latin.woff2").as_uri()}') format('woff2'); }}
@font-face {{ font-family: 'Arimo'; src: url('{(FONTS / "arimo-latin.woff2").as_uri()}') format('woff2'); }}
* {{ box-sizing: border-box; margin: 0; padding: 0; }}
body {{ background: #fff; color: #231F20; font-family: Arimo, 'Helvetica Neue', Arial, sans-serif; font-weight: 300; }}
.lab {{ font: 600 11px/1 Arimo, sans-serif; letter-spacing: .22em; text-transform: uppercase; color: #EF4123; }}
h1, h2, h3 {{ font-family: 'Bromic Didot', Didot, 'Bodoni 72', serif; font-weight: 400; }}
.rule {{ width: 36px; height: 2px; background: #EF4123; }}
"""


def thumb(i, lg=True):
    return (THUMB / f"{i}{'-lg' if lg else ''}.jpg").as_uri()


def module_pages():
    S = next(L for L in LISTINGS if L["id"] == "tungsten-electric-series-ii")
    main_uri = (MAIN / "tungsten-series-ii-select-black-front.jpg").as_uri()
    graph_uri = (MAIN / "tungsten-series-ii-select-graphite.jpg").as_uri()
    pages = {}
    # 1. Banner 1464 x 600
    pages["module-1-banner-1464x600.png"] = (1464, 600, f"""
<div style="display:grid;grid-template-columns:1000px 464px;height:600px">
  <div style="background:url('{thumb('l-006-028')}') center/cover"></div>
  <div style="padding:64px 52px;display:flex;flex-direction:column;justify-content:center;gap:22px">
    <div class="lab">Tungsten Smart-Heat® Electric Series II</div>
    <h1 style="font-size:54px;line-height:1.05">{html.escape(S['enhanced']['banner']['headline'])}</h1>
    <div class="rule"></div>
    <p style="font-size:19px;line-height:1.5">{html.escape(S['enhanced']['banner']['sub'])}</p>
    <p style="font-size:13px;line-height:1.5;color:#6d6e71">Select and Coastal coming soon. Controls sold separately. Installation by a licensed electrician.</p>
  </div>
</div>""")
    # 2. Three-feature row 970 x 600
    feats = S["enhanced"]["features"]
    imgs = [main_uri, thumb("t2-low-clearance-recess"), graph_uri]
    cols = "".join(f"""
  <div style="display:flex;flex-direction:column;gap:14px">
    <div style="height:250px;background:#fff url('{im}') center/{'contain' if k != 1 else 'cover'} no-repeat;border-bottom:1px solid #e3e3e3"></div>
    <div class="lab">0{k+1}</div>
    <h3 style="font-size:27px;line-height:1.1">{html.escape(f['h'])}</h3>
    <p style="font-size:15px;line-height:1.5">{html.escape(f['body'])}</p>
  </div>""" for k, (f, im) in enumerate(zip(feats, imgs)))
    pages["module-2-three-features-970x600.png"] = (970, 600, f"""
<div style="padding:40px 44px;height:600px">
  <div class="lab" style="margin-bottom:10px">Designed To Fit. Built To Perform.</div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:30px">{cols}</div>
</div>""")
    # 3. Comparison of series 970 x 600
    heads = SERIES_COMPARISON["head"][1:]
    pics = [main_uri, thumb("w-platinum-black"), thumb("w-eclipse-electric"), thumb("w-platinum-gas-500"), thumb("w-tungsten-gas-500")]
    th = "".join(f"<th><div style=\"height:86px;background:url('{p}') center/contain no-repeat;margin-bottom:8px\"></div>{html.escape(h)}</th>" for h, p in zip(heads, pics))
    rows = "".join("<tr><td class=k>" + html.escape(r[0]) + "</td>" + "".join(f"<td>{html.escape(c)}</td>" for c in r[1:]) + "</tr>" for r in SERIES_COMPARISON["rows"])
    pages["module-3-compare-series-970x600.png"] = (970, 600, f"""
<style>table{{border-collapse:collapse;width:100%;table-layout:fixed}} th{{font:400 17px/1.15 'Bromic Didot',serif;text-align:left;padding:0 8px 10px;vertical-align:bottom;border-bottom:1.5px solid #231F20}}
th:first-child{{width:96px}} td{{font-size:13px;line-height:1.35;padding:9px 8px;border-bottom:1px solid #e3e3e3;vertical-align:top}} td.k{{font:600 10px/1.3 Arimo;letter-spacing:.16em;text-transform:uppercase;color:#EF4123}}</style>
<div style="padding:34px 40px;height:600px">
  <div class="lab" style="margin-bottom:8px">The Bromic Range</div>
  <h2 style="font-size:32px;margin-bottom:14px">Find Your Heater</h2>
  <table><tr><th></th>{th}</tr>{rows}</table>
  <p style="font-size:11px;color:#6d6e71;margin-top:10px">Every heater is paired with Affinity Smart-Heat® Controls, sold separately. Heat areas are Bromic published figures.</p>
</div>""")
    # 4. Which heater for your space 1464 x 600
    tiles = "".join(f"""
  <div style="display:grid;grid-template-rows:170px auto;border:1px solid #e3e3e3">
    <div style="background:url('{thumb(i)}') center/cover"></div>
    <div style="padding:14px 16px">
      <h3 style="font-size:21px;line-height:1.1;margin-bottom:8px">{html.escape(sp)}</h3>
      <p style="font-size:13px;line-height:1.4"><span class=lab style="font-size:9px">Electric</span><br>{html.escape(el)}</p>
      <p style="font-size:13px;line-height:1.4;margin-top:6px"><span class=lab style="font-size:9px">Gas</span><br>{html.escape(gas)}</p>
    </div>
  </div>""" for (sp, el, gas), i in zip(WHICH_HEATER, ["w-tungsten-gas-fayetteville-ny-restaurant", "w-bromic-platinum-electric", "l-005-020", "l-010-073", "l-013-100", "l-016-134"]))
    pages["module-4-which-heater-1464x600.png"] = (1464, 600, f"""
<div style="padding:30px 40px;height:600px;display:grid;grid-template-columns:230px 1fr;gap:30px">
  <div style="display:flex;flex-direction:column;justify-content:center;gap:18px">
    <div class="lab">Plan Your Space</div>
    <h2 style="font-size:38px;line-height:1.08">Which Heater For Your Space</h2>
    <div class="rule"></div>
    <p style="font-size:14px;line-height:1.5">Not sure? Send us photos or plans and our complimentary design service will suggest heaters, placement and controls.</p>
  </div>
  <div style="display:grid;grid-template-columns:repeat(6,1fr);gap:12px;align-content:center">{tiles}</div>
</div>""")
    return pages


def run_playwright(script):
    env = dict(os.environ)
    env.setdefault("NODE_PATH", "/opt/node-tools/node_modules")
    env.setdefault("PLAYWRIGHT_BROWSERS_PATH", "/opt/pw-browsers")
    p = subprocess.run(["node", "-e", script], env=env, capture_output=True, text=True)
    if p.returncode:
        raise SystemExit(p.stderr[-3000:])
    return p.stdout


def render_modules():
    tmp = KIT / "src" / "_modules"
    tmp.mkdir(exist_ok=True)
    jobs = []
    for fn, (w, h, body) in module_pages().items():
        f = tmp / (fn + ".html")
        f.write_text(f"<!doctype html><meta charset=utf-8><style>{FONT_CSS} body{{width:{w}px;height:{h}px;overflow:hidden}}</style>{body}")
        jobs.append({"html": f.as_uri(), "out": str(MOD / fn), "w": w, "h": h})
    run_playwright(f"""
const {{ chromium }} = require('playwright');
(async () => {{
  const b = await chromium.launch(); const p = await b.newPage();
  for (const j of {json.dumps(jobs)}) {{
    await p.setViewportSize({{ width: j.w, height: j.h }});
    await p.goto(j.html); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(150);
    await p.screenshot({{ path: j.out, clip: {{ x: 0, y: 0, width: j.w, height: j.h }} }});
  }}
  await b.close();
}})();""")
    shutil.rmtree(tmp)
    for j in jobs:
        im = Image.open(j["out"]).convert("RGB")
        assert im.size == (j["w"], j["h"]), j
        im.save(THUMB / ("mod-" + Path(j["out"]).stem + ".jpg"), quality=84)
    return [str(Path(j["out"]).relative_to(KIT)) for j in jobs]


# ----------------------------------------------------------------------------- outputs
def write_json(stats, images, modules):
    out = {
        "_readme": "Bromic e-commerce content kit for online retail partners. Built by build.py from src/listings.py. Customer-facing "
                   "fields carry no [[VERIFY]] notes; open facts are in each listing's `verify`. No prices. Draft until the Product team "
                   "signs off (every source fact is verified: false in data/product-facts.json).",
        "status": "draft",
        "updated": "2026-11-21",
        "listings": [], "shared": {"series_comparison": SERIES_COMPARISON, "which_heater": {"head": ["Your space", "Electric", "Gas"], "rows": WHICH_HEATER}},
        "main_images": images, "modules": modules,
    }
    for L in LISTINGS:
        d = dict(L); d["checks"] = stats[L["id"]]
        out["listings"].append(d)
    (KIT / "listings.json").write_text(json.dumps(out, indent=1, ensure_ascii=False) + "\n")


def write_csv():
    cols = ["listing_id", "variant", "sku", "brand", "collection", "product_name", "availability", "title_short", "title_medium",
            "title_long", "bullet_1", "bullet_2", "bullet_3", "bullet_4", "bullet_5", "description", "specifications",
            "in_the_box", "required_sold_separately", "optional_accessories", "search_terms", "main_image", "additional_images"]
    with open(KIT / "listings.csv", "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(cols)
        for L in LISTINGS:
            extra = [p["library_id"] for p in L["images"]["plan"] if p["library_id"]]
            for v in L["variants"]:
                w.writerow([L["id"], v["name"], v.get("sku") or "", "Bromic Heating", L["collection"].title(), L["product_name"],
                            L["availability"], L["titles"]["short"], L["titles"]["medium"], L["titles"]["long"], *L["bullets"],
                            L["description"], " | ".join(f"{k}: {val}" for k, val in L["specs"]), " | ".join(L["in_the_box"]),
                            " | ".join(L["required_separately"]), " | ".join(L["optional_accessories"]), "; ".join(L["keywords"]),
                            L["images"]["main"] or "", " | ".join(L["images"]["alternates_white"] + [f"library:{i}" for i in extra])])


def e(s):
    return html.escape(str(s))


def write_html(stats, modules):
    css = (KIT / "src" / "kit.css").read_text()
    toc = "".join(f"<li><a href='#{L['id']}'>{e(L['product_name'])}</a></li>" for L in LISTINGS)
    secs = []
    for n, L in enumerate(LISTINGS, 1):
        st = stats[L["id"]]
        main = L["images"]["main"]
        main_html = (f"<img class=main src='images/plan/main-{Path(main).name}' alt='{e(L['product_name'])} on white'>" if main
                     else "<div class='main missing'>Main image to supply<br><small>see open items</small></div>")
        alts = "".join(f"<img src='images/plan/main-{Path(a).name}' alt=''>" for a in L["images"]["alternates_white"])
        titles = "".join(f"<tr><th>{k.title()}</th><td>{e(t)}</td><td class=n>{len(t)} / {TARGETS[k][1]}</td></tr>" for k, t in L["titles"].items())
        bullets = "".join(f"<li>{e(b)} <span class=n>{len(b)}</span></li>" for b in L["bullets"])
        desc = "".join(f"<p>{e(p)}</p>" for p in L["description"].split("\n\n"))
        specs = "".join(f"<tr><th>{e(k)}</th><td>{e(v)}</td></tr>" for k, v in L["specs"])
        var_keys = [k for k in ("name", "sku", "outputs", "supply", "finishes", "front", "coverage", "weight", "status") if any(k in v for v in L["variants"])]
        var = "<table class=var><tr>" + "".join(f"<th>{k.title() if k != 'sku' else 'SKU'}</th>" for k in var_keys) + "</tr>" + "".join(
            "<tr>" + "".join(f"<td>{e(v.get(k) or ('To confirm' if k == 'sku' else ''))}</td>" for k in var_keys) + "</tr>" for v in L["variants"]) + "</table>"
        plan = "".join(
            f"<div class=slot>{('<img src=images/plan/' + p['library_id'] + '.jpg alt=\"\">') if p['library_id'] else '<div class=ph>To create</div>'}"
            f"<b>{e(p['slot'])}</b><span>{e(p['brief'])}</span><code>{e(p['library_id'] or '')}</code></div>" for p in L["images"]["plan"])
        ban = L["enhanced"]["banner"]
        feats = "".join(f"<div><b>{e(f['h'])}</b><span>{e(f['body'])}</span></div>" for f in L["enhanced"]["features"])
        lst = lambda xs: "".join(f"<li>{e(x)}</li>" for x in xs) or "<li>–</li>"
        verify = "".join(f"<li>{e(v)}</li>" for v in L["verify"])
        secs.append(f"""
<section class=listing id='{L['id']}'>
  <div class=lhead><span class=lab>{n:02d} · {e(L['collection'])} · {e(L['fuel'])}</span><h2>{e(L['product_name'])}</h2>
  <p class=avail>{e(L['availability'])} · {'Model-level SKUs' if L['level'] == 'model' else 'Series level – SKUs to confirm'}</p></div>
  <div class=grid>
    <div class=imgcol>{main_html}<div class=alts>{alts}</div></div>
    <div>
      <h3>Titles</h3><table class=titles>{titles}</table>
      <h3>Feature Bullets</h3><ol class=bul>{bullets}</ol>
    </div>
  </div>
  <h3>Description <span class=n>{st['description_words']} words</span></h3><div class=desc>{desc}</div>
  <div class=two>
    <div><h3>Specifications</h3><table class=spec>{specs}</table></div>
    <div><h3>Variants</h3>{var}
      <h3>In The Box</h3><ul>{lst(L['in_the_box'])}</ul>
      <h3>Required, Sold Separately</h3><ul class=req>{lst(L['required_separately'])}</ul>
      <h3>Optional Accessories</h3><ul>{lst(L['optional_accessories'])}</ul>
      <h3>Search Terms</h3><p class=kw>{e('; '.join(L['keywords']))}</p>
    </div>
  </div>
  <h3>Image Plan</h3><div class=plan>{plan}</div>
  <h3>Enhanced Content</h3>
  <div class=enh><div class=banner style="background-image:url('images/plan/{ban['library_id']}.jpg')"><div><span class=lab>Banner</span><b>{e(ban['headline'])}</b><span>{e(ban['sub'])}</span></div></div>
  <div class=feats>{feats}</div><p class=small>Plus the shared modules: comparison of series and which heater for your space.</p></div>
  <details class=open-items><summary>Open items for this listing ({len(L['verify'])})</summary><ul>{verify}</ul><p class=small>Sources: {e('; '.join(L['sources']))}</p></details>
</section>""")
    mods = "".join(f"<figure><img src='{m}' alt=''><figcaption>{e(Path(m).name)}</figcaption></figure>" for m in modules)
    page = f"""<!doctype html><html lang=en><head><meta charset=utf-8><meta name=viewport content="width=device-width,initial-scale=1">
<meta name=robots content=noindex><title>Bromic E-Commerce Content Kit</title><style>{css}</style></head><body>
<header class=cover><img src='images/plan/l-006-028.jpg' alt=''><div><span class=lab>Bromic Heating · For Online Retail Partners</span>
<h1>E-Commerce Content Kit</h1><p>Titles, bullets, descriptions, specifications, image plans and enhanced content for every current Bromic series. Draft for Product team sign-off · 21 November 2026.</p></div></header>
<main>
<section class=intro>
 <h2>How To Use This Kit</h2>
 <ul>
  <li><b>Titles</b> come in three lengths – about 60, 120 and 200 characters – brand first. Use the longest your marketplace allows; titles carry no ® or promotional words.</li>
  <li><b>Controls are never optional.</b> Every heater listing names its Affinity Smart-Heat® Controls under “Required, sold separately”. Wi-Fi and app features need compatible Affinity Smart-Heat® Controls, sold separately.</li>
  <li><b>Installation</b> by a licensed electrician or gas fitter to local code, on every listing.</li>
  <li><b>No prices.</b> Price lists and SKU confirmations come from Sales operations.</li>
  <li><b>Main images</b> are on pure white (#FFFFFF), 2000 × 2000 px, the product filling about 85% of the frame. Secondary images come from the Bromic image library by id.</li>
  <li><b>Search terms</b> are directional suggestions, never claims.</li>
  <li>Import file: <code>listings.csv</code> (one row per variant). Full data: <code>listings.json</code>.</li>
 </ul>
 <ol class=toc>{toc}</ol>
</section>
{''.join(secs)}
<section class=modules id=modules><h2>Enhanced Content Modules</h2><p>Rendered samples at A+ sizes (970 × 600 and 1464 × 600 px) in the Bromic look.</p>{mods}</section>
<section class=intro><h2>Retailer Requirements We Followed</h2>
<ul class=small>
<li>Main image on pure white RGB 255, 255, 255, product about 85% of the frame, no added text, at least 1,000 px on the long side, 2,000 px for zoom – seller guides summarising Amazon policy (junglescout.com/resources/articles/amazon-image-requirements; sellerlabs.com/blog/amazon-product-image-requirements-2026) and Amazon's clothing image guideline (sellercentral.amazon.com/gp/help/external/G200498950). Walmart also asks for square images on a seamless white ground (marketplacelearn.walmart.com, product detail page image guidelines).</li>
<li>Titles at most 200 characters including spaces, brand first, no promotional claims or restricted characters (sellercentral.amazon.com/gp/help/external/GYTR6SYGFA5E3EQC). Some categories cap lower; one source reports a 75-character limit from July 2026, unconfirmed on Amazon's pages – use the medium or short title where a cap applies.</li>
<li>Bullets: up to 500 characters for sellers, 255 for vendors, with 150–250 recommended; Rona caps bullets at 200 (amalytix.com/en/knowledge/seo/amazon-bullet-points; vendors.rona.ca online product content guideline). Ours stay under 250 – trim to 200 for Rona.</li>
<li>A+ modules: 970 × 600 standard header, 1464 × 600 Premium A+ (junglescout.com/resources/articles/amazon-a-plus-content; Syndigo Amazon A+ guide).</li>
<li>Home Depot and Lowe's publish their item-setup rules only inside their supplier portals; confirm limits there before submission.</li>
</ul></section>
</main><footer>Bromic Heating · bromic.com · Draft – facts pending Product team sign-off · No prices</footer></body></html>"""
    (KIT / "index.html").write_text(page)


def write_pdf():
    out = KIT / "Bromic-Ecommerce-Content-Kit.pdf"
    run_playwright(f"""
const {{ chromium }} = require('playwright');
(async () => {{
  const b = await chromium.launch(); const p = await b.newPage();
  await p.goto({json.dumps((KIT / 'index.html').as_uri())}); await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => document.querySelectorAll('details').forEach(d => d.open = true));
  await p.pdf({{ path: {json.dumps(str(out))}, format: 'Letter', printBackground: true,
    margin: {{ top: '0.5in', bottom: '0.55in', left: '0.5in', right: '0.5in' }}, displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate: '<div style="font:7px Arial;color:#6d6e71;width:100%;padding:0 0.5in;display:flex;justify-content:space-between"><span>Bromic E-Commerce Content Kit · Draft · No prices</span><span class=pageNumber></span></div>' }});
  await b.close();
}})();""")
    return out


def main():
    no_browser = "--no-pdf" in sys.argv
    stats, failed = {}, False
    for L in LISTINGS:
        errs, st = check(L)
        stats[L["id"]] = st
        if errs:
            failed = True
            print(f"\n{L['id']}:"); [print("  -", x) for x in errs]
    if failed:
        raise SystemExit("copy checks failed")
    images = build_main_images()
    plan_thumbs()
    modules = sorted(str(p.relative_to(KIT)) for p in MOD.glob("*.png"))
    if not no_browser:
        modules = render_modules()
    write_json(stats, images, modules)
    write_csv()
    write_html(stats, modules)
    if not no_browser:
        pdf = write_pdf()
        print(f"PDF {pdf.stat().st_size / 1e6:.2f} MB")
    for L in LISTINGS:
        s = stats[L["id"]]
        print(f"{L['id']:30} titles {s['title_short_chars']}/{s['title_medium_chars']}/{s['title_long_chars']}  bullets {max(s['bullet_chars'])} max  desc {s['description_words']}w")


if __name__ == "__main__":
    main()
